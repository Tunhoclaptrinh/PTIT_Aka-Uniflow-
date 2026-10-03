import { Controller, Post, Get, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  KiotVietCreateProductDto,
  KiotVietUpdateProductDto,
  KiotVietPriceBookDto,
} from '../../dto/pos-kiotviet.dto';

@ApiTags('[POS-KiotViet] 02. Products & Pricebooks (Hàng hóa & Bảng giá)')
@Controller('api/v1/infra/kiotviet')
export class KiotVietProductsController {

  @ApiOperation({
    summary: '[Product - Hàng hóa] [POST /products] Tạo hàng hóa & Barcode mã vạch KiotViet',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Product] Endpoint gốc: POST https://public.kiotapi.com/products | Thêm mới hàng hóa, mã vạch Barcode để quét tại quầy thu ngân POS',
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
    summary: '[Product - Hàng hóa] [GET /products] Danh mục hàng hóa KiotViet',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Product] Endpoint gốc: GET https://public.kiotapi.com/products | Lấy danh mục sản phẩm, mã vạch Barcode và giá bán từ KiotViet',
  })
  @ApiQuery({ name: 'branchId', example: 101, required: false })
  @Get('products')
  async listProducts(@Query('branchId') branchId: number = 101) {
    return {
      total: 3,
      data: [
        { id: 801, code: 'KV-SP-01', barCode: '8936012345001', name: 'Tai nghe Bluetooth Mini', basePrice: 150000, cost: 90000, onHand: 120 },
        { id: 802, code: 'KV-SP-02', barCode: '8936012345002', name: 'Ốp lưng Silicon Chống Sốc', basePrice: 50000, cost: 25000, onHand: 350 },
        { id: 803, code: 'KV-SP-03', barCode: '8936012345003', name: 'Cáp sạc Type-C Bọc Dù', basePrice: 80000, cost: 40000, onHand: 210 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Product - Hàng hóa] [GET /products/:id] Chi tiết hàng hóa theo ID',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Product] Endpoint gốc: GET https://public.kiotapi.com/products/{id} | Xem chi tiết giá vốn, giá bán, tồn kho chi nhánh theo ID',
  })
  @ApiParam({ name: 'id', example: '801' })
  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: {
        id: Number(id),
        code: 'KV-SP-01',
        name: 'Tai nghe Bluetooth Mini',
        basePrice: 150000,
        cost: 90000,
        inventories: [{ branchId: 101, branchName: 'Cầu Giấy', onHand: 120 }],
      },
    };
  }

  @ApiOperation({
    summary: '[Product - Hàng hóa] [GET /products/code/:code] Tra cứu hàng hóa theo Barcode / Mã SKU',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Product] Endpoint gốc: GET https://public.kiotapi.com/products/code/{code} | Tra cứu nhanh thông tin sản phẩm bằng máy quét barcode',
  })
  @ApiParam({ name: 'code', example: 'KV-SP-01' })
  @Get('products/code/:code')
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
    summary: '[Product - Hàng hóa] [PUT /products/:id] Cập nhật hàng hóa KiotViet',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Product] Endpoint gốc: PUT https://public.kiotapi.com/products/{id} | Cập nhật tên, giá bán, giá vốn và định mức tồn kho',
  })
  @ApiParam({ name: 'id', example: '801' })
  @ApiBody({ type: KiotVietUpdateProductDto })
  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() dto: KiotVietUpdateProductDto) {
    return { responseStatus: 'success', data: { id: Number(id), code: dto.productCode, updated: true } };
  }

  @ApiOperation({
    summary: '[Product - Hàng hóa] [DELETE /products/:id] Xóa hàng hóa KiotViet',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Product] Endpoint gốc: DELETE https://public.kiotapi.com/products/{id} | Xóa hàng hóa khỏi danh mục kinh doanh',
  })
  @ApiParam({ name: 'id', example: '801' })
  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    return { responseStatus: 'success', message: `Đã xóa hàng hóa #${id}` };
  }

  @ApiOperation({
    summary: '[Product Attribute - Thuộc tính] [GET /products/attributes] Danh mục thuộc tính sản phẩm',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Product Attribute] Endpoint gốc: GET https://public.kiotapi.com/products/attributes | Lấy danh sách các thuộc tính biến thể (Màu sắc, Kích cỡ, Chất liệu)',
  })
  @Get('products/attributes')
  async listProductAttributes() {
    return {
      total: 2,
      data: [
        { id: 1, name: 'Màu sắc', values: ['Đỏ', 'Xanh', 'Đen', 'Trắng'] },
        { id: 2, name: 'Kích cỡ', values: ['S', 'M', 'L', 'XL'] },
      ],
    };
  }

  @ApiOperation({
    summary: '[Product Batch - Thêm hàng loạt] [POST /products/batch] Thêm mới danh sách hàng hóa hàng loạt',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Product Batch] Endpoint gốc: POST https://public.kiotapi.com/products/batch | Tạo mới hàng loạt sản phẩm đồng thời để tối ưu hiệu năng',
  })
  @ApiBody({ description: 'Mảng danh sách các sản phẩm cần tạo' })
  @Post('products/batch')
  async batchCreateProducts(@Body() body: any) {
    return { responseStatus: 'success', message: 'Tạo danh sách hàng hóa hàng loạt thành công' };
  }

  @ApiOperation({
    summary: '[Product Batch - Sửa hàng loạt] [PUT /products/batch] Cập nhật danh sách hàng hóa hàng loạt',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Product Batch] Endpoint gốc: PUT https://public.kiotapi.com/products/batch | Cập nhật giá bán, mô tả cho nhiều sản phẩm trong một request',
  })
  @ApiBody({ description: 'Mảng danh sách các sản phẩm cần cập nhật' })
  @Put('products/batch')
  async batchUpdateProducts(@Body() body: any) {
    return { responseStatus: 'success', message: 'Cập nhật danh sách hàng hóa hàng loạt thành công' };
  }

  @ApiOperation({
    summary: '[Product Stock - Tồn kho tổng hợp] [GET /products/inventory] Danh sách tồn kho toàn bộ sản phẩm',
    description: '[Thuộc danh mục: 2.4. Hàng hóa > Product Stock] Endpoint gốc: GET https://public.kiotapi.com/products/inventory | Lấy danh sách tồn kho hàng hóa đa chi nhánh',
  })
  @ApiQuery({ name: 'branchId', example: 101, required: false })
  @Get('products/inventory')
  async listProductInventory(@Query('branchId') branchId: number = 101) {
    return {
      data: [
        { productId: 801, productCode: 'KV-SP-01', branchId, onHand: 120, reserved: 5 },
        { productId: 802, productCode: 'KV-SP-02', branchId, onHand: 350, reserved: 0 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Pricebook - Bảng giá] [GET /pricebooks] Danh sách bảng giá KiotViet',
    description: '[Thuộc danh mục: 2.17. Bảng giá > Pricebook] Endpoint gốc: GET https://public.kiotapi.com/pricebooks | Tra cứu danh mục các bảng giá đang hiệu lực (Bán buôn, Bán lẻ, Khách quen)',
  })
  @Get('pricebooks')
  async listPriceBooks() {
    return {
      data: [
        { id: 1, name: 'Bảng giá chuẩn (Bán lẻ)', isActive: true },
        { id: 2, name: 'BẢNG GIÁ SỈ ĐẠI LÝ CẤP 1', isActive: true },
      ],
    };
  }

  @ApiOperation({
    summary: '[Pricebook - Bảng giá] [GET /pricebooks/:id] Chi tiết bảng giá theo ID',
    description: '[Thuộc danh mục: 2.17. Bảng giá > Pricebook] Endpoint gốc: GET https://public.kiotapi.com/pricebooks/{id} | Xem thông tin chi tiết bảng giá và danh sách chi nhánh áp dụng',
  })
  @ApiParam({ name: 'id', example: '1' })
  @Get('pricebooks/:id')
  async getPriceBookById(@Param('id') id: string) {
    return {
      responseStatus: 'success',
      data: {
        id: Number(id),
        name: 'BẢNG GIÁ SỈ ĐẠI LÝ CẤP 1',
        isActive: true,
        priceBookBranches: [{ branchId: 101, branchName: 'Cầu Giấy' }],
      },
    };
  }

  @ApiOperation({
    summary: '[Pricebook - Bảng giá] [POST /pricebooks] Tạo bảng giá mới KiotViet',
    description: '[Thuộc danh mục: 2.17. Bảng giá > Pricebook] Endpoint gốc: POST https://public.kiotapi.com/pricebooks | Khởi tạo bảng giá mới cho khách hàng bán buôn hoặc đối tác',
  })
  @ApiBody({ type: KiotVietPriceBookDto })
  @Post('pricebooks')
  async createPriceBook(@Body() dto: KiotVietPriceBookDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        priceBookName: dto.priceBookName,
        updatedItemsCount: dto.items?.length || 0,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Pricebook - Bảng giá] [PUT /pricebooks/:id] Cập nhật chi tiết bảng giá KiotViet',
    description: '[Thuộc danh mục: 2.17. Bảng giá > Pricebook] Endpoint gốc: PUT https://public.kiotapi.com/pricebooks/{id} | Cập nhật đơn giá cho danh sách hàng hóa trong bảng giá',
  })
  @ApiParam({ name: 'id', example: '1' })
  @Put('pricebooks/:id')
  async updatePriceBookDetail(@Param('id') id: string, @Body() body: any) {
    return {
      responseStatus: 'success',
      data: { id: Number(id), updated: true, updatedDate: new Date().toISOString() },
    };
  }
}
