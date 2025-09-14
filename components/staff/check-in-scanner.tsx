"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { QrCode, Search, CheckCircle, XCircle, Clock, User, MapPin } from "lucide-react"

interface Booking {
  id: string
  bookingCode: string
  customerName: string
  customerEmail: string
  spaceName: string
  date: string
  timeSlot: string
  duration: number
  status: "confirmed" | "checked-in" | "checked-out" | "no-show"
  amount: number
  checkInTime?: string
  checkOutTime?: string
}

export function CheckInScanner() {
  const [bookingCode, setBookingCode] = useState("")
  const [searchResults, setSearchResults] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock bookings data
  const mockBookings: Booking[] = [
    {
      id: "1",
      bookingCode: "FP001234",
      customerName: "Rahul Sharma",
      customerEmail: "rahul@example.com",
      spaceName: "Creative Hub - Main Floor",
      date: "2024-09-14",
      timeSlot: "10:00 AM - 2:00 PM",
      duration: 4,
      status: "confirmed",
      amount: 2400,
    },
    {
      id: "2",
      bookingCode: "FP001235",
      customerName: "Priya Patel",
      customerEmail: "priya@example.com",
      spaceName: "Quiet Zone - Desk 5",
      date: "2024-09-14",
      timeSlot: "9:00 AM - 12:00 PM",
      duration: 3,
      status: "checked-in",
      amount: 1500,
      checkInTime: "9:15 AM",
    },
  ]

  const searchBooking = () => {
    if (!bookingCode.trim()) return

    const results = mockBookings.filter(
      (booking) =>
        booking.bookingCode.toLowerCase().includes(bookingCode.toLowerCase()) ||
        booking.customerName.toLowerCase().includes(bookingCode.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(bookingCode.toLowerCase()),
    )

    setSearchResults(results)
    if (results.length === 1) {
      setSelectedBooking(results[0])
    }
  }

  const handleCheckIn = (booking: Booking) => {
    const updatedBooking = {
      ...booking,
      status: "checked-in" as const,
      checkInTime: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }
    setSelectedBooking(updatedBooking)
    // Here you would typically update the booking in your database
  }

  const handleCheckOut = (booking: Booking) => {
    const updatedBooking = {
      ...booking,
      status: "checked-out" as const,
      checkOutTime: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }
    setSelectedBooking(updatedBooking)
    // Here you would typically update the booking in your database
  }

  const markNoShow = (booking: Booking) => {
    const updatedBooking = {
      ...booking,
      status: "no-show" as const,
    }
    setSelectedBooking(updatedBooking)
    // Here you would typically update the booking in your database
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "checked-in":
        return "bg-green-100 text-green-800"
      case "checked-out":
        return "bg-gray-100 text-gray-800"
      case "no-show":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Clock className="h-4 w-4" />
      case "checked-in":
        return <CheckCircle className="h-4 w-4" />
      case "checked-out":
        return <CheckCircle className="h-4 w-4" />
      case "no-show":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
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
            <Button onClick={searchBooking} className="px-6">
              <Search className="h-4 w-4 mr-2" />
              Search
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
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-sm text-gray-600">{booking.bookingCode}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status.replace("-", " ")}</span>
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
                    <span className="ml-1 capitalize">{selectedBooking.status.replace("-", " ")}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{selectedBooking.customerName}</p>
                        <p className="text-sm text-gray-600">{selectedBooking.customerEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{selectedBooking.spaceName}</p>
                        <p className="text-sm text-gray-600">Booking: {selectedBooking.bookingCode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{selectedBooking.date}</p>
                        <p className="text-sm text-gray-600">{selectedBooking.timeSlot}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium">Amount: ₹{selectedBooking.amount}</p>
                      <p className="text-sm text-gray-600">Duration: {selectedBooking.duration} hours</p>
                    </div>
                  </div>
                </div>

                {selectedBooking.checkInTime && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Checked in:</strong> {selectedBooking.checkInTime}
                    </p>
                  </div>
                )}

                {selectedBooking.checkOutTime && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-800">
                      <strong>Checked out:</strong> {selectedBooking.checkOutTime}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {selectedBooking.status === "confirmed" && (
                    <>
                      <Button onClick={() => handleCheckIn(selectedBooking)} className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Check In
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => markNoShow(selectedBooking)}
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Mark No-Show
                      </Button>
                    </>
                  )}

                  {selectedBooking.status === "checked-in" && (
                    <Button onClick={() => handleCheckOut(selectedBooking)} className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Check Out
                    </Button>
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
