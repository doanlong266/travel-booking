import {
  Compass,
  Plane,
  Train,
  Bus,
  PhoneCall,
  Globe,
  Search,
} from 'lucide-react';
import type { TransportType } from '@/types/location';
import { UserHeaderMenu } from '@/features/user/components/UserHeaderMenu/UserHeaderMenu';

interface AppHeaderProps {
  activeTransportType: TransportType;
  onSelectTransportType: (type: TransportType) => void;
  onOpenGuestLookup?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeTransportType,
  onSelectTransportType,
  onOpenGuestLookup,
}) => {
  return (
    <header className="app-header">
      <div className="app-header__container">
        {/* Brand Identity */}
        <div className="app-header__brand">
          <div className="app-header__logo-badge">
            <Compass size={22} className="app-header__logo-icon" />
          </div>
          <div className="app-header__brand-text">
            <span className="app-header__brand-title">OMNITRAVEL</span>
            <span className="app-header__brand-tagline">Đặt vé Đa Phương Tiện Toàn Quốc</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="app-header__nav">
          <button
            type="button"
            onClick={() => onSelectTransportType('flight')}
            className={`app-header__nav-link ${
              activeTransportType === 'flight' ? 'app-header__nav-link--active' : ''
            }`}
          >
            <Plane size={16} className="app-header__link-icon" />
            <span>Vé Máy Bay</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTransportType('train')}
            className={`app-header__nav-link ${
              activeTransportType === 'train' ? 'app-header__nav-link--active' : ''
            }`}
          >
            <Train size={16} className="app-header__link-icon" />
            <span>Vé Tàu Hỏa</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTransportType('bus')}
            className={`app-header__nav-link ${
              activeTransportType === 'bus' ? 'app-header__nav-link--active' : ''
            }`}
          >
            <Bus size={16} className="app-header__link-icon" />
            <span>Vé Xe Khách</span>
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="app-header__actions">
          <div className="app-header__hotline">
            <PhoneCall size={14} className="app-header__hotline-icon" />
            <span className="app-header__hotline-num">1900 6868</span>
          </div>

          <div className="app-header__locale-badge">
            <Globe size={14} className="app-header__globe-icon" />
            <span>VND / VI</span>
          </div>

          {/* Tra cứu vé button */}
          <button
            type="button"
            className="app-header__lookup-btn"
            onClick={onOpenGuestLookup}
            title="Tra cứu vé điện tử & Khôi phục đơn đặt chỗ"
          >
            <Search size={14} />
            <span>Tra cứu vé</span>
          </button>

          {/* User Profile / Auth Action */}
          <UserHeaderMenu />
        </div>
      </div>
    </header>
  );
};
