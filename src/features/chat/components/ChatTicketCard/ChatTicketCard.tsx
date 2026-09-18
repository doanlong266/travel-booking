import React from 'react';
import { Plane, Train, Bus, Ticket, ArrowRight, Clock, ShieldCheck, ExternalLink, RotateCcw } from 'lucide-react';
import type { IChatTicketPayload } from '../../../../types/chat.types';
import './ChatTicketCard.scss';

interface ChatTicketCardProps {
  ticket: IChatTicketPayload;
  onOpenLookup?: (bookingId: string) => void;
  onOpenRefund?: (bookingId: string) => void;
}

export const getCityIataCode = (cityName: string, fallbackCode?: string): string => {
  if (fallbackCode && fallbackCode.length === 3 && !fallbackCode.includes(' ')) {
    return fallbackCode.toUpperCase();
  }
  const normalized = (cityName || '').toLowerCase();
  if (normalized.includes('hà nội') || normalized.includes('ha noi')) return 'HAN';
  if (normalized.includes('hồ chí minh') || normalized.includes('ho chi minh') || normalized.includes('sài gòn')) return 'SGN';
  if (normalized.includes('đà nẵng') || normalized.includes('da nang')) return 'DAD';
  if (normalized.includes('nha trang') || normalized.includes('cam ranh')) return 'CXR';
  if (normalized.includes('phú quốc') || normalized.includes('phu quoc')) return 'PQC';
  if (normalized.includes('hải phòng') || normalized.includes('hai phong')) return 'HPH';
  if (normalized.includes('huế') || normalized.includes('hue')) return 'HUI';
  if (normalized.includes('cần thơ') || normalized.includes('can tho')) return 'VCA';
  if (normalized.includes('quy nhơn') || normalized.includes('quy nhon')) return 'UIH';
  if (normalized.includes('đà lạt') || normalized.includes('da lat') || normalized.includes('liên khương')) return 'DLI';
  if (normalized.includes('vinh')) return 'VII';
  if (normalized.includes('thanh hóa') || normalized.includes('thanh hoa')) return 'THD';
  if (normalized.includes('buôn ma thuột') || normalized.includes('buon ma thuot')) return 'BMV';
  
  // Clean fallback without diacritics
  const clean = cityName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z]/g, '');
  return (clean.slice(0, 3) || 'LOC').toUpperCase();
};

export const ChatTicketCard: React.FC<ChatTicketCardProps> = ({
  ticket,
  onOpenLookup,
  onOpenRefund
}) => {
  const renderTransportIcon = () => {
    switch (ticket.transportType) {
      case 'flight':
        return <Plane size={13} color="var(--color-primary, #0066cc)" />;
      case 'train':
        return <Train size={13} color="var(--color-secondary, #0d9488)" />;
      case 'bus':
        return <Bus size={13} color="var(--color-accent, #f97316)" />;
      default:
        return <Ticket size={13} color="var(--color-primary, #0066cc)" />;
    }
  };

  const getStatusBadge = () => {
    switch (ticket.paymentStatus) {
      case 'confirmed':
        return { label: 'Đã thanh toán', className: 'chat-ticket-card__status--confirmed' };
      case 'pending_payment':
        return { label: 'Chờ thanh toán', className: 'chat-ticket-card__status--pending' };
      case 'cancelled':
        return { label: 'Đã hủy vé', className: 'chat-ticket-card__status--cancelled' };
      default:
        return { label: 'Hết hạn', className: 'chat-ticket-card__status--expired' };
    }
  };

  const statusInfo = getStatusBadge();
  const originIata = getCityIataCode(ticket.originCity, ticket.originCode);
  const destIata = getCityIataCode(ticket.destinationCity, ticket.destinationCode);

  return (
    <div className="chat-ticket-card">
      {/* 1. Header: Carrier name, Status Tag, PNR Code */}
      <div className="chat-ticket-card__header">
        <div className="chat-ticket-card__carrier">
          <div className="chat-ticket-card__icon-box">
            {renderTransportIcon()}
          </div>
          <div className="chat-ticket-card__carrier-info">
            <span className="chat-ticket-card__carrier-name">{ticket.carrierName}</span>
            <span className="chat-ticket-card__seat-class">{ticket.seatClass}</span>
          </div>
        </div>

        <div className="chat-ticket-card__header-tags">
          <span className={`chat-ticket-card__status-tag ${statusInfo.className}`}>
            <ShieldCheck size={10} /> {statusInfo.label}
          </span>
          <div className="chat-ticket-card__pnr-badge">
            <Ticket size={10} />
            <span>{ticket.pnrCode}</span>
          </div>
        </div>
      </div>

      {/* 2. Route: Straight Single-Row Format Hà Nội (HAN) ──── ✈ ────> Hồ Chí Minh (SGN) */}
      <div className="chat-ticket-card__route-row">
        <div className="chat-ticket-card__location chat-ticket-card__location--origin">
          <span className="chat-ticket-card__city-name">{ticket.originCity}</span>
          <span className="chat-ticket-card__city-code">({originIata})</span>
        </div>

        <div className="chat-ticket-card__connector">
          <div className="chat-ticket-card__connector-bar" />
          <div className="chat-ticket-card__connector-icon">
            {renderTransportIcon()}
          </div>
          <ArrowRight size={12} className="chat-ticket-card__connector-arrow" />
        </div>

        <div className="chat-ticket-card__location chat-ticket-card__location--dest">
          <span className="chat-ticket-card__city-name">{ticket.destinationCity}</span>
          <span className="chat-ticket-card__city-code">({destIata})</span>
        </div>
      </div>

      {/* 3. Meta info: Departure time & Price */}
      <div className="chat-ticket-card__meta-row">
        <div className="chat-ticket-card__time">
          <Clock size={12} />
          <span>
            {new Date(ticket.departureTime).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })} • {new Date(ticket.departureTime).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div className="chat-ticket-card__price">
          {ticket.totalAmount.toLocaleString('vi-VN')} đ
        </div>
      </div>

      {/* 4. Action Buttons (Balanced 2-Button Row, Height 30px) */}
      <div className="chat-ticket-card__actions-row">
        {onOpenLookup && (
          <button
            type="button"
            className="chat-ticket-card__btn chat-ticket-card__btn--view"
            onClick={() => onOpenLookup(ticket.bookingId)}
            title="Xem chi tiết vé điện tử"
          >
            <ExternalLink size={12} /> Xem vé điện tử
          </button>
        )}
        {onOpenRefund && ticket.paymentStatus === 'confirmed' && (
          <button
            type="button"
            className="chat-ticket-card__btn chat-ticket-card__btn--refund"
            onClick={() => onOpenRefund(ticket.bookingId)}
            title="Yêu cầu đổi lịch hoặc hoàn vé"
          >
            <RotateCcw size={12} /> Đổi / Hoàn vé
          </button>
        )}
      </div>
    </div>
  );
};
