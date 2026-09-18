import React, { useState, useEffect } from 'react';
import { Modal, Steps, Select, Input, Radio, message } from 'antd';
import {
  RotateCcw,
  Search,
  Ticket,
  Clock,
  Coins,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Copy,
  Printer,
  Plane,
  Train
} from 'lucide-react';
import { useTicketRefund } from '../../hooks/useTicketRefund';
import { CarrierLogo } from '../../../../components/common/CarrierLogo';
import type { IGuestBookingOrder } from '../../../../types/guestLookup.types';
import './FastRefundModal.scss';

interface FastRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledOrder?: IGuestBookingOrder | null;
  onOpenPolicyDrawer?: () => void;
}

const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const BANK_OPTIONS = [
  { value: 'VCB', label: 'Vietcombank (Ngân hàng Ngoại Thương)' },
  { value: 'MB', label: 'MB Bank (Ngân hàng Quân Đội)' },
  { value: 'TCB', label: 'Techcombank (Ngân hàng Kỹ Thương)' },
  { value: 'ACB', label: 'ACB (Ngân hàng Á Châu)' },
  { value: 'BIDV', label: 'BIDV (Ngân hàng Đầu tư & Phát triển)' },
  { value: 'CTG', label: 'VietinBank (Ngân hàng Công Thương)' },
  { value: 'VPB', label: 'VPBank (Ngân hàng Việt Nam Thịnh Vượng)' },
  { value: 'TPB', label: 'TPBank (Ngân hàng Tiên Phong)' }
];

export const FastRefundModal: React.FC<FastRefundModalProps> = ({
  isOpen,
  onClose,
  prefilledOrder,
  onOpenPolicyDrawer
}) => {
  const {
    currentStep,
    selectedOrder,
    calculation,
    refundMethod,
    bankInfo,
    reason,
    createdRequest,
    isLoading,
    error,
    lookupTicketForRefund,
    selectOrderDirectly,
    setRefundMethod,
    setBankInfo,
    setReason,
    nextStep,
    prevStep,
    submitRefund,
    reset
  } = useTicketRefund();

  const [ticketIdInput, setTicketIdInput] = useState('');
  const [identifierInput, setIdentifierInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (prefilledOrder) {
        selectOrderDirectly(prefilledOrder);
        setTicketIdInput(prefilledOrder.bookingId);
        setIdentifierInput(prefilledOrder.contact.phone || prefilledOrder.contact.email);
      }
    } else {
      reset();
      setTicketIdInput('');
      setIdentifierInput('');
    }
  }, [isOpen, prefilledOrder, selectOrderDirectly, reset]);

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await lookupTicketForRefund(ticketIdInput, identifierInput);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success(`Đã sao chép mã ${code}`);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={760}
      centered
      destroyOnClose
      className="fast-refund-modal-dialog"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold' }}>
          <RotateCcw size={20} color="var(--color-primary, #0ea5e9)" />
          <span>Cổng Tự Động Hoàn & Đổi Vé Siêu Tốc</span>
        </div>
      }
    >
      <div className="refund-portal">
        {/* Antd Steps Navigation */}
        <div className="refund-portal__steps-wrap">
          <Steps
            current={currentStep}
            size="small"
            items={[
              { title: 'Nhận diện & Tính phí' },
              { title: 'Phương thức nhận tiền' },
              { title: 'Tiến độ hoàn vé' }
            ]}
          />
        </div>

        {error && (
          <div className="guest-lookup__error-alert" style={{ marginBottom: 0 }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        {/* STEP 1: TICKET LOOKUP & INSTANT ESTIMATOR */}
        {currentStep === 0 && (
          <div className="refund-portal__lookup-section">
            {!selectedOrder ? (
              <form onSubmit={handleLookupSubmit} className="guest-lookup__form">
                <div className="guest-lookup__form-group">
                  <label className="guest-lookup__label" htmlFor="refund-ticket-id">
                    <Ticket size={15} color="var(--color-primary, #0ea5e9)" /> Mã Đặt Vé (Ticket ID / PNR) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="refund-ticket-id"
                    type="text"
                    className="guest-lookup__input guest-lookup__input--uppercase"
                    placeholder="Ví dụ: TKT-VN-2026-89412X"
                    value={ticketIdInput}
                    onChange={e => setTicketIdInput(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="guest-lookup__form-group">
                  <label className="guest-lookup__label" htmlFor="refund-ident">
                    <Search size={15} color="var(--color-primary, #0ea5e9)" /> Số Điện Thoại / Email Đặt Vé <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="refund-ident"
                    type="text"
                    className="guest-lookup__input"
                    placeholder="Ví dụ: 0912345678"
                    value={identifierInput}
                    onChange={e => setIdentifierInput(e.target.value)}
                  />
                </div>

                <div className="guest-lookup__quick-samples">
                  <span className="guest-lookup__quick-title">Thử nhanh vé mẫu kiểm thử:</span>
                    <div className="guest-lookup__quick-chips">
                      <button
                        type="button"
                        className="guest-lookup__chip"
                        onClick={() => {
                          setTicketIdInput('TKT-VN-2026-89412X');
                          setIdentifierInput('0912345678');
                        }}
                      >
                        <Plane size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '5px', color: 'var(--color-primary)' }} />
                        Vietnam Airlines (HAN-SGN)
                      </button>
                      <button
                        type="button"
                        className="guest-lookup__chip"
                        onClick={() => {
                          setTicketIdInput('TKT-TRAIN-2026-44810A');
                          setIdentifierInput('0987654321');
                        }}
                      >
                        <Train size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '5px', color: 'var(--color-primary)' }} />
                        Tàu SE1 (HAN-DAD)
                      </button>
                    </div>
                </div>

                <button
                  type="submit"
                  className="guest-lookup__submit-btn"
                  disabled={isLoading}
                >
                  <Search size={18} /> {isLoading ? 'Đang tính toán chính sách...' : 'Kiểm Tra & Tính Phí Hoàn'}
                </button>
              </form>
            ) : calculation ? (
              <div className="refund-portal__calc-card">
                {/* Header Ticket summary */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CarrierLogo
                      carrier={selectedOrder.carrierId}
                      name={selectedOrder.carrierName}
                      code={selectedOrder.carrierCode}
                      size="sm"
                    />
                    <div>
                      <strong style={{ fontSize: '14px' }}>{selectedOrder.carrierName} ({selectedOrder.pnrCode})</strong>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {selectedOrder.origin.city} ({selectedOrder.origin.code}) → {selectedOrder.destination.city} ({selectedOrder.destination.code})
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => selectOrderDirectly(null as any)}
                  >
                    Đổi vé khác
                  </button>
                </div>

                {/* Time Remaining Badge */}
                <div className={`refund-portal__time-banner ${!calculation.isEligible ? 'refund-portal__time-banner--ineligible' : calculation.hoursRemaining < 24 ? 'refund-portal__time-banner--urgent' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} />
                    <span>Thời gian còn lại trước giờ khởi hành: <strong>{calculation.hoursRemaining} giờ</strong></span>
                  </div>
                  <span>{calculation.isEligible ? 'Đủ điều kiện hoàn tự động' : 'Cận giờ khởi hành'}</span>
                </div>

                {/* Calculation Breakdown */}
                <div className="refund-portal__breakdown">
                  <div className="refund-portal__breakdown-row">
                    <span>Giá vé ban đầu ({selectedOrder.passengers.length} hành khách):</span>
                    <strong>{formatPrice(calculation.ticketPrice)}</strong>
                  </div>

                  <div className="refund-portal__breakdown-row">
                    <span>Mức phí khấu trừ ({calculation.feePercentage}% theo quy định hãng):</span>
                    <span style={{ color: '#ea580c' }}>- {formatPrice(calculation.totalFeeAmount)}</span>
                  </div>

                  {calculation.fixedFee > 0 && (
                    <div className="refund-portal__breakdown-row">
                      <span>Phí dịch vụ cố định:</span>
                      <span style={{ color: '#ea580c' }}>- {formatPrice(calculation.fixedFee)}</span>
                    </div>
                  )}

                  <div className="refund-portal__breakdown-row refund-portal__breakdown-row--total">
                    <span>Số tiền thực nhận:</span>
                    <span className="refund-portal__net-amount">{formatPrice(calculation.netRefundAmount)}</span>
                  </div>
                </div>

                {/* Policy explanation */}
                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{calculation.ruleApplied}</span>
                  {onOpenPolicyDrawer && (
                    <button
                      type="button"
                      onClick={onOpenPolicyDrawer}
                      style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Xem chi tiết quy định
                    </button>
                  )}
                </div>

                {!calculation.isEligible && (
                  <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '12.5px' }}>
                    Vé này còn dưới 4 giờ trước khởi hành. Vui lòng gọi trực tiếp Hotline <strong>1900 6868</strong> để được hỗ trợ thủ công khẩn cấp tại sân bay / nhà ga.
                  </div>
                )}
              </div>
            ) : null}

            {selectedOrder && calculation && calculation.isEligible && (
              <div className="refund-portal__footer-actions">
                <button
                  type="button"
                  className="guest-lookup__submit-btn"
                  style={{ width: 'auto', padding: '10px 24px' }}
                  onClick={nextStep}
                >
                  Chọn Phương Thức Hoàn Tiền <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CHOOSE REFUND METHOD */}
        {currentStep === 1 && calculation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="refund-portal__methods-grid">
              {/* Option 1: Fast Bank Transfer */}
              <div
                className={`refund-portal__method-card ${refundMethod === 'bank_transfer' ? 'refund-portal__method-card--active' : ''}`}
                onClick={() => setRefundMethod('bank_transfer')}
              >
                <div className="refund-portal__method-header">
                  <div className="refund-portal__method-icon-box">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="refund-portal__method-title">Tài Khoản Ngân Hàng / VietQR</div>
                    <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Cam kết 15 - 30 phút</span>
                  </div>
                </div>
                <p className="refund-portal__method-desc">
                  Tiền hoàn <strong>{formatPrice(calculation.netRefundAmount)}</strong> sẽ được chuyển khoản trực tiếp vào số tài khoản ngân hàng của bạn.
                </p>
              </div>

              {/* Option 2: Omni Points with +10% Bonus */}
              <div
                className={`refund-portal__method-card refund-portal__method-card--points ${refundMethod === 'omni_points' ? 'refund-portal__method-card--active' : ''}`}
                onClick={() => setRefundMethod('omni_points')}
              >
                <span className="refund-portal__method-badge">
                  <Sparkles size={11} style={{ display: 'inline', marginRight: '3px' }} /> +10% THƯỞNG
                </span>
                <div className="refund-portal__method-header">
                  <div className="refund-portal__method-icon-box refund-portal__method-icon-box--points">
                    <Coins size={20} />
                  </div>
                  <div>
                    <div className="refund-portal__method-title">Điểm Thưởng OMNI</div>
                    <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Cộng ngay tức thì</span>
                  </div>
                </div>
                <p className="refund-portal__method-desc">
                  Nhận ngay <strong>{calculation.bonusPointsAmount.toLocaleString()} OMNI Points</strong> (tặng thêm 10% giá trị) để đặt vé chuyến kế tiếp không cần chờ.
                </p>
              </div>
            </div>

            {/* Bank Form inputs if Bank Transfer selected */}
            {refundMethod === 'bank_transfer' && (
              <div className="refund-portal__bank-form">
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  Thông tin tài khoản nhận tiền hoàn:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Ngân hàng nhận <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <Select
                      style={{ width: '100%' }}
                      options={BANK_OPTIONS}
                      value={bankInfo.bankCode}
                      onChange={(code, opt: any) => setBankInfo(prev => ({ ...prev, bankCode: code, bankName: opt.label }))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Số tài khoản <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <Input
                      placeholder="Nhập số tài khoản ngân hàng"
                      value={bankInfo.accountNumber}
                      onChange={e => setBankInfo(prev => ({ ...prev, accountNumber: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Tên chủ tài khoản (In hoa không dấu) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <Input
                    placeholder="Ví dụ: NGUYEN VAN AN"
                    value={bankInfo.accountHolder}
                    onChange={e => setBankInfo(prev => ({ ...prev, accountHolder: e.target.value.toUpperCase() }))}
                  />
                </div>
              </div>
            )}

            {/* Reason selection */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Lý do yêu cầu hoàn vé:
              </label>
              <Radio.Group value={reason} onChange={e => setReason(e.target.value)}>
                <Radio value="Thay đổi kế hoạch cá nhân">Thay đổi kế hoạch cá nhân</Radio>
                <Radio value="Trùng lịch công tác">Trùng lịch công tác</Radio>
                <Radio value="Lý do sức khỏe">Lý do sức khỏe</Radio>
                <Radio value="Khác">Lý do khác</Radio>
              </Radio.Group>
            </div>

            <div className="refund-portal__footer-actions">
              <button
                type="button"
                className="guest-lookup__tab"
                style={{ width: 'auto', border: '1px solid #cbd5e1' }}
                onClick={prevStep}
              >
                <ArrowLeft size={16} /> Quay lại
              </button>
              <button
                type="button"
                className="guest-lookup__submit-btn"
                style={{ width: 'auto', padding: '10px 24px', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
                onClick={submitRefund}
                disabled={isLoading}
              >
                <CheckCircle2 size={16} /> {isLoading ? 'Đang gửi yêu cầu...' : 'Xác Nhận Hoàn Vé Ngay'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMATION & LIVE STATUS TRACKER */}
        {currentStep === 2 && createdRequest && (
          <div className="refund-portal__tracker-card">
            <div className="refund-portal__success-banner">
              <CheckCircle2 size={28} />
              <div>
                <strong style={{ fontSize: '15px' }}>Yêu cầu hoàn vé đã được gửi thành công!</strong>
                <div style={{ fontSize: '12.5px', marginTop: '2px' }}>
                  Hệ thống đang tự động liên kết với nhà vận chuyển để xử lý lệnh hoàn tiền cho bạn.
                </div>
              </div>
            </div>

            {/* Request code copy box */}
            <div className="refund-portal__request-code-box">
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b' }}>Mã yêu cầu hoàn tiền:</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary, #0ea5e9)', fontFamily: 'monospace' }}>
                  {createdRequest.requestId}
                </div>
              </div>
              <button
                type="button"
                className="guest-lookup__tab"
                style={{ border: '1px solid #cbd5e1', padding: '6px 14px' }}
                onClick={() => handleCopyCode(createdRequest.requestId)}
              >
                <Copy size={14} /> Sao chép mã
              </button>
            </div>

            {/* Live Progress Timeline */}
            <div className="refund-portal__timeline-wrap">
              <Steps
                direction="vertical"
                current={1}
                items={createdRequest.timeline.map(t => ({
                  title: <strong>{t.title}</strong>,
                  description: (
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {t.description}
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{t.timestamp}</div>
                    </div>
                  ),
                  status: t.isCompleted ? 'finish' : t.isCurrent ? 'process' : 'wait'
                }))}
              />
            </div>

            {/* Receipt Summary */}
            <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Mã vé hoàn:</span>
                <strong>{createdRequest.ticketId} ({createdRequest.pnrCode})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Hình thức hoàn:</span>
                <strong>{createdRequest.refundMethod === 'omni_points' ? 'Điểm thưởng OMNI (+10% Bonus)' : `STK ${createdRequest.bankInfo?.accountNumber} (${createdRequest.bankInfo?.bankCode})`}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '6px' }}>
                <span>Số tiền hoàn dự kiến:</span>
                <strong style={{ color: '#16a34a', fontSize: '14px' }}>{formatPrice(createdRequest.calculation.netRefundAmount)}</strong>
              </div>
            </div>

            <div className="refund-portal__footer-actions">
              <button
                type="button"
                className="guest-lookup__tab"
                style={{ border: '1px solid #cbd5e1' }}
                onClick={() => window.print()}
              >
                <Printer size={16} /> In biên nhận
              </button>
              <button
                type="button"
                className="guest-lookup__submit-btn"
                style={{ width: 'auto', padding: '10px 24px' }}
                onClick={onClose}
              >
                Hoàn tất & Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
