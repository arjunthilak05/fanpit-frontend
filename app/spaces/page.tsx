"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, MapPin, Users, Star, Calendar, Grid, List, SlidersHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data - same as homepage but with more spaces
const allSpaces = [
  {
    id: 1,
    name: "Modern Co-working Hub",
    location: "Downtown, Mumbai",
    capacity: 50,
    rating: 4.8,
    price: 500,
    priceType: "hour",
    image: "/modern-coworking-space.png",
    category: "Business",
    amenities: ["WiFi", "Projector", "Coffee", "AC"],
    description: "A sleek and modern co-working space perfect for professionals and teams.",
  },
  {
    id: 2,
    name: "Creative Event Space",
    location: "Bandra, Mumbai",
    capacity: 100,
    rating: 4.9,
    price: 2000,
    priceType: "day",
    image: "/creative-event-space.jpg",
    category: "Entertainment",
    amenities: ["Sound System", "Lighting", "Stage", "WiFi"],
    description: "Perfect for creative events, workshops, and artistic gatherings.",
  },
  {
    id: 3,
    name: "Tech Conference Hall",
    location: "Powai, Mumbai",
    capacity: 200,
    rating: 4.7,
    price: 1500,
    priceType: "hour",
    image: "/tech-conference-hall.png",
    category: "Conference",
    amenities: ["AV Equipment", "WiFi", "Parking", "Catering"],
    description: "State-of-the-art conference facility for tech events and presentations.",
  },
  {
    id: 4,
    name: "Casual Meetup Lounge",
    location: "Andheri, Mumbai",
    capacity: 30,
    rating: 4.6,
    price: 300,
    priceType: "hour",
    image: "/casual-meetup-lounge.jpg",
    category: "Meetup",
    amenities: ["Comfortable Seating", "WiFi", "Refreshments"],
    description: "A cozy space for community meetups and casual gatherings.",
  },
  {
    id: 5,
    name: "Executive Boardroom",
    location: "BKC, Mumbai",
    capacity: 12,
    rating: 4.8,
    price: 800,
    priceType: "hour",
    image: "/placeholder.svg?key=exec1",
    category: "Business",
    amenities: ["Video Conferencing", "WiFi", "Whiteboard", "Coffee"],
    description: "Premium boardroom for executive meetings and presentations.",
  },
  {
    id: 6,
    name: "Workshop Studio",
    location: "Juhu, Mumbai",
    capacity: 25,
    rating: 4.5,
    price: 600,
    priceType: "hour",
    image: "/placeholder.svg?key=workshop1",
    category: "Workshop",
    amenities: ["Tools", "WiFi", "Storage", "Natural Light"],
    description: "Hands-on workshop space with tools and equipment for creative projects.",
  },
]

export default function SpacesPage() {
  const [user, setUser] = useState<any>(null) // TODO: Replace with actual auth state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [capacityRange, setCapacityRange] = useState([1, 200])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("rating")

  const categories = ["all", "Conference", "Workshop", "Meetup", "Social", "Business", "Entertainment"]
  const locations = ["all", "Downtown", "Bandra", "Powai", "Andheri", "BKC", "Juhu"]

  const filteredSpaces = allSpaces
    .filter((space) => {
      const matchesSearch =
        space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || space.category === selectedCategory
      const matchesLocation = selectedLocation === "all" || space.location.includes(selectedLocation)
      const matchesPrice = space.price >= priceRange[0] && space.price <= priceRange[1]
      const matchesCapacity = space.capacity >= capacityRange[0] && space.capacity <= capacityRange[1]

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesCapacity
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "capacity":
          return b.capacity - a.capacity
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const handleAuthClick = () => {
    window.location.href = "/auth"
  }

  const SpaceCard = ({ space }: { space: any }) => (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
      <Link href={`/spaces/${space.id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={space.image || "/placeholder.svg"}
            alt={space.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{space.category}</Badge>
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{space.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {space.location}
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{space.description}</p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{space.capacity} people</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                <span>{space.rating}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {space.amenities.slice(0, 3).map((amenity: string) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {space.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{space.amenities.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <span className="text-lg font-bold text-primary">₹{space.price}</span>
                <span className="text-sm text-muted-foreground">/{space.priceType}</span>
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Calendar className="h-4 w-4 mr-1" />
                Book Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )

  const SpaceListItem = ({ space }: { space: any }) => (
    <Card className="group hover:shadow-md transition-shadow">
      <Link href={`/spaces/${space.id}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Image
              src={space.image || "/placeholder.svg"}
              alt={space.name}
              width={120}
              height={120}
              className="w-30 h-30 object-cover rounded-lg"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{space.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {space.category}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {space.location}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{space.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {space.amenities.slice(0, 4).map((amenity: string) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="mb-2">
                    <span className="text-xl font-bold text-primary">₹{space.price}</span>
                    <span className="text-sm text-muted-foreground">/{space.priceType}</span>
                  </div>
                  <div className="flex items-center justify-end space-x-4 text-sm mb-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{space.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                      <span>{space.rating}</span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Calendar className="h-4 w-4 mr-1" />
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onAuthClick={handleAuthClick} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search spaces..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location === "all" ? "All Locations" : location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={5000}
                      min={0}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  {/* Capacity Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Capacity: {capacityRange[0]} - {capacityRange[1]} people
                    </label>
                    <Slider
                      value={capacityRange}
                      onValueChange={setCapacityRange}
                      max={200}
                      min={1}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Available Spaces</h1>
                <p className="text-muted-foreground">{filteredSpaces.length} spaces found</p>
              </div>

              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Best Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="capacity">Largest Capacity</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Spaces Grid/List */}
            {filteredSpaces.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No spaces found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredSpaces.map((space) =>
                  viewMode === "grid" ? (
                    <SpaceCard key={space.id} space={space} />
                  ) : (
                    <SpaceListItem key={space.id} space={space} />
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
