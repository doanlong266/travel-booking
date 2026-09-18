import L from 'leaflet';
import type { TransportType } from '@/types/location';

interface MarkerIconOptions {
  type: TransportType;
  label: string;
  isOrigin?: boolean;
}

/**
 * Generates custom SVG Vector Marker with pulsing radar ring for Leaflet
 * 100% Vector SVG - Zero emoji
 */
export const createVectorMarkerIcon = ({ type, label, isOrigin = true }: MarkerIconOptions): L.DivIcon => {
  let color = '#0284c7';
  let bgColor = '#e0f2fe';
  let iconSvg = '';

  if (type === 'flight') {
    color = isOrigin ? '#0284c7' : '#0369a1';
    bgColor = isOrigin ? '#e0f2fe' : '#bae6fd';
    // Airplane SVG vector
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/>
      </svg>
    `;
  } else if (type === 'train') {
    color = isOrigin ? '#0d9488' : '#0f766e';
    bgColor = isOrigin ? '#ccfbf1' : '#99f6e4';
    // Train SVG vector
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect width="16" height="16" x="4" y="3" rx="2"/>
        <path d="M4 11h16"/>
        <path d="M12 3v8"/>
        <path d="m8 19-2 3"/>
        <path d="m18 22-2-3"/>
        <circle cx="8" cy="15" r="1" fill="${color}"/>
        <circle cx="16" cy="15" r="1" fill="${color}"/>
      </svg>
    `;
  } else {
    color = isOrigin ? '#f97316' : '#ea580c';
    bgColor = isOrigin ? '#ffedd5' : '#fed7aa';
    // Bus SVG vector
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 6v6"/>
        <path d="M16 6v6"/>
        <path d="M4 6h16"/>
        <rect width="18" height="16" x="3" y="3" rx="2"/>
        <path d="M4 14h16"/>
        <circle cx="7" cy="16" r="1" fill="${color}"/>
        <circle cx="17" cy="16" r="1" fill="${color}"/>
      </svg>
    `;
  }

  const roleText = isOrigin ? 'Khởi hành' : 'Điểm đến';

  const html = `
    <div class="vector-marker ${isOrigin ? 'vector-marker--origin' : 'vector-marker--dest'}">
      <div class="vector-marker__pulse" style="--pulse-color: ${color}"></div>
      <div class="vector-marker__pin" style="background: ${bgColor}; border-color: ${color}">
        ${iconSvg}
      </div>
      <div class="vector-marker__label" style="border-color: ${color}">
        <span class="vector-marker__role">${roleText}</span>
        <span class="vector-marker__code">${label}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-vector-leaflet-marker',
    html,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  });
};
