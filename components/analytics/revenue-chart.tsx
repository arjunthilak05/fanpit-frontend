"use client"

import { useMemo } from 'react'
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'

interface RevenueData {
  month: string
  revenue: number
  bookings: number
  avgBookingValue: number
  growth: number
}

interface SpaceRevenueData {
  name: string
  revenue: number
  bookings: number
  percentage: number
  color: string
}

interface RevenueChartProps {
  data: RevenueData[]
  type: 'line' | 'bar' | 'area'
  title: string
  height?: number
}

export function RevenueChart({ data, type, title, height = 300 }: RevenueChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedRevenue: `₹${item.revenue.toLocaleString()}`,
      formattedBookings: item.bookings.toLocaleString(),
    }))
  }, [data])

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Bookings'
              ]}
            />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        )
      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                `₹${value.toLocaleString()}`,
                'Revenue'
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </AreaChart>
        )
      default:
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Bookings'
              ]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        )
    }
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          {data.length > 1 && (
            <>
              {data[data.length - 1].revenue > data[data.length - 2].revenue ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                data[data.length - 1].revenue > data[data.length - 2].revenue
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {Math.abs(data[data.length - 1].growth || 0).toFixed(1)}%
              </span>
            </>
          )}
        </div>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

interface SpaceRevenueChartProps {
  data: SpaceRevenueData[]
  title: string
  height?: number
}

export function SpaceRevenueChart({ data, title, height = 300 }: SpaceRevenueChartProps) {
  const totalRevenue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.revenue, 0)
  }, [data])

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} (${percentage}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="revenue"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((space) => (
          <div key={space.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: space.color }}
              />
              <span>{space.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">₹{space.revenue.toLocaleString()}</span>
              <span className="text-muted-foreground">({space.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface OccupancyChartProps {
  data: Array<{
    date: string
    occupancy: number
    capacity: number
    utilization: number
  }>
  title: string
  height?: number
}

export function OccupancyChart({ data, title, height = 300 }: OccupancyChartProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              formatter={(value, name) => [
                `${value}%`,
                name === 'utilization' ? 'Utilization Rate' : 'Occupancy'
              ]}
            />
            <Area
              type="monotone"
              dataKey="utilization"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

interface CustomerAnalyticsChartProps {
  data: Array<{
    segment: string
    count: number
    revenue: number
    avgBookingValue: number
  }>
  title: string
  height?: number
}

export function CustomerAnalyticsChart({ data, title, height = 300 }: CustomerAnalyticsChartProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="segment" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value, name) => [
                name === 'revenue' ? `₹${value.toLocaleString()}` :
                name === 'avgBookingValue' ? `₹${value}` : value,
                name === 'revenue' ? 'Revenue' :
                name === 'avgBookingValue' ? 'Avg Booking Value' : 'Count'
              ]}
            />
            <Bar yAxisId="left" dataKey="count" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="avgBookingValue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

interface PerformanceMetricsProps {
  metrics: {
    totalRevenue: number
    totalBookings: number
    avgBookingValue: number
    occupancyRate: number
    customerRetention: number
    growthRate: number
  }
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-bold">{metrics.totalBookings}</p>
          </div>
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Avg Booking Value</p>
            <p className="text-2xl font-bold">{formatCurrency(metrics.avgBookingValue)}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-purple-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
            <p className="text-2xl font-bold">{formatPercentage(metrics.occupancyRate)}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-orange-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Customer Retention</p>
            <p className="text-2xl font-bold">{formatPercentage(metrics.customerRetention)}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-indigo-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
            <p className={`text-2xl font-bold ${
              metrics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {metrics.growthRate >= 0 ? '+' : ''}{formatPercentage(metrics.growthRate)}
            </p>
          </div>
          {metrics.growthRate >= 0 ? (
            <TrendingUp className="h-8 w-8 text-green-600" />
          ) : (
            <TrendingDown className="h-8 w-8 text-red-600" />
          )}
        </div>
      </div>
    </div>
  )
}
