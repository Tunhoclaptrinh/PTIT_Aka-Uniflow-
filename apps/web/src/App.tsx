import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { lightThemeConfig, darkThemeConfig } from './styles/theme';
import { AppConfigProvider, useAppConfig } from './context/AppConfigContext';
import { MainLayout } from './components/layout/MainLayout';
import { KpiCards } from './components/dashboard/KpiCards';
import { LiveEventStream } from './components/dashboard/LiveEventStream';
import { WorkflowCanvas } from './components/workflow/WorkflowCanvas';
import { SkuMappingTable } from './components/mapping/SkuMappingTable';
import { ConnectorsHub } from './components/connectors/ConnectorsHub';
import { LandingPage } from './pages/LandingPage';
import { LiveLogsPage } from './pages/LiveLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PageContainer } from './components/base/PageContainer';

// Dashboard Overview Page wrapped with PageContainer
const DashboardOverview: React.FC = () => {
  return (
    <PageContainer
      title="Tổng Quan Vận Hành 0-Chạm (Omnichannel Overview)"
      subtitle="Giám sát luồng dữ liệu thời gian thực, độ trễ SLA và trạng thái các sàn TMĐT"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <KpiCards />
        <LiveEventStream />
      </div>
    </PageContainer>
  );
};

const ThemedApp: React.FC = () => {
  const { themeMode } = useAppConfig();
  const themeConfig = themeMode === 'light' ? lightThemeConfig : darkThemeConfig;

  return (
    <ConfigProvider theme={themeConfig}>
      <BrowserRouter>
        <Routes>
          {/* 1. Landing Page (Public Showcase) */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. Admin Dashboard Pages (Protected by ProLayout) */}
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <DashboardOverview />
              </MainLayout>
            }
          />
          <Route
            path="/workflows"
            element={
              <MainLayout>
                <WorkflowCanvas />
              </MainLayout>
            }
          />
          <Route
            path="/mapping"
            element={
              <MainLayout>
                <SkuMappingTable />
              </MainLayout>
            }
          />
          <Route
            path="/connectors"
            element={
              <MainLayout>
                <ConnectorsHub />
              </MainLayout>
            }
          />
          <Route
            path="/logs"
            element={
              <MainLayout>
                <LiveLogsPage />
              </MainLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <MainLayout>
                <SettingsPage />
              </MainLayout>
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
