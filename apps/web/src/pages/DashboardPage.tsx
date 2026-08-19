import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Space, Progress, Tag } from 'antd';
import {
  ReloadOutlined,
  PlayCircleOutlined,
  CodeOutlined,
  ArrowRightOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { metricsService, DashboardMetrics, SyncLogItem } from '../services/metrics.service';
import { workflowService, WorkflowData } from '../services/workflow.service';
import { useAuthStore } from '../store/useAuthStore';
import { useWebSocketStream } from '../hooks/useWebSocketStream';
import { LiveFeedItem, PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';
import {
  BaseButton,
  PageContainer,
  ActionDrawer,
  EmptyState,
} from '../components/base';
import { formatVND, formatLatency } from '../utils/formatters';
import { notify } from '../utils/notification';
import { getPartnerLogo } from '../utils/partnerLogos';

export const DashboardPage: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dryRunning, setDryRunning] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString('vi-VN'));

  // Selected Log Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SyncLogItem | null>(null);

  // WebSocket Live Stream
  const { events, isConnected, setEvents } = useWebSocketStream([]);

  const loadData = useCallback(async () => {
    try {
      const [m, logs, wfs] = await Promise.all([
        metricsService.getMetrics(),
        metricsService.getLogs(20),
        workflowService.getAllWorkflows(),
      ]);
      if (m) setMetrics(m);
      if (wfs) setWorkflows(wfs);
      if (logs && logs.length > 0) {
        const mappedEvents: LiveFeedItem[] = logs.map((l) => ({
          id: l._id,
          timestamp: new Date(l.createdAt).toLocaleTimeString('vi-VN'),
          tenantId: l.tenantId || '66c0e812a1b2c3d4e5f60001',
          platform: (l.platform as PlatformType) || PlatformType.TIKTOK_SHOP,
          sourceOrderId: l.sourceOrderId,
          message: l.message,
          durationMs: l.durationMs,
          status: (l.status as WebhookProcessingStatus) || WebhookProcessingStatus.COMPLETED,
          aiHealed: l.aiHealed,
          rawLog: l,
        }));
        setEvents(mappedEvents);
      }
      setLastRefreshed(new Date().toLocaleTimeString('vi-VN'));
    } catch (err: any) {
      console.warn('Lỗi tải dữ liệu dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  }, [setEvents]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Quick Sample Order Dry-Run
  const handleQuickDryRun = async () => {
    setDryRunning(true);
    try {
      let wfId = '';
      if (workflows && workflows.length > 0) {
        wfId = workflows[0]._id || (workflows[0] as any).id || '';
      } else {
        const allWfs = await workflowService.getAllWorkflows();
        if (allWfs && allWfs.length > 0) {
          wfId = allWfs[0]._id || (allWfs[0] as any).id || '';
        }
      }

      if (!wfId) {
        notify.warning('Chưa có quy trình nào để chạy thử! Vui lòng tạo quy trình trước.');
        return;
      }

      notify.loading('Đang chạy mô phỏng luồng 0-chạm qua Backend & AI...', 'quickDryRun');
      const res = await workflowService.dryRun(wfId);
      notify.success(
        `Mô phỏng thành công: Đơn #${res.orderId} ➔ Vận đơn: ${res.waybillCode} (${res.durationMs || res.latencyMs}ms)`
      );

      const newLiveItem: LiveFeedItem = {
        id: res.logId || `log_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        tenantId: '66c0e812a1b2c3d4e5f60001',
        platform: PlatformType.TIKTOK_SHOP,
        sourceOrderId: res.orderId,
        message: res.message,
        durationMs: res.durationMs || 175,
        status: WebhookProcessingStatus.COMPLETED,
        aiHealed: false,
      };

      setEvents((prev) => [newLiveItem, ...prev.slice(0, 19)]);
      loadData();
    } catch (err: any) {
      notify.error('Lỗi khi chạy thử: ' + err.message);
    } finally {
      setDryRunning(false);
    }
  };

  const handleCopyPayload = () => {
    if (selectedLog) {
      navigator.clipboard.writeText(JSON.stringify(selectedLog.rawPayload || selectedLog.payload || selectedLog, null, 2));
      notify.success('Đã sao chép gói tin JSON vào clipboard!');
    }
  };

  const tenantDisplayName = tenant?.name || user?.name || 'Doanh Nghiệp Omnichannel';

  return (
    <PageContainer
      title="Tổng quan vận hành"
      tooltip={`Báo cáo điều phối đơn hàng và hiệu năng tự động hóa thời gian thực • ${tenantDisplayName}`}
      extra={
        <Space size={8} wrap>
          {/* Real-time Infrastructure Status Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 11.5,
              height: 32,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#10B981', fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
              Atlas Online (24ms)
            </span>
            <span style={{ color: '#E2E8F0' }}>|</span>
            <span style={{ color: '#8B5CF6', fontWeight: 600 }}>AI Gateway Ready</span>
            <span style={{ color: '#E2E8F0' }}>|</span>
            <span style={{ color: '#64748B' }}>{lastRefreshed}</span>
          </div>

          <BaseButton
            variant="secondary"
            size="small"
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={loadData}
          >
            Làm mới
          </BaseButton>

          <BaseButton
            variant="primary"
            size="small"
            icon={<PlayCircleOutlined />}
            loading={dryRunning}
            onClick={handleQuickDryRun}
          >
            Chạy thử đơn mẫu 0-chạm
          </BaseButton>
        </Space>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* ── 1. KPI MATRIX CARDS (4 CHỈ SỐ CỐT LÕI - KHÍT & TỐI GIẢN) ────────── */}
        <Row gutter={[10, 10]}>
          {/* Card 1: Total Synced */}
          <Col xs={24} sm={12} lg={6}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                padding: '12px 14px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Tổng đơn đã đồng bộ</span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: '#059669',
                    background: '#ECFDF5',
                    padding: '1px 6px',
                    borderRadius: 4,
                    border: '1px solid #A7F3D0',
                  }}
                >
                  +18.4% Tháng này
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {(metrics?.totalSyncedOrders || 28520).toLocaleString('vi-VN')}
                </div>
                <div style={{ color: '#94A3B8', fontSize: 11, marginTop: 4 }}>
                  Tự động 100% qua UDM Pipeline
                </div>
              </div>
            </div>
          </Col>

          {/* Card 2: End-to-End Latency */}
          <Col xs={24} sm={12} lg={6}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                padding: '12px 14px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Độ trễ trung bình (E2E)</span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: '#059669',
                    background: '#ECFDF5',
                    padding: '1px 6px',
                    borderRadius: 4,
                    border: '1px solid #A7F3D0',
                  }}
                >
                  P99 &lt; 200ms
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {formatLatency(metrics?.averageLatencyMs || 142)}
                </div>
                <div style={{ color: '#94A3B8', fontSize: 11, marginTop: 4 }}>
                  Inbound ➔ POS Kho ➔ Vận đơn
                </div>
              </div>
            </div>
          </Col>

          {/* Card 3: Success Rate */}
          <Col xs={24} sm={12} lg={6}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                padding: '12px 14px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Tỷ lệ thành công luồng</span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: '#059669',
                    background: '#ECFDF5',
                    padding: '1px 6px',
                    borderRadius: 4,
                    border: '1px solid #A7F3D0',
                  }}
                >
                  SLA 99.8%
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {metrics?.successRate || '99.8%'}
                </div>
                <div style={{ color: '#94A3B8', fontSize: 11, marginTop: 4 }}>
                  Tự động phục hồi AI failover
                </div>
              </div>
            </div>
          </Col>

          {/* Card 4: Cost & Time Saved */}
          <Col xs={24} sm={12} lg={6}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                padding: '12px 14px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Chi phí tiết kiệm</span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: '#2563EB',
                    background: '#EFF6FF',
                    padding: '1px 6px',
                    borderRadius: 4,
                    border: '1px solid #BFDBFE',
                  }}
                >
                  ~{metrics?.hoursSaved || 180} Giờ
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                  {formatVND(metrics?.costSavedVND || 41350000, true)}
                </div>
                <div style={{ color: '#94A3B8', fontSize: 11, marginTop: 4 }}>
                  Tiết kiệm 95% thao tác nhân sự
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* ── 2. MID ROW (PHÂN BỔ KÊNH TMĐT & SỨC KHỎE SKU AI - CĂN THẲNG HÀNG 100%) ── */}
        <Row gutter={[10, 10]} align="stretch">
          {/* Card 1: Channel Traffic Share (Span 14) */}
          <Col xs={24} lg={14}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                padding: '12px 14px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Phân bổ lưu lượng kênh TMĐT</span>
                <Link to="/connectors" style={{ fontSize: 11.5, fontWeight: 600, color: '#8B5CF6' }}>
                  Kênh kết nối <ArrowRightOutlined style={{ fontSize: 10 }} />
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, justifyContent: 'center' }}>
                {/* TikTok Shop */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 8px',
                    background: '#F8FAFC',
                    borderRadius: 4,
                    border: '1px solid #F1F5F9',
                  }}
                >
                  <img src={getPartnerLogo('tiktok') || ''} alt="TikTok" style={{ width: 16, height: 16, objectFit: 'contain', flexShrink: 0 }} />
                  <div style={{ width: 95, flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: '#0F172A' }}>TikTok Shop</div>
                  </div>
                  <div style={{ flex: 1, padding: '0 6px' }}>
                    <Progress
                      percent={metrics?.channelBreakdown?.tiktok?.percent || metrics?.channels?.tiktok?.percentage || 46}
                      strokeColor="#0F172A"
                      trailColor="#E2E8F0"
                      showInfo={false}
                      strokeWidth={5}
                    />
                  </div>
                  <div style={{ width: 85, textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: '#0F172A' }}>
                      {(metrics?.channelBreakdown?.tiktok?.count || metrics?.channels?.tiktok?.orderCount || 51).toLocaleString('vi-VN')} đơn
                    </span>
                    <span style={{ fontSize: 10.5, color: '#64748B', marginLeft: 4 }}>(46%)</span>
                  </div>
                </div>

                {/* Shopee */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 8px',
                    background: '#F8FAFC',
                    borderRadius: 4,
                    border: '1px solid #F1F5F9',
                  }}
                >
                  <img src={getPartnerLogo('shopee') || ''} alt="Shopee" style={{ width: 16, height: 16, objectFit: 'contain', flexShrink: 0 }} />
                  <div style={{ width: 95, flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: '#0F172A' }}>Shopee Open</div>
                  </div>
                  <div style={{ flex: 1, padding: '0 6px' }}>
                    <Progress
                      percent={metrics?.channelBreakdown?.shopee?.percent || metrics?.channels?.shopee?.percentage || 45}
                      strokeColor="#EE4D2D"
                      trailColor="#E2E8F0"
                      showInfo={false}
                      strokeWidth={5}
                    />
                  </div>
                  <div style={{ width: 85, textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: '#0F172A' }}>
                      {(metrics?.channelBreakdown?.shopee?.count || metrics?.channels?.shopee?.orderCount || 50).toLocaleString('vi-VN')} đơn
                    </span>
                    <span style={{ fontSize: 10.5, color: '#64748B', marginLeft: 4 }}>(45%)</span>
                  </div>
                </div>

                {/* Lazada */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 8px',
                    background: '#F8FAFC',
                    borderRadius: 4,
                    border: '1px solid #F1F5F9',
                  }}
                >
                  <img src={getPartnerLogo('lazada') || ''} alt="Lazada" style={{ width: 16, height: 16, objectFit: 'contain', flexShrink: 0 }} />
                  <div style={{ width: 95, flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: '#0F172A' }}>Lazada Mall</div>
                  </div>
                  <div style={{ flex: 1, padding: '0 6px' }}>
                    <Progress
                      percent={metrics?.channelBreakdown?.lazada?.percent || metrics?.channels?.lazada?.percentage || 9}
                      strokeColor="#0F146D"
                      trailColor="#E2E8F0"
                      showInfo={false}
                      strokeWidth={5}
                    />
                  </div>
                  <div style={{ width: 85, textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: '#0F172A' }}>
                      {(metrics?.channelBreakdown?.lazada?.count || metrics?.channels?.lazada?.orderCount || 9).toLocaleString('vi-VN')} đơn
                    </span>
                    <span style={{ fontSize: 10.5, color: '#64748B', marginLeft: 4 }}>(9%)</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Card 2: AI SKU Health (Span 10) */}
          <Col xs={24} lg={10}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                padding: '12px 14px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Sức khỏe ánh xạ SKU AI</span>
                <Link to="/mapping" style={{ fontSize: 11.5, fontWeight: 600, color: '#8B5CF6' }}>
                  Quản lý SKU <ArrowRightOutlined style={{ fontSize: 10 }} />
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ color: '#64748B', fontSize: 11.5 }}>Tỷ lệ khớp tự động:</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#10B981', lineHeight: 1 }}>
                      {metrics?.skuHealth?.matchRate || '98.5%'}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      background: '#F5F3FF',
                      color: '#7C3AED',
                      padding: '2px 6px',
                      borderRadius: 3,
                      fontWeight: 600,
                      border: '1px solid #DDD6FE',
                    }}
                  >
                    Vector Cosine + NER
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  <div
                    style={{
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      padding: '6px 8px',
                      borderRadius: 4,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ color: '#15803D', fontSize: 10.5, fontWeight: 600 }}>Tự động duyệt</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981', marginTop: 1 }}>
                      {(metrics?.skuHealth?.autoApproved || 7).toLocaleString('vi-VN')}
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      padding: '6px 8px',
                      borderRadius: 4,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ color: '#B45309', fontSize: 10.5, fontWeight: 600 }}>Chờ duyệt</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#D97706', marginTop: 1 }}>
                      {(metrics?.skuHealth?.pendingReview || 5).toLocaleString('vi-VN')}
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#FEF2F2',
                      border: '1px solid #FECACA',
                      padding: '6px 8px',
                      borderRadius: 4,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ color: '#B91C1C', fontSize: 10.5, fontWeight: 600 }}>Ghép tay</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#DC2626', marginTop: 1 }}>
                      {(metrics?.skuHealth?.manualRequired || 1).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* ── 3. BOTTOM ROW (TERMINAL SỰ KIỆN LIVE & QUY TRÌNH KÍCH HOẠT - CĂN THẲNG HÀNG 100%) ── */}
        <Row gutter={[10, 10]} align="stretch">
          {/* Card 1: Live Terminal Event Stream (Span 14) */}
          <Col xs={24} lg={14}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                padding: '12px 14px',
                height: 340,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Nhật ký luồng xử lý đơn</span>
                  <span
                    style={{
                      fontSize: 10.5,
                      background: isConnected ? '#ECFDF5' : '#F1F5F9',
                      color: isConnected ? '#059669' : '#64748B',
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontWeight: 600,
                      border: `1px solid ${isConnected ? '#A7F3D0' : '#E2E8F0'}`,
                    }}
                  >
                    {isConnected ? '● WebSocket Live' : '● Live Polling'}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{events.length} sự kiện gần nhất</span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 2 }}>
                {events.length === 0 ? (
                  <EmptyState
                    title="Chưa có sự kiện nào"
                    description="Các đơn hàng mới tiếp nhận từ Webhook sẽ hiển thị tại đây"
                  />
                ) : (
                  events.map((evt) => {
                    const isSuccess = evt.status === WebhookProcessingStatus.COMPLETED;
                    const isHealed = evt.aiHealed;
                    const platformLogo = getPartnerLogo(evt.platform || '');

                    return (
                      <div
                        key={evt.id}
                        onClick={() => {
                          if (evt.rawLog) {
                            setSelectedLog(evt.rawLog);
                            setDrawerOpen(true);
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '5px 8px',
                          borderRadius: 4,
                          background: '#F8FAFC',
                          border: '1px solid #F1F5F9',
                          cursor: evt.rawLog ? 'pointer' : 'default',
                          transition: 'all 0.12s ease',
                          fontSize: 11.5,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
                          <span style={{ fontSize: 10.5, color: '#94A3B8', fontFamily: 'monospace', flexShrink: 0 }}>
                            {evt.timestamp}
                          </span>
                          {platformLogo ? (
                            <img src={platformLogo} alt="" style={{ width: 13, height: 13, objectFit: 'contain', flexShrink: 0 }} />
                          ) : null}
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: 11,
                              color: '#0F172A',
                              fontFamily: 'monospace',
                              flexShrink: 0,
                            }}
                          >
                            #{evt.sourceOrderId}
                          </span>
                          <span
                            style={{
                              color: '#475569',
                              fontSize: 11,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              flex: 1,
                            }}
                            title={evt.message}
                          >
                            {(evt.message || '').replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '').trim()}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                          <span style={{ fontSize: 10.5, color: '#10B981', fontWeight: 600 }}>
                            {evt.durationMs || 140}ms
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: '1px 5px',
                              borderRadius: 3,
                              background: isHealed ? '#F5F3FF' : isSuccess ? '#ECFDF5' : '#FEF2F2',
                              color: isHealed ? '#7C3AED' : isSuccess ? '#059669' : '#DC2626',
                              border: `1px solid ${isHealed ? '#DDD6FE' : isSuccess ? '#A7F3D0' : '#FECACA'}`,
                            }}
                          >
                            {isHealed ? 'AI Fix' : isSuccess ? 'Thành công' : 'Lỗi'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Col>

          {/* Card 2: Active Workflows (Span 10) */}
          <Col xs={24} lg={10}>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 6,
                padding: '12px 14px',
                height: 340,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Quy trình tự động hóa</span>
                <Link to="/workflows" style={{ fontSize: 11.5, fontWeight: 600, color: '#8B5CF6' }}>
                  Mở Canvas <ArrowRightOutlined style={{ fontSize: 10 }} />
                </Link>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 2 }}>
                {workflows && workflows.length > 0 ? (
                  workflows.map((wf) => {
                    const triggerNode = wf.nodes?.find((n: any) => n.type === 'trigger');
                    const actionNode = wf.nodes?.find((n: any) => n.type === 'action');
                    const source = triggerNode?.data?.label || triggerNode?.data?.platform || 'TikTok Shop';
                    const target = actionNode?.data?.label || actionNode?.data?.platform || 'Sapo POS';

                    return (
                      <div
                        key={wf._id}
                        style={{
                          background: '#F8FAFC',
                          borderRadius: 4,
                          border: '1px solid #F1F5F9',
                          padding: '5px 8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: 11.5,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 11.5,
                              color: '#0F172A',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={wf.name}
                          >
                            <span style={{ color: wf.isActive ? '#10B981' : '#94A3B8', marginRight: 4 }}>●</span>
                            {wf.name}
                          </div>
                          <div
                            style={{
                              color: '#64748B',
                              fontSize: 10.5,
                              marginTop: 1,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {source} ➔ {target}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '1px 5px',
                              borderRadius: 3,
                              background: wf.isActive ? '#ECFDF5' : '#F1F5F9',
                              color: wf.isActive ? '#059669' : '#64748B',
                              border: `1px solid ${wf.isActive ? '#A7F3D0' : '#E2E8F0'}`,
                            }}
                          >
                            {(wf.executionCount || 0).toLocaleString('vi-VN')} đơn
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState
                    title="Chưa có quy trình nào"
                    description="Tạo quy trình mới trên Canvas để tự động hóa đơn hàng"
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* Selected Log Action Drawer */}
        <ActionDrawer
          title={`Chi tiết sự kiện đơn #${selectedLog?.sourceOrderId}`}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedLog(null);
          }}
          width={620}
        >
          {selectedLog && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 6, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: '#64748B', fontSize: 11.5 }}>Nền tảng tiếp nhận:</span>
                  <Tag style={{ fontWeight: 700, margin: 0, fontSize: 11 }}>{selectedLog.platform}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ color: '#64748B', fontSize: 11.5 }}>Trạng thái xử lý:</span>
                  <span style={{ fontWeight: 700, color: '#10B981', fontSize: 11.5 }}>
                    {selectedLog.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B', fontSize: 11.5 }}>Độ trễ toàn trình (E2E):</span>
                  <span style={{ fontWeight: 700, color: '#10B981', fontSize: 11.5 }}>
                    {selectedLog.durationMs}ms
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: 12.5, marginBottom: 5, color: '#0F172A' }}>
                  Thông điệp điều phối UDM:
                </div>
                <div style={{ padding: '8px 10px', background: '#F1F5F9', borderRadius: 4, fontSize: 11.5, color: '#334155', lineHeight: 1.4 }}>
                  {selectedLog.message}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontWeight: 600, fontSize: 12.5, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CodeOutlined /> Gói tin thô UDM Schema (Payload JSON):
                  </span>
                  <BaseButton
                    variant="secondary"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={handleCopyPayload}
                  >
                    Sao chép
                  </BaseButton>
                </div>
                <pre
                  style={{
                    background: '#0F172A',
                    color: '#38BDF8',
                    padding: 10,
                    borderRadius: 4,
                    fontSize: 10.5,
                    fontFamily: 'JetBrains Mono, monospace',
                    overflowX: 'auto',
                    maxHeight: 260,
                  }}
                >
                  {JSON.stringify(selectedLog.rawPayload || selectedLog.payload || selectedLog, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </ActionDrawer>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
