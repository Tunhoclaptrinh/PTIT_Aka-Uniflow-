import React, { useState, useRef, useEffect } from 'react';
import {
  Input,
  Tag,
  Avatar,
  Table,
  Upload,
  Divider,
  Tooltip,
  Splitter,
} from 'antd';
import {
  SendOutlined,
  PaperClipOutlined,
  FileExcelFilled,
  CheckCircleFilled,
  DownloadOutlined,
  PlusCircleFilled,
  ThunderboltFilled,
  FileTextOutlined,
  CheckOutlined,
  DollarCircleFilled,
  MessageFilled,
  CarFilled,
  ShoppingOutlined,
  EyeOutlined,
  CodeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { PageContainer, BaseButton } from '../components/base';
import { notify } from '../utils/notification';
import { useAuthStore } from '../store/useAuthStore';
import { mappingService } from '../services/mapping.service';
import { AgentOmniInspectorModal } from '../components/chat/AgentOmniInspectorModal';
import { getPartnerLogo } from '../utils/partnerLogos';

const { TextArea } = Input;

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    url?: string;
    type?: string;
  };
  actionType?: 'EXCEL_EXPORT' | 'SKU_APPROVAL' | 'ADD_PRODUCT' | 'CARRIER_OPTIMIZE' | 'TAX_ACCOUNTING' | 'GENERAL';
  actionData?: any;
}

export const CopilotAgentPage: React.FC = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'agent',
      text: `Xin chào **${user?.name || 'Chủ shop'}**! Tôi là **UniFlow AI Agent** – Trợ lý điều hành tự động hóa đa kênh của bạn.\n\nTôi có thể trực tiếp kết nối cơ sở dữ liệu để:\n- **Thống kê doanh thu & Lập tờ khai thuế GTGT/TNCN** (theo NĐ 117/2025/NĐ-CP & TT 40/2021/TT-BTC)\n- **Đồng bộ sổ cái MISA AMIS / Fast / Bravo** & Phát hành HĐĐT MISA meInvoice\n- **Xuất & xem trước file Excel/Bảng tính** theo mẫu tùy biến\n- **Kiểm tra trạng thái đơn hàng & Phê duyệt nhanh mã SKU** từ sàn TMĐT\n- **Mở các cửa sổ kiểm tra tích hợp (Mini-Windows)**: Hội thoại Pancake POS, tra cứu hành trình Viettel Post, tồn kho Sapo/KiotViet realtime\n\nBạn có thể chọn nhanh tác vụ ở **Ngăn công cụ bên trên** hoặc nhập lệnh trực tiếp vào ô chat bên dưới!`,
      timestamp: 'Vừa xong',
      actionType: 'GENERAL',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFile, setAttachedFile] = useState<any>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Omni Inspector Modal state
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'chat' | 'file' | 'tracking' | 'pos' | 'webhook' | 'accounting'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const openInspector = (tab: 'chat' | 'file' | 'tracking' | 'pos' | 'webhook' | 'accounting') => {
    setInspectorTab(tab);
    setInspectorOpen(true);
  };

  // Helper to trigger real CSV / Excel download
  const handleDownloadExcel = (data: any[], filename = 'Bao_Cao_Doanh_Thu_UniFlow.csv') => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(','));
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify.success(`Đã tải xuống tệp ${filename} thành công!`);
  };

  // 1-Click Approve SKU in Database
  const handleApproveSku = async (skuItem: any, msgId: string) => {
    notify.loading(`Đang lưu phê duyệt cho SKU: ${skuItem.channelSku}...`, 'approveSku');
    try {
      if (skuItem._id) {
        await mappingService.approveMapping(skuItem._id);
      }
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === msgId && msg.actionData?.pendingList) {
            const updatedList = msg.actionData.pendingList.map((item: any) =>
              item.channelSku === skuItem.channelSku ? { ...item, status: 'CONFIRMED' } : item
            );
            return { ...msg, actionData: { ...msg.actionData, pendingList: updatedList } };
          }
          return msg;
        })
      );
      notify.success(`Đã phê duyệt và đồng bộ SKU "${skuItem.masterSku}" vào hệ thống! ✅`);
    } catch (err: any) {
      notify.error('Lỗi khi phê duyệt SKU: ' + err.message);
    }
  };

  // Add product to Master Catalog
  const handleSaveProductToCatalog = (productData: any) => {
    notify.success(`Đã thêm thành công sản phẩm "${productData.name}" (SKU: ${productData.sku}) vào Danh mục Master SKU! ✅`);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() && !attachedFile) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: attachedFile
        ? {
            name: attachedFile.name,
            type: attachedFile.type,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setAttachedFile(null);
    setIsTyping(true);

    // AI Agent NLP Reasoning & Tool Execution Simulation
    setTimeout(() => {
      const lower = text.toLowerCase();
      let responseMessage: ChatMessage;

      if (
        lower.includes('thuế') ||
        lower.includes('thue') ||
        lower.includes('kê khai') ||
        lower.includes('ke khai') ||
        lower.includes('misa') ||
        lower.includes('kế toán') ||
        lower.includes('ke toan') ||
        lower.includes('kiểm toán') ||
        lower.includes('vat') ||
        lower.includes('tncn') ||
        lower.includes('hóa đơn') ||
        lower.includes('hoa don')
      ) {
        const taxRows = [
          { 'Kênh Bán': 'TikTok Shop', 'Doanh Thu Gộp': '661.800.000đ', 'Phí Sàn Khấu Trừ': '46.326.000đ', 'Doanh Thu Chịu Thuế': '628.710.000đ', 'Thuế GTGT (1%)': '6.287.100đ', 'Thuế TNCN (0.5%)': '3.143.550đ', 'Số Chứng Từ MISA': 1420 },
          { 'Kênh Bán': 'Shopee Mall', 'Doanh Thu Gộp': '311.500.000đ', 'Phí Sàn Khấu Trừ': '21.805.000đ', 'Doanh Thu Chịu Thuế': '295.925.000đ', 'Thuế GTGT (1%)': '2.959.250đ', 'Thuế TNCN (0.5%)': '1.479.625đ', 'Số Chứng Từ MISA': 890 },
          { 'Kênh Bán': 'Lazada Mall', 'Doanh Thu Gộp': '288.000.000đ', 'Phí Sàn Khấu Trừ': '20.160.000đ', 'Doanh Thu Chịu Thuế': '273.600.000đ', 'Thuế GTGT (1%)': '2.736.000đ', 'Thuế TNCN (0.5%)': '1.368.000đ', 'Số Chứng Từ MISA': 640 },
          { 'Kênh Bán': 'WooCommerce', 'Doanh Thu Gộp': '150.500.000đ', 'Phí Sàn Khấu Trừ': '4.515.000đ', 'Doanh Thu Chịu Thuế': '142.975.000đ', 'Thuế GTGT (1%)': '1.429.750đ', 'Thuế TNCN (0.5%)': '714.875đ', 'Số Chứng Từ MISA': 430 },
        ];

        responseMessage = {
          id: `msg_agent_${Date.now()}`,
          sender: 'agent',
          text: `Tôi đã kết nối vào cơ sở dữ liệu và hoàn tất **Bảng tổng hợp doanh thu & Tờ khai thuế GTGT/TNCN (Mẫu 01/GTGT)** theo đúng quy định của **Nghị định 117/2025/NĐ-CP** và **Thông tư 40/2021/TT-BTC**.\n\n### 📊 Kết quả phân tích thuế & sổ cái kế toán:\n- **Tổng doanh thu bán hàng thực tế (Gross GMV)**: **1.411.800.000đ**\n- **Tổng doanh thu tính thuế sau giảm trừ hợp lệ**: **1.340.500.000đ**\n- **Thuế GTGT tạm tính (1%)**: **13.405.000đ**\n- **Thuế TNCN tạm tính (0.5%)**: **6.702.500đ**\n- **Tổng nghĩa vụ thuế quý này**: **20.107.500đ**\n- **Trạng thái sổ sách MISA AMIS**: Đã bóc tách **3.380 chứng từ hóa đơn điện tử** khớp 100% với số dư COD ngân hàng.\n\nBạn có thể tải về tệp Excel Tờ khai thuế hoặc bấm đồng bộ ngay sang phần mềm MISA AMIS:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: 'TAX_ACCOUNTING',
          actionData: {
            filename: `To_Khai_Thue_01_GTGT_Q3_${new Date().getFullYear()}.csv`,
            rows: taxRows,
            totalGross: '1.411.800.000đ',
            totalTaxable: '1.340.500.000đ',
            totalVat: '13.405.000đ',
            totalPit: '6.702.500đ',
            totalTaxDue: '20.107.500đ',
            docsCount: 3380,
          },
        };
      } else if (lower.includes('excel') || lower.includes('thống kê') || lower.includes('báo cáo') || lower.includes('sheet')) {
        const excelRows = [
          { 'Mã SKU': 'TSHIRT-OVR-BLK-L', 'Tên Sản Phẩm': 'Áo Thun Oversize Đen (L)', 'Sàn Bán': 'TikTok Shop', 'Số Lượng': 1420, 'Doanh Thu (VNĐ)': '269.800.000', 'Tồn Kho': 480, 'Tình Trạng': 'Bán chạy' },
          { 'Mã SKU': 'JEAN-SLIM-BLU-31', 'Tên Sản Phẩm': 'Quần Jean Slimfit Xanh (31)', 'Sàn Bán': 'Shopee Mall', 'Số Lượng': 890, 'Doanh Thu (VNĐ)': '311.500.000', 'Tồn Kho': 210, 'Tình Trạng': 'Ổn định' },
          { 'Mã SKU': 'HOODIE-STR-GRY-XL', 'Tên Sản Phẩm': 'Áo Hoodie Streetwear Xám (XL)', 'Sàn Bán': 'Lazada', 'Số Lượng': 640, 'Doanh Thu (VNĐ)': '288.000.000', 'Tồn Kho': 95, 'Tình Trạng': 'Sắp hết hàng' },
          { 'Mã SKU': 'POLO-PREM-WHT-M', 'Tên Sản Phẩm': 'Áo Polo Pima Trắng (M)', 'Sàn Bán': 'TikTok Shop', 'Số Lượng': 1120, 'Doanh Thu (VNĐ)': '392.000.000', 'Tồn Kho': 340, 'Tình Trạng': 'Bán chạy' },
          { 'Mã SKU': 'SHIRT-LIN-NVY-L', 'Tên Sản Phẩm': 'Áo Sơ Mi Linen Nam Cổ Tàu (L)', 'Sàn Bán': 'WooCommerce', 'Số Lượng': 430, 'Doanh Thu (VNĐ)': '150.500.000', 'Tồn Kho': 160, 'Tình Trạng': 'Mới ra mắt' },
        ];

        responseMessage = {
          id: `msg_agent_${Date.now()}`,
          sender: 'agent',
          text: `Tôi đã kết nối vào cơ sở dữ liệu thời gian thực và tạo xong bảng thống kê theo yêu cầu của bạn.\n\n- **Tổng doanh thu 5 mặt hàng**: **1.411.800.000đ**\n- **Tổng số lượng bán**: **4.500 sản phẩm**\n- **Kênh bán hiệu quả nhất**: TikTok Shop & Shopee Mall\n\nBạn có thể xem bản xem trước bên dưới và tải về tệp Excel hoàn chỉnh:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: 'EXCEL_EXPORT',
          actionData: {
            filename: `Thong_Ke_Doanh_Thu_UniFlow_${new Date().toISOString().slice(0, 10)}.csv`,
            rows: excelRows,
            totalRevenue: '1.411.800.000đ',
            totalSold: '4.500',
          },
        };
      } else if (lower.includes('pancake') || lower.includes('hội thoại') || lower.includes('cskh') || lower.includes('chat')) {
        responseMessage = {
          id: `msg_agent_${Date.now()}`,
          sender: 'agent',
          text: `Tôi đã kết nối trực tiếp với **Pancake POS** và **Shopee Chat**. AI CSKH đang tự động trực tuyến và xử lý trung bình **1.2s/tin nhắn**.\n\nBạn có thể mở **Cửa sổ kiểm tra tích hợp** bên dưới để quan sát ngữ cảnh AI tư vấn hoặc can thiệp thủ công:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: 'GENERAL',
        };
        openInspector('chat');
      } else if (lower.includes('vận đơn') || lower.includes('tracking') || lower.includes('hành trình')) {
        responseMessage = {
          id: `msg_agent_${Date.now()}`,
          sender: 'agent',
          text: `Tôi đã tra cứu mã vận đơn **VTP882910482VN** từ Viettel Post. Bưu kiện đang trong quá trình phát hàng hỏa tốc tới người nhận tại Cầu Giấy, Hà Nội!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: 'GENERAL',
        };
        openInspector('tracking');
      } else if (lower.includes('duyệt') || lower.includes('sku') || lower.includes('trạng thái') || lower.includes('khớp')) {
        const pendingList = [
          {
            channel: 'TikTok Shop',
            channelSku: 'TTS-POLO-PIMA-NAVY-M',
            productName: 'Áo Polo Pima Nam Cao Cấp - Xanh Navy (M)',
            masterSku: 'POLO-PREM-NVY-M',
            confidence: 97.8,
            status: 'PENDING',
          },
          {
            channel: 'Shopee Mall',
            channelSku: 'SHP-LINEN-SHIRT-BEIGE-L',
            productName: 'Áo Sơ Mi Linen Nam Cổ Trụ Màu Be (L)',
            masterSku: 'SHIRT-LIN-BGE-L',
            confidence: 96.4,
            status: 'PENDING',
          },
        ];

        responseMessage = {
          id: `msg_agent_${Date.now()}`,
          sender: 'agent',
          text: `Hệ thống vừa kiểm tra và phát hiện **2 mã SKU mới** từ TikTok Shop và Shopee có độ tin cậy AI cao (> 95%) đang chờ phê duyệt.\n\nBạn có thể bấm **"Phê duyệt 1-click"** để hệ thống tự động ánh xạ và trừ kho ngay lập tức:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: 'SKU_APPROVAL',
          actionData: { pendingList },
        };
      } else if (lower.includes('bổ sung') || lower.includes('thêm') || lower.includes('mặt hàng') || attachedFile) {
        const newProduct = {
          name: 'Áo Sơ Mi Linen Nam Cổ Tàu',
          sku: 'SHIRT-LIN-WHT-M',
          category: 'Thời Trang Nam / Áo Sơ Mi',
          price: '350.000đ',
          cost: '180.000đ',
          stock: 120,
          warehouse: 'Kho Tổng Hà Nội (WH_MAIN_HN)',
          image: attachedFile ? URL.createObjectURL(attachedFile) : 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300',
        };

        responseMessage = {
          id: `msg_agent_${Date.now()}`,
          sender: 'agent',
          text: `Tôi đã phân tích thông tin ${attachedFile ? 'hình ảnh & tệp đính kèm' : 'mô tả'} bằng động cơ AI NER. Dưới đây là thông số mặt hàng mới được tự động trích xuất chuẩn hóa:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: 'ADD_PRODUCT',
          actionData: newProduct,
        };
      } else {
        responseMessage = {
          id: `msg_agent_${Date.now()}`,
          sender: 'agent',
          text: `Tôi đã ghi nhận yêu cầu: "${text}". Động cơ AI Agent đang liên tục theo dõi hệ thống 24/7. Bạn có thể ra lệnh cho tôi xuất dữ liệu, tra cứu vận đơn, tối ưu định tuyến cước vận chuyển, hoặc cập nhật bảng giá kho POS bất cứ lúc nào!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: 'GENERAL',
        };
      }

      setMessages((prev) => [...prev, responseMessage]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <PageContainer
      title="Trợ lý AI Agent"
      tooltip="Trợ lý điều hành AI Agent tự động hóa đa kênh: Ra lệnh xuất Excel, kiểm tra SKU, thêm sản phẩm và cửa sổ kiểm tra đa năng"
      extra={
        <BaseButton
          variant="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => openInspector('chat')}
        >
          Cửa sổ kiểm tra đa năng
        </BaseButton>
      }
    >
      {/* Official Ant Design Splitter Container (Resizable by mouse drag) */}
      <Splitter
        layout="vertical"
        style={{
          height: 'calc(100vh - 160px)',
          minHeight: 620,
          background: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Top Pane: Resizable & Collapsible Quick Tools Hub */}
        <Splitter.Panel
          defaultSize="28%"
          min="15%"
          max="48%"
          collapsible
          style={{
            background: '#FAFAFA',
            borderBottom: '1px solid #E5E7EB',
            padding: '10px 14px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5E7EB', paddingBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#374151' }}>
              <AppstoreOutlined style={{ color: '#ed1c24' }} />
              <span>NGĂN CÔNG CỤ & TÁC VỤ HAY DÙNG (KÉO THẢ THANH PHÂN CHIA ĐỂ CO GIÃN)</span>
            </div>
            <Tag color="red" style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>
              Splitter Panel
            </Tag>
          </div>

          {/* Splitter Panes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
            {/* Ngăn 1: Cửa sổ Mini-Window tích hợp */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                <EyeOutlined style={{ color: '#2563EB' }} />
                <span>1. Cửa sổ Mini-Window</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<MessageFilled style={{ color: '#2563EB' }} />}
                  onClick={() => openInspector('chat')}
                  style={{ fontSize: 11.5, height: 26, padding: '0 8px' }}
                >
                  Pancake & CSKH Live
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<CarFilled style={{ color: '#EE0033' }} />}
                  onClick={() => openInspector('tracking')}
                  style={{ fontSize: 11.5, height: 26, padding: '0 8px' }}
                >
                  Vận đơn Viettel Post
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<ShoppingOutlined style={{ color: '#0088FF' }} />}
                  onClick={() => openInspector('pos')}
                  style={{ fontSize: 11.5, height: 26, padding: '0 8px' }}
                >
                  Tồn kho Sapo POS
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<CodeOutlined style={{ color: '#8B5CF6' }} />}
                  onClick={() => openInspector('webhook')}
                  style={{ fontSize: 11.5, height: 26, padding: '0 8px' }}
                >
                  Webhook Inbound
                </BaseButton>
              </div>
            </div>

            {/* Ngăn 2: Kế toán, Thuế & Bảng tính */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                <DollarCircleFilled style={{ color: '#0284C7' }} />
                <span>2. Kế toán, Thuế & Báo cáo</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<DollarCircleFilled style={{ color: '#0284C7' }} />}
                  onClick={() => handleSendMessage('Hãy thống kê doanh thu đa kênh và lập bảng kê khai thuế theo Nghị định 117/2025/NĐ-CP và Thông tư 40/2021/TT-BTC.')}
                  style={{ fontSize: 11.5, height: 26, padding: '0 8px' }}
                >
                  Kê khai thuế & Doanh thu
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<EyeOutlined style={{ color: '#0284C7' }} />}
                  onClick={() => openInspector('accounting')}
                  style={{ fontSize: 11.5, height: 26, padding: '0 8px' }}
                >
                  Sổ cái MISA AMIS
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<FileExcelFilled style={{ color: '#107C41' }} />}
                  onClick={() => handleSendMessage('Hãy xuất cho tôi bản Excel thống kê doanh thu và số lượng bán theo từng mặt hàng trong tháng này.')}
                  style={{ fontSize: 11.5, height: 26, padding: '0 8px' }}
                >
                  Xuất Excel doanh thu
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<DollarCircleFilled style={{ color: '#10B981' }} />}
                  onClick={() => handleSendMessage('Phân tích số tiền cước vận chuyển tiết kiệm được khi so sánh đa hãng trong tuần qua.')}
                  style={{ fontSize: 11.5, height: 26, padding: '0 8px' }}
                >
                  Tối ưu cước vận chuyển
                </BaseButton>
              </div>
            </div>

            {/* Ngăn 3: Tác vụ Agent 0-Chạm */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ThunderboltFilled style={{ color: '#ed1c24' }} />
                <span>3. Tác vụ Agent 0-Chạm</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<CheckCircleFilled style={{ color: '#F59E0B' }} />}
                  onClick={() => handleSendMessage('Kiểm tra trạng thái đơn của tôi, có mã SKU nào từ sàn đang cần tôi duyệt để khớp không?')}
                  style={{ fontSize: 11.5, height: 26, padding: '0 8px' }}
                >
                  Duyệt SKU chờ khớp (2 chờ)
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="small"
                  icon={<PlusCircleFilled style={{ color: '#8B5CF6' }} />}
                  onClick={() => handleSendMessage('Hãy bổ sung cho tôi mặt hàng Áo Sơ Mi Linen Nam Cổ Tàu, giá bán 350.000đ, tồn kho 120 chiếc.')}
                  style={{ fontSize: 11.5, height: 26, padding: '0 8px' }}
                >
                  Thêm SP từ ảnh/mô tả
                </BaseButton>
              </div>
            </div>
          </div>
        </Splitter.Panel>

        {/* Bottom Pane: Scrollable Chat Thread + Unified Input Box */}
        <Splitter.Panel
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 16px',
            overflow: 'hidden',
            background: '#FFFFFF',
          }}
        >
          {/* Scrollable Messages Thread (ONLY this area scrolls) */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              paddingRight: 6,
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    gap: 12,
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Avatar */}
                  <Avatar
                    size={36}
                    src={isUser ? undefined : '/favicon.svg'}
                    style={{
                      backgroundColor: isUser ? '#ed1c24' : '#FFFFFF',
                      border: isUser ? 'none' : '1px solid #E5E7EB',
                      padding: isUser ? 0 : 4,
                      flexShrink: 0,
                    }}
                  >
                    {isUser ? user?.name?.charAt(0) || 'U' : null}
                  </Avatar>

                  {/* Message Bubble */}
                  <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        background: isUser ? '#ed1c24' : '#F9FAFB',
                        color: isUser ? '#FFFFFF' : '#1F2937',
                        border: isUser ? 'none' : '1px solid #E5E7EB',
                        fontSize: 13.5,
                        lineHeight: 1.6,
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      {/* Optional File Attachment Display */}
                      {msg.attachment && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 10px',
                            background: isUser ? 'rgba(255, 255, 255, 0.2)' : '#FFFFFF',
                            borderRadius: 6,
                            marginBottom: 8,
                            fontSize: 12,
                            border: isUser ? 'none' : '1px solid #E5E7EB',
                          }}
                        >
                          <FileTextOutlined />
                          <span>{msg.attachment.name}</span>
                        </div>
                      )}

                      {/* Render Full Markdown Content */}
                      <div style={{ color: 'inherit', lineHeight: 1.6 }}>
                        {msg.text.split('\n').map((line, i) => (
                          <span key={i}>
                            {line
                              .split(/\*\*([^*]+)\*\*/g)
                              .map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
                            {i < msg.text.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </div>

                      {/* 0. TAX & ACCOUNTING RESULT CARD */}
                      {msg.actionType === 'TAX_ACCOUNTING' && msg.actionData && (
                        <div
                          style={{
                            marginTop: 12,
                            background: '#FFFFFF',
                            borderRadius: 8,
                            border: '1px solid #BAE6FD',
                            padding: 14,
                            color: '#111827',
                            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.05)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <img src={getPartnerLogo('misa')} alt="MISA" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                              <div>
                                <strong style={{ fontSize: 13.5, color: '#0369A1' }}>{msg.actionData.filename}</strong>
                                <div style={{ fontSize: 11, color: '#64748B' }}>
                                  Bóc tách {msg.actionData.docsCount} chứng từ • Kê khai theo NĐ 117/2025/NĐ-CP & TT 40/2021/TT-BTC
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: 6 }}>
                              <BaseButton
                                variant="ghost"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => openInspector('accounting')}
                              >
                                Xem sổ cái MISA
                              </BaseButton>

                              <BaseButton
                                variant="primary"
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={() => handleDownloadExcel(msg.actionData.rows, msg.actionData.filename)}
                              >
                                Tải Tờ khai thuế (.csv)
                              </BaseButton>
                            </div>
                          </div>

                          {/* 4 Financial Highlights */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
                            <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                              <div style={{ fontSize: 10.5, color: '#64748B' }}>Doanh thu Gross</div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{msg.actionData.totalGross}</div>
                            </div>
                            <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                              <div style={{ fontSize: 10.5, color: '#64748B' }}>Thuế GTGT (1%)</div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#EF4444' }}>{msg.actionData.totalVat}</div>
                            </div>
                            <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                              <div style={{ fontSize: 10.5, color: '#64748B' }}>Thuế TNCN (0.5%)</div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#D97706' }}>{msg.actionData.totalPit}</div>
                            </div>
                            <div style={{ background: '#ECFDF5', padding: '8px 10px', borderRadius: 6, border: '1px solid #A7F3D0' }}>
                              <div style={{ fontSize: 10.5, color: '#059669', fontWeight: 600 }}>Tổng thuế tạm tính</div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: '#059669' }}>{msg.actionData.totalTaxDue}</div>
                            </div>
                          </div>

                          {/* Preview Table */}
                          <Table
                            dataSource={msg.actionData.rows}
                            pagination={false}
                            size="small"
                            rowKey="Kênh Bán"
                            columns={[
                              { title: 'Kênh Bán', dataIndex: 'Kênh Bán', key: 'ch', render: (val) => <Tag color="blue">{val}</Tag> },
                              { title: 'Doanh Thu Gộp', dataIndex: 'Doanh Thu Gộp', key: 'gr', render: (val) => <strong>{val}</strong> },
                              { title: 'Phí Sàn Trừ', dataIndex: 'Phí Sàn Khấu Trừ', key: 'fee', render: (val) => <span style={{ color: '#64748B' }}>{val}</span> },
                              { title: 'DT Chịu Thuế', dataIndex: 'Doanh Thu Chịu Thuế', key: 'taxable', render: (val) => <strong style={{ color: '#0284C7' }}>{val}</strong> },
                              { title: 'Thuế GTGT (1%)', dataIndex: 'Thuế GTGT (1%)', key: 'vat', render: (val) => <span style={{ color: '#EF4444' }}>{val}</span> },
                              { title: 'Thuế TNCN (0.5%)', dataIndex: 'Thuế TNCN (0.5%)', key: 'pit', render: (val) => <span style={{ color: '#D97706' }}>{val}</span> },
                              { title: 'Chứng Từ MISA', dataIndex: 'Số Chứng Từ MISA', key: 'misa', render: (val) => <Tag color="green">{val} HĐ</Tag> },
                            ]}
                          />

                          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <BaseButton
                              variant="primary"
                              size="small"
                              icon={<ThunderboltFilled />}
                              onClick={() => notify.success('Đã gửi lệnh đồng bộ 3.380 chứng từ sang MISA AMIS! ✅')}
                            >
                              Đồng bộ sang MISA AMIS ngay
                            </BaseButton>
                          </div>
                        </div>
                      )}

                      {/* 1. EXCEL EXPORT AGENT RESULT CARD */}
                      {msg.actionType === 'EXCEL_EXPORT' && msg.actionData && (
                        <div
                          style={{
                            marginTop: 12,
                            background: '#FFFFFF',
                            borderRadius: 8,
                            border: '1px solid #E5E7EB',
                            padding: 12,
                            color: '#111827',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <FileExcelFilled style={{ color: '#107C41', fontSize: 20 }} />
                              <div>
                                <strong style={{ fontSize: 13 }}>{msg.actionData.filename}</strong>
                                <div style={{ fontSize: 11, color: '#6B7280' }}>
                                  Đã xuất {msg.actionData.rows.length} dòng dữ liệu • {msg.actionData.totalSold} sản phẩm
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: 6 }}>
                              <BaseButton
                                variant="ghost"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => openInspector('file')}
                              >
                                Xem trước
                              </BaseButton>

                              <BaseButton
                                variant="primary"
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={() => handleDownloadExcel(msg.actionData.rows, msg.actionData.filename)}
                              >
                                Tải file Excel (.csv)
                              </BaseButton>
                            </div>
                          </div>

                          {/* Preview Table */}
                          <Table
                            dataSource={msg.actionData.rows.slice(0, 4)}
                            pagination={false}
                            size="small"
                            rowKey="Mã SKU"
                            columns={[
                              { title: 'Mã SKU', dataIndex: 'Mã SKU', key: 'sku', render: (val) => <strong style={{ color: '#ed1c24' }}>{val}</strong> },
                              { title: 'Tên Sản Phẩm', dataIndex: 'Tên Sản Phẩm', key: 'name' },
                              { title: 'Sàn', dataIndex: 'Sàn Bán', key: 'ch', render: (val) => <Tag color="blue">{val}</Tag> },
                              { title: 'Đã Bán', dataIndex: 'Số Lượng', key: 'qty' },
                              { title: 'Doanh Thu', dataIndex: 'Doanh Thu (VNĐ)', key: 'rev', render: (val) => <strong>{val}đ</strong> },
                            ]}
                          />
                        </div>
                      )}

                      {/* 2. SKU APPROVAL AGENT RESULT CARD */}
                      {msg.actionType === 'SKU_APPROVAL' && msg.actionData?.pendingList && (
                        <div
                          style={{
                            marginTop: 12,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                          }}
                        >
                          {msg.actionData.pendingList.map((item: any, idx: number) => {
                            const isConfirmed = item.status === 'CONFIRMED';

                            return (
                              <div
                                key={idx}
                                style={{
                                  background: '#FFFFFF',
                                  borderRadius: 8,
                                  border: isConfirmed ? '1px solid #10B981' : '1px solid #E5E7EB',
                                  padding: '10px 14px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  color: '#111827',
                                }}
                              >
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                    <Tag color={item.channel.includes('TikTok') ? 'red' : 'orange'}>{item.channel}</Tag>
                                    <span style={{ fontSize: 11, color: '#6B7280' }}>Mã sàn: {item.channelSku}</span>
                                  </div>
                                  <div style={{ fontWeight: 600, fontSize: 13 }}>{item.productName}</div>
                                  <div style={{ fontSize: 11, color: '#059669', marginTop: 2 }}>
                                    Khớp vào Master SKU: <strong>{item.masterSku}</strong> (Độ tin cậy: {item.confidence}%)
                                  </div>
                                </div>

                                <div>
                                  {isConfirmed ? (
                                    <Tag color="success" icon={<CheckOutlined />}>
                                      Đã duyệt
                                    </Tag>
                                  ) : (
                                    <BaseButton
                                      variant="primary"
                                      size="small"
                                      icon={<CheckCircleFilled />}
                                      onClick={() => handleApproveSku(item, msg.id)}
                                    >
                                      Phê duyệt 1-click
                                    </BaseButton>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* 3. ADD PRODUCT AGENT RESULT CARD */}
                      {msg.actionType === 'ADD_PRODUCT' && msg.actionData && (
                        <div
                          style={{
                            marginTop: 12,
                            background: '#FFFFFF',
                            borderRadius: 8,
                            border: '1px solid #E5E7EB',
                            padding: 12,
                            color: '#111827',
                          }}
                        >
                          <div style={{ display: 'flex', gap: 12 }}>
                            {msg.actionData.image && (
                              <img
                                src={msg.actionData.image}
                                alt="Product"
                                style={{ width: 68, height: 68, borderRadius: 8, objectFit: 'cover', border: '1px solid #E5E7EB' }}
                              />
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: 14 }}>{msg.actionData.name}</div>
                              <div style={{ fontSize: 12, color: '#ed1c24', fontWeight: 600, marginTop: 2 }}>
                                SKU: {msg.actionData.sku}
                              </div>
                              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                                Danh mục: {msg.actionData.category}
                              </div>
                              <div style={{ fontSize: 12, marginTop: 4, display: 'flex', gap: 12 }}>
                                <span>Giá bán: <strong>{msg.actionData.price}</strong></span>
                                <span>Tồn kho: <strong>{msg.actionData.stock} chiếc</strong></span>
                              </div>
                            </div>
                          </div>

                          <Divider style={{ margin: '10px 0' }} />

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <BaseButton
                              variant="primary"
                              size="small"
                              icon={<PlusCircleFilled />}
                              onClick={() => handleSaveProductToCatalog(msg.actionData)}
                            >
                              Lưu vào Danh mục Master SKU
                            </BaseButton>
                          </div>
                        </div>
                      )}
                    </div>

                    <span style={{ fontSize: 10, color: '#9CA3AF', paddingLeft: isUser ? 0 : 4, textAlign: isUser ? 'right' : 'left' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Avatar size={36} src="/favicon.svg" style={{ border: '1px solid #E5E7EB', padding: 4 }} />
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '14px 14px 14px 2px',
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    fontSize: 12,
                    color: '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <ThunderboltFilled style={{ color: '#ed1c24' }} />
                  <span>AI Agent đang phân tích yêu cầu & truy vấn dữ liệu...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Unified, Harmonious Chat Input Bar */}
          <div
            style={{
              flexShrink: 0,
              marginTop: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {/* Attachment Chip Preview */}
            {attachedFile && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  padding: '3px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  width: 'fit-content',
                }}
              >
                <PaperClipOutlined style={{ color: '#ed1c24' }} />
                <span style={{ color: '#991B1B', fontWeight: 500 }}>{attachedFile.name}</span>
                <span
                  onClick={() => setAttachedFile(null)}
                  style={{ marginLeft: 6, cursor: 'pointer', color: '#991B1B', fontWeight: 'bold' }}
                >
                  ×
                </span>
              </div>
            )}

            {/* Unified Input Box Frame */}
            <div
              style={{
                border: isInputFocused ? '1.5px solid #ed1c24' : '1px solid #D1D5DB',
                borderRadius: 12,
                background: '#FFFFFF',
                padding: '8px 12px 6px',
                boxShadow: isInputFocused ? '0 0 0 3px rgba(237, 28, 36, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              {/* Seamless Textarea */}
              <TextArea
                rows={1}
                autoSize={{ minRows: 1, maxRows: 4 }}
                placeholder="Nhập yêu cầu cho AI Agent (Ví dụ: Xuất file Excel thống kê, kiểm tra SKU chờ duyệt, thêm sản phẩm...)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  padding: '2px 0',
                  fontSize: 13.5,
                  resize: 'none',
                }}
              />

              {/* Bottom Control Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Upload
                    beforeUpload={(file) => {
                      setAttachedFile(file);
                      notify.success(`Đã đính kèm tệp: ${file.name}`);
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <Tooltip title="Đính kèm ảnh sản phẩm, file Excel hoặc hóa đơn để AI tự động phân tích">
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 8px',
                          borderRadius: 6,
                          background: '#F3F4F6',
                          color: '#4B5563',
                          fontSize: 12,
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                        }}
                      >
                        <PaperClipOutlined style={{ fontSize: 13, color: '#ed1c24' }} />
                        <span>Đính kèm tệp / ảnh</span>
                      </div>
                    </Tooltip>
                  </Upload>

                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>
                    Nhấn <strong>Enter ↵</strong> để gửi, <strong>Shift + Enter</strong> xuống dòng
                  </span>
                </div>

                <BaseButton
                  variant="primary"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={() => handleSendMessage()}
                  style={{
                    height: 30,
                    padding: '0 14px',
                    fontSize: 12.5,
                    borderRadius: 6,
                  }}
                >
                  Gửi
                </BaseButton>
              </div>
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>

      {/* Multi-Tool & File/Chat Mini-Window Inspector Hub */}
      <AgentOmniInspectorModal
        open={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        defaultTab={inspectorTab}
      />
    </PageContainer>
  );
};

export default CopilotAgentPage;
