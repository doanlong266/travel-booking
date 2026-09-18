import React from 'react';
import { Modal, Badge, message } from 'antd';
import {
  Ticket,
  UserCheck,
  Shield,
  Camera,
  Award,
  LogOut,
  Sparkles,
  Gift,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { IUserBooking, DashboardTab } from '@/types/auth.types';
import { TabBookings } from './TabBookings';
import { TabProfile } from './TabProfile';
import { TabSecurity } from './TabSecurity';
import { TabRewards } from './TabRewards';
import { SmoothTabContent, useTabDirection } from '@/components/common/SmoothTabs';
import { getMembershipTierInfo } from '@/types/auth.types';

const DASHBOARD_TABS: DashboardTab[] = ['bookings', 'rewards', 'profile', 'security'];

export const UserDashboard: React.FC = () => {
  const {
    user,
    isDashboardOpen,
    closeDashboard,
    dashboardActiveTab,
    openDashboard,
    userBookings,
    logout,
  } = useAuth();

  const { direction: dashboardDirection } = useTabDirection(dashboardActiveTab, DASHBOARD_TABS);

  if (!user) return null;

  const tierInfo = getMembershipTierInfo(user.membershipTier);
  const upcomingCount = userBookings.filter((b: IUserBooking) => b.status === 'upcoming').length;

  // Simulate Avatar upload
  const handleUploadAvatar = () => {
    message.success('Đã tải lên ảnh đại diện mới thành công!');
  };

  return (
    <Modal
      open={isDashboardOpen}
      onCancel={closeDashboard}
      footer={null}
      width={1160}
      style={{ maxWidth: '95vw', top: 20 }}
      centered
      className="user-dashboard-modal"
      destroyOnClose
    >
      <div className="user-dashboard">
        {/* Left Sidebar */}
        <aside className="user-dashboard__sidebar">
          {/* User Profile Card */}
          <div className="user-dashboard__profile-box">
            <div className="user-dashboard__avatar-wrap">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="user-dashboard__avatar-img" />
              ) : (
                <div className="user-dashboard__avatar-fallback">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                className="user-dashboard__camera-btn"
                onClick={handleUploadAvatar}
                title="Thay ảnh đại diện"
              >
                <Camera size={14} />
              </button>
            </div>

            <h3 className="user-dashboard__name">{user.name}</h3>
            <span className="user-dashboard__email">{user.email}</span>
            <span className="user-dashboard__phone">{user.phone}</span>
          </div>

          {/* Membership & Loyalty Card (De-cluttered when on rewards tab) */}
          {dashboardActiveTab !== 'rewards' ? (
            <div
              className="user-dashboard__membership-card"
              style={{ background: tierInfo.bg }}
            >
              <div className="user-dashboard__membership-top">
                <span className="user-dashboard__membership-tier">
                  <Award size={14} /> {tierInfo.label}
                </span>
                <Sparkles size={16} className="user-dashboard__sparkle-icon" />
              </div>

              <div className="user-dashboard__points-row">
                <strong className="user-dashboard__points-val">
                  {user.rewardPoints.toLocaleString('vi-VN')}
                </strong>
                <span className="user-dashboard__points-unit">Điểm OMNI</span>
              </div>

              <div className="user-dashboard__tier-progress">
                <div className="user-dashboard__progress-bar">
                  <div className="user-dashboard__progress-fill" style={{ width: '65%' }}></div>
                </div>
                <span className="user-dashboard__tier-hint">
                  Cần thêm {tierInfo.needed} điểm để nâng cấp {tierInfo.nextTier}
                </span>
              </div>
            </div>
          ) : (
            <div
              className="user-dashboard__membership-chip"
              style={{ background: tierInfo.bg }}
            >
              <Award size={14} />
              <span>{tierInfo.label}</span>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="user-dashboard__nav">
            <button
              type="button"
              className={`user-dashboard__nav-btn ${
                dashboardActiveTab === 'bookings' ? 'user-dashboard__nav-btn--active' : ''
              }`}
              onClick={() => openDashboard('bookings')}
            >
              <div className="user-dashboard__nav-label">
                <Ticket size={17} />
                <span>Vé của tôi</span>
              </div>
              {upcomingCount > 0 && (
                <Badge count={upcomingCount} style={{ backgroundColor: '#2563eb' }} />
              )}
            </button>

            <button
              type="button"
              className={`user-dashboard__nav-btn ${
                dashboardActiveTab === 'rewards' ? 'user-dashboard__nav-btn--active' : ''
              }`}
              onClick={() => openDashboard('rewards')}
            >
              <div className="user-dashboard__nav-label">
                <Gift size={17} />
                <span>Đổi quà & Ưu đãi</span>
              </div>
            </button>

            <button
              type="button"
              className={`user-dashboard__nav-btn ${
                dashboardActiveTab === 'profile' ? 'user-dashboard__nav-btn--active' : ''
              }`}
              onClick={() => openDashboard('profile')}
            >
              <div className="user-dashboard__nav-label">
                <UserCheck size={17} />
                <span>Hồ sơ & Danh bạ</span>
              </div>
            </button>

            <button
              type="button"
              className={`user-dashboard__nav-btn ${
                dashboardActiveTab === 'security' ? 'user-dashboard__nav-btn--active' : ''
              }`}
              onClick={() => openDashboard('security')}
            >
              <div className="user-dashboard__nav-label">
                <Shield size={17} />
                <span>Đổi mật khẩu & Bảo mật</span>
              </div>
            </button>
          </nav>

          {/* Bottom Logout */}
          <div className="user-dashboard__sidebar-bottom">
            <button
              type="button"
              className="user-dashboard__logout-btn"
              onClick={logout}
            >
              <LogOut size={16} />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        </aside>

        {/* Right Content View */}
        <main
          className={`user-dashboard__content ${
            dashboardActiveTab === 'rewards' ? 'user-dashboard__content--rewards' : ''
          }`}
        >

          {dashboardActiveTab !== 'rewards' && (
            <div className="user-dashboard__content-header">
              <h2 className="user-dashboard__content-title">
                {dashboardActiveTab === 'bookings' && 'Quản Lý Vé & Hành Trình Đã Đặt'}
                {dashboardActiveTab === 'profile' && 'Thông Tin Cá Nhân & Danh Bạ Hành Khách'}
                {dashboardActiveTab === 'security' && 'Bảo Mật Tài Khoản & Mật Khẩu'}
              </h2>
              <span className="user-dashboard__content-subtitle">
                {dashboardActiveTab === 'bookings' &&
                  'Theo dõi chi tiết lịch khởi hành, thẻ lên xe/máy bay QR và yêu cầu hoàn vé trực tuyến'}
                {dashboardActiveTab === 'profile' &&
                  'Quản lý dữ liệu định danh CCCD và lưu sẵn danh bạ người thân để tự động điền khi đặt vé'}
                {dashboardActiveTab === 'security' &&
                  'Bảo vệ tài khoản và giám sát các phiên đăng nhập theo tiêu chuẩn bảo mật'}
              </span>
            </div>
          )}

          <SmoothTabContent
            activeKey={dashboardActiveTab}
            direction={dashboardDirection}
            className="user-dashboard__content-body"
            enableSmoothHeight={false}
          >
            {dashboardActiveTab === 'bookings' && <TabBookings />}
            {dashboardActiveTab === 'rewards' && <TabRewards />}
            {dashboardActiveTab === 'profile' && <TabProfile />}
            {dashboardActiveTab === 'security' && <TabSecurity />}
          </SmoothTabContent>
        </main>
      </div>
    </Modal>
  );
};
