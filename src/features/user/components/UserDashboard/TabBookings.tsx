import React, { useState } from 'react';
import { Tag, Button, Modal, message } from 'antd';
import {
  Ticket,
  Calendar,
  QrCode,
  Download,
  AlertTriangle,
  RotateCcw,
  Copy,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '@/context/AuthContext';
import { CarrierLogo } from '@/components/common/CarrierLogo';
import type { IUserBooking } from '@/types/auth.types';

export const TabBookings: React.FC = () => {
  const { userBookings, cancelBooking } = useAuth();
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedBookingForQr, setSelectedBookingForQr] = useState<IUserBooking | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  // Filter bookings
  const filtered = userBookings.filter((b: IUserBooking) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  // Handle Copy Ticket ID
  const handleCopyTicketId = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId);
    message.success(`Đã sao chép mã vé ${ticketId}`);
  };

  // Handle Download PDF Simulation
  const handleDownloadPdf = (booking: IUserBooking) => {
    message.loading({ content: `Đang tạo file PDF vé ${booking.ticketId}...`, key: 'pdf_dl' });
    setTimeout(() => {
      message.success({ content: `Đã tải xuống vé điện tử ${booking.ticketId}.pdf`, key: 'pdf_dl' });
    }, 1000);
  };

  // Handle Cancel Booking
  const handleConfirmCancel = async () => {
    if (!cancellingBookingId) return;
    await cancelBooking(cancellingBookingId);
    setCancellingBookingId(null);
  };

  return (
    <div className="tab-bookings">
      {/* Status Filter Tabs */}
      <div className="tab-bookings__filters">
        <button
          type="button"
          className={`tab-bookings__filter-btn ${filterStatus === 'all' ? 'tab-bookings__filter-btn--active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          Tất cả ({userBookings.length})
        </button>
        <button
          type="button"
          className={`tab-bookings__filter-btn ${filterStatus === 'upcoming' ? 'tab-bookings__filter-btn--active' : ''}`}
          onClick={() => setFilterStatus('upcoming')}
        >
          Sắp khởi hành ({userBookings.filter((b: IUserBooking) => b.status === 'upcoming').length})
        </button>
        <button
          type="button"
          className={`tab-bookings__filter-btn ${filterStatus === 'completed' ? 'tab-bookings__filter-btn--active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          Đã hoàn thành ({userBookings.filter((b: IUserBooking) => b.status === 'completed').length})
        </button>
        <button
          type="button"
          className={`tab-bookings__filter-btn ${filterStatus === 'cancelled' ? 'tab-bookings__filter-btn--active' : ''}`}
          onClick={() => setFilterStatus('cancelled')}
        >
          Đã hủy ({userBookings.filter((b: IUserBooking) => b.status === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="tab-bookings__list">
        {filtered.length === 0 ? (
          <div className="tab-bookings__empty">
            <Ticket size={48} className="tab-bookings__empty-icon" />
            <h4 className="tab-bookings__empty-title">Không có chuyến đi nào</h4>
            <p className="tab-bookings__empty-desc">
              Bạn chưa có vé nào trong mục này. Hãy tìm kiếm lộ trình và đặt vé ngay!
            </p>
          </div>
        ) : (
          filtered.map((booking: IUserBooking) => {
            const isUpcoming = booking.status === 'upcoming';
            const isCompleted = booking.status === 'completed';
            const isCancelled = booking.status === 'cancelled';

            return (
              <div key={booking.id} className={`booking-card booking-card--${booking.status}`}>
                {/* Card Header */}
                <div className="booking-card__header">
                  <div className="booking-card__carrier-info">
                    <CarrierLogo carrier={booking.carrierCode} variant="badge" size="sm" />
                    <div>
                      <strong className="booking-card__carrier-name">{booking.carrierName}</strong>
                      <span className="booking-card__transport-badge">
                        {booking.transportType === 'flight' && 'Vé Máy Bay'}
                        {booking.transportType === 'train' && 'Vé Tàu Hỏa'}
                        {booking.transportType === 'bus' && 'Vé Xe Khách'}
                      </span>
                    </div>
                  </div>

                  <div className="booking-card__id-status">
                    <div
                      className="booking-card__ticket-id"
                      onClick={() => handleCopyTicketId(booking.ticketId)}
                      title="Bấm để sao chép mã vé"
                    >
                      <span>{booking.ticketId}</span>
                      <Copy size={13} />
                    </div>
                    {isUpcoming && <Tag color="blue">Sắp khởi hành</Tag>}
                    {isCompleted && <Tag color="green">Đã hoàn thành</Tag>}
                    {isCancelled && <Tag color="red">Đã hủy & Hoàn tiền</Tag>}
                  </div>
                </div>

                {/* Route Details */}
                <div className="booking-card__route">
                  <div className="booking-card__point">
                    <span className="booking-card__time">{booking.departureTime}</span>
                    <strong className="booking-card__city">{booking.originCity}</strong>
                    <span className="booking-card__station">{booking.originStation}</span>
                  </div>

                  <div className="booking-card__arrow-cluster">
                    <span className="booking-card__date">
                      <Calendar size={13} /> {booking.departureDate}
                    </span>
                    <div className="booking-card__line"></div>
                    <span className="booking-card__seats">
                      Ghế: {booking.seats.join(', ')}
                    </span>
                  </div>

                  <div className="booking-card__point booking-card__point--dest">
                    <span className="booking-card__time">{booking.arrivalTime}</span>
                    <strong className="booking-card__city">{booking.destinationCity}</strong>
                    <span className="booking-card__station">{booking.destinationStation}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="booking-card__footer">
                  <div className="booking-card__price-box">
                    <span className="booking-card__price-label">Tổng thanh toán:</span>
                    <strong className="booking-card__price">
                      {booking.totalPrice.toLocaleString('vi-VN')} đ
                    </strong>
                  </div>

                  <div className="booking-card__actions">
                    {/* QR Code Boarding Pass */}
                    <Button
                      type="default"
                      icon={<QrCode size={15} />}
                      onClick={() => setSelectedBookingForQr(booking)}
                      className="booking-card__btn"
                    >
                      Mã lên xe / QR
                    </Button>

                    {/* Download PDF */}
                    <Button
                      type="default"
                      icon={<Download size={15} />}
                      onClick={() => handleDownloadPdf(booking)}
                      className="booking-card__btn"
                    >
                      Tải PDF
                    </Button>

                    {/* Cancel button if upcoming */}
                    {isUpcoming && (
                      <Button
                        danger
                        type="text"
                        icon={<RotateCcw size={15} />}
                        onClick={() => setCancellingBookingId(booking.id)}
                        className="booking-card__btn booking-card__btn--cancel"
                      >
                        Yêu cầu hoàn vé
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: QR Code Boarding Pass */}
      <Modal
        open={!!selectedBookingForQr}
        onCancel={() => setSelectedBookingForQr(null)}
        footer={null}
        width={380}
        centered
        className="boarding-pass-modal"
      >
        {selectedBookingForQr && (
          <div className="boarding-pass">
            <div className="boarding-pass__header">
              <CarrierLogo carrier={selectedBookingForQr.carrierCode} variant="badge" size="sm" />
              <div className="boarding-pass__header-info">
                <strong>{selectedBookingForQr.carrierName}</strong>
                <span>Vé Điện Tử Hợp Lệ</span>
              </div>
            </div>

            <div className="boarding-pass__qr-box">
              <QRCodeSVG
                value={`OMNITRAVEL|${selectedBookingForQr.ticketId}|${selectedBookingForQr.departureDate}|${selectedBookingForQr.seats.join(',')}`}
                size={180}
                level="H"
                includeMargin
              />
              <span className="boarding-pass__qr-hint">Xuất trình mã này cho nhân viên soát vé</span>
            </div>

            <div className="boarding-pass__details">
              <div className="boarding-pass__row">
                <span>Mã tra cứu:</span>
                <strong>{selectedBookingForQr.ticketId}</strong>
              </div>
              <div className="boarding-pass__row">
                <span>Hành trình:</span>
                <strong>{selectedBookingForQr.originCity} → {selectedBookingForQr.destinationCity}</strong>
              </div>
              <div className="boarding-pass__row">
                <span>Giờ khởi hành:</span>
                <strong>{selectedBookingForQr.departureTime} ({selectedBookingForQr.departureDate})</strong>
              </div>
              <div className="boarding-pass__row">
                <span>Vị trí ghế:</span>
                <strong className="boarding-pass__seat-pill">{selectedBookingForQr.seats.join(', ')}</strong>
              </div>
            </div>

            <Button
              type="primary"
              block
              size="large"
              icon={<Download size={16} />}
              onClick={() => {
                handleDownloadPdf(selectedBookingForQr);
                setSelectedBookingForQr(null);
              }}
              className="boarding-pass__download-btn"
            >
              Lưu Thẻ Lên Tàu / Xe
            </Button>
          </div>
        )}
      </Modal>

      {/* Modal: Cancel Booking Confirmation */}
      <Modal
        open={!!cancellingBookingId}
        onCancel={() => setCancellingBookingId(null)}
        onOk={handleConfirmCancel}
        okText="Xác nhận hủy vé"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
        title="Xác nhận yêu cầu hoàn / hủy vé"
        centered
      >
        <div className="cancel-confirm">
          <div className="cancel-confirm__alert">
            <AlertTriangle size={20} className="cancel-confirm__icon" />
            <div>
              <strong>Lưu ý về chính sách hoàn tiền:</strong>
              <p>
                Theo quy định của nhà vận chuyển và Chính sách hoàn vé OMNITRAVEL, số tiền hoàn
                (sau khi trừ phí hủy theo thời hạn quy định nếu có) sẽ được chuyển khoản tự động
                qua VietQR NAPAS 24/7 trong vòng 1 - 3 ngày làm việc.
              </p>
            </div>
          </div>
          <p className="cancel-confirm__text">
            Bạn có chắc chắn muốn gửi yêu cầu hủy vé cho chuyến đi này không?
          </p>
        </div>
      </Modal>
    </div>
  );
};
