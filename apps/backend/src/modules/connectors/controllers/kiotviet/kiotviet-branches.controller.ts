import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  KiotVietCreateCategoryDto,
  KiotVietUpdateCategoryDto,
  KiotVietCreateSupplierDto,
  KiotVietUpdateSupplierDto,
  KiotVietSurchargeDto,
} from '../../dto/pos-kiotviet.dto';

@ApiTags('[02. POS-KiotViet] 05. Branches & Master Data (Chi nhánh, Danh mục & Nhà cung cấp)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietBranchesController {

  @ApiOperation({
    summary: '[Branch - Chi nhánh cửa hàng] [GET /branches] Danh sách chi nhánh KiotViet',
    description: '[Thuộc danh mục: 2.7. Chi nhánh > Branch] Endpoint gốc: GET https://public.kiotapi.com/branches | Tra cứu danh mục tất cả cửa hàng chi nhánh KiotViet',
  })
  @Get('branches')
  async listBranches() {
    return {
      data: [
        { id: 101, branchName: 'Cửa hàng 1 - Cầu Giấy, Hà Nội', address: '123 Cầu Giấy, Hà Nội', isActive: true },
        { id: 102, branchName: 'Cửa hàng 2 - Quận 1, TP.HCM', address: '45 Lê Thánh Tôn, Bến Nghé, Q.1, TP.HCM', isActive: true },
      ],
    };
  }

  @ApiOperation({
    summary: '[Branch - Chi nhánh cửa hàng] [GET /branches/:id] Chi tiết chi nhánh theo ID',
    description: '[Thuộc danh mục: 2.7. Chi nhánh > Branch] Endpoint gốc: GET https://public.kiotapi.com/branches/{id} | Xem thông tin chi tiết một chi nhánh cửa hàng',
  })
  @ApiParam({ name: 'id', example: '101' })
  @Get('branches/:id')
  async getBranchById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: { id: Number(id), branchName: 'Cửa hàng 1 - Cầu Giấy, Hà Nội', address: '123 Cầu Giấy, Hà Nội', phone: '02438889999' },
    };
  }

  @ApiOperation({
    summary: '[Category - Nhóm hàng hóa] [POST /categories] Thêm nhóm hàng hóa KiotViet',
    description: '[Thuộc danh mục: 2.3. Nhóm hàng > Category] Endpoint gốc: POST https://public.kiotapi.com/categories | Tạo mới nhóm hàng hóa trong cây phân loại sản phẩm',
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
    summary: '[Category - Nhóm hàng hóa] [GET /categories] Danh sách nhóm hàng hóa KiotViet',
    description: '[Thuộc danh mục: 2.3. Nhóm hàng > Category] Endpoint gốc: GET https://public.kiotapi.com/categories | Lấy toàn bộ cây danh mục nhóm hàng hóa',
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
    summary: '[Category - Nhóm hàng hóa] [GET /categories/:id] Chi tiết nhóm hàng hóa theo ID',
    description: '[Thuộc danh mục: 2.3. Nhóm hàng > Category] Endpoint gốc: GET https://public.kiotapi.com/categories/{id} | Chi tiết nhóm hàng hóa',
  })
  @ApiParam({ name: 'id', example: '101' })
  @Get('categories/:id')
  async getCategoryById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: { categoryId: Number(id), categoryName: 'Điện Thoại & Máy Tính Bảng', parentId: null },
    };
  }

  @ApiOperation({
    summary: '[Category - Nhóm hàng hóa] [PUT /categories/:id] Cập nhật nhóm hàng hóa KiotViet',
    description: '[Thuộc danh mục: 2.3. Nhóm hàng > Category] Endpoint gốc: PUT https://public.kiotapi.com/categories/{id} | Cập nhật tên hoặc nhóm cha của nhóm hàng',
  })
  @ApiParam({ name: 'id', example: '101' })
  @ApiBody({ type: KiotVietUpdateCategoryDto })
  @Put('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() dto: KiotVietUpdateCategoryDto) {
    return { responseStatus: 'success', data: { categoryId: Number(id), categoryName: dto.categoryName, updated: true } };
  }

  @ApiOperation({
    summary: '[Category - Nhóm hàng hóa] [DELETE /categories/:id] Xóa nhóm hàng hóa KiotViet',
    description: '[Thuộc danh mục: 2.3. Nhóm hàng > Category] Endpoint gốc: DELETE https://public.kiotapi.com/categories/{id} | Xóa nhóm hàng hóa khỏi cây phân loại',
  })
  @ApiParam({ name: 'id', example: '101' })
  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return { responseStatus: 'success', message: `Xóa nhóm hàng #${id} thành công` };
  }

  @ApiOperation({
    summary: '[Supplier - Nhà cung cấp] [POST /suppliers] Thêm nhà cung cấp mới KiotViet',
    description: '[Thuộc danh mục: 2.26. Nhà cung cấp > Supplier] Endpoint gốc: POST https://public.kiotapi.com/suppliers | Khởi tạo hồ sơ đối tác nhà cung cấp hàng hóa',
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
    summary: '[Supplier - Nhà cung cấp] [GET /suppliers] Danh sách nhà cung cấp KiotViet',
    description: '[Thuộc danh mục: 2.26. Nhà cung cấp > Supplier] Endpoint gốc: GET https://public.kiotapi.com/suppliers | Tra cứu danh bạ nhà phân phối / nhà cung cấp và công nợ',
  })
  @Get('suppliers')
  async listSuppliers() {
    return {
      data: [
        { id: 901, code: 'NCC000901', name: 'Công ty Cổ phần Công Nghệ Tân Á', contactNumber: '02439998877', address: 'Hà Nội', debt: 15000000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Supplier - Nhà cung cấp] [GET /suppliers/:id] Chi tiết nhà cung cấp theo ID',
    description: '[Thuộc danh mục: 2.26. Nhà cung cấp > Supplier] Endpoint gốc: GET https://public.kiotapi.com/suppliers/{id} | Xem thông tin chi tiết nhà cung cấp theo ID',
  })
  @ApiParam({ name: 'id', example: '901' })
  @Get('suppliers/:id')
  async getSupplierById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: { id: Number(id), code: `NCC000${id}`, name: 'Công ty Cổ phần Công Nghệ Tân Á', contactNumber: '02439998877', address: 'Hà Nội' },
    };
  }

  @ApiOperation({
    summary: '[Supplier - Nhà cung cấp] [PUT /suppliers/:id] Cập nhật thông tin nhà cung cấp',
    description: '[Thuộc danh mục: 2.26. Nhà cung cấp > Supplier] Endpoint gốc: PUT https://public.kiotapi.com/suppliers/{id} | Cập nhật tên, SĐT, địa chỉ hoặc mã số thuế',
  })
  @ApiParam({ name: 'id', example: '901' })
  @ApiBody({ type: KiotVietUpdateSupplierDto })
  @Put('suppliers/:id')
  async updateSupplier(@Param('id') id: string, @Body() dto: KiotVietUpdateSupplierDto) {
    return { responseStatus: 'success', data: { id: Number(id), updated: true } };
  }

  @ApiOperation({
    summary: '[Supplier - Nhà cung cấp] [DELETE /suppliers/:id] Xóa nhà cung cấp KiotViet',
    description: '[Thuộc danh mục: 2.26. Nhà cung cấp > Supplier] Endpoint gốc: DELETE https://public.kiotapi.com/suppliers/{id} | Xóa nhà cung cấp khỏi danh bạ',
  })
  @ApiParam({ name: 'id', example: '901' })
  @Delete('suppliers/:id')
  async deleteSupplier(@Param('id') id: string) {
    return { responseStatus: 'success', message: `Xóa nhà cung cấp #${id} thành công` };
  }

  @ApiOperation({
    summary: '[Surcharge - Thu khác & Phụ thu] [GET /surcharges] Danh sách loại thu khác (Surcharges)',
    description: '[Thuộc danh mục: 2.10. Thu khác > Surcharge] Endpoint gốc: GET https://public.kiotapi.com/surcharges | Tra cứu phụ thu, phí đóng gói, phí dịch vụ',
  })
  @Get('surcharges')
  async listSurcharges() {
    return {
      data: [
        { id: 1, name: 'Phí dịch vụ bọc quà', surchargeVal: 20000, isAuto: false },
        { id: 2, name: 'Phí giao hàng nội thành hỏa tốc', surchargeVal: 35000, isAuto: false },
      ],
    };
  }

  @ApiOperation({
    summary: '[Surcharge - Thu khác & Phụ thu] [POST /surcharges] Thêm loại thu khác mới',
    description: '[Thuộc danh mục: 2.10. Thu khác > Surcharge] Endpoint gốc: POST https://public.kiotapi.com/surcharges | Tạo mới khoản phụ thu dịch vụ',
  })
  @ApiBody({ type: KiotVietSurchargeDto })
  @Post('surcharges')
  async createSurcharge(@Body() dto: KiotVietSurchargeDto) {
    return { responseStatus: 'success', data: { id: Date.now(), name: dto.name, surchargeVal: dto.surchargeVal } };
  }

  @ApiOperation({
    summary: '[Surcharge - Thu khác & Phụ thu] [PUT /surcharges/:id] Cập nhật loại thu khác',
    description: '[Thuộc danh mục: 2.10. Thu khác > Surcharge] Endpoint gốc: PUT https://public.kiotapi.com/surcharges/{id} | Cập nhật tên hoặc giá trị phụ thu',
  })
  @ApiParam({ name: 'id', example: '1' })
  @Put('surcharges/:id')
  async updateSurcharge(@Param('id') id: string, @Body() dto: KiotVietSurchargeDto) {
    return { responseStatus: 'success', data: { id: Number(id), updated: true } };
  }

  @ApiOperation({
    summary: '[Surcharge - Thu khác & Phụ thu] [DELETE /surcharges/:id] Ngừng hoạt động thu khác',
    description: '[Thuộc danh mục: 2.10. Thu khác > Surcharge] Endpoint gốc: DELETE https://public.kiotapi.com/surcharges/{id} | Ngừng hoạt động loại thu khác',
  })
  @ApiParam({ name: 'id', example: '1' })
  @Delete('surcharges/:id')
  async deleteSurcharge(@Param('id') id: string) {
    return { responseStatus: 'success', message: 'Ngừng hoạt động thu khác thành công' };
  }

  @ApiOperation({
    summary: '[User - Người dùng & Nhân viên] [GET /users] Danh sách tài khoản nhân viên KiotViet',
    description: '[Thuộc danh mục: 2.8. Người dùng > User] Endpoint gốc: GET https://public.kiotapi.com/users | Tra cứu danh sách nhân sự trên phần mềm',
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

  @ApiOperation({
    summary: '[User - Người dùng & Nhân viên] [GET /users/:id] Chi tiết tài khoản nhân viên theo ID',
    description: '[Thuộc danh mục: 2.8. Người dùng > User] Endpoint gốc: GET https://public.kiotapi.com/users/{id} | Xem thông tin tài khoản nhân viên',
  })
  @ApiParam({ name: 'id', example: '401' })
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: { id: Number(id), userName: 'admin_caugiay', givenName: 'Trần Văn Quản Lý', branchId: 101 },
    };
  }

  @ApiOperation({
    summary: '[Bank Account - Tài khoản ngân hàng] [GET /bankaccounts] Danh sách tài khoản ngân hàng',
    description: '[Thuộc danh mục: 2.9. Tài khoản ngân hàng > Bank Account] Endpoint gốc: GET https://public.kiotapi.com/bankaccounts | Tra cứu tài khoản ngân hàng nhận tiền chuyển khoản POS',
  })
  @Get('bankaccounts')
  async listBankAccounts() {
    return {
      data: [
        { id: 1, bankName: 'Vietcombank', accountNumber: '0011002233445', accountName: 'CONG TY UNIFLOW' },
        { id: 2, bankName: 'Techcombank', accountNumber: '1903344556677', accountName: 'CONG TY UNIFLOW' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Sale Channel - Kênh bán hàng] [GET /salechannels] Danh sách kênh bán hàng KiotViet',
    description: '[Thuộc danh mục: 2.18. Kênh bán hàng > Sale Channel] Endpoint gốc: GET https://public.kiotapi.com/salechannels | Tra cứu các kênh bán hàng (Facebook, Website, Shopee, Trực tiếp)',
  })
  @Get('salechannels')
  async listSaleChannels() {
    return {
      data: [
        { id: 1, name: 'Bán tại quầy', isActive: true },
        { id: 2, name: 'Facebook Fanpage', isActive: true },
        { id: 3, name: 'Website TMĐT', isActive: true },
      ],
    };
  }

  @ApiOperation({
    summary: '[Location - Khu vực địa lý] [GET /locations] Danh sách Tỉnh thành / Khu vực địa lý',
    description: '[Thuộc danh mục: 2.21. Location > Location] Endpoint gốc: GET https://public.kiotapi.com/locations | Danh mục địa bàn tỉnh thành, quận huyện KiotViet',
  })
  @Get('locations')
  async listLocations() {
    return {
      data: [
        { locationId: 1, locationName: 'Hà Nội' },
        { locationId: 2, locationName: 'Hồ Chí Minh' },
        { locationId: 3, locationName: 'Đà Nẵng' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Store Setting - Thiết lập cửa hàng] [GET /settings] Thông tin cấu hình thiết lập gian hàng',
    description: '[Thuộc danh mục: 2.22. Thiết lập cửa hàng > Store Setting] Endpoint gốc: GET https://public.kiotapi.com/settings | Lấy thông tin cấu hình phương pháp tính thuế, bán âm kho, barcode',
  })
  @Get('settings')
  async getStoreSettings() {
    return {
      data: {
        retailerId: 12345,
        currency: 'VND',
        taxMethod: 'Khấu trừ',
        allowSellNegativeStock: false,
        useAutoBarcode: true,
      },
    };
  }

  @ApiOperation({
    summary: '[Brand - Thương hiệu] [GET /trademark] Danh mục thương hiệu hàng hóa KiotViet',
    description: '[Thuộc danh mục: 2.25. Thương hiệu > Brand] Endpoint gốc: GET https://public.kiotapi.com/trademark | Toàn bộ danh mục thương hiệu của hàng hóa sắp xếp theo bảng chữ cái',
  })
  @Get('trademark')
  async listTrademarks() {
    return {
      total: 2,
      data: [
        { tradeMarkId: 1, tradeMarkName: 'Apple', createdDate: new Date().toISOString() },
        { tradeMarkId: 2, tradeMarkName: 'Samsung', createdDate: new Date().toISOString() },
      ],
    };
  }

  @ApiOperation({
    summary: '[Tax - Biểu thuế KiotViet] [GET /tax/detail] Danh sách loại thuế hỗ trợ bởi KiotViet',
    description: '[Thuộc danh mục: 2.27. Thuế > Tax] Endpoint gốc: GET https://public.kiotapi.com/tax/detail | Tra cứu danh sách các mức thuế suất VAT khấu trừ hoặc trực tiếp',
  })
  @Get('tax/detail')
  async listTaxDetail() {
    return {
      data: [
        { taxId: 1, taxName: 'VAT 0%', value: 0, type: 'Khấu trừ' },
        { taxId: 2, taxName: 'VAT 5%', value: 5, type: 'Khấu trừ' },
        { taxId: 3, taxName: 'VAT 8%', value: 8, type: 'Khấu trừ' },
        { taxId: 4, taxName: 'VAT 10%', value: 10, type: 'Khấu trừ' },
        { taxId: 5, taxName: 'KCT (Không chịu thuế)', value: null, type: 'Khấu trừ' },
      ],
      isSuccess: true,
    };
  }
}
