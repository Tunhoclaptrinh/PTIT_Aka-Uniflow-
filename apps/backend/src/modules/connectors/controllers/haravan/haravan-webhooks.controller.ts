import { Controller, Post, Get, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiHeader } from '@nestjs/swagger';
import { HaravanWebhookSubscribeDto, HaravanOAuthTokenDto } from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 09. EVENTS CATEGORY (Nhật ký kiểm toán hệ thống)
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 09. Events (Nhật ký kiểm toán hệ thống)')
@Controller('api/v1/infra/haravan')
export class HaravanEventsController {
  @ApiOperation({
    summary: '[Event - Nhật ký kiểm toán] [GET /com/events.json] Nhật ký sự kiện hệ thống Haravan (Audit Log)',
    description: '[Thuộc danh mục: 09. Events > Nhật ký kiểm toán hệ thống] Endpoint gốc: GET https://apis.haravan.com/com/events.json | Docs: https://docs.haravan.com/docs/omni-apis/event/ | Lấy danh sách lịch sử tác vụ và biến động đơn hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/events.json')
  async listEvents(@Headers('x-uniflow-mode') mode?: string) {
    return {
      events: [
        {
          id: 501,
          subject_type: 'Order',
          verb: 'confirmed',
          subject_id: 1001,
          author: 'Haravan Admin',
          created_at: new Date().toISOString(),
          message: 'Đơn hàng HRV1001 đã được xác nhận tự động qua UniFlow.',
        },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Event - Nhật ký kiểm toán] [GET /com/events/:id.json] Chi tiết sự kiện kiểm toán',
    description: '[Thuộc danh mục: 09. Events > Nhật ký kiểm toán hệ thống] Endpoint gốc: GET https://apis.haravan.com/com/events/{id}.json | Xem chi tiết payload của sự kiện',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '501' })
  @Get('com/events/:id.json')
  async getEventById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      event: {
        id: Number(id),
        subject_type: 'Order',
        verb: 'confirmed',
        subject_id: 1001,
        author: 'Haravan Admin',
        body: 'Auto-confirm trigger fired',
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 10. STORE PROPERTIES CATEGORY (Shop Profile, Countries, Provinces)
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 10. Store properties (Cấu hình Shop & Khu vực)')
@Controller('api/v1/infra/haravan')
export class HaravanStorePropertiesController {
  @ApiOperation({
    summary: '[Shop - Hồ sơ gian hàng] [GET /com & /web/shop.json] Thông tin cấu hình gian hàng (Shop Profile)',
    description: '[Thuộc danh mục: 10. Store properties > Hồ sơ gian hàng] Endpoint gốc: GET https://apis.haravan.com/com/shop.json (hoặc /web/shop.json) | Docs: https://docs.haravan.com/docs/omni-apis/country/ | Trả về thông tin tên cửa hàng, múi giờ, tiền tệ, tên miền',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get(['com/shop.json', 'web/shop.json'])
  async getShopProfile(@Headers('x-uniflow-mode') mode?: string) {
    return {
      shop: {
        id: 889900,
        name: 'UniFlow Enterprise Flagship',
        email: 'support@uniflow.vn',
        domain: 'uniflow-flagship.myharavan.com',
        currency: 'VND',
        iana_timezone: 'Asia/Ho_Chi_Minh',
        country_name: 'Vietnam',
        plan_name: 'Omnichannel Enterprise',
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Country & Province - Địa lý] [GET /com/countries.json] Danh sách quốc gia và mã vùng hỗ trợ giao hàng',
    description: '[Thuộc danh mục: 10. Store properties > Địa lý và thuế quan] Endpoint gốc: GET https://apis.haravan.com/com/countries.json | Danh mục quốc gia trong cấu hình vận chuyển',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/countries.json')
  async listCountries(@Headers('x-uniflow-mode') mode?: string) {
    return {
      countries: [
        { id: 241, name: 'Vietnam', code: 'VN', tax: 0.1 },
        { id: 242, name: 'Singapore', code: 'SG', tax: 0.08 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Country & Province - Địa lý] [GET /com/countries/:country_id/provinces.json] Danh sách tỉnh thành của quốc gia',
    description: '[Thuộc danh mục: 10. Store properties > Địa lý và thuế quan] Endpoint gốc: GET https://apis.haravan.com/com/countries/{country_id}/provinces.json | Danh mục tỉnh thành',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'country_id', example: '241' })
  @Get('com/countries/:country_id/provinces.json')
  async listProvinces(@Param('country_id') countryId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      provinces: [
        { id: 1, country_id: Number(countryId), code: 'HN', name: 'Hà Nội' },
        { id: 2, country_id: Number(countryId), code: 'HC', name: 'Hồ Chí Minh' },
        { id: 3, country_id: Number(countryId), code: 'DN', name: 'Đà Nẵng' },
      ],
      mode: mode || 'SANDBOX',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 11. SUBSCRIPTION CATEGORY (Webhooks Realtime & Topics)
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 11. Subscription (Đăng ký Webhook & Sự kiện Realtime)')
@Controller('api/v1/infra/haravan')
export class HaravanWebhooksController {
  @ApiOperation({
    summary: '[Webhook - Đăng ký sự kiện] [POST /com/webhooks.json] Đăng ký Webhook Haravan mới',
    description: '[Thuộc danh mục: 11. Subscription > Đăng ký Webhook Realtime] Endpoint gốc: POST https://apis.haravan.com/com/webhooks.json | Docs: https://docs.haravan.com/docs/omni-apis/subscription/ | Đăng ký nhận webhook realtime khi có phát sinh đơn hàng, sản phẩm, tồn kho từ Haravan.',
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
    summary: '[Webhook - Đăng ký sự kiện] [GET /com/webhooks.json] Danh sách webhook đã đăng ký',
    description: '[Thuộc danh mục: 11. Subscription > Đăng ký Webhook Realtime] Endpoint gốc: GET https://apis.haravan.com/com/webhooks.json | Lấy tất cả các webhook topic đang lắng nghe sự kiện từ Haravan shop.',
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
    summary: '[Webhook - Đăng ký sự kiện] [GET /com/webhooks/:id.json] Chi tiết Webhook đã đăng ký',
    description: '[Thuộc danh mục: 11. Subscription > Đăng ký Webhook Realtime] Endpoint gốc: GET https://apis.haravan.com/com/webhooks/{id}.json | Xem thông tin một webhook',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1098234' })
  @Get('com/webhooks/:id.json')
  async getWebhookById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      webhook: { id: Number(id), topic: 'orders/create', address: 'https://gateway.uniflow.vn/api/v1/webhooks/haravan', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Webhook - Đăng ký sự kiện] [PUT /com/webhooks/:id.json] Cập nhật URL Webhook',
    description: '[Thuộc danh mục: 11. Subscription > Đăng ký Webhook Realtime] Endpoint gốc: PUT https://apis.haravan.com/com/webhooks/{id}.json | Thay đổi endpoint nhận webhook',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1098234' })
  @ApiBody({ type: HaravanWebhookSubscribeDto })
  @Put('com/webhooks/:id.json')
  async updateWebhook(@Param('id') id: string, @Body() dto: HaravanWebhookSubscribeDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      webhook: { id: Number(id), address: dto.address, topic: dto.topic, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Webhook - Đăng ký sự kiện] [DELETE /com/webhooks/:id.json] Hủy đăng ký webhook',
    description: '[Thuộc danh mục: 11. Subscription > Đăng ký Webhook Realtime] Endpoint gốc: DELETE https://apis.haravan.com/com/webhooks/{id}.json | Xóa webhook listener khỏi cửa hàng Haravan.',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1098234' })
  @Delete('com/webhooks/:id.json')
  async deleteWebhook(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: id, message: `Đã hủy webhook Haravan #${id}`, mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[Topic - Danh mục sự kiện] [GET /com/webhooks/topics.json] Danh sách các sự kiện Topic Haravan hỗ trợ',
    description: '[Thuộc danh mục: 11. Subscription > Danh mục sự kiện Webhook] Trả về danh sách topic Haravan webhook chuẩn: orders/create, orders/updated, products/create, inventory_levels/update...',
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
// 12. ACCESSSCOPE & AUTHENTICATION CATEGORY (OAuth 2.0 & Scopes)
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 12. AccessScope & Authentication (OAuth & Quyền truy cập)')
@Controller('api/v1/infra/haravan')
export class HaravanAccessScopesController {
  @ApiOperation({
    summary: '[AccessScope - Quyền ứng dụng] [GET /com/access_scopes.json] Danh sách quyền truy cập (AccessScopes)',
    description: '[Thuộc danh mục: 12. AccessScope & Authentication > Quyền ứng dụng AccessScope] Endpoint gốc: GET https://apis.haravan.com/com/access_scopes.json | Docs: https://docs.haravan.com/docs/omni-apis/access-scopes/ | Kiểm tra các scope ứng dụng đã được chủ shop cấp quyền',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get(['com/access_scopes.json', 'com/oauth/access_scopes.json', 'oauth/access_scopes.json'])
  async listAccessScopes(@Headers('x-uniflow-mode') mode?: string) {
    return {
      access_scopes: [
        { handle: 'com.read_orders' },
        { handle: 'com.write_orders' },
        { handle: 'com.read_products' },
        { handle: 'com.write_products' },
        { handle: 'com.read_inventories' },
        { handle: 'com.write_inventories' },
        { handle: 'com.read_customers' },
        { handle: 'com.write_customers' },
        { handle: 'com.read_shippings' },
        { handle: 'com.write_shippings' },
        { handle: 'web.read_contents' },
        { handle: 'web.write_contents' },
        { handle: 'web.read_themes' },
        { handle: 'web.write_themes' },
        { handle: 'web.read_script_tags' },
        { handle: 'web.write_script_tags' },
        { handle: 'wh_api' },
        { handle: 'grant_service' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[OAuth 2.0 - Xác thực & Cấp Token] [POST /connect/token] Cấp phát Access Token qua OAuth 2.0',
    description: '[Thuộc danh mục: 12. AccessScope & Authentication > Xác thực OAuth 2.0] Endpoint gốc: POST https://accounts.haravan.com/connect/token | Trao đổi authorization code hoặc refresh token để nhận access token gọi Haravan APIs',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanOAuthTokenDto })
  @Post(['connect/token', 'com/connect/token', 'oauth/token'])
  async exchangeToken(@Body() dto: HaravanOAuthTokenDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      access_token: `hrv_at_${Date.now()}_live_key`,
      token_type: 'Bearer',
      expires_in: 86400,
      refresh_token: `hrv_rt_${Date.now()}_secret`,
      scope: 'com.read_orders com.write_orders com.read_products com.write_products web.read_contents wh_api',
      mode: mode || 'SANDBOX',
    };
  }
}
