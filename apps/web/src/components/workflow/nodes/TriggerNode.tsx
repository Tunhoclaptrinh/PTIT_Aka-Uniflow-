import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Tag } from 'antd';
import { ThunderboltFilled } from '@ant-design/icons';

export const TriggerNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div
      style={{
        padding: '12px 16px',
        background: '#111827',
        borderRadius: 10,
        border: '2px solid #ed1c24',
        boxShadow: '0 0 16px rgba(237, 28, 36, 0.3)',
        minWidth: 200,
        color: '#F9FAFB',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#ed1c24', display: 'flex', alignItems: 'center', gap: 6 }}>
          <ThunderboltFilled /> {data.label || 'Inbound Webhook'}
        </span>
        <Tag color="#ed1c24" style={{ borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
          TRIGGER
        </Tag>
      </div>
      <div style={{ fontSize: 12, color: '#9CA3AF' }}>
        {data.description || 'Tiếp nhận đơn hàng thời gian thực'}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#ed1c24',
          width: 10,
          height: 10,
          border: '2px solid #ffffff',
        }}
      />
    </div>
  );
};
