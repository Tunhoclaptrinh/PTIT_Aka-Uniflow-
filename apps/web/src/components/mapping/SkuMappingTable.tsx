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

  // Batch Approve Modal state
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

  const handleBatchApproveAll = async () => {
    setBatchLoading(true);
    try {
      const pendingItems = data.filter((d) => d.mappingStatus === 'PENDING_REVIEW');
      for (const item of pendingItems) {
        await mappingService.approveMapping(item._id);
      }
      notify.success(`Đã tự động phê duyệt hàng loạt ${pendingItems.length} mã SKU thành công.`);
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
    }
  };

  const handleDeleteSingle = async (id: string) => {
    const success = await remove(id);
    if (success) {
      notify.success('Đã xóa thành công cấu hình ánh xạ SKU!');
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

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      notify.success('Đã xóa liên kết ánh xạ SKU thành công!');
      refresh();
    } catch (err: any) {
      notify.error('Lỗi khi xóa: ' + err.message);
    }
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

  const pendingCount = data.filter((d) => d.mappingStatus === 'PENDING_REVIEW').length;
  const approvedCount = data.filter((d) => d.mappingStatus === 'AUTO_APPROVED').length;
  const manualCount = data.filter((d) => d.mappingStatus === 'MANUAL_REQUIRED').length;
  const totalCount = total || data.length || 0;

  // Top Statistics Items (Pill style pastel colors with direct filter tabs)
  const statItems: StatisticsItem[] = [
    {
      title: 'Tổng SKU sàn TMĐT',
      value: totalCount,
      backgroundColor: '#FFF1F0',
      valueColor: '#cf1322',
      onClick: () => handleTabChange('ALL'),
    },
    {
      title: 'Đã đồng bộ Master SKU',
      value: approvedCount,
      backgroundColor: '#E6F7FF',
      valueColor: '#096dd9',
      onClick: () => handleTabChange('APPROVED'),
    },
    {
      title: 'Chờ duyệt 1-click (AI >= 90%)',
      value: pendingCount,
      backgroundColor: '#FFF7E6',
      valueColor: '#d46b08',
      onClick: () => handleTabChange('PENDING'),
    },
    {
      title: 'Cần ghép thủ công',
      value: manualCount,
      backgroundColor: '#FFF0F6',
      valueColor: '#c41d7f',
      onClick: () => handleTabChange('MANUAL'),
    },
  ];

  const mappingFilters: FilterConfig[] = [
    {
      key: 'sourcePlatform',
      label: 'Nền tảng sàn',
      type: 'select',
      options: [
        { label: 'TikTok Shop', value: 'TIKTOK_SHOP' },
        { label: 'Shopee', value: 'SHOPEE' },
        { label: 'Lazada', value: 'LAZADA' },
      ],
      operators: ['eq', 'ne', 'in'],
    },
    {
      key: 'targetPosPlatform',
      label: 'Phần mềm kho POS',
      type: 'select',
      options: [
        { label: 'Sapo', value: 'SAPO' },
        { label: 'KiotViet', value: 'KIOTVIET' },
      ],
      operators: ['eq', 'ne'],
    },
    {
      key: 'mappingStatus',
      label: 'Trạng thái đối soát',
      type: 'select',
      options: [
        { label: 'Tự động duyệt', value: 'AUTO_APPROVED' },
        { label: 'Chờ duyệt 1-click', value: 'PENDING_REVIEW' },
        { label: 'Cần ghép thủ công', value: 'MANUAL_REQUIRED' },
      ],
      operators: ['eq', 'ne'],
    },
    {
      key: 'sourceSkuCode',
      label: 'Mã SKU sàn',
      type: 'input',
      operators: ['eq', 'like'],
    },
    {
      key: 'targetMasterSku',
      label: 'Mã Master SKU kho',
      type: 'input',
      operators: ['eq', 'like'],
    },
  ];

  const getActionMenuItems = (record: SKUMappingItem): MenuProps['items'] => [
    {
      key: 'approve',
      icon: <CheckOutlined style={{ color: '#10B981' }} />,
      label: 'Duyệt liên kết 1-click',
      disabled: record.mappingStatus === 'AUTO_APPROVED',
      onClick: () => handleApprove(record._id),
    },
    {
      key: 'edit',
      icon: <EditOutlined style={{ color: '#1890ff' }} />,
      label: 'Ghép nối thủ công (Chỉnh sửa)',
      onClick: () => openEditModal(record),
    },
    {
      key: 'detail',
      icon: <EyeOutlined style={{ color: '#ed1c24' }} />,
      label: 'Giải thích thuật toán AI',
      onClick: () => openDetailModal(record),
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

  const columns = [
    {
      title: 'Sản phẩm sàn TMĐT (Nguồn)',
      key: 'source',
      sorter: (a: SKUMappingItem, b: SKUMappingItem) => a.sourceSkuCode.localeCompare(b.sourceSkuCode),
      filters: [
        { text: 'TikTok Shop', value: 'TIKTOK_SHOP' },
        { text: 'Shopee', value: 'SHOPEE' },
        { text: 'Lazada', value: 'LAZADA' },
      ],
      onFilter: (value: any, record: SKUMappingItem) => record.sourcePlatform === value,
      render: (_: any, record: SKUMappingItem) => (
        <div style={{ cursor: 'pointer' }} onClick={() => openDetailModal(record)}>
          <Space>
            <Tag
              color={
                record.sourcePlatform === 'TIKTOK_SHOP'
                  ? '#000000'
                  : record.sourcePlatform === 'SHOPEE'
                    ? '#EE4D2D'
                    : '#0F146D'
              }
              style={{
                borderRadius: 4,
                fontWeight: 700,
              }}
            >
              {record.sourcePlatform === 'TIKTOK_SHOP'
                ? 'TikTok Shop'
                : record.sourcePlatform === 'SHOPEE'
                  ? 'Shopee'
                  : 'Lazada'}
            </Tag>
            <span style={{ fontFamily: 'JetBrains Mono', color: '#ed1c24', fontWeight: 700 }}>
              {record.sourceSkuCode}
            </span>
          </Space>
          <div style={{ fontSize: 13, marginTop: 4, fontWeight: 600 }}>
            {record.sourceProductName}
          </div>
          {record.sourceVariationText && (
            <div style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
              Phân loại: {record.sourceVariationText}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'SKU kho POS đích (Master SKU)',
      key: 'target',
      sorter: (a: SKUMappingItem, b: SKUMappingItem) => a.targetMasterSku.localeCompare(b.targetMasterSku),
      filters: [
        { text: 'Sapo', value: 'SAPO' },
        { text: 'KiotViet', value: 'KIOTVIET' },
      ],
      onFilter: (value: any, record: SKUMappingItem) => (record.targetPosPlatform || 'SAPO').includes(value),
      render: (_: any, record: SKUMappingItem) => (
        <div style={{ cursor: 'pointer' }} onClick={() => openDetailModal(record)}>
          <Space>
            <Tag color="#10B981" style={{ borderRadius: 4, fontWeight: 700 }}>
              {record.targetPosPlatform || 'SAPO'}
            </Tag>
            <span style={{ fontFamily: 'JetBrains Mono', color: '#10B981', fontWeight: 700 }}>
              {record.targetMasterSku}
            </span>
          </Space>
          <div style={{ fontSize: 13, marginTop: 4, color: '#374151' }}>
            {record.targetProductName}
          </div>
        </div>
      ),
    },
    {
      title: 'Điểm tin cậy AI',
      dataIndex: 'confidenceScore',
      key: 'confidenceScore',
      width: 190,
      sorter: (a: SKUMappingItem, b: SKUMappingItem) => (a.confidenceScore || 0) - (b.confidenceScore || 0),
      render: (confidence: number) => {
        const percent = Math.round((confidence || 0.9) * 100);
        let strokeColor = '#10B981';
        if (percent < 95) strokeColor = '#fcc20f';
        if (percent < 70) strokeColor = '#EF4444';

        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#6B7280' }}>Vector Cosine + NER</span>
              <span style={{ fontWeight: 700, color: strokeColor }}>{percent}%</span>
            </div>
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor={strokeColor}
              trailColor="#E5E7EB"
              size="small"
            />
          </div>
        );
      },
    },
    {
      title: 'Trạng thái đối soát',
      key: 'mappingStatus',
      width: 150,
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
            <Tag color="#10B981" style={{ fontWeight: 600 }}>
              <CheckCircleFilled style={{ marginRight: 4 }} /> Tự động duyệt
            </Tag>
          );
        }
        if (record.mappingStatus === 'PENDING_REVIEW') {
          return (
            <Tag color="#fcc20f" style={{ fontWeight: 600, color: '#111827' }}>
              <ThunderboltFilled style={{ marginRight: 4 }} /> Chờ duyệt
            </Tag>
          );
        }
        return (
          <Tag color="#EF4444" style={{ fontWeight: 600 }}>
            <EditOutlined style={{ marginRight: 4 }} /> Cần ghép tay
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 130,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: SKUMappingItem) => {
        const isApproved = record.mappingStatus === 'AUTO_APPROVED';
        return (
          <Space size={2}>
            {/* 1. Fixed Position: Approve 1-Click */}
            <IconButton
              icon={<CheckOutlined />}
              tooltip={isApproved ? 'Đã được phê duyệt tự động' : 'Phê duyệt nhanh 1-Click'}
              success={!isApproved}
              disabled={isApproved}
              onClick={() => handleApprove(record._id)}
            />

            {/* 2. Fixed Position: Manual Edit */}
            <IconButton
              icon={<EditOutlined />}
              tooltip="Ghép nối thủ công"
              color="#fcc20f"
              hoverColor="#d49e07"
              onClick={() => openEditModal(record)}
            />

            {/* 3. Fixed Position: Delete Mapping */}
            <IconButton
              icon={<DeleteOutlined />}
              tooltip="Xóa liên kết ánh xạ"
              danger
              onClick={() => handleDelete(record._id)}
            />

            {/* 4. Fixed Position: Menu Dropdown */}
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

  return (
    <PageContainer
      title="Ánh xạ SKU"
      tooltip="Bảng đối chiếu danh mục sản phẩm từ các Sàn TMĐT về mã Master SKU trong kho POS nội bộ"
    >
      <DataTable<SKUMappingItem>
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        statisticsData={statItems}
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

            <BaseButton
              variant="secondary"
              size="small"
              icon={<ExperimentOutlined style={{ color: '#8B5CF6' }} />}
              onClick={() => setAiPlaygroundOpen(true)}
            >
              Phòng thí nghiệm AI
            </BaseButton>

            {pendingCount > 0 && (
              <BaseButton
                variant="secondary"
                size="small"
                icon={<ThunderboltFilled style={{ color: '#F59E0B' }} />}
                onClick={() => setBatchModalOpen(true)}
              >
                Phê duyệt tất cả ({pendingCount})
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
            key: 'delete',
            label: 'Xóa các mục đã chọn',
            danger: true,
            confirm: {
              title: 'Xác nhận xóa hàng loạt',
              content: 'Bạn có chắc chắn muốn xóa tất cả các cấu hình ánh xạ đã chọn không?',
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

      {/* Batch Approve Confirm Modal */}
      <ConfirmModal
        open={batchModalOpen}
        title="Xác nhận phê duyệt hàng loạt"
        content={`Bạn có chắc chắn muốn phê duyệt tự động tất cả ${pendingCount} mã SKU đang ở trạng thái Chờ duyệt (Điểm tin cậy AI >= 90%) không?`}
        confirmText="Xác nhận duyệt"
        loading={batchLoading}
        onConfirm={handleBatchApproveAll}
        onCancel={() => setBatchModalOpen(false)}
      />
    </PageContainer>
  );
};

export default SkuMappingTable;
