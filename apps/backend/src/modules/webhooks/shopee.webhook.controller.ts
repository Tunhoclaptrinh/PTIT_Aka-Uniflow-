import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { EventsGateway } from '../websocket/events.gateway';
import { PlatformType, WebhookProcessingStatus } from '@uniflow/shared-types';

@Controller('api/v1/webhooks')
export class ShopeeWebhookController {
  private readonly logger = new Logger(ShopeeWebhookController.name);

  constructor(private readonly wsGateway: EventsGateway) {}

  @Post('shopee/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleShopeePush(
    @Param('tenantId') tenantId: string,
    @Body() payload: any
  ): Promise<{ code: number; message: string }> {
    const startTime = Date.now();
    const ordersn = payload?.data?.ordersn || `SP_${Date.now()}`;

    this.logger.log(`[Shopee Push Inbound] Nhận thông báo đơn ${ordersn} từ Tenant ${tenantId}`);

    // Bắn sự kiện thời gian thực lên Dashboard
    const durationMs = Date.now() - startTime;
    this.wsGateway.emitLiveFeed({
      id: `evt_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      tenantId,
      platform: PlatformType.SHOPEE,
      sourceOrderId: ordersn,
      status: WebhookProcessingStatus.RECEIVED,
      durationMs,
      message: `Nhận tín hiệu Push Shopee #${ordersn} -> Kích hoạt Worker lấy chi tiết đơn hàng`,
    });

    return {
      code: 0,
      message: 'SUCCESS',
    };
  }
}
