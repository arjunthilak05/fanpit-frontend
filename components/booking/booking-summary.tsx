"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Users, IndianRupee, Tag } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import { applyPromoCode } from "@/lib/api/promocodes";

interface BookingSummaryProps {
  space: any
  selectedDate: Date
  selectedTimeSlot: any
  duration: number
  onDurationChange: (duration: number) => void
  onPromoCodeApply: (code: any) => void
  appliedPromoCode?: any
  onProceedToPayment: () => void
}

export function BookingSummary({
  space,
  selectedDate,
  selectedTimeSlot,
  duration,
  onDurationChange,
  onPromoCodeApply,
  appliedPromoCode,
  onProceedToPayment,
}: BookingSummaryProps) {
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const basePrice = Number(selectedTimeSlot?.price) || space?.pricing?.baseRate || 500
  const subtotal = basePrice * duration
  const promoDiscount = appliedPromoCode
    ? appliedPromoCode.type === "percentage"
      ? (subtotal * appliedPromoCode.discount) / 100
      : appliedPromoCode.discount
    : 0
  const taxes = (subtotal - promoDiscount) * 0.18 // 18% GST
  const total = Math.round((subtotal - promoDiscount + taxes) * 100) / 100

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    setIsApplyingPromo(true)
    try {
      const appliedCode = await applyPromoCode(promoCode);
      onPromoCodeApply(appliedCode);
    } catch (error) {
      // Handle invalid promo code error
      console.error("Failed to apply promo code", error);
    } finally {
      setIsApplyingPromo(false);
    }
  }

  const durationOptions = [1, 2, 3, 4, 6, 8]

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Space Info */}
        <div className="flex space-x-3">
          <Image
            src={space.images?.[0] || "/placeholder.svg"}
            alt={space.name}
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{space.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {space.address?.city}, {space.address?.state}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Users className="h-4 w-4 mr-1" />
              Up to {space.capacity} people
            </div>
          </div>
        </div>

        <Separator />

        {/* Booking Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Date</span>
            </div>
            <span className="text-sm font-medium">{format(selectedDate, "MMM d, yyyy")}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Time</span>
            </div>
            <span className="text-sm font-medium">{selectedTimeSlot?.time}</span>
          </div>
        </div>

        <Separator />

        {/* Duration Selection */}
        <div className="space-y-3">
          <Label>Duration (hours)</Label>
          <div className="grid grid-cols-3 gap-2">
            {durationOptions.map((hours) => (
              <Button
                key={hours}
                variant={duration === hours ? "default" : "outline"}
                size="sm"
                onClick={() => onDurationChange(hours)}
                className={duration === hours ? "bg-primary text-primary-foreground" : ""}
              >
                {hours}h
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Promo Code */}
        <div className="space-y-3">
          <Label>Promo Code</Label>
          {appliedPromoCode ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">{appliedPromoCode.code}</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {appliedPromoCode.type === "percentage"
                  ? `${appliedPromoCode.discount}% off`
                  : `₹${appliedPromoCode.discount} off`}
              </Badge>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Input placeholder="Enter promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
              <Button variant="outline" onClick={handleApplyPromo} disabled={isApplyingPromo || !promoCode.trim()}>
                {isApplyingPromo ? "Applying..." : "Apply"}
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Base rate ({duration}h)</span>
            <span className="text-sm">₹{subtotal.toFixed(2)}</span>
          </div>

          {appliedPromoCode && (
            <div className="flex items-center justify-between text-green-600">
              <span className="text-sm">Promo discount</span>
              <span className="text-sm">-₹{promoDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm">Taxes & fees (18%)</span>
            <span className="text-sm">₹{taxes.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span className="text-lg text-primary">₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Book Button */}
        <Button className="w-full bg-primary hover:bg-primary/90" size="lg" onClick={onProceedToPayment}>
          <IndianRupee className="mr-2 h-4 w-4" />
          Proceed to Payment
        </Button>

        {/* Cancellation Policy */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Cancellation Policy:</p>
          <p>Free cancellation up to 24 hours before your booking. After that, 50% refund available.</p>
        </div>
      </CardContent>
    </Card>
  )
}