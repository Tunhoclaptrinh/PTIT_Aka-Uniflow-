import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  NhanhWebhookSubscribeDto,
  NhanhWebhookDeleteDto,
} from '../../dto/pos-nhanh.dto';

@ApiTags('[02. POS-Nhanh] 11. Webhooks sự kiện (Webhooks)')
@Controller('api/v1/infra/nhanh')
export class NhanhWebhooksController {

  @ApiOperation({
    summary: '[POST /api/webhook/subscribe] Đăng ký Webhook Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/webhook/subscribe | Docs: https://developers.nhanh.group/pos/webhooks/subscribe | Đăng ký callback URL nhận sự kiện realtime từ Nhanh.vn',
  })
  @ApiBody({ type: NhanhWebhookSubscribeDto })
  @Post('api/webhook/subscribe')
  async subscribeWebhook(@Body() dto: NhanhWebhookSubscribeDto) {
    return {
      code: 1,
      data: {
        webhookId: Date.now().toString().slice(-4),
        webhookUrl: dto.webhookUrl,
        events: dto.events,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/webhook/list] Danh sách Webhook đã đăng ký Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/webhook/list | Docs: https://developers.nhanh.group/pos/webhooks/list | Tra cứu danh sách webhook đang hoạt động',
  })
  @Post('api/webhook/list')
  async listWebhooks() {
    return {
      code: 1,
      data: [
        {
          webhookId: 991,
          webhookUrl: 'https://gateway.uniflow.vn/api/v1/webhooks/nhanh',
          events: ['order.add', 'order.updateStatus', 'inventory.change'],
          status: 'ACTIVE',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /api/webhook/delete] Hủy đăng ký Webhook Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/webhook/delete | Docs: https://developers.nhanh.group/pos/webhooks/delete | Hủy đăng ký webhook URL',
  })
  @ApiBody({ type: NhanhWebhookDeleteDto })
  @Post('api/webhook/delete')
  async deleteWebhook(@Body() dto: NhanhWebhookDeleteDto) {
    return {
      code: 1,
      data: {
        webhookId: dto.webhookId,
        deleted: true,
        message: `Đã hủy webhook #${dto.webhookId} thành công`,
        updated_at: new Date().toISOString(),
      },
    };
  }
}
