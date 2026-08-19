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
        notify.warning('Chưa có quy trình nào để chạy thử! Vui lòng tạo quy trình trước.');
        return;
      }

      notify.loading('Đang chạy mô phỏng luồng 0-chạm qua Backend & AI...', 'quickDryRun');
      const res = await workflowService.dryRun(wfId);
      notify.success(
        `Chạy mô phỏng thành công: Đơn #${res.orderId} -> Vận đơn: ${res.waybillCode} (${res.durationMs || res.latencyMs}ms)`
      );

      // Thêm log mô phỏng trực tiếp vào live feed
      const newLiveItem: LiveFeedItem = {
        id: res.logId || `log_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        tenantId: '66c0e812a1b2c3d4e5f60001',
        platform: PlatformType.TIKTOK_SHOP,
        sourceOrderId: res.orderId,
        message: res.message,
        durationMs: res.durationMs || 185,
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

  const tenantDisplayName = tenant?.name || user?.name || 'Doanh Nghiệp Omnichannel';

  return (
    <PageContainer
      title="Tổng quan"
      tooltip={`Hệ thống điều khiển vận hành đơn hàng đa kênh • ${tenantDisplayName}`}
      extra={
        <Space size="middle">
          <Space size="small" style={{ marginRight: 8 }}>
            <BadgeStatus status="success" text="Atlas Online" />
            <BadgeStatus status="success" text="Redis 24h" />
          </Space>

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
            Chạy thử đơn mẫu
          </BaseButton>
        </Space>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* ── 1. KPI CARDS ────────────────────────── */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Tổng đơn đã đồng bộ"
              value={metrics?.totalSyncedOrders || 28520}
              icon={<SyncOutlined style={{ color: '#ed1c24' }} />}
              trend={{ value: '+18.4%', isIncrease: true, label: 'Tháng này' }}
              subText="Tự động 100% qua UDM Pipeline"
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Độ trễ trung bình (E2E)"
              value={formatLatency(metrics?.averageLatencyMs || 142)}
              icon={<ThunderboltOutlined style={{ color: '#F59E0B' }} />}
              tag={{ text: 'P99 < 200ms', color: '#10B981' }}
              subText="Inbound ➔ POS Kho ➔ Vận đơn"
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Tỷ lệ thành công"
              value={`${metrics?.successRate || '99.8%'}`}
              icon={<CheckCircleOutlined style={{ color: '#10B981' }} />}
              tag={{ text: 'Chuẩn SLA 99.8%', color: '#10B981' }}
              subText="Tự động phát hiện lỗi và chuyển tuyến"
            />
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              title="Chi phí nhân sự tiết kiệm"
              value={formatVND(metrics?.costSavedVND || 41350000, true)}
              icon={<DollarOutlined style={{ color: '#8B5CF6' }} />}
              trend={{ value: `${metrics?.hoursSaved || 180} Giờ`, isIncrease: true, label: 'Tiết kiệm 95% thao tác' }}
              subText="Ước tính theo khối lượng đơn tự động"
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
                  <span>Phân bổ lưu lượng theo sàn TMĐT</span>
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
                      {metrics?.channelBreakdown?.tiktok?.count || metrics?.channels?.tiktok?.orderCount || 12840} đơn ({metrics?.channelBreakdown?.tiktok?.percent || metrics?.channels?.tiktok?.percentage || 45}%)
                    </span>
                  </div>
                  <Progress
                    percent={metrics?.channelBreakdown?.tiktok?.percent || metrics?.channels?.tiktok?.percentage || 45}
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
                      {metrics?.channelBreakdown?.shopee?.count || metrics?.channels?.shopee?.orderCount || 9980} đơn ({metrics?.channelBreakdown?.shopee?.percent || metrics?.channels?.shopee?.percentage || 35}%)
                    </span>
                  </div>
                  <Progress
                    percent={metrics?.channelBreakdown?.shopee?.percent || metrics?.channels?.shopee?.percentage || 35}
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
                      {metrics?.channelBreakdown?.lazada?.count || metrics?.channels?.lazada?.orderCount || 5700} đơn ({metrics?.channelBreakdown?.lazada?.percent || metrics?.channels?.lazada?.percentage || 20}%)
                    </span>
                  </div>
                  <Progress
                    percent={metrics?.channelBreakdown?.lazada?.percent || metrics?.channels?.lazada?.percentage || 20}
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
                  <span>Sức khỏe ánh xạ SKU AI</span>
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
                      {metrics?.skuHealth?.matchRate || '98.5%'}
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
                      <div style={{ color: '#6B7280', fontSize: 11, fontWeight: 600 }}>Tự động duyệt</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#10B981', marginTop: 2 }}>
                        {metrics?.skuHealth?.autoApproved || 4120}
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
                      <div style={{ color: '#6B7280', fontSize: 11, fontWeight: 600 }}>Chờ duyệt (≥90%)</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#D97706', marginTop: 2 }}>
                        {metrics?.skuHealth?.pendingReview || 86}
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
                      <div style={{ color: '#6B7280', fontSize: 11, fontWeight: 600 }}>Cần ghép tay</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#DC2626', marginTop: 2 }}>
                        {metrics?.skuHealth?.manualRequired || 14}
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
                  <span>Quy trình tự động hóa</span>
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
                          <Tag color={wf.isActive ? 'success' : 'default'} style={{ margin: 0, fontWeight: 600, fontSize: 11 }}>
                            {wf.executionCount || 0} lần chạy
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
                  <span>Luồng xử lý đơn thời gian thực</span>
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
                    title="Chưa có sự kiện nào"
                    description="Các đơn hàng mới tiếp nhận từ Webhook sẽ hiển thị tại đây"
                  />
                ) : (
                  <Timeline
                    items={events.map((evt) => {
                      const isSuccess = evt.status === WebhookProcessingStatus.COMPLETED;
                      const isHealed = evt.aiHealed;

                      return {
                        color: isHealed ? '#8B5CF6' : isSuccess ? '#10B981' : '#EF4444',
                        dot: isHealed ? (
                          <ThunderboltOutlined style={{ fontSize: 14, color: '#8B5CF6' }} />
                        ) : isSuccess ? (
                          <CheckCircleFilled style={{ fontSize: 14, color: '#10B981' }} />
                        ) : undefined,
                        children: (
                          <div
                            style={{
                              padding: '8px 12px',
                              borderRadius: 6,
                              background: '#F9FAFB',
                              border: '1px solid #E5E7EB',
                              marginBottom: 8,
                              cursor: evt.rawLog ? 'pointer' : 'default',
                            }}
                            onClick={() => {
                              if (evt.rawLog) {
                                setSelectedLog(evt.rawLog);
                                setDrawerOpen(true);
                              }
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Space size="small">
                                <Tag
                                  color={
                                    evt.platform === PlatformType.TIKTOK_SHOP
                                      ? '#000000'
                                      : evt.platform === PlatformType.SHOPEE
                                      ? '#EE4D2D'
                                      : '#0F146D'
                                  }
                                  style={{ fontWeight: 700, borderRadius: 4, fontSize: 10 }}
                                >
                                  {evt.platform}
                                </Tag>
                                <span style={{ fontWeight: 600, fontSize: 12, color: '#111827' }}>
                                  #{evt.sourceOrderId}
                                </span>
                              </Space>
                              <span style={{ fontSize: 11, color: '#9CA3AF' }}>{evt.timestamp}</span>
                            </div>

                            <div style={{ color: '#4B5563', fontSize: 12, marginTop: 4, lineHeight: 1.4 }}>
                              {evt.message}
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

        {/* Selected Log Action Drawer */}
        <ActionDrawer
          title={`Chi tiết sự kiện đơn #${selectedLog?.sourceOrderId}`}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedLog(null);
          }}
          width={480}
        >
          {selectedLog && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#F9FAFB', padding: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>Nền tảng:</span>
                  <Tag style={{ fontWeight: 700 }}>{selectedLog.platform}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>Trạng thái:</span>
                  <StatusTag status={selectedLog.status as any} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>Độ trễ xử lý:</span>
                  <span style={{ fontWeight: 600, color: '#10B981', fontSize: 12 }}>
                    {selectedLog.durationMs}ms
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#111827' }}>
                  Thông điệp xử lý:
                </div>
                <div style={{ padding: '10px 12px', background: '#F3F4F6', borderRadius: 6, fontSize: 12, color: '#374151' }}>
                  {selectedLog.message}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CodeOutlined /> Dữ liệu gói tin thô (Payload JSON):
                </div>
                <pre
                  style={{
                    background: '#0F172A',
                    color: '#38BDF8',
                    padding: 12,
                    borderRadius: 6,
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace',
                    overflowX: 'auto',
                    maxHeight: 280,
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
