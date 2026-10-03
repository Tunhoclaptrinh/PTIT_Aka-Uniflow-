import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanCreateOrderDto,
  HaravanUpdateOrderDto,
  HaravanCancelOrderDto,
  HaravanOrderTagsDto,
  HaravanAssignOrderDto,
  HaravanCreateDraftOrderDto,
  HaravanFulfillOrderDto,
  HaravanTransactionDto,
  HaravanRefundDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 1. ORDER RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 01. Order')
@Controller('api/v1/infra/haravan')
export class HaravanOrdersController {
  @ApiOperation({
    summary: '[POST /com/orders.json] Tạo đơn hàng Haravan',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/orders.json | Docs: https://docs.haravan.com/docs/omni-apis/orders/ | Khởi tạo đơn hàng mới trên hệ thống Haravan Omnichannel',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateOrderDto })
  @Post('com/orders.json')
  async createOrder(@Body() dto: HaravanCreateOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    const total = dto.payload?.order?.total_price || 580000;
    return {
      order: {
        id: Date.now(),
        order_number: `HRV${Date.now().toString().slice(-6)}`,
        email: dto.payload?.order?.email || 'customer@example.com',
        total_price: total,
        financial_status: 'paid',
        fulfillment_status: 'unfulfilled',
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/orders.json] Danh sách đơn hàng Haravan',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/orders.json | Docs: https://docs.haravan.com/docs/omni-apis/orders/ | Truy vấn danh sách đơn hàng Haravan đa kênh',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'status', example: 'open', required: false })
  @Get('com/orders.json')
  async listOrders(@Query('limit') limit = 10, @Query('page') page = 1, @Headers('x-uniflow-mode') mode?: string) {
    return {
      orders: [
        { id: 1001, order_number: 'HRV1001', total_price: 350000, financial_status: 'paid', fulfillment_status: 'unfulfilled', email: 'khachhang1@gmail.com' },
        { id: 1002, order_number: 'HRV1002', total_price: 520000, financial_status: 'pending', fulfillment_status: null, email: 'khachhang2@gmail.com' },
      ],
      page: Number(page),
      limit: Number(limit),
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[GET /com/orders/count.json] Đếm tổng số đơn hàng',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/orders/count.json | Lấy tổng số đơn theo bộ lọc trạng thái',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiQuery({ name: 'status', example: 'open', required: false })
  @Get('com/orders/count.json')
  async countOrders(@Headers('x-uniflow-mode') mode?: string) {
    return { count: 1250, mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[GET /com/orders/:id.json] Chi tiết đơn hàng Haravan',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/orders/{id}.json | Docs: https://docs.haravan.com/docs/omni-apis/orders/ | Lấy thông tin chi tiết một đơn hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1001' })
  @Get('com/orders/:id.json')
  async getOrderById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      order: {
        id: Number(id),
        order_number: `HRV${id}`,
        total_price: 580000,
        financial_status: 'paid',
        fulfillment_status: 'unfulfilled',
        billing_address: { first_name: 'Hoàng', last_name: 'Minh', phone: '0933221100', address1: '789 Điện Biên Phủ, Bình Thạnh' },
        shipping_address: { first_name: 'Hoàng', last_name: 'Minh', phone: '0933221100', address1: '789 Điện Biên Phủ, Bình Thạnh' },
        line_items: [{ id: 10293, variant_id: 881294, quantity: 2, price: 290000, title: 'Áo Polo Thể Thao Nam' }],
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[PUT /com/orders/:id.json] Cập nhật đơn hàng Haravan',
    description: 'Endpoint gốc: PUT https://apis.haravan.com/com/orders/{id}.json | Cập nhật ghi chú và nhãn tags đơn hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1001' })
  @ApiBody({ type: HaravanUpdateOrderDto })
  @Put('com/orders/:id.json')
  async updateOrder(@Param('id') id: string, @Body() dto: HaravanUpdateOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      order: {
        id: Number(id) || dto.orderId,
        note: dto.note,
        tags: dto.tags?.join(','),
        shipping_address: dto.shipping_address,
        updated_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[POST /com/orders/:id/confirm.json] Xác nhận đơn hàng',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/orders/{id}/confirm.json | Chuyển trạng thái đơn sang Đã xác nhận chuẩn bị hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1001' })
  @Post('com/orders/:id/confirm.json')
  async confirmOrder(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      order: { id: Number(id), confirmed_at: new Date().toISOString(), status: 'confirmed', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[POST /com/orders/:id/close.json] Đóng đơn hàng',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/orders/{id}/close.json | Đóng đơn hàng khi đã hoàn tất toàn bộ chu trình giao nhận',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1001' })
  @Post('com/orders/:id/close.json')
  async closeOrder(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      order: { id: Number(id), closed_at: new Date().toISOString(), status: 'closed', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[POST /com/orders/:id/open.json] Mở lại đơn hàng',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/orders/{id}/open.json | Mở lại đơn đã bị đóng hoặc hủy',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1001' })
  @Post('com/orders/:id/open.json')
  async openOrder(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      order: { id: Number(id), closed_at: null, status: 'open', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[POST /com/orders/:id/cancel.json] Hủy đơn hàng và hoàn tồn',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/orders/{id}/cancel.json | Hủy đơn hàng trên Haravan và hoàn trả tồn kho tự động',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1001' })
  @ApiBody({ type: HaravanCancelOrderDto })
  @Post('com/orders/:id/cancel.json')
  async cancelOrder(@Param('id') id: string, @Body() dto: HaravanCancelOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      order: {
        id: Number(id) || dto.order_id,
        cancelled_at: new Date().toISOString(),
        cancel_reason: dto.reason,
        restocked: dto.restock,
        financial_status: 'refunded',
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[POST /com/orders/:id/tags.json] Gán thẻ Tag cho đơn hàng',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/orders/{id}/tags.json | Cập nhật nhãn phân loại đơn hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1001' })
  @ApiBody({ type: HaravanOrderTagsDto })
  @Post('com/orders/:id/tags.json')
  async addTags(@Param('id') id: string, @Body() dto: HaravanOrderTagsDto, @Headers('x-uniflow-mode') mode?: string) {
    return { order: { id: Number(id), tags: dto.tags, mode: mode || 'SANDBOX' } };
  }

  @ApiOperation({
    summary: '[POST /com/orders/:id/assign.json] Phân công nhân viên xử lý đơn',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/orders/{id}/assign.json | Gán đơn hàng cho chuyên viên phụ trách chốt đơn',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1001' })
  @ApiBody({ type: HaravanAssignOrderDto })
  @Post('com/orders/:id/assign.json')
  async assignOrder(@Param('id') id: string, @Body() dto: HaravanAssignOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return { order: { id: Number(id), assigned_user_id: dto.user_id, status: 'assigned', mode: mode || 'SANDBOX' } };
  }

  @ApiOperation({
    summary: '[DELETE /com/orders/:id.json] Xóa đơn hàng Haravan',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/orders/{id}.json | Xóa đơn hàng nháp khỏi hệ thống Haravan',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1001' })
  @Delete('com/orders/:id.json')
  async deleteOrder(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), message: 'Xóa đơn hàng thành công', mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 2. DRAFT ORDER RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 02. Draft Order')
@Controller('api/v1/infra/haravan')
export class HaravanDraftOrdersController {
  @ApiOperation({
    summary: '[POST /com/draft_orders.json] Tạo đơn hàng đặt trước (Draft Order)',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/draft_orders.json | Lập đơn đặt hàng bán sỉ hoặc báo giá đặt may',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateDraftOrderDto })
  @Post('com/draft_orders.json')
  async createDraftOrder(@Body() dto: HaravanCreateDraftOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      draft_order: {
        id: Date.now(),
        name: `#D${Date.now().toString().slice(-4)}`,
        status: 'open',
        total_price: 11250000,
        applied_discount: dto.draft_order?.applied_discount,
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/draft_orders.json] Danh sách đơn đặt trước',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/draft_orders.json | Danh sách đơn hàng nháp đang chờ khách chốt',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/draft_orders.json')
  async listDraftOrders(@Headers('x-uniflow-mode') mode?: string) {
    return {
      draft_orders: [
        { id: 2001, name: '#D2001', status: 'open', total_price: 11250000, created_at: new Date().toISOString() },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[POST /com/draft_orders/:id/complete.json] Chuyển đổi Draft Order thành Đơn chính thức',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/draft_orders/{id}/complete.json | Xác nhận hoàn tất đơn nháp và tạo đơn hàng chính thức',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '2001' })
  @Post('com/draft_orders/:id/complete.json')
  async completeDraftOrder(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      draft_order: { id: Number(id), status: 'completed' },
      order: { id: Date.now(), order_number: `HRV${Date.now().toString().slice(-6)}`, financial_status: 'paid' },
      mode: mode || 'SANDBOX',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 3. FULFILLMENT RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 03. Fulfillment')
@Controller('api/v1/infra/haravan')
export class HaravanFulfillmentsController {
  @ApiOperation({
    summary: '[POST /com/orders/:order_id/fulfillments.json] Xuất kho giao vận fulfillment',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/orders/{order_id}/fulfillments.json | Tạo vận đơn và xuất kho đóng gói',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'order_id', example: '1001' })
  @ApiBody({ type: HaravanFulfillOrderDto })
  @Post('com/orders/:order_id/fulfillments.json')
  async fulfillOrder(@Param('order_id') orderId: string, @Body() dto: HaravanFulfillOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      fulfillment: {
        id: Date.now(),
        order_id: Number(orderId) || dto.order_id,
        tracking_number: dto.tracking_number,
        tracking_company: dto.carrier_service_code,
        status: 'success',
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/orders/:order_id/fulfillments.json] Danh sách đợt giao hàng của đơn',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/orders/{order_id}/fulfillments.json | Lịch sử các kiện hàng đã xuất đi',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'order_id', example: '1001' })
  @Get('com/orders/:order_id/fulfillments.json')
  async listFulfillments(@Param('order_id') orderId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      fulfillments: [
        { id: 9001, order_id: Number(orderId), tracking_number: 'GHN_HRV_99812', tracking_company: 'Giao Hàng Nhanh', status: 'success' },
      ],
      mode: mode || 'SANDBOX',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 4. TRANSACTION RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 04. Transaction')
@Controller('api/v1/infra/haravan')
export class HaravanTransactionsController {
  @ApiOperation({
    summary: '[POST /com/orders/:order_id/transactions.json] Ghi nhận giao dịch thanh toán',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/orders/{order_id}/transactions.json | Ghi nhận thanh toán tiền mặt/chuyển khoản/cổng online',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'order_id', example: '1001' })
  @ApiBody({ type: HaravanTransactionDto })
  @Post('com/orders/:order_id/transactions.json')
  async createTransaction(@Param('order_id') orderId: string, @Body() dto: HaravanTransactionDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      transaction: {
        id: Date.now(),
        order_id: Number(orderId),
        amount: dto.amount,
        kind: dto.kind,
        gateway: dto.gateway,
        status: dto.status,
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/orders/:order_id/transactions.json] Lịch sử giao dịch thanh toán của đơn',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/orders/{order_id}/transactions.json | Danh sách các lần quẹt thẻ, thanh toán hoặc hoàn tiền',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'order_id', example: '1001' })
  @Get('com/orders/:order_id/transactions.json')
  async listTransactions(@Param('order_id') orderId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      transactions: [
        { id: 4001, order_id: Number(orderId), kind: 'sale', amount: 580000, gateway: 'VNPay QR', status: 'success', created_at: new Date().toISOString() },
      ],
      mode: mode || 'SANDBOX',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 5. REFUND RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 05. Refund')
@Controller('api/v1/infra/haravan')
export class HaravanRefundsController {
  @ApiOperation({
    summary: '[POST /com/orders/:order_id/refunds.json] Tạo phiếu hoàn tiền và đổi trả hàng',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/orders/{order_id}/refunds.json | Hoàn trả tiền và nhập lại hàng vào kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'order_id', example: '1001' })
  @ApiBody({ type: HaravanRefundDto })
  @Post('com/orders/:order_id/refunds.json')
  async createRefund(@Param('order_id') orderId: string, @Body() dto: HaravanRefundDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      refund: {
        id: Date.now(),
        order_id: Number(orderId),
        note: dto.note,
        refund_line_items: dto.refund_line_items,
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/refunds.json] Danh sách phiếu đổi trả hàng toàn hệ thống',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/refunds.json | Tra cứu lịch sử đổi trả của cửa hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/refunds.json')
  async listRefunds(@Headers('x-uniflow-mode') mode?: string) {
    return {
      refunds: [
        { id: 5001, order_id: 1001, note: 'Khách đổi size', created_at: new Date().toISOString() },
      ],
      mode: mode || 'SANDBOX',
    };
  }
}
