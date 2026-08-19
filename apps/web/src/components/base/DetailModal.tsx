import React from 'react';
import { Modal, Descriptions, Space } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { BaseButton } from './BaseButton';
import { StatusTag } from './StatusTag';

export interface DetailItem {
  key: string;
  label: string;
  value: React.ReactNode;
  span?: number;
}

export interface DetailModalProps {
  open: boolean;
  title?: React.ReactNode;
  entityName?: string;
  record?: any;
  items?: DetailItem[];
  status?: string;
  statusLabel?: string;
  onClose: () => void;
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  extraActions?: React.ReactNode;
  width?: number | string;
  children?: React.ReactNode;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  open,
  title,
  entityName = 'bản ghi',
  record,
  items = [],
  status,
  statusLabel,
  onClose,
  onEdit,
  onDelete,
  extraActions,
  width = 640,
  children,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
          <Space size={8}>
            <EyeOutlined style={{ color: '#ed1c24' }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              {title || `Chi tiết ${entityName}`}
            </span>
          </Space>
          {status && <StatusTag status={status} text={statusLabel} />}
        </div>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {onDelete && record && (
              <BaseButton
                variant="danger"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => {
                  onDelete(record);
                  onClose();
                }}
              >
                Xóa
              </BaseButton>
            )}
          </div>
          <Space size="middle">
            <BaseButton variant="ghost" size="small" onClick={onClose}>
              Đóng
            </BaseButton>
            {extraActions}
            {onEdit && record && (
              <BaseButton
                variant="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  onEdit(record);
                  onClose();
                }}
              >
                Chỉnh sửa
              </BaseButton>
            )}
          </Space>
        </div>
      }
      width={width}
      centered
      destroyOnClose
    >
      <div style={{ padding: '8px 0' }}>
        {items.length > 0 && (
          <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 2 }} style={{ marginBottom: 16 }}>
            {items.map((item) => (
              <Descriptions.Item key={item.key} label={item.label} span={item.span || 1}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}

        {children}
      </div>
    </Modal>
  );
};

export default DetailModal;
