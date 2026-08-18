import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Tag } from 'antd';
import { DatabaseFilled, CarFilled, DownOutlined, UpOutlined } from '@ant-design/icons';

export const ActionNode: React.FC<{ data: any }> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isPos = data.category === 'POS';
  const nodeColor = isPos ? '#fcc20f' : '#10B981';

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
          boxShadow: isHovered || expanded ? `0 0 24px ${isPos ? 'rgba(252, 194, 15, 0.45)' : 'rgba(16, 185, 129, 0.45)'}` : `0 0 12px ${isPos ? 'rgba(252, 194, 15, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
          minWidth: expanded ? 220 : 160,
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
              background: isPos ? 'linear-gradient(135deg, #fcc20f 0%, #EA5400 100%)' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 10px ${isPos ? 'rgba(252, 194, 15, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`,
              flexShrink: 0,
            }}
          >
            {isPos ? <DatabaseFilled style={{ color: '#0B0F19', fontSize: 16 }} /> : <CarFilled style={{ color: '#FFFFFF', fontSize: 16 }} />}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#F9FAFB', lineHeight: 1.2 }}>
              {data.label || 'Action Adapter'}
            </div>
            {!expanded && (
              <div style={{ fontSize: 10, color: nodeColor, fontWeight: 600, marginTop: 2 }}>
                ● {isPos ? 'Trừ Tồn Kho' : 'Tạo Vận Đơn'}
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
              {data.description || 'Thực thi Outbound API'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag color={nodeColor} style={{ borderRadius: 4, fontSize: 10, fontWeight: 700, color: isPos ? '#0B0F19' : '#ffffff' }}>
                {isPos ? 'SAPO / KIOTVIET' : 'GHTK / GHN'}
              </Tag>
              <span style={{ fontSize: 11, color: '#10B981', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                ✓ Đã Sẵn Sàng
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
