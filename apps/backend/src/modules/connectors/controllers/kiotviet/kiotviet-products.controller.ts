import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  KiotVietCreateProductDto,
  KiotVietUpdateProductDto,
  KiotVietPriceBookDto,
} from '../../dto/pos-kiotviet.dto';

@ApiTags('[POS-KiotViet] 02. Hàng hóa & Bảng giá (Products & Pricebooks)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietProductsController {

  @ApiOperation({
    summary: '[POST /products] Tạo hàng hóa & Barcode mã vạch KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/products | Docs: https://developer.kiotviet.vn/#/products/create | Thêm mới hàng hóa, mã vạch Barcode để quét tại quầy thu ngân POS',
  })
  @ApiBody({ type: KiotVietCreateProductDto })
  @Post('products')
  async createProduct(@Body() dto: KiotVietCreateProductDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        code: dto.code,
        barCode: dto.barCode,
        name: dto.name,
        basePrice: dto.basePrice,
        cost: dto.cost,
        onHand: dto.onHand,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[GET /products] Danh mục hàng hóa KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/products | Docs: https://developer.kiotviet.vn/#/products/list | Lấy danh mục sản phẩm, mã vạch Barcode và giá bán từ KiotViet',
  })
  @ApiQuery({ name: 'branchId', example: 101, required: false })
  @Get('products')
  async listProducts(@Query('branchId') branchId: number = 101) {
    return {
      total: 3,
      data: [
        { code: 'KV-SP-01', barCode: '8936012345001', name: 'Tai nghe Bluetooth Mini', basePrice: 150000, cost: 90000, onHand: 120 },
        { code: 'KV-SP-02', barCode: '8936012345002', name: 'Ốp lưng Silicon Chống Sốc', basePrice: 50000, cost: 25000, onHand: 350 },
        { code: 'KV-SP-03', barCode: '8936012345003', name: 'Cáp sạc Type-C Bọc Dù', basePrice: 80000, cost: 40000, onHand: 210 },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /products/:code] Chi tiết hàng hóa KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/products/{code} | Docs: https://developer.kiotviet.vn/#/products/detail | Xem chi tiết giá vốn, giá bán, tồn kho chi nhánh',
  })
  @ApiParam({ name: 'code', example: 'KV-SP-01' })
  @Get('products/:code')
  async getProductByCode(@Param('code') code: string) {
    return {
      responseStatus: 'success',
      data: {
        code,
        name: 'Tai nghe Bluetooth Mini',
        basePrice: 150000,
        cost: 90000,
        inventories: [{ branchId: 101, branchName: 'Cầu Giấy', onHand: 120 }],
      },
    };
  }

  @ApiOperation({
    summary: '[PUT /products/:code] Cập nhật hàng hóa KiotViet',
    description: 'Endpoint gốc: PUT https://public.kiotapi.com/products/{code} | Docs: https://developer.kiotviet.vn/#/products/update | Cập nhật giá bán, giá vốn hàng hóa',
  })
  @ApiParam({ name: 'code', example: 'KV-SP-01' })
  @ApiBody({ type: KiotVietUpdateProductDto })
  @Put('products/:code')
  async updateProduct(@Param('code') code: string, @Body() dto: KiotVietUpdateProductDto) {
    return { responseStatus: 'success', data: { code: code || dto.productCode, updated: true } };
  }

  @ApiOperation({
    summary: '[DELETE /products/:code] Xóa hàng hóa KiotViet',
    description: 'Endpoint gốc: DELETE https://public.kiotapi.com/products/{code} | Docs: https://developer.kiotviet.vn/#/products/delete | Xóa hàng hóa khỏi danh mục KiotViet',
  })
  @ApiParam({ name: 'code', example: 'KV-SP-01' })
  @Delete('products/:code')
  async deleteProduct(@Param('code') code: string) {
    return { responseStatus: 'success', message: `Đã xóa hàng hóa #${code}` };
  }

  @ApiOperation({
    summary: '[POST /pricebooks] Cập nhật bảng giá KiotViet',
    description: 'Endpoint gốc: POST https://public.kiotapi.com/pricebooks | Docs: https://developer.kiotviet.vn/#/pricebooks | Cập nhật bảng giá bán sỉ, đại lý hoặc chương trình khuyến mãi',
  })
  @ApiBody({ type: KiotVietPriceBookDto })
  @Post('pricebooks')
  async updatePriceBook(@Body() dto: KiotVietPriceBookDto) {
    return {
      responseStatus: 'success',
      data: {
        priceBookName: dto.priceBookName,
        updatedItemsCount: dto.items?.length || 0,
        updatedDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[GET /pricebooks] Danh sách bảng giá KiotViet',
    description: 'Endpoint gốc: GET https://public.kiotapi.com/pricebooks | Docs: https://developer.kiotviet.vn/#/pricebooks/list | Tra cứu danh mục các bảng giá đang hiệu lực',
  })
  @Get('pricebooks')
  async listPriceBooks() {
    return {
      data: [
        { id: 1, name: 'Bảng giá chuẩn (Bán lẻ)' },
        { id: 2, name: 'BẢNG GIÁ SỈ ĐẠI LÝ CẤP 1' },
      ],
    };
  }
}
