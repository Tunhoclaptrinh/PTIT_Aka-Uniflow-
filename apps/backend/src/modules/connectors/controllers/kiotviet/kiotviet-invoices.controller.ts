import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  KiotVietCreateOrderDto,
  KiotVietUpdateOrderDto,
  KiotVietCreateBookingDto,
  KiotVietReturnInvoiceDto,
  KiotVietPaymentDto,
  KiotVietOrderProposalDto,
  KiotVietEInvoiceInfoDto,
  KiotVietUpdateBookingDto,
} from '../../dto/pos-kiotviet.dto';

@ApiTags('[02. POS-KiotViet] 01. Invoices & Orders (Hóa đơn, Đặt hàng & Đổi trả)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietInvoicesController {

  @ApiOperation({
    summary: '[Invoice - Hóa đơn bán lẻ] [POST /invoices] Tạo hóa đơn bán lẻ trực tiếp KiotViet',
    description: '[Thuộc danh mục: 2.12. Hóa đơn > Invoice] Endpoint gốc: POST https://public.kiotapi.com/invoices | Khởi tạo hóa đơn bán lẻ trực tiếp từ quầy POS lên KiotViet Open API',
  })
  @ApiBody({ type: KiotVietCreateOrderDto })
  @Post('invoices')
  async createOrder(@Body() dto: KiotVietCreateOrderDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        code: `HD${Date.now().toString().slice(-8)}`,
        branchId: dto.branchId,
        customerName: dto.customerName,
        totalPayment: dto.totalPayment,
        status: 3,
        statusValue: 'Hoàn thành',
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Invoice - Hóa đơn bán lẻ] [GET /invoices] Danh sách hóa đơn bán hàng KiotViet',
    description: '[Thuộc danh mục: 2.12. Hóa đơn > Invoice] Endpoint gốc: GET https://public.kiotapi.com/invoices | Truy vấn danh sách hóa đơn bán hàng KiotViet theo chi nhánh và khoảng thời gian',
  })
  @ApiQuery({ name: 'branchId', example: 101, required: false })
  @ApiQuery({ name: 'pageSize', example: 20, required: false })
  @Get('invoices')
  async listOrders(@Query('branchId') branchId: number = 101, @Query('pageSize') pageSize: number = 20) {
    return {
      total: 2,
      pageSize,
      data: [
        { id: 182, code: 'HD000182', total: 450000, branchName: 'Chi nhánh Cầu Giấy', createdDate: new Date().toISOString() },
        { id: 183, code: 'HD000183', total: 620000, branchName: 'Chi nhánh Cầu Giấy', createdDate: new Date().toISOString() },
      ],
    };
  }

  @ApiOperation({
    summary: '[Invoice - Hóa đơn bán lẻ] [GET /invoices/:id] Chi tiết hóa đơn bán lẻ theo ID',
    description: '[Thuộc danh mục: 2.12. Hóa đơn > Invoice] Endpoint gốc: GET https://public.kiotapi.com/invoices/{id} | Lấy thông tin chi tiết một hóa đơn, danh sách mặt hàng và tiền thuế',
  })
  @ApiParam({ name: 'id', example: '182' })
  @Get('invoices/:id')
  async getOrderById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: {
        id: Number(id),
        code: `HD000${id}`,
        branchId: 101,
        customerName: 'Khách vãng lai',
        total: 450000,
        statusValue: 'Hoàn thành',
        invoiceDetails: [
          { productCode: 'KV-SP-01', productName: 'Tai nghe Bluetooth Mini', quantity: 2, price: 150000 },
          { productCode: 'KV-SP-02', productName: 'Ốp lưng Silicon', quantity: 3, price: 50000 },
        ],
      },
    };
  }

  @ApiOperation({
    summary: '[Invoice - Hóa đơn bán lẻ] [PUT /invoices/:id] Cập nhật thông tin hóa đơn KiotViet',
    description: '[Thuộc danh mục: 2.12. Hóa đơn > Invoice] Endpoint gốc: PUT https://public.kiotapi.com/invoices/{id} | Cập nhật ghi chú hóa đơn bán hàng hoặc thông tin giao nhận',
  })
  @ApiParam({ name: 'id', example: '182' })
  @ApiBody({ type: KiotVietUpdateOrderDto })
  @Put('invoices/:id')
  async updateOrder(@Param('id') id: string, @Body() dto: KiotVietUpdateOrderDto) {
    return { responseStatus: 'success', data: { orderId: Number(id) || dto.orderId, updated: true } };
  }

  @ApiOperation({
    summary: '[Invoice - Hóa đơn bán lẻ] [DELETE /invoices/:id] Hủy bỏ hóa đơn bán hàng KiotViet',
    description: '[Thuộc danh mục: 2.12. Hóa đơn > Invoice] Endpoint gốc: DELETE https://public.kiotapi.com/invoices/{id} | Hủy bỏ hóa đơn bán hàng và hoàn trả tồn kho trên hệ thống KiotViet',
  })
  @ApiParam({ name: 'id', example: '182' })
  @Delete('invoices/:id')
  async deleteOrder(@Param('id') id: string) {
    return { responseStatus: 'success', message: `Đã hủy hóa đơn KiotViet #${id}` };
  }

  @ApiOperation({
    summary: '[Order - Đơn đặt hàng] [POST /orders] Tạo đơn đặt hàng trước KiotViet (Booking)',
    description: '[Thuộc danh mục: 2.5. Đặt hàng > Order] Endpoint gốc: POST https://public.kiotapi.com/orders | Tạo đơn đặt hàng trước, thu tiền cọc và gắn thông tin khách hàng',
  })
  @ApiBody({ type: KiotVietCreateBookingDto })
  @Post('orders')
  async createBooking(@Body() dto: KiotVietCreateBookingDto) {
    return {
      responseStatus: 'success',
      data: {
        orderId: Date.now(),
        orderCode: `DH${Date.now().toString().slice(-8)}`,
        customerName: dto.customerName,
        deposit: dto.deposit,
        status: 'Chờ xử lý',
      },
    };
  }

  @ApiOperation({
    summary: '[Order - Đơn đặt hàng] [GET /orders] Danh sách đơn đặt hàng trước KiotViet',
    description: '[Thuộc danh mục: 2.5. Đặt hàng > Order] Endpoint gốc: GET https://public.kiotapi.com/orders | Tra cứu danh mục đơn đặt hàng trước theo chi nhánh',
  })
  @ApiQuery({ name: 'branchId', example: 101, required: false })
  @Get('orders')
  async listBookings(@Query('branchId') branchId: number = 101) {
    return {
      total: 1,
      data: [{ orderCode: 'DH00091', customerName: 'Phạm Thu Hằng', deposit: 200000, status: 'Chờ giao hàng' }],
    };
  }

  @ApiOperation({
    summary: '[Order - Đơn đặt hàng] [GET /orders/:id] Chi tiết đơn đặt hàng theo ID',
    description: '[Thuộc danh mục: 2.5. Đặt hàng > Order] Endpoint gốc: GET https://public.kiotapi.com/orders/{id} | Xem thông tin chi tiết đơn đặt hàng và tiền cọc',
  })
  @ApiParam({ name: 'id', example: '91' })
  @Get('orders/:id')
  async getOrderBookingById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: {
        id: Number(id),
        code: `DH000${id}`,
        customerName: 'Phạm Thu Hằng',
        deposit: 200000,
        status: 'Chờ giao hàng',
      },
    };
  }

  @ApiOperation({
    summary: '[Order - Đơn đặt hàng] [PUT /orders/:id] Cập nhật đơn đặt hàng KiotViet',
    description: '[Thuộc danh mục: 2.5. Đặt hàng > Order] Endpoint gốc: PUT https://public.kiotapi.com/orders/{id} | Cập nhật thông tin chi tiết đơn đặt hàng',
  })
  @ApiParam({ name: 'id', example: '91' })
  @ApiBody({ type: KiotVietUpdateBookingDto })
  @Put('orders/:id')
  async updateBooking(@Param('id') id: string, @Body() body: KiotVietUpdateBookingDto) {
    return { responseStatus: 'success', data: { id: Number(id), status: body.status, description: body.description, updated: true } };
  }

  @ApiOperation({
    summary: '[Order - Đơn đặt hàng] [DELETE /orders/:id] Xóa đơn đặt hàng KiotViet',
    description: '[Thuộc danh mục: 2.5. Đặt hàng > Order] Endpoint gốc: DELETE https://public.kiotapi.com/orders/{id}?IsVoidPayment=true | Xóa đơn đặt hàng và tùy chọn hủy phiếu cọc',
  })
  @ApiParam({ name: 'id', example: '91' })
  @ApiQuery({ name: 'IsVoidPayment', required: false, example: true })
  @Delete('orders/:id')
  async deleteBooking(@Param('id') id: string, @Query('IsVoidPayment') isVoid: boolean = true) {
    return { responseStatus: 'success', message: `Xóa đơn đặt hàng #${id} thành công` };
  }

  @ApiOperation({
    summary: '[Return - Phiếu trả hàng] [POST /returns] Lập phiếu nhận hàng trả lại & hoàn tiền',
    description: '[Thuộc danh mục: 2.19. Trả hàng > Return] Endpoint gốc: POST https://public.kiotapi.com/returns | Tạo phiếu nhận lại hàng trả từ khách và hoàn tiền KiotViet',
  })
  @ApiBody({ type: KiotVietReturnInvoiceDto })
  @Post(['returns', 'returns/create'])
  async createReturn(@Body() dto: KiotVietReturnInvoiceDto) {
    return {
      responseStatus: 'success',
      data: {
        returnId: Date.now(),
        returnCode: `TH${Date.now().toString().slice(-8)}`,
        originalInvoiceCode: dto.originalInvoiceCode,
        returnTotal: dto.returnTotal,
        branchId: dto.branchId,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Return - Phiếu trả hàng] [GET /returns] Danh sách phiếu trả hàng KiotViet',
    description: '[Thuộc danh mục: 2.19. Trả hàng > Return] Endpoint gốc: GET https://public.kiotapi.com/returns | Tra cứu danh sách phiếu trả hàng của khách theo chi nhánh',
  })
  @ApiQuery({ name: 'branchId', example: 101, required: false })
  @Get('returns')
  async listReturns(@Query('branchId') branchId: number = 101) {
    return {
      total: 1,
      data: [{ returnCode: 'TH00012', originalInvoiceCode: 'HD000182', returnTotal: 150000, createdDate: new Date().toISOString() }],
    };
  }

  @ApiOperation({
    summary: '[Return - Phiếu trả hàng] [GET /returns/:id] Chi tiết phiếu trả hàng theo ID',
    description: '[Thuộc danh mục: 2.19. Trả hàng > Return] Endpoint gốc: GET https://public.kiotapi.com/returns/{id} | Xem chi tiết phiếu trả hàng và mặt hàng nhập lại kho',
  })
  @ApiParam({ name: 'id', example: '12' })
  @Get('returns/:id')
  async getReturnById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: {
        id: Number(id),
        code: `TH000${id}`,
        returnTotal: 150000,
        status: 'Đã hoàn tất',
      },
    };
  }

  @ApiOperation({
    summary: '[Payment - Thanh toán hóa đơn] [POST /payments] Ghi nhận thanh toán hóa đơn nợ KiotViet',
    description: '[Thuộc danh mục: 2.14. Sổ quỹ > Payment] Endpoint gốc: POST https://public.kiotapi.com/payments | Ghi nhận thanh toán hóa đơn nợ qua Tiền mặt, Chuyển khoản VietQR, Thẻ POS',
  })
  @ApiBody({ type: KiotVietPaymentDto })
  @Post(['payments', 'invoices/payment'])
  async recordPayment(@Body() dto: KiotVietPaymentDto) {
    return {
      responseStatus: 'success',
      data: {
        paymentId: Date.now(),
        invoiceCode: dto.invoiceCode,
        amount: dto.amount,
        paymentMethod: dto.paymentMethod,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Order Proposal - Đặt hàng nhập] [GET /orderproposals] Danh sách phiếu đặt hàng nhập từ NCC',
    description: '[Thuộc danh mục: 2.20. Đặt hàng nhập > Order Proposal] Endpoint gốc: GET https://public.kiotapi.com/orderproposals | Danh sách phiếu đề xuất đặt hàng nhập mua từ nhà cung cấp',
  })
  @Get('orderproposals')
  async listOrderProposals() {
    return {
      total: 1,
      data: [{ id: 101, code: 'DHN000101', supplierName: 'Công ty Tân Á', status: 'Chờ duyệt' }],
    };
  }

  @ApiOperation({
    summary: '[Order Proposal - Đặt hàng nhập] [GET /orderproposals/:id] Chi tiết phiếu đặt hàng nhập NCC',
    description: '[Thuộc danh mục: 2.20. Đặt hàng nhập > Order Proposal] Endpoint gốc: GET https://public.kiotapi.com/orderproposals/{id} | Chi tiết phiếu đặt hàng nhập theo ID',
  })
  @ApiParam({ name: 'id', example: '101' })
  @Get('orderproposals/:id')
  async getOrderProposalById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: { id: Number(id), code: `DHN000${id}`, supplierName: 'Công ty Tân Á', items: [{ productCode: 'KV-SP-01', quantity: 200 }] },
    };
  }

  @ApiOperation({
    summary: '[Order Proposal - Đặt hàng nhập] [POST /orderproposals] Tạo đề xuất đặt hàng nhập mua',
    description: '[Thuộc danh mục: 2.20. Đặt hàng nhập > Order Proposal] Endpoint gốc: POST https://public.kiotapi.com/orderproposals | Lập phiếu đề xuất đặt hàng nhập mua mới',
  })
  @ApiBody({ type: KiotVietOrderProposalDto })
  @Post('orderproposals')
  async createOrderProposal(@Body() dto: KiotVietOrderProposalDto) {
    return {
      responseStatus: 'success',
      data: { id: Date.now(), code: `DHN${Date.now().toString().slice(-8)}`, branchId: dto.branchId, supplierId: dto.supplierId },
    };
  }

  @ApiOperation({
    summary: '[E-Invoice - Hóa đơn điện tử] [PUT /einvoices/info] Cập nhật thông tin phát hành HĐĐT ngoài KiotViet',
    description: '[Thuộc danh mục: 2.28. Hóa đơn điện tử > E-Invoice] Endpoint gốc: PUT https://public.kiotapi.com/einvoices/info | Cập nhật thông tin HĐĐT (RefID, Số HĐ, Ký hiệu) phát hành từ hệ thống bên ngoài',
  })
  @ApiBody({ type: KiotVietEInvoiceInfoDto })
  @Put('einvoices/info')
  async updateEInvoiceInfo(@Body() dto: KiotVietEInvoiceInfoDto) {
    return {
      responseStatus: 'success',
      message: 'Cập nhật thông tin HĐĐT thành công',
      updatedCount: dto.data?.length || 0,
    };
  }
}
