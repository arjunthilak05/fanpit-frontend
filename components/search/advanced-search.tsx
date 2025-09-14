"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MapPin, Users, Star, Wifi, Car, Coffee, Zap } from "lucide-react"

interface SearchFilters {
  location: string
  category: string
  priceRange: [number, number]
  capacity: number
  rating: number
  amenities: string[]
  availability: {
    date: string
    startTime: string
    endTime: string
  }
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onReset: () => void
}

export function AdvancedSearch({ onSearch, onReset }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    category: "",
    priceRange: [0, 5000],
    capacity: 1,
    rating: 0,
    amenities: [],
    availability: {
      date: "",
      startTime: "",
      endTime: "",
    },
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const categories = [
    { value: "coworking", label: "Co-working Space" },
    { value: "meeting", label: "Meeting Room" },
    { value: "event", label: "Event Space" },
    { value: "creative", label: "Creative Studio" },
    { value: "quiet", label: "Quiet Zone" },
    { value: "cafe", label: "Cafe Space" },
  ]

  const amenities = [
    { id: "wifi", label: "High-Speed WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "coffee", label: "Coffee/Tea", icon: Coffee },
    { id: "power", label: "Power Outlets", icon: Zap },
    { id: "projector", label: "Projector", icon: Users },
    { id: "whiteboard", label: "Whiteboard", icon: Users },
    { id: "ac", label: "Air Conditioning", icon: Users },
    { id: "printer", label: "Printer Access", icon: Users },
  ]

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenityId] : prev.amenities.filter((id) => id !== amenityId),
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    setFilters({
      location: "",
      category: "",
      priceRange: [0, 5000],
      capacity: 1,
      rating: 0,
      amenities: [],
      availability: {
        date: "",
        startTime: "",
        endTime: "",
      },
    })
    onReset()
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.location) count++
    if (filters.category) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) count++
    if (filters.capacity > 1) count++
    if (filters.rating > 0) count++
    if (filters.amenities.length > 0) count++
    if (filters.availability.date) count++
    return count
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-purple-600" />
            Advanced Search
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && <Badge variant="secondary">{getActiveFiltersCount()} filters active</Badge>}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              <Filter className="h-4 w-4 mr-2" />
              {isExpanded ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                placeholder="Enter city or area..."
                value={filters.location}
                onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={filters.availability.date}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  availability: { ...prev.availability, date: e.target.value },
                }))
              }
            />
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Time Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={filters.availability.startTime}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      availability: { ...prev.availability, startTime: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={filters.availability.endTime}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      availability: { ...prev.availability, endTime: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <Label>Price Range (per hour)</Label>
              <div className="mt-2 px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
                  max={5000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>₹{filters.priceRange[0]}</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Capacity & Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Minimum Capacity</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="100"
                    value={filters.capacity}
                    onChange={(e) => setFilters((prev) => ({ ...prev, capacity: Number(e.target.value) }))}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">people</span>
                </div>
              </div>
              <div>
                <Label>Minimum Rating</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="h-4 w-4 text-gray-400" />
                  <Select
                    value={filters.rating.toString()}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: Number(value) }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any rating</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="4.5">4.5+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity.id}
                      checked={filters.amenities.includes(amenity.id)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                    />
                    <Label htmlFor={amenity.id} className="text-sm flex items-center gap-1">
                      <amenity.icon className="h-3 w-3" />
                      {amenity.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search Spaces
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
