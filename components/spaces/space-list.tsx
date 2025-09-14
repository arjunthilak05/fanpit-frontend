"use client"

import { useSpaces } from "@/hooks/useSpaces"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, MapPin, Users, Star, Plus, Grid, List } from "lucide-react"
import Image from "next/image"

export function SpaceList() {
  const { spaces, loading, error, getSpaces, deleteSpace } = useSpaces()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")

  useEffect(() => {
    getSpaces({ status: filterStatus, search: searchQuery })
  }, [filterStatus, searchQuery])

  const onEdit = (space: any) => {
    // TODO: Implement edit functionality
    console.log("Editing space:", space)
  }

  const onDelete = async (spaceId: string) => {
    if (window.confirm("Are you sure you want to delete this space?")) {
      await deleteSpace(spaceId)
    }
  }

  const onView = (space: any) => {
    // TODO: Implement view functionality
    console.log("Viewing space:", space)
  }

  const onAdd = () => {
    // TODO: Implement add functionality
    console.log("Adding new space")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const SpaceCard = ({ space }: { space: any }) => (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={space.images?.[0] || "/placeholder.svg"}
          alt={space.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge className={`absolute top-3 left-3 ${getStatusColor(space.status)}`}>{space.status}</Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(space)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(space)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Space
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(space.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Space
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{space.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {space.address?.city}, {space.address?.state}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{space.capacity} people</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
              <span>{space.rating || "4.5"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              {space.pricing?.type === "free" ? (
                <span className="text-lg font-bold text-green-600">Free</span>
              ) : (
                <>
                  <span className="text-lg font-bold text-primary">₹{space.pricing?.baseRate}</span>
                  <span className="text-sm text-muted-foreground">/{space.pricing?.rateType}</span>
                </>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {space.category}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const SpaceListItem = ({ space }: { space: any }) => (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Image
            src={space.images?.[0] || "/placeholder.svg"}
            alt={space.name}
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-lg"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{space.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {space.address?.city}, {space.address?.state}
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{space.description}</p>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Badge className={getStatusColor(space.status)}>{space.status}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(space)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(space)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Space
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(space.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Space
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{space.capacity} people</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                  <span>{space.rating || "4.5"}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {space.category}
                </Badge>
              </div>

              <div>
                {space.pricing?.type === "free" ? (
                  <span className="text-lg font-bold text-green-600">Free</span>
                ) : (
                  <>
                    <span className="text-lg font-bold text-primary">₹{space.pricing?.baseRate}</span>
                    <span className="text-sm text-muted-foreground">/{space.pricing?.rateType}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-full" />
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )
    }

    if (spaces.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No spaces found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Get started by adding your first space"}
          </p>
          <Button onClick={onAdd} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Space
          </Button>
        </div>
      )
    }

    return (
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {spaces.map((space) =>
          viewMode === "grid" ? (
            <SpaceCard key={space.id} space={space} />
          ) : (
            <SpaceListItem key={space.id} space={space} />
          ),
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Spaces</h1>
          <p className="text-muted-foreground">Manage your space listings and bookings</p>
        </div>
        <Button onClick={onAdd} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add New Space
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search spaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter: {filterStatus === "all" ? "All" : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Spaces</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("inactive")}>Inactive Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
      {renderContent()}
    </div>
  )
}
