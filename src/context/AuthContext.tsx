import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import type {
  IUser,
  ISavedPassenger,
  IUserBooking,
  LoginCredentials,
  RegisterPayload,
} from '@/types/auth.types';
import type { IRewardItem, IRedeemedVoucher } from '@/types/rewards.types';
import { authService, userService } from '@/services/auth/authService';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  savedPassengers: ISavedPassenger[];
  userBookings: IUserBooking[];
  redeemedVouchers: IRedeemedVoucher[];

  // Auth operations
  login: (credentials: LoginCredentials) => Promise<boolean>;
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>;
  sendOtp: (phone: string) => Promise<string>;
  loginWithSocial: (provider: 'google' | 'apple') => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;

  // User management
  updateProfile: (data: Partial<IUser>) => Promise<boolean>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
  addSavedPassenger: (passenger: Omit<ISavedPassenger, 'id'>) => void;
  updateSavedPassenger: (passenger: ISavedPassenger) => void;
  deleteSavedPassenger: (id: string) => void;
  cancelBooking: (bookingId: string) => Promise<boolean>;

  // Loyalty & Rewards
  redeemReward: (reward: IRewardItem) => Promise<IRedeemedVoucher | null>;
  markVoucherAsUsed: (voucherId: string) => Promise<boolean>;

  // Modal / Dashboard Visibility Controls
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;

  isDashboardOpen: boolean;
  dashboardActiveTab: 'bookings' | 'profile' | 'security' | 'rewards';
  openDashboard: (tab?: 'bookings' | 'profile' | 'security' | 'rewards') => void;
  closeDashboard: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    return authService.getCurrentUser();
  });
  const [savedPassengers, setSavedPassengers] = useState<ISavedPassenger[]>([]);
  const [userBookings, setUserBookings] = useState<IUserBooking[]>([]);
  const [redeemedVouchers, setRedeemedVouchers] = useState<IRedeemedVoucher[]>([]);

  // Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Dashboard state
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardActiveTab, setDashboardActiveTab] = useState<'bookings' | 'profile' | 'security' | 'rewards'>('bookings');

  // Refresh passenger and booking lists
  const refreshUserData = useCallback((userId: string) => {
    const passengers = userService.getSavedPassengers(userId);
    const bookings = userService.getUserBookings(userId);
    const vouchers = userService.getRedeemedVouchers(userId);
    setSavedPassengers(passengers);
    setUserBookings(bookings);
    setRedeemedVouchers(vouchers);
  }, []);

  useEffect(() => {
    if (user) {
      refreshUserData(user.id);
    } else {
      setSavedPassengers([]);
      setUserBookings([]);
      setRedeemedVouchers([]);
    }
  }, [user, refreshUserData]);

  // Auth actions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const loggedUser = await authService.loginWithPassword(credentials);
      setUser(loggedUser);
      message.success(`Chào mừng ${loggedUser.name} đã quay trở lại!`);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại';
      message.error(msg);
      return false;
    }
  };

  const sendOtp = async (phone: string): Promise<string> => {
    try {
      const otp = await authService.sendOtp(phone);
      message.info(`Mã OTP xác thực đã được gửi đến số ${phone}: ${otp}`);
      return otp;
    } catch {
      message.error('Không thể gửi mã OTP, vui lòng thử lại.');
      throw new Error('OTP send failed');
    }
  };

  const loginWithOtp = async (phone: string, otp: string): Promise<boolean> => {
    try {
      const loggedUser = await authService.loginWithOtp(phone, otp);
      setUser(loggedUser);
      message.success(`Đăng nhập thành công! Xin chào ${loggedUser.name}`);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Mã OTP không hợp lệ';
      message.error(msg);
      return false;
    }
  };

  const loginWithSocial = async (provider: 'google' | 'apple'): Promise<boolean> => {
    try {
      const loggedUser = await authService.loginWithSocial(provider);
      setUser(loggedUser);
      message.success(`Đăng nhập thành công với tài khoản ${provider === 'google' ? 'Google' : 'Apple'}!`);
      setIsAuthModalOpen(false);
      return true;
    } catch {
      message.error('Đăng nhập bằng mạng xã hội thất bại');
      return false;
    }
  };

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    try {
      const newUser = await authService.register(payload);
      setUser(newUser);
      message.success('Đăng ký tài khoản thành công! Bạn nhận được 100 điểm thưởng chào mừng.');
      setIsAuthModalOpen(false);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đăng ký thất bại';
      message.error(msg);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsDashboardOpen(false);
    message.info('Đã đăng xuất khỏi hệ thống OMNITRAVEL.');
  };

  // User Profile actions
  const updateProfile = async (data: Partial<IUser>): Promise<boolean> => {
    if (!user) return false;
    try {
      const updated = await userService.updateProfile(user.id, data);
      setUser(updated);
      message.success('Cập nhật thông tin cá nhân thành công!');
      return true;
    } catch {
      message.error('Không thể cập nhật hồ sơ');
      return false;
    }
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const success = await userService.changePassword(user.id, oldPass, newPass);
      if (success) {
        message.success('Đổi mật khẩu thành công!');
        return true;
      }
      message.error('Mật khẩu hiện tại không đúng');
      return false;
    } catch {
      message.error('Đổi mật khẩu thất bại');
      return false;
    }
  };

  const addSavedPassenger = (passenger: Omit<ISavedPassenger, 'id'>) => {
    if (!user) return;
    const created = userService.addSavedPassenger(user.id, passenger);
    setSavedPassengers((prev) => [created, ...prev]);
    message.success(`Đã lưu "${created.fullName}" vào danh bạ hành khách.`);
  };

  const updateSavedPassenger = (passenger: ISavedPassenger) => {
    if (!user) return;
    const updated = userService.updateSavedPassenger(user.id, passenger);
    setSavedPassengers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    message.success('Đã cập nhật thông tin hành khách.');
  };

  const deleteSavedPassenger = (id: string) => {
    if (!user) return;
    userService.deleteSavedPassenger(user.id, id);
    setSavedPassengers((prev) => prev.filter((p) => p.id !== id));
    message.success('Đã xóa hành khách khỏi danh bạ.');
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await userService.cancelBooking(user.id, bookingId);
      setUserBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
      );
      message.success('Yêu cầu hủy vé đã được ghi nhận. Số tiền hoàn sẽ được chuyển trong 1-3 ngày.');
      return true;
    } catch {
      message.error('Không thể hủy vé');
      return false;
    }
  };

  const redeemReward = async (reward: IRewardItem): Promise<IRedeemedVoucher | null> => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để đổi quà!');
      openAuthModal('login');
      return null;
    }
    try {
      const res = await userService.redeemReward(user.id, reward);
      if (res.success && res.voucher) {
        setUser((prev) =>
          prev ? { ...prev, rewardPoints: prev.rewardPoints - reward.pointsCost } : null
        );
        setRedeemedVouchers((prev) => [res.voucher!, ...prev]);
        message.success(`Đổi thành công: ${reward.title}! Đã lưu vào ví voucher.`);
        return res.voucher;
      } else {
        message.warning(res.error || 'Không thể đổi quà');
        return null;
      }
    } catch {
      message.error('Lỗi kết nối khi đổi quà');
      return null;
    }
  };

  const markVoucherAsUsed = async (voucherId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await userService.markVoucherAsUsed(user.id, voucherId);
      setRedeemedVouchers((prev) =>
        prev.map((v) => (v.id === voucherId ? { ...v, status: 'used' as const } : v))
      );
      message.success('Đã cập nhật trạng thái voucher sang "Đã sử dụng".');
      return true;
    } catch {
      message.error('Không thể cập nhật trạng thái voucher');
      return false;
    }
  };

  // Visibility Handlers
  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openDashboard = (tab: 'bookings' | 'profile' | 'security' | 'rewards' = 'bookings') => {
    setDashboardActiveTab(tab);
    setIsDashboardOpen(true);
  };

  const closeDashboard = () => {
    setIsDashboardOpen(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    savedPassengers,
    userBookings,
    redeemedVouchers,
    login,
    loginWithOtp,
    sendOtp,
    loginWithSocial,
    register,
    logout,
    updateProfile,
    changePassword,
    addSavedPassenger,
    updateSavedPassenger,
    deleteSavedPassenger,
    cancelBooking,
    redeemReward,
    markVoucherAsUsed,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    isDashboardOpen,
    dashboardActiveTab,
    openDashboard,
    closeDashboard,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
