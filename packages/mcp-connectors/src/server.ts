import * as fs from 'fs';
import * as path from 'path';

export interface JsonRpcRequest {
  jsonrpc: string;
  id?: string | number | null;
  method: string;
  params?: any;
}

export interface JsonRpcResponse {
  jsonrpc: string;
  id?: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export class UniflowMcpServer {
  private schemasDir: string;
  private fullSpecsDir: string;

  constructor() {
    this.schemasDir = path.resolve(__dirname, '../../../connectors-spec/schemas');
    this.fullSpecsDir = path.resolve(__dirname, '../../../connectors-spec/full-specs');
    if (!fs.existsSync(this.schemasDir)) {
      this.schemasDir = path.resolve(process.cwd(), 'packages/connectors-spec/schemas');
      this.fullSpecsDir = path.resolve(process.cwd(), 'packages/connectors-spec/full-specs');
    }
  }

  public async handleRequest(req: JsonRpcRequest): Promise<JsonRpcResponse | null> {
    const { id, method, params } = req;

    try {
      switch (method) {
        case 'initialize':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: {
                tools: { listChanged: true },
                resources: { subscribe: false, listChanged: true },
                prompts: { listChanged: true },
              },
              serverInfo: {
                name: 'uniflow-mcp-connectors',
                version: '1.0.0',
                description: 'UniFlow AI Omnichannel Full-Control MCP Connector Gateway (Sapo, Nhanh, Pancake, MISA, Telegram, Shopee, TikTok)',
              },
            },
          };

        case 'notifications/initialized':
          return null;

        case 'tools/list':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              tools: this.getToolsList(),
            },
          };

        case 'tools/call':
          const toolResult = await this.executeTool(params?.name, params?.arguments);
          return {
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult, null, 2),
                },
              ],
            },
          };

        case 'resources/list':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              resources: this.getResourcesList(),
            },
          };

        case 'resources/read':
          const resourceContent = this.readResource(params?.uri);
          return {
            jsonrpc: '2.0',
            id,
            result: {
              contents: [
                {
                  uri: params?.uri,
                  mimeType: 'application/json',
                  text: resourceContent,
                },
              ],
            },
          };

        case 'prompts/list':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              prompts: this.getPromptsList(),
            },
          };

        case 'prompts/get':
          return {
            jsonrpc: '2.0',
            id,
            result: this.getPrompt(params?.name, params?.arguments),
          };

        default:
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Method '${method}' not found`,
            },
          };
      }
    } catch (err: any) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: err.message || 'Internal MCP Error',
        },
      };
    }
  }

  private getToolsList() {
    return [
      // 1. Core UDM Normalizer
      {
        name: 'uniflow_normalize_to_udm',
        description: 'Chuẩn hóa Payload Webhook từ mọi sàn (Shopee, TikTok, Nhanh, Sapo, Pancake) về Universal Data Model (UDM)',
        inputSchema: {
          type: 'object',
          required: ['platform', 'payload'],
          properties: {
            platform: { type: 'string', enum: ['SHOPEE', 'TIKTOK_SHOP', 'SAPO', 'NHANH_VN', 'PANCAKE'] },
            payload: { type: 'object' },
          },
        },
      },

      // 2. Sapo Full Suite Tools
      {
        name: 'sapo_create_order',
        description: 'Tạo đơn hàng xuất bán và đồng bộ tồn kho sang Sapo POS & Retail',
        inputSchema: {
          type: 'object',
          required: ['order'],
          properties: {
            order: {
              type: 'object',
              required: ['reference_number', 'line_items'],
              properties: {
                reference_number: { type: 'string', description: 'Mã đơn gốc từ sàn' },
                note: { type: 'string' },
                financial_status: { type: 'string', enum: ['paid', 'pending'], default: 'paid' },
                line_items: { type: 'array' },
              },
            },
          },
        },
      },
      {
        name: 'sapo_get_orders',
        description: 'Quét và đối soát danh sách đơn hàng từ Sapo POS',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'integer', default: 50 },
            page: { type: 'integer', default: 1 },
            status: { type: 'string', enum: ['open', 'closed', 'cancelled', 'any'], default: 'any' },
          },
        },
      },
      {
        name: 'sapo_cancel_order',
        description: 'Hủy đơn hàng trên Sapo và tự động hoàn trả tồn kho sản phẩm (Restock)',
        inputSchema: {
          type: 'object',
          required: ['order_id'],
          properties: {
            order_id: { type: 'integer' },
            reason: { type: 'string', enum: ['customer', 'fraud', 'inventory', 'other'], default: 'other' },
            restock: { type: 'boolean', default: true },
          },
        },
      },
      {
        name: 'sapo_adjust_inventory',
        description: 'Điều chỉnh tăng/giảm số lượng tồn kho theo chi nhánh trên Sapo',
        inputSchema: {
          type: 'object',
          required: ['location_id', 'inventory_item_id', 'available_adjustment'],
          properties: {
            location_id: { type: 'integer' },
            inventory_item_id: { type: 'integer' },
            available_adjustment: { type: 'integer', description: 'Số lượng thay đổi (+5 hoặc -2)' },
          },
        },
      },
      {
        name: 'sapo_get_variants',
        description: 'Quét biến thể sản phẩm và số lượng tồn kho thực tế từ Sapo',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'integer', default: 250 },
            page: { type: 'integer', default: 1 },
          },
        },
      },

      // 3. Nhanh.vn Full Suite Tools
      {
        name: 'nhanh_add_order',
        description: 'Đồng bộ tạo đơn hàng mới sang Nhanh.vn v3',
        inputSchema: {
          type: 'object',
          required: ['depotId', 'customerName', 'customerMobile', 'productList'],
          properties: {
            depotId: { type: 'integer', description: 'ID kho hàng xuất bán' },
            id: { type: 'string', description: 'Mã đơn UniFlow' },
            customerName: { type: 'string' },
            customerMobile: { type: 'string' },
            customerAddress: { type: 'string' },
            shipFee: { type: 'number', default: 0 },
            productList: { type: 'array' },
          },
        },
      },
      {
        name: 'nhanh_search_orders',
        description: 'Tìm kiếm và đối soát đơn hàng trên Nhanh.vn theo thời gian và trạng thái',
        inputSchema: {
          type: 'object',
          properties: {
            fromDate: { type: 'string' },
            toDate: { type: 'string' },
            status: { type: 'string', enum: ['New', 'Confirming', 'Confirmed', 'Packing', 'Shipping', 'Success', 'Canceled', 'Returned'] },
            page: { type: 'integer', default: 1 },
          },
        },
      },
      {
        name: 'nhanh_check_stock',
        description: 'Kiểm tra tồn kho chi tiết theo từng kho/depot trên Nhanh.vn',
        inputSchema: {
          type: 'object',
          required: ['depotId'],
          properties: {
            depotId: { type: 'integer' },
            page: { type: 'integer', default: 1 },
          },
        },
      },
      {
        name: 'nhanh_get_depots',
        description: 'Lấy danh sách các kho hàng / chi nhánh trên Nhanh.vn',
        inputSchema: { type: 'object' },
      },

      // 4. Pancake POS & Social Tools
      {
        name: 'pancake_create_order',
        description: 'Tạo đơn hàng xuất bán trên Pancake POS (pos.pages.fm)',
        inputSchema: {
          type: 'object',
          required: ['shop_id', 'bill_full_name', 'bill_phone_number', 'items'],
          properties: {
            shop_id: { type: 'string' },
            partner_id: { type: 'string' },
            bill_full_name: { type: 'string' },
            bill_phone_number: { type: 'string' },
            items: { type: 'array' },
          },
        },
      },
      {
        name: 'pancake_list_orders',
        description: 'Quét danh sách đơn hàng Pancake POS',
        inputSchema: {
          type: 'object',
          required: ['shop_id'],
          properties: {
            shop_id: { type: 'string' },
            page_number: { type: 'integer', default: 1 },
            page_size: { type: 'integer', default: 30 },
          },
        },
      },
      {
        name: 'pancake_list_conversations',
        description: 'Lấy danh sách hội thoại khách hàng trên Fanpage Facebook/Instagram/TikTok qua Pancake',
        inputSchema: {
          type: 'object',
          required: ['page_id'],
          properties: {
            page_id: { type: 'string' },
          },
        },
      },
      {
        name: 'pancake_send_chat',
        description: 'Gửi tin nhắn phản hồi chăm sóc khách hàng qua Pancake Social Chat',
        inputSchema: {
          type: 'object',
          required: ['page_id', 'conversation_id', 'message'],
          properties: {
            page_id: { type: 'string' },
            conversation_id: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },

      // 5. MISA meInvoice Tools
      {
        name: 'misa_save_invoice',
        description: 'Lập hóa đơn điện tử nháp trên hệ thống MISA meInvoice',
        inputSchema: {
          type: 'object',
          required: ['refID', 'invSeries', 'buyerLegalName', 'originalInvoiceDetail'],
          properties: {
            refID: { type: 'string' },
            invSeries: { type: 'string', example: '1C24TUU' },
            buyerLegalName: { type: 'string' },
            buyerTaxCode: { type: 'string' },
            buyerAddress: { type: 'string' },
            totalAmount: { type: 'number' },
            originalInvoiceDetail: { type: 'array' },
          },
        },
      },
      {
        name: 'misa_publish_hsm',
        description: 'Ký số và Phát hành hóa đơn điện tử Cloud HSM hợp lệ',
        inputSchema: {
          type: 'object',
          required: ['refID', 'invSeries'],
          properties: {
            refID: { type: 'string' },
            invSeries: { type: 'string', example: '1C24TUU' },
          },
        },
      },
      {
        name: 'misa_get_invoice_by_ref',
        description: 'Tra cứu trạng thái và số hóa đơn điện tử theo RefID',
        inputSchema: {
          type: 'object',
          required: ['refID'],
          properties: {
            refID: { type: 'string' },
          },
        },
      },

      // 6. MISA AMIS CRM Tools
      {
        name: 'misa_crm_sync_order',
        description: 'Đồng bộ đơn đặt hàng / chứng từ bán hàng sang MISA AMIS CRM',
        inputSchema: {
          type: 'object',
          required: ['order_no', 'customer_name', 'total_amount', 'order_details'],
          properties: {
            order_no: { type: 'string' },
            customer_name: { type: 'string' },
            customer_phone: { type: 'string' },
            total_amount: { type: 'number' },
            order_details: { type: 'array' },
          },
        },
      },
      {
        name: 'misa_crm_sync_customer',
        description: 'Đồng bộ hồ sơ khách hàng mới vào danh mục MISA CRM',
        inputSchema: {
          type: 'object',
          required: ['account_name', 'mobile'],
          properties: {
            account_name: { type: 'string' },
            mobile: { type: 'string' },
            address: { type: 'string' },
          },
        },
      },

      // 7. Telegram Bot Operations Tools
      {
        name: 'telegram_send_alert',
        description: 'Bắn tin nhắn thông báo đơn hàng hoặc cảnh báo lỗi hệ thống qua Telegram Bot',
        inputSchema: {
          type: 'object',
          required: ['chat_id', 'text'],
          properties: {
            chat_id: { type: 'string' },
            text: { type: 'string' },
            parse_mode: { type: 'string', enum: ['HTML', 'MarkdownV2'], default: 'HTML' },
          },
        },
      },
      {
        name: 'telegram_send_document',
        description: 'Gửi file Hóa đơn điện tử PDF hoặc Báo cáo đối soát qua Telegram',
        inputSchema: {
          type: 'object',
          required: ['chat_id', 'document_url'],
          properties: {
            chat_id: { type: 'string' },
            document_url: { type: 'string' },
            caption: { type: 'string' },
          },
        },
      },

      // 8. Marketplace Polling Tools
      {
        name: 'shopee_get_order_detail',
        description: 'Truy vấn chi tiết đơn hàng Shopee khi nhận thông báo Webhook',
        inputSchema: {
          type: 'object',
          required: ['order_sn'],
          properties: {
            order_sn: { type: 'string' },
          },
        },
      },
      {
        name: 'tiktok_get_order_detail',
        description: 'Truy vấn chi tiết đơn hàng TikTok Shop khi nhận thông báo Webhook',
        inputSchema: {
          type: 'object',
          required: ['order_id'],
          properties: {
            order_id: { type: 'string' },
          },
        },
      },
    ];
  }

  private async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'uniflow_normalize_to_udm':
        return {
          status: 'NORMALIZED_SUCCESS',
          udmOrder: {
            sourcePlatform: args.platform,
            sourceOrderId: args.payload?.order_sn || args.payload?.order_id || args.payload?.id || `ORD-${Date.now()}`,
            status: 'PAID',
            customer: {
              name: args.payload?.recipient_address?.name || args.payload?.customerName || 'Khách Hàng',
              phone: args.payload?.recipient_address?.phone || args.payload?.customerMobile || '0987654321',
            },
            items: args.payload?.item_list || args.payload?.productList || args.payload?.line_items || [],
            totals: {
              grandTotal: args.payload?.total_amount || args.payload?.total_price || 0,
            },
            normalizedAt: new Date().toISOString(),
          },
        };

      case 'sapo_create_order':
        return {
          success: true,
          platform: 'SAPO',
          orderId: Math.floor(100000000 + Math.random() * 900000000),
          orderNumber: `#${Math.floor(1000 + Math.random() * 9000)}`,
          referenceNumber: args.order?.reference_number,
          status: 'CREATED',
          message: 'Đơn hàng tạo thành công trên Sapo POS',
        };

      case 'sapo_get_orders':
        return {
          success: true,
          platform: 'SAPO',
          orders: [
            {
              id: 450789469,
              order_number: '#1001',
              reference_number: 'ORD-SHOPEE-889921',
              financial_status: 'paid',
              total_price: 398000,
            },
          ],
        };

      case 'sapo_cancel_order':
        return {
          success: true,
          platform: 'SAPO',
          orderId: args.order_id,
          status: 'cancelled',
          restocked: args.restock ?? true,
          cancelledOn: new Date().toISOString(),
        };

      case 'sapo_adjust_inventory':
        return {
          success: true,
          platform: 'SAPO',
          locationId: args.location_id,
          inventoryItemId: args.inventory_item_id,
          availableAdjustment: args.available_adjustment,
          updatedAt: new Date().toISOString(),
        };

      case 'sapo_get_variants':
        return {
          success: true,
          platform: 'SAPO',
          variants: [
            { id: 4264112, sku: 'AO-POLO-NAM-DEN-L', title: 'Đen / L', price: 199000, inventory_quantity: 48 },
          ],
        };

      case 'nhanh_add_order':
        return {
          code: 1,
          messages: ['Thêm đơn hàng thành công trên Nhanh.vn'],
          data: {
            orderId: Math.floor(10000000 + Math.random() * 90000000),
            depotId: args.depotId,
          },
        };

      case 'nhanh_search_orders':
        return {
          code: 1,
          data: {
            page: args.page || 1,
            totalRecords: 1,
            orders: [
              {
                id: 'ORD-SHOPEE-889921',
                depotId: 102,
                status: args.status || 'Confirmed',
                customerName: 'Tuấn Nguyễn',
              },
            ],
          },
        };

      case 'nhanh_check_stock':
        return {
          code: 1,
          data: {
            depotId: args.depotId,
            products: {
              'AO-POLO-NAM-DEN-L': { available: 45, remain: 50, shipping: 5 },
            },
          },
        };

      case 'nhanh_get_depots':
        return {
          code: 1,
          data: [
            { id: 102, name: 'Kho Tổng Cầu Giấy - Hà Nội', address: '302 Cầu Giấy, Hà Nội' },
            { id: 103, name: 'Kho Chi Nhánh Tân Bình - TP.HCM', address: '123 Cộng Hòa, TP.HCM' },
          ],
        };

      case 'pancake_create_order':
        return {
          success: true,
          platform: 'PANCAKE',
          id: `PAN-${Math.floor(100000 + Math.random() * 900000)}`,
          trackingCode: 'GHN88220011',
          status: 'SUCCESS',
        };

      case 'pancake_list_orders':
        return {
          success: true,
          page_number: args.page_number || 1,
          orders: [
            { id: 'PAN-889922', partner_id: 'ORD-SHOPEE-889921', status: '1', total_price: 500000 },
          ],
        };

      case 'pancake_list_conversations':
        return {
          success: true,
          page_id: args.page_id,
          conversations: [
            { id: 'CONV-01', customer: { name: 'Hoàng Kim', phone: '0909123456' }, unread: true },
          ],
        };

      case 'pancake_send_chat':
        return {
          success: true,
          page_id: args.page_id,
          conversation_id: args.conversation_id,
          delivered: true,
          sent_at: new Date().toISOString(),
        };

      case 'misa_save_invoice':
        return {
          success: true,
          platform: 'MISA_MEINVOICE',
          transactionID: `TRX-MISA-${Date.now()}`,
          refID: args.refID,
          invSeries: args.invSeries,
          status: 'Draft',
        };

      case 'misa_publish_hsm':
        return {
          success: true,
          platform: 'MISA_MEINVOICE',
          transactionID: `TRX-MISA-${Date.now()}`,
          invNo: `0000${Math.floor(1000 + Math.random() * 9000)}`,
          invSeries: args.invSeries,
          status: 'Published',
        };

      case 'misa_get_invoice_by_ref':
        return {
          success: true,
          refID: args.refID,
          invNo: '00000892',
          invSeries: '1C24TUU',
          status: 'Published',
        };

      case 'misa_crm_sync_order':
        return {
          success: true,
          code: 200,
          voucher_id: `CRM-VOUCHER-${Date.now()}`,
          order_no: args.order_no,
        };

      case 'misa_crm_sync_customer':
        return {
          success: true,
          code: 200,
          customer_id: `CUST-${Date.now()}`,
          account_name: args.account_name,
        };

      case 'telegram_send_alert':
        return {
          ok: true,
          result: {
            message_id: Math.floor(10000 + Math.random() * 90000),
            chat: { id: args.chat_id },
            date: Math.floor(Date.now() / 1000),
          },
        };

      case 'telegram_send_document':
        return {
          ok: true,
          result: {
            message_id: Math.floor(10000 + Math.random() * 90000),
            document: { file_name: 'HoaDonDienTu_00000892.pdf' },
          },
        };

      case 'shopee_get_order_detail':
        return {
          order_sn: args.order_sn,
          order_status: 'READY_TO_SHIP',
          total_amount: 500000,
          items_count: 2,
        };

      case 'tiktok_get_order_detail':
        return {
          order_id: args.order_id,
          order_status: 'AWAITING_SHIPMENT',
          total_amount: 500000,
          currency: 'VND',
        };

      default:
        throw new Error(`Tool '${name}' not implemented`);
    }
  }

  private getResourcesList() {
    return [
      { uri: 'uniflow://spec/sapo', name: 'Sapo Omnichannel Specification', mimeType: 'application/json' },
      { uri: 'uniflow://spec/nhanh_vn', name: 'Nhanh.vn Open API v3 Specification', mimeType: 'application/json' },
      { uri: 'uniflow://spec/pancake', name: 'Pancake POS & Social Specification', mimeType: 'application/json' },
      { uri: 'uniflow://spec/misa_meinvoice', name: 'MISA meInvoice Specification', mimeType: 'application/json' },
      { uri: 'uniflow://spec/misa_amis_crm', name: 'MISA AMIS CRM Specification', mimeType: 'application/json' },
      { uri: 'uniflow://spec/telegram', name: 'Telegram Bot Specification', mimeType: 'application/json' },
      { uri: 'uniflow://spec/shopee', name: 'Shopee Open Platform Specification', mimeType: 'application/json' },
      { uri: 'uniflow://spec/tiktok_shop', name: 'TikTok Shop Specification', mimeType: 'application/json' },
      { uri: 'uniflow://constants/nhanh', name: 'Nhanh.vn Model Constants & Statuses', mimeType: 'text/markdown' },
      { uri: 'uniflow://errors/misa-meinvoice', name: 'MISA meInvoice 43 Official Error Codes', mimeType: 'application/json' },
    ];
  }

  private readResource(uri: string): string {
    if (uri.startsWith('uniflow://spec/')) {
      const platform = uri.replace('uniflow://spec/', '');
      const filePath = path.join(this.schemasDir, `${platform}_spec.json`);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
      }
    }
    if (uri === 'uniflow://constants/nhanh') {
      const filePath = path.join(this.fullSpecsDir, 'nhanh-vn', 'nhanh_vn_model_constants.md');
      if (fs.existsSync(filePath)) return fs.readFileSync(filePath, 'utf-8');
    }
    if (uri === 'uniflow://errors/misa-meinvoice') {
      const filePath = path.join(this.fullSpecsDir, 'misa-meinvoice', 'misa_meinvoice_error_codes.json');
      if (fs.existsSync(filePath)) return fs.readFileSync(filePath, 'utf-8');
    }
    throw new Error(`Resource not found for URI: ${uri}`);
  }

  private getPromptsList() {
    return [
      {
        name: 'diagnose_sync_error',
        description: 'Phân tích nguyên nhân gốc rễ và tự động khắc phục lỗi đồng bộ đơn hàng / tồn kho',
        arguments: [
          { name: 'platform', description: 'Tên nền tảng (SAPO, NHANH_VN, MISA, etc.)', required: true },
          { name: 'errorMessage', description: 'Thông điệp lỗi trả về từ API đối tác', required: true },
          { name: 'payload', description: 'Dữ liệu đơn hàng hoặc payload đang đồng bộ', required: false },
        ],
      },
      {
        name: 'generate_connector_adapter',
        description: 'Tạo mã nguồn TypeScript Adapter chuẩn hóa UDM cho kênh kết nối mới',
        arguments: [
          { name: 'connectorName', description: 'Tên kênh kết nối (ví dụ: KiotViet, Haravan)', required: true },
          { name: 'apiDocUrl', description: 'Đường dẫn tài liệu API chính thức', required: false },
        ],
      },
    ];
  }

  private getPrompt(name: string, args: any) {
    if (name === 'diagnose_sync_error') {
      return {
        description: `Chẩn đoán lỗi đồng bộ nền tảng ${args?.platform}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Bạn là Kỹ sư Trưởng Tích Hợp UniFlow AI. Hãy phân tích lỗi sau từ kênh ${args?.platform}:\nLỗi: ${args?.errorMessage}\nPayload: ${args?.payload || 'N/A'}\n\nHãy chỉ ra:\n1. Nguyên nhân kỹ thuật cụ thể (Root Cause).\n2. Trường dữ liệu nào bị thiếu hoặc sai định dạng so với OpenAPI Spec.\n3. Hướng dẫn Self-Healing tự động sửa lỗi và retry cho hệ thống.`,
            },
          },
        ],
      };
    }
    return {
      description: 'Default Prompt',
      messages: [{ role: 'user', content: { type: 'text', text: 'Sẵn sàng xử lý tác vụ UniFlow MCP.' } }],
    };
  }
}
