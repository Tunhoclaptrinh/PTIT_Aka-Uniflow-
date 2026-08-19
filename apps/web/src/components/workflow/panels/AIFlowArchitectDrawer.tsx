import React, { useState } from 'react';
import {
  Drawer,
  Tag,
  Input,
  Avatar,
  Divider,
} from 'antd';
import {
  SendOutlined,
  AppstoreAddOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { BaseButton } from '../../base/BaseButton';
import { notify } from '../../../utils/notification';
import { MarkdownRenderer } from '../../common/MarkdownRenderer';

const { TextArea } = Input;

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
  onApplyFlowUpdate: _onApplyFlowUpdate,
  onGroupSelectedNodes,
  onUngroupNodes,
}) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'agent',
      text: `Xin chào! Tôi là **AI Flow Architect** – Trợ lý kiến trúc quy trình tự động.\n\nTôi đã rà soát toàn bộ hạ tầng cổng kết nối hiện có của bạn:\n- **Kho POS/ERP**: Sapo POS (Kho Tổng HN) ✅\n- **Sàn TMĐT**: TikTok Shop, Shopee Mall, Lazada ✅\n- **Vận chuyển**: GHTK, GHN, Viettel Post ✅\n- **Bảng tính**: Google Sheets Live Sync ✅\n\nBạn có thể yêu cầu tôi **phân nhánh so sánh giá**, **tạo cụm phân vùng gom nhóm**, hoặc **tự động kiểm tra SLA đối tác** ngay tại đây!`,
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
        reply = `Đã phân tích yêu cầu gom nhóm!\n\nTôi đề xuất gom **3 khối vận chuyển (GHTK, GHN, Viettel Post)** cùng **AI So sánh cước** vào **Phân vùng Cụm So Sánh Cước Thông Minh**.\n\nBạn có thể bấm nút **"Gom nhóm phân vùng"** bên dưới để áp dụng trực tiếp lên Canvas.`;
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
    }, 800);
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/favicon.svg" alt="UniFlow" style={{ width: 20, height: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>AI Kiến trúc Quy trình & Kiểm tra Hạ tầng</span>
          </div>
          <Tag color="purple" style={{ borderRadius: 4, margin: 0 }}>
            Flow Architect v2
          </Tag>
        </div>
      }
      placement="right"
      width={580}
      open={open}
      onClose={onClose}
      styles={{
        body: { padding: 16, display: 'flex', flexDirection: 'column', background: '#F9FAFB' },
      }}
    >
      {/* 1. Infrastructure Status Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 10,
          border: '1px solid #E5E7EB',
          padding: '12px 14px',
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ApiOutlined style={{ color: '#ed1c24' }} />
            HẠ TẦNG KẾT NỐI KHẢ DỤNG THỰC TẾ
          </span>
          <Tag color="green" style={{ margin: 0, fontSize: 10 }}>
            ● 6 Cổng sẵn sàng
          </Tag>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Tag color="blue">Sapo POS (WH_MAIN_HN)</Tag>
          <Tag color="red">TikTok Shop Inbound</Tag>
          <Tag color="orange">Shopee Mall v2</Tag>
          <Tag color="green">GHTK Express</Tag>
          <Tag color="volcano">GHN Nhanh</Tag>
          <Tag color="magenta">Viettel Post</Tag>
          <Tag color="cyan">Google Sheets Live</Tag>
        </div>
      </div>

      {/* 2. Grouping & Region Control Bar */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 10,
          border: '1px solid #E5E7EB',
          padding: '10px 14px',
          marginBottom: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 12, color: '#111827' }}>
            Thao tác vùng chọn Canvas:
          </div>
          <div style={{ fontSize: 11, color: '#6B7280' }}>
            {selectedNodesCount > 0
              ? `Đang chọn ${selectedNodesCount} khối trên Canvas`
              : 'Gom các khối so sánh giá thành 1 Phân vùng cụm'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
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

      {/* 3. Interactive Architect Chat Thread */}
      <div
        style={{
          flex: 1,
          background: '#FFFFFF',
          borderRadius: 10,
          border: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 12,
        }}
      >
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
                    backgroundColor: isUser ? '#ed1c24' : '#FFFFFF',
                    border: isUser ? 'none' : '1px solid #E5E7EB',
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
                    background: isUser ? '#ed1c24' : '#F9FAFB',
                    border: isUser ? 'none' : '1px solid #E5E7EB',
                    fontSize: 13,
                  }}
                >
                  <MarkdownRenderer content={m.text} isUser={isUser} />
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Avatar size={28} src="/favicon.svg" style={{ border: '1px solid #E5E7EB', padding: 2 }} />
              <span style={{ fontSize: 12, color: '#6B7280' }}>AI Architect đang kiểm tra sơ đồ khối...</span>
            </div>
          )}
        </div>

        {/* Action Apply Button */}
        <Divider style={{ margin: '10px 0' }} />

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <TextArea
            rows={1}
            autoSize={{ minRows: 1, maxRows: 3 }}
            placeholder="Ra lệnh chỉnh sửa (VD: Thêm nhánh hàng cồng kềnh > 5kg, đổi kho POS...)"
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
    </Drawer>
  );
};

export default AIFlowArchitectDrawer;
