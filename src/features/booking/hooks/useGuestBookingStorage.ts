import { useState, useEffect, useCallback } from 'react';
import type { 
  IGuestBookingOrder, 
  IGuestRecentBooking, 
  IDraftBooking 
} from '../../../types/guestLookup.types';
import type { IBookingPayload } from '../../../types/ticket';

const RECENT_STORAGE_KEY = 'omniticket_guest_recent_bookings_v1';
const DRAFT_STORAGE_KEY = 'omniticket_guest_draft_booking_v1';
const MAX_RECENT_ITEMS = 5;

export interface UseGuestBookingStorageReturn {
  recentBookings: IGuestRecentBooking[];
  draftBooking: IDraftBooking | null;
  hasPendingDraft: boolean;
  remainingDraftSeconds: number;
  latestRecentBooking: IGuestRecentBooking | null;
  addRecentBooking: (order: IGuestBookingOrder) => void;
  removeRecentBooking: (bookingId: string) => void;
  saveDraft: (payload: IBookingPayload, paymentExpiresAtMs?: number) => void;
  clearDraft: () => void;
  refreshStorage: () => void;
}

export const useGuestBookingStorage = (): UseGuestBookingStorageReturn => {
  const [recentBookings, setRecentBookings] = useState<IGuestRecentBooking[]>(() => {
    try {
      const raw = localStorage.getItem(RECENT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    // Default seed initial recent booking for demo experience
    return [
      {
        bookingId: 'TKT-VN-2026-89412X',
        pnrCode: 'VN89412X',
        transportType: 'flight',
        carrierName: 'Vietnam Airlines',
        carrierLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80',
        originCity: 'Hà Nội',
        destinationCity: 'Hồ Chí Minh',
        routeSummary: 'Hà Nội (HAN) → Hồ Chí Minh (SGN)',
        departureTime: '2026-10-20T08:00:00+07:00',
        totalAmount: 3850000,
        paymentStatus: 'confirmed',
        passengerCount: 2,
        contactPhone: '0912345678',
        contactEmail: 'doanle@omniticket.vn',
        bookedAt: '2026-09-15T14:30:00+07:00'
      }
    ];
  });

  const [draftBooking, setDraftBooking] = useState<IDraftBooking | null>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [remainingDraftSeconds, setRemainingDraftSeconds] = useState<number>(0);

  // Sync state on external storage events or refresh
  const refreshStorage = useCallback(() => {
    try {
      const recentRaw = localStorage.getItem(RECENT_STORAGE_KEY);
      if (recentRaw) {
        setRecentBookings(JSON.parse(recentRaw));
      }
      const draftRaw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draftRaw) {
        setDraftBooking(JSON.parse(draftRaw));
      } else {
        setDraftBooking(null);
      }
    } catch {
      // ignore
    }
  }, []);

  // Update countdown timer for draft booking
  useEffect(() => {
    if (!draftBooking || !draftBooking.paymentExpiresAt) {
      setRemainingDraftSeconds(0);
      return;
    }

    const calculateRemaining = () => {
      const diff = Math.max(0, Math.floor((draftBooking.paymentExpiresAt - Date.now()) / 1000));
      setRemainingDraftSeconds(diff);
      return diff;
    };

    calculateRemaining();
    const interval = setInterval(() => {
      const rem = calculateRemaining();
      if (rem <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [draftBooking]);

  const addRecentBooking = useCallback((order: IGuestBookingOrder) => {
    try {
      const newItem: IGuestRecentBooking = {
        bookingId: order.bookingId,
        pnrCode: order.pnrCode,
        transportType: order.transportType,
        carrierName: order.carrierName,
        carrierLogo: order.carrierLogo,
        originCity: order.origin.city,
        destinationCity: order.destination.city,
        routeSummary: `${order.origin.city} (${order.origin.code}) → ${order.destination.city} (${order.destination.code})`,
        departureTime: order.departureTime,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        passengerCount: order.passengers.length || 1,
        contactPhone: order.contact.phone,
        contactEmail: order.contact.email,
        bookedAt: new Date().toISOString()
      };

      setRecentBookings(prev => {
        const filtered = prev.filter(b => b.bookingId.toUpperCase() !== newItem.bookingId.toUpperCase());
        const updated = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
        try {
          localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    } catch (e) {
      console.warn('Failed to add recent booking:', e);
    }
  }, []);

  const removeRecentBooking = useCallback((bookingId: string) => {
    setRecentBookings(prev => {
      const updated = prev.filter(b => b.bookingId.toUpperCase() !== bookingId.toUpperCase());
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const saveDraft = useCallback((payload: IBookingPayload, paymentExpiresAtMs?: number) => {
    try {
      const draft: IDraftBooking = {
        bookingId: payload.ticketId,
        payload,
        paymentExpiresAt: paymentExpiresAtMs || Date.now() + 15 * 60 * 1000,
        createdAt: Date.now()
      };
      setDraftBooking(draft);
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn('Failed to save draft booking:', e);
    }
  }, []);

  const clearDraft = useCallback(() => {
    try {
      setDraftBooking(null);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setRemainingDraftSeconds(0);
    } catch {
      // ignore
    }
  }, []);

  const hasPendingDraft = Boolean(draftBooking && remainingDraftSeconds > 0);
  const latestRecentBooking = recentBookings.length > 0 ? recentBookings[0] : null;

  return {
    recentBookings,
    draftBooking,
    hasPendingDraft,
    remainingDraftSeconds,
    latestRecentBooking,
    addRecentBooking,
    removeRecentBooking,
    saveDraft,
    clearDraft,
    refreshStorage
  };
};
