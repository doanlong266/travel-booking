import React from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Radio,
  Progress,
  Tag,
  Divider,
  message,
  Tooltip,
} from 'antd';
import {
  CheckCircle2,
  Ticket,
  Printer,
  Copy,
  RotateCcw,
  ShieldCheck,
  Clock,
  ArrowRight,
  User,
  Phone,
  Mail,
  Building,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CarrierLogo } from '@/components/common/CarrierLogo';
import type {
  ITicketItem,
  ISeatInfo,
  IPassengerInfo,
  IContactInfo,
  IBookingPayload,
} from '@/types/ticket';
import type { CheckoutStep } from '@/hooks/useBookingFlow';

interface BookingCheckoutModalProps {
  ticket: ITicketItem | null;
  selectedSeats: ISeatInfo[];
  passengers: IPassengerInfo[];
  contactInfo: IContactInfo;
  checkoutStep: CheckoutStep;
  isOpen: boolean;
  onClose: () => void;
  countdownSeconds: number;
  isTimerExpired: boolean;
  regenerateQR: () => void;
  confirmedBooking: IBookingPayload | null;
  onSubmitGuestInfo: (contact: IContactInfo, passengerList: IPassengerInfo[], distanceKm: number) => void;
  onSimulateSuccess: () => void;
  onReset: () => void;
  distanceKm: number;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  ticket,
  selectedSeats,
  passengers,
  contactInfo,
  checkoutStep,
  isOpen,
  onClose,
  countdownSeconds,
  isTimerExpired,
  regenerateQR,
  confirmedBooking,
  onSubmitGuestInfo,
  onSimulateSuccess,
  onReset,
  distanceKm,
}) => {
  const [form] = Form.useForm();

  if (!ticket && !confirmedBooking) return null;
  const currentTicket = ticket || confirmedBooking?.ticket;
  if (!currentTicket) return null;

  const seatCount = Math.max(1, selectedSeats.length || passengers.length);
  const totalAmount = currentTicket.price * seatCount;

  // Format MM:SS for countdown timer
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(`Đã sao chép ${label}!`);
  };

  // Handle Guest Form Submit
  const handleFormFinish = (values: {
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    passengerList: IPassengerInfo[];
  }) => {
    const contact: IContactInfo = {
      fullName: values.contactName,
      phone: values.contactPhone,
      email: values.contactEmail,
    };

    onSubmitGuestInfo(contact, values.passengerList, distanceKm);
  };

  // VietQR standard URL / string for QRCodeSVG
  const vietQrPayload = confirmedBooking
    ? `https://img.vietqr.io/image/MB-0919283848-compact2.png?amount=${confirmedBooking.totalAmount}&addInfo=${encodeURIComponent(
        confirmedBooking.bankInfo.transferMemo
      )}&accountName=${encodeURIComponent(confirmedBooking.bankInfo.accountName)}`
    : '';

  return (
    <Modal
      title={
        checkoutStep === 'payment_success' ? (
          <div className="checkout-modal__header checkout-modal__header--success">
            <CheckCircle2 size={24} className="checkout-modal__success-icon" />
            <div>
              <h3 className="checkout-modal__title">Đặt vé thành công!</h3>
              <p className="checkout-modal__subtitle">
                Vé điện tử đã được phát hành và gửi về email:{' '}
                <strong>{confirmedBooking?.contact.email}</strong>
              </p>
            </div>
          </div>
        ) : checkoutStep === 'qr_payment' ? (
          <div className="checkout-modal__header">
            <div className="checkout-modal__header-icon-box">
              <Zap size={20} className="checkout-modal__header-icon" />
            </div>
            <div>
              <h3 className="checkout-modal__title">Thanh toán VietQR tiện lợi</h3>
              <p className="checkout-modal__subtitle">
                Quét mã qua mọi ứng dụng ngân hàng hoặc ví điện tử
              </p>
            </div>
          </div>
        ) : (
          <div className="checkout-modal__header">
            <div className="checkout-modal__header-icon-box">
              <Ticket size={20} className="checkout-modal__header-icon" />
            </div>
            <div>
              <div className="checkout-modal__guest-badge-wrap">
                <h3 className="checkout-modal__title">Thông tin đặt vé (Guest Checkout)</h3>
                <Tag color="green" className="checkout-modal__guest-tag">
                  Không cần đăng nhập
                </Tag>
              </div>
              <p className="checkout-modal__subtitle">
                {currentTicket.carrierName} • {currentTicket.vehicleNumber} ({currentTicket.vehicleName})
              </p>
            </div>
          </div>
        )
      }
      open={isOpen}
      onCancel={onClose}
      width={checkoutStep === 'payment_success' ? 820 : checkoutStep === 'qr_payment' ? 720 : 760}
      className="checkout-modal"
      footer={null}
    >
      {/* =========================================================================
          STEP 1: GUEST INFORMATION FORM (NO LOGIN REQUIRED)
         ========================================================================= */}
      {checkoutStep === 'guest_info' && (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            contactName: contactInfo.fullName,
            contactPhone: contactInfo.phone,
            contactEmail: contactInfo.email,
            passengerList: passengers.map((p, idx) => ({
              fullName: p.fullName,
              idNumber: p.idNumber || '',
              passengerType: p.passengerType || 'adult',
              seatNumber: selectedSeats[idx]?.number || '',
            })),
          }}
          onFinish={handleFormFinish}
          className="checkout-modal__form"
        >
          {/* 1. Trip Recap Header Bar */}
          <div className="checkout-modal__trip-recap">
            <CarrierLogo
              carrier={currentTicket.carrierLogo}
              code={currentTicket.carrierCode}
              name={currentTicket.carrierName}
              variant="badge"
              size="md"
            />
            <div className="checkout-modal__recap-route">
              <span className="checkout-modal__recap-carrier">{currentTicket.carrierName}</span>
              <span className="checkout-modal__recap-points">
                {currentTicket.origin.city} ({currentTicket.origin.code}) &rarr;{' '}
                {currentTicket.destination.city} ({currentTicket.destination.code})
              </span>
            </div>
            <div className="checkout-modal__recap-seats">
              <span>Chỗ đã chọn: </span>
              <strong>
                {selectedSeats.length > 0
                  ? selectedSeats.map((s) => s.number).join(', ')
                  : 'Ghế tiêu chuẩn'}
              </strong>
            </div>
          </div>

          {/* 2. Contact Information Group */}
          <div className="checkout-modal__section">
            <div className="checkout-modal__section-title-wrap">
              <Phone size={16} className="checkout-modal__section-icon" />
              <h4 className="checkout-modal__section-title">1. Thông tin liên hệ nhận vé</h4>
            </div>

            <div className="checkout-modal__form-grid">
              <Form.Item
                name="contactName"
                label="Họ và tên người liên hệ"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên người liên hệ' }]}
              >
                <Input
                  prefix={<User size={15} className="checkout-modal__input-icon" />}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="contactPhone"
                label="Số điện thoại di động"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  {
                    pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                    message: 'Số điện thoại Việt Nam không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09)',
                  },
                ]}
              >
                <Input
                  prefix={<Phone size={15} className="checkout-modal__input-icon" />}
                  placeholder="0912 345 678"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="contactEmail"
                label="Email nhận vé điện tử"
                className="checkout-modal__full-row"
                rules={[
                  { required: true, message: 'Vui lòng nhập email nhận vé' },
                  { type: 'email', message: 'Định dạng email không hợp lệ' },
                ]}
              >
                <Input
                  prefix={<Mail size={15} className="checkout-modal__input-icon" />}
                  placeholder="email.nhanve@domain.com"
                  size="large"
                />
              </Form.Item>
            </div>
          </div>

          <Divider />

          {/* 3. Passenger Details List */}
          <div className="checkout-modal__section">
            <div className="checkout-modal__section-title-wrap">
              <User size={16} className="checkout-modal__section-icon" />
              <h4 className="checkout-modal__section-title">
                2. Thông tin hành khách ({passengers.length} khách)
              </h4>
            </div>

            <Form.List name="passengerList">
              {(fields) => (
                <div className="checkout-modal__passengers-list">
                  {fields.map(({ key, name, ...restField }, index) => {
                    const assignedSeat = selectedSeats[index]?.number;
                    const requiresId =
                      currentTicket.transportType === 'flight' ||
                      currentTicket.transportType === 'train';

                    return (
                      <div key={key} className="checkout-modal__passenger-card">
                        <div className="checkout-modal__passenger-card-header">
                          <span className="checkout-modal__passenger-index">
                            Hành khách #{index + 1}
                          </span>
                          {assignedSeat && (
                            <Tag color="blue" className="checkout-modal__passenger-seat-tag">
                              Vị trí: {assignedSeat}
                            </Tag>
                          )}
                        </div>

                        <div className="checkout-modal__form-grid">
                          <Form.Item
                            {...restField}
                            name={[name, 'fullName']}
                            label="Họ và tên hành khách"
                            rules={[
                              { required: true, message: 'Vui lòng nhập họ và tên hành khách' },
                            ]}
                          >
                            <Input
                              placeholder="NGUYEN VAN AN"
                              size="large"
                              style={{ textTransform: 'uppercase' }}
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'idNumber']}
                            label={
                              requiresId
                                ? 'Số CCCD / Hộ chiếu (Bắt buộc)'
                                : 'Số CCCD / Hộ chiếu (Không bắt buộc)'
                            }
                            rules={
                              requiresId
                                ? [
                                    {
                                      required: true,
                                      message: 'Vui lòng nhập số CCCD/Hộ chiếu theo quy định vận chuyển',
                                    },
                                    {
                                      pattern: /^[0-9]{9,12}$|^[A-Z][0-9]{7,8}$/i,
                                      message: 'Số CCCD (9-12 số) hoặc Hộ chiếu không hợp lệ',
                                    },
                                  ]
                                : []
                            }
                          >
                            <Input placeholder="Số CCCD 12 số" size="large" />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'passengerType']}
                            label="Loại hành khách"
                            className="checkout-modal__full-row"
                          >
                            <Radio.Group>
                              <Radio value="adult">Người lớn (&ge; 12 tuổi)</Radio>
                              <Radio value="child">Trẻ em (2 - 11 tuổi)</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Form.List>
          </div>

          <Divider />

          {/* 4. Total & Confirm CTA */}
          <div className="checkout-modal__action-bar">
            <div className="checkout-modal__action-total">
              <span className="checkout-modal__action-label">Tổng tiền thanh toán:</span>
              <strong className="checkout-modal__action-amount">
                {totalAmount.toLocaleString('vi-VN')} đ
              </strong>
              <small className="checkout-modal__action-tax-note">Đã gồm thuế & phí nhà ga</small>
            </div>

            <div className="checkout-modal__action-btns">
              <Button onClick={onClose} size="large">
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="checkout-modal__submit-btn"
              >
                Xác nhận & Thanh toán VietQR &rarr;
              </Button>
            </div>
          </div>
        </Form>
      )}

      {/* =========================================================================
          STEP 2: VIETQR PAYMENT & 10:00 REAL-TIME COUNTDOWN TIMER
         ========================================================================= */}
      {checkoutStep === 'qr_payment' && confirmedBooking && (
        <div className="checkout-modal__qr-view">
          {/* Countdown Timer Header */}
          <div
            className={`checkout-modal__countdown-card ${
              isTimerExpired ? 'checkout-modal__countdown-card--expired' : ''
            }`}
          >
            <div className="checkout-modal__countdown-main">
              <Clock
                size={20}
                className={`checkout-modal__clock-icon ${
                  isTimerExpired ? 'checkout-modal__clock-icon--expired' : ''
                }`}
              />
              <span className="checkout-modal__countdown-label">
                {isTimerExpired ? 'Mã QR thanh toán đã hết hạn' : 'Thời gian giữ chỗ & thanh toán:'}
              </span>
              <strong
                className={`checkout-modal__countdown-digits ${
                  isTimerExpired ? 'checkout-modal__countdown-digits--expired' : ''
                }`}
              >
                {formatTimer(countdownSeconds)}
              </strong>
            </div>

            <Progress
              percent={Math.round((countdownSeconds / 600) * 100)}
              showInfo={false}
              status={isTimerExpired ? 'exception' : 'active'}
              strokeColor={isTimerExpired ? '#ef4444' : '#0284c7'}
              className="checkout-modal__countdown-progress"
            />
          </div>

          {/* Body: QR Box & Bank Transfer Information */}
          <div className="checkout-modal__qr-grid">
            {/* Left: QR Code Box */}
            <div className="checkout-modal__qr-box">
              {isTimerExpired ? (
                <div className="checkout-modal__qr-expired-placeholder">
                  <AlertTriangle size={36} className="checkout-modal__expired-icon" />
                  <strong>Mã QR đã hết hiệu lực</strong>
                  <p>Để đảm bảo an toàn giao dịch, vui lòng tạo lại mã mới.</p>
                  <Button
                    type="primary"
                    icon={<RotateCcw size={15} />}
                    onClick={regenerateQR}
                    className="checkout-modal__regen-btn"
                  >
                    Tạo lại mã QR mới
                  </Button>
                </div>
              ) : (
                <div className="checkout-modal__qr-code-wrapper">
                  <div className="checkout-modal__qr-card">
                    <QRCodeSVG
                      value={vietQrPayload || 'https://omnitravel.vn'}
                      size={210}
                      level="M"
                      includeMargin={true}
                    />
                    <div className="checkout-modal__qr-logo-brand">
                      <span className="checkout-modal__qr-bank-pill">VietQR • MB</span>
                    </div>
                  </div>
                  <div className="checkout-modal__scan-instructions">
                    <p>Mở ứng dụng Mobile Banking / Ví điện tử để quét mã thanh toán tự động</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Bank Transfer Details */}
            <div className="checkout-modal__bank-details">
              <h4 className="checkout-modal__bank-heading">
                <Building size={16} />
                Thông tin chuyển khoản chính thức
              </h4>

              <div className="checkout-modal__bank-rows">
                {/* Bank Name */}
                <div className="checkout-modal__bank-row">
                  <span className="checkout-modal__bank-label">Ngân hàng:</span>
                  <strong className="checkout-modal__bank-val">
                    {confirmedBooking.bankInfo.bankName}
                  </strong>
                </div>

                {/* Account Number */}
                <div className="checkout-modal__bank-row">
                  <span className="checkout-modal__bank-label">Số tài khoản:</span>
                  <div className="checkout-modal__bank-copy-val">
                    <strong className="checkout-modal__highlight-number">
                      {confirmedBooking.bankInfo.accountNumber}
                    </strong>
                    <Button
                      type="text"
                      size="small"
                      icon={<Copy size={13} />}
                      onClick={() =>
                        copyToClipboard(
                          confirmedBooking.bankInfo.accountNumber,
                          'Số tài khoản ngân hàng'
                        )
                      }
                      className="checkout-modal__copy-btn"
                    >
                      Sao chép
                    </Button>
                  </div>
                </div>

                {/* Account Name */}
                <div className="checkout-modal__bank-row">
                  <span className="checkout-modal__bank-label">Chủ tài khoản:</span>
                  <strong className="checkout-modal__bank-val">
                    {confirmedBooking.bankInfo.accountName}
                  </strong>
                </div>

                {/* Amount */}
                <div className="checkout-modal__bank-row">
                  <span className="checkout-modal__bank-label">Số tiền:</span>
                  <div className="checkout-modal__bank-copy-val">
                    <strong className="checkout-modal__amount-highlight">
                      {confirmedBooking.totalAmount.toLocaleString('vi-VN')} VNĐ
                    </strong>
                    <Button
                      type="text"
                      size="small"
                      icon={<Copy size={13} />}
                      onClick={() =>
                        copyToClipboard(
                          confirmedBooking.totalAmount.toString(),
                          'Số tiền thanh toán'
                        )
                      }
                      className="checkout-modal__copy-btn"
                    >
                      Sao chép
                    </Button>
                  </div>
                </div>

                {/* Transfer Memo */}
                <div className="checkout-modal__bank-row checkout-modal__bank-row--memo">
                  <span className="checkout-modal__bank-label">Nội dung CK:</span>
                  <div className="checkout-modal__bank-copy-val">
                    <strong className="checkout-modal__memo-highlight">
                      {confirmedBooking.bankInfo.transferMemo}
                    </strong>
                    <Button
                      type="text"
                      size="small"
                      icon={<Copy size={13} />}
                      onClick={() =>
                        copyToClipboard(
                          confirmedBooking.bankInfo.transferMemo,
                          'Nội dung chuyển khoản'
                        )
                      }
                      className="checkout-modal__copy-btn"
                    >
                      Sao chép
                    </Button>
                  </div>
                </div>
              </div>

              {/* Status Polling Live Indicator */}
              <div className="checkout-modal__polling-badge">
                <span className="checkout-modal__polling-pulse" />
                <span className="checkout-modal__polling-text">
                  Hệ thống đang chờ tín hiệu thanh toán từ ngân hàng...
                </span>
              </div>

              {/* Simulation Instant Trigger */}
              <div className="checkout-modal__simulation-box">
                <Button
                  type="dashed"
                  icon={<Zap size={15} />}
                  onClick={onSimulateSuccess}
                  className="checkout-modal__simulation-btn"
                >
                  Mô phỏng thanh toán thành công (Thử nghiệm)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: PAYMENT SUCCESS SCREEN (BOOKING SUCCESS & TICKET ID VOUCHER)
         ========================================================================= */}
      {checkoutStep === 'payment_success' && confirmedBooking && (
        <div className="checkout-modal__success-screen">
          {/* Top Success Banner */}
          <div className="checkout-modal__success-banner">
            <div className="checkout-modal__success-icon-wrapper">
              <CheckCircle2 size={36} className="checkout-modal__success-icon-lg" />
            </div>
            <h4 className="checkout-modal__success-headline">Thanh toán hoàn tất!</h4>
            <p className="checkout-modal__success-subline">
              Hệ thống đã xác nhận thanh toán thành công cho đơn đặt chỗ của quý khách.
            </p>

            {/* Prominent Ticket ID with 1-click Copy */}
            <div className="checkout-modal__ticket-id-card">
              <div className="checkout-modal__ticket-id-info">
                <span className="checkout-modal__ticket-id-label">MÃ VÉ ĐIỆN TỬ (TICKET ID / PNR)</span>
                <strong className="checkout-modal__ticket-id-val">
                  {confirmedBooking.ticketId}
                </strong>
              </div>
              <Tooltip title="Sao chép mã vé">
                <Button
                  type="primary"
                  icon={<Copy size={16} />}
                  onClick={() => copyToClipboard(confirmedBooking.ticketId, 'Mã vé điện tử')}
                  className="checkout-modal__copy-ticket-btn"
                >
                  Sao chép mã
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* Ticket Voucher Card */}
          <div className="checkout-modal__voucher-card">
            {/* Carrier & Vehicle Header */}
            <div className="checkout-modal__voucher-top">
              <div className="checkout-modal__voucher-carrier">
                <CarrierLogo
                  carrier={confirmedBooking.ticket.carrierLogo}
                  code={confirmedBooking.ticket.carrierCode}
                  name={confirmedBooking.ticket.carrierName}
                  variant="badge"
                  size={46}
                />
                <div>
                  <h4 className="checkout-modal__voucher-carrier-name">
                    {confirmedBooking.ticket.carrierName}
                  </h4>
                  <span className="checkout-modal__voucher-vehicle">
                    {confirmedBooking.ticket.vehicleNumber} ({confirmedBooking.ticket.vehicleName})
                  </span>
                </div>
              </div>
              <Tag color="green" className="checkout-modal__confirmed-tag">
                <ShieldCheck size={13} />
                ĐÃ XÁC NHẬN VÉ
              </Tag>
            </div>

            {/* Route & Distance Info */}
            <div className="checkout-modal__voucher-route">
              <div className="checkout-modal__voucher-station">
                <span className="checkout-modal__voucher-city">
                  {confirmedBooking.ticket.origin.city}
                </span>
                <strong className="checkout-modal__voucher-code-lg">
                  {confirmedBooking.ticket.origin.code}
                </strong>
                <span className="checkout-modal__voucher-terminal">
                  {confirmedBooking.ticket.origin.name}
                </span>
                <span className="checkout-modal__voucher-time">
                  {new Date(confirmedBooking.ticket.departureTime).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="checkout-modal__voucher-mid-route">
                <span className="checkout-modal__voucher-km-badge">
                  {confirmedBooking.distanceKm > 0
                    ? `${confirmedBooking.distanceKm.toLocaleString('vi-VN')} km`
                    : `${Math.floor(confirmedBooking.ticket.durationMinutes / 60)}h ${
                        confirmedBooking.ticket.durationMinutes % 60
                      }m`}
                </span>
                <div className="checkout-modal__voucher-line-decor">
                  <span className="checkout-modal__line-dot" />
                  <span className="checkout-modal__line-bar" />
                  <ArrowRight size={14} className="checkout-modal__line-arrow" />
                  <span className="checkout-modal__line-dot" />
                </div>
                <span className="checkout-modal__voucher-seat-type">
                  {confirmedBooking.ticket.seatClassName}
                </span>
              </div>

              <div className="checkout-modal__voucher-station">
                <span className="checkout-modal__voucher-city">
                  {confirmedBooking.ticket.destination.city}
                </span>
                <strong className="checkout-modal__voucher-code-lg">
                  {confirmedBooking.ticket.destination.code}
                </strong>
                <span className="checkout-modal__voucher-terminal">
                  {confirmedBooking.ticket.destination.name}
                </span>
                <span className="checkout-modal__voucher-time">
                  {new Date(confirmedBooking.ticket.arrivalTime).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Key Trip Parameters Grid */}
            <div className="checkout-modal__voucher-meta-grid">
              <div className="checkout-modal__voucher-meta-item">
                <span className="checkout-modal__meta-label">Người nhận vé:</span>
                <strong className="checkout-modal__meta-val">
                  {confirmedBooking.contact.fullName} ({confirmedBooking.contact.phone})
                </strong>
              </div>

              <div className="checkout-modal__voucher-meta-item">
                <span className="checkout-modal__meta-label">Danh sách hành khách:</span>
                <strong className="checkout-modal__meta-val">
                  {confirmedBooking.passengers
                    .map((p) => `${p.fullName} (${p.seatNumber || 'Ghế tiêu chuẩn'})`)
                    .join(', ')}
                </strong>
              </div>

              <div className="checkout-modal__voucher-meta-item">
                <span className="checkout-modal__meta-label">Ngày khởi hành:</span>
                <strong className="checkout-modal__meta-val">
                  {new Date(confirmedBooking.ticket.departureTime).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </strong>
              </div>

              <div className="checkout-modal__voucher-meta-item">
                <span className="checkout-modal__meta-label">Tổng tiền đã thanh toán:</span>
                <strong className="checkout-modal__meta-val checkout-modal__meta-val--price">
                  {confirmedBooking.totalAmount.toLocaleString('vi-VN')} đ
                </strong>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="checkout-modal__success-actions">
            <Button
              size="large"
              icon={<Printer size={16} />}
              onClick={() => window.print()}
              className="checkout-modal__print-action-btn"
            >
              Tải vé PDF / In vé
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={onReset}
              className="checkout-modal__home-action-btn"
            >
              Về trang chủ / Đặt chuyến mới
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
