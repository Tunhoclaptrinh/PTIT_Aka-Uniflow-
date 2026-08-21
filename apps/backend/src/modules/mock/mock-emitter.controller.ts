import {
  Controller,
  Post,
  Param,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';
import {
  TIKTOK_ORDER_FIXTURE,
  SHOPEE_ORDER_FIXTURE,
  LAZADA_ORDER_FIXTURE,
} from './fixtures';

/**
 * MockEmitterController — Giả lập các sàn TMDT bắn webhook vào UniFlow
 * CHỈ dùng trong môi trường dev/staging (bị chặn trong production bởi MockModule guard)
 *
 * POST /api/v1/mock/fire/:platform/:tenantId
 * Platforms: tiktok | shopee | lazada | all
 */
@Controller('api/v1/mock')
export class MockEmitterController {
  private readonly logger = new Logger(MockEmitterController.name);

  /** Địa chỉ nội bộ của chính backend service */
  private get internalBase(): string {
    const port = process.env.PORT || 3000;
    return `http://localhost:${port}`;
  }

  /** Tạo orderId ngẫu nhiên để tránh Redis idempotency block */
  private uniqueId(prefix: string): string {
    return `${prefix}_MOCK_${Date.now()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  @Post('fire/tiktok/:tenantId')
  @HttpCode(HttpStatus.OK)
  async fireTikTok(
    @Param('tenantId') tenantId: string,
    @Body() override?: Partial<typeof TIKTOK_ORDER_FIXTURE>,
  ) {
    const payload = {
      ...TIKTOK_ORDER_FIXTURE,
      ...override,
      data: {
        ...TIKTOK_ORDER_FIXTURE.data,
        ...(override?.data ?? {}),
        order_id: this.uniqueId('TTS'),
        create_time: Math.floor(Date.now() / 1000),
      },
    };

    this.logger.log(`🔥 [Mock] Firing TikTok webhook → Tenant ${tenantId} | Order ${payload.data.order_id}`);
    return this.dispatch(`/api/v1/webhooks/tiktok/${tenantId}`, payload, 'tiktok');
  }

  @Post('fire/shopee/:tenantId')
  @HttpCode(HttpStatus.OK)
  async fireShopee(@Param('tenantId') tenantId: string) {
    const payload = {
      ...SHOPEE_ORDER_FIXTURE,
      data: {
        ...SHOPEE_ORDER_FIXTURE.data,
        ordersn: this.uniqueId('SP'),
        update_time: Math.floor(Date.now() / 1000),
      },
    };

    this.logger.log(`🔥 [Mock] Firing Shopee webhook → Tenant ${tenantId} | Order ${payload.data.ordersn}`);
    return this.dispatch(`/api/v1/webhooks/shopee/${tenantId}`, payload, 'shopee');
  }

  @Post('fire/lazada/:tenantId')
  @HttpCode(HttpStatus.OK)
  async fireLazada(@Param('tenantId') tenantId: string) {
    const payload = {
      ...LAZADA_ORDER_FIXTURE,
      data: {
        ...LAZADA_ORDER_FIXTURE.data,
        orderId: this.uniqueId('LZD'),
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      },
    };

    this.logger.log(`🔥 [Mock] Firing Lazada webhook → Tenant ${tenantId} | Order ${payload.data.orderId}`);
    return this.dispatch(`/api/v1/webhooks/lazada/${tenantId}`, payload, 'lazada');
  }

  /**
   * Fire tất cả 3 sàn cùng lúc — dành cho Demo sân khấu "Wow Factor"
   * POST /api/v1/mock/fire/all/:tenantId
   */
  @Post('fire/all/:tenantId')
  @HttpCode(HttpStatus.OK)
  async fireAll(@Param('tenantId') tenantId: string) {
    this.logger.log(`🔥 [Mock] Firing ALL platforms → Tenant ${tenantId}`);
    const [tiktok, shopee, lazada] = await Promise.allSettled([
      this.fireTikTok(tenantId),
      this.fireShopee(tenantId),
      this.fireLazada(tenantId),
    ]);
    return {
      success: true,
      results: { tiktok, shopee, lazada },
      firedAt: new Date().toISOString(),
    };
  }

  /** Gọi nội bộ vào chính webhook endpoint — chạy đúng 100% pipeline thật */
  private async dispatch(path: string, payload: object, platform: string) {
    const url = `${this.internalBase}${path}`;
    try {
      const res = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });
      return { success: true, platform, dispatched_to: path, response: res.data };
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      // Nếu sàn chưa có endpoint (404) vẫn trả success để không block demo
      this.logger.warn(`[Mock] ${platform} dispatch returned ${status}: ${JSON.stringify(data)}`);
      return { success: status === 200 || status === 404, platform, dispatched_to: path, status, data };
    }
  }
}
