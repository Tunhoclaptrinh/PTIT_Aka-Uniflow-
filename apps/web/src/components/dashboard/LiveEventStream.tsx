import React, { useEffect, useState } from 'react';
import { Timeline, Tag, Space } from 'antd';
import {
  ThunderboltOutlined,
  CheckCircleFilled,
  ClearOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useWebSocketStream } from '../../hooks/useWebSocketStream';
import { metricsService } from '../../services/metrics.service';
import { LiveFeedItem, PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';
import { BaseCard, BaseButton, StatusTag, BadgeStatus, EmptyState } from '../base';
import { formatLatency } from '../../utils/formatters';

export const LiveEventStream: React.FC = () => {
  const { events, isConnected, clearEvents, setEvents } = useWebSocketStream([]);
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
      console.warn('Lỗi lấy logs từ DB, dùng WebSocket:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogsFromDB();
  }, []);

  return (
    <BaseCard
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThunderboltOutlined style={{ color: '#ed1c24', fontSize: 18 }} />
          <span>Luồng Xử Lý Đơn Thời Gian Thực (Live WebSocket Event Stream)</span>
          <BadgeStatus
            status={isConnected ? 'success' : 'warning'}
            text={isConnected ? 'Socket.io Đang Kết Nối' : 'Chế Độ Offline'}
          />
        </div>
      }
      subtitle="Bắt sự kiện Webhook đơn hàng, chuẩn hóa UDM và cập nhật tức thì"
      extra={
        <Space>
          <BaseButton
            variant="secondary"
            size="small"
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={loadLogsFromDB}
          >
            Làm mới
          </BaseButton>
          <BaseButton
            variant="ghost"
            size="small"
            icon={<ClearOutlined />}
            onClick={clearEvents}
          >
            Xóa Luồng
          </BaseButton>
        </Space>
      }
    >
      <div style={{ maxHeight: 380, overflowY: 'auto', paddingRight: 8 }}>
        {events.length === 0 ? (
          <EmptyState
            title="Chưa có sự kiện đơn hàng nào"
            description="Đang chờ luồng webhook đẩy đơn từ TikTok Shop, Shopee hoặc Lazada..."
          />
        ) : (
          <Timeline
            items={events.map((event) => {
              const isTikTok = event.platform === PlatformType.TIKTOK_SHOP;
              const isShopee = event.platform === PlatformType.SHOPEE;
              const isLazada = event.platform === PlatformType.LAZADA;

              return {
                color: event.aiHealed ? '#fcc20f' : '#10B981',
                dot: event.aiHealed ? (
                  <ThunderboltOutlined style={{ color: '#fcc20f', fontSize: 14 }} />
                ) : (
                  <CheckCircleFilled style={{ color: '#10B981', fontSize: 14 }} />
                ),
                children: (
                  <div
                    style={{
                      background: '#F8FAFC',
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid #E5E7EB',
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Space size="small">
                        <Tag
                          color={isTikTok ? '#000000' : isShopee ? '#EE4D2D' : isLazada ? '#0F146D' : '#374151'}
                          style={{ borderRadius: 4, fontWeight: 700, fontSize: 11 }}
                        >
                          {event.platform}
                        </Tag>
                        <span style={{ color: '#ed1c24', fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: 12 }}>
                          #{event.sourceOrderId}
                        </span>
                        {event.aiHealed && <StatusTag status="HEALED" />}
                      </Space>
                      <span style={{ color: '#6B7280', fontSize: 11, fontFamily: 'JetBrains Mono' }}>
                        {event.timestamp}
                      </span>
                    </div>

                    <div style={{ color: '#374151', fontSize: 13, lineHeight: 1.4 }}>
                      {event.message}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: '#10B981', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                        {formatLatency(event.durationMs || 180)}
                      </span>
                    </div>
                  </div>
                ),
              };
            })}
          />
        )}
      </div>
    </BaseCard>
  );
};
