import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { KiotVietWebhookDto } from '../../dto/pos-kiotviet.dto';

@ApiTags('[POS-KiotViet] 06. Webhooks (Webhooks)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietWebhooksController {

  @ApiOperation({
    summary: '[POST /webhook] Đăng ký Webhook KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/webhook | Docs: https://developer.kiotviet.vn/#/webhook | Đăng ký callback URL nhận sự kiện realtime từ KiotViet',
  })
  @ApiBody({ type: KiotVietWebhookDto })
  @Post('webhook')
  async registerWebhook(@Body() dto: KiotVietWebhookDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        type: dto.type,
        url: dto.webhookUrl,
        isActive: dto.isActive !== false,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[GET /webhook] Danh sách Webhook đã đăng ký KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/webhook | Docs: https://developer.kiotviet.vn/#/webhook | Tra cứu danh sách webhook đã cấu hình',
  })
  @Get('webhook')
  async listWebhooks() {
    return {
      data: [
        { id: 1, type: 'invoice.update', url: 'https://gateway.uniflow.vn/api/v1/webhooks/kiotviet', isActive: true },
        { id: 2, type: 'order.update', url: 'https://gateway.uniflow.vn/api/v1/webhooks/kiotviet', isActive: true },
      ],
    };
  }

  @ApiOperation({
    summary: '[DELETE /webhook/:id] Hủy Webhook KiotViet',
    description: 'Endpoint gốc: DELETE https://public.kiotapi.com/webhook/{id} | Docs: https://developer.kiotviet.vn/#/webhook | Hủy đăng ký webhook',
  })
  @ApiParam({ name: 'id', example: '1' })
  @Delete('webhook/:id')
  async deleteWebhook(@Param('id') id: string) {
    return { responseStatus: 'success', message: `Đã hủy webhook KiotViet #${id}` };
  }
}
