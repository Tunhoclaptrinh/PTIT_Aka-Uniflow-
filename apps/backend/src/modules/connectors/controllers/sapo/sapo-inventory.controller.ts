import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  SapoAdjustStockDto,
  SapoTransferStockDto,
} from '../../dto/pos-sapo.dto';

// ── 1. InventoryLevel Resource ──
@ApiTags('[02. POS-Sapo] 11. InventoryLevel')
@Controller('api/v1/infra/sapo')
export class SapoInventoryLevelsController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /admin/inventory_levels/adjust.json] Điều chỉnh tồn kho Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/inventory_levels/adjust.json | Docs: https://support.sapo.vn/gioi-thieu-api | Cập nhật tăng/giảm số lượng tồn khả dụng cho biến thể tại một kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoAdjustStockDto })
  @Post('admin/inventory_levels/adjust.json')
  async adjustStock(@Body() dto: SapoAdjustStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_adjust_stock', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /admin/inventory_levels/set.json] Cài đặt mức tồn kho cố định',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/inventory_levels/set.json | Đặt chính xác số lượng tồn kho (bỏ qua lịch sử tính tăng/giảm)',
  })
  @Post('admin/inventory_levels/set.json')
  async setStock(@Body('location_id') locationId: number, @Body('inventory_item_id') inventoryItemId: number, @Body('available') available: number) {
    return {
      inventory_level: { location_id: locationId, inventory_item_id: inventoryItemId, available, updated_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[GET /admin/inventory_levels.json] Báo cáo mức tồn kho theo kho',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/inventory_levels.json | Tra cứu mức tồn kho thực tế của các mặt hàng',
  })
  @Get('admin/inventory_levels.json')
  async listInventoryLevels(@Query('location_ids') locationIds?: string) {
    return {
      inventory_levels: [
        { location_id: 101, inventory_item_id: 5001, available: 125 },
        { location_id: 102, inventory_item_id: 5001, available: 42 },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /admin/inventory_transfers.json] Tạo phiếu chuyển kho nội bộ Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/inventory_transfers.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tạo lệnh điều chuyển hàng hóa giữa các kho nội bộ Sapo',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoTransferStockDto })
  @Post('admin/inventory_transfers.json')
  async transferStock(@Body() dto: SapoTransferStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_transfer_stock', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /admin/inventory_transfers/:id/receive.json] Xác nhận nhận hàng chuyển kho Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/inventory_transfers/{id}/receive.json | Kho đích xác nhận đã nhận đủ hàng và nhập kho',
  })
  @Post('admin/inventory_transfers/:id/receive.json')
  async receiveTransfer(@Param('id') id: string) {
    return { success: true, transfer_id: id, status: 'received', received_at: new Date().toISOString() };
  }
}

// ── 2. Location Resource ──
@ApiTags('[02. POS-Sapo] 12. Location')
@Controller('api/v1/infra/sapo')
export class SapoLocationsController {
  @ApiOperation({
    summary: '[GET /admin/locations.json] Danh sách điểm kho & chi nhánh Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/locations.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tra cứu toàn bộ danh sách chi nhánh cửa hàng và kho hàng Sapo',
  })
  @Get('admin/locations.json')
  async listLocations() {
    return {
      locations: [
        { id: 101, name: 'Chi nhánh Hà Nội - Cầu Giấy', address: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội', is_primary: true },
        { id: 102, name: 'Chi nhánh TP.HCM - Q.1', address: '45 Nguyễn Thị Minh Khai, Q.1, TP.HCM', is_primary: false },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /admin/locations/:id.json] Chi tiết chi nhánh kho',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/locations/{id}.json | Lấy thông tin chi tiết một điểm kho',
  })
  @Get('admin/locations/:id.json')
  async getLocationById(@Param('id') id: string) {
    return {
      location: { id: Number(id), name: 'Chi nhánh Hà Nội - Cầu Giấy', address: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội', active: true },
    };
  }
}
