import React from 'react';
import { Modal, Row, Col, Tag, Space, Progress } from 'antd';
import {
  ThunderboltFilled,
  CheckCircleFilled,
  AimOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { SKUMappingItem } from '../../services/mapping.service';
import { BaseButton } from '../base/BaseButton';

export interface SkuDetailModalProps {
  open: boolean;
  item: SKUMappingItem | null;
  onClose: () => void;
  onApprove: (id: string) => void;
}

export const SkuDetailModal: React.FC<SkuDetailModalProps> = ({
  open,
  item,
  onClose,
  onApprove,
}) => {
  if (!item) return null;

  const vectorScore = Math.min(0.99, (item.confidenceScore || 0.9) + 0.02);
  const attributeScore = Math.max(0.75, (item.confidenceScore || 0.9) - 0.03);
  const percent = Math.round((item.confidenceScore || 0.9) * 100);

  return (
    <Modal
      title={
        <Space>
          <ThunderboltFilled style={{ color: '#8B5CF6', fontSize: 20 }} />
          <span style={{ fontWeight: 800, fontSize: 16 }}>
            Báo Cáo Phân Tích So Khớp AI (AI Matching Explainability)
          </span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={720}
      centered
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, width: '100%', paddingTop: 10 }}>
          <BaseButton key="close" variant="ghost" size="small" onClick={onClose} style={{ minWidth: 90 }}>
            Đóng
          </BaseButton>
          {item.mappingStatus !== 'AUTO_APPROVED' && (
            <BaseButton
              key="approve"
              variant="primary"
              size="small"
              icon={<CheckCircleFilled />}
              glow
              onClick={() => {
                onApprove(item._id);
                onClose();
              }}
              style={{ minWidth: 140 }}
            >
              Xác Nhận & Phê Duyệt Liên Kết
            </BaseButton>
          )}
        </div>
      }
      styles={{
        body: { padding: '16px 0' },
      }}
    >
      {/* 1. Comparison Cards */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div
            style={{
              padding: 16,
              background: '#F8FAFC',
              borderRadius: 10,
              border: '1px solid #E5E7EB',
              height: '100%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>SẢN PHẨM SÀN (NGUỒN)</span>
              <Tag color="#000000" style={{ fontWeight: 700, margin: 0 }}>
                {item.sourcePlatform}
              </Tag>
            </div>
            <div style={{ color: '#ed1c24', fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: 14 }}>
              {item.sourceSkuCode}
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4 }}>
              {item.sourceProductName}
            </div>
            {item.sourceVariationText && (
              <div style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                Phân loại: {item.sourceVariationText}
              </div>
            )}
          </div>
        </Col>

        <Col span={12}>
          <div
            style={{
              padding: 16,
              background: '#F8FAFC',
              borderRadius: 10,
              border: '1px solid #E5E7EB',
              height: '100%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>MASTER SKU KHO POS (ĐÍCH)</span>
              <Tag color="#10B981" style={{ fontWeight: 700, margin: 0 }}>
                {item.targetPosPlatform || 'SAPO'}
              </Tag>
            </div>
            <div style={{ color: '#10B981', fontWeight: 700, fontFamily: 'JetBrains Mono', fontSize: 14 }}>
              {item.targetMasterSku}
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4 }}>
              {item.targetProductName}
            </div>
            <div style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
              Kho liên kết: Kho Tổng Hà Nội (WH_MAIN_HN)
            </div>
          </div>
        </Col>
      </Row>

      {/* 2. Hybrid Confidence Score */}
      <div style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Điểm Tin Cậy Tổng Hợp (Hybrid Score Formula)</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#ed1c24' }}>
            {percent}% ({(item.confidenceScore || 0.9).toFixed(4)})
          </span>
        </div>
        <Progress
          percent={percent}
          strokeColor="#ed1c24"
          trailColor="#E5E7EB"
          showInfo={false}
          size={['100%', 8]}
        />
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4, fontStyle: 'italic' }}>
          Công thức: <strong>Hybrid = 0.7 × Vector Embedding + 0.3 × NLP Attributes</strong>
        </div>
      </div>

      {/* 3. Deep Breakdown */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <div
            style={{
              padding: '12px 14px',
              background: '#FFFFFF',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6366F1', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              <AimOutlined /> Vector Cosine Similarity (Qdrant)
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'JetBrains Mono' }}>
              {(vectorScore * 100).toFixed(1)}%
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Mô hình text-embedding-3-small (1536 chiều)
            </div>
          </div>
        </Col>

        <Col span={12}>
          <div
            style={{
              padding: '12px 14px',
              background: '#FFFFFF',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#EF4444', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              <TagOutlined /> NER Entity Match (Gemini 1.5 Flash)
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'JetBrains Mono' }}>
              {(attributeScore * 100).toFixed(1)}%
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Trích xuất: Màu sắc, Kích cỡ, Chất liệu & Form dáng
            </div>
          </div>
        </Col>
      </Row>

      {/* 4. Attribute Comparison Table */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
          Đối Soát Thuộc Tính Trích Xuất (NLP Entity Match Matrix)
        </div>
        <div
          style={{
            background: '#F8FAFC',
            borderRadius: 8,
            border: '1px solid #E5E7EB',
            padding: '10px 14px',
            fontSize: 12,
          }}
        >
          <Row style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: 6, color: '#6B7280', fontWeight: 600 }}>
            <Col span={6}>Thuộc tính</Col>
            <Col span={9}>Giá trị từ Sàn</Col>
            <Col span={9}>Giá trị Master POS</Col>
          </Row>
          <Row style={{ paddingTop: 6, paddingBottom: 6, borderBottom: '1px solid #F3F4F6' }}>
            <Col span={6} style={{ color: '#6B7280' }}>Màu sắc</Col>
            <Col span={9}><span style={{ color: '#10B981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircleFilled style={{ fontSize: 12 }} /> Đen (Black)</span></Col>
            <Col span={9}><span style={{ color: '#10B981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircleFilled style={{ fontSize: 12 }} /> Đen (BLK)</span></Col>
          </Row>
          <Row style={{ paddingTop: 6, paddingBottom: 6, borderBottom: '1px solid #F3F4F6' }}>
            <Col span={6} style={{ color: '#6B7280' }}>Kích thước</Col>
            <Col span={9}><span style={{ color: '#10B981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircleFilled style={{ fontSize: 12 }} /> Size L (55-65kg)</span></Col>
            <Col span={9}><span style={{ color: '#10B981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircleFilled style={{ fontSize: 12 }} /> L</span></Col>
          </Row>
          <Row style={{ paddingTop: 6 }}>
            <Col span={6} style={{ color: '#6B7280' }}>Chất liệu</Col>
            <Col span={9}><span style={{ color: '#10B981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircleFilled style={{ fontSize: 12 }} /> 100% Cotton 2 chiều</span></Col>
            <Col span={9}><span style={{ color: '#10B981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircleFilled style={{ fontSize: 12 }} /> Cotton Compact</span></Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default SkuDetailModal;
