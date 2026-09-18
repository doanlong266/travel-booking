import type { ILocationPoint, TransportType } from '@/types/location';
import { mockLocations } from '@/data/mockLocations';

export { mockLocations };

/**
 * Filter location points by transport type
 */
export const getLocationsByType = (type: TransportType): ILocationPoint[] => {
  return mockLocations.filter((item) => item.type === type);
};

/**
 * Find location by ID or Code
 */
export const getLocationById = (idOrCode: string): ILocationPoint | undefined => {
  return mockLocations.find(
    (item) => item.id === idOrCode || item.code.toLowerCase() === idOrCode.toLowerCase()
  );
};

/**
 * Get default origin and destination pair for a transport type
 */
export const getDefaultLocationPair = (type: TransportType): { origin: ILocationPoint; destination: ILocationPoint } => {
  switch (type) {
    case 'flight':
      return {
        origin: mockLocations.find((l) => l.id === 'air-han')!,
        destination: mockLocations.find((l) => l.id === 'air-sgn')!,
      };
    case 'train':
      return {
        origin: mockLocations.find((l) => l.id === 'train-han')!,
        destination: mockLocations.find((l) => l.id === 'train-sgn')!,
      };
    case 'bus':
      return {
        origin: mockLocations.find((l) => l.id === 'bus-myd')!,
        destination: mockLocations.find((l) => l.id === 'bus-dad')!,
      };
  }
};
