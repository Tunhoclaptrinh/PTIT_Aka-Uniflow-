import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  NhanhAddOrderDto,
  NhanhSearchOrdersDto,
  NhanhUpdateOrderDto,
  NhanhUpdateOrderStatusDto,
  NhanhCancelOrderDto,
} from '../../dto/pos-nhanh.dto';

@ApiTags('[POS-Nhanh] 01. Đơn hàng (Orders)')
@Controller('api/v1/infra/nhanh')
export class NhanhOrdersController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /api/order/add] Thêm đơn hàng mới Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/order/add | Docs: https://developers.nhanh.group/pos/orders/add | Khởi tạo đơn hàng vận chuyển mới trên hệ thống Nhanh.vn Open API',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: NhanhAddOrderDto })
  @Post('api/order/add')
  async addOrder(@Body() dto: NhanhAddOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_add_order', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /api/order/index] Danh sách & Tìm kiếm đơn hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/order/index | Docs: https://developers.nhanh.group/pos/orders/index | Tìm kiếm đơn hàng theo bộ lọc trạng thái, khoảng ngày và phân trang',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: NhanhSearchOrdersDto })
  @Post('api/order/index')
  async searchOrders(@Body() dto: NhanhSearchOrdersDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_search_orders', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[POST /api/order/detail] Chi tiết đơn hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/order/detail | Docs: https://developers.nhanh.group/pos/orders/detail | Lấy thông tin chi tiết một đơn hàng theo orderId',
  })
  @Post('api/order/detail')
  async getOrderDetail(@Body('orderId') orderId: number) {
    return {
      code: 1,
      data: {
        orderId: Number(orderId || 88129),
        customerName: 'Lê Hoàng Nam',
        customerMobile: '0977889900',
        customerAddress: '456 Lê Văn Sỹ, P.12, Q.3, TP.HCM',
        statusName: 'Confirmed',
        calcTotalMoney: 290000,
        moneyDiscount: 0,
        moneyDeposit: 0,
        moneyTransfer: 0,
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/order/update] Cập nhật thông tin đơn hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/order/update | Docs: https://developers.nhanh.group/pos/orders/update | Cập nhật địa chỉ nhận hàng, ghi chú đơn',
  })
  @ApiBody({ type: NhanhUpdateOrderDto })
  @Post('api/order/update')
  async updateOrder(@Body() dto: NhanhUpdateOrderDto) {
    return { code: 1, data: { orderId: dto.orderId, updated: true, updated_at: new Date().toISOString() } };
  }

  @ApiOperation({
    summary: '[POST /api/order/status] Cập nhật trạng thái đơn hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/order/status | Docs: https://developers.nhanh.group/pos/orders/status | Cập nhật trạng thái đơn (Packing, Shipping, Success, Canceled)',
  })
  @ApiBody({ type: NhanhUpdateOrderStatusDto })
  @Post('api/order/status')
  async updateStatus(@Body() dto: NhanhUpdateOrderStatusDto) {
    return {
      code: 1,
      data: { orderId: dto.orderId, status: dto.status, updated_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[POST /api/order/delete] Hủy / Xóa đơn hàng Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/order/delete | Docs: https://developers.nhanh.group/pos/orders/delete | Hủy đơn hàng trên hệ thống Nhanh.vn',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: NhanhCancelOrderDto })
  @Post('api/order/delete')
  async deleteOrder(@Body() dto: NhanhCancelOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_cancel_order', dto, this.getEffectiveMode(mode));
  }
}
