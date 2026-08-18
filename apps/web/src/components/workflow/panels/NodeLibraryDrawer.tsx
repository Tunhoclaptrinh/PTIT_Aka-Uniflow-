import React from 'react';
import { Drawer, Card, Typography } from 'antd';
import {
  ThunderboltFilled,
  PlusOutlined,
  ShoppingFilled,
  DatabaseFilled,
  CarFilled,
  BellFilled,
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
      category: '1. Cổng tiếp nhận (Sàn TMĐT)',
      color: '#ed1c24',
      icon: <ShoppingFilled />,
      items: [
        { type: 'trigger', label: 'TikTok Shop Webhook', desc: 'Nhận sự kiện đơn mới, đổi trạng thái thanh toán', cat: 'TRIGGER' },
        { type: 'trigger', label: 'Shopee Push Webhook', desc: 'Nhận webhook đơn sẵn sàng giao từ sàn Shopee', cat: 'TRIGGER' },
        { type: 'trigger', label: 'Lazada Inbound Webhook', desc: 'Bắt đơn hàng mới từ sàn Lazada', cat: 'TRIGGER' },
      ],
    },
    {
      category: '2. Khối trí tuệ nhân tạo (AI)',
      color: '#8B5CF6',
      icon: <ThunderboltFilled />,
      items: [
        { type: 'ai', label: 'AI Hybrid SKU Mapper', desc: 'So khớp mã hàng tự động bằng Vector Cosine và NER', cat: 'AI' },
        { type: 'ai', label: 'AI tự chữa lành & Định tuyến', desc: 'Tự chẩn đoán lỗi ĐVVC và chuyển tuyến thông minh', cat: 'AI' },
        { type: 'ai', label: 'AI đồng bộ tồn kho an toàn', desc: 'Đồng bộ tồn kho tức thì chống bán âm đa kênh', cat: 'AI' },
      ],
    },
    {
      category: '3. Kho và bán hàng (POS / ERP)',
      color: '#fcc20f',
      icon: <DatabaseFilled />,
      items: [
        { type: 'action', label: 'Trừ tồn kho Sapo POS', desc: 'Ghi giảm số lượng tồn kho khả dụng trên Sapo', cat: 'POS' },
        { type: 'action', label: 'Trừ tồn kho KiotViet', desc: 'Đồng bộ kho thực tế chi nhánh KiotViet', cat: 'POS' },
        { type: 'action', label: 'Đồng bộ Haravan ERP', desc: 'Cập nhật hóa đơn và phiếu xuất kho Haravan', cat: 'POS' },
      ],
    },
    {
      category: '4. Đơn vị vận chuyển (Logistics)',
      color: '#10B981',
      icon: <CarFilled />,
      items: [
        { type: 'action', label: 'Tạo vận đơn GHTK', desc: 'Đẩy đơn Giao Hàng Tiết Kiệm tự động', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo đơn GHN Nhanh', desc: 'Đẩy đơn Giao Hàng Nhanh chuẩn SLA', cat: 'LOGISTICS' },
        { type: 'action', label: 'Tạo đơn Viettel Post', desc: 'Đẩy đơn Viettel Post toàn quốc', cat: 'LOGISTICS' },
      ],
    },
    {
      category: '5. Cảnh báo và thông báo',
      color: '#3B82F6',
      icon: <BellFilled />,
      items: [
        { type: 'action', label: 'Thông báo Telegram Bot', desc: 'Gửi tin nhắn cảnh báo đơn và trạng thái vào nhóm Telegram', cat: 'NOTIFY' },
        { type: 'action', label: 'Gửi tin Zalo ZNS', desc: 'Gửi thông báo mã vận đơn tới khách hàng qua Zalo', cat: 'NOTIFY' },
      ],
    },
  ];

  return (
    <Drawer
      title={
        <span style={{ fontWeight: 600, fontSize: 16 }}>
          Thư viện khối xử lý
        </span>
      }
      placement="right"
      width={400}
      open={open}
      onClose={onClose}
      styles={{
        body: { padding: '16px' },
      }}
    >
      <Paragraph style={{ color: '#6B7280', fontSize: 13, marginBottom: 16 }}>
        Bấm nút <strong>(+) Thêm</strong> để chèn khối chức năng mới vào quy trình Canvas của bạn.
      </Paragraph>

      {nodeCategories.map((catGroup) => (
        <div key={catGroup.category} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: catGroup.color, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
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
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{item.label}</div>
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
