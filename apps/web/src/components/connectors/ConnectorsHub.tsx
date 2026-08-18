import React, { useState } from 'react';
import { Card, Row, Col, Tag, Button, Space, Tabs, Input } from 'antd';
import {
  ApiOutlined,
  SettingOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { ConnectorConfigModal } from './ConnectorConfigModal';

interface ConnectorItem {
  id: string;
  name: string;
  category: 'MARKETPLACE' | 'POS_ERP' | 'LOGISTICS';
  categoryLabel: string;
  status: 'CONNECTED' | 'DISCONNECTED';
  ordersSynced: number;
  latency: string;
  brandColor: string;
  description: string;
}

const initialConnectors: ConnectorItem[] = [
  {
    id: 'tiktok',
    name: 'TikTok Shop',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'CONNECTED',
    ordersSynced: 28450,
    latency: '185ms',
    brandColor: '#000000',
    description: 'Inbound Webhook 0-chạm, xác thực HMAC-SHA256 chuẩn SLA TikTok',
  },
  {
    id: 'shopee',
    name: 'Shopee Open Platform',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'CONNECTED',
    ordersSynced: 14220,
    latency: '210ms',
    brandColor: '#EE4D2D',
    description: 'Nhận push notification READY_TO_SHIP và pull đơn hàng chi tiết qua API v2',
  },
  {
    id: 'lazada',
    name: 'Lazada Open API',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'DISCONNECTED',
    ordersSynced: 5180,
    latency: '230ms',
    brandColor: '#0F146D',
    description: 'Kết nối gian hàng Lazada Mall, đồng bộ trạng thái thanh toán tự động',
  },
  {
    id: 'sapo',
    name: 'Sapo POS & Omnichannel',
    category: 'POS_ERP',
    categoryLabel: 'Quản Lý Kho',
    status: 'CONNECTED',
    ordersSynced: 34100,
    latency: '120ms',
    brandColor: '#0088FF',
    description: 'Tự động trừ tồn kho khả dụng tức thì, chống bán âm khi Mega Sale',
  },
  {
    id: 'kiotviet',
    name: 'KiotViet Retail ERP',
    category: 'POS_ERP',
    categoryLabel: 'Quản Lý Kho',
    status: 'CONNECTED',
    ordersSynced: 8750,
    latency: '145ms',
    brandColor: '#004DB3',
    description: 'Đồng bộ danh mục sản phẩm, tồn kho chi nhánh và tạo hóa đơn bán hàng',
  },
  {
    id: 'ghtk',
    name: 'GHTK Express (iPaaS)',
    category: 'LOGISTICS',
    categoryLabel: 'Vận Chuyển',
    status: 'CONNECTED',
    ordersSynced: 26800,
    latency: '160ms',
    brandColor: '#006633',
    description: 'Đẩy vận đơn tự động, sinh mã barcode và in phiếu giao hàng',
  },
  {
    id: 'ghn',
    name: 'Giao Hàng Nhanh (GHN)',
    category: 'LOGISTICS',
    categoryLabel: 'Vận Chuyển',
    status: 'CONNECTED',
    ordersSynced: 15400,
    latency: '175ms',
    brandColor: '#EA5400',
    description: 'Tích hợp dịch vụ giao hàng chuẩn và điều phối chuyển phát nhanh',
  },
  {
    id: 'viettelpost',
    name: 'Viettel Post API',
    category: 'LOGISTICS',
    categoryLabel: 'Vận Chuyển',
    status: 'DISCONNECTED',
    ordersSynced: 3200,
    latency: '190ms',
    brandColor: '#EE0033',
    description: 'Tuyến vận chuyển dự phòng với mạng lưới bưu cục toàn quốc',
  },
];

export const ConnectorsHub: React.FC = () => {
  const [connectors] = useState<ConnectorItem[]>(initialConnectors);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchText, setSearchText] = useState('');
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const openConfig = (c: ConnectorItem) => {
    setSelectedConnector(c);
    setConfigModalOpen(true);
  };

  const filteredConnectors = connectors
    .filter((c) => {
      if (activeTab === 'MARKETPLACE') return c.category === 'MARKETPLACE';
      if (activeTab === 'POS_ERP') return c.category === 'POS_ERP';
      if (activeTab === 'LOGISTICS') return c.category === 'LOGISTICS';
      return true;
    })
    .filter((c) => c.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Space>
          <ApiOutlined style={{ color: '#fcc20f', fontSize: 24 }} />
          <div>
            <div style={{ color: '#F9FAFB', fontWeight: 800, fontSize: 20 }}>
              Trung Tâm Kết Nối Đa Kênh (Omnichannel Connectors Hub)
            </div>
            <div style={{ color: '#9CA3AF', fontSize: 13 }}>
              Quản lý các kết nối API Sàn TMĐT, Phần mềm Kho POS và Đơn vị Vận chuyển
            </div>
          </div>
        </Space>

        <Space>
          <Input
            prefix={<SearchOutlined style={{ color: '#6B7280' }} />}
            placeholder="Tìm kênh kết nối..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 240, background: '#111827', borderColor: '#374151', color: '#F9FAFB' }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
              border: 'none',
              fontWeight: 700,
              borderRadius: 8,
            }}
          >
            Thêm Kênh Mới
          </Button>
        </Space>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'ALL', label: `Tất Cả (${connectors.length})` },
          { key: 'MARKETPLACE', label: `Sàn Thương Mại Điện Tử (3)` },
          { key: 'POS_ERP', label: `Quản Lý Kho & POS (2)` },
          { key: 'LOGISTICS', label: `Đơn Vị Vận Chuyển (3)` },
        ]}
      />

      {/* Connectors Grid */}
      <Row gutter={[20, 20]}>
        {filteredConnectors.map((c) => {
          const isConnected = c.status === 'CONNECTED';

          return (
            <Col xs={24} sm={12} lg={6} key={c.id}>
              <Card
                bordered={false}
                style={{
                  background: '#111827',
                  border: `1px solid ${isConnected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)'}`,
                  borderRadius: 14,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                bodyStyle={{ padding: 20 }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Tag color={isConnected ? '#10B981' : '#6B7280'} style={{ borderRadius: 4, fontWeight: 700 }}>
                      {isConnected ? '● ACTIVE' : '○ DISCONNECTED'}
                    </Tag>
                    <Tag style={{ background: 'rgba(255, 255, 255, 0.04)', borderColor: '#374151', color: '#D1D5DB' }}>
                      {c.categoryLabel}
                    </Tag>
                  </div>

                  <div style={{ fontSize: 18, fontWeight: 700, color: '#F9FAFB', marginBottom: 6 }}>
                    {c.name}
                  </div>

                  <div style={{ color: '#9CA3AF', fontSize: 12, lineHeight: 1.5, minHeight: 36, marginBottom: 16 }}>
                    {c.description}
                  </div>

                  <div
                    style={{
                      background: '#0B0F19',
                      padding: '10px 12px',
                      borderRadius: 8,
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <div style={{ color: '#6B7280' }}>Đơn đã xử lý</div>
                      <div style={{ color: '#fcc20f', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                        {c.ordersSynced.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#6B7280' }}>Độ trễ API</div>
                      <div style={{ color: '#10B981', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                        {c.latency}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Button
                    block
                    icon={<SettingOutlined />}
                    onClick={() => openConfig(c)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderColor: '#374151',
                      color: '#F9FAFB',
                      fontWeight: 600,
                    }}
                  >
                    Cấu Hình API
                  </Button>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Config Modal */}
      <ConnectorConfigModal
        open={configModalOpen}
        connector={selectedConnector}
        onClose={() => {
          setConfigModalOpen(false);
          setSelectedConnector(null);
        }}
      />
    </div>
  );
};
