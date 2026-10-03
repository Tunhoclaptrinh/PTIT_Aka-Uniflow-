import { ApiProperty } from '@nestjs/swagger';

export * from './misa-meinvoice.dto';
export * from './logistics-expanded.dto';

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

// ═══════════════════════════════════════════════════════════════
// GIAO HÀNG TIẾT KIỆM (GHTK) DTOs
// ═══════════════════════════════════════════════════════════════

export class GhtkCalculateFeeDto {
  @ApiProperty({ example: 'Hà Nội', description: 'Tỉnh/thành nơi lấy hàng' })
  pick_province: string;
  @ApiProperty({ example: 'Quận Cầu Giấy', description: 'Quận/huyện nơi lấy hàng' })
  pick_district: string;
  @ApiProperty({ example: 'TP. Hồ Chí Minh', description: 'Tỉnh/thành người nhận' })
  province: string;
  @ApiProperty({ example: 'Quận 1', description: 'Quận/huyện người nhận' })
  district: string;
  @ApiProperty({ example: 500, description: 'Khối lượng gói hàng (gram)' })
  weight: number;
  @ApiProperty({ example: 350000, description: 'Giá trị hàng hóa để tính bảo hiểm (VNĐ)' })
  value: number;
  @ApiProperty({ example: 'road', enum: ['road', 'fly'], description: 'Phương thức vận chuyển đường bộ hoặc bay' })
  transport: string;
}

export class GhtkCreateOrderDto {
  @ApiProperty({
    example: {
      id: 'GHTK_ORD_20261003',
      pick_name: 'Kho Tổng UniFlow Cầu Giấy',
      pick_address: 'Số 18 Duy Tân, Dịch Vọng Hậu',
      pick_province: 'Hà Nội',
      pick_district: 'Quận Cầu Giấy',
      pick_tel: '0988999888',
      name: 'Nguyễn Thu Trang',
      address: 'Căn hộ 1205 Landmark 81, 720A Điện Biên Phủ',
      province: 'TP. Hồ Chí Minh',
      district: 'Quận Bình Thạnh',
      tel: '0912334455',
      email: 'trang.nguyen@example.com',
      is_freeship: '1',
      pick_money: 350000,
      note: 'Giao hàng giờ hành chính, gọi điện trước khi đến',
      value: 350000,
    },
    description: 'Thông tin bưu gửi GHTK chuẩn Open API',
  })
  order: any;

  @ApiProperty({
    example: [
      { name: 'Áo Thun Cotton Compact 100%', weight: 0.25, quantity: 2, product_code: 'TSHIRT-WHT-L' },
    ],
    description: 'Danh sách sản phẩm trong kiện hàng',
  })
  products: any[];
}

export class GhtkCancelOrderDto {
  @ApiProperty({ example: 'S229102.MB1.01.99281', description: 'Mã vận đơn GHTK cần hủy' })
  trackingCode: string;
  @ApiProperty({ example: 'Khách hàng hủy đơn trước khi bưu tá đến lấy', description: 'Lý do hủy đơn' })
  reason: string;
}

export class GhtkReconciliationDto {
  @ApiProperty({ example: '2026-09-01', description: 'Từ ngày đối soát COD' })
  from_date: string;
  @ApiProperty({ example: '2026-09-30', description: 'Đến ngày đối soát COD' })
  to_date: string;
  @ApiProperty({ example: 'PAID', enum: ['ALL', 'PAID', 'PENDING'], description: 'Trạng thái thanh toán COD' })
  status: string;
}

// ═══════════════════════════════════════════════════════════════
// GIAO HÀNG NHANH (GHN EXPRESS) DTOs
// ═══════════════════════════════════════════════════════════════

export class GhnFeeCalculationDto {
  @ApiProperty({ example: 1442, description: 'ID quận/huyện gửi hàng (Hà Đông = 1442)' })
  from_district_id: number;
  @ApiProperty({ example: '010101', description: 'Mã phường/xã gửi hàng', required: false })
  from_ward_code?: string;
  @ApiProperty({ example: 1454, description: 'ID quận/huyện nhận hàng (Quận 1 TP.HCM = 1454)' })
  to_district_id: number;
  @ApiProperty({ example: '20101', description: 'Mã phường/xã nhận hàng' })
  to_ward_code: string;
  @ApiProperty({ example: 53320, description: 'ID gói dịch vụ GHN (53320: Chuẩn, 53321: Tiết kiệm, 53322: Nhanh)' })
  service_id: number;
  @ApiProperty({ example: 600, description: 'Trọng lượng gói hàng (gram)' })
  weight: number;
  @ApiProperty({ example: 450000, description: 'Giá trị bảo hiểm đơn hàng' })
  insurance_value: number;
}

export class GhnLeadtimeDto {
  @ApiProperty({ example: 1442, description: 'ID quận/huyện gửi' })
  from_district_id: number;
  @ApiProperty({ example: '010101', description: 'Mã phường/xã gửi' })
  from_ward_code: string;
  @ApiProperty({ example: 1454, description: 'ID quận/huyện nhận' })
  to_district_id: number;
  @ApiProperty({ example: '20101', description: 'Mã phường/xã nhận' })
  to_ward_code: string;
  @ApiProperty({ example: 53320, description: 'ID gói dịch vụ GHN' })
  service_id: number;
}

export class GhnAvailableServicesDto {
  @ApiProperty({ example: 123456, description: 'ID cửa hàng / Shop ID trên GHN' })
  shop_id: number;
  @ApiProperty({ example: 1442, description: 'ID quận/huyện gửi hàng' })
  from_district: number;
  @ApiProperty({ example: 1454, description: 'ID quận/huyện nhận hàng' })
  to_district: number;
}

export class GhnCreateOrderDto {
  @ApiProperty({ example: 2, description: '1: Người gửi trả cước, 2: Người nhận trả cước' })
  payment_type_id: number;
  @ApiProperty({ example: 'Giao hàng sau 17h, gọi khách trước', description: 'Ghi chú cho shipper' })
  note: string;
  @ApiProperty({ example: 'KHONGCHOXEMHANG', enum: ['CHOTHUHANG', 'CHOXEMHANGKHONGTHU', 'KHONGCHOXEMHANG'], description: 'Lưu ý khi giao hàng' })
  required_note: string;
  @ApiProperty({ example: 'Lê Hoàng Long', description: 'Họ tên người nhận' })
  to_name: string;
  @ApiProperty({ example: '0977889900', description: 'SĐT người nhận' })
  to_phone: string;
  @ApiProperty({ example: 'Số 45 Lê Duẩn, Bến Nghé, Quận 1', description: 'Địa chỉ người nhận' })
  to_address: string;
  @ApiProperty({ example: '20101', description: 'Mã phường/xã nhận' })
  to_ward_code: string;
  @ApiProperty({ example: 1454, description: 'ID quận/huyện nhận' })
  to_district_id: number;
  @ApiProperty({ example: 520000, description: 'Tiền thu hộ COD' })
  cod_amount: number;
  @ApiProperty({ example: 'Thời trang công sở nam', description: 'Nội dung bưu phẩm' })
  content: string;
  @ApiProperty({ example: 800, description: 'Trọng lượng gói hàng (gram)' })
  weight: number;
  @ApiProperty({ example: 20, description: 'Chiều dài gói hàng (cm)' })
  length: number;
  @ApiProperty({ example: 15, description: 'Chiều rộng gói hàng (cm)' })
  width: number;
  @ApiProperty({ example: 10, description: 'Chiều cao gói hàng (cm)' })
  height: number;
  @ApiProperty({ example: 520000, description: 'Khai giá bảo hiểm' })
  insurance_value: number;
  @ApiProperty({ example: 53320, description: 'ID gói dịch vụ GHN' })
  service_id: number;
  @ApiProperty({
    example: [{ name: 'Áo Sơ Mi Oxford Slimfit', code: 'SM-OXF-01', quantity: 1, price: 520000 }],
    description: 'Danh sách sản phẩm',
  })
  items: any[];
}

export class GhnCancelOrderDto {
  @ApiProperty({ example: ['GHN_ORDER_99182'], description: 'Danh sách mã vận đơn cần hủy' })
  order_codes: string[];
}

export class GhnPrintOrderDto {
  @ApiProperty({ example: ['GHN_ORDER_99182', 'GHN_ORDER_99183'], description: 'Danh sách mã vận đơn cần in phiếu' })
  order_codes: string[];
  @ApiProperty({ example: 'A5', enum: ['A5', '80x80', '52x70'], description: 'Khổ giấy in tem' })
  paper_size?: string;
}

// ═══════════════════════════════════════════════════════════════
// VIETTEL POST DTOs
// ═══════════════════════════════════════════════════════════════

export class ViettelPostGetPriceDto {
  @ApiProperty({ example: 500, description: 'Trọng lượng hàng (gram)' })
  PRODUCT_WEIGHT: number;
  @ApiProperty({ example: 350000, description: 'Giá trị bưu phẩm' })
  PRODUCT_PRICE: number;
  @ApiProperty({ example: 350000, description: 'Số tiền thu hộ COD' })
  MONEY_COLLECTION: number;
  @ApiProperty({ example: 'VCN', description: 'Mã dịch vụ: VCN (Nhanh), VTK (Tiết kiệm), VBS (Thương mại điện tử)' })
  ORDER_SERVICE: string;
  @ApiProperty({ example: 1, description: 'Mã tỉnh người gửi (Hà Nội = 1)' })
  SENDER_PROVINCE: number;
  @ApiProperty({ example: 10, description: 'Mã quận người gửi' })
  SENDER_DISTRICT: number;
  @ApiProperty({ example: 2, description: 'Mã tỉnh người nhận (TP.HCM = 2)' })
  RECEIVER_PROVINCE: number;
  @ApiProperty({ example: 25, description: 'Mã quận người nhận' })
  RECEIVER_DISTRICT: number;
  @ApiProperty({ example: 'HH', description: 'Loại hàng hóa: HH (Hàng hóa), TH (Thư từ)' })
  PRODUCT_TYPE: string;
}

export class ViettelPostCreateOrderDto {
  @ApiProperty({ example: 'VTP_ORD_20261003_01', description: 'Mã đơn hàng nội bộ' })
  ORDER_NUMBER: string;
  @ApiProperty({ example: 1024, description: 'Mã kho xuất Viettel Post' })
  GROUPADDRESS_ID: number;
  @ApiProperty({ example: '03/10/2026 14:00:00', description: 'Ngày hẹn shipper đến lấy' })
  DELIVERY_DATE: string;
  @ApiProperty({ example: 'UniFlow Fulfillment Hub', description: 'Tên người gửi' })
  SENDER_FULLNAME: string;
  @ApiProperty({ example: 'Số 1 Trần Thái Tông, Cầu Giấy, Hà Nội', description: 'Địa chỉ gửi' })
  SENDER_ADDRESS: string;
  @ApiProperty({ example: '0988776655', description: 'SĐT gửi' })
  SENDER_PHONE: string;
  @ApiProperty({ example: 'Đỗ Quốc Bảo', description: 'Họ tên người nhận' })
  RECEIVER_FULLNAME: string;
  @ApiProperty({ example: '254 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP.HCM', description: 'Địa chỉ nhận' })
  RECEIVER_ADDRESS: string;
  @ApiProperty({ example: '0909112233', description: 'SĐT nhận' })
  RECEIVER_PHONE: string;
  @ApiProperty({ example: 1, description: '1: Người gửi thanh toán cước, 2: Người nhận thanh toán cước' })
  ORDER_PAYMENT: number;
  @ApiProperty({ example: 'VBS', description: 'Mã gói dịch vụ Viettel Post' })
  ORDER_SERVICE: string;
  @ApiProperty({ example: 480000, description: 'Tiền thu hộ COD' })
  MONEY_COLLECTION: number;
  @ApiProperty({ example: 'Bộ quần áo thể thao Active Dry', description: 'Tên hàng hóa' })
  PRODUCT_NAME: string;
  @ApiProperty({ example: 2, description: 'Số lượng' })
  PRODUCT_QUANTITY: number;
  @ApiProperty({ example: 480000, description: 'Giá tiền' })
  PRODUCT_PRICE: number;
  @ApiProperty({ example: 650, description: 'Trọng lượng gram' })
  PRODUCT_WEIGHT: number;
}

export class ViettelPostUpdateOrderDto {
  @ApiProperty({ example: 'VTP_ORD_20261003_01', description: 'Mã vận đơn cần sửa' })
  ORDER_NUMBER: string;
  @ApiProperty({ example: 1, description: '1: Sửa thông tin giao, 2: Chuyển hoàn, 3: Giao lại' })
  TYPE: number;
  @ApiProperty({ example: 'Khách hẹn giao lại vào thứ 2 tuần sau', description: 'Ghi chú cập nhật' })
  NOTE: string;
  @ApiProperty({ example: 450000, description: 'Tiền COD điều chỉnh mới', required: false })
  MONEY_COLLECTION?: number;
}

export class ViettelPostCancelOrderDto {
  @ApiProperty({ example: 'VTP_ORD_20261003_01', description: 'Mã vận đơn cần hủy' })
  ORDER_NUMBER: string;
  @ApiProperty({ example: 'Khách hàng thay đổi địa chỉ ngoài phạm vi giao', description: 'Lý do hủy đơn' })
  NOTE: string;
}

// ═══════════════════════════════════════════════════════════════
// UNIFLOW CORE PROMOTIONS & NOTIFICATION GATEWAYS
// ═══════════════════════════════════════════════════════════════

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
  beneficiaryPhone?: string;
}

export class ValidateVoucherDto {
  @ApiProperty({ example: 'VIP-7819-2026', description: 'Mã voucher cần kiểm tra' })
  voucherCode: string;
  @ApiProperty({ example: 450000, description: 'Tổng giá trị giỏ hàng thực tế' })
  cartAmount: number;
  @ApiProperty({ example: '0988776655', description: 'Số điện thoại khách mua', required: false })
  customerPhone?: string;
}

export class TelegramAlertDto {
  @ApiProperty({ example: '-100192837465', description: 'Chat ID kênh hoặc nhóm quản trị' })
  chat_id: string;
  @ApiProperty({ example: '🚨 [UniFlow Alert] Phát hiện đơn hàng #ORD_9912 có nguy cơ boom hàng cao (Tỷ lệ hoàn 80%)', description: 'Nội dung tin nhắn cảnh báo' })
  text: string;
}

export class ZaloZnsDto {
  @ApiProperty({ example: '84988776655', description: 'Số điện thoại nhận tin ZNS (định dạng 84...)' })
  phone: string;
  @ApiProperty({ example: '298102', description: 'ID mẫu tin ZNS đã duyệt bởi Zalo' })
  template_id: string;
  @ApiProperty({
    example: { customer_name: 'Nguyễn Văn A', order_code: 'ORD-9912', status: 'Đang vận chuyển' },
    description: 'Dữ liệu điền vào mẫu ZNS',
  })
  template_data: any;
}
