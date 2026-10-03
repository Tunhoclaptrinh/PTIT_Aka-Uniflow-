import { Controller, Post, Get, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  MisaCrmCustomerDto,
  MisaCrmContactDto,
  MisaCrmLeadDto,
  MisaCrmOpportunityDto,
  MisaCrmQuotationDto,
} from '../../dto/misa-amis-crm.dto';
import { MisaSyncCustomerDto } from '../../dto/finance-logistics.dto';

// ════════════════════════════════════════════════════════════════
// 1. MISA AMIS CRM - CUSTOMERS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 01. Customers')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmCustomersController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: 'Đồng bộ khách hàng vào MISA AMIS CRM',
    description: 'Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/customers | Cập nhật hoặc thêm mới hồ sơ khách hàng doanh nghiệp hoặc cá nhân lên MISA AMIS CRM',
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
    summary: 'Tra cứu khách hàng theo SĐT trên AMIS CRM',
    description: 'Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/customers/by-phone | Lấy thông tin khách hàng, doanh số tích lũy, nhóm khách hàng và nhân viên phụ trách chăm sóc',
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
    summary: 'Danh sách khách hàng AMIS CRM',
    description: 'Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/customers | Lấy danh sách khách hàng doanh nghiệp và cá nhân có phân trang và lọc theo hạng thẻ VIP',
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
    summary: 'Cập nhật phân hạng và thông tin khách hàng CRM',
    description: 'Endpoint gốc: PUT https://crmconnect.misa.vn/api/v2/customers/:id | Điều chỉnh thông tin phân hạng thẻ, doanh số lũy kế hoặc nhân viên phụ trách',
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
// 2. MISA AMIS CRM - CONTACTS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 02. Contacts')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmContactsController {
  @ApiOperation({
    summary: 'Tạo mới người liên hệ doanh nghiệp (Contact)',
    description: 'Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/contacts | Thêm người liên hệ, đại diện mua hàng hoặc chuyên viên kỹ thuật vào hồ sơ doanh nghiệp',
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
    summary: 'Danh sách người liên hệ',
    description: 'Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/contacts | Tra cứu danh sách người liên hệ theo khách hàng doanh nghiệp',
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
    summary: 'Chi tiết người liên hệ',
    description: 'Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/contacts/:id | Lấy thông tin chi tiết chức danh, phòng ban và kênh liên lạc của người liên hệ',
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
// 3. MISA AMIS CRM - LEADS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 03. Leads')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmLeadsController {
  @ApiOperation({
    summary: 'Tiếp nhận đầu mối tiềm năng (Lead)',
    description: 'Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/leads | Tự động hứng dữ liệu khách hàng tiềm năng từ Facebook Lead Form, Website, TikTok Ads vào CRM',
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
    summary: 'Danh sách đầu mối tiềm năng',
    description: 'Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/leads | Lọc danh sách đầu mối theo trạng thái chăm sóc và kênh marketing',
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
    summary: 'Chuyển đổi Lead thành Khách hàng & Cơ hội',
    description: 'Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/leads/:id/convert | Chuyển đổi đầu mối đã xác thực nhu cầu (Qualified) sang Khách hàng chính thức trong pipeline',
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
// 4. MISA AMIS CRM - OPPORTUNITIES RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 04. Opportunities')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmOpportunitiesController {
  @ApiOperation({
    summary: 'Tạo cơ hội bán hàng (Opportunity)',
    description: 'Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/opportunities | Thêm cơ hội giao dịch vào pipeline bán hàng để theo dõi xác suất và tiến độ chốt số',
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
    summary: 'Danh sách cơ hội bán hàng theo Pipeline',
    description: 'Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/opportunities | Tra cứu danh sách cơ hội theo giai đoạn phễu bán hàng',
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
    summary: 'Cập nhật giai đoạn phễu cơ hội (Pipeline Stage)',
    description: 'Endpoint gốc: PUT https://crmconnect.misa.vn/api/v2/opportunities/:id/stage | Kéo thả cơ hội sang bước tiếp theo trong quy trình bán hàng hoặc chốt thắng (Closed Won)',
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
// 5. MISA AMIS CRM - QUOTATIONS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-CRM] 05. Quotations')
@Controller('api/v1/infra/misa/crm')
export class MisaAmisCrmQuotationsController {
  @ApiOperation({
    summary: 'Lập báo giá bán lẻ / B2B cho khách hàng',
    description: 'Endpoint gốc: POST https://crmconnect.misa.vn/api/v2/quotations | Lập bảng báo giá chi tiết gồm các sản phẩm, chiết khấu và điều khoản gửi cho khách hàng',
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
    summary: 'Danh sách bảng báo giá',
    description: 'Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/quotations | Tra cứu danh sách các bảng báo giá đã lập cho khách hàng',
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
    summary: 'Chi tiết báo giá bán hàng',
    description: 'Endpoint gốc: GET https://crmconnect.misa.vn/api/v2/quotations/:id | Xem chi tiết danh mục hàng hóa, đơn giá và điều khoản thanh toán',
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
