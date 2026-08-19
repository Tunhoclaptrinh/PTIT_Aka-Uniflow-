import React, { useState } from 'react';
import {
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
  EdgeProps,
} from '@xyflow/react';
import {
  ThunderboltFilled,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';

export const DirectiveEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  data = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  const edgeLabel = (data as any).label || (data as any).directive || (data as any).condition || '';
  const conditionExpr = (data as any).conditionExpr || '';
  const edgeColor = (style as any).stroke || ((data as any).isInternal ? '#10B981' : '#2563EB');
  const isInternal = (data as any).isInternal ?? false;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ((data as any).onEditEdge) {
      (data as any).onEditEdge(id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ((data as any).onDeleteEdge) {
      (data as any).onDeleteEdge(id);
    }
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected ? '#8B5CF6' : isHovered ? '#8B5CF6' : (style as any).stroke || edgeColor,
          strokeWidth: selected ? 3.5 : isHovered ? 3 : (style as any).strokeWidth || 2,
          transition: 'all 0.15s ease',
        }}
      />

      <EdgeLabelRenderer>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            zIndex: selected ? 100 : isHovered ? 90 : isInternal ? 30 : 20,
            cursor: 'pointer',
          }}
        >
          {edgeLabel ? (
            <div
              onClick={handleEdit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px',
                borderRadius: 12,
                background: selected
                  ? '#8B5CF6'
                  : isHovered
                  ? '#FFFFFF'
                  : 'rgba(255, 255, 255, 0.94)',
                border: selected
                  ? '1.5px solid #7C3AED'
                  : `1.5px solid ${edgeColor}`,
                color: selected ? '#FFFFFF' : '#1E293B',
                boxShadow: selected
                  ? '0 0 0 3px rgba(139, 92, 246, 0.25), 0 4px 12px rgba(0,0,0,0.12)'
                  : isHovered
                  ? '0 4px 12px rgba(0, 0, 0, 0.12)'
                  : '0 1px 4px rgba(0, 0, 0, 0.06)',
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                userSelect: 'none',
              }}
            >
              {conditionExpr ? (
                <BranchesOutlined style={{ color: selected ? '#FFFFFF' : edgeColor, fontSize: 11 }} />
              ) : (
                <ThunderboltFilled style={{ color: selected ? '#FFFFFF' : edgeColor, fontSize: 10 }} />
              )}
              <span>{edgeLabel}</span>

              {isHovered && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    marginLeft: 4,
                    paddingLeft: 4,
                    borderLeft: `1px solid ${selected ? 'rgba(255,255,255,0.4)' : '#E2E8F0'}`,
                  }}
                >
                  <Tooltip title="Chỉnh sửa chỉ lệnh / điều kiện">
                    <span
                      onClick={handleEdit}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        background: selected ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                        color: selected ? '#FFFFFF' : '#475569',
                      }}
                    >
                      <EditOutlined style={{ fontSize: 10 }} />
                    </span>
                  </Tooltip>
                  <Tooltip title="Xóa đường liên kết">
                    <span
                      onClick={handleDelete}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        background: selected ? 'rgba(239,68,68,0.3)' : '#FEE2E2',
                        color: '#EF4444',
                      }}
                    >
                      <DeleteOutlined style={{ fontSize: 10 }} />
                    </span>
                  </Tooltip>
                </div>
              )}
            </div>
          ) : (
            isHovered && (
              <Tooltip title="Gán chỉ lệnh / điều kiện rẽ nhánh cho đường liên kết này">
                <div
                  onClick={handleEdit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: '#FFFFFF',
                    border: '1px dashed #8B5CF6',
                    color: '#8B5CF6',
                    fontSize: 10.5,
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(139,92,246,0.15)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <PlusOutlined style={{ fontSize: 9 }} />
                  <span>Thêm chỉ lệnh</span>
                </div>
              </Tooltip>
            )
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default DirectiveEdge;
