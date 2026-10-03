import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  MisaCrmCustomerDto,
  MisaCrmContactDto,
  MisaCrmLeadDto,
  MisaCrmOpportunityDto,
  MisaCrmQuotationDto,
  MisaCrmLoginRequestDto,
  MisaCrmV2CustomerDto,
  MisaCrmV2ContactDto,
  MisaCrmV2ProductDto,
  MisaCrmV2SaleOrderDto,
  MisaCrmStockDto,
  MisaCrmProductLedgerUpdateDto,
} from '../../dto/misa-amis-crm.dto';

// ════════════════════════════════════════════════════════════════
// 1. MISA AMIS CRM - ACCOUNT (XÁC THỰC & TOKEN)
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 01. Account (Xác thực & Token)')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmAccountController {
  @ApiOperation({
    summary: '[Account - Cấp Token] [POST /api/v2/Account] Sinh token để truy cập vào các API MISA CRM',
    description: '[Thuộc danh mục: 1. Account > Sinh Token] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/Account | Docs: https://crmconnect.misa.vn/docs-v2/index.html | Sinh token truy cập bằng client_id & client_secret',
  })
  @ApiBody({ type: MisaCrmLoginRequestDto })
  @Post('api/v2/Account')
  async createToken(@Body() dto: MisaCrmLoginRequestDto) {
    return {
      success: true,
      code: 200,
      data: {
        access_token: `crm_token_${Date.now()}_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`,
        token_type: 'Bearer',
        expires_in: 86400,
        client_id: dto.client_id,
        created_at: new Date().toISOString(),
      },
      error_message: null,
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 2. MISA AMIS CRM - CUSTOMERS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 02. Customers (Khách hàng CRM)')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmCustomersController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  // ── CRM v2 Official Specification ──
  @ApiOperation({
    summary: '[Customer - Thêm mới] [POST /api/v2/Customers] Thực hiện thêm mới khách hàng theo danh sách',
    description: '[Thuộc danh mục: 2. Customers > Thêm mới] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/Customers | Thêm mới một hoặc nhiều khách hàng (Accounts) vào CRM',
  })
  @ApiHeader({ name: 'Clientid', required: false, description: 'Client ID đăng ký kết nối' })
  @ApiBody({ type: [MisaCrmV2CustomerDto] })
  @Post('api/v2/Customers')
  async createCustomersV2(@Body() body: any) {
    const list = Array.isArray(body) ? body : [body];
    return {
      success: true,
      code: 200,
      results: list.map((item, idx) => ({
        success: true,
        id: `CRM_ACC_${Date.now()}_${idx + 1}`,
        code: item.account_code || `KH${String(Date.now()).slice(-6)}`,
      })),
      data: list,
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[Customer - Cập nhật] [PUT /api/v2/Customers] Thực hiện cập nhật khách hàng theo danh sách',
    description: '[Thuộc danh mục: 2. Customers > Cập nhật] Endpoint gốc: PUT https://crmconnect.misa.vn/api/v2/Customers | Cập nhật thông tin khách hàng CRM theo ID hoặc Account Code',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ type: [MisaCrmV2CustomerDto] })
  @Put('api/v2/Customers')
  async updateCustomersV2(@Body() body: any) {
    const list = Array.isArray(body) ? body : [body];
    return {
      success: true,
      code: 200,
      results: list.map((item, idx) => ({
        success: true,
        id: item.id || `CRM_ACC_${idx + 1}`,
        code: item.account_code || 'KH000001',
      })),
      data: list,
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[Customer - Xóa] [DELETE /api/v2/Customers] Thực hiện xoá khách hàng theo danh sách ID',
    description: '[Thuộc danh mục: 2. Customers > Xóa] Endpoint gốc: DELETE https://crmconnect.misa.vn/api/v2/Customers | Xóa danh sách khách hàng theo mảng ID',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ schema: { type: 'array', items: { type: 'string' }, example: ['CRM_ACC_001', 'CRM_ACC_002'] } })
  @Delete('api/v2/Customers')
  async deleteCustomersV2(@Body() ids: string[]) {
    return {
      success: true,
      code: 200,
      results: (ids || []).map(id => ({ success: true, id })),
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[Customer - Danh sách] [GET /api/v2/Customers] Paging lấy về danh sách khách hàng có phân trang',
    description: '[Thuộc danh mục: 2. Customers > Danh sách] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Customers | Phân trang danh sách khách hàng doanh nghiệp và cá nhân',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiQuery({ name: 'orderBy', required: false, example: 'created_date' })
  @ApiQuery({ name: 'isDescending', required: false, example: true })
  @Get('api/v2/Customers')
  async listCustomersV2(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('orderBy') orderBy?: string,
    @Query('isDescending') isDescending?: boolean,
  ) {
    return {
      success: true,
      code: 200,
      total_records: 2,
      page: Number(page),
      page_size: Number(pageSize),
      data: [
        {
          id: 'CRM_CUST_202610_001',
          account_code: 'KH000001',
          account_name: 'Công ty Cổ phần Giải Pháp Trí Tuệ Nhân Tạo AI Hub',
          tax_code: '0109988123',
          phone: '02439988776',
          email: 'contact@aihub-solutions.vn',
          billing_province: 'Hà Nội',
          owner_name: 'Lê Văn Chuyên Viên CRM',
        },
        {
          id: 'CRM_CUST_202610_002',
          account_code: 'KH000002',
          account_name: 'Tập đoàn Bán lẻ Thời Trang Quốc Tế V-Retail',
          tax_code: '0318999777',
          phone: '02838889999',
          email: 'info@vretail.vn',
          billing_province: 'Hồ Chí Minh',
          owner_name: 'Nguyễn Thị Trưởng Nhóm Bán Hàng',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Customer - Chi tiết theo ID] [GET /api/v2/Customers/id] Lấy dữ liệu khách hàng theo ID',
    description: '[Thuộc danh mục: 2. Customers > Chi tiết theo ID] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Customers/id | Lấy chi tiết hồ sơ khách hàng theo danh sách IDs',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'ids', example: 'CRM_CUST_202610_001' })
  @Get('api/v2/Customers/id')
  async getCustomersByIdsV2(@Query('ids') ids: string) {
    return {
      success: true,
      code: 200,
      data: [
        {
          id: ids || 'CRM_CUST_202610_001',
          account_code: 'KH000001',
          account_name: 'Công ty Cổ phần Giải Pháp Trí Tuệ Nhân Tạo AI Hub',
          tax_code: '0109988123',
          phone: '02439988776',
          email: 'contact@aihub-solutions.vn',
          billing_street: 'Số 10 Phạm Văn Bạch',
          billing_district: 'Cầu Giấy',
          billing_province: 'Hà Nội',
          owner_name: 'Lê Văn Chuyên Viên CRM',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Customer - Chi tiết theo Mã] [GET /api/v2/Customers/code] Lấy dữ liệu khách hàng theo mã',
    description: '[Thuộc danh mục: 2. Customers > Chi tiết theo Mã] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Customers/code | Lấy chi tiết hồ sơ khách hàng theo mã tài khoản CRM',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'code', example: 'KH000001' })
  @Get('api/v2/Customers/code')
  async getCustomerByCodeV2(@Query('code') code: string) {
    return {
      success: true,
      code: 200,
      data: {
        id: 'CRM_CUST_202610_001',
        account_code: code || 'KH000001',
        account_name: 'Công ty Cổ phần Giải Pháp Trí Tuệ Nhân Tạo AI Hub',
        tax_code: '0109988123',
        phone: '02439988776',
        email: 'contact@aihub-solutions.vn',
        billing_province: 'Hà Nội',
      },
    };
  }

  // ── Backward Compatible / UniFlow Helper Endpoints ──
  @ApiOperation({
    summary: '[Customer - Đồng bộ CRM] [POST /customers] Đồng bộ khách hàng vào MISA AMIS CRM',
    description: '[Thuộc danh mục: 2. Customers > Đồng bộ] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/customers | Cập nhật hoặc thêm mới hồ sơ khách hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: MisaCrmCustomerDto })
  @Post('customers')
  async syncCustomer(@Body() dto: MisaCrmCustomerDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction(
      'misa_crm_sync_customer',
      { customerName: dto.customerName, phone: dto.phone, email: dto.email, tier: dto.tier },
      this.getEffectiveMode(mode),
    );
  }

  @ApiOperation({
    summary: '[Customer - Tra cứu SĐT] [GET /customers/:phone] Tra cứu khách hàng theo SĐT trên AMIS CRM',
    description: '[Thuộc danh mục: 2. Customers > Tra cứu SĐT] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/customers/by-phone | Lấy thông tin khách hàng, doanh số tích lũy',
  })
  @ApiParam({ name: 'phone', example: '02439988776' })
  @Get('customers/:phone')
  async getCustomerByPhone(@Param('phone') phone: string) {
    return {
      success: true,
      data: {
        customerId: 'CRM_CUST_202610_001',
        phone,
        customerName: 'Công ty Cổ phần Giải Pháp Trí Tuệ Nhân Tạo AI Hub',
        taxCode: '0109988123',
        customerType: 'ORGANIZATION',
        tier: 'VIP_PLATINUM',
        totalSpent: 185000000,
        rewardPoints: 1850,
        ownerName: 'Lê Văn Chuyên Viên CRM',
        createdAt: '2025-06-15T08:30:00Z',
      },
    };
  }

  @ApiOperation({
    summary: '[Customer - Danh sách rút gọn] [GET /customers] Danh sách khách hàng AMIS CRM',
    description: '[Thuộc danh mục: 2. Customers > Danh sách rút gọn] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/customers | Lấy danh sách khách hàng',
  })
  @ApiQuery({ name: 'tier', example: 'VIP_PLATINUM', required: false })
  @ApiQuery({ name: 'keyword', example: 'Công nghệ', required: false })
  @Get('customers')
  async listCustomers(@Query('tier') tier?: string, @Query('keyword') keyword?: string) {
    return {
      total: 2,
      data: [
        {
          customerId: 'CRM_CUST_202610_001',
          customerName: 'Công ty Cổ phần Giải Pháp Trí Tuệ Nhân Tạo AI Hub',
          taxCode: '0109988123',
          tier: tier || 'VIP_PLATINUM',
          phone: '02439988776',
          ownerName: 'Lê Văn Chuyên Viên CRM',
        },
        {
          customerId: 'CRM_CUST_202610_002',
          customerName: 'Tập đoàn Bán lẻ Thời Trang Quốc Tế V-Retail',
          taxCode: '0318999777',
          tier: 'VIP_DIAMOND',
          phone: '02838889999',
          ownerName: 'Nguyễn Thị Trưởng Nhóm Bán Hàng',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Customer - Cập nhật ID] [PUT /customers/:id] Cập nhật phân hạng và thông tin khách hàng CRM',
    description: '[Thuộc danh mục: 2. Customers > Cập nhật ID] Endpoint gốc: PUT https://crmconnect.misa.vn/api/v2/customers/:id | Điều chỉnh thông tin phân hạng thẻ',
  })
  @ApiParam({ name: 'id', example: 'CRM_CUST_202610_001' })
  @Put('customers/:id')
  async updateCustomer(@Param('id') id: string, @Body() body: Partial<MisaCrmCustomerDto>) {
    return {
      success: true,
      message: `Đã cập nhật hồ sơ khách hàng CRM #${id}`,
      data: { customerId: id, ...body, updatedAt: new Date().toISOString() },
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 3. MISA AMIS CRM - CONTACTS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 03. Contacts (Người liên hệ)')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmContactsController {
  // ── CRM v2 Official Specification ──
  @ApiOperation({
    summary: '[Contact - Thêm mới] [POST /api/v2/Contacts] Thực hiện thêm mới người liên hệ theo danh sách',
    description: '[Thuộc danh mục: 3. Contacts > Thêm mới] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/Contacts | Thêm mới một hoặc nhiều người liên hệ vào CRM',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ type: [MisaCrmV2ContactDto] })
  @Post('api/v2/Contacts')
  async createContactsV2(@Body() body: any) {
    const list = Array.isArray(body) ? body : [body];
    return {
      success: true,
      code: 200,
      results: list.map((item, idx) => ({
        success: true,
        id: `CNT_${Date.now()}_${idx + 1}`,
        code: item.contact_code || `LH${String(Date.now()).slice(-5)}`,
      })),
      data: list,
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[Contact - Cập nhật] [PUT /api/v2/Contacts] Thực hiện cập nhật người liên hệ theo danh sách',
    description: '[Thuộc danh mục: 3. Contacts > Cập nhật] Endpoint gốc: PUT https://crmconnect.misa.vn/api/v2/Contacts | Cập nhật thông tin người liên hệ',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ type: [MisaCrmV2ContactDto] })
  @Put('api/v2/Contacts')
  async updateContactsV2(@Body() body: any) {
    const list = Array.isArray(body) ? body : [body];
    return {
      success: true,
      code: 200,
      results: list.map((item, idx) => ({
        success: true,
        id: item.id || `CNT_${idx + 1}`,
        code: item.contact_code || 'LH00001',
      })),
      data: list,
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[Contact - Xóa] [DELETE /api/v2/Contacts] Thực hiện xoá người liên hệ theo danh sách ID',
    description: '[Thuộc danh mục: 3. Contacts > Xóa] Endpoint gốc: DELETE https://crmconnect.misa.vn/api/v2/Contacts | Xóa người liên hệ theo mảng ID',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ schema: { type: 'array', items: { type: 'string' }, example: ['CNT_001', 'CNT_002'] } })
  @Delete('api/v2/Contacts')
  async deleteContactsV2(@Body() ids: string[]) {
    return {
      success: true,
      code: 200,
      results: (ids || []).map(id => ({ success: true, id })),
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[Contact - Danh sách] [GET /api/v2/Contacts] Paging lấy về danh sách người liên hệ có phân trang',
    description: '[Thuộc danh mục: 3. Contacts > Danh sách] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Contacts | Phân trang danh sách người liên hệ',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiQuery({ name: 'orderBy', required: false, example: 'created_date' })
  @ApiQuery({ name: 'isDescending', required: false, example: true })
  @Get('api/v2/Contacts')
  async listContactsV2(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('orderBy') orderBy?: string,
    @Query('isDescending') isDescending?: boolean,
  ) {
    return {
      success: true,
      code: 200,
      total_records: 1,
      page: Number(page),
      page_size: Number(pageSize),
      data: [
        {
          id: 'CNT_202610_01',
          contact_code: 'LH00001',
          contact_name: 'Phạm Hoàng Linh',
          account_name: 'Công ty Cổ phần Giải Pháp Trí Tuệ Nhân Tạo AI Hub',
          job_title: 'Giám đốc Công nghệ (CTO)',
          phone: '0987654321',
          email: 'linh.pham@aihub-solutions.vn',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Contact - Chi tiết theo ID] [GET /api/v2/Contacts/id] Lấy dữ liệu người liên hệ theo ID',
    description: '[Thuộc danh mục: 3. Contacts > Chi tiết theo ID] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Contacts/id | Lấy chi tiết người liên hệ theo danh sách ID',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'ids', example: 'CNT_202610_01' })
  @Get('api/v2/Contacts/id')
  async getContactsByIdsV2(@Query('ids') ids: string) {
    return {
      success: true,
      code: 200,
      data: [
        {
          id: ids || 'CNT_202610_01',
          contact_code: 'LH00001',
          contact_name: 'Phạm Hoàng Linh',
          job_title: 'Giám đốc Công nghệ (CTO)',
          phone: '0987654321',
          email: 'linh.pham@aihub-solutions.vn',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Contact - Chi tiết theo Mã] [GET /api/v2/Contacts/code] Lấy dữ liệu người liên hệ theo mã',
    description: '[Thuộc danh mục: 3. Contacts > Chi tiết theo Mã] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Contacts/code | Lấy chi tiết người liên hệ theo mã LH',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'code', example: 'LH00001' })
  @Get('api/v2/Contacts/code')
  async getContactByCodeV2(@Query('code') code: string) {
    return {
      success: true,
      code: 200,
      data: {
        id: 'CNT_202610_01',
        contact_code: code || 'LH00001',
        contact_name: 'Phạm Hoàng Linh',
        phone: '0987654321',
        email: 'linh.pham@aihub-solutions.vn',
      },
    };
  }

  // ── Backward Compatible Endpoints ──
  @ApiOperation({
    summary: '[Contact - Tạo mới đơn lẻ] [POST /contacts] Tạo mới người liên hệ doanh nghiệp',
    description: '[Thuộc danh mục: 3. Contacts > Tạo mới] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/contacts | Thêm người liên hệ vào hồ sơ doanh nghiệp',
  })
  @ApiBody({ type: MisaCrmContactDto })
  @Post('contacts')
  async createContact(@Body() dto: MisaCrmContactDto) {
    return {
      success: true,
      data: {
        contactId: `CNT_${Date.now()}`,
        ...dto,
        createdAt: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Contact - Danh sách rút gọn] [GET /contacts] Danh sách người liên hệ',
    description: '[Thuộc danh mục: 3. Contacts > Danh sách rút gọn] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/contacts | Tra cứu danh sách người liên hệ',
  })
  @ApiQuery({ name: 'customerId', example: 'CRM_CUST_202610_001', required: false })
  @Get('contacts')
  async listContacts(@Query('customerId') customerId?: string) {
    return {
      total: 1,
      data: [
        {
          contactId: 'CNT_202610_01',
          customerId: customerId || 'CRM_CUST_202610_001',
          contactName: 'Phạm Hoàng Linh',
          title: 'Giám đốc Công nghệ (CTO)',
          phone: '0987654321',
          email: 'linh.pham@aihub-solutions.vn',
          isDecisionMaker: true,
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Contact - Chi tiết theo param] [GET /contacts/:id] Chi tiết người liên hệ',
    description: '[Thuộc danh mục: 3. Contacts > Chi tiết] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/contacts/:id | Lấy chi tiết chức danh và kênh liên lạc',
  })
  @ApiParam({ name: 'id', example: 'CNT_202610_01' })
  @Get('contacts/:id')
  async getContactById(@Param('id') id: string) {
    return {
      success: true,
      data: {
        contactId: id,
        customerId: 'CRM_CUST_202610_001',
        contactName: 'Phạm Hoàng Linh',
        title: 'Giám đốc Công nghệ (CTO)',
        department: 'Khối Công nghệ & Chuyển đổi số',
        phone: '0987654321',
        email: 'linh.pham@aihub-solutions.vn',
        isDecisionMaker: true,
      },
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 4. MISA AMIS CRM - PRODUCTS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 04. Products (Hàng hóa & Dịch vụ CRM)')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmProductsController {
  @ApiOperation({
    summary: '[Product - Thêm mới] [POST /api/v2/Products] Thực hiện thêm mới hàng hóa / dịch vụ theo danh sách',
    description: '[Thuộc danh mục: 4. Products > Thêm mới] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/Products | Thêm mới hàng hóa/dịch vụ vào kho dữ liệu CRM',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ type: [MisaCrmV2ProductDto] })
  @Post('api/v2/Products')
  async createProductsV2(@Body() body: any) {
    const list = Array.isArray(body) ? body : [body];
    return {
      success: true,
      code: 200,
      results: list.map((item, idx) => ({
        success: true,
        id: `PRD_${Date.now()}_${idx + 1}`,
        code: item.product_code || `HH${String(Date.now()).slice(-5)}`,
      })),
      data: list,
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[Product - Cập nhật] [PUT /api/v2/Products] Thực hiện cập nhật hàng hóa / dịch vụ theo danh sách',
    description: '[Thuộc danh mục: 4. Products > Cập nhật] Endpoint gốc: PUT https://crmconnect.misa.vn/api/v2/Products | Cập nhật thông tin đơn giá, mô tả sản phẩm CRM',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ type: [MisaCrmV2ProductDto] })
  @Put('api/v2/Products')
  async updateProductsV2(@Body() body: any) {
    const list = Array.isArray(body) ? body : [body];
    return {
      success: true,
      code: 200,
      results: list.map((item, idx) => ({
        success: true,
        id: item.id || `PRD_${idx + 1}`,
        code: item.product_code || 'HH00001',
      })),
      data: list,
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[Product - Xóa] [DELETE /api/v2/Products] Thực hiện xoá hàng hóa / dịch vụ theo danh sách ID',
    description: '[Thuộc danh mục: 4. Products > Xóa] Endpoint gốc: DELETE https://crmconnect.misa.vn/api/v2/Products | Xóa danh sách hàng hóa/dịch vụ khỏi CRM',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ schema: { type: 'array', items: { type: 'string' }, example: ['PRD_001', 'PRD_002'] } })
  @Delete('api/v2/Products')
  async deleteProductsV2(@Body() ids: string[]) {
    return {
      success: true,
      code: 200,
      results: (ids || []).map(id => ({ success: true, id })),
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[Product - Danh sách] [GET /api/v2/Products] Paging lấy về danh sách hàng hóa / dịch vụ có phân trang',
    description: '[Thuộc danh mục: 4. Products > Danh sách] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Products | Phân trang danh mục hàng hóa trên CRM',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiQuery({ name: 'orderBy', required: false, example: 'created_date' })
  @ApiQuery({ name: 'isDescending', required: false, example: true })
  @Get('api/v2/Products')
  async listProductsV2(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('orderBy') orderBy?: string,
    @Query('isDescending') isDescending?: boolean,
  ) {
    return {
      success: true,
      code: 200,
      total_records: 2,
      page: Number(page),
      page_size: Number(pageSize),
      data: [
        {
          id: 'PRD_202610_01',
          product_code: 'HH00001',
          product_name: 'Gói Bản quyền UniFlow Enterprise 12 Tháng',
          product_category_name: 'PHAN_MEM',
          unit: 'Gói',
          unit_price: 90000000,
          tax_rate: '10%',
        },
        {
          id: 'PRD_202610_02',
          product_code: 'HH00002',
          product_name: 'Dịch vụ Đào tạo & Triển khai On-Premise',
          product_category_name: 'DICH_VU',
          unit: 'Gói',
          unit_price: 30000000,
          tax_rate: '10%',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Product - Chi tiết theo ID] [GET /api/v2/Products/id] Lấy dữ liệu hàng hóa / dịch vụ theo ID',
    description: '[Thuộc danh mục: 4. Products > Chi tiết theo ID] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Products/id | Tra cứu chi tiết hàng hóa theo danh sách ID',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'ids', example: 'PRD_202610_01' })
  @Get('api/v2/Products/id')
  async getProductsByIdsV2(@Query('ids') ids: string) {
    return {
      success: true,
      code: 200,
      data: [
        {
          id: ids || 'PRD_202610_01',
          product_code: 'HH00001',
          product_name: 'Gói Bản quyền UniFlow Enterprise 12 Tháng',
          unit: 'Gói',
          unit_price: 90000000,
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Product - Chi tiết theo Mã] [GET /api/v2/Products/code] Lấy dữ liệu hàng hóa / dịch vụ theo mã',
    description: '[Thuộc danh mục: 4. Products > Chi tiết theo Mã] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Products/code | Tra cứu chi tiết hàng hóa theo mã product_code',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'code', example: 'HH00001' })
  @Get('api/v2/Products/code')
  async getProductByCodeV2(@Query('code') code: string) {
    return {
      success: true,
      code: 200,
      data: {
        id: 'PRD_202610_01',
        product_code: code || 'HH00001',
        product_name: 'Gói Bản quyền UniFlow Enterprise 12 Tháng',
        unit_price: 90000000,
      },
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 5. MISA AMIS CRM - SALE ORDERS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 05. SaleOrders (Đơn đặt hàng CRM)')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmSaleOrdersController {
  @ApiOperation({
    summary: '[SaleOrder - Thêm mới] [POST /api/v2/SaleOrders] Thực hiện thêm mới đơn hàng theo danh sách',
    description: '[Thuộc danh mục: 5. SaleOrders > Thêm mới] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/SaleOrders | Thêm mới đơn đặt hàng bán kèm bảng phân bổ hàng hóa',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ type: [MisaCrmV2SaleOrderDto] })
  @Post('api/v2/SaleOrders')
  async createSaleOrdersV2(@Body() body: any) {
    const list = Array.isArray(body) ? body : [body];
    return {
      success: true,
      code: 200,
      results: list.map((item, idx) => ({
        success: true,
        id: `ORD_${Date.now()}_${idx + 1}`,
        code: item.sale_order_no || `DH${String(Date.now()).slice(-6)}`,
      })),
      data: list,
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[SaleOrder - Cập nhật] [PUT /api/v2/SaleOrders] Thực hiện cập nhật đơn hàng theo danh sách',
    description: '[Thuộc danh mục: 5. SaleOrders > Cập nhật] Endpoint gốc: PUT https://crmconnect.misa.vn/api/v2/SaleOrders | Cập nhật đơn đặt hàng (ghi đè toàn bộ bảng hàng hóa)',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ type: [MisaCrmV2SaleOrderDto] })
  @Put('api/v2/SaleOrders')
  async updateSaleOrdersV2(@Body() body: any) {
    const list = Array.isArray(body) ? body : [body];
    return {
      success: true,
      code: 200,
      results: list.map((item, idx) => ({
        success: true,
        id: item.id || `ORD_${idx + 1}`,
        code: item.sale_order_no || 'DH000001',
      })),
      data: list,
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[SaleOrder - Xóa] [DELETE /api/v2/SaleOrders] Thực hiện xoá đơn hàng theo danh sách ID',
    description: '[Thuộc danh mục: 5. SaleOrders > Xóa] Endpoint gốc: DELETE https://crmconnect.misa.vn/api/v2/SaleOrders | Xóa danh sách đơn hàng CRM theo mảng ID',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ schema: { type: 'array', items: { type: 'string' }, example: ['ORD_001', 'ORD_002'] } })
  @Delete('api/v2/SaleOrders')
  async deleteSaleOrdersV2(@Body() ids: string[]) {
    return {
      success: true,
      code: 200,
      results: (ids || []).map(id => ({ success: true, id })),
      error_message: null,
    };
  }

  @ApiOperation({
    summary: '[SaleOrder - Danh sách] [GET /api/v2/SaleOrders] Paging lấy về danh sách đơn hàng có phân trang',
    description: '[Thuộc danh mục: 5. SaleOrders > Danh sách] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/SaleOrders | Phân trang danh sách đơn đặt hàng CRM',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiQuery({ name: 'orderBy', required: false, example: 'created_date' })
  @ApiQuery({ name: 'isDescending', required: false, example: true })
  @Get('api/v2/SaleOrders')
  async listSaleOrdersV2(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('orderBy') orderBy?: string,
    @Query('isDescending') isDescending?: boolean,
  ) {
    return {
      success: true,
      code: 200,
      total_records: 1,
      page: Number(page),
      page_size: Number(pageSize),
      data: [
        {
          id: 'ORD_202610_01',
          sale_order_no: 'DH000001',
          sale_order_date: '2026-10-04T00:00:00.0000000+07:00',
          sale_order_name: 'Bán giải pháp UniFlow cho Công ty AI Hub',
          account_name: 'Công ty Cổ phần Giải Pháp Trí Tuệ Nhân Tạo AI Hub',
          sale_order_amount: 100000000,
          status: 'Chưa thực hiện',
          pay_status: 'Chưa thanh toán',
          delivery_status: 'Chưa giao hàng',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[SaleOrder - Chi tiết theo ID] [GET /api/v2/SaleOrders/id] Lấy dữ liệu đơn hàng theo ID',
    description: '[Thuộc danh mục: 5. SaleOrders > Chi tiết theo ID] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/SaleOrders/id | Lấy chi tiết đơn hàng theo danh sách ID',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'ids', example: 'ORD_202610_01' })
  @Get('api/v2/SaleOrders/id')
  async getSaleOrdersByIdsV2(@Query('ids') ids: string) {
    return {
      success: true,
      code: 200,
      data: [
        {
          id: ids || 'ORD_202610_01',
          sale_order_no: 'DH000001',
          account_name: 'Công ty Cổ phần Giải Pháp Trí Tuệ Nhân Tạo AI Hub',
          sale_order_amount: 100000000,
          status: 'Chưa thực hiện',
          sale_order_product_mappings: [
            { product_code: 'HH00001', description: 'UniFlow Enterprise', amount: 1, price: '90000000', total: 99000000 },
          ],
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[SaleOrder - Chi tiết theo Mã] [GET /api/v2/SaleOrders/code] Lấy dữ liệu đơn hàng theo mã',
    description: '[Thuộc danh mục: 5. SaleOrders > Chi tiết theo Mã] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/SaleOrders/code | Lấy chi tiết đơn hàng theo số đơn hàng DH',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'code', example: 'DH000001' })
  @Get('api/v2/SaleOrders/code')
  async getSaleOrderByCodeV2(@Query('code') code: string) {
    return {
      success: true,
      code: 200,
      data: {
        id: 'ORD_202610_01',
        sale_order_no: code || 'DH000001',
        sale_order_amount: 100000000,
        status: 'Chưa thực hiện',
      },
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 6. MISA AMIS CRM - STOCKS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 06. Stocks (Kho & Tồn kho CRM)')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmStocksController {
  @ApiOperation({
    summary: '[Stock - Danh sách Kho] [GET /api/v2/Stocks] Lấy tất cả kho hàng trên CRM',
    description: '[Thuộc danh mục: 6. Stocks > Danh sách Kho] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Stocks | Lấy toàn bộ danh sách kho hàng cấu hình trên CRM',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @Get('api/v2/Stocks')
  async getAllStocksV2() {
    return {
      success: true,
      code: 200,
      dev_msg: null,
      user_msg: 'Lấy dữ liệu thành công',
      data: [
        {
          stock_code: 'KHO_TONG_HN',
          stock_name: 'Kho Tổng Hà Nội - Cầu Giấy',
          description: 'Kho phân phối trung tâm phía Bắc',
          inactive: false,
          async_id: 'ASYNC_STOCK_001',
          act_database_id: 'ACT_DB_01',
        },
        {
          stock_code: 'KHO_HCM',
          stock_name: 'Kho Chi Nhánh TP.HCM - Q.1',
          description: 'Kho phân phối miền Nam',
          inactive: false,
          async_id: 'ASYNC_STOCK_002',
          act_database_id: 'ACT_DB_01',
        },
      ],
      validate_result: null,
    };
  }

  @ApiOperation({
    summary: '[Stock - Thêm mới Kho] [POST /api/v2/Stocks] Thêm mới kho hàng vào CRM',
    description: '[Thuộc danh mục: 6. Stocks > Thêm mới Kho] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/Stocks | Khởi tạo kho hàng mới',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ type: MisaCrmStockDto })
  @Post('api/v2/Stocks')
  async createStockV2(@Body() dto: MisaCrmStockDto) {
    return {
      success: true,
      code: 200,
      dev_msg: null,
      user_msg: 'Thêm mới kho thành công',
      data: {
        ...dto,
        created_date: new Date().toISOString(),
      },
      validate_result: null,
    };
  }

  @ApiOperation({
    summary: '[Stock - Cập nhật Kho] [PUT /api/v2/Stocks] Cập nhật thông tin kho hàng',
    description: '[Thuộc danh mục: 6. Stocks > Cập nhật Kho] Endpoint gốc: PUT https://crmconnect.misa.vn/api/v2/Stocks | Cập nhật tên hoặc trạng thái kho',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ type: MisaCrmStockDto })
  @Put('api/v2/Stocks')
  async updateStockV2(@Body() dto: MisaCrmStockDto) {
    return {
      success: true,
      code: 200,
      dev_msg: null,
      user_msg: 'Cập nhật kho thành công',
      data: {
        ...dto,
        modified_date: new Date().toISOString(),
      },
      validate_result: null,
    };
  }

  @ApiOperation({
    summary: '[Stock - Xóa Kho] [DELETE /api/v2/Stocks] Xoá kho hàng trên CRM',
    description: '[Thuộc danh mục: 6. Stocks > Xóa Kho] Endpoint gốc: DELETE https://crmconnect.misa.vn/api/v2/Stocks | Xóa kho hàng theo mã kho',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ schema: { type: 'object', properties: { stock_code: { type: 'string', example: 'KHO_TONG_HN' } } } })
  @Delete('api/v2/Stocks')
  async deleteStockV2(@Body() body: { stock_code: string }) {
    return {
      success: true,
      code: 200,
      dev_msg: null,
      user_msg: `Xóa kho ${body.stock_code} thành công`,
      data: true,
      validate_result: null,
    };
  }

  @ApiOperation({
    summary: '[ProductLedger - Sổ Tồn kho] [GET /api/v2/Stocks/product_ledger] Paging lấy về danh sách tồn kho có phân trang',
    description: '[Thuộc danh mục: 6. Stocks > Sổ Tồn kho] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Stocks/product_ledger | Tra cứu chi tiết tồn kho hàng hóa',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  @ApiQuery({ name: 'stockID', required: false, example: 'KHO_TONG_HN' })
  @Get('api/v2/Stocks/product_ledger')
  async getProductLedgerV2(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('stockID') stockID?: string,
  ) {
    return {
      page_size: Number(pageSize),
      total_pages: 1,
      total_records: 2,
      next_page: null,
      previous_page: null,
      success: true,
      code: 200,
      dev_msg: null,
      user_msg: 'Lấy sổ tồn kho thành công',
      data: [
        {
          async_id: 'LEDGER_001',
          product_code: 'HH00001',
          product_category_name: 'PHAN_MEM',
          usage_unit_name: 'Gói',
          main_stock_quantity: 999,
          shipping_amount_summary: 0,
          amount_summary: 999,
          order_quantity: 15,
          delivery_quantity: 0,
        },
        {
          async_id: 'LEDGER_002',
          product_code: 'HH00002',
          product_category_name: 'DICH_VU',
          usage_unit_name: 'Gói',
          main_stock_quantity: 50,
          shipping_amount_summary: 0,
          amount_summary: 50,
          order_quantity: 5,
          delivery_quantity: 0,
        },
      ],
      validate_result: null,
    };
  }

  @ApiOperation({
    summary: '[ProductLedger - Cập nhật Tồn kho] [POST /api/v2/Stocks/product_ledger] Cập nhật tồn kho hàng hóa',
    description: '[Thuộc danh mục: 6. Stocks > Cập nhật Tồn kho] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/Stocks/product_ledger | Ghi đè hoặc bù trừ số lượng tồn kho',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiBody({ type: MisaCrmProductLedgerUpdateDto })
  @Post('api/v2/Stocks/product_ledger')
  async updateProductLedgerV2(@Body() dto: MisaCrmProductLedgerUpdateDto) {
    return {
      success: true,
      code: 200,
      dev_msg: null,
      user_msg: `Cập nhật tồn kho mã ${dto.product_code} tại kho ${dto.stock_code} thành công: ${dto.quantity}`,
      data: dto,
      validate_result: null,
    };
  }

  @ApiOperation({
    summary: '[Stock - Chi tiết theo AsyncID] [GET /api/v2/Stocks/asyncid] Lấy dữ liệu kho theo asyncID',
    description: '[Thuộc danh mục: 6. Stocks > Chi tiết theo AsyncID] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Stocks/asyncid | Tra cứu kho qua mã đồng bộ async_ids',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'async_ids', example: 'ASYNC_STOCK_001' })
  @Get('api/v2/Stocks/asyncid')
  async getStockByAsyncIdV2(@Query('async_ids') asyncIds: string) {
    return {
      success: true,
      code: 200,
      data: [
        {
          stock_code: 'KHO_TONG_HN',
          stock_name: 'Kho Tổng Hà Nội - Cầu Giấy',
          async_id: asyncIds || 'ASYNC_STOCK_001',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Stock - Chi tiết theo Mã Kho] [GET /api/v2/Stocks/code] Lấy dữ liệu kho theo mã Kho',
    description: '[Thuộc danh mục: 6. Stocks > Chi tiết theo Mã Kho] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/Stocks/code | Tra cứu kho qua mã stockCode',
  })
  @ApiHeader({ name: 'Clientid', required: false })
  @ApiQuery({ name: 'stockCode', example: 'KHO_TONG_HN' })
  @Get('api/v2/Stocks/code')
  async getStockByCodeV2(@Query('stockCode') stockCode: string) {
    return {
      success: true,
      code: 200,
      data: {
        stock_code: stockCode || 'KHO_TONG_HN',
        stock_name: 'Kho Tổng Hà Nội - Cầu Giấy',
        description: 'Kho phân phối trung tâm phía Bắc',
        inactive: false,
      },
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 7. MISA AMIS CRM - LEADS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 07. Leads (Đầu mối tiềm năng)')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmLeadsController {
  @ApiOperation({
    summary: '[Lead - Tiếp nhận đầu mối] [POST /leads] Tiếp nhận đầu mối tiềm năng từ Marketing vào CRM',
    description: '[Thuộc danh mục: 7. Leads > Tiếp nhận đầu mối] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/leads | Tự động hứng dữ liệu khách hàng tiềm năng từ Facebook Lead Form, Website, TikTok Ads vào CRM',
  })
  @ApiBody({ type: MisaCrmLeadDto })
  @Post('leads')
  async createLead(@Body() dto: MisaCrmLeadDto) {
    return {
      success: true,
      data: {
        leadId: `LEAD_${Date.now()}`,
        ...dto,
        createdAt: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Lead - Danh sách đầu mối] [GET /leads] Lọc danh sách đầu mối theo trạng thái & kênh tiếp thị',
    description: '[Thuộc danh mục: 7. Leads > Danh sách đầu mối] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/leads | Lọc danh sách đầu mối theo trạng thái chăm sóc và kênh marketing',
  })
  @ApiQuery({ name: 'status', example: 'NEW', required: false })
  @ApiQuery({ name: 'leadSource', example: 'FACEBOOK_ADS', required: false })
  @Get('leads')
  async listLeads(@Query('status') status?: string, @Query('leadSource') leadSource?: string) {
    return {
      total: 2,
      data: [
        {
          leadId: 'LEAD_202610_001',
          leadName: 'Trần Quốc Bảo',
          companyName: 'Chuỗi Nhà Hàng Lẩu Nướng Gogi Garden',
          phone: '0903445566',
          leadSource: leadSource || 'FACEBOOK_ADS',
          potentialAmount: 45000000,
          status: status || 'NEW',
        },
        {
          leadId: 'LEAD_202610_002',
          leadName: 'Vũ Thị Minh Hằng',
          companyName: 'Thời Trang Công Sở Bella Chic',
          phone: '0912998877',
          leadSource: 'WEBSITE',
          potentialAmount: 30000000,
          status: 'CONTACTED',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Lead - Chuyển đổi Khách hàng] [POST /leads/:id/convert] Chuyển đổi đầu mối tiềm năng thành Khách hàng & Cơ hội',
    description: '[Thuộc danh mục: 7. Leads > Chuyển đổi Khách hàng] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/leads/:id/convert | Chuyển đổi đầu mối đã xác thực nhu cầu (Qualified) sang Khách hàng chính thức trong pipeline',
  })
  @ApiParam({ name: 'id', example: 'LEAD_202610_001' })
  @Post('leads/:id/convert')
  async convertLead(@Param('id') id: string) {
    return {
      success: true,
      leadId: id,
      convertedCustomerId: `CRM_CUST_${Date.now().toString().slice(-6)}`,
      createdOpportunityId: `OPP_${Date.now()}`,
      status: 'QUALIFIED_CONVERTED',
      message: `Đầu mối #${id} đã được chuyển đổi thành Khách hàng và tạo Cơ hội bán hàng mới`,
      convertedAt: new Date().toISOString(),
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 8. MISA AMIS CRM - OPPORTUNITIES RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 08. Opportunities (Cơ hội bán hàng)')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmOpportunitiesController {
  @ApiOperation({
    summary: '[Opportunity - Tạo cơ hội] [POST /opportunities] Thêm cơ hội bán hàng vào pipeline CRM',
    description: '[Thuộc danh mục: 8. Opportunities > Tạo cơ hội] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/opportunities | Thêm cơ hội giao dịch vào pipeline bán hàng để theo dõi xác suất và tiến độ chốt số',
  })
  @ApiBody({ type: MisaCrmOpportunityDto })
  @Post('opportunities')
  async createOpportunity(@Body() dto: MisaCrmOpportunityDto) {
    return {
      success: true,
      data: {
        opportunityId: `OPP_${Date.now()}`,
        ...dto,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Opportunity - Danh sách cơ hội] [GET /opportunities] Tra cứu cơ hội theo các giai đoạn pipeline',
    description: '[Thuộc danh mục: 8. Opportunities > Danh sách cơ hội] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/opportunities | Tra cứu danh sách cơ hội theo giai đoạn phễu bán hàng',
  })
  @ApiQuery({ name: 'stage', example: 'PROPOSAL_PRICE_QUOTE', required: false })
  @Get('opportunities')
  async listOpportunities(@Query('stage') stage?: string) {
    return {
      total: 1,
      data: [
        {
          opportunityId: 'OPP_202610_01',
          opportunityName: 'Dự án Triển khai Hệ thống Bán lẻ & Hóa đơn Điện tử UniFlow 2026',
          customerId: 'CRM_CUST_202610_001',
          expectedRevenue: 120000000,
          stage: stage || 'PROPOSAL_PRICE_QUOTE',
          probability: 80,
          closeDate: '2026-11-30',
          assignedTo: 'Lê Văn Chuyên Viên CRM',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Opportunity - Cập nhật giai đoạn] [PUT /opportunities/:id/stage] Kéo thả / Chuyển bước cơ hội bán hàng',
    description: '[Thuộc danh mục: 8. Opportunities > Cập nhật giai đoạn] Endpoint gốc: PUT https://crmconnect.misa.vn/api/v2/opportunities/:id/stage | Kéo thả cơ hội sang bước tiếp theo trong quy trình bán hàng hoặc chốt thắng (Closed Won)',
  })
  @ApiParam({ name: 'id', example: 'OPP_202610_01' })
  @Put('opportunities/:id/stage')
  async updateOpportunityStage(
    @Param('id') id: string,
    @Body() body: { stage: string; probability?: number; note?: string },
  ) {
    return {
      success: true,
      opportunityId: id,
      newStage: body.stage,
      probability: body.probability || (body.stage === 'CLOSED_WON' ? 100 : 80),
      message: `Cơ hội #${id} đã chuyển sang giai đoạn [${body.stage}]`,
      updatedAt: new Date().toISOString(),
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 9. MISA AMIS CRM - QUOTATIONS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 09. Quotations (Báo giá bán hàng)')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmQuotationsController {
  @ApiOperation({
    summary: '[Quotation - Lập báo giá] [POST /quotations] Lập báo giá thương mại chi tiết cho khách hàng',
    description: '[Thuộc danh mục: 9. Quotations > Lập báo giá] Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/quotations | Lập bảng báo giá chi tiết gồm các sản phẩm, chiết khấu và điều khoản gửi cho khách hàng',
  })
  @ApiBody({ type: MisaCrmQuotationDto })
  @Post('quotations')
  async createQuotation(@Body() dto: MisaCrmQuotationDto) {
    return {
      success: true,
      data: {
        quotationId: `QTT_${Date.now()}`,
        ...dto,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Quotation - Danh sách báo giá] [GET /quotations] Tra cứu danh sách báo giá theo khách hàng',
    description: '[Thuộc danh mục: 9. Quotations > Danh sách báo giá] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/quotations | Tra cứu danh sách các bảng báo giá đã lập cho khách hàng',
  })
  @ApiQuery({ name: 'customerId', example: 'CRM_CUST_202610_001', required: false })
  @Get('quotations')
  async listQuotations(@Query('customerId') customerId?: string) {
    return {
      total: 1,
      data: [
        {
          quotationId: 'QTT_202610_01',
          quotationNo: 'BG-2026-10-088',
          customerId: customerId || 'CRM_CUST_202610_001',
          quotationDate: '2026-10-03',
          validUntil: '2026-11-03',
          totalAmount: 120000000,
          netAmount: 114000000,
          status: 'SENT_TO_CLIENT',
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Quotation - Chi tiết báo giá] [GET /quotations/:id] Xem chi tiết báo giá và các điều khoản thanh toán',
    description: '[Thuộc danh mục: 9. Quotations > Chi tiết báo giá] Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/quotations/:id | Xem chi tiết danh mục hàng hóa, đơn giá và điều khoản thanh toán',
  })
  @ApiParam({ name: 'id', example: 'QTT_202610_01' })
  @Get('quotations/:id')
  async getQuotationById(@Param('id') id: string) {
    return {
      success: true,
      data: {
        quotationId: id,
        quotationNo: 'BG-2026-10-088',
        customerId: 'CRM_CUST_202610_001',
        customerName: 'Công ty Cổ phần Giải Pháp Trí Tuệ Nhân Tạo AI Hub',
        totalAmount: 120000000,
        discountRate: 5,
        netAmount: 114000000,
        items: [
          { itemCode: 'PKG-UNIFLOW-ENTERPRISE', itemName: 'Gói Bản quyền UniFlow Enterprise 12 Tháng', quantity: 1, unitPrice: 90000000 },
          { itemCode: 'SVC-DEPLOYMENT', itemName: 'Dịch vụ Đào tạo & Triển khai On-Premise', quantity: 1, unitPrice: 30000000 },
        ],
        paymentTerms: 'Đợt 1: 50% ngay sau khi ký HĐ, Đợt 2: 50% sau khi bàn giao nghiệm thu',
        status: 'SENT_TO_CLIENT',
      },
    };
  }
}
