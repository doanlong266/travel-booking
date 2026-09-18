import type { TransportType } from './location';
import type { IGuestBookingOrder } from './guestLookup.types';

export type RefundStatus = 'pending' | 'processing' | 'approved' | 'completed' | 'rejected';
export type RefundMethodType = 'bank_transfer' | 'omni_points';

export interface IPolicyRule {
  id: string;
  transportType: TransportType;
  carrierName: string;
  carrierCode: string;
  ticketClassName?: string;
  timeframeRules: {
    minHoursBeforeDeparture: number; // e.g. 24
    maxHoursBeforeDeparture?: number; // e.g. null (more than 24h)
    feePercentage: number; // e.g. 10 (%)
    fixedFee?: number; // e.g. 50000 (VND)
    allowExchange: boolean;
    exchangeFee: number;
    description: string;
  }[];
  peakSeasonFeeNote?: string;
  specialConditions: string[];
}

export interface IRefundCalculationResult {
  isEligible: boolean;
  ticketPrice: number;
  feePercentage: number;
  fixedFee: number;
  totalFeeAmount: number;
  netRefundAmount: number;
  bonusPointsAmount: number; // +10% bonus when converting to Omni points
  hoursRemaining: number;
  ruleApplied: string;
  policyNote: string;
  canExchange: boolean;
  exchangeFee: number;
}

export interface IRefundBankInfo {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
}

export interface IRefundRequest {
  requestId: string;
  ticketId: string;
  pnrCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  order: IGuestBookingOrder;
  calculation: IRefundCalculationResult;
  refundMethod: RefundMethodType;
  bankInfo?: IRefundBankInfo;
  reason: string;
  status: RefundStatus;
  createdAt: string;
  completedAt?: string;
  estimatedCompletionTime: string;
  timeline: {
    step: string;
    title: string;
    description: string;
    timestamp: string;
    isCompleted: boolean;
    isCurrent: boolean;
  }[];
}

export interface ISupportChannel {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'phone' | 'message' | 'zap' | 'file-text' | 'rotate-ccw' | 'clock';
  actionType: 'call' | 'link' | 'modal_refund' | 'drawer_policy' | 'chat';
  actionValue: string;
  badge?: string;
}

export interface IFAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'refund' | 'luggage' | 'delay' | 'general';
}
