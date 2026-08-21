import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventsGateway } from '../websocket/events.gateway';
import { RedisService } from '../redis/redis.service';
import { SyncEventLog, SyncEventLogDocument } from '../../database/schemas/sync-event-log.schema';
import { PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';

/**
 * Lazada Webhook Controller
 * Nhận Push Notification từ Lazada Open Platform
 *
 * Đăng ký URL tại: https://open.lazada.com → App Management → Push
 * Lazada POST tới: POST /api/v1/webhooks/lazada/:tenantId
 */
@Controller('api/v1/webhooks')
export class LazadaWebhookController {
  private readonly logger = new Logger(LazadaWebhookController.name);

  constructor(
    private readonly wsGateway: EventsGateway,
    private readonly redisService: RedisService,
    @InjectModel(SyncEventLog.name) private readonly logModel: Model<SyncEventLogDocument>,
  ) {}

  @Post('lazada/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleLazadaWebhook(
    @Param('tenantId') tenantId: string,
    @Body() payload: any,
  ): Promise<{ code: number; message: string }> {
    const startTime = Date.now();

    const orderId: string =
      payload?.data?.orderId ||
      payload?.tradeOrderId ||
      `LZD_${Date.now()}`;

    this.logger.log(`[Lazada Webhook] Nhận sự kiện đơn ${orderId} từ Tenant ${tenantId}`);

    // Idempotency check — tránh xử lý đơn trùng
    const idempKey = `lazada:${tenantId}:${orderId}`;
    const { isDuplicate } = await this.redisService.checkAndSetIdempotency(idempKey, 86400);
    if (isDuplicate) {
      this.logger.warn(`⚠️ [Redis] Lazada đơn ${orderId} đã xử lý. Bỏ qua.`);
      return { code: 0, message: 'ORDER_ALREADY_PROCESSED' };
    }

    const tenantObjId = Types.ObjectId.isValid(tenantId)
      ? new Types.ObjectId(tenantId)
      : new Types.ObjectId('66c0e812a1b2c3d4e5f60001');

    const durationMs = Date.now() - startTime;
    const msg = `Đơn Lazada #${orderId} → Đã nhận và kích hoạt pipeline (${durationMs}ms)`;

    // Lưu log
    try {
      await this.logModel.create({
        tenantId: tenantObjId,
        platform: PlatformType.LAZADA,
        sourceOrderId: orderId,
        status: WebhookProcessingStatus.COMPLETED,
        durationMs,
        message: msg,
        rawPayload: payload,
      });
    } catch (err: any) {
      this.logger.warn(`[Lazada] Lưu log thất bại: ${err.message}`);
    }

    // Đẩy realtime lên Dashboard
    this.wsGateway.emitLiveFeed({
      id: `lazada_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      tenantId,
      platform: PlatformType.LAZADA,
      sourceOrderId: orderId,
      status: WebhookProcessingStatus.COMPLETED,
      durationMs,
      message: msg,
    });

    return { code: 0, message: 'SUCCESS' };
  }
}
