import { useAppConfig } from '../context/AppConfigContext';

export interface UseAccessResult {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  isAdmin: boolean;
  role?: string;
  user: any;
}

/**
 * useAccess Hook chuẩn Base
 * Kiểm tra quyền hạn (RBAC), vai trò người dùng (Admin, Manager, Operator)
 */
export const useAccess = (): UseAccessResult => {
  const { user } = useAppConfig();
  const role = user?.role;
  const permissions: string[] = (user as any)?.permissions || [];

  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN' || permissions.includes('*');

  const checkSinglePermission = (perm: string): boolean => {
    if (isAdmin) return true;
    return permissions.includes(perm);
  };

  const hasPermission = (permission: string): boolean => {
    if (isAdmin) return true;
    return checkSinglePermission(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    if (isAdmin) return true;
    return requiredPermissions.some((p) => checkSinglePermission(p));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    if (isAdmin) return true;
    return requiredPermissions.every((p) => checkSinglePermission(p));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    role,
    user,
  };
};

export default useAccess;
