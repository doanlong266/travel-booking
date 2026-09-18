import React from 'react';
import { Tag, Button } from 'antd';
import {
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Wifi,
  Tv,
  Utensils,
  Coffee,
  Briefcase,
  Snowflake,
  Plug,
  Bed,
  Info,
} from 'lucide-react';
import type { ITicketItem, IAmenity } from '@/types/ticket';
import { cardStrategyRegistry } from '@/strategies/transportCardStrategy';
import { CarrierLogo } from '@/components/common/CarrierLogo';

export interface TicketCardProps {
  ticket: ITicketItem;
  onSelect: (ticket: ITicketItem) => void;
  isSelected?: boolean;
  onViewDetails?: (ticket: ITicketItem) => void;
}

const renderAmenityIcon = (iconName: IAmenity['iconName']) => {
  switch (iconName) {
    case 'wifi':
      return <Wifi size={13} />;
    case 'plug':
      return <Plug size={13} />;
    case 'utensils':
      return <Utensils size={13} />;
    case 'bed':
      return <Bed size={13} />;
    case 'briefcase':
      return <Briefcase size={13} />;
    case 'tv':
      return <Tv size={13} />;
    case 'snowflake':
      return <Snowflake size={13} />;
    case 'coffee':
      return <Coffee size={13} />;
    default:
      return <ShieldCheck size={13} />;
  }
};

/**
 * Open/Closed Principle:
 * TicketCard renders transport-specific elements via cardStrategyRegistry
 * without modifying its core layout logic.
 */
export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onSelect,
  isSelected = false,
  onViewDetails,
}) => {
  const strategy = cardStrategyRegistry.get(ticket.transportType);

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  return (
    <div className={`ticket-card ${isSelected ? 'ticket-card--selected' : ''}`}>
      {/* 1. Card Top Bar: Carrier Info & Transport Mode Badge */}
      <div className="ticket-card__header">
        <div className="ticket-card__carrier">
          <CarrierLogo
            carrier={ticket.carrierLogo}
            code={ticket.carrierCode}
            name={ticket.carrierName}
            variant="badge"
            size="md"
          />
          <div className="ticket-card__carrier-info">
            <strong className="ticket-card__carrier-name">{ticket.carrierName}</strong>
            <span className="ticket-card__vehicle-number">
              {strategy.vehicleLabel}: {ticket.vehicleNumber} ({ticket.vehicleName})
            </span>
          </div>
        </div>

        <div className="ticket-card__header-tags">
          <Tag className={`ticket-card__badge ${strategy.badgeColorClass}`}>
            <span className="ticket-card__badge-icon">{strategy.badgeIcon}</span>
            {strategy.badgeLabel}
          </Tag>
          <Tag color={strategy.getSeatClassTagColor(ticket.seatClass)}>
            {ticket.seatClassName}
          </Tag>
        </div>
      </div>

      {/* 2. Journey Core: Departure -> Duration & Stops -> Arrival */}
      <div className="ticket-card__journey">
        {/* Departure */}
        <div className="ticket-card__point ticket-card__point--origin">
          <span className="ticket-card__time">{formatTime(ticket.departureTime)}</span>
          <strong className="ticket-card__code">{ticket.origin.code}</strong>
          <span className="ticket-card__station-name">{ticket.origin.city}</span>
          <span className="ticket-card__sub-location">
            {strategy.formatLocationSubtitle(ticket.origin)}
          </span>
        </div>

        {/* Timeline Arrow & Duration */}
        <div className="ticket-card__timeline">
          <div className="ticket-card__duration">
            <Clock size={12} className="ticket-card__duration-icon" />
            <span>{formatDuration(ticket.durationMinutes)}</span>
          </div>
          <div className="ticket-card__timeline-track">
            <div className="ticket-card__timeline-dot" />
            <div className="ticket-card__timeline-line" />
            <div className="ticket-card__timeline-arrow">
              <ArrowRight size={14} />
            </div>
            <div className="ticket-card__timeline-dot" />
          </div>
          <span className="ticket-card__transit-type">
            {ticket.transitStops && ticket.transitStops.length > 0
              ? `${ticket.transitStops.length} điểm dừng`
              : 'Chạy thẳng'}
          </span>
        </div>

        {/* Arrival */}
        <div className="ticket-card__point ticket-card__point--destination">
          <span className="ticket-card__time">{formatTime(ticket.arrivalTime)}</span>
          <strong className="ticket-card__code">{ticket.destination.code}</strong>
          <span className="ticket-card__station-name">{ticket.destination.city}</span>
          <span className="ticket-card__sub-location">
            {strategy.formatLocationSubtitle(ticket.destination)}
          </span>
        </div>
      </div>

      {/* 3. Amenities & Baggage Bar */}
      <div className="ticket-card__amenities-bar">
        <div className="ticket-card__amenities-list">
          {ticket.amenities.slice(0, 4).map((am) => (
            <span key={am.id} className="ticket-card__amenity-pill" title={am.description || am.name}>
              {renderAmenityIcon(am.iconName)}
              <span className="ticket-card__amenity-name">{am.name}</span>
            </span>
          ))}
        </div>

        <span className="ticket-card__baggage-text">
          <Briefcase size={13} className="ticket-card__baggage-icon" />
          {strategy.getBaggageSummary(ticket)}
        </span>
      </div>

      {/* 4. Footer: Ratings, Pricing & CTA Selection */}
      <div className="ticket-card__footer">
        <div className="ticket-card__rating-wrap">
          <span className="ticket-card__rating">
            <Star size={14} className="ticket-card__star-icon" fill="#f59e0b" color="#f59e0b" />
            <strong>{ticket.rating}</strong>
            <small>({ticket.reviewCount})</small>
          </span>

          {ticket.availableSeats <= 8 && (
            <span className="ticket-card__urgency-tag">
              Chỉ còn {ticket.availableSeats} chỗ!
            </span>
          )}

          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(ticket)}
              className="ticket-card__details-trigger"
            >
              <Info size={13} />
              Chi tiết vé
            </button>
          )}
        </div>

        <div className="ticket-card__price-action">
          <div className="ticket-card__pricing">
            {ticket.originalPrice && ticket.originalPrice > ticket.price && (
              <span className="ticket-card__original-price">
                {ticket.originalPrice.toLocaleString('vi-VN')} đ
              </span>
            )}
            <div className="ticket-card__final-price">
              <strong>{ticket.price.toLocaleString('vi-VN')}</strong>
              <small>VNĐ / khách</small>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={() => onSelect(ticket)}
            className="ticket-card__select-button"
          >
            {isSelected ? 'Đã chọn vé' : 'Chọn vé'}
          </Button>
        </div>
      </div>
    </div>
  );
};
