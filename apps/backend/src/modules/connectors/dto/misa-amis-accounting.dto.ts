import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// ── 1. AMIS KẾ TOÁN - BÚT TOÁN ĐỊNH KHOẢN (JOURNAL ENTRY LINE) ──
export class MisaJournalEntryLineDto {
  @ApiProperty({ example: '1111', description: 'Tài khoản Nợ (Debit Account - Chuẩn TT200: 1111, 1121, 131, 632, 1561...)' })
  @IsString()
  debit_account: string;

  @ApiProperty({ example: '5111', description: 'Tài khoản Có (Credit Account - Chuẩn TT200: 5111, 33311, 1111, 1561, 331...)' })
  @IsString()
  credit_account: string;

  @ApiProperty({ example: 5000000, description: 'Số tiền phát sinh của bút toán (VND)' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Ghi nhận doanh thu bán lẻ hàng hóa POS', description: 'Diễn giải chi tiết từng dòng bút toán' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'KH_ALPHA_01', description: 'Mã đối tượng công nợ (Khách hàng / NCC)', required: false })
  @IsOptional()
  @IsString()
  partner_code?: string;

  @ApiProperty({ example: 'CN_CAUGIAY', description: 'Mã trung tâm chi phí / Chi nhánh cửa hàng', required: false })
  @IsOptional()
  @IsString()
  cost_center_code?: string;
}

// ── 2. AMIS KẾ TOÁN - VOUCHERS DTO ──
export class MisaAmisAccountingVoucherDto {
  @ApiProperty({ example: 'PT20261003-001', description: 'Mã số phiếu chứng từ kế toán' })
  @IsString()
  voucher_code: string;

  @ApiProperty({ example: '2026-10-03', description: 'Ngày ghi nhận chứng từ (YYYY-MM-DD)' })
  @IsString()
  voucher_date: string;

  @ApiProperty({
    example: 'CASH_RECEIPT',
    enum: ['CASH_RECEIPT', 'CASH_PAYMENT', 'BANK_RECEIPT', 'BANK_PAYMENT', 'SALES_VOUCHER', 'PURCHASE_VOUCHER', 'JOURNAL_ENTRY'],
    description: 'Loại chứng từ kế toán',
  })
  @IsString()
  voucher_type: string;

  @ApiProperty({ example: 5400000, description: 'Tổng tiền chứng từ ghi sổ (VND)' })
  @IsNumber()
  total_amount: number;

  @ApiProperty({ example: 'Thu tiền bán hàng bán lẻ POS ca sáng ngày 03/10/2026', description: 'Diễn giải tổng quát chứng từ' })
  @IsString()
  description: string;

  @ApiProperty({
    type: [MisaJournalEntryLineDto],
    description: 'Chi tiết các cặp định khoản Nợ / Có theo Thông tư 200/2014/TT-BTC',
    example: [
      {
        debit_account: '1111',
        credit_account: '5111',
        amount: 5000000,
        description: 'Thu tiền mặt - Doanh thu bán hàng hóa',
        cost_center_code: 'CN_CAUGIAY',
      },
      {
        debit_account: '1111',
        credit_account: '33311',
        amount: 400000,
        description: 'Thu tiền mặt - Thuế GTGT đầu ra phải nộp (8%)',
        cost_center_code: 'CN_CAUGIAY',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MisaJournalEntryLineDto)
  entry_details: MisaJournalEntryLineDto[];
}

// ── 3. AMIS KẾ TOÁN - SYNC ORDER DTO ──
export class MisaAmisAccountingSyncOrderDto {
  @ApiProperty({ example: 'HD-ESHOP-20261003-088', description: 'Mã đơn hàng POS / Sàn TMĐT cần tự động ghi sổ' })
  @IsString()
  order_code: string;

  @ApiProperty({
    example: 'MISA_ESHOP',
    enum: ['MISA_ESHOP', 'SAPO', 'NHANH_VN', 'KIOTVIET', 'SHOPEE', 'TIKTOK_SHOP', 'LAZADA'],
    description: 'Nguồn phát sinh đơn hàng',
  })
  @IsString()
  platform: string;

  @ApiProperty({ example: 5400000, description: 'Tổng giá trị thanh toán của đơn hàng (VND)' })
  @IsNumber()
  total_amount: number;

  @ApiProperty({ example: 5000000, description: 'Doanh thu thuần trước thuế GTGT (VND)' })
  @IsNumber()
  revenue_amount: number;

  @ApiProperty({ example: 400000, description: 'Tiền thuế GTGT đầu ra (VND)' })
  @IsNumber()
  vat_amount: number;

  @ApiProperty({ example: 'VIETQR', enum: ['CASH', 'VIETQR', 'BANK_TRANSFER', 'COD'], description: 'Phương thức thanh toán' })
  @IsString()
  payment_method: string;

  @ApiProperty({ example: '2026-10-03T10:30:00Z', description: 'Thời điểm phát sinh đơn hàng' })
  @IsString()
  order_date: string;
}

// ── 4. AMIS KẾ TOÁN - PRODUCT / ASSET DTO ──
export class MisaAmisAccountingProductDto {
  @ApiProperty({ example: 'SP_AP_POLO_01', description: 'Mã hàng hóa kế toán' })
  @IsString()
  product_code: string;

  @ApiProperty({ example: 'Áo Polo Nam Cotton Compact Size L', description: 'Tên hàng hóa ghi sổ' })
  @IsString()
  product_name: string;

  @ApiProperty({ example: '1561', description: 'Tài khoản kho hàng hóa (Chuẩn TT200: 1561 - Giá mua hàng hóa)' })
  @IsString()
  account_code: string;

  @ApiProperty({ example: '632', description: 'Tài khoản giá vốn hàng bán (Chuẩn TT200: 632)' })
  @IsString()
  cost_account_code: string;

  @ApiProperty({ example: '5111', description: 'Tài khoản doanh thu bán hàng hóa (Chuẩn TT200: 5111)' })
  @IsString()
  revenue_account_code: string;

  @ApiProperty({ example: 90000, description: 'Giá vốn định mức đơn vị (VND)' })
  @IsNumber()
  cost_price: number;

  @ApiProperty({ example: 180000, description: 'Giá bán niêm yết chưa VAT (VND)' })
  @IsNumber()
  sale_price: number;
}

// ── 5. MISA ACT OPEN API (CHÍNH THỨC TỪ ACTDOCS.MISA.VN) ──
export class MisaActOpenConnectDto {
  @ApiProperty({ example: '0e0a14cf-9e4b-4af9-875b-c490f34a581b', description: 'Mã ứng dụng (app_id) được cấp bởi MISA' })
  @IsString()
  app_id: string;

  @ApiProperty({ example: 'CON_ACT_202610_KEY99', description: 'Mã kết nối do đơn vị sử dụng AMIS Kế toán thiết lập' })
  @IsString()
  access_code: string;

  @ApiProperty({ example: 'https://gateway.uniflow.vn/api/v1/infra/misa-amis-accounting/api/oauth/actopensupport/call_back_data', description: 'URL callback nhận kết quả bất đồng bộ', required: false })
  @IsOptional()
  @IsString()
  callback_url?: string;
}

export class MisaActOpenSaveVoucherDto {
  @ApiProperty({
    example: 'sa_invoice',
    enum: [
      'sa_invoice', 'sa_voucher', 'sa_order', 'sa_return', 'sa_discount',
      'pu_voucher', 'pu_invoice', 'pu_order', 'pu_return', 'pu_service', 'pu_discount',
      'ca_receipt', 'ca_payment', 'ba_deposit', 'ba_withdraw', 'ba_internal_transfer',
      'gl_voucher', 'in_inward', 'in_outward', 'in_transfer', 'in_audit', 'in_production_order',
    ],
    description: 'Loại chứng từ kế toán trong 46 loại hỗ trợ của AMIS Kế toán',
  })
  @IsString()
  voucher_type: string;

  @ApiProperty({ example: 'REF_202610_INV_001', description: 'Mã tham chiếu duy nhất của chứng từ từ phần mềm ngoài' })
  @IsString()
  ref_id: string;

  @ApiProperty({
    example: {
      refdate: '2026-10-03',
      posted_date: '2026-10-03',
      refno: 'HDBL-001',
      account_object_code: 'KH001',
      total_amount: 5400000,
      journal_memo: 'Bán hàng thu tiền ngay cho khách VIP',
    },
    description: 'Thông tin chung (Master data) của chứng từ kế toán',
  })
  master_data: any;

  @ApiProperty({
    example: [
      {
        inventory_item_code: 'SP01',
        description: 'Tai nghe Bluetooth Mini',
        debit_account: '1111',
        credit_account: '5111',
        quantity: 2,
        unit_price: 150000,
        amount: 300000,
      },
    ],
    description: 'Chi tiết các dòng nghiệp vụ, định khoản Nợ/Có (Detail data)',
  })
  detail_data: any[];
}

export class MisaActOpenDeleteVoucherDto {
  @ApiProperty({ example: 'sa_invoice', description: 'Loại chứng từ cần xóa' })
  @IsString()
  voucher_type: string;

  @ApiProperty({ example: 'REF_202610_INV_001', description: 'Mã tham chiếu của chứng từ đã cất' })
  @IsString()
  ref_id: string;
}

export class MisaActOpenGetDictionaryDto {
  @ApiProperty({
    example: 'account_object',
    enum: [
      'account_object', 'account_object_group', 'bank', 'bank_account',
      'budget_item', 'expense_item', 'inventory_item', 'inventory_item_category',
      'stock', 'unit', 'payment_term', 'job',
    ],
    description: 'Tên danh mục cần lấy từ AMIS Kế toán',
  })
  @IsString()
  dictionary_type: string;

  @ApiProperty({ example: 20, required: false, description: 'Số lượng bản ghi lấy về' })
  @IsOptional()
  @IsNumber()
  page_size?: number;

  @ApiProperty({ example: 1, required: false, description: 'Trang cần lấy' })
  @IsOptional()
  @IsNumber()
  page_index?: number;
}

export class MisaActOpenSaveDictionaryDto {
  @ApiProperty({ example: 'inventory_item', description: 'Loại danh mục cần sinh mới' })
  @IsString()
  dictionary_type: string;

  @ApiProperty({
    example: [
      {
        inventory_item_code: 'SP_NEW_01',
        inventory_item_name: 'Chuột không dây Silent',
        inventory_item_type: 0,
        unit_code: 'CHIEC',
      },
    ],
    description: 'Dữ liệu các bản ghi danh mục',
  })
  data: any[];
}

export class MisaActOpenGetDebtDto {
  @ApiProperty({ example: 'KH001', description: 'Mã đối tượng công nợ (Khách hàng hoặc Nhà cung cấp)' })
  @IsString()
  account_object_code: string;

  @ApiProperty({ example: 0, enum: [0, 1], description: '0: Công nợ phải thu (131), 1: Công nợ phải trả (331)' })
  @IsNumber()
  debt_type: number;

  @ApiProperty({ example: '2026-10-03', description: 'Tính công nợ đến ngày (YYYY-MM-DD)' })
  @IsString()
  to_date: string;
}

export class MisaActOpenGetInventoryBalanceDto {
  @ApiProperty({ example: 'KHO_TONG', description: 'Mã kho kiểm tra tồn' })
  @IsString()
  stock_code: string;

  @ApiProperty({ example: '2026-10-03', description: 'Tính tồn kho đến ngày (YYYY-MM-DD)' })
  @IsString()
  to_date: string;

  @ApiProperty({ example: ['SP01', 'SP02'], description: 'Danh sách mã vật tư hàng hóa (để trống nếu lấy tất cả)', required: false })
  @IsOptional()
  inventory_item_codes?: string[];
}

export class MisaActOpenSetOptionDto {
  @ApiProperty({ example: 'CONNECT_OPTION_AUTO_POST', description: 'Mã tùy chọn kết nối dữ liệu' })
  @IsString()
  option_id: string;

  @ApiProperty({ example: '1', description: 'Giá trị thiết lập (1: Bật, 0: Tắt)' })
  @IsString()
  option_value: string;
}

export class MisaActOpenCallbackDemoDto {
  @ApiProperty({ example: 'TRANSACTION_SUCCESS', description: 'Trạng thái xử lý bất đồng bộ từ AMIS Kế toán' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'REF_202610_INV_001', description: 'Mã tham chiếu chứng từ' })
  @IsString()
  ref_id: string;

  @ApiProperty({ example: 'Đã sinh chứng từ kế toán số HDBL001 thành công', description: 'Thông điệp xử lý' })
  @IsString()
  message: string;
}

// ── 6. MISA ACT OPEN - BASE FILTER DTO (LOẠI BỎ ANY TRONG API QUERY/BODY) ──
export class MisaActOpenBaseFilterDto {
  @ApiProperty({ example: 0, required: false, description: 'Vị trí bắt đầu lấy bản ghi (skip / offset)' })
  @IsOptional()
  @IsNumber()
  skip?: number;

  @ApiProperty({ example: 50, required: false, description: 'Số lượng bản ghi cần lấy (take / limit, tối đa 200)' })
  @IsOptional()
  @IsNumber()
  take?: number;

  @ApiProperty({ example: '2026-10-01', required: false, description: 'Lọc từ ngày (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  from_date?: string;

  @ApiProperty({ example: '2026-10-03', required: false, description: 'Lọc đến ngày (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  to_date?: string;

  @ApiProperty({ example: 'CN_HN', required: false, description: 'Mã chi nhánh đơn vị hạch toán' })
  @IsOptional()
  @IsString()
  branch_id?: string;

  @ApiProperty({ example: '', required: false, description: 'Từ khóa tìm kiếm theo mã hoặc tên' })
  @IsOptional()
  @IsString()
  keyword?: string;
}

// ── 7. CHỨNG TỪ BÁN HÀNG KIÊM PHIẾU XUẤT KHO (SA_INVOICE) ──
export class MisaSaInvoiceMasterDto {
  @ApiProperty({ example: '2026-10-03', description: 'Ngày hạch toán (YYYY-MM-DD)' })
  @IsString()
  refdate: string;

  @ApiProperty({ example: '2026-10-03', description: 'Ngày chứng từ (YYYY-MM-DD)' })
  @IsString()
  posted_date: string;

  @ApiProperty({ example: 'HDBL-202610-001', description: 'Số chứng từ bán hàng' })
  @IsString()
  refno: string;

  @ApiProperty({ example: '00000088', description: 'Số hóa đơn giá trị gia tăng (nếu có)' })
  @IsString()
  inv_no: string;

  @ApiProperty({ example: '1C26TAA', description: 'Ký hiệu mẫu số hóa đơn (VD: 1C26TAA)' })
  @IsString()
  inv_series: string;

  @ApiProperty({ example: 'KH001', description: 'Mã đối tượng khách hàng (account_object_code)' })
  @IsString()
  account_object_code: string;

  @ApiProperty({ example: 'Công ty Cổ phần Công Nghệ Tân Á', description: 'Tên đối tượng khách hàng' })
  @IsString()
  account_object_name: string;

  @ApiProperty({ example: 'Tầng 8, Tòa Discovery Complex, Cầu Giấy, Hà Nội', description: 'Địa chỉ khách hàng' })
  @IsString()
  account_object_address: string;

  @ApiProperty({ example: '0108999888', description: 'Mã số thuế khách hàng (10 hoặc 13 số)' })
  @IsString()
  account_object_tax_code: string;

  @ApiProperty({ example: 'Nguyễn Văn Minh', description: 'Người liên hệ đại diện khách hàng', required: false })
  @IsOptional()
  @IsString()
  contact_name?: string;

  @ApiProperty({ example: 'Bán hàng UniFlow Enterprise cho Công ty Tân Á', description: 'Diễn giải hạch toán chứng từ' })
  @IsString()
  journal_memo: string;

  @ApiProperty({ example: 'NV_SALE_01', description: 'Mã nhân viên bán hàng phụ trách', required: false })
  @IsOptional()
  @IsString()
  employee_code?: string;

  @ApiProperty({ example: 10800000, description: 'Tổng tiền thanh toán trên hóa đơn (VND)' })
  @IsNumber()
  total_amount: number;

  @ApiProperty({ example: 800000, description: 'Tổng tiền thuế GTGT đầu ra (VND)' })
  @IsNumber()
  total_vat_amount: number;

  @ApiProperty({ example: 'CHUYEN_KHOAN', enum: ['TIEN_MAT', 'CHUYEN_KHOAN', 'CHUA_THANH_TOAN'], description: 'Hình thức thanh toán' })
  @IsString()
  payment_method: string;

  @ApiProperty({ example: true, description: 'Kiêm phiếu xuất kho bán hàng (Tự động trừ tồn kho)' })
  is_export: boolean;
}

export class MisaSaInvoiceDetailDto {
  @ApiProperty({ example: 'SP_AP_POLO_01', description: 'Mã vật tư hàng hóa (inventory_item_code)' })
  @IsString()
  inventory_item_code: string;

  @ApiProperty({ example: 'Áo Polo Nam Cotton Compact Size L', description: 'Tên hàng hóa' })
  @IsString()
  inventory_item_name: string;

  @ApiProperty({ example: 'KHO_TONG', description: 'Mã kho xuất hàng (stock_code)' })
  @IsString()
  stock_code: string;

  @ApiProperty({ example: '1121', description: 'Tài khoản Nợ (Chuẩn TT200: 1111 Tiền mặt, 1121 Tiền gửi, 131 Phải thu KH)' })
  @IsString()
  debit_account: string;

  @ApiProperty({ example: '5111', description: 'Tài khoản Có (Chuẩn TT200: 5111 Doanh thu bán hàng hóa)' })
  @IsString()
  credit_account: string;

  @ApiProperty({ example: 'CHIEC', description: 'Đơn vị tính' })
  @IsString()
  unit_code: string;

  @ApiProperty({ example: 10, description: 'Số lượng xuất bán' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 1000000, description: 'Đơn giá bán chưa VAT (VND)' })
  @IsNumber()
  unit_price: number;

  @ApiProperty({ example: 10000000, description: 'Thành tiền bán chưa VAT (VND)' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 8, description: 'Thuế suất GTGT (0, 5, 8, 10, -1 là KCT)' })
  @IsNumber()
  vat_rate: number;

  @ApiProperty({ example: 800000, description: 'Tiền thuế GTGT dòng hàng (VND)' })
  @IsNumber()
  vat_amount: number;

  @ApiProperty({ example: '33311', description: 'Tài khoản thuế GTGT đầu ra (Chuẩn TT200: 33311)' })
  @IsString()
  vat_account: string;

  @ApiProperty({ example: '632', description: 'Tài khoản giá vốn (Chuẩn TT200: 632 Giá vốn hàng bán)' })
  @IsString()
  cost_account: string;

  @ApiProperty({ example: '1561', description: 'Tài khoản kho xuất (Chuẩn TT200: 1561 Hàng hóa)' })
  @IsString()
  stock_account: string;

  @ApiProperty({ example: 600000, description: 'Đơn giá vốn xuất kho (VND)' })
  @IsNumber()
  cost_price: number;

  @ApiProperty({ example: 6000000, description: 'Tiền giá vốn xuất kho (VND)' })
  @IsNumber()
  cost_amount: number;
}

export class MisaSaInvoiceVoucherDto {
  @ApiProperty({ example: 'sa_invoice', description: 'Loại chứng từ: sa_invoice (Hóa đơn bán hàng)' })
  @IsString()
  voucher_type: string;

  @ApiProperty({ example: 'REF_202610_SA_001', description: 'Mã tham chiếu duy nhất từ hệ thống ngoài' })
  @IsString()
  ref_id: string;

  @ApiProperty({ type: MisaSaInvoiceMasterDto, description: 'Thông tin chung chứng từ bán hàng' })
  @ValidateNested()
  @Type(() => MisaSaInvoiceMasterDto)
  master_data: MisaSaInvoiceMasterDto;

  @ApiProperty({ type: [MisaSaInvoiceDetailDto], description: 'Chi tiết các dòng hàng hóa xuất bán và định khoản kép TT200' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MisaSaInvoiceDetailDto)
  detail_data: MisaSaInvoiceDetailDto[];
}

// ── 8. PHIẾU THU TIỀN MẶT (CA_RECEIPT) ──
export class MisaCaReceiptMasterDto {
  @ApiProperty({ example: '2026-10-03', description: 'Ngày hạch toán (YYYY-MM-DD)' })
  @IsString()
  refdate: string;

  @ApiProperty({ example: '2026-10-03', description: 'Ngày chứng từ (YYYY-MM-DD)' })
  @IsString()
  posted_date: string;

  @ApiProperty({ example: 'PT-202610-001', description: 'Số phiếu thu tiền mặt' })
  @IsString()
  refno: string;

  @ApiProperty({ example: 'KH001', description: 'Mã đối tượng nộp tiền' })
  @IsString()
  account_object_code: string;

  @ApiProperty({ example: 'Công ty Cổ phần Công Nghệ Tân Á', description: 'Tên đối tượng nộp tiền' })
  @IsString()
  account_object_name: string;

  @ApiProperty({ example: 'Lê Văn Nam', description: 'Họ tên người nộp tiền thực tế' })
  @IsString()
  payer: string;

  @ApiProperty({ example: 'Thu hồi công nợ tiền hàng đợt 1', description: 'Lý do thu tiền' })
  @IsString()
  journal_memo: string;

  @ApiProperty({ example: 15400000, description: 'Tổng số tiền thu (VND)' })
  @IsNumber()
  total_amount: number;
}

export class MisaCaReceiptDetailDto {
  @ApiProperty({ example: 'Thu tiền công nợ khách hàng Tân Á', description: 'Diễn giải dòng bút toán' })
  @IsString()
  description: string;

  @ApiProperty({ example: '1111', description: 'Tài khoản Nợ (Chuẩn TT200: 1111 Tiền Việt Nam)' })
  @IsString()
  debit_account: string;

  @ApiProperty({ example: '131', description: 'Tài khoản Có (Chuẩn TT200: 131 Phải thu khách hàng)' })
  @IsString()
  credit_account: string;

  @ApiProperty({ example: 15400000, description: 'Số tiền phát sinh (VND)' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'KH001', description: 'Mã đối tượng theo dõi công nợ chi tiết' })
  @IsString()
  account_object_code: string;
}

export class MisaCaReceiptVoucherDto {
  @ApiProperty({ example: 'ca_receipt', description: 'Loại chứng từ: ca_receipt (Phiếu thu tiền mặt)' })
  @IsString()
  voucher_type: string;

  @ApiProperty({ example: 'REF_202610_PT_001', description: 'Mã tham chiếu duy nhất' })
  @IsString()
  ref_id: string;

  @ApiProperty({ type: MisaCaReceiptMasterDto })
  @ValidateNested()
  @Type(() => MisaCaReceiptMasterDto)
  master_data: MisaCaReceiptMasterDto;

  @ApiProperty({ type: [MisaCaReceiptDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MisaCaReceiptDetailDto)
  detail_data: MisaCaReceiptDetailDto[];
}

// ── 9. PHIẾU CHI TIỀN MẶT (CA_PAYMENT) ──
export class MisaCaPaymentMasterDto {
  @ApiProperty({ example: '2026-10-03', description: 'Ngày hạch toán (YYYY-MM-DD)' })
  @IsString()
  refdate: string;

  @ApiProperty({ example: '2026-10-03', description: 'Ngày chứng từ (YYYY-MM-DD)' })
  @IsString()
  posted_date: string;

  @ApiProperty({ example: 'PC-202610-001', description: 'Số phiếu chi tiền mặt' })
  @IsString()
  refno: string;

  @ApiProperty({ example: 'NCC002', description: 'Mã nhà cung cấp / đối tượng nhận tiền' })
  @IsString()
  account_object_code: string;

  @ApiProperty({ example: 'Công ty TNHH Bao Bì Đông Á', description: 'Tên đối tượng nhận tiền' })
  @IsString()
  account_object_name: string;

  @ApiProperty({ example: 'Nguyễn Thị Hoa', description: 'Họ tên người nhận tiền thực tế' })
  @IsString()
  receiver: string;

  @ApiProperty({ example: 'Chi trả tiền mua bao bì đóng gói hàng hóa', description: 'Lý do chi tiền' })
  @IsString()
  journal_memo: string;

  @ApiProperty({ example: 4500000, description: 'Tổng số tiền chi (VND)' })
  @IsNumber()
  total_amount: number;
}

export class MisaCaPaymentDetailDto {
  @ApiProperty({ example: 'Thanh toán tiền bao bì carton', description: 'Diễn giải dòng bút toán' })
  @IsString()
  description: string;

  @ApiProperty({ example: '331', description: 'Tài khoản Nợ (Chuẩn TT200: 331 Phải trả người bán, hoặc 642, 1561...)' })
  @IsString()
  debit_account: string;

  @ApiProperty({ example: '1111', description: 'Tài khoản Có (Chuẩn TT200: 1111 Tiền mặt)' })
  @IsString()
  credit_account: string;

  @ApiProperty({ example: 4500000, description: 'Số tiền chi (VND)' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'NCC002', description: 'Mã đối tượng theo dõi công nợ chi tiết' })
  @IsString()
  account_object_code: string;
}

export class MisaCaPaymentVoucherDto {
  @ApiProperty({ example: 'ca_payment', description: 'Loại chứng từ: ca_payment (Phiếu chi tiền mặt)' })
  @IsString()
  voucher_type: string;

  @ApiProperty({ example: 'REF_202610_PC_001', description: 'Mã tham chiếu duy nhất' })
  @IsString()
  ref_id: string;

  @ApiProperty({ type: MisaCaPaymentMasterDto })
  @ValidateNested()
  @Type(() => MisaCaPaymentMasterDto)
  master_data: MisaCaPaymentMasterDto;

  @ApiProperty({ type: [MisaCaPaymentDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MisaCaPaymentDetailDto)
  detail_data: MisaCaPaymentDetailDto[];
}

// ── 10. PHIẾU NHẬP KHO (IN_INWARD) ──
export class MisaInInwardMasterDto {
  @ApiProperty({ example: '2026-10-03', description: 'Ngày hạch toán (YYYY-MM-DD)' })
  @IsString()
  refdate: string;

  @ApiProperty({ example: '2026-10-03', description: 'Ngày chứng từ (YYYY-MM-DD)' })
  @IsString()
  posted_date: string;

  @ApiProperty({ example: 'PNK-202610-001', description: 'Số phiếu nhập kho' })
  @IsString()
  refno: string;

  @ApiProperty({ example: 'KHO_TONG', description: 'Mã kho nhập' })
  @IsString()
  stock_code: string;

  @ApiProperty({ example: 'NCC002', description: 'Mã nhà cung cấp / đối tượng giao hàng' })
  @IsString()
  account_object_code: string;

  @ApiProperty({ example: 'Nhập kho mua hàng từ NCC Đông Á', description: 'Diễn giải phiếu nhập' })
  @IsString()
  journal_memo: string;

  @ApiProperty({ example: 25000000, description: 'Tổng giá trị hàng nhập kho (VND)' })
  @IsNumber()
  total_amount: number;
}

export class MisaInInwardDetailDto {
  @ApiProperty({ example: 'SP_AP_POLO_01', description: 'Mã vật tư hàng hóa nhập kho' })
  @IsString()
  inventory_item_code: string;

  @ApiProperty({ example: 'Áo Polo Nam Cotton Compact Size L', description: 'Tên hàng hóa' })
  @IsString()
  inventory_item_name: string;

  @ApiProperty({ example: 'KHO_TONG', description: 'Mã kho nhập' })
  @IsString()
  stock_code: string;

  @ApiProperty({ example: 'CHIEC', description: 'Đơn vị tính' })
  @IsString()
  unit_code: string;

  @ApiProperty({ example: 250, description: 'Số lượng nhập kho' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 100000, description: 'Đơn giá mua nhập kho (VND)' })
  @IsNumber()
  unit_price: number;

  @ApiProperty({ example: 25000000, description: 'Thành tiền nhập kho (VND)' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '1561', description: 'Tài khoản Nợ (Chuẩn TT200: 1561 Hàng hóa, 152 Nguyên vật liệu)' })
  @IsString()
  debit_account: string;

  @ApiProperty({ example: '331', description: 'Tài khoản Có (Chuẩn TT200: 331 Phải trả NCC, hoặc 1111, 1121...)' })
  @IsString()
  credit_account: string;
}

export class MisaInInwardVoucherDto {
  @ApiProperty({ example: 'in_inward', description: 'Loại chứng từ: in_inward (Phiếu nhập kho)' })
  @IsString()
  voucher_type: string;

  @ApiProperty({ example: 'REF_202610_PNK_001', description: 'Mã tham chiếu duy nhất' })
  @IsString()
  ref_id: string;

  @ApiProperty({ type: MisaInInwardMasterDto })
  @ValidateNested()
  @Type(() => MisaInInwardMasterDto)
  master_data: MisaInInwardMasterDto;

  @ApiProperty({ type: [MisaInInwardDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MisaInInwardDetailDto)
  detail_data: MisaInInwardDetailDto[];
}


