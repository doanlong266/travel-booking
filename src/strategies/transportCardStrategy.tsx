import React from 'react';
import { Plane, Train, Bus, Navigation } from 'lucide-react';
import type { TransportType, ILocationPoint } from '@/types/location';
import type { ITicketItem } from '@/types/ticket';

export interface ITransportCardConfig {
  type: TransportType;
  badgeLabel: string;
  badgeIcon: React.ReactNode;
  badgeColorClass: string;
  vehicleLabel: string;
  terminalLabel: string;
  formatLocationSubtitle: (point: ILocationPoint) => string;
  getSeatClassTagColor: (seatClass: string) => string;
  getBaggageSummary: (ticket: ITicketItem) => string;
}

class TransportCardStrategyRegistry {
  private strategies = new Map<TransportType, ITransportCardConfig>();

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    // 1. FLIGHT
    this.strategies.set('flight', {
      type: 'flight',
      badgeLabel: 'Chuyến bay thẳng',
      badgeIcon: <Plane size={14} />,
      badgeColorClass: 'ticket-card__badge--flight',
      vehicleLabel: 'Số hiệu chuyến bay',
      terminalLabel: 'Sân bay',
      formatLocationSubtitle: (point) => point.terminalName || `Mã: ${point.code}`,
      getSeatClassTagColor: (cls) => {
        if (cls === 'business') return 'gold';
        if (cls === 'premium_economy') return 'cyan';
        return 'blue';
      },
      getBaggageSummary: (ticket) =>
        `Xách tay ${ticket.baggagePolicy.carryOnKg}kg ${
          ticket.baggagePolicy.checkedKg > 0 ? `+ Ký gửi ${ticket.baggagePolicy.checkedKg}kg` : '(Chưa có ký gửi)'
        }`,
    });

    // 2. TRAIN
    this.strategies.set('train', {
      type: 'train',
      badgeLabel: 'Tàu hỏa Thống Nhất',
      badgeIcon: <Train size={14} />,
      badgeColorClass: 'ticket-card__badge--train',
      vehicleLabel: 'Mác tàu / Đoàn tàu',
      terminalLabel: 'Nhà ga',
      formatLocationSubtitle: (point) => `${point.name} (${point.code})`,
      getSeatClassTagColor: (cls) => {
        if (cls === 'sleeper_4') return 'purple';
        if (cls === 'sleeper_6') return 'geekblue';
        return 'green';
      },
      getBaggageSummary: (ticket) =>
        `Hành lý xách tay tiêu chuẩn ${ticket.baggagePolicy.carryOnKg}kg`,
    });

    // 3. BUS
    this.strategies.set('bus', {
      type: 'bus',
      badgeLabel: 'Xe Khách Tuyến',
      badgeIcon: <Bus size={14} />,
      badgeColorClass: 'ticket-card__badge--bus',
      vehicleLabel: 'Biển số & Hạng xe',
      terminalLabel: 'Bến xe',
      formatLocationSubtitle: (point) => point.name,
      getSeatClassTagColor: (cls) => {
        if (cls === 'cabin_couple') return 'magenta';
        if (cls === 'limousine_vip') return 'volcano';
        return 'orange';
      },
      getBaggageSummary: (ticket) =>
        `Khoang chứa đồ ${ticket.baggagePolicy.checkedKg}kg + Túi xách tay`,
    });
  }

  public get(type: TransportType): ITransportCardConfig {
    const config = this.strategies.get(type);
    if (!config) {
      return {
        type,
        badgeLabel: 'Chuyến đi',
        badgeIcon: <Navigation size={14} />,
        badgeColorClass: 'ticket-card__badge--default',
        vehicleLabel: 'Phương tiện',
        terminalLabel: 'Điểm đón/trả',
        formatLocationSubtitle: (point) => point.name,
        getSeatClassTagColor: () => 'default',
        getBaggageSummary: () => 'Hành lý tiêu chuẩn',
      };
    }
    return config;
  }

  public register(config: ITransportCardConfig) {
    this.strategies.set(config.type, config);
  }
}

export const cardStrategyRegistry = new TransportCardStrategyRegistry();
