import type { IGuestBookingOrder, GuestBookingStatus } from '../types/guestLookup.types';

export interface IGuestLookupService {
  lookup(bookingId: string, phoneOrEmail: string): Promise<IGuestBookingOrder | null>;
  getBookingById(bookingId: string): Promise<IGuestBookingOrder | null>;
  saveBooking(order: IGuestBookingOrder): void;
  getAllBookings(): IGuestBookingOrder[];
  resendTicketEmail(bookingId: string, email: string): Promise<{ success: boolean; message: string }>;
  cancelBooking(bookingId: string): Promise<{ success: boolean; message: string }>;
}

const STORAGE_KEY = 'omniticket_guest_orders_v1';

const INITIAL_MOCK_BOOKINGS: IGuestBookingOrder[] = [
  {
    bookingId: 'TKT-VN-2026-89412X',
    pnrCode: 'VN89412X',
    transportType: 'flight',
    carrierId: 'vietnam-airlines',
    carrierName: 'Vietnam Airlines',
    carrierLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80',
    carrierCode: 'VN',
    vehicleNumber: 'VN 218',
    vehicleName: 'Boeing 787-9 Dreamliner',
    origin: {
      name: 'Sân bay Quốc tế Nội Bài',
      city: 'Hà Nội',
      code: 'HAN',
      terminal: 'Nhà ga T1'
    },
    destination: {
      name: 'Sân bay Quốc tế Tân Sơn Nhất',
      city: 'Hồ Chí Minh',
      code: 'SGN',
      terminal: 'Nhà ga T1'
    },
    departureTime: '2026-10-20T08:00:00+07:00',
    arrivalTime: '2026-10-20T10:15:00+07:00',
    durationMinutes: 135,
    seatClassName: 'Phổ thông Tiêu chuẩn',
    passengers: [
      {
        fullName: 'NGUYEN VAN AN',
        idNumber: '001095012345',
        phone: '0912345678',
        email: 'doanle@omniticket.vn',
        passengerType: 'adult',
        gender: 'male',
        selectedSeatId: 'seat-12a',
        seatNumber: '12A'
      },
      {
        fullName: 'LE THI BINH',
        idNumber: '001196023456',
        phone: '0912345678',
        email: 'doanle@omniticket.vn',
        passengerType: 'adult',
        gender: 'female',
        selectedSeatId: 'seat-12b',
        seatNumber: '12B'
      }
    ],
    contact: {
      fullName: 'Nguyễn Văn An',
      phone: '0912345678',
      email: 'doanle@omniticket.vn'
    },
    totalAmount: 3850000,
    paymentStatus: 'confirmed',
    paymentMethod: 'VietQR Chuyển khoản',
    bookingDate: '2026-09-15T14:30:00+07:00',
    paidAt: '2026-09-15T14:35:12+07:00',
    qrData: 'OMNITICKET|TKT-VN-2026-89412X|VN89412X|HAN-SGN|20261020|12A,12B',
    baggagePolicy: {
      carryOnKg: 12,
      checkedKg: 23
    },
    cancellationPolicy: 'Hoàn đổi có tính phí trước 24h khởi hành'
  },
  {
    bookingId: 'TKT-TRAIN-2026-44810A',
    pnrCode: 'SE1-44810',
    transportType: 'train',
    carrierId: 'dsvn',
    carrierName: 'Đường sắt Việt Nam',
    carrierLogo: 'https://images.unsplash.com/photo-1532103054090-a33923a78321?w=120&auto=format&fit=crop&q=80',
    carrierCode: 'DSVN',
    vehicleNumber: 'SE 1',
    vehicleName: 'Đoàn tàu SE thế hệ mới',
    origin: {
      name: 'Ga Hà Nội',
      city: 'Hà Nội',
      code: 'HAN',
      terminal: 'Cửa số 2, Đường Trần Quý Cáp'
    },
    destination: {
      name: 'Ga Đà Nẵng',
      city: 'Đà Nẵng',
      code: 'DAD',
      terminal: 'Ga chính Hải Phòng, Thanh Khê'
    },
    departureTime: '2026-10-25T19:30:00+07:00',
    arrivalTime: '2026-10-26T11:45:00+07:00',
    durationMinutes: 975,
    seatClassName: 'Giường nằm Khoang 4 Điều hòa',
    passengers: [
      {
        fullName: 'TRAN MINH TRI',
        idNumber: '048092008899',
        phone: '0987654321',
        email: 'minhtri@gmail.com',
        passengerType: 'adult',
        gender: 'male',
        selectedSeatId: 'seat-t3-18',
        seatNumber: 'Toa 3 - Ghế 18'
      }
    ],
    contact: {
      fullName: 'Trần Minh Trí',
      phone: '0987654321',
      email: 'minhtri@gmail.com'
    },
    totalAmount: 1150000,
    paymentStatus: 'confirmed',
    paymentMethod: 'Thẻ ATM Nội Địa',
    bookingDate: '2026-09-16T10:15:00+07:00',
    paidAt: '2026-09-16T10:18:22+07:00',
    qrData: 'OMNITICKET|TKT-TRAIN-2026-44810A|SE1-44810|HAN-DAD|20261025|T3-18',
    baggagePolicy: {
      carryOnKg: 20,
      checkedKg: 0
    },
    cancellationPolicy: 'Trả vé khấu trừ 10% trước 4 giờ khởi hành'
  },
  {
    bookingId: 'TKT-BUS-2026-90215F',
    pnrCode: 'FUTA90215',
    transportType: 'bus',
    carrierId: 'futa',
    carrierName: 'Phương Trang FUTA Bus Lines',
    carrierLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&auto=format&fit=crop&q=80',
    carrierCode: 'FUTA',
    vehicleNumber: '51B-882.19',
    vehicleName: 'Xe Limousine 34 Phòng VIP',
    origin: {
      name: 'Bến xe Miền Tây',
      city: 'Hồ Chí Minh',
      code: 'BXMT',
      terminal: 'Phòng vé 12, Quầy 5'
    },
    destination: {
      name: 'Bến xe Trung tâm Cần Thơ',
      city: 'Cần Thơ',
      code: 'CTHO',
      terminal: 'Cửa trả khách Nam Sông Hậu'
    },
    departureTime: '2026-10-18T14:00:00+07:00',
    arrivalTime: '2026-10-18T17:30:00+07:00',
    durationMinutes: 210,
    seatClassName: 'Phòng VIP Giường Nằm',
    passengers: [
      {
        fullName: 'HOANG MAI LAN',
        idNumber: '079198004567',
        phone: '0903112233',
        email: 'mailan@outlook.com',
        passengerType: 'adult',
        gender: 'female',
        selectedSeatId: 'seat-a04',
        seatNumber: 'Phòng A04 (Tầng dưới)'
      }
    ],
    contact: {
      fullName: 'Hoàng Mai Lan',
      phone: '0903112233',
      email: 'mailan@outlook.com'
    },
    totalAmount: 230000,
    paymentStatus: 'pending_payment',
    paymentMethod: 'VietQR Chuyển khoản',
    bookingDate: '2026-09-18T08:30:00+07:00',
    paymentExpiresAt: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
    qrData: 'OMNITICKET|TKT-BUS-2026-90215F|FUTA90215|BXMT-CTHO|20261018|A04',
    baggagePolicy: {
      carryOnKg: 10,
      checkedKg: 20
    },
    cancellationPolicy: 'Hỗ trợ đổi chuyến miễn phí trước 2 giờ'
  },
  {
    bookingId: 'TKT-VJ-2026-11209Z',
    pnrCode: 'VJ11209Z',
    transportType: 'flight',
    carrierId: 'vietjet-air',
    carrierName: 'Vietjet Air',
    carrierLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&auto=format&fit=crop&q=80',
    carrierCode: 'VJ',
    vehicleNumber: 'VJ 198',
    vehicleName: 'Airbus A321 Neo',
    origin: {
      name: 'Sân bay Quốc tế Tân Sơn Nhất',
      city: 'Hồ Chí Minh',
      code: 'SGN',
      terminal: 'Nhà ga Quốc nội'
    },
    destination: {
      name: 'Sân bay Quốc tế Đà Nẵng',
      city: 'Đà Nẵng',
      code: 'DAD',
      terminal: 'Nhà ga T1'
    },
    departureTime: '2026-10-10T06:30:00+07:00',
    arrivalTime: '2026-10-10T07:50:00+07:00',
    durationMinutes: 80,
    seatClassName: 'Eco Tiết kiệm',
    passengers: [
      {
        fullName: 'VO QUOC THANG',
        phone: '0938889999',
        email: 'test@vietjet.com',
        passengerType: 'adult',
        gender: 'male',
        seatNumber: '24F'
      }
    ],
    contact: {
      fullName: 'Võ Quốc Thắng',
      phone: '0938889999',
      email: 'test@vietjet.com'
    },
    totalAmount: 1450000,
    paymentStatus: 'expired',
    bookingDate: '2026-09-10T09:00:00+07:00',
    paymentExpiresAt: '2026-09-10T09:15:00+07:00',
    qrData: 'OMNITICKET|TKT-VJ-2026-11209Z|VJ11209Z|SGN-DAD|EXPIRED',
    cancellationPolicy: 'Vé không hoàn tiền khi đã hết hạn thanh toán'
  }
];

class GuestLookupService implements IGuestLookupService {
  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_BOOKINGS));
      }
    } catch {
      // Storage unavailable or disabled
    }
  }

  public getAllBookings(): IGuestBookingOrder[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_MOCK_BOOKINGS;
  }

  public saveBooking(order: IGuestBookingOrder): void {
    try {
      const all = this.getAllBookings();
      const existingIdx = all.findIndex(b => b.bookingId.toUpperCase() === order.bookingId.toUpperCase());
      let updated: IGuestBookingOrder[];
      if (existingIdx >= 0) {
        updated = [...all];
        updated[existingIdx] = order;
      } else {
        updated = [order, ...all];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save guest booking order:', e);
    }
  }

  private normalizeText(input: string): string {
    return (input || '').trim().toLowerCase().replace(/[\s-+()]/g, '');
  }

  public async lookup(bookingId: string, phoneOrEmail: string): Promise<IGuestBookingOrder | null> {
    // Artificial latency for smooth async feel
    await new Promise(r => setTimeout(r, 400));

    const cleanBookingId = (bookingId || '').trim().toUpperCase();
    const cleanIdentifier = this.normalizeText(phoneOrEmail);

    if (!cleanBookingId || !cleanIdentifier) {
      return null;
    }

    const all = this.getAllBookings();

    const match = all.find(b => {
      const matchId = 
        b.bookingId.toUpperCase() === cleanBookingId ||
        b.pnrCode.toUpperCase() === cleanBookingId ||
        cleanBookingId.includes(b.pnrCode.toUpperCase()) ||
        b.bookingId.toUpperCase().includes(cleanBookingId);

      if (!matchId) return false;

      const contactPhoneNorm = this.normalizeText(b.contact.phone);
      const contactEmailNorm = (b.contact.email || '').trim().toLowerCase();
      
      const isPhoneMatch = contactPhoneNorm.includes(cleanIdentifier) || cleanIdentifier.includes(contactPhoneNorm);
      const isEmailMatch = contactEmailNorm === cleanIdentifier;

      const isPassengerMatch = b.passengers.some(p => {
        const pPhone = this.normalizeText(p.phone || '');
        const pEmail = (p.email || '').trim().toLowerCase();
        return (pPhone && (pPhone.includes(cleanIdentifier) || cleanIdentifier.includes(pPhone))) ||
               (pEmail && pEmail === cleanIdentifier);
      });

      return isPhoneMatch || isEmailMatch || isPassengerMatch;
    });

    return match || null;
  }

  public async getBookingById(bookingId: string): Promise<IGuestBookingOrder | null> {
    await new Promise(r => setTimeout(r, 200));
    const cleanId = (bookingId || '').trim().toUpperCase();
    const all = this.getAllBookings();
    return all.find(b => 
      b.bookingId.toUpperCase() === cleanId || 
      b.pnrCode.toUpperCase() === cleanId
    ) || null;
  }

  public async resendTicketEmail(bookingId: string, email: string): Promise<{ success: boolean; message: string }> {
    await new Promise(r => setTimeout(r, 600));
    const booking = await this.getBookingById(bookingId);
    if (!booking) {
      return { success: false, message: 'Không tìm thấy thông tin mã vé.' };
    }
    return {
      success: true,
      message: `Vé điện tử ${booking.bookingId} đã được gửi thành công đến hòm thư ${email}`
    };
  }

  public async cancelBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
    await new Promise(r => setTimeout(r, 500));
    const all = this.getAllBookings();
    const idx = all.findIndex(b => b.bookingId.toUpperCase() === bookingId.toUpperCase());
    if (idx < 0) {
      return { success: false, message: 'Không tìm thấy vé cần hủy.' };
    }
    all[idx].paymentStatus = 'cancelled' as GuestBookingStatus;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return { success: true, message: 'Đã cập nhật trạng thái hủy vé.' };
  }
}

export const guestLookupService: IGuestLookupService = new GuestLookupService();
