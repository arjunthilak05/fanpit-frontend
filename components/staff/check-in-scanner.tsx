"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { QrCode, Search, CheckCircle, XCircle, Clock, User, MapPin, Loader2 } from "lucide-react"
import { BookingsService } from "@/lib/api/bookings"
import { toast } from "sonner"

interface Booking {
  id: string
  bookingCode: string
  userId: {
    name: string
    email: string
  }
  spaceId: {
    name: string
  }
  date: string
  startTime: string
  endTime: string
  duration: number
  status: "confirmed" | "checked_in" | "checked_out" | "no_show" | "cancelled" | "refunded"
  paymentStatus: string
  priceBreakdown: {
    totalAmount: number
  }
  checkInDetails?: {
    checkedInAt: string
  }
  checkOutDetails?: {
    checkedOutAt: string
  }
}

export function CheckInScanner() {
  const [bookingCode, setBookingCode] = useState("")
  const [searchResults, setSearchResults] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const searchBooking = async () => {
    if (!bookingCode.trim()) return

    setIsSearching(true)
    try {
      // For now, we'll search today's bookings
      // In a real implementation, you might want to search all bookings
      const todaysBookings = await BookingsService.getTodaysBookings()

      const results = todaysBookings.filter(
        (booking: any) =>
          booking.bookingCode.toLowerCase().includes(bookingCode.toLowerCase()) ||
          booking.userId.name.toLowerCase().includes(bookingCode.toLowerCase()) ||
          booking.userId.email.toLowerCase().includes(bookingCode.toLowerCase()),
      )

      setSearchResults(results)
      if (results.length === 1) {
        setSelectedBooking(results[0])
      } else if (results.length === 0) {
        toast.error("No booking found with that code, name, or email")
      }
    } catch (error: any) {
      console.error('Search error:', error)
      toast.error(error.message || "Failed to search bookings")
    } finally {
      setIsSearching(false)
    }
  }

  const handleCheckIn = async (booking: Booking) => {
    setIsLoading(true)
    try {
      const updatedBooking = await BookingsService.checkInGuest(booking.id, "Guest checked in by staff")
      setSelectedBooking(updatedBooking)
      toast.success("Guest checked in successfully!")
    } catch (error: any) {
      console.error('Check-in error:', error)
      toast.error(error.message || "Failed to check in guest")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckOut = async (booking: Booking) => {
    setIsLoading(true)
    try {
      const updatedBooking = await BookingsService.checkOutGuest(booking.id, "Guest checked out by staff")
      setSelectedBooking(updatedBooking)
      toast.success("Guest checked out successfully!")
    } catch (error: any) {
      console.error('Check-out error:', error)
      toast.error(error.message || "Failed to check out guest")
    } finally {
      setIsLoading(false)
    }
  }

  const markNoShow = async (booking: Booking) => {
    setIsLoading(true)
    try {
      // Note: We might need to add a specific API endpoint for marking no-show
      // For now, we'll use the check-out endpoint with a special note
      const updatedBooking = await BookingsService.checkOutGuest(booking.id, "Marked as no-show by staff")
      setSelectedBooking(updatedBooking)
      toast.success("Booking marked as no-show")
    } catch (error: any) {
      console.error('Mark no-show error:', error)
      toast.error(error.message || "Failed to mark as no-show")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "checked_in":
        return "bg-green-100 text-green-800"
      case "checked_out":
        return "bg-gray-100 text-gray-800"
      case "no_show":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Clock className="h-4 w-4" />
      case "checked_in":
        return <CheckCircle className="h-4 w-4" />
      case "checked_out":
        return <CheckCircle className="h-4 w-4" />
      case "no_show":
        return <XCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "refunded":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-purple-600" />
            Check-In Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Enter booking code, name, or email..."
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchBooking()}
              className="flex-1"
            />
            <Button onClick={searchBooking} className="px-6" disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {searchResults.length > 0 && !selectedBooking && (
            <div className="space-y-2">
              <h3 className="font-semibold">Search Results</h3>
              {searchResults.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.userId.name}</p>
                      <p className="text-sm text-gray-600">{booking.bookingCode}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1">{formatStatus(booking.status)}</span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedBooking && (
            <div className="space-y-4">
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Booking Details</h3>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {getStatusIcon(selectedBooking.status)}
                    <span className="ml-1">{formatStatus(selectedBooking.status)}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{selectedBooking.userId.name}</p>
                        <p className="text-sm text-gray-600">{selectedBooking.userId.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{selectedBooking.spaceId.name}</p>
                        <p className="text-sm text-gray-600">Booking: {selectedBooking.bookingCode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium">Amount: ₹{selectedBooking.priceBreakdown.totalAmount}</p>
                      <p className="text-sm text-gray-600">Duration: {selectedBooking.duration} hours</p>
                    </div>
                  </div>
                </div>

                {selectedBooking.checkInDetails && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Checked in:</strong> {new Date(selectedBooking.checkInDetails.checkedInAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {selectedBooking.checkOutDetails && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-800">
                      <strong>Checked out:</strong> {new Date(selectedBooking.checkOutDetails.checkedOutAt).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {selectedBooking.status === "confirmed" && (
                    <>
                      <Button
                        onClick={() => handleCheckIn(selectedBooking)}
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        {isLoading ? "Checking In..." : "Check In"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => markNoShow(selectedBooking)}
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        {isLoading ? "Updating..." : "Mark No-Show"}
                      </Button>
                    </>
                  )}

                  {selectedBooking.status === "checked_in" && (
                    <Button
                      onClick={() => handleCheckOut(selectedBooking)}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      {isLoading ? "Checking Out..." : "Check Out"}
                    </Button>
                  )}

                  {(selectedBooking.status === "checked_out" || selectedBooking.status === "no_show") && (
                    <div className="flex-1 text-center text-sm text-muted-foreground py-2">
                      Booking {formatStatus(selectedBooking.status).toLowerCase()}
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedBooking(null)
                    setSearchResults([])
                    setBookingCode("")
                  }}
                  className="w-full"
                >
                  Search Another Booking
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
