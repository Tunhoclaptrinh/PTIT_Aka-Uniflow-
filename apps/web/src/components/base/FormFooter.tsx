import React from 'react';
import { Space } from 'antd';
import { CheckOutlined, CloseOutlined, UndoOutlined } from '@ant-design/icons';
import { BaseButton } from './BaseButton';
import { FormFooterProps } from './types';

/**
 * FormFooter Component chuẩn Base
 * Hỗ trợ căn giữa (center) mặc định chuẩn chỉ, tích hợp nút Lưu/Hủy/Reset
 */
export const FormFooter: React.FC<FormFooterProps> = ({
  submitText = 'Lưu thay đổi',
  cancelText = 'Hủy bỏ',
  resetText,
  loading = false,
  disabled = false,
  align = 'center',
  onCancel,
  onSubmit,
  onReset,
  extra,
  style,
}) => {
  const justifyMap: Record<string, string> = {
    center: 'center',
    left: 'flex-start',
    right: 'flex-end',
    'space-between': 'space-between',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: justifyMap[align] || 'center',
        alignItems: 'center',
        gap: 12,
        paddingTop: 16,
        marginTop: 16,
        borderTop: '1px solid var(--border-subtle, #E5E7EB)',
        width: '100%',
        ...style,
      }}
    >
      {extra && <div style={{ marginRight: align === 'space-between' ? 0 : 'auto' }}>{extra}</div>}

      <Space size="middle">
        {onReset && resetText && (
          <BaseButton
            variant="ghost"
            icon={<UndoOutlined />}
            onClick={onReset}
            disabled={disabled || loading}
            style={{ minWidth: 90 }}
          >
            {resetText}
          </BaseButton>
        )}

        {onCancel && (
          <BaseButton
            variant="ghost"
            icon={<CloseOutlined />}
            onClick={onCancel}
            disabled={disabled || loading}
            style={{ minWidth: 90 }}
          >
            {cancelText}
          </BaseButton>
        )}

        {onSubmit && (
          <BaseButton
            variant="primary"
            icon={<CheckOutlined />}
            loading={loading}
            disabled={disabled}
            glow
            onClick={onSubmit}
            style={{ minWidth: 120 }}
          >
            {submitText}
          </BaseButton>
        )}
      </Space>
    </div>
  );
};

export default FormFooter;
