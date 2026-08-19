import React, { useState } from 'react';
import {
  Modal,
  Tag,
  Input,
  Avatar,
  Table,
  Timeline,
  Statistic,
  Row,
  Col,
  Progress,
} from 'antd';
import {
  SendOutlined,
  ThunderboltFilled,
  EditOutlined,
  CustomerServiceOutlined,
  FileExcelFilled,
  DownloadOutlined,
  CodeOutlined,
  ShoppingOutlined,
  CarFilled,
  MessageFilled,
  CheckCircleFilled,
  EnvironmentOutlined,
  CopyOutlined,
  SearchOutlined,
  PhoneOutlined,
  SafetyCertificateFilled,
  DollarCircleFilled,
} from '@ant-design/icons';
import { BaseButton } from '../base';
import { notify } from '../../utils/notification';
import { getPartnerLogo } from '../../utils/partnerLogos';

interface AgentOmniInspectorModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'chat' | 'file' | 'tracking' | 'pos' | 'webhook' | 'accounting';
  initialFileData?: any;
}

export const AgentOmniInspectorModal: React.FC<AgentOmniInspectorModalProps> = ({
  open,
  onClose,
  defaultTab = 'chat',
  initialFileData,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'file' | 'tracking' | 'pos' | 'webhook' | 'accounting'>(defaultTab);

  // Sync activeTab if defaultTab changes when opening
  React.useEffect(() => {
    if (open && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  // Chat State
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'customer',
      text: 'Shop ơi cho mình hỏi áo Polo Pima Nam cao 1m75 nặng 70kg mặc size nào vừa vậy shop? Có sẵn hàng không ạ?',
      time: '10:14',
    },
    {
      id: '2',
      sender: 'ai',
      text: 'Dạ chào bạn Tuấn! Với chiều cao 1m75 nặng 70kg, bạn mặc **Size L** của Áo Polo Pima là vừa vặn và tôn dáng nhất nhé ạ! Hiện bên mình đang có sẵn tại Kho Tổng Hà Nội và đang có ưu đãi còn **350.000đ/áo**. Bạn muốn shop gửi màu Trắng hay Xanh Navy ạ? 😊',
      time: '10:14',
      aiMetadata: {
        intent: 'TƯ_VẤN_SIZE_ÁO',
        confidence: 99.1,
        source: 'Bảng size Master Catalog & Tồn kho Sapo POS (WH_MAIN_HN: 340 chiếc)',
        latency: '1.1s',
      },
    },
    {
      id: '3',
      sender: 'customer',
      text: 'Cho mình 1 chiếc màu Xanh Navy size L nhé, ship về số 12 Cầu Giấy, Hà Nội giúp mình.',
      time: '10:15',
    },
    {
      id: '4',
      sender: 'ai',
      text: 'Dạ vâng ạ! Shop đã tạo đơn hàng thành công cho bạn:\n- **Sản phẩm**: Áo Polo Pima Nam Cao Cấp (Xanh Navy - Size L)\n- **Tổng thanh toán**: 350.000đ (Freeship qua Viettel Post Hỏa Tốc)\n- **Mã đơn hàng**: #UNF-88291\nShop sẽ bàn giao ngay cho đơn vị vận chuyển trong 30 phút tới nhé ạ! 🎉',
      time: '10:15',
      aiMetadata: {
        intent: 'CHỐT_ĐƠN_TỰ_ĐỘNG',
        confidence: 98.6,
        source: 'Đồng bộ Sapo POS ➔ So sánh cước chọn Viettel Post (19.5k) ➔ Tạo vận đơn',
        latency: '1.3s',
      },
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [fileSearchQuery, setFileSearchQuery] = useState('');

  const handleSendManual = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'ai',
        text: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
    notify.success('Đã gửi tin nhắn can thiệp thủ công tới khách hàng!');
  };

  // Sample spreadsheet data for preview
  const fileRows = initialFileData || [
    { sku: 'TSHIRT-OVR-BLK-L', name: 'Áo Thun Oversize Đen (L)', channel: 'TikTok Shop', qty: 1420, rev: '269.800.000', stock: 480, status: 'Bán chạy' },
    { sku: 'JEAN-SLIM-BLU-31', name: 'Quần Jean Slimfit Xanh (31)', channel: 'Shopee Mall', qty: 890, rev: '311.500.000', stock: 210, status: 'Ổn định' },
    { sku: 'HOODIE-STR-GRY-XL', name: 'Áo Hoodie Streetwear Xám (XL)', channel: 'Lazada Mall', qty: 640, rev: '288.000.000', stock: 95, status: 'Sắp hết hàng' },
    { sku: 'POLO-PREM-WHT-M', name: 'Áo Polo Pima Trắng (M)', channel: 'TikTok Shop', qty: 1120, rev: '392.000.000', stock: 340, status: 'Bán chạy' },
    { sku: 'SHIRT-LIN-NVY-L', name: 'Áo Sơ Mi Linen Nam Cổ Tàu (L)', channel: 'WooCommerce', qty: 430, rev: '150.500.000', stock: 160, status: 'Mới ra mắt' },
  ];

  const filteredFileRows = fileRows.filter(
    (r: any) =>
      r.sku.toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(fileSearchQuery.toLowerCase()) ||
      r.channel.toLowerCase().includes(fileSearchQuery.toLowerCase())
  );

  const navItems = [
    { key: 'chat', label: 'Pancake & AI CSKH Live', icon: <MessageFilled style={{ color: '#2563EB' }} />, badge: 'Live' },
    { key: 'accounting', label: 'Sổ cái MISA & Kê khai Thuế', icon: <DollarCircleFilled style={{ color: '#0284C7' }} />, badge: 'TT 40/2021' },
    { key: 'file', label: 'Bảng tính Excel (.xlsx)', icon: <FileExcelFilled style={{ color: '#107C41' }} />, badge: '5 SKU' },
    { key: 'tracking', label: 'Hành trình Vận đơn', icon: <CarFilled style={{ color: '#EE0033' }} />, badge: 'Đang giao' },
    { key: 'pos', label: 'Tồn kho POS Realtime', icon: <ShoppingOutlined style={{ color: '#0088FF' }} />, badge: '4 Kho' },
    { key: 'webhook', label: 'Giám sát Webhook', icon: <CodeOutlined style={{ color: '#8B5CF6' }} />, badge: '200 OK' },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#FFF1F2',
                border: '1px solid #FECDD3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src="/favicon.svg" alt="UniFlow" style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, color: '#111827' }}>
                <span>Trung tâm Kiểm tra Đa năng (Agent Multi-Window Inspector)</span>
                <Tag color="purple" style={{ borderRadius: 4, margin: 0, fontSize: 10, fontWeight: 700 }}>
                  Agentic Mini-Hub v2.5
                </Tag>
              </div>
              <div style={{ fontSize: 11.5, color: '#6B7280', fontWeight: 400 }}>
                Cửa sổ tích hợp kiểm tra hội thoại Pancake, file Excel, tra cứu vận đơn Viettel Post và kho POS
              </div>
            </div>
          </div>
        </div>
      }
      styles={{
        body: { padding: '12px 18px 18px', background: '#F8FAFC' },
      }}
    >
      {/* 1. Multi-Window Tab Bar Navigation */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 12,
          padding: 4,
          background: '#FFFFFF',
          borderRadius: 10,
          border: '1px solid #E2E8F0',
          overflowX: 'auto',
        }}
      >
        {navItems.map((item) => {
          const isSelected = activeTab === item.key;
          return (
            <div
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 7,
                fontSize: 12.5,
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? '#1E293B' : '#64748B',
                background: isSelected ? '#F1F5F9' : 'transparent',
                border: isSelected ? '1px solid #CBD5E1' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              <Tag
                color={isSelected ? 'red' : 'default'}
                style={{
                  fontSize: 10,
                  borderRadius: 4,
                  margin: '0 0 0 4px',
                  padding: '0 5px',
                  height: 18,
                  lineHeight: '16px',
                }}
              >
                {item.badge}
              </Tag>
            </div>
          );
        })}
      </div>

      {/* 2. Window Content Area */}
      <div style={{ height: 500, display: 'flex', flexDirection: 'column' }}>
        {/* Tab 1: Pancake POS & Live AI CSKH */}
        {activeTab === 'chat' && (
          <div style={{ display: 'flex', gap: 14, height: '100%' }}>
            {/* Left: Chat Thread */}
            <div
              style={{
                flex: 1,
                background: '#FFFFFF',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Customer Header Info */}
              <div
                style={{
                  padding: '10px 14px',
                  background: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={getPartnerLogo('pancake')} alt="Pancake" style={{ width: 22, height: 22 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ fontSize: 13, color: '#0F172A' }}>Nguyễn Văn Tuấn</strong>
                      <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>ID: #CUST_7891</Tag>
                      <Tag color="gold" style={{ fontSize: 10, margin: 0 }}>Khách VIP</Tag>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>
                      Fanpage Thời Trang An Khang • SĐT: 0988***123 • Cầu Giấy, Hà Nội
                    </div>
                  </div>
                </div>
                <Tag color="green" style={{ fontSize: 11, margin: 0, padding: '2px 8px' }}>
                  ● Live Sync
                </Tag>
              </div>

              {/* Message List */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {messages.map((m) => {
                  const isCust = m.sender === 'customer';
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        flexDirection: isCust ? 'row' : 'row-reverse',
                        gap: 8,
                        alignItems: 'flex-start',
                      }}
                    >
                      <Avatar
                        size={30}
                        style={{
                          backgroundColor: isCust ? '#3B82F6' : '#ed1c24',
                          fontSize: 12,
                          flexShrink: 0,
                        }}
                      >
                        {isCust ? 'T' : <ThunderboltFilled style={{ fontSize: 12 }} />}
                      </Avatar>

                      <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div
                          style={{
                            padding: '10px 14px',
                            borderRadius: isCust ? '2px 12px 12px 12px' : '12px 2px 12px 12px',
                            background: isCust ? '#F1F5F9' : '#FFF1F2',
                            border: isCust ? '1px solid #E2E8F0' : '1px solid #FECDD3',
                            color: '#1E293B',
                            fontSize: 13,
                            lineHeight: 1.55,
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {m.text}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCust ? 'flex-start' : 'flex-end',
                            gap: 6,
                            fontSize: 10.5,
                            color: '#94A3B8',
                          }}
                        >
                          <span>{m.time}</span>
                          {!isCust && (
                            <span style={{ color: '#ed1c24', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                              <ThunderboltFilled /> Phản hồi tự động AI (1.1s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Manual Chat Input */}
              <div
                style={{
                  padding: '10px 14px',
                  borderTop: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #CBD5E1',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    padding: '2px 8px 2px 10px',
                    height: 34,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Tag
                    color={isManualOverride ? 'orange' : 'green'}
                    style={{
                      marginRight: 6,
                      fontSize: 10.5,
                      padding: '0 6px',
                      height: 20,
                      lineHeight: '18px',
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  >
                    {isManualOverride ? 'Can thiệp' : 'AI 0-chạm'}
                  </Tag>
                  <Input
                    variant="borderless"
                    placeholder={
                      isManualOverride
                        ? 'Nhập tin nhắn can thiệp thủ công tới khách hàng...'
                        : 'Nhập tin nhắn để can thiệp hoặc AI tự phản hồi...'
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onPressEnter={handleSendManual}
                    style={{
                      padding: 0,
                      fontSize: 12.5,
                      boxShadow: 'none',
                    }}
                  />
                </div>

                <BaseButton
                  variant="primary"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={handleSendManual}
                  style={{
                    height: 34,
                    padding: '0 16px',
                    fontSize: 12.5,
                    borderRadius: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Gửi
                </BaseButton>
              </div>
            </div>

            {/* Right: AI Decision Breakdown */}
            <div
              style={{
                width: 290,
                background: '#FFFFFF',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                fontSize: 12,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ThunderboltFilled style={{ color: '#ed1c24' }} />
                <span>Giải trình Quyết định AI</span>
              </div>

              <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ color: '#64748B', fontSize: 11, marginBottom: 2 }}>Ý định phát hiện (Intent):</div>
                <strong style={{ color: '#059669', fontSize: 12.5 }}>TƯ VẤN SIZE & CHỐT ĐƠN</strong>
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <span>Độ tin cậy:</span>
                  <strong style={{ color: '#059669' }}>99.1%</strong>
                </div>
                <Progress percent={99} size="small" strokeColor="#10B981" showInfo={false} />
              </div>

              <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ color: '#64748B', fontSize: 11, marginBottom: 4 }}>Dữ liệu tham chiếu:</div>
                <div style={{ fontSize: 11.5, color: '#334155', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div>• Master SKU: <strong>POLO-PREM-NVY-M</strong></div>
                  <div>• Tồn kho Sapo: <strong>340 chiếc (WH_MAIN_HN)</strong></div>
                  <div>• Cước tối ưu: <strong>Viettel Post (19.5k)</strong></div>
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ color: '#64748B', fontSize: 11, marginBottom: 4 }}>Kênh kết nối:</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Tag color="blue" style={{ margin: 0 }}>Pancake POS</Tag>
                  <Tag color="orange" style={{ margin: 0 }}>Shopee Chat</Tag>
                  <Tag color="cyan" style={{ margin: 0 }}>Zalo ZNS</Tag>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <BaseButton
                  variant={isManualOverride ? 'primary' : 'ghost'}
                  size="small"
                  icon={<CustomerServiceOutlined />}
                  onClick={() => {
                    setIsManualOverride(!isManualOverride);
                    notify.info(isManualOverride ? 'Đã tắt can thiệp thủ công!' : 'Đã bật can thiệp thủ công!');
                  }}
                  style={{ width: '100%' }}
                >
                  {isManualOverride ? 'Tắt can thiệp (Bật lại AI)' : 'Can thiệp chat thủ công'}
                </BaseButton>

                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => notify.success('Mở bảng cấu hình Prompt bot Pancake!')}
                  style={{ width: '100%' }}
                >
                  Sửa Prompt bot Pancake
                </BaseButton>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: File & Spreadsheet Inspector */}
        {activeTab === 'file' && (
          <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 14, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileExcelFilled style={{ color: '#107C41', fontSize: 28 }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: 14, color: '#0F172A' }}>Bao_Cao_Doanh_Thu_Tong_Hop_UniFlow.xlsx</strong>
                    <Tag color="green">Realtime Data</Tag>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>
                    Đã xuất 5 dòng dữ liệu • Tổng doanh thu: <strong>1.411.800.000đ</strong> • Đã bán: <strong>4.500 SP</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Input
                  size="small"
                  prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
                  placeholder="Tìm SKU hoặc tên sản phẩm..."
                  value={fileSearchQuery}
                  onChange={(e) => setFileSearchQuery(e.target.value)}
                  style={{ width: 220, borderRadius: 6 }}
                />

                <BaseButton
                  variant="primary"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => notify.success('Đã tải xuống file Excel (.xlsx) thành công!')}
                >
                  Tải file Excel
                </BaseButton>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Table
                dataSource={filteredFileRows}
                pagination={false}
                size="small"
                rowKey="sku"
                columns={[
                  { title: 'Mã SKU', dataIndex: 'sku', key: 'sku', render: (val) => <strong style={{ color: '#ed1c24' }}>{val}</strong> },
                  { title: 'Tên Sản Phẩm', dataIndex: 'name', key: 'name' },
                  { title: 'Sàn Bán', dataIndex: 'channel', key: 'ch', render: (val) => <Tag color="blue">{val}</Tag> },
                  { title: 'Số Lượng Đã Bán', dataIndex: 'qty', key: 'qty' },
                  { title: 'Tồn Kho Khả Dụng', dataIndex: 'stock', key: 'stk', render: (val) => <strong>{val} chiếc</strong> },
                  { title: 'Doanh Thu (VNĐ)', dataIndex: 'rev', key: 'rev', render: (val) => <strong>{val}đ</strong> },
                  { title: 'Trạng Thái', dataIndex: 'status', key: 'status', render: (val) => <Tag color={val.includes('hết') ? 'orange' : 'green'}>{val}</Tag> },
                ]}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Live Carrier Waybill Tracking */}
        {activeTab === 'tracking' && (
          <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 16, height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, color: '#0F172A' }}>
                  <span>Mã vận đơn: <strong>VTP882910482VN</strong></span>
                  <Tag color="magenta">Viettel Post Hỏa Tốc</Tag>
                  <Tag color="green">SLA Đúng hạn</Tag>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Người nhận: <strong>Nguyễn Văn Tuấn</strong> (0988***123) • Địa chỉ: 12 Cầu Giấy, Hà Nội
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<PhoneOutlined />}
                  onClick={() => notify.info('Đang liên hệ Bưu tá Lê Văn Long: 0912***789')}
                >
                  Gọi bưu tá (0912***789)
                </BaseButton>

                <Tag color="processing" icon={<CarFilled />} style={{ fontSize: 12, padding: '4px 10px', margin: 0 }}>
                  ĐANG PHÁT HÀNG (Dự kiến: Trước 14:00)
                </Tag>
              </div>
            </div>

            <Row gutter={14} style={{ marginBottom: 14 }}>
              <Col span={6}>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <Statistic title="Cước vận chuyển" value="19.500đ" valueStyle={{ color: '#059669', fontWeight: 'bold', fontSize: 17 }} />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <Statistic title="Khối lượng quy đổi" value="350g" suffix="(25x15x5cm)" valueStyle={{ fontSize: 15 }} />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <Statistic title="Tiền thu hộ COD" value="350.000đ" valueStyle={{ fontSize: 15 }} />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <Statistic title="Thời gian giao TB" value="1.8 giờ" valueStyle={{ color: '#2563EB', fontSize: 15 }} />
                </div>
              </Col>
            </Row>

            <div style={{ flex: 1, background: '#F8FAFC', padding: 14, borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: '#0F172A' }}>
                Lịch trình di chuyển chi tiết:
              </div>
              <Timeline
                items={[
                  {
                    color: 'green',
                    dot: <CheckCircleFilled style={{ fontSize: 14 }} />,
                    children: (
                      <div>
                        <strong>10:45 - Bưu tá đang phát hàng tới người nhận</strong>
                        <div style={{ fontSize: 12, color: '#64748B' }}>Bưu tá Lê Văn Long (0912***789) đang trên tuyến đường Cầu Giấy.</div>
                      </div>
                    ),
                  },
                  {
                    color: 'blue',
                    children: (
                      <div>
                        <strong>09:30 - Đến bưu cục phát Cầu Giấy (Hà Nội)</strong>
                        <div style={{ fontSize: 12, color: '#64748B' }}>Kiện hàng đã hoàn tất phân loại và nhập kho phát.</div>
                      </div>
                    ),
                  },
                  {
                    color: 'gray',
                    children: (
                      <div>
                        <strong>08:15 - Đã lấy hàng tại Kho Tổng Hà Nội (WH_MAIN_HN)</strong>
                        <div style={{ fontSize: 12, color: '#64748B' }}>Bưu tá Viettel Post xác nhận nhận bưu kiện từ hệ thống UniFlow.</div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        )}

        {/* Tab 4: Sapo & KiotViet Multi-Branch Inventory */}
        {activeTab === 'pos' && (
          <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 14, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <strong style={{ fontSize: 14, color: '#0F172A' }}>Tồn kho Sapo POS & KiotViet theo từng chi nhánh</strong>
                <div style={{ fontSize: 11.5, color: '#64748B' }}>Đồng bộ realtime 2 chiều qua Webhook Inbound</div>
              </div>
              <BaseButton
                variant="primary"
                size="small"
                icon={<ShoppingOutlined />}
                onClick={() => notify.success('Đã đồng bộ lại toàn bộ tồn kho 4 chi nhánh!')}
              >
                Đồng bộ tồn kho ngay
              </BaseButton>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Table
                dataSource={[
                  { branch: 'Kho Tổng Hà Nội (WH_MAIN_HN)', polo: 340, tshirt: 480, jean: 210, hoodie: 95, status: 'Đầy đủ' },
                  { branch: 'Chi nhánh Cầu Giấy (STORE_CG)', polo: 45, tshirt: 60, jean: 30, hoodie: 15, status: 'Đầy đủ' },
                  { branch: 'Chi nhánh Quận 1 TP.HCM (WH_HCM_Q1)', polo: 180, tshirt: 220, jean: 140, hoodie: 0, status: 'Hết Hoodie' },
                  { branch: 'Kho Hoàn Trả (WH_RETURN)', polo: 8, tshirt: 12, jean: 4, hoodie: 2, status: 'Đang kiểm đếm' },
                ]}
                pagination={false}
                size="small"
                rowKey="branch"
                columns={[
                  { title: 'Chi nhánh / Kho hàng', dataIndex: 'branch', key: 'br', render: (val) => <span style={{ fontWeight: 600 }}><EnvironmentOutlined style={{ color: '#ed1c24', marginRight: 4 }} />{val}</span> },
                  { title: 'Áo Polo (M)', dataIndex: 'polo', key: 'p', render: (val) => <strong>{val}</strong> },
                  { title: 'Áo Thun (L)', dataIndex: 'tshirt', key: 't', render: (val) => <strong>{val}</strong> },
                  { title: 'Quần Jean (31)', dataIndex: 'jean', key: 'j', render: (val) => <strong>{val}</strong> },
                  { title: 'Áo Hoodie (XL)', dataIndex: 'hoodie', key: 'h', render: (val) => <span style={{ color: val === 0 ? '#EF4444' : '#0F172A', fontWeight: val === 0 ? 700 : 400 }}>{val}</span> },
                  { title: 'Tình trạng', dataIndex: 'status', key: 'st', render: (val) => <Tag color={val.includes('Hết') ? 'red' : 'green'}>{val}</Tag> },
                ]}
              />
            </div>
          </div>
        )}

        {/* Tab 5: Webhook Payload Inspector */}
        {activeTab === 'webhook' && (
          <div style={{ background: '#0F172A', borderRadius: 10, padding: 14, height: '100%', display: 'flex', flexDirection: 'column', color: '#E2E8F0', fontFamily: 'Consolas, monospace', fontSize: 12 }}>
            <div style={{ color: '#94A3B8', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SafetyCertificateFilled style={{ color: '#10B981' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>TikTok Shop Webhook Payload (HMAC-SHA256 Verified)</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Tag color="green" style={{ margin: 0 }}>200 OK • 120ms</Tag>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify({ event: 'ORDER_STATUS_CHANGE', order_id: '57891048291048' }));
                    notify.success('Đã sao chép JSON Payload!');
                  }}
                  style={{ color: '#FFFFFF', borderColor: '#334155', height: 24, fontSize: 11 }}
                >
                  Copy JSON
                </BaseButton>
              </div>
            </div>
            <pre style={{ flex: 1, margin: 0, overflowY: 'auto', background: '#1E293B', padding: 12, borderRadius: 8, border: '1px solid #334155', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(
                {
                  event: 'ORDER_STATUS_CHANGE',
                  timestamp: 1724058900,
                  shop_id: 'VN_SHOP_88291',
                  signature: 'sha256=a8f9c1b2e3d4...',
                  data: {
                    order_id: '57891048291048',
                    order_status: 'AWAITING_SHIPMENT',
                    payment_method: 'COD',
                    buyer_name: 'Nguyen Van Tuan',
                    buyer_phone: '0988***123',
                    shipping_address: '12 Cau Giay, Quan Cau Giay, Ha Noi',
                    order_items: [
                      {
                        sku_id: 'TTS-POLO-PIMA-NAVY-M',
                        product_name: 'Áo Polo Pima Nam Cao Cấp - Xanh Navy (M)',
                        quantity: 1,
                        price: 350000,
                        currency: 'VND',
                      },
                    ],
                    carrier_selected: 'VIETTEL_POST_EXPRESS',
                    rate_calculated: 19500,
                  },
                },
                null,
                2
              )}
            </pre>
          </div>
        )}

        {/* Tab 6: MISA AMIS Accounting & Tax Declaration Inspector */}
        {activeTab === 'accounting' && (
          <div style={{ background: '#FFFFFF', borderRadius: 10, border: '1px solid #E2E8F0', padding: 14, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={getPartnerLogo('misa')} alt="MISA" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                <div>
                  <strong style={{ fontSize: 14, color: '#0F172A' }}>Sổ cái MISA AMIS & Kê khai Thuế TMĐT (Nghị định 117/2025/NĐ-CP)</strong>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>Tự động bóc tách doanh thu sạch, thuế GTGT (1%) & TNCN (0.5%) theo TT 40/2021/TT-BTC</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => notify.success('Đã tải xuống Tờ khai Thuế Mẫu 01/GTGT.xlsx')}
                >
                  Tải Mẫu 01/GTGT
                </BaseButton>
                <BaseButton
                  variant="primary"
                  size="small"
                  icon={<ThunderboltFilled />}
                  onClick={() => notify.success('Đã đồng bộ 2.410 chứng từ vào phần mềm MISA AMIS! ✅')}
                >
                  Đồng bộ sang MISA AMIS
                </BaseButton>
              </div>
            </div>

            {/* Tax & Financial Highlights */}
            <Row gutter={12} style={{ marginBottom: 12 }}>
              <Col span={6}>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <Statistic title="Tổng doanh thu Gross" value="1.411.800.000đ" valueStyle={{ color: '#0F172A', fontWeight: 'bold', fontSize: 15 }} />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <Statistic title="Thuế GTGT (1%)" value="13.405.000đ" valueStyle={{ color: '#EF4444', fontWeight: 'bold', fontSize: 15 }} />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <Statistic title="Thuế TNCN (0.5%)" value="6.702.500đ" valueStyle={{ color: '#D97706', fontWeight: 'bold', fontSize: 15 }} />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ background: '#ECFDF5', padding: '10px 12px', borderRadius: 8, border: '1px solid #A7F3D0' }}>
                  <Statistic title="Tổng thuế tạm tính" value="20.107.500đ" valueStyle={{ color: '#059669', fontWeight: 'bold', fontSize: 15 }} />
                </div>
              </Col>
            </Row>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Table
                dataSource={[
                  { docNo: 'HD-2026-00891', date: '19/08/2026', ch: 'TikTok Shop', customer: 'Nguyễn Văn Tuấn', gross: '350.000đ', vat: '3.500đ', debit: 'Nợ 112 / Có 511, 3331', status: 'Đã ký meInvoice' },
                  { docNo: 'HD-2026-00892', date: '19/08/2026', ch: 'Shopee Mall', customer: 'Trần Thị Mai', gross: '720.000đ', vat: '7.200đ', debit: 'Nợ 112 / Có 511, 3331', status: 'Đã ký meInvoice' },
                  { docNo: 'HD-2026-00893', date: '19/08/2026', ch: 'Lazada Mall', customer: 'Lê Hoàng Long', gross: '450.000đ', vat: '4.500đ', debit: 'Nợ 112 / Có 511, 3331', status: 'Đã đồng bộ MISA' },
                  { docNo: 'HD-2026-00894', date: '19/08/2026', ch: 'WooCommerce', customer: 'Phạm Thu Trang', gross: '1.200.000đ', vat: '12.000đ', debit: 'Nợ 112 / Có 511, 3331', status: 'Đã đồng bộ MISA' },
                ]}
                pagination={false}
                size="small"
                rowKey="docNo"
                columns={[
                  { title: 'Số Hóa Đơn / CT', dataIndex: 'docNo', key: 'd', render: (val) => <strong style={{ color: '#0284C7' }}>{val}</strong> },
                  { title: 'Ngày CT', dataIndex: 'date', key: 'dt' },
                  { title: 'Kênh Bán', dataIndex: 'ch', key: 'c', render: (val) => <Tag color="blue">{val}</Tag> },
                  { title: 'Khách Hàng', dataIndex: 'customer', key: 'cust' },
                  { title: 'Doanh Thu', dataIndex: 'gross', key: 'gr', render: (val) => <strong>{val}</strong> },
                  { title: 'Thuế VAT', dataIndex: 'vat', key: 'v', render: (val) => <span style={{ color: '#EF4444' }}>{val}</span> },
                  { title: 'Định Khoản', dataIndex: 'debit', key: 'deb', render: (val) => <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{val}</span> },
                  { title: 'Trạng Thái', dataIndex: 'status', key: 'st', render: (val) => <Tag color="green">{val}</Tag> },
                ]}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AgentOmniInspectorModal;
