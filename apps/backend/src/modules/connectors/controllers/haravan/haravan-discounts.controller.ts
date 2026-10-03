import { Controller, Post, Get, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanPriceRuleDto,
  HaravanDiscountCodeDto,
  HaravanCreateDiscountDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 17. PRICE RULE RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 17. Price Rule')
@Controller('api/v1/infra/haravan')
export class HaravanPriceRulesController {
  @ApiOperation({
    summary: '[POST /com/price_rules.json] Tạo quy tắc giá và chiết khấu (Price Rule)',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/price_rules.json | Docs: https://docs.haravan.com/docs/omni-apis/discount/price-rules/ | Định nghĩa chương trình giảm giá tự động hoặc mã coupon',
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
    summary: '[GET /com/price_rules.json] Danh sách quy tắc giá khuyến mãi',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/price_rules.json | Tra cứu tất cả chương trình chiết khấu đang chạy',
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
    summary: '[GET /com/price_rules/:id.json] Chi tiết quy tắc giá',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/price_rules/{id}.json | Xem chi tiết điều kiện áp dụng',
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
    summary: '[DELETE /com/price_rules/:id.json] Xóa quy tắc giá',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/price_rules/{id}.json | Hủy bỏ chương trình khuyến mãi',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '101' })
  @Delete('com/price_rules/:id.json')
  async deletePriceRule(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 18. DISCOUNT CODE RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 18. DiscountCode')
@Controller('api/v1/infra/haravan')
export class HaravanDiscountCodesController {
  @ApiOperation({
    summary: '[POST /com/price_rules/:price_rule_id/discount_codes.json] Tạo mã coupon giảm giá cụ thể',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/price_rules/{price_rule_id}/discount_codes.json | Sinh mã coupon để khách nhập khi checkout',
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
        usage_count: 0,
        usage_limit: dto.usage_limit || 100,
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/price_rules/:price_rule_id/discount_codes.json] Danh sách mã coupon của Price Rule',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/price_rules/{price_rule_id}/discount_codes.json | Lấy danh sách mã giảm giá',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'price_rule_id', example: '101' })
  @Get('com/price_rules/:price_rule_id/discount_codes.json')
  async listDiscountCodes(@Param('price_rule_id') priceRuleId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      discount_codes: [
        { id: 901, price_rule_id: Number(priceRuleId), code: 'XUAN2026_VIP', usage_count: 14 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/price_rules/:price_rule_id/discount_codes/:id.json] Xóa mã giảm giá',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/price_rules/{price_rule_id}/discount_codes/{id}.json | Hủy mã coupon',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'price_rule_id', example: '101' })
  @ApiParam({ name: 'id', example: '901' })
  @Delete('com/price_rules/:price_rule_id/discount_codes/:id.json')
  async deleteDiscountCode(@Param('price_rule_id') priceRuleId: string, @Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 19. PROMOTION RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 19. Promotion')
@Controller('api/v1/infra/haravan')
export class HaravanPromotionsController {
  @ApiOperation({
    summary: '[POST /com/promotions.json] Khởi tạo chương trình khuyến mại Haravan',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/promotions.json | Tạo chương trình ưu đãi mua X tặng Y hoặc chiết khấu giỏ hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateDiscountDto })
  @Post('com/promotions.json')
  async createPromotion(@Body() dto: HaravanCreateDiscountDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      promotion: {
        id: Date.now(),
        code: dto.code,
        discount_type: dto.discount_type,
        value: dto.value,
        min_order_amount: dto.min_order_amount,
        status: 'enabled',
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/promotions.json] Danh sách chương trình khuyến mãi',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/promotions.json | Lấy danh sách khuyến mại đang kích hoạt',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/promotions.json')
  async listPromotions(@Headers('x-uniflow-mode') mode?: string) {
    return {
      promotions: [
        { id: 301, code: 'HARAVAN_TET2026', discount_type: 'percentage', value: 20, status: 'enabled' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/promotions/:id.json] Hủy chương trình khuyến mãi',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/promotions/{id}.json | Tắt hoặc xóa chương trình khuyến mãi',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '301' })
  @Delete('com/promotions/:id.json')
  async deletePromotion(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}
