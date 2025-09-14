"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter
} from "lucide-react"
import { format } from "date-fns"

// Mock data - replace with actual API calls
const mockUser = {
  id: "1",
  name: "Staff Member",
  email: "staff@example.com",
  role: "staff"
}

const mockTodaysSchedule = [
  {
    id: "1",
    spaceName: "Modern Co-working Hub",
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    customerPhone: "+1234567890",
    startTime: new Date("2024-01-15T09:00:00"),
    endTime: new Date("2024-01-15T17:00:00"),
    guestCount: 5,
    status: "confirmed",
    checkInCode: "ABC123",
    priority: "normal"
  },
  {
    id: "2",
    spaceName: "Creative Event Space",
    customerName: "Bob Smith",
    customerEmail: "bob@example.com",
    customerPhone: "+1234567891",
    startTime: new Date("2024-01-15T14:00:00"),
    endTime: new Date("2024-01-15T18:00:00"),
    guestCount: 20,
    status: "checked-in",
    checkInCode: "DEF456",
    priority: "high"
  },
  {
    id: "3",
    spaceName: "Tech Conference Hall",
    customerName: "Carol Davis",
    customerEmail: "carol@example.com",
    customerPhone: "+1234567892",
    startTime: new Date("2024-01-15T10:00:00"),
    endTime: new Date("2024-01-15T16:00:00"),
    guestCount: 50,
    status: "pending",
    checkInCode: "GHI789",
    priority: "normal"
  },
  {
    id: "4",
    spaceName: "Modern Co-working Hub",
    customerName: "David Wilson",
    customerEmail: "david@example.com",
    customerPhone: "+1234567893",
    startTime: new Date("2024-01-15T18:00:00"),
    endTime: new Date("2024-01-15T22:00:00"),
    guestCount: 8,
    status: "confirmed",
    checkInCode: "JKL012",
    priority: "low"
  }
]

const mockSpaces = [
  { id: "1", name: "Modern Co-working Hub" },
  { id: "2", name: "Creative Event Space" },
  { id: "3", name: "Tech Conference Hall" }
]

export default function StaffSchedulePage() {
  const [user] = useState(mockUser)
  const [schedule, setSchedule] = useState(mockTodaysSchedule)
  const [filteredSchedule, setFilteredSchedule] = useState(mockTodaysSchedule)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpace, setSelectedSpace] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "checked-in":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-orange-100 text-orange-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "checked-in":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-gray-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "no-show":
        return <XCircle className="h-4 w-4 text-orange-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const handleFilter = () => {
    let filtered = schedule

    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.spaceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.checkInCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedSpace !== "all") {
      filtered = filtered.filter(booking => booking.spaceName === selectedSpace)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(booking => booking.status === selectedStatus)
    }

    if (selectedPriority !== "all") {
      filtered = filtered.filter(booking => booking.priority === selectedPriority)
    }

    setFilteredSchedule(filtered)
  }

  useEffect(() => {
    handleFilter()
  }, [searchQuery, selectedSpace, selectedStatus, selectedPriority, schedule])

  const handleCheckIn = (bookingId: string) => {
    setSchedule(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: "checked-in" }
        : booking
    ))
  }

  const handleCheckOut = (bookingId: string) => {
    setSchedule(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: "completed" }
        : booking
    ))
  }

  const handleNoShow = (bookingId: string) => {
    setSchedule(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: "no-show" }
        : booking
    ))
  }

  const getTimeUntilBooking = (startTime: Date) => {
    const now = new Date()
    const diff = startTime.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diff < 0) {
      return "Started"
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const isBookingActive = (startTime: Date, endTime: Date) => {
    const now = new Date()
    return now >= startTime && now <= endTime
  }

  const isBookingUpcoming = (startTime: Date) => {
    const now = new Date()
    const diff = startTime.getTime() - now.getTime()
    return diff > 0 && diff <= 60 * 60 * 1000 // Within next hour
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Today's Schedule</h1>
            <p className="text-muted-foreground">Manage today's bookings and check-ins</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{schedule.length}</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Checked In</p>
                    <p className="text-2xl font-bold text-green-600">
                      {schedule.filter(b => b.status === "checked-in").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {schedule.filter(b => b.status === "pending" || b.status === "confirmed").length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                    <p className="text-2xl font-bold text-red-600">
                      {schedule.filter(b => b.priority === "high").length}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Spaces" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Spaces</SelectItem>
                      {mockSpaces.map(space => (
                        <SelectItem key={space.id} value={space.name}>
                          {space.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="checked-in">Checked In</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule List */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Bookings ({filteredSchedule.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSchedule.map((booking) => (
                  <div key={booking.id} className={`border rounded-lg p-6 transition-colors ${
                    isBookingActive(booking.startTime, booking.endTime) 
                      ? 'bg-blue-50 border-blue-200' 
                      : isBookingUpcoming(booking.startTime)
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'hover:bg-muted/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status.replace("-", " ").toUpperCase()}</span>
                          </Badge>
                          <Badge className={getPriorityColor(booking.priority)}>
                            {booking.priority.toUpperCase()}
                          </Badge>
                          {isBookingActive(booking.startTime, booking.endTime) && (
                            <Badge className="bg-blue-100 text-blue-800">
                              ACTIVE
                            </Badge>
                          )}
                          {isBookingUpcoming(booking.startTime) && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              UPCOMING
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {booking.spaceName}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {format(booking.startTime, "HH:mm")} - {format(booking.endTime, "HH:mm")}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {booking.guestCount} guests
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {booking.checkInCode}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {booking.customerEmail}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {booking.customerPhone}
                          </div>
                          <div className="text-muted-foreground">
                            {getTimeUntilBooking(booking.startTime)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {booking.status === "confirmed" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleCheckIn(booking.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Check In
                          </Button>
                        )}
                        {booking.status === "checked-in" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCheckOut(booking.id)}
                          >
                            Check Out
                          </Button>
                        )}
                        {(booking.status === "confirmed" || booking.status === "pending") && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleNoShow(booking.id)}
                          >
                            No Show
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredSchedule.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
