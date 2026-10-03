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
  // ── SẴN SÀNG PRODUCTION (ĐÃ KẾT NỐI API THỰC TẾ & CHẠY NGAY) ───────────────
  { label: 'Sapo OmniChannel / Web POS', value: 'sapo', category: 'POS_ERP', brandColor: '#0088FF', readiness: 'PRODUCTION_READY', desc: 'Đồng bộ đơn hàng, tồn kho và sản phẩm qua Sapo REST API', endpoint: 'https://core.sapo.vn' },
  { label: 'Nhanh.vn Cloud POS (API v2.0)', value: 'nhanh', category: 'POS_ERP', brandColor: '#FF6600', readiness: 'PRODUCTION_READY', desc: 'Đồng bộ đa kênh với Nhanh.vn qua Open API v2.0', endpoint: 'https://open.nhanh.vn/api' },
  { label: 'Pancake POS & Social Chat', value: 'pancake', category: 'CHAT_SOCIAL', brandColor: '#2563EB', readiness: 'PRODUCTION_READY', desc: 'Đồng bộ tin nhắn Fanpage Facebook, Zalo OA và chốt đơn Pancake', endpoint: 'https://pages.fm/api/v1' },
  { label: 'Shopee Open Platform (API v2)', value: 'shopee', category: 'MARKETPLACE', brandColor: '#EE4D2D', readiness: 'PRODUCTION_READY', desc: 'Đồng bộ đơn hàng, kho và trạng thái giao hàng Shopee v2', endpoint: 'https://partner.shopeemobile.com' },
  { label: 'TikTok Shop Partner API', value: 'tiktok', category: 'MARKETPLACE', brandColor: '#000000', readiness: 'PRODUCTION_READY', desc: 'Inbound Webhook tức thì và đồng bộ đơn TikTok Shop', endpoint: 'https://auth.tiktok-shops.com' },
  { label: 'MISA meInvoice & AMIS CRM', value: 'misa', category: 'ACCOUNTING', brandColor: '#0070BA', readiness: 'PRODUCTION_READY', desc: 'Tự động phát hành hóa đơn điện tử hợp lệ và đồng bộ chứng từ thuế', endpoint: 'https://www.misa.vn' },
  { label: 'Telegram Alert Bot', value: 'telegram', category: 'CHAT_SOCIAL', brandColor: '#24A1DE', readiness: 'PRODUCTION_READY', desc: 'Nhận báo cáo đơn hàng, cảnh báo lỗi và phê duyệt 1-click', endpoint: 'https://api.telegram.org' },
  { label: 'Custom Webhook Inbound (Tự cấu hình)', value: 'custom_webhook', category: 'MARKETPLACE', brandColor: '#6366F1', readiness: 'PRODUCTION_READY', desc: 'Tự cấu hình điểm nhận Webhook JSON thô chuẩn UDM', endpoint: 'https://api.uniflow.vn' },

  // ── ĐƠN VỊ VẬN CHUYỂN (CẦN TOKEN ĐỐI TÁC DOANH NGHIỆP) ──────────────────────
  { label: 'Giao Hàng Tiết Kiệm (GHTK)', value: 'ghtk', category: 'LOGISTICS', brandColor: '#006837', readiness: 'BETA', desc: 'Tạo vận đơn và tra cứu hành trình GHTK (cần Carrier Token)', endpoint: 'https://services.giaohangtietkiem.vn' },
  { label: 'Giao Hàng Nhanh (GHN Express)', value: 'ghn', category: 'LOGISTICS', brandColor: '#F26522', readiness: 'BETA', desc: 'Đẩy đơn vận chuyển GHN Express (cần ShopID & Token)', endpoint: 'https://online-gateway.ghn.vn/shiip/public-api' },
  { label: 'Viettel Post Logistics', value: 'viettelpost', category: 'LOGISTICS', brandColor: '#EE0033', readiness: 'BETA', desc: 'Tích hợp dịch vụ chuyển phát Viettel Post (cần Access Token)', endpoint: 'https://partner.viettelpost.vn/v2' },
  { label: 'J&T Express API', value: 'jtexpress', category: 'LOGISTICS', brandColor: '#EE1D23', readiness: 'BETA', desc: 'Tạo vận đơn và tra cứu hành trình J&T Express toàn quốc', endpoint: 'https://api.jtexpress.vn' },

  // ── ĐANG PHÁT TRIỂN / SẮP RA MẮT (CHỜ DUYỆT OAUTH2 & APP PARTNER) ───────────
  { label: 'KiotViet Cloud Retail', value: 'kiotviet', category: 'POS_ERP', brandColor: '#0070BA', readiness: 'IN_DEVELOPMENT', desc: 'Đang phát triển adapter OAuth2 B2B token refresh', endpoint: 'https://public.kiotapi.com' },
  { label: 'Haravan Omnichannel', value: 'haravan', category: 'POS_ERP', brandColor: '#FF5722', readiness: 'IN_DEVELOPMENT', desc: 'Đang phát triển quy trình OAuth2 handshake với Haravan App', endpoint: 'https://api.haravan.com/com' },
  { label: 'Lazada Open API', value: 'lazada', category: 'MARKETPLACE', brandColor: '#0F146D', readiness: 'IN_DEVELOPMENT', desc: 'Đang phát triển xác thực gian hàng Lazada Mall Seller', endpoint: 'https://api.lazada.vn/rest' },
  { label: 'Tiki Open Platform', value: 'tiki', category: 'MARKETPLACE', brandColor: '#1A94FF', readiness: 'IN_DEVELOPMENT', desc: 'Đang phát triển tích hợp Tiki Seller OpenAPI v2', endpoint: 'https://api.tiki.vn' },
  { label: 'Zalo OA & ZNS Notification', value: 'zalo', category: 'CHAT_SOCIAL', brandColor: '#0068FF', readiness: 'IN_DEVELOPMENT', desc: 'Đang chờ cấp phép Zalo App ID và duyệt mẫu ZNS', endpoint: 'https://openapi.zalo.me/v2.0' },
  { label: 'Fast Accounting Online', value: 'fast_acc', category: 'ACCOUNTING', brandColor: '#E65100', readiness: 'IN_DEVELOPMENT', desc: 'Đang phát triển kết nối hạch toán chứng từ kế toán', endpoint: 'https://fast.com.vn' },
  { label: 'WooCommerce Store (WordPress)', value: 'woocommerce', category: 'MARKETPLACE', brandColor: '#96588A', readiness: 'IN_DEVELOPMENT', desc: 'Đang hoàn thiện REST API 2 chiều cho WordPress', endpoint: 'https://woocommerce.com' },
  { label: 'Shopify Store (Global E-Commerce)', value: 'shopify', category: 'MARKETPLACE', brandColor: '#96BF48', readiness: 'IN_DEVELOPMENT', desc: 'Đang hoàn thiện ứng dụng Private App Shopify', endpoint: 'https://shopify.dev' },
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
        endpoint: selected.endpoint || '',
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
      POS_ERP: 'Quản lý kho POS & ERP',
      LOGISTICS: 'Đơn vị vận chuyển',
      ACCOUNTING: 'Kế toán & Thuế',
      CHAT_SOCIAL: 'CSKH & Hội thoại',
      SPREADSHEET: 'Bảng tính & Excel',
      LANDING_PAGE: 'Landing Page & Form',
    };

    const newConnector = {
      id: values.id || `conn_${Date.now()}`,
      name: values.name,
      category: values.category,
      categoryLabel: categoryLabels[values.category] || 'Kênh kết nối',
      status: 'CONNECTED',
      ordersSynced: 0,
      latency: testResult ? `${testResult.latencyMs}ms` : '--',
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
        id: 'sapo',
        name: 'Sapo OmniChannel / Web POS',
        category: 'POS_ERP',
        brandColor: '#0088FF',
        description: 'Đồng bộ đơn hàng, tồn kho và sản phẩm qua Sapo REST API',
        endpoint: 'https://core.sapo.vn',
      }}
      width={680}
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
            defaultValue="sapo"
            options={PRESET_PLATFORMS.map((p) => {
              const logo = getPartnerLogo(p.value);
              const tagColor =
                p.readiness === 'PRODUCTION_READY'
                  ? 'success'
                  : p.readiness === 'BETA'
                  ? 'processing'
                  : 'warning';
              const tagText =
                p.readiness === 'PRODUCTION_READY'
                  ? '✓ Hoạt động'
                  : p.readiness === 'BETA'
                  ? 'Cần Token'
                  : 'Đang phát triển';

              return {
                label: (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                      {logo ? (
                        <img
                          src={logo}
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                            const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                          style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0 }}
                        />
                      ) : null}
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 3,
                          background: p.brandColor || '#6366F1',
                          color: '#FFFFFF',
                          display: logo ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {p.label.charAt(0)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.label}
                      </span>
                    </div>
                    <Tag color={tagColor} style={{ fontSize: 10, margin: 0, padding: '0 4px', borderRadius: 3, flexShrink: 0 }}>
                      {tagText}
                    </Tag>
                  </div>
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
