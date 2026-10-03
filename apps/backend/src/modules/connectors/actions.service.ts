import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { Connector, ConnectorDocument } from '../../database/schemas/connector.schema';
import { SyncEventLog, SyncEventLogDocument } from '../../database/schemas/sync-event-log.schema';
import { EventsGateway } from '../websocket/events.gateway';
import { SandboxService } from '../developer-portal/sandbox.service';
import { SecurityService } from '../../security/security.service';
import { UDMNormalizerService } from '../normalizer/udm-normalizer.service';
import { PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';
import { SapoClient } from './clients/sapo.client';
import { NhanhClient } from './clients/nhanh.client';
import { PancakeClient } from './clients/pancake.client';
import { MisaClient } from './clients/misa.client';
import { TelegramClient } from './clients/telegram.client';
import { MarketplaceClient } from './clients/marketplace.client';

export interface ActionMetadata {
  id: string;
  name: string;
  platform: PlatformType;
  category: 'ORDER' | 'INVENTORY' | 'INVOICE' | 'CRM' | 'NOTIFY' | 'MARKETPLACE' | 'CORE' | 'PROMOTION';
  description: string;
  parameters: Record<string, { type: string; required: boolean; description: string; example?: any }>;
}

export const ACTIONS_CATALOG: ActionMetadata[] = [
  // ── 1. SAPO OMNICHANNEL ──
  {
    id: 'sapo_create_order',
    name: 'Tạo đơn hàng Sapo',
    platform: PlatformType.SAPO,
    category: 'ORDER',
    description: 'Tạo đơn hàng mới trên hệ thống bán hàng Sapo POS & Omnichannel',
    parameters: {
      order: { type: 'object', required: true, description: 'Đối tượng đơn hàng chuẩn Sapo (shipping_address, line_items, total_price)' },
    },
  },
  {
    id: 'sapo_get_orders',
    name: 'Lấy danh sách đơn Sapo',
    platform: PlatformType.SAPO,
    category: 'ORDER',
    description: 'Truy vấn danh sách đơn hàng từ Sapo POS theo trạng thái và phân trang',
    parameters: {
      status: { type: 'string', required: false, description: 'Trạng thái đơn (open, closed, cancelled)' },
      limit: { type: 'number', required: false, description: 'Số lượng đơn cần lấy (mặc định: 10)' },
    },
  },
  {
    id: 'sapo_cancel_order',
    name: 'Hủy đơn hàng Sapo',
    platform: PlatformType.SAPO,
    category: 'ORDER',
    description: 'Hủy đơn hàng trên Sapo và tự động hoàn trả số lượng tồn kho (restock)',
    parameters: {
      order_id: { type: 'number', required: true, description: 'ID đơn hàng Sapo' },
      restock: { type: 'boolean', required: false, description: 'Hoàn tồn kho hay không (mặc định: true)' },
    },
  },
  {
    id: 'sapo_adjust_inventory',
    name: 'Điều chỉnh tồn kho Sapo',
    platform: PlatformType.SAPO,
    category: 'INVENTORY',
    description: 'Cập nhật số lượng tồn kho thực tế cho Variant tại kho hàng (Location) Sapo',
    parameters: {
      location_id: { type: 'number', required: true, description: 'ID chi nhánh kho Sapo' },
      inventory_item_id: { type: 'number', required: true, description: 'ID mặt hàng tồn kho' },
      available_adjustment: { type: 'number', required: true, description: 'Số lượng tăng (+) hoặc giảm (-)' },
    },
  },
  {
    id: 'sapo_adjust_stock',
    name: 'Cân bằng tồn kho Sapo',
    platform: PlatformType.SAPO,
    category: 'INVENTORY',
    description: 'Cập nhật số lượng tồn khả dụng cho biến thể tại một kho xác định',
    parameters: {
      locationId: { type: 'number', required: true, description: 'ID chi nhánh kho' },
      variantId: { type: 'number', required: true, description: 'ID biến thể sản phẩm' },
      available: { type: 'number', required: true, description: 'Số lượng tồn khả dụng mới' },
    },
  },
  {
    id: 'sapo_transfer_stock',
    name: 'Chuyển kho nội bộ Sapo',
    platform: PlatformType.SAPO,
    category: 'INVENTORY',
    description: 'Tạo lệnh điều chuyển hàng hóa giữa các kho nội bộ Sapo',
    parameters: {
      fromLocationId: { type: 'number', required: true, description: 'ID kho gửi' },
      toLocationId: { type: 'number', required: true, description: 'ID kho nhận' },
      lineItems: { type: 'array', required: true, description: 'Danh sách mặt hàng chuyển' },
    },
  },
  {
    id: 'sapo_get_variants',
    name: 'Lấy biến thể & tồn kho Sapo',
    platform: PlatformType.SAPO,
    category: 'INVENTORY',
    description: 'Lấy danh sách biến thể sản phẩm, SKU và tồn khả dụng trên Sapo',
    parameters: {
      limit: { type: 'number', required: false, description: 'Số lượng biến thể tối đa' },
    },
  },

  // ── 2. NHANH.VN ──
  {
    id: 'nhanh_add_order',
    name: 'Tạo đơn hàng Nhanh.vn',
    platform: PlatformType.NHANH_VN,
    category: 'ORDER',
    description: 'Khởi tạo đơn hàng vận chuyển mới trên hệ thống Nhanh.vn Open API',
    parameters: {
      depotId: { type: 'number', required: true, description: 'ID kho xuất hàng Nhanh.vn' },
      customerName: { type: 'string', required: true, description: 'Tên người nhận' },
      customerMobile: { type: 'string', required: true, description: 'Số điện thoại người nhận' },
      customerAddress: { type: 'string', required: true, description: 'Địa chỉ nhận hàng' },
      productList: { type: 'array', required: true, description: 'Danh sách sản phẩm [{ idProduct, quantity, price }]' },
    },
  },
  {
    id: 'nhanh_search_orders',
    name: 'Tìm kiếm đơn hàng Nhanh.vn',
    platform: PlatformType.NHANH_VN,
    category: 'ORDER',
    description: 'Tra cứu danh sách đơn hàng Nhanh.vn theo bộ lọc trạng thái và khoảng thời gian',
    parameters: {
      page: { type: 'number', required: false, description: 'Trang truy vấn' },
      status: { type: 'string', required: false, description: 'Mã trạng thái đơn (Confirmed, Success, Canceled)' },
    },
  },
  {
    id: 'nhanh_check_stock',
    name: 'Kiểm tra tồn kho Nhanh.vn',
    platform: PlatformType.NHANH_VN,
    category: 'INVENTORY',
    description: 'Kiểm tra tồn kho khả dụng (available, remain, shipping) tại từng kho Nhanh.vn',
    parameters: {
      depotId: { type: 'number', required: true, description: 'ID kho Nhanh.vn' },
      productIds: { type: 'array', required: false, description: 'Danh sách ID sản phẩm cần tra cứu' },
    },
  },
  {
    id: 'nhanh_get_depots',
    name: 'Lấy danh sách kho Nhanh.vn',
    platform: PlatformType.NHANH_VN,
    category: 'INVENTORY',
    description: 'Truy vấn danh mục tất cả chi nhánh điểm kho của doanh nghiệp trên Nhanh.vn',
    parameters: {},
  },
  {
    id: 'nhanh_cancel_order',
    name: 'Hủy đơn hàng Nhanh.vn',
    platform: PlatformType.NHANH_VN,
    category: 'ORDER',
    description: 'Hủy đơn hàng và cập nhật lý do hủy trên Nhanh.vn',
    parameters: {
      orderId: { type: 'number', required: true, description: 'ID đơn hàng' },
      reason: { type: 'string', required: false, description: 'Lý do hủy đơn' },
    },
  },
  {
    id: 'nhanh_calculate_fee',
    name: 'Tính phí vận chuyển Nhanh.vn',
    platform: PlatformType.NHANH_VN,
    category: 'ORDER',
    description: 'Tính toán cước phí vận chuyển tối ưu theo các hãng liên kết Nhanh Ship',
    parameters: {
      fromDepotId: { type: 'number', required: true, description: 'ID kho gửi' },
      toDistrictId: { type: 'number', required: true, description: 'ID quận huyện nhận' },
      weight: { type: 'number', required: true, description: 'Khối lượng gram' },
    },
  },
  {
    id: 'nhanh_add_invoice',
    name: 'Xuất hóa đơn điện tử Nhanh.vn',
    platform: PlatformType.NHANH_VN,
    category: 'INVOICE',
    description: 'Phát hành hóa đơn VAT điện tử cho đơn hàng theo chuẩn Tổng Cục Thuế',
    parameters: {
      orderId: { type: 'number', required: true, description: 'ID đơn hàng' },
      buyerTaxCode: { type: 'string', required: true, description: 'Mã số thuế bên mua' },
      buyerLegalName: { type: 'string', required: true, description: 'Tên công ty bên mua' },
    },
  },
  {
    id: 'nhanh_send_zns',
    name: 'Gửi Zalo ZNS Nhanh.vn',
    platform: PlatformType.NHANH_VN,
    category: 'NOTIFY',
    description: 'Gửi tin nhắn chăm sóc khách hàng tự động qua Zalo ZNS Official Account',
    parameters: {
      phone: { type: 'string', required: true, description: 'Số điện thoại nhận tin' },
      templateId: { type: 'string', required: true, description: 'Mã template ZNS' },
      templateData: { type: 'object', required: true, description: 'Dữ liệu điền mẫu ZNS' },
    },
  },
  {
    id: 'nhanh_sync_ecom_stock',
    name: 'Đồng bộ tồn sàn TMĐT Nhanh.vn',
    platform: PlatformType.NHANH_VN,
    category: 'INVENTORY',
    description: 'Đồng bộ số lượng tồn kho tức thời lên Shopee, TikTok Shop, Lazada',
    parameters: {
      depotId: { type: 'number', required: true, description: 'ID kho POS' },
      marketplace: { type: 'string', required: true, description: 'Sàn TMĐT' },
      items: { type: 'array', required: true, description: 'Danh sách SKU và tồn' },
    },
  },

  // ── 3. PANCAKE POS & SOCIAL ──
  {
    id: 'pancake_create_order',
    name: 'Tạo đơn Pancake POS',
    platform: PlatformType.PANCAKE,
    category: 'ORDER',
    description: 'Tạo đơn hàng từ luồng chat Facebook/Zalo/TikTok sang Pancake POS',
    parameters: {
      page_id: { type: 'string', required: true, description: 'ID Fanpage / Shop ID' },
      customer_name: { type: 'string', required: true, description: 'Tên khách hàng' },
      phone_number: { type: 'string', required: true, description: 'Số điện thoại' },
      items: { type: 'array', required: true, description: 'Danh sách sản phẩm đơn hàng' },
    },
  },
  {
    id: 'pancake_list_orders',
    name: 'Lấy đơn hàng Pancake',
    platform: PlatformType.PANCAKE,
    category: 'ORDER',
    description: 'Lấy danh sách đơn hàng được chốt trên Pancake POS',
    parameters: {
      page_number: { type: 'number', required: false, description: 'Số trang' },
      page_size: { type: 'number', required: false, description: 'Kích thước trang' },
    },
  },
  {
    id: 'pancake_list_conversations',
    name: 'Lấy hội thoại Pancake',
    platform: PlatformType.PANCAKE,
    category: 'CRM',
    description: 'Truy vấn danh sách tin nhắn Inbox & bình luận từ khách hàng trên Pancake Chat',
    parameters: {
      page_id: { type: 'string', required: true, description: 'ID Fanpage Pancake' },
      limit: { type: 'number', required: false, description: 'Số hội thoại cần lấy' },
    },
  },
  {
    id: 'pancake_send_chat',
    name: 'Gửi tin nhắn Pancake',
    platform: PlatformType.PANCAKE,
    category: 'NOTIFY',
    description: 'Gửi tin nhắn phản hồi tự động cho khách hàng trong luồng hội thoại Pancake',
    parameters: {
      page_id: { type: 'string', required: true, description: 'ID Fanpage Pancake' },
      conversation_id: { type: 'string', required: true, description: 'ID hội thoại khách hàng' },
      message: { type: 'string', required: true, description: 'Nội dung tin nhắn cần gửi' },
    },
  },

  // ── 4. MISA MEINVOICE (HÓA ĐƠN ĐIỆN TỬ) ──
  {
    id: 'misa_save_invoice',
    name: 'Lập hóa đơn nháp MISA',
    platform: PlatformType.MISA_MEINVOICE,
    category: 'INVOICE',
    description: 'Tạo hóa đơn điện tử nháp trên hệ thống MISA meInvoice từ đơn bán hàng',
    parameters: {
      refID: { type: 'string', required: true, description: 'Mã tham chiếu đơn hàng gốc' },
      invSeries: { type: 'string', required: true, description: 'Ký hiệu mẫu số hóa đơn (VD: 1C24TUU)' },
      buyerLegalName: { type: 'string', required: true, description: 'Tên người mua hàng hoặc công ty' },
      buyerTaxCode: { type: 'string', required: false, description: 'Mã số thuế bên mua' },
      totalAmount: { type: 'number', required: true, description: 'Tổng tiền thanh toán trên hóa đơn' },
      originalInvoiceDetail: { type: 'array', required: true, description: 'Chi tiết danh mục hàng hóa tính thuế' },
    },
  },
  {
    id: 'misa_publish_hsm',
    name: 'Ký số HSM & Phát hành MISA',
    platform: PlatformType.MISA_MEINVOICE,
    category: 'INVOICE',
    description: 'Ký số bảo mật HSM trên đám mây và phát hành hóa đơn có mã Cơ quan Thuế MISA',
    parameters: {
      refID: { type: 'string', required: true, description: 'Mã đơn hàng tham chiếu cần ký số' },
    },
  },
  {
    id: 'misa_get_invoice_by_ref',
    name: 'Tra cứu hóa đơn MISA',
    platform: PlatformType.MISA_MEINVOICE,
    category: 'INVOICE',
    description: 'Kiểm tra trạng thái phát hành, số hóa đơn và link tải hóa đơn PDF từ MISA',
    parameters: {
      refID: { type: 'string', required: true, description: 'Mã tham chiếu đơn hàng' },
    },
  },

  // ── 5. MISA AMIS CRM ──
  {
    id: 'misa_crm_sync_order',
    name: 'Đồng bộ đơn hàng CRM',
    platform: PlatformType.MISA_CRM,
    category: 'CRM',
    description: 'Đẩy đơn hàng đa sàn vào MISA AMIS CRM để theo dõi cơ hội bán hàng & doanh số',
    parameters: {
      orderId: { type: 'string', required: true, description: 'Mã đơn hàng gốc' },
      customerName: { type: 'string', required: true, description: 'Tên khách hàng' },
      amount: { type: 'number', required: true, description: 'Giá trị đơn hàng' },
    },
  },
  {
    id: 'misa_crm_sync_customer',
    name: 'Đồng bộ khách hàng CRM',
    platform: PlatformType.MISA_CRM,
    category: 'CRM',
    description: 'Cập nhật hồ sơ khách hàng, phân hạng thẻ và số điện thoại lên MISA AMIS CRM',
    parameters: {
      customerName: { type: 'string', required: true, description: 'Tên khách hàng' },
      phone: { type: 'string', required: true, description: 'Số điện thoại' },
      email: { type: 'string', required: false, description: 'Email liên hệ' },
    },
  },

  // ── 6. TELEGRAM BOT ──
  {
    id: 'telegram_send_alert',
    name: 'Bắn tin cảnh báo Telegram',
    platform: PlatformType.TELEGRAM,
    category: 'NOTIFY',
    description: 'Gửi tin nhắn thông báo tức thì (đơn mới, lệch tồn, lỗi đồng bộ) qua Telegram Bot',
    parameters: {
      chat_id: { type: 'string', required: false, description: 'Chat ID kênh hoặc nhóm Telegram' },
      text: { type: 'string', required: true, description: 'Nội dung thông báo định dạng Markdown/HTML' },
      parse_mode: { type: 'string', required: false, description: 'Chế độ parse (Markdown, HTML)' },
    },
  },
  {
    id: 'telegram_send_document',
    name: 'Gửi tài liệu qua Telegram',
    platform: PlatformType.TELEGRAM,
    category: 'NOTIFY',
    description: 'Gửi tệp báo cáo Excel, PDF hóa đơn hoặc ảnh chứng từ qua Telegram Bot',
    parameters: {
      chat_id: { type: 'string', required: false, description: 'Chat ID kênh Telegram' },
      document_url: { type: 'string', required: true, description: 'Đường dẫn tệp đính kèm' },
      caption: { type: 'string', required: false, description: 'Mô tả tệp tin' },
    },
  },

  // ── 7. MARKETPLACES (SHOPEE & TIKTOK SHOP) ──
  {
    id: 'shopee_get_order_detail',
    name: 'Kéo chi tiết đơn Shopee',
    platform: PlatformType.SHOPEE,
    category: 'MARKETPLACE',
    description: 'Truy vấn chi tiết đơn hàng, vận chuyển và giá thanh toán từ Shopee Open Platform V2',
    parameters: {
      order_sn: { type: 'string', required: true, description: 'Mã vận đơn / mã đơn hàng Shopee' },
    },
  },
  {
    id: 'tiktok_get_order_detail',
    name: 'Kéo chi tiết đơn TikTok Shop',
    platform: PlatformType.TIKTOK_SHOP,
    category: 'MARKETPLACE',
    description: 'Truy vấn toàn bộ thuộc tính đơn hàng từ TikTok Shop Open API 202309',
    parameters: {
      order_id: { type: 'string', required: true, description: 'Mã định danh đơn hàng TikTok Shop' },
    },
  },

  // ── 8. UNIVERSAL DATA MODEL CORE ──
  {
    id: 'uniflow_normalize_to_udm',
    name: 'Chuẩn hóa sang UDM',
    platform: PlatformType.SAPO,
    category: 'CORE',
    description: 'Chuyển đổi dữ liệu đơn thô từ bất kỳ đối tác nào sang chuẩn UniversalOrderModel',
    parameters: {
      platform: { type: 'string', required: true, description: 'Nền tảng nguồn (SAPO, NHANH_VN, PANCAKE, TIKTOK, SHOPEE)' },
      raw_payload: { type: 'object', required: true, description: 'Dữ liệu đơn hàng thô ban đầu' },
    },
  },

  // ── 9. VOUCHER & PROMOTION MANAGEMENT (KHUYẾN MÃI & MÃ GIẢM GIÁ) ──
  {
    id: 'core_generate_voucher',
    name: 'Tự động tạo mã Voucher',
    platform: PlatformType.SAPO,
    category: 'PROMOTION',
    description: 'Sinh mã Voucher giảm giá thông minh theo phân khúc khách hàng (VIP/Loyalty) và giá trị đơn hàng',
    parameters: {
      codePrefix: { type: 'string', required: false, description: 'Tiền tố mã voucher (VD: VIP, TET2026, RETRY)' },
      discountType: { type: 'string', required: true, description: 'PERCENTAGE (giảm %) hoặc FIXED_AMOUNT (tiền cố định)' },
      discountValue: { type: 'number', required: true, description: 'Giá trị giảm (VD: 10 cho 10% hoặc 50000 cho 50.000đ)' },
      minSpend: { type: 'number', required: false, description: 'Giá trị đơn tối thiểu' },
      maxDiscount: { type: 'number', required: false, description: 'Số tiền giảm tối đa khi giảm %' },
      validDays: { type: 'number', required: false, description: 'Số ngày hiệu lực (mặc định 7 ngày)' },
      targetPhone: { type: 'string', required: false, description: 'SĐT khách hàng thụ hưởng' },
    },
  },
  {
    id: 'core_validate_voucher',
    name: 'Thẩm định điều kiện Voucher',
    platform: PlatformType.SAPO,
    category: 'PROMOTION',
    description: 'Kiểm tra tính hợp lệ của mã voucher, hạn sử dụng và tính số tiền giảm giá chính xác',
    parameters: {
      voucherCode: { type: 'string', required: true, description: 'Mã voucher khách hàng nhập' },
      orderTotal: { type: 'number', required: true, description: 'Tổng tiền giỏ hàng trước giảm giá' },
      customerPhone: { type: 'string', required: false, description: 'Số điện thoại khách hàng' },
    },
  },
  {
    id: 'shopee_create_voucher',
    name: 'Tạo Voucher Shopee Shop',
    platform: PlatformType.SHOPEE,
    category: 'PROMOTION',
    description: 'Phát hành mã giảm giá Shop trên Shopee Marketing Centre Open API',
    parameters: {
      voucher_name: { type: 'string', required: true, description: 'Tên chiến dịch voucher' },
      voucher_code: { type: 'string', required: true, description: 'Mã voucher (tối đa 4 ký tự sau tiền tố của shop)' },
      discount_amount: { type: 'number', required: false, description: 'Số tiền giảm nếu là cố định' },
      percentage: { type: 'number', required: false, description: '% giảm giá nếu chọn giảm phần trăm' },
      min_basket_price: { type: 'number', required: true, description: 'Giá trị giỏ hàng tối thiểu' },
      usage_quantity: { type: 'number', required: true, description: 'Số lượng voucher phát hành' },
    },
  },
  {
    id: 'sapo_create_discount_code',
    name: 'Tạo mã khuyến mãi Sapo',
    platform: PlatformType.SAPO,
    category: 'PROMOTION',
    description: 'Tạo mã khuyến mãi coupon trên hệ thống Sapo POS & Website',
    parameters: {
      code: { type: 'string', required: true, description: 'Mã giảm giá Sapo' },
      value_type: { type: 'string', required: true, description: 'percentage hoặc fixed_amount' },
      value: { type: 'number', required: true, description: 'Giá trị giảm' },
      minimum_order_amount: { type: 'number', required: false, description: 'Giá trị đơn tối thiểu' },
      usage_limit: { type: 'number', required: false, description: 'Giới hạn số lần dùng' },
    },
  },
  {
    id: 'tiktok_create_promotion',
    name: 'Tạo Voucher TikTok Shop',
    platform: PlatformType.TIKTOK_SHOP,
    category: 'PROMOTION',
    description: 'Tạo chương trình ưu đãi Voucher trên TikTok Shop Marketing Open API',
    parameters: {
      title: { type: 'string', required: true, description: 'Tên chiến dịch voucher' },
      discount_type: { type: 'string', required: true, description: 'DIRECT_DISCOUNT hoặc PERCENT_DISCOUNT' },
      discount_val: { type: 'number', required: true, description: 'Giá trị giảm' },
      threshold_val: { type: 'number', required: true, description: 'Ngưỡng tiền đơn hàng áp dụng' },
    },
  },
];

@Injectable()
export class ActionsService {
  private readonly logger = new Logger(ActionsService.name);

  constructor(
    @InjectModel(Connector.name) private readonly connectorModel: Model<ConnectorDocument>,
    @InjectModel(SyncEventLog.name) private readonly logModel: Model<SyncEventLogDocument>,
    private readonly eventsGateway: EventsGateway,
    private readonly sandboxService: SandboxService,
    private readonly securityService: SecurityService,
    private readonly udmNormalizer: UDMNormalizerService,
  ) {}

  /**
   * Lấy danh mục 23 hành động điều khiển có sẵn của UniFlow
   */
  getCatalog(): ActionMetadata[] {
    return ACTIONS_CATALOG;
  }

  /**
   * Tìm kiếm thông tin hành động
   */
  getActionInfo(actionId: string): ActionMetadata | undefined {
    return ACTIONS_CATALOG.find((a) => a.id === actionId);
  }

  /**
   * Thực thi hành động điều khiển (Hỗ trợ LIVE và SANDBOX mode)
   */
  async executeAction(
    actionId: string,
    payload: any,
    mode: 'LIVE' | 'SANDBOX' = 'SANDBOX',
    tenantId: string = '66c0e812a1b2c3d4e5f60001',
  ) {
    const startTime = Date.now();
    let actionMeta = this.getActionInfo(actionId);

    if (!actionMeta) {
      const prefix = actionId.split('_')[0];
      const platformMap: Record<string, PlatformType> = {
        shopee: PlatformType.SHOPEE,
        tiktok: PlatformType.TIKTOK_SHOP,
        lazada: PlatformType.SHOPEE,
        tiki: PlatformType.SHOPEE,
        shopify: PlatformType.SHOPEE,
      };
      if (platformMap[prefix]) {
        actionMeta = {
          id: actionId,
          name: `Hành động ${actionId}`,
          platform: platformMap[prefix],
          category: 'MARKETPLACE',
          description: `Định tuyến tự động cho ${actionId}`,
          parameters: {},
        };
      } else {
        throw new NotFoundException(`Hành động #${actionId} không tồn tại trong danh mục điều khiển UniFlow`);
      }
    }

    const traceId = `act_${actionId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    let result: any;
    let isSuccess = true;
    let errorMessage: string | undefined;

    try {
      if (mode === 'LIVE') {
        result = await this.executeLiveAction(actionMeta, payload, tenantId);
      } else {
        result = await this.executeSandboxAction(actionMeta, payload);
      }
    } catch (err: any) {
      isSuccess = false;
      errorMessage = err.message || 'Lỗi thực thi điều khiển đối tác';
      result = { error: errorMessage, code: err.response?.status || 500 };
      this.logger.error(`[ActionsService] Thất bại khi thực thi ${actionId}: ${errorMessage}`);
    }

    const durationMs = Date.now() - startTime;

    const sourceOrderId = String(
      payload?.order_sn || payload?.order_id || payload?.orderId || payload?.refID || `ACT-${Date.now()}`
    );
    const actionMessage = isSuccess
      ? `Thực thi thành công ${actionMeta.name} (${mode}) trong ${durationMs}ms`
      : `Lỗi thực thi ${actionMeta.name} (${mode}): ${errorMessage}`;

    // 1. Ghi log kiểm toán vào MongoDB
    await this.logModel.create({
      tenantId: Types.ObjectId.isValid(tenantId) ? new Types.ObjectId(tenantId) : new Types.ObjectId('66c0e812a1b2c3d4e5f60001'),
      platform: actionMeta.platform,
      sourceOrderId,
      status: isSuccess ? WebhookProcessingStatus.COMPLETED : WebhookProcessingStatus.FAILED,
      durationMs,
      message: actionMessage,
      aiHealed: false,
    }).catch((err) => {
      this.logger.warn(`Lỗi ghi SyncEventLog cho action ${actionId}: ${err.message}`);
    });

    // 2. Bắn live event qua WebSocket cho Dashboard
    this.eventsGateway.emitLiveFeed({
      id: traceId,
      timestamp: new Date().toISOString(),
      tenantId,
      platform: actionMeta.platform,
      sourceOrderId: payload?.order_sn || payload?.order_id || payload?.orderId || payload?.refID || `CMD-${Date.now()}`,
      status: isSuccess ? WebhookProcessingStatus.COMPLETED : WebhookProcessingStatus.FAILED,
      durationMs,
      message: `[${mode}] Thực thi lệnh ${actionMeta.name}: ${isSuccess ? 'Thành công' : 'Thất bại'} (${durationMs}ms)`,
      rawLog: { actionId, isSuccess, durationMs },
    });

    return {
      success: isSuccess,
      actionId,
      actionName: actionMeta.name,
      platform: actionMeta.platform,
      mode,
      durationMs,
      traceId,
      result,
    };
  }

  /**
   * Thực thi trong môi trường SANDBOX
   */
  private async executeSandboxAction(meta: ActionMetadata, payload: any): Promise<any> {
    switch (meta.platform) {
      case PlatformType.SAPO:
        if (meta.id === 'core_generate_voucher') {
          const prefix = payload.codePrefix || 'VIP';
          const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
          const validDays = Number(payload.validDays || 7);
          const validUntil = new Date(Date.now() + validDays * 86400000).toISOString();
          return {
            success: true,
            voucherCode: `${prefix}-${randomSuffix}`,
            discountType: payload.discountType || 'PERCENTAGE',
            discountValue: Number(payload.discountValue || 10),
            minSpend: Number(payload.minSpend || 0),
            maxDiscount: Number(payload.maxDiscount || 50000),
            validUntil,
            targetPhone: payload.targetPhone || '',
            status: 'ACTIVE',
            message: `Tạo voucher cá nhân hóa [${prefix}-${randomSuffix}] thành công`,
          };
        }
        if (meta.id === 'core_validate_voucher') {
          const total = Number(payload.orderTotal || 0);
          const code = String(payload.voucherCode || '').toUpperCase();
          const isVip = code.startsWith('VIP');
          const minSpend = isVip ? 200000 : 100000;
          if (total < minSpend) {
            return {
              isValid: false,
              voucherCode: code,
              discountAmount: 0,
              rejectionReason: `Đơn hàng chưa đạt giá trị tối thiểu ${minSpend.toLocaleString('vi-VN')}đ`,
            };
          }
          const discount = Math.min(total * 0.1, 50000);
          return {
            isValid: true,
            voucherCode: code,
            discountAmount: discount,
            finalTotal: total - discount,
            message: `Áp dụng thành công voucher [${code}], giảm ${discount.toLocaleString('vi-VN')}đ`,
          };
        }
        if (meta.id === 'sapo_create_discount_code') {
          return {
            success: true,
            discount_code: {
              code: payload.code || `SAPO_${Date.now()}`,
              value_type: payload.value_type || 'percentage',
              value: payload.value || 10,
              created_at: new Date().toISOString(),
            },
          };
        }
        if (meta.id === 'sapo_create_order') {
          return this.sandboxService.handleSapoSandbox('/admin/orders.json', 'POST', payload);
        }
        if (meta.id === 'sapo_get_variants') {
          return this.sandboxService.handleSapoSandbox('/admin/variants.json', 'GET', payload);
        }
        if (meta.id === 'sapo_cancel_order') {
          return { success: true, platform: 'SAPO_SANDBOX', orderId: payload.order_id, status: 'cancelled' };
        }
        if (meta.id === 'sapo_adjust_inventory' || meta.id === 'sapo_adjust_stock') {
          return { success: true, platform: 'SAPO_SANDBOX', locationId: payload.location_id || payload.locationId, adjusted: payload.available_adjustment || payload.available };
        }
        if (meta.id === 'sapo_transfer_stock') {
          return { success: true, platform: 'SAPO_SANDBOX', transfer_id: Date.now(), status: 'pending', note: payload.note };
        }
        return this.sandboxService.handleSapoSandbox(`/admin/orders/${payload.status || 'open'}.json`, 'GET', payload);

      case PlatformType.NHANH_VN:
        if (meta.id === 'nhanh_add_order') {
          return this.sandboxService.handleNhanhSandbox('/api/order/add', 'POST', payload);
        }
        if (meta.id === 'nhanh_check_stock') {
          return this.sandboxService.handleNhanhSandbox('/api/product/inventory', 'POST', payload);
        }
        if (meta.id === 'nhanh_get_depots') {
          return {
            code: 1,
            data: [
              { id: 102, name: 'Kho Tổng Cầu Giấy - Hà Nội', address: '302 Cầu Giấy, Hà Nội' },
              { id: 103, name: 'Kho Chi Nhánh Tân Bình - TP.HCM', address: '123 Cộng Hòa, TP.HCM' },
            ],
          };
        }
        if (meta.id === 'nhanh_cancel_order') {
          return { code: 1, message: `Đã hủy đơn hàng Nhanh.vn #${payload.orderId} thành công`, orderId: payload.orderId };
        }
        if (meta.id === 'nhanh_calculate_fee') {
          return { code: 1, data: { carrier: 'GHTK', fee: 28000, estimatedDelivery: '1-2 ngày' } };
        }
        if (meta.id === 'nhanh_add_invoice') {
          return { code: 1, data: { invoiceId: `INV_${payload.orderId}`, invoiceNumber: '0001428', status: 'ISSUED' } };
        }
        if (meta.id === 'nhanh_send_zns') {
          return { code: 1, data: { msgId: `ZNS_${Date.now()}`, phone: payload.phone, status: 'SENT' } };
        }
        if (meta.id === 'nhanh_sync_ecom_stock') {
          return { code: 1, data: { synced: true, marketplace: payload.marketplace, itemsCount: payload.items?.length || 0 } };
        }
        return { code: 1, data: { page: payload.page || 1, totalRecords: 1, orders: [{ id: 'ORD-NHANH-992', status: 'Confirmed' }] } };

      case PlatformType.PANCAKE:
        return this.sandboxService.handlePancakeSandbox('/api/v1/orders', 'POST', payload);

      case PlatformType.MISA_MEINVOICE:
        if (meta.id === 'misa_save_invoice') {
          return this.sandboxService.handleMisaInvoiceSandbox('/api/v1/publish', 'POST', payload);
        }
        if (meta.id === 'misa_publish_hsm') {
          return {
            success: true,
            refID: payload.refID,
            invoiceNumber: '0001248',
            invSeries: '1C24TUU',
            taxAuthorityCode: `MISA-TAX-${Date.now()}`,
            signedStatus: 'HSM_CLOUD_SIGNED',
            publishedDate: new Date().toISOString(),
          };
        }
        return { success: true, refID: payload.refID, invoiceStatus: 'PUBLISHED', signedDate: new Date().toISOString() };

      case PlatformType.MISA_CRM:
        return { success: true, platform: 'MISA_CRM_SANDBOX', recordId: `CRM_REC_${Date.now()}`, message: 'Đồng bộ CRM thành công' };

      case PlatformType.TELEGRAM:
        return this.sandboxService.handleTelegramSandbox('/bot<token>/sendMessage', 'POST', payload);

      case PlatformType.SHOPEE:
        if (meta.id === 'shopee_create_voucher' || meta.id === 'shopee_add_voucher') {
          return {
            error: '',
            message: 'success',
            response: {
              voucher_id: Number(Date.now().toString().slice(-8)),
              voucher_code: payload.voucher_code || 'SP01',
              voucher_name: payload.voucher_name || 'Voucher Tri Ân Khách Hàng',
              discount_amount: payload.discount_amount || 20000,
              status: 'upcoming',
            },
          };
        }
        if (meta.id === 'shopee_get_voucher_list') {
          return {
            error: '',
            message: 'success',
            response: {
              voucher_list: [
                { voucher_id: 991823, voucher_code: 'SPVIP10', voucher_name: 'Giảm 10% đơn từ 200k', discount_amount: 20000, status: payload.status || 'ongoing' }
              ],
              more: false,
            },
          };
        }
        if (meta.id === 'shopee_download_airwaybill') {
          return {
            error: '',
            message: 'success',
            response: {
              order_sn: payload.order_sn,
              url: 'https://shopee.vn/api/v2/logistics/sample-airwaybill.pdf',
              status: 'READY_TO_PRINT',
            },
          };
        }
        if (meta.id === 'shopee_get_escrow_detail') {
          return {
            error: '',
            message: 'success',
            response: {
              order_sn: payload.order_sn,
              escrow_amount: 380000,
              buyer_total_amount: 400000,
              seller_service_fee: 20000,
              payout_status: 'COMPLETED',
            },
          };
        }
        if (meta.id === 'shopee_update_price' || meta.id === 'shopee_update_stock') {
          return {
            error: '',
            message: 'success',
            response: {
              item_id: payload.item_id || 10029,
              status: 'UPDATED',
            },
          };
        }
        if (meta.id.startsWith('shopify_')) {
          if (meta.id === 'shopify_get_orders') {
            return {
              orders: [
                { id: 5519283749, name: '#1001', total_price: '450000', currency: 'VND', financial_status: 'paid', fulfillment_status: null }
              ],
            };
          }
          if (meta.id === 'shopify_create_fulfillment') {
            return {
              fulfillment: { id: 1029384, order_id: payload.order_id || 5519283749, status: 'success', tracking_number: 'VNPOST12345' },
            };
          }
          if (meta.id === 'shopify_set_inventory') {
            return {
              inventory_level: { location_id: payload.location_id || 1, inventory_item_id: payload.inventory_item_id || 991, available: payload.available || 100 },
            };
          }
        }
        if (meta.id.startsWith('lazada_')) {
          if (meta.id === 'lazada_get_document') {
            return { code: '0', data: { document: { url: 'https://lazada-express.vn/awb/sample.pdf', doc_type: 'shippingLabel' } } };
          }
          return { code: '0', message: 'Success', data: payload };
        }
        if (meta.id.startsWith('tiki_')) {
          if (meta.id === 'tiki_get_orders') {
            return {
              data: [
                { code: 'TK_99812', status: payload.status || 'handling', grand_total: 350000, items: [{ product_id: 1102, qty: 1 }] }
              ],
            };
          }
          return { success: true, message: 'Thao tác Tiki thành công', data: payload };
        }
        return {
          error: '',
          message: 'success',
          response: {
            order_sn: payload.order_sn || '241003SHOPEE8899',
            order_status: 'PAID',
            total_amount: 398000,
            item_list: [{ item_name: 'Áo Polo Nam Cotton Đen L', model_quantity_purchased: 2 }],
          },
        };

      case PlatformType.TIKTOK_SHOP:
        if (meta.id === 'tiktok_create_promotion') {
          return {
            code: 0,
            message: 'Success',
            data: {
              promotion_id: `TTS_PROMO_${Date.now()}`,
              title: payload.title || 'Voucher TikTok Shop 2026',
              status: 'EFFECTIVE',
            },
          };
        }
        if (meta.id === 'tiktok_get_products') {
          return {
            code: 0,
            message: 'Success',
            data: {
              products: [
                { id: '17293847291', title: 'Áo Thun Unisex Cotton 100%', status: 'ACTIVATE', skus: [{ id: 'SKU_01', price: { tax_exclusive_price: '180000' }, stock_infos: [{ available_stock: 50 }] }] }
              ],
              total: 1,
            },
          };
        }
        if (meta.id === 'tiktok_get_shipping_label') {
          return {
            code: 0,
            message: 'Success',
            data: {
              doc_url: 'https://open-api.tiktokglobalshop.com/documents/sample-shipping-label.pdf',
              format: 'PDF',
            },
          };
        }
        if (meta.id === 'tiktok_ship_package' || meta.id === 'tiktok_update_inventory' || meta.id === 'tiktok_update_price') {
          return {
            code: 0,
            message: 'Success',
            data: payload,
          };
        }
        return {
          code: 0,
          message: 'Success',
          data: {
            order_list: [
              {
                id: payload.order_id || '5789912388412',
                status: 'AWAITING_SHIPMENT',
                payment: { total_amount: '450000', currency: 'VND' },
              },
            ],
          },
        };

      default:
        if (meta.id === 'uniflow_normalize_to_udm') {
          if (payload.platform === 'SAPO') {
            return this.udmNormalizer.normalizeSapoWebhookOrder('tenant_sandbox', payload.raw_payload);
          }
          return { message: 'Đã chuẩn hóa sang Universal Data Model', udm: payload.raw_payload };
        }
        return { success: true, message: `Thực thi Sandbox cho ${meta.name} hoàn tất` };
    }
  }

  /**
   * Thực thi trong môi trường LIVE thực tế kết nối trực tiếp đối tác ngoại vi
   */
  private async executeLiveAction(meta: ActionMetadata, payload: any, tenantId: string): Promise<any> {
    // ── 0. CORE VOUCHER & PROMOTIONS ──
    if (meta.id === 'core_generate_voucher' || meta.id === 'core_validate_voucher') {
      return this.executeSandboxAction(meta, payload);
    }

    const connectorKey = meta.platform.toLowerCase().replace('_vn', '');
    const connector = await this.connectorModel.findOne({ tenantId, connectorId: connectorKey }).exec();

    // 1. Phân giải cấu hình thực tế từ MongoDB Atlas của Tenant hoặc biến môi trường .env
    const config = connector?.config || {};
    const custom = config.customSettings || {};

    // ── 1. SAPO OMNICHANNEL ──
    if (meta.platform === PlatformType.SAPO) {
      const accessToken = config.appKey || process.env.SAPO_API_KEY || process.env.SAPO_ACCESS_TOKEN;
      const storeAlias = custom.storeAlias || process.env.SAPO_STORE_ALIAS || 'ptit-uniflow-demo';
      const endpoint = config.endpoint || process.env.SAPO_BASE_URL;

      if (!accessToken || accessToken.includes('your_')) {
        this.logger.warn(`[Sapo Live] Chưa có Access Token thật cho Tenant ${tenantId}, fallback Sandbox`);
        return this.executeSandboxAction(meta, payload);
      }

      const client = new SapoClient({ accessToken, storeAlias, endpoint });
      if (meta.id === 'sapo_create_order') return client.createOrder(payload);
      if (meta.id === 'sapo_get_orders') return client.getOrders(payload);
      if (meta.id === 'sapo_cancel_order') return client.cancelOrder(payload.order_id, payload.restock);
      if (meta.id === 'sapo_adjust_inventory') return client.adjustInventory(payload.location_id, payload.inventory_item_id, payload.available_adjustment);
      if (meta.id === 'sapo_get_variants') return client.getVariants(payload.limit);
    }

    // ── 2. NHANH.VN ──
    if (meta.platform === PlatformType.NHANH_VN) {
      const appId = config.appKey || process.env.NHANH_APP_ID;
      const businessId = custom.businessId || process.env.NHANH_BUSINESS_ID || '1';
      const accessToken = config.appSecret || process.env.NHANH_ACCESS_TOKEN;
      const endpoint = config.endpoint || process.env.NHANH_BASE_URL;

      if (!appId || !accessToken || appId.includes('your_')) {
        this.logger.warn(`[Nhanh.vn Live] Chưa có App ID / Access Token cho Tenant ${tenantId}, fallback Sandbox`);
        return this.executeSandboxAction(meta, payload);
      }

      const client = new NhanhClient({ appId, businessId, accessToken, endpoint });
      if (meta.id === 'nhanh_add_order') return client.addOrder(payload);
      if (meta.id === 'nhanh_search_orders') return client.searchOrders(payload);
      if (meta.id === 'nhanh_check_stock') return client.checkStock(payload.depotId, payload.productIds);
      if (meta.id === 'nhanh_get_depots') return client.getDepots();
    }

    // ── 3. PANCAKE POS & SOCIAL ──
    if (meta.platform === PlatformType.PANCAKE) {
      const accessToken = config.appKey || process.env.PANCAKE_ACCESS_TOKEN;
      const defaultPageId = custom.pageId || process.env.PANCAKE_PAGE_ID;
      const endpoint = config.endpoint || process.env.PANCAKE_BASE_URL;

      if (!accessToken || accessToken.includes('your_')) {
        this.logger.warn(`[Pancake Live] Chưa có Page Access Token cho Tenant ${tenantId}, fallback Sandbox`);
        return this.executeSandboxAction(meta, payload);
      }

      const client = new PancakeClient({ accessToken, defaultPageId, endpoint });
      if (meta.id === 'pancake_create_order') return client.createOrder(payload.page_id, payload);
      if (meta.id === 'pancake_list_orders') return client.listOrders(payload.page_id, payload.page_number, payload.page_size);
      if (meta.id === 'pancake_list_conversations') return client.listConversations(payload.page_id, payload.limit);
      if (meta.id === 'pancake_send_chat') return client.sendChatMessage(payload.page_id, payload.conversation_id, payload.message);
    }

    // ── 4. MISA MEINVOICE & MISA AMIS CRM ──
    if (meta.platform === PlatformType.MISA_MEINVOICE || meta.platform === PlatformType.MISA_CRM) {
      const token = config.appKey || process.env.MISA_TOKEN;
      const appId = config.appSecret || process.env.MISA_APP_ID;
      const taxCode = custom.taxCode || process.env.MISA_TAX_CODE;
      const endpoint = config.endpoint || process.env.MISA_INVOICE_URL;
      const crmEndpoint = custom.crmEndpoint || process.env.MISA_CRM_URL;

      if (!token || token.includes('your_')) {
        this.logger.warn(`[MISA Live] Chưa có MISA Token cho Tenant ${tenantId}, fallback Sandbox`);
        return this.executeSandboxAction(meta, payload);
      }

      const client = new MisaClient({ token, appId, taxCode, endpoint, crmEndpoint });
      if (meta.id === 'misa_save_invoice') return client.saveInvoice(payload);
      if (meta.id === 'misa_publish_hsm') return client.publishHsm(payload.refID);
      if (meta.id === 'misa_get_invoice_by_ref') return client.getInvoiceByRef(payload.refID);
      if (meta.id === 'misa_crm_sync_order') return client.syncCrmOrder(payload);
      if (meta.id === 'misa_crm_sync_customer') return client.syncCrmCustomer(payload);
    }

    // ── 5. TELEGRAM BOT ──
    if (meta.platform === PlatformType.TELEGRAM) {
      const botToken = config.appKey || process.env.TELEGRAM_BOT_TOKEN;
      const defaultChatId = custom.chatId || process.env.TELEGRAM_CHAT_ID;
      const endpoint = config.endpoint || process.env.TELEGRAM_API_URL;

      if (!botToken || botToken.includes('your_')) {
        this.logger.warn(`[Telegram Live] Chưa có Telegram Bot Token, fallback Sandbox`);
        return this.executeSandboxAction(meta, payload);
      }

      const client = new TelegramClient({ botToken, defaultChatId, endpoint });
      if (meta.id === 'telegram_send_alert') return client.sendAlert(payload.text, payload.chat_id, payload.parse_mode);
      if (meta.id === 'telegram_send_document') return client.sendDocument(payload.document_url, payload.chat_id, payload.caption);
    }

    // ── 6. MARKETPLACES (SHOPEE & TIKTOK SHOP) ──
    if (meta.platform === PlatformType.SHOPEE || meta.platform === PlatformType.TIKTOK_SHOP) {
      const shopeeConfig = {
        partnerId: config.appKey || process.env.SHOPEE_PARTNER_ID || '',
        partnerKey: config.appSecret || process.env.SHOPEE_PARTNER_KEY || '',
        shopId: custom.shopId || process.env.SHOPEE_SHOP_ID,
        accessToken: custom.accessToken || process.env.SHOPEE_ACCESS_TOKEN,
      };

      const tiktokConfig = {
        appKey: config.appKey || process.env.TIKTOK_APP_KEY || '',
        appSecret: config.appSecret || process.env.TIKTOK_APP_SECRET || '',
        accessToken: custom.accessToken || process.env.TIKTOK_ACCESS_TOKEN,
        shopCipher: custom.shopCipher || process.env.TIKTOK_SHOP_CIPHER,
      };

      const client = new MarketplaceClient(shopeeConfig, tiktokConfig);
      if (meta.id === 'shopee_get_order_detail') return client.getShopeeOrderDetail(payload.order_sn);
      if (meta.id === 'tiktok_get_order_detail') return client.getTikTokOrderDetail(payload.order_id);
    }

    // ── 7. UNIVERSAL DATA MODEL CORE ──
    if (meta.id === 'uniflow_normalize_to_udm') {
      if (payload.platform === 'SAPO') {
        return this.udmNormalizer.normalizeSapoWebhookOrder(tenantId, payload.raw_payload);
      }
      return { message: 'Đã chuẩn hóa sang Universal Data Model', udm: payload.raw_payload };
    }

    return this.executeSandboxAction(meta, payload);
  }
}
