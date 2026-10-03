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
