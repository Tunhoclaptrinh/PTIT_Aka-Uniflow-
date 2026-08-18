import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Tag } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

export const ActionNode: React.FC<{ data: any }> = ({ data }) => {
  const isPos = data.category === 'POS';
  const borderColor = isPos ? '#fcc20f' : '#10B981';

  return (
    <div
      style={{
        padding: '12px 16px',
        background: '#111827',
        borderRadius: 10,
        border: `2px solid ${borderColor}`,
        boxShadow: `0 0 16px ${isPos ? 'rgba(252, 194, 15, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
        minWidth: 200,
        color: '#F9FAFB',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: borderColor,
          width: 10,
          height: 10,
          border: '2px solid #ffffff',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: borderColor, display: 'flex', alignItems: 'center', gap: 6 }}>
          <CheckOutlined /> {data.label || 'Action Adapter'}
        </span>
        <Tag color={borderColor} style={{ borderRadius: 4, fontSize: 10, fontWeight: 700, color: isPos ? '#0B0F19' : '#ffffff' }}>
          {isPos ? 'POS ERP' : 'LOGISTICS'}
        </Tag>
      </div>
      <div style={{ fontSize: 12, color: '#9CA3AF' }}>
        {data.description || 'Thực thi Outbound API'}
      </div>
    </div>
  );
};
