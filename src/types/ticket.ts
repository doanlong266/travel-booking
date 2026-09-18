import type { ILocationPoint, TransportType } from './location';

export type SeatClassType = 
  // Flight
  | 'economy' | 'premium_economy' | 'business'
  // Train
  | 'soft_seat' | 'sleeper_4' | 'sleeper_6'
  // Bus
  | 'sleeper_standard' | 'limousine_vip' | 'cabin_couple';

export interface IAmenity {
  id: string;
  name: string;
  iconName: 'wifi' | 'plug' | 'utensils' | 'bed' | 'briefcase' | 'tv' | 'snowflake' | 'coffee';
  description?: string;
}

export interface ITicketItem {
  id: string;
  transportType: TransportType;
  carrierId: string;
  carrierName: string;
  carrierLogo: string;
  carrierCode: string;
  vehicleNumber: string; // e.g. "VN 218", "SE 1", "FUTA 79B"
  vehicleName: string;   // e.g. "Airbus A350", "Đoàn tàu SE thế hệ mới", "Xe Limousine 22 phòng"
  
  origin: ILocationPoint;
  destination: ILocationPoint;
  
  departureTime: string; // ISO date-time string
  arrivalTime: string;   // ISO date-time string
  durationMinutes: number;
  
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  
  seatClass: SeatClassType;
  seatClassName: string;
  availableSeats: number;
  
  amenities: IAmenity[];
  baggagePolicy: {
    carryOnKg: number;
    checkedKg: number;
  };
  
  transitStops?: {
    locationName: string;
    durationMinutes: number;
  }[];
  
  cancellationPolicy: string;
  rating: number;
  reviewCount: number;
}

export interface ITicketFilter {
  transportType: TransportType;
  priceRange: [number, number];
  departureTimeSlots: ('morning' | 'afternoon' | 'evening' | 'night')[];
  carriers: string[];
  seatClasses: SeatClassType[];
  directOnly: boolean;
  amenities: string[];
  sortBy: 'price_asc' | 'price_desc' | 'duration_asc' | 'departure_asc' | 'rating_desc';
}

export interface ITicketCardProps {
  ticket: ITicketItem;
  onSelect: (ticket: ITicketItem) => void;
  isSelected?: boolean;
  onViewDetails?: (ticket: ITicketItem) => void;
}

export interface ISeatInfo {
  id: string;
  number: string;
  row?: number;
  column?: string;
  deck?: 'lower' | 'upper';
  carNumber?: number;
  type: SeatClassType;
  price: number;
  isAvailable: boolean;
  isOccupied: boolean;
  isSelected?: boolean;
}

export interface IPassengerInfo {
  fullName: string;
  idNumber?: string;
  phone?: string;
  email?: string;
  gender?: 'male' | 'female' | 'other';
  passengerType: 'adult' | 'child';
  selectedSeatId?: string;
  seatNumber?: string;
}

export interface IContactInfo {
  fullName: string;
  phone: string;
  email: string;
}

export interface IBankTransferInfo {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  transferMemo: string;
}

export interface IBookingPayload {
  ticketId: string; // e.g. "TKT-VN-2026-89412X"
  ticket: ITicketItem;
  contact: IContactInfo;
  passengers: IPassengerInfo[];
  totalAmount: number;
  distanceKm: number;
  bankInfo: IBankTransferInfo;
  paymentStatus: 'pending' | 'success' | 'expired';
  bookingDate: string;
  paidAt?: string;
}
