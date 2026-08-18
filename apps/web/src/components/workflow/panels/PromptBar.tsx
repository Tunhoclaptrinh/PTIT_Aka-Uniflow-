import React, { useState, useRef } from 'react';
import { Input, Tag, InputRef } from 'antd';
import { ArrowRightOutlined, RobotFilled } from '@ant-design/icons';
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
      notify.success('AI đã phân tích và tạo dựng quy trình thành công trên Canvas! ✨');
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
    { label: 'TikTok ➔ Sapo ➔ GHTK', full: 'Đồng bộ đơn TikTok Shop sang Sapo POS và tạo vận đơn GHTK khi đã thanh toán' },
    { label: 'Shopee ➔ KiotViet ➔ GHN', full: 'Bắt sự kiện Shopee sẵn sàng giao, trừ kho KiotViet và tạo đơn GHN Nhanh' },
    { label: 'Lazada ➔ Haravan ➔ Viettel Post', full: 'Đồng bộ đơn Lazada sang Haravan ERP và đẩy đơn Viettel Post tự động' },
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
        maxWidth: 820,
        background: isLight ? 'rgba(255, 255, 255, 0.96)' : 'rgba(17, 24, 39, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 14,
        border: '1px solid var(--border-subtle, #E5E7EB)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        padding: '10px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        transition: 'all 0.3s ease',
      }}
    >
      {/* 1. Quick Prompt Suggestion Tags */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 4 }}>
          <RobotFilled /> Gợi ý lời nhắc AI:
        </span>
        {samplePrompts.map((item, idx) => (
          <Tag
            key={idx}
            onClick={() => handleSelectSample(item.full)}
            style={{
              cursor: 'pointer',
              borderRadius: 6,
              fontSize: 11,
              padding: '1px 8px',
              background: isLight ? '#F3F4F6' : '#1F2937',
              borderColor: isLight ? '#E5E7EB' : '#374151',
              color: isLight ? '#374151' : '#D1D5DB',
              transition: 'all 0.2s ease',
            }}
          >
            {item.label}
          </Tag>
        ))}
      </div>

      {/* 2. Main Prompt Input Bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Input
          ref={inputRef}
          prefix={<RobotFilled style={{ color: '#8B5CF6', fontSize: 15, marginRight: 4 }} />}
          placeholder="Nhập mô tả luồng tự động (Ví dụ: Đồng bộ đơn Shopee sang Sapo và tạo đơn GHN...)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onPressEnter={() => handleGenerate()}
          style={{
            flex: 1,
            borderRadius: 8,
            height: 38,
            fontSize: 13,
            background: isLight ? '#FFFFFF' : '#111827',
            borderColor: isLight ? '#E5E7EB' : '#374151',
          }}
          allowClear
        />

        <BaseButton
          variant="primary"
          size="middle"
          onClick={() => handleGenerate()}
          loading={loading || localLoading}
          icon={<ArrowRightOutlined />}
          style={{
            height: 38,
            padding: '0 16px',
            fontSize: 13,
            borderRadius: 8,
            flexShrink: 0,
          }}
        >
          Tạo luồng tự động
        </BaseButton>
      </div>
    </div>
  );
};

export default PromptBar;
