import { CheckInScanner } from "@/components/staff/check-in-scanner"

export default function StaffCheckInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Check-In Management</h1>
        <p className="text-gray-600 mt-2">Scan booking codes and manage customer check-ins/check-outs</p>
      </div>

      <CheckInScanner />
    </div>
  )
}
