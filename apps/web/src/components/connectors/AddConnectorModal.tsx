import React, { useState } from 'react';
import { Form, Input, Select, Space, Row, Col, Divider, Tag } from 'antd';
import {
  PlusCircleFilled,
  ThunderboltFilled,
  CheckCircleFilled,
} from '@ant-design/icons';
import { FormModal } from '../base/FormModal';
import { BaseButton } from '../base/BaseButton';
import { tenantService } from '../../services/tenant.service';
import { notify } from '../../utils/notification';
import { getPartnerLogo } from '../../utils/partnerLogos';

export interface AddConnectorModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newConnector: any) => void;
}

const PRESET_PLATFORMS = [
  { label: 'Tiki Open Platform (Sàn TMĐT)', value: 'tiki', category: 'MARKETPLACE', brandColor: '#1A94FF', desc: 'Đồng bộ đơn hàng sàn Tiki qua OpenAPI v2' },
  { label: 'WooCommerce Store (E-Commerce Web)', value: 'woocommerce', category: 'MARKETPLACE', brandColor: '#96588A', desc: 'Nhận REST Webhook đơn hàng WooCommerce WordPress' },
  { label: 'Shopify Store (Global E-Commerce)', value: 'shopify', category: 'MARKETPLACE', brandColor: '#96BF48', desc: 'Đồng bộ đơn hàng quốc tế và quản lý kho Shopify' },
  { label: 'MISA eShop (Quản lý bán lẻ)', value: 'misa', category: 'POS_ERP', brandColor: '#0070BA', desc: 'Tự động trừ tồn kho và đồng bộ hóa đơn điện tử MISA' },
  { label: 'J&T Express API (Đơn vị vận chuyển)', value: 'jtexpress', category: 'LOGISTICS', brandColor: '#EE1D23', desc: 'Tạo vận đơn và tra cứu hành trình J&T Express toàn quốc' },
  { label: 'Custom Webhook Inbound (Tự cấu hình)', value: 'custom_webhook', category: 'MARKETPLACE', brandColor: '#6366F1', desc: 'Tự cấu hình điểm nhận Webhook JSON thô chuẩn UDM' },
];

export const AddConnectorModal: React.FC<AddConnectorModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [form] = Form.useForm();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const handleSelectPreset = (presetId: string) => {
    const selected = PRESET_PLATFORMS.find((p) => p.value === presetId);
    if (selected) {
      form.setFieldsValue({
        id: selected.value,
        name: selected.label.split(' (')[0],
        category: selected.category,
        brandColor: selected.brandColor,
        description: selected.desc,
      });
    }
  };

  const handleTestPing = async () => {
    const endpoint = form.getFieldValue('endpoint') || 'https://api.github.com';
    const connectorId = form.getFieldValue('id') || 'custom_webhook';
    const appKey = form.getFieldValue('appKey') || 'test_key';

    setTesting(true);
    setTestResult(null);
    notify.loading('Đang kiểm tra kết nối tới máy chủ đối tác...', 'testNewConn');
    try {
      const res = await tenantService.testConnector(connectorId, appKey, endpoint);
      setTestResult(res);
      notify.success(`Kiểm tra kết nối thành công! Độ trễ: ${res.latencyMs}ms (HTTP ${res.httpStatusCode || 200}) ✅`);
    } catch (err: any) {
      notify.error('Lỗi khi kiểm tra kết nối: ' + err.message);
    } finally {
      setTesting(false);
    }
  };

  const handleFinish = (values: any) => {
    const categoryLabels: Record<string, string> = {
      MARKETPLACE: 'Sàn TMĐT',
      POS_ERP: 'Quản lý kho POS',
      LOGISTICS: 'Đơn vị vận chuyển',
    };

    const newConnector = {
      id: values.id || `conn_${Date.now()}`,
      name: values.name,
      category: values.category,
      categoryLabel: categoryLabels[values.category] || 'Kênh kết nối',
      status: 'CONNECTED',
      ordersSynced: 0,
      latency: testResult ? `${testResult.latencyMs}ms` : '160ms',
      brandColor: values.brandColor || '#6366F1',
      description: values.description || 'Kênh tích hợp tự động qua UDM Pipeline',
      appKey: values.appKey,
      appSecret: values.appSecret,
      endpoint: values.endpoint,
    };

    onAdd(newConnector);
    notify.success(`Đã thêm thành công cổng kết nối ${newConnector.name}.`);
    form.resetFields();
    setTestResult(null);
    onClose();
  };

  return (
    <FormModal
      open={open}
      onClose={() => {
        form.resetFields();
        setTestResult(null);
        onClose();
      }}
      onSubmit={handleFinish}
      initialValues={{
        id: 'tiki',
        name: 'Tiki Open Platform',
        category: 'MARKETPLACE',
        brandColor: '#1A94FF',
        description: 'Đồng bộ đơn hàng sàn Tiki qua OpenAPI v2',
        appKey: 'tiki_app_live_9942',
        appSecret: 'sec_tiki_89a0b1c2d3e4',
      }}
      width={640}
      title={
        <Space size={8}>
          <PlusCircleFilled style={{ color: '#ed1c24' }} />
          <span style={{ fontWeight: 600 }}>Thêm cổng kết nối mới</span>
        </Space>
      }
      submitText="Tạo kết nối"
      cancelText="Hủy bỏ"
    >
      <Form form={form} layout="vertical">
        {/* Preset Selection */}
        <Form.Item label="Chọn mẫu nền tảng có sẵn (Templates)">
          <Select
            placeholder="Chọn nền tảng để tự động điền cấu hình..."
            onChange={handleSelectPreset}
            defaultValue="tiki"
            options={PRESET_PLATFORMS.map((p) => {
              const logo = getPartnerLogo(p.value);
              return {
                label: (
                  <Space size={6}>
                    {logo && (
                      <img
                        src={logo}
                        alt={p.value}
                        style={{ width: 16, height: 16, objectFit: 'contain' }}
                      />
                    )}
                    <span>{p.label}</span>
                  </Space>
                ),
                value: p.value,
              };
            })}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={14}>
            <Form.Item
              label="Tên hiển thị cổng kết nối"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên cổng kết nối!' }]}
            >
              <Input placeholder="Ví dụ: Tiki Open Platform..." />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Mã định danh (ID)" name="id">
              <Input placeholder="tiki, shopify, misa..." style={{ fontFamily: 'JetBrains Mono' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={14}>
            <Form.Item label="Phân loại đối tác" name="category">
              <Select
                options={[
                  { label: 'Sàn TMĐT (Marketplace)', value: 'MARKETPLACE' },
                  { label: 'Quản lý kho POS (POS/ERP)', value: 'POS_ERP' },
                  { label: 'Đơn vị vận chuyển (Logistics)', value: 'LOGISTICS' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Màu thương hiệu (Hex)" name="brandColor">
              <Input placeholder="#1A94FF" style={{ fontFamily: 'JetBrains Mono' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả chức năng luồng" name="description">
          <Input.TextArea rows={2} placeholder="Mô tả chức năng kết nối và đồng bộ..." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="App Key / Client ID" name="appKey">
              <Input placeholder="Nhập App Key / Client ID..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="App Secret (Bảo mật HMAC)" name="appSecret">
              <Input.Password placeholder="Nhập App Secret..." />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Điểm cuối API máy chủ đối tác (API Endpoint)" name="endpoint">
          <Input placeholder="https://api.tiki.vn hoặc https://partner.viettelpost.vn..." />
        </Form.Item>

        <Divider style={{ margin: '12px 0 16px 0' }} />

        {/* Live Ping Tester */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <BaseButton
              variant="secondary"
              size="middle"
              icon={<ThunderboltFilled style={{ color: '#F59E0B' }} />}
              loading={testing}
              onClick={handleTestPing}
            >
              Kiểm tra kết nối máy chủ (Live Ping)
            </BaseButton>
          </div>

          {testResult && (
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space size="small">
                  <CheckCircleFilled style={{ color: '#10B981' }} />
                  <span style={{ fontWeight: 600 }}>Máy chủ phản hồi tốt:</span>
                </Space>
                <Tag color="success" style={{ fontWeight: 700 }}>
                  {testResult.latencyMs}ms (HTTP {testResult.httpStatusCode || 200})
                </Tag>
              </div>
            </div>
          )}
        </div>
      </Form>
    </FormModal>
  );
};

export default AddConnectorModal;
