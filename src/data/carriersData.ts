import type { ICarrierConfig } from '@/services/carrier/carrierTypes';

// Static asset imports bundled once by Vite (Single Source of Truth)
import vietnamAirlinesLogo from '@/assets/logo/vietnam-airlines.jpg';
import vietjetLogo from '@/assets/logo/vietjet-air.jpg';
import bambooLogo from '@/assets/logo/bamboo-airways.jpg';
import vietravelLogo from '@/assets/logo/vietravel-airlines.jpg';
import dsvnLogo from '@/assets/logo/DSVN.jpg';
import futaLogo from '@/assets/logo/phuong-trang.jpg';
import maiLinhLogo from '@/assets/logo/mai-linh.jpg';
import kumhoLogo from '@/assets/logo/KUMHOSAMCO.jpg';
import thanhBuoiLogo from '@/assets/logo/thanh-buoi.jpg';
import hoangLongLogo from '@/assets/logo/hoang-long.jpg';

/**
 * Master Registry of All Transport Carriers (SOLID: Single Responsibility & Open/Closed)
 * Centralizes branding, codes, colors, transport types and static assets.
 */
export const INITIAL_CARRIER_CONFIGS: readonly ICarrierConfig[] = [
  // --------------------------------------------------------------------------
  // HÀNG KHÔNG (FLIGHTS)
  // --------------------------------------------------------------------------
  {
    id: 'vna',
    name: 'Vietnam Airlines',
    shortName: 'VNA',
    code: 'VN',
    transportType: 'flight',
    logoSrc: vietnamAirlinesLogo,
    brandColor: '#035f7f',
    badgeBg: '#ffffff',
    borderColor: '#035f7f',
    aliases: ['vietnam-airlines', 'vietnam airlines', 'vna', 'vn', 'vietnamairline', 'hàng không quốc gia'],
  },
  {
    id: 'vj',
    name: 'Vietjet Air',
    shortName: 'Vietjet',
    code: 'VJ',
    transportType: 'flight',
    logoSrc: vietjetLogo,
    brandColor: '#EB1C24',
    badgeBg: '#ffffff',
    borderColor: '#ffcccc',
    aliases: ['vietjet', 'vietjet-air', 'vietjet air', 'vj'],
  },
  {
    id: 'bamboo',
    name: 'Bamboo Airways',
    shortName: 'Bamboo',
    code: 'QH',
    transportType: 'flight',
    logoSrc: bambooLogo,
    brandColor: '#073871',
    badgeBg: '#ffffff',
    borderColor: '#d1eedc',
    aliases: ['bamboo-airways', 'bamboo airways', 'bamboo', 'qh', 'bav'],
  },
  {
    id: 'vietravel',
    name: 'Vietravel Airlines',
    shortName: 'Vietravel',
    code: 'VU',
    transportType: 'flight',
    logoSrc: vietravelLogo,
    brandColor: '#00387A',
    badgeBg: '#ffffff',
    borderColor: '#dce5f2',
    aliases: ['vietravel', 'vietravel-airlines', 'vietravel airlines', 'vu', 'vag'],
  },

  // --------------------------------------------------------------------------
  // ĐƯỜNG SẮT (RAILWAYS)
  // --------------------------------------------------------------------------
  {
    id: 'dsvn',
    name: 'Tổng công ty Đường sắt Việt Nam',
    shortName: 'Đường sắt Việt Nam (VNR)',
    code: 'VNR',
    transportType: 'train',
    logoSrc: dsvnLogo,
    brandColor: '#0054A6',
    badgeBg: '#ffffff',
    borderColor: '#d3e2f5',
    aliases: ['dsvn', 'vnr', 'duongsatvietnam', 'duong-sat-viet-nam', 'duong sat', 'se1', 'se3', 'se7', 'snt1'],
  },

  // --------------------------------------------------------------------------
  // XE KHÁCH (BUS & COACH)
  // --------------------------------------------------------------------------
  {
    id: 'futa',
    name: 'Phương Trang (FUTA Bus Lines)',
    shortName: 'FUTA Bus Lines',
    code: 'FUTA',
    transportType: 'bus',
    logoSrc: futaLogo,
    brandColor: '#EF5222',
    badgeBg: '#ffffff',
    borderColor: '#ffd8cc',
    aliases: ['futa', 'phuong-trang', 'phuongtrang', 'xe phuong trang', 'futa bus lines'],
  },
  {
    id: 'mailinh',
    name: 'Mai Linh Express',
    shortName: 'Mai Linh',
    code: 'ML',
    transportType: 'bus',
    logoSrc: maiLinhLogo,
    brandColor: '#008837',
    badgeBg: '#ffffff',
    borderColor: '#c9eed3',
    aliases: ['mailinh', 'mai-linh', 'mai linh', 'ml', 'xe mai linh'],
  },
  {
    id: 'kumhosamco',
    name: 'Kumho Samco Buslines',
    shortName: 'Kumho Samco',
    code: 'KH',
    transportType: 'bus',
    logoSrc: kumhoLogo,
    brandColor: '#ED1C24',
    badgeBg: '#ffffff',
    borderColor: '#f2d6d6',
    aliases: ['kumho', 'kumhosamco', 'kumho-samco', 'kumho samco', 'kh', 'samco'],
  },
  {
    id: 'thanhbuoi',
    name: 'Xe khách Thành Bưởi',
    shortName: 'Thành Bưởi',
    code: 'TB',
    transportType: 'bus',
    logoSrc: thanhBuoiLogo,
    brandColor: '#166534',
    badgeBg: '#ffffff',
    borderColor: '#d4f2cf',
    aliases: ['thanhbuoi', 'thanh-buoi', 'thanh buoi', 'tb', 'xe thanh buoi'],
  },
  {
    id: 'hoanglong',
    name: 'Hoàng Long Asia',
    shortName: 'Hoàng Long',
    code: 'HL',
    transportType: 'bus',
    logoSrc: hoangLongLogo,
    brandColor: '#DC2626',
    badgeBg: '#ffffff',
    borderColor: '#fcd5d5',
    aliases: ['hoanglong', 'hoang-long', 'hoang long', 'hl', 'hoang long asia'],
  },
];
