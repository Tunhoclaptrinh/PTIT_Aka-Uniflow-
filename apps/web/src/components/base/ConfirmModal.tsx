import React from 'react';
import { Modal, Space, Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { BaseButton } from './BaseButton';
import { ConfirmModalProps } from './types';

const { Paragraph } = Typography;

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
          <span style={{ fontWeight: 700, fontSize: 16 }}>{title}</span>
        </Space>
      }
      footer={[
        <BaseButton key="cancel" variant="ghost" onClick={onCancel} disabled={loading}>
          {cancelText}
        </BaseButton>,
        <BaseButton
          key="confirm"
          variant={danger ? 'danger' : 'brand'}
          loading={loading}
          glow={!danger}
          onClick={onConfirm}
        >
          {confirmText}
        </BaseButton>,
      ]}
      styles={{
        body: { padding: '16px 0' },
      }}
      centered
      destroyOnClose
    >
      <Paragraph style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
        {content}
      </Paragraph>
    </Modal>
  );
};
