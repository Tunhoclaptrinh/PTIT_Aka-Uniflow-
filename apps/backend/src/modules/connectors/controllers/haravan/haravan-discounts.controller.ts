import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanPriceRuleDto,
  HaravanDiscountCodeDto,
  HaravanCreateDiscountDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 5. DISCOUNTS CATEGORY (Price Rules, Discount Codes, Promotions)
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 05. Discounts (Khuyến mãi & Mã giảm giá)')
@Controller('api/v1/infra/haravan')
export class HaravanPriceRulesController {
  @ApiOperation({
    summary: '[Price Rule - Quy tắc giá] [POST /com/price_rules.json] Tạo quy tắc giá và chiết khấu (Price Rule)',
    description: '[Thuộc danh mục: 05. Discounts > Quy tắc giá] Endpoint gốc: POST https://apis.haravan.com/com/price_rules.json | Docs: https://docs.haravan.com/docs/omni-apis/discount/price-rules/ | Định nghĩa chương trình giảm giá tự động hoặc mã coupon',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanPriceRuleDto })
  @Post('com/price_rules.json')
  async createPriceRule(@Body() dto: HaravanPriceRuleDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      price_rule: {
        id: Date.now(),
        title: dto.title,
        value_type: dto.value_type,
        value: dto.value,
        starts_at: dto.starts_at,
        ends_at: dto.ends_at,
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Price Rule - Quy tắc giá] [GET /com/price_rules.json] Danh sách quy tắc giá khuyến mãi',
    description: '[Thuộc danh mục: 05. Discounts > Quy tắc giá] Endpoint gốc: GET https://apis.haravan.com/com/price_rules.json | Tra cứu tất cả chương trình chiết khấu đang chạy',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/price_rules.json')
  async listPriceRules(@Headers('x-uniflow-mode') mode?: string) {
    return {
      price_rules: [
        { id: 101, title: 'Khuyến mãi Khai Xuân 2026', value_type: 'percentage', value: -15, starts_at: '2026-01-01T00:00:00Z', ends_at: '2026-02-28T23:59:59Z' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Price Rule - Quy tắc giá] [GET /com/price_rules/:id.json] Chi tiết quy tắc giá',
    description: '[Thuộc danh mục: 05. Discounts > Quy tắc giá] Endpoint gốc: GET https://apis.haravan.com/com/price_rules/{id}.json | Xem chi tiết điều kiện áp dụng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '101' })
  @Get('com/price_rules/:id.json')
  async getPriceRuleById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      price_rule: { id: Number(id), title: 'Khuyến mãi Khai Xuân 2026', value_type: 'percentage', value: -15, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Price Rule - Quy tắc giá] [PUT /com/price_rules/:id.json] Cập nhật quy tắc giá',
    description: '[Thuộc danh mục: 05. Discounts > Quy tắc giá] Endpoint gốc: PUT https://apis.haravan.com/com/price_rules/{id}.json | Sửa thông tin quy tắc giá',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '101' })
  @ApiBody({ type: HaravanPriceRuleDto })
  @Put('com/price_rules/:id.json')
  async updatePriceRule(@Param('id') id: string, @Body() dto: HaravanPriceRuleDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      price_rule: { id: Number(id), title: dto.title, value: dto.value, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Price Rule - Quy tắc giá] [DELETE /com/price_rules/:id.json] Xóa quy tắc giá',
    description: '[Thuộc danh mục: 05. Discounts > Quy tắc giá] Endpoint gốc: DELETE https://apis.haravan.com/com/price_rules/{id}.json | Xóa quy tắc chiết khấu',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '101' })
  @Delete('com/price_rules/:id.json')
  async deletePriceRule(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// DISCOUNT CODES SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 05. Discounts (Khuyến mãi & Mã giảm giá)')
@Controller('api/v1/infra/haravan')
export class HaravanDiscountCodesController {
  @ApiOperation({
    summary: '[Discount Code - Mã coupon] [POST /com/price_rules/:price_rule_id/discount_codes.json] Tạo mã giảm giá (Discount Code)',
    description: '[Thuộc danh mục: 05. Discounts > Mã coupon giảm giá] Endpoint gốc: POST https://apis.haravan.com/com/price_rules/{price_rule_id}/discount_codes.json | Tạo mã coupon nhập tay',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'price_rule_id', example: '101' })
  @ApiBody({ type: HaravanDiscountCodeDto })
  @Post('com/price_rules/:price_rule_id/discount_codes.json')
  async createDiscountCode(@Param('price_rule_id') priceRuleId: string, @Body() dto: HaravanDiscountCodeDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      discount_code: {
        id: Date.now(),
        price_rule_id: Number(priceRuleId),
        code: dto.code,
        usage_limit: dto.usage_limit || 100,
        usage_count: 0,
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Discount Code - Mã coupon] [GET /com/price_rules/:price_rule_id/discount_codes.json] Danh sách mã coupon của quy tắc giá',
    description: '[Thuộc danh mục: 05. Discounts > Mã coupon giảm giá] Endpoint gốc: GET https://apis.haravan.com/com/price_rules/{price_rule_id}/discount_codes.json | Tra cứu danh sách mã coupon',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'price_rule_id', example: '101' })
  @Get('com/price_rules/:price_rule_id/discount_codes.json')
  async listDiscountCodes(@Param('price_rule_id') priceRuleId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      discount_codes: [
        { id: 201, price_rule_id: Number(priceRuleId), code: 'XUAN2026', usage_count: 14, usage_limit: 500 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Discount Code - Mã coupon] [PUT /com/price_rules/:price_rule_id/discount_codes/:id.json] Cập nhật mã giảm giá',
    description: '[Thuộc danh mục: 05. Discounts > Mã coupon giảm giá] Endpoint gốc: PUT https://apis.haravan.com/com/price_rules/{price_rule_id}/discount_codes/{id}.json | Sửa mã hoặc giới hạn lượt dùng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'price_rule_id', example: '101' })
  @ApiParam({ name: 'id', example: '201' })
  @ApiBody({ type: HaravanDiscountCodeDto })
  @Put('com/price_rules/:price_rule_id/discount_codes/:id.json')
  async updateDiscountCode(@Param('price_rule_id') priceRuleId: string, @Param('id') id: string, @Body() dto: HaravanDiscountCodeDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      discount_code: { id: Number(id), code: dto.code, usage_limit: dto.usage_limit, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Discount Code - Mã coupon] [DELETE /com/price_rules/:price_rule_id/discount_codes/:id.json] Xóa mã giảm giá',
    description: '[Thuộc danh mục: 05. Discounts > Mã coupon giảm giá] Endpoint gốc: DELETE https://apis.haravan.com/com/price_rules/{price_rule_id}/discount_codes/{id}.json | Xóa mã coupon',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'price_rule_id', example: '101' })
  @ApiParam({ name: 'id', example: '201' })
  @Delete('com/price_rules/:price_rule_id/discount_codes/:id.json')
  async deleteDiscountCode(@Param('price_rule_id') priceRuleId: string, @Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), price_rule_id: Number(priceRuleId), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// PROMOTIONS SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 05. Discounts (Khuyến mãi & Mã giảm giá)')
@Controller('api/v1/infra/haravan')
export class HaravanPromotionsController {
  @ApiOperation({
    summary: '[Promotion - Chương trình khuyến mại] [POST /com/promotions.json] Khởi tạo chương trình khuyến mại',
    description: '[Thuộc danh mục: 05. Discounts > Chương trình khuyến mại] Endpoint gốc: POST https://apis.haravan.com/com/promotions.json | Docs: https://docs.haravan.com/docs/omni-apis/discount/promotions/ | Thiết lập chương trình giảm giá combo / tặng quà',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateDiscountDto })
  @Post('com/promotions.json')
  async createPromotion(@Body() dto: HaravanCreateDiscountDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      promotion: {
        id: Date.now(),
        name: dto.name,
        discount_type: dto.discount_type,
        value: dto.value,
        status: 'active',
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Promotion - Chương trình khuyến mại] [GET /com/promotions.json] Danh sách chương trình khuyến mãi',
    description: '[Thuộc danh mục: 05. Discounts > Chương trình khuyến mại] Endpoint gốc: GET https://apis.haravan.com/com/promotions.json | Tra cứu chương trình khuyến mại',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/promotions.json')
  async listPromotions(@Headers('x-uniflow-mode') mode?: string) {
    return {
      promotions: [
        { id: 501, name: 'Mua 2 tặng 1 Polo', discount_type: 'buy_x_get_y', status: 'active', created_at: new Date().toISOString() },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Promotion - Chương trình khuyến mại] [GET /com/promotions/:id.json] Chi tiết chương trình khuyến mãi',
    description: '[Thuộc danh mục: 05. Discounts > Chương trình khuyến mại] Endpoint gốc: GET https://apis.haravan.com/com/promotions/{id}.json | Xem chi tiết điều kiện khuyến mãi',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '501' })
  @Get('com/promotions/:id.json')
  async getPromotionById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      promotion: { id: Number(id), name: 'Mua 2 tặng 1 Polo', status: 'active', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Discount Status - Kích hoạt] [PUT /com/discounts/:id/enable.json] Bật kích hoạt khuyến mãi Haravan',
    description: '[Thuộc danh mục: 05. Discounts > Trạng thái kích hoạt] Endpoint gốc: PUT https://apis.haravan.com/com/discounts/{id}/enable.json | Kích hoạt chương trình khuyến mại',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '501' })
  @Put('com/discounts/:id/enable.json')
  async enablePromotion(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, promotion_id: Number(id), status: 'enabled', mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[Discount Status - Tạm ngưng] [PUT /com/discounts/:id/disable.json] Hủy kích hoạt khuyến mãi Haravan',
    description: '[Thuộc danh mục: 05. Discounts > Trạng thái kích hoạt] Endpoint gốc: PUT https://apis.haravan.com/com/discounts/{id}/disable.json | Tắt chương trình khuyến mại',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '501' })
  @Put('com/discounts/:id/disable.json')
  async disablePromotion(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, promotion_id: Number(id), status: 'disabled', mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[Promotion - Chương trình khuyến mại] [DELETE /com/promotions/:id.json] Xóa chương trình khuyến mãi',
    description: '[Thuộc danh mục: 05. Discounts > Chương trình khuyến mại] Endpoint gốc: DELETE https://apis.haravan.com/com/promotions/{id}.json | Xóa chương trình khuyến mại',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '501' })
  @Delete('com/promotions/:id.json')
  async deletePromotion(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}
