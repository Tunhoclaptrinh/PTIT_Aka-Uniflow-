import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsGateway } from '../websocket/events.gateway';
import { SyncEventLog, SyncEventLogDocument } from '../../database/schemas/sync-event-log.schema';

/**
 * GHN Webhook Controller
 * Nhận callback cập nhật trạng thái vận đơn từ GHN
 *
 * Đăng ký URL với GHN qua: api@ghn.vn
 * Payload GHN sẽ POST tới: POST /api/v1/webhooks/ghn
 *
 * GHN yêu cầu response 200 trong vòng 2s, nếu không sẽ retry 10 lần cách 5s
 */
@Controller('api/v1/webhooks')
export class GHNWebhookController {
  private readonly logger = new Logger(GHNWebhookController.name);

  constructor(
    private readonly wsGateway: EventsGateway,
    @InjectModel(SyncEventLog.name) private readonly logModel: Model<SyncEventLogDocument>,
  ) {}

  @Post('ghn')
  @HttpCode(HttpStatus.OK) // GHN bắt buộc phải return 200, không thì retry
  async handleGHNCallback(@Body() payload: any) {
    const orderCode = payload?.OrderCode || payload?.order_code || 'UNKNOWN';
    const status = payload?.Status || payload?.status || 'UNKNOWN';
    const durationMs = 0;

    this.logger.log(`[GHN Webhook] Vận đơn ${orderCode} → ${status}`);

    const msg = `GHN: ${orderCode} → ${status}`;

    // Lưu log vào MongoDB
    try {
      await this.logModel.create({
        tenantId: '66c0e812a1b2c3d4e5f60001', // Có thể map bằng orderCode về tenantId
        platform: 'GHN',
        sourceOrderId: orderCode,
        status: 'COMPLETED',
        durationMs,
        message: msg,
        rawPayload: payload,
      });
    } catch (err: any) {
      this.logger.warn(`[GHN] Lưu log thất bại: ${err.message}`);
    }

    // Đẩy lên Dashboard realtime qua WebSocket
    this.wsGateway.emitLiveFeed({
      id: `ghn_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      tenantId: '66c0e812a1b2c3d4e5f60001',
      platform: 'GHN' as any,
      sourceOrderId: orderCode,
      status: 'COMPLETED' as any,
      durationMs,
      message: msg,
    });

    // PHẢI return code 200 — GHN sẽ retry nếu không nhận được
    return { code: 200, message: 'SUCCESS' };
  }
}
