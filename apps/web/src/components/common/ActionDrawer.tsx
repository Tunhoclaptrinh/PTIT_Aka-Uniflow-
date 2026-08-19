import React from 'react';
import { Drawer, Button, Space } from 'antd';

interface ActionDrawerProps {
  open: boolean;
  title: React.ReactNode;
  width?: number;
  onClose: () => void;
  onSubmit?: () => void;
  submitText?: string;
  submitLoading?: boolean;
  children: React.ReactNode;
}

export const ActionDrawer: React.FC<ActionDrawerProps> = ({
  open,
  title,
  width = 460,
  onClose,
  onSubmit,
  submitText = 'Lưu lại',
  submitLoading = false,
  children,
}) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={<span style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 16 }}>{title}</span>}
      width={width}
      styles={{
        body: { background: '#0B0F19', padding: '20px' },
        header: { background: '#111827', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' },
      }}
      extra={
        onSubmit && (
          <Space>
            <Button onClick={onClose} style={{ borderColor: '#374151', color: '#9CA3AF' }}>
              Hủy
            </Button>
            <Button
              type="primary"
              loading={submitLoading}
              onClick={onSubmit}
              style={{
                background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
                border: 'none',
                fontWeight: 700,
              }}
            >
              {submitText}
            </Button>
          </Space>
        )
      }
    >
      {children}
    </Drawer>
  );
};
