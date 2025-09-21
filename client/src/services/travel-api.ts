// Travel API Service - Frontend <-> Backend for travel features
import { FlightSearchParams, HotelSearchParams, TravelBookingRequest } from '@/types/travel';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_VERSION = 'v1';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class TravelApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/${API_VERSION}`;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Clear authentication token
  clearAuthToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('Travel API request failed:', error);
      throw error;
    }
  }

  // GET request
  private async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  // POST request
  private async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Travel API methods
  async getDestinations() {
    return this.get('/travel/destinations');
  }

  async getDestination(id: string) {
    return this.get(`/travel/destinations/${id}`);
  }

  async searchFlights(params: FlightSearchParams) {
    return this.post('/travel/flights/search', params);
  }

  async searchHotels(params: HotelSearchParams) {
    return this.post('/travel/hotels/search', params);
  }

  async getRecommendations(destination: string) {
    return this.post('/travel/recommendations', { destination });
  }

  async bookTravel(request: TravelBookingRequest) {
    return this.post('/travel/book', request);
  }

  async getBookings() {
    return this.get('/travel/bookings');
  }

  async getBooking(id: string) {
    return this.get(`/travel/bookings/${id}`);
  }

  async getAIInsights() {
    return this.get('/travel/ai/insights');
  }
}

export const travelApi = new TravelApiService();
