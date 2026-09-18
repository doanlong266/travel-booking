import React, { useState, useEffect } from 'react';
import { Modal, Drawer, Tabs, Input, Button, Checkbox, message } from 'antd';
import {
  Mail,
  Lock,
  Phone,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Clock,
  Maximize2,
  Sidebar,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { calculatePasswordStrength } from '@/services/auth/authService';
import { SocialButtons } from '@/features/auth/components/SocialButtons';
import type { PasswordStrength } from '@/types/auth.types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  onOpenTerms?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  onOpenTerms,
}) => {
  const { login, loginWithOtp, sendOtp, loginWithSocial, register } = useAuth();

  // Mode: Modal vs Drawer
  const [viewType, setViewType] = useState<'modal' | 'drawer'>('modal');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);

  // Sub-tab in Login: 'password' | 'otp'
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Loading state
  const [loading, setLoading] = useState(false);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('0912345678');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP States
  const [otpPhone, setOtpPhone] = useState('0912345678');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Sync defaultTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  // Password strength calculation
  const passStrength: PasswordStrength = calculatePasswordStrength(regPassword);

  // Handle Login with Password
  const handlePasswordLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginIdentifier.trim()) {
      message.warning('Vui lòng nhập Email hoặc Số điện thoại');
      return;
    }
    if (!loginPassword) {
      message.warning('Vui lòng nhập mật khẩu');
      return;
    }
    setLoading(true);
    try {
      await login({
        emailOrPhone: loginIdentifier,
        password: loginPassword,
        rememberMe,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Send OTP
  const handleSendOtp = async () => {
    const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!vnPhoneRegex.test(otpPhone.replace(/\s+/g, ''))) {
      message.warning('Vui lòng nhập số điện thoại Việt Nam hợp lệ (10 chữ số)');
      return;
    }
    setLoading(true);
    try {
      await sendOtp(otpPhone);
      setOtpSent(true);
      setCountdown(60);
      setOtpCode('686868'); // Auto-fill demo OTP for user convenience
    } finally {
      setLoading(false);
    }
  };

  // Handle Login with OTP
  const handleOtpLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpSent) {
      message.warning('Vui lòng bấm Nhận mã OTP trước');
      return;
    }
    if (otpCode.length < 6) {
      message.warning('Vui lòng nhập đủ 6 chữ số mã OTP');
      return;
    }
    setLoading(true);
    try {
      await loginWithOtp(otpPhone, otpCode);
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!regName.trim()) {
      message.warning('Vui lòng nhập họ và tên');
      return;
    }
    const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!vnPhoneRegex.test(regPhone.replace(/\s+/g, ''))) {
      message.warning('Số điện thoại không đúng định dạng Việt Nam (10 số)');
      return;
    }
    if (!regEmail.includes('@')) {
      message.warning('Email không hợp lệ');
      return;
    }
    if (regPassword.length < 6) {
      message.warning('Mật khẩu cần tối thiểu 6 ký tự');
      return;
    }
    if (!agreeTerms) {
      message.warning('Quý khách vui lòng đồng ý với Điều khoản dịch vụ');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: regName,
        phone: regPhone,
        email: regEmail,
        password: regPassword,
        agreeTerms,
      });
    } finally {
      setLoading(false);
    }
  };

  // Content JSX for both Modal and Drawer
  const authContent = (
    <div className="auth-modal__body-wrap">
      {/* Top Controls: Switch Modal / Drawer Mode */}
      <div className="auth-modal__view-toggle">
        <button
          type="button"
          onClick={() => setViewType(viewType === 'modal' ? 'drawer' : 'modal')}
          className="auth-modal__view-toggle-btn"
          title={viewType === 'modal' ? 'Chuyển sang dạng thanh trượt Drawer' : 'Chuyển sang dạng Modal'}
        >
          {viewType === 'modal' ? (
            <>
              <Sidebar size={14} /> <span>Trượt từ phải (Drawer)</span>
            </>
          ) : (
            <>
              <Maximize2 size={14} /> <span>Hộp thoại (Modal)</span>
            </>
          )}
        </button>
      </div>

      {/* Brand Header */}
      <div className="auth-modal__header">
        <div className="auth-modal__badge">
          <Sparkles size={14} />
          <span>Hệ Sinh Thái OMNITRAVEL</span>
        </div>
        <h2 className="auth-modal__title">
          {activeTab === 'login' ? 'Chào Mừng Trở Lại' : 'Tạo Tài Khoản Mới'}
        </h2>
        <p className="auth-modal__subtitle">
          {activeTab === 'login'
            ? 'Đăng nhập để quản lý vé, nhận ưu đãi và tích lũy điểm thưởng'
            : 'Đăng ký ngay nhận ngay 100 điểm thưởng và đặt vé nhanh chóng 1 chạm'}
        </p>
      </div>

      {/* Main Tabs: Login / Register */}
      <Tabs
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as 'login' | 'register')}
        centered
        className="auth-modal__tabs"
        items={[
          {
            key: 'login',
            label: <span className="auth-modal__tab-label">Đăng Nhập</span>,
            children: (
              <div className="auth-modal__form-container">
                {/* Sub-tabs: Password vs OTP */}
                <div className="auth-modal__method-switcher">
                  <button
                    type="button"
                    className={`auth-modal__method-btn ${
                      loginMethod === 'password' ? 'auth-modal__method-btn--active' : ''
                    }`}
                    onClick={() => setLoginMethod('password')}
                  >
                    <Lock size={14} />
                    <span>Mật khẩu</span>
                  </button>
                  <button
                    type="button"
                    className={`auth-modal__method-btn ${
                      loginMethod === 'otp' ? 'auth-modal__method-btn--active' : ''
                    }`}
                    onClick={() => setLoginMethod('otp')}
                  >
                    <Phone size={14} />
                    <span>Mã OTP</span>
                  </button>
                </div>

                {loginMethod === 'password' ? (
                  /* Form: Password Login */
                  <form onSubmit={handlePasswordLogin} className="auth-modal__form">
                    <div className="auth-modal__input-field">
                      <label className="auth-modal__label">Email hoặc Số điện thoại</label>
                      <Input
                        prefix={<Mail size={16} className="auth-modal__input-icon" />}
                        placeholder="nam.nguyen@omnitravel.vn hoặc 0912345678"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="auth-modal__input"
                        size="large"
                      />
                    </div>

                    <div className="auth-modal__input-field">
                      <div className="auth-modal__label-row">
                        <label className="auth-modal__label">Mật khẩu</label>
                        <button
                          type="button"
                          className="auth-modal__forgot-link"
                          onClick={() => message.info('Mật khẩu mẫu thử nghiệm là: 123456')}
                        >
                          Quên mật khẩu?
                        </button>
                      </div>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        prefix={<Lock size={16} className="auth-modal__input-icon" />}
                        suffix={
                          <button
                            type="button"
                            className="auth-modal__eye-btn"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        }
                        placeholder="Nhập mật khẩu..."
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="auth-modal__input"
                        size="large"
                      />
                    </div>

                    <div className="auth-modal__checkbox-row">
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      >
                        <span className="auth-modal__checkbox-text">Ghi nhớ đăng nhập</span>
                      </Checkbox>
                      <span className="auth-modal__demo-hint">Tài khoản demo: 0912345678 / 123456</span>
                    </div>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      className="auth-modal__submit-btn"
                      icon={<ArrowRight size={16} />}
                    >
                      Đăng Nhập Ngay
                    </Button>
                  </form>
                ) : (
                  /* Form: OTP Login */
                  <form onSubmit={handleOtpLogin} className="auth-modal__form">
                    <div className="auth-modal__input-field">
                      <label className="auth-modal__label">Số điện thoại đăng ký (10 số)</label>
                      <div className="auth-modal__otp-send-row">
                        <Input
                          prefix={<Phone size={16} className="auth-modal__input-icon" />}
                          placeholder="0912 345 678"
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value)}
                          className="auth-modal__input"
                          size="large"
                        />
                        <Button
                          type="default"
                          size="large"
                          onClick={handleSendOtp}
                          disabled={countdown > 0 || loading}
                          className="auth-modal__send-otp-btn"
                        >
                          {countdown > 0 ? (
                            <span className="auth-modal__countdown">
                              <Clock size={13} /> {countdown}s
                            </span>
                          ) : otpSent ? (
                            'Gửi lại'
                          ) : (
                            'Nhận mã OTP'
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="auth-modal__input-field">
                      <label className="auth-modal__label">Mã OTP 6 số</label>
                      <Input
                        prefix={<ShieldCheck size={16} className="auth-modal__input-icon" />}
                        placeholder="Nhập 6 số OTP (Demo: 686868)"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength={6}
                        className="auth-modal__input auth-modal__input--otp"
                        size="large"
                      />
                      {otpSent && (
                        <span className="auth-modal__otp-hint">
                          Mã xác thực <strong>686868</strong> đã được gửi tới số {otpPhone}
                        </span>
                      )}
                    </div>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      className="auth-modal__submit-btn"
                      icon={<ArrowRight size={16} />}
                    >
                      Xác Thực & Đăng Nhập
                    </Button>
                  </form>
                )}

                {/* Social Logins */}
                <SocialButtons
                  onGoogleLogin={() => loginWithSocial('google')}
                  onAppleLogin={() => loginWithSocial('apple')}
                  isLoading={loading}
                />
              </div>
            ),
          },
          {
            key: 'register',
            label: <span className="auth-modal__tab-label">Đăng Ký</span>,
            children: (
              <div className="auth-modal__form-container">
                <form onSubmit={handleRegister} className="auth-modal__form">
                  <div className="auth-modal__input-field">
                    <label className="auth-modal__label">Họ và tên</label>
                    <Input
                      prefix={<User size={16} className="auth-modal__input-icon" />}
                      placeholder="Ví dụ: Nguyễn Hoàng Nam"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="auth-modal__input"
                      size="large"
                    />
                  </div>

                  <div className="auth-modal__input-grid">
                    <div className="auth-modal__input-field">
                      <label className="auth-modal__label">Số điện thoại (10 số)</label>
                      <Input
                        prefix={<Phone size={16} className="auth-modal__input-icon" />}
                        placeholder="0912 345 678"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="auth-modal__input"
                        size="large"
                      />
                    </div>

                    <div className="auth-modal__input-field">
                      <label className="auth-modal__label">Email liên hệ</label>
                      <Input
                        prefix={<Mail size={16} className="auth-modal__input-icon" />}
                        placeholder="email@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="auth-modal__input"
                        size="large"
                      />
                    </div>
                  </div>

                  <div className="auth-modal__input-field">
                    <label className="auth-modal__label">Mật khẩu khởi tạo</label>
                    <Input
                      type={showRegPassword ? 'text' : 'password'}
                      prefix={<Lock size={16} className="auth-modal__input-icon" />}
                      suffix={
                        <button
                          type="button"
                          className="auth-modal__eye-btn"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                        >
                          {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                      placeholder="Tối thiểu 6 ký tự..."
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="auth-modal__input"
                      size="large"
                    />

                    {/* Password Strength Visual Meter */}
                    {regPassword && (
                      <div className="auth-modal__strength-meter">
                        <div className="auth-modal__strength-bars">
                          <span
                            className={`auth-modal__strength-bar ${
                              passStrength === 'weak' || passStrength === 'medium' || passStrength === 'strong'
                                ? 'auth-modal__strength-bar--weak'
                                : ''
                            }`}
                          ></span>
                          <span
                            className={`auth-modal__strength-bar ${
                              passStrength === 'medium' || passStrength === 'strong'
                                ? 'auth-modal__strength-bar--medium'
                                : ''
                            }`}
                          ></span>
                          <span
                            className={`auth-modal__strength-bar ${
                              passStrength === 'strong' ? 'auth-modal__strength-bar--strong' : ''
                            }`}
                          ></span>
                        </div>
                        <span className="auth-modal__strength-text">
                          Độ mạnh: {passStrength === 'weak' && 'Yếu'}
                          {passStrength === 'medium' && 'Trung bình'}
                          {passStrength === 'strong' && 'Mạnh (Tốt)'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="auth-modal__checkbox-row">
                    <Checkbox
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    >
                      <span className="auth-modal__checkbox-text">
                        Tôi đồng ý với{' '}
                        <button
                          type="button"
                          className="auth-modal__policy-link"
                          onClick={(ev) => {
                            ev.preventDefault();
                            if (onOpenTerms) onOpenTerms();
                          }}
                        >
                          Điều khoản & Chính sách OMNITRAVEL
                        </button>
                      </span>
                    </Checkbox>
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    className="auth-modal__submit-btn"
                    icon={<ArrowRight size={16} />}
                  >
                    Đăng Ký Tài Khoản (+100 Điểm)
                  </Button>
                </form>

                {/* Social Logins */}
                <SocialButtons
                  onGoogleLogin={() => loginWithSocial('google')}
                  onAppleLogin={() => loginWithSocial('apple')}
                  isLoading={loading}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );

  if (viewType === 'drawer') {
    return (
      <Drawer
        open={isOpen}
        onClose={onClose}
        width={440}
        placement="right"
        className="auth-modal auth-modal--drawer"
        destroyOnClose
      >
        {authContent}
      </Drawer>
    );
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
      className="auth-modal auth-modal--dialog"
      destroyOnClose
    >
      {authContent}
    </Modal>
  );
};
