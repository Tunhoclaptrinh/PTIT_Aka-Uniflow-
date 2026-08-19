import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Button, Badge, Tooltip, Tag, Modal } from 'antd';
import {
  DashboardOutlined,
  BranchesOutlined,
  ApiOutlined,
  SettingOutlined,
  BellOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  AimOutlined,
  LeftOutlined,
  RightOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NotificationDrawer } from './NotificationDrawer';
import { ErrorBoundary } from '../base/ErrorBoundary';
import { useAppConfig } from '../../context/AppConfigContext';
import { useAuthStore } from '../../store/useAuthStore';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { themeMode, toggleTheme } = useAppConfig();
  const { user: authUser, logout } = useAuthStore();

  const isLight = themeMode === 'light';
  const currentUser = authUser || {
    name: 'Admin',
    email: 'admin@uniflow.vn',
    role: 'ADMIN' as const,
    avatar: '',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Base-style Navigation Structure (Phân cấp danh mục khoa học, trực quan)
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'sub-automation',
      icon: <BranchesOutlined />,
      label: 'Tự động hóa',
      children: [
        {
          key: '/workflows',
          label: <Link to="/workflows">Quy trình tự động</Link>,
        },
        {
          key: '/mapping',
          label: <Link to="/mapping">Ánh xạ SKU</Link>,
        },
      ],
    },
    {
      key: '/copilot',
      icon: <AimOutlined />,
      label: <Link to="/copilot">Trợ lý AI Agent</Link>,
    },
    {
      key: 'sub-integrations',
      icon: <ApiOutlined />,
      label: 'Tích hợp & Kết nối',
      children: [
        {
          key: '/connectors',
          label: <Link to="/connectors">Kênh kết nối</Link>,
        },
        {
          key: '/logs',
          label: <Link to="/logs">Nhật ký sự kiện</Link>,
        },
      ],
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Cấu hình hệ thống</Link>,
    },
  ];

  // Mặc định luôn mở tất cả các nhóm submenu ra theo chuẩn Base
  const allSubmenuKeys = ['sub-automation', 'sub-integrations'];
  const [openKeys, setOpenKeys] = useState<string[]>(allSubmenuKeys);

  useEffect(() => {
    // Luôn đảm bảo các submenu đều được mở sẵn sàng
    setOpenKeys((prev) => Array.from(new Set([...prev, ...allSubmenuKeys])));
  }, [location.pathname]);

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
        {/* Left: Brand Logo & Title */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}
          onClick={() => navigate('/')}
        >
          <img
            src="/logo.svg"
            alt="UniFlow AI"
            style={{
              height: 34,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <div style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.3px' }}>
              <span style={{ color: isLight ? '#111827' : '#FFFFFF' }}>Uni</span>
              <span style={{ color: '#ED1C24' }}>Flow</span>
              <span style={{ color: '#FCC20F' }}> AI</span>
            </div>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 800,
                color: isLight ? '#64748B' : '#94A3B8',
                letterSpacing: '0.6px',
                marginTop: 1,
              }}
            >
              PTIT_Aka · OMNICHANNEL IPAAS
            </div>
          </div>
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
      <Layout hasSider style={{ background: isLight ? '#F8FAFC' : '#0B0F19' }}>
        {/* Left Sidebar phong cách Base chuẩn */}
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={240}
          collapsedWidth={70}
          style={{
            background: isLight ? '#FFFFFF' : '#111827',
            borderRight: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
            position: 'sticky',
            top: 56,
            height: 'calc(100vh - 56px)',
            zIndex: 900,
          }}
          theme={isLight ? 'light' : 'dark'}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Menu điều hướng cuộn độc lập phía trên */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 0' }}>
              <Menu
                className="base-sidebar-menu"
                mode="inline"
                selectedKeys={[location.pathname]}
                openKeys={collapsed ? [] : openKeys}
                onOpenChange={(keys) => setOpenKeys(keys as string[])}
                items={menuItems}
                style={{
                  borderRight: 0,
                  background: 'transparent',
                }}
              />
            </div>

            {/* Khung Thông tin Hỗ trợ, Tư vấn & Liên hệ ghim sát chân đáy Sidebar */}
            <div
              style={{
                padding: collapsed ? '12px 6px' : '14px 16px',
                borderTop: isLight ? '1px solid #F1F5F9' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isLight ? '#F8FAFC' : '#0B0F19',
                transition: 'all 0.2s ease',
              }}
            >
              {!collapsed ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Tư vấn & Hỗ trợ
                  </div>

                  <div style={{ fontSize: 12, color: isLight ? '#334155' : '#CBD5E1', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PhoneOutlined style={{ color: '#10B981', fontSize: 12 }} />
                    <a href="tel:0945650883" style={{ color: '#059669', fontWeight: 600, textDecoration: 'none' }}>
                      0945 650 883
                    </a>
                  </div>

                  <div style={{ fontSize: 11.5, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <MailOutlined style={{ color: '#F59E0B', fontSize: 12, flexShrink: 0 }} />
                    <a href="mailto:tuannguyentien16@gmail.com" style={{ color: '#64748B', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      tuannguyentien16@gmail.com
                    </a>
                  </div>

                  {/* Nút nhận tư vấn dạng text link màu chuẩn thương hiệu */}
                  <div style={{ marginTop: 4 }}>
                    <span
                      onClick={() => setSupportModalOpen(true)}
                      style={{
                        color: '#ED1C24',
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'opacity 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      Nhận tư vấn giải pháp →
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title="Tư vấn & Hỗ trợ kỹ thuật (0945 650 883)" placement="right">
                    <Button
                      type="text"
                      size="small"
                      icon={<QuestionCircleOutlined style={{ fontSize: 16, color: '#ED1C24' }} />}
                      onClick={() => setSupportModalOpen(true)}
                      style={{ width: 34, height: 34, borderRadius: 6 }}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          </div>

          {/* Floating Circle Collapse/Expand Button (Được dịch xuống dưới cách đáy 24px) */}
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: 'absolute',
              right: -12,
              bottom: 24,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: isLight ? '#FFFFFF' : '#1F2937',
              border: isLight ? '1px solid #E5E7EB' : '1px solid #374151',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 1001,
              color: isLight ? '#4B5563' : '#D1D5DB',
              fontSize: 10,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            title={collapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
          >
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
          </div>
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

      {/* Modal Hỗ trợ & Nhận tư vấn giải pháp - Thiết kế chuẩn mực, cao cấp */}
      <Modal
        open={supportModalOpen}
        onCancel={() => setSupportModalOpen(false)}
        footer={null}
        width={600}
        centered
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/favicon.svg" alt="UniFlow" style={{ width: 28, height: 28 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: isLight ? '#111827' : '#F9FAFB', letterSpacing: '-0.2px' }}>
                Tư vấn Giải pháp & Hỗ trợ Kỹ thuật
              </div>
              <div style={{ fontSize: 11.5, color: isLight ? '#6B7280' : '#94A3B8', fontWeight: 500 }}>
                UniFlow Enterprise AI iPaaS · PTIT_Aka Team
              </div>
            </div>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
          {/* Slogan & Capabilities Banner */}
          <div
            style={{
              background: isLight ? 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)' : 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
              borderRadius: 10,
              border: isLight ? '1px solid #DBEAFE' : '1px solid rgba(59, 130, 246, 0.25)',
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: isLight ? '#2563EB' : '#60A5FA',
                  background: isLight ? '#DBEAFE' : 'rgba(59, 130, 246, 0.18)',
                  padding: '2px 8px',
                  borderRadius: 4,
                  letterSpacing: '0.04em',
                }}
              >
                TÔN CHỈ HỆ THỐNG
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: isLight ? '#1E293B' : '#F8FAFC' }}>
                Kết nối vô hình, vận hành thông minh
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: isLight ? '#475569' : '#CBD5E1', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
                <span>Tư vấn kiến trúc & tối ưu hóa quy trình tự động hóa 0-chạm đa sàn.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
                <span>Tích hợp phần mềm kế toán (MISA), ERP riêng & đa kho POS theo yêu cầu.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
                <span>Đấu thầu tự động & tối ưu cước vận chuyển (Viettel Post, GHTK, GHN).</span>
              </div>
            </div>
          </div>

          {/* Direct Contact Channels Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
            }}
          >
            {/* Hotline Card */}
            <div
              style={{
                background: isLight ? '#F0FDF4' : 'rgba(16, 185, 129, 0.08)',
                border: isLight ? '1px solid #BBF7D0' : '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 8,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: isLight ? '#DCFCE7' : 'rgba(16, 185, 129, 0.18)',
                  color: isLight ? '#16A34A' : '#34D399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                <PhoneOutlined />
              </div>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: isLight ? '#15803D' : '#34D399', textTransform: 'uppercase' }}>
                  Hotline / Zalo
                </div>
                <a
                  href="tel:0945650883"
                  style={{ fontSize: 14, fontWeight: 800, color: isLight ? '#166534' : '#6EE7B7', textDecoration: 'none' }}
                >
                  0945 650 883
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div
              style={{
                background: isLight ? '#FEF3C7' : 'rgba(245, 158, 11, 0.08)',
                border: isLight ? '1px solid #FDE68A' : '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 8,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: isLight ? '#FDE68A' : 'rgba(245, 158, 11, 0.18)',
                  color: isLight ? '#D97706' : '#FBBF24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                <MailOutlined />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: isLight ? '#B45309' : '#FBBF24', textTransform: 'uppercase' }}>
                  Email Hỗ Trợ
                </div>
                <a
                  href="mailto:tuannguyentien16@gmail.com"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: isLight ? '#92400E' : '#FDE68A',
                    textDecoration: 'none',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  tuannguyentien16@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Location & Team Banner */}
          <div
            style={{
              background: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.04)',
              borderRadius: 8,
              border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              color: isLight ? '#64748B' : '#94A3B8',
            }}
          >
            <span>🏢 <strong>Trụ sở R&D</strong>: Học viện Công nghệ Bưu chính Viễn thông</span>
            <Tag color="red" style={{ margin: 0, fontSize: 10.5, fontWeight: 700, borderRadius: 4 }}>
              PTIT_Aka
            </Tag>
          </div>

          {/* Centered Close Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <Button
              type="primary"
              size="small"
              onClick={() => setSupportModalOpen(false)}
              style={{
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 6,
                background: '#ED1C24',
                borderColor: '#ED1C24',
                boxShadow: '0 2px 8px rgba(237, 28, 36, 0.25)',
              }}
            >
              Đã hiểu & Đóng
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default MainLayout;
