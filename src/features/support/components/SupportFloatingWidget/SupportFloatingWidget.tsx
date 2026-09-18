import React, { useState } from 'react';
import { Popover, Collapse } from 'antd';
import {
  Headphones,
  PhoneCall,
  MessageCircle,
  Zap,
  RotateCcw,
  FileText,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SUPPORT_FAQS } from '../../../../services/refundCalculation.service';
import './SupportFloatingWidget.scss';

interface SupportFloatingWidgetProps {
  onOpenFastRefund: () => void;
  onOpenExchange?: () => void;
  onOpenPolicyDrawer: () => void;
  onOpenLiveChat?: () => void;
}

export const SupportFloatingWidget: React.FC<SupportFloatingWidgetProps> = ({
  onOpenFastRefund,
  onOpenExchange,
  onOpenPolicyDrawer,
  onOpenLiveChat
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleActionClick = (callback?: () => void) => {
    setPopoverOpen(false);
    callback?.();
  };

  const popoverContent = (
    <div className="support-popover" role="dialog" aria-label="Trung tâm hỗ trợ khách hàng">
      {/* Header */}
      <div className="support-popover__header">
        <div className="support-popover__title-box">
          <Headphones size={18} color="var(--color-primary, #0ea5e9)" />
          <span className="support-popover__title">Trung Tâm Hỗ Trợ</span>
        </div>
        <span className="support-popover__badge-247">
          <Sparkles size={11} style={{ marginRight: '3px' }} /> Trực tuyến 24/7
        </span>
      </div>

      {/* Emergency Channels */}
      <div className="support-popover__channels-grid">
        <a 
          href="tel:19006868" 
          className="support-popover__channel-card support-popover__channel-card--hotline"
          title="Gọi tổng đài khẩn cấp 24/7"
        >
          <div className="support-popover__channel-icon-box support-popover__channel-icon-box--hotline">
            <PhoneCall size={16} />
          </div>
          <div className="support-popover__channel-meta">
            <span className="support-popover__channel-title">Hotline Khẩn Cấp</span>
            <span className="support-popover__channel-sub" style={{ color: '#c2410c', fontWeight: 'bold' }}>1900 6868 (Miễn phí)</span>
          </div>
        </a>

        <a 
          href="https://zalo.me" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="support-popover__channel-card"
        >
          <div className="support-popover__channel-icon-box" style={{ color: '#0068ff' }}>
            <MessageCircle size={16} />
          </div>
          <div className="support-popover__channel-meta">
            <span className="support-popover__channel-title">Zalo Official</span>
            <span className="support-popover__channel-sub">Phản hồi ~2 phút</span>
          </div>
        </a>

        <button 
          type="button" 
          className="support-popover__channel-card"
          onClick={() => handleActionClick(onOpenLiveChat)}
        >
          <div className="support-popover__channel-icon-box" style={{ color: '#16a34a' }}>
            <Headphones size={16} />
          </div>
          <div className="support-popover__channel-meta">
            <span className="support-popover__channel-title">Live Chat Trực Tiếp</span>
            <span className="support-popover__channel-sub">Chat ngay</span>
          </div>
        </button>
      </div>

      {/* Quick 1-Click Operations */}
      <div className="support-popover__section-title">
        <Zap size={13} color="var(--color-primary, #0ea5e9)" /> Thao tác nhanh 1 chạm
      </div>

      <div className="support-popover__ops-list">
        <button
          type="button"
          className="support-popover__op-btn support-popover__op-btn--refund"
          onClick={() => handleActionClick(onOpenFastRefund)}
        >
          <div className="support-popover__op-btn-left">
            <Zap size={15} />
            <span>Yêu cầu hoàn/hủy vé siêu tốc</span>
          </div>
          <ArrowRight size={14} />
        </button>

        <button
          type="button"
          className="support-popover__op-btn"
          onClick={() => handleActionClick(onOpenExchange || onOpenFastRefund)}
        >
          <div className="support-popover__op-btn-left">
            <RotateCcw size={15} color="var(--color-primary, #0ea5e9)" />
            <span>Đổi giờ / Đổi lịch trình vé</span>
          </div>
          <ArrowRight size={14} />
        </button>

        <button
          type="button"
          className="support-popover__op-btn"
          onClick={() => handleActionClick(onOpenPolicyDrawer)}
        >
          <div className="support-popover__op-btn-left">
            <FileText size={15} color="var(--color-primary, #0ea5e9)" />
            <span>Bảng quy định hoàn đổi của hãng</span>
          </div>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* FAQ Accordion */}
      <div className="support-popover__section-title">
        <HelpCircle size={13} color="var(--color-primary, #0ea5e9)" /> Câu hỏi thường gặp (FAQ)
      </div>

      <div className="support-popover__faq-wrap">
        <Collapse
          ghost
          size="small"
          items={SUPPORT_FAQS.slice(0, 3).map(faq => ({
            key: faq.id,
            label: <span style={{ fontSize: '12px', fontWeight: 600 }}>{faq.question}</span>,
            children: <p style={{ fontSize: '11.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>{faq.answer}</p>
          }))}
        />
      </div>
    </div>
  );

  return (
    <div className="support-fab">
      <Popover
        content={popoverContent}
        trigger="click"
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        placement="topLeft"
        overlayClassName="support-popover-overlay"
      >
        <button
          type="button"
          className="support-fab__trigger"
          title="Mở Trung tâm hỗ trợ 24/7 & Hoàn vé siêu tốc"
          aria-label="Hỗ trợ 24/7 trực tuyến"
        >
          <div className="support-fab__pulse-ring" />
          <div className="support-fab__icon-box">
            <Headphones size={20} />
          </div>
          <div className="support-fab__text-col">
            <span className="support-fab__title">Hỗ trợ 24/7</span>
            <div className="support-fab__status-row">
              <span className="support-fab__online-dot" />
              <span>Trực tuyến</span>
            </div>
          </div>
        </button>
      </Popover>
    </div>
  );
};
