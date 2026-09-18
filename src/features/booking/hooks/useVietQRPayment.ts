import { useState, useEffect, useCallback, useRef } from 'react';
import { vietQRService } from '../../../services/vietqr.service';
import type { IVietQRBeneficiaryInfo, PaymentStatus } from '../../../types/vietqr.types';

interface UseVietQRPaymentProps {
  bookingId: string;
  totalAmount: number;
  initialSeconds?: number;
  onPaymentSuccess?: () => void;
  onPaymentExpired?: () => void;
}

export const useVietQRPayment = ({
  bookingId,
  totalAmount,
  initialSeconds = 600, // 10 minutes
  onPaymentSuccess,
  onPaymentExpired
}: UseVietQRPaymentProps) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialSeconds);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isQrLoading, setIsQrLoading] = useState<boolean>(true);
  const [beneficiary, setBeneficiary] = useState<IVietQRBeneficiaryInfo>(() => vietQRService.getBeneficiaryConfig());

  const copyTimeoutRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // Generate QuickLink URL
  const qrImageUrl = vietQRService.generateQuickLink({
    bankId: beneficiary.bankId,
    accountNo: beneficiary.accountNo,
    template: 'compact2',
    amount: totalAmount,
    addInfo: bookingId,
    accountName: beneficiary.accountName
  });

  // Countdown timer effect
  useEffect(() => {
    if (paymentStatus === 'completed' || paymentStatus === 'expired') return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPaymentStatus('expired');
          onPaymentExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paymentStatus, onPaymentExpired]);

  // Format MM:SS
  const formatTimer = useCallback((seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const isUrgent = remainingSeconds > 0 && remainingSeconds <= 120; // < 2 minutes
  const isTimerExpired = remainingSeconds === 0 || paymentStatus === 'expired';

  // 1-Click Copy with feedback
  const copyToClipboard = useCallback(async (text: string, fieldKey: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopiedField(fieldKey);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

  // Download QR Code image
  const downloadQRCode = useCallback(async (fileName = `VietQR-${bookingId}.png`) => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn('Direct blob download failed, opening in new tab:', error);
      window.open(qrImageUrl, '_blank');
    }
  }, [qrImageUrl, bookingId]);

  // Check payment status simulation
  const checkPaymentStatus = useCallback(() => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      // Simulate success if demo check is run
      setPaymentStatus('completed');
      onPaymentSuccess?.();
    }, 1500);
  }, [onPaymentSuccess]);

  // Simulate payment success immediately
  const simulatePaymentSuccess = useCallback(() => {
    setPaymentStatus('completed');
    onPaymentSuccess?.();
  }, [onPaymentSuccess]);

  // Regenerate QR Code
  const regenerateQR = useCallback(() => {
    setRemainingSeconds(initialSeconds);
    setPaymentStatus('pending');
    setIsQrLoading(true);
  }, [initialSeconds]);

  return {
    remainingSeconds,
    formattedTime: formatTimer(remainingSeconds),
    isUrgent,
    isTimerExpired,
    paymentStatus,
    copiedField,
    isChecking,
    isQrLoading,
    setIsQrLoading,
    beneficiary,
    setBeneficiary,
    qrImageUrl,
    copyToClipboard,
    downloadQRCode,
    checkPaymentStatus,
    simulatePaymentSuccess,
    regenerateQR
  };
};
