import React, { useState, useMemo } from 'react';
import type { CarrierLogoProps, CarrierLogoSize } from '@/services/carrier/carrierTypes';
import { getCarrierConfig } from '@/services/carrier/carrierRegistry';

export type { CarrierLogoProps } from '@/services/carrier/carrierTypes';

/**
 * Normalizes size prop into explicit width and height dimensions
 */
const resolveDimensions = (size: CarrierLogoSize = 'md'): { width: number; height: number } => {
  if (typeof size === 'number') {
    return { width: size, height: Math.round((size * 2) / 3) };
  }
  switch (size) {
    case 'xs':
      return { width: 24, height: 18 };
    case 'sm':
      return { width: 36, height: 24 };
    case 'lg':
      return { width: 64, height: 42 };
    case 'xl':
      return { width: 84, height: 54 };
    case 'md':
    default:
      return { width: 48, height: 32 };
  }
};

/**
 * CarrierLogo Component (SOLID: Single Responsibility & Dependency Inversion)
 * - Renders pre-bundled static carrier logos with lazy loading & caching.
 * - Resolves any carrier ID, code, or alias via `carrierRegistry`.
 * - Provides graceful fallback to styled brand initials if image fails or carrier unknown.
 */
export const CarrierLogo: React.FC<CarrierLogoProps> = ({
  carrier,
  name,
  code,
  variant = 'badge',
  size = 'md',
  className = '',
  showName = false,
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);

  // Memoized resolution through carrier registry (O(1))
  const carrierConfig = useMemo(() => {
    return getCarrierConfig(carrier);
  }, [carrier]);

  const { width, height } = useMemo(() => resolveDimensions(size), [size]);

  // Fallback label / initials
  const displayName = name || carrierConfig?.shortName || carrierConfig?.name || carrier;
  const displayCode = (code || carrierConfig?.code || carrier.slice(0, 3)).toUpperCase();

  // Root class names
  const rootClass = [
    'carrier-logo',
    `carrier-logo--${variant}`,
    carrierConfig ? `carrier-logo--${carrierConfig.id}` : 'carrier-logo--unknown',
    onClick ? 'carrier-logo--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Inline styling for the logo box
  const boxStyle: React.CSSProperties = {
    width: variant === 'avatar' ? `${width}px` : `${width}px`,
    height: variant === 'avatar' ? `${width}px` : `${height}px`,
    borderColor: carrierConfig?.borderColor,
    backgroundColor: carrierConfig?.badgeBg || '#ffffff',
  };

  // Fallback view when image fails or config not found
  if (hasError || !carrierConfig?.logoSrc) {
    return (
      <div
        className={`${rootClass} carrier-logo--fallback`}
        style={boxStyle}
        title={displayName}
        onClick={onClick}
      >
        <span
          className="carrier-logo__fallback-text"
          style={{ color: carrierConfig?.brandColor || 'var(--color-primary)' }}
        >
          {displayCode}
        </span>
        {(showName || variant === 'full') && (
          <span className="carrier-logo__name">{displayName}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={rootClass}
      onClick={onClick}
      title={`${displayName} (${displayCode})`}
    >
      <div className="carrier-logo__box" style={boxStyle}>
        <img
          src={carrierConfig.logoSrc}
          alt={displayName}
          loading="eager"
          decoding="async"
          onError={() => setHasError(true)}
          className="carrier-logo__img"
        />
      </div>

      {(showName || variant === 'full') && (
        <span className="carrier-logo__name">{displayName}</span>
      )}
    </div>
  );
};
