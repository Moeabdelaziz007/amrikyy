import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Car, 
  Calendar, 
  MapPin, 
  Search,
  Filter,
  Star,
  Users,
  Fuel,
  Settings,
  Shield,
  Clock,
  CreditCard,
  Wifi,
  Snowflake
} from 'lucide-react'
import toast from 'react-hot-toast'

interface CarData {
  id: string
  name: string
  category: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  features: string[]
  transmission: string
  fuelType: string
  seats: number
  luggage: number
  provider: string
  location: string
  distance: string
}

const CarRental: React.FC = () => {
  const [searchForm, setSearchForm] = useState({
    pickupLocation: '',
    returnLocation: '',
    pickupDate: '',
    returnDate: '',
    pickupTime: '10:00',
    returnTime: '10:00'
  })

  const [searchResults, setSearchResults] = useState<CarData[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null)
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 200],
    transmission: 'all',
    fuelType: 'all'
  })

  const carCategories = [
    { name: 'Economy', icon: '🚗', description: 'Budget-friendly options' },
    { name: 'Compact', icon: '🚙', description: 'Perfect for city driving' },
    { name: 'SUV', icon: '🚙', description: 'Spacious and comfortable' },
    { name: 'Luxury', icon: '🏎️', description: 'Premium vehicles' },
    { name: 'Convertible', icon: '🚗', description: 'Open-top driving' },
    { name: 'Electric', icon: '⚡', description: 'Eco-friendly options' }
  ]

  const popularLocations = [
    { city: 'New York', airport: 'JFK Airport', code: 'NYC' },
    { city: 'Los Angeles', airport: 'LAX Airport', code: 'LAX' },
    { city: 'London', airport: 'Heathrow', code: 'LHR' },
    { city: 'Paris', airport: 'Charles de Gaulle', code: 'CDG' },
    { city: 'Tokyo', airport: 'Narita', code: 'NRT' },
    { city: 'Dubai', airport: 'DXB Airport', code: 'DXB' }
  ]

  const mockCars: CarData[] = [
    {
      id: '1',
      name: 'Toyota Corolla',
      category: 'Economy',
      image: '🚗',
      price: 45,
      originalPrice: 65,
      rating: 4.2,
      reviews: 234,
      features: ['Air Conditioning', 'Bluetooth', 'GPS Navigation'],
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      seats: 5,
      luggage: 2,
      provider: 'Hertz',
      location: 'JFK Airport',
      distance: '0.1 miles from terminal'
    },
    {
      id: '2',
      name: 'BMW 3 Series',
      category: 'Luxury',
      image: '🏎️',
      price: 89,
      rating: 4.7,
      reviews: 156,
      features: ['Leather Seats', 'Premium Audio', 'Heated Seats', 'Sunroof'],
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      seats: 5,
      luggage: 3,
      provider: 'Avis',
      location: 'LAX Airport',
      distance: '0.2 miles from terminal'
    },
    {
      id: '3',
      name: 'Tesla Model 3',
      category: 'Electric',
      image: '⚡',
      price: 75,
      rating: 4.8,
      reviews: 189,
      features: ['Autopilot', 'Supercharging', 'Premium Interior', 'Over-the-Air Updates'],
      transmission: 'Automatic',
      fuelType: 'Electric',
      seats: 5,
      luggage: 2,
      provider: 'Enterprise',
      location: 'Heathrow Airport',
      distance: '0.3 miles from terminal'
    },
    {
      id: '4',
      name: 'Jeep Wrangler',
      category: 'SUV',
      image: '🚙',
      price: 95,
      rating: 4.4,
      reviews: 98,
      features: ['4WD', 'Off-Road Capable', 'Convertible Top', 'Trail Rated'],
      transmission: 'Manual',
      fuelType: 'Gasoline',
      seats: 5,
      luggage: 4,
      provider: 'Budget',
      location: 'CDG Airport',
      distance: '0.1 miles from terminal'
    }
  ]

  const handleSearch = async () => {
    if (!searchForm.pickupLocation || !searchForm.pickupDate || !searchForm.returnDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSearching(true)
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockCars)
      setIsSearching(false)
      toast.success('Found cars for your search!')
    }, 2000)
  }

  const handleBookCar = (car: CarData) => {
    setSelectedCar(car)
    toast.success(`Selected ${car.name} for $${car.price}/day`)
  }

  const filteredCars = searchResults.filter(car => {
    const categoryMatch = filters.category === 'all' || car.category.toLowerCase() === filters.category
    const priceMatch = car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]
    const transmissionMatch = filters.transmission === 'all' || car.transmission.toLowerCase() === filters.transmission
    const fuelMatch = filters.fuelType === 'all' || car.fuelType.toLowerCase() === filters.fuelType
    
    return categoryMatch && priceMatch && transmissionMatch && fuelMatch
  })

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Car className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Car Rental</h1>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchForm.pickupLocation}
                onChange={(e) => setSearchForm(prev => ({ ...prev, pickupLocation: e.target.value }))}
                placeholder="City, airport, or address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Return Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchForm.returnLocation}
                onChange={(e) => setSearchForm(prev => ({ ...prev, returnLocation: e.target.value }))}
                placeholder="Same as pickup"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Pickup Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={searchForm.pickupDate}
                onChange={(e) => setSearchForm(prev => ({ ...prev, pickupDate: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
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

          {/* Pickup Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="time"
                value={searchForm.pickupTime}
                onChange={(e) => setSearchForm(prev => ({ ...prev, pickupTime: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Return Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="time"
                value={searchForm.returnTime}
                onChange={(e) => setSearchForm(prev => ({ ...prev, returnTime: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
              <span>Search Cars</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Car Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Car Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {carCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setFilters(prev => ({ ...prev, category: category.name.toLowerCase() }))}
              className={`p-4 border rounded-lg text-center transition-colors ${
                filters.category === category.name.toLowerCase()
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-semibold text-gray-900 text-sm">{category.name}</div>
              <div className="text-xs text-gray-600 mt-1">{category.description}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Popular Locations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Pickup Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularLocations.map((location, index) => (
            <button
              key={index}
              onClick={() => setSearchForm(prev => ({ ...prev, pickupLocation: location.airport }))}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="font-semibold text-gray-900">{location.city}</div>
              <div className="text-sm text-gray-600">{location.airport}</div>
              <div className="text-xs text-gray-500">{location.code}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-6">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="font-bold text-gray-900">Filters</h3>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (per day)</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Transmission */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Transmission</label>
                <div className="space-y-2">
                  {['All', 'Automatic', 'Manual'].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="transmission"
                        value={type.toLowerCase()}
                        checked={filters.transmission === type.toLowerCase()}
                        onChange={(e) => setFilters(prev => ({ ...prev, transmission: e.target.value }))}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Fuel Type</label>
                <div className="space-y-2">
                  {['All', 'Gasoline', 'Electric', 'Hybrid'].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fuelType"
                        value={type.toLowerCase()}
                        checked={filters.fuelType === type.toLowerCase()}
                        onChange={(e) => setFilters(prev => ({ ...prev, fuelType: e.target.value }))}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredCars.length} cars available
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                  <option>Price (Low to High)</option>
                  <option>Price (High to Low)</option>
                  <option>Rating</option>
                  <option>Distance</option>
                </select>
              </div>
            </div>

            {filteredCars.map((car) => (
              <motion.div
                key={car.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex space-x-6">
                  {/* Car Image */}
                  <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-4xl">
                    {car.image}
                  </div>

                  {/* Car Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{car.name}</h3>
                        <div className="flex items-center space-x-2 text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{car.location}</span>
                          <span className="text-sm">•</span>
                          <span className="text-sm">{car.distance}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{car.rating}</span>
                          <span className="text-sm text-gray-600">({car.reviews})</span>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {car.provider}
                        </span>
                      </div>
                    </div>

                    {/* Car Specs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{car.seats} seats</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Settings className="h-4 w-4" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Fuel className="h-4 w-4" />
                        <span>{car.fuelType}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>🧳</span>
                        <span>{car.luggage} bags</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex items-center space-x-4 mb-4">
                      {car.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                      {car.features.length > 3 && (
                        <span className="text-xs text-gray-500">+{car.features.length - 3} more</span>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">${car.price}</span>
                          <span className="text-sm text-gray-600">/day</span>
                          {car.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">${car.originalPrice}</span>
                          )}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          {car.originalPrice && `Save $${car.originalPrice - car.price} per day`}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
                          <Shield className="h-4 w-4" />
                          <span className="text-sm font-medium">View Details</span>
                        </button>
                        <button
                          onClick={() => handleBookCar(car)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Selected Car Details */}
      {selectedCar && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Car className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Car Selected</h3>
          </div>
          <p className="text-green-800 mb-4">
            You've selected {selectedCar.name} from {selectedCar.provider} 
            for ${selectedCar.price}/day. Ready to proceed with booking?
          </p>
          <div className="flex space-x-4">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Continue Booking
            </button>
            <button 
              onClick={() => setSelectedCar(null)}
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

export default CarRental
