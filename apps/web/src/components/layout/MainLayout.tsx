import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Button, Badge, Tooltip } from 'antd';
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
  AimOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NotificationDrawer } from './NotificationDrawer';
import { ErrorBoundary } from '../base/ErrorBoundary';
import { useAppConfig } from '../../context/AppConfigContext';
import { useAuthStore } from '../../store/useAuthStore';
import { Tag } from 'antd';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { themeMode, toggleTheme } = useAppConfig();
  const { user: authUser, logout } = useAuthStore();

  const isLight = themeMode === 'light';
  const currentUser = authUser || {
    name: 'Admin Master',
    email: 'admin@uniflow.vn',
    role: 'ADMIN' as const,
    avatar: '',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Tổng quan</Link>,
    },
    {
      key: '/workflows',
      icon: <BranchesOutlined />,
      label: <Link to="/workflows">Quy trình tự động</Link>,
    },
    {
      key: '/mapping',
      icon: <ThunderboltOutlined />,
      label: <Link to="/mapping">Ánh xạ SKU AI</Link>,
    },
    {
      key: '/copilot',
      icon: (
        // <img
        //   src="/favicon.svg"
        //   alt="AI Agent"
        //   style={{ width: 16, height: 16, objectFit: 'contain', verticalAlign: 'middle' }}
        // />
        <AimOutlined />
      ),
      label: <Link to="/copilot">Trợ lý AI Agent</Link>,
    },
    {
      key: '/connectors',
      icon: <ApiOutlined />,
      label: <Link to="/connectors">Kênh kết nối</Link>,
    },
    {
      key: '/logs',
      icon: <HistoryOutlined />,
      label: <Link to="/logs">Nhật ký sự kiện</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Cài đặt hệ thống</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <div style={{ padding: '4px 0', color: isLight ? '#1F2937' : '#F3F4F6' }}>
          <div style={{ fontWeight: 700, fontSize: 13.5 }}>{currentUser.name}</div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>{currentUser.email}</div>
        </div>
      ),
    },
    {
      type: 'divider' as const,
    },
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
      onClick: handleLogout,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Nút Hướng Dẫn dạng Icon tròn có Tooltip chỉn chu */}
          <Tooltip title="Tài liệu & Hướng dẫn sử dụng">
            <Button
              type="text"
              shape="circle"
              icon={<QuestionCircleOutlined style={{ fontSize: 16, color: isLight ? '#4B5563' : '#D1D5DB' }} />}
              onClick={() => window.open('https://github.com/PTIT-Aka/UniFlow-AI#readme', '_blank')}
              style={{ width: 32, height: 32 }}
            />
          </Tooltip>

          {/* Theme Toggle Button */}
          <Tooltip title={isLight ? 'Chuyển sang giao diện Tối' : 'Chuyển sang giao diện Sáng'}>
            <Button
              type="text"
              shape="circle"
              icon={isLight ? <MoonOutlined style={{ fontSize: 15, color: '#4B5563' }} /> : <SunOutlined style={{ fontSize: 15, color: '#fcc20f' }} />}
              onClick={toggleTheme}
              style={{ width: 32, height: 32 }}
            />
          </Tooltip>

          {/* Notification Button */}
          <Tooltip title="Thông báo hệ thống">
            <Badge count={2} offset={[-3, 3]}>
              <Button
                type="text"
                shape="circle"
                icon={<BellOutlined style={{ fontSize: 17, color: isLight ? '#4B5563' : '#D1D5DB' }} />}
                onClick={() => setNotificationOpen(true)}
                style={{ width: 32, height: 32 }}
              />
            </Badge>
          </Tooltip>

          {/* Thẻ Tài Khoản: Kéo sát lên trên mép viền Header */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            align={{ offset: [0, -8] }}
            overlayStyle={{ marginTop: -8 }}
          >
            <div
              style={{
                height: 56,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '0 8px',
                borderRadius: 6,
                marginLeft: 4,
                transition: 'background 0.15s ease',
              }}
            >
              <Space size={8}>
                <Avatar
                  src={currentUser?.avatar}
                  style={{
                    backgroundColor: currentUser?.role === 'ADMIN' ? '#ed1c24' : '#FCC20F',
                    color: currentUser?.role === 'ADMIN' ? '#FFFFFF' : '#000000',
                    fontWeight: 700,
                    fontSize: 12,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'UF'}
                </Avatar>
                <span style={{ fontWeight: 600, fontSize: 13, color: isLight ? '#111827' : '#F9FAFB' }}>
                  {currentUser?.name || 'Tài khoản UniFlow'}
                </span>
                <Tag
                  color={currentUser?.role === 'ADMIN' ? 'red' : 'gold'}
                  style={{
                    margin: 0,
                    fontSize: 10,
                    fontWeight: 800,
                    borderRadius: 4,
                    padding: '0 6px',
                    lineHeight: '18px',
                  }}
                >
                  {currentUser?.role || 'MERCHANT'}
                </Tag>
              </Space>
            </div>
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
