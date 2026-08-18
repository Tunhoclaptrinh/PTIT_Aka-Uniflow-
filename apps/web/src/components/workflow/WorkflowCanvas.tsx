import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, Button, Space, Typography, Tag } from 'antd';
import { PlayCircleOutlined, SaveOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { TriggerNode } from './nodes/TriggerNode';
import { AINode } from './nodes/AINode';
import { ActionNode } from './nodes/ActionNode';

const { Title, Text } = Typography;

const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 50, y: 150 },
    data: { label: 'TikTok Shop Webhook', description: 'Bắt sự kiện đơn mới (PAID)' },
  },
  {
    id: '2',
    type: 'ai',
    position: { x: 380, y: 150 },
    data: { label: 'AI Hybrid SKU Mapper', description: 'Độ tin cậy >= 95% -> Auto Sync' },
  },
  {
    id: '3',
    type: 'action',
    position: { x: 720, y: 60 },
    data: { label: 'Trừ tồn kho Sapo', description: 'Kho: WH_MAIN_HN', category: 'POS' },
  },
  {
    id: '4',
    type: 'action',
    position: { x: 720, y: 240 },
    data: { label: 'Tạo vận đơn GHTK', description: 'Gói Chuẩn Express', category: 'LOGISTICS' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#ed1c24', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
];

export const WorkflowCanvas: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(
    () => ({
      trigger: TriggerNode,
      ai: AINode,
      action: ActionNode,
    }),
    []
  );

  return (
    <Card
      bordered={false}
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        height: 'calc(100vh - 140px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      bodyStyle={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column' }}
    >
      {/* Canvas Top Bar */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#0B0F19',
        }}
      >
        <Space>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#F9FAFB' }}>
            Luồng: Đồng bộ đơn TikTok sang Kho Sapo & Tự động tạo GHTK
          </span>
          <Tag color="#10B981" style={{ borderRadius: 4, fontWeight: 600 }}>
            Active (0-chạm)
          </Tag>
        </Space>

        <Space>
          <Button
            icon={<PlayCircleOutlined />}
            style={{
              borderColor: '#fcc20f',
              color: '#fcc20f',
              background: 'rgba(252, 194, 15, 0.08)',
              fontWeight: 600,
            }}
          >
            Chạy thử nghiệm (Test Run)
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            style={{
              background: '#ed1c24',
              borderColor: '#ed1c24',
              fontWeight: 600,
            }}
          >
            Lưu quy trình
          </Button>
        </Space>
      </div>

      {/* Canvas Workspace */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={16}
            size={1.5}
            color="rgba(255, 255, 255, 0.1)"
          />
          <Controls style={{ background: '#111827', border: '1px solid #374151' }} />
        </ReactFlow>
      </div>
    </Card>
  );
};
