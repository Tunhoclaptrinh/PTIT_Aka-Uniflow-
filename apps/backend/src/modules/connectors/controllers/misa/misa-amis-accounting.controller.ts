import { Controller, Post, Get, Body, Param, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import {
  MisaAmisAccountingVoucherDto,
  MisaAmisAccountingSyncOrderDto,
  MisaAmisAccountingProductDto,
} from '../../dto/misa-amis-accounting.dto';

// ════════════════════════════════════════════════════════════════
// 1. MISA AMIS KẾ TOÁN - VOUCHERS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-Accounting] 01. Vouchers')
@Controller('api/v1/infra/misa-amis-accounting')
export class MisaAmisAccountingVouchersController {
  private readonly baseUrl = 'https://amisapp.misa.vn/api/amis/accounting/v2';

  @ApiOperation({
    summary: 'Tạo chứng từ kế toán AMIS (Phiếu thu / chi / kế toán)',
    description: 'Endpoint gốc: POST https://amisapp.misa.vn/api/amis/accounting/v2/vouchers | Docs: https://developer.misa.vn/ | Lập chứng từ kế toán (Phiếu thu 1111/1121, Phiếu chi, Giấy nộp tiền, Bút toán định khoản kép) trên MISA AMIS Kế toán theo Thông tư 200/2014/TT-BTC',
  })
  @ApiBody({ type: MisaAmisAccountingVoucherDto })
  @Post('vouchers')
  async createVoucher(@Body() dto: MisaAmisAccountingVoucherDto) {
    return {
      success: true,
      data: {
        voucher_id: `AMIS_VCH_${Date.now()}`,
        voucher_code: dto.voucher_code,
        voucher_date: dto.voucher_date,
        voucher_type: dto.voucher_type,
        total_amount: dto.total_amount,
        description: dto.description,
        entry_count: dto.entry_details?.length || 0,
        status: 'POSTED',
        posted_by: 'Kế toán viên tổng hợp',
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: 'Danh sách chứng từ kế toán AMIS',
    description: 'Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/vouchers | Tra cứu danh sách chứng từ kế toán theo kỳ, loại chứng từ và trạng thái ghi sổ',
  })
  @ApiQuery({ name: 'voucher_type', required: false, example: 'CASH_RECEIPT' })
  @ApiQuery({ name: 'from_date', required: false, example: '2026-10-01' })
  @ApiQuery({ name: 'to_date', required: false, example: '2026-10-03' })
  @Get('vouchers')
  async listVouchers(
    @Query('voucher_type') voucherType?: string,
    @Query('from_date') fromDate?: string,
    @Query('to_date') toDate?: string,
  ) {
    return {
      total: 2,
      data: [
        {
          voucher_id: 'AMIS_VCH_202610_001',
          voucher_code: 'PT20261003-001',
          voucher_date: '2026-10-03',
          voucher_type: voucherType || 'CASH_RECEIPT',
          total_amount: 5400000,
          description: 'Thu tiền bán lẻ trong ca sáng',
          status: 'POSTED',
        },
        {
          voucher_id: 'AMIS_VCH_202610_002',
          voucher_code: 'PC20261003-001',
          voucher_date: '2026-10-03',
          voucher_type: 'CASH_PAYMENT',
          total_amount: 1200000,
          description: 'Chi tiền mua đồ dùng văn phòng phẩm',
          status: 'POSTED',
        },
      ],
    };
  }

  @ApiOperation({
    summary: 'Chi tiết chứng từ kế toán & Bút toán định khoản',
    description: 'Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/vouchers/:id | Xem chi tiết các cặp định khoản Nợ/Có cấp 2 theo Thông tư 200/TT-BTC',
  })
  @ApiParam({ name: 'id', example: 'AMIS_VCH_202610_001' })
  @Get('vouchers/:id')
  async getVoucherById(@Param('id') id: string) {
    return {
      success: true,
      data: {
        voucher_id: id,
        voucher_code: 'PT20261003-001',
        voucher_date: '2026-10-03',
        voucher_type: 'CASH_RECEIPT',
        total_amount: 5400000,
        description: 'Thu tiền bán lẻ trong ca sáng ngày 03/10/2026',
        entries: [
          { debit_account: '1111', credit_account: '5111', amount: 5000000, description: 'Thu tiền mặt - Doanh thu bán hàng' },
          { debit_account: '1111', credit_account: '33311', amount: 400000, description: 'Thu tiền mặt - Thuế GTGT đầu ra (8%)' },
        ],
        status: 'POSTED',
      },
    };
  }

  @ApiOperation({
    summary: 'Ghi sổ đơn hàng bán lẻ tự động vào AMIS Kế toán',
    description: 'Endpoint gốc: POST https://amisapp.misa.vn/api/amis/accounting/v2/sales/sync-order | Tự động sinh cặp bút toán Nợ 1111/1121/131 - Có 5111 - Có 33311 từ đơn hàng bán lẻ đa kênh',
  })
  @ApiBody({ type: MisaAmisAccountingSyncOrderDto })
  @Post('sync-order')
  async syncOrder(@Body() dto: MisaAmisAccountingSyncOrderDto) {
    return {
      success: true,
      data: {
        sync_id: `SYNC_${Date.now()}`,
        order_code: dto.order_code,
        platform: dto.platform,
        voucher_code: `DT_${dto.order_code}`,
        journal_entries: [
          { debit_account: dto.payment_method === 'CASH' ? '1111' : '1121', credit_account: '5111', amount: dto.revenue_amount || 5000000, desc: 'Doanh thu thuần' },
          { debit_account: dto.payment_method === 'CASH' ? '1111' : '1121', credit_account: '33311', amount: dto.vat_amount || 400000, desc: 'Thuế GTGT đầu ra (8%)' },
        ],
        total_amount: dto.total_amount,
        status: 'POSTED',
        synced_at: new Date().toISOString(),
      },
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 2. MISA AMIS KẾ TOÁN - PRODUCTS & INVENTORY RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-Accounting] 02. Products & Inventory')
@Controller('api/v1/infra/misa-amis-accounting')
export class MisaAmisAccountingProductsController {
  @ApiOperation({
    summary: 'Đồng bộ hàng hóa lên AMIS Kế toán (Tài khoản 1561)',
    description: 'Endpoint gốc: POST https://amisapp.misa.vn/api/amis/accounting/v2/products | Tạo mới hoặc cập nhật hàng hóa, gán tài khoản kho (1561), giá vốn (632), doanh thu (5111)',
  })
  @ApiBody({ type: MisaAmisAccountingProductDto })
  @Post('products')
  async syncProduct(@Body() dto: MisaAmisAccountingProductDto) {
    return {
      success: true,
      data: {
        product_id: `AMIS_PRD_${Date.now()}`,
        product_code: dto.product_code,
        product_name: dto.product_name,
        account_code: dto.account_code,
        cost_account_code: dto.cost_account_code || '632',
        revenue_account_code: dto.revenue_account_code || '5111',
        cost_price: dto.cost_price,
        sale_price: dto.sale_price,
        status: 'SYNCED',
        synced_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: 'Danh sách hàng hóa AMIS Kế toán',
    description: 'Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/products | Tra cứu danh mục hàng hóa, nguyên vật liệu và tài khoản kế toán áp dụng',
  })
  @ApiQuery({ name: 'keyword', required: false, example: 'Áo Polo' })
  @Get('products')
  async listProducts(@Query('keyword') keyword?: string) {
    return {
      total: 1,
      data: [
        {
          product_code: 'SP_AP_POLO_01',
          product_name: 'Áo Polo Nam Cotton Compact Size L',
          account_code: '1561',
          cost_account_code: '632',
          revenue_account_code: '5111',
          cost_price: 90000,
          sale_price: 180000,
          on_hand: 150,
        },
      ],
    };
  }

  @ApiOperation({
    summary: 'Sơ đồ hệ thống tài khoản kế toán (Thông tư 200/2014/TT-BTC)',
    description: 'Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/accounts | Lấy toàn bộ sơ đồ tài khoản kế toán cấp 1 & cấp 2 chuẩn Thông tư 200/TT-BTC áp dụng trong AMIS',
  })
  @Get('chart-of-accounts')
  async getChartOfAccounts() {
    return {
      standard: 'THONG_TU_200_2014_TT_BTC',
      data: [
        { account_code: '1111', account_name: 'Tiền Việt Nam tại quỹ', type: 'ASSET' },
        { account_code: '1121', account_name: 'Tiền gửi ngân hàng VND', type: 'ASSET' },
        { account_code: '131', account_name: 'Phải thu của khách hàng', type: 'ASSET' },
        { account_code: '152', account_name: 'Nguyên liệu, vật liệu', type: 'ASSET' },
        { account_code: '1561', account_name: 'Giá mua hàng hóa', type: 'ASSET' },
        { account_code: '331', account_name: 'Phải trả cho người bán', type: 'LIABILITY' },
        { account_code: '33311', account_name: 'Thuế GTGT đầu ra phải nộp', type: 'LIABILITY' },
        { account_code: '5111', account_name: 'Doanh thu bán hàng hóa', type: 'REVENUE' },
        { account_code: '632', account_name: 'Giá vốn hàng bán', type: 'EXPENSE' },
        { account_code: '6421', account_name: 'Chi phí bán hàng', type: 'EXPENSE' },
        { account_code: '6422', account_name: 'Chi phí quản lý doanh nghiệp', type: 'EXPENSE' },
        { account_code: '911', account_name: 'Xác định kết quả kinh doanh', type: 'SUMMARY' },
      ],
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 3. MISA AMIS KẾ TOÁN - FINANCIAL REPORTS RESOURCE
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-Accounting] 03. Financial Reports')
@Controller('api/v1/infra/misa-amis-accounting')
export class MisaAmisAccountingReportsController {
  @ApiOperation({
    summary: 'Báo cáo Lãi Lỗ (P&L / Kết quả kinh doanh)',
    description: 'Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/reports/profit-loss | Báo cáo kết quả hoạt động kinh doanh (Doanh thu bán hàng, Các khoản giảm trừ, Giá vốn, Lợi nhuận gộp, Chi phí bán hàng & QLDN, LNTT, LNST) theo TT200',
  })
  @ApiQuery({ name: 'from_date', required: true, example: '2026-01-01' })
  @ApiQuery({ name: 'to_date', required: true, example: '2026-09-30' })
  @Get('reports/profit-loss')
  async getProfitLoss(@Query('from_date') fromDate: string, @Query('to_date') toDate: string) {
    return {
      period: { from_date: fromDate, to_date: toDate },
      standard: 'THONG_TU_200_2014_TT_BTC',
      currency: 'VND',
      data: {
        gross_revenue: 920000000,
        revenue_deductions: 70000000,
        net_revenue: 850000000,
        cost_of_goods_sold: 510000000,
        gross_profit: 340000000,
        selling_expenses: 85000000,
        general_admin_expenses: 35000000,
        operating_profit: 220000000,
        financial_revenue: 8000000,
        financial_expenses: 13000000,
        profit_before_tax: 215000000,
        corporate_income_tax: 43000000,
        net_profit_after_tax: 172000000,
      },
    };
  }

  @ApiOperation({
    summary: 'Bảng cân đối kế toán (Balance Sheet)',
    description: 'Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/reports/balance-sheet | Báo cáo tình hình tài chính tại một thời điểm (Tài sản ngắn hạn, Tài sản dài hạn, Nợ phải trả, Vốn chủ sở hữu) theo TT200',
  })
  @ApiQuery({ name: 'as_of_date', required: true, example: '2026-09-30' })
  @Get('reports/balance-sheet')
  async getBalanceSheet(@Query('as_of_date') asOfDate: string) {
    return {
      as_of_date: asOfDate,
      standard: 'THONG_TU_200_2014_TT_BTC',
      currency: 'VND',
      assets: {
        current_assets: 850000000,
        cash_and_equivalents: 240000000,
        short_term_receivables: 180000000,
        inventory: 430000000,
        non_current_assets: 400000000,
        fixed_assets: 380000000,
        total_assets: 1250000000,
      },
      resources: {
        liabilities: 380000000,
        short_term_debt: 280000000,
        long_term_debt: 100000000,
        equity: 870000000,
        owner_capital: 700000000,
        undistributed_earnings: 170000000,
        total_resources: 1250000000,
      },
      is_balanced: true,
    };
  }

  @ApiOperation({
    summary: 'Báo cáo lưu chuyển tiền tệ (Cash Flow Statement)',
    description: 'Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/reports/cash-flow | Báo cáo lưu chuyển tiền tệ theo phương pháp gián tiếp (Dòng tiền từ hoạt động kinh doanh, đầu tư và tài chính)',
  })
  @ApiQuery({ name: 'from_date', required: true, example: '2026-01-01' })
  @ApiQuery({ name: 'to_date', required: true, example: '2026-09-30' })
  @Get('reports/cash-flow')
  async getCashFlow(@Query('from_date') fromDate: string, @Query('to_date') toDate: string) {
    return {
      period: { from_date: fromDate, to_date: toDate },
      operating_cash_flow: 195000000,
      investing_cash_flow: -45000000,
      financing_cash_flow: -20000000,
      net_change_in_cash: 130000000,
      beginning_cash_balance: 110000000,
      ending_cash_balance: 240000000,
    };
  }
}
