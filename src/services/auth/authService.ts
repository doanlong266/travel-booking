import type {
  IUser,
  ISavedPassenger,
  IUserBooking,
  LoginCredentials,
  RegisterPayload,
  PasswordStrength,
} from '@/types/auth.types';
import type { IAuthService, IUserService } from './authService.types';

const STORAGE_KEYS = {
  USER: 'omnitravel_current_user',
  PASSENGERS: 'omnitravel_saved_passengers',
  BOOKINGS: 'omnitravel_user_bookings',
  REWARDS: 'omnitravel_redeemed_vouchers',
};

import {
  DEFAULT_MOCK_USER,
  DEFAULT_SAVED_PASSENGERS,
  DEFAULT_BOOKINGS,
} from '@/data/mockUsers';
import { INITIAL_REDEEMED_VOUCHERS } from '@/data/rewardsData';
import type { IRewardItem, IRedeemedVoucher } from '@/types/rewards.types';

export {
  DEFAULT_MOCK_USER,
  DEFAULT_SAVED_PASSENGERS,
  DEFAULT_BOOKINGS,
};

// Helper to evaluate password strength
export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return 'empty';
  if (password.length < 6) return 'weak';

  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const isLong = password.length >= 8;

  if (isLong && hasLetters && hasNumbers && hasSpecial) return 'strong';
  if (hasLetters && hasNumbers) return 'medium';
  return 'weak';
};

/**
 * AuthService Implementation (SRP & DIP)
 */
class AuthService implements IAuthService {
  getCurrentUser(): IUser | null {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async loginWithPassword(credentials: LoginCredentials): Promise<IUser> {
    await new Promise((r) => setTimeout(r, 600)); // simulate latency

    const identifier = credentials.emailOrPhone.trim().toLowerCase();
    // Allow demo user or dynamic credentials
    let user: IUser;
    if (identifier === 'nam.nguyen@omnitravel.vn' || identifier === '0912345678') {
      user = { ...DEFAULT_MOCK_USER };
    } else {
      user = {
        id: 'usr_' + Date.now(),
        name: credentials.emailOrPhone.includes('@')
          ? credentials.emailOrPhone.split('@')[0].toUpperCase()
          : 'Hành khách ' + credentials.emailOrPhone.slice(-4),
        email: credentials.emailOrPhone.includes('@')
          ? credentials.emailOrPhone
          : `${credentials.emailOrPhone}@user.omnitravel.vn`,
        phone: credentials.emailOrPhone.includes('@') ? '0912345678' : credentials.emailOrPhone,
        membershipTier: 'Silver',
        rewardPoints: 200,
        joinedDate: new Date().toLocaleDateString('vi-VN'),
      };
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }

  async sendOtp(_phone: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 400));
    // Generate a fixed or randomized 6-digit OTP
    const simulatedOtp = '686868';
    return simulatedOtp;
  }

  async loginWithOtp(phone: string, otp: string): Promise<IUser> {
    await new Promise((r) => setTimeout(r, 600));
    if (otp !== '686868' && otp.length !== 6) {
      throw new Error('Mã OTP không chính xác. Vui lòng nhập mã 686868 để thử nghiệm.');
    }

    const user: IUser = {
      ...DEFAULT_MOCK_USER,
      phone: phone.trim(),
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }

  async loginWithSocial(provider: 'google' | 'apple'): Promise<IUser> {
    await new Promise((r) => setTimeout(r, 600));
    const user: IUser = {
      id: `usr_${provider}_` + Date.now(),
      name: provider === 'google' ? 'Nguyễn Hoàng Nam (Google)' : 'Nguyễn Hoàng Nam (Apple)',
      email: provider === 'google' ? 'hoangnam.google@gmail.com' : 'hoangnam.apple@icloud.com',
      phone: '0912345678',
      avatar:
        provider === 'google'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'
          : undefined,
      membershipTier: 'Gold',
      rewardPoints: 500,
      joinedDate: new Date().toLocaleDateString('vi-VN'),
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }

  async register(payload: RegisterPayload): Promise<IUser> {
    await new Promise((r) => setTimeout(r, 700));
    const user: IUser = {
      id: 'usr_' + Date.now(),
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      membershipTier: 'Standard',
      rewardPoints: 100, // Welcome bonus
      joinedDate: new Date().toLocaleDateString('vi-VN'),
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

/**
 * UserService Implementation (SRP & DIP)
 */
class UserService implements IUserService {
  async updateProfile(_userId: string, data: Partial<IUser>): Promise<IUser> {
    await new Promise((r) => setTimeout(r, 400));
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    const current: IUser = raw ? JSON.parse(raw) : DEFAULT_MOCK_USER;
    const updated: IUser = { ...current, ...data };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  }

  async changePassword(_userId: string, oldPass: string, newPass: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 500));
    if (!oldPass || !newPass) return false;
    return true;
  }

  getSavedPassengers(_userId: string): ISavedPassenger[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PASSENGERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PASSENGERS, JSON.stringify(DEFAULT_SAVED_PASSENGERS));
      return DEFAULT_SAVED_PASSENGERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SAVED_PASSENGERS;
    }
  }

  addSavedPassenger(userId: string, passenger: Omit<ISavedPassenger, 'id'>): ISavedPassenger {
    const list = this.getSavedPassengers(userId);
    const newPassenger: ISavedPassenger = {
      ...passenger,
      id: 'psg_' + Date.now(),
    };
    const updated = [newPassenger, ...list];
    localStorage.setItem(STORAGE_KEYS.PASSENGERS, JSON.stringify(updated));
    return newPassenger;
  }

  updateSavedPassenger(userId: string, passenger: ISavedPassenger): ISavedPassenger {
    const list = this.getSavedPassengers(userId);
    const updated = list.map((p) => (p.id === passenger.id ? passenger : p));
    localStorage.setItem(STORAGE_KEYS.PASSENGERS, JSON.stringify(updated));
    return passenger;
  }

  deleteSavedPassenger(userId: string, passengerId: string): boolean {
    const list = this.getSavedPassengers(userId);
    const filtered = list.filter((p) => p.id !== passengerId);
    localStorage.setItem(STORAGE_KEYS.PASSENGERS, JSON.stringify(filtered));
    return true;
  }

  getUserBookings(_userId: string): IUserBooking[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
      return DEFAULT_BOOKINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_BOOKINGS;
    }
  }

  async cancelBooking(_userId: string, bookingId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 500));
    const list = this.getUserBookings(_userId);
    const updated = list.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    return true;
  }

  getRedeemedVouchers(userId: string): IRedeemedVoucher[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REWARDS);
    if (!raw) {
      const initial = INITIAL_REDEEMED_VOUCHERS.filter((v) => v.userId === userId);
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(initial));
      return initial;
    }
    try {
      const all: IRedeemedVoucher[] = JSON.parse(raw);
      return all.filter((v) => v.userId === userId);
    } catch {
      return INITIAL_REDEEMED_VOUCHERS;
    }
  }

  async redeemReward(
    userId: string,
    reward: IRewardItem
  ): Promise<{ success: boolean; voucher?: IRedeemedVoucher; error?: string }> {
    await new Promise((r) => setTimeout(r, 600)); // simulate server processing
    const userRaw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userRaw) {
      return { success: false, error: 'Vui lòng đăng nhập để đổi quà!' };
    }

    const user: IUser = JSON.parse(userRaw);
    if (user.rewardPoints < reward.pointsCost) {
      return {
        success: false,
        error: `Bạn cần thêm ${(reward.pointsCost - user.rewardPoints).toLocaleString('vi-VN')} điểm để đổi quà này!`,
      };
    }

    // Deduct points
    user.rewardPoints -= reward.pointsCost;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    // Generate unique voucher
    const brandPrefix = reward.brand.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'OMNI';
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const barcodeNum = '893' + Math.floor(100000000 + Math.random() * 900000000).toString();
    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const newVoucher: IRedeemedVoucher = {
      id: 'rdm_' + Date.now().toString(36),
      userId,
      rewardId: reward.id,
      rewardTitle: reward.title,
      brand: reward.brand,
      category: reward.category,
      pointsSpent: reward.pointsCost,
      code: `${brandPrefix}-${randomCode}`,
      barcode: barcodeNum,
      redeemedDate:
        now.toLocaleDateString('vi-VN') +
        ' ' +
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      expiryDate: expiry.toLocaleDateString('vi-VN') + ' 23:59',
      status: 'active',
    };

    // Save to list
    const currentVouchers = this.getRedeemedVouchers(userId);
    const updatedVouchers = [newVoucher, ...currentVouchers];
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(updatedVouchers));

    return { success: true, voucher: newVoucher };
  }

  async markVoucherAsUsed(userId: string, voucherId: string): Promise<boolean> {
    const list = this.getRedeemedVouchers(userId);
    const updated = list.map((v) =>
      v.id === voucherId ? { ...v, status: 'used' as const } : v
    );
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(updated));
    return true;
  }
}

// Singletons
export const authService: IAuthService = new AuthService();
export const userService: IUserService = new UserService();
