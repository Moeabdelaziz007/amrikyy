import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  feelsLike: number;
  description: string;
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export const EnhancedWeatherApp: React.FC = () => {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'current' | 'forecast' | 'hourly'>('current');
  const [location, setLocation] = useState('New York');
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

  // Mock weather data for demonstration
  const mockWeatherData: WeatherData = {
    location: 'New York, NY',
    temperature: 22,
    condition: 'Partly Cloudy',
    icon: '⛅',
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    feelsLike: 24,
    description: 'Partly cloudy with occasional sunshine'
  };

  const mockForecast: ForecastDay[] = [
    {
      date: '2024-01-16',
      high: 25,
      low: 18,
      condition: 'Sunny',
      icon: '☀️',
      precipitation: 0
    },
    {
      date: '2024-01-17',
      high: 23,
      low: 16,
      condition: 'Cloudy',
      icon: '☁️',
      precipitation: 20
    },
    {
      date: '2024-01-18',
      high: 20,
      low: 14,
      condition: 'Rainy',
      icon: '🌧️',
      precipitation: 80
    },
    {
      date: '2024-01-19',
      high: 18,
      low: 12,
      condition: 'Stormy',
      icon: '⛈️',
      precipitation: 90
    },
    {
      date: '2024-01-20',
      high: 21,
      low: 15,
      condition: 'Clear',
      icon: '🌤️',
      precipitation: 5
    }
  ];

  const mockHourlyForecast: HourlyForecast[] = [
    { time: '12:00', temperature: 22, condition: 'Partly Cloudy', icon: '⛅', precipitation: 0 },
    { time: '13:00', temperature: 23, condition: 'Sunny', icon: '☀️', precipitation: 0 },
    { time: '14:00', temperature: 24, condition: 'Sunny', icon: '☀️', precipitation: 0 },
    { time: '15:00', temperature: 25, condition: 'Partly Cloudy', icon: '⛅', precipitation: 0 },
    { time: '16:00', temperature: 24, condition: 'Cloudy', icon: '☁️', precipitation: 10 },
    { time: '17:00', temperature: 23, condition: 'Cloudy', icon: '☁️', precipitation: 20 },
    { time: '18:00', temperature: 21, condition: 'Rainy', icon: '🌧️', precipitation: 40 },
    { time: '19:00', temperature: 19, condition: 'Rainy', icon: '🌧️', precipitation: 60 },
    { time: '20:00', temperature: 18, condition: 'Stormy', icon: '⛈️', precipitation: 80 },
    { time: '21:00', temperature: 17, condition: 'Stormy', icon: '⛈️', precipitation: 90 },
    { time: '22:00', temperature: 16, condition: 'Rainy', icon: '🌧️', precipitation: 70 },
    { time: '23:00', temperature: 15, condition: 'Cloudy', icon: '☁️', precipitation: 30 }
  ];

  useEffect(() => {
    // Simulate API call
    const loadWeatherData = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setWeatherData(mockWeatherData);
        setForecast(mockForecast);
        setHourlyForecast(mockHourlyForecast);
        setError(null);
      } catch (err) {
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [location]);

  const convertTemperature = (temp: number): number => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  const getTemperatureUnit = (): string => {
    return unit === 'celsius' ? '°C' : '°F';
  };

  const getWindSpeedUnit = (): string => {
    return unit === 'celsius' ? 'km/h' : 'mph';
  };

  const getVisibilityUnit = (): string => {
    return unit === 'celsius' ? 'km' : 'miles';
  };

  const getUVIndexLevel = (index: number): { level: string; color: string } => {
    if (index <= 2) return { level: 'Low', color: '#10B981' };
    if (index <= 5) return { level: 'Moderate', color: '#F59E0B' };
    if (index <= 7) return { level: 'High', color: '#EF4444' };
    if (index <= 10) return { level: 'Very High', color: '#8B5CF6' };
    return { level: 'Extreme', color: '#DC2626' };
  };

  const getBackgroundGradient = (condition: string): string => {
    const gradients = {
      'Sunny': 'linear-gradient(135deg, #FFD700, #FFA500)',
      'Partly Cloudy': 'linear-gradient(135deg, #87CEEB, #B0E0E6)',
      'Cloudy': 'linear-gradient(135deg, #708090, #A9A9A9)',
      'Rainy': 'linear-gradient(135deg, #4682B4, #5F9EA0)',
      'Stormy': 'linear-gradient(135deg, #2F4F4F, #696969)',
      'Clear': 'linear-gradient(135deg, #87CEEB, #E0F6FF)',
      'Snowy': 'linear-gradient(135deg, #F0F8FF, #E6E6FA)'
    };
    return gradients[condition as keyof typeof gradients] || gradients['Clear'];
  };

  if (loading) {
    return (
      <div className="enhanced-weather-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="enhanced-weather-app">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Weather Error</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="enhanced-weather-app">
        <div className="no-data">
          <h3>No weather data available</h3>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="enhanced-weather-app"
      style={{ background: getBackgroundGradient(weatherData.condition) }}
    >
      {/* Header */}
      <div className="weather-header">
        <div className="location-search">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name"
            className="location-input"
          />
          <button className="search-btn">🔍</button>
        </div>
        
        <div className="unit-toggle">
          <button
            className={`unit-btn ${unit === 'celsius' ? 'active' : ''}`}
            onClick={() => setUnit('celsius')}
          >
            °C
          </button>
          <button
            className={`unit-btn ${unit === 'fahrenheit' ? 'active' : ''}`}
            onClick={() => setUnit('fahrenheit')}
          >
            °F
          </button>
        </div>
      </div>

      {/* Current Weather */}
      {selectedTab === 'current' && (
        <div className="current-weather">
          <div className="main-weather">
            <div className="weather-icon">
              <span className="icon">{weatherData.icon}</span>
            </div>
            <div className="weather-info">
              <div className="temperature">
                {convertTemperature(weatherData.temperature)}
                <span className="unit">{getTemperatureUnit()}</span>
              </div>
              <div className="condition">{weatherData.condition}</div>
              <div className="location">{weatherData.location}</div>
              <div className="description">{weatherData.description}</div>
            </div>
          </div>

          <div className="weather-details">
            <div className="detail-card">
              <div className="detail-icon">🌡️</div>
              <div className="detail-info">
                <div className="detail-label">Feels Like</div>
                <div className="detail-value">
                  {convertTemperature(weatherData.feelsLike)}{getTemperatureUnit()}
                </div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">💧</div>
              <div className="detail-info">
                <div className="detail-label">Humidity</div>
                <div className="detail-value">{weatherData.humidity}%</div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">💨</div>
              <div className="detail-info">
                <div className="detail-label">Wind Speed</div>
                <div className="detail-value">
                  {weatherData.windSpeed} {getWindSpeedUnit()}
                </div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">📊</div>
              <div className="detail-info">
                <div className="detail-label">Pressure</div>
                <div className="detail-value">{weatherData.pressure} hPa</div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">👁️</div>
              <div className="detail-info">
                <div className="detail-label">Visibility</div>
                <div className="detail-value">
                  {weatherData.visibility} {getVisibilityUnit()}
                </div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">☀️</div>
              <div className="detail-info">
                <div className="detail-label">UV Index</div>
                <div 
                  className="detail-value"
                  style={{ color: getUVIndexLevel(weatherData.uvIndex).color }}
                >
                  {weatherData.uvIndex} ({getUVIndexLevel(weatherData.uvIndex).level})
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forecast */}
      {selectedTab === 'forecast' && (
        <div className="forecast-weather">
          <div className="forecast-header">
            <h3>5-Day Forecast</h3>
          </div>
          <div className="forecast-list">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-date">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="forecast-icon">
                  <span className="icon">{day.icon}</span>
                </div>
                <div className="forecast-condition">{day.condition}</div>
                <div className="forecast-temps">
                  <span className="high">{convertTemperature(day.high)}°</span>
                  <span className="low">{convertTemperature(day.low)}°</span>
                </div>
                <div className="forecast-precipitation">
                  <span className="precip-icon">💧</span>
                  <span className="precip-value">{day.precipitation}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hourly Forecast */}
      {selectedTab === 'hourly' && (
        <div className="hourly-weather">
          <div className="hourly-header">
            <h3>24-Hour Forecast</h3>
          </div>
          <div className="hourly-list">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="hourly-item">
                <div className="hourly-time">{hour.time}</div>
                <div className="hourly-icon">
                  <span className="icon">{hour.icon}</span>
                </div>
                <div className="hourly-temp">
                  {convertTemperature(hour.temperature)}°
                </div>
                <div className="hourly-precipitation">
                  <span className="precip-icon">💧</span>
                  <span className="precip-value">{hour.precipitation}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="weather-tabs">
        <button
          className={`tab-btn ${selectedTab === 'current' ? 'active' : ''}`}
          onClick={() => setSelectedTab('current')}
        >
          <span className="tab-icon">🌡️</span>
          <span className="tab-label">Current</span>
        </button>
        <button
          className={`tab-btn ${selectedTab === 'forecast' ? 'active' : ''}`}
          onClick={() => setSelectedTab('forecast')}
        >
          <span className="tab-icon">📅</span>
          <span className="tab-label">5-Day</span>
        </button>
        <button
          className={`tab-btn ${selectedTab === 'hourly' ? 'active' : ''}`}
          onClick={() => setSelectedTab('hourly')}
        >
          <span className="tab-icon">⏰</span>
          <span className="tab-label">Hourly</span>
        </button>
      </div>

      {/* Weather Map */}
      <div className="weather-map">
        <div className="map-header">
          <h4>Weather Map</h4>
          <button className="map-btn">🗺️ View Map</button>
        </div>
        <div className="map-placeholder">
          <div className="map-icon">🗺️</div>
          <p>Interactive weather map</p>
          <button className="open-map-btn">Open Full Map</button>
        </div>
      </div>
    </div>
  );
};
