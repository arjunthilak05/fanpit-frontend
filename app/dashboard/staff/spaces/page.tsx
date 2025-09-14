"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  MapPin, 
  Users, 
  Wifi, 
  Coffee, 
  Car, 
  Monitor,
  Volume2,
  Lightbulb,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Eye,
  Settings
} from "lucide-react"
import Image from "next/image"

// Mock data - replace with actual API calls
const mockUser = {
  id: "1",
  name: "Staff Member",
  email: "staff@example.com",
  role: "staff"
}

const mockAssignedSpaces = [
  {
    id: "1",
    name: "Modern Co-working Hub",
    description: "A sleek and modern co-working space perfect for professionals and teams.",
    address: {
      street: "123 Business District",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001"
    },
    capacity: 50,
    amenities: ["wifi", "coffee", "parking", "projector", "ac"],
    images: ["/modern-coworking-space.png"],
    status: "active",
    currentOccupancy: 12,
    todaysBookings: 8,
    todaysRevenue: 40000,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
    issues: 2,
    rating: 4.8
  },
  {
    id: "2",
    name: "Creative Event Space",
    description: "Perfect for creative events, workshops, and social gatherings.",
    address: {
      street: "456 Creative Lane",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050"
    },
    capacity: 100,
    amenities: ["sound-system", "lighting", "stage", "wifi", "parking"],
    images: ["/creative-event-space.jpg"],
    status: "active",
    currentOccupancy: 25,
    todaysBookings: 3,
    todaysRevenue: 24000,
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-02-05",
    issues: 1,
    rating: 4.9
  },
  {
    id: "3",
    name: "Tech Conference Hall",
    description: "State-of-the-art conference hall with advanced AV equipment.",
    address: {
      street: "789 Tech Park",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400076"
    },
    capacity: 200,
    amenities: ["av-equipment", "wifi", "parking", "projector", "sound-system", "lighting"],
    images: ["/tech-conference-hall.png"],
    status: "maintenance",
    currentOccupancy: 0,
    todaysBookings: 0,
    todaysRevenue: 0,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-01-20",
    issues: 3,
    rating: 4.7
  }
]

const amenityIcons = {
  wifi: Wifi,
  coffee: Coffee,
  parking: Car,
  projector: Monitor,
  "sound-system": Volume2,
  lighting: Lightbulb,
  "av-equipment": Monitor,
  ac: Shield
}

export default function StaffSpacesPage() {
  const [user] = useState(mockUser)
  const [spaces, setSpaces] = useState(mockAssignedSpaces)
  const [filteredSpaces, setFilteredSpaces] = useState(mockAssignedSpaces)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "maintenance":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getOccupancyColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const handleFilter = () => {
    let filtered = spaces

    if (searchQuery) {
      filtered = filtered.filter(space =>
        space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.address.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(space => space.status === selectedStatus)
    }

    setFilteredSpaces(filtered)
  }

  useEffect(() => {
    handleFilter()
  }, [searchQuery, selectedStatus, spaces])

  const handleViewSpace = (spaceId: string) => {
    console.log("View space:", spaceId)
  }

  const handleManageSpace = (spaceId: string) => {
    console.log("Manage space:", spaceId)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Assigned Spaces</h1>
            <p className="text-muted-foreground">Manage and monitor your assigned spaces</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Spaces</p>
                    <p className="text-2xl font-bold">{spaces.length}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Spaces</p>
                    <p className="text-2xl font-bold text-green-600">
                      {spaces.filter(s => s.status === "active").length}
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
                    <p className="text-sm font-medium text-muted-foreground">Total Occupancy</p>
                    <p className="text-2xl font-bold">
                      {spaces.reduce((sum, space) => sum + space.currentOccupancy, 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                    <p className="text-2xl font-bold">
                      ₹{spaces.reduce((sum, space) => sum + space.todaysRevenue, 0).toLocaleString()}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
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
                      placeholder="Search spaces..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spaces Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => (
              <Card key={space.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={space.images[0]}
                    alt={space.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(space.status)}>
                      {getStatusIcon(space.status)}
                      <span className="ml-1">{space.status.toUpperCase()}</span>
                    </Badge>
                  </div>
                  {space.issues > 0 && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-100 text-red-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {space.issues} Issues
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{space.name}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {space.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{space.address.city}, {space.address.state}</span>
                  </div>

                  {/* Occupancy */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Occupancy</span>
                    </div>
                    <span className={`font-semibold ${getOccupancyColor(space.currentOccupancy, space.capacity)}`}>
                      {space.currentOccupancy}/{space.capacity}
                    </span>
                  </div>

                  {/* Today's Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Today's Bookings</p>
                      <p className="font-semibold">{space.todaysBookings}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Today's Revenue</p>
                      <p className="font-semibold">₹{space.todaysRevenue.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {space.amenities.slice(0, 4).map((amenity) => {
                        const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons]
                        return (
                          <div key={amenity} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                            {IconComponent && <IconComponent className="h-3 w-3" />}
                            <span>{amenity.replace("-", " ")}</span>
                          </div>
                        )
                      })}
                      {space.amenities.length > 4 && (
                        <div className="text-xs bg-muted px-2 py-1 rounded">
                          +{space.amenities.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Maintenance Info */}
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Next Maintenance</span>
                      <span>{space.nextMaintenance}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewSpace(space.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleManageSpace(space.id)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSpaces.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No spaces found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or contact your administrator.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
