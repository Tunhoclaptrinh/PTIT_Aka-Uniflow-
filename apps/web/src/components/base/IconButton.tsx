import React from 'react';
import { Tooltip } from 'antd';
import { useAppConfig } from '../../context/AppConfigContext';

export interface IconButtonProps {
  icon: React.ReactNode;
  tooltip?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  danger?: boolean;
  success?: boolean;
  color?: string;
  hoverColor?: string;
  size?: number | string;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  tooltip,
  onClick,
  danger = false,
  success = false,
  color,
  hoverColor,
  size = 16,
  disabled = false,
  style,
  className,
}) => {
  const { themeMode } = useAppConfig();
  const isLight = themeMode === 'light';

  const defaultColor = danger
    ? '#EF4444'
    : success
    ? '#10B981'
    : color || (isLight ? '#4B5563' : '#9CA3AF');

  const activeHoverColor = danger
    ? '#DC2626'
    : success
    ? '#059669'
    : hoverColor || '#ed1c24';

  const [hovered, setHovered] = React.useState(false);

  const btnElement = (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: 'none',
        background: hovered ? (isLight ? 'rgba(237, 28, 36, 0.08)' : 'rgba(255, 255, 255, 0.08)') : 'transparent',
        color: hovered ? activeHoverColor : defaultColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: size,
        width: 30,
        height: 30,
        borderRadius: 6,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        outline: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: disabled ? 0.4 : 1,
        transform: hovered && !disabled ? 'scale(1.12)' : 'scale(1)',
        ...style,
      }}
      className={`uniflow-icon-btn ${className || ''}`}
    >
      {icon}
    </button>
  );

  if (tooltip) {
    return <Tooltip title={tooltip} placement="top">{btnElement}</Tooltip>;
  }

  return btnElement;
};

export default IconButton;
