import React from 'react';
import { Form, Input, Checkbox, message } from 'antd';
import { MailOutlined, LockOutlined, ThunderboltOutlined, UserOutlined, ShopOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuthStore } from '../../store/useAuthStore';
import { BaseButton } from '../../components/base';

export const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleFinish = async (values: any) => {
    try {
      await login({ email: values.email, password: values.password });
      message.success('Đăng nhập thành công! Chào mừng trở lại UniFlow AI.');
      navigate('/dashboard');
    } catch (err: any) {
      message.error(err.message || 'Email hoặc mật khẩu không chính xác.');
    }
  };

  const fillCredentials = (email: string, pass: string) => {
    form.setFieldsValue({ email, password: pass });
    message.info(`Đã điền tài khoản: ${email}`);
  };

  return (
    <AuthLayout>
      <div className="auth-form-card">
        <div className="auth-card-header">
          <h2 className="auth-card-title">Đăng nhập</h2>
          <p className="auth-card-sub">Truy cập trung tâm điều khiển vận hành đa kênh 0-chạm</p>
        </div>

        {/* ── QUICK DEMO ACCOUNTS BOX ────────────────────────────────────── */}
        <div className="demo-accounts-box">
          <div className="demo-title">
            <ThunderboltOutlined />
            <span>Điền nhanh tài khoản Demo để kiểm thử</span>
          </div>
          <div className="demo-btns-row" style={{ display: 'flex', gap: 8 }}>
            <BaseButton
              variant="secondary"
              size="small"
              icon={<UserOutlined />}
              onClick={() => fillCredentials('admin@uniflow.vn', 'Admin@123456')}
            >
              Admin Master
            </BaseButton>
            <BaseButton
              variant="secondary"
              size="small"
              icon={<ShopOutlined />}
              onClick={() => fillCredentials('demo@uniflow.vn', 'Demo@123456')}
            >
              Chủ Gian Hàng
            </BaseButton>
          </div>
        </div>

        {/* ── LOGIN FORM ─────────────────────────────────────────────────── */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ remember: true }}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Địa chỉ Email"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ email' },
              { type: 'email', message: 'Địa chỉ email không hợp lệ' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="tenban@company.com"
              autoComplete="email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              autoComplete="current-password"
              size="large"
            />
          </Form.Item>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <a
              href="#"
              style={{ fontSize: 13, color: '#ed1c24' }}
              onClick={(e) => {
                e.preventDefault();
                message.info('Vui lòng liên hệ Admin để reset mật khẩu.');
              }}
            >
              Quên mật khẩu?
            </a>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <BaseButton
              variant="primary"
              size="large"
              htmlType="submit"
              loading={isLoading}
              glow
              block
            >
              Đăng nhập ngay
            </BaseButton>
          </Form.Item>
        </Form>

        <div className="auth-switch-prompt">
          Chưa có tài khoản UniFlow?{' '}
          <Link to="/register">Đăng ký trải nghiệm 14 ngày</Link>
        </div>
      </div>
    </AuthLayout>
  );
};
export default LoginPage;
