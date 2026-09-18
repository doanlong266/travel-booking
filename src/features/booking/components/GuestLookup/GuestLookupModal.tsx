import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'antd';
import { 
  Search, 
  Ticket, 
  History, 
  Phone, 
  Mail, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Clock,
  Compass,
  Plane,
  Train,
  Bus
} from 'lucide-react';
import type { IGuestBookingOrder, IGuestRecentBooking } from '../../../../types/guestLookup.types';
import { guestLookupService } from '../../../../services/guestLookup.service';
import { useGuestBookingStorage } from '../../hooks/useGuestBookingStorage';
import { ElectronicTicketView } from './ElectronicTicketView';
import { CarrierLogo } from '../../../../components/common/CarrierLogo';
import { SmoothTabs, SmoothTabContent, useTabDirection } from '../../../../components/common/SmoothTabs';
import type { ISmoothTabItem } from '../../../../components/common/SmoothTabs';
import './GuestLookup.scss';

interface GuestLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBookingId?: string;
  onRebook?: (order: IGuestBookingOrder) => void;
  onResumePayment?: (order: IGuestBookingOrder) => void;
  onRegisterMember?: (phone: string) => void;
  onOpenFastRefund?: (order: IGuestBookingOrder) => void;
}

const TAB_KEYS = ['form', 'recent'];

export const GuestLookupModal: React.FC<GuestLookupModalProps> = ({
  isOpen,
  onClose,
  initialBookingId,
  onRebook,
  onResumePayment,
  onRegisterMember,
  onOpenFastRefund
}) => {
  const { recentBookings, refreshStorage } = useGuestBookingStorage();
  
  const [activeTab, setActiveTab] = useState<'form' | 'recent'>('form');
  const [bookingIdInput, setBookingIdInput] = useState(initialBookingId || '');
  const [identifierInput, setIdentifierInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [foundOrder, setFoundOrder] = useState<IGuestBookingOrder | null>(null);

  const { direction } = useTabDirection(activeTab, TAB_KEYS);

  useEffect(() => {
    if (isOpen) {
      refreshStorage();
      if (initialBookingId) {
        setBookingIdInput(initialBookingId);
      }
      setErrorMessage(null);
    } else {
      // reset search state on close if needed
      setFoundOrder(null);
      setErrorMessage(null);
    }
  }, [isOpen, initialBookingId, refreshStorage]);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = bookingIdInput.trim().toUpperCase();
    const cleanIdent = identifierInput.trim();

    if (!cleanId) {
      setErrorMessage('Vui lòng nhập Mã đặt vé (Booking ID / PNR).');
      return;
    }

    if (!cleanIdent) {
      setErrorMessage('Vui lòng nhập Số điện thoại hoặc Email người đặt.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const order = await guestLookupService.lookup(cleanId, cleanIdent);
      if (order) {
        setFoundOrder(order);
      } else {
        setErrorMessage(
          `Không tìm thấy vé "${cleanId}" khớp với thông tin "${cleanIdent}". Vui lòng kiểm tra lại mã vé hoặc SĐT/Email.`
        );
      }
    } catch {
      setErrorMessage('Đã xảy ra lỗi khi kết nối máy chủ tra cứu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecent = async (recent: IGuestRecentBooking) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const order = await guestLookupService.getBookingById(recent.bookingId);
      if (order) {
        setFoundOrder(order);
      } else {
        // Build fallback order from recent item
        const fallbackOrder: IGuestBookingOrder = {
          bookingId: recent.bookingId,
          pnrCode: recent.pnrCode,
          transportType: recent.transportType,
          carrierId: 'vietnam-airlines',
          carrierName: recent.carrierName,
          carrierLogo: recent.carrierLogo,
          carrierCode: 'VN',
          vehicleNumber: 'VN 218',
          vehicleName: 'Phương tiện vận chuyển',
          origin: {
            name: recent.originCity,
            city: recent.originCity,
            code: 'HAN'
          },
          destination: {
            name: recent.destinationCity,
            city: recent.destinationCity,
            code: 'SGN'
          },
          departureTime: recent.departureTime,
          arrivalTime: new Date(new Date(recent.departureTime).getTime() + 2 * 3600 * 1000).toISOString(),
          durationMinutes: 120,
          seatClassName: 'Tiêu chuẩn',
          passengers: [
            {
              fullName: 'HÀNH KHÁCH',
              passengerType: 'adult',
              seatNumber: 'Ghế tiêu chuẩn'
            }
          ],
          contact: {
            fullName: 'Khách hàng vãng lai',
            phone: recent.contactPhone,
            email: recent.contactEmail
          },
          totalAmount: recent.totalAmount,
          paymentStatus: recent.paymentStatus,
          bookingDate: recent.bookedAt,
          qrData: `OMNITICKET|${recent.bookingId}|${recent.pnrCode}`
        };
        setFoundOrder(fallbackOrder);
      }
    } catch {
      setErrorMessage('Không thể tải chi tiết vé này.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseQuickSample = (sampleId: string, samplePhone: string) => {
    setBookingIdInput(sampleId);
    setIdentifierInput(samplePhone);
    setErrorMessage(null);
  };

  const smoothTabItems: ISmoothTabItem[] = useMemo(() => [
    {
      key: 'form',
      label: 'Nhập mã tra cứu',
      icon: <Search size={15} />
    },
    {
      key: 'recent',
      label: 'Vé đã lưu trên máy',
      icon: <History size={15} />,
      badge: recentBookings.length > 0 ? (
        <span className="guest-lookup__tab-badge">{recentBookings.length}</span>
      ) : undefined
    }
  ], [recentBookings.length]);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={foundOrder ? 840 : 580}
      destroyOnClose
      centered
      className="guest-lookup-modal-dialog"
      title={
        foundOrder ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold' }}>
            <Ticket size={20} color="var(--color-primary)" />
            <span>Vé Điện Tử / Thẻ Lên Xe (Boarding Pass)</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold' }}>
            <Search size={20} color="var(--color-primary)" />
            <span>Tra Cứu Vé & Khôi Phục Đơn Hàng</span>
          </div>
        )
      }
    >
      <div className="guest-lookup" style={{ marginTop: '12px' }}>
        {foundOrder ? (
          <ElectronicTicketView
            order={foundOrder}
            onBack={() => setFoundOrder(null)}
            onRebook={onRebook}
            onResumePayment={onResumePayment}
            onRegisterMember={onRegisterMember}
            onOpenFastRefund={onOpenFastRefund}
          />
        ) : (
          <>
            {/* Smooth Spring-Motion Tabs */}
            <SmoothTabs
              variant="pill"
              items={smoothTabItems}
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key as 'form' | 'recent');
                setErrorMessage(null);
              }}
              renderContent={false}
              layoutId="guest-lookup-smooth-tabs"
            />

            {/* Fluid Direction-Aware Tab Content */}
            <SmoothTabContent activeKey={activeTab} direction={direction} enableSmoothHeight>
              {/* Tab 1: Form lookup */}
              {activeTab === 'form' && (
                <form className="guest-lookup__form" onSubmit={handleLookup}>
                  <div className="guest-lookup__form-group">
                    <label className="guest-lookup__label" htmlFor="lookup-booking-id">
                      <Ticket size={15} color="var(--color-primary)" /> Mã Đặt Vé (Booking ID / PNR) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div className="guest-lookup__input-wrap">
                      <Search size={18} className="guest-lookup__input-icon" />
                      <input
                        id="lookup-booking-id"
                        type="text"
                        className="guest-lookup__input guest-lookup__input--uppercase"
                        placeholder="Ví dụ: TKT-VN-2026-89412X hoặc VN89412X"
                        value={bookingIdInput}
                        onChange={(e) => setBookingIdInput(e.target.value.toUpperCase())}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="guest-lookup__form-group">
                    <label className="guest-lookup__label" htmlFor="lookup-phone-email">
                      <Phone size={15} color="var(--color-primary)" /> Số Điện Thoại hoặc Email Đặt Vé <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div className="guest-lookup__input-wrap">
                      <Mail size={18} className="guest-lookup__input-icon" />
                      <input
                        id="lookup-phone-email"
                        type="text"
                        className="guest-lookup__input"
                        placeholder="Ví dụ: 0912345678 hoặc email@domain.vn"
                        value={identifierInput}
                        onChange={(e) => setIdentifierInput(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Quick samples with 100% vector icons */}
                  <div className="guest-lookup__quick-samples">
                    <div className="guest-lookup__quick-title">
                      <Sparkles size={13} style={{ display: 'inline', marginRight: '4px', color: '#f59e0b' }} />
                      Mã vé mẫu kiểm thử nhanh:
                    </div>
                    <div className="guest-lookup__quick-chips">
                      <button
                        type="button"
                        className="guest-lookup__chip"
                        onClick={() => handleUseQuickSample('TKT-VN-2026-89412X', '0912345678')}
                      >
                        <Plane size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '5px', color: 'var(--color-primary)' }} />
                        Vietnam Airlines (HAN-SGN)
                      </button>
                      <button
                        type="button"
                        className="guest-lookup__chip"
                        onClick={() => handleUseQuickSample('TKT-TRAIN-2026-44810A', '0987654321')}
                      >
                        <Train size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '5px', color: 'var(--color-primary)' }} />
                        Tàu SE1 (HAN-DAD)
                      </button>
                      <button
                        type="button"
                        className="guest-lookup__chip"
                        onClick={() => handleUseQuickSample('TKT-BUS-2026-90215F', '0903112233')}
                      >
                        <Bus size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '5px', color: 'var(--color-primary)' }} />
                        FUTA Bus (SGN-CTHO)
                      </button>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="guest-lookup__error-alert">
                      <AlertCircle size={18} style={{ flexShrink: 0 }} />
                      <div>{errorMessage}</div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="guest-lookup__submit-btn"
                    disabled={loading}
                  >
                    <Search size={18} /> {loading ? 'Đang kiểm tra hệ thống...' : 'Tra Cứu Vé Ngay'}
                  </button>
                </form>
              )}

              {/* Tab 2: LocalStorage saved tickets */}
              {activeTab === 'recent' && (
                <div className="guest-lookup__recent-list">
                  {recentBookings.length === 0 ? (
                    <div className="guest-lookup__empty-recent">
                      <Compass size={40} strokeWidth={1.5} />
                      <p>Chưa có thông tin vé nào được lưu trên trình duyệt này.</p>
                    </div>
                  ) : (
                    recentBookings.map((b) => (
                      <div
                        key={b.bookingId}
                        className="guest-lookup__recent-card"
                        onClick={() => handleSelectRecent(b)}
                      >
                        <div className="guest-lookup__recent-header">
                          <div className="guest-lookup__recent-carrier">
                            <CarrierLogo
                              carrier={b.carrierName}
                              name={b.carrierName}
                              size="sm"
                            />
                            <span>{b.carrierName}</span>
                          </div>
                          <span className={`ticket-status-badge ticket-status-badge--${b.paymentStatus}`}>
                            {b.paymentStatus === 'confirmed' ? 'Đã xác nhận' : b.paymentStatus === 'pending_payment' ? 'Chờ thanh toán' : 'Hết hạn'}
                          </span>
                        </div>

                        <div className="guest-lookup__recent-route">
                          {b.routeSummary}
                        </div>

                        <div className="guest-lookup__recent-meta">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} />
                            {new Date(b.departureTime).toLocaleDateString('vi-VN')} {new Date(b.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="guest-lookup__recent-price">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.totalAmount)}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '12px', color: 'var(--color-primary)', fontWeight: '600' }}>
                          Xem chi tiết vé <ArrowRight size={14} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </SmoothTabContent>
          </>
        )}
      </div>
    </Modal>
  );
};
