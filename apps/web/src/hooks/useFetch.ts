import { useEffect, useState, useCallback } from 'react';

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * useFetch Hook chuẩn Base
 * Gọi API bất đồng bộ kèm quản lý trạng thái loading, data, error và refetch
 */
export const useFetch = <T = any>(
  apiFunction: (params?: any) => Promise<T>,
  params: any = {},
  autoFetch = true
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(params);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, JSON.stringify(params)]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
