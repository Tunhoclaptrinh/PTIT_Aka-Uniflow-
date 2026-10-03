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
import { Model } from 'mongoose';
import { EventsGateway } from '../websocket/events.gateway';
import { PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';
import { SyncEventLog, SyncEventLogDocument } from '../../database/schemas/sync-event-log.schema';

@Controller('api/v1/webhooks')
export class PancakeWebhookController {
  private readonly logger = new Logger(PancakeWebhookController.name);

  constructor(
    private readonly wsGateway: EventsGateway,
    @InjectModel(SyncEventLog.name) private readonly logModel: Model<SyncEventLogDocument>,
  ) {}

  @Post('pancake/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handlePancakeWebhook(
    @Param('tenantId') tenantId: string,
    @Body() payload: any,
  ): Promise<{ success: boolean; message: string }> {
    const startTime = Date.now();
    const eventType = payload?.type || payload?.event || 'order_update';
    const orderData = payload?.order || payload;
    const orderId = String(orderData?.id || orderData?.partner_id || Date.now());

    this.logger.log(`[Pancake Webhook Inbound] Nhận sự kiện '${eventType}' từ Tenant ${tenantId}`);

    // Ghi Log Audit
    await this.logModel.create({
      tenantId,
      platform: PlatformType.PANCAKE,
      eventType,
      orderId,
      status: WebhookProcessingStatus.COMPLETED,
      latencyMs: Date.now() - startTime,
      payload: orderData,
    }).catch(() => null);

    // Bắn realtime qua WebSocket
    this.wsGateway.emitLiveFeed({
      id: `live_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tenantId,
      platform: PlatformType.PANCAKE,
      sourceOrderId: orderId,
      status: WebhookProcessingStatus.COMPLETED,
      durationMs: Date.now() - startTime,
      message: `Đơn hàng Pancake #${orderId} cập nhật sự kiện ${eventType}`,
      rawLog: orderData,
    });

    return { success: true, message: 'Pancake webhook processed successfully' };
  }
}
