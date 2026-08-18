import React, { useEffect } from 'react';
import { Drawer, Form, Input, Select, Switch, Button, Space, message } from 'antd';
import { SettingFilled, SaveOutlined, DeleteOutlined } from '@ant-design/icons';

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

  useEffect(() => {
    if (selectedNode) {
      form.setFieldsValue({
        label: selectedNode.data?.label || '',
        description: selectedNode.data?.description || '',
        eventType: selectedNode.data?.eventType || 'ORDER_PAID',
        threshold: selectedNode.data?.threshold || 95,
        warehouseId: selectedNode.data?.warehouseId || 'WH_MAIN_HN',
        autoPrint: selectedNode.data?.autoPrint ?? true,
      });
    }
  }, [selectedNode, form]);

  const handleSave = (values: any) => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        ...selectedNode.data,
        ...values,
      });
      message.success('Đã cập nhật tham số cấu hình Node!');
      onClose();
    }
  };

  return (
    <Drawer
      title={
        <Space>
          <SettingFilled style={{ color: '#fcc20f' }} />
          <span style={{ color: '#F9FAFB', fontWeight: 700 }}>
            Cấu Hình Tham Số Node ({selectedNode?.data?.label || selectedNode?.id})
          </span>
        </Space>
      }
      placement="right"
      width={400}
      open={open}
      onClose={onClose}
      styles={{
        body: { background: '#0B0F19', padding: '20px' },
        header: { background: '#111827', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' },
      }}
    >
      {selectedNode && (
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label={<span style={{ color: '#D1D5DB' }}>Tên Khối Node</span>} name="label">
            <Input style={{ background: '#111827', borderColor: '#374151', color: '#F9FAFB' }} />
          </Form.Item>

          <Form.Item label={<span style={{ color: '#D1D5DB' }}>Mô Tả Chức Năng</span>} name="description">
            <Input style={{ background: '#111827', borderColor: '#374151', color: '#F9FAFB' }} />
          </Form.Item>

          {selectedNode.type === 'trigger' && (
            <Form.Item label={<span style={{ color: '#D1D5DB' }}>Sự Kiện Webhook Inbound</span>} name="eventType">
              <Select
                style={{ width: '100%' }}
                options={[
                  { label: 'Đơn hàng mới thanh toán (Awaiting Shipment)', value: 'ORDER_PAID' },
                  { label: 'Đơn hàng sẵn sàng giao (READY_TO_SHIP)', value: 'ORDER_READY_TO_SHIP' },
                  { label: 'Người mua hủy đơn (CANCELLED)', value: 'ORDER_CANCELLED' },
                ]}
              />
            </Form.Item>
          )}

          {selectedNode.type === 'ai' && (
            <Form.Item label={<span style={{ color: '#D1D5DB' }}>Ngưỡng Tự Động Phê Duyệt (%)</span>} name="threshold">
              <Select
                style={{ width: '100%' }}
                options={[
                  { label: '>= 95% (Khuyến nghị cho Mega Sale)', value: 95 },
                  { label: '>= 90% (Tiêu chuẩn)', value: 90 },
                  { label: '>= 80% (Duyệt nới lỏng)', value: 80 },
                ]}
              />
            </Form.Item>
          )}

          {selectedNode.type === 'action' && (
            <>
              <Form.Item label={<span style={{ color: '#D1D5DB' }}>Mã Kho POS Đích</span>} name="warehouseId">
                <Select
                  style={{ width: '100%' }}
                  options={[
                    { label: 'Kho Tổng Hà Nội (WH_MAIN_HN)', value: 'WH_MAIN_HN' },
                    { label: 'Kho Cầu Giấy (WH_HN_CG)', value: 'WH_HN_CG' },
                    { label: 'Kho Hồ Chí Minh (WH_HCM_Q1)', value: 'WH_HCM_Q1' },
                  ]}
                />
              </Form.Item>

              <Form.Item label={<span style={{ color: '#D1D5DB' }}>Tự Động In Vận Đơn Ngay</span>} name="autoPrint" valuePropName="checked">
                <Switch />
              </Form.Item>
            </>
          )}

          <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              block
              style={{
                background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
                border: 'none',
                fontWeight: 700,
              }}
            >
              Lưu Cấu Hình
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                onDeleteNode(selectedNode.id);
                onClose();
              }}
            >
              Xóa Node
            </Button>
          </div>
        </Form>
      )}
    </Drawer>
  );
};
