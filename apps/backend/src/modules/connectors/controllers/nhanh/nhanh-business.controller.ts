import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  NhanhBusinessDepotDto,
  NhanhBusinessEmployeeDto,
  NhanhBusinessDepartmentDto,
  NhanhBusinessSupplierSearchDto,
  NhanhBusinessSupplierAddDto,
} from '../../dto/pos-nhanh.dto';

@ApiTags('[POS-Nhanh] 06. Doanh nghiệp (Business: Kho, NV, NCC)')
@Controller('api/v1/infra/nhanh')
export class NhanhBusinessController {

  @ApiOperation({
    summary: '[POST /api/business/depot] Danh sách kho hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/business/depot | Docs: https://developers.nhanh.group/pos/business/depot | Lấy danh sách điểm kho và cửa hàng',
  })
  @ApiBody({ type: NhanhBusinessDepotDto })
  @Post('api/business/depot')
  async listDepots(@Body() dto: NhanhBusinessDepotDto) {
    return {
      code: 1,
      data: [
        { depotId: 101, name: 'Kho Tổng Hà Nội - Cầu Giấy', city: 'Hà Nội', address: '18 Phạm Hùng, Cầu Giấy' },
        { depotId: 102, name: 'Chi nhánh TP.HCM - Lê Văn Sỹ', city: 'TP.HCM', address: '456 Lê Văn Sỹ, Q.3' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /api/business/employee] Danh sách nhân viên Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/business/employee | Docs: https://developers.nhanh.group/pos/business/employee | Lấy danh sách nhân viên công ty',
  })
  @ApiBody({ type: NhanhBusinessEmployeeDto })
  @Post('api/business/employee')
  async listEmployees(@Body() dto: NhanhBusinessEmployeeDto) {
    return {
      code: 1,
      data: [
        { employeeId: 4401, name: 'Nguyễn Văn Thu Ngân', depotId: 102, role: 'Cashier', mobile: '0981122334' },
        { employeeId: 4402, name: 'Trần Thị Quản Lý', depotId: 102, role: 'StoreManager', mobile: '0982233445' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /api/business/department] Danh sách phòng ban Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/business/department | Docs: https://developers.nhanh.group/pos/business/department | Lấy danh sách phòng ban trong doanh nghiệp',
  })
  @ApiBody({ type: NhanhBusinessDepartmentDto })
  @Post('api/business/department')
  async listDepartments(@Body() dto: NhanhBusinessDepartmentDto) {
    return {
      code: 1,
      data: [
        { departmentId: 1, name: 'Khối Kinh Doanh Bán Lẻ' },
        { departmentId: 2, name: 'Khối Vận Hành Kho Bãi & Fulfillment' },
        { departmentId: 3, name: 'Khối Chăm Sóc Khách Hàng Omnichannel' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /api/business/supplier-search] Danh sách nhà cung cấp Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/business/supplier-search | Docs: https://developers.nhanh.group/pos/business/supplier | Tra cứu nhà cung cấp hàng hóa',
  })
  @ApiBody({ type: NhanhBusinessSupplierSearchDto })
  @Post('api/business/supplier-search')
  async searchSuppliers(@Body() dto: NhanhBusinessSupplierSearchDto) {
    return {
      code: 1,
      data: [
        { supplierId: 901, name: 'Công ty May Mặc Tân Bình', mobile: '02838991122', address: 'Tân Bình, TP.HCM' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /api/business/supplier-add] Thêm nhà cung cấp mới Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/business/supplier-add | Docs: https://developers.nhanh.group/pos/business/supplier-add | Tạo mới hồ sơ nhà cung cấp hàng',
  })
  @ApiBody({ type: NhanhBusinessSupplierAddDto })
  @Post('api/business/supplier-add')
  async addSupplier(@Body() dto: NhanhBusinessSupplierAddDto) {
    return {
      code: 1,
      data: {
        supplierId: Date.now().toString().slice(-6),
        name: dto.name,
        mobile: dto.mobile,
        created_at: new Date().toISOString(),
      },
    };
  }
}
