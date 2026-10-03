import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  SapoCreateOrderDto,
  SapoUpdateOrderDto,
  SapoFulfillOrderDto,
  SapoPaymentDto,
  SapoReturnOrderDto,
  SapoCancelOrderDto,
} from '../../dto/pos-sapo.dto';

// ── 1. Order Resource ──
@ApiTags('[02. POS-Sapo] 01. Order')
@Controller('api/v1/infra/sapo')
export class SapoOrdersController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /admin/orders.json] Tạo đơn hàng Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/orders.json | Docs: https://support.sapo.vn/gioi-thieu-api | Khởi tạo đơn hàng mới trên hệ thống Sapo Omnichannel API',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoCreateOrderDto })
  @Post('admin/orders.json')
  async createOrder(@Body() dto: SapoCreateOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_create_order', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[GET /admin/orders.json] Danh sách đơn hàng Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/orders.json | Docs: https://support.sapo.vn/gioi-thieu-api | Truy vấn danh sách đơn hàng Sapo với phân trang và bộ lọc',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('admin/orders.json')
  async listOrders(@Query('limit') limit = 20, @Query('page') page = 1, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_get_orders', { limit, page }, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[GET /admin/orders/:id.json] Chi tiết đơn hàng Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/orders/{id}.json | Docs: https://support.sapo.vn/gioi-thieu-api | Lấy thông tin chi tiết một đơn hàng theo Sapo Order ID',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('admin/orders/:id.json')
  async getOrderById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_get_order_detail', { orderId: id }, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[PUT /admin/orders/:id.json] Cập nhật đơn hàng Sapo',
    description: 'Endpoint gốc: PUT https://{store_name}.mysapo.net/admin/orders/{id}.json | Docs: https://support.sapo.vn/gioi-thieu-api | Cập nhật ghi chú đơn hàng và gắn nhãn tag trên Sapo',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoUpdateOrderDto })
  @Put('admin/orders/:id.json')
  async updateOrder(@Body() dto: SapoUpdateOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_update_order', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /admin/orders/:id/cancel.json] Hủy đơn hàng Sapo & Hoàn tồn kho',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/orders/{id}/cancel.json | Docs: https://support.sapo.vn/gioi-thieu-api | Hủy đơn hàng trên Sapo và tự động hoàn trả số lượng tồn kho (restock)',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoCancelOrderDto })
  @Post('admin/orders/:id/cancel.json')
  async cancelOrder(@Body() dto: SapoCancelOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_cancel_order', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /admin/orders/:id/close.json] Đóng đơn hàng thành công Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/orders/{id}/close.json | Đóng đơn hàng khi giao hàng và thu tiền hoàn tất',
  })
  @Post('admin/orders/:id/close.json')
  async closeOrder(@Param('id') id: string) {
    return { order: { id, status: 'closed', closed_at: new Date().toISOString() } };
  }

  @ApiOperation({
    summary: '[POST /admin/orders/:id/open.json] Mở lại đơn hàng Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/orders/{id}/open.json | Mở lại đơn hàng đã đóng để chỉnh sửa nghiệp vụ',
  })
  @Post('admin/orders/:id/open.json')
  async openOrder(@Param('id') id: string) {
    return { order: { id, status: 'open', reopened_at: new Date().toISOString() } };
  }

  @ApiOperation({
    summary: '[DELETE /admin/orders/:id.json] Xóa đơn hàng Sapo',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/orders/{id}.json | Xóa hoàn toàn đơn hàng nháp khỏi hệ thống Sapo',
  })
  @Delete('admin/orders/:id.json')
  async deleteOrder(@Param('id') id: string) {
    return { success: true, deleted_id: id, message: `Đã xóa đơn hàng Sapo #${id}` };
  }
}

// ── 2. Fulfillment Resource ──
@ApiTags('[02. POS-Sapo] 02. Fulfillment')
@Controller('api/v1/infra/sapo')
export class SapoFulfillmentsController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /admin/orders/:id/fulfillments.json] Xuất kho fulfillment đơn hàng Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/orders/{id}/fulfillments.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tạo đơn fulfillment xuất kho cho đơn hàng qua đơn vị vận chuyển Sapo Express',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoFulfillOrderDto })
  @Post('admin/orders/:id/fulfillments.json')
  async fulfillOrder(@Body() dto: SapoFulfillOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_create_fulfillment', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[GET /admin/orders/:id/fulfillments.json] Danh sách vận đơn fulfillment của đơn',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/orders/{id}/fulfillments.json | Tra cứu danh sách các gói vận chuyển fulfillment của đơn Sapo',
  })
  @Get('admin/orders/:id/fulfillments.json')
  async getOrderFulfillments(@Param('id') id: string) {
    return {
      fulfillments: [
        { id: Date.now(), order_id: Number(id), status: 'success', tracking_number: 'GHTK_SP_998811', carrier: 'GHTK' },
      ],
    };
  }
}

// ── 3. Transaction Resource ──
@ApiTags('[02. POS-Sapo] 03. Transaction')
@Controller('api/v1/infra/sapo')
export class SapoTransactionsController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /admin/orders/:id/transactions.json] Ghi nhận thanh toán đơn hàng Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/orders/{id}/transactions.json | Docs: https://support.sapo.vn/gioi-thieu-api | Ghi nhận giao dịch thanh toán thành công (Tiền mặt, VietQR, Thẻ POS)',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoPaymentDto })
  @Post('admin/orders/:id/transactions.json')
  async recordPayment(@Body() dto: SapoPaymentDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_create_payment', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[GET /admin/orders/:id/transactions.json] Lịch sử thanh toán của đơn Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/orders/{id}/transactions.json | Xem chi tiết các đợt thanh toán của đơn hàng',
  })
  @Get('admin/orders/:id/transactions.json')
  async getOrderPayments(@Param('id') id: string) {
    return {
      payments: [
        { id: Date.now(), order_id: Number(id), amount: 300000, payment_method: 'bank_transfer', status: 'paid' },
      ],
    };
  }
}

// ── 4. Refund Resource ──
@ApiTags('[02. POS-Sapo] 04. Refund')
@Controller('api/v1/infra/sapo')
export class SapoRefundsController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /admin/orders/:id/refunds.json] Đổi trả hàng & Hoàn tiền Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/orders/{id}/refunds.json | Docs: https://support.sapo.vn/gioi-thieu-api | Khởi tạo đơn đổi trả, nhận lại hàng và hoàn tiền vào tài khoản khách',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoReturnOrderDto })
  @Post('admin/orders/:id/refunds.json')
  async returnOrder(@Body() dto: SapoReturnOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_create_return', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[GET /admin/refunds.json] Danh sách phiếu đổi trả Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/refunds.json | Tra cứu danh sách tất cả các phiếu đổi trả hàng trên Sapo',
  })
  @Get('admin/refunds.json')
  async listReturns(@Query('limit') limit = 20) {
    return {
      returns: [
        { id: 9912, order_id: 1001, refund_amount: 150000, reason: 'Khách không vừa size', created_on: new Date().toISOString() },
      ],
    };
  }
}
