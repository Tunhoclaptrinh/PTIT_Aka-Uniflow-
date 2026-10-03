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
  HaravanOrderTagsDto,
} from '../../dto/pos-haravan.dto';

// ═══════════════════════════════════════════════════════════════
// 2. PRODUCTS CATEGORY (Product, Variant, Image, Collections, Collect)
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 02. Products (Sản phẩm & Bộ sưu tập)')
@Controller('api/v1/infra/haravan')
export class HaravanProductsController {
  @ApiOperation({
    summary: '[Product - Sản phẩm] [POST /com/products.json] Tạo sản phẩm & biến thể Haravan',
    description: '[Thuộc danh mục: 02. Products > Sản phẩm chính] Endpoint gốc: POST https://apis.haravan.com/com/products.json | Thêm mới sản phẩm, hình ảnh và danh sách biến thể SKU trên Haravan Omnichannel',
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
    summary: '[Product - Sản phẩm] [GET /com/products.json] Danh mục sản phẩm Haravan',
    description: '[Thuộc danh mục: 02. Products > Sản phẩm chính] Endpoint gốc: GET https://apis.haravan.com/com/products.json | Truy vấn danh mục sản phẩm, biến thể và số lượng tồn',
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
    summary: '[Product - Sản phẩm] [GET /com/products/count.json] Đếm số lượng sản phẩm',
    description: '[Thuộc danh mục: 02. Products > Sản phẩm chính] Endpoint gốc: GET https://apis.haravan.com/com/products/count.json | Tổng số sản phẩm trong kho cửa hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/products/count.json')
  async countProducts(@Headers('x-uniflow-mode') mode?: string) {
    return { count: 348, mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[Product - Sản phẩm] [GET /com/products/:id.json] Chi tiết sản phẩm Haravan',
    description: '[Thuộc danh mục: 02. Products > Sản phẩm chính] Endpoint gốc: GET https://apis.haravan.com/com/products/{id}.json | Xem chi tiết sản phẩm và các biến thể',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '881290' })
  @Get('com/products/:id.json')
  async getProductById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      product: {
        id: Number(id),
        title: 'Áo Thun Cotton Compact',
        vendor: 'UniFlow Fashion',
        variants: [
          { id: 881294, title: 'Trắng / M', price: 290000, sku: 'TSHIRT-WHT-M' },
          { id: 881295, title: 'Đen / L', price: 290000, sku: 'TSHIRT-BLK-L' },
        ],
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Product - Sản phẩm] [PUT /com/products/:id.json] Cập nhật thông tin sản phẩm',
    description: '[Thuộc danh mục: 02. Products > Sản phẩm chính] Endpoint gốc: PUT https://apis.haravan.com/com/products/{id}.json | Sửa tiêu đề, mô tả và giá',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '881290' })
  @ApiBody({ type: HaravanUpdateProductDto })
  @Put('com/products/:id.json')
  async updateProduct(@Param('id') id: string, @Body() dto: HaravanUpdateProductDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      product: { id: Number(id), title: dto.title, body_html: dto.body_html, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Product - Sản phẩm] [DELETE /com/products/:id.json] Xóa sản phẩm khỏi Haravan',
    description: '[Thuộc danh mục: 02. Products > Sản phẩm chính] Endpoint gốc: DELETE https://apis.haravan.com/com/products/{id}.json | Xóa sản phẩm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '881290' })
  @Delete('com/products/:id.json')
  async deleteProduct(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }

  @ApiOperation({
    summary: '[Product Tag - Gán Tag] [POST /com/products/:id/tags.json] Gắn thẻ Tag cho sản phẩm',
    description: '[Thuộc danh mục: 02. Products > Thẻ Tag phân loại] Endpoint gốc: POST https://apis.haravan.com/com/products/{id}/tags.json | Thêm nhãn tag phân loại mặt hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '881290' })
  @ApiBody({ type: HaravanOrderTagsDto })
  @Post('com/products/:id/tags.json')
  async addProductTags(@Param('id') id: string, @Body() dto: HaravanOrderTagsDto, @Headers('x-uniflow-mode') mode?: string) {
    return { product: { id: Number(id), tags: dto.tags, mode: mode || 'SANDBOX' } };
  }

  @ApiOperation({
    summary: '[Product Tag - Gỡ Tag] [DELETE /com/products/:id/tags.json] Gỡ bỏ thẻ Tag khỏi sản phẩm',
    description: '[Thuộc danh mục: 02. Products > Thẻ Tag phân loại] Endpoint gốc: DELETE https://apis.haravan.com/com/products/{id}/tags.json | Xóa nhãn tag khỏi sản phẩm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '881290' })
  @ApiBody({ type: HaravanOrderTagsDto })
  @Delete('com/products/:id/tags.json')
  async removeProductTags(@Param('id') id: string, @Body() dto: HaravanOrderTagsDto, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, product_id: Number(id), removed_tags: dto.tags, mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT VARIANTS SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 02. Products (Sản phẩm & Bộ sưu tập)')
@Controller('api/v1/infra/haravan')
export class HaravanProductVariantsController {
  @ApiOperation({
    summary: '[Variant - Biến thể SKU] [GET /com/variants.json] Danh sách toàn bộ biến thể SKU',
    description: '[Thuộc danh mục: 02. Products > Biến thể sản phẩm] Endpoint gốc: GET https://apis.haravan.com/com/variants.json | Danh sách mã biến thể SKU toàn cửa hàng',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/variants.json')
  async listAllVariants(@Headers('x-uniflow-mode') mode?: string) {
    return {
      variants: [
        { id: 881294, product_id: 881290, title: 'Trắng / M', price: 290000, sku: 'TSHIRT-WHT-M', barcode: '893001122331' },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Variant - Biến thể SKU] [GET /com/products/:product_id/variants.json] Biến thể theo sản phẩm',
    description: '[Thuộc danh mục: 02. Products > Biến thể sản phẩm] Endpoint gốc: GET https://apis.haravan.com/com/products/{product_id}/variants.json | Lấy danh sách biến thể SKU theo sản phẩm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'product_id', example: '881290' })
  @Get('com/products/:product_id/variants.json')
  async listVariantsByProduct(@Param('product_id') productId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      variants: [
        { id: 881294, product_id: Number(productId), title: 'Trắng / M', price: 290000 },
        { id: 881295, product_id: Number(productId), title: 'Đen / L', price: 290000 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Variant - Biến thể SKU] [GET /com/variants/:id.json] Chi tiết biến thể SKU',
    description: '[Thuộc danh mục: 02. Products > Biến thể sản phẩm] Endpoint gốc: GET https://apis.haravan.com/com/variants/{id}.json | Xem thông tin chi tiết một biến thể',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '881294' })
  @Get('com/variants/:id.json')
  async getVariantById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      variant: { id: Number(id), product_id: 881290, title: 'Trắng / M', price: 290000, sku: 'TSHIRT-WHT-M', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Variant - Biến thể SKU] [POST /com/products/:product_id/variants.json] Thêm biến thể mới cho sản phẩm',
    description: '[Thuộc danh mục: 02. Products > Biến thể sản phẩm] Endpoint gốc: POST https://apis.haravan.com/com/products/{product_id}/variants.json | Tạo biến thể size/màu mới',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'product_id', example: '881290' })
  @ApiBody({ type: HaravanVariantDto })
  @Post('com/products/:product_id/variants.json')
  async createVariant(@Param('product_id') productId: string, @Body() dto: HaravanVariantDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      variant: {
        id: Date.now(),
        product_id: Number(productId),
        title: dto.title,
        price: dto.price,
        sku: dto.sku,
        barcode: dto.barcode,
        mode: mode || 'SANDBOX',
      },
    };
  }

  @ApiOperation({
    summary: '[Variant - Biến thể SKU] [PUT /com/variants/:id.json] Cập nhật thông tin biến thể SKU',
    description: '[Thuộc danh mục: 02. Products > Biến thể sản phẩm] Endpoint gốc: PUT https://apis.haravan.com/com/variants/{id}.json | Sửa giá bán, mã barcode biến thể',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '881294' })
  @ApiBody({ type: HaravanVariantDto })
  @Put('com/variants/:id.json')
  async updateVariant(@Param('id') id: string, @Body() dto: HaravanVariantDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      variant: { id: Number(id), price: dto.price, sku: dto.sku, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Variant - Biến thể SKU] [DELETE /com/products/:product_id/variants/:id.json] Xóa biến thể khỏi sản phẩm',
    description: '[Thuộc danh mục: 02. Products > Biến thể sản phẩm] Endpoint gốc: DELETE https://apis.haravan.com/com/products/{product_id}/variants/{id}.json | Xóa biến thể SKU',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'product_id', example: '881290' })
  @ApiParam({ name: 'id', example: '881294' })
  @Delete('com/products/:product_id/variants/:id.json')
  async deleteVariant(@Param('product_id') productId: string, @Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_variant_id: Number(id), product_id: Number(productId), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT IMAGES SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 02. Products (Sản phẩm & Bộ sưu tập)')
@Controller('api/v1/infra/haravan')
export class HaravanProductImagesController {
  @ApiOperation({
    summary: '[Product Image - Thư viện ảnh] [GET /com/products/:product_id/images.json] Danh sách hình ảnh của sản phẩm',
    description: '[Thuộc danh mục: 02. Products > Hình ảnh sản phẩm] Endpoint gốc: GET https://apis.haravan.com/com/products/{product_id}/images.json | Danh sách URL ảnh sản phẩm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'product_id', example: '881290' })
  @Get('com/products/:product_id/images.json')
  async listImages(@Param('product_id') productId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      images: [
        { id: 701, product_id: Number(productId), src: 'https://file.hstatic.net/881290_01.jpg', position: 1 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Product Image - Thư viện ảnh] [POST /com/products/:product_id/images.json] Thêm hình ảnh mới cho sản phẩm',
    description: '[Thuộc danh mục: 02. Products > Hình ảnh sản phẩm] Endpoint gốc: POST https://apis.haravan.com/com/products/{product_id}/images.json | Tải lên ảnh sản phẩm mới',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'product_id', example: '881290' })
  @ApiBody({ type: HaravanProductImageDto })
  @Post('com/products/:product_id/images.json')
  async addImage(@Param('product_id') productId: string, @Body() dto: HaravanProductImageDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      image: { id: Date.now(), product_id: Number(productId), src: dto.src, position: dto.position || 1, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Product Image - Thư viện ảnh] [DELETE /com/products/:product_id/images/:id.json] Xóa hình ảnh',
    description: '[Thuộc danh mục: 02. Products > Hình ảnh sản phẩm] Endpoint gốc: DELETE https://apis.haravan.com/com/products/{product_id}/images/{id}.json | Xóa ảnh khỏi sản phẩm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'product_id', example: '881290' })
  @ApiParam({ name: 'id', example: '701' })
  @Delete('com/products/:product_id/images/:id.json')
  async deleteImage(@Param('product_id') productId: string, @Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_image_id: Number(id), product_id: Number(productId), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// CUSTOM COLLECTIONS SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 02. Products (Sản phẩm & Bộ sưu tập)')
@Controller('api/v1/infra/haravan')
export class HaravanCustomCollectionsController {
  @ApiOperation({
    summary: '[Custom Collection - Bộ sưu tập thủ công] [POST /com/custom_collections.json] Tạo nhóm danh mục thủ công (Custom Collection)',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập thủ công] Endpoint gốc: POST https://apis.haravan.com/com/custom_collections.json | Tạo nhóm danh mục để tự gán sản phẩm',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCreateCollectionDto })
  @Post('com/custom_collections.json')
  async createCustomCollection(@Body() dto: HaravanCreateCollectionDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      custom_collection: { id: Date.now(), title: dto.title, body_html: dto.body_html, published: dto.published ?? true, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Custom Collection - Bộ sưu tập thủ công] [GET /com/custom_collections.json] Danh sách nhóm danh mục thủ công',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập thủ công] Endpoint gốc: GET https://apis.haravan.com/com/custom_collections.json | Tra cứu nhóm danh mục thủ công',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/custom_collections.json')
  async listCustomCollections(@Headers('x-uniflow-mode') mode?: string) {
    return {
      custom_collections: [
        { id: 301, title: 'Thời trang Thu Đông 2026', handle: 'thoi-trang-thu-dong-2026', products_count: 14 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Custom Collection - Bộ sưu tập thủ công] [GET /com/custom_collections/:id.json] Chi tiết nhóm danh mục thủ công',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập thủ công] Endpoint gốc: GET https://apis.haravan.com/com/custom_collections/{id}.json | Xem chi tiết nhóm danh mục',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '301' })
  @Get('com/custom_collections/:id.json')
  async getCustomCollectionById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      custom_collection: { id: Number(id), title: 'Thời trang Thu Đông 2026', handle: 'thoi-trang-thu-dong-2026', mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Custom Collection - Bộ sưu tập thủ công] [PUT /com/custom_collections/:id.json] Cập nhật nhóm danh mục thủ công',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập thủ công] Endpoint gốc: PUT https://apis.haravan.com/com/custom_collections/{id}.json | Sửa tên hoặc mô tả nhóm danh mục',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '301' })
  @ApiBody({ type: HaravanCreateCollectionDto })
  @Put('com/custom_collections/:id.json')
  async updateCustomCollection(@Param('id') id: string, @Body() dto: HaravanCreateCollectionDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      custom_collection: { id: Number(id), title: dto.title, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Custom Collection - Bộ sưu tập thủ công] [DELETE /com/custom_collections/:id.json] Xóa nhóm danh mục thủ công',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập thủ công] Endpoint gốc: DELETE https://apis.haravan.com/com/custom_collections/{id}.json | Xóa nhóm danh mục',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '301' })
  @Delete('com/custom_collections/:id.json')
  async deleteCustomCollection(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// SMART COLLECTIONS SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 02. Products (Sản phẩm & Bộ sưu tập)')
@Controller('api/v1/infra/haravan')
export class HaravanSmartCollectionsController {
  @ApiOperation({
    summary: '[Smart Collection - Bộ sưu tập thông minh] [POST /com/smart_collections.json] Tạo nhóm danh mục thông minh (Smart Collection)',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập thông minh] Endpoint gốc: POST https://apis.haravan.com/com/smart_collections.json | Tự động gom sản phẩm theo quy tắc giá hoặc thẻ tag',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanSmartCollectionDto })
  @Post('com/smart_collections.json')
  async createSmartCollection(@Body() dto: HaravanSmartCollectionDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      smart_collection: { id: Date.now(), title: dto.title, rules: dto.rules, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Smart Collection - Bộ sưu tập thông minh] [GET /com/smart_collections.json] Danh sách nhóm danh mục thông minh',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập thông minh] Endpoint gốc: GET https://apis.haravan.com/com/smart_collections.json | Tra cứu nhóm danh mục thông minh',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/smart_collections.json')
  async listSmartCollections(@Headers('x-uniflow-mode') mode?: string) {
    return {
      smart_collections: [
        { id: 401, title: 'Sản phẩm Dưới 300K', disjunctive: false, rules: [{ column: 'variant_price', relation: 'less_than', condition: '300000' }] },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Smart Collection - Bộ sưu tập thông minh] [GET /com/smart_collections/:id.json] Chi tiết nhóm danh mục thông minh',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập thông minh] Endpoint gốc: GET https://apis.haravan.com/com/smart_collections/{id}.json | Xem chi tiết quy tắc lọc tự động',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '401' })
  @Get('com/smart_collections/:id.json')
  async getSmartCollectionById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      smart_collection: { id: Number(id), title: 'Sản phẩm Dưới 300K', rules: [{ column: 'variant_price', relation: 'less_than', condition: '300000' }], mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Smart Collection - Bộ sưu tập thông minh] [PUT /com/smart_collections/:id.json] Cập nhật nhóm danh mục thông minh',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập thông minh] Endpoint gốc: PUT https://apis.haravan.com/com/smart_collections/{id}.json | Sửa quy tắc nhóm thông minh',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '401' })
  @ApiBody({ type: HaravanSmartCollectionDto })
  @Put('com/smart_collections/:id.json')
  async updateSmartCollection(@Param('id') id: string, @Body() dto: HaravanSmartCollectionDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      smart_collection: { id: Number(id), title: dto.title, rules: dto.rules, updated_at: new Date().toISOString(), mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Smart Collection - Bộ sưu tập thông minh] [DELETE /com/smart_collections/:id.json] Xóa nhóm danh mục thông minh',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập thông minh] Endpoint gốc: DELETE https://apis.haravan.com/com/smart_collections/{id}.json | Xóa nhóm thông minh',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '401' })
  @Delete('com/smart_collections/:id.json')
  async deleteSmartCollection(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_id: Number(id), mode: mode || 'SANDBOX' };
  }
}

// ═══════════════════════════════════════════════════════════════
// COLLECTS SUB-RESOURCE
// ═══════════════════════════════════════════════════════════════

@ApiTags('[POS-Haravan] 02. Products (Sản phẩm & Bộ sưu tập)')
@Controller('api/v1/infra/haravan')
export class HaravanCollectsController {
  @ApiOperation({
    summary: '[Collect - Liên kết Danh mục] [POST /com/collects.json] Gán sản phẩm vào nhóm bộ sưu tập (Collect)',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập / Collections] Endpoint gốc: POST https://apis.haravan.com/com/collects.json | Trong kiến trúc Haravan (tương tự Shopify & Sapo), "Collect" là đối tượng quan hệ trung gian (Join-table mapping) dùng để gán một Sản phẩm (Product) vào một Bộ sưu tập thủ công (Custom Collection).',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: HaravanCollectDto })
  @Post('com/collects.json')
  async createCollect(@Body() dto: HaravanCollectDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      collect: { id: Date.now(), collection_id: dto.collection_id, product_id: dto.product_id, position: dto.position || 1, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Collect - Liên kết Danh mục] [GET /com/collects.json] Danh sách liên kết sản phẩm - bộ sưu tập',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập / Collections] Endpoint gốc: GET https://apis.haravan.com/com/collects.json | Tra cứu toàn bộ bảng quan hệ mapping giữa các Sản phẩm và các Bộ sưu tập thủ công.',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('com/collects.json')
  async listCollects(@Headers('x-uniflow-mode') mode?: string) {
    return {
      collects: [
        { id: 901, collection_id: 301, product_id: 881290, position: 1 },
      ],
      mode: mode || 'SANDBOX',
    };
  }

  @ApiOperation({
    summary: '[Collect - Liên kết Danh mục] [GET /com/collects/:id.json] Chi tiết một liên kết sản phẩm - bộ sưu tập',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập / Collections] Endpoint gốc: GET https://apis.haravan.com/com/collects/{id}.json | Xem chi tiết thông tin một bản ghi liên kết giữa Product ID và Collection ID.',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '901' })
  @Get('com/collects/:id.json')
  async getCollectById(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      collect: { id: Number(id), collection_id: 301, product_id: 881290, position: 1, mode: mode || 'SANDBOX' },
    };
  }

  @ApiOperation({
    summary: '[Collect - Liên kết Danh mục] [DELETE /com/collects/:id.json] Gỡ sản phẩm khỏi bộ sưu tập (Xóa Collect)',
    description: '[Thuộc danh mục: 02. Products > Bộ sưu tập / Collections] Endpoint gốc: DELETE https://apis.haravan.com/com/collects/{id}.json | Hủy bỏ mối quan hệ liên kết, đưa sản phẩm ra khỏi Bộ sưu tập thủ công.',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiParam({ name: 'id', example: '901' })
  @Delete('com/collects/:id.json')
  async deleteCollect(@Param('id') id: string, @Headers('x-uniflow-mode') mode?: string) {
    return { success: true, deleted_collect_id: Number(id), mode: mode || 'SANDBOX' };
  }
}
