import { useState, useEffect, useMemo } from 'react';
import type { ILocationPoint, TransportType } from '@/types/location';
import type { IRouteInfo, IRouteDistanceService } from '@/types/route';
import { defaultDistanceService } from '@/services/distance/HaversineDistanceService';

interface UseRoutePreviewProps {
  origin: ILocationPoint | null;
  destination: ILocationPoint | null;
  transportType: TransportType;
  /**
   * Dependency Inversion Principle:
   * Distance service can be injected (e.g. for testing, or swapping to Google Maps / OSRM API)
   */
  distanceService?: IRouteDistanceService;
}

interface UseRoutePreviewReturn {
  routeInfo: IRouteInfo | null;
  distanceKm: number;
  estimatedMinutes: number;
  formattedDuration: string;
  waypoints: [number, number][];
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom Hook: useRoutePreview
 * Single Responsibility: Manages route calculation and geometry lifecycle
 * Dependency Inversion: Injects IRouteDistanceService
 */
export const useRoutePreview = ({
  origin,
  destination,
  transportType,
  distanceService = defaultDistanceService,
}: UseRoutePreviewProps): UseRoutePreviewReturn => {
  const [routeInfo, setRouteInfo] = useState<IRouteInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!origin || !destination) {
      setRouteInfo(null);
      setError(null);
      return;
    }

    if (origin.id === destination.id) {
      setError('Điểm khởi hành và điểm đến không được trùng nhau');
      setRouteInfo(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Injected service calculation
      const calculated = distanceService.calculateRoute(origin, destination, transportType);
      setRouteInfo(calculated);
    } catch (err) {
      setError('Không thể tính toán khoảng cách lộ trình');
      setRouteInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [origin, destination, transportType, distanceService]);

  const formattedDuration = useMemo(() => {
    if (!routeInfo) return '';
    const mins = routeInfo.estimatedMinutes;
    const hours = Math.floor(mins / 60);
    const remainMins = mins % 60;
    if (hours === 0) return `${remainMins} phút`;
    if (remainMins === 0) return `${hours} giờ`;
    return `${hours} giờ ${remainMins} phút`;
  }, [routeInfo]);

  return {
    routeInfo,
    distanceKm: routeInfo?.distanceKm ?? 0,
    estimatedMinutes: routeInfo?.estimatedMinutes ?? 0,
    formattedDuration,
    waypoints: routeInfo?.waypoints ?? [],
    isLoading,
    error,
  };
};
