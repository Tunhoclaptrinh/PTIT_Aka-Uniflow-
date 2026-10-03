import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  KiotVietCreateCategoryDto,
  KiotVietCreateSupplierDto,
} from '../../dto/pos-kiotviet.dto';

@ApiTags('[POS-KiotViet] 05. Chi nhánh & Danh mục & NCC (Branches & Categories & Suppliers)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietBranchesController {

  @ApiOperation({
    summary: '[GET /branches] Danh sách chi nhánh KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/branches | Docs: https://developer.kiotviet.vn/#/branches | Tra cứu danh mục tất cả cửa hàng chi nhánh KiotViet',
  })
  @Get('branches')
  async listBranches() {
    return {
      data: [
        { id: 101, branchName: 'Cửa hàng 1 - Cầu Giấy, Hà Nội', address: '123 Cầu Giấy, Hà Nội' },
        { id: 102, branchName: 'Cửa hàng 2 - Quận 1, TP.HCM', address: '45 Lê Thánh Tôn, Bến Nghé, Q.1, TP.HCM' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /categories] Thêm nhóm hàng hóa KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/categories | Docs: https://developer.kiotviet.vn/#/categories | Tạo mới nhóm hàng hóa trong cây phân loại sản phẩm',
  })
  @ApiBody({ type: KiotVietCreateCategoryDto })
  @Post('categories')
  async createCategory(@Body() dto: KiotVietCreateCategoryDto) {
    return {
      categoryId: Date.now(),
      categoryName: dto.categoryName,
      parentId: dto.parentId || null,
      createdDate: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[GET /categories] Danh sách nhóm hàng hóa KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/categories | Docs: https://developer.kiotviet.vn/#/categories | Lấy toàn bộ cây danh mục nhóm hàng',
  })
  @Get('categories')
  async listCategories() {
    return {
      data: [
        { categoryId: 101, categoryName: 'Điện Thoại & Máy Tính Bảng' },
        { categoryId: 102, categoryName: 'Phụ Kiện Tai Nghe, Cáp Sạc' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /suppliers] Thêm nhà cung cấp mới KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/suppliers | Docs: https://developer.kiotviet.vn/#/suppliers | Khởi tạo hồ sơ đối tác nhà cung cấp hàng hóa',
  })
  @ApiBody({ type: KiotVietCreateSupplierDto })
  @Post('suppliers')
  async createSupplier(@Body() dto: KiotVietCreateSupplierDto) {
    return {
      supplierId: Date.now(),
      name: dto.name,
      contactNumber: dto.contactNumber,
      address: dto.address,
      createdDate: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[GET /suppliers] Danh sách nhà cung cấp KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/suppliers | Docs: https://developer.kiotviet.vn/#/suppliers | Tra cứu danh bạ nhà phân phối / nhà cung cấp',
  })
  @Get('suppliers')
  async listSuppliers() {
    return {
      data: [
        { id: 901, name: 'Công ty Cổ phần Công Nghệ Tân Á', contactNumber: '02439998877', address: 'Hà Nội' },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /surcharges] Danh sách loại thu khác (Surcharges) KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/surcharges | Docs: https://developer.kiotviet.vn/#/surcharges | Tra cứu phụ thu, phí đóng gói, phí dịch vụ',
  })
  @Get('surcharges')
  async listSurcharges() {
    return {
      data: [
        { id: 1, name: 'Phí dịch vụ bọc quà', surchargeVal: 20000 },
        { id: 2, name: 'Phí giao hàng nội thành hỏa tốc', surchargeVal: 35000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /users] Danh sách tài khoản nhân viên KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/users | Docs: https://developer.kiotviet.vn/#/users | Tra cứu danh sách nhân sự trên phần mềm',
  })
  @Get('users')
  async listUsers() {
    return {
      data: [
        { id: 401, userName: 'admin_caugiay', givenName: 'Trần Văn Quản Lý' },
        { id: 402, userName: 'thungan_01', givenName: 'Phạm Thu Hằng' },
      ],
    };
  }
}
