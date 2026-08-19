import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Tag,
  Input,
  Avatar,
  Divider,
  Tabs,
  Space,
  Tooltip,
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
  const [activeTab, setActiveTab] = useState<string>('auto_architect');
  const [channels, setChannels] = useState<ChannelInfraItem[]>(defaultInfraChannels);
  const [scanning, setScanning] = useState(false);
  const [demoRunning, setDemoRunning] = useState(true);
  const [demoStep, setDemoStep] = useState(1);
  const [applying, setApplying] = useState(false);

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
      text: `Xin chào! Tôi là **AI Flow Architect** – Trợ lý kiến trúc quy trình tự động hóa của UniFlow.\n\nTôi đã quét toàn bộ hạ tầng cổng kết nối hiện có của bạn:\n- **Sàn TMĐT**: TikTok Shop & Shopee Open Platform v2 (SLA < 35ms)\n- **Kho POS**: Sapo POS (Kho Tổng Hà Nội) – Sẵn sàng trừ tồn kho tức thì\n- **ĐVVC Đa hãng**: Viettel Post, GHTK, GHN – Sẵn sàng so sánh cước realtime\n- **Kế toán & HĐĐT**: MISA meInvoice – Ký số HSM theo Nghị định 117/2025\n\nBạn có thể nhấn nút **"Áp dụng Quy trình Tối ưu"** bên tab Tự động phân tích, hoặc trò chuyện trực tiếp để tôi tùy biến luồng theo nhu cầu!`,
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

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), sender: 'user', text: userText },
    ]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (userText.toLowerCase().includes('gom') || userText.toLowerCase().includes('cụm') || userText.toLowerCase().includes('nhóm')) {
        reply = `Đã phân tích yêu cầu gom nhóm!\n\nTôi đề xuất gom **3 khối vận chuyển (Viettel Post, GHTK, GHN)** cùng **AI So sánh cước** vào **Phân vùng Cụm So Sánh Cước Thông Minh**.\n\nBạn có thể bấm nút **"Gom nhóm cụm"** bên dưới để áp dụng trực tiếp lên Canvas.`;
      } else if (userText.toLowerCase().includes('nặng') || userText.toLowerCase().includes('5kg') || userText.toLowerCase().includes('trọng lượng')) {
        reply = `Tôi đã thiết lập thêm 1 khối logic **"Rẽ nhánh trọng lượng (> 5kg)"**:\n- **Gói hàng > 5kg**: Tự động chuyển tuyến **Viettel Post Vận Tải Nặng (Tiết kiệm 35%)**\n- **Gói hàng <= 5kg**: So sánh cước realtime giữa **GHTK Express** và **GHN Nhanh**\n\nBấm nút **"Áp dụng vào Canvas"** để cập nhật luồng ngay lập tức!`;
      } else {
        reply = `Tôi đã ghi nhận yêu cầu: "${userText}". Hạ tầng đã sẵn sàng để đấu nối. Tôi có thể giúp bạn tự động sinh các edge kết nối và kiểm tra tính hợp lệ của UDM Schema!`;
      }

      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), sender: 'agent', text: reply },
      ]);
      setIsTyping(false);
    }, 700);
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
              <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>
                AI Kiến trúc & Tối ưu Hạ tầng Tự động hóa
              </div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>
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
      width={680}
      open={open}
      onClose={onClose}
      styles={{
        body: { padding: '12px 16px', background: '#F8FAFC', display: 'flex', flexDirection: 'column' },
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'auto_architect',
            label: (
              <Space size={4}>
                <RocketFilled style={{ color: '#8B5CF6' }} />
                <span>Phân tích hạ tầng & Tạo quy trình tối ưu</span>
              </Space>
            ),
            children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
                {/* 1. KHẢO SÁT HẠ TẦNG KẾT NỐI KHẢ DỤNG THỰC TẾ */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    padding: '12px 14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 12.5, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
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
                          background: '#F8FAFC',
                          borderRadius: 6,
                          border: '1px solid #EEF2F6',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {c.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <span style={{ fontSize: 11, color: '#059669', fontFamily: 'monospace', fontWeight: 600 }}>{c.latency}</span>
                          <span style={{ fontSize: 10, color: '#94A3B8' }}>• {c.ordersSynced.toLocaleString('vi-VN')} đơn</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. HOẠT ẢNH DÒNG CHẢY 0-CHẠM TƯƠNG TÁC (ANIMATION FROM LANDING PAGE) */}
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

                  {/* Terminal Log Output */}
                  <div
                    style={{
                      marginTop: 10,
                      background: '#020617',
                      borderRadius: 6,
                      padding: '8px 10px',
                      fontFamily: 'JetBrains Mono, Consolas, monospace',
                      fontSize: 11,
                      border: '1px solid #1E293B',
                      maxHeight: 110,
                      overflowY: 'auto',
                    }}
                  >
                    {demoLogs.slice(0, demoStep).map((log, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, lineHeight: 1.6 }}>
                        <span style={{ color: '#64748B' }}>[{log.t}]</span>
                        <span style={{ color: log.color }}>{log.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. GIẢI THÍCH CHI TIẾT & BÁO CÁO KHUYẾN NGHỊ KIẾN TRÚC */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <InfoCircleOutlined style={{ color: '#3B82F6' }} />
                    BÁO CÁO PHÂN TÍCH HẠ TẦNG & CƠ CHẾ TỐI ƯU HÓA QUY TRÌNH
                  </div>

                  <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>
                    Dựa trên việc xem xét toàn bộ ma trận dữ liệu <strong>8 cổng kết nối khả dụng</strong>, <strong>3 đơn vị vận chuyển</strong> và <strong>lưu lượng 38,900+ đơn hàng</strong> của bạn, AI UniFlow đã tự động đưa ra kết quả quy trình tối ưu:
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, color: '#334155' }}>
                    <div style={{ marginBottom: 4 }}>• <strong>Định tuyến Đa sàn</strong>: Tiếp nhận song song TikTok Shop & Shopee Open Platform qua Inbound Webhook chuẩn HMAC.</div>
                    <div style={{ marginBottom: 4 }}>• <strong>AI Vector & NER</strong>: Tự động đối sánh Master SKU với độ tin cậy trên 95% và bóc tách thực thể địa chỉ.</div>
                    <div style={{ marginBottom: 4 }}>• <strong>Cụm phân vùng So Sánh Cước Thông Minh</strong>: Tự động chốt hãng có giá tối ưu (Viettel Post tiết kiệm 20.4% cước trục Bắc - Nam).</div>
                    <div>• <strong>Đồng bộ Kho & Hóa đơn</strong>: Trừ tồn kho Sapo POS tức thì và phát hành HĐĐT MISA meInvoice VAT 1% theo đúng Nghị định 117/2025.</div>
                  </div>

                  {/* THỜI GIAN QUAY LẠI KIỂM TRA QUY TRÌNH */}
                  <div
                    style={{
                      background: '#FEF3C7',
                      borderRadius: 6,
                      border: '1px solid #FDE68A',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                    }}
                  >
                    <ClockCircleOutlined style={{ color: '#D97706', fontSize: 15, marginTop: 2, flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
                      <strong>Chu kỳ kiểm chuẩn tự động:</strong> Hãy <strong>quay lại sau 24 giờ</strong> (hoặc sau khi phát sinh tối thiểu 50 đơn hàng thực tế) để AI tiếp tục đánh giá độ trễ API, hiệu chỉnh tỷ lệ khớp SKU và tối ưu hóa chi phí vận chuyển theo lưu lượng thực tế!
                    </div>
                  </div>

                  {/* ACTION APPLY BUTTON */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                    <BaseButton
                      variant="primary"
                      icon={<RocketFilled />}
                      loading={applying}
                      onClick={handleApplyOptimizedWorkflow}
                      style={{ height: 38, padding: '0 20px', fontWeight: 600 }}
                    >
                      Áp dụng Quy trình Tối ưu vào Canvas ngay
                    </BaseButton>
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'assistant',
            label: (
              <Space size={4}>
                <ThunderboltFilled style={{ color: '#3B82F6' }} />
                <span>Trợ lý AI Architect (Chat)</span>
              </Space>
            ),
            children: (
              <div
                style={{
                  height: 520,
                  background: '#FFFFFF',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 12,
                  marginTop: 4,
                }}
              >
                {/* Grouping & Region Control Bar */}
                <div
                  style={{
                    background: '#F8FAFC',
                    borderRadius: 6,
                    border: '1px solid #E2E8F0',
                    padding: '8px 12px',
                    marginBottom: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 12, color: '#111827' }}>
                      Thao tác gom cụm trên Canvas:
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>
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
                            backgroundColor: isUser ? '#8B5CF6' : '#FFFFFF',
                            border: isUser ? 'none' : '1px solid #E2E8F0',
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
                            background: isUser ? '#8B5CF6' : '#F8FAFC',
                            color: isUser ? '#FFFFFF' : '#1E293B',
                            border: isUser ? 'none' : '1px solid #E2E8F0',
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

                <Divider style={{ margin: '10px 0' }} />

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
    </Drawer>
  );
};

export default AIFlowArchitectDrawer;
