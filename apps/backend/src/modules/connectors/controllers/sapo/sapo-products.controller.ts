import { Controller, Post, Get, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger';
import { ActionsService } from '../../actions.service';
import {
  SapoCreateProductDto,
  SapoUpdateProductDto,
  SapoCreateCollectionDto,
  SapoCreateVariantDto,
} from '../../dto/pos-sapo.dto';

// ── 1. Product Resource ──
@ApiTags('[02. POS-Sapo] 05. Product')
@Controller('api/v1/infra/sapo')
export class SapoProductsController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[POST /admin/products.json] Thêm mới sản phẩm Sapo',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/products.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tạo sản phẩm, mã SKU và giá bán khởi tạo trên Sapo',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @ApiBody({ type: SapoCreateProductDto })
  @Post('admin/products.json')
  async createProduct(@Body() dto: SapoCreateProductDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_create_product', dto, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[GET /admin/products.json] Danh sách sản phẩm Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/products.json | Docs: https://support.sapo.vn/gioi-thieu-api | Truy vấn danh mục sản phẩm trên hệ thống Sapo',
  })
  @Get('admin/products.json')
  async listProducts(@Query('limit') limit = 20) {
    return {
      products: [
        { id: 1001, name: 'Áo Sơ Mi Nam Oxford Trắng', sku: 'SM-OXFORD-01', price: 350000 },
        { id: 1002, name: 'Quần Kaki Co Giãn Slimfit', sku: 'QK-SLIM-02', price: 420000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[GET /admin/products/:id.json] Chi tiết sản phẩm Sapo',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/products/{id}.json | Xem chi tiết sản phẩm và các biến thể phân loại',
  })
  @Get('admin/products/:id.json')
  async getProductById(@Param('id') id: string) {
    return {
      product: {
        id: Number(id),
        name: 'Áo Sơ Mi Nam Oxford Trắng',
        sku: 'SM-OXFORD-01',
        price: 350000,
        variants: [
          { id: 1001, option1: 'Trắng / M', price: 350000, inventory_quantity: 45 },
          { id: 1002, option1: 'Trắng / L', price: 350000, inventory_quantity: 55 },
        ],
      },
    };
  }

  @ApiOperation({
    summary: '[PUT /admin/products/:id.json] Cập nhật sản phẩm Sapo',
    description: 'Endpoint gốc: PUT https://{store_name}.mysapo.net/admin/products/{id}.json | Docs: https://support.sapo.vn/gioi-thieu-api | Cập nhật tên, giá bán hoặc giá vốn sản phẩm',
  })
  @ApiBody({ type: SapoUpdateProductDto })
  @Put('admin/products/:id.json')
  async updateProduct(@Param('id') id: string, @Body() dto: SapoUpdateProductDto) {
    return { success: true, product: { ...dto, id: Number(id) || dto.id }, updated_at: new Date().toISOString() };
  }

  @ApiOperation({
    summary: '[DELETE /admin/products/:id.json] Xóa sản phẩm Sapo',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/products/{id}.json | Xóa sản phẩm khỏi danh mục Sapo',
  })
  @Delete('admin/products/:id.json')
  async deleteProduct(@Param('id') id: string) {
    return { success: true, deleted_id: id, message: `Đã xóa sản phẩm #${id}` };
  }
}

// ── 2. Product Variant Resource ──
@ApiTags('[02. POS-Sapo] 06. Product Variant')
@Controller('api/v1/infra/sapo')
export class SapoVariantsController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  @ApiOperation({
    summary: '[GET /admin/variants.json] Lấy danh sách biến thể toàn cửa hàng',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/variants.json | Lấy danh mục biến thể sản phẩm, SKU và tồn khả dụng tại từng kho Sapo',
  })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'SANDBOX hoặc LIVE' })
  @Get('admin/variants.json')
  async getVariants(@Query('limit') limit = 20, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_get_variants', { limit }, this.getEffectiveMode(mode));
  }

  @ApiOperation({
    summary: '[GET /admin/products/:id/variants.json] Lấy biến thể theo sản phẩm',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/products/{id}/variants.json | Danh sách biến thể thuộc một sản phẩm cụ thể',
  })
  @Get('admin/products/:id/variants.json')
  async getProductVariants(@Param('id') id: string) {
    return {
      variants: [
        { id: 201, product_id: Number(id), title: 'Size S / Đen', price: 290000, sku: `SKU-${id}-S`, inventory_quantity: 20 },
        { id: 202, product_id: Number(id), title: 'Size M / Đen', price: 290000, sku: `SKU-${id}-M`, inventory_quantity: 35 },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /admin/products/:id/variants.json] Thêm biến thể cho sản phẩm',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/products/{id}/variants.json | Tạo biến thể quy cách mới cho sản phẩm',
  })
  @ApiBody({ type: SapoCreateVariantDto })
  @Post('admin/products/:id/variants.json')
  async createVariant(@Param('id') id: string, @Body() body: SapoCreateVariantDto) {
    return {
      variant: { id: Date.now(), product_id: Number(id), title: body.title || 'Biến thể mới', price: body.price || 100000, sku: body.sku || `SKU-${Date.now()}` },
    };
  }
}

// ── 3. Product Image Resource ──
@ApiTags('[02. POS-Sapo] 07. Product Image')
@Controller('api/v1/infra/sapo')
export class SapoProductImagesController {
  @ApiOperation({
    summary: '[GET /admin/products/:id/images.json] Danh sách hình ảnh sản phẩm',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/products/{id}/images.json | Lấy danh sách URL ảnh sản phẩm trên Sapo',
  })
  @Get('admin/products/:id/images.json')
  async getProductImages(@Param('id') id: string) {
    return {
      images: [
        { id: 101, product_id: Number(id), position: 1, src: 'https://cdn.mysapo.net/sample1.jpg' },
        { id: 102, product_id: Number(id), position: 2, src: 'https://cdn.mysapo.net/sample2.jpg' },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /admin/products/:id/images.json] Tải lên hình ảnh sản phẩm',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/products/{id}/images.json | Thêm ảnh đại diện hoặc ảnh thư viện cho sản phẩm',
  })
  @Post('admin/products/:id/images.json')
  async uploadProductImage(@Param('id') id: string, @Body('src') src: string) {
    return {
      image: { id: Date.now(), product_id: Number(id), src: src || 'https://cdn.mysapo.net/uploaded.jpg', position: 1 },
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/products/:product_id/images/:id.json] Xóa hình ảnh sản phẩm',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/products/{product_id}/images/{id}.json | Xóa hình ảnh sản phẩm',
  })
  @Delete('admin/products/:product_id/images/:id.json')
  async deleteProductImage(@Param('product_id') productId: string, @Param('id') id: string) {
    return { success: true, deleted_id: Number(id), message: 'Đã xóa ảnh sản phẩm' };
  }
}

// ── 4. CustomCollection Resource ──
@ApiTags('[02. POS-Sapo] 08. CustomCollection')
@Controller('api/v1/infra/sapo')
export class SapoCustomCollectionsController {
  @ApiOperation({
    summary: '[POST /admin/custom_collections.json] Tạo nhóm sản phẩm thủ công',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/custom_collections.json | Docs: https://support.sapo.vn/gioi-thieu-api | Tạo bộ sưu tập / nhóm sản phẩm tùy chọn thủ công',
  })
  @ApiBody({ type: SapoCreateCollectionDto })
  @Post('admin/custom_collections.json')
  async createCustomCollection(@Body() dto: SapoCreateCollectionDto) {
    return {
      custom_collection: {
        id: Date.now(),
        title: dto.title,
        body_html: dto.body_html || '',
        published: (dto as any).published ?? true,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[GET /admin/custom_collections.json] Danh sách nhóm sản phẩm thủ công',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/custom_collections.json | Danh sách các nhóm sản phẩm thủ công trên Sapo',
  })
  @Get('admin/custom_collections.json')
  async listCustomCollections() {
    return {
      custom_collections: [
        { id: 1, title: 'Thời trang Nam 2026', products_count: 24 },
        { id: 2, title: 'Hàng bán chạy Best Seller', products_count: 12 },
      ],
    };
  }
}

// ── 5. SmartCollection Resource ──
@ApiTags('[02. POS-Sapo] 09. SmartCollection')
@Controller('api/v1/infra/sapo')
export class SapoSmartCollectionsController {
  @ApiOperation({
    summary: '[GET /admin/smart_collections.json] Danh sách nhóm sản phẩm thông minh',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/smart_collections.json | Tra cứu nhóm sản phẩm tự động gán theo điều kiện lọc (Smart Collection)',
  })
  @Get('admin/smart_collections.json')
  async listSmartCollections() {
    return {
      smart_collections: [
        { id: 10, title: 'Sản phẩm dưới 200k', rules: [{ column: 'variant_price', relation: 'less_than', condition: '200000' }] },
      ],
    };
  }

  @ApiOperation({
    summary: '[POST /admin/smart_collections.json] Tạo nhóm sản phẩm thông minh theo quy tắc',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/smart_collections.json | Tạo bộ sưu tập tự động phân loại theo tag, giá hoặc nhà sản xuất',
  })
  @ApiBody({ type: SapoCreateCollectionDto })
  @Post('admin/smart_collections.json')
  async createSmartCollection(@Body() body: SapoCreateCollectionDto) {
    return {
      smart_collection: { id: Date.now(), title: body.title || 'Bộ sưu tập tự động', rules: body.rules || [], created_at: new Date().toISOString() },
    };
  }
}

// ── 6. Collect Resource ──
@ApiTags('[02. POS-Sapo] 10. Collect')
@Controller('api/v1/infra/sapo')
export class SapoCollectsController {
  @ApiOperation({
    summary: '[POST /admin/collects.json] Gán sản phẩm vào bộ sưu tập',
    description: 'Endpoint gốc: POST https://{store_name}.mysapo.net/admin/collects.json | Liên kết một sản phẩm vào Custom Collection',
  })
  @Post('admin/collects.json')
  async addProductToCollection(@Body('product_id') productId: number, @Body('collection_id') collectionId: number) {
    return {
      collect: { id: Date.now(), collection_id: collectionId, product_id: productId, created_at: new Date().toISOString() },
    };
  }

  @ApiOperation({
    summary: '[GET /admin/collects.json] Danh sách liên kết sản phẩm - bộ sưu tập',
    description: 'Endpoint gốc: GET https://{store_name}.mysapo.net/admin/collects.json | Tra cứu danh sách liên kết sản phẩm trong bộ sưu tập',
  })
  @Get('admin/collects.json')
  async listCollects(@Query('collection_id') collectionId?: number) {
    return {
      collects: [
        { id: 501, collection_id: collectionId || 1, product_id: 1001 },
        { id: 502, collection_id: collectionId || 1, product_id: 1002 },
      ],
    };
  }

  @ApiOperation({
    summary: '[DELETE /admin/collects/:id.json] Gỡ sản phẩm khỏi bộ sưu tập',
    description: 'Endpoint gốc: DELETE https://{store_name}.mysapo.net/admin/collects/{id}.json | Hủy liên kết sản phẩm khỏi nhóm sản phẩm',
  })
  @Delete('admin/collects/:id.json')
  async deleteCollect(@Param('id') id: string) {
    return { success: true, deleted_id: Number(id), message: 'Đã gỡ sản phẩm khỏi bộ sưu tập' };
  }
}
