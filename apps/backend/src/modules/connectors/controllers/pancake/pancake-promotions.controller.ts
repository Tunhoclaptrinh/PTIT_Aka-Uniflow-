import { Controller, Post, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { PancakePosCreatePromotionDto, PancakePosCreateVoucherDto } from '../../dto/pos-pancake.dto';

@ApiTags('[POS-Pancake] 07. Promotions & Vouchers (Khuyến mại & Mã giảm giá)')
@Controller('api/v1/infra/pancake')
export class PancakePromotionsController {

  @ApiOperation({
    summary: '[Promotion - Danh sách khuyến mãi] [GET /shops/:shopId/promotion_advance] Danh sách chương trình khuyến mãi nâng cao',
    description: '[Thuộc danh mục: 22. Promotion > Danh sách KM] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/promotion_advance | Docs: https://docs.pancake.biz/pos/api/ | Quản lý các chương trình giảm giá chiết khấu',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/promotion_advance')
  async listPromotionsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      promotions: [
        { id: 1, name: 'KHUYEN MAI XA KHO TET 2026', discount_percent: 10, is_active: true },
      ],
    };
  }

  @ApiOperation({
    summary: '[Promotion - Tạo khuyến mãi] [POST /shops/:shopId/promotion_advance] Tạo chương trình khuyến mãi sản phẩm',
    description: '[Thuộc danh mục: 22. Promotion > Tạo KM] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/promotion_advance | Khởi tạo chương trình giảm giá theo % hoặc số tiền',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreatePromotionDto })
  @Post('shops/:shopId/promotion_advance')
  async createPromotionOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosCreatePromotionDto) {
    return {
      success: true,
      shop_id: shopId,
      promotion: { id: Date.now(), ...dto, is_active: true },
    };
  }

  @ApiOperation({
    summary: '[Promotion - Sửa khuyến mãi] [PUT /shops/:shopId/promotion_advance/:promotionId] Cập nhật chương trình khuyến mãi',
    description: '[Thuộc danh mục: 22. Promotion > Sửa KM] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID}/promotion_advance/{PROMOTION_ID} | Gia hạn thời gian hoặc thay đổi tỷ lệ giảm giá',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'promotionId', example: '1' })
  @Put('shops/:shopId/promotion_advance/:promotionId')
  async updatePromotionOfficial(@Param('shopId') shopId: string, @Param('promotionId') promotionId: string, @Body() body: any) {
    return {
      success: true,
      promotion_id: Number(promotionId),
      ...body,
      updated_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Promotion - Kích hoạt/Hủy KM] [POST /shops/:shopId/promotion_advance/delete_multi] Bật/Tắt/Xóa hàng loạt khuyến mãi',
    description: '[Thuộc danh mục: 22. Promotion > Đổi trạng thái] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/promotion_advance/delete_multi | Bật, tắt hoặc xóa nhiều chương trình cùng lúc',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Post('shops/:shopId/promotion_advance/delete_multi')
  async deleteMultiPromotionsOfficial(@Param('shopId') shopId: string, @Body() body: { promotion_ids: number[]; action: string }) {
    return {
      success: true,
      shop_id: shopId,
      action: body.action || 'deactivate',
      affected_count: (body.promotion_ids || []).length || 1,
    };
  }

  @ApiOperation({
    summary: '[Voucher - Danh sách Voucher] [GET /shops/:shopId/vouchers] Danh sách mã giảm giá Voucher',
    description: '[Thuộc danh mục: 23. Voucher > Danh sách Voucher] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/vouchers | Tra cứu các mã voucher kích hoạt',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/vouchers')
  async listVouchersOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      vouchers: [
        { id: 1, code: 'PANCAKE-VIP50K', value: 50000, min_order_value: 200000, remaining: 85 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Voucher - Tạo Voucher] [POST /shops/:shopId/vouchers] Tạo mới mã giảm giá Voucher',
    description: '[Thuộc danh mục: 23. Voucher > Tạo Voucher] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/vouchers | Khởi tạo mã coupon chiết khấu',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateVoucherDto })
  @Post('shops/:shopId/vouchers')
  async createVoucherOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosCreateVoucherDto) {
    return {
      success: true,
      shop_id: shopId,
      voucher: { id: Date.now(), ...dto, is_active: true },
    };
  }

  @ApiOperation({
    summary: '[Voucher - Chi tiết Voucher] [GET /shops/:shopId/vouchers/:voucherId] Thông tin chi tiết mã giảm giá Voucher',
    description: '[Thuộc danh mục: 23. Voucher > Chi tiết Voucher] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/vouchers/{VOUCHER_ID}',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'voucherId', example: '1' })
  @Get('shops/:shopId/vouchers/:voucherId')
  async getVoucherOfficial(@Param('shopId') shopId: string, @Param('voucherId') voucherId: string) {
    return {
      success: true,
      voucher: {
        id: Number(voucherId),
        shop_id: shopId,
        code: 'PANCAKE-VIP50K',
        value: 50000,
        min_order_value: 200000,
        usage_limit: 100,
      },
    };
  }
}
