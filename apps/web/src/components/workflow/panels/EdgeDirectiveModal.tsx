import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Switch,
  Space,
  Radio,
  Tag,
  Divider,
} from 'antd';
import {
  BranchesOutlined,
  DeleteOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { BaseButton } from '../../base/BaseButton';
import { notify } from '../../../utils/notification';

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
  { label: 'Xanh chuẩn', value: '#2563EB', tag: 'blue' },
  { label: 'Tím AI', value: '#8B5CF6', tag: 'purple' },
  { label: 'Xanh lá ĐVVC', value: '#10B981', tag: 'green' },
  { label: 'Xanh MISA', value: '#0284C7', tag: 'cyan' },
  { label: 'Cam POS', value: '#D97706', tag: 'orange' },
  { label: 'Đỏ Webhook', value: '#EF4444', tag: 'red' },
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
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && edge) {
      form.resetFields();
      form.setFieldsValue({
        label: edge.data?.label || edge.label || '',
        directive: edge.data?.directive || '',
        conditionExpr: edge.data?.conditionExpr || '',
        description: edge.data?.description || '',
        strokeColor: edge.style?.stroke || (edge.data?.isInternal ? '#10B981' : '#2563EB'),
        animated: edge.animated ?? true,
        priority: edge.data?.priority || 'NORMAL',
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
        directive: values.directive || values.label,
        conditionExpr: values.conditionExpr,
        description: values.description,
        priority: values.priority,
      };

      const updatedStyle = {
        ...edge.style,
        stroke: values.strokeColor,
        strokeWidth: edge.style?.strokeWidth || 2,
      };

      onSave(edge.id, updatedData, updatedStyle, values.animated);
      notify.success('Đã cập nhật chỉ lệnh & điều kiện đường liên kết thành công!');
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
    <Modal
      open={open}
      onCancel={onClose}
      width={520}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: '#F5F3FF',
              color: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BranchesOutlined style={{ fontSize: 16 }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: '#111827' }}>
              Thiết lập chỉ lệnh & Điều kiện đường liên kết
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>
              ID: <code>{edge.id}</code>
            </div>
          </div>
        </div>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <BaseButton variant="danger" size="small" icon={<DeleteOutlined />} onClick={handleDelete}>
            Xóa đường nối
          </BaseButton>
          <Space size="small">
            <BaseButton variant="ghost" size="small" onClick={onClose}>
              Hủy
            </BaseButton>
            <BaseButton variant="primary" size="small" icon={<SaveOutlined />} onClick={handleFinish}>
              Lưu chỉ lệnh
            </BaseButton>
          </Space>
        </div>
      }
    >
      {/* Node Connection Flow Preview */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#F8FAFC',
          borderRadius: 8,
          border: '1px solid #E2E8F0',
          marginBottom: 16,
          fontSize: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#6B7280', fontSize: 10.5 }}>Khối nguồn (Source):</div>
          <div style={{ fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {sourceNode?.data?.label || edge.source}
          </div>
        </div>
        <div style={{ padding: '0 10px', color: '#94A3B8', fontWeight: 700 }}>➔</div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
          <div style={{ color: '#6B7280', fontSize: 10.5 }}>Khối đích (Target):</div>
          <div style={{ fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
          <Input placeholder="Ví dụ: ⚡ Nếu khớp SKU > 90%, 🧾 Xuất HĐĐT VAT 1%, 🏆 Chốt cước rẻ nhất..." />
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
        >
          <Input.TextArea
            rows={2}
            placeholder="Ví dụ: payload.confidenceScore >= 0.90 && order.totalAmount < 5000000"
            style={{ fontFamily: 'Consolas, Monaco, monospace', fontSize: 12 }}
          />
        </Form.Item>

        <Form.Item name="description" label="Ghi chú chi tiết nghiệp vụ luồng truyền dữ liệu">
          <Input.TextArea rows={2} placeholder="Nhập mô tả luồng dữ liệu truyền qua giữa 2 khối..." />
        </Form.Item>

        <Divider style={{ margin: '14px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center' }}>
          <Form.Item name="strokeColor" label="Màu sắc đường nối" style={{ marginBottom: 0 }}>
            <Radio.Group>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {COLOR_PRESETS.map((preset) => (
                  <Radio.Button
                    key={preset.value}
                    value={preset.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11.5,
                      padding: '0 8px',
                      height: 28,
                      lineHeight: '26px',
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: preset.value }} />
                    <span>{preset.label}</span>
                  </Radio.Button>
                ))}
              </div>
            </Radio.Group>
          </Form.Item>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
              Hiệu ứng xung điện chuyển động (Animated Flow)
            </span>
            <Form.Item name="animated" valuePropName="checked" noStyle>
              <Switch checkedChildren="Bật chuyển động" unCheckedChildren="Đứng yên" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default EdgeDirectiveModal;
