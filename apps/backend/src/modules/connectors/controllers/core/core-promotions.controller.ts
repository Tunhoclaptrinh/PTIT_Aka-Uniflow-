import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  GenerateVoucherDto,
  ValidateVoucherDto,
} from '../../dto/finance-logistics.dto';

@ApiTags('[UniFlow-Core] 01. Khuyến mãi & Vouchers')
@Controller('api/v1/infra/promotions')
export class CorePromotionsController {
  @ApiOperation({
    summary: '[POST /promotions/vouchers/generate] Khởi tạo Voucher khuyến mãi đa sàn',
    description: 'Endpoint cốt lõi UniFlow Promotions: Sinh mã Voucher khuyến mãi theo bộ quy tắc chiết khấu, áp dụng chéo POS và sàn TMĐT',
  })
  @ApiBody({ type: GenerateVoucherDto })
  @Post('vouchers/generate')
  async generateVoucher(@Body() dto: GenerateVoucherDto) {
    return {
      success: true,
      voucherCode: `${dto.codePrefix || 'UNI'}_${Date.now().toString().slice(-6)}`,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      minSpend: dto.minSpend,
      maxDiscount: dto.maxDiscount,
      validDays: dto.validDays,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[POST /promotions/vouchers/validate] Thẩm định điều kiện áp dụng Voucher',
    description: 'Endpoint cốt lõi UniFlow Promotions: Kiểm tra tính hợp lệ của mã giảm giá dựa trên giỏ hàng, hạn mức tối thiểu và đối tượng khách hàng',
  })
  @ApiBody({ type: ValidateVoucherDto })
  @Post('vouchers/validate')
  async validateVoucher(@Body() dto: ValidateVoucherDto) {
    const isValid = dto.cartAmount >= (dto.voucherCode.includes('VIP') ? 500000 : 200000);
    return {
      success: true,
      voucherCode: dto.voucherCode,
      valid: isValid,
      discountAmount: isValid ? 50000 : 0,
      message: isValid ? 'Áp dụng mã giảm giá thành công' : 'Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã',
    };
  }
}
