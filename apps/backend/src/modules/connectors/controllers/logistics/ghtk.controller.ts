import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  GhtkCalculateFeeDto,
  GhtkCreateOrderDto,
  GhtkCancelOrderDto,
  GhtkReconciliationDto,
  GhtkPickAddressDto,
  GhtkUpdateCodDto,
  GhtkB2cAccountDto,
  GhtkAddProductDto,
} from '../../dto/finance-logistics.dto';

@ApiTags('[Logistics-VN] 01. Giao Hàng Tiết Kiệm (GHTK)')
@Controller('api/v1/infra/logistics')
export class LogisticsGhtkController {

  // ════════════════════════════════════════════════════════════════
  // 1. GHTK SHIPPING ORDER MANAGEMENT (QUẢN LÝ ĐƠN HÀNG)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Fee - Tính cước] [POST /ghtk/services/shipment/fee] Tính cước phí giao hàng GHTK',
    description: '[Thuộc danh mục: 01. Đơn hàng > Tính phí] Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/shipment/fee | Docs: https://docs.giaohangtietkiem.vn/ | Tính cước đường bộ hoặc đường bay, bảo hiểm hàng hóa',
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
    summary: '[Order - Tạo vận đơn] [POST /ghtk/services/shipment/order] Tạo vận đơn Giao Hàng Tiết Kiệm Express',
    description: '[Thuộc danh mục: 01. Đơn hàng > Đăng đơn] Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/shipment/order | Đẩy lệnh tạo vận đơn và cấp mã barcode giao hàng',
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
    summary: '[Order - B2C Đăng đơn] [POST /ghtk/services/shipment/b2c/order] Đăng đơn hàng B2C sàn TMĐT / Doanh nghiệp',
    description: '[Thuộc danh mục: 02. Doanh nghiệp > Đăng đơn B2C] Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/shipment/b2c/order | GHTK B2C API dành riêng cho nền tảng phần mềm & sàn',
  })
  @ApiBody({ type: GhtkCreateOrderDto })
  @Post('ghtk/services/shipment/b2c/order')
  async ghtkCreateB2cOrder(@Body() dto: GhtkCreateOrderDto) {
    const orderId = dto.order?.id || `B2C_${Date.now().toString().slice(-6)}`;
    const trackingCode = `B2C.22941.${orderId}`;
    return {
      success: true,
      message: 'Tiếp nhận đơn B2C thành công',
      order: {
        partner_id: orderId,
        label: trackingCode,
        status: 'ACCEPTED',
        estimated_deliver_time: '2 ngày',
        tracking_url: `https://i.ghtk.vn/${trackingCode}`,
      },
    };
  }

  @ApiOperation({
    summary: '[Tracking - Hành trình] [GET /ghtk/tracking/:trackingCode] Tra cứu hành trình vận đơn GHTK',
    description: '[Thuộc danh mục: 01. Đơn hàng > Trạng thái đơn] Endpoint gốc: GET https://services.giaohangtietkiem.vn/services/shipment/v2/{trackingCode} | Tra cứu tiến độ giao hàng và thông tin shipper',
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
    summary: '[Cancel - Hủy đơn] [POST /ghtk/cancel/:trackingCode] Hủy vận đơn GHTK',
    description: '[Thuộc danh mục: 01. Đơn hàng > Hủy đơn] Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/shipment/cancel/{trackingCode} | Hủy đơn trước khi shipper tiếp nhận bưu phẩm',
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
    summary: '[Label - In tem] [GET /ghtk/services/label/:trackingCode] Tải mã tem in phiếu gửi hàng GHTK A6',
    description: '[Thuộc danh mục: 01. Đơn hàng > In nhãn] Endpoint gốc: GET https://services.giaohangtietkiem.vn/services/label/{trackingCode} | Nhận URL file PDF/PNG in tem bưu phẩm kèm mã Barcode',
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
    summary: '[COD - Đổi tiền thu hộ] [POST /ghtk/services/shipment/update_cod] Điều chỉnh tiền thu hộ COD khi đơn đang giao',
    description: '[Thuộc danh mục: 01. Đơn hàng > Cập nhật COD] Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/shipment/update_cod',
  })
  @ApiBody({ type: GhtkUpdateCodDto })
  @Post('ghtk/services/shipment/update_cod')
  async ghtkUpdateCod(@Body() dto: GhtkUpdateCodDto) {
    return {
      success: true,
      tracking_code: dto.tracking_code,
      new_cod_amount: dto.new_cod_amount,
      updated_at: new Date().toISOString(),
      message: 'Đã cập nhật số tiền COD thành công trên hệ thống bưu tá',
    };
  }

  @ApiOperation({
    summary: '[OTP - Gửi lại OTP] [POST /ghtk/services/shipment/resend_otp] Gửi lại mã OTP giao hàng cho người nhận',
    description: '[Thuộc danh mục: 01. Đơn hàng > Gửi OTP] Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/shipment/resend_otp | Xác thực giao hàng an toàn qua OTP',
  })
  @ApiBody({ schema: { example: { tracking_code: 'S22941.ORD_123.981' } } })
  @Post('ghtk/services/shipment/resend_otp')
  async ghtkResendOtp(@Body() body: { tracking_code: string }) {
    return {
      success: true,
      tracking_code: body.tracking_code,
      otp_sent: true,
      expires_in: 300,
      message: 'Mã OTP xác thực đã được gửi tới số điện thoại người nhận',
    };
  }

  @ApiOperation({
    summary: '[Solutions - Gói giải pháp] [GET /ghtk/services/shipment/solutions] Danh sách gói giải pháp giao vận GHTK',
    description: '[Thuộc danh mục: 01. Đơn hàng > Danh sách giải pháp] Endpoint gốc: GET https://services.giaohangtietkiem.vn/services/shipment/solutions | Gói Chuẩn, XFast (giao siêu tốc), BBS (hàng nặng)',
  })
  @Get('ghtk/services/shipment/solutions')
  async ghtkGetSolutions() {
    return {
      success: true,
      solutions: [
        { id: 'STANDARD', name: 'GHTK Chuẩn Đường Bộ', max_weight: 20000 },
        { id: 'XFAST', name: 'GHTK XFast 2-4 Giờ Nội Thành', max_weight: 5000 },
        { id: 'FLY', name: 'GHTK Bay Nhanh Liên Tỉnh', max_weight: 10000 },
        { id: 'BBS', name: 'GHTK Big & Bulky Hàng Cồng Kềnh', max_weight: 100000 },
      ],
    };
  }

  // ════════════════════════════════════════════════════════════════
  // 2. DOANH NGHIỆP, KHO BÃI & ĐỊA CHỈ (ENTERPRISE & ADDRESS)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[B2C - Tạo tài khoản đối tác] [POST /ghtk/services/shipment/b2c/account] Khởi tạo tài khoản shop đối tác B2C',
    description: '[Thuộc danh mục: 02. Doanh nghiệp > Tạo tài khoản B2C] Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/shipment/b2c/account',
  })
  @ApiBody({ type: GhtkB2cAccountDto })
  @Post('ghtk/services/shipment/b2c/account')
  async ghtkCreateB2cAccount(@Body() dto: GhtkB2cAccountDto) {
    return {
      success: true,
      partner_code: dto.partner_code,
      api_token: `GHTK_TOKEN_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[B2C - Kiểm tra tài khoản] [GET /ghtk/services/shipment/b2c/account/:partnerCode] Tra cứu tài khoản đối tác B2C đã đăng ký',
    description: '[Thuộc danh mục: 02. Doanh nghiệp > Tài khoản đã đăng ký] Endpoint gốc: GET https://services.giaohangtietkiem.vn/services/shipment/b2c/account/{partnerCode}',
  })
  @ApiParam({ name: 'partnerCode', example: 'SHOP_FASHION_01' })
  @Get('ghtk/services/shipment/b2c/account/:partnerCode')
  async ghtkGetB2cAccount(@Param('partnerCode') partnerCode: string) {
    return {
      success: true,
      partner_code: partnerCode,
      status: 'ACTIVE',
      contract_signed: true,
      cod_cycle: '2-4-6',
    };
  }

  @ApiOperation({
    summary: '[Warehouse - Danh sách kho] [GET /ghtk/services/shipment/list_pick_add] Danh sách địa chỉ kho lấy hàng GHTK',
    description: '[Thuộc danh mục: 03. Địa chỉ & Sản phẩm > Danh sách kho] Endpoint gốc: GET https://services.giaohangtietkiem.vn/services/shipment/list_pick_add',
  })
  @Get('ghtk/services/shipment/list_pick_add')
  async ghtkListPickAddresses() {
    return {
      success: true,
      data: [
        { pick_address_id: 'ADDR_HN_01', pick_name: 'Kho Cầu Giấy', address: '18 Duy Tân', province: 'Hà Nội', is_default: true },
        { pick_address_id: 'ADDR_HCM_01', pick_name: 'Kho Tân Bình', address: 'Kho C4 Tân Bình', province: 'TP.HCM', is_default: false },
      ],
    };
  }

  @ApiOperation({
    summary: '[Warehouse - Thêm kho] [POST /ghtk/services/shipment/pick_add] Thêm mới địa chỉ kho hàng lấy bưu phẩm',
    description: '[Thuộc danh mục: 03. Địa chỉ & Sản phẩm > Thêm kho] Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/shipment/pick_add',
  })
  @ApiBody({ type: GhtkPickAddressDto })
  @Post('ghtk/services/shipment/pick_add')
  async ghtkAddPickAddress(@Body() dto: GhtkPickAddressDto) {
    return {
      success: true,
      pick_address_id: `ADDR_${Date.now()}`,
      ...dto,
      created_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Address - Địa chỉ đặc biệt] [GET /ghtk/services/shipment/specific_addresses] Danh mục tuyến địa bàn đặc biệt / hải đảo',
    description: '[Thuộc danh mục: 03. Địa chỉ & Sản phẩm > Địa chỉ đặc biệt] Endpoint gốc: GET https://services.giaohangtietkiem.vn/services/shipment/specific_addresses | Tra cứu phụ phí tuyến đảo Phú Quốc, Côn Đảo',
  })
  @Get('ghtk/services/shipment/specific_addresses')
  async ghtkGetSpecificAddresses() {
    return {
      success: true,
      data: [
        { code: 'ISLAND_PQ', name: 'Đảo Phú Quốc, Kiên Giang', surcharge: 15000 },
        { code: 'ISLAND_CD', name: 'Côn Đảo, Bà Rịa Vũng Tàu', surcharge: 25000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[PickShift - Ca lấy hàng] [GET /ghtk/services/shipment/pick-shifts] Tra cứu danh sách ca lấy hàng linh hoạt',
    description: '[Thuộc danh mục: 01. Đơn hàng > Ca lấy hàng] Lấy các khung giờ bưu tá có thể qua kho lấy hàng trong ngày',
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
    summary: '[Hub - Điểm gửi hàng] [GET /ghtk/services/shipment/list_hub] Danh sách bưu cục / Hub gửi hàng GHTK',
    description: '[Thuộc danh mục: 01. Đơn hàng > Bưu cục Hub] Tra cứu danh sách điểm tiếp nhận hàng hóa GHTK trên toàn quốc',
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

  // ════════════════════════════════════════════════════════════════
  // 3. SẢN PHẨM & TÀI CHÍNH ĐỐI SOÁT (PRODUCTS & FINANCE)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Product - Danh sách sản phẩm] [GET /ghtk/services/products/list] Tra cứu thông tin sản phẩm đã đăng ký GHTK',
    description: '[Thuộc danh mục: 03. Địa chỉ & Sản phẩm > Thông tin sản phẩm] Endpoint gốc: GET https://services.giaohangtietkiem.vn/services/products/list',
  })
  @Get('ghtk/services/products/list')
  async ghtkListProducts() {
    return {
      success: true,
      products: [
        { product_code: 'TSHIRT-WHT-L', name: 'Áo Thun Cotton Compact 100%', weight: 250, retail_price: 250000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Product - Khai báo sản phẩm] [POST /ghtk/services/products/add] Khai báo sản phẩm mới lên hệ thống GHTK',
    description: '[Thuộc danh mục: 03. Địa chỉ & Sản phẩm > Thêm sản phẩm] Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/products/add',
  })
  @ApiBody({ type: GhtkAddProductDto })
  @Post('ghtk/services/products/add')
  async ghtkAddProduct(@Body() dto: GhtkAddProductDto) {
    return {
      success: true,
      product_id: Date.now(),
      ...dto,
      created_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Statement - Đối soát COD] [POST /ghtk/services/statement/reconciliation] Báo cáo đối soát tiền thu hộ COD',
    description: '[Thuộc danh mục: 01. Đơn hàng > Đối soát COD] Endpoint gốc: POST https://services.giaohangtietkiem.vn/services/statement/reconciliation | Đối soát các vận đơn đã phát thành công',
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

  @ApiOperation({
    summary: '[Statement - Lịch sử chuyển tiền] [GET /ghtk/services/statement/cod_history] Lịch sử thanh toán và biến động tiền COD',
    description: '[Thuộc danh mục: 01. Đơn hàng > Lịch sử chuyển COD] Endpoint gốc: GET https://services.giaohangtietkiem.vn/services/statement/cod_history',
  })
  @Get('ghtk/services/statement/cod_history')
  async ghtkGetCodHistory() {
    return {
      success: true,
      transfers: [
        { id: 'TRANS_2026_01', date: '2026-10-02', amount: 15420000, bank_account: 'VCB - 001100****', status: 'SUCCESS' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Webhook - Cập nhật trạng thái] [POST /ghtk/services/webhook/callback] Webhook nhận thông báo trạng thái đơn realtime',
    description: '[Thuộc danh mục: 04. Webhook > Trạng thái đơn realtime] Endpoint gốc: POST Webhook Listener | GHTK đẩy sự kiện: Lấy hàng, Đang giao, Đã giao, Chờ giao lại, Chuyển hoàn',
  })
  @Post('ghtk/services/webhook/callback')
  async ghtkWebhookCallback(@Body() body: any) {
    return {
      success: true,
      received: true,
      label_id: body.label_id || 'S22941.TEST.981',
      status_id: body.status_id || 5,
      processed_at: new Date().toISOString(),
    };
  }
}
