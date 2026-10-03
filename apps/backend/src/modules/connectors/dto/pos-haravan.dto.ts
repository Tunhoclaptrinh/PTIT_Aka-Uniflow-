import { ApiProperty } from '@nestjs/swagger';

// ═══════════════════════════════════════════════════════════════
// HARAVAN ORDERS, DRAFT ORDERS, FULFILLMENT, TRANSACTION & REFUND
// ═══════════════════════════════════════════════════════════════

export class HaravanCreateOrderDto {
  @ApiProperty({
    example: {
      order: {
        email: 'hoang.minh@example.com',
        fulfillment_status: 'unfulfilled',
        financial_status: 'paid',
        shipping_address: {
          first_name: 'Hoàng',
          last_name: 'Minh',
          phone: '0933221100',
          address1: '789 Điện Biên Phủ, Phường 25',
          district: 'Quận Bình Thạnh',
          city: 'Hồ Chí Minh',
          country: 'Vietnam',
          country_code: 'VN',
        },
        billing_address: {
          first_name: 'Hoàng',
          last_name: 'Minh',
          phone: '0933221100',
          address1: '789 Điện Biên Phủ, Phường 25',
          district: 'Quận Bình Thạnh',
          city: 'Hồ Chí Minh',
          country: 'Vietnam',
          country_code: 'VN',
        },
        line_items: [
          { variant_id: 881294, quantity: 2, price: 290000, title: 'Áo Polo Thể Thao Nam Breathable Tech - Đen / M', sku: 'POLO-BLK-M' },
        ],
        note: 'Đóng gói cẩn thận giúp shop nhé',
        tags: 'VIP, WEB_ORDER',
        total_price: 580000,
      },
    },
    description: 'Đối tượng đơn hàng chuẩn Haravan Omnichannel API (com/orders.json)',
  })
  payload: any;
}

export class HaravanUpdateOrderDto {
  @ApiProperty({ example: 1001, description: 'ID đơn hàng Haravan' })
  orderId?: number;
  @ApiProperty({ example: 'Giao hàng sau 18h tại nhà riêng', description: 'Ghi chú đơn hàng mới', required: false })
  note?: string;
  @ApiProperty({ example: ['VIP', 'KHACH_DA_THANH_TOAN', 'UUTIEN_GIAO'], description: 'Danh sách nhãn tags' })
  tags?: string[];
  @ApiProperty({
    example: { phone: '0933221199', address1: '800 Điện Biên Phủ, Bình Thạnh' },
    description: 'Cập nhật địa chỉ giao hàng',
    required: false,
  })
  shipping_address?: any;
}

export class HaravanCancelOrderDto {
  @ApiProperty({ example: 1001, description: 'ID đơn hàng Haravan cần hủy' })
  order_id?: number;
  @ApiProperty({ example: 'customer', enum: ['customer', 'fraud', 'inventory', 'declined', 'other'], description: 'Lý do hủy đơn' })
  reason: string;
  @ApiProperty({ example: true, description: 'Có hoàn lại số lượng tồn kho tự động không' })
  restock: boolean;
  @ApiProperty({ example: 'Khách hàng đổi ý muốn đổi sang sản phẩm khác', description: 'Ghi chú chi tiết lý do', required: false })
  email?: boolean;
}

export class HaravanOrderTagsDto {
  @ApiProperty({ example: 'VIP, DA_GOI_XAC_NHAN, FREESHIP', description: 'Chuỗi nhãn thẻ tag cách nhau bởi dấu phẩy' })
  tags: string;
}

export class HaravanAssignOrderDto {
  @ApiProperty({ example: 200891, description: 'ID nhân viên chịu trách nhiệm xử lý đơn' })
  user_id: number;
}

export class HaravanCreateDraftOrderDto {
  @ApiProperty({
    example: {
      draft_order: {
        note: 'Đơn báo giá đặt may đồng phục cho công ty FPT',
        line_items: [
          { variant_id: 881294, quantity: 50, price: 250000, title: 'Áo Polo Doanh Nghiệp FPT' },
        ],
        applied_discount: {
          title: 'Chiết khấu đơn sỉ số lượng lớn',
          value: '10.0',
          value_type: 'percentage',
          amount: 1250000,
        },
        shipping_address: {
          first_name: 'Nguyễn',
          last_name: 'Văn A',
          address1: 'Tòa nhà FPT Tower, Cầu Giấy, Hà Nội',
          phone: '0988112233',
        },
      },
    },
    description: 'Tạo đơn đặt trước / Đơn nháp (Draft Order)',
  })
  draft_order: any;
}

export class HaravanFulfillOrderDto {
  @ApiProperty({ example: 1001, description: 'ID đơn hàng Haravan cần tạo giao hàng' })
  order_id?: number;
  @ApiProperty({ example: 'GHN_HRV_99812', description: 'Mã vận đơn của hãng vận chuyển' })
  tracking_number: string;
  @ApiProperty({ example: 'https://tracking.ghn.vn/?order_code=GHN_HRV_99812', description: 'URL tra cứu vận đơn', required: false })
  tracking_url?: string;
  @ApiProperty({ example: 'Giao Hàng Nhanh', description: 'Hãng vận chuyển Haravan Ship' })
  carrier_service_code: string;
  @ApiProperty({ example: [881294], description: 'Danh sách ID dòng sản phẩm xuất kho giao' })
  line_item_ids: number[];
  @ApiProperty({ example: true, description: 'Gửi email thông báo cho khách hàng' })
  notify_customer?: boolean;
}

export class HaravanTransactionDto {
  @ApiProperty({ example: 'capture', enum: ['authorization', 'capture', 'sale', 'void', 'refund'], description: 'Loại giao dịch thanh toán' })
  kind: string;
  @ApiProperty({ example: 580000, description: 'Số tiền thanh toán' })
  amount: number;
  @ApiProperty({ example: 'VNPay QR', description: 'Cổng thanh toán / Gateway' })
  gateway: string;
  @ApiProperty({ example: 'success', enum: ['pending', 'failure', 'success', 'error'], description: 'Trạng thái giao dịch' })
  status: string;
}

export class HaravanRefundDto {
  @ApiProperty({ example: 290000, description: 'Số tiền hoàn trả' })
  amount: number;
  @ApiProperty({ example: 'Khách trả lại 1 áo do không vừa size', description: 'Lý do hoàn trả' })
  note: string;
  @ApiProperty({
    example: [{ line_item_id: 10293, quantity: 1, restock_type: 'return', location_id: 1024 }],
    description: 'Danh sách mặt hàng hoàn kho',
  })
  refund_line_items: any[];
}

// ═══════════════════════════════════════════════════════════════
// HARAVAN PRODUCTS, VARIANTS, IMAGES & COLLECTIONS
// ═══════════════════════════════════════════════════════════════

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
      { option1: 'Đen / M', price: 290000, compare_at_price: 350000, sku: 'POLO-BLK-M', barcode: '8936001111', inventory_quantity: 40 },
      { option1: 'Đen / L', price: 290000, compare_at_price: 350000, sku: 'POLO-BLK-L', barcode: '8936001112', inventory_quantity: 60 },
    ],
    description: 'Danh sách biến thể và mã SKU, Barcode, Tồn kho',
  })
  variants: any[];
  @ApiProperty({
    example: [{ src: 'https://file.hstatic.net/products/polo-black-front.jpg', position: 1 }],
    description: 'Danh sách ảnh sản phẩm',
    required: false,
  })
  images?: any[];
}

export class HaravanUpdateProductDto {
  @ApiProperty({ example: 881290, description: 'ID sản phẩm Haravan' })
  id?: number;
  @ApiProperty({ example: 'Áo Polo Thể Thao Nam Breathable Tech (Bản Nâng Cấp 2026)', description: 'Tên sản phẩm mới', required: false })
  title?: string;
  @ApiProperty({ example: 310000, description: 'Giá bán mới', required: false })
  price?: number;
}

export class HaravanVariantDto {
  @ApiProperty({ example: 'Trắng / XL', description: 'Tên thuộc tính biến thể' })
  option1: string;
  @ApiProperty({ example: 290000, description: 'Giá bán' })
  price: number;
  @ApiProperty({ example: 350000, description: 'Giá so sánh / Giá gốc gạch đi', required: false })
  compare_at_price?: number;
  @ApiProperty({ example: 'POLO-WHT-XL', description: 'Mã SKU quản lý kho' })
  sku: string;
  @ApiProperty({ example: '8936001113', description: 'Mã vạch Barcode' })
  barcode: string;
  @ApiProperty({ example: 50, description: 'Số lượng tồn kho ban đầu' })
  inventory_quantity: number;
}

export class HaravanProductImageDto {
  @ApiProperty({ example: 'https://file.hstatic.net/products/polo-white-front.jpg', description: 'Đường dẫn ảnh trực tuyến' })
  src: string;
  @ApiProperty({ example: 1, description: 'Thứ tự ưu tiên hiển thị ảnh' })
  position?: number;
  @ApiProperty({ example: 'Mặt trước áo Polo trắng', description: 'Thẻ Alt SEO ảnh' })
  alt?: string;
}

export class HaravanCreateCollectionDto {
  @ApiProperty({ example: 'Bộ Sưu Tập Giày Sneaker Năng Động', description: 'Tên nhóm sản phẩm thủ công' })
  title: string;
  @ApiProperty({ example: 'Danh mục các mẫu giày thể thao cao cấp', description: 'Mô tả bộ sưu tập' })
  body_html?: string;
  @ApiProperty({ example: 'https://file.hstatic.net/collections/sneaker-banner.jpg', description: 'Ảnh đại diện nhóm', required: false })
  image?: string;
}

export class HaravanSmartCollectionDto {
  @ApiProperty({ example: 'Sản Phẩm Khuyến Mãi Hot Nhất', description: 'Tên nhóm sản phẩm thông minh' })
  title: string;
  @ApiProperty({ example: 'Nhóm tự động gom các sản phẩm có tag SALE_OFF', description: 'Mô tả nhóm' })
  body_html?: string;
  @ApiProperty({
    example: [{ column: 'tag', relation: 'equals', condition: 'SALE_OFF' }],
    description: 'Quy tắc tự động lọc sản phẩm',
  })
  rules: any[];
}

export class HaravanCollectDto {
  @ApiProperty({ example: 100021, description: 'ID nhóm bộ sưu tập (Collection ID)' })
  collection_id: number;
  @ApiProperty({ example: 881290, description: 'ID sản phẩm cần đưa vào nhóm' })
  product_id: number;
}

// ═══════════════════════════════════════════════════════════════
// HARAVAN INVENTORY & LOCATIONS
// ═══════════════════════════════════════════════════════════════

export class HaravanAdjustStockDto {
  @ApiProperty({ example: 1024, description: 'ID kho hàng Haravan' })
  location_id: number;
  @ApiProperty({ example: 881294, description: 'ID biến thể hàng (variant_id)' })
  variant_id: number;
  @ApiProperty({ example: 30, description: 'Số lượng thay đổi (+/-)' })
  adjustment?: number;
  @ApiProperty({ example: 50, description: 'Tồn kho cố định mới', required: false })
  inventory_quantity?: number;
}

export class HaravanSetInventoryLevelDto {
  @ApiProperty({ example: 1024, description: 'ID kho hàng Haravan' })
  location_id: number;
  @ApiProperty({ example: 881294, description: 'ID biến thể hàng (variant_id)' })
  variant_id: number;
  @ApiProperty({ example: 120, description: 'Số lượng tồn kho cố định' })
  available: number;
}

export class HaravanTransferStockDto {
  @ApiProperty({ example: 1024, description: 'ID kho xuất' })
  from_location_id: number;
  @ApiProperty({ example: 1025, description: 'ID kho nhập' })
  to_location_id: number;
  @ApiProperty({ example: [{ variant_id: 881294, quantity: 20 }], description: 'Danh sách sản phẩm điều chuyển' })
  line_items: any[];
}

// ═══════════════════════════════════════════════════════════════
// HARAVAN CUSTOMERS & ADDRESSES
// ═══════════════════════════════════════════════════════════════

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

export class HaravanUpdateCustomerDto {
  @ApiProperty({ example: 99120, description: 'ID khách hàng Haravan' })
  id?: number;
  @ApiProperty({ example: '0918889998', description: 'Số điện thoại mới', required: false })
  phone?: string;
  @ApiProperty({ example: ['VIP_DIAMOND'], description: 'Tags mới', required: false })
  tags?: string[];
}

export class HaravanCustomerAddressDto {
  @ApiProperty({ example: 'Tòa nhà Landmark 81, Phường 22', description: 'Địa chỉ chi tiết' })
  address1: string;
  @ApiProperty({ example: 'Quận Bình Thạnh', description: 'Quận/huyện' })
  district: string;
  @ApiProperty({ example: 'Hồ Chí Minh', description: 'Tỉnh/thành' })
  province: string;
  @ApiProperty({ example: 'Vietnam', description: 'Quốc gia' })
  country: string;
  @ApiProperty({ example: '0918889999', description: 'SĐT người nhận tại địa chỉ' })
  phone: string;
  @ApiProperty({ example: true, description: 'Đặt làm địa chỉ mặc định' })
  default?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// HARAVAN DISCOUNTS & PROMOTIONS
// ═══════════════════════════════════════════════════════════════

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

export class HaravanPriceRuleDto {
  @ApiProperty({ example: 'Khuyến mãi Khai Xuân 2026', description: 'Tên quy tắc giá' })
  title: string;
  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed_amount'], description: 'Loại giảm giá' })
  value_type: string;
  @ApiProperty({ example: -15, description: 'Giá trị giảm giá (số âm)' })
  value: number;
  @ApiProperty({ example: 'line_item', description: 'Phạm vi áp dụng' })
  target_type: string;
  @ApiProperty({ example: 'all', description: 'Lựa chọn áp dụng' })
  target_selection: string;
  @ApiProperty({ example: 'across', description: 'Cách phân bổ chiết khấu' })
  allocation_method: string;
  @ApiProperty({ example: '2026-01-01T00:00:00Z', description: 'Thời gian bắt đầu' })
  starts_at: string;
  @ApiProperty({ example: '2026-02-28T23:59:59Z', description: 'Thời gian kết thúc' })
  ends_at: string;
}

export class HaravanDiscountCodeDto {
  @ApiProperty({ example: 'XUAN2026_VIP', description: 'Mã coupon giảm giá' })
  code: string;
  @ApiProperty({ example: 100, description: 'Số lượt sử dụng tối đa', required: false })
  usage_limit?: number;
}

// ═══════════════════════════════════════════════════════════════
// HARAVAN SHIPPING & CARRIER SERVICES
// ═══════════════════════════════════════════════════════════════

export class HaravanCarrierServiceDto {
  @ApiProperty({ example: 'UniFlow Logistics Hub', description: 'Tên dịch vụ vận chuyển tích hợp' })
  name: string;
  @ApiProperty({ example: 'https://api.uniflow.vn/api/v1/infra/haravan/shipping-rates', description: 'Callback URL tính cước thời gian thực' })
  callback_url: string;
  @ApiProperty({ example: true, description: 'Cho phép Haravan tự động phát hiện gói cước' })
  service_discovery: boolean;
  @ApiProperty({ example: 'json', description: 'Định dạng dữ liệu' })
  format: string;
}

// ═══════════════════════════════════════════════════════════════
// HARAVAN ONLINE STORE (CMS: ARTICLE, BLOG, COMMENT, PAGE, THEME)
// ═══════════════════════════════════════════════════════════════

export class HaravanCreateArticleDto {
  @ApiProperty({ example: 202, description: 'ID chuyên mục Blog Haravan', required: false })
  blog_id?: number;
  @ApiProperty({ example: 'Xu Hướng Thời Trang Streetwear 2026 Chuẩn Phong Cách', description: 'Tiêu đề bài viết' })
  title: string;
  @ApiProperty({ example: '<p>Phong cách Streetwear ngày càng khẳng định vị thế với các bạn trẻ...</p>', description: 'Nội dung bài viết HTML' })
  body_html: string;
  @ApiProperty({ example: 'Stylist UniFlow', description: 'Tác giả' })
  author: string;
  @ApiProperty({ example: 'https://file.hstatic.net/articles/streetwear-banner.jpg', description: 'Ảnh bài viết', required: false })
  image?: string;
  @ApiProperty({ example: true, description: 'Xuất bản công khai' })
  published?: boolean;
}

export class HaravanCreateBlogDto {
  @ApiProperty({ example: 'Kinh Nghiệm Phối Đồ & Thời Trang', description: 'Tên chuyên mục Blog' })
  title: string;
  @ApiProperty({ example: 'kinh-nghiem-phoi-do', description: 'Đường dẫn tĩnh handle', required: false })
  handle?: string;
}

export class HaravanCreatePageDto {
  @ApiProperty({ example: 'Về Chúng Tôi - UniFlow Brand Story', description: 'Tiêu đề trang tĩnh' })
  title: string;
  @ApiProperty({ example: '<p>UniFlow là nền tảng quản trị chuỗi bán lẻ đa kênh hàng đầu...</p>', description: 'Nội dung trang tĩnh HTML' })
  body_html: string;
}

export class HaravanCommentDto {
  @ApiProperty({ example: 'Bài viết rất hữu ích, cảm ơn shop!', description: 'Nội dung bình luận' })
  body: string;
  @ApiProperty({ example: 'Nguyễn Văn Quân', description: 'Tên người gửi' })
  author: string;
  @ApiProperty({ example: 'quan.nguyen@example.com', description: 'Email người bình luận' })
  email: string;
}

export class HaravanAssetDto {
  @ApiProperty({ example: 'snippets/uniflow-widget.liquid', description: 'Tên file asset trong theme Liquid' })
  key: string;
  @ApiProperty({ example: '<div class="uniflow-chat-box">Hỗ trợ trực tuyến</div>', description: 'Nội dung file' })
  value: string;
}

export class HaravanMetafieldDto {
  @ApiProperty({ example: 'c_custom', description: 'Namespace của trường tùy biến' })
  namespace: string;
  @ApiProperty({ example: 'warranty_months', description: 'Tên key' })
  key: string;
  @ApiProperty({ example: '12', description: 'Giá trị' })
  value: string;
  @ApiProperty({ example: 'integer', enum: ['string', 'integer', 'json_string'], description: 'Kiểu dữ liệu' })
  value_type: string;
  @ApiProperty({ example: 'product', description: 'Đối tượng gắn metafield (product, order, customer)' })
  owner_resource: string;
  @ApiProperty({ example: 881290, description: 'ID đối tượng' })
  owner_id: number;
}

export class HaravanRedirectDto {
  @ApiProperty({ example: '/san-pham-cu', description: 'URL đường dẫn cũ' })
  path: string;
  @ApiProperty({ example: '/collections/san-pham-moi-2026', description: 'URL đích chuyển hướng đến' })
  target: string;
}

export class HaravanScriptTagDto {
  @ApiProperty({ example: 'onload', description: 'Sự kiện kích hoạt nạp script' })
  event: string;
  @ApiProperty({ example: 'https://cdn.uniflow.vn/sdk/tracker.js', description: 'Đường dẫn file Javascript bên thứ ba' })
  src: string;
  @ApiProperty({ example: 'all', enum: ['all', 'online_store', 'order_status'], description: 'Phạm vi hiển thị' })
  display_scope: string;
}

// ═══════════════════════════════════════════════════════════════
// HARAVAN WEBHOOKS & EVENTS
// ═══════════════════════════════════════════════════════════════

export class HaravanRegisterWebhookDto {
  @ApiProperty({ example: 'orders/create', enum: ['orders/create', 'orders/updated', 'orders/cancelled', 'inventory_levels/update', 'products/update'], description: 'Chủ đề sự kiện' })
  topic: string;
  @ApiProperty({ example: 'https://api.uniflow.vn/api/v1/webhooks/inbound/haravan/66c0e812a1b2c3d4e5f60001', description: 'URL nhận webhook từ Haravan' })
  address: string;
  @ApiProperty({ example: 'json', description: 'Định dạng dữ liệu' })
  format: string;
}

export class HaravanWebhookSubscribeDto {
  @ApiProperty({ example: 'orders/create', description: 'Chủ đề sự kiện lắng nghe' })
  topic: string;
  @ApiProperty({ example: 'https://api.uniflow.vn/api/webhooks/haravan', description: 'URL Webhook nhận Callback từ Haravan' })
  address: string;
  @ApiProperty({ example: 'json', description: 'Định dạng dữ liệu trả về', default: 'json', required: false })
  format?: string;
}
