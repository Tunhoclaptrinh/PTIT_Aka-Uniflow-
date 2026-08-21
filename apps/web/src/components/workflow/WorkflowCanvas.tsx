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
import { Card, Space, Spin, Select, Switch, Drawer, Timeline, Tag, Modal, Form, Input, Radio } from 'antd';
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
  CompressOutlined,
  ExpandOutlined,
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
import { BaseButton, PageContainer, ConfirmModal, FormFooter } from '../base';
import { notify } from '../../utils/notification';
import { useAppConfig } from '../../context/AppConfigContext';

// Khối tiêu đề quy trình 1 dòng siêu tối giản (không khung, không handle chấm kết nối)
const WorkflowHeaderNode: React.FC<any> = ({ data }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '2px 0',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: data.isActive ? '#10B981' : '#94A3B8',
          display: 'inline-block',
          boxShadow: data.isActive ? '0 0 6px rgba(16, 185, 129, 0.5)' : 'none',
        }}
      />
      <span style={{ color: 'var(--text-primary, #0F172A)', fontSize: 13.5, fontWeight: 700 }}>
        {data.title || data.label}
      </span>
      <span
        style={{
          fontSize: 10.5,
          color: data.isActive ? '#10B981' : '#94A3B8',
          fontWeight: 600,
          background: data.isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(148, 163, 184, 0.12)',
          padding: '1px 7px',
          borderRadius: 10,
          border: `1px solid ${data.isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.25)'}`,
        }}
      >
        {data.isActive ? 'Đang kích hoạt' : 'Bản nháp'}
      </span>
    </div>
  );
};

const FlowContent: React.FC = () => {
  const { themeMode } = useAppConfig();
  const isLight = themeMode === 'light';
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
  const [isCompactNodes, setIsCompactNodes] = useState(false);

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
      workflowHeader: WorkflowHeaderNode,
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

  // ── GỠ ĐƠN KHỐI CON RA KHỎI CỤM PHÂN VÙNG (Văng ra góc trên bên phải) ──────
  const handleDetachNodeFromGroup = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const targetNode = nds.find((n) => n.id === nodeId);
        if (!targetNode || !targetNode.parentId) {
          notify.info('Khối này hiện không nằm trong cụm phân vùng nào.');
          return nds;
        }

        const parentGroupId = targetNode.parentId;
        const parentGroup = nds.find((n) => n.id === parentGroupId);
        const gx = parentGroup ? parentGroup.position.x : 0;
        const gy = parentGroup ? parentGroup.position.y : 0;
        const gw = Number(parentGroup?.style?.width ?? parentGroup?.data?.width ?? 280);

        // Đẩy văng ra góc trên bên phải của cụm phân vùng (+ 40px từ cạnh phải, - 20px từ mép trên)
        const ejectedX = gx + gw + 40;
        const ejectedY = Math.max(gy - 20, 20);

        const updated = nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              parentId: undefined,
              extent: undefined,
              position: {
                x: ejectedX,
                y: ejectedY,
              },
              zIndex: 0,
              data: {
                ...n.data,
                onDetachFromGroup: undefined,
              },
            };
          }
          return n;
        });

        // Cập nhật lại childCount cho Group cha
        const newChildCount = updated.filter((n) => n.parentId === parentGroupId).length;

        notify.success(`Đã gỡ khối "${targetNode.data?.label || targetNode.id}" văng ra góc trên bên phải của cụm!`);

        return updated.map((n) =>
          n.id === parentGroupId
            ? {
              ...n,
              data: {
                ...n.data,
                childCount: newChildCount,
              },
            }
            : n
        );
      });
    },
    [setNodes]
  );

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

  // Xử lý mở rộng / thu hẹp kích thước cụm: tự động thêm/bớt các node con và giữ nguyên 100% vị trí thực tế trên Canvas
  const handleResizeGroupEnd = useCallback(
    (groupId: string, params: { x?: number; y?: number; width: number; height: number }) => {
      setNodes((nds) => {
        const groupNode = nds.find((n) => n.id === groupId);
        if (!groupNode) return nds;

        const oldGx = groupNode.position.x;
        const oldGy = groupNode.position.y;
        const newGx = params.x !== undefined ? params.x : oldGx;
        const newGy = params.y !== undefined ? params.y : oldGy;
        const newGw = params.width;
        const newGh = params.height;

        let childCount = 0;
        let addedCount = 0;
        let removedCount = 0;

        const updatedNodes = nds.map((n) => {
          if (n.id === groupId || n.type === 'group') return n;

          // Tính tọa độ tuyệt đối chính xác của node trên Canvas
          const absX = n.parentId === groupId ? oldGx + (n.position.x || 0) : (n.position.x || 0);
          const absY = n.parentId === groupId ? oldGy + (n.position.y || 0) : (n.position.y || 0);
          const nodeW = n.style?.width || 230;
          const nodeH = n.style?.height || 75;

          // Kiểm tra tâm của khối có nằm trong phạm vi viền mới của cụm không
          const cx = absX + nodeW / 2;
          const cy = absY + nodeH / 2;
          const isInside = cx >= newGx && cx <= newGx + newGw && cy >= newGy && cy <= newGy + newGh;

          if (isInside) {
            childCount++;
            if (n.parentId !== groupId) {
              addedCount++;
            }
            // Chuyển sang tọa độ tương đối mới (ĐẢM BẢO KHÔNG BỊ NHẢY / DỊCH CHUYỂN VỊ TRÍ TRÊN MÀN HÌNH!)
            return {
              ...n,
              parentId: groupId,
              extent: 'parent' as const,
              position: {
                x: absX - newGx,
                y: absY - newGy,
              },
              zIndex: 10,
              data: {
                ...n.data,
                onDetachFromGroup: handleDetachNodeFromGroup,
              },
            };
          } else {
            if (n.parentId === groupId) {
              // Bị loại ra ngoài cụm khi cụm thu nhỏ lại
              removedCount++;
              return {
                ...n,
                parentId: undefined,
                extent: undefined,
                position: {
                  x: absX,
                  y: absY,
                },
                zIndex: 0,
                data: {
                  ...n.data,
                  onDetachFromGroup: undefined,
                },
              };
            }
            return n;
          }
        });

        if (addedCount > 0) {
          notify.success(`Đã tự động thêm ${addedCount} khối vào cụm phân vùng!`);
        } else if (removedCount > 0) {
          notify.info(`Đã tách ${removedCount} khối ra khỏi cụm phân vùng.`);
        }

        // Cập nhật Group Node với kích thước, tọa độ và số lượng con mới
        return updatedNodes.map((n) =>
          n.id === groupId
            ? {
              ...n,
              position: { x: newGx, y: newGy },
              style: { ...n.style, width: newGw, height: newGh },
              data: {
                ...n.data,
                width: newGw,
                height: newGh,
                origWidth: newGw,
                origHeight: newGh,
                childCount,
              },
            }
            : n
        );
      });
    },
    [setNodes]
  );

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
        onResizeEnd: handleResizeGroupEnd,
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
          data: {
            ...n.data,
            onDetachFromGroup: handleDetachNodeFromGroup,
          },
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
      notify.warning('Mẹo: Giữ phím Shift và click các khối (hoặc dùng nút Quét vùng Snipping) để chọn từ 2 khối trở lên trước khi Gom nhóm!');
      return;
    }
    if (selectedNodes.length === 1) {
      notify.warning('Vui lòng chọn từ 2 khối trở lên để tạo phân vùng gom nhóm!');
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
            onResizeEnd: handleResizeGroupEnd,
            onDetachFromGroup: n.parentId ? handleDetachNodeFromGroup : undefined,
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

  const handleNodeClick = (event: React.MouseEvent, node: any) => {
    // Nếu đang giữ Shift hoặc Ctrl/Cmd (đang chọn nhiều khối) -> không tự động mở ngăn kéo
    if (event.shiftKey || event.ctrlKey || event.metaKey) {
      return;
    }
    // Nếu đang có 2 khối trở lên được chọn -> không bật drawer làm phiền
    const selectedCount = nodes.filter((n) => n.selected).length;
    if (selectedCount >= 2) {
      return;
    }
    setSelectedNode(node);
    setSettingsOpen(true);
  };

  const handleAddNode = (type: string, label: string, category?: string, customData?: any) => {
    const id = `node_${Date.now()}`;
    const viewport = getViewport();
    const zoom = viewport.zoom || 1;
    // Đặt khối mới ở góc trên bên trái của viewport hiện tại (cách mép 80px), tự so le nhẹ khi thêm nhiều khối liên tiếp
    const cascadeOffset = (nodes.length % 6) * 32;
    const nodePosition = {
      x: (-viewport.x + 80 + cascadeOffset) / zoom,
      y: (-viewport.y + 80 + cascadeOffset) / zoom,
    };

    const newNode = {
      id,
      type,
      position: nodePosition,
      data: {
        label,
        description: customData?.desc || 'Khối chức năng mới',
        category: category || 'GENERAL',
        ...customData,
      },
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

  const handleToggleCompactNodes = () => {
    const nextVal = !isCompactNodes;
    setIsCompactNodes(nextVal);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isCompact: nextVal,
        },
      }))
    );
    notify.info(nextVal ? 'Đã bật chế độ thu nhỏ siêu gọn (1 dòng)' : 'Đã mở rộng hiển thị khối');
  };

  // ── XEM TOÀN BỘ: gộp tất cả workflow vào 1 canvas theo hàng dọc ────────
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
      let allNodes: any[] = [];
      let allEdges: any[] = [];
      let currentTopOffset = 0;

      allWfs.forEach((wf: WorkflowData, wfIndex: number) => {
        const prefix = `ov_wf${wfIndex}_`;
        const nodesList = wf.nodes || [];

        // Tính toán bounding box thực tế của quy trình
        let minX = 0;
        let minY = 0;
        let maxY = 0;

        if (nodesList.length > 0) {
          const xs = nodesList.map((n: any) => n.position?.x || 0);
          const ys = nodesList.map((n: any) => n.position?.y || 0);
          const heights = nodesList.map((n: any) => (n.position?.y || 0) + (n.style?.height || 75));
          minX = Math.min(...xs);
          minY = Math.min(...ys);
          maxY = Math.max(...heights);
        }

        const offsetY = currentTopOffset + 40; // Khoảng cách giữa tiêu đề và khối
        const wfHeight = Math.max(maxY - minY, 90);

        // 1 Dòng tiêu đề tối giản 100% không khung, không chấm handle
        allNodes.push({
          id: `${prefix}label`,
          type: 'workflowHeader',
          position: { x: 0, y: currentTopOffset },
          draggable: true,
          selectable: false,
          data: {
            title: `#${wfIndex + 1} ${wf.name}`,
            label: `#${wfIndex + 1} ${wf.name}`,
            isActive: Boolean(wf.isActive),
          },
        });

        nodesList.forEach((n: any) => {
          const resolvedType = n.type === 'group' ? 'group' : n.type?.includes('trigger') ? 'trigger' : n.type?.includes('ai') ? 'ai' : 'action';
          const nodeStyle = resolvedType === 'group'
            ? { width: n.data?.width || n.style?.width || 560, height: n.data?.height || n.style?.height || 280, zIndex: -1, ...n.style }
            : n.style;

          // Chuẩn hóa tọa độ tương đối theo minX, minY để các quy trình xếp thẳng hàng và giữ nguyên tương đối
          const relX = (n.position?.x || 0) - (n.parentId ? 0 : minX);
          const relY = (n.position?.y || 0) - (n.parentId ? 0 : minY);

          allNodes.push({
            ...n,
            id: `${prefix}${n.id}`,
            type: resolvedType,
            position: {
              x: n.parentId ? (n.position?.x || 0) : relX,
              y: n.parentId ? (n.position?.y || 0) : relY + offsetY,
            },
            parentId: n.parentId ? `${prefix}${n.parentId}` : undefined,
            extent: n.extent,
            style: nodeStyle,
            zIndex: n.parentId ? 10 : (resolvedType === 'group' ? -1 : 0),
            draggable: true,
            selectable: true,
            data: {
              ...n.data,
              label: n.data?.label || n.label || 'Node',
              description: n.data?.description || '',
              workflowId: wf._id,
              originalNodeId: n.id,
            },
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
            data: {
              ...e.data,
              workflowId: wf._id,
              originalEdgeId: e.id,
            },
          });
        });

        // Cập nhật vị trí bắt đầu cho quy trình tiếp theo
        currentTopOffset += wfHeight + 140;
      });

      setNodes(allNodes);
      setEdges(allEdges);
      setTimeout(() => fitView({ duration: 600, padding: 0.08 }), 150);
      notify.success(`Đang hiển thị toàn bộ ${allWfs.length} quy trình theo hàng dọc trên 1 canvas!`);
    } catch (err: any) {
      notify.error('Lỗi tải toàn bộ quy trình: ' + err.message);
      setIsOverviewMode(false);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOverviewMode, currentWorkflow, setNodes, setEdges, fitView]);

  // ── Drag stop handler: Hỗ trợ kéo thả khối vào/ra khỏi cụm phân vùng ─────
  const handleNodeDragStop = useCallback((_event: any, draggedNode: any) => {
    if (draggedNode.type === 'group' || isOverviewMode) return;

    const nodeW = draggedNode.style?.width || 230;
    const nodeH = draggedNode.style?.height || 75;

    setNodes((nds) => {
      const groups = nds.filter((n) => n.type === 'group' && (n.data?.isExpanded ?? true));
      const currentParentId = draggedNode.parentId;
      const currentGroup = groups.find((g) => g.id === currentParentId);

      // Tọa độ tuyệt đối của node sau khi kéo thả trên Canvas
      const absX = currentGroup ? currentGroup.position.x + (draggedNode.position.x || 0) : (draggedNode.position.x || 0);
      const absY = currentGroup ? currentGroup.position.y + (draggedNode.position.y || 0) : (draggedNode.position.y || 0);
      const cx = absX + nodeW / 2;
      const cy = absY + nodeH / 2;

      // Tìm xem tâm khối có rơi vào bên trong viền của một cụm đang mở rộng không
      const targetGroup = groups.find((g) => {
        const gx = g.position.x;
        const gy = g.position.y;
        const gw = Number(g.style?.width ?? g.data?.width ?? 280);
        const gh = Number(g.style?.height ?? g.data?.height ?? 160);
        return cx >= gx && cx <= gx + gw && cy >= gy && cy <= gy + gh;
      });

      if (targetGroup && targetGroup.id !== currentParentId) {
        // Thả vào cụm phân vùng mới
        notify.success(`Đã thêm "${draggedNode.data?.label || draggedNode.id}" vào "${targetGroup.data?.label || 'cụm phân vùng'}"!`);

        const updated = nds.map((n) => {
          if (n.id === draggedNode.id) {
            return {
              ...n,
              parentId: targetGroup.id,
              extent: 'parent' as const,
              position: {
                x: absX - targetGroup.position.x,
                y: absY - targetGroup.position.y,
              },
              zIndex: 10,
              data: {
                ...n.data,
                onDetachFromGroup: handleDetachNodeFromGroup,
              },
            };
          }
          return n;
        });

        // Cập nhật lại childCount cho tất cả các group
        return updated.map((n) => {
          if (n.type === 'group') {
            const count = updated.filter((c) => c.parentId === n.id).length;
            return { ...n, data: { ...n.data, childCount: count } };
          }
          return n;
        });
      } else if (!targetGroup && currentParentId) {
        // Kéo ra khỏi cụm phân vùng về lại canvas chính
        notify.info(`Đã đưa "${draggedNode.data?.label || draggedNode.id}" ra khỏi cụm phân vùng.`);

        const updated = nds.map((n) => {
          if (n.id === draggedNode.id) {
            return {
              ...n,
              parentId: undefined,
              extent: undefined,
              position: {
                x: absX,
                y: absY,
              },
              zIndex: 0,
              data: {
                ...n.data,
                onDetachFromGroup: undefined,
              },
            };
          }
          return n;
        });

        // Cập nhật lại childCount cho tất cả các group
        return updated.map((n) => {
          if (n.type === 'group') {
            const count = updated.filter((c) => c.parentId === n.id).length;
            return { ...n, data: { ...n.data, childCount: count } };
          }
          return n;
        });
      }

      return nds;
    });
  }, [isOverviewMode, setNodes]);

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
              {/* Nút Thêm khối: Primary có chữ hiển thị rõ ràng */}
              <BaseButton
                variant="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => setLibraryOpen(true)}
                tooltip="Thêm khối xử lý mới (Webhook, AI, Kho POS, ĐVVC)"
                style={{ fontWeight: 600, padding: '0 12px' }}
              >
                Thêm khối
              </BaseButton>

              {/* Nút Thu nhỏ / Mở rộng khối: Icon-only kèm tooltip chuẩn */}
              <BaseButton
                variant={isCompactNodes ? 'primary' : 'ghost'}
                size="small"
                icon={isCompactNodes ? <ExpandOutlined /> : <CompressOutlined />}
                onClick={handleToggleCompactNodes}
                tooltip={isCompactNodes ? 'Mở rộng hiển thị đầy đủ thông số khối' : 'Thu nhỏ khối 1 dòng để bao quát sơ đồ'}
                style={{
                  width: 32,
                  height: 32,
                  padding: 0,
                  ...(isCompactNodes ? { background: '#3B82F6', borderColor: '#3B82F6' } : {}),
                }}
              />

              <BaseButton
                tooltip="Quét vùng gom nhóm (Kéo chuột bao quanh các khối kiểu Windows Snipping)"
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

              <BaseButton
                tooltip="Gom nhóm các khối đang chọn trên bản đồ"
                variant="ghost"
                size="small"
                icon={<AppstoreOutlined style={{ color: '#8B5CF6' }} />}
                onClick={handleGroupSelectedNodes}
                style={{ width: 32, height: 32, padding: 0 }}
              />

              <BaseButton
                tooltip="Tư vấn kiến trúc AI & Gợi ý gom nhóm"
                variant="ghost"
                size="small"
                icon={<ThunderboltFilled style={{ color: '#8B5CF6' }} />}
                onClick={() => setArchitectOpen(true)}
                style={{ width: 32, height: 32, padding: 0 }}
              />
            </>
          )}

          <div style={{ width: 1, height: 20, background: '#E5E7EB', margin: '0 4px' }} />

          {/* Xem toàn bộ workflows */}
          <BaseButton
            tooltip={isOverviewMode ? 'Thoát chế độ xem toàn bộ' : 'Xem toàn bộ quy trình trên 1 canvas'}
            variant={isOverviewMode ? 'primary' : 'ghost'}
            size="small"
            icon={<EyeOutlined style={{ color: isOverviewMode ? '#FFFFFF' : '#10B981' }} />}
            onClick={handleShowAllWorkflows}
            style={{
              width: 32, height: 32, padding: 0,
              ...(isOverviewMode ? { background: '#10B981', borderColor: '#10B981' } : {}),
            }}
          />

          {/* Nhóm 2: Quản lý quy trình & Thực thi */}
          <BaseButton
            tooltip="Tạo quy trình xử lý đơn hàng mới"
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

          <BaseButton
            tooltip="Làm mới dữ liệu từ cơ sở dữ liệu MongoDB Atlas"
            variant="ghost"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => loadAllWorkflows(currentWorkflow?._id)}
            style={{ width: 32, height: 32, padding: 0 }}
          />

          <BaseButton
            tooltip="Chạy thử nghiệm mô phỏng 0-chạm qua Backend API"
            variant="ghost"
            size="small"
            icon={<PlayCircleOutlined style={{ color: '#ed1c24' }} />}
            loading={testing}
            onClick={handleTestRun}
            style={{ width: 32, height: 32, padding: 0 }}
          />

          <BaseButton
            tooltip="Lưu quy trình vào cơ sở dữ liệu MongoDB Atlas"
            variant="primary"
            size="small"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={handleSave}
            style={{ width: 32, height: 32, padding: 0 }}
          />
        </div>
      }
    >
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          border: '1px solid var(--border-subtle, #E5E7EB)',
          background: 'var(--bg-surface-card, #FFFFFF)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
        }}
        bodyStyle={{ padding: 0, height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}
      >
        {/* 1. Header Toolbar Control: Workflow Selector & Status */}
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid var(--border-subtle, #E5E7EB)',
            background: 'var(--bg-surface-elevated, #FAFAFA)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 320, maxWidth: '75%' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary, #94A3B8)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Chọn quy trình:
            </span>
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
                style={{ flex: 1, minWidth: 280, maxWidth: 640 }}
                options={workflowsList.map((w) => ({
                  label: `${w.name} ${w.isActive ? '(Đang chạy)' : '(Bản nháp)'}`,
                  value: w._id,
                }))}
              />
            )}

            {currentWorkflow && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <Switch
                  checked={currentWorkflow?.isActive}
                  onChange={handleToggleActive}
                />
                <span style={{ fontSize: 12, color: currentWorkflow?.isActive ? '#10B981' : 'var(--text-muted, #64748B)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {currentWorkflow?.isActive ? 'Kích hoạt 0-chạm' : 'Bản nháp'}
                </span>
              </div>
            )}

            {/* Nút Xóa ngăn cách bởi một gạch dọc, hiện khít & sắc nét */}
            {currentWorkflow && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ color: 'var(--border-subtle, rgba(255, 255, 255, 0.2))', fontSize: 13, userSelect: 'none' }}>|</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => setDeleteModalOpen(true)}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    color: '#EF4444',
                    fontSize: 12.5,
                    fontWeight: 600,
                    padding: '3px 6px',
                    borderRadius: 4,
                    transition: 'all 0.15s ease',
                    userSelect: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#DC2626';
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#EF4444';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Xóa quy trình này"
                >
                  <DeleteOutlined style={{ fontSize: 13, color: '#EF4444' }} />
                  <span>Xóa</span>
                </span>
              </div>
            )}
          </div>

          <div style={{ fontSize: 12.5, color: 'var(--text-secondary, #94A3B8)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Số khối hiện tại: <strong style={{ color: 'var(--text-primary, #F9FAFB)', marginRight: 12, fontWeight: 700 }}>{nodes.length}</strong>
            Đã xử lý tự động: <strong style={{ color: '#ed1c24', fontSize: 13.5, fontWeight: 800 }}>{(currentWorkflow?.executionCount || 0).toLocaleString('vi-VN')}</strong> đơn hàng
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

          {/* Container ReactFlow có hiệu ứng xám màu (Greyscale) khi tắt vận hành 0-chạm */}
          <div
            style={{
              width: '100%',
              height: '100%',
              filter: (!isOverviewMode && currentWorkflow && !currentWorkflow.isActive) ? 'grayscale(92%) opacity(0.82)' : 'none',
              transition: 'filter 0.35s ease, opacity 0.35s ease',
            }}
          >
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
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                onNodeDoubleClick={(_evt, node) => {
                  setSelectedNode(node);
                  setSettingsOpen(true);
                }}
                onEdgeClick={(_evt, edge) => handleOpenEdgeModal(edge.id)}
                onNodeDragStop={handleNodeDragStop}
                selectionOnDrag={!isSnipMode}
                fitView
                elevateEdgesOnSelect
                elevateNodesOnSelect={false}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={16}
                  size={1.5}
                  color={isLight ? '#CBD5E1' : '#334155'}
                  bgColor={isLight ? '#F8FAFC' : '#0B0F19'}
                />
                <Controls style={{ left: 16, bottom: 16 }} />
              </ReactFlow>
            )}
          </div>

          {/* Huy hiệu cảnh báo trạng thái Bản nháp (Đang tắt 0-chạm) */}
          {!isOverviewMode && currentWorkflow && !currentWorkflow.isActive && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 16,
                zIndex: 10,
                background: 'rgba(241, 245, 249, 0.94)',
                backdropFilter: 'blur(8px)',
                color: '#64748B',
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid #CBD5E1',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                pointerEvents: 'none',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94A3B8' }} />
              <span>Đang ở chế độ Bản nháp (Tắt 0-chạm - Luồng không tự động chạy)</span>
            </div>
          )}

          {/* Floating Multi-Selection Action Toolbar khi chọn từ 2 khối trở lên */}
          {nodes.filter((n) => n.selected && n.type !== 'group').length >= 2 && (
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                background: 'rgba(15, 23, 42, 0.94)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                padding: '8px 18px',
                borderRadius: 24,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <span>
                🎯 Đang chọn <strong>{nodes.filter((n) => n.selected && n.type !== 'group').length}</strong> khối
              </span>
              <BaseButton
                variant="brand"
                size="small"
                icon={<AppstoreOutlined />}
                onClick={handleGroupSelectedNodes}
                style={{ fontWeight: 700, borderRadius: 16 }}
              >
                Gom nhóm phân vùng
              </BaseButton>
            </div>
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
              background: 'var(--bg-surface-elevated, rgba(255, 255, 255, 0.94))',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle, #E5E7EB)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              fontSize: 11,
              fontWeight: 600,
              userSelect: 'none',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: 'var(--text-muted, #6B7280)' }}>Phân loại khối:</span>
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
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} /> Thông báo & CRM
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
                background: 'var(--bg-surface-elevated, rgba(255, 255, 255, 0.94))',
                backdropFilter: 'blur(12px)',
                padding: '24px 32px',
                borderRadius: 14,
                border: '1px dashed var(--border-subtle, #D1D5DB)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ApartmentOutlined style={{ fontSize: 38, color: '#ed1c24', marginBottom: 10 }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary, #111827)', marginBottom: 6 }}>
                Quy trình chưa có khối xử lý nào
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary, #6B7280)', marginBottom: 16, lineHeight: 1.5 }}>
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
          onDetachNode={handleDetachNodeFromGroup}
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
          title={<span style={{ fontWeight: 700, fontSize: 16 }}>Tạo quy trình tự động hóa mới</span>}
          open={createModalOpen}
          onCancel={() => setCreateModalOpen(false)}
          footer={
            <FormFooter
              align="center"
              submitText="Tạo quy trình"
              cancelText="Hủy bỏ"
              onCancel={() => setCreateModalOpen(false)}
              onSubmit={handleCreateWorkflow}
              style={{ marginTop: 0, paddingTop: 14 }}
            />
          }
          width={560}
          centered
          destroyOnClose
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
              <span style={{ fontWeight: 600, color: isLight ? '#0F172A' : '#F9FAFB' }}>Kết quả chạy thử nghiệm quy trình</span>
            </div>
          }
          placement="right"
          width={600}
          open={debugDrawerOpen}
          onClose={() => setDebugDrawerOpen(false)}
          styles={{
            header: {
              background: isLight ? '#FFFFFF' : '#0B0F19',
              borderBottom: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
              padding: '16px 20px',
            },
            body: {
              background: isLight ? '#F8FAFC' : '#0B0F19',
              padding: '16px 20px',
            },
          }}
        >
          {dryRunResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Summary Card */}
              <div
                style={{
                  background: isLight ? '#FFFFFF' : '#111827',
                  border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 10,
                  padding: '14px 16px',
                  boxShadow: isLight ? '0 1px 3px rgba(0, 0, 0, 0.03)' : '0 2px 6px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: isLight ? '#6B7280' : '#94A3B8', fontSize: 12 }}>Mã đơn mẫu:</span>
                  <Tag color="#ed1c24" style={{ fontWeight: 600, borderRadius: 4 }}>
                    #{dryRunResult.orderId}
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: isLight ? '#6B7280' : '#94A3B8', fontSize: 12 }}>Mã vận đơn khởi tạo:</span>
                  <Tag color="#10B981" style={{ fontWeight: 600, borderRadius: 4 }}>
                    {dryRunResult.waybillCode}
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: isLight ? '#6B7280' : '#94A3B8', fontSize: 12 }}>Độ trễ toàn trình (E2E):</span>
                  <span style={{ fontWeight: 600, color: isLight ? '#111827' : '#F9FAFB', fontSize: 12 }}>
                    <ClockCircleOutlined style={{ marginRight: 4, color: '#10B981' }} />
                    {dryRunResult.durationMs}ms
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: isLight ? '#6B7280' : '#94A3B8', fontSize: 12 }}>Độ tin cậy AI SKU:</span>
                  <span style={{ fontWeight: 700, color: '#8B5CF6', fontSize: 12 }}>
                    <ThunderboltFilled style={{ marginRight: 4 }} />
                    {(dryRunResult.aiScore * 100).toFixed(1)}% ({dryRunResult.aiDecision})
                  </span>
                </div>
              </div>

              {/* AI Reasoning Text */}
              <div
                style={{
                  background: isLight ? 'rgba(139, 92, 246, 0.06)' : 'rgba(139, 92, 246, 0.12)',
                  border: isLight ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontSize: 12,
                  color: isLight ? '#4B5563' : '#E0E7FF',
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: '#8B5CF6' }}>Giải thích AI: </strong>
                {dryRunResult.aiReasoning}
              </div>

              {/* Step by step timeline */}
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: isLight ? '#111827' : '#F9FAFB' }}>
                  Tiến trình thực thi từng bước (Execution Telemetry):
                </div>

                <Timeline
                  items={dryRunResult.steps?.map((st) => ({
                    color: '#10B981',
                    dot: <CheckCircleFilled style={{ fontSize: 14 }} />,
                    children: (
                      <div style={{ paddingBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: isLight ? '#111827' : '#F9FAFB' }}>
                            Bước {st.step}: {st.name}
                          </span>
                          <Tag style={{ fontSize: 10, borderRadius: 4 }}>{st.latencyMs}ms</Tag>
                        </div>
                        <div style={{ color: isLight ? '#6B7280' : '#94A3B8', fontSize: 12, marginTop: 4 }}>
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
        onApplyFlowUpdate={async (newNodes, newEdges) => {
          if (newNodes && newNodes.length > 0) {
            const mappedNodes = newNodes.map((n: any) => {
              const resolvedType = n.type === 'group' || n.type?.includes('group')
                ? 'group'
                : n.type?.includes('trigger')
                  ? 'trigger'
                  : n.type?.includes('ai')
                    ? 'ai'
                    : 'action';
              const nodeData = n.data || { label: n.label, description: n.description || '' };
              const nodeStyle = resolvedType === 'group'
                ? { width: nodeData.width || n.style?.width || 560, height: nodeData.height || n.style?.height || 280, zIndex: -1, ...n.style }
                : n.style;

              return {
                ...n,
                type: resolvedType,
                parentId: n.parentId,
                extent: n.extent,
                style: nodeStyle,
                zIndex: n.parentId ? 10 : (resolvedType === 'group' ? -1 : 0),
                data: {
                  ...nodeData,
                  onToggleExpand: handleToggleExpandGroup,
                  onUngroup: handleUngroupGroup,
                  onResize: handleResizeGroup,
                  onResizeEnd: handleResizeGroupEnd,
                  onDetachFromGroup: n.parentId ? handleDetachNodeFromGroup : undefined,
                },
              };
            });

            const mappedEdges = (newEdges || []).map((e: any) => ({
              ...e,
              type: 'directive',
              animated: e.animated ?? true,
              style: e.style || { stroke: e.data?.isInternal ? '#10B981' : '#2563EB', strokeWidth: 2 },
              zIndex: e.data?.isInternal ? 20 : 1,
              data: {
                ...e.data,
                label: e.data?.label || e.label || '',
                onEditEdge: handleOpenEdgeModal,
                onDeleteEdge: handleDeleteEdge,
              },
            }));

            setNodes(mappedNodes);
            setEdges(mappedEdges);

            try {
              if (currentWorkflow?._id) {
                await workflowService.updateWorkflow(currentWorkflow._id, {
                  nodes: mappedNodes,
                  edges: mappedEdges,
                });
                setCurrentWorkflow({
                  ...currentWorkflow,
                  nodes: mappedNodes,
                  edges: mappedEdges,
                });
              } else {
                const created = await workflowService.createWorkflow({
                  name: 'Quy trình Tối ưu Đa kênh AI Auto-Architect',
                  description: 'Quy trình tự động hóa phân tích theo hạ tầng thực tế của doanh nghiệp',
                  isActive: true,
                  nodes: mappedNodes,
                  edges: mappedEdges,
                });
                setCurrentWorkflow(created);
              }
            } catch (err: any) {
              console.warn('Lỗi lưu quy trình auto-architect:', err.message);
            }

            setTimeout(() => fitView({ duration: 500, padding: 0.1 }), 120);
          }
        }}
        onGroupSelectedNodes={handleGroupSelectedNodes}
        onUngroupNodes={() => {
          const selectedGroups = nodes.filter((n) => n.selected && n.type === 'group');
          if (selectedGroups.length > 0) {
            selectedGroups.forEach((g) => handleUngroupGroup(g.id));
          } else {
            notify.info('Vui lòng chọn một cụm phân vùng trên Canvas để tách khối!');
          }
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
