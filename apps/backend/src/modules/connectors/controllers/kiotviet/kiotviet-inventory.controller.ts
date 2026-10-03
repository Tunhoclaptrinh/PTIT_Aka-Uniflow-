import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  KiotVietUpdateStockDto,
  KiotVietStockTakeDto,
  KiotVietTransferStockDto,
  KiotVietPurchaseOrderDto,
  KiotVietUpdateTransferDto,
  KiotVietUpdatePurchaseOrderDto,
} from '../../dto/pos-kiotviet.dto';

@ApiTags('[02. POS-KiotViet] 03. Inventory & Transfers (Tồn kho, Chuyển kho & Nhập hàng)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietInventoryController {

  @ApiOperation({
    summary: '[Inventory - Tồn kho] [POST /products/inventories] Cập nhật số lượng tồn kho thực tế',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Inventory] Endpoint gốc: POST https://public.kiotapi.com/products/inventories | Cập nhật số lượng tồn kho khả dụng cho sản phẩm tại chi nhánh',
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
    summary: '[Inventory - Tồn kho] [GET /inventory] Báo cáo số dư tồn kho chi nhánh',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Inventory] Endpoint gốc: GET https://public.kiotapi.com/inventory | Tra cứu số lượng tồn kho thực tế, tạm giữ và có thể bán theo từng chi nhánh',
  })
  @ApiQuery({ name: 'branchId', example: 101, required: false })
  @Get('inventory')
  async getInventoryReport(@Query('branchId') branchId: number = 101) {
    return {
      total: 2,
      data: [
        { productId: 801, productCode: 'KV-SP-01', branchId, onHand: 120, reserved: 2, cost: 90000 },
        { productId: 802, productCode: 'KV-SP-02', branchId, onHand: 350, reserved: 0, cost: 25000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Stocktake - Kiểm kê xuất hủy] [POST /damageitems] Lập phiếu kiểm kê & xuất hủy kho',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Stocktake] Endpoint gốc: POST https://public.kiotapi.com/damageitems | Lập phiếu kiểm kho cân bằng số lượng tồn thực tế với tồn sổ sách hoặc xuất hủy hàng hỏng',
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
    summary: '[Stocktake - Kiểm kê xuất hủy] [GET /damageitems] Danh sách phiếu kiểm kê / xuất hủy',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Stocktake] Endpoint gốc: GET https://public.kiotapi.com/damageitems | Tra cứu danh sách các đợt kiểm kê cân bằng kho',
  })
  @ApiQuery({ name: 'branchId', example: 101, required: false })
  @Get('damageitems')
  async listDamageItems(@Query('branchId') branchId: number = 101) {
    return {
      total: 1,
      data: [{ id: 701, code: 'PKK202610-01', branchId, description: 'Kiểm kê định kỳ tháng 10/2026', createdDate: new Date().toISOString() }],
    };
  }

  @ApiOperation({
    summary: '[Stocktake - Kiểm kê xuất hủy] [GET /damageitems/:id] Chi tiết phiếu kiểm kê',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Stocktake] Endpoint gốc: GET https://public.kiotapi.com/damageitems/{id} | Chi tiết phiếu kiểm kê hàng tồn kho theo ID',
  })
  @ApiParam({ name: 'id', example: '701' })
  @Get('damageitems/:id')
  async getDamageItemById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: { id: Number(id), code: `PKK000${id}`, status: 'Đã cân bằng kho', itemsCount: 15 },
    };
  }

  @ApiOperation({
    summary: '[Transfer - Chuyển hàng nội bộ] [POST /transfers] Tạo phiếu chuyển hàng giữa các chi nhánh',
    description: '[Thuộc danh mục: 2.16. Chuyển hàng > Transfer] Endpoint gốc: POST https://public.kiotapi.com/transfers | Điều chuyển hàng hóa nội bộ giữa các cửa hàng trong chuỗi',
  })
  @ApiBody({ type: KiotVietTransferStockDto })
  @Post('transfers')
  async createTransfer(@Body() dto: KiotVietTransferStockDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        transferCode: `CK${Date.now().toString().slice(-8)}`,
        fromBranchId: dto.fromBranchId,
        toBranchId: dto.toBranchId,
        status: 2,
        statusValue: 'Đang chuyển hàng',
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Transfer - Chuyển hàng nội bộ] [GET /transfers] Danh sách phiếu chuyển hàng KiotViet',
    description: '[Thuộc danh mục: 2.16. Chuyển hàng > Transfer] Endpoint gốc: GET https://public.kiotapi.com/transfers | Danh sách các đợt chuyển hàng nội bộ',
  })
  @ApiQuery({ name: 'pageSize', example: 20, required: false })
  @Get('transfers')
  async listTransfers(@Query('pageSize') pageSize: number = 20) {
    return {
      total: 1,
      data: [
        { id: 901, code: 'CK000901', fromBranchId: 101, toBranchId: 102, statusValue: 'Đang chuyển hàng', createdDate: new Date().toISOString() },
      ],
    };
  }

  @ApiOperation({
    summary: '[Transfer - Chuyển hàng nội bộ] [GET /transfers/:id] Chi tiết phiếu chuyển hàng theo ID',
    description: '[Thuộc danh mục: 2.16. Chuyển hàng > Transfer] Endpoint gốc: GET https://public.kiotapi.com/transfers/{id} | Chi tiết phiếu điều chuyển hàng và số lượng xuất/nhận',
  })
  @ApiParam({ name: 'id', example: '901' })
  @Get('transfers/:id')
  async getTransferById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: {
        id: Number(id),
        code: `CK000${id}`,
        fromBranchId: 101,
        toBranchId: 102,
        transferDetails: [{ productId: 801, productCode: 'KV-SP-01', sendQuantity: 30, receiveQuantity: 0 }],
      },
    };
  }

  @ApiOperation({
    summary: '[Transfer - Chuyển hàng nội bộ] [PUT /transfers/:id] Cập nhật phiếu chuyển hàng',
    description: '[Thuộc danh mục: 2.16. Chuyển hàng > Transfer] Endpoint gốc: PUT https://public.kiotapi.com/transfers/{id} | Cập nhật số lượng nhận hàng hoặc trạng thái hoàn tất chuyển',
  })
  @ApiParam({ name: 'id', example: '901' })
  @ApiBody({ type: KiotVietUpdateTransferDto })
  @Put('transfers/:id')
  async updateTransfer(@Param('id') id: string, @Body() body: KiotVietUpdateTransferDto) {
    return { responseStatus: 'success', data: { id: Number(id), status: body.status, note: body.note, updated: true } };
  }

  @ApiOperation({
    summary: '[Transfer - Chuyển hàng nội bộ] [DELETE /transfers/:id] Xóa / Hủy phiếu chuyển hàng',
    description: '[Thuộc danh mục: 2.16. Chuyển hàng > Transfer] Endpoint gốc: DELETE https://public.kiotapi.com/transfers/{id} | Hủy bỏ phiếu chuyển hàng chưa xuất kho',
  })
  @ApiParam({ name: 'id', example: '901' })
  @Delete('transfers/:id')
  async deleteTransfer(@Param('id') id: string) {
    return { responseStatus: 'success', message: `Xóa phiếu chuyển hàng #${id} thành công` };
  }

  @ApiOperation({
    summary: '[Purchase Order - Nhập hàng NCC] [POST /purchaseorders] Lập phiếu nhập hàng nhà cung cấp',
    description: '[Thuộc danh mục: 2.15. Nhập hàng > Purchase Order] Endpoint gốc: POST https://public.kiotapi.com/purchaseorders | Tạo phiếu nhập hàng từ nhà phân phối vào kho KiotViet',
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

  @ApiOperation({
    summary: '[Purchase Order - Nhập hàng NCC] [GET /purchaseorders] Danh sách phiếu nhập hàng KiotViet',
    description: '[Thuộc danh mục: 2.15. Nhập hàng > Purchase Order] Endpoint gốc: GET https://public.kiotapi.com/purchaseorders | Danh sách phiếu nhập mua hàng từ các nhà cung cấp',
  })
  @ApiQuery({ name: 'branchId', example: 101, required: false })
  @Get('purchaseorders')
  async listPurchaseOrders(@Query('branchId') branchId: number = 101) {
    return {
      total: 1,
      data: [
        { id: 601, code: 'PN000601', supplierName: 'Công ty Thiết Bị Số', totalAmount: 9500000, status: 'Đã nhập kho' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Purchase Order - Nhập hàng NCC] [GET /purchaseorders/:id] Chi tiết phiếu nhập hàng theo ID',
    description: '[Thuộc danh mục: 2.15. Nhập hàng > Purchase Order] Endpoint gốc: GET https://public.kiotapi.com/purchaseorders/{id} | Xem chi tiết mặt hàng, giá nhập và hạn sử dụng theo lô',
  })
  @ApiParam({ name: 'id', example: '601' })
  @Get('purchaseorders/:id')
  async getPurchaseOrderById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: {
        id: Number(id),
        code: `PN000${id}`,
        supplierName: 'Công ty Thiết Bị Số',
        purchaseDetails: [{ productId: 801, quantity: 100, price: 95000 }],
      },
    };
  }

  @ApiOperation({
    summary: '[Purchase Order - Nhập hàng NCC] [PUT /purchaseorders/:id] Cập nhật phiếu nhập hàng',
    description: '[Thuộc danh mục: 2.15. Nhập hàng > Purchase Order] Endpoint gốc: PUT https://public.kiotapi.com/purchaseorders/{id} | Cập nhật thông tin chi tiết phiếu nhập mua',
  })
  @ApiParam({ name: 'id', example: '601' })
  @ApiBody({ type: KiotVietUpdatePurchaseOrderDto })
  @Put('purchaseorders/:id')
  async updatePurchaseOrder(@Param('id') id: string, @Body() body: KiotVietUpdatePurchaseOrderDto) {
    return { responseStatus: 'success', data: { id: Number(id), status: body.status, note: body.note, updated: true } };
  }

  @ApiOperation({
    summary: '[Purchase Order - Nhập hàng NCC] [DELETE /purchaseorders/:id] Xóa phiếu nhập hàng KiotViet',
    description: '[Thuộc danh mục: 2.15. Nhập hàng > Purchase Order] Endpoint gốc: DELETE https://public.kiotapi.com/purchaseorders?id={id}&IsVoidPayment=true | Hủy phiếu nhập hàng và hoàn trả tồn kho',
  })
  @ApiParam({ name: 'id', example: '601' })
  @ApiQuery({ name: 'IsVoidPayment', required: false, example: true })
  @Delete('purchaseorders/:id')
  async deletePurchaseOrder(@Param('id') id: string, @Query('IsVoidPayment') isVoid: boolean = true) {
    return { responseStatus: 'success', message: 'Xóa dữ liệu thành công' };
  }
}
