import { Controller, Post, Get, Body, Param, Query, Delete, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiParam, ApiHeader } from '@nestjs/swagger';
import {
  MisaAmisAccountingVoucherDto,
  MisaAmisAccountingSyncOrderDto,
  MisaAmisAccountingProductDto,
  MisaActOpenConnectDto,
  MisaActOpenSaveVoucherDto,
  MisaActOpenDeleteVoucherDto,
  MisaActOpenGetDictionaryDto,
  MisaActOpenSaveDictionaryDto,
  MisaActOpenGetDebtDto,
  MisaActOpenGetInventoryBalanceDto,
  MisaActOpenSetOptionDto,
  MisaActOpenCallbackDemoDto,
} from '../../dto/misa-amis-accounting.dto';

// ════════════════════════════════════════════════════════════════
// 1. ACT OPEN API - CORE FUNCTIONS (KẾT NỐI & CHỨNG TỪ)
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-Accounting] 01. ACT Open API - Core Functions (Kết nối & Chứng từ)')
@Controller('api/v1/infra/misa-amis-accounting')
export class MisaAmisAccountingVouchersController {

  @ApiOperation({
    summary: '[Connect - Hàm kết nối] [POST /api/oauth/actopen/connect] Xác thực ứng dụng kết nối AMIS Kế toán',
    description: '[Thuộc danh mục: 2.1. Hàm kết nối > Connect] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/connect | Docs: https://actdocs.misa.vn/g2/graph/ACTOpenAPIHelp/index.html | Xác thực app_id và access_code lấy X-MISA-AccessToken',
  })
  @ApiBody({ type: MisaActOpenConnectDto })
  @Post('api/oauth/actopen/connect')
  async actOpenConnect(@Body() dto: MisaActOpenConnectDto) {
    return {
      Success: true,
      ErrorCode: '0',
      Data: {
        access_token: `misa_act_${Date.now()}_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`,
        token_type: 'Bearer',
        expires_in: 43200,
        app_id: dto.app_id,
        created_at: new Date().toISOString(),
      },
      UserMsg: 'Kết nối thành công với AMIS Kế toán',
    };
  }

  @ApiOperation({
    summary: '[Voucher - Cất đề nghị sinh chứng từ] [POST /api/oauth/actopen/save] Cất đề nghị sinh chứng từ kế toán',
    description: '[Thuộc danh mục: 2.2. Hàm cất chứng từ > SaveVoucher] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/save | Đẩy đề nghị sinh 46 loại chứng từ (sa_invoice, sa_voucher, pu_voucher, ca_payment, ca_receipt, in_inward, in_outward...)',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true, description: 'Token lấy từ hàm connect' })
  @ApiBody({ type: MisaActOpenSaveVoucherDto })
  @Post('api/oauth/actopen/save')
  async actOpenSaveVoucher(@Body() dto: MisaActOpenSaveVoucherDto, @Headers('X-MISA-AccessToken') token?: string) {
    return {
      Success: true,
      ErrorCode: '0',
      Data: {
        ref_id: dto.ref_id,
        voucher_type: dto.voucher_type,
        status: 1,
        status_name: 'Đã nhận xử lý',
        transaction_id: `TXN_${Date.now()}`,
      },
      UserMsg: 'Đã tiếp nhận đề nghị sinh chứng từ kế toán',
    };
  }

  @ApiOperation({
    summary: '[Voucher - Xóa đề nghị sinh chứng từ] [POST /api/oauth/actopen/delete] Xóa đề nghị sinh chứng từ đã gửi',
    description: '[Thuộc danh mục: 2.3. Hàm xóa chứng từ > DeleteVoucher] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/delete | Xóa đề nghị sinh chứng từ kế toán theo ref_id và voucher_type',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @ApiBody({ type: MisaActOpenDeleteVoucherDto })
  @Post('api/oauth/actopen/delete')
  async actOpenDeleteVoucher(@Body() dto: MisaActOpenDeleteVoucherDto) {
    return {
      Success: true,
      ErrorCode: '0',
      Data: { ref_id: dto.ref_id, deleted: true },
      UserMsg: 'Xóa đề nghị sinh chứng từ thành công',
    };
  }

  @ApiOperation({
    summary: '[Voucher - Chứng từ kế toán] [POST /vouchers] Tạo chứng từ kế toán AMIS (Phiếu thu / chi / kế toán)',
    description: '[Thuộc danh mục: Chứng từ kế toán > Voucher] Endpoint gốc: POST https://amisapp.misa.vn/api/amis/accounting/v2/vouchers | Lập chứng từ kế toán với định khoản kép Thông tư 200/TT-BTC',
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
    summary: '[Voucher - Chứng từ kế toán] [GET /vouchers] Danh sách chứng từ kế toán AMIS',
    description: '[Thuộc danh mục: Chứng từ kế toán > Voucher] Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/vouchers | Tra cứu danh sách chứng từ kế toán theo kỳ, loại chứng từ',
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
      ],
    };
  }

  @ApiOperation({
    summary: '[Voucher - Chứng từ kế toán] [GET /vouchers/:id] Chi tiết chứng từ kế toán & Bút toán định khoản',
    description: '[Thuộc danh mục: Chứng từ kế toán > Voucher] Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/vouchers/:id | Xem chi tiết các cặp định khoản Nợ/Có cấp 2',
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
    summary: '[Sync - Ghi sổ tự động] [POST /sync-order] Tự động ghi sổ đơn hàng POS/TMĐT sang AMIS',
    description: '[Thuộc danh mục: Ghi sổ tự động > Sync Order] Endpoint gốc: POST https://amisapp.misa.vn/api/amis/accounting/v2/sync-order | Tự động sinh bút toán kế toán bán hàng (Nợ 1111/1121/131, Có 5111, Có 33311)',
  })
  @ApiBody({ type: MisaAmisAccountingSyncOrderDto })
  @Post('sync-order')
  async syncOrderToAccounting(@Body() dto: MisaAmisAccountingSyncOrderDto) {
    return {
      success: true,
      message: `Đơn hàng ${dto.order_code} đã được hạch toán tự động vào MISA AMIS Kế toán`,
      data: {
        voucher_id: `AMIS_VCH_AUTO_${Date.now()}`,
        order_code: dto.order_code,
        platform: dto.platform,
        total_amount: dto.total_amount,
        revenue_amount: dto.revenue_amount,
        vat_amount: dto.vat_amount,
        entries: [
          { debit: '1121', credit: '5111', amount: dto.revenue_amount, note: 'Doanh thu bán lẻ qua cổng UniFlow' },
          { debit: '1121', credit: '33311', amount: dto.vat_amount, note: 'Thuế GTGT đầu ra 8%' },
        ],
        posted_at: new Date().toISOString(),
      },
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 2. ACT OPEN API - MASTER DATA (DANH MỤC, CÔNG NỢ & TỒN KHO)
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-Accounting] 02. ACT Open API - Master Data (Danh mục, Công nợ & Tồn kho)')
@Controller('api/v1/infra/misa-amis-accounting')
export class MisaAmisAccountingProductsController {

  @ApiOperation({
    summary: '[Dictionary - Lấy danh mục] [POST /api/oauth/actopen/get_dictionary] Lấy danh mục từ AMIS Kế toán',
    description: '[Thuộc danh mục: 2.4. Hàm lấy danh mục > Dictionary] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/get_dictionary | Lấy danh sách 15 loại danh mục: account_object, bank, stock, inventory_item, unit...',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @ApiBody({ type: MisaActOpenGetDictionaryDto })
  @Post('api/oauth/actopen/get_dictionary')
  async actOpenGetDictionary(@Body() dto: MisaActOpenGetDictionaryDto) {
    return {
      Success: true,
      ErrorCode: '0',
      Data: {
        DictionaryType: dto.dictionary_type,
        Total: 2,
        List: [
          { Code: 'KH001', Name: 'Công ty Cổ phần Công Nghệ Tân Á', Address: 'Hà Nội' },
          { Code: 'KH002', Name: 'Công ty TNHH Giải Pháp Trí Tuệ Nhân Tạo', Address: 'Hồ Chí Minh' },
        ],
      },
    };
  }

  @ApiOperation({
    summary: '[Dictionary - Sinh danh mục] [POST /api/oauth/actopen/save_dictionary] Thêm mới danh mục sang AMIS Kế toán',
    description: '[Thuộc danh mục: 2.14. Hàm sinh danh mục > SaveDictionary] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/save_dictionary | Thêm mới vật tư hàng hóa, đối tượng, kho sang AMIS',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @ApiBody({ type: MisaActOpenSaveDictionaryDto })
  @Post('api/oauth/actopen/save_dictionary')
  async actOpenSaveDictionary(@Body() dto: MisaActOpenSaveDictionaryDto) {
    return {
      Success: true,
      ErrorCode: '0',
      Data: { count: dto.data?.length || 0, saved: true },
      UserMsg: 'Thêm mới danh mục sang AMIS Kế toán thành công',
    };
  }

  @ApiOperation({
    summary: '[Dictionary - Danh mục đã xóa] [POST /api/oauth/actopen/get_dictionary_delete] Lấy danh mục đã xóa',
    description: '[Thuộc danh mục: 2.9. Danh mục đã xóa > DeletedDictionary] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/get_dictionary_delete | Đồng bộ các bản ghi danh mục đã bị xóa khỏi AMIS',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @Post('api/oauth/actopen/get_dictionary_delete')
  async actOpenGetDeletedDictionary(@Body() body: any) {
    return { Success: true, ErrorCode: '0', Data: { DeletedList: [] } };
  }

  @ApiOperation({
    summary: '[Debt - Công nợ đối tượng] [POST /api/oauth/actopen/get_list_acc_obj_debt] Lấy công nợ phải thu, phải trả',
    description: '[Thuộc danh mục: 2.6. Hàm lấy công nợ > Debt] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/get_list_acc_obj_debt | Lấy số dư công nợ phải thu (TK 131) hoặc phải trả (TK 331) theo đối tượng',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @ApiBody({ type: MisaActOpenGetDebtDto })
  @Post('api/oauth/actopen/get_list_acc_obj_debt')
  async actOpenGetDebt(@Body() dto: MisaActOpenGetDebtDto) {
    return {
      Success: true,
      ErrorCode: '0',
      Data: {
        AccountObjectCode: dto.account_object_code,
        DebtType: dto.debt_type,
        DebtAmount: 15400000,
        ToDate: dto.to_date,
      },
    };
  }

  @ApiOperation({
    summary: '[Debt - Công nợ đã xóa] [POST /api/oauth/actopen/get_list_acc_obj_debt_delete] Lấy công nợ đã xóa',
    description: '[Thuộc danh mục: 2.10. Công nợ đã xóa > DebtDelete] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/get_list_acc_obj_debt_delete',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @Post('api/oauth/actopen/get_list_acc_obj_debt_delete')
  async actOpenGetDeletedDebt(@Body() body: any) {
    return { Success: true, ErrorCode: '0', Data: { DeletedDebtList: [] } };
  }

  @ApiOperation({
    summary: '[Stock - Tồn kho theo kho] [POST /api/oauth/actopen/get_list_inventory_balance] Số lượng tồn kho VTHH',
    description: '[Thuộc danh mục: 2.7. Tồn kho VTHH > InventoryBalance] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/get_list_inventory_balance | Lấy số lượng tồn kho của vật tư hàng hóa theo kho',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @ApiBody({ type: MisaActOpenGetInventoryBalanceDto })
  @Post('api/oauth/actopen/get_list_inventory_balance')
  async actOpenGetInventoryBalance(@Body() dto: MisaActOpenGetInventoryBalanceDto) {
    return {
      Success: true,
      ErrorCode: '0',
      Data: [
        { StockCode: dto.stock_code, InventoryItemCode: 'SP01', QuantityBalance: 120, AmountBalance: 10800000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Stock - Tồn kho đã xóa] [POST /api/oauth/actopen/get_list_inventory_balance_delete] Tồn kho đã xóa',
    description: '[Thuộc danh mục: 2.11. Tồn kho đã xóa > StockDelete] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/get_list_inventory_balance_delete',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @Post('api/oauth/actopen/get_list_inventory_balance_delete')
  async actOpenGetDeletedInventoryBalance(@Body() body: any) {
    return { Success: true, ErrorCode: '0', Data: { DeletedInventoryList: [] } };
  }

  @ApiOperation({
    summary: '[Company - Thông tin công ty] [POST /api/oauth/actopen/get_company_info] Lấy thông tin công ty & Chi nhánh',
    description: '[Thuộc danh mục: 2.12. Thông tin công ty > CompanyInfo] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/get_company_info | Lấy cơ cấu tổ chức, chi nhánh công ty',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @Post('api/oauth/actopen/get_company_info')
  async actOpenGetCompanyInfo(@Body() body: any) {
    return {
      Success: true,
      ErrorCode: '0',
      Data: {
        CompanyCode: 'UNIFLOW_CORP',
        CompanyName: 'Công ty Cổ phần Công Nghệ UniFlow Enterprise',
        TaxCode: '0108899123',
        Address: 'Hà Nội, Việt Nam',
        Branches: [{ BranchCode: 'CN_HN', BranchName: 'Chi nhánh Hà Nội' }],
      },
    };
  }

  @ApiOperation({
    summary: '[System Option - Tùy chọn hệ thống] [POST /api/oauth/actopen/get_option] Lấy tùy chọn hệ thống kế toán',
    description: '[Thuộc danh mục: 2.5. Tùy chọn hệ thống > SystemOption] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/get_option | Tra cứu phương pháp tính giá xuất kho, hạch toán đa tiền tệ',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @Post('api/oauth/actopen/get_option')
  async actOpenGetOption(@Body() body: any) {
    return {
      Success: true,
      ErrorCode: '0',
      Data: { CostMethod: 1, CostMethodName: 'Bình quân tức thời', CurrencyCode: 'VND' },
    };
  }

  @ApiOperation({
    summary: '[System Option - Thiết lập kết nối] [POST /api/oauth/actopen/set_option] Thiết lập dữ liệu kết nối',
    description: '[Thuộc danh mục: 2.13. Thiết lập kết nối > SetDwOption] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/set_option | Cấu hình quy tắc đồng bộ chứng từ tự động',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @ApiBody({ type: MisaActOpenSetOptionDto })
  @Post('api/oauth/actopen/set_option')
  async actOpenSetOption(@Body() dto: MisaActOpenSetOptionDto) {
    return { Success: true, ErrorCode: '0', Data: { OptionId: dto.option_id, Status: 'OK' } };
  }

  @ApiOperation({
    summary: '[Expense - Phát sinh theo KMCP] [POST /api/oauth/actopen/get_detail_account_by_expense] Báo cáo chi phí KMCP',
    description: '[Thuộc danh mục: 2.15. Phát sinh theo KMCP > ExpenseItem] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/get_detail_account_by_expense | Báo cáo chi tiết phát sinh tài khoản theo khoản mục chi phí',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @Post('api/oauth/actopen/get_detail_account_by_expense')
  async actOpenGetDetailAccountByExpense(@Body() body: any) {
    return { Success: true, ErrorCode: '0', Data: { Details: [] } };
  }

  @ApiOperation({
    summary: '[Product - Đồng bộ sản phẩm] [POST /products] Khai báo hàng hóa mới lên AMIS Kế toán',
    description: '[Thuộc danh mục: Danh mục hàng hóa > Product] Endpoint gốc: POST https://amisapp.misa.vn/api/amis/accounting/v2/products | Khai báo hàng hóa, gán TK kho 1561, TK giá vốn 632, TK doanh thu 5111',
  })
  @ApiBody({ type: MisaAmisAccountingProductDto })
  @Post('products')
  async createProduct(@Body() dto: MisaAmisAccountingProductDto) {
    return {
      success: true,
      message: `Hàng hóa [${dto.product_code}] đã được đồng bộ vào danh mục vật tư MISA AMIS`,
      data: {
        product_code: dto.product_code,
        product_name: dto.product_name,
        account_code: dto.account_code || '1561',
        cost_account_code: dto.cost_account_code || '632',
        revenue_account_code: dto.revenue_account_code || '5111',
        cost_price: dto.cost_price,
        sale_price: dto.sale_price,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Product - Tra cứu sản phẩm] [GET /products] Danh mục hàng hóa vật tư AMIS',
    description: '[Thuộc danh mục: Danh mục hàng hóa > Product] Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/products | Tra cứu danh mục hàng hóa, nguyên vật liệu và tài khoản ngầm định',
  })
  @ApiQuery({ name: 'keyword', required: false, example: 'Áo' })
  @Get('products')
  async listProducts(@Query('keyword') keyword?: string) {
    return {
      total: 2,
      data: [
        {
          product_code: 'SP_AP_POLO_01',
          product_name: 'Áo Polo Nam Cotton Compact Size L',
          account_code: '1561',
          cost_account_code: '632',
          revenue_account_code: '5111',
          cost_price: 90000,
          sale_price: 180000,
          on_hand: 120,
        },
      ],
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 3. ACT OPEN API - CALLBACK & DEMO SUPPORT (BẤT ĐỒNG BỘ & KÝ SỐ)
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-Accounting] 03. ACT Open API - Callback & Webhooks (Bất đồng bộ & Ký số)')
@Controller('api/v1/infra/misa-amis-accounting')
export class MisaAmisAccountingCallbackController {

  @ApiOperation({
    summary: '[Callback - Kết quả xử lý] [POST /api/oauth/actopen/callback] Lấy danh sách kết quả xử lý bất đồng bộ',
    description: '[Thuộc danh mục: 2.16. Hàm lấy kết quả > Callback] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopen/callback | Tra cứu kết quả sinh chứng từ bất đồng bộ',
  })
  @ApiHeader({ name: 'X-MISA-AccessToken', required: true })
  @Post('api/oauth/actopen/callback')
  async actOpenCallback(@Body() body: any) {
    return {
      Success: true,
      ErrorCode: '0',
      Data: { ProcessedCount: 1, Results: [{ ref_id: 'REF_202610_INV_001', status: 'SUCCESS' }] },
    };
  }

  @ApiOperation({
    summary: '[Callback Demo - Test gọi callback] [POST /api/oauth/actopensupport/call_back_data_demo] Demo gọi callback',
    description: '[Thuộc danh mục: 6.1. Demo callback > CallbackDemo] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopensupport/call_back_data_demo',
  })
  @Post('api/oauth/actopensupport/call_back_data_demo')
  async callbackDataDemo(@Body() body: any) {
    return { Success: true, Message: 'Callback demo executed successfully' };
  }

  @ApiOperation({
    summary: '[Signature - Tạo chữ ký SHA256] [POST /api/oauth/actopensupport/get_signature] Tạo chữ ký HMAC-SHA256',
    description: '[Thuộc danh mục: 6.2. Demo ký số > Signature] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopensupport/get_signature | Ký số payload callback',
  })
  @Post('api/oauth/actopensupport/get_signature')
  async getSignature(@Body() body: any) {
    return { Success: true, Signature: `sha256_${Date.now()}_99a8b7c6d5e4f3` };
  }

  @ApiOperation({
    summary: '[Callback Handler - Nhận kết quả] [POST /api/oauth/actopensupport/call_back_data] Endpoint nhận callback',
    description: '[Thuộc danh mục: 6.3. Callback handler > CallBackData] Endpoint gốc: POST https://actapp.misa.vn/api/oauth/actopensupport/call_back_data | Endpoint tiếp nhận webhook kết quả sinh chứng từ',
  })
  @ApiBody({ type: MisaActOpenCallbackDemoDto })
  @Post('api/oauth/actopensupport/call_back_data')
  async receiveCallbackData(@Body() dto: MisaActOpenCallbackDemoDto) {
    return { Success: true, Message: 'Callback received and processed by UniFlow' };
  }

  @ApiOperation({
    summary: '[Callback Check - Kiểm tra thông luồng] [GET /api/oauth/actopensupport/check_call_back_data] Kiểm tra kết quả gọi callback',
    description: '[Thuộc danh mục: 6.4. Check callback > CheckCallback] Endpoint gốc: GET https://actapp.misa.vn/api/oauth/actopensupport/check_call_back_data',
  })
  @Get('api/oauth/actopensupport/check_call_back_data')
  async checkCallbackData() {
    return { Success: true, TotalCalls: 5, LastCallAt: new Date().toISOString() };
  }

  @ApiOperation({
    summary: '[Callback Delete - Xóa nhật ký callback] [DELETE /api/oauth/actopensupport/delete_call_back_data] Xóa nhật ký callback',
    description: '[Thuộc danh mục: 6.5. Delete callback > DeleteCallback] Endpoint gốc: DELETE https://actapp.misa.vn/api/oauth/actopensupport/delete_call_back_data',
  })
  @Delete('api/oauth/actopensupport/delete_call_back_data')
  async deleteCallbackData() {
    return { Success: true, Message: 'Đã xóa kết quả gọi callback demo' };
  }
}

// ════════════════════════════════════════════════════════════════
// 4. FINANCIAL REPORTS & CHART OF ACCOUNTS (BÁO CÁO & TÀI KHOẢN)
// ════════════════════════════════════════════════════════════════
@ApiTags('[MISA-AMIS-Accounting] 04. Financial Reports & Chart of Accounts (Báo cáo & Tài khoản)')
@Controller('api/v1/infra/misa-amis-accounting')
export class MisaAmisAccountingReportsController {

  @ApiOperation({
    summary: '[Chart of Accounts - Hệ thống TK] [GET /chart-of-accounts] Bảng hệ thống tài khoản kế toán chuẩn TT200',
    description: '[Thuộc danh mục: Hệ thống tài khoản > COA] Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/chart-of-accounts | Danh mục tài khoản kế toán cấp 1 & cấp 2 theo Thông tư 200/2014/TT-BTC',
  })
  @Get('chart-of-accounts')
  async getChartOfAccounts() {
    return {
      standard: 'THONG_TU_200_2014_TT_BTC',
      total_accounts: 4,
      data: [
        { code: '1111', name: 'Tiền Việt Nam (Tiền mặt)', type: 'ASSET' },
        { code: '1121', name: 'Tiền gửi ngân hàng (VND)', type: 'ASSET' },
        { code: '131', name: 'Phải thu của khách hàng', type: 'ASSET_LIABILITY' },
        { code: '5111', name: 'Doanh thu bán hàng hóa', type: 'REVENUE' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Report - P&L] [GET /reports/profit-loss] Báo cáo kết quả hoạt động kinh doanh (P&L)',
    description: '[Thuộc danh mục: Báo cáo tài chính > Profit & Loss] Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/reports/profit-loss | Báo cáo doanh thu thuần, giá vốn và lợi nhuận gộp',
  })
  @ApiQuery({ name: 'from_date', example: '2026-01-01' })
  @ApiQuery({ name: 'to_date', example: '2026-09-30' })
  @Get('reports/profit-loss')
  async getProfitLossReport(@Query('from_date') fromDate?: string, @Query('to_date') toDate?: string) {
    return {
      period: { from_date: fromDate || '2026-01-01', to_date: toDate || '2026-09-30' },
      currency: 'VND',
      metrics: {
        gross_revenue: 12500000000,
        sales_deductions: 250000000,
        net_revenue: 12250000000,
        cost_of_goods_sold: 7350000000,
        gross_profit: 4900000000,
        net_profit: 2650000000,
      },
    };
  }

  @ApiOperation({
    summary: '[Report - Balance Sheet] [GET /reports/balance-sheet] Bảng cân đối kế toán tài sản & nguồn vốn',
    description: '[Thuộc danh mục: Báo cáo tài chính > Balance Sheet] Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/reports/balance-sheet | Bảng cân đối kế toán theo Thông tư 200',
  })
  @ApiQuery({ name: 'as_of_date', example: '2026-09-30' })
  @Get('reports/balance-sheet')
  async getBalanceSheet(@Query('as_of_date') asOfDate?: string) {
    return {
      as_of_date: asOfDate || '2026-09-30',
      currency: 'VND',
      assets: { current_assets: 14200000000, non_current_assets: 8500000000, total_assets: 22700000000 },
      resources: { liabilities: 8200000000, equity: 14500000000, total_resources: 22700000000 },
      balanced: true,
    };
  }

  @ApiOperation({
    summary: '[Report - Cash Flow] [GET /reports/cash-flow] Báo cáo lưu chuyển tiền tệ (Cash Flow)',
    description: '[Thuộc danh mục: Báo cáo tài chính > Cash Flow] Endpoint gốc: GET https://amisapp.misa.vn/api/amis/accounting/v2/reports/cash-flow | Báo cáo dòng tiền từ hoạt động kinh doanh, đầu tư và tài chính',
  })
  @ApiQuery({ name: 'from_date', example: '2026-01-01' })
  @ApiQuery({ name: 'to_date', example: '2026-09-30' })
  @Get('reports/cash-flow')
  async getCashFlowReport(@Query('from_date') fromDate?: string, @Query('to_date') toDate?: string) {
    return {
      period: { from_date: fromDate || '2026-01-01', to_date: toDate || '2026-09-30' },
      currency: 'VND',
      cash_flows: { operating_activities: 3100000000, net_increase: 1250000000, closing_cash_balance: 4750000000 },
    };
  }
}
