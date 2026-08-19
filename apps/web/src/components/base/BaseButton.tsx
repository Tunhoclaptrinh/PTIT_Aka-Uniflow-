import React from 'react';
import { Button as AntButton, Tooltip } from 'antd';
import { useAppConfig } from '../../context/AppConfigContext';
import { BaseButtonProps } from './types';

export const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  size = 'small',
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

  // Standardized height and padding sizing matrix (matching table toolbar buttons)
  const sizeStyles: Record<string, { height: number; fontSize: number; padding: string; borderRadius: number }> = {
    small: { height: 32, fontSize: 13, padding: '0 12px', borderRadius: 6 },
    middle: { height: 32, fontSize: 13, padding: '0 14px', borderRadius: 6 },
    large: { height: 38, fontSize: 14, padding: '0 18px', borderRadius: 8 },
  };

  const currentSize = sizeStyles[size || 'small'] || sizeStyles.small;

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

  if (variant === 'brand' || variant === 'primary') {
    customStyle = {
      ...customStyle,
      background: '#ed1c24',
      border: '1px solid #ed1c24',
      color: '#FFFFFF',
      boxShadow: glow ? '0 2px 8px rgba(237, 28, 36, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.08)',
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
      background: '#fcc20f',
      border: '1px solid #fcc20f',
      color: '#111827',
      fontWeight: 700,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    };
  } else if (variant === 'danger') {
    customStyle = {
      ...customStyle,
      background: '#EF4444',
      border: '1px solid #EF4444',
      color: '#FFFFFF',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    };
  } else if (variant === 'success') {
    customStyle = {
      ...customStyle,
      background: '#10B981',
      border: '1px solid #10B981',
      color: '#FFFFFF',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
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
