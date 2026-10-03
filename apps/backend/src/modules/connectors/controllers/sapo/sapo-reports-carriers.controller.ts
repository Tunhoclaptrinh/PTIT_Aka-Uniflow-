import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

// ── DTOs ──
export class SapoReportFilterDto {
  @ApiProperty({ example: '2026-09-01', description: 'Ngày bắt đầu thống kê (YYYY-MM-DD)' })
  @IsString() from_date: string;

  @ApiProperty({ example: '2026-09-30', description: 'Ngày kết thúc thống kê (YYYY-MM-DD)' })
  @IsString() to_date: string;

  @ApiProperty({ example: 101, description: 'ID chi nhánh / địa điểm (bỏ trống để lấy toàn bộ)', required: false })
  @IsOptional() location_id?: number;
}

export class SapoCreateShipmentDto {
  @ApiProperty({ example: 882910, description: 'ID đơn hàng Sapo cần giao' })
  @IsNumber() order_id: number;

  @ApiProperty({ example: 'SAPO_EXPRESS', description: 'Đối tác vận chuyển: SAPO_EXPRESS | GHN | GHTK | VIETTELPOST' })
  @IsString() carrier_code: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Người nhận hàng' })
  @IsString() receiver_name: string;

  @ApiProperty({ example: '0988776655', description: 'Số điện thoại người nhận' })
  @IsString() receiver_phone: string;

  @ApiProperty({ example: 'Số 10 Phố Huế, P. Hàng Bài, Q. Hoàn Kiếm, Hà Nội', description: 'Địa chỉ nhận' })
  @IsString() receiver_address: string;

  @ApiProperty({ example: 450000, description: 'Tiền thu hộ COD (0 nếu đã thanh toán)' })
  @IsNumber() cod_amount: number;

  @ApiProperty({ example: 500, description: 'Trọng lượng gói hàng (gram)' })
  @IsNumber() weight: number;
}

@ApiTags('[02. POS-Sapo] 19. Reports & Analytics')
@Controller('api/v1/infra/sapo')
export class SapoReportsController {
  @ApiOperation({
    summary: '[GET /admin/reports/sales.json] Báo cáo doanh thu bán hàng',
    description: 'Endpoint gốc: GET https://{store}.mysapo.net/admin/reports/sales.json | Docs: https://support.sapo.vn/ | Tổng hợp doanh thu, chiết khấu, giá vốn và lợi nhuận thuần theo kỳ',
  })
  @ApiQuery({ name: 'from_date', required: true, example: '2026-09-01' })
  @ApiQuery({ name: 'to_date', required: true, example: '2026-09-30' })
  @ApiQuery({ name: 'location_id', required: false, example: 101 })
  @Get('admin/reports/sales.json')
  async getSalesReport(
    @Query('from_date') fromDate: string,
    @Query('to_date') toDate: string,
    @Query('location_id') locationId?: number,
  ) {
    return {
      report: {
        from_date: fromDate,
        to_date: toDate,
        location_id: locationId || 'ALL',
        gross_sales: 68500000,
        discounts: 3500000,
        returns: 1200000,
        net_sales: 63800000,
        total_orders: 215,
        average_order_value: 296744,
      },
    };
  }

  @ApiOperation({
    summary: '[GET /admin/reports/top-products.json] Báo cáo top sản phẩm bán chạy',
    description: 'Endpoint gốc: GET https://{store}.mysapo.net/admin/reports/top-products.json | Thống kê danh sách hàng hóa có sản lượng và doanh thu cao nhất trên Sapo',
  })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @Get('admin/reports/top-products.json')
  async getTopProducts(@Query('limit') limit = 10) {
    return {
      top_products: [
        { product_id: 10291, title: 'Áo Thun Cotton Compact UniFlow', total_quantity_sold: 142, revenue: 21300000 },
        { product_id: 10292, title: 'Quần Khaki Slim-fit Sapo Series', total_quantity_sold: 98, revenue: 29400000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /admin/reports/channels.json] Doanh thu theo kênh bán hàng',
    description: 'Endpoint gốc: GET https://{store}.mysapo.net/admin/reports/channels.json | Phân tích cơ cấu doanh thu từ POS tại quầy, Website, Shopee, TikTok Shop kết nối Sapo',
  })
  @Get('admin/reports/channels.json')
  async getChannelPerformance() {
    return {
      channels: [
        { channel: 'POS_STORE', revenue: 35000000, orders: 120, share_pct: 54.8 },
        { channel: 'WEBSITE', revenue: 15500000, orders: 48, share_pct: 24.3 },
        { channel: 'SHOPEE', revenue: 8900000, orders: 32, share_pct: 13.9 },
        { channel: 'TIKTOK_SHOP', revenue: 4400000, orders: 15, share_pct: 7.0 },
      ],
    };
  }
}

@ApiTags('[02. POS-Sapo] 18. Shipments & Carriers')
@Controller('api/v1/infra/sapo')
export class SapoShipmentsController {
  @ApiOperation({
    summary: '[POST /admin/shipments.json] Đẩy đơn sang đối tác vận chuyển Sapo Express',
    description: 'Endpoint gốc: POST https://{store}.mysapo.net/admin/shipments.json | Docs: https://support.sapo.vn/ | Khởi tạo vận đơn giao hàng với GHN, GHTK, Viettel Post hoặc Sapo Express',
  })
  @ApiBody({ type: SapoCreateShipmentDto })
  @Post('admin/shipments.json')
  async createShipment(@Body() dto: SapoCreateShipmentDto) {
    const trackingCode = `SAPO_EXP_${Date.now()}`;
    return {
      shipment: {
        id: Date.now(),
        order_id: dto.order_id,
        carrier_code: dto.carrier_code,
        tracking_code: trackingCode,
        shipping_fee: 26000,
        cod_amount: dto.cod_amount,
        status: 'READY_TO_PICK',
        estimated_delivery: new Date(Date.now() + 86400000 * 2).toISOString(),
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[GET /admin/shipments/:id.json] Tra cứu chi tiết & hành trình vận đơn',
    description: 'Endpoint gốc: GET https://{store}.mysapo.net/admin/shipments/{id}.json | Lấy thông tin trạng thái vận chuyển và lộ trình bưu tá cập nhật theo thời gian thực',
  })
  @ApiParam({ name: 'id', example: '109283' })
  @Get('admin/shipments/:id.json')
  async getShipmentDetail(@Param('id') id: string) {
    return {
      shipment: {
        id: Number(id),
        tracking_code: `SAPO_EXP_${id}`,
        carrier: 'Sapo Express (GHN partner)',
        status: 'DELIVERING',
        current_hub: 'Bưu cục Đống Đa - Hà Nội',
        timeline: [
          { status: 'CREATED', time: new Date(Date.now() - 3600000 * 5).toISOString(), note: 'Đã tạo vận đơn trên hệ thống' },
          { status: 'PICKED_UP', time: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Bưu tá đã lấy hàng từ kho' },
          { status: 'IN_TRANSIT', time: new Date().toISOString(), note: 'Đang vận chuyển tới bưu cục giao' },
        ],
      },
    };
  }

  @ApiOperation({
    summary: '[POST /admin/shipments/:id/cancel.json] Hủy vận đơn giao hàng',
    description: 'Endpoint gốc: POST https://{store}.mysapo.net/admin/shipments/{id}/cancel.json | Hủy phiếu giao hàng khi đơn bị hủy hoặc bưu tá chưa lấy hàng',
  })
  @ApiParam({ name: 'id', example: '109283' })
  @Post('admin/shipments/:id/cancel.json')
  async cancelShipment(@Param('id') id: string) {
    return {
      success: true,
      shipment_id: Number(id),
      status: 'CANCELLED',
      cancelled_at: new Date().toISOString(),
      message: 'Hủy vận đơn giao hàng thành công',
    };
  }
}
