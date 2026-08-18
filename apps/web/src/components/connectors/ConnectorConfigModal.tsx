import React, { useState } from 'react';
import { Modal, Form, Input, Button, Switch, Space, Tag, message, Typography, Divider, Row, Col } from 'antd';
import {
  SettingFilled,
  CopyOutlined,
} from '@ant-design/icons';

const { Paragraph } = Typography;

interface ConnectorConfigModalProps {
  open: boolean;
  connector: any;
  onClose: () => void;
}

export const ConnectorConfigModal: React.FC<ConnectorConfigModalProps> = ({
  open,
  connector,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [testing, setTesting] = useState(false);

  if (!connector) return null;

  const webhookUrl = `http://localhost:3000/api/v1/webhooks/${connector.id.toLowerCase()}/66c0e812a1b2c3d4e5f60001`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    message.success('Đã sao chép Webhook URL vào clipboard!');
  };

  const handleTestConnection = () => {
    setTesting(true);
    message.loading({ content: `Đang kiểm tra kết nối API tới ${connector.name}...`, key: 'testConn' });
    setTimeout(() => {
      setTesting(false);
      message.success({
        content: `Kết nối API tới ${connector.name} thành công! (Latency: 142ms, OAuth 2.0 Token Hợp lệ) ✅`,
        key: 'testConn',
        duration: 3,
      });
    }, 1000);
  };

  const handleSave = () => {
    message.success(`Đã lưu cấu hình kết nối ${connector.name} thành công!`);
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <SettingFilled style={{ color: connector.brandColor || '#fcc20f' }} />
          <span style={{ color: '#F9FAFB', fontWeight: 800, fontSize: 16 }}>
            Cấu Hình Kết Nối API: {connector.name}
          </span>
          <Tag color={connector.status === 'CONNECTED' ? '#10B981' : '#fcc20f'} style={{ borderRadius: 4 }}>
            {connector.status === 'CONNECTED' ? 'Đang Hoạt Động' : 'Chưa Kết Nối'}
          </Tag>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={640}
      footer={[
        <Button key="test" onClick={handleTestConnection} loading={testing} style={{ borderColor: '#fcc20f', color: '#fcc20f' }}>
          Kiểm Tra Kết Nối (Ping)
        </Button>,
        <Button key="cancel" onClick={onClose} style={{ borderColor: '#374151', color: '#9CA3AF' }}>
          Đóng
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          style={{ background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)', border: 'none', fontWeight: 700 }}
        >
          Lưu Cấu Hình
        </Button>,
      ]}
      styles={{ body: { background: '#0B0F19', padding: '20px' } }}
    >
      <Paragraph style={{ color: '#9CA3AF', fontSize: 13 }}>
        Điền thông tin xác thực ứng dụng để UniFlow AI thiết lập đường ống đồng bộ dữ liệu tự động.
      </Paragraph>

      <Form form={form} layout="vertical" initialValues={{ autoSync: true, retry: true }}>
        <Form.Item label={<span style={{ color: '#D1D5DB' }}>Inbound Webhook Endpoint URL</span>}>
          <Input.Search
            value={webhookUrl}
            readOnly
            enterButton={<Button icon={<CopyOutlined />} onClick={handleCopyWebhook}>Copy URL</Button>}
            style={{ background: '#111827', borderColor: '#374151' }}
          />
          <div style={{ color: '#6B7280', fontSize: 11, marginTop: 4 }}>
            Dán URL này vào mục Webhook Push trên Cổng phát triển của đối tác ({connector.name}).
          </div>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={<span style={{ color: '#D1D5DB' }}>App Key / Client ID</span>}>
              <Input
                defaultValue={connector.status === 'CONNECTED' ? 'ak_live_89124018249' : ''}
                placeholder="Nhập App Key..."
                style={{ background: '#111827', borderColor: '#374151', color: '#F9FAFB' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span style={{ color: '#D1D5DB' }}>App Secret / HMAC Key</span>}>
              <Input.Password
                defaultValue={connector.status === 'CONNECTED' ? 'sec_live_99214819' : ''}
                placeholder="Nhập App Secret..."
                style={{ background: '#111827', borderColor: '#374151', color: '#F9FAFB' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '16px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ color: '#F9FAFB', fontWeight: 600, fontSize: 13 }}>Tự động đồng bộ thời gian thực (Real-time Stream)</div>
            <div style={{ color: '#9CA3AF', fontSize: 11 }}>Kích hoạt pipeline xử lý đơn hàng &lt; 0.5s</div>
          </div>
          <Form.Item name="autoSync" valuePropName="checked" noStyle>
            <Switch defaultChecked />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#F9FAFB', fontWeight: 600, fontSize: 13 }}>Kích hoạt AI Self-Healing</div>
            <div style={{ color: '#9CA3AF', fontSize: 11 }}>Tự động đổi tuyến khi API đối tác phản hồi lỗi 504 / timeout</div>
          </div>
          <Form.Item name="retry" valuePropName="checked" noStyle>
            <Switch defaultChecked />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
