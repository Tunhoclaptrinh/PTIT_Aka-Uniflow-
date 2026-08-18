import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Input, Progress, message, Tabs } from 'antd';
import {
  CheckOutlined,
  SearchOutlined,
  ThunderboltFilled,
  ReloadOutlined,
  EyeOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { mappingService, SKUMappingItem } from '../../services/mapping.service';
import { SkuDetailModal } from './SkuDetailModal';

export const SkuMappingTable: React.FC = () => {
  const [data, setData] = useState<SKUMappingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SKUMappingItem | null>(null);

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

  const openDetailModal = (item: SKUMappingItem) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const filteredData = data
    .filter((item) => {
      if (activeTab === 'PENDING') return item.mappingStatus === 'PENDING_REVIEW';
      if (activeTab === 'APPROVED') return item.mappingStatus === 'AUTO_APPROVED';
      if (activeTab === 'MANUAL') return item.mappingStatus === 'MANUAL_REQUIRED';
      return true;
    })
    .filter(
      (item) =>
        item.sourceSkuCode?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.sourceProductName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.targetMasterSku?.toLowerCase().includes(searchText.toLowerCase())
    );

  const pendingCount = data.filter((d) => d.mappingStatus === 'PENDING_REVIEW').length;
  const approvedCount = data.filter((d) => d.mappingStatus === 'AUTO_APPROVED').length;
  const manualCount = data.filter((d) => d.mappingStatus === 'MANUAL_REQUIRED').length;

  const columns = [
    {
      title: 'Sản phẩm Sàn TMĐT (Nguồn)',
      key: 'source',
      render: (_: any, record: SKUMappingItem) => (
        <div>
          <Space>
            <Tag
              color={record.sourcePlatform === 'TIKTOK_SHOP' ? '#000000' : record.sourcePlatform === 'SHOPEE' ? '#EE4D2D' : '#0F146D'}
              style={{
                borderRadius: 4,
                fontWeight: 700,
                border: record.sourcePlatform === 'TIKTOK_SHOP' ? '1px solid #374151' : 'none',
              }}
            >
              {record.sourcePlatform === 'TIKTOK_SHOP' ? 'TikTok Shop' : record.sourcePlatform === 'SHOPEE' ? 'Shopee' : 'Lazada'}
            </Tag>
            <span style={{ fontFamily: 'JetBrains Mono', color: '#fcc20f', fontWeight: 600 }}>
              {record.sourceSkuCode}
            </span>
          </Space>
          <div style={{ color: '#F9FAFB', fontSize: 13, marginTop: 4, fontWeight: 500 }}>
            {record.sourceProductName}
          </div>
          {record.sourceVariationText && (
            <div style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
              Phân loại: {record.sourceVariationText}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'SKU Kho POS Đích (Master SKU)',
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
      title: 'Điểm Tin Cậy AI (Hybrid Score)',
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
      title: 'Thao Tác',
      key: 'action',
      width: 220,
      render: (_: any, record: SKUMappingItem) => {
        const isApproved = record.mappingStatus === 'AUTO_APPROVED';
        const isManual = record.mappingStatus === 'MANUAL_REQUIRED';

        return (
          <Space>
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => openDetailModal(record)}
              style={{ background: 'rgba(255, 255, 255, 0.04)', borderColor: '#374151', color: '#D1D5DB' }}
            >
              Giải Thích AI
            </Button>

            {isApproved ? (
              <Tag color="#10B981" style={{ borderRadius: 6, fontWeight: 600, padding: '4px 8px' }}>
                <CheckOutlined /> Đã Duyệt
              </Tag>
            ) : isManual ? (
              <Button
                size="small"
                danger
                onClick={() => message.info('Mở modal ghép thủ công')}
                style={{ fontWeight: 600, borderRadius: 6 }}
              >
                Ghép Thủ Công
              </Button>
            ) : (
              <Button
                type="primary"
                size="small"
                icon={<ThunderboltFilled />}
                loading={approvingId === record._id}
                onClick={() => handleApprove(record._id)}
                style={{
                  background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
                  border: 'none',
                  fontWeight: 700,
                  borderRadius: 6,
                }}
              >
                Duyệt 1-Click
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Space>
            <ThunderboltFilled style={{ color: '#8B5CF6', fontSize: 20 }} />
            <span style={{ color: '#F9FAFB', fontWeight: 800, fontSize: 18 }}>
              Bảng Ánh Xạ SKU Thông Minh (AI SKU Auto-Mapping Hub)
            </span>
          </Space>
          <Space>
            <Input
              prefix={<SearchOutlined style={{ color: '#6B7280' }} />}
              placeholder="Tìm kiếm theo mã SKU, tên SP..."
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
      {/* Category Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'ALL',
            label: <span>Tất Cả ({data.length})</span>,
          },
          {
            key: 'PENDING',
            label: (
              <span>
                <ClockCircleFilled style={{ color: '#fcc20f' }} /> Chờ Duyệt 1-Click ({pendingCount})
              </span>
            ),
          },
          {
            key: 'APPROVED',
            label: (
              <span>
                <CheckCircleFilled style={{ color: '#10B981' }} /> Đã Đồng Bộ ({approvedCount})
              </span>
            ),
          },
          {
            key: 'MANUAL',
            label: (
              <span>
                <ExclamationCircleFilled style={{ color: '#EF4444' }} /> Cần Ghép Thủ Công ({manualCount})
              </span>
            ),
          },
        ]}
        style={{ marginBottom: 16 }}
      />

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        style={{ background: 'transparent' }}
      />

      {/* AI Explanation Modal */}
      <SkuDetailModal
        open={detailModalOpen}
        item={selectedItem}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedItem(null);
        }}
        onApprove={handleApprove}
      />
    </Card>
  );
};
