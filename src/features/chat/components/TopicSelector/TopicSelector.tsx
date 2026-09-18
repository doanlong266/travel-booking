import React from 'react';
import { RotateCcw, CreditCard, Plane, Headphones, ChevronRight, Ticket } from 'lucide-react';
import type { ISupportTopic } from '../../../../types/chatSession.types';
import './TopicSelector.scss';

export const SUPPORT_TOPICS: ISupportTopic[] = [
  {
    id: 'refund_exchange',
    title: 'Đổi lịch trình / Hoàn vé khẩn cấp',
    description: 'Hỗ trợ tính phí bồi hoàn, đổi chuyến hoặc hoàn tiền VietQR 24/7',
    iconName: 'RotateCcw',
    badgeText: 'Xử lý VietQR tức thì',
    defaultPrompt: 'Tôi muốn yêu cầu hỗ trợ đổi lịch trình hoặc hoàn tiền vé'
  },
  {
    id: 'payment_issue',
    title: 'Sự cố thanh toán / Chưa nhận vé',
    description: 'Kiểm tra trạng thái quét mã VietQR, đối soát biên lai giao dịch',
    iconName: 'CreditCard',
    badgeText: 'Xác thực ~1 phút',
    defaultPrompt: 'Tôi đã thanh toán nhưng chưa nhận được mã vé hoặc vé báo lỗi'
  },
  {
    id: 'baggage_checkin',
    title: 'Tư vấn hành lý & Thủ tục check-in',
    description: 'Quy định xách tay/ký gửi, thời gian có mặt tại sân bay/ga/bến',
    iconName: 'Plane',
    badgeText: 'Quy chuẩn các hãng',
    defaultPrompt: 'Tôi cần tư vấn về quy định hành lý và thủ tục check-in chuyến đi'
  },
  {
    id: 'human_agent',
    title: 'Gặp trực tiếp Chuyên viên CSKH',
    description: 'Trao đổi 1-1 với nhân viên tư vấn về mọi vấn đề phát sinh',
    iconName: 'Headphones',
    badgeText: 'Trực tuyến 24/7',
    defaultPrompt: 'Tôi muốn kết nối trực tiếp với Chuyên viên CSKH OmniTravel'
  }
];

interface TopicSelectorProps {
  onSelectTopic: (topic: ISupportTopic) => void;
  hasRecentTicket?: boolean;
  recentRouteSummary?: string;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  onSelectTopic,
  hasRecentTicket,
  recentRouteSummary
}) => {
  const renderTopicIcon = (iconName: ISupportTopic['iconName']) => {
    switch (iconName) {
      case 'RotateCcw':
        return <RotateCcw size={18} />;
      case 'CreditCard':
        return <CreditCard size={18} />;
      case 'Plane':
        return <Plane size={18} />;
      case 'Headphones':
      default:
        return <Headphones size={18} />;
    }
  };

  return (
    <div className="support-topics" role="group" aria-label="Danh mục chủ đề hỗ trợ">
      <div className="support-topics__list">
        {SUPPORT_TOPICS.map((topic) => {
          const isRefund = topic.id === 'refund_exchange';
          return (
            <button
              key={topic.id}
              type="button"
              className={`support-topic-card support-topic-card--${topic.id}`}
              onClick={() => onSelectTopic(topic)}
            >
              <div className={`support-topic-card__icon-box support-topic-card__icon-box--${topic.id}`}>
                {renderTopicIcon(topic.iconName)}
              </div>

              <div className="support-topic-card__content">
                <div className="support-topic-card__header-row">
                  <span className="support-topic-card__title">{topic.title}</span>
                  {isRefund && hasRecentTicket && (
                    <span className="support-topic-card__ticket-badge">
                      <Ticket size={10} /> Có vé vừa đặt
                    </span>
                  )}
                  {(!isRefund || !hasRecentTicket) && topic.badgeText && (
                    <span className="support-topic-card__badge">{topic.badgeText}</span>
                  )}
                </div>

                <p className="support-topic-card__desc">
                  {isRefund && hasRecentTicket && recentRouteSummary
                    ? `Vé gần nhất: ${recentRouteSummary}`
                    : topic.description}
                </p>
              </div>

              <div className="support-topic-card__arrow">
                <ChevronRight size={16} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
