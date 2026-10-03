import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  NhanhAddBillDto,
  NhanhSearchBillDto,
  NhanhAddInvoiceDto,
  NhanhSearchInvoiceDto,
  NhanhReturnOrderDto,
} from '../../dto/pos-nhanh.dto';

@ApiTags('[POS-Nhanh] 07. Hóa đơn bán lẻ & Hóa đơn VAT (Bills & Invoices)')
@Controller('api/v1/infra/nhanh')
export class NhanhBillingController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /api/bill/add] Tạo hóa đơn bán lẻ tại quầy POS Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/bill/add | Docs: https://developers.nhanh.group/pos/bill/add | Tạo hóa đơn xuất bán trực tiếp tại quầy thu ngân điểm kho Nhanh.vn',
  })
  @ApiBody({ type: NhanhAddBillDto })
  @Post('api/bill/add')
  async addBill(@Body() dto: NhanhAddBillDto) {
    return {
      code: 1,
      data: {
        billId: Date.now().toString().slice(-8),
        depotId: dto.depotId,
        cashier: dto.cashier,
        totalMoney: dto.totalMoney,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/bill/search] Tra cứu hóa đơn bán lẻ Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/bill/search | Docs: https://developers.nhanh.group/pos/bill/search | Tra cứu danh sách hóa đơn bán lẻ tại quầy theo kho và thời gian',
  })
  @ApiBody({ type: NhanhSearchBillDto })
  @Post('api/bill/search')
  async searchBill(@Body() dto: NhanhSearchBillDto) {
    return {
      code: 1,
      data: {
        page: dto.page || 1,
        totalRecords: 2,
        bills: [
          { billId: '88991201', depotId: dto.depotId || 102, totalMoney: 580000, cashier: 'Nguyễn Văn Thu Ngân', created_at: new Date().toISOString() },
          { billId: '88991202', depotId: dto.depotId || 102, totalMoney: 290000, cashier: 'Nguyễn Văn Thu Ngân', created_at: new Date().toISOString() },
        ],
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/invoice/add] Xuất hóa đơn VAT điện tử Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/invoice/add | Docs: https://developers.nhanh.group/pos/invoice/add | Phát hành hóa đơn điện tử cho đơn hàng kết nối hệ thống thuế',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: NhanhAddInvoiceDto })
  @Post('api/invoice/add')
  async addInvoice(@Body() dto: NhanhAddInvoiceDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_add_invoice', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /api/invoice/search] Tra cứu hóa đơn VAT Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/invoice/search | Docs: https://developers.nhanh.group/pos/invoice/search | Tra cứu trạng thái phát hành hóa đơn VAT',
  })
  @ApiBody({ type: NhanhSearchInvoiceDto })
  @Post('api/invoice/search')
  async searchInvoice(@Body() dto: NhanhSearchInvoiceDto) {
    return {
      code: 1,
      data: {
        invoiceId: `INV_${dto.orderId || 88129}`,
        invoiceNumber: '0001428',
        invoiceStatus: 'APPROVED_BY_TAX_AUTHORITY',
        downloadUrl: 'https://invoice.nhanh.vn/download/INV_88129.pdf',
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/return/add] Tạo phiếu trả hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/return/add | Docs: https://developers.nhanh.group/pos/return/add | Lập phiếu nhận lại hàng trả từ khách và hoàn tiền',
  })
  @ApiBody({ type: NhanhReturnOrderDto })
  @Post('api/return/add')
  async returnOrder(@Body() dto: NhanhReturnOrderDto) {
    return {
      code: 1,
      data: {
        returnId: Date.now().toString().slice(-6),
        orderId: dto.orderId,
        depotId: dto.depotId,
        moneyRefund: dto.moneyRefund,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/return/search] Danh sách phiếu trả hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/return/search | Docs: https://developers.nhanh.group/pos/return/search | Tra cứu danh sách phiếu trả hàng Nhanh.vn',
  })
  @Post('api/return/search')
  async searchReturns() {
    return {
      code: 1,
      data: [
        { returnId: 8812, orderId: 88129, moneyRefund: 290000, reason: 'Khách đổi size', created_at: new Date().toISOString() },
      ],
    };
  }
}
