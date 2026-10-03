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

export interface ActionMetadata {
  id: string;
  name: string;
  platform: PlatformType;
  category: 'ORDER' | 'INVENTORY' | 'INVOICE' | 'CRM' | 'NOTIFY' | 'MARKETPLACE' | 'CORE';
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
    const actionMeta = this.getActionInfo(actionId);

    if (!actionMeta) {
      throw new NotFoundException(`Hành động #${actionId} không tồn tại trong danh mục điều khiển UniFlow`);
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

    // 1. Ghi log kiểm toán vào MongoDB
    await this.logModel.create({
      tenantId: new Types.ObjectId(tenantId),
      traceId,
      platform: actionMeta.platform,
      orderId: payload?.order_sn || payload?.order_id || payload?.orderId || payload?.refID || `CMD-${Date.now()}`,
      status: isSuccess ? WebhookProcessingStatus.COMPLETED : WebhookProcessingStatus.FAILED,
      durationMs,
      payload: { action: actionId, mode, input: payload, output: result },
      error: errorMessage,
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
        if (meta.id === 'sapo_create_order') {
          return this.sandboxService.handleSapoSandbox('/admin/orders.json', 'POST', payload);
        }
        if (meta.id === 'sapo_get_variants') {
          return this.sandboxService.handleSapoSandbox('/admin/variants.json', 'GET', payload);
        }
        if (meta.id === 'sapo_cancel_order') {
          return { success: true, platform: 'SAPO_SANDBOX', orderId: payload.order_id, status: 'cancelled' };
        }
        if (meta.id === 'sapo_adjust_inventory') {
          return { success: true, platform: 'SAPO_SANDBOX', locationId: payload.location_id, adjusted: payload.available_adjustment };
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
   * Thực thi trong môi trường LIVE thực tế
   */
  private async executeLiveAction(meta: ActionMetadata, payload: any, tenantId: string): Promise<any> {
    const connectorKey = meta.platform.toLowerCase().replace('_vn', '');
    const connector = await this.connectorModel.findOne({ tenantId, connectorId: connectorKey }).exec();

    // Nếu connector chưa cấu hình credential thật, cảnh báo và dùng endpoint probe hoặc sandbox
    const apiKey = connector?.config?.appKey;
    const baseUrl = connector?.config?.endpoint;

    if (!baseUrl && !apiKey) {
      this.logger.warn(`Kênh ${meta.platform} chưa có API Key thực tế cho Tenant ${tenantId}, fallback Sandbox`);
      return this.executeSandboxAction(meta, payload);
    }

    // Thực hiện gọi HTTP Outbound thực tế tới đối tác
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}/api/v1/execute`,
      data: payload,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'UniFlow-Omnichannel-Hub/2.5',
      },
      timeout: 10000,
    });

    return response.data;
  }
}
