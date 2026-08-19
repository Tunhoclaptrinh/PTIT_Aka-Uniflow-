import React, { useState, useRef } from 'react';
import { Input, InputRef } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { BaseButton } from '../../base/BaseButton';
import { notify } from '../../../utils/notification';
import { useAppConfig } from '../../../context/AppConfigContext';

interface PromptBarProps {
  onGenerate: (promptText: string) => Promise<void> | void;
  loading?: boolean;
}

export const PromptBar: React.FC<PromptBarProps> = ({ onGenerate, loading = false }) => {
  const [prompt, setPrompt] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const { themeMode } = useAppConfig();
  const isLight = themeMode === 'light';

  const handleGenerate = async (textToUse?: string) => {
    const query = textToUse || prompt;
    if (!query.trim()) {
      notify.warning('Vui lòng nhập mô tả quy trình bạn muốn AI tạo dựng!');
      return;
    }

    setPrompt(query);
    setLocalLoading(true);
    notify.loading('AI đang phân tích yêu cầu và dựng cấu trúc quy trình...', 'aiPrompt');

    try {
      await onGenerate(query);
      notify.success('AI đã phân tích và tạo dựng quy trình thành công trên Canvas.');
    } catch (err: any) {
      notify.error('Lỗi khi sinh quy trình bằng AI: ' + err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSelectSample = (itemFull: string) => {
    setPrompt(itemFull);
    inputRef.current?.focus();
    handleGenerate(itemFull);
  };

  const samplePrompts = [
    { label: 'TikTok -> Sapo -> GHTK', full: 'Đồng bộ đơn TikTok Shop sang Sapo POS và tạo vận đơn GHTK khi đã thanh toán' },
    { label: 'Shopee -> KiotViet -> GHN', full: 'Bắt sự kiện Shopee sẵn sàng giao, trừ kho KiotViet và tạo đơn GHN Nhanh' },
    { label: 'Lazada -> Haravan -> Viettel Post', full: 'Đồng bộ đơn Lazada sang Haravan ERP và đẩy đơn Viettel Post tự động' },
    { label: 'So sánh cước & Chốt rẻ nhất', full: 'Tự động so sánh cước vận chuyển giữa GHTK, GHN, Viettel Post và tự động chốt hãng rẻ nhất' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        width: '92%',
        maxWidth: 780,
        background: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(17, 24, 39, 0.98)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 12,
        border: isLight ? '1px solid #E5E7EB' : '1px solid #374151',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'all 0.3s ease',
      }}
    >
      {/* 1. Quick Prompt Suggestion Hashtags */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {samplePrompts.map((item, idx) => (
          <span
            key={idx}
            onClick={() => handleSelectSample(item.full)}
            style={{
              cursor: 'pointer',
              fontSize: 12,
              padding: '2px 8px',
              borderRadius: 6,
              background: isLight ? '#F9FAFB' : '#1F2937',
              border: isLight ? '1px solid #E5E7EB' : '1px solid #374151',
              color: isLight ? '#4B5563' : '#D1D5DB',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              userSelect: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ed1c24';
              e.currentTarget.style.color = '#ed1c24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isLight ? '#E5E7EB' : '#374151';
              e.currentTarget.style.color = isLight ? '#4B5563' : '#D1D5DB';
            }}
          >
            <span style={{ color: '#9CA3AF', fontWeight: 600 }}>#</span>
            {item.label}
          </span>
        ))}
      </div>

      {/* 2. Main Prompt Input & Tooltip Icon Action Button */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Input
          ref={inputRef}
          prefix={<img src="/favicon.svg" alt="UniFlow AI" style={{ height: 24, width: 24, objectFit: 'contain', marginRight: 6 }} />}
          placeholder="Nhập mô tả luồng tự động (Ví dụ: Đồng bộ đơn Shopee sang Sapo và tạo đơn GHN...)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onPressEnter={() => handleGenerate()}
          style={{
            flex: 1,
            borderRadius: 6,
            height: 36,
            fontSize: 13,
            background: isLight ? '#FFFFFF' : '#111827',
            borderColor: isLight ? '#E5E7EB' : '#374151',
          }}
          allowClear
        />

        <BaseButton
          variant="primary"
          tooltip="Tạo luồng tự động bằng AI"
          onClick={() => handleGenerate()}
          loading={loading || localLoading}
          icon={<ArrowRightOutlined />}
          style={{
            height: 36,
            width: 36,
            minWidth: 36,
            padding: 0,
            borderRadius: 6,
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
};

export default PromptBar;
