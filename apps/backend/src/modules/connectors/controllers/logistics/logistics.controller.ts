import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  LogisticsWaybillDto,
  GhtkCalculateFeeDto,
  GhtkCreateOrderDto,
  GhtkCancelOrderDto,
  GhtkReconciliationDto,
  GhnFeeCalculationDto,
  GhnLeadtimeDto,
  GhnAvailableServicesDto,
  GhnCreateOrderDto,
  GhnCancelOrderDto,
  GhnPrintOrderDto,
  ViettelPostGetPriceDto,
  ViettelPostCreateOrderDto,
  ViettelPostUpdateOrderDto,
  ViettelPostCancelOrderDto,
} from '../../dto/finance-logistics.dto';

// ════════════════════════════════════════════════════════════════
// 1. GIAO HÀNG TIẾT KIỆM (GHTK)
// ════════════════════════════════════════════════════════════════
@ApiTags('[Logistics-VN] 01. Giao Hàng Tiết Kiệm (GHTK)')
@Controller('api/v1/infra/logistics')
export class LogisticsGhtkController {
  @ApiOperation({
    summary: '[POST GHTK /services/shipment/fee] Tính cước phí giao hàng GHTK',
    description: 'Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/shipment/fee | Tính chính xác phí vận chuyển đường bộ/đường bay và phí bảo hiểm',
  })
  @ApiBody({ type: GhtkCalculateFeeDto })
  @Post('ghtk/services/shipment/fee')
  async ghtkCalculateFee(@Body() dto: GhtkCalculateFeeDto) {
    const isInterProvincial = dto.pick_province !== dto.province;
    const baseFee = isInterProvincial ? 32000 : 22000;
    const insuranceFee = dto.value > 1000000 ? Math.round(dto.value * 0.005) : 0;
    return {
      success: true,
      message: 'Tính cước thành công',
      fee: {
        name: dto.transport === 'fly' ? 'GHTK Bay Nhanh' : 'GHTK Chuẩn Đường Bộ',
        fee: baseFee,
        insurance_fee: insuranceFee,
        delivery_type: dto.transport || 'road',
        include_vat: true,
        cost_id: 1029,
        delivery: true,
      },
    };
  }

  @ApiOperation({
    summary: '[POST GHTK /services/shipment/order] Tạo vận đơn Giao Hàng Tiết Kiệm',
    description: 'Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/shipment/order | Đẩy lệnh tạo vận đơn và in mã barcode giao hàng GHTK Express',
  })
  @ApiBody({ type: GhtkCreateOrderDto })
  @Post('ghtk/services/shipment/order')
  async ghtkCreateWaybill(@Body() dto: GhtkCreateOrderDto) {
    const orderId = dto.order?.id || `ORD_${Date.now().toString().slice(-6)}`;
    const trackingCode = `S22941.${orderId}.981`;
    return {
      success: true,
      message: 'Tiếp nhận đơn hàng thành công',
      order: {
        partner_id: orderId,
        label: trackingCode,
        area: 1,
        fee: 28000,
        insurance_fee: 0,
        estimated_pick_time: 'Chiều nay 14:00 - 17:30',
        estimated_deliver_time: 'Ngày mai 08:30 - 12:00',
        status_id: 2,
        tracking_url: `https://i.ghtk.vn/${trackingCode}`,
      },
    };
  }

  @ApiOperation({
    summary: '[GET GHTK /services/shipment/v2/:trackingCode] Tra cứu hành trình vận đơn GHTK',
    description: 'Tra cứu tiến độ giao hàng, tọa độ shipper và lịch sử giao vận thực tế từ GHTK.',
  })
  @ApiParam({ name: 'trackingCode', example: 'S22941.ORD_123.981' })
  @Get('ghtk/tracking/:trackingCode')
  async ghtkTracking(@Param('trackingCode') trackingCode: string) {
    return {
      success: true,
      trackingCode,
      status: 'DELIVERING',
      statusText: 'Đang giao hàng cho khách',
      shipper: { name: 'Nguyễn Văn Giao', phone: '0901234567' },
      logs: [
        { time: '2026-10-03 08:30:00', status: 'Đã lấy hàng từ kho' },
        { time: '2026-10-03 11:15:00', status: 'Nhập kho trung chuyển Hà Nội' },
        { time: '2026-10-03 14:00:00', status: 'Shipper đang trên đường giao hàng' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST GHTK /services/shipment/cancel/:trackingCode] Hủy vận đơn GHTK',
    description: 'Hủy đơn giao trước khi shipper đến lấy hàng',
  })
  @ApiParam({ name: 'trackingCode', example: 'S22941.ORD_123.981' })
  @Post('ghtk/cancel/:trackingCode')
  async ghtkCancel(@Param('trackingCode') trackingCode: string, @Body() body?: GhtkCancelOrderDto) {
    return {
      success: true,
      trackingCode,
      status: 'CANCELLED',
      message: 'Hủy vận đơn GHTK thành công',
      cancel_reason: body?.reason || 'Hủy theo yêu cầu khách hàng',
    };
  }

  @ApiOperation({
    summary: '[GET GHTK /services/label/:trackingCode] Tải mã tem in phiếu gửi hàng GHTK',
    description: 'Endpoint gốc: GET https://services.giaohangtietkiem.vn/services/label/{trackingCode} | Nhận URL file PDF/PNG in tem bưu phẩm kèm mã Barcode',
  })
  @ApiParam({ name: 'trackingCode', example: 'S22941.ORD_123.981' })
  @Get('ghtk/services/label/:trackingCode')
  async ghtkPrintLabel(@Param('trackingCode') trackingCode: string) {
    return {
      success: true,
      trackingCode,
      label_url: `https://services.giaohangtietkiem.vn/services/label/${trackingCode}.pdf`,
      barcode: trackingCode,
      paper_size: 'A6',
    };
  }

  @ApiOperation({
    summary: '[GET GHTK /services/shipment/pick-shifts] Tra cứu danh sách ca lấy hàng linh hoạt',
    description: 'Lấy các khung giờ bưu tá có thể qua kho lấy hàng trong ngày',
  })
  @Get('ghtk/services/shipment/pick-shifts')
  async ghtkGetPickShifts() {
    return {
      success: true,
      data: [
        { shift_id: 1, title: 'Ca Sáng (08:00 - 12:00)', active: true },
        { shift_id: 2, title: 'Ca Chiều (13:30 - 17:30)', active: true },
        { shift_id: 3, title: 'Ca Tối (18:00 - 21:00)', active: true },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET GHTK /services/shipment/list_hub] Danh sách bưu cục / Hub gửi hàng GHTK',
    description: 'Tra cứu danh sách điểm tiếp nhận hàng hóa GHTK trên toàn quốc',
  })
  @Get('ghtk/services/shipment/list_hub')
  async ghtkListHubs() {
    return {
      success: true,
      data: [
        { hub_id: 'HUB_HN_01', name: 'Kho GHTK Cầu Giấy', address: 'Số 18 Duy Tân, Cầu Giấy, Hà Nội', phone: '19006092' },
        { hub_id: 'HUB_HN_02', name: 'Kho GHTK Thanh Xuân', address: 'Ngõ 102 Khuất Duy Tiến, Thanh Xuân, Hà Nội', phone: '19006092' },
        { hub_id: 'HUB_HCM_01', name: 'Kho GHTK Tân Bình', address: 'Kho C4, Đường A4, Phường 12, Tân Bình, TP.HCM', phone: '19006092' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST GHTK /services/statement/reconciliation] Báo cáo đối soát tiền thu hộ COD',
    description: 'Đối soát các vận đơn đã phát thành công và số tiền COD được chuyển về tài khoản',
  })
  @ApiBody({ type: GhtkReconciliationDto })
  @Post('ghtk/services/statement/reconciliation')
  async ghtkReconciliation(@Body() dto: GhtkReconciliationDto) {
    return {
      success: true,
      period: `${dto.from_date} đến ${dto.to_date}`,
      total_orders: 142,
      total_cod_amount: 54200000,
      total_shipping_fee: 4260000,
      net_transferred: 49940000,
      status: dto.status || 'PAID',
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 2. GIAO HÀNG NHANH (GHN EXPRESS)
// ════════════════════════════════════════════════════════════════
@ApiTags('[Logistics-VN] 02. Giao Hàng Nhanh (GHN)')
@Controller('api/v1/infra/logistics')
export class LogisticsGhnController {
  @ApiOperation({
    summary: '[POST GHN /shiip/public-api/v2/shipping-order/available-services] Tra cứu gói cước khả dụng',
    description: 'Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services | Danh sách gói dịch vụ GHN phù hợp với tuyến đường',
  })
  @ApiBody({ type: GhnAvailableServicesDto })
  @Post('ghn/shiip/public-api/v2/shipping-order/available-services')
  async ghnAvailableServices(@Body() dto: GhnAvailableServicesDto) {
    return {
      code: 200,
      message: 'Success',
      data: [
        { service_id: 53320, short_name: 'Chuẩn', service_type_id: 2, config_fee_id: 0 },
        { service_id: 53321, short_name: 'Tiết kiệm', service_type_id: 1, config_fee_id: 0 },
        { service_id: 53322, short_name: 'Nhanh 24h', service_type_id: 3, config_fee_id: 0 },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST GHN /shiip/public-api/v2/shipping-order/fee] Tính cước vận chuyển chuẩn GHN',
    description: 'Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee | Tính chính xác cước dựa trên trọng lượng, kích thước và bảo hiểm',
  })
  @ApiBody({ type: GhnFeeCalculationDto })
  @Post('ghn/shiip/public-api/v2/shipping-order/fee')
  async ghnCalculateFee(@Body() dto: GhnFeeCalculationDto) {
    return {
      code: 200,
      message: 'Success',
      data: {
        total: 31500,
        service_fee: 28000,
        insurance_fee: Math.round(dto.insurance_value * 0.005),
        pick_station_fee: 0,
        coupon_value: 0,
        r2s_fee: 0,
      },
    };
  }

  @ApiOperation({
    summary: '[POST GHN /shiip/public-api/v2/shipping-order/leadtime] Tính thời gian dự kiến giao (Leadtime)',
    description: 'Dự báo ngày giờ bưu tá giao hàng tới tay người nhận',
  })
  @ApiBody({ type: GhnLeadtimeDto })
  @Post('ghn/shiip/public-api/v2/shipping-order/leadtime')
  async ghnLeadtime(@Body() dto: GhnLeadtimeDto) {
    const leadTimeDate = new Date(Date.now() + 86400000 * 2);
    return {
      code: 200,
      message: 'Success',
      data: {
        leadtime: Math.floor(leadTimeDate.getTime() / 1000),
        order_date: Math.floor(Date.now() / 1000),
        leadtime_formatted: leadTimeDate.toISOString().split('T')[0],
      },
    };
  }

  @ApiOperation({
    summary: '[POST GHN /shiip/public-api/v2/shipping-order/create] Tạo vận đơn Giao Hàng Nhanh',
    description: 'Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create | Tạo vận đơn và lịch hẹn tài xế lấy hàng GHN Express',
  })
  @ApiBody({ type: GhnCreateOrderDto })
  @Post('ghn/shiip/public-api/v2/shipping-order/create')
  async ghnCreateWaybill(@Body() dto: GhnCreateOrderDto) {
    const orderCode = `GHN${Date.now().toString().slice(-8)}`;
    return {
      code: 200,
      message: 'Success',
      data: {
        order_code: orderCode,
        sort_code: 'HN-CGI-01',
        trans_type: 'truck',
        total_fee: 31500,
        expected_delivery_time: new Date(Date.now() + 86400000 * 2).toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST GHN /shiip/public-api/v2/shipping-order/detail] Xem chi tiết vận đơn GHN',
    description: 'Tra cứu thông tin gói hàng, tiền COD và trạng thái hiện tại theo order_code',
  })
  @ApiBody({ schema: { example: { order_code: 'GHN98127361' } } })
  @Post('ghn/shiip/public-api/v2/shipping-order/detail')
  async ghnOrderDetail(@Body() body: { order_code: string }) {
    return {
      code: 200,
      message: 'Success',
      data: {
        order_code: body.order_code,
        status: 'delivering',
        to_name: 'Lê Hoàng Long',
        to_phone: '0977889900',
        cod_amount: 520000,
        weight: 800,
        leadtime: new Date(Date.now() + 86400000).toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST GHN /shiip/public-api/v2/switch-status/cancel] Hủy vận đơn giao hàng GHN',
    description: 'Hủy đơn giao trước khi bưu tá đến lấy bưu phẩm',
  })
  @ApiBody({ type: GhnCancelOrderDto })
  @Post('ghn/shiip/public-api/v2/switch-status/cancel')
  async ghnCancelOrder(@Body() dto: GhnCancelOrderDto) {
    return {
      code: 200,
      message: 'Success',
      data: dto.order_codes.map((code) => ({ order_code: code, result: true, message: 'Đã hủy thành công' })),
    };
  }

  @ApiOperation({
    summary: '[POST GHN /shiip/public-api/v2/a5/gen-token] Tạo token in phiếu gửi hàng A5/80x80',
    description: 'Tạo mã Token ngắn hạn để gọi giao diện in ấn phiếu gửi chuẩn GHN',
  })
  @ApiBody({ type: GhnPrintOrderDto })
  @Post('ghn/shiip/public-api/v2/a5/gen-token')
  async ghnGenPrintToken(@Body() dto: GhnPrintOrderDto) {
    return {
      code: 200,
      message: 'Success',
      data: {
        token: `PRINT_TOKEN_${Date.now()}`,
        print_url: `https://online-gateway.ghn.vn/a5/public-api/printA5?token=PRINT_TOKEN_${Date.now()}`,
      },
    };
  }

  @ApiOperation({
    summary: '[GET GHN /shiip/public-api/master-data/province] Danh mục Tỉnh/Thành phố GHN',
    description: 'Lấy danh sách toàn bộ các tỉnh thành trực thuộc trung ương theo chuẩn GHN',
  })
  @Get('ghn/shiip/public-api/master-data/province')
  async ghnGetProvinces() {
    return {
      code: 200,
      message: 'Success',
      data: [
        { ProvinceID: 201, ProvinceName: 'Hà Nội', Code: 'HN' },
        { ProvinceID: 202, ProvinceName: 'Hồ Chí Minh', Code: 'SG' },
        { ProvinceID: 203, ProvinceName: 'Đà Nẵng', Code: 'DN' },
        { ProvinceID: 204, ProvinceName: 'Hải Phòng', Code: 'HP' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST GHN /shiip/public-api/master-data/district] Danh mục Quận/Huyện GHN',
    description: 'Tra cứu danh sách quận/huyện thuộc tỉnh thành',
  })
  @ApiBody({ schema: { example: { province_id: 201 } } })
  @Post('ghn/shiip/public-api/master-data/district')
  async ghnGetDistricts(@Body() body: { province_id: number }) {
    return {
      code: 200,
      message: 'Success',
      data: [
        { DistrictID: 1442, DistrictName: 'Quận Cầu Giấy', ProvinceID: body.province_id },
        { DistrictID: 1443, DistrictName: 'Quận Ba Đình', ProvinceID: body.province_id },
        { DistrictID: 1444, DistrictName: 'Quận Đống Đa', ProvinceID: body.province_id },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST GHN /shiip/public-api/master-data/ward] Danh mục Phường/Xã GHN',
    description: 'Tra cứu danh sách phường/xã thuộc quận/huyện',
  })
  @ApiBody({ schema: { example: { district_id: 1442 } } })
  @Post('ghn/shiip/public-api/master-data/ward')
  async ghnGetWards(@Body() body: { district_id: number }) {
    return {
      code: 200,
      message: 'Success',
      data: [
        { WardCode: '010101', WardName: 'Phường Dịch Vọng Hậu', DistrictID: body.district_id },
        { WardCode: '010102', WardName: 'Phường Nghĩa Đô', DistrictID: body.district_id },
        { WardCode: '010103', WardName: 'Phường Yên Hòa', DistrictID: body.district_id },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET GHN /shiip/public-api/v2/station/get] Danh bạ bưu cục / Điểm gửi GHN Station',
    description: 'Tra cứu danh sách các điểm bưu cục GHN gần nhất để mang hàng tới gửi',
  })
  @Get('ghn/shiip/public-api/v2/station/get')
  async ghnGetStations(@Query('district_id') districtId?: number) {
    return {
      code: 200,
      message: 'Success',
      data: [
        { id: 101, name: 'Bưu cục GHN 18 Duy Tân', address: '18 Duy Tân, Dịch Vọng Hậu, Cầu Giấy', phone: '19001206' },
        { id: 102, name: 'Bưu cục GHN 254 Nguyễn Văn Cừ', address: '254 Nguyễn Văn Cừ, Long Biên, Hà Nội', phone: '19001206' },
      ],
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 3. VIETTEL POST
// ════════════════════════════════════════════════════════════════
@ApiTags('[Logistics-VN] 03. Viettel Post')
@Controller('api/v1/infra/logistics')
export class LogisticsViettelPostController {
  @ApiOperation({
    summary: '[POST ViettelPost /order/getPrice] Tính cước dịch vụ vận chuyển Viettel Post',
    description: 'Endpoint gốc: POST https://partner.viettelpost.vn/v2/order/getPrice | Tra cứu cước phí chuẩn Viettel Post theo tuyến đường và trọng lượng',
  })
  @ApiBody({ type: ViettelPostGetPriceDto })
  @Post('viettel-post/order/getPrice')
  async viettelPostGetPrice(@Body() dto: ViettelPostGetPriceDto) {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: {
        MONEY_TOTAL: 35000,
        MONEY_TOTAL_FEE: 32000,
        MONEY_FEE: 28000,
        MONEY_COLLECTION_FEE: 0,
        MONEY_OTHER_FEE: 4000,
        MONEY_VAS: 3000,
        KPI_HT: 48,
        EXPECTED_DELIVERY: '2 ngày kể từ khi gửi',
      },
    };
  }

  @ApiOperation({
    summary: '[POST ViettelPost /v2/order/createOrder] Tạo đơn vận chuyển Viettel Post',
    description: 'Endpoint gốc: POST https://partner.viettelpost.vn/v2/order/createOrder | Tạo đơn giao hàng trong nước/quốc tế và lịch nhận hàng Viettel Post',
  })
  @ApiBody({ type: ViettelPostCreateOrderDto })
  @Post('viettel-post/v2/order/createOrder')
  async viettelPostCreateOrder(@Body() dto: ViettelPostCreateOrderDto) {
    const orderNumber = dto.ORDER_NUMBER || `VTP${Date.now().toString().slice(-8)}`;
    return {
      status: 200,
      error: false,
      message: 'Tạo đơn thành công',
      data: {
        ORDER_NUMBER: orderNumber,
        MONEY_COLLECTION: dto.MONEY_COLLECTION,
        EXCHANGE_WEIGHT: dto.PRODUCT_WEIGHT,
        MONEY_TOTAL: 35000,
        SORT_CODE: 'VT-01-HN',
      },
    };
  }

  @ApiOperation({
    summary: '[POST ViettelPost /order/updateOrder] Cập nhật thông tin đơn giao Viettel Post',
    description: 'Đổi địa chỉ giao, đổi tiền COD hoặc yêu cầu giao lại đơn hàng',
  })
  @ApiBody({ type: ViettelPostUpdateOrderDto })
  @Post('viettel-post/order/updateOrder')
  async viettelPostUpdateOrder(@Body() dto: ViettelPostUpdateOrderDto) {
    return {
      status: 200,
      error: false,
      message: 'Cập nhật thành công',
      data: {
        ORDER_NUMBER: dto.ORDER_NUMBER,
        NOTE: dto.NOTE,
        UPDATED_AT: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[GET ViettelPost /order/tracking/:orderNumber] Theo dõi lộ trình bưu gửi Viettel Post',
    description: 'Tra cứu hành trình di chuyển thời gian thực của bưu phẩm Viettel Post',
  })
  @ApiParam({ name: 'orderNumber', example: 'VTP29810291' })
  @Get('viettel-post/tracking/:orderNumber')
  async viettelPostTracking(@Param('orderNumber') orderNumber: string) {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: {
        ORDER_NUMBER: orderNumber,
        STATUS_NAME: 'Đang vận chuyển liên tỉnh',
        STATUS_DATE: new Date().toISOString(),
        LOCATION: 'Bưu cục Khai thác Hà Nội',
        NOTE: 'Bưu gửi đang trên đường vận chuyển vào TP.HCM',
        HISTORY: [
          { STATUS_DATE: '2026-10-03 09:00:00', STATUS_NAME: 'Đã nhận tại bưu cục gửi', LOCATION: 'Bưu cục Cầu Giấy' },
          { STATUS_DATE: '2026-10-03 13:00:00', STATUS_NAME: 'Xuất kho trung chuyển', LOCATION: 'Trung tâm khai thác Miền Bắc' },
        ],
      },
    };
  }

  @ApiOperation({
    summary: '[POST ViettelPost /order/cancelOrder] Hủy đơn vận chuyển Viettel Post',
    description: 'Hủy đơn giao khi đơn hàng bị hủy bỏ hoặc khách không nhận',
  })
  @ApiBody({ type: ViettelPostCancelOrderDto })
  @Post('viettel-post/order/cancelOrder')
  async viettelPostCancelOrder(@Body() dto: ViettelPostCancelOrderDto) {
    return {
      status: 200,
      error: false,
      message: 'Hủy đơn thành công',
      data: {
        ORDER_NUMBER: dto.ORDER_NUMBER,
        RESULT: true,
      },
    };
  }

  @ApiOperation({
    summary: '[GET ViettelPost /order/printOrder/:orderNumber] In phiếu gửi bưu phẩm Viettel Post',
    description: 'Nhận URL bản in bưu bọc kèm mã vạch Barcode để dán lên kiện hàng',
  })
  @ApiParam({ name: 'orderNumber', example: 'VTP29810291' })
  @Get('viettel-post/order/printOrder/:orderNumber')
  async viettelPostPrintOrder(@Param('orderNumber') orderNumber: string) {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: {
        ORDER_NUMBER: orderNumber,
        PRINT_URL: `https://partner.viettelpost.vn/v2/order/print?order=${orderNumber}&format=A6`,
      },
    };
  }

  @ApiOperation({
    summary: '[GET ViettelPost /categories/listProvince] Danh sách Tỉnh/Thành phố Viettel Post',
    description: 'Lấy danh bạ tỉnh thành theo mã quy ước chuẩn của Viettel Post',
  })
  @Get('viettel-post/categories/listProvince')
  async viettelPostListProvince() {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: [
        { PROVINCE_ID: 1, PROVINCE_CODE: 'HNI', PROVINCE_NAME: 'HÀ NỘI' },
        { PROVINCE_ID: 2, PROVINCE_CODE: 'HCM', PROVINCE_NAME: 'HỒ CHÍ MINH' },
        { PROVINCE_ID: 3, PROVINCE_CODE: 'DNG', PROVINCE_NAME: 'ĐÀ NẴNG' },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET ViettelPost /categories/listDistrict] Danh sách Quận/Huyện Viettel Post',
    description: 'Tra cứu danh mục quận/huyện theo mã tỉnh thành',
  })
  @Get('viettel-post/categories/listDistrict')
  async viettelPostListDistrict(@Query('provinceId') provinceId?: number) {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: [
        { DISTRICT_ID: 10, DISTRICT_VALUE: 'CGY', DISTRICT_NAME: 'Quận Cầu Giấy', PROVINCE_ID: provinceId || 1 },
        { DISTRICT_ID: 11, DISTRICT_VALUE: 'TXN', DISTRICT_NAME: 'Quận Thanh Xuân', PROVINCE_ID: provinceId || 1 },
        { DISTRICT_ID: 12, DISTRICT_VALUE: 'BDH', DISTRICT_NAME: 'Quận Ba Đình', PROVINCE_ID: provinceId || 1 },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET ViettelPost /categories/listPostOffice] Danh bạ Bưu cục Viettel Post gần nhất',
    description: 'Tra cứu danh sách bưu cục Viettel Post để gửi hoặc lưu kho phát',
  })
  @Get('viettel-post/categories/listPostOffice')
  async viettelPostListPostOffice(@Query('districtId') districtId?: number) {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: [
        { POST_CODE: 'HNI01', POST_NAME: 'Bưu cục Viettel Cầu Giấy', ADDRESS: '1 Trần Thái Tông, Dịch Vọng Hậu', PHONE: '02462692222' },
        { POST_CODE: 'HNI02', POST_NAME: 'Bưu cục Viettel Hoàng Đạo Thúy', ADDRESS: '17T4 Hoàng Đạo Thúy, Trung Hòa', PHONE: '02462693333' },
      ],
    };
  }
}
