export type VietQRTemplate = 'compact2' | 'compact' | 'qr_only' | 'print';

export interface IVietQRBank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  isTransfer?: boolean;
  swiftCode?: string;
}

export interface IVietQRBeneficiaryInfo {
  bankId: string; // e.g. 'MB', 'VCB', 'TCB', 'ICB', 'ACB'
  bankName: string;
  bankShortName: string;
  bankLogo: string;
  bankBin: string;
  accountNo: string;
  accountName: string;
}

export interface IVietQRQuickLinkParams {
  bankId: string;
  accountNo: string;
  template?: VietQRTemplate;
  amount: number;
  addInfo: string;
  accountName: string;
}

export interface IVietQRGenerateResponse {
  code: string;
  desc: string;
  data?: {
    acqId: number;
    accountName: string;
    qrCode: string;
    qrDataURL: string;
  };
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'expired' | 'failed';

export interface IVietQRPaymentOrder {
  bookingId: string;
  amount: number;
  description: string;
  beneficiary: IVietQRBeneficiaryInfo;
  paymentExpiresAt: number; // timestamp in ms
  status: PaymentStatus;
  qrImageUrl: string;
  createdAt: number;
  paidAt?: string;
  paymentMethod?: string;
}
