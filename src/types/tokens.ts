/**
 * Design Token interfaces representing typography scale and color system
 * Interface Segregation Principle
 */

export interface ITypographyTokens {
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeBase: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2Xl: string;

  fontWeightRegular: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;

  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
}

export interface IThemeColors {
  // Brand / Primary
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryLight: string;
  primarySubtle: string;

  // Secondary & Accents
  secondary: string;
  secondaryHover: string;
  secondaryLight: string;
  accent: string;
  accentHover: string;
  accentLight: string;

  // Functional colors
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  info: string;
  infoLight: string;

  // Neutrals (50 - 900)
  neutral50: string;
  neutral100: string;
  neutral200: string;
  neutral300: string;
  neutral400: string;
  neutral500: string;
  neutral600: string;
  neutral700: string;
  neutral800: string;
  neutral900: string;

  // Semantic surfaces
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  bgBody: string;
  bgContainer: string;
  bgSurface: string;
  bgSubtle: string;
  borderColor: string;
  borderColorHover: string;
}
