import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Space, Typography, Badge } from 'antd';
import {
  DashboardOutlined,
  ApartmentOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  BulbOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan (Dashboard)',
    },
    {
      key: '/workflows',
      icon: <ApartmentOutlined />,
      label: 'Visual Workflow Builder',
    },
    {
      key: '/connectors',
      icon: <ApiOutlined />,
      label: 'Connectors Hub',
    },
    {
      key: '/mapping',
      icon: <ThunderboltOutlined />,
      label: 'AI SKU Auto-Mapping',
    },
    {
      key: '/logs',
      icon: <FileTextOutlined />,
      label: 'Live Logs & Self-Healing',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt & Multi-Tenant',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#0B0F19' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        style={{
          background: '#0B0F19',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Logo Container */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 12,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Logo Brand SVG with Infinity Ribbon & Aka Red - Solar Gold */}
          <img
            src="/logo.svg"
            alt="UniFlow AI Logo"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              boxShadow: '0 0 14px rgba(237, 28, 36, 0.45)',
            }}
          />
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#F9FAFB', letterSpacing: '-0.3px' }}>
                UniFlow <span style={{ color: '#fcc20f' }}>AI</span>
              </div>
              <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>PTIT Aka Edition</div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent',
            marginTop: 12,
            fontWeight: 500,
          }}
        />
      </Sider>

      <Layout style={{ background: '#0B0F19' }}>
        {/* Top Header */}
        <Header
          style={{
            padding: '0 24px',
            background: '#111827',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 64,
          }}
        >
          <Space orientation="horizontal" size="middle">
            <span className="live-pulse-dot" />
            <Text style={{ color: '#10B981', fontWeight: 600, fontSize: 13 }}>
              Hệ thống trực tuyến (WebSocket Connected)
            </Text>
          </Space>

          <Space size="large">
            <Badge count={2} size="small" color="#ed1c24">
              <Button
                type="text"
                shape="circle"
                icon={<BellOutlined style={{ color: '#F9FAFB', fontSize: 18 }} />}
              />
            </Badge>
            <Button
              type="text"
              shape="circle"
              icon={<BulbOutlined style={{ color: '#fcc20f', fontSize: 18 }} />}
            />
            <Space>
              <Avatar
                style={{
                  background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
                }}
                icon={<UserOutlined />}
              />
              <div>
                <div style={{ color: '#F9FAFB', fontSize: 13, fontWeight: 600 }}>
                  Thời Trang An Khang
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 11 }}>Gói Growth • Tenant ID: 001</div>
              </div>
            </Space>
          </Space>
        </Header>

        {/* Main Content Area */}
        <Content
          style={{
            margin: '20px 24px',
            padding: 0,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
