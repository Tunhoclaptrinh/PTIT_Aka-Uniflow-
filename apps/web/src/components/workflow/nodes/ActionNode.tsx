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
          boxShadow: isHovered || expanded ? `0 6px 20px rgba(0, 0, 0, 0.15)` : `0 2px 10px rgba(0, 0, 0, 0.08)`,
          minWidth: expanded ? 220 : 160,
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
              background: isPos ? 'linear-gradient(135deg, #fcc20f 0%, #EA5400 100%)' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              flexShrink: 0,
            }}
          >
            {isPos ? <DatabaseFilled style={{ color: '#FFFFFF', fontSize: 16 }} /> : <CarFilled style={{ color: '#FFFFFF', fontSize: 16 }} />}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#111827', lineHeight: 1.2 }}>
              {data.label || 'Action Node'}
            </div>
            {!expanded && (
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                {isPos ? 'Trừ kho POS' : 'Tạo vận đơn'}
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
              {data.description || (isPos ? 'Trừ tồn kho trực tiếp qua Open API' : 'Tạo vận đơn tự động và lấy mã Tracking')}
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Tag color={isPos ? '#fcc20f' : '#10B981'} style={{ borderRadius: 4, fontWeight: 600, fontSize: 10 }}>
                {isPos ? 'ERP Inventory' : 'Auto Waybill'}
              </Tag>
              <Tag style={{ borderRadius: 4, fontWeight: 600, fontSize: 10 }}>
                Kho Tổng HN
              </Tag>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
