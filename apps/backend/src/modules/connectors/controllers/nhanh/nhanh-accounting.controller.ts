import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  NhanhAddReceiptDto,
  NhanhAddPaymentDto,
  NhanhCashBookDto,
} from '../../dto/pos-nhanh.dto';

@ApiTags('[POS-Nhanh] 09. Kế toán & Sổ quỹ (Accounting)')
@Controller('api/v1/infra/nhanh')
export class NhanhAccountingController {

  @ApiOperation({
    summary: '[POST /api/accounting/receipt-add] Tạo phiếu thu tiền mặt Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/accounting/receipt-add | Docs: https://developers.nhanh.group/pos/accounting/receipt-add | Lập phiếu thu quỹ tiền mặt',
  })
  @ApiBody({ type: NhanhAddReceiptDto })
  @Post('api/accounting/receipt-add')
  async addReceipt(@Body() dto: NhanhAddReceiptDto) {
    return {
      code: 1,
      data: {
        receiptId: `PT_${Date.now().toString().slice(-6)}`,
        depotId: dto.depotId,
        amount: dto.amount,
        payer: dto.payerName,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/accounting/payment-add] Tạo phiếu chi tiền mặt Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/accounting/payment-add | Docs: https://developers.nhanh.group/pos/accounting/payment-add | Lập phiếu chi quỹ tiền mặt',
  })
  @ApiBody({ type: NhanhAddPaymentDto })
  @Post('api/accounting/payment-add')
  async addPayment(@Body() dto: NhanhAddPaymentDto) {
    return {
      code: 1,
      data: {
        paymentId: `PC_${Date.now().toString().slice(-6)}`,
        depotId: dto.depotId,
        amount: dto.amount,
        receiver: dto.receiverName,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/finance/cash-book] Ghi nhận sổ quỹ thu / chi Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/finance/cash-book | Docs: https://developers.nhanh.group/pos/finance/cash-book | Lập phiếu thu hoặc phiếu chi tiền mặt vào sổ quỹ cửa hàng Nhanh.vn',
  })
  @ApiBody({ type: NhanhCashBookDto })
  @Post('api/finance/cash-book')
  async cashBook(@Body() dto: NhanhCashBookDto) {
    return {
      code: 1,
      data: {
        voucherId: `CB_${Date.now().toString().slice(-6)}`,
        depotId: dto.depotId,
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        created_at: new Date().toISOString(),
      },
    };
  }
}
