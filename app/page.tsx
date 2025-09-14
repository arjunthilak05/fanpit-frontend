"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { SplashScreen } from "@/components/splash/splash-screen"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, Star, Calendar, ArrowRight, Bot } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const [user, setUser] = useState<any>(null) // TODO: Replace with actual auth state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Show All")
  const [showSplash, setShowSplash] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Check if user has seen splash before
  useEffect(() => {
    if (isHydrated) {
      const hasSeenSplash = localStorage.getItem('fanpit-splash-seen')
      if (!hasSeenSplash) {
        setShowSplash(true)
      }
    }
  }, [isHydrated])

  const categories = ["Conference", "Workshop", "Meetup", "Social", "Business", "Entertainment", "Show All"]

  const featuredSpaces = [
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
      amenities: ["WiFi", "Projector", "Coffee"],
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
      amenities: ["Sound System", "Lighting", "Stage"],
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
      amenities: ["AV Equipment", "WiFi", "Parking"],
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
    },
  ]

  const filteredSpaces =
    selectedCategory === "Show All"
      ? featuredSpaces
      : featuredSpaces.filter((space) => space.category === selectedCategory)

  const handleAuthClick = () => {
    // TODO: Navigate to auth page or open auth modal
    window.location.href = "/auth"
  }

  const handleCloseSplash = () => {
    setShowSplash(false)
    localStorage.setItem('fanpit-splash-seen', 'true')
  }

  const handleStartChat = () => {
    localStorage.setItem('fanpit-splash-seen', 'true')
    window.location.href = '/agents'
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onAuthClick={handleAuthClick} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-balance">
                Where Passion Meets <span className="text-primary">Purpose</span>
              </h1>
              <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
                Discover and book amazing event spaces, co-working areas, and casual third spaces where you can be
                productive or just hang out.
              </p>
            </div>

            {/* Hero Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search events, places, tags, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 text-lg"
                />
                <Button className="absolute right-2 top-2 h-10 bg-primary hover:bg-primary/90">Search</Button>
              </div>
            </div>

            {/* AI Agents CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setShowSplash(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-3 text-lg font-medium"
              >
                <Bot className="mr-2 h-5 w-5" />
                Meet Our AI Agents
              </Button>
              <Link href="/agents">
                <Button variant="outline" className="px-8 py-3 text-lg font-medium">
                  Start AI Chat
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">4 amazing spaces waiting for you • Powered by AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spaces */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Spaces</h2>
            <p className="text-muted-foreground">Discover the perfect space for your next event or work session</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSpaces.map((space) => (
              <Card key={space.id} className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = `/spaces/${space.id}`}>
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
                      {space.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <span className="text-lg font-bold text-primary">₹{space.price}</span>
                        <span className="text-sm text-muted-foreground">/{space.priceType}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/spaces/${space.id}/book`;
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
                </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/spaces">
              <Button variant="outline" size="lg" className="group bg-transparent">
                View All Spaces
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Ready to Find Your Perfect Space?</h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of people who have found their ideal spaces through Fanpit
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={handleAuthClick}>
                Get Started Today
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen
          onClose={handleCloseSplash}
          onStartChat={handleStartChat}
        />
      )}
    </div>
  )
}
