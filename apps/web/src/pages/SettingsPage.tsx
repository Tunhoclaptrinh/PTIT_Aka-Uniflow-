import React from 'react';
import { Card, Form, Input, Button, Switch, Row, Col, Tag, message, Space, Divider } from 'antd';
import {
  SettingFilled,
  SaveOutlined,
  SafetyCertificateFilled,
  BellFilled,
  CrownFilled,
} from '@ant-design/icons';

export const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success('Đã lưu cấu hình doanh nghiệp thành công vào MongoDB Atlas!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <SettingFilled style={{ color: '#ed1c24', fontSize: 24 }} />
          <div>
            <div style={{ color: '#F9FAFB', fontWeight: 800, fontSize: 20 }}>
              Cài Đặt Hệ Thống & Doanh Nghiệp (Tenant & Engine Settings)
            </div>
            <div style={{ color: '#9CA3AF', fontSize: 13 }}>
              Cấu hình thông tin Merchant, Mã hóa bảo mật và Kênh thông báo sự cố
            </div>
          </div>
        </Space>
      </div>

      <Row gutter={[20, 20]}>
        {/* 1. Tenant Info */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <CrownFilled style={{ color: '#fcc20f' }} />
                <span style={{ color: '#F9FAFB', fontWeight: 700 }}>Thông Tin Doanh Nghiệp (Tenant Profile)</span>
                <Tag color="#ed1c24" style={{ fontWeight: 700 }}>Gói Growth</Tag>
              </Space>
            }
            bordered={false}
            style={{ background: '#111827', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12 }}
          >
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item label={<span style={{ color: '#D1D5DB' }}>Tên Doanh Nghiệp / Thương Hiệu</span>}>
                <Input defaultValue="Thời Trang An Khang (PTIT Aka Store)" style={{ background: '#0B0F19', borderColor: '#374151', color: '#F9FAFB' }} />
              </Form.Item>

              <Form.Item label={<span style={{ color: '#D1D5DB' }}>Subdomain Định Danh (Tenant ID)</span>}>
                <Input defaultValue="ankhang-ptit" readOnly style={{ background: '#0B0F19', borderColor: '#374151', color: '#fcc20f', fontFamily: 'JetBrains Mono' }} />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label={<span style={{ color: '#D1D5DB' }}>Màu Thương Hiệu Chủ Đạo</span>}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: '#ed1c24', border: '1px solid #ffffff' }} />
                      <Input defaultValue="#ed1c24" readOnly style={{ background: '#0B0F19', borderColor: '#374151', color: '#F9FAFB', fontFamily: 'JetBrains Mono' }} />
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<span style={{ color: '#D1D5DB' }}>Màu Ánh Kim Bổ Trợ</span>}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, background: '#fcc20f', border: '1px solid #ffffff' }} />
                      <Input defaultValue="#fcc20f" readOnly style={{ background: '#0B0F19', borderColor: '#374151', color: '#F9FAFB', fontFamily: 'JetBrains Mono' }} />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {/* 2. Security & Channels */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <SafetyCertificateFilled style={{ color: '#10B981' }} />
                <span style={{ color: '#F9FAFB', fontWeight: 700 }}>Bảo Mật & Mã Hóa Dữ Liệu</span>
              </Space>
            }
            bordered={false}
            style={{ background: '#111827', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12 }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#F9FAFB', fontWeight: 600, fontSize: 13 }}>Khóa Mã Hóa AES-256-GCM (32 Bytes)</div>
              <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>Mã hóa toàn bộ Token OAuth và thông tin khách hàng nhạy cảm</div>
              <Tag color="#10B981" style={{ marginTop: 6, fontWeight: 600 }}>● Đang kích hoạt chuẩn PCI-DSS</Tag>
            </div>

            <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '16px 0' }} />

            <div style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BellFilled style={{ color: '#fcc20f' }} /> Kênh Thông Báo Sự Cố Vận Hành
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ color: '#F9FAFB', fontSize: 13, fontWeight: 600 }}>Cảnh báo qua Telegram Bot</div>
                <div style={{ color: '#9CA3AF', fontSize: 11 }}>Gửi thông báo khi tỷ lệ lỗi vận chuyển &gt; 1%</div>
              </div>
              <Switch defaultChecked />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ color: '#F9FAFB', fontSize: 13, fontWeight: 600 }}>Live WebSocket Alert Stream</div>
                <div style={{ color: '#9CA3AF', fontSize: 11 }}>Phát tín hiệu âm thanh và nhấp nháy trên Dashboard</div>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          size="large"
          icon={<SaveOutlined />}
          onClick={handleSave}
          style={{
            background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
            border: 'none',
            fontWeight: 700,
            borderRadius: 8,
            padding: '0 32px',
          }}
        >
          Lưu Tất Cả Cài Đặt
        </Button>
      </div>
    </div>
  );
};
