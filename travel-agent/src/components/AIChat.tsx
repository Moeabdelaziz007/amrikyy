import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Plane, 
  Hotel, 
  Car, 
  MapPin,
  Sparkles,
  Mic,
  MicOff,
  Paperclip,
  MoreVertical
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI travel assistant. I can help you plan trips, find flights, book hotels, and much more. What would you like to explore today?",
      timestamp: new Date(),
      suggestions: [
        "Plan a trip to Paris",
        "Find cheap flights to Tokyo",
        "Book a hotel in New York",
        "Create a 7-day itinerary for Italy"
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
        suggestions: generateSuggestions(inputValue)
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('paris')) {
      return "Paris is a wonderful destination! I can help you plan a perfect trip. Here are some highlights:\n\n🏛️ **Must-see attractions:**\n• Eiffel Tower\n• Louvre Museum\n• Notre-Dame Cathedral\n• Champs-Élysées\n\n🍷 **Best time to visit:** April-June or September-November\n\n💰 **Budget tips:** Consider staying in arrondissements 11-20 for better value\n\nWould you like me to find flights and hotels for your Paris trip?"
    }
    
    if (lowerInput.includes('flight') || lowerInput.includes('fly')) {
      return "I'd be happy to help you find flights! To get the best results, please let me know:\n\n✈️ **Flight details needed:**\n• Departure city\n• Destination city\n• Travel dates\n• Number of passengers\n• Class preference (Economy/Business/First)\n\nI can search across multiple airlines and booking platforms to find you the best deals. Would you like to start a flight search?"
    }
    
    if (lowerInput.includes('hotel') || lowerInput.includes('accommodation')) {
      return "Great! I can help you find the perfect accommodation. Here's what I need to know:\n\n🏨 **Hotel search details:**\n• Destination city\n• Check-in and check-out dates\n• Number of guests\n• Room preferences\n• Budget range\n\nI have access to major booking platforms like Booking.com, Expedia, and Airbnb to find you the best options. What's your destination?"
    }
    
    if (lowerInput.includes('itinerary') || lowerInput.includes('plan')) {
      return "I love creating travel itineraries! I can design a personalized plan based on your interests and preferences.\n\n📋 **Itinerary planning includes:**\n• Day-by-day activities\n• Restaurant recommendations\n• Transportation options\n• Budget estimates\n• Local tips and hidden gems\n\nTell me about your destination and travel style, and I'll create a detailed itinerary for you!"
    }
    
    return "I understand you're looking for travel assistance! I can help you with:\n\n✈️ **Flight bookings** - Find the best deals across airlines\n🏨 **Hotel reservations** - Compare prices and amenities\n🚗 **Car rentals** - Get the best rates for your destination\n🗺️ **Travel planning** - Create detailed itineraries\n💡 **Travel tips** - Local insights and recommendations\n\nWhat specific travel service would you like help with today?"
  }

  const generateSuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('paris')) {
      return ["Find flights to Paris", "Book hotels in Paris", "Create Paris itinerary", "Paris travel tips"]
    }
    
    if (lowerInput.includes('flight')) {
      return ["Search flights", "Compare prices", "Set price alerts", "Check baggage policies"]
    }
    
    if (lowerInput.includes('hotel')) {
      return ["Search hotels", "Compare amenities", "Read reviews", "Check availability"]
    }
    
    return ["Plan a trip", "Find deals", "Get travel tips", "Book activities"]
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false)
      toast.success('Voice input stopped')
    } else {
      setIsListening(true)
      toast.success('Voice input started - speak now!')
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false)
        setInputValue('Plan a trip to Tokyo for next month')
        toast.success('Voice input captured!')
      }, 3000)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">AI Travel Assistant</h2>
            <p className="text-sm text-gray-600">Powered by advanced AI technology</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggestions */}
        {messages.length > 0 && messages[messages.length - 1].type === 'ai' && messages[messages.length - 1].suggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-end space-x-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about travel..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={toggleVoiceInput}
              className={`absolute right-3 top-3 p-1 rounded-lg transition-colors ${
                isListening 
                  ? 'text-red-600 bg-red-100' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <div className="flex items-center space-x-1">
            <Sparkles className="h-3 w-3" />
            <span>AI Powered</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIChat
