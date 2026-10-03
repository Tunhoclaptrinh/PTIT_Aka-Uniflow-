import { Controller, Post, Get, Delete, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiHeader } from '@nestjs/swagger';
import {
  HaravanCarrierServiceDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 20. CARRIER SERVICE & SHIPPING RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 20. CarrierService & Shipping')
@Controller('api/v1/infra/haravan')
export class HaravanCarrierServicesController {
  @ApiOperation({
    summary: '[POST /com/carrier_services.json] Đăng ký đối tác vận chuyển bên thứ 3 (CarrierService)',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/carrier_services.json | Docs: https://docs.haravan.com/docs/omni-apis/shipping-rates/ | Tích hợp cổng tính cước và giao vận tự động của bên thứ ba vào checkout Haravan',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCarrierServiceDto })
  @Post('com/carrier_services.json')
  async createCarrierService(@Body() dto: HaravanCarrierServiceDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      carrier_service: {
        id: Date.now(),
        name: dto.name,
        callback_url: dto.callback_url,
        service_discovery: dto.service_discovery,
        format: dto.format || 'json',
        active: true,
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/carrier_services.json] Danh sách hãng vận chuyển tích hợp',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/carrier_services.json | Danh sách các đối tác vận chuyển khả dụng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/carrier_services.json')
  async listCarrierServices(@Headers('x-uniflow-mode') mode?: string) {
    return {
      carrier_services: [
        { id: 601, name: 'UniFlow Logistics Hub', callback_url: 'https://api.uniflow.vn/api/v1/infra/haravan/shipping-rates', active: true },
        { id: 602, name: 'Giao Hàng Nhanh Express', callback_url: 'https://api.ghn.vn/haravan/rates', active: true },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/carrier_services/:id.json] Hủy đối tác vận chuyển',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/carrier_services/{id}.json | Gỡ tích hợp hãng vận chuyển khỏi cửa hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '601' })
  @Delete('com/carrier_services/:id.json')
  async deleteCarrierService(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[GET /com/deliveries.json] Danh sách các phiếu giao nhận đơn hàng (Deliveries)',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/deliveries.json | Báo cáo danh sách vận đơn giao hàng qua các hãng bưu chính',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/deliveries.json')
  async listDeliveries(@Headers('x-uniflow-mode') mode?: string) {
    return {
      deliveries: [
        { id: 8901, order_id: 1001, tracking_code: 'GHN_HRV_99812', carrier: 'GHN', status: 'delivering', cod_amount: 580000 },
      ],
      mode: mode || 'SANDBOX',
    };
  }
}
