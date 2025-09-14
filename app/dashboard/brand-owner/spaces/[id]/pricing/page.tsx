"use client"

import { useState } from "react"
import { PricingEngine } from "@/components/pricing/pricing-engine"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PricingRule {
  id: string
  name: string
  type: "peak_hours" | "day_bundle" | "monthly_pass" | "promo_code" | "event_override"
  multiplier?: number
  fixedPrice?: number
  discountPercent?: number
  conditions: {
    timeSlots?: string[]
    dayOfWeek?: number[]
    minHours?: number
    validUntil?: string
    code?: string
  }
  active: boolean
}

export default function SpacePricingPage({ params }: { params: { id: string } }) {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([])

  // Mock space data
  const space = {
    id: params.id,
    name: "Creative Hub - Main Floor",
    basePrice: 500,
  }

  const handlePricingUpdate = (rules: PricingRule[]) => {
    setPricingRules(rules)
    // Here you would typically save to your database
    console.log("Updated pricing rules:", rules)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/brand-owner/spaces">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Spaces
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Pricing Configuration</h1>
          <p className="text-gray-600 mt-2">Configure sophisticated pricing rules for {space.name}</p>
        </div>
      </div>

      <PricingEngine basePrice={space.basePrice} spaceId={space.id} onPricingUpdate={handlePricingUpdate} />
    </div>
  )
}
