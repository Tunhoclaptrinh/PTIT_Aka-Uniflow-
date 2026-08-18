import React from 'react';
import { Drawer, Card, Typography } from 'antd';
import {
  ThunderboltFilled,
  PlusOutlined,
  ShoppingFilled,
  DatabaseFilled,
  CarFilled,
} from '@ant-design/icons';
import { BaseButton } from '../../base/BaseButton';

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
  const nodeCategories = [
    {
      category: '1. Inbound Triggers (Sàn TMĐT)',
      color: '#ed1c24',
      icon: <ShoppingFilled />,
      items: [
        { type: 'trigger', label: 'TikTok Shop Webhook', desc: 'Nhận sự kiện đơn mới, đổi trạng thái thanh toán', cat: 'TRIGGER' },
        { type: 'trigger', label: 'Shopee Push Notification', desc: 'Nhận webhook đơn READY_TO_SHIP từ Shopee', cat: 'TRIGGER' },
        { type: 'trigger', label: 'Lazada Inbound Webhook', desc: 'Bắt đơn hàng mới từ sàn Lazada', cat: 'TRIGGER' },
      ],
    },
    {
      category: '2. AI Agents & Intelligence',
      color: '#8B5CF6',
      icon: <ThunderboltFilled />,
      items: [
        { type: 'ai', label: 'AI Hybrid SKU Mapper', desc: 'So khớp mã hàng tự động bằng Vector + NLP', cat: 'AI' },
        { type: 'ai', label: 'AI Self-Healing & Router', desc: 'Tự chẩn đoán lỗi ĐVVC và chuyển tuyến thông minh', cat: 'AI' },
        { type: 'ai', label: 'AI Dynamic Price/Stock Sync', desc: 'Đồng bộ tồn kho an toàn chống bán âm', cat: 'AI' },
      ],
    },
    {
      category: '3. POS & Quản lý Kho (ERP Actions)',
      color: '#fcc20f',
      icon: <DatabaseFilled />,
      items: [
        { type: 'action', label: 'Trừ tồn kho Sapo POS', desc: 'Ghi giảm số lượng tồn kho khả dụng trên Sapo', cat: 'POS' },
        { type: 'action', label: 'Trừ tồn kho KiotViet', desc: 'Đồng bộ kho thực tế chi nhánh KiotViet', cat: 'POS' },
        { type: 'action', label: 'Đồng bộ Haravan ERP', desc: 'Cập nhật hóa đơn và phiếu xuất kho', cat: 'POS' },
      ],
    },
    {
      category: '4. Đơn vị Vận chuyển (Logistics)',
      color: '#10B981',
      icon: <CarFilled />,
      items: [
        { type: 'action', label: 'Tạo vận đơn GHTK', desc: 'Đẩy đơn Giao Hàng Tiết Kiệm tự động', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo đơn GHN Nhanh', desc: 'Đẩy đơn Giao Hàng Nhanh chuẩn SLA', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo đơn Viettel Post', desc: 'Đẩy đơn Viettel Post toàn quốc', cat: 'LOGISTICS' },
      ],
    },
  ];

  return (
    <Drawer
      title={
        <span style={{ fontWeight: 700, fontSize: 16 }}>
          📦 Thư Viện Node Quy Trình (Node Palette)
        </span>
      }
      placement="right"
      width={420}
      open={open}
      onClose={onClose}
      styles={{
        body: { padding: '16px' },
      }}
    >
      <Paragraph style={{ color: '#6B7280', fontSize: 13, marginBottom: 20 }}>
        Bấm nút <strong>(+) Thêm</strong> để chèn khối chức năng mới vào Canvas quy trình của bạn.
      </Paragraph>

      {nodeCategories.map((catGroup) => (
        <div key={catGroup.category} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: catGroup.color, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            {catGroup.icon} {catGroup.category}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {catGroup.items.map((item) => (
              <Card
                key={item.label}
                size="small"
                bordered={false}
                style={{
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{item.label}</div>
                    <div style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>{item.desc}</div>
                  </div>
                  <BaseButton
                    variant="brand"
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
      ))}
    </Drawer>
  );
};
