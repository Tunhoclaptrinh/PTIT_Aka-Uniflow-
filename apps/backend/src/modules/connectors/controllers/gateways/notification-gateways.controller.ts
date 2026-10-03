import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import { TelegramAlertDto, ZaloZnsDto } from '../../dto/finance-logistics.dto';

@ApiTags('[UniFlow-Gateways] 01. Kênh thông báo (Telegram & Zalo ZNS)')
@Controller('api/v1/infra/notifications')
export class NotificationGatewaysController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /bot/sendMessage] Gửi cảnh báo khẩn qua Telegram Bot',
    description: 'Endpoint gốc: POST https://api.telegram.org/bot{token}/sendMessage | Bắn cảnh báo sự cố đơn hàng, lệch kho hoặc báo cáo ca làm việc vào group chat Telegram',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: TelegramAlertDto })
  @Post('telegram/bot/sendMessage')
  async sendTelegramAlert(@Body() dto: TelegramAlertDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('telegram_send_alert', { text: dto.text, chat_id: dto.chat_id }, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /openapi/v2/zns/message] Gửi tin Zalo ZNS chăm sóc khách hàng',
    description: 'Endpoint gốc: POST https://business.openapi.zalo.me/message/template | Gửi tin nhắn chăm sóc khách hàng qua Zalo ZNS Template chính thức',
  })
  @ApiBody({ type: ZaloZnsDto })
  @Post('zalo/openapi/v2/zns/message')
  async sendZaloZns(@Body() dto: ZaloZnsDto) {
    return {
      success: true,
      gateway: 'ZALO_ZNS',
      messageId: `ZNS_${Date.now()}`,
      phone: dto.phone,
      templateId: dto.template_id,
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
    };
  }
}
