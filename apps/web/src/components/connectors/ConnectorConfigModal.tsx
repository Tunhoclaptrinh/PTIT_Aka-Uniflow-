import React, { useState } from 'react';
import { Form, Input, Switch, Space, Divider, Row, Col } from 'antd';
import {
  SettingFilled,
  CopyOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { FormModal } from '../base/FormModal';
import { BaseButton } from '../base/BaseButton';
import { useAuthStore } from '../../store/useAuthStore';
import { tenantService } from '../../services/tenant.service';
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
  const { user } = useAuthStore();
  const currentTenantId = user?.tenantId || '66c0e812a1b2c3d4e5f60001';

  if (!connector) return null;

  const webhookUrl = `http://localhost:3000/api/v1/webhooks/${connector.id.toLowerCase()}/${currentTenantId}`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    notify.success('Đã sao chép Webhook URL vào clipboard!');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    notify.loading(`Đang kiểm tra kết nối API tới ${connector.name}...`, 'testConn');
    try {
      const res = await tenantService.testConnector(connector.id);
      notify.success(
        `Kết nối API tới ${connector.name} thành công! (Latency: ${res.latencyMs}ms, Handshake: ${res.handshakeSignature}, OAuth: ${res.oauthTokenStatus}) ✅`
      );
    } catch (err: any) {
      notify.error('Lỗi khi kiểm tra kết nối: ' + err.message);
    } finally {
      setTesting(false);
    }
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
        <Space size={8}>
          <SettingFilled style={{ color: '#ed1c24' }} />
          <span style={{ fontWeight: 700 }}>Cấu Hình Cổng Kết Nối: {connector.name}</span>
        </Space>
      }
      submitText="Lưu cấu hình"
      cancelText="Hủy bỏ"
    >
      <div style={{ marginBottom: 16, color: '#6B7280', fontSize: 13, lineHeight: 1.5 }}>
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
              fontSize: 12,
              flex: 1,
              background: '#F9FAFB',
            }}
          />
          <BaseButton
            variant="secondary"
            size="middle"
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
            <Input placeholder="Nhập App Key / Client ID..." />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="App Secret (HMAC-SHA256)" name="appSecret">
            <Input.Password placeholder="Nhập App Secret..." />
          </Form.Item>
        </Col>
      </Row>

      <Divider style={{ margin: '12px 0 16px 0' }} />

      {/* Kích hoạt Switch Card */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
            Kích Hoạt Tự Động Xử Lý Đơn
          </div>
          <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
            Tự động tiếp nhận webhook và chuyển tiếp vào luồng UDM Schema
          </div>
        </div>
        <Switch defaultChecked />
      </div>

      {/* Test Connection Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <BaseButton
          variant="secondary"
          size="middle"
          icon={<ThunderboltFilled style={{ color: '#F59E0B' }} />}
          loading={testing}
          onClick={handleTestConnection}
        >
          Kiểm Tra Kết Nối (Ping)
        </BaseButton>
      </div>
    </FormModal>
  );
};
