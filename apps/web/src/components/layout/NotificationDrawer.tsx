import React from 'react';
import { Drawer, List, Space, Typography } from 'antd';
import {
  BellFilled,
  ClearOutlined,
} from '@ant-design/icons';
import { BaseButton } from '../base/BaseButton';

const { Paragraph } = Typography;

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'ORDER' | 'AI_HEALING' | 'SYSTEM';
  time: string;
  read: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    title: '⚡ AI Auto-Healing kích hoạt',
    description: 'GHN gặp lỗi timeout (504). AI đã tự động chuyển tuyến đơn #SP-99120 sang GHTK (Tiết kiệm 4,500đ).',
    type: 'AI_HEALING',
    time: '2 phút trước',
    read: false,
  },
  {
    id: 'notif_2',
    title: '📦 12 Mã SKU khớp tự động >= 95%',
    description: 'AI Hybrid Matcher đã hoàn tất phân tích 12 sản phẩm từ gian hàng TikTok Shop.',
    type: 'ORDER',
    time: '15 phút trước',
    read: false,
  },
  {
    id: 'notif_3',
    title: '🛡️ Bảo mật PCI-DSS Kích hoạt',
    description: 'Khóa mã hóa AES-256-GCM đã được đồng bộ an toàn với MongoDB Atlas.',
    type: 'SYSTEM',
    time: '1 giờ trước',
    read: true,
  },
];

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ open, onClose }) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(mockNotifications);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <Drawer
      title={
        <Space>
          <BellFilled style={{ color: '#fcc20f' }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>
            Trung Tâm Thông Báo Vận Hành ({notifications.filter((n) => !n.read).length} mới)
          </span>
        </Space>
      }
      placement="right"
      width={460}
      open={open}
      onClose={onClose}
      styles={{
        body: { padding: '16px' },
      }}
      extra={
        <Space>
          <BaseButton variant="ghost" size="small" onClick={handleMarkAllRead}>
            Đã đọc hết
          </BaseButton>
          <BaseButton variant="ghost" size="small" icon={<ClearOutlined />} onClick={handleClearAll} />
        </Space>
      }
    >
      <List
        dataSource={notifications}
        renderItem={(item) => {
          return (
            <div
              style={{
                background: item.read ? '#FFFFFF' : 'rgba(237, 28, 36, 0.04)',
                border: item.read ? '1px solid #E5E7EB' : '1px solid rgba(237, 28, 36, 0.25)',
                borderRadius: 10,
                padding: '14px',
                marginBottom: 12,
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{item.title}</span>
                <span style={{ color: '#6B7280', fontSize: 11, fontFamily: 'JetBrains Mono' }}>{item.time}</span>
              </div>

              <Paragraph style={{ color: '#4B5563', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                {item.description}
              </Paragraph>
            </div>
          );
        }}
      />
    </Drawer>
  );
};
