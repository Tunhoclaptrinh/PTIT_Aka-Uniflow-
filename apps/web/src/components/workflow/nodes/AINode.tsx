import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Tag } from 'antd';
import { RobotFilled, DownOutlined, UpOutlined } from '@ant-design/icons';

export const AINode: React.FC<{ data: any }> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nodeColor = '#8B5CF6';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'scale(1.04)' : 'scale(1)',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: nodeColor,
          width: 12,
          height: 12,
          border: '2px solid #ffffff',
          boxShadow: `0 0 8px ${nodeColor}`,
        }}
      />

      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: expanded ? '14px 18px' : '10px 14px',
          background: 'rgba(17, 24, 39, 0.95)',
          backdropFilter: 'blur(12px)',
          borderRadius: expanded ? 14 : 28,
          border: `2px solid ${nodeColor}`,
          boxShadow: isHovered || expanded ? `0 0 24px rgba(139, 92, 246, 0.45)` : `0 0 12px rgba(139, 92, 246, 0.25)`,
          minWidth: expanded ? 230 : 170,
          color: '#F9FAFB',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          {/* Round Icon Badge */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
              flexShrink: 0,
            }}
          >
            <RobotFilled style={{ color: '#FFFFFF', fontSize: 16 }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#F9FAFB', lineHeight: 1.2 }}>
              {data.label || 'AI Matcher'}
            </div>
            {!expanded && (
              <div style={{ fontSize: 10, color: '#8B5CF6', fontWeight: 600, marginTop: 2 }}>
                ● Qdrant + Gemini
              </div>
            )}
          </div>

          <div style={{ color: '#9CA3AF', fontSize: 11 }}>
            {expanded ? <UpOutlined /> : <DownOutlined />}
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: 12, color: '#D1D5DB', marginBottom: 6 }}>
              {data.description || 'Khớp SKU Qdrant + Gemini 1.5 Flash'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag color="#8B5CF6" style={{ borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                HYBRID &gt;= 95%
              </Tag>
              <span style={{ fontSize: 11, color: '#fcc20f', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                ⚡ Auto-Approve
              </span>
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: nodeColor,
          width: 12,
          height: 12,
          border: '2px solid #ffffff',
          boxShadow: `0 0 8px ${nodeColor}`,
        }}
      />
    </div>
  );
};
