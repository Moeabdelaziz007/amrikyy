// Travel-related shared types

export type TravelClass = 'economy' | 'premium_economy' | 'business' | 'first';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: TravelClass;
  preferences?: {
    preferredAirlines?: string[];
    maxStops?: number;
    preferredAirports?: string[];
    seatPreferences?: string[];
  };
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  preferences?: {
    starRating?: number;
    amenities?: string[];
    location?: string;
    maxDistanceFromCenter?: number;
  };
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface TravelBookingRequest {
  type: 'flight' | 'hotel' | 'package' | 'activity';
  travelDate: string; // ISO string
  details: Record<string, any>;
  price: { amount: number; currency: string };
}




