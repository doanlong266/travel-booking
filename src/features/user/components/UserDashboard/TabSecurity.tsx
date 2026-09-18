import React, { useState } from 'react';
import { Input, message } from 'antd';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Laptop,
  CheckCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { calculatePasswordStrength } from '@/services/auth/authService';

export const TabSecurity: React.FC = () => {
  const { changePassword, user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = calculatePasswordStrength(newPassword);

  const handleResetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleChangePassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentPassword) {
      message.warning('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    if (newPassword.length < 6) {
      message.warning('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      message.warning('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const success = await changePassword(currentPassword, newPassword);
      if (success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-security">
      {/* 1. Change Password Form */}
      <div className="security-card">
        <div className="security-card__header">
          <div className="security-card__icon-box">
            <Lock size={18} />
          </div>
          <div>
            <h4 className="security-card__title">Đổi Mật Khẩu Đăng Nhập</h4>
            <span className="security-card__desc">
              Khuyến khích sử dụng mật khẩu mạnh kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
            </span>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="security-card__form">
          <div className="security-card__field">
            <label className="security-card__label">Mật khẩu hiện tại</label>
            <Input
              type={showCurrent ? 'text' : 'password'}
              prefix={<Lock size={15} className="security-card__input-icon" />}
              suffix={
                <button
                  type="button"
                  className="security-card__eye-btn"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu đang dùng..."
              size="middle"
            />
          </div>

          <div className="security-card__field">
            <label className="security-card__label">Mật khẩu mới</label>
            <Input
              type={showNew ? 'text' : 'password'}
              prefix={<Lock size={15} className="security-card__input-icon" />}
              suffix={
                <button
                  type="button"
                  className="security-card__eye-btn"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự..."
              size="middle"
            />

            {newPassword && (
              <div className="security-card__strength">
                <div className="security-card__strength-bars">
                  <span
                    className={`security-card__strength-bar ${
                      strength === 'weak' || strength === 'medium' || strength === 'strong'
                        ? 'security-card__strength-bar--weak'
                        : ''
                    }`}
                  ></span>
                  <span
                    className={`security-card__strength-bar ${
                      strength === 'medium' || strength === 'strong'
                        ? 'security-card__strength-bar--medium'
                        : ''
                    }`}
                  ></span>
                  <span
                    className={`security-card__strength-bar ${
                      strength === 'strong' ? 'security-card__strength-bar--strong' : ''
                    }`}
                  ></span>
                </div>
                <span className="security-card__strength-label">
                  Mức độ: {strength === 'weak' && 'Yếu'}
                  {strength === 'medium' && 'Trung bình'}
                  {strength === 'strong' && 'Mạnh (Tốt)'}
                </span>
              </div>
            )}
          </div>

          <div className="security-card__field">
            <label className="security-card__label">Xác nhận mật khẩu mới</label>
            <Input
              type={showConfirm ? 'text' : 'password'}
              prefix={<Lock size={15} className="security-card__input-icon" />}
              suffix={
                <button
                  type="button"
                  className="security-card__eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới..."
              size="middle"
            />
          </div>

          <div className="security-card__footer form-actions">
            <button
              type="button"
              className="form-actions__btn form-actions__btn--secondary"
              onClick={handleResetForm}
              disabled={loading}
              title="Xóa thông tin đã nhập"
            >
              <RotateCcw size={15} />
              <span>Đặt lại</span>
            </button>
            <button
              type="submit"
              className="form-actions__btn form-actions__btn--primary"
              disabled={loading}
            >
              <CheckCircle size={15} />
              <span>{loading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Security Sessions & Privacy Badges */}
      <div className="security-card">
        <div className="security-card__header">
          <div className="security-card__icon-box security-card__icon-box--green">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="security-card__title">Thiết Bị Đăng Nhập & Bảo Mật Dữ Liệu</h4>
            <span className="security-card__desc">
              Giám sát phiên làm việc tuân thủ Nghị định 13/2023/NĐ-CP
            </span>
          </div>
        </div>

        <div className="security-session-item">
          <div className="security-session-item__icon">
            <Laptop size={20} />
          </div>
          <div className="security-session-item__info">
            <div className="security-session-item__title-row">
              <strong>Máy tính để bàn (Windows • Chrome)</strong>
              <span className="security-session-item__active-pill">Phiên hiện tại</span>
            </div>
            <span className="security-session-item__meta">
              Địa chỉ IP: 192.168.1.54 • Lần hoạt động cuối: Vừa xong
            </span>
          </div>
        </div>

        <div className="security-notice-box">
          <AlertCircle size={16} className="security-notice-box__icon" />
          <p>
            Mọi thông tin cá nhân và dữ liệu vé của tài khoản <strong>{user?.email}</strong> được
            mã hóa bởi giao thức an ninh SSL/TLS 256-bit chuẩn ngân hàng và lưu trữ độc lập trên
            hạ tầng máy chủ tại Việt Nam.
          </p>
        </div>
      </div>
    </div>
  );
};
