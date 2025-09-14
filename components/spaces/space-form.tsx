"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, MapPin, Wifi, Car, Coffee, Projector, Music, AirVent, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface SpaceFormProps {
  space?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function SpaceForm({ space, onSubmit, onCancel }: SpaceFormProps) {
  const [formData, setFormData] = useState({
    name: space?.name || "",
    description: space?.description || "",
    address: {
      street: space?.address?.street || "",
      city: space?.address?.city || "",
      state: space?.address?.state || "",
      zipCode: space?.address?.zipCode || "",
      coordinates: space?.address?.coordinates || [0, 0],
    },
    capacity: space?.capacity || "",
    category: space?.category || "",
    amenities: space?.amenities || [],
    images: space?.images || [],
    pricing: {
      type: space?.pricing?.type || "paid",
      baseRate: space?.pricing?.baseRate || "",
      rateType: space?.pricing?.rateType || "hourly",
      peakMultiplier: space?.pricing?.peakMultiplier || 1,
      timeBlocks: space?.pricing?.timeBlocks || [],
      monthlyPass: space?.pricing?.monthlyPass || "",
      promoCodes: space?.pricing?.promoCodes || [],
    },
    status: space?.status || "active",
  })

  const [newPromoCode, setNewPromoCode] = useState({ code: "", discount: "", type: "percentage" })
  const [newTimeBlock, setNewTimeBlock] = useState({ hours: "", price: "" })

  const amenityOptions = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "coffee", label: "Coffee/Tea", icon: Coffee },
    { id: "projector", label: "Projector", icon: Projector },
    { id: "sound", label: "Sound System", icon: Music },
    { id: "ac", label: "Air Conditioning", icon: AirVent },
  ]

  const categories = ["Conference", "Workshop", "Meetup", "Social", "Business", "Entertainment", "Co-working"]

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleAmenityToggle = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id: string) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // TODO: Implement actual image upload logic
    console.log("Files to upload:", files)
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index),
    }))
  }

  const addPromoCode = () => {
    if (newPromoCode.code && newPromoCode.discount) {
      setFormData((prev) => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          promoCodes: [...prev.pricing.promoCodes, { ...newPromoCode, id: Date.now() }],
        },
      }))
      setNewPromoCode({ code: "", discount: "", type: "percentage" })
    }
  }

  const removePromoCode = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        promoCodes: prev.pricing.promoCodes.filter((code: any) => code.id !== id),
      },
    }))
  }

  const addTimeBlock = () => {
    if (newTimeBlock.hours && newTimeBlock.price) {
      setFormData((prev) => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          timeBlocks: [...prev.pricing.timeBlocks, { ...newTimeBlock, id: Date.now() }],
        },
      }))
      setNewTimeBlock({ hours: "", price: "" })
    }
  }

  const removeTimeBlock = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        timeBlocks: prev.pricing.timeBlocks.filter((block: any) => block.id !== id),
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{space ? "Edit Space" : "Add New Space"}</CardTitle>
          <CardDescription>
            {space ? "Update your space details and pricing" : "Create a new space listing for bookings"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>

              {/* Basic Information */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Space Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter space name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your space, its features, and what makes it special"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Number of People) *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange("capacity", Number.parseInt(e.target.value))}
                    placeholder="Maximum number of people"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenityOptions.map((amenity) => {
                      const Icon = amenity.icon
                      return (
                        <div key={amenity.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity.id}
                            checked={formData.amenities.includes(amenity.id)}
                            onCheckedChange={() => handleAmenityToggle(amenity.id)}
                          />
                          <Label htmlFor={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                            <Icon className="h-4 w-4" />
                            <span>{amenity.label}</span>
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status === "active"}
                    onCheckedChange={(checked) => handleInputChange("status", checked ? "active" : "inactive")}
                  />
                  <Label htmlFor="status">Space is active and available for booking</Label>
                </div>
              </TabsContent>

              {/* Location */}
              <TabsContent value="location" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(e) => handleInputChange("address.street", e.target.value)}
                      placeholder="Enter street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange("address.city", e.target.value)}
                        placeholder="City"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.address.state}
                        onChange={(e) => handleInputChange("address.state", e.target.value)}
                        placeholder="State"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.address.zipCode}
                        onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                        placeholder="ZIP Code"
                      />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Map Integration</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Google Maps integration will be added here for address verification and location display.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Pricing */}
              <TabsContent value="pricing" className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="free"
                        name="pricingType"
                        checked={formData.pricing.type === "free"}
                        onChange={() => handleInputChange("pricing.type", "free")}
                      />
                      <Label htmlFor="free">Free Space</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="paid"
                        name="pricingType"
                        checked={formData.pricing.type === "paid"}
                        onChange={() => handleInputChange("pricing.type", "paid")}
                      />
                      <Label htmlFor="paid">Paid Space</Label>
                    </div>
                  </div>

                  {formData.pricing.type === "paid" && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="baseRate">Base Rate (₹) *</Label>
                          <Input
                            id="baseRate"
                            type="number"
                            value={formData.pricing.baseRate}
                            onChange={(e) => handleInputChange("pricing.baseRate", Number.parseFloat(e.target.value))}
                            placeholder="Enter base rate"
                            min="0"
                            step="0.01"
                            required={formData.pricing.type === "paid"}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="rateType">Rate Type *</Label>
                          <Select
                            value={formData.pricing.rateType}
                            onValueChange={(value) => handleInputChange("pricing.rateType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select rate type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Per Hour</SelectItem>
                              <SelectItem value="daily">Per Day</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="peakMultiplier">Peak Hours Multiplier</Label>
                        <Input
                          id="peakMultiplier"
                          type="number"
                          value={formData.pricing.peakMultiplier}
                          onChange={(e) =>
                            handleInputChange("pricing.peakMultiplier", Number.parseFloat(e.target.value))
                          }
                          placeholder="1.5 (50% increase during peak hours)"
                          min="1"
                          step="0.1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="monthlyPass">Monthly Pass Price (₹)</Label>
                        <Input
                          id="monthlyPass"
                          type="number"
                          value={formData.pricing.monthlyPass}
                          onChange={(e) => handleInputChange("pricing.monthlyPass", Number.parseFloat(e.target.value))}
                          placeholder="Optional monthly unlimited access price"
                          min="0"
                        />
                      </div>

                      {/* Time Blocks */}
                      <div className="space-y-4">
                        <Label>Time Block Bundles</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Hours (e.g., 4)"
                            value={newTimeBlock.hours}
                            onChange={(e) => setNewTimeBlock((prev) => ({ ...prev, hours: e.target.value }))}
                          />
                          <Input
                            placeholder="Price (₹)"
                            value={newTimeBlock.price}
                            onChange={(e) => setNewTimeBlock((prev) => ({ ...prev, price: e.target.value }))}
                          />
                          <Button type="button" onClick={addTimeBlock}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.pricing.timeBlocks.map((block: any) => (
                            <Badge key={block.id} variant="secondary" className="flex items-center gap-1">
                              {block.hours}h - ₹{block.price}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => removeTimeBlock(block.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Promo Codes */}
                      <div className="space-y-4">
                        <Label>Promo Codes</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Code (e.g., WELCOME10)"
                            value={newPromoCode.code}
                            onChange={(e) => setNewPromoCode((prev) => ({ ...prev, code: e.target.value }))}
                          />
                          <Input
                            placeholder="Discount (10)"
                            value={newPromoCode.discount}
                            onChange={(e) => setNewPromoCode((prev) => ({ ...prev, discount: e.target.value }))}
                          />
                          <Select
                            value={newPromoCode.type}
                            onValueChange={(value) => setNewPromoCode((prev) => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">%</SelectItem>
                              <SelectItem value="fixed">₹</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button type="button" onClick={addPromoCode}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.pricing.promoCodes.map((code: any) => (
                            <Badge key={code.id} variant="secondary" className="flex items-center gap-1">
                              {code.code} - {code.discount}
                              {code.type === "percentage" ? "%" : "₹"} off
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => removePromoCode(code.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Media */}
              <TabsContent value="media" className="space-y-6">
                <div className="space-y-4">
                  <Label>Space Images</Label>

                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Upload space images</p>
                      <p className="text-xs text-muted-foreground">Drag and drop images here, or click to browse</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image: string, index: number) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Space image ${index + 1}`}
                            width={200}
                            height={150}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {space ? "Update Space" : "Create Space"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
