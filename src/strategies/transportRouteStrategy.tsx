import React from 'react';
import { Plane, Train, Bus, Navigation } from 'lucide-react';
import type { TransportType } from '@/types/location';

export interface IRouteLineStyle {
  color: string;
  weight: number;
  opacity: number;
  dashArray?: string;
  className?: string;
}

export interface ITransportRouteConfig {
  type: TransportType;
  displayName: string;
  icon: React.ReactNode;
  markerColor: string;
  markerBgColor: string;
  pulseColor: string;
  routeLineStyle: IRouteLineStyle;
  avgSpeedLabel: string;
  stationTypeLabel: string;
}

/**
 * Open/Closed Principle:
 * Transport Route Strategy Registry.
 * New transport modes (ferry, high-speed rail, air-taxi) can be registered
 * without modifying the core RouteMap component.
 */
class TransportRouteStrategyRegistry {
  private strategies = new Map<TransportType, ITransportRouteConfig>();

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    // 1. FLIGHT
    this.strategies.set('flight', {
      type: 'flight',
      displayName: 'Vé Máy Bay',
      icon: <Plane size={18} />,
      markerColor: '#0284c7',
      markerBgColor: '#e0f2fe',
      pulseColor: 'rgba(2, 132, 199, 0.4)',
      routeLineStyle: {
        color: '#0284c7',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '8, 8',
        className: 'route-map__polyline--flight',
      },
      avgSpeedLabel: '~800 km/h (Đường hàng không)',
      stationTypeLabel: 'Sân bay',
    });

    // 2. TRAIN
    this.strategies.set('train', {
      type: 'train',
      displayName: 'Vé Tàu Hỏa',
      icon: <Train size={18} />,
      markerColor: '#0d9488',
      markerBgColor: '#ccfbf1',
      pulseColor: 'rgba(13, 148, 136, 0.4)',
      routeLineStyle: {
        color: '#0d9488',
        weight: 4,
        opacity: 0.9,
        dashArray: '12, 6',
        className: 'route-map__polyline--train',
      },
      avgSpeedLabel: '~70 km/h (Tuyến đường sắt)',
      stationTypeLabel: 'Ga tàu',
    });

    // 3. BUS
    this.strategies.set('bus', {
      type: 'bus',
      displayName: 'Vé Xe Khách',
      icon: <Bus size={18} />,
      markerColor: '#f97316',
      markerBgColor: '#ffedd5',
      pulseColor: 'rgba(249, 115, 22, 0.4)',
      routeLineStyle: {
        color: '#f97316',
        weight: 4.5,
        opacity: 0.95,
        className: 'route-map__polyline--bus',
      },
      avgSpeedLabel: '~60 km/h (Cao tốc & Quốc lộ)',
      stationTypeLabel: 'Bến xe',
    });
  }

  public get(type: TransportType): ITransportRouteConfig {
    const config = this.strategies.get(type);
    if (!config) {
      // Fallback
      return {
        type,
        displayName: type,
        icon: <Navigation size={18} />,
        markerColor: '#64748b',
        markerBgColor: '#f1f5f9',
        pulseColor: 'rgba(100, 116, 139, 0.4)',
        routeLineStyle: {
          color: '#64748b',
          weight: 3,
          opacity: 0.8,
        },
        avgSpeedLabel: 'Lộ trình tiêu chuẩn',
        stationTypeLabel: 'Trạm dừng',
      };
    }
    return config;
  }

  public register(config: ITransportRouteConfig) {
    this.strategies.set(config.type, config);
  }
}

export const routeStrategyRegistry = new TransportRouteStrategyRegistry();
