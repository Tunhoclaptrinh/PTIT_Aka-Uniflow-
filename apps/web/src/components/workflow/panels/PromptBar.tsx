import React, { useState } from 'react';
import { Input, Button, message, Tag } from 'antd';
import { ThunderboltFilled, ArrowRightOutlined, RobotFilled } from '@ant-design/icons';

interface PromptBarProps {
  onGenerate: (promptText: string) => void;
}

export const PromptBar: React.FC<PromptBarProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      message.warning('Vui lòng nhập mô tả luồng tự động bạn muốn AI tạo dựng!');
      return;
    }

    setLoading(true);
    message.loading({ content: 'AI Gemini đang phân tích yêu cầu và sinh luồng Canvas...', key: 'aiPrompt' });

    setTimeout(() => {
      onGenerate(prompt);
      setLoading(false);
      message.success({
        content: 'AI đã tự động sinh quy trình 0-chạm thành công trên Canvas! ✨',
        key: 'aiPrompt',
        duration: 3,
      });
      setPrompt('');
    }, 1000);
  };

  const samplePrompts = [
    'Đồng bộ đơn TikTok sang Sapo và đẩy GHTK khi đã thanh toán',
    'Bắt sự kiện Shopee READY_TO_SHIP, trừ kho KiotViet và tạo đơn GHN',
    'Tự động định tuyến cước rẻ nhất giữa GHTK và Viettel Post',
  ];

  return (
    <div
      style={{
        padding: '12px 20px',
        background: 'linear-gradient(90deg, rgba(237, 28, 36, 0.08) 0%, rgba(252, 194, 15, 0.08) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Input
          prefix={<RobotFilled style={{ color: '#8B5CF6', fontSize: 16 }} />}
          placeholder="Nhập mô tả luồng tự động bằng tiếng Việt (Ví dụ: Đồng bộ đơn Shopee sang Sapo và tạo đơn GHN...)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onPressEnter={handleGenerate}
          style={{
            flex: 1,
            background: '#0B0F19',
            borderColor: '#374151',
            color: '#F9FAFB',
            height: 40,
            borderRadius: 8,
          }}
        />
        <Button
          type="primary"
          icon={<ThunderboltFilled />}
          loading={loading}
          onClick={handleGenerate}
          style={{
            background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
            border: 'none',
            fontWeight: 700,
            height: 40,
            borderRadius: 8,
            padding: '0 20px',
          }}
        >
          AI Magic Generate <ArrowRightOutlined />
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>💡 Gợi ý mẫu:</span>
        {samplePrompts.map((p) => (
          <Tag
            key={p}
            onClick={() => setPrompt(p)}
            style={{
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.04)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              color: '#D1D5DB',
              fontSize: 11,
              borderRadius: 4,
            }}
          >
            {p}
          </Tag>
        ))}
      </div>
    </div>
  );
};
