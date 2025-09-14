"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, CreditCard, Clock, Star, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data
const mockUser = {
  name: "John Doe",
  role: "consumer" as const,
  avatar: "/placeholder.svg?key=user1",
}

const mockStats = [
  {
    title: "Total Bookings",
    value: 12,
    change: { value: 20, type: "increase" as const, period: "from last month" },
    icon: Calendar,
    description: "Bookings made this month",
  },
  {
    title: "Favorite Spaces",
    value: 8,
    icon: MapPin,
    description: "Spaces you've saved",
  },
  {
    title: "Total Spent",
    value: "₹15,240",
    change: { value: 15, type: "increase" as const, period: "from last month" },
    icon: CreditCard,
    description: "Amount spent on bookings",
  },
  {
    title: "Hours Booked",
    value: 48,
    change: { value: 25, type: "increase" as const, period: "from last month" },
    icon: Clock,
    description: "Total hours this month",
  },
]

const mockUpcomingBookings = [
  {
    id: "1",
    spaceName: "Modern Co-working Hub",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: 4,
    status: "confirmed",
    image: "/modern-coworking-space.png",
    bookingCode: "FP12345678",
  },
  {
    id: "2",
    spaceName: "Creative Event Space",
    date: "2024-01-18",
    time: "2:00 PM",
    duration: 6,
    status: "confirmed",
    image: "/creative-event-space.jpg",
    bookingCode: "FP87654321",
  },
  {
    id: "3",
    spaceName: "Tech Conference Hall",
    date: "2024-01-22",
    time: "9:00 AM",
    duration: 8,
    status: "pending",
    image: "/tech-conference-hall.png",
    bookingCode: "FP11223344",
  },
]

const mockRecentSpaces = [
  {
    id: "1",
    name: "Modern Co-working Hub",
    location: "Downtown, Mumbai",
    rating: 4.8,
    price: 500,
    image: "/modern-coworking-space.png",
  },
  {
    id: "2",
    name: "Creative Event Space",
    location: "Bandra, Mumbai",
    rating: 4.9,
    price: 2000,
    image: "/creative-event-space.jpg",
  },
  {
    id: "3",
    name: "Tech Conference Hall",
    location: "Powai, Mumbai",
    rating: 4.7,
    price: 1500,
    image: "/tech-conference-hall.png",
  },
]

export default function ConsumerDashboard() {
  const [user] = useState(mockUser)

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logging out...")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your bookings</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mockStats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Upcoming Bookings</CardTitle>
                <Link href="/dashboard/consumer/bookings">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUpcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <Image
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.spaceName}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{booking.spaceName}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {booking.duration} hours
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{booking.bookingCode}</p>
                    </div>
                  </div>
                ))}
                {mockUpcomingBookings.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No upcoming bookings</p>
                    <Link href="/spaces">
                      <Button className="mt-4 bg-primary hover:bg-primary/90">Book a Space</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recently Viewed Spaces */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recently Viewed</CardTitle>
                <Link href="/spaces">
                  <Button variant="ghost" size="sm">
                    Browse All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecentSpaces.map((space) => (
                  <Link key={space.id} href={`/spaces/${space.id}`}>
                    <div className="flex items-center space-x-4 p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <Image
                        src={space.image || "/placeholder.svg"}
                        alt={space.name}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{space.name}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {space.location}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                          <span>{space.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">₹{space.price}</p>
                        <p className="text-xs text-muted-foreground">per hour</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/spaces">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <MapPin className="h-6 w-6" />
                    <span>Browse Spaces</span>
                  </Button>
                </Link>
                <Link href="/dashboard/consumer/bookings">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <Calendar className="h-6 w-6" />
                    <span>View Bookings</span>
                  </Button>
                </Link>
                <Link href="/dashboard/consumer/favorites">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <Star className="h-6 w-6" />
                    <span>Saved Spaces</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
