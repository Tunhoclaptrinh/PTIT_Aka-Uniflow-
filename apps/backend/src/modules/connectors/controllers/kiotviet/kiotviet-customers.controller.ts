import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  KiotVietCreateCustomerDto,
  KiotVietUpdateCustomerDto,
  KiotVietLoyaltyPointDto,
  KiotVietCashFlowDto,
} from '../../dto/pos-kiotviet.dto';

@ApiTags('[POS-KiotViet] 04. Customers & Cashflow (Khách hàng & Sổ quỹ)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietCustomersController {

  @ApiOperation({
    summary: '[Customer - Khách hàng] [POST /customers] Tạo khách hàng mới KiotViet',
    description: '[Thuộc danh mục: 2.6. Khách hàng > Customer] Endpoint gốc: POST https://public.kiotapi.com/customers | Thêm mới khách hàng vào danh bạ quản lý KiotViet',
  })
  @ApiBody({ type: KiotVietCreateCustomerDto })
  @Post('customers')
  async createCustomer(@Body() dto: KiotVietCreateCustomerDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        name: dto.name,
        contactNumber: dto.contactNumber,
        address: dto.address,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Customer - Khách hàng] [GET /customers] Danh sách khách hàng KiotViet',
    description: '[Thuộc danh mục: 2.6. Khách hàng > Customer] Endpoint gốc: GET https://public.kiotapi.com/customers | Tra cứu danh sách khách hàng và lịch sử mua sắm KiotViet',
  })
  @ApiQuery({ name: 'pageSize', example: 20, required: false })
  @Get('customers')
  async listCustomers(@Query('pageSize') pageSize: number = 20) {
    return {
      total: 2,
      data: [
        { id: 10291, name: 'Phạm Thanh Tùng', contactNumber: '0988665544', address: 'Ba Đình, Hà Nội', totalInvoiced: 4500000 },
        { id: 10292, name: 'Nguyễn Thị Mai', contactNumber: '0912334455', address: 'Cầu Giấy, Hà Nội', totalInvoiced: 1200000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Customer - Khách hàng] [GET /customers/:id] Chi tiết hồ sơ khách hàng theo ID',
    description: '[Thuộc danh mục: 2.6. Khách hàng > Customer] Endpoint gốc: GET https://public.kiotapi.com/customers/{id} | Chi tiết thông tin liên hệ, công nợ và nhóm khách hàng',
  })
  @ApiParam({ name: 'id', example: '10291' })
  @Get('customers/:id')
  async getCustomerById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: {
        id: Number(id),
        name: 'Phạm Thanh Tùng',
        contactNumber: '0988665544',
        address: 'Ba Đình, Hà Nội',
        debt: 0,
        totalInvoiced: 4500000,
      },
    };
  }

  @ApiOperation({
    summary: '[Customer - Khách hàng] [PUT /customers/:id] Cập nhật thông tin khách hàng',
    description: '[Thuộc danh mục: 2.6. Khách hàng > Customer] Endpoint gốc: PUT https://public.kiotapi.com/customers/{id} | Cập nhật tên, số điện thoại, địa chỉ hoặc email',
  })
  @ApiParam({ name: 'id', example: '10291' })
  @ApiBody({ type: KiotVietUpdateCustomerDto })
  @Put('customers/:id')
  async updateCustomer(@Param('id') id: string, @Body() dto: KiotVietUpdateCustomerDto) {
    return { responseStatus: 'success', data: { customerId: Number(id) || dto.customerId, updated: true } };
  }

  @ApiOperation({
    summary: '[Customer - Khách hàng] [DELETE /customers/:id] Xóa hồ sơ khách hàng KiotViet',
    description: '[Thuộc danh mục: 2.6. Khách hàng > Customer] Endpoint gốc: DELETE https://public.kiotapi.com/customers/{id} | Xóa hồ sơ khách hàng khỏi hệ thống',
  })
  @ApiParam({ name: 'id', example: '10291' })
  @Delete('customers/:id')
  async deleteCustomer(@Param('id') id: string) {
    return { responseStatus: 'success', message: `Xóa khách hàng #${id} thành công` };
  }

  @ApiOperation({
    summary: '[Customer Batch - Khách hàng hàng loạt] [POST /customers/batch] Thêm mới danh sách khách hàng hàng loạt',
    description: '[Thuộc danh mục: 2.6. Khách hàng > Customer Batch] Endpoint gốc: POST https://public.kiotapi.com/customers/batch | Thêm mới đồng thời nhiều khách hàng trong 1 request',
  })
  @ApiBody({ description: 'Mảng danh sách khách hàng cần thêm mới' })
  @Post('customers/batch')
  async batchCreateCustomers(@Body() body: any) {
    return { responseStatus: 'success', message: 'Thêm mới danh sách khách hàng thành công' };
  }

  @ApiOperation({
    summary: '[Customer Batch - Khách hàng hàng loạt] [PUT /customers/batch] Cập nhật danh sách khách hàng hàng loạt',
    description: '[Thuộc danh mục: 2.6. Khách hàng > Customer Batch] Endpoint gốc: PUT https://public.kiotapi.com/customers/batch | Cập nhật đồng loạt danh sách khách hàng',
  })
  @ApiBody({ description: 'Mảng danh sách khách hàng cần cập nhật' })
  @Put('customers/batch')
  async batchUpdateCustomers(@Body() body: any) {
    return { responseStatus: 'success', message: 'Cập nhật danh sách khách hàng thành công' };
  }

  @ApiOperation({
    summary: '[Customer Group - Nhóm khách hàng] [GET /customers/group] Danh sách nhóm khách hàng KiotViet',
    description: '[Thuộc danh mục: 2.13. Nhóm khách hàng > Customer Group] Endpoint gốc: GET https://public.kiotapi.com/customers/group | Tra cứu danh sách các nhóm/phân hạng khách hàng (VIP, Bán buôn, Khách lẻ)',
  })
  @Get('customers/group')
  async listCustomerGroups() {
    return {
      total: 3,
      data: [
        { groupId: 1, groupName: 'Khách hàng thân thiết', discountRatio: 5 },
        { groupId: 2, groupName: 'Đại lý VIP', discountRatio: 15 },
        { groupId: 3, groupName: 'Khách bán buôn', discountRatio: 20 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Loyalty - Tích điểm hội viên] [POST /customers/:id/loyalty] Tích điểm / tiêu điểm hội viên KiotViet',
    description: '[Thuộc danh mục: 2.6. Khách hàng > Loyalty] Endpoint gốc: POST https://public.kiotapi.com/customers/{id}/loyalty | Cộng hoặc trừ điểm tích lũy khách hàng thân thiết KiotViet Loyalty',
  })
  @ApiParam({ name: 'id', example: '10291' })
  @ApiBody({ type: KiotVietLoyaltyPointDto })
  @Post('customers/:id/loyalty')
  async adjustPoints(@Param('id') id: string, @Body() dto: KiotVietLoyaltyPointDto) {
    return {
      responseStatus: 'success',
      data: {
        customerId: Number(id) || dto.customerId,
        changePoints: dto.changePoints,
        newTotalPoints: 350 + dto.changePoints,
        reason: dto.reason,
        updatedDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Cashflow - Sổ quỹ thu chi] [POST /cashflow] Lập phiếu thu chi tiền mặt sổ quỹ KiotViet',
    description: '[Thuộc danh mục: 2.14. Sổ quỹ > Cashflow] Endpoint gốc: POST https://public.kiotapi.com/cashflow | Lập phiếu thu tiền hoặc phiếu chi quỹ tiền mặt cửa hàng KiotViet',
  })
  @ApiBody({ type: KiotVietCashFlowDto })
  @Post('cashflow')
  async createCashFlow(@Body() dto: KiotVietCashFlowDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        code: dto.flowType === 'RECEIPT' ? `PT${Date.now().toString().slice(-8)}` : `PC${Date.now().toString().slice(-8)}`,
        branchId: dto.branchId,
        amount: dto.amount,
        description: dto.description,
        contactName: dto.contactName,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Cashflow - Sổ quỹ thu chi] [GET /cashflow] Danh sách phiếu thu chi sổ quỹ KiotViet',
    description: '[Thuộc danh mục: 2.14. Sổ quỹ > Cashflow] Endpoint gốc: GET https://public.kiotapi.com/cashflow | Tra cứu danh sách các giao dịch thu tiền, chi tiền trong sổ quỹ',
  })
  @ApiQuery({ name: 'branchId', example: 101, required: false })
  @Get('cashflow')
  async listCashFlow(@Query('branchId') branchId: number = 101) {
    return {
      total: 1,
      data: [
        { id: 501, code: 'PT000501', branchId, amount: 500000, description: 'Thu tiền bán hàng ca sáng', createdDate: new Date().toISOString() },
      ],
    };
  }

  @ApiOperation({
    summary: '[Cashflow - Sổ quỹ thu chi] [GET /cashflow/:id] Chi tiết phiếu thu chi sổ quỹ theo ID',
    description: '[Thuộc danh mục: 2.14. Sổ quỹ > Cashflow] Endpoint gốc: GET https://public.kiotapi.com/cashflow/{id} | Chi tiết phiếu thu chi tiền mặt theo ID',
  })
  @ApiParam({ name: 'id', example: '501' })
  @Get('cashflow/:id')
  async getCashFlowById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: { id: Number(id), code: `PT000${id}`, amount: 500000, description: 'Thu tiền bán hàng ca sáng' },
    };
  }
}
