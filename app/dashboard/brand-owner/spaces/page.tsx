"use client"

import { useState } from "react"
import { SpaceList } from "@/components/spaces/space-list"
import { SpaceForm } from "@/components/spaces/space-form"

// Mock data - replace with actual API calls
const mockSpaces = [
  {
    id: "1",
    name: "Modern Co-working Hub",
    description: "A sleek and modern co-working space perfect for professionals and teams.",
    address: {
      street: "123 Business District",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      coordinates: [19.076, 72.8777],
    },
    capacity: 50,
    category: "business",
    amenities: ["wifi", "coffee", "projector", "ac"],
    images: ["/modern-coworking-space.png"],
    pricing: {
      type: "paid",
      baseRate: 500,
      rateType: "hourly",
      peakMultiplier: 1.5,
      timeBlocks: [
        { id: 1, hours: "4", price: "1800" },
        { id: 2, hours: "8", price: "3200" },
      ],
      monthlyPass: 15000,
      promoCodes: [{ id: 1, code: "WELCOME10", discount: "10", type: "percentage" }],
    },
    status: "active",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Creative Event Space",
    description: "Perfect for creative events, workshops, and artistic gatherings.",
    address: {
      street: "456 Arts Quarter",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      coordinates: [19.0596, 72.8295],
    },
    capacity: 100,
    category: "entertainment",
    amenities: ["sound", "projector", "wifi", "parking"],
    images: ["/creative-event-space.jpg"],
    pricing: {
      type: "paid",
      baseRate: 2000,
      rateType: "daily",
      peakMultiplier: 1.3,
      timeBlocks: [],
      monthlyPass: 0,
      promoCodes: [],
    },
    status: "active",
    rating: 4.9,
  },
  {
    id: "3",
    name: "Community Meetup Lounge",
    description: "A cozy space for community meetups and casual gatherings.",
    address: {
      street: "789 Community Center",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400070",
      coordinates: [19.1136, 72.8697],
    },
    capacity: 30,
    category: "meetup",
    amenities: ["wifi", "coffee"],
    images: ["/casual-meetup-lounge.jpg"],
    pricing: {
      type: "free",
    },
    status: "inactive",
    rating: 4.6,
  },
]

export default function BrandOwnerSpacesPage() {
  const [spaces, setSpaces] = useState(mockSpaces)
  const [currentView, setCurrentView] = useState<"list" | "form">("list")
  const [editingSpace, setEditingSpace] = useState<any>(null)

  const handleAddSpace = () => {
    setEditingSpace(null)
    setCurrentView("form")
  }

  const handleEditSpace = (space: any) => {
    setEditingSpace(space)
    setCurrentView("form")
  }

  const handleDeleteSpace = (spaceId: string) => {
    if (confirm("Are you sure you want to delete this space?")) {
      setSpaces((prev) => prev.filter((space) => space.id !== spaceId))
    }
  }

  const handleViewSpace = (space: any) => {
    // TODO: Navigate to space detail view
    console.log("View space:", space)
  }

  const handleFormSubmit = (formData: any) => {
    if (editingSpace) {
      // Update existing space
      setSpaces((prev) => prev.map((space) => (space.id === editingSpace.id ? { ...space, ...formData } : space)))
    } else {
      // Add new space
      const newSpace = {
        ...formData,
        id: Date.now().toString(),
        rating: 0,
      }
      setSpaces((prev) => [...prev, newSpace])
    }
    setCurrentView("list")
    setEditingSpace(null)
  }

  const handleFormCancel = () => {
    setCurrentView("list")
    setEditingSpace(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {currentView === "list" ? (
        <SpaceList
          spaces={spaces}
          onAdd={handleAddSpace}
          onEdit={handleEditSpace}
          onDelete={handleDeleteSpace}
          onView={handleViewSpace}
        />
      ) : (
        <SpaceForm space={editingSpace} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
      )}
    </div>
  )
}
