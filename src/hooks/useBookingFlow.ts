import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  ITicketItem,
  ISeatInfo,
  IPassengerInfo,
  IContactInfo,
  IBookingPayload,
  IBankTransferInfo,
} from '@/types/ticket';
import type { IGuestBookingOrder, IDraftBooking } from '@/types/guestLookup.types';
import { guestLookupService } from '@/services/guestLookup.service';

export type CheckoutStep = 'guest_info' | 'qr_payment' | 'payment_success';

export interface UseBookingFlowReturn {
  selectedTicket: ITicketItem | null;
  setSelectedTicket: (ticket: ITicketItem | null) => void;

  isSeatModalOpen: boolean;
  openSeatModal: (ticket: ITicketItem) => void;
  closeSeatModal: () => void;

  isCheckoutModalOpen: boolean;
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;

  checkoutStep: CheckoutStep;
  setCheckoutStep: (step: CheckoutStep) => void;

  selectedSeats: ISeatInfo[];
  toggleSeatSelection: (seat: ISeatInfo) => void;

  contactInfo: IContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<IContactInfo>>;

  passengers: IPassengerInfo[];
  setPassengers: React.Dispatch<React.SetStateAction<IPassengerInfo[]>>;
  updatePassenger: (index: number, data: Partial<IPassengerInfo>) => void;
  setPassengerCount: (count: number) => void;

  countdownSeconds: number;
  isTimerExpired: boolean;
  regenerateQR: () => void;

  confirmedBooking: IBookingPayload | null;
  proceedToCheckoutFromSeats: () => void;
  proceedToCheckoutWithSeats: (seats: ISeatInfo[]) => void;
  submitGuestInfoAndCreateQR: (contact: IContactInfo, passengerList: IPassengerInfo[], distanceKm: number) => void;
  simulatePaymentSuccess: () => void;
  resumeFromDraft: (draft: IDraftBooking) => void;
  rebookTicket: (order: IGuestBookingOrder) => void;
  resetBooking: () => void;
}

export const useBookingFlow = (_initialPassengerCount: number = 1): UseBookingFlowReturn => {
  const [selectedTicket, setSelectedTicket] = useState<ITicketItem | null>(null);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('guest_info');

  const [selectedSeats, setSelectedSeats] = useState<ISeatInfo[]>([]);

  const [contactInfo, setContactInfo] = useState<IContactInfo>({
    fullName: 'Nguyễn Văn An',
    phone: '0912345678',
    email: 'an.nguyen@example.com',
  });

  const [passengers, setPassengers] = useState<IPassengerInfo[]>([
    {
      fullName: 'Nguyễn Văn An',
      idNumber: '001200012345',
      passengerType: 'adult',
    },
  ]);

  // Countdown timer for VietQR (10 minutes = 600s)
  const [countdownSeconds, setCountdownSeconds] = useState<number>(600);
  const [isTimerExpired, setIsTimerExpired] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoPollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [confirmedBooking, setConfirmedBooking] = useState<IBookingPayload | null>(null);

  // Sync passengers length with count
  const setPassengerCount = useCallback((count: number) => {
    setPassengers((prev) => {
      const current = [...prev];
      if (count > current.length) {
        for (let i = current.length; i < count; i++) {
          current.push({
            fullName: '',
            idNumber: '',
            passengerType: 'adult',
          });
        }
      } else if (count < current.length) {
        return current.slice(0, count);
      }
      return current;
    });
  }, []);

  const openSeatModal = useCallback((ticket: ITicketItem) => {
    setSelectedTicket(ticket);
    setSelectedSeats([]);
    setIsSeatModalOpen(true);
  }, []);

  const closeSeatModal = useCallback(() => {
    setIsSeatModalOpen(false);
  }, []);

  const openCheckoutModal = useCallback(() => {
    setIsSeatModalOpen(false);
    setCheckoutStep('guest_info');
    setIsCheckoutModalOpen(true);
  }, []);

  const closeCheckoutModal = useCallback(() => {
    setIsCheckoutModalOpen(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoPollingRef.current) clearTimeout(autoPollingRef.current);
  }, []);

  const proceedToCheckoutFromSeats = useCallback(() => {
    setIsSeatModalOpen(false);
    setCheckoutStep('guest_info');
    setIsCheckoutModalOpen(true);
  }, []);

  const proceedToCheckoutWithSeats = useCallback((seats: ISeatInfo[]) => {
    setSelectedSeats(seats);
    setIsSeatModalOpen(false);
    setCheckoutStep('guest_info');
    setIsCheckoutModalOpen(true);
  }, []);

  const toggleSeatSelection = useCallback((seat: ISeatInfo) => {
    if (seat.isOccupied) return;

    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }
      return [...prev, seat];
    });
  }, []);

  const updatePassenger = useCallback((index: number, data: Partial<IPassengerInfo>) => {
    setPassengers((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], ...data };
      }
      return copy;
    });
  }, []);

  // Generate unique standard Ticket ID (e.g. TKT-VN-2026-89412X)
  const generateTicketId = useCallback((carrierCode: string): string => {
    const year = new Date().getFullYear();
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `TKT-${carrierCode}-${year}-${code}`;
  }, []);

  // Step 1 -> Step 2: Guest Info validated -> Generate QR & Bank Info
  const submitGuestInfoAndCreateQR = useCallback(
    (contact: IContactInfo, passengerList: IPassengerInfo[], distanceKm: number) => {
      if (!selectedTicket) return;

      const seatCount = Math.max(1, selectedSeats.length || passengerList.length);
      const totalAmount = selectedTicket.price * seatCount;
      const ticketId = generateTicketId(selectedTicket.carrierCode);

      const bankInfo: IBankTransferInfo = {
        bankName: 'MB Bank (Ngân Hàng TMCP Quân Đội)',
        bankCode: 'MB',
        accountNumber: '0919283848',
        accountName: 'CONG TY CONG NGHE OMNITRAVEL',
        amount: totalAmount,
        transferMemo: `OMNITRAVEL ${ticketId}`,
      };

      const booking: IBookingPayload = {
        ticketId,
        ticket: selectedTicket,
        contact,
        passengers: passengerList.map((p, idx) => ({
          ...p,
          seatNumber: selectedSeats[idx]?.number || 'Chưa chọn',
        })),
        totalAmount,
        distanceKm,
        bankInfo,
        paymentStatus: 'pending',
        bookingDate: new Date().toISOString(),
      };

      setConfirmedBooking(booking);
      setContactInfo(contact);
      setPassengers(passengerList);
      setCountdownSeconds(600); // 10 minutes
      setIsTimerExpired(false);
      setCheckoutStep('qr_payment');

      // Persist draft for guest recovery
      try {
        const order: IGuestBookingOrder = {
          bookingId: booking.ticketId,
          pnrCode: booking.ticketId.replace('TKT-', '').replace(/-/g, ''),
          transportType: booking.ticket.transportType,
          carrierId: booking.ticket.carrierId,
          carrierName: booking.ticket.carrierName,
          carrierLogo: booking.ticket.carrierLogo,
          carrierCode: booking.ticket.carrierCode,
          vehicleNumber: booking.ticket.vehicleNumber,
          vehicleName: booking.ticket.vehicleName,
          origin: {
            name: booking.ticket.origin.name,
            city: booking.ticket.origin.city,
            code: booking.ticket.origin.code,
            terminal: booking.ticket.origin.name,
          },
          destination: {
            name: booking.ticket.destination.name,
            city: booking.ticket.destination.city,
            code: booking.ticket.destination.code,
            terminal: booking.ticket.destination.name,
          },
          departureTime: booking.ticket.departureTime,
          arrivalTime: booking.ticket.arrivalTime,
          durationMinutes: booking.ticket.durationMinutes,
          seatClassName: booking.ticket.seatClassName,
          passengers: booking.passengers,
          contact: booking.contact,
          totalAmount: booking.totalAmount,
          paymentStatus: 'pending_payment',
          paymentMethod: 'VietQR Chuyển khoản',
          bookingDate: booking.bookingDate,
          qrData: `OMNITICKET|${booking.ticketId}|${booking.ticket.origin.code}-${booking.ticket.destination.code}`,
          baggagePolicy: booking.ticket.baggagePolicy,
          rawPayload: booking,
        };
        guestLookupService.saveBooking(order);

        const draft: IDraftBooking = {
          bookingId: booking.ticketId,
          payload: booking,
          paymentExpiresAt: Date.now() + 10 * 60 * 1000,
          createdAt: Date.now(),
        };
        localStorage.setItem('omniticket_guest_draft_booking_v1', JSON.stringify(draft));
      } catch {
        // ignore
      }

      // Start Countdown Timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsTimerExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Auto-simulate polling after 12s in case user doesn't press manual button
      if (autoPollingRef.current) clearTimeout(autoPollingRef.current);
      autoPollingRef.current = setTimeout(() => {
        // Will auto trigger if still pending and modal is open
        setConfirmedBooking((curr) => {
          if (curr && curr.paymentStatus === 'pending') {
            const updated = {
              ...curr,
              paymentStatus: 'success' as const,
              paidAt: new Date().toISOString(),
            };

            // Update confirmed in guest service
            try {
              const order: IGuestBookingOrder = {
                bookingId: updated.ticketId,
                pnrCode: updated.ticketId.replace('TKT-', '').replace(/-/g, ''),
                transportType: updated.ticket.transportType,
                carrierId: updated.ticket.carrierId,
                carrierName: updated.ticket.carrierName,
                carrierLogo: updated.ticket.carrierLogo,
                carrierCode: updated.ticket.carrierCode,
                vehicleNumber: updated.ticket.vehicleNumber,
                vehicleName: updated.ticket.vehicleName,
                origin: {
                  name: updated.ticket.origin.name,
                  city: updated.ticket.origin.city,
                  code: updated.ticket.origin.code,
                },
                destination: {
                  name: updated.ticket.destination.name,
                  city: updated.ticket.destination.city,
                  code: updated.ticket.destination.code,
                },
                departureTime: updated.ticket.departureTime,
                arrivalTime: updated.ticket.arrivalTime,
                durationMinutes: updated.ticket.durationMinutes,
                seatClassName: updated.ticket.seatClassName,
                passengers: updated.passengers,
                contact: updated.contact,
                totalAmount: updated.totalAmount,
                paymentStatus: 'confirmed',
                paymentMethod: 'VietQR Chuyển khoản',
                bookingDate: updated.bookingDate,
                paidAt: updated.paidAt,
                qrData: `OMNITICKET|${updated.ticketId}|${updated.ticket.origin.code}-${updated.ticket.destination.code}`,
                baggagePolicy: updated.ticket.baggagePolicy,
                rawPayload: updated,
              };
              guestLookupService.saveBooking(order);
              localStorage.removeItem('omniticket_guest_draft_booking_v1');
            } catch {
              // ignore
            }

            return updated;
          }
          return curr;
        });
        setCheckoutStep('payment_success');
      }, 12000);
    },
    [selectedTicket, selectedSeats, generateTicketId]
  );

  // Manual Instant Simulation Button for testing
  const simulatePaymentSuccess = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoPollingRef.current) clearTimeout(autoPollingRef.current);

    setConfirmedBooking((curr) => {
      if (!curr) return null;
      const updated = {
        ...curr,
        paymentStatus: 'success' as const,
        paidAt: new Date().toISOString(),
      };

      try {
        const order: IGuestBookingOrder = {
          bookingId: updated.ticketId,
          pnrCode: updated.ticketId.replace('TKT-', '').replace(/-/g, ''),
          transportType: updated.ticket.transportType,
          carrierId: updated.ticket.carrierId,
          carrierName: updated.ticket.carrierName,
          carrierLogo: updated.ticket.carrierLogo,
          carrierCode: updated.ticket.carrierCode,
          vehicleNumber: updated.ticket.vehicleNumber,
          vehicleName: updated.ticket.vehicleName,
          origin: {
            name: updated.ticket.origin.name,
            city: updated.ticket.origin.city,
            code: updated.ticket.origin.code,
          },
          destination: {
            name: updated.ticket.destination.name,
            city: updated.ticket.destination.city,
            code: updated.ticket.destination.code,
          },
          departureTime: updated.ticket.departureTime,
          arrivalTime: updated.ticket.arrivalTime,
          durationMinutes: updated.ticket.durationMinutes,
          seatClassName: updated.ticket.seatClassName,
          passengers: updated.passengers,
          contact: updated.contact,
          totalAmount: updated.totalAmount,
          paymentStatus: 'confirmed',
          paymentMethod: 'VietQR Chuyển khoản',
          bookingDate: updated.bookingDate,
          paidAt: updated.paidAt,
          qrData: `OMNITICKET|${updated.ticketId}|${updated.ticket.origin.code}-${updated.ticket.destination.code}`,
          baggagePolicy: updated.ticket.baggagePolicy,
          rawPayload: updated,
        };
        guestLookupService.saveBooking(order);
        localStorage.removeItem('omniticket_guest_draft_booking_v1');
      } catch {
        // ignore
      }

      return updated;
    });
    setCheckoutStep('payment_success');
  }, []);

  // Regenerate QR if expired
  const regenerateQR = useCallback(() => {
    if (!confirmedBooking) return;
    const newId = generateTicketId(confirmedBooking.ticket.carrierCode);
    setConfirmedBooking((curr) => {
      if (!curr) return null;
      return {
        ...curr,
        ticketId: newId,
        paymentStatus: 'pending',
        bankInfo: {
          ...curr.bankInfo,
          transferMemo: `OMNITRAVEL ${newId}`,
        },
      };
    });

    setCountdownSeconds(600);
    setIsTimerExpired(false);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [confirmedBooking, generateTicketId]);

  const resumeFromDraft = useCallback((draft: IDraftBooking) => {
    if (!draft || !draft.payload) return;
    const payload = draft.payload;
    setSelectedTicket(payload.ticket);
    setConfirmedBooking(payload);
    setContactInfo(payload.contact);
    setPassengers(payload.passengers);
    
    const rem = Math.max(10, Math.floor((draft.paymentExpiresAt - Date.now()) / 1000));
    setCountdownSeconds(rem);
    setIsTimerExpired(rem <= 0);
    setCheckoutStep('qr_payment');
    setIsCheckoutModalOpen(true);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const rebookTicket = useCallback((order: IGuestBookingOrder) => {
    if (order.rawPayload?.ticket) {
      setSelectedTicket(order.rawPayload.ticket);
    }
    setContactInfo(order.contact);
    setPassengers(order.passengers);
    setCheckoutStep('guest_info');
    setIsCheckoutModalOpen(true);
  }, []);

  const resetBooking = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoPollingRef.current) clearTimeout(autoPollingRef.current);
    setSelectedTicket(null);
    setSelectedSeats([]);
    setConfirmedBooking(null);
    setIsSeatModalOpen(false);
    setIsCheckoutModalOpen(false);
    setCheckoutStep('guest_info');
    setCountdownSeconds(600);
    setIsTimerExpired(false);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoPollingRef.current) clearTimeout(autoPollingRef.current);
    };
  }, []);

  return {
    selectedTicket,
    setSelectedTicket,
    isSeatModalOpen,
    openSeatModal,
    closeSeatModal,
    isCheckoutModalOpen,
    openCheckoutModal,
    closeCheckoutModal,
    checkoutStep,
    setCheckoutStep,
    selectedSeats,
    toggleSeatSelection,
    contactInfo,
    setContactInfo,
    passengers,
    setPassengers,
    updatePassenger,
    setPassengerCount,
    countdownSeconds,
    isTimerExpired,
    regenerateQR,
    confirmedBooking,
    proceedToCheckoutFromSeats,
    proceedToCheckoutWithSeats,
    submitGuestInfoAndCreateQR,
    simulatePaymentSuccess,
    resumeFromDraft,
    rebookTicket,
    resetBooking,
  };
};

