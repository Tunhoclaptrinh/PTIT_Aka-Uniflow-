import React, { useState, useEffect } from 'react';
import { Tag, Space, Tooltip } from 'antd';
import {
  CodeOutlined,
  RedoOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { loggingService, SyncLogItem } from '../services/logging.service';
import { formatTimeAgo, formatLatency } from '../utils/formatters';
import {
  DataTable,
  StatusTag,
  BaseButton,
  IconButton,
  ActionDrawer,
  PageContainer,
  FilterConfig,
} from '../components/base';
import { notify } from '../utils/notification';

export const LiveLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SyncLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SyncLogItem | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await loggingService.getLogs();
      setLogs(data || []);
    } catch (err: any) {
      notify.error('Lỗi khi tải nhật ký sự kiện: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleResync = async (orderId: string) => {
    try {
      await loggingService.retrySync(orderId);
      notify.success(`Đã phát lệnh Re-sync đơn #${orderId} thành công qua Inbound Webhook!`);
      loadLogs();
    } catch (err: any) {
      notify.error(`Lỗi khi Re-sync đơn #${orderId}: ${err.message}`);
    }
  };

  const openDrawer = (log: SyncLogItem) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  const tabFilteredLogs = logs.filter((log) => {
    if (activeTab === 'TIKTOK') return log.platform.includes('TIKTOK');
    if (activeTab === 'SHOPEE') return log.platform.includes('SHOPEE');
    if (activeTab === 'LAZADA') return log.platform.includes('LAZADA');
    if (activeTab === 'HEALED') return log.aiHealed;
    return true;
  });

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      sorter: (a: SyncLogItem, b: SyncLogItem) =>
        new Date(a.createdAt || a.timestamp || 0).getTime() - new Date(b.createdAt || b.timestamp || 0).getTime(),
      render: (_: any, record: SyncLogItem) => (
        <span style={{ color: '#4B5563', fontSize: 12, fontFamily: 'JetBrains Mono' }}>
          {formatTimeAgo(record.createdAt || record.timestamp || new Date().toISOString())}
        </span>
      ),
    },
    {
      title: 'Nền Tảng',
      dataIndex: 'platform',
      key: 'platform',
      width: 125,
      sorter: (a: SyncLogItem, b: SyncLogItem) => a.platform.localeCompare(b.platform),
      filters: [
        { text: 'TikTok Shop', value: 'TIKTOK' },
        { text: 'Shopee', value: 'SHOPEE' },
        { text: 'Lazada', value: 'LAZADA' },
      ],
      onFilter: (value: any, record: SyncLogItem) => record.platform.includes(value),
      render: (plat: string) => {
        const isTikTok = plat.includes('TIKTOK');
        const isShopee = plat.includes('SHOPEE');
        const text = isTikTok ? 'TikTok Shop' : isShopee ? 'Shopee' : 'Lazada';
        return (
          <Tag
            style={{
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 11,
              padding: '1px 6px',
              background: isTikTok
                ? 'rgba(148, 163, 184, 0.15)'
                : isShopee
                  ? 'rgba(238, 77, 45, 0.15)'
                  : 'rgba(59, 130, 246, 0.15)',
              border: `1px solid ${
                isTikTok
                  ? 'rgba(148, 163, 184, 0.3)'
                  : isShopee
                    ? 'rgba(238, 77, 45, 0.3)'
                    : 'rgba(59, 130, 246, 0.3)'
              }`,
              color: isTikTok ? 'var(--text-primary, #F8FAFC)' : isShopee ? '#FB923C' : '#60A5FA',
            }}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'sourceOrderId',
      key: 'sourceOrderId',
      width: 160,
      sorter: (a: SyncLogItem, b: SyncLogItem) => a.sourceOrderId.localeCompare(b.sourceOrderId),
      render: (id: string, record: SyncLogItem) => (
        <span
          style={{ color: '#ed1c24', fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: 13, cursor: 'pointer' }}
          onClick={() => openDrawer(record)}
        >
          #{id}
        </span>
      ),
    },
    {
      title: 'Trạng Thái & Sự Cố Tự Chữa Lành',
      dataIndex: 'message',
      key: 'message',
      render: (msg: string, record: SyncLogItem) => {
        const cleanMsg = (msg || '').replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '').trim();
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusTag status={record.aiHealed ? 'HEALED' : 'SUCCESS'} />
            <Tooltip title={cleanMsg}>
              <span style={{ fontSize: 13, color: 'var(--text-primary, #374151)', lineHeight: 1.4 }}>
                {cleanMsg}
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: 'Độ Trễ',
      dataIndex: 'durationMs',
      key: 'durationMs',
      width: 95,
      sorter: (a: SyncLogItem, b: SyncLogItem) => (a.durationMs || 0) - (b.durationMs || 0),
      render: (ms: number) => (
        <span style={{ color: '#10B981', fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: 12 }}>
          {formatLatency(ms || 180)}
        </span>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: SyncLogItem) => {
        const isSuccess = record.status === 'SUCCESS' || record.aiHealed;
        return (
          <Space size={2}>
            {/* 1. Fixed Action: View UDM JSON Payload */}
            <IconButton
              icon={<CodeOutlined />}
              tooltip="Xem chi tiết chuẩn hóa UDM Payload"
              onClick={() => openDrawer(record)}
            />

            {/* 2. Fixed Action: Re-sync (Active if error/failed, Disabled if already synced) */}
            <IconButton
              icon={<RedoOutlined />}
              tooltip={isSuccess ? 'Đơn hàng đã đồng bộ chuẩn xác' : 'Kích hoạt tự chữa lành & Thử lại'}
              success={!isSuccess}
              disabled={isSuccess}
              onClick={() => handleResync(record.sourceOrderId)}
            />

            {/* 3. Fixed Action: Copy Order ID */}
            <IconButton
              icon={<CopyOutlined />}
              tooltip="Sao chép mã đơn hàng"
              onClick={() => {
                navigator.clipboard.writeText(record.sourceOrderId);
                notify.success(`Đã sao chép mã đơn #${record.sourceOrderId}`);
              }}
            />
          </Space>
        );
      },
    },
  ];

  const logFilters: FilterConfig[] = [
    {
      key: 'platform',
      label: 'Nền tảng',
      type: 'select',
      options: [
        { label: 'TikTok Shop', value: 'TIKTOK' },
        { label: 'Shopee', value: 'SHOPEE' },
        { label: 'Lazada', value: 'LAZADA' },
      ],
      operators: ['eq', 'ne'],
    },
    {
      key: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { label: 'Thành công (SUCCESS)', value: 'SUCCESS' },
        { label: 'Đang xử lý (PENDING)', value: 'PENDING' },
        { label: 'Lỗi (FAILED)', value: 'FAILED' },
      ],
      operators: ['eq', 'ne'],
    },
    {
      key: 'sourceOrderId',
      label: 'Mã đơn hàng sàn',
      type: 'input',
      operators: ['eq', 'like'],
    },
    {
      key: 'waybillCode',
      label: 'Mã vận đơn HVC',
      type: 'input',
      operators: ['eq', 'like'],
    },
  ];

  return (
    <PageContainer
      title="Nhật ký sự kiện"
      tooltip="Giám sát toàn bộ lưu lượng đơn hàng TMĐT, phân tích UDM Schema và tự phục hồi lỗi chuyển tuyến"
    >
      <DataTable
        dataSource={tabFilteredLogs}
        columns={columns}
        rowKey="_id"
        loading={loading}
        onRefresh={loadLogs}
        exportable={true}
        exportFilename="uniflow-sync-logs"
        searchFields={['sourceOrderId', 'message', 'platform']}
        filters={logFilters}
        tabs={[
          { key: 'ALL', label: 'Tất cả' },
          { key: 'TIKTOK', label: 'TikTok Shop' },
          { key: 'SHOPEE', label: 'Shopee' },
          { key: 'LAZADA', label: 'Lazada' },
          { key: 'HEALED', label: 'AI tự phục hồi' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* UDM JSON Payload Drawer chuẩn Base ActionDrawer */}
      <ActionDrawer
        title={
          <Space>
            <CodeOutlined style={{ color: '#10B981' }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              Chi Tiết Chuẩn Hóa UDM Schema (Payload Viewer)
            </span>
          </Space>
        }
        width={600}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <BaseButton variant="ghost" size="small" onClick={() => setDrawerOpen(false)}>
              Đóng
            </BaseButton>
            <BaseButton
              variant="primary"
              size="small"
              icon={<RedoOutlined />}
              glow
              onClick={() => {
                if (selectedLog) handleResync(selectedLog.sourceOrderId);
                setDrawerOpen(false);
              }}
            >
              Re-sync Đơn Hàng Này
            </BaseButton>
          </div>
        }
      >
        {selectedLog && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  Mã đơn sàn: #{selectedLog.sourceOrderId}
                </div>
                <div style={{ color: '#6B7280', fontSize: 12 }}>
                  Nền tảng: {selectedLog.platform}
                </div>
              </div>
              <StatusTag status={selectedLog.aiHealed ? 'HEALED' : 'SUCCESS'} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Thông điệp xử lý:
              </div>
              <div style={{ background: '#F9FAFB', padding: '10px 14px', borderRadius: 8, fontSize: 13, border: '1px solid #E5E7EB' }}>
                {selectedLog.message}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                Universal Data Model (UDM) JSON:
              </div>
              <pre
                style={{
                  background: '#1E293B',
                  color: '#38BDF8',
                  padding: 16,
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: 'JetBrains Mono, monospace',
                  overflowX: 'auto',
                  maxHeight: 380,
                }}
              >
                {JSON.stringify(selectedLog.rawPayload || selectedLog.payload || {
                  orderId: selectedLog.sourceOrderId,
                  platform: selectedLog.platform,
                  processedAt: selectedLog.createdAt || selectedLog.timestamp,
                  canonicalLineItems: [
                    { sku: 'TTS-TSHIRT-01', masterSku: 'SAPO_POLO_01', quantity: 1, unitPrice: 250000 },
                  ],
                  shippingAddress: { city: 'Hà Nội', district: 'Hà Đông', country: 'VN' },
                }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </ActionDrawer>
    </PageContainer>
  );
};

export default LiveLogsPage;
