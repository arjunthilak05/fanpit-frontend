"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Building,
  Calendar,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Settings,
  UserPlus,
  Building2,
  FileText
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { UsersService } from "@/lib/api/users"
import { SpacesService } from "@/lib/api/spaces"
import { BookingsService } from "@/lib/api/bookings"
import { PaymentsService } from "@/lib/api/payments"
import { toast } from "sonner"

interface DashboardStats {
  users: {
    total: number
    active: number
    newThisMonth: number
  }
  spaces: {
    total: number
    active: number
    newThisMonth: number
  }
  bookings: {
    total: number
    thisMonth: number
    pending: number
    completed: number
  }
  revenue: {
    total: number
    thisMonth: number
    growth: number
  }
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const mockUser = {
    id: "1",
    name: "Admin User",
    email: "admin@fanpit.com",
    role: "admin" as const,
    avatar: "/placeholder.svg?key=admin"
  }

  const displayUser = user || mockUser

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // Load all dashboard data in parallel
      const [userStats, spaceStats, bookingStats, paymentStats] = await Promise.all([
        UsersService.getStatistics(),
        SpacesService.getSpaceStats(),
        BookingsService.getBookingStats(),
        PaymentsService.getStats()
      ])

      setStats({
        users: userStats,
        spaces: spaceStats,
        bookings: bookingStats,
        revenue: {
          total: paymentStats.totalRevenue || 0,
          thisMonth: paymentStats.monthlyRevenue || 0,
          growth: paymentStats.revenueGrowth || 0
        }
      })
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "text-primary"
  }: {
    title: string
    value: string | number
    icon: any
    trend?: "up" | "down" | "neutral"
    trendValue?: number
    color?: string
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && trendValue !== undefined && (
              <div className="flex items-center mt-1">
                {trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : trend === "down" ? (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                ) : null}
                <span className={`text-xs ${
                  trend === "up" ? "text-green-500" :
                  trend === "down" ? "text-red-500" : "text-muted-foreground"
                }`}>
                  {trendValue > 0 ? "+" : ""}{trendValue}%
                </span>
              </div>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar user={displayUser} onLogout={handleLogout} />
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
      <Sidebar user={displayUser} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform overview and management</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={stats.users.total}
                icon={Users}
                trend="up"
                trendValue={12}
                color="text-blue-500"
              />
              <StatCard
                title="Active Spaces"
                value={stats.spaces.active}
                icon={Building}
                trend="up"
                trendValue={8}
                color="text-green-500"
              />
              <StatCard
                title="This Month Bookings"
                value={stats.bookings.thisMonth}
                icon={Calendar}
                trend="up"
                trendValue={15}
                color="text-purple-500"
              />
              <StatCard
                title="Monthly Revenue"
                value={`₹${stats.revenue.thisMonth.toLocaleString()}`}
                icon={IndianRupee}
                trend={stats.revenue.growth >= 0 ? "up" : "down"}
                trendValue={stats.revenue.growth}
                color="text-orange-500"
              />
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="spaces">Spaces</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New user registered</p>
                          <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Space approved</p>
                          <p className="text-xs text-muted-foreground">15 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Payment processed</p>
                          <p className="text-xs text-muted-foreground">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">API Status</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Healthy
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment Gateway</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">File Storage</span>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Maintenance
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <UserPlus className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="font-semibold">{stats?.users.total || 0}</p>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="font-semibold">{stats?.users.active || 0}</p>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <p className="font-semibold">+{stats?.users.newThisMonth || 0}</p>
                        <p className="text-sm text-muted-foreground">New This Month</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Export Users
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spaces" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Space Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <Building className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="font-semibold">{stats?.spaces.total || 0}</p>
                        <p className="text-sm text-muted-foreground">Total Spaces</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="font-semibold">{stats?.spaces.active || 0}</p>
                        <p className="text-sm text-muted-foreground">Active Spaces</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <p className="font-semibold">+{stats?.spaces.newThisMonth || 0}</p>
                        <p className="text-sm text-muted-foreground">New This Month</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button>
                        <Building2 className="mr-2 h-4 w-4" />
                        Review Pending
                      </Button>
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Space Reports
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Booking Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <p className="font-semibold">{stats?.bookings.total || 0}</p>
                        <p className="text-sm text-muted-foreground">Total Bookings</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <p className="font-semibold">{stats?.bookings.pending || 0}</p>
                        <p className="text-sm text-muted-foreground">Pending</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="font-semibold">{stats?.bookings.completed || 0}</p>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <IndianRupee className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <p className="font-semibold">₹{stats?.revenue.total.toLocaleString() || 0}</p>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        View All Bookings
                      </Button>
                      <Button variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Booking Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
