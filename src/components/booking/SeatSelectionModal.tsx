import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Button, Tag } from 'antd';
import type { ITicketItem, ISeatInfo } from '@/types/ticket';
import { useSeatSelection } from '@/hooks/useSeatSelection';
import { CarrierLogo } from '@/components/common/CarrierLogo';

interface SeatSelectionModalProps {
  ticket: ITicketItem | null;
  isOpen: boolean;
  onClose: () => void;
  selectedSeats: ISeatInfo[];
  onConfirmSeats: (seats: ISeatInfo[]) => void;
  maxPassengers: number;
}

export const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
  ticket,
  isOpen,
  onClose,
  selectedSeats: initialSelectedSeats,
  onConfirmSeats,
  maxPassengers,
}) => {
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');

  // Dedicated custom hook for seat selection constraints
  const {
    selectedSeats,
    toggleSeat,
    clearSeats,
    isSelected,
    selectedSeatNumbers,
  } = useSeatSelection({
    maxSeats: maxPassengers,
    initialSeats: initialSelectedSeats,
  });

  // Reset seats when ticket changes or modal opens with new ticket
  useEffect(() => {
    if (!isOpen) {
      clearSeats();
    }
  }, [isOpen, clearSeats]);

  // Generate realistic seat layout based on transport type
  const seatLayout = useMemo((): ISeatInfo[] => {
    if (!ticket) return [];

    const seats: ISeatInfo[] = [];

    if (ticket.transportType === 'flight') {
      // Airplane: 8 rows, 6 columns (A, B, C | D, E, F)
      const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
      for (let r = 1; r <= 8; r++) {
        for (const col of cols) {
          const seatNum = `${r}${col}`;
          const isOccupied = (r * 3 + col.charCodeAt(0)) % 5 === 0;
          seats.push({
            id: `flight-seat-${seatNum}`,
            number: seatNum,
            row: r,
            column: col,
            type: r <= 2 ? 'business' : 'economy',
            price: ticket.price + (r <= 2 ? 300000 : 0),
            isAvailable: !isOccupied,
            isOccupied,
          });
        }
      }
    } else if (ticket.transportType === 'train') {
      // Train: 6 cabins, each has 4 berths (1-4)
      for (let c = 1; c <= 6; c++) {
        for (let b = 1; b <= 4; b++) {
          const num = (c - 1) * 4 + b;
          const seatNum = `K${c}-G${num}`;
          const isOccupied = num % 4 === 1;
          seats.push({
            id: `train-seat-${num}`,
            number: seatNum,
            carNumber: 3,
            type: 'sleeper_4',
            price: ticket.price,
            isAvailable: !isOccupied,
            isOccupied,
          });
        }
      }
    } else {
      // Bus: Sleeper bus 2 decks (Tầng 1: A01-A12, Tầng 2: B01-B12)
      for (let i = 1; i <= 12; i++) {
        const lowerOccupied = (i * 2) % 3 === 0;
        const upperOccupied = (i * 3) % 4 === 0;
        seats.push({
          id: `bus-seat-A${i}`,
          number: `A${i < 10 ? '0' : ''}${i}`,
          deck: 'lower',
          type: 'limousine_vip',
          price: ticket.price,
          isAvailable: !lowerOccupied,
          isOccupied: lowerOccupied,
        });
        seats.push({
          id: `bus-seat-B${i}`,
          number: `B${i < 10 ? '0' : ''}${i}`,
          deck: 'upper',
          type: 'limousine_vip',
          price: ticket.price,
          isAvailable: !upperOccupied,
          isOccupied: upperOccupied,
        });
      }
    }

    return seats;
  }, [ticket]);

  if (!ticket) return null;

  const totalSeatsPrice = selectedSeats.length * ticket.price;
  const isComplete = selectedSeats.length === maxPassengers;

  const handleProceed = () => {
    onConfirmSeats(selectedSeats);
  };

  return (
    <Modal
      title={
        <div className="seat-modal__title-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CarrierLogo
              carrier={ticket.carrierLogo}
              code={ticket.carrierCode}
              name={ticket.carrierName}
              variant="badge"
              size="md"
            />
            <div className="seat-modal__title-info">
              <h3 className="seat-modal__title">Sơ đồ chọn vị trí chỗ ngồi</h3>
              <span className="seat-modal__subtitle">
                {ticket.carrierName} • {ticket.vehicleNumber} ({ticket.vehicleName})
              </span>
            </div>
          </div>
          <Tag color={isComplete ? 'green' : 'blue'} className="seat-modal__count-tag">
            Đã chọn: {selectedSeats.length} / {maxPassengers} ghế
          </Tag>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={760}
      className="seat-modal"
      footer={
        <div className="seat-modal__footer">
          <div className="seat-modal__footer-summary">
            <span className="seat-modal__summary-label">Vị trí đã chọn:</span>
            <strong className="seat-modal__summary-seats">
              {selectedSeatNumbers || 'Chưa chọn ghế nào'}
            </strong>
          </div>
          <div className="seat-modal__footer-actions">
            <Button onClick={onClose} className="seat-modal__cancel-btn">
              Đóng
            </Button>
            <Button
              type="primary"
              size="large"
              disabled={selectedSeats.length === 0}
              onClick={handleProceed}
              className="seat-modal__proceed-btn"
            >
              Tiếp tục đặt vé ({totalSeatsPrice.toLocaleString('vi-VN')} đ)
            </Button>
          </div>
        </div>
      }
    >
      {/* 1. Legend Bar */}
      <div className="seat-modal__legend">
        <div className="seat-modal__legend-item">
          <div className="seat-modal__legend-box seat-modal__legend-box--available" />
          <span>Còn trống</span>
        </div>
        <div className="seat-modal__legend-item">
          <div className="seat-modal__legend-box seat-modal__legend-box--selected" />
          <span>Đang chọn</span>
        </div>
        <div className="seat-modal__legend-item">
          <div className="seat-modal__legend-box seat-modal__legend-box--occupied" />
          <span>Đã có người</span>
        </div>
      </div>

      {/* 2. Transport-Specific Deck Selector (for Bus) */}
      {ticket.transportType === 'bus' && (
        <div className="seat-modal__deck-switcher">
          <button
            type="button"
            onClick={() => setActiveDeck('lower')}
            className={`seat-modal__deck-btn ${
              activeDeck === 'lower' ? 'seat-modal__deck-btn--active' : ''
            }`}
          >
            Tầng 1 (Tầng dưới)
          </button>
          <button
            type="button"
            onClick={() => setActiveDeck('upper')}
            className={`seat-modal__deck-btn ${
              activeDeck === 'upper' ? 'seat-modal__deck-btn--active' : ''
            }`}
          >
            Tầng 2 (Tầng trên)
          </button>
        </div>
      )}

      {/* 3. Interactive Cabin / Carriage Layout */}
      <div className="seat-modal__cabin-container">
        {/* Airplane Cabin Layout */}
        {ticket.transportType === 'flight' && (
          <div className="seat-modal__flight-cabin">
            <div className="seat-modal__cockpit-nose">Khoang Lái (Đầu máy bay)</div>
            <div className="seat-modal__flight-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((rowNum) => {
                const rowSeats = seatLayout.filter((s) => s.row === rowNum);
                const leftSeats = rowSeats.filter((s) => ['A', 'B', 'C'].includes(s.column || ''));
                const rightSeats = rowSeats.filter((s) => ['D', 'E', 'F'].includes(s.column || ''));

                return (
                  <div key={rowNum} className="seat-modal__flight-row">
                    <div className="seat-modal__seat-group">
                      {leftSeats.map((seat) => (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={seat.isOccupied}
                          onClick={() => toggleSeat(seat)}
                          className={`seat-modal__seat-button ${
                            isSelected(seat.id)
                              ? 'seat-modal__seat-button--selected'
                              : seat.isOccupied
                              ? 'seat-modal__seat-button--occupied'
                              : 'seat-modal__seat-button--available'
                          }`}
                        >
                          {seat.column}
                        </button>
                      ))}
                    </div>

                    <div className="seat-modal__aisle-num">{rowNum}</div>

                    <div className="seat-modal__seat-group">
                      {rightSeats.map((seat) => (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={seat.isOccupied}
                          onClick={() => toggleSeat(seat)}
                          className={`seat-modal__seat-button ${
                            isSelected(seat.id)
                              ? 'seat-modal__seat-button--selected'
                              : seat.isOccupied
                              ? 'seat-modal__seat-button--occupied'
                              : 'seat-modal__seat-button--available'
                          }`}
                        >
                          {seat.column}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Train Carriage Layout */}
        {ticket.transportType === 'train' && (
          <div className="seat-modal__train-cabin">
            <div className="seat-modal__cabin-indicator">Toa số 03 • Khoang Nằm Điều Hòa</div>
            <div className="seat-modal__train-grid">
              {[1, 2, 3, 4, 5, 6].map((cabinNum) => {
                const cabinSeats = seatLayout.slice((cabinNum - 1) * 4, cabinNum * 4);
                return (
                  <div key={cabinNum} className="seat-modal__train-compartment">
                    <span className="seat-modal__compartment-title">Khoang {cabinNum}</span>
                    <div className="seat-modal__train-berths">
                      {cabinSeats.map((seat) => (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={seat.isOccupied}
                          onClick={() => toggleSeat(seat)}
                          className={`seat-modal__berth-button ${
                            isSelected(seat.id)
                              ? 'seat-modal__berth-button--selected'
                              : seat.isOccupied
                              ? 'seat-modal__berth-button--occupied'
                              : 'seat-modal__berth-button--available'
                          }`}
                        >
                          <span>{seat.number}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bus Sleeper Layout */}
        {ticket.transportType === 'bus' && (
          <div className="seat-modal__bus-cabin">
            <div className="seat-modal__cabin-indicator">
              Tài xế &rarr; Cửa lên xe
            </div>
            <div className="seat-modal__bus-grid">
              {seatLayout
                .filter((s) => s.deck === activeDeck)
                .map((seat) => (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={seat.isOccupied}
                    onClick={() => toggleSeat(seat)}
                    className={`seat-modal__bus-seat ${
                      isSelected(seat.id)
                        ? 'seat-modal__bus-seat--selected'
                        : seat.isOccupied
                        ? 'seat-modal__bus-seat--occupied'
                        : 'seat-modal__bus-seat--available'
                    }`}
                  >
                    <span className="seat-modal__bus-seat-num">{seat.number}</span>
                    <small className="seat-modal__bus-seat-status">
                      {isSelected(seat.id) ? 'Chọn' : seat.isOccupied ? 'Kín' : 'Trống'}
                    </small>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
