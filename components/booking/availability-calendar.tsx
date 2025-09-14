"use client"

import { useState, useEffect } from "react"
import { useBooking } from "@/hooks/useBooking"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, IndianRupee } from "lucide-react"
import { format, addDays, isSameDay, isToday, isBefore, startOfDay } from "date-fns"

interface AvailabilityCalendarProps {
  space: any
  onTimeSlotSelect: (date: Date, timeSlot: any) => void
  selectedDate?: Date
  selectedTimeSlot?: any
}

export function AvailabilityCalendar({
  space,
  onTimeSlotSelect,
  selectedDate,
  selectedTimeSlot,
}: AvailabilityCalendarProps) {
  const { checkAvailability, loading, error } = useBooking()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [timeSlots, setTimeSlots] = useState([])

  useEffect(() => {
    const generateTimeSlots = () => {
      const slots = []
      const startHour = 9
      const endHour = 18

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          slots.push({
            id: `${hour}-${minute}`,
            time: timeString,
            available: Math.random() > 0.3, // Mock availability
            price: `₹${Math.floor(Math.random() * 500) + 200}`, // Mock price
          })
        }
      }
      setTimeSlots(slots)
    }

    generateTimeSlots()
  }, [currentDate])

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

  

  const isPeakHour = (time: string) => {
    const hour = Number.parseInt(time.split(":")[0])
    return (hour >= 12 && hour <= 13) || (hour >= 16 && hour <= 18)
  }

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Select Date</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {dates.map((date) => {
              const isSelected = selectedDate && isSameDay(date, selectedDate)
              const isPast = isBefore(date, startOfDay(new Date()))

              return (
                <Button
                  key={date.toISOString()}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-16 flex flex-col items-center justify-center p-2 ${
                    isSelected ? "bg-primary text-primary-foreground" : ""
                  } ${isPast ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !isPast && setCurrentDate(date)}
                  disabled={isPast}
                >
                  <span className="text-xs font-medium">{format(date, "EEE")}</span>
                  <span className="text-sm font-bold">{format(date, "d")}</span>
                  {isToday(date) && <span className="text-xs text-primary">Today</span>}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Time Slot Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Available Time Slots</span>
            <span className="text-sm font-normal text-muted-foreground">
              {format(currentDate, "EEEE, MMMM d, yyyy")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = selectedTimeSlot?.id === slot.id
              const isPeak = isPeakHour(slot.time)

              return (
                <Button
                  key={slot.id}
                  variant={isSelected ? "default" : slot.available ? "outline" : "secondary"}
                  className={`h-20 flex flex-col items-center justify-center p-3 ${
                    isSelected ? "bg-primary text-primary-foreground" : ""
                  } ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => slot.available && onTimeSlotSelect(currentDate, slot)}
                  disabled={!slot.available}
                >
                  <span className="font-semibold">{slot.time}</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <IndianRupee className="h-3 w-3" />
                    <span className="text-xs">{slot.price}</span>
                  </div>
                  {isPeak && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      Peak
                    </Badge>
                  )}
                  {!slot.available && <span className="text-xs text-muted-foreground">Booked</span>}
                </Button>
              )
            })}
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border-2 border-muted-foreground rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-muted-foreground/50 rounded"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
