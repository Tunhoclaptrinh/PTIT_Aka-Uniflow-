import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

// ── DTOs ──
export class NhanhReportRevenueDto {
  @ApiProperty({ example: '2026-09-01', description: 'Ngày bắt đầu (YYYY-MM-DD)' })
  @IsString() fromDate: string;
  @ApiProperty({ example: '2026-09-30', description: 'Ngày kết thúc (YYYY-MM-DD)' })
  @IsString() toDate: string;
  @ApiProperty({ example: 102, description: 'ID Kho / Chi nhánh (để trống = tất cả)', required: false })
  @IsOptional() depotId?: number;
}

export class NhanhAddCategoryDto {
  @ApiProperty({ example: 'Áo Thun Nam', description: 'Tên danh mục sản phẩm' })
  @IsString() name: string;
  @ApiProperty({ example: 0, description: 'ID danh mục cha (0 = root)', required: false })
  @IsOptional() parentId?: number;
}

// ── Controller ──
@ApiTags('[02. POS-Nhanh] 13. Báo cáo \u0026 Phân tích (Reports \u0026 Analytics)')
@Controller('api/v1/infra/nhanh')
export class NhanhReportsController {
  @ApiOperation({
    summary: '[POST /api/report/revenue] Báo cáo doanh thu theo khoảng ngày',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/report/revenue | Docs: https://developers.nhanh.group/pos/reports/revenue | Tổng hợp doanh thu bán hàng, chi phí, lợi nhuận gộp theo kho/ngày',
  })
  @ApiBody({ type: NhanhReportRevenueDto })
  @Post('api/report/revenue')
  async reportRevenue(@Body() dto: NhanhReportRevenueDto) {
    return {
      code: 1, data: {
        fromDate: dto.fromDate, toDate: dto.toDate,
        totalOrders: 124, totalRevenue: 38500000, totalDiscount: 2100000,
        totalCost: 21800000, grossProfit: 14600000, depotId: dto.depotId || 'ALL',
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/report/inventory] Báo cáo tồn kho tại kho',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/report/inventory | Docs: https://developers.nhanh.group/pos/reports/inventory | Kiểm kê tồn kho theo sản phẩm, phân loại hàng hóa theo kho hàng',
  })
  @Post('api/report/inventory')
  async reportInventory(@Body('depotId') depotId: number) {
    return {
      code: 1, data: [
        { productId: 55412, productName: 'Áo Polo Nam Size L', sku: 'SKU-AP-L', onHand: 150, committed: 12, available: 138 },
        { productId: 55413, productName: 'Áo Polo Nam Size M', sku: 'SKU-AP-M', onHand: 230, committed: 5, available: 225 },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /api/report/best-seller] Sản phẩm bán chạy nhất',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/report/best-seller | Docs: https://developers.nhanh.group/pos/reports/best-seller | Top sản phẩm theo doanh số và số lượng bán trong kỳ báo cáo',
  })
  @ApiBody({ type: NhanhReportRevenueDto })
  @Post('api/report/best-seller')
  async reportBestSeller(@Body() dto: NhanhReportRevenueDto) {
    return {
      code: 1, data: [
        { rank: 1, productId: 55412, productName: 'Áo Polo Nam Size L', totalQty: 89, totalRevenue: 8010000 },
        { rank: 2, productId: 91823, productName: 'Quần Kaki Slim Fit', totalQty: 72, totalRevenue: 7920000 },
      ],
    };
  }
}

@ApiTags('[02. POS-Nhanh] 14. Danh mục \u0026 Thương hiệu (Categories \u0026 Brands)')
@Controller('api/v1/infra/nhanh')
export class NhanhCategoriesController {
  @ApiOperation({
    summary: '[POST /api/product/category] Danh sách danh mục sản phẩm',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/product/category | Docs: https://developers.nhanh.group/pos/products/category | Lấy cây danh mục sản phẩm phân cấp của Nhanh.vn',
  })
  @Post('api/product/category')
  async listCategories() {
    return {
      code: 1, data: [
        { categoryId: 1, name: 'Áo', parentId: 0, children: [{ categoryId: 11, name: 'Áo Thun', parentId: 1 }, { categoryId: 12, name: 'Áo Polo', parentId: 1 }] },
        { categoryId: 2, name: 'Quần', parentId: 0, children: [{ categoryId: 21, name: 'Quần Kaki', parentId: 2 }] },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /api/product/category/add] Thêm danh mục sản phẩm mới',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/product/category/add | Docs: https://developers.nhanh.group/pos/products/category-add | Tạo danh mục sản phẩm mới trên hệ thống Nhanh.vn',
  })
  @ApiBody({ type: NhanhAddCategoryDto })
  @Post('api/product/category/add')
  async addCategory(@Body() dto: NhanhAddCategoryDto) {
    return { code: 1, data: { categoryId: Date.now(), name: dto.name, parentId: dto.parentId || 0, createdAt: new Date().toISOString() } };
  }

  @ApiOperation({
    summary: '[POST /api/product/brand] Danh sách thương hiệu sản phẩm',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/product/brand | Docs: https://developers.nhanh.group/pos/products/brand | Tra cứu danh sách thương hiệu đã đăng ký trên Nhanh.vn',
  })
  @Post('api/product/brand')
  async listBrands() {
    return { code: 1, data: [{ brandId: 1, name: 'POLO RALPH LAUREN' }, { brandId: 2, name: 'UNIQLO' }, { brandId: 3, name: 'ZARA' }] };
  }

  @ApiOperation({
    summary: '[POST /api/product/search-combo] Tìm kiếm sản phẩm combo',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/product/search-combo | Docs: https://developers.nhanh.group/pos/products/combo | Tìm kiếm và liệt kê sản phẩm dạng combo / bundle',
  })
  @Post('api/product/search-combo')
  async searchCombo(@Body('keyword') keyword: string) {
    return { code: 1, data: [{ productId: 99112, name: `Combo ${keyword || 'Áo+Quần Set'}`, price: 350000, components: [55412, 21881] }] };
  }
}
