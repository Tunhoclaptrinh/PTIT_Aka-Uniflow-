import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  PancakeCreateOrderDto,
  PancakeUpdateOrderDto,
  PancakeUpdateOrderStatusDto,
  PancakeCancelOrderDto,
  PancakePosCreateOrderDto,
  PancakePosActivePromotionQueryDto,
  PancakePosCreateOrderReturnDto,
} from '../../dto/pos-pancake.dto';

@ApiTags('[02. POS-Pancake] 01. Orders & Shipments (Đơn hàng & Giao vận)')
@Controller('api/v1/infra/pancake')
export class PancakeOrdersController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  // ════════════════════════════════════════════════════════════════
  // PANCAKE POS OPEN API SPECIFICATION (https://docs.pancake.biz/pos/api/)
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({
    summary: '[Order - Danh sách đơn hàng] [GET /shops/:shopId/orders] Danh sách đơn hàng Pancake POS',
    description: '[Thuộc danh mục: 4. Order > Danh sách đơn] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders | Docs: https://docs.pancake.biz/pos/api/ | Lấy danh sách đơn hàng có phân trang và lọc theo trạng thái',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiQuery({ name: 'page_number', example: 1, required: false })
  @ApiQuery({ name: 'page_size', example: 30, required: false })
  @ApiQuery({ name: 'status', example: 'confirmed', required: false })
  @Get('shops/:shopId/orders')
  async listOrdersOfficial(
    @Param('shopId') shopId: string,
    @Query('page_number') pageNumber = 1,
    @Query('page_size') pageSize = 30,
    @Query('status') status?: string,
  ) {
    return {
      success: true,
      shop_id: shopId,
      page_number: Number(pageNumber),
      page_size: Number(pageSize),
      total_orders: 2,
      orders: [
        {
          id: 'ORD_PC_9912',
          bill_full_name: 'Nguyễn Thị Hương',
          bill_phone_number: '0981234567',
          status: status || 'confirmed',
          total_price: 320000,
          items: [{ variation_id: 'VAR_1001', product_name: 'Váy Hoa Nhí Vintage L', quantity: 1, price: 320000 }],
          inserted_at: new Date().toISOString(),
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Order - Tạo đơn hàng] [POST /shops/:shopId/orders] Tạo mới đơn hàng trên Pancake POS',
    description: '[Thuộc danh mục: 4. Order > Tạo đơn] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders | Docs: https://docs.pancake.biz/pos/api/ | Khởi tạo đơn hàng chốt từ mạng xã hội sang Pancake POS',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateOrderDto })
  @Post('shops/:shopId/orders')
  async createOrderOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosCreateOrderDto) {
    return {
      success: true,
      shop_id: shopId,
      order: {
        id: `ORD_PC_${Date.now().toString().slice(-6)}`,
        bill_full_name: dto.customer_name,
        bill_phone_number: dto.phone_number,
        shipping_address: dto.shipping_address,
        total_price: dto.total_amount,
        shipping_fee: dto.shipping_fee || 0,
        status: 'new',
        inserted_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Order - Chi tiết đơn hàng] [GET /shops/:shopId/orders/:orderId] Chi tiết đơn hàng theo ID',
    description: '[Thuộc danh mục: 4. Order > Chi tiết đơn] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders/{ORDER_ID} | Lấy thông tin đơn hàng, khách mua và tiền thanh toán',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'orderId', example: 'ORD_PC_9912' })
  @Get('shops/:shopId/orders/:orderId')
  async getOrderOfficial(@Param('shopId') shopId: string, @Param('orderId') orderId: string) {
    return {
      success: true,
      order: {
        id: orderId,
        shop_id: shopId,
        bill_full_name: 'Nguyễn Thị Hương',
        bill_phone_number: '0981234567',
        items: [{ variation_id: 'VAR_1001', product_name: 'Váy Hoa Nhí Vintage L', quantity: 1, price: 320000 }],
        status: 'confirmed',
        total_price: 320000,
      },
    };
  }

  @ApiOperation({
    summary: '[Order - Cập nhật đơn hàng] [PUT /shops/:shopId/orders/:orderId] Cập nhật thông tin đơn hàng',
    description: '[Thuộc danh mục: 4. Order > Cập nhật đơn] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders/{ORDER_ID} | Điều chỉnh sản phẩm, địa chỉ giao hoặc ghi chú',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'orderId', example: 'ORD_PC_9912' })
  @ApiBody({ type: PancakeUpdateOrderDto })
  @Put('shops/:shopId/orders/:orderId')
  async updateOrderOfficial(@Param('shopId') shopId: string, @Param('orderId') orderId: string, @Body() body: PancakeUpdateOrderDto) {
    return {
      success: true,
      shop_id: shopId,
      order_id: orderId,
      updated_fields: body,
      updated_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Order - Tin nhắn hội thoại] [GET /shops/:shopId/orders/:orderId/messages] Lịch sử tin nhắn của đơn hàng',
    description: '[Thuộc danh mục: 4. Order > Hội thoại đơn] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders/{ORDER_ID}/messages | Lấy các tin nhắn chat trong cuộc hội thoại sinh ra đơn hàng này',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'orderId', example: 'ORD_PC_9912' })
  @Get('shops/:shopId/orders/:orderId/messages')
  async getOrderMessagesOfficial(@Param('shopId') shopId: string, @Param('orderId') orderId: string) {
    return {
      success: true,
      order_id: orderId,
      messages: [
        { id: 'MSG_01', sender: 'customer', text: 'Shop ơi tư vấn size L mẫu hoa nhí', time: '2026-10-04T00:30:00Z' },
        { id: 'MSG_02', sender: 'shop', text: 'Dạ mẫu này vừa vặn chị nhé, em chốt đơn cho chị ạ!', time: '2026-10-04T00:31:00Z' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Order Source - Nguồn đơn hàng] [GET /shops/:shopId/order_source] Danh sách nguồn đơn hàng',
    description: '[Thuộc danh mục: 4. Order > Nguồn đơn] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/order_source | Danh mục các nguồn tạo đơn (Facebook, Instagram, Zalo, POS, Livestream)',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/order_source')
  async getOrderSourcesOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      sources: [
        { id: 1, name: 'Facebook Fanpage', key: 'facebook' },
        { id: 2, name: 'Zalo OA', key: 'zalo' },
        { id: 3, name: 'Livestream', key: 'livestream' },
        { id: 4, name: 'Cửa hàng POS', key: 'pos' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Shipment - In phiếu gửi hàng] [POST /shops/:shopId/products/get_logistics_shipping_document] Lấy link in nhãn vận chuyển',
    description: '[Thuộc danh mục: 4. Order > In nhãn] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/products/get_logistics_shipping_document | Xuất link in phiếu đóng gói và tem nhãn barcode giao vận',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Post('shops/:shopId/products/get_logistics_shipping_document')
  async getShippingDocumentOfficial(@Param('shopId') shopId: string, @Body() body: { order_ids: string[] }) {
    return {
      success: true,
      shop_id: shopId,
      print_url: `https://pos.pages.fm/print_label/${shopId}?orders=${(body.order_ids || []).join(',')}`,
      document_type: 'A6_LABEL',
    };
  }

  @ApiOperation({
    summary: '[Order - Link xác nhận đơn] [POST /shops/:shopId/orders/get_tracking_url] Lấy link xác nhận / tracking đơn hàng',
    description: '[Thuộc danh mục: 4. Order > Link xác nhận] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders/get_tracking_url | Sinh link xác nhận đơn hàng gửi qua SMS/Zalo cho khách kiểm tra',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Post('shops/:shopId/orders/get_tracking_url')
  async getTrackingUrlOfficial(@Param('shopId') shopId: string, @Body() body: { order_id: string }) {
    return {
      success: true,
      order_id: body.order_id,
      tracking_url: `https://bill.pancake.vn/${shopId}/${body.order_id}`,
    };
  }

  @ApiOperation({
    summary: '[Shipment - Gửi hãng vận chuyển] [POST /shops/:shopId/orders/arrange_shipment] Chuẩn bị hàng & Đẩy đơn sang vận chuyển',
    description: '[Thuộc danh mục: 4. Order > Gửi hãng VC] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders/arrange_shipment | Đẩy thông tin giao vận sang GHTK, GHN, Viettel Post từ Pancake',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Post('shops/:shopId/orders/arrange_shipment')
  async arrangeShipmentOfficial(
    @Param('shopId') shopId: string,
    @Body() body: { order_id: string; partner_id?: number; pick_warehouse_id?: number },
  ) {
    return {
      success: true,
      order_id: body.order_id,
      tracking_code: `PC_SHIP_${Date.now().toString().slice(-8)}`,
      partner_name: 'Giao Hàng Tiết Kiệm (GHTK)',
      status: 'shipment_arranged',
    };
  }

  @ApiOperation({
    summary: '[Promotion - Khuyến mãi đơn hàng] [POST /shops/:shopId/orders/get_promotion_advance_active] Khuyến mãi nâng cao khả dụng',
    description: '[Thuộc danh mục: 4. Order > Khuyến mãi đơn] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders/get_promotion_advance_active | Danh sách các chương trình khuyến mãi tự động áp dụng',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosActivePromotionQueryDto })
  @Post('shops/:shopId/orders/get_promotion_advance_active')
  async getPromotionAdvanceActiveOfficial(@Param('shopId') shopId: string, @Body() body: PancakePosActivePromotionQueryDto) {
    return {
      success: true,
      shop_id: shopId,
      promotions: [
        { id: 101, name: 'Miễn phí vận chuyển đơn từ 300K', discount_type: 'free_ship' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Payment - Phương thức thanh toán] [GET /shops/:shopId/bank_payments] Danh sách hình thức thanh toán ngân hàng',
    description: '[Thuộc danh mục: 4. Order > Phương thức thanh toán] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/bank_payments | Danh mục tài khoản ngân hàng và VietQR',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/bank_payments')
  async getBankPaymentsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      payments: [
        { id: 1, bank_name: 'Vietcombank', account_number: '001100445566', account_name: 'CONG TY UNIFLOW' },
        { id: 2, bank_name: 'Techcombank', account_number: '1903889977', account_name: 'CONG TY UNIFLOW' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Return - Danh sách đơn trả hàng] [GET /shops/:shopId/orders_returned] Danh sách đơn đổi trả',
    description: '[Thuộc danh mục: 4. Order > Đổi trả] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders_returned | Lấy danh sách các đơn hàng trả lại',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/orders_returned')
  async listOrdersReturnedOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      returned_orders: [
        { id: 'RET_001', order_id: 'ORD_PC_9912', reason: 'Khách đổi size', status: 'completed' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Return - Tạo đơn trả hàng] [POST /shops/:shopId/orders_returned] Lập phiếu đổi trả hàng',
    description: '[Thuộc danh mục: 4. Order > Đổi trả] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders_returned | Khởi tạo đơn nhận lại hàng và hoàn tiền',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateOrderReturnDto })
  @Post('shops/:shopId/orders_returned')
  async createOrderReturnedOfficial(@Param('shopId') shopId: string, @Body() body: PancakePosCreateOrderReturnDto) {
    return {
      success: true,
      shop_id: shopId,
      return_id: `RET_${Date.now().toString().slice(-6)}`,
      order_id: body.order_id,
      itemsCount: body.items?.length || 1,
      status: 'pending_received',
    };
  }

  @ApiOperation({
    summary: '[Partner - Danh sách đối tác VC] [GET /shops/:shopId/partners] Danh sách hãng vận chuyển liên kết',
    description: '[Thuộc danh mục: 4. Order > Đối tác] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/partners | Danh sách các đơn vị giao vận kết nối (GHTK, GHN, Viettel Post, Ninja Van, J&T...)',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/partners')
  async getPartnersOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      partners: [
        { id: 1, name: 'Giao Hàng Tiết Kiệm (GHTK)', code: 'ghtk', is_active: true },
        { id: 2, name: 'Giao Hàng Nhanh (GHN)', code: 'ghn', is_active: true },
        { id: 3, name: 'Viettel Post', code: 'viettel_post', is_active: true },
      ],
    };
  }

  @ApiOperation({
    summary: '[Project - Danh sách dự án] [GET /shops/:shopId/projects] Danh sách dự án quản lý',
    description: '[Thuộc danh mục: 4. Order > Dự án] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/projects | Quản lý dự án bán hàng theo chiến dịch',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/projects')
  async getProjectsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      projects: [
        { id: 1, name: 'Dự án Bán hàng Mùa Thu 2026', code: 'PRJ_FALL26' },
      ],
    };
  }

  // ════════════════════════════════════════════════════════════════
  // BACKWARD COMPATIBLE / UNIFLOW HELPER ROUTES
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({ summary: '[Order - Tạo đơn chốt] [POST /orders/create] Tạo đơn Pancake POS từ luồng chat', description: 'Tạo đơn hàng từ luồng chat chốt đơn Facebook/Zalo/TikTok sang Pancake POS' })
  @Post('orders/create')
  async createOrder(@Body() dto: PancakeCreateOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('pancake_create_order', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({ summary: '[Order - Danh sách rút gọn] [GET /orders/list] Danh sách đơn Pancake POS', description: 'Lấy danh sách đơn hàng chốt trên Pancake POS' })
  @Get('orders/list')
  async listOrders(@Query('page_id') pageId: string = 'PAGE_101', @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('pancake_list_orders', { page_id: pageId }, this.getEffectiveMode(mode));
  }

  @ApiOperation({ summary: '[Order - Chi tiết đơn chốt] [GET /orders/:id] Chi tiết đơn chốt Pancake', description: 'Xem chi tiết đơn hàng chốt' })
  @ApiParam({ name: 'id', example: 'ORD_PC_9912' })
  @Get('orders/:id')
  async getOrderById(@Param('id') id: string) {
    return {
      order: {
        id,
        customer_name: 'Nguyễn Thị Hương',
        phone_number: '0981234567',
        items: [{ name: 'Váy Hoa Nhí Vintage L', quantity: 1, price: 320000 }],
        status: 'confirmed',
      },
    };
  }

  @ApiOperation({ summary: '[Order - Sửa đơn chốt] [PUT /orders/update] Cập nhật đơn hàng Pancake', description: 'Cập nhật ghi chú hoặc thông tin đơn hàng chốt' })
  @Put('orders/update')
  async updateOrder(@Body() dto: PancakeUpdateOrderDto) {
    return { success: true, order_id: dto.order_id, note: dto.note, updated_at: new Date().toISOString() };
  }

  @ApiOperation({ summary: '[Order - Đổi trạng thái] [POST /orders/update-status] Cập nhật trạng thái đơn Pancake', description: 'Cập nhật trạng thái đơn hàng chốt trên Pancake POS' })
  @Post('orders/update-status')
  async updateOrderStatus(@Body() dto: PancakeUpdateOrderStatusDto) {
    return {
      success: true,
      page_id: dto.page_id,
      order_id: dto.order_id,
      status: dto.status,
      updated_at: new Date().toISOString(),
    };
  }

  @ApiOperation({ summary: '[Order - Hủy đơn chốt] [POST /orders/cancel] Hủy đơn chốt hàng Pancake', description: 'Hủy đơn hàng chốt trên Pancake và tự động cập nhật lý do khách hủy' })
  @Post('orders/cancel')
  async cancelOrder(@Body() dto: PancakeCancelOrderDto) {
    return {
      success: true,
      page_id: dto.page_id,
      order_id: dto.order_id,
      status: 'canceled',
      cancel_reason: dto.cancel_reason,
      cancelled_at: new Date().toISOString(),
    };
  }

  @ApiOperation({ summary: '[Order - Xóa đơn] [DELETE /orders/:id] Xóa đơn chốt Pancake', description: 'Xóa đơn chốt khỏi hệ thống' })
  @ApiParam({ name: 'id', example: 'ORD_PC_9912' })
  @Delete('orders/:id')
  async deleteOrder(@Param('id') id: string) {
    return { success: true, message: `Đã xóa đơn hàng Pancake #${id}` };
  }
}
