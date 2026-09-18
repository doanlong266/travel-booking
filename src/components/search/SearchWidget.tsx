import React, { useState } from 'react';
import { DatePicker, Button, Popover, Switch } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import {
  Plane,
  Train,
  Bus,
  ArrowLeftRight,
  Calendar,
  Users,
  Search,
  Plus,
  Minus,
} from 'lucide-react';
import type { TransportType, ILocationPoint } from '@/types/location';
import type { SeatClassType } from '@/types/ticket';
import { LocationSelect } from './LocationSelect';

dayjs.locale('vi');

const { RangePicker } = DatePicker;

export interface PassengerBreakdown {
  adults: number;
  children: number;
  infants: number;
}

interface SearchWidgetProps {
  transportType: TransportType;
  onTransportTypeChange: (type: TransportType) => void;

  origin: ILocationPoint | null;
  onOriginChange: (point: ILocationPoint) => void;

  destination: ILocationPoint | null;
  onDestinationChange: (point: ILocationPoint) => void;

  departureDate: string;
  onDepartureDateChange: (date: string) => void;

  returnDate: string | null;
  onReturnDateChange: (date: string | null) => void;

  isRoundTrip: boolean;
  onIsRoundTripChange: (isRound: boolean) => void;

  passengerCount: number;
  onPassengerCountChange: (count: number) => void;

  seatClass: SeatClassType | 'all';
  onSeatClassChange: (cls: SeatClassType | 'all') => void;

  onSwap: () => void;
  onSearch: () => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({
  transportType,
  onTransportTypeChange,
  origin,
  onOriginChange,
  destination,
  onDestinationChange,
  departureDate,
  onDepartureDateChange,
  returnDate,
  onReturnDateChange,
  isRoundTrip,
  onIsRoundTripChange,
  onPassengerCountChange,
  seatClass,
  onSeatClassChange,
  onSwap,
  onSearch,
}) => {
  // Detailed passenger breakdown: Adults, Children, Infants
  const [passengers, setPassengers] = useState<PassengerBreakdown>({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const [isPassengerOpen, setIsPassengerOpen] = useState(false);

  // Update breakdown & trigger total countable passengers (Adults + Children)
  const updatePassengerBreakdown = (field: keyof PassengerBreakdown, delta: number) => {
    setPassengers((prev) => {
      const next = { ...prev };
      if (field === 'adults') {
        next.adults = Math.max(1, Math.min(9, prev.adults + delta));
      } else if (field === 'children') {
        next.children = Math.max(0, Math.min(8, prev.children + delta));
      } else if (field === 'infants') {
        next.infants = Math.max(0, Math.min(4, prev.infants + delta));
      }

      const totalCountable = next.adults + next.children;
      onPassengerCountChange(totalCountable);
      return next;
    });
  };

  const totalSeatsRequired = passengers.adults + passengers.children;

  const passengerPopoverContent = (
    <div className="search-widget__passenger-panel">
      <div className="search-widget__passenger-header">
        <strong>Hành khách & Hạng chỗ</strong>
        <span>Chọn số lượng người tham gia chuyến đi</span>
      </div>

      {/* 1. Adults */}
      <div className="search-widget__counter-row">
        <div className="search-widget__counter-info">
          <strong className="search-widget__counter-label">Người lớn</strong>
          <span className="search-widget__counter-desc">Từ 12 tuổi trở lên</span>
        </div>
        <div className="search-widget__counter-actions">
          <button
            type="button"
            disabled={passengers.adults <= 1}
            onClick={() => updatePassengerBreakdown('adults', -1)}
            className="search-widget__counter-btn"
          >
            <Minus size={14} />
          </button>
          <span className="search-widget__counter-num">{passengers.adults}</span>
          <button
            type="button"
            disabled={passengers.adults >= 9}
            onClick={() => updatePassengerBreakdown('adults', 1)}
            className="search-widget__counter-btn"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* 2. Children */}
      <div className="search-widget__counter-row">
        <div className="search-widget__counter-info">
          <strong className="search-widget__counter-label">Trẻ em</strong>
          <span className="search-widget__counter-desc">2 - 11 tuổi (Chiếm 1 ghế)</span>
        </div>
        <div className="search-widget__counter-actions">
          <button
            type="button"
            disabled={passengers.children <= 0}
            onClick={() => updatePassengerBreakdown('children', -1)}
            className="search-widget__counter-btn"
          >
            <Minus size={14} />
          </button>
          <span className="search-widget__counter-num">{passengers.children}</span>
          <button
            type="button"
            disabled={passengers.children >= 8}
            onClick={() => updatePassengerBreakdown('children', 1)}
            className="search-widget__counter-btn"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* 3. Infants */}
      <div className="search-widget__counter-row">
        <div className="search-widget__counter-info">
          <strong className="search-widget__counter-label">Em bé</strong>
          <span className="search-widget__counter-desc">Dưới 2 tuổi (Ngồi cùng người lớn)</span>
        </div>
        <div className="search-widget__counter-actions">
          <button
            type="button"
            disabled={passengers.infants <= 0}
            onClick={() => updatePassengerBreakdown('infants', -1)}
            className="search-widget__counter-btn"
          >
            <Minus size={14} />
          </button>
          <span className="search-widget__counter-num">{passengers.infants}</span>
          <button
            type="button"
            disabled={passengers.infants >= 4}
            onClick={() => updatePassengerBreakdown('infants', 1)}
            className="search-widget__counter-btn"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="search-widget__panel-divider" />

      {/* 4. Seat Class selection */}
      <div className="search-widget__class-section">
        <strong className="search-widget__class-title">Hạng vé ưu tiên</strong>
        <div className="search-widget__class-chips">
          <button
            type="button"
            onClick={() => onSeatClassChange('all')}
            className={`search-widget__class-chip ${seatClass === 'all' ? 'search-widget__class-chip--active' : ''}`}
          >
            Tất cả
          </button>
          {transportType === 'flight' && (
            <>
              <button
                type="button"
                onClick={() => onSeatClassChange('economy')}
                className={`search-widget__class-chip ${seatClass === 'economy' ? 'search-widget__class-chip--active' : ''}`}
              >
                Phổ thông
              </button>
              <button
                type="button"
                onClick={() => onSeatClassChange('business')}
                className={`search-widget__class-chip ${seatClass === 'business' ? 'search-widget__class-chip--active' : ''}`}
              >
                Thương gia
              </button>
            </>
          )}
          {transportType === 'train' && (
            <>
              <button
                type="button"
                onClick={() => onSeatClassChange('soft_seat')}
                className={`search-widget__class-chip ${seatClass === 'soft_seat' ? 'search-widget__class-chip--active' : ''}`}
              >
                Ngồi mềm
              </button>
              <button
                type="button"
                onClick={() => onSeatClassChange('sleeper_4')}
                className={`search-widget__class-chip ${seatClass === 'sleeper_4' ? 'search-widget__class-chip--active' : ''}`}
              >
                Nằm khoang 4
              </button>
            </>
          )}
          {transportType === 'bus' && (
            <>
              <button
                type="button"
                onClick={() => onSeatClassChange('limousine_vip')}
                className={`search-widget__class-chip ${seatClass === 'limousine_vip' ? 'search-widget__class-chip--active' : ''}`}
              >
                Limousine VIP
              </button>
              <button
                type="button"
                onClick={() => onSeatClassChange('cabin_couple')}
                className={`search-widget__class-chip ${seatClass === 'cabin_couple' ? 'search-widget__class-chip--active' : ''}`}
              >
                Cabin Đôi
              </button>
            </>
          )}
        </div>
      </div>

      <Button
        type="primary"
        block
        onClick={() => setIsPassengerOpen(false)}
        className="search-widget__panel-apply-btn"
      >
        Áp dụng ({totalSeatsRequired} hành khách)
      </Button>
    </div>
  );

  return (
    <div className="search-widget">
      {/* 1. Header Tabs & Round-trip Toggle */}
      <div className="search-widget__top-bar">
        <div className="search-widget__tabs">
          <button
            type="button"
            onClick={() => onTransportTypeChange('flight')}
            className={`search-widget__tab ${
              transportType === 'flight' ? 'search-widget__tab--active search-widget__tab--flight' : ''
            }`}
          >
            <Plane size={15} className="search-widget__tab-icon" />
            <span className="search-widget__tab-text">Vé Máy Bay</span>
          </button>

          <button
            type="button"
            onClick={() => onTransportTypeChange('train')}
            className={`search-widget__tab ${
              transportType === 'train' ? 'search-widget__tab--active search-widget__tab--train' : ''
            }`}
          >
            <Train size={15} className="search-widget__tab-icon" />
            <span className="search-widget__tab-text">Vé Tàu Hỏa</span>
          </button>

          <button
            type="button"
            onClick={() => onTransportTypeChange('bus')}
            className={`search-widget__tab ${
              transportType === 'bus' ? 'search-widget__tab--active search-widget__tab--bus' : ''
            }`}
          >
            <Bus size={15} className="search-widget__tab-icon" />
            <span className="search-widget__tab-text">Vé Xe Khách</span>
          </button>
        </div>

        {/* Round-trip switch */}
        <div className="search-widget__roundtrip-toggle">
          <Switch
            checked={isRoundTrip}
            onChange={(checked) => {
              onIsRoundTripChange(checked);
              if (checked && !returnDate) {
                onReturnDateChange(dayjs(departureDate).add(3, 'day').format('YYYY-MM-DD'));
              }
            }}
            size="small"
          />
          <span className="search-widget__toggle-label">Khứ hồi</span>
        </div>
      </div>

      {/* 2. Main Search Row with Overlapping Swap & Unsquished Columns */}
      <div className="search-widget__main-grid">
        {/* Origin & Destination Group with Overlapping Circular Swap Button */}
        <div className="search-widget__locations-cluster">
          {/* Origin */}
          <div className="search-widget__location-wrapper search-widget__location-wrapper--origin">
            <LocationSelect
              transportType={transportType}
              value={origin}
              onChange={onOriginChange}
              label="Điểm đi"
              excludeId={destination?.id}
            />
          </div>

          {/* Overlapping Center Swap Button */}
          <button
            type="button"
            onClick={onSwap}
            className="search-widget__overlap-swap"
            title="Đổi chiều khởi hành - đến"
          >
            <ArrowLeftRight size={13} />
          </button>

          {/* Destination */}
          <div className="search-widget__location-wrapper search-widget__location-wrapper--dest">
            <LocationSelect
              transportType={transportType}
              value={destination}
              onChange={onDestinationChange}
              label="Điểm đến"
              excludeId={origin?.id}
            />
          </div>
        </div>

        {/* Date Container (Unsquished, dedicated minimum width) */}
        <div className="search-widget__date-box">
          <div className="search-widget__date-label">
            <Calendar size={13} className="search-widget__date-label-icon" />
            <span>{isRoundTrip ? 'Ngày đi - Ngày về' : 'Ngày khởi hành'}</span>
          </div>

          {isRoundTrip ? (
            <RangePicker
              value={[
                departureDate ? dayjs(departureDate) : null,
                returnDate ? dayjs(returnDate) : null,
              ]}
              onChange={(dates) => {
                if (dates && dates[0]) {
                  onDepartureDateChange(dates[0].format('YYYY-MM-DD'));
                }
                if (dates && dates[1]) {
                  onReturnDateChange(dates[1].format('YYYY-MM-DD'));
                }
              }}
              format="DD/MM/YYYY"
              className="search-widget__range-picker"
              allowClear={false}
              suffixIcon={null}
            />
          ) : (
            <DatePicker
              value={departureDate ? dayjs(departureDate) : undefined}
              onChange={(_, dateString) => onDepartureDateChange(dateString as string)}
              format="dddd, DD/MM/YYYY"
              className="search-widget__single-date-picker"
              allowClear={false}
              suffixIcon={null}
            />
          )}
        </div>

        {/* Passengers & Class Trigger Box */}
        <Popover
          content={passengerPopoverContent}
          trigger="click"
          open={isPassengerOpen}
          onOpenChange={setIsPassengerOpen}
          placement="bottomRight"
        >
          <div className="search-widget__passengers-trigger">
            <span className="search-widget__passengers-label">Hành khách & Hạng vé</span>
            <div className="search-widget__passengers-main">
              <strong className="search-widget__passengers-count">
                {totalSeatsRequired} khách
              </strong>
              {passengers.infants > 0 && (
                <span className="search-widget__passengers-infant-tag">
                  +{passengers.infants} em bé
                </span>
              )}
            </div>
            <span className="search-widget__passengers-sub">
              {seatClass === 'all'
                ? 'Tất cả hạng vé'
                : seatClass === 'business'
                ? 'Thương gia'
                : seatClass === 'economy'
                ? 'Phổ thông'
                : seatClass === 'sleeper_4'
                ? 'Nằm khoang 4'
                : 'Tiêu chuẩn'}
            </span>
            <Users size={14} className="search-widget__passengers-icon" />
          </div>
        </Popover>

        {/* Search CTA Button */}
        <div className="search-widget__cta-box">
          <Button
            type="primary"
            size="middle"
            icon={<Search size={16} />}
            onClick={onSearch}
            className="search-widget__submit-btn"
          >
            Tìm vé ngay
          </Button>
        </div>
      </div>
    </div>
  );
};
