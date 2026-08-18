import React, { useState, useEffect } from 'react';
import {
  Button,
} from 'antd';
import {
  SunOutlined,
  MoonOutlined,
  ThunderboltFilled,
  SafetyCertificateFilled,
  ArrowRightOutlined,
  RocketFilled,
  CodeFilled,
  UserOutlined,
  ApiFilled,
  CopyOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
  ShoppingFilled,
  CarFilled,
  DatabaseFilled,
  VerticalAlignTopOutlined,
  GlobalOutlined,
  BranchesOutlined,
  FileTextOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  RobotOutlined,
  AimOutlined,
  NodeIndexOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  CloudServerOutlined,
  RiseOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { notify } from '../utils/notification';
import { useAppConfig } from '../context/AppConfigContext';
import './LandingPage.less';

export const LandingPage: React.FC = () => {
  const { themeMode, toggleTheme } = useAppConfig();
  const [emailSub, setEmailSub] = useState('');
  const [lang, setLang] = useState<'VN' | 'EN'>('VN');
  const [codeTab, setCodeTab] = useState<'udm' | 'curl' | 'webhook'>('udm');
  const [demoRunning, setDemoRunning] = useState(true);
  const [demoStep, setDemoStep] = useState(1);
  const [demoScenario, setDemoScenario] = useState<'TIKTOK_SAPO' | 'SHOPEE_KIOT' | 'HEALING'>('TIKTOK_SAPO');
  const [scrolled, setScrolled] = useState(false);

  // ── FAQ STATE ────────────────────────────────────────────────────────────
  const [faqCategory, setFaqCategory] = useState('Tất cả');
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(0);

  // ── AUTO-CYCLING DEV DOCS TABS ──────────────────────────────────────────
  const codeTabs: ('udm' | 'curl' | 'webhook')[] = ['udm', 'curl', 'webhook'];
  useEffect(() => {
    const tabTimer = setInterval(() => {
      setCodeTab((prev) => {
        const nextIdx = (codeTabs.indexOf(prev) + 1) % codeTabs.length;
        return codeTabs[nextIdx];
      });
    }, 4500);
    return () => clearInterval(tabTimer);
  }, []);

  // ── AUTO-CYCLING CARD SPOTLIGHT ANIMATIONS ────────────────────────────────
  const [spotlightMatrix, setSpotlightMatrix] = useState<number>(0);
  const [spotlightPillar, setSpotlightPillar] = useState<number>(0);

  // ── AUTO-CYCLING CONNECTORS CONVEYOR ─────────────────────────────────────
  const [conveyorCenter, setConveyorCenter] = useState<number>(1);

  useEffect(() => {
    const matrixTimer = setInterval(() => {
      setSpotlightMatrix((prev) => (prev + 1) % 5);
    }, 3200);
    const pillarTimer = setInterval(() => {
      setSpotlightPillar((prev) => (prev + 1) % 4);
    }, 3500);
    const conveyorTimer = setInterval(() => {
      setConveyorCenter((prev) => (prev + 1) % 10);
    }, 2500);
    return () => {
      clearInterval(matrixTimer);
      clearInterval(pillarTimer);
      clearInterval(conveyorTimer);
    };
  }, []);

  // ── DYNAMIC AUTHENTIC SLOGAN ROTATION ────────────────────────────────────
  const slogans = [
    { text: 'NỀN TẢNG OMNICHANNEL IPAAS & AI AGENT CHO THƯƠNG MẠI ĐIỆN TỬ', icon: <RocketFilled /> },
    { text: 'UNIFLOW - KẾT NỐI VÔ HÌNH, VẬN HÀNH THÔNG MINH', icon: <ThunderboltFilled /> },
    { text: 'UNIFLOW - SẢN PHẨM THUỘC ĐỘI NGŨ PTIT_Aka', icon: <ThunderboltFilled /> }
  ];
  const [sloganIndex, setSloganIndex] = useState(0);
  const [sloganFade, setSloganFade] = useState(true);

  useEffect(() => {
    const sloganTimer = setInterval(() => {
      setSloganFade(false);
      setTimeout(() => {
        setSloganIndex((prev) => (prev + 1) % slogans.length);
        setSloganFade(true);
      }, 300);
    }, 3800);
    return () => clearInterval(sloganTimer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!demoRunning) return;
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, [demoRunning]);

  const handleSubscribe = () => {
    if (!emailSub || !emailSub.includes('@')) {
      notify.warning('Vui lòng nhập địa chỉ email hợp lệ!');
      return;
    }
    notify.success('Cảm ơn bạn đã đăng ký nhận bản tin UniFlow AI! 🎉');
    setEmailSub('');
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    notify.success('Đã sao chép vào bộ nhớ tạm! 📋');
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // ── SAMPLES FOR CODE EXPLORER ──────────────────────────────────────────
  const udmCodeSample = `{
  "meta": {
    "traceId": "tr_9981240182",
    "tenantId": "tenant-aka-01",
    "sourcePlatform": "TIKTOK_SHOP",
    "ingestedAt": "2026-08-18T10:45:00.185Z"
  },
  "order": {
    "sourceOrderId": "TTS_88921045",
    "status": "PAID",
    "currency": "VND",
    "totals": { "grandTotal": 342000 },
    "items": [{
      "sourceSku": "TTS-POLO-BLK-L",
      "masterSku": "SAPO_POLO_01",
      "confidenceScore": 0.985
    }]
  }
}`;

  const curlSample = `curl -X POST https://api.uniflow.vn/api/v1/mappings/test-match \\
  -H "Authorization: Bearer <YOUR_API_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sourceSku": "TTS-POLO-BLK-L",
    "sourceName": "Áo Polo Nam Form Regular Đen Size L",
    "targetSku": "SAPO_POLO_01",
    "targetName": "Áo Polo Nam Cotton Compact Đen L"
  }'`;

  const webhookSignatureSample = `// Xác thực chữ ký Inbound Webhook HMAC-SHA256
import { createHmac } from 'crypto';

export function verifyTikTokWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const calculatedSig = hmac.digest('hex');
  return calculatedSig === signature;
}`;

  // ── SCENARIO DATA ──────────────────────────────────────────────────────
  const scenarios = {
    TIKTOK_SAPO: {
      source: 'Shopee',
      sourceIcon: <ShoppingFilled />,
      sourceSku: 'TTS-POLO-BLK-L',
      pos: 'Sapo POS',
      waybill: 'GHTK Express',
      waybillCode: '#GHTK_HN9982',
      logs: [
        { t: '00:00.000', msg: 'Xác thực Inbound Webhook (HMAC-SHA256 ✓)', color: '#4ADE80' },
        { t: '00:00.025', msg: 'Chuẩn hóa schema uniflow.order.v1 thành công', color: '#38BDF8' },
        { t: '00:00.082', msg: 'AI Vector Match → SAPO_POLO_01 (độ tin cậy: 0.985)', color: '#FCC20F' },
        { t: '00:00.142', msg: 'Trừ tồn kho Sapo POS thành công (Kho: WH_MAIN_HN)', color: '#FDE047' },
        { t: '00:00.185', msg: 'Đã tạo vận đơn GHTK #HN9982 — Khổ in A6 sẵn sàng ✓', color: '#4ADE80' },
      ],
    },
    SHOPEE_KIOT: {
      source: 'Shopee',
      sourceIcon: <ShoppingFilled />,
      sourceSku: 'SPE-DRESS-RED-M',
      pos: 'KiotViet',
      waybill: 'GHN Express',
      waybillCode: '#GHN_HCM0451',
      logs: [
        { t: '00:00.000', msg: 'Nhận Shopee Push v2 & xác thực HMAC ✓', color: '#4ADE80' },
        { t: '00:00.018', msg: 'Chuẩn hóa UDM — 3 sản phẩm, áp dụng mã giảm giá', color: '#38BDF8' },
        { t: '00:00.064', msg: 'AI NER trích xuất: Đầm Đỏ Size M → KVT_DRESS_01', color: '#FCC20F' },
        { t: '00:00.110', msg: 'Cập nhật tồn kho đa chi nhánh KiotViet', color: '#FDE047' },
        { t: '00:00.148', msg: 'Đã tạo vận đơn GHN #HCM0451 — Sẵn sàng in ✓', color: '#4ADE80' },
      ],
    },
    HEALING: {
      source: 'Lazada',
      sourceIcon: <ShoppingFilled />,
      sourceSku: 'LAZ-JACKET-BLU-XL',
      pos: 'Sapo POS',
      waybill: 'Viettel Post (Đổi hãng)',
      waybillCode: '#VTP_DN7723',
      logs: [
        { t: '00:00.000', msg: 'Nhận Webhook Lazada — Xác thực HMAC ✓', color: '#4ADE80' },
        { t: '00:00.031', msg: 'Chuyển đổi dữ liệu sang uniflow.order.v1', color: '#38BDF8' },
        { t: '00:00.091', msg: 'AI Match → SAPO_JACKET_02 (độ tin cậy: 0.951)', color: '#FCC20F' },
        { t: '00:00.155', msg: 'GHTK API quá hạn 504 — Kích hoạt tự chữa lành!', color: '#F87171' },
        { t: '00:00.198', msg: 'Chuyển hãng → Viettel Post #DN7723 — Phục hồi ✓', color: '#4ADE80' },
      ],
    },
  };

  const sc = scenarios[demoScenario];

  const connectors = [
    { name: 'TikTok Shop', abbr: 'TT', desc: 'Inbound Webhook & Order API', bg: '#010101', text: '#FFFFFF' },
    { name: 'Shopee', abbr: 'SP', desc: 'Open Platform Push v2 SLA', bg: '#EE4D2D', text: '#FFFFFF' },
    { name: 'Lazada', abbr: 'LZ', desc: 'Đồng bộ đơn & kho Realtime', bg: '#0F146D', text: '#FFFFFF' },
    { name: 'Tiki', abbr: 'TK', desc: 'Marketplace Connector Open API', bg: '#189EFF', text: '#FFFFFF' },
    { name: 'Sapo POS', abbr: 'SA', desc: 'Trừ tồn kho tức thời Live Sync', bg: '#0088FF', text: '#FFFFFF' },
    { name: 'KiotViet', abbr: 'KV', desc: 'Đa chi nhánh & Master SKU', bg: '#004F9E', text: '#FFFFFF' },
    { name: 'Haravan', abbr: 'HR', desc: 'Omnichannel Retail & E-com', bg: '#E02329', text: '#FFFFFF' },
    { name: 'GHTK', abbr: 'GK', desc: 'Vận đơn A6 tự động API v2', bg: '#005D38', text: '#FFFFFF' },
    { name: 'GHN', abbr: 'GN', desc: 'Định tuyến thông minh SLA', bg: '#EA5400', text: '#FFFFFF' },
    { name: 'Viettel Post', abbr: 'VP', desc: 'Vận chuyển phủ sóng toàn quốc', bg: '#ED1C24', text: '#FFFFFF' },
  ];

  const isDark = themeMode === 'dark';

  return (
    <div className="landing-page-root">

      {/* ══════════════════════════════════════════════════════════════════
          1. FIRST FOLD: MODERN HEADER + 100VH HERO CONTAINER
      ══════════════════════════════════════════════════════════════════ */}
      <div className="lp-first-fold">
        {/* Sleek Top Navbar */}
        <header className={`lp-navbar ${scrolled ? 'scrolled' : ''}`}>
          <div className="brand-logo" onClick={scrollToTop}>
            <img src="/logo.svg" alt="UniFlow AI" style={{ height: 34, width: 'auto' }} />
            <div>
              <div className="brand-title">
                <span>Uni</span>
                <span style={{ color: '#ed1c24' }}>Flow</span>
                <span style={{ color: '#D86A04' }}> AI</span>
              </div>
              <div className="brand-sub">PTIT_Aka · OMNICHANNEL IPAAS</div>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#" className="active">Trang chủ</a>
            <a href="#demo">Mô phỏng</a>
            <a href="#pipeline">Quy trình</a>
            <a href="#features">Tính năng cốt lõi</a>
            <a href="#docs">Tài liệu API</a>
            <Link to="/workflows">Canvas</Link>
            <Link to="/connectors">Kết nối</Link>
          </nav>

          <div className="nav-controls">
            {/* Language switch */}
            <div className="lang-pill" onClick={() => setLang(lang === 'VN' ? 'EN' : 'VN')}>
              <GlobalOutlined style={{ fontSize: 13, color: '#ed1c24' }} />
              <span>{lang === 'VN' ? 'VN' : 'EN'}</span>
            </div>

            {/* Theme toggle */}
            <button className="theme-btn" onClick={toggleTheme} title="Chuyển đổi giao diện Sáng / Tối">
              {isDark ? <SunOutlined style={{ fontSize: 14 }} /> : <MoonOutlined style={{ fontSize: 14 }} />}
            </button>

            {/* Dashboard action button */}
            <Link to="/dashboard">
              <button className="btn-dashboard">
                <UserOutlined style={{ marginRight: 6 }} />
                Vào Dashboard
              </button>
            </Link>
          </div>
        </header>

        {/* Hero Content Section */}
        <section className="lp-hero">
          <div className="hero-badge">
            <span className="badge-icon">
              {slogans[sloganIndex].icon}
            </span>
            <span
              className="badge-text"
              style={{
                opacity: sloganFade ? 1 : 0,
                transform: sloganFade ? 'translateY(0)' : 'translateY(-3px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'inline-block',
              }}
            >
              {slogans[sloganIndex].text}
            </span>
          </div>

          <h1 className="hero-title">
            Tự động hóa vận hành <span className="text-brand-primary">eCommerce</span><br />
            <span className="highlight-gradient">0-CHẠM ĐA KÊNH</span> với AI
          </h1>

          <p className="hero-subtitle">
            Đồng bộ đơn hàng thời gian thực, triệt tiêu bán âm với Universal Data Model & Redis Idempotency 24h, tự động khớp SKU sàn và kho POS bằng AI Vector Cosine, tự chữa lành sự cố vận chuyển trong <strong>dưới 200ms</strong>.
          </p>

          <div className="hero-actions">
            <Link to="/dashboard">
              <button className="btn-primary-hero anim-glow-btn">
                Khám phá Live Engine <ArrowRightOutlined />
              </button>
            </Link>
            <a href="#demo">
              <button className="btn-secondary-hero">
                <PlayCircleFilled style={{ color: '#ed1c24' }} /> Xem demo trực tiếp
              </button>
            </a>
          </div>

          {/* Metric Stats Ribbon */}
          <div className="hero-stats-ribbon">
            <div className="stat-item">
              <div className="stat-value" style={{ color: '#ed1c24' }}>&lt; 200ms</div>
              <div className="stat-label">Độ trễ P99 SLA</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value" style={{ color: '#ed1c24' }}>99.98%</div>
              <div className="stat-label">Đơn hàng thành công</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value" style={{ color: '#D86A04' }}>98.5%</div>
              <div className="stat-label">Khớp SKU tự động</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-value" style={{ color: '#ed1c24' }}>0-CHẠM</div>
              <div className="stat-label">Không thao tác thủ công</div>
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          2. LIVE WORKFLOW SIMULATION DEMO CONSOLE
      ══════════════════════════════════════════════════════════════════ */}
      <section id="demo" className="lp-section bg-alt">
        <div className="section-header">
          <div className="section-badge">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ed1c24', display: 'inline-block' }} />
            MÔ PHỎNG THỜI GIAN THỰC
          </div>
          <h2 className="section-title">Mô phỏng quy trình 0-chạm tự động</h2>
          <p className="section-desc">
            Quan sát toàn bộ vòng đời đơn hàng: Inbound Webhook ➔ AI Matching ➔ Trừ tồn kho POS ➔ Tạo vận đơn trong 185ms
          </p>
        </div>

        <div className="lp-demo-console">
          {/* Scenario Chips Switcher */}
          <div className="scenario-chips">
            <button
              onClick={() => { setDemoScenario('TIKTOK_SAPO'); setDemoStep(1); }}
              className={`chip-btn ${demoScenario === 'TIKTOK_SAPO' ? 'active-red' : ''}`}
            >
              TikTok Shop ➔ Sapo POS ➔ GHTK
            </button>
            <button
              onClick={() => { setDemoScenario('SHOPEE_KIOT'); setDemoStep(1); }}
              className={`chip-btn ${demoScenario === 'SHOPEE_KIOT' ? 'active-red' : ''}`}
            >
              Shopee ➔ KiotViet ➔ GHN
            </button>
            <button
              onClick={() => { setDemoScenario('HEALING'); setDemoStep(1); }}
              className={`chip-btn ${demoScenario === 'HEALING' ? 'active-red' : ''}`}
            >
              AI tự chữa lành (Reroute 504)
            </button>
            <button
              onClick={() => setDemoRunning(!demoRunning)}
              className="control-btn"
            >
              {demoRunning ? <PauseCircleFilled /> : <PlayCircleFilled style={{ color: '#ed1c24' }} />}
              {demoRunning ? 'Tạm dừng' : 'Chạy tiếp'}
            </button>
          </div>

          {/* Authentic 16:9 Pro Studio Window */}
          <div className="pro-studio-window">
            {/* Window Chrome Titlebar */}
            <div className="window-titlebar">
              <div className="traffic-lights">
                <span style={{ background: '#EF4444' }} />
                <span style={{ background: '#F59E0B' }} />
                <span style={{ background: '#10B981' }} />
              </div>

              <div className="window-title-tab">
                <BranchesOutlined style={{ color: '#ed1c24' }} />
                <span>uniflow-studio › workflows › <strong>omnichannel_sync.flow</strong></span>
              </div>

              <div className="window-actions">
                <span className="live-badge">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                  LIVE ENGINE
                </span>
              </div>
            </div>

            {/* Studio Toolbar */}
            <div className="studio-toolbar">
              <div className="tool-group">
                <button
                  className="tool-btn primary"
                  onClick={() => setDemoRunning(!demoRunning)}
                >
                  {demoRunning ? <PauseCircleFilled /> : <PlayCircleFilled />}
                  {demoRunning ? 'Tạm dừng' : 'Chạy mô phỏng'}
                </button>
                <div className="tool-btn">
                  <ThunderboltFilled style={{ color: '#FCC20F' }} />
                  <span>Sự kiện Webhook</span>
                </div>
                <div className="tool-btn">
                  <span>＋ Thêm node</span>
                </div>
              </div>

              <div className="tool-info">
                <span>Cụm máy chủ: <strong style={{ color: '#ed1c24' }}>VN-HN-01 (Hoạt động)</strong></span>
                <span>Idempotency: <strong style={{ color: '#D86A04' }}>Redis 24h ✓</strong></span>
              </div>
            </div>

            {/* Studio 3-Column Workspace */}
            <div className="studio-body">
              {/* 1. Left Node Palette */}
              <div className="studio-palette">
                <div className="palette-header">Thư viện Node</div>

                <div className="palette-item">
                  <span className="item-dot" style={{ background: '#ed1c24' }} />
                  <span>Inbound Trigger</span>
                </div>
                <div className="palette-item">
                  <span className="item-dot" style={{ background: '#D86A04' }} />
                  <span>AI Hybrid SKU</span>
                </div>
                <div className="palette-item">
                  <span className="item-dot" style={{ background: '#ed1c24' }} />
                  <span>Trừ tồn kho POS</span>
                </div>
                <div className="palette-item">
                  <span className="item-dot" style={{ background: '#D86A04' }} />
                  <span>Vận đơn thông minh</span>
                </div>
                <div className="palette-item">
                  <span className="item-dot" style={{ background: '#ed1c24' }} />
                  <span>Tự chữa lành sự cố</span>
                </div>
              </div>

              {/* 2. Center Main Flow Canvas */}
              <div className="studio-canvas-stage">
                <div className="nodes-layer">
                  {/* Node 1: TriggerNode */}
                  {(() => {
                    const active = demoStep === 1;
                    const done = demoStep > 1;
                    const nodeColor = '#ed1c24';
                    return (
                      <div style={{
                        position: 'relative',
                        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                        transform: active ? 'scale(1.06)' : 'scale(1)',
                      }}>
                        <div
                          className={active ? 'node-active-red' : ''}
                          style={{
                            padding: '12px 18px',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                            borderRadius: 16,
                            border: `2px solid ${done || active ? nodeColor : '#334155'}`,
                            display: 'flex', alignItems: 'center', gap: 12,
                            minWidth: 180,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                          }}
                        >
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${nodeColor} 0%, #D86A04 100%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#FFFFFF', fontSize: 17, flexShrink: 0,
                          }}>
                            <ShoppingFilled />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 13.5, lineHeight: 1.2, color: isDark ? '#F8FAFC' : '#0F172A' }}>{sc.source}</div>
                            <div style={{ fontSize: 11, marginTop: 3, color: done ? '#10B981' : '#94A3B8', fontWeight: done ? 700 : 500 }}>
                              {done ? 'HMAC Verified ✓' : 'Webhook Inbound'}
                            </div>
                          </div>
                        </div>

                        {/* Right Output Socket */}
                        <div style={{
                          position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
                          width: 12, height: 12, borderRadius: '50%',
                          background: done || active ? nodeColor : '#475569',
                          border: '2px solid #0B0F19',
                        }} />
                      </div>
                    );
                  })()}

                  {/* Flowing Connector 1 */}
                  <div style={{ display: 'flex', alignItems: 'center', width: 44, flexShrink: 0 }}>
                    <div style={{ flex: 1, height: 2, background: demoStep >= 2 ? 'linear-gradient(to right, #ed1c24, #D86A04)' : '#334155', transition: 'all 0.4s' }} />
                    <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `6px solid ${demoStep >= 2 ? '#D86A04' : '#334155'}` }} />
                  </div>

                  {/* Node 2: AINode */}
                  {(() => {
                    const active = demoStep === 2;
                    const done = demoStep > 2;
                    return (
                      <div style={{
                        position: 'relative',
                        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                        transform: active ? 'scale(1.06)' : 'scale(1)',
                      }}>
                        {/* Left Input Socket */}
                        <div style={{
                          position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)',
                          width: 12, height: 12, borderRadius: '50%',
                          background: done || active ? '#D86A04' : '#475569',
                          border: '2px solid #0B0F19',
                        }} />

                        <div
                          className={active ? 'node-active-gold' : ''}
                          style={{
                            padding: '12px 18px',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                            borderRadius: 16,
                            border: `2px solid ${done || active ? '#D86A04' : '#334155'}`,
                            display: 'flex', alignItems: 'center', gap: 12,
                            minWidth: 195,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                          }}
                        >
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #D86A04 0%, #FCC20F 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#FFFFFF', fontSize: 17, flexShrink: 0,
                          }}>
                            <RocketFilled />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 13.5, lineHeight: 1.2, color: isDark ? '#F8FAFC' : '#0F172A' }}>AI Hybrid Match</div>
                            <div style={{ fontSize: 11, marginTop: 3, color: done ? '#10B981' : active ? '#D86A04' : '#94A3B8', fontWeight: done ? 700 : 500 }}>
                              {done ? '98.5% Khớp SKU ✓' : 'Qdrant + NER'}
                            </div>
                          </div>
                        </div>

                        {/* Right Output Sockets */}
                        <div style={{
                          position: 'absolute', right: -6, top: '35%', transform: 'translateY(-50%)',
                          width: 10, height: 10, borderRadius: '50%',
                          background: done || active ? '#ed1c24' : '#475569',
                          border: '2px solid #0B0F19',
                        }} />
                        <div style={{
                          position: 'absolute', right: -6, top: '65%', transform: 'translateY(-50%)',
                          width: 10, height: 10, borderRadius: '50%',
                          background: done || active ? '#D86A04' : '#475569',
                          border: '2px solid #0B0F19',
                        }} />
                      </div>
                    );
                  })()}

                  {/* Flowing Connector 2 (Branching) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: 44 }}>
                      <div style={{ flex: 1, height: 2, background: demoStep >= 3 ? '#ed1c24' : '#334155' }} />
                      <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `6px solid ${demoStep >= 3 ? '#ed1c24' : '#334155'}` }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', width: 44 }}>
                      <div style={{ flex: 1, height: 2, background: demoStep >= 4 ? '#D86A04' : '#334155' }} />
                      <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `6px solid ${demoStep >= 4 ? '#D86A04' : '#334155'}` }} />
                    </div>
                  </div>

                  {/* Nodes 3 & 4 (Stacked Actions) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
                    {/* Node 3: POS Deduct */}
                    {(() => {
                      const active = demoStep === 3;
                      const done = demoStep > 3;
                      return (
                        <div style={{ position: 'relative' }}>
                          {/* Left Input Socket */}
                          <div style={{
                            position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)',
                            width: 10, height: 10, borderRadius: '50%',
                            background: done || active ? '#ed1c24' : '#475569',
                            border: '2px solid #0B0F19',
                          }} />

                          <div className={active ? 'node-active-red' : ''} style={{
                            padding: '10px 16px',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                            borderRadius: 14,
                            border: `2px solid ${done || active ? '#ed1c24' : '#334155'}`,
                            display: 'flex', alignItems: 'center', gap: 10,
                            minWidth: 180,
                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                          }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'linear-gradient(135deg, #ed1c24 0%, #C4001A 100%)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#FFFFFF', fontSize: 15,
                            }}>
                              <DatabaseFilled />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: 13, color: isDark ? '#F8FAFC' : '#0F172A' }}>Trừ kho {sc.pos}</div>
                              <div style={{ fontSize: 10.5, color: done ? '#10B981' : '#94A3B8', fontWeight: done ? 700 : 400 }}>
                                {done ? 'ERP Deduct ✓' : 'Đồng bộ trực tiếp'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Node 4: Logistics */}
                    {(() => {
                      const active = demoStep === 4 || demoStep === 5;
                      const done = demoStep >= 5;
                      const isHealing = demoScenario === 'HEALING';
                      const nodeColor = isHealing && demoStep === 4 ? '#EF4444' : '#D86A04';
                      return (
                        <div style={{ position: 'relative' }}>
                          {/* Left Input Socket */}
                          <div style={{
                            position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)',
                            width: 10, height: 10, borderRadius: '50%',
                            background: done || active ? nodeColor : '#475569',
                            border: '2px solid #0B0F19',
                          }} />

                          <div className={active ? 'node-active-gold' : ''} style={{
                            padding: '10px 16px',
                            background: isDark ? '#1F2937' : '#FFFFFF',
                            borderRadius: 14,
                            border: `2px solid ${done || active ? nodeColor : '#334155'}`,
                            display: 'flex', alignItems: 'center', gap: 10,
                            minWidth: 180,
                            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                          }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: isHealing && demoStep === 4
                                ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                                : 'linear-gradient(135deg, #D86A04 0%, #FCC20F 100%)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#FFFFFF', fontSize: 15,
                            }}>
                              <CarFilled />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: 13, color: isDark ? '#F8FAFC' : '#0F172A' }}>
                                {isHealing && demoStep === 4 ? 'GHTK 504 ➔ Đổi hãng' : sc.waybill}
                              </div>
                              <div style={{ fontSize: 10.5, color: done ? '#10B981' : '#94A3B8', fontWeight: done ? 700 : 400 }}>
                                {done ? `${sc.waybillCode} ✓` : 'Tạo vận đơn'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Floating Canvas Controls */}
                <div className="floating-controls">
                  <button title="Phóng to">+</button>
                  <button title="Thu nhỏ">-</button>
                  <button title="Toàn màn hình">⛶</button>
                </div>

                {/* Floating MiniMap */}
                <div className="floating-minimap">
                  <div className="map-view-box" />
                </div>
              </div>

              {/* 3. Right Live Event Inspector & Terminal */}
              <div className="studio-inspector">
                <div>
                  <div className="inspector-header">
                    <span>Nhật ký luồng sự kiện</span>
                    <span style={{ color: '#10B981', fontSize: 10 }}>200 OK</span>
                  </div>

                  <div className="inspector-logs">
                    {sc.logs.map((log, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 8,
                        opacity: demoStep >= i + 1 ? 1 : 0.2,
                        transition: 'opacity 0.3s ease',
                      }}>
                        <span style={{ color: '#64748B', flexShrink: 0 }}>[{log.t}]</span>
                        <span style={{ color: demoStep >= i + 1 ? log.color : '#475569' }}>{log.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="inspector-footer">
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B' }}>Độ trễ P99 SLA</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#10B981', letterSpacing: '-0.5px' }}>
                      185ms
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>
                    Tenant: <strong style={{ color: '#F8FAFB' }}>PTIT_Aka</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. PROBLEM-SOLUTION BENTO MATRIX (GIẢI QUYẾT NỖI ĐAU VẬN HÀNH)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="lp-section lp-section-matrix">
        <div className="section-header">
          <div className="section-badge">
            GIẢI PHÁP VẬN HÀNH TMĐT
          </div>
          <h2 className="section-title">Giải quyết triệt để bài toán tăng trưởng đa kênh</h2>
          <p className="section-desc">
            Xóa bỏ rào cản phân mảnh dữ liệu, giải phóng đội ngũ vận hành khỏi các thao tác thủ công dễ sai sót.
          </p>
        </div>

        <div className="lp-matrix-container">
          {/* Top Row: 3 Cards */}
          <div className="matrix-row-top">
            {[
              {
                category: 'THÂM NHẬP',
                icon: <DatabaseFilled style={{ color: '#D86A04' }} />,
                title: 'Chưa chắc kết nối sàn TMĐT có an toàn và ổn định không.',
                bullets: [
                  'Nguy cơ rò rỉ dữ liệu hoặc lộ Access Token bí mật khi tích hợp API với các sàn.',
                  'Cần cấu hình thủ công từng Webhook sàn phức tạp, dễ bị gián đoạn đường truyền.',
                ],
                actions: ['Xác thực HMAC-SHA256', 'Mã hóa AES-256 Token', 'Bảo mật Webhook'],
              },
              {
                category: 'CHUẨN HÓA',
                icon: <RocketFilled style={{ color: '#D86A04' }} />,
                title: 'Mỗi sàn một kiểu dữ liệu, mã SKU phân mảnh và map tay sai sót.',
                bullets: [
                  'Tên sản phẩm, màu sắc, size S/M/L trên sàn khác hoàn toàn mã lưu kho POS.',
                  'Nhân viên phải đối soát và ghép mã thủ công, dễ nhầm đơn và tăng tỷ lệ hoàn hàng.',
                ],
                actions: ['Universal Data Model', 'AI Vector Cosine 1536d', 'Gemini NER Parser'],
              },
              {
                category: 'TĂNG TRƯỞNG',
                icon: <ThunderboltFilled style={{ color: '#D86A04' }} />,
                title: 'Đơn hàng tăng vọt giờ cao điểm nhưng hệ thống xử lý chậm trễ.',
                bullets: [
                  'Webhook dồn dập trong Flash Sale làm máy chủ POS/ERP bị nghẽn và quá tải.',
                  'Trễ hạn SLA xác nhận đơn hàng dẫn đến gian hàng bị sàn TMĐT đánh gậy phạt.',
                ],
                actions: ['Hàng đợi bất đồng bộ', 'Độ trễ P99 < 200ms', 'SLA Uptime 99.98%'],
              },
            ].map((item, idx) => (
              <div key={idx} className={`matrix-bento-card ${spotlightMatrix === idx ? 'auto-spotlight' : ''}`}>
                <div className="matrix-category">
                  {item.icon}
                  <span>{item.category}</span>
                </div>
                <h3 className="matrix-title">{item.title}</h3>
                <ul className="matrix-bullets">
                  {item.bullets.map((b, bIdx) => (
                    <li key={bIdx}>
                      <span className="bullet-arrow">➔</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="matrix-actions">
                  {item.actions.map((act, aIdx) => (
                    <span key={aIdx} className="matrix-chip">
                      {act} →
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row: 2 Cards (Centered) */}
          <div className="matrix-row-bottom">
            {[
              {
                category: 'MỞ RỘNG',
                icon: <ApiFilled style={{ color: '#D86A04' }} />,
                title: 'Nhiều gian hàng, nhiều chi nhánh kho — quản trị phân tán.',
                bullets: [
                  'Đơn hàng phát sinh đồng thời trên TikTok & Shopee gây nguy cơ bán âm kho.',
                  'Tốn nhiều thời gian và chi phí nếu phải mở rộng thêm đội ngũ vận hành nội bộ.',
                ],
                actions: ['Redis Idempotency 24h', 'Khóa tồn kho Real-time', 'Đồng bộ Sapo & KiotViet'],
              },
              {
                category: 'BẢO VỆ',
                icon: <SafetyCertificateFilled style={{ color: '#D86A04' }} />,
                title: 'Đang vận hành trơn tru nhưng bị kẹt đơn do sự cố hãng vận chuyển.',
                bullets: [
                  'API đơn vị vận chuyển gặp lỗi 504 khiến hàng loạt đơn bị ứ đọng tại kho.',
                  'Nhân viên phải phát hiện và chuyển đổi hãng vận chuyển thủ công từng đơn.',
                ],
                actions: ['AI Self-Healing 504', 'Tự động đổi hãng dự phòng', 'In nhãn A6 tức thời'],
              },
            ].map((item, idx) => (
              <div key={idx} className={`matrix-bento-card ${spotlightMatrix === idx + 3 ? 'auto-spotlight' : ''}`}>
                <div className="matrix-category">
                  {item.icon}
                  <span>{item.category}</span>
                </div>
                <h3 className="matrix-title">{item.title}</h3>
                <ul className="matrix-bullets">
                  {item.bullets.map((b, bIdx) => (
                    <li key={bIdx}>
                      <span className="bullet-arrow">➔</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="matrix-actions">
                  {item.actions.map((act, aIdx) => (
                    <span key={aIdx} className="matrix-chip">
                      {act} →
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. ARCHITECTURE PIPELINE: 5-STEP STREAM (1 HORIZONTAL ROW)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="pipeline" className="lp-section lp-section-pipeline-dark">
        <div className="section-header">
          <div className="section-badge">QUY TRÌNH 0-CHẠM</div>
          <h2 className="section-title">Hành trình xử lý đơn hàng đa kênh tốc độ cao</h2>
          <p className="section-desc">
            Từ khi khách đặt hàng trên TikTok Shop / Shopee tới lúc in nhãn vận đơn tại kho POS — hoàn toàn tự động khép kín.
          </p>
        </div>

        <div className="pipeline-single-row-grid">
          {[
            { step: '01', icon: <ThunderboltFilled />, title: 'Sàn TMĐT nguồn', desc: 'Nhận Inbound Webhook từ TikTok Shop / Shopee / Lazada khi đơn thanh toán thành công.', tag: 'HMAC-SHA256' },
            { step: '02', icon: <CodeFilled />, title: 'Chuẩn hóa UDM', desc: 'Chuyển JSON đa nền tảng về schema uniflow.order.v1 trong 25ms, xóa bỏ chênh lệch API.', tag: 'UNIVERSAL DATA MODEL' },
            { step: '03', icon: <RocketFilled />, title: 'AI Hybrid SKU Match', desc: 'Truy vấn vector Qdrant kết hợp Gemini NER, tự động khớp Master SKU với độ chính xác >98.5%.', tag: 'AI VECTOR + NER' },
            { step: '04', icon: <ApiFilled />, title: 'Trừ tồn kho POS', desc: 'Tự động trừ kho trực tiếp trên Sapo POS / KiotViet, chặn đứng triệt để tình trạng bán âm.', tag: 'LIVE STOCK DEDUCT' },
            { step: '05', icon: <SafetyCertificateFilled />, title: 'Vận đơn & tự chữa lành', desc: 'Đẩy đơn sang GHTK/GHN, tự đổi hãng dự phòng khi gặp sự cố mạng 504.', tag: 'SMART REROUTING' },
          ].map((item, idx) => (
            <div key={item.step} className={`bento-card ${demoStep === idx + 1 ? 'active-step' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span className="card-step">{item.step}</span>
                <div className="card-icon-badge">
                  {item.icon}
                </div>
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.desc}</p>
              <div className="card-tag">
                {item.tag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. 4 CORE TECHNOLOGY PILLARS
      ══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="lp-section bg-alt">
        <div className="section-header">
          <div className="section-badge">CÔNG NGHỆ CỐT LÕI</div>
          <h2 className="section-title">4 trụ cột nền tảng của UniFlow AI</h2>
          <p className="section-desc">
            Được thiết kế chuyên biệt cho nhà bán hàng và thương hiệu TMĐT lớn tại Việt Nam để chịu tải Mega Sale.
          </p>
        </div>

        <div className="lp-grid-cards">
          {[
            { icon: <ThunderboltFilled />, title: 'Inbound Webhook 0-chạm', desc: 'Xác thực HMAC-SHA256 chuẩn SLA TikTok Shop, Shopee & Lazada. Chống trùng lặp Idempotency Key 24h qua Redis Cluster.' },
            { icon: <CodeFilled />, title: 'Universal Data Model', desc: 'Rút gọn N×N kết nối thành N+N. Chuẩn hóa mọi payload về uniflow.order.v1 dùng chung cho toàn bộ hệ sinh thái.' },
            { icon: <RocketFilled />, title: 'AI Hybrid SKU Mapper', desc: 'Kết hợp Vector Embedding Qdrant 1536 chiều và Gemini 1.5 Flash NER trích xuất màu sắc, size, chất liệu đạt >98.5%.' },
            { icon: <SafetyCertificateFilled />, title: 'AI tự chữa lành & đổi tuyến', desc: 'Tự phát hiện lỗi timeout ĐVVC, chẩn đoán nguyên nhân gốc và tự đổi sang hãng dự phòng tối ưu chi phí.' },
          ].map((item, idx) => (
            <div key={item.title} className={`bento-card ${spotlightPillar === idx ? 'auto-spotlight' : ''}`}>
              <div className="card-icon-badge">
                {item.icon}
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. DEVELOPER DOCS & CODE EXPLORER
      ══════════════════════════════════════════════════════════════════ */}
      <section id="docs" className="lp-section">
        <div className="section-header">
          <div className="section-badge">DÀNH CHO NHÀ PHÁT TRIỂN</div>
          <h2 className="section-title">Tài liệu kỹ thuật & OpenAPI v3</h2>
          <p className="section-desc">
            Tích hợp nhanh chóng qua RESTful API, WebSocket Events và TypeScript SDK chuẩn enterprise.
          </p>
        </div>

        <div className="lp-docs-box">
          <div className="docs-topbar">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => setCodeTab('udm')}
                className={`tab-btn ${codeTab === 'udm' ? 'active' : ''}`}
              >
                UDM Schema (JSON)
              </button>
              <button
                onClick={() => setCodeTab('curl')}
                className={`tab-btn ${codeTab === 'curl' ? 'active' : ''}`}
              >
                AI Match API (cURL)
              </button>
              <button
                onClick={() => setCodeTab('webhook')}
                className={`tab-btn ${codeTab === 'webhook' ? 'active' : ''}`}
              >
                Xác thực HMAC (TypeScript)
              </button>
            </div>

            <div className="docs-actions-right">
              <button
                className="btn-openapi-detail"
                onClick={() => notify.info('Cổng tài liệu OpenAPI Swagger UI chi tiết đang được hoàn thiện và tích hợp phiên bản tiếp theo!')}
              >
                <FileTextOutlined /> Xem chi tiết OpenAPI v3 <ArrowRightOutlined />
              </button>
              <button
                onClick={() => copyCode(codeTab === 'udm' ? udmCodeSample : codeTab === 'curl' ? curlSample : webhookSignatureSample)}
                className="copy-btn"
              >
                <CopyOutlined /> Sao chép
              </button>
            </div>
          </div>
          <pre>
            {codeTab === 'udm' ? udmCodeSample : codeTab === 'curl' ? curlSample : webhookSignatureSample}
          </pre>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          6. INTEGRATED CONNECTORS ECOSYSTEM (CONVEYOR BELT)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="lp-section bg-alt lp-connectors-section">
        <div className="section-header">
          <div className="section-badge">KẾT NỐI SẴN CÓ</div>
          <h2 className="section-title">Hệ sinh thái tích hợp sẵn có</h2>
          <p className="section-desc">
            10 đối tác thương mại điện tử, POS và đơn vị vận chuyển hàng đầu Việt Nam — sẵn sàng kết nối tức thời.
          </p>
        </div>

        <div className="lp-conveyor-wrapper">
          <button 
            className="conveyor-nav-btn prev"
            onClick={() => setConveyorCenter((prev) => (prev - 1 + connectors.length) % connectors.length)}
            aria-label="Previous connector"
          >
            ←
          </button>

          <div className="lp-conveyor-track">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const itemIdx = (conveyorCenter + offset + connectors.length) % connectors.length;
              const c = connectors[itemIdx];
              const isCenter = offset === 0;
              return (
                <div
                  key={`${c.name}-${offset}`}
                  onClick={() => setConveyorCenter(itemIdx)}
                  className={`conveyor-card offset-${offset} ${isCenter ? 'is-center-active' : ''}`}
                >
                  <div className="conveyor-badge-icon" style={{ background: c.bg, color: c.text }}>
                    {c.abbr}
                  </div>
                  <div className="conveyor-name">{c.name}</div>
                  <div className="conveyor-desc">{c.desc}</div>
                  {isCenter && (
                    <div className="conveyor-active-pill">
                      <span>✓ ĐANG KẾT NỐI REAL-TIME</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button 
            className="conveyor-nav-btn next"
            onClick={() => setConveyorCenter((prev) => (prev + 1) % connectors.length)}
            aria-label="Next connector"
          >
            →
          </button>
        </div>

        {/* Carousel Indicators Dots */}
        <div className="conveyor-dots">
          {connectors.map((c, idx) => (
            <button
              key={c.name}
              className={`dot ${idx === conveyorCenter ? 'active' : ''}`}
              onClick={() => setConveyorCenter(idx)}
              title={c.name}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          7. FAQ & RELIABILITY — PREMIUM SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="lp-faq-section">
        <div className="lp-section" style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div className="section-header">
            <div className="section-badge"><SafetyCertificateOutlined /> CÂU HỎI THƯỜNG GẶP</div>
            <h2 className="section-title">Mọi điều bạn muốn biết</h2>
            <p className="section-desc">Giải đáp nhanh về tích hợp, AI, bảo mật và hiệu năng của UniFlow.</p>
          </div>

          {/* Category Tab Filter */}
          {(() => {
            const faqCategories: { key: string; label: string; icon: React.ReactNode }[] = [
              { key: 'Tất cả', label: 'Tất cả', icon: <GlobalOutlined /> },
              { key: 'Tích hợp & Kết nối', label: 'Tích hợp', icon: <ApiOutlined /> },
              { key: 'AI & Tự động hóa', label: 'AI & Tự động hóa', icon: <RobotOutlined /> },
              { key: 'Bảo mật & Tin cậy', label: 'Bảo mật', icon: <LockOutlined /> },
              { key: 'Hiệu năng & SLA', label: 'Hiệu năng', icon: <DashboardOutlined /> },
            ];

            const faqData: { cat: string; icon: React.ReactNode; q: string; a: string }[] = [
              // ── Tích hợp & Kết nối ─────────────────────────────────────────
              { cat: 'Tích hợp & Kết nối', icon: <ApiOutlined />, q: 'UniFlow hỗ trợ những sàn TMĐT nào?', a: 'Tích hợp sẵn <strong>10+ kênh</strong>: TikTok Shop, Shopee, Lazada, Tiki, Sapo POS, KiotViet, Haravan, GHTK, GHN, Viettel Post. Thêm kênh mới qua <strong>Connector Plugin</strong> trong 48–72 giờ, không cần sửa core.' },
              { cat: 'Tích hợp & Kết nối', icon: <ThunderboltOutlined />, q: 'Chống trùng đơn khi Flash Sale hoạt động ra sao?', a: '<strong>Redis Idempotency Key TTL-24h</strong> + hash <code>SHA-256(tenantId+orderId)</code>. Webhook retry nhận HTTP 200 ngay, không trừ kho lần hai, không tạo đơn ảo. Đã kiểm chứng <strong>50K đơn/giờ</strong>.' },
              { cat: 'Tích hợp & Kết nối', icon: <ReloadOutlined />, q: 'Kết nối kênh mới mất bao lâu?', a: 'Kênh có sẵn connector: <strong>15–30 phút</strong> — nhập Key, test Webhook, xác nhận. Kênh hoàn toàn mới: đội R&D bàn giao trong <strong>48–72 giờ</strong>.' },
              { cat: 'Tích hợp & Kết nối', icon: <BranchesOutlined />, q: 'UniFlow có hỗ trợ đa kho, đa chi nhánh không?', a: 'Có. Hệ thống phân kho theo <strong>Routing Rule</strong> tự định nghĩa: gần nhất, tồn kho cao nhất, hoặc ưu tiên theo kênh bán. Đồng bộ tồn kho real-time giữa tất cả chi nhánh.' },
              // ── AI & Tự động hóa ────────────────────────────────────────────
              { cat: 'AI & Tự động hóa', icon: <RobotOutlined />, q: 'AI SKU Matching đạt 98.5% chính xác thế nào?', a: '<strong>Hybrid Scoring</strong>: <code>0.7 × Cosine (Qdrant 1536-dim) + 0.3 × NER Gemini Flash</code>. Trích xuất màu sắc, size, chất liệu. Điểm ≥ 90% duyệt tự động, &lt;85% vào hàng đợi review.' },
              { cat: 'AI & Tự động hóa', icon: <AimOutlined />, q: '"0-chạm" nghĩa là gì? Khi nào cần thủ công?', a: 'Toàn bộ luồng Webhook → UDM → SKU Match → Phân kho → Vận đơn tự động. Chỉ cần tay khi confidence &lt;85%, giá trị đơn bất thường, hoặc lỗi địa chỉ giao nhận.' },
              { cat: 'AI & Tự động hóa', icon: <NodeIndexOutlined />, q: 'Tự phục hồi khi hãng vận chuyển sự cố?', a: '<strong>Circuit Breaker</strong>: sau 3 retry thất bại tự chuyển sang hãng backup (GHTK → GHN → Viettel Post). Phục hồi trung bình <strong>&lt; 30 giây</strong>, log đầy đủ và cảnh báo qua dashboard.' },
              // ── Bảo mật & Tin cậy ───────────────────────────────────────────
              { cat: 'Bảo mật & Tin cậy', icon: <LockOutlined />, q: 'Token và Webhook Secret được bảo vệ thế nào?', a: 'Mã hóa <strong>AES-256-GCM</strong>, lưu MongoDB Atlas, xoay khóa định kỳ qua KMS. <strong>Tenant Isolation + RBAC</strong> đảm bảo cách ly hoàn toàn. Mọi truy cập ghi <strong>audit log</strong> bất biến.' },
              { cat: 'Bảo mật & Tin cậy', icon: <SafetyCertificateOutlined />, q: 'Dữ liệu có bị chia sẻ cho bên thứ ba không?', a: '<strong>Không.</strong> Kiến trúc <strong>Data Sovereignty</strong>: namespace riêng, mã hóa at-rest và in-transit. Ký DPA với mọi merchant. Không dùng data của bạn để train mô hình AI nào.' },
              { cat: 'Bảo mật & Tin cậy', icon: <CheckCircleOutlined />, q: 'Cách hệ thống đảm bảo không mất đơn hàng?', a: '<strong>Event Sourcing + Dead Letter Queue (DLQ)</strong>: mọi sự kiện đều được lưu bất biến. Khi xử lý thất bại, đơn vào DLQ và retry tự động tối đa 5 lần, sau đó cảnh báo ngay cho merchant.' },
              // ── Hiệu năng & SLA ─────────────────────────────────────────────
              { cat: 'Hiệu năng & SLA', icon: <DashboardOutlined />, q: 'Cam kết SLA và thời gian xử lý là bao nhiêu?', a: '<strong>99.9% uptime/tháng</strong> (≤ 43 phút downtime). Webhook → Vận đơn &lt; <strong>2 giây</strong> (P95). Active-Active multi-zone trên MongoDB Atlas + Redis Cluster.' },
              { cat: 'Hiệu năng & SLA', icon: <CloudServerOutlined />, q: 'Scale thế nào khi đột biến như 12/12, Black Friday?', a: '<strong>K8s Horizontal Auto-Scaling</strong>: Worker Pool tự tăng 5 → 50 instances theo queue depth. Rate Limiter per-tenant chống độc chiếm tài nguyên. Đã stress-test <strong>100K đơn/giờ</strong> liên tục.' },
              { cat: 'Hiệu năng & SLA', icon: <RiseOutlined />, q: 'Có thể theo dõi hiệu năng real-time không?', a: 'Dashboard <strong>Live Metrics</strong> hiển thị: throughput đơn/giây, latency P50/P95/P99, error rate, queue depth. Alert tự gửi Slack/Email khi vượt ngưỡng cảnh báo.' },
            ];

            const filtered = faqData.filter(item => faqCategory === 'Tất cả' || item.cat === faqCategory);

            return (
              <>
                <div className="faq-category-tabs">
                  {faqCategories.map((cat) => (
                    <button
                      key={cat.key}
                      className={`faq-cat-btn${faqCategory === cat.key ? ' active' : ''}`}
                      onClick={() => { setFaqCategory(cat.key); setFaqOpenIdx(null); }}
                    >
                      <span className="faq-cat-icon">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                <div className="faq-grid">
                  {filtered.map((item, idx) => (
                    <div
                      key={`${faqCategory}-${idx}`}
                      className={`faq-item${faqOpenIdx === idx ? ' open' : ''}`}
                      onClick={() => setFaqOpenIdx(faqOpenIdx === idx ? null : idx)}
                    >
                      <div className="faq-item-header">
                        <div className="faq-icon-badge">{item.icon}</div>
                        <div className="faq-question">{item.q}</div>
                        <div className={`faq-chevron${faqOpenIdx === idx ? ' rotated' : ''}`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                      <div className="faq-answer-wrap">
                        <div className="faq-answer" dangerouslySetInnerHTML={{ __html: item.a }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="faq-trust-row">
                  {([
                    { value: '99.9%', label: 'SLA Uptime', icon: <RiseOutlined /> },
                    { value: '< 2s', label: 'Webhook → Vận đơn', icon: <ThunderboltOutlined /> },
                    { value: 'AES-256', label: 'Mã hóa dữ liệu', icon: <LockOutlined /> },
                    { value: '50K+', label: 'Đơn/giờ đã test', icon: <ShoppingFilled /> },
                    { value: '0', label: 'Data breach', icon: <SafetyCertificateOutlined /> },
                  ] as { value: string; label: string; icon: React.ReactNode }[]).map((stat) => (
                    <div key={stat.label} className="faq-trust-stat">
                      <span className="faq-trust-icon">{stat.icon}</span>
                      <span className="faq-trust-value">{stat.value}</span>
                      <span className="faq-trust-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════
          8. PREMIUM NEWSLETTER CTA STRIP
      ══════════════════════════════════════════════════════════════════ */}
      <section className="lp-newsletter-strip">
        {/* Decorative orbs */}
        <div className="cta-orb cta-orb-1" />
        <div className="cta-orb cta-orb-2" />
        <div className="cta-orb cta-orb-3" />

        <div className="cta-inner">

          <h2 className="cta-title">
            Bắt đầu hành trình{' '}
            <span className="cta-title-highlight">0‑chạm</span>{' '}
            ngày hôm nay
          </h2>
          <p className="cta-desc">
            Đăng ký nhận bản tin cập nhật công nghệ và trải nghiệm nền tảng Omnichannel iPaaS hàng đầu — miễn phí.
          </p>

          {/* Email Form */}
          <div className="cta-form">
            <div className="cta-input-wrap">
              <UserOutlined className="cta-input-icon" />
              <input
                type="email"
                placeholder="email@company.com"
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              />
            </div>
            <button className="cta-btn" onClick={handleSubscribe}>
              <span>Đăng ký miễn phí</span>
              <ArrowRightOutlined style={{ fontSize: 13 }} />
            </button>
          </div>


        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          9. PREMIUM ENTERPRISE FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      <footer className="lp-footer">
        <div className="footer-container">

          {/* TOP GRID: 4 columns */}
          <div className="footer-grid">

            {/* Col 1 — Brand */}
            <div className="footer-col footer-brand-col">
              <div className="footer-logo-row">
                <img src="/logo.svg" alt="UniFlow" className="footer-logo" />
                <div>
                  <div className="footer-brand-name">
                    UniFlow <span className="footer-brand-accent">AI</span>
                  </div>
                  <div className="footer-brand-sub">PTIT_Aka · Omnichannel iPaaS</div>
                </div>
              </div>
              <p className="footer-brand-desc">
                Nền tảng tự động hóa đa kênh TMĐT 0-chạm, tích hợp AI Agent và iPaaS Enterprise cho thị trường Việt Nam.
              </p>
              <a href="mailto:contact.uniflow.aka@gmail.com" className="footer-email">
                contact.uniflow.aka@gmail.com
              </a>
              {/* Tech Stack Badges */}
              <div className="footer-tech-badges">
                {['Node.js', 'MongoDB', 'Redis', 'K8s', 'Qdrant'].map(t => (
                  <span key={t} className="footer-tech-badge">{t}</span>
                ))}
              </div>
            </div>

            {/* Col 2 — Address & Info */}
            <div className="footer-col">
              <div className="footer-col-title">
                <GlobalOutlined style={{ marginRight: 7 }} />
                Địa chỉ trụ sở
              </div>
              <div className="footer-address">
                <div className="footer-address-name">Học viện Công nghệ PTIT</div>
                <div className="footer-address-line">Km10, Nguyễn Trãi, Hà Đông, Hà Nội</div>
                <div className="footer-address-tag">
                  <DatabaseFilled style={{ fontSize: 11, marginRight: 5 }} />
                  Kho miền Bắc: WH_MAIN_HN
                </div>
              </div>
              <div className="footer-col-title" style={{ marginTop: 24 }}>
                <CodeFilled style={{ marginRight: 7 }} />
                Version
              </div>
              <div className="footer-version-badges">
                <span className="footer-version-tag">v2.4.1 Stable</span>
                <span className="footer-version-tag active">UDM Schema v3</span>
                <span className="footer-version-tag">API v3.2</span>
              </div>
            </div>

            {/* Col 3 — Quick Links */}
            <div className="footer-col">
              <div className="footer-col-title">
                <RocketFilled style={{ marginRight: 7 }} />
                Khám phá nhanh
              </div>
              {[
                { to: '/', label: 'Trang chủ' },
                { to: '/workflows', label: 'Visual Workflow Canvas' },
                { to: '/mapping', label: 'AI SKU Auto-Mapping' },
                { to: '/connectors', label: 'Connectors Hub' },
                { to: '/logs', label: 'Live Logs & Self-Healing' },
                { to: '/docs', label: 'Tài liệu kỹ thuật & API' },
              ].map(l => (
                <Link key={l.to} to={l.to} className="footer-link">
                  <ArrowRightOutlined className="footer-link-arrow" />
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Col 4 — Team & Contact */}
            <div className="footer-col">
              <div className="footer-col-title">
                <UserOutlined style={{ marginRight: 7 }} />
                Về đội ngũ
              </div>
              <p className="footer-team-desc">
                Đội ngũ sinh viên <strong className="footer-team-highlight">PTIT_Aka</strong> kiến tạo trải nghiệm tự động hóa TMĐT bằng công nghệ AI tiên phong.
              </p>
              <div className="footer-team-badge">UNIFLOW PTIT_Aka DEVELOPMENT TEAM</div>

              {/* Social / Contact links */}
              <div className="footer-social-row">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-social-btn">
                  <BranchesOutlined />
                  GitHub
                </a>
                <a href="mailto:contact.uniflow.aka@gmail.com" className="footer-social-btn">
                  <ApiFilled />
                  Contact
                </a>
                <a href="/docs" className="footer-social-btn">
                  <FileTextOutlined />
                  Docs
                </a>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="footer-divider" />

          {/* BOTTOM ROW */}
          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <span>© 2026 UniFlow AI · PTIT_Aka. </span>
              <span className="footer-bottom-sub">Kiến tạo vận hành TMĐT bằng công nghệ AI.</span>
            </div>
            <div className="footer-bottom-right">
              <a href="/privacy" className="footer-legal-link">Chính sách bảo mật</a>
              <span className="footer-legal-dot">·</span>
              <a href="/terms" className="footer-legal-link">Terms of Service</a>
              <span className="footer-legal-dot">·</span>
              <a href="/cookies" className="footer-legal-link">Cookie Policy</a>
              <Button
                type="primary"
                shape="circle"
                icon={<VerticalAlignTopOutlined />}
                onClick={scrollToTop}
                size="small"
                className="footer-scroll-top"
              />
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
