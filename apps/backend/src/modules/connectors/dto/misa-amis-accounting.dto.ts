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

