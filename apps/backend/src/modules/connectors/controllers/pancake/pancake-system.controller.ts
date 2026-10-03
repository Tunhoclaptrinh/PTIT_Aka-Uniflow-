import { Controller, Post, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PancakeRegisterWebhookDto, PancakePosWebhookConfigDto } from '../../dto/pos-pancake.dto';

@ApiTags('[02. POS-Pancake] 11. Shop, Geo, Employees & Webhooks (Cửa hàng, Địa giới, Nhân viên & Webhook)')
@Controller('api/v1/infra/pancake')
export class PancakeSystemController {

  // ════════════════════════════════════════════════════════════════
  // PANCAKE POS OPEN API SPECIFICATION (https://docs.pancake.biz/pos/api/)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Shop - Danh sách Shop] [GET /shops] Danh sách cửa hàng của tài khoản',
    description: '[Thuộc danh mục: 01. Shop > Thông tin Shop] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops | Docs: https://docs.pancake.biz/pos/api/ | Lấy danh sách các cửa hàng mà tài khoản API Key có quyền truy cập',
  })
  @Get('shops')
  async listShopsOfficial() {
    return {
      success: true,
      shops: [
        {
          id: '1092841',
          name: 'UniFlow Fashion Store',
          currency: 'VND',
          phone_number: '0981234567',
          address: 'Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
          timezone: 'Asia/Ho_Chi_Minh',
          is_active: true,
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Address - Tỉnh/Thành phố] [GET /geo/provinces] Danh mục Tỉnh/Thành phố Việt Nam',
    description: '[Thuộc danh mục: 02. Address > Danh mục Tỉnh/Thành] Endpoint gốc: GET https://pos.pages.fm/api/v1/geo/provinces | Chuẩn hóa địa chỉ giao nhận hàng',
  })
  @Get('geo/provinces')
  async listProvincesOfficial() {
    return {
      success: true,
      provinces: [
        { id: 1, name: 'Thành phố Hà Nội', code: 'HN' },
        { id: 79, name: 'Thành phố Hồ Chí Minh', code: 'HCM' },
        { id: 48, name: 'Thành phố Đà Nẵng', code: 'DN' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Address - Quận/Huyện] [GET /geo/districts] Danh mục Quận/Huyện theo Tỉnh/Thành',
    description: '[Thuộc danh mục: 02. Address > Danh mục Quận/Huyện] Endpoint gốc: GET https://pos.pages.fm/api/v1/geo/districts',
  })
  @ApiQuery({ name: 'province_id', example: '1', required: false })
  @Get('geo/districts')
  async listDistrictsOfficial(@Query('province_id') provinceId?: string) {
    return {
      success: true,
      province_id: provinceId || '1',
      districts: [
        { id: 1, name: 'Quận Ba Đình', province_id: Number(provinceId) || 1 },
        { id: 5, name: 'Quận Cầu Giấy', province_id: Number(provinceId) || 1 },
        { id: 6, name: 'Quận Đống Đa', province_id: Number(provinceId) || 1 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Address - Phường/Xã] [GET /geo/communes] Danh mục Phường/Xã theo Quận/Huyện',
    description: '[Thuộc danh mục: 02. Address > Danh mục Phường/Xã] Endpoint gốc: GET https://pos.pages.fm/api/v1/geo/communes',
  })
  @ApiQuery({ name: 'district_id', example: '5', required: false })
  @Get('geo/communes')
  async listCommunesOfficial(@Query('district_id') districtId?: string) {
    return {
      success: true,
      district_id: districtId || '5',
      communes: [
        { id: 101, name: 'Phường Dịch Vọng', district_id: Number(districtId) || 5 },
        { id: 102, name: 'Phường Yên Hòa', district_id: Number(districtId) || 5 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Employee - Danh sách nhân viên] [GET /shops/:shopId/users] Danh sách nhân viên cửa hàng',
    description: '[Thuộc danh mục: 28. Employee > Danh sách nhân viên] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/users | Quản lý phân quyền nhân viên bán hàng, thủ kho, kế toán',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/users')
  async listShopUsersOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      users: [
        { id: 'USR_01', name: 'Nguyễn Văn Quản Trị', role: 'ADMIN', email: 'admin@uniflow.vn' },
        { id: 'USR_02', name: 'Trần Thị Chốt Đơn', role: 'SALE', email: 'sale01@uniflow.vn' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Webhook - Cấu hình Webhook] [PUT /shops/:shopId] Cập nhật URL Webhook nhận sự kiện tự động',
    description: '[Thuộc danh mục: 29. Webhook > Cấu hình Webhook] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID} | Cấu hình callback URL cho các sự kiện đơn hàng và tồn kho realtime',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosWebhookConfigDto })
  @Put('shops/:shopId')
  async updateShopWebhookOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosWebhookConfigDto) {
    return {
      success: true,
      shop_id: shopId,
      webhook_url: dto.webhook_url,
      events: dto.events,
      updated_at: new Date().toISOString(),
    };
  }

  // ════════════════════════════════════════════════════════════════
  // BACKWARD COMPATIBILITY ENDPOINTS
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Legacy - Đăng ký Webhook] [POST /webhooks/subscribe] Đăng ký Webhook realtime Pancake',
    description: 'Cấu hình URL webhook nhận tin nhắn khách chat và sự kiện chốt đơn realtime từ Pancake',
  })
  @Post('webhooks/subscribe')
  async subscribeWebhook(@Body() dto: PancakeRegisterWebhookDto) {
    return {
      success: true,
      page_id: dto.page_id,
      webhook_url: dto.webhook_url,
      events: dto.events,
      subscribed_at: new Date().toISOString(),
    };
  }
}
