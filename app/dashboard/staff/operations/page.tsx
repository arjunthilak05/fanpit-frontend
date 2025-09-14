"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Wrench,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  RefreshCw,
  Bell,
  Shield,
  Activity
} from "lucide-react"

// Mock data - replace with actual API calls
const mockUser = {
  id: "1",
  name: "Staff Member",
  email: "staff@example.com",
  role: "staff"
}

const mockSpaces = [
  {
    id: "1",
    name: "Modern Co-working Hub",
    occupancy: 12,
    capacity: 50,
    occupancyRate: 24,
    todaysBookings: 8,
    activeIssues: 2,
    status: "active"
  },
  {
    id: "2",
    name: "Creative Event Space",
    occupancy: 25,
    capacity: 100,
    occupancyRate: 25,
    todaysBookings: 3,
    activeIssues: 1,
    status: "active"
  },
  {
    id: "3",
    name: "Tech Conference Hall",
    occupancy: 0,
    capacity: 200,
    occupancyRate: 0,
    todaysBookings: 0,
    activeIssues: 3,
    status: "maintenance"
  }
]

const mockIssues = [
  {
    id: "1",
    spaceName: "Modern Co-working Hub",
    type: "maintenance",
    priority: "high",
    title: "WiFi Connection Issues",
    description: "Multiple users reporting slow internet connection",
    status: "open",
    reportedBy: "John Doe",
    reportedAt: "2024-01-15T10:30:00",
    assignedTo: null
  },
  {
    id: "2",
    spaceName: "Modern Co-working Hub",
    type: "guest",
    priority: "medium",
    title: "Noise Complaint",
    description: "Loud conversation disturbing other guests",
    status: "in_progress",
    reportedBy: "Jane Smith",
    reportedAt: "2024-01-15T14:15:00",
    assignedTo: "Staff Member"
  },
  {
    id: "3",
    spaceName: "Tech Conference Hall",
    type: "maintenance",
    priority: "critical",
    title: "Projector Malfunction",
    description: "Projector not working during presentation",
    status: "open",
    reportedBy: "Bob Johnson",
    reportedAt: "2024-01-15T16:45:00",
    assignedTo: null
  }
]

const mockFeedback = [
  {
    id: "1",
    spaceName: "Creative Event Space",
    customerName: "Alice Wilson",
    rating: 5,
    comment: "Excellent space for our workshop! Clean and well-equipped.",
    submittedAt: "2024-01-15T18:30:00",
    bookingId: "B001"
  },
  {
    id: "2",
    spaceName: "Modern Co-working Hub",
    customerName: "Charlie Brown",
    rating: 4,
    comment: "Good location but AC could be better",
    submittedAt: "2024-01-15T12:15:00",
    bookingId: "B002"
  }
]

const mockIncidents = [
  {
    id: "1",
    spaceName: "Tech Conference Hall",
    type: "security",
    description: "Unauthorized access attempt",
    severity: "medium",
    status: "resolved",
    reportedAt: "2024-01-15T09:20:00",
    resolvedAt: "2024-01-15T09:45:00"
  },
  {
    id: "2",
    spaceName: "Modern Co-working Hub",
    type: "emergency",
    description: "Minor fire alarm activation",
    severity: "high",
    status: "resolved",
    reportedAt: "2024-01-15T11:30:00",
    resolvedAt: "2024-01-15T11:50:00"
  }
]

export default function StaffOperationsPage() {
  const [user] = useState(mockUser)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpace, setSelectedSpace] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredIssues = mockIssues.filter(issue => {
    const matchesSearch = searchQuery === "" ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.spaceName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSpace = selectedSpace === "all" || issue.spaceName === selectedSpace
    const matchesPriority = selectedPriority === "all" || issue.priority === selectedPriority
    const matchesStatus = selectedStatus === "all" || issue.status === selectedStatus

    return matchesSearch && matchesSpace && matchesPriority && matchesStatus
  })

  const totalOccupancy = mockSpaces.reduce((sum, space) => sum + space.occupancy, 0)
  const totalCapacity = mockSpaces.reduce((sum, space) => sum + space.capacity, 0)
  const overallOccupancyRate = totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0

  const criticalIssues = mockIssues.filter(issue => issue.priority === "critical" && issue.status !== "resolved").length
  const unresolvedIssues = mockIssues.filter(issue => issue.status !== "resolved").length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Daily Operations</h1>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Alerts
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">Monitor space operations, handle issues, and manage daily activities</p>
          </div>

          {/* Critical Alerts */}
          {criticalIssues > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>{criticalIssues} critical issue{criticalIssues > 1 ? 's' : ''}</strong> require immediate attention.
              </AlertDescription>
            </Alert>
          )}

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Occupancy</p>
                    <p className="text-2xl font-bold">{totalOccupancy}/{totalCapacity}</p>
                    <p className="text-xs text-muted-foreground">{overallOccupancyRate.toFixed(1)}% utilized</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Issues</p>
                    <p className="text-2xl font-bold text-orange-600">{unresolvedIssues}</p>
                    <p className="text-xs text-muted-foreground">{criticalIssues} critical</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Today's Bookings</p>
                    <p className="text-2xl font-bold">
                      {mockSpaces.reduce((sum, space) => sum + space.todaysBookings, 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Across all spaces</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Spaces</p>
                    <p className="text-2xl font-bold">
                      {mockSpaces.filter(space => space.status === "active").length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mockSpaces.filter(space => space.status === "maintenance").length} in maintenance
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Space Occupancy */}
                <Card>
                  <CardHeader>
                    <CardTitle>Space Occupancy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSpaces.map((space) => (
                        <div key={space.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{space.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{space.occupancy}/{space.capacity}</span>
                              <div className="flex items-center gap-1">
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-600 transition-all duration-300"
                                    style={{ width: `${space.occupancyRate}%` }}
                                  />
                                </div>
                                <span className="text-xs">{space.occupancyRate}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={space.status === "active" ? "secondary" : "destructive"}>
                              {space.status}
                            </Badge>
                            {space.activeIssues > 0 && (
                              <p className="text-xs text-red-600 mt-1">
                                {space.activeIssues} issue{space.activeIssues > 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Wrench className="mr-2 h-4 w-4" />
                      Report Maintenance Issue
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Shield className="mr-2 h-4 w-4" />
                      Security Incident Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Guest Assistance Request
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Emergency Alert
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Guest checked in to Modern Co-working Hub</p>
                        <p className="text-sm text-muted-foreground">John Doe checked in 5 minutes ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium">WiFi issue reported</p>
                        <p className="text-sm text-muted-foreground">Maintenance team notified 15 minutes ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Booking confirmed</p>
                        <p className="text-sm text-muted-foreground">Creative Event Space - 2 hours from now</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Issues Tab */}
            <TabsContent value="issues" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search issues..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                        <SelectTrigger className="w-[150px]">
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

                      <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="All Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priority</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issues List */}
              <div className="space-y-4">
                {filteredIssues.map((issue) => (
                  <Card key={issue.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{issue.title}</h3>
                            <Badge className={getPriorityColor(issue.priority)}>
                              {issue.priority.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(issue.status)}>
                              {issue.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground mb-3">{issue.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-muted-foreground">Space</p>
                              <p>{issue.spaceName}</p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Reported By</p>
                              <p>{issue.reportedBy}</p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Reported At</p>
                              <p>{new Date(issue.reportedAt).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Assigned To</p>
                              <p>{issue.assignedTo || 'Unassigned'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          {issue.status === 'open' && (
                            <Button size="sm">
                              Assign to Me
                            </Button>
                          )}
                          {issue.status === 'in_progress' && (
                            <Button size="sm" variant="outline">
                              Mark Resolved
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredIssues.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No issues found</h3>
                      <p className="text-muted-foreground">All issues have been resolved or filtered out.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback" className="space-y-6">
              <div className="space-y-4">
                {mockFeedback.map((feedback) => (
                  <Card key={feedback.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{feedback.customerName}</h3>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="text-sm text-muted-foreground ml-1">
                                ({feedback.rating}/5)
                              </span>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-3">"{feedback.comment}"</p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{feedback.spaceName}</span>
                            <span>•</span>
                            <span>{new Date(feedback.submittedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Incidents Tab */}
            <TabsContent value="incidents" className="space-y-6">
              <div className="space-y-4">
                {mockIncidents.map((incident) => (
                  <Card key={incident.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{incident.description}</h3>
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-muted-foreground">Space</p>
                              <p>{incident.spaceName}</p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Type</p>
                              <p className="capitalize">{incident.type}</p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Reported</p>
                              <p>{new Date(incident.reportedAt).toLocaleString()}</p>
                            </div>
                            {incident.resolvedAt && (
                              <div>
                                <p className="font-medium text-muted-foreground">Resolved</p>
                                <p>{new Date(incident.resolvedAt).toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
