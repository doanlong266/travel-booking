import type { ILocationPoint, TransportType } from './location';

/**
 * Calculated route information between two location points
 */
export interface IRouteInfo {
  origin: ILocationPoint;
  destination: ILocationPoint;
  distanceKm: number;
  estimatedMinutes: number;
  waypoints: [number, number][]; // LatLng coordinate pairs for rendering map polyline
  transportType: TransportType;
  straightLineDistanceKm: number;
  averageSpeedKmh: number;
}

/**
 * Dependency Inversion Principle:
 * Route distance calculation interface decoupled from specific libraries (Leaflet, Haversine, Google Maps, OSRM).
 */
export interface IRouteDistanceService {
  /**
   * Calculate full route metrics between origin and destination for a given transport type
   */
  calculateRoute(
    origin: ILocationPoint,
    destination: ILocationPoint,
    transportType: TransportType
  ): IRouteInfo;

  /**
   * Calculate straight-line Great Circle distance in kilometers
   */
  calculateDistanceKm(origin: ILocationPoint, destination: ILocationPoint): number;

  /**
   * Estimate travel duration in minutes based on transport characteristics
   */
  estimateDurationMinutes(distanceKm: number, transportType: TransportType): number;
}
