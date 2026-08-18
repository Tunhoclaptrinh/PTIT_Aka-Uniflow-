import { ThemeConfig, theme } from 'antd';

/**
 * Cấu hình Ant Design Light Theme (Giao Diện Sáng Mặc Định)
 * Chuẩn Brand Identity PTIT_Aka:
 * Primary: Aka Red (#ed1c24)
 * Secondary / Warning: Solar Gold (#fcc20f)
 */
export const lightThemeConfig: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Brand Tokens
    colorPrimary: '#ed1c24',
    colorWarning: '#fcc20f',
    colorSuccess: '#10B981',
    colorError: '#EF4444',
    colorInfo: '#3B82F6',

    // Light Mode Backgrounds & Surfaces
    colorBgBase: '#FFFFFF',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#F8FAFC',

    // Text Colors
    colorText: '#111827',
    colorTextSecondary: '#4B5563',
    colorTextTertiary: '#9CA3AF',

    // Borders & Dividers
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#F3F4F6',

    // Typography & Radii
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: 8,
    borderRadiusLG: 12,
  },
  components: {
    Button: {
      primaryColor: '#FFFFFF',
      controlHeight: 38,
      borderRadius: 8,
      fontWeight: 600,
    },
    Card: {
      colorBgContainer: '#FFFFFF',
      colorBorderSecondary: '#E5E7EB',
      paddingLG: 20,
    },
    Table: {
      colorBgContainer: '#FFFFFF',
      headerBg: '#F8FAFC',
      headerColor: '#111827',
      rowHoverBg: 'rgba(237, 28, 36, 0.04)',
      borderColor: '#E5E7EB',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: 'rgba(237, 28, 36, 0.08)',
      itemSelectedColor: '#ed1c24',
    },
    Modal: {
      contentBg: '#FFFFFF',
      headerBg: '#FFFFFF',
    },
    Drawer: {
      colorBgElevated: '#FFFFFF',
    },
  },
};

/**
 * Cấu hình Ant Design Dark Theme (Giao Diện Tối)
 */
export const darkThemeConfig: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    // Brand Tokens
    colorPrimary: '#ed1c24',
    colorWarning: '#fcc20f',
    colorSuccess: '#10B981',
    colorError: '#EF4444',
    colorInfo: '#3B82F6',

    // Dark Mode Backgrounds & Surfaces
    colorBgBase: '#0B0F19',
    colorBgContainer: '#111827',
    colorBgElevated: '#1F2937',
    colorBgLayout: '#0B0F19',

    // Text Colors
    colorText: '#F9FAFB',
    colorTextSecondary: '#9CA3AF',
    colorTextTertiary: '#6B7280',

    // Borders & Dividers
    colorBorder: 'rgba(255, 255, 255, 0.08)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.04)',

    // Typography & Radii
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: 8,
    borderRadiusLG: 12,
  },
  components: {
    Button: {
      primaryColor: '#FFFFFF',
      controlHeight: 38,
      borderRadius: 8,
      fontWeight: 600,
    },
    Card: {
      colorBgContainer: '#111827',
      colorBorderSecondary: 'rgba(255, 255, 255, 0.08)',
      paddingLG: 20,
    },
    Table: {
      colorBgContainer: '#111827',
      headerBg: '#1F2937',
      headerColor: '#F9FAFB',
      rowHoverBg: 'rgba(237, 28, 36, 0.06)',
      borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    Menu: {
      darkItemBg: '#0B0F19',
      darkItemSelectedBg: 'rgba(237, 28, 36, 0.15)',
      darkItemSelectedColor: '#ed1c24',
    },
    Modal: {
      contentBg: '#111827',
      headerBg: '#111827',
    },
    Drawer: {
      colorBgElevated: '#0B0F19',
    },
  },
};
