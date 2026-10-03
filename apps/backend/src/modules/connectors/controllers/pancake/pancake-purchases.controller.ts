import { Controller, Post, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { PancakePosCreatePurchaseDto, PancakePosUpdatePurchaseDto } from '../../dto/pos-pancake.dto';

@ApiTags('[02. POS-Pancake] 06. Purchases & Suppliers (Nhập hàng & Nhà cung cấp)')
@Controller('api/v1/infra/pancake')
export class PancakePurchasesController {

  @ApiOperation({
    summary: '[Purchase - Danh sách đơn nhập hàng] [GET /shops/:shopId/purchases] Danh sách đơn nhập mua hàng từ NCC',
    description: '[Thuộc danh mục: 18. Purchase > Danh sách nhập hàng] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/purchases | Docs: https://docs.pancake.biz/pos/api/ | Tra cứu đơn nhập hàng từ nhà cung cấp',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/purchases')
  async listPurchasesOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      purchases: [
        { id: 1, purchase_code: 'NH_001', supplier_name: 'NCC Dệt May Tân Bình', total_amount: 18000000, status: 'received' },
      ],
    };
  }

  @ApiOperation({
    summary: '[Purchase - Tạo đơn nhập hàng] [POST /shops/:shopId/purchases] Lập đơn nhập hàng mới',
    description: '[Thuộc danh mục: 18. Purchase > Tạo đơn nhập] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/purchases | Khởi tạo phiếu nhập kho mua hàng',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiBody({ type: PancakePosCreatePurchaseDto })
  @Post('shops/:shopId/purchases')
  async createPurchaseOfficial(@Param('shopId') shopId: string, @Body() dto: PancakePosCreatePurchaseDto) {
    return {
      success: true,
      shop_id: shopId,
      purchase: { id: Date.now(), purchase_code: `NH_${Date.now().toString().slice(-6)}`, ...dto, status: 'draft' },
    };
  }

  @ApiOperation({
    summary: '[Purchase - Sửa đơn nhập hàng] [PUT /shops/:shopId/purchases/:purchaseId] Cập nhật đơn nhập hàng',
    description: '[Thuộc danh mục: 18. Purchase > Sửa đơn nhập] Endpoint gốc: PUT https://pos.pages.fm/api/v1/shops/{SHOP_ID}/purchases/{PURCHASE_ID} | Cập nhật số lượng, đơn giá nhập kho',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @ApiParam({ name: 'purchaseId', example: '1' })
  @ApiBody({ type: PancakePosUpdatePurchaseDto })
  @Put('shops/:shopId/purchases/:purchaseId')
  async updatePurchaseOfficial(@Param('shopId') shopId: string, @Param('purchaseId') purchaseId: string, @Body() body: PancakePosUpdatePurchaseDto) {
    return {
      success: true,
      purchase_id: Number(purchaseId),
      ...body,
      updated_at: new Date().toISOString(),
    };
  }

  @ApiOperation({
    summary: '[Purchase - Tách đơn nhập hàng] [POST /shops/:shopId/purchases/separate] Tách phiếu nhập hàng',
    description: '[Thuộc danh mục: 18. Purchase > Tách đơn] Endpoint gốc: POST https://pos.pages.fm/api/v1/shops/{SHOP_ID}/purchases/separate | Tách các dòng sản phẩm sang đơn nhập mới',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Post('shops/:shopId/purchases/separate')
  async separatePurchaseOfficial(@Param('shopId') shopId: string, @Body() body: { purchase_id: number; items: any[] }) {
    return {
      success: true,
      shop_id: shopId,
      original_purchase_id: body.purchase_id,
      new_purchase_id: Date.now(),
      message: 'Tách đơn nhập hàng thành công',
    };
  }

  @ApiOperation({
    summary: '[Supplier - Danh sách nhà cung cấp] [GET /shops/:shopId/supplier] Danh sách nhà cung cấp',
    description: '[Thuộc danh mục: 17. Supplier > Danh sách NCC] Endpoint gốc: GET https://pos.pages.fm/api/v1/shops/{SHOP_ID}/supplier | Quản lý danh bạ đối tác nhà cung cấp',
  })
  @ApiParam({ name: 'shopId', example: '1092841' })
  @Get('shops/:shopId/supplier')
  async listSuppliersOfficial(@Param('shopId') shopId: string) {
    return {
      success: true,
      shop_id: shopId,
      suppliers: [
        { id: 1, name: 'NCC Dệt May Tân Bình', phone: '0901122334', debt: 5400000 },
        { id: 2, name: 'Công ty Phụ liệu May Mặc Á Châu', phone: '0918899776', debt: 0 },
      ],
    };
  }
}
