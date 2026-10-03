import {
  Controller,
  Post,
  Param,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityService } from '../../security/security.service';
import { EventsGateway } from '../websocket/events.gateway';
import { UDMNormalizerService } from '../normalizer/udm-normalizer.service';
import { PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';
import { SyncEventLog, SyncEventLogDocument } from '../../database/schemas/sync-event-log.schema';

@Controller('api/v1/webhooks')
export class NhanhWebhookController {
  private readonly logger = new Logger(NhanhWebhookController.name);

  constructor(
    private readonly securityService: SecurityService,
    private readonly wsGateway: EventsGateway,
    private readonly normalizer: UDMNormalizerService,
    @InjectModel(SyncEventLog.name) private readonly logModel: Model<SyncEventLogDocument>,
  ) {}

  @Post('nhanh/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleNhanhWebhook(
    @Param('tenantId') tenantId: string,
    @Body() payload: any,
  ): Promise<{ code: number; message: string }> {
    const startTime = Date.now();
    const expectedToken = process.env.NHANH_WEBHOOK_VERIFY_TOKEN || 'nhanh_verify_token_default';

    this.logger.log(`[Nhanh.vn Webhook Inbound] Nhận sự kiện '${payload?.event}' từ Tenant ${tenantId}`);

    // Xác thực webhooksVerifyToken trong Body khi production
    if (process.env.NODE_ENV === 'production' && payload?.webhooksVerifyToken) {
      const isValid = this.securityService.verifyNhanhToken(payload.webhooksVerifyToken, expectedToken);
      if (!isValid) {
        this.logger.warn(`[Nhanh Webhook] Verify token không hợp lệ cho Tenant ${tenantId}`);
        throw new UnauthorizedException('Invalid Nhanh.vn verify token');
      }
    }

    const orderId = String(payload?.data?.orderId || payload?.data?.partnerOrderId || Date.now());
    const eventType = payload?.event || 'orderUpdate';

    // Chuẩn hóa sang UDM
    const udmResult = this.normalizer.normalizeNhanhWebhookOrder(tenantId, payload);

    // Ghi Log Audit và bắn WebSocket
    await this.logModel.create({
      tenantId,
      platform: PlatformType.NHANH_VN,
      eventType,
      orderId,
      status: WebhookProcessingStatus.COMPLETED,
      latencyMs: Date.now() - startTime,
      payload: payload?.data,
    }).catch(() => null);

    this.wsGateway.emitLiveFeed({
      id: `live_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tenantId,
      platform: PlatformType.NHANH_VN,
      sourceOrderId: orderId,
      status: WebhookProcessingStatus.COMPLETED,
      durationMs: Date.now() - startTime,
      message: `Đơn hàng Nhanh.vn #${orderId} cập nhật: ${payload?.data?.status || 'UPDATED'}`,
      rawLog: udmResult,
    });

    return { code: 1, message: 'Nhanh.vn webhook processed & normalized to UDM' };
  }
}
