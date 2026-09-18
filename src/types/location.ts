/**
 * Multi-modal transport types supported by the booking system
 */
export type TransportType = 'flight' | 'train' | 'bus';

/**
 * Liskov Substitution Principle:
 * Normalized location point interface shared by Airports, Train Stations, and Bus Terminals.
 * Can be substituted anywhere a geographical route terminal or departure/arrival point is required.
 */
export interface ILocationPoint {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  type: TransportType;
  city: string;
  country?: string;
  address?: string;
  terminalName?: string;
  province?: string;
}

export interface ILocationGroup {
  city: string;
  points: ILocationPoint[];
}
