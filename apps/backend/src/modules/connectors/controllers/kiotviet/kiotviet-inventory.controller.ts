import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  KiotVietUpdateStockDto,
  KiotVietStockTakeDto,
  KiotVietTransferStockDto,
  KiotVietPurchaseOrderDto,
} from '../../dto/pos-kiotviet.dto';

@ApiTags('[POS-KiotViet] 03. Tồn kho & Kiểm kê & Chuyển kho (Inventory & Transfers)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietInventoryController {

  @ApiOperation({
    summary: '[POST /products/inventories] Cập nhật tồn kho KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/products/inventories | Docs: https://developer.kiotviet.vn/#/inventories | Cập nhật số lượng tồn kho thực tế cho sản phẩm tại chi nhánh KiotViet',
  })
  @ApiBody({ type: KiotVietUpdateStockDto })
  @Post('products/inventories')
  async updateStock(@Body() dto: KiotVietUpdateStockDto) {
    return {
      responseStatus: 'success',
      data: {
        branchId: dto.branchId,
        productCode: dto.productCode,
        onHand: dto.onHand,
        updatedDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /damageitems] Lập phiếu kiểm kê / xuất hủy kho KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/damageitems | Docs: https://developer.kiotviet.vn/#/damageitems | Lập phiếu kiểm kho cân bằng số lượng tồn thực tế với tồn sổ sách',
  })
  @ApiBody({ type: KiotVietStockTakeDto })
  @Post('damageitems')
  async createStockTake(@Body() dto: KiotVietStockTakeDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        code: `PKK${Date.now().toString().slice(-8)}`,
        branchId: dto.branchId,
        description: dto.description,
        totalItemsCounted: dto.items?.length || 1,
        status: 'Đã cân bằng kho',
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /transfers] Phiếu chuyển hàng giữa các chi nhánh KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/transfers | Docs: https://developer.kiotviet.vn/#/transfers | Điều chuyển hàng giữa các cửa hàng trong chuỗi KiotViet',
  })
  @ApiBody({ type: KiotVietTransferStockDto })
  @Post('transfers')
  async createTransfer(@Body() dto: KiotVietTransferStockDto) {
    return {
      responseStatus: 'success',
      data: {
        transferCode: `CK${Date.now().toString().slice(-8)}`,
        fromBranchId: dto.fromBranchId,
        toBranchId: dto.toBranchId,
        status: 'Đang chuyển hàng',
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /purchaseorders] Lập phiếu nhập hàng nhà cung cấp KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/purchaseorders | Docs: https://developer.kiotviet.vn/#/purchaseorders | Tạo phiếu nhập hàng từ nhà phân phối vào kho KiotViet',
  })
  @ApiBody({ type: KiotVietPurchaseOrderDto })
  @Post('purchaseorders')
  async createPurchaseOrder(@Body() dto: KiotVietPurchaseOrderDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        code: `PN${Date.now().toString().slice(-8)}`,
        branchId: dto.branchId,
        supplierName: dto.supplierName,
        totalAmount: dto.totalAmount,
        status: 'Đã nhập kho',
        createdDate: new Date().toISOString(),
      },
    };
  }
}
