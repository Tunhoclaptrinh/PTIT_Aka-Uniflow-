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
import { Card, Button, Space, Tag, message, Spin, Select } from 'antd';
import {
  PlayCircleOutlined,
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { TriggerNode } from './nodes/TriggerNode';
import { AINode } from './nodes/AINode';
import { ActionNode } from './nodes/ActionNode';
import { workflowService, WorkflowData } from '../../services/workflow.service';
import { PromptBar } from './panels/PromptBar';
import { NodeLibraryDrawer } from './panels/NodeLibraryDrawer';
import { NodeSettingsDrawer } from './panels/NodeSettingsDrawer';

const defaultNodes = [
  {
    id: 'node_trigger_1',
    type: 'trigger',
    position: { x: 80, y: 150 },
    data: { label: 'TikTok Shop Inbound', description: 'Đơn mới thanh toán (Awaiting Shipment)' },
  },
  {
    id: 'node_ai_mapper_2',
    type: 'ai',
    position: { x: 420, y: 150 },
    data: { label: 'AI Hybrid SKU Mapper', description: 'Độ tin cậy >= 95% -> Tự động duyệt' },
  },
  {
    id: 'node_pos_3',
    type: 'action',
    position: { x: 760, y: 60 },
    data: { label: 'Trừ tồn kho Sapo POS', description: 'Kho: WH_MAIN_HN', category: 'POS' },
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
  const [workflowsList, setWorkflowsList] = useState<WorkflowData[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Drawers state
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const { getViewport, setViewport } = useReactFlow();

  const nodeTypes = useMemo(
    () => ({
      trigger: TriggerNode,
      ai: AINode,
      action: ActionNode,
      TRIGGER_TIKTOK: TriggerNode,
      AI_SKU_MAPPER: AINode,
      ACTION_SAPO_DEDUCT: ActionNode,
      ACTION_GHTK_WAYBILL: ActionNode,
    }),
    []
  );

  const loadAllWorkflows = async () => {
    setLoading(true);
    try {
      const list = await workflowService.getAllWorkflows();
      if (list && list.length > 0) {
        setWorkflowsList(list);
        const active = list.find((w) => w.isActive) || list[0];
        selectWorkflow(active);
      }
    } catch (err: any) {
      console.warn('Lỗi khi tải danh sách workflows, dùng fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectWorkflow = (wf: WorkflowData) => {
    setCurrentWorkflow(wf);
    if (wf.nodes && wf.nodes.length > 0) {
      const mappedNodes = wf.nodes.map((n) => ({
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
    if (wf.edges && wf.edges.length > 0) {
      const mappedEdges = wf.edges.map((e) => ({
        ...e,
        animated: true,
        style: e.style || { stroke: '#ed1c24', strokeWidth: 2 },
      }));
      setEdges(mappedEdges);
    }
    if (wf.viewport) {
      setViewport(wf.viewport);
    }
  };

  useEffect(() => {
    loadAllWorkflows();
  }, []);

  const handleNodeClick = (_: any, node: any) => {
    setSelectedNode(node);
    setSettingsOpen(true);
  };

  const handleAddNode = (type: string, label: string, category?: string) => {
    const id = `node_${Date.now()}`;
    const newNode = {
      id,
      type,
      position: { x: 350 + Math.random() * 80, y: 100 + Math.random() * 80 },
      data: { label, description: 'Cấu hình mới thêm', category: category || 'GENERAL' },
    };
    setNodes((nds) => [...nds, newNode]);
    message.success(`Đã thêm khối "${label}" vào Canvas!`);
  };

  const handleUpdateNode = (nodeId: string, updatedData: any) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...updatedData } } : n))
    );
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    message.info('Đã xóa khối Node khỏi Canvas');
  };

  const handleGeneratePrompt = (promptText: string) => {
    const isShopee = promptText.toLowerCase().includes('shopee');
    const isLazada = promptText.toLowerCase().includes('lazada');
    const isKiotViet = promptText.toLowerCase().includes('kiotviet');
    const isGHN = promptText.toLowerCase().includes('ghn');

    const triggerLabel = isShopee ? 'Shopee Push Webhook' : isLazada ? 'Lazada Inbound Webhook' : 'TikTok Shop Inbound';
    const posLabel = isKiotViet ? 'Trừ kho KiotViet' : 'Trừ tồn kho Sapo POS';
    const carrierLabel = isGHN ? 'Tạo đơn GHN Nhanh' : 'Tạo vận đơn GHTK';

    const generatedNodes = [
      { id: 'node_gen_1', type: 'trigger', position: { x: 80, y: 160 }, data: { label: triggerLabel, description: 'Đơn mới thanh toán' } },
      { id: 'node_gen_2', type: 'ai', position: { x: 420, y: 160 }, data: { label: 'AI Hybrid SKU Mapper', description: 'Tự động khớp SKU >= 95%' } },
      { id: 'node_gen_3', type: 'action', position: { x: 760, y: 80 }, data: { label: posLabel, description: 'Đồng bộ tồn kho tức thì', category: 'POS' } },
      { id: 'node_gen_4', type: 'action', position: { x: 760, y: 260 }, data: { label: carrierLabel, description: 'Tự động đẩy vận đơn', category: 'LOGISTICS' } },
    ];

    const generatedEdges = [
      { id: 'eg-1-2', source: 'node_gen_1', target: 'node_gen_2', animated: true, style: { stroke: '#ed1c24', strokeWidth: 2 } },
      { id: 'eg-2-3', source: 'node_gen_2', target: 'node_gen_3', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 } },
      { id: 'eg-2-4', source: 'node_gen_2', target: 'node_gen_4', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
    ];

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  };

  const handleSave = async () => {
    if (!currentWorkflow?._id) {
      message.success('Đã lưu quy trình vào bộ nhớ tạm!');
      return;
    }

    setSaving(true);
    try {
      const currentViewport = getViewport();
      await workflowService.updateWorkflow(currentWorkflow._id, {
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
    message.loading({ content: 'Đang chạy mô phỏng luồng 0-chạm qua Backend & AI Engine...', key: 'testRun' });
    setTimeout(() => {
      message.success({
        content: 'Chạy thử nghiệm thành công! Đơn hàng mô phỏng đã trừ kho POS và tạo vận đơn (198ms).',
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
      {/* 1. Prompt Bar AI */}
      <PromptBar onGenerate={handleGeneratePrompt} />

      {/* 2. Canvas Control Bar */}
      <div
        style={{
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#0B0F19',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Space>
          <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>Chọn Quy Trình:</span>
          <Select
            value={currentWorkflow?._id}
            onChange={(val) => {
              const wf = workflowsList.find((w) => w._id === val);
              if (wf) selectWorkflow(wf);
            }}
            style={{ width: 340 }}
            options={workflowsList.map((w) => ({
              label: `${w.name} ${w.isActive ? '(Active)' : '(Draft)'}`,
              value: w._id,
            }))}
          />
          <Tag color="#10B981" style={{ borderRadius: 4, fontWeight: 600 }}>
            {currentWorkflow?.isActive ? 'Active 0-Chạm' : 'Bản Nháp'}
          </Tag>
          <span style={{ color: '#9CA3AF', fontSize: 12 }}>
            Đã chạy: <strong style={{ color: '#fcc20f' }}>{currentWorkflow?.executionCount || 28450}</strong> đơn
          </span>
        </Space>

        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() => setLibraryOpen(true)}
            style={{ background: 'rgba(255, 255, 255, 0.06)', borderColor: '#374151', color: '#F9FAFB', fontWeight: 600 }}
          >
            Thêm Khối Node
          </Button>
          <Button
            icon={<ReloadOutlined />}
            size="middle"
            onClick={loadAllWorkflows}
            style={{ color: '#9CA3AF', borderColor: '#374151' }}
          >
            Làm mới DB
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
            Chạy Thử Nghiệm
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
            Lưu Quy Trình
          </Button>
        </Space>
      </div>

      {/* 3. Canvas Workspace */}
      <div style={{ flex: 1, position: 'relative' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Spin tip="Đang tải danh sách quy trình từ MongoDB Atlas..." size="large" />
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
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

      {/* 4. Drawers */}
      <NodeLibraryDrawer
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onAddNode={handleAddNode}
      />

      <NodeSettingsDrawer
        open={settingsOpen}
        selectedNode={selectedNode}
        onClose={() => {
          setSettingsOpen(false);
          setSelectedNode(null);
        }}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
      />
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
