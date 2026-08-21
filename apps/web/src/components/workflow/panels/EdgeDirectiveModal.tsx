import React, { useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Switch,
  Radio,
  Tag,
  Divider,
} from 'antd';
import {
  BranchesOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { FormFooter } from '../../base/FormFooter';
import { notify } from '../../../utils/notification';
import { useAppConfig } from '../../../context/AppConfigContext';

interface EdgeDirectiveModalProps {
  open: boolean;
  edge: any;
  sourceNode?: any;
  targetNode?: any;
  onClose: () => void;
  onSave: (edgeId: string, updatedData: any, updatedStyle: any, animated: boolean) => void;
  onDelete: (edgeId: string) => void;
}

const COLOR_PRESETS = [
  { label: 'Xanh chuẩn', value: '#2563EB' },
  { label: 'Tím AI', value: '#8B5CF6' },
  { label: 'Xanh lá ĐVVC', value: '#10B981' },
  { label: 'Xanh MISA', value: '#0284C7' },
  { label: 'Cam POS', value: '#D97706' },
  { label: 'Đỏ Webhook', value: '#ed1c24' },
];

export const EdgeDirectiveModal: React.FC<EdgeDirectiveModalProps> = ({
  open,
  edge,
  sourceNode,
  targetNode,
  onClose,
  onSave,
  onDelete,
}) => {
  const { themeMode } = useAppConfig();
  const isLight = themeMode === 'light';
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && edge) {
      form.setFieldsValue({
        label: edge.data?.label || edge.label || '',
        conditionExpr: edge.data?.conditionExpr || '',
        description: edge.data?.description || '',
        strokeColor: edge.style?.stroke || '#2563EB',
        animated: edge.animated ?? true,
      });
    }
  }, [open, edge, form]);

  if (!edge) return null;

  const handleFinish = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        ...edge.data,
        label: values.label,
        conditionExpr: values.conditionExpr,
        description: values.description,
      };

      const updatedStyle = {
        ...edge.style,
        stroke: values.strokeColor,
        strokeWidth: 2,
      };

      onSave(edge.id, updatedData, updatedStyle, values.animated);
      notify.success('Đã cập nhật cấu hình đường liên kết!');
      onClose();
    } catch (err) {
      console.warn('Validate failed:', err);
    }
  };

  const handleDelete = () => {
    onDelete(edge.id);
    notify.info('Đã xóa đường liên kết');
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={900}
      placement="right"
      destroyOnClose
      styles={{
        header: {
          padding: '16px 20px',
          background: isLight ? '#FFFFFF' : '#0B0F19',
          borderBottom: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
        },
        body: {
          padding: '16px 20px',
          background: isLight ? '#FFFFFF' : '#0B0F19',
        },
        footer: {
          padding: '12px 20px',
          background: isLight ? '#FFFFFF' : '#0B0F19',
          borderTop: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
        },
      }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 6,
              background: isLight ? '#F5F3FF' : '#2E1065',
              color: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BranchesOutlined style={{ fontSize: 18 }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: isLight ? '#111827' : '#F9FAFB' }}>
              Thiết lập chỉ lệnh & Điều kiện đường liên kết
            </div>
            <div style={{ fontSize: 11, color: isLight ? '#6B7280' : '#94A3B8', fontWeight: 500 }}>
              ID: <code style={{ color: isLight ? '#4B5563' : '#CBD5E1' }}>{edge.id}</code>
            </div>
          </div>
        </div>
      }
      footer={
        <FormFooter
          align="center"
          submitText="Lưu lại"
          cancelText="Hủy"
          onCancel={onClose}
          onSubmit={handleFinish}
          extra={
            <span
              role="button"
              tabIndex={0}
              onClick={handleDelete}
              style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                color: '#EF4444',
                fontSize: 13,
                fontWeight: 600,
                padding: '5px 10px',
                borderRadius: 4,
                transition: 'all 0.15s ease',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#DC2626';
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#EF4444';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Xóa đường liên kết này khỏi quy trình"
            >
              <DeleteOutlined style={{ fontSize: 13, color: '#EF4444' }} />
              <span>Xóa đường nối</span>
            </span>
          }
          style={{ marginTop: 0, paddingTop: 14 }}
        />
      }
    >
      {/* Node Connection Flow Preview */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: isLight ? '#F8FAFC' : '#111827',
          borderRadius: 8,
          border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: 16,
          fontSize: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: isLight ? '#6B7280' : '#94A3B8', fontSize: 10.5 }}>Khối nguồn (Source):</div>
          <div style={{ fontWeight: 600, color: isLight ? '#0F172A' : '#F9FAFB', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {sourceNode?.data?.label || edge.source}
          </div>
        </div>
        <div style={{ padding: '0 10px', color: isLight ? '#94A3B8' : '#64748B', fontWeight: 700 }}>➔</div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
          <div style={{ color: isLight ? '#6B7280' : '#94A3B8', fontSize: 10.5 }}>Khối đích (Target):</div>
          <div style={{ fontWeight: 600, color: isLight ? '#0F172A' : '#F9FAFB', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {targetNode?.data?.label || edge.target}
          </div>
        </div>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          name="label"
          label="Tên chỉ lệnh / Nhãn hiển thị trên đường nối"
          rules={[{ required: true, message: 'Vui lòng nhập nhãn chỉ lệnh!' }]}
        >
          <Input placeholder="Ví dụ: Báo giá Viettel Post, Lệnh trừ tồn kho, Xuất HĐĐT VAT 1%..." />
        </Form.Item>

        <Form.Item
          name="conditionExpr"
          label={
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Biểu thức logic rẽ nhánh (Condition Expression)</span>
              <Tag color="purple" style={{ fontSize: 10, borderRadius: 3, margin: 0 }}>
                n8n / Expression Logic
              </Tag>
            </span>
          }
          extra={
            <div style={{ marginTop: 6 }}>
              <div style={{ fontSize: 11, color: isLight ? '#6B7280' : '#94A3B8', marginBottom: 4 }}>
                Gợi ý biểu thức rẽ nhánh (Bấm để chèn):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {[
                  { label: 'Chọn Viettel Post', expr: '{{ $json.selectedCarrier == "VIETTEL_POST" }}' },
                  { label: 'Khớp SKU >= 90%', expr: '{{ $json.confidenceScore >= 0.90 }}' },
                  { label: 'Đơn VIP >= 1.000.000đ', expr: '{{ $json.orderTotal >= 1000000 }}' },
                  { label: 'Khối lượng <= 500g', expr: '{{ $json.weightGrams <= 500 }}' },
                  { label: 'Phương thức COD', expr: '{{ $json.paymentMethod == "COD" }}' },
                ].map((item) => (
                  <Tag
                    key={item.label}
                    color="geekblue"
                    style={{ cursor: 'pointer', fontSize: 10.5, borderRadius: 3 }}
                    onClick={() => form.setFieldsValue({ conditionExpr: item.expr })}
                  >
                    + {item.label}
                  </Tag>
                ))}
              </div>
            </div>
          }
        >
          <Input.TextArea
            rows={2}
            placeholder="Ví dụ: {{ $json.confidenceScore >= 0.90 && $json.orderTotal < 5000000 }}"
            style={{ fontFamily: 'Consolas, Monaco, monospace', fontSize: 12 }}
          />
        </Form.Item>

        <Form.Item name="description" label="Ghi chú chi tiết nghiệp vụ luồng truyền dữ liệu">
          <Input.TextArea rows={2} placeholder="Nhập mô tả luồng dữ liệu truyền qua giữa 2 khối..." />
        </Form.Item>

        <Divider style={{ margin: '18px 0 14px 0' }} />

        {/* 1. Màu sắc đường nối */}
        <Form.Item
          name="strokeColor"
          label={
            <div style={{ fontWeight: 600, fontSize: 13, color: isLight ? '#374151' : '#F9FAFB' }}>
              Màu sắc đường nối (Dây tín hiệu)
            </div>
          }
          style={{ marginBottom: 16 }}
        >
          <Radio.Group style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {COLOR_PRESETS.map((preset) => (
                <Radio.Button
                  key={preset.value}
                  value={preset.value}
                  style={{
                    height: 34,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    borderRadius: 6,
                    border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isLight ? '#FFFFFF' : '#1E293B',
                    color: isLight ? '#374151' : '#F9FAFB',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: preset.value,
                      boxShadow: `0 0 6px ${preset.value}80`,
                      flexShrink: 0,
                    }}
                  />
                  <span>{preset.label}</span>
                </Radio.Button>
              ))}
            </div>
          </Radio.Group>
        </Form.Item>

        {/* 2. Hiệu ứng xung điện chuyển động (Animated Flow) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            background: isLight ? '#F8FAFC' : '#111827',
            borderRadius: 8,
            border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: isLight ? '#1E293B' : '#F9FAFB' }}>
              Hiệu ứng xung điện chuyển động (Animated Flow)
            </div>
            <div style={{ fontSize: 11.5, color: isLight ? '#64748B' : '#94A3B8', marginTop: 2 }}>
              Dòng hạt chuyển động liên tục trên đường liên kết để trực quan hóa luồng dữ liệu
            </div>
          </div>
          <Form.Item name="animated" valuePropName="checked" noStyle>
            <Switch
              checkedChildren="Bật"
              unCheckedChildren="Tắt"
              style={{ flexShrink: 0 }}
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default EdgeDirectiveModal;
