import type { IChatMessage, IChatAgentInfo } from './chat.types';

export type ChatStage = 'TOPIC_SELECTION' | 'CONNECTING' | 'CONNECTED' | 'COMPLETED';

export type SupportTopicId = 
  | 'refund_exchange' 
  | 'payment_issue' 
  | 'baggage_checkin' 
  | 'human_agent' 
  | 'custom_inquiry';

export interface ISupportTopic {
  id: SupportTopicId;
  title: string;
  description: string;
  iconName: 'RotateCcw' | 'CreditCard' | 'Plane' | 'Headphones' | 'ShieldAlert' | 'HelpCircle';
  badgeText?: string;
  contextAgentName?: string;
  defaultPrompt: string;
}

export interface ICsatRating {
  score: number; // 1 to 5
  tags: string[];
  feedback?: string;
  submittedAt?: string;
}

export interface IChatSessionState {
  stage: ChatStage;
  selectedTopic: ISupportTopic | null;
  agentInfo: IChatAgentInfo;
  messages: IChatMessage[];
  isTyping: boolean;
  csatRating: ICsatRating | null;
  isCsatSubmitted: boolean;
}
