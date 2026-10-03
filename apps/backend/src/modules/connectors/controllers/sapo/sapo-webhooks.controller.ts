import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { SapoWebhookSubscribeDto } from '../../dto/pos-sapo.dto';

// ── 1. Webhook Resource ──
@ApiTags('[02. POS-Sapo] 28. Webhook')
@Controller('api/v1/infra/sapo')
export class SapoWebhooksController {
  @ApiOperation({
    summary: '[POST /admin/webhooks.json] Đăng ký Webhook Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/webhooks.json | Docs: https://support.sapo.vn/gioi-thieu-api | Đăng ký callback URL nhận sự kiện realtime từ Sapo',
  })
  @ApiBody({ type: SapoWebhookSubscribeDto })
  @Post('admin/webhooks.json')
  async subscribeWebhook(@Body() dto: SapoWebhookSubscribeDto) {
    return {
      webhook: {
        id: Date.now(),
        address: dto.address,
        topic: dto.topic,
        format: dto.format || 'json',
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[GET /admin/webhooks.json] Danh sách Webhook đã đăng ký Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/webhooks.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tra cứu danh sách webhook đang hoạt động trên store',
  })
  @Get('admin/webhooks.json')
  async listWebhooks() {
    return {
      webhooks: [
        {
          id: 991,
          address: 'https://gateway.uniflow.vn/api/v1/webhooks/sapo',
          topic: 'orders/create',
          format: 'json',
          created_at: new Date().toISOString(),
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/webhooks/:id.json] Hủy đăng ký Webhook Sapo',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/webhooks/{id}.json | Docs: https://support.sapo.vn/gioi-thieu-api | Hủy đăng ký webhook URL',
  })
  @ApiParam({ name: 'id', example: '991' })
  @Delete('admin/webhooks/:id.json')
  async deleteWebhook(@Param('id') id: string) {
    return { success: true, deleted_id: id, message: `Đã hủy webhook Sapo #${id}` };
  }
}

// ── 2. Event Resource ──
@ApiTags('[02. POS-Sapo] 29. Event')
@Controller('api/v1/infra/sapo')
export class SapoEventsController {
  @ApiOperation({
    summary: '[GET /admin/events.json] Danh sách nhật ký sự kiện hệ thống',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/events.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tra cứu nhật ký sự kiện kiểm toán hệ thống (Event audit log: tạo đơn, cập nhật tồn, sửa giá)',
  })
  @Get('admin/events.json')
  async listEvents(@Query('limit') limit = 20) {
    return {
      events: [
        { id: 1001, subject_type: 'Order', verb: 'create', message: 'Đơn hàng #1001 vừa được khởi tạo bởi khách hàng', created_at: new Date().toISOString() },
        { id: 1002, subject_type: 'Product', verb: 'update', message: 'Sản phẩm #1001 được cập nhật giá bán', created_at: new Date().toISOString() },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /admin/events/:id.json] Chi tiết sự kiện hệ thống',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/events/{id}.json | Lấy chi tiết payload của một sự kiện log',
  })
  @Get('admin/events/:id.json')
  async getEventById(@Param('id') id: string) {
    return {
      event: { id: Number(id), subject_type: 'Order', verb: 'create', author: 'Sapo POS Cashier', created_at: new Date().toISOString() },
    };
  }
}
