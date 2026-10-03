import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Tag, Space, Tabs, Spin, Popconfirm } from 'antd';
import {
  SettingOutlined,
  PlusOutlined,
  ReloadOutlined,
  ThunderboltFilled,
  DeleteOutlined,
} from '@ant-design/icons';
import { ConnectorConfigModal } from './ConnectorConfigModal';
import { AddConnectorModal } from './AddConnectorModal';
import { AIFlowArchitectDrawer } from '../workflow/panels/AIFlowArchitectDrawer';
import { StatusTag, BaseButton, SearchInput, EmptyState, PageContainer } from '../base';
import { notify } from '../../utils/notification';
import { connectorsService } from '../../services/connectors.service';
import { getPartnerLogo } from '../../utils/partnerLogos';

export interface ConnectorItem {
  id: string;
  name: string;
  category: 'MARKETPLACE' | 'POS_ERP' | 'LOGISTICS' | 'CHAT_SOCIAL' | 'SPREADSHEET' | 'LANDING_PAGE' | 'ACCOUNTING';
  categoryLabel: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  readiness?: 'PRODUCTION_READY' | 'IN_DEVELOPMENT' | 'BETA';
  ordersSynced: number;
  latency: string;
  brandColor: string;
  description: string;
  appKey?: string;
  appSecret?: string;
  endpoint?: string;
}

// ── DANH MỤC THƯƠNG HIỆU & KÊNH KẾT NỐI MẪU (METADATA CATALOG) ──────────────
const defaultConnectorsCatalog: ConnectorItem[] = [
  {
    id: 'sapo',
    name: 'Sapo POS & Omnichannel',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'DISCONNECTED',
    readiness: 'PRODUCTION_READY',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#0088FF',
    description: 'Trừ tồn kho tức thì (Live Inventory Deduct) và cập nhật phiếu xuất kho qua Sapo REST API',
  },
  {
    id: 'nhanh',
    name: 'Nhanh.vn Omnichannel POS',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'DISCONNECTED',
    readiness: 'PRODUCTION_READY',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#FF6F00',
    description: 'Đồng bộ danh mục đa chi nhánh, trạng thái đối soát và phiếu chuyển kho nội bộ API v2.0',
  },
  {
    id: 'pancake',
    name: 'Pancake POS & Social Chat',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'DISCONNECTED',
    readiness: 'PRODUCTION_READY',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#2563EB',
    description: 'Đồng bộ tin nhắn Fanpage Facebook, Zalo OA và AI CSKH tự động tư vấn chốt đơn',
  },
  {
    id: 'shopee',
    name: 'Shopee Open Platform',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'DISCONNECTED',
    readiness: 'PRODUCTION_READY',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#EE4D2D',
    description: 'Nhận push notification READY_TO_SHIP và pull đơn hàng chi tiết qua Open API v2',
  },
  {
    id: 'tiktok',
    name: 'TikTok Shop',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'DISCONNECTED',
    readiness: 'PRODUCTION_READY',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#000000',
    description: 'Inbound Webhook 0-chạm, xác thực HMAC-SHA256 chuẩn SLA TikTok Shop Partner API',
  },
  {
    id: 'misa_meinvoice',
    name: 'MISA meInvoice (Hóa đơn điện tử)',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'DISCONNECTED',
    readiness: 'PRODUCTION_READY',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#0070C0',
    description: 'Phát hành hóa đơn GTGT điện tử ký số, tuân thủ Nghị định 117/2025 & Thông tư 40/2021',
  },
  {
    id: 'misa_amis',
    name: 'MISA AMIS Kế toán',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'DISCONNECTED',
    readiness: 'PRODUCTION_READY',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#0070C0',
    description: 'Tự động ghi sổ cái, xuất chứng từ và đồng bộ hóa đơn VAT sang MISA AMIS theo thời gian thực',
  },
  {
    id: 'telegram',
    name: 'Telegram Bot Webhook',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'DISCONNECTED',
    readiness: 'PRODUCTION_READY',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#24A1DE',
    description: 'Nhận báo cáo đơn hàng mới, cảnh báo lỗi ánh xạ SKU và phê duyệt 1-click tức thì',
  },
  {
    id: 'ladipage',
    name: 'LadiPage Form Inbound',
    category: 'LANDING_PAGE',
    categoryLabel: 'Landing Page & Form',
    status: 'DISCONNECTED',
    readiness: 'PRODUCTION_READY',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#10B981',
    description: 'Thu thập đơn hàng từ form Landing Page, tự động chuẩn hóa địa chỉ và đẩy sang POS',
  },
  {
    id: 'googlesheets',
    name: 'Google Sheets Live Sync',
    category: 'SPREADSHEET',
    categoryLabel: 'Bảng tính & Tệp tin',
    status: 'DISCONNECTED',
    readiness: 'PRODUCTION_READY',
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
    status: 'DISCONNECTED',
    readiness: 'PRODUCTION_READY',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#107C41',
    description: 'Xuất file Excel (.xlsx) theo mẫu tùy biến, đồng bộ OneDrive & nhập xuất SKU hàng loạt',
  },
  {
    id: 'ghtk',
    name: 'Giao Hàng Tiết Kiệm (GHTK)',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'DISCONNECTED',
    readiness: 'BETA',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#005D38',
    description: 'Tạo vận đơn tự động, lấy mã tracking và in phiếu giao hàng A6 (cần Token đối tác)',
  },
  {
    id: 'ghn',
    name: 'Giao Hàng Nhanh (GHN Express)',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'DISCONNECTED',
    readiness: 'BETA',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#F26522',
    description: 'Tự động tính cước vận chuyển chuẩn SLA và định tuyến thông minh (cần ShopID & Token)',
  },
  {
    id: 'viettelpost',
    name: 'Viettel Post API',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'DISCONNECTED',
    readiness: 'BETA',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#EE0033',
    description: 'Đồng bộ đơn hàng vận chuyển Viettel Post và tra cứu hành trình trực tiếp',
  },
  {
    id: 'kiotviet',
    name: 'KiotViet Retail API',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'DISCONNECTED',
    readiness: 'IN_DEVELOPMENT',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#004F9E',
    description: 'Đồng bộ hóa đơn bán hàng và trừ tồn kho chi nhánh (Đang phát triển adapter OAuth2 B2B)',
  },
  {
    id: 'haravan',
    name: 'Haravan Omnichannel',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'DISCONNECTED',
    readiness: 'IN_DEVELOPMENT',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#E65100',
    description: 'Đồng bộ dữ liệu sản phẩm, giá bán và hóa đơn điện tử (Đang hoàn thiện Haravan App OAuth2)',
  },
  {
    id: 'lazada',
    name: 'Lazada Open API',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'DISCONNECTED',
    readiness: 'IN_DEVELOPMENT',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#0F146D',
    description: 'Kết nối gian hàng Lazada Mall (Đang hoàn thiện xác thực ký số seller token)',
  },
  {
    id: 'zalo',
    name: 'Zalo OA & ZNS Notification',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'DISCONNECTED',
    readiness: 'IN_DEVELOPMENT',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#0068FF',
    description: 'Tự động gửi thông báo biến động đơn và tracking (Đang chờ cấp phép ZNS Template)',
  },
  {
    id: 'fast_accounting',
    name: 'Fast Accounting ERP',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'DISCONNECTED',
    readiness: 'IN_DEVELOPMENT',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#E65100',
    description: 'Đối soát số dư tài khoản ngân hàng và hạch toán thuế (Đang phát triển Enterprise API)',
  },
  {
    id: 'bravo_erp',
    name: 'Bravo ERP',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'DISCONNECTED',
    readiness: 'IN_DEVELOPMENT',
    ordersSynced: 0,
    latency: '--',
    brandColor: '#1565C0',
    description: 'Quản lý tài chính tổng hợp đa trung tâm chi phí (Đang phát triển Enterprise API)',
  },
];

export const ConnectorsHub: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [configModalOpen, setConfigModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [architectOpen, setArchitectOpen] = useState<boolean>(false);
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null);

  // ── LOAD DỮ LIỆU THỰC SỰ TỪ MONGODB DATABASE ─────────────────────────────────
  const fetchDbConnectors = useCallback(async () => {
    setLoading(true);
    try {
      const dbList = await connectorsService.getConnectors();
      if (dbList && Array.isArray(dbList) && dbList.length > 0) {
        const mappedList: ConnectorItem[] = dbList.map((dbItem) => {
          const catalogItem = defaultConnectorsCatalog.find(
            (c) => c.id.toLowerCase() === dbItem.connectorId.toLowerCase()
          );
          return {
            id: dbItem.connectorId,
            name: dbItem.name || catalogItem?.name || dbItem.connectorId,
            category: (dbItem.category as any) || catalogItem?.category || 'MARKETPLACE',
            categoryLabel: catalogItem?.categoryLabel || 'Kênh kết nối',
            status: dbItem.status || 'CONNECTED',
            readiness: catalogItem?.readiness || 'PRODUCTION_READY',
            ordersSynced: dbItem.ordersSynced || 0,
            latency: dbItem.latency || (dbItem.latencyMs ? `${dbItem.latencyMs}ms` : '--'),
            brandColor: catalogItem?.brandColor || '#6366F1',
            description: dbItem.config?.endpoint || catalogItem?.description || 'Kênh tích hợp tự động qua UDM Pipeline',
            appKey: dbItem.config?.appKey,
            appSecret: dbItem.config?.appSecret,
            endpoint: dbItem.config?.endpoint,
          };
        });
        setConnectors(mappedList);
      } else {
        setConnectors([]);
      }
    } catch (err: any) {
      console.warn('Lỗi tải dữ liệu cổng kết nối từ Database:', err.message);
      setConnectors([]);
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
        connectorId: newConnector.id,
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

      setConnectors((prev) => {
        const idx = prev.findIndex((c) => c.id === newConnector.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = newConnector;
          return next;
        }
        return [newConnector, ...prev];
      });
      notify.success(`Đã thêm cổng kết nối ${newConnector.name} vào Database!`);
    } catch (err: any) {
      notify.error('Lỗi khi thêm kênh vào Database: ' + err.message);
    }
  };

  const handleDeleteConnector = async (connectorId: string) => {
    try {
      await connectorsService.deleteConnector(connectorId);
      setConnectors((prev) => prev.filter((c) => c.id !== connectorId));
      notify.success('Đã ngắt kết nối và xóa kênh thành công!');
    } catch (err: any) {
      notify.error('Lỗi khi xóa kênh: ' + err.message);
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
            style={{ width: 220 }}
          />
          <BaseButton
            variant="ghost"
            size="small"
            icon={<ThunderboltFilled style={{ color: '#8B5CF6' }} />}
            onClick={() => setArchitectOpen(true)}
            style={{ fontWeight: 600, color: '#8B5CF6', borderColor: '#DDD6FE' }}
          >
            AI Tối ưu hạ tầng
          </BaseButton>
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
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Spin tip="Đang tải dữ liệu cổng kết nối từ cơ sở dữ liệu..." size="large" />
          </div>
        ) : connectors.length === 0 ? (
          <Card
            style={{
              borderRadius: 16,
              border: '1.5px dashed var(--border-subtle, #D1D5DB)',
              background: 'var(--bg-surface, #FFFFFF)',
              textAlign: 'center',
              padding: '60px 24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.08)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                marginBottom: 20,
              }}
            >
              🔌
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary, #111827)', marginBottom: 8 }}>
              Tài khoản chưa có kênh kết nối nào
            </h3>
            <p
              style={{
                fontSize: 14.5,
                color: 'var(--text-secondary, #6B7280)',
                maxWidth: 580,
                margin: '0 auto 24px',
                lineHeight: 1.6,
              }}
            >
              Không gian làm việc mới 100% sạch sẽ. Hãy bắt đầu bằng cách thêm kênh kết nối đầu tiên (Sapo, Nhanh.vn, Shopee, TikTok Shop, Pancake, MISA meInvoice, Telegram...).
            </p>
            <Space size="middle">
              <BaseButton
                variant="primary"
                size="middle"
                icon={<PlusOutlined />}
                onClick={() => setAddModalOpen(true)}
                style={{ padding: '0 24px', height: 42, fontWeight: 600, fontSize: 14 }}
              >
                + Thêm Kênh Kết Nối Đầu Tiên
              </BaseButton>
              <BaseButton
                variant="secondary"
                size="middle"
                icon={<ThunderboltFilled style={{ color: '#8B5CF6' }} />}
                onClick={() => setArchitectOpen(true)}
                style={{ height: 42, fontWeight: 600, color: '#8B5CF6' }}
              >
                Tư Vấn Kiến Trúc Kênh (AI)
              </BaseButton>
            </Space>
          </Card>
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
                            <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text-primary, #111827)' }}>
                              {connector.name}
                            </div>
                            <Space size={4} style={{ marginTop: 3 }} wrap>
                              <Tag
                                style={{
                                  margin: 0,
                                  fontSize: 10.5,
                                  padding: '0 6px',
                                  borderRadius: 4,
                                  background: 'var(--bg-surface-alt, #F3F4F6)',
                                  border: '1px solid var(--border-subtle, #E5E7EB)',
                                  color: 'var(--text-secondary, #4B5563)',
                                }}
                              >
                                {connector.categoryLabel}
                              </Tag>
                              {connector.readiness === 'PRODUCTION_READY' ? (
                                <Tag color="success" style={{ margin: 0, fontSize: 10, padding: '0 5px', borderRadius: 4 }}>
                                  ✓ Sẵn sàng
                                </Tag>
                              ) : connector.readiness === 'BETA' ? (
                                <Tag color="processing" style={{ margin: 0, fontSize: 10, padding: '0 5px', borderRadius: 4 }}>
                                  🧪 Cần Token
                                </Tag>
                              ) : (
                                <Tag color="warning" style={{ margin: 0, fontSize: 10, padding: '0 5px', borderRadius: 4 }}>
                                  ⏳ Đang phát triển
                                </Tag>
                              )}
                            </Space>
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
                          color: 'var(--text-secondary, #94A3B8)',
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
                          background: 'var(--bg-surface-alt, #F9FAFB)',
                          borderRadius: 8,
                          border: '1px solid var(--border-subtle, #F3F4F6)',
                          marginBottom: 14,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted, #6B7280)' }}>Đơn đã qua kênh:</div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary, #111827)' }}>
                            {connector.ordersSynced > 0
                              ? `${connector.ordersSynced.toLocaleString('vi-VN')} đơn`
                              : '0 đơn (Sẵn sàng)'}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted, #6B7280)' }}>Độ trễ phản hồi:</div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 13,
                              color: connector.latency !== '--' ? '#10B981' : 'var(--text-muted, #6B7280)',
                            }}
                          >
                            {connector.latency}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <BaseButton
                          variant="secondary"
                          size="small"
                          icon={<SettingOutlined />}
                          onClick={() => handleOpenConfig(connector)}
                          style={{ flex: 1 }}
                        >
                          Cấu hình kết nối
                        </BaseButton>
                        <Popconfirm
                          title="Xác nhận xóa kênh kết nối?"
                          description={`Bạn có chắc muốn xóa kênh ${connector.name}?`}
                          onConfirm={() => handleDeleteConnector(connector.id)}
                          okText="Xóa"
                          cancelText="Hủy"
                          okButtonProps={{ danger: true }}
                        >
                          <BaseButton
                            variant="ghost"
                            size="small"
                            icon={<DeleteOutlined style={{ color: '#EF4444' }} />}
                            style={{ borderColor: '#FCA5A5' }}
                          />
                        </Popconfirm>
                      </div>
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

        {/* Ngăn kéo AI Kiến Trúc & Tối Ưu Hạ Tầng Tự Động Hóa */}
        <AIFlowArchitectDrawer
          open={architectOpen}
          onClose={() => setArchitectOpen(false)}
        />
      </div>
    </PageContainer>
  );
};

export default ConnectorsHub;
