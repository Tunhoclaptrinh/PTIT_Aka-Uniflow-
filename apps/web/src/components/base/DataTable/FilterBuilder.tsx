import React from 'react';
import {
  Dropdown,
  Select,
  Input,
  DatePicker,
  Tooltip,
  Checkbox,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { BaseButton } from '../BaseButton';
import { FilterConfig } from './types';

export interface FilterBuilderProps {
  filters: FilterConfig[];
  activeFilters: FilterConfig[];
  filterValues: Record<string, any>;
  operators: Record<string, string>;
  enabledFilters: Record<string, boolean>;
  onAddFilter: (key: string) => void;
  onRemoveFilter: (key: string) => void;
  onFilterChange: (key: string, value: any) => void;
  onOperatorChange: (key: string, op: string) => void;
  onToggleFilter: (key: string) => void;
  onApply?: () => void;
  onClear?: () => void;
  onCancel?: () => void;
  hideFooter?: boolean;
  applyText?: string;
}

export const OPERATOR_LABELS: Record<string, string> = {
  eq: 'Bằng (=)',
  ne: 'Khác (!=)',
  gt: 'Lớn hơn (>)',
  gte: 'Lớn hơn hoặc bằng (>=)',
  lt: 'Nhỏ hơn (<)',
  lte: 'Nhỏ hơn hoặc bằng (<=)',
  like: 'Chứa (like)',
  ilike: 'Chứa không phân biệt hoa/thường',
  not_like: 'Không chứa',
  in: 'Thuộc danh sách',
  nin: 'Không thuộc danh sách',
};

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  filters,
  activeFilters,
  filterValues,
  operators,
  enabledFilters,
  onAddFilter,
  onRemoveFilter,
  onFilterChange,
  onOperatorChange,
  onToggleFilter,
  onApply,
  onClear,
  onCancel,
  hideFooter = false,
  applyText = 'Áp dụng bộ lọc',
}) => {
  return (
    <div className="filter-builder-container">
      {/* Active filters section */}
      <div className="active-filters-section">
        {activeFilters.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '24px 16px',
              color: '#9CA3AF',
              background: '#FFFFFF',
              borderRadius: 8,
              border: '2px dashed #E5E7EB',
            }}
          >
            <p style={{ margin: 0, fontSize: 13 }}>Chưa có điều kiện lọc nào được chọn.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeFilters.map((filter) => {
              const label = filter.label || filter.placeholder || filter.key;
              let currentOpRaw = operators[filter.key];
              if (!currentOpRaw) {
                const operatorSuffixToOp: Record<string, string> = {
                  '': 'eq',
                  _ne: 'ne',
                  _gte: 'gte',
                  _lte: 'lte',
                  _like: 'like',
                  _in: 'in',
                };
                for (const [suffix, op] of Object.entries(operatorSuffixToOp)) {
                  if (suffix && filterValues[`${filter.key}${suffix}`] !== undefined) {
                    currentOpRaw = op;
                    break;
                  }
                }
              }
              const currentOp = currentOpRaw || filter.defaultOperator || 'eq';
              const isEnabled = enabledFilters[filter.key] !== false;
              const activeKey = currentOp === 'eq' ? filter.key : `${filter.key}_${currentOp}`;

              return (
                <div
                  key={filter.key}
                  className={`filter-condition-item ${!isEnabled ? 'disabled' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#FFFFFF',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <Checkbox
                    checked={isEnabled}
                    disabled={filter.disabled}
                    onChange={() => !filter.disabled && onToggleFilter(filter.key)}
                  />

                  <div style={{ width: 140, fontWeight: 600, fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {label}
                  </div>

                  <Select
                    value={currentOp}
                    disabled={filter.disabled}
                    style={{ width: 130 }}
                    size="middle"
                    onChange={(op) => {
                      if (filter.disabled) return;
                      onOperatorChange(filter.key, op);
                    }}
                    options={(filter.operators || ['eq', 'ne', 'like', 'in']).map((op) => ({
                      value: op,
                      label: OPERATOR_LABELS[op] || op,
                    }))}
                  />

                  <div style={{ flex: 1 }}>
                    {filter.type === 'select' && (
                      <Select
                        placeholder="Chọn giá trị..."
                        value={filterValues[activeKey]}
                        disabled={filter.disabled}
                        onChange={(val) => !filter.disabled && onFilterChange(filter.key, val)}
                        allowClear={!filter.disabled}
                        style={{ width: '100%' }}
                        options={filter.options}
                        size="middle"
                        mode={currentOp === 'in' || currentOp === 'nin' ? 'multiple' : undefined}
                      />
                    )}

                    {(filter.type === 'input' || filter.type === 'number') && (
                      <Input
                        placeholder="Nhập giá trị..."
                        value={filterValues[activeKey]}
                        disabled={filter.disabled}
                        onChange={(e) => !filter.disabled && onFilterChange(filter.key, e.target.value)}
                        allowClear={!filter.disabled}
                        style={{ width: '100%' }}
                        type={filter.type === 'number' ? 'number' : 'text'}
                        size="middle"
                      />
                    )}

                    {filter.type === 'date' && (
                      <DatePicker
                        placeholder="Chọn ngày"
                        disabled={filter.disabled}
                        style={{ width: '100%' }}
                        value={filterValues[activeKey] ? dayjs(filterValues[activeKey]) : null}
                        onChange={(_date, dateString) => {
                          !filter.disabled && onFilterChange(filter.key, dateString);
                        }}
                        size="middle"
                      />
                    )}
                  </div>

                  <Tooltip title={filter.disabled ? 'Điều kiện cố định' : 'Xóa điều kiện này'}>
                    <BaseButton
                      variant="danger"
                      size="small"
                      disabled={filter.disabled}
                      onClick={() => !filter.disabled && onRemoveFilter(filter.key)}
                      icon={<DeleteOutlined />}
                    />
                  </Tooltip>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Condition Dropdown */}
        <div style={{ marginTop: 12 }}>
          <Dropdown
            menu={{
              items: filters
                .filter((f) => !activeFilters.find((af) => af.key === f.key))
                .map((f) => ({
                  key: f.key,
                  label: f.label || f.placeholder || f.key,
                  onClick: () => onAddFilter(f.key),
                })),
              style: { maxHeight: 260, overflowY: 'auto' },
            }}
            disabled={filters.length === activeFilters.length}
            trigger={['click']}
          >
            <BaseButton
              variant="ghost"
              size="small"
              style={{ width: '100%', borderStyle: 'dashed', background: '#FFFFFF', color: '#4B5563' }}
              icon={<PlusOutlined />}
            >
              + Thêm điều kiện lọc
            </BaseButton>
          </Dropdown>
        </div>
      </div>

      {!hideFooter && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            marginTop: 16,
            paddingTop: 14,
            borderTop: '1px solid #E5E7EB',
          }}
        >
          {onCancel && (
            <BaseButton variant="ghost" size="small" onClick={onCancel} style={{ minWidth: 90 }}>
              Hủy
            </BaseButton>
          )}
          {onClear && (
            <BaseButton variant="ghost" size="small" onClick={onClear} style={{ minWidth: 90 }}>
              Bỏ lọc
            </BaseButton>
          )}
          {onApply && (
            <BaseButton variant="primary" size="small" onClick={onApply} glow style={{ minWidth: 120 }}>
              {applyText}
            </BaseButton>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBuilder;
