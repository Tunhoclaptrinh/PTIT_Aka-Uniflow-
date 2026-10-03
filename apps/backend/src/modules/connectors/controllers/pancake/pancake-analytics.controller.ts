import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('[02. POS-Pancake] 09. Analytics & Reports (Báo cáo & Thống kê kinh doanh)')
@Controller('api/v1/infra/pancake')
export class PancakeAnalyticsController {

  @ApiOperation({
    summary: '[Statistics - Báo cáo bán hàng] [GET /shops/:shopId/analytics/sale] Báo cáo doanh số và đơn hàng',
    description: '[Thuộc danh mục: 25. Statistics > Báo cáo doanh thu] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/analytics/sale | Docs: https://docs.pancake.biz/pos/api/ | Tổng hợp doanh thu, số đơn, tỉ lệ chốt đơn và doanh thu thuần',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiQuery({ name: 'start_date', required: false, example: '2026-10-01' })
  @ApiQuery({ name: 'end_date', required: false, example: '2026-10-04' })
  @Get('shops/:shopId/analytics/sale')
  async getSalesAnalyticsOfficial(
    @Param('shopId') shopId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    return {
      success: true,
      shop_id: shopId,
      timeframe: { start_date: startDate || '2026-10-01', end_date: endDate || '2026-10-04' },
      report: {
        total_revenue: 125000000,
        total_orders: 380,
        completed_orders: 350,
        cancelled_orders: 15,
        returned_orders: 15,
        average_order_value: 328900,
      },
    };
  }

  @ApiOperation({
    summary: '[Statistics - Công thức tùy biến] [GET /shops/:shopId/analytics/get_list_formula] Danh sách công thức tính chỉ số báo cáo',
    description: '[Thuộc danh mục: 25. Statistics > Công thức báo cáo] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/analytics/get_list_formula | Danh sách các công thức tính ROI, Doanh thu thuần, Chi phí vận chuyển',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/analytics/get_list_formula')
  async getListFormulaOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      formulas: [
        { id: 1, name: 'Doanh thu thuần', expression: 'total_revenue - discount_total - return_total' },
        { id: 2, name: 'ROI Quảng cáo', expression: '(net_revenue - cogs - adv_cost) / adv_cost * 100' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Statistics - Trường dữ liệu] [GET /shops/:shopId/analytics/get_analytic_fields] Danh sách các trường dữ liệu báo cáo thống kê',
    description: '[Thuộc danh mục: 25. Statistics > Trường dữ liệu] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/analytics/get_analytic_fields',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/analytics/get_analytic_fields')
  async getAnalyticFieldsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      fields: [
        { key: 'total_revenue', label: 'Doanh số', type: 'currency' },
        { key: 'order_count', label: 'Số lượng đơn', type: 'integer' },
        { key: 'customer_reach', label: 'Số khách tiếp cận', type: 'integer' },
        { key: 'cogs', label: 'Giá vốn', type: 'currency' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Statistics - Thư mục báo cáo] [GET /shops/:shopId/statistic_custom/folders] Danh sách thư mục báo cáo tùy chỉnh',
    description: '[Thuộc danh mục: 25. Statistics > Thư mục báo cáo tùy chỉnh] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/statistic_custom/folders',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/statistic_custom/folders')
  async getStatisticCustomFoldersOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      folders: [
        { id: 101, name: 'Báo cáo Giám đốc', reports_count: 5 },
        { id: 102, name: 'Báo cáo Vận hành Kho', reports_count: 3 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Statistics - Báo cáo tồn theo biến thể] [GET /shops/:shopId/inventory_analytics/inventory] Báo cáo xuất nhập tồn theo từng mẫu mã biến thể',
    description: '[Thuộc danh mục: 26. Statistics inventory > Tồn theo biến thể] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/inventory_analytics/inventory | Báo cáo chi tiết số lượng tồn, giá trị tồn theo từng SKU',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/inventory_analytics/inventory')
  async getInventoryAnalyticsByVariationOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      items: [
        {
          variation_id: 'VAR_1001',
          sku: 'VAY-HOA-L-RED',
          variation_name: 'Size L - Đỏ',
          opening_stock: 50,
          in_stock: 45,
          reserved_stock: 5,
          incoming_stock: 20,
          inventory_value: 8100000,
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Statistics - Báo cáo tồn theo sản phẩm] [GET /shops/:shopId/inventory_analytics/inventory_by_product] Báo cáo tổng hợp xuất nhập tồn theo sản phẩm cha',
    description: '[Thuộc danh mục: 26. Statistics inventory > Tồn theo sản phẩm] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/inventory_analytics/inventory_by_product',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/inventory_analytics/inventory_by_product')
  async getInventoryAnalyticsByProductOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      products: [
        {
          product_id: 1001,
          sku: 'VAY-HOA-VINTAGE',
          name: 'Váy Hoa Nhí Vintage',
          total_stock: 120,
          total_inventory_value: 21600000,
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Statistics - Báo cáo khách hàng] [GET /shops/:shopId/customer_analytics/report] Báo cáo phân tích hành vi và tệp khách hàng',
    description: '[Thuộc danh mục: 27. Statistics customer > Báo cáo khách hàng] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/customer_analytics/report | Tỉ lệ khách quay lại (retention rate), giá trị vòng đời CLV',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/customer_analytics/report')
  async getCustomerAnalyticsReportOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      report: {
        total_customers: 5200,
        new_customers_period: 320,
        returning_customers: 85,
        repeat_purchase_rate: 26.5,
        average_clv: 1450000,
      },
    };
  }
}
