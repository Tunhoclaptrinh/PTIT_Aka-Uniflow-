import React, { useEffect, useState } from 'react';
import { Drawer, List, Typography } from 'antd';
import {
  BellFilled,
  ClearOutlined,
  ThunderboltFilled,
  CheckCircleFilled,
} from '@ant-design/icons';
import { BaseButton } from '../base/BaseButton';
import { metricsService } from '../../services/metrics.service';

const { Paragraph } = Typography;

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'ORDER' | 'AI_HEALING' | 'SYSTEM';
  time: string;
  read: boolean;
}

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const logs = await metricsService.getLogs(10);
      if (logs && logs.length > 0) {
        const mapped: NotificationItem[] = logs.map((l) => {
          const isHealed = l.aiHealed;
          return {
            id: l._id,
            title: isHealed ? 'AI tự phục hồi & chuyển tuyến' : `Đơn hàng ${l.platform} #${l.sourceOrderId}`,
            description: l.message || 'Xử lý hoàn tất qua luồng tự động 0-chạm',
            type: isHealed ? 'AI_HEALING' : 'ORDER',
            time: new Date(l.createdAt).toLocaleTimeString('vi-VN'),
            read: false,
          };
        });
        setNotifications(mapped);
      } else {
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BellFilled style={{ color: '#ed1c24' }} />
          <span style={{ fontWeight: 600 }}>Thông báo hệ thống</span>
        </div>
      }
      placement="right"
      width={600}
      open={open}
      onClose={onClose}
      extra={
        notifications.length > 0 && (
          <BaseButton variant="ghost" size="small" icon={<ClearOutlined />} onClick={handleClearAll}>
            Xóa hết
          </BaseButton>
        )
      }
      footer={
        notifications.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <BaseButton variant="secondary" size="small" onClick={handleMarkAllRead}>
              Đánh dấu đã đọc tất cả
            </BaseButton>
          </div>
        )
      }
    >
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={notifications}
        locale={{
          emptyText: (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#9CA3AF' }}>
              Chưa có thông báo mới từ hệ thống
            </div>
          ),
        }}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            style={{
              padding: '12px 14px',
              marginBottom: 10,
              borderRadius: 8,
              background: item.read ? '#FFFFFF' : '#F9FAFB',
              border: item.read ? '1px solid #E5E7EB' : '1px solid #D1D5DB',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontWeight: item.read ? 500 : 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                {item.type === 'AI_HEALING' ? (
                  <ThunderboltFilled style={{ color: '#8B5CF6' }} />
                ) : (
                  <CheckCircleFilled style={{ color: '#10B981' }} />
                )}
                {item.title}
              </div>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>{item.time}</span>
            </div>
            <Paragraph style={{ margin: 0, fontSize: 12, color: '#4B5563', lineHeight: 1.4 }}>
              {item.description}
            </Paragraph>
          </List.Item>
        )}
      />
    </Drawer>
  );
};
