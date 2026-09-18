export type MembershipTier = 'Standard' | 'Silver' | 'Gold' | 'Diamond';

export interface ITierConfig {
  key: MembershipTier;
  label: string;      // 'Hạng Chuẩn' | 'Hạng Bạc' | 'Hạng Vàng' | 'Hạng Kim Cương'
  shortLabel: string; // 'Chuẩn' | 'Bạc' | 'Vàng' | 'Kim Cương'
  nextTier: string;   // 'Hạng Bạc' | 'Hạng Vàng' | 'Hạng Kim Cương' | 'Tối Đa'
  needed: number;     // 300 | 500 | 1000 | 0
  bg: string;         // Linear gradient for dark / vibrant cards and chips
  color: string;      // Accent text color for light chips
  chipBg: string;     // Soft background for light badges
}

export const MEMBERSHIP_TIER_CONFIG: Record<MembershipTier, ITierConfig> = {
  Standard: {
    key: 'Standard',
    label: 'Hạng Chuẩn',
    shortLabel: 'Chuẩn',
    nextTier: 'Hạng Bạc',
    needed: 300,
    bg: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
    color: '#475569',
    chipBg: '#f1f5f9',
  },
  Silver: {
    key: 'Silver',
    label: 'Hạng Bạc',
    shortLabel: 'Bạc',
    nextTier: 'Hạng Vàng',
    needed: 500,
    bg: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)',
    color: '#334155',
    chipBg: '#e2e8f0',
  },
  Gold: {
    key: 'Gold',
    label: 'Hạng Vàng',
    shortLabel: 'Vàng',
    nextTier: 'Hạng Kim Cương',
    needed: 1000,
    bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#b45309',
    chipBg: '#fef3c7',
  },
  Diamond: {
    key: 'Diamond',
    label: 'Hạng Kim Cương',
    shortLabel: 'Kim Cương',
    nextTier: 'Tối Đa',
    needed: 0,
    bg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    color: '#4338ca',
    chipBg: '#e0e7ff',
  },
};

export const getMembershipTierInfo = (tier?: MembershipTier): ITierConfig => {
  return (tier && MEMBERSHIP_TIER_CONFIG[tier]) || MEMBERSHIP_TIER_CONFIG.Standard;
};

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  membershipTier: MembershipTier;
  rewardPoints: number;
  identityCard?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  joinedDate: string;
}

export interface ISavedPassenger {
  id: string;
  fullName: string;
  identityCard: string;
  phone: string;
  relationship: 'Bản thân' | 'Vợ / Chồng' | 'Con cái' | 'Bố / Mẹ' | 'Bạn bè' | 'Đồng nghiệp';
  gender: 'male' | 'female';
  birthday?: string;
}

export interface IUserBooking {
  id: string;
  ticketId: string;
  transportType: 'flight' | 'train' | 'bus';
  carrierCode: string;
  carrierName: string;
  originCity: string;
  originStation: string;
  destinationCity: string;
  destinationStation: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  seats: string[];
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingDate: string;
  passengers: { name: string; type: string }[];
  qrDataUrl?: string;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password?: string;
  rememberMe?: boolean;
}

export interface OtpCredentials {
  phone: string;
  otp: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  agreeTerms: boolean;
}

export type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

export type DashboardTab = 'bookings' | 'rewards' | 'profile' | 'security';
