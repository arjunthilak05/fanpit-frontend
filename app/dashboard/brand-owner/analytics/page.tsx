import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default function BrandOwnerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your space performance, revenue, and customer insights</p>
      </div>

      <AnalyticsDashboard userRole="brand-owner" />
    </div>
  )
}
