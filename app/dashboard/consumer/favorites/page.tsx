"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Heart, 
  MapPin, 
  Users, 
  Star, 
  Search, 
  Filter,
  Calendar,
  Trash2,
  Eye,
  BookOpen
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data - replace with actual API calls
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "consumer"
}

const mockFavoriteSpaces = [
  {
    id: "1",
    name: "Modern Co-working Hub",
    description: "A sleek and modern co-working space perfect for professionals and teams.",
    address: {
      street: "123 Business District",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001"
    },
    capacity: 50,
    amenities: ["wifi", "coffee", "parking", "projector", "ac"],
    images: ["/modern-coworking-space.png"],
    rating: 4.8,
    reviewCount: 124,
    price: 500,
    priceType: "hour",
    category: "business",
    isAvailable: true,
    addedToFavorites: "2024-01-10",
    lastBooked: "2024-01-05"
  },
  {
    id: "2",
    name: "Creative Event Space",
    description: "Perfect for creative events, workshops, and social gatherings.",
    address: {
      street: "456 Creative Lane",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050"
    },
    capacity: 100,
    amenities: ["sound-system", "lighting", "stage", "wifi", "parking"],
    images: ["/creative-event-space.jpg"],
    rating: 4.9,
    reviewCount: 89,
    price: 2000,
    priceType: "day",
    category: "entertainment",
    isAvailable: true,
    addedToFavorites: "2024-01-08",
    lastBooked: null
  },
  {
    id: "3",
    name: "Tech Conference Hall",
    description: "State-of-the-art conference hall with advanced AV equipment.",
    address: {
      street: "789 Tech Park",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400076"
    },
    capacity: 200,
    amenities: ["av-equipment", "wifi", "parking", "projector", "sound-system", "lighting"],
    images: ["/tech-conference-hall.png"],
    rating: 4.7,
    reviewCount: 156,
    price: 1500,
    priceType: "hour",
    category: "conference",
    isAvailable: false,
    addedToFavorites: "2024-01-12",
    lastBooked: "2024-01-15"
  },
  {
    id: "4",
    name: "Casual Meetup Lounge",
    description: "Comfortable and relaxed space for casual meetings and social gatherings.",
    address: {
      street: "321 Social Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001"
    },
    capacity: 30,
    amenities: ["comfortable-seating", "wifi", "refreshments", "coffee"],
    images: ["/casual-meetup-lounge.jpg"],
    rating: 4.6,
    reviewCount: 67,
    price: 300,
    priceType: "hour",
    category: "meetup",
    isAvailable: true,
    addedToFavorites: "2024-01-14",
    lastBooked: null
  }
]

const categories = ["all", "business", "entertainment", "conference", "meetup", "social"]

export default function FavoritesPage() {
  const [user] = useState(mockUser)
  const [favorites, setFavorites] = useState(mockFavoriteSpaces)
  const [filteredFavorites, setFilteredFavorites] = useState(mockFavoriteSpaces)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const handleRemoveFavorite = (spaceId: string) => {
    setFavorites(prev => prev.filter(space => space.id !== spaceId))
  }

  const handleFilter = () => {
    let filtered = favorites

    if (searchQuery) {
      filtered = filtered.filter(space =>
        space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.address.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(space => space.category === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.addedToFavorites).getTime() - new Date(a.addedToFavorites).getTime())
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredFavorites(filtered)
  }

  useEffect(() => {
    handleFilter()
  }, [searchQuery, selectedCategory, sortBy, favorites])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "business":
        return "bg-blue-100 text-blue-800"
      case "entertainment":
        return "bg-purple-100 text-purple-800"
      case "conference":
        return "bg-green-100 text-green-800"
      case "meetup":
        return "bg-orange-100 text-orange-800"
      case "social":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Saved Spaces</h1>
            <p className="text-muted-foreground">Your favorite spaces for quick booking</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Favorites</p>
                    <p className="text-2xl font-bold">{favorites.length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available Now</p>
                    <p className="text-2xl font-bold text-green-600">
                      {favorites.filter(s => s.isAvailable).length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Previously Booked</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {favorites.filter(s => s.lastBooked).length}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search favorites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recently Added</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorites Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFavorites.map((space) => (
              <Card key={space.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={space.images[0]}
                    alt={space.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveFavorite(space.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(space.category)}>
                      {space.category.charAt(0).toUpperCase() + space.category.slice(1)}
                    </Badge>
                  </div>
                  {!space.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge className="bg-red-100 text-red-800">
                        Currently Unavailable
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{space.name}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {space.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{space.address.city}, {space.address.state}</span>
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{space.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({space.reviewCount} reviews)
                    </span>
                  </div>

                  {/* Capacity and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{space.capacity} people</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{space.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">per {space.priceType}</p>
                    </div>
                  </div>

                  {/* Last Booked */}
                  {space.lastBooked && (
                    <div className="text-xs text-muted-foreground">
                      Last booked: {new Date(space.lastBooked).toLocaleDateString()}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/spaces/${space.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      disabled={!space.isAvailable}
                      asChild
                    >
                      <Link href={`/spaces/${space.id}/book`}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFavorites.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No favorites found</h3>
                <p className="text-muted-foreground mb-4">
                  {favorites.length === 0 
                    ? "Start adding spaces to your favorites for quick access!"
                    : "Try adjusting your filters to see more results."
                  }
                </p>
                {favorites.length === 0 && (
                  <Button asChild>
                    <Link href="/spaces">
                      Browse Spaces
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
