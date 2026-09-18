import type { 
  IVietQRBank, 
  IVietQRBeneficiaryInfo, 
  IVietQRQuickLinkParams, 
  IVietQRGenerateResponse 
} from '../types/vietqr.types';

export interface IPaymentGatewayService {
  generateQuickLink(params: IVietQRQuickLinkParams): string;
  generateQRRest(params: IVietQRQuickLinkParams): Promise<IVietQRGenerateResponse>;
  getBeneficiaryConfig(): IVietQRBeneficiaryInfo;
  getBanksList(): Promise<IVietQRBank[]>;
  formatAmountVND(amount: number): string;
  normalizeAccountName(name: string): string;
}

export const DEFAULT_BENEFICIARY: IVietQRBeneficiaryInfo = {
  bankId: 'MB',
  bankName: 'Ngân hàng TMCP Quân Đội',
  bankShortName: 'MB Bank',
  bankBin: '970422',
  bankLogo: 'https://api.vietqr.io/img/MB.png',
  accountNo: '0888999888',
  accountName: 'CONG TY CP CONG NGHE DU LICH OMNITRAVEL'
};

export const MOCK_BANKS_DIRECTORY: IVietQRBank[] = [
  {
    id: 1,
    name: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
    code: 'VCB',
    bin: '970436',
    shortName: 'Vietcombank',
    logo: 'https://api.vietqr.io/img/VCB.png',
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 2,
    name: 'Ngân hàng TMCP Quân Đội',
    code: 'MB',
    bin: '970422',
    shortName: 'MB Bank',
    logo: 'https://api.vietqr.io/img/MB.png',
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 3,
    name: 'Ngân hàng TMCP Kỹ Thương Việt Nam',
    code: 'TCB',
    bin: '970407',
    shortName: 'Techcombank',
    logo: 'https://api.vietqr.io/img/TCB.png',
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 4,
    name: 'Ngân hàng TMCP Công Thương Việt Nam',
    code: 'ICB',
    bin: '970415',
    shortName: 'VietinBank',
    logo: 'https://api.vietqr.io/img/ICB.png',
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 5,
    name: 'Ngân hàng TMCP Á Châu',
    code: 'ACB',
    bin: '970416',
    shortName: 'ACB',
    logo: 'https://api.vietqr.io/img/ACB.png',
    transferSupported: 1,
    lookupSupported: 1
  },
  {
    id: 6,
    name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
    code: 'VPB',
    bin: '970432',
    shortName: 'VPBank',
    logo: 'https://api.vietqr.io/img/VPB.png',
    transferSupported: 1,
    lookupSupported: 1
  }
];

export class VietQRService implements IPaymentGatewayService {
  private beneficiary: IVietQRBeneficiaryInfo = DEFAULT_BENEFICIARY;

  public getBeneficiaryConfig(): IVietQRBeneficiaryInfo {
    return this.beneficiary;
  }

  public setBeneficiaryConfig(config: Partial<IVietQRBeneficiaryInfo>) {
    this.beneficiary = { ...this.beneficiary, ...config };
  }

  /**
   * Method 1: VietQR QuickLink API (Recommended Frontend Image Generation)
   * URL format: https://img.vietqr.io/image/{bankId}-{accountNo}-{template}.png?amount={amount}&addInfo={addInfo}&accountName={accountName}
   */
  public generateQuickLink(params: IVietQRQuickLinkParams): string {
    const {
      bankId = this.beneficiary.bankId,
      accountNo = this.beneficiary.accountNo,
      template = 'compact2',
      amount = 0,
      addInfo = '',
      accountName = this.beneficiary.accountName
    } = params;

    const roundedAmount = Math.max(0, Math.round(amount));
    const encodedAddInfo = encodeURIComponent(addInfo.trim());
    const normalizedName = this.normalizeAccountName(accountName);
    const encodedAccountName = encodeURIComponent(normalizedName);

    return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${roundedAmount}&addInfo=${encodedAddInfo}&accountName=${encodedAccountName}`;
  }

  /**
   * Method 2: VietQR REST API v2
   */
  public async generateQRRest(params: IVietQRQuickLinkParams): Promise<IVietQRGenerateResponse> {
    const url = 'https://api.vietqr.io/v2/generate';
    const payload = {
      accountNo: params.accountNo || this.beneficiary.accountNo,
      accountName: this.normalizeAccountName(params.accountName || this.beneficiary.accountName),
      acqId: params.bankId || this.beneficiary.bankBin,
      amount: Math.max(0, Math.round(params.amount)),
      addInfo: params.addInfo,
      format: 'text',
      template: params.template || 'compact2'
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`VietQR REST API returned status ${response.status}`);
      }

      const json = await response.json();
      return json as IVietQRGenerateResponse;
    } catch (error) {
      console.warn('VietQR REST API call failed, falling back to QuickLink:', error);
      const quickLink = this.generateQuickLink(params);
      return {
        code: '00',
        desc: 'QuickLink Fallback',
        data: {
          acqId: Number(this.beneficiary.bankBin) || 970422,
          accountName: this.beneficiary.accountName,
          qrCode: quickLink,
          qrDataURL: quickLink
        }
      };
    }
  }

  /**
   * Fetch Supported Banks Directory
   */
  public async getBanksList(): Promise<IVietQRBank[]> {
    try {
      const response = await fetch('https://api.vietqr.io/v2/banks');
      if (response.ok) {
        const json = await response.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          return json.data as IVietQRBank[];
        }
      }
    } catch (error) {
      console.warn('Failed to fetch banks from VietQR API, using standard directory:', error);
    }
    return MOCK_BANKS_DIRECTORY;
  }

  /**
   * Format Amount to Vietnamese Dong
   */
  public formatAmountVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  /**
   * Normalize Account Name to uppercase non-diacritic ASCII
   */
  public normalizeAccountName(name: string): string {
    if (!name) return '';
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toUpperCase()
      .trim();
  }
}

export const vietQRService: IPaymentGatewayService = new VietQRService();
