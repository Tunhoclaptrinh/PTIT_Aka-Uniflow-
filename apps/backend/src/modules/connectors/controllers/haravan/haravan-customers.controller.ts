import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanCreateCustomerDto,
  HaravanUpdateCustomerDto,
  HaravanCustomerAddressDto,
  HaravanOrderTagsDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 4. CUSTOMERS CATEGORY (Customer, Customer Address, Tags)
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 04. Customers (Khách hàng & Sổ địa chỉ)')
@Controller('api/v1/infra/haravan')
export class HaravanCustomersController {
  @ApiOperation({
    summary: '[Customer - Hồ sơ khách hàng] [POST /com/customers.json] Tạo hồ sơ khách hàng mới',
    description: '[Thuộc danh mục: 04. Customers > Hồ sơ khách hàng] Endpoint gốc: POST https://apis.haravan.com/com/customers.json | Docs: https://docs.haravan.com/docs/omni-apis/customer/ | Tạo khách hàng mới và phân loại nhóm',
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
    summary: '[Customer - Hồ sơ khách hàng] [GET /com/customers.json] Danh sách khách hàng',
    description: '[Thuộc danh mục: 04. Customers > Hồ sơ khách hàng] Endpoint gốc: GET https://apis.haravan.com/com/customers.json | Tra cứu danh sách khách hàng và lịch sử mua hàng',
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
    summary: '[Customer - Tìm kiếm] [GET /com/customers/search.json] Tìm kiếm khách hàng theo SĐT / Email / Tên',
    description: '[Thuộc danh mục: 04. Customers > Tìm kiếm hồ sơ] Endpoint gốc: GET https://apis.haravan.com/com/customers/search.json | Tra cứu nhanh thông tin khách',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiQuery({ name: 'query', example: '0918889999' })
  @Get('com/customers/search.json')
  async searchCustomer(@Query('query') query: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      customers: [
        { id: 99120, first_name: 'Lê', last_name: 'Văn Thịnh', phone: query, email: 'thinh.le@example.com', tags: 'VIP, LOYALTY' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Customer - Hồ sơ khách hàng] [GET /com/customers/count.json] Đếm tổng số khách hàng',
    description: '[Thuộc danh mục: 04. Customers > Hồ sơ khách hàng] Endpoint gốc: GET https://apis.haravan.com/com/customers/count.json | Tổng số khách hàng trên gian hàng Haravan',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/customers/count.json')
  async countCustomers(@Headers('x-uniflow-mode') mode?: string) {
    return { count: 4820, mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[Customer - Hồ sơ khách hàng] [GET /com/customers/:id.json] Chi tiết khách hàng',
    description: '[Thuộc danh mục: 04. Customers > Hồ sơ khách hàng] Endpoint gốc: GET https://apis.haravan.com/com/customers/{id}.json | Xem chi tiết hồ sơ khách hàng',
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
        default_address: { address1: '123 Cách Mạng Tháng 8, Quận 3', city: 'Hồ Chí Minh' },
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Customer - Hồ sơ khách hàng] [PUT /com/customers/:id.json] Cập nhật thông tin khách hàng',
    description: '[Thuộc danh mục: 04. Customers > Hồ sơ khách hàng] Endpoint gốc: PUT https://apis.haravan.com/com/customers/{id}.json | Sửa email, SĐT hoặc ghi chú khách hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '99120' })
  @ApiBody({ type: HaravanUpdateCustomerDto })
  @Put('com/customers/:id.json')
  async updateCustomer(@Param('id') id: string, @Body() dto: HaravanUpdateCustomerDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      customer: { id: Number(id), email: dto.email, note: dto.note, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Customer - Hồ sơ khách hàng] [DELETE /com/customers/:id.json] Xóa hồ sơ khách hàng',
    description: '[Thuộc danh mục: 04. Customers > Hồ sơ khách hàng] Endpoint gốc: DELETE https://apis.haravan.com/com/customers/{id}.json | Xóa khách hàng khỏi hệ thống',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '99120' })
  @Delete('com/customers/:id.json')
  async deleteCustomer(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[Customer Tag - Gán Tag] [POST /com/customers/:id/tags.json] Gắn thẻ Tag cho khách hàng',
    description: '[Thuộc danh mục: 04. Customers > Thẻ Tag phân nhóm] Endpoint gốc: POST https://apis.haravan.com/com/customers/{id}/tags.json | Thêm nhãn tag phân nhóm khách',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '99120' })
  @ApiBody({ type: HaravanOrderTagsDto })
  @Post('com/customers/:id/tags.json')
  async addCustomerTags(@Param('id') id: string, @Body() dto: HaravanOrderTagsDto, @Headers('x-uniflow-mode') mode?: string) {
    return { customer: { id: Number(id), tags: dto.tags, mode: mode || 'SANDBOX' } };
  }

  @ApiOperation({
    summary: '[Customer Tag - Gỡ Tag] [DELETE /com/customers/:id/tags.json] Gỡ bỏ thẻ Tag khỏi khách hàng',
    description: '[Thuộc danh mục: 04. Customers > Thẻ Tag phân nhóm] Endpoint gốc: DELETE https://apis.haravan.com/com/customers/{id}/tags.json | Xóa nhãn tag khỏi khách',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '99120' })
  @ApiBody({ type: HaravanOrderTagsDto })
  @Delete('com/customers/:id/tags.json')
  async removeCustomerTags(@Param('id') id: string, @Body() dto: HaravanOrderTagsDto, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, customer_id: Number(id), removed_tags: dto.tags, mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// CUSTOMER ADDRESSES SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 04. Customers (Khách hàng & Sổ địa chỉ)')
@Controller('api/v1/infra/haravan')
export class HaravanCustomerAddressesController {
  @ApiOperation({
    summary: '[Customer Address - Sổ địa chỉ] [GET /com/customers/:customer_id/addresses.json] Danh sách địa chỉ nhận hàng',
    description: '[Thuộc danh mục: 04. Customers > Sổ địa chỉ nhận hàng] Endpoint gốc: GET https://apis.haravan.com/com/customers/{customer_id}/addresses.json | Sổ địa chỉ của khách hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'customer_id', example: '99120' })
  @Get('com/customers/:customer_id/addresses.json')
  async listAddresses(@Param('customer_id') customerId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      addresses: [
        { id: 401, customer_id: Number(customerId), address1: '123 CMT8, Phường 5, Quận 3', city: 'Hồ Chí Minh', default: true },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Customer Address - Sổ địa chỉ] [GET /com/customers/:customer_id/addresses/:id.json] Chi tiết địa chỉ nhận hàng',
    description: '[Thuộc danh mục: 04. Customers > Sổ địa chỉ nhận hàng] Endpoint gốc: GET https://apis.haravan.com/com/customers/{customer_id}/addresses/{id}.json | Xem thông tin một địa chỉ',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'customer_id', example: '99120' })
  @ApiParam({ name: 'id', example: '401' })
  @Get('com/customers/:customer_id/addresses/:id.json')
  async getAddressById(@Param('customer_id') customerId: string, @Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      address: { id: Number(id), customer_id: Number(customerId), address1: '123 CMT8, Quận 3', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Customer Address - Sổ địa chỉ] [POST /com/customers/:customer_id/addresses.json] Thêm địa chỉ mới cho khách hàng',
    description: '[Thuộc danh mục: 04. Customers > Sổ địa chỉ nhận hàng] Endpoint gốc: POST https://apis.haravan.com/com/customers/{customer_id}/addresses.json | Thêm địa chỉ giao nhận mới',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'customer_id', example: '99120' })
  @ApiBody({ type: HaravanCustomerAddressDto })
  @Post('com/customers/:customer_id/addresses.json')
  async createAddress(@Param('customer_id') customerId: string, @Body() dto: HaravanCustomerAddressDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      address: { id: Date.now(), customer_id: Number(customerId), address1: dto.address1, city: dto.city, default: dto.default || false, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Customer Address - Sổ địa chỉ] [PUT /com/customers/:customer_id/addresses/:id.json] Cập nhật địa chỉ nhận hàng',
    description: '[Thuộc danh mục: 04. Customers > Sổ địa chỉ nhận hàng] Endpoint gốc: PUT https://apis.haravan.com/com/customers/{customer_id}/addresses/{id}.json | Sửa địa chỉ',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'customer_id', example: '99120' })
  @ApiParam({ name: 'id', example: '401' })
  @ApiBody({ type: HaravanCustomerAddressDto })
  @Put('com/customers/:customer_id/addresses/:id.json')
  async updateAddress(@Param('customer_id') customerId: string, @Param('id') id: string, @Body() dto: HaravanCustomerAddressDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      address: { id: Number(id), customer_id: Number(customerId), address1: dto.address1, city: dto.city, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Customer Address - Sổ địa chỉ] [DELETE /com/customers/:customer_id/addresses/:id.json] Xóa địa chỉ khỏi sổ địa chỉ',
    description: '[Thuộc danh mục: 04. Customers > Sổ địa chỉ nhận hàng] Endpoint gốc: DELETE https://apis.haravan.com/com/customers/{customer_id}/addresses/{id}.json | Xóa địa chỉ',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'customer_id', example: '99120' })
  @ApiParam({ name: 'id', example: '401' })
  @Delete('com/customers/:customer_id/addresses/:id.json')
  async deleteAddress(@Param('customer_id') customerId: string, @Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[Customer Address - Sổ địa chỉ] [PUT /com/customers/:customer_id/addresses/:id/default.json] Đặt địa chỉ làm mặc định',
    description: '[Thuộc danh mục: 04. Customers > Sổ địa chỉ nhận hàng] Endpoint gốc: PUT https://apis.haravan.com/com/customers/{customer_id}/addresses/{id}/default.json | Gán địa chỉ mặc định nhận hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'customer_id', example: '99120' })
  @ApiParam({ name: 'id', example: '401' })
  @Put('com/customers/:customer_id/addresses/:id/default.json')
  async setDefaultAddress(@Param('customer_id') customerId: string, @Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, customer_id: Number(customerId), default_address_id: Number(id), mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[Customer Address - Sổ địa chỉ] [PUT /com/customers/:customer_id/addresses/set.json] Cập nhật đồng loạt địa chỉ',
    description: '[Thuộc danh mục: 04. Customers > Sổ địa chỉ nhận hàng] Endpoint gốc: PUT https://apis.haravan.com/com/customers/{customer_id}/addresses/set.json | Cập nhật nhiều địa chỉ cùng lúc',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'customer_id', example: '99120' })
  @Put('com/customers/:customer_id/addresses/set.json')
  async bulkSetAddresses(@Param('customer_id') customerId: string, @Body() body: any, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, customer_id: Number(customerId), updated: true, mode: mode || 'SANDBOX' };
  }
}
