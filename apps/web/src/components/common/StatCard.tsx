import React from 'react';
import { Card, Statistic, Tag } from 'antd';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  tagText?: string;
  tagColor?: string;
  subText?: string;
  valueColor?: string;
  formatter?: (val: number | string) => React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  tagText,
  tagColor = '#ed1c24',
  subText,
  valueColor = '#F9FAFB',
  formatter,
}) => {
  return (
    <Card
      bordered={false}
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500 }}>{title}</span>
        {tagText && (
          <Tag color={tagColor} style={{ borderRadius: 6, fontWeight: 600 }}>
            {tagText}
          </Tag>
        )}
      </div>

      <Statistic
        value={value}
        prefix={prefix}
        suffix={suffix}
        formatter={formatter as any}
        valueStyle={{ color: valueColor, fontWeight: 800, fontSize: 28, marginTop: 8 }}
      />

      {subText && (
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
          {subText}
        </div>
      )}
    </Card>
  );
};
