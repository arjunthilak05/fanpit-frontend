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
  CreditCard, 
  Download, 
  Search, 
  Filter,
  Calendar,
  Receipt,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { format } from "date-fns"

// Mock data - replace with actual API calls
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "consumer"
}

const mockPayments = [
  {
    id: "1",
    bookingId: "B001",
    spaceName: "Modern Co-working Hub",
    amount: 4000,
    currency: "INR",
    status: "completed",
    paymentMethod: "Razorpay",
    transactionId: "TXN_1234567890",
    date: new Date("2024-01-15T14:30:00"),
    description: "Booking for Modern Co-working Hub",
    receiptUrl: "#",
    refundAmount: 0,
    isRefunded: false
  },
  {
    id: "2",
    bookingId: "B002",
    spaceName: "Creative Event Space",
    amount: 8000,
    currency: "INR",
    status: "completed",
    paymentMethod: "Razorpay",
    transactionId: "TXN_0987654321",
    date: new Date("2024-01-12T10:15:00"),
    description: "Booking for Creative Event Space",
    receiptUrl: "#",
    refundAmount: 0,
    isRefunded: false
  },
  {
    id: "3",
    bookingId: "B003",
    spaceName: "Tech Conference Hall",
    amount: 12000,
    currency: "INR",
    status: "refunded",
    paymentMethod: "Razorpay",
    transactionId: "TXN_555666777",
    date: new Date("2024-01-10T16:45:00"),
    description: "Booking for Tech Conference Hall (Refunded)",
    receiptUrl: "#",
    refundAmount: 12000,
    isRefunded: true,
    refundDate: new Date("2024-01-11T09:00:00"),
    refundReason: "Booking cancelled by user"
  },
  {
    id: "4",
    bookingId: "B004",
    spaceName: "Casual Meetup Lounge",
    amount: 1500,
    currency: "INR",
    status: "failed",
    paymentMethod: "Razorpay",
    transactionId: "TXN_444333222",
    date: new Date("2024-01-08T11:20:00"),
    description: "Booking for Casual Meetup Lounge",
    receiptUrl: null,
    refundAmount: 0,
    isRefunded: false,
    failureReason: "Payment declined by bank"
  },
  {
    id: "5",
    bookingId: "B005",
    spaceName: "Modern Co-working Hub",
    amount: 2500,
    currency: "INR",
    status: "pending",
    paymentMethod: "Razorpay",
    transactionId: null,
    date: new Date("2024-01-16T13:00:00"),
    description: "Booking for Modern Co-working Hub",
    receiptUrl: null,
    refundAmount: 0,
    isRefunded: false
  }
]

export default function PaymentsPage() {
  const [user] = useState(mockUser)
  const [payments, setPayments] = useState(mockPayments)
  const [filteredPayments, setFilteredPayments] = useState(mockPayments)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("all")

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "refunded":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const handleFilter = () => {
    let filtered = payments

    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.spaceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(payment => payment.status === selectedStatus)
    }

    if (selectedDateRange !== "all") {
      const now = new Date()
      let startDate: Date

      switch (selectedDateRange) {
        case "7days":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "30days":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case "3months":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case "6months":
          startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
          break
        case "1year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(0)
      }

      filtered = filtered.filter(payment => payment.date >= startDate)
    }

    setFilteredPayments(filtered)
  }

  useEffect(() => {
    handleFilter()
  }, [searchQuery, selectedStatus, selectedDateRange, payments])

  const exportPayments = () => {
    const csvContent = [
      ["Date", "Space", "Amount", "Status", "Transaction ID", "Description"],
      ...filteredPayments.map(payment => [
        format(payment.date, "yyyy-MM-dd HH:mm"),
        payment.spaceName,
        payment.amount,
        payment.status,
        payment.transactionId || "N/A",
        payment.description
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payments-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleDownloadReceipt = (paymentId: string) => {
    console.log("Download receipt for payment:", paymentId)
  }

  const totalSpent = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalRefunded = payments
    .filter(p => p.isRefunded)
    .reduce((sum, p) => sum + p.refundAmount, 0)

  const pendingPayments = payments.filter(p => p.status === "pending").length
  const failedPayments = payments.filter(p => p.status === "failed").length

  const netAmount = totalSpent - totalRefunded

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Payment History</h1>
              <Button variant="outline" onClick={exportPayments}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
            <p className="text-muted-foreground">Track your payments and download receipts</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold text-green-600">₹{totalSpent.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Net Amount</p>
                    <p className="text-2xl font-bold">₹{netAmount.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{failedPayments}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
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
                      placeholder="Search payments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="3months">Last 3 months</SelectItem>
                      <SelectItem value="6months">Last 6 months</SelectItem>
                      <SelectItem value="1year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments List */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History ({filteredPayments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{payment.spaceName}</h3>
                            <p className="text-sm text-muted-foreground">{payment.description}</p>
                          </div>
                          <Badge className={getStatusColor(payment.status)}>
                            {getStatusIcon(payment.status)}
                            <span className="ml-1">{payment.status.toUpperCase()}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium">Amount</p>
                            <p className="text-lg font-semibold text-foreground">
                              ₹{payment.amount.toLocaleString()}
                              {payment.isRefunded && (
                                <span className="text-red-600 ml-2">
                                  (-₹{payment.refundAmount.toLocaleString()})
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Date</p>
                            <p>{format(payment.date, "MMM dd, yyyy")}</p>
                            <p className="text-xs">{format(payment.date, "HH:mm")}</p>
                          </div>
                          <div>
                            <p className="font-medium">Payment Method</p>
                            <p>{payment.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="font-medium">Transaction ID</p>
                            <p className="font-mono text-xs">
                              {payment.transactionId || "N/A"}
                            </p>
                          </div>
                        </div>

                        {payment.isRefunded && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex items-center gap-2 text-red-800">
                              <ArrowDownRight className="h-4 w-4" />
                              <span className="font-medium">Refunded</span>
                            </div>
                            <p className="text-sm text-red-700 mt-1">
                              Amount: ₹{payment.refundAmount.toLocaleString()} • 
                              Reason: {payment.refundReason} • 
                              Date: {payment.refundDate ? format(payment.refundDate, "MMM dd, yyyy") : "N/A"}
                            </p>
                          </div>
                        )}

                        {payment.status === "failed" && payment.failureReason && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex items-center gap-2 text-red-800">
                              <XCircle className="h-4 w-4" />
                              <span className="font-medium">Payment Failed</span>
                            </div>
                            <p className="text-sm text-red-700 mt-1">
                              Reason: {payment.failureReason}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {payment.status === "completed" && payment.receiptUrl && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadReceipt(payment.id)}
                          >
                            <Receipt className="h-4 w-4 mr-2" />
                            Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredPayments.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No payments found</h3>
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
