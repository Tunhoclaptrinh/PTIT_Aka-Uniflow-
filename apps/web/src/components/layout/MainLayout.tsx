import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Button, Badge } from 'antd';
import {
  DashboardOutlined,
  BranchesOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  HistoryOutlined,
  SettingOutlined,
  BellOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NotificationDrawer } from './NotificationDrawer';
import { ErrorBoundary } from '../base/ErrorBoundary';
import { useAppConfig } from '../../context/AppConfigContext';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, themeMode, toggleTheme } = useAppConfig();

  const isLight = themeMode === 'light';

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard Tổng Quan</Link>,
    },
    {
      key: '/workflows',
      icon: <BranchesOutlined />,
      label: <Link to="/workflows">Visual Workflow Canvas</Link>,
    },
    {
      key: '/mapping',
      icon: <ThunderboltOutlined />,
      label: <Link to="/mapping">AI SKU Auto-Mapping</Link>,
    },
    {
      key: '/connectors',
      icon: <ApiOutlined />,
      label: <Link to="/connectors">Connectors Hub (Đa Kênh)</Link>,
    },
    {
      key: '/logs',
      icon: <HistoryOutlined />,
      label: <Link to="/logs">Live Logs & Self-Healing</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Cài Đặt Hệ Thống</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin tài khoản',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'theme',
      icon: isLight ? <MoonOutlined /> : <SunOutlined />,
      label: isLight ? 'Giao diện tối (Dark Mode)' : 'Giao diện sáng (Light Mode)',
      onClick: toggleTheme,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: () => navigate('/'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: isLight ? '#F8FAFC' : '#0B0F19' }}>
      {/* 1. TOP STICKY HEADER (Chuẩn phong cách G:\Base) */}
      <Header
        style={{
          background: isLight ? '#FFFFFF' : '#111827',
          borderBottom: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 56,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: isLight ? '0 1px 3px rgba(0, 0, 0, 0.03)' : 'none',
        }}
      >
        {/* Left: Brand Logo (Không khung bao) & Title */}
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img
            src="/logo.svg"
            alt="UniFlow PTIT_Aka Logo"
            style={{
              height: 36,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 800, color: isLight ? '#111827' : '#FFFFFF', letterSpacing: '-0.3px' }}>
            <span style={{ color: '#ed1c24' }}>Uni</span>Flow AI - Nền Tảng Omnichannel iPaaS & AI Engine
          </span>
        </div>

        {/* Right: Guide Button, Theme Toggle, Notifications & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Nút Hướng Dẫn đặt trên Header cạnh nút Theme */}
          <Button
            type="text"
            icon={<QuestionCircleOutlined style={{ fontSize: 15, color: '#4B5563' }} />}
            onClick={() => window.open('https://github.com/PTIT-Aka/UniFlow-AI#readme', '_blank')}
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: isLight ? '#4B5563' : '#D1D5DB',
              borderRadius: 6,
              height: 32,
              padding: '0 10px',
            }}
          >
            Hướng dẫn
          </Button>

          {/* Theme Toggle Button */}
          <Button
            type="text"
            shape="circle"
            icon={isLight ? <MoonOutlined style={{ fontSize: 15, color: '#4B5563' }} /> : <SunOutlined style={{ fontSize: 15, color: '#fcc20f' }} />}
            onClick={toggleTheme}
            title="Đổi giao diện Sáng / Tối"
            style={{ width: 32, height: 32 }}
          />

          <Badge count={2} offset={[-3, 3]}>
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined style={{ fontSize: 17, color: isLight ? '#4B5563' : '#D1D5DB' }} />}
              onClick={() => setNotificationOpen(true)}
              style={{ width: 32, height: 32 }}
            />
          </Badge>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 8 }}>
              <Avatar
                style={{
                  backgroundColor: '#ed1c24',
                  fontWeight: 700,
                  fontSize: 13,
                  border: '1px solid #fcc20f',
                }}
              >
                AK
              </Avatar>
              <span style={{ fontWeight: 600, fontSize: 13, color: isLight ? '#111827' : '#F9FAFB' }}>
                {user?.name || 'Tuan Nguyen'}
              </span>
            </Space>
          </Dropdown>
        </div>
      </Header>

      {/* 2. BODY LAYOUT (Sider + Content) */}
      <Layout style={{ background: isLight ? '#F8FAFC' : '#0B0F19' }}>
        {/* Left Sidebar */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={240}
          collapsedWidth={70}
          style={{
            background: isLight ? '#FFFFFF' : '#111827',
            borderRight: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
            position: 'sticky',
            top: 56,
            height: 'calc(100vh - 56px)',
            zIndex: 900,
            overflowY: 'auto',
          }}
          theme={isLight ? 'light' : 'dark'}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{
              borderRight: 0,
              background: 'transparent',
              padding: '12px 6px',
            }}
          />
        </Sider>

        {/* Main Content Area */}
        <Layout style={{ padding: '20px 24px', minHeight: 'calc(100vh - 56px)', background: 'transparent' }}>
          <Content>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </Content>
        </Layout>
      </Layout>

      {/* Notification Drawer */}
      <NotificationDrawer
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </Layout>
  );
};

export default MainLayout;
