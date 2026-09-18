import type { ILocationPoint, TransportType } from '@/types/location';
import type { IRouteInfo } from '@/types/route';
import type { IRouteDistanceService } from './IRouteDistanceService';

/**
 * Concrete implementation of IRouteDistanceService using spherical trigonometry (Haversine formula)
 * and route trajectory generation with transport-specific characteristics.
 */
export class HaversineDistanceService implements IRouteDistanceService {
  private readonly EARTH_RADIUS_KM = 6371;

  /**
   * Calculate straight line distance (Haversine) in kilometers
   */
  public calculateDistanceKm(origin: ILocationPoint, destination: ILocationPoint): number {
    const lat1 = this.deg2rad(origin.lat);
    const lon1 = this.deg2rad(origin.lng);
    const lat2 = this.deg2rad(destination.lat);
    const lon2 = this.deg2rad(destination.lng);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(this.EARTH_RADIUS_KM * c * 10) / 10;
  }

  /**
   * Estimate travel duration in minutes based on real-world transport speed & logistics
   */
  public estimateDurationMinutes(distanceKm: number, transportType: TransportType): number {
    switch (transportType) {
      case 'flight': {
        // Average cruising speed 800 km/h + 35 min buffer for taxi, takeoff, approach
        const flightHours = distanceKm / 800;
        return Math.round(flightHours * 60 + 35);
      }
      case 'train': {
        // Average speed 70 km/h + 15 min station stops
        const trainHours = (distanceKm * 1.15) / 70;
        return Math.round(trainHours * 60 + 15);
      }
      case 'bus': {
        // Average highway speed 60 km/h + 20 min rest stops
        const busHours = (distanceKm * 1.25) / 60;
        return Math.round(busHours * 60 + 20);
      }
      default:
        return Math.round((distanceKm / 60) * 60);
    }
  }

  /**
   * Calculate complete route info with intermediate waypoints
   */
  public calculateRoute(
    origin: ILocationPoint,
    destination: ILocationPoint,
    transportType: TransportType
  ): IRouteInfo {
    const straightDistance = this.calculateDistanceKm(origin, destination);
    const waypoints = this.generateWaypoints(origin, destination, transportType);

    // Apply real route distance factor
    let distanceFactor = 1.0;
    let avgSpeed = 800;

    if (transportType === 'flight') {
      distanceFactor = 1.03;
      avgSpeed = 800;
    } else if (transportType === 'train') {
      distanceFactor = 1.16;
      avgSpeed = 70;
    } else if (transportType === 'bus') {
      distanceFactor = 1.28;
      avgSpeed = 60;
    }

    const distanceKm = Math.round(straightDistance * distanceFactor);
    const estimatedMinutes = this.estimateDurationMinutes(distanceKm, transportType);

    return {
      origin,
      destination,
      straightLineDistanceKm: straightDistance,
      distanceKm,
      estimatedMinutes,
      waypoints,
      transportType,
      averageSpeedKmh: avgSpeed,
    };
  }

  /**
   * Generate smooth waypoints based on transport mechanics:
   * - Flight: Elevated Great Circle Arc (curved parabolic arc)
   * - Train: Railway alignment with subtle track curves
   * - Bus: Highway corridor points
   */
  private generateWaypoints(
    origin: ILocationPoint,
    destination: ILocationPoint,
    transportType: TransportType
  ): [number, number][] {
    const pointsCount = transportType === 'flight' ? 30 : 20;
    const waypoints: [number, number][] = [];

    const lat1 = origin.lat;
    const lng1 = origin.lng;
    const lat2 = destination.lat;
    const lng2 = destination.lng;

    // Midpoint and vector
    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;

    // Perpendicular offset for curved projection
    const normalLng = -dLat;
    const normalLat = dLng;
    const normalLen = Math.hypot(normalLat, normalLng) || 1;

    // Curvature amplitude
    let curvatureAmount = 0.08;
    if (transportType === 'flight') {
      curvatureAmount = 0.15; // Elegant aviation arc
    } else if (transportType === 'train') {
      curvatureAmount = 0.04; // Moderate railway swing
    } else {
      curvatureAmount = 0.06; // Road curvature
    }

    for (let i = 0; i <= pointsCount; i++) {
      const t = i / pointsCount;
      // Linear interpolation base
      let lat = lat1 + dLat * t;
      let lng = lng1 + dLng * t;

      // Parabolic curvature factor: 4 * t * (1 - t) peaks at t=0.5
      const curveFactor = 4 * t * (1 - t);
      const offsetLat = (normalLat / normalLen) * curveFactor * curvatureAmount * Math.abs(dLat + dLng);
      const offsetLng = (normalLng / normalLen) * curveFactor * curvatureAmount * Math.abs(dLat + dLng);

      lat += offsetLat;
      lng += offsetLng;

      waypoints.push([Number(lat.toFixed(6)), Number(lng.toFixed(6))]);
    }

    return waypoints;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

// Singleton default instance for dependency injection
export const defaultDistanceService: IRouteDistanceService = new HaversineDistanceService();
