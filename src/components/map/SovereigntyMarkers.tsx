import React, { useState, useEffect } from 'react';
import { Marker, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { SOVEREIGNTY_ISLANDS } from '@/data/sovereigntyData';
export type { ISovereigntyIsland } from '@/data/sovereigntyData';
export { SOVEREIGNTY_ISLANDS };

/**
 * Custom Vector Flag Marker for Vietnamese Sovereignty
 * Elegant red roundel with gold star vector SVG
 */
const createSovereigntyIcon = (zoom: number): L.DivIcon => {
  const size = zoom >= 8 ? 28 : zoom >= 6 ? 24 : 20;

  const svg = `
    <div class="sovereignty-marker ${zoom >= 7 ? 'sovereignty-marker--large' : ''}">
      <div class="sovereignty-marker__pulse"></div>
      <div class="sovereignty-marker__badge" style="width: ${size}px; height: ${size}px;">
        <svg viewBox="0 0 24 24" width="${size - 6}" height="${size - 6}" fill="none">
          <circle cx="12" cy="12" r="12" fill="#da251d"/>
          <polygon points="12,4 14.5,9.5 20.5,10 16,14 17.5,20 12,16.5 6.5,20 8,14 3.5,10 9.5,9.5" fill="#ffff00"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-sovereignty-leaflet-marker',
    html: svg,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, size / 2 + 6],
  });
};

/**
 * SovereigntyMarkers Component
 * Guarantees Vietnamese sovereignty labels for Paracel and Spratly Islands
 * are always permanently anchored, crisp, and beautifully styled regardless of foreign tile providers.
 */
export const SovereigntyMarkers: React.FC = () => {
  const [currentZoom, setCurrentZoom] = useState<number>(6);

  const map = useMapEvents({
    zoomend: () => {
      setCurrentZoom(map.getZoom());
    },
  });

  useEffect(() => {
    setCurrentZoom(map.getZoom());
  }, [map]);

  return (
    <>
      {SOVEREIGNTY_ISLANDS.map((island) => {
        const icon = createSovereigntyIcon(currentZoom);

        return (
          <Marker
            key={island.id}
            position={[island.lat, island.lng]}
            icon={icon}
            interactive={true}
          >
            <Tooltip
              permanent
              direction="bottom"
              className={`sovereignty-badge ${
                currentZoom >= 7
                  ? 'sovereignty-badge--expanded'
                  : currentZoom <= 5
                  ? 'sovereignty-badge--compact'
                  : ''
              }`}
              offset={[0, 10]}
            >
              <div className="sovereignty-badge__content">
                <div className="sovereignty-badge__flag-icon">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <circle cx="12" cy="12" r="11" fill="#da251d" />
                    <polygon
                      points="12,4 14.5,9.5 20.5,10 16,14 17.5,20 12,16.5 6.5,20 8,14 3.5,10 9.5,9.5"
                      fill="#ffff00"
                    />
                  </svg>
                </div>
                <div className="sovereignty-badge__texts">
                  <strong className="sovereignty-badge__title">{island.name}</strong>
                  {currentZoom >= 7 && (
                    <span className="sovereignty-badge__admin">{island.adminUnit}</span>
                  )}
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
};
