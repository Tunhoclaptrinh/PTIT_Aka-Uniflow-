import React, { useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import {
  DatabaseFilled,
  CarFilled,
  BellFilled,
  BranchesOutlined,
} from '@ant-design/icons';
import { getPartnerLogo } from '../../../utils/partnerLogos';

export const ActionNode: React.FC<any> = ({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);

  const label = (data.label || '').toLowerCase();
  const category = (data.category || '').toUpperCase();

  const isAccounting =
    category === 'ACCOUNTING' ||
    category === 'TAX' ||
    category === 'FINANCE' ||
    label.includes('misa') ||
    label.includes('kế toán') ||
    label.includes('ke toan') ||
    label.includes('thuế') ||
    label.includes('thue') ||
    label.includes('hóa đơn') ||
    label.includes('hoa don') ||
    label.includes('fast') ||
    label.includes('bravo') ||
    label.includes('meinvoice') ||
    label.includes('sổ cái');

  const isPos =
    (category === 'POS' ||
    category === 'POS_ERP' ||
    label.includes('sapo') ||
    label.includes('kiotviet') ||
    label.includes('haravan') ||
    label.includes('odoo') ||
    label.includes('kho')) && !isAccounting;

  const isLogic =
    category === 'LOGIC' ||
    label.includes('rẽ nhánh') ||
    label.includes('re nhanh') ||
    label.includes('điều kiện') ||
    label.includes('vùng miền');

  const isNotify =
    category === 'NOTIFY' ||
    label.includes('telegram') ||
    label.includes('zalo') ||
    label.includes('thông báo') ||
    label.includes('cảnh báo');

  let nodeColor = '#10B981';
  let catTitle = 'Vận chuyển';
  let subTag = label.includes('rẻ nhất') ? 'Tự chốt cước' : 'Tạo vận đơn';
  let FallbackIcon = <CarFilled style={{ color: '#10B981', fontSize: 16 }} />;

  if (isAccounting) {
    nodeColor = '#0284C7';
    catTitle = 'Kế toán & Thuế';
    subTag = label.includes('hóa đơn') || label.includes('invoice') ? 'Xuất HĐ VAT' : label.includes('thuế') ? 'Kê khai thuế' : 'Sổ cái MISA';
    FallbackIcon = <DatabaseFilled style={{ color: '#0284C7', fontSize: 16 }} />;
  } else if (isPos) {
    nodeColor = '#D97706';
    catTitle = 'Kho POS / ERP';
    subTag = 'Trừ kho POS';
    FallbackIcon = <DatabaseFilled style={{ color: '#D97706', fontSize: 16 }} />;
  } else if (isLogic) {
    nodeColor = '#EC4899';
    catTitle = 'Logic & Rẽ nhánh';
    subTag = 'Điều kiện';
    FallbackIcon = <BranchesOutlined style={{ color: '#EC4899', fontSize: 16 }} />;
  } else if (isNotify) {
    nodeColor = '#3B82F6';
    catTitle = 'Cảnh báo & CRM';
    subTag = label.includes('telegram') ? 'Telegram' : 'Zalo ZNS';
    FallbackIcon = <BellFilled style={{ color: '#3B82F6', fontSize: 16 }} />;
  }

  const partnerLogo = getPartnerLogo(data.label || data.name || '');

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={190}
        minHeight={65}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, background: nodeColor, border: '2px solid #FFFFFF' }}
        lineStyle={{ borderColor: nodeColor }}
      />

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: nodeColor,
          width: 8,
          height: 8,
          border: '2px solid #FFFFFF',
          boxShadow: `0 0 6px ${nodeColor}`,
        }}
      />

      {/* Clean Minimalist Node Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          minWidth: 220,
          background: '#FFFFFF',
          borderRadius: 8,
          border: selected ? `2px solid ${nodeColor}` : '1px solid #E5E7EB',
          borderLeft: `3px solid ${nodeColor}`,
          boxShadow: selected
            ? `0 0 0 3px ${nodeColor}25, 0 6px 16px rgba(0, 0, 0, 0.06)`
            : isHovered
            ? '0 4px 12px rgba(0, 0, 0, 0.06)'
            : '0 1px 3px rgba(0, 0, 0, 0.03)',
          color: '#111827',
          cursor: 'pointer',
          userSelect: 'none',
          padding: '10px 12px',
        }}
      >
        {/* Top Minimal Category & Status */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: nodeColor }}>
            {catTitle}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: nodeColor, fontWeight: 500 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: nodeColor }} />
            {subTag}
          </span>
        </div>

        {/* Main Body: Logo & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              padding: 3,
            }}
          >
            {partnerLogo ? (
              <img
                src={partnerLogo}
                alt={data.label}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : isNotify && label.includes('telegram') ? (
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
                alt="Telegram"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              FallbackIcon
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                color: '#111827',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={data.label}
            >
              {data.label || 'Action Node'}
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#6B7280',
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {data.description || 'Xử lý hành động luồng'}
            </div>
          </div>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: nodeColor,
          width: 8,
          height: 8,
          border: '2px solid #FFFFFF',
          boxShadow: `0 0 6px ${nodeColor}`,
        }}
      />
    </div>
  );
};

export default ActionNode;
