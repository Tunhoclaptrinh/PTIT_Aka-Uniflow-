import { Controller, Post, Get, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import { SapoCreateDiscountDto } from '../../dto/pos-sapo.dto';

// ── 1. Price Rule Resource ──
@ApiTags('[02. POS-Sapo] 16. Price Rule')
@Controller('api/v1/infra/sapo')
export class SapoPriceRulesController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /admin/price_rules.json] Tạo quy tắc giá (Price Rule) Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/price_rules.json | Docs: https://support.sapo.vn/gioi-thieu-api | Khởi tạo quy tắc giá / chiến dịch chiết khấu khuyến mãi',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoCreateDiscountDto })
  @Post('admin/price_rules.json')
  async createPriceRule(@Body() dto: SapoCreateDiscountDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_create_discount_code', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[GET /admin/price_rules.json] Danh sách quy tắc giá Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/price_rules.json | Tra cứu toàn bộ các quy tắc giá khuyến mãi đang hoạt động',
  })
  @Get('admin/price_rules.json')
  async listPriceRules() {
    return {
      price_rules: [
        { id: 101, title: 'Giảm 20% đơn từ 500k', value_type: 'percentage', value: -20, target_type: 'line_item', created_at: new Date().toISOString() },
        { id: 102, title: 'Giảm 50k phí ship', value_type: 'fixed_amount', value: -50000, target_type: 'shipping_line', created_at: new Date().toISOString() },
      ],
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/price_rules/:id.json] Xóa quy tắc giá Sapo',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/price_rules/{id}.json | Hủy bỏ quy tắc giá khuyến mãi',
  })
  @Delete('admin/price_rules/:id.json')
  async deletePriceRule(@Param('id') id: string) {
    return { success: true, deleted_id: id, message: `Đã xóa quy tắc giá #${id}` };
  }
}

// ── 2. DiscountCode Resource ──
@ApiTags('[02. POS-Sapo] 17. DiscountCode')
@Controller('api/v1/infra/sapo')
export class SapoDiscountCodesController {
  @ApiOperation({
    summary: '[POST /admin/price_rules/:price_rule_id/discount_codes.json] Tạo mã giảm giá (Discount Code)',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/price_rules/{price_rule_id}/discount_codes.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tạo mã code voucher cụ thể (VD: CHAOHE2026, VIP10) thuộc một Price Rule',
  })
  @Post('admin/price_rules/:price_rule_id/discount_codes.json')
  async createDiscountCode(@Param('price_rule_id') priceRuleId: string, @Body('code') code: string) {
    return {
      discount_code: {
        id: Date.now(),
        price_rule_id: Number(priceRuleId),
        code: code || `DISCOUNT_${Date.now()}`,
        usage_count: 0,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[GET /admin/price_rules/:price_rule_id/discount_codes.json] Danh sách mã giảm giá',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/price_rules/{price_rule_id}/discount_codes.json | Lấy danh sách các mã code áp dụng của một Price Rule',
  })
  @Get('admin/price_rules/:price_rule_id/discount_codes.json')
  async listDiscountCodes(@Param('price_rule_id') priceRuleId: string) {
    return {
      discount_codes: [
        { id: 501, price_rule_id: Number(priceRuleId), code: 'UNIFLOW20', usage_count: 14 },
        { id: 502, price_rule_id: Number(priceRuleId), code: 'VIPCUSTOMER', usage_count: 8 },
      ],
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/price_rules/:price_rule_id/discount_codes/:id.json] Xóa mã giảm giá',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/price_rules/{price_rule_id}/discount_codes/{id}.json | Xóa mã giảm giá',
  })
  @Delete('admin/price_rules/:price_rule_id/discount_codes/:id.json')
  async deleteDiscountCode(@Param('price_rule_id') priceRuleId: string, @Param('id') id: string) {
    return { success: true, deleted_id: Number(id), message: 'Đã xóa mã giảm giá thành công' };
  }
}
