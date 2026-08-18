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
import './styles/global.less';

const DashboardPage: React.FC = () => (
  <div>
    <KpiCards />
    <LiveEventStream />
  </div>
);

export const App: React.FC = () => {
  return (
    <ConfigProvider theme={darkThemeConfig}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/workflows" element={<WorkflowCanvas />} />
            <Route path="/connectors" element={<ConnectorsHub />} />
            <Route path="/mapping" element={<SkuMappingTable />} />
            <Route path="/logs" element={<LiveEventStream />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
