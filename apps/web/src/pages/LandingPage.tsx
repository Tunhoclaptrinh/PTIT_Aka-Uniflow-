import React from 'react';
import { Button, Card, Row, Col, Tag, Space, Typography } from 'antd';
import {
  ThunderboltFilled,
  CheckCircleFilled,
  SafetyCertificateFilled,
  ArrowRightOutlined,
  DashboardOutlined,
  BranchesOutlined,
  RocketFilled,
  CodeFilled,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export const LandingPage: React.FC = () => {
  return (
    <div style={{ background: '#0B0F19', minHeight: '100vh', color: '#F9FAFB', overflowX: 'hidden' }}>
      {/* 1. TOP STICKY NAVBAR */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backdropFilter: 'blur(16px)',
          background: 'rgba(11, 15, 25, 0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: '#111827',
              border: '1px solid rgba(237, 28, 36, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(237, 28, 36, 0.4)',
              padding: 4,
            }}
          >
            <img src="/logo.svg" alt="UniFlow PTIT Aka Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              <span style={{ color: '#F9FAFB' }}>Uni</span>
              <span style={{ color: '#ed1c24' }}>Flow</span>
              <span style={{ color: '#fcc20f', marginLeft: 4 }}>AI</span>
            </div>
            <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, letterSpacing: '0.5px' }}>
              PTIT AKA OMNICHANNEL IPAAS
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#features" style={{ color: '#D1D5DB', fontWeight: 500, transition: 'color 0.2s' }}>
            Tính Năng
          </a>
          <a href="#architecture" style={{ color: '#D1D5DB', fontWeight: 500 }}>
            Kiến Trúc UDM
          </a>
          <a href="#ecosystem" style={{ color: '#D1D5DB', fontWeight: 500 }}>
            Hệ Sinh Thái
          </a>
          <a href="#pricing" style={{ color: '#D1D5DB', fontWeight: 500 }}>
            Bảng Giá
          </a>
        </nav>

        {/* CTA Button */}
        <Space>
          <Link to="/dashboard">
            <Button
              type="primary"
              size="large"
              icon={<DashboardOutlined />}
              style={{
                background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
                border: 'none',
                fontWeight: 700,
                borderRadius: 8,
                boxShadow: '0 4px 14px rgba(237, 28, 36, 0.4)',
              }}
            >
              Vào Dashboard Quản Trị <ArrowRightOutlined />
            </Button>
          </Link>
        </Space>
      </header>

      {/* 2. HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '90px 40px 60px',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(237, 28, 36, 0.18), transparent)',
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Tag
            color="red"
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 24,
              border: '1px solid rgba(237, 28, 36, 0.4)',
              background: 'rgba(237, 28, 36, 0.1)',
              color: '#fcc20f',
            }}
          >
            <RocketFilled style={{ marginRight: 6 }} /> NỀN TẢNG OMNICHANNEL IPAAS & AI AGENT ENGINE CHO TMĐT
          </Tag>

          <Title
            level={1}
            style={{
              fontSize: 54,
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: 20,
              letterSpacing: '-1.5px',
            }}
          >
            Tự Động Hóa Vận Hành Bán Hàng{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              0-Chạm Đa Kênh
            </span>{' '}
            Với AI Thông Minh
          </Title>

          <Paragraph
            style={{
              fontSize: 18,
              color: '#9CA3AF',
              maxWidth: 780,
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            Giải quyết triệt để bài toán tắc nghẽn Mega Sale, chống trùng đơn 24h, tự động khớp SKU sàn & kho POS qua
            Vector Embedding và tự chữa lành sự cố vận chuyển trong vòng <strong>dưới 0.5 giây</strong>.
          </Paragraph>

          <Space size="middle">
            <Link to="/dashboard">
              <Button
                type="primary"
                size="large"
                style={{
                  height: 52,
                  padding: '0 32px',
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 10,
                  background: '#ed1c24',
                  borderColor: '#ed1c24',
                  boxShadow: '0 8px 24px rgba(237, 28, 36, 0.4)',
                }}
              >
                Khám Phá Dashboard Ngay <ArrowRightOutlined />
              </Button>
            </Link>

            <Link to="/workflows">
              <Button
                size="large"
                icon={<BranchesOutlined />}
                style={{
                  height: 52,
                  padding: '0 28px',
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: '#374151',
                  color: '#F9FAFB',
                }}
              >
                Trải Nghiệm Canvas Kéo Thả
              </Button>
            </Link>
          </Space>
        </div>

        {/* Hero Stats Ribbon */}
        <div style={{ maxWidth: 1100, margin: '60px auto 0' }}>
          <Row gutter={[20, 20]}>
            <Col xs={12} sm={6}>
              <Card
                bordered={false}
                style={{
                  background: 'rgba(17, 24, 39, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 14,
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 900, color: '#10B981', fontFamily: 'JetBrains Mono' }}>
                  &lt; 0.5s
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4, fontWeight: 500 }}>
                  Độ trễ Webhook SLA
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card
                bordered={false}
                style={{
                  background: 'rgba(17, 24, 39, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 14,
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 900, color: '#fcc20f', fontFamily: 'JetBrains Mono' }}>
                  99.98%
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4, fontWeight: 500 }}>
                  Tỷ lệ đồng bộ thành công
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card
                bordered={false}
                style={{
                  background: 'rgba(17, 24, 39, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 14,
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 900, color: '#ed1c24', fontFamily: 'JetBrains Mono' }}>
                  100%
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4, fontWeight: 500 }}>
                  Chuẩn hóa UDM Schema
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card
                bordered={false}
                style={{
                  background: 'rgba(17, 24, 39, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 14,
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 900, color: '#8B5CF6', fontFamily: 'JetBrains Mono' }}>
                  0-Chạm
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4, fontWeight: 500 }}>
                  Vận hành tự động Mega Sale
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 3. ECOSYSTEM CONNECTORS */}
      <section
        id="ecosystem"
        style={{
          padding: '60px 40px',
          background: '#070A10',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 24 }}>
          TÍCH HỢP TOÀN DIỆN VỚI HỆ SINH THÁI THƯƠNG MẠI ĐIỆN TỬ VIỆT NAM
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 20 }}>
          {['TikTok Shop', 'Shopee', 'Lazada', 'Sapo POS', 'KiotViet', 'Haravan', 'GHTK Express', 'Giao Hàng Nhanh (GHN)', 'Viettel Post'].map((name) => (
            <div
              key={name}
              style={{
                padding: '10px 22px',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#F9FAFB',
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <CheckCircleFilled style={{ color: '#10B981', fontSize: 14 }} /> {name}
            </div>
          ))}
        </div>
      </section>

      {/* 4. KEY FEATURES SECTION */}
      <section id="features" style={{ padding: '90px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Tag color="gold" style={{ padding: '4px 12px', fontWeight: 700, borderRadius: 12, marginBottom: 12 }}>
            ⚡ TÍNH NĂNG ĐỘT PHÁ
          </Tag>
          <Title level={2} style={{ color: '#FFFFFF', fontSize: 38, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Bộ Công Cụ Tự Động Hóa Vận Hành Toàn Diện
          </Title>
          <Paragraph style={{ color: '#9CA3AF', fontSize: 16, maxWidth: 650, margin: '0 auto' }}>
            Kết hợp sức mạnh giữa chuẩn hóa dữ liệu UDM và trí tuệ nhân tạo Agentic AI để loại bỏ 90% thao tác thủ công.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* Feature 1 */}
          <Col xs={24} md={12} lg={6}>
            <Card
              bordered={false}
              style={{
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                height: '100%',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: 'rgba(237, 28, 36, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <BranchesOutlined style={{ fontSize: 26, color: '#ed1c24' }} />
              </div>
              <Title level={4} style={{ color: '#FFFFFF', marginBottom: 12 }}>
                Visual Workflow Canvas
              </Title>
              <Paragraph style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.6 }}>
                Thiết kế luồng xử lý đơn hàng trực quan với React Flow. Kéo thả các node Trigger, AI Matcher, POS Deduct và Vận đơn.
              </Paragraph>
            </Card>
          </Col>

          {/* Feature 2 */}
          <Col xs={24} md={12} lg={6}>
            <Card
              bordered={false}
              style={{
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                height: '100%',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: 'rgba(252, 194, 15, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <CodeFilled style={{ fontSize: 26, color: '#fcc20f' }} />
              </div>
              <Title level={4} style={{ color: '#FFFFFF', marginBottom: 12 }}>
                Universal Data Model (UDM)
              </Title>
              <Paragraph style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.6 }}>
                Chuẩn hóa mọi payload phức tạp từ TikTok, Shopee, Lazada về một định dạng duy nhất, giảm độ phức tạp tích hợp O(N × M) về O(N + M).
              </Paragraph>
            </Card>
          </Col>

          {/* Feature 3 */}
          <Col xs={24} md={12} lg={6}>
            <Card
              bordered={false}
              style={{
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                height: '100%',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: 'rgba(139, 92, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <ThunderboltFilled style={{ fontSize: 26, color: '#8B5CF6' }} />
              </div>
              <Title level={4} style={{ color: '#FFFFFF', marginBottom: 12 }}>
                AI Hybrid SKU Auto-Mapping
              </Title>
              <Paragraph style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.6 }}>
                Tự động so khớp mã hàng với thuật toán kết hợp Vector Cosine (Qdrant) và trích xuất thực thể NLP (Gemini), phê duyệt 1-click tức thì.
              </Paragraph>
            </Card>
          </Col>

          {/* Feature 4 */}
          <Col xs={24} md={12} lg={6}>
            <Card
              bordered={false}
              style={{
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                height: '100%',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <SafetyCertificateFilled style={{ fontSize: 26, color: '#10B981' }} />
              </div>
              <Title level={4} style={{ color: '#FFFFFF', marginBottom: 12 }}>
                AI Self-Healing & Reroute
              </Title>
              <Paragraph style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.6 }}>
                Khi đối tác vận chuyển gặp sự cố timeout (504) hoặc quá tải, AI tự động chẩn đoán lỗi và chuyển tuyến dự phòng mà không gián đoạn luồng đơn.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </section>

      {/* 5. PRICING TIERS */}
      <section id="pricing" style={{ padding: '90px 40px', background: '#070A10' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Tag color="red" style={{ padding: '4px 12px', fontWeight: 700, borderRadius: 12, marginBottom: 12 }}>
            💰 BẢNG GIÁ DỊCH VỤ
          </Tag>
          <Title level={2} style={{ color: '#FFFFFF', fontSize: 38, fontWeight: 800 }}>
            Gói Cước Linh Hoạt Cho Mọi Quy Mô
          </Title>
          <Paragraph style={{ color: '#9CA3AF', fontSize: 16 }}>
            Bắt đầu miễn phí và nâng cấp khi doanh số cửa hàng tăng trưởng vượt bậc.
          </Paragraph>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Row gutter={[24, 24]}>
            {/* Starter */}
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                style={{
                  background: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 16,
                  padding: 12,
                }}
              >
                <Tag color="#6B7280" style={{ borderRadius: 4, fontWeight: 600 }}>STARTER</Tag>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#FFFFFF', margin: '16px 0 8px' }}>
                  0 VNĐ <span style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 400 }}>/ tháng</span>
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>
                  Dành cho nhà bán hàng mới khởi nghiệp trên 1 sàn TMĐT.
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', color: '#D1D5DB', lineHeight: 2.2 }}>
                  <li><CheckCircleFilled style={{ color: '#10B981', marginRight: 8 }} /> Tối đa 1,000 đơn/tháng</li>
                  <li><CheckCircleFilled style={{ color: '#10B981', marginRight: 8 }} /> 1 Luồng Workflow cơ bản</li>
                  <li><CheckCircleFilled style={{ color: '#10B981', marginRight: 8 }} /> Chuẩn hóa UDM tiêu chuẩn</li>
                  <li><CheckCircleFilled style={{ color: '#10B981', marginRight: 8 }} /> Hỗ trợ qua cộng đồng</li>
                </ul>
                <Link to="/dashboard">
                  <Button block size="large" style={{ borderRadius: 8, borderColor: '#374151', color: '#F9FAFB' }}>
                    Dùng Thử Miễn Phí
                  </Button>
                </Link>
              </Card>
            </Col>

            {/* Growth (Recommended) */}
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                style={{
                  background: 'linear-gradient(180deg, rgba(237, 28, 36, 0.1) 0%, #111827 100%)',
                  border: '2px solid #ed1c24',
                  borderRadius: 16,
                  padding: 12,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag color="#ed1c24" style={{ borderRadius: 4, fontWeight: 700 }}>GROWTH (PHỔ BIẾN NHẤT)</Tag>
                  <Tag color="#fcc20f" style={{ color: '#0B0F19', fontWeight: 800, borderRadius: 4 }}>HOT 🔥</Tag>
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#fcc20f', margin: '16px 0 8px' }}>
                  590,000 VNĐ <span style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 400 }}>/ tháng</span>
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>
                  Dành cho các Brand & Top Seller vận hành đa kênh.
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', color: '#F9FAFB', lineHeight: 2.2 }}>
                  <li><CheckCircleFilled style={{ color: '#fcc20f', marginRight: 8 }} /> Tối đa 50,000 đơn/tháng</li>
                  <li><CheckCircleFilled style={{ color: '#fcc20f', marginRight: 8 }} /> Không giới hạn Workflows Canvas</li>
                  <li><CheckCircleFilled style={{ color: '#fcc20f', marginRight: 8 }} /> <strong>AI Hybrid SKU Matching tự động</strong></li>
                  <li><CheckCircleFilled style={{ color: '#fcc20f', marginRight: 8 }} /> <strong>AI Self-Healing tự chữa lành lỗi</strong></li>
                  <li><CheckCircleFilled style={{ color: '#fcc20f', marginRight: 8 }} /> Live WebSocket Event Stream</li>
                </ul>
                <Link to="/dashboard">
                  <Button
                    type="primary"
                    block
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
                      border: 'none',
                      fontWeight: 700,
                      borderRadius: 8,
                      height: 44,
                    }}
                  >
                    Bắt Đầu Với Gói Growth
                  </Button>
                </Link>
              </Card>
            </Col>

            {/* Enterprise */}
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                style={{
                  background: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 16,
                  padding: 12,
                }}
              >
                <Tag color="#8B5CF6" style={{ borderRadius: 4, fontWeight: 600 }}>ENTERPRISE</Tag>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#FFFFFF', margin: '16px 0 8px' }}>
                  Liên Hệ <span style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 400 }}>/ quy mô lớn</span>
                </div>
                <div style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>
                  Doanh nghiệp hàng triệu đơn Mega Sale & hạ tầng riêng biệt.
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', color: '#D1D5DB', lineHeight: 2.2 }}>
                  <li><CheckCircleFilled style={{ color: '#8B5CF6', marginRight: 8 }} /> Không giới hạn lượng đơn</li>
                  <li><CheckCircleFilled style={{ color: '#8B5CF6', marginRight: 8 }} /> Dedicated Qdrant & Redis Cluster</li>
                  <li><CheckCircleFilled style={{ color: '#8B5CF6', marginRight: 8 }} /> Cam kết SLA 99.99% Uptime</li>
                  <li><CheckCircleFilled style={{ color: '#8B5CF6', marginRight: 8 }} /> Kỹ sư giải pháp hỗ trợ 24/7</li>
                </ul>
                <Link to="/dashboard">
                  <Button block size="large" style={{ borderRadius: 8, borderColor: '#374151', color: '#F9FAFB' }}>
                    Liên Hệ Đội Ngũ Kỹ Thuật
                  </Button>
                </Link>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer
        style={{
          padding: '40px',
          background: '#0B0F19',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <ThunderboltFilled style={{ color: '#ed1c24', fontSize: 20 }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: '#F9FAFB' }}>UniFlow AI</span>
          <span style={{ color: '#6B7280' }}>— Omnichannel Middleware & Agent Engine</span>
        </div>
        <div style={{ color: '#9CA3AF', fontSize: 13 }}>
          Phát triển bởi <strong>PTIT Aka Engineering Team</strong> • Học viện Công nghệ Bưu chính Viễn thông (PTIT)
        </div>
        <div style={{ color: '#6B7280', fontSize: 12, marginTop: 8 }}>
          Bản quyền © 2026 UniFlow AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
