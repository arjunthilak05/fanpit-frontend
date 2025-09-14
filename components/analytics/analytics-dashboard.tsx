"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, MapPin, Star } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 45000, bookings: 120 },
  { month: "Feb", revenue: 52000, bookings: 140 },
  { month: "Mar", revenue: 48000, bookings: 130 },
  { month: "Apr", revenue: 61000, bookings: 165 },
  { month: "May", revenue: 55000, bookings: 150 },
  { month: "Jun", revenue: 67000, bookings: 180 },
]

const spaceUtilizationData = [
  { name: "Creative Hub", utilization: 85, color: "#8C52FF" },
  { name: "Quiet Zone", utilization: 72, color: "#A855F7" },
  { name: "Meeting Rooms", utilization: 68, color: "#C084FC" },
  { name: "Event Space", utilization: 45, color: "#DDD6FE" },
]

const peakHoursData = [
  { hour: "8 AM", bookings: 12 },
  { hour: "9 AM", bookings: 28 },
  { hour: "10 AM", bookings: 45 },
  { hour: "11 AM", bookings: 52 },
  { hour: "12 PM", bookings: 48 },
  { hour: "1 PM", bookings: 35 },
  { hour: "2 PM", bookings: 42 },
  { hour: "3 PM", bookings: 38 },
  { hour: "4 PM", bookings: 31 },
  { hour: "5 PM", bookings: 25 },
  { hour: "6 PM", bookings: 18 },
]

interface AnalyticsDashboardProps {
  userRole: "brand-owner" | "admin"
}

export function AnalyticsDashboard({ userRole }: AnalyticsDashboardProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹3,28,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "Last 6 months",
    },
    {
      title: "Total Bookings",
      value: "885",
      change: "+8.2%",
      trend: "up",
      icon: Calendar,
      description: "Last 6 months",
    },
    {
      title: "Unique Customers",
      value: "342",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      description: "Last 6 months",
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
      description: "Customer satisfaction",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-gray-500">{stat.description}</p>
                <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="text-xs">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue & Bookings Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#8C52FF" strokeWidth={2} dot={{ fill: "#8C52FF" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Space Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spaceUtilizationData.map((space, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{space.name}</span>
                    <span className="text-sm text-gray-600">{space.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${space.utilization}%`,
                        backgroundColor: space.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours & Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#8C52FF" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#A855F7" />
              </BarChart>
            </ResponsiveContainer>
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
            {[
              {
                type: "booking",
                message: "New booking for Creative Hub by Rahul Sharma",
                time: "2 minutes ago",
                amount: "₹2,400",
              },
              {
                type: "checkin",
                message: "Priya Patel checked in to Quiet Zone",
                time: "15 minutes ago",
                amount: null,
              },
              {
                type: "payment",
                message: "Payment received for booking #FP001234",
                time: "1 hour ago",
                amount: "₹1,800",
              },
              {
                type: "review",
                message: "New 5-star review from Amit Kumar",
                time: "2 hours ago",
                amount: null,
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    {activity.type === "booking" && <Calendar className="h-4 w-4 text-purple-600" />}
                    {activity.type === "checkin" && <MapPin className="h-4 w-4 text-purple-600" />}
                    {activity.type === "payment" && <DollarSign className="h-4 w-4 text-purple-600" />}
                    {activity.type === "review" && <Star className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                {activity.amount && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {activity.amount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
