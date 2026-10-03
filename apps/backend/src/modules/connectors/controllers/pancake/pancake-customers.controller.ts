import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  PancakePosCreateCustomerDto,
  PancakeTagCustomerDto,
  PancakePosUpdateCustomerDto,
  PancakePosCreateCustomerPromotionsDto,
} from '../../dto/pos-pancake.dto';

@ApiTags('[02. POS-Pancake] 03. Customers & Loyalty (Khách hàng & Tích điểm)')
@Controller('api/v1/infra/pancake')
export class PancakeCustomersController {

  @ApiOperation({
    summary: '[Customer - Danh sách khách hàng] [GET /shops/:shopId/customers] Danh sách khách hàng Pancake POS',
    description: '[Thuộc danh mục: 11. Customer > Danh sách] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/customers | Docs: https://docs.pancake.biz/pos/api/ | Phân trang danh sách khách hàng và lịch sử mua sắm',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiQuery({ name: 'page_number', example: 1, required: false })
  @ApiQuery({ name: 'page_size', example: 30, required: false })
  @Get('shops/:shopId/customers')
  async listCustomers(
    @Param('shopId') shopId: string,
    @Query('page_number') pageNumber = 1,
    @Query('page_size') pageSize = 30,
  ) {
    return {
      success: true,
      shop_id: shopId,
      page_number: Number(pageNumber),
      page_size: Number(pageSize),
      customers: [
        {
          id: 'CUST_1001',
          name: 'Nguyễn Thị Hương',
          phone_number: '0981234567',
          total_spent: 1850000,
          order_count: 5,
          reward_points: 185,
          level: 'VIP_GOLD',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Customer - Thêm mới] [POST /shops/:shopId/customers] Khởi tạo hồ sơ khách hàng mới',
    description: '[Thuộc danh mục: 11. Customer > Thêm mới] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/customers | Thêm khách hàng vào cơ sở dữ liệu Pancake POS',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateCustomerDto })
  @Post('shops/:shopId/customers')
  async createCustomer(@Param('shopId') shopId: string, @Body() dto: PancakePosCreateCustomerDto) {
    return {
      success: true,
      shop_id: shopId,
      customer: {
        id: `CUST_${Date.now().toString().slice(-6)}`,
        ...dto,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Customer - Chi tiết khách hàng] [GET /shops/:shopId/customers/:customerId] Chi tiết hồ sơ khách hàng',
    description: '[Thuộc danh mục: 11. Customer > Chi tiết] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/customers/{CUSTOMER_ID} | Xem thông tin cá nhân, tổng chi tiêu và điểm thưởng',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'customerId', example: 'CUST_1001' })
  @Get('shops/:shopId/customers/:customerId')
  async getCustomerById(@Param('shopId') shopId: string, @Param('customerId') customerId: string) {
    return {
      success: true,
      customer: {
        id: customerId,
        shop_id: shopId,
        name: 'Nguyễn Thị Hương',
        phone_number: '0981234567',
        province: 'Hà Nội',
        reward_points: 185,
        total_spent: 1850000,
        level: 'VIP_GOLD',
      },
    };
  }

  @ApiOperation({
    summary: '[Customer - Cập nhật thông tin] [PUT /shops/:shopId/customers/:customerId] Cập nhật hồ sơ khách hàng',
    description: '[Thuộc danh mục: 11. Customer > Cập nhật] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID}/customers/{CUSTOMER_ID} | Cập nhật địa chỉ, số điện thoại hoặc email',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'customerId', example: 'CUST_1001' })
  @ApiBody({ type: PancakePosUpdateCustomerDto })
  @Put('shops/:shopId/customers/:customerId')
  async updateCustomer(@Param('shopId') shopId: string, @Param('customerId') customerId: string, @Body() body: PancakePosUpdateCustomerDto) {
    return {
      success: true,
      customer_id: customerId,
      ...body,
      updated_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Customer - Lịch sử điểm thưởng] [GET /shops/:shopId/customers/point_logs] Nhật ký tích và tiêu điểm',
    description: '[Thuộc danh mục: 11. Customer > Điểm thưởng] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/customers/point_logs | Lịch sử cộng/trừ điểm thưởng khách hàng',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/customers/point_logs')
  async getPointLogs(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      point_logs: [
        { id: 1, customer_id: 'CUST_1001', change_points: 50, reason: 'Tích điểm đơn hàng #ORD_PC_9912', created_at: new Date().toISOString() },
      ],
    };
  }

  @ApiOperation({
    summary: '[Promotion - Khuyến mãi theo khách] [POST /shops/:shopId/promotion_advance/create_multi] Tạo khuyến mãi theo khách hàng',
    description: '[Thuộc danh mục: 11. Customer > Khuyến mãi riêng] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/promotion_advance/create_multi | Gán ưu đãi độc quyền cho từng tệp khách',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateCustomerPromotionsDto })
  @Post('shops/:shopId/promotion_advance/create_multi')
  async createPromotionsByCustomer(@Param('shopId') shopId: string, @Body() body: PancakePosCreateCustomerPromotionsDto) {
    return {
      success: true,
      shop_id: shopId,
      created_count: (body.customer_ids || []).length || 1,
      promotion_id: body.promotion_id,
      message: 'Tạo khuyến mãi theo khách hàng thành công',
    };
  }

  @ApiOperation({
    summary: '[Note - Danh sách ghi chú] [GET /shops/:shopId/customers/:customerId/load_customer_notes] Danh sách ghi chú khách hàng',
    description: '[Thuộc danh mục: 11. Customer > Ghi chú] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/customers/{CUSTOMER_ID}/load_customer_notes | Lịch sử nhân viên note về khách',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'customerId', example: 'CUST_1001' })
  @Get('shops/:shopId/customers/:customerId/load_customer_notes')
  async listCustomerNotes(@Param('shopId') shopId: string, @Param('customerId') customerId: string) {
    return {
      success: true,
      customer_id: customerId,
      notes: [
        { id: 1, author: 'Nhân viên CSKH', content: 'Khách thích màu pastel, hay mua buổi tối', created_at: new Date().toISOString() },
      ],
    };
  }

  @ApiOperation({
    summary: '[Note - Thêm ghi chú] [POST /shops/:shopId/customers/:customerId/create_note] Thêm ghi chú mới về khách hàng',
    description: '[Thuộc danh mục: 11. Customer > Thêm ghi chú] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/customers/{CUSTOMER_ID}/create_note | Ghi nhận sở thích / lưu ý đặc biệt về khách',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'customerId', example: 'CUST_1001' })
  @ApiBody({ schema: { type: 'object', properties: { note: { type: 'string', example: 'Khách yêu cầu bọc quà cẩn thận' } } } })
  @Post('shops/:shopId/customers/:customerId/create_note')
  async createCustomerNote(@Param('shopId') shopId: string, @Param('customerId') customerId: string, @Body() body: { note: string }) {
    return {
      success: true,
      customer_id: customerId,
      note_id: Date.now(),
      content: body.note,
      created_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Level - Cấp bậc khách hàng] [GET /shops/:shopId/customer_levels] Danh sách cấp bậc khách hàng (VIP)',
    description: '[Thuộc danh mục: 11. Customer > Cấp bậc VIP] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/customer_levels | Cấu hình các phân hạng Đồng, Bạc, Vàng, Kim Cương',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/customer_levels')
  async listCustomerLevels(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      levels: [
        { id: 1, name: 'Hạng Bạc', min_spent: 1000000, discount_percent: 3 },
        { id: 2, name: 'Hạng Vàng', min_spent: 5000000, discount_percent: 5 },
        { id: 3, name: 'Hạng Kim Cương', min_spent: 10000000, discount_percent: 10 },
      ],
    };
  }

  // ════════════════════════════════════════════════════════════════
  // BACKWARD COMPATIBILITY
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({ summary: '[Customer - Gắn nhãn] [POST /customers/tag] Gắn thẻ tag khách hàng Pancake', description: 'Gắn nhãn phân loại khách hàng (VIP, Khách quen, Bom hàng) trên Pancake CRM' })
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

  @ApiOperation({ summary: '[Customer - Gỡ nhãn] [DELETE /customers/:customerId/tag/:tag] Gỡ thẻ tag khách hàng Pancake', description: 'Xóa nhãn phân loại của khách hàng' })
  @ApiParam({ name: 'customerId', example: 'CUST_1001' })
  @ApiParam({ name: 'tag', example: 'KHACH_QUEN' })
  @Delete('customers/:customerId/tag/:tag')
  async removeCustomerTag(@Param('customerId') customerId: string, @Param('tag') tag: string) {
    return { success: true, customer_id: customerId, removed_tag: tag };
  }
}
