import React from 'react';
import { Modal } from 'antd';
import {
  Clock,
  MapPin,
  Layers,
  QrCode,
  FileText,
  CheckCircle2,
  Gift,
  Lock,
  Sparkles,
} from 'lucide-react';
import type { IRewardItem } from '@/types/rewards.types';

export interface IVoucherDetailModalProps {
  open: boolean;
  reward: IRewardItem | null;
  userPoints: number;
  onClose: () => void;
  onInitiateRedeem: (reward: IRewardItem) => void;
}

export const VoucherDetailModal: React.FC<IVoucherDetailModalProps> = ({
  open,
  reward,
  userPoints,
  onClose,
  onInitiateRedeem,
}) => {
  if (!reward) return null;

  const canAfford = userPoints >= reward.pointsCost;
  const neededPoints = reward.pointsCost - userPoints;

  const handleRedeemClick = () => {
    onClose();
    onInitiateRedeem(reward);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={620}
      className="voucher-detail-modal"
      destroyOnClose
    >
      {/* 1. Hero Image Banner */}
      <div className="voucher-detail-modal__hero">
        <img src={reward.image} alt={reward.title} />
        <div className="voucher-detail-modal__hero-content">
          <div className="voucher-detail-modal__hero-info">
            <span className="voucher-detail-modal__hero-brand">{reward.brand}</span>
            <h3 className="voucher-detail-modal__hero-title">{reward.title}</h3>
          </div>

          <div className="voucher-detail-modal__hero-points">
            <Sparkles size={15} />
            <span>{reward.pointsCost.toLocaleString('vi-VN')} pts</span>
          </div>
        </div>
      </div>

      {/* 2. Modal Body */}
      <div className="voucher-detail-modal__body">
        {/* Description */}
        <p className="voucher-detail-modal__desc">{reward.description}</p>

        {/* 2x2 Specs Grid */}
        <div className="voucher-detail-modal__specs-grid">
          <div className="voucher-detail-modal__spec-card">
            <div className="voucher-detail-modal__spec-icon">
              <Clock size={16} />
            </div>
            <div className="voucher-detail-modal__spec-details">
              <span className="voucher-detail-modal__spec-label">Thời hạn sử dụng</span>
              <span className="voucher-detail-modal__spec-value">30 – 60 ngày từ ngày đổi</span>
            </div>
          </div>

          <div className="voucher-detail-modal__spec-card">
            <div className="voucher-detail-modal__spec-icon">
              <MapPin size={16} />
            </div>
            <div className="voucher-detail-modal__spec-details">
              <span className="voucher-detail-modal__spec-label">Phạm vi áp dụng</span>
              <span className="voucher-detail-modal__spec-value">Toàn quốc & sân bay</span>
            </div>
          </div>

          <div className="voucher-detail-modal__spec-card">
            <div className="voucher-detail-modal__spec-icon">
              <Layers size={16} />
            </div>
            <div className="voucher-detail-modal__spec-details">
              <span className="voucher-detail-modal__spec-label">Quy định gộp đơn</span>
              <span className="voucher-detail-modal__spec-value">Tối đa 2 voucher / đơn</span>
            </div>
          </div>

          <div className="voucher-detail-modal__spec-card">
            <div className="voucher-detail-modal__spec-icon">
              <QrCode size={16} />
            </div>
            <div className="voucher-detail-modal__spec-details">
              <span className="voucher-detail-modal__spec-label">Phương thức xuất trình</span>
              <span className="voucher-detail-modal__spec-value">Mã Barcode / QR tại quầy</span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions List */}
        <div className="voucher-detail-modal__terms-card">
          <div className="voucher-detail-modal__terms-header">
            <FileText size={16} />
            <span>Điều Kiện & Điều Khoản Áp Dụng</span>
          </div>
          <ul className="voucher-detail-modal__terms-list">
            {reward.terms && reward.terms.length > 0 ? (
              reward.terms.map((term, idx) => <li key={idx}>{term}</li>)
            ) : (
              <>
                <li>Áp dụng cho toàn bộ danh mục của đối tác theo quy định hiện hành.</li>
                <li>Voucher không có giá trị quy đổi thành tiền mặt và không hoàn lại tiền thừa.</li>
                <li>Xuất trình mã voucher điện tử cho nhân viên thu ngân trước khi thanh toán.</li>
              </>
            )}
          </ul>
        </div>

        {/* Steps Guide */}
        <div className="voucher-detail-modal__steps-card">
          <div className="voucher-detail-modal__steps-title">
            <CheckCircle2 size={15} />
            <span>Hướng Dẫn 3 Bước Sử Dụng</span>
          </div>
          <ol className="voucher-detail-modal__steps-list">
            <li>Bấm <strong>"Đổi Quà Ngay"</strong> và xác nhận trừ điểm OMNI khả dụng.</li>
            <li>Nhận mã vạch & mã voucher điện tử tức thì tại tab <strong>"Voucher Đã Đổi"</strong>.</li>
            <li>Xuất trình mã trên điện thoại cho thu ngân tại cửa hàng để được áp dụng giảm giá.</li>
          </ol>
        </div>
      </div>

      {/* 3. Modal Footer */}
      <div className="voucher-detail-modal__footer">
        <button
          type="button"
          className="voucher-detail-modal__btn-close"
          onClick={onClose}
        >
          Đóng
        </button>

        {canAfford ? (
          <button
            type="button"
            className="voucher-detail-modal__btn-redeem"
            onClick={handleRedeemClick}
          >
            <Gift size={15} />
            <span>Đổi Quà Ngay ({reward.pointsCost} pts)</span>
          </button>
        ) : (
          <button
            type="button"
            className="voucher-detail-modal__btn-redeem voucher-detail-modal__btn-redeem--disabled"
            onClick={handleRedeemClick}
          >
            <Lock size={14} />
            <span>Còn thiếu {neededPoints.toLocaleString('vi-VN')} pts</span>
          </button>
        )}
      </div>
    </Modal>
  );
};
