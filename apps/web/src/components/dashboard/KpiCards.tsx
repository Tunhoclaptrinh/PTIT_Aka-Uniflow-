import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Tag } from 'antd';
import {
  SyncOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { metricsService, DashboardMetrics } from '../../services/metrics.service';

export const KpiCards: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSyncedOrders: 42850,
    averageLatencyMs: 180,
    successRate: 99.98,
    costSavedVND: 21500000,
    healedOrdersCount: 0,
    totalLogsCount: 0,
  });

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await metricsService.getMetrics();
        if (data) setMetrics(data);
      } catch (err: any) {
        console.warn('Lấy metrics API lỗi, sử dụng fallback:', err.message);
      }
    };
    loadMetrics();
    const interval = setInterval(loadMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Row gutter={[16, 16]}>
      {/* KPI 1: Đơn hàng đã đồng bộ */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500 }}>
              Tổng đơn đã đồng bộ
            </span>
            <Tag color="#ed1c24" style={{ borderRadius: 6, fontWeight: 600 }}>
              <ArrowUpOutlined /> +18.4%
            </Tag>
          </div>
          <Statistic
            value={metrics.totalSyncedOrders}
            valueStyle={{ color: '#F9FAFB', fontWeight: 800, fontSize: 28, marginTop: 8 }}
            prefix={<SyncOutlined spin style={{ color: '#ed1c24', marginRight: 8 }} />}
          />
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
            Tự động 100% trong 24h qua
          </div>
        </Card>
      </Col>

      {/* KPI 2: Độ trễ phản hồi (End-to-End Latency) */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500 }}>
              Độ trễ trung bình E2E
            </span>
            <Tag color="#10B981" style={{ borderRadius: 6, fontWeight: 600 }}>
              Siêu tốc
            </Tag>
          </div>
          <Statistic
            value={metrics.averageLatencyMs}
            suffix="ms"
            valueStyle={{ color: '#10B981', fontWeight: 800, fontSize: 28, marginTop: 8 }}
            prefix={<ThunderboltOutlined style={{ color: '#10B981', marginRight: 8 }} />}
          />
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
            Chuẩn SLA &lt; 500ms đối tác
          </div>
        </Card>
      </Col>

      {/* KPI 3: Tỷ lệ thành công */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500 }}>
              Tỷ lệ đồng bộ thành công
            </span>
            <Tag color="#3B82F6" style={{ borderRadius: 6, fontWeight: 600 }}>
              SLA Enterprise
            </Tag>
          </div>
          <Statistic
            value={metrics.successRate}
            suffix="%"
            valueStyle={{ color: '#F9FAFB', fontWeight: 800, fontSize: 28, marginTop: 8 }}
            prefix={<CheckCircleOutlined style={{ color: '#10B981', marginRight: 8 }} />}
          />
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
            Tự chữa lành: {metrics.healedOrdersCount} sự cố
          </div>
        </Card>
      </Col>

      {/* KPI 4: Chi phí & Thời gian tiết kiệm */}
      <Col xs={24} sm={12} lg={6}>
        <Card
          bordered={false}
          style={{
            background: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9CA3AF', fontSize: 13, fontWeight: 500 }}>
              Chi phí tiết kiệm tháng này
            </span>
            <Tag color="#fcc20f" style={{ borderRadius: 6, fontWeight: 600, color: '#0B0F19' }}>
              ~142 Giờ Công
            </Tag>
          </div>
          <Statistic
            value={metrics.costSavedVND}
            formatter={(val) => `${(Number(val) / 1000000).toFixed(1)} Tr VNĐ`}
            valueStyle={{ color: '#fcc20f', fontWeight: 800, fontSize: 28, marginTop: 8 }}
            prefix={<DollarOutlined style={{ color: '#fcc20f', marginRight: 8 }} />}
          />
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 8 }}>
            Giảm 90% thao tác tay nhân sự
          </div>
        </Card>
      </Col>
    </Row>
  );
};
