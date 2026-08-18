import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Typography, Space } from 'antd';
import { WarningFilled, ReloadOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[React ErrorBoundary]:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0B0F19',
            padding: 40,
          }}
        >
          <div
            style={{
              maxWidth: 520,
              textAlign: 'center',
              background: '#111827',
              padding: '40px 32px',
              borderRadius: 16,
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.15)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <WarningFilled style={{ fontSize: 32, color: '#EF4444' }} />
            </div>

            <Title level={3} style={{ color: '#F9FAFB', marginBottom: 8 }}>
              Đã Xảy Ra Sự Cố Giao Diện
            </Title>

            <Paragraph style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Hệ thống phát hiện lỗi ngoại lệ khi hiển thị phân hệ này. Dữ liệu của bạn vẫn an toàn trên MongoDB Atlas.
            </Paragraph>

            {this.state.error && (
              <div
                style={{
                  background: '#0B0F19',
                  padding: 12,
                  borderRadius: 8,
                  fontFamily: 'JetBrains Mono',
                  fontSize: 11,
                  color: '#EF4444',
                  textAlign: 'left',
                  marginBottom: 24,
                  maxHeight: 120,
                  overflowY: 'auto',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {this.state.error.message}
              </div>
            )}

            <Space size="middle">
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleReload}
                style={{
                  background: 'linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)',
                  border: 'none',
                  fontWeight: 700,
                }}
              >
                Tải Lại Giao Diện
              </Button>
              <Button
                icon={<HomeOutlined />}
                onClick={this.handleGoHome}
                style={{ borderColor: '#374151', color: '#D1D5DB' }}
              >
                Về Dashboard
              </Button>
            </Space>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
