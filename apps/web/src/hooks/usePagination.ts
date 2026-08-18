import { useState, useCallback, useMemo } from 'react';

export interface PageRange {
  start: number;
  end: number;
  total: number;
}

export interface AntdPagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
  showTotal: (total: number) => string;
  pageSizeOptions: string[];
}

export interface UsePaginationResult {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  pageRange: PageRange;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotal: (total: number) => void;
  goToPage: (newPage: number) => void;
  changePageSize: (newPageSize: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  reset: () => void;
  antdPagination: AntdPagination;
  handleTableChange: (pagination: any) => void;
}

/**
 * usePagination Hook chuẩn Base
 * Quản lý trạng thái phân trang, chuyển trang và tương thích hoàn toàn với Ant Design Table
 */
export const usePagination = (
  initialPage = 1,
  initialPageSize = 10
): UsePaginationResult => {
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [total, setTotal] = useState<number>(0);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const firstPage = useCallback(() => {
    setPage(1);
  }, []);

  const lastPage = useCallback(() => {
    const totalPages = Math.ceil(total / pageSize) || 1;
    setPage(totalPages);
  }, [total, pageSize]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
    setTotal(0);
  }, [initialPage, initialPageSize]);

  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize) || 1;
  }, [total, pageSize]);

  const hasNext = useMemo(() => {
    return page < totalPages;
  }, [page, totalPages]);

  const hasPrev = useMemo(() => {
    return page > 1;
  }, [page]);

  const pageRange = useMemo((): PageRange => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    return { start, end, total };
  }, [page, pageSize, total]);

  const antdPagination = useMemo((): AntdPagination => {
    return {
      current: page,
      pageSize,
      total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (t: number) => `Tổng số ${t} bản ghi`,
      pageSizeOptions: ['10', '20', '50', '100'],
    };
  }, [page, pageSize, total]);

  const handleTableChange = useCallback((pagination: any) => {
    if (pagination.current) setPage(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  }, []);

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext,
    hasPrev,
    pageRange,
    setPage,
    setPageSize,
    setTotal,
    goToPage,
    changePageSize,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    reset,
    antdPagination,
    handleTableChange,
  };
};

export default usePagination;
