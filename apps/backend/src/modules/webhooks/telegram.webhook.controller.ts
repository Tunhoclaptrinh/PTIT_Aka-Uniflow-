import {
  Controller,
  Post,
  Param,
  Headers,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { SecurityService } from '../../security/security.service';
import { EventsGateway } from '../websocket/events.gateway';

@Controller('api/v1/webhooks')
export class TelegramWebhookController {
  private readonly logger = new Logger(TelegramWebhookController.name);

  constructor(
    private readonly securityService: SecurityService,
    private readonly wsGateway: EventsGateway,
  ) {}

  @Post('telegram/:tenantId')
  @HttpCode(HttpStatus.OK)
  async handleTelegramWebhook(
    @Param('tenantId') tenantId: string,
    @Headers('x-telegram-bot-api-secret-token') secretHeader: string,
    @Body() payload: any,
  ): Promise<{ ok: boolean }> {
    const expectedSecret = process.env.TELEGRAM_SECRET_TOKEN || 'telegram_bot_secret_default';

    if (process.env.NODE_ENV === 'production' && secretHeader) {
      const isValid = this.securityService.verifyTelegramSecret(secretHeader, expectedSecret);
      if (!isValid) {
        this.logger.warn(`[Telegram Webhook] Secret header không hợp lệ cho Tenant ${tenantId}`);
        throw new UnauthorizedException('Invalid Telegram secret token');
      }
    }

    const messageText = payload?.message?.text || '';
    const sender = payload?.message?.from?.username || 'Unknown';
    this.logger.log(`[Telegram Webhook Inbound] Nhận lệnh '${messageText}' từ @${sender}`);

    // Bắn realtime để hiển thị trên giao diện Copilot/Dashboard
    this.wsGateway.emitLiveFeed({
      id: `live_${Date.now()}`,
      timestamp: new Date().toISOString(),
      tenantId,
      platform: 'TELEGRAM' as any,
      sourceOrderId: 'N/A',
      status: 'COMPLETED' as any,
      durationMs: 10,
      message: `Nhận lệnh Telegram từ @${sender}: ${messageText}`,
      rawLog: payload,
    });

    return { ok: true };
  }
}
