import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { lightThemeConfig, darkThemeConfig } from './styles/theme';
import { AppConfigProvider, useAppConfig } from './context/AppConfigContext';
import { useAuthStore } from './store/useAuthStore';
import { MainLayout } from './components/layout/MainLayout';
import { WorkflowCanvas } from './components/workflow/WorkflowCanvas';
import { SkuMappingTable } from './components/mapping/SkuMappingTable';
import { ConnectorsHub } from './components/connectors/ConnectorsHub';
import { LandingPage } from './pages/LandingPage';
import { LiveLogsPage } from './pages/LiveLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CopilotAgentPage } from './pages/CopilotAgentPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Public Only Route Wrapper (e.g. login/register redirect to dashboard if logged in)
const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const ThemedApp: React.FC = () => {
  const { themeMode } = useAppConfig();
  const { checkAuth } = useAuthStore();
  const themeConfig = themeMode === 'light' ? lightThemeConfig : darkThemeConfig;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ConfigProvider theme={themeConfig}>
      <BrowserRouter>
        <Routes>
          {/* 1. Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. Public Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <LoginPage />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicAuthRoute>
                <RegisterPage />
              </PublicAuthRoute>
            }
          />

          {/* 3. Protected Admin & Merchant Dashboard Pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflows"
            element={
              <ProtectedRoute>
                <WorkflowCanvas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mapping"
            element={
              <ProtectedRoute>
                <SkuMappingTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connectors"
            element={
              <ProtectedRoute>
                <ConnectorsHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <LiveLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/copilot"
            element={
              <ProtectedRoute>
                <CopilotAgentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export const App: React.FC = () => {
  return (
    <AppConfigProvider>
      <ThemedApp />
    </AppConfigProvider>
  );
};

export default App;
