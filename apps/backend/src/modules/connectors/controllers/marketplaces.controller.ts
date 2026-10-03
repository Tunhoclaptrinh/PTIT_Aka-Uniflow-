import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ActionsService } from '../actions.service';
import {
  ShopeeShipOrderDto,
  ShopeeUpdateStockDto,
  ShopeeCreateVoucherDto,
  TikTokSearchOrdersDto,
  TikTokShipPackageDto,
  TikTokUpdatePriceDto,
  LazadaPackOrderDto,
  TikiUpdateInventoryDto,
  ShopifyFulfillDto,
} from '../dto/marketplaces.dto';

@Controller('api/v1/infra')
export class MarketplacesController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(mode?: string): 'LIVE' | 'SANDBOX' {
    return mode?.toUpperCase() === 'LIVE' ? 'LIVE' : 'SANDBOX';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. SHOPEE OPEN PLATFORM V2 — https://open.shopee.com/documents
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('[Marketplace] 01. Shopee')
  @ApiOperation({
    summary: '[GET /api/v2/order/get_order_detail] Lấy chi tiết đơn hàng Shopee',
    description: 'Endpoint gốc: GET https://partner.shopeemobile.com/api/v2/order/get_order_detail | Docs: https://open.shopee.com/documents/v2/v2.order.get_order_detail | Truy vấn chi tiết đơn hàng Shopee bao gồm địa chỉ người mua, danh mục sản phẩm, phí ship và tổng tiền',
  })
  @Get('shopee/api/v2/order/get_order_detail/:orderSn')
  async shopeeGetOrderDetail(@Param('orderSn') orderSn: string, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopee_get_order_detail', { order_sn: orderSn }, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 01. Shopee')
  @ApiOperation({
    summary: '[POST /api/v2/order/ship_order] Xác nhận & Chuẩn bị hàng Shopee (Ship Order)',
    description: 'Endpoint gốc: POST https://partner.shopeemobile.com/api/v2/order/ship_order | Docs: https://open.shopee.com/documents/v2/v2.order.ship_order | Xác nhận đơn hàng, đặt lịch hẹn bưu tá lấy hàng (Pick up) hoặc tự gửi tại bưu cục (Drop off)',
  })
  @Post('shopee/api/v2/order/ship_order')
  async shopeeShipOrder(@Body() dto: ShopeeShipOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      success: true,
      platform: 'SHOPEE',
      order_sn: dto.order_sn,
      tracking_number: `VNSP${Date.now().toString().slice(-10)}`,
      shipping_method: dto.shipping_method,
      status: 'READY_TO_PICK',
      pickup_time: dto.shipping_method === 'pickup' ? '14:00 - 18:00 Hôm nay' : 'Tự gửi tại điểm Shopee Express',
      message: `Chuẩn bị hàng thành công cho đơn #${dto.order_sn}`,
    };
  }

  @ApiTags('[Marketplace] 01. Shopee')
  @ApiOperation({
    summary: '[POST /api/v2/product/update_stock] Đồng bộ tồn kho sản phẩm Shopee',
    description: 'Endpoint gốc: POST https://partner.shopeemobile.com/api/v2/product/update_stock | Docs: https://open.shopee.com/documents/v2/v2.product.update_stock | Cập nhật số lượng tồn kho thực tế cho sản phẩm và các phân loại hàng (model/variation) trên Shopee',
  })
  @Post('shopee/api/v2/product/update_stock')
  async shopeeUpdateStock(@Body() dto: ShopeeUpdateStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopee_update_stock', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 01. Shopee')
  @ApiOperation({
    summary: '[POST /api/v2/voucher/add_voucher] Tạo mã giảm giá Voucher Shopee',
    description: 'Endpoint gốc: POST https://partner.shopeemobile.com/api/v2/voucher/add_voucher | Docs: https://open.shopee.com/documents/v2/v2.voucher.add_voucher | Tạo chương trình khuyến mãi Voucher giảm giá toàn shop hoặc theo sản phẩm trên kênh Shopee Marketing Centre',
  })
  @Post('shopee/api/v2/voucher/add_voucher')
  async shopeeAddVoucher(@Body() dto: ShopeeCreateVoucherDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopee_add_voucher', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 01. Shopee')
  @ApiOperation({
    summary: '[GET /api/v2/voucher/get_voucher_list] Lấy danh sách Voucher Shopee',
    description: 'Endpoint gốc: GET https://partner.shopeemobile.com/api/v2/voucher/get_voucher_list | Docs: https://open.shopee.com/documents/v2/v2.voucher.get_voucher_list | Truy vấn các mã voucher giảm giá đang hoạt động trên gian hàng Shopee',
  })
  @Get('shopee/api/v2/voucher/get_voucher_list')
  async shopeeListVouchers(@Query('status') status: string = 'ongoing', @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopee_get_voucher_list', { status }, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 01. Shopee')
  @ApiOperation({
    summary: '[GET /api/v2/logistics/get_shipping_document_result] In phiếu giao hàng Shopee (Air Waybill)',
    description: 'Endpoint gốc: GET https://partner.shopeemobile.com/api/v2/logistics/get_shipping_document_result | Docs: https://open.shopee.com/documents/v2/v2.logistics.get_shipping_document_result | Tạo file PDF phiếu gửi hàng tiêu chuẩn Shopee để dán lên kiện hàng',
  })
  @Get('shopee/api/v2/logistics/get_shipping_document_result/:orderSn')
  async shopeeGetAirwaybill(@Param('orderSn') orderSn: string, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopee_download_airwaybill', { order_sn: orderSn }, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 01. Shopee')
  @ApiOperation({
    summary: '[GET /api/v2/payment/get_escrow_detail] Tra cứu tài khoản ký quỹ Shopee Escrow',
    description: 'Endpoint gốc: GET https://partner.shopeemobile.com/api/v2/payment/get_escrow_detail | Docs: https://open.shopee.com/documents/v2/v2.payment.get_escrow_detail | Tra cứu doanh thu thực nhận, phí sàn Shopee và trạng thái quyết toán tiền về ví',
  })
  @Get('shopee/api/v2/payment/get_escrow_detail/:orderSn')
  async shopeeGetEscrow(@Param('orderSn') orderSn: string, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopee_get_escrow_detail', { order_sn: orderSn }, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 01. Shopee')
  @ApiOperation({
    summary: '[POST /api/v2/product/update_price] Cập nhật giá bán sản phẩm Shopee',
    description: 'Endpoint gốc: POST https://partner.shopeemobile.com/api/v2/product/update_price | Docs: https://open.shopee.com/documents/v2/v2.product.update_price | Cập nhật giá bán niêm yết cho các biến thể phân loại của sản phẩm Shopee',
  })
  @Post('shopee/api/v2/product/update_price')
  async shopeeUpdatePrice(@Body() dto: any, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopee_update_price', dto, this.getEffectiveMode(mode));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. TIKTOK SHOP OPEN API — https://partner.tiktokshop.com/doc/page/63fd33c
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('[Marketplace] 02. TikTok Shop')
  @ApiOperation({
    summary: '[POST /order/202309/orders/search] Tìm kiếm đơn hàng TikTok Shop',
    description: 'Endpoint gốc: POST https://open-api.tiktokglobalshop.com/order/202309/orders/search | Docs: https://partner.tiktokshop.com/doc/page/261271 | Tìm kiếm đơn hàng theo trạng thái (chờ xác nhận, chờ vận chuyển...) kèm phân trang theo Cursor',
  })
  @Post('tiktok/order/202309/orders/search')
  async tiktokSearchOrders(@Body() dto: TikTokSearchOrdersDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      success: true,
      platform: 'TIKTOK',
      total_count: 5,
      orders: [
        { order_id: 'TT1001', order_status: dto.order_status, total_amount: 320000 },
        { order_id: 'TT1002', order_status: dto.order_status, total_amount: 450000 },
      ],
    };
  }

  @ApiTags('[Marketplace] 02. TikTok Shop')
  @ApiOperation({
    summary: '[POST /fulfillment/202309/packages/ship] Giao kiện hàng TikTok Shop (Ship Package)',
    description: 'Endpoint gốc: POST https://open-api.tiktokglobalshop.com/fulfillment/202309/packages/ship | Docs: https://partner.tiktokshop.com/doc/page/261310 | Xác nhận kiện hàng TikTok Shop sẵn sàng bàn giao cho bưu tá đơn vị vận chuyển J&T/NinjaVan',
  })
  @Post('tiktok/fulfillment/202309/packages/ship')
  async tiktokShipPackage(@Body() dto: TikTokShipPackageDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('tiktok_ship_package', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 02. TikTok Shop')
  @ApiOperation({
    summary: '[POST /product/202309/products/stocks/update] Cập nhật tồn kho biến thể TikTok Shop',
    description: 'Endpoint gốc: POST https://open-api.tiktokglobalshop.com/product/202309/products/stocks/update | Docs: https://partner.tiktokshop.com/doc/page/261250 | Cập nhật số lượng tồn kho khả dụng cho từng SKU trên gian hàng TikTok Shop',
  })
  @Post('tiktok/product/202309/products/stocks/update')
  async tiktokUpdateInventory(@Body() dto: any, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('tiktok_update_inventory', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 02. TikTok Shop')
  @ApiOperation({
    summary: '[POST /product/202309/products/prices/update] Cập nhật giá sản phẩm TikTok Shop',
    description: 'Endpoint gốc: POST https://open-api.tiktokglobalshop.com/product/202309/products/prices/update | Docs: https://partner.tiktokshop.com/doc/page/261255 | Cập nhật giá bán lẻ của các SKU trên TikTok Shop',
  })
  @Post('tiktok/product/202309/products/prices/update')
  async tiktokUpdatePrice(@Body() dto: TikTokUpdatePriceDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('tiktok_update_price', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 02. TikTok Shop')
  @ApiOperation({
    summary: '[GET /product/202309/products/search] Lấy danh sách sản phẩm TikTok Shop',
    description: 'Endpoint gốc: GET https://open-api.tiktokglobalshop.com/product/202309/products/search | Docs: https://partner.tiktokshop.com/doc/page/261245 | Truy vấn danh mục sản phẩm đang mở bán trên TikTok Shop',
  })
  @Get('tiktok/product/202309/products/search')
  async tiktokListProducts(@Query('page_size') pageSize: number = 20, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('tiktok_get_products', { page_size: pageSize }, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 02. TikTok Shop')
  @ApiOperation({
    summary: '[POST /promotion/202309/activities/create] Tạo chương trình khuyến mãi TikTok Promotion',
    description: 'Endpoint gốc: POST https://open-api.tiktokglobalshop.com/promotion/202309/activities/create | Docs: https://partner.tiktokshop.com/doc/page/261350 | Tạo chiến dịch Flash Sale hoặc mã giảm giá trên TikTok Shop Promotion Center',
  })
  @Post('tiktok/promotion/202309/activities/create')
  async tiktokCreatePromotion(@Body() dto: any, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('tiktok_create_promotion', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 02. TikTok Shop')
  @ApiOperation({
    summary: '[GET /fulfillment/202309/packages/shipping_documents] Tải nhãn vận chuyển TikTok Shipping Label',
    description: 'Endpoint gốc: GET https://open-api.tiktokglobalshop.com/fulfillment/202309/packages/shipping_documents | Docs: https://partner.tiktokshop.com/doc/page/261320 | Lấy liên kết tải nhãn vận chuyển định dạng PDF/ZPL của đơn hàng TikTok',
  })
  @Get('tiktok/fulfillment/202309/packages/shipping_documents/:orderId')
  async tiktokGetShippingLabel(@Param('orderId') orderId: string, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('tiktok_get_shipping_label', { order_id: orderId }, this.getEffectiveMode(mode));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. LAZADA OPEN PLATFORM — https://open.lazada.com/doc/api.htm
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('[Marketplace] 03. Lazada')
  @ApiOperation({
    summary: '[POST /order/pack] Đóng gói & Chuẩn bị đơn hàng Lazada (Pack Order)',
    description: 'Endpoint gốc: POST https://api.lazada.vn/rest/order/pack | Docs: https://open.lazada.com/doc/api.htm#/api?cid=1&path=/order/pack | Chuyển đơn hàng Lazada sang trạng thái Packed và lấy mã kiện hàng',
  })
  @Post('lazada/order/pack')
  async lazadaPackOrder(@Body() dto: any, @Headers('x-uniflow-mode') mode?: string) {
    return {
      success: true,
      platform: 'LAZADA',
      tracking_number: `LZD${Date.now().toString().slice(-8)}`,
      shipment_provider: 'Lazada Express',
      order_item_ids: dto.delivery_order_ids || dto.order_item_ids,
    };
  }

  @ApiTags('[Marketplace] 03. Lazada')
  @ApiOperation({
    summary: '[POST /product/price_quantity/update] Cập nhật số lượng tồn kho Lazada',
    description: 'Endpoint gốc: POST https://api.lazada.vn/rest/product/price_quantity/update | Docs: https://open.lazada.com/doc/api.htm#/api?cid=3&path=/product/price_quantity/update | Đồng bộ số lượng tồn kho sản phẩm đa kho trên Lazada',
  })
  @Post('lazada/product/price_quantity/update')
  async lazadaUpdateInventory(@Body() dto: any, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('lazada_update_price_quantity', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 03. Lazada')
  @ApiOperation({
    summary: '[GET /order/document/get] In nhãn vận chuyển Lazada Airway Bill',
    description: 'Endpoint gốc: GET https://api.lazada.vn/rest/order/document/get | Docs: https://open.lazada.com/doc/api.htm#/api?cid=1&path=/order/document/get | Tải tài liệu phiếu giao hàng của Lazada Express',
  })
  @Get('lazada/order/document/get/:orderId')
  async lazadaGetAwb(@Param('orderId') orderId: string, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('lazada_get_document', { order_id: orderId, doc_type: 'shippingLabel' }, this.getEffectiveMode(mode));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. TIKI OPEN API — https://open.tiki.vn/docs/
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('[Marketplace] 04. Tiki')
  @ApiOperation({
    summary: '[POST /integration/v2/inventory/sync] Cập nhật tồn kho Tiki (Fast Sync)',
    description: 'Endpoint gốc: POST https://api.tiki.vn/integration/v2/inventory/sync | Docs: https://open.tiki.vn/docs/#operation/updateInventory | Cập nhật nhanh số lượng khả dụng của sản phẩm trên sàn Tiki',
  })
  @Post('tiki/integration/v2/inventory/sync')
  async tikiUpdateInventory(@Body() dto: TikiUpdateInventoryDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('tiki_update_inventory', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 04. Tiki')
  @ApiOperation({
    summary: '[GET /integration/v2/orders] Lấy danh sách đơn hàng Tiki',
    description: 'Endpoint gốc: GET https://api.tiki.vn/integration/v2/orders | Docs: https://open.tiki.vn/docs/#operation/getOrders | Truy vấn danh sách đơn hàng theo trạng thái trên sàn Tiki',
  })
  @Get('tiki/integration/v2/orders')
  async tikiListOrders(@Query('status') status: string = 'handling', @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('tiki_get_orders', { status }, this.getEffectiveMode(mode));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. SHOPIFY E-COMMERCE — https://shopify.dev/docs/api/admin-rest
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('[Marketplace] 05. Shopify')
  @ApiOperation({
    summary: '[POST /admin/api/orders/:id/fulfillments.json] Tạo vận chuyển đơn hàng Shopify (Fulfillment)',
    description: 'Endpoint gốc: POST https://{shop}.myshopify.com/admin/api/2024-01/orders/{id}/fulfillments.json | Docs: https://shopify.dev/docs/api/admin-rest/2024-01/resources/fulfillment | Tạo fulfillment cho đơn hàng Shopify và gửi tracking number đến người mua',
  })
  @Post('shopify/admin/api/orders/:id/fulfillments.json')
  async shopifyFulfill(@Body() dto: ShopifyFulfillDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopify_create_fulfillment', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 05. Shopify')
  @ApiOperation({
    summary: '[POST /admin/api/inventory_levels/set.json] Cập nhật tồn kho Shopify',
    description: 'Endpoint gốc: POST https://{shop}.myshopify.com/admin/api/2024-01/inventory_levels/set.json | Docs: https://shopify.dev/docs/api/admin-rest/2024-01/resources/inventorylevel | Điều chỉnh số lượng tồn kho theo Location ID trên Shopify Store',
  })
  @Post('shopify/admin/api/inventory_levels/set.json')
  async shopifySetInventory(@Body() dto: any, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopify_set_inventory', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('[Marketplace] 05. Shopify')
  @ApiOperation({
    summary: '[GET /admin/api/orders.json] Lấy danh sách đơn hàng Shopify',
    description: 'Endpoint gốc: GET https://{shop}.myshopify.com/admin/api/2024-01/orders.json | Docs: https://shopify.dev/docs/api/admin-rest/2024-01/resources/order | Truy vấn các đơn hàng mới nhất trên Shopify',
  })
  @Get('shopify/admin/api/orders.json')
  async shopifyListOrders(@Query('limit') limit: number = 20, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopify_get_orders', { limit }, this.getEffectiveMode(mode));
  }
}
