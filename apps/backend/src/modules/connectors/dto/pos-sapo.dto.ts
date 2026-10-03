import { ApiProperty } from '@nestjs/swagger';

export class SapoCreateOrderDto {
  @ApiProperty({
    example: {
      order: {
        email: 'khachhang@gmail.com',
        fulfillment_status: 'unshipped',
        financial_status: 'paid',
        line_items: [{ variant_id: 1001, quantity: 2, price: 150000 }],
        shipping_address: { first_name: 'Nguyễn', last_name: 'Văn A', phone: '0912345678', address1: '123 Cầu Giấy, Hà Nội' },
      },
    },
    description: 'Đối tượng đơn hàng chuẩn Sapo Omnichannel API',
  })
  payload: any;
}

export class SapoUpdateOrderDto {
  @ApiProperty({ example: 1001, description: 'ID đơn hàng Sapo' })
  orderId: number;
  @ApiProperty({ example: 'Giao hàng giờ hành chính, gọi trước 15 phút', description: 'Ghi chú đơn hàng' })
  note: string;
  @ApiProperty({ example: ['VIP', 'KHACH_QUEN', 'DA_XAC_NHAN'], description: 'Danh sách nhãn tags' })
  tags: string[];
}

export class SapoFulfillOrderDto {
  @ApiProperty({ example: 1001, description: 'ID đơn hàng Sapo' })
  orderId: number;
  @ApiProperty({ example: 'GHTK_SP_998811', description: 'Mã vận đơn bưu tá' })
  trackingCode: string;
  @ApiProperty({ example: 'Giao Hàng Tiết Kiệm', description: 'Đơn vị vận chuyển liên kết Sapo Express' })
  carrier: string;
  @ApiProperty({ example: [1001], description: 'Danh sách ID biến thể xuất kho giao' })
  lineItemIds: number[];
}

export class SapoPaymentDto {
  @ApiProperty({ example: 1001, description: 'ID đơn hàng Sapo' })
  orderId: number;
  @ApiProperty({ example: 300000, description: 'Số tiền thanh toán' })
  amount: number;
  @ApiProperty({ example: 'cash', enum: ['cash', 'bank_transfer', 'vnpay', 'pos_card', 'points'], description: 'Phương thức thanh toán' })
  paymentMethod: string;
}

export class SapoReturnOrderDto {
  @ApiProperty({ example: 1001, description: 'ID đơn hàng Sapo bị đổi trả' })
  orderId: number;
  @ApiProperty({ example: [{ variant_id: 1001, quantity: 1, return_price: 150000 }], description: 'Danh sách sản phẩm hoàn lại' })
  returnItems: any[];
  @ApiProperty({ example: 150000, description: 'Số tiền hoàn lại cho khách' })
  refundAmount: number;
  @ApiProperty({ example: 'Khách thử không vừa size', description: 'Lý do đổi trả' })
  reason: string;
}

export class SapoAdjustStockDto {
  @ApiProperty({ example: 1001, description: 'ID biến thể hàng (variant_id)' })
  variantId: number;
  @ApiProperty({ example: 101, description: 'ID kho hàng / chi nhánh' })
  locationId: number;
  @ApiProperty({ example: 50, description: 'Số lượng tồn kho khả dụng mới' })
  available: number;
}

export class SapoTransferStockDto {
  @ApiProperty({ example: 101, description: 'ID kho xuất chuyển' })
  fromLocationId: number;
  @ApiProperty({ example: 102, description: 'ID kho đích tiếp nhận' })
  toLocationId: number;
  @ApiProperty({ example: [{ variant_id: 1001, quantity: 20 }], description: 'Danh sách biến thể điều chuyển' })
  lineItems: any[];
  @ApiProperty({ example: 'Điều chuyển hàng chi viện giữa 2 chi nhánh', description: 'Ghi chú chuyển kho' })
  note: string;
}

export class SapoCreateProductDto {
  @ApiProperty({ example: 'Áo Sơ Mi Nam Oxford Trắng', description: 'Tên sản phẩm' })
  name: string;
  @ApiProperty({ example: 'SM-OXFORD-01', description: 'Mã SKU sản phẩm' })
  sku: string;
  @ApiProperty({ example: 350000, description: 'Giá bán lẻ niêm yết' })
  price: number;
  @ApiProperty({ example: 180000, description: 'Giá vốn nhập hàng' })
  costPrice: number;
  @ApiProperty({ example: 100, description: 'Tồn kho ban đầu' })
  initStock: number;
}

export class SapoUpdateProductDto {
  @ApiProperty({ example: 1001, description: 'ID sản phẩm Sapo' })
  id: number;
  @ApiProperty({ example: 'Áo Sơ Mi Nam Oxford Trắng (Phiên bản 2026)', description: 'Tên sản phẩm mới', required: false })
  name?: string;
  @ApiProperty({ example: 360000, description: 'Giá bán lẻ mới', required: false })
  price?: number;
  @ApiProperty({ example: 190000, description: 'Giá vốn mới', required: false })
  costPrice?: number;
}

export class SapoCreateCustomerDto {
  @ApiProperty({ example: 'Trần Văn Mạnh', description: 'Họ và tên khách hàng' })
  fullName: string;
  @ApiProperty({ example: '0912345678', description: 'Số điện thoại liên hệ' })
  phoneNumber: string;
  @ApiProperty({ example: 'manh.tran@example.com', description: 'Email khách hàng', required: false })
  email?: string;
  @ApiProperty({ example: 'Số 10 Phạm Văn Đồng, Cầu Giấy, Hà Nội', description: 'Địa chỉ' })
  address: string;
}

export class SapoUpdateCustomerDto {
  @ApiProperty({ example: 1001, description: 'ID khách hàng Sapo' })
  id: number;
  @ApiProperty({ example: 'Trần Văn Mạnh (VIP)', description: 'Họ và tên', required: false })
  fullName?: string;
  @ApiProperty({ example: 'manh.vip@example.com', description: 'Email', required: false })
  email?: string;
  @ApiProperty({ example: 'Số 15 Phạm Văn Đồng, Cầu Giấy, Hà Nội', description: 'Địa chỉ', required: false })
  address?: string;
}

export class SapoAdjustLoyaltyPointsDto {
  @ApiProperty({ example: 1001, description: 'ID khách hàng Sapo' })
  customerId: number;
  @ApiProperty({ example: 100, description: 'Số điểm thay đổi (+100 là tích điểm, -100 là tiêu điểm)' })
  points: number;
  @ApiProperty({ example: 'Tích điểm đơn hàng Sapo #1001', description: 'Lý do tích / tiêu điểm' })
  reason: string;
}

export class SapoCreateDiscountDto {
  @ApiProperty({ example: 'SAPO_TET2026', description: 'Mã coupon giảm giá' })
  code: string;
  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed_amount'], description: 'Loại giảm giá' })
  discountType: string;
  @ApiProperty({ example: 15, description: 'Giá trị giảm' })
  value: number;
  @ApiProperty({ example: 250000, description: 'Giá trị đơn tối thiểu để áp dụng' })
  minOrderValue: number;
}

export class SapoCancelOrderDto {
  @ApiProperty({ example: 1001, description: 'ID đơn hàng Sapo cần hủy' })
  orderId: number;
  @ApiProperty({ example: 'Khách hàng đổi ý muốn mua sản phẩm khác', description: 'Lý do hủy đơn' })
  reason: string;
  @ApiProperty({ example: true, description: 'Có tự động hoàn trả số lượng vào tồn kho không (restock)' })
  restock: boolean;
}

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

export class SapoWebhookSubscribeDto {
  @ApiProperty({ example: 'https://gateway.uniflow.vn/api/v1/webhooks/sapo', description: 'URL callback Uniflow nhận webhook từ Sapo' })
  address: string;
  @ApiProperty({ example: 'orders/create', enum: ['orders/create', 'orders/updated', 'orders/cancelled', 'products/update', 'inventory_levels/update'], description: 'Chủ đề sự kiện Sapo (topic)' })
  topic: string;
  @ApiProperty({ example: 'json', description: 'Định dạng dữ liệu gửi (json)' })
  format?: string;
}

export class SapoCreateArticleDto {
  @ApiProperty({ example: 101, description: 'ID chuyên mục Blog', required: false })
  blog_id?: number;
  @ApiProperty({ example: 'Xu Hướng Thời Trang Công Sở Thu Đông 2026', description: 'Tiêu đề bài viết' })
  title: string;
  @ApiProperty({ example: '<p>Cùng UniFlow khám phá những set đồ công sở thanh lịch nhất mùa thu đông...</p>', description: 'Nội dung bài viết HTML' })
  body_html: string;
  @ApiProperty({ example: 'Ban Biên Tập UniFlow', description: 'Tác giả bài viết' })
  author: string;
  @ApiProperty({ example: ['thoitrang', 'xuhuong2026', 'congso'], description: 'Danh sách tags' })
  tags: string[];
  @ApiProperty({ example: 'https://cdn.mysapo.net/articles/banner-winter.jpg', description: 'Ảnh đại diện bài viết' })
  image?: string;
  @ApiProperty({ example: true, description: 'Xuất bản ngay' })
  published?: boolean;
}

export class SapoUpdateArticleDto {
  @ApiProperty({ example: 'Xu Hướng Thời Trang Công Sở Thu Đông 2026 (Cập nhật mới)', description: 'Tiêu đề bài viết', required: false })
  title?: string;
  @ApiProperty({ example: '<p>Nội dung bài viết cập nhật...</p>', description: 'Nội dung HTML', required: false })
  body_html?: string;
}

export class SapoCreateBlogDto {
  @ApiProperty({ example: 'Tin Tức & Cẩm Nang Thời Trang', description: 'Tên danh mục blog' })
  title: string;
  @ApiProperty({ example: 'tin-tuc-cam-nang', description: 'Đường dẫn tĩnh handle', required: false })
  handle?: string;
}

export class SapoCreatePageDto {
  @ApiProperty({ example: 'Chính Sách Đổi Trả & Bảo Hành Toàn Quốc', description: 'Tiêu đề trang nội dung' })
  title: string;
  @ApiProperty({ example: '<p>UniFlow hỗ trợ đổi hàng trong vòng 30 ngày trên toàn bộ hệ thống showroom...</p>', description: 'Nội dung trang HTML' })
  body_html: string;
  @ApiProperty({ example: true, description: 'Trạng thái hiển thị' })
  published?: boolean;
}

export class SapoCreateCollectionDto {
  @ApiProperty({ example: 'Bộ Sưu Tập Áo Sơ Mi Nam Cao Cấp', description: 'Tên nhóm sản phẩm' })
  title: string;
  @ApiProperty({ example: 'Danh mục tuyển chọn các mẫu sơ mi may đo cao cấp', description: 'Mô tả bộ sưu tập', required: false })
  body_html?: string;
  @ApiProperty({ example: [{ variant_id: 1001 }], description: 'Danh sách sản phẩm đưa vào nhóm', required: false })
  collects?: any[];
  @ApiProperty({ example: [{ column: 'title', relation: 'starts_with', condition: 'Sơ mi' }], description: 'Quy tắc nhóm sản phẩm thông minh (Smart Collection)', required: false })
  rules?: any[];
}

export class SapoCreateMetafieldDto {
  @ApiProperty({ example: 'custom_seo', description: 'Namespace định danh dữ liệu tùy chỉnh' })
  namespace: string;
  @ApiProperty({ example: 'meta_title', description: 'Khóa key' })
  key: string;
  @ApiProperty({ example: 'Thời trang nam cao cấp UniFlow - Chính hãng', description: 'Giá trị trường mở rộng' })
  value: string;
  @ApiProperty({ example: 'string', description: 'Kiểu dữ liệu (string, integer, json)' })
  value_type: string;
}

export class SapoUpdateAssetDto {
  @ApiProperty({ example: 'assets/custom.css', description: 'Đường dẫn file asset trong theme' })
  key: string;
  @ApiProperty({ example: 'body { background: #f4f6f8; }', description: 'Nội dung file' })
  value: string;
}

export class SapoCreateRedirectDto {
  @ApiProperty({ example: '/san-pham-cu', description: 'Đường dẫn URL cũ' })
  path: string;
  @ApiProperty({ example: '/san-pham-moi', description: 'Đường dẫn chuyển hướng đích' })
  target: string;
}

export class SapoCreateScriptTagDto {
  @ApiProperty({ example: 'onload', description: 'Sự kiện kích hoạt script' })
  event: string;
  @ApiProperty({ example: 'https://cdn.uniflow.vn/scripts/analytics.js', description: 'URL file script bên ngoài' })
  src: string;
}

export class SapoCreateVariantDto {
  @ApiProperty({ example: 'Size L / Màu Đen', description: 'Tên quy cách phiên bản' })
  title: string;
  @ApiProperty({ example: 350000, description: 'Giá bán của biến thể' })
  price: number;
  @ApiProperty({ example: 'SM-OXFORD-01-L-BLK', description: 'Mã SKU biến thể' })
  sku: string;
  @ApiProperty({ example: 50, description: 'Số lượng tồn kho ban đầu' })
  inventory_quantity: number;
}

export class SapoCreateCustomerAddressDto {
  @ApiProperty({ example: 'Nguyễn', description: 'Họ' })
  first_name: string;
  @ApiProperty({ example: 'Văn A', description: 'Tên' })
  last_name: string;
  @ApiProperty({ example: '0912345678', description: 'Số điện thoại nhận hàng' })
  phone: string;
  @ApiProperty({ example: '123 Đường Cầu Giấy', description: 'Địa chỉ chi tiết' })
  address1: string;
  @ApiProperty({ example: 'Hà Nội', description: 'Tỉnh / Thành phố' })
  city: string;
  @ApiProperty({ example: true, required: false, description: 'Đặt làm địa chỉ mặc định' })
  is_default?: boolean;
}

export class SapoCreateCommentDto {
  @ApiProperty({ example: 101, required: false, description: 'ID bài viết blog liên quan' })
  article_id?: number;
  @ApiProperty({ example: 'Trần Văn Bình', description: 'Họ tên người bình luận' })
  author: string;
  @ApiProperty({ example: 'binh.tv@gmail.com', description: 'Email người bình luận' })
  email: string;
  @ApiProperty({ example: 'Bài viết rất hữu ích cho doanh nghiệp bán lẻ!', description: 'Nội dung bình luận' })
  body: string;
}



