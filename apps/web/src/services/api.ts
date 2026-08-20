import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { notify } from '../utils/notification';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  timestamp?: string;
}

class BaseApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 1. Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Inject token if present
        const token = localStorage.getItem('uniflow_access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Inject default tenant id
        const tenantId = localStorage.getItem('uniflow_tenant_id') || '66c0e812a1b2c3d4e5f60001';
        if (config.headers) {
          config.headers['x-tenant-id'] = tenantId;
          config.headers['x-client-request-id'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 2. Response Interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Unwrap data envelope if exists
        const payload = response.data;
        if (payload && typeof payload === 'object' && 'data' in payload) {
          return payload.data;
        }
        return payload;
      },
      (error) => {
        const status = error.response?.status;
        const errorMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Lỗi kết nối tới hệ thống máy chủ!';

        if (status === 401) {
          notify.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
        } else if (status === 403) {
          notify.warning('Bạn không có quyền thực hiện thao tác này.');
        } else if (status === 404) {
          console.warn(`[API 404] ${error.config?.url} not found.`);
        } else if (status >= 500) {
          notify.error(`Lỗi máy chủ (${status}): ${errorMsg}`);
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          notify.warning('Yêu cầu hết thời gian chờ (Timeout SLA). Vui lòng thử lại.');
        }

        return Promise.reject(error.response?.data || error);
      }
    );
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config) as unknown as Promise<T>;
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config) as unknown as Promise<T>;
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config) as unknown as Promise<T>;
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config) as unknown as Promise<T>;
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config) as unknown as Promise<T>;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

export const baseApi = new BaseApiClient();
export const apiClient = baseApi.getAxiosInstance();
export default baseApi;
