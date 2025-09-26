import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';

interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  description: string;
  image: string;
  rating: number;
  priceRange: 'budget' | 'mid-range' | 'luxury';
  bestTimeToVisit: string[];
  attractions: string[];
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
  };
  aiRecommendation: {
    score: number;
    reasons: string[];
    personalized: boolean;
  };
}

interface Flight {
  id: string;
  airline: string;
  departure: {
    airport: string;
    city: string;
    time: Date;
  };
  arrival: {
    airport: string;
    city: string;
    time: Date;
  };
  duration: string;
  price: number;
  stops: number;
  class: 'economy' | 'business' | 'first';
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  image: string;
  description: string;
  availability: boolean;
}

interface Trip {
  id: string;
  title: string;
  destination: Destination;
  startDate: Date;
  endDate: Date;
  travelers: number;
  budget: number;
  status: 'planning' | 'booked' | 'completed' | 'cancelled';
  flights: Flight[];
  hotels: Hotel[];
  activities: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AIRecommendation {
  id: string;
  type: 'destination' | 'activity' | 'hotel' | 'flight';
  title: string;
  description: string;
  confidence: number;
  personalized: boolean;
  reasons: string[];
}

export const AITravelAgencyApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'discover' | 'plan' | 'book' | 'trips'>('discover');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Partial<Trip>>({});
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);

  // Mock data for demonstration
  const mockDestinations: Destination[] = [
    {
      id: '1',
      name: 'Tokyo',
      country: 'Japan',
      continent: 'Asia',
      description: 'A vibrant metropolis blending traditional culture with cutting-edge technology',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      rating: 4.8,
      priceRange: 'mid-range',
      bestTimeToVisit: ['March-May', 'September-November'],
      attractions: ['Senso-ji Temple', 'Tokyo Skytree', 'Shibuya Crossing', 'Tsukiji Market'],
      weather: { temperature: 22, condition: 'Sunny', humidity: 65 },
      aiRecommendation: {
        score: 95,
        reasons: ['Perfect weather', 'Cultural experiences', 'Great food scene'],
        personalized: true
      }
    },
    {
      id: '2',
      name: 'Paris',
      country: 'France',
      continent: 'Europe',
      description: 'The City of Light, famous for its art, fashion, and romantic atmosphere',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800',
      rating: 4.7,
      priceRange: 'luxury',
      bestTimeToVisit: ['April-June', 'September-October'],
      attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées'],
      weather: { temperature: 18, condition: 'Partly Cloudy', humidity: 70 },
      aiRecommendation: {
        score: 92,
        reasons: ['Romantic atmosphere', 'World-class museums', 'Excellent cuisine'],
        personalized: true
      }
    },
    {
      id: '3',
      name: 'Bali',
      country: 'Indonesia',
      continent: 'Asia',
      description: 'Tropical paradise with stunning beaches, temples, and lush landscapes',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800',
      rating: 4.6,
      priceRange: 'budget',
      bestTimeToVisit: ['April-October'],
      attractions: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
      weather: { temperature: 28, condition: 'Sunny', humidity: 80 },
      aiRecommendation: {
        score: 88,
        reasons: ['Affordable luxury', 'Beautiful beaches', 'Rich culture'],
        personalized: true
      }
    }
  ];

  const mockFlights: Flight[] = [
    {
      id: '1',
      airline: 'Japan Airlines',
      departure: { airport: 'NRT', city: 'Tokyo', time: new Date('2024-02-15T08:00:00') },
      arrival: { airport: 'LAX', city: 'Los Angeles', time: new Date('2024-02-15T12:00:00') },
      duration: '11h 30m',
      price: 850,
      stops: 0,
      class: 'economy'
    },
    {
      id: '2',
      airline: 'Air France',
      departure: { airport: 'CDG', city: 'Paris', time: new Date('2024-02-20T14:30:00') },
      arrival: { airport: 'JFK', city: 'New York', time: new Date('2024-02-20T18:45:00') },
      duration: '8h 15m',
      price: 1200,
      stops: 0,
      class: 'business'
    }
  ];

  const mockHotels: Hotel[] = [
    {
      id: '1',
      name: 'The Ritz-Carlton Tokyo',
      location: 'Tokyo, Japan',
      rating: 4.9,
      pricePerNight: 450,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      description: 'Luxury hotel in the heart of Tokyo with stunning city views',
      availability: true
    },
    {
      id: '2',
      name: 'Hotel Plaza Athénée',
      location: 'Paris, France',
      rating: 4.8,
      pricePerNight: 650,
      amenities: ['WiFi', 'Spa', 'Restaurant', 'Concierge', 'Room Service'],
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      description: 'Iconic luxury hotel on Avenue Montaigne',
      availability: true
    }
  ];

  const mockTrips: Trip[] = [
    {
      id: '1',
      title: 'Tokyo Adventure',
      destination: mockDestinations[0],
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-22'),
      travelers: 2,
      budget: 5000,
      status: 'planning',
      flights: [mockFlights[0]],
      hotels: [mockHotels[0]],
      activities: ['Temple Tour', 'Sushi Making Class', 'Tokyo Skytree Visit'],
      notes: 'First time visiting Japan, very excited!',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    }
  ];

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (!user) {
      setLoading(false);
      return;
    }

    // Load user data
    const loadData = async () => {
      try {
        // Generate AI recommendations
        generateAIRecommendations();
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const generateAIRecommendations = () => {
    const recommendations: AIRecommendation[] = [
      {
        id: '1',
        type: 'destination',
        title: 'Perfect for You: Tokyo, Japan',
        description: 'Based on your preferences for culture and technology, Tokyo offers the perfect blend',
        confidence: 95,
        personalized: true,
        reasons: ['Matches your cultural interests', 'Great food scene', 'Safe for solo travel']
      },
      {
        id: '2',
        type: 'activity',
        title: 'Try a Traditional Tea Ceremony',
        description: 'Experience authentic Japanese culture with a traditional tea ceremony',
        confidence: 88,
        personalized: true,
        reasons: ['Cultural immersion', 'Unique experience', 'Great for photos']
      },
      {
        id: '3',
        type: 'hotel',
        title: 'Stay in Shibuya District',
        description: 'Central location with easy access to major attractions and nightlife',
        confidence: 92,
        personalized: true,
        reasons: ['Central location', 'Great transportation', 'Vibrant area']
      }
    ];
    setAiRecommendations(recommendations);
  };

  const searchDestinations = (query: string) => {
    return mockDestinations.filter(dest =>
      dest.name.toLowerCase().includes(query.toLowerCase()) ||
      dest.country.toLowerCase().includes(query.toLowerCase()) ||
      dest.continent.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getPriceRangeColor = (range: string): string => {
    const colors = {
      budget: '#10B981',
      'mid-range': '#F59E0B',
      luxury: '#EF4444'
    };
    return colors[range as keyof typeof colors] || '#6B7280';
  };

  const getPriceRangeText = (range: string): string => {
    const texts = {
      budget: '$',
      'mid-range': '$$',
      luxury: '$$$'
    };
    return texts[range as keyof typeof texts] || '';
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const createNewTrip = () => {
    setCurrentTrip({
      title: '',
      travelers: 1,
      budget: 0,
      status: 'planning',
      flights: [],
      hotels: [],
      activities: [],
      notes: ''
    });
    setShowBookingModal(true);
  };

  const bookTrip = async () => {
    if (!currentTrip.destination || !currentTrip.startDate || !currentTrip.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const tripData = {
        ...currentTrip,
        userId: user?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'trips'), tripData);
      setShowBookingModal(false);
      alert('Trip booked successfully!');
    } catch (error) {
      console.error('Error booking trip:', error);
      alert('Error booking trip. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="ai-travel-agency-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading AI Travel Agency...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ai-travel-agency-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access AI Travel Agency</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-travel-agency-app">
      {/* Header */}
      <div className="travel-header">
        <div className="header-left">
          <h2>✈️ AI Travel Agency</h2>
          <p>Discover, Plan, and Book your perfect trip with AI</p>
        </div>
        <div className="header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="create-trip-btn" onClick={createNewTrip}>
            + Plan Trip
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="travel-tabs">
        <button
          className={`tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          🌍 Discover
        </button>
        <button
          className={`tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('plan')}
        >
          📋 Plan
        </button>
        <button
          className={`tab-btn ${activeTab === 'book' ? 'active' : ''}`}
          onClick={() => setActiveTab('book')}
        >
          🎫 Book
        </button>
        <button
          className={`tab-btn ${activeTab === 'trips' ? 'active' : ''}`}
          onClick={() => setActiveTab('trips')}
        >
          🧳 My Trips
        </button>
      </div>

      {/* Content */}
      <div className="travel-content">
        {activeTab === 'discover' && (
          <div className="discover-tab">
            {/* AI Recommendations */}
            <div className="ai-recommendations">
              <h3>🤖 AI Recommendations for You</h3>
              <div className="recommendations-grid">
                {aiRecommendations.map(rec => (
                  <div key={rec.id} className="recommendation-card">
                    <div className="rec-header">
                      <h4>{rec.title}</h4>
                      <div className="confidence-badge">
                        {rec.confidence}% match
                      </div>
                    </div>
                    <p className="rec-description">{rec.description}</p>
                    <div className="rec-reasons">
                      {rec.reasons.map((reason, index) => (
                        <span key={index} className="reason-tag">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destinations */}
            <div className="destinations-section">
              <h3>🌍 Popular Destinations</h3>
              <div className="destinations-grid">
                {searchDestinations(searchQuery).map(destination => (
                  <div
                    key={destination.id}
                    className="destination-card"
                    onClick={() => setSelectedDestination(destination)}
                  >
                    <div className="destination-image">
                      <img src={destination.image} alt={destination.name} />
                      <div className="destination-overlay">
                        <div className="destination-rating">
                          ⭐ {destination.rating}
                        </div>
                        <div 
                          className="price-range"
                          style={{ backgroundColor: getPriceRangeColor(destination.priceRange) }}
                        >
                          {getPriceRangeText(destination.priceRange)}
                        </div>
                      </div>
                    </div>
                    <div className="destination-info">
                      <h4>{destination.name}</h4>
                      <p className="destination-country">{destination.country}</p>
                      <p className="destination-description">{destination.description}</p>
                      <div className="destination-weather">
                        <span>🌡️ {destination.weather.temperature}°C</span>
                        <span>{destination.weather.condition}</span>
                      </div>
                      <div className="ai-score">
                        <span className="ai-label">AI Score:</span>
                        <span className="ai-score-value">{destination.aiRecommendation.score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plan' && (
          <div className="plan-tab">
            <div className="planning-tools">
              <div className="tool-card">
                <div className="tool-icon">🗓️</div>
                <h4>Itinerary Planner</h4>
                <p>Create detailed day-by-day plans</p>
                <button className="tool-btn">Start Planning</button>
              </div>
              <div className="tool-card">
                <div className="tool-icon">💰</div>
                <h4>Budget Calculator</h4>
                <p>Track and optimize your travel budget</p>
                <button className="tool-btn">Calculate Budget</button>
              </div>
              <div className="tool-card">
                <div className="tool-icon">📱</div>
                <h4>Travel Checklist</h4>
                <p>Never forget important items</p>
                <button className="tool-btn">Create Checklist</button>
              </div>
              <div className="tool-card">
                <div className="tool-icon">🌤️</div>
                <h4>Weather Forecast</h4>
                <p>Check weather for your destination</p>
                <button className="tool-btn">View Forecast</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'book' && (
          <div className="book-tab">
            <div className="booking-section">
              <h3>✈️ Flights</h3>
              <div className="flights-list">
                {mockFlights.map(flight => (
                  <div key={flight.id} className="flight-card">
                    <div className="flight-info">
                      <div className="flight-route">
                        <div className="airport">
                          <span className="airport-code">{flight.departure.airport}</span>
                          <span className="airport-city">{flight.departure.city}</span>
                          <span className="flight-time">{flight.departure.time.toLocaleTimeString()}</span>
                        </div>
                        <div className="flight-arrow">→</div>
                        <div className="airport">
                          <span className="airport-code">{flight.arrival.airport}</span>
                          <span className="airport-city">{flight.arrival.city}</span>
                          <span className="flight-time">{flight.arrival.time.toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="flight-details">
                        <span>{flight.airline}</span>
                        <span>{flight.duration}</span>
                        <span>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}</span>
                      </div>
                    </div>
                    <div className="flight-price">
                      <span className="price">{formatPrice(flight.price)}</span>
                      <button className="book-btn">Book</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="booking-section">
              <h3>🏨 Hotels</h3>
              <div className="hotels-list">
                {mockHotels.map(hotel => (
                  <div key={hotel.id} className="hotel-card">
                    <div className="hotel-image">
                      <img src={hotel.image} alt={hotel.name} />
                    </div>
                    <div className="hotel-info">
                      <h4>{hotel.name}</h4>
                      <p className="hotel-location">{hotel.location}</p>
                      <div className="hotel-rating">
                        ⭐ {hotel.rating}
                      </div>
                      <p className="hotel-description">{hotel.description}</p>
                      <div className="hotel-amenities">
                        {hotel.amenities.map(amenity => (
                          <span key={amenity} className="amenity-tag">{amenity}</span>
                        ))}
                      </div>
                    </div>
                    <div className="hotel-price">
                      <span className="price-per-night">{formatPrice(hotel.pricePerNight)}/night</span>
                      <button className="book-btn">Book</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trips' && (
          <div className="trips-tab">
            <div className="trips-header">
              <h3>🧳 My Trips</h3>
              <button className="create-trip-btn" onClick={createNewTrip}>
                + New Trip
              </button>
            </div>
            <div className="trips-list">
              {mockTrips.map(trip => (
                <div key={trip.id} className="trip-card">
                  <div className="trip-image">
                    <img src={trip.destination.image} alt={trip.destination.name} />
                    <div className="trip-status">
                      <span className={`status-badge ${trip.status}`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                  <div className="trip-info">
                    <h4>{trip.title}</h4>
                    <p className="trip-destination">{trip.destination.name}, {trip.destination.country}</p>
                    <div className="trip-dates">
                      <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                    </div>
                    <div className="trip-details">
                      <span>👥 {trip.travelers} travelers</span>
                      <span>💰 {formatPrice(trip.budget)} budget</span>
                    </div>
                    <div className="trip-notes">
                      <p>{trip.notes}</p>
                    </div>
                  </div>
                  <div className="trip-actions">
                    <button className="action-btn">View Details</button>
                    <button className="action-btn">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <div className="modal-header">
              <h3>Plan Your Trip</h3>
              <button 
                className="modal-close"
                onClick={() => setShowBookingModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Trip Title</label>
                <input
                  type="text"
                  placeholder="e.g., Tokyo Adventure"
                  value={currentTrip.title || ''}
                  onChange={(e) => setCurrentTrip(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label>Destination</label>
                <select aria-label="Select option"
                  value={currentTrip.destination?.id || ''}
                  onChange={(e) => {
                    const dest = mockDestinations.find(d => d.id === e.target.value);
                    setCurrentTrip(prev => ({ ...prev, destination: dest || undefined }));
                  }}
                >
                  <option value="">Select destination</option>
                  {mockDestinations.map(dest => (
                    <option key={dest.id} value={dest.id}>
                      {dest.name}, {dest.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={currentTrip.startDate ? currentTrip.startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setCurrentTrip(prev => ({ 
                      ...prev, 
                      startDate: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={currentTrip.endDate ? currentTrip.endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setCurrentTrip(prev => ({ 
                      ...prev, 
                      endDate: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Number of Travelers</label>
                  <input
                    type="number"
                    min="1"
                    value={currentTrip.travelers || 1}
                    onChange={(e) => setCurrentTrip(prev => ({ 
                      ...prev, 
                      travelers: parseInt(e.target.value) || 1 
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label>Budget</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={currentTrip.budget || ''}
                    onChange={(e) => setCurrentTrip(prev => ({ 
                      ...prev, 
                      budget: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea aria-label="Text area"
                  placeholder="Any special requests or notes..."
                  value={currentTrip.notes || ''}
                  onChange={(e) => setCurrentTrip(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="save-btn"
                onClick={bookTrip}
              >
                Create Trip
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
