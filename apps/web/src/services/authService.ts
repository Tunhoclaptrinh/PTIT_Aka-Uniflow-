import baseApi from './api';

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'ADMIN' | 'MERCHANT' | 'OPERATOR' | 'VIEWER';
  tenantId?: string;
  avatar?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface Tenant {
  _id: string;
  name: string;
  subdomain: string;
  planTier: string;
  brandTheme?: {
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
  tenant?: Tenant;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  tenantName?: string;
}

class AuthService {
  /**
   * Đăng nhập người dùng
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await baseApi.post<AuthResponse>('/auth/login', payload);
    if (data?.token) {
      localStorage.setItem('uniflow_access_token', data.token);
      localStorage.setItem('uniflow_user', JSON.stringify(data.user));
      if (data.tenant?._id) {
        localStorage.setItem('uniflow_tenant_id', data.tenant._id);
      }
    }
    return data;
  }

  /**
   * Đăng ký tài khoản mới
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await baseApi.post<AuthResponse>('/auth/register', payload);
    if (data?.token) {
      localStorage.setItem('uniflow_access_token', data.token);
      localStorage.setItem('uniflow_user', JSON.stringify(data.user));
      if (data.tenant?._id) {
        localStorage.setItem('uniflow_tenant_id', data.tenant._id);
      }
    }
    return data;
  }

  /**
   * Lấy thông tin tài khoản hiện tại (Get Me)
   */
  async getMe(): Promise<{ user: User; tenant?: Tenant }> {
    return baseApi.get<{ user: User; tenant?: Tenant }>('/auth/me');
  }

  /**
   * Đăng xuất
   */
  async logout(): Promise<void> {
    try {
      await baseApi.post('/auth/logout');
    } catch {
      // Ignore API logout error, always clean up client-side
    } finally {
      localStorage.removeItem('uniflow_access_token');
      localStorage.removeItem('uniflow_user');
      localStorage.removeItem('uniflow_tenant_id');
    }
  }

  /**
   * Lấy user đã lưu trong localStorage
   */
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem('uniflow_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('uniflow_access_token');
  }
}

export const authService = new AuthService();
export default authService;
