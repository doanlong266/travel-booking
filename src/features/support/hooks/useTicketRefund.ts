import { useState, useCallback } from 'react';
import type { 
  IRefundCalculationResult, 
  IRefundBankInfo, 
  IRefundRequest, 
  RefundMethodType 
} from '../../../types/support.types';
import type { IGuestBookingOrder } from '../../../types/guestLookup.types';
import { guestLookupService } from '../../../services/guestLookup.service';
import { refundCalculationService } from '../../../services/refundCalculation.service';

export interface UseTicketRefundReturn {
  currentStep: number;
  selectedOrder: IGuestBookingOrder | null;
  calculation: IRefundCalculationResult | null;
  refundMethod: RefundMethodType;
  bankInfo: IRefundBankInfo;
  reason: string;
  createdRequest: IRefundRequest | null;
  isLoading: boolean;
  error: string | null;
  lookupTicketForRefund: (ticketId: string, phoneOrEmail: string) => Promise<boolean>;
  selectOrderDirectly: (order: IGuestBookingOrder) => void;
  setRefundMethod: (method: RefundMethodType) => void;
  setBankInfo: React.Dispatch<React.SetStateAction<IRefundBankInfo>>;
  setReason: (reason: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  submitRefund: () => Promise<boolean>;
  reset: () => void;
}

const DEFAULT_BANK_INFO: IRefundBankInfo = {
  bankName: 'Vietcombank (Ngân Hàng Ngoại Thương)',
  bankCode: 'VCB',
  accountNumber: '',
  accountHolder: ''
};

export const useTicketRefund = (): UseTicketRefundReturn => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedOrder, setSelectedOrder] = useState<IGuestBookingOrder | null>(null);
  const [calculation, setCalculation] = useState<IRefundCalculationResult | null>(null);
  const [refundMethod, setRefundMethod] = useState<RefundMethodType>('bank_transfer');
  const [bankInfo, setBankInfo] = useState<IRefundBankInfo>(DEFAULT_BANK_INFO);
  const [reason, setReason] = useState<string>('Thay đổi kế hoạch cá nhân');
  const [createdRequest, setCreatedRequest] = useState<IRefundRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectOrderDirectly = useCallback((order: IGuestBookingOrder) => {
    setSelectedOrder(order);
    const calc = refundCalculationService.calculateRefund(order);
    setCalculation(calc);
    setBankInfo(prev => ({
      ...prev,
      accountHolder: order.contact.fullName.toUpperCase()
    }));
    setError(null);
  }, []);

  const lookupTicketForRefund = useCallback(async (ticketId: string, phoneOrEmail: string): Promise<boolean> => {
    const cleanId = (ticketId || '').trim().toUpperCase();
    const cleanIdent = (phoneOrEmail || '').trim();

    if (!cleanId || !cleanIdent) {
      setError('Vui lòng nhập đầy đủ Mã vé và Số điện thoại / Email.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const order = await guestLookupService.lookup(cleanId, cleanIdent);
      if (!order) {
        setError(`Không tìm thấy vé "${cleanId}" khớp với thông tin "${cleanIdent}".`);
        setIsLoading(false);
        return false;
      }

      if (order.paymentStatus !== 'confirmed') {
        setError(`Vé này đang ở trạng thái "${order.paymentStatus === 'pending_payment' ? 'Chờ thanh toán' : 'Đã hủy/Hết hạn'}", không thể thực hiện hoàn tiền.`);
        setIsLoading(false);
        return false;
      }

      selectOrderDirectly(order);
      setIsLoading(false);
      return true;
    } catch {
      setError('Đã xảy ra lỗi khi kiểm tra vé. Vui lòng thử lại.');
      setIsLoading(false);
      return false;
    }
  }, [selectOrderDirectly]);

  const nextStep = useCallback(() => {
    if (currentStep === 0) {
      if (!selectedOrder || !calculation) {
        setError('Vui lòng chọn hoặc tra cứu vé hợp lệ trước khi tiếp tục.');
        return;
      }
      if (!calculation.isEligible) {
        setError('Vé này đã cận giờ khởi hành (dưới 4h/2h) nên không đủ điều kiện hoàn vé tự động.');
        return;
      }
    }

    if (currentStep === 1) {
      if (refundMethod === 'bank_transfer') {
        if (!bankInfo.accountNumber.trim()) {
          setError('Vui lòng nhập Số tài khoản ngân hàng nhận tiền hoàn.');
          return;
        }
        if (!bankInfo.accountHolder.trim()) {
          setError('Vui lòng nhập Tên chủ tài khoản.');
          return;
        }
      }
    }

    setError(null);
    setCurrentStep(prev => prev + 1);
  }, [currentStep, selectedOrder, calculation, refundMethod, bankInfo]);

  const prevStep = useCallback(() => {
    setError(null);
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const submitRefund = useCallback(async (): Promise<boolean> => {
    if (!selectedOrder || !calculation) {
      setError('Dữ liệu hoàn vé không hợp lệ.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const req = await refundCalculationService.submitRefundRequest({
        ticketId: selectedOrder.bookingId,
        pnrCode: selectedOrder.pnrCode,
        customerName: selectedOrder.contact.fullName,
        customerPhone: selectedOrder.contact.phone,
        customerEmail: selectedOrder.contact.email,
        order: selectedOrder,
        calculation,
        refundMethod,
        bankInfo: refundMethod === 'bank_transfer' ? bankInfo : undefined,
        reason
      });

      // Update status of order in guestLookupService to cancelled
      await guestLookupService.cancelBooking(selectedOrder.bookingId);

      setCreatedRequest(req);
      setCurrentStep(2); // Step 3 in UI (index 2)
      setIsLoading(false);
      return true;
    } catch {
      setError('Không thể gửi yêu cầu hoàn tiền. Vui lòng thử lại sau.');
      setIsLoading(false);
      return false;
    }
  }, [selectedOrder, calculation, refundMethod, bankInfo, reason]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setSelectedOrder(null);
    setCalculation(null);
    setRefundMethod('bank_transfer');
    setBankInfo(DEFAULT_BANK_INFO);
    setReason('Thay đổi kế hoạch cá nhân');
    setCreatedRequest(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    currentStep,
    selectedOrder,
    calculation,
    refundMethod,
    bankInfo,
    reason,
    createdRequest,
    isLoading,
    error,
    lookupTicketForRefund,
    selectOrderDirectly,
    setRefundMethod,
    setBankInfo,
    setReason,
    nextStep,
    prevStep,
    submitRefund,
    reset
  };
};
