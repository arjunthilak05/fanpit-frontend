"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Shield, CheckCircle, XCircle, IndianRupee } from "lucide-react"
import { createOrder, verifyPayment } from "@/lib/api/payments";
import { getApiUrl } from "@/lib/config";

interface RazorpayCheckoutProps {
  bookingData: {
    space: any
    selectedDate: Date
    selectedTimeSlot: any
    duration: number
    customerDetails: any
    appliedPromoCode?: any
    total: number
  }
  onPaymentSuccess: (paymentData: any) => void
  onPaymentFailure: (error: any) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export function RazorpayCheckout({ bookingData, onPaymentSuccess, onPaymentFailure }: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [error, setError] = useState<string>("")

  // Load Razorpay script
  useEffect(() => {
    if (typeof document === 'undefined') return
    
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handlePayment = async () => {
    if (typeof window === 'undefined' || !window.Razorpay) {
      setError("Payment gateway not loaded. Please refresh and try again.")
      return
    }

    setIsLoading(true)
    setPaymentStatus("processing")
    setError("")

    try {
      // First create the booking with pending status
      const bookingResponse = await fetch(getApiUrl('/bookings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          spaceId: bookingData.space.id,
          startTime: new Date(bookingData.selectedDate.toISOString().split('T')[0] + 'T' + bookingData.selectedTimeSlot.startTime).toISOString(),
          endTime: new Date(bookingData.selectedDate.toISOString().split('T')[0] + 'T' + bookingData.selectedTimeSlot.endTime).toISOString(),
          customerDetails: bookingData.customerDetails,
          specialRequests: bookingData.customerDetails.specialRequests,
          status: 'pending',
          totalAmount: bookingData.total,
        }),
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await bookingResponse.json();

      // Now create the Razorpay order
      const order = await createOrder({ 
        bookingId: booking.id,
        amount: Math.round(bookingData.total * 100), // Convert to paise
        currency: "INR",
        customerDetails: bookingData.customerDetails
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_1234567890",
        amount: order.amount,
        currency: order.currency,
        name: "Fanpit Spaces",
        description: `Booking for ${bookingData.space.name}`,
        image: "/images/logo-transparent.png",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on server
            const verificationResult = await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              bookingId: booking.id,
            });

            setPaymentStatus("success")
            onPaymentSuccess({
              ...response,
              ...verificationResult,
            })
          } catch (error) {
            console.error("Payment verification error:", error)
            setPaymentStatus("failed")
            setError("Payment verification failed. Please contact support.")
            onPaymentFailure(error)
          }
        },
        prefill: {
          name: bookingData.customerDetails.name,
          email: bookingData.customerDetails.email,
          contact: bookingData.customerDetails.phone,
        },
        notes: {
          space_id: bookingData.space.id,
          booking_date: bookingData.selectedDate.toISOString(),
          duration: bookingData.duration,
        },
        theme: {
          color: "#8C52FF", // Fanpit purple
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
            setPaymentStatus("idle")
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on("payment.failed", (response: any) => {
        setPaymentStatus("failed")
        setError(response.error.description || "Payment failed")
        onPaymentFailure(response.error)
      })

      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentStatus("failed")
      setError("Failed to initiate payment. Please try again.")
      onPaymentFailure(error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateSubtotal = () => {
    return bookingData.selectedTimeSlot.price * bookingData.duration
  }

  const calculatePromoDiscount = () => {
    if (!bookingData.appliedPromoCode) return 0
    const subtotal = calculateSubtotal()
    return bookingData.appliedPromoCode.type === "percentage"
      ? (subtotal * bookingData.appliedPromoCode.discount) / 100
      : bookingData.appliedPromoCode.discount
  }

  const calculateTaxes = () => {
    const subtotal = calculateSubtotal()
    const discount = calculatePromoDiscount()
    return (subtotal - discount) * 0.18 // 18% GST
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>Payment Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Booking Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Space:</span>
              <span className="text-sm font-medium">{bookingData.space.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="text-sm font-medium">{bookingData.selectedDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Time:</span>
              <span className="text-sm font-medium">{bookingData.selectedTimeSlot.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Duration:</span>
              <span className="text-sm font-medium">{bookingData.duration} hour(s)</span>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Subtotal</span>
              <span className="text-sm">₹{calculateSubtotal().toFixed(2)}</span>
            </div>

            {bookingData.appliedPromoCode && (
              <div className="flex justify-between text-green-600">
                <span className="text-sm">Discount ({bookingData.appliedPromoCode.code})</span>
                <span className="text-sm">-₹{calculatePromoDiscount().toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-sm">Taxes & Fees (18%)</span>
              <span className="text-sm">₹{calculateTaxes().toFixed(2)}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span className="text-primary">₹{bookingData.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Status */}
      {paymentStatus === "processing" && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Processing your payment. Please do not close this window.</AlertDescription>
        </Alert>
      )}

      {paymentStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Payment successful! Your booking is confirmed.</AlertDescription>
        </Alert>
      )}

      {paymentStatus === "failed" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error || "Payment failed. Please try again."}</AlertDescription>
        </Alert>
      )}

      {/* Security Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Your payment is secured by Razorpay with 256-bit SSL encryption</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={isLoading || paymentStatus === "processing" || paymentStatus === "success"}
        className="w-full bg-primary hover:bg-primary/90"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <IndianRupee className="mr-2 h-4 w-4" />
            Pay ₹{bookingData.total.toFixed(2)}
          </>
        )}
      </Button>

      {/* Payment Methods */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-2">Accepted payment methods:</p>
        <div className="flex justify-center space-x-2">
          <Badge variant="outline" className="text-xs">
            Credit Card
          </Badge>
          <Badge variant="outline" className="text-xs">
            Debit Card
          </Badge>
          <Badge variant="outline" className="text-xs">
            Net Banking
          </Badge>
          <Badge variant="outline" className="text-xs">
            UPI
          </Badge>
          <Badge variant="outline" className="text-xs">
            Wallets
          </Badge>
        </div>
      </div>
    </div>
  )
}