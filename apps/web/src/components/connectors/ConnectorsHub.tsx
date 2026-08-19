import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Space, Tabs } from 'antd';
import {
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ConnectorConfigModal } from './ConnectorConfigModal';
import { AddConnectorModal } from './AddConnectorModal';
import { StatusTag, BaseButton, SearchInput, EmptyState, PageContainer } from '../base';
import { notify } from '../../utils/notification';
import { metricsService } from '../../services/metrics.service';
import { getPartnerLogo } from '../../utils/partnerLogos';

export interface ConnectorItem {
  id: string;
  name: string;
  category: 'MARKETPLACE' | 'POS_ERP' | 'LOGISTICS' | 'CHAT_SOCIAL' | 'SPREADSHEET' | 'LANDING_PAGE' | 'ACCOUNTING';
  categoryLabel: string;
  status: 'CONNECTED' | 'DISCONNECTED';
  ordersSynced: number;
  latency: string;
  brandColor: string;
  description: string;
  appKey?: string;
  appSecret?: string;
  endpoint?: string;
}

const defaultConnectorsList: ConnectorItem[] = [
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
    id: 'pancake',
    name: 'Pancake POS & Social Chat',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'CONNECTED',
    ordersSynced: 31200,
    latency: '110ms',
    brandColor: '#2563EB',
    description: 'Đồng bộ tin nhắn Fanpage Facebook, Zalo OA và AI CSKH tự động tư vấn chốt đơn',
  },
  {
    id: 'zalo',
    name: 'Zalo OA & ZNS Notification',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'CONNECTED',
    ordersSynced: 15400,
    latency: '95ms',
    brandColor: '#0068FF',
    description: 'Tự động gửi thông báo biến động đơn hàng, mã tracking vận đơn qua Zalo ZNS',
  },
  {
    id: 'telegram',
    name: 'Telegram Bot Webhook',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'CONNECTED',
    ordersSynced: 42300,
    latency: '80ms',
    brandColor: '#24A1DE',
    description: 'Nhận báo cáo đơn hàng mới, cảnh báo lỗi ánh xạ SKU và phê duyệt 1-click tức thì',
  },
  {
    id: 'sapo',
    name: 'Sapo POS & Omnichannel',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'CONNECTED',
    ordersSynced: 38900,
    latency: '145ms',
    brandColor: '#0088FF',
    description: 'Trừ tồn kho tức thì (Live Inventory Deduct) và cập nhật phiếu xuất kho',
  },
  {
    id: 'kiotviet',
    name: 'KiotViet Retail API',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'CONNECTED',
    ordersSynced: 19800,
    latency: '160ms',
    brandColor: '#004F9E',
    description: 'Đồng bộ hóa đơn bán hàng và trừ tồn kho chi nhánh theo thời gian thực',
  },
  {
    id: 'nhanh',
    name: 'Nhanh.vn Omnichannel POS',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'CONNECTED',
    ordersSynced: 12600,
    latency: '170ms',
    brandColor: '#FF6F00',
    description: 'Đồng bộ danh mục đa chi nhánh, trạng thái đối soát và phiếu chuyển kho nội bộ',
  },
  {
    id: 'haravan',
    name: 'Haravan Omnichannel',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'DISCONNECTED',
    ordersSynced: 3400,
    latency: '190ms',
    brandColor: '#E65100',
    description: 'Đồng bộ dữ liệu sản phẩm, giá bán và hóa đơn điện tử Haravan',
  },
  {
    id: 'ladipage',
    name: 'LadiPage Form Inbound',
    category: 'LANDING_PAGE',
    categoryLabel: 'Landing Page & Form',
    status: 'CONNECTED',
    ordersSynced: 8700,
    latency: '85ms',
    brandColor: '#10B981',
    description: 'Thu thập đơn hàng từ form Landing Page, tự động chuẩn hóa địa chỉ và đẩy sang POS',
  },
  {
    id: 'ghtk',
    name: 'Giao Hàng Tiết Kiệm (GHTK)',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'CONNECTED',
    ordersSynced: 26100,
    latency: '175ms',
    brandColor: '#005D38',
    description: 'Tạo vận đơn tự động, lấy mã tracking và in phiếu giao hàng A6 ngay lập tức',
  },
  {
    id: 'ghn',
    name: 'Giao Hàng Nhanh (GHN Express)',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'CONNECTED',
    ordersSynced: 18400,
    latency: '150ms',
    brandColor: '#F26522',
    description: 'Tự động tính cước vận chuyển chuẩn SLA và định tuyến thông minh (Smart Rerouting)',
  },
  {
    id: 'viettelpost',
    name: 'Viettel Post API',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'CONNECTED',
    ordersSynced: 14500,
    latency: '135ms',
    brandColor: '#EE0033',
    description: 'Đồng bộ đơn hàng vận chuyển Viettel Post và tra cứu hành trình trực tiếp',
  },
  {
    id: 'googlesheets',
    name: 'Google Sheets Live Sync',
    category: 'SPREADSHEET',
    categoryLabel: 'Bảng tính & Tệp tin',
    status: 'CONNECTED',
    ordersSynced: 16400,
    latency: '120ms',
    brandColor: '#0F9D58',
    description: 'Tự động chèn dòng đơn hàng realtime, trích xuất báo cáo doanh thu & tồn kho tức thì',
  },
  {
    id: 'excel',
    name: 'Microsoft Excel / CSV Engine',
    category: 'SPREADSHEET',
    categoryLabel: 'Bảng tính & Tệp tin',
    status: 'CONNECTED',
    ordersSynced: 9200,
    latency: '95ms',
    brandColor: '#107C41',
    description: 'Xuất file Excel (.xlsx) theo mẫu tùy biến, đồng bộ OneDrive & nhập xuất SKU hàng loạt',
  },
  {
    id: 'misa_amis',
    name: 'MISA AMIS Kế toán',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'CONNECTED',
    ordersSynced: 4820,
    latency: '140ms',
    brandColor: '#0070C0',
    description: 'Tự động ghi sổ cái, xuất chứng từ và đồng bộ hóa đơn VAT sang MISA AMIS theo thời gian thực',
  },
  {
    id: 'misa_meinvoice',
    name: 'MISA meInvoice (Hóa đơn điện tử)',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'CONNECTED',
    ordersSynced: 3120,
    latency: '155ms',
    brandColor: '#0070C0',
    description: 'Phát hành hóa đơn GTGT điện tử ký số, tuân thủ Nghị định 117/2025 & Thông tư 40/2021',
  },
  {
    id: 'fast_accounting',
    name: 'Fast Accounting ERP',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'DISCONNECTED',
    ordersSynced: 1840,
    latency: '185ms',
    brandColor: '#E65100',
    description: 'Đối soát số dư tài khoản ngân hàng, tổng hợp báo cáo tài chính và kê khai thuế TNCN',
  },
  {
    id: 'bravo_erp',
    name: 'Bravo ERP',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'DISCONNECTED',
    ordersSynced: 920,
    latency: '200ms',
    brandColor: '#1565C0',
    description: 'Quản lý tài chính tổng hợp, phân tích lãi lỗ đa trung tâm chi phí và kiểm toán nội bộ',
  },
];

export const ConnectorsHub: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorItem[]>(defaultConnectorsList);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [configModalOpen, setConfigModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null);

  // Sync real metrics from MongoDB Atlas
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const metrics = await metricsService.getDashboardMetrics();
        if (metrics && metrics.channels) {
          setConnectors((prev) =>
            prev.map((c) => {
              if (c.id === 'tiktok' && metrics.channels?.tiktok) {
                return { ...c, ordersSynced: metrics.channels.tiktok.orderCount || c.ordersSynced };
              }
              if (c.id === 'shopee' && metrics.channels?.shopee) {
                return { ...c, ordersSynced: metrics.channels.shopee.orderCount || c.ordersSynced };
              }
              if (c.id === 'lazada' && metrics.channels?.lazada) {
                return { ...c, ordersSynced: metrics.channels.lazada.orderCount || c.ordersSynced };
              }
              return c;
            })
          );
        }
      } catch (err: any) {
        console.warn('Lỗi đồng bộ dữ liệu connectors:', err.message);
      }
    };
    fetchRealData();
  }, []);

  const filteredConnectors = connectors.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenConfig = (connector: ConnectorItem) => {
    setSelectedConnector(connector);
    setConfigModalOpen(true);
  };

  const handleSaveConfig = (updatedConnector: ConnectorItem) => {
    setConnectors((prev) =>
      prev.map((c) => (c.id === updatedConnector.id ? updatedConnector : c))
    );
    notify.success(`Đã cập nhật cấu hình cho ${updatedConnector.name} thành công!`);
  };

  const handleAddConnector = (newConnector: ConnectorItem) => {
    setConnectors((prev) => [newConnector, ...prev]);
  };

  return (
    <PageContainer
      title="Kênh kết nối"
      tooltip="Cấu hình OAuth2, API Keys và Webhook Inbound cho các đối tác Sàn TMĐT, Kho POS và Đơn vị vận chuyển"
      extra={
        <Space size="middle">
          <SearchInput
            placeholder="Tìm kiếm cổng kết nối..."
            value={searchQuery}
            onSearchChange={setSearchQuery}
            style={{ width: 240 }}
          />
          <BaseButton
            variant="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setAddModalOpen(true)}
          >
            Thêm kết nối mới
          </BaseButton>
        </Space>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Category Tabs */}
        <Tabs
          size='small'
          activeKey={selectedCategory}
          onChange={setSelectedCategory}
          items={[
            { key: 'ALL', label: 'Tất cả cổng kết nối' },
            { key: 'MARKETPLACE', label: 'Sàn TMĐT' },
            { key: 'POS_ERP', label: 'Quản lý kho POS & ERP' },
            { key: 'LOGISTICS', label: 'Đơn vị vận chuyển' },
            { key: 'ACCOUNTING', label: 'Kế toán & Thuế (MISA meInvoice / AMIS)' },
            { key: 'CHAT_SOCIAL', label: 'CSKH & Hội thoại (Pancake, Zalo, Telegram)' },
            { key: 'SPREADSHEET', label: 'Bảng tính & Excel' },
            { key: 'LANDING_PAGE', label: 'Landing Page & Form' },
          ]}
        />

        {/* Connectors Grid */}
        {filteredConnectors.length === 0 ? (
          <EmptyState
            title="Không tìm thấy cổng kết nối nào"
            description="Vui lòng thử lại với từ khóa khác hoặc chuyển danh mục."
          />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredConnectors.map((item) => {
              const isConnected = item.status === 'CONNECTED';

              return (
                <Col xs={24} sm={12} lg={8} key={item.id}>
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 12,
                      border: '1px solid var(--border-subtle, #E5E7EB)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 20 }}
                  >
                    <div>
                      {/* Top Row: Full Bare Logo & Status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 44, marginBottom: 14 }}>
                        {(() => {
                          const partnerLogo = getPartnerLogo(item.id || item.name);
                          if (partnerLogo) {
                            return (
                              <img
                                src={partnerLogo}
                                alt={item.name}
                                style={{
                                  height: 38,
                                  maxWidth: 150,
                                  objectFit: 'contain',
                                  objectPosition: 'left center',
                                }}
                              />
                            );
                          }
                          return (
                            <div
                              style={{
                                height: 36,
                                padding: '0 12px',
                                borderRadius: 6,
                                background: item.brandColor,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                fontWeight: 800,
                                fontSize: 14,
                              }}
                            >
                              {item.name}
                            </div>
                          );
                        })()}

                        <StatusTag status={isConnected ? 'CONNECTED' : 'DISCONNECTED'} />
                      </div>

                      {/* Title & Category Tag */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>{item.name}</span>
                        <Tag style={{ borderRadius: 4, fontSize: 10, fontWeight: 600 }}>
                          {item.categoryLabel}
                        </Tag>
                      </div>

                      {/* Description */}
                      <p style={{ color: '#6B7280', fontSize: 13, minHeight: 40, lineHeight: 1.5, margin: 0 }}>
                        {item.description}
                      </p>
                    </div>

                    {/* Metrics & Action Button */}
                    <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #F3F4F6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 12 }}>
                        <span style={{ color: '#6B7280' }}>
                          Đã đồng bộ: <strong>{item.ordersSynced.toLocaleString()}</strong> đơn
                        </span>
                        <span style={{ color: '#6B7280' }}>
                          Độ trễ: <strong style={{ color: '#10B981' }}>{item.latency}</strong>
                        </span>
                      </div>

                      <BaseButton
                        variant="ghost"
                        block
                        icon={<SettingOutlined />}
                        onClick={() => handleOpenConfig(item)}
                        style={{
                          background: '#FFFFFF',
                          borderColor: '#E5E7EB',
                          color: '#374151',
                        }}
                      >
                        Cấu hình & kiểm tra kết nối
                      </BaseButton>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Connector Config Modal */}
        <ConnectorConfigModal
          open={configModalOpen}
          connector={selectedConnector}
          onClose={() => setConfigModalOpen(false)}
          onSave={handleSaveConfig}
        />

        {/* Add Connector Modal */}
        <AddConnectorModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={handleAddConnector}
        />
      </div>
    </PageContainer>
  );
};

export default ConnectorsHub;
