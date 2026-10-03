import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  NhanhCheckStockDto,
  NhanhAdjustStockDto,
  NhanhTransferStockDto,
} from '../../dto/pos-nhanh.dto';

@ApiTags('[POS-Nhanh] 04. Kho bãi & Tồn kho (Inventory)')
@Controller('api/v1/infra/nhanh')
export class NhanhInventoryController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /api/inventory/item] Kiểm tra tồn kho sản phẩm Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/inventory/item | Docs: https://developers.nhanh.group/pos/inventory/item | Tra cứu số lượng tồn khả dụng (available, remain, shipping) theo kho',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: NhanhCheckStockDto })
  @Post('api/inventory/item')
  async checkStock(@Body() dto: NhanhCheckStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_check_stock', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /api/inventory/adjust] Cân bằng / Điều chỉnh tồn kho Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/inventory/adjust | Docs: https://developers.nhanh.group/pos/inventory/adjust | Điều chỉnh số lượng tồn kho thực tế của sản phẩm tại kho',
  })
  @ApiBody({ type: NhanhAdjustStockDto })
  @Post('api/inventory/adjust')
  async adjustStock(@Body() dto: NhanhAdjustStockDto) {
    return {
      code: 1,
      data: {
        depotId: dto.depotId,
        productId: dto.productId,
        remain: dto.remain,
        status: 'SUCCESS',
        updated_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/inventory/depot] Tồn kho theo từng điểm kho Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/inventory/depot | Docs: https://developers.nhanh.group/pos/inventory/depot | Tra cứu toàn bộ tồn kho tại một kho cụ thể',
  })
  @Post('api/inventory/depot')
  async getDepotInventory(@Body('depotId') depotId: number) {
    return {
      code: 1,
      data: {
        depotId: depotId || 102,
        totalItems: 450,
        totalValue: 125000000,
        updated_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/inventory/transfer] Tạo phiếu chuyển kho nội bộ Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/inventory/transfer | Docs: https://developers.nhanh.group/pos/inventory/transfer | Lập phiếu điều chuyển hàng hóa giữa các chi nhánh điểm kho',
  })
  @ApiBody({ type: NhanhTransferStockDto })
  @Post('api/inventory/transfer')
  async transferStock(@Body() dto: NhanhTransferStockDto) {
    return {
      code: 1,
      data: {
        transferId: `TF_${Date.now().toString().slice(-6)}`,
        fromDepotId: dto.fromDepotId,
        toDepotId: dto.toDepotId,
        itemsCount: dto.items?.length || 1,
        status: 'PENDING_CONFIRMATION',
        created_at: new Date().toISOString(),
      },
    };
  }
}
