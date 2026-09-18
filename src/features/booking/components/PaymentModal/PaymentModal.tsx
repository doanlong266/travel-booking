import React from 'react';
import { Modal, Spin, Tooltip } from 'antd';
import {
  Copy,
  Check,
  Download,
  Clock,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Zap,
  CheckCircle2,
  Building2,
  User,
  Hash,
  Coins,
  FileText
} from 'lucide-react';
import { useVietQRPayment } from '../../hooks/useVietQRPayment';
import { vietQRService } from '../../../../services/vietqr.service';
import './PaymentModal.scss';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  totalAmount: number;
  onPaymentSuccess?: () => void;
  routeSummary?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  totalAmount,
  onPaymentSuccess,
  routeSummary
}) => {
  const {
    formattedTime,
    isUrgent,
    isTimerExpired,
    paymentStatus,
    copiedField,
    isChecking,
    isQrLoading,
    setIsQrLoading,
    beneficiary,
    qrImageUrl,
    copyToClipboard,
    downloadQRCode,
    checkPaymentStatus,
    simulatePaymentSuccess,
    regenerateQR
  } = useVietQRPayment({
    bookingId,
    totalAmount,
    initialSeconds: 600,
    onPaymentSuccess
  });

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      className="vietqr-modal"
      destroyOnClose
      maskClosable={false}
    >
      <div className="vietqr-modal__container">
        {/* 1. HEADER: Brand Logos & Countdown Timer */}
        <header className="vietqr-modal__header">
          <div className="vietqr-modal__brand-logos">
            <div className="vietqr-modal__logo-badge vietqr-modal__logo-badge--vietqr">
              <span className="vietqr-modal__logo-viet">Viet</span>
              <span className="vietqr-modal__logo-qr">QR</span>
            </div>
            <div className="vietqr-modal__logo-sep" />
            <div className="vietqr-modal__logo-badge vietqr-modal__logo-badge--napas">
              <span className="vietqr-modal__logo-napas">NAPAS</span>
              <span className="vietqr-modal__logo-247">247</span>
            </div>
          </div>

          {/* Countdown Timer Badge */}
          <div
            className={`vietqr-modal__timer ${
              isUrgent ? 'vietqr-modal__timer--urgent' : ''
            } ${isTimerExpired ? 'vietqr-modal__timer--expired' : ''}`}
            role="timer"
            aria-label="Thời gian giữ vé và thanh toán"
          >
            <Clock size={15} />
            <span className="vietqr-modal__timer-label">Hết hạn sau:</span>
            <span className="vietqr-modal__timer-digits">{formattedTime}</span>
          </div>
        </header>

        {/* 2. SUCCESS STATE SCREEN */}
        {paymentStatus === 'completed' ? (
          <div className="vietqr-modal__success-view">
            <div className="vietqr-modal__success-icon-box">
              <CheckCircle2 size={48} color="#10b981" />
            </div>
            <h3 className="vietqr-modal__success-title">Thanh Toán VietQR Thành Công!</h3>
            <p className="vietqr-modal__success-desc">
              Hệ thống đã tự động xác thực giao dịch chuyển khoản cho đơn vé <strong>{bookingId}</strong>.
            </p>
            <div className="vietqr-modal__success-card">
              <div className="vietqr-modal__success-row">
                <span>Mã đặt vé:</span>
                <strong>{bookingId}</strong>
              </div>
              <div className="vietqr-modal__success-row">
                <span>Số tiền thanh toán:</span>
                <strong style={{ color: 'var(--color-primary, #0066cc)' }}>
                  {vietQRService.formatAmountVND(totalAmount)}
                </strong>
              </div>
              {routeSummary && (
                <div className="vietqr-modal__success-row">
                  <span>Hành trình:</span>
                  <span>{routeSummary}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              className="vietqr-modal__btn vietqr-modal__btn--primary"
              onClick={onClose}
            >
              Hoàn tất & Xem vé điện tử
            </button>
          </div>
        ) : isTimerExpired ? (
          /* 3. EXPIRED STATE SCREEN */
          <div className="vietqr-modal__expired-view">
            <div className="vietqr-modal__expired-icon-box">
              <AlertCircle size={44} color="#ef4444" />
            </div>
            <h3 className="vietqr-modal__expired-title">Mã QR Đã Hết Hiệu Lực</h3>
            <p className="vietqr-modal__expired-desc">
              Thời gian giữ chỗ thanh toán tự động (10 phút) đã kết thúc. Quý khách vui lòng làm mới mã QR để tiếp tục giao dịch.
            </p>
            <button
              type="button"
              className="vietqr-modal__btn vietqr-modal__btn--refresh"
              onClick={regenerateQR}
            >
              <RefreshCw size={15} /> Làm mới mã QR thanh toán
            </button>
          </div>
        ) : (
          /* 4. ACTIVE PAYMENT VIEW: 2-Column Grid */
          <div className="vietqr-modal__grid">
            {/* Left Column: QR Image Frame */}
            <div className="vietqr-modal__left-col">
              <div className="vietqr-modal__qr-card">
                <div className="vietqr-modal__qr-frame">
                  {isQrLoading && (
                    <div className="vietqr-modal__qr-spinner">
                      <Spin size="large" tip="Đang tạo mã VietQR chuẩn..." />
                    </div>
                  )}
                  <img
                    src={qrImageUrl}
                    alt={`VietQR thanh toán đơn vé ${bookingId}`}
                    className={`vietqr-modal__qr-img ${isQrLoading ? 'vietqr-modal__qr-img--hidden' : ''}`}
                    onLoad={() => setIsQrLoading(false)}
                  />
                </div>

                <div className="vietqr-modal__qr-meta">
                  <span className="vietqr-modal__qr-scan-hint">
                    <ShieldCheck size={14} color="#10b981" /> Quét bằng App của 40+ Ngân hàng
                  </span>

                  <button
                    type="button"
                    className="vietqr-modal__download-btn"
                    onClick={() => downloadQRCode()}
                    title="Tải ảnh mã QR về máy"
                  >
                    <Download size={14} /> Tải ảnh QR
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 1-Click Copy Transfer Details */}
            <div className="vietqr-modal__right-col">
              <div className="vietqr-modal__section-heading">
                <span>Thông tin chuyển khoản thủ công:</span>
              </div>

              <div className="vietqr-modal__fields-list">
                {/* 1. Beneficiary Bank */}
                <div className="vietqr-modal__copy-field">
                  <div className="vietqr-modal__field-left">
                    <span className="vietqr-modal__field-label">
                      <Building2 size={13} /> Ngân hàng thụ hưởng
                    </span>
                    <div className="vietqr-modal__bank-display">
                      <img src={beneficiary.bankLogo} alt={beneficiary.bankShortName} className="vietqr-modal__bank-logo" />
                      <strong className="vietqr-modal__field-val">{beneficiary.bankShortName} - {beneficiary.bankName}</strong>
                    </div>
                  </div>
                  <Tooltip title={copiedField === 'bank' ? 'Đã sao chép!' : 'Sao chép tên ngân hàng'} open={copiedField === 'bank' || undefined}>
                    <button
                      type="button"
                      className={`vietqr-modal__copy-btn ${copiedField === 'bank' ? 'vietqr-modal__copy-btn--copied' : ''}`}
                      onClick={() => copyToClipboard(beneficiary.bankShortName, 'bank')}
                    >
                      {copiedField === 'bank' ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </Tooltip>
                </div>

                {/* 2. Account Name */}
                <div className="vietqr-modal__copy-field">
                  <div className="vietqr-modal__field-left">
                    <span className="vietqr-modal__field-label">
                      <User size={13} /> Chủ tài khoản
                    </span>
                    <strong className="vietqr-modal__field-val vietqr-modal__field-val--name">
                      {beneficiary.accountName}
                    </strong>
                  </div>
                  <Tooltip title={copiedField === 'name' ? 'Đã sao chép!' : 'Sao chép tên chủ tài khoản'} open={copiedField === 'name' || undefined}>
                    <button
                      type="button"
                      className={`vietqr-modal__copy-btn ${copiedField === 'name' ? 'vietqr-modal__copy-btn--copied' : ''}`}
                      onClick={() => copyToClipboard(beneficiary.accountName, 'name')}
                    >
                      {copiedField === 'name' ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </Tooltip>
                </div>

                {/* 3. Account Number */}
                <div className="vietqr-modal__copy-field">
                  <div className="vietqr-modal__field-left">
                    <span className="vietqr-modal__field-label">
                      <Hash size={13} /> Số tài khoản
                    </span>
                    <strong className="vietqr-modal__field-val vietqr-modal__field-val--acc">
                      {beneficiary.accountNo}
                    </strong>
                  </div>
                  <Tooltip title={copiedField === 'acc' ? 'Đã sao chép!' : 'Sao chép số tài khoản'} open={copiedField === 'acc' || undefined}>
                    <button
                      type="button"
                      className={`vietqr-modal__copy-btn ${copiedField === 'acc' ? 'vietqr-modal__copy-btn--copied' : ''}`}
                      onClick={() => copyToClipboard(beneficiary.accountNo, 'acc')}
                    >
                      {copiedField === 'acc' ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </Tooltip>
                </div>

                {/* 4. Total Amount */}
                <div className="vietqr-modal__copy-field vietqr-modal__copy-field--amount">
                  <div className="vietqr-modal__field-left">
                    <span className="vietqr-modal__field-label">
                      <Coins size={13} /> Số tiền cần chuyển
                    </span>
                    <strong className="vietqr-modal__field-val vietqr-modal__field-val--amount">
                      {vietQRService.formatAmountVND(totalAmount)}
                    </strong>
                  </div>
                  <Tooltip title={copiedField === 'amount' ? 'Đã sao chép!' : 'Sao chép số tiền'} open={copiedField === 'amount' || undefined}>
                    <button
                      type="button"
                      className={`vietqr-modal__copy-btn ${copiedField === 'amount' ? 'vietqr-modal__copy-btn--copied' : ''}`}
                      onClick={() => copyToClipboard(totalAmount.toString(), 'amount')}
                    >
                      {copiedField === 'amount' ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </Tooltip>
                </div>

                {/* 5. Transfer Description (CRITICAL) */}
                <div className="vietqr-modal__copy-field vietqr-modal__copy-field--desc">
                  <div className="vietqr-modal__field-left">
                    <span className="vietqr-modal__field-label vietqr-modal__field-label--highlight">
                      <FileText size={13} /> Nội dung chuyển khoản (Bắt buộc chính xác)
                    </span>
                    <strong className="vietqr-modal__field-val vietqr-modal__field-val--code">
                      {bookingId}
                    </strong>
                  </div>
                  <Tooltip title={copiedField === 'desc' ? 'Đã sao chép!' : 'Sao chép nội dung chuyển khoản'} open={copiedField === 'desc' || undefined}>
                    <button
                      type="button"
                      className={`vietqr-modal__copy-btn vietqr-modal__copy-btn--code ${copiedField === 'desc' ? 'vietqr-modal__copy-btn--copied' : ''}`}
                      onClick={() => copyToClipboard(bookingId, 'desc')}
                    >
                      {copiedField === 'desc' ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Notice Box */}
              <div className="vietqr-modal__notice-box">
                <AlertCircle size={15} color="#b45309" className="vietqr-modal__notice-icon" />
                <p className="vietqr-modal__notice-text">
                  Vui lòng giữ nguyên <strong>nội dung chuyển khoản ({bookingId})</strong> để hệ thống tự động gạch nợ và phát hành vé điện tử trong 30 giây.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="vietqr-modal__actions">
                <button
                  type="button"
                  className="vietqr-modal__btn vietqr-modal__btn--verify"
                  onClick={checkPaymentStatus}
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <>
                      <RefreshCw size={14} className="vietqr-modal__spinner" /> Đang kiểm tra giao dịch...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} /> Tôi đã chuyển khoản thành công
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="vietqr-modal__btn vietqr-modal__btn--demo"
                  onClick={simulatePaymentSuccess}
                >
                  <Zap size={14} /> Mô phỏng thanh toán thành công (Test Flow)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
