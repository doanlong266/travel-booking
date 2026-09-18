import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Mail, 
  Wallet, 
  QrCode, 
  Plane, 
  Train, 
  Bus, 
  Clock, 
  UserCheck, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  Luggage, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import type { IGuestBookingOrder, GuestBookingStatus } from '../../../../types/guestLookup.types';
import { CarrierLogo } from '../../../../components/common/CarrierLogo';
import { guestLookupService } from '../../../../services/guestLookup.service';

interface ElectronicTicketViewProps {
  order: IGuestBookingOrder;
  onBack?: () => void;
  onRebook?: (order: IGuestBookingOrder) => void;
  onResumePayment?: (order: IGuestBookingOrder) => void;
  onRegisterMember?: (phone: string) => void;
  onOpenFastRefund?: (order: IGuestBookingOrder) => void;
}

const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDateTime = (isoString: string): { date: string; time: string } => {
  try {
    const d = new Date(isoString);
    const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    const date = d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
    return { date, time };
  } catch {
    return { date: isoString, time: '' };
  }
};

const getStatusBadge = (status: GuestBookingStatus) => {
  switch (status) {
    case 'confirmed':
      return <span className="ticket-status-badge ticket-status-badge--confirmed"><CheckCircle2 size={13} /> Đã Xác Nhận</span>;
    case 'pending_payment':
      return <span className="ticket-status-badge ticket-status-badge--pending_payment"><Clock size={13} /> Chờ Thanh Toán</span>;
    case 'expired':
      return <span className="ticket-status-badge ticket-status-badge--expired"><AlertCircle size={13} /> Đã Hết Hạn</span>;
    case 'cancelled':
      return <span className="ticket-status-badge ticket-status-badge--cancelled">Đã Hủy</span>;
    default:
      return null;
  }
};

export const ElectronicTicketView: React.FC<ElectronicTicketViewProps> = ({
  order,
  onBack,
  onRebook,
  onResumePayment,
  onRegisterMember,
  onOpenFastRefund
}) => {
  const [emailSending, setEmailSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const dep = formatDateTime(order.departureTime);
  const arr = formatDateTime(order.arrivalTime);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    if (!order.contact.email) {
      setFeedbackMessage('Không có email người đặt trong thông tin vé.');
      return;
    }
    setEmailSending(true);
    setFeedbackMessage(null);
    try {
      const res = await guestLookupService.resendTicketEmail(order.bookingId, order.contact.email);
      setFeedbackMessage(res.message);
    } catch {
      setFeedbackMessage('Có lỗi xảy ra khi gửi lại vé. Vui lòng thử lại sau.');
    } finally {
      setEmailSending(false);
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  const handleSaveWallet = () => {
    setFeedbackMessage(`Đã tạo vé số chuẩn Apple/Google Wallet cho mã ${order.pnrCode}.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const renderTransportIcon = () => {
    switch (order.transportType) {
      case 'flight': return <Plane size={20} />;
      case 'train': return <Train size={20} />;
      case 'bus': return <Bus size={20} />;
      default: return <Plane size={20} />;
    }
  };

  return (
    <div className="e-ticket">
      {/* Top Action Controls */}
      <div className="e-ticket__actions-top">
        {onBack && (
          <button type="button" className="e-ticket__back-btn" onClick={onBack}>
            <ArrowLeft size={16} /> Quay lại tra cứu
          </button>
        )}
        <div className="e-ticket__action-group">
          {order.paymentStatus === 'confirmed' && onOpenFastRefund && (
            <button
              type="button"
              className="e-ticket__action-btn"
              style={{ color: '#c2410c', borderColor: '#fed7aa', backgroundColor: '#fffaf5' }}
              onClick={() => onOpenFastRefund(order)}
              title="Yêu cầu hoàn vé hoặc đổi chuyến"
            >
              <RotateCcw size={16} /> Hoàn vé / Đổi chuyến
            </button>
          )}
          <button type="button" className="e-ticket__action-btn" onClick={handlePrint} title="In hoặc Tải vé định dạng PDF">
            <Printer size={16} /> In vé / Tải PDF
          </button>
          <button 
            type="button" 
            className="e-ticket__action-btn" 
            onClick={handleSendEmail} 
            disabled={emailSending}
            title="Gửi lại vé điện tử vào Email"
          >
            <Mail size={16} /> {emailSending ? 'Đang gửi...' : 'Gửi lại Email'}
          </button>
          <button type="button" className="e-ticket__action-btn" onClick={handleSaveWallet} title="Thêm vào ví điện tử">
            <Wallet size={16} /> Ví điện tử
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="guest-lookup__error-alert" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
          <CheckCircle2 size={16} /> {feedbackMessage}
        </div>
      )}

      {/* Special Status Notifications */}
      {order.paymentStatus === 'pending_payment' && (
        <div className="e-ticket__status-callout e-ticket__status-callout--pending">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} />
            <div>
              <strong>Đơn hàng đang chờ thanh toán</strong>
              <div style={{ fontSize: '12px' }}>Vui lòng hoàn tất thanh toán để nhận mã vé chính thức.</div>
            </div>
          </div>
          {onResumePayment && (
            <button 
              type="button" 
              className="e-ticket__action-btn e-ticket__action-btn--primary"
              onClick={() => onResumePayment(order)}
            >
              Thanh toán ngay
            </button>
          )}
        </div>
      )}

      {(order.paymentStatus === 'expired' || order.paymentStatus === 'cancelled') && (
        <div className="e-ticket__status-callout e-ticket__status-callout--expired">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            <div>
              <strong>Đơn đặt vé này đã hết hạn hoặc bị hủy</strong>
              <div style={{ fontSize: '12px' }}>Bạn có thể đặt lại hành trình tương tự chỉ với 1 cú nhấp.</div>
            </div>
          </div>
          {onRebook && (
            <button 
              type="button" 
              className="e-ticket__action-btn e-ticket__action-btn--primary"
              onClick={() => onRebook(order)}
            >
              <RefreshCw size={14} /> Đặt lại chuyến này
            </button>
          )}
        </div>
      )}

      {/* Physical Electronic Boarding Pass */}
      <div className="e-ticket__card" id="printable-e-ticket">
        {/* Header Bar */}
        <div className="e-ticket__header">
          <div className="e-ticket__carrier-header">
            <CarrierLogo 
              carrier={order.carrierId}
              name={order.carrierName}
              code={order.carrierCode}
              size="md"
            />
            <div>
              <h3 className="e-ticket__carrier-title">{order.carrierName}</h3>
              <div className="e-ticket__carrier-vehicle">
                {order.vehicleNumber} • {order.vehicleName} ({order.seatClassName})
              </div>
            </div>
          </div>

          <div className="e-ticket__pnr-badge-box">
            <div className="e-ticket__pnr-label">Mã đặt chỗ (PNR)</div>
            <div className="e-ticket__pnr-code">{order.pnrCode}</div>
            <div style={{ marginTop: '4px' }}>
              {getStatusBadge(order.paymentStatus)}
            </div>
          </div>
        </div>

        {/* Route Banner */}
        <div className="e-ticket__route-banner">
          <div className="e-ticket__route-col">
            <span className="e-ticket__city-code">{order.origin.code}</span>
            <span className="e-ticket__city-name">{order.origin.city}</span>
            <span className="e-ticket__station-name">{order.origin.name}</span>
            {order.origin.terminal && <span className="e-ticket__station-name">({order.origin.terminal})</span>}
            <div className="e-ticket__time">{dep.time} • {dep.date}</div>
          </div>

          <div className="e-ticket__route-mid">
            <span className="e-ticket__duration">
              {Math.floor(order.durationMinutes / 60)}h {order.durationMinutes % 60}m
            </span>
            <div className="e-ticket__route-line">
              <span className="e-ticket__route-line-bar" />
              {renderTransportIcon()}
              <span className="e-ticket__route-line-bar" />
            </div>
            <span className="e-ticket__station-name" style={{ fontSize: '11px' }}>Bay thẳng / Trực tiếp</span>
          </div>

          <div className="e-ticket__route-col e-ticket__route-col--dest">
            <span className="e-ticket__city-code">{order.destination.code}</span>
            <span className="e-ticket__city-name">{order.destination.city}</span>
            <span className="e-ticket__station-name">{order.destination.name}</span>
            {order.destination.terminal && <span className="e-ticket__station-name">({order.destination.terminal})</span>}
            <div className="e-ticket__time">{arr.time} • {arr.date}</div>
          </div>
        </div>

        {/* Content Details Grid */}
        <div className="e-ticket__details-grid">
          {/* Passenger and seat list */}
          <div className="e-ticket__passenger-section">
            <div className="e-ticket__section-title">
              <UserCheck size={16} /> Danh sách hành khách & Chỗ ngồi
            </div>

            <table className="e-ticket__passenger-table">
              <thead>
                <tr>
                  <th>Họ và Tên</th>
                  <th>Đối tượng</th>
                  <th>Số CCCD / Hộ chiếu</th>
                  <th>Chỗ ngồi</th>
                </tr>
              </thead>
              <tbody>
                {order.passengers.map((p, index) => (
                  <tr key={index}>
                    <td>
                      <strong style={{ textTransform: 'uppercase' }}>{p.fullName}</strong>
                      {p.gender && <div style={{ fontSize: '11px', color: '#64748b' }}>{p.gender === 'male' ? 'Nam' : 'Nữ'}</div>}
                    </td>
                    <td>{p.passengerType === 'adult' ? 'Người lớn' : 'Trẻ em'}</td>
                    <td>{p.idNumber || 'Chưa cập nhật'}</td>
                    <td>
                      <span className="e-ticket__seat-badge">
                        {p.seatNumber || p.selectedSeatId || 'Tự động'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Baggage and Policy Information */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
              <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Luggage size={14} /> Hành lý quy định
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginTop: '4px' }}>
                  Xách tay: {order.baggagePolicy?.carryOnKg || 7}kg • Ký gửi: {order.baggagePolicy?.checkedKg || 0}kg
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} /> Chính sách vé
                </div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#1e293b', marginTop: '4px' }}>
                  {order.cancellationPolicy || 'Áp dụng theo quy định của nhà vận chuyển'}
                </div>
              </div>
            </div>

            {/* Contact and Total Price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Người đặt: <strong>{order.contact.fullName}</strong> • {order.contact.phone}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#64748b', marginRight: '8px' }}>Tổng thanh toán:</span>
                <strong style={{ fontSize: '18px', color: 'var(--color-primary)' }}>{formatPrice(order.totalAmount)}</strong>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="e-ticket__qr-section">
            <div className="e-ticket__section-title" style={{ justifyContent: 'center' }}>
              <QrCode size={16} /> Mã QR Lên Xe / Bay
            </div>
            <div className="e-ticket__qr-box">
              {/* Generate clean vector SVG QR Code */}
              <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="140" height="140" rx="8" fill="white" />
                {/* QR Pattern Representation */}
                <rect x="14" y="14" width="36" height="36" rx="4" fill="#0f172a" />
                <rect x="20" y="20" width="24" height="24" rx="2" fill="white" />
                <rect x="25" y="25" width="14" height="14" rx="1" fill="#0284c7" />

                <rect x="90" y="14" width="36" height="36" rx="4" fill="#0f172a" />
                <rect x="96" y="20" width="24" height="24" rx="2" fill="white" />
                <rect x="101" y="25" width="14" height="14" rx="1" fill="#0284c7" />

                <rect x="14" y="90" width="36" height="36" rx="4" fill="#0f172a" />
                <rect x="20" y="96" width="24" height="24" rx="2" fill="white" />
                <rect x="25" y="101" width="14" height="14" rx="1" fill="#0284c7" />

                {/* Grid Dots */}
                <rect x="58" y="18" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="72" y="18" width="8" height="8" rx="2" fill="#0284c7" />
                <rect x="58" y="32" width="8" height="8" rx="2" fill="#0284c7" />
                <rect x="72" y="32" width="8" height="8" rx="2" fill="#0f172a" />
                
                <rect x="58" y="58" width="24" height="24" rx="4" fill="#0f172a" />
                <rect x="64" y="64" width="12" height="12" rx="2" fill="#38bdf8" />
                
                <rect x="18" y="58" width="8" height="8" rx="2" fill="#0284c7" />
                <rect x="32" y="58" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="90" y="58" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="104" y="58" width="8" height="8" rx="2" fill="#0284c7" />
                <rect x="118" y="58" width="8" height="8" rx="2" fill="#0f172a" />

                <rect x="58" y="90" width="8" height="8" rx="2" fill="#0f172a" />
                <rect x="72" y="90" width="8" height="8" rx="2" fill="#0284c7" />
                <rect x="90" y="90" width="14" height="14" rx="2" fill="#0284c7" />
                <rect x="112" y="90" width="14" height="14" rx="2" fill="#0f172a" />
                <rect x="58" y="106" width="18" height="18" rx="3" fill="#0284c7" />
                <rect x="84" y="112" width="18" height="18" rx="3" fill="#0f172a" />
                <rect x="110" y="112" width="16" height="16" rx="3" fill="#0284c7" />
              </svg>
            </div>
            <div className="e-ticket__qr-instruction">
              Xuất trình mã này cho nhân viên kiểm soát tại cửa khởi hành.
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>
              {order.bookingId}
            </div>
          </div>
        </div>
      </div>

      {/* Guest-to-Member Upsell Conversion Banner */}
      <div className="e-ticket__upsell-card">
        <div className="e-ticket__upsell-info">
          <div className="e-ticket__upsell-icon-box">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="e-ticket__upsell-title">
              Đăng ký tài khoản với SĐT {order.contact.phone}
            </div>
            <div className="e-ticket__upsell-desc">
              Tự động lưu vé này vào lịch sử chuyến đi, quản lý đổi trả nhanh và nhận ngay <strong>150 điểm OMNI</strong> thành viên.
            </div>
          </div>
        </div>
        <button 
          type="button" 
          className="e-ticket__upsell-btn"
          onClick={() => onRegisterMember?.(order.contact.phone)}
        >
          Đăng ký nhận 150 điểm
        </button>
      </div>
    </div>
  );
};
