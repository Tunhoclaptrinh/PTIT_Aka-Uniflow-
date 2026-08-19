import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ThunderboltFilled, ShoppingFilled } from '@ant-design/icons';
import { getPartnerLogo } from '../../../utils/partnerLogos';

export const TriggerNode: React.FC<any> = ({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isTikTok = data.label?.toLowerCase().includes('tiktok');
  const isShopee = data.label?.toLowerCase().includes('shopee');
  const nodeColor = isShopee ? '#EE4D2D' : '#ed1c24';
  const partnerLogo = getPartnerLogo(data.label || data.name || '');

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Clean Compact Node Container */}
      <div
        style={{
          padding: '10px 14px',
          background: '#FFFFFF',
          borderRadius: 10,
          border: selected ? `2px solid ${nodeColor}` : '1px solid #E5E7EB',
          boxShadow: selected
            ? `0 0 0 3px rgba(237, 28, 36, 0.2), 0 8px 16px rgba(0, 0, 0, 0.08)`
            : isHovered
            ? '0 6px 16px rgba(0, 0, 0, 0.08)'
            : '0 2px 6px rgba(0, 0, 0, 0.04)',
          width: 210,
          color: '#111827',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Logo Badge */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              flexShrink: 0,
              padding: 4,
              overflow: 'hidden',
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
                fontWeight: 700,
                fontSize: 13,
                color: '#111827',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={data.label}
            >
              {data.label || 'Inbound Trigger'}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              Webhook Inbound
            </div>
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: nodeColor,
          width: 10,
          height: 10,
          border: '2px solid #FFFFFF',
          boxShadow: `0 0 8px ${nodeColor}`,
        }}
      />
    </div>
  );
};

export default TriggerNode;
