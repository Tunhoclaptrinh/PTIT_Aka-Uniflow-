import { Controller, Post, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  KiotVietCreateCustomerDto,
  KiotVietUpdateCustomerDto,
  KiotVietLoyaltyPointDto,
  KiotVietCashFlowDto,
} from '../../dto/pos-kiotviet.dto';

@ApiTags('[POS-KiotViet] 04. Khách hàng & Sổ quỹ (Customers & CashFlow)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietCustomersController {

  @ApiOperation({
    summary: '[POST /customers] Tạo khách hàng mới KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/customers | Docs: https://developer.kiotviet.vn/#/customers/create | Thêm mới khách hàng vào danh bạ KiotViet',
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
      },
    };
  }

  @ApiOperation({
    summary: '[GET /customers] Danh sách khách hàng KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/customers | Docs: https://developer.kiotviet.vn/#/customers/list | Tra cứu danh sách khách hàng KiotViet',
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
    summary: '[PUT /customers/:id] Cập nhật thông tin khách hàng KiotViet',
    description: 'Endpoint gốc: PUT https://public.kiotapi.com/customers/{id} | Docs: https://developer.kiotviet.vn/#/customers/update | Cập nhật tên, email khách hàng',
  })
  @ApiParam({ name: 'id', example: '10291' })
  @ApiBody({ type: KiotVietUpdateCustomerDto })
  @Put('customers/:id')
  async updateCustomer(@Param('id') id: string, @Body() dto: KiotVietUpdateCustomerDto) {
    return { responseStatus: 'success', data: { customerId: Number(id) || dto.customerId, updated: true } };
  }

  @ApiOperation({
    summary: '[POST /customers/:id/loyalty] Tích điểm / tiêu điểm hội viên KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/customers/{id}/loyalty | Docs: https://developer.kiotviet.vn/#/customers/loyalty | Cộng hoặc trừ điểm tích lũy khách hàng thân thiết KiotViet Loyalty',
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
    summary: '[POST /cashflow] Lập phiếu thu chi tiền mặt sổ quỹ KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/cashflow | Docs: https://developer.kiotviet.vn/#/cashflow | Lập phiếu thu tiền hoặc phiếu chi quỹ tiền mặt cửa hàng KiotViet',
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
}
