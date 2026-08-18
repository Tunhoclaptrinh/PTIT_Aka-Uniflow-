import React from 'react';
import { Tag } from 'antd';
import {
  CheckCircleFilled,
  SyncOutlined,
  ClockCircleFilled,
  CloseCircleFilled,
  ThunderboltFilled,
} from '@ant-design/icons';
import { StatusTagProps } from './types';

export const StatusTag: React.FC<StatusTagProps> = ({ status, text, customLabel }) => {
  const normalized = (status || '').toUpperCase();
  const label = customLabel || text;

  switch (normalized) {
    case 'COMPLETED':
    case 'SUCCESS':
    case 'AUTO_APPROVED':
    case 'ACTIVE':
    case 'CONNECTED':
      return (
        <Tag
          icon={<CheckCircleFilled />}
          color="success"
          style={{ borderRadius: 4, fontWeight: 700, fontSize: 11 }}
        >
          {label || (normalized === 'AUTO_APPROVED' ? 'Đã duyệt AI' : 'Thành công')}
        </Tag>
      );

    case 'PROCESSING':
    case 'PENDING':
    case 'IN_TRANSIT':
      return (
        <Tag
          icon={<SyncOutlined spin />}
          color="processing"
          style={{ borderRadius: 4, fontWeight: 700, fontSize: 11 }}
        >
          {label || 'Đang xử lý'}
        </Tag>
      );

    case 'PENDING_REVIEW':
    case 'AWAITING':
    case 'WARNING':
      return (
        <Tag
          icon={<ClockCircleFilled />}
          color="warning"
          style={{ borderRadius: 4, fontWeight: 700, fontSize: 11 }}
        >
          {label || 'Chờ xác nhận'}
        </Tag>
      );

    case 'AUTO_HEALED':
    case 'HEALED':
      return (
        <Tag
          icon={<ThunderboltFilled />}
          color="#fcc20f"
          style={{ borderRadius: 4, fontWeight: 700, fontSize: 11, color: '#000000' }}
        >
          {label || 'AI Tự Chữa Lành'}
        </Tag>
      );

    case 'FAILED':
    case 'ERROR':
    case 'DISCONNECTED':
    case 'MANUAL_REQUIRED':
      return (
        <Tag
          icon={<CloseCircleFilled />}
          color="error"
          style={{ borderRadius: 4, fontWeight: 700, fontSize: 11 }}
        >
          {label || (normalized === 'MANUAL_REQUIRED' ? 'Cần ghép tay' : 'Thất bại')}
        </Tag>
      );

    default:
      return (
        <Tag style={{ borderRadius: 4, fontWeight: 600, fontSize: 11 }}>
          {label || status}
        </Tag>
      );
  }
};
