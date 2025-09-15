"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/ui/file-upload"
import {
  MapPin,
  Users,
  Wifi,
  Coffee,
  Car,
  Monitor,
  Volume2,
  Lightbulb,
  Shield,
  Clock,
  Plus,
  X,
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { SpacesService } from "@/lib/api/spaces"
import { toast } from "sonner"

const amenitiesList = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'coffee', label: 'Coffee', icon: Coffee },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'projector', label: 'Projector', icon: Monitor },
  { id: 'sound-system', label: 'Sound System', icon: Volume2 },
  { id: 'lighting', label: 'Lighting', icon: Lightbulb },
  { id: 'av-equipment', label: 'AV Equipment', icon: Monitor },
  { id: 'ac', label: 'Air Conditioning', icon: Shield },
  { id: 'comfortable-seating', label: 'Comfortable Seating', icon: Users },
  { id: 'refreshments', label: 'Refreshments', icon: Coffee },
]

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]

export default function AddSpacePage() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const [spaceData, setSpaceData] = useState({
    // Basic Info
    name: '',
    description: '',
    category: '',
    capacity: '',

    // Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    coordinates: '',

    // Amenities
    amenities: [] as string[],

    // Pricing
    pricingType: 'paid',
    baseRate: '',
    rateType: 'hourly',
    peakMultiplier: '1.5',

    // Operating Hours
    operatingHours: daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: { start: '09:00', end: '18:00', closed: false }
    }), {}),

    // Booking Settings
    advanceBooking: '30',
    minBookingDuration: '1',
    maxBookingDuration: '8',

    // Images
    images: [] as File[],
  })

  const router = useRouter()

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1: // Basic Info
        if (!spaceData.name.trim()) newErrors.name = "Space name is required"
        if (!spaceData.description.trim()) newErrors.description = "Description is required"
        if (!spaceData.category) newErrors.category = "Category is required"
        if (!spaceData.capacity || parseInt(spaceData.capacity) <= 0) {
          newErrors.capacity = "Capacity must be greater than 0"
        }
        break

      case 2: // Address
        if (!spaceData.street.trim()) newErrors.street = "Street address is required"
        if (!spaceData.city.trim()) newErrors.city = "City is required"
        if (!spaceData.state.trim()) newErrors.state = "State is required"
        if (!spaceData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
        break

      case 3: // Pricing
        if (spaceData.pricingType === 'paid') {
          if (!spaceData.baseRate || parseFloat(spaceData.baseRate) <= 0) {
            newErrors.baseRate = "Base rate must be greater than 0"
          }
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    setErrors({})

    try {
      const spacePayload = {
        name: spaceData.name,
        description: spaceData.description,
        type: spaceData.category,
        capacity: parseInt(spaceData.capacity),
        address: {
          street: spaceData.street,
          city: spaceData.city,
          state: spaceData.state,
          zipCode: spaceData.zipCode,
          country: 'India',
          coordinates: {
            lat: 0,
            lng: 0
          }
        },
        amenities: spaceData.amenities,
        pricingRules: [],
        businessHours: [],
        images: uploadedImages,
        metadata: {},
        isPublished: true,
        status: 'active'
      }

      await SpacesService.createSpace(spacePayload)
      setSuccess(true)
      toast.success("Space created successfully!")

      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/brand-owner/spaces')
      }, 2000)
    } catch (error: any) {
      console.error('Failed to create space:', error)
      setErrors({
        submit: error.response?.data?.message || error.message || "Failed to create space. Please try again."
      })
      toast.error("Failed to create space")
    } finally {
      setIsLoading(false)
    }
  }

  const updateSpaceData = (field: string, value: any) => {
    setSpaceData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const toggleAmenity = (amenityId: string) => {
    setSpaceData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }))
  }

  const updateOperatingHour = (day: string, field: string, value: string | boolean) => {
    setSpaceData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }))
  }

  const handleImageUpload = async (files: File[]) => {
    try {
      // For now, create object URLs for preview
      const imageUrls = files.map(file => URL.createObjectURL(file))
      setUploadedImages(prev => [...prev, ...imageUrls])
      toast.success(`Successfully uploaded ${files.length} image(s)`)
    } catch (error) {
      toast.error("Failed to upload images")
      throw error
    }
  }

  const handleImageDelete = async (index: number) => {
    try {
      const newImages = [...uploadedImages]
      const deletedUrl = newImages.splice(index, 1)[0]

      // Revoke object URL
      if (deletedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(deletedUrl)
      }

      setUploadedImages(newImages)
      toast.success("Image deleted successfully")
    } catch (error) {
      toast.error("Failed to delete image")
      throw error
    }
  }

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Name, description, and capacity' },
    { id: 2, title: 'Address', description: 'Location and coordinates' },
    { id: 3, title: 'Amenities', description: 'Features and facilities' },
    { id: 4, title: 'Pricing', description: 'Rates and availability' },
    { id: 5, title: 'Images', description: 'Photos and media' },
  ]

  if (success) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar user={user} onLogout={handleLogout} />

        <main className="flex-1 ml-64 overflow-auto">
          <div className="p-8">
            <div className="max-w-2xl mx-auto text-center">
              <Card>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Space Created Successfully!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your space has been created and is now available for booking.
                  </p>
                  <div className="space-y-3">
                    <Button onClick={() => router.push('/dashboard/brand-owner/spaces')} className="w-full">
                      View My Spaces
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/dashboard/brand-owner/spaces/new')} className="w-full">
                      Add Another Space
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Add New Space</h1>
                <p className="text-muted-foreground">Create a new space for your customers to book</p>
              </div>
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-4xl mx-auto">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Space Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Modern Co-working Hub"
                        value={spaceData.name}
                        onChange={(e) => updateSpaceData('name', e.target.value)}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={spaceData.category} onValueChange={(value) => updateSpaceData('category', value)}>
                        <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="meetup">Meetup</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your space, its features, and what makes it special..."
                      value={spaceData.description}
                      onChange={(e) => updateSpaceData('description', e.target.value)}
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Maximum number of people"
                      value={spaceData.capacity}
                      onChange={(e) => updateSpaceData('capacity', e.target.value)}
                      className={errors.capacity ? "border-red-500" : ""}
                    />
                    {errors.capacity && <p className="text-sm text-red-600">{errors.capacity}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Location & Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        placeholder="123 Business District"
                        value={spaceData.street}
                        onChange={(e) => updateSpaceData('street', e.target.value)}
                        className={errors.street ? "border-red-500" : ""}
                      />
                      {errors.street && <p className="text-sm text-red-600">{errors.street}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="Mumbai"
                        value={spaceData.city}
                        onChange={(e) => updateSpaceData('city', e.target.value)}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        placeholder="Maharashtra"
                        value={spaceData.state}
                        onChange={(e) => updateSpaceData('state', e.target.value)}
                        className={errors.state ? "border-red-500" : ""}
                      />
                      {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        placeholder="400001"
                        value={spaceData.zipCode}
                        onChange={(e) => updateSpaceData('zipCode', e.target.value)}
                        className={errors.zipCode ? "border-red-500" : ""}
                      />
                      {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coordinates">Coordinates (Optional)</Label>
                      <Input
                        id="coordinates"
                        placeholder="19.0760, 72.8777"
                        value={spaceData.coordinates}
                        onChange={(e) => updateSpaceData('coordinates', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Format: latitude, longitude</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Amenities */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {amenitiesList.map((amenity) => {
                      const IconComponent = amenity.icon
                      const isSelected = spaceData.amenities.includes(amenity.id)

                      return (
                        <div
                          key={amenity.id}
                          onClick={() => toggleAmenity(amenity.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                        >
                          <div className="flex flex-col items-center text-center space-y-2">
                            <IconComponent className={`h-6 w-6 ${
                              isSelected ? 'text-primary' : 'text-muted-foreground'
                            }`} />
                            <span className={`text-sm ${
                              isSelected ? 'text-primary font-medium' : 'text-muted-foreground'
                            }`}>
                              {amenity.label}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-muted-foreground">
                      Selected amenities: {spaceData.amenities.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Pricing */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pricing Type */}
                  <div className="space-y-4">
                    <Label>Pricing Type</Label>
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="paid"
                          name="pricingType"
                          value="paid"
                          checked={spaceData.pricingType === 'paid'}
                          onChange={(e) => updateSpaceData('pricingType', e.target.value)}
                        />
                        <Label htmlFor="paid">Paid</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="free"
                          name="pricingType"
                          value="free"
                          checked={spaceData.pricingType === 'free'}
                          onChange={(e) => updateSpaceData('pricingType', e.target.value)}
                        />
                        <Label htmlFor="free">Free</Label>
                      </div>
                    </div>
                  </div>

                  {spaceData.pricingType === 'paid' && (
                    <>
                      {/* Base Pricing */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="baseRate">Base Rate *</Label>
                          <Input
                            id="baseRate"
                            type="number"
                            placeholder="500"
                            value={spaceData.baseRate}
                            onChange={(e) => updateSpaceData('baseRate', e.target.value)}
                            className={errors.baseRate ? "border-red-500" : ""}
                          />
                          {errors.baseRate && <p className="text-sm text-red-600">{errors.baseRate}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="rateType">Rate Type</Label>
                          <Select value={spaceData.rateType} onValueChange={(value) => updateSpaceData('rateType', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Per Hour</SelectItem>
                              <SelectItem value="daily">Per Day</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="peakMultiplier">Peak Hour Multiplier</Label>
                          <Input
                            id="peakMultiplier"
                            type="number"
                            step="0.1"
                            placeholder="1.5"
                            value={spaceData.peakMultiplier}
                            onChange={(e) => updateSpaceData('peakMultiplier', e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Booking Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Booking Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="advanceBooking">Advance Booking (days)</Label>
                        <Input
                          id="advanceBooking"
                          type="number"
                          placeholder="30"
                          value={spaceData.advanceBooking}
                          onChange={(e) => updateSpaceData('advanceBooking', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minBookingDuration">Min Duration (hours)</Label>
                        <Input
                          id="minBookingDuration"
                          type="number"
                          placeholder="1"
                          value={spaceData.minBookingDuration}
                          onChange={(e) => updateSpaceData('minBookingDuration', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxBookingDuration">Max Duration (hours)</Label>
                        <Input
                          id="maxBookingDuration"
                          type="number"
                          placeholder="8"
                          value={spaceData.maxBookingDuration}
                          onChange={(e) => updateSpaceData('maxBookingDuration', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Operating Hours</h4>
                    <div className="space-y-3">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="w-20">
                            <span className="capitalize font-medium">{day}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`${day}-closed`}
                              checked={spaceData.operatingHours[day]?.closed}
                              onChange={(e) => updateOperatingHour(day, 'closed', e.target.checked)}
                            />
                            <Label htmlFor={`${day}-closed`} className="text-sm">Closed</Label>
                          </div>

                          {!spaceData.operatingHours[day]?.closed && (
                            <>
                              <Input
                                type="time"
                                value={spaceData.operatingHours[day]?.start || '09:00'}
                                onChange={(e) => updateOperatingHour(day, 'start', e.target.value)}
                                className="w-32"
                              />
                              <span className="text-muted-foreground">to</span>
                              <Input
                                type="time"
                                value={spaceData.operatingHours[day]?.end || '18:00'}
                                onChange={(e) => updateOperatingHour(day, 'end', e.target.value)}
                                className="w-32"
                              />
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Images */}
            {currentStep === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Images & Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FileUpload
                    onUpload={handleImageUpload}
                    onDelete={handleImageDelete}
                    existingFiles={uploadedImages}
                    maxFiles={10}
                    maxFileSize={5}
                    accept="image/*"
                    label="Upload Space Images"
                    description="Add photos of your space (max 10 images, 5MB each)"
                  />
                </CardContent>
              </Card>
            )}

            {/* Error Messages */}
            {errors.submit && (
              <Alert variant="destructive">
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {currentStep < 5 ? (
                  <Button onClick={handleNext}>
                    Next Step
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Space...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Space
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
