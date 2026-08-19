import React, { useState } from 'react';
import { Modal, Tag, Input, Avatar } from 'antd';
import {
  SendOutlined,
  ThunderboltFilled,
  EditOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { BaseButton } from '../base';
import { notify } from '../../utils/notification';
import { getPartnerLogo } from '../../utils/partnerLogos';

interface PancakeChatPreviewModalProps {
  open: boolean;
  onClose: () => void;
}

export const PancakeChatPreviewModal: React.FC<PancakeChatPreviewModalProps> = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'customer',
      text: 'Shop ơi cho mình hỏi áo Polo Pima Nam cao 1m75 nặng 70kg mặc size nào vừa vậy shop? Có sẵn hàng không ạ?',
      time: '10:14',
    },
    {
      id: '2',
      sender: 'ai',
      text: 'Dạ chào bạn Tuấn! Với chiều cao 1m75 nặng 70kg, bạn mặc **Size L** của Áo Polo Pima là vừa vặn và tôn dáng nhất nhé ạ! Hiện bên mình đang có sẵn tại Kho Tổng Hà Nội và đang có ưu đãi còn **350.000đ/áo**. Bạn muốn shop gửi màu Trắng hay Xanh Navy ạ? 😊',
      time: '10:14',
      aiMetadata: {
        intent: 'TƯ_VẤN_SIZE_ÁO',
        confidence: 99.1,
        source: 'Bảng size Master Catalog & Tồn kho Sapo POS (WH_MAIN_HN: 340 chiếc)',
        latency: '1.1s',
      },
    },
    {
      id: '3',
      sender: 'customer',
      text: 'Cho mình 1 chiếc màu Xanh Navy size L nhé, ship về số 12 Cầu Giấy, Hà Nội giúp mình.',
      time: '10:15',
    },
    {
      id: '4',
      sender: 'ai',
      text: 'Dạ vâng ạ! Shop đã tạo đơn hàng thành công cho bạn:\n- **Sản phẩm**: Áo Polo Pima Nam Cao Cấp (Xanh Navy - Size L)\n- **Tổng thanh toán**: 350.000đ (Freeship qua Viettel Post Hỏa Tốc)\n- **Mã đơn hàng**: #UNF-88291\nShop sẽ bàn giao ngay cho đơn vị vận chuyển trong 30 phút tới nhé ạ! 🎉',
      time: '10:15',
      aiMetadata: {
        intent: 'CHỐT_ĐƠN_TỰ_ĐỘNG',
        confidence: 98.6,
        source: 'Đồng bộ Sapo POS ➔ So sánh cước chọn Viettel Post (19.5k) ➔ Tạo vận đơn',
        latency: '1.3s',
      },
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isManualOverride, setIsManualOverride] = useState(false);

  const handleSendManual = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'ai',
        text: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
    notify.success('Đã gửi tin nhắn can thiệp thủ công tới khách hàng!');
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={780}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
              }}
            >
              <img
                src={getPartnerLogo('pancake') || '/favicon.svg'}
                alt="Pancake"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>Cửa sổ kiểm tra hội thoại Pancake POS & AI CSKH</span>
                <Tag color="green" style={{ borderRadius: 4, margin: 0, fontSize: 11 }}>
                  ● Live Sync
                </Tag>
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 400 }}>
                Khách hàng: <strong>Nguyễn Văn Tuấn</strong> (Fanpage Thời Trang An Khang • ID: #CUST_7891)
              </div>
            </div>
          </div>
        </div>
      }
      styles={{
        body: { padding: '12px 16px', background: '#F9FAFB' },
      }}
    >
      <div style={{ display: 'flex', gap: 14, height: 480 }}>
        {/* Left: Chat Thread */}
        <div
          style={{
            flex: 1,
            background: '#FFFFFF',
            borderRadius: 10,
            border: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Messages list */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {messages.map((m) => {
              const isCust = m.sender === 'customer';

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: isCust ? 'row' : 'row-reverse',
                    gap: 8,
                    alignItems: 'flex-start',
                  }}
                >
                  <Avatar
                    size={28}
                    style={{
                      backgroundColor: isCust ? '#3B82F6' : '#ed1c24',
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    {isCust ? 'T' : <ThunderboltFilled style={{ fontSize: 12 }} />}
                  </Avatar>

                  <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: isCust ? '2px 12px 12px 12px' : '12px 2px 12px 12px',
                        background: isCust ? '#F3F4F6' : '#FFF1F1',
                        border: isCust ? '1px solid #E5E7EB' : '1px solid #FCA5A5',
                        color: '#1F2937',
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {m.text}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCust ? 'flex-start' : 'flex-end',
                        gap: 6,
                        fontSize: 10,
                        color: '#9CA3AF',
                      }}
                    >
                      <span>{m.time}</span>
                      {!isCust && (
                        <span style={{ color: '#ed1c24', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                          <ThunderboltFilled /> AI Auto-Reply
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Manual Input / Override */}
          <div
            style={{
              padding: '8px 10px',
              borderTop: '1px solid #E5E7EB',
              background: '#FAFAFA',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <Input
              size="small"
              placeholder={isManualOverride ? 'Nhập tin nhắn can thiệp thủ công...' : 'AI đang tự động phản hồi...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPressEnter={handleSendManual}
              style={{ borderRadius: 6 }}
            />
            <BaseButton
              variant="primary"
              size="small"
              icon={<SendOutlined />}
              onClick={handleSendManual}
            >
              Gửi
            </BaseButton>
          </div>
        </div>

        {/* Right: AI Decision & Diagnostic Panel */}
        <div
          style={{
            width: 260,
            background: '#FFFFFF',
            borderRadius: 10,
            border: '1px solid #E5E7EB',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            fontSize: 12,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 13, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ThunderboltFilled style={{ color: '#ed1c24' }} />
            <span>Phân tích AI 0-Chạm</span>
          </div>

          <div style={{ background: '#F9FAFB', padding: 8, borderRadius: 6, border: '1px solid #E5E7EB' }}>
            <div style={{ color: '#6B7280', fontSize: 11 }}>Ý định phát hiện (Intent):</div>
            <strong style={{ color: '#059669', fontSize: 12 }}>TƯ VẤN SIZE & CHỐT ĐƠN</strong>
            <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>Độ tin cậy: 99.1%</div>
          </div>

          <div style={{ background: '#F9FAFB', padding: 8, borderRadius: 6, border: '1px solid #E5E7EB' }}>
            <div style={{ color: '#6B7280', fontSize: 11 }}>Dữ liệu tham chiếu:</div>
            <div style={{ fontSize: 11, color: '#374151', marginTop: 2 }}>
              • Master SKU: <strong>POLO-PREM-NVY-M</strong><br />
              • Tồn khả dụng Sapo: <strong>340 cái</strong><br />
              • Cước tối ưu: <strong>Viettel Post (19.5k)</strong>
            </div>
          </div>

          <div style={{ background: '#F9FAFB', padding: 8, borderRadius: 6, border: '1px solid #E5E7EB' }}>
            <div style={{ color: '#6B7280', fontSize: 11 }}>Kênh liên kết:</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
              <Tag color="blue">Pancake POS</Tag>
              <Tag color="purple">Shopee Chat</Tag>
              <Tag color="cyan">Zalo ZNS</Tag>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <BaseButton
              variant={isManualOverride ? 'primary' : 'ghost'}
              size="small"
              icon={<CustomerServiceOutlined />}
              onClick={() => {
                setIsManualOverride(!isManualOverride);
                notify.info(
                  isManualOverride ? 'Đã tắt chế độ can thiệp thủ công, AI tiếp tục điều hành!' : 'Đã bật chế độ can thiệp thủ công!'
                );
              }}
              style={{ width: '100%' }}
            >
              {isManualOverride ? 'Tắt can thiệp (Bật lại AI)' : 'Can thiệp chat thủ công'}
            </BaseButton>

            <BaseButton
              variant="ghost"
              size="small"
              icon={<EditOutlined />}
              onClick={() => notify.success('Mở bảng cấu hình Prompt bot Pancake!')}
              style={{ width: '100%' }}
            >
              Sửa Prompt bot Pancake
            </BaseButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PancakeChatPreviewModal;
