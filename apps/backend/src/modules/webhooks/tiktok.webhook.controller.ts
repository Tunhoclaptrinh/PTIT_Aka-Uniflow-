import {
  Controller,
  Post,
  Param,
  Headers,
  Req,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { SecurityService } from '../../security/security.service';
import { EventsGateway } from '../websocket/events.gateway';
import { UDMNormalizerService } from '../normalizer/udm-normalizer.service';
import { PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';

@Controller('api/v1/webhooks')
export class TikTokWebhookController {
  private readonly logger = new Logger(TikTokWebhookController.name);

  constructor(
    private readonly securityService: SecurityService,
    private readonly wsGateway: EventsGateway,
    private readonly normalizer: UDMNormalizerService
  ) {}

  @Post('tiktok/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleTikTokWebhook(
    @Param('tenantId') tenantId: string,
    @Headers('authorization') authHeader: string,
    @Headers('x-tts-signature') xTtsSig: string,
    @Req() req: Request,
    @Body() payload: any
  ): Promise<{ code: number; message: string }> {
    const startTime = Date.now();
    const signature = authHeader || xTtsSig;
    const webhookSecret = process.env.TIKTOK_WEBHOOK_SECRET || 'your_tiktok_webhook_hmac_secret';

    this.logger.log(`[TikTok Webhook Inbound] Nhận sự kiện từ Tenant ${tenantId}`);

    // 1. Xác thực Chữ ký số HMAC-SHA256
    const rawBody = JSON.stringify(payload);
    if (signature && process.env.NODE_ENV === 'production') {
      const isValid = this.securityService.verifyTikTokHmac(rawBody, signature, webhookSecret);
      if (!isValid) {
        this.logger.warn(`❌ HMAC Signature không hợp lệ cho Tenant: ${tenantId}`);
        throw new UnauthorizedException('Chữ ký số HMAC không hợp lệ');
      }
    }

    // 2. Chuyển đổi sang chuẩn UDM
    const udmOrder = this.normalizer.normalizeTikTokOrder(tenantId, payload);

    // 3. Bắn sự kiện thời gian thực lên Dashboard qua WebSocket
    const durationMs = Date.now() - startTime;
    this.wsGateway.emitLiveFeed({
      id: `evt_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      tenantId,
      platform: PlatformType.TIKTOK_SHOP,
      sourceOrderId: udmOrder.order.sourceOrderId,
      status: WebhookProcessingStatus.NORMALIZED,
      durationMs,
      message: `Đơn hàng TikTok #${udmOrder.order.sourceOrderId} đã chuẩn hóa UDM và chuyển tiếp Outbound`,
    });

    // 4. Trả HTTP 200 ngay lập tức trong vòng < 0.1s (SLA < 0.5s)
    return {
      code: 0,
      message: 'SUCCESS',
    };
  }
}
