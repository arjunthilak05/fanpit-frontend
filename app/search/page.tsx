"use client"

import { useState } from "react"
import { AdvancedSearch } from "@/components/search/advanced-search"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Users, Wifi, Car, Coffee, Zap } from "lucide-react"
import Image from "next/image"

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

interface Space {
  id: string
  name: string
  description: string
  location: string
  category: string
  price: number
  rating: number
  reviewCount: number
  capacity: number
  amenities: string[]
  images: string[]
  availability: boolean
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock search results
  const mockSpaces: Space[] = [
    {
      id: "1",
      name: "Creative Hub - Main Floor",
      description: "Modern co-working space with natural light and creative atmosphere",
      location: "Koramangala, Bangalore",
      category: "coworking",
      price: 500,
      rating: 4.8,
      reviewCount: 124,
      capacity: 50,
      amenities: ["wifi", "coffee", "power", "parking"],
      images: ["/modern-coworking-space.png"],
      availability: true,
    },
    {
      id: "2",
      name: "Quiet Zone - Private Desks",
      description: "Peaceful workspace perfect for focused work and productivity",
      location: "Indiranagar, Bangalore",
      category: "quiet",
      price: 350,
      rating: 4.6,
      reviewCount: 89,
      capacity: 20,
      amenities: ["wifi", "power", "ac"],
      images: ["/modern-coworking-space.png"],
      availability: true,
    },
    {
      id: "3",
      name: "Executive Meeting Room",
      description: "Professional meeting space with presentation facilities",
      location: "MG Road, Bangalore",
      category: "meeting",
      price: 800,
      rating: 4.9,
      reviewCount: 67,
      capacity: 12,
      amenities: ["wifi", "projector", "whiteboard", "ac"],
      images: ["/modern-coworking-space.png"],
      availability: false,
    },
  ]

  const handleSearch = (filters: SearchFilters) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      let results = [...mockSpaces]

      // Apply filters
      if (filters.location) {
        results = results.filter((space) => space.location.toLowerCase().includes(filters.location.toLowerCase()))
      }

      if (filters.category) {
        results = results.filter((space) => space.category === filters.category)
      }

      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
        results = results.filter(
          (space) => space.price >= filters.priceRange[0] && space.price <= filters.priceRange[1],
        )
      }

      if (filters.capacity > 1) {
        results = results.filter((space) => space.capacity >= filters.capacity)
      }

      if (filters.rating > 0) {
        results = results.filter((space) => space.rating >= filters.rating)
      }

      if (filters.amenities.length > 0) {
        results = results.filter((space) => filters.amenities.every((amenity) => space.amenities.includes(amenity)))
      }

      setSearchResults(results)
      setIsLoading(false)
    }, 1000)
  }

  const handleReset = () => {
    setSearchResults([])
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "coffee":
        return <Coffee className="h-4 w-4" />
      case "power":
        return <Zap className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getAmenityLabel = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return "WiFi"
      case "parking":
        return "Parking"
      case "coffee":
        return "Coffee"
      case "power":
        return "Power"
      case "projector":
        return "Projector"
      case "whiteboard":
        return "Whiteboard"
      case "ac":
        return "AC"
      default:
        return amenity
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Find Your Perfect Space</h1>
        <p className="text-gray-600 mt-2">Search and filter through hundreds of spaces to find exactly what you need</p>
      </div>

      <AdvancedSearch onSearch={handleSearch} onReset={handleReset} />

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Searching spaces...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{searchResults.length} spaces found</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((space) => (
              <Card key={space.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={space.images[0] || "/placeholder.svg"} alt={space.name} fill className="object-cover" />
                  {!space.availability && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="secondary" className="bg-white text-gray-800">
                        Not Available
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{space.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{space.description}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {space.location}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{space.rating}</span>
                        <span className="text-sm text-gray-600">({space.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        Up to {space.capacity} people
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {space.amenities.slice(0, 4).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {getAmenityIcon(amenity)}
                          <span className="ml-1">{getAmenityLabel(amenity)}</span>
                        </Badge>
                      ))}
                      {space.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{space.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold text-purple-600">₹{space.price}</span>
                        <span className="text-sm text-gray-600">/hour</span>
                      </div>
                      <Button disabled={!space.availability} className="px-6">
                        {space.availability ? "Book Now" : "Unavailable"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {searchResults.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Use the search filters above to find spaces that match your needs.</p>
        </div>
      )}
    </div>
  )
}
