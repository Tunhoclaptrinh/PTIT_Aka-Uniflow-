import React, { useEffect, useState } from 'react';
import { Card, Timeline, Tag, Space, Button } from 'antd';
import {
  ThunderboltOutlined,
  CheckCircleFilled,
  WarningFilled,
  ClearOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useWebSocketStream } from '../../hooks/useWebSocketStream';
import { metricsService } from '../../services/metrics.service';
import { LiveFeedItem, PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';

const initialMockEvents: LiveFeedItem[] = [
  {
    id: 'evt_init_1',
    timestamp: '08:52:14',
    tenantId: '66c0e812a1b2c3d4e5f60001',
    platform: PlatformType.TIKTOK_SHOP,
    sourceOrderId: 'TTS-88231',
    message: 'Đơn TikTok #TTS-88231 -> Khớp SKU AI (98.5%) -> Trừ kho Sapo -> Tạo vận đơn GHTK (230ms) ✅',
    durationMs: 230,
    status: WebhookProcessingStatus.COMPLETED,
    aiHealed: false,
  },
  {
    id: 'evt_init_2',
    timestamp: '08:51:40',
    tenantId: '66c0e812a1b2c3d4e5f60001',
    platform: PlatformType.SHOPEE,
    sourceOrderId: 'SP-99120',
    message: 'AI Auto-Healed: GHN timeout -> Reroute sang GHTK (Tiết kiệm 4,500đ)',
    durationMs: 410,
    status: WebhookProcessingStatus.AUTO_HEALED,
    aiHealed: true,
  },
];

export const LiveEventStream: React.FC = () => {
  const { events, isConnected, clearEvents, setEvents } = useWebSocketStream(initialMockEvents);
  const [loading, setLoading] = useState(false);

  const loadLogsFromDB = async () => {
    setLoading(true);
    try {
      const logs = await metricsService.getLogs(15);
      if (logs && logs.length > 0) {
        const mapped: LiveFeedItem[] = logs.map((l) => ({
          id: l._id,
          timestamp: new Date(l.createdAt).toLocaleTimeString('vi-VN'),
          tenantId: '66c0e812a1b2c3d4e5f60001',
          platform: (l.platform as PlatformType) || PlatformType.TIKTOK_SHOP,
          sourceOrderId: l.sourceOrderId,
          message: l.message,
          durationMs: l.durationMs,
          status: (l.status as WebhookProcessingStatus) || WebhookProcessingStatus.COMPLETED,
          aiHealed: l.aiHealed,
        }));
        setEvents(mapped);
      }
    } catch (err: any) {
      console.warn('Lỗi tải logs từ MongoDB, sử dụng realtime buffer:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogsFromDB();
  }, []);

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <span
              className="live-pulse-dot"
              style={{
                backgroundColor: isConnected ? '#10B981' : '#fcc20f',
              }}
            />
            <span style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 16 }}>
              Live Event Pulse Tracker (Dòng sự kiện thời gian thực)
            </span>
            <Tag color={isConnected ? '#10B981' : '#fcc20f'} style={{ borderRadius: 4, fontWeight: 600 }}>
              {isConnected ? 'Socket.io Live' : 'Đang kết nối lại'}
            </Tag>
          </Space>
          <Space>
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined style={{ color: '#9CA3AF' }} />}
              onClick={loadLogsFromDB}
              loading={loading}
              style={{ color: '#9CA3AF' }}
            >
              Làm mới DB
            </Button>
            <Button
              type="text"
              size="small"
              icon={<ClearOutlined style={{ color: '#9CA3AF' }} />}
              onClick={clearEvents}
              style={{ color: '#9CA3AF' }}
            >
              Xóa log màn hình
            </Button>
          </Space>
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
      {events.length === 0 ? (
        <div style={{ padding: '30px 0', textAlign: 'center', color: '#9CA3AF' }}>
          Chưa có sự kiện mới. Hãy thử chạy script: <code style={{ color: '#fcc20f' }}>node scripts/simulate_webhook.js tiktok</code>
        </div>
      ) : (
        <Timeline
          mode="left"
          items={events.map((event: LiveFeedItem) => {
            const isHealed = event.aiHealed || event.message?.includes('Auto-Healed');
            const isWarning = event.status === WebhookProcessingStatus.FAILED;

            let dotIcon = <CheckCircleFilled style={{ fontSize: 14, color: '#10B981' }} />;

            if (isHealed) {
              dotIcon = <ThunderboltOutlined style={{ fontSize: 14, color: '#fcc20f' }} />;
            } else if (isWarning) {
              dotIcon = <WarningFilled style={{ fontSize: 14, color: '#EF4444' }} />;
            }

            const platformStr = String(event.platform || 'TIKTOK_SHOP').toUpperCase();
            const isTikTok = platformStr.includes('TIKTOK');

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
                      color={isTikTok ? '#000000' : '#EE4D2D'}
                      style={{
                        borderRadius: 4,
                        fontWeight: 700,
                        border: isTikTok ? '1px solid #374151' : 'none',
                      }}
                    >
                      {isTikTok ? 'TikTok Shop' : 'Shopee'}
                    </Tag>
                    <span style={{ color: '#fcc20f', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>
                      #{event.sourceOrderId}
                    </span>
                    <span style={{ color: '#F9FAFB', fontSize: 13 }}>{event.message}</span>
                  </Space>

                  <Space>
                    {isHealed && (
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
                      {event.durationMs ? `${event.durationMs}ms` : '180ms'}
                    </span>
                    <span style={{ color: '#6B7280', fontSize: 11 }}>
                      {event.timestamp || 'Vừa xong'}
                    </span>
                  </Space>
                </div>
              ),
            };
          })}
        />
      )}
    </Card>
  );
};
