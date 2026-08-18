import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Input, Progress, message } from 'antd';
import {
  CheckOutlined,
  SearchOutlined,
  ThunderboltFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import { mappingService, SKUMappingItem } from '../../services/mapping.service';

export const SkuMappingTable: React.FC = () => {
  const [data, setData] = useState<SKUMappingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const loadMappings = async () => {
    setLoading(true);
    try {
      const mappings = await mappingService.getMappings();
      if (mappings && mappings.length > 0) {
        setData(mappings);
      }
    } catch (err: any) {
      console.warn('Lỗi khi tải SKU Mappings từ API, dùng fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMappings();
  }, []);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await mappingService.approveMapping(id);
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, mappingStatus: 'AUTO_APPROVED' } : item
        )
      );
      message.success('Đã xác nhận liên kết SKU thành công vào MongoDB Atlas!');
    } catch (err: any) {
      message.error('Lỗi khi phê duyệt SKU: ' + err.message);
    } finally {
      setApprovingId(null);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.sourceSkuCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sourceProductName?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.targetMasterSku?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Sản phẩm Sàn TMĐT',
      key: 'source',
      render: (_: any, record: SKUMappingItem) => (
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
              {record.sourceSkuCode}
            </span>
          </Space>
          <div style={{ color: '#F9FAFB', fontSize: 13, marginTop: 4 }}>
            {record.sourceProductName}
          </div>
          {record.sourceVariationText && (
            <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
              {record.sourceVariationText}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'SKU Kho POS Đích',
      key: 'target',
      render: (_: any, record: SKUMappingItem) => (
        <div>
          <Space>
            <Tag color="#10B981" style={{ borderRadius: 4, fontWeight: 700 }}>
              {record.targetPosPlatform || 'SAPO'}
            </Tag>
            <span style={{ fontFamily: 'JetBrains Mono', color: '#10B981', fontWeight: 600 }}>
              {record.targetMasterSku}
            </span>
          </Space>
          <div style={{ color: '#D1D5DB', fontSize: 13, marginTop: 4 }}>
            {record.targetProductName}
          </div>
        </div>
      ),
    },
    {
      title: 'Độ Tin Cậy AI (Hybrid Score)',
      dataIndex: 'confidenceScore',
      key: 'confidenceScore',
      width: 220,
      render: (confidence: number) => {
        const percent = Math.round((confidence || 0.9) * 100);
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
      render: (_: any, record: SKUMappingItem) => {
        if (record.mappingStatus === 'AUTO_APPROVED') {
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
            loading={approvingId === record._id}
            onClick={() => handleApprove(record._id)}
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
          <Space>
            <Input
              prefix={<SearchOutlined style={{ color: '#6B7280' }} />}
              placeholder="Tìm kiếm theo mã SKU hoặc tên SP..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280, background: '#0B0F19', borderColor: '#374151', color: '#F9FAFB' }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={loadMappings}
              style={{ borderColor: '#374151', color: '#9CA3AF' }}
            >
              Làm mới
            </Button>
          </Space>
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
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ background: 'transparent' }}
      />
    </Card>
  );
};
