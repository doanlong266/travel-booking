import React from 'react';
import { Clock, Navigation, Zap, Compass } from 'lucide-react';
import type { IRouteInfo } from '@/types/route';
import { routeStrategyRegistry } from '@/strategies/transportRouteStrategy';

interface RouteStatsBadgeProps {
  routeInfo: IRouteInfo | null;
  formattedDuration: string;
}

/**
 * Route metrics badge floating on the interactive map
 * Strictly adheres to BEM: .route-stats-badge__...
 */
export const RouteStatsBadge: React.FC<RouteStatsBadgeProps> = ({
  routeInfo,
  formattedDuration,
}) => {
  if (!routeInfo) return null;

  const strategy = routeStrategyRegistry.get(routeInfo.transportType);

  return (
    <div className="route-stats-badge">
      {/* Header with Transport mode badge */}
      <div className="route-stats-badge__header">
        <div className="route-stats-badge__mode-indicator">
          <span className="route-stats-badge__mode-icon">{strategy.icon}</span>
          <span className="route-stats-badge__mode-title">{strategy.displayName}</span>
        </div>
        <span className="route-stats-badge__speed-tag">
          <Zap size={13} className="route-stats-badge__tag-icon" />
          {strategy.avgSpeedLabel}
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="route-stats-badge__metrics">
        {/* Distance */}
        <div className="route-stats-badge__item">
          <div className="route-stats-badge__item-icon-wrapper route-stats-badge__item-icon-wrapper--distance">
            <Navigation size={16} />
          </div>
          <div className="route-stats-badge__item-content">
            <span className="route-stats-badge__item-label">Khoảng cách</span>
            <span className="route-stats-badge__item-value">
              {routeInfo.distanceKm.toLocaleString('vi-VN')} <small>km</small>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="route-stats-badge__divider" />

        {/* Duration */}
        <div className="route-stats-badge__item">
          <div className="route-stats-badge__item-icon-wrapper route-stats-badge__item-icon-wrapper--duration">
            <Clock size={16} />
          </div>
          <div className="route-stats-badge__item-content">
            <span className="route-stats-badge__item-label">Thời gian ước tính</span>
            <span className="route-stats-badge__item-value">{formattedDuration}</span>
          </div>
        </div>
      </div>

      {/* Terminal corridor footnote */}
      <div className="route-stats-badge__footer">
        <Compass size={12} className="route-stats-badge__footer-icon" />
        <span className="route-stats-badge__footer-text">
          {routeInfo.origin.city} ({routeInfo.origin.code}) &rarr; {routeInfo.destination.city} (
          {routeInfo.destination.code})
        </span>
      </div>
    </div>
  );
};
