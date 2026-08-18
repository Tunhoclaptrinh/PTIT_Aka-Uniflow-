import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Tag, Button, Badge } from 'antd';
import {
  DashboardOutlined,
  BranchesOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  HistoryOutlined,
  SettingOutlined,
  BellOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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

  return (
    <Layout style={{ minHeight: '100vh', background: '#0B0F19' }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        width={250}
        style={{
          background: '#0B0F19',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Brand Logo Header with authentic PTIT Aka Logo */}
        <div
          style={{
            height: 64,
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: '#111827',
              border: '1px solid rgba(237, 28, 36, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(237, 28, 36, 0.35)',
              flexShrink: 0,
              padding: 4,
            }}
          >
            <img src="/logo.svg" alt="UniFlow PTIT Aka Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px' }}>
                <span style={{ color: '#F9FAFB' }}>Uni</span>
                <span style={{ color: '#ed1c24' }}>Flow</span>
                <span style={{ color: '#fcc20f', marginLeft: 4 }}>AI</span>
              </div>
              <div style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.5px' }}>
                PTIT AKA MIDDLEWARE
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            background: 'transparent',
            borderRight: 'none',
            marginTop: 12,
          }}
        />

        {!collapsed && (
          <div style={{ padding: '16px', position: 'absolute', bottom: 48, width: '100%' }}>
            <Link to="/">
              <Button
                block
                icon={<GlobalOutlined />}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderColor: '#374151',
                  color: '#D1D5DB',
                  fontSize: 12,
                }}
              >
                Về Landing Page
              </Button>
            </Link>
          </div>
        )}
      </Sider>

      {/* Main Container */}
      <Layout style={{ background: '#0B0F19' }}>
        {/* Top Navbar */}
        <Header
          style={{
            background: '#0B0F19',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 64,
          }}
        >
          <Space size="middle">
            <Tag color="#ed1c24" style={{ borderRadius: 4, fontWeight: 700, padding: '2px 8px' }}>
              Thời Trang An Khang (PTIT Aka)
            </Tag>
            <Tag color="#10B981" style={{ borderRadius: 4, fontWeight: 600 }}>
              ● Mega Sale Ready
            </Tag>
          </Space>

          <Space size="large">
            <Badge count={2} offset={[-4, 4]}>
              <Button
                type="text"
                shape="circle"
                icon={<BellOutlined style={{ fontSize: 18, color: '#9CA3AF' }} />}
              />
            </Badge>

            <Dropdown
              menu={{
                items: [
                  { key: '1', label: 'Tài khoản Admin PTIT' },
                  { key: '2', label: 'Gói Dịch Vụ: Growth' },
                  { key: '3', danger: true, label: 'Đăng xuất' },
                ],
              }}
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  style={{
                    backgroundColor: '#ed1c24',
                    fontWeight: 700,
                    border: '1px solid #fcc20f',
                  }}
                >
                  AK
                </Avatar>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span style={{ color: '#F9FAFB', fontWeight: 600, fontSize: 13 }}>Tuan Nguyen</span>
                  <span style={{ color: '#fcc20f', fontSize: 11 }}>Store Administrator</span>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Content Area */}
        <Content
          style={{
            margin: 24,
            minHeight: 280,
            overflowY: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
