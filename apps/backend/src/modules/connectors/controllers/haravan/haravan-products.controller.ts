import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import {
  HaravanCreateProductDto,
  HaravanUpdateProductDto,
  HaravanVariantDto,
  HaravanProductImageDto,
  HaravanCreateCollectionDto,
  HaravanSmartCollectionDto,
  HaravanCollectDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 6. PRODUCT RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 06. Product')
@Controller('api/v1/infra/haravan')
export class HaravanProductsController {
  @ApiOperation({
    summary: '[POST /com/products.json] Tạo sản phẩm & biến thể Haravan',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/products.json | Docs: https://docs.haravan.com/docs/omni-apis/products/ | Thêm mới sản phẩm, hình ảnh và danh sách biến thể SKU trên Haravan Omnichannel',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateProductDto })
  @Post('com/products.json')
  async createProduct(@Body() dto: HaravanCreateProductDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      product: {
        id: Date.now(),
        title: dto.title,
        vendor: dto.vendor,
        product_type: dto.product_type,
        variants: dto.variants,
        published_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/products.json] Danh mục sản phẩm Haravan',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/products.json | Truy vấn danh mục sản phẩm, biến thể và số lượng tồn',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiQuery({ name: 'limit', example: 20, required: false })
  @ApiQuery({ name: 'page', example: 1, required: false })
  @Get('com/products.json')
  async listProducts(@Query('limit') limit = 20, @Query('page') page = 1, @Headers('x-uniflow-mode') mode?: string) {
    return {
      products: [
        { id: 881290, title: 'Áo Thun Cotton Compact', vendor: 'UniFlow Fashion', variants_count: 2 },
        { id: 881291, title: 'Quần Kaki Co Giãn 4 Chiều', vendor: 'UniFlow Fashion', variants_count: 4 },
      ],
      page: Number(page),
      limit: Number(limit),
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[GET /com/products/count.json] Đếm số lượng sản phẩm',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/products/count.json | Tổng số sản phẩm trong kho cửa hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/products/count.json')
  async countProducts(@Headers('x-uniflow-mode') mode?: string) {
    return { count: 348, mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[GET /com/products/:id.json] Chi tiết sản phẩm Haravan',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/products/{id}.json | Xem chi tiết sản phẩm và các biến thể',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '881290' })
  @Get('com/products/:id.json')
  async getProductById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      product: {
        id: Number(id),
        title: 'Áo Polo Thể Thao Nam Breathable Tech',
        vendor: 'UniFlow Fashion',
        variants: [
          { id: 881294, sku: 'POLO-BLK-M', price: 290000, inventory_quantity: 40 },
          { id: 881295, sku: 'POLO-BLK-L', price: 290000, inventory_quantity: 60 },
        ],
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[PUT /com/products/:id.json] Cập nhật thông tin sản phẩm',
    description: 'Endpoint gốc: PUT https://apis.haravan.com/com/products/{id}.json | Sửa tiêu đề, giá bán, mô tả sản phẩm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '881290' })
  @ApiBody({ type: HaravanUpdateProductDto })
  @Put('com/products/:id.json')
  async updateProduct(@Param('id') id: string, @Body() dto: HaravanUpdateProductDto, @Headers('x-uniflow-mode') mode?: string) {
    return { product: { id: Number(id), ...dto, updated_at: new Date().toISOString() }, mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[DELETE /com/products/:id.json] Xóa sản phẩm Haravan',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/products/{id}.json | Xóa sản phẩm khỏi hệ thống Haravan',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '881290' })
  @Delete('com/products/:id.json')
  async deleteProduct(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), message: `Đã xóa sản phẩm Haravan #${id}`, mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 7. PRODUCT VARIANT RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 07. Product Variant')
@Controller('api/v1/infra/haravan')
export class HaravanVariantsController {
  @ApiOperation({
    summary: '[GET /com/variants.json] Danh sách biến thể toàn cửa hàng',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/variants.json | Danh sách tất cả mã SKU/barcode biến thể',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiQuery({ name: 'limit', example: 20, required: false })
  @Get('com/variants.json')
  async listVariants(@Query('limit') limit = 20, @Headers('x-uniflow-mode') mode?: string) {
    return {
      variants: [
        { id: 881294, product_id: 881290, title: 'Đen / M', price: 290000, sku: 'POLO-BLK-M', inventory_quantity: 40 },
        { id: 881295, product_id: 881290, title: 'Đen / L', price: 290000, sku: 'POLO-BLK-L', inventory_quantity: 60 },
      ],
      limit: Number(limit),
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[GET /com/products/:product_id/variants.json] Biến thể theo sản phẩm',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/products/{product_id}/variants.json | Lấy danh sách mẫu mã phân loại của 1 sản phẩm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'product_id', example: '881290' })
  @Get('com/products/:product_id/variants.json')
  async getVariantsByProduct(@Param('product_id') productId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      variants: [
        { id: 881294, product_id: Number(productId), title: 'Đen / M', price: 290000, sku: 'POLO-BLK-M' },
        { id: 881295, product_id: Number(productId), title: 'Đen / L', price: 290000, sku: 'POLO-BLK-L' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[POST /com/products/:product_id/variants.json] Thêm biến thể cho sản phẩm',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/products/{product_id}/variants.json | Tạo biến thể size/màu mới',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'product_id', example: '881290' })
  @ApiBody({ type: HaravanVariantDto })
  @Post('com/products/:product_id/variants.json')
  async createVariant(@Param('product_id') productId: string, @Body() dto: HaravanVariantDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      variant: { id: Date.now(), product_id: Number(productId), ...dto, mode: mode || 'SANDBOX' },
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 8. PRODUCT IMAGE RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 08. Product Image')
@Controller('api/v1/infra/haravan')
export class HaravanImagesController {
  @ApiOperation({
    summary: '[GET /com/products/:product_id/images.json] Danh sách ảnh của sản phẩm',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/products/{product_id}/images.json | Danh sách URL hình ảnh gallery',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'product_id', example: '881290' })
  @Get('com/products/:product_id/images.json')
  async listImages(@Param('product_id') productId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      images: [
        { id: 501, product_id: Number(productId), position: 1, src: 'https://file.hstatic.net/products/polo-black-front.jpg' },
        { id: 502, product_id: Number(productId), position: 2, src: 'https://file.hstatic.net/products/polo-black-back.jpg' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[POST /com/products/:product_id/images.json] Tải lên ảnh sản phẩm',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/products/{product_id}/images.json | Thêm ảnh mới vào bộ sưu tập ảnh sản phẩm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'product_id', example: '881290' })
  @ApiBody({ type: HaravanProductImageDto })
  @Post('com/products/:product_id/images.json')
  async uploadImage(@Param('product_id') productId: string, @Body() dto: HaravanProductImageDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      image: { id: Date.now(), product_id: Number(productId), src: dto.src, position: dto.position || 1, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/products/:product_id/images/:id.json] Xóa ảnh sản phẩm',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/products/{product_id}/images/{id}.json | Gỡ ảnh khỏi gallery',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'product_id', example: '881290' })
  @ApiParam({ name: 'id', example: '501' })
  @Delete('com/products/:product_id/images/:id.json')
  async deleteImage(@Param('product_id') productId: string, @Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 9. CUSTOM COLLECTION RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 09. CustomCollection')
@Controller('api/v1/infra/haravan')
export class HaravanCustomCollectionsController {
  @ApiOperation({
    summary: '[POST /com/custom_collections.json] Tạo nhóm sản phẩm thủ công',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/custom_collections.json | Tạo nhóm danh mục chọn sản phẩm bằng tay',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateCollectionDto })
  @Post('com/custom_collections.json')
  async createCollection(@Body() dto: HaravanCreateCollectionDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      custom_collection: {
        id: Date.now(),
        title: dto.title,
        body_html: dto.body_html,
        published_at: new Date().toISOString(),
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[GET /com/custom_collections.json] Danh sách nhóm sản phẩm thủ công',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/custom_collections.json | Danh sách nhóm bộ sưu tập tùy biến',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/custom_collections.json')
  async listCustomCollections(@Headers('x-uniflow-mode') mode?: string) {
    return {
      custom_collections: [
        { id: 100021, title: 'Bộ Sưu Tập Giày Sneaker Năng Động', products_count: 12 },
        { id: 100022, title: 'Phụ Kiện Thắt Lưng & Ví Da', products_count: 8 },
      ],
      mode: mode || 'SANDBOX',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 10. SMART COLLECTION RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 10. SmartCollection')
@Controller('api/v1/infra/haravan')
export class HaravanSmartCollectionsController {
  @ApiOperation({
    summary: '[GET /com/smart_collections.json] Danh sách nhóm sản phẩm thông minh',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/smart_collections.json | Danh sách nhóm tự động gom sản phẩm theo rule',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/smart_collections.json')
  async listSmartCollections(@Headers('x-uniflow-mode') mode?: string) {
    return {
      smart_collections: [
        { id: 200001, title: 'Sản Phẩm Khuyến Mãi Hot Nhất', rules: [{ column: 'tag', relation: 'equals', condition: 'SALE_OFF' }] },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[POST /com/smart_collections.json] Tạo nhóm sản phẩm thông minh mới',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/smart_collections.json | Định nghĩa bộ quy tắc tự động thêm sản phẩm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanSmartCollectionDto })
  @Post('com/smart_collections.json')
  async createSmartCollection(@Body() dto: HaravanSmartCollectionDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      smart_collection: { id: Date.now(), title: dto.title, rules: dto.rules, mode: mode || 'SANDBOX' },
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 11. COLLECT RESOURCE
// ═══════════════════════════════════════════════════════════════
@ApiTags('[POS-Haravan] 11. Collect')
@Controller('api/v1/infra/haravan')
export class HaravanCollectsController {
  @ApiOperation({
    summary: '[POST /com/collects.json] Gán sản phẩm vào nhóm (Collect)',
    description: 'Endpoint gốc: POST https://apis.haravan.com/com/collects.json | Đưa sản phẩm vào bộ sưu tập',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCollectDto })
  @Post('com/collects.json')
  async addCollect(@Body() dto: HaravanCollectDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      collect: { id: Date.now(), collection_id: dto.collection_id, product_id: dto.product_id, created_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[GET /com/collects.json] Danh sách liên kết sản phẩm - nhóm',
    description: 'Endpoint gốc: GET https://apis.haravan.com/com/collects.json | Tra cứu các liên kết phân loại nhóm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/collects.json')
  async listCollects(@Headers('x-uniflow-mode') mode?: string) {
    return {
      collects: [
        { id: 9101, collection_id: 100021, product_id: 881290 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[DELETE /com/collects/:id.json] Gỡ sản phẩm khỏi nhóm',
    description: 'Endpoint gốc: DELETE https://apis.haravan.com/com/collects/{id}.json | Xóa liên kết Collect',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '9101' })
  @Delete('com/collects/:id.json')
  async deleteCollect(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}
