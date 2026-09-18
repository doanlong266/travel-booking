import React from 'react';
import { Drawer, Tag, Button, Divider } from 'antd';
import {
  ShieldCheck,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import type { ITicketItem } from '@/types/ticket';
import { CarrierLogo } from '@/components/common/CarrierLogo';

interface TicketDetailDrawerProps {
  ticket: ITicketItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (ticket: ITicketItem) => void;
}

export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({
  ticket,
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!ticket) return null;

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })} • ${d.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}`;
  };

  return (
    <Drawer
      title={
        <div className="ticket-detail__drawer-title">
          <CarrierLogo
            carrier={ticket.carrierLogo}
            code={ticket.carrierCode}
            name={ticket.carrierName}
            variant="badge"
            size="md"
          />
          <div>
            <strong>{ticket.carrierName}</strong>
            <span className="ticket-detail__sub">{ticket.vehicleName}</span>
          </div>
        </div>
      }
      placement="right"
      width={480}
      open={isOpen}
      onClose={onClose}
      className="ticket-detail"
      footer={
        <div className="ticket-detail__footer">
          <div className="ticket-detail__footer-price">
            <span className="ticket-detail__price-label">Giá trọn gói</span>
            <strong className="ticket-detail__price-val">
              {ticket.price.toLocaleString('vi-VN')} đ
            </strong>
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              onClose();
              onSelect(ticket);
            }}
            className="ticket-detail__book-btn"
          >
            Tiến hành chọn ghế
          </Button>
        </div>
      }
    >
      {/* 1. Journey Timeline */}
      <div className="ticket-detail__section">
        <h4 className="ticket-detail__heading">Chi tiết hành trình</h4>
        <div className="ticket-detail__timeline">
          {/* Origin */}
          <div className="ticket-detail__timeline-step">
            <div className="ticket-detail__step-marker ticket-detail__step-marker--origin" />
            <div className="ticket-detail__step-info">
              <span className="ticket-detail__step-time">{formatDateTime(ticket.departureTime)}</span>
              <strong className="ticket-detail__step-place">
                {ticket.origin.city} ({ticket.origin.code})
              </strong>
              <p className="ticket-detail__step-terminal">{ticket.origin.name}</p>
              <span className="ticket-detail__step-address">{ticket.origin.address}</span>
            </div>
          </div>

          {/* Transit stops if any */}
          {ticket.transitStops?.map((stop, idx) => (
            <div key={idx} className="ticket-detail__timeline-step ticket-detail__timeline-step--transit">
              <div className="ticket-detail__step-marker ticket-detail__step-marker--transit" />
              <div className="ticket-detail__step-info">
                <span className="ticket-detail__step-transit-tag">
                  Dừng {stop.durationMinutes} phút tại {stop.locationName}
                </span>
              </div>
            </div>
          ))}

          {/* Destination */}
          <div className="ticket-detail__timeline-step">
            <div className="ticket-detail__step-marker ticket-detail__step-marker--dest" />
            <div className="ticket-detail__step-info">
              <span className="ticket-detail__step-time">{formatDateTime(ticket.arrivalTime)}</span>
              <strong className="ticket-detail__step-place">
                {ticket.destination.city} ({ticket.destination.code})
              </strong>
              <p className="ticket-detail__step-terminal">{ticket.destination.name}</p>
              <span className="ticket-detail__step-address">{ticket.destination.address}</span>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* 2. Baggage & Cabin Class */}
      <div className="ticket-detail__section">
        <h4 className="ticket-detail__heading">Quy định hành lý & Hạng vé</h4>
        <div className="ticket-detail__baggage-box">
          <div className="ticket-detail__baggage-row">
            <Briefcase size={16} className="ticket-detail__box-icon" />
            <div>
              <strong>Hành lý xách tay:</strong> {ticket.baggagePolicy.carryOnKg}kg / khách
            </div>
          </div>
          <div className="ticket-detail__baggage-row">
            <ShieldCheck size={16} className="ticket-detail__box-icon" />
            <div>
              <strong>Hành lý ký gửi:</strong>{' '}
              {ticket.baggagePolicy.checkedKg > 0
                ? `${ticket.baggagePolicy.checkedKg}kg tiêu chuẩn`
                : 'Chưa bao gồm hành lý ký gửi'}
            </div>
          </div>
          <div className="ticket-detail__baggage-row">
            <CheckCircle2 size={16} className="ticket-detail__box-icon" />
            <div>
              <strong>Hạng vé:</strong> {ticket.seatClassName}
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* 3. Included Amenities */}
      <div className="ticket-detail__section">
        <h4 className="ticket-detail__heading">Tiện ích đi kèm</h4>
        <div className="ticket-detail__amenity-chips">
          {ticket.amenities.map((am) => (
            <Tag key={am.id} className="ticket-detail__amenity-tag">
              {am.name}
            </Tag>
          ))}
        </div>
      </div>

      <Divider />

      {/* 4. Cancellation Policy */}
      <div className="ticket-detail__section">
        <h4 className="ticket-detail__heading">Chính sách hoàn / đổi vé</h4>
        <div className="ticket-detail__policy-box">
          <AlertCircle size={16} className="ticket-detail__policy-icon" />
          <p className="ticket-detail__policy-text">{ticket.cancellationPolicy}</p>
        </div>
      </div>
    </Drawer>
  );
};
