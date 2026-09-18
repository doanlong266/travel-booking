import type { 
  IPolicyRule, 
  IRefundCalculationResult, 
  IRefundRequest, 
  IFAQItem 
} from '../types/support.types';
import type { IGuestBookingOrder } from '../types/guestLookup.types';

export interface ITicketRefundService {
  calculateRefund(order: IGuestBookingOrder, customDepartureTime?: string): IRefundCalculationResult;
  submitRefundRequest(
    payload: Omit<IRefundRequest, 'requestId' | 'createdAt' | 'status' | 'timeline' | 'estimatedCompletionTime'>
  ): Promise<IRefundRequest>;
  getRefundRequestById(requestId: string): IRefundRequest | null;
  getAllRefundRequests(): IRefundRequest[];
  getPolicyRules(): IPolicyRule[];
  getFAQs(): IFAQItem[];
}

const REFUND_STORAGE_KEY = 'omniticket_refund_requests_v1';

export const CARRIER_POLICY_RULES: IPolicyRule[] = [
  {
    id: 'policy-flight-vna',
    transportType: 'flight',
    carrierName: 'Vietnam Airlines',
    carrierCode: 'VN',
    ticketClassName: 'Phổ thông Tiêu chuẩn & Thương gia',
    timeframeRules: [
      {
        minHoursBeforeDeparture: 24,
        feePercentage: 10,
        fixedFee: 0,
        allowExchange: true,
        exchangeFee: 150000,
        description: 'Trước khởi hành trên 24 giờ: Phí hoàn 10%, đổi chuyến linh hoạt'
      },
      {
        minHoursBeforeDeparture: 12,
        maxHoursBeforeDeparture: 24,
        feePercentage: 30,
        fixedFee: 0,
        allowExchange: true,
        exchangeFee: 250000,
        description: 'Từ 12 đến 24 giờ: Phí hoàn 30%, đổi chuyến có thu phụ phí'
      },
      {
        minHoursBeforeDeparture: 4,
        maxHoursBeforeDeparture: 12,
        feePercentage: 50,
        fixedFee: 0,
        allowExchange: true,
        exchangeFee: 400000,
        description: 'Từ 4 đến 12 giờ: Phí hoàn 50%, đổi chuyến trước giờ chót'
      },
      {
        minHoursBeforeDeparture: 0,
        maxHoursBeforeDeparture: 4,
        feePercentage: 100,
        fixedFee: 0,
        allowExchange: false,
        exchangeFee: 0,
        description: 'Dưới 4 giờ trước bay: Không hỗ trợ hoàn tự động, vui lòng liên hệ hotline'
      }
    ],
    peakSeasonFeeNote: 'Vào các dịp Cao điểm Tết Nguyên Đán, phí hoàn tăng thêm 10% theo quy định hãng.',
    specialConditions: [
      'Vé đã làm thủ tục trực tuyến (Online Check-in) phải hủy check-in trước khi gửi yêu cầu hoàn tiền.',
      'Thuế, phí sân bay của Nhà nước sẽ được hoàn trả 100% không thu phí khấu trừ.',
      'Tiền hoàn qua ngân hàng sẽ được giải ngân trong 15 - 30 phút theo chuẩn VietQR Fast247.'
    ]
  },
  {
    id: 'policy-flight-vj',
    transportType: 'flight',
    carrierName: 'Vietjet Air',
    carrierCode: 'VJ',
    ticketClassName: 'Eco & Deluxe',
    timeframeRules: [
      {
        minHoursBeforeDeparture: 24,
        feePercentage: 20,
        fixedFee: 200000,
        allowExchange: true,
        exchangeFee: 350000,
        description: 'Trước khởi hành trên 24 giờ: Hoàn bảo lưu định danh hoặc trừ phí 20%'
      },
      {
        minHoursBeforeDeparture: 12,
        maxHoursBeforeDeparture: 24,
        feePercentage: 40,
        fixedFee: 200000,
        allowExchange: true,
        exchangeFee: 450000,
        description: 'Từ 12 đến 24 giờ: Hoàn 60% giá vé trừ phí cố định'
      },
      {
        minHoursBeforeDeparture: 4,
        maxHoursBeforeDeparture: 12,
        feePercentage: 60,
        fixedFee: 200000,
        allowExchange: true,
        exchangeFee: 500000,
        description: 'Từ 4 đến 12 giờ: Hoàn 40% giá vé'
      },
      {
        minHoursBeforeDeparture: 0,
        maxHoursBeforeDeparture: 4,
        feePercentage: 100,
        fixedFee: 0,
        allowExchange: false,
        exchangeFee: 0,
        description: 'Dưới 4 giờ: Không áp dụng hoàn vé tự động'
      }
    ],
    specialConditions: [
      'Hạng vé Promo không hỗ trợ hoàn tiền mặt, chỉ hỗ trợ đổi tên/đổi ngày có tính phí.',
      'Khuyến khích hoàn sang Điểm thưởng OMNI (+10% Bonus) để tái sử dụng ngay lập tức.'
    ]
  },
  {
    id: 'policy-train-dsvn',
    transportType: 'train',
    carrierName: 'Đường sắt Việt Nam (VNR)',
    carrierCode: 'DSVN',
    ticketClassName: 'Ghế mềm & Giường nằm',
    timeframeRules: [
      {
        minHoursBeforeDeparture: 24,
        feePercentage: 10,
        fixedFee: 0,
        allowExchange: true,
        exchangeFee: 20000,
        description: 'Trước giờ tàu chạy > 24 giờ: Khấu trừ 10% giá vé'
      },
      {
        minHoursBeforeDeparture: 4,
        maxHoursBeforeDeparture: 24,
        feePercentage: 20,
        fixedFee: 0,
        allowExchange: true,
        exchangeFee: 50000,
        description: 'Từ 4 đến 24 giờ: Khấu trừ 20% giá vé'
      },
      {
        minHoursBeforeDeparture: 0,
        maxHoursBeforeDeparture: 4,
        feePercentage: 100,
        fixedFee: 0,
        allowExchange: false,
        exchangeFee: 0,
        description: 'Dưới 4 giờ: Không hỗ trợ trả vé'
      }
    ],
    peakSeasonFeeNote: 'Dịp Lễ / Tết: Áp dụng mức khấu trừ 30% khi trả vé trước 24 giờ.',
    specialConditions: [
      'Áp dụng quy chuẩn trả vé điện tử trực tuyến, không cần ra ga lấy biên nhận giấy.',
      'Hỗ trợ đổi sang vé tàu cùng tuyến có ngày chạy khác chỉ với 20.000đ phí dịch vụ.'
    ]
  },
  {
    id: 'policy-bus-futa',
    transportType: 'bus',
    carrierName: 'Phương Trang & Các Nhà Xe Đối Tác',
    carrierCode: 'BUS',
    ticketClassName: 'Giường nằm & Limousine',
    timeframeRules: [
      {
        minHoursBeforeDeparture: 12,
        feePercentage: 10,
        fixedFee: 0,
        allowExchange: true,
        exchangeFee: 0,
        description: 'Trước giờ xuất bến > 12 giờ: Phí hủy 10%, đổi chuyến miễn phí'
      },
      {
        minHoursBeforeDeparture: 2,
        maxHoursBeforeDeparture: 12,
        feePercentage: 20,
        fixedFee: 0,
        allowExchange: true,
        exchangeFee: 30000,
        description: 'Từ 2 đến 12 giờ: Phí hủy 20%, đổi chuyến phụ phí 30.000đ'
      },
      {
        minHoursBeforeDeparture: 0,
        maxHoursBeforeDeparture: 2,
        feePercentage: 100,
        fixedFee: 0,
        allowExchange: false,
        exchangeFee: 0,
        description: 'Dưới 2 giờ: Không áp dụng hủy đổi'
      }
    ],
    specialConditions: [
      'Hủy trước 12h được miễn phí chuyển sang chuyến kế tiếp nếu còn ghế trống.',
      'Tiền hoàn về thẻ hoặc tài khoản thanh toán tự động ngay sau khi xác nhận.'
    ]
  }
];

export const SUPPORT_FAQS: IFAQItem[] = [
  {
    id: 'faq-refund-time',
    category: 'refund',
    question: 'Sau khi gửi yêu cầu hủy vé, bao lâu tôi sẽ nhận được tiền hoàn?',
    answer: 'Hệ thống OmniTravel tích hợp liên ngân hàng tự động VietQR Fast247. Đối với phương thức hoàn tiền về Tài khoản ngân hàng, tiền sẽ vào tài khoản của bạn trong vòng 15 - 30 phút sau khi hệ thống khóa vé thành công. Nếu chọn hoàn vào Điểm OMNI (+10% Bonus), điểm thưởng sẽ được cộng tức thì vào tài khoản để bạn đặt vé mới.'
  },
  {
    id: 'faq-exchange',
    category: 'refund',
    question: 'Tôi muốn đổi sang giờ khác hoặc ngày khác có được không?',
    answer: 'Có! Hệ thống hỗ trợ đổi chuyến trực tuyến cho tất cả vé máy bay, tàu hỏa và xe khách đủ điều kiện (trước giờ khởi hành tối thiểu 4h - 12h tùy phương tiện). Bạn chỉ cần trả phí chênh lệch giá vé (nếu có) và phí đổi quy định theo hãng.'
  },
  {
    id: 'faq-late',
    category: 'delay',
    question: 'Nếu tôi đến muộn hoặc lỡ chuyến thì xử lý như thế nào?',
    answer: 'Nếu bạn có nguy cơ trễ chuyến, vui lòng liên hệ ngay Hotline Khẩn Cấp 1900 6868 trước giờ khởi hành ít nhất 60 phút. Nhân viên hỗ trợ sẽ can thiệp hỗ trợ đổi chuyến kế tiếp (áp dụng theo quy chế No-Show của từng hãng).'
  },
  {
    id: 'faq-luggage',
    category: 'luggage',
    question: 'Quy định về hành lý xách tay và ký gửi như thế nào?',
    answer: 'Vé máy bay tiêu chuẩn đã bao gồm 7 - 12kg hành lý xách tay. Vé tàu hỏa cho phép mang tối đa 20kg hành lý cá nhân. Vé xe khách cho phép mang vali tiêu chuẩn dưới 20kg trong khoang chứa đồ. Bạn có thể xem chi tiết trên vé điện tử của mình.'
  }
];

class RefundCalculationService implements ITicketRefundService {
  public calculateRefund(order: IGuestBookingOrder, customDepartureTime?: string): IRefundCalculationResult {
    const depTime = new Date(customDepartureTime || order.departureTime).getTime();
    const now = Date.now();
    const diffMs = depTime - now;
    const hoursRemaining = Math.max(0, parseFloat((diffMs / (1000 * 60 * 60)).toFixed(1)));

    const ticketPrice = order.totalAmount || 0;

    // Determine matching policy
    const policy = CARRIER_POLICY_RULES.find(p => 
      p.transportType === order.transportType && 
      (p.carrierCode === order.carrierCode || p.carrierName.toLowerCase().includes(order.carrierName.toLowerCase()))
    ) || CARRIER_POLICY_RULES.find(p => p.transportType === order.transportType) || CARRIER_POLICY_RULES[0];

    // Find rule matching timeframe
    const matchedRule = policy.timeframeRules.find(r => {
      if (r.maxHoursBeforeDeparture !== undefined) {
        return hoursRemaining >= r.minHoursBeforeDeparture && hoursRemaining < r.maxHoursBeforeDeparture;
      }
      return hoursRemaining >= r.minHoursBeforeDeparture;
    }) || policy.timeframeRules[policy.timeframeRules.length - 1];

    const feePercentage = matchedRule.feePercentage;
    const fixedFee = matchedRule.fixedFee || 0;
    const isEligible = feePercentage < 100;

    let totalFeeAmount = 0;
    let netRefundAmount = 0;

    if (isEligible) {
      totalFeeAmount = Math.round((ticketPrice * feePercentage) / 100) + fixedFee;
      totalFeeAmount = Math.min(ticketPrice, totalFeeAmount);
      netRefundAmount = Math.max(0, ticketPrice - totalFeeAmount);
    } else {
      totalFeeAmount = ticketPrice;
      netRefundAmount = 0;
    }

    // 1000 VND = 1 point, plus 10% bonus
    const bonusPointsAmount = Math.round((netRefundAmount / 1000) * 1.10);

    return {
      isEligible,
      ticketPrice,
      feePercentage,
      fixedFee,
      totalFeeAmount,
      netRefundAmount,
      bonusPointsAmount,
      hoursRemaining,
      ruleApplied: matchedRule.description,
      policyNote: policy.peakSeasonFeeNote || policy.specialConditions[0] || '',
      canExchange: matchedRule.allowExchange,
      exchangeFee: matchedRule.exchangeFee
    };
  }

  public async submitRefundRequest(
    payload: Omit<IRefundRequest, 'requestId' | 'createdAt' | 'status' | 'timeline' | 'estimatedCompletionTime'>
  ): Promise<IRefundRequest> {
    await new Promise(r => setTimeout(r, 600));

    const requestId = `REFUND-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const nowIso = new Date().toISOString();
    const estTime = new Date(Date.now() + 20 * 60 * 1000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const newRequest: IRefundRequest = {
      ...payload,
      requestId,
      createdAt: nowIso,
      status: 'processing',
      estimatedCompletionTime: estTime,
      timeline: [
        {
          step: 'received',
          title: 'Tiếp nhận yêu cầu tự động',
          description: `Yêu cầu hoàn vé ${payload.ticketId} đã được hệ thống ghi nhận`,
          timestamp: 'Vừa xong',
          isCompleted: true,
          isCurrent: false
        },
        {
          step: 'carrier_lock',
          title: 'Khóa chỗ & Hãng vận chuyển xác nhận',
          description: `Đang kết nối API ${payload.order.carrierName} để giải phóng vị trí ghế`,
          timestamp: 'Ước tính: ~5 phút',
          isCompleted: false,
          isCurrent: true
        },
        {
          step: 'disbursement',
          title: payload.refundMethod === 'omni_points' ? 'Cộng điểm OMNI (+10% Bonus)' : 'Ngân hàng giải ngân tiền hoàn',
          description: payload.refundMethod === 'omni_points' 
            ? `Cộng ngay ${payload.calculation.bonusPointsAmount.toLocaleString()} điểm OMNI vào tài khoản`
            : `Chuyển ${payload.calculation.netRefundAmount.toLocaleString()} đ qua VietQR đến STK ${payload.bankInfo?.accountNumber || ''}`,
          timestamp: 'Ước tính: ~15 - 20 phút',
          isCompleted: false,
          isCurrent: false
        }
      ]
    };

    try {
      const all = this.getAllRefundRequests();
      const updated = [newRequest, ...all];
      localStorage.setItem(REFUND_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable
    }

    return newRequest;
  }

  public getAllRefundRequests(): IRefundRequest[] {
    try {
      const raw = localStorage.getItem(REFUND_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return [];
  }

  public getRefundRequestById(requestId: string): IRefundRequest | null {
    const all = this.getAllRefundRequests();
    return all.find(r => r.requestId.toUpperCase() === requestId.toUpperCase()) || null;
  }

  public getPolicyRules(): IPolicyRule[] {
    return CARRIER_POLICY_RULES;
  }

  public getFAQs(): IFAQItem[] {
    return SUPPORT_FAQS;
  }
}

export const refundCalculationService: ITicketRefundService = new RefundCalculationService();
