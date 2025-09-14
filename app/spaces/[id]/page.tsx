"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Users,
  Star,
  Calendar,
  ArrowLeft,
  Heart,
  Share2,
  Wifi,
  Car,
  Coffee,
  Projector,
  Music,
  AirVent,
  IndianRupee,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock space data - replace with actual API call
const mockSpace = {
  id: "1",
  name: "Modern Co-working Hub",
  description:
    "A sleek and modern co-working space perfect for professionals and teams. Located in the heart of the business district, this space offers everything you need for productive work sessions, meetings, and collaborative projects.",
  address: {
    street: "123 Business District",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    coordinates: [19.076, 72.8777],
  },
  capacity: 50,
  category: "business",
  amenities: ["wifi", "coffee", "projector", "ac", "parking"],
  images: [
    "/modern-coworking-space.png",
    "/placeholder.svg?key=space2",
    "/placeholder.svg?key=space3",
    "/placeholder.svg?key=space4",
  ],
  pricing: {
    type: "paid",
    baseRate: 500,
    rateType: "hourly",
    peakMultiplier: 1.5,
    monthlyPass: 15000,
  },
  status: "active",
  rating: 4.8,
  reviewCount: 124,
  owner: {
    name: "Business Hub Co.",
    avatar: "/placeholder.svg?key=owner1",
    joinedDate: "2022-01-15",
  },
  features: [
    "High-speed WiFi",
    "Complimentary coffee and tea",
    "Projector and AV equipment",
    "Air conditioning",
    "Parking available",
    "Natural lighting",
    "Quiet environment",
    "Professional atmosphere",
  ],
  rules: [
    "No smoking inside the premises",
    "Keep noise levels to a minimum",
    "Clean up after use",
    "No outside food or drinks",
    "Respect other users",
  ],
}

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  coffee: Coffee,
  projector: Projector,
  sound: Music,
  ac: AirVent,
}

export default function SpaceDetailPage() {
  const params = useParams()
  const [user, setUser] = useState<any>(null) // TODO: Replace with actual auth state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  const handleAuthClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = "/auth"
    }
  }

  const handleShare = () => {
    if (typeof window === 'undefined') return
    
    if (navigator.share) {
      navigator.share({
        title: mockSpace.name,
        text: mockSpace.description,
        url: window.location.href,
      })
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const isPeakHour = (hour: number) => {
    return (hour >= 12 && hour <= 13) || (hour >= 16 && hour <= 18)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onAuthClick={handleAuthClick} />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/spaces">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Spaces
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative">
                <Image
                  src={mockSpace.images[currentImageIndex] || "/placeholder.svg"}
                  alt={mockSpace.name}
                  width={800}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button variant="secondary" size="sm" onClick={() => setIsFavorited(!isFavorited)}>
                    <Heart className={`h-4 w-4 ${isFavorited ? "fill-current text-red-500" : ""}`} />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {mockSpace.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {mockSpace.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${mockSpace.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Space Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-3xl font-bold">{mockSpace.name}</h1>
                    <Badge variant="outline">{mockSpace.category}</Badge>
                  </div>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {mockSpace.address.street}, {mockSpace.address.city}, {mockSpace.address.state}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>Up to {mockSpace.capacity} people</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                      <span>
                        {mockSpace.rating} ({mockSpace.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{mockSpace.description}</p>
            </div>

            {/* Amenities */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mockSpace.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons] || Wifi
                    return (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-sm capitalize">{amenity.replace("_", " ")}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mockSpace.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">House Rules</h3>
                <div className="space-y-2">
                  {mockSpace.rules.map((rule, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2"></div>
                      <span className="text-sm text-muted-foreground">{rule}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Hosted by</h3>
                <div className="flex items-center space-x-4">
                  <Image
                    src={mockSpace.owner.avatar || "/placeholder.svg"}
                    alt={mockSpace.owner.name}
                    width={60}
                    height={60}
                    className="w-15 h-15 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{mockSpace.owner.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Hosting since {new Date(mockSpace.owner.joinedDate).getFullYear()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    {mockSpace.pricing.type === "free" ? (
                      <div className="text-2xl font-bold text-green-600">Free</div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center space-x-1">
                          <IndianRupee className="h-6 w-6 text-primary" />
                          <span className="text-3xl font-bold text-primary">{mockSpace.pricing.baseRate}</span>
                          <span className="text-muted-foreground">/{mockSpace.pricing.rateType}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Peak hours: +{((mockSpace.pricing.peakMultiplier - 1) * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">Quick Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span>{mockSpace.capacity} people</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="capitalize">{mockSpace.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <span>{mockSpace.rating}/5</span>
                      </div>
                      {mockSpace.pricing.monthlyPass && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monthly Pass:</span>
                          <span>₹{mockSpace.pricing.monthlyPass}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <Link href={`/spaces/${params.id}/book`}>
                    <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book This Space
                    </Button>
                  </Link>

                  <p className="text-xs text-muted-foreground text-center">
                    Free cancellation up to 24 hours before your booking
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
