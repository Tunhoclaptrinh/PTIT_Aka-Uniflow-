import React, { useState } from 'react';
import {
  Form,
  Input,
  Switch,
  Space,
  Divider,
  Row,
  Col,
  Tag,
  Select,
} from 'antd';
import {
  SettingFilled,
  CopyOutlined,
  ThunderboltFilled,
  CheckCircleFilled,
  AuditOutlined,
  ShopOutlined,
  CarFilled,
  MessageFilled,
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
  const category = (connector.category || '').toUpperCase();
  const isAccounting = category === 'ACCOUNTING' || connector.id?.includes('misa') || connector.id?.includes('fast') || connector.id?.includes('bravo');
  const isLogistics = category === 'LOGISTICS' || connector.id?.includes('ghtk') || connector.id?.includes('ghn') || connector.id?.includes('viettel');
  const isPos = category === 'POS_ERP' || connector.id?.includes('sapo') || connector.id?.includes('kiot') || connector.id?.includes('nhanh');
  const isChat = category === 'CHAT_SOCIAL' || connector.id?.includes('pancake') || connector.id?.includes('zalo') || connector.id?.includes('telegram');

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
        `Kết nối máy chủ ${connector.name} thành công! (Độ trễ mạng: ${res.latencyMs}ms, HTTP ${res.httpStatusCode || 200} OK)`
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
    notify.success(`Đã lưu cấu hình chuyên biệt cho cổng ${connector.name} thành công!`);
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
        taxCode: '0109887766',
        invoiceSerial: '1C25TKK',
        invoiceTemplate: '1/001',
        vatRate: '1_PERCENT_ECOMMERCE',
        autoIssueOn: 'DELIVERED',
        signingType: 'CLOUD_HSM',
        accountDebit: '1121',
        accountCredit: '5111',
        accountVat: '33311',
        warehouseBranch: 'WH_MAIN_HN',
        deductStrategy: 'INSTANT_AVAILABLE',
        shippingPriority: 'CHEAPEST_AUTO',
        autoPrintWaybill: true,
      }}
      width={720}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 20 }}>
          <Space size={8}>
            {partnerLogo ? (
              <img
                src={partnerLogo}
                alt={connector.name}
                style={{ width: 22, height: 22, objectFit: 'contain' }}
              />
            ) : (
              <SettingFilled style={{ color: '#8B5CF6' }} />
            )}
            <span style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>
              Quản lý Cổng Kết Nối: {connector.name}
            </span>
          </Space>
          <Tag color="purple" style={{ margin: 0, borderRadius: 3, fontWeight: 600 }}>
            {connector.categoryLabel || connector.category}
          </Tag>
        </div>
      }
      submitText="Lưu cấu hình cổng"
      cancelText="Hủy bỏ"
    >
      <div style={{ marginBottom: 14, color: '#64748B', fontSize: 12.5, lineHeight: 1.5 }}>
        {connector.description}
      </div>

      {/* ========================================================================= */}
      {/* 1. CHUYÊN MỤC DÀNH RIÊNG CHO KẾ TOÁN & HÓA ĐƠN ĐIỆN TỬ (MISA meInvoice / AMIS) */}
      {/* ========================================================================= */}
      {isAccounting && (
        <div
          style={{
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            borderRadius: 8,
            padding: '14px 16px',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AuditOutlined style={{ color: '#0284C7', fontSize: 16 }} />
            <strong style={{ fontSize: 13.5, color: '#0369A1' }}>
              Cấu hình Kế toán & Hóa đơn Điện tử Chuyên biệt (MISA meInvoice / AMIS)
            </strong>
          </div>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="Mã số thuế Doanh nghiệp" name="taxCode" rules={[{ required: true }]}>
                <Input placeholder="VD: 0109887766" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Ký hiệu hóa đơn" name="invoiceSerial" rules={[{ required: true }]}>
                <Input placeholder="VD: 1C25TKK" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Hình thức Ký số" name="signingType">
                <Select
                  options={[
                    { label: 'Ký số Cloud HSM MISA', value: 'CLOUD_HSM' },
                    { label: 'USB Token Chữ ký số', value: 'USB_TOKEN' },
                    { label: 'Viettel-CA / VNPT-CA', value: 'EXTERNAL_CA' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Chính sách Thuế TMĐT (Nghị định 117/2025/NĐ-CP)" name="vatRate">
                <Select
                  options={[
                    { label: 'Thuế GTGT 1% + TNCN 0.5% (Phân phối TMĐT TT 40/2021)', value: '1_PERCENT_ECOMMERCE' },
                    { label: 'Thuế GTGT 8% (Giảm thuế theo Nghị quyết Quốc hội)', value: '8_PERCENT' },
                    { label: 'Thuế GTGT 10% (Thuế suất chuẩn)', value: '10_PERCENT' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thời điểm tự động phát hành HĐĐT" name="autoIssueOn">
                <Select
                  options={[
                    { label: 'Khi đơn hàng Giao thành công (DELIVERED)', value: 'DELIVERED' },
                    { label: 'Khi khách Thanh toán thành công (PAID)', value: 'PAID' },
                    { label: 'Phê duyệt thủ công trước khi ký số', value: 'MANUAL_APPROVAL' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '8px 0 12px' }} />

          <div style={{ fontWeight: 600, fontSize: 12, color: '#334155', marginBottom: 8 }}>
            Tài khoản hạch toán sổ cái (MISA AMIS Sổ kế toán):
          </div>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="TK Doanh thu bán hàng" name="accountCredit" style={{ marginBottom: 0 }}>
                <Input placeholder="5111" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="TK Thuế GTGT đầu ra" name="accountVat" style={{ marginBottom: 0 }}>
                <Input placeholder="33311" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="TK Thu hộ tiền sàn / Ví" name="accountDebit" style={{ marginBottom: 0 }}>
                <Input placeholder="1121 / 1388" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CHUYÊN MỤC DÀNH RIÊNG CHO ĐƠN VỊ VẬN CHUYỂN (Viettel Post, GHTK, GHN) */}
      {/* ========================================================================= */}
      {isLogistics && (
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 8,
            padding: '14px 16px',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <CarFilled style={{ color: '#10B981', fontSize: 16 }} />
            <strong style={{ fontSize: 13.5, color: '#15803D' }}>
              Cấu hình Vận chuyển & Giao hàng Chuyên biệt
            </strong>
          </div>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Kho lấy hàng mặc định" name="warehouseBranch">
                <Select
                  options={[
                    { label: 'Kho Tổng Hà Nội (WH_MAIN_HN - Cầu Giấy)', value: 'WH_MAIN_HN' },
                    { label: 'Kho Miền Nam (WH_HCM_Q1 - Quận 1 TP.HCM)', value: 'WH_HCM_Q1' },
                    { label: 'Kho Đà Nẵng (WH_DNG - Hải Châu)', value: 'WH_DNG' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chiến lược chọn dịch vụ" name="shippingPriority">
                <Select
                  options={[
                    { label: 'Tự động chọn gói cước rẻ nhất (Cheapest Rate)', value: 'CHEAPEST_AUTO' },
                    { label: 'Giao hỏa tốc chuẩn SLA 2h - 4h', value: 'FASTEST_EXPRESS' },
                    { label: 'Tuyến trục Bắc - Nam ưu đãi Viettel Post', value: 'MAIN_AXIS' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#334155' }}>Tự động in mã vận đơn A6 ngay khi tạo đơn:</span>
            <Form.Item name="autoPrintWaybill" valuePropName="checked" noStyle>
              <Switch defaultChecked />
            </Form.Item>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CHUYÊN MỤC DÀNH CHO KHO POS / ERP (Sapo, KiotViet, Nhanh.vn) */}
      {/* ========================================================================= */}
      {isPos && (
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: 8,
            padding: '14px 16px',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <ShopOutlined style={{ color: '#D97706', fontSize: 16 }} />
            <strong style={{ fontSize: 13.5, color: '#B45309' }}>
              Cấu hình Trừ Tồn Kho POS & Đa Chi Nhánh
            </strong>
          </div>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Chi nhánh liên kết kho POS" name="warehouseBranch">
                <Select
                  options={[
                    { label: 'Kho Tổng Hà Nội (STORE_HN_01)', value: 'STORE_HN_01' },
                    { label: 'Chi nhánh Quận 1 (STORE_HCM_01)', value: 'STORE_HCM_01' },
                    { label: 'Kho Phân phối Online Ecom', value: 'STORE_ECOM' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cơ chế trừ kho chống bán âm" name="deductStrategy">
                <Select
                  options={[
                    { label: 'Trừ tồn kho khả dụng tức thì (Live Inventory Deduct)', value: 'INSTANT_AVAILABLE' },
                    { label: 'Khóa tạm giữ tồn kho (Hold Inventory)', value: 'HOLD_INVENTORY' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CHUYÊN MỤC DÀNH CHO CHAT & CSKH (Pancake, Zalo, Telegram) */}
      {/* ========================================================================= */}
      {isChat && (
        <div
          style={{
            background: '#EEF2FF',
            border: '1px solid #C7D2FE',
            borderRadius: 8,
            padding: '14px 16px',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <MessageFilled style={{ color: '#4F46E5', fontSize: 16 }} />
            <strong style={{ fontSize: 13.5, color: '#3730A3' }}>
              Cấu hình Hội Thoại & Bot Tự Động Hóa CSKH
            </strong>
          </div>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Page ID / OA ID" name="pageId" initialValue="page_ankhang_fashion">
                <Input placeholder="Nhập Page ID / Zalo OA ID..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chế độ AI Tự động phản hồi" name="aiChatMode" initialValue="AI_AUTO_PILOT">
                <Select
                  options={[
                    { label: 'AI Tự động tư vấn & Chốt đơn (Auto-Pilot)', value: 'AI_AUTO_PILOT' },
                    { label: 'AI Gợi ý câu trả lời cho nhân viên', value: 'AI_COPILOT_SUGGEST' },
                    { label: 'Chỉ ghi nhận đơn & Không tự trả lời', value: 'READ_ONLY' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}

      {/* Webhook Inbound URL chung */}
      <Form.Item label="Đường dẫn Webhook nhận dữ liệu (Inbound URL)">
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            value={webhookUrl}
            readOnly
            style={{
              color: '#059669',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 600,
              fontSize: 12,
              flex: 1,
              background: '#F8FAFC',
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

      <Row gutter={12}>
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

      <Divider style={{ margin: '10px 0 14px' }} />

      {/* Kích hoạt Switch Card */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 6,
          padding: '10px 14px',
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 12.5, color: '#0F172A' }}>
            Kích hoạt kết nối và tiếp nhận dữ liệu thời gian thực
          </div>
          <div style={{ color: '#64748B', fontSize: 11.5, marginTop: 2 }}>
            Tự động chuyển tiếp luồng dữ liệu vào Universal Data Model (UDM Schema)
          </div>
        </div>
        <Switch defaultChecked />
      </div>

      {/* Live Test Connection & Result Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
              borderRadius: 6,
              padding: '10px 12px',
              fontSize: 11.5,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <Space size="small">
                <CheckCircleFilled style={{ color: '#10B981', fontSize: 13 }} />
                <span style={{ fontWeight: 600, color: '#0F172A' }}>Kết quả kiểm tra mạng thời gian thực:</span>
              </Space>
              <Tag color={testResult.latencyMs < 200 ? 'success' : 'warning'} style={{ fontWeight: 700, margin: 0 }}>
                Độ trễ: {testResult.latencyMs}ms
              </Tag>
            </div>

            <Row gutter={[12, 4]} style={{ color: '#475569' }}>
              <Col span={12}>
                <span>Máy chủ phản hồi: </span>
                <strong style={{ color: '#0F172A' }}>{testResult.remoteServer || 'Cloud Gateway'}</strong>
              </Col>
              <Col span={12}>
                <span>Trạng thái HTTP: </span>
                <strong style={{ color: '#10B981' }}>{testResult.httpStatusCode || 200} OK</strong>
              </Col>
              <Col span={12}>
                <span>Điểm cuối (Endpoint): </span>
                <strong style={{ color: '#0284C7', fontFamily: 'monospace' }}>{testResult.endpoint}</strong>
              </Col>
              <Col span={12}>
                <span>Chữ ký HMAC: </span>
                <strong style={{ color: '#6366F1', fontFamily: 'monospace' }}>{testResult.handshakeSignature}</strong>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </FormModal>
  );
};

export default ConnectorConfigModal;
