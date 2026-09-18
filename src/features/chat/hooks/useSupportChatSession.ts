import { useState, useEffect, useCallback } from 'react';
import type { 
  ChatStage, 
  ISupportTopic, 
  ICsatRating 
} from '../../../types/chatSession.types';
import type { 
  IChatMessage, 
  IChatAgentInfo, 
  IChatAttachment, 
  IChatTicketPayload 
} from '../../../types/chat.types';
import { chatService, DEFAULT_AGENT_INFO } from '../../../services/chat.service';

const INITIAL_BOT_MESSAGE: IChatMessage = {
  id: 'msg-bot-initial',
  sender: 'bot',
  senderName: 'OmniBot AI',
  senderRole: 'Trợ lý Tự động OMNITRAVEL',
  timestamp: 'Vừa xong',
  type: 'text',
  text: 'Xin chào Quý khách! 👋 Chào mừng Quý khách đến với **Trung Tâm Hỗ Trợ 24/7 của OMNITRAVEL**.\n\nVui lòng chọn chủ đề bên dưới để hệ thống điều phối chuyên viên phù hợp hỗ trợ Quý khách nhanh nhất nhé!',
  status: 'read'
};

export const useSupportChatSession = () => {
  const [stage, setStage] = useState<ChatStage>('TOPIC_SELECTION');
  const [selectedTopic, setSelectedTopic] = useState<ISupportTopic | null>(null);
  const [agentInfo, setAgentInfo] = useState<IChatAgentInfo>(DEFAULT_AGENT_INFO);
  const [messages, setMessages] = useState<IChatMessage[]>([INITIAL_BOT_MESSAGE]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [csatRating, setCsatRating] = useState<ICsatRating | null>(null);
  const [isCsatSubmitted, setIsCsatSubmitted] = useState<boolean>(false);

  const [inputText, setInputText] = useState<string>('');
  const [attachments, setAttachments] = useState<IChatAttachment[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Subscribe to service messages when in CONNECTED stage
  useEffect(() => {
    const unsubscribeMessages = chatService.subscribeMessages((newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    const unsubscribeTyping = chatService.subscribeTyping((typing) => {
      setIsTyping(typing);
    });

    chatService.getAgentInfo().then(setAgentInfo);

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
    };
  }, []);

  // 1. TOPIC SELECTION -> CONNECTING -> CONNECTED
  const selectTopic = useCallback((topic: ISupportTopic, currentTicket?: IChatTicketPayload) => {
    setSelectedTopic(topic);
    setStage('CONNECTING');

    // Push user choice message
    const userChoiceMsg: IChatMessage = {
      id: `msg-user-topic-${Date.now()}`,
      sender: 'user',
      senderName: 'Bạn',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      text: topic.defaultPrompt,
      status: 'sent'
    };

    // Push system connecting notice
    const systemNoticeMsg: IChatMessage = {
      id: `msg-sys-connecting-${Date.now()}`,
      sender: 'system',
      senderName: 'Hệ thống',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      type: 'system_alert',
      text: `Hệ thống đang điều phối chuyên viên chuyên trách về "${topic.title}"... Vui lòng chờ trong giây lát.`,
      status: 'read'
    };

    setMessages((prev) => [...prev, userChoiceMsg, systemNoticeMsg]);

    // Simulate agent assignment delay (1.8s)
    setTimeout(() => {
      setStage('CONNECTED');

      // System join message
      const agentJoinMsg: IChatMessage = {
        id: `msg-sys-join-${Date.now()}`,
        sender: 'system',
        senderName: 'Hệ thống',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        type: 'system_alert',
        text: `Chuyên viên Hoàng Mai đã tham gia cuộc hội thoại.`,
        status: 'read'
      };

      setMessages((prev) => [...prev, agentJoinMsg]);

      // Agent typing greeting
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);

        let greetingText = '';
        if (topic.id === 'refund_exchange') {
          greetingText = 'Dạ em chào Quý khách! Em là **Hoàng Mai** - CSKH OmniTravel. Về yêu cầu đổi lịch trình hoặc hoàn vé, Quý khách vui lòng cung cấp Mã đặt vé (PNR) hoặc kiểm tra thông tin vé bên dưới để em đối soát điều kiện áp dụng nhé ạ!';
        } else if (topic.id === 'payment_issue') {
          greetingText = 'Dạ em chào Quý khách! Em là **Hoàng Mai** phụ trách hỗ trợ giao dịch VietQR. Quý khách vui lòng cung cấp mã đơn hàng hoặc đính kèm ảnh chụp biên lai chuyển khoản để em kiểm tra phát hành vé ngay cho mình ạ!';
        } else if (topic.id === 'baggage_checkin') {
          greetingText = 'Dạ em chào Quý khách! Em là **Hoàng Mai**. Quý khách đang cần tư vấn về hạn mức hành lý xách tay/ký gửi hay thời gian làm thủ tục của chuyến bay/tàu/xe nào ạ?';
        } else {
          greetingText = 'Dạ em chào Quý khách! Em là **Hoàng Mai** - Chuyên viên tư vấn trực tiếp của OmniTravel đang trực tuyến đây ạ. Em có thể hỗ trợ gì cho hành trình của Quý khách ạ?';
        }

        const agentGreeting: IChatMessage = {
          id: `msg-agent-greet-${Date.now()}`,
          sender: 'agent',
          senderName: DEFAULT_AGENT_INFO.name,
          senderAvatar: DEFAULT_AGENT_INFO.avatar,
          senderRole: DEFAULT_AGENT_INFO.role,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          text: greetingText,
          status: 'delivered'
        };

        // If user has a ticket and chose refund, also attach the ticket card
        if (topic.id === 'refund_exchange' && currentTicket) {
          const autoTicketMsg: IChatMessage = {
            id: `msg-ticket-auto-${Date.now()}`,
            sender: 'user',
            senderName: 'Bạn',
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            type: 'ticket',
            ticketPayload: currentTicket,
            status: 'sent'
          };
          setMessages((prev) => [...prev, agentGreeting, autoTicketMsg]);
        } else {
          setMessages((prev) => [...prev, agentGreeting]);
        }
      }, 1100);
    }, 1800);
  }, []);

  // 2. CONNECTED -> Send message
  const sendMessage = useCallback(async (customText?: string) => {
    if (stage !== 'CONNECTED') return;

    const textToSend = (customText !== undefined ? customText : inputText).trim();
    if (!textToSend && attachments.length === 0) return;

    setIsSending(true);
    try {
      await chatService.sendMessage({
        sender: 'user',
        senderName: 'Bạn',
        text: textToSend,
        type: attachments.length > 0 ? 'attachment' : 'text',
        attachments: attachments.length > 0 ? [...attachments] : undefined
      });

      setInputText('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  }, [stage, inputText, attachments]);

  // Send Ticket Context
  const sendTicketContext = useCallback(async (ticket: IChatTicketPayload) => {
    if (stage !== 'CONNECTED') return;
    try {
      await chatService.sendCurrentTicket(ticket);
    } catch (error) {
      console.error('Failed to send ticket context:', error);
    }
  }, [stage]);

  // 3. END SESSION -> COMPLETED
  const endSession = useCallback(() => {
    setStage('COMPLETED');

    const closingMsg: IChatMessage = {
      id: `msg-agent-closing-${Date.now()}`,
      sender: 'agent',
      senderName: agentInfo.name,
      senderAvatar: agentInfo.avatar,
      senderRole: agentInfo.role,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      text: 'Cảm ơn Quý khách đã liên hệ **OMNITRAVEL**. Cuộc trò chuyện đã kết thúc. Chúc Quý khách một hành trình an toàn và trọn vẹn! Nếu cần hỗ trợ thêm, Quý khách luôn có thể bắt đầu phiên mới bất kỳ lúc nào.',
      status: 'delivered'
    };

    setMessages((prev) => [...prev, closingMsg]);
  }, [agentInfo]);

  // 4. CSAT SUBMISSION
  const submitCsat = useCallback((rating: ICsatRating) => {
    setCsatRating(rating);
    setIsCsatSubmitted(true);
  }, []);

  // 5. RESTART SESSION -> TOPIC_SELECTION
  const restartSession = useCallback(() => {
    setStage('TOPIC_SELECTION');
    setSelectedTopic(null);
    setMessages([
      {
        ...INITIAL_BOT_MESSAGE,
        id: `msg-bot-restart-${Date.now()}`
      }
    ]);
    setCsatRating(null);
    setIsCsatSubmitted(false);
    setInputText('');
    setAttachments([]);
  }, []);

  // Upload attachments
  const addAttachment = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const isImg = file.type.startsWith('image/');
      const newAtt: IChatAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: isImg ? 'image' : 'file',
        url: e.target?.result as string,
        previewUrl: isImg ? (e.target?.result as string) : undefined
      };
      setAttachments((prev) => [...prev, newAtt]);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    stage,
    selectedTopic,
    agentInfo,
    messages,
    isTyping,
    csatRating,
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
  };
};
