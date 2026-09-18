import React, { useState, useMemo } from 'react';
import { Popover, Input } from 'antd';
import { MapPin, Search, Plane, Train, Bus, Check } from 'lucide-react';
import type { ILocationPoint, TransportType } from '@/types/location';
import { getLocationsByType } from '@/services/ticket/mockLocations';

interface LocationSelectProps {
  transportType: TransportType;
  value: ILocationPoint | null;
  onChange: (location: ILocationPoint) => void;
  label: string;
  excludeId?: string;
}

/**
 * 2-Line Location Selector (Traveloka / Agoda / Trip.com standard)
 * Line 1 (Bold): Province / City name
 * Line 2 (Subtle): Airport/Station code and full name
 */
export const LocationSelect: React.FC<LocationSelectProps> = ({
  transportType,
  value,
  onChange,
  label,
  excludeId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allLocations = useMemo(() => {
    return getLocationsByType(transportType).filter((loc) => loc.id !== excludeId);
  }, [transportType, excludeId]);

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return allLocations;
    const q = searchQuery.toLowerCase();
    return allLocations.filter(
      (loc) =>
        loc.city.toLowerCase().includes(q) ||
        loc.name.toLowerCase().includes(q) ||
        loc.code.toLowerCase().includes(q)
    );
  }, [allLocations, searchQuery]);

  const getTransportIcon = () => {
    switch (transportType) {
      case 'flight':
        return <Plane size={15} className="location-select__type-icon location-select__type-icon--flight" />;
      case 'train':
        return <Train size={15} className="location-select__type-icon location-select__type-icon--train" />;
      case 'bus':
        return <Bus size={15} className="location-select__type-icon location-select__type-icon--bus" />;
    }
  };

  const handleSelectLocation = (loc: ILocationPoint) => {
    onChange(loc);
    setIsOpen(false);
    setSearchQuery('');
  };

  const popoverContent = (
    <div className="location-select__dropdown">
      {/* Search Filter Input */}
      <div className="location-select__search-box">
        <Input
          prefix={<Search size={15} className="location-select__search-icon" />}
          placeholder="Tìm theo thành phố, tên ga hoặc mã..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          autoFocus
          className="location-select__search-input"
        />
      </div>

      {/* Locations List */}
      <div className="location-select__list">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((loc) => {
            const isSelected = value?.id === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelectLocation(loc)}
                className={`location-select__item ${
                  isSelected ? 'location-select__item--selected' : ''
                }`}
              >
                <div className="location-select__item-icon-box">
                  {getTransportIcon()}
                </div>
                <div className="location-select__item-content">
                  <div className="location-select__item-top">
                    <strong className="location-select__item-city">{loc.city}</strong>
                    <span className="location-select__item-code">{loc.code}</span>
                  </div>
                  <span className="location-select__item-name">{loc.name}</span>
                </div>
                {isSelected && (
                  <Check size={16} className="location-select__item-check" />
                )}
              </button>
            );
          })
        ) : (
          <div className="location-select__empty">
            <span>Không tìm thấy địa điểm phù hợp</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={isOpen}
      onOpenChange={setIsOpen}
      placement="bottomLeft"
      overlayClassName="location-select__popover"
    >
      <div
        className={`location-select ${isOpen ? 'location-select--active' : ''}`}
        role="button"
        tabIndex={0}
      >
        <span className="location-select__label">{label}</span>

        {value ? (
          <div className="location-select__display">
            {/* Line 1: Bold City Name */}
            <span className="location-select__city">{value.city}</span>
            {/* Line 2: Subtle Code and Terminal Name */}
            <span className="location-select__sub-text" title={`${value.code} - ${value.name}`}>
              <strong>{value.code}</strong> - {value.name}
            </span>
          </div>
        ) : (
          <div className="location-select__display location-select__display--placeholder">
            <span className="location-select__placeholder-text">Chọn {label.toLowerCase()}</span>
          </div>
        )}

        <MapPin size={14} className="location-select__pin-icon" />
      </div>
    </Popover>
  );
};
