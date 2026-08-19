import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

export const AINode: React.FC<any> = ({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const nodeColor = '#8B5CF6';

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
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: nodeColor,
          width: 10,
          height: 10,
          border: '2px solid #FFFFFF',
          boxShadow: `0 0 8px ${nodeColor}`,
        }}
      />

      {/* Compact Node Container */}
      <div
        style={{
          padding: '10px 14px',
          background: '#FFFFFF',
          borderRadius: 10,
          border: selected ? `2px solid ${nodeColor}` : '1px solid #E5E7EB',
          boxShadow: selected
            ? `0 0 0 3px rgba(139, 92, 246, 0.2), 0 8px 16px rgba(0, 0, 0, 0.08)`
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
          {/* AI Logo Badge */}
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
            <img src="/favicon.svg" alt="UniFlow AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
              {data.label || 'AI SKU Mapper'}
            </div>
            <div style={{ fontSize: 11, color: '#8B5CF6', fontWeight: 600, marginTop: 2 }}>
              Gemini + Qdrant
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

export default AINode;
