"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckSquare, Clock, Users, AlertTriangle, Search, QrCode, UserCheck, UserX, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data
const mockUser = {
  name: "Mike Wilson",
  role: "staff" as const,
  avatar: "/placeholder.svg?key=staff1",
}

const mockStats = [
  {
    title: "Today's Check-ins",
    value: 8,
    change: { value: 14, type: "increase" as const, period: "from yesterday" },
    icon: CheckSquare,
    description: "Completed check-ins",
  },
  {
    title: "Pending Arrivals",
    value: 5,
    icon: Clock,
    description: "Expected today",
  },
  {
    title: "Active Guests",
    value: 12,
    change: { value: 8, type: "increase" as const, period: "from yesterday" },
    icon: Users,
    description: "Currently in spaces",
  },
  {
    title: "Issues Reported",
    value: 2,
    icon: AlertTriangle,
    description: "Require attention",
  },
]

const mockTodaySchedule = [
  {
    id: "1",
    bookingCode: "FP12345678",
    spaceName: "Modern Co-working Hub",
    customerName: "John Doe",
    time: "10:00 AM",
    duration: 4,
    status: "checked-in",
    checkInTime: "9:55 AM",
  },
  {
    id: "2",
    bookingCode: "FP87654321",
    spaceName: "Creative Event Space",
    customerName: "Jane Smith",
    time: "2:00 PM",
    duration: 6,
    status: "pending",
  },
  {
    id: "3",
    bookingCode: "FP11223344",
    spaceName: "Tech Conference Hall",
    customerName: "Mike Johnson",
    time: "9:00 AM",
    duration: 8,
    status: "no-show",
  },
  {
    id: "4",
    bookingCode: "FP55667788",
    spaceName: "Casual Meetup Lounge",
    customerName: "Sarah Wilson",
    time: "3:00 PM",
    duration: 3,
    status: "pending",
  },
  {
    id: "5",
    bookingCode: "FP99887766",
    spaceName: "Executive Boardroom",
    customerName: "David Brown",
    time: "11:00 AM",
    duration: 2,
    status: "checked-out",
    checkInTime: "10:58 AM",
    checkOutTime: "1:05 PM",
  },
]

const mockAssignedSpaces = [
  {
    id: "1",
    name: "Modern Co-working Hub",
    location: "Downtown, Mumbai",
    image: "/modern-coworking-space.png",
    currentOccupancy: 15,
    maxCapacity: 50,
    todayBookings: 6,
    activeGuests: 3,
  },
  {
    id: "2",
    name: "Creative Event Space",
    location: "Bandra, Mumbai",
    image: "/creative-event-space.jpg",
    currentOccupancy: 0,
    maxCapacity: 100,
    todayBookings: 2,
    activeGuests: 0,
  },
  {
    id: "3",
    name: "Tech Conference Hall",
    location: "Powai, Mumbai",
    image: "/tech-conference-hall.png",
    currentOccupancy: 45,
    maxCapacity: 200,
    todayBookings: 3,
    activeGuests: 1,
  },
]

export default function StaffDashboard() {
  const [user] = useState(mockUser)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const handleCheckIn = (bookingId: string) => {
    console.log("Checking in booking:", bookingId)
  }

  const handleCheckOut = (bookingId: string) => {
    console.log("Checking out booking:", bookingId)
  }

  const handleMarkNoShow = (bookingId: string) => {
    console.log("Marking as no-show:", bookingId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "checked-in":
        return "bg-green-100 text-green-800"
      case "checked-out":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "no-show":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredSchedule = mockTodaySchedule.filter(
    (booking) =>
      booking.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.spaceName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Staff Dashboard</h1>
            <p className="text-muted-foreground">Manage check-ins and monitor space occupancy</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mockStats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Schedule */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Today's Schedule</CardTitle>
                <Link href="/dashboard/staff/checkins">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Schedule List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredSchedule.map((booking) => (
                    <div key={booking.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-mono text-sm font-medium">{booking.bookingCode}</span>
                            <Badge className={getStatusColor(booking.status)}>{booking.status.replace("-", " ")}</Badge>
                          </div>
                          <h4 className="font-medium">{booking.spaceName}</h4>
                          <p className="text-sm text-muted-foreground">by {booking.customerName}</p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                            <span>
                              {booking.time} ({booking.duration}h)
                            </span>
                            {booking.checkInTime && <span>Checked in: {booking.checkInTime}</span>}
                            {booking.checkOutTime && <span>Checked out: {booking.checkOutTime}</span>}
                          </div>
                        </div>

                        <div className="flex space-x-1 ml-4">
                          {booking.status === "pending" && (
                            <>
                              <Button size="sm" onClick={() => handleCheckIn(booking.id)}>
                                <UserCheck className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleMarkNoShow(booking.id)}>
                                <UserX className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {booking.status === "checked-in" && (
                            <Button size="sm" variant="outline" onClick={() => handleCheckOut(booking.id)}>
                              <UserX className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Assigned Spaces */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Assigned Spaces</CardTitle>
                <Link href="/dashboard/staff/spaces">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAssignedSpaces.map((space) => (
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
                        <h4 className="font-medium truncate">{space.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{space.location}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Occupancy:</span>
                            <p className="font-medium">
                              {space.currentOccupancy}/{space.maxCapacity}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Today's Bookings:</span>
                            <p className="font-medium">{space.todayBookings}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{space.activeGuests} active guests</span>
                          </div>
                          <Badge
                            variant={space.currentOccupancy > 0 ? "default" : "secondary"}
                            className={space.currentOccupancy > 0 ? "bg-green-100 text-green-800" : ""}
                          >
                            {space.currentOccupancy > 0 ? "Occupied" : "Available"}
                          </Badge>
                        </div>
                      </div>
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
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <QrCode className="h-6 w-6" />
                  <span>Scan QR Code</span>
                </Button>
                <Link href="/dashboard/staff/checkins">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <CheckSquare className="h-6 w-6" />
                    <span>Manual Check-in</span>
                  </Button>
                </Link>
                <Link href="/dashboard/staff/schedule">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <Clock className="h-6 w-6" />
                    <span>View Schedule</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                >
                  <AlertTriangle className="h-6 w-6" />
                  <span>Report Issue</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
