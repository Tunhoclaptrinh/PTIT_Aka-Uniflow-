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
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityService } from '../../security/security.service';
import { EventsGateway } from '../websocket/events.gateway';
import { UDMNormalizerService } from '../normalizer/udm-normalizer.service';
import { PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';
import { SyncEventLog, SyncEventLogDocument } from '../../database/schemas/sync-event-log.schema';

@Controller('api/v1/webhooks')
export class SapoWebhookController {
  private readonly logger = new Logger(SapoWebhookController.name);

  constructor(
    private readonly securityService: SecurityService,
    private readonly wsGateway: EventsGateway,
    private readonly normalizer: UDMNormalizerService,
    @InjectModel(SyncEventLog.name) private readonly logModel: Model<SyncEventLogDocument>,
  ) {}

  @Post('sapo/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleSapoWebhook(
    @Param('tenantId') tenantId: string,
    @Headers('x-sapo-hmac-sha256') hmacHeader: string,
    @Headers('x-sapo-topic') topicHeader: string,
    @Req() req: Request,
    @Body() payload: any,
  ): Promise<{ status: string; message: string }> {
    const startTime = Date.now();
    const webhookSecret = process.env.SAPO_WEBHOOK_SECRET || 'sapo_default_hmac_secret';

    this.logger.log(`[Sapo Webhook Inbound] Nhận sự kiện '${topicHeader}' từ Tenant ${tenantId}`);

    // Xác thực chữ ký số HMAC-SHA256 khi chạy production
    if (process.env.NODE_ENV === 'production' && hmacHeader) {
      const rawBody = (req as any).rawBody || JSON.stringify(payload);
      const isValid = this.securityService.verifySapoHmac(rawBody, hmacHeader, webhookSecret);
      if (!isValid) {
        this.logger.warn(`[Sapo Webhook] Chữ ký HMAC không hợp lệ cho Tenant ${tenantId}`);
        throw new UnauthorizedException('Invalid Sapo HMAC signature');
      }
    }

    const orderData = payload?.order || payload;
    const orderId = String(orderData?.id || orderData?.order_number || Date.now());

    // Chuẩn hóa sang UDM
    const udmResult = this.normalizer.normalizeSapoWebhookOrder(tenantId, payload);

    // Ghi Log Audit và bắn WebSocket
    await this.logModel.create({
      tenantId,
      platform: PlatformType.SAPO,
      eventType: topicHeader || 'orders/create',
      orderId,
      status: WebhookProcessingStatus.COMPLETED,
      latencyMs: Date.now() - startTime,
      payload: orderData,
    }).catch(() => null);

    this.wsGateway.emitLiveFeed({
      id: `live_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tenantId,
      platform: PlatformType.SAPO,
      sourceOrderId: orderId,
      status: WebhookProcessingStatus.COMPLETED,
      durationMs: Date.now() - startTime,
      message: `Đơn hàng Sapo #${orderId} đồng bộ thành công`,
      rawLog: udmResult,
    });

    return { status: 'success', message: 'Sapo webhook processed & normalized to UDM' };
  }
}
