"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { SplashScreen } from '@/components/splash/splash-screen'
import { ChatInterface } from '@/components/agents/chat-interface'
import { useAuth } from '@/hooks/useAuth'

export default function AgentsPage() {
  const { user } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const [startChat, setStartChat] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Check if user has seen splash before (using localStorage)
  useEffect(() => {
    if (isHydrated) {
      const hasSeenSplash = localStorage.getItem('fanpit-agents-splash-seen')
      if (hasSeenSplash) {
        setShowSplash(false)
        setStartChat(true)
      }
    }
  }, [isHydrated])

  const handleCloseSplash = () => {
    setShowSplash(false)
    localStorage.setItem('fanpit-agents-splash-seen', 'true')
  }

  const handleStartChat = () => {
    setStartChat(true)
    localStorage.setItem('fanpit-agents-splash-seen', 'true')
  }

  const handleActionClick = (action: any) => {
    console.log('Action clicked:', action)
    // Handle different action types
    switch (action.type) {
      case 'browse_spaces':
        if (typeof window !== 'undefined') {
          window.location.href = '/spaces'
        }
        break
      case 'start_booking':
        if (typeof window !== 'undefined') {
          window.location.href = '/spaces'
        }
        break
      case 'get_help':
        // Stay on current page, maybe scroll to help section
        break
      default:
        console.log('Unhandled action type:', action.type)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onAuthClick={() => window.location.href = '/auth'} 
      />
      
      <main className="h-[calc(100vh-80px)]">
        {startChat ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <ChatInterface onActionClick={handleActionClick} />
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 max-w-md"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-4xl">🤖</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">FanPit AI Agents</h1>
                <p className="text-muted-foreground">
                  Your intelligent assistants for space discovery, booking, pricing, and event planning.
                </p>
              </div>
              <button
                onClick={() => setStartChat(true)}
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium"
              >
                Start Chatting
              </button>
              <button
                onClick={() => setShowSplash(true)}
                className="block mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Learn more about AI agents
              </button>
            </motion.div>
          </div>
        )}
      </main>

      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen
          onClose={handleCloseSplash}
          onStartChat={handleStartChat}
        />
      )}
    </div>
  )
}
