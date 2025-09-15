"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Search, 
  Calendar, 
  DollarSign, 
  PartyPopper, 
  HeadphonesIcon,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react'
import Image from 'next/image'

interface SplashScreenProps {
  onClose: () => void
  onStartChat: () => void
}

const agents = [
  {
    id: 'smart_space_discovery',
    name: 'Smart Space Discovery',
    description: 'Find perfect spaces with AI-powered search',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
    features: ['Natural language search', 'Vector similarity', 'Personalized recommendations']
  },
  {
    id: 'intelligent_booking',
    name: 'Intelligent Booking',
    description: 'Optimize bookings with smart scheduling',
    icon: Calendar,
    color: 'from-green-500 to-emerald-500',
    features: ['Smart scheduling', 'Conflict detection', 'Calendar integration']
  },
  {
    id: 'dynamic_pricing',
    name: 'Dynamic Pricing AI',
    description: 'Real-time pricing analysis & optimization',
    icon: DollarSign,
    color: 'from-purple-500 to-pink-500',
    features: ['Demand forecasting', 'Market analysis', 'Revenue optimization']
  },
  {
    id: 'event_planning',
    name: 'Event Planning',
    description: 'Complete event coordination & planning',
    icon: PartyPopper,
    color: 'from-orange-500 to-red-500',
    features: ['End-to-end planning', 'Vendor coordination', 'Budget optimization']
  },
  {
    id: 'virtual_concierge',
    name: 'Virtual Concierge',
    description: '24/7 customer support & assistance',
    icon: HeadphonesIcon,
    color: 'from-indigo-500 to-purple-500',
    features: ['24/7 support', 'Multilingual help', 'Issue resolution']
  }
]

export function SplashScreen({ onClose, onStartChat }: SplashScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const steps = [
    {
      title: "Welcome to FanPit AI",
      subtitle: "Your Intelligent Space Booking Platform",
      content: (
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <Bot className="w-16 h-16 text-white" />
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Experience the future of space booking with our AI-powered platform. 
            Discover, book, and manage spaces with intelligent assistance.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
      )
    },
    {
      title: "Meet Your AI Agents",
      subtitle: "Specialized assistants for every need",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.color} text-white shrink-0`}>
                      <agent.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{agent.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{agent.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: "How It Works",
      subtitle: "Simple, intelligent, and efficient",
      content: (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Ask Naturally",
                description: "Just type what you need in plain English",
                example: '"Find a quiet meeting room for 10 people tomorrow"'
              },
              {
                step: 2,
                title: "AI Routes Intelligently",
                description: "Our system automatically connects you to the right specialist",
                example: "Smart Space Discovery Agent takes over"
              },
              {
                step: 3,
                title: "Get Perfect Results",
                description: "Receive personalized recommendations and take action",
                example: "Book instantly or explore more options"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex gap-4 items-start"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground italic">
                    {item.example}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  ]

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onStartChat()
      handleClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <motion.h1 
                  key={currentStep}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl font-bold mb-2"
                >
                  {steps[currentStep].title}
                </motion.h1>
                <motion.p 
                  key={`subtitle-${currentStep}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg opacity-90"
                >
                  {steps[currentStep].subtitle}
                </motion.p>
              </div>

              {/* Progress indicator */}
              <div className="flex justify-center mt-4 gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStep ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 min-h-[400px] flex items-center">
              <motion.div
                key={currentStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="w-full"
              >
                {steps[currentStep].content}
              </motion.div>
            </div>

            {/* Footer */}
            <div className="border-t bg-muted/30 p-6 flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="opacity-70 hover:opacity-100"
              >
                Previous
              </Button>

              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Start Chatting
                    <Bot className="ml-2 w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


