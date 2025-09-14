"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { AvailabilityCalendar } from "@/components/booking/availability-calendar"
import { BookingSummary } from "@/components/booking/booking-summary"
import { BookingForm } from "@/components/booking/booking-form"
import { RazorpayCheckout } from "@/components/payment/razorpay-checkout"
import { PaymentSuccess } from "@/components/payment/payment-success"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

// Mock space data - replace with actual API call
const mockSpace = {
  id: "1",
  name: "Modern Co-working Hub",
  description: "A sleek and modern co-working space perfect for professionals and teams.",
  address: {
    street: "123 Business District",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    coordinates: [19.076, 72.8777],
  },
  capacity: 50,
  category: "business",
  amenities: ["wifi", "coffee", "projector", "ac"],
  images: ["/modern-coworking-space.png"],
  pricing: {
    type: "paid",
    baseRate: 500,
    rateType: "hourly",
    peakMultiplier: 1.5,
    promoCodes: [
      { code: "WELCOME10", discount: 10, type: "percentage" },
      { code: "FIRST50", discount: 50, type: "fixed" },
    ],
  },
  status: "active",
  rating: 4.8,
}

const handleAuthClick = () => {
  // Placeholder for actual authentication logic
  console.log("Auth Clicked")
}

export default function BookSpacePage() {
  const params = useParams()
  const [user, setUser] = useState<any>(null) // TODO: Replace with actual auth state
  const [currentStep, setCurrentStep] = useState<"calendar" | "details" | "payment" | "success">("calendar")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any>()
  const [duration, setDuration] = useState(1)
  const [appliedPromoCode, setAppliedPromoCode] = useState<any>()
  const [bookingFormData, setBookingFormData] = useState<any>()
  const [paymentData, setPaymentData] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)

  const handleTimeSlotSelect = (date: Date, timeSlot: any) => {
    setSelectedDate(date)
    setSelectedTimeSlot(timeSlot)
  }

  const handlePromoCodeApply = (code: string) => {
    // Find promo code in space's available codes
    const promoCode = mockSpace.pricing.promoCodes.find((promo) => promo.code.toLowerCase() === code.toLowerCase())

    if (promoCode) {
      setAppliedPromoCode(promoCode)
    } else {
      // Show error - invalid promo code
      alert("Invalid promo code")
    }
  }

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and time slot")
      return
    }
    setCurrentStep("details")
  }

  const handleBookingSubmit = async (formData: any) => {
    setBookingFormData(formData)
    // Don't create the booking yet - wait for payment success
    setCurrentStep("payment")
  }

  const handlePaymentSuccess = (payment: any) => {
    setPaymentData(payment)
    setCurrentStep("success")
  }

  const handlePaymentFailure = (error: any) => {
    console.error("Payment failed:", error)
    // Stay on payment step to allow retry
  }

  const calculateTotal = () => {
    const basePrice = selectedTimeSlot?.price || 0
    const subtotal = basePrice * duration
    const promoDiscount = appliedPromoCode
      ? appliedPromoCode.type === "percentage"
        ? (subtotal * appliedPromoCode.discount) / 100
        : appliedPromoCode.discount
      : 0
    const taxes = (subtotal - promoDiscount) * 0.18 // 18% GST
    return subtotal - promoDiscount + taxes
  }

  const bookingData = {
    space: mockSpace,
    selectedDate: selectedDate!,
    selectedTimeSlot,
    duration,
    customerDetails: bookingFormData,
    appliedPromoCode,
    total: calculateTotal(),
  }

  const canProceed = selectedDate && selectedTimeSlot

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onAuthClick={handleAuthClick} />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/spaces/${params.id}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Space Details
            </Button>
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                currentStep === "calendar"
                  ? "text-primary"
                  : ["details", "payment", "success"].includes(currentStep)
                    ? "text-green-600"
                    : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "calendar"
                    ? "bg-primary text-primary-foreground"
                    : ["details", "payment", "success"].includes(currentStep)
                      ? "bg-green-600 text-white"
                      : "bg-muted"
                }`}
              >
                {["details", "payment", "success"].includes(currentStep) ? <CheckCircle className="h-4 w-4" /> : "1"}
              </div>
              <span className="font-medium">Select Time</span>
            </div>

            <div
              className={`w-12 h-0.5 ${
                ["details", "payment", "success"].includes(currentStep) ? "bg-green-600" : "bg-muted"
              }`}
            ></div>

            <div
              className={`flex items-center space-x-2 ${
                currentStep === "details"
                  ? "text-primary"
                  : ["payment", "success"].includes(currentStep)
                    ? "text-green-600"
                    : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "details"
                    ? "bg-primary text-primary-foreground"
                    : ["payment", "success"].includes(currentStep)
                      ? "bg-green-600 text-white"
                      : "bg-muted"
                }`}
              >
                {["payment", "success"].includes(currentStep) ? <CheckCircle className="h-4 w-4" /> : "2"}
              </div>
              <span className="font-medium">Booking Details</span>
            </div>

            <div
              className={`w-12 h-0.5 ${["payment", "success"].includes(currentStep) ? "bg-green-600" : "bg-muted"}`}
            ></div>

            <div
              className={`flex items-center space-x-2 ${
                currentStep === "payment"
                  ? "text-primary"
                  : currentStep === "success"
                    ? "text-green-600"
                    : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "payment"
                    ? "bg-primary text-primary-foreground"
                    : currentStep === "success"
                      ? "bg-green-600 text-white"
                      : "bg-muted"
                }`}
              >
                {currentStep === "success" ? <CheckCircle className="h-4 w-4" /> : "3"}
              </div>
              <span className="font-medium">Payment</span>
            </div>

            <div className={`w-12 h-0.5 ${currentStep === "success" ? "bg-green-600" : "bg-muted"}`}></div>

            <div
              className={`flex items-center space-x-2 ${
                currentStep === "success" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "success" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                4
              </div>
              <span className="font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {currentStep === "calendar" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AvailabilityCalendar
                space={mockSpace}
                onTimeSlotSelect={handleTimeSlotSelect}
                selectedDate={selectedDate}
                selectedTimeSlot={selectedTimeSlot}
              />
            </div>
            <div>
              {canProceed && (
                <BookingSummary
                  space={mockSpace}
                  selectedDate={selectedDate!}
                  selectedTimeSlot={selectedTimeSlot}
                  duration={duration}
                  onDurationChange={setDuration}
                  onPromoCodeApply={handlePromoCodeApply}
                  appliedPromoCode={appliedPromoCode}
                  onProceedToPayment={handleProceedToPayment}
                />
              )}
            </div>
          </div>
        )}

        {currentStep === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <BookingForm onSubmit={handleBookingSubmit} isLoading={isLoading} />
            </div>
            <div>
              <BookingSummary
                space={mockSpace}
                selectedDate={selectedDate!}
                selectedTimeSlot={selectedTimeSlot}
                duration={duration}
                onDurationChange={setDuration}
                onPromoCodeApply={handlePromoCodeApply}
                appliedPromoCode={appliedPromoCode}
                onProceedToPayment={() => {}}
              />
            </div>
          </div>
        )}

        {currentStep === "payment" && (
          <div className="max-w-2xl mx-auto">
            <RazorpayCheckout
              bookingData={bookingData}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={handlePaymentFailure}
            />
          </div>
        )}

        {currentStep === "success" && paymentData && (
          <PaymentSuccess bookingData={paymentData} paymentData={paymentData} />
        )}
      </div>
    </div>
  )
}
