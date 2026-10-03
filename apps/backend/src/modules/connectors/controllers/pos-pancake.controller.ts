import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ActionsService } from '../actions.service';
import {
  PancakeCreateOrderDto,
  PancakeUpdateOrderDto,
  PancakeUpdateOrderStatusDto,
  PancakeCancelOrderDto,
  PancakeSendChatDto,
  PancakeTagCustomerDto,
  PancakeCreateProductDto,
  PancakeUpdateProductDto,
  PancakeSyncInventoryDto,
  PancakeRegisterWebhookDto,
} from '../dto/pos-pancake.dto';

// ════════════════════════════════════════════════════════════════
// 1. PANCAKE - ĐƠN HÀNG (ORDERS)
// ════════════════════════════════════════════════════════════════
@ApiTags('[POS-Pancake] 01. Đơn hàng (Orders)')
@Controller('api/v1/infra/pancake')
export class PancakeOrdersController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({ summary: 'Tạo đơn Pancake POS', description: 'Tạo đơn hàng từ luồng chat chốt đơn Facebook/Zalo/TikTok sang Pancake POS' })
  @Post('orders/create')
  async createOrder(@Body() dto: PancakeCreateOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('pancake_create_order', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({ summary: 'Danh sách đơn Pancake POS', description: 'Lấy danh sách đơn hàng chốt trên Pancake POS' })
  @Get('orders/list')
  async listOrders(@Query('page_id') pageId: string = 'PAGE_101', @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('pancake_list_orders', { page_id: pageId }, this.getEffectiveMode(mode));
  }

  @ApiOperation({ summary: 'Chi tiết đơn chốt Pancake', description: 'Xem chi tiết đơn hàng chốt' })
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

  @ApiOperation({ summary: 'Cập nhật đơn hàng Pancake', description: 'Cập nhật ghi chú hoặc thông tin đơn hàng chốt' })
  @Put('orders/update')
  async updateOrder(@Body() dto: PancakeUpdateOrderDto) {
    return { success: true, order_id: dto.order_id, note: dto.note, updated_at: new Date().toISOString() };
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái đơn Pancake', description: 'Cập nhật trạng thái đơn hàng chốt trên Pancake POS' })
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

  @ApiOperation({ summary: 'Hủy đơn chốt hàng Pancake', description: 'Hủy đơn hàng chốt trên Pancake và tự động cập nhật lý do khách hủy' })
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

  @ApiOperation({ summary: 'Xóa đơn chốt Pancake', description: 'Xóa đơn chốt khỏi hệ thống' })
  @ApiParam({ name: 'id', example: 'ORD_PC_9912' })
  @Delete('orders/:id')
  async deleteOrder(@Param('id') id: string) {
    return { success: true, message: `Đã xóa đơn hàng Pancake #${id}` };
  }
}

// ════════════════════════════════════════════════════════════════
// 2. PANCAKE - HỘI THOẠI & CHAT (CONVERSATIONS & CRM)
// ════════════════════════════════════════════════════════════════
@ApiTags('[POS-Pancake] 02. Hội thoại & Chat (Conversations)')
@Controller('api/v1/infra/pancake')
export class PancakeConversationsController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({ summary: 'Danh sách hội thoại khách hàng', description: 'Lấy danh sách các tin nhắn inbox/comment gần nhất trên Fanpage' })
  @ApiQuery({ name: 'page_id', example: 'PAGE_1092841', required: false })
  @Get('conversations/list')
  async listConversations(@Query('page_id') pageId: string = 'PAGE_1092841') {
    return {
      conversations: [
        { id: 'CONV_889922', page_id: pageId, customer_name: 'Nguyễn Thị Hương', last_message: 'Shop ơi ship cho mình chiếc này nhé' },
      ],
    };
  }

  @ApiOperation({ summary: 'Gửi tin nhắn Pancake Chat', description: 'Gửi tin nhắn phản hồi tự động cho khách hàng trong luồng hội thoại Pancake' })
  @Post('chat/send')
  async sendChat(@Body() dto: PancakeSendChatDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('pancake_send_chat', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({ summary: 'Gắn thẻ tag khách hàng Pancake', description: 'Gắn nhãn phân loại khách hàng (VIP, Khách quen, Bom hàng) trên Pancake CRM' })
  @Post('customers/tag')
  async tagCustomer(@Body() dto: PancakeTagCustomerDto) {
    return {
      success: true,
      page_id: dto.page_id,
      customer_id: dto.customer_id,
      tags: dto.tags,
      message: `Đã cập nhật nhãn cho khách hàng #${dto.customer_id}`,
    };
  }

  @ApiOperation({ summary: 'Gỡ thẻ tag khách hàng Pancake', description: 'Xóa nhãn phân loại của khách hàng' })
  @ApiParam({ name: 'customerId', example: 'CUST_1001' })
  @ApiParam({ name: 'tag', example: 'KHACH_QUEN' })
  @Delete('customers/:customerId/tag/:tag')
  async removeCustomerTag(@Param('customerId') customerId: string, @Param('tag') tag: string) {
    return { success: true, customer_id: customerId, removed_tag: tag };
  }
}

// ════════════════════════════════════════════════════════════════
// 3. PANCAKE - SẢN PHẨM & TỒN KHO (PRODUCTS & INVENTORY)
// ════════════════════════════════════════════════════════════════
@ApiTags('[POS-Pancake] 03. Sản phẩm & Kho bãi (Products & Inventory)')
@Controller('api/v1/infra/pancake')
export class PancakeInventoryController {
  @ApiOperation({ summary: 'Tạo sản phẩm Pancake Store', description: 'Thêm sản phẩm mới lên kho bán hàng Pancake Store' })
  @Post('products/create')
  async createProduct(@Body() dto: PancakeCreateProductDto) {
    return {
      success: true,
      product: { id: Date.now(), ...dto },
    };
  }

  @ApiOperation({ summary: 'Danh mục sản phẩm Pancake Store', description: 'Truy vấn danh sách sản phẩm' })
  @ApiQuery({ name: 'page_id', example: 'PAGE_1092841', required: false })
  @Get('products/list')
  async listProducts(@Query('page_id') pageId: string = 'PAGE_1092841') {
    return {
      products: [
        { id: 1, page_id: pageId, sku: 'VAY-HOA-L', name: 'Váy Hoa Nhí Vintage', price: 320000, quantity: 45 },
      ],
    };
  }

  @ApiOperation({ summary: 'Cập nhật sản phẩm Pancake Store', description: 'Cập nhật giá bán, tên sản phẩm' })
  @Put('products/update')
  async updateProduct(@Body() dto: PancakeUpdateProductDto) {
    return { success: true, updated: true, sku: dto.sku, new_price: dto.price };
  }

  @ApiOperation({ summary: 'Đồng bộ tồn kho Pancake Store', description: 'Cân bằng số lượng tồn kho sản phẩm trên hệ thống bán hàng Pancake Store' })
  @Post('inventory/sync')
  async syncInventory(@Body() dto: PancakeSyncInventoryDto) {
    return {
      success: true,
      page_id: dto.page_id,
      sku: dto.sku,
      quantity: dto.quantity,
      updated_at: new Date().toISOString(),
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 4. PANCAKE - WEBHOOKS & KÊNH BÁN (WEBHOOKS & PAGES)
// ════════════════════════════════════════════════════════════════
@ApiTags('[POS-Pancake] 04. Webhooks & Kênh bán (Webhooks & Pages)')
@Controller('api/v1/infra/pancake')
export class PancakeWebhooksController {
  @ApiOperation({ summary: 'Danh sách kênh bán & Fanpage Pancake', description: 'Lấy danh mục tất cả Fanpage Facebook, Instagram và Zalo kết nối vào Pancake' })
  @Get('pages/list')
  async listPages() {
    return {
      pages: [
        { id: 'PAGE_1092841', name: 'UniFlow Fashion Store (Facebook)', platform: 'facebook', is_active: true },
        { id: 'PAGE_1092842', name: 'UniFlow Official Instagram', platform: 'instagram', is_active: true },
        { id: 'PAGE_1092843', name: 'UniFlow Zalo OA', platform: 'zalo', is_active: true },
      ],
    };
  }

  @ApiOperation({ summary: 'Đăng ký Webhook realtime Pancake', description: 'Cấu hình URL webhook nhận tin nhắn khách chat và sự kiện chốt đơn realtime từ Pancake' })
  @Post('webhooks/subscribe')
  async subscribeWebhook(@Body() dto: PancakeRegisterWebhookDto) {
    return {
      success: true,
      page_id: dto.page_id,
      webhook_url: dto.webhook_url,
      events: dto.events,
      subscribed_at: new Date().toISOString(),
    };
  }
}

// Compatibility Alias
export const PosPancakeController = PancakeOrdersController;
