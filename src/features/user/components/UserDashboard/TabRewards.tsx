import React, { useState, useMemo } from 'react';
import { Modal, Input, Select, Switch, Empty, message, Popover } from 'antd';
import {
  Gift,
  Sparkles,
  Coffee,
  Wifi,
  Smartphone,
  Plane,
  Search,
  CheckCircle,
  Copy,
  Clock,
  QrCode,
  Tag as TagIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  History,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Ticket,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { REWARDS_CATALOG, POINTS_TRANSACTIONS_HISTORY } from '@/data/rewardsData';
import type { IRewardItem, IRedeemedVoucher, RewardCategory } from '@/types/rewards.types';
import { SmoothTabs, SmoothTabContent, useTabDirection } from '@/components/common/SmoothTabs';
import type { ISmoothTabItem } from '@/components/common/SmoothTabs';
import { RedeemRewardModal } from './RedeemRewardModal';
import { VoucherCard } from './VoucherCard';
import { VoucherDetailModal } from './VoucherDetailModal';
import { useDragScroll } from '@/hooks/useDragScroll';
import { getMembershipTierInfo } from '@/types/auth.types';

export const TabRewards: React.FC = () => {
  const { user, redeemedVouchers, redeemReward, markVoucherAsUsed } = useAuth();
  const userPoints = user?.rewardPoints || 0;
  const tierInfo = getMembershipTierInfo(user?.membershipTier);

  // Sub-tab view: 'catalog' | 'my_vouchers'
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'my_vouchers'>('catalog');

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'points_asc' | 'points_desc' | 'value_desc'>('popular');
  const [onlyAffordable, setOnlyAffordable] = useState(false);

  // Modal states
  const [selectedReward, setSelectedReward] = useState<IRewardItem | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [newlyRedeemedVoucher, setNewlyRedeemedVoucher] = useState<IRedeemedVoucher | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Detail Modal states
  const [detailReward, setDetailReward] = useState<IRewardItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleOpenDetails = (reward: IRewardItem) => {
    setDetailReward(reward);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailModalOpen(false);
  };

  // Copied code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Direction-aware transitions for subtabs
  const { direction: subTabDirection } = useTabDirection(activeSubTab, ['catalog', 'my_vouchers']);

  // Drag & Swipe scroll for category pills
  const {
    sliderRef: pillsSliderRef,
    isDragging: isPillsDragging,
    hasMoved: hasPillsMoved,
    canScrollLeft: canPillsScrollLeft,
    canScrollRight: canPillsScrollRight,
    onMouseDown: handlePillsMouseDown,
    onScroll: handlePillsScroll,
    scrollToActive: scrollPillToActive,
    scrollPrev: handlePillsScrollPrev,
    scrollNext: handlePillsScrollNext,
  } = useDragScroll<HTMLDivElement>({ dragSpeed: 1.4 });

  // Smooth tab item definitions
  const subTabItems: ISmoothTabItem[] = useMemo(
    () => [
      {
        key: 'catalog',
        label: 'Kho Ưu Đãi',
        icon: <Gift size={16} />,
        badge: REWARDS_CATALOG.length,
      },
      {
        key: 'my_vouchers',
        label: 'Voucher Đã Đổi',
        icon: <TagIcon size={16} />,
        badge: redeemedVouchers.length > 0 ? redeemedVouchers.length : undefined,
      },
    ],
    [redeemedVouchers.length]
  );

  // Category definitions with counts
  const CATEGORIES: { key: RewardCategory; label: string; icon: React.ReactNode; count: number }[] = useMemo(() => [
    { key: 'all', label: 'Tất cả', icon: <Sparkles size={13} />, count: REWARDS_CATALOG.length },
    { key: 'fnb', label: 'Cà phê & Đồ uống', icon: <Coffee size={13} />, count: REWARDS_CATALOG.filter((r) => r.category === 'fnb').length },
    { key: 'data', label: 'Data 4G/5G', icon: <Wifi size={13} />, count: REWARDS_CATALOG.filter((r) => r.category === 'data').length },
    { key: 'topup', label: 'Nạp thẻ ĐT', icon: <Smartphone size={13} />, count: REWARDS_CATALOG.filter((r) => r.category === 'topup').length },
    { key: 'travel', label: 'Du lịch & Phòng chờ', icon: <Plane size={13} />, count: REWARDS_CATALOG.filter((r) => r.category === 'travel').length },
  ], []);


  // Filtered & Sorted Catalog
  const filteredCatalog = useMemo(() => {
    return REWARDS_CATALOG.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Affordable filter
      if (onlyAffordable && item.pointsCost > userPoints) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchBrand = item.brand.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'points_asc') return a.pointsCost - b.pointsCost;
      if (sortBy === 'points_desc') return b.pointsCost - a.pointsCost;
      if (sortBy === 'value_desc') {
        const parseVal = (str: string) => parseInt(str.replace(/\D/g, ''), 10) || 0;
        return parseVal(b.originalValue) - parseVal(a.originalValue);
      }
      return 0; // 'popular'
    });
  }, [selectedCategory, onlyAffordable, searchQuery, sortBy, userPoints]);

  // Handle open confirm redemption modal
  const handleInitiateRedeem = (reward: IRewardItem) => {
    if (userPoints < reward.pointsCost) {
      const diff = (reward.pointsCost - userPoints).toLocaleString('vi-VN');
      message.warning(`Bạn còn thiếu ${diff} điểm để đổi quà này. Hãy tích thêm điểm qua các chuyến đi nhé!`);
      return;
    }
    setSelectedReward(reward);
    setIsConfirmModalOpen(true);
  };

  // Execute redemption
  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    setIsRedeeming(true);
    try {
      const voucher = await redeemReward(selectedReward);
      if (voucher) {
        setIsConfirmModalOpen(false);
        setNewlyRedeemedVoucher(voucher);
        setIsSuccessModalOpen(true);
      }
    } finally {
      setIsRedeeming(false);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    message.success(`Đã sao chép mã voucher: ${code}`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  return (
    <div className="rewards-view">
      {/* ========================================================================= */}
      {/* 1. SINGLE LOYALTY HEADER BANNER (GOM ĐIỂM VỀ 1 VỊ TRÍ DUY NHẤT)           */}
      {/* ========================================================================= */}
      <div className="rewards-view__loyalty-banner">
        {/* Left: Points counter */}
        <div className="rewards-view__banner-points">
          <div className="rewards-view__points-badge">
            <Sparkles size={15} />
            <span>Điểm OMNI khả dụng</span>
          </div>
          <div className="rewards-view__points-val-row">
            <span className="rewards-view__points-val">{userPoints.toLocaleString('vi-VN')}</span>
            <span className="rewards-view__points-unit">pts</span>
          </div>
        </div>

        {/* Center: Membership tier progress */}
        <div className="rewards-view__banner-tier">
          <div className="rewards-view__tier-top">
            <div className="rewards-view__tier-chip" style={{ background: tierInfo.bg }}>
              <Award size={14} />
              <span>{tierInfo.label}</span>
            </div>
            <span className="rewards-view__tier-target">Tiến trình lên {tierInfo.nextTier}</span>
          </div>
          <div className="rewards-view__tier-track">
            <div className="rewards-view__tier-fill" style={{ width: '65%' }} />
          </div>
          <span className="rewards-view__tier-hint">
            Cần tích lũy thêm <strong>{tierInfo.needed.toLocaleString('vi-VN')} điểm</strong> để thăng {tierInfo.nextTier} và mở khóa phòng chờ VIP miễn phí
          </span>
        </div>

        {/* Right: History button */}
        <div className="rewards-view__banner-action">
          <button
            type="button"
            className="rewards-view__history-btn"
            onClick={() => setIsHistoryModalOpen(true)}
          >
            <History size={16} />
            <span>Lịch sử điểm thưởng</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. UNIFIED STICKY FILTER BAR (HỢP NHẤT TẦNG TABS & BỘ LỌC)                */}
      {/* ========================================================================= */}
      <div className="rewards-view__filter-bar">
        {/* Row 1: SubTabs Switcher (Left) + Search (Right) */}
        <div className="rewards-view__filter-row rewards-view__filter-row--top">
          {/* Segments switcher with spring physics motion */}
          <div className="rewards-view__segments-wrap">
            <SmoothTabs
              variant="pill"
              items={subTabItems}
              activeKey={activeSubTab}
              onChange={(key) => setActiveSubTab(key as 'catalog' | 'my_vouchers')}
              renderContent={false}
              layoutId="rewards-filter-segments"
            />
          </div>

          {/* Search box on right */}
          <div className="rewards-view__search-wrap">
            <Input
              prefix={<Search size={15} style={{ color: 'var(--color-neutral-400)' }} />}
              placeholder={activeSubTab === 'catalog' ? 'Tìm thương hiệu, dịch vụ...' : 'Tìm voucher đã đổi...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              className="rewards-view__search-input"
            />
          </div>
        </div>

        {/* Row 2: Category Pills (Left) + Sort & Toggle (Right) */}
        {activeSubTab === 'catalog' && (
          <div className="rewards-view__filter-row rewards-view__filter-row--bottom">
            {/* Drag & Swipe Scrollable Category Pills with Prev/Next Navigation */}
            <div className="rewards-view__pills-wrapper">
              {canPillsScrollLeft && (
                <div className="rewards-view__pills-edge rewards-view__pills-edge--left">
                  <button
                    type="button"
                    className="rewards-view__pills-nav-btn rewards-view__pills-nav-btn--prev"
                    onClick={() => handlePillsScrollPrev(160)}
                    aria-label="Cuộn sang trái"
                    title="Xem danh mục trước"
                  >
                    <ChevronLeft size={13} strokeWidth={2.5} />
                  </button>
                </div>
              )}

              <div
                ref={pillsSliderRef}
                className={`rewards-view__pills-slider ${
                  isPillsDragging ? 'rewards-view__pills-slider--dragging' : ''
                }`}
                onMouseDown={handlePillsMouseDown}
                onScroll={handlePillsScroll}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    className={`rewards-view__pill-btn ${
                      selectedCategory === cat.key ? 'rewards-view__pill-btn--active' : ''
                    }`}
                    onClick={(e) => {
                      if (hasPillsMoved) return;
                      setSelectedCategory(cat.key);
                      scrollPillToActive(e.currentTarget);
                    }}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                    <span className="rewards-view__pill-count">({cat.count})</span>
                  </button>
                ))}
              </div>

              {canPillsScrollRight && (
                <div className="rewards-view__pills-edge rewards-view__pills-edge--right">
                  <button
                    type="button"
                    className="rewards-view__pills-nav-btn rewards-view__pills-nav-btn--next"
                    onClick={() => handlePillsScrollNext(160)}
                    aria-label="Cuộn sang phải"
                    title="Xem danh mục tiếp theo"
                  >
                    <ChevronRight size={13} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>


            {/* Filter Actions: Sort Dropdown + Divider + Only Affordable Switch */}
            <div className="rewards-view__filter-actions">
              {/* Sort dropdown */}
              <div className="rewards-view__sort-wrap">
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 145 }}
                  options={[
                    { value: 'popular', label: 'Phổ biến nhất' },
                    { value: 'points_asc', label: 'Điểm: Thấp → Cao' },
                    { value: 'points_desc', label: 'Điểm: Cao → Thấp' },
                    { value: 'value_desc', label: 'Trị giá cao nhất' },
                  ]}
                />

              </div>

              {/* Vertical divider */}
              <span className="rewards-view__filter-divider" />

              {/* Only Affordable Switch */}
              <label className="rewards-view__toggle-label" title="Chỉ hiển thị các quà tặng trong tầm điểm hiện có">
                <Switch
                  size="small"
                  checked={onlyAffordable}
                  onChange={setOnlyAffordable}
                />
                <span>Đủ điểm</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. FLUID DIRECTION-AWARE TAB CONTENT WITH SMOOTH HEIGHT RESIZING          */}
      {/* ========================================================================= */}
      <SmoothTabContent
        activeKey={activeSubTab}
        direction={subTabDirection}
        enableSmoothHeight={false}
        className="rewards-view__content-motion-wrapper"
      >
        {activeSubTab === 'catalog' ? (
          <div className="rewards-view__catalog">
          {filteredCatalog.length === 0 ? (
            <div className="rewards-view__empty">
              <Empty description="Không tìm thấy voucher quà tặng phù hợp với tiêu chí lọc" />
            </div>
          ) : (
            <div className="rewards-grid-wrapper">
              <div className="rewards-view__grid">
                {filteredCatalog.map((reward) => (
                  <VoucherCard
                    key={reward.id}
                    reward={reward}
                    userPoints={userPoints}
                    onRedeem={handleInitiateRedeem}
                    onViewDetails={handleOpenDetails}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

      ) : (
        <div className="rewards-view__wallet">
          {redeemedVouchers.length === 0 ? (
            <div className="rewards-view__wallet-empty">
              <div className="rewards-view__wallet-empty-icon">
                <TagIcon size={44} />
              </div>
              <h3>Ví voucher của bạn đang trống</h3>
              <p>Bạn chưa đổi ưu đãi nào. Hãy khám phá kho quà tặng và sử dụng điểm tích lũy ngay!</p>
              <button
                type="button"
                className="rewards-view__wallet-empty-btn"
                onClick={() => setActiveSubTab('catalog')}
              >
                <Sparkles size={16} />
                <span>Khám phá kho quà tặng ngay</span>
              </button>
            </div>
          ) : (
            <div className="rewards-view__wallet-list">
              {redeemedVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className={`rewards-view__voucher-item ${
                    voucher.status === 'used' ? 'rewards-view__voucher-item--used' : ''
                  }`}
                >
                  {/* Left Ticket Stub */}
                  <div className="rewards-view__voucher-stub">
                    <div className="rewards-view__stub-icon">
                      <Ticket size={24} />
                    </div>
                    <span className="rewards-view__stub-pts">-{voucher.pointsSpent} pts</span>
                  </div>

                  {/* Main Voucher Info */}
                  <div className="rewards-view__voucher-content">
                    <div className="rewards-view__voucher-header">
                      <span className="rewards-view__voucher-brand">{voucher.brand}</span>
                      {voucher.status === 'active' ? (
                        <span className="rewards-view__status-tag rewards-view__status-tag--active">
                          Còn hạn sử dụng
                        </span>
                      ) : (
                        <span className="rewards-view__status-tag rewards-view__status-tag--used">
                          Đã sử dụng
                        </span>
                      )}
                    </div>

                    <h4 className="rewards-view__voucher-title">{voucher.rewardTitle}</h4>

                    {/* Voucher Code Box */}
                    <div className="rewards-view__voucher-code-row">
                      <div className="rewards-view__code-badge">
                        <span className="rewards-view__code-lbl">MÃ VOUCHER:</span>
                        <code className="rewards-view__code-text">{voucher.code}</code>
                      </div>

                      <button
                        type="button"
                        className="rewards-view__code-btn"
                        onClick={() => handleCopyCode(voucher.code)}
                      >
                        {copiedCode === voucher.code ? (
                          <>
                            <Check size={13} color="#16a34a" />
                            <span>Đã sao chép</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Sao chép</span>
                          </>
                        )}
                      </button>

                      <Popover
                        content={
                          <div className="rewards-view__popover-barcode">
                            <div className="rewards-view__barcode-graphic" />
                            <span className="rewards-view__barcode-num">{voucher.barcode}</span>
                            <span className="rewards-view__barcode-hint">
                              Đưa mã vạch này cho nhân viên quét tại quầy
                            </span>
                          </div>
                        }
                        title="Mã Vạch Quét Tại Quầy"
                        trigger="click"
                      >
                        <button type="button" className="rewards-view__code-btn">
                          <QrCode size={13} />
                          <span>Mã vạch</span>
                        </button>
                      </Popover>
                    </div>

                    {/* Dates & Expiry */}
                    <div className="rewards-view__voucher-meta">
                      <span className="rewards-view__meta-item">
                        <Clock size={12.5} className="rewards-view__meta-icon" />
                        <span>Đổi ngày: <strong>{voucher.redeemedDate}</strong></span>
                      </span>
                      <span className="rewards-view__meta-sep">•</span>
                      <span className="rewards-view__meta-item rewards-view__meta-item--expiry">
                        <Calendar size={12.5} className="rewards-view__meta-icon" />
                        <span>HSD: <strong>{voucher.expiryDate}</strong></span>
                      </span>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="rewards-view__voucher-action">
                    {voucher.status === 'active' ? (
                      <button
                        type="button"
                        className="rewards-view__use-btn"
                        onClick={() => {
                          markVoucherAsUsed(voucher.id);
                          message.success('Đã chuyển voucher sang trạng thái "Đã sử dụng"!');
                        }}
                      >
                        <CheckCircle size={14} />
                        <span>Đã sử dụng</span>
                      </button>
                    ) : (
                      <span className="rewards-view__used-label">Đã áp dụng</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </SmoothTabContent>

      {/* ========================================================================= */}
      {/* MODAL: LỊCH SỬ TÍCH / ĐỔI ĐIỂM THƯỞNG (POINTS HISTORY)                    */}
      {/* ========================================================================= */}
      <Modal
        open={isHistoryModalOpen}
        onCancel={() => setIsHistoryModalOpen(false)}
        footer={null}
        width={680}
        centered
        destroyOnClose
        zIndex={1150}
        className="rewards-view__history-modal"
      >
        <div className="rewards-view__history-content">
          <div className="rewards-view__history-header">
            <div className="rewards-view__history-icon">
              <History size={24} color="#2563eb" />
            </div>
            <div>
              <h3 className="rewards-view__history-title">Lịch Sử Tích & Đổi Điểm OMNI</h3>
              <p className="rewards-view__history-subtitle">
                Xem lại toàn bộ lịch sử tích lũy từ vé đặt và điểm quy đổi quà tặng.
              </p>
            </div>
          </div>

          <div className="rewards-view__history-summary">
            <div className="rewards-view__history-sum-item">
              <span className="rewards-view__history-sum-lbl">Số dư hiện tại</span>
              <strong className="rewards-view__history-sum-val rewards-view__history-sum-val--gold">
                {userPoints.toLocaleString('vi-VN')} pts
              </strong>
            </div>
            <div className="rewards-view__history-sum-item">
              <span className="rewards-view__history-sum-lbl">Tổng tích lũy</span>
              <strong className="rewards-view__history-sum-val">2.150 pts</strong>
            </div>
            <div className="rewards-view__history-sum-item">
              <span className="rewards-view__history-sum-lbl">Đã quy đổi</span>
              <strong className="rewards-view__history-sum-val">700 pts</strong>
            </div>
          </div>

          <div className="rewards-view__history-list">
            {POINTS_TRANSACTIONS_HISTORY.map((item) => (
              <div key={item.id} className="rewards-view__history-item">
                <div
                  className={`rewards-view__history-badge ${
                    item.type === 'earn'
                      ? 'rewards-view__history-badge--earn'
                      : 'rewards-view__history-badge--spend'
                  }`}
                >
                  {item.type === 'earn' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>

                <div className="rewards-view__history-details">
                  <div className="rewards-view__history-desc">{item.description}</div>
                  <div className="rewards-view__history-date">{item.date}</div>
                </div>

                <div className="rewards-view__history-amount-col">
                  <span
                    className={`rewards-view__history-amount ${
                      item.type === 'earn'
                        ? 'rewards-view__history-amount--plus'
                        : 'rewards-view__history-amount--minus'
                    }`}
                  >
                    {item.type === 'earn' ? `+${item.amount}` : item.amount} pts
                  </span>
                  <span className="rewards-view__history-balance">
                    Dư: {item.balanceAfter.toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="rewards-view__history-footer">
            <button
              type="button"
              className="rewards-view__history-close-btn"
              onClick={() => setIsHistoryModalOpen(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL: CONFIRM REDEMPTION (XÁC NHẬN ĐỔI QUÀ VỚI FILL MOTION & COUNTER)     */}
      {/* ========================================================================= */}
      <RedeemRewardModal
        open={isConfirmModalOpen}
        reward={selectedReward}
        userPoints={userPoints}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmRedeem}
        isRedeeming={isRedeeming}
      />

      {/* ========================================================================= */}
      {/* MODAL: SUCCESS CELEBRATION & CODE REVEAL                                  */}
      {/* ========================================================================= */}
      <Modal
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}
        footer={null}
        width={500}
        centered
        destroyOnClose
        zIndex={1150}
        className="tab-rewards__success-modal"
      >
        {newlyRedeemedVoucher && (
          <div className="tab-rewards__success-content">
            <div className="tab-rewards__success-icon-wrap">
              <CheckCircle size={44} color="#16a34a" />
            </div>

            <h3 className="tab-rewards__success-title">Đổi Quà Thành Công!</h3>
            <p className="tab-rewards__success-subtitle">
              Mã voucher điện tử của bạn đã được khởi tạo và lưu vào mục <strong>"Voucher Đã Đổi"</strong>.
            </p>

            <div className="tab-rewards__success-voucher-card">
              <span className="tab-rewards__success-brand">{newlyRedeemedVoucher.brand}</span>
              <h4 className="tab-rewards__success-item-name">{newlyRedeemedVoucher.rewardTitle}</h4>

              {/* Code Presentation */}
              <div className="tab-rewards__success-code-box">
                <span className="tab-rewards__success-code-label">MÃ ƯU ĐÃI CỦA BẠN</span>
                <div className="tab-rewards__success-code-display">
                  <code>{newlyRedeemedVoucher.code}</code>
                  <button
                    type="button"
                    className="tab-rewards__success-copy-btn"
                    onClick={() => handleCopyCode(newlyRedeemedVoucher.code)}
                  >
                    {copiedCode === newlyRedeemedVoucher.code ? (
                      <>
                        <Check size={14} color="#16a34a" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="tab-rewards__success-barcode">
                <div className="tab-rewards__barcode-lines" />
                <span className="tab-rewards__barcode-text">{newlyRedeemedVoucher.barcode}</span>
              </div>

              <div className="tab-rewards__success-expiry">
                <Clock size={13} />
                <span>Hạn sử dụng: {newlyRedeemedVoucher.expiryDate}</span>
              </div>
            </div>

            <div className="tab-rewards__success-actions">
              <button
                type="button"
                className="tab-rewards__success-btn-wallet"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setActiveSubTab('my_vouchers');
                }}
              >
                <span>Xem Trong Ví Voucher</span>
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                className="tab-rewards__success-btn-close"
                onClick={() => setIsSuccessModalOpen(false)}
              >
                Tiếp tục xem quà
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* 7. MODAL CHI TIẾT & ĐIỀU KIỆN ÁP DỤNG VOUCHER                             */}
      {/* ========================================================================= */}
      <VoucherDetailModal
        open={isDetailModalOpen}
        reward={detailReward}
        userPoints={userPoints}
        onClose={handleCloseDetails}
        onInitiateRedeem={handleInitiateRedeem}
      />
    </div>
  );
};

