"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Clock, Calendar, Percent, Gift, Zap } from "lucide-react"

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

interface PricingEngineProps {
  basePrice: number
  spaceId: string
  onPricingUpdate: (rules: PricingRule[]) => void
}

export function PricingEngine({ basePrice, spaceId, onPricingUpdate }: PricingEngineProps) {
  const [rules, setRules] = useState<PricingRule[]>([
    {
      id: "1",
      name: "Peak Hours (9 AM - 6 PM)",
      type: "peak_hours",
      multiplier: 1.5,
      conditions: {
        timeSlots: ["09:00-18:00"],
      },
      active: true,
    },
    {
      id: "2",
      name: "Full Day Bundle",
      type: "day_bundle",
      fixedPrice: basePrice * 8 * 0.8, // 20% discount for 8+ hours
      conditions: {
        minHours: 8,
      },
      active: true,
    },
    {
      id: "3",
      name: "Monthly Pass",
      type: "monthly_pass",
      fixedPrice: basePrice * 160, // ~20 days worth
      conditions: {
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      active: false,
    },
  ])

  const [newPromoCode, setNewPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(10)

  useEffect(() => {
    onPricingUpdate(rules)
  }, [rules, onPricingUpdate])

  const toggleRule = (ruleId: string) => {
    setRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, active: !rule.active } : rule)))
  }

  const addPromoCode = () => {
    if (!newPromoCode.trim()) return

    const newRule: PricingRule = {
      id: Date.now().toString(),
      name: `Promo: ${newPromoCode.toUpperCase()}`,
      type: "promo_code",
      discountPercent: promoDiscount,
      conditions: {
        code: newPromoCode.toUpperCase(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      active: true,
    }

    setRules((prev) => [...prev, newRule])
    setNewPromoCode("")
    setPromoDiscount(10)
  }

  const removeRule = (ruleId: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== ruleId))
  }

  const getRuleIcon = (type: string) => {
    switch (type) {
      case "peak_hours":
        return <Clock className="h-4 w-4" />
      case "day_bundle":
        return <Calendar className="h-4 w-4" />
      case "monthly_pass":
        return <Calendar className="h-4 w-4" />
      case "promo_code":
        return <Gift className="h-4 w-4" />
      case "event_override":
        return <Zap className="h-4 w-4" />
      default:
        return <Percent className="h-4 w-4" />
    }
  }

  const getRuleDescription = (rule: PricingRule) => {
    switch (rule.type) {
      case "peak_hours":
        return `${rule.multiplier}x multiplier during ${rule.conditions.timeSlots?.join(", ")}`
      case "day_bundle":
        return `₹${rule.fixedPrice} for ${rule.conditions.minHours}+ hours`
      case "monthly_pass":
        return `₹${rule.fixedPrice} for unlimited access (30 days)`
      case "promo_code":
        return `${rule.discountPercent}% off with code: ${rule.conditions.code}`
      default:
        return "Custom pricing rule"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-purple-600" />
            Pricing Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <p className="font-medium">Base Hourly Rate</p>
              <p className="text-sm text-gray-600">Standard pricing for this space</p>
            </div>
            <div className="text-2xl font-bold text-purple-600">₹{basePrice}/hr</div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Active Pricing Rules</h3>
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getRuleIcon(rule.type)}
                  <div>
                    <p className="font-medium">{rule.name}</p>
                    <p className="text-sm text-gray-600">{getRuleDescription(rule)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={rule.active ? "default" : "secondary"}>{rule.active ? "Active" : "Inactive"}</Badge>
                  <Switch checked={rule.active} onCheckedChange={() => toggleRule(rule.id)} />
                  {rule.type === "promo_code" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRule(rule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Add Promo Code</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="promo-code">Code</Label>
                <Input
                  id="promo-code"
                  placeholder="WELCOME10"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount %</Label>
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max="50"
                  value={promoDiscount}
                  onChange={(e) => setPromoDiscount(Number(e.target.value))}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addPromoCode} className="w-full">
                  Add Promo Code
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
