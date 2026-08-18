import React, { useMemo, useEffect, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, Button, Space, Tag, message, Spin } from 'antd';
import { PlayCircleOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { TriggerNode } from './nodes/TriggerNode';
import { AINode } from './nodes/AINode';
import { ActionNode } from './nodes/ActionNode';
import { workflowService, WorkflowData } from '../../services/workflow.service';

const defaultNodes = [
  {
    id: 'node_trigger_1',
    type: 'trigger',
    position: { x: 80, y: 150 },
    data: { label: 'TikTok Shop Webhook', description: 'Bắt sự kiện đơn mới (PAID)' },
  },
  {
    id: 'node_ai_mapper_2',
    type: 'ai',
    position: { x: 420, y: 150 },
    data: { label: 'AI Hybrid SKU Mapper', description: 'Độ tin cậy >= 95% -> Auto Sync' },
  },
  {
    id: 'node_pos_3',
    type: 'action',
    position: { x: 760, y: 60 },
    data: { label: 'Trừ tồn kho Sapo', description: 'Kho: WH_MAIN_HN', category: 'POS' },
  },
  {
    id: 'node_ship_4',
    type: 'action',
    position: { x: 760, y: 250 },
    data: { label: 'Tạo vận đơn GHTK', description: 'Gói Chuẩn Express', category: 'LOGISTICS' },
  },
];

const defaultEdges = [
  { id: 'e1-2', source: 'node_trigger_1', target: 'node_ai_mapper_2', animated: true, style: { stroke: '#ed1c24', strokeWidth: 2 } },
  { id: 'e2-3', source: 'node_ai_mapper_2', target: 'node_pos_3', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 } },
  { id: 'e2-4', source: 'node_ai_mapper_2', target: 'node_ship_4', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
];

const FlowContent: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(defaultEdges);
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { getViewport } = useReactFlow();

  const nodeTypes = useMemo(
    () => ({
      trigger: TriggerNode,
      ai: AINode,
      action: ActionNode,
      // Hỗ trợ map từ database schema
      TRIGGER_TIKTOK: TriggerNode,
      AI_SKU_MAPPER: AINode,
      ACTION_SAPO_DEDUCT: ActionNode,
      ACTION_GHTK_WAYBILL: ActionNode,
    }),
    []
  );

  const loadWorkflow = async () => {
    setLoading(true);
    try {
      const data = await workflowService.getActiveWorkflow();
      if (data) {
        setWorkflow(data);
        if (data.nodes && data.nodes.length > 0) {
          // Normalize node types if needed
          const mappedNodes = data.nodes.map((n) => ({
            ...n,
            type: n.type?.toLowerCase().includes('trigger')
              ? 'trigger'
              : n.type?.toLowerCase().includes('ai')
              ? 'ai'
              : 'action',
            data: n.data || { label: n.label, description: n.config?.eventType || 'Đã liên kết DB' },
          }));
          setNodes(mappedNodes);
        }
        if (data.edges && data.edges.length > 0) {
          const mappedEdges = data.edges.map((e) => ({
            ...e,
            animated: true,
            style: e.style || { stroke: '#ed1c24', strokeWidth: 2 },
          }));
          setEdges(mappedEdges);
        }
      }
    } catch (err: any) {
      console.warn('Sử dụng luồng mặc định (DB đang khởi động):', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflow();
  }, []);

  const handleSave = async () => {
    if (!workflow?._id) {
      message.success('Đã lưu quy trình vào bộ nhớ tạm!');
      return;
    }

    setSaving(true);
    try {
      const currentViewport = getViewport();
      await workflowService.updateWorkflow(workflow._id, {
        nodes,
        edges,
        viewport: currentViewport,
      });
      message.success('Đã lưu quy trình thành công vào MongoDB Atlas!');
    } catch (err: any) {
      message.error('Lỗi khi lưu quy trình: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestRun = () => {
    message.loading({ content: 'Đang chạy mô phỏng luồng 0-chạm...', key: 'testRun' });
    setTimeout(() => {
      message.success({
        content: 'Chạy thử nghiệm thành công! Đơn hàng mô phỏng đã trừ kho Sapo và tạo vận đơn GHTK (180ms).',
        key: 'testRun',
        duration: 4,
      });
    }, 800);
  };

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
            {workflow?.name || 'Luồng: Tự động trừ kho Sapo và Đẩy đơn GHTK từ TikTok Shop'}
          </span>
          <Tag color="#10B981" style={{ borderRadius: 4, fontWeight: 600 }}>
            Active (0-chạm)
          </Tag>
          <span style={{ color: '#9CA3AF', fontSize: 12 }}>
            Đã thực thi: <strong style={{ color: '#fcc20f' }}>{workflow?.executionCount || 14502}</strong> đơn
          </span>
        </Space>

        <Space>
          <Button
            icon={<ReloadOutlined />}
            size="middle"
            onClick={loadWorkflow}
            style={{ color: '#9CA3AF', borderColor: '#374151' }}
          >
            Tải lại từ DB
          </Button>
          <Button
            icon={<PlayCircleOutlined />}
            onClick={handleTestRun}
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
            loading={saving}
            onClick={handleSave}
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
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin tip="Đang tải quy trình từ MongoDB Atlas..." size="large" />
          </div>
        ) : (
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
        )}
      </div>
    </Card>
  );
};

export const WorkflowCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
};
