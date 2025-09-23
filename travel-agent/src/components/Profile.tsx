import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3,
  Save,
  X,
  Camera,
  Bell,
  Shield,
  CreditCard,
  Heart,
  Plane,
  Star,
  Award,
  Settings,
  LogOut,
  Globe,
  Languages
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  avatar: string
  preferences: {
    language: string
    currency: string
    notifications: boolean
    marketing: boolean
  }
  stats: {
    tripsCompleted: number
    countriesVisited: number
    totalSpent: number
    averageRating: number
  }
  recentTrips: Array<{
    id: string
    destination: string
    date: string
    status: 'completed' | 'upcoming' | 'cancelled'
  }>
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Traveler',
    email: 'john.traveler@email.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    joinDate: '2023-01-15',
    avatar: '👤',
    preferences: {
      language: 'English',
      currency: 'USD',
      notifications: true,
      marketing: false
    },
    stats: {
      tripsCompleted: 12,
      countriesVisited: 8,
      totalSpent: 15420,
      averageRating: 4.8
    },
    recentTrips: [
      { id: '1', destination: 'Paris, France', date: '2024-03-15', status: 'completed' },
      { id: '2', destination: 'Tokyo, Japan', date: '2024-05-20', status: 'upcoming' },
      { id: '3', destination: 'London, UK', date: '2024-02-10', status: 'completed' },
      { id: '4', destination: 'Dubai, UAE', date: '2024-01-05', status: 'completed' }
    ]
  })

  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    location: userProfile.location
  })

  const handleEdit = () => {
    setIsEditing(true)
    setEditForm({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      location: userProfile.location
    })
  }

  const handleSave = () => {
    setUserProfile(prev => ({
      ...prev,
      ...editForm
    }))
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      location: userProfile.location
    })
  }

  const handlePreferenceChange = (key: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
    toast.success('Preferences updated!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              {userProfile.avatar}
            </div>
            <button className="absolute bottom-0 right-0 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{userProfile.name}</h1>
            <div className="flex items-center space-x-4 text-blue-100">
              <div className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>{userProfile.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{userProfile.location}</span>
              </div>
            </div>
            <div className="mt-2 text-blue-100">
              Member since {new Date(userProfile.joinDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Trips Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{userProfile.stats.tripsCompleted}</p>
            </div>
            <Plane className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Countries Visited</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{userProfile.stats.countriesVisited}</p>
            </div>
            <Globe className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${userProfile.stats.totalSpent.toLocaleString()}</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{userProfile.stats.averageRating}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-sm font-medium">Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span className="text-sm font-medium">Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{userProfile.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{userProfile.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{userProfile.phone}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{userProfile.location}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={userProfile.preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={userProfile.preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Receive updates about your trips</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userProfile.preferences.notifications}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                  <p className="text-sm text-gray-600">Receive travel deals and promotions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userProfile.preferences.marketing}
                    onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Trips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Trips</h2>
          <button className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {userProfile.recentTrips.map((trip) => (
            <div key={trip.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{trip.destination}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(trip.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Award className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Explorer</h3>
            <p className="text-sm text-gray-600">Visited 5+ countries</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Star className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Top Reviewer</h3>
            <p className="text-sm text-gray-600">High rating contributor</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Plane className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Frequent Flyer</h3>
            <p className="text-sm text-gray-600">10+ trips completed</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Profile
