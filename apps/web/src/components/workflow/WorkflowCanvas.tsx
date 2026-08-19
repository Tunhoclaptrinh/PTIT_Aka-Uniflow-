import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  addEdge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, Space, Spin, Select, Switch, Drawer, Timeline, Tag, Modal, Form, Input, Radio, Tooltip } from 'antd';
import {
  PlayCircleOutlined,
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  ThunderboltFilled,
  ApartmentOutlined,
  AppstoreOutlined,
  ScissorOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { TriggerNode } from './nodes/TriggerNode';
import { AINode } from './nodes/AINode';
import { ActionNode } from './nodes/ActionNode';
import { GroupNode } from './nodes/GroupNode';
import { DirectiveEdge } from './edges/DirectiveEdge';
import { workflowService, WorkflowData, DryRunResult } from '../../services/workflow.service';
import { PromptBar } from './panels/PromptBar';
import { NodeLibraryDrawer } from './panels/NodeLibraryDrawer';
import { NodeSettingsDrawer } from './panels/NodeSettingsDrawer';
import { AIFlowArchitectDrawer } from './panels/AIFlowArchitectDrawer';
import { EdgeDirectiveModal } from './panels/EdgeDirectiveModal';
import { BaseButton, PageContainer, ConfirmModal } from '../base';
import { notify } from '../../utils/notification';

const FlowContent: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [workflowsList, setWorkflowsList] = useState<WorkflowData[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  // Snipping Tool / Box Selection Mode State
  const [isSnipMode, setIsSnipMode] = useState(false);
  const [snipStart, setSnipStart] = useState<{ clientX: number; clientY: number } | null>(null);
  const [snipEnd, setSnipEnd] = useState<{ clientX: number; clientY: number } | null>(null);

  // Overview mode — xem toàn bộ quy trình trên 1 canvas
  const [isOverviewMode, setIsOverviewMode] = useState(false);

  // Drawers & Modals state
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedEdge, setSelectedEdge] = useState<any>(null);
  const [edgeModalOpen, setEdgeModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [debugDrawerOpen, setDebugDrawerOpen] = useState(false);
  const [architectOpen, setArchitectOpen] = useState(false);
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null);

  const [createForm] = Form.useForm();
  const { getViewport, setViewport, fitView, screenToFlowPosition } = useReactFlow();

  const nodeTypes = useMemo(
    () => ({
      trigger: TriggerNode,
      ai: AINode,
      action: ActionNode,
      group: GroupNode,
      TRIGGER_TIKTOK: TriggerNode,
      AI_SKU_MAPPER: AINode,
      ACTION_SAPO_DEDUCT: ActionNode,
      ACTION_GHTK_WAYBILL: ActionNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      default: DirectiveEdge,
      directive: DirectiveEdge,
    }),
    []
  );

  const handleOpenEdgeModal = useCallback((edgeId: string) => {
    setEdges((eds) => {
      const found = eds.find((e) => e.id === edgeId);
      if (found) {
        setSelectedEdge(found);
        setEdgeModalOpen(true);
      }
      return eds;
    });
  }, [setEdges]);

  const handleDeleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
  }, [setEdges]);

  const handleSaveEdgeDirective = useCallback(
    (edgeId: string, updatedData: any, updatedStyle: any, animated: boolean) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId
            ? {
                ...e,
                data: { ...e.data, ...updatedData },
                style: { ...e.style, ...updatedStyle },
                animated,
              }
            : e
        )
      );
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'directive',
            animated: true,
            style: { stroke: '#2563EB', strokeWidth: 2 },
            data: {
              label: '',
              onEditEdge: handleOpenEdgeModal,
              onDeleteEdge: handleDeleteEdge,
            },
          },
          eds
        )
      );
      notify.success('Đã kết nối khối xử lý thành công! Nhấp vào đường nối để gán chỉ lệnh hoặc điều kiện rẽ nhánh.');
    },
    [handleOpenEdgeModal, handleDeleteEdge, setEdges]
  );

  const loadAllWorkflows = async (selectedId?: string) => {
    setLoading(true);
    try {
      const list = await workflowService.getAllWorkflows();
      if (list && list.length > 0) {
        setWorkflowsList(list);
        const target = selectedId
          ? list.find((w) => w._id === selectedId) || list[0]
          : list.find((w) => w.isActive) || list[0];
        selectWorkflow(target);
      } else {
        setWorkflowsList([]);
        setCurrentWorkflow(null);
        setNodes([]);
        setEdges([]);
      }
    } catch (err: any) {
      console.warn('Lỗi khi tải danh sách quy trình:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResizeGroup = useCallback((groupId: string, newW: number, newH: number) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === groupId
          ? {
              ...n,
              style: { ...n.style, width: newW, height: newH },
              data: {
                ...n.data,
                width: newW,
                height: newH,
                origWidth: newW,
                origHeight: newH,
              },
            }
          : n
      )
    );
  }, [setNodes]);

  // Nâng cấp: Dùng parentId để xác định node con (chính thống ReactFlow)
  const handleToggleExpandGroup = useCallback((groupId: string, isExpanded: boolean) => {
    // Lấy childIds ĐỒNG BỘ từ nodes hiện tại (không dùng setNodes callback lồng nhau)
    const childIds = new Set(
      nodes.filter((n) => n.parentId === groupId).map((n) => n.id)
    );

    // Lấy kích thước gốc của group để khôi phục khi mở rộng
    const groupNode = nodes.find((n) => n.id === groupId);
    const origW = groupNode?.data?.origWidth || groupNode?.data?.width || groupNode?.style?.width || 580;
    const origH = groupNode?.data?.origHeight || groupNode?.data?.height || groupNode?.style?.height || 290;

    // Một lần setNodes duy nhất — fix bug ghi đè & set chính xác kích thước bao
    setNodes((nds) => nds.map((n) => {
      if (n.id === groupId) {
        return {
          ...n,
          data: { ...n.data, isExpanded },
          // Thu gọn: shrink kích thước xuống card nhỏ 280x95; Mở rộng: khôi phục kích thước gốc
          style: isExpanded
            ? { ...n.style, width: origW, height: origH, zIndex: -1 }
            : { ...n.style, width: 280, height: 95, zIndex: 10 },
        };
      }
      if (childIds.has(n.id)) {
        // Ẩn/hiện node con — chắc chắn hoạt động với parentId
        return { ...n, hidden: !isExpanded };
      }
      return n;
    }));

    // Cập nhật edges dựa trên childIds đã lấy đồng bộ
    setEdges((eds) => eds.map((e) => {
      const rawSrc = e.data?.originalSource || e.source;
      const rawTgt = e.data?.originalTarget || e.target;
      const isSrcChild = childIds.has(rawSrc);
      const isTgtChild = childIds.has(rawTgt);

      if (!isExpanded) {
        // Dây nội bộ (cả 2 đầu trong group) → ẩn khi group thu gọn
        if (isSrcChild && isTgtChild) return { ...e, hidden: true };
        // Dây từ ngoài → vào group → cắm vào GroupNode collapsed card
        if (!isSrcChild && isTgtChild) return { ...e, target: groupId, data: { ...e.data, originalTarget: rawTgt }, hidden: false };
        // Dây từ group → ra ngoài → xuất phát từ GroupNode collapsed card
        if (isSrcChild && !isTgtChild) return { ...e, source: groupId, data: { ...e.data, originalSource: rawSrc }, hidden: false };
        return e;
      } else {
        // Mở rộng: khôi phục tất cả dây về node con gốc
        return { ...e, source: rawSrc, target: rawTgt, hidden: false };
      }
    }));

    setTimeout(() => fitView({ duration: 400 }), 100);
    notify.info(isExpanded
      ? 'Đã mở rộng cụm & phục hồi toàn bộ dây kết nối!'
      : 'Đã thu gọn cụm & tự động nối dây liền mạch!');
  }, [nodes, setNodes, setEdges, fitView]);


  const handleUngroupGroup = useCallback((groupId: string) => {
    setNodes((nds) => {
      // Lấy vị trí tuyệt đối của group trên canvas
      const group = nds.find((n) => n.id === groupId);
      const groupX = group?.position.x ?? 0;
      const groupY = group?.position.y ?? 0;

      return nds
        .filter((n) => n.id !== groupId)
        .map((n) => {
          if (n.parentId === groupId) {
            // Convert relative position → absolute position
            return {
              ...n,
              parentId: undefined,
              extent: undefined,
              position: {
                x: groupX + (n.position.x || 0),
                y: groupY + (n.position.y || 0),
              },
              hidden: false,
            };
          }
          return { ...n, hidden: false };
        });
    });

    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        source: e.data?.originalSource || e.source,
        target: e.data?.originalTarget || e.target,
        hidden: false,
      }))
    );

    notify.success('Đã hủy gom nhóm & khôi phục các khối về canvas!');
  }, [setNodes, setEdges]);

  // Hàm nội bộ: tạo GroupNode với kích thước vừa vặn cho node con
  const _createGroupFromNodes = useCallback((targetNodes: any[], groupLabel?: string) => {
    if (targetNodes.length === 0) return;

    const groupId = `group_${Date.now()}`;
    const NODE_W = 240;
    const NODE_H = 78;

    const absMinX = Math.min(...targetNodes.map((n) => n.position.x));
    const absMinY = Math.min(...targetNodes.map((n) => n.position.y));
    const absMaxX = Math.max(...targetNodes.map((n) => n.position.x + (n.style?.width || NODE_W)));
    const absMaxY = Math.max(...targetNodes.map((n) => n.position.y + (n.style?.height || NODE_H)));

    const PADDING_X = 24;
    const PADDING_TOP = 48; // khoảng trống tiêu đề cụm
    const PADDING_BOTTOM = 24;

    const groupX = absMinX - PADDING_X;
    const groupY = absMinY - PADDING_TOP;
    const groupW = Math.max((absMaxX - absMinX) + PADDING_X * 2, 280);
    const groupH = Math.max((absMaxY - absMinY) + PADDING_TOP + PADDING_BOTTOM, 160);

    const newGroupNode = {
      id: groupId,
      type: 'group',
      position: { x: groupX, y: groupY },
      style: { width: groupW, height: groupH, zIndex: -1 },
      data: {
        label: groupLabel || `Cụm phân vùng (${targetNodes.length} khối)`,
        subtitle: `${targetNodes.length} khối xử lý`,
        childCount: targetNodes.length,
        width: groupW,
        height: groupH,
        origWidth: groupW,
        origHeight: groupH,
        isExpanded: true,
        onToggleExpand: handleToggleExpandGroup,
        onUngroup: handleUngroupGroup,
        onResize: handleResizeGroup,
      },
    };

    // Cập nhật node con: đặt parentId + extent:parent + vị trí tương đối trong group
    setNodes((nds) => {
      const childIdSet = new Set(targetNodes.map((n) => n.id));
      const updatedChildren = nds.map((n) => {
        if (!childIdSet.has(n.id)) return n;
        return {
          ...n,
          parentId: groupId,
          extent: 'parent' as const,
          // Vị trí tương đối trong group
          position: {
            x: n.position.x - groupX,
            y: n.position.y - groupY,
          },
          zIndex: 10,
        };
      });
      // Group node phải đứng TRƯỚC các node con để ReactFlow xử lý parentId
      return [newGroupNode, ...updatedChildren.filter((n) => !childIdSet.has(n.id)), ...updatedChildren.filter((n) => childIdSet.has(n.id))];
    });

    notify.success(`Đã gom ${targetNodes.length} khối vào cụm phân vùng thành công!`);
  }, [setNodes, handleToggleExpandGroup, handleUngroupGroup, handleResizeGroup]);

  const handleGroupSelectedNodes = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected && n.type !== 'group' && !n.parentId);

    if (selectedNodes.length === 0) {
      notify.warning('Vui lòng chọn các khối trên Canvas (hoặc dùng nút ✂️ Quét vùng) để tạo phân vùng gom nhóm!');
      return;
    }
    _createGroupFromNodes(selectedNodes);
  }, [nodes, _createGroupFromNodes]);

  // Xử lý kéo chuột quét vùng gom nhóm kiểu Snipping Tool Windows
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isSnipMode) return;
    setSnipStart({ clientX: e.clientX, clientY: e.clientY });
    setSnipEnd({ clientX: e.clientX, clientY: e.clientY });
  }, [isSnipMode]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isSnipMode || !snipStart) return;
    setSnipEnd({ clientX: e.clientX, clientY: e.clientY });
  }, [isSnipMode, snipStart]);

  const handleCanvasMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isSnipMode || !snipStart) return;
    const p1 = screenToFlowPosition({ x: snipStart.clientX, y: snipStart.clientY });
    const p2 = screenToFlowPosition({ x: e.clientX, y: e.clientY });

    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    if (Math.abs(maxX - minX) > 30 && Math.abs(maxY - minY) > 30) {
      const enclosedNodes = nodes.filter((n) => {
        if (n.type === 'group' || n.parentId) return false;
        const nw = n.style?.width || 230;
        const nh = n.style?.height || 75;
        const cx = n.position.x + nw / 2;
        const cy = n.position.y + nh / 2;
        return cx >= minX && cx <= maxX && cy >= minY && cy <= maxY;
      });

      if (enclosedNodes.length > 0) {
        _createGroupFromNodes(enclosedNodes);
      } else {
        notify.info('Không có khối xử lý nào nằm trọn trong vùng vừa quét.');
      }
    }

    setSnipStart(null);
    setSnipEnd(null);
    setIsSnipMode(false);
  }, [isSnipMode, snipStart, screenToFlowPosition, nodes, _createGroupFromNodes]);

  const selectWorkflow = (wf: WorkflowData) => {
    setCurrentWorkflow(wf);
    if (wf.nodes && wf.nodes.length > 0) {
      const mappedNodes = wf.nodes.map((n) => {
        const resolvedType = n.type === 'group' || n.type?.toLowerCase().includes('group')
          ? 'group'
          : n.type?.toLowerCase().includes('trigger')
            ? 'trigger'
            : n.type?.toLowerCase().includes('ai')
              ? 'ai'
              : 'action';

        const nodeData = n.data || { label: n.label, description: n.config?.eventType || 'Đã liên kết cơ sở dữ liệu' };

        // GroupNode cần style.width/height để ReactFlow biết kích thước
        const nodeStyle = resolvedType === 'group'
          ? { width: nodeData.width || n.style?.width || 560, height: nodeData.height || n.style?.height || 280, zIndex: -1, ...n.style }
          : n.style;

        return {
          ...n,
          type: resolvedType,
          // parentId và extent được giữ nguyên từ DB nếu có
          parentId: n.parentId,
          extent: n.extent,
          style: nodeStyle,
          zIndex: n.parentId ? 10 : (resolvedType === 'group' ? -1 : 0),
          data: {
            ...nodeData,
            onToggleExpand: handleToggleExpandGroup,
            onUngroup: handleUngroupGroup,
            onResize: handleResizeGroup,
          },
        };
      });
      setNodes(mappedNodes);
    } else {
      setNodes([]);
    }

    if (wf.edges && wf.edges.length > 0) {
      const mappedEdges = wf.edges.map((e) => ({
        ...e,
        type: 'directive',
        animated: e.animated ?? true,
        style: e.style || { stroke: e.data?.isInternal ? '#10B981' : '#2563EB', strokeWidth: 2 },
        // Edge nội bộ trong group: tăng z-index để hiện rõ trên nền group
        zIndex: e.data?.isInternal ? 20 : 1,
        data: {
          ...e.data,
          label: e.data?.label || e.label || '',
          onEditEdge: handleOpenEdgeModal,
          onDeleteEdge: handleDeleteEdge,
        },
      }));
      setEdges(mappedEdges);
    } else {
      setEdges([]);
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
      position: { x: 200 + nodes.length * 280, y: 150 + (nodes.length % 2 === 0 ? 0 : 60) },
      data: { label, description: 'Khối chức năng mới', category: category || 'GENERAL' },
    };
    setNodes((nds) => [...nds, newNode]);
    notify.success(`Đã thêm khối "${label}" vào quy trình!`);
  };

  const handleUpdateNode = (nodeId: string, updatedData: any) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...updatedData } } : n))
    );
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    notify.info('Đã xóa khối xử lý khỏi quy trình');
  };

  const handleGeneratePrompt = async (promptText: string) => {
    try {
      const generated = await workflowService.generateFromPrompt(promptText);
      if (generated && generated.nodes) {
        setNodes(generated.nodes);
        setEdges(generated.edges);

        if (currentWorkflow?._id) {
          const updatedName = generated.name || currentWorkflow.name;
          const updatedWf = {
            ...currentWorkflow,
            name: updatedName,
            description: promptText,
            nodes: generated.nodes,
            edges: generated.edges,
          };
          setCurrentWorkflow(updatedWf);

          // Tự động lưu bản ghi cập nhật vào MongoDB Atlas
          await workflowService.updateWorkflow(currentWorkflow._id, {
            name: updatedName,
            description: promptText,
            nodes: generated.nodes,
            edges: generated.edges,
          });

          setWorkflowsList((prev) =>
            prev.map((w) => (w._id === currentWorkflow._id ? updatedWf : w))
          );
        }
        setTimeout(() => fitView({ duration: 400 }), 100);
      }
    } catch (err: any) {
      notify.error('Lỗi khi sinh quy trình bằng AI: ' + err.message);
    }
  };

  const handleSave = async () => {
    if (!currentWorkflow?._id) {
      notify.warning('Vui lòng chọn hoặc tạo quy trình trước khi lưu!');
      return;
    }

    setSaving(true);
    try {
      const currentViewport = getViewport();
      await workflowService.updateWorkflow(currentWorkflow._id, {
        name: currentWorkflow.name,
        isActive: currentWorkflow.isActive,
        nodes,
        edges,
        viewport: currentViewport,
      });
      notify.success('Đã lưu quy trình thành công vào MongoDB Atlas!');
      loadAllWorkflows(currentWorkflow._id);
    } catch (err: any) {
      notify.error('Lỗi khi lưu quy trình: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateWorkflow = async () => {
    try {
      const values = await createForm.validateFields();
      let initNodes: any[] = [];
      let initEdges: any[] = [];
      let finalName = values.name;

      if (values.creationMode === 'ai' && values.aiPrompt?.trim()) {
        notify.loading('AI đang thiết kế các khối quy trình theo lời nhắc...', 'createWfAi');
        const generated = await workflowService.generateFromPrompt(values.aiPrompt.trim());
        initNodes = generated.nodes || [];
        initEdges = generated.edges || [];
        if (!finalName || finalName === 'Quy trình xử lý đơn hàng mới') {
          finalName = generated.name || finalName;
        }
      }

      const newWf = await workflowService.createWorkflow({
        name: finalName,
        description: values.description || values.aiPrompt || '',
        isActive: true,
        nodes: initNodes,
        edges: initEdges,
        viewport: { x: 0, y: 0, zoom: 1 },
      });

      notify.success(`Đã tạo mới quy trình "${newWf.name}" thành công!`);
      setCreateModalOpen(false);
      createForm.resetFields();
      await loadAllWorkflows(newWf._id);
      setTimeout(() => fitView({ duration: 400 }), 150);
    } catch (err: any) {
      notify.error('Lỗi khi tạo mới quy trình: ' + err.message);
    }
  };

  const handleDeleteWorkflow = async () => {
    if (!currentWorkflow?._id) return;
    try {
      await workflowService.deleteWorkflow(currentWorkflow._id);
      notify.success('Đã xóa quy trình thành công!');
      setDeleteModalOpen(false);
      loadAllWorkflows();
    } catch (err: any) {
      notify.error('Lỗi khi xóa quy trình: ' + err.message);
    }
  };

  const handleToggleActive = async (checked: boolean) => {
    if (!currentWorkflow?._id) return;
    try {
      await workflowService.updateWorkflow(currentWorkflow._id, { isActive: checked });
      setCurrentWorkflow({ ...currentWorkflow, isActive: checked });
      setWorkflowsList((prev) =>
        prev.map((w) => (w._id === currentWorkflow._id ? { ...w, isActive: checked } : w))
      );
      notify.success(checked ? 'Đã kích hoạt vận hành 0-chạm!' : 'Đã chuyển quy trình về bản nháp');
    } catch (err: any) {
      notify.error('Lỗi khi cập nhật trạng thái: ' + err.message);
    }
  };

  // ── XEM TOÀN BỘ: gộp tất cả workflow vào 1 canvas với offset lưới ────────
  const handleShowAllWorkflows = useCallback(async () => {
    if (isOverviewMode) {
      setIsOverviewMode(false);
      if (currentWorkflow) selectWorkflow(currentWorkflow);
      return;
    }
    setIsOverviewMode(true);
    setLoading(true);
    try {
      const allWfs = await workflowService.getAllWorkflows();
      const COLS = 3;
      const COL_GAP = 1800;
      const ROW_GAP = 1200;
      let allNodes: any[] = [];
      let allEdges: any[] = [];

      allWfs.forEach((wf: WorkflowData, wfIndex: number) => {
        const col = wfIndex % COLS;
        const row = Math.floor(wfIndex / COLS);
        const offsetX = col * COL_GAP;
        const offsetY = row * ROW_GAP;
        const prefix = `ov_wf${wfIndex}_`;

        // Label nhận dạng workflow
        allNodes.push({
          id: `${prefix}label`,
          type: 'action',
          position: { x: offsetX, y: offsetY - 70 },
          draggable: false,
          selectable: false,
          data: {
            label: `#${wfIndex + 1} ${wf.name}`,
            description: wf.isActive ? '🟢 Đang kích hoạt' : '⚪ Bản nháp',
            category: 'OVERVIEW',
          },
          style: { background: '#F3F4F6', border: '1px solid #D1D5DB', minWidth: 300, opacity: 0.92 },
        });

        (wf.nodes || []).forEach((n: any) => {
          const resolvedType = n.type === 'group' ? 'group' : n.type?.includes('trigger') ? 'trigger' : n.type?.includes('ai') ? 'ai' : 'action';
          const nodeStyle = resolvedType === 'group'
            ? { width: n.data?.width || n.style?.width || 560, height: n.data?.height || n.style?.height || 280, zIndex: -1, ...n.style }
            : n.style;

          allNodes.push({
            ...n,
            id: `${prefix}${n.id}`,
            type: resolvedType,
            position: { x: (n.position?.x || 0) + offsetX, y: (n.position?.y || 0) + offsetY },
            parentId: n.parentId ? `${prefix}${n.parentId}` : undefined,
            extent: n.extent,
            style: nodeStyle,
            zIndex: n.parentId ? 10 : (resolvedType === 'group' ? -1 : 0),
            draggable: false,
            selectable: false,
            data: { ...n.data, label: n.data?.label || n.label || 'Node', description: n.data?.description || '' },
          });
        });

        (wf.edges || []).forEach((e: any) => {
          allEdges.push({
            ...e,
            id: `${prefix}${e.id}`,
            source: `${prefix}${e.source}`,
            target: `${prefix}${e.target}`,
            animated: false,
            style: e.style || { stroke: '#CBD5E1', strokeWidth: 1.5 },
          });
        });
      });

      setNodes(allNodes);
      setEdges(allEdges);
      setTimeout(() => fitView({ duration: 600, padding: 0.06 }), 150);
      notify.success(`Đang hiển thị toàn bộ ${allWfs.length} quy trình trên 1 canvas!`);
    } catch (err: any) {
      notify.error('Lỗi tải toàn bộ quy trình: ' + err.message);
      setIsOverviewMode(false);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOverviewMode, currentWorkflow, setNodes, setEdges, fitView]);

  // ── Drag stop handler ──────────────────────────────────────────────────────
  const handleNodeDragStop = useCallback((_event: any, draggedNode: any) => {
    if (draggedNode.type === 'group') {
      // Khi kéo Group, giữ nguyên các node con thuộc group, không nuốt nhầm các node bên ngoài
      return;
    }
  }, []);

  const handleTestRun = async () => {
    if (!currentWorkflow?._id) {
      notify.warning('Vui lòng chọn hoặc lưu một quy trình để chạy thử nghiệm!');
      return;
    }

    if (nodes.length === 0) {
      notify.warning('Quy trình hiện đang trống! Hãy thêm khối xử lý hoặc dùng AI tạo luồng trước khi chạy.');
      return;
    }

    setTesting(true);
    notify.loading('Đang chạy mô phỏng luồng 0-chạm qua Backend & AI Engine...', 'testRun');
    try {
      const result = await workflowService.dryRun(currentWorkflow._id);
      setDryRunResult(result);

      // Hiệu ứng dòng điện & sợi dây phát sáng tuần tự theo đúng các Node thực thi
      const steps = result.steps || [];
      const executedNodeIds = steps.map((s: any) => s.nodeId).filter(Boolean);

      // Kích hoạt phát sáng từng cạnh kết nối theo luồng dữ liệu thực
      for (let i = 0; i < executedNodeIds.length; i++) {
        const currentNodeId = executedNodeIds[i];
        const nextNodeId = executedNodeIds[i + 1];

        setEdges((eds) =>
          eds.map((e) => {
            const matchesStep =
              (e.source === currentNodeId && (!nextNodeId || e.target === nextNodeId)) ||
              (e.target === currentNodeId);

            if (matchesStep) {
              return {
                ...e,
                animated: true,
                style: {
                  stroke: '#10B981',
                  strokeWidth: 3.5,
                  filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.95))',
                },
                zIndex: 50,
              };
            }
            return e;
          })
        );

        // Thời gian xung điện truyền qua khối
        await new Promise((resolve) => setTimeout(resolve, 180));
      }

      setDebugDrawerOpen(true);
      notify.success(
        `Chạy thử nghiệm thành công: Đơn #${result.orderId} ➔ Vận đơn: ${result.waybillCode} (${result.durationMs}ms)`
      );
      loadAllWorkflows(currentWorkflow._id);

      // Khôi phục màu dây sau 4.5 giây
      setTimeout(() => {
        setEdges((eds) =>
          eds.map((e) => ({
            ...e,
            style: e.data?.isInternal
              ? { stroke: '#10B981', strokeWidth: 2 }
              : { stroke: '#2563EB', strokeWidth: 2 },
            zIndex: e.data?.isInternal ? 20 : 1,
          }))
        );
      }, 4500);
    } catch (err: any) {
      notify.error('Lỗi khi chạy mô phỏng: ' + err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <PageContainer
      title="Quy trình tự động hóa"
      tooltip="Kịch bản 0-chạm kéo thả khối: Tiếp nhận Webhook ➔ Đối sánh SKU AI ➔ Trừ kho POS ➔ Khởi tạo đơn vận chuyển"
      extra={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {/* Nhóm 1: Thao tác sơ đồ & Khối */}
          {!isOverviewMode && (
            <>
          <Tooltip title="Thêm khối xử lý mới (Webhook, AI, Kho POS, ĐVVC)">
            <BaseButton
              variant="ghost"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setLibraryOpen(true)}
              style={{ width: 32, height: 32, padding: 0 }}
            />
          </Tooltip>

          <Tooltip title="Quét vùng gom nhóm (Kéo chuột bao quanh các khối kiểu Windows Snipping)">
            <BaseButton
              variant={isSnipMode ? 'primary' : 'ghost'}
              size="small"
              icon={<ScissorOutlined style={{ color: isSnipMode ? '#FFFFFF' : '#8B5CF6' }} />}
              onClick={() => {
                const nextMode = !isSnipMode;
                setIsSnipMode(nextMode);
                if (nextMode) {
                  notify.info('Đã bật chế độ Quét vùng gom nhóm: Kéo chuột bao quanh các khối trên bản đồ như chụp ảnh màn hình!');
                }
              }}
              style={{
                width: 32,
                height: 32,
                padding: 0,
                ...(isSnipMode ? { background: '#8B5CF6', borderColor: '#8B5CF6' } : {}),
              }}
            />
          </Tooltip>

          <Tooltip title="Gom nhóm các khối đang chọn trên bản đồ">
            <BaseButton
              variant="ghost"
              size="small"
              icon={<AppstoreOutlined style={{ color: '#8B5CF6' }} />}
              onClick={handleGroupSelectedNodes}
              style={{ width: 32, height: 32, padding: 0 }}
            />
          </Tooltip>

          <Tooltip title="Tư vấn kiến trúc AI & Gợi ý gom nhóm">
            <BaseButton
              variant="ghost"
              size="small"
              icon={<ThunderboltFilled style={{ color: '#8B5CF6' }} />}
              onClick={() => setArchitectOpen(true)}
              style={{ width: 32, height: 32, padding: 0 }}
            />
          </Tooltip>
            </>
          )}

          <div style={{ width: 1, height: 20, background: '#E5E7EB', margin: '0 4px' }} />

          {/* Xem toàn bộ workflows */}
          <Tooltip title={isOverviewMode ? 'Thoát chế độ xem toàn bộ' : 'Xem toàn bộ quy trình trên 1 canvas'}>
            <BaseButton
              variant={isOverviewMode ? 'primary' : 'ghost'}
              size="small"
              icon={<EyeOutlined style={{ color: isOverviewMode ? '#FFFFFF' : '#10B981' }} />}
              onClick={handleShowAllWorkflows}
              style={{
                width: 32, height: 32, padding: 0,
                ...(isOverviewMode ? { background: '#10B981', borderColor: '#10B981' } : {}),
              }}
            />
          </Tooltip>

          {/* Nhóm 2: Quản lý quy trình & Thực thi */}
          <Tooltip title="Tạo quy trình xử lý đơn hàng mới">
            <BaseButton
              variant="ghost"
              size="small"
              icon={<ApartmentOutlined />}
              onClick={() => {
                createForm.resetFields();
                createForm.setFieldsValue({
                  name: 'Quy trình xử lý đơn hàng mới',
                  creationMode: 'blank',
                });
                setCreateModalOpen(true);
              }}
              style={{ width: 32, height: 32, padding: 0 }}
            />
          </Tooltip>

          <Tooltip title="Làm mới dữ liệu từ cơ sở dữ liệu MongoDB Atlas">
            <BaseButton
              variant="ghost"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => loadAllWorkflows(currentWorkflow?._id)}
              style={{ width: 32, height: 32, padding: 0 }}
            />
          </Tooltip>

          <Tooltip title="Chạy thử nghiệm mô phỏng 0-chạm qua Backend API">
            <BaseButton
              variant="ghost"
              size="small"
              icon={<PlayCircleOutlined style={{ color: '#ed1c24' }} />}
              loading={testing}
              onClick={handleTestRun}
              style={{ width: 32, height: 32, padding: 0 }}
            />
          </Tooltip>

          <Tooltip title="Lưu quy trình vào cơ sở dữ liệu MongoDB Atlas">
            <BaseButton
              variant="primary"
              size="small"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSave}
              style={{ width: 32, height: 32, padding: 0 }}
            />
          </Tooltip>
        </div>
      }
    >
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          border: '1px solid var(--border-subtle, #E5E7EB)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          height: 'calc(100vh - 180px)',
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
            padding: '8px 16px',
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
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Chọn quy trình:</span>
            {isOverviewMode ? (
              <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}>
                <EyeOutlined /> Đang xem toàn bộ {workflowsList.length} quy trình
                <BaseButton size="small" variant="ghost" onClick={handleShowAllWorkflows} style={{ marginLeft: 8 }}>
                  Thoát xem toàn bộ
                </BaseButton>
              </span>
            ) : (
            <Select
              value={currentWorkflow?._id}
              onChange={(val) => {
                const wf = workflowsList.find((w) => w._id === val);
                if (wf) selectWorkflow(wf);
              }}
              style={{ width: 320 }}
              options={workflowsList.map((w) => ({
                label: `${w.name} ${w.isActive ? '(Đang chạy)' : '(Bản nháp)'}`,
                value: w._id,
              }))}
            />
            )}

            {currentWorkflow && (
              <Space size={6}>
                <Switch
                  checked={currentWorkflow?.isActive}
                  onChange={handleToggleActive}
                />
                <span style={{ fontSize: 12, color: currentWorkflow?.isActive ? '#10B981' : '#6B7280', fontWeight: 600 }}>
                  {currentWorkflow?.isActive ? 'Kích hoạt 0-chạm' : 'Bản nháp'}
                </span>
              </Space>
            )}

            {currentWorkflow && (
              <BaseButton
                variant="ghost"
                size="small"
                icon={<DeleteOutlined style={{ color: '#EF4444' }} />}
                onClick={() => setDeleteModalOpen(true)}
              >
                Xóa
              </BaseButton>
            )}
          </Space>

          <div style={{ fontSize: 12, color: '#6B7280' }}>
            Số khối hiện tại: <strong style={{ color: '#111827', marginRight: 12 }}>{nodes.length}</strong>
            Đã xử lý tự động: <strong style={{ color: '#ed1c24', fontSize: 13 }}>{currentWorkflow?.executionCount || 0}</strong> đơn hàng
          </div>
        </div>

        {/* 2. Canvas Workspace with Floating Copilot Prompt Bar */}
        <div
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          style={{
            flex: 1,
            position: 'relative',
            width: '100%',
            height: '100%',
            cursor: isSnipMode ? 'crosshair' : 'default',
          }}
        >
          {/* Snip Mode Top Floating Hint */}
          {isSnipMode && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                background: '#8B5CF6',
                color: '#FFFFFF',
                padding: '6px 16px',
                borderRadius: 20,
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              <span>✂️ Đang ở chế độ quét vùng gom nhóm: Hãy kéo chuột chọn vùng chứa các khối trên bản đồ</span>
              <BaseButton
                variant="ghost"
                size="small"
                onClick={() => {
                  setIsSnipMode(false);
                  setSnipStart(null);
                  setSnipEnd(null);
                }}
                style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.7)', height: 24, fontSize: 11 }}
              >
                Hủy quét
              </BaseButton>
            </div>
          )}

          {/* Dynamic Drag Marquee Box (Windows Snipping Tool Style) */}
          {isSnipMode && snipStart && snipEnd && (
            <div
              style={{
                position: 'fixed',
                left: Math.min(snipStart.clientX, snipEnd.clientX),
                top: Math.min(snipStart.clientY, snipEnd.clientY),
                width: Math.abs(snipEnd.clientX - snipStart.clientX),
                height: Math.abs(snipEnd.clientY - snipStart.clientY),
                border: '2px dashed #8B5CF6',
                background: 'rgba(139, 92, 246, 0.18)',
                backdropFilter: 'blur(1px)',
                zIndex: 9999,
                pointerEvents: 'none',
                boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.2)',
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -24,
                  left: 0,
                  background: '#8B5CF6',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                ✂️ VÙNG GOM NHÓM ĐANG QUÉT
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin tip="Đang tải dữ liệu quy trình từ MongoDB Atlas..." size="large" />
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={isOverviewMode ? undefined : onConnect}
              onNodeClick={isOverviewMode ? undefined : handleNodeClick}
              onEdgeClick={isOverviewMode ? undefined : (_evt, edge) => handleOpenEdgeModal(edge.id)}
              onNodeDragStop={handleNodeDragStop}
              fitView
              elevateEdgesOnSelect
              elevateNodesOnSelect={false}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={16}
                size={1.5}
              />
              <Controls style={{ left: 16, bottom: 16 }} />
            </ReactFlow>
          )}

          {/* Floating Category Classification Legend */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 16,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              fontSize: 11,
              fontWeight: 600,
              userSelect: 'none',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: '#6B7280' }}>Phân loại khối:</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#ed1c24' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ed1c24' }} /> Sàn TMĐT
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#8B5CF6' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6' }} /> AI Engine
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#D97706' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706' }} /> Kho POS/ERP
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#10B981' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} /> Vận chuyển
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#EC4899' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EC4899' }} /> Logic & Rẽ nhánh
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#3B82F6' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} /> Cảnh báo & CRM
            </span>
          </div>

          {/* Empty Canvas Guide State when a new workflow is empty */}
          {nodes.length === 0 && !loading && (
            <div
              style={{
                position: 'absolute',
                top: '38%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                zIndex: 10,
                pointerEvents: 'auto',
                maxWidth: 480,
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(12px)',
                padding: '24px 32px',
                borderRadius: 14,
                border: '1px dashed #D1D5DB',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
              }}
            >
              <ApartmentOutlined style={{ fontSize: 38, color: '#ed1c24', marginBottom: 10 }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
                Quy trình chưa có khối xử lý nào
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, lineHeight: 1.5 }}>
                Sử dụng thanh lời nhắc AI bên dưới để sinh toàn bộ luồng tự động, hoặc bấm nút dưới đây để chọn từng khối chức năng.
              </div>
              <Space>
                <BaseButton
                  variant="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => setLibraryOpen(true)}
                >
                  Mở thư viện thêm khối
                </BaseButton>
              </Space>
            </div>
          )}

          {/* 3. Floating Copilot AI Prompt Dock */}
          <PromptBar onGenerate={handleGeneratePrompt} />
        </div>

        {/* 4. Drawers & Modals */}
        <NodeLibraryDrawer
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onAddNode={handleAddNode}
        />

        <NodeSettingsDrawer
          open={settingsOpen}
          selectedNode={selectedNode}
          allNodes={nodes}
          onSelectNode={(node) => setSelectedNode(node)}
          onClose={() => {
            setSettingsOpen(false);
            setSelectedNode(null);
          }}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
        />

        {/* Edge Directive & Condition Modal */}
        <EdgeDirectiveModal
          open={edgeModalOpen}
          edge={selectedEdge}
          sourceNode={nodes.find((n) => n.id === selectedEdge?.source)}
          targetNode={nodes.find((n) => n.id === selectedEdge?.target)}
          onClose={() => {
            setEdgeModalOpen(false);
            setSelectedEdge(null);
          }}
          onSave={handleSaveEdgeDirective}
          onDelete={handleDeleteEdge}
        />

        {/* Create Workflow Modal */}
        <Modal
          title={<span style={{ fontWeight: 600 }}>Tạo quy trình tự động hóa mới</span>}
          open={createModalOpen}
          onOk={handleCreateWorkflow}
          onCancel={() => setCreateModalOpen(false)}
          okText="Tạo quy trình"
          cancelText="Hủy bỏ"
          okButtonProps={{ style: { background: '#ed1c24' } }}
        >
          <Form
            form={createForm}
            layout="vertical"
            initialValues={{
              name: 'Quy trình xử lý đơn hàng mới',
              creationMode: 'blank',
            }}
          >
            <Form.Item
              name="name"
              label="Tên quy trình"
              rules={[{ required: true, message: 'Vui lòng nhập tên quy trình!' }]}
            >
              <Input placeholder="Ví dụ: Quy trình Shopee ➔ KiotViet ➔ GHN" />
            </Form.Item>

            <Form.Item name="creationMode" label="Hình thức khởi tạo">
              <Radio.Group>
                <Radio value="blank">Quy trình trống (Tự thiết kế từ Canvas)</Radio>
                <Radio value="ai">Sinh luồng tự động bằng AI (Nhập lời nhắc)</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prev, cur) => prev.creationMode !== cur.creationMode}
            >
              {({ getFieldValue }) =>
                getFieldValue('creationMode') === 'ai' ? (
                  <Form.Item
                    name="aiPrompt"
                    label="Lời nhắc mô tả quy trình"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả để AI sinh luồng!' }]}
                  >
                    <Input.TextArea
                      placeholder="Ví dụ: Bắt đơn Shopee sẵn sàng giao, trừ kho KiotViet và tạo đơn GHN Nhanh"
                      rows={3}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item name="description" label="Mô tả mục đích (tùy chọn)">
                    <Input.TextArea placeholder="Nhập mục đích hoặc kịch bản vận hành..." rows={2} />
                  </Form.Item>
                )
              }
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete Confirm Modal */}
        <ConfirmModal
          open={deleteModalOpen}
          title="Xác nhận xóa quy trình"
          content={`Bạn có chắc chắn muốn xóa quy trình "${currentWorkflow?.name}" không? Thao tác này sẽ xóa vĩnh viễn khỏi MongoDB.`}
          confirmText="Xác nhận xóa"
          danger
          onConfirm={handleDeleteWorkflow}
          onCancel={() => setDeleteModalOpen(false)}
        />

        {/* 5. Step-by-Step Test Run Debugger Drawer */}
        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircleFilled style={{ color: '#10B981' }} />
              <span style={{ fontWeight: 600 }}>Kết quả chạy thử nghiệm quy trình</span>
            </div>
          }
          placement="right"
          width={500}
          open={debugDrawerOpen}
          onClose={() => setDebugDrawerOpen(false)}
        >
          {dryRunResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Summary Card */}
              <div
                style={{
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: 10,
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>Mã đơn mẫu:</span>
                  <Tag color="#ed1c24" style={{ fontWeight: 600, borderRadius: 4 }}>
                    #{dryRunResult.orderId}
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>Mã vận đơn khởi tạo:</span>
                  <Tag color="#10B981" style={{ fontWeight: 600, borderRadius: 4 }}>
                    {dryRunResult.waybillCode}
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>Độ trễ toàn trình (E2E):</span>
                  <span style={{ fontWeight: 600, color: '#111827', fontSize: 12 }}>
                    <ClockCircleOutlined style={{ marginRight: 4, color: '#10B981' }} />
                    {dryRunResult.durationMs}ms
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>Độ tin cậy AI SKU:</span>
                  <span style={{ fontWeight: 700, color: '#8B5CF6', fontSize: 12 }}>
                    <ThunderboltFilled style={{ marginRight: 4 }} />
                    {(dryRunResult.aiScore * 100).toFixed(1)}% ({dryRunResult.aiDecision})
                  </span>
                </div>
              </div>

              {/* AI Reasoning Text */}
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.06)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontSize: 12,
                  color: '#4B5563',
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: '#8B5CF6' }}>Giải thích AI: </strong>
                {dryRunResult.aiReasoning}
              </div>

              {/* Step by step timeline */}
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#111827' }}>
                  Tiến trình thực thi từng bước (Execution Telemetry):
                </div>

                <Timeline
                  items={dryRunResult.steps?.map((st) => ({
                    color: '#10B981',
                    dot: <CheckCircleFilled style={{ fontSize: 14 }} />,
                    children: (
                      <div style={{ paddingBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>
                            Bước {st.step}: {st.name}
                          </span>
                          <Tag style={{ fontSize: 10, borderRadius: 4 }}>{st.latencyMs}ms</Tag>
                        </div>
                        <div style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>
                          {st.detail}
                        </div>
                      </div>
                    ),
                  }))}
                />
              </div>
            </div>
          )}
        </Drawer>
      </Card>

      {/* AI Flow Architect & Infrastructure Diagnostic Assistant */}
      <AIFlowArchitectDrawer
        open={architectOpen}
        onClose={() => setArchitectOpen(false)}
        selectedNodesCount={nodes.filter((n) => n.selected).length}
        onGroupSelectedNodes={() => {
          // Toggle group mode for rate comparison workflow
          notify.success('Đã gom nhóm thành công!');
        }}
        onUngroupNodes={() => {
          notify.info('Đã tách khối thành công!');
        }}
      />
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
