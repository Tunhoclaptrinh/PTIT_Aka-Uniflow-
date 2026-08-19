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
  ThunderboltFilled,
  AppstoreOutlined,
  ScissorOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { BaseButton } from '../../base/BaseButton';
import { notify } from '../../../utils/notification';
import { getPartnerLogo } from '../../../utils/partnerLogos';
import { useAppConfig } from '../../../context/AppConfigContext';

interface NodeSettingsDrawerProps {
  open: boolean;
  selectedNode: any;
  allNodes?: any[];
  onClose: () => void;
  onUpdateNode: (nodeId: string, updatedData: any) => void;
  onDeleteNode: (nodeId: string) => void;
  onSelectNode?: (node: any) => void;
}

export const NodeSettingsDrawer: React.FC<NodeSettingsDrawerProps> = ({
  open,
  selectedNode,
  allNodes = [],
  onClose,
  onUpdateNode,
  onDeleteNode,
  onSelectNode,
}) => {
  const { themeMode } = useAppConfig();
  const isLight = themeMode === 'light';
  const [activeTab, setActiveTab] = useState('config');
  const [form] = Form.useForm();
  const [testOutput, setTestOutput] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const nodeType = selectedNode?.type || 'action';
  const isGroup = nodeType === 'group' || selectedNode?.type?.toLowerCase().includes('group');

  // Lấy các node con thực tế đang thuộc group này
  const childNodes = isGroup && selectedNode
    ? allNodes.filter((n) => n.parentId === selectedNode.id)
    : [];

  // Tìm Group cha nếu selectedNode là node con
  const parentGroup = !isGroup && selectedNode?.parentId
    ? allNodes.find((n) => n.id === selectedNode.parentId)
    : null;

  React.useEffect(() => {
    if (open && selectedNode) {
      form.resetFields();
      form.setFieldsValue({
        label: selectedNode.data?.label || '',
        subtitle: selectedNode.data?.subtitle || '',
        description: selectedNode.data?.description || '',
        isExpanded: selectedNode.data?.isExpanded ?? true,
        eventType: selectedNode.data?.eventType || 'ORDER_PAID',
        threshold: selectedNode.data?.threshold || 90,
        model: selectedNode.data?.model || 'GEMINI_FLASH_QDRANT',
        compareMode: selectedNode.data?.compareMode || 'AUTO_HUB',
        carrierList: selectedNode.data?.carrierList || ['VIETTEL_POST', 'GHTK', 'GHN'],
        strategy: selectedNode.data?.strategy || 'CHEAPEST',
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
      setTestOutput(null);
    }
  }, [open, selectedNode, form]);

  if (!selectedNode) return null;

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onUpdateNode(selectedNode.id, {
        ...selectedNode.data,
        ...values,
      });
      notify.success(isGroup ? `Đã lưu ghi chú phân vùng "${values.label || selectedNode.id}"!` : `Đã lưu cấu hình khối "${values.label || selectedNode.id}"!`);
      onClose();
    } catch (err) {
      console.warn('Validate failed:', err);
    }
  };

  const handleTestStep = async () => {
    setTesting(true);
    notify.loading(`Đang chạy thử nghiệm khối ${selectedNode.data?.label || selectedNode.id}...`);
    setTimeout(() => {
      setTesting(false);
      const isRateCompare =
        selectedNode.data?.model === 'RATE_OPTIMIZER_AI' ||
        selectedNode.data?.label?.toLowerCase().includes('so sánh') ||
        selectedNode.data?.label?.toLowerCase().includes('cước') ||
        selectedNode.data?.label?.toLowerCase().includes('rẻ nhất');

      const outputPayload = isRateCompare
        ? {
            success: true,
            action: 'AI_DYNAMIC_RATE_OPTIMIZATION',
            sku: 'POLO-SLIM-BLACK-L',
            parcelWeightGrams: 350,
            quotes: [
              { carrier: 'Viettel Post (VTP)', fee: 19500, etaHours: 24, badge: '🏆 RẺ NHẤT (-20.4%)' },
              { carrier: 'GHTK Express', fee: 22000, etaHours: 18 },
              { carrier: 'GHN Nhanh', fee: 24500, etaHours: 20 },
            ],
            chosenCarrier: 'VIETTEL_POST',
            appliedFee: 19500,
            estimatedSavingsVND: 5000,
            executionTimeMs: 38,
            timestamp: new Date().toISOString(),
          }
        : {
            success: true,
            nodeId: selectedNode.id,
            nodeType: selectedNode.type,
            outputData: {
              sku: 'POLO-SLIM-BLACK-L',
              matchedMasterSku: 'POLO-NAM-SLIM-DEN-L',
              confidenceScore: 0.96,
              status: 'READY_FOR_NEXT_STEP',
            },
            latencyMs: Math.floor(Math.random() * 35 + 15),
            statusCode: 200,
          };

      setTestOutput(outputPayload);
      notify.success(`Kiểm thử thành công khối ${selectedNode.data?.label || selectedNode.id}!`);
    }, 600);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 1. DÀNH RIÊNG CHO PHÂN VÙNG GOM NHÓM (GROUP NODE)
  // ══════════════════════════════════════════════════════════════════════════
  if (isGroup) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        width={540}
        destroyOnClose
        styles={{
          header: {
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle, #E5E7EB)',
            background: '#FAF5FF',
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
                borderRadius: 6,
                background: '#F3E8FF',
                color: '#8B5CF6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(139,92,246, 0.15)',
                flexShrink: 0,
              }}
            >
              <AppstoreOutlined style={{ fontSize: 19 }} />
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
                  {selectedNode.data?.label || 'Phân vùng gom nhóm'}
                </span>
                <Tag color="purple" style={{ borderRadius: 4, fontSize: 10, fontWeight: 700, margin: 0 }}>
                  {childNodes.length} KHỐI THÀNH VIÊN
                </Tag>
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                📌 Phân vùng ghi chú & Tổ chức trực quan (Canvas Section)
              </div>
            </div>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <BaseButton
              variant="danger"
              size="small"
              icon={<ScissorOutlined />}
              onClick={() => {
                if (selectedNode.data?.onUngroup) {
                  selectedNode.data.onUngroup(selectedNode.id);
                } else {
                  onDeleteNode(selectedNode.id);
                }
                onClose();
              }}
            >
              Gỡ gộp phân vùng (Bung các khối)
            </BaseButton>

            <Space size="small">
              <BaseButton variant="ghost" size="small" onClick={onClose}>
                Đóng
              </BaseButton>
              <BaseButton variant="primary" size="small" icon={<SaveOutlined />} onClick={handleSave}>
                Lưu ghi chú phân vùng
              </BaseButton>
            </Space>
          </div>
        }
      >
        {/* Info Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '10px 14px',
            background: '#F5F3FF',
            borderRadius: 6,
            border: '1px solid #DDD6FE',
            marginBottom: 16,
            fontSize: 12,
            color: '#5B21B6',
            lineHeight: 1.5,
          }}
        >
          <InfoCircleOutlined style={{ fontSize: 15, marginTop: 2, flexShrink: 0 }} />
          <div>
            <strong>Phân vùng ghi chú & gom nhóm trực quan:</strong> Dùng để nhóm các khối liên quan, di chuyển đồng loạt và ghi chú nghiệp vụ trên Canvas. Phân vùng không phải là một bước xử lý hay một luồng thực thi.
          </div>
        </div>

        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên phân vùng gom nhóm"
            name="label"
            rules={[{ required: true, message: 'Vui lòng nhập tên phân vùng!' }]}
          >
            <Input placeholder="Ví dụ: Cụm so sánh cước đa hãng, Cụm đồng bộ 3 kho POS..." />
          </Form.Item>

          <Form.Item label="Phụ đề / Ghi chú nhanh" name="subtitle">
            <Input placeholder="Ví dụ: ⚡ Realtime Lock: Sapo + KiotViet + Nhanh.vn + MISA" />
          </Form.Item>

          <Form.Item label="Mô tả mục đích nghiệp vụ của cụm" name="description">
            <Input.TextArea rows={2} placeholder="Ghi chú mục đích của các khối nằm trong cụm phân vùng này..." />
          </Form.Item>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              padding: '10px 14px',
              background: '#F9FAFB',
              borderRadius: 6,
              border: '1px solid var(--border-subtle, #E5E7EB)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>Trạng thái mở rộng trên sơ đồ</div>
              <div style={{ color: '#6B7280', fontSize: 12 }}>Bật để xem chi tiết tất cả các khối con, tắt để co gọn thành thẻ 1 khối</div>
            </div>
            <Form.Item name="isExpanded" valuePropName="checked" noStyle>
              <Switch
                checkedChildren="Mở rộng"
                unCheckedChildren="Thu gọn"
                onChange={(checked) => {
                  if (selectedNode.data?.onToggleExpand) {
                    selectedNode.data.onToggleExpand(selectedNode.id, checked);
                  }
                }}
              />
            </Form.Item>
          </div>

          <Divider style={{ margin: '14px 0' }} />

          {/* Danh sách các khối con */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1E293B' }}>
                📦 Các khối thành viên ({childNodes.length} khối con):
              </span>
              {selectedNode.data?.onUngroup && (
                <BaseButton
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    selectedNode.data.onUngroup(selectedNode.id);
                    onClose();
                  }}
                  style={{ color: '#EF4444', borderColor: '#FCA5A5', fontSize: 11 }}
                >
                  Gỡ gộp vùng
                </BaseButton>
              )}
            </div>

            {childNodes.length === 0 ? (
              <div
                style={{
                  padding: '16px',
                  background: '#F9FAFB',
                  borderRadius: 6,
                  border: '1px dashed #D1D5DB',
                  textAlign: 'center',
                  color: '#6B7280',
                  fontSize: 12,
                }}
              >
                Cụm này hiện chưa có khối con nào. Bạn có thể dùng công cụ Quét vùng (✂️) hoặc chọn các khối trên Canvas để gom thêm.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {childNodes.map((child, idx) => {
                  const cLogo = getPartnerLogo(child.data?.label || child.label || '');
                  const cCat = (child.data?.category || child.type || '').toUpperCase();
                  const cColor = cCat.includes('POS')
                    ? '#D97706'
                    : cCat.includes('ACCOUNTING')
                    ? '#0284C7'
                    : cCat.includes('AI')
                    ? '#8B5CF6'
                    : '#10B981';

                  return (
                    <div
                      key={child.id}
                      onClick={() => {
                        if (onSelectNode) onSelectNode(child);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: '#FFFFFF',
                        border: `1.5px solid ${cColor}`,
                        borderRadius: 6,
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 4,
                            background: '#F3F4F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            padding: 2,
                          }}
                        >
                          {cLogo ? (
                            <img src={cLogo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: cColor }} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 12.5,
                              color: '#111827',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {idx + 1}. {child.data?.label || child.label || child.id}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: '#6B7280',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {child.data?.description || 'Khối xử lý dữ liệu'}
                          </div>
                        </div>
                      </div>
                      <Tag color={cColor} style={{ fontSize: 10, borderRadius: 3, margin: 0, flexShrink: 0 }}>
                        {cCat}
                      </Tag>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Form>
      </Drawer>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 2. DÀNH CHO CÁC KHỐI XỬ LÝ ĐƠN LẺ (TRIGGER, AI, ACTION)
  // ══════════════════════════════════════════════════════════════════════════
  const partnerLogo = nodeType === 'ai' ? '/favicon.svg' : getPartnerLogo(selectedNode.data?.label || '');

  const categoryLabels: Record<string, { label: string; color: string }> = {
    trigger: { label: 'Cổng tiếp nhận Webhook', color: '#ed1c24' },
    ai: { label: 'Trí tuệ nhân tạo AI', color: '#8B5CF6' },
    action: { label: 'Khối xử lý Kho & Vận chuyển', color: '#10B981' },
    group: { label: `Cụm phân vùng (${childNodes.length} khối con)`, color: '#8B5CF6' },
  };

  const currentCat = categoryLabels[nodeType] || { label: 'Khối xử lý', color: '#6B7280' };

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
              borderRadius: 6,
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
                {/* Thông báo nếu node đang nằm trong một cụm phân vùng */}
                {parentGroup && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      background: '#F5F3FF',
                      borderRadius: 6,
                      border: '1px solid #DDD6FE',
                      marginBottom: 14,
                      fontSize: 12,
                      color: '#5B21B6',
                    }}
                  >
                    <ThunderboltFilled />
                    <span>
                      Thuộc cụm phân vùng: <strong>{parentGroup.data?.label || parentGroup.id}</strong>
                    </span>
                  </div>
                )}

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

                {/* 2. Cấu hình theo từng loại Node đơn lẻ */}
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
                          { label: 'AI Rate Optimizer (So sánh cước realtime đa hãng)', value: 'RATE_OPTIMIZER_AI' },
                          { label: 'Gemini 1.5 Pro + Qdrant (Chính xác sâu, NER đa thuộc tính)', value: 'GEMINI_PRO' },
                        ]}
                      />
                    </Form.Item>

                    {/* Cấu hình đặc thù cho AI So sánh cước */}
                    {(selectedNode.data?.model === 'RATE_OPTIMIZER_AI' ||
                      selectedNode.data?.label?.toLowerCase().includes('so sánh') ||
                      selectedNode.data?.label?.toLowerCase().includes('cước') ||
                      selectedNode.data?.label?.toLowerCase().includes('rẻ nhất')) ? (
                      <div
                        style={{
                          background: '#F5F3FF',
                          borderRadius: 6,
                          border: '1px solid #DDD6FE',
                          padding: '12px 14px',
                          marginBottom: 16,
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#5B21B6', marginBottom: 6 }}>
                          ⚙️ CẤU HÌNH SO SÁNH CƯỚC & CHỌN HÃNG VẬN CHUYỂN
                        </div>

                        <Form.Item
                          label="Chế độ tiếp nhận đối tác vận chuyển"
                          name="compareMode"
                          initialValue={selectedNode.data?.compareMode || 'AUTO_HUB'}
                          style={{ marginBottom: 12 }}
                        >
                          <Select
                            options={[
                              { label: 'Tự động truy vấn Hub kết nối sẵn có (Khuyến nghị)', value: 'AUTO_HUB' },
                              { label: 'Nhận dữ liệu từ các Node ĐVVC kết nối qua dây nối', value: 'EDGE_CONNECTED' },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item
                          label="Danh sách hãng vận chuyển tham gia so giá"
                          name="carrierList"
                          initialValue={selectedNode.data?.carrierList || ['VIETTEL_POST', 'GHTK', 'GHN']}
                          style={{ marginBottom: 12 }}
                        >
                          <Select
                            mode="multiple"
                            placeholder="Chọn các hãng kết nối sẵn có"
                            options={[
                              { label: 'Viettel Post (🏆 Ưu đãi tuyến trục HN-HCM 19.5k)', value: 'VIETTEL_POST' },
                              { label: 'GHTK Express (Nội thành siêu tốc 22.0k)', value: 'GHTK' },
                              { label: 'GHN Nhanh (Giao nhanh liên tỉnh 24.5k)', value: 'GHN' },
                              { label: 'J&T Express (Đồng giá toàn quốc 21.0k)', value: 'JT_EXPRESS' },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item
                          label="Chiến lược lựa chọn hãng vận chuyển"
                          name="strategy"
                          initialValue={selectedNode.data?.strategy || 'CHEAPEST'}
                          style={{ marginBottom: 0 }}
                        >
                          <Select
                            options={[
                              { label: '🏆 Hãng có cước phí rẻ nhất (Tiết kiệm tối đa)', value: 'CHEAPEST' },
                              { label: '⚡ Hãng giao hàng nhanh nhất (Tối ưu thời gian ETA)', value: 'FASTEST' },
                              { label: '⭐ Hãng có tỷ lệ giao thành công cao nhất (> 98%)', value: 'HIGHEST_SUCCESS' },
                            ]}
                          />
                        </Form.Item>
                      </div>
                    ) : (
                      <>
                        <Form.Item
                          label={
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <span>Ngưỡng tin cậy chấp thuận tự động</span>
                              <span style={{ fontWeight: 600, color: '#8B5CF6' }}>{form.getFieldValue('threshold') || 85}%</span>
                            </div>
                          }
                          name="threshold"
                        >
                          <Slider min={60} max={99} />
                        </Form.Item>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 16,
                            padding: '10px 14px',
                            background: isLight ? '#F9FAFB' : '#1F2937',
                            borderRadius: 6,
                            border: '1px solid var(--border-subtle, #E5E7EB)',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>Trích xuất thực thể NER tự động</div>
                            <div style={{ color: '#6B7280', fontSize: 12 }}>Tự bóc tách Màu sắc, Kích cỡ, Trọng lượng từ tên hàng</div>
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
                        borderRadius: 6,
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
                        borderRadius: 6,
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
                <div style={{ marginBottom: 12, color: '#6B7280', fontSize: 12 }}>
                  Mẫu Schema Unified Data Model (UDM) chuẩn hóa truyền qua khối này:
                </div>
                <pre
                  style={{
                    background: isLight ? '#F8FAFC' : '#111827',
                    color: isLight ? '#0F172A' : '#F3F4F6',
                    padding: 14,
                    borderRadius: 6,
                    border: '1px solid #E2E8F0',
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono, monospace',
                    maxHeight: 400,
                    overflowY: 'auto',
                  }}
                >
                  {JSON.stringify(
                    {
                      orderId: 'ORD_VN_8839210',
                      channel: 'TIKTOK_SHOP',
                      totalAmount: 380000,
                      paymentMethod: 'COD',
                      items: [
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
                  )}
                </pre>
              </div>
            ),
          },
          {
            key: 'test',
            label: (
              <Space size={4}>
                <PlayCircleOutlined />
                <span>Kiểm thử khối</span>
              </Space>
            ),
            children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
                <div
                  style={{
                    padding: 14,
                    background: isLight ? '#F9FAFB' : '#1F2937',
                    borderRadius: 6,
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
                      <Tag color="#10B981">{testOutput.statusCode || 200} OK</Tag>
                      <Tag color="#3B82F6">{testOutput.latencyMs || testOutput.executionTimeMs || 35}ms</Tag>
                    </div>
                    <pre
                      style={{
                        background: isLight ? '#F8FAFC' : '#0B0F19',
                        color: '#10B981',
                        padding: 14,
                        borderRadius: 6,
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
