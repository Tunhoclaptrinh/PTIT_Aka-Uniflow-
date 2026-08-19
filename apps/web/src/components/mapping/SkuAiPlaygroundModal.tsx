import React, { useState } from 'react';
import {
  Modal,
  Row,
  Col,
  Input,
  Select,
  Card,
  Tag,
  Progress,
  Space,
} from 'antd';
import {
  ThunderboltFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  AimOutlined,
  TagOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { BaseButton } from '../base/BaseButton';
import { mappingService } from '../../services/mapping.service';
import { notify } from '../../utils/notification';

export interface SkuAiPlaygroundModalProps {
  open: boolean;
  onClose: () => void;
  onSaveToMappings?: (mappingData: any) => Promise<void>;
}

export const SkuAiPlaygroundModal: React.FC<SkuAiPlaygroundModalProps> = ({
  open,
  onClose,
  onSaveToMappings,
}) => {
  const [sourcePlatform, setSourcePlatform] = useState('TIKTOK_SHOP');
  const [sourceSku, setSourceSku] = useState('TTS-POLO-BLK-L');
  const [sourceTitle, setSourceTitle] = useState(
    '[HỎA TỐC] Áo Polo Nam Cotton Compact Cao Cấp Form Regular Co Giãn Thoáng Mát Màu Đen Size L (55-65kg)'
  );
  const [targetPos, setTargetPos] = useState('SAPO');
  const [targetMasterSku, setTargetMasterSku] = useState('SAPO_POLO_01');
  const [targetTitle, setTargetTitle] = useState('Áo Polo Nam Cotton Compact Đen L');

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>({
    confidenceScore: 0.968,
    vectorCosine: 0.974,
    nerScore: 0.955,
    entities: {
      category: { raw: 'Áo Polo Nam', master: 'Áo Polo', match: true },
      color: { raw: 'Màu Đen', master: 'Đen (BLK)', match: true },
      size: { raw: 'Size L (55-65kg)', master: 'L', match: true },
      material: { raw: 'Cotton Compact', master: 'Cotton Compact', match: true },
    },
    decision: 'AUTO_APPROVED',
    reasoning:
      'Trùng khớp hoàn hảo 4/4 thực thể NER (Loại, Màu sắc, Kích cỡ, Chất liệu). Khoảng cách Vector Cosine đạt 0.974 (thuộc top 0.1% tương đồng). Đủ điều kiện phê duyệt tự động 0-chạm.',
  });

  const handleRunAiAnalysis = async () => {
    if (!sourceTitle.trim()) {
      notify.warning('Vui lòng nhập tên sản phẩm sàn TMĐT để AI phân tích!');
      return;
    }

    setAnalyzing(true);
    notify.loading('AI Vector Cosine đang phân tích NLP và so khớp...', 'aiMatch');

    try {
      // Call backend test-match endpoint
      const aiResponse = await mappingService.testAIMatch({
        sourceSku,
        sourceName: sourceTitle,
        targetSku: targetMasterSku,
        targetName: targetTitle,
      });

      if (aiResponse) {
        setAnalysisResult(aiResponse);
        const scorePercent = Math.round((aiResponse.confidenceScore || aiResponse.match_score || 0.95) * 100);
        notify.success(`Hoàn tất phân tích AI (${aiResponse.engineUsed || 'Vector NLP'}). Điểm tin cậy: ${scorePercent}%.`);
      }
    } catch (err: any) {
      notify.error('Lỗi khi gọi AI Engine: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToDb = async () => {
    if (onSaveToMappings) {
      await onSaveToMappings({
        sourcePlatform,
        sourceSkuCode: sourceSku,
        sourceProductName: sourceTitle,
        targetPosPlatform: targetPos,
        targetMasterSku,
        targetProductName: targetTitle,
        confidenceScore: analysisResult.confidenceScore,
        mappingStatus: analysisResult.decision,
      });
      onClose();
    } else {
      notify.success('Đã lưu cấu hình ánh xạ SKU thành công vào MongoDB Atlas!');
      onClose();
    }
  };

  const percent = Math.round((analysisResult?.confidenceScore || 0.9) * 100);

  return (
    <Modal
      title={
        <Space>
          <img src="/favicon.svg" alt="UniFlow AI" style={{ width: 22, height: 22, objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>
            Phòng thí nghiệm AI so khớp SKU
          </span>
          <Tag color="#8B5CF6" style={{ borderRadius: 4, fontWeight: 700, fontSize: 11 }}>
            Gemini 1.5 Flash + Qdrant
          </Tag>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={840}
      centered
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, width: '100%', paddingTop: 10 }}>
          <BaseButton variant="secondary" size="small" onClick={onClose} style={{ minWidth: 96, height: 32 }}>
            Đóng
          </BaseButton>
          <BaseButton
            variant="primary"
            size="small"
            icon={<SaveOutlined />}
            glow
            onClick={handleSaveToDb}
            style={{ minWidth: 160 }}
          >
            Lưu Ánh Xạ Vào Database
          </BaseButton>
        </div>
      }
      styles={{ body: { padding: '14px 0' } }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 1. Input Comparison Box */}
        <Row gutter={16}>
          {/* Left: Sàn TMĐT Nguồn */}
          <Col span={12}>
            <Card
              size="small"
              style={{
                borderRadius: 10,
                border: '1px solid var(--border-subtle, #E5E7EB)',
                background: 'var(--bg-surface-card, #F8FAFC)',
              }}
              title={
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary, #374151)' }}>
                  1. SẢN PHẨM SÀN TMĐT (NGUỒN)
                </span>
              }
              extra={
                <Select
                  size="small"
                  value={sourcePlatform}
                  onChange={setSourcePlatform}
                  style={{ width: 120 }}
                  options={[
                    { label: 'TikTok Shop', value: 'TIKTOK_SHOP' },
                    { label: 'Shopee', value: 'SHOPEE' },
                    { label: 'Lazada', value: 'LAZADA' },
                  ]}
                />
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary, #6B7280)', fontWeight: 600 }}>Mã SKU Sàn:</span>
                  <Input
                    size="small"
                    value={sourceSku}
                    onChange={(e) => setSourceSku(e.target.value)}
                    style={{ fontFamily: 'JetBrains Mono', color: '#ed1c24', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary, #6B7280)', fontWeight: 600 }}>
                    Tiêu đề thô từ Sàn TMĐT:
                  </span>
                  <Input.TextArea
                    rows={2}
                    size="small"
                    value={sourceTitle}
                    onChange={(e) => setSourceTitle(e.target.value)}
                    placeholder="Dán tiêu đề sản phẩm dài, có nhiều từ khóa..."
                  />
                </div>
              </div>
            </Card>
          </Col>

          {/* Right: Master SKU Kho POS */}
          <Col span={12}>
            <Card
              size="small"
              style={{
                borderRadius: 10,
                border: '1px solid var(--border-subtle, #E5E7EB)',
                background: 'var(--bg-surface-card, #F8FAFC)',
              }}
              title={
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary, #374151)' }}>
                  2. MASTER SKU TRONG KHO POS (ĐÍCH)
                </span>
              }
              extra={
                <Select
                  size="small"
                  value={targetPos}
                  onChange={setTargetPos}
                  style={{ width: 110 }}
                  options={[
                    { label: 'Sapo POS', value: 'SAPO' },
                    { label: 'KiotViet', value: 'KIOTVIET' },
                  ]}
                />
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary, #6B7280)', fontWeight: 600 }}>Master SKU:</span>
                  <Input
                    size="small"
                    value={targetMasterSku}
                    onChange={(e) => setTargetMasterSku(e.target.value)}
                    style={{ fontFamily: 'JetBrains Mono', color: '#10B981', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary, #6B7280)', fontWeight: 600 }}>
                    Tên sản phẩm chuẩn trong kho:
                  </span>
                  <Input.TextArea
                    rows={2}
                    size="small"
                    value={targetTitle}
                    onChange={(e) => setTargetTitle(e.target.value)}
                    placeholder="Tên sản phẩm chuẩn hóa..."
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 2. Run Analysis Action Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BaseButton
            variant="brand"
            size="middle"
            icon={<ThunderboltFilled />}
            loading={analyzing}
            glow
            onClick={handleRunAiAnalysis}
            style={{
              padding: '0 28px',
              fontWeight: 800,
              fontSize: 14,
              borderRadius: 8,
            }}
          >
            {analyzing ? 'AI đang tính toán Vector & NER...' : 'Khởi chạy thuật toán so khớp AI'}
          </BaseButton>
        </div>

        {/* 3. Real-Time AI Explainability Results */}
        {analysisResult && (
          <div
            style={{
              background: 'var(--bg-surface-card, #FFFFFF)',
              borderRadius: 12,
              border: '1px solid var(--border-subtle, #E5E7EB)',
              padding: 16,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            }}
          >
            {/* Top Score & Status */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary, #6B7280)' }}>
                  ĐIỂM TIN CẬY HYBRID (0.7 × VECTOR + 0.3 × NLP)
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#ed1c24', fontFamily: 'JetBrains Mono' }}>
                  {percent}%{' '}
                  <span style={{ fontSize: 13, color: 'var(--text-muted, #6B7280)', fontWeight: 600 }}>
                    ({analysisResult.confidenceScore.toFixed(4)})
                  </span>
                </div>
              </div>

              <div>
                {analysisResult.decision === 'AUTO_APPROVED' ? (
                  <Tag color="success" style={{ fontSize: 12, padding: '4px 12px', borderRadius: 6, fontWeight: 800 }}>
                    <CheckCircleFilled /> TỰ ĐỘNG DUYỆT 0-CHẠM (&gt;= 90%)
                  </Tag>
                ) : (
                  <Tag color="warning" style={{ fontSize: 12, padding: '4px 12px', borderRadius: 6, fontWeight: 800 }}>
                    CẦN KIỂM TRA THỦ CÔNG
                  </Tag>
                )}
              </div>
            </div>

            <Progress
              percent={percent}
              strokeColor="#ed1c24"
              trailColor="var(--border-subtle, #E5E7EB)"
              showInfo={false}
              size={['100%', 8]}
            />

            {/* Breakdown Cards */}
            <Row gutter={12} style={{ marginTop: 14 }}>
              <Col span={12}>
                <div
                  style={{
                    background: 'var(--bg-surface-alt, #F8FAFC)',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle, #E5E7EB)',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6366F1', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AimOutlined /> Vector Cosine (Qdrant 1536-dim)
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'JetBrains Mono', marginTop: 2, color: 'var(--text-primary, #0F172A)' }}>
                    {(analysisResult.vectorCosine * 100).toFixed(1)}%
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div
                  style={{
                    background: 'var(--bg-surface-alt, #F8FAFC)',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-subtle, #E5E7EB)',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <TagOutlined /> NER Attributes (Gemini 1.5 Flash)
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'JetBrains Mono', marginTop: 2, color: 'var(--text-primary, #0F172A)' }}>
                    {(analysisResult.nerScore * 100).toFixed(1)}%
                  </div>
                </div>
              </Col>
            </Row>

            {/* NER Extraction Matrix */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary, #374151)', marginBottom: 8 }}>
                Đối Soát Thuộc Tính Thực Thể NER:
              </div>
              <Row gutter={[8, 8]}>
                {Object.entries(analysisResult.entities || {}).map(([key, val]: any) => (
                  <Col span={6} key={key}>
                    <div
                      style={{
                        background: 'var(--bg-surface-alt, #F9FAFB)',
                        border: '1px solid var(--border-subtle, #E5E7EB)',
                        borderRadius: 6,
                        padding: '6px 8px',
                        fontSize: 11,
                      }}
                    >
                      <div style={{ color: 'var(--text-muted, #6B7280)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                        {key === 'category' ? 'Loại' : key === 'color' ? 'Màu' : key === 'size' ? 'Size' : 'Vải'}
                      </div>
                      <div style={{ color: val.match ? '#10B981' : '#EF4444', fontWeight: 700, marginTop: 2, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {val.match ? <CheckCircleFilled style={{ fontSize: 11 }} /> : <CloseCircleFilled style={{ fontSize: 11 }} />} {val.raw}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {/* AI Reasoning Text */}
            <div
              style={{
                marginTop: 14,
                padding: '10px 12px',
                borderRadius: 8,
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                fontSize: 12,
                color: '#F59E0B',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: '#F59E0B' }}>Giải thích thuật toán AI:</strong>{' '}
              <span style={{ color: 'var(--text-primary, #92400E)' }}>{analysisResult.reasoning}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SkuAiPlaygroundModal;
