import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, Hotel, MapPin, Calendar, Star, Search } from 'lucide-react';

const AITravelAgency = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [flightSearch, setFlightSearch] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });

  const [hotelSearch, setHotelSearch] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      // Mock destinations for now
      setDestinations([
        {
          id: 'paris_france',
          name: 'Paris',
          country: 'France',
          bestTimeToVisit: ['April', 'May', 'September', 'October'],
          localCurrency: 'EUR',
          safetyLevel: 'medium',
          attractions: ['Eiffel Tower', 'Louvre Museum']
        },
        {
          id: 'tokyo_japan',
          name: 'Tokyo',
          country: 'Japan',
          bestTimeToVisit: ['March', 'April', 'May'],
          localCurrency: 'JPY',
          safetyLevel: 'high',
          attractions: ['Senso-ji Temple', 'Tokyo Skytree']
        }
      ]);
    } catch (error) {
      console.error('Failed to load destinations:', error);
    }
  };

  const handleFlightSearch = async () => {
    if (!flightSearch.origin || !flightSearch.destination || !flightSearch.departureDate) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Mock flight results
      setTimeout(() => {
        setSearchResults([
          {
            airline: 'Airline A',
            flightNumber: 'AA123',
            departure: { time: '08:00', airport: flightSearch.origin },
            duration: '4h 00m',
            price: { amount: 299, currency: 'USD' }
          }
        ]);
        setActiveTab('results');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Flight search failed:', error);
      setLoading(false);
    }
  };

  const handleHotelSearch = async () => {
    if (!hotelSearch.destination || !hotelSearch.checkIn || !hotelSearch.checkOut) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Mock hotel results
      setTimeout(() => {
        setSearchResults([
          {
            name: 'Grand Hotel',
            address: '123 Main St, City Center',
            starRating: 4,
            price: { perNight: 150, currency: 'USD' }
          }
        ]);
        setActiveTab('results');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Hotel search failed:', error);
      setLoading(false);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">AI Travel Agency</h1>
        <p className="text-muted-foreground text-lg">
          Let our AI-powered agents help you plan your perfect trip
        </p>
      </div>

      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeTab === 'search' ? 'default' : 'outline'}
          onClick={() => setActiveTab('search')}
        >
          Search & Book
        </Button>
        <Button 
          variant={activeTab === 'results' ? 'default' : 'outline'}
          onClick={() => setActiveTab('results')}
        >
          Results
        </Button>
        <Button 
          variant={activeTab === 'destinations' ? 'default' : 'outline'}
          onClick={() => setActiveTab('destinations')}
        >
          Destinations
        </Button>
      </div>

      {activeTab === 'search' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Flight Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin">From</Label>
                  <Input
                    id="origin"
                    value={flightSearch.origin}
                    onChange={(e) => setFlightSearch({...flightSearch, origin: e.target.value})}
                    placeholder="City or Airport"
                  />
                </div>
                <div>
                  <Label htmlFor="destination">To</Label>
                  <Input
                    id="destination"
                    value={flightSearch.destination}
                    onChange={(e) => setFlightSearch({...flightSearch, destination: e.target.value})}
                    placeholder="City or Airport"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure">Departure</Label>
                  <Input
                    id="departure"
                    type="date"
                    value={flightSearch.departureDate}
                    onChange={(e) => setFlightSearch({...flightSearch, departureDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="return">Return (Optional)</Label>
                  <Input
                    id="return"
                    type="date"
                    value={flightSearch.returnDate}
                    onChange={(e) => setFlightSearch({...flightSearch, returnDate: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                onClick={handleFlightSearch} 
                disabled={loading}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Searching...' : 'Search Flights'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="w-5 h-5" />
                Hotel Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hotel-destination">Destination</Label>
                <Input
                  id="hotel-destination"
                  value={hotelSearch.destination}
                  onChange={(e) => setHotelSearch({...hotelSearch, destination: e.target.value})}
                  placeholder="City or Hotel"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkin">Check-in</Label>
                  <Input
                    id="checkin"
                    type="date"
                    value={hotelSearch.checkIn}
                    onChange={(e) => setHotelSearch({...hotelSearch, checkIn: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="checkout">Check-out</Label>
                  <Input
                    id="checkout"
                    type="date"
                    value={hotelSearch.checkOut}
                    onChange={(e) => setHotelSearch({...hotelSearch, checkOut: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                onClick={handleHotelSearch} 
                disabled={loading}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Searching...' : 'Search Hotels'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            <div className="grid gap-4">
              {searchResults.map((result, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{result.airline || result.name}</h3>
                        <p className="text-muted-foreground">
                          {result.flightNumber || result.address}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {result.departure?.time || result.checkIn}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {result.departure?.airport || result.destination}
                          </span>
                          {result.duration && (
                            <span>{result.duration}</span>
                          )}
                          {result.starRating && (
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              {result.starRating}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {formatPrice(result.price?.amount || result.price?.perNight || 0, result.price?.currency || 'USD')}
                        </div>
                        {result.price?.perNight && (
                          <div className="text-sm text-muted-foreground">per night</div>
                        )}
                        <Button className="mt-2">Book Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No results yet. Start by searching for flights or hotels.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'destinations' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations.map((destination) => (
            <Card key={destination.id}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{destination.name}</h3>
                  <p className="text-muted-foreground">{destination.country}</p>
                  <div className="space-y-1">
                    <p className="text-sm"><strong>Best Time:</strong> {destination.bestTimeToVisit?.join(', ')}</p>
                    <p className="text-sm"><strong>Currency:</strong> {destination.localCurrency}</p>
                    <p className="text-sm"><strong>Safety:</strong> {destination.safetyLevel}</p>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Explore {destination.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AITravelAgency;
