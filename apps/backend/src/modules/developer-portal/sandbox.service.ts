import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SandboxService {
  private readonly logger = new Logger(SandboxService.name);
  private specsCache: Map<string, any> = new Map();

  constructor() {
    this.loadSpecs();
  }

  private loadSpecs() {
    const schemasDir = path.resolve(process.cwd(), '../../packages/connectors-spec/schemas');
    const fallbackDir = path.resolve(__dirname, '../../../../../packages/connectors-spec/schemas');
    const targetDir = fs.existsSync(schemasDir) ? schemasDir : fallbackDir;

    if (fs.existsSync(targetDir)) {
      const files = fs.readdirSync(targetDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const content = fs.readFileSync(path.join(targetDir, file), 'utf-8');
            const parsed = JSON.parse(content);
            const specKey = file.replace('.json', '');
            this.specsCache.set(specKey, parsed);
          } catch (err: any) {
            this.logger.error(`Error loading spec ${file}: ${err.message}`);
          }
        }
      }
      this.logger.log(`Loaded ${this.specsCache.size} standardized connector specs into Sandbox Environment.`);
    }
  }

  public getSpec(specName: string): any {
    return this.specsCache.get(specName) || null;
  }

  public getAllSpecsSummary(): { id: string; name: string; url: string }[] {
    return [
      { id: 'sapo_spec', name: 'Sapo Omnichannel POS & Retail', url: '/api-docs/specs/sapo_spec.json' },
      { id: 'nhanh_vn_spec', name: 'Nhanh.vn Open API v3', url: '/api-docs/specs/nhanh_vn_spec.json' },
      { id: 'pancake_spec', name: 'Pancake POS & Social Chat', url: '/api-docs/specs/pancake_spec.json' },
      { id: 'misa_meinvoice_spec', name: 'MISA meInvoice e-Invoice', url: '/api-docs/specs/misa_meinvoice_spec.json' },
      { id: 'misa_amis_crm_spec', name: 'MISA AMIS CRM', url: '/api-docs/specs/misa_amis_crm_spec.json' },
      { id: 'telegram_spec', name: 'Telegram Bot API', url: '/api-docs/specs/telegram_spec.json' },
      { id: 'shopee_spec', name: 'Shopee Open Platform', url: '/api-docs/specs/shopee_spec.json' },
      { id: 'tiktok_shop_spec', name: 'TikTok Shop Open API', url: '/api-docs/specs/tiktok_shop_spec.json' },
    ];
  }

  public handleSapoSandbox(endpoint: string, method: string, body: any): any {
    this.logger.log(`[Sapo Sandbox] ${method} ${endpoint}`);
    if (endpoint.includes('orders.json') && method === 'POST') {
      const orderData = body?.order || {};
      return {
        order: {
          id: Math.floor(100000000 + Math.random() * 900000000),
          order_number: `#${Math.floor(1000 + Math.random() * 9000)}`,
          reference_number: orderData.reference_number || `ORD-SANDBOX-${Date.now()}`,
          financial_status: orderData.financial_status || 'paid',
          fulfillment_status: orderData.fulfillment_status || 'unfulfilled',
          currency: 'VND',
          total_price: orderData.line_items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 398000,
          created_on: new Date().toISOString(),
          customer: orderData.customer || {
            first_name: orderData.shipping_address?.first_name || 'Khách hàng',
            phone: orderData.shipping_address?.phone || '0987654321',
          },
          shipping_address: orderData.shipping_address,
          line_items: orderData.line_items || [],
        },
      };
    }
    if (endpoint.includes('variants.json')) {
      return {
        variants: [
          { id: 4264112, sku: 'AO-POLO-NAM-DEN-L', title: 'Đen / L', price: 199000, inventory_quantity: 48 },
          { id: 4264113, sku: 'AO-POLO-NAM-TRANG-M', title: 'Trắng / M', price: 199000, inventory_quantity: 25 },
        ],
      };
    }
    return { status: 'success', platform: 'SAPO_SANDBOX', endpoint, timestamp: new Date().toISOString() };
  }

  public handleNhanhSandbox(endpoint: string, _method: string, body: any): any {
    this.logger.log(`[Nhanh.vn Sandbox] ${endpoint}`);
    if (endpoint.includes('/order/add')) {
      return {
        code: 1,
        messages: ['Thêm đơn hàng thành công'],
        data: {
          orderId: Math.floor(10000000 + Math.random() * 90000000),
          partnerOrderId: body?.data?.id || `ORD-SANDBOX-${Date.now()}`,
        },
      };
    }
    if (endpoint.includes('/product/inventory')) {
      return {
        code: 1,
        data: {
          totalRecords: 1,
          products: {
            'AO-POLO-NAM-DEN-L': { depotId: body?.data?.depotId || 102, available: 48, remain: 50, shipping: 2 },
          },
        },
      };
    }
    return { code: 1, messages: ['Thành công'], data: body };
  }

  public handlePancakeSandbox(endpoint: string, _method: string, body: any): any {
    this.logger.log(`[Pancake Sandbox] ${endpoint}`);
    if (endpoint.includes('/orders')) {
      return {
        success: true,
        order: {
          id: `PAN-${Math.floor(100000 + Math.random() * 900000)}`,
          partner_id: body?.order?.partner_id || `ORD-SANDBOX-${Date.now()}`,
          bill_full_name: body?.order?.bill_full_name || 'Khách Mua Hàng',
          bill_phone_number: body?.order?.bill_phone_number || '0987654321',
          status: '1',
          total_price: body?.order?.items?.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0) || 500000,
        },
      };
    }
    return { success: true, endpoint, timestamp: new Date().toISOString() };
  }

  public handleMisaInvoiceSandbox(endpoint: string, _method: string, body: any): any {
    this.logger.log(`[MISA meInvoice Sandbox] ${endpoint}`);
    if (endpoint.includes('Account/Login')) {
      return {
        success: true,
        data: {
          token: 'sandbox_misa_jwt_token_sample_' + Date.now(),
          token_type: 'Bearer',
          expires_in: 86400,
        },
      };
    }
    if (endpoint.includes('Invoice/Save')) {
      return {
        success: true,
        errorCode: null,
        data: {
          transactionID: `TRX-MISA-${Date.now()}`,
          refID: body?.refID || 'ORD-SANDBOX-001',
          invSeries: body?.invSeries || '1C24TUU',
          status: 'Draft',
        },
      };
    }
    if (endpoint.includes('Invoice/PublishHSM')) {
      return {
        success: true,
        errorCode: null,
        data: {
          transactionID: `TRX-MISA-${Date.now()}`,
          invNo: `0000${Math.floor(1000 + Math.random() * 9000)}`,
          invSeries: body?.invSeries || '1C24TUU',
          publishedDate: new Date().toISOString(),
        },
      };
    }
    return { success: true, endpoint, data: body };
  }

  public handleMisaCrmSandbox(endpoint: string, _method: string, body: any): any {
    this.logger.log(`[MISA CRM Sandbox] ${endpoint}`);
    if (endpoint.includes('connect')) {
      return {
        success: true,
        code: 200,
        data: 'misa_crm_sandbox_token_' + Date.now(),
      };
    }
    if (endpoint.includes('save')) {
      return {
        success: true,
        code: 200,
        message: 'Đồng bộ đơn sang CRM thành công',
        data: {
          voucher_id: `CRM-VOUCHER-${Date.now()}`,
          order_no: body?.order_no || 'ORD-SANDBOX-001',
        },
      };
    }
    return { success: true, code: 200, data: body };
  }

  public handleTelegramSandbox(_endpoint: string, _method: string, body: any): any {
    return {
      ok: true,
      result: {
        message_id: Math.floor(10000 + Math.random() * 90000),
        chat: { id: body?.chat_id || '-100123456789' },
        date: Math.floor(Date.now() / 1000),
        text: body?.text || 'Test message received in Sandbox',
      },
    };
  }
}
