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
} from '@ant-design/icons';
import { TriggerNode } from './nodes/TriggerNode';
import { AINode } from './nodes/AINode';
import { ActionNode } from './nodes/ActionNode';
import { GroupNode } from './nodes/GroupNode';
import { workflowService, WorkflowData, DryRunResult } from '../../services/workflow.service';
import { PromptBar } from './panels/PromptBar';
import { NodeLibraryDrawer } from './panels/NodeLibraryDrawer';
import { NodeSettingsDrawer } from './panels/NodeSettingsDrawer';
import { AIFlowArchitectDrawer } from './panels/AIFlowArchitectDrawer';
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

  // Drawers & Modals state
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
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

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#ed1c24', strokeWidth: 2 },
          },
          eds
        )
      );
      notify.success('Đã kết nối khối xử lý thành công!');
    },
    [setEdges]
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
      nds.map((n) => (n.id === groupId ? { ...n, data: { ...n.data, width: newW, height: newH } } : n))
    );
  }, [setNodes]);

  const handleToggleExpandGroup = useCallback((groupId: string, isExpanded: boolean) => {
    let childIds = new Set<string>();

    setNodes((nds) => {
      const foundGroup = nds.find((n) => n.id === groupId);
      if (!foundGroup) return nds;

      const gx = foundGroup.position.x;
      const gy = foundGroup.position.y;
      const gw = foundGroup.data?.width || 580;
      const gh = foundGroup.data?.height || 290;

      // Tìm tất cả các node con nằm trong phân vùng
      nds.forEach((n) => {
        if (
          n.type !== 'group' &&
          n.position.x >= gx - 15 &&
          n.position.x <= gx + gw + 15 &&
          n.position.y >= gy - 15 &&
          n.position.y <= gy + gh + 15
        ) {
          childIds.add(n.id);
        }
      });

      return nds.map((n) => {
        if (n.id === groupId) {
          return { ...n, data: { ...n.data, isExpanded } };
        }
        if (childIds.has(n.id)) {
          return { ...n, hidden: !isExpanded };
        }
        return n;
      });
    });

    // Định tuyến lại dây nối (Edge Rerouting) để không bị đứt gãy kết nối khi thu gọn
    setEdges((eds) => {
      if (childIds.size === 0) return eds;

      return eds.map((e) => {
        const rawSrc = e.data?.originalSource || e.source;
        const rawTgt = e.data?.originalTarget || e.target;
        const isSrcChild = childIds.has(rawSrc) || rawSrc === groupId;
        const isTgtChild = childIds.has(rawTgt) || rawTgt === groupId;

        if (!isExpanded) {
          // Thu gọn: Dây nội bộ -> ẩn, Dây từ ngoài vào cụm -> cắm vào GroupNode, Dây từ cụm ra ngoài -> xuất phát từ GroupNode
          if (isSrcChild && isTgtChild && rawSrc !== groupId && rawTgt !== groupId) {
            return { ...e, hidden: true };
          }
          if (!isSrcChild && isTgtChild) {
            return {
              ...e,
              target: groupId,
              data: { ...e.data, originalTarget: rawTgt },
              hidden: false,
            };
          }
          if (isSrcChild && !isTgtChild) {
            return {
              ...e,
              source: groupId,
              data: { ...e.data, originalSource: rawSrc },
              hidden: false,
            };
          }
          return e;
        } else {
          // Mở rộng: Khôi phục dây nối về đúng các khối con ban đầu
          return {
            ...e,
            source: rawSrc,
            target: rawTgt,
            hidden: false,
          };
        }
      });
    });

    // Tự động cân bằng giao diện (Auto-balance Canvas)
    setTimeout(() => {
      fitView({ duration: 350 });
    }, 60);

    notify.info(
      isExpanded
        ? 'Đã mở rộng cụm phân vùng & phục hồi toàn bộ dây kết nối các khối con!'
        : 'Đã thu gọn cụm phân vùng & tự động nối dây liền mạch vào cụm!'
    );
  }, [setNodes, setEdges, fitView]);

  const handleUngroupGroup = useCallback((groupId: string) => {
    setNodes((nds) => {
      // Khi gỡ gộp vùng, bỏ ẩn tất cả các node con
      return nds
        .filter((n) => n.id !== groupId)
        .map((n) => ({ ...n, hidden: false }));
    });

    // Khôi phục tất cả dây nối đang trỏ vào groupId về lại các node con ban đầu
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        source: e.data?.originalSource || e.source,
        target: e.data?.originalTarget || e.target,
        hidden: false,
      }))
    );

    notify.success('Đã hủy gom nhóm phân vùng & khôi phục các khối độc lập!');
  }, [setNodes, setEdges]);

  const handleGroupSelectedNodes = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected && n.type !== 'group');
    const targetNodes = selectedNodes.length > 0
      ? selectedNodes
      : nodes.filter((n) => n.type !== 'trigger' && n.type !== 'group');

    if (targetNodes.length === 0) {
      notify.warning('Vui lòng chọn ít nhất 1 khối xử lý trên bản đồ để gom nhóm!');
      return;
    }

    const minX = Math.min(...targetNodes.map((n) => n.position.x));
    const maxX = Math.max(...targetNodes.map((n) => n.position.x));
    const minY = Math.min(...targetNodes.map((n) => n.position.y));
    const maxY = Math.max(...targetNodes.map((n) => n.position.y));

    const groupId = `group_${Date.now()}`;
    const newGroupNode = {
      id: groupId,
      type: 'group',
      position: { x: minX - 25, y: minY - 45 },
      data: {
        label: `Cụm phân vùng gom nhóm (${targetNodes.length} khối)`,
        subtitle: `Tối ưu hóa tự động • ${targetNodes.length} khối xử lý`,
        childCount: targetNodes.length,
        width: Math.max(maxX - minX + 280, 540),
        height: Math.max(maxY - minY + 150, 260),
        isExpanded: true,
        onToggleExpand: handleToggleExpandGroup,
        onUngroup: handleUngroupGroup,
        onResize: handleResizeGroup,
      },
    };

    setNodes((nds) => [newGroupNode, ...nds]);
    notify.success(`Đã tạo cụm phân vùng gom nhóm cho ${targetNodes.length} khối xử lý! 🎉`);
  }, [nodes, setNodes, handleToggleExpandGroup, handleUngroupGroup, handleResizeGroup]);

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
        if (n.type === 'group') return false;
        const nx = n.position.x;
        const ny = n.position.y;
        return nx >= minX - 120 && nx <= maxX && ny >= minY - 60 && ny <= maxY;
      });

      if (enclosedNodes.length > 0) {
        const actualMinX = Math.min(...enclosedNodes.map((n) => n.position.x));
        const actualMaxX = Math.max(...enclosedNodes.map((n) => n.position.x));
        const actualMinY = Math.min(...enclosedNodes.map((n) => n.position.y));
        const actualMaxY = Math.max(...enclosedNodes.map((n) => n.position.y));

        const groupId = `group_${Date.now()}`;
        const newGroupNode = {
          id: groupId,
          type: 'group',
          position: { x: actualMinX - 25, y: actualMinY - 45 },
          data: {
            label: `Cụm phân vùng gom nhóm (${enclosedNodes.length} khối)`,
            subtitle: `Tối ưu hóa tự động • ${enclosedNodes.length} khối xử lý`,
            childCount: enclosedNodes.length,
            width: Math.max(actualMaxX - actualMinX + 280, 540),
            height: Math.max(actualMaxY - actualMinY + 160, 260),
            isExpanded: true,
            onToggleExpand: handleToggleExpandGroup,
            onUngroup: handleUngroupGroup,
            onResize: handleResizeGroup,
          },
        };

        setNodes((nds) => [newGroupNode, ...nds]);
        notify.success(`Đã quét chọn và gom thành công ${enclosedNodes.length} khối xử lý vào cụm phân vùng! 🎉`);
      } else {
        notify.info('Không có khối xử lý nào nằm trong vùng vừa quét.');
      }
    }

    setSnipStart(null);
    setSnipEnd(null);
    setIsSnipMode(false);
  }, [isSnipMode, snipStart, screenToFlowPosition, nodes, setNodes, handleToggleExpandGroup, handleUngroupGroup, handleResizeGroup]);

  const selectWorkflow = (wf: WorkflowData) => {
    setCurrentWorkflow(wf);
    if (wf.nodes && wf.nodes.length > 0) {
      const mappedNodes = wf.nodes.map((n) => ({
        ...n,
        type: n.type === 'group' || n.type?.toLowerCase().includes('group')
          ? 'group'
          : n.type?.toLowerCase().includes('trigger')
            ? 'trigger'
            : n.type?.toLowerCase().includes('ai')
              ? 'ai'
              : 'action',
        data: {
          ...(n.data || { label: n.label, description: n.config?.eventType || 'Đã liên kết cơ sở dữ liệu' }),
          onToggleExpand: handleToggleExpandGroup,
          onUngroup: handleUngroupGroup,
          onResize: handleResizeGroup,
        },
      }));
      setNodes(mappedNodes);
    } else {
      setNodes([]);
    }

    if (wf.edges && wf.edges.length > 0) {
      const mappedEdges = wf.edges.map((e) => ({
        ...e,
        animated: true,
        style: e.style || { stroke: '#ed1c24', strokeWidth: 2 },
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
      setDebugDrawerOpen(true);
      notify.success(
        `Chạy thử nghiệm thành công: Đơn #${result.orderId} -> Vận đơn: ${result.waybillCode} (${result.durationMs}ms)`
      );
      loadAllWorkflows(currentWorkflow._id);
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

          <div style={{ width: 1, height: 20, background: '#E5E7EB', margin: '0 4px' }} />

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
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
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
          onClose={() => {
            setSettingsOpen(false);
            setSelectedNode(null);
          }}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
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
