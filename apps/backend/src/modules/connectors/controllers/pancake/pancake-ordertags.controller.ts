import { Controller, Post, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { PancakePosCallLaterDto, PancakePosUpdateOrderTagDto } from '../../dto/pos-pancake.dto';

@ApiTags('[02. POS-Pancake] 02. Order Tags & Auto Voice (Nhãn đơn & Gọi tự động)')
@Controller('api/v1/infra/pancake')
export class PancakeOrderTagsController {

  @ApiOperation({
    summary: '[Order Tag - Danh sách nhãn] [GET /shops/:shopId/orders/tags] Danh sách nhãn đơn hàng',
    description: '[Thuộc danh mục: 5. Order tag > Danh sách nhãn] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders/tags | Docs: https://docs.pancake.biz/pos/api/ | Danh sách các nhãn phân loại đơn hàng (Đã cọc, Khách hẹn, Cần gọi lại...)',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/orders/tags')
  async listOrderTags(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      tags: [
        { id: 1, name: 'Đã cọc', color: '#10b981', tag_group_id: 1 },
        { id: 2, name: 'Khách hẹn gọi lại', color: '#f59e0b', tag_group_id: 1 },
        { id: 3, name: 'Cảnh báo bom hàng', color: '#ef4444', tag_group_id: 2 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Order Tag - Tạo nhãn mới] [POST /shops/:shopId/orders/tags] Tạo thẻ nhãn đơn hàng mới',
    description: '[Thuộc danh mục: 5. Order tag > Tạo nhãn] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders/tags | Khởi tạo thẻ nhãn phân loại đơn',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ schema: { type: 'object', properties: { name: { type: 'string', example: 'Khách VIP' }, color: { type: 'string', example: '#8b5cf6' } } } })
  @Post('shops/:shopId/orders/tags')
  async createOrderTag(@Param('shopId') shopId: string, @Body() body: { name: string; color?: string }) {
    return {
      success: true,
      shop_id: shopId,
      tag: {
        id: Date.now(),
        name: body.name,
        color: body.color || '#3b82f6',
      },
    };
  }

  @ApiOperation({
    summary: '[Order Tag - Cập nhật nhãn] [PUT /shops/:shopId/orders/tags/:tagId] Cập nhật nhãn đơn hàng',
    description: '[Thuộc danh mục: 5. Order tag > Cập nhật nhãn] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders/tags/{TAG_ID} | Sửa tên hoặc đổi màu sắc nhãn đơn',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'tagId', example: '1' })
  @ApiBody({ type: PancakePosUpdateOrderTagDto })
  @Put('shops/:shopId/orders/tags/:tagId')
  async updateOrderTag(@Param('shopId') shopId: string, @Param('tagId') tagId: string, @Body() body: PancakePosUpdateOrderTagDto) {
    return {
      success: true,
      tag_id: Number(tagId),
      ...body,
      updated_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Order Tag Group - Nhóm nhãn] [GET /shops/:shopId/orders/tag_groups] Danh sách nhóm nhãn đơn hàng',
    description: '[Thuộc danh mục: 5. Order tag > Nhóm nhãn] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders/tag_groups | Phân loại các nhãn theo nhóm nghiệp vụ',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/orders/tag_groups')
  async listOrderTagGroups(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      tag_groups: [
        { id: 1, name: 'Trạng thái xử lý' },
        { id: 2, name: 'Cảnh báo rủi ro' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Auto Voice - Gọi tự động] [POST /shops/:shopId/orders/:orderId/trigger_call] Kích hoạt cuộc gọi tự động',
    description: '[Thuộc danh mục: 6. Auto Voice > Gọi tự động] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/orders/{ORDER_ID}/trigger_call | Kích hoạt AI Voicebot tự động gọi xác nhận đơn hàng',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'orderId', example: 'ORD_PC_9912' })
  @Post('shops/:shopId/orders/:orderId/trigger_call')
  async triggerAutoVoiceCall(@Param('shopId') shopId: string, @Param('orderId') orderId: string) {
    return {
      success: true,
      shop_id: shopId,
      order_id: orderId,
      call_status: 'triggered',
      call_id: `VOICE_${Date.now()}`,
      triggered_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Call Later - Danh sách hẹn gọi] [GET /shops/:shopId/order_call_laters] Danh sách cuộc gọi hẹn gọi lại & nhắc nhở',
    description: '[Thuộc danh mục: 10. Call Later > Danh sách hẹn gọi] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/order_call_laters | Danh sách lịch hẹn chăm sóc khách hàng',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/order_call_laters')
  async listCallLaters(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      reminders: [
        { id: 1, order_id: 'ORD_PC_9921', call_time: '2026-10-05T09:00:00Z', note: 'Khách hẹn gọi lại sáng mai', status: 'pending' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Call Later - Tạo lịch hẹn gọi] [POST /shops/:shopId/order_call_laters] Tạo cuộc gọi hẹn gọi lại & nhắc nhở',
    description: '[Thuộc danh mục: 10. Call Later > Tạo lịch hẹn] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/order_call_laters | Đặt lịch hẹn telesales gọi lại',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCallLaterDto })
  @Post('shops/:shopId/order_call_laters')
  async createCallLater(@Param('shopId') shopId: string, @Body() dto: PancakePosCallLaterDto) {
    return {
      success: true,
      shop_id: shopId,
      id: Date.now(),
      ...dto,
      created_at: new Date().toISOString(),
    };
  }
}
