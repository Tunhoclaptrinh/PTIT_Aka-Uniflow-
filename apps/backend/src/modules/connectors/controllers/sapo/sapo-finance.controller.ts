import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  SapoCreatePurchaseOrderDto,
  SapoCashReceiptDto,
} from '../../dto/pos-sapo.dto';

@ApiTags('[02. POS-Sapo] 15. Purchase & Cash')
@Controller('api/v1/infra/sapo')
export class SapoFinanceController {

  @ApiOperation({
    summary: '[POST /admin/purchase_orders.json] Lập phiếu nhập hàng Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/purchase_orders.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tạo phiếu nhập hàng từ nhà cung cấp lên Sapo POS',
  })
  @ApiBody({ type: SapoCreatePurchaseOrderDto })
  @Post('admin/purchase_orders.json')
  async createPurchaseOrder(@Body() dto: SapoCreatePurchaseOrderDto) {
    return {
      purchase_order: {
        id: Date.now(),
        code: `PO_SAPO_${Date.now().toString().slice(-6)}`,
        supplier_id: dto.supplier_id,
        location_id: dto.location_id,
        status: 'draft',
        created_on: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[GET /admin/purchase_orders.json] Danh sách phiếu nhập hàng Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/purchase_orders.json | Tra cứu danh sách phiếu nhập hàng từ nhà cung cấp',
  })
  @Get('admin/purchase_orders.json')
  async listPurchaseOrders(@Query('limit') limit: number = 20) {
    return {
      purchase_orders: [
        { id: 8812, code: 'PO_SAPO_001', supplier_name: 'Dệt May Hà Nội', total: 12500000, status: 'received' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /admin/cash_receipts.json] Lập phiếu thu chi sổ quỹ Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/cash_receipts.json | Docs: https://support.sapo.vn/gioi-thieu-api | Ghi nhận giao dịch thu tiền / chi tiền mặt sổ quỹ Sapo POS',
  })
  @ApiBody({ type: SapoCashReceiptDto })
  @Post('admin/cash_receipts.json')
  async cashReceipt(@Body() dto: SapoCashReceiptDto) {
    return {
      cash_receipt: {
        id: Date.now(),
        location_id: dto.location_id,
        type: dto.receipt_type,
        amount: dto.amount,
        reason: dto.reason,
        created_on: new Date().toISOString(),
      },
    };
  }
}
