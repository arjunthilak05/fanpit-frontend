"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  MessageCircle,
  Clock,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getApiUrl } from '@/lib/config'

// Space data for demo tiles
const demoSpaces = [
  {
    id: '1',
    name: 'Modern Co-working Hub',
    location: 'Mumbai, Maharashtra',
    price: 500,
    capacity: 50,
    amenities: ['WiFi', 'Coffee', 'Projector', 'AC'],
    image: '/public/modern-coworking-space.png',
    rating: 4.5,
    reviews: 128,
    type: 'Co-working'
  },
  {
    id: '2',
    name: 'Business Conference Center',
    location: 'Mumbai, Maharashtra',
    price: 800,
    capacity: 100,
    amenities: ['AV Setup', 'Catering', 'Parking', 'Stage'],
    image: '/public/tech-conference-hall.png',
    rating: 4.8,
    reviews: 89,
    type: 'Conference'
  },
  {
    id: '3',
    name: 'Creative Event Space',
    location: 'Mumbai, Maharashtra',
    price: 600,
    capacity: 75,
    amenities: ['Natural Light', 'Sound System', 'Bar', 'Decor'],
    image: '/public/creative-event-space.jpg',
    rating: 4.6,
    reviews: 156,
    type: 'Event Space'
  },
  {
    id: '4',
    name: 'Premium Meeting Room',
    location: 'Mumbai, Maharashtra',
    price: 400,
    capacity: 20,
    amenities: ['WiFi', 'Projector', 'Whiteboard', 'Coffee'],
    image: '/public/casual-meetup-lounge.jpg',
    rating: 4.4,
    reviews: 67,
    type: 'Meeting Room'
  }
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  agent?: string
  confidence?: number
  suggestions?: string[]
  actions?: Array<{
    type: string
    label: string
    data?: any
  }>
  usage?: {
    tokens_used: number
    response_time_ms: number
    model_used: string
  }
  spaces?: typeof demoSpaces
  showTiles?: boolean
}

interface ChatInterfaceProps {
  className?: string
  onActionClick?: (action: any) => void
}

const agentInfo = {
  smart_space_discovery: { name: 'Space Discovery', icon: '🔍', color: 'bg-blue-500' },
  intelligent_booking: { name: 'Booking Assistant', icon: '📅', color: 'bg-green-500' },
  dynamic_pricing: { name: 'Pricing AI', icon: '💰', color: 'bg-purple-500' },
  event_planning: { name: 'Event Planner', icon: '🎉', color: 'bg-orange-500' },
  virtual_concierge: { name: 'Concierge', icon: '🤝', color: 'bg-indigo-500' },
  fallback_assistant: { name: 'General Assistant', icon: '🤖', color: 'bg-gray-500' }
}

export function ChatInterface({ className, onActionClick }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your FanPit AI assistant. I can help you find spaces, book venues, check pricing, plan events, or answer any questions. What would you like to do today?',
      timestamp: new Date().toISOString(),
      agent: 'virtual_concierge',
      confidence: 1.0,
      suggestions: ['Find a space', 'Check pricing', 'Plan an event', 'Get help']
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          userId: 'user_123', // TODO: Get from auth context
          model: 'openrouter/sonoma-sky-alpha'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
        agent: data.agent,
        confidence: data.confidence,
        suggestions: data.suggestions,
        actions: data.actions,
        usage: data.usage
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment, or contact support if the issue persists.',
        timestamp: new Date().toISOString(),
        agent: 'fallback_assistant',
        confidence: 0.5
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    inputRef.current?.focus()
  }

  const handleActionClick = (action: any) => {
    if (onActionClick) {
      onActionClick(action)
    } else {
      // Enhanced default action handling
      if (action.type === 'browse_spaces') {
        // Navigate to spaces page
        window.location.href = '/'
      } else if (action.type === 'start_booking') {
        // Navigate to a sample space booking
        window.location.href = '/spaces/1/book'
      } else if (action.type === 'get_help') {
        // Add a helpful message
        setInputValue("I need help with using the platform")
        sendMessage()
      } else {
        setInputValue(`Please help me with: ${action.label}`)
      }
      inputRef.current?.focus()
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="border-b bg-muted/30 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">FanPit AI Assistant</h2>
          <p className="text-sm text-muted-foreground">Intelligent space booking platform</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="w-3 h-3" />
          AI Powered
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shrink-0 mt-1",
                    agentInfo[message.agent as keyof typeof agentInfo]?.color || 'bg-gray-500'
                  )}>
                    {agentInfo[message.agent as keyof typeof agentInfo]?.icon || '🤖'}
                  </div>
                )}

                <div className={cn(
                  "max-w-[80%] space-y-2",
                  message.role === 'user' ? "items-end" : "items-start"
                )}>
                  {/* Message bubble */}
                  <div className={cn(
                    "rounded-2xl px-4 py-3 shadow-sm",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground ml-auto" 
                      : "bg-muted"
                  )}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>

                  {/* Agent info and metadata */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {message.agent && (
                        <Badge variant="outline" className="text-xs">
                          {agentInfo[message.agent as keyof typeof agentInfo]?.name || message.agent}
                        </Badge>
                      )}
                      {message.confidence && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {Math.round(message.confidence * 100)}% confident
                        </span>
                      )}
                      {message.usage && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {message.usage.response_time_ms}ms
                        </span>
                      )}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestions.map((suggestion, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs h-7 px-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.actions.map((action, i) => (
                        <Button
                          key={i}
                          variant="secondary"
                          size="sm"
                          onClick={() => handleActionClick(action)}
                          className="text-xs h-8 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary hover:to-secondary hover:text-white transition-all"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Space Tiles */}
                  {message.spaces && message.showTiles && (
                    <div className="mt-4 space-y-4">
                      <div className="text-sm text-muted-foreground font-medium">
                        🏢 Available Spaces in Mumbai
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {message.spaces.map((space) => (
                          <Card key={space.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                {/* Space Image */}
                                <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                  <span className="text-2xl">{space.type === 'Co-working' ? '🏢' : space.type === 'Conference' ? '🎯' : space.type === 'Event Space' ? '🎨' : '🏠'}</span>
                                </div>

                                {/* Space Details */}
                                <div>
                                  <h3 className="font-semibold text-lg">{space.name}</h3>
                                  <p className="text-sm text-muted-foreground">{space.location}</p>
                                </div>

                                {/* Rating and Reviews */}
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="text-sm font-medium">{space.rating}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    ({space.reviews} reviews)
                                  </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between">
                                  <div className="text-2xl font-bold text-primary">
                                    ₹{space.price}
                                    <span className="text-sm font-normal text-muted-foreground">/hour</span>
                                  </div>
                                  <Badge variant="outline">{space.type}</Badge>
                                </div>

                                {/* Amenities */}
                                <div className="flex flex-wrap gap-1">
                                  {space.amenities.slice(0, 3).map((amenity, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {amenity}
                                    </Badge>
                                  ))}
                                  {space.amenities.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{space.amenities.length - 3} more
                                    </Badge>
                                  )}
                                </div>

                                {/* Capacity */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>👥</span>
                                  <span>Up to {space.capacity} people</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                  <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setInputValue(`I want to book ${space.name}`)}
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setInputValue(`Book ${space.name} for tomorrow`)}
                                  >
                                    Quick Book
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-muted/30 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about spaces, booking, pricing, or events..."
                disabled={isLoading}
                className="min-h-[44px] resize-none rounded-xl border-2 focus:border-primary transition-colors"
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="h-[44px] px-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Powered by OpenRouter AI • Your conversations are secure and private
          </p>
        </div>
      </div>
    </div>
  )
}
