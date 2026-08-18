import { useState, useCallback, useEffect } from 'react';
import { notify } from '../utils/notification';

export interface UseCRUDOptions<T> {
  autoFetch?: boolean;
  initialPage?: number;
  initialPageSize?: number;
  initialFilters?: Record<string, any>;
  onSuccess?: {
    fetch?: (data: T[]) => void;
    create?: (item: T) => void;
    update?: (item: T) => void;
    delete?: () => void;
  };
}

export interface UseCRUDResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;

  // Pagination
  page: number;
  pageSize: number;
  total: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotal: (total: number) => void;

  // Filters & Search
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  search: (query: string) => Promise<void>;

  // CRUD Actions
  fetchAll: () => Promise<void>;
  getById: (id: string) => Promise<T | null>;
  create: (item: Partial<T>) => Promise<T | null>;
  update: (id: string, item: Partial<T>) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
  batchDelete: (ids?: string[]) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export interface ICRUDService<T> {
  getAll?: (params?: any) => Promise<T[]>;
  paginate?: (params?: any) => Promise<{ items: T[]; total: number; page: number; limit: number }>;
  getById?: (id: string) => Promise<T>;
  create?: (data: any) => Promise<T>;
  update?: (id: string, data: any) => Promise<T>;
  delete?: (id: string) => Promise<any>;
  bulkDelete?: (ids: string[]) => Promise<any>;
  search?: (query: string, params?: any) => Promise<T[]>;
}

/**
 * useCRUD Hook chuẩn Base
 * Đóng gói toàn bộ vòng đời tương tác dữ liệu (Fetch, Create, Update, Delete, Batch, Filter, Search)
 */
export const useCRUD = <T extends { _id?: string; id?: string }>(
  service: ICRUDService<T>,
  options: UseCRUDOptions<T> = {}
): UseCRUDResult<T> => {
  const {
    autoFetch = true,
    initialPage = 1,
    initialPageSize = 10,
    initialFilters = {},
    onSuccess,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (service.paginate) {
        const res = await service.paginate({ page, limit: pageSize, ...filters });
        setData(res.items || []);
        setTotal(res.total || 0);
        if (onSuccess?.fetch) onSuccess.fetch(res.items || []);
      } else if (service.getAll) {
        const res = await service.getAll(filters);
        setData(res || []);
        setTotal(res?.length || 0);
        if (onSuccess?.fetch) onSuccess.fetch(res || []);
      }
    } catch (err: any) {
      const msg = err.message || 'Lỗi khi tải danh sách dữ liệu';
      setError(msg);
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  }, [service, page, pageSize, JSON.stringify(filters)]);

  useEffect(() => {
    if (autoFetch) {
      fetchAll();
    }
  }, [fetchAll, autoFetch]);

  const getById = useCallback(
    async (id: string): Promise<T | null> => {
      try {
        if (!service.getById) throw new Error('getById không được hỗ trợ');
        return await service.getById(id);
      } catch (err: any) {
        notify.error(err.message || 'Không tìm thấy bản ghi');
        return null;
      }
    },
    [service]
  );

  const create = useCallback(
    async (item: Partial<T>): Promise<T | null> => {
      try {
        setLoading(true);
        if (!service.create) throw new Error('create không được hỗ trợ');
        const created = await service.create(item);
        notify.success('Thêm mới thành công!');
        if (onSuccess?.create) onSuccess.create(created);
        await fetchAll();
        return created;
      } catch (err: any) {
        notify.error(err.message || 'Thêm mới thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [service, fetchAll, onSuccess]
  );

  const update = useCallback(
    async (id: string, item: Partial<T>): Promise<T | null> => {
      try {
        setLoading(true);
        if (!service.update) throw new Error('update không được hỗ trợ');
        const updated = await service.update(id, item);
        notify.success('Cập nhật thành công!');
        if (onSuccess?.update) onSuccess.update(updated);
        await fetchAll();
        return updated;
      } catch (err: any) {
        notify.error(err.message || 'Cập nhật thất bại');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [service, fetchAll, onSuccess]
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        if (!service.delete) throw new Error('delete không được hỗ trợ');
        await service.delete(id);
        notify.success('Xóa bản ghi thành công!');
        if (onSuccess?.delete) onSuccess.delete();
        await fetchAll();
        return true;
      } catch (err: any) {
        notify.error(err.message || 'Xóa bản ghi thất bại');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [service, fetchAll, onSuccess]
  );

  const batchDelete = useCallback(
    async (ids?: string[]): Promise<boolean> => {
      const targetIds = ids || selectedIds;
      if (!targetIds.length) {
        notify.warning('Vui lòng chọn ít nhất một bản ghi để xóa!');
        return false;
      }

      try {
        setLoading(true);
        if (service.bulkDelete) {
          await service.bulkDelete(targetIds);
        } else if (service.delete) {
          for (const id of targetIds) {
            await service.delete(id);
          }
        }
        notify.success(`Đã xóa thành công ${targetIds.length} bản ghi!`);
        setSelectedIds([]);
        await fetchAll();
        return true;
      } catch (err: any) {
        notify.error(err.message || 'Xóa hàng loạt thất bại');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [service, selectedIds, fetchAll]
  );

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setPage(1);
  }, [initialFilters]);

  const search = useCallback(
    async (query: string) => {
      updateFilter('q', query);
    },
    [updateFilter]
  );

  return {
    data,
    loading,
    error,
    selectedIds,
    setSelectedIds,
    page,
    pageSize,
    total,
    setPage,
    setPageSize,
    setTotal,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    search,
    fetchAll,
    getById,
    create,
    update,
    remove,
    batchDelete,
    refresh: fetchAll,
  };
};

export default useCRUD;
