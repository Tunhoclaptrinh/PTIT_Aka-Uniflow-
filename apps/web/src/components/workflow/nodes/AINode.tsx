import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Tag } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

export const AINode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div
      style={{
        padding: '12px 16px',
        background: '#111827',
        borderRadius: 10,
        border: '2px solid #8B5CF6',
        boxShadow: '0 0 16px rgba(139, 92, 246, 0.3)',
        minWidth: 220,
        color: '#F9FAFB',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#8B5CF6',
          width: 10,
          height: 10,
          border: '2px solid #ffffff',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 6 }}>
          <RobotOutlined /> {data.label || 'AI Matching Engine'}
        </span>
        <Tag color="#8B5CF6" style={{ borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
          AI AGENT
        </Tag>
      </div>
      <div style={{ fontSize: 12, color: '#9CA3AF' }}>
        {data.description || 'Khớp SKU Qdrant + Gemini 1.5 Flash'}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#8B5CF6',
          width: 10,
          height: 10,
          border: '2px solid #ffffff',
        }}
      />
    </div>
  );
};
