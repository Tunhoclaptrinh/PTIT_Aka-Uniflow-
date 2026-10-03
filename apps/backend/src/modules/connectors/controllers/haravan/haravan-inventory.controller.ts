import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanAdjustStockDto,
  HaravanSetInventoryLevelDto,
  HaravanTransferStockDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 12. INVENTORY LEVEL RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 12. InventoryLevel')
@Controller('api/v1/infra/haravan')
export class HaravanInventoryLevelsController {
  @ApiOperation({
    summary: '[POST /com/inventory_levels/adjust.json] Điều chỉnh tăng/giảm tồn kho',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/inventory_levels/adjust.json | Docs: https://docs.haravan.com/docs/omni-apis/inventory-adjustment/ | Tăng hoặc giảm số lượng tồn kho khả dụng tại một chi nhánh kho',
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
    summary: '[POST /com/inventory_levels/set.json] Cài đặt số lượng tồn kho cố định',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/inventory_levels/set.json | Đặt số lượng tồn kho chính xác sau khi kiểm kê thực tế',
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
    summary: '[GET /com/inventory_levels.json] Tra cứu tồn kho theo kho hoặc biến thể',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/inventory_levels.json | Báo cáo số lượng tồn kho thực tế',
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
    summary: '[POST /com/inventory_levels/connect.json] Kết nối biến thể với kho hàng',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/inventory_levels/connect.json | Khởi tạo theo dõi tồn kho của sản phẩm tại một địa điểm kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ schema: { example: { location_id: 1024, variant_id: 881294 } } })
  @Post('com/inventory_levels/connect.json')
  async connectInventoryLevel(@Body() body: { location_id: number; variant_id: number }, @Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_level: { location_id: body.location_id, variant_id: body.variant_id, available: 0, mode: mode || 'SANDBOX' },
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 13. LOCATION RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 13. Location')
@Controller('api/v1/infra/haravan')
export class HaravanLocationsController {
  @ApiOperation({
    summary: '[GET /com/locations.json] Danh sách chi nhánh & kho hàng Haravan',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/locations.json | Docs: https://docs.haravan.com/docs/omni-apis/locations/ | Lấy danh mục tất cả địa điểm kho và cửa hàng',
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
    summary: '[GET /com/locations/:id.json] Chi tiết địa điểm kho hàng',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/locations/{id}.json | Xem thông tin chi nhánh cửa hàng hoặc kho',
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
    summary: '[GET /com/locations/count.json] Đếm số lượng kho bãi',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/locations/count.json | Tổng số địa điểm đang kích hoạt trên hệ thống',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/locations/count.json')
  async countLocations(@Headers('x-uniflow-mode') mode?: string) {
    return { count: 6, mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 14. INVENTORY ADJUSTMENT & TRANSFERS RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 14. InventoryAdjustment')
@Controller('api/v1/infra/haravan')
export class HaravanInventoryAdjustmentsController {
  @ApiOperation({
    summary: '[POST /com/inventory_adjustments.json] Lập phiếu điều chỉnh tồn kho',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/inventory_adjustments.json | Ghi nhận thay đổi số lượng tồn kho kèm lý do',
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
    summary: '[GET /com/inventory_adjustments.json] Lịch sử điều chỉnh tồn kho',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/inventory_adjustments.json | Xem nhật ký các đợt tăng giảm kho',
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
    summary: '[POST /com/inventory_transfers.json] Lập phiếu điều chuyển kho nội bộ',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/inventory_transfers.json | Điều chuyển hàng hóa giữa kho nguồn và kho đích',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanTransferStockDto })
  @Post('com/inventory_transfers.json')
  async transferStock(@Body() dto: HaravanTransferStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      inventory_transfer: {
        id: Date.now(),
        from_location_id: dto.from_location_id,
        to_location_id: dto.to_location_id,
        line_items: dto.line_items,
        status: 'pending',
        created_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }
}
