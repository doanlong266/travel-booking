import type { IChatMessage, IChatAgentInfo, IChatTicketPayload } from '../types/chat.types';

export interface IChatService {
  sendMessage(message: Omit<IChatMessage, 'id' | 'timestamp' | 'status'>): Promise<IChatMessage>;
  subscribeMessages(listener: (message: IChatMessage) => void): () => void;
  subscribeTyping(listener: (isTyping: boolean) => void): () => void;
  getAgentInfo(): Promise<IChatAgentInfo>;
  sendCurrentTicket(ticket: IChatTicketPayload): Promise<IChatMessage>;
}

export const DEFAULT_AGENT_INFO: IChatAgentInfo = {
  id: 'agent-mai-01',
  name: 'Hoàng Mai',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  role: 'CSKH Hoàng Mai • Hỗ trợ vé & hoàn tiền',
  status: 'online',
  responseTime: '~1 phút'
};

class MockChatService implements IChatService {
  private messageListeners: Array<(message: IChatMessage) => void> = [];
  private typingListeners: Array<(isTyping: boolean) => void> = [];
  private agentInfo: IChatAgentInfo = DEFAULT_AGENT_INFO;

  public subscribeMessages(listener: (message: IChatMessage) => void): () => void {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }

  public subscribeTyping(listener: (isTyping: boolean) => void): () => void {
    this.typingListeners.push(listener);
    return () => {
      this.typingListeners = this.typingListeners.filter(l => l !== listener);
    };
  }

  public async getAgentInfo(): Promise<IChatAgentInfo> {
    return this.agentInfo;
  }

  private notifyMessage(msg: IChatMessage) {
    this.messageListeners.forEach(listener => listener(msg));
  }

  private notifyTyping(isTyping: boolean) {
    this.typingListeners.forEach(listener => listener(isTyping));
  }

  public async sendMessage(data: Omit<IChatMessage, 'id' | 'timestamp' | 'status'>): Promise<IChatMessage> {
    const userMessage: IChatMessage = {
      ...data,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // Deliver user message
    this.notifyMessage(userMessage);

    // Simulate Agent auto-response
    this.simulateAgentResponse(userMessage);

    return userMessage;
  }

  public async sendCurrentTicket(ticket: IChatTicketPayload): Promise<IChatMessage> {
    const ticketMessage: IChatMessage = {
      id: `msg-ticket-${Date.now()}`,
      sender: 'user',
      senderName: 'Bạn',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      type: 'ticket',
      ticketPayload: ticket,
      status: 'sent'
    };

    this.notifyMessage(ticketMessage);

    // Simulate agent acknowledgment of ticket
    setTimeout(() => {
      this.notifyTyping(true);
      setTimeout(() => {
        this.notifyTyping(false);
        const reply: IChatMessage = {
          id: `msg-reply-${Date.now()}`,
          sender: 'agent',
          senderName: this.agentInfo.name,
          senderAvatar: this.agentInfo.avatar,
          senderRole: this.agentInfo.role,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          text: `Dạ em đã nhận được thông tin vé **${ticket.pnrCode}** chặng **${ticket.originCity} → ${ticket.destinationCity}** (${ticket.carrierName}) của Quý khách. Em có thể hỗ trợ Quý khách về đổi lịch trình, hoàn vé hay tra cứu chi tiết thông tin ạ?`,
          status: 'delivered'
        };
        this.notifyMessage(reply);
      }, 1500);
    }, 600);

    return ticketMessage;
  }

  private simulateAgentResponse(userMessage: IChatMessage) {
    const query = (userMessage.text || '').toLowerCase();

    setTimeout(() => {
      this.notifyTyping(true);

      setTimeout(() => {
        this.notifyTyping(false);

        let responseText = '';
        let quickActions;

        if (query.includes('hoàn') || query.includes('hủy') || query.includes('refund')) {
          responseText = 'Dạ về quy định hoàn vé: Hệ thống OmniTravel hỗ trợ hoàn tự động qua VietQR 24/7. Nếu Quý khách muốn gửi yêu cầu hoàn tiền ngay, vui lòng nhấn nút "Yêu cầu hoàn vé khẩn" bên dưới để hệ thống tính toán mức phí bồi hoàn chính xác theo biểu phí của hãng nhé ạ.';
        } else if (query.includes('đổi') || query.includes('giờ') || query.includes('lịch')) {
          responseText = 'Dạ việc đổi chuyến bay/tàu/xe được áp dụng trước giờ khởi hành tối thiểu 4 - 24 tiếng tùy theo hạng vé. Quý khách vui lòng cung cấp Mã đặt vé (PNR) hoặc bấm "Gửi thông tin vé hiện tại" để em hỗ trợ kiểm tra chỗ trống và mức phí chênh lệch ạ.';
        } else if (query.includes('tra cứu') || query.includes('tìm vé') || query.includes('mã vé')) {
          responseText = 'Dạ Quý khách có thể tra cứu vé trực tiếp bằng nút "Tra cứu vé" trên thanh Menu với Mã PNR và Số điện thoại/Email đặt vé, hoặc gửi trực tiếp mã vé vào đây để em kiểm tra ngay cho mình nhé!';
        } else if (query.includes('nhân viên') || query.includes('tư vấn') || query.includes('người thật')) {
          responseText = 'Dạ em là Hoàng Mai - Chuyên viên tư vấn khách hàng OmniTravel đang trực tiếp trao đổi với Quý khách đây ạ. Em luôn sẵn sàng giải đáp và xử lý mọi yêu cầu của Quý khách!';
        } else {
          responseText = 'Dạ em đã nhận được tin nhắn từ Quý khách. Quý khách cần hỗ trợ thêm thông tin gì về vé, hành trình hay chính sách hoàn hủy của OmniTravel không ạ?';
        }

        const replyMessage: IChatMessage = {
          id: `msg-agent-${Date.now()}`,
          sender: 'agent',
          senderName: this.agentInfo.name,
          senderAvatar: this.agentInfo.avatar,
          senderRole: this.agentInfo.role,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          text: responseText,
          status: 'delivered',
          quickActions
        };

        this.notifyMessage(replyMessage);
      }, 1400);
    }, 500);
  }
}

export const chatService: IChatService = new MockChatService();
