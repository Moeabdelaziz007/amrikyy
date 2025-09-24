import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Hotel,
  Calendar,
  Users,
  Search,
  Filter,
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Pool,
  Utensils,
  Heart,
  Share2,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface HotelData {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  originalPrice?: number;
  image: string;
  amenities: string[];
  distance: string;
  reviews: number;
  description: string;
  provider: string;
}

const HotelSearch: React.FC = () => {
  const [searchForm, setSearchForm] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1,
  });

  const [searchResults, setSearchResults] = useState<HotelData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelData | null>(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    rating: 0,
    amenities: [] as string[],
  });

  const popularDestinations = [
    { city: 'New York', country: 'USA', image: '🏙️' },
    { city: 'Paris', country: 'France', image: '🗼' },
    { city: 'London', country: 'UK', image: '🏰' },
    { city: 'Tokyo', country: 'Japan', image: '🏯' },
    { city: 'Dubai', country: 'UAE', image: '🏢' },
    { city: 'Sydney', country: 'Australia', image: '🏖️' },
  ];

  const amenities = [
    { name: 'Free WiFi', icon: Wifi },
    { name: 'Parking', icon: Car },
    { name: 'Restaurant', icon: Utensils },
    { name: 'Pool', icon: Pool },
    { name: 'Gym', icon: Dumbbell },
    { name: 'Breakfast', icon: Coffee },
  ];

  const mockHotels: HotelData[] = [
    {
      id: '1',
      name: 'The Grand Plaza Hotel',
      location: 'Manhattan, New York',
      rating: 4.5,
      price: 299,
      originalPrice: 399,
      image: '🏨',
      amenities: ['Free WiFi', 'Restaurant', 'Gym', 'Pool'],
      distance: '0.2 miles from center',
      reviews: 1247,
      description:
        'Luxury hotel in the heart of Manhattan with stunning city views and world-class amenities.',
      provider: 'Booking.com',
    },
    {
      id: '2',
      name: 'Boutique Hotel Paris',
      location: 'Champs-Élysées, Paris',
      rating: 4.8,
      price: 189,
      originalPrice: 249,
      image: '🏛️',
      amenities: ['Free WiFi', 'Breakfast', 'Restaurant'],
      distance: '0.1 miles from center',
      reviews: 892,
      description:
        'Charming boutique hotel near the famous Champs-Élysées with authentic Parisian charm.',
      provider: 'Expedia',
    },
    {
      id: '3',
      name: 'Modern Suites Tokyo',
      location: 'Shibuya, Tokyo',
      rating: 4.3,
      price: 159,
      image: '🏢',
      amenities: ['Free WiFi', 'Gym', 'Restaurant'],
      distance: '0.5 miles from center',
      reviews: 634,
      description:
        'Contemporary hotel in vibrant Shibuya district with modern amenities and excellent service.',
      provider: 'Trip.com',
    },
    {
      id: '4',
      name: 'Cozy Airbnb Apartment',
      location: 'Camden, London',
      rating: 4.7,
      price: 89,
      image: '🏠',
      amenities: ['Free WiFi', 'Kitchen', 'Parking'],
      distance: '1.2 miles from center',
      reviews: 423,
      description:
        'Beautiful apartment in trendy Camden with full kitchen and local neighborhood charm.',
      provider: 'Airbnb',
    },
  ];

  const handleSearch = async () => {
    if (
      !searchForm.destination ||
      !searchForm.checkIn ||
      !searchForm.checkOut
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockHotels);
      setIsSearching(false);
      toast.success('Found hotels for your search!');
    }, 2000);
  };

  const handleBookHotel = (hotel: HotelData) => {
    setSelectedHotel(hotel);
    toast.success(`Selected ${hotel.name} for $${hotel.price}/night`);
  };

  const handleAmenityFilter = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const filteredHotels = searchResults.filter(hotel => {
    const priceInRange =
      hotel.price >= filters.priceRange[0] &&
      hotel.price <= filters.priceRange[1];
    const ratingMatch = hotel.rating >= filters.rating;
    const amenitiesMatch =
      filters.amenities.length === 0 ||
      filters.amenities.every(amenity => hotel.amenities.includes(amenity));

    return priceInRange && ratingMatch && amenitiesMatch;
  });

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Hotel className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Hotel Search</h1>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Destination */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchForm.destination}
                onChange={e =>
                  setSearchForm(prev => ({
                    ...prev,
                    destination: e.target.value,
                  }))
                }
                placeholder="City, hotel, or area"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Check-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={searchForm.checkIn}
                onChange={e =>
                  setSearchForm(prev => ({ ...prev, checkIn: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={searchForm.checkOut}
                onChange={e =>
                  setSearchForm(prev => ({ ...prev, checkOut: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Guests and Rooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guests & Rooms
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={`${searchForm.guests} guests, ${searchForm.rooms} room`}
                onChange={e => {
                  const [guests, rooms] = e.target.value
                    .split(' guests, ')
                    .map(v => parseInt(v));
                  setSearchForm(prev => ({ ...prev, guests, rooms }));
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1 guests, 1 room">1 guest, 1 room</option>
                <option value="2 guests, 1 room">2 guests, 1 room</option>
                <option value="2 guests, 2 rooms">2 guests, 2 rooms</option>
                <option value="4 guests, 2 rooms">4 guests, 2 rooms</option>
                <option value="6 guests, 3 rooms">6 guests, 3 rooms</option>
              </select>
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
              <span>Search Hotels</span>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((dest, index) => (
            <button
              key={index}
              onClick={() =>
                setSearchForm(prev => ({ ...prev, destination: dest.city }))
              }
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="text-2xl mb-2">{dest.image}</div>
              <div className="font-semibold text-gray-900">{dest.city}</div>
              <div className="text-sm text-gray-600">{dest.country}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Filters and Results */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-6">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="font-bold text-gray-900">Filters</h3>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={e =>
                      setFilters(prev => ({
                        ...prev,
                        priceRange: [
                          prev.priceRange[0],
                          parseInt(e.target.value),
                        ],
                      }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label
                      key={rating}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            rating: parseInt(e.target.value),
                          }))
                        }
                        className="text-blue-600"
                      />
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="space-y-2">
                  {amenities.map((amenity, index) => {
                    const Icon = amenity.icon;
                    return (
                      <label
                        key={index}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity.name)}
                          onChange={() => handleAmenityFilter(amenity.name)}
                          className="text-blue-600 rounded"
                        />
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">
                          {amenity.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredHotels.length} hotels found
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

            {filteredHotels.map(hotel => (
              <motion.div
                key={hotel.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex space-x-6">
                  {/* Hotel Image */}
                  <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-4xl">
                    {hotel.image}
                  </div>

                  {/* Hotel Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-600 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{hotel.location}</span>
                          <span className="text-sm">•</span>
                          <span className="text-sm">{hotel.distance}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(hotel.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {hotel.rating}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({hotel.reviews} reviews)
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {hotel.provider}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {hotel.description}
                    </p>

                    {/* Amenities */}
                    <div className="flex items-center space-x-4 mb-4">
                      {hotel.amenities.slice(0, 4).map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 text-xs text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>{amenity}</span>
                        </div>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="text-xs text-gray-500">
                          +{hotel.amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            ${hotel.price}
                          </span>
                          <span className="text-sm text-gray-600">/night</span>
                          {hotel.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${hotel.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          {hotel.originalPrice &&
                            `Save $${hotel.originalPrice - hotel.price} per night`}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            View Details
                          </span>
                        </button>
                        <button
                          onClick={() => handleBookHotel(hotel)}
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

      {/* Selected Hotel Details */}
      {selectedHotel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Hotel className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Hotel Selected</h3>
          </div>
          <p className="text-green-800 mb-4">
            You've selected {selectedHotel.name} in {selectedHotel.location}
            for ${selectedHotel.price}/night. Ready to proceed with booking?
          </p>
          <div className="flex space-x-4">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Continue Booking
            </button>
            <button
              onClick={() => setSelectedHotel(null)}
              className="border border-green-600 text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Change Selection
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HotelSearch;
