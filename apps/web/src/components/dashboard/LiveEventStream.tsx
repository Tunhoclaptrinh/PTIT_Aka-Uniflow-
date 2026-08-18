import React, { useState, useEffect } from 'react';
import { Card, Timeline, Tag, Space, Typography, Button } from 'antd';
import {
  ThunderboltOutlined,
  CheckCircleFilled,
  WarningFilled,
  ReloadOutlined,
} from '@ant-design/icons';

const { orientation, Title } = Typography;

interface StreamEvent {
  id: string;
  time: string;
  platform: 'TIKTOK' | 'SHOPEE' | 'LAZADA';
  orderId: string;
  sku: string;
  action: string;
  duration: string;
  status: 'SUCCESS' | 'HEALED' | 'WARNING';
}

const mockEvents: StreamEvent[] = [
  {
    id: '1',
    time: '08:52:14',
    platform: 'TIKTOK',
    orderId: '#TTS-88231',
    sku: 'AT-COT-01',
    action: 'Khớp SKU AI (98.5%) -> Trừ kho Sapo -> Tạo vận đơn GHTK',
    duration: '0.23s',
    status: 'SUCCESS',
  },
  {
    id: '2',
    time: '08:51:40',
    platform: 'SHOPEE',
    orderId: '#SP-99120',
    sku: 'PL-PIMA-WHT',
    action: 'AI Auto-Healed: GHN timeout -> Reroute sang GHTK (Tiết kiệm 4,500đ)',
    duration: '0.41s',
    status: 'HEALED',
  },
  {
    id: '3',
    time: '08:50:02',
    platform: 'TIKTOK',
    orderId: '#TTS-88229',
    sku: 'QJ-NAM-BLK',
    action: 'Khớp SKU tự động -> Trừ kho KiotViet -> Tạo đơn Viettel Post',
    duration: '0.19s',
    status: 'SUCCESS',
  },
  {
    id: '4',
    time: '08:48:19',
    platform: 'SHOPEE',
    orderId: '#SP-99105',
    sku: 'SM-OXFORD-BLU',
    action: 'Tồn kho SAPO dưới ngưỡng an toàn (Còn 2) -> Gửi cảnh báo Telegram',
    duration: '0.15s',
    status: 'WARNING',
  },
];

export const LiveEventStream: React.FC = () => {
  const [events, setEvents] = useState<StreamEvent[]>(mockEvents);

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <span className="live-pulse-dot" />
            <span style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 16 }}>
              Live Event Pulse Tracker (Dòng sự kiện thời gian thực)
            </span>
          </Space>
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined style={{ color: '#9CA3AF' }} />}
            style={{ color: '#9CA3AF' }}
          >
            Làm mới
          </Button>
        </div>
      }
      bordered={false}
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        marginTop: 16,
      }}
    >
      <Timeline
        mode="left"
        items={events.map((event) => {
          let dotColor = '#10B981';
          let dotIcon = <CheckCircleFilled style={{ fontSize: 14, color: '#10B981' }} />;

          if (event.status === 'HEALED') {
            dotColor = '#fcc20f';
            dotIcon = <ThunderboltOutlined style={{ fontSize: 14, color: '#fcc20f' }} />;
          } else if (event.status === 'WARNING') {
            dotColor = '#EF4444';
            dotIcon = <WarningFilled style={{ fontSize: 14, color: '#EF4444' }} />;
          }

          return {
            dot: dotIcon,
            children: (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 8,
                  marginBottom: 6,
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <Space>
                  <Tag
                    color={event.platform === 'TIKTOK' ? '#000000' : '#EE4D2D'}
                    style={{
                      borderRadius: 4,
                      fontWeight: 700,
                      border: event.platform === 'TIKTOK' ? '1px solid #374151' : 'none',
                    }}
                  >
                    {event.platform}
                  </Tag>
                  <span style={{ color: '#fcc20f', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>
                    {event.orderId}
                  </span>
                  <span style={{ color: '#F9FAFB', fontSize: 13 }}>{event.action}</span>
                </Space>

                <Space>
                  {event.status === 'HEALED' && (
                    <Tag color="#fcc20f" style={{ color: '#0B0F19', fontWeight: 700, borderRadius: 4 }}>
                      ⚡ AI Self-Healed
                    </Tag>
                  )}
                  <span
                    style={{
                      color: '#10B981',
                      fontSize: 12,
                      fontFamily: 'JetBrains Mono',
                      fontWeight: 600,
                    }}
                  >
                    {event.duration}
                  </span>
                  <span style={{ color: '#6B7280', fontSize: 11 }}>{event.time}</span>
                </Space>
              </div>
            ),
          };
        })}
      />
    </Card>
  );
};
