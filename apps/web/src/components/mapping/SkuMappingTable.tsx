import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Progress, message } from 'antd';
import {
  CheckOutlined,
  SearchOutlined,
  ThunderboltFilled,
  SyncOutlined,
} from '@ant-design/icons';

interface SkuMappingItem {
  key: string;
  sourcePlatform: 'TIKTOK_SHOP' | 'SHOPEE';
  sourceSku: string;
  sourceName: string;
  posPlatform: 'SAPO' | 'KIOTVIET';
  targetSku: string;
  targetName: string;
  confidence: number;
  status: 'AUTO_APPROVED' | 'NEEDS_REVIEW' | 'MANUAL';
}

const initialData: SkuMappingItem[] = [
  {
    key: '1',
    sourcePlatform: 'TIKTOK_SHOP',
    sourceSku: 'TTS-AT-COT-BLK-L',
    sourceName: 'Áo thun Cotton Nam Màu Đen Size L Cao Cấp PTIT',
    posPlatform: 'SAPO',
    targetSku: 'AT-COT-BLK-L',
    targetName: 'Áo Thun Cotton Nam Đen Size L',
    confidence: 0.985,
    status: 'AUTO_APPROVED',
  },
  {
    key: '2',
    sourcePlatform: 'SHOPEE',
    sourceSku: 'SP-POLO-PIMA-WHT-M',
    sourceName: 'Áo Polo Pima Nam Trắng M Co Giãn 4 Chiều',
    posPlatform: 'SAPO',
    targetSku: 'PL-PIMA-WHT-M',
    targetName: 'Áo Polo Pima Trắng Size M',
    confidence: 0.912,
    status: 'NEEDS_REVIEW',
  },
  {
    key: '3',
    sourcePlatform: 'TIKTOK_SHOP',
    sourceSku: 'TTS-SM-OXFORD-BLU-XL',
    sourceName: 'Sơ mi Oxford Xanh Nhạt Dài Tay Form Rộng XL',
    posPlatform: 'KIOTVIET',
    targetSku: 'SM-OXF-BLU-XL',
    targetName: 'Sơ Mi Oxford Xanh Dài Tay Size XL',
    confidence: 0.894,
    status: 'NEEDS_REVIEW',
  },
];

export const SkuMappingTable: React.FC = () => {
  const [data, setData] = useState<SkuMappingItem[]>(initialData);

  const handleApprove = (key: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, status: 'AUTO_APPROVED' } : item
      )
    );
    message.success('Đã xác nhận liên kết SKU thành công!');
  };

  const columns = [
    {
      title: 'Sản phẩm Sàn TMĐT',
      key: 'source',
      render: (_: any, record: SkuMappingItem) => (
        <div>
          <Space>
            <Tag
              color={record.sourcePlatform === 'TIKTOK_SHOP' ? '#000000' : '#EE4D2D'}
              style={{
                borderRadius: 4,
                fontWeight: 700,
                border: record.sourcePlatform === 'TIKTOK_SHOP' ? '1px solid #374151' : 'none',
              }}
            >
              {record.sourcePlatform === 'TIKTOK_SHOP' ? 'TikTok Shop' : 'Shopee'}
            </Tag>
            <span style={{ fontFamily: 'JetBrains Mono', color: '#fcc20f', fontWeight: 600 }}>
              {record.sourceSku}
            </span>
          </Space>
          <div style={{ color: '#F9FAFB', fontSize: 13, marginTop: 4 }}>
            {record.sourceName}
          </div>
        </div>
      ),
    },
    {
      title: 'SKU Kho POS Đích',
      key: 'target',
      render: (_: any, record: SkuMappingItem) => (
        <div>
          <Space>
            <Tag color="#10B981" style={{ borderRadius: 4, fontWeight: 700 }}>
              {record.posPlatform}
            </Tag>
            <span style={{ fontFamily: 'JetBrains Mono', color: '#10B981', fontWeight: 600 }}>
              {record.targetSku}
            </span>
          </Space>
          <div style={{ color: '#D1D5DB', fontSize: 13, marginTop: 4 }}>
            {record.targetName}
          </div>
        </div>
      ),
    },
    {
      title: 'Độ Tin Cậy AI (Hybrid Score)',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 220,
      render: (confidence: number) => {
        const percent = Math.round(confidence * 100);
        let strokeColor = '#10B981';
        if (percent < 95) strokeColor = '#fcc20f';
        if (percent < 70) strokeColor = '#EF4444';

        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>Qdrant + Gemini</span>
              <span style={{ fontWeight: 700, color: strokeColor }}>{percent}%</span>
            </div>
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor={strokeColor}
              trailColor="#1F2937"
              size="small"
            />
          </div>
        );
      },
    },
    {
      title: 'Trạng thái & Thao tác',
      key: 'action',
      width: 200,
      render: (_: any, record: SkuMappingItem) => {
        if (record.status === 'AUTO_APPROVED') {
          return (
            <Tag color="#10B981" style={{ borderRadius: 6, fontWeight: 600, padding: '4px 8px' }}>
              <CheckOutlined /> Đã Đồng Bộ Tự Động
            </Tag>
          );
        }

        return (
          <Button
            type="primary"
            size="small"
            icon={<ThunderboltFilled />}
            onClick={() => handleApprove(record.key)}
            style={{
              background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
              border: 'none',
              fontWeight: 600,
              borderRadius: 6,
            }}
          >
            Duyệt 1-Click
          </Button>
        );
      },
    },
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <ThunderboltFilled style={{ color: '#8B5CF6', fontSize: 18 }} />
            <span style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 16 }}>
              Bảng Ánh Xạ SKU Thông Minh (AI SKU Auto-Mapping Hub)
            </span>
          </Space>
          <Input
            prefix={<SearchOutlined style={{ color: '#6B7280' }} />}
            placeholder="Tìm kiếm theo mã SKU hoặc tên SP..."
            style={{ width: 280, background: '#0B0F19', borderColor: '#374151', color: '#F9FAFB' }}
          />
        </div>
      }
      bordered={false}
      style={{
        background: '#111827',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
      }}
    >
      <Table
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 10 }}
        style={{ background: 'transparent' }}
      />
    </Card>
  );
};
