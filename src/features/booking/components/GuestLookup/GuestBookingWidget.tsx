import React, { useState } from 'react';
import { Clock, Ticket, X, ArrowRight, Zap } from 'lucide-react';
import { useGuestBookingStorage } from '../../hooks/useGuestBookingStorage';
import type { IDraftBooking } from '../../../../types/guestLookup.types';

interface GuestBookingWidgetProps {
  onOpenLookup: (bookingId?: string) => void;
  onResumeDraft?: (draft: IDraftBooking) => void;
}

const formatCountdown = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const GuestBookingWidget: React.FC<GuestBookingWidgetProps> = ({
  onOpenLookup,
  onResumeDraft
}) => {
  const { 
    hasPendingDraft, 
    remainingDraftSeconds, 
    draftBooking, 
    latestRecentBooking 
  } = useGuestBookingStorage();

  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Case 1: Active pending checkout with countdown
  if (hasPendingDraft && draftBooking) {
    const ticket = draftBooking.payload?.ticket;
    const route = ticket 
      ? `${ticket.origin.city} → ${ticket.destination.city}`
      : 'Chuyến đi';

    return (
      <div className="guest-widget" role="complementary" aria-label="Khôi phục đơn đặt vé">
        <div className="guest-widget__card guest-widget__card--pending">
          <button 
            type="button" 
            className="guest-widget__close-btn" 
            onClick={() => setDismissed(true)}
            aria-label="Đóng thông báo"
          >
            <X size={12} />
          </button>

          <div className="guest-widget__icon-box guest-widget__icon-box--pending">
            <Clock size={20} />
          </div>

          <div className="guest-widget__content">
            <div className="guest-widget__title" style={{ color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={13} fill="#b45309" /> Đơn chưa thanh toán ({formatCountdown(remainingDraftSeconds)})
            </div>
            <div className="guest-widget__desc">
              {route} ({ticket?.carrierName || 'OmniTicket'})
            </div>
          </div>

          <button
            type="button"
            className="guest-widget__action-btn guest-widget__action-btn--pending"
            onClick={() => {
              if (onResumeDraft) {
                onResumeDraft(draftBooking);
              } else {
                onOpenLookup(draftBooking.bookingId);
              }
            }}
          >
            Tiếp tục <ArrowRight size={12} style={{ display: 'inline', marginLeft: '2px' }} />
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Latest recent confirmed booking notification
  if (latestRecentBooking && latestRecentBooking.paymentStatus === 'confirmed') {
    return (
      <div className="guest-widget" role="complementary" aria-label="Thông báo vé đã đặt">
        <div className="guest-widget__card guest-widget__card--recent">
          <button 
            type="button" 
            className="guest-widget__close-btn" 
            onClick={() => setDismissed(true)}
            aria-label="Đóng thông báo"
          >
            <X size={12} />
          </button>

          <div className="guest-widget__icon-box guest-widget__icon-box--recent">
            <Ticket size={20} />
          </div>

          <div className="guest-widget__content">
            <div className="guest-widget__title">
              Vé đã đặt: {latestRecentBooking.originCity} → {latestRecentBooking.destinationCity}
            </div>
            <div className="guest-widget__desc">
              Khởi hành: {new Date(latestRecentBooking.departureTime).toLocaleDateString('vi-VN')} ({latestRecentBooking.carrierName})
            </div>
          </div>

          <button
            type="button"
            className="guest-widget__action-btn"
            onClick={() => onOpenLookup(latestRecentBooking.bookingId)}
          >
            Xem vé
          </button>
        </div>
      </div>
    );
  }

  return null;
};
