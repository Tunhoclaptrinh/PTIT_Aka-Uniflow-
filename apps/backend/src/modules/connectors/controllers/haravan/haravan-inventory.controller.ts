import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanAdjustStockDto,
  HaravanSetInventoryLevelDto,
  HaravanTransferStockDto,
  HaravanInventoryTransferDto,
  HaravanPurchaseOrderDto,
  HaravanPurchaseReceiveDto,
  HaravanConnectInventoryDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 3. INVENTORY CATEGORY (InventoryLevel, Location, Adjustment, Transfer, PO, Receive)
// ═══════════════════════════════════════════════════════════════

@ApiTags('[02. POS-Haravan] 03. Inventory (Tồn kho, Địa điểm, Điều chuyển & Nhập mua)')
@Controller('api/v1/infra/haravan')
export class HaravanInventoryLevelsController {
  @ApiOperation({
    summary: '[Inventory Level - Mức tồn kho] [POST /com/inventory_levels/adjust.json] Điều chỉnh tăng/giảm tồn kho',
    description: '[Thuộc danh mục: 03. Inventory > Mức tồn kho] Endpoint gốc: POST https://apis.haravan.com/com/inventory_levels/adjust.json | Tăng hoặc giảm số lượng tồn kho khả dụng tại một chi nhánh kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanAdjustStockDto })
  @Post('com/inventory_levels/adjust.json')
  async adjustInventoryLevel(@Body() dto: HaravanAdjustStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_level: {
        location_id: dto.location_id,
        variant_id: dto.variant_id,
        available: 70,
        adjustment: dto.adjustment || 30,
        updated_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Inventory Level - Mức tồn kho] [POST /com/inventory_levels/set.json] Cài đặt số lượng tồn kho cố định',
    description: '[Thuộc danh mục: 03. Inventory > Mức tồn kho] Endpoint gốc: POST https://apis.haravan.com/com/inventory_levels/set.json | Đặt số lượng tồn kho chính xác sau khi kiểm kê thực tế',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanSetInventoryLevelDto })
  @Post('com/inventory_levels/set.json')
  async setInventoryLevel(@Body() dto: HaravanSetInventoryLevelDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_level: {
        location_id: dto.location_id,
        variant_id: dto.variant_id,
        available: dto.available,
        updated_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Inventory Level - Mức tồn kho] [GET /com/inventory_levels.json] Tra cứu tồn kho theo kho hoặc biến thể',
    description: '[Thuộc danh mục: 03. Inventory > Mức tồn kho] Endpoint gốc: GET https://apis.haravan.com/com/inventory_levels.json | Báo cáo số lượng tồn kho thực tế',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiQuery({ name: 'location_ids', example: '1024', required: false })
  @ApiQuery({ name: 'variant_ids', example: '881294', required: false })
  @Get('com/inventory_levels.json')
  async listInventoryLevels(@Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_levels: [
        { location_id: 1024, variant_id: 881294, available: 40, updated_at: new Date().toISOString() },
        { location_id: 1024, variant_id: 881295, available: 60, updated_at: new Date().toISOString() },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Connect Inventory - Kích hoạt quản lý] [POST /com/inventory_levels/connect.json] Kết nối biến thể với kho hàng',
    description: '[Thuộc danh mục: 03. Inventory > Kích hoạt quản lý tồn] Endpoint gốc: POST https://apis.haravan.com/com/inventory_levels/connect.json | Khởi tạo theo dõi tồn kho của sản phẩm tại một địa điểm kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanConnectInventoryDto })
  @Post('com/inventory_levels/connect.json')
  async connectInventoryLevel(@Body() body: HaravanConnectInventoryDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_level: { location_id: body.location_id, variant_id: body.variant_id, available: 0, mode: mode || 'SANDBOX' },
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// LOCATIONS SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[02. POS-Haravan] 03. Inventory (Tồn kho, Địa điểm, Điều chuyển & Nhập mua)')
@Controller('api/v1/infra/haravan')
export class HaravanLocationsController {
  @ApiOperation({
    summary: '[Location - Địa điểm kho] [GET /com/locations.json] Danh sách chi nhánh & kho hàng Haravan',
    description: '[Thuộc danh mục: 03. Inventory > Địa điểm kho bãi] Endpoint gốc: GET https://apis.haravan.com/com/locations.json | Lấy danh mục tất cả địa điểm kho và cửa hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/locations.json')
  async listLocations(@Headers('x-uniflow-mode') mode?: string) {
    return {
      locations: [
        { id: 1024, name: 'Tổng kho Haravan Tân Bình', address1: '100 Cộng Hòa, Tân Bình, TP.HCM', country_code: 'VN', active: true },
        { id: 1025, name: 'Cửa hàng Haravan Flagship Hà Nội', address1: '50 Hai Bà Trưng, Hoàn Kiếm, Hà Nội', country_code: 'VN', active: true },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Location - Địa điểm kho] [GET /com/locations/:id.json] Chi tiết địa điểm kho hàng',
    description: '[Thuộc danh mục: 03. Inventory > Địa điểm kho bãi] Endpoint gốc: GET https://apis.haravan.com/com/locations/{id}.json | Xem thông tin chi nhánh cửa hàng hoặc kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '1024' })
  @Get('com/locations/:id.json')
  async getLocationById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      location: {
        id: Number(id),
        name: 'Tổng kho Haravan Tân Bình',
        address1: '100 Cộng Hòa, Phường 4, Quận Tân Bình',
        city: 'Hồ Chí Minh',
        country: 'Vietnam',
        country_code: 'VN',
        active: true,
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Location - Địa điểm kho] [GET /com/locations/count.json] Đếm số lượng kho bãi',
    description: '[Thuộc danh mục: 03. Inventory > Địa điểm kho bãi] Endpoint gốc: GET https://apis.haravan.com/com/locations/count.json | Tổng số địa điểm đang kích hoạt trên hệ thống',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/locations/count.json')
  async countLocations(@Headers('x-uniflow-mode') mode?: string) {
    return { count: 6, mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// INVENTORY ADJUSTMENT, TRANSFERS & PURCHASES
// ═══════════════════════════════════════════════════════════════

@ApiTags('[02. POS-Haravan] 03. Inventory (Tồn kho, Địa điểm, Điều chuyển & Nhập mua)')
@Controller('api/v1/infra/haravan')
export class HaravanInventoryAdjustmentsController {
  @ApiOperation({
    summary: '[Inventory Adjustment - Phiếu điều chỉnh] [POST /com/inventory_adjustments.json] Lập phiếu điều chỉnh tồn kho',
    description: '[Thuộc danh mục: 03. Inventory > Phiếu điều chỉnh kho] Endpoint gốc: POST https://apis.haravan.com/com/inventory_adjustments.json | Ghi nhận thay đổi số lượng tồn kho kèm lý do',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanAdjustStockDto })
  @Post('com/inventory_adjustments.json')
  async createAdjustment(@Body() dto: HaravanAdjustStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_adjustment: {
        id: Date.now(),
        location_id: dto.location_id,
        variant_id: dto.variant_id,
        adjustment: dto.adjustment || 30,
        available: 70,
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Inventory Adjustment - Phiếu điều chỉnh] [GET /com/inventory_adjustments.json] Lịch sử điều chỉnh tồn kho',
    description: '[Thuộc danh mục: 03. Inventory > Phiếu điều chỉnh kho] Endpoint gốc: GET https://apis.haravan.com/com/inventory_adjustments.json | Xem nhật ký các đợt tăng giảm kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/inventory_adjustments.json')
  async listAdjustments(@Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_adjustments: [
        { id: 7001, location_id: 1024, variant_id: 881294, adjustment: 30, available: 70, created_at: new Date().toISOString() },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Inventory Adjustment - Phiếu điều chỉnh] [GET /com/inventory_adjustments/:id.json] Chi tiết phiếu điều chỉnh tồn kho',
    description: '[Thuộc danh mục: 03. Inventory > Phiếu điều chỉnh kho] Endpoint gốc: GET https://apis.haravan.com/com/inventory_adjustments/{id}.json | Xem chi tiết phiếu cân chỉnh kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '7001' })
  @Get('com/inventory_adjustments/:id.json')
  async getAdjustmentById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_adjustment: { id: Number(id), location_id: 1024, variant_id: 881294, adjustment: 30, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Inventory Transfer - Điều chuyển kho] [POST /com/inventory_transfers.json] Lập phiếu điều chuyển kho nội bộ',
    description: '[Thuộc danh mục: 03. Inventory > Điều chuyển hàng giữa các kho] Endpoint gốc: POST https://apis.haravan.com/com/inventory_transfers.json | Điều chuyển hàng hóa giữa kho nguồn và kho đích',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanInventoryTransferDto })
  @Post('com/inventory_transfers.json')
  async transferStock(@Body() dto: HaravanInventoryTransferDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_transfer: {
        id: Date.now(),
        origin_location_id: dto.origin_location_id,
        destination_location_id: dto.destination_location_id,
        line_items: dto.line_items,
        status: 'pending',
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Inventory Transfer - Điều chuyển kho] [GET /com/inventory_transfers.json] Danh sách các phiếu điều chuyển kho',
    description: '[Thuộc danh mục: 03. Inventory > Điều chuyển hàng giữa các kho] Endpoint gốc: GET https://apis.haravan.com/com/inventory_transfers.json | Danh sách chuyển đổi vị trí hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/inventory_transfers.json')
  async listTransfers(@Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_transfers: [
        { id: 8001, origin_location_id: 1024, destination_location_id: 1025, status: 'completed', created_at: new Date().toISOString() },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Inventory Transfer - Điều chuyển kho] [GET /com/inventory_transfers/:id.json] Chi tiết phiếu điều chuyển kho',
    description: '[Thuộc danh mục: 03. Inventory > Điều chuyển hàng giữa các kho] Endpoint gốc: GET https://apis.haravan.com/com/inventory_transfers/{id}.json | Chi tiết danh sách mặt hàng chuyển kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '8001' })
  @Get('com/inventory_transfers/:id.json')
  async getTransferById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_transfer: { id: Number(id), origin_location_id: 1024, destination_location_id: 1025, status: 'completed', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Purchase Order - Đơn nhập mua] [POST /com/inventory_purchase_orders.json] Tạo đơn đặt hàng nhập kho (PO)',
    description: '[Thuộc danh mục: 03. Inventory > Đơn đặt hàng nhập mua NCC] Endpoint gốc: POST https://apis.haravan.com/com/inventory_purchase_orders.json | Lập đơn đặt hàng mua từ nhà cung cấp',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanPurchaseOrderDto })
  @Post('com/inventory_purchase_orders.json')
  async createPurchaseOrder(@Body() dto: HaravanPurchaseOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      purchase_order: {
        id: Date.now(),
        po_number: dto.po_number || `PO-${Date.now().toString().slice(-4)}`,
        supplier_id: dto.supplier_id,
        location_id: dto.location_id,
        status: 'ordered',
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Purchase Order - Đơn nhập mua] [GET /com/inventory_purchase_orders.json] Danh sách đơn đặt mua nhập kho',
    description: '[Thuộc danh mục: 03. Inventory > Đơn đặt hàng nhập mua NCC] Endpoint gốc: GET https://apis.haravan.com/com/inventory_purchase_orders.json | Tra cứu đơn PO nhập hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/inventory_purchase_orders.json')
  async listPurchaseOrders(@Headers('x-uniflow-mode') mode?: string) {
    return {
      purchase_orders: [
        { id: 9101, po_number: 'PO-2026-001', supplier_id: 501, status: 'ordered', created_at: new Date().toISOString() },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Purchase Order - Đơn nhập mua] [GET /com/inventory_purchase_orders/:id.json] Chi tiết đơn đặt mua nhập kho',
    description: '[Thuộc danh mục: 03. Inventory > Đơn đặt hàng nhập mua NCC] Endpoint gốc: GET https://apis.haravan.com/com/inventory_purchase_orders/{id}.json | Xem chi tiết đơn PO',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '9101' })
  @Get('com/inventory_purchase_orders/:id.json')
  async getPurchaseOrderById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      purchase_order: { id: Number(id), po_number: 'PO-2026-001', supplier_id: 501, status: 'ordered', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Purchase Receive - Phiếu nhận hàng] [POST /com/inventory_purchase_receives.json] Tạo phiếu nhập kho mua hàng',
    description: '[Thuộc danh mục: 03. Inventory > Phiếu nhận hàng nhập kho] Endpoint gốc: POST https://apis.haravan.com/com/inventory_purchase_receives.json | Ghi nhận hàng hóa thực tế đã nhập kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanPurchaseReceiveDto })
  @Post('com/inventory_purchase_receives.json')
  async createPurchaseReceive(@Body() dto: HaravanPurchaseReceiveDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      purchase_receive: {
        id: Date.now(),
        receive_number: `REC-${Date.now().toString().slice(-4)}`,
        ref_purchase_order_id: dto.ref_purchase_order_id,
        location_id: dto.location_id,
        status: 'received',
        received_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Purchase Receive - Phiếu nhận hàng] [GET /com/inventory_purchase_receives.json] Danh sách phiếu nhập kho',
    description: '[Thuộc danh mục: 03. Inventory > Phiếu nhận hàng nhập kho] Endpoint gốc: GET https://apis.haravan.com/com/inventory_purchase_receives.json | Tra cứu lịch sử nhập kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/inventory_purchase_receives.json')
  async listPurchaseReceives(@Headers('x-uniflow-mode') mode?: string) {
    return {
      purchase_receives: [
        { id: 9201, receive_number: 'REC-2026-001', location_id: 1024, status: 'received', received_at: new Date().toISOString() },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Location Balance - Cân đối tồn kho] [GET /com/inventory_location_balances.json] Báo cáo cân đối tồn kho theo vị trí',
    description: '[Thuộc danh mục: 03. Inventory > Cân đối tồn kho theo vị trí] Endpoint gốc: GET https://apis.haravan.com/com/inventory_location_balances.json | Tra cứu số dư tồn kho theo từng địa điểm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/inventory_location_balances.json')
  async listLocationBalances(@Headers('x-uniflow-mode') mode?: string) {
    return {
      location_balances: [
        { location_id: 1024, total_on_hand: 1250, total_available: 1180, total_committed: 70 },
      ],
      mode: mode || 'SANDBOX',
    };
  }
}
