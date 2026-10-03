import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { HaravanCarrierServiceDto, HaravanCreateDeliveryDto } from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 6. SHIPPING CATEGORY (CarrierService, Shipping Rates, Deliveries)
// ═══════════════════════════════════════════════════════════════

@ApiTags('[02. POS-Haravan] 06. Shipping (Vận chuyển, Biểu phí & Giao hàng)')
@Controller('api/v1/infra/haravan')
export class HaravanCarrierServicesController {
  @ApiOperation({
    summary: '[Carrier Service - Hãng bưu chính] [POST /com/carrier_services.json] Đăng ký đối tác vận chuyển bên thứ 3',
    description: '[Thuộc danh mục: 06. Shipping > Đối tác vận chuyển] Endpoint gốc: POST https://apis.haravan.com/com/carrier_services.json | Docs: https://docs.haravan.com/docs/omni-apis/shipping-rates/ | Tích hợp cổng tính cước và giao vận tự động của bên thứ ba vào checkout Haravan',
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
    summary: '[Carrier Service - Hãng bưu chính] [GET /com/carrier_services.json] Danh sách hãng vận chuyển tích hợp',
    description: '[Thuộc danh mục: 06. Shipping > Đối tác vận chuyển] Endpoint gốc: GET https://apis.haravan.com/com/carrier_services.json | Danh sách các đối tác vận chuyển khả dụng',
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
    summary: '[Carrier Service - Hãng bưu chính] [PUT /com/carrier_services/:id.json] Cập nhật đối tác vận chuyển',
    description: '[Thuộc danh mục: 06. Shipping > Đối tác vận chuyển] Endpoint gốc: PUT https://apis.haravan.com/com/carrier_services/{id}.json | Sửa callback URL hoặc trạng thái hãng vận chuyển',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '601' })
  @ApiBody({ type: HaravanCarrierServiceDto })
  @Put('com/carrier_services/:id.json')
  async updateCarrierService(@Param('id') id: string, @Body() dto: HaravanCarrierServiceDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      carrier_service: { id: Number(id), name: dto.name, callback_url: dto.callback_url, active: true, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Carrier Service - Hãng bưu chính] [DELETE /com/carrier_services/:id.json] Hủy đối tác vận chuyển',
    description: '[Thuộc danh mục: 06. Shipping > Đối tác vận chuyển] Endpoint gốc: DELETE https://apis.haravan.com/com/carrier_services/{id}.json | Gỡ tích hợp hãng vận chuyển khỏi cửa hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '601' })
  @Delete('com/carrier_services/:id.json')
  async deleteCarrierService(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[Shipping Rate - Bảng cước phí] [GET /com/shipping_rates.json] Tra cứu biểu phí vận chuyển theo khu vực',
    description: '[Thuộc danh mục: 06. Shipping > Bảng biểu phí vận chuyển] Endpoint gốc: GET https://apis.haravan.com/com/shipping_rates.json | Docs: https://docs.haravan.com/docs/omni-apis/shipping-rates/ | Tính phí vận chuyển theo province_id, district_id, price, weight',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiQuery({ name: 'province_id', example: '201', required: false })
  @ApiQuery({ name: 'district_id', example: '1442', required: false })
  @ApiQuery({ name: 'price', example: 500000, required: false })
  @ApiQuery({ name: 'weight', example: 500, required: false })
  @Get('com/shipping_rates.json')
  async getShippingRates(@Query('province_id') provinceId?: string, @Query('district_id') districtId?: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      shipping_rates: [
        { id: 1, title: 'Giao hàng Tiêu chuẩn', price: 30000, min_order_subtotal: 0 },
        { id: 2, title: 'Giao hàng Hỏa tốc 2H', price: 55000, min_order_subtotal: 0 },
        { id: 3, title: 'Miễn phí vận chuyển (Freeship)', price: 0, min_order_subtotal: 1000000 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Delivery - Vận đơn giao hàng] [GET /com/deliveries.json] Danh sách các phiếu giao nhận đơn hàng (Deliveries)',
    description: '[Thuộc danh mục: 06. Shipping > Vận đơn giao nhận bưu chính] Endpoint gốc: GET https://apis.haravan.com/com/deliveries.json | Báo cáo danh sách vận đơn giao hàng qua các hãng bưu chính',
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

  @ApiOperation({
    summary: '[Delivery - Vận đơn giao hàng] [POST /com/deliveries.json] Tạo mới phiếu giao nhận đơn hàng (Delivery)',
    description: '[Thuộc danh mục: 06. Shipping > Vận đơn giao nhận bưu chính] Endpoint gốc: POST https://apis.haravan.com/com/deliveries.json | Khởi tạo vận đơn giao hàng bưu chính',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateDeliveryDto })
  @Post('com/deliveries.json')
  async createDelivery(@Body() body: HaravanCreateDeliveryDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      delivery: {
        id: Math.floor(Math.random() * 90000) + 10000,
        tracking_code: 'HRV_DLV_' + Date.now(),
        status: 'ready_to_pick',
        ...body,
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Delivery - Vận đơn giao hàng] [GET /com/deliveries/:id.json] Chi tiết phiếu giao nhận đơn hàng',
    description: '[Thuộc danh mục: 06. Shipping > Vận đơn giao nhận bưu chính] Endpoint gốc: GET https://apis.haravan.com/com/deliveries/{id}.json | Chi tiết lộ trình và tiền COD của vận đơn',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '8901' })
  @Get('com/deliveries/:id.json')
  async getDeliveryById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      delivery: { id: Number(id), order_id: 1001, tracking_code: 'GHN_HRV_99812', carrier: 'GHN', status: 'delivering', cod_amount: 580000, mode: mode || 'SANDBOX' },
    };
  }
}
