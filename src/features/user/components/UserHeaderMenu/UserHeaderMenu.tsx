import React from 'react';
import { Dropdown, Badge } from 'antd';
import type { MenuProps } from 'antd';
import {
  User,
  Ticket,
  UserCheck,
  Gift,
  Settings,
  LogOut,
  ChevronDown,
  Award,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { IUserBooking } from '@/types/auth.types';
import { getMembershipTierInfo } from '@/types/auth.types';

export const UserHeaderMenu: React.FC = () => {
  const {
    user,
    isAuthenticated,
    openAuthModal,
    openDashboard,
    logout,
    userBookings,
  } = useAuth();

  // If not authenticated, show modern Login / Register trigger button
  if (!isAuthenticated || !user) {
    return (
      <div className="user-header-menu__guest">
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="user-header-menu__login-btn"
        >
          <div className="user-header-menu__login-icon-box">
            <User size={15} />
          </div>
          <span className="user-header-menu__login-text">Đăng nhập / Đăng ký</span>
        </button>
      </div>
    );
  }

  // Count active upcoming trips
  const activeTripsCount = userBookings.filter((b: IUserBooking) => b.status === 'upcoming').length;
  const tierConfig = getMembershipTierInfo(user.membershipTier);

  // Dropdown Menu Items
  const menuItems: MenuProps['items'] = [
    {
      key: 'header_info',
      disabled: true,
      label: (
        <div className="user-header-menu__dropdown-header">
          <div className="user-header-menu__user-avatar-lg">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="user-header-menu__user-details">
            <span className="user-header-menu__name-lg">{user.name}</span>
            <span className="user-header-menu__email-sm">{user.email}</span>
            <div className="user-header-menu__tier-chip" style={{ backgroundColor: tierConfig.chipBg, color: tierConfig.color }}>
              <Award size={12} />
              <span>{tierConfig.label} • {user.rewardPoints} điểm</span>
            </div>
          </div>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'my_bookings',
      icon: <Ticket size={16} className="user-header-menu__item-icon" />,
      label: (
        <div className="user-header-menu__item-row">
          <span>Chuyến đi của tôi</span>
          {activeTripsCount > 0 && (
            <Badge count={activeTripsCount} style={{ backgroundColor: '#2563eb' }} />
          )}
        </div>
      ),
      onClick: () => openDashboard('bookings'),
    },
    {
      key: 'my_profile',
      icon: <UserCheck size={16} className="user-header-menu__item-icon" />,
      label: <span>Hồ sơ cá nhân & Danh bạ</span>,
      onClick: () => openDashboard('profile'),
    },
    {
      key: 'loyalty_points',
      icon: <Gift size={16} className="user-header-menu__item-icon" />,
      label: (
        <div className="user-header-menu__item-row">
          <span>Điểm thưởng & Đổi quà</span>
          <span className="user-header-menu__points-pill">{user.rewardPoints} pts</span>
        </div>
      ),
      onClick: () => openDashboard('rewards'),
    },
    {
      key: 'account_settings',
      icon: <Settings size={16} className="user-header-menu__item-icon" />,
      label: <span>Cài đặt & Đổi mật khẩu</span>,
      onClick: () => openDashboard('security'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      danger: true,
      icon: <LogOut size={16} className="user-header-menu__item-icon" />,
      label: <span>Đăng xuất</span>,
      onClick: logout,
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click', 'hover']}
      placement="bottomRight"
      overlayClassName="user-header-menu__dropdown"
    >
      <button type="button" className="user-header-menu__profile-trigger">
        <div className="user-header-menu__avatar-box">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="user-header-menu__avatar-img" />
          ) : (
            <div className="user-header-menu__avatar-fallback">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="user-header-menu__info-col">
          <span className="user-header-menu__username">{user.name}</span>
          <div className="user-header-menu__badge-row">
            <span
              className="user-header-menu__tier-badge"
              style={{ backgroundColor: tierConfig.chipBg, color: tierConfig.color }}
            >
              {tierConfig.label}
            </span>
          </div>
        </div>

        <ChevronDown size={14} className="user-header-menu__chevron" />
      </button>
    </Dropdown>
  );
};
