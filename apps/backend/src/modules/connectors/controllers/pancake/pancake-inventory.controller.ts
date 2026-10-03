import { Controller, Post, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  PancakeSyncInventoryDto,
  PancakePosCreateWarehouseDto,
  PancakePosCreateTransferDto,
  PancakePosCreateStocktakingDto,
  PancakePosCreateExportDto,
} from '../../dto/pos-pancake.dto';

@ApiTags('[POS-Pancake] 05. Inventory, Warehouse & Transfers (Kho bãi, Tồn kho & Chuyển kho)')
@Controller('api/v1/infra/pancake')
export class PancakeInventoryController {

  @ApiOperation({
    summary: '[Warehouse - Danh sách kho] [GET /shops/:shopId/warehouses] Danh sách các kho hàng Pancake POS',
    description: '[Thuộc danh mục: 3. Warehouse > Danh sách kho] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/warehouses | Docs: https://docs.pancake.biz/pos/api/ | Tra cứu danh sách địa điểm kho bãi',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/warehouses')
  async listWarehousesOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      warehouses: [
        { id: 1, name: 'Kho Tổng Cầu Giấy', address: 'Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội', is_default: true },
        { id: 2, name: 'Kho Chi Nhánh TP.HCM', address: 'Quận 1, TP. Hồ Chí Minh', is_default: false },
      ],
    };
  }

  @ApiOperation({
    summary: '[Warehouse - Tạo kho mới] [POST /shops/:shopId/warehouses] Khởi tạo kho hàng mới',
    description: '[Thuộc danh mục: 3. Warehouse > Tạo kho] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/warehouses | Thêm địa điểm kho lưu trữ hàng hóa',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateWarehouseDto })
  @Post('shops/:shopId/warehouses')
  async createWarehouseOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosCreateWarehouseDto) {
    return {
      success: true,
      shop_id: shopId,
      warehouse: { id: Date.now(), ...dto, is_default: false },
    };
  }

  @ApiOperation({
    summary: '[Warehouse - Cập nhật kho] [PUT /shops/:shopId/warehouses/:warehouseId] Sửa thông tin kho hàng',
    description: '[Thuộc danh mục: 3. Warehouse > Sửa kho] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID}/warehouses/{WAREHOUSE_ID} | Cập nhật địa chỉ hoặc số điện thoại kho',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'warehouseId', example: '1' })
  @Put('shops/:shopId/warehouses/:warehouseId')
  async updateWarehouseOfficial(@Param('shopId') shopId: string, @Param('warehouseId') warehouseId: string, @Body() body: any) {
    return {
      success: true,
      shop_id: shopId,
      warehouse_id: Number(warehouseId),
      ...body,
      updated_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Inventory - Lịch sử tồn kho] [GET /shops/:shopId/inventory_histories] Nhật ký biến động tồn kho',
    description: '[Thuộc danh mục: 3. Warehouse > Biến động tồn] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/inventory_histories | Tra cứu lịch sử nhập xuất tồn kho',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/inventory_histories')
  async listInventoryHistoriesOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      histories: [
        { id: 1, variation_id: 'VAR_1001', change_quantity: -1, reason: 'Xuất bán đơn #ORD_PC_9912', created_at: new Date().toISOString() },
      ],
    };
  }

  @ApiOperation({
    summary: '[Transfer - Danh sách chuyển kho] [GET /shops/:shopId/transfers] Danh sách phiếu chuyển kho',
    description: '[Thuộc danh mục: 20. Warehouse Transfer > Danh sách chuyển] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/transfers | Tra cứu các phiếu luân chuyển hàng hóa',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/transfers')
  async listTransfersOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      transfers: [
        { id: 1, transfer_code: 'CK_0001', from_warehouse: 'Kho Tổng Hà Nội', to_warehouse: 'Kho TP.HCM', status: 'shipping' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Transfer - Tạo phiếu chuyển kho] [POST /shops/:shopId/transfers/multi] Tạo phiếu điều chuyển kho hàng loạt',
    description: '[Thuộc danh mục: 20. Warehouse Transfer > Tạo phiếu chuyển] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/transfers/multi | Lập lệnh chuyển hàng giữa các chi nhánh',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateTransferDto })
  @Post('shops/:shopId/transfers/multi')
  async createTransferOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosCreateTransferDto) {
    return {
      success: true,
      shop_id: shopId,
      transfer: { id: Date.now(), transfer_code: `CK_${Date.now().toString().slice(-6)}`, ...dto, status: 'pending' },
    };
  }

  @ApiOperation({
    summary: '[Transfer - Sửa phiếu chuyển kho] [PUT /shops/:shopId/transfers/:transferId] Cập nhật trạng thái phiếu chuyển',
    description: '[Thuộc danh mục: 20. Warehouse Transfer > Sửa phiếu chuyển] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID}/transfers/{TRANSFER_ID} | Xác nhận xuất kho hoặc nhập kho chuyển đến',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'transferId', example: '1' })
  @Put('shops/:shopId/transfers/:transferId')
  async updateTransferOfficial(@Param('shopId') shopId: string, @Param('transferId') transferId: string, @Body() body: any) {
    return {
      success: true,
      transfer_id: Number(transferId),
      status: body.status || 'received',
      updated_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Transfer - Lịch sử trạng thái] [GET /shops/:shopId/transfers/get_status_history/:transferId] Lịch sử trạng thái chuyển kho',
    description: '[Thuộc danh mục: 20. Warehouse Transfer > Lịch sử trạng thái] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/transfers/get_status_history/{TRANSFER_ID}',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'transferId', example: '1' })
  @Get('shops/:shopId/transfers/get_status_history/:transferId')
  async getTransferStatusHistoryOfficial(@Param('shopId') shopId: string, @Param('transferId') transferId: string) {
    return {
      success: true,
      transfer_id: Number(transferId),
      history: [
        { status: 'created', time: '2026-10-04T00:00:00Z', note: 'Tạo phiếu' },
        { status: 'shipping', time: '2026-10-04T01:00:00Z', note: 'Xuất kho vận chuyển' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Stocktaking - Danh sách kiểm kê] [GET /shops/:shopId/stocktakings] Danh sách phiếu kiểm kho',
    description: '[Thuộc danh mục: 21. Stocktaking > Danh sách kiểm kê] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/stocktakings | Danh sách các đợt kiểm đếm kho',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/stocktakings')
  async listStocktakingsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      stocktakings: [
        { id: 1, code: 'KK_001', warehouse_id: 1, status: 'completed', note: 'Kiểm kê định kỳ tháng 10' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Stocktaking - Tạo phiếu kiểm kê] [POST /shops/:shopId/stocktakings] Tạo phiếu kiểm kê kho',
    description: '[Thuộc danh mục: 21. Stocktaking > Tạo phiếu kiểm kê] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/stocktakings | Khởi tạo phiếu kiểm đếm tồn thực tế',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateStocktakingDto })
  @Post('shops/:shopId/stocktakings')
  async createStocktakingOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosCreateStocktakingDto) {
    return {
      success: true,
      shop_id: shopId,
      stocktaking: { id: Date.now(), code: `KK_${Date.now().toString().slice(-6)}`, ...dto, status: 'draft' },
    };
  }

  @ApiOperation({
    summary: '[Stocktaking - Chi tiết phiếu kiểm kê] [GET /shops/:shopId/stocktakings/:stocktakingId] Chi tiết phiếu kiểm kê kho',
    description: '[Thuộc danh mục: 21. Stocktaking > Chi tiết kiểm kê] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/stocktakings/{STOCKTAKING_ID}',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'stocktakingId', example: '1' })
  @Get('shops/:shopId/stocktakings/:stocktakingId')
  async getStocktakingOfficial(@Param('shopId') shopId: string, @Param('stocktakingId') stocktakingId: string) {
    return {
      success: true,
      stocktaking: {
        id: Number(stocktakingId),
        code: `KK_00${stocktakingId}`,
        items: [{ variation_id: 'VAR_1001', actual_quantity: 48, system_quantity: 50, diff: -2 }],
        status: 'completed',
      },
    };
  }

  @ApiOperation({
    summary: '[Stocktaking - Sửa phiếu kiểm kê] [PUT /shops/:shopId/stocktakings/:stocktakingId] Cập nhật phiếu kiểm kê kho',
    description: '[Thuộc danh mục: 21. Stocktaking > Sửa kiểm kê] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID}/stocktakings/{STOCKTAKING_ID} | Cân bằng kho hoặc cập nhật số liệu kiểm đếm',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'stocktakingId', example: '1' })
  @Put('shops/:shopId/stocktakings/:stocktakingId')
  async updateStocktakingOfficial(@Param('shopId') shopId: string, @Param('stocktakingId') stocktakingId: string, @Body() body: any) {
    return {
      success: true,
      stocktaking_id: Number(stocktakingId),
      status: body.status || 'balanced',
      updated_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Export - Danh sách xuất kho khác] [GET /shops/:shopId/export] Danh sách phiếu xuất kho khác',
    description: '[Thuộc danh mục: 19. Export > Danh sách xuất] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/export | Xuất hàng hỏng, hàng tiêu hao nội bộ, hàng tặng',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/export')
  async listExportsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      exports: [
        { id: 1, export_code: 'XK_001', reason: 'Xuất hàng hỏng', status: 'completed' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Export - Tạo phiếu xuất kho] [POST /shops/:shopId/export] Tạo phiếu xuất kho khác',
    description: '[Thuộc danh mục: 19. Export > Tạo phiếu xuất] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/export | Khởi tạo phiếu xuất hàng',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateExportDto })
  @Post('shops/:shopId/export')
  async createExportOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosCreateExportDto) {
    return {
      success: true,
      shop_id: shopId,
      export: { id: Date.now(), export_code: `XK_${Date.now().toString().slice(-6)}`, ...dto, status: 'completed' },
    };
  }

  @ApiOperation({
    summary: '[Export - Sửa phiếu xuất kho] [PUT /shops/:shopId/export/:exportId] Cập nhật phiếu xuất kho',
    description: '[Thuộc danh mục: 19. Export > Sửa phiếu xuất] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID}/export/{EXPORT_ID}',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'exportId', example: '1' })
  @Put('shops/:shopId/export/:exportId')
  async updateExportOfficial(@Param('shopId') shopId: string, @Param('exportId') exportId: string, @Body() body: any) {
    return {
      success: true,
      export_id: Number(exportId),
      ...body,
      updated_at: new Date().toISOString(),
    };
  }

  // ════════════════════════════════════════════════════════════════
  // BACKWARD COMPATIBILITY
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({ summary: '[Inventory - Đồng bộ tồn kho rút gọn] [POST /inventory/sync] Đồng bộ tồn kho Pancake Store', description: 'Cân bằng số lượng tồn kho sản phẩm trên hệ thống bán hàng Pancake Store' })
  @Post('inventory/sync')
  async syncInventory(@Body() dto: PancakeSyncInventoryDto) {
    return {
      success: true,
      page_id: dto.page_id,
      sku: dto.sku,
      quantity: dto.quantity,
      updated_at: new Date().toISOString(),
    };
  }
}
