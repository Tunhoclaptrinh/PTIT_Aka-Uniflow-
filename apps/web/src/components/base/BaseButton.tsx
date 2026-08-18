import React from 'react';
import { Button as AntButton, Tooltip } from 'antd';
import { useAppConfig } from '../../context/AppConfigContext';
import { BaseButtonProps } from './types';

export const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  size = 'middle',
  tooltip,
  glow = false,
  children,
  style,
  loading,
  disabled,
  className,
  ...rest
}) => {
  const { themeMode } = useAppConfig();
  const isLight = themeMode === 'light';

  // Height and padding sizing matrix
  const sizeStyles: Record<string, { height: number; fontSize: number; padding: string; borderRadius: number }> = {
    small: { height: 32, fontSize: 13, padding: '0 12px', borderRadius: 6 },
    middle: { height: 38, fontSize: 14, padding: '0 16px', borderRadius: 8 },
    large: { height: 44, fontSize: 15, padding: '0 22px', borderRadius: 10 },
  };

  const currentSize = sizeStyles[size || 'middle'] || sizeStyles.middle;

  let customStyle: React.CSSProperties = {
    height: currentSize.height,
    fontSize: currentSize.fontSize,
    padding: currentSize.padding,
    borderRadius: currentSize.borderRadius,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    ...style,
  };

  if (variant === 'brand') {
    customStyle = {
      ...customStyle,
      background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
      border: 'none',
      color: '#FFFFFF',
      boxShadow: glow ? '0 4px 14px rgba(237, 28, 36, 0.4)' : '0 2px 8px rgba(237, 28, 36, 0.25)',
    };
  } else if (variant === 'primary') {
    customStyle = {
      ...customStyle,
      background: 'linear-gradient(135deg, #ed1c24 0%, #d6141b 100%)',
      border: 'none',
      color: '#FFFFFF',
      boxShadow: glow ? '0 4px 14px rgba(237, 28, 36, 0.35)' : '0 2px 6px rgba(237, 28, 36, 0.2)',
    };
  } else if (variant === 'secondary') {
    customStyle = {
      ...customStyle,
      background: isLight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.05)',
      border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.12)',
      color: isLight ? '#374151' : '#E5E7EB',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    };
  } else if (variant === 'gold') {
    customStyle = {
      ...customStyle,
      background: 'linear-gradient(135deg, #fcc20f 0%, #e5ab00 100%)',
      border: 'none',
      color: '#111827',
      fontWeight: 700,
      boxShadow: glow ? '0 4px 14px rgba(252, 194, 15, 0.4)' : '0 2px 6px rgba(252, 194, 15, 0.25)',
    };
  } else if (variant === 'danger') {
    customStyle = {
      ...customStyle,
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      border: 'none',
      color: '#FFFFFF',
      boxShadow: '0 2px 6px rgba(239, 68, 68, 0.25)',
    };
  } else if (variant === 'success') {
    customStyle = {
      ...customStyle,
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      border: 'none',
      color: '#FFFFFF',
      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
    };
  } else if (variant === 'ghost') {
    customStyle = {
      ...customStyle,
      background: 'transparent',
      border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.1)',
      color: isLight ? '#4B5563' : '#9CA3AF',
    };
  }

  const btnElement = (
    <AntButton
      size={size}
      style={customStyle}
      loading={loading}
      disabled={disabled}
      className={`uniflow-btn uniflow-btn-${variant} ${className || ''}`}
      {...rest}
    >
      {children}
    </AntButton>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{btnElement}</Tooltip>;
  }

  return btnElement;
};

export default BaseButton;
