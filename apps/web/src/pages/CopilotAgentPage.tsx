import React, { useState, useRef, useEffect } from 'react';
import {
  Input,
  Tag,
  Avatar,
  Table,
  Upload,
  Tooltip,
  Modal,
  Form,
  Select,
  InputNumber,
  Popconfirm,
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
  MessageOutlined,
  CarFilled,
  ShoppingOutlined,
  EyeOutlined,
  AppstoreOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  CloseOutlined,
  ReloadOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { PageContainer, BaseButton } from '../components/base';
import { notify } from '../utils/notification';
import { useAuthStore } from '../store/useAuthStore';
import { useAppConfig } from '../context/AppConfigContext';
import { mappingService } from '../services/mapping.service';
import { copilotService, CopilotSessionItem } from '../services/copilot.service';
import { AgentOmniInspectorModal } from '../components/chat/AgentOmniInspectorModal';

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
  provider?: string;
  latencyMs?: number;
}

export const CopilotAgentPage: React.FC = () => {
  const { user } = useAuthStore();
  const { themeMode } = useAppConfig();
  const isDark = themeMode === 'dark';

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

  // Session History State (MongoDB Persistence)
  const [sessions, setSessions] = useState<CopilotSessionItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>(
    localStorage.getItem('uniflow_copilot_session') || ''
  );

  const fetchSessions = async () => {
    try {
      const list = await copilotService.getSessions();
      setSessions(list || []);
      if (!activeSessionId && list && list.length > 0) {
        handleSelectSession(list[0].sessionId);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSelectSession = async (sessionId: string) => {
    try {
      setActiveSessionId(sessionId);
      localStorage.setItem('uniflow_copilot_session', sessionId);
      const session = await copilotService.getSession(sessionId);
      if (session && session.messages && session.messages.length > 0) {
        setMessages(session.messages);
      }
    } catch (err: any) {
      notify.error('Lỗi khi tải phiên chat: ' + err.message);
    }
  };

  const handleCreateNewSession = async () => {
    try {
      const newSess = await copilotService.createSession('Phiên hội thoại mới');
      setActiveSessionId(newSess.sessionId);
      localStorage.setItem('uniflow_copilot_session', newSess.sessionId);
      setMessages([
        {
          id: `msg_welcome_${Date.now()}`,
          sender: 'agent',
          text: 'Chào bạn! Phiên trò chuyện mới đã được tạo và lưu vào cơ sở dữ liệu MongoDB Atlas. Bạn cần hỗ trợ gì ngay bây giờ?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionType: 'GENERAL',
        },
      ]);
      fetchSessions();
      notify.success('Đã tạo phiên hội thoại mới');
    } catch (err: any) {
      notify.error('Lỗi khi tạo phiên mới: ' + err.message);
    }
  };

  const handleDeleteSession = async (sessionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await copilotService.deleteSession(sessionId);
      notify.success('Đã xóa phiên chat thành công');
      if (activeSessionId === sessionId) {
        setActiveSessionId('');
        localStorage.removeItem('uniflow_copilot_session');
        setMessages([]);
      }
      fetchSessions();
    } catch (err: any) {
      notify.error('Lỗi khi xóa phiên chat: ' + err.message);
    }
  };

  // Inline rename session state
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartRename = (s: CopilotSessionItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingSessionId(s.sessionId);
    setEditingTitle(s.title);
  };

  const handleSaveRename = async (sessionId: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    if (!editingTitle.trim()) {
      setEditingSessionId(null);
      return;
    }
    try {
      await copilotService.renameSession(sessionId, editingTitle.trim());
      setEditingSessionId(null);
      fetchSessions();
      notify.success('Đã đổi tên phiên chat');
    } catch (err: any) {
      notify.error('Lỗi đổi tên: ' + err.message);
    }
  };

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSession = sessions.find((s) => s.sessionId === activeSessionId);

  // Layout switcher state
  const [layoutMode, setLayoutMode] = useState<'3_COLS' | 'LEFT_STACKED_RIGHT' | 'RIGHT_STACKED_LEFT'>(() => {
    return (localStorage.getItem('uniflow_copilot_layout') as any) || 'LEFT_STACKED_RIGHT';
  });

  // Track confirmed SKU IDs
  const [confirmedSkus, setConfirmedSkus] = useState<Set<string>>(new Set());

  // Manual SKU Edit modal state
  const [manualEditOpen, setManualEditOpen] = useState(false);
  const [manualEditSku, setManualEditSku] = useState<any>(null);
  const [manualEditMsgId, setManualEditMsgId] = useState<string>('');
  const [editForm] = Form.useForm();

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

  // 1-Click Approve SKU in Database
  const handleApproveSku = async (skuItem: any, msgId: string) => {
    notify.loading(`Đang lưu phê duyệt cho SKU: ${skuItem.channelSku}...`, 'approveSku');
    try {
      const targetId = skuItem._id || skuItem.id;
      if (targetId && !targetId.startsWith('demo_')) {
        await mappingService.approveMapping(targetId);
      }
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === msgId && msg.actionData?.pendingList) {
            const updatedList = msg.actionData.pendingList.map((item: any) =>
              (item.channelSku === skuItem.channelSku || item.id === targetId) ? { ...item, status: 'CONFIRMED' } : item
            );
            return { ...msg, actionData: { ...msg.actionData, pendingList: updatedList } };
          }
          return msg;
        })
      );
      setConfirmedSkus((prev) => new Set(prev).add(skuItem.id || skuItem._id));
      notify.success(`Đã phê duyệt 1-click thành công SKU "${skuItem.channelSku}" vào cơ sở dữ liệu! ✅`);
    } catch (err: any) {
      notify.error('Lỗi khi phê duyệt SKU: ' + err.message);
    }
  };

  // Open manual edit modal for SKU
  const handleOpenManualEdit = (skuItem: any, msgId: string) => {
    setManualEditSku(skuItem);
    setManualEditMsgId(msgId);
    editForm.setFieldsValue({
      targetMasterSku: skuItem.masterSku || '',
      targetProductName: skuItem.productName || '',
      targetPosPlatform: 'SAPO',
      conversionRatio: 1,
    });
    setManualEditOpen(true);
  };

  // Submit manual edit modal
  const handleSaveManualEdit = async () => {
    try {
      const values = await editForm.validateFields();
      const targetId = manualEditSku._id || manualEditSku.id;

      if (targetId && !targetId.startsWith('demo_')) {
        await mappingService.saveManualMapping(targetId, {
          targetMasterSku: values.targetMasterSku,
          targetProductName: values.targetProductName,
          targetPosPlatform: values.targetPosPlatform,
          conversionRatio: values.conversionRatio,
        });
      }

      setConfirmedSkus((prev) => new Set(prev).add(targetId));
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === manualEditMsgId && msg.actionData?.pendingList) {
            const updatedList = msg.actionData.pendingList.map((item: any) =>
              (item.channelSku === manualEditSku.channelSku || item.id === targetId)
                ? { ...item, masterSku: values.targetMasterSku, status: 'CONFIRMED' }
                : item
            );
            return { ...msg, actionData: { ...msg.actionData, pendingList: updatedList } };
          }
          return msg;
        })
      );
      setManualEditOpen(false);
      notify.success(`Đã ghép tay thành công Master SKU "${values.targetMasterSku}" và đồng bộ vào kho! ✅`);
    } catch (err: any) {
      if (!err?.errorFields) {
        notify.error('Lỗi khi lưu ghép tay: ' + err.message);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
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

    try {
      const historyPayload = messages.slice(-4).map((m) => ({ sender: m.sender, text: m.text }));
      const res = await copilotService.sendMessage({
        message: text.trim(),
        history: historyPayload,
        sessionId: activeSessionId || undefined,
        attachment: attachedFile ? { name: attachedFile.name, type: attachedFile.type } : undefined,
      });

      if (res.sessionId && res.sessionId !== activeSessionId) {
        setActiveSessionId(res.sessionId);
        localStorage.setItem('uniflow_copilot_session', res.sessionId);
      }
      fetchSessions();

      const responseMessage: ChatMessage = {
        id: `msg_agent_${Date.now()}`,
        sender: 'agent',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: res.actionType || 'GENERAL',
        actionData: res.actionData,
        provider: res.provider,
        latencyMs: res.latencyMs,
      };

      setMessages((prev) => [...prev, responseMessage]);
    } catch (err: any) {
      console.error('[CopilotAgent] Lỗi khi gửi tin nhắn:', err);
      const errMsg = err?.message || err?.error || 'Không thể kết nối đến máy chủ AI Gateway. Vui lòng kiểm tra lại kết nối mạng.';
      const fallbackMsg: ChatMessage = {
        id: `msg_agent_${Date.now()}`,
        sender: 'agent',
        text: `⚠️ **Lỗi kết nối**: ${errMsg}\n\n*Vui lòng thử lại sau vài giây.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: 'GENERAL',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDownloadCsv = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [headers, ...rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename || 'export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    notify.success(`Đã tải xuống ${filename || 'export.csv'}`);
  };

  const renderMessageText = (text: string) => {
    return (text || '').split('\n').map((line, i) => (
      <span key={i}>
        {line
          .split(/\*\*([^*]+)\*\*/g)
          .map((part, j) => (j % 2 === 1 ? <strong key={j}>{part}</strong> : part))}
        {i < (text || '').split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // ── RENDER PANE 1: DANH SÁCH PHIÊN HỘI THOẠI ──
  const renderSessionsPanel = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-surface-card)' }}>
      {/* Header phiên: Ô tìm kiếm + Nút icon Tạo phiên mới cùng 1 hàng */}
      <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, background: 'var(--bg-surface-card)' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm phiên chat..."
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, borderRadius: 6, fontSize: 12, background: 'var(--bg-surface-alt)' }}
        />
        <Tooltip title="Tạo phiên mới">
          <BaseButton
            variant="ghost"
            size="small"
            icon={<PlusOutlined />}
            onClick={handleCreateNewSession}
            style={{
              width: 28,
              height: 28,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              flexShrink: 0,
            }}
          />
        </Tooltip>
      </div>

      {/* Danh sách phiên cuộn độc lập */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px', background: 'var(--bg-surface-card)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', padding: '4px 6px 8px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center' }}>
          <HistoryOutlined style={{ marginRight: 5, fontSize: 12 }} />
          <span>LỊCH SỬ HỘI THOẠI ({filteredSessions.length})</span>
        </div>

        {filteredSessions.length === 0 ? (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            {searchQuery ? 'Không tìm thấy phiên chat phù hợp' : 'Chưa có phiên chat nào trong cơ sở dữ liệu.'}
          </div>
        ) : (
          filteredSessions.map((s) => {
            const isActive = s.sessionId === activeSessionId;
            const isRenaming = editingSessionId === s.sessionId;

            return (
              <div
                key={s.sessionId}
                onClick={() => !isRenaming && handleSelectSession(s.sessionId)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  marginBottom: 4,
                  cursor: 'pointer',
                  background: isActive
                    ? (isDark ? 'rgba(237, 28, 36, 0.15)' : 'rgba(237, 28, 36, 0.08)')
                    : 'transparent',
                  border: isActive ? '1px solid #ed1c24' : '1px solid transparent',
                  borderLeft: isActive ? '1px solid #ed1c24' : '1px solid transparent',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  position: 'relative',
                }}
              >
                <MessageOutlined style={{ color: isActive ? '#ed1c24' : 'var(--text-muted)', fontSize: 13, flexShrink: 0 }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  {isRenaming ? (
                    <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                      <Input
                        size="small"
                        value={editingTitle}
                        autoFocus
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onPressEnter={(e) => handleSaveRename(s.sessionId, e)}
                        style={{ fontSize: 12 }}
                      />
                      <Tooltip title="Lưu">
                        <CheckOutlined
                          style={{ color: '#10B981', fontSize: 13, cursor: 'pointer', padding: '0 4px' }}
                          onClick={(e) => handleSaveRename(s.sessionId, e)}
                        />
                      </Tooltip>
                      <Tooltip title="Hủy">
                        <CloseOutlined
                          style={{ color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', padding: '0 4px' }}
                          onClick={() => setEditingSessionId(null)}
                        />
                      </Tooltip>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? (isDark ? '#FFFFFF' : '#111827') : 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={s.title}
                      >
                        {s.title}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                        {new Date(s.updatedAt || s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                        {new Date(s.updatedAt || s.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </>
                  )}
                </div>

                {!isRenaming && (
                  <div
                    style={{ display: 'flex', gap: 4, opacity: isActive ? 1 : 0.6 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Tooltip title="Đổi tên">
                      <EditOutlined
                        style={{ color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', padding: 2 }}
                        onClick={(e) => handleStartRename(s, e)}
                      />
                    </Tooltip>

                    <Popconfirm
                      title="Xóa phiên chat này?"
                      description="Xóa vĩnh viễn dữ liệu phiên khỏi MongoDB Atlas."
                      onConfirm={(e) => handleDeleteSession(s.sessionId, e)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <Tooltip title="Xóa">
                        <DeleteOutlined
                          style={{ color: '#EF4444', fontSize: 11, cursor: 'pointer', padding: 2 }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Tooltip>
                    </Popconfirm>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer DB status */}
      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 11,
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface-card)',
          flexShrink: 0,
        }}
      >
        <span>Database: <strong style={{ color: 'var(--text-primary)' }}>PTIT_Aka</strong></span>
        <Tag color="success" style={{ margin: 0, fontSize: 10, padding: '0 4px', borderRadius: 4 }}>
          Live
        </Tag>
      </div>
    </div>
  );

  // ── RENDER PANE 2: KHUNG CHAT COPILOT CHÍNH ──
  const renderChatPanel = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-surface-card)' }}>
      {/* Header Bar */}
      <div
        style={{
          padding: '8px 14px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <MessageOutlined style={{ color: '#ed1c24', fontSize: 14 }} />
          <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentSession?.title || 'Phiên trò chuyện hiện tại'}
          </span>
          <Tooltip title="Chỉnh sửa tiêu đề phiên">
            <EditOutlined
              style={{ color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}
              onClick={() => currentSession && handleStartRename(currentSession)}
            />
          </Tooltip>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Tag color="processing" style={{ borderRadius: 6, margin: 0, padding: '1px 8px', fontSize: 11 }}>
            DeepSeek-V4-Flash
          </Tag>
          <Tooltip title="Tải lại tin nhắn từ MongoDB">
            <BaseButton
              variant="ghost"
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => activeSessionId && handleSelectSession(activeSessionId)}
              style={{ height: 26, padding: '0 6px' }}
            />
          </Tooltip>
        </div>
      </div>

      {/* Main Messages & Input Workspace */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          background: 'var(--bg-surface-card)',
        }}
      >
        {/* Scrollable Messages Thread */}
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
                <Avatar
                  size={34}
                  src={isUser ? undefined : '/favicon.svg'}
                  style={{
                    backgroundColor: isUser ? '#ed1c24' : 'var(--bg-surface-card)',
                    border: isUser ? 'none' : '1px solid var(--border-subtle)',
                    padding: isUser ? 0 : 4,
                    flexShrink: 0,
                  }}
                >
                  {isUser ? user?.name?.charAt(0) || 'U' : null}
                </Avatar>

                <div style={{ maxWidth: '84%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      background: isUser ? '#ed1c24' : 'var(--bg-surface-alt)',
                      color: isUser ? '#FFFFFF' : 'var(--text-primary)',
                      border: isUser ? 'none' : '1px solid var(--border-subtle)',
                      fontSize: 13,
                      lineHeight: 1.6,
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    {msg.attachment && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          background: isUser ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-surface-card)',
                          borderRadius: 6,
                          marginBottom: 8,
                          fontSize: 12,
                          border: isUser ? 'none' : '1px solid var(--border-subtle)',
                          color: 'inherit',
                        }}
                      >
                        <FileTextOutlined />
                        <span>{msg.attachment.name}</span>
                      </div>
                    )}

                    <div style={{ whiteSpace: 'pre-wrap', color: 'inherit' }}>{renderMessageText(msg.text)}</div>

                    {msg.provider && (
                      <div
                        style={{
                          marginTop: 6,
                          paddingTop: 6,
                          borderTop: isUser ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: 10.5,
                          opacity: 0.85,
                        }}
                      >
                        <span>{msg.provider}</span>
                        {msg.latencyMs && <span>{msg.latencyMs}ms</span>}
                      </div>
                    )}
                  </div>

                  {/* 1. EXCEL EXPORT RESULT CARD */}
                  {msg.actionType === 'EXCEL_EXPORT' && msg.actionData && (
                    <div
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        borderRadius: 8,
                        border: '1px solid #10B981',
                        padding: 12,
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FileExcelFilled style={{ color: '#107C41', fontSize: 18 }} />
                          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{msg.actionData.filename}</span>
                        </div>
                        <BaseButton
                          variant="primary"
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownloadCsv(msg.actionData.filename, msg.actionData.rows)}
                          style={{ background: '#107C41', borderColor: '#107C41' }}
                        >
                          Tải về CSV / Excel
                        </BaseButton>
                      </div>

                      <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                        <Table
                          size="small"
                          pagination={false}
                          dataSource={msg.actionData.rows}
                          rowKey={(r: any) => r['Mã SKU Sàn'] || r['Mã SKU'] || JSON.stringify(r)}
                          columns={
                            msg.actionData.rows && msg.actionData.rows[0]
                              ? Object.keys(msg.actionData.rows[0]).map((key) => ({
                                title: key,
                                dataIndex: key,
                                key,
                                render: (val: any) => (
                                  <span style={{ fontSize: 11.5, color: key === 'Mã SKU' || key === 'Mã SKU Sàn' ? '#ed1c24' : 'var(--text-primary)' }}>
                                    {val}
                                  </span>
                                ),
                              }))
                              : []
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. SKU APPROVAL & RECONCILIATION RESULT CARD */}
                  {msg.actionType === 'SKU_APPROVAL' && msg.actionData?.pendingList && (
                    <div
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        borderRadius: 8,
                        border: '1px solid var(--border-subtle)',
                        padding: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ThunderboltFilled style={{ color: '#F59E0B', fontSize: 16 }} />
                          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>
                            Mã SKU sàn TMĐT cần đối soát ({msg.actionData.pendingList.length})
                          </span>
                        </div>
                        <Tag color="warning">Cần xác nhận</Tag>
                      </div>

                      {msg.actionData.pendingList.map((item: any) => {
                        const isConfirmed = item.status === 'CONFIRMED' || confirmedSkus.has(item.id);

                        return (
                          <div
                            key={item.id}
                            style={{
                              background: isConfirmed
                                ? (isDark ? 'rgba(16, 185, 129, 0.12)' : '#F0FDF4')
                                : (isDark ? 'var(--bg-surface-alt)' : '#FAFAFA'),
                              border: isConfirmed ? '1px solid #10B981' : '1px solid var(--border-subtle)',
                              borderRadius: 6,
                              padding: '10px 12px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 12,
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                <Tag color={item.channel.includes('TikTok') ? 'red' : 'orange'}>{item.channel}</Tag>

                                {isConfirmed || item.mappingStatus === 'AUTO_APPROVED' ? (
                                  <Tag color="success" icon={<CheckCircleFilled />}>Tự động duyệt</Tag>
                                ) : item.mappingStatus === 'MANUAL_REQUIRED' ? (
                                  <Tag color="error" icon={<EditOutlined />}>Cần ghép tay</Tag>
                                ) : (
                                  <Tag color="warning" icon={<ThunderboltFilled />}>Chờ duyệt 1-click</Tag>
                                )}

                                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Mã sàn: {item.channelSku}</span>
                              </div>
                              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.productName}
                              </div>
                              <div style={{ fontSize: 11, color: '#10B981', marginTop: 2 }}>
                                Khớp vào Master SKU: <strong>{item.masterSku}</strong> (Độ tin cậy: {item.confidence}%)
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, justifyContent: 'flex-end', minWidth: 260 }}>
                              {isConfirmed || item.mappingStatus === 'AUTO_APPROVED' ? (
                                <>
                                  <Tag color="success" icon={<CheckOutlined />} style={{ margin: 0, padding: '4px 10px', fontSize: 12 }}>
                                    Đã đối soát
                                  </Tag>
                                  <BaseButton
                                    variant="ghost"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => handleOpenManualEdit(item, msg.id)}
                                    style={{ width: 105, height: 32, justifyContent: 'center' }}
                                  >
                                    Sửa ghép
                                  </BaseButton>
                                </>
                              ) : item.mappingStatus === 'MANUAL_REQUIRED' ? (
                                <>
                                  <BaseButton
                                    variant="primary"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => handleOpenManualEdit(item, msg.id)}
                                    style={{ width: 105, height: 32, justifyContent: 'center' }}
                                  >
                                    Ghép tay
                                  </BaseButton>
                                  <BaseButton
                                    variant="ghost"
                                    size="small"
                                    icon={<CheckCircleFilled />}
                                    onClick={() => handleApproveSku(item, msg.id)}
                                    style={{ width: 145, height: 32, justifyContent: 'center' }}
                                  >
                                    Phê duyệt 1-click
                                  </BaseButton>
                                </>
                              ) : (
                                <>
                                  <BaseButton
                                    variant="ghost"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => handleOpenManualEdit(item, msg.id)}
                                    style={{ width: 105, height: 32, justifyContent: 'center' }}
                                  >
                                    Ghép tay
                                  </BaseButton>
                                  <BaseButton
                                    variant="primary"
                                    size="small"
                                    icon={<CheckCircleFilled />}
                                    onClick={() => handleApproveSku(item, msg.id)}
                                    style={{ width: 145, height: 32, justifyContent: 'center' }}
                                  >
                                    Phê duyệt 1-click
                                  </BaseButton>
                                </>
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
                        background: 'var(--bg-surface-elevated)',
                        borderRadius: 8,
                        border: '1px solid #8B5CF6',
                        padding: 12,
                        boxShadow: '0 2px 8px rgba(139, 92, 246, 0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <PlusCircleFilled style={{ color: '#8B5CF6', fontSize: 16 }} />
                          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>Mặt hàng mới trích xuất từ văn bản (NER)</span>
                        </div>
                        <Tag color="purple">Sẵn sàng lưu kho</Tag>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, alignItems: 'center' }}>
                        <img
                          src={msg.actionData.image}
                          alt="Product"
                          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-subtle)' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{msg.actionData.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            Mã Master SKU: <strong style={{ color: 'var(--text-primary)' }}>{msg.actionData.sku}</strong> | Danh mục: {msg.actionData.category}
                          </div>
                          <div style={{ fontSize: 12, color: '#ed1c24', fontWeight: 600 }}>
                            Giá bán: {msg.actionData.price} | Tồn ban đầu: {msg.actionData.stock} chiếc
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. CARRIER OPTIMIZE RESULT CARD */}
                  {msg.actionType === 'CARRIER_OPTIMIZE' && msg.actionData && (
                    <div
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        borderRadius: 8,
                        border: '1px solid #0284C7',
                        padding: 12,
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <DollarCircleFilled style={{ color: '#0284C7', fontSize: 16 }} />
                          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>So sánh bảng giá cước vận chuyển thời gian thực</span>
                        </div>
                        <Tag color="blue">Tối ưu chi phí</Tag>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                        {msg.actionData.quotes?.map((q: any) => {
                          const isBest = q.carrier === msg.actionData.chosenCarrier;
                          return (
                            <div
                              key={q.carrier}
                              style={{
                                padding: '8px 10px',
                                borderRadius: 6,
                                background: isBest
                                  ? (isDark ? 'rgba(37, 99, 235, 0.18)' : '#EFF6FF')
                                  : (isDark ? 'var(--bg-surface-alt)' : '#FAFAFA'),
                                border: isBest ? '1.5px solid #2563EB' : '1px solid var(--border-subtle)',
                                textAlign: 'center',
                              }}
                            >
                              <div style={{ fontSize: 12, fontWeight: 600, color: isBest ? '#3B82F6' : 'var(--text-primary)' }}>
                                {q.carrier}
                              </div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#ed1c24', margin: '2px 0' }}>
                                {q.fee.toLocaleString('vi-VN')}đ
                              </div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Giao ~{q.etaHours}h</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 5. TAX & ACCOUNTING RESULT CARD */}
                  {msg.actionType === 'TAX_ACCOUNTING' && (
                    <div
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        borderRadius: 8,
                        border: '1px solid #10B981',
                        padding: 12,
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <DollarCircleFilled style={{ color: '#10B981', fontSize: 16 }} />
                          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>Tuân thủ Nghị định 117/2025/NĐ-CP & TT 40/2021/TT-BTC</span>
                        </div>
                        <Tag color="success">Hợp chuẩn thuế TMĐT</Tag>
                      </div>

                      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        Dữ liệu hóa đơn điện tử tự động kết nối qua cổng API chuẩn hóa của <strong style={{ color: 'var(--text-primary)' }}>MISA meInvoice / VNPT Invoice</strong>.
                      </div>
                    </div>
                  )}

                  <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Avatar size={34} src="/favicon.svg" style={{ border: '1px solid var(--border-subtle)', padding: 4 }} />
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px 12px 12px 2px',
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>AI đang kết nối MongoDB và suy luận...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Unified Input Box (Fixed at Bottom) */}
        <div style={{ flexShrink: 0, marginTop: 12 }}>
          {attachedFile && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 6,
                background: isDark ? 'rgba(237, 28, 36, 0.15)' : '#FEF2F2',
                border: '1px solid #ed1c24',
                color: '#ed1c24',
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              <FileTextOutlined />
              <span style={{ fontWeight: 500 }}>{attachedFile.name}</span>
              <span
                style={{ cursor: 'pointer', marginLeft: 4, fontWeight: 'bold' }}
                onClick={() => setAttachedFile(null)}
              >
                ✕
              </span>
            </div>
          )}

          <div
            style={{
              border: isInputFocused ? '1.5px solid #ed1c24' : '1px solid var(--border-subtle)',
              borderRadius: 8,
              padding: '8px 12px',
              background: 'var(--bg-surface-elevated)',
              boxShadow: isInputFocused ? '0 0 0 3px rgba(237, 28, 36, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
            }}
          >
            <TextArea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhắn tin với AI Agent (ví dụ: 'Xuất doanh thu Excel', 'Duyệt mã SKU', 'Kê khai thuế')..."
              autoSize={{ minRows: 2, maxRows: 5 }}
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
                fontSize: 13,
                resize: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
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
                        background: 'var(--bg-surface-alt)',
                        color: 'var(--text-secondary)',
                        fontSize: 12,
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <PaperClipOutlined style={{ fontSize: 13, color: '#ed1c24' }} />
                      <span>Đính kèm tệp / ảnh</span>
                    </div>
                  </Tooltip>
                </Upload>

                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
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
      </div>
    </div>
  );

  // ── RENDER PANE 3: NGĂN CÔNG CỤ NHANH (PROMPT SUGGESTIONS 3 CỘT DẠNG #) ──
  const renderToolsPanel = (orientation: 'vertical' | 'horizontal' = 'vertical') => {
    const suggestionGroups = [
      {
        id: 'group_mini_windows',
        title: 'Cửa sổ Live',
        icon: <EyeOutlined style={{ color: '#2563EB', fontSize: 13 }} />,
        items: [
          {
            label: 'Pancake CSKH & Live Chat',
            icon: <MessageFilled style={{ color: '#2563EB', fontSize: 12 }} />,
            action: () => openInspector('chat'),
          },
          {
            label: 'Vận đơn Viettel Post Live',
            icon: <CarFilled style={{ color: '#EE0033', fontSize: 12 }} />,
            action: () => openInspector('tracking'),
          },
          {
            label: 'Tồn kho Realtime Sapo POS',
            icon: <ShoppingOutlined style={{ color: '#0088FF', fontSize: 12 }} />,
            action: () => openInspector('pos'),
          },
        ],
      },
      {
        id: 'group_accounting',
        title: 'Kế toán, Thuế & Báo cáo',
        icon: <DollarCircleFilled style={{ color: '#0284C7', fontSize: 13 }} />,
        items: [
          {
            label: 'Kê khai thuế NĐ 117/2025',
            icon: <DollarCircleFilled style={{ color: '#0284C7', fontSize: 12 }} />,
            action: () => handleSendMessage('Hãy thống kê doanh thu đa kênh và lập bảng kê khai thuế theo Nghị định 117/2025/NĐ-CP và Thông tư 40/2021/TT-BTC.'),
          },
          {
            label: 'Xuất bảng tính Excel',
            icon: <FileExcelFilled style={{ color: '#107C41', fontSize: 12 }} />,
            action: () => handleSendMessage('Hãy xuất cho tôi bản Excel thống kê doanh thu và số lượng bán theo từng mặt hàng trong tháng này.'),
          },
          {
            label: 'Tối ưu định tuyến cước',
            icon: <DollarCircleFilled style={{ color: '#10B981', fontSize: 12 }} />,
            action: () => handleSendMessage('Phân tích số tiền cước vận chuyển tiết kiệm được khi so sánh đa hãng trong tuần qua.'),
          },
        ],
      },
      {
        id: 'group_automation',
        title: 'Tác vụ 0-Chạm',
        icon: <ThunderboltFilled style={{ color: '#ed1c24', fontSize: 13 }} />,
        items: [
          {
            label: 'Duyệt đối soát SKU',
            icon: <CheckCircleFilled style={{ color: '#F59E0B', fontSize: 12 }} />,
            action: () => handleSendMessage('Kiểm tra trạng thái đơn của tôi, có mã SKU nào từ sàn đang cần tôi duyệt để khớp không?'),
          },
          {
            label: 'Thêm mặt hàng mới',
            icon: <PlusCircleFilled style={{ color: '#8B5CF6', fontSize: 12 }} />,
            action: () => handleSendMessage('Hãy bổ sung cho tôi mặt hàng Áo Sơ Mi Linen Nam Cổ Tàu, giá bán 350.000đ, tồn kho 120 chiếc.'),
          },
        ],
      },
    ];

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-surface-card)' }}>
        {/* Header công cụ */}
        <div
          style={{
            padding: '8px 14px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-card)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
            <AppstoreOutlined style={{ color: '#ed1c24' }} />
            <span>GỢI Ý TÁC VỤ & MINI-TOOLS</span>
          </div>
          <Tag color="default" style={{ fontSize: 10, margin: 0, borderRadius: 4 }}>
            3 Nhóm tác vụ
          </Tag>
        </div>

        {/* Body gợi ý dạng 3 Cột sạch sẽ không bọc card thô */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 12px',
            display: 'grid',
            gridTemplateColumns: orientation === 'horizontal' ? 'repeat(3, 1fr)' : (orientation === 'vertical' ? '1fr' : 'repeat(3, 1fr)'),
            gap: 14,
            background: 'var(--bg-surface-card)',
          }}
        >
          {suggestionGroups.map((group) => (
            <div key={group.id} style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                {group.icon}
                <span>{group.title}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    onClick={item.action}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '3px 0',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      transition: 'all 0.15s ease',
                      userSelect: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ed1c24';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <span style={{ color: '#ed1c24', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>#</span>
                    {item.icon && <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>}
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <PageContainer
      title="Trợ lý AI Agent"
      tooltip="Trợ lý điều hành AI Agent tự động hóa đa kênh kết nối cơ sở dữ liệu MongoDB Atlas thực tế"
      extra={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Bộ chuyển đổi Bố cục linh hoạt */}
          <Select
            value={layoutMode}
            onChange={(val) => {
              setLayoutMode(val);
              localStorage.setItem('uniflow_copilot_layout', val);
            }}
            options={[
              { value: '3_COLS', label: 'Bố cục: 3 Cột ngang' },
              { value: 'LEFT_STACKED_RIGHT', label: 'Bố cục: Trái + 2 Tầng phải' },
              { value: 'RIGHT_STACKED_LEFT', label: 'Bố cục: Chat + 2 Tầng phải' },
            ]}
          />

          <BaseButton
            variant="ghost"
            size="small"
            icon={<PlusOutlined />}
            onClick={handleCreateNewSession}
          >
            Phiên mới
          </BaseButton>

          <BaseButton
            variant="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openInspector('chat')}
          >
            Cửa sổ kiểm tra đa năng
          </BaseButton>
        </div>
      }
    >
      {/* ── BỐ CỤC 1: 3 CỘT NGANG ── */}
      {layoutMode === '3_COLS' && (
        <Splitter
          style={{
            height: 'calc(100vh - 160px)',
            minHeight: 640,
            background: 'var(--bg-surface-card)',
            borderRadius: 12,
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            overflow: 'hidden',
          }}
        >
          <Splitter.Panel
            defaultSize="22%"
            min="16%"
            max="32%"
            collapsible
            style={{
              background: 'var(--bg-surface-card)',
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {renderSessionsPanel()}
          </Splitter.Panel>

          <Splitter.Panel
            defaultSize="53%"
            min="38%"
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-surface-card)',
              overflow: 'hidden',
            }}
          >
            {renderChatPanel()}
          </Splitter.Panel>

          <Splitter.Panel
            defaultSize="25%"
            min="18%"
            max="36%"
            collapsible
            style={{
              background: 'var(--bg-surface-card)',
              borderLeft: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {renderToolsPanel('vertical')}
          </Splitter.Panel>
        </Splitter>
      )}

      {/* ── BỐ CỤC 2: CỘT PHIÊN TRÁI + BÊN PHẢI CHIA TRÊN DƯỚI (CÔNG CỤ TRÊN, CHAT DƯỚI) ── */}
      {layoutMode === 'LEFT_STACKED_RIGHT' && (
        <Splitter
          style={{
            height: 'calc(100vh - 160px)',
            minHeight: 640,
            background: 'var(--bg-surface-card)',
            borderRadius: 12,
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            overflow: 'hidden',
          }}
        >
          <Splitter.Panel
            defaultSize="22%"
            min="16%"
            max="32%"
            collapsible
            style={{
              background: 'var(--bg-surface-card)',
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {renderSessionsPanel()}
          </Splitter.Panel>

          <Splitter.Panel defaultSize="78%" min="60%">
            <Splitter layout="vertical" style={{ height: '100%', background: 'var(--bg-surface-card)' }}>
              <Splitter.Panel
                defaultSize="32%"
                min="20%"
                max="48%"
                collapsible
                style={{
                  background: 'var(--bg-surface-card)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {renderToolsPanel('horizontal')}
              </Splitter.Panel>
              <Splitter.Panel
                defaultSize="68%"
                min="50%"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--bg-surface-card)',
                  overflow: 'hidden',
                }}
              >
                {renderChatPanel()}
              </Splitter.Panel>
            </Splitter>
          </Splitter.Panel>
        </Splitter>
      )}

      {/* ── BỐ CỤC 3: KHUNG CHAT CHÍNH BÊN TRÁI + CỘT PHẢI CHIA 2 TẦNG (PHIÊN TRÊN, CÔNG CỤ DƯỚI) ── */}
      {layoutMode === 'RIGHT_STACKED_LEFT' && (
        <Splitter
          style={{
            height: 'calc(100vh - 160px)',
            minHeight: 640,
            background: 'var(--bg-surface-card)',
            borderRadius: 12,
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            overflow: 'hidden',
          }}
        >
          <Splitter.Panel
            defaultSize="70%"
            min="55%"
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-surface-card)',
              borderRight: '1px solid var(--border-subtle)',
              overflow: 'hidden',
            }}
          >
            {renderChatPanel()}
          </Splitter.Panel>

          <Splitter.Panel defaultSize="30%" min="22%" max="42%" collapsible>
            <Splitter layout="vertical" style={{ height: '100%', background: 'var(--bg-surface-card)' }}>
              <Splitter.Panel
                defaultSize="45%"
                min="25%"
                max="65%"
                style={{
                  background: 'var(--bg-surface-card)',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {renderSessionsPanel()}
              </Splitter.Panel>
              <Splitter.Panel
                defaultSize="55%"
                min="30%"
                style={{
                  background: 'var(--bg-surface-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {renderToolsPanel('vertical')}
              </Splitter.Panel>
            </Splitter>
          </Splitter.Panel>
        </Splitter>
      )}

      {/* Multi-Tool & File/Chat Mini-Window Inspector Hub */}
      <AgentOmniInspectorModal
        open={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        defaultTab={inspectorTab}
      />

      {/* Modal Chỉnh Sửa Ghép Tay Master SKU */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EditOutlined style={{ color: '#ed1c24' }} />
            <span style={{ color: 'var(--text-primary)' }}>Chỉnh sửa ghép tay Master SKU</span>
          </div>
        }
        open={manualEditOpen}
        onCancel={() => setManualEditOpen(false)}
        onOk={handleSaveManualEdit}
        okText="Xác nhận & Khớp ngay"
        cancelText="Hủy bỏ"
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" style={{ marginTop: 14 }}>
          <div style={{ background: 'var(--bg-surface-alt)', padding: '10px 14px', borderRadius: 8, marginBottom: 14, border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Sản phẩm sàn TMĐT:</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{manualEditSku?.productName}</div>
            <div style={{ fontSize: 12, color: '#ed1c24', marginTop: 2 }}>Mã sàn: {manualEditSku?.channelSku} ({manualEditSku?.channel})</div>
          </div>

          <Form.Item
            label="Mã Master SKU POS (Kho Tổng)"
            name="targetMasterSku"
            rules={[{ required: true, message: 'Vui lòng nhập mã Master SKU' }]}
          >
            <Input placeholder="Ví dụ: POLO-PREM-NVY-M, AT-COT-BLK-L..." />
          </Form.Item>

          <Form.Item
            label="Tên Master SKU POS"
            name="targetProductName"
            rules={[{ required: true, message: 'Vui lòng nhập tên Master SKU' }]}
          >
            <Input placeholder="Tên sản phẩm quản lý trong kho POS..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Form.Item label="Hệ thống POS / ERP" name="targetPosPlatform">
              <Select>
                <Select.Option value="SAPO">Sapo POS</Select.Option>
                <Select.Option value="KIOTVIET">KiotViet</Select.Option>
                <Select.Option value="HARAVAN">Haravan</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Tỷ lệ quy đổi (Ratio)" name="conversionRatio">
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default CopilotAgentPage;
