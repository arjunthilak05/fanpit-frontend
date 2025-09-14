"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return <LoginForm isLogin={isLogin} onToggleMode={() => setIsLogin(!isLogin)} />
}
