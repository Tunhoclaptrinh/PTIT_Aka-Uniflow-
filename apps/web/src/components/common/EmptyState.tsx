import React from 'react';
import { Button, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <InboxOutlined style={{ fontSize: 48, color: '#374151' }} />,
  title = 'Chưa có dữ liệu',
  description = 'Hiện tại danh sách đang trống hoặc chưa có bản ghi nào phù hợp.',
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 12,
        border: '1px dashed rgba(255, 255, 255, 0.08)',
      }}
    >
      <div style={{ marginBottom: 16 }}>{icon}</div>
      <div style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
        {title}
      </div>
      <Paragraph style={{ color: '#9CA3AF', fontSize: 13, maxWidth: 420, margin: '0 auto 20px' }}>
        {description}
      </Paragraph>
      {actionText && onAction && (
        <Button
          type="primary"
          onClick={onAction}
          style={{
            background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
            border: 'none',
            fontWeight: 700,
          }}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};
