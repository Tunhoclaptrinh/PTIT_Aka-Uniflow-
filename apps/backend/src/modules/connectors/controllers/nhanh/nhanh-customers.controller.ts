import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  NhanhSearchCustomerDto,
  NhanhAddCustomerDto,
  NhanhUpdateCustomerDto,
  NhanhCustomerPointsDto,
} from '../../dto/pos-nhanh.dto';

@ApiTags('[02. POS-Nhanh] 05. Khách hàng & Loyalty (Customer)')
@Controller('api/v1/infra/nhanh')
export class NhanhCustomersController {

  @ApiOperation({
    summary: '[POST /api/customer/search] Tìm kiếm khách hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/customer/search | Docs: https://developers.nhanh.group/pos/customers/search | Tìm kiếm khách hàng theo số điện thoại',
  })
  @ApiBody({ type: NhanhSearchCustomerDto })
  @Post('api/customer/search')
  async searchCustomer(@Body() dto: NhanhSearchCustomerDto) {
    return {
      code: 1,
      data: {
        customerId: 89124,
        name: 'Lê Hoàng Nam',
        mobile: dto.mobile,
        email: 'nam.le@example.com',
        points: 150,
        address: '456 Lê Văn Sỹ, P.12, Q.3, TP.HCM',
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/customer/add] Thêm mới khách hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/customer/add | Docs: https://developers.nhanh.group/pos/customers/add | Tạo mới hồ sơ khách hàng',
  })
  @ApiBody({ type: NhanhAddCustomerDto })
  @Post('api/customer/add')
  async addCustomer(@Body() dto: NhanhAddCustomerDto) {
    return {
      code: 1,
      data: {
        customerId: Date.now().toString().slice(-6),
        name: dto.name,
        mobile: dto.mobile,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/customer/update] Cập nhật thông tin khách hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/customer/update | Docs: https://developers.nhanh.group/pos/customers/update | Cập nhật địa chỉ, họ tên khách hàng',
  })
  @ApiBody({ type: NhanhUpdateCustomerDto })
  @Post('api/customer/update')
  async updateCustomer(@Body() dto: NhanhUpdateCustomerDto) {
    return { code: 1, data: { customerId: dto.customerId, updated: true, updated_at: new Date().toISOString() } };
  }

  @ApiOperation({
    summary: '[POST /api/customer/points] Tích / Tiêu điểm khách hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/customer/points | Docs: https://developers.nhanh.group/pos/customers/points | Thay đổi điểm tích lũy',
  })
  @ApiBody({ type: NhanhCustomerPointsDto })
  @Post('api/customer/points')
  async adjustCustomerPoints(@Body() dto: NhanhCustomerPointsDto) {
    return {
      code: 1,
      data: {
        customerId: dto.customerId,
        pointsChanged: dto.points,
        newBalance: 250,
        reason: dto.reason,
        updated_at: new Date().toISOString(),
      },
    };
  }
}
