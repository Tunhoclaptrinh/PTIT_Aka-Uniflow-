import { create } from 'zustand';
import { authService, User, Tenant, LoginPayload, RegisterPayload } from '../services/authService';

interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  tenant: null,
  token: localStorage.getItem('uniflow_access_token'),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (payload: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(payload);
      set({
        user: response.user,
        tenant: response.tenant || null,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err?.message || err?.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(payload);
      set({
        user: response.user,
        tenant: response.tenant || null,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err?.message || err?.error || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({
      user: null,
      tenant: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    if (!authService.isAuthenticated()) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    try {
      const res = await authService.getMe();
      set({
        user: res.user,
        tenant: res.tenant || null,
        isAuthenticated: true,
      });
      localStorage.setItem('uniflow_user', JSON.stringify(res.user));
    } catch {
      set({ user: null, isAuthenticated: false, token: null });
      localStorage.removeItem('uniflow_access_token');
      localStorage.removeItem('uniflow_user');
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));
