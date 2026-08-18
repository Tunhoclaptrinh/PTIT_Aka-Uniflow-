import React, { useState } from 'react';
import { Input, Tag } from 'antd';
import { ArrowRightOutlined, RobotFilled } from '@ant-design/icons';
import { BaseButton } from '../../base/BaseButton';
import { notify } from '../../../utils/notification';
import { useAppConfig } from '../../../context/AppConfigContext';

interface PromptBarProps {
  onGenerate: (promptText: string) => void;
  loading?: boolean;
}

export const PromptBar: React.FC<PromptBarProps> = ({ onGenerate, loading = false }) => {
  const [prompt, setPrompt] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const { themeMode } = useAppConfig();
  const isLight = themeMode === 'light';

  const handleGenerate = (textToUse?: string) => {
    const query = textToUse || prompt;
    if (!query.trim()) {
      notify.warning('Vui lòng nhập mô tả luồng tự động bạn muốn AI tạo dựng!');
      return;
    }

    setLocalLoading(true);
    notify.loading('AI Gemini đang phân tích yêu cầu và sinh luồng Canvas...', 'aiPrompt');

    setTimeout(() => {
      onGenerate(query);
      setLocalLoading(false);
      notify.success('AI đã tự động sinh quy trình 0-chạm thành công trên Canvas! ✨');
      if (!textToUse) setPrompt('');
    }, 600);
  };

  const samplePrompts = [
    { label: 'TikTok -> Sapo -> GHTK', full: 'Đồng bộ đơn TikTok sang Sapo và đẩy GHTK khi đã thanh toán' },
    { label: 'Shopee -> KiotViet -> GHN', full: 'Bắt sự kiện Shopee READY_TO_SHIP, trừ kho KiotViet và tạo đơn GHN' },
    { label: 'Lazada -> Sapo -> Viettel Post', full: 'Đồng bộ đơn Lazada sang Sapo và đẩy đơn Viettel Post tự động' },
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
        background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 16,
        border: '1px solid var(--border-subtle, #E5E7EB)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'all 0.3s ease',
      }}
    >
      {/* 1. Quick Prompt Suggestion Tags */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 4 }}>
          <RobotFilled /> Gợi ý prompt AI:
        </span>
        {samplePrompts.map((item, idx) => (
          <Tag
            key={idx}
            onClick={() => handleGenerate(item.full)}
            style={{
              cursor: 'pointer',
              borderRadius: 6,
              fontSize: 11,
              padding: '2px 8px',
              background: isLight ? '#F3F4F6' : '#1F2937',
              borderColor: isLight ? '#E5E7EB' : '#374151',
              color: isLight ? '#374151' : '#D1D5DB',
              transition: 'all 0.2s ease',
            }}
          >
            {item.label} →
          </Tag>
        ))}
      </div>

      {/* 2. Main Prompt Input Bar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Input
          prefix={<RobotFilled style={{ color: '#8B5CF6', fontSize: 16, marginRight: 4 }} />}
          placeholder="Nhập mô tả luồng tự động bằng tiếng Việt (Ví dụ: Đồng bộ đơn Shopee sang Sapo và tạo đơn GHN...)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onPressEnter={() => handleGenerate()}
          style={{
            flex: 1,
            borderRadius: 10,
            height: 40,
            fontSize: 13,
            background: isLight ? '#FFFFFF' : '#111827',
            borderColor: isLight ? '#E5E7EB' : '#374151',
          }}
          allowClear
        />

        <BaseButton
          variant="primary"
          size="small"
          onClick={() => handleGenerate()}
          loading={loading || localLoading}
          icon={<ArrowRightOutlined />}
          glow
          style={{
            height: 40,
            padding: '0 16px',
            fontSize: 13,
            borderRadius: 10,
            flexShrink: 0,
          }}
        >
          AI Tạo Luồng 0-Chạm
        </BaseButton>
      </div>
    </div>
  );
};

export default PromptBar;
