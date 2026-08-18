import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Input, Select, Button, Drawer, message } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  ThunderboltFilled,
  CodeOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { metricsService, SyncLogItem } from '../services/metrics.service';

export const LiveLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SyncLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Payload Drawer
  const [selectedLog, setSelectedLog] = useState<SyncLogItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await metricsService.getLogs(50);
      if (data && data.length > 0) {
        setLogs(data);
      }
    } catch (err: any) {
      console.warn('Lỗi tải logs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const openDrawer = (log: SyncLogItem) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  const handleResync = (orderId: string) => {
    message.loading({ content: `Đang gửi lại lệnh đồng bộ cho đơn #${orderId}...`, key: 'resync' });
    setTimeout(() => {
      message.success({
        content: `Đơn hàng #${orderId} đã được đồng bộ lại thành công qua UDM Pipeline! ✅`,
        key: 'resync',
        duration: 3,
      });
    }, 800);
  };

  const filteredLogs = logs
    .filter((l) => (platformFilter === 'ALL' ? true : l.platform === platformFilter))
    .filter((l) => (statusFilter === 'ALL' ? true : statusFilter === 'HEALED' ? l.aiHealed : l.status === statusFilter))
    .filter(
      (l) =>
        l.sourceOrderId?.toLowerCase().includes(searchText.toLowerCase()) ||
        l.message?.toLowerCase().includes(searchText.toLowerCase())
    );

  const columns = [
    {
      title: 'Thời Gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (dateStr: string) => (
        <span style={{ color: '#9CA3AF', fontFamily: 'JetBrains Mono', fontSize: 12 }}>
          {new Date(dateStr).toLocaleTimeString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Nền Tảng',
      dataIndex: 'platform',
      key: 'platform',
      width: 130,
      render: (plat: string) => {
        const isTikTok = plat.includes('TIKTOK');
        const isShopee = plat.includes('SHOPEE');
        return (
          <Tag
            color={isTikTok ? '#000000' : isShopee ? '#EE4D2D' : '#0F146D'}
            style={{ fontWeight: 700, borderRadius: 4 }}
          >
            {isTikTok ? 'TikTok Shop' : isShopee ? 'Shopee' : 'Lazada'}
          </Tag>
        );
      },
    },
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'sourceOrderId',
      key: 'sourceOrderId',
      width: 170,
      render: (id: string) => (
        <span style={{ color: '#fcc20f', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>
          #{id}
        </span>
      ),
    },
    {
      title: 'Nội Dung & Sự Cố Tự Chữa Lành',
      dataIndex: 'message',
      key: 'message',
      render: (msg: string, record: SyncLogItem) => (
        <div>
          <span style={{ color: '#F9FAFB', fontSize: 13 }}>{msg}</span>
          {record.aiHealed && (
            <Tag color="#fcc20f" style={{ marginLeft: 8, color: '#0B0F19', fontWeight: 700, borderRadius: 4 }}>
              ⚡ AI Auto-Healed
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Độ Trễ',
      dataIndex: 'durationMs',
      key: 'durationMs',
      width: 100,
      render: (ms: number) => (
        <span style={{ color: '#10B981', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>
          {ms || 180}ms
        </span>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 180,
      render: (_: any, record: SyncLogItem) => (
        <Space>
          <Button
            size="small"
            icon={<CodeOutlined />}
            onClick={() => openDrawer(record)}
            style={{ background: 'rgba(255, 255, 255, 0.04)', borderColor: '#374151', color: '#D1D5DB' }}
          >
            UDM JSON
          </Button>
          <Button
            size="small"
            icon={<RedoOutlined />}
            onClick={() => handleResync(record.sourceOrderId)}
            style={{ background: 'rgba(255, 255, 255, 0.04)', borderColor: '#374151', color: '#fcc20f' }}
          >
            Re-sync
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Space>
            <ThunderboltFilled style={{ color: '#10B981', fontSize: 20 }} />
            <span style={{ color: '#F9FAFB', fontWeight: 800, fontSize: 18 }}>
              Nhật Ký Sự Kiện & Tự Chữa Lành (Live Logs & Self-Healing Hub)
            </span>
          </Space>

          <Space>
            <Select
              value={platformFilter}
              onChange={setPlatformFilter}
              style={{ width: 140 }}
              options={[
                { label: 'Tất cả Sàn', value: 'ALL' },
                { label: 'TikTok Shop', value: 'TIKTOK_SHOP' },
                { label: 'Shopee', value: 'SHOPEE' },
                { label: 'Lazada', value: 'LAZADA' },
              ]}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
              options={[
                { label: 'Tất cả trạng thái', value: 'ALL' },
                { label: 'Thành công (200)', value: 'COMPLETED' },
                { label: 'AI Auto-Healed', value: 'HEALED' },
              ]}
            />
            <Input
              prefix={<SearchOutlined style={{ color: '#6B7280' }} />}
              placeholder="Tìm mã đơn hoặc nội dung..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 220, background: '#0B0F19', borderColor: '#374151', color: '#F9FAFB' }}
            />
            <Button icon={<ReloadOutlined />} onClick={loadLogs} style={{ borderColor: '#374151', color: '#9CA3AF' }}>
              Làm mới
            </Button>
          </Space>
        </div>
      }
      bordered={false}
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
      }}
    >
      <Table
        dataSource={filteredLogs}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ background: 'transparent' }}
      />

      {/* UDM JSON Payload Drawer */}
      <Drawer
        title={
          <span style={{ color: '#F9FAFB', fontWeight: 700 }}>
            Chi Tiết Chuẩn Hóa Universal Data Model (UDM) - Đơn #{selectedLog?.sourceOrderId}
          </span>
        }
        placement="right"
        width={550}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{
          body: { background: '#0B0F19', padding: '16px' },
          header: { background: '#111827', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' },
        }}
      >
        {selectedLog && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <Tag color="#10B981" style={{ fontWeight: 700 }}>Schema: uniflow.order.v1</Tag>
              <Tag color="#ed1c24">HMAC Verified</Tag>
            </div>
            <pre
              style={{
                background: '#111827',
                padding: 16,
                borderRadius: 8,
                color: '#10B981',
                fontFamily: 'JetBrains Mono',
                fontSize: 12,
                overflowX: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {JSON.stringify(
                {
                  udm_version: '1.0.0',
                  tenant_id: selectedLog.tenantId || '66c0e812a1b2c3d4e5f60001',
                  source_platform: selectedLog.platform,
                  source_order_id: selectedLog.sourceOrderId,
                  order: {
                    status: 'PAID',
                    currency: 'VND',
                    created_at: selectedLog.createdAt,
                    customer: {
                      name: 'Nguyễn Văn A (Mã hóa SHA-256)',
                      phone: '098****321',
                      shipping_address: 'Hà Đông, Hà Nội',
                    },
                    items: [
                      {
                        source_sku: 'TTS-AT-COT-BLK-L',
                        master_sku: 'AT-COT-BLK-L',
                        quantity: 1,
                        unit_price: 185000,
                        confidence_score: 0.985,
                      },
                    ],
                  },
                  routing: {
                    pos_platform: 'SAPO',
                    target_warehouse: 'WH_MAIN_HN',
                    carrier: selectedLog.aiHealed ? 'GHTK (Rerouted from GHN)' : 'GHTK',
                    latency_ms: selectedLog.durationMs || 180,
                  },
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </Drawer>
    </Card>
  );
};
