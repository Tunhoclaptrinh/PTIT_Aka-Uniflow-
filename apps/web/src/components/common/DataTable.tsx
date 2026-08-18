import React, { useState } from 'react';
import { Card, Table, Input, Button, Space, Tabs, Dropdown, MenuProps } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FileTextOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { EmptyState } from './EmptyState';
import { exportToCSV, exportToJSON } from '../../utils/export';

interface TabOption {
  key: string;
  label: React.ReactNode;
}

export interface DataTableProps<T> {
  title?: React.ReactNode;
  subtitle?: string;
  dataSource: T[];
  columns: any[];
  rowKey: string | ((record: T) => string);
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  tabs?: TabOption[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  onRefresh?: () => void;
  exportFilename?: string;
  extraActions?: React.ReactNode;
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  title,
  subtitle,
  dataSource,
  columns,
  rowKey,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Tìm kiếm dữ liệu...',
  searchFields = [],
  tabs,
  activeTab,
  onTabChange,
  onRefresh,
  exportFilename = 'data-export',
  extraActions,
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchText, setSearchText] = useState('');

  const filteredData = dataSource.filter((item) => {
    if (!searchText.trim()) return true;
    const query = searchText.toLowerCase();

    if (searchFields.length > 0) {
      return searchFields.some((field) =>
        String(item[field] || '').toLowerCase().includes(query)
      );
    }

    return Object.values(item).some((val) =>
      String(val || '').toLowerCase().includes(query)
    );
  });

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'csv',
      icon: <FileTextOutlined />,
      label: 'Xuất file CSV (Excel)',
      onClick: () => exportToCSV(filteredData, `${exportFilename}.csv`),
    },
    {
      key: 'json',
      icon: <CodeOutlined />,
      label: 'Xuất file JSON',
      onClick: () => exportToJSON(filteredData, `${exportFilename}.json`),
    },
  ];

  return (
    <Card
      title={
        title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{title}</div>
              {subtitle && <div style={{ color: '#6B7280', fontSize: 12, fontWeight: 400 }}>{subtitle}</div>}
            </div>

            <Space wrap>
              {searchable && (
                <Input
                  prefix={<SearchOutlined style={{ color: '#9CA3AF' }} />}
                  placeholder={searchPlaceholder}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 260 }}
                />
              )}

              {onRefresh && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onRefresh}
                  loading={loading}
                >
                  Làm mới
                </Button>
              )}

              <Dropdown menu={{ items: exportMenuItems }}>
                <Button icon={<DownloadOutlined />}>
                  Xuất Dữ Liệu
                </Button>
              </Dropdown>

              {extraActions}
            </Space>
          </div>
        )
      }
      bordered={false}
      style={{
        borderRadius: 12,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
      }}
      bodyStyle={{ padding: 0 }}
    >
      {tabs && tabs.length > 0 && (
        <div style={{ padding: '0 20px', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Tabs
            activeKey={activeTab}
            onChange={onTabChange}
            items={tabs.map((t) => ({ key: t.key, label: t.label }))}
            style={{ marginBottom: -1 }}
          />
        </div>
      )}

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
          style: { padding: '12px 20px', margin: 0 },
        }}
        locale={{
          emptyText: <EmptyState title="Không có bản ghi nào" description="Không tìm thấy kết quả phù hợp với bộ lọc hiện tại." />,
        }}
      />
    </Card>
  );
}
