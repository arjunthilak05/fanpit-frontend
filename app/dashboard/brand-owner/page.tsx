"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, IndianRupee, TrendingUp, Clock, ArrowRight, Plus, Eye, Edit } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data
const mockUser = {
  name: "Sarah Johnson",
  role: "brand_owner" as const,
  avatar: "/placeholder.svg?key=owner1",
}

const mockStats = [
  {
    title: "Total Spaces",
    value: 5,
    change: { value: 25, type: "increase" as const, period: "from last month" },
    icon: MapPin,
    description: "Active space listings",
  },
  {
    title: "This Month's Bookings",
    value: 47,
    change: { value: 18, type: "increase" as const, period: "from last month" },
    icon: Calendar,
    description: "Total reservations",
  },
  {
    title: "Revenue",
    value: "₹1,24,500",
    change: { value: 32, type: "increase" as const, period: "from last month" },
    icon: IndianRupee,
    description: "Total earnings this month",
  },
  {
    title: "Occupancy Rate",
    value: "78%",
    change: { value: 12, type: "increase" as const, period: "from last month" },
    icon: TrendingUp,
    description: "Average across all spaces",
  },
]

const mockSpaces = [
  {
    id: "1",
    name: "Modern Co-working Hub",
    location: "Downtown, Mumbai",
    image: "/modern-coworking-space.png",
    status: "active",
    bookingsThisMonth: 15,
    revenue: 45000,
    occupancyRate: 85,
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: "2",
    name: "Creative Event Space",
    location: "Bandra, Mumbai",
    image: "/creative-event-space.jpg",
    status: "active",
    bookingsThisMonth: 8,
    revenue: 32000,
    occupancyRate: 65,
    rating: 4.9,
    reviewCount: 18,
  },
  {
    id: "3",
    name: "Tech Conference Hall",
    location: "Powai, Mumbai",
    image: "/tech-conference-hall.png",
    status: "active",
    bookingsThisMonth: 12,
    revenue: 28000,
    occupancyRate: 72,
    rating: 4.7,
    reviewCount: 31,
  },
]

const mockRecentBookings = [
  {
    id: "1",
    spaceName: "Modern Co-working Hub",
    customerName: "John Doe",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: 4,
    amount: 2000,
    status: "confirmed",
  },
  {
    id: "2",
    spaceName: "Creative Event Space",
    customerName: "Jane Smith",
    date: "2024-01-16",
    time: "2:00 PM",
    duration: 6,
    amount: 12000,
    status: "confirmed",
  },
  {
    id: "3",
    spaceName: "Tech Conference Hall",
    customerName: "Mike Johnson",
    date: "2024-01-17",
    time: "9:00 AM",
    duration: 8,
    amount: 12000,
    status: "pending",
  },
]

export default function BrandOwnerDashboard() {
  const [user] = useState(mockUser)

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBookingStatusColor = (status: string) => {
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Manage your spaces and track performance</p>
            </div>
            <Link href="/dashboard/brand-owner/spaces">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add New Space
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mockStats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Space Performance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Space Performance</CardTitle>
                <Link href="/dashboard/brand-owner/spaces">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSpaces.map((space) => (
                  <div key={space.id} className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={space.image || "/placeholder.svg"}
                        alt={space.name}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium truncate">{space.name}</h4>
                          <Badge className={getStatusColor(space.status)}>{space.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{space.location}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Bookings:</span>
                            <p className="font-medium">{space.bookingsThisMonth} this month</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Revenue:</span>
                            <p className="font-medium text-primary">₹{space.revenue.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Occupancy</span>
                            <span className="font-medium">{space.occupancyRate}%</span>
                          </div>
                          <Progress value={space.occupancyRate} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="font-medium">{space.rating}/5</span>
                        <span className="text-muted-foreground">({space.reviewCount} reviews)</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Link href="/dashboard/brand-owner/reservations">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{booking.spaceName}</h4>
                      <p className="text-sm text-muted-foreground">by {booking.customerName}</p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {booking.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹{booking.amount}</p>
                      <Badge className={getBookingStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                  </div>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/dashboard/brand-owner/spaces">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <Plus className="h-6 w-6" />
                    <span>Add Space</span>
                  </Button>
                </Link>
                <Link href="/dashboard/brand-owner/reservations">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <Calendar className="h-6 w-6" />
                    <span>View Reservations</span>
                  </Button>
                </Link>
                <Link href="/dashboard/brand-owner/analytics">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span>Analytics</span>
                  </Button>
                </Link>
                <Link href="/dashboard/brand-owner/earnings">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <IndianRupee className="h-6 w-6" />
                    <span>Earnings</span>
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
