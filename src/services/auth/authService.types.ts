import type {
  IUser,
  ISavedPassenger,
  IUserBooking,
  LoginCredentials,
  RegisterPayload,
} from '@/types/auth.types';
import type { IRewardItem, IRedeemedVoucher } from '@/types/rewards.types';

/**
 * Interface Segregation Principle (ISP) & Dependency Inversion Principle (DIP):
 * Separate authentication actions from user data / profile management.
 */
export interface IAuthService {
  getCurrentUser(): IUser | null;
  loginWithPassword(credentials: LoginCredentials): Promise<IUser>;
  sendOtp(phone: string): Promise<string>;
  loginWithOtp(phone: string, otp: string): Promise<IUser>;
  loginWithSocial(provider: 'google' | 'apple'): Promise<IUser>;
  register(payload: RegisterPayload): Promise<IUser>;
  logout(): void;
}

export interface IUserService {
  updateProfile(userId: string, data: Partial<IUser>): Promise<IUser>;
  changePassword(userId: string, oldPass: string, newPass: string): Promise<boolean>;
  getSavedPassengers(userId: string): ISavedPassenger[];
  addSavedPassenger(userId: string, passenger: Omit<ISavedPassenger, 'id'>): ISavedPassenger;
  updateSavedPassenger(userId: string, passenger: ISavedPassenger): ISavedPassenger;
  deleteSavedPassenger(userId: string, passengerId: string): boolean;
  getUserBookings(userId: string): IUserBooking[];
  cancelBooking(userId: string, bookingId: string): Promise<boolean>;
  getRedeemedVouchers(userId: string): IRedeemedVoucher[];
  redeemReward(userId: string, reward: IRewardItem): Promise<{ success: boolean; voucher?: IRedeemedVoucher; error?: string }>;
  markVoucherAsUsed(userId: string, voucherId: string): Promise<boolean>;
}

