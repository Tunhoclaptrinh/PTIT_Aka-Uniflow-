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
