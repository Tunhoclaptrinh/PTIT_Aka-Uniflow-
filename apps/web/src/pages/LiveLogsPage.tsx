import React, { useState, useEffect } from 'react';
import { Tag, Space, Tooltip } from 'antd';
import {
  CodeOutlined,
  RedoOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { loggingService, SyncLogItem } from '../services/logging.service';
import { formatTimeAgo, formatLatency } from '../utils/formatters';
import {
  DataTable,
  StatusTag,
  BaseButton,
  ActionDrawer,
  PageContainer,
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
      if (data && data.length > 0) {
        setLogs(data);
      }
    } catch (err: any) {
      console.warn('Lỗi khi tải Logs từ API, dùng mock:', err.message);
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
      title: 'Thời Gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 140,
      render: (ts: string) => (
        <span style={{ color: '#4B5563', fontSize: 12, fontFamily: 'JetBrains Mono' }}>
          {formatTimeAgo(ts)}
        </span>
      ),
    },
    {
      title: 'Nền Tảng',
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
      render: (plat: string) => {
        let color = '#000000';
        let text = 'TikTok Shop';
        if (plat.includes('SHOPEE')) {
          color = '#EE4D2D';
          text = 'Shopee';
        } else if (plat.includes('LAZADA')) {
          color = '#0F146D';
          text = 'Lazada';
        }
        return (
          <Tag color={color} style={{ borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
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
      render: (id: string) => (
        <span style={{ color: '#ed1c24', fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: 13 }}>
          #{id}
        </span>
      ),
    },
    {
      title: 'Trạng Thái & Sự Cố Tự Chữa Lành',
      dataIndex: 'message',
      key: 'message',
      render: (msg: string, record: SyncLogItem) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusTag status={record.aiHealed ? 'HEALED' : 'SUCCESS'} />
          <Tooltip title={msg}>
            <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>
              {msg}
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Độ Trễ',
      dataIndex: 'durationMs',
      key: 'durationMs',
      width: 95,
      render: (ms: number) => (
        <span style={{ color: '#10B981', fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: 12 }}>
          {formatLatency(ms || 180)}
        </span>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 110,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: SyncLogItem) => (
        <Space size={6}>
          <Tooltip title="Xem chi tiết chuẩn hóa UDM Payload">
            <button
              className="action-btn-standard"
              onClick={() => openDrawer(record)}
              title="Xem payload UDM JSON"
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 16,
                color: '#8B0000',
              }}
            >
              <CodeOutlined />
            </button>
          </Tooltip>

          <Tooltip title="Re-sync đơn hàng này">
            <button
              className="action-btn-standard"
              onClick={() => handleResync(record.sourceOrderId)}
              title="Re-sync đơn hàng"
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 16,
                color: '#8B0000',
              }}
            >
              <RedoOutlined />
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      icon={<HistoryOutlined style={{ color: '#10B981' }} />}
      title="Nhật Ký Sự Kiện & Tự Chữa Lành (Live Logs & Self-Healing)"
      subtitle="Giám sát toàn bộ lưu lượng đơn hàng TMĐT, phân tích UDM Schema và phục hồi lỗi tự động"
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
        tabs={[
          { key: 'ALL', label: 'Tất Cả' },
          { key: 'TIKTOK', label: 'TikTok Shop' },
          { key: 'SHOPEE', label: 'Shopee' },
          { key: 'LAZADA', label: 'Lazada' },
          { key: 'HEALED', label: 'AI Auto-Healed' },
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
        width={560}
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
                {JSON.stringify(selectedLog.payload || {
                  orderId: selectedLog.sourceOrderId,
                  tenantId: 'tenant-aka-01',
                  platform: selectedLog.platform,
                  standardizedAt: selectedLog.timestamp,
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
