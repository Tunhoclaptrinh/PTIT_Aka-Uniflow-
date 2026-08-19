import React, { useState, useMemo } from 'react';
import { Drawer, Card, Typography, Input, Tag } from 'antd';
import {
  ThunderboltFilled,
  PlusOutlined,
  ShoppingFilled,
  DatabaseFilled,
  CarFilled,
  BellFilled,
  BranchesOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { BaseButton } from '../../base/BaseButton';
import { getPartnerLogo } from '../../../utils/partnerLogos';

const { Paragraph } = Typography;

interface NodeLibraryDrawerProps {
  open: boolean;
  onClose: () => void;
  onAddNode: (nodeType: string, label: string, category?: string) => void;
}

export const NodeLibraryDrawer: React.FC<NodeLibraryDrawerProps> = ({
  open,
  onClose,
  onAddNode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');

  const nodeCategories = [
    {
      id: 'MARKETPLACE',
      category: '1. Cổng tiếp nhận (Sàn TMĐT)',
      color: '#ed1c24',
      icon: <ShoppingFilled />,
      items: [
        { type: 'trigger', label: 'TikTok Shop Webhook', desc: 'Nhận sự kiện đơn mới, đổi trạng thái thanh toán', cat: 'TRIGGER' },
        { type: 'trigger', label: 'Shopee Push Webhook', desc: 'Nhận webhook đơn sẵn sàng giao từ sàn Shopee', cat: 'TRIGGER' },
        { type: 'trigger', label: 'Lazada Inbound Webhook', desc: 'Bắt đơn hàng mới từ sàn Lazada', cat: 'TRIGGER' },
        { type: 'trigger', label: 'Tiki OpenAPI Sync', desc: 'Nhận thông báo đơn hàng từ sàn Tiki', cat: 'TRIGGER' },
        { type: 'trigger', label: 'WooCommerce Webhook', desc: 'Đồng bộ đơn hàng website WordPress / WooCommerce', cat: 'TRIGGER' },
      ],
    },
    {
      id: 'AI',
      category: '2. Khối trí tuệ nhân tạo (AI Engine)',
      color: '#8B5CF6',
      icon: <ThunderboltFilled />,
      items: [
        { type: 'ai', label: 'AI Hybrid SKU Mapper', desc: 'So khớp mã hàng tự động bằng Vector Cosine và Gemini NER', cat: 'AI' },
        { type: 'ai', label: 'AI So sánh cước & Chọn hãng rẻ nhất', desc: 'So sánh cước realtime: GHTK, GHN, Viettel Post để chọn hãng cước thấp nhất', cat: 'AI' },
        { type: 'ai', label: 'AI tự chữa lành & Định tuyến', desc: 'Tự chẩn đoán lỗi ĐVVC và chuyển tuyến thông minh dự phòng', cat: 'AI' },
        { type: 'ai', label: 'AI đồng bộ tồn kho an toàn', desc: 'Đồng bộ tồn kho tức thì chống bán âm đa kênh Mega Sale', cat: 'AI' },
      ],
    },
    {
      id: 'POS',
      category: '3. Kho và bán hàng (POS / ERP)',
      color: '#fcc20f',
      icon: <DatabaseFilled />,
      items: [
        { type: 'action', label: 'Trừ tồn kho Sapo POS', desc: 'Ghi giảm số lượng tồn kho khả dụng trên Sapo', cat: 'POS' },
        { type: 'action', label: 'Trừ tồn kho KiotViet', desc: 'Đồng bộ kho thực tế chi nhánh KiotViet', cat: 'POS' },
        { type: 'action', label: 'Đồng bộ Haravan ERP', desc: 'Cập nhật hóa đơn và phiếu xuất kho Haravan', cat: 'POS' },
        { type: 'action', label: 'Đồng bộ MISA eShop', desc: 'Khởi tạo hóa đơn và chứng từ kế toán MISA', cat: 'POS' },
        { type: 'action', label: 'Đồng bộ Odoo Enterprise', desc: 'Đồng bộ xuất kho ERP Odoo quốc tế', cat: 'POS' },
      ],
    },
    {
      id: 'LOGISTICS',
      category: '4. Đơn vị vận chuyển (Logistics)',
      color: '#10B981',
      icon: <CarFilled />,
      items: [
        { type: 'action', label: 'Tạo vận đơn hãng rẻ nhất', desc: 'Tự động gọi API hãng có cước thấp nhất (GHTK/GHN/Viettel Post)', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo vận đơn GHTK', desc: 'Đẩy đơn Giao Hàng Tiết Kiệm tự động & In tem A6', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo đơn GHN Nhanh', desc: 'Đẩy đơn Giao Hàng Nhanh chuẩn SLA giao 2h', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo đơn Viettel Post', desc: 'Đẩy đơn Viettel Post mạng lưới toàn quốc', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo đơn J&T Express', desc: 'Đẩy đơn vận chuyển quốc tế và nội địa J&T', cat: 'LOGISTICS' },
      ],
    },
    {
      id: 'LOGIC',
      category: '5. Điều kiện & Rẽ nhánh (Logic Flow)',
      color: '#EC4899',
      icon: <BranchesOutlined />,
      items: [
        { type: 'action', label: 'Rẽ nhánh theo giá trị đơn', desc: 'Điều kiện: Giá trị đơn hàng > 1.000.000đ đi kho riêng', cat: 'LOGIC' },
        { type: 'action', label: 'Định tuyến theo vùng miền', desc: 'Chia luồng xuất kho Hà Nội / Đà Nẵng / TP.HCM', cat: 'LOGIC' },
      ],
    },
    {
      id: 'NOTIFY',
      category: '6. Cảnh báo và thông báo (Notification)',
      color: '#3B82F6',
      icon: <BellFilled />,
      items: [
        { type: 'action', label: 'Thông báo Telegram Bot', desc: 'Gửi tin nhắn cảnh báo đơn và báo cáo cước tiết kiệm vào Telegram', cat: 'NOTIFY' },
        { type: 'action', label: 'Gửi tin Zalo ZNS', desc: 'Gửi thông báo mã vận đơn tới khách hàng qua Zalo OA', cat: 'NOTIFY' },
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

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Thư viện khối xử lý tự động</span>
          <Tag color="#ed1c24" style={{ fontWeight: 600, borderRadius: 4, margin: 0 }}>
            {nodeCategories.reduce((acc, c) => acc + c.items.length, 0)} Khối chức năng
          </Tag>
        </div>
      }
      placement="right"
      width={600}
      open={open}
      onClose={onClose}
      styles={{
        body: { padding: '16px 20px' },
      }}
    >
      {/* Search Input */}
      <Input
        placeholder="Tìm kiếm khối xử lý (Ví dụ: So sánh giá, GHTK, Shopee, Sapo...)"
        prefix={<SearchOutlined style={{ color: '#9CA3AF' }} />}
        allowClear
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 12, borderRadius: 8, height: 38 }}
      />

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <Tag
          color={selectedCat === 'ALL' ? '#ed1c24' : 'default'}
          style={{ cursor: 'pointer', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}
          onClick={() => setSelectedCat('ALL')}
        >
          Tất cả
        </Tag>
        <Tag
          color={selectedCat === 'MARKETPLACE' ? '#ed1c24' : 'default'}
          style={{ cursor: 'pointer', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}
          onClick={() => setSelectedCat('MARKETPLACE')}
        >
          Sàn TMĐT
        </Tag>
        <Tag
          color={selectedCat === 'AI' ? '#8B5CF6' : 'default'}
          style={{ cursor: 'pointer', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}
          onClick={() => setSelectedCat('AI')}
        >
          Trí tuệ nhân tạo AI
        </Tag>
        <Tag
          color={selectedCat === 'POS' ? '#d48806' : 'default'}
          style={{ cursor: 'pointer', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}
          onClick={() => setSelectedCat('POS')}
        >
          Kho POS / ERP
        </Tag>
        <Tag
          color={selectedCat === 'LOGISTICS' ? '#10B981' : 'default'}
          style={{ cursor: 'pointer', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}
          onClick={() => setSelectedCat('LOGISTICS')}
        >
          Vận chuyển
        </Tag>
        <Tag
          color={selectedCat === 'NOTIFY' ? '#3B82F6' : 'default'}
          style={{ cursor: 'pointer', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}
          onClick={() => setSelectedCat('NOTIFY')}
        >
          Cảnh báo
        </Tag>
      </div>

      <Paragraph style={{ color: '#6B7280', fontSize: 12, marginBottom: 14 }}>
        Bấm nút <strong>Thêm</strong> để kéo khối chức năng vào quy trình Canvas của bạn.
      </Paragraph>

      {filteredCategories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
          Không tìm thấy khối xử lý phù hợp với từ khóa "{searchQuery}"
        </div>
      ) : (
        filteredCategories.map((catGroup) => (
          <div key={catGroup.category} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: catGroup.color,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {catGroup.icon} {catGroup.category}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {catGroup.items.map((item) => (
                <Card
                  key={item.label}
                  size="small"
                  bordered={false}
                  style={{
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
                    transition: 'all 0.2s ease',
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
                                borderRadius: 6,
                                background: '#F3F4F6',
                                border: '1px solid #E5E7EB',
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
                              borderRadius: 6,
                              background: '#FFFFFF',
                              border: '1px solid #E5E7EB',
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
                            fontSize: 13,
                            color: '#111827',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            color: '#6B7280',
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
    </Drawer>
  );
};

export default NodeLibraryDrawer;
