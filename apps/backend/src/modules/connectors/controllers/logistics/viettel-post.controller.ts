import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  ViettelPostGetPriceDto,
  ViettelPostCreateOrderDto,
  ViettelPostUpdateOrderDto,
  ViettelPostCancelOrderDto,
  ViettelPostLoginDto,
  ViettelPostRegisterInventoryDto,
  ViettelPostWebhookDto,
} from '../../dto/finance-logistics.dto';

@ApiTags('[05. Logistics-VN] 03. Viettel Post')
@Controller('api/v1/infra/logistics')
export class LogisticsViettelPostController {

  // ════════════════════════════════════════════════════════════════
  // 1. AUTHENTICATION & USER PROFILE (XÁC THỰC ĐỐI TÁC)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Auth - Đăng nhập đối tác] [POST /viettel-post/v2/user/Login] Đăng nhập tài khoản đối tác Viettel Post lấy Token',
    description: '[Thuộc danh mục: 01. Xác thực > Login Đối tác] Endpoint gốc: POST https://partner.viettelpost.vn/v2/user/Login | Docs: https://partner.viettelpost.vn/ | Lấy token xác thực cho các request tiếp theo',
  })
  @ApiBody({ type: ViettelPostLoginDto })
  @Post('viettel-post/v2/user/Login')
  async viettelPostLogin(@Body() dto: ViettelPostLoginDto) {
    return {
      status: 200,
      error: false,
      message: 'Đăng nhập thành công',
      data: {
        token: `VTP_TOKEN_${Date.now()}`,
        userId: 102938,
        userName: dto.USERNAME,
        expiresIn: 2592000,
      },
    };
  }

  @ApiOperation({
    summary: '[Auth - Đăng nhập VTP] [POST /viettel-post/v2/user/LoginVTP] Đăng nhập tài khoản cá nhân Viettel Post',
    description: '[Thuộc danh mục: 01. Xác thực > Login VTP] Endpoint gốc: POST https://partner.viettelpost.vn/v2/user/LoginVTP',
  })
  @ApiBody({ type: ViettelPostLoginDto })
  @Post('viettel-post/v2/user/LoginVTP')
  async viettelPostLoginVtp(@Body() dto: ViettelPostLoginDto) {
    return {
      status: 200,
      error: false,
      message: 'Đăng nhập VTP thành công',
      data: { token: `VTP_APP_TOKEN_${Date.now()}`, phone: dto.USERNAME },
    };
  }

  @ApiOperation({
    summary: '[User - Thông tin tài khoản] [GET /viettel-post/v2/user/owner] Thông tin tài khoản và hạn mức tín dụng',
    description: '[Thuộc danh mục: 01. Xác thực > Thông tin tài khoản] Endpoint gốc: GET https://partner.viettelpost.vn/v2/user/owner',
  })
  @Get('viettel-post/v2/user/owner')
  async viettelPostGetOwner() {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: {
        userId: 102938,
        fullName: 'UniFlow Fulfillment Center',
        phone: '0988776655',
        creditLimit: 50000000,
        currentDebt: 3250000,
      },
    };
  }

  // ════════════════════════════════════════════════════════════════
  // 2. TÍNH CƯỚC & TẠO ĐƠN VẬN CHUYỂN (ORDERS & PRICING)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Price - Tính cước 1 gói] [POST /viettel-post/order/getPrice] Tính cước dịch vụ vận chuyển Viettel Post',
    description: '[Thuộc danh mục: 02. Đơn hàng > Tính cước] Endpoint gốc: POST https://partner.viettelpost.vn/v2/order/getPrice | Tra cứu cước phí chuẩn Viettel Post theo tuyến đường và trọng lượng',
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
    summary: '[Price - So sánh tất cả gói] [POST /viettel-post/order/getPriceAll] So sánh cước tất cả các gói dịch vụ VTP',
    description: '[Thuộc danh mục: 02. Đơn hàng > So sánh gói cước] Endpoint gốc: POST https://partner.viettelpost.vn/v2/order/getPriceAll | Liệt kê đồng thời cước VCN, VTK, VBS, VBE',
  })
  @ApiBody({ type: ViettelPostGetPriceDto })
  @Post('viettel-post/order/getPriceAll')
  async viettelPostGetPriceAll(@Body() dto: ViettelPostGetPriceDto) {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: [
        { MA_DICHVU: 'VCN', TEN_DICHVU: 'Chuyển phát nhanh', GIA_CUOC: 35000, THOI_GIAN: '24-48h' },
        { MA_DICHVU: 'VTK', TEN_DICHVU: 'Chuyển phát tiết kiệm', GIA_CUOC: 26000, THOI_GIAN: '48-72h' },
        { MA_DICHVU: 'VBS', TEN_DICHVU: 'Thương mại điện tử chuẩn', GIA_CUOC: 28000, THOI_GIAN: '2-3 ngày' },
        { MA_DICHVU: 'VHT', TEN_DICHVU: 'Hỏa tốc nội tỉnh', GIA_CUOC: 45000, THOI_GIAN: '4-8h' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Order - Tạo vận đơn] [POST /viettel-post/v2/order/createOrder] Tạo đơn vận chuyển Viettel Post Express',
    description: '[Thuộc danh mục: 02. Đơn hàng > Tạo đơn] Endpoint gốc: POST https://partner.viettelpost.vn/v2/order/createOrder | Tạo đơn giao hàng trong nước/quốc tế và lịch nhận hàng Viettel Post',
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
    summary: '[Order - Cập nhật đơn] [POST /viettel-post/order/updateOrder] Cập nhật thông tin đơn giao Viettel Post',
    description: '[Thuộc danh mục: 02. Đơn hàng > Sửa đơn] Endpoint gốc: POST https://partner.viettelpost.vn/v2/order/updateOrder | Đổi địa chỉ giao, đổi tiền COD hoặc yêu cầu giao lại đơn hàng',
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
    summary: '[Tracking - Lộ trình bưu gửi] [GET /viettel-post/tracking/:orderNumber] Theo dõi lộ trình bưu gửi Viettel Post',
    description: '[Thuộc danh mục: 02. Đơn hàng > Lộ trình bưu gửi] Endpoint gốc: GET https://partner.viettelpost.vn/v2/order/trackingOrder | Tra cứu hành trình di chuyển thời gian thực',
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
    summary: '[Cancel - Hủy đơn] [POST /viettel-post/order/cancelOrder] Hủy đơn vận chuyển Viettel Post',
    description: '[Thuộc danh mục: 02. Đơn hàng > Hủy đơn] Endpoint gốc: POST https://partner.viettelpost.vn/v2/order/cancelOrder | Hủy đơn giao khi đơn hàng bị hủy bỏ hoặc khách không nhận',
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
    summary: '[Print - In 1 đơn] [GET /viettel-post/order/printOrder/:orderNumber] In phiếu gửi bưu phẩm Viettel Post',
    description: '[Thuộc danh mục: 02. Đơn hàng > In nhãn] Endpoint gốc: GET https://partner.viettelpost.vn/v2/order/print | Nhận URL bản in bưu bọc kèm mã vạch Barcode A6',
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
    summary: '[Print - In hàng loạt] [POST /viettel-post/v2/order/printMultiOrder] In hàng loạt phiếu gửi Viettel Post',
    description: '[Thuộc danh mục: 02. Đơn hàng > In hàng loạt] Endpoint gốc: POST https://partner.viettelpost.vn/v2/order/printMultiOrder',
  })
  @ApiBody({ schema: { example: { order_numbers: ['VTP29810291', 'VTP29810292'] } } })
  @Post('viettel-post/v2/order/printMultiOrder')
  async viettelPostPrintMultiOrder(@Body() body: { order_numbers: string[] }) {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: {
        print_url: `https://partner.viettelpost.vn/v2/order/printMulti?orders=${(body.order_numbers || []).join(',')}`,
        total_orders: (body.order_numbers || []).length,
      },
    };
  }

  @ApiOperation({
    summary: '[COD - Đổi tiền thu hộ] [POST /viettel-post/v2/order/updateCOD] Điều chỉnh số tiền thu hộ COD đơn hàng',
    description: '[Thuộc danh mục: 02. Đơn hàng > Đổi tiền COD] Endpoint gốc: POST https://partner.viettelpost.vn/v2/order/updateCOD',
  })
  @ApiBody({ schema: { example: { order_number: 'VTP29810291', new_cod: 420000 } } })
  @Post('viettel-post/v2/order/updateCOD')
  async viettelPostUpdateCod(@Body() body: { order_number: string; new_cod: number }) {
    return {
      status: 200,
      error: false,
      message: 'Cập nhật tiền COD thành công',
      data: { order_number: body.order_number, new_cod: body.new_cod, updated_at: new Date().toISOString() },
    };
  }

  // ════════════════════════════════════════════════════════════════
  // 3. MASTER DATA & CATEGORIES (ĐỊA DANH, DỊCH VỤ, BƯU CỤC)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Category - Tỉnh/Thành] [GET /viettel-post/categories/listProvince] Danh sách Tỉnh/Thành phố Viettel Post',
    description: '[Thuộc danh mục: 03. Danh mục & Bưu cục > Tỉnh/Thành] Endpoint gốc: GET https://partner.viettelpost.vn/v2/categories/listProvince | Lấy danh bạ tỉnh thành chuẩn VTP',
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
    summary: '[Category - Quận/Huyện] [GET /viettel-post/categories/listDistrict] Danh sách Quận/Huyện Viettel Post',
    description: '[Thuộc danh mục: 03. Danh mục & Bưu cục > Quận/Huyện] Endpoint gốc: GET https://partner.viettelpost.vn/v2/categories/listDistrict',
  })
  @ApiQuery({ name: 'provinceId', example: 1, required: false })
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
    summary: '[Category - Phường/Xã] [GET /viettel-post/categories/listWards] Danh mục Phường/Xã Viettel Post',
    description: '[Thuộc danh mục: 03. Danh mục & Bưu cục > Phường/Xã] Endpoint gốc: GET https://partner.viettelpost.vn/v2/categories/listWards',
  })
  @ApiQuery({ name: 'districtId', example: 10, required: false })
  @Get('viettel-post/categories/listWards')
  async viettelPostListWards(@Query('districtId') districtId?: number) {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: [
        { WARDS_ID: 101, WARDS_NAME: 'Phường Dịch Vọng Hậu', DISTRICT_ID: districtId || 10 },
        { WARDS_ID: 102, WARDS_NAME: 'Phường Nghĩa Đô', DISTRICT_ID: districtId || 10 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Category - Bưu cục gần nhất] [GET /viettel-post/categories/listPostOffice] Danh bạ Bưu cục Viettel Post gần nhất',
    description: '[Thuộc danh mục: 03. Danh mục & Bưu cục > Bưu cục] Endpoint gốc: GET https://partner.viettelpost.vn/v2/categories/listPostOffice | Tra cứu danh sách bưu cục Viettel Post',
  })
  @ApiQuery({ name: 'districtId', example: 10, required: false })
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

  @ApiOperation({
    summary: '[Category - Dịch vụ cước] [GET /viettel-post/categories/listService] Danh sách gói dịch vụ chuyển phát VTP',
    description: '[Thuộc danh mục: 03. Danh mục & Bưu cục > Dịch vụ chuyển phát] Endpoint gốc: GET https://partner.viettelpost.vn/v2/categories/listService | VCN, VTK, VBS, VBE, VHT...',
  })
  @Get('viettel-post/categories/listService')
  async viettelPostListService() {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: [
        { SERVICE_CODE: 'VCN', SERVICE_NAME: 'Chuyển phát nhanh tài liệu & bưu phẩm' },
        { SERVICE_CODE: 'VTK', SERVICE_NAME: 'Chuyển phát tiết kiệm đường bộ' },
        { SERVICE_CODE: 'VBS', SERVICE_NAME: 'Dịch vụ giao hàng TMĐT chuẩn' },
        { SERVICE_CODE: 'VHT', SERVICE_NAME: 'Dịch vụ hỏa tốc hẹn giờ' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Category - Dịch vụ gia tăng] [GET /viettel-post/categories/listServiceExtra] Danh mục dịch vụ gia tăng VAS',
    description: '[Thuộc danh mục: 03. Danh mục & Bưu cục > Dịch vụ gia tăng] Endpoint gốc: GET https://partner.viettelpost.vn/v2/categories/listServiceExtra | Đồng kiểm, Báo phát, Giao tận tay, Bảo hiểm',
  })
  @Get('viettel-post/categories/listServiceExtra')
  async viettelPostListServiceExtra() {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: [
        { EXTRA_CODE: 'DK', EXTRA_NAME: 'Dịch vụ đồng kiểm khi nhận' },
        { EXTRA_CODE: 'BP', EXTRA_NAME: 'Báo phát qua tin nhắn SMS' },
        { EXTRA_CODE: 'BH', EXTRA_NAME: 'Bảo hiểm khai giá trị hàng hóa' },
      ],
    };
  }

  // ════════════════════════════════════════════════════════════════
  // 4. KHO BÃI & WEBHOOK (INVENTORY & WEBHOOK)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Inventory - Danh sách kho] [GET /viettel-post/v2/user/listInventory] Danh sách kho lấy hàng của shop',
    description: '[Thuộc danh mục: 04. Kho bãi & Webhook > Danh sách kho] Endpoint gốc: GET https://partner.viettelpost.vn/v2/user/listInventory',
  })
  @Get('viettel-post/v2/user/listInventory')
  async viettelPostListInventory() {
    return {
      status: 200,
      error: false,
      message: 'Thành công',
      data: [
        { GROUPADDRESS_ID: 1024, NAME: 'Kho Tổng Hà Nội - Viettel Post', ADDRESS: 'Số 1 Trần Thái Tông, Cầu Giấy', PHONE: '0988776655' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Inventory - Thêm kho mới] [POST /viettel-post/v2/user/registerInventory] Đăng ký thêm kho lấy hàng mới',
    description: '[Thuộc danh mục: 04. Kho bãi & Webhook > Đăng ký kho] Endpoint gốc: POST https://partner.viettelpost.vn/v2/user/registerInventory',
  })
  @ApiBody({ type: ViettelPostRegisterInventoryDto })
  @Post('viettel-post/v2/user/registerInventory')
  async viettelPostRegisterInventory(@Body() dto: ViettelPostRegisterInventoryDto) {
    return {
      status: 200,
      error: false,
      message: 'Tạo kho thành công',
      data: { GROUPADDRESS_ID: Date.now(), ...dto, CREATED_AT: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[Webhook - Cập nhật trạng thái] [POST /viettel-post/v2/webhook/callback] Webhook nhận trạng thái giao hàng realtime',
    description: '[Thuộc danh mục: 04. Kho bãi & Webhook > Webhook realtime] Endpoint gốc: POST Webhook Listener Viettel Post | Cập nhật các trạng thái: Đã lấy hàng, Đang vận chuyển, Giao thành công, Chờ giao lại',
  })
  @ApiBody({ type: ViettelPostWebhookDto })
  @Post('viettel-post/v2/webhook/callback')
  async viettelPostWebhookCallback(@Body() body: ViettelPostWebhookDto) {
    return {
      status: 200,
      error: false,
      message: 'Đã nhận sự kiện webhook Viettel Post',
      data: { ORDER_NUMBER: body.ORDER_NUMBER || 'VTP29810291', STATUS: body.STATUS_NAME || 'Delivered', RECEIVED_AT: new Date().toISOString() },
    };
  }
}
