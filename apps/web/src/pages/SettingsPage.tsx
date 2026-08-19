import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Row, Col, Tag, Divider, Spin, Select } from 'antd';
import {
  SafetyCertificateFilled,
  BellFilled,
  CrownFilled,
  ReloadOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import { BaseCard, BaseButton, ConfirmModal, PageContainer, FormFooter } from '../components/base';
import { tenantService, TenantData } from '../services/tenant.service';
import { validationRules } from '../utils/validation';
import { notify } from '../utils/notification';

export const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Load tenant profile from backend API
  const fetchTenant = async () => {
    setLoading(true);
    try {
      const data = await tenantService.getCurrentTenant();
      if (data) {
        setTenant(data);
        form.setFieldsValue({
          name: data.name,
          subdomain: data.subdomain,
          primaryColor: data.brandTheme?.primaryColor || '#ed1c24',
          secondaryColor: data.brandTheme?.secondaryColor || '#fcc20f',
          defaultCarrier: data.settings?.defaultCarrier || 'GHTK',
          autoRetryOnFailure: data.settings?.autoRetryOnFailure ?? true,
        });
      }
    } catch (err: any) {
      notify.error('Lỗi khi tải thông tin doanh nghiệp: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, []);

  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      const updated = await tenantService.updateCurrentTenant({
        name: values.name,
        brandTheme: {
          primaryColor: values.primaryColor,
          secondaryColor: values.secondaryColor,
        },
        settings: {
          defaultCarrier: values.defaultCarrier,
          autoRetryOnFailure: values.autoRetryOnFailure,
          alertChannels: tenant?.settings?.alertChannels || ['TELEGRAM', 'WEBSOCKET'],
        },
      });
      setTenant(updated);
      notify.success('Đã lưu cấu hình doanh nghiệp thành công vào MongoDB Atlas.');
    } catch (err: any) {
      notify.error('Lỗi khi cập nhật cấu hình: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetKeys = async () => {
    setResetting(true);
    try {
      const res = await tenantService.rotateSecurityKeys();
      setResetModalOpen(false);
      notify.success(
        `Đã tạo mới cặp khóa bảo mật AES-256-GCM thành công! (${res.keyFingerprint}) 🔑`
      );
    } catch (err: any) {
      notify.error('Lỗi khi làm mới khóa bảo mật: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <PageContainer
      title="Cài đặt hệ thống"
      tooltip="Cấu hình thông tin Merchant, Mã hóa bảo mật và Kênh thông báo sự cố thời gian thực"
      tags={
        <Tag color="#ed1c24" style={{ fontWeight: 600, borderRadius: 4 }}>
          Gói {tenant?.planTier || 'GROWTH'}
        </Tag>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" tip="Đang đồng bộ thông tin Tenant từ MongoDB..." />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Row gutter={[20, 20]}>
              {/* 1. Tenant Info */}
              <Col xs={24} lg={12}>
                <BaseCard
                  icon={<CrownFilled style={{ color: '#ed1c24' }} />}
                  title="Thông tin doanh nghiệp"
                  subtitle="Thông tin định danh của Merchant trên nền tảng UniFlow AI"
                >
                  <Form.Item
                    label="Tên doanh nghiệp / Thương hiệu"
                    name="name"
                    rules={[
                      validationRules.required('Tên doanh nghiệp là bắt buộc!'),
                      validationRules.min(3),
                    ]}
                  >
                    <Input placeholder="Nhập tên doanh nghiệp..." />
                  </Form.Item>

                  <Form.Item label="Subdomain định danh (Tenant ID)" name="subdomain">
                    <Input
                      readOnly
                      style={{
                        color: '#ed1c24',
                        fontWeight: 600,
                        fontFamily: 'JetBrains Mono',
                      }}
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Màu thương hiệu chủ đạo"
                        name="primaryColor"
                        initialValue="#ed1c24"
                      >
                        <Input style={{ fontFamily: 'JetBrains Mono' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Màu ánh kim bổ trợ"
                        name="secondaryColor"
                        initialValue="#fcc20f"
                      >
                        <Input style={{ fontFamily: 'JetBrains Mono' }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Đơn vị vận chuyển mặc định"
                    name="defaultCarrier"
                    initialValue="GHTK"
                  >
                    <Select
                      options={[
                        { label: 'Giao Hàng Tiết Kiệm (GHTK Express)', value: 'GHTK' },
                        { label: 'Giao Hàng Nhanh (GHN 2H)', value: 'GHN' },
                        { label: 'Viettel Post Toàn Quốc', value: 'VIETTEL_POST' },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Tự động thử lại khi gặp sự cố mạng (Auto-Retry)"
                    name="autoRetryOnFailure"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  {/* Form Footer */}
                  <FormFooter
                    align="center"
                    submitText="Lưu cấu hình doanh nghiệp"
                    cancelText="Tải lại"
                    loading={saving}
                    onSubmit={() => form.submit()}
                    onCancel={fetchTenant}
                  />
                </BaseCard>
              </Col>

              {/* 2. Security & Channels */}
              <Col xs={24} lg={12}>
                <BaseCard
                  icon={<SafetyCertificateFilled style={{ color: '#10B981' }} />}
                  title="Bảo mật và mã hóa dữ liệu"
                  subtitle="Tiêu chuẩn mã hóa AES-256-GCM bảo vệ an toàn Token OAuth và thông tin khách hàng"
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        Khóa mã hóa AES-256-GCM (32 Bytes)
                      </div>
                      <div style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
                        Mã hóa toàn bộ Token OAuth và thông tin khách hàng nhạy cảm
                      </div>
                      <Tag color="#10B981" style={{ marginTop: 6, fontWeight: 600 }}>
                        <CheckCircleFilled style={{ marginRight: 4 }} /> Đang kích hoạt chuẩn PCI-DSS
                      </Tag>
                    </div>

                    <BaseButton
                      variant="secondary"
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={() => setResetModalOpen(true)}
                    >
                      Tạo khóa mới
                    </BaseButton>
                  </div>

                  <Divider style={{ margin: '16px 0' }} />

                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <BellFilled style={{ color: '#ed1c24' }} /> Kênh thông báo sự cố vận hành
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        Cảnh báo qua Telegram Bot
                      </div>
                      <div style={{ color: '#6B7280', fontSize: 11 }}>
                        Gửi thông báo khi tỷ lệ lỗi vận chuyển &gt; 1%
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        Live WebSocket Alert Stream
                      </div>
                      <div style={{ color: '#6B7280', fontSize: 11 }}>
                        Phát tín hiệu âm thanh và nhấp nháy trên Dashboard
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </BaseCard>
              </Col>
            </Row>
          </Form>
        </div>
      )}

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

export default SettingsPage;
