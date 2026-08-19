import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Tag, Space, Tabs, Spin } from 'antd';
import {
  SettingOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { ConnectorConfigModal } from './ConnectorConfigModal';
import { AddConnectorModal } from './AddConnectorModal';
import { StatusTag, BaseButton, SearchInput, EmptyState, PageContainer } from '../base';
import { notify } from '../../utils/notification';
import { connectorsService, DbConnectorItem } from '../../services/connectors.service';
import { getPartnerLogo } from '../../utils/partnerLogos';

export interface ConnectorItem {
  id: string;
  name: string;
  category: 'MARKETPLACE' | 'POS_ERP' | 'LOGISTICS' | 'CHAT_SOCIAL' | 'SPREADSHEET' | 'LANDING_PAGE' | 'ACCOUNTING';
  categoryLabel: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  ordersSynced: number;
  latency: string;
  brandColor: string;
  description: string;
  appKey?: string;
  appSecret?: string;
  endpoint?: string;
}

// ── DANH MỤC THƯƠNG HIỆU & KÊNH KẾT NỐI MẶC ĐỊNH (KHÔNG CHỨA SỐ LIỆU CỐ ĐỊNH) ──
const defaultConnectorsList: ConnectorItem[] = [
  {
    id: 'tiktok',
    name: 'TikTok Shop',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#000000',
    description: 'Inbound Webhook 0-chạm, xác thực HMAC-SHA256 chuẩn SLA TikTok',
  },
  {
    id: 'shopee',
    name: 'Shopee Open Platform',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#EE4D2D',
    description: 'Nhận push notification READY_TO_SHIP và pull đơn hàng chi tiết qua API v2',
  },
  {
    id: 'lazada',
    name: 'Lazada Open API',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'DISCONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#0F146D',
    description: 'Kết nối gian hàng Lazada Mall, đồng bộ trạng thái thanh toán tự động',
  },
  {
    id: 'pancake',
    name: 'Pancake POS & Social Chat',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#2563EB',
    description: 'Đồng bộ tin nhắn Fanpage Facebook, Zalo OA và AI CSKH tự động tư vấn chốt đơn',
  },
  {
    id: 'zalo',
    name: 'Zalo OA & ZNS Notification',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#0068FF',
    description: 'Tự động gửi thông báo biến động đơn hàng, mã tracking vận đơn qua Zalo ZNS',
  },
  {
    id: 'telegram',
    name: 'Telegram Bot Webhook',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#24A1DE',
    description: 'Nhận báo cáo đơn hàng mới, cảnh báo lỗi ánh xạ SKU và phê duyệt 1-click tức thì',
  },
  {
    id: 'sapo',
    name: 'Sapo POS & Omnichannel',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#0088FF',
    description: 'Trừ tồn kho tức thì (Live Inventory Deduct) và cập nhật phiếu xuất kho',
  },
  {
    id: 'kiotviet',
    name: 'KiotViet Retail API',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#004F9E',
    description: 'Đồng bộ hóa đơn bán hàng và trừ tồn kho chi nhánh theo thời gian thực',
  },
  {
    id: 'nhanh',
    name: 'Nhanh.vn Omnichannel POS',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#FF6F00',
    description: 'Đồng bộ danh mục đa chi nhánh, trạng thái đối soát và phiếu chuyển kho nội bộ',
  },
  {
    id: 'haravan',
    name: 'Haravan Omnichannel',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'DISCONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#E65100',
    description: 'Đồng bộ dữ liệu sản phẩm, giá bán và hóa đơn điện tử Haravan',
  },
  {
    id: 'ladipage',
    name: 'LadiPage Form Inbound',
    category: 'LANDING_PAGE',
    categoryLabel: 'Landing Page & Form',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#10B981',
    description: 'Thu thập đơn hàng từ form Landing Page, tự động chuẩn hóa địa chỉ và đẩy sang POS',
  },
  {
    id: 'ghtk',
    name: 'Giao Hàng Tiết Kiệm (GHTK)',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#005D38',
    description: 'Tạo vận đơn tự động, lấy mã tracking và in phiếu giao hàng A6 ngay lập tức',
  },
  {
    id: 'ghn',
    name: 'Giao Hàng Nhanh (GHN Express)',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#F26522',
    description: 'Tự động tính cước vận chuyển chuẩn SLA và định tuyến thông minh (Smart Rerouting)',
  },
  {
    id: 'viettelpost',
    name: 'Viettel Post API',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#EE0033',
    description: 'Đồng bộ đơn hàng vận chuyển Viettel Post và tra cứu hành trình trực tiếp',
  },
  {
    id: 'googlesheets',
    name: 'Google Sheets Live Sync',
    category: 'SPREADSHEET',
    categoryLabel: 'Bảng tính & Tệp tin',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#0F9D58',
    description: 'Tự động chèn dòng đơn hàng realtime, trích xuất báo cáo doanh thu & tồn kho tức thì',
  },
  {
    id: 'excel',
    name: 'Microsoft Excel / CSV Engine',
    category: 'SPREADSHEET',
    categoryLabel: 'Bảng tính & Tệp tin',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#107C41',
    description: 'Xuất file Excel (.xlsx) theo mẫu tùy biến, đồng bộ OneDrive & nhập xuất SKU hàng loạt',
  },
  {
    id: 'misa_amis',
    name: 'MISA AMIS Kế toán',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#0070C0',
    description: 'Tự động ghi sổ cái, xuất chứng từ và đồng bộ hóa đơn VAT sang MISA AMIS theo thời gian thực',
  },
  {
    id: 'misa_meinvoice',
    name: 'MISA meInvoice (Hóa đơn điện tử)',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'CONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#0070C0',
    description: 'Phát hành hóa đơn GTGT điện tử ký số, tuân thủ Nghị định 117/2025 & Thông tư 40/2021',
  },
  {
    id: 'fast_accounting',
    name: 'Fast Accounting ERP',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'DISCONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#E65100',
    description: 'Đối soát số dư tài khoản ngân hàng, tổng hợp báo cáo tài chính và kê khai thuế TNCN',
  },
  {
    id: 'bravo_erp',
    name: 'Bravo ERP',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'DISCONNECTED',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#1565C0',
    description: 'Quản lý tài chính tổng hợp, phân tích lãi lỗ đa trung tâm chi phí và kiểm toán nội bộ',
  },
];

export const ConnectorsHub: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorItem[]>(defaultConnectorsList);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [configModalOpen, setConfigModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null);

  // ── LOAD DỮ LIỆU THỰC SỰ TỪ MONGODB DATABASE ─────────────────────────────────
  const fetchDbConnectors = useCallback(async () => {
    setLoading(true);
    try {
      const dbList = await connectorsService.getConnectors();
      if (dbList && dbList.length > 0) {
        const dbMap = new Map<string, DbConnectorItem>();
        dbList.forEach((item) => dbMap.set(item.connectorId, item));

        // Hợp nhất danh mục đối tác với số liệu thực tế từ Database
        setConnectors(
          defaultConnectorsList.map((catalogItem) => {
            const dbItem = dbMap.get(catalogItem.id);
            if (dbItem) {
              return {
                ...catalogItem,
                name: dbItem.name || catalogItem.name,
                category: (dbItem.category as any) || catalogItem.category,
                status: dbItem.status || catalogItem.status,
                ordersSynced: dbItem.ordersSynced || 0,
                latency: dbItem.latency || `${dbItem.latencyMs || 0}ms`,
                appKey: dbItem.config?.appKey,
                appSecret: dbItem.config?.appSecret,
                endpoint: dbItem.config?.endpoint,
              };
            }
            return catalogItem;
          })
        );
      }
    } catch (err: any) {
      console.warn('Lỗi tải dữ liệu cổng kết nối từ Database:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDbConnectors();
  }, [fetchDbConnectors]);

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

  // ── LƯU CẤU HÌNH VÀO MONGODB DATABASE THỰC SỰ ────────────────────────────────
  const handleSaveConfig = async (updatedConnector: ConnectorItem) => {
    try {
      await connectorsService.updateConnector(updatedConnector.id, {
        name: updatedConnector.name,
        category: updatedConnector.category,
        status: updatedConnector.status,
        config: {
          appKey: updatedConnector.appKey,
          appSecret: updatedConnector.appSecret,
          endpoint: updatedConnector.endpoint,
        },
      });

      setConnectors((prev) =>
        prev.map((c) => (c.id === updatedConnector.id ? updatedConnector : c))
      );
      notify.success(`Đã lưu cấu hình ${updatedConnector.name} vào Database thực tế thành công!`);
    } catch (err: any) {
      notify.error('Lỗi khi lưu cấu hình vào Database: ' + err.message);
    }
  };

  const handleAddConnector = async (newConnector: ConnectorItem) => {
    try {
      await connectorsService.updateConnector(newConnector.id, {
        name: newConnector.name,
        category: newConnector.category,
        status: newConnector.status,
        ordersSynced: 0,
        latencyMs: 100,
        latency: '100ms',
        config: {
          appKey: newConnector.appKey,
          appSecret: newConnector.appSecret,
          endpoint: newConnector.endpoint,
        },
      });

      setConnectors((prev) => [newConnector, ...prev]);
      notify.success(`Đã thêm cổng kết nối ${newConnector.name} vào Database!`);
    } catch (err: any) {
      notify.error('Lỗi khi thêm kênh vào Database: ' + err.message);
    }
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
            variant="secondary"
            size="small"
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={fetchDbConnectors}
          >
            Đồng bộ DB
          </BaseButton>
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
          size="small"
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
        {loading && connectors.every((c) => c.ordersSynced === 0 && c.latency === '--') ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Spin tip="Đang tải dữ liệu cổng kết nối từ MongoDB Atlas..." size="large" />
          </div>
        ) : filteredConnectors.length === 0 ? (
          <EmptyState
            title="Không tìm thấy cổng kết nối phù hợp"
            description="Hãy thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác"
          />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredConnectors.map((connector) => {
              const partnerLogo = getPartnerLogo(connector.id);

              return (
                <Col xs={24} sm={12} lg={8} key={connector.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 12,
                      border: '1px solid var(--border-subtle, #E5E7EB)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    bodyStyle={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: 20,
                    }}
                  >
                    <div>
                      {/* Top Header: Logo + Title + Status */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          marginBottom: 12,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {partnerLogo ? (
                            <div
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: 10,
                                background: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 6,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                              }}
                            >
                              <img
                                src={partnerLogo}
                                alt={connector.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            </div>
                          ) : (
                            <div
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: 10,
                                background: `${connector.brandColor}15`,
                                border: `1.5px solid ${connector.brandColor}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: connector.brandColor,
                                fontWeight: 800,
                                fontSize: 16,
                              }}
                            >
                              {connector.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14.5, color: '#111827' }}>
                              {connector.name}
                            </div>
                            <Tag
                              style={{
                                margin: 0,
                                marginTop: 3,
                                fontSize: 10.5,
                                padding: '0 6px',
                                borderRadius: 4,
                                background: '#F3F4F6',
                                border: 'none',
                                color: '#4B5563',
                              }}
                            >
                              {connector.categoryLabel}
                            </Tag>
                          </div>
                        </div>

                        <StatusTag
                          status={connector.status === 'CONNECTED' ? 'ACTIVE' : 'INACTIVE'}
                          text={connector.status === 'CONNECTED' ? 'Đã kết nối' : 'Chưa kết nối'}
                        />
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          fontSize: 12.5,
                          color: '#4B5563',
                          lineHeight: 1.5,
                          marginBottom: 16,
                          minHeight: 38,
                        }}
                      >
                        {connector.description}
                      </p>
                    </div>

                    {/* Footer: Metrics + Action Button */}
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: '#F9FAFB',
                          borderRadius: 8,
                          border: '1px solid #F3F4F6',
                          marginBottom: 14,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, color: '#6B7280' }}>Đơn đã qua kênh:</div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>
                            {connector.ordersSynced > 0
                              ? `${connector.ordersSynced.toLocaleString('vi-VN')} đơn`
                              : '0 đơn (Sẵn sàng)'}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: '#6B7280' }}>Độ trễ phản hồi:</div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 13,
                              color: connector.latency !== '--' ? '#10B981' : '#6B7280',
                            }}
                          >
                            {connector.latency}
                          </div>
                        </div>
                      </div>

                      <BaseButton
                        variant="secondary"
                        size="small"
                        icon={<SettingOutlined />}
                        onClick={() => handleOpenConfig(connector)}
                        style={{ width: '100%' }}
                      >
                        Cấu hình kết nối
                      </BaseButton>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Modal Cấu hình Cổng Kết Nối */}
        {selectedConnector && (
          <ConnectorConfigModal
            open={configModalOpen}
            connector={selectedConnector}
            onClose={() => setConfigModalOpen(false)}
            onSave={handleSaveConfig}
          />
        )}

        {/* Modal Thêm Kết Nối Mới */}
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
