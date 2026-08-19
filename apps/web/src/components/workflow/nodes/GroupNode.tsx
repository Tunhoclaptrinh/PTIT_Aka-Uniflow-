import React, { useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import {
  CompressOutlined,
  ExpandAltOutlined,
  ThunderboltFilled,
  AppstoreOutlined,
  ScissorOutlined,
} from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import { BaseButton } from '../../base/BaseButton';

export const GroupNode: React.FC<any> = ({ id, data, selected }) => {
  const [isExpanded, setIsExpanded] = useState(data.isExpanded ?? true);
  const [isHovered, setIsHovered] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (data.onToggleExpand) {
      data.onToggleExpand(id, nextState);
    }
  };

  const handleUngroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onUngroup) {
      data.onUngroup(id);
    }
  };

  const groupTitle = data.label || 'Cụm phân vùng gom nhóm thông minh';
  const childNodesCount = data.childCount || (data.carriers ? data.carriers.length : 3);
  const subtitle = data.subtitle || '🏆 Thuật toán AI tối ưu tự động';

  if (!isExpanded) {
    // Collapsed Mode: Clean Compact Composite Card
    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: 270,
          background: '#FFFFFF',
          borderRadius: 10,
          border: selected ? '2px solid #8B5CF6' : '1px solid #C4B5FD',
          borderLeft: '4px solid #8B5CF6',
          boxShadow: selected
            ? '0 0 0 3px rgba(139, 92, 246, 0.25), 0 8px 20px rgba(0, 0, 0, 0.08)'
            : isHovered
            ? '0 6px 16px rgba(139, 92, 246, 0.15)'
            : '0 2px 8px rgba(139, 92, 246, 0.08)',
          padding: '10px 14px',
          color: '#111827',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.2s ease',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#8B5CF6', width: 8, height: 8, border: '2px solid #FFFFFF' }}
        />

        {/* Hover Quick Action for Collapsed Card (Icon-only) */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              top: -32,
              right: 0,
              display: 'flex',
              gap: 4,
              background: '#FFFFFF',
              padding: '3px 6px',
              borderRadius: 6,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              border: '1px solid #E2E8F0',
              zIndex: 20,
            }}
          >
            <Tooltip title="Gỡ gộp vùng (Bung các khối độc lập)">
              <BaseButton
                variant="ghost"
                size="small"
                icon={<ScissorOutlined style={{ color: '#EF4444' }} />}
                onClick={handleUngroup}
                style={{ height: 24, width: 24, padding: 0 }}
              />
            </Tooltip>
            <Tooltip title="Mở rộng cụm phân vùng">
              <BaseButton
                variant="ghost"
                size="small"
                icon={<ExpandAltOutlined style={{ color: '#8B5CF6' }} />}
                onClick={toggleExpand}
                style={{ height: 24, width: 24, padding: 0 }}
              />
            </Tooltip>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Tag color="purple" style={{ margin: 0, fontSize: 10, fontWeight: 700, borderRadius: 4 }}>
            CỤM ĐÃ THU GỌN ({childNodesCount} KHỐI)
          </Tag>
          <Tooltip title="Mở rộng cụm">
            <span
              onClick={toggleExpand}
              style={{
                cursor: 'pointer',
                color: '#8B5CF6',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: 600,
              }}
            >
              <ExpandAltOutlined />
            </span>
          </Tooltip>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#F3E8FF',
              color: '#8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AppstoreOutlined style={{ fontSize: 18 }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {groupTitle}
            </div>
            <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginTop: 2 }}>
              {subtitle}
            </div>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#8B5CF6', width: 8, height: 8, border: '2px solid #FFFFFF' }}
        />
      </div>
    );
  }

  // Expanded Mode: Visual Sub-Process Partition Container with Official NodeResizer
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        height: '100%',
        minWidth: data.width || 580,
        minHeight: data.height || 290,
        background: isHovered ? 'rgba(245, 243, 255, 0.55)' : 'rgba(245, 243, 255, 0.35)',
        backdropFilter: 'blur(4px)',
        borderRadius: 14,
        border: selected ? '2px dashed #8B5CF6' : isHovered ? '2px dashed #A78BFA' : '2px dashed #C4B5FD',
        boxShadow: selected
          ? '0 0 0 4px rgba(139, 92, 246, 0.15)'
          : isHovered
          ? '0 4px 16px rgba(139, 92, 246, 0.1)'
          : 'none',
        padding: '12px 16px',
        position: 'relative',
        userSelect: 'none',
        zIndex: 0,
      }}
    >
      {/* Official ReactFlow NodeResizer for smooth 8-direction dragging */}
      <NodeResizer
        isVisible={selected || isHovered}
        minWidth={360}
        minHeight={200}
        handleStyle={{ width: 10, height: 10, borderRadius: 3, background: '#8B5CF6', border: '2px solid #FFFFFF' }}
        lineStyle={{ borderColor: '#8B5CF6', borderStyle: 'dashed' }}
      />

      {/* Floating Hover Action Toolbar (Icon-only with Tooltips) */}
      <div
        style={{
          position: 'absolute',
          top: -34,
          left: 12,
          display: isHovered || selected ? 'flex' : 'none',
          alignItems: 'center',
          gap: 6,
          background: '#FFFFFF',
          padding: '3px 8px',
          borderRadius: 8,
          border: '1px solid #C4B5FD',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.18)',
          zIndex: 50,
          animation: 'fadeIn 0.15s ease',
        }}
      >
        <Tooltip title="Gỡ gộp vùng (Bung các khối con độc lập)">
          <BaseButton
            variant="ghost"
            size="small"
            icon={<ScissorOutlined style={{ color: '#EF4444' }} />}
            onClick={handleUngroup}
            style={{ width: 26, height: 26, padding: 0 }}
          />
        </Tooltip>

        <Tooltip title="Thu gọn phân vùng (Ẩn các khối con)">
          <BaseButton
            variant="ghost"
            size="small"
            icon={<CompressOutlined style={{ color: '#8B5CF6' }} />}
            onClick={toggleExpand}
            style={{ width: 26, height: 26, padding: 0 }}
          />
        </Tooltip>

        <span style={{ fontSize: 11, color: '#6B7280', paddingLeft: 4, fontWeight: 500 }}>
          {childNodesCount} khối con • Dây kết nối hiển thị bên trên
        </span>
      </div>

      {/* Partition Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E9D5FF',
          paddingBottom: 8,
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThunderboltFilled style={{ color: '#8B5CF6', fontSize: 15 }} />
          <span style={{ fontWeight: 700, fontSize: 13, color: '#581C87' }}>
            PHÂN VÙNG: {groupTitle.toUpperCase()}
          </span>
          <Tag color="purple" style={{ margin: 0, borderRadius: 4, fontSize: 10 }}>
            {childNodesCount} khối con
          </Tag>
        </div>

        {/* Header Icon-only Action Controls with Tooltips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Tooltip title="Gỡ gộp vùng">
            <BaseButton
              variant="ghost"
              size="small"
              icon={<ScissorOutlined style={{ color: '#EF4444' }} />}
              onClick={handleUngroup}
              style={{ width: 26, height: 26, padding: 0 }}
            />
          </Tooltip>

          <Tooltip title="Thu gọn cụm">
            <BaseButton
              variant="ghost"
              size="small"
              icon={<CompressOutlined style={{ color: '#8B5CF6' }} />}
              onClick={toggleExpand}
              style={{ width: 26, height: 26, padding: 0 }}
            />
          </Tooltip>
        </div>
      </div>

      {/* Sub-process info banner */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          borderRadius: 8,
          border: '1px solid #E9D5FF',
          padding: '6px 12px',
          fontSize: 11,
          color: '#64748B',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <span>
          Cụm xử lý độc lập: <strong>{childNodesCount} khối con bên trong</strong>
        </span>
        <span style={{ color: '#059669', fontWeight: 600 }}>
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default GroupNode;
