import { ApiProperty } from '@nestjs/swagger';

// ═══════════════════════════════════════════════════════════════
// GHTK EXPANDED DTOs
// ═══════════════════════════════════════════════════════════════

export class GhtkPickAddressDto {
  @ApiProperty({ example: 'Kho Tổng UniFlow Hà Nội', description: 'Tên kho hàng' })
  pick_name: string;

  @ApiProperty({ example: 'Số 18 Duy Tân, Dịch Vọng Hậu', description: 'Địa chỉ kho' })
  pick_address: string;

  @ApiProperty({ example: 'Hà Nội', description: 'Tỉnh/Thành phố' })
  pick_province: string;

  @ApiProperty({ example: 'Quận Cầu Giấy', description: 'Quận/Huyện' })
  pick_district: string;

  @ApiProperty({ example: '0988999888', description: 'Số điện thoại liên hệ kho' })
  pick_tel: string;
}

export class GhtkUpdateCodDto {
  @ApiProperty({ example: 'S22941.ORD_123.981', description: 'Mã vận đơn GHTK' })
  tracking_code: string;

  @ApiProperty({ example: 450000, description: 'Số tiền COD mới (VND)' })
  new_cod_amount: number;

  @ApiProperty({ example: 'Khách hàng áp dụng thêm voucher 50k', description: 'Lý do thay đổi tiền COD' })
  reason: string;
}

export class GhtkB2cAccountDto {
  @ApiProperty({ example: 'SHOP_FASHION_01', description: 'Mã định danh shop đối tác' })
  partner_code: string;

  @ApiProperty({ example: 'UniFlow Fashion Hub', description: 'Tên gian hàng' })
  name: string;

  @ApiProperty({ example: '0988776655', description: 'Số điện thoại đăng ký' })
  tel: string;

  @ApiProperty({ example: 'Số 10 Phạm Văn Đồng, Hà Nội', description: 'Địa chỉ kinh doanh' })
  address: string;
}

export class GhtkAddProductDto {
  @ApiProperty({ example: 'TSHIRT-WHT-L', description: 'Mã sản phẩm SKU' })
  product_code: string;

  @ApiProperty({ example: 'Áo Thun Cotton Compact 100%', description: 'Tên sản phẩm' })
  name: string;

  @ApiProperty({ example: 250, description: 'Khối lượng sản phẩm (gram)' })
  weight: number;

  @ApiProperty({ example: 250000, description: 'Giá bán lẻ niêm yết' })
  retail_price: number;
}

// ═══════════════════════════════════════════════════════════════
// GHN EXPANDED DTOs
// ═══════════════════════════════════════════════════════════════

export class GhnShopRegisterDto {
  @ApiProperty({ example: 1442, description: 'Mã quận/huyện của kho' })
  district_id: number;

  @ApiProperty({ example: '010101', description: 'Mã phường/xã của kho' })
  ward_code: string;

  @ApiProperty({ example: 'Kho Fulfillment Cầu Giấy', description: 'Tên cửa hàng / kho hàng' })
  name: string;

  @ApiProperty({ example: '0988999888', description: 'Số điện thoại' })
  phone: string;

  @ApiProperty({ example: 'Số 18 Duy Tân, Dịch Vọng Hậu', description: 'Địa chỉ cụ thể' })
  address: string;
}

export class GhnUpdateOrderDto {
  @ApiProperty({ example: 'GHN98127361', description: 'Mã vận đơn GHN cần cập nhật' })
  order_code: string;

  @ApiProperty({ example: 'Nguyễn Văn Nhận', description: 'Tên người nhận mới', required: false })
  to_name?: string;

  @ApiProperty({ example: '0981112233', description: 'Số điện thoại nhận mới', required: false })
  to_phone?: string;

  @ApiProperty({ example: 'Số 20 Hoàng Quốc Việt, Cầu Giấy', description: 'Địa chỉ nhận mới', required: false })
  to_address?: string;

  @ApiProperty({ example: 'Giao giờ hành chính, gọi trước 30p', description: 'Ghi chú cho shipper', required: false })
  note?: string;
}

export class GhnUpdateCodDto {
  @ApiProperty({ example: 'GHN98127361', description: 'Mã đơn GHN' })
  order_code: string;

  @ApiProperty({ example: 450000, description: 'Số tiền COD mới (VND)' })
  cod_amount: number;
}

export class GhnCreateTicketDto {
  @ApiProperty({ example: 'GHN98127361', description: 'Mã đơn hàng liên quan' })
  order_code: string;

  @ApiProperty({ example: 'GIAO_LAI', enum: ['GIAO_LAI', 'DOI_DIA_CHI', 'KIEM_TRA_HANG', 'HOAN_TIEN'], description: 'Loại yêu cầu khiếu nại' })
  category: string;

  @ApiProperty({ example: 'Khách hàng đề nghị giao lại vào chiều nay 16h', description: 'Mô tả chi tiết yêu cầu' })
  description: string;
}

// ═══════════════════════════════════════════════════════════════
// VIETTEL POST EXPANDED DTOs
// ═══════════════════════════════════════════════════════════════

export class ViettelPostLoginDto {
  @ApiProperty({ example: 'partner_uniflow@viettelpost.com.vn', description: 'Tài khoản đăng nhập đối tác' })
  USERNAME: string;

  @ApiProperty({ example: 'SecretP@ssword2026', description: 'Mật khẩu' })
  PASSWORD: string;
}

export class ViettelPostRegisterInventoryDto {
  @ApiProperty({ example: 'Kho Tổng Hà Nội - Viettel Post', description: 'Tên kho' })
  NAME: string;

  @ApiProperty({ example: 'Số 1 Trần Thái Tông, Cầu Giấy, Hà Nội', description: 'Địa chỉ kho' })
  ADDRESS: string;

  @ApiProperty({ example: '0988776655', description: 'SĐT kho' })
  PHONE: string;

  @ApiProperty({ example: 1, description: 'Mã tỉnh thành' })
  PROVINCE_ID: number;

  @ApiProperty({ example: 10, description: 'Mã quận huyện' })
  DISTRICT_ID: number;

  @ApiProperty({ example: 101, description: 'Mã phường xã' })
  WARDS_ID: number;
}

// ═══════════════════════════════════════════════════════════════
// VNPOST & EMS DTOs
// ═══════════════════════════════════════════════════════════════

export class VnpostCalculateRateDto {
  @ApiProperty({ example: '100000', description: 'Mã bưu chính nơi gửi (Hà Nội = 100000)' })
  sender_postal_code: string;

  @ApiProperty({ example: '700000', description: 'Mã bưu chính nơi nhận (TP.HCM = 700000)' })
  receiver_postal_code: string;

  @ApiProperty({ example: 800, description: 'Trọng lượng bưu kiện (gram)' })
  weight: number;

  @ApiProperty({ example: 'EMS_CHUAN', enum: ['EMS_CHUAN', 'EMS_HOA_TOC', 'BUU_KIEN_THUONG'], description: 'Gói dịch vụ EMS' })
  service_code: string;
}

export class VnpostCreateOrderDto {
  @ApiProperty({ example: 'VNP_ORD_991823', description: 'Mã đơn hàng phía khách hàng' })
  order_number: string;

  @ApiProperty({ example: 'Nguyễn Văn Gửi', description: 'Tên người gửi' })
  sender_name: string;

  @ApiProperty({ example: '0988112233', description: 'SĐT gửi' })
  sender_phone: string;

  @ApiProperty({ example: 'Bưu điện Trung tâm Hà Nội, Đinh Tiên Hoàng', description: 'Địa chỉ gửi' })
  sender_address: string;

  @ApiProperty({ example: 'Phạm Thị Thùy', description: 'Tên người nhận' })
  receiver_name: string;

  @ApiProperty({ example: '0912998877', description: 'SĐT nhận' })
  receiver_phone: string;

  @ApiProperty({ example: 'Số 120 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP.HCM', description: 'Địa chỉ nhận' })
  receiver_address: string;

  @ApiProperty({ example: 550000, description: 'Tiền thu hộ COD' })
  cod_amount: number;

  @ApiProperty({ example: 800, description: 'Trọng lượng (gram)' })
  weight: number;
}

// ═══════════════════════════════════════════════════════════════
// J&T EXPRESS & NINJA VAN DTOs
// ═══════════════════════════════════════════════════════════════

export class JtExpressCreateOrderDto {
  @ApiProperty({ example: 'JT_ORD_88192', description: 'Mã tham chiếu đơn hàng' })
  reference_no: string;

  @ApiProperty({ example: 'EZ', enum: ['EZ', 'FAST', 'SUPER'], description: 'Mã dịch vụ J&T' })
  service_type: string;

  @ApiProperty({ example: 'Vũ Quốc Huy', description: 'Người nhận' })
  receiver_name: string;

  @ApiProperty({ example: '0908889999', description: 'SĐT người nhận' })
  receiver_phone: string;

  @ApiProperty({ example: 'Số 56 Nguyễn Trãi, Thanh Xuân, Hà Nội', description: 'Địa chỉ nhận' })
  receiver_address: string;

  @ApiProperty({ example: 420000, description: 'Tiền thu hộ COD (VND)' })
  cod_amount: number;

  @ApiProperty({ example: 600, description: 'Khối lượng gói hàng (gram)' })
  weight: number;
}

export class NinjaVanCreateOrderDto {
  @ApiProperty({ example: 'NINJA_ORD_10092', description: 'Mã đơn hàng đối tác' })
  merchant_order_number: string;

  @ApiProperty({ example: 'Standard', enum: ['Standard', 'Nextday'], description: 'Gói dịch vụ' })
  service_type: string;

  @ApiProperty({ example: 'Trần Lan Anh', description: 'Tên người nhận' })
  to_name: string;

  @ApiProperty({ example: '0971234567', description: 'SĐT người nhận' })
  to_phone: string;

  @ApiProperty({ example: '180 Pasteur, Bến Nghé, Quận 1, TP.HCM', description: 'Địa chỉ người nhận' })
  to_address: string;

  @ApiProperty({ example: 380000, description: 'Tiền thu hộ COD' })
  cash_on_delivery: number;

  @ApiProperty({ example: 500, description: 'Khối lượng gram' })
  weight: number;
}

// ═══════════════════════════════════════════════════════════════
// INSTANT DELIVERY (AHAMOVE & GRABEXPRESS) DTOs
// ═══════════════════════════════════════════════════════════════

export class AhamoveCreateOrderDto {
  @ApiProperty({ example: 'SGM-BIKE', enum: ['SGM-BIKE', 'SGM-VAN500', 'SGM-VAN1000'], description: 'Loại phương tiện vận chuyển' })
  service_id: string;

  @ApiProperty({
    example: [
      { address: 'Số 18 Duy Tân, Cầu Giấy, Hà Nội', name: 'Kho UniFlow', phone: '0988999888' },
      { address: 'Số 56 Nguyễn Chí Thanh, Ba Đình, Hà Nội', name: 'Khách Hoàng Minh', phone: '0912334455', cod: 350000 },
    ],
    description: 'Danh sách các điểm lấy và giao hàng (Waypoint)',
  })
  path: any[];

  @ApiProperty({ example: 'Giao ngay trong 1 giờ, gọi điện trước khi tới', description: 'Ghi chú cho tài xế' })
  remarks?: string;
}

export class GrabExpressDeliveryDto {
  @ApiProperty({ example: 'Instant', enum: ['Instant', 'SameDay'], description: 'Gói dịch vụ GrabExpress' })
  service_type: string;

  @ApiProperty({ example: { name: 'Shop UniFlow', phone: '0988776655', address: '12 Tràng Thi, Hoàn Kiếm, Hà Nội' }, description: 'Người gửi' })
  origin: any;

  @ApiProperty({ example: { name: 'Nguyễn Thị Bích', phone: '0901223344', address: '88 Phố Huế, Hai Bà Trưng, Hà Nội' }, description: 'Người nhận' })
  destination: any;

  @ApiProperty({ example: 250000, description: 'Tiền ứng COD' })
  cash_on_delivery?: number;
}
