import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { darkThemeConfig } from './styles/theme';
import { MainLayout } from './components/layout/MainLayout';
import { KpiCards } from './components/dashboard/KpiCards';
import { LiveEventStream } from './components/dashboard/LiveEventStream';
import { WorkflowCanvas } from './components/workflow/WorkflowCanvas';
import { SkuMappingTable } from './components/mapping/SkuMappingTable';
import { ConnectorsHub } from './components/connectors/ConnectorsHub';
import { LandingPage } from './pages/LandingPage';
import { LiveLogsPage } from './pages/LiveLogsPage';
import { SettingsPage } from './pages/SettingsPage';

// Dashboard Overview Page
const DashboardOverview: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <KpiCards />
      <LiveEventStream />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ConfigProvider theme={darkThemeConfig}>
      <BrowserRouter>
        <Routes>
          {/* 1. Landing Page (Public Showcase) */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. Admin Dashboard Pages (Protected by MainLayout) */}
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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
