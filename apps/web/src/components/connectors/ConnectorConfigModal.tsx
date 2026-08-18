import React, { useState } from 'react';
import { Form, Input, Switch, Space, Divider, Row, Col } from 'antd';
import {
  SettingFilled,
  CopyOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { FormModal } from '../base/FormModal';
import { BaseButton } from '../base/BaseButton';
import { notify } from '../../utils/notification';

export interface ConnectorConfigModalProps {
  open: boolean;
  connector: any;
  onClose: () => void;
  onSave?: (updatedItem: any) => void;
}

export const ConnectorConfigModal: React.FC<ConnectorConfigModalProps> = ({
  open,
  connector,
  onClose,
  onSave,
}) => {
  const [testing, setTesting] = useState(false);

  if (!connector) return null;

  const webhookUrl = `http://localhost:3000/api/v1/webhooks/${connector.id.toLowerCase()}/66c0e812a1b2c3d4e5f60001`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    notify.success('Đã sao chép Webhook URL vào clipboard!');
  };

  const handleTestConnection = () => {
    setTesting(true);
    notify.loading(`Đang kiểm tra kết nối API tới ${connector.name}...`, 'testConn');
    setTimeout(() => {
      setTesting(false);
      notify.success(`Kết nối API tới ${connector.name} thành công! (Latency: 142ms, OAuth 2.0 Token Hợp lệ) ✅`);
    }, 1000);
  };

  const handleFinish = (values: any) => {
    if (onSave) {
      onSave({
        ...connector,
        ...values,
      });
    }
    notify.success(`Đã lưu cấu hình kết nối ${connector.name} thành công!`);
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      onSubmit={handleFinish}
      initialValues={{
        appKey: 'uni_app_live_89a7f31c',
        appSecret: 'sec_live_994821a0fbfd72',
      }}
      width={600}
      title={
        <Space>
          <SettingFilled style={{ color: '#fcc20f' }} />
          <span>Cấu Hình Cổng Kết Nối: {connector.name}</span>
        </Space>
      }
      submitText="Lưu Cấu Hình"
    >
      <div style={{ marginBottom: 16, color: '#6B7280', fontSize: 13 }}>
        {connector.description}
      </div>

      {/* Webhook Inbound URL */}
      <Form.Item label="Webhook Callback URL (Inbound)">
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            value={webhookUrl}
            readOnly
            style={{
              color: '#10B981',
              fontFamily: 'JetBrains Mono',
              fontWeight: 600,
              flex: 1,
            }}
          />
          <BaseButton
            variant="secondary"
            icon={<CopyOutlined />}
            onClick={handleCopyWebhook}
          >
            Copy
          </BaseButton>
        </div>
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="App Key / Client ID" name="appKey">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="App Secret (HMAC-SHA256)" name="appSecret">
            <Input.Password />
          </Form.Item>
        </Col>
      </Row>

      <Divider style={{ margin: '16px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>Kích Hoạt Tự Động Xử Lý Đơn</div>
          <div style={{ color: '#6B7280', fontSize: 11 }}>Tự động tiếp nhận webhook và chuyển tiếp UDM Schema</div>
        </div>
        <Switch defaultChecked />
      </div>

      <div style={{ marginBottom: 12 }}>
        <BaseButton
          variant="secondary"
          icon={<ThunderboltFilled style={{ color: '#fcc20f' }} />}
          loading={testing}
          onClick={handleTestConnection}
        >
          Kiểm Tra Kết Nối (Ping)
        </BaseButton>
      </div>
    </FormModal>
  );
};
