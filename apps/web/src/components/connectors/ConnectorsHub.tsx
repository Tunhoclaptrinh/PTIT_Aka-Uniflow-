import React from 'react';
import { Row, Col, Card, Tag, Button, Space, Typography, Avatar } from 'antd';
import { CheckCircleFilled, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Connector {
  id: string;
  name: string;
  category: 'MARKETPLACE' | 'POS' | 'LOGISTICS';
  status: 'CONNECTED' | 'DISCONNECTED';
  iconText: string;
  gradient: string;
  details: string;
}

const connectors: Connector[] = [
  {
    id: 'tiktok',
    name: 'TikTok Shop',
    category: 'MARKETPLACE',
    status: 'CONNECTED',
    iconText: 'TT',
    gradient: 'linear-gradient(135deg, #000000 0%, #25F4EE 100%)',
    details: 'Đã liên kết 2 shop • Webhook Live (<0.1s)',
  },
  {
    id: 'shopee',
    name: 'Shopee Open Platform',
    category: 'MARKETPLACE',
    status: 'CONNECTED',
    iconText: 'SP',
    gradient: 'linear-gradient(135deg, #EE4D2D 0%, #FF7337 100%)',
    details: 'Đã liên kết 1 shop • Token tự động refresh',
  },
  {
    id: 'sapo',
    name: 'Sapo POS & Omnichannel',
    category: 'POS',
    status: 'CONNECTED',
    iconText: 'SP',
    gradient: 'linear-gradient(135deg, #0088FF 0%, #00B4D8 100%)',
    details: 'Kho Tổng Hà Nội • Tự động trừ tồn kho',
  },
  {
    id: 'kiotviet',
    name: 'KiotViet POS',
    category: 'POS',
    status: 'CONNECTED',
    iconText: 'KV',
    gradient: 'linear-gradient(135deg, #0052CC 0%, #2684FF 100%)',
    details: 'Chi nhánh Cầu Giấy • Đồng bộ 2 chiều',
  },
  {
    id: 'ghtk',
    name: 'Giao Hàng Tiết Kiệm (GHTK)',
    category: 'LOGISTICS',
    status: 'CONNECTED',
    iconText: 'TK',
    gradient: 'linear-gradient(135deg, #006838 0%, #009245 100%)',
    details: 'Tự động tạo vận đơn & in nhãn',
  },
  {
    id: 'ghn',
    name: 'Giao Hàng Nhanh (GHN)',
    category: 'LOGISTICS',
    status: 'CONNECTED',
    iconText: 'HN',
    gradient: 'linear-gradient(135deg, #F26522 0%, #FF8A00 100%)',
    details: 'Kênh vận chuyển dự phòng tự chữa lành',
  },
];

export const ConnectorsHub: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Title level={4} style={{ color: '#F9FAFB', margin: 0 }}>
          Trung Tâm Kết Nối Đa Kênh (Connectors Hub)
        </Title>
        <Text style={{ color: '#9CA3AF' }}>
          Quản lý các kết nối Sàn TMĐT, Phần mềm Kho POS và Hãng Vận chuyển chuẩn bảo mật AES-256-GCM.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {connectors.map((c) => (
          <Col xs={24} sm={12} lg={8} key={c.id}>
            <Card
              bordered={false}
              style={{
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Space>
                  <Avatar
                    size={42}
                    style={{
                      background: c.gradient,
                      fontWeight: 800,
                      color: '#ffffff',
                    }}
                  >
                    {c.iconText}
                  </Avatar>
                  <div>
                    <div style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                    <Tag
                      color={
                        c.category === 'MARKETPLACE'
                          ? '#ed1c24'
                          : c.category === 'POS'
                          ? '#fcc20f'
                          : '#10B981'
                      }
                      style={{
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        color: c.category === 'POS' ? '#0B0F19' : '#ffffff',
                        marginTop: 2,
                      }}
                    >
                      {c.category}
                    </Tag>
                  </div>
                </Space>

                <Tag color="#10B981" style={{ borderRadius: 6, fontWeight: 600 }}>
                  <CheckCircleFilled /> Đã Kết Nối
                </Tag>
              </div>

              <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 14 }}>{c.details}</div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  size="small"
                  type="text"
                  icon={<SettingOutlined />}
                  style={{ color: '#D1D5DB' }}
                >
                  Cấu hình API
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
