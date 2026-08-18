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
          width: 10,
          height: 10,
          border: '2px solid #ffffff',
          boxShadow: `0 0 8px ${nodeColor}`,
        }}
      />

      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: expanded ? '14px 18px' : '10px 14px',
          background: '#FFFFFF',
          borderRadius: expanded ? 14 : 28,
          border: `2px solid ${nodeColor}`,
          boxShadow: isHovered || expanded ? `0 6px 20px rgba(139, 92, 246, 0.25)` : `0 2px 10px rgba(0, 0, 0, 0.08)`,
          minWidth: expanded ? 230 : 170,
          color: '#111827',
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
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
              flexShrink: 0,
            }}
          >
            <RobotFilled style={{ color: '#FFFFFF', fontSize: 16 }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#111827', lineHeight: 1.2 }}>
              {data.label || 'AI Agent Router'}
            </div>
            {!expanded && (
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                Qdrant + Gemini NLP
              </div>
            )}
          </div>

          <div style={{ color: '#9CA3AF', fontSize: 12 }}>
            {expanded ? <UpOutlined /> : <DownOutlined />}
          </div>
        </div>

        {/* Expanded Details Body */}
        {expanded && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #F3F4F6' }}>
            <div style={{ color: '#4B5563', fontSize: 12, marginBottom: 8, lineHeight: 1.4 }}>
              {data.description || 'Tự động khớp nối mã SKU sàn & POS, tự phục hồi khi có lỗi vận chuyển'}
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Tag color="#8B5CF6" style={{ borderRadius: 4, fontWeight: 600, fontSize: 10 }}>
                Cosine Cos &gt; 95%
              </Tag>
              <Tag color="#10B981" style={{ borderRadius: 4, fontWeight: 600, fontSize: 10 }}>
                Auto-Healing
              </Tag>
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: nodeColor,
          width: 10,
          height: 10,
          border: '2px solid #ffffff',
          boxShadow: `0 0 8px ${nodeColor}`,
        }}
      />
    </div>
  );
};
