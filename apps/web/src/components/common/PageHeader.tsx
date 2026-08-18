import React from 'react';
import { Space } from 'antd';

interface PageHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  extra?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  subtitle,
  badge,
  extra,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon && <div style={{ fontSize: 24, display: 'flex', alignItems: 'center' }}>{icon}</div>}
        <div>
          <Space align="center" size="small">
            <span style={{ color: '#F9FAFB', fontWeight: 800, fontSize: 20 }}>
              {title}
            </span>
            {badge}
          </Space>
          {subtitle && (
            <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {extra && <Space>{extra}</Space>}
    </div>
  );
};
