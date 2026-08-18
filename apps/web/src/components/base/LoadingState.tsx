import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { LoadingStateProps } from './types';

export const LoadingState: React.FC<LoadingStateProps> = ({
  tip = 'Đang tải dữ liệu...',
  size = 'default',
  minHeight = 200,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight,
        width: '100%',
        gap: 12,
        padding: '32px 0',
      }}
    >
      <Spin
        size={size}
        indicator={<LoadingOutlined style={{ fontSize: size === 'large' ? 36 : size === 'small' ? 18 : 24, color: '#ed1c24' }} spin />}
      />
      {tip && <span style={{ color: '#6B7280', fontSize: 13, fontWeight: 500 }}>{tip}</span>}
    </div>
  );
};

export default LoadingState;
