import { useState, useCallback, useMemo } from 'react';
import { message } from 'antd';
import type { ISeatInfo } from '@/types/ticket';

export interface UseSeatSelectionProps {
  maxSeats: number;
  initialSeats?: ISeatInfo[];
}

export interface UseSeatSelectionReturn {
  selectedSeats: ISeatInfo[];
  toggleSeat: (seat: ISeatInfo) => void;
  clearSeats: () => void;
  isSelected: (seatId: string) => boolean;
  isSelectionComplete: boolean;
  selectedSeatNumbers: string;
}

/**
 * Custom Hook: useSeatSelection
 * Single Responsibility: Manages seat selection constraints and rules.
 * - If maxSeats === 1: Single select mode (clicking another seat replaces immediately).
 * - If maxSeats > 1: Multi select mode (caps at maxSeats, displays warning on exceed).
 */
export const useSeatSelection = ({
  maxSeats,
  initialSeats = [],
}: UseSeatSelectionProps): UseSeatSelectionReturn => {
  const [selectedSeats, setSelectedSeats] = useState<ISeatInfo[]>(initialSeats);

  const toggleSeat = useCallback(
    (seat: ISeatInfo) => {
      // 1. Cannot select occupied seats
      if (seat.isOccupied) return;

      setSelectedSeats((prev) => {
        const alreadySelected = prev.some((s) => s.id === seat.id);

        // A. If already selected -> Deselect it
        if (alreadySelected) {
          return prev.filter((s) => s.id !== seat.id);
        }

        // B. Single select mode (maxSeats === 1)
        if (maxSeats <= 1) {
          // Immediately replace with the newly clicked seat
          return [seat];
        }

        // C. Multi select mode (maxSeats > 1)
        if (prev.length >= maxSeats) {
          message.warning(
            `Bạn chỉ được chọn tối đa ${maxSeats} ghế tương ứng với ${maxSeats} hành khách.`
          );
          return prev;
        }

        // Add to selection
        return [...prev, seat];
      });
    },
    [maxSeats]
  );

  const clearSeats = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  const isSelected = useCallback(
    (seatId: string) => {
      return selectedSeats.some((s) => s.id === seatId);
    },
    [selectedSeats]
  );

  const isSelectionComplete = useMemo(() => {
    return selectedSeats.length === maxSeats;
  }, [selectedSeats.length, maxSeats]);

  const selectedSeatNumbers = useMemo(() => {
    return selectedSeats.map((s) => s.number).join(', ');
  }, [selectedSeats]);

  return {
    selectedSeats,
    toggleSeat,
    clearSeats,
    isSelected,
    isSelectionComplete,
    selectedSeatNumbers,
  };
};
