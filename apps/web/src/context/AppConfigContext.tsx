import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export interface AppTenantConfig {
  tenantId: string;
  tenantName: string;
  subdomain: string;
  plan: 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  primaryColor: string;
  secondaryColor: string;
}

export interface AppUserConfig {
  id: string;
  name: string;
  role: string;
  email: string;
}

export type ThemeMode = 'light' | 'dark';

interface AppConfigContextValue {
  tenant: AppTenantConfig;
  user: AppUserConfig;
  themeMode: ThemeMode;
  setTenant: (tenant: AppTenantConfig) => void;
  setUser: (user: AppUserConfig) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  systemHealthSla: number;
}

const defaultTenant: AppTenantConfig = {
  tenantId: '66c0e812a1b2c3d4e5f60001',
  tenantName: 'Thời Trang An Khang (PTIT_Aka Store)',
  subdomain: 'ankhang-ptit',
  plan: 'GROWTH',
  primaryColor: '#ed1c24',
  secondaryColor: '#fcc20f',
};

const defaultUser: AppUserConfig = {
  id: 'usr_ptit_admin_001',
  name: 'Tuan Nguyen',
  role: 'Store Administrator',
  email: 'tuannguyentien16@gmail.com',
};

const AppConfigContext = createContext<AppConfigContextValue>({
  tenant: defaultTenant,
  user: defaultUser,
  themeMode: 'light',
  setTenant: () => { },
  setUser: () => { },
  setThemeMode: () => { },
  toggleTheme: () => { },
  systemHealthSla: 99.98,
});

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<AppTenantConfig>(defaultTenant);
  const [user, setUser] = useState<AppUserConfig>(defaultUser);
  // Default to light mode
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return (storage.get<ThemeMode>('uniflow_theme_mode')) || 'light';
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    storage.set('uniflow_theme_mode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  };

  const toggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  return (
    <AppConfigContext.Provider
      value={{
        tenant,
        user,
        themeMode,
        setTenant,
        setUser,
        setThemeMode,
        toggleTheme,
        systemHealthSla: 99.98,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => useContext(AppConfigContext);
