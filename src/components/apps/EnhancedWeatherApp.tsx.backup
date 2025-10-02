import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Eye, 
  Thermometer, 
  Gauge, 
  Navigation, 
  MapPin, 
  Search, 
  RefreshCw, 
  AlertTriangle,
  Sunrise,
  Sunset,
  Zap,
  ThermometerSun,
  ThermometerSnow,
  Umbrella,
  EyeIcon,
  Compass,
  BarChart3
} from 'lucide-react';

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  timestamp: Date;
  hourlyForecast: Array<{
    time: string;
    temperature: number;
    condition: string;
    precipitation: number;
    humidity: number;
    windSpeed: number;
  }>;
  dailyForecast: Array<{
    day: string;
    date: string;
    high: number;
    low: number;
    condition: string;
    description: string;
    precipitation: number;
    humidity: number;
    windSpeed: number;
    sunrise: string;
    sunset: string;
  }>;
  alerts?: Array<{
    title: string;
    description: string;
    severity: 'low' | 'moderate' | 'high' | 'extreme';
    startTime: string;
    endTime: string;
  }>;
}

interface LocationData {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export const EnhancedWeatherApp: React.FC = () => {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'current' | 'forecast' | 'hourly'>('current');
  const [searchLocation, setSearchLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      loadWeatherData(currentLocation.lat, currentLocation.lon);
    }
  }, [currentLocation, unit]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const locationResponse = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
            );
            const locationData = await locationResponse.json();
            
            if (locationData.length > 0) {
              setCurrentLocation({
                name: locationData[0].name,
                country: locationData[0].country,
                lat: latitude,
                lon: longitude
              });
            }
          } catch (error) {
            console.error('Failed to get location name:', error);
            setCurrentLocation({
              name: 'Current Location',
              country: '',
              lat: latitude,
              lon: longitude
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to default location
          setCurrentLocation({
            name: 'New York',
            country: 'US',
            lat: 40.7128,
            lon: -74.0060
          });
        }
      );
    } else {
      // Fallback to default location
      setCurrentLocation({
        name: 'New York',
        country: 'US',
        lat: 40.7128,
        lon: -74.0060
      });
    }
  };

  const loadWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenWeather API key not configured');
      }

      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit === 'celsius' ? 'metric' : 'imperial'}&appid=${apiKey}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit === 'celsius' ? 'metric' : 'imperial'}&appid=${apiKey}`)
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      // Process current weather data
      const weather: WeatherData = {
        location: currentData.name,
        country: currentData.sys.country,
        temperature: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        windDirection: currentData.wind.deg,
        pressure: currentData.main.pressure,
        visibility: currentData.visibility / 1000, // Convert to km
        uvIndex: 0, // UV index requires separate API call
        sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date(),
        hourlyForecast: forecastData.list.slice(0, 8).map((item: any) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: Math.round(item.main.temp),
          condition: item.weather[0].main,
          precipitation: item.pop * 100,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed
        })),
        dailyForecast: []
      };

      // Process 5-day forecast (group by day)
      const dailyData: { [key: string]: any[] } = {};
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(item);
      });

      weather.dailyForecast = Object.entries(dailyData).slice(0, 5).map(([date, items]) => {
        const temps = items.map(item => item.main.temp);
        const humidity = items.map(item => item.main.humidity);
        const windSpeeds = items.map(item => item.wind.speed);
        
        return {
          day: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
          date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
          high: Math.round(Math.max(...temps)),
          low: Math.round(Math.min(...temps)),
          condition: items[0].weather[0].main,
          description: items[0].weather[0].description,
          precipitation: Math.max(...items.map(item => item.pop * 100)),
          humidity: Math.round(humidity.reduce((a, b) => a + b, 0) / humidity.length),
          windSpeed: Math.round(windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length),
          sunrise: '',
          sunset: ''
        };
      });

      setWeatherData(weather);
    } catch (error) {
      console.error('Failed to load weather data:', error);
      setError('Failed to load weather data. Using mock data for demonstration.');
      setWeatherData(getMockWeatherData());
    } finally {
      setLoading(false);
    }
  };

  const handleSearchLocation = async () => {
    if (!searchLocation.trim()) return;
    
    setIsSearching(true);
    try {
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenWeather API key not configured');
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchLocation)}&limit=1&appid=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search location');
      }

      const locationData = await response.json();
      
      if (locationData.length > 0) {
        const location = locationData[0];
        setCurrentLocation({
          name: location.name,
          country: location.country,
          lat: location.lat,
          lon: location.lon
        });
        setSearchLocation('');
      } else {
        setError('Location not found');
      }
    } catch (error) {
      console.error('Failed to search location:', error);
      setError('Failed to search location');
    } finally {
      setIsSearching(false);
    }
  };

  const getWeatherIcon = (condition: string, size: string = 'w-8 h-8') => {
    const iconClass = `${size} text-yellow-400`;
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className={iconClass} />;
      case 'clouds':
      case 'partly cloudy':
        return <Cloud className={iconClass} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className={iconClass} />;
      case 'snow':
        return <CloudSnow className={iconClass} />;
      case 'thunderstorm':
        return <Zap className={iconClass} />;
      default:
        return <Sun className={iconClass} />;
    }
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const formatTemperature = (temp: number) => {
    return `${temp}°${unit === 'celsius' ? 'C' : 'F'}`;
  };

  const getMockWeatherData = (): WeatherData => ({
    location: 'New York',
    country: 'US',
    temperature: 22,
    feelsLike: 25,
    condition: 'Partly Cloudy',
    description: 'partly cloudy',
    humidity: 65,
    windSpeed: 12,
    windDirection: 245,
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    sunrise: '06:30',
    sunset: '19:45',
    timestamp: new Date(),
    hourlyForecast: [
      { time: '12:00', temperature: 22, condition: 'Clouds', precipitation: 10, humidity: 65, windSpeed: 12 },
      { time: '13:00', temperature: 24, condition: 'Clear', precipitation: 5, humidity: 60, windSpeed: 10 },
      { time: '14:00', temperature: 26, condition: 'Clear', precipitation: 0, humidity: 55, windSpeed: 8 },
      { time: '15:00', temperature: 28, condition: 'Clear', precipitation: 0, humidity: 50, windSpeed: 6 },
      { time: '16:00', temperature: 27, condition: 'Clouds', precipitation: 15, humidity: 58, windSpeed: 9 },
      { time: '17:00', temperature: 25, condition: 'Rain', precipitation: 80, humidity: 75, windSpeed: 15 },
      { time: '18:00', temperature: 23, condition: 'Rain', precipitation: 60, humidity: 80, windSpeed: 18 },
      { time: '19:00', temperature: 21, condition: 'Clouds', precipitation: 20, humidity: 70, windSpeed: 12 }
    ],
    dailyForecast: [
      { day: 'Mon', date: 'Jan 22', high: 28, low: 18, condition: 'Clear', description: 'clear sky', precipitation: 0, humidity: 55, windSpeed: 8, sunrise: '06:30', sunset: '19:45' },
      { day: 'Tue', date: 'Jan 23', high: 26, low: 16, condition: 'Clouds', description: 'few clouds', precipitation: 10, humidity: 60, windSpeed: 10, sunrise: '06:29', sunset: '19:46' },
      { day: 'Wed', date: 'Jan 24', high: 24, low: 14, condition: 'Rain', description: 'light rain', precipitation: 70, humidity: 75, windSpeed: 15, sunrise: '06:28', sunset: '19:47' },
      { day: 'Thu', date: 'Jan 25', high: 22, low: 12, condition: 'Clouds', description: 'overcast clouds', precipitation: 30, humidity: 65, windSpeed: 12, sunrise: '06:27', sunset: '19:48' },
      { day: 'Fri', date: 'Jan 26', high: 25, low: 15, condition: 'Clear', description: 'clear sky', precipitation: 5, humidity: 58, windSpeed: 9, sunrise: '06:26', sunset: '19:49' }
    ],
    alerts: [
      { title: 'Weather Alert', description: 'Heavy rain expected tomorrow afternoon', severity: 'moderate', startTime: '2024-01-24 14:00', endTime: '2024-01-24 18:00' }
    ]
  });

  if (loading) {
    return (
      <div className="flex h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading weather data...</p>
            <p className="text-gray-400">Getting current conditions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Sun className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Weather Forecast</h1>
              <p className="text-gray-400">
                {weatherData ? `${weatherData.location}, ${weatherData.country}` : 'Loading location...'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setUnit('celsius')}
                variant={unit === 'celsius' ? 'default' : 'outline'}
                size="sm"
                className={unit === 'celsius' ? 'bg-blue-600 text-white' : 'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white'}
              >
                °C
              </Button>
              <Button
                onClick={() => setUnit('fahrenheit')}
                variant={unit === 'fahrenheit' ? 'default' : 'outline'}
                size="sm"
                className={unit === 'fahrenheit' ? 'bg-blue-600 text-white' : 'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white'}
              >
                °F
              </Button>
            </div>
            <Button
              onClick={getCurrentLocation}
              variant="outline"
              className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-white/10 bg-black/20">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
                placeholder="Search for a city..."
                className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
                disabled={isSearching}
              />
            </div>
            <Button
              onClick={handleSearchLocation}
              disabled={!searchLocation.trim() || isSearching}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSearching ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Search
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Weather Alerts */}
        {weatherData?.alerts && weatherData.alerts.length > 0 && (
          <div className="p-6 border-b border-white/10">
            <div className="space-y-3">
              {weatherData.alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  alert.severity === 'extreme' ? 'bg-red-500/20 border-red-500/30' :
                  alert.severity === 'high' ? 'bg-orange-500/20 border-orange-500/30' :
                  alert.severity === 'moderate' ? 'bg-yellow-500/20 border-yellow-500/30' :
                  'bg-blue-500/20 border-blue-500/30'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                      alert.severity === 'extreme' ? 'text-red-400' :
                      alert.severity === 'high' ? 'text-orange-400' :
                      alert.severity === 'moderate' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`} />
                    <div>
                      <h4 className="text-white font-semibold">{alert.title}</h4>
                      <p className="text-gray-300 text-sm mt-1">{alert.description}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(alert.startTime).toLocaleString()} - {new Date(alert.endTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'current', label: 'Current', icon: Thermometer },
            { id: 'forecast', label: '5-Day Forecast', icon: BarChart3 },
            { id: 'hourly', label: 'Hourly', icon: Compass }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-blue-400 text-blue-400 bg-blue-400/10'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {weatherData && (
              <>
                {selectedTab === 'current' && (
                  <div className="space-y-6">
                    {/* Current Weather */}
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-6">
                            {getWeatherIcon(weatherData.condition, 'w-20 h-20')}
                            <div>
                              <h2 className="text-6xl font-bold text-white">
                                {formatTemperature(weatherData.temperature)}
                              </h2>
                              <p className="text-xl text-gray-300 capitalize">{weatherData.description}</p>
                              <p className="text-gray-400">
                                Feels like {formatTemperature(weatherData.feelsLike)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">
                              Last updated: {weatherData.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        {/* Weather Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Droplets className="w-6 h-6 text-blue-400" />
                            </div>
                            <p className="text-2xl font-semibold text-white">{weatherData.humidity}%</p>
                            <p className="text-gray-400 text-sm">Humidity</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Wind className="w-6 h-6 text-green-400" />
                            </div>
                            <p className="text-2xl font-semibold text-white">
                              {weatherData.windSpeed} {unit === 'celsius' ? 'm/s' : 'mph'}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {getWindDirection(weatherData.windDirection)}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Gauge className="w-6 h-6 text-purple-400" />
                            </div>
                            <p className="text-2xl font-semibold text-white">{weatherData.pressure} hPa</p>
                            <p className="text-gray-400 text-sm">Pressure</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <EyeIcon className="w-6 h-6 text-cyan-400" />
                            </div>
                            <p className="text-2xl font-semibold text-white">{weatherData.visibility} km</p>
                            <p className="text-gray-400 text-sm">Visibility</p>
                          </div>
                        </div>

                        {/* Sunrise/Sunset */}
                        <div className="flex items-center justify-center space-x-8 mt-8 pt-6 border-t border-white/10">
                          <div className="flex items-center space-x-3">
                            <Sunrise className="w-6 h-6 text-orange-400" />
                            <div>
                              <p className="text-white font-semibold">{weatherData.sunrise}</p>
                              <p className="text-gray-400 text-sm">Sunrise</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Sunset className="w-6 h-6 text-red-400" />
                            <div>
                              <p className="text-white font-semibold">{weatherData.sunset}</p>
                              <p className="text-gray-400 text-sm">Sunset</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {selectedTab === 'forecast' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">5-Day Forecast</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {weatherData.dailyForecast.map((day, index) => (
                        <Card key={index} className="bg-white/5 border-white/10">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <p className="text-white font-semibold">{day.day}</p>
                              <p className="text-gray-400 text-sm">{day.date}</p>
                              <div className="my-3">
                                {getWeatherIcon(day.condition, 'w-12 h-12')}
                              </div>
                              <div className="flex items-center justify-center space-x-2 mb-2">
                                <ThermometerSun className="w-4 h-4 text-red-400" />
                                <span className="text-white font-semibold">{formatTemperature(day.high)}</span>
                                <ThermometerSnow className="w-4 h-4 text-blue-400" />
                                <span className="text-gray-400">{formatTemperature(day.low)}</span>
                              </div>
                              <p className="text-gray-300 text-sm capitalize mb-2">{day.description}</p>
                              <div className="flex items-center justify-center space-x-3 text-xs text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <Umbrella className="w-3 h-3" />
                                  <span>{day.precipitation}%</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Droplets className="w-3 h-3" />
                                  <span>{day.humidity}%</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Wind className="w-3 h-3" />
                                  <span>{day.windSpeed} {unit === 'celsius' ? 'm/s' : 'mph'}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === 'hourly' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">24-Hour Forecast</h3>
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {weatherData.hourlyForecast.map((hour, index) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                              <div className="flex items-center space-x-4">
                                <p className="text-white font-medium w-16">{hour.time}</p>
                                <div className="flex items-center space-x-3">
                                  {getWeatherIcon(hour.condition, 'w-8 h-8')}
                                  <div>
                                    <p className="text-white font-semibold">{formatTemperature(hour.temperature)}</p>
                                    <p className="text-gray-400 text-sm capitalize">{hour.condition}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-6 text-sm text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <Umbrella className="w-4 h-4" />
                                  <span>{hour.precipitation}%</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Droplets className="w-4 h-4" />
                                  <span>{hour.humidity}%</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Wind className="w-4 h-4" />
                                  <span>{hour.windSpeed} {unit === 'celsius' ? 'm/s' : 'mph'}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};