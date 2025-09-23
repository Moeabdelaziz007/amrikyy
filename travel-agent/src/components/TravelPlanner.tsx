import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Calendar, 
  Users, 
  Plus,
  Edit3,
  Trash2,
  Clock,
  Star,
  Camera,
  Utensils,
  ShoppingBag,
  Mountain,
  Building,
  Heart,
  Share2,
  Download,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Activity {
  id: string
  name: string
  type: 'attraction' | 'restaurant' | 'shopping' | 'nature' | 'culture'
  time: string
  duration: string
  cost: number
  rating: number
  description: string
  location: string
  image: string
}

interface DayPlan {
  id: string
  date: string
  activities: Activity[]
}

interface Trip {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  travelers: number
  budget: number
  days: DayPlan[]
}

const TravelPlanner: React.FC = () => {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null)
  const [isCreatingTrip, setIsCreatingTrip] = useState(false)
  const [newTrip, setNewTrip] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 1000
  })

  const activityTypes = [
    { type: 'attraction', icon: Building, label: 'Attractions', color: 'bg-blue-500' },
    { type: 'restaurant', icon: Utensils, label: 'Restaurants', color: 'bg-green-500' },
    { type: 'shopping', icon: ShoppingBag, label: 'Shopping', color: 'bg-purple-500' },
    { type: 'nature', icon: Mountain, label: 'Nature', color: 'bg-emerald-500' },
    { type: 'culture', icon: Camera, label: 'Culture', color: 'bg-orange-500' }
  ]

  const sampleActivities: Activity[] = [
    {
      id: '1',
      name: 'Eiffel Tower',
      type: 'attraction',
      time: '09:00',
      duration: '2 hours',
      cost: 25,
      rating: 4.5,
      description: 'Iconic iron tower offering panoramic city views',
      location: 'Champ de Mars, Paris',
      image: '🗼'
    },
    {
      id: '2',
      name: 'Louvre Museum',
      type: 'culture',
      time: '11:00',
      duration: '3 hours',
      cost: 17,
      rating: 4.7,
      description: 'World\'s largest art museum and historic monument',
      location: 'Rue de Rivoli, Paris',
      image: '🏛️'
    },
    {
      id: '3',
      name: 'Le Comptoir du Relais',
      type: 'restaurant',
      time: '14:00',
      duration: '1.5 hours',
      cost: 45,
      rating: 4.3,
      description: 'Traditional French bistro with excellent cuisine',
      location: 'Carrefour de l\'Odéon, Paris',
      image: '🍽️'
    }
  ]

  const createNewTrip = () => {
    if (!newTrip.title || !newTrip.destination || !newTrip.startDate || !newTrip.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const startDate = new Date(newTrip.startDate)
    const endDate = new Date(newTrip.endDate)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const days: DayPlan[] = []
    for (let i = 0; i < daysDiff; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      days.push({
        id: `day-${i + 1}`,
        date: currentDate.toISOString().split('T')[0],
        activities: []
      })
    }

    const trip: Trip = {
      id: Date.now().toString(),
      title: newTrip.title,
      destination: newTrip.destination,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      travelers: newTrip.travelers,
      budget: newTrip.budget,
      days
    }

    setCurrentTrip(trip)
    setIsCreatingTrip(false)
    toast.success('Trip created successfully!')
  }

  const addActivityToDay = (dayId: string, activity: Activity) => {
    if (!currentTrip) return

    const updatedTrip = {
      ...currentTrip,
      days: currentTrip.days.map(day =>
        day.id === dayId
          ? { ...day, activities: [...day.activities, { ...activity, id: Date.now().toString() }] }
          : day
      )
    }

    setCurrentTrip(updatedTrip)
    toast.success(`Added ${activity.name} to your itinerary`)
  }

  const removeActivity = (dayId: string, activityId: string) => {
    if (!currentTrip) return

    const updatedTrip = {
      ...currentTrip,
      days: currentTrip.days.map(day =>
        day.id === dayId
          ? { ...day, activities: day.activities.filter(activity => activity.id !== activityId) }
          : day
      )
    }

    setCurrentTrip(updatedTrip)
    toast.success('Activity removed from itinerary')
  }

  const generateAIItinerary = () => {
    if (!currentTrip) return

    toast.success('AI is generating your personalized itinerary...')
    
    // Simulate AI generation
    setTimeout(() => {
      const updatedTrip = {
        ...currentTrip,
        days: currentTrip.days.map((day, index) => ({
          ...day,
          activities: index === 0 ? sampleActivities : []
        }))
      }
      setCurrentTrip(updatedTrip)
      toast.success('AI itinerary generated!')
    }, 2000)
  }

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find(t => t.type === type)
    return activityType ? activityType.icon : Building
  }

  const getActivityColor = (type: string) => {
    const activityType = activityTypes.find(t => t.type === type)
    return activityType ? activityType.color : 'bg-gray-500'
  }

  if (!currentTrip) {
    return (
      <div className="space-y-8">
        {/* Create New Trip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center"
        >
          <div className="mb-6">
            <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Perfect Trip</h1>
            <p className="text-gray-600 text-lg">
              Create detailed itineraries with AI-powered suggestions and recommendations
            </p>
          </div>

          <button
            onClick={() => setIsCreatingTrip(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Trip</span>
          </button>
        </motion.div>

        {/* Trip Creation Form */}
        {isCreatingTrip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Trip</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title</label>
                <input
                  type="text"
                  value={newTrip.title}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Paris Adventure"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input
                  type="text"
                  value={newTrip.destination}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="e.g., Paris, France"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={newTrip.startDate}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={newTrip.endDate}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    value={newTrip.travelers}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, travelers: parseInt(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget (USD)</label>
                <input
                  type="number"
                  value={newTrip.budget}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                  placeholder="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={createNewTrip}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Trip
              </button>
              <button
                onClick={() => setIsCreatingTrip(false)}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Trip Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{currentTrip.title}</h1>
            <div className="flex items-center space-x-4 text-blue-100">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{currentTrip.destination}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{currentTrip.startDate} - {currentTrip.endDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{currentTrip.travelers} travelers</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* AI Itinerary Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Itinerary</h2>
            <p className="text-gray-600">Let AI create a personalized itinerary based on your preferences</p>
          </div>
          <button
            onClick={generateAIItinerary}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center space-x-2"
          >
            <Sparkles className="h-5 w-5" />
            <span>Generate with AI</span>
          </button>
        </div>
      </motion.div>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        {currentTrip.days.map((day, dayIndex) => (
          <motion.div
            key={day.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + dayIndex * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Day {dayIndex + 1}
                </h3>
                <p className="text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span className="text-sm font-medium">Add Activity</span>
              </button>
            </div>

            {day.activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No activities planned for this day</p>
                <p className="text-sm">Click "Add Activity" to start planning</p>
              </div>
            ) : (
              <div className="space-y-4">
                {day.activities.map((activity, activityIndex) => {
                  const Icon = getActivityIcon(activity.type)
                  const colorClass = getActivityColor(activity.type)
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: activityIndex * 0.1 }}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`${colorClass} p-3 rounded-lg`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{activity.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{activity.time} • {activity.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{activity.location}</span>
                          </div>
                          <span>${activity.cost}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => removeActivity(day.id, activity.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Trip Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Trip Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {currentTrip.days.reduce((total, day) => total + day.activities.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ${currentTrip.days.reduce((total, day) => 
                total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.cost, 0), 0
              )}
            </div>
            <div className="text-sm text-gray-600">Estimated Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {currentTrip.days.length}
            </div>
            <div className="text-sm text-gray-600">Days Planned</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TravelPlanner
