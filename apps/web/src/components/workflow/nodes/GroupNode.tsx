import React, { useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import {
  CompressOutlined,
  ExpandAltOutlined,
  AppstoreOutlined,
  ScissorOutlined,
} from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import { BaseButton } from '../../base/BaseButton';
import { useAppConfig } from '../../../context/AppConfigContext';

export const GroupNode: React.FC<any> = ({ id, data, selected }) => {
  const { themeMode } = useAppConfig();
  const isLight = themeMode === 'light';
  const [isExpanded, setIsExpanded] = useState(data.isExpanded ?? true);
  const [isHovered, setIsHovered] = useState(false);

  // Sync local state khi data.isExpanded thay đổi từ WorkflowCanvas
  React.useEffect(() => {
    if (data.isExpanded !== undefined && data.isExpanded !== isExpanded) {
      setIsExpanded(data.isExpanded);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.isExpanded]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (data.onToggleExpand) data.onToggleExpand(id, nextState);
  };

  const handleUngroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onUngroup) data.onUngroup(id);
  };

  const groupTitle = data.label || 'Cụm phân vùng';
  const childNodesCount = data.childCount || 0;
  const subtitle = data.subtitle || '';

  // ── COLLAPSED MODE ─────────────────────────────────────────────────────────
  if (!isExpanded) {
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight ? '#FFFFFF' : '#111827',
          borderRadius: 6,
          border: selected ? '2px solid #8B5CF6' : '1.5px solid #8B5CF6',
          boxShadow: selected
            ? '0 0 0 3px rgba(139,92,246,0.3), 0 8px 20px rgba(0,0,0,0.2)'
            : isHovered
            ? '0 6px 18px rgba(139,92,246,0.25)'
            : '0 2px 8px rgba(139,92,246,0.15)',
          padding: '10px 14px',
          color: isLight ? '#111827' : '#F9FAFB',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Handle type="target" position={Position.Left} style={{ background: '#8B5CF6', width: 9, height: 9, border: '2px solid #FFFFFF' }} />

        {isHovered && (
          <div style={{ position: 'absolute', top: -32, right: 0, display: 'flex', gap: 4, background: isLight ? '#FFFFFF' : '#1F2937', padding: '3px 6px', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255,255,255,0.08)', zIndex: 100 }}>
            <Tooltip title="Gỡ gộp vùng">
              <BaseButton variant="ghost" size="small" icon={<ScissorOutlined style={{ color: '#EF4444' }} />} onClick={handleUngroup} style={{ height: 24, width: 24, padding: 0 }} />
            </Tooltip>
            <Tooltip title="Mở rộng cụm">
              <BaseButton variant="ghost" size="small" icon={<ExpandAltOutlined style={{ color: '#8B5CF6' }} />} onClick={toggleExpand} style={{ height: 24, width: 24, padding: 0 }} />
            </Tooltip>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tag color="purple" style={{ margin: 0, fontSize: 10, fontWeight: 700, borderRadius: 4 }}>
            CỤM ĐÃ THU GỌN ({childNodesCount} KHỐI)
          </Tag>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <div style={{ width: 34, height: 34, borderRadius: 6, background: isLight ? '#F3E8FF' : '#2E1065', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AppstoreOutlined style={{ fontSize: 17 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: isLight ? '#1E293B' : '#F9FAFB', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{groupTitle}</div>
            {subtitle && <div style={{ fontSize: 10.5, color: isLight ? '#059669' : '#34D399', fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</div>}
          </div>
        </div>

        <Handle type="source" position={Position.Right} style={{ background: '#8B5CF6', width: 9, height: 9, border: '2px solid #FFFFFF' }} />
      </div>
    );
  }

  // ── EXPANDED MODE ──────────────────────────────────────────────────────────
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        inset: 0,
        background: isLight
          ? (isHovered ? 'rgba(245,243,255,0.62)' : 'rgba(245,243,255,0.42)')
          : (isHovered ? 'rgba(139, 92, 246, 0.14)' : 'rgba(139, 92, 246, 0.08)'),
        backdropFilter: 'blur(3px)',
        borderRadius: 8,
        border: selected
          ? '2px dashed #8B5CF6'
          : isHovered
          ? '2px dashed #8B5CF6'
          : '2px dashed #8B5CF6',
        boxShadow: selected ? '0 0 0 4px rgba(139,92,246,0.2)' : 'none',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* NodeResizer */}
      <div style={{ pointerEvents: 'all' }}>
        <NodeResizer
          isVisible={selected}
          minWidth={280}
          minHeight={150}
          onResizeEnd={(_evt, params) => {
            if (data.onResizeEnd) {
              data.onResizeEnd(id, params);
            }
          }}
          handleStyle={{ width: 10, height: 10, borderRadius: 3, background: '#8B5CF6', border: '2px solid #FFFFFF' }}
          lineStyle={{ borderColor: '#8B5CF6', borderStyle: 'dashed' }}
        />
      </div>

      {/* Group Header — pointer-events:all — nguồn duy nhất của Ungroup + Thu gọn */}
      <div
        style={{
          pointerEvents: 'all',
          position: 'absolute',
          top: 10,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isLight ? '1px solid rgba(196,181,253,0.7)' : '1px solid rgba(139, 92, 246, 0.3)',
          paddingBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AppstoreOutlined style={{ color: '#8B5CF6', fontSize: 13 }} />
          <span style={{ fontWeight: 700, fontSize: 11, color: isLight ? '#581C87' : '#DDD6FE', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
            {groupTitle.length > 26 ? groupTitle.slice(0, 26) + '…' : groupTitle}
          </span>
          <Tag color="purple" style={{ margin: 0, borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
            {childNodesCount > 0 ? `${childNodesCount} khối con` : 'Phân vùng'}
          </Tag>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Tooltip title="Thu gọn cụm (ẩn các khối con, giữ dây kết nối)">
            <BaseButton
              variant="ghost"
              size="small"
              icon={<CompressOutlined style={{ color: '#8B5CF6' }} />}
              onClick={toggleExpand}
              style={{ width: 22, height: 22, padding: 0 }}
            />
          </Tooltip>
          <Tooltip title="Gỡ gộp phân vùng (bung các khối con ra canvas)">
            <BaseButton
              variant="ghost"
              size="small"
              icon={<ScissorOutlined style={{ color: '#EF4444' }} />}
              onClick={handleUngroup}
              style={{ width: 22, height: 22, padding: 0 }}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default GroupNode;

