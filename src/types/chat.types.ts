import type { TransportType } from './location';

export type ChatSenderType = 'user' | 'agent' | 'bot' | 'system';
export type MessageDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface IChatAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: 'image' | 'file';
  previewUrl?: string;
}

export interface IChatQuickAction {
  id: string;
  label: string;
  iconName?: 'Zap' | 'RotateCcw' | 'FileText' | 'UserCheck' | 'Sparkles' | 'Ticket';
  actionType: 'fast_refund' | 'exchange' | 'lookup' | 'human_agent' | 'send_current_ticket' | 'custom';
  payload?: any;
}

export interface IChatTicketPayload {
  bookingId: string;
  pnrCode: string;
  carrierName: string;
  carrierLogo?: string;
  transportType: TransportType;
  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  departureTime: string;
  seatClass: string;
  totalAmount: number;
  paymentStatus: 'confirmed' | 'pending_payment' | 'expired' | 'cancelled';
}

export interface IChatMessage {
  id: string;
  sender: ChatSenderType;
  senderName: string;
  senderAvatar?: string;
  senderRole?: string;
  text?: string;
  timestamp: string;
  status?: MessageDeliveryStatus;
  type?: 'text' | 'ticket' | 'attachment' | 'quick_actions' | 'system_alert';
  ticketPayload?: IChatTicketPayload;
  attachments?: IChatAttachment[];
  quickActions?: IChatQuickAction[];
}

export type ChatConnectionState = 'connecting' | 'connected' | 'queued' | 'offline';

export interface IChatAgentInfo {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
  responseTime: string;
}
