import React from 'react';
import { Breadcrumb, Tabs, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { PageContainerProps } from './types';

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  icon,
  avatarBg = 'linear-gradient(135deg, rgba(237, 28, 36, 0.1) 0%, rgba(252, 194, 15, 0.1) 100%)',
  breadcrumbs,
  extra,
  tags,
  tabs,
  activeTabKey,
  onTabChange,
  children,
  style,
  contentStyle,
  loading = false,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, ...style }}>
      {/* 1. Horizontal Page Title Bar (Chuẩn G:\Base) */}
      {(title || breadcrumbs) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {/* Left Title + Breadcrumbs */}
          <div>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb
                style={{ marginBottom: 6, fontSize: 12 }}
                items={[
                  {
                    title: (
                      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <HomeOutlined /> Trang chủ
                      </Link>
                    ),
                  },
                  ...breadcrumbs.map((b) => ({
                    title: b.path ? <Link to={b.path}>{b.title}</Link> : b.title,
                  })),
                ]}
              />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {icon && (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: avatarBg,
                    border: '1px solid rgba(237, 28, 36, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    color: '#ed1c24',
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: 'var(--text-primary, #111827)',
                      letterSpacing: '-0.4px',
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {title}
                  </h1>
                  {tags}
                </div>

                {subtitle && (
                  <div
                    style={{
                      color: 'var(--text-secondary, #6B7280)',
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {subtitle}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Extra Actions */}
          {extra && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {extra}
            </div>
          )}
        </div>
      )}

      {/* Sub Tabs */}
      {tabs && tabs.length > 0 && (
        <div style={{ background: '#FFFFFF', padding: '0 16px', borderRadius: 8, border: '1px solid #E5E7EB' }}>
          <Tabs
            activeKey={activeTabKey}
            onChange={onTabChange}
            items={tabs.map((t) => ({ key: t.key, label: t.tab }))}
            style={{ marginBottom: -16 }}
          />
        </div>
      )}

      {/* 2. Main Page Content Body */}
      <div style={{ ...contentStyle }}>
        <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
          {children}
        </Skeleton>
      </div>
    </div>
  );
};

export default PageContainer;
