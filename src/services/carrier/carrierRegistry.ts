import type { TransportType } from '@/types/location';
import type { ICarrierConfig } from './carrierTypes';
import { INITIAL_CARRIER_CONFIGS } from '@/data/carriersData';

export { INITIAL_CARRIER_CONFIGS };

/**
 * Centralized Carrier Service (SOLID: Singleton, DIP, OCP)
 * Implements high-performance memoized lookup, O(1) retrieval, and extensible registration.
 */
class CarrierRegistryService {
  private carriers: Map<string, ICarrierConfig> = new Map();
  private aliasIndex: Map<string, ICarrierConfig> = new Map();
  private resolutionCache: Map<string, ICarrierConfig | null> = new Map();

  constructor(initialConfigs: readonly ICarrierConfig[] = INITIAL_CARRIER_CONFIGS) {
    initialConfigs.forEach((cfg) => this.register(cfg));
  }

  /**
   * Register or extend a carrier (Open/Closed Principle)
   */
  public register(config: ICarrierConfig): void {
    this.carriers.set(config.id, config);
    this.resolutionCache.clear(); // invalidate memoization cache

    // Index by ID and Code
    const cleanId = this.cleanKey(config.id);
    const cleanCode = this.cleanKey(config.code);
    this.aliasIndex.set(cleanId, config);
    this.aliasIndex.set(cleanCode, config);

    // Index all defined aliases
    config.aliases.forEach((alias) => {
      this.aliasIndex.set(this.cleanKey(alias), config);
    });
  }

  /**
   * Normalizes input search keys (lowercase, trimmed, dashes)
   */
  private cleanKey(raw: string): string {
    return (raw || '')
      .toLowerCase()
      .trim()
      .replace(/[_\s.]+/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Fast O(1) lookup with memoization cache (prevents repeated calculations)
   */
  public get(keyOrCodeOrName: string): ICarrierConfig | undefined {
    if (!keyOrCodeOrName) return undefined;

    // Check resolution cache first
    const clean = this.cleanKey(keyOrCodeOrName);
    if (this.resolutionCache.has(clean)) {
      return this.resolutionCache.get(clean) ?? undefined;
    }

    // Direct alias match
    let resolved = this.aliasIndex.get(clean);

    // Fuzzy partial match fallback if not exact
    if (!resolved) {
      for (const [alias, config] of this.aliasIndex.entries()) {
        if (clean.includes(alias) || alias.includes(clean)) {
          resolved = config;
          break;
        }
      }
    }

    // Save to cache
    this.resolutionCache.set(clean, resolved ?? null);
    return resolved;
  }

  /**
   * Returns bundled logo source URL or undefined
   */
  public getLogoSrc(key: string): string | undefined {
    return this.get(key)?.logoSrc;
  }

  /**
   * Returns all registered carriers
   */
  public getAll(): ICarrierConfig[] {
    return Array.from(this.carriers.values());
  }

  /**
   * Filter carriers by transport type (flight, train, bus)
   */
  public getByType(type: TransportType): ICarrierConfig[] {
    return this.getAll().filter((c) => c.transportType === type);
  }
}

// Singleton Instance for the entire application
export const carrierRegistry = new CarrierRegistryService();

/**
 * Functional convenience helpers for consumers (Dependency Inversion)
 */
export const getCarrierConfig = (key: string): ICarrierConfig | undefined => {
  return carrierRegistry.get(key);
};

export const getCarrierLogoSrc = (key: string): string | undefined => {
  return carrierRegistry.getLogoSrc(key);
};

export const getAllCarriers = (): ICarrierConfig[] => {
  return carrierRegistry.getAll();
};

export const getCarriersByType = (type: TransportType): ICarrierConfig[] => {
  return carrierRegistry.getByType(type);
};
