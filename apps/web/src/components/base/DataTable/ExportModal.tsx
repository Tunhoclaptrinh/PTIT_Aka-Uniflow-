import React, { useState, useEffect } from 'react';
import { Modal, Radio, Space, Checkbox, Typography, Divider, InputNumber } from 'antd';
import { DownloadOutlined, OrderedListOutlined } from '@ant-design/icons';
import { FilterConfig, DataTableColumn } from './types';
import { BaseButton } from '../BaseButton';

export interface ExportModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (options: {
    scope: 'page' | 'all' | 'custom';
    format: 'xlsx' | 'csv' | 'json';
    columns?: string[];
    limit?: number;
  }) => void;
  loading?: boolean;
  totalRecords?: number;
  currentPageSize?: number;
  filters?: FilterConfig[];
  currentFilters?: any;
  columns?: DataTableColumn[];
  fieldLabelMap?: Record<string, string>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  onCancel,
  onOk,
  loading = false,
  totalRecords = 0,
  currentPageSize = 10,
  columns = [],
}) => {
  const [scope, setScope] = useState<'page' | 'all' | 'custom'>('all');
  const [format, setFormat] = useState<'xlsx' | 'csv' | 'json'>('csv');
  const [customLimit, setCustomLimit] = useState<number>(100);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      const validCols = columns
        .filter((c) => c.key && c.key !== 'actions' && c.key !== 'selection' && !c.exportHidden)
        .map((c) => String(c.key || c.dataIndex));
      setSelectedColumns(validCols);
    }
  }, [visible, columns]);

  const handleOk = () => {
    onOk({
      scope,
      format,
      columns: selectedColumns,
      limit: scope === 'custom' ? customLimit : undefined,
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={
        <Space>
          <DownloadOutlined style={{ color: '#ed1c24' }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Xuất Dữ Liệu Nâng Cao (Export)</span>
        </Space>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <BaseButton variant="ghost" size="small" onClick={onCancel}>
            Hủy bỏ
          </BaseButton>
          <BaseButton
            variant="brand"
            size="small"
            onClick={handleOk}
            loading={loading}
            icon={<DownloadOutlined />}
            disabled={selectedColumns.length === 0}
            glow
          >
            Bắt đầu xuất file
          </BaseButton>
        </div>
      }
      width={680}
      centered
      destroyOnClose
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, padding: '12px 0' }}>
        {/* Left Column: Options */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <section>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              1. Phạm vi xuất dữ liệu
            </Typography.Text>
            <Radio.Group
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <Radio value="all">Tất cả dữ liệu ({totalRecords || 'Toàn bộ'} bản ghi)</Radio>
              <Radio value="page">Trang hiện tại ({currentPageSize} bản ghi)</Radio>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Radio value="custom">Giới hạn số lượng:</Radio>
                {scope === 'custom' && (
                  <InputNumber
                    min={1}
                    max={10000}
                    value={customLimit}
                    onChange={(val) => setCustomLimit(val || 100)}
                    size="small"
                    style={{ width: 80, marginLeft: 4 }}
                  />
                )}
              </div>
            </Radio.Group>
          </section>

          <Divider style={{ margin: '10px 0' }} />

          <section>
            <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
              2. Định dạng tập tin
            </Typography.Text>
            <Radio.Group
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{ display: 'flex', gap: 20 }}
            >
              <Radio value="csv">Excel / CSV (.csv)</Radio>
              <Radio value="json">Dữ liệu thô JSON (.json)</Radio>
            </Radio.Group>
          </section>
        </Space>

        {/* Right Column: Column Selection */}
        <section style={{ borderLeft: '1px solid #E5E7EB', paddingLeft: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Typography.Text strong>3. Chọn cột hiển thị</Typography.Text>
            <OrderedListOutlined style={{ color: '#9CA3AF' }} />
          </div>
          <div
            style={{
              maxHeight: 280,
              overflowY: 'auto',
              background: '#F9FAFB',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #E5E7EB',
            }}
          >
            <Checkbox.Group
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}
              value={selectedColumns}
              onChange={(vals) => setSelectedColumns(vals as string[])}
            >
              {columns
                .filter((c) => c.key && c.key !== 'actions' && c.key !== 'selection' && !c.exportHidden)
                .map((col) => {
                  const keyStr = String(col.key || col.dataIndex);
                  const titleStr = typeof col.title === 'string' ? col.title : keyStr;
                  return (
                    <Checkbox key={keyStr} value={keyStr}>
                      {titleStr}
                    </Checkbox>
                  );
                })}
            </Checkbox.Group>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default ExportModal;
