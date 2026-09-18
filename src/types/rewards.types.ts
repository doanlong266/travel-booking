export type RewardCategory = 'all' | 'fnb' | 'data' | 'topup' | 'travel';

export interface IRewardItem {
  id: string;
  title: string;
  brand: string;
  category: 'fnb' | 'data' | 'topup' | 'travel';
  pointsCost: number;
  originalValue: string;
  description: string;
  terms: string[];
  image: string;
  badge?: string;
  stock: number;
  highlightColor?: string;
}

export interface IRedeemedVoucher {
  id: string;
  userId: string;
  rewardId: string;
  rewardTitle: string;
  brand: string;
  category: 'fnb' | 'data' | 'topup' | 'travel';
  pointsSpent: number;
  code: string;
  barcode: string;
  redeemedDate: string;
  expiryDate: string;
  status: 'active' | 'used' | 'expired';
}

export interface IPointTransaction {
  id: string;
  date: string;
  type: 'earn' | 'spend';
  description: string;
  amount: number;
  balanceAfter: number;
  category: 'booking' | 'reward' | 'bonus';
  code?: string;
}
