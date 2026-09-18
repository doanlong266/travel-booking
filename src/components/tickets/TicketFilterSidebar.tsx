import React from 'react';
import { Slider, Checkbox, Button } from 'antd';
import { Filter, RotateCcw, Sun, Sunset, Moon, Sunrise } from 'lucide-react';
import type { TransportType } from '@/types/location';
import { CarrierLogo } from '@/components/common/CarrierLogo';

interface TicketFilterSidebarProps {
  transportType: TransportType;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  priceBounds: [number, number];

  availableCarriers: { id: string; name: string }[];
  selectedCarriers: string[];
  onSelectedCarriersChange: (carriers: string[]) => void;

  selectedTimeSlots: ('morning' | 'afternoon' | 'evening' | 'night')[];
  onSelectedTimeSlotsChange: (slots: ('morning' | 'afternoon' | 'evening' | 'night')[]) => void;

  onReset: () => void;
}

export const TicketFilterSidebar: React.FC<TicketFilterSidebarProps> = ({
  transportType,
  priceRange,
  onPriceRangeChange,
  priceBounds,
  availableCarriers,
  selectedCarriers,
  onSelectedCarriersChange,
  selectedTimeSlots,
  onSelectedTimeSlotsChange,
  onReset,
}) => {
  const toggleTimeSlot = (slot: 'morning' | 'afternoon' | 'evening' | 'night') => {
    if (selectedTimeSlots.includes(slot)) {
      onSelectedTimeSlotsChange(selectedTimeSlots.filter((s) => s !== slot));
    } else {
      onSelectedTimeSlotsChange([...selectedTimeSlots, slot]);
    }
  };

  const toggleCarrier = (id: string) => {
    if (selectedCarriers.includes(id)) {
      onSelectedCarriersChange(selectedCarriers.filter((c) => c !== id));
    } else {
      onSelectedCarriersChange([...selectedCarriers, id]);
    }
  };

  const minVal = Math.min(priceBounds[0], priceRange[0]);
  const maxVal = Math.max(priceBounds[1], priceRange[1]);

  return (
    <div className="ticket-filter">
      <div className="ticket-filter__header">
        <div className="ticket-filter__title-wrap">
          <Filter size={18} className="ticket-filter__title-icon" />
          <h3 className="ticket-filter__title">Bộ lọc tìm kiếm</h3>
        </div>
        <Button
          type="text"
          size="small"
          icon={<RotateCcw size={13} />}
          onClick={onReset}
          className="ticket-filter__reset-btn"
        >
          Đặt lại
        </Button>
      </div>

      {/* 1. Price Range Section */}
      <div className="ticket-filter__section">
        <label className="ticket-filter__section-title">Khoảng giá vé (VNĐ)</label>
        <div className="ticket-filter__price-labels">
          <span>{priceRange[0].toLocaleString('vi-VN')} đ</span>
          <span>{priceRange[1].toLocaleString('vi-VN')} đ</span>
        </div>
        <Slider
          range
          min={minVal}
          max={maxVal}
          step={50000}
          value={priceRange}
          onChange={(val) => onPriceRangeChange(val as [number, number])}
          className="ticket-filter__price-slider"
        />
      </div>

      <div className="ticket-filter__divider" />

      {/* 2. Departure Time Slots */}
      <div className="ticket-filter__section">
        <label className="ticket-filter__section-title">Giờ khởi hành</label>
        <div className="ticket-filter__time-grid">
          <button
            type="button"
            onClick={() => toggleTimeSlot('morning')}
            className={`ticket-filter__time-chip ${
              selectedTimeSlots.includes('morning') ? 'ticket-filter__time-chip--active' : ''
            }`}
          >
            <Sunrise size={16} className="ticket-filter__time-icon" />
            <span className="ticket-filter__time-name">Sáng sớm</span>
            <span className="ticket-filter__time-hours">05:00 - 12:00</span>
          </button>

          <button
            type="button"
            onClick={() => toggleTimeSlot('afternoon')}
            className={`ticket-filter__time-chip ${
              selectedTimeSlots.includes('afternoon') ? 'ticket-filter__time-chip--active' : ''
            }`}
          >
            <Sun size={16} className="ticket-filter__time-icon" />
            <span className="ticket-filter__time-name">Buổi chiều</span>
            <span className="ticket-filter__time-hours">12:00 - 18:00</span>
          </button>

          <button
            type="button"
            onClick={() => toggleTimeSlot('evening')}
            className={`ticket-filter__time-chip ${
              selectedTimeSlots.includes('evening') ? 'ticket-filter__time-chip--active' : ''
            }`}
          >
            <Sunset size={16} className="ticket-filter__time-icon" />
            <span className="ticket-filter__time-name">Buổi tối</span>
            <span className="ticket-filter__time-hours">18:00 - 22:00</span>
          </button>

          <button
            type="button"
            onClick={() => toggleTimeSlot('night')}
            className={`ticket-filter__time-chip ${
              selectedTimeSlots.includes('night') ? 'ticket-filter__time-chip--active' : ''
            }`}
          >
            <Moon size={16} className="ticket-filter__time-icon" />
            <span className="ticket-filter__time-name">Đêm muộn</span>
            <span className="ticket-filter__time-hours">22:00 - 05:00</span>
          </button>
        </div>
      </div>

      <div className="ticket-filter__divider" />

      {/* 3. Carriers / Operators Filter */}
      <div className="ticket-filter__section">
        <label className="ticket-filter__section-title">
          {transportType === 'flight'
            ? 'Hãng hàng không'
            : transportType === 'train'
            ? 'Đơn vị đường sắt'
            : 'Nhà xe vận hành'}
        </label>
        <div className="ticket-filter__carriers-list">
          {availableCarriers.map((carrier) => (
            <label key={carrier.id} className="ticket-filter__carrier-item">
              <Checkbox
                checked={selectedCarriers.includes(carrier.id)}
                onChange={() => toggleCarrier(carrier.id)}
              />
              <CarrierLogo carrier={carrier.id} name={carrier.name} size={24} variant="badge" />
              <span className="ticket-filter__carrier-name">{carrier.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
