import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  NhanhAddProductDto,
  NhanhUpdateProductDto,
} from '../../dto/pos-nhanh.dto';

@ApiTags('[02. POS-Nhanh] 03. Sản phẩm (Products)')
@Controller('api/v1/infra/nhanh')
export class NhanhProductsController {

  @ApiOperation({
    summary: '[POST /api/product/add] Thêm sản phẩm mới Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/product/add | Docs: https://developers.nhanh.group/pos/products/add | Tạo mới sản phẩm, mã vạch Barcode và tồn kho ban đầu',
  })
  @ApiBody({ type: NhanhAddProductDto })
  @Post('api/product/add')
  async addProduct(@Body() dto: NhanhAddProductDto) {
    return {
      code: 1,
      data: {
        productId: Date.now().toString().slice(-6),
        name: dto.name,
        code: dto.code,
        price: dto.price,
        depotId: dto.depotId,
        inventory: dto.inventory,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/product/search] Danh sách & Tìm kiếm sản phẩm Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/product/search | Docs: https://developers.nhanh.group/pos/products/search | Tra cứu danh sách sản phẩm theo từ khóa hoặc danh mục',
  })
  @Post('api/product/search')
  async searchProducts(@Body() dto: any) {
    return {
      code: 1,
      data: {
        page: dto?.page || 1,
        totalRecords: 2,
        products: [
          { productId: 55412, name: 'Tai Nghe Chống Ồn Active ANC', code: 'ANC-PRO-01', price: 890000, inventory: 45 },
          { productId: 55413, name: 'Cáp Sạc Nhanh Type-C 65W', code: 'TC-65W-02', price: 150000, inventory: 120 },
        ],
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/product/detail] Chi tiết sản phẩm Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/product/detail | Docs: https://developers.nhanh.group/pos/products/detail | Xem chi tiết giá vốn, giá bán, tồn kho tại từng điểm kho',
  })
  @Post('api/product/detail')
  async getProductDetail(@Body('productId') productId: number) {
    return {
      code: 1,
      data: {
        productId: Number(productId || 55412),
        name: 'Tai Nghe Chống Ồn Active ANC',
        code: 'ANC-PRO-01',
        price: 890000,
        inventory: [{ depotId: 101, remain: 20 }, { depotId: 102, remain: 25 }],
      },
    };
  }

  @ApiOperation({
    summary: '[POST /api/product/update] Cập nhật sản phẩm Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/product/update | Docs: https://developers.nhanh.group/pos/products/update | Sửa đổi thông tin tên, giá bán của sản phẩm',
  })
  @ApiBody({ type: NhanhUpdateProductDto })
  @Post('api/product/update')
  async updateProduct(@Body() dto: NhanhUpdateProductDto) {
    return { code: 1, data: { productId: dto.productId, updated: true, updated_at: new Date().toISOString() } };
  }

  @ApiOperation({
    summary: '[POST /api/product/delete] Xóa sản phẩm Nhanh.vn',
    description: 'Endpoint gốc: POST https://open.nhanh.vn/api/product/delete | Docs: https://developers.nhanh.group/pos/products/delete | Xóa sản phẩm khỏi danh mục Nhanh.vn',
  })
  @Post('api/product/delete')
  async deleteProduct(@Body('productId') productId: number) {
    return { code: 1, message: `Đã xóa sản phẩm Nhanh.vn #${productId || 55412} thành công` };
  }
}
