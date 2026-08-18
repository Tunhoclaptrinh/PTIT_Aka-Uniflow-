import React from 'react';
import { Space } from 'antd';

export type StatusType = 'success' | 'warning' | 'error' | 'processing' | 'default';

interface BadgeStatusProps {
  status: StatusType;
  text: string;
  pulse?: boolean;
}

const statusColors: Record<StatusType, string> = {
  success: '#10B981',
  warning: '#fcc20f',
  error: '#EF4444',
  processing: '#3B82F6',
  default: '#6B7280',
};

export const BadgeStatus: React.FC<BadgeStatusProps> = ({ status, text, pulse = true }) => {
  const color = statusColors[status] || statusColors.default;

  return (
    <Space size={6} align="center">
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: color,
          display: 'inline-block',
          boxShadow: pulse ? `0 0 8px ${color}` : 'none',
        }}
      />
      <span style={{ fontSize: 13, fontWeight: 600, color: '#F9FAFB' }}>{text}</span>
    </Space>
  );
};
