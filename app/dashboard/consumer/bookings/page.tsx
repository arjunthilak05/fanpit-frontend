"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Calendar, Clock, MapPin, MoreVertical, Download, X, Star } from "lucide-react"
import Image from "next/image"

// Mock data
const mockUser = {
  name: "John Doe",
  role: "consumer" as const,
  avatar: "/placeholder.svg?key=user1",
}

const mockBookings = [
  {
    id: "1",
    spaceName: "Modern Co-working Hub",
    spaceImage: "/modern-coworking-space.png",
    location: "Downtown, Mumbai",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: 4,
    totalAmount: 2000,
    status: "confirmed",
    bookingCode: "FP12345678",
    paymentId: "pay_123456789",
    type: "upcoming",
  },
  {
    id: "2",
    spaceName: "Creative Event Space",
    spaceImage: "/creative-event-space.jpg",
    location: "Bandra, Mumbai",
    date: "2024-01-18",
    time: "2:00 PM",
    duration: 6,
    totalAmount: 12000,
    status: "confirmed",
    bookingCode: "FP87654321",
    paymentId: "pay_987654321",
    type: "upcoming",
  },
  {
    id: "3",
    spaceName: "Tech Conference Hall",
    spaceImage: "/tech-conference-hall.png",
    location: "Powai, Mumbai",
    date: "2024-01-05",
    time: "9:00 AM",
    duration: 8,
    totalAmount: 12000,
    status: "completed",
    bookingCode: "FP11223344",
    paymentId: "pay_112233445",
    type: "past",
    rating: 5,
  },
  {
    id: "4",
    spaceName: "Casual Meetup Lounge",
    spaceImage: "/casual-meetup-lounge.jpg",
    location: "Andheri, Mumbai",
    date: "2023-12-20",
    time: "3:00 PM",
    duration: 3,
    totalAmount: 900,
    status: "completed",
    bookingCode: "FP55667788",
    paymentId: "pay_556677889",
    type: "past",
    rating: 4,
  },
  {
    id: "5",
    spaceName: "Executive Boardroom",
    spaceImage: "/placeholder.svg?key=exec1",
    location: "BKC, Mumbai",
    date: "2023-12-10",
    time: "11:00 AM",
    duration: 2,
    totalAmount: 1600,
    status: "cancelled",
    bookingCode: "FP99887766",
    paymentId: "pay_998877665",
    type: "past",
  },
]

export default function ConsumerBookingsPage() {
  const [user] = useState(mockUser)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      console.log("Cancelling booking:", bookingId)
    }
  }

  const handleDownloadReceipt = (bookingId: string) => {
    console.log("Downloading receipt for booking:", bookingId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.spaceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "upcoming" && booking.type === "upcoming") ||
      (activeTab === "past" && booking.type === "past")
    return matchesSearch && matchesTab
  })

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Image
            src={booking.spaceImage || "/placeholder.svg"}
            alt={booking.spaceName}
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-lg"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{booking.spaceName}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {booking.location}
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {booking.time} ({booking.duration}h)
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  <span className="text-sm font-mono text-muted-foreground">{booking.bookingCode}</span>
                </div>
                {booking.rating && (
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-muted-foreground mr-2">Your rating:</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < booking.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-right ml-4">
                <p className="text-lg font-bold text-primary">₹{booking.totalAmount}</p>
                <p className="text-sm text-muted-foreground">Total paid</p>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="mt-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDownloadReceipt(booking.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </DropdownMenuItem>
                    {booking.status === "confirmed" && booking.type === "upcoming" && (
                      <DropdownMenuItem onClick={() => handleCancelBooking(booking.id)} className="text-destructive">
                        <X className="mr-2 h-4 w-4" />
                        Cancel Booking
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">Manage your space bookings and view history</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {filteredBookings.filter((b) => b.type === "upcoming").length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground">Book a space to see it here</p>
                </div>
              ) : (
                filteredBookings
                  .filter((b) => b.type === "upcoming")
                  .map((booking) => <BookingCard key={booking.id} booking={booking} />)
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {filteredBookings.filter((b) => b.type === "past").length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No past bookings</h3>
                  <p className="text-muted-foreground">Your booking history will appear here</p>
                </div>
              ) : (
                filteredBookings
                  .filter((b) => b.type === "past")
                  .map((booking) => <BookingCard key={booking.id} booking={booking} />)
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms</p>
                </div>
              ) : (
                filteredBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
