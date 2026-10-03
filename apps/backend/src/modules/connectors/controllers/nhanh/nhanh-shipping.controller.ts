import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  NhanhCalculateFeeDto,
  NhanhShippingCarrierDto,
  NhanhShippingHandoverDto,
} from '../../dto/pos-nhanh.dto';

@ApiTags('[POS-Nhanh] 02. Vận chuyển (Shipping)')
@Controller('api/v1/infra/nhanh')
export class NhanhShippingController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /api/shipping/fee] Tính cước vận chuyển Nhanh Ship',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/shipping/fee | Docs: https://developers.nhanh.group/pos/shipping/fee | Tính toán biểu phí cước giao hàng từ kho đến địa chỉ nhận qua Nhanh Ship',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: NhanhCalculateFeeDto })
  @Post('api/shipping/fee')
  async calculateFee(@Body() dto: NhanhCalculateFeeDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_calculate_fee', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /api/shipping/carrier] Danh sách hãng vận chuyển kết nối Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/shipping/carrier | Docs: https://developers.nhanh.group/pos/shipping/carrier | Lấy danh sách các hãng vận chuyển tích hợp (GHTK, GHN, ViettelPost, J&T, VNPost)',
  })
  @ApiBody({ type: NhanhShippingCarrierDto })
  @Post('api/shipping/carrier')
  async listCarriers(@Body() dto: NhanhShippingCarrierDto) {
    return {
      code: 1,
      data: [
        { carrierCode: 'GHTK', name: 'Giao Hàng Tiết Kiệm', status: 'ACTIVE' },
        { carrierCode: 'GHN', name: 'Giao Hàng Nhanh', status: 'ACTIVE' },
        { carrierCode: 'VTPOST', name: 'Viettel Post', status: 'ACTIVE' },
        { carrierCode: 'JT', name: 'J&T Express', status: 'ACTIVE' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /api/shipping/handover] Tạo biên bản bàn giao vận chuyển Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/shipping/handover | Docs: https://developers.nhanh.group/pos/shipping/handover | Tạo biên bản xuất kho bàn giao các kiện hàng cho bưu tá',
  })
  @ApiBody({ type: NhanhShippingHandoverDto })
  @Post('api/shipping/handover')
  async handoverShipping(@Body() dto: NhanhShippingHandoverDto) {
    return {
      code: 1,
      data: {
        handoverId: `HO_${Date.now().toString().slice(-6)}`,
        carrier: dto.carrier,
        depotId: dto.depotId,
        orderCount: dto.orderIds?.length || 1,
        created_at: new Date().toISOString(),
      },
    };
  }
}
