import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import {
  JtExpressCreateOrderDto,
  NinjaVanCreateOrderDto,
  JtCalculateFeeDto,
  NinjaVanPricingDto,
} from '../../dto/finance-logistics.dto';

@ApiTags('[05. Logistics-VN] 05. J&T Express & Ninja Van')
@Controller('api/v1/infra/logistics')
export class LogisticsJtNinjaVanController {

  // ════════════════════════════════════════════════════════════════
  // 1. J&T EXPRESS VIETNAM OPEN API
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[J&T - Tạo vận đơn] [POST /jt/v1/orders/create] Tạo đơn giao hàng J&T Express',
    description: '[Thuộc danh mục: 01. J&T Express > Tạo vận đơn] Endpoint gốc: POST https://jtexpress.vn/api/order/create | Tạo mã billcode và tem dán bưu kiện J&T',
  })
  @ApiBody({ type: JtExpressCreateOrderDto })
  @Post('jt/v1/orders/create')
  async jtCreateOrder(@Body() dto: JtExpressCreateOrderDto) {
    const billCode = `84${Date.now().toString().slice(-10)}`;
    return {
      success: true,
      code: '0000',
      message: 'Success',
      data: {
        bill_code: billCode,
        reference_no: dto.reference_no,
        sorting_code: 'HN-01A',
        total_fee: 28000,
        tracking_url: `https://jtexpress.vn/vi/tracking?billcode=${billCode}`,
      },
    };
  }

  @ApiOperation({
    summary: '[J&T - Tính cước] [POST /jt/v1/orders/fee] Tính cước vận chuyển chuẩn J&T Express',
    description: '[Thuộc danh mục: 01. J&T Express > Tính cước] Endpoint gốc: POST https://jtexpress.vn/api/order/fee',
  })
  @ApiBody({ type: JtCalculateFeeDto })
  @Post('jt/v1/orders/fee')
  async jtCalculateFee(@Body() body: JtCalculateFeeDto) {
    return {
      success: true,
      data: {
        standard_fee: 28000,
        fast_fee: 35000,
        insurance_fee: 0,
        vat: 2240,
        total: 30240,
      },
    };
  }

  @ApiOperation({
    summary: '[J&T - Tra cứu vận đơn] [GET /jt/v1/orders/:billCode/track] Tra cứu hành trình vận đơn J&T Express',
    description: '[Thuộc danh mục: 01. J&T Express > Tra cứu hành trình] Endpoint gốc: GET https://jtexpress.vn/api/order/track/{billCode}',
  })
  @ApiParam({ name: 'billCode', example: '840192837461' })
  @Get('jt/v1/orders/:billCode/track')
  async jtTrackOrder(@Param('billCode') billCode: string) {
    return {
      success: true,
      bill_code: billCode,
      status: 'ON_DELIVERY',
      current_station: 'Bưu cục J&T Dịch Vọng Hậu',
      shipper: { name: 'Vũ Đức Nam', phone: '0933221100' },
      traces: [
        { scan_time: '2026-10-03 08:30:00', scan_type: 'Pick up', desc: 'Đã nhận kiện hàng từ người gửi' },
        { scan_time: '2026-10-03 13:00:00', scan_type: 'Departure', desc: 'Rời trung tâm khai thác Hà Nội' },
      ],
    };
  }

  @ApiOperation({
    summary: '[J&T - Hủy đơn] [POST /jt/v1/orders/:billCode/cancel] Hủy đơn hàng J&T Express',
    description: '[Thuộc danh mục: 01. J&T Express > Hủy đơn] Endpoint gốc: POST https://jtexpress.vn/api/order/cancel',
  })
  @ApiParam({ name: 'billCode', example: '840192837461' })
  @Post('jt/v1/orders/:billCode/cancel')
  async jtCancelOrder(@Param('billCode') billCode: string) {
    return {
      success: true,
      bill_code: billCode,
      status: 'CANCELLED',
      message: 'Hủy đơn hàng thành công trên hệ thống J&T',
    };
  }

  @ApiOperation({
    summary: '[J&T - In nhãn Barcode] [GET /jt/v1/orders/:billCode/print] In nhãn vận đơn J&T Express',
    description: '[Thuộc danh mục: 01. J&T Express > In nhãn] Endpoint gốc: GET https://jtexpress.vn/api/order/print/{billCode}',
  })
  @ApiParam({ name: 'billCode', example: '840192837461' })
  @Get('jt/v1/orders/:billCode/print')
  async jtPrintOrder(@Param('billCode') billCode: string) {
    return {
      success: true,
      bill_code: billCode,
      print_url: `https://jtexpress.vn/print/${billCode}.pdf`,
      barcode: billCode,
    };
  }

  // ════════════════════════════════════════════════════════════════
  // 2. NINJA VAN VIETNAM OPEN API
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Ninja Van - Tạo vận đơn] [POST /ninjavan/v1/orders/create] Tạo đơn giao hàng Ninja Van Vietnam',
    description: '[Thuộc danh mục: 02. Ninja Van > Tạo vận đơn] Endpoint gốc: POST https://api.ninjavan.co/vn/2.0/orders | Cấp mã tracking và mã điều phối Ninja Van',
  })
  @ApiBody({ type: NinjaVanCreateOrderDto })
  @Post('ninjavan/v1/orders/create')
  async ninjaVanCreateOrder(@Body() dto: NinjaVanCreateOrderDto) {
    const trackingId = `NJA_VN_${Date.now().toString().slice(-8)}`;
    return {
      tracking_id: trackingId,
      merchant_order_number: dto.merchant_order_number,
      status: 'Pending Pickup',
      service_type: dto.service_type,
      delivery_fee: 31000,
    };
  }

  @ApiOperation({
    summary: '[Ninja Van - Sự kiện giao vận] [GET /ninjavan/v1/orders/:trackingId/events] Lịch sử sự kiện giao vận Ninja Van',
    description: '[Thuộc danh mục: 02. Ninja Van > Sự kiện giao vận] Endpoint gốc: GET https://api.ninjavan.co/vn/2.0/orders/{trackingId}/events',
  })
  @ApiParam({ name: 'trackingId', example: 'NJA_VN_99812901' })
  @Get('ninjavan/v1/orders/:trackingId/events')
  async ninjaVanGetEvents(@Param('trackingId') trackingId: string) {
    return {
      tracking_id: trackingId,
      events: [
        { time: '2026-10-03T08:00:00Z', event_name: 'Order Created', description: 'Đã tạo lệnh giao Ninja Van' },
        { time: '2026-10-03T11:30:00Z', event_name: 'Parcel Picked Up', description: 'Ninja Driver đã lấy bưu kiện' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Ninja Van - Báo giá] [POST /ninjavan/v1/orders/pricing] Dự toán chi phí giao hàng Ninja Van',
    description: '[Thuộc danh mục: 02. Ninja Van > Báo giá] Endpoint gốc: POST https://api.ninjavan.co/vn/2.0/pricing',
  })
  @ApiBody({ type: NinjaVanPricingDto })
  @Post('ninjavan/v1/orders/pricing')
  async ninjaVanPricing(@Body() body: NinjaVanPricingDto) {
    return {
      price: 31000,
      currency: 'VND',
      delivery_estimate: '2-3 working days',
    };
  }

  @ApiOperation({
    summary: '[Ninja Van - Hủy đơn] [POST /ninjavan/v1/orders/:trackingId/cancel] Hủy đơn giao Ninja Van',
    description: '[Thuộc danh mục: 02. Ninja Van > Hủy đơn] Endpoint gốc: POST https://api.ninjavan.co/vn/2.0/orders/{trackingId}/cancel',
  })
  @ApiParam({ name: 'trackingId', example: 'NJA_VN_99812901' })
  @Post('ninjavan/v1/orders/:trackingId/cancel')
  async ninjaVanCancel(@Param('trackingId') trackingId: string) {
    return {
      tracking_id: trackingId,
      status: 'Cancelled',
      cancelled_at: new Date().toISOString(),
    };
  }
}
