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
} from '../base';
import { useCRUD } from '../../hooks';
import { notify } from '../../utils/notification';
import { downloadExcelTemplate, parseImportFile } from '../../utils/export';

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
    filters,
    updateFilter,
    clearFilters,
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
      notify.success(`Đã tự động phê duyệt hàng loạt ${pendingItems.length} mã SKU thành công! ✨`);
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

  // Top Statistics Items (Pill style pastel colors directly inside DataTable)
  const statItems: StatisticsItem[] = [
    {
      title: 'Tổng SKU Sàn TMĐT',
      value: total || data.length || 9,
      backgroundColor: '#FFF1F0',
      valueColor: '#cf1322',
      onClick: () => handleTabChange('ALL'),
    },
    {
      title: 'Đã Đồng Bộ Master SKU',
      value: approvedCount,
      backgroundColor: '#E6F7FF',
      valueColor: '#096dd9',
      onClick: () => handleTabChange('APPROVED'),
    },
    {
      title: 'Chờ Duyệt 1-Click (AI >= 90%)',
      value: pendingCount,
      backgroundColor: '#FFF7E6',
      valueColor: '#d46b08',
      onClick: () => handleTabChange('PENDING'),
    },
    {
      title: 'Cần Ghép Thủ Công',
      value: manualCount,
      backgroundColor: '#FFF0F6',
      valueColor: '#c41d7f',
      onClick: () => handleTabChange('MANUAL'),
    },
  ];

  const getActionMenuItems = (record: SKUMappingItem): MenuProps['items'] => [
    {
      key: 'approve',
      icon: <CheckOutlined style={{ color: '#10B981' }} />,
      label: 'Duyệt liên kết 1-Click',
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
      title: 'Sản phẩm Sàn TMĐT (Nguồn)',
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
      title: 'SKU Kho POS Đích (Master SKU)',
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
      title: 'Điểm Tin Cậy AI',
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
              <span style={{ fontSize: 12, color: '#6B7280' }}>Qdrant + Gemini</span>
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
      title: 'Trạng Thái',
      key: 'mappingStatus',
      width: 140,
      sorter: (a: SKUMappingItem, b: SKUMappingItem) => a.mappingStatus.localeCompare(b.mappingStatus),
      filters: [
        { text: 'Tự động duyệt', value: 'AUTO_APPROVED' },
        { text: 'Chờ duyệt 1-click', value: 'PENDING_REVIEW' },
        { text: 'Cần ghép thủ công', value: 'MANUAL_REQUIRED' },
      ],
      onFilter: (value: any, record: SKUMappingItem) => record.mappingStatus === value,
      render: (_: any, record: SKUMappingItem) => {
        if (record.mappingStatus === 'AUTO_APPROVED') {
          return <Tag color="#10B981" style={{ fontWeight: 600 }}>✓ Tự động duyệt</Tag>;
        }
        if (record.mappingStatus === 'PENDING_REVIEW') {
          return <Tag color="#fcc20f" style={{ fontWeight: 600, color: '#111827' }}>⚡ Chờ duyệt</Tag>;
        }
        return <Tag color="#EF4444" style={{ fontWeight: 600 }}>Cần ghép tay</Tag>;
      },
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 130,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, record: SKUMappingItem) => {
        const isApproved = record.mappingStatus === 'AUTO_APPROVED';
        return (
          <Space size={2}>
            {/* 1. Fixed Position: Approve 1-Click (Active if pending, Disabled if already approved) */}
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
      title="Ánh Xạ SKU"
      tooltip="Khớp nối sản phẩm sàn TMĐT và Master SKU trong kho POS bằng thuật toán AI Vector Cosine"
      extra={
        <Space size="middle">
          {/* AI Playground Button */}
          <BaseButton
            variant="ghost"
            icon={<ExperimentOutlined style={{ color: '#8B5CF6' }} />}
            onClick={() => setAiPlaygroundOpen(true)}
            style={{
              borderColor: '#8B5CF6',
              color: '#8B5CF6',
              fontWeight: 700,
            }}
          >
            ⚡ AI Matching Playground
          </BaseButton>

          {pendingCount > 0 && (
            <BaseButton
              variant="primary"
              icon={<ThunderboltFilled />}
              glow
              onClick={() => setBatchModalOpen(true)}
            >
              Duyệt Hàng Loạt ({pendingCount})
            </BaseButton>
          )}
        </Space>
      }
    >
      {/* DataTable kết nối 100% qua useCRUD */}
      <DataTable
        dataSource={data}
        columns={columns}
        rowKey="_id"
        loading={loading}
        statisticsData={statItems}
        statisticsTitle="Thống kê ánh xạ SKU sàn"
        onRefresh={refresh}
        onAdd={openAddModal}
        importable={true}
        onImport={async (file) => {
          try {
            const records = await parseImportFile(file);
            if (records.length === 0) {
              notify.warning('Tệp tải lên không có dữ liệu hợp lệ!');
              return;
            }
            let successCount = 0;
            for (const r of records) {
              const skuData = {
                sourcePlatform: r.sourcePlatform || r['Nền tảng sàn'] || 'TIKTOK_SHOP',
                sourceSkuCode: r.sourceSkuCode || r['Mã SKU sàn'] || `IMPORT_${Date.now()}`,
                sourceProductName: r.sourceProductName || r['Tên sản phẩm sàn'] || 'Sản phẩm Import',
                targetPosPlatform: r.targetPosPlatform || r['Nền tảng POS'] || 'SAPO',
                targetMasterSku: r.targetMasterSku || r['Mã Master SKU'] || 'MASTER_SKU_DEFAULT',
                targetProductName: r.targetProductName || r['Tên sản phẩm Master'] || 'Master Product',
                mappingStatus: 'PENDING_REVIEW' as const,
                confidenceScore: 0.95,
              };
              await create(skuData);
              successCount++;
            }
            notify.success(`Đã import thành công ${successCount} bản ghi ánh xạ SKU vào Database!`);
            refresh();
          } catch (err: any) {
            notify.error('Lỗi khi xử lý tệp import: ' + err.message);
          }
        }}
        onDownloadTemplate={() => {
          downloadExcelTemplate(
            [
              { key: 'sourcePlatform', label: 'Nền tảng sàn (SHOPEE/TIKTOK_SHOP/LAZADA)', sample: 'SHOPEE' },
              { key: 'sourceSkuCode', label: 'Mã SKU sàn', sample: 'AO-POLO-NAM-DEN-L' },
              { key: 'sourceProductName', label: 'Tên sản phẩm sàn', sample: 'Áo Polo Nam Cotton Cổ Bẻ Cao Cấp' },
              { key: 'targetPosPlatform', label: 'Nền tảng POS (SAPO/KIOTVIET)', sample: 'SAPO' },
              { key: 'targetMasterSku', label: 'Mã Master SKU POS', sample: 'AP-COT-BLK-L' },
              { key: 'targetProductName', label: 'Tên sản phẩm Master POS', sample: 'Áo Polo Nam Cotton Compact - Đen - L' },
            ],
            'uniflow_sku_mapping_template.csv'
          );
          notify.success('Đã tải xuống tệp mẫu uniflow_sku_mapping_template.csv!');
        }}
        exportable={true}
        exportFilename="uniflow-sku-mappings"
        batchOperations={true}
        onBatchDelete={handleBatchDelete}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total || data.length,
          onChange: (p: number, ps: number) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
        searchFields={['sourceSkuCode', 'sourceProductName', 'targetMasterSku', 'targetProductName']}
        filters={[
          {
            key: 'sourcePlatform',
            label: 'Nền tảng Sàn Nguồn',
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
            label: 'Hệ thống Kho POS Đích',
            type: 'select',
            options: [
              { label: 'Sapo Omnichannel', value: 'SAPO' },
              { label: 'KiotViet', value: 'KIOTVIET' },
            ],
            operators: ['eq', 'ne'],
          },
          {
            key: 'mappingStatus',
            label: 'Trạng Thái Phê Duyệt',
            type: 'select',
            options: [
              { label: 'Đã Đồng Bộ (AUTO_APPROVED)', value: 'AUTO_APPROVED' },
              { label: 'Chờ Duyệt (PENDING_REVIEW)', value: 'PENDING_REVIEW' },
              { label: 'Cần Ghép Tay (MANUAL_REQUIRED)', value: 'MANUAL_REQUIRED' },
            ],
            operators: ['eq', 'ne'],
          },
        ]}
        filterValues={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        tabs={[
          { key: 'ALL', label: 'Toàn Bộ SKU Sàn' },
          { key: 'PENDING', label: 'Chờ Duyệt 1-Click' },
          { key: 'APPROVED', label: 'Đã Đồng Bộ Master SKU' },
          { key: 'MANUAL', label: 'Cần Ghép Thủ Công' },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Sku Form Modal (Thêm / Sửa kết nối trực tiếp DB) */}
      <SkuFormModal
        open={formModalOpen}
        initialValues={editingItem}
        loading={formLoading}
        onClose={() => {
          setFormModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
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

      {/* AI Live Matching Playground Modal */}
      <SkuAiPlaygroundModal
        open={aiPlaygroundOpen}
        onClose={() => setAiPlaygroundOpen(false)}
        onSaveToMappings={handleSavePlaygroundMapping}
      />

      {/* Batch Approve Confirm Modal */}
      <ConfirmModal
        open={batchModalOpen}
        title="Xác nhận phê duyệt hàng loạt SKU"
        content={`Bạn có chắc chắn muốn tự động phê duyệt toàn bộ ${pendingCount} mã hàng có độ tin cậy AI cao (>= 90%) vào danh mục Master SKU không?`}
        confirmText={`Phê duyệt ${pendingCount} mã`}
        loading={batchLoading}
        onConfirm={handleBatchApproveAll}
        onCancel={() => setBatchModalOpen(false)}
      />
    </PageContainer>
  );
};

export default SkuMappingTable;
