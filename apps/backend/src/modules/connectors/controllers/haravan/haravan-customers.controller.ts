import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanCreateCustomerDto,
  HaravanUpdateCustomerDto,
  HaravanCustomerAddressDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 15. CUSTOMER RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 15. Customer')
@Controller('api/v1/infra/haravan')
export class HaravanCustomersController {
  @ApiOperation({
    summary: '[POST /com/customers.json] Tạo hồ sơ khách hàng mới',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/customers.json | Docs: https://docs.haravan.com/docs/omni-apis/customer/ | Tạo khách hàng mới và phân loại nhóm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateCustomerDto })
  @Post('com/customers.json')
  async createCustomer(@Body() dto: HaravanCreateCustomerDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      customer: {
        id: Date.now(),
        first_name: dto.first_name,
        last_name: dto.last_name,
        phone: dto.phone,
        email: dto.email,
        tags: dto.tags?.join(','),
        orders_count: 0,
        total_spent: 0,
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/customers.json] Danh sách khách hàng',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/customers.json | Tra cứu danh sách khách hàng và lịch sử mua hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiQuery({ name: 'limit', example: 20, required: false })
  @ApiQuery({ name: 'page', example: 1, required: false })
  @Get('com/customers.json')
  async listCustomers(@Query('limit') limit = 20, @Query('page') page = 1, @Headers('x-uniflow-mode') mode?: string) {
    return {
      customers: [
        { id: 99120, first_name: 'Lê', last_name: 'Văn Thịnh', phone: '0918889999', email: 'thinh.le@example.com', orders_count: 3, total_spent: 1250000 },
        { id: 99121, first_name: 'Nguyễn', last_name: 'Hải Đăng', phone: '0988776655', email: 'dang.nguyen@example.com', orders_count: 1, total_spent: 450000 },
      ],
      page: Number(page),
      limit: Number(limit),
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[GET /com/customers/search.json] Tìm kiếm khách hàng theo SĐT / Email / Tên',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/customers/search.json | Tìm nhanh khách hàng để hưởng chiết khấu',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiQuery({ name: 'query', example: '0918889999' })
  @Get('com/customers/search.json')
  async searchCustomer(@Query('query') query: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      customers: [
        { id: 99120, first_name: 'Lê', last_name: 'Văn Thịnh', phone: query, email: 'thinh.le@example.com', orders_count: 3 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[GET /com/customers/:id.json] Chi tiết hồ sơ khách hàng',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/customers/{id}.json | Lấy đầy đủ thông tin cá nhân và địa chỉ mặc định',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '99120' })
  @Get('com/customers/:id.json')
  async getCustomerById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      customer: {
        id: Number(id),
        first_name: 'Lê',
        last_name: 'Văn Thịnh',
        phone: '0918889999',
        email: 'thinh.le@example.com',
        tags: 'VIP, KHACH_HA_NOI',
        default_address: { address1: 'Tòa nhà Landmark 81, Phường 22', city: 'Hồ Chí Minh', district: 'Quận Bình Thạnh' },
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[PUT /com/customers/:id.json] Cập nhật thông tin khách hàng',
    description: 'Endpoint gốc: PUT https://apis.haravan.com/com/customers/{id}.json | Cập nhật số điện thoại, email, hạng thẻ',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '99120' })
  @ApiBody({ type: HaravanUpdateCustomerDto })
  @Put('com/customers/:id.json')
  async updateCustomer(@Param('id') id: string, @Body() dto: HaravanUpdateCustomerDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      customer: { id: Number(id), ...dto, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/customers/:id.json] Xóa hồ sơ khách hàng',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/customers/{id}.json | Xóa tài khoản khách hàng khỏi hệ thống',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '99120' })
  @Delete('com/customers/:id.json')
  async deleteCustomer(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), message: 'Xóa khách hàng thành công', mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 16. CUSTOMER ADDRESS RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 16. CustomerAddress')
@Controller('api/v1/infra/haravan')
export class HaravanCustomerAddressesController {
  @ApiOperation({
    summary: '[GET /com/customers/:customer_id/addresses.json] Danh sách sổ địa chỉ nhận hàng',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/customers/{customer_id}/addresses.json | Xem tất cả địa chỉ của khách hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'customer_id', example: '99120' })
  @Get('com/customers/:customer_id/addresses.json')
  async listAddresses(@Param('customer_id') customerId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      addresses: [
        { id: 801, customer_id: Number(customerId), address1: 'Tòa nhà Landmark 81, Phường 22', district: 'Quận Bình Thạnh', province: 'Hồ Chí Minh', default: true },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[POST /com/customers/:customer_id/addresses.json] Thêm địa chỉ nhận hàng mới',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/customers/{customer_id}/addresses.json | Thêm địa chỉ mới vào sổ địa chỉ',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'customer_id', example: '99120' })
  @ApiBody({ type: HaravanCustomerAddressDto })
  @Post('com/customers/:customer_id/addresses.json')
  async createAddress(@Param('customer_id') customerId: string, @Body() dto: HaravanCustomerAddressDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      customer_address: { id: Date.now(), customer_id: Number(customerId), ...dto, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[PUT /com/customers/:customer_id/addresses/:id.json] Sửa địa chỉ nhận hàng',
    description: 'Endpoint gốc: PUT https://apis.haravan.com/com/customers/{customer_id}/addresses/{id}.json | Cập nhật địa chỉ nhận hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'customer_id', example: '99120' })
  @ApiParam({ name: 'id', example: '801' })
  @ApiBody({ type: HaravanCustomerAddressDto })
  @Put('com/customers/:customer_id/addresses/:id.json')
  async updateAddress(@Param('customer_id') customerId: string, @Param('id') id: string, @Body() dto: HaravanCustomerAddressDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      customer_address: { id: Number(id), customer_id: Number(customerId), ...dto, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/customers/:customer_id/addresses/:id.json] Xóa địa chỉ nhận hàng',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/customers/{customer_id}/addresses/{id}.json | Gỡ địa chỉ khỏi sổ',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'customer_id', example: '99120' })
  @ApiParam({ name: 'id', example: '801' })
  @Delete('com/customers/:customer_id/addresses/:id.json')
  async deleteAddress(@Param('customer_id') customerId: string, @Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}
