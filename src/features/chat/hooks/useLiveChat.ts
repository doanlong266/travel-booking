import { useState, useEffect, useCallback } from 'react';
import type { 
  IChatMessage, 
  IChatAgentInfo, 
  IChatAttachment, 
  IChatTicketPayload,
  ChatConnectionState 
} from '../../../types/chat.types';
import { chatService, DEFAULT_AGENT_INFO } from '../../../services/chat.service';

const INITIAL_MESSAGES: IChatMessage[] = [
  {
    id: 'msg-welcome-bot',
    sender: 'bot',
    senderName: 'OmniBot AI',
    senderRole: 'Trợ lý Ảo OmniTravel',
    timestamp: 'Vừa xong',
    type: 'text',
    text: 'Xin chào Quý khách! 👋 Em là Trợ lý Ảo OmniTravel. Em có thể hỗ trợ Quý khách giải đáp nhanh các thắc mắc về tra cứu vé, thủ tục hoàn hủy hoặc kết nối trực tiếp với Chuyên viên CSKH.',
    status: 'read'
  },
  {
    id: 'msg-welcome-agent',
    sender: 'agent',
    senderName: DEFAULT_AGENT_INFO.name,
    senderAvatar: DEFAULT_AGENT_INFO.avatar,
    senderRole: DEFAULT_AGENT_INFO.role,
    timestamp: 'Vừa xong',
    type: 'text',
    text: 'Chào Quý khách! Em là Hoàng Mai. Em đang trực tuyến và sẵn sàng hỗ trợ Quý khách 24/7. Quý khách cần hỗ trợ dịch vụ nào dưới đây ạ?',
    status: 'read'
  }
];

export const useLiveChat = () => {
  const [messages, setMessages] = useState<IChatMessage[]>(INITIAL_MESSAGES);
  const [connectionState, setConnectionState] = useState<ChatConnectionState>('connecting');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [agentInfo, setAgentInfo] = useState<IChatAgentInfo>(DEFAULT_AGENT_INFO);
  const [inputText, setInputText] = useState<string>('');
  const [attachments, setAttachments] = useState<IChatAttachment[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Initialize service subscriptions
  useEffect(() => {
    // Simulate connection handshake
    const timer = setTimeout(() => {
      setConnectionState('connected');
    }, 600);

    const unsubscribeMessages = chatService.subscribeMessages((newMsg) => {
      setMessages((prev) => {
        // Avoid duplicate ID
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    const unsubscribeTyping = chatService.subscribeTyping((typing) => {
      setIsTyping(typing);
    });

    chatService.getAgentInfo().then(setAgentInfo);

    return () => {
      clearTimeout(timer);
      unsubscribeMessages();
      unsubscribeTyping();
    };
  }, []);

  // Send Text Message
  const sendMessage = useCallback(async (customText?: string) => {
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
      console.error('Failed to send chat message:', error);
    } finally {
      setIsSending(false);
    }
  }, [inputText, attachments]);

  // Send Contextual Ticket
  const sendTicketContext = useCallback(async (ticket: IChatTicketPayload) => {
    try {
      await chatService.sendCurrentTicket(ticket);
    } catch (error) {
      console.error('Failed to send ticket context:', error);
    }
  }, []);

  // Upload Attachment (Mock)
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

  // Clear chat conversation
  const clearChat = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
  }, []);

  return {
    messages,
    connectionState,
    isTyping,
    agentInfo,
    inputText,
    setInputText,
    attachments,
    addAttachment,
    removeAttachment,
    sendMessage,
    sendTicketContext,
    isSending,
    clearChat
  };
};
