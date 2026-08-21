import axios, { AxiosInstance } from 'axios';
import { Logger } from '@nestjs/common';

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

/**
 * KiotVietProvider — Tích hợp KiotViet Public API (OAuth 2.0 Client Credentials)
 *
 * Base URL:  https://public.kiotapi.com
 * Auth URL:  https://id.kiotviet.vn/connect/token
 *
 * Cách lấy credentials: KiotViet Admin → Thiết lập → Kết nối API
 * Yêu cầu: Gói Cao Cấp
 */
export class KiotVietProvider {
  private readonly logger = new Logger(KiotVietProvider.name);
  private tokenCache: TokenCache | null = null;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly retailer: string, // Tên shop VD: "myshop123"
  ) {}

  // ── Auth ────────────────────────────────────────────────────────────────────

  private async getAccessToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.accessToken;
    }

    const res = await axios.post(
      'https://id.kiotviet.vn/connect/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scopes: 'PublicApi.Access',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 5000 },
    );

    this.tokenCache = {
      accessToken: res.data.access_token,
      expiresAt: Date.now() + (res.data.expires_in - 60) * 1000, // Trừ 60s buffer
    };

    this.logger.log(`[KiotViet] Token refreshed, expires in ${res.data.expires_in}s`);
    return this.tokenCache.accessToken;
  }

  private async makeClient(): Promise<AxiosInstance> {
    const token = await this.getAccessToken();
    return axios.create({
      baseURL: 'https://public.kiotapi.com',
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${token}`,
        Retailer: this.retailer,
        'Content-Type': 'application/json',
      },
    });
  }

  // ── Products & Inventory ───────────────────────────────────────────────────

  /** Lấy danh sách sản phẩm (có thể kèm tồn kho) */
  async getProducts(params?: { pageSize?: number; currentItem?: number; includeInventory?: boolean }) {
    const client = await this.makeClient();
    const res = await client.get('/products', {
      params: {
        pageSize: params?.pageSize ?? 20,
        currentItem: params?.currentItem ?? 0,
        includeInventory: params?.includeInventory ?? true,
      },
    });
    return res.data as { total: number; pageSize: number; data: any[] };
  }

  /** Lấy sản phẩm theo mã SKU (code) */
  async getProductBySku(sku: string) {
    const client = await this.makeClient();
    const res = await client.get('/products', {
      params: { code: sku, includeInventory: true },
    });
    return (res.data?.data ?? [])[0] ?? null;
  }

  /** Kiểm tra tồn kho khả dụng của 1 SKU tại 1 chi nhánh */
  async getAvailableStock(sku: string, branchId?: number): Promise<number> {
    const product = await this.getProductBySku(sku);
    if (!product) return 0;

    const inventories: any[] = product.inventories ?? [];
    if (branchId) {
      return inventories.find((i: any) => i.branchId === branchId)?.onHand ?? 0;
    }
    return inventories.reduce((sum: number, i: any) => sum + (i.onHand ?? 0), 0);
  }

  // ── Orders ─────────────────────────────────────────────────────────────────

  /** Lấy danh sách đơn hàng */
  async getOrders(params?: { status?: number; pageSize?: number; currentItem?: number }) {
    const client = await this.makeClient();
    const res = await client.get('/orders', {
      params: {
        pageSize: params?.pageSize ?? 20,
        currentItem: params?.currentItem ?? 0,
        status: params?.status, // 1=Đang xử lý; 3=Hoàn thành; 4=Hủy
      },
    });
    return res.data as { total: number; data: any[] };
  }

  // ── Stock Manipulation ─────────────────────────────────────────────────────

  /** Tạo phiếu xuất kho (trừ tồn kho khi có đơn) */
  async createStockOut(params: {
    branchId: number;
    description: string;
    details: Array<{ productId: number; quantity: number }>;
  }) {
    const client = await this.makeClient();
    const res = await client.post('/stockouts', params);
    return res.data;
  }
}

/** Factory: tạo instance từ env vars */
export function createKiotVietProvider(): KiotVietProvider | null {
  const clientId = process.env.KIOTVIET_CLIENT_ID;
  const clientSecret = process.env.KIOTVIET_CLIENT_SECRET;
  const retailer = process.env.KIOTVIET_RETAILER;

  if (!clientId || !clientSecret || !retailer) return null;
  return new KiotVietProvider(clientId, clientSecret, retailer);
}
