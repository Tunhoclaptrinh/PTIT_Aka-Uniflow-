import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export interface SearchOptions {
  minLength?: number;
  autoSearch?: boolean;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export interface UseSearchResult<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  results: T[];
  loading: boolean;
  error: any | null;
  search: (term?: string, params?: any) => Promise<any | undefined>;
  clearSearch: () => void;
}

export interface SearchService<T> {
  search: (term: string, params?: any) => Promise<T[] | { data: T[] }>;
}

/**
 * useSearch Hook chuẩn Base
 * Tìm kiếm từ khóa tự động kèm debounce chống spam API
 */
export const useSearch = <T = any>(
  service: SearchService<T>,
  debounceMs = 400,
  options: SearchOptions = {}
): UseSearchResult<T> => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  const { minLength = 2, autoSearch = true, onSuccess, onError } = options;

  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const search = useCallback(
    async (term: string = searchTerm, params: any = {}) => {
      if (!term || term.length < minLength) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await service.search(term, params);
        const data = Array.isArray(response) ? response : response.data || [];
        setResults(data);

        if (onSuccess) onSuccess(response);
        return response;
      } catch (err) {
        console.error('Search error:', err);
        setError(err);
        setResults([]);
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    },
    [service, searchTerm, minLength, onSuccess, onError]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setError(null);
  }, []);

  useEffect(() => {
    if (autoSearch && debouncedSearchTerm) {
      search(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, autoSearch, search]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
    search,
    clearSearch,
  };
};

export default useSearch;
