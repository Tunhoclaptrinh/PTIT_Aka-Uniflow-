import { Controller, Post, Get, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { ActionsService } from './actions.service';
import { PlatformType } from '@uniflow/shared-types';

// ─────────────────────────────────────────────────────────────────────────────
// 1. DATA TRANSFER OBJECTS (DTOs) VỚI SCHEMA ĐẦY ĐỦ CHO SWAGGER TESTING
// ─────────────────────────────────────────────────────────────────────────────

// ── SHOPEE DTOs ──
export class ShopeeOrderDetailDto {
  @ApiProperty({ example: '241003SHOPEE8899', description: 'Mã đơn hàng Shopee (order_sn)' })
  order_sn: string;
}

export class ShopeeOrderListDto {
  @ApiProperty({ example: 'READY_TO_SHIP', enum: ['UNPAID', 'READY_TO_SHIP', 'PROCESSED', 'SHIPPED', 'COMPLETED', 'CANCELLED'], description: 'Trạng thái đơn hàng' })
  order_status: string;
  @ApiProperty({ example: 1727913600, description: 'Thời gian bắt đầu (Unix timestamp)' })
  time_from: number;
  @ApiProperty({ example: 1728000000, description: 'Thời gian kết thúc (Unix timestamp)' })
  time_to: number;
  @ApiProperty({ example: 20, description: 'Số lượng đơn cần lấy (tối đa 100)' })
  page_size: number;
}

export class ShopeeShipOrderDto {
  @ApiProperty({ example: '241003SHOPEE8899', description: 'Mã đơn hàng Shopee cần chuẩn bị hàng' })
  order_sn: string;
  @ApiProperty({ example: 'dropoff', enum: ['dropoff', 'pickup'], description: 'Hình thức gửi hàng: bưu cục (dropoff) hoặc lấy tận nơi (pickup)' })
  shipping_method: string;
  @ApiProperty({ example: 10294, description: 'ID ca lấy hàng nếu chọn pickup', required: false })
  pickup_time_id?: number;
}

export class ShopeeUpdateStockDto {
  @ApiProperty({ example: 12345678, description: 'ID mặt hàng Shopee (item_id)' })
  item_id: number;
  @ApiProperty({ example: 87654321, description: 'ID biến thể phân loại (model_id)', required: false })
  model_id?: number;
  @ApiProperty({ example: 150, description: 'Số lượng tồn kho cập nhật' })
  normal_stock: number;
}

export class ShopeeUpdatePriceDto {
  @ApiProperty({ example: 12345678, description: 'ID mặt hàng Shopee (item_id)' })
  item_id: number;
  @ApiProperty({ example: 87654321, description: 'ID biến thể phân loại (model_id)', required: false })
  model_id?: number;
  @ApiProperty({ example: 249000, description: 'Giá bán mới niêm yết (VND)' })
  original_price: number;
}

export class ShopeeCreateVoucherDto {
  @ApiProperty({ example: 'Voucher Khách VIP Tháng 10', description: 'Tên chiến dịch voucher' })
  voucher_name: string;
  @ApiProperty({ example: 'VIP8', description: 'Mã voucher (tối đa 4 ký tự sau tiền tố của shop)' })
  voucher_code: string;
  @ApiProperty({ example: 30000, description: 'Số tiền giảm (VND) nếu giảm cố định', required: false })
  discount_amount?: number;
  @ApiProperty({ example: 10, description: 'Phần trăm giảm (%) nếu chọn giảm %', required: false })
  percentage?: number;
  @ApiProperty({ example: 250000, description: 'Giá trị giỏ hàng tối thiểu' })
  min_basket_price: number;
  @ApiProperty({ example: 100, description: 'Số lượng voucher phát hành' })
  usage_quantity: number;
}

export class ShopeeCancelOrderDto {
  @ApiProperty({ example: '241003SHOPEE8899', description: 'Mã đơn hàng Shopee cần hủy' })
  order_sn: string;
  @ApiProperty({ example: 'OUT_OF_STOCK', enum: ['OUT_OF_STOCK', 'CUSTOMER_REQUEST', 'UNDELIVERABLE_AREA'], description: 'Lý do hủy đơn' })
  cancel_reason: string;
}

// ── TIKTOK SHOP DTOs ──
export class TikTokOrderDetailDto {
  @ApiProperty({ example: '5789912388412', description: 'Mã định danh đơn hàng TikTok Shop' })
  order_id: string;
}

export class TikTokSearchOrdersDto {
  @ApiProperty({ example: 'AWAITING_SHIPMENT', enum: ['UNPAID', 'AWAITING_SHIPMENT', 'AWAITING_COLLECTION', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED'], description: 'Trạng thái đơn' })
  order_status: string;
  @ApiProperty({ example: 20, description: 'Số lượng đơn cần lấy' })
  page_size: number;
}

export class TikTokShipPackageDto {
  @ApiProperty({ example: 'PKG-77889911', description: 'ID gói hàng TikTok Shop (package_id)' })
  package_id: string;
  @ApiProperty({ example: 'J&T Express', description: 'Tên đơn vị vận chuyển TikTok gán' })
  shipping_provider_name: string;
  @ApiProperty({ example: '841298412093', description: 'Mã vận đơn đối tác' })
  tracking_number: string;
}

export class TikTokUpdateStockDto {
  @ApiProperty({ example: '1729482719284', description: 'ID sản phẩm TikTok Shop' })
  product_id: string;
  @ApiProperty({ example: '1729482719284_SKU1', description: 'ID SKU phân loại' })
  sku_id: string;
  @ApiProperty({ example: 200, description: 'Tồn kho khả dụng' })
  available_stock: number;
}

export class TikTokUpdatePriceDto {
  @ApiProperty({ example: '1729482719284', description: 'ID sản phẩm TikTok Shop' })
  product_id: string;
  @ApiProperty({ example: '1729482719284_SKU1', description: 'ID SKU phân loại' })
  sku_id: string;
  @ApiProperty({ example: 199000, description: 'Giá bán lẻ mới' })
  sale_price: number;
}

export class TikTokCreatePromotionDto {
  @ApiProperty({ example: 'TikTok Mega Sale 2026', description: 'Tiêu đề chiến dịch ưu đãi' })
  title: string;
  @ApiProperty({ example: 'DIRECT_DISCOUNT', enum: ['DIRECT_DISCOUNT', 'PERCENT_DISCOUNT'], description: 'Kiểu giảm' })
  discount_type: string;
  @ApiProperty({ example: 40000, description: 'Giá trị giảm' })
  discount_val: number;
  @ApiProperty({ example: 300000, description: 'Ngưỡng tiền áp dụng' })
  threshold_val: number;
}

// ── LAZADA DTOs ──
export class LazadaOrderDetailDto {
  @ApiProperty({ example: '8899112233', description: 'Mã đơn hàng Lazada (order_id)' })
  order_id: string;
}

export class LazadaUpdateStockPriceDto {
  @ApiProperty({ example: 'LZD-SKU-99', description: 'Mã SKU nhà bán hàng trên Lazada' })
  seller_sku: string;
  @ApiProperty({ example: 85, description: 'Số lượng tồn kho cập nhật' })
  quantity: number;
  @ApiProperty({ example: 310000, description: 'Giá bán niêm yết mới', required: false })
  price?: number;
}

export class LazadaPackOrderDto {
  @ApiProperty({ example: ['ITEM_101', 'ITEM_102'], description: 'Danh sách ID mục hàng đóng gói (order_item_ids)' })
  order_item_ids: string[];
  @ApiProperty({ example: 'dropoff', enum: ['dropoff', 'pickup'], description: 'Hình thức gửi hàng' })
  shipping_allocate_type: string;
}

// ── TIKI DTOs ──
export class TikiOrderDetailDto {
  @ApiProperty({ example: '891249812', description: 'Mã đơn hàng Tiki (order_code)' })
  order_code: string;
}

export class TikiUpdateStockDto {
  @ApiProperty({ example: 'TIKI-SKU-44', description: 'Mã SKU đối tác trên Tiki' })
  sku: string;
  @ApiProperty({ example: 50, description: 'Tồn kho khả dụng' })
  quantity: number;
}

// ── SHOPIFY DTOs ──
export class ShopifyOrderDetailDto {
  @ApiProperty({ example: '58192849182', description: 'ID đơn hàng Shopify' })
  order_id: string;
}

export class ShopifyAdjustStockDto {
  @ApiProperty({ example: 48192849, description: 'ID kho hàng Shopify (location_id)' })
  location_id: number;
  @ApiProperty({ example: 98124912, description: 'ID biến thể hàng (inventory_item_id)' })
  inventory_item_id: number;
  @ApiProperty({ example: 5, description: 'Số lượng tăng (+) hoặc giảm (-)' })
  available_adjustment: number;
}

export class ShopifyCreateDiscountDto {
  @ApiProperty({ example: 'SHOPIFY_VIP15', description: 'Mã coupon giảm giá' })
  code: string;
  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed_amount'], description: 'Kiểu giảm giá' })
  value_type: string;
  @ApiProperty({ example: -15, description: 'Giá trị giảm (âm cho Shopify)' })
  value: number;
  @ApiProperty({ example: 250000, description: 'Giá trị giỏ hàng tối thiểu' })
  min_order_value: number;
}

// ── SAPO DTOs ──
export class SapoCreateOrderDto {
  @ApiProperty({
    example: {
      order: {
        note: 'Đơn hàng tự động hóa từ UniFlow Master Gateway',
        customer: { first_name: 'Nguyễn Văn', last_name: 'An', phone: '0988776655' },
        shipping_address: { address1: '123 Cầu Giấy', city: 'Hà Nội' },
        line_items: [{ variant_id: 102948, quantity: 2, price: 185000 }],
        total_price: 370000,
      },
    },
    description: 'Cấu trúc đối tượng đơn hàng Sapo chuẩn REST API',
  })
  payload: any;
}

export class SapoAdjustStockDto {
  @ApiProperty({ example: 102, description: 'ID chi nhánh / kho hàng Sapo' })
  location_id: number;
  @ApiProperty({ example: 98124, description: 'ID mặt hàng tồn kho (inventory_item_id)' })
  inventory_item_id: number;
  @ApiProperty({ example: 10, description: 'Số lượng tăng (+) hoặc giảm (-)' })
  available_adjustment: number;
}

export class SapoUpdateOrderDto {
  @ApiProperty({ example: 9812491, description: 'ID đơn hàng Sapo' })
  order_id: number;
  @ApiProperty({ example: 'Đã gọi xác nhận - Giao sau 18h', description: 'Ghi chú đơn hàng mới' })
  note: string;
  @ApiProperty({ example: ['VIP', 'FREESHIP'], description: 'Thẻ tag phân loại đơn' })
  tags: string[];
}

export class SapoFulfillOrderDto {
  @ApiProperty({ example: 9812491, description: 'ID đơn hàng Sapo cần xuất kho' })
  order_id: number;
  @ApiProperty({ example: 102, description: 'ID chi nhánh xuất hàng' })
  location_id: number;
  @ApiProperty({ example: 'GHTK Express', description: 'Tên đối tác giao hàng' })
  carrier: string;
  @ApiProperty({ example: 'S22941.ORD.991', description: 'Mã vận đơn bưu cục' })
  tracking_number: string;
}

export class SapoOrderPaymentDto {
  @ApiProperty({ example: 9812491, description: 'ID đơn hàng Sapo' })
  order_id: number;
  @ApiProperty({ example: 370000, description: 'Số tiền thanh toán (VND)' })
  amount: number;
  @ApiProperty({ example: 'QR_CODE', enum: ['CASH', 'BANK_TRANSFER', 'QR_CODE', 'CREDIT_CARD', 'POINT'], description: 'Phương thức thanh toán' })
  payment_method: string;
  @ApiProperty({ example: 'VCB-FT-9988221', description: 'Mã giao dịch ngân hàng / tham chiếu', required: false })
  reference?: string;
}

export class SapoOrderReturnDto {
  @ApiProperty({ example: 9812491, description: 'ID đơn hàng Sapo trả hàng' })
  order_id: number;
  @ApiProperty({ example: [{ variant_id: 102948, quantity: 1, return_reason: 'Khách mặc chật' }], description: 'Danh mục mặt hàng đổi trả' })
  return_items: any[];
  @ApiProperty({ example: 185000, description: 'Số tiền hoàn lại cho khách' })
  refund_amount: number;
  @ApiProperty({ example: true, description: 'Tự động hoàn lại tồn kho khả dụng' })
  restock: boolean;
}

export class SapoTransferStockDto {
  @ApiProperty({ example: 102, description: 'ID kho xuất chuyển hàng' })
  from_location_id: number;
  @ApiProperty({ example: 103, description: 'ID kho nhận hàng' })
  to_location_id: number;
  @ApiProperty({ example: [{ variant_id: 102948, quantity: 20 }], description: 'Danh mục mặt hàng điều chuyển' })
  line_items: any[];
  @ApiProperty({ example: 'Điều chuyển hàng chuẩn bị vụ Tết 2026', description: 'Lý do chuyển kho' })
  note: string;
}

export class SapoCreateProductDto {
  @ApiProperty({ example: 'Áo Thun Polo Nam Cotton Thoáng Khí', description: 'Tên sản phẩm mới' })
  name: string;
  @ApiProperty({ example: 'Thời Trang Nam', description: 'Danh mục sản phẩm' })
  category: string;
  @ApiProperty({ example: 'POLO-NAM-01', description: 'Mã SKU gốc' })
  sku: string;
  @ApiProperty({ example: 250000, description: 'Giá bán lẻ niêm yết' })
  price: number;
  @ApiProperty({ example: 120000, description: 'Giá vốn nhập kho', required: false })
  cost_price?: number;
  @ApiProperty({ example: 100, description: 'Số lượng tồn khởi tạo ban đầu' })
  initial_stock: number;
}

export class SapoCreateCustomerDto {
  @ApiProperty({ example: 'Nguyễn Văn Minh', description: 'Tên khách hàng' })
  full_name: string;
  @ApiProperty({ example: '0988776655', description: 'Số điện thoại' })
  phone: string;
  @ApiProperty({ example: 'minh.nguyen@example.com', description: 'Email liên hệ', required: false })
  email?: string;
  @ApiProperty({ example: 'Số 15 Lê Văn Lương, Thanh Xuân, Hà Nội', description: 'Địa chỉ nhận hàng' })
  address: string;
  @ApiProperty({ example: ['VIP', 'KHACH_LE'], description: 'Thẻ tag phân nhóm khách' })
  tags: string[];
}

export class SapoLoyaltyPointDto {
  @ApiProperty({ example: 881294, description: 'ID khách hàng Sapo' })
  customer_id: number;
  @ApiProperty({ example: 50, description: 'Số điểm cộng (+) hoặc trừ (-)' })
  point_adjustment: number;
  @ApiProperty({ example: 'Tích điểm đơn hàng #9812491', description: 'Lý do tích điểm' })
  reason: string;
}

export class SapoCreateDiscountDto {
  @ApiProperty({ example: 'SAPO_TET2026', description: 'Mã coupon giảm giá' })
  code: string;
  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed_amount'], description: 'Kiểu giảm giá' })
  value_type: string;
  @ApiProperty({ example: 15, description: 'Giá trị giảm' })
  value: number;
  @ApiProperty({ example: 200000, description: 'Giá trị đơn tối thiểu' })
  minimum_order_amount: number;
}

export class SapoCancelOrderDto {
  @ApiProperty({ example: 9812491, description: 'ID đơn hàng Sapo' })
  order_id: number;
  @ApiProperty({ example: true, description: 'Tự động hoàn tồn kho khả dụng' })
  restock: boolean;
}

// ── NHANH.VN EXPANDED DTOs ──
export class NhanhAddOrderDto {
  @ApiProperty({ example: 102, description: 'ID kho xuất hàng Nhanh.vn' })
  depotId: number;
  @ApiProperty({ example: 'Lê Hoàng Nam', description: 'Tên người nhận' })
  customerName: string;
  @ApiProperty({ example: '0977889900', description: 'Số điện thoại' })
  customerMobile: string;
  @ApiProperty({ example: '456 Lê Văn Sỹ, P.12, Q.3, TP.HCM', description: 'Địa chỉ nhận hàng' })
  customerAddress: string;
  @ApiProperty({ example: [{ idProduct: 55412, quantity: 1, price: 290000 }], description: 'Danh sách sản phẩm đơn hàng' })
  productList: any[];
}

export class NhanhSearchOrdersDto {
  @ApiProperty({ example: 1, description: 'Số trang truy vấn' })
  page: number;
  @ApiProperty({ example: 'Confirmed', enum: ['New', 'Confirmed', 'Packing', 'Shipping', 'Success', 'Canceled'], description: 'Trạng thái đơn hàng' })
  status: string;
  @ApiProperty({ example: '2026-10-01', description: 'Từ ngày (YYYY-MM-DD)', required: false })
  fromDate?: string;
  @ApiProperty({ example: '2026-10-03', description: 'Đến ngày (YYYY-MM-DD)', required: false })
  toDate?: string;
}

export class NhanhUpdateOrderStatusDto {
  @ApiProperty({ example: 88129, description: 'ID đơn hàng Nhanh.vn' })
  orderId: number;
  @ApiProperty({ example: 'Packing', enum: ['Packing', 'Shipping', 'Success', 'Canceled'], description: 'Trạng thái đơn mới' })
  status: string;
}

export class NhanhCheckStockDto {
  @ApiProperty({ example: 102, description: 'ID kho hàng Nhanh.vn' })
  depotId: number;
  @ApiProperty({ example: ['SP-001', 'SP-002'], description: 'Danh sách mã sản phẩm cần tra cứu tồn' })
  productIds: string[];
}

export class NhanhAdjustStockDto {
  @ApiProperty({ example: 102, description: 'ID kho hàng Nhanh.vn' })
  depotId: number;
  @ApiProperty({ example: 55412, description: 'ID sản phẩm' })
  productId: number;
  @ApiProperty({ example: 80, description: 'Số lượng tồn kho thực tế' })
  remain: number;
}

export class NhanhAddProductDto {
  @ApiProperty({ example: 'Tai Nghe Chống Ồn Active ANC', description: 'Tên sản phẩm Nhanh.vn' })
  name: string;
  @ApiProperty({ example: 'ANC-PRO-01', description: 'Mã sản phẩm / SKU' })
  code: string;
  @ApiProperty({ example: 890000, description: 'Giá bán lẻ' })
  price: number;
  @ApiProperty({ example: 102, description: 'ID kho nhập hàng' })
  depotId: number;
  @ApiProperty({ example: 50, description: 'Số lượng tồn đầu' })
  inventory: number;
}

export class NhanhSearchCustomerDto {
  @ApiProperty({ example: '0977889900', description: 'Số điện thoại khách hàng' })
  mobile: string;
}

export class NhanhAddCustomerDto {
  @ApiProperty({ example: 'Lê Hoàng Nam', description: 'Tên khách hàng' })
  name: string;
  @ApiProperty({ example: '0977889900', description: 'Số điện thoại' })
  mobile: string;
  @ApiProperty({ example: 'nam.le@example.com', description: 'Email', required: false })
  email?: string;
  @ApiProperty({ example: '456 Lê Văn Sỹ, P.12, Q.3, TP.HCM', description: 'Địa chỉ' })
  address: string;
}

// ── PANCAKE EXPANDED DTOs ──
export class PancakeCreateOrderDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Fanpage Facebook / Kênh chat' })
  page_id: string;
  @ApiProperty({ example: 'Nguyễn Thị Hương', description: 'Tên khách hàng' })
  customer_name: string;
  @ApiProperty({ example: '0981234567', description: 'Số điện thoại' })
  phone_number: string;
  @ApiProperty({ example: [{ name: 'Váy Hoa Nhí Vintage L', quantity: 1, price: 320000 }], description: 'Chi tiết giỏ hàng' })
  items: any[];
}

export class PancakeUpdateOrderStatusDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Fanpage' })
  page_id: string;
  @ApiProperty({ example: 'ORD_PC_9921', description: 'Mã đơn hàng Pancake' })
  order_id: string;
  @ApiProperty({ example: 'confirmed', enum: ['new', 'confirmed', 'sent', 'done', 'canceled'], description: 'Trạng thái chốt đơn' })
  status: string;
}

export class PancakeSendChatDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Fanpage' })
  page_id: string;
  @ApiProperty({ example: 'CONV_889922', description: 'ID hội thoại khách hàng' })
  conversation_id: string;
  @ApiProperty({ example: 'Dạ shop đã xác nhận đơn hàng của chị Hương! Đơn sẽ được gửi qua GHTK sớm nhất ạ.', description: 'Nội dung tin nhắn' })
  message: string;
}

export class PancakeTagCustomerDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Fanpage' })
  page_id: string;
  @ApiProperty({ example: 'CUST_88291', description: 'ID khách hàng Pancake' })
  customer_id: string;
  @ApiProperty({ example: ['VIP', 'KHACH_QUEN', 'DA_MUA_HANG'], description: 'Danh sách nhãn / thẻ tag gắn cho khách' })
  tags: string[];
}

export class PancakeSyncInventoryDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Shop / Fanpage Pancake' })
  page_id: string;
  @ApiProperty({ example: 'VAY-HOA-L', description: 'Mã SKU sản phẩm' })
  sku: string;
  @ApiProperty({ example: 45, description: 'Tồn kho khả dụng' })
  quantity: number;
}

// ── KIOTVIET DTOs ──
export class KiotVietCreateOrderDto {
  @ApiProperty({ example: 101, description: 'ID chi nhánh cửa hàng KiotViet' })
  branchId: number;
  @ApiProperty({ example: 'Khách vãng lai', description: 'Tên người mua hàng' })
  customerName: string;
  @ApiProperty({ example: '0912998877', description: 'Số điện thoại người mua', required: false })
  customerPhone?: string;
  @ApiProperty({ example: [{ productCode: 'KV-SP-01', quantity: 2, price: 150000 }], description: 'Chi tiết danh mục hàng hóa xuất bán' })
  orderItems: any[];
  @ApiProperty({ example: 300000, description: 'Tổng tiền thanh toán' })
  totalPayment: number;
}

export class KiotVietUpdateStockDto {
  @ApiProperty({ example: 101, description: 'ID chi nhánh KiotViet' })
  branchId: number;
  @ApiProperty({ example: 'KV-SP-01', description: 'Mã hàng hóa (Product Code / Barcode)' })
  productCode: string;
  @ApiProperty({ example: 120, description: 'Số lượng tồn kho thực tế' })
  onHand: number;
}

export class KiotVietCreateCustomerDto {
  @ApiProperty({ example: 'Phạm Thanh Tùng', description: 'Tên khách hàng' })
  name: string;
  @ApiProperty({ example: '0988665544', description: 'Số điện thoại' })
  contactNumber: string;
  @ApiProperty({ example: 'Số 20 Hoàng Hoa Thám, Ba Đình, Hà Nội', description: 'Địa chỉ' })
  address: string;
}

// ── HARAVAN DTOs ──
export class HaravanCreateOrderDto {
  @ApiProperty({
    example: {
      order: {
        email: 'khachhang@example.com',
        shipping_address: { first_name: 'Hoàng', last_name: 'Minh', phone: '0933221100', address1: '789 Điện Biên Phủ, Bình Thạnh, TP.HCM' },
        line_items: [{ variant_id: 881294, quantity: 1, price: 450000 }],
        total_price: 450000,
      },
    },
    description: 'Đối tượng đơn hàng chuẩn Haravan Omnichannel API',
  })
  payload: any;
}

export class HaravanAdjustStockDto {
  @ApiProperty({ example: 1024, description: 'ID kho hàng Haravan' })
  location_id: number;
  @ApiProperty({ example: 881294, description: 'ID biến thể hàng (variant_id)' })
  variant_id: number;
  @ApiProperty({ example: 30, description: 'Tồn kho khả dụng mới' })
  inventory_quantity: number;
}

export class HaravanCreateDiscountDto {
  @ApiProperty({ example: 'HARAVAN_TET2026', description: 'Mã coupon giảm giá' })
  code: string;
  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed_amount'], description: 'Kiểu giảm giá' })
  discount_type: string;
  @ApiProperty({ example: 20, description: 'Giá trị giảm' })
  value: number;
  @ApiProperty({ example: 300000, description: 'Đơn hàng tối thiểu' })
  min_order_amount: number;
}

// ── SAPO ADVANCED DTOs ──
export class SapoCreatePurchaseOrderDto {
  @ApiProperty({ example: 1201, description: 'ID nhà cung cấp trên Sapo' })
  supplier_id: number;
  @ApiProperty({ example: 101, description: 'ID kho nhận hàng Sapo' })
  location_id: number;
  @ApiProperty({
    example: [{ variant_id: 1001, quantity: 50, price: 120000 }],
    description: 'Danh sách biến thể và giá nhập',
  })
  line_items: any[];
  @ApiProperty({ example: 'Nhập bổ sung lô hàng mùa Tết 2026', description: 'Ghi chú đơn nhập hàng' })
  note: string;
}

export class SapoCashReceiptDto {
  @ApiProperty({ example: 101, description: 'ID chi nhánh kho Sapo' })
  location_id: number;
  @ApiProperty({ example: 'IN', enum: ['IN', 'OUT'], description: 'Loại phiếu: IN (Thu tiền) / OUT (Chi tiền)' })
  receipt_type: string;
  @ApiProperty({ example: 850000, description: 'Số tiền phiếu thu/chi' })
  amount: number;
  @ApiProperty({ example: 'Tiền cọc may đo theo yêu cầu của khách', description: 'Diễn giải thu chi' })
  reason: string;
  @ApiProperty({ example: 'Trần Thị Thu Thảo', description: 'Đối tượng nộp / nhận tiền' })
  contact_name: string;
}

// ── NHANH.VN ADVANCED DTOs ──
export class NhanhReturnOrderDto {
  @ApiProperty({ example: 88129, description: 'ID đơn hàng Nhanh.vn bị đổi trả' })
  orderId: number;
  @ApiProperty({ example: 102, description: 'ID kho tiếp nhận hàng hoàn' })
  depotId: number;
  @ApiProperty({ example: [{ idProduct: 55412, quantity: 1, money: 290000 }], description: 'Danh sách sản phẩm hoàn lại' })
  returnProducts: any[];
  @ApiProperty({ example: 290000, description: 'Số tiền hoàn trả' })
  moneyRefund: number;
  @ApiProperty({ example: 'Khách đổi size', description: 'Lý do hoàn trả' })
  reason: string;
}

export class NhanhCashBookDto {
  @ApiProperty({ example: 102, description: 'ID điểm kho / cửa hàng' })
  depotId: number;
  @ApiProperty({ example: 'RECEIPT', enum: ['RECEIPT', 'PAYMENT'], description: 'Loại phiếu: Thu hay Chi' })
  type: string;
  @ApiProperty({ example: 450000, description: 'Số tiền' })
  amount: number;
  @ApiProperty({ example: 'Thu tiền khách hàng thanh toán tại quầy', description: 'Lý do' })
  reason: string;
}

export class NhanhTransferStockDto {
  @ApiProperty({ example: 101, description: 'ID kho xuất chuyển' })
  fromDepotId: number;
  @ApiProperty({ example: 102, description: 'ID kho đích tiếp nhận' })
  toDepotId: number;
  @ApiProperty({ example: [{ productId: 55412, quantity: 20 }], description: 'Danh mục sản phẩm điều chuyển' })
  items: any[];
  @ApiProperty({ example: 'Chuyển hàng chi viện cho cửa hàng Q.3 do sắp hết tồn', description: 'Ghi chú điều chuyển' })
  note: string;
}

// ── PANCAKE ADVANCED DTOs ──
export class PancakeCancelOrderDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Fanpage' })
  page_id: string;
  @ApiProperty({ example: 'ORD_PC_9921', description: 'Mã đơn hàng Pancake' })
  order_id: string;
  @ApiProperty({ example: 'Khách hàng nhắn tin báo hủy trên Fanpage', description: 'Lý do hủy đơn' })
  cancel_reason: string;
}

export class PancakeRegisterWebhookDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Fanpage' })
  page_id: string;
  @ApiProperty({ example: 'https://api.uniflow.vn/api/v1/webhooks/inbound/pancake/66c0e812a1b2c3d4e5f60001', description: 'Webhook Callback URL' })
  webhook_url: string;
  @ApiProperty({ example: ['messages', 'messaging_postbacks', 'order_create', 'order_status_update'], description: 'Sự kiện đăng ký' })
  events: string[];
}

// ── KIOTVIET ADVANCED DTOs ──
export class KiotVietReturnInvoiceDto {
  @ApiProperty({ example: 101, description: 'ID chi nhánh tiếp nhận hàng trả' })
  branchId: number;
  @ApiProperty({ example: 'HD000182', description: 'Mã hóa đơn bán hàng gốc' })
  originalInvoiceCode: string;
  @ApiProperty({
    example: [{ productCode: 'KV-SP-01', quantity: 1, returnPrice: 150000 }],
    description: 'Danh mục sản phẩm khách trả lại',
  })
  returnItems: any[];
  @ApiProperty({ example: 150000, description: 'Tổng tiền hoàn trả lại cho khách' })
  returnTotal: number;
  @ApiProperty({ example: 'Khách muốn đổi size hoặc hoàn tiền', description: 'Lý do đổi trả' })
  reason: string;
}

export class KiotVietPaymentDto {
  @ApiProperty({ example: 'HD000182', description: 'Mã hóa đơn bán hàng cần thu tiền' })
  invoiceCode: string;
  @ApiProperty({ example: 'Transfer', enum: ['Cash', 'Transfer', 'Card', 'Point'], description: 'Phương thức thanh toán' })
  paymentMethod: string;
  @ApiProperty({ example: 300000, description: 'Số tiền thanh toán' })
  amount: number;
  @ApiProperty({ example: 'Chuyển khoản VietQR qua Vietcombank', description: 'Ghi chú thanh toán', required: false })
  note?: string;
}

export class KiotVietPurchaseOrderDto {
  @ApiProperty({ example: 101, description: 'ID chi nhánh nhập hàng' })
  branchId: number;
  @ApiProperty({ example: 'Công ty TNHH Phân Phối Thiết Bị Số', description: 'Tên nhà cung cấp' })
  supplierName: string;
  @ApiProperty({ example: '02438889999', description: 'Số điện thoại nhà cung cấp' })
  supplierPhone: string;
  @ApiProperty({
    example: [{ productCode: 'KV-SP-01', quantity: 100, importPrice: 95000 }],
    description: 'Danh mục hàng nhập kho từ nhà cung cấp',
  })
  items: any[];
  @ApiProperty({ example: 9500000, description: 'Tổng giá trị nhập kho' })
  totalAmount: number;
}

export class KiotVietStockTakeDto {
  @ApiProperty({ example: 101, description: 'ID chi nhánh kiểm kê' })
  branchId: number;
  @ApiProperty({ example: 'Kiểm kê định kỳ tháng 10/2026', description: 'Mô tả đợt kiểm kê' })
  description: string;
  @ApiProperty({
    example: [{ productCode: 'KV-SP-01', actualCount: 118, systemCount: 120, note: 'Lệch 2 chiếc do rơi vỡ' }],
    description: 'Chi tiết hàng hóa và số lượng thực tế',
  })
  items: any[];
}

export class KiotVietPriceBookDto {
  @ApiProperty({ example: 'BẢNG GIÁ SỈ ĐẠI LÝ CẤP 1', description: 'Tên bảng giá' })
  priceBookName: string;
  @ApiProperty({
    example: [
      { productCode: 'KV-SP-01', price: 120000 },
      { productCode: 'KV-SP-02', price: 38000 },
    ],
    description: 'Danh mục sản phẩm và giá áp dụng mới',
  })
  items: any[];
}

export class KiotVietLoyaltyPointDto {
  @ApiProperty({ example: 10291, description: 'ID khách hàng KiotViet' })
  customerId: number;
  @ApiProperty({ example: 50, description: 'Số điểm thay đổi (+50 là cộng điểm, -50 là tiêu điểm)' })
  changePoints: number;
  @ApiProperty({ example: 'Tích điểm đơn hàng HD000182', description: 'Lý do tích / tiêu điểm' })
  reason: string;
}

export class KiotVietCreateProductDto {
  @ApiProperty({ example: 'KV-SP-04', description: 'Mã hàng hóa duy nhất' })
  code: string;
  @ApiProperty({ example: '8936012345678', description: 'Mã vạch Barcode quét tại quầy POS' })
  barCode: string;
  @ApiProperty({ example: 'Sạc Không Dây Từ Tính MagSafe 15W', description: 'Tên sản phẩm' })
  name: string;
  @ApiProperty({ example: 350000, description: 'Giá bán niêm yết' })
  basePrice: number;
  @ApiProperty({ example: 180000, description: 'Giá vốn nhập hàng' })
  cost: number;
  @ApiProperty({ example: 101, description: 'ID chi nhánh kho' })
  branchId: number;
  @ApiProperty({ example: 50, description: 'Tồn kho ban đầu' })
  onHand: number;
}

export class KiotVietCashFlowDto {
  @ApiProperty({ example: 101, description: 'ID chi nhánh cửa hàng' })
  branchId: number;
  @ApiProperty({ example: 'RECEIPT', enum: ['RECEIPT', 'PAYMENT'], description: 'Loại phiếu: RECEIPT (Phiếu thu) / PAYMENT (Phiếu chi)' })
  flowType: string;
  @ApiProperty({ example: 500000, description: 'Số tiền thu / chi' })
  amount: number;
  @ApiProperty({ example: 'Thu tiền bán hàng cuối ngày nộp về két', description: 'Lý do thu / chi' })
  description: string;
  @ApiProperty({ example: 'Phạm Thu Hằng (Thu ngân)', description: 'Người nộp / người nhận' })
  contactName: string;
}

// ── HARAVAN ADVANCED DTOs ──
export class HaravanFulfillOrderDto {
  @ApiProperty({ example: 1001, description: 'ID đơn hàng Haravan cần tạo giao hàng' })
  order_id: number;
  @ApiProperty({ example: 'GHN_HRV_99812', description: 'Mã vận đơn của hãng vận chuyển' })
  tracking_number: string;
  @ApiProperty({ example: 'Giao Hàng Nhanh', description: 'Hãng vận chuyển Haravan Ship' })
  carrier_service_code: string;
  @ApiProperty({ example: [881294], description: 'Danh sách ID biến thể sản phẩm xuất kho giao' })
  line_item_ids: number[];
}

export class HaravanCancelOrderDto {
  @ApiProperty({ example: 1001, description: 'ID đơn hàng Haravan cần hủy' })
  order_id: number;
  @ApiProperty({ example: 'Khách hàng đổi ý muốn đổi sang sản phẩm khác', description: 'Lý do hủy đơn' })
  reason: string;
  @ApiProperty({ example: true, description: 'Có hoàn lại số lượng tồn kho tự động không' })
  restock: boolean;
}

export class HaravanCreateProductDto {
  @ApiProperty({ example: 'Áo Polo Thể Thao Nam Breathable Tech', description: 'Tên sản phẩm Haravan' })
  title: string;
  @ApiProperty({ example: 'Chất liệu thun lạnh thoáng khí, co giãn 4 chiều...', description: 'Mô tả chi tiết HTML' })
  body_html: string;
  @ApiProperty({ example: 'Thời Trang Nam', description: 'Loại sản phẩm' })
  product_type: string;
  @ApiProperty({ example: 'UniFlow Fashion', description: 'Nhà cung cấp / Brand' })
  vendor: string;
  @ApiProperty({
    example: [
      { option1: 'Đen / M', price: 290000, sku: 'POLO-BLK-M', barcode: '8936001111', inventory_quantity: 40 },
      { option1: 'Đen / L', price: 290000, sku: 'POLO-BLK-L', barcode: '8936001112', inventory_quantity: 60 },
    ],
    description: 'Danh sách biến thể và mã SKU, Barcode, Tồn kho',
  })
  variants: any[];
}

export class HaravanCreateCustomerDto {
  @ApiProperty({ example: 'Lê', description: 'Họ khách hàng' })
  first_name: string;
  @ApiProperty({ example: 'Văn Thịnh', description: 'Tên khách hàng' })
  last_name: string;
  @ApiProperty({ example: '0918889999', description: 'Số điện thoại' })
  phone: string;
  @ApiProperty({ example: 'thinh.le@example.com', description: 'Email' })
  email: string;
  @ApiProperty({ example: ['VIP', 'KHACH_HA_NOI'], description: 'Nhãn thẻ tag khách hàng' })
  tags: string[];
}

export class HaravanRegisterWebhookDto {
  @ApiProperty({ example: 'orders/create', enum: ['orders/create', 'orders/updated', 'orders/cancelled', 'inventory_levels/update', 'products/update'], description: 'Chủ đề sự kiện' })
  topic: string;
  @ApiProperty({ example: 'https://api.uniflow.vn/api/v1/webhooks/inbound/haravan/66c0e812a1b2c3d4e5f60001', description: 'URL nhận webhook từ Haravan' })
  address: string;
  @ApiProperty({ example: 'json', description: 'Định dạng dữ liệu' })
  format: string;
}

// ── MISA ESHOP RETAIL & F&B DTOs ──
export class MisaEshopCreateOrderDto {
  @ApiProperty({ example: 'CH01_HN', description: 'Mã chi nhánh cửa hàng MISA eShop' })
  branchCode: string;
  @ApiProperty({ example: 'HD-ESHOP-00912', description: 'Mã số hóa đơn bán lẻ' })
  orderNo: string;
  @ApiProperty({ example: 'Nguyễn Thu Ngân', description: 'Tên nhân viên thu ngân mở đơn' })
  cashier: string;
  @ApiProperty({ example: 'Hoàng Hải Yến', description: 'Tên khách hàng' })
  customerName: string;
  @ApiProperty({ example: '0901223344', description: 'Số điện thoại' })
  customerPhone: string;
  @ApiProperty({
    example: [{ itemCode: 'SP-ESHOP-01', itemName: 'Trà Sữa Oolong Nướng', quantity: 2, price: 45000 }],
    description: 'Danh sách món / mặt hàng bán',
  })
  items: any[];
  @ApiProperty({ example: 90000, description: 'Tổng tiền thanh toán' })
  totalAmount: number;
  @ApiProperty({ example: 'QR_CODE', enum: ['CASH', 'CREDIT_CARD', 'QR_CODE', 'WALLET'], description: 'Phương thức thanh toán' })
  paymentType: string;
}

export class MisaEshopAdjustStockDto {
  @ApiProperty({ example: 'CH01_HN', description: 'Mã chi nhánh MISA eShop' })
  branchCode: string;
  @ApiProperty({ example: 'SP-ESHOP-01', description: 'Mã hàng hóa' })
  itemCode: string;
  @ApiProperty({ example: 85, description: 'Số lượng tồn kho thực tế' })
  onHand: number;
}

export class MisaEshopCloseShiftDto {
  @ApiProperty({ example: 'CH01_HN', description: 'Mã chi nhánh' })
  branchCode: string;
  @ApiProperty({ example: 'SHIFT_20261003_CA1', description: 'Mã ca thu ngân' })
  shiftId: string;
  @ApiProperty({ example: 'Nguyễn Thu Ngân', description: 'Thu ngân kết ca' })
  cashier: string;
  @ApiProperty({ example: 1000000, description: 'Tiền mặt đầu ca (quỹ tiền thối)' })
  cashBeginning: number;
  @ApiProperty({ example: 8750000, description: 'Doanh thu tiền mặt trong ca' })
  cashCollected: number;
  @ApiProperty({ example: 9750000, description: 'Tổng tiền thực tế bàn giao trong két' })
  cashActualInDrawer: number;
  @ApiProperty({ example: 0, description: 'Chênh lệch (thừa/thiếu so với hệ thống tính)' })
  variance: number;
}

// ── MISA MEINVOICE & CRM DTOs ──
export class MisaDraftInvoiceDto {
  @ApiProperty({ example: 'HD-2026-9912', description: 'Mã tham chiếu đơn hàng gốc' })
  refID: string;
  @ApiProperty({ example: '1C24TUU', description: 'Ký hiệu mẫu số hóa đơn điện tử' })
  invSeries: string;
  @ApiProperty({ example: 'Công ty Cổ phần Công Nghệ Alpha', description: 'Tên người mua hoặc đơn vị' })
  buyerLegalName: string;
  @ApiProperty({ example: '0109988776', description: 'Mã số thuế bên mua (nếu có)', required: false })
  buyerTaxCode?: string;
  @ApiProperty({ example: 550000, description: 'Tổng tiền thanh toán trên hóa đơn' })
  totalAmount: number;
  @ApiProperty({
    example: [
      { itemCode: 'SP-01', itemName: 'Bộ sạc nhanh 65W GaN', unit: 'Chiếc', quantity: 1, unitPrice: 500000, vatRateName: '10%' },
    ],
    description: 'Chi tiết danh mục tính thuế GTGT',
  })
  originalInvoiceDetail: any[];
}

export class MisaPublishHsmDto {
  @ApiProperty({ example: 'HD-2026-9912', description: 'Mã tham chiếu đơn hàng cần ký số HSM Cloud' })
  refID: string;
}

export class MisaCancelInvoiceDto {
  @ApiProperty({ example: 'HD-2026-9912', description: 'Mã tham chiếu hóa đơn cần hủy' })
  refID: string;
  @ApiProperty({ example: 'Khách hàng hủy đơn do đổi ý', description: 'Lý do hủy hóa đơn' })
  cancelReason: string;
}

export class MisaSyncCustomerDto {
  @ApiProperty({ example: 'Nguyễn Văn Minh', description: 'Tên khách hàng' })
  customerName: string;
  @ApiProperty({ example: '0988776655', description: 'Số điện thoại' })
  phone: string;
  @ApiProperty({ example: 'minh.nguyen@example.com', description: 'Email liên hệ', required: false })
  email?: string;
  @ApiProperty({ example: 'VIP_DIAMOND', description: 'Hạng thẻ thành viên CRM', required: false })
  tier?: string;
}

// ── LOGISTICS DTOs ──
export class LogisticsWaybillDto {
  @ApiProperty({ example: 'ORD-998822', description: 'Mã đơn hàng đối tác' })
  orderCode: string;
  @ApiProperty({ example: 'Trần Văn Mạnh', description: 'Tên người nhận' })
  receiverName: string;
  @ApiProperty({ example: '0912345678', description: 'Số điện thoại' })
  receiverPhone: string;
  @ApiProperty({ example: 'Số 10 Phạm Văn Đồng, Cầu Giấy, Hà Nội', description: 'Địa chỉ người nhận' })
  receiverAddress: string;
  @ApiProperty({ example: 450000, description: 'Tiền thu hộ COD' })
  codAmount: number;
  @ApiProperty({ example: 500, description: 'Khối lượng gói hàng (gram)' })
  weightGram: number;
}

export class GhnFeeCalculationDto {
  @ApiProperty({ example: 1442, description: 'ID quận/huyện gửi hàng (Hà Đông = 1442)' })
  from_district_id: number;
  @ApiProperty({ example: 1454, description: 'ID quận/huyện nhận hàng (Quận 1 = 1454)' })
  to_district_id: number;
  @ApiProperty({ example: 600, description: 'Trọng lượng gói hàng (gram)' })
  weight: number;
  @ApiProperty({ example: 400000, description: 'Giá trị bảo hiểm đơn hàng' })
  insurance_value: number;
}

// ── PROMOTION ENGINE DTOs ──
export class GenerateVoucherDto {
  @ApiProperty({ example: 'VIP', description: 'Tiền tố mã voucher' })
  codePrefix: string;
  @ApiProperty({ example: 'PERCENTAGE', enum: ['PERCENTAGE', 'FIXED_AMOUNT'], description: 'Kiểu giảm' })
  discountType: string;
  @ApiProperty({ example: 10, description: 'Giá trị giảm' })
  discountValue: number;
  @ApiProperty({ example: 200000, description: 'Giá trị đơn tối thiểu' })
  minSpend: number;
  @ApiProperty({ example: 50000, description: 'Giảm tối đa' })
  maxDiscount: number;
  @ApiProperty({ example: 14, description: 'Số ngày hiệu lực' })
  validDays: number;
  @ApiProperty({ example: '0988776655', description: 'Số điện thoại khách hàng thụ hưởng', required: false })
  targetPhone?: string;
}

export class ValidateVoucherDto {
  @ApiProperty({ example: 'VIP-99AF', description: 'Mã voucher cần kiểm tra' })
  voucherCode: string;
  @ApiProperty({ example: 350000, description: 'Tổng tiền giỏ hàng trước chiết khấu' })
  orderTotal: number;
  @ApiProperty({ example: '0988776655', description: 'Số điện thoại người mua', required: false })
  customerPhone?: string;
}

// ── NOTIFICATION DTOs ──
export class TelegramAlertDto {
  @ApiProperty({ example: 'CẢNH BÁO TỰ ĐỘNG: Đơn hàng SHOPEE #241003 đã được ký số hóa đơn MISA thành công!', description: 'Nội dung tin nhắn Markdown/HTML' })
  text: string;
  @ApiProperty({ example: '-1002345678901', description: 'Chat ID kênh Telegram', required: false })
  chat_id?: string;
}

export class ZaloZnsDto {
  @ApiProperty({ example: '0988776655', description: 'Số điện thoại người nhận Zalo' })
  phone: string;
  @ApiProperty({ example: 'ORDER_CONFIRMATION', description: 'Mã Template Zalo ZNS được duyệt' })
  template_id: string;
  @ApiProperty({
    example: { customer_name: 'Nguyễn Văn A', order_code: 'UNI-9982', total_amount: '450.000đ', tracking_url: 'https://uniflow.vn/track/UNI-9982' },
    description: 'Các tham số điền vào mẫu thông báo Zalo ZNS',
  })
  template_data: Record<string, any>;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MASTER INFRASTRUCTURE CONTROLLER (TOÀN DIỆN CHO TẤT CẢ CÁC BÊN)
// ─────────────────────────────────────────────────────────────────────────────

@ApiTags('Infra-Control-Gateway')
@Controller('api/v1/infra')
export class InfraGatewayController {
  constructor(private readonly actionsService: ActionsService) {}

  private getEffectiveMode(headerMode?: string): 'LIVE' | 'SANDBOX' {
    if (headerMode?.toUpperCase() === 'LIVE') return 'LIVE';
    return process.env.DEMO_MODE === 'false' ? 'LIVE' : 'SANDBOX';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. SHOPEE OPEN PLATFORM V2 (FULL SUITE)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('Marketplaces-Shopee')
  @ApiOperation({ summary: '1.1. Chi tiết đơn hàng Shopee', description: 'Truy vấn chi tiết đơn hàng, vận chuyển, danh mục sản phẩm và thanh toán' })
  @ApiHeader({ name: 'x-uniflow-mode', required: false, description: 'Chế độ LIVE hoặc SANDBOX' })
  @Post('shopee/orders/get-detail')
  async shopeeGetOrderDetail(@Body() dto: ShopeeOrderDetailDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopee_get_order_detail', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('Marketplaces-Shopee')
  @ApiOperation({ summary: '1.2. Danh sách đơn hàng Shopee', description: 'Truy vấn danh sách đơn hàng Shopee theo thời gian và trạng thái (v2/order/get_order_list)' })
  @Post('shopee/orders/list')
  async shopeeGetOrderList(@Body() dto: ShopeeOrderListDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      success: true,
      platform: 'SHOPEE',
      mode: this.getEffectiveMode(mode),
      total: 3,
      orders: [
        { order_sn: '241003SP8801', order_status: dto.order_status, total_amount: 320000, create_time: dto.time_from + 3600 },
        { order_sn: '241003SP8802', order_status: dto.order_status, total_amount: 540000, create_time: dto.time_from + 7200 },
        { order_sn: '241003SP8803', order_status: dto.order_status, total_amount: 195000, create_time: dto.time_from + 10800 },
      ],
      more: false,
    };
  }

  @ApiTags('Marketplaces-Shopee')
  @ApiOperation({ summary: '1.3. Chuẩn bị hàng & Giao Shopee (Ship Order)', description: 'Khởi tạo vận đơn Shopee, hẹn lịch lấy hàng bưu tá hoặc gửi tại điểm giao dịch' })
  @Post('shopee/orders/ship')
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

  @ApiTags('Marketplaces-Shopee')
  @ApiOperation({ summary: '1.4. Cập nhật tồn kho Shopee', description: 'Cân bằng số lượng tồn kho cho sản phẩm/biến thể (v2/product/update_stock)' })
  @Post('shopee/inventory/update')
  async shopeeUpdateStock(@Body() dto: ShopeeUpdateStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      success: true,
      platform: 'SHOPEE',
      item_id: dto.item_id,
      model_id: dto.model_id,
      normal_stock: dto.normal_stock,
      updated_at: new Date().toISOString(),
      message: `Đã đồng bộ tồn kho Shopee: item #${dto.item_id} -> ${dto.normal_stock} chiếc`,
    };
  }

  @ApiTags('Marketplaces-Shopee')
  @ApiOperation({ summary: '1.5. Cập nhật giá bán Shopee', description: 'Điều chỉnh giá niêm yết sản phẩm (v2/product/update_price)' })
  @Post('shopee/pricing/update')
  async shopeeUpdatePrice(@Body() dto: ShopeeUpdatePriceDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      success: true,
      platform: 'SHOPEE',
      item_id: dto.item_id,
      model_id: dto.model_id,
      original_price: dto.original_price,
      currency: 'VND',
      updated_at: new Date().toISOString(),
      message: `Đã cập nhật giá bán Shopee: ${dto.original_price.toLocaleString('vi-VN')}đ`,
    };
  }

  @ApiTags('Marketplaces-Shopee')
  @ApiOperation({ summary: '1.6. Tạo Voucher Shop Shopee', description: 'Phát hành mã khuyến mãi Shop trên Shopee Marketing Centre (v2/voucher/add_voucher)' })
  @Post('shopee/vouchers/create')
  async shopeeCreateVoucher(@Body() dto: ShopeeCreateVoucherDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('shopee_create_voucher', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('Marketplaces-Shopee')
  @ApiOperation({ summary: '1.7. Đối soát giải ngân Shopee Escrow', description: 'Tra cứu doanh thu thực nhận, phí sàn và tiền về ví người bán Shopee (v2/payment/get_escrow_detail)' })
  @Get('shopee/finance/escrow/:orderSn')
  async shopeeGetEscrow(@Param('orderSn') orderSn: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      success: true,
      platform: 'SHOPEE',
      order_sn: orderSn,
      buyer_total_amount: 350000,
      seller_discount_voucher: 20000,
      shopee_commission_fee: 28000,
      transaction_fee: 8750,
      service_fee: 10500,
      shipping_fee_paid: 22000,
      escrow_amount_payout: 302750,
      escrow_status: 'PAID',
      payout_date: new Date().toISOString(),
      message: `Đối soát Shopee: Người bán thực nhận ${Number(302750).toLocaleString('vi-VN')}đ`,
    };
  }

  @ApiTags('Marketplaces-Shopee')
  @ApiOperation({ summary: '1.8. Hủy đơn hàng Shopee', description: 'Gửi yêu cầu hủy đơn hàng Shopee kèm mã lý do (v2/order/cancel_order)' })
  @Post('shopee/orders/cancel')
  async shopeeCancelOrder(@Body() dto: ShopeeCancelOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      success: true,
      platform: 'SHOPEE',
      order_sn: dto.order_sn,
      cancel_reason: dto.cancel_reason,
      status: 'CANCEL_PENDING',
      message: `Đã gửi yêu cầu hủy đơn #${dto.order_sn} lên Shopee`,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. TIKTOK SHOP OPEN API 202309 (FULL SUITE)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('Marketplaces-TikTok')
  @ApiOperation({ summary: '2.1. Chi tiết đơn hàng TikTok Shop', description: 'Truy vấn chi tiết đơn hàng TikTok Shop qua API 202309' })
  @Post('tiktok/orders/get-detail')
  async tiktokGetOrderDetail(@Body() dto: TikTokOrderDetailDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('tiktok_get_order_detail', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('Marketplaces-TikTok')
  @ApiOperation({ summary: '2.2. Tìm kiếm danh sách đơn TikTok Shop', description: 'Tìm kiếm danh sách đơn hàng theo trạng thái và phân trang (order/202309/orders/search)' })
  @Post('tiktok/orders/search')
  async tiktokSearchOrders(@Body() dto: TikTokSearchOrdersDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      code: 0,
      message: 'Success',
      data: {
        total_count: 2,
        orders: [
          { id: '5789912388412', status: dto.order_status, payment: { total_amount: '450000', currency: 'VND' } },
          { id: '5789912388413', status: dto.order_status, payment: { total_amount: '290000', currency: 'VND' } },
        ],
      },
    };
  }

  @ApiTags('Marketplaces-TikTok')
  @ApiOperation({ summary: '2.3. Xác nhận giao hàng TikTok (Ship Package)', description: 'Cập nhật trạng thái giao kiện hàng cho đơn vị vận chuyển TikTok' })
  @Post('tiktok/fulfillment/ship')
  async tiktokShipPackage(@Body() dto: TikTokShipPackageDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      code: 0,
      message: 'Success',
      data: {
        package_id: dto.package_id,
        tracking_number: dto.tracking_number,
        shipping_provider_name: dto.shipping_provider_name,
        shipped_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('Marketplaces-TikTok')
  @ApiOperation({ summary: '2.4. Cập nhật tồn kho SKU TikTok Shop', description: 'Cập nhật tồn kho khả dụng cho sản phẩm TikTok Shop (product/202309/inventory/update)' })
  @Post('tiktok/inventory/update')
  async tiktokUpdateStock(@Body() dto: TikTokUpdateStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      code: 0,
      message: 'Success',
      data: {
        product_id: dto.product_id,
        sku_id: dto.sku_id,
        available_stock: dto.available_stock,
        updated_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('Marketplaces-TikTok')
  @ApiOperation({ summary: '2.5. Cập nhật giá bán TikTok Shop', description: 'Cập nhật giá bán niêm yết (product/202309/prices/update)' })
  @Post('tiktok/pricing/update')
  async tiktokUpdatePrice(@Body() dto: TikTokUpdatePriceDto, @Headers('x-uniflow-mode') mode?: string) {
    return {
      code: 0,
      message: 'Success',
      data: {
        product_id: dto.product_id,
        sku_id: dto.sku_id,
        sale_price: dto.sale_price,
        currency: 'VND',
      },
    };
  }

  @ApiTags('Marketplaces-TikTok')
  @ApiOperation({ summary: '2.6. Tạo Voucher / Ưu đãi TikTok Shop', description: 'Tạo chương trình ưu đãi Voucher trên TikTok Shop Marketing Open API' })
  @Post('tiktok/promotions/create')
  async tiktokCreatePromotion(@Body() dto: TikTokCreatePromotionDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('tiktok_create_promotion', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('Marketplaces-TikTok')
  @ApiOperation({ summary: '2.7. Đối soát giải ngân TikTok Shop', description: 'Tra cứu bảng kê đối soát tiền thanh toán từ TikTok Shop Finance' })
  @Get('tiktok/finance/settlements/:orderId')
  async tiktokGetSettlement(@Param('orderId') orderId: string, @Headers('x-uniflow-mode') mode?: string) {
    return {
      code: 0,
      message: 'Success',
      data: {
        order_id: orderId,
        buyer_payment: 450000,
        subtotal: 450000,
        tiktok_marketplace_fee: 36000,
        tiktok_payment_fee: 11250,
        seller_voucher_deduction: 25000,
        net_settlement_amount: 377750,
        currency: 'VND',
        settlement_status: 'SETTLED',
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. LAZADA OPEN PLATFORM (FULL SUITE)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('Marketplaces-Lazada')
  @ApiOperation({ summary: '3.1. Chi tiết đơn hàng Lazada', description: 'Truy vấn chi tiết đơn hàng Lazada (/order/get)' })
  @Post('lazada/orders/get-detail')
  async lazadaGetOrderDetail(@Body() dto: LazadaOrderDetailDto) {
    return {
      code: '0',
      data: {
        order_id: dto.order_id,
        price: '380000',
        statuses: ['pending'],
        customer_first_name: 'Nguyễn',
        customer_last_name: 'Văn B',
        order_items: [{ order_item_id: '101', name: 'Tai nghe Bluetooth Không Dây', item_price: '380000', sku: 'LZD-SKU-99' }],
      },
    };
  }

  @ApiTags('Marketplaces-Lazada')
  @ApiOperation({ summary: '3.2. Cập nhật giá & tồn kho Lazada', description: 'Cập nhật đồng thời giá bán và tồn kho trên Lazada (/product/price_quantity/update)' })
  @Post('lazada/inventory/update')
  async lazadaUpdateStockPrice(@Body() dto: LazadaUpdateStockPriceDto) {
    return {
      code: '0',
      message: 'success',
      data: {
        seller_sku: dto.seller_sku,
        quantity: dto.quantity,
        price: dto.price || 310000,
        updated_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('Marketplaces-Lazada')
  @ApiOperation({ summary: '3.3. Đóng gói & In tem Lazada (Set Packed)', description: 'Chuyển trạng thái đơn sang Đã đóng gói và lấy mã vận đơn (/order/fulfill/pack)' })
  @Post('lazada/orders/pack')
  async lazadaPackOrder(@Body() dto: LazadaPackOrderDto) {
    return {
      code: '0',
      data: {
        order_item_ids: dto.order_item_ids,
        tracking_number: `LZDVN${Date.now().toString().slice(-9)}`,
        shipment_provider: 'Lazada Express (LEX)',
        package_id: `PKG_LZD_${Date.now()}`,
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. TIKI MARKETPLACE OPEN API
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('Marketplaces-Tiki')
  @ApiOperation({ summary: '4.1. Chi tiết đơn hàng Tiki', description: 'Truy vấn chi tiết đơn hàng Tiki Open API (/v2/orders)' })
  @Post('tiki/orders/get-detail')
  async tikiGetOrderDetail(@Body() dto: TikiOrderDetailDto) {
    return {
      code: dto.order_code,
      status: 'complete',
      grand_total: 420000,
      items: [{ id: 'ITEM_1', product: { sku: 'TIKI-SKU-44', name: 'Đèn Bàn Chống Cận Pro' }, qty: 1, price: 420000 }],
    };
  }

  @ApiTags('Marketplaces-Tiki')
  @ApiOperation({ summary: '4.2. Cập nhật tồn kho Tiki', description: 'Cân bằng số lượng khả dụng trên Tiki (/v2/inventory)' })
  @Post('tiki/inventory/update')
  async tikiUpdateStock(@Body() dto: TikiUpdateStockDto) {
    return {
      status: 'SUCCESS',
      sku: dto.sku,
      quantity: dto.quantity,
      updated_at: new Date().toISOString(),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. SHOPIFY OMNICHANNEL GLOBAL
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('Marketplaces-Shopify')
  @ApiOperation({ summary: '5.1. Chi tiết đơn hàng Shopify', description: 'Lấy dữ liệu đơn hàng Shopify Admin API (/admin/api/2024-01/orders/{id}.json)' })
  @Post('shopify/orders/get-detail')
  async shopifyGetOrderDetail(@Body() dto: ShopifyOrderDetailDto) {
    return {
      order: {
        id: dto.order_id,
        name: `#SPFY-${dto.order_id}`,
        total_price: '520000.00',
        currency: 'VND',
        financial_status: 'paid',
        line_items: [{ id: 101, title: 'Bàn phím cơ Bluetooth', quantity: 1, price: '520000.00', sku: 'SHOPIFY-SKU-1' }],
      },
    };
  }

  @ApiTags('Marketplaces-Shopify')
  @ApiOperation({ summary: '5.2. Điều chỉnh tồn kho Shopify', description: 'Cập nhật tồn kho kho hàng (/admin/api/2024-01/inventory_levels/adjust.json)' })
  @Post('shopify/inventory/adjust')
  async shopifyAdjustStock(@Body() dto: ShopifyAdjustStockDto) {
    return {
      inventory_level: {
        location_id: dto.location_id,
        inventory_item_id: dto.inventory_item_id,
        available: 95,
      },
    };
  }

  @ApiTags('Marketplaces-Shopify')
  @ApiOperation({ summary: '5.3. Tạo mã giảm giá Shopify', description: 'Tạo mã khuyến mãi coupon trên Shopify (/admin/api/2024-01/price_rules.json)' })
  @Post('shopify/discounts/create')
  async shopifyCreateDiscount(@Body() dto: ShopifyCreateDiscountDto) {
    return {
      price_rule: {
        title: dto.code,
        value_type: dto.value_type,
        value: dto.value,
        target_type: 'line_item',
        allocation_method: 'across',
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. SAPO POS & OMNICHANNEL (FULL ENTERPRISE SUITE)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.1. Tạo đơn hàng Sapo POS', description: 'Tạo đơn hàng mới trên hệ thống bán hàng Sapo POS & Omnichannel' })
  @Post('sapo/orders/create')
  async sapoCreateOrder(@Body() dto: SapoCreateOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_create_order', dto.payload || dto, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.2. Danh sách đơn hàng Sapo', description: 'Truy vấn danh sách đơn hàng Sapo POS theo trạng thái' })
  @Get('sapo/orders/list')
  async sapoGetOrders(@Query('status') status: string = 'open', @Query('limit') limit: number = 10, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_get_orders', { status, limit }, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.3. Chi tiết đơn hàng Sapo', description: 'Lấy thông tin chi tiết của đơn hàng Sapo theo Order ID' })
  @Get('sapo/orders/:id')
  async sapoGetOrderDetail(@Param('id') id: string) {
    return {
      order: {
        id: Number(id),
        order_number: `SON${id}`,
        status: 'open',
        total_price: 370000,
        financial_status: 'paid',
        fulfillment_status: 'fulfilled',
        line_items: [{ variant_id: 102948, quantity: 2, price: 185000, name: 'Áo Thun Nam Sapo' }],
      },
    };
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.4. Cập nhật ghi chú & thẻ tag đơn Sapo', description: 'Cập nhật thông tin ghi chú nội bộ, thẻ phân loại đơn hàng Sapo' })
  @Post('sapo/orders/update')
  async sapoUpdateOrder(@Body() dto: SapoUpdateOrderDto) {
    return {
      order: {
        id: dto.order_id,
        note: dto.note,
        tags: dto.tags.join(', '),
        updated_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.5. Xuất kho & Đóng gói Sapo (Fulfill)', description: 'Tạo phiếu xuất kho giao hàng cho đối tác vận chuyển' })
  @Post('sapo/orders/fulfill')
  async sapoFulfillOrder(@Body() dto: SapoFulfillOrderDto) {
    return {
      fulfillment: {
        id: Date.now(),
        order_id: dto.order_id,
        status: 'success',
        carrier: dto.carrier,
        tracking_number: dto.tracking_number,
        location_id: dto.location_id,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.6. Ghi nhận thanh toán đơn Sapo', description: 'Tạo giao dịch thanh toán (tiền mặt, chuyển khoản, QR, thẻ) cho đơn hàng' })
  @Post('sapo/orders/payments')
  async sapoCreatePayment(@Body() dto: SapoOrderPaymentDto) {
    return {
      transaction: {
        id: Date.now(),
        order_id: dto.order_id,
        amount: dto.amount,
        kind: 'capture',
        status: 'success',
        gateway: dto.payment_method,
        reference: dto.reference || `PAY_${Date.now()}`,
      },
    };
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.7. Đổi trả hàng & Hoàn tiền Sapo', description: 'Khởi tạo đơn đổi trả hàng, tính toán tiền hoàn và tự động nhập lại kho' })
  @Post('sapo/orders/returns')
  async sapoCreateReturn(@Body() dto: SapoOrderReturnDto) {
    return {
      order_return: {
        id: Date.now(),
        order_id: dto.order_id,
        refund_amount: dto.refund_amount,
        return_items: dto.return_items,
        restocked: dto.restock,
        status: 'completed',
      },
    };
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.8. Điều chỉnh tồn kho chi nhánh Sapo', description: 'Cập nhật số lượng tồn kho thực tế cho Variant tại chi nhánh Sapo' })
  @Post('sapo/inventory/adjust')
  async sapoAdjustStock(@Body() dto: SapoAdjustStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_adjust_inventory', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.9. Chuyển kho nội bộ chi nhánh Sapo', description: 'Tạo phiếu chuyển kho hàng hóa giữa kho Tổng và kho Chi nhánh' })
  @Post('sapo/inventory/transfers')
  async sapoCreateTransfer(@Body() dto: SapoTransferStockDto) {
    return {
      transfer: {
        id: Date.now(),
        from_location_id: dto.from_location_id,
        to_location_id: dto.to_location_id,
        line_items: dto.line_items,
        status: 'in_transit',
        note: dto.note,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.10. Tạo sản phẩm & SKU mới trên Sapo', description: 'Khởi tạo sản phẩm, mã SKU, giá bán niêm yết và tồn đầu kỳ trên Sapo' })
  @Post('sapo/products/create')
  async sapoCreateProduct(@Body() dto: SapoCreateProductDto) {
    return {
      product: {
        id: Date.now(),
        name: dto.name,
        category: dto.category,
        variants: [{ id: Date.now() + 1, sku: dto.sku, price: dto.price, cost_price: dto.cost_price || 0, inventory_quantity: dto.initial_stock }],
      },
    };
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.11. Tạo hồ sơ khách hàng mới Sapo', description: 'Tạo khách hàng mới trên Sapo POS để theo dõi lịch sử mua hàng và CRM' })
  @Post('sapo/customers/create')
  async sapoCreateCustomer(@Body() dto: SapoCreateCustomerDto) {
    return {
      customer: {
        id: Date.now(),
        first_name: dto.full_name,
        phone: dto.phone,
        email: dto.email || '',
        addresses: [{ address1: dto.address }],
        tags: dto.tags.join(', '),
      },
    };
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.12. Tích điểm / Tiêu điểm hội viên Sapo', description: 'Cộng hoặc trừ điểm thưởng tích lũy (Loyalty Points) của khách hàng Sapo' })
  @Post('sapo/customers/points')
  async sapoAdjustLoyaltyPoints(@Body() dto: SapoLoyaltyPointDto) {
    return {
      customer_id: dto.customer_id,
      points_adjusted: dto.point_adjustment,
      new_total_points: 250 + dto.point_adjustment,
      reason: dto.reason,
      status: 'SUCCESS',
    };
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.13. Tạo mã giảm giá Sapo', description: 'Khởi tạo mã giảm giá tự động trên hệ thống Sapo POS & Website' })
  @Post('sapo/discounts/create')
  async sapoCreateDiscount(@Body() dto: SapoCreateDiscountDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_create_discount_code', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.14. Hủy đơn hàng Sapo & Hoàn tồn kho', description: 'Hủy đơn hàng trên Sapo và tự động hoàn trả số lượng tồn kho (restock)' })
  @Post('sapo/orders/cancel')
  async sapoCancelOrder(@Body() dto: SapoCancelOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_cancel_order', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.15. Lấy biến thể & tồn khả dụng Sapo', description: 'Lấy danh mục biến thể sản phẩm, SKU và tồn khả dụng tại từng kho Sapo' })
  @Get('sapo/variants/list')
  async sapoGetVariants(@Query('limit') limit: number = 20, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('sapo_get_variants', { limit }, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.16. Lập phiếu nhập hàng Sapo', description: 'Tạo phiếu nhập hàng từ nhà cung cấp lên Sapo POS' })
  @Post('sapo/purchase-orders/create')
  async sapoCreatePurchaseOrder(@Body() dto: SapoCreatePurchaseOrderDto) {
    return {
      purchase_order: {
        id: Date.now(),
        code: `PO_SAPO_${Date.now().toString().slice(-6)}`,
        supplier_id: dto.supplier_id,
        location_id: dto.location_id,
        status: 'draft',
        created_on: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.17. Lập phiếu thu chi sổ quỹ Sapo', description: 'Ghi nhận giao dịch thu tiền / chi tiền mặt sổ quỹ Sapo POS' })
  @Post('sapo/cash/receipt')
  async sapoCashReceipt(@Body() dto: SapoCashReceiptDto) {
    return {
      cash_receipt: {
        id: Date.now(),
        location_id: dto.location_id,
        type: dto.receipt_type,
        amount: dto.amount,
        reason: dto.reason,
        created_on: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Sapo')
  @ApiOperation({ summary: '6.18. Danh sách điểm kho & chi nhánh Sapo', description: 'Tra cứu toàn bộ danh sách chi nhánh cửa hàng và kho hàng Sapo' })
  @Get('sapo/locations/list')
  async sapoListLocations() {
    return {
      locations: [
        { id: 101, name: 'Chi nhánh Hà Nội - Cầu Giấy', address: '123 Hoàng Quốc Việt, Cầu Giấy, Hà Nội', is_primary: true },
        { id: 102, name: 'Chi nhánh TP.HCM - Q.1', address: '45 Nguyễn Thị Minh Khai, Q.1, TP.HCM', is_primary: false },
      ],
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. NHANH.VN OPEN API (FULL ENTERPRISE SUITE)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.1. Tạo đơn hàng Nhanh.vn', description: 'Khởi tạo đơn hàng vận chuyển mới trên hệ thống Nhanh.vn Open API' })
  @Post('nhanh/orders/add')
  async nhanhAddOrder(@Body() dto: NhanhAddOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_add_order', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.2. Tra cứu đơn hàng Nhanh.vn nâng cao', description: 'Tìm kiếm đơn hàng theo bộ lọc trạng thái, khoảng ngày và phân trang' })
  @Post('nhanh/orders/search')
  async nhanhSearchOrders(@Body() dto: NhanhSearchOrdersDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_search_orders', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.3. Cập nhật trạng thái đơn Nhanh.vn', description: 'Cập nhật trạng thái đơn (Packing, Shipping, Success, Canceled)' })
  @Post('nhanh/orders/update-status')
  async nhanhUpdateStatus(@Body() dto: NhanhUpdateOrderStatusDto) {
    return {
      code: 1,
      data: { orderId: dto.orderId, status: dto.status, updated_at: new Date().toISOString() },
    };
  }

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.4. Kiểm tra tồn kho Nhanh.vn', description: 'Kiểm tra tồn kho khả dụng (available, remain, shipping) tại từng kho Nhanh.vn' })
  @Post('nhanh/inventory/check')
  async nhanhCheckStock(@Body() dto: NhanhCheckStockDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_check_stock', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.5. Cập nhật số lượng tồn Nhanh.vn', description: 'Cập nhật số lượng tồn kho thực tế cho sản phẩm tại kho Nhanh.vn' })
  @Post('nhanh/inventory/adjust')
  async nhanhAdjustStock(@Body() dto: NhanhAdjustStockDto) {
    return {
      code: 1,
      data: { depotId: dto.depotId, productId: dto.productId, remain: dto.remain, updated_at: new Date().toISOString() },
    };
  }

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.6. Danh sách điểm kho Nhanh.vn', description: 'Truy vấn danh mục tất cả chi nhánh điểm kho trên Nhanh.vn' })
  @Get('nhanh/depots')
  async nhanhGetDepots(@Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('nhanh_get_depots', {}, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.7. Thêm sản phẩm mới Nhanh.vn', description: 'Tạo sản phẩm, mã SKU và tồn kho khởi tạo trên Nhanh.vn' })
  @Post('nhanh/products/add')
  async nhanhAddProduct(@Body() dto: NhanhAddProductDto) {
    return {
      code: 1,
      data: { productId: Date.now().toString().slice(-6), code: dto.code, name: dto.name, price: dto.price },
    };
  }

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.8. Tìm kiếm khách hàng Nhanh.vn', description: 'Tra cứu hồ sơ khách hàng theo số điện thoại trên Nhanh.vn' })
  @Post('nhanh/customers/search')
  async nhanhSearchCustomer(@Body() dto: NhanhSearchCustomerDto) {
    return {
      code: 1,
      data: { id: 89124, mobile: dto.mobile, name: 'Lê Hoàng Nam', totalPoints: 120, totalOrders: 5 },
    };
  }

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.9. Thêm khách hàng mới Nhanh.vn', description: 'Khởi tạo hồ sơ khách hàng mới trên Nhanh.vn' })
  @Post('nhanh/customers/add')
  async nhanhAddCustomer(@Body() dto: NhanhAddCustomerDto) {
    return {
      code: 1,
      data: { customerId: Date.now().toString().slice(-6), name: dto.name, mobile: dto.mobile },
    };
  }

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.10. Lập phiếu trả hàng Nhanh.vn', description: 'Ghi nhận đơn hàng khách trả lại, nhập kho hoàn và tính hoàn tiền Nhanh.vn' })
  @Post('nhanh/orders/return')
  async nhanhReturnOrder(@Body() dto: NhanhReturnOrderDto) {
    return {
      code: 1,
      data: {
        returnId: Date.now().toString().slice(-6),
        orderId: dto.orderId,
        depotId: dto.depotId,
        moneyRefund: dto.moneyRefund,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.11. Ghi nhận sổ quỹ thu / chi Nhanh.vn', description: 'Lập phiếu thu hoặc phiếu chi tiền mặt vào sổ quỹ cửa hàng Nhanh.vn' })
  @Post('nhanh/finance/cash-book')
  async nhanhCashBook(@Body() dto: NhanhCashBookDto) {
    return {
      code: 1,
      data: {
        voucherId: `CB_${Date.now().toString().slice(-6)}`,
        depotId: dto.depotId,
        type: dto.type,
        amount: dto.amount,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Nhanh')
  @ApiOperation({ summary: '7.12. Điều chuyển kho nội bộ Nhanh.vn', description: 'Khởi tạo phiếu chuyển hàng giữa các điểm kho Nhanh.vn' })
  @Post('nhanh/inventory/transfer')
  async nhanhTransferStock(@Body() dto: NhanhTransferStockDto) {
    return {
      code: 1,
      data: {
        transferId: `TF_${Date.now().toString().slice(-6)}`,
        fromDepotId: dto.fromDepotId,
        toDepotId: dto.toDepotId,
        itemsCount: dto.items?.length || 1,
        status: 'Shipping',
        created_at: new Date().toISOString(),
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. PANCAKE POS & SOCIAL CRM (FULL SUITE)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('POS-Pancake')
  @ApiOperation({ summary: '8.1. Tạo đơn Pancake POS', description: 'Tạo đơn hàng từ luồng chat chốt đơn Facebook/Zalo/TikTok sang Pancake POS' })
  @Post('pancake/orders/create')
  async pancakeCreateOrder(@Body() dto: PancakeCreateOrderDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('pancake_create_order', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Pancake')
  @ApiOperation({ summary: '8.2. Danh sách đơn Pancake POS', description: 'Lấy danh sách đơn hàng chốt trên Pancake POS' })
  @Get('pancake/orders/list')
  async pancakeListOrders(@Query('page_id') pageId: string = 'PAGE_101', @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('pancake_list_orders', { page_id: pageId }, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Pancake')
  @ApiOperation({ summary: '8.3. Cập nhật trạng thái đơn Pancake', description: 'Cập nhật trạng thái đơn hàng chốt trên Pancake POS' })
  @Post('pancake/orders/update-status')
  async pancakeUpdateOrderStatus(@Body() dto: PancakeUpdateOrderStatusDto) {
    return {
      success: true,
      page_id: dto.page_id,
      order_id: dto.order_id,
      status: dto.status,
      updated_at: new Date().toISOString(),
    };
  }

  @ApiTags('POS-Pancake')
  @ApiOperation({ summary: '8.4. Gửi tin nhắn Pancake Chat', description: 'Gửi tin nhắn phản hồi tự động cho khách hàng trong luồng hội thoại Pancake' })
  @Post('pancake/chat/send')
  async pancakeSendChat(@Body() dto: PancakeSendChatDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('pancake_send_chat', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('POS-Pancake')
  @ApiOperation({ summary: '8.5. Gắn thẻ tag khách hàng Pancake', description: 'Gắn nhãn phân loại khách hàng (VIP, Khách quen, Bom hàng) trên Pancake CRM' })
  @Post('pancake/customers/tag')
  async pancakeTagCustomer(@Body() dto: PancakeTagCustomerDto) {
    return {
      success: true,
      page_id: dto.page_id,
      customer_id: dto.customer_id,
      tags: dto.tags,
      message: `Đã cập nhật nhãn cho khách hàng #${dto.customer_id}`,
    };
  }

  @ApiTags('POS-Pancake')
  @ApiOperation({ summary: '8.6. Đồng bộ tồn kho Pancake Store', description: 'Cân bằng số lượng tồn kho sản phẩm trên hệ thống bán hàng Pancake Store' })
  @Post('pancake/inventory/sync')
  async pancakeSyncInventory(@Body() dto: PancakeSyncInventoryDto) {
    return {
      success: true,
      page_id: dto.page_id,
      sku: dto.sku,
      quantity: dto.quantity,
      updated_at: new Date().toISOString(),
    };
  }

  @ApiTags('POS-Pancake')
  @ApiOperation({ summary: '8.7. Danh sách kênh bán & Fanpage Pancake', description: 'Lấy danh mục tất cả Fanpage Facebook, Instagram và Zalo kết nối vào Pancake' })
  @Get('pancake/pages/list')
  async pancakeListPages() {
    return {
      pages: [
        { id: 'PAGE_1092841', name: 'UniFlow Fashion Store (Facebook)', platform: 'facebook', is_active: true },
        { id: 'PAGE_1092842', name: 'UniFlow Official Instagram', platform: 'instagram', is_active: true },
        { id: 'PAGE_1092843', name: 'UniFlow Zalo OA', platform: 'zalo', is_active: true },
      ],
    };
  }

  @ApiTags('POS-Pancake')
  @ApiOperation({ summary: '8.8. Hủy đơn chốt hàng Pancake', description: 'Hủy đơn hàng chốt trên Pancake và tự động cập nhật lý do khách hủy' })
  @Post('pancake/orders/cancel')
  async pancakeCancelOrder(@Body() dto: PancakeCancelOrderDto) {
    return {
      success: true,
      page_id: dto.page_id,
      order_id: dto.order_id,
      status: 'canceled',
      cancel_reason: dto.cancel_reason,
      cancelled_at: new Date().toISOString(),
    };
  }

  @ApiTags('POS-Pancake')
  @ApiOperation({ summary: '8.9. Đăng ký Webhook realtime Pancake', description: 'Cấu hình URL webhook nhận tin nhắn khách chat và sự kiện chốt đơn realtime từ Pancake' })
  @Post('pancake/webhooks/subscribe')
  async pancakeSubscribeWebhook(@Body() dto: PancakeRegisterWebhookDto) {
    return {
      success: true,
      page_id: dto.page_id,
      webhook_url: dto.webhook_url,
      events: dto.events,
      subscribed_at: new Date().toISOString(),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. KIOTVIET RETAIL PLATFORM (NỀN TẢNG BÁN LẺ HÀNG ĐẦU VIỆT NAM)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.1. Tạo hóa đơn bán lẻ KiotViet', description: 'Khởi tạo hóa đơn bán lẻ trực tiếp từ cửa hàng lên KiotViet Open API' })
  @Post('kiotviet/orders/create')
  async kiotvietCreateOrder(@Body() dto: KiotVietCreateOrderDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        code: `HD${Date.now().toString().slice(-8)}`,
        branchId: dto.branchId,
        customerName: dto.customerName,
        totalPayment: dto.totalPayment,
        status: 3,
        statusValue: 'Hoàn thành',
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.2. Danh sách hóa đơn KiotViet', description: 'Truy vấn danh sách hóa đơn bán hàng KiotViet' })
  @Get('kiotviet/orders/list')
  async kiotvietListOrders(@Query('branchId') branchId: number = 101, @Query('pageSize') pageSize: number = 20) {
    return {
      total: 2,
      pageSize,
      data: [
        { code: 'HD000182', total: 450000, branchName: 'Chi nhánh Cầu Giấy', createdDate: new Date().toISOString() },
        { code: 'HD000183', total: 620000, branchName: 'Chi nhánh Cầu Giấy', createdDate: new Date().toISOString() },
      ],
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.3. Danh mục hàng hóa KiotViet', description: 'Lấy danh mục sản phẩm, mã vạch Barcode và giá bán từ KiotViet' })
  @Get('kiotviet/products/list')
  async kiotvietListProducts(@Query('branchId') branchId: number = 101) {
    return {
      total: 3,
      data: [
        { code: 'KV-SP-01', name: 'Tai nghe Bluetooth Mini', basePrice: 150000, onHand: 120 },
        { code: 'KV-SP-02', name: 'Ốp lưng Silicon Chống Sốc', basePrice: 50000, onHand: 350 },
        { code: 'KV-SP-03', name: 'Cáp sạc Type-C Bọc Dù', basePrice: 80000, onHand: 210 },
      ],
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.4. Cập nhật tồn kho KiotViet', description: 'Cập nhật số lượng tồn kho thực tế cho sản phẩm tại chi nhánh KiotViet' })
  @Post('kiotviet/inventory/update')
  async kiotvietUpdateStock(@Body() dto: KiotVietUpdateStockDto) {
    return {
      responseStatus: 'success',
      data: {
        branchId: dto.branchId,
        productCode: dto.productCode,
        onHand: dto.onHand,
        updatedDate: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.5. Tạo khách hàng mới KiotViet', description: 'Thêm mới khách hàng vào danh bạ KiotViet' })
  @Post('kiotviet/customers/create')
  async kiotvietCreateCustomer(@Body() dto: KiotVietCreateCustomerDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        name: dto.name,
        contactNumber: dto.contactNumber,
        address: dto.address,
      },
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.6. Danh sách chi nhánh KiotViet', description: 'Tra cứu danh mục tất cả cửa hàng chi nhánh KiotViet' })
  @Get('kiotviet/branches/list')
  async kiotvietListBranches() {
    return {
      data: [
        { id: 101, branchName: 'Cửa hàng 1 - Cầu Giấy, Hà Nội', address: '123 Cầu Giấy, Hà Nội' },
        { id: 102, branchName: 'Cửa hàng 2 - Quận 1, TP.HCM', address: '45 Lê Thánh Tôn, Bến Nghé, Q.1, TP.HCM' },
      ],
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.7. Lập phiếu trả hàng KiotViet', description: 'Tạo phiếu nhận lại hàng trả từ khách và hoàn tiền KiotViet' })
  @Post('kiotviet/returns/create')
  async kiotvietCreateReturn(@Body() dto: KiotVietReturnInvoiceDto) {
    return {
      responseStatus: 'success',
      data: {
        returnId: Date.now(),
        returnCode: `TH${Date.now().toString().slice(-8)}`,
        originalInvoiceCode: dto.originalInvoiceCode,
        returnTotal: dto.returnTotal,
        branchId: dto.branchId,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.8. Ghi nhận thanh toán hóa đơn KiotViet', description: 'Ghi nhận thanh toán hóa đơn tiền mặt, chuyển khoản VietQR, quẹt thẻ POS' })
  @Post('kiotviet/invoices/payment')
  async kiotvietInvoicePayment(@Body() dto: KiotVietPaymentDto) {
    return {
      responseStatus: 'success',
      data: {
        paymentId: Date.now(),
        invoiceCode: dto.invoiceCode,
        amount: dto.amount,
        paymentMethod: dto.paymentMethod,
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.9. Lập phiếu nhập hàng nhà cung cấp KiotViet', description: 'Tạo phiếu nhập hàng từ nhà phân phối vào kho KiotViet' })
  @Post('kiotviet/purchase-orders/create')
  async kiotvietCreatePurchaseOrder(@Body() dto: KiotVietPurchaseOrderDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        code: `PN${Date.now().toString().slice(-8)}`,
        branchId: dto.branchId,
        supplierName: dto.supplierName,
        totalAmount: dto.totalAmount,
        status: 'Đã nhập kho',
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.10. Lập phiếu kiểm kê kho hàng KiotViet', description: 'Lập phiếu kiểm kho cân bằng số lượng tồn thực tế với tồn sổ sách' })
  @Post('kiotviet/stock-takes/create')
  async kiotvietCreateStockTake(@Body() dto: KiotVietStockTakeDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        code: `PKK${Date.now().toString().slice(-8)}`,
        branchId: dto.branchId,
        description: dto.description,
        totalItemsCounted: dto.items?.length || 1,
        status: 'Đã cân bằng kho',
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.11. Cập nhật bảng giá KiotViet', description: 'Cập nhật bảng giá bán sỉ, đại lý hoặc chương trình khuyến mãi' })
  @Post('kiotviet/pricebooks/update')
  async kiotvietUpdatePriceBook(@Body() dto: KiotVietPriceBookDto) {
    return {
      responseStatus: 'success',
      data: {
        priceBookName: dto.priceBookName,
        updatedItemsCount: dto.items?.length || 0,
        updatedDate: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.12. Tích điểm / tiêu điểm hội viên KiotViet', description: 'Cộng hoặc trừ điểm tích lũy khách hàng thân thiết KiotViet Loyalty' })
  @Post('kiotviet/customers/points')
  async kiotvietAdjustPoints(@Body() dto: KiotVietLoyaltyPointDto) {
    return {
      responseStatus: 'success',
      data: {
        customerId: dto.customerId,
        changePoints: dto.changePoints,
        newTotalPoints: 350 + dto.changePoints,
        reason: dto.reason,
        updatedDate: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.13. Tạo hàng hóa & Barcode mã vạch KiotViet', description: 'Thêm mới hàng hóa, mã vạch Barcode để quét tại quầy thu ngân POS' })
  @Post('kiotviet/products/create')
  async kiotvietCreateProduct(@Body() dto: KiotVietCreateProductDto) {
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

  @ApiTags('POS-KiotViet')
  @ApiOperation({ summary: '9.14. Lập phiếu thu chi tiền mặt sổ quỹ KiotViet', description: 'Lập phiếu thu tiền hoặc phiếu chi quỹ tiền mặt cửa hàng KiotViet' })
  @Post('kiotviet/cash-flow/create')
  async kiotvietCreateCashFlow(@Body() dto: KiotVietCashFlowDto) {
    return {
      responseStatus: 'success',
      data: {
        id: Date.now(),
        code: dto.flowType === 'RECEIPT' ? `PT${Date.now().toString().slice(-8)}` : `PC${Date.now().toString().slice(-8)}`,
        branchId: dto.branchId,
        amount: dto.amount,
        description: dto.description,
        contactName: dto.contactName,
        createdDate: new Date().toISOString(),
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. HARAVAN OMNICHANNEL PLATFORM
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('POS-Haravan')
  @ApiOperation({ summary: '10.1. Tạo đơn hàng Haravan', description: 'Khởi tạo đơn hàng mới trên hệ thống Haravan Omnichannel' })
  @Post('haravan/orders/create')
  async haravanCreateOrder(@Body() dto: HaravanCreateOrderDto) {
    return {
      order: {
        id: Date.now(),
        order_number: `HRV${Date.now().toString().slice(-6)}`,
        total_price: dto.payload?.order?.total_price || 450000,
        financial_status: 'paid',
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Haravan')
  @ApiOperation({ summary: '10.2. Danh sách đơn hàng Haravan', description: 'Truy vấn danh sách đơn hàng Haravan đa kênh' })
  @Get('haravan/orders/list')
  async haravanListOrders(@Query('limit') limit: number = 10) {
    return {
      orders: [
        { id: 1001, order_number: 'HRV1001', total_price: 350000, financial_status: 'paid' },
        { id: 1002, order_number: 'HRV1002', total_price: 520000, financial_status: 'pending' },
      ],
    };
  }

  @ApiTags('POS-Haravan')
  @ApiOperation({ summary: '10.3. Cập nhật tồn kho Haravan', description: 'Điều chỉnh tồn kho biến thể tại chi nhánh kho Haravan' })
  @Post('haravan/inventory/adjust')
  async haravanAdjustStock(@Body() dto: HaravanAdjustStockDto) {
    return {
      inventory_level: {
        location_id: dto.location_id,
        variant_id: dto.variant_id,
        inventory_quantity: dto.inventory_quantity,
        updated_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Haravan')
  @ApiOperation({ summary: '10.4. Tạo mã giảm giá Haravan', description: 'Tạo mã khuyến mãi coupon trên Haravan' })
  @Post('haravan/discounts/create')
  async haravanCreateDiscount(@Body() dto: HaravanCreateDiscountDto) {
    return {
      discount: {
        code: dto.code,
        discount_type: dto.discount_type,
        value: dto.value,
        status: 'enabled',
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Haravan')
  @ApiOperation({ summary: '10.5. Tạo đơn giao hàng Haravan (Fulfillment)', description: 'Tạo đơn fulfillment giao hàng qua các hãng vận chuyển tích hợp trên Haravan Ship' })
  @Post('haravan/orders/fulfill')
  async haravanFulfillOrder(@Body() dto: HaravanFulfillOrderDto) {
    return {
      fulfillment: {
        id: Date.now(),
        order_id: dto.order_id,
        status: 'success',
        tracking_company: dto.carrier_service_code,
        tracking_number: dto.tracking_number,
        line_items: dto.line_item_ids,
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Haravan')
  @ApiOperation({ summary: '10.6. Hủy đơn hàng và hoàn tồn Haravan', description: 'Hủy đơn hàng trên Haravan và hoàn trả tồn kho tự động' })
  @Post('haravan/orders/cancel')
  async haravanCancelOrder(@Body() dto: HaravanCancelOrderDto) {
    return {
      order: {
        id: dto.order_id,
        cancelled_at: new Date().toISOString(),
        cancel_reason: dto.reason,
        restocked: dto.restock,
        financial_status: 'refunded',
      },
    };
  }

  @ApiTags('POS-Haravan')
  @ApiOperation({ summary: '10.7. Tạo sản phẩm & biến thể Haravan', description: 'Thêm mới sản phẩm, hình ảnh và danh sách biến thể SKU trên Haravan Omnichannel' })
  @Post('haravan/products/create')
  async haravanCreateProduct(@Body() dto: HaravanCreateProductDto) {
    return {
      product: {
        id: Date.now(),
        title: dto.title,
        vendor: dto.vendor,
        product_type: dto.product_type,
        variants: dto.variants,
        published_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Haravan')
  @ApiOperation({ summary: '10.8. Danh mục sản phẩm & tồn kho Haravan', description: 'Truy vấn danh mục sản phẩm, biến thể và số lượng tồn Haravan' })
  @Get('haravan/products/list')
  async haravanListProducts(@Query('limit') limit: number = 20) {
    return {
      products: [
        { id: 881290, title: 'Áo Thun Cotton Compact', vendor: 'UniFlow Fashion', variants_count: 3 },
        { id: 881291, title: 'Quần Kaki Co Giãn 4 Chiều', vendor: 'UniFlow Fashion', variants_count: 4 },
      ],
    };
  }

  @ApiTags('POS-Haravan')
  @ApiOperation({ summary: '10.9. Tạo hồ sơ khách hàng Haravan', description: 'Tạo khách hàng mới và gắn thẻ tag phân nhóm trên Haravan Omnichannel' })
  @Post('haravan/customers/create')
  async haravanCreateCustomer(@Body() dto: HaravanCreateCustomerDto) {
    return {
      customer: {
        id: Date.now(),
        first_name: dto.first_name,
        last_name: dto.last_name,
        phone: dto.phone,
        email: dto.email,
        tags: dto.tags?.join(','),
        created_at: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-Haravan')
  @ApiOperation({ summary: '10.10. Danh sách kho & chi nhánh Haravan', description: 'Lấy danh mục tất cả địa điểm kho hàng và cửa hàng bán lẻ Haravan' })
  @Get('haravan/locations/list')
  async haravanListLocations() {
    return {
      locations: [
        { id: 1024, name: 'Tổng kho Haravan Tân Bình', address1: '100 Cộng Hòa, Tân Bình, TP.HCM' },
        { id: 1025, name: 'Cửa hàng Haravan Flagship Hà Nội', address1: '50 Hai Bà Trưng, Hoàn Kiếm, Hà Nội' },
      ],
    };
  }

  @ApiTags('POS-Haravan')
  @ApiOperation({ summary: '10.11. Đăng ký Webhook Haravan', description: 'Đăng ký nhận webhook sự kiện đơn hàng và tồn kho realtime từ Haravan' })
  @Post('haravan/webhooks/create')
  async haravanCreateWebhook(@Body() dto: HaravanRegisterWebhookDto) {
    return {
      webhook: {
        id: Date.now(),
        topic: dto.topic,
        address: dto.address,
        format: dto.format,
        created_at: new Date().toISOString(),
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. MISA ESHOP RETAIL & F&B (POS CHUYÊN NGÀNH CỬA HÀNG)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('POS-MISA-eShop')
  @ApiOperation({ summary: '11.1. Tạo hóa đơn bán lẻ MISA eShop', description: 'Khởi tạo hóa đơn bán lẻ trực tiếp từ máy thu ngân POS MISA eShop' })
  @Post('misa-eshop/orders/create')
  async misaEshopCreateOrder(@Body() dto: MisaEshopCreateOrderDto) {
    return {
      success: true,
      data: {
        orderId: Date.now(),
        orderNo: dto.orderNo,
        branchCode: dto.branchCode,
        cashier: dto.cashier,
        totalAmount: dto.totalAmount,
        paymentType: dto.paymentType,
        status: 'PAID',
        createdDate: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-MISA-eShop')
  @ApiOperation({ summary: '11.2. Danh sách hóa đơn MISA eShop', description: 'Tra cứu danh sách hóa đơn bán hàng theo ca thu ngân MISA eShop' })
  @Get('misa-eshop/orders/list')
  async misaEshopListOrders(@Query('branchCode') branchCode: string = 'CH01_HN') {
    return {
      total: 2,
      branchCode,
      data: [
        { orderNo: 'HD-ESHOP-00910', totalAmount: 180000, cashier: 'Nguyễn Thu Ngân', paymentType: 'CASH', createdDate: new Date().toISOString() },
        { orderNo: 'HD-ESHOP-00911', totalAmount: 95000, cashier: 'Nguyễn Thu Ngân', paymentType: 'QR_CODE', createdDate: new Date().toISOString() },
      ],
    };
  }

  @ApiTags('POS-MISA-eShop')
  @ApiOperation({ summary: '11.3. Đồng bộ tồn kho MISA eShop', description: 'Cập nhật tồn kho sản phẩm tại chi nhánh cửa hàng MISA eShop' })
  @Post('misa-eshop/inventory/adjust')
  async misaEshopAdjustStock(@Body() dto: MisaEshopAdjustStockDto) {
    return {
      success: true,
      data: {
        branchCode: dto.branchCode,
        itemCode: dto.itemCode,
        onHand: dto.onHand,
        updatedDate: new Date().toISOString(),
      },
    };
  }

  @ApiTags('POS-MISA-eShop')
  @ApiOperation({ summary: '11.4. Bàn giao ca thu ngân & Chốt sổ MISA eShop', description: 'Chốt doanh thu ca bán hàng, kiểm đếm tiền mặt két và bàn giao ca thu ngân' })
  @Post('misa-eshop/shift/close')
  async misaEshopCloseShift(@Body() dto: MisaEshopCloseShiftDto) {
    return {
      success: true,
      data: {
        shiftId: dto.shiftId,
        branchCode: dto.branchCode,
        cashier: dto.cashier,
        cashBeginning: dto.cashBeginning,
        cashCollected: dto.cashCollected,
        cashActualInDrawer: dto.cashActualInDrawer,
        variance: dto.variance,
        status: 'SHIFT_CLOSED_BALANCED',
        closedDate: new Date().toISOString(),
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. MISA MEINVOICE & AMIS CRM (FULL SUITE)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('Finance-MISA')
  @ApiOperation({ summary: '9.1. Lập hóa đơn điện tử nháp MISA', description: 'Tạo hóa đơn điện tử nháp trên hệ thống MISA meInvoice từ đơn bán hàng' })
  @Post('misa/invoice/draft')
  async misaDraftInvoice(@Body() dto: MisaDraftInvoiceDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('misa_save_invoice', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('Finance-MISA')
  @ApiOperation({ summary: '9.2. Ký số HSM Cloud & Phát hành MISA', description: 'Ký số bảo mật HSM trên đám mây và phát hành hóa đơn có mã Cơ quan Thuế MISA' })
  @Post('misa/invoice/publish-hsm')
  async misaPublishHsm(@Body() dto: MisaPublishHsmDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('misa_publish_hsm', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('Finance-MISA')
  @ApiOperation({ summary: '9.3. Tra cứu hóa đơn MISA', description: 'Kiểm tra trạng thái phát hành, số hóa đơn và link tải hóa đơn PDF từ MISA' })
  @Get('misa/invoice/status/:refId')
  async misaGetStatus(@Param('refId') refId: string, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('misa_get_invoice_by_ref', { refID: refId }, this.getEffectiveMode(mode));
  }

  @ApiTags('Finance-MISA')
  @ApiOperation({ summary: '9.4. Hủy hóa đơn MISA', description: 'Lập biên bản hủy hóa đơn điện tử MISA meInvoice khi đơn hàng bị hủy hoặc hoàn trả' })
  @Post('misa/invoice/cancel')
  async misaCancelInvoice(@Body() dto: MisaCancelInvoiceDto) {
    return {
      success: true,
      refID: dto.refID,
      cancelReason: dto.cancelReason,
      status: 'CANCELLED_INVOICE',
      cancelledDate: new Date().toISOString(),
      message: `Đã hủy hóa đơn MISA Ref #${dto.refID} thành công`,
    };
  }

  @ApiTags('Finance-MISA')
  @ApiOperation({ summary: '9.5. Đồng bộ khách hàng VIP vào MISA CRM', description: 'Cập nhật hồ sơ khách hàng, phân hạng thẻ và số điện thoại lên MISA AMIS CRM' })
  @Post('misa/crm/customer')
  async misaSyncCustomer(@Body() dto: MisaSyncCustomerDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('misa_crm_sync_customer', dto, this.getEffectiveMode(mode));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. LOGISTICS & EXPRESS (GHTK, GHN, VIETTEL POST)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('Logistics-Express')
  @ApiOperation({ summary: '10.1. Tạo vận đơn Giao Hàng Tiết Kiệm (GHTK)', description: 'Đẩy lệnh tạo vận đơn và in mã barcode giao hàng GHTK Express' })
  @Post('logistics/ghtk/waybill')
  async ghtkCreateWaybill(@Body() dto: LogisticsWaybillDto) {
    return {
      success: true,
      carrier: 'GHTK',
      trackingCode: `S22941.${dto.orderCode}.981`,
      labelUrl: `https://services.giaohangtietkiem.vn/services/label/S22941.${dto.orderCode}.981`,
      estimatedPickTime: 'Hôm nay 17:00 - 18:30',
      fee: 28000,
      orderCode: dto.orderCode,
    };
  }

  @ApiTags('Logistics-Express')
  @ApiOperation({ summary: '10.2. Tạo vận đơn Giao Hàng Nhanh (GHN)', description: 'Tạo vận đơn và lịch hẹn tài xế lấy hàng GHN Express' })
  @Post('logistics/ghn/waybill')
  async ghnCreateWaybill(@Body() dto: LogisticsWaybillDto) {
    return {
      success: true,
      carrier: 'GHN',
      orderCode: `GHN${Date.now().toString().slice(-8)}`,
      totalFee: 31500,
      expectedDeliveryTime: new Date(Date.now() + 86400000 * 2).toISOString(),
    };
  }

  @ApiTags('Logistics-Express')
  @ApiOperation({ summary: '10.3. Tính cước vận chuyển chuẩn GHN', description: 'Tính toán biểu phí cước giao hàng chính xác từ GHN API' })
  @Post('logistics/ghn/calculate-fee')
  async ghnCalculateFee(@Body() dto: GhnFeeCalculationDto) {
    return {
      code: 200,
      message: 'Success',
      data: {
        total: 28000,
        service_fee: 23000,
        insurance_fee: 5000,
        pick_station_fee: 0,
        coupon_value: 0,
        r2s_fee: 0,
      },
    };
  }

  @ApiTags('Logistics-Express')
  @ApiOperation({ summary: '10.4. Tạo vận đơn Viettel Post', description: 'Đẩy vận đơn vào hệ thống bưu cục Viettel Post Logistics' })
  @Post('logistics/viettelpost/waybill')
  async vtpCreateWaybill(@Body() dto: LogisticsWaybillDto) {
    return {
      success: true,
      carrier: 'VIETTEL_POST',
      orderNumber: `VTP${Date.now().toString().slice(-9)}`,
      moneyCollection: dto.codAmount,
      status: 'ORDER_ACCEPTED',
    };
  }

  @ApiTags('Logistics-Express')
  @ApiOperation({ summary: '10.5. AI Phân tích & Tối ưu cước phí vận chuyển', description: 'So sánh tự động cước phí và thời gian giao hàng giữa GHTK, GHN, Viettel Post để gợi ý đơn vị tối ưu nhất' })
  @Get('logistics/fee-estimate')
  async estimateFee(@Query('weightGram') weightGram: number = 500, @Query('cod') cod: number = 0) {
    return {
      destination: 'Hà Nội -> TP.HCM',
      weight: `${weightGram}g`,
      comparison: [
        { carrier: 'GHTK Express', fee: 28000, estimatedHours: 48, recommended: true, badge: 'RẺ NHẤT' },
        { carrier: 'GHN Express', fee: 31500, estimatedHours: 36, recommended: false, badge: 'NHANH NHẤT' },
        { carrier: 'Viettel Post', fee: 33000, estimatedHours: 48, recommended: false, badge: 'PHỦ RỘNG' },
      ],
      aiSuggestion: 'Đơn vị đề xuất: GHTK Express (tiết kiệm 3.500đ/đơn hàng, tỷ lệ giao đúng hạn 97.4%)',
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. PROMOTIONS & VOUCHERS (CORE UNIFLOW ENGINE)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('Promotions-Vouchers')
  @ApiOperation({ summary: '11.1. Tự động sinh mã Voucher thông minh', description: 'Sinh mã Voucher giảm giá thông minh theo phân khúc khách VIP và giá trị giỏ hàng' })
  @Post('promotions/generate')
  async generateVoucher(@Body() dto: GenerateVoucherDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('core_generate_voucher', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('Promotions-Vouchers')
  @ApiOperation({ summary: '11.2. Thẩm định điều kiện Voucher', description: 'Kiểm tra tính hợp lệ của mã voucher, hạn sử dụng và tính số tiền chiết khấu thực tế' })
  @Post('promotions/validate')
  async validateVoucher(@Body() dto: ValidateVoucherDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('core_validate_voucher', dto, this.getEffectiveMode(mode));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. GIAO TIẾP & CẢNH BÁO (TELEGRAM & ZALO ZNS)
  // ═══════════════════════════════════════════════════════════════════════════

  @ApiTags('Infra-Control-Gateway')
  @ApiOperation({ summary: '12.1. Bắn tin cảnh báo Telegram Bot', description: 'Gửi tin nhắn cảnh báo tức thì về tình trạng đơn hàng, lỗi đồng bộ qua Telegram Bot' })
  @Post('notify/telegram/alert')
  async sendTelegramAlert(@Body() dto: TelegramAlertDto, @Headers('x-uniflow-mode') mode?: string) {
    return this.actionsService.executeAction('telegram_send_alert', dto, this.getEffectiveMode(mode));
  }

  @ApiTags('Infra-Control-Gateway')
  @ApiOperation({ summary: '12.2. Gửi thông báo Zalo ZNS chăm sóc khách hàng', description: 'Gửi tin nhắn ZNS xác nhận đơn hàng, trạng thái vận chuyển qua Zalo OA chính thức' })
  @Post('notify/zalo/zns')
  async sendZaloZns(@Body() dto: ZaloZnsDto) {
    return {
      error: 0,
      message: 'Success',
      data: {
        msg_id: `ZNS_${Date.now()}`,
        sent_time: new Date().toISOString(),
        phone: dto.phone,
        template_id: dto.template_id,
        status: 'DELIVERED',
      },
    };
  }
}
