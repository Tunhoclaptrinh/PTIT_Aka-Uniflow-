import React, { useState } from 'react';
import { Tag, Space, Progress, Dropdown, MenuProps } from 'antd';
import {
  EyeOutlined,
  MenuOutlined,
  CheckOutlined,
  EditOutlined,
  DeleteOutlined,
  ThunderboltFilled,
  ExperimentOutlined,
  PlusOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { mappingService, SKUMappingItem } from '../../services/mapping.service';
import { SkuDetailModal } from './SkuDetailModal';
import { SkuFormModal } from './SkuFormModal';
import { SkuAiPlaygroundModal } from './SkuAiPlaygroundModal';
import {
  DataTable,
  ConfirmModal,
  BaseButton,
  IconButton,
  PageContainer,
  StatisticsItem,
  FilterConfig,
} from '../base';
import { useCRUD } from '../../hooks';
import { notify } from '../../utils/notification';

export const SkuMappingTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  // useCRUD Hook kết nối 100% với MongoDB Atlas API
  const {
    data,
    loading,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    updateFilter,
    create,
    update,
    remove,
    batchDelete,
    refresh,
  } = useCRUD<SKUMappingItem>(mappingService, {
    autoFetch: true,
    initialPageSize: 10,
  });

  // Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SKUMappingItem | null>(null);

  // Form Modal (Add / Edit) state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<SKUMappingItem> | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Batch Modals state
  const [batchApproveModalOpen, setBatchApproveModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);

  // AI Matching Playground Modal state
  const [aiPlaygroundOpen, setAiPlaygroundOpen] = useState(false);

  const handleApprove = async (id: string) => {
    try {
      await mappingService.approveMapping(id);
      notify.success('Đã xác nhận liên kết SKU thành công vào MongoDB Atlas!');
      refresh();
    } catch (err: any) {
      notify.error('Lỗi khi phê duyệt SKU: ' + err.message);
    }
  };

  // Phê duyệt các hàng đã được chọn (tích chọn)
  const handleBatchApproveSelected = async () => {
    if (selectedRowKeys.length === 0) return;
    setBatchLoading(true);
    try {
      await mappingService.bulkApprove(selectedRowKeys);
      notify.success(`Đã phê duyệt thành công ${selectedRowKeys.length} mã SKU đã chọn vào Database!`);
      setSelectedRowKeys([]);
      setBatchApproveModalOpen(false);
      refresh();
    } catch (err: any) {
      notify.error('Lỗi khi phê duyệt hàng loạt: ' + err.message);
    } finally {
      setBatchLoading(false);
    }
  };

  // Phê duyệt tất cả các mục chờ duyệt
  const handleBatchApproveAll = async () => {
    setBatchLoading(true);
    try {
      const pendingIds = data
        .filter((d) => d.mappingStatus === 'PENDING_REVIEW')
        .map((d) => d._id);

      if (pendingIds.length > 0) {
        await mappingService.bulkApprove(pendingIds);
      }
      notify.success(`Đã tự động phê duyệt hàng loạt ${pendingIds.length} mã SKU thành công.`);
      setBatchModalOpen(false);
      refresh();
    } catch (err: any) {
      notify.error('Lỗi khi phê duyệt hàng loạt: ' + err.message);
    } finally {
      setBatchLoading(false);
    }
  };

  const handleBatchDelete = async (keys: any[]) => {
    const success = await batchDelete(keys);
    if (success) {
      notify.success(`Đã xóa thành công ${keys.length} cấu hình ánh xạ SKU từ MongoDB Atlas!`);
      setSelectedRowKeys([]);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    const success = await remove(id);
    if (success) {
      notify.success('Đã xóa thành công cấu hình ánh xạ SKU!');
      setSelectedRowKeys((prev) => prev.filter((k) => k !== id));
      refresh();
    }
  };

  const handleFormSubmit = async (values: any) => {
    setFormLoading(true);
    try {
      if (editingItem?._id) {
        await update(editingItem._id, values);
        notify.success('Cập nhật cấu hình ánh xạ SKU thành công vào MongoDB!');
      } else {
        await create({
          ...values,
          tenantId: '66c0e812a1b2c3d4e5f60001',
        });
        notify.success('Thêm mới cấu hình ánh xạ SKU thành công vào MongoDB!');
      }
      setFormModalOpen(false);
      setEditingItem(null);
      refresh();
    } catch (err: any) {
      notify.error('Lỗi khi lưu dữ liệu: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSavePlaygroundMapping = async (mappingData: any) => {
    try {
      await create({
        ...mappingData,
        tenantId: '66c0e812a1b2c3d4e5f60001',
      });
      notify.success('Đã lưu cấu hình AI so khớp vào Database thành công!');
      refresh();
    } catch (err: any) {
      notify.error('Lỗi khi lưu kết quả so khớp: ' + err.message);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormModalOpen(true);
  };

  const openEditModal = (item: SKUMappingItem) => {
    setEditingItem(item);
    setFormModalOpen(true);
  };

  const openDetailModal = (item: SKUMappingItem) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'ALL') {
      updateFilter('mappingStatus', undefined);
    } else if (key === 'PENDING') {
      updateFilter('mappingStatus', 'PENDING_REVIEW');
    } else if (key === 'APPROVED') {
      updateFilter('mappingStatus', 'AUTO_APPROVED');
    } else if (key === 'MANUAL') {
      updateFilter('mappingStatus', 'MANUAL_REQUIRED');
    }
  };

  // KPI Header Stats
  const approvedCount = data.filter((d) => d.mappingStatus === 'AUTO_APPROVED').length;
  const pendingCount = data.filter((d) => d.mappingStatus === 'PENDING_REVIEW').length;
  const manualCount = data.filter((d) => d.mappingStatus === 'MANUAL_REQUIRED').length;
  const totalCount = total || data.length || 0;

  // Top Statistics Items (Pill style pastel colors with direct filter tabs)
  const statItems: StatisticsItem[] = [
    {
      title: 'Tổng SKU sàn TMĐT',
      value: totalCount,
      backgroundColor: '#F8FAFC',
      valueColor: '#1E293B',
      onClick: () => handleTabChange('ALL'),
    },
    {
      title: 'Đã khớp tự động (AI)',
      value: approvedCount,
      backgroundColor: '#ECFDF5',
      valueColor: '#059669',
      onClick: () => handleTabChange('APPROVED'),
    },
    {
      title: 'Chờ duyệt 1-click',
      value: pendingCount,
      backgroundColor: '#FFFBEB',
      valueColor: '#D97706',
      onClick: () => handleTabChange('PENDING'),
    },
    {
      title: 'Cần gán thủ công',
      value: manualCount,
      backgroundColor: '#FEF2F2',
      valueColor: '#DC2626',
      onClick: () => handleTabChange('MANUAL'),
    },
  ];

  // Filters for Search and Selection
  const mappingFilters: FilterConfig[] = [
    {
      key: 'sourcePlatform',
      label: 'Sàn thương mại',
      type: 'select',
      options: [
        { label: 'TikTok Shop', value: 'TIKTOK_SHOP' },
        { label: 'Shopee', value: 'SHOPEE' },
        { label: 'Lazada', value: 'LAZADA' },
      ],
    },
    {
      key: 'targetPosPlatform',
      label: 'Kho POS đích',
      type: 'select',
      options: [
        { label: 'Sapo POS', value: 'SAPO' },
        { label: 'KiotViet', value: 'KIOTVIET' },
      ],
    },
  ];

  // Menu tùy chọn gom gọn các thao tác còn lại (Chi tiết, Sửa, Xóa)
  const getActionMenuItems = (record: SKUMappingItem): MenuProps['items'] => [
    {
      key: 'detail',
      icon: <EyeOutlined style={{ color: '#8B5CF6' }} />,
      label: 'Giải thích & Phân tích AI',
      onClick: () => openDetailModal(record),
    },
    {
      key: 'edit',
      icon: <EditOutlined style={{ color: '#2563EB' }} />,
      label: 'Ghép nối thủ công (Chỉnh sửa)',
      onClick: () => openEditModal(record),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined style={{ color: '#EF4444' }} />,
      label: 'Xóa ánh xạ này',
      danger: true,
      onClick: () => handleDeleteSingle(record._id),
    },
  ];

  // Bảng dữ liệu cột
  const columns = [
    {
      title: 'Mã SKU sàn TMĐT',
      key: 'sourceSkuCode',
      sorter: (a: SKUMappingItem, b: SKUMappingItem) => a.sourceSkuCode.localeCompare(b.sourceSkuCode),
      filters: [
        { text: 'TikTok Shop', value: 'TIKTOK_SHOP' },
        { text: 'Shopee', value: 'SHOPEE' },
        { text: 'Lazada', value: 'LAZADA' },
      ],
      onFilter: (value: any, record: SKUMappingItem) => record.sourcePlatform === value,
      render: (_: any, record: SKUMappingItem) => {
        const isTikTok = record.sourcePlatform === 'TIKTOK_SHOP';
        const isShopee = record.sourcePlatform === 'SHOPEE';
        return (
          <div style={{ cursor: 'pointer' }} onClick={() => openDetailModal(record)}>
            <Space size={6}>
              <Tag
                style={{
                  borderRadius: 4,
                  fontWeight: 600,
                  fontSize: 11,
                  padding: '1px 6px',
                  background: isTikTok ? '#F8FAFC' : isShopee ? '#FFF7ED' : '#EEF2FF',
                  border: `1px solid ${isTikTok ? '#CBD5E1' : isShopee ? '#FFEDD5' : '#E0E7FF'}`,
                  color: isTikTok ? '#0F172A' : isShopee ? '#EA580C' : '#4338CA',
                }}
              >
                {isTikTok ? 'TikTok Shop' : isShopee ? 'Shopee' : 'Lazada'}
              </Tag>
              <span style={{ fontFamily: 'JetBrains Mono', color: '#DC2626', fontWeight: 700, fontSize: 12.5 }}>
                {record.sourceSkuCode}
              </span>
            </Space>
            <div style={{ fontSize: 13, marginTop: 4, fontWeight: 600, color: '#1E293B' }}>
              {record.sourceProductName}
            </div>
            {record.sourceVariationText && (
              <div style={{ color: '#64748B', fontSize: 11, marginTop: 2 }}>
                Phân loại: {record.sourceVariationText}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'SKU kho POS đích (Master SKU)',
      key: 'targetMasterSku',
      sorter: (a: SKUMappingItem, b: SKUMappingItem) => a.targetMasterSku.localeCompare(b.targetMasterSku),
      filters: [
        { text: 'Sapo POS', value: 'SAPO' },
        { text: 'KiotViet', value: 'KIOTVIET' },
      ],
      onFilter: (value: any, record: SKUMappingItem) => (record.targetPosPlatform || 'SAPO').includes(value),
      render: (_: any, record: SKUMappingItem) => {
        const isSapo = (record.targetPosPlatform || 'SAPO').toUpperCase().includes('SAPO');
        return (
          <div style={{ cursor: 'pointer' }} onClick={() => openDetailModal(record)}>
            <Space size={6}>
              <Tag
                style={{
                  borderRadius: 4,
                  fontWeight: 600,
                  fontSize: 11,
                  padding: '1px 6px',
                  background: isSapo ? '#EFF6FF' : '#F0FDF4',
                  border: `1px solid ${isSapo ? '#DBEAFE' : '#DCFCE7'}`,
                  color: isSapo ? '#2563EB' : '#16A34A',
                }}
              >
                {record.targetPosPlatform || 'SAPO'}
              </Tag>
              <span style={{ fontFamily: 'JetBrains Mono', color: '#059669', fontWeight: 700, fontSize: 12.5 }}>
                {record.targetMasterSku}
              </span>
            </Space>
            <div style={{ fontSize: 13, marginTop: 4, color: '#334155' }}>
              {record.targetProductName}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Điểm tin cậy AI',
      key: 'confidenceScore',
      width: 180,
      sorter: (a: SKUMappingItem, b: SKUMappingItem) => (a.confidenceScore || 0) - (b.confidenceScore || 0),
      render: (confidence: number) => {
        const percent = Math.round((confidence || 0.9) * 100);
        let strokeColor = '#10B981';
        if (percent < 95) strokeColor = '#F59E0B';
        if (percent < 70) strokeColor = '#EF4444';

        return (
          <div style={{ width: '100%', maxWidth: 150 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>Vector Cosine + NER</span>
              <span style={{ fontWeight: 700, color: strokeColor, fontSize: 12 }}>{percent}%</span>
            </div>
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor={strokeColor}
              trailColor="#E2E8F0"
              size="small"
            />
          </div>
        );
      },
    },
    {
      title: 'Trạng thái đối soát',
      key: 'mappingStatus',
      width: 160,
      sorter: (a: SKUMappingItem, b: SKUMappingItem) => a.mappingStatus.localeCompare(b.mappingStatus),
      filters: [
        { text: 'Tự động duyệt', value: 'AUTO_APPROVED' },
        { text: 'Chờ duyệt 1-click', value: 'PENDING_REVIEW' },
        { text: 'Cần ghép thủ công', value: 'MANUAL_REQUIRED' },
      ],
      onFilter: (value: any, record: SKUMappingItem) => record.mappingStatus === value,
      render: (_: any, record: SKUMappingItem) => {
        if (record.mappingStatus === 'AUTO_APPROVED') {
          return (
            <Tag
              style={{
                borderRadius: 4,
                fontWeight: 600,
                fontSize: 12,
                padding: '1px 8px',
                background: '#F0FDF4',
                border: '1px solid #86EFAC',
                color: '#15803D',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <CheckCircleFilled style={{ color: '#16A34A', fontSize: 12 }} />
              <span>Tự động duyệt</span>
            </Tag>
          );
        }
        if (record.mappingStatus === 'PENDING_REVIEW') {
          return (
            <Tag
              style={{
                borderRadius: 4,
                fontWeight: 600,
                fontSize: 12,
                padding: '1px 8px',
                background: '#FFFBEB',
                border: '1px solid #FCD34D',
                color: '#B45309',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <ThunderboltFilled style={{ color: '#D97706', fontSize: 12 }} />
              <span>Chờ duyệt</span>
            </Tag>
          );
        }
        return (
          <Tag
            style={{
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 12,
              padding: '1px 8px',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <EditOutlined style={{ color: '#DC2626', fontSize: 12 }} />
            <span>Cần ghép tay</span>
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: SKUMappingItem) => {
        const isApproved = record.mappingStatus === 'AUTO_APPROVED';
        return (
          <Space size={4}>
            {/* 1. Nút Duyệt 1-Click icon duy nhất */}
            <IconButton
              icon={<CheckOutlined />}
              tooltip={isApproved ? 'Đã được duyệt tự động' : 'Phê duyệt nhanh 1-Click'}
              success={!isApproved}
              disabled={isApproved}
              onClick={() => handleApprove(record._id)}
            />

            {/* 2. Menu gom gọn toàn bộ các thao tác còn lại (Chi tiết, Sửa, Xóa) */}
            <Dropdown menu={{ items: getActionMenuItems(record) }} trigger={['click']} placement="bottomRight">
              <span>
                <IconButton
                  icon={<MenuOutlined />}
                  tooltip="Tùy chọn khác"
                />
              </span>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const hasItemsToApprove = selectedRowKeys.length > 0 || pendingCount > 0;

  return (
    <PageContainer
      title="Ánh xạ SKU"
      tooltip="Bảng đối chiếu danh mục sản phẩm từ các Sàn TMĐT về mã Master SKU trong kho POS nội bộ"
      extra={
        <IconButton
          icon={<ExperimentOutlined style={{ color: '#8B5CF6' }} />}
          tooltip="Phòng thí nghiệm AI so khớp SKU (Gemini + Qdrant)"
          onClick={() => setAiPlaygroundOpen(true)}
          size="small"
        />
      }
    >
      <DataTable<SKUMappingItem>
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        statisticsData={statItems}
        batchOperations={true}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={(keys) => setSelectedRowKeys(keys)}
        extra={
          <Space size="small">
            <BaseButton
              variant="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={openAddModal}
            >
              Thêm mới
            </BaseButton>

            {/* Nút Phê duyệt: Outline xanh lá, icon dấu tích, tự đổi số theo mục chọn */}
            {hasItemsToApprove && (
              <BaseButton
                variant="secondary"
                size="small"
                icon={<CheckOutlined style={{ color: '#10B981' }} />}
                style={{
                  borderColor: '#10B981',
                  color: '#10B981',
                  background: '#F0FDF4',
                  fontWeight: 600,
                }}
                loading={batchLoading}
                onClick={() => {
                  if (selectedRowKeys.length > 0) {
                    setBatchApproveModalOpen(true);
                  } else {
                    setBatchModalOpen(true);
                  }
                }}
              >
                {selectedRowKeys.length > 0
                  ? `Phê duyệt đã chọn (${selectedRowKeys.length})`
                  : `Phê duyệt tất cả (${pendingCount})`}
              </BaseButton>
            )}
          </Space>
        }
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p: number, ps: number) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
        batchActions={[
          {
            key: 'batch-approve',
            icon: <CheckCircleFilled style={{ color: '#10B981' }} />,
            label: `Phê duyệt ${selectedRowKeys.length} mục đã chọn`,
            onClick: () => setBatchApproveModalOpen(true),
          },
          {
            key: 'batch-delete',
            icon: <DeleteOutlined style={{ color: '#EF4444' }} />,
            label: `Xóa ${selectedRowKeys.length} mục đã chọn`,
            danger: true,
            confirm: {
              title: 'Xác nhận xóa hàng loạt',
              content: `Bạn có chắc chắn muốn xóa tất cả ${selectedRowKeys.length} cấu hình ánh xạ đã chọn không?`,
            },
            onClick: handleBatchDelete,
          },
        ]}
        creatable={false}
        importable={false}
        exportable={false}
        onRefresh={refresh}
        searchPlaceholder="Tìm theo mã SKU sàn hoặc Master SKU..."
        onSearch={(val: string) => updateFilter('search', val)}
        filters={mappingFilters}
        onFilterChange={(key: string, val: any) => updateFilter(key, val)}
        onClearFilters={() => refresh()}
        tabs={[
          { key: 'ALL', label: 'Tất cả' },
          { key: 'APPROVED', label: 'Đã đồng bộ' },
          { key: 'PENDING', label: 'Chờ duyệt 1-click' },
          { key: 'MANUAL', label: 'Cần ghép tay' },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Sku Detail Modal */}
      <SkuDetailModal
        open={detailModalOpen}
        item={selectedItem}
        onClose={() => setDetailModalOpen(false)}
        onApprove={(id) => {
          handleApprove(id);
          setDetailModalOpen(false);
        }}
      />

      {/* Sku Add / Edit Form Modal */}
      <SkuFormModal
        open={formModalOpen}
        initialValues={editingItem}
        loading={formLoading}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* AI Playground Modal */}
      <SkuAiPlaygroundModal
        open={aiPlaygroundOpen}
        onClose={() => setAiPlaygroundOpen(false)}
        onSaveToMappings={handleSavePlaygroundMapping}
      />

      {/* Batch Approve Selected Rows Modal */}
      <ConfirmModal
        open={batchApproveModalOpen}
        title="Xác nhận phê duyệt hàng loạt"
        content={`Bạn có chắc chắn muốn phê duyệt liên kết cho ${selectedRowKeys.length} mã SKU đã được chọn vào MongoDB Atlas không?`}
        confirmText={`Phê duyệt ${selectedRowKeys.length} mục`}
        cancelText="Hủy bỏ"
        loading={batchLoading}
        onConfirm={handleBatchApproveSelected}
        onCancel={() => setBatchApproveModalOpen(false)}
      />

      {/* Batch Approve All Pending Modal */}
      <ConfirmModal
        open={batchModalOpen}
        title="Xác nhận phê duyệt tất cả"
        content={`Bạn có chắc chắn muốn phê duyệt tự động tất cả ${pendingCount} mã SKU đang ở trạng thái Chờ duyệt (Điểm tin cậy AI >= 90%) không?`}
        confirmText="Xác nhận duyệt"
        cancelText="Hủy bỏ"
        loading={batchLoading}
        onConfirm={handleBatchApproveAll}
        onCancel={() => setBatchModalOpen(false)}
      />
    </PageContainer>
  );
};

export default SkuMappingTable;
