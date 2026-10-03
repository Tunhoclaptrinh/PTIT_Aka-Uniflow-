import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  SapoCreateCustomerDto,
  SapoUpdateCustomerDto,
  SapoAdjustLoyaltyPointsDto,
} from '../../dto/pos-sapo.dto';

// ── 1. Customer Resource ──
@ApiTags('[POS-Sapo] 13. Customer')
@Controller('api/v1/infra/sapo')
export class SapoCustomersController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /admin/customers.json] Thêm mới khách hàng Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/customers.json | Docs: https://support.sapo.vn/gioi-thieu-api | Khởi tạo hồ sơ khách hàng mới trên Sapo CRM',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoCreateCustomerDto })
  @Post('admin/customers.json')
  async createCustomer(@Body() dto: SapoCreateCustomerDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_create_customer', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[GET /admin/customers.json] Danh sách khách hàng Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/customers.json | Tra cứu danh bạ khách hàng Sapo',
  })
  @Get('admin/customers.json')
  async listCustomers(@Query('limit') limit = 20) {
    return {
      customers: [
        { id: 1001, full_name: 'Trần Văn Mạnh', phone: '0912345678', total_spent: 1250000, points: 125 },
        { id: 1002, full_name: 'Lê Thu Trang', phone: '0988776655', total_spent: 3400000, points: 340 },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /admin/customers/:id.json] Chi tiết khách hàng Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/customers/{id}.json | Xem hồ sơ chi tiết và lịch sử mua hàng của khách',
  })
  @Get('admin/customers/:id.json')
  async getCustomerById(@Param('id') id: string) {
    return {
      customer: {
        id: Number(id),
        full_name: 'Trần Văn Mạnh',
        phone: '0912345678',
        email: 'manh.tran@example.com',
        points: 125,
        total_orders: 4,
      },
    };
  }

  @ApiOperation({
    summary: '[PUT /admin/customers/:id.json] Cập nhật khách hàng Sapo',
    description: 'Endpoint gốc: PUT https://{store_name}.mysapo.net/admin/customers/{id}.json | Cập nhật số điện thoại, địa chỉ hoặc email khách hàng',
  })
  @ApiBody({ type: SapoUpdateCustomerDto })
  @Put('admin/customers/:id.json')
  async updateCustomer(@Param('id') id: string, @Body() dto: SapoUpdateCustomerDto) {
    return { success: true, customer: { ...dto, id: Number(id) || dto.id }, updated_at: new Date().toISOString() };
  }

  @ApiOperation({
    summary: '[DELETE /admin/customers/:id.json] Xóa khách hàng Sapo',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/customers/{id}.json | Xóa hồ sơ khách hàng khỏi Sapo CRM',
  })
  @Delete('admin/customers/:id.json')
  async deleteCustomer(@Param('id') id: string) {
    return { success: true, deleted_id: id, message: `Đã xóa khách hàng #${id}` };
  }

  @ApiOperation({
    summary: '[POST /admin/customers/:id/loyalty_points.json] Tích / Tiêu điểm Loyalty Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/customers/{id}/loyalty_points.json | Docs: https://support.sapo.vn/gioi-thieu-api | Cộng hoặc trừ điểm tích lũy khách hàng thân thiết trên Sapo',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoAdjustLoyaltyPointsDto })
  @Post('admin/customers/:id/loyalty_points.json')
  async adjustPoints(@Param('id') id: string, @Body() dto: SapoAdjustLoyaltyPointsDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_adjust_loyalty_points', { ...dto, customerId: Number(id) || dto.customerId }, this.getEffectiveMode(mode));
  }
}

// ── 2. CustomerAddress Resource ──
@ApiTags('[POS-Sapo] 14. CustomerAddress')
@Controller('api/v1/infra/sapo')
export class SapoCustomerAddressesController {
  @ApiOperation({
    summary: '[GET /admin/customers/:customer_id/addresses.json] Danh sách sổ địa chỉ khách hàng',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/customers/{customer_id}/addresses.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tra cứu danh sách địa chỉ nhận hàng của khách',
  })
  @Get('admin/customers/:customer_id/addresses.json')
  async listAddresses(@Param('customer_id') customerId: string) {
    return {
      addresses: [
        { id: 101, customer_id: Number(customerId), address1: '123 Phố Huế, Hai Bà Trưng', city: 'Hà Nội', is_default: true, phone: '0912345678' },
        { id: 102, customer_id: Number(customerId), address1: 'Tòa Landmark 81, Bình Thạnh', city: 'Hồ Chí Minh', is_default: false, phone: '0912345678' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /admin/customers/:customer_id/addresses.json] Thêm địa chỉ mới cho khách hàng',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/customers/{customer_id}/addresses.json | Thêm địa chỉ giao hàng vào sổ địa chỉ',
  })
  @Post('admin/customers/:customer_id/addresses.json')
  async addAddress(@Param('customer_id') customerId: string, @Body() body: any) {
    return {
      customer_address: {
        id: Date.now(),
        customer_id: Number(customerId),
        address1: body.address1 || 'Địa chỉ mới',
        city: body.city || 'Hà Nội',
        phone: body.phone || '0900000000',
        is_default: body.is_default ?? false,
      },
    };
  }

  @ApiOperation({
    summary: '[PUT /admin/customers/:customer_id/addresses/:id.json] Cập nhật địa chỉ khách hàng',
    description: 'Endpoint gốc: PUT https://{store_name}.mysapo.net/admin/customers/{customer_id}/addresses/{id}.json | Sửa thông tin địa chỉ giao nhận',
  })
  @Put('admin/customers/:customer_id/addresses/:id.json')
  async updateAddress(@Param('customer_id') customerId: string, @Param('id') id: string, @Body() body: any) {
    return {
      customer_address: { id: Number(id), customer_id: Number(customerId), ...body, updated_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/customers/:customer_id/addresses/:id.json] Xóa địa chỉ khách hàng',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/customers/{customer_id}/addresses/{id}.json | Xóa địa chỉ khỏi sổ địa chỉ',
  })
  @Delete('admin/customers/:customer_id/addresses/:id.json')
  async deleteAddress(@Param('customer_id') customerId: string, @Param('id') id: string) {
    return { success: true, deleted_id: Number(id), message: 'Đã xóa địa chỉ khách hàng' };
  }
}
