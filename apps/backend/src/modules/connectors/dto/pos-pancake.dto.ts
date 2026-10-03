import { ApiProperty } from '@nestjs/swagger';

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

export class PancakeUpdateOrderDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Fanpage' })
  page_id: string;
  @ApiProperty({ example: 'ORD_PC_9921', description: 'Mã đơn hàng Pancake' })
  order_id: string;
  @ApiProperty({ example: 'Khách đổi sang size XL màu xanh', description: 'Ghi chú đơn chốt' })
  note: string;
}

export class PancakeUpdateOrderStatusDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Fanpage' })
  page_id: string;
  @ApiProperty({ example: 'ORD_PC_9921', description: 'Mã đơn hàng Pancake' })
  order_id: string;
  @ApiProperty({ example: 'confirmed', enum: ['new', 'confirmed', 'sent', 'done', 'canceled'], description: 'Trạng thái chốt đơn' })
  status: string;
}

export class PancakeCancelOrderDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Fanpage' })
  page_id: string;
  @ApiProperty({ example: 'ORD_PC_9921', description: 'Mã đơn hàng Pancake' })
  order_id: string;
  @ApiProperty({ example: 'Khách hàng nhắn tin báo hủy trên Fanpage', description: 'Lý do hủy đơn' })
  cancel_reason: string;
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

export class PancakeCreateProductDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Shop Pancake Store' })
  page_id: string;
  @ApiProperty({ example: 'Váy Hoa Nhí Vintage', description: 'Tên sản phẩm' })
  name: string;
  @ApiProperty({ example: 'VAY-HOA-L', description: 'Mã SKU' })
  sku: string;
  @ApiProperty({ example: 320000, description: 'Giá bán lẻ' })
  price: number;
  @ApiProperty({ example: 50, description: 'Tồn kho ban đầu' })
  quantity: number;
}

export class PancakeUpdateProductDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Shop' })
  page_id: string;
  @ApiProperty({ example: 'VAY-HOA-L', description: 'Mã SKU' })
  sku: string;
  @ApiProperty({ example: 340000, description: 'Giá mới' })
  price: number;
}

export class PancakeSyncInventoryDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Shop / Fanpage Pancake' })
  page_id: string;
  @ApiProperty({ example: 'VAY-HOA-L', description: 'Mã SKU sản phẩm' })
  sku: string;
  @ApiProperty({ example: 45, description: 'Tồn kho khả dụng' })
  quantity: number;
}

export class PancakeRegisterWebhookDto {
  @ApiProperty({ example: 'PAGE_1092841', description: 'ID Fanpage' })
  page_id: string;
  @ApiProperty({ example: 'https://api.uniflow.vn/api/v1/webhooks/inbound/pancake/66c0e812a1b2c3d4e5f60001', description: 'Webhook Callback URL' })
  webhook_url: string;
  @ApiProperty({ example: ['messages', 'messaging_postbacks', 'order_create', 'order_status_update'], description: 'Sự kiện đăng ký' })
  events: string[];
}

// ════════════════════════════════════════════════════════════════
// PANCAKE POS OPEN API OFFICIAL DTOS (https://docs.pancake.biz/pos/api/)
// ════════════════════════════════════════════════════════════════

export class PancakePosCreateOrderDto {
  @ApiProperty({ example: 'Nguyễn Thị Hương', description: 'Tên người nhận hàng' })
  customer_name: string;

  @ApiProperty({ example: '0981234567', description: 'Số điện thoại người nhận' })
  phone_number: string;

  @ApiProperty({ example: 'Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội', description: 'Địa chỉ giao hàng' })
  shipping_address: string;

  @ApiProperty({
    example: [
      { variation_id: 'VAR_1001', product_name: 'Váy Hoa Nhí Vintage L', quantity: 1, price: 320000 },
    ],
    description: 'Danh mục mặt hàng trong đơn',
  })
  items: any[];

  @ApiProperty({ example: 320000, description: 'Tổng tiền đơn hàng' })
  total_amount: number;

  @ApiProperty({ example: 30000, description: 'Phí vận chuyển', required: false })
  shipping_fee?: number;

  @ApiProperty({ example: 'Giao giờ hành chính', description: 'Ghi chú đơn hàng', required: false })
  note?: string;
}

export class PancakePosCreateWarehouseDto {
  @ApiProperty({ example: 'Kho Tổng Cầu Giấy', description: 'Tên kho hàng' })
  name: string;

  @ApiProperty({ example: 'KHO_CG_01', description: 'Mã định danh kho', required: false })
  code?: string;

  @ApiProperty({ example: 'Số 10 Phạm Văn Bạch, Hà Nội', description: 'Địa chỉ kho' })
  address: string;

  @ApiProperty({ example: '02439988776', description: 'Số điện thoại liên hệ kho', required: false })
  phone?: string;
}

export class PancakePosCreateCustomerDto {
  @ApiProperty({ example: 'Phạm Hoàng Linh', description: 'Họ và tên khách hàng' })
  name: string;

  @ApiProperty({ example: '0987654321', description: 'Số điện thoại' })
  phone: string;

  @ApiProperty({ example: 'linh.pham@aihub-solutions.vn', description: 'Email', required: false })
  email?: string;

  @ApiProperty({ example: 'Hà Nội', description: 'Tỉnh/Thành phố', required: false })
  province?: string;

  @ApiProperty({ example: 'VIP_GOLD', description: 'Cấp bậc khách hàng', required: false })
  level?: string;
}

export class PancakePosCreateProductDto {
  @ApiProperty({ example: 'Váy Hoa Nhí Vintage', description: 'Tên sản phẩm' })
  name: string;

  @ApiProperty({ example: 'VAY-HOA-L', description: 'Mã SKU' })
  sku: string;

  @ApiProperty({ example: 320000, description: 'Giá bán lẻ' })
  price: number;

  @ApiProperty({ example: 180000, description: 'Giá vốn', required: false })
  cost_price?: number;

  @ApiProperty({ example: 50, description: 'Số lượng tồn ban đầu', required: false })
  quantity?: number;

  @ApiProperty({ example: 'THOI_TRANG_NU', description: 'Mã danh mục', required: false })
  category_id?: string;
}

export class PancakePosUpdateVariationQuantityDto {
  @ApiProperty({ example: 'VAR_1001', description: 'Mã biến thể', required: false })
  variation_id?: string;

  @ApiProperty({ example: 'KHO_CG_01', description: 'Mã kho hàng', required: false })
  warehouse_id?: string;

  @ApiProperty({ example: 150, description: 'Số lượng tồn kho cập nhật' })
  quantity: number;
}

export class PancakePosCreateTransferDto {
  @ApiProperty({ example: 'KHO_CG_01', description: 'Kho xuất' })
  from_warehouse_id: string;

  @ApiProperty({ example: 'KHO_HCM_02', description: 'Kho nhận' })
  to_warehouse_id: string;

  @ApiProperty({
    example: [{ variation_id: 'VAR_1001', quantity: 20 }],
    description: 'Danh sách sản phẩm điều chuyển',
  })
  items: any[];

  @ApiProperty({ example: 'Điều chuyển bổ sung kho miền Nam', description: 'Ghi chú', required: false })
  note?: string;
}

export class PancakePosCreateStocktakingDto {
  @ApiProperty({ example: 'KHO_CG_01', description: 'Kho kiểm kê' })
  warehouse_id: string;

  @ApiProperty({
    example: [{ variation_id: 'VAR_1001', actual_quantity: 48, system_quantity: 50 }],
    description: 'Kết quả kiểm đếm thực tế',
  })
  items: any[];

  @ApiProperty({ example: 'Kiểm kê định kỳ tháng 10/2026', description: 'Ghi chú', required: false })
  note?: string;
}

export class PancakePosCreatePurchaseDto {
  @ApiProperty({ example: 'SUP_001', description: 'Mã nhà cung cấp' })
  supplier_id: string;

  @ApiProperty({ example: 'KHO_CG_01', description: 'Kho nhập hàng' })
  warehouse_id: string;

  @ApiProperty({
    example: [{ variation_id: 'VAR_1001', quantity: 100, cost_price: 180000 }],
    description: 'Danh sách hàng nhập',
  })
  items: any[];

  @ApiProperty({ example: 18000000, description: 'Tổng giá trị nhập' })
  total_amount: number;
}

export class PancakePosCreateExportDto {
  @ApiProperty({ example: 'KHO_CG_01', description: 'Kho xuất' })
  warehouse_id: string;

  @ApiProperty({ example: 'XUAT_HUY_HONG', description: 'Lý do xuất kho' })
  reason: string;

  @ApiProperty({
    example: [{ variation_id: 'VAR_1001', quantity: 2 }],
    description: 'Danh sách hàng xuất',
  })
  items: any[];
}

export class PancakePosCreatePromotionDto {
  @ApiProperty({ example: 'KHUYEN MAI XA KHO TET 2026', description: 'Tên chương trình' })
  name: string;

  @ApiProperty({ example: '2026-10-01T00:00:00Z', description: 'Ngày bắt đầu' })
  start_time: string;

  @ApiProperty({ example: '2026-12-31T23:59:59Z', description: 'Ngày kết thúc' })
  end_time: string;

  @ApiProperty({ example: 10, description: 'Phần trăm giảm giá' })
  discount_percent: number;
}

export class PancakePosCreateVoucherDto {
  @ApiProperty({ example: 'PANCAKE-VIP50K', description: 'Mã giảm giá' })
  code: string;

  @ApiProperty({ example: 50000, description: 'Giá trị giảm (VND)' })
  value: number;

  @ApiProperty({ example: 200000, description: 'Giá trị đơn tối thiểu' })
  min_order_value: number;

  @ApiProperty({ example: 100, description: 'Số lượt sử dụng tối đa' })
  usage_limit: number;
}

export class PancakePosCreateComboDto {
  @ApiProperty({ example: 'Combo Áo + Váy Mùa Thu', description: 'Tên combo' })
  name: string;

  @ApiProperty({ example: 'COMBO-FALL-01', description: 'Mã SKU combo' })
  sku: string;

  @ApiProperty({ example: 550000, description: 'Giá bán combo' })
  price: number;

  @ApiProperty({
    example: [
      { variation_id: 'VAR_1001', quantity: 1 },
      { variation_id: 'VAR_1002', quantity: 1 },
    ],
    description: 'Các sản phẩm thành phần',
  })
  items: any[];
}

export class PancakePosCreateTransactionDto {
  @ApiProperty({ example: 'THU', enum: ['THU', 'CHI'], description: 'Loại giao dịch' })
  type: string;

  @ApiProperty({ example: 350000, description: 'Số tiền' })
  amount: number;

  @ApiProperty({ example: 'Thu tiền bán hàng tại quầy', description: 'Mô tả' })
  description: string;

  @ApiProperty({ example: 'TIEN_MAT', enum: ['TIEN_MAT', 'CHUYEN_KHOAN'], description: 'Hình thức' })
  payment_method: string;
}

export class PancakePosAdvCostDto {
  @ApiProperty({ example: 'CAMPAIGN_FB_OCT_01', description: 'Mã chiến dịch quảng cáo' })
  campaign_id: string;

  @ApiProperty({ example: 5000000, description: 'Chi phí quảng cáo (VND)' })
  cost: number;

  @ApiProperty({ example: '2026-10-04', description: 'Ngày phát sinh chi phí' })
  date: string;
}

export class PancakePosWebhookConfigDto {
  @ApiProperty({ example: 'https://api.uniflow.vn/api/v1/webhooks/inbound/pancake', description: 'URL webhook nhận sự kiện' })
  webhook_url: string;

  @ApiProperty({ example: ['order_created', 'order_status_updated', 'inventory_changed'], description: 'Danh sách sự kiện' })
  events: string[];
}

export class PancakePosCallLaterDto {
  @ApiProperty({ example: 'ORD_PC_9921', description: 'Mã đơn hàng' })
  order_id: string;

  @ApiProperty({ example: '2026-10-05T09:00:00Z', description: 'Thời gian hẹn gọi lại' })
  call_time: string;

  @ApiProperty({ example: 'Khách hẹn gọi lại sáng mai để chốt size', description: 'Ghi chú' })
  note: string;
}

export class PancakePosUpdateProductDto {
  @ApiProperty({ example: 'Váy Hoa Nhí Vintage Cao Cấp', required: false, description: 'Tên sản phẩm' })
  name?: string;

  @ApiProperty({ example: 350000, required: false, description: 'Giá bán lẻ' })
  price?: number;

  @ApiProperty({ example: 190000, required: false, description: 'Giá vốn' })
  cost_price?: number;
}

export class PancakePosMultiVariationQuantityDto {
  @ApiProperty({
    example: [
      { variation_id: 'VAR_1001', warehouse_id: 'KHO_CG_01', quantity: 120 },
      { variation_id: 'VAR_1002', warehouse_id: 'KHO_CG_01', quantity: 85 },
    ],
    description: 'Danh sách biến thể và số lượng tồn kho cập nhật',
  })
  variations: any[];
}

export class PancakePosUpdateCompositeProductDto {
  @ApiProperty({
    example: [
      { variation_id: 'VAR_1001', quantity: 2 },
      { variation_id: 'VAR_1002', quantity: 1 },
    ],
    description: 'Danh sách sản phẩm thành phần của sản phẩm combo/composite',
  })
  items: any[];
}

export class PancakePosUpdateOrderTagDto {
  @ApiProperty({ example: 'VIP_KHACH_QUEN', description: 'Tên thẻ tag' })
  name: string;

  @ApiProperty({ example: '#FF5733', required: false, description: 'Mã màu hiển thị thẻ' })
  color?: string;
}

export class PancakePosUpdateWarehouseDto {
  @ApiProperty({ example: 'Kho Tổng Hà Nội Mở Rộng', required: false, description: 'Tên kho hàng' })
  name?: string;

  @ApiProperty({ example: 'Số 12 Duy Tân, Cầu Giấy, Hà Nội', required: false, description: 'Địa chỉ kho' })
  address?: string;

  @ApiProperty({ example: '02438889999', required: false, description: 'Số điện thoại' })
  phone?: string;
}

export class PancakePosUpdateTransferDto {
  @ApiProperty({ example: 'completed', enum: ['pending', 'delivering', 'completed', 'canceled'], description: 'Trạng thái chuyển kho' })
  status: string;

  @ApiProperty({ example: 'Đã nhận đủ hàng tại kho đích', required: false, description: 'Ghi chú' })
  note?: string;
}

export class PancakePosUpdateStocktakingDto {
  @ApiProperty({ example: 'balanced', enum: ['draft', 'counting', 'balanced'], description: 'Trạng thái kiểm kê' })
  status: string;

  @ApiProperty({ example: 'Đã hoàn tất cân bằng chênh lệch sổ sách', required: false, description: 'Ghi chú' })
  note?: string;
}

export class PancakePosUpdateExportDto {
  @ApiProperty({ example: 'completed', description: 'Trạng thái phiếu xuất kho' })
  status: string;

  @ApiProperty({ example: 'Đã xuất kho và bàn giao hàng mẫu', required: false, description: 'Ghi chú' })
  note?: string;
}

export class PancakePosUpdatePurchaseDto {
  @ApiProperty({ example: 'received', enum: ['draft', 'ordered', 'received', 'canceled'], description: 'Trạng thái đơn nhập' })
  status: string;

  @ApiProperty({ example: 'Đã nhận đủ hàng nhập từ nhà cung cấp', required: false, description: 'Ghi chú' })
  note?: string;
}

export class PancakePosUpdatePromotionDto {
  @ApiProperty({ example: 'KHUYEN MAI TET GIA HAN', required: false, description: 'Tên chương trình' })
  name?: string;

  @ApiProperty({ example: 15, required: false, description: 'Phần trăm giảm giá' })
  discount_percent?: number;

  @ApiProperty({ example: '2026-12-31T23:59:59Z', required: false, description: 'Hạn chót mới' })
  end_time?: string;
}

export class PancakePosCreateOrderReturnDto {
  @ApiProperty({ example: 'ORD_PC_9921', description: 'Mã đơn hàng gốc' })
  order_id: string;

  @ApiProperty({ example: 'Khách đổi size do mặc chật', description: 'Lý do hoàn trả' })
  reason: string;

  @ApiProperty({
    example: [{ variation_id: 'VAR_1001', quantity: 1, return_amount: 320000 }],
    description: 'Danh sách mặt hàng trả lại',
  })
  items: any[];
}

export class PancakePosActivePromotionQueryDto {
  @ApiProperty({ example: 'CUST_88291', required: false, description: 'Mã khách hàng' })
  customer_id?: string;

  @ApiProperty({ example: 500000, required: false, description: 'Tổng giá trị giỏ hàng ước tính' })
  cart_amount?: number;
}

export class PancakePosUpdateCustomerDto {
  @ApiProperty({ example: 'Phạm Hoàng Linh', required: false, description: 'Họ và tên khách hàng' })
  name?: string;

  @ApiProperty({ example: '0987654321', required: false, description: 'Số điện thoại' })
  phone?: string;

  @ApiProperty({ example: 'linh.pham@aihub-solutions.vn', required: false, description: 'Email' })
  email?: string;

  @ApiProperty({ example: 'Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội', required: false, description: 'Địa chỉ' })
  address?: string;
}

export class PancakePosCreateCustomerPromotionsDto {
  @ApiProperty({ example: ['CUST_1001', 'CUST_1002'], description: 'Danh sách ID khách hàng áp dụng ưu đãi' })
  customer_ids: string[];

  @ApiProperty({ example: 101, description: 'ID chương trình khuyến mãi' })
  promotion_id: number;
}



