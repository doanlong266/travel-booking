import React from 'react';
import { Sparkles, Gift, Lock, ChevronRight } from 'lucide-react';
import type { IRewardItem } from '@/types/rewards.types';

export interface IVoucherCardProps {
  reward: IRewardItem;
  userPoints: number;
  onRedeem: (reward: IRewardItem) => void;
  onViewDetails: (reward: IRewardItem) => void;
}

/**
 * Format string original value to a compact, single-line representation
 * e.g. "50.000 VNĐ" -> "50.000đ"
 */
const formatValue = (val: string): string => {
  if (!val) return '';
  return val.replace(/\s*VNĐ/i, 'đ').trim();
};

export const VoucherCard: React.FC<IVoucherCardProps> = ({
  reward,
  userPoints,
  onRedeem,
  onViewDetails,
}) => {
  const canAfford = userPoints >= reward.pointsCost;
  const neededPoints = reward.pointsCost - userPoints;

  return (
    <div className={`voucher-card ${!canAfford ? 'voucher-card--locked' : ''}`}>
      {/* 1. 16:9 Image Media with Top Badges */}
      <div
        className="voucher-card__media"
        onClick={() => onViewDetails(reward)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onViewDetails(reward);
          }
        }}
        title="Bấm để xem chi tiết điều kiện áp dụng"
      >
        <img
          src={reward.image}
          alt={reward.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
          }}
        />
        {/* Brand Pill on Top-Left */}
        <span className="voucher-card__brand-pill">{reward.brand}</span>

        {/* Status Tag on Top-Right */}
        {reward.badge && (
          <span className="voucher-card__status-badge">{reward.badge}</span>
        )}
      </div>

      {/* 2. Card Body */}
      <div className="voucher-card__body">
        <div className="voucher-card__brand">{reward.brand}</div>
        <h4
          className="voucher-card__title"
          title={reward.title}
          onClick={() => onViewDetails(reward)}
        >
          {reward.title}
        </h4>
        <p className="voucher-card__desc" title={reward.description}>
          {reward.description}
        </p>

        {/* Detail Trigger Link */}
        <button
          type="button"
          className="voucher-card__detail-link"
          onClick={() => onViewDetails(reward)}
        >
          <span>Chi tiết áp dụng</span>
          <ChevronRight size={14} />
        </button>

        {/* Ticket Cutout Divider */}
        <div className="voucher-card__divider">
          <span className="voucher-card__notch voucher-card__notch--left" />
          <span className="voucher-card__dash" />
          <span className="voucher-card__notch voucher-card__notch--right" />
        </div>

        {/* 3. Redesigned 2-Row Footer */}
        <div className="voucher-card__footer">
          {/* Row 1: Pricing Row (Value on Left, Points on Right) */}
          <div className="voucher-card__pricing-row">
            <div className="voucher-card__val-wrap">
              <span className="voucher-card__val-text">
                Trị giá: <strong className="voucher-card__val-num">{formatValue(reward.originalValue)}</strong>
              </span>
            </div>

            <div className="voucher-card__points-badge">
              <Sparkles size={12} />
              <span>{reward.pointsCost.toLocaleString('vi-VN')} pts</span>
            </div>
          </div>

          {/* Row 2: Full-Width Action Button */}
          {canAfford ? (
            <button
              type="button"
              className="voucher-card__action-btn voucher-card__action-btn--active"
              onClick={() => onRedeem(reward)}
            >
              <Gift size={14} />
              <span>Đổi quà ngay</span>
            </button>
          ) : (
            <button
              type="button"
              className="voucher-card__action-btn voucher-card__action-btn--disabled"
              onClick={() => onRedeem(reward)}
              title={`Cần thêm ${neededPoints.toLocaleString('vi-VN')} điểm`}
            >
              <Lock size={13} />
              <span>Thiếu {neededPoints.toLocaleString('vi-VN')} pts</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
