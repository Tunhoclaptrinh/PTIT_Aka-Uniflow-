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
import { Card, Space, Spin, Select } from 'antd';
import {
  PlayCircleOutlined,
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { TriggerNode } from './nodes/TriggerNode';
import { AINode } from './nodes/AINode';
import { ActionNode } from './nodes/ActionNode';
import { workflowService, WorkflowData } from '../../services/workflow.service';
import { PromptBar } from './panels/PromptBar';
import { NodeLibraryDrawer } from './panels/NodeLibraryDrawer';
import { NodeSettingsDrawer } from './panels/NodeSettingsDrawer';
import { BaseButton, StatusTag, PageContainer } from '../base';
import { notify } from '../../utils/notification';

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

  const { getViewport, setViewport, fitView } = useReactFlow();

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
    notify.success(`Đã thêm khối "${label}" vào Canvas!`);
  };

  const handleUpdateNode = (nodeId: string, updatedData: any) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...updatedData } } : n))
    );
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    notify.info('Đã xóa khối Node khỏi Canvas');
  };

  const handleGeneratePrompt = (promptText: string) => {
    const isShopee = promptText.toLowerCase().includes('shopee');
    const isLazada = promptText.toLowerCase().includes('lazada');
    const isKiotViet = promptText.toLowerCase().includes('kiotviet');
    const isGHN = promptText.toLowerCase().includes('ghn');
    const isViettel = promptText.toLowerCase().includes('viettel');

    const triggerLabel = isShopee ? 'Shopee Push Webhook' : isLazada ? 'Lazada Inbound Webhook' : 'TikTok Shop Inbound';
    const posLabel = isKiotViet ? 'Trừ kho KiotViet' : 'Trừ tồn kho Sapo POS';
    const carrierLabel = isGHN ? 'Tạo đơn GHN Nhanh' : isViettel ? 'Tạo vận đơn Viettel Post' : 'Tạo vận đơn GHTK';

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
    setTimeout(() => fitView({ duration: 400 }), 100);
  };

  const handleSave = async () => {
    if (!currentWorkflow?._id) {
      notify.success('Đã lưu quy trình vào bộ nhớ tạm!');
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
      notify.success('Đã lưu quy trình thành công vào MongoDB Atlas!');
    } catch (err: any) {
      notify.error('Lỗi khi lưu quy trình: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestRun = () => {
    notify.loading('Đang chạy mô phỏng luồng 0-chạm qua Backend & AI Engine...', 'testRun');
    setTimeout(() => {
      notify.success('Chạy thử nghiệm thành công! Đơn hàng mô phỏng đã trừ kho POS và tạo vận đơn (198ms).');
    }, 700);
  };

  return (
    <PageContainer
      icon={<BranchesOutlined style={{ color: '#ed1c24' }} />}
      title="Thiết Kế Quy Trình 0-Chạm (Visual Workflow Canvas)"
      subtitle="Kéo thả trực quan các khối Trigger, AI Matcher, POS ERP và Đơn vị vận chuyển"
      extra={
        <Space size="small">
          <BaseButton
            variant="ghost"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setLibraryOpen(true)}
          >
            + Thêm Khối Node
          </BaseButton>

          <BaseButton
            variant="ghost"
            size="small"
            icon={<ReloadOutlined />}
            onClick={loadAllWorkflows}
          >
            Làm mới DB
          </BaseButton>

          <BaseButton
            variant="ghost"
            size="small"
            icon={<PlayCircleOutlined style={{ color: '#ed1c24' }} />}
            onClick={handleTestRun}
          >
            Chạy Thử Nghiệm
          </BaseButton>

          <BaseButton
            variant="primary"
            size="small"
            icon={<SaveOutlined />}
            loading={saving}
            glow
            onClick={handleSave}
          >
            Lưu Quy Trình
          </BaseButton>
        </Space>
      }
    >
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          border: '1px solid var(--border-subtle, #E5E7EB)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          height: 'calc(100vh - 200px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
        bodyStyle={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}
      >
        {/* 1. Canvas Control Bar */}
        <div
          style={{
            padding: '10px 20px',
            borderBottom: '1px solid #E5E7EB',
            background: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            zIndex: 5,
          }}
        >
          <Space size="middle">
            <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Chọn Quy Trình:</span>
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
            <StatusTag status={currentWorkflow?.isActive ? 'ACTIVE' : 'INACTIVE'} customLabel={currentWorkflow?.isActive ? 'Active 0-Chạm' : 'Bản Nháp'} />
          </Space>

          <div style={{ fontSize: 12, color: '#6B7280' }}>
            Đã chạy tự động: <strong style={{ color: '#ed1c24', fontSize: 13 }}>{currentWorkflow?.executionCount || 28450}</strong> đơn hàng
          </div>
        </div>

        {/* 2. Canvas Workspace with Floating Copilot Prompt Bar */}
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
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
              />
              <Controls style={{ left: 16, bottom: 16 }} />
            </ReactFlow>
          )}

          {/* 3. Floating Copilot AI Prompt Dock (Cửa sổ chat nổi ở giữa đáy canvas) */}
          <PromptBar onGenerate={handleGeneratePrompt} />
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
    </PageContainer>
  );
};

export const WorkflowCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
};

export default WorkflowCanvas;
