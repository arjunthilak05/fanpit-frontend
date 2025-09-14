"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  BarChart3,
  MapPin,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Heart,
  CreditCard,
  CheckSquare,
  Clock,
} from "lucide-react"
import Image from "next/image"

interface SidebarProps {
  user: {
    name: string
    role: "consumer" | "brand_owner" | "staff"
    avatar?: string
  }
  onLogout: () => void
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const getNavigationItems = () => {
    switch (user.role) {
      case "consumer":
        return [
          { href: "/dashboard/consumer", icon: Home, label: "Dashboard", badge: null },
          { href: "/dashboard/consumer/bookings", icon: Calendar, label: "My Bookings", badge: "3" },
          { href: "/dashboard/consumer/favorites", icon: Heart, label: "Saved Spaces", badge: null },
          { href: "/dashboard/consumer/payments", icon: CreditCard, label: "Payment History", badge: null },
          { href: "/spaces", icon: MapPin, label: "Browse Spaces", badge: null },
        ]
      case "brand_owner":
        return [
          { href: "/dashboard/brand-owner", icon: Home, label: "Dashboard", badge: null },
          { href: "/dashboard/brand-owner/spaces", icon: MapPin, label: "My Spaces", badge: "5" },
          { href: "/dashboard/brand-owner/reservations", icon: Calendar, label: "Reservations", badge: "12" },
          { href: "/dashboard/brand-owner/analytics", icon: BarChart3, label: "Analytics", badge: null },
          { href: "/dashboard/brand-owner/earnings", icon: CreditCard, label: "Earnings", badge: null },
        ]
      case "staff":
        return [
          { href: "/dashboard/staff", icon: Home, label: "Dashboard", badge: null },
          { href: "/dashboard/staff/checkins", icon: CheckSquare, label: "Check-ins", badge: "8" },
          { href: "/dashboard/staff/schedule", icon: Clock, label: "Today's Schedule", badge: null },
          { href: "/dashboard/staff/spaces", icon: MapPin, label: "Assigned Spaces", badge: null },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "consumer":
        return "Consumer"
      case "brand_owner":
        return "Brand Owner"
      case "staff":
        return "Staff"
      default:
        return "User"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "consumer":
        return "bg-blue-100 text-blue-800"
      case "brand_owner":
        return "bg-purple-100 text-purple-800"
      case "staff":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-full bg-card border-r transition-transform duration-300 ${
          isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        } ${isCollapsed ? "md:w-16" : "w-64"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Image src="/images/logo-transparent.png" alt="Fanpit" width={32} height={32} className="h-8 w-auto" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-primary">Fanpit</h2>
                </div>
              )}
              <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => setIsCollapsed(!isCollapsed)}>
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {user.avatar ? (
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <Users className="h-5 w-5 text-primary" />
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <Badge variant="secondary" className={`text-xs ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive ? "bg-primary text-primary-foreground" : ""
                    } ${isCollapsed ? "px-2" : "px-3"}`}
                  >
                    <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <Link href="/dashboard/settings">
              <Button variant="ghost" className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}>
                <Settings className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
                {!isCollapsed && <span>Settings</span>}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className={`w-full justify-start text-destructive hover:text-destructive ${isCollapsed ? "px-2" : "px-3"}`}
              onClick={onLogout}
            >
              <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsCollapsed(true)} />
      )}
    </>
  )
}
