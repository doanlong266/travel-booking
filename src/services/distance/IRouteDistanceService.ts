import type { ILocationPoint, TransportType } from '@/types/location';
import type { IRouteInfo } from '@/types/route';

/**
 * Dependency Inversion Principle (SOLID):
 * High-level modules (useRoutePreview hook, RouteMap component) depend on this abstraction,
 * not on concrete implementations like Haversine or external routing APIs.
 */
export interface IRouteDistanceService {
  /**
   * Calculate full route metrics between origin and destination
   */
  calculateRoute(
    origin: ILocationPoint,
    destination: ILocationPoint,
    transportType: TransportType
  ): IRouteInfo;

  /**
   * Calculate straight line distance (Great Circle) in kilometers
   */
  calculateDistanceKm(origin: ILocationPoint, destination: ILocationPoint): number;

  /**
   * Estimate travel duration in minutes based on transport mode and distance
   */
  estimateDurationMinutes(distanceKm: number, transportType: TransportType): number;
}
