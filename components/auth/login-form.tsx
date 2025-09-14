"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"

interface LoginFormProps {
  onToggleMode: () => void
  isLogin: boolean
}

export function LoginForm({ onToggleMode, isLogin }: LoginFormProps) {
  const { login, register, isLoading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    role: "consumer",
  })

  // Password validation - must match backend requirements
  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password), // Must match backend exactly
    }
  }

  const passwordValidation = validatePassword(formData.password)
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isLogin) {
        const { email, password } = formData
        await login(email, password)
        // The useAuth hook will handle the redirect automatically
      } else {
        await register(formData)
        // Show success message
        setSuccessMessage("Account created successfully! Please sign in with your new account.")
        // Clear form and switch to login after a short delay
        setFormData({
          email: formData.email, // Keep email for convenience
          password: "",
          name: "",
          phone: "",
          role: "consumer",
        })
        // Switch to login mode after showing success message
        setTimeout(() => {
          setSuccessMessage(null)
          onToggleMode()
        }, 2000)
      }
    } catch (err: any) {
      // Error is handled by the useAuth hook
      console.error('Auth error:', err)
    }
  }

  // Clear error and success messages when switching between login/register modes
  const handleToggleMode = () => {
    clearError()
    setSuccessMessage(null)
    onToggleMode()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/images/logo-transparent.png" alt="Fanpit" width={120} height={40} className="h-10 w-auto" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-primary">
              {isLogin ? "Welcome Back" : "Join Fanpit"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin ? "Sign in to your account to continue" : "Create your account to start booking spaces"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required={!isLogin}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumer">Consumer - Book spaces</SelectItem>
                      <SelectItem value="brand_owner">Brand Owner - List spaces</SelectItem>
                      <SelectItem value="staff">Staff - Manage check-ins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              
              {/* Password Requirements - Show only for registration */}
              {!isLogin && formData.password && (
                <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Password Requirements:</p>
                  <div className="space-y-1">
                    {[
                      { key: 'length', label: 'At least 8 characters', valid: passwordValidation.length },
                      { key: 'uppercase', label: 'One uppercase letter', valid: passwordValidation.uppercase },
                      { key: 'lowercase', label: 'One lowercase letter', valid: passwordValidation.lowercase },
                      { key: 'number', label: 'One number', valid: passwordValidation.number },
                      { key: 'special', label: 'One special character (@$!%*?&)', valid: passwordValidation.special },
                    ].map((req) => (
                      <div key={req.key} className="flex items-center gap-2 text-xs">
                        {req.valid ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        <span className={req.valid ? 'text-green-600' : 'text-red-600'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isLogin && (
              <div className="text-right">
                <Button variant="link" className="p-0 h-auto text-sm text-primary">
                  Forgot password?
                </Button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={isLoading || (!isLogin && !isPasswordValid && formData.password.length > 0)}
            >
              {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button variant="link" className="p-0 ml-1 h-auto text-sm text-primary" onClick={handleToggleMode}>
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
