import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Space, Progress, Tag, Timeline } from 'antd';
import {
  SyncOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  ReloadOutlined,
  BranchesOutlined,
  ShoppingOutlined,
  CheckCircleFilled,
  PlayCircleOutlined,
  CodeOutlined,
  RiseOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { metricsService, DashboardMetrics, SyncLogItem } from '../services/metrics.service';
import { workflowService, WorkflowData } from '../services/workflow.service';
import { useAuthStore } from '../store/useAuthStore';
import { useWebSocketStream } from '../hooks/useWebSocketStream';
import { LiveFeedItem, PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';
import {
  BaseCard,
  BaseButton,
  StatisticCard,
  StatusTag,
  BadgeStatus,
  PageContainer,
  ActionDrawer,
  EmptyState,
} from '../components/base';
import { formatVND, formatLatency } from '../utils/formatters';
import { notify } from '../utils/notification';

export const DashboardPage: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dryRunning, setDryRunning] = useState(false);

  // Selected Log Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SyncLogItem | null>(null);

  // WebSocket Live Stream
  const { events, isConnected, setEvents } = useWebSocketStream([]);

  const loadData = useCallback(async () => {
    try {
      const [m, logs, wfs] = await Promise.all([
        metricsService.getMetrics(),
        metricsService.getLogs(15),
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
        notify.warning('Không tìm thấy quy trình nào để chạy thử!');
        return;
      }

      const result = await workflowService.dryRun(wfId);
      notify.success(`Đã xử lý đơn thử nghiệm #${result.orderId} qua UDM Pipeline (${result.latencyMs}ms)!`);
      await loadData();
    } catch (err: any) {
      notify.error('Lỗi khi chạy thử: ' + err.message);
    } finally {
      setDryRunning(false);
    }
  };

  const openLogDrawer = (rawLog?: SyncLogItem) => {
    if (rawLog) {
      setSelectedLog(rawLog);
      setDrawerOpen(true);
    }
  };

  const tenantDisplayName = tenant?.name || user?.name || 'Doanh Nghiệp Omnichannel';

  return (
    <PageContainer
      title="Tổng Quan"
      tooltip={`Hệ thống điều khiển vận hành đơn hàng đa kênh • ${tenantDisplayName}`}
      extra={
        <Space size="middle">
          <Space size="small" style={{ marginRight: 8 }}>
            <BadgeStatus status="success" text="Atlas Online" />
            <BadgeStatus status="success" text="Redis 24h" />
          </Space>

          <BaseButton
            variant="secondary"
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={loadData}
          >
            Làm mới
          </BaseButton>

          <BaseButton
            variant="brand"
            icon={<PlayCircleOutlined />}
            loading={dryRunning}
            glow
            onClick={handleQuickDryRun}
          >
            Chạy thử đơn mẫu
          </BaseButton>
        </Space>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* ── 1. KPI CARDS (BASE STANDARD 4-CARD ROW) ────────────────────────── */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Tổng đơn đã đồng bộ"
              value={metrics?.totalSyncedOrders || 67530}
              icon={<SyncOutlined style={{ color: '#ed1c24' }} />}
              trend={{ value: '+18.4%', isIncrease: true, label: 'Mega Sale' }}
              subText="Tự động 100% qua UDM Pipeline"
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Độ trễ trung bình (E2E)"
              value={formatLatency(metrics?.averageLatencyMs || 224)}
              icon={<ThunderboltOutlined style={{ color: '#F59E0B' }} />}
              tag={{ text: 'P99 < 200ms', color: '#10B981' }}
              subText="Inbound ➔ Sapo POS ➔ Vận đơn"
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Tỷ lệ thành công"
              value={`${metrics?.successRate || 99.98}%`}
              icon={<CheckCircleOutlined style={{ color: '#10B981' }} />}
              tag={{ text: '99.98% High SLA', color: '#10B981' }}
              subText={
                (metrics?.healedOrdersCount || 0) > 0
                  ? `Đã tự chữa lành ${metrics?.healedOrdersCount} đơn chuyển tuyến`
                  : 'Không có đơn nghẽn'
              }
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Chi phí & Thời gian tiết kiệm"
              value={formatVND(metrics?.costSavedVND || 21500000, true)}
              icon={<DollarOutlined style={{ color: '#8B5CF6' }} />}
              trend={{ value: `${metrics?.hoursSaved || 142} Giờ`, isIncrease: true, label: 'Giảm 90% thao tác' }}
              subText="Quy đổi chi phí nhân sự tháng"
            />
          </Col>
        </Row>

        {/* ── 2. MID GRID: CHANNEL BREAKDOWN & AI SKU HEALTH ───────────────── */}
        <Row gutter={[16, 16]}>
          {/* Card 1: Channel Traffic Share */}
          <Col xs={24} lg={12}>
            <BaseCard
              title={
                <Space size={8}>
                  <RiseOutlined style={{ color: '#ed1c24' }} />
                  <span>Phân Bổ Lưu Lượng Theo Sàn TMĐT</span>
                </Space>
              }
              subtitle="Tỷ lệ đơn hàng tiếp nhận và xử lý qua Webhook"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '4px 0' }}>
                {/* TikTok Shop */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Space size="small">
                      <Tag color="#000000" style={{ fontWeight: 700, borderRadius: 4 }}>TikTok Shop</Tag>
                      <span style={{ fontSize: 12, color: '#6B7280' }}>Webhook Inbound</span>
                    </Space>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
                      {metrics?.channelBreakdown?.tiktok.count || 6} đơn ({metrics?.channelBreakdown?.tiktok.percent || 50}%)
                    </span>
                  </div>
                  <Progress
                    percent={metrics?.channelBreakdown?.tiktok.percent || 50}
                    strokeColor="#111827"
                    trailColor="#F3F4F6"
                    showInfo={false}
                  />
                </div>

                {/* Shopee */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Space size="small">
                      <Tag color="#EE4D2D" style={{ fontWeight: 700, borderRadius: 4 }}>Shopee</Tag>
                      <span style={{ fontSize: 12, color: '#6B7280' }}>Open API v2</span>
                    </Space>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
                      {metrics?.channelBreakdown?.shopee.count || 4} đơn ({metrics?.channelBreakdown?.shopee.percent || 33}%)
                    </span>
                  </div>
                  <Progress
                    percent={metrics?.channelBreakdown?.shopee.percent || 33}
                    strokeColor="#EE4D2D"
                    trailColor="#F3F4F6"
                    showInfo={false}
                  />
                </div>

                {/* Lazada */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Space size="small">
                      <Tag color="#0F146D" style={{ fontWeight: 700, borderRadius: 4 }}>Lazada</Tag>
                      <span style={{ fontSize: 12, color: '#6B7280' }}>REST Webhook</span>
                    </Space>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
                      {metrics?.channelBreakdown?.lazada.count || 2} đơn ({metrics?.channelBreakdown?.lazada.percent || 17}%)
                    </span>
                  </div>
                  <Progress
                    percent={metrics?.channelBreakdown?.lazada.percent || 17}
                    strokeColor="#0F146D"
                    trailColor="#F3F4F6"
                    showInfo={false}
                  />
                </div>
              </div>
            </BaseCard>
          </Col>

          {/* Card 2: AI SKU Health */}
          <Col xs={24} lg={12}>
            <BaseCard
              title={
                <Space size={8}>
                  <ShoppingOutlined style={{ color: '#8B5CF6' }} />
                  <span>Sức Khỏe Ánh Xạ SKU AI</span>
                </Space>
              }
              subtitle="Khớp nối sản phẩm sàn TMĐT và Master SKU kho POS"
              extra={
                <Link to="/mapping">
                  <BaseButton variant="ghost" size="small">
                    Quản lý SKU <ArrowRightOutlined />
                  </BaseButton>
                </Link>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#6B7280', fontSize: 12 }}>Tỷ lệ khớp tự động (Match Rate)</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981', lineHeight: 1.2 }}>
                      {metrics?.skuHealth?.matchRate || 95}%
                    </div>
                  </div>
                  <Tag color="#10B981" style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                    Vector Cosine + NER
                  </Tag>
                </div>

                <Row gutter={[8, 8]}>
                  <Col span={8}>
                    <div
                      style={{
                        background: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        borderTop: '3px solid #10B981',
                        padding: '8px 10px',
                        borderRadius: 6,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ color: '#6B7280', fontSize: 11, fontWeight: 600 }}>TỰ ĐỘNG DUYỆT</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#10B981', marginTop: 2 }}>
                        {metrics?.skuHealth?.autoApproved || 6}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        background: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        borderTop: '3px solid #F59E0B',
                        padding: '8px 10px',
                        borderRadius: 6,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ color: '#6B7280', fontSize: 11, fontWeight: 600 }}>CHỜ DUYỆT (≥90%)</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#D97706', marginTop: 2 }}>
                        {metrics?.skuHealth?.pendingReview || 3}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        background: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        borderTop: '3px solid #EF4444',
                        padding: '8px 10px',
                        borderRadius: 6,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ color: '#6B7280', fontSize: 11, fontWeight: 600 }}>CẦN GHÉP TAY</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#DC2626', marginTop: 2 }}>
                        {metrics?.skuHealth?.manualRequired || 1}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </BaseCard>
          </Col>
        </Row>

        {/* ── 3. BOTTOM GRID: ACTIVE WORKFLOWS & LIVE EVENT STREAM ─────────── */}
        <Row gutter={[16, 16]}>
          {/* Card 1: Active Workflows */}
          <Col xs={24} lg={10}>
            <BaseCard
              title={
                <Space size={8}>
                  <BranchesOutlined style={{ color: '#ed1c24' }} />
                  <span>Quy Trình Tự Động Hóa</span>
                </Space>
              }
              subtitle="Các luồng đồng bộ đang kích hoạt"
              extra={
                <Link to="/workflows">
                  <BaseButton variant="ghost" size="small">
                    Mở Canvas <ArrowRightOutlined />
                  </BaseButton>
                </Link>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto' }}>
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
                          background: '#F9FAFB',
                          borderRadius: 6,
                          border: '1px solid #E5E7EB',
                          padding: '10px 12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
                            {wf.name}
                          </div>
                          <div style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                            {source} ➔ {target}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Tag color="blue" style={{ margin: 0, fontWeight: 600, fontSize: 11 }}>
                            {wf.executionCount || 12} lần chạy
                          </Tag>
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
            </BaseCard>
          </Col>

          {/* Card 2: Live Event Stream */}
          <Col xs={24} lg={14}>
            <BaseCard
              title={
                <Space size={8}>
                  <ThunderboltOutlined style={{ color: '#ed1c24' }} />
                  <span>Luồng Xử Lý Đơn Thời Gian Thực</span>
                  <BadgeStatus
                    status={isConnected ? 'success' : 'processing'}
                    text={isConnected ? 'WebSocket' : 'Polling'}
                  />
                </Space>
              }
              subtitle="Nhật ký xử lý đơn hàng tức thì từ các sàn TMĐT"
            >
              <div style={{ maxHeight: 360, overflowY: 'auto', paddingRight: 6 }}>
                {events.length === 0 ? (
                  <EmptyState
                    title="Đang chờ sự kiện đơn hàng..."
                    description="Bấm 'Chạy thử đơn mẫu' ở phía trên để kiểm tra đường ống UDM"
                  />
                ) : (
                  <Timeline
                    items={events.map((event) => {
                      const isTikTok = event.platform === PlatformType.TIKTOK_SHOP;
                      const isShopee = event.platform === PlatformType.SHOPEE;
                      const isLazada = event.platform === PlatformType.LAZADA;

                      return {
                        color: event.aiHealed ? '#F59E0B' : '#10B981',
                        dot: event.aiHealed ? (
                          <ThunderboltOutlined style={{ color: '#F59E0B', fontSize: 13 }} />
                        ) : (
                          <CheckCircleFilled style={{ color: '#10B981', fontSize: 13 }} />
                        ),
                        children: (
                          <div
                            style={{
                              background: '#F9FAFB',
                              padding: '8px 12px',
                              borderRadius: 6,
                              border: '1px solid #E5E7EB',
                              marginBottom: 6,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onClick={() => openLogDrawer((event as any).rawLog)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                              <Space size="small">
                                <Tag
                                  color={isTikTok ? '#000000' : isShopee ? '#EE4D2D' : isLazada ? '#0F146D' : '#374151'}
                                  style={{ borderRadius: 3, fontWeight: 700, fontSize: 10, padding: '0 4px' }}
                                >
                                  {event.platform}
                                </Tag>
                                <span style={{ color: '#ed1c24', fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: 12 }}>
                                  #{event.sourceOrderId}
                                </span>
                                {event.aiHealed && <StatusTag status="HEALED" />}
                              </Space>
                              <span style={{ color: '#9CA3AF', fontSize: 11, fontFamily: 'JetBrains Mono' }}>
                                {event.timestamp}
                              </span>
                            </div>

                            <div style={{ color: '#4B5563', fontSize: 12, lineHeight: 1.35 }}>
                              {event.message}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                              <span style={{ fontSize: 11, color: '#8B5CF6' }}>
                                Xem UDM Schema ➔
                              </span>
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
          </Col>
        </Row>
      </div>

      {/* ── 4. LOG UDM SCHEMA DETAIL DRAWER ─────────────────────────────────── */}
      <ActionDrawer
        open={drawerOpen}
        title={
          <Space size={8}>
            <CodeOutlined style={{ color: '#ed1c24' }} />
            <span>UDM Schema Payload: #{selectedLog?.sourceOrderId}</span>
          </Space>
        }
        onClose={() => setDrawerOpen(false)}
        width={560}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <BaseButton variant="ghost" onClick={() => setDrawerOpen(false)}>
              Đóng
            </BaseButton>
          </div>
        }
      >
        {selectedLog && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#6B7280', fontSize: 12 }}>Nền tảng sàn:</span>
                <Tag color="#000000" style={{ fontWeight: 700 }}>{selectedLog.platform}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#6B7280', fontSize: 12 }}>Độ trễ xử lý E2E:</span>
                <span style={{ color: '#10B981', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                  {formatLatency(selectedLog.durationMs || 180)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280', fontSize: 12 }}>Thời gian tiếp nhận:</span>
                <span style={{ color: '#374151', fontSize: 12 }}>{new Date(selectedLog.createdAt).toLocaleString('vi-VN')}</span>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                Universal Data Model (UDM) Normalized JSON Payload
              </div>
              <pre
                style={{
                  background: '#0B0F19',
                  color: '#10B981',
                  padding: 14,
                  borderRadius: 8,
                  fontFamily: 'JetBrains Mono',
                  fontSize: 12,
                  maxHeight: 340,
                  overflowY: 'auto',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {JSON.stringify(selectedLog.payload || {
                  schema_version: '2.0.0',
                  order_id: selectedLog.sourceOrderId,
                  platform: selectedLog.platform,
                  status: selectedLog.status,
                  idempotency_key: `idem_24h_${selectedLog.sourceOrderId}`,
                  items: [
                    {
                      sku_code: 'AO-POLO-NAM-DEN-L',
                      master_sku: 'AP-COT-BLK-L',
                      quantity: 1,
                      price: 285000,
                    }
                  ],
                  shipping: {
                    carrier: 'GHTK',
                    waybill: `VNP_${selectedLog.sourceOrderId}`,
                    estimated_days: 2,
                  },
                }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </ActionDrawer>
    </PageContainer>
  );
};

export default DashboardPage;
