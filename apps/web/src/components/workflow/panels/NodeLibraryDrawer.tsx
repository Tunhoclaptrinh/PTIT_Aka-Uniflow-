import React, { useState, useMemo } from 'react';
import {
  Drawer,
  Card,
  Input,
  Tag,
  Tabs,
  Space,
  Modal,
  Form,
  Select,
} from 'antd';
import {
  ThunderboltFilled,
  PlusOutlined,
  ShoppingFilled,
  DatabaseFilled,
  CarFilled,
  BellFilled,
  SearchOutlined,
  FileExcelFilled,
  CodeOutlined,
  AuditOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { BaseButton } from '../../base/BaseButton';
import { FormFooter } from '../../base/FormFooter';
import { notify } from '../../../utils/notification';
import { getPartnerLogo } from '../../../utils/partnerLogos';

export interface CustomNodeTemplate {
  id: string;
  type: string;
  label: string;
  desc: string;
  cat: string;
  iconType?: string;
  color?: string;
  config?: Record<string, any>;
}

const defaultCustomNodes: CustomNodeTemplate[] = [
  {
    id: 'cust_http',
    type: 'action',
    label: 'Custom HTTP / REST API Call',
    desc: 'Gọi webhook/API bất kỳ: Tùy chỉnh Method, Headers, Bearer Token và Body Payload',
    cat: 'CUSTOM',
    color: '#0284C7',
    config: {
      customType: 'HTTP_REQUEST',
      httpMethod: 'POST',
      httpEndpoint: 'https://api.yourdomain.com/v1/orders/sync',
      httpAuthType: 'BEARER',
    },
  },
  {
    id: 'cust_script',
    type: 'action',
    label: 'Custom JavaScript Code Transform',
    desc: 'Viết mã JS xử lý trực tiếp: Map trường dữ liệu, tính toán thuế và format lại JSON',
    cat: 'CUSTOM',
    color: '#8B5CF6',
    config: {
      customType: 'CODE_SCRIPT',
      codeScript: '// Tùy biến dữ liệu payload trước khi chuyển tiếp\nreturn {\n  ...$json,\n  processedAt: new Date().toISOString(),\n  vatAmount: Math.round($json.totalAmount * 0.01)\n};',
    },
  },
  {
    id: 'cust_switch',
    type: 'action',
    label: 'Custom Multi-branch Switch Router',
    desc: 'Định tuyến rẽ nhánh nâng cao theo n-quy tắc điều kiện logic do bạn tự thiết lập',
    cat: 'LOGIC',
    color: '#EC4899',
    config: {
      customType: 'CUSTOM_ROUTER',
      routingBranchMode: 'FIRST_MATCHING',
    },
  },
  {
    id: 'cust_webhook',
    type: 'trigger',
    label: 'Custom Inbound Webhook Listener',
    desc: 'Lắng nghe sự kiện HTTP POST gửi từ hệ thống server riêng hoặc ứng dụng nội bộ',
    cat: 'TRIGGER',
    color: '#10B981',
    config: {
      customType: 'WEBHOOK_LISTENER',
      webhookPath: '/webhooks/custom-inbound-listener',
    },
  },
  {
    id: 'cust_sql',
    type: 'action',
    label: 'Custom SQL & Database Connector',
    desc: 'Truy vấn hoặc ghi dữ liệu trực tiếp vào cơ sở dữ liệu PostgreSQL, MySQL hoặc MongoDB',
    cat: 'CUSTOM',
    color: '#D97706',
    config: {
      customType: 'DATABASE_QUERY',
      dbType: 'POSTGRESQL',
    },
  },
];

interface NodeLibraryDrawerProps {
  open: boolean;
  onClose: () => void;
  onAddNode: (nodeType: string, label: string, category?: string, customData?: any) => void;
}

export const NodeLibraryDrawer: React.FC<NodeLibraryDrawerProps> = ({
  open,
  onClose,
  onAddNode,
}) => {
  const [activeTab, setActiveTab] = useState<string>('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  // Custom User-Defined Nodes State (Lưu trữ cục bộ / bộ nhớ)
  const [customNodes, setCustomNodes] = useState<CustomNodeTemplate[]>(() => {
    const saved = localStorage.getItem('uniflow_custom_nodes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultCustomNodes;
      }
    }
    return defaultCustomNodes;
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSaveCustomNode = async () => {
    try {
      const values = await form.validateFields();
      const newNode: CustomNodeTemplate = {
        id: `cust_${Date.now()}`,
        type: values.nodeType || 'action',
        label: values.label,
        desc: values.desc || 'Khối xử lý do người dùng tự thiết kế',
        cat: values.category || 'CUSTOM',
        color: values.color || '#8B5CF6',
        config: {
          customType: values.customType || 'HTTP_REQUEST',
          httpMethod: values.httpMethod || 'POST',
          httpEndpoint: values.httpEndpoint || '',
          codeScript: values.codeScript || '',
        },
      };

      const updated = [newNode, ...customNodes];
      setCustomNodes(updated);
      localStorage.setItem('uniflow_custom_nodes', JSON.stringify(updated));
      notify.success(`Đã tạo khối tùy chỉnh "${values.label}" thành công!`);
      setCreateModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      console.warn('Validate custom node failed:', err);
    }
  };

  const handleDeleteCustomNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customNodes.filter((c) => c.id !== id);
    setCustomNodes(updated);
    localStorage.setItem('uniflow_custom_nodes', JSON.stringify(updated));
    notify.info('Đã xóa khối tùy chỉnh');
  };

  const nodeCategories = [
    {
      id: 'MARKETPLACE',
      category: '1. Cổng tiếp nhận (Sàn TMĐT & Webhook)',
      color: '#ed1c24',
      icon: <ShoppingFilled />,
      items: [
        { type: 'trigger', label: 'TikTok Shop Webhook', desc: 'Nhận sự kiện đơn mới, đổi trạng thái thanh toán', cat: 'TRIGGER' },
        { type: 'trigger', label: 'Shopee Push Webhook', desc: 'Nhận webhook đơn sẵn sàng giao từ sàn Shopee', cat: 'TRIGGER' },
        { type: 'trigger', label: 'Lazada Inbound Webhook', desc: 'Bắt đơn hàng mới từ sàn Lazada', cat: 'TRIGGER' },
        { type: 'trigger', label: 'Pancake Social Webhook', desc: 'Đồng bộ đơn hàng chốt từ Fanpage Facebook, Zalo OA', cat: 'TRIGGER' },
        { type: 'trigger', label: 'LadiPage Form Inbound', desc: 'Bắt thông tin khách hàng điền form trên trang Landing Page', cat: 'TRIGGER' },
        { type: 'trigger', label: 'Lập lịch Cron / Timer', desc: 'Kích hoạt định kỳ tự động (ví dụ mỗi 5 phút hoặc 09:00 hàng ngày)', cat: 'TRIGGER' },
      ],
    },
    {
      id: 'AI',
      category: '2. Khối trí tuệ nhân tạo (AI Engine)',
      color: '#8B5CF6',
      icon: <ThunderboltFilled />,
      items: [
        { type: 'ai', label: 'AI Hybrid SKU Mapper', desc: 'So khớp mã hàng tự động bằng Vector Cosine và Gemini NER', cat: 'AI' },
        { type: 'ai', label: 'AI So sánh cước & Chọn hãng tối ưu', desc: 'Truy vấn cước realtime: Viettel Post, GHTK, GHN để chọn cước tối ưu', cat: 'AI' },
        { type: 'ai', label: 'AI NER Trích xuất thông tin', desc: 'Tự động bóc tách Màu sắc, Kích cỡ, Tên người nhận, SĐT và Địa chỉ', cat: 'AI' },
        { type: 'ai', label: 'AI Tự chữa lành sự cố & Định tuyến', desc: 'Tự chẩn đoán lỗi đối tác ĐVVC và chuyển tuyến thông minh dự phòng', cat: 'AI' },
      ],
    },
    {
      id: 'POS',
      category: '3. Kho và bán hàng (POS / ERP)',
      color: '#d97706',
      icon: <DatabaseFilled />,
      items: [
        { type: 'action', label: 'Trừ tồn kho Sapo POS', desc: 'Ghi giảm số lượng tồn kho khả dụng trên Sapo tức thì', cat: 'POS' },
        { type: 'action', label: 'Trừ tồn kho KiotViet', desc: 'Đồng bộ kho thực tế đa chi nhánh KiotViet', cat: 'POS' },
        { type: 'action', label: 'Đồng bộ Nhanh.vn POS', desc: 'Cập nhật hóa đơn và trừ kho Nhanh.vn', cat: 'POS' },
        { type: 'action', label: 'Đồng bộ Haravan ERP', desc: 'Cập nhật hóa đơn và phiếu xuất kho Haravan', cat: 'POS' },
      ],
    },
    {
      id: 'LOGISTICS',
      category: '4. Đơn vị vận chuyển (Logistics Đa hãng)',
      color: '#10B981',
      icon: <CarFilled />,
      items: [
        { type: 'action', label: 'Tạo vận đơn ĐVVC tối ưu (Đa hãng)', desc: 'Tự động gọi API hãng AI đã chọn (Viettel Post / GHTK / GHN)', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo đơn Viettel Post', desc: 'Đẩy đơn Viettel Post mạng lưới toàn quốc & Tuyến trục ưu đãi', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo vận đơn GHTK Express', desc: 'Đẩy đơn Giao Hàng Tiết Kiệm tự động & In tem A6', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo đơn GHN Nhanh', desc: 'Đẩy đơn Giao Hàng Nhanh chuẩn SLA liên tỉnh', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo đơn J&T Express', desc: 'Đẩy đơn vận chuyển mạng lưới toàn quốc J&T', cat: 'LOGISTICS' },
      ],
    },
    {
      id: 'ACCOUNTING',
      category: '5. Kế toán & Hóa đơn điện tử (Accounting)',
      color: '#0284C7',
      icon: <AuditOutlined />,
      items: [
        { type: 'action', label: 'Xuất HĐĐT MISA meInvoice (VAT 1%)', desc: 'Phát hành HĐĐT ký số HSM tự động theo Nghị định 117/2025', cat: 'ACCOUNTING' },
        { type: 'action', label: 'Đồng bộ Sổ cái MISA AMIS', desc: 'Hạch toán chứng từ bán hàng và doanh thu sang phần mềm kế toán MISA', cat: 'ACCOUNTING' },
        { type: 'action', label: 'Fast Accounting Online', desc: 'Đối soát số dư và ghi sổ cái Fast Accounting', cat: 'ACCOUNTING' },
      ],
    },
    {
      id: 'SPREADSHEET',
      category: '6. Bảng tính & Tệp tin (Google Sheets / Excel)',
      color: '#0F9D58',
      icon: <FileExcelFilled />,
      items: [
        { type: 'action', label: 'Ghi đơn hàng vào Google Sheets', desc: 'Tự động chèn dòng đơn hàng mới vào Google Spreadsheet thời gian thực', cat: 'SPREADSHEET' },
        { type: 'action', label: 'Xuất báo cáo Microsoft Excel (.xlsx)', desc: 'Tự động trích xuất thống kê doanh thu và SKU ra file Excel', cat: 'SPREADSHEET' },
      ],
    },
    {
      id: 'NOTIFY',
      category: '7. Thông báo và CRM (Notification)',
      color: '#3B82F6',
      icon: <BellFilled />,
      items: [
        { type: 'action', label: 'Gửi tin Zalo ZNS', desc: 'Gửi thông báo mã vận đơn tới khách hàng qua Zalo OA', cat: 'NOTIFY' },
        { type: 'action', label: 'Thông báo Telegram Bot', desc: 'Gửi tin nhắn cảnh báo đơn và báo cáo cước tiết kiệm vào Telegram', cat: 'NOTIFY' },
      ],
    },
  ];

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return nodeCategories
      .filter((cat) => selectedCat === 'ALL' || cat.id === selectedCat)
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) => !q || item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [searchQuery, selectedCat]);

  const filteredCustomNodes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customNodes;
    return customNodes.filter(
      (c) => c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
  }, [searchQuery, customNodes]);

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/favicon.svg" alt="UniFlow" style={{ width: 22, height: 22 }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Thư viện khối xử lý tự động</span>
          </div>
          <Tag color="purple" style={{ fontWeight: 600, borderRadius: 4, margin: 0 }}>
            {nodeCategories.reduce((acc, c) => acc + c.items.length, 0) + customNodes.length} Khối sẵn sàng
          </Tag>
        </div>
      }
      placement="right"
      width={640}
      open={open}
      onClose={onClose}
      styles={{
        body: { padding: '14px 18px', background: '#F8FAFC' },
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'standard',
            label: (
              <Space size={4}>
                <AppstoreAddOutlined />
                <span>Khối mẫu hệ thống ({nodeCategories.reduce((acc, c) => acc + c.items.length, 0)})</span>
              </Space>
            ),
            children: (
              <div style={{ marginTop: 4 }}>
                {/* Search Input */}
                <Input
                  placeholder="Tìm kiếm khối mẫu (Ví dụ: So sánh cước, Viettel Post, Sapo, MISA...)"
                  prefix={<SearchOutlined style={{ color: '#9CA3AF' }} />}
                  allowClear
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginBottom: 12, borderRadius: 6, height: 36 }}
                />

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  <Tag
                    color={selectedCat === 'ALL' ? '#8B5CF6' : 'default'}
                    style={{ cursor: 'pointer', borderRadius: 4, padding: '2px 8px', fontSize: 11.5, fontWeight: 500 }}
                    onClick={() => setSelectedCat('ALL')}
                  >
                    Tất cả
                  </Tag>
                  <Tag
                    color={selectedCat === 'MARKETPLACE' ? '#8B5CF6' : 'default'}
                    style={{ cursor: 'pointer', borderRadius: 4, padding: '2px 8px', fontSize: 11.5, fontWeight: 500 }}
                    onClick={() => setSelectedCat('MARKETPLACE')}
                  >
                    Sàn TMĐT
                  </Tag>
                  <Tag
                    color={selectedCat === 'AI' ? '#8B5CF6' : 'default'}
                    style={{ cursor: 'pointer', borderRadius: 4, padding: '2px 8px', fontSize: 11.5, fontWeight: 500 }}
                    onClick={() => setSelectedCat('AI')}
                  >
                    AI Engine
                  </Tag>
                  <Tag
                    color={selectedCat === 'POS' ? '#8B5CF6' : 'default'}
                    style={{ cursor: 'pointer', borderRadius: 4, padding: '2px 8px', fontSize: 11.5, fontWeight: 500 }}
                    onClick={() => setSelectedCat('POS')}
                  >
                    Kho POS / ERP
                  </Tag>
                  <Tag
                    color={selectedCat === 'LOGISTICS' ? '#8B5CF6' : 'default'}
                    style={{ cursor: 'pointer', borderRadius: 4, padding: '2px 8px', fontSize: 11.5, fontWeight: 500 }}
                    onClick={() => setSelectedCat('LOGISTICS')}
                  >
                    Vận chuyển
                  </Tag>
                  <Tag
                    color={selectedCat === 'ACCOUNTING' ? '#8B5CF6' : 'default'}
                    style={{ cursor: 'pointer', borderRadius: 4, padding: '2px 8px', fontSize: 11.5, fontWeight: 500 }}
                    onClick={() => setSelectedCat('ACCOUNTING')}
                  >
                    Kế toán & HĐĐT
                  </Tag>
                  <Tag
                    color={selectedCat === 'SPREADSHEET' ? '#8B5CF6' : 'default'}
                    style={{ cursor: 'pointer', borderRadius: 4, padding: '2px 8px', fontSize: 11.5, fontWeight: 500 }}
                    onClick={() => setSelectedCat('SPREADSHEET')}
                  >
                    Excel & Sheet
                  </Tag>
                  <Tag
                    color={selectedCat === 'NOTIFY' ? '#8B5CF6' : 'default'}
                    style={{ cursor: 'pointer', borderRadius: 4, padding: '2px 8px', fontSize: 11.5, fontWeight: 500 }}
                    onClick={() => setSelectedCat('NOTIFY')}
                  >
                    Thông báo & CRM
                  </Tag>
                </div>

                {filteredCategories.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 0', color: '#9CA3AF' }}>
                    Không tìm thấy khối xử lý phù hợp với từ khóa "{searchQuery}"
                  </div>
                ) : (
                  filteredCategories.map((catGroup) => (
                    <div key={catGroup.category} style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: catGroup.color,
                          marginBottom: 8,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        {catGroup.icon} <span>{catGroup.category}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {catGroup.items.map((item) => (
                          <Card
                            key={item.label}
                            size="small"
                            bordered={false}
                            style={{
                              borderRadius: 6,
                              border: '1px solid #E2E8F0',
                              background: '#FFFFFF',
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
                              transition: 'all 0.15s ease',
                            }}
                            hoverable
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                                {(() => {
                                  const logo = item.type === 'ai' ? '/favicon.svg' : getPartnerLogo(item.label);
                                  if (!logo) {
                                    return (
                                      <div
                                        style={{
                                          width: 28,
                                          height: 28,
                                          borderRadius: 4,
                                          background: '#F1F5F9',
                                          border: '1px solid #E2E8F0',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          flexShrink: 0,
                                          color: catGroup.color,
                                        }}
                                      >
                                        {catGroup.icon}
                                      </div>
                                    );
                                  }
                                  return (
                                    <div
                                      style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 4,
                                        background: '#FFFFFF',
                                        border: '1px solid #E2E8F0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 3,
                                        flexShrink: 0,
                                      }}
                                    >
                                      <img src={logo} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                  );
                                })()}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      fontSize: 12.5,
                                      color: '#0F172A',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {item.label}
                                  </div>
                                  <div
                                    style={{
                                      color: '#64748B',
                                      fontSize: 11,
                                      marginTop: 2,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {item.desc}
                                  </div>
                                </div>
                              </div>
                              <BaseButton
                                variant="primary"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                  onAddNode(item.type, item.label, item.cat);
                                  onClose();
                                }}
                              >
                                Thêm
                              </BaseButton>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ),
          },
          {
            key: 'custom',
            label: (
              <Space size={4}>
                <CodeOutlined style={{ color: '#0284C7' }} />
                <span>Khối tự định nghĩa & Tùy chỉnh 100% ({customNodes.length})</span>
              </Space>
            ),
            children: (
              <div style={{ marginTop: 4 }}>
                {/* Header banner for Custom Nodes */}
                <div
                  style={{
                    background: '#F0F9FF',
                    border: '1px solid #BAE6FD',
                    borderRadius: 6,
                    padding: '10px 14px',
                    marginBottom: 14,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0369A1' }}>
                      Khối Lập Trình & Tự Định Nghĩa (Custom Developer Nodes)
                    </div>
                    <div style={{ color: '#0284C7', fontSize: 11.5 }}>
                      Toàn quyền kiểm soát 100% logic: Gọi REST API tùy ý, viết hàm JavaScript, truy vấn Database
                    </div>
                  </div>
                  <BaseButton
                    variant="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateModalOpen(true)}
                  >
                    Tạo khối mới
                  </BaseButton>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredCustomNodes.map((item) => (
                    <Card
                      key={item.id}
                      size="small"
                      bordered={false}
                      style={{
                        borderRadius: 6,
                        border: '1px solid #E2E8F0',
                        background: '#FFFFFF',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
                        transition: 'all 0.15s ease',
                      }}
                      hoverable
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 4,
                              background: '#F0FDF4',
                              color: item.color || '#10B981',
                              border: `1px solid ${item.color || '#10B981'}33`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <CodeOutlined style={{ fontSize: 15 }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: 12.5,
                                  color: '#0F172A',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.label}
                              </span>
                              <Tag color="cyan" style={{ fontSize: 10, borderRadius: 3, margin: 0 }}>
                                Custom Block
                              </Tag>
                            </div>
                            <div
                              style={{
                                color: '#64748B',
                                fontSize: 11,
                                marginTop: 2,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.desc}
                            </div>
                          </div>
                        </div>

                        <Space size={4}>
                          <BaseButton
                            variant="ghost"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={(e) => handleDeleteCustomNode(item.id, e)}
                            style={{ color: '#EF4444' }}
                          />
                          <BaseButton
                            variant="primary"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => {
                              onAddNode(item.type, item.label, item.cat, item.config);
                              onClose();
                            }}
                          >
                            Thêm vào Canvas
                          </BaseButton>
                        </Space>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
        ]}
      />

      {/* Modal Thiết Kế Khối Tùy Chỉnh Mới */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CodeOutlined style={{ color: '#8B5CF6' }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Thiết kế Khối Xử lý Tùy chỉnh (Custom Node)</span>
          </div>
        }
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={
          <FormFooter
            align="center"
            submitText="Lưu vào Thư viện"
            cancelText="Hủy bỏ"
            onCancel={() => setCreateModalOpen(false)}
            onSubmit={handleSaveCustomNode}
            style={{ marginTop: 0, paddingTop: 14 }}
          />
        }
        width={560}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ nodeType: 'action', customType: 'HTTP_REQUEST', category: 'CUSTOM' }}>
          <Form.Item
            name="label"
            label="Tên khối tùy chỉnh"
            rules={[{ required: true, message: 'Vui lòng nhập tên khối!' }]}
          >
            <Input placeholder="Ví dụ: Gọi API ERP Riêng, Xử lý hoa hồng CTV, Bắn Webhook Discord..." />
          </Form.Item>

          <Form.Item name="desc" label="Mô tả chức năng">
            <Input.TextArea rows={2} placeholder="Nhập mô tả nghiệp vụ của khối xử lý..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item name="nodeType" label="Loại khối Node">
              <Select
                options={[
                  { label: 'Hành động (Action Node)', value: 'action' },
                  { label: 'Cổng kích hoạt (Trigger Node)', value: 'trigger' },
                  { label: 'Xử lý thông minh (AI Node)', value: 'ai' },
                ]}
              />
            </Form.Item>

            <Form.Item name="customType" label="Đặc tả chức năng xử lý">
              <Select
                options={[
                  { label: 'Gọi REST API / HTTP Webhook', value: 'HTTP_REQUEST' },
                  { label: 'Viết mã hàm JavaScript', value: 'CODE_SCRIPT' },
                  { label: 'Truy vấn Database SQL / NoSQL', value: 'DATABASE_QUERY' },
                  { label: 'Rẽ nhánh Router đa điều kiện', value: 'CUSTOM_ROUTER' },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.customType !== cur.customType}
          >
            {({ getFieldValue }) => {
              const cType = getFieldValue('customType');
              if (cType === 'HTTP_REQUEST') {
                return (
                  <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 6, border: '1px solid #E2E8F0', marginBottom: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8 }}>
                      <Form.Item name="httpMethod" label="Phương thức" initialValue="POST">
                        <Select
                          options={[
                            { label: 'POST', value: 'POST' },
                            { label: 'GET', value: 'GET' },
                            { label: 'PUT', value: 'PUT' },
                            { label: 'DELETE', value: 'DELETE' },
                          ]}
                        />
                      </Form.Item>
                      <Form.Item name="httpEndpoint" label="API Endpoint URL">
                        <Input placeholder="https://api.yourdomain.com/v1/resource" />
                      </Form.Item>
                    </div>
                  </div>
                );
              } else if (cType === 'CODE_SCRIPT') {
                return (
                  <Form.Item name="codeScript" label="Mã JavaScript Function ($json, input)">
                    <Input.TextArea
                      rows={4}
                      style={{ fontFamily: 'Consolas, Monaco, monospace', fontSize: 12 }}
                      placeholder="// Viết mã xử lý payload tại đây&#10;return {&#10;  ...$json,&#10;  status: 'CUSTOM_PROCESSED'&#10;};"
                    />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>
    </Drawer>
  );
};

export default NodeLibraryDrawer;
