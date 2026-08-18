import { baseApi } from './api';

export interface BasePaginationParams {
  page?: number;
  limit?: number;
  _page?: number;
  _limit?: number;
  search?: string;
  q?: string;
  _q?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  sort?: string;
  order?: 'asc' | 'desc';
  _sort?: string;
  _order?: 'asc' | 'desc';
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BatchResult<T = any> {
  total: number;
  success: number;
  failed: number;
  inserted?: T[];
}

export abstract class BaseApiService<T = any> {
  protected abstract endpoint: string;

  /**
   * Xây dựng Query String chuẩn REST API từ QueryParams
   */
  protected buildQueryString(params: Record<string, any> = {}): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue;

      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','));
      } else if (typeof value === 'object' && !(value instanceof Date)) {
        searchParams.append(key, JSON.stringify(value));
      } else {
        searchParams.append(key, String(value));
      }
    }

    return searchParams.toString();
  }

  async getAll(params?: Record<string, any>): Promise<T[]> {
    const queryString = params ? this.buildQueryString(params) : '';
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;
    return baseApi.get<T[]>(url);
  }

  async getById(id: string): Promise<T> {
    return baseApi.get<T>(`${this.endpoint}/${id}`);
  }

  async paginate(params?: BasePaginationParams): Promise<PaginatedResponse<T>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const url = queryString ? `${this.endpoint}/paginate?${queryString}` : `${this.endpoint}/paginate`;
    return baseApi.get<PaginatedResponse<T>>(url);
  }

  async search(query: string, params: Record<string, any> = {}): Promise<T[]> {
    const queryString = this.buildQueryString({ _q: query, ...params });
    return baseApi.get<T[]>(`${this.endpoint}/search?${queryString}`);
  }

  async count(params: Record<string, any> = {}): Promise<{ count: number }> {
    const queryString = this.buildQueryString(params);
    const url = queryString ? `${this.endpoint}/count?${queryString}` : `${this.endpoint}/count`;
    return baseApi.get<{ count: number }>(url);
  }

  async create(data: Partial<T>): Promise<T> {
    return baseApi.post<T>(this.endpoint, data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return baseApi.put<T>(`${this.endpoint}/${id}`, data);
  }

  async patch(id: string, data: Partial<T>): Promise<T> {
    return baseApi.patch<T>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return baseApi.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
  }

  async bulkCreate(items: Partial<T>[]): Promise<BatchResult<T>> {
    return baseApi.post<BatchResult<T>>(`${this.endpoint}/bulk`, { items });
  }

  async bulkDelete(ids: string[]): Promise<{ total: number; success: number }> {
    return baseApi.post<{ total: number; success: number }>(`${this.endpoint}/bulk/delete`, { ids });
  }
}

export default BaseApiService;
