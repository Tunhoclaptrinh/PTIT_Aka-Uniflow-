import React from 'react';
import { Form, Input, Select, Switch, Space } from 'antd';
import { SettingFilled, DeleteOutlined } from '@ant-design/icons';
import { FormDrawer, BaseButton } from '../../base';
import { notify } from '../../../utils/notification';

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
  const initialValues = selectedNode
    ? {
        label: selectedNode.data?.label || '',
        description: selectedNode.data?.description || '',
        eventType: selectedNode.data?.eventType || 'ORDER_PAID',
        threshold: selectedNode.data?.threshold || 95,
        warehouseId: selectedNode.data?.warehouseId || 'WH_MAIN_HN',
        autoPrint: selectedNode.data?.autoPrint ?? true,
      }
    : {};

  const handleSave = (values: any) => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        ...selectedNode.data,
        ...values,
      });
      notify.success('Đã cập nhật tham số khối xử lý!');
      onClose();
    }
  };

  return (
    <FormDrawer
      open={open}
      onClose={onClose}
      onSubmit={handleSave}
      initialValues={initialValues}
      width={400}
      title={
        <Space>
          <SettingFilled style={{ color: '#ed1c24' }} />
          <span style={{ fontWeight: 600 }}>Cấu hình khối xử lý ({selectedNode?.data?.label || selectedNode?.id})</span>
        </Space>
      }
      submitText="Lưu cấu hình"
      cancelText="Hủy bỏ"
    >
      {selectedNode && (
        <>
          <Form.Item label="Tên khối xử lý" name="label">
            <Input placeholder="Nhập tên khối..." />
          </Form.Item>

          <Form.Item label="Mô tả chức năng" name="description">
            <Input placeholder="Nhập mô tả..." />
          </Form.Item>

          {selectedNode.type === 'trigger' && (
            <Form.Item label="Sự kiện webhook đầu vào" name="eventType">
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
            <Form.Item label="Ngưỡng tự động phê duyệt (%)" name="threshold">
              <Select
                style={{ width: '100%' }}
                options={[
                  { label: '>= 95% (Khuyến nghị cho ngày Mega Sale)', value: 95 },
                  { label: '>= 90% (Tiêu chuẩn vận hành)', value: 90 },
                  { label: '>= 80% (Duyệt nới lỏng)', value: 80 },
                ]}
              />
            </Form.Item>
          )}

          {selectedNode.type === 'action' && (
            <>
              <Form.Item label="Mã kho POS đích" name="warehouseId">
                <Select
                  style={{ width: '100%' }}
                  options={[
                    { label: 'Kho Tổng Hà Nội (WH_MAIN_HN)', value: 'WH_MAIN_HN' },
                    { label: 'Kho Cầu Giấy (WH_HN_CG)', value: 'WH_HN_CG' },
                    { label: 'Kho Hồ Chí Minh (WH_HCM_Q1)', value: 'WH_HCM_Q1' },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Tự động in vận đơn ngay" name="autoPrint" valuePropName="checked">
                <Switch />
              </Form.Item>
            </>
          )}

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <BaseButton
              variant="danger"
              icon={<DeleteOutlined />}
              block
              onClick={() => {
                onDeleteNode(selectedNode.id);
                onClose();
              }}
            >
              Xóa khối này khỏi quy trình
            </BaseButton>
          </div>
        </>
      )}
    </FormDrawer>
  );
};
