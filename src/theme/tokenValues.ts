import type { IThemeColors, ITypographyTokens } from '@/types/tokens';

/**
 * JS/TS Export of Design Tokens matching src/styles/_tokens.scss exactly
 * Single Source of Truth bridge for Ant Design ConfigProvider
 */
export const themeColors: IThemeColors = {
  // Brand
  primary: '#0284c7',
  primaryHover: '#0369a1',
  primaryActive: '#0c4a6e',
  primaryLight: '#e0f2fe',
  primarySubtle: '#f0f9ff',

  secondary: '#0d9488',
  secondaryHover: '#0f766e',
  secondaryLight: '#ccfbf1',

  accent: '#f97316',
  accentHover: '#ea580c',
  accentLight: '#ffedd5',

  // Functional
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',

  // Neutrals
  neutral50: '#f8fafc',
  neutral100: '#f1f5f9',
  neutral200: '#e2e8f0',
  neutral300: '#cbd5e1',
  neutral400: '#94a3b8',
  neutral500: '#64748b',
  neutral600: '#475569',
  neutral700: '#334155',
  neutral800: '#1e293b',
  neutral900: '#0f172a',

  // Surfaces
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  textInverse: '#ffffff',
  bgBody: '#f8fafc',
  bgContainer: '#ffffff',
  bgSurface: '#ffffff',
  bgSubtle: '#f1f5f9',
  borderColor: '#e2e8f0',
  borderColorHover: '#cbd5e1',
};

export const typographyTokens: ITypographyTokens = {
  fontSizeXs: '12px',
  fontSizeSm: '14px',
  fontSizeBase: '16px',
  fontSizeMd: '18px',
  fontSizeLg: '20px',
  fontSizeXl: '24px',
  fontSize2Xl: '32px',

  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,

  lineHeightTight: 1.25,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
};
