import React, { useState, useRef, useEffect } from 'react';
import { Popconfirm, Tooltip } from 'antd';
import {
  Send,
  Paperclip,
  Minimize2,
  Maximize2,
  X,
  CheckCheck,
  Sparkles,
  Bot,
  Zap,
  RotateCcw,
  UserCheck,
  Ticket,
  FileText,
  PhoneOff,
  Loader2
} from 'lucide-react';
import { useSupportChatSession } from '../../hooks/useSupportChatSession';
import { useChatScroll } from '../../hooks/useChatScroll';
import { ChatTicketCard, getCityIataCode } from '../ChatTicketCard/ChatTicketCard';
import { TopicSelector } from '../TopicSelector/TopicSelector';
import { RatingFeedbackBox } from '../RatingFeedbackBox/RatingFeedbackBox';
import { useGuestBookingStorage } from '../../../booking/hooks/useGuestBookingStorage';
import type { IChatTicketPayload } from '../../../../types/chat.types';
import type { ISupportTopic } from '../../../../types/chatSession.types';
import './SupportChatWidget.scss';

interface SupportChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFastRefund?: () => void;
  onOpenExchange?: () => void;
  onOpenLookup?: (bookingId?: string) => void;
  onOpenPolicyDrawer?: () => void;
}

// Safe Markdown Parser helper for **bold**, `code`, and newlines
const renderFormattedText = (text: string) => {
  if (!text) return null;

  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

    const parsedParts = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={partIdx} className="support-chat__code">{part.slice(1, -1)}</code>;
      }
      return part;
    });

    return (
      <React.Fragment key={lineIdx}>
        {parsedParts}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

export const SupportChatWidget: React.FC<SupportChatWidgetProps> = ({
  isOpen,
  onClose,
  onOpenFastRefund,
  onOpenExchange,
  onOpenLookup,
  onOpenPolicyDrawer
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    stage,
    agentInfo,
    messages,
    isTyping,
    isCsatSubmitted,
    inputText,
    setInputText,
    attachments,
    addAttachment,
    removeAttachment,
    isSending,
    selectTopic,
    sendMessage,
    sendTicketContext,
    endSession,
    submitCsat,
    restartSession
  } = useSupportChatSession();

  const { latestRecentBooking, draftBooking } = useGuestBookingStorage();

  // Mouse drag-to-scroll for Quick Action Chips
  const chipsSliderRef = useRef<HTMLDivElement>(null);
  const [isChipDragging, setIsChipDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleChipMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chipsSliderRef.current) return;
    setIsChipDragging(true);
    setHasDragged(false);
    setDragStartX(e.pageX - chipsSliderRef.current.offsetLeft);
    setDragScrollLeft(chipsSliderRef.current.scrollLeft);
  };

  const handleChipMouseLeave = () => {
    setIsChipDragging(false);
  };

  const handleChipMouseUp = () => {
    setIsChipDragging(false);
  };

  const handleChipMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isChipDragging || !chipsSliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - chipsSliderRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.4;
    if (Math.abs(walk) > 4) {
      setHasDragged(true);
    }
    chipsSliderRef.current.scrollLeft = dragScrollLeft - walk;
  };

  // Smart auto-scroll
  const { scrollRef, isScrolledUp, scrollToBottom, handleScroll } = useChatScroll<HTMLDivElement>(
    [messages, isTyping, stage]
  );

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [inputText]);

  // Focus input when moving to CONNECTED stage
  useEffect(() => {
    if (isOpen && !isMinimized && stage === 'CONNECTED') {
      setTimeout(() => {
        textareaRef.current?.focus();
        scrollToBottom(false);
      }, 150);
    }
  }, [isOpen, isMinimized, stage, scrollToBottom]);

  if (!isOpen) return null;

  // Build current ticket payload if available
  const getCurrentTicketPayload = (): IChatTicketPayload | undefined => {
    if (latestRecentBooking) {
      return {
        bookingId: latestRecentBooking.bookingId,
        pnrCode: latestRecentBooking.bookingId,
        carrierName: latestRecentBooking.carrierName,
        carrierLogo: latestRecentBooking.carrierLogo,
        transportType: latestRecentBooking.transportType,
        originCity: latestRecentBooking.originCity,
        originCode: getCityIataCode(latestRecentBooking.originCity),
        destinationCity: latestRecentBooking.destinationCity,
        destinationCode: getCityIataCode(latestRecentBooking.destinationCity),
        departureTime: latestRecentBooking.departureTime,
        seatClass: 'Phổ thông',
        totalAmount: latestRecentBooking.totalAmount,
        paymentStatus: latestRecentBooking.paymentStatus
      };
    }
    if (draftBooking) {
      return {
        bookingId: draftBooking.bookingId,
        pnrCode: draftBooking.bookingId,
        carrierName: draftBooking.payload.ticket?.carrierName || 'OmniTicket',
        transportType: (draftBooking.payload.ticket?.transportType as any) || 'flight',
        originCity: draftBooking.payload.ticket?.origin.city || 'Hà Nội',
        originCode: getCityIataCode(draftBooking.payload.ticket?.origin.city || 'Hà Nội', draftBooking.payload.ticket?.origin.code),
        destinationCity: draftBooking.payload.ticket?.destination.city || 'TP. Hồ Chí Minh',
        destinationCode: getCityIataCode(draftBooking.payload.ticket?.destination.city || 'TP. Hồ Chí Minh', draftBooking.payload.ticket?.destination.code),
        departureTime: draftBooking.payload.ticket?.departureTime || new Date().toISOString(),
        seatClass: draftBooking.payload.ticket?.seatClass || 'Phổ thông',
        totalAmount: draftBooking.payload.totalAmount,
        paymentStatus: 'pending_payment'
      };
    }
    return undefined;
  };

  const handleTopicClick = (topic: ISupportTopic) => {
    const ticketPayload = getCurrentTicketPayload();
    selectTopic(topic, ticketPayload);
  };

  // Minimized Floating Pill Bar
  if (isMinimized) {
    return (
      <div 
        className="support-chat-minimized" 
        onClick={() => setIsMinimized(false)}
        role="button"
        tabIndex={0}
        aria-label="Mở rộng khung chat hỗ trợ"
      >
        <div className="support-chat-minimized__avatar-box">
          {stage === 'TOPIC_SELECTION' ? (
            <div className="support-chat-minimized__bot-icon">
              <Bot size={18} color="#0066cc" />
            </div>
          ) : (
            <img src={agentInfo.avatar} alt={agentInfo.name} className="support-chat-minimized__avatar" />
          )}
          {stage === 'CONNECTED' && <span className="support-chat-minimized__status-dot" />}
        </div>
        <div className="support-chat-minimized__meta">
          <span className="support-chat-minimized__name">
            {stage === 'TOPIC_SELECTION' ? 'Trợ Giúp OMNI' : agentInfo.name}
          </span>
          <span className="support-chat-minimized__sub">
            {stage === 'CONNECTED' ? '● Đang trực tuyến' : 'Bấm để mở chat'}
          </span>
        </div>
        <button
          type="button"
          className="support-chat-minimized__btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(false);
          }}
          title="Mở rộng"
        >
          <Maximize2 size={15} />
        </button>
        <button
          type="button"
          className="support-chat-minimized__btn support-chat-minimized__btn--close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          title="Đóng chat"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  // Handle Send Keypress
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (stage === 'CONNECTED') {
        sendMessage();
      }
    }
  };

  // Handle File Input Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addAttachment(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentTicket = getCurrentTicketPayload();
  const hasTicketToSend = !!currentTicket;

  return (
    <div className="support-chat" role="region" aria-label="Khung chat hỗ trợ trực tuyến">
      {/* 1. HEADER (Structured in 2 distinct clusters: Left Info - Right Actions) */}
      <header className="support-chat__header">
        {/* Cụm bên trái (Thông tin Agent / Bot) */}
        <div className="support-chat__agent-info">
          <div className="support-chat__avatar-wrap">
            {stage === 'TOPIC_SELECTION' ? (
              <div className="support-chat__bot-avatar">
                <Bot size={22} color="#0066cc" />
              </div>
            ) : stage === 'CONNECTING' ? (
              <div className="support-chat__avatar-loading">
                <img src={agentInfo.avatar} alt="Connecting" className="support-chat__avatar support-chat__avatar--dimmed" />
                <div className="support-chat__loading-ring">
                  <Loader2 size={18} className="support-chat__spinner-icon" />
                </div>
              </div>
            ) : (
              <>
                <img 
                  src={agentInfo.avatar} 
                  alt={agentInfo.name} 
                  className="support-chat__avatar" 
                />
                <span className="support-chat__status-dot support-chat__status-dot--online" />
              </>
            )}
          </div>

          <div className="support-chat__agent-meta">
            <div className="support-chat__agent-name-row">
              <span className="support-chat__agent-name">
                {stage === 'TOPIC_SELECTION' 
                  ? 'Trợ Giúp OMNI' 
                  : stage === 'CONNECTING' 
                    ? 'Đang kết nối...' 
                    : agentInfo.name}
              </span>
              <span className="support-chat__badge-tag">
                <Sparkles size={9} /> {stage === 'TOPIC_SELECTION' ? 'Bot 24/7' : 'CSKH 24/7'}
              </span>
            </div>

            <div className="support-chat__agent-status-row">
              {stage === 'CONNECTED' ? (
                <>
                  <span className="support-chat__status-dot-inline" />
                  <span className="support-chat__status-text">Đang trực tuyến</span>
                </>
              ) : stage === 'CONNECTING' ? (
                <span className="support-chat__status-text" style={{ color: '#e0f2fe' }}>
                  Điều phối chuyên viên...
                </span>
              ) : stage === 'COMPLETED' ? (
                <span className="support-chat__status-text" style={{ color: '#fed7aa' }}>
                  Đã kết thúc
                </span>
              ) : (
                <span className="support-chat__status-text" style={{ color: '#e0f2fe' }}>
                  ● Tự động 24/7
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cụm bên phải (Hành động & Điều hướng) */}
        <div className="support-chat__header-actions">
          {/* Nút Kết Thúc Cuộc Trò Chuyện (Icon Button tinh gọn với Popconfirm) */}
          {stage === 'CONNECTED' && (
            <Popconfirm
              title="Kết thúc hỗ trợ?"
              description="Quý khách có chắc chắn muốn kết thúc phiên tư vấn này?"
              onConfirm={endSession}
              okText="Kết thúc"
              cancelText="Tiếp tục chat"
              placement="bottomRight"
            >
              <Tooltip title="Kết thúc cuộc trò chuyện" placement="bottom">
                <button
                  type="button"
                  className="support-chat__header-btn support-chat__header-btn--end"
                  aria-label="Kết thúc cuộc trò chuyện"
                >
                  <PhoneOff size={16} />
                </button>
              </Tooltip>
            </Popconfirm>
          )}

          <Tooltip title="Thu nhỏ" placement="bottom">
            <button
              type="button"
              className="support-chat__header-btn"
              onClick={() => setIsMinimized(true)}
              aria-label="Thu nhỏ khung chat"
            >
              <Minimize2 size={18} />
            </button>
          </Tooltip>

          <Tooltip title="Đóng chat" placement="bottom">
            <button
              type="button"
              className="support-chat__header-btn support-chat__header-btn--close"
              onClick={onClose}
              aria-label="Đóng khung chat"
            >
              <X size={18} />
            </button>
          </Tooltip>
        </div>
      </header>

      {/* 2. BODY (Scrollable message stream & Topic Selector) */}
      <main 
        className="support-chat__body" 
        ref={scrollRef} 
        onScroll={handleScroll}
      >
        <div className="support-chat__date-divider">
          <span>Hôm nay</span>
        </div>

        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="support-chat__system-notice-wrap">
                <span className="support-chat__system-notice-badge">
                  {msg.text}
                </span>
              </div>
            );
          }

          if (msg.sender === 'bot') {
            return (
              <div key={msg.id} className="support-chat__msg support-chat__msg--bot">
                <div className="support-chat__bot-badge">
                  <Bot size={13} /> {msg.senderName}
                </div>
                <div className="support-chat__bubble support-chat__bubble--bot">
                  <p>{renderFormattedText(msg.text || '')}</p>
                  <span className="support-chat__timestamp">{msg.timestamp}</span>
                </div>
              </div>
            );
          }

          if (msg.sender === 'agent') {
            return (
              <div key={msg.id} className="support-chat__msg support-chat__msg--agent">
                <div className="support-chat__bubble support-chat__bubble--incoming">
                  <p>{renderFormattedText(msg.text || '')}</p>
                  <span className="support-chat__timestamp">{msg.timestamp}</span>
                </div>
              </div>
            );
          }

          // User message
          return (
            <div key={msg.id} className="support-chat__msg support-chat__msg--user">
              {msg.type === 'ticket' && msg.ticketPayload ? (
                <div className="support-chat__ticket">
                  <div className="support-chat__ticket-caption">
                    <Ticket size={12} /> Thông tin vé hành trình:
                  </div>
                  <ChatTicketCard
                    ticket={msg.ticketPayload}
                    onOpenLookup={onOpenLookup}
                    onOpenRefund={onOpenFastRefund}
                  />
                  <div className="support-chat__user-meta">
                    <span className="support-chat__timestamp support-chat__timestamp--user">{msg.timestamp}</span>
                    <CheckCheck size={14} className="support-chat__check-icon" />
                  </div>
                </div>
              ) : (
                <div className="support-chat__bubble support-chat__bubble--outgoing">
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="support-chat__attachments-preview">
                      {msg.attachments.map((att) => (
                        <div key={att.id} className="support-chat__attachment-item">
                          {att.type === 'image' && att.previewUrl ? (
                            <img src={att.previewUrl} alt={att.name} className="support-chat__attachment-img" />
                          ) : (
                            <div className="support-chat__file-box">
                              <FileText size={16} />
                              <span className="support-chat__file-name">{att.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.text && <p>{renderFormattedText(msg.text)}</p>}
                  <div className="support-chat__user-meta">
                    <span className="support-chat__timestamp support-chat__timestamp--user">{msg.timestamp}</span>
                    <CheckCheck size={14} className="support-chat__check-icon" />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Stage 1: Topic Selector in Body */}
        {stage === 'TOPIC_SELECTION' && (
          <TopicSelector
            onSelectTopic={handleTopicClick}
            hasRecentTicket={hasTicketToSend}
            recentRouteSummary={
              latestRecentBooking
                ? `${latestRecentBooking.originCity} → ${latestRecentBooking.destinationCity} (${latestRecentBooking.carrierName})`
                : undefined
            }
          />
        )}

        {/* Stage 4: CSAT Rating Box in Body */}
        {stage === 'COMPLETED' && (
          <RatingFeedbackBox
            onRatingSubmit={submitCsat}
            onRestartSession={restartSession}
            isSubmitted={isCsatSubmitted}
            agentName={agentInfo.name}
          />
        )}

        {/* Typing Wave Indicator */}
        {isTyping && (
          <div className="support-chat__typing-indicator">
            <div className="support-chat__typing-dots">
              <span className="support-chat__typing-dot" />
              <span className="support-chat__typing-dot" />
              <span className="support-chat__typing-dot" />
            </div>
            <span className="support-chat__typing-text">{agentInfo.name} đang soạn tin...</span>
          </div>
        )}

        {/* Scroll to bottom button */}
        {isScrolledUp && (
          <button
            type="button"
            className="support-chat__scroll-down-btn"
            onClick={() => scrollToBottom(true)}
            title="Cuộn xuống tin nhắn mới nhất"
          >
            Tin nhắn mới ↓
          </button>
        )}
      </main>

      {/* 3. FOOTER (Strict flex-shrink: 0 container) */}
      <footer className={`support-chat__footer ${stage !== 'CONNECTED' ? 'support-chat__footer--disabled' : ''}`}>
        {/* Stage 4 Finished Bar */}
        {stage === 'COMPLETED' && (
          <div className="support-chat__completed-bar">
            <span>Cuộc hội thoại đã kết thúc</span>
            <button
              type="button"
              className="support-chat__restart-link-btn"
              onClick={restartSession}
            >
              <RotateCcw size={12} /> Bắt đầu phiên mới
            </button>
          </div>
        )}

        {/* Pending Attachments Strip (Only during connected session) */}
        {stage === 'CONNECTED' && attachments.length > 0 && (
          <div className="support-chat__pending-attachments">
            {attachments.map((att) => (
              <div key={att.id} className="support-chat__pending-att-item">
                {att.type === 'image' && att.previewUrl ? (
                  <img src={att.previewUrl} alt={att.name} className="support-chat__pending-att-thumb" />
                ) : (
                  <FileText size={15} />
                )}
                <span className="support-chat__pending-att-name">{att.name}</span>
                <button
                  type="button"
                  className="support-chat__pending-att-remove"
                  onClick={() => removeAttachment(att.id)}
                  title="Xóa đính kèm"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quick Action Chips Slider (Only in CONNECTED stage - Smooth mouse drag-to-scroll) */}
        {stage === 'CONNECTED' && (
          <div 
            className={`support-chat__chips-slider ${isChipDragging ? 'support-chat__chips-slider--dragging' : ''}`}
            ref={chipsSliderRef}
            onMouseDown={handleChipMouseDown}
            onMouseLeave={handleChipMouseLeave}
            onMouseUp={handleChipMouseUp}
            onMouseMove={handleChipMouseMove}
            role="group" 
            aria-label="Gợi ý phản hồi nhanh"
          >
            {hasTicketToSend && currentTicket && (
              <button
                type="button"
                className="support-chat__chip-btn support-chat__chip-btn--ticket"
                onClick={() => {
                  if (!hasDragged) sendTicketContext(currentTicket);
                }}
              >
                <Ticket size={12} /> Gửi thông tin vé hiện tại
              </button>
            )}
            <button
              type="button"
              className="support-chat__chip-btn support-chat__chip-btn--refund"
              onClick={() => {
                if (hasDragged) return;
                if (onOpenFastRefund) onOpenFastRefund();
                else sendMessage('Tôi muốn yêu cầu hoàn vé khẩn cấp qua VietQR');
              }}
            >
              <Zap size={12} /> Yêu cầu hoàn vé khẩn
            </button>
            <button
              type="button"
              className="support-chat__chip-btn"
              onClick={() => {
                if (hasDragged) return;
                if (onOpenExchange) onOpenExchange();
                else sendMessage('Tôi muốn đổi ngày / giờ chuyến đi');
              }}
            >
              <RotateCcw size={12} /> Đổi ngày / giờ khởi hành
            </button>
            <button
              type="button"
              className="support-chat__chip-btn"
              onClick={() => {
                if (hasDragged) return;
                if (onOpenPolicyDrawer) onOpenPolicyDrawer();
                else sendMessage('Cho tôi xem bảng quy định hoàn đổi của các hãng');
              }}
            >
              <FileText size={12} /> Quy định hoàn vé hãng
            </button>
            <button
              type="button"
              className="support-chat__chip-btn"
              onClick={() => {
                if (hasDragged) return;
                sendMessage('Tôi muốn gặp chuyên viên tư vấn trực tiếp');
              }}
            >
              <UserCheck size={12} /> Gặp tư vấn viên
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="support-chat__input-bar">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
            disabled={stage !== 'CONNECTED'}
          />

          <button
            type="button"
            className="support-chat__attach-btn"
            onClick={() => fileInputRef.current?.click()}
            title={stage === 'CONNECTED' ? 'Đính kèm ảnh hoặc tài liệu' : 'Chọn chủ đề trước khi đính kèm'}
            aria-label="Đính kèm ảnh hoặc tài liệu"
            disabled={stage !== 'CONNECTED'}
          >
            <Paperclip size={18} />
          </button>

          <textarea
            ref={textareaRef}
            className="support-chat__textarea"
            placeholder={
              stage === 'TOPIC_SELECTION'
                ? 'Vui lòng chọn chủ đề cần hỗ trợ ở trên...'
                : stage === 'CONNECTING'
                  ? 'Đang kết nối chuyên viên tư vấn...'
                  : stage === 'COMPLETED'
                    ? 'Cuộc trò chuyện đã kết thúc'
                    : 'Nhập tin nhắn... (Enter để gửi)'
            }
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={stage !== 'CONNECTED' || isSending}
          />

          <button
            type="button"
            className={`support-chat__send-btn ${
              stage === 'CONNECTED' && (inputText.trim().length > 0 || attachments.length > 0)
                ? 'support-chat__send-btn--active'
                : ''
            }`}
            onClick={() => sendMessage()}
            disabled={
              stage !== 'CONNECTED' ||
              isSending ||
              (inputText.trim().length === 0 && attachments.length === 0)
            }
            title="Gửi tin nhắn"
            aria-label="Gửi tin nhắn"
          >
            <Send size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
};
