/**
 * Tiện ích quản lý LocalStorage và SessionStorage có kiểu dữ liệu chuẩn base
 */

export const storage = {
  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (err) {
      console.warn(`Lỗi đọc localStorage [${key}]:`, err);
      return defaultValue ?? null;
    }
  },

  set<T = any>(key: string, value: T): boolean {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn(`Lỗi ghi localStorage [${key}]:`, err);
      return false;
    }
  },

  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn(`Lỗi xóa localStorage [${key}]:`, err);
    }
  },

  clear(): void {
    try {
      window.localStorage.clear();
    } catch (err) {
      console.warn('Lỗi làm sạch localStorage:', err);
    }
  },

  session: {
    get<T = any>(key: string, defaultValue?: T): T | null {
      try {
        const item = window.sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue ?? null;
      } catch (err) {
        console.warn(`Lỗi đọc sessionStorage [${key}]:`, err);
        return defaultValue ?? null;
      }
    },

    set<T = any>(key: string, value: T): boolean {
      try {
        window.sessionStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.warn(`Lỗi ghi sessionStorage [${key}]:`, err);
        return false;
      }
    },

    remove(key: string): void {
      try {
        window.sessionStorage.removeItem(key);
      } catch (err) {
        console.warn(`Lỗi xóa sessionStorage [${key}]:`, err);
      }
    },
  },
};
