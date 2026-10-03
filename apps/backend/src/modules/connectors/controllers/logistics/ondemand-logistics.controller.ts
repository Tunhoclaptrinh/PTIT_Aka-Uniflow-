import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { AhamoveCreateOrderDto, GrabExpressDeliveryDto } from '../../dto/finance-logistics.dto';

@ApiTags('[Logistics-VN] 06. Instant & On-Demand Delivery (Ahamove & GrabExpress)')
@Controller('api/v1/infra/logistics')
export class LogisticsOnDemandController {

  // ════════════════════════════════════════════════════════════════
  // 1. AHAMOVE INSTANT LOGISTICS (GIAO HÀNG TỨC THÌ 1-2H)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Ahamove - Tính cước tức thì] [POST /ahamove/v1/order/estimated-fee] Dự toán cước phí xe máy / xe tải Ahamove',
    description: '[Thuộc danh mục: 01. Ahamove > Tính cước] Endpoint gốc: POST https://apistg.ahamove.com/v1/order/estimated_fee | Docs: https://developers.ahamove.com/ | Tính cước siêu tốc, 2H, giao xe van/tải',
  })
  @ApiBody({ schema: { example: { service_id: 'SGM-BIKE', pickup_address: '18 Duy Tân, Cầu Giấy', dropoff_address: '88 Phố Huế, Hai Bà Trưng' } } })
  @Post('ahamove/v1/order/estimated-fee')
  async ahamoveEstimatedFee(@Body() body: any) {
    return {
      success: true,
      service_id: body.service_id || 'SGM-BIKE',
      distance: 8.5,
      duration: 25,
      total_fee: 38000,
      currency: 'VND',
    };
  }

  @ApiOperation({
    summary: '[Ahamove - Tạo đơn gọi tài xế] [POST /ahamove/v1/order/create] Tạo đơn điều phối shipper Ahamove lấy hàng ngay',
    description: '[Thuộc danh mục: 01. Ahamove > Gọi tài xế] Endpoint gốc: POST https://apistg.ahamove.com/v1/order/create | Kích hoạt bắt tài xế quanh điểm nhận hàng',
  })
  @ApiBody({ type: AhamoveCreateOrderDto })
  @Post('ahamove/v1/order/create')
  async ahamoveCreateOrder(@Body() dto: AhamoveCreateOrderDto) {
    const orderId = `AHA_${Date.now().toString().slice(-8)}`;
    return {
      order_id: orderId,
      status: 'ASSIGNING',
      service_id: dto.service_id,
      total_fee: 38000,
      supplier_name: 'Đang kết nối tài xế gần nhất',
      shared_link: `https://ahamove.com/share/${orderId}`,
    };
  }

  @ApiOperation({
    summary: '[Ahamove - Định vị GPS tài xế] [GET /ahamove/v1/order/:orderId/tracking] Tọa độ GPS tài xế và lộ trình di chuyển thời gian thực',
    description: '[Thuộc danh mục: 01. Ahamove > Định vị GPS] Endpoint gốc: GET https://apistg.ahamove.com/v1/order/tracking/{orderId}',
  })
  @ApiParam({ name: 'orderId', example: 'AHA_88192019' })
  @Get('ahamove/v1/order/:orderId/tracking')
  async ahamoveTracking(@Param('orderId') orderId: string) {
    return {
      order_id: orderId,
      status: 'IN_PROCESS',
      driver: {
        name: 'Trần Văn Mạnh',
        phone: '0981999888',
        license_plate: '29E1-88992',
        current_location: { lat: 21.028511, lng: 105.782312 },
      },
      estimated_arrival_minutes: 12,
    };
  }

  @ApiOperation({
    summary: '[Ahamove - Hủy chuyến] [POST /ahamove/v1/order/cancel] Hủy chuyến giao hàng Ahamove',
    description: '[Thuộc danh mục: 01. Ahamove > Hủy chuyến] Endpoint gốc: POST https://apistg.ahamove.com/v1/order/cancel',
  })
  @ApiBody({ schema: { example: { order_id: 'AHA_88192019', comment: 'Khách hàng đổi địa chỉ' } } })
  @Post('ahamove/v1/order/cancel')
  async ahamoveCancelOrder(@Body() body: any) {
    return {
      success: true,
      order_id: body.order_id,
      status: 'CANCELLED',
      cancellation_fee: 0,
    };
  }

  @ApiOperation({
    summary: '[Ahamove - Đơn đang chạy] [GET /ahamove/v1/order/active-orders] Danh sách các chuyến đang giao',
    description: '[Thuộc danh mục: 01. Ahamove > Đơn đang chạy] Endpoint gốc: GET https://apistg.ahamove.com/v1/order/active',
  })
  @Get('ahamove/v1/order/active-orders')
  async ahamoveGetActiveOrders() {
    return {
      active_orders: [
        { order_id: 'AHA_88192019', service_id: 'SGM-BIKE', status: 'IN_PROCESS', distance: 8.5, fee: 38000 },
      ],
    };
  }

  // ════════════════════════════════════════════════════════════════
  // 2. GRABEXPRESS / ON-DEMAND DELIVERY
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[GrabExpress - Báo giá tức thì] [POST /instant/grabexpress/quotes] Báo giá chuyến giao GrabExpress',
    description: '[Thuộc danh mục: 02. GrabExpress > Báo giá] Endpoint gốc: POST https://partner-api.grab.com/grabexpress/v1/deliveries/quotes',
  })
  @ApiBody({ schema: { example: { service_type: 'Instant', sender_lat: 21.028, sender_lng: 105.782, receiver_lat: 21.015, receiver_lng: 105.850 } } })
  @Post('instant/grabexpress/quotes')
  async grabQuotes(@Body() body: any) {
    return {
      quotes: [
        { service_type: 'Instant', amount: 39000, currency: 'VND', estimated_timeline: '30 mins' },
        { service_type: 'SameDay', amount: 25000, currency: 'VND', estimated_timeline: '4 hours' },
      ],
    };
  }

  @ApiOperation({
    summary: '[GrabExpress - Tạo chuyến giao] [POST /instant/grabexpress/delivery] Khởi tạo chuyến giao GrabExpress',
    description: '[Thuộc danh mục: 02. GrabExpress > Tạo chuyến] Endpoint gốc: POST https://partner-api.grab.com/grabexpress/v1/deliveries',
  })
  @ApiBody({ type: GrabExpressDeliveryDto })
  @Post('instant/grabexpress/delivery')
  async grabCreateDelivery(@Body() dto: GrabExpressDeliveryDto) {
    const deliveryId = `GRAB_DEL_${Date.now().toString().slice(-8)}`;
    return {
      delivery_id: deliveryId,
      status: 'ALLOCATING',
      driver: null,
      tracking_url: `https://express.grab.com/track/${deliveryId}`,
    };
  }

  @ApiOperation({
    summary: '[GrabExpress - Trạng thái & Tài xế] [GET /instant/grabexpress/delivery/:deliveryId] Chi tiết trạng thái và vị trí tài xế Grab',
    description: '[Thuộc danh mục: 02. GrabExpress > Trạng thái chuyến] Endpoint gốc: GET https://partner-api.grab.com/grabexpress/v1/deliveries/{deliveryId}',
  })
  @ApiParam({ name: 'deliveryId', example: 'GRAB_DEL_88192019' })
  @Get('instant/grabexpress/delivery/:deliveryId')
  async grabGetDelivery(@Param('deliveryId') deliveryId: string) {
    return {
      delivery_id: deliveryId,
      status: 'PICKED_UP',
      driver: { name: 'Lê Hoàng Vũ', phone: '0901888999', plate_number: '30F-99212' },
      eta_delivery: '15:45',
    };
  }

  @ApiOperation({
    summary: '[GrabExpress - Hủy chuyến] [POST /instant/grabexpress/delivery/:deliveryId/cancel] Hủy chuyến giao GrabExpress',
    description: '[Thuộc danh mục: 02. GrabExpress > Hủy chuyến] Endpoint gốc: POST https://partner-api.grab.com/grabexpress/v1/deliveries/{deliveryId}/cancel',
  })
  @ApiParam({ name: 'deliveryId', example: 'GRAB_DEL_88192019' })
  @Post('instant/grabexpress/delivery/:deliveryId/cancel')
  async grabCancelDelivery(@Param('deliveryId') deliveryId: string) {
    return {
      delivery_id: deliveryId,
      status: 'CANCELLED',
      message: 'Hủy chuyến GrabExpress thành công',
    };
  }
}
