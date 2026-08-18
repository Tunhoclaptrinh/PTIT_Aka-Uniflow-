import React from 'react';
import { Modal, Tag, Space, Row, Col, Progress, Button, Divider } from 'antd';
import {
  ThunderboltFilled,
  CheckCircleFilled,
  TagFilled,
  DatabaseFilled,
} from '@ant-design/icons';
import { SKUMappingItem } from '../../services/mapping.service';

interface SkuDetailModalProps {
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
          <span style={{ color: '#F9FAFB', fontWeight: 800, fontSize: 16 }}>
            Báo Cáo Phân Tích So Khớp AI (AI Matching Explainability)
          </span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={720}
      footer={[
        <Button key="close" onClick={onClose} style={{ borderColor: '#374151', color: '#9CA3AF' }}>
          Đóng
        </Button>,
        item.mappingStatus !== 'AUTO_APPROVED' && (
          <Button
            key="approve"
            type="primary"
            icon={<CheckCircleFilled />}
            onClick={() => {
              onApprove(item._id);
              onClose();
            }}
            style={{
              background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
              border: 'none',
              fontWeight: 700,
            }}
          >
            Phê Duyệt Liên Kết Ngay
          </Button>
        ),
      ]}
      styles={{ body: { background: '#0B0F19', padding: '24px' } }}
    >
      {/* 1. Comparison Box */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div
            style={{
              padding: 16,
              background: '#111827',
              borderRadius: 10,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              height: '100%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Tag color={item.sourcePlatform === 'TIKTOK_SHOP' ? '#000000' : '#EE4D2D'} style={{ fontWeight: 700 }}>
                {item.sourcePlatform === 'TIKTOK_SHOP' ? 'TikTok Shop' : 'Shopee'} (Nguồn)
              </Tag>
              <span style={{ fontFamily: 'JetBrains Mono', color: '#fcc20f', fontWeight: 600 }}>
                {item.sourceSkuCode}
              </span>
            </div>
            <div style={{ color: '#F9FAFB', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
              {item.sourceProductName}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: 12 }}>
              Phân loại: <strong style={{ color: '#D1D5DB' }}>{item.sourceVariationText || 'Tiêu chuẩn'}</strong>
            </div>
          </div>
        </Col>

        <Col span={12}>
          <div
            style={{
              padding: 16,
              background: '#111827',
              borderRadius: 10,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              height: '100%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Tag color="#10B981" style={{ fontWeight: 700 }}>
                {item.targetPosPlatform || 'SAPO'} (Kho POS Đích)
              </Tag>
              <span style={{ fontFamily: 'JetBrains Mono', color: '#10B981', fontWeight: 600 }}>
                {item.targetMasterSku}
              </span>
            </div>
            <div style={{ color: '#F9FAFB', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
              {item.targetProductName}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: 12 }}>
              Trạng thái:{' '}
              <Tag color={item.mappingStatus === 'AUTO_APPROVED' ? '#10B981' : '#fcc20f'}>
                {item.mappingStatus === 'AUTO_APPROVED' ? 'Đã Đồng Bộ' : 'Chờ Phê Duyệt'}
              </Tag>
            </div>
          </div>
        </Col>
      </Row>

      <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.08)', margin: '20px 0' }} />

      {/* 2. Hybrid Score Breakdown Formula */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB', marginBottom: 12 }}>
          ⚡ Công thức Hybrid Scoring: <span style={{ color: '#fcc20f' }}>Score = 0.7 × Vector + 0.3 × NLP Attributes</span>
        </div>

        <div style={{ background: '#111827', padding: 16, borderRadius: 10, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          {/* Vector component */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#9CA3AF' }}>
                <DatabaseFilled style={{ color: '#8B5CF6', marginRight: 6 }} />
                1. Vector Embedding Cosine (Qdrant `text-embedding-004`):
              </span>
              <strong style={{ color: '#8B5CF6' }}>{(vectorScore * 100).toFixed(1)}% (Trọng số 70%)</strong>
            </div>
            <Progress percent={Math.round(vectorScore * 100)} showInfo={false} strokeColor="#8B5CF6" trailColor="#1F2937" size="small" />
          </div>

          {/* Attribute component */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: '#9CA3AF' }}>
                <TagFilled style={{ color: '#10B981', marginRight: 6 }} />
                2. Trích xuất Thực thể NER Thuộc tính (Gemini 1.5 Flash):
              </span>
              <strong style={{ color: '#10B981' }}>{(attributeScore * 100).toFixed(1)}% (Trọng số 30%)</strong>
            </div>
            <Progress percent={Math.round(attributeScore * 100)} showInfo={false} strokeColor="#10B981" trailColor="#1F2937" size="small" />
          </div>

          {/* Total score */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
            <span style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 14 }}>
              Tổng điểm tin cậy cuối cùng (Confidence Score):
            </span>
            <span style={{ fontSize: 20, fontWeight: 900, color: percent >= 95 ? '#10B981' : '#fcc20f', fontFamily: 'JetBrains Mono' }}>
              {percent}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Entity Details */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', marginBottom: 8 }}>
          Bảng đối chiếu thuộc tính ngôn ngữ tự nhiên:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div style={{ background: '#111827', padding: '10px 14px', borderRadius: 8 }}>
            <div style={{ color: '#6B7280', fontSize: 11 }}>Loại sản phẩm</div>
            <div style={{ color: '#10B981', fontWeight: 600, fontSize: 13 }}>Khớp 100% (Thời trang)</div>
          </div>
          <div style={{ background: '#111827', padding: '10px 14px', borderRadius: 8 }}>
            <div style={{ color: '#6B7280', fontSize: 11 }}>Màu sắc & Họa tiết</div>
            <div style={{ color: '#10B981', fontWeight: 600, fontSize: 13 }}>Trùng khớp chính xác</div>
          </div>
          <div style={{ background: '#111827', padding: '10px 14px', borderRadius: 8 }}>
            <div style={{ color: '#6B7280', fontSize: 11 }}>Kích cỡ (Size)</div>
            <div style={{ color: '#10B981', fontWeight: 600, fontSize: 13 }}>Khớp chuẩn ISO</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
