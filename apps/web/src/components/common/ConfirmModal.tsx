import React from 'react';
import { Modal, Button, Space, Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { Paragraph } = Typography;

interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  content,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={
        <Space>
          <ExclamationCircleFilled style={{ color: danger ? '#EF4444' : '#fcc20f', fontSize: 20 }} />
          <span style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 16 }}>{title}</span>
        </Space>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, paddingTop: 10 }}>
          <Button key="cancel" onClick={onCancel} disabled={loading} style={{ borderColor: '#374151', color: '#9CA3AF', minWidth: 96, height: 32 }}>
            {cancelText}
          </Button>
          <Button
            key="confirm"
            type="primary"
            danger={danger}
            loading={loading}
            onClick={onConfirm}
            style={{
              background: danger ? '#EF4444' : 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
              border: 'none',
              fontWeight: 700,
              minWidth: 120,
              height: 32,
            }}
          >
            {confirmText}
          </Button>
        </div>
      }
      styles={{
        body: { background: '#0B0F19', padding: '16px 0' },
        header: { background: '#111827', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' },
      }}
      width={460}
    >
      <Paragraph style={{ color: '#D1D5DB', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
        {content}
      </Paragraph>
    </Modal>
  );
};
