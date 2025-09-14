"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  CreditCard,
  Wallet,
  Target,
  Users
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell 
} from "recharts"

// Mock data - replace with actual API calls
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "brand_owner"
}

const mockEarningsData = [
  { month: "Jan", earnings: 45000, bookings: 25, avgBooking: 1800 },
  { month: "Feb", earnings: 52000, bookings: 28, avgBooking: 1857 },
  { month: "Mar", earnings: 48000, bookings: 26, avgBooking: 1846 },
  { month: "Apr", earnings: 61000, bookings: 32, avgBooking: 1906 },
  { month: "May", earnings: 55000, bookings: 29, avgBooking: 1897 },
  { month: "Jun", earnings: 67000, bookings: 35, avgBooking: 1914 },
  { month: "Jul", earnings: 72000, bookings: 38, avgBooking: 1895 },
  { month: "Aug", earnings: 68000, bookings: 36, avgBooking: 1889 },
  { month: "Sep", earnings: 75000, bookings: 40, avgBooking: 1875 },
  { month: "Oct", earnings: 82000, bookings: 43, avgBooking: 1907 },
  { month: "Nov", earnings: 78000, bookings: 41, avgBooking: 1902 },
  { month: "Dec", earnings: 85000, bookings: 45, avgBooking: 1889 }
]

const mockSpaceEarnings = [
  { name: "Modern Co-working Hub", earnings: 320000, percentage: 45, bookings: 180 },
  { name: "Creative Event Space", earnings: 250000, percentage: 35, bookings: 125 },
  { name: "Tech Conference Hall", earnings: 140000, percentage: 20, bookings: 70 }
]

const mockRecentTransactions = [
  {
    id: "1",
    customerName: "Alice Johnson",
    spaceName: "Modern Co-working Hub",
    amount: 4000,
    date: "2024-01-15",
    status: "completed",
    type: "booking"
  },
  {
    id: "2",
    customerName: "Bob Smith",
    spaceName: "Creative Event Space",
    amount: 8000,
    date: "2024-01-15",
    status: "completed",
    type: "booking"
  },
  {
    id: "3",
    customerName: "Carol Davis",
    spaceName: "Tech Conference Hall",
    amount: 12000,
    date: "2024-01-16",
    status: "pending",
    type: "booking"
  },
  {
    id: "4",
    customerName: "Platform Fee",
    spaceName: "Service Fee",
    amount: -1500,
    date: "2024-01-14",
    status: "completed",
    type: "fee"
  }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function EarningsPage() {
  const [user] = useState(mockUser)
  const [timeRange, setTimeRange] = useState("12months")
  const [selectedSpace, setSelectedSpace] = useState("all")

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const totalEarnings = mockEarningsData.reduce((sum, data) => sum + data.earnings, 0)
  const totalBookings = mockEarningsData.reduce((sum, data) => sum + data.bookings, 0)
  const avgMonthlyEarnings = totalEarnings / mockEarningsData.length
  const growthRate = ((mockEarningsData[mockEarningsData.length - 1].earnings - mockEarningsData[mockEarningsData.length - 2].earnings) / mockEarningsData[mockEarningsData.length - 2].earnings) * 100

  const exportEarningsReport = () => {
    const csvContent = [
      ["Date", "Customer", "Space", "Amount", "Status", "Type"],
      ...mockRecentTransactions.map(transaction => [
        transaction.date,
        transaction.customerName,
        transaction.spaceName,
        transaction.amount,
        transaction.status,
        transaction.type
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `earnings-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Earnings</h1>
                <p className="text-muted-foreground">Track your revenue and financial performance</p>
              </div>
              <div className="flex gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="3months">Last 3 months</SelectItem>
                    <SelectItem value="6months">Last 6 months</SelectItem>
                    <SelectItem value="12months">Last 12 months</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={exportEarningsReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monthly Average</p>
                    <p className="text-2xl font-bold">₹{avgMonthlyEarnings.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Per month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                    <p className="text-2xl font-bold text-green-600">+{growthRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">vs last month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{totalBookings}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="spaces">By Space</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Earnings Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Earnings Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockEarningsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            `₹${value.toLocaleString()}`, 
                            name === 'earnings' ? 'Earnings' : 'Bookings'
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="earnings" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Bookings vs Earnings */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Bookings Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockEarningsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="bookings" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Average Booking Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockEarningsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`₹${value}`, 'Avg Booking']} />
                          <Line 
                            type="monotone" 
                            dataKey="avgBooking" 
                            stroke="#ffc658" 
                            strokeWidth={2}
                            dot={{ fill: '#ffc658', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="spaces" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Space Earnings Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Earnings by Space
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={mockSpaceEarnings}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="earnings"
                          >
                            {mockSpaceEarnings.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Earnings']} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Space Performance Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Space Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSpaceEarnings.map((space, index) => (
                        <div key={space.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <div>
                              <p className="font-medium">{space.name}</p>
                              <p className="text-sm text-muted-foreground">{space.bookings} bookings</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{space.earnings.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{space.percentage}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'booking' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'booking' ? (
                              <Calendar className="h-5 w-5 text-green-600" />
                            ) : (
                              <Wallet className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.customerName}</p>
                            <p className="text-sm text-muted-foreground">{transaction.spaceName}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}₹{transaction.amount.toLocaleString()}
                          </p>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
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
