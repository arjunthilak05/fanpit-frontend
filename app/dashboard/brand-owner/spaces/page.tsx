"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SpaceList } from "@/components/spaces/space-list"
import { SpaceForm } from "@/components/spaces/space-form"
import { SpacesService } from "@/lib/api/spaces"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function BrandOwnerSpacesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [spaces, setSpaces] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<"list" | "form">("list")
  const [editingSpace, setEditingSpace] = useState<any>(null)

  useEffect(() => {
    loadSpaces()
  }, [])

  const loadSpaces = async () => {
    try {
      setIsLoading(true)
      const mySpaces = await SpacesService.getMySpaces()
      setSpaces(mySpaces)
    } catch (error: any) {
      console.error('Failed to load spaces:', error)
      toast.error('Failed to load spaces')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSpace = () => {
    router.push('/dashboard/brand-owner/spaces/new')
  }

  const handleEditSpace = (space: any) => {
    setEditingSpace(space)
    setCurrentView("form")
  }

  const handleDeleteSpace = async (spaceId: string) => {
    if (!confirm("Are you sure you want to delete this space? This action cannot be undone.")) {
      return
    }

    try {
      await SpacesService.deleteSpace(spaceId)
      setSpaces((prev) => prev.filter((space) => space.id !== spaceId))
      toast.success("Space deleted successfully")
    } catch (error: any) {
      console.error('Failed to delete space:', error)
      toast.error(error.message || "Failed to delete space")
    }
  }

  const handleViewSpace = (space: any) => {
    router.push(`/dashboard/brand-owner/spaces/${space.id}`)
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingSpace) {
        // Update existing space
        const updatedSpace = await SpacesService.updateSpace(editingSpace.id, formData)
        setSpaces((prev) => prev.map((space) =>
          space.id === editingSpace.id ? updatedSpace : space
        ))
        toast.success("Space updated successfully")
      } else {
        // Add new space
        const newSpace = await SpacesService.createSpace(formData)
        setSpaces((prev) => [...prev, newSpace])
        toast.success("Space created successfully")
      }
      setCurrentView("list")
      setEditingSpace(null)
    } catch (error: any) {
      console.error('Failed to save space:', error)
      toast.error(error.message || "Failed to save space")
    }
  }

  const handleFormCancel = () => {
    setCurrentView("list")
    setEditingSpace(null)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
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
