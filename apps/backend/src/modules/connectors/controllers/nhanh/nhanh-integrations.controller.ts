import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  NhanhSendZnsDto,
  NhanhEcomSyncStockDto,
  NhanhEcomSyncOrderDto,
} from '../../dto/pos-nhanh.dto';

@ApiTags('[02. POS-Nhanh] 10. Zalo & Đồng bộ sàn (Zalo & Ecom)')
@Controller('api/v1/infra/nhanh')
export class NhanhIntegrationsController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /api/zalo/send-zns] Gửi tin thông báo Zalo ZNS Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/zalo/send-zns | Docs: https://developers.nhanh.group/pos/zalo/send-zns | Gửi tin thông báo CSKH tự động qua Zalo ZNS Official Account',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: NhanhSendZnsDto })
  @Post('api/zalo/send-zns')
  async sendZns(@Body() dto: NhanhSendZnsDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_send_zns', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /api/ecom/sync-stock] Đồng bộ tồn kho sàn TMĐT qua Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/ecom/sync-stock | Docs: https://developers.nhanh.group/pos/ecom/sync-stock | Đẩy tồn kho tức thời từ Nhanh.vn lên Shopee, TikTok Shop, Lazada',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: NhanhEcomSyncStockDto })
  @Post('api/ecom/sync-stock')
  async ecomSyncStock(@Body() dto: NhanhEcomSyncStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_sync_ecom_stock', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /api/ecom/sync-order] Kéo đơn hàng từ sàn TMĐT về Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/ecom/sync-order | Docs: https://developers.nhanh.group/pos/ecom/sync-order | Đồng bộ đơn hàng phát sinh từ sàn vào hệ thống xử lý tập trung',
  })
  @ApiBody({ type: NhanhEcomSyncOrderDto })
  @Post('api/ecom/sync-order')
  async ecomSyncOrder(@Body() dto: NhanhEcomSyncOrderDto) {
    return {
      code: 1,
      data: {
        internalOrderId: Date.now().toString().slice(-6),
        marketplace: dto.marketplace,
        marketplaceOrderId: dto.marketplaceOrderId,
        status: 'IMPORTED',
        imported_at: new Date().toISOString(),
      },
    };
  }
}
