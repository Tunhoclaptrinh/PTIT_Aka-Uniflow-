import { Controller, Post, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  PancakeCreateProductDto,
  PancakeUpdateProductDto,
  PancakePosCreateProductDto,
  PancakePosUpdateVariationQuantityDto,
  PancakePosCreateComboDto,
} from '../../dto/pos-pancake.dto';

@ApiTags('[POS-Pancake] 04. Products & Categories (Sản phẩm, Biến thể & Danh mục)')
@Controller('api/v1/infra/pancake')
export class PancakeProductsController {

  @ApiOperation({
    summary: '[Product - Tạo sản phẩm] [POST /shops/:shopId/products] Tạo mới sản phẩm trên Pancake POS',
    description: '[Thuộc danh mục: 16. Product > Tạo sản phẩm] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/products | Docs: https://docs.pancake.biz/pos/api/ | Thêm sản phẩm mới kèm giá vốn và giá niêm yết',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateProductDto })
  @Post('shops/:shopId/products')
  async createProductOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosCreateProductDto) {
    return {
      success: true,
      shop_id: shopId,
      product: {
        id: Date.now(),
        ...dto,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiOperation({
    summary: '[Product - Sửa sản phẩm] [PUT /shops/:shopId/products/:productId] Cập nhật thông tin sản phẩm',
    description: '[Thuộc danh mục: 16. Product > Sửa sản phẩm] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID}/products/{PRODUCT_ID} | Cập nhật tên, giá hoặc mô tả sản phẩm',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'productId', example: '1001' })
  @Put('shops/:shopId/products/:productId')
  async updateProductOfficial(@Param('shopId') shopId: string, @Param('productId') productId: string, @Body() body: any) {
    return {
      success: true,
      shop_id: shopId,
      product_id: productId,
      ...body,
      updated_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Variation - Cập nhật tồn kho] [POST /shops/:shopId/variations/:variationId/update_quantity] Cập nhật tồn kho một biến thể',
    description: '[Thuộc danh mục: 16. Product > Tồn biến thể] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/variations/{VARIATION_ID}/update_quantity | Điều chỉnh số lượng tồn kho của biến thể',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'variationId', example: 'VAR_1001' })
  @ApiBody({ type: PancakePosUpdateVariationQuantityDto })
  @Post('shops/:shopId/variations/:variationId/update_quantity')
  async updateVariationQuantityOfficial(
    @Param('shopId') shopId: string,
    @Param('variationId') variationId: string,
    @Body() dto: PancakePosUpdateVariationQuantityDto,
  ) {
    return {
      success: true,
      shop_id: shopId,
      variation_id: variationId,
      new_quantity: dto.quantity,
      updated_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Variation - Cập nhật tồn hàng loạt] [POST /shops/:shopId/variations/update_quantity] Cập nhật tồn kho nhiều biến thể',
    description: '[Thuộc danh mục: 16. Product > Tồn hàng loạt] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/variations/update_quantity | Cập nhật tồn kho đồng thời cho nhiều biến thể',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Post('shops/:shopId/variations/update_quantity')
  async updateMultiVariationsQuantityOfficial(@Param('shopId') shopId: string, @Body() body: any) {
    return {
      success: true,
      shop_id: shopId,
      updated_count: (body.variations || []).length || 1,
      message: 'Cập nhật tồn kho hàng loạt thành công',
    };
  }

  @ApiOperation({
    summary: '[Composite - Sản phẩm đóng gói] [POST /shops/:shopId/variations/update_composite_product] Cập nhật sản phẩm combo đóng gói',
    description: '[Thuộc danh mục: 16. Product > Sản phẩm đóng gói] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/variations/update_composite_product | Cấu hình định mức nguyên liệu / thành phần',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Post('shops/:shopId/variations/update_composite_product')
  async updateCompositeProductOfficial(@Param('shopId') shopId: string, @Body() body: any) {
    return {
      success: true,
      shop_id: shopId,
      message: 'Cập nhật sản phẩm đóng gói thành công',
    };
  }

  @ApiOperation({
    summary: '[Product - Danh sách biến thể] [GET /shops/:shopId/products/variations] Danh sách sản phẩm và các biến thể',
    description: '[Thuộc danh mục: 16. Product > Danh sách biến thể] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/products/variations | Phân trang danh sách sản phẩm và toàn bộ biến thể SKU',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiQuery({ name: 'page_number', example: 1, required: false })
  @ApiQuery({ name: 'page_size', example: 30, required: false })
  @Get('shops/:shopId/products/variations')
  async listProductVariationsOfficial(
    @Param('shopId') shopId: string,
    @Query('page_number') pageNumber = 1,
    @Query('page_size') pageSize = 30,
  ) {
    return {
      success: true,
      shop_id: shopId,
      page_number: Number(pageNumber),
      page_size: Number(pageSize),
      variations: [
        {
          id: 'VAR_1001',
          product_name: 'Váy Hoa Nhí Vintage',
          sku: 'VAY-HOA-L',
          price: 320000,
          remain_quantity: 45,
        },
      ],
    };
  }

  @ApiOperation({
    summary: '[Product - Chi tiết theo SKU] [GET /shops/:shopId/products/:productSku] Lấy thông tin sản phẩm theo mã SKU',
    description: '[Thuộc danh mục: 16. Product > Chi tiết theo SKU] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/products/{PRODUCT_SKU} | Tra cứu chi tiết sản phẩm theo mã SKU',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'productSku', example: 'VAY-HOA-L' })
  @Get('shops/:shopId/products/:productSku')
  async getProductBySkuOfficial(@Param('shopId') shopId: string, @Param('productSku') productSku: string) {
    return {
      success: true,
      product: {
        id: 1001,
        shop_id: shopId,
        name: 'Váy Hoa Nhí Vintage',
        sku: productSku,
        price: 320000,
        remain_quantity: 45,
      },
    };
  }

  @ApiOperation({
    summary: '[Product - Ẩn/Hiện sản phẩm] [PUT /shops/:shopId/products/update_hide] Ẩn hoặc hiện sản phẩm trên kênh bán',
    description: '[Thuộc danh mục: 16. Product > Ẩn/Hiện] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID}/products/update_hide | Ngừng hiển thị sản phẩm trên web/social',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Put('shops/:shopId/products/update_hide')
  async updateHideProductOfficial(@Param('shopId') shopId: string, @Body() body: { product_ids: number[]; is_hide: boolean }) {
    return {
      success: true,
      shop_id: shopId,
      is_hide: body.is_hide,
      updated_count: (body.product_ids || []).length || 1,
    };
  }

  @ApiOperation({
    summary: '[Product Tag - Nhãn sản phẩm] [POST /shops/:shopId/tags_products] Tạo thẻ nhãn sản phẩm',
    description: '[Thuộc danh mục: 16. Product > Nhãn sản phẩm] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/tags_products | Gán nhãn hàng hot, hàng mới về, xả kho',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Post('shops/:shopId/tags_products')
  async createProductTagOfficial(@Param('shopId') shopId: string, @Body() body: { name: string; color?: string }) {
    return {
      success: true,
      shop_id: shopId,
      tag: { id: Date.now(), name: body.name, color: body.color || '#3b82f6' },
    };
  }

  @ApiOperation({
    summary: '[Category - Danh mục sản phẩm] [GET /shops/:shopId/categories] Danh sách danh mục sản phẩm',
    description: '[Thuộc danh mục: 16. Product > Danh mục] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/categories | Lấy cây phân loại danh mục sản phẩm',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/categories')
  async listCategoriesOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      categories: [
        { id: 1, name: 'Thời Trang Nữ', code: 'THOI_TRANG_NU' },
        { id: 2, name: 'Đầm & Váy', parent_id: 1, code: 'DAM_VAY' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Category - Tạo danh mục] [POST /shops/:shopId/categories] Tạo mới danh mục sản phẩm',
    description: '[Thuộc danh mục: 16. Product > Tạo danh mục] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/categories | Thêm mới nhóm hàng hóa',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Post('shops/:shopId/categories')
  async createCategoryOfficial(@Param('shopId') shopId: string, @Body() body: { name: string; parent_id?: number }) {
    return {
      success: true,
      shop_id: shopId,
      category: { id: Date.now(), name: body.name, parent_id: body.parent_id || null },
    };
  }

  @ApiOperation({
    summary: '[Brand - Thương hiệu] [GET /shops/:shopId/brand] Danh sách thương hiệu sản phẩm',
    description: '[Thuộc danh mục: 16. Product > Thương hiệu] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/brand | Danh sách các nhãn hàng / nhà chế tạo',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/brand')
  async listBrandsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      brands: [
        { id: 1, name: 'UniFlow Fashion' },
        { id: 2, name: 'Vintage Chic' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Material - Chất liệu] [GET /shops/:shopId/materials_products] Danh mục chất liệu sản phẩm',
    description: '[Thuộc danh mục: 16. Product > Chất liệu] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/materials_products | Danh mục chất liệu vải, nguyên liệu',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/materials_products')
  async listMaterialsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      materials: [
        { id: 1, name: 'Cotton 100%' },
        { id: 2, name: 'Lụa Tơ Tằm' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Measurement - Đơn vị tính] [GET /shops/:shopId/product_measurements/get_measure] Bảng quy đổi kích thước & ĐVT',
    description: '[Thuộc danh mục: 16. Product > ĐVT] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/product_measurements/get_measure | Bảng quy đổi đơn vị tính (Cái, Bộ, Thùng, Kg)',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/product_measurements/get_measure')
  async getProductMeasurementsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      measurements: [
        { id: 1, name: 'Cái' },
        { id: 2, name: 'Bộ' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Combo - Danh sách Combo] [GET /shops/:shopId/combo_products] Danh sách sản phẩm combo',
    description: '[Thuộc danh mục: 24. Combo > Danh sách combo] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/combo_products | Danh sách gói combo sản phẩm bán kèm ưu đãi',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/combo_products')
  async listComboProductsOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      combos: [
        { id: 1, name: 'Combo Áo + Váy Mùa Thu', sku: 'COMBO-FALL-01', price: 550000 },
      ],
    };
  }

  @ApiOperation({
    summary: '[Combo - Tạo Combo] [POST /shops/:shopId/combo_products] Tạo sản phẩm combo mới',
    description: '[Thuộc danh mục: 24. Combo > Tạo combo] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/combo_products | Thiết lập gói sản phẩm combo gồm nhiều mặt hàng thành phần',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreateComboDto })
  @Post('shops/:shopId/combo_products')
  async createComboProductOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosCreateComboDto) {
    return {
      success: true,
      shop_id: shopId,
      combo: { id: Date.now(), ...dto, created_at: new Date().toISOString() },
    };
  }

  // ════════════════════════════════════════════════════════════════
  // BACKWARD COMPATIBILITY
  // ════════════════════════════════════════════════════════════════

  @ApiOperation({ summary: '[Product - Tạo sản phẩm rút gọn] [POST /products/create] Thêm sản phẩm lên Pancake Store', description: 'Thêm sản phẩm mới lên kho bán hàng Pancake Store' })
  @Post('products/create')
  async createProduct(@Body() dto: PancakeCreateProductDto) {
    return { success: true, product: { id: Date.now(), ...dto } };
  }

  @ApiOperation({ summary: '[Product - Danh mục rút gọn] [GET /products/list] Truy vấn danh sách sản phẩm', description: 'Truy vấn danh sách sản phẩm' })
  @ApiQuery({ name: 'page_id', example: 'PAGE_1092841', required: false })
  @Get('products/list')
  async listProducts(@Query('page_id') pageId: string = 'PAGE_1092841') {
    return {
      products: [
        { id: 1, page_id: pageId, sku: 'VAY-HOA-L', name: 'Váy Hoa Nhí Vintage', price: 320000, quantity: 45 },
      ],
    };
  }

  @ApiOperation({ summary: '[Product - Cập nhật rút gọn] [PUT /products/update] Cập nhật giá bán sản phẩm', description: 'Cập nhật giá bán, tên sản phẩm' })
  @Put('products/update')
  async updateProduct(@Body() dto: PancakeUpdateProductDto) {
    return { success: true, updated: true, sku: dto.sku, new_price: dto.price };
  }
}
