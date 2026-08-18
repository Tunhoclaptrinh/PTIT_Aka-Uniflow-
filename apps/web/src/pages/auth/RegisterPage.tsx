import React, { useState } from 'react';
import { Form, Input, Checkbox, message } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuthStore } from '../../store/useAuthStore';
import { BaseButton } from '../../components/base';

export const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        tenantName: values.tenantName,
      });
      message.success('Đăng ký tài khoản UniFlow thành công! Chào mừng bạn gia nhập nền tảng.');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg =
        err?.message || err?.error || 'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin!';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-card">
        <div className="auth-card-header">
          <h2 className="auth-card-title">Tạo tài khoản</h2>
          <p className="auth-card-sub">Trải nghiệm nền tảng tự động hóa iPaaS & AI Agent 14 ngày miễn phí</p>
        </div>

        {/* ── REGISTER FORM ──────────────────────────────────────────────── */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Họ và Tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên của bạn' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" size="large" />
          </Form.Item>

          <Form.Item
            name="tenantName"
            label="Tên Gian hàng / Doanh nghiệp"
            rules={[{ required: true, message: 'Vui lòng nhập tên gian hàng hoặc doanh nghiệp' }]}
          >
            <Input prefix={<ShopOutlined />} placeholder="Thời Trang An Khang" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Địa chỉ Email"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ email' },
              { type: 'email', message: 'Địa chỉ email không hợp lệ' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="merchant@company.com" size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^[0-9]{9,11}$/,
                message: 'Số điện thoại phải từ 9-11 chữ số',
              },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="0988 888 888 (Tùy chọn)" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận Mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận lại mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item
            name="agreeTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Bạn cần đồng ý với Điều khoản Dịch vụ')),
              },
            ]}
            style={{ marginBottom: 20 }}
          >
            <Checkbox>
              Tôi đồng ý với <a href="#" onClick={(e) => e.preventDefault()}>Điều khoản Dịch vụ</a> &{' '}
              <a href="#" onClick={(e) => e.preventDefault()}>Chính sách Bảo mật</a> của UniFlow AI.
            </Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <BaseButton
              variant="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              glow
              block
            >
              Bắt đầu trải nghiệm ngay
            </BaseButton>
          </Form.Item>
        </Form>

        <div className="auth-switch-prompt">
          Đã có tài khoản UniFlow? <Link to="/login">Đăng nhập tại đây</Link>
        </div>
      </div>
    </AuthLayout>
  );
};
export default RegisterPage;
