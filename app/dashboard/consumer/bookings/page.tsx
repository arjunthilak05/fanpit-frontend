"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Calendar, Clock, MapPin, MoreVertical, Download, X, Star, Loader2 } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { BookingsService } from "@/lib/api/bookings"
import { toast } from "sonner"

// Prevent static generation for this page since it requires authentication
export const dynamic = 'force-dynamic'

export default function ConsumerBookingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to continue</p>
          <Button onClick={() => router.push('/auth')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setIsLoading(true)
      const myBookings = await BookingsService.getMyBookings()
      setBookings(myBookings)
    } catch (error: any) {
      console.error('Failed to load bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      return
    }

    try {
      await BookingsService.cancelBooking(bookingId, "Cancelled by user")
      toast.success("Booking cancelled successfully")
      // Reload bookings to reflect the change
      loadBookings()
    } catch (error: any) {
      console.error('Failed to cancel booking:', error)
      toast.error(error.message || "Failed to cancel booking")
    }
  }

  const handleDownloadReceipt = async (bookingId: string) => {
    try {
      // This would typically call an API to generate and download a receipt
      toast.info("Receipt download feature coming soon")
    } catch (error: any) {
      console.error('Failed to download receipt:', error)
      toast.error("Failed to download receipt")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "checked_in":
        return "bg-blue-100 text-blue-800"
      case "checked_out":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no_show":
        return "bg-orange-100 text-orange-800"
      case "refunded":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBookingType = (booking: any) => {
    const bookingDate = new Date(booking.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (bookingDate >= today && booking.status === "confirmed") {
      return "upcoming"
    }
    return "past"
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.spaceId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "upcoming" && getBookingType(booking) === "upcoming") ||
      (activeTab === "past" && getBookingType(booking) === "past")
    return matchesSearch && matchesTab
  })

  const BookingCard = ({ booking }: { booking: any }) => {
    const bookingType = getBookingType(booking)
    const formatStatus = (status: string) => {
      return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Image
              src={booking.spaceId.images?.[0] || "/placeholder.svg"}
              alt={booking.spaceId.name}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-lg"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{booking.spaceId.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {booking.spaceId.location?.address?.street || 'Location not specified'}
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {booking.startTime} - {booking.endTime} ({booking.duration}h)
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className={getStatusColor(booking.status)}>{formatStatus(booking.status)}</Badge>
                    <span className="text-sm font-mono text-muted-foreground">{booking.bookingCode}</span>
                  </div>
                  {booking.feedbackRequested && (
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-muted-foreground mr-2">Feedback requested</span>
                    </div>
                  )}
                </div>

                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-primary">₹{booking.priceBreakdown.totalAmount}</p>
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
                      {booking.status === "confirmed" && bookingType === "upcoming" && (
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
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="flex-1 ml-64 overflow-auto">
          <div className="p-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

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
