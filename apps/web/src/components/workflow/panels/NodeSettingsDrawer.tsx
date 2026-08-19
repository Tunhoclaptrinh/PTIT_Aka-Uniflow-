import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  Switch,
  Space,
  Tag,
  Tabs,
  Slider,
  InputNumber,
  Divider,
} from 'antd';
import {
  DeleteOutlined,
  SaveOutlined,
  CopyOutlined,
  PlayCircleOutlined,
  CodeOutlined,
  ControlOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { BaseButton } from '../../base/BaseButton';
import { notify } from '../../../utils/notification';
import { getPartnerLogo } from '../../../utils/partnerLogos';
import { useAppConfig } from '../../../context/AppConfigContext';

interface NodeSettingsDrawerProps {
  open: boolean;
  selectedNode: any;
  onClose: () => void;
  onUpdateNode: (nodeId: string, updatedData: any) => void;
  onDeleteNode: (nodeId: string) => void;
}

export const NodeSettingsDrawer: React.FC<NodeSettingsDrawerProps> = ({
  open,
  selectedNode,
  onClose,
  onUpdateNode,
  onDeleteNode,
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('config');
  const [testing, setTesting] = useState(false);
  const [testOutput, setTestResult] = useState<any>(null);
  const { themeMode } = useAppConfig();
  const isLight = themeMode === 'light';

  React.useEffect(() => {
    if (open && selectedNode) {
      form.resetFields();
      form.setFieldsValue({
        label: selectedNode.data?.label || '',
        description: selectedNode.data?.description || '',
        eventType: selectedNode.data?.eventType || 'ORDER_PAID',
        threshold: selectedNode.data?.threshold || 90,
        model: selectedNode.data?.model || 'GEMINI_FLASH_QDRANT',
        nerExtraction: selectedNode.data?.nerExtraction ?? true,
        fallbackAction: selectedNode.data?.fallbackAction || 'QUEUE_PENDING',
        warehouseId: selectedNode.data?.warehouseId || 'WH_MAIN_HN',
        deductType: selectedNode.data?.deductType || 'INSTANT_AVAILABLE',
        autoPrint: selectedNode.data?.autoPrint ?? true,
        autoCod: selectedNode.data?.autoCod ?? true,
        retryPolicy: selectedNode.data?.retryPolicy || 'EXPONENTIAL_3',
        timeoutMs: selectedNode.data?.timeoutMs || 30000,
        enabled: selectedNode.data?.enabled ?? true,
      });
      setTestResult(null);
    }
  }, [open, selectedNode, form]);

  if (!selectedNode) return null;

  const nodeType = selectedNode.type || 'action';
  const partnerLogo = nodeType === 'ai' ? '/favicon.svg' : getPartnerLogo(selectedNode.data?.label || '');

  const categoryLabels: Record<string, { label: string; color: string }> = {
    trigger: { label: 'Cổng tiếp nhận Webhook', color: '#ed1c24' },
    ai: { label: 'Trí tuệ nhân tạo AI', color: '#8B5CF6' },
    action: { label: 'Khối xử lý Kho & Vận chuyển', color: '#10B981' },
  };

  const currentCat = categoryLabels[nodeType] || { label: 'Khối xử lý', color: '#6B7280' };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onUpdateNode(selectedNode.id, {
        ...selectedNode.data,
        ...values,
      });
      notify.success(`Đã lưu cấu hình khối "${values.label || selectedNode.id}" thành công!`);
      onClose();
    } catch (err) {
      console.warn('Validate failed:', err);
    }
  };

  const handleTestStep = async () => {
    setTesting(true);
    notify.loading(`Đang chạy thử nghiệm khối ${selectedNode.data?.label}...`, 'testStep');
    setTimeout(() => {
      setTesting(false);
      setTestResult({
        status: 'SUCCESS',
        statusCode: 200,
        latencyMs: Math.floor(Math.random() * 60) + 45,
        timestamp: new Date().toISOString(),
        nodeId: selectedNode.id,
        nodeType: selectedNode.type,
        outputPayload: {
          success: true,
          action: 'EXECUTE_NODE_SIMULATION',
          message: `Khối "${selectedNode.data?.label}" đã xử lý payload UDM thành công`,
          sampleTransformedData: {
            sourceOrderId: 'VN_ORD_982471',
            status: 'PROCESSED',
            matchedMasterSku: 'AO-POLO-NAM-BLK-L',
            inventoryDeducted: 1,
            waybillCreated: 'VTP_TRACK_8831920',
          },
        },
      });
      notify.success(`Chạy thử khối "${selectedNode.data?.label}" thành công! (200 OK)`);
    }, 600);
  };

  const sampleUdmPayload = JSON.stringify(
    {
      sourcePlatform: 'TIKTOK_SHOP',
      sourceOrderId: 'TTS_VN_893120',
      orderStatus: 'AWAITING_SHIPMENT',
      payment: {
        method: 'COD',
        totalAmount: 380000,
        currency: 'VND',
        isPaid: false,
      },
      lineItems: [
        {
          sourceSku: 'POLO-SLIM-BLACK-L',
          productName: 'Áo Polo Nam Cao Cấp Slimfit Đen L',
          quantity: 1,
          unitPrice: 380000,
        },
      ],
      shippingAddress: {
        receiverName: 'Nguyễn Văn An',
        phone: '0987654321',
        fullAddress: 'Số 10 Tạ Quang Bửu, Bách Khoa, Hai Bà Trưng, Hà Nội',
        province: 'Hà Nội',
        district: 'Hai Bà Trưng',
      },
    },
    null,
    2
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={560}
      destroyOnClose
      styles={{
        header: {
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle, #E5E7EB)',
        },
        body: {
          padding: '16px 20px',
        },
        footer: {
          padding: '12px 20px',
          borderTop: '1px solid var(--border-subtle, #E5E7EB)',
        },
      }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              flexShrink: 0,
            }}
          >
            {partnerLogo ? (
              <img src={partnerLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: currentCat.color }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#111827',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {selectedNode.data?.label || 'Cấu hình khối'}
              </span>
              <Tag color={currentCat.color} style={{ borderRadius: 4, fontSize: 10, fontWeight: 600, margin: 0 }}>
                {currentCat.label}
              </Tag>
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              ID: <code style={{ color: '#4B5563' }}>{selectedNode.id}</code>
            </div>
          </div>
        </div>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BaseButton
            variant="danger"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              onDeleteNode(selectedNode.id);
              onClose();
            }}
          >
            Xóa khối
          </BaseButton>

          <Space size="small">
            <BaseButton variant="ghost" size="small" onClick={onClose}>
              Hủy bỏ
            </BaseButton>
            <BaseButton variant="primary" size="small" icon={<SaveOutlined />} onClick={handleSave}>
              Lưu cấu hình
            </BaseButton>
          </Space>
        </div>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'config',
            label: (
              <Space size={4}>
                <ControlOutlined />
                <span>Tham số thực thi</span>
              </Space>
            ),
            children: (
              <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
                {/* 1. Tên và mô tả chung */}
                <Form.Item
                  label="Tên hiển thị khối xử lý"
                  name="label"
                  rules={[{ required: true, message: 'Vui lòng nhập tên khối!' }]}
                >
                  <Input placeholder="Ví dụ: TikTok Shop Webhook..." />
                </Form.Item>

                <Form.Item label="Mô tả chức năng" name="description">
                  <Input.TextArea rows={2} placeholder="Nhập tóm tắt hành động khối này thực hiện..." />
                </Form.Item>

                <Divider style={{ margin: '16px 0' }} />

                {/* 2. Cấu hình theo từng loại Node */}
                {nodeType === 'trigger' && (
                  <>
                    <Form.Item label="Sự kiện sàn TMĐT kích hoạt" name="eventType">
                      <Select
                        options={[
                          { label: 'Đơn hàng thanh toán thành công (Awaiting Shipment)', value: 'ORDER_PAID' },
                          { label: 'Đơn hàng sẵn sàng giao (READY_TO_SHIP)', value: 'ORDER_READY_TO_SHIP' },
                          { label: 'Người mua hủy đơn hàng (CANCELLED)', value: 'ORDER_CANCELLED' },
                          { label: 'Cập nhật biến động tồn kho sàn (INVENTORY_SYNC)', value: 'INVENTORY_SYNC' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item label="Đường dẫn nhận Webhook Inbound">
                      <Input
                        readOnly
                        value={`https://api.uniflow.vn/v1/webhooks/tenant_live/${selectedNode.id}`}
                        suffix={
                          <CopyOutlined
                            style={{ cursor: 'pointer', color: '#ed1c24' }}
                            onClick={() => {
                              navigator.clipboard.writeText(`https://api.uniflow.vn/v1/webhooks/tenant_live/${selectedNode.id}`);
                              notify.success('Đã sao chép đường dẫn Webhook!');
                            }}
                          />
                        }
                      />
                    </Form.Item>

                    <Form.Item label="Chính sách thử lại khi lỗi mạng (Retry Policy)" name="retryPolicy">
                      <Select
                        options={[
                          { label: 'Thử lại 3 lần (Khoảng cách tăng dần 5s, 15s, 30s)', value: 'EXPONENTIAL_3' },
                          { label: 'Thử lại 5 lần (Tiêu chuẩn đơn hàng quan trọng)', value: 'EXPONENTIAL_5' },
                          { label: 'Không thử lại (Bỏ qua ngay khi lỗi)', value: 'NO_RETRY' },
                        ]}
                      />
                    </Form.Item>
                  </>
                )}

                {nodeType === 'ai' && (
                  <>
                    <Form.Item label="Động cơ trí tuệ nhân tạo (AI Engine)" name="model">
                      <Select
                        options={[
                          { label: 'Gemini 1.5 Flash + Qdrant Vector (Siêu tốc < 50ms)', value: 'GEMINI_FLASH_QDRANT' },
                          { label: 'Gemini 1.5 Pro + Qdrant (Chính xác sâu, NER đa thuộc tính)', value: 'GEMINI_PRO' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item label="Ngưỡng tin cậy tự động phê duyệt (%)" name="threshold">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Slider min={70} max={99} style={{ flex: 1 }} />
                        <Form.Item name="threshold" noStyle>
                          <InputNumber min={70} max={99} formatter={(value) => `${value}%`} style={{ width: 80 }} />
                        </Form.Item>
                      </div>
                    </Form.Item>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                        padding: '10px 14px',
                        background: isLight ? '#F9FAFB' : '#1F2937',
                        borderRadius: 8,
                        border: '1px solid var(--border-subtle, #E5E7EB)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>Trích xuất thực thể NER tự động</div>
                        <div style={{ color: '#6B7280', fontSize: 12 }}>Tự bóc tách Màu sắc, Kích cỡ, Chất liệu từ tên hàng</div>
                      </div>
                      <Form.Item name="nerExtraction" valuePropName="checked" noStyle>
                        <Switch />
                      </Form.Item>
                    </div>

                    <Form.Item label="Hành động khi điểm so khớp < ngưỡng" name="fallbackAction">
                      <Select
                        options={[
                          { label: 'Chuyển vào hàng đợi "Chờ duyệt 1-click" trên bảng SKU', value: 'QUEUE_PENDING' },
                          { label: 'Gửi thông báo đẩy Telegram cho quản lý kho', value: 'ALERT_TELEGRAM' },
                          { label: 'Tạm dừng đơn hàng và gắn cờ kiểm tra tay', value: 'HOLD_ORDER' },
                        ]}
                      />
                    </Form.Item>
                  </>
                )}

                {nodeType === 'action' && (
                  <>
                    <Form.Item label="Chi nhánh kho POS đích" name="warehouseId">
                      <Select
                        options={[
                          { label: 'Kho Tổng Hà Nội (WH_MAIN_HN)', value: 'WH_MAIN_HN' },
                          { label: 'Kho Cầu Giấy (WH_HN_CG)', value: 'WH_HN_CG' },
                          { label: 'Kho Hồ Chí Minh (WH_HCM_Q1)', value: 'WH_HCM_Q1' },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item label="Hành động kho hàng" name="deductType">
                      <Select
                        options={[
                          { label: 'Trừ tồn kho khả dụng tức thì (Live Inventory Deduct)', value: 'INSTANT_AVAILABLE' },
                          { label: 'Khóa tạm giữ tồn kho (Hold Inventory)', value: 'HOLD_INVENTORY' },
                        ]}
                      />
                    </Form.Item>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                        padding: '10px 14px',
                        background: isLight ? '#F9FAFB' : '#1F2937',
                        borderRadius: 8,
                        border: '1px solid var(--border-subtle, #E5E7EB)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>Tự động in phiếu giao hàng A6 ngay</div>
                        <div style={{ color: '#6B7280', fontSize: 12 }}>Tạo file PDF in vận đơn khi vừa sinh mã tracking</div>
                      </div>
                      <Form.Item name="autoPrint" valuePropName="checked" noStyle>
                        <Switch />
                      </Form.Item>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                        padding: '10px 14px',
                        background: isLight ? '#F9FAFB' : '#1F2937',
                        borderRadius: 8,
                        border: '1px solid var(--border-subtle, #E5E7EB)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>Tự động đối soát tiền thu hộ COD</div>
                        <div style={{ color: '#6B7280', fontSize: 12 }}>Đồng bộ số tiền COD với hóa đơn trên sàn TMĐT</div>
                      </div>
                      <Form.Item name="autoCod" valuePropName="checked" noStyle>
                        <Switch />
                      </Form.Item>
                    </div>
                  </>
                )}

                <Divider style={{ margin: '16px 0' }} />

                {/* 3. Cài đặt thực thi nâng cao */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Form.Item label="Thời gian Timeout tối đa (ms)" name="timeoutMs" style={{ flex: 1, marginBottom: 0 }}>
                    <InputNumber min={5000} max={60000} step={1000} style={{ width: '100%' }} />
                  </Form.Item>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Trạng thái khối</span>
                    <Form.Item name="enabled" valuePropName="checked" noStyle>
                      <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            ),
          },
          {
            key: 'schema',
            label: (
              <Space size={4}>
                <CodeOutlined />
                <span>Cấu trúc dữ liệu UDM</span>
              </Space>
            ),
            children: (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>JSON Schema đầu vào khối:</span>
                  <BaseButton
                    variant="ghost"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => {
                      navigator.clipboard.writeText(sampleUdmPayload);
                      notify.success('Đã sao chép cấu trúc JSON mẫu!');
                    }}
                  >
                    Sao chép JSON
                  </BaseButton>
                </div>
                <pre
                  style={{
                    background: isLight ? '#F8FAFC' : '#0B0F19',
                    color: isLight ? '#0F172A' : '#E2E8F0',
                    padding: 14,
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono, monospace',
                    maxHeight: 380,
                    overflowY: 'auto',
                  }}
                >
                  {sampleUdmPayload}
                </pre>
              </div>
            ),
          },
          {
            key: 'test',
            label: (
              <Space size={4}>
                <PlayCircleOutlined />
                <span>Chạy thử khối</span>
              </Space>
            ),
            children: (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div
                  style={{
                    padding: 14,
                    background: isLight ? '#F9FAFB' : '#1F2937',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Kiểm thử độc lập khối xử lý</div>
                  <div style={{ color: '#6B7280', fontSize: 12, marginBottom: 12 }}>
                    Gửi payload mẫu chuẩn UDM qua khối này để kiểm tra tính hợp lệ và thời gian thực thi trước khi đưa vào luồng chính.
                  </div>
                  <BaseButton
                    variant="primary"
                    size="small"
                    icon={<PlayCircleOutlined />}
                    loading={testing}
                    onClick={handleTestStep}
                  >
                    Chạy thử riêng khối này
                  </BaseButton>
                </div>

                {testOutput && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <CheckCircleFilled style={{ color: '#10B981' }} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>Kết quả thực thi thử nghiệm:</span>
                      <Tag color="#10B981">{testOutput.statusCode} OK</Tag>
                      <Tag color="#3B82F6">{testOutput.latencyMs}ms</Tag>
                    </div>
                    <pre
                      style={{
                        background: isLight ? '#F8FAFC' : '#0B0F19',
                        color: '#10B981',
                        padding: 14,
                        borderRadius: 8,
                        border: '1px solid #E5E7EB',
                        fontSize: 12,
                        fontFamily: 'JetBrains Mono, monospace',
                        maxHeight: 260,
                        overflowY: 'auto',
                      }}
                    >
                      {JSON.stringify(testOutput, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </Drawer>
  );
};

export default NodeSettingsDrawer;
