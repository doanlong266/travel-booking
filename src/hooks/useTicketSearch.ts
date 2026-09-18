import { useState, useMemo, useCallback } from 'react';
import type { TransportType, ILocationPoint } from '@/types/location';
import type { ITicketItem, ITicketFilter, SeatClassType } from '@/types/ticket';
import { mockTickets } from '@/data/mockTickets';
import { filterTickets, sortTickets } from '@/services/ticket/mockTickets';
import { getDefaultLocationPair } from '@/services/ticket/mockLocations';

export interface UseTicketSearchReturn {
  transportType: TransportType;
  setTransportType: (type: TransportType) => void;
  
  origin: ILocationPoint | null;
  setOrigin: (point: ILocationPoint | null) => void;
  
  destination: ILocationPoint | null;
  setDestination: (point: ILocationPoint | null) => void;
  
  departureDate: string;
  setDepartureDate: (date: string) => void;
  
  returnDate: string | null;
  setReturnDate: (date: string | null) => void;
  
  isRoundTrip: boolean;
  setIsRoundTrip: (isRound: boolean) => void;
  
  passengerCount: number;
  setPassengerCount: (count: number) => void;
  
  seatClassFilter: SeatClassType | 'all';
  setSeatClassFilter: (cls: SeatClassType | 'all') => void;

  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;

  selectedCarriers: string[];
  setSelectedCarriers: (carriers: string[]) => void;

  selectedTimeSlots: ('morning' | 'afternoon' | 'evening' | 'night')[];
  setSelectedTimeSlots: (slots: ('morning' | 'afternoon' | 'evening' | 'night')[]) => void;

  sortBy: ITicketFilter['sortBy'];
  setSortBy: (sort: ITicketFilter['sortBy']) => void;

  swapLocations: () => void;
  resetFilters: () => void;

  filteredTickets: ITicketItem[];
  allAvailableCarriers: { id: string; name: string }[];
  priceBounds: [number, number];
}

export const useTicketSearch = (): UseTicketSearchReturn => {
  const [transportType, setTransportTypeState] = useState<TransportType>('flight');
  
  // Initialize default location pair
  const defaultPair = useMemo(() => getDefaultLocationPair('flight'), []);
  const [origin, setOrigin] = useState<ILocationPoint | null>(defaultPair.origin);
  const [destination, setDestination] = useState<ILocationPoint | null>(defaultPair.destination);
  
  const [departureDate, setDepartureDate] = useState<string>('2026-10-15');
  const [returnDate, setReturnDate] = useState<string | null>(null);
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [seatClassFilter, setSeatClassFilter] = useState<SeatClassType | 'all'>('all');

  // Filter criteria
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<('morning' | 'afternoon' | 'evening' | 'night')[]>([]);
  const [sortBy, setSortBy] = useState<ITicketFilter['sortBy']>('price_asc');

  // Change transport type and update corresponding default endpoints
  const setTransportType = useCallback((type: TransportType) => {
    setTransportTypeState(type);
    const newPair = getDefaultLocationPair(type);
    setOrigin(newPair.origin);
    setDestination(newPair.destination);
    setSelectedCarriers([]);
    setSelectedTimeSlots([]);
    setSeatClassFilter('all');
  }, []);

  // Swap origin & destination
  const swapLocations = useCallback(() => {
    setOrigin((prevOrigin) => {
      setDestination(prevOrigin);
      return destination;
    });
  }, [destination]);

  // Extract all available carriers for current transport mode
  const allAvailableCarriers = useMemo(() => {
    const relevant = mockTickets.filter((t) => t.transportType === transportType);
    const map = new Map<string, string>();
    relevant.forEach((t) => map.set(t.carrierId, t.carrierName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [transportType]);

  // Dynamic price bounds for current transport mode
  const priceBounds = useMemo((): [number, number] => {
    const relevant = mockTickets.filter((t) => t.transportType === transportType);
    if (relevant.length === 0) return [0, 5000000];
    const prices = relevant.map((t) => t.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [transportType]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setPriceRange([0, 5000000]);
    setSelectedCarriers([]);
    setSelectedTimeSlots([]);
    setSeatClassFilter('all');
    setSortBy('price_asc');
  }, []);

  // Filtered and sorted tickets
  const filteredTickets = useMemo(() => {
    // Basic filter matching criteria
    const result = filterTickets(mockTickets, {
      transportType,
      origin: origin ?? undefined,
      destination: destination ?? undefined,
      priceRange,
      carriers: selectedCarriers,
      departureTimeSlots: selectedTimeSlots,
      seatClasses: seatClassFilter === 'all' ? undefined : [seatClassFilter],
    });

    // If no tickets found for specific city pair in mock data, show available routes for the mode
    // with adjusted origins to guarantee a vibrant rich demo experience
    let displayList = result;
    if (displayList.length === 0) {
      displayList = mockTickets.filter((t) => t.transportType === transportType);
    }

    return sortTickets(displayList, sortBy);
  }, [
    transportType,
    origin,
    destination,
    priceRange,
    selectedCarriers,
    selectedTimeSlots,
    seatClassFilter,
    sortBy,
  ]);

  return {
    transportType,
    setTransportType,
    origin,
    setOrigin,
    destination,
    setDestination,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    isRoundTrip,
    setIsRoundTrip,
    passengerCount,
    setPassengerCount,
    seatClassFilter,
    setSeatClassFilter,
    priceRange,
    setPriceRange,
    selectedCarriers,
    setSelectedCarriers,
    selectedTimeSlots,
    setSelectedTimeSlots,
    sortBy,
    setSortBy,
    swapLocations,
    resetFilters,
    filteredTickets,
    allAvailableCarriers,
    priceBounds,
  };
};
