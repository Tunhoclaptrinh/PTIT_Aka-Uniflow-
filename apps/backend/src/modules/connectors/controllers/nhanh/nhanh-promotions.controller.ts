import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  NhanhAddCouponDto,
  NhanhSearchCouponDto,
  NhanhCheckPromotionDto,
} from '../../dto/pos-nhanh.dto';

@ApiTags('[02. POS-Nhanh] 08. Khuyến mãi & Voucher (Promotions)')
@Controller('api/v1/infra/nhanh')
export class NhanhPromotionsController {

  @ApiOperation({
    summary: '[POST /api/promotion/coupon-add] Tạo mã giảm giá / Coupon Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/promotion/coupon-add | Docs: https://developers.nhanh.group/pos/promotion/coupon-add | Tạo voucher hoặc mã coupon giảm giá mới',
  })
  @ApiBody({ type: NhanhAddCouponDto })
  @Post('api/promotion/coupon-add')
  async addCoupon(@Body() dto: NhanhAddCouponDto) {
    return {
      code: 1,
      data: {
        couponId: Date.now().toString().slice(-6),
        code: dto.code,
        value: dto.value,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/promotion/coupon-search] Danh sách mã coupon Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/promotion/coupon-search | Docs: https://developers.nhanh.group/pos/promotion/coupon-search | Tra cứu danh sách mã giảm giá',
  })
  @ApiBody({ type: NhanhSearchCouponDto })
  @Post('api/promotion/coupon-search')
  async searchCoupons(@Body() dto: NhanhSearchCouponDto) {
    return {
      code: 1,
      data: [
        { code: 'UNIFLOW_SALE50', type: 'DISCOUNT_FIXED', value: 50000, minOrderValue: 300000, status: 'ACTIVE' },
        { code: 'VIP_MEMBER_10', type: 'DISCOUNT_PERCENT', value: 10, minOrderValue: 200000, status: 'ACTIVE' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /api/promotion/check] Kiểm tra điều kiện áp dụng khuyến mãi',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/promotion/check | Docs: https://developers.nhanh.group/pos/promotion/check | Validate mã giảm giá theo giỏ hàng',
  })
  @ApiBody({ type: NhanhCheckPromotionDto })
  @Post('api/promotion/check')
  async checkPromotion(@Body() dto: NhanhCheckPromotionDto) {
    const discountAmount = dto.totalOrderMoney >= 300000 ? 50000 : 0;
    return {
      code: 1,
      data: {
        valid: discountAmount > 0,
        couponCode: dto.couponCode,
        discountAmount,
        finalTotal: dto.totalOrderMoney - discountAmount,
        message: discountAmount > 0 ? 'Mã hợp lệ' : 'Đơn hàng chưa đạt giá trị tối thiểu 300.000đ',
      },
    };
  }
}
