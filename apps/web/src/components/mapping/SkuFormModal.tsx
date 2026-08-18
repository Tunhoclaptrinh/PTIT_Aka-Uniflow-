import React from 'react';
import { Form, Input, Select, InputNumber, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { FormModal } from '../base/FormModal';
import { SKUMappingItem } from '../../services/mapping.service';

export interface SkuFormModalProps {
  open: boolean;
  initialValues?: Partial<SKUMappingItem> | null;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void> | void;
  loading?: boolean;
}

export const SkuFormModal: React.FC<SkuFormModalProps> = ({
  open,
  initialValues,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const isEditing = !!initialValues?._id;

  return (
    <FormModal
      open={open}
      entityName="Cấu Hình Ánh Xạ SKU"
      isEditing={isEditing}
      icon={isEditing ? <EditOutlined style={{ color: '#ed1c24' }} /> : <PlusOutlined style={{ color: '#ed1c24' }} />}
      initialValues={
        initialValues || {
          sourcePlatform: 'TIKTOK_SHOP',
          targetPosPlatform: 'SAPO',
          confidenceScore: 0.95,
          mappingStatus: 'AUTO_APPROVED',
        }
      }
      loading={loading}
      width={640}
      submitText={isEditing ? 'Lưu lại' : 'Thêm mới'}
      footerAlign="center"
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="sourcePlatform"
            label="Sàn TMĐT Nguồn"
            rules={[{ required: true, message: 'Vui lòng chọn sàn nguồn' }]}
          >
            <Select
              options={[
                { label: 'TikTok Shop', value: 'TIKTOK_SHOP' },
                { label: 'Shopee', value: 'SHOPEE' },
                { label: 'Lazada', value: 'LAZADA' },
              ]}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="sourceSkuCode"
            label="Mã SKU Sàn (Seller SKU)"
            rules={[{ required: true, message: 'Vui lòng nhập mã SKU sàn' }]}
          >
            <Input placeholder="VD: TTS-TSHIRT-01" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="sourceProductName"
            label="Tên Sản Phẩm Trên Sàn"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm sàn' }]}
          >
            <Input placeholder="VD: Áo Thun Polo Nam Cotton PTIT Aka" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="sourceVariationText"
            label="Phân Loại / Biến Thể"
          >
            <Input placeholder="VD: Màu Đen / Size XL" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="targetPosPlatform"
            label="Hệ Thống Kho POS Đích"
            rules={[{ required: true, message: 'Vui lòng chọn POS đích' }]}
          >
            <Select
              options={[
                { label: 'Sapo Omnichannel', value: 'SAPO' },
                { label: 'KiotViet', value: 'KIOTVIET' },
              ]}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="targetMasterSku"
            label="Mã Master SKU Kho POS"
            rules={[{ required: true, message: 'Vui lòng nhập Master SKU' }]}
          >
            <Input placeholder="VD: SAPO_POLO_01" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="targetProductName"
            label="Tên Sản Phẩm Master Trong Kho"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm master' }]}
          >
            <Input placeholder="VD: Áo Polo PTIT Official Cotton 100%" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="confidenceScore"
            label="Độ Tin Cậy AI (0 - 1)"
          >
            <InputNumber min={0.1} max={1} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="mappingStatus"
            label="Trạng Thái Phê Duyệt"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select
              options={[
                { label: 'Đã Đồng Bộ (AUTO_APPROVED)', value: 'AUTO_APPROVED' },
                { label: 'Chờ Duyệt (PENDING_REVIEW)', value: 'PENDING_REVIEW' },
                { label: 'Cần Ghép Tay (MANUAL_REQUIRED)', value: 'MANUAL_REQUIRED' },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </FormModal>
  );
};

export default SkuFormModal;
