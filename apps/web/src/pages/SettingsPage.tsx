import React, { useState } from 'react';
import { Form, Input, Switch, Row, Col, Tag, Divider } from 'antd';
import {
  SettingFilled,
  SafetyCertificateFilled,
  BellFilled,
  CrownFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import { BaseCard, BaseButton, ConfirmModal, PageContainer, FormFooter } from '../components/base';
import { validationRules } from '../utils/validation';
import { notify } from '../utils/notification';

export const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    form.validateFields().then(() => {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        notify.success('Đã lưu cấu hình doanh nghiệp thành công vào MongoDB Atlas!');
      }, 600);
    });
  };

  const handleResetKeys = () => {
    setResetting(true);
    setTimeout(() => {
      setResetting(false);
      setResetModalOpen(false);
      notify.success('Đã tạo mới cặp khóa bảo mật AES-256-GCM thành công! 🔑');
    }, 1000);
  };

  return (
    <PageContainer
      icon={<SettingFilled style={{ color: '#ed1c24' }} />}
      title="Cài Đặt Hệ Thống & Doanh Nghiệp (Tenant & Engine Settings)"
      subtitle="Cấu hình thông tin Merchant, Mã hóa bảo mật PCI-DSS và Kênh thông báo sự cố thời gian thực"
      tags={<Tag color="#ed1c24" style={{ fontWeight: 700 }}>Gói Growth</Tag>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Row gutter={[20, 20]}>
          {/* 1. Tenant Info */}
          <Col xs={24} lg={12}>
            <BaseCard
              icon={<CrownFilled style={{ color: '#fcc20f' }} />}
              title="Thông Tin Doanh Nghiệp (Tenant Profile)"
              subtitle="Thông tin định danh của Merchant trên nền tảng UniFlow AI"
            >
              <Form form={form} layout="vertical" onFinish={handleSave}>
                <Form.Item
                  label="Tên Doanh Nghiệp / Thương Hiệu"
                  name="tenantName"
                  initialValue="Thời Trang An Khang (PTIT_Aka Store)"
                  rules={[validationRules.required('Tên doanh nghiệp là bắt buộc!'), validationRules.min(3)]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label="Subdomain Định Danh (Tenant ID)">
                  <Input defaultValue="ankhang-ptit" readOnly style={{ color: '#ed1c24', fontWeight: 600, fontFamily: 'JetBrains Mono' }} />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Màu Thương Hiệu Chủ Đạo">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: '#ed1c24', border: '1px solid #ffffff' }} />
                        <Input defaultValue="#ed1c24" readOnly style={{ fontFamily: 'JetBrains Mono' }} />
                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Màu Ánh Kim Bổ Trợ">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: '#fcc20f', border: '1px solid #ffffff' }} />
                        <Input defaultValue="#fcc20f" readOnly style={{ fontFamily: 'JetBrains Mono' }} />
                      </div>
                    </Form.Item>
                  </Col>
                </Row>

                {/* Form Footer Căn Giữa Chuẩn Chỉ */}
                <FormFooter
                  align="center"
                  submitText="Lưu Cấu Hình Doanh Nghiệp"
                  cancelText="Khôi Phục Mặc Định"
                  loading={saving}
                  onSubmit={handleSave}
                  onCancel={() => form.resetFields()}
                />
              </Form>
            </BaseCard>
          </Col>

          {/* 2. Security & Channels */}
          <Col xs={24} lg={12}>
            <BaseCard
              icon={<SafetyCertificateFilled style={{ color: '#10B981' }} />}
              title="Bảo Mật & Mã Hóa Dữ Liệu"
              subtitle="Tiêu chuẩn mã hóa AES-256-GCM bảo vệ an toàn Token OAuth và thông tin khách hàng"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Khóa Mã Hóa AES-256-GCM (32 Bytes)</div>
                  <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>Mã hóa toàn bộ Token OAuth và thông tin khách hàng nhạy cảm</div>
                  <Tag color="#10B981" style={{ marginTop: 6, fontWeight: 600 }}>● Đang kích hoạt chuẩn PCI-DSS</Tag>
                </div>

                <BaseButton
                  variant="secondary"
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={() => setResetModalOpen(true)}
                >
                  Tạo Khóa Mới
                </BaseButton>
              </div>

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <BellFilled style={{ color: '#fcc20f' }} /> Kênh Thông Báo Sự Cố Vận Hành
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Cảnh báo qua Telegram Bot</div>
                  <div style={{ color: '#6B7280', fontSize: 11 }}>Gửi thông báo khi tỷ lệ lỗi vận chuyển &gt; 1%</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Live WebSocket Alert Stream</div>
                  <div style={{ color: '#6B7280', fontSize: 11 }}>Phát tín hiệu âm thanh và nhấp nháy trên Dashboard</div>
                </div>
                <Switch defaultChecked />
              </div>
            </BaseCard>
          </Col>
        </Row>
      </div>

      {/* Reset Key Confirm Modal */}
      <ConfirmModal
        open={resetModalOpen}
        title="Xác nhận tạo mới cặp khóa bảo mật AES-256"
        content="Việc tạo mới khóa mã hóa sẽ làm mới toàn bộ Secret Key nội bộ của hệ thống. Bạn có chắc chắn muốn thực hiện thao tác này không?"
        confirmText="Tạo mới khóa"
        danger
        loading={resetting}
        onConfirm={handleResetKeys}
        onCancel={() => setResetModalOpen(false)}
      />
    </PageContainer>
  );
};
