import { Controller, Post, Get, Delete, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiHeader } from '@nestjs/swagger';
import { HaravanWebhookSubscribeDto } from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 28. WEBHOOK RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 28. Webhook')
@Controller('api/v1/infra/haravan')
export class HaravanWebhooksController {
  @ApiOperation({
    summary: '[POST /com/webhooks.json] Đăng ký Webhook Haravan mới',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/webhooks.json | Docs: https://docs.haravan.com/docs/omni-apis/webhooks/ | Đăng ký nhận webhook realtime khi có phát sinh đơn hàng, sản phẩm, tồn kho từ Haravan.',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanWebhookSubscribeDto })
  @Post('com/webhooks.json')
  async subscribeWebhook(@Body() dto: HaravanWebhookSubscribeDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      webhook: {
        id: Date.now(),
        address: dto.address,
        topic: dto.topic,
        format: dto.format || 'json',
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/webhooks.json] Danh sách webhook đã đăng ký',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/webhooks.json | Lấy tất cả các webhook topic đang lắng nghe sự kiện từ Haravan shop.',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/webhooks.json')
  async listWebhooks(@Headers('x-uniflow-mode') mode?: string) {
    return {
      webhooks: [
        {
          id: 1098234,
          address: 'https://gateway.uniflow.vn/api/v1/webhooks/haravan',
          topic: 'orders/create',
          format: 'json',
          created_at: new Date().toISOString(),
        },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/webhooks/:id.json] Hủy đăng ký webhook',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/webhooks/{id}.json | Xóa webhook listener khỏi cửa hàng Haravan.',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1098234', description: 'ID webhook Haravan cần hủy' })
  @Delete('com/webhooks/:id.json')
  async deleteWebhook(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: id, message: `Đã hủy webhook Haravan #${id}`, mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[GET /com/webhooks/topics.json] Danh sách các sự kiện Topic Haravan hỗ trợ',
    description: 'Trả về danh sách topic Haravan webhook chuẩn: orders/create, orders/updated, products/create, inventory_levels/update...',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/webhooks/topics.json')
  async getWebhookTopics(@Headers('x-uniflow-mode') mode?: string) {
    return {
      topics: [
        'orders/create',
        'orders/updated',
        'orders/cancelled',
        'orders/fulfilled',
        'products/create',
        'products/update',
        'products/delete',
        'inventory_levels/update',
        'customers/create',
        'customers/update',
      ],
      mode: mode || 'SANDBOX',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 29. EVENT RESOURCE (AUDIT LOGS)
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 29. Event')
@Controller('api/v1/infra/haravan')
export class HaravanEventsController {
  @ApiOperation({
    summary: '[GET /com/events.json] Nhật ký sự kiện hệ thống Haravan (Audit Log)',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/events.json | Docs: https://docs.haravan.com/docs/omni-apis/event/ | Lấy danh sách lịch sử tác vụ và biến động đơn hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/events.json')
  async listEvents(@Headers('x-uniflow-mode') mode?: string) {
    return {
      events: [
        { id: 98101, subject_type: 'Order', subject_id: 1001, verb: 'confirmed', message: 'Order #HRV1001 was confirmed.', created_at: new Date().toISOString() },
        { id: 98102, subject_type: 'Product', subject_id: 881290, verb: 'update', message: 'Product price updated.', created_at: new Date().toISOString() },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[GET /com/events/:id.json] Chi tiết sự kiện hệ thống',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/events/{id}.json | Lấy chi tiết payload của sự kiện',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '98101' })
  @Get('com/events/:id.json')
  async getEventById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      event: { id: Number(id), subject_type: 'Order', subject_id: 1001, verb: 'confirmed', message: 'Order #HRV1001 was confirmed.', mode: mode || 'SANDBOX' },
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 30. SHOP PROPERTIES RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 30. Shop & Properties')
@Controller('api/v1/infra/haravan')
export class HaravanShopPropertiesController {
  @ApiOperation({
    summary: '[GET /com/shop.json] Thông tin cấu hình cửa hàng Haravan (Shop Profile)',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/shop.json | Docs: https://docs.haravan.com/docs/omni-apis/shop/ | Tra cứu tên gian hàng, email chủ shop, đơn vị tiền tệ, múi giờ',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/shop.json')
  async getShopProfile(@Headers('x-uniflow-mode') mode?: string) {
    return {
      shop: {
        id: 778899,
        name: 'UniFlow Flagship Store',
        email: 'admin@uniflow.vn',
        domain: 'uniflow.myharavan.com',
        province: 'Thành phố Hồ Chí Minh',
        country: 'Vietnam',
        country_code: 'VN',
        currency: 'VND',
        timezone: '(GMT+07:00) Hanoi, Jakarta',
        plan_name: 'Advanced Omnichannel',
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/countries.json] Danh sách quốc gia & tỉnh thành vận chuyển',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/countries.json | Danh mục địa giới hành chính cấu hình trên Haravan',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/countries.json')
  async listCountries(@Headers('x-uniflow-mode') mode?: string) {
    return {
      countries: [
        {
          id: 241,
          name: 'Vietnam',
          code: 'VN',
          tax: 0.1,
          provinces: [
            { id: 1, name: 'Hồ Chí Minh', code: 'HC' },
            { id: 2, name: 'Hà Nội', code: 'HN' },
            { id: 3, name: 'Đà Nẵng', code: 'DN' },
          ],
        },
      ],
      mode: mode || 'SANDBOX',
    };
  }
}
