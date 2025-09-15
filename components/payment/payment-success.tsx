"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Calendar, Mail, Copy } from "lucide-react"
import Link from "next/link"

interface PaymentSuccessProps {
  bookingData: any
  paymentData: any
}

export function PaymentSuccess({ bookingData, paymentData }: PaymentSuccessProps) {
  const handleDownloadReceipt = () => {
    // TODO: Generate and download PDF receipt
    console.log("Downloading receipt...")
  }

  const handleCopyBookingCode = () => {
    navigator.clipboard.writeText(bookingData.booking.bookingCode)
    // TODO: Show toast notification
    alert("Booking code copied to clipboard!")
  }

  const handleAddToCalendar = () => {
    // TODO: Generate calendar event
    const event = {
      title: `${bookingData.booking.spaceName} Booking`,
      start: new Date(bookingData.booking.bookingDate),
      duration: bookingData.booking.duration,
      location: bookingData.booking.spaceAddress,
    }
    console.log("Adding to calendar:", event)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your booking has been confirmed. You'll receive a confirmation email shortly.
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Booking Confirmation</h3>
            <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Booking Code:</span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-mono font-bold text-primary text-lg">{bookingData.booking.bookingCode}</span>
                <Button variant="ghost" size="sm" onClick={handleCopyBookingCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Payment ID:</span>
              <p className="font-mono text-sm mt-1">{paymentData.razorpay_payment_id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Space:</span>
              <p className="font-medium mt-1">{bookingData.booking.spaceName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date & Time:</span>
              <p className="font-medium mt-1">
                {new Date(bookingData.booking.bookingDate).toLocaleDateString()} at {bookingData.booking.timeSlot?.time || 'TBD'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <p className="font-medium mt-1">{bookingData.booking.duration} hour(s)</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Paid:</span>
              <p className="font-bold text-primary text-lg mt-1">₹{bookingData.booking.totalAmount}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Customer Details</h4>
            <div className="text-sm text-muted-foreground">
              <p>{bookingData.booking.customerDetails.name}</p>
              <p>{bookingData.booking.customerDetails.email}</p>
              <p>{bookingData.booking.customerDetails.phone}</p>
              {bookingData.booking.customerDetails.organization && (
                <p>{bookingData.booking.customerDetails.organization}</p>
              )}
            </div>
          </div>

          {bookingData.booking.customerDetails.purpose && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Purpose</h4>
                <p className="text-sm text-muted-foreground">{bookingData.booking.customerDetails.purpose}</p>
              </div>
            </>
          )}

          {bookingData.booking.customerDetails.specialRequests && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Special Requests</h4>
                <p className="text-sm text-muted-foreground">{bookingData.booking.customerDetails.specialRequests}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" onClick={handleDownloadReceipt}>
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
        <Button variant="outline" onClick={handleAddToCalendar}>
          <Calendar className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
        <Button variant="outline" asChild>
          <Link href={`mailto:${bookingData.booking.customerDetails.email}`}>
            <Mail className="mr-2 h-4 w-4" />
            Email Details
          </Link>
        </Button>
      </div>

      {/* Next Steps */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">What's Next?</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Check your email</p>
                <p className="text-muted-foreground">
                  We've sent a confirmation email with all the details and your booking code.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Arrive on time</p>
                <p className="text-muted-foreground">
                  Please arrive at the scheduled time and present your booking code for check-in.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Need to cancel?</p>
                <p className="text-muted-foreground">
                  Free cancellation up to 24 hours before your booking. Visit your bookings page to cancel.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/dashboard/consumer/bookings">
          <Button className="bg-primary hover:bg-primary/90">View My Bookings</Button>
        </Link>
        <Link href="/spaces">
          <Button variant="outline">Book Another Space</Button>
        </Link>
      </div>
    </div>
  )
}
