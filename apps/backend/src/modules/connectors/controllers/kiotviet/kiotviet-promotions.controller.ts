import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  KiotVietVoucherCampaignDto,
  KiotVietCreateVoucherDto,
  KiotVietReleaseVoucherDto,
  KiotVietCancelVoucherDto,
  KiotVietCouponStatusDto,
} from '../../dto/pos-kiotviet.dto';

@ApiTags('[02. POS-KiotViet] 06. Vouchers & Surcharges (Voucher, Khuyến mãi & Phụ thu)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietPromotionsController {

  @ApiOperation({
    summary: '[Voucher Campaign - Đợt phát hành] [GET /vouchers/campaigns] Danh sách đợt phát hành voucher',
    description: '[Thuộc danh mục: 2.24. Voucher > Voucher Campaign] Endpoint gốc: GET https://public.kiotapi.com/vouchers/campaigns | Tra cứu danh sách các chiến dịch phát hành voucher',
  })
  @ApiQuery({ name: 'pageSize', example: 20, required: false })
  @Get('vouchers/campaigns')
  async listVoucherCampaigns(@Query('pageSize') pageSize: number = 20) {
    return {
      total: 1,
      data: [
        {
          id: 30087,
          name: 'CHIẾN DỊCH VOUCHER TRI ÂN KHÁCH HÀNG',
          value: 50000,
          startDate: '2026-10-01T00:00:00Z',
          endDate: '2026-12-31T23:59:59Z',
          isActive: true,
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Voucher Campaign - Đợt phát hành] [POST /vouchers/campaigns] Tạo mới đợt phát hành voucher',
    description: '[Thuộc danh mục: 2.24. Voucher > Voucher Campaign] Endpoint gốc: POST https://public.kiotapi.com/vouchers/campaigns | Khởi tạo chương trình phát hành voucher',
  })
  @ApiBody({ type: KiotVietVoucherCampaignDto })
  @Post('vouchers/campaigns')
  async createVoucherCampaign(@Body() dto: KiotVietVoucherCampaignDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        name: dto.name,
        value: dto.value,
        startDate: dto.startDate,
        endDate: dto.endDate,
        isActive: true,
      },
    };
  }

  @ApiOperation({
    summary: '[Voucher - Mã voucher] [GET /vouchers] Danh sách mã voucher trong đợt phát hành',
    description: '[Thuộc danh mục: 2.24. Voucher > Voucher] Endpoint gốc: GET https://public.kiotapi.com/vouchers | Tra cứu danh sách mã voucher, trạng thái sử dụng và ngày hết hạn',
  })
  @ApiQuery({ name: 'campaignId', example: 30087, required: false })
  @Get('vouchers')
  async listVouchers(@Query('campaignId') campaignId?: number) {
    return {
      total: 2,
      data: [
        { id: 1, code: 'VC50K-OCT-001', campaignId: campaignId || 30087, amount: 50000, status: 0, statusValue: 'Chưa sử dụng' },
        { id: 2, code: 'VC50K-OCT-002', campaignId: campaignId || 30087, amount: 50000, status: 1, statusValue: 'Đã sử dụng' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Voucher - Mã voucher] [POST /vouchers] Tạo mới mã voucher',
    description: '[Thuộc danh mục: 2.24. Voucher > Voucher] Endpoint gốc: POST https://public.kiotapi.com/vouchers | Sinh mã voucher mới gán vào chiến dịch',
  })
  @ApiBody({ type: KiotVietCreateVoucherDto })
  @Post('vouchers')
  async createVoucher(@Body() dto: KiotVietCreateVoucherDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        campaignId: dto.campaignId,
        code: dto.code,
        amount: dto.amount,
        status: 0,
      },
    };
  }

  @ApiOperation({
    summary: '[Voucher - Mã voucher] [POST /vouchers/release] Phát hành kích hoạt danh sách voucher',
    description: '[Thuộc danh mục: 2.24. Voucher > Voucher] Endpoint gốc: POST https://public.kiotapi.com/vouchers/release | Phát hành các mã voucher để khách hàng có thể áp dụng',
  })
  @ApiBody({ type: KiotVietReleaseVoucherDto })
  @Post('vouchers/release')
  async releaseVouchers(@Body() dto: KiotVietReleaseVoucherDto) {
    return {
      responseStatus: 'success',
      message: 'Phát hành voucher thành công',
      releasedCount: dto.vouchers?.length || 0,
    };
  }

  @ApiOperation({
    summary: '[Voucher - Mã voucher] [DELETE /voucher/cancel] Hủy danh sách mã voucher',
    description: '[Thuộc danh mục: 2.24. Voucher > Voucher] Endpoint gốc: DELETE https://public.kiotapi.com/voucher/cancel | Hủy mã voucher chưa sử dụng',
  })
  @ApiBody({ type: KiotVietCancelVoucherDto })
  @Delete('voucher/cancel')
  async cancelVoucher(@Body() dto: KiotVietCancelVoucherDto) {
    return {
      responseStatus: 'success',
      message: 'Cập nhật voucher thành công',
      cancelledCount: dto.vouchers?.length || 0,
    };
  }

  @ApiOperation({
    summary: '[Coupon - Mã coupon] [PUT /coupons/status] Cập nhật trạng thái kích hoạt Coupon',
    description: '[Thuộc danh mục: 2.23. Coupon > Coupon] Endpoint gốc: PUT https://public.kiotapi.com/coupons/status | Bật hoặc tắt trạng thái sử dụng của mã Coupon chiết khấu',
  })
  @ApiBody({ type: KiotVietCouponStatusDto })
  @Put('coupons/status')
  async updateCouponStatus(@Body() dto: KiotVietCouponStatusDto) {
    return {
      responseStatus: 'success',
      data: { couponCode: dto.couponCode, status: dto.status, updatedDate: new Date().toISOString() },
    };
  }
}
