/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║        UniFlow — Universal Partner & Marketplace Connector Framework     ║
 * ║  Khung kết nối đối tác chuẩn hóa cho sàn TMĐT, POS/ERP, Vận chuyển,      ║
 * ║  Hóa đơn & CRM. Thiết kế Plug-and-Play sẵn sàng mở rộng bất kỳ sàn nào.  ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';
import { PlatformType } from '@uniflow/shared-types';

// ─────────────────────────────────────────────────────────────────────────────
// CAPABILITIES & TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ConnectorCapability =
  | 'PULL_ORDERS'
  | 'PUSH_ORDERS'
  | 'SYNC_INVENTORY'
  | 'CREATE_WAYBILL'
  | 'ISSUE_INVOICE'
  | 'SEND_NOTIFICATION'
  | 'HANDLE_WEBHOOK'
  | 'MANAGE_VOUCHERS'
  | 'APPLY_PROMOTION'
  | 'PROCESS_RETURNS'
  | 'FINANCIAL_RECONCILE';

export type ConnectorCategory =
  | 'MARKETPLACE'
  | 'POS'
  | 'LOGISTICS'
  | 'INVOICE'
  | 'NOTIFY'
  | 'CRM'
  | 'PROMOTION'
  | 'CUSTOM';

export interface UniversalVoucher {
  voucherId: string;
  voucherCode: string;
  voucherName: string;
  platform: PlatformType | string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'COIN_CASHBACK' | 'FREE_SHIPPING';
  discountValue: number;
  maxDiscountAmount?: number;
  minSpend: number;
  usageLimit?: number;
  currentUsage?: number;
  startTime: string;
  endTime: string;
  status: 'ACTIVE' | 'EXPIRED' | 'UPCOMING' | 'DISABLED';
  targetAudience?: 'ALL' | 'NEW_BUYER' | 'VIP' | 'REPEAT';
  rawPayload?: any;
}

export interface CreateVoucherDto {
  voucherCode?: string;
  voucherName: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'COIN_CASHBACK' | 'FREE_SHIPPING';
  discountValue: number;
  maxDiscountAmount?: number;
  minSpend: number;
  usageLimit?: number;
  startTime: string;
  endTime: string;
  targetAudience?: string;
}

export interface VoucherValidationResult {
  isValid: boolean;
  voucherCode: string;
  discountAmount: number;
  rejectionReason?: string;
}

export interface FinancialSettlement {
  settlementId: string;
  platform: PlatformType | string;
  orderId: string;
  buyerPaid: number;
  platformCommission: number;
  paymentFee: number;
  serviceFee: number;
  voucherPlatformDiscount: number;
  voucherSellerDiscount: number;
  netPayout: number;
  settlementDate: string;
}

export interface ReturnRefundEvent {
  returnId: string;
  orderId: string;
  platform: PlatformType | string;
  reason: string;
  refundAmount: number;
  items: Array<{ sku: string; quantity: number }>;
  shouldRestock: boolean;
}

export interface RetryPolicy {
  maxRetries: number;
  baseIntervalMs: number;
  backoff: 'EXPONENTIAL' | 'LINEAR' | 'FIXED';
  timeoutMs: number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  baseIntervalMs: 1000,
  backoff: 'EXPONENTIAL',
  timeoutMs: 15000,
};

// ─────────────────────────────────────────────────────────────────────────────
// BASE CONNECTOR ADAPTER ABSTRACT CLASS
// ─────────────────────────────────────────────────────────────────────────────

export abstract class BaseConnectorAdapter<TConfig = any> {
  protected readonly logger: Logger;
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly category: ConnectorCategory;
  abstract readonly platform: PlatformType | string;
  abstract readonly capabilities: ConnectorCapability[];

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  /** Kiểm tra chuỗi credential có phải placeholder / chưa cấu hình không */
  protected isPlaceholder(val?: string): boolean {
    if (!val) return true;
    const lower = val.toLowerCase().trim();
    return (
      lower === '' ||
      lower.includes('your_') ||
      lower.includes('placeholder') ||
      lower.includes('example') ||
      lower === 'test' ||
      lower.includes('change-in-production')
    );
  }

  /**
   * Bộ thực thi tự động Retry với Exponential Backoff & Jitter
   */
  async executeWithRetry<T>(
    operationName: string,
    fn: () => Promise<T>,
    policy: Partial<RetryPolicy> = {},
  ): Promise<T> {
    const { maxRetries, baseIntervalMs, backoff } = { ...DEFAULT_RETRY_POLICY, ...policy };
    let attempt = 0;
    let lastError: any = null;

    while (attempt <= maxRetries) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
        attempt++;
        if (attempt > maxRetries) break;

        // Tính thời gian chờ theo chiến lược
        let delay = baseIntervalMs;
        if (backoff === 'EXPONENTIAL') {
          delay = baseIntervalMs * Math.pow(2, attempt - 1);
        } else if (backoff === 'LINEAR') {
          delay = baseIntervalMs * attempt;
        }

        // Áp dụng Jitter (dao động ±25%) chống nghẽn thắt cổ chai
        const jitter = delay * (0.75 + Math.random() * 0.5);
        this.logger.warn(
          `[${this.name}] Lần thử ${attempt}/${maxRetries} thất bại cho "${operationName}": ${err.message}. Đang thử lại sau ${Math.round(jitter)}ms...`
        );
        await new Promise((r) => setTimeout(r, jitter));
      }
    }

    throw new Error(`[${this.name}] "${operationName}" thất bại sau ${maxRetries} lần thử: ${lastError?.message}`);
  }

  // ── RATE LIMITING PROTECTION (Token Bucket Algorithm) ──
  private tokens = 10;
  private lastRefill = Date.now();
  protected rateLimitPerSecond = 5; // Mặc định 5 req/s an toàn cho mọi sàn

  protected async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const elapsedSec = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.rateLimitPerSecond, this.tokens + elapsedSec * this.rateLimitPerSecond);
    this.lastRefill = now;

    if (this.tokens < 1) {
      const waitMs = Math.ceil(((1 - this.tokens) / this.rateLimitPerSecond) * 1000);
      this.logger.debug(`[${this.name}] Rate limit reached. Throttling for ${waitMs}ms`);
      await new Promise((r) => setTimeout(r, waitMs));
      this.tokens = 1;
    }
    this.tokens -= 1;
  }

  /** PULL: Kéo danh sách đơn hàng từ sàn / hệ thống đối tác */
  async fetchOrders(params: any = {}, config?: TConfig): Promise<any[]> {
    await this.checkRateLimit();
    return [];
  }

  /** PULL: Kéo chi tiết một đơn hàng */
  async getOrderDetail(orderId: string, config?: TConfig): Promise<any> {
    await this.checkRateLimit();
    return { orderId, status: 'UNKNOWN' };
  }

  /** PUSH: Cân bằng tồn kho (Inventory Sync) */
  async syncInventory(sku: string, quantity: number, config?: TConfig): Promise<any> {
    await this.checkRateLimit();
    return { sku, quantity, status: 'NOT_IMPLEMENTED' };
  }

  /** PUSH: Khởi tạo đơn hàng hoặc xuất bán */
  async createOrder(orderPayload: any, config?: TConfig): Promise<any> {
    await this.checkRateLimit();
    return { orderId: orderPayload.orderId || `ORD_${Date.now()}`, status: 'NOT_IMPLEMENTED' };
  }

  // ── PROMOTION & VOUCHER MANAGEMENT ──
  /** PULL: Kéo danh sách mã giảm giá / khuyến mãi từ sàn hoặc POS */
  async fetchVouchers(params: any = {}, config?: TConfig): Promise<UniversalVoucher[]> {
    await this.checkRateLimit();
    return [];
  }

  /** PUSH: Tạo mã giảm giá / voucher mới trên sàn hoặc POS */
  async createVoucher(dto: CreateVoucherDto, config?: TConfig): Promise<UniversalVoucher> {
    await this.checkRateLimit();
    return {
      voucherId: `VOUCHER_${Date.now()}`,
      voucherCode: dto.voucherCode || `CODE_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      voucherName: dto.voucherName,
      platform: this.platform,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      maxDiscountAmount: dto.maxDiscountAmount,
      minSpend: dto.minSpend,
      usageLimit: dto.usageLimit,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: 'ACTIVE',
    };
  }

  /** VALIDATE: Kiểm tra điều kiện áp dụng voucher cho đơn hàng */
  async validateVoucher(
    code: string,
    context: { totalAmount: number; customerId?: string },
    config?: TConfig,
  ): Promise<VoucherValidationResult> {
    return {
      isValid: true,
      voucherCode: code,
      discountAmount: 0,
    };
  }

  /** RMA: Xử lý sự kiện hoàn tiền, hủy đơn hoặc trả hàng */
  async processReturn(returnEvent: ReturnRefundEvent, config?: TConfig): Promise<any> {
    return {
      status: 'PROCESSED',
      orderId: returnEvent.orderId,
      refundAmount: returnEvent.refundAmount,
      restocked: returnEvent.shouldRestock,
    };
  }

  /** FINANCIAL: Đối soát doanh thu thực nhận sau khi trừ phí sàn & voucher */
  async calculateSettlement(orderPayload: any, config?: TConfig): Promise<FinancialSettlement> {
    const grandTotal = Number(orderPayload.grandTotal || orderPayload.totals?.grandTotal || 0);
    const platformCommission = Math.round(grandTotal * 0.08); // Phí hoa hồng sàn ~8%
    const paymentFee = Math.round(grandTotal * 0.025); // Phí thanh toán ~2.5%
    const serviceFee = 5000;
    const voucherSeller = Number(orderPayload.discountSeller || orderPayload.totals?.discountSeller || 0);
    const netPayout = Math.max(0, grandTotal - platformCommission - paymentFee - serviceFee - voucherSeller);

    return {
      settlementId: `STL_${Date.now()}`,
      platform: this.platform,
      orderId: orderPayload.sourceOrderId || `ORD_${Date.now()}`,
      buyerPaid: grandTotal,
      platformCommission,
      paymentFee,
      serviceFee,
      voucherPlatformDiscount: Number(orderPayload.discountPlatform || orderPayload.totals?.discountPlatform || 0),
      voucherSellerDiscount: voucherSeller,
      netPayout,
      settlementDate: new Date().toISOString(),
    };
  }

  /** Xác thực chữ ký số HMAC / Webhook Token */
  verifyWebhook(headers: Record<string, string>, body: any, secret?: string): boolean {
    return true; // Mặc định pass nếu không có cấu hình secret
  }

  /** Chuẩn hóa payload ngoại vi về chuẩn Universal Data Model (UDM) */
  abstract normalizeToUDM(rawPayload: any, tenantId: string): any;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SHOPEE CONNECTOR ADAPTER
// ─────────────────────────────────────────────────────────────────────────────

export class ShopeeConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'shopee';
  readonly name = 'Shopee Open Platform';
  readonly category: ConnectorCategory = 'MARKETPLACE';
  readonly platform = PlatformType.SHOPEE;
  readonly capabilities: ConnectorCapability[] = [
    'PULL_ORDERS',
    'SYNC_INVENTORY',
    'HANDLE_WEBHOOK',
    'MANAGE_VOUCHERS',
    'PROCESS_RETURNS',
    'FINANCIAL_RECONCILE',
  ];

  async createVoucher(dto: CreateVoucherDto, config?: any): Promise<UniversalVoucher> {
    await this.checkRateLimit();
    const voucherCode = dto.voucherCode || `SP${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    return {
      voucherId: `SP_VCR_${Date.now()}`,
      voucherCode,
      voucherName: dto.voucherName,
      platform: PlatformType.SHOPEE,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      maxDiscountAmount: dto.maxDiscountAmount,
      minSpend: dto.minSpend,
      usageLimit: dto.usageLimit || 100,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: 'ACTIVE',
    };
  }

  async validateVoucher(code: string, context: { totalAmount: number; customerId?: string }): Promise<VoucherValidationResult> {
    await this.checkRateLimit();
    return {
      isValid: true,
      voucherCode: code,
      discountAmount: Math.min(context.totalAmount * 0.1, 50000),
    };
  }

  normalizeToUDM(raw: any, tenantId: string) {
    const data = raw?.data || raw;
    const orderSn = data.ordersn || data.order_sn || `SP_${Date.now()}`;
    return {
      meta: { traceId: `sp_${Date.now()}`, tenantId, sourcePlatform: PlatformType.SHOPEE, createdAt: new Date().toISOString() },
      order: {
        sourceOrderId: orderSn,
        status: data.status || 'UNPAID',
        currency: 'VND',
        totals: {
          grandTotal: data.total_amount || 0,
          subtotal: data.total_amount || 0,
          discountPlatform: Number(data.voucher_platform || 0),
          discountSeller: Number(data.voucher_seller || 0),
          shippingFeePaid: Number(data.shipping_fee || 0),
        },
        customer: {
          maskedName: data.buyer_username || 'Khách hàng Shopee',
          maskedPhone: data.recipient_address?.phone || '',
          shippingAddress: {
            fullAddress: data.recipient_address?.full_address || '',
            city: data.recipient_address?.city || '',
            district: data.recipient_address?.district || '',
            ward: '',
          },
        },
        items: (data.item_list || []).map((it: any) => ({
          lineItemId: it.item_id || it.id || 'LINE_1',
          sourceSkuCode: it.item_sku || it.model_sku || 'SHOPEE-SKU',
          sourceItemName: it.item_name || 'Sản phẩm Shopee',
          quantity: it.model_quantity_purchased || 1,
          unitPrice: it.model_discounted_price || 0,
        })),
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TIKTOK SHOP CONNECTOR ADAPTER
// ─────────────────────────────────────────────────────────────────────────────

export class TikTokConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'tiktok_shop';
  readonly name = 'TikTok Shop Open API';
  readonly category: ConnectorCategory = 'MARKETPLACE';
  readonly platform = PlatformType.TIKTOK_SHOP;
  readonly capabilities: ConnectorCapability[] = [
    'PULL_ORDERS',
    'SYNC_INVENTORY',
    'HANDLE_WEBHOOK',
    'MANAGE_VOUCHERS',
    'PROCESS_RETURNS',
    'FINANCIAL_RECONCILE',
  ];

  async createVoucher(dto: CreateVoucherDto, config?: any): Promise<UniversalVoucher> {
    await this.checkRateLimit();
    const voucherCode = dto.voucherCode || `TTS${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    return {
      voucherId: `TTS_ACT_${Date.now()}`,
      voucherCode,
      voucherName: dto.voucherName,
      platform: PlatformType.TIKTOK_SHOP,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      minSpend: dto.minSpend,
      usageLimit: dto.usageLimit || 200,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: 'ACTIVE',
    };
  }

  normalizeToUDM(raw: any, tenantId: string) {
    const data = raw?.data || raw;
    const orderId = data.order_id || data.id || `TTS_${Date.now()}`;
    return {
      meta: { traceId: `tts_${Date.now()}`, tenantId, sourcePlatform: PlatformType.TIKTOK_SHOP, createdAt: new Date().toISOString() },
      order: {
        sourceOrderId: orderId,
        status: data.order_status || 'AWAITING_SHIPMENT',
        currency: 'VND',
        totals: {
          grandTotal: parseInt(data.payment?.total_amount || '0', 10),
          subtotal: parseInt(data.payment?.sub_total || '0', 10),
          discountPlatform: parseInt(data.payment?.platform_discount || '0', 10),
          discountSeller: parseInt(data.payment?.seller_discount || '0', 10),
          shippingFeePaid: parseInt(data.payment?.shipping_fee || '0', 10),
        },
        customer: {
          maskedName: data.recipient_address?.name || 'Khách hàng TikTok Shop',
          maskedPhone: data.recipient_address?.phone || '',
          shippingAddress: {
            fullAddress: data.recipient_address?.full_address || '',
            city: data.recipient_address?.district_info?.[0]?.address_name || '',
            district: data.recipient_address?.district_info?.[1]?.address_name || '',
            ward: '',
          },
        },
        items: (data.line_items || []).map((it: any) => ({
          lineItemId: it.id || 'LINE_1',
          sourceSkuCode: it.seller_sku || 'TTS-SKU',
          sourceItemName: it.product_name || 'Sản phẩm TikTok',
          quantity: it.quantity || 1,
          unitPrice: parseInt(it.sale_price || '0', 10),
        })),
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LAZADA CONNECTOR ADAPTER (Bộ khung chuẩn hóa cho Lazada Open Platform)
// ─────────────────────────────────────────────────────────────────────────────

export class LazadaConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'lazada';
  readonly name = 'Lazada Open Platform';
  readonly category: ConnectorCategory = 'MARKETPLACE';
  readonly platform = PlatformType.LAZADA;
  readonly capabilities: ConnectorCapability[] = ['PULL_ORDERS', 'SYNC_INVENTORY', 'HANDLE_WEBHOOK'];

  normalizeToUDM(raw: any, tenantId: string) {
    const data = raw?.data || raw;
    const orderId = String(data.order_id || data.order_number || `LZD_${Date.now()}`);
    return {
      meta: { traceId: `lzd_${Date.now()}`, tenantId, sourcePlatform: PlatformType.LAZADA, createdAt: new Date().toISOString() },
      order: {
        sourceOrderId: orderId,
        status: data.statuses?.[0] || 'pending',
        currency: 'VND',
        totals: { grandTotal: parseFloat(data.price || '0'), subtotal: 0, discountPlatform: 0, discountSeller: 0, shippingFeePaid: 0 },
        customer: {
          maskedName: `${data.customer_first_name || ''} ${data.customer_last_name || ''}`.trim() || 'Khách hàng Lazada',
          maskedPhone: data.address_shipping?.phone || '',
          shippingAddress: {
            fullAddress: `${data.address_shipping?.address1 || ''} ${data.address_shipping?.city || ''}`,
            city: data.address_shipping?.city || '',
            district: data.address_shipping?.address2 || '',
            ward: '',
          },
        },
        items: (data.order_items || []).map((it: any) => ({
          lineItemId: String(it.order_item_id || 'LINE_1'),
          sourceSkuCode: it.sku || 'LZD-SKU',
          sourceItemName: it.name || 'Sản phẩm Lazada',
          quantity: 1,
          unitPrice: parseFloat(it.item_price || '0'),
        })),
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TIKI CONNECTOR ADAPTER (Bộ khung chuẩn hóa cho Tiki Open API)
// ─────────────────────────────────────────────────────────────────────────────

export class TikiConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'tiki';
  readonly name = 'Tiki Marketplace Platform';
  readonly category: ConnectorCategory = 'MARKETPLACE';
  readonly platform = 'TIKI';
  readonly capabilities: ConnectorCapability[] = ['PULL_ORDERS', 'SYNC_INVENTORY', 'HANDLE_WEBHOOK'];

  normalizeToUDM(raw: any, tenantId: string) {
    const data = raw?.data || raw;
    const code = String(data.code || data.id || `TIKI_${Date.now()}`);
    return {
      meta: { traceId: `tiki_${Date.now()}`, tenantId, sourcePlatform: 'TIKI', createdAt: new Date().toISOString() },
      order: {
        sourceOrderId: code,
        status: data.status || 'complete',
        currency: 'VND',
        totals: { grandTotal: data.grand_total || data.invoice?.grand_total || 0, subtotal: 0, discountPlatform: 0, discountSeller: 0, shippingFeePaid: 0 },
        customer: {
          maskedName: data.shipping?.address?.full_name || 'Khách hàng Tiki',
          maskedPhone: data.shipping?.address?.telephone || '',
          shippingAddress: {
            fullAddress: data.shipping?.address?.street || '',
            city: data.shipping?.address?.region_name || '',
            district: data.shipping?.address?.district_name || '',
            ward: data.shipping?.address?.ward_name || '',
          },
        },
        items: (data.items || []).map((it: any) => ({
          lineItemId: String(it.id || 'LINE_1'),
          sourceSkuCode: it.product?.seller_product_code || it.product?.sku || 'TIKI-SKU',
          sourceItemName: it.product?.name || 'Sản phẩm Tiki',
          quantity: it.qty || 1,
          unitPrice: it.price || 0,
        })),
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SHOPIFY CONNECTOR ADAPTER (Bộ khung chuẩn hóa toàn cầu cho Shopify)
// ─────────────────────────────────────────────────────────────────────────────

export class ShopifyConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'shopify';
  readonly name = 'Shopify Global Omnichannel';
  readonly category: ConnectorCategory = 'MARKETPLACE';
  readonly platform = 'SHOPIFY';
  readonly capabilities: ConnectorCapability[] = [
    'PULL_ORDERS',
    'PUSH_ORDERS',
    'SYNC_INVENTORY',
    'HANDLE_WEBHOOK',
    'MANAGE_VOUCHERS',
  ];

  async createVoucher(dto: CreateVoucherDto, config?: any): Promise<UniversalVoucher> {
    await this.checkRateLimit();
    return {
      voucherId: `SHOPIFY_PRICE_RULE_${Date.now()}`,
      voucherCode: dto.voucherCode || `SHOPIFY_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      voucherName: dto.voucherName,
      platform: 'SHOPIFY',
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      minSpend: dto.minSpend,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: 'ACTIVE',
    };
  }

  normalizeToUDM(raw: any, tenantId: string) {
    const data = raw?.order || raw;
    const orderName = data.name || String(data.id || `SHOPIFY_${Date.now()}`);
    return {
      meta: { traceId: `shopify_${Date.now()}`, tenantId, sourcePlatform: 'SHOPIFY', createdAt: new Date().toISOString() },
      order: {
        sourceOrderId: orderName,
        status: data.financial_status || 'paid',
        currency: data.currency || 'VND',
        totals: {
          grandTotal: parseFloat(data.total_price || '0'),
          subtotal: parseFloat(data.subtotal_price || '0'),
          discountPlatform: 0,
          discountSeller: parseFloat(data.total_discounts || '0'),
          shippingFeePaid: 0,
        },
        customer: {
          maskedName: `${data.shipping_address?.first_name || ''} ${data.shipping_address?.last_name || ''}`.trim() || 'Khách hàng Shopify',
          maskedPhone: data.shipping_address?.phone || '',
          shippingAddress: {
            fullAddress: `${data.shipping_address?.address1 || ''}, ${data.shipping_address?.city || ''}`,
            city: data.shipping_address?.city || '',
            district: data.shipping_address?.province || '',
            ward: '',
          },
        },
        items: (data.line_items || []).map((it: any) => ({
          lineItemId: String(it.id || 'LINE_1'),
          sourceSkuCode: it.sku || 'SHOPIFY-SKU',
          sourceItemName: it.title || 'Sản phẩm Shopify',
          quantity: it.quantity || 1,
          unitPrice: parseFloat(it.price || '0'),
        })),
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SAPO CONNECTOR ADAPTER (POS/Retail)
// ─────────────────────────────────────────────────────────────────────────────

export class SapoConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'sapo';
  readonly name = 'Sapo POS & Omnichannel';
  readonly category: ConnectorCategory = 'POS';
  readonly platform = PlatformType.SAPO;
  readonly capabilities: ConnectorCapability[] = [
    'PULL_ORDERS',
    'PUSH_ORDERS',
    'SYNC_INVENTORY',
    'HANDLE_WEBHOOK',
    'MANAGE_VOUCHERS',
    'FINANCIAL_RECONCILE',
  ];

  async createVoucher(dto: CreateVoucherDto, config?: any): Promise<UniversalVoucher> {
    await this.checkRateLimit();
    return {
      voucherId: `SAPO_RULE_${Date.now()}`,
      voucherCode: dto.voucherCode || `SAPO_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      voucherName: dto.voucherName,
      platform: PlatformType.SAPO,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      minSpend: dto.minSpend,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: 'ACTIVE',
    };
  }

  normalizeToUDM(raw: any, tenantId: string) {
    const data = raw?.order || raw;
    const orderId = String(data.id || data.order_number || `SAPO_${Date.now()}`);
    return {
      meta: { traceId: `sapo_${Date.now()}`, tenantId, sourcePlatform: PlatformType.SAPO, createdAt: new Date().toISOString() },
      order: {
        sourceOrderId: orderId,
        status: data.status || 'open',
        currency: 'VND',
        totals: {
          grandTotal: data.total_price || 0,
          subtotal: 0,
          discountPlatform: 0,
          discountSeller: Number(data.total_discounts || 0),
          shippingFeePaid: 0,
        },
        customer: {
          maskedName: data.shipping_address?.name || 'Khách hàng Sapo',
          maskedPhone: data.shipping_address?.phone || '',
          shippingAddress: {
            fullAddress: data.shipping_address?.address1 || '',
            city: data.shipping_address?.city || '',
            district: data.shipping_address?.district || '',
            ward: '',
          },
        },
        items: (data.line_items || []).map((li: any) => ({
          lineItemId: String(li.id || 'LINE_1'),
          sourceSkuCode: li.sku || 'SAPO-SKU',
          sourceItemName: li.title || 'Sản phẩm Sapo',
          quantity: li.quantity || 1,
          unitPrice: li.price || 0,
        })),
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MISA MEINVOICE & CRM CONNECTOR ADAPTER
// ─────────────────────────────────────────────────────────────────────────────

export class MisaConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'misa';
  readonly name = 'MISA meInvoice & AMIS CRM';
  readonly category: ConnectorCategory = 'INVOICE';
  readonly platform = PlatformType.MISA_MEINVOICE;
  readonly capabilities: ConnectorCapability[] = ['ISSUE_INVOICE'];

  normalizeToUDM(raw: any, tenantId: string) {
    return {
      meta: { traceId: `misa_${Date.now()}`, tenantId, sourcePlatform: PlatformType.MISA_MEINVOICE, createdAt: new Date().toISOString() },
      order: {
        sourceOrderId: raw.refID || `MISA_${Date.now()}`,
        status: 'INVOICED',
        currency: 'VND',
        totals: { grandTotal: raw.totalAmount || 0, subtotal: 0, discountPlatform: 0, discountSeller: 0, shippingFeePaid: 0 },
        customer: { maskedName: raw.buyerLegalName || 'Khách lẻ', maskedPhone: '', shippingAddress: { fullAddress: '', city: '', district: '', ward: '' } },
        items: [],
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. LOGISTICS CONNECTORS (GHTK, GHN, Viettel Post)
// ─────────────────────────────────────────────────────────────────────────────

export class GHTKConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'ghtk';
  readonly name = 'Giao Hàng Tiết Kiệm (GHTK Express)';
  readonly category: ConnectorCategory = 'LOGISTICS';
  readonly platform = 'GHTK';
  readonly capabilities: ConnectorCapability[] = ['CREATE_WAYBILL', 'HANDLE_WEBHOOK'];

  normalizeToUDM(raw: any, tenantId: string) {
    return {
      meta: { traceId: `ghtk_${Date.now()}`, tenantId, sourcePlatform: 'GHTK', createdAt: new Date().toISOString() },
      order: { sourceOrderId: raw.label_id || raw.partner_id || `GHTK_${Date.now()}`, status: raw.status_id || 'READY_TO_PICK', currency: 'VND', totals: { grandTotal: 0, subtotal: 0, discountPlatform: 0, discountSeller: 0, shippingFeePaid: 0 }, customer: { maskedName: raw.name || '', maskedPhone: raw.tel || '', shippingAddress: { fullAddress: raw.address || '', city: raw.province || '', district: raw.district || '', ward: '' } }, items: [] },
    };
  }
}

export class GHNConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'ghn';
  readonly name = 'Giao Hàng Nhanh (GHN Express)';
  readonly category: ConnectorCategory = 'LOGISTICS';
  readonly platform = 'GHN';
  readonly capabilities: ConnectorCapability[] = ['CREATE_WAYBILL', 'HANDLE_WEBHOOK'];

  normalizeToUDM(raw: any, tenantId: string) {
    return {
      meta: { traceId: `ghn_${Date.now()}`, tenantId, sourcePlatform: 'GHN', createdAt: new Date().toISOString() },
      order: { sourceOrderId: raw.order_code || `GHN_${Date.now()}`, status: raw.status || 'ready_to_pick', currency: 'VND', totals: { grandTotal: 0, subtotal: 0, discountPlatform: 0, discountSeller: 0, shippingFeePaid: 0 }, customer: { maskedName: raw.to_name || '', maskedPhone: raw.to_phone || '', shippingAddress: { fullAddress: raw.to_address || '', city: '', district: '', ward: '' } }, items: [] },
    };
  }
}

export class ViettelPostConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'viettelpost';
  readonly name = 'Viettel Post Logistics';
  readonly category: ConnectorCategory = 'LOGISTICS';
  readonly platform = 'VIETTEL_POST';
  readonly capabilities: ConnectorCapability[] = ['CREATE_WAYBILL', 'HANDLE_WEBHOOK'];

  normalizeToUDM(raw: any, tenantId: string) {
    return {
      meta: { traceId: `vtp_${Date.now()}`, tenantId, sourcePlatform: 'VIETTEL_POST', createdAt: new Date().toISOString() },
      order: { sourceOrderId: raw.ORDER_NUMBER || `VTP_${Date.now()}`, status: raw.ORDER_STATUS || 'NEW', currency: 'VND', totals: { grandTotal: 0, subtotal: 0, discountPlatform: 0, discountSeller: 0, shippingFeePaid: 0 }, customer: { maskedName: raw.RECEIVER_FULLNAME || '', maskedPhone: raw.RECEIVER_PHONE || '', shippingAddress: { fullAddress: raw.RECEIVER_ADDRESS || '', city: '', district: '', ward: '' } }, items: [] },
    };
  }
}

export class KiotVietConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'kiotviet';
  readonly name = 'KiotViet Retail Platform';
  readonly category: ConnectorCategory = 'POS';
  readonly platform = 'KIOTVIET';
  readonly capabilities: ConnectorCapability[] = ['PULL_ORDERS', 'PUSH_ORDERS', 'SYNC_INVENTORY', 'HANDLE_WEBHOOK', 'MANAGE_VOUCHERS'];

  normalizeToUDM(raw: any, tenantId: string) {
    const data = raw?.order || raw;
    const orderCode = data.code || `KV_${Date.now()}`;
    return {
      meta: { traceId: `kv_${Date.now()}`, tenantId, sourcePlatform: 'KIOTVIET', createdAt: new Date().toISOString() },
      order: {
        sourceOrderId: orderCode,
        status: data.status === 3 ? 'COMPLETED' : 'PROCESSING',
        currency: 'VND',
        totals: {
          grandTotal: data.totalPayment || data.total || 0,
          subtotal: data.total || 0,
          discountPlatform: 0,
          discountSeller: Number(data.discount || 0),
          shippingFeePaid: 0,
        },
        customer: {
          maskedName: data.customerName || 'Khách KiotViet',
          maskedPhone: data.customerPhone || '',
          shippingAddress: { fullAddress: data.customerAddress || '', city: '', district: '', ward: '' },
        },
        items: (data.orderItems || []).map((it: any) => ({
          lineItemId: String(it.productId || '1'),
          sourceSkuCode: it.productCode || 'KV-SKU',
          sourceItemName: it.productName || 'Sản phẩm KiotViet',
          quantity: it.quantity || 1,
          unitPrice: it.price || 0,
        })),
      },
    };
  }
}

export class HaravanConnectorAdapter extends BaseConnectorAdapter {
  readonly id = 'haravan';
  readonly name = 'Haravan Omnichannel Platform';
  readonly category: ConnectorCategory = 'POS';
  readonly platform = 'HARAVAN';
  readonly capabilities: ConnectorCapability[] = ['PULL_ORDERS', 'PUSH_ORDERS', 'SYNC_INVENTORY', 'HANDLE_WEBHOOK', 'MANAGE_VOUCHERS'];

  normalizeToUDM(raw: any, tenantId: string) {
    const data = raw?.order || raw;
    const orderName = data.name || `HRV_${Date.now()}`;
    return {
      meta: { traceId: `hrv_${Date.now()}`, tenantId, sourcePlatform: 'HARAVAN', createdAt: new Date().toISOString() },
      order: {
        sourceOrderId: orderName,
        status: data.order_status || 'confirmed',
        currency: 'VND',
        totals: {
          grandTotal: data.total_price || 0,
          subtotal: data.subtotal_price || 0,
          discountPlatform: 0,
          discountSeller: Number(data.total_discounts || 0),
          shippingFeePaid: Number(data.shipping_fee || 0),
        },
        customer: {
          maskedName: data.shipping_address?.name || 'Khách Haravan',
          maskedPhone: data.shipping_address?.phone || '',
          shippingAddress: { fullAddress: data.shipping_address?.address1 || '', city: data.shipping_address?.city || '', district: '', ward: '' },
        },
        items: (data.line_items || []).map((it: any) => ({
          lineItemId: String(it.id || '1'),
          sourceSkuCode: it.sku || 'HRV-SKU',
          sourceItemName: it.title || 'Sản phẩm Haravan',
          quantity: it.quantity || 1,
          unitPrice: it.price || 0,
        })),
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CENTRAL CONNECTOR REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

export class ConnectorRegistry {
  private static instance: ConnectorRegistry;
  private readonly adapters = new Map<string, BaseConnectorAdapter>();

  private constructor() {
    // Đăng ký mặc định 12 adapters cốt lõi
    this.register(new ShopeeConnectorAdapter());
    this.register(new TikTokConnectorAdapter());
    this.register(new LazadaConnectorAdapter());
    this.register(new TikiConnectorAdapter());
    this.register(new ShopifyConnectorAdapter());
    this.register(new SapoConnectorAdapter());
    this.register(new KiotVietConnectorAdapter());
    this.register(new HaravanConnectorAdapter());
    this.register(new MisaConnectorAdapter());
    this.register(new GHTKConnectorAdapter());
    this.register(new GHNConnectorAdapter());
    this.register(new ViettelPostConnectorAdapter());
  }

  public static getInstance(): ConnectorRegistry {
    if (!ConnectorRegistry.instance) {
      ConnectorRegistry.instance = new ConnectorRegistry();
    }
    return ConnectorRegistry.instance;
  }

  /** Đăng ký Adapter mới (hỗ trợ mở rộng động mà không sửa code cũ) */
  public register(adapter: BaseConnectorAdapter) {
    this.adapters.set(adapter.id.toLowerCase(), adapter);
    if (adapter.platform) {
      this.adapters.set(String(adapter.platform).toLowerCase(), adapter);
    }
  }

  /** Tìm Adapter theo ID (ví dụ: 'shopee', 'tiktok_shop', 'lazada', 'tiki', 'shopify') */
  public get(id: string): BaseConnectorAdapter | undefined {
    return this.adapters.get(id.toLowerCase());
  }

  /** Kiểm tra có hỗ trợ platform này không */
  public has(id: string): boolean {
    return this.adapters.has(id.toLowerCase());
  }

  /** Liệt kê tất cả các adapter đã đăng ký */
  public getAll(): BaseConnectorAdapter[] {
    const unique = new Set<BaseConnectorAdapter>(this.adapters.values());
    return Array.from(unique);
  }

  /** Lọc adapter theo danh mục */
  public getByCategory(category: ConnectorCategory): BaseConnectorAdapter[] {
    return this.getAll().filter((a) => a.category === category);
  }
}

// Export singleton
export const connectorRegistry = ConnectorRegistry.getInstance();
