import type { ITicketItem, ITicketFilter } from '@/types/ticket';
import type { ILocationPoint, TransportType } from '@/types/location';
import { mockTickets } from '@/data/mockTickets';

export { mockTickets };

/**
 * Filter tickets dynamically by criteria
 */
export const filterTickets = (
  tickets: ITicketItem[],
  filter: Partial<ITicketFilter> & {
    transportType?: TransportType;
    origin?: ILocationPoint;
    destination?: ILocationPoint;
  }
): ITicketItem[] => {
  return tickets.filter((ticket) => {
    // 1. Filter by transport type
    if (filter.transportType && ticket.transportType !== filter.transportType) {
      return false;
    }

    // 2. Filter by origin / destination (matching city or ID)
    if (filter.origin) {
      const matchOrigin =
        ticket.origin.id === filter.origin.id ||
        ticket.origin.city.toLowerCase() === filter.origin.city.toLowerCase();
      if (!matchOrigin) return false;
    }

    if (filter.destination) {
      const matchDest =
        ticket.destination.id === filter.destination.id ||
        ticket.destination.city.toLowerCase() === filter.destination.city.toLowerCase();
      if (!matchDest) return false;
    }

    // 3. Price range
    if (filter.priceRange) {
      const [minPrice, maxPrice] = filter.priceRange;
      if (ticket.price < minPrice || ticket.price > maxPrice) {
        return false;
      }
    }

    // 4. Carriers filter
    if (filter.carriers && filter.carriers.length > 0) {
      if (!filter.carriers.includes(ticket.carrierId)) {
        return false;
      }
    }

    // 5. Seat classes
    if (filter.seatClasses && filter.seatClasses.length > 0) {
      if (!filter.seatClasses.includes(ticket.seatClass)) {
        return false;
      }
    }

    // 6. Departure time slot
    if (filter.departureTimeSlots && filter.departureTimeSlots.length > 0) {
      const depHour = new Date(ticket.departureTime).getHours();
      const matchSlot = filter.departureTimeSlots.some((slot) => {
        if (slot === 'morning') return depHour >= 5 && depHour < 12;
        if (slot === 'afternoon') return depHour >= 12 && depHour < 18;
        if (slot === 'evening') return depHour >= 18 && depHour < 22;
        if (slot === 'night') return depHour >= 22 || depHour < 5;
        return false;
      });
      if (!matchSlot) return false;
    }

    return true;
  });
};

/**
 * Sort tickets helper
 */
export const sortTickets = (tickets: ITicketItem[], sortBy: ITicketFilter['sortBy']): ITicketItem[] => {
  const cloned = [...tickets];
  switch (sortBy) {
    case 'price_asc':
      return cloned.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return cloned.sort((a, b) => b.price - a.price);
    case 'duration_asc':
      return cloned.sort((a, b) => a.durationMinutes - b.durationMinutes);
    case 'departure_asc':
      return cloned.sort(
        (a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
      );
    case 'rating_desc':
      return cloned.sort((a, b) => b.rating - a.rating);
    default:
      return cloned;
  }
};
