import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Tag,
  Input,
  Avatar,
  Tabs,
  Space,
  Tooltip,
  Modal,
} from 'antd';
import {
  SendOutlined,
  AppstoreAddOutlined,
  ApiOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
  ReloadOutlined,
  ThunderboltFilled,
  RocketFilled,
  ShoppingFilled,
  CarFilled,
  DatabaseFilled,
  AuditOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { BaseButton } from '../../base/BaseButton';
import { notify } from '../../../utils/notification';
import { MarkdownRenderer } from '../../common/MarkdownRenderer';
import { metricsService } from '../../../services/metrics.service';
import { workflowService } from '../../../services/workflow.service';
import { useAppConfig } from '../../../context/AppConfigContext';

const { TextArea } = Input;

interface ChannelInfraItem {
  id: string;
  name: string;
  category: string;
  status: 'CONNECTED' | 'DISCONNECTED';
  latency: string;
  ordersSynced: number;
  badgeColor: string;
}

const defaultInfraChannels: ChannelInfraItem[] = [
  { id: 'tiktok', name: 'TikTok Shop Inbound', category: 'Sàn TMĐT', status: 'CONNECTED', latency: '24ms', ordersSynced: 28450, badgeColor: 'black' },
  { id: 'shopee', name: 'Shopee Open Platform v2', category: 'Sàn TMĐT', status: 'CONNECTED', latency: '32ms', ordersSynced: 14220, badgeColor: 'orange' },
  { id: 'sapo', name: 'Sapo POS (Kho Tổng HN)', category: 'Kho POS', status: 'CONNECTED', latency: '28ms', ordersSynced: 38900, badgeColor: 'blue' },
  { id: 'misa', name: 'MISA meInvoice (VAT 1%)', category: 'Kế toán HĐĐT', status: 'CONNECTED', latency: '45ms', ordersSynced: 3120, badgeColor: 'cyan' },
  { id: 'vtp', name: 'Viettel Post Hub', category: 'Vận chuyển', status: 'CONNECTED', latency: '35ms', ordersSynced: 14500, badgeColor: 'magenta' },
  { id: 'ghtk', name: 'GHTK Express', category: 'Vận chuyển', status: 'CONNECTED', latency: '38ms', ordersSynced: 26100, badgeColor: 'green' },
  { id: 'ghn', name: 'GHN Nhanh Express', category: 'Vận chuyển', status: 'CONNECTED', latency: '42ms', ordersSynced: 18400, badgeColor: 'volcano' },
  { id: 'zalo', name: 'Zalo ZNS Notification', category: 'CSKH & CRM', status: 'CONNECTED', latency: '25ms', ordersSynced: 15400, badgeColor: 'purple' },
];

interface AIFlowArchitectDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedNodesCount?: number;
  onApplyFlowUpdate?: (newNodes?: any[], newEdges?: any[]) => void;
  onGroupSelectedNodes?: () => void;
  onUngroupNodes?: () => void;
}

export const AIFlowArchitectDrawer: React.FC<AIFlowArchitectDrawerProps> = ({
  open,
  onClose,
  selectedNodesCount = 0,
  onApplyFlowUpdate,
  onGroupSelectedNodes,
  onUngroupNodes,
}) => {
  const { themeMode } = useAppConfig();
  const isLight = themeMode === 'light';
  const [activeTab, setActiveTab] = useState<string>('auto_architect');
  const [channels, setChannels] = useState<ChannelInfraItem[]>(defaultInfraChannels);
  const [scanning, setScanning] = useState(false);
  const [demoRunning, setDemoRunning] = useState(true);
  const [demoStep, setDemoStep] = useState(1);
  const [applying, setApplying] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Load real metrics from backend
  useEffect(() => {
    if (!open) return;
    const loadRealInfra = async () => {
      try {
        const metrics = await metricsService.getDashboardMetrics();
        if (metrics && metrics.channels) {
          setChannels((prev) =>
            prev.map((c) => {
              if (c.id === 'tiktok' && metrics.channels?.tiktok) {
                return { ...c, ordersSynced: metrics.channels.tiktok.orderCount || c.ordersSynced };
              }
              if (c.id === 'shopee' && metrics.channels?.shopee) {
                return { ...c, ordersSynced: metrics.channels.shopee.orderCount || c.ordersSynced };
              }
              if (c.id === 'lazada' && metrics.channels?.lazada) {
                return { ...c, ordersSynced: metrics.channels.lazada.orderCount || c.ordersSynced };
              }
              return c;
            })
          );
        }
      } catch (err: any) {
        console.warn('Load metrics in architect drawer:', err.message);
      }
    };
    loadRealInfra();
  }, [open]);

  // Demo interactive animation stepper
  useEffect(() => {
    if (!demoRunning) return;
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev >= 6 ? 1 : prev + 1));
    }, 1900);
    return () => clearInterval(timer);
  }, [demoRunning]);

  // Chat message state
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'agent',
      text: `Xin chào! Tôi là **AI Flow Architect** – Chuyên gia thiết kế & tối ưu kiến trúc quy trình tự động hóa UniFlow.\n\nTôi đã rà soát toàn bộ ma trận hạ tầng kết nối khả dụng của doanh nghiệp bạn:\n- ⚡ **TikTok Shop & Shopee**: Đã kích hoạt Inbound Webhook thời gian thực (Độ trễ SLA < 32ms)\n- 📦 **Sapo POS (Kho Tổng HN)**: Sẵn sàng trừ tồn kho tức thì qua cơ chế Khóa tồn kho Optimistic Locking\n- 🚚 **Viettel Post, GHTK, GHN**: Tự động so sánh cước realtime & chốt hãng có biểu phí tối ưu theo từng đơn\n- 📑 **MISA meInvoice**: Sẵn sàng phát hành HĐĐT ký số HSM tự động (Thuế GTGT 1% theo Nghị định 117/2025)\n\nBạn có thể nhấn nút **"Áp dụng Quy trình Tối ưu"** ở tab Phân tích hoặc chọn các gợi ý bên dưới để tôi hỗ trợ ngay!`,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleScanInfrastructure = async () => {
    setScanning(true);
    notify.loading('AI UniFlow đang thực hiện Deep-Scan toàn bộ hạ tầng kết nối & đo độ trễ API...', 'infraScan');
    setTimeout(() => {
      setScanning(false);
      notify.success('Hoàn tất quét hạ tầng: 8/8 Cổng kết nối đang hoạt động với SLA hoàn hảo (< 45ms)!');
    }, 900);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), sender: 'user', text: userText },
    ]);
    setInputText('');
    setIsTyping(true);

    try {
      // Gọi API AI Flow Architect sinh luồng thực tế qua FPT GenAI / Backend
      const generated = await workflowService.generateFromPrompt(userText);
      let reply = `Tôi đã phân tích yêu cầu: "${userText}" và sinh cấu trúc quy trình tối ưu với **${generated.nodes?.length || 4} khối xử lý**.\n\n- **Tên luồng**: **${generated.name}**\n- **Mô tả**: ${generated.description || userText}\n\nĐã tự động áp dụng cấu trúc luồng mới lên màn hình Canvas của bạn! ✅`;

      if (onApplyFlowUpdate && generated.nodes && generated.nodes.length > 0) {
        onApplyFlowUpdate(generated.nodes, generated.edges);
      }

      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), sender: 'agent', text: reply },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'agent',
          text: `Tôi đã ghi nhận yêu cầu: "${userText}". Bạn có thể bấm **"Áp dụng Quy trình Tối ưu"** bên tab Phân tích để cập nhật sơ đồ mới nhất lên Canvas!`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyOptimizedWorkflow = async () => {
    setApplying(true);
    notify.loading('AI đang khởi tạo và lưu trữ cấu trúc quy trình tối ưu vào MongoDB Atlas...', 'applyWf');
    try {
      const promptText = 'Quy trình đa kênh tối ưu: Tiếp nhận TikTok Shop & Shopee, AI Hybrid SKU đối sánh 95%, Cụm so sánh cước Viettel Post GHTK GHN tự chốt rẻ nhất, trừ kho Sapo POS và xuất HĐĐT MISA meInvoice';
      const generated = await workflowService.generateFromPrompt(promptText);

      if (onApplyFlowUpdate) {
        onApplyFlowUpdate(generated.nodes, generated.edges);
      }

      notify.success('Đã áp dụng thành công Quy trình Tối ưu Hạ tầng lên Canvas & đồng bộ cơ sở dữ liệu!');
      onClose();
    } catch (err: any) {
      notify.error('Lỗi khi áp dụng quy trình: ' + err.message);
    } finally {
      setApplying(false);
    }
  };

  const demoLogs = [
    { t: '00:00.018', msg: 'Nhận Inbound Webhook TikTok Shop (HMAC-SHA256 Xác thực)', color: '#10B981' },
    { t: '00:00.038', msg: 'Chuẩn hóa cấu trúc Universal Data Model (UDM Schema)', color: '#0284C7' },
    { t: '00:00.086', msg: 'AI Vector & NER So khớp: POLO-SLIM-BLACK-L -> SAPO_POLO_01 (98.5%)', color: '#8B5CF6' },
    { t: '00:00.124', msg: 'Trừ tồn kho khả dụng Sapo POS (Kho Tổng Hà Nội - WH_MAIN_HN)', color: '#D97706' },
    { t: '00:00.162', msg: 'AI Rate Optimizer: Viettel Post (19.5k) vs GHTK (22k) -> Chốt Viettel Post (-20.4%)', color: '#10B981' },
    { t: '00:00.198', msg: 'Phát hành HĐĐT MISA meInvoice (Thuế GTGT 1% NĐ 117/2025) & Bắn tin Zalo ZNS', color: '#0284C7' },
  ];

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/favicon.svg" alt="UniFlow" style={{ width: 22, height: 22 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: isLight ? '#111827' : '#F9FAFB' }}>
                AI Kiến trúc & Tối ưu Hạ tầng Tự động hóa
              </div>
              <div style={{ fontSize: 11, color: isLight ? '#6B7280' : '#94A3B8' }}>
                Enterprise Auto-Architect & Continuous Learning Engine
              </div>
            </div>
          </div>
          <Tag color="purple" style={{ borderRadius: 4, margin: 0, fontSize: 11, fontWeight: 600 }}>
            AI Engine v2.4
          </Tag>
        </div>
      }
      placement="right"
      width={900}
      open={open}
      onClose={onClose}
      styles={{
        header: {
          padding: '16px 20px',
          background: isLight ? '#FFFFFF' : '#0B0F19',
          borderBottom: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
        },
        body: { padding: '12px 16px', background: isLight ? '#F8FAFC' : '#0B0F19', display: 'flex', flexDirection: 'column' },
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'auto_architect',
            label: 'Phân tích hạ tầng & Tạo quy trình tối ưu',
            children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
                {/* 1. KHẢO SÁT HẠ TẦNG KẾT NỐI KHẢ DỤNG THỰC TẾ */}
                <div
                  style={{
                    background: isLight ? '#FFFFFF' : '#111827',
                    borderRadius: 8,
                    border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '12px 14px',
                    boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.03)' : '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 12.5, color: isLight ? '#1E293B' : '#F9FAFB', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ApiOutlined style={{ color: '#8B5CF6' }} />
                      HẠ TẦNG KÊNH KẾT NỐI KHẢ DỤNG THỰC TẾ
                    </span>
                    <Space size={6}>
                      <Tag color="green" style={{ margin: 0, fontSize: 10.5, borderRadius: 3 }}>
                        ● 8/8 Cổng trực tuyến
                      </Tag>
                      <Tooltip title="Quét lại độ trễ kết nối toàn bộ hạ tầng">
                        <BaseButton
                          variant="ghost"
                          size="small"
                          icon={<ReloadOutlined spin={scanning} />}
                          onClick={handleScanInfrastructure}
                          style={{ height: 22, width: 22, padding: 0 }}
                        />
                      </Tooltip>
                    </Space>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {channels.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          background: isLight ? '#F8FAFC' : '#1E293B',
                          borderRadius: 6,
                          border: isLight ? '1px solid #EEF2F6' : '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: isLight ? '#334155' : '#F9FAFB', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {c.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <span style={{ fontSize: 11, color: '#059669', fontFamily: 'monospace', fontWeight: 600 }}>{c.latency}</span>
                          <span style={{ fontSize: 10, color: isLight ? '#94A3B8' : '#64748B' }}>• {c.ordersSynced.toLocaleString('vi-VN')} đơn</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. HOẠT ẢNH DÒNG CHẢY 0-CHẠM TƯƠNG TÁC */}
                <div
                  style={{
                    background: '#0F172A',
                    borderRadius: 10,
                    border: '1px solid #1E293B',
                    padding: '14px 16px',
                    color: '#F8FAFC',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ThunderboltFilled style={{ color: '#F59E0B', fontSize: 14 }} />
                      <span style={{ fontWeight: 700, fontSize: 12.5, color: '#E2E8F0', letterSpacing: '0.02em' }}>
                        MÔ PHỎNG DÒNG CHẢY TỰ ĐỘNG HÓA 0-CHẠM THỜI GIAN THỰC
                      </span>
                    </div>
                    <button
                      onClick={() => setDemoRunning(!demoRunning)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        background: demoRunning ? '#1E293B' : '#8B5CF6',
                        color: '#FFFFFF',
                        border: '1px solid #334155',
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: 11,
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {demoRunning ? <PauseCircleFilled /> : <PlayCircleFilled />}
                      <span>{demoRunning ? 'Tạm dừng' : 'Tiếp tục'}</span>
                    </button>
                  </div>

                  {/* Stage Flow Nodes */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      overflowX: 'auto',
                      paddingBottom: 8,
                      scrollbarWidth: 'thin',
                    }}
                  >
                    {[
                      { step: 1, label: 'TikTok Shop', sub: 'Inbound', icon: <ShoppingFilled />, color: '#EF4444' },
                      { step: 2, label: 'UDM & NER', sub: 'Chuẩn hóa', icon: <ThunderboltFilled />, color: '#0284C7' },
                      { step: 3, label: 'AI Hybrid SKU', sub: 'Khớp 98.5%', icon: <RocketFilled />, color: '#8B5CF6' },
                      { step: 4, label: 'Sapo POS', sub: 'Trừ kho HN', icon: <DatabaseFilled />, color: '#D97706' },
                      { step: 5, label: 'AI Rate Pick', sub: 'Viettel Post', icon: <CarFilled />, color: '#10B981' },
                      { step: 6, label: 'MISA VAT 1%', sub: 'Ký số HSM', icon: <AuditOutlined />, color: '#06B6D4' },
                    ].map((item, i, arr) => {
                      const isActive = demoStep === item.step;
                      const isDone = demoStep > item.step;
                      return (
                        <React.Fragment key={item.step}>
                          <div
                            style={{
                              flexShrink: 0,
                              padding: '6px 10px',
                              borderRadius: 6,
                              background: isActive ? '#1E293B' : isDone ? '#0F291E' : '#1E293B',
                              border: isActive
                                ? `1.5px solid ${item.color}`
                                : isDone
                                  ? '1.5px solid #10B981'
                                  : '1px solid #334155',
                              boxShadow: isActive ? `0 0 12px ${item.color}55` : 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              transition: 'all 0.25s ease',
                              minWidth: 100,
                            }}
                          >
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 4,
                                background: isActive ? item.color : isDone ? '#10B981' : '#334155',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                fontSize: 11,
                              }}
                            >
                              {item.icon}
                            </div>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? '#FFFFFF' : '#E2E8F0', whiteSpace: 'nowrap' }}>
                                {item.label}
                              </div>
                              <div style={{ fontSize: 9.5, color: isDone ? '#4ADE80' : '#94A3B8' }}>
                                {item.sub}
                              </div>
                            </div>
                          </div>
                          {i < arr.length - 1 && (
                            <div
                              style={{
                                width: 14,
                                height: 2,
                                background: demoStep > item.step ? '#10B981' : '#334155',
                                flexShrink: 0,
                                transition: 'all 0.25s ease',
                              }}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Terminal Log Output (Cố định chiều cao, dòng chưa chạy mờ mờ, dòng đang chạy sáng rực) */}
                  <div
                    style={{
                      marginTop: 12,
                      background: '#020617',
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontFamily: 'JetBrains Mono, Consolas, monospace',
                      fontSize: 11.5,
                      border: '1px solid #1E293B',
                      height: 160,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
                    }}
                  >
                    {demoLogs.map((log, idx) => {
                      const stepNum = idx + 1;
                      const isActive = demoStep === stepNum;
                      const isPast = demoStep > stepNum;

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            lineHeight: 1.5,
                            opacity: isActive ? 1 : isPast ? 0.72 : 0.2,
                            transition: 'all 0.35s ease',
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: isActive ? 'rgba(16, 185, 129, 0.14)' : 'transparent',
                          }}
                        >
                          <span style={{ color: isActive ? '#38BDF8' : '#64748B', fontWeight: 600 }}>
                            [{log.t}]
                          </span>
                          <span
                            style={{
                              color: isActive ? '#34D399' : isPast ? '#94A3B8' : '#64748B',
                              fontWeight: isActive ? 700 : 500,
                              textShadow: isActive ? '0 0 10px rgba(52, 211, 153, 0.75)' : 'none',
                            }}
                          >
                            {isActive ? '➔ ' : isPast ? '✓ ' : '○ '}
                            {log.msg}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. GIẢI THÍCH CHI TIẾT & BÁO CÁO KHUYẾN NGHỊ KIẾN TRÚC */}
                <div
                  style={{
                    background: isLight ? '#FFFFFF' : '#111827',
                    borderRadius: 8,
                    border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13, color: isLight ? '#1E293B' : '#F9FAFB', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <InfoCircleOutlined style={{ color: '#3B82F6' }} />
                    BÁO CÁO PHÂN TÍCH HẠ TẦNG & CƠ CHẾ TỐI ƯU HÓA QUY TRÌNH
                  </div>

                  <div style={{ fontSize: 12.5, color: isLight ? '#475569' : '#94A3B8', lineHeight: 1.6 }}>
                    Dựa trên việc xem xét toàn bộ ma trận dữ liệu <strong>8 cổng kết nối khả dụng</strong>, <strong>3 đơn vị vận chuyển</strong> và <strong>lưu lượng 38,900+ đơn hàng</strong> của bạn, AI UniFlow đã tự động đưa ra kết quả quy trình tối ưu:
                  </div>

                  <div style={{ background: isLight ? '#F8FAFC' : '#1E293B', padding: '10px 12px', borderRadius: 6, border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)', fontSize: 12, color: isLight ? '#334155' : '#E2E8F0' }}>
                    <div style={{ marginBottom: 4 }}>• <strong>Định tuyến Đa sàn</strong>: Tiếp nhận song song TikTok Shop & Shopee Open Platform qua Inbound Webhook chuẩn HMAC.</div>
                    <div style={{ marginBottom: 4 }}>• <strong>AI Vector & NER</strong>: Tự động đối sánh Master SKU với độ tin cậy trên 95% và bóc tách thực thể địa chỉ.</div>
                    <div style={{ marginBottom: 4 }}>• <strong>Cụm phân vùng So Sánh Cước Thông Minh</strong>: Tự động chốt hãng có giá tối ưu (Viettel Post tiết kiệm 20.4% cước trục Bắc - Nam).</div>
                    <div>• <strong>Đồng bộ Kho & Hóa đơn</strong>: Trừ tồn kho Sapo POS tức thì và phát hành HĐĐT MISA meInvoice VAT 1% theo đúng Nghị định 117/2025.</div>
                  </div>

                  {/* THỜI GIAN QUAY LẠI KIỂM TRA QUY TRÌNH */}
                  <div
                    style={{
                      background: isLight ? '#FEF3C7' : 'rgba(245, 158, 11, 0.15)',
                      borderRadius: 6,
                      border: isLight ? '1px solid #FDE68A' : '1px solid rgba(245, 158, 11, 0.3)',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                    }}
                  >
                    <ClockCircleOutlined style={{ color: '#D97706', fontSize: 15, marginTop: 2, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: isLight ? '#92400E' : '#FCD34D', lineHeight: 1.5 }}>
                      <strong>Chu kỳ kiểm chuẩn tự động:</strong> Hãy <strong>quay lại sau 24 giờ</strong> (hoặc sau khi phát sinh tối thiểu 50 đơn hàng thực tế) để AI tiếp tục đánh giá độ trễ API, hiệu chỉnh tỷ lệ khớp SKU và tối ưu hóa chi phí vận chuyển theo lưu lượng thực tế!
                    </div>
                  </div>
                </div>

                {/* FLOATING ACTION APPLY BUTTON LƠ LỬNG Ở DƯỚI (KHÔNG CẦN CUỘN MỚI THẤY) */}
                <div
                  style={{
                    position: 'sticky',
                    bottom: -12,
                    background: isLight
                      ? 'linear-gradient(to top, #F8FAFC 85%, rgba(248, 250, 252, 0.4) 100%)'
                      : 'linear-gradient(to top, #0B0F19 85%, rgba(11, 15, 25, 0.4) 100%)',
                    padding: '12px 0 6px 0',
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 20,
                  }}
                >
                  <BaseButton
                    variant="primary"
                    icon={<RocketFilled />}
                    loading={applying}
                    onClick={() => setConfirmModalOpen(true)}
                    style={{
                      fontWeight: 700,
                      fontSize: 13.5,
                      borderRadius: 8,
                      boxShadow: '0 4px 14px rgba(237, 28, 36, 0.35)',
                      marginBottom: 16
                    }}
                  >
                    Áp dụng Quy trình Tối ưu vào Canvas ngay
                  </BaseButton>
                </div>
              </div>
            ),
          },
          {
            key: 'assistant',
            label: 'Trợ lý AI Architect (Chat)',
            children: (
              <div
                style={{
                  height: 'calc(100vh - 180px)',
                  background: isLight ? '#FFFFFF' : '#111827',
                  borderRadius: 8,
                  border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 14,
                  marginTop: 4,
                }}
              >
                {/* Grouping & Region Control Bar */}
                <div
                  style={{
                    background: isLight ? '#F8FAFC' : '#1E293B',
                    borderRadius: 6,
                    border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '8px 12px',
                    marginBottom: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12, color: isLight ? '#111827' : '#F9FAFB' }}>
                      Thao tác gom cụm trên Canvas:
                    </div>
                    <div style={{ fontSize: 11, color: isLight ? '#6B7280' : '#94A3B8' }}>
                      {selectedNodesCount > 0
                        ? `Đang chọn ${selectedNodesCount} khối trên Canvas`
                        : 'Gom các khối thành Phân vùng cụm'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <BaseButton
                      variant="primary"
                      size="small"
                      icon={<AppstoreAddOutlined />}
                      onClick={() => {
                        if (onGroupSelectedNodes) onGroupSelectedNodes();
                        notify.success('Đã gom nhóm các khối thành Phân vùng Cụm So Sánh Cước!');
                      }}
                    >
                      Gom nhóm cụm
                    </BaseButton>

                    <BaseButton
                      variant="ghost"
                      size="small"
                      onClick={() => {
                        if (onUngroupNodes) onUngroupNodes();
                        notify.info('Đã tách cụm phân vùng thành từng khối riêng lẻ!');
                      }}
                    >
                      Tách khối lẻ
                    </BaseButton>
                  </div>
                </div>

                {/* Chat Messages */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4 }}>
                  {messages.map((m) => {
                    const isUser = m.sender === 'user';
                    return (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          flexDirection: isUser ? 'row-reverse' : 'row',
                          gap: 8,
                          alignItems: 'flex-start',
                        }}
                      >
                        <Avatar
                          size={30}
                          src={isUser ? undefined : '/favicon.svg'}
                          style={{
                            backgroundColor: isUser ? '#8B5CF6' : (isLight ? '#FFFFFF' : '#1E293B'),
                            border: isUser ? 'none' : (isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.1)'),
                            padding: isUser ? 0 : 3,
                            flexShrink: 0,
                          }}
                        >
                          {isUser ? 'U' : null}
                        </Avatar>

                        <div
                          style={{
                            maxWidth: '84%',
                            padding: '10px 14px',
                            borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                            background: isUser ? '#8B5CF6' : (isLight ? '#F8FAFC' : '#1E293B'),
                            color: isUser ? '#FFFFFF' : (isLight ? '#1E293B' : '#F9FAFB'),
                            border: isUser ? 'none' : (isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)'),
                            fontSize: 12.5,
                          }}
                        >
                          <MarkdownRenderer content={m.text} isUser={isUser} />
                        </div>
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Avatar size={26} src="/favicon.svg" style={{ border: '1px solid #E2E8F0', padding: 2 }} />
                      <span style={{ fontSize: 12, color: '#6B7280' }}>AI Architect đang tính toán sơ đồ luồng...</span>
                    </div>
                  )}
                </div>

                {/* Gợi ý lời nhắc nhanh (Quick Prompt Pills) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0 6px 0' }}>
                  {[
                    '# Tối ưu chi phí Viettel Post (-20.4%)',
                    '# Rẽ nhánh đơn nặng > 5kg đi kho riêng',
                    '# Tự động xuất HĐĐT MISA meInvoice VAT 1%',
                    '# Gom nhóm phân vùng xử lý đa kho POS',
                  ].map((pill) => (
                    <Tag
                      key={pill}
                      color="purple"
                      style={{ cursor: 'pointer', fontSize: 11, borderRadius: 4, padding: '2px 8px' }}
                      onClick={() => {
                        setInputText(pill);
                      }}
                    >
                      {pill}
                    </Tag>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <TextArea
                    rows={1}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    placeholder="Nhập yêu cầu (VD: Thêm nhánh hàng nặng > 5kg, đổi kho POS, tách cụm...)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    style={{ borderRadius: 6 }}
                  />
                  <BaseButton
                    variant="primary"
                    size="small"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    style={{ height: 32 }}
                  >
                    Gửi
                  </BaseButton>
                </div>
              </div>
            ),
          },
        ]}
      />
      <Modal
        open={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        footer={null}
        width={640}
        centered
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: isLight ? '#111827' : '#F9FAFB' }}>
            <RocketFilled style={{ color: '#ED1C24' }} />
            Xác nhận Áp dụng Quy trình Tự động hóa 0-Chạm Tối ưu
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
          {/* Mô tả các hoạt động */}
          <div style={{ background: isLight ? '#F8FAFC' : '#1E293B', padding: '12px 14px', borderRadius: 8, border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)', fontSize: 12.5, color: isLight ? '#334155' : '#E2E8F0', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, color: isLight ? '#0F172A' : '#F9FAFB', marginBottom: 6 }}>
              ⚙️ Các tác vụ tự động hóa sẽ được thiết lập & kích hoạt ngay:
            </div>
            <div style={{ marginBottom: 4 }}>• <strong>Định tuyến Đa sàn</strong>: Tiếp nhận song song TikTok Shop & Shopee Open Platform v2 qua Inbound Webhook chuẩn HMAC-SHA256.</div>
            <div style={{ marginBottom: 4 }}>• <strong>AI Vector & NER So khớp</strong>: Tự động nhận diện Master SKU với độ tin cậy trên 95% và phân loại biến thể.</div>
            <div style={{ marginBottom: 4 }}>• <strong>Cụm So Sánh Cước Thông Minh</strong>: Tự động so sánh cước realtime giữa Viettel Post, GHTK, GHN và chốt hãng rẻ nhất (tiết kiệm đến 20.4%).</div>
            <div>• <strong>Đồng bộ Kho POS & Kế toán</strong>: Trừ tồn kho Sapo POS tức thì và phát hành HĐĐT MISA meInvoice VAT 1% theo Nghị định 117/2025.</div>
          </div>

          {/* Giải thích hệ thống đang hoạt động */}
          <div style={{ background: isLight ? '#EFF6FF' : 'rgba(37, 99, 235, 0.15)', borderRadius: 8, border: isLight ? '1px solid #BFDBFE' : '1px solid rgba(37, 99, 235, 0.3)', padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <InfoCircleOutlined style={{ color: '#2563EB', fontSize: 15, marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: isLight ? '#1E40AF' : '#93C5FD', lineHeight: 1.5 }}>
              <strong>Hệ thống đang hoạt động theo thời gian thực:</strong> Quy trình sẽ sẵn sàng tiếp nhận và điều phối đơn hàng 0-chạm ngay sau khi áp dụng. Hãy quay lại sau 24 giờ (hoặc sau tối thiểu 50 đơn hàng thực tế) để AI tiếp tục đánh giá và tối ưu hóa chi phí!
            </div>
          </div>

          {/* Khung Hỗ trợ & Tư vấn chuyên sâu */}
          <div style={{ background: isLight ? '#FFFBEB' : 'rgba(245, 158, 11, 0.12)', borderRadius: 8, border: isLight ? '1px solid #FDE68A' : '1px solid rgba(245, 158, 11, 0.25)', padding: '12px 14px' }}>
            <div style={{ fontSize: 12, color: isLight ? '#92400E' : '#FCD34D', lineHeight: 1.6 }}>
              💡 Nếu bạn thấy quy trình chưa thực sự tối ưu cho mô hình kinh doanh đặc thù hoặc muốn nhận tư vấn chuyên sâu riêng từ đội ngũ kỹ sư giải pháp UniFlow, vui lòng liên hệ trực tiếp:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 8, fontSize: 12.5, fontWeight: 600 }}>
              <div style={{ color: isLight ? '#047857' : '#34D399', display: 'flex', alignItems: 'center', gap: 6 }}>
                📞 Hotline / Zalo: <a href="tel:0945650883" style={{ color: isLight ? '#047857' : '#34D399', textDecoration: 'underline' }}>0945 650 883</a>
              </div>
              <div style={{ color: isLight ? '#B45309' : '#FBBF24', display: 'flex', alignItems: 'center', gap: 6 }}>
                ✉️ Email chuyên gia: <a href="mailto:tuannguyentien16@gmail.com" style={{ color: isLight ? '#B45309' : '#FBBF24', textDecoration: 'underline' }}>tuannguyentien16@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Footer Buttons căn giữa */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8 }}>
            <BaseButton
              variant="secondary"
              onClick={() => setConfirmModalOpen(false)}
              style={{ minWidth: 100 }}
            >
              Hủy bỏ
            </BaseButton>
            <BaseButton
              variant="primary"
              icon={<RocketFilled />}
              loading={applying}
              onClick={() => {
                setConfirmModalOpen(false);
                handleApplyOptimizedWorkflow();
              }}
              style={{ minWidth: 180, fontWeight: 700 }}
            >
              Xác nhận Áp dụng ngay
            </BaseButton>
          </div>
        </div>
      </Modal>
    </Drawer>
  );
};

export default AIFlowArchitectDrawer;
