import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { PancakePosCreateTransactionDto, PancakePosAdvCostDto } from '../../dto/pos-pancake.dto';

@ApiTags('[POS-Pancake] 08. Finance, Debt & Transactions (Tài chính, Công nợ & Sổ quỹ)')
@Controller('api/v1/infra/pancake')
export class PancakeFinanceController {

  @ApiOperation({
    summary: '[Debt - Danh sách công nợ] [GET /shops/:shopId/debt] Danh sách công nợ khách hàng và đối tác',
    description: '[Thuộc danh mục: 15. Debt > Danh sách công nợ] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/debt | Docs: https://docs.pancake.biz/pos/api/ | Tra cứu dư nợ phải thu của khách và phải trả cho nhà cung cấp',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/debt')
  async listDebtsOfficial(@Param('shopId') shopId: string, @Query('customer_id') customerId?: string) {
    return {
      success: true,
      shop_id: shopId,
      debts: [
        {
          id: 1,
          customer_id: customerId || 'CUST_001',
          customer_name: 'Phạm Hoàng Linh',
          receivable_debt: 450000,
          payable_debt: 0,
          last_transaction_at: new Date().toISOString(),
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Transaction - Danh sách giao dịch] [GET /shops/:shopId/transactions] Danh sách phiếu thu/chi và sổ quỹ',
    description: '[Thuộc danh mục: 16. Transaction > Danh sách phiếu thu chi] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/transactions | Tra cứu dòng tiền mặt và ngân hàng',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/transactions')
  async listTransactionsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      transactions: [
        {
          id: 101,
          type: 'THU',
          amount: 350000,
          payment_method: 'TIEN_MAT',
          description: 'Thu tiền đơn hàng ORD_PC_9921',
          created_at: new Date().toISOString(),
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Transaction - Tạo giao dịch] [POST /shops/:shopId/transactions] Tạo phiếu thu hoặc chi tiền mặt/ngân hàng',
    description: '[Thuộc danh mục: 16. Transaction > Tạo phiếu thu chi] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/transactions | Ghi nhận phiếu thu tiền hàng hoặc chi phí vận hành',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateTransactionDto })
  @Post('shops/:shopId/transactions')
  async createTransactionOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosCreateTransactionDto) {
    return {
      success: true,
      shop_id: shopId,
      transaction: { id: Date.now(), ...dto, status: 'CONFIRMED' },
    };
  }

  @ApiOperation({
    summary: '[Transaction - Tạo chi phí Ads] [POST /shops/:shopId/adv_costs] Ghi nhận chi phí quảng cáo marketing',
    description: '[Thuộc danh mục: 16. Transaction > Ghi nhận chi phí Ads] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/adv_costs | Cập nhật chi phí Facebook/TikTok Ads vào sổ quỹ',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosAdvCostDto })
  @Post('shops/:shopId/adv_costs')
  async createAdvCostOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosAdvCostDto) {
    return {
      success: true,
      shop_id: shopId,
      adv_cost: { id: Date.now(), ...dto, status: 'RECORDED' },
    };
  }

  @ApiOperation({
    summary: '[Transaction - Lịch sử thanh toán] [GET /shops/:shopId/payment_accounts/get_payment_histories] Lịch sử biến động số dư tài khoản thanh toán',
    description: '[Thuộc danh mục: 16. Transaction > Lịch sử thanh toán] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/payment_accounts/get_payment_histories',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/payment_accounts/get_payment_histories')
  async getPaymentHistoriesOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      payment_histories: [
        {
          id: 'PH_901',
          account_id: 'ACC_VCB_01',
          change_amount: 350000,
          balance_after: 15420000,
          created_at: new Date().toISOString(),
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Reconciliation - Phiên đối soát] [GET /shops/:shopId/reconciliations] Danh sách các phiên đối soát COD và vận chuyển',
    description: '[Thuộc danh mục: 17. Reconciliation > Phiên đối soát] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/reconciliations | Đối soát tiền thu hộ COD từ đơn vị vận chuyển GHN, GHTK, Viettel Post',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/reconciliations')
  async listReconciliationsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      reconciliations: [
        {
          id: 'REC_2026_001',
          partner: 'GHTK',
          cod_total: 12500000,
          shipping_fee_total: 850000,
          net_payout: 11650000,
          status: 'COMPLETED',
          reconciled_at: new Date().toISOString(),
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[E-Invoice - Hóa đơn điện tử] [GET /shops/:shopId/list_einvoices/] Danh sách hóa đơn điện tử phát hành',
    description: '[Thuộc danh mục: 06. E-Invoice > Hóa đơn điện tử] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/list_einvoices/ | Tra cứu hóa đơn điện tử tích hợp MISA meInvoice, VNPT Invoice',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/list_einvoices/')
  async listEInvoicesOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      einvoices: [
        {
          id: 'INV_E_001',
          order_id: 'ORD_PC_9921',
          invoice_number: '1C26TAA-000123',
          total_amount: 350000,
          status: 'ISSUED',
          issued_at: new Date().toISOString(),
        },
      ],
    };
  }
}
