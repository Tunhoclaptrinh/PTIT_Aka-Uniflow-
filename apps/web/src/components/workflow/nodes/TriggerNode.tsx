import React, { useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { ThunderboltFilled, ShoppingFilled, ExportOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { getPartnerLogo } from '../../../utils/partnerLogos';

export const TriggerNode: React.FC<any> = ({ id, data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isTikTok = data.label?.toLowerCase().includes('tiktok');
  const isShopee = data.label?.toLowerCase().includes('shopee');
  const isLazada = data.label?.toLowerCase().includes('lazada');
  const isTiki = data.label?.toLowerCase().includes('tiki');
  const nodeColor = isShopee ? '#EE4D2D' : '#ed1c24';
  const partnerLogo = getPartnerLogo(data.label || data.name || (isLazada ? 'lazada' : isTiki ? 'tiki' : ''));

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

      {/* Clean Minimalist Node Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          minWidth: data.isCompact ? 140 : 200,
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
              {partnerLogo ? (
                <img
                  src={partnerLogo}
                  alt={data.label}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : isTikTok ? (
                <ThunderboltFilled style={{ color: '#ed1c24', fontSize: 12 }} />
              ) : (
                <ShoppingFilled style={{ color: '#EE4D2D', fontSize: 12 }} />
              )}
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
              {data.label || 'Webhook'}
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: nodeColor, flexShrink: 0 }}>
              TMĐT
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
                Sàn TMĐT
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#10B981', fontWeight: 500 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                Webhook
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
                  padding: 3,
                }}
              >
                {partnerLogo ? (
                  <img
                    src={partnerLogo}
                    alt={data.label}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : isTikTok ? (
                  <ThunderboltFilled style={{ color: '#ed1c24', fontSize: 16 }} />
                ) : (
                  <ShoppingFilled style={{ color: '#EE4D2D', fontSize: 16 }} />
                )}
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
                  {data.label || 'Inbound Webhook'}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#6B7280',
                    marginTop: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {data.description || 'Đơn thanh toán thành công'}
                </div>
              </div>
            </div>
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

export default TriggerNode;
