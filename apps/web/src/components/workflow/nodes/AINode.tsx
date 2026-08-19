import React, { useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { DownOutlined, UpOutlined, CheckCircleFilled, ExportOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { getPartnerLogo } from '../../../utils/partnerLogos';

export const AINode: React.FC<any> = ({ id, data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const nodeColor = '#8B5CF6';

  const label = (data.label || '').toLowerCase();
  const isRateCompare =
    data.model === 'RATE_OPTIMIZER_AI' ||
    label.includes('so sánh') ||
    label.includes('cước') ||
    label.includes('rẻ nhất');

  const carriersComparison = Array.isArray(data.carriers)
    ? data.carriers.map((c: any) => ({
      name: c.name || c.carrier || 'ĐVVC',
      price: c.price || (c.fee ? `${c.fee.toLocaleString('vi-VN')}đ` : ''),
      logo: getPartnerLogo(c.name || c.carrier || ''),
      isCheapest: Boolean(c.isCheapest || c.selected),
      note: c.note || (c.isCheapest ? 'Rẻ nhất 🏆' : ''),
    }))
    : [];

  const hasCarriers = carriersComparison.length > 0;

  // Carrier được AI chọn (rẻ nhất) — hiển thị động trong description
  const selectedCarrier = carriersComparison.find((c: { isCheapest: boolean; name: string; price: string }) => c.isCheapest);
  const dynamicDescription = isRateCompare && selectedCarrier
    ? `Chốt: ${selectedCarrier.name} (${selectedCarrier.price}) — rẻ nhất trong ${carriersComparison.length} hãng`
    : data.description || 'Xử lý tự động hóa thông minh';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Nút tách đơn ra khỏi cụm phân vùng (văng ra góc trên bên phải) */}
      {isHovered && data.onDetachFromGroup && (
        <Tooltip title="Tách khối ra khỏi cụm phân vùng">
          <div
            onClick={(e) => {
              e.stopPropagation();
              data.onDetachFromGroup(id);
            }}
            style={{
              position: 'absolute',
              top: -24,
              right: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 4,
              background: '#FFFFFF',
              border: '1px solid #C4B5FD',
              boxShadow: '0 2px 8px rgba(139,92,246,0.18)',
              color: '#8B5CF6',
              fontSize: 10.5,
              fontWeight: 600,
              cursor: 'pointer',
              zIndex: 100,
              transition: 'all 0.15s ease',
            }}
          >
            <ExportOutlined style={{ fontSize: 10 }} />
            <span>Tách khỏi cụm</span>
          </div>
        </Tooltip>
      )}

      <NodeResizer
        isVisible={selected}
        minWidth={140}
        minHeight={34}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, background: nodeColor, border: '2px solid #FFFFFF' }}
        lineStyle={{ borderColor: nodeColor }}
      />

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: nodeColor,
          width: 8,
          height: 8,
          border: '2px solid #FFFFFF',
          boxShadow: `0 0 6px ${nodeColor}`,
        }}
      />

      {/* Clean Minimalist Node Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          minWidth: data.isCompact ? 140 : (hasCarriers && expanded ? 260 : 200),
          background: '#FFFFFF',
          borderRadius: 6,
          border: selected ? `2px solid ${nodeColor}` : `1.5px solid ${nodeColor}`,
          boxShadow: selected
            ? `0 0 0 3px ${nodeColor}30, 0 6px 16px rgba(0, 0, 0, 0.08)`
            : isHovered
              ? `0 4px 14px ${nodeColor}25`
              : `0 1px 4px rgba(0, 0, 0, 0.04)`,
          color: '#111827',
          cursor: 'pointer',
          userSelect: 'none',
          padding: data.isCompact ? '5px 8px' : '9px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transition: 'width 0.2s ease',
        }}
      >
        {data.isCompact ? (
          /* Chế độ 1 dòng siêu gọn (Ultra-Compact) */
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                padding: 2,
              }}
            >
              <img src="/favicon.svg" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: 11.5,
                color: '#111827',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1,
              }}
              title={data.label}
            >
              {data.label || 'AI Engine'}
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: nodeColor, flexShrink: 0 }}>
              {isRateCompare ? 'Tối ưu cước' : 'AI LLM'}
            </span>
          </div>
        ) : (
          /* Chế độ tiêu chuẩn (Standard Minimal) */
          <div>
            {/* Top Minimal Category & Status */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, color: nodeColor }}>
                Trí tuệ nhân tạo AI
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8B5CF6', fontWeight: 500 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6' }} />
                {isRateCompare ? 'So sánh cước' : 'Gemini + Qdrant'}
              </span>
            </div>

            {/* Main Body: Logo & Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  padding: 4,
                }}
              >
                <img src="/favicon.svg" alt="UniFlow AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#111827',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={data.label}
                >
                  {data.label || 'AI Engine'}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: isRateCompare ? '#059669' : '#6B7280',
                    fontWeight: isRateCompare ? 600 : 400,
                    marginTop: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {dynamicDescription}
                </div>
              </div>

              {/* Toggle Expand for Rate Comparison Sub-Nodes */}
              {hasCarriers && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  style={{
                    padding: '2px 4px',
                    borderRadius: 4,
                    background: '#F3F4F6',
                    color: '#4B5563',
                    fontSize: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                  }}
                  title={expanded ? 'Thu gọn danh sách hãng' : 'Mở rộng so sánh hãng'}
                >
                  {expanded ? <UpOutlined /> : <DownOutlined />}
                </div>
              )}
            </div>

            {/* Collapsible Nested Child Carrier Cards (Node con từ database/API) */}
            {hasCarriers && expanded && (
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 8,
                  borderTop: '1px dashed #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                  Đối tác vận chuyển được phân tích:
                </div>
                {carriersComparison.map((c: any) => (
                  <div
                    key={c.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 8px',
                      borderRadius: 6,
                      background: c.isCheapest ? '#ECFDF5' : '#F9FAFB',
                      border: c.isCheapest ? '1px solid #10B981' : '1px solid #E5E7EB',
                      fontSize: 11,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {c.logo ? (
                        <img src={c.logo} alt={c.name} style={{ width: 16, height: 16, objectFit: 'contain' }} />
                      ) : null}
                      <span style={{ fontWeight: c.isCheapest ? 700 : 500, color: c.isCheapest ? '#065F46' : '#374151' }}>
                        {c.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontWeight: 700, color: c.isCheapest ? '#059669' : '#6B7280' }}>
                        {c.price}
                      </span>
                      {c.isCheapest && <CheckCircleFilled style={{ color: '#10B981', fontSize: 12 }} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: nodeColor,
          width: 8,
          height: 8,
          border: '2px solid #FFFFFF',
          boxShadow: `0 0 6px ${nodeColor}`,
        }}
      />
    </div>
  );
};

export default AINode;
