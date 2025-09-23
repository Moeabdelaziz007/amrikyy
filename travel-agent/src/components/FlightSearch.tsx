import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plane, 
  Calendar, 
  Users, 
  ArrowRightLeft, 
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  TrendingUp,
  Shield,
  Wifi
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Flight {
  id: string
  airline: string
  departure: string
  arrival: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  stops: number
  aircraft: string
  rating: number
  amenities: string[]
}

const FlightSearch: React.FC = () => {
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  })

  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [searchResults, setSearchResults] = useState<Flight[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)

  const popularDestinations = [
    { city: 'New York', code: 'NYC', country: 'USA' },
    { city: 'London', code: 'LHR', country: 'UK' },
    { city: 'Paris', code: 'CDG', country: 'France' },
    { city: 'Tokyo', code: 'NRT', country: 'Japan' },
    { city: 'Dubai', code: 'DXB', country: 'UAE' },
    { city: 'Sydney', code: 'SYD', country: 'Australia' }
  ]

  const airlines = [
    { name: 'American Airlines', logo: 'AA', color: 'bg-blue-600' },
    { name: 'Delta Air Lines', logo: 'DL', color: 'bg-red-600' },
    { name: 'United Airlines', logo: 'UA', color: 'bg-blue-800' },
    { name: 'Lufthansa', logo: 'LH', color: 'bg-yellow-600' },
    { name: 'Emirates', logo: 'EK', color: 'bg-red-700' },
    { name: 'British Airways', logo: 'BA', color: 'bg-blue-900' }
  ]

  const mockFlights: Flight[] = [
    {
      id: '1',
      airline: 'American Airlines',
      departure: 'JFK',
      arrival: 'LHR',
      departureTime: '08:30',
      arrivalTime: '20:45',
      duration: '7h 15m',
      price: 850,
      stops: 0,
      aircraft: 'Boeing 777',
      rating: 4.2,
      amenities: ['WiFi', 'Entertainment', 'Meals']
    },
    {
      id: '2',
      airline: 'British Airways',
      departure: 'JFK',
      arrival: 'LHR',
      departureTime: '14:20',
      arrivalTime: '02:35+1',
      duration: '7h 15m',
      price: 920,
      stops: 0,
      aircraft: 'Airbus A350',
      rating: 4.5,
      amenities: ['WiFi', 'Entertainment', 'Meals', 'Lounge Access']
    },
    {
      id: '3',
      airline: 'Delta Air Lines',
      departure: 'JFK',
      arrival: 'LHR',
      departureTime: '22:15',
      arrivalTime: '10:30+1',
      duration: '7h 15m',
      price: 780,
      stops: 0,
      aircraft: 'Boeing 767',
      rating: 4.0,
      amenities: ['WiFi', 'Entertainment']
    }
  ]

  const handleSearch = async () => {
    if (!searchForm.from || !searchForm.to || !searchForm.departureDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSearching(true)
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockFlights)
      setIsSearching(false)
      toast.success('Found flights for your search!')
    }, 2000)
  }

  const handleBookFlight = (flight: Flight) => {
    setSelectedFlight(flight)
    toast.success(`Selected ${flight.airline} flight for $${flight.price}`)
  }

  const swapLocations = () => {
    setSearchForm(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }))
  }

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Plane className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Flight Search</h1>
        </div>

        {/* Trip Type */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setIsRoundTrip(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !isRoundTrip
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            One Way
          </button>
          <button
            onClick={() => setIsRoundTrip(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isRoundTrip
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Round Trip
          </button>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchForm.from}
                onChange={(e) => setSearchForm(prev => ({ ...prev, from: e.target.value }))}
                placeholder="City or Airport"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchForm.to}
                onChange={(e) => setSearchForm(prev => ({ ...prev, to: e.target.value }))}
                placeholder="City or Airport"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={swapLocations}
                className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={searchForm.departureDate}
                onChange={(e) => setSearchForm(prev => ({ ...prev, departureDate: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Return Date */}
          {isRoundTrip && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={searchForm.returnDate}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, returnDate: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Passengers and Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={searchForm.passengers}
                onChange={(e) => setSearchForm(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={searchForm.class}
              onChange={(e) => setSearchForm(prev => ({ ...prev, class: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Search Flights</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Popular Destinations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((dest, index) => (
            <button
              key={index}
              onClick={() => setSearchForm(prev => ({ ...prev, to: dest.city }))}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="font-semibold text-gray-900">{dest.city}</div>
              <div className="text-sm text-gray-600">{dest.code}</div>
              <div className="text-xs text-gray-500">{dest.country}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Available Flights</h2>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>

          {searchResults.map((flight) => (
            <motion.div
              key={flight.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold">
                    {flight.airline.split(' ').map(word => word[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{flight.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${flight.price}</div>
                  <div className="text-sm text-gray-600">per person</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{flight.departureTime}</div>
                  <div className="text-sm text-gray-600">{flight.departure}</div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="flex items-center">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <div className="px-2 text-xs text-gray-500">{flight.duration}</div>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-1">
                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</div>
                  <div className="text-sm text-gray-600">{flight.arrival}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{flight.aircraft}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {flight.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        {amenity === 'WiFi' && <Wifi className="h-4 w-4" />}
                        {amenity === 'Entertainment' && <span>📺</span>}
                        {amenity === 'Meals' && <span>🍽️</span>}
                        {amenity === 'Lounge Access' && <span>🏛️</span>}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleBookFlight(flight)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Select Flight
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Selected Flight Details */}
      {selectedFlight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Flight Selected</h3>
          </div>
          <p className="text-green-800 mb-4">
            You've selected {selectedFlight.airline} flight from {selectedFlight.departure} to {selectedFlight.arrival} 
            for ${selectedFlight.price}. Ready to proceed with booking?
          </p>
          <div className="flex space-x-4">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Continue Booking
            </button>
            <button 
              onClick={() => setSelectedFlight(null)}
              className="border border-green-600 text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Change Selection
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default FlightSearch
