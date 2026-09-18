import React, { useState } from 'react';
import { Modal } from 'antd';
import {
  Gift,
  Sparkles,
  Info,
  MousePointerClick,
  Fingerprint,
} from 'lucide-react';
import type { IRewardItem } from '@/types/rewards.types';
import { FillConfirmButton } from '@/components/common/FillConfirmButton';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';

export interface RedeemRewardModalProps {
  open: boolean;
  reward: IRewardItem | null;
  userPoints: number;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isRedeeming: boolean;
}

export const RedeemRewardModal: React.FC<RedeemRewardModalProps> = ({
  open,
  reward,
  userPoints,
  onClose,
  onConfirm,
  isRedeeming,
}) => {
  // Mode: false = Click-to-Fill (1.2s), true = Hold-to-Confirm (1.5s)
  const [isHoldMode, setIsHoldMode] = useState<boolean>(false);
  // Real-time fill progress (0 to 1) to synchronize AnimatedCounter
  const [fillProgress, setFillProgress] = useState<number>(0);

  // Reset progress when open state changes
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) {
      setFillProgress(0);
    }
  }

  if (!reward) return null;

  const pointsCost = reward.pointsCost;
  const canAfford = userPoints >= pointsCost;
  const balanceAfter = userPoints - pointsCost;

  return (
    <Modal
      open={open}
      onCancel={() => !isRedeeming && onClose()}
      footer={null}
      width={540}
      centered
      destroyOnClose
      zIndex={1100}
      className="tab-rewards__confirm-modal"
    >
      <div className="tab-rewards__modal-content">
        {/* Modal Header */}
        <div className="tab-rewards__modal-header">
          <div className="tab-rewards__modal-icon-wrap">
            <Gift size={24} color="#f59e0b" />
          </div>
          <h3 className="tab-rewards__modal-title">Xác Nhận Đổi Quà Tặng</h3>
          <p className="tab-rewards__modal-subtitle">
            Bạn sắp sử dụng điểm thưởng thành viên OMNI để nhận voucher điện tử này.
          </p>
        </div>

        {/* Reward Summary Box */}
        <div className="tab-rewards__modal-item-box">
          <img
            src={reward.image}
            alt={reward.title}
            className="tab-rewards__modal-item-thumb"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="tab-rewards__modal-item-info">
            <span className="tab-rewards__modal-item-brand">{reward.brand}</span>
            <h4 className="tab-rewards__modal-item-title">{reward.title}</h4>
            <div className="tab-rewards__modal-item-cost">
              <Sparkles size={14} />
              <span>{reward.pointsCost.toLocaleString('vi-VN')} điểm OMNI</span>
            </div>
          </div>
        </div>

        {/* Mode Switcher: Click-to-Fill vs Hold-to-Confirm */}
        <div className="tab-rewards__mode-switcher">
          <span className="tab-rewards__mode-label">Phương thức xác nhận:</span>
          <div className="tab-rewards__mode-pills">
            <button
              type="button"
              className={`tab-rewards__mode-pill ${!isHoldMode ? 'tab-rewards__mode-pill--active' : ''}`}
              onClick={() => setIsHoldMode(false)}
            >
              <MousePointerClick size={13} />
              <span>1-Chạm (1.2s)</span>
            </button>
            <button
              type="button"
              className={`tab-rewards__mode-pill ${isHoldMode ? 'tab-rewards__mode-pill--active' : ''}`}
              onClick={() => setIsHoldMode(true)}
            >
              <Fingerprint size={13} />
              <span>Nhấn Giữ (1.5s)</span>
            </button>
          </div>
        </div>

        {/* Points Math Calculations with Real-time Animated Number Counter */}
        <div className="tab-rewards__modal-calc">
          <div className="tab-rewards__calc-row">
            <span>Số điểm hiện có:</span>
            <strong>{userPoints.toLocaleString('vi-VN')} pts</strong>
          </div>
          <div className="tab-rewards__calc-row tab-rewards__calc-row--deduct">
            <span>Điểm quy đổi quà này:</span>
            <strong>-{pointsCost.toLocaleString('vi-VN')} pts</strong>
          </div>
          <div className="tab-rewards__calc-divider" />
          <div className="tab-rewards__calc-row tab-rewards__calc-row--balance">
            <span>Số dư điểm còn lại:</span>
            <strong className="tab-rewards__calc-balance-val">
              <AnimatedCounter
                from={userPoints}
                to={balanceAfter}
                progress={fillProgress}
                suffix="pts"
              />
            </strong>
          </div>
        </div>

        {/* Terms of use */}
        <div className="tab-rewards__modal-terms">
          <div className="tab-rewards__terms-header">
            <Info size={14} />
            <span>Điều kiện & Điều khoản áp dụng:</span>
          </div>
          <ul className="tab-rewards__terms-list">
            {reward.terms.map((term, i) => (
              <li key={i}>{term}</li>
            ))}
          </ul>
        </div>

        {/* Modal Actions with FillConfirmButton */}
        <div className="tab-rewards__modal-actions">
          <button
            type="button"
            className="tab-rewards__modal-btn-cancel"
            onClick={onClose}
            disabled={isRedeeming}
          >
            Hủy bỏ
          </button>

          <div style={{ flex: 2 }}>
            <FillConfirmButton
              onComplete={onConfirm}
              duration={1.2}
              holdDuration={1.5}
              holdToConfirm={isHoldMode}
              label={isHoldMode ? 'Giữ Để Xác Nhận Đổi' : 'Xác Nhận Đổi Ngay'}
              icon={isHoldMode ? <Fingerprint size={16} /> : <Sparkles size={16} />}
              fillingLabel={
                isHoldMode ? undefined : 'Đang xử lý đổi điểm...'
              }
              successLabel="Đổi Quà Thành Công!"
              disabled={isRedeeming || !canAfford}
              onProgressChange={setFillProgress}
              enableConfetti
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
