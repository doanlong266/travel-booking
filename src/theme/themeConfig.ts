import type { ThemeConfig } from 'antd';
import { themeColors } from './tokenValues';

/**
 * Ant Design ConfigProvider Theme configuration
 * Mapped directly from Design Tokens (Single Source of Truth)
 */
export const antdThemeConfig: ThemeConfig = {
  token: {
    fontFamily: '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    
    // Colors
    colorPrimary: themeColors.primary,
    colorPrimaryHover: themeColors.primaryHover,
    colorPrimaryActive: themeColors.primaryActive,
    colorPrimaryBg: themeColors.primaryLight,
    
    colorSuccess: themeColors.success,
    colorSuccessBg: themeColors.successLight,
    
    colorWarning: themeColors.warning,
    colorWarningBg: themeColors.warningLight,
    
    colorError: themeColors.danger,
    colorErrorBg: themeColors.dangerLight,
    
    colorInfo: themeColors.info,
    colorInfoBg: themeColors.infoLight,
    
    // Neutrals & Surfaces
    colorTextBase: themeColors.textPrimary,
    colorTextSecondary: themeColors.textSecondary,
    colorBorder: themeColors.borderColor,
    colorBgBase: themeColors.bgBody,
    colorBgContainer: themeColors.bgContainer,
    colorBgElevated: themeColors.bgContainer,
    
    // Typography Base
    fontSize: 15,
    
    // Border Radii
    borderRadius: 10,
    borderRadiusSM: 6,
    borderRadiusLG: 14,
    
    // Control heights
    controlHeight: 42,
    controlHeightLG: 48,
    controlHeightSM: 34,
  },
  components: {
    Button: {
      fontWeight: 600,
      controlHeight: 44,
      borderRadius: 10,
      primaryShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
    },
    Card: {
      borderRadiusLG: 16,
      boxShadowTertiary: '0 4px 16px rgba(15, 23, 42, 0.06)',
    },
    Tabs: {
      titleFontSize: 15,
      itemSelectedColor: themeColors.primary,
      itemHoverColor: themeColors.primaryHover,
      inkBarColor: themeColors.primary,
    },
    Select: {
      controlHeight: 44,
      borderRadius: 10,
    },
    DatePicker: {
      controlHeight: 44,
      borderRadius: 10,
    },
    InputNumber: {
      controlHeight: 44,
      borderRadius: 10,
    },
    Tag: {
      borderRadiusSM: 6,
    },
    Modal: {
      borderRadiusLG: 20,
    },
    Drawer: {
      borderRadiusLG: 20,
    },
  },
};
