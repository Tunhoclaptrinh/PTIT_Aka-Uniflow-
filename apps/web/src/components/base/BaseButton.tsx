import React from 'react';
import { Button as AntButton, Tooltip } from 'antd';
import { useAppConfig } from '../../context/AppConfigContext';
import { BaseButtonProps } from './types';

export const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  tooltip,
  glow = false,
  children,
  style,
  loading,
  disabled,
  ...rest
}) => {
  const { themeMode } = useAppConfig();
  const isLight = themeMode === 'light';

  let customStyle: React.CSSProperties = {
    borderRadius: 8,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.25s ease',
    ...style,
  };

  if (variant === 'brand') {
    customStyle = {
      ...customStyle,
      background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
      border: 'none',
      color: '#FFFFFF',
      boxShadow: glow ? '0 4px 14px rgba(237, 28, 36, 0.35)' : 'none',
    };
  } else if (variant === 'primary') {
    // Primary Red (#ed1c24)
    customStyle = {
      ...customStyle,
      background: '#ed1c24',
      borderColor: '#ed1c24',
      color: '#FFFFFF',
      boxShadow: glow ? '0 4px 12px rgba(237, 28, 36, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
    };
  } else if (variant === 'secondary') {
    // Secondary Gold / Yellow (#fcc20f)
    customStyle = {
      ...customStyle,
      background: '#fcc20f',
      borderColor: '#fcc20f',
      color: '#1F2937',
      fontWeight: 700,
      boxShadow: glow ? '0 4px 12px rgba(252, 194, 15, 0.35)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
    };
  } else if (variant === 'danger') {
    customStyle = {
      ...customStyle,
      background: isLight ? '#FEF2F2' : 'rgba(239, 68, 68, 0.1)',
      borderColor: isLight ? '#FCA5A5' : '#EF4444',
      color: '#DC2626',
    };
  } else if (variant === 'success') {
    customStyle = {
      ...customStyle,
      background: isLight ? '#ECFDF5' : 'rgba(16, 185, 129, 0.1)',
      borderColor: isLight ? '#6EE7B7' : '#10B981',
      color: '#059669',
    };
  } else if (variant === 'ghost') {
    customStyle = {
      ...customStyle,
      background: isLight ? '#FFFFFF' : 'transparent',
      borderColor: isLight ? '#D1D5DB' : '#374151',
      color: isLight ? '#374151' : '#9CA3AF',
    };
  }

  const btnElement = (
    <AntButton
      style={customStyle}
      loading={loading}
      disabled={disabled}
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
