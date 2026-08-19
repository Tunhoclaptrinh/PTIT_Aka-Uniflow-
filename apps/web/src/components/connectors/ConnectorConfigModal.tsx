import React, { useState } from 'react';
import { Form, Input, Switch, Space, Divider, Row, Col, Tag } from 'antd';
import {
  SettingFilled,
  CopyOutlined,
  ThunderboltFilled,
  CheckCircleFilled,
} from '@ant-design/icons';
import { FormModal } from '../base/FormModal';
import { BaseButton } from '../base/BaseButton';
import { useAuthStore } from '../../store/useAuthStore';
import { tenantService } from '../../services/tenant.service';
import { notify } from '../../utils/notification';
import { getPartnerLogo } from '../../utils/partnerLogos';

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
  const [testResult, setTestResult] = useState<any>(null);
  const { user } = useAuthStore();

  if (!connector) return null;

  const partnerLogo = getPartnerLogo(connector.id || connector.name);
  const webhookUrl = `https://api.uniflow.vn/v1/webhooks/${user?.tenantId || 'tenant_live'}/${connector.id}`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    notify.success('Đã sao chép Webhook URL vào clipboard!');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    notify.loading(`Đang gửi gói tin probe kiểm tra tới ${connector.name}...`, 'testConn');
    try {
      const res = await tenantService.testConnector(connector.id, connector.appKey, connector.endpoint);
      setTestResult(res);
      notify.success(
        `Kết nối máy chủ ${connector.name} thành công! (Độ trễ mạng: ${res.latencyMs}ms, HTTP ${res.httpStatusCode || 200}) ✅`
      );
    } catch (err: any) {
      notify.error('Lỗi khi kiểm tra kết nối: ' + err.message);
    } finally {
      setTesting(false);
    }
  };

  const handleFinish = async (values: any) => {
    if (onSave) {
      onSave({
        ...connector,
        ...values,
      });
    }
    notify.success(`Đã lưu cấu hình kết nối ${connector.name} thành công!`);
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={() => {
        setTestResult(null);
        onClose();
      }}
      onSubmit={handleFinish}
      initialValues={{
        appKey: connector.appKey || 'uni_app_live_89a7f31c',
        appSecret: connector.appSecret || 'sec_live_994821a0fbfd72',
        endpoint: connector.endpoint || '',
      }}
      width={640}
      title={
        <Space size={8}>
          {partnerLogo ? (
            <img
              src={partnerLogo}
              alt={connector.name}
              style={{ width: 22, height: 22, objectFit: 'contain' }}
            />
          ) : (
            <SettingFilled style={{ color: '#ed1c24' }} />
          )}
          <span style={{ fontWeight: 600 }}>Cấu hình cổng kết nối: {connector.name}</span>
        </Space>
      }
      submitText="Lưu cấu hình"
      cancelText="Hủy bỏ"
    >
      <div style={{ marginBottom: 16, color: '#6B7280', fontSize: 13, lineHeight: 1.5 }}>
        {connector.description}
      </div>

      {/* Webhook Inbound URL */}
      <Form.Item label="Đường dẫn Webhook nhận dữ liệu (Inbound URL)">
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
            Sao chép
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
            Kích hoạt tự động xử lý đơn
          </div>
          <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
            Tự động tiếp nhận webhook và chuyển tiếp vào luồng UDM Schema
          </div>
        </div>
        <Switch defaultChecked />
      </div>

      {/* Live Test Connection & Result Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <BaseButton
            variant="secondary"
            size="middle"
            icon={<ThunderboltFilled style={{ color: '#F59E0B' }} />}
            loading={testing}
            onClick={handleTestConnection}
          >
            Kiểm tra kết nối thực tế (Live Ping)
          </BaseButton>
        </div>

        {testResult && (
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: '12px 14px',
              fontSize: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Space size="small">
                <CheckCircleFilled style={{ color: '#10B981', fontSize: 14 }} />
                <span style={{ fontWeight: 600, color: '#0F172A' }}>Kết quả kiểm tra mạng thời gian thực:</span>
              </Space>
              <Tag color={testResult.latencyMs < 200 ? 'success' : 'warning'} style={{ fontWeight: 700 }}>
                Độ trễ: {testResult.latencyMs}ms
              </Tag>
            </div>

            <Row gutter={[12, 6]} style={{ color: '#475569' }}>
              <Col span={12}>
                <span>Máy chủ phản hồi: </span>
                <strong style={{ color: '#0F172A' }}>{testResult.remoteServer || 'Cloudflare Gateway'}</strong>
              </Col>
              <Col span={12}>
                <span>Trạng thái HTTP: </span>
                <strong style={{ color: '#10B981' }}>{testResult.httpStatusCode || 200} OK</strong>
              </Col>
              <Col span={12}>
                <span>Điểm cuối (Endpoint): </span>
                <strong style={{ color: '#0284C7', fontFamily: 'JetBrains Mono' }}>{testResult.endpoint}</strong>
              </Col>
              <Col span={12}>
                <span>Chữ ký HMAC: </span>
                <strong style={{ color: '#6366F1', fontFamily: 'JetBrains Mono' }}>{testResult.handshakeSignature}</strong>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </FormModal>
  );
};

export default ConnectorConfigModal;
