import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';

// ── 1. AMIS CRM - CUSTOMERS DTO ──
export class MisaCrmCustomerDto {
  @ApiProperty({ example: 'Công ty Cổ phần Giải Pháp Trí Tuệ Nhân Tạo AI Hub', description: 'Tên tổ chức hoặc họ tên khách hàng cá nhân' })
  @IsString()
  customerName: string;

  @ApiProperty({ example: 'ORGANIZATION', enum: ['ORGANIZATION', 'INDIVIDUAL'], description: 'Loại khách hàng (Tổ chức doanh nghiệp / Cá nhân)' })
  @IsString()
  customerType: string;

  @ApiProperty({ example: '0109988123', description: 'Mã số thuế doanh nghiệp (Chuẩn 10 hoặc 13 số)' })
  @IsString()
  taxCode: string;

  @ApiProperty({ example: '02439988776', description: 'Số điện thoại liên hệ chính' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'contact@aihub-solutions.vn', description: 'Email doanh nghiệp', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'Tầng 12, Tòa nhà FPT Tower, Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội', description: 'Địa chỉ trụ sở kinh doanh' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'INFORMATION_TECHNOLOGY', description: 'Ngành nghề lĩnh vực hoạt động' })
  @IsString()
  industry: string;

  @ApiProperty({ example: 'VIP_PLATINUM', enum: ['STANDARD', 'VIP_SILVER', 'VIP_GOLD', 'VIP_PLATINUM'], description: 'Hạng mức khách hàng CRM' })
  @IsString()
  tier: string;

  @ApiProperty({ example: 'Lê Văn Chuyên Viên CRM', description: 'Nhân viên phụ trách chăm sóc tài khoản' })
  @IsString()
  ownerName: string;
}

// ── 2. AMIS CRM - CONTACTS DTO ──
export class MisaCrmContactDto {
  @ApiProperty({ example: 'CRM_CUST_202610_001', description: 'ID khách hàng doanh nghiệp trực thuộc' })
  @IsString()
  customerId: string;

  @ApiProperty({ example: 'Phạm Hoàng Linh', description: 'Họ và tên người liên hệ' })
  @IsString()
  contactName: string;

  @ApiProperty({ example: 'Giám đốc Công nghệ (CTO)', description: 'Chức danh công việc' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Khối Công nghệ & Chuyển đổi số', description: 'Phòng ban làm việc' })
  @IsString()
  department: string;

  @ApiProperty({ example: '0987654321', description: 'Số điện thoại di động người liên hệ' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'linh.pham@aihub-solutions.vn', description: 'Email công vụ' })
  @IsString()
  email: string;

  @ApiProperty({ example: true, description: 'Có phải là người ra quyết định mua hàng chính (Decision Maker) không' })
  isDecisionMaker: boolean;
}

// ── 3. AMIS CRM - LEADS DTO ──
export class MisaCrmLeadDto {
  @ApiProperty({ example: 'Trần Quốc Bảo', description: 'Họ và tên người đại diện đầu mối' })
  @IsString()
  leadName: string;

  @ApiProperty({ example: 'Chuỗi Nhà Hàng Lẩu Nướng Gogi Garden', description: 'Tên đơn vị kinh doanh / Cửa hàng' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: '0903445566', description: 'Số điện thoại liên lạc' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'bao.tq@gogigarden.vn', description: 'Email liên lạc', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    example: 'FACEBOOK_ADS',
    enum: ['WEBSITE', 'FACEBOOK_ADS', 'TIKTOK', 'REFERRAL', 'EXHIBITION', 'COLD_CALL'],
    description: 'Nguồn thu thập đầu mối (Marketing Channel)',
  })
  @IsString()
  leadSource: string;

  @ApiProperty({ example: 45000000, description: 'Doanh thu tiềm năng ước tính (VND)' })
  @IsNumber()
  potentialAmount: number;

  @ApiProperty({ example: 'Hệ thống Quản lý Bán lẻ UniFlow POS tích hợp meInvoice', description: 'Sản phẩm khách hàng đang quan tâm' })
  @IsString()
  interestProduct: string;

  @ApiProperty({ example: 'NEW', enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED'], description: 'Trạng thái xử lý đầu mối' })
  @IsString()
  status: string;
}

// ── 4. AMIS CRM - OPPORTUNITIES DTO ──
export class MisaCrmOpportunityDto {
  @ApiProperty({ example: 'Dự án Triển khai Hệ thống Bán lẻ & Hóa đơn Điện tử UniFlow 2026', description: 'Tên cơ hội bán hàng' })
  @IsString()
  opportunityName: string;

  @ApiProperty({ example: 'CRM_CUST_202610_001', description: 'ID khách hàng liên kết' })
  @IsString()
  customerId: string;

  @ApiProperty({ example: 120000000, description: 'Doanh số kỳ vọng (VND)' })
  @IsNumber()
  expectedRevenue: number;

  @ApiProperty({
    example: 'PROPOSAL_PRICE_QUOTE',
    enum: ['PROSPECTING', 'NEEDS_ANALYSIS', 'PROPOSAL_PRICE_QUOTE', 'NEGOTIATION_REVIEW', 'CLOSED_WON', 'CLOSED_LOST'],
    description: 'Giai đoạn trong phễu bán hàng (Pipeline Stage)',
  })
  @IsString()
  stage: string;

  @ApiProperty({ example: 80, description: 'Xác suất chốt thành công (%)' })
  @IsNumber()
  probability: number;

  @ApiProperty({ example: '2026-11-30', description: 'Ngày dự kiến chốt hợp đồng (YYYY-MM-DD)' })
  @IsString()
  closeDate: string;

  @ApiProperty({ example: 'Lê Văn Chuyên Viên CRM', description: 'Nhân viên kinh doanh phụ trách cơ hội' })
  @IsString()
  assignedTo: string;
}

// ── 5. AMIS CRM - QUOTATIONS DTO ──
export class MisaCrmQuotationDto {
  @ApiProperty({ example: 'BG-2026-10-088', description: 'Số báo giá bán hàng' })
  @IsString()
  quotationNo: string;

  @ApiProperty({ example: 'CRM_CUST_202610_001', description: 'ID khách hàng nhận báo giá' })
  @IsString()
  customerId: string;

  @ApiProperty({ example: '2026-10-03', description: 'Ngày lập báo giá (YYYY-MM-DD)' })
  @IsString()
  quotationDate: string;

  @ApiProperty({ example: '2026-11-03', description: 'Hạn hiệu lực của báo giá (YYYY-MM-DD)' })
  @IsString()
  validUntil: string;

  @ApiProperty({ example: 120000000, description: 'Tổng tiền niêm yết (VND)' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ example: 5, description: 'Tỷ lệ chiết khấu thương mại (%)' })
  @IsNumber()
  discountRate: number;

  @ApiProperty({ example: 114000000, description: 'Tổng tiền sau chiết khấu chưa VAT (VND)' })
  @IsNumber()
  netAmount: number;

  @ApiProperty({ example: 'Đợt 1: 50% ngay sau khi ký HĐ, Đợt 2: 50% sau khi bàn giao nghiệm thu', description: 'Điều khoản thanh toán' })
  @IsString()
  paymentTerms: string;

  @ApiProperty({
    example: [
      { itemCode: 'PKG-UNIFLOW-ENTERPRISE', itemName: 'Gói Bản quyền UniFlow Enterprise 12 Tháng', quantity: 1, unitPrice: 90000000 },
      { itemCode: 'SVC-DEPLOYMENT', itemName: 'Dịch vụ Đào tạo & Triển khai On-Premise', quantity: 1, unitPrice: 30000000 },
    ],
    description: 'Danh mục chi tiết hàng hóa / dịch vụ báo giá',
  })
  @IsArray()
  items: any[];
}

// ════════════════════════════════════════════════════════════════
// MISA CRM OPEN API V2 OFFICIAL DTOS (https://crmconnect.misa.vn)
// ════════════════════════════════════════════════════════════════

// ── 6. AMIS CRM V2 - ACCOUNT (TOKEN) DTO ──
export class MisaCrmLoginRequestDto {
  @ApiProperty({ example: 'uniflow_app_client_id_2026', description: 'Client ID đăng ký trên MISA CRM Developer Portal' })
  @IsString()
  client_id: string;

  @ApiProperty({ example: 'sec_8f99e3a1d94b02c8', description: 'Client Secret tương ứng' })
  @IsString()
  client_secret: string;
}

// ── 7. AMIS CRM V2 - CUSTOMER (ACCOUNT) DTO ──
export class MisaCrmV2CustomerDto {
  @ApiProperty({ example: 'KH000001', description: 'Mã khách hàng trên CRM', required: false })
  @IsOptional()
  @IsString()
  account_code?: string;

  @ApiProperty({ example: 'Công ty Cổ phần Giải Pháp Trí Tuệ Nhân Tạo AI Hub', description: 'Tên khách hàng/doanh nghiệp' })
  @IsString()
  account_name: string;

  @ApiProperty({ example: '0109988123', description: 'Mã số thuế', required: false })
  @IsOptional()
  @IsString()
  tax_code?: string;

  @ApiProperty({ example: '02439988776', description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'contact@aihub-solutions.vn', description: 'Email liên hệ', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'Tầng 12, Tòa nhà FPT Tower, Số 10 Phạm Văn Bạch', description: 'Địa chỉ đường/phố', required: false })
  @IsOptional()
  @IsString()
  billing_street?: string;

  @ApiProperty({ example: 'Cầu Giấy', description: 'Quận/Huyện', required: false })
  @IsOptional()
  @IsString()
  billing_district?: string;

  @ApiProperty({ example: 'Hà Nội', description: 'Tỉnh/Thành phố', required: false })
  @IsOptional()
  @IsString()
  billing_province?: string;

  @ApiProperty({ example: 'Việt Nam', description: 'Quốc gia', required: false })
  @IsOptional()
  @IsString()
  billing_country?: string;

  @ApiProperty({ example: 'Lê Văn Chuyên Viên CRM (NV000001)', description: 'Tên nhân viên phụ trách', required: false })
  @IsOptional()
  @IsString()
  owner_name?: string;
}

// ── 8. AMIS CRM V2 - CONTACT DTO ──
export class MisaCrmV2ContactDto {
  @ApiProperty({ example: 'LH00001', description: 'Mã người liên hệ', required: false })
  @IsOptional()
  @IsString()
  contact_code?: string;

  @ApiProperty({ example: 'Phạm Hoàng Linh', description: 'Họ và tên người liên hệ' })
  @IsString()
  contact_name: string;

  @ApiProperty({ example: 'KH000001', description: 'Mã hoặc Tên khách hàng (Account) liên kết', required: false })
  @IsOptional()
  @IsString()
  account_name?: string;

  @ApiProperty({ example: 'Giám đốc Công nghệ (CTO)', description: 'Chức danh', required: false })
  @IsOptional()
  @IsString()
  job_title?: string;

  @ApiProperty({ example: '0987654321', description: 'Điện thoại di động', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'linh.pham@aihub-solutions.vn', description: 'Email công vụ', required: false })
  @IsOptional()
  @IsString()
  email?: string;
}

// ── 9. AMIS CRM V2 - PRODUCT DTO ──
export class MisaCrmV2ProductDto {
  @ApiProperty({ example: 'HH00001', description: 'Mã hàng hóa/dịch vụ' })
  @IsString()
  product_code: string;

  @ApiProperty({ example: 'Gói Bản quyền UniFlow Enterprise 12 Tháng', description: 'Tên hàng hóa/dịch vụ' })
  @IsString()
  product_name: string;

  @ApiProperty({ example: 'PHAN_MEM', description: 'Tên nhóm hàng hóa', required: false })
  @IsOptional()
  @IsString()
  product_category_name?: string;

  @ApiProperty({ example: 'Gói', description: 'Đơn vị tính chính', required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ example: 90000000, description: 'Đơn giá bán', required: false })
  @IsOptional()
  @IsNumber()
  unit_price?: number;

  @ApiProperty({ example: '10%', description: 'Thuế suất GTGT', required: false })
  @IsOptional()
  @IsString()
  tax_rate?: string;
}

// ── 10. AMIS CRM V2 - SALE ORDER DTO ──
export class MisaCrmV2SaleOrderDto {
  @ApiProperty({ example: 'DH000001', description: 'Số đơn đặt hàng' })
  @IsString()
  sale_order_no: string;

  @ApiProperty({ example: '2026-10-04T00:00:00.0000000+07:00', description: 'Ngày đặt hàng (ISO-8601)' })
  @IsString()
  sale_order_date: string;

  @ApiProperty({ example: 'Đơn hàng Triển khai UniFlow Enterprise cho Công ty AI Hub', description: 'Diễn giải / Tên đơn hàng', required: false })
  @IsOptional()
  @IsString()
  sale_order_name?: string;

  @ApiProperty({ example: 'KH000001', description: 'Khách hàng (Tên hoặc mã tài khoản)' })
  @IsString()
  account_name: string;

  @ApiProperty({ example: 'LH00001', description: 'Người liên hệ', required: false })
  @IsOptional()
  @IsString()
  contact_name?: string;

  @ApiProperty({ example: 100000000, description: 'Tổng giá trị đơn hàng (VND)' })
  @IsNumber()
  sale_order_amount: number;

  @ApiProperty({ example: 'Chưa thực hiện', description: 'Tình trạng đơn hàng', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'Chưa thanh toán', description: 'Tình trạng thanh toán', required: false })
  @IsOptional()
  @IsString()
  pay_status?: string;

  @ApiProperty({ example: 'Chưa giao hàng', description: 'Tình trạng giao hàng', required: false })
  @IsOptional()
  @IsString()
  delivery_status?: string;

  @ApiProperty({
    example: [
      {
        product_code: 'HH00001',
        description: 'Gói Bản quyền UniFlow Enterprise 12 Tháng',
        stock_name: 'Kho Phần Mềm',
        price: '90000000',
        amount: 1,
        unit: 'Gói',
        tax_percent: '10%',
        tax: 9000000,
        discount: 0,
        total: 99000000,
      },
    ],
    description: 'Danh mục chi tiết hàng hóa / dịch vụ đơn hàng (sale_order_product_mappings)',
  })
  @IsArray()
  sale_order_product_mappings: any[];
}

// ── 11. AMIS CRM V2 - STOCK (KHO) DTO ──
export class MisaCrmStockDto {
  @ApiProperty({ example: 'KHO_TONG_HN', description: 'Mã kho' })
  @IsString()
  stock_code: string;

  @ApiProperty({ example: 'Kho Tổng Hà Nội - Cầu Giấy', description: 'Tên kho hàng' })
  @IsString()
  stock_name: string;

  @ApiProperty({ example: 'Kho trung tâm phân phối miền Bắc', description: 'Mô tả chi tiết', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: false, description: 'Ngừng theo dõi', required: false })
  @IsOptional()
  inactive?: boolean;

  @ApiProperty({ example: 'ASYNC_STOCK_001', description: 'Mã đồng bộ trung gian (async_id)', required: false })
  @IsOptional()
  @IsString()
  async_id?: string;

  @ApiProperty({ example: 'ACT_DB_01', description: 'Database ID bên AMIS Kế toán', required: false })
  @IsOptional()
  @IsString()
  act_database_id?: string;
}

// ── 12. AMIS CRM V2 - PRODUCT LEDGER UPDATE DTO ──
export class MisaCrmProductLedgerUpdateDto {
  @ApiProperty({ example: 'HH00001', description: 'Mã hàng hóa' })
  @IsString()
  product_code: string;

  @ApiProperty({ example: 'KHO_TONG_HN', description: 'Mã kho hàng' })
  @IsString()
  stock_code: string;

  @ApiProperty({ example: 150, description: 'Số lượng tồn kho cập nhật' })
  @IsNumber()
  quantity: number;
}

