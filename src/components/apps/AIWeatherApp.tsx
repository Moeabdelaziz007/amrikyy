import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
}

export const AIWeatherApp = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [weather, setWeather] = useState<WeatherData>({
    location: 'New York',
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: 'Today', high: 25, low: 18, condition: 'Sunny' },
      { day: 'Tomorrow', high: 23, low: 16, condition: 'Cloudy' },
      { day: 'Wednesday', high: 20, low: 14, condition: 'Rain' },
      { day: 'Thursday', high: 24, low: 17, condition: 'Partly Cloudy' },
      { day: 'Friday', high: 26, low: 19, condition: 'Sunny' },
    ],
  });

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun'))
      return <Sun className="w-8 h-8 text-yellow-500" />;
    if (conditionLower.includes('cloud'))
      return <Cloud className="w-8 h-8 text-gray-400" />;
    if (conditionLower.includes('rain'))
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (conditionLower.includes('snow'))
      return <CloudSnow className="w-8 h-8 text-blue-200" />;
    return <Cloud className="w-8 h-8 text-gray-400" />;
  };

  const searchWeather = () => {
    if (searchLocation.trim()) {
      // Simulate API call
      setWeather(prev => ({
        ...prev,
        location: searchLocation,
        temperature: Math.floor(Math.random() * 30) + 10,
        condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rain', 'Snow'][
          Math.floor(Math.random() * 5)
        ],
      }));
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 glass">
        <div className="flex items-center gap-3 mb-4">
          <Cloud className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">AI Weather</h2>
            <p className="text-sm text-muted-foreground">
              Smart weather insights
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            placeholder="Enter city name..."
            value={searchLocation}
            onChange={e => setSearchLocation(e.target.value)}
            className="flex-1 glass border-white/20 bg-white/5"
            onKeyPress={e => e.key === 'Enter' && searchWeather()}
          />
          <Button
            onClick={searchWeather}
            className="bg-gradient-primary hover:opacity-90"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="p-4">
        <Card className="glass border-white/20 mb-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{weather.location}</h3>
                <div className="flex items-center gap-2 mt-2">
                  {getWeatherIcon(weather.condition)}
                  <span className="text-lg">{weather.condition}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">
                  {weather.temperature}°C
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Droplets className="w-4 h-4" />
                    {weather.humidity}%
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="w-4 h-4" />
                    {weather.windSpeed} km/h
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forecast */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {weather.forecast.map((day, index) => (
            <Card key={index} className="glass border-white/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <h4 className="font-semibold mb-2">{day.day}</h4>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {day.condition}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary font-semibold">
                      {day.high}°
                    </span>
                    <span className="text-muted-foreground">{day.low}°</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
