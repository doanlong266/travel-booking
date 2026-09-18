import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { ILocationPoint, TransportType } from '@/types/location';
import type { IRouteInfo } from '@/types/route';
import { routeStrategyRegistry } from '@/strategies/transportRouteStrategy';
import { createVectorMarkerIcon } from './MapVectorMarker';
import { RouteStatsBadge } from './RouteStatsBadge';
import { SovereigntyMarkers } from './SovereigntyMarkers';

interface MapBoundsControllerProps {
  origin: ILocationPoint | null;
  destination: ILocationPoint | null;
  waypoints: [number, number][];
}

/**
 * Subcomponent to smoothly animate & fit map bounds whenever points change
 */
const MapBoundsController: React.FC<MapBoundsControllerProps> = ({
  origin,
  destination,
  waypoints,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!origin && !destination) return;

    if (origin && destination) {
      if (waypoints.length > 0) {
        const bounds = L.latLngBounds(waypoints.map(([lat, lng]) => [lat, lng]));
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12,
          animate: true,
          duration: 1.2,
        });
      } else {
        const bounds = L.latLngBounds([
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        ]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    } else if (origin) {
      map.setView([origin.lat, origin.lng], 9, { animate: true });
    }
  }, [origin, destination, waypoints, map]);

  return null;
};

export interface RouteMapProps {
  origin: ILocationPoint | null;
  destination: ILocationPoint | null;
  transportType: TransportType;
  routeInfo: IRouteInfo | null;
  formattedDuration: string;
}

/**
 * Open/Closed Principle:
 * RouteMap renders any transport mode dynamically using the strategy registry.
 */
export const RouteMap: React.FC<RouteMapProps> = ({
  origin,
  destination,
  transportType,
  routeInfo,
  formattedDuration,
}) => {
  const strategy = useMemo(() => routeStrategyRegistry.get(transportType), [transportType]);

  // Center on Vietnam by default
  const defaultCenter: [number, number] = useMemo(() => [15.8700, 107.5000], []);
  const defaultZoom = 6;

  const originMarkerIcon = useMemo(() => {
    if (!origin) return null;
    return createVectorMarkerIcon({
      type: transportType,
      label: origin.code,
      isOrigin: true,
    });
  }, [origin, transportType]);

  const destMarkerIcon = useMemo(() => {
    if (!destination) return null;
    return createVectorMarkerIcon({
      type: transportType,
      label: destination.code,
      isOrigin: false,
    });
  }, [destination, transportType]);

  return (
    <div className="route-map">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={false}
        className="route-map__container"
      >
        {/* OpenStreetMap Standard Basemap - 100% Free, Public, Zero API Key Required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Mandatory Vietnamese Sovereignty Layer: Hoàng Sa & Trường Sa Islands */}
        <SovereigntyMarkers />

        {/* Dynamic Bounds Controller */}
        <MapBoundsController
          origin={origin}
          destination={destination}
          waypoints={routeInfo?.waypoints ?? []}
        />

        {/* Origin Marker */}
        {origin && originMarkerIcon && (
          <Marker position={[origin.lat, origin.lng]} icon={originMarkerIcon}>
            <Popup className="route-map__popup">
              <div className="route-map__popup-content">
                <span className="route-map__popup-tag">Điểm Khởi Hành</span>
                <strong className="route-map__popup-title">{origin.name}</strong>
                <p className="route-map__popup-address">{origin.address || origin.city}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destination && destMarkerIcon && (
          <Marker position={[destination.lat, destination.lng]} icon={destMarkerIcon}>
            <Popup className="route-map__popup">
              <div className="route-map__popup-content">
                <span className="route-map__popup-tag route-map__popup-tag--dest">Điểm Đến</span>
                <strong className="route-map__popup-title">{destination.name}</strong>
                <p className="route-map__popup-address">{destination.address || destination.city}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dynamic Polyline Path based on Strategy */}
        {routeInfo && routeInfo.waypoints.length > 0 && (
          <Polyline
            positions={routeInfo.waypoints}
            pathOptions={strategy.routeLineStyle}
          />
        )}
      </MapContainer>

      {/* Floating Statistics Badge */}
      <RouteStatsBadge
        routeInfo={routeInfo}
        formattedDuration={formattedDuration}
      />
    </div>
  );
};
