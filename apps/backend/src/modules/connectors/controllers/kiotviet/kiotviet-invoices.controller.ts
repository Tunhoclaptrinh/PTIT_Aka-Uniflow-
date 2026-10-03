import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  KiotVietCreateOrderDto,
  KiotVietUpdateOrderDto,
  KiotVietCreateBookingDto,
  KiotVietReturnInvoiceDto,
  KiotVietPaymentDto,
} from '../../dto/pos-kiotviet.dto';

@ApiTags('[POS-KiotViet] 01. Hóa đơn & Đặt hàng (Invoices & Orders)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietInvoicesController {

  @ApiOperation({
    summary: '[POST /invoices] Tạo hóa đơn bán lẻ KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/invoices | Docs: https://developer.kiotviet.vn/#/invoices/create | Khởi tạo hóa đơn bán lẻ trực tiếp từ cửa hàng lên KiotViet Open API',
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
    summary: '[GET /invoices] Danh sách hóa đơn KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/invoices | Docs: https://developer.kiotviet.vn/#/invoices/list | Truy vấn danh sách hóa đơn bán hàng KiotViet',
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
    summary: '[GET /invoices/:id] Chi tiết hóa đơn KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/invoices/{id} | Docs: https://developer.kiotviet.vn/#/invoices/detail | Lấy thông tin chi tiết một hóa đơn theo ID',
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
    summary: '[PUT /invoices/:id] Cập nhật hóa đơn KiotViet',
    description: 'Endpoint gốc: PUT https://public.kiotapi.com/invoices/{id} | Docs: https://developer.kiotviet.vn/#/invoices/update | Cập nhật ghi chú hóa đơn bán hàng',
  })
  @ApiParam({ name: 'id', example: '182' })
  @ApiBody({ type: KiotVietUpdateOrderDto })
  @Put('invoices/:id')
  async updateOrder(@Param('id') id: string, @Body() dto: KiotVietUpdateOrderDto) {
    return { responseStatus: 'success', data: { orderId: Number(id) || dto.orderId, updated: true } };
  }

  @ApiOperation({
    summary: '[DELETE /invoices/:id] Hủy hóa đơn KiotViet',
    description: 'Endpoint gốc: DELETE https://public.kiotapi.com/invoices/{id} | Docs: https://developer.kiotviet.vn/#/invoices/delete | Hủy bỏ hóa đơn bán hàng trên hệ thống KiotViet',
  })
  @ApiParam({ name: 'id', example: '182' })
  @Delete('invoices/:id')
  async deleteOrder(@Param('id') id: string) {
    return { responseStatus: 'success', message: `Đã hủy hóa đơn KiotViet #${id}` };
  }

  @ApiOperation({
    summary: '[POST /orders] Tạo đơn đặt hàng trước KiotViet (Booking)',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/orders | Docs: https://developer.kiotviet.vn/#/orders/create | Tạo đơn đặt hàng trước và thu tiền cọc',
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
    summary: '[GET /orders] Danh sách đơn đặt hàng KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/orders | Docs: https://developer.kiotviet.vn/#/orders/list | Tra cứu danh mục đơn đặt hàng trước',
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
    summary: '[POST /returns] Lập phiếu trả hàng KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/returns | Docs: https://developer.kiotviet.vn/#/returns/create | Tạo phiếu nhận lại hàng trả từ khách và hoàn tiền KiotViet',
  })
  @ApiBody({ type: KiotVietReturnInvoiceDto })
  @Post('returns')
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
    summary: '[GET /returns] Danh sách phiếu trả hàng KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/returns | Docs: https://developer.kiotviet.vn/#/returns/list | Tra cứu danh sách phiếu trả hàng của khách',
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
    summary: '[POST /payments] Ghi nhận thanh toán hóa đơn KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/payments | Docs: https://developer.kiotviet.vn/#/payments | Ghi nhận thanh toán hóa đơn tiền mặt, chuyển khoản VietQR, quẹt thẻ POS',
  })
  @ApiBody({ type: KiotVietPaymentDto })
  @Post('payments')
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
}
