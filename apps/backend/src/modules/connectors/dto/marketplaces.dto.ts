import { ApiProperty } from '@nestjs/swagger';

export class ShopeeShipOrderDto {
  @ApiProperty({ example: '241003XYZ8899', description: 'Mã số đơn hàng Shopee (ordersn)' })
  order_sn: string;
  @ApiProperty({ example: 'pickup', enum: ['pickup', 'dropoff'], description: 'Phương thức giao hàng: bưu tá lấy hoặc tự gửi bưu cục' })
  shipping_method: string;
  @ApiProperty({ example: '17:00 - 19:00', description: 'Khung giờ hẹn bưu tá lấy hàng', required: false })
  pickup_time_slot?: string;
}

export class ShopeeUpdateStockDto {
  @ApiProperty({ example: 129038102, description: 'ID sản phẩm Shopee (item_id)' })
  item_id: number;
  @ApiProperty({
    example: [{ model_id: 99120, normal_stock: 45 }],
    description: 'Danh sách biến thể phân loại (model) và số lượng tồn mới',
  })
  stock_list: any[];
}

export class ShopeeCreateVoucherDto {
  @ApiProperty({ example: 'SHOPEE_TET_2026', description: 'Tên chiến dịch Voucher' })
  voucher_name: string;
  @ApiProperty({ example: 'VOUCHER_CODE_SHOP', description: 'Mã voucher khách nhập' })
  voucher_code: string;
  @ApiProperty({ example: 1, enum: [1, 2], description: 'Kiểu chiết khấu: 1 (Cố định), 2 (Phần trăm)' })
  discount_type: number;
  @ApiProperty({ example: 20000, description: 'Số tiền hoặc % giảm giá' })
  discount_amount: number;
  @ApiProperty({ example: 200000, description: 'Giá trị giỏ hàng tối thiểu' })
  min_basket_price: number;
  @ApiProperty({ example: 100, description: 'Số lượt sử dụng tối đa' })
  usage_quantity: number;
}

export class TikTokSearchOrdersDto {
  @ApiProperty({ example: 10, description: 'Số lượng đơn hàng mỗi trang' })
  page_size: number;
  @ApiProperty({ example: 'AWAITING_SHIPMENT', enum: ['UNPAID', 'AWAITING_SHIPMENT', 'AWAITING_COLLECTION', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'], description: 'Trạng thái đơn hàng TikTok Shop' })
  order_status: string;
  @ApiProperty({ example: 'eyJvZmZzZXQiOjEwfQ==', description: 'Con trỏ trang tiếp theo (Next Page Cursor)', required: false })
  cursor?: string;
}

export class TikTokShipPackageDto {
  @ApiProperty({ example: 'PKG_TT_998822', description: 'Mã kiện hàng (package_id) trên TikTok Shop' })
  package_id: string;
  @ApiProperty({ example: 'PICKUP', enum: ['PICKUP', 'DROP_OFF'], description: 'Phương thức vận chuyển' })
  pick_up_type: string;
}

export class TikTokUpdatePriceDto {
  @ApiProperty({ example: '72819201928', description: 'ID sản phẩm TikTok Shop (product_id)' })
  product_id: string;
  @ApiProperty({
    example: [{ sku_id: 'SKU_TT_01', original_price: '250000' }],
    description: 'Danh sách mã SKU và giá bán cập nhật',
  })
  skus: any[];
}

export class LazadaPackOrderDto {
  @ApiProperty({ example: [789123456], description: 'Danh sách ID đơn hàng vận chuyển (delivery_order_ids)' })
  delivery_order_ids: number[];
  @ApiProperty({ example: 'Standard', description: 'Gói vận chuyển Lazada Express' })
  shipping_provider?: string;
}

export class TikiUpdateInventoryDto {
  @ApiProperty({ example: [{ product_id: 55412, qty: 50 }], description: 'Danh sách sản phẩm Tiki và số lượng tồn' })
  items: any[];
}

export class ShopifyFulfillDto {
  @ApiProperty({ example: 55891209, description: 'ID đơn hàng Shopify' })
  order_id: number;
  @ApiProperty({ example: 'VNPost_Express_998', description: 'Mã tracking vận chuyển quốc tế/nội địa' })
  tracking_number: string;
  @ApiProperty({ example: 'VNPost', description: 'Tên hãng chuyển phát' })
  tracking_company: string;
}
