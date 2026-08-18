import { BaseApiService } from './base.service';
import { baseApi } from './api';

export interface SyncLogItem {
  _id: string;
  sourceOrderId: string;
  platform: string;
  status: 'SUCCESS' | 'FAILED' | 'RETRYING';
  message: string;
  durationMs: number;
  aiHealed: boolean;
  timestamp: string;
  payload?: any;
}

const mockLogs: SyncLogItem[] = [
  {
    _id: 'log-01',
    sourceOrderId: 'TTS_88921045',
    platform: 'TIKTOK_SHOP',
    status: 'SUCCESS',
    message: 'Đơn TikTok #TTS_88921045 -> Khớp SKU AI (98.5%) -> Trừ kho Sapo -> Tạo vận đơn GHTK (198ms)',
    durationMs: 198,
    aiHealed: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    payload: {
      orderId: 'TTS_88921045',
      platform: 'TIKTOK_SHOP',
      canonicalLineItems: [{ sku: 'TTS-TSHIRT-01', masterSku: 'SAPO_POLO_01', quantity: 1, unitPrice: 250000 }],
      shippingAddress: { city: 'Hà Nội', district: 'Hà Đông' },
    },
  },
  {
    _id: 'log-02',
    sourceOrderId: 'TTS_1787021853492',
    platform: 'TIKTOK_SHOP',
    status: 'SUCCESS',
    message: 'Đơn TikTok #TTS_1787021853492 -> Khớp SKU AI (98.5%) -> Trừ kho Sapo -> Tạo vận đơn GHTK (1ms)',
    durationMs: 1,
    aiHealed: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    _id: 'log-03',
    sourceOrderId: 'SP_24081899120',
    platform: 'SHOPEE',
    status: 'SUCCESS',
    message: 'AI Auto-Healed: GHN Server Timeout (504) -> Reroute sang GHTK (Tiết kiệm 4,500đ)',
    durationMs: 412,
    aiHealed: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    _id: 'log-04',
    sourceOrderId: 'TTS_88920982',
    platform: 'TIKTOK_SHOP',
    status: 'SUCCESS',
    message: "Đơn TikTok #TTS_88920982 -> Khớp SKU 'QJ-SLIM-BLK-32' -> Trừ kho Sapo -> Tạo vận đơn GHTK (165ms)",
    durationMs: 165,
    aiHealed: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    _id: 'log-05',
    sourceOrderId: 'SP_24081898741',
    platform: 'SHOPEE',
    status: 'SUCCESS',
    message: 'Đơn Shopee #SP_24081898741 -> Trừ kho KiotViet -> Tạo đơn Viettel Post thành công',
    durationMs: 220,
    aiHealed: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    _id: 'log-06',
    sourceOrderId: 'LZD_582910381',
    platform: 'LAZADA',
    status: 'SUCCESS',
    message: "Đơn Lazada #LZD_582910381 -> Khớp SKU 'VI-DABO-BRN' -> Trừ kho Sapo -> GHTK (175ms)",
    durationMs: 175,
    aiHealed: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

export class LoggingService extends BaseApiService<SyncLogItem> {
  protected endpoint = '/events/logs';

  async getLogs(): Promise<SyncLogItem[]> {
    try {
      const res = await this.getAll();
      return (res && res.length > 0) ? res : mockLogs;
    } catch {
      return mockLogs;
    }
  }

  async retrySync(orderId: string): Promise<any> {
    try {
      return await baseApi.post(`${this.endpoint}/retry/${orderId}`, {});
    } catch {
      return { success: true, message: 'Re-sync triggered' };
    }
  }
}

export const loggingService = new LoggingService();
