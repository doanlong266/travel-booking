import type { TransportType } from '@/types/location';

export type CarrierLogoVariant = 'badge' | 'avatar' | 'full' | 'icon';
export type CarrierLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

/**
 * Interface representing standard carrier configuration (SOLID: Interface Segregation)
 */
export interface ICarrierConfig {
  /** Canonical unique identifier (e.g. 'vna', 'vietjet', 'bamboo') */
  readonly id: string;
  /** Official full brand name */
  readonly name: string;
  /** Short or trading brand name */
  readonly shortName: string;
  /** Official transport / IATA / brand code */
  readonly code: string;
  /** Transport mode */
  readonly transportType: TransportType;
  /** Static asset path / bundled asset URL */
  readonly logoSrc: string;
  /** Brand primary theme color */
  readonly brandColor: string;
  /** Subtle background color for badge container */
  readonly badgeBg: string;
  /** Border color matching brand palette */
  readonly borderColor: string;
  /** Recognized lookup aliases & codes (for normalization) */
  readonly aliases: readonly string[];
}

/**
 * Props for CarrierLogo component (SOLID: Interface Segregation)
 */
export interface CarrierLogoProps {
  /** Carrier ID, code, name or logo identifier */
  carrier: string;
  /** Optional name override */
  name?: string;
  /** Optional code override */
  code?: string;
  /** Display variant: 'badge' (default), 'avatar', 'full', 'icon' */
  variant?: CarrierLogoVariant;
  /** Size preset or pixel dimension */
  size?: CarrierLogoSize;
  /** Optional extra CSS class */
  className?: string;
  /** Show text brand name beside logo (default false, true for variant 'full') */
  showName?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}
