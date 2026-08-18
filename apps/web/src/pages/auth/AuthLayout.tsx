import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Tooltip } from 'antd';
import {
  ThunderboltOutlined,
  ApiOutlined,
  SafetyCertificateOutlined,
  SunOutlined,
  MoonOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useAppConfig } from '../../context/AppConfigContext';
import './Auth.less';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { themeMode, toggleTheme } = useAppConfig();
  const isDark = themeMode === 'dark';

  return (
    <div className="auth-page-wrapper" data-theme={themeMode}>
      {/* ── LEFT HERO BRAND PANEL ────────────────────────────────────────── */}
      <div className="auth-hero-panel">
        <div className="auth-bg-orb-1" />
        <div className="auth-bg-orb-2" />

        {/* Brand Header */}
        <div className="auth-hero-content">
          <Link to="/" className="auth-brand-header">
            <img src="/logo.svg" alt="UniFlow Logo" className="auth-logo-img" />
            <span className="auth-brand-title">
              Uni<span className="brand-flow">Flow</span>
              <span className="brand-ai">AI</span>
            </span>
          </Link>
        </div>

        {/* Hero Main Showcase */}
        <div className="auth-hero-main">
          <div className="auth-badge-pill">
            <span>OMNICHANNEL IPAAS & AI MIDDLEWARE</span>
          </div>

          <h1 className="auth-hero-title">
            Vận hành Đa kênh <span className="highlight-text">0-Chạm</span> với Trí tuệ Nhân tạo
          </h1>

          <p className="auth-hero-desc">
            Tự động hóa đồng bộ đơn hàng, đối soát tồn kho tức thời và định tuyến vận đơn thông minh
            giữa TikTok Shop, Shopee, Lazada, Tiki, Sapo, KiotViet và Logistics.
          </p>

          <div className="auth-feature-cards">
            <div className="auth-feat-item">
              <div className="feat-icon-box">
                <ThunderboltOutlined />
              </div>
              <div>
                <div className="feat-title">Tốc độ xử lý dưới 200ms</div>
                <div className="feat-sub">Idempotency Key 24h & Redis Cluster chống trùng đơn Flash Sale</div>
              </div>
            </div>

            <div className="auth-feat-item">
              <div className="feat-icon-box">
                <ApiOutlined />
              </div>
              <div>
                <div className="feat-title">Khớp SKU AI 98.5% chính xác</div>
                <div className="feat-sub">Hybrid Semantic Vector (Qdrant) kết hợp Gemini Flash NER</div>
              </div>
            </div>

            <div className="auth-feat-item">
              <div className="feat-icon-box">
                <SafetyCertificateOutlined />
              </div>
              <div>
                <div className="feat-title">Bảo mật chuẩn Enterprise</div>
                <div className="feat-sub">Mã hóa AES-256-GCM, phân quyền RBAC & Tenant Isolation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="auth-hero-footer">
          <div>© 2026 PTIT_Aka Team. Mọi quyền được bảo lưu.</div>
          <div>Phiên bản Enterprise v2.4.0</div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ─────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        <div className="auth-top-actions">
          <Tooltip title="Về trang chủ">
            <Link to="/">
              <Button type="text" shape="circle" icon={<HomeOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title={isDark ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}>
            <Button
              type="text"
              shape="circle"
              icon={isDark ? <SunOutlined style={{ color: '#FCC20F' }} /> : <MoonOutlined />}
              onClick={toggleTheme}
            />
          </Tooltip>
        </div>

        {children}
      </div>
    </div>
  );
};
export default AuthLayout;
