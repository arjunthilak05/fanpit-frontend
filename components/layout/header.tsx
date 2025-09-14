"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, User, Menu, Heart, Calendar, Settings, LogOut, Bot } from "lucide-react"

interface HeaderProps {
  user?: {
    name: string
    role: "consumer" | "brand_owner" | "staff"
    avatar?: string
  }
  onAuthClick: () => void
}

export function Header({ user, onAuthClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo-transparent.png" alt="Fanpit" width={100} height={32} className="h-8 w-auto" />
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search spaces, places, tags, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          {/* AI Agents Link */}
          <Link href="/agents">
            <Button variant="ghost" className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">AI Agents</span>
            </Button>
          </Link>

          {user ? (
            <>
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {user.avatar ? (
                        <Image
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <Badge variant="secondary" className={`text-xs ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{getRoleLabel(user.role)}</p>
                  </div>
                  <DropdownMenuSeparator />

                  {user.role === "consumer" && (
                    <>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        My Bookings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Heart className="mr-2 h-4 w-4" />
                        Saved Spaces
                      </DropdownMenuItem>
                    </>
                  )}

                  {user.role === "brand_owner" && (
                    <>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Spaces
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Reservations
                      </DropdownMenuItem>
                    </>
                  )}

                  {user.role === "staff" && (
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Check-in Dashboard
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onAuthClick}>
                Sign In
              </Button>
              <Button onClick={onAuthClick} className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </nav>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search spaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
      </div>
    </header>
  )
}
