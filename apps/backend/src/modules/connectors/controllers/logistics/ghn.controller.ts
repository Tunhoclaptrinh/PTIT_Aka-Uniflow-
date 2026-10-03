import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  GhnAvailableServicesDto,
  GhnFeeCalculationDto,
  GhnLeadtimeDto,
  GhnCreateOrderDto,
  GhnCancelOrderDto,
  GhnPrintOrderDto,
  GhnShopRegisterDto,
  GhnUpdateOrderDto,
  GhnUpdateCodDto,
  GhnCreateTicketDto,
} from '../../dto/finance-logistics.dto';

@ApiTags('[Logistics-VN] 02. Giao Hàng Nhanh (GHN)')
@Controller('api/v1/infra/logistics')
export class LogisticsGhnController {

  // ════════════════════════════════════════════════════════════════
  // 1. SHIPPING ORDER MANAGEMENT (TẠO, TÍNH PHÍ, CẬP NHẬT ĐƠN)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Services - Gói cước] [POST /ghn/.../available-services] Tra cứu gói cước GHN khả dụng',
    description: '[Thuộc danh mục: 01. Dịch vụ & Cước phí > Gói cước] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services | Docs: https://developer.ghn.vn/ | Danh sách gói dịch vụ GHN phù hợp với tuyến đường',
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
    summary: '[Fee - Tính cước] [POST /ghn/.../fee] Tính cước vận chuyển chuẩn GHN',
    description: '[Thuộc danh mục: 01. Dịch vụ & Cước phí > Tính cước] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee | Tính chính xác cước dựa trên trọng lượng, kích thước và bảo hiểm',
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
    summary: '[Leadtime - Thời gian giao] [POST /ghn/.../leadtime] Tính thời gian dự kiến giao (Leadtime)',
    description: '[Thuộc danh mục: 01. Dịch vụ & Cước phí > Leadtime] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime | Dự báo ngày giờ bưu tá giao hàng tới tay người nhận',
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
    summary: '[Order - Tạo vận đơn] [POST /ghn/.../create] Tạo vận đơn Giao Hàng Nhanh Express',
    description: '[Thuộc danh mục: 02. Đơn hàng > Tạo đơn] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create | Tạo vận đơn và hẹn tài xế lấy hàng GHN Express',
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
    summary: '[Order - Xem trước vận đơn] [POST /ghn/.../preview] Xem trước thông tin và cước phí vận đơn',
    description: '[Thuộc danh mục: 02. Đơn hàng > Xem trước] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/preview | Kiểm tra tuyến đường và tổng phí trước khi bấm tạo thật',
  })
  @ApiBody({ type: GhnCreateOrderDto })
  @Post('ghn/shiip/public-api/v2/shipping-order/preview')
  async ghnPreviewOrder(@Body() dto: GhnCreateOrderDto) {
    return {
      code: 200,
      message: 'Success',
      data: {
        total_fee: 31500,
        service_fee: 28000,
        insurance_fee: Math.round(dto.insurance_value * 0.005),
        expected_delivery_time: new Date(Date.now() + 86400000 * 2).toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Order - Chi tiết đơn] [POST /ghn/.../detail] Xem chi tiết vận đơn theo Order Code',
    description: '[Thuộc danh mục: 02. Đơn hàng > Chi tiết đơn] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail',
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
    summary: '[Order - Tra cứu mã đối tác] [POST /ghn/.../detail-by-client-code] Xem chi tiết đơn theo Client Order Code',
    description: '[Thuộc danh mục: 02. Đơn hàng > Chi tiết theo mã Shop] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/detail-by-client-code',
  })
  @ApiBody({ schema: { example: { client_order_code: 'ORD_UNIFLOW_9921' } } })
  @Post('ghn/shiip/public-api/v2/shipping-order/detail-by-client-code')
  async ghnOrderDetailByClientCode(@Body() body: { client_order_code: string }) {
    return {
      code: 200,
      message: 'Success',
      data: {
        client_order_code: body.client_order_code,
        order_code: 'GHN98127361',
        status: 'ready_to_pick',
        cod_amount: 520000,
      },
    };
  }

  @ApiOperation({
    summary: '[Order - Cập nhật thông tin] [POST /ghn/.../update] Cập nhật địa chỉ nhận, SĐT và ghi chú',
    description: '[Thuộc danh mục: 02. Đơn hàng > Sửa đơn] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/update',
  })
  @ApiBody({ type: GhnUpdateOrderDto })
  @Post('ghn/shiip/public-api/v2/shipping-order/update')
  async ghnUpdateOrder(@Body() dto: GhnUpdateOrderDto) {
    return {
      code: 200,
      message: 'Success',
      data: { order_code: dto.order_code, updated: true, updated_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[COD - Đổi tiền thu hộ] [POST /ghn/.../update_cod] Điều chỉnh số tiền thu hộ COD',
    description: '[Thuộc danh mục: 02. Đơn hàng > Đổi tiền COD] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/update_cod',
  })
  @ApiBody({ type: GhnUpdateCodDto })
  @Post('ghn/shiip/public-api/v2/shipping-order/update_cod')
  async ghnUpdateCod(@Body() dto: GhnUpdateCodDto) {
    return {
      code: 200,
      message: 'Success',
      data: { order_code: dto.order_code, cod_amount: dto.cod_amount, updated_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[Return - Yêu cầu hoàn hàng] [POST /ghn/.../return] Chuyển hoàn đơn hàng về kho người gửi',
    description: '[Thuộc danh mục: 02. Đơn hàng > Hoàn hàng] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/return',
  })
  @ApiBody({ schema: { example: { order_codes: ['GHN98127361'] } } })
  @Post('ghn/shiip/public-api/v2/shipping-order/return')
  async ghnReturnOrder(@Body() body: { order_codes: string[] }) {
    return {
      code: 200,
      message: 'Success',
      data: (body.order_codes || []).map((code) => ({ order_code: code, result: true })),
    };
  }

  @ApiOperation({
    summary: '[Cancel - Hủy đơn] [POST /ghn/.../cancel] Hủy vận đơn giao hàng GHN',
    description: '[Thuộc danh mục: 02. Đơn hàng > Hủy đơn] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel',
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
    summary: '[Storing - Lưu kho chờ giao] [POST /ghn/.../storing] Chuyển trạng thái lưu kho hẹn ngày giao lại',
    description: '[Thuộc danh mục: 02. Đơn hàng > Lưu kho] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/switch-status/storing',
  })
  @ApiBody({ schema: { example: { order_codes: ['GHN98127361'] } } })
  @Post('ghn/shiip/public-api/v2/switch-status/storing')
  async ghnStoringOrder(@Body() body: { order_codes: string[] }) {
    return {
      code: 200,
      message: 'Success',
      data: (body.order_codes || []).map((code) => ({ order_code: code, result: true })),
    };
  }

  // ════════════════════════════════════════════════════════════════
  // 2. IN ẤN TEM NHÃN PHIẾU GỬI (PRINTING SERVICES)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Print - Tạo Token in] [POST /ghn/.../gen-token] Tạo token in phiếu gửi hàng A5/80x80/52x70',
    description: '[Thuộc danh mục: 03. In ấn tem nhãn > Sinh mã in] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token',
  })
  @ApiBody({ type: GhnPrintOrderDto })
  @Post('ghn/shiip/public-api/v2/a5/gen-token')
  async ghnGenPrintToken(@Body() dto: GhnPrintOrderDto) {
    const token = `PRINT_TOKEN_${Date.now()}`;
    return {
      code: 200,
      message: 'Success',
      data: {
        token,
        print_url: `https://online-gateway.ghn.vn/a5/public-api/printA5?token=${token}`,
      },
    };
  }

  @ApiOperation({
    summary: '[Print - In khổ A5] [GET /ghn/.../printA5] URL xem và in phiếu gửi khổ A5',
    description: '[Thuộc danh mục: 03. In ấn tem nhãn > In A5] Endpoint gốc: GET https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/printA5',
  })
  @ApiQuery({ name: 'token', example: 'PRINT_TOKEN_123456' })
  @Get('ghn/shiip/public-api/v2/shipping-order/printA5')
  async ghnPrintA5(@Query('token') token: string) {
    return {
      code: 200,
      message: 'Success',
      data: { url: `https://online-gateway.ghn.vn/a5/public-api/printA5?token=${token}` },
    };
  }

  @ApiOperation({
    summary: '[Print - In tem nhiệt 80x80] [GET /ghn/.../print80x80] URL xem và in tem nhiệt 80x80mm',
    description: '[Thuộc danh mục: 03. In ấn tem nhãn > In 80x80] Endpoint gốc: GET https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/print80x80',
  })
  @ApiQuery({ name: 'token', example: 'PRINT_TOKEN_123456' })
  @Get('ghn/shiip/public-api/v2/shipping-order/print80x80')
  async ghnPrint80x80(@Query('token') token: string) {
    return {
      code: 200,
      message: 'Success',
      data: { url: `https://online-gateway.ghn.vn/a5/public-api/print80x80?token=${token}` },
    };
  }

  @ApiOperation({
    summary: '[Print - In tem nhỏ 52x70] [GET /ghn/.../print52x70] URL xem và in tem nhỏ 52x70mm',
    description: '[Thuộc danh mục: 03. In ấn tem nhãn > In 52x70] Endpoint gốc: GET https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/print52x70',
  })
  @ApiQuery({ name: 'token', example: 'PRINT_TOKEN_123456' })
  @Get('ghn/shiip/public-api/v2/shipping-order/print52x70')
  async ghnPrint52x70(@Query('token') token: string) {
    return {
      code: 200,
      message: 'Success',
      data: { url: `https://online-gateway.ghn.vn/a5/public-api/print52x70?token=${token}` },
    };
  }

  // ════════════════════════════════════════════════════════════════
  // 3. MASTER DATA (TỈNH THÀNH, BƯU CỤC, CA LẤY HÀNG)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Location - Tỉnh/Thành phố] [GET /ghn/.../province] Danh mục Tỉnh/Thành phố GHN',
    description: '[Thuộc danh mục: 04. Dữ liệu chuẩn > Tỉnh/Thành] Endpoint gốc: GET https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
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
    summary: '[Location - Quận/Huyện] [POST /ghn/.../district] Danh mục Quận/Huyện GHN',
    description: '[Thuộc danh mục: 04. Dữ liệu chuẩn > Quận/Huyện] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
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
    summary: '[Location - Phường/Xã] [POST /ghn/.../ward] Danh mục Phường/Xã GHN',
    description: '[Thuộc danh mục: 04. Dữ liệu chuẩn > Phường/Xã] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
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
    summary: '[Station - Điểm gửi bưu cục] [GET /ghn/.../station/get] Danh bạ bưu cục GHN Station',
    description: '[Thuộc danh mục: 04. Dữ liệu chuẩn > Bưu cục Station] Endpoint gốc: GET https://online-gateway.ghn.vn/shiip/public-api/v2/station/get',
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

  @ApiOperation({
    summary: '[PickShift - Ca lấy hàng] [GET /ghn/.../pick-shift] Danh mục ca lấy hàng GHN',
    description: '[Thuộc danh mục: 04. Dữ liệu chuẩn > Ca lấy hàng] Endpoint gốc: GET https://online-gateway.ghn.vn/shiip/public-api/master-data/pick-shift',
  })
  @Get('ghn/shiip/public-api/master-data/pick-shift')
  async ghnGetPickShifts() {
    return {
      code: 200,
      message: 'Success',
      data: [
        { id: 1, title: 'Ca Sáng (08h00 - 12h00)' },
        { id: 2, title: 'Ca Chiều (13h30 - 17h30)' },
        { id: 3, title: 'Ca Tối (18h00 - 21h00)' },
      ],
    };
  }

  // ════════════════════════════════════════════════════════════════
  // 4. CỬA HÀNG, KHIẾU NẠI & WEBHOOK (SHOPS, TICKETS & WEBHOOK)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Shop - Tạo kho lấy hàng] [POST /ghn/.../shop/register] Tạo mới cửa hàng / kho lấy hàng GHN',
    description: '[Thuộc danh mục: 05. Cửa hàng & Kho > Đăng ký shop] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/shop/register',
  })
  @ApiBody({ type: GhnShopRegisterDto })
  @Post('ghn/shiip/public-api/v2/shop/register')
  async ghnRegisterShop(@Body() dto: GhnShopRegisterDto) {
    return {
      code: 200,
      message: 'Success',
      data: { shop_id: 123456, ...dto, created_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[Shop - Danh sách kho] [GET /ghn/.../shop/all] Danh sách cửa hàng / kho đã tạo',
    description: '[Thuộc danh mục: 05. Cửa hàng & Kho > Danh sách shop] Endpoint gốc: GET https://online-gateway.ghn.vn/shiip/public-api/v2/shop/all',
  })
  @Get('ghn/shiip/public-api/v2/shop/all')
  async ghnListShops() {
    return {
      code: 200,
      message: 'Success',
      data: {
        shops: [
          { _id: 123456, name: 'Kho Fulfillment Cầu Giấy', phone: '0988999888', address: '18 Duy Tân, Cầu Giấy' },
        ],
      },
    };
  }

  @ApiOperation({
    summary: '[Ticket - Mở khiếu nại] [POST /ghn/.../ticket/create] Tạo yêu cầu khiếu nại / hỗ trợ giao hàng',
    description: '[Thuộc danh mục: 06. Chăm sóc khách hàng > Mở Ticket] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/ticket/create',
  })
  @ApiBody({ type: GhnCreateTicketDto })
  @Post('ghn/shiip/public-api/v2/ticket/create')
  async ghnCreateTicket(@Body() dto: GhnCreateTicketDto) {
    return {
      code: 200,
      message: 'Success',
      data: { ticket_id: `TCK_${Date.now()}`, ...dto, status: 'OPEN', created_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[Ticket - Chi tiết khiếu nại] [GET /ghn/.../ticket/detail] Chi tiết ticket hỗ trợ',
    description: '[Thuộc danh mục: 06. Chăm sóc khách hàng > Chi tiết Ticket] Endpoint gốc: GET https://online-gateway.ghn.vn/shiip/public-api/v2/ticket/detail',
  })
  @ApiQuery({ name: 'ticket_id', example: 'TCK_109283' })
  @Get('ghn/shiip/public-api/v2/ticket/detail')
  async ghnGetTicketDetail(@Query('ticket_id') ticketId: string) {
    return {
      code: 200,
      message: 'Success',
      data: {
        ticket_id: ticketId || 'TCK_109283',
        status: 'PROCESSING',
        cskh_assigned: 'Nguyễn Thị CSKH',
        description: 'Đã nhắc bưu tá liên hệ lại khách hàng trong sáng nay',
      },
    };
  }

  @ApiOperation({
    summary: '[Ticket - Phản hồi khiếu nại] [POST /ghn/.../ticket/reply] Gửi tin nhắn phản hồi ticket',
    description: '[Thuộc danh mục: 06. Chăm sóc khách hàng > Phản hồi Ticket] Endpoint gốc: POST https://online-gateway.ghn.vn/shiip/public-api/v2/ticket/reply',
  })
  @ApiBody({ schema: { example: { ticket_id: 'TCK_109283', message: 'Khách hẹn giao trước 17h' } } })
  @Post('ghn/shiip/public-api/v2/ticket/reply')
  async ghnReplyTicket(@Body() body: { ticket_id: string; message: string }) {
    return {
      code: 200,
      message: 'Success',
      data: { ticket_id: body.ticket_id, replied: true, time: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[Webhook - Cập nhật trạng thái] [POST /ghn/.../order-callback] Webhook nhận sự kiện đơn realtime',
    description: '[Thuộc danh mục: 07. Webhook > Trạng thái đơn GHN] Endpoint gốc: POST Webhook Listener | GHN đẩy sự kiện: picking, picked, delivering, delivered, return...',
  })
  @Post('ghn/shiip/public-api/v2/webhook/order-callback')
  async ghnWebhookCallback(@Body() body: any) {
    return {
      code: 200,
      message: 'Success',
      data: { order_code: body.OrderCode || 'GHN98127361', status: body.Status || 'delivered', received_at: new Date().toISOString() },
    };
  }
}
