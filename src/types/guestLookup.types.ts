import type { TransportType } from './location';
import type { IBookingPayload, IPassengerInfo, IContactInfo, IAmenity } from './ticket';

export type GuestBookingStatus = 'confirmed' | 'pending_payment' | 'expired' | 'cancelled';

export interface IGuestLookupQuery {
  bookingId: string;
  phoneOrEmail: string;
}

export interface IGuestBookingOrder {
  bookingId: string;
  pnrCode: string;
  transportType: TransportType;
  carrierId: string;
  carrierName: string;
  carrierLogo: string;
  carrierCode: string;
  vehicleNumber: string;
  vehicleName: string;
  
  origin: {
    name: string;
    city: string;
    code: string;
    terminal?: string;
  };
  destination: {
    name: string;
    city: string;
    code: string;
    terminal?: string;
  };

  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;

  seatClassName: string;
  passengers: IPassengerInfo[];
  contact: IContactInfo;

  totalAmount: number;
  paymentStatus: GuestBookingStatus;
  paymentMethod?: string;
  bookingDate: string;
  paidAt?: string;
  paymentExpiresAt?: string;

  qrData: string;
  baggagePolicy?: {
    carryOnKg: number;
    checkedKg: number;
  };
  amenities?: IAmenity[];
  cancellationPolicy?: string;
  rawPayload?: IBookingPayload;
}

export interface IGuestRecentBooking {
  bookingId: string;
  pnrCode: string;
  transportType: TransportType;
  carrierName: string;
  carrierLogo: string;
  originCity: string;
  destinationCity: string;
  routeSummary: string;
  departureTime: string;
  totalAmount: number;
  paymentStatus: GuestBookingStatus;
  passengerCount: number;
  contactPhone: string;
  contactEmail: string;
  bookedAt: string;
}

export interface IDraftBooking {
  bookingId: string;
  payload: IBookingPayload;
  paymentExpiresAt: number; // timestamp in ms
  createdAt: number;
}
