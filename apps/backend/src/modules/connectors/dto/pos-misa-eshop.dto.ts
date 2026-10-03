import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// ── 1. MISA eShop - ORDER DTOs ──
export class MisaEshopOrderItemDto {
  @ApiProperty({ example: 'SP-TS-001', description: 'Mã hàng hóa / SKU' })
  @IsString()
  itemCode: string;

  @ApiProperty({ example: 'Trà Sữa Oolong Nướng Trân Châu Hoàng Kim', description: 'Tên hàng hóa' })
  @IsString()
  itemName: string;

  @ApiProperty({ example: 'Ly Lớn (Size L)', description: 'Tên đơn vị tính hoặc quy cách' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 2, description: 'Số lượng mua' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 45000, description: 'Đơn giá niêm yết (VND)' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 5000, description: 'Chiết khấu từng dòng món (VND)', required: false })
  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @ApiProperty({ example: 85000, description: 'Thành tiền sau chiết khấu (VND)' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'Ít đường 50%, đá chung', description: 'Ghi chú pha chế / thuộc tính', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}

export class MisaEshopCreateOrderDto {
  @ApiProperty({ example: 'CN_CAUGIAY', description: 'Mã chi nhánh cửa hàng MISA eShop' })
  @IsString()
  branchCode: string;

  @ApiProperty({ example: 'HD-ESHOP-20261003-088', description: 'Mã số hóa đơn bán lẻ POS' })
  @IsString()
  orderNo: string;

  @ApiProperty({ example: 'Nguyễn Thu Ngân', description: 'Tên nhân viên thu ngân mở đơn' })
  @IsString()
  cashier: string;

  @ApiProperty({ example: 'Hoàng Hải Yến', description: 'Tên khách hàng' })
  @IsString()
  customerName: string;

  @ApiProperty({ example: '0988123456', description: 'Số điện thoại khách hàng' })
  @IsString()
  customerPhone: string;

  @ApiProperty({
    type: [MisaEshopOrderItemDto],
    description: 'Danh sách chi tiết mặt hàng / món trong đơn bán lẻ',
    example: [
      {
        itemCode: 'SP-TS-001',
        itemName: 'Trà Sữa Oolong Nướng Trân Châu Hoàng Kim',
        unit: 'Ly Lớn (Size L)',
        quantity: 2,
        price: 45000,
        discountAmount: 5000,
        amount: 85000,
        note: 'Ít đường 50%, đá chung',
      },
      {
        itemCode: 'SP-CAFE-002',
        itemName: 'Cà Phê Muối Cốm Hà Nội',
        unit: 'Ly Vừa (Size M)',
        quantity: 1,
        price: 39000,
        discountAmount: 0,
        amount: 39000,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MisaEshopOrderItemDto)
  items: MisaEshopOrderItemDto[];

  @ApiProperty({ example: 124000, description: 'Tổng tiền hàng trước giảm' })
  @IsNumber()
  subTotal: number;

  @ApiProperty({ example: 10000, description: 'Chiết khấu voucher toàn đơn (VND)', required: false })
  @IsOptional()
  @IsNumber()
  discountTotal?: number;

  @ApiProperty({ example: 114000, description: 'Tổng tiền thanh toán cuối cùng (VND)' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    example: 'VIETQR',
    enum: ['CASH', 'CREDIT_CARD', 'VIETQR', 'MOMO', 'ZALOPAY', 'REWARD_POINTS'],
    description: 'Phương thức thanh toán POS',
  })
  @IsString()
  paymentType: string;

  @ApiProperty({ example: 'Bàn 04 - Tầng 2', description: 'Số bàn hoặc khu vực phục vụ', required: false })
  @IsOptional()
  @IsString()
  tableNo?: string;
}

export class MisaEshopReturnOrderDto {
  @ApiProperty({ example: 'HD-ESHOP-20261003-088', description: 'Mã số hóa đơn gốc cần đổi trả' })
  @IsString()
  originalOrderNo: string;

  @ApiProperty({ example: 'Khách hàng đổi size / phát hiện lỗi sản phẩm', description: 'Lý do đổi trả hàng' })
  @IsString()
  returnReason: string;

  @ApiProperty({
    example: [{ itemCode: 'SP-TS-001', quantity: 1, refundAmount: 42500 }],
    description: 'Danh sách mặt hàng trả lại và tiền hoàn',
  })
  @IsArray()
  returnItems: any[];

  @ApiProperty({ example: 42500, description: 'Tổng tiền hoàn trả cho khách hàng (VND)' })
  @IsNumber()
  refundAmount: number;

  @ApiProperty({ example: 'CASH', enum: ['CASH', 'VIETQR', 'POINTS'], description: 'Hình thức hoàn tiền' })
  @IsString()
  refundMethod: string;
}

// ── 2. MISA eShop - PRODUCT DTOs ──
export class MisaEshopCreateProductDto {
  @ApiProperty({ example: 'SP-TS-003', description: 'Mã sản phẩm / SKU duy nhất' })
  @IsString()
  productCode: string;

  @ApiProperty({ example: 'Trà Đào Cam Sả Tươi Mát', description: 'Tên hàng hóa' })
  @IsString()
  productName: string;

  @ApiProperty({ example: 'NHOM_TRA_TRAI_CAY', description: 'Mã nhóm hàng hóa / Danh mục' })
  @IsString()
  categoryCode: string;

  @ApiProperty({ example: 'Ly', description: 'Đơn vị tính chính' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 18000, description: 'Giá vốn định mức (VND)' })
  @IsNumber()
  costPrice: number;

  @ApiProperty({ example: 42000, description: 'Giá bán niêm yết (VND)' })
  @IsNumber()
  salePrice: number;

  @ApiProperty({ example: 100, description: 'Tồn kho khởi tạo ban đầu', required: false })
  @IsOptional()
  @IsNumber()
  initialStock?: number;

  @ApiProperty({ example: 'CN_CAUGIAY', description: 'Mã chi nhánh khai báo tồn' })
  @IsString()
  branchCode: string;

  @ApiProperty({ example: true, description: 'Cho phép bán trực tiếp tại POS MISA eShop' })
  isAvailableForSale: boolean;
}

export class MisaEshopUpdateProductDto {
  @ApiProperty({ example: 'Trà Đào Cam Sả Tươi Mát (Công thức mới 2026)', description: 'Tên hàng hóa cập nhật', required: false })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiProperty({ example: 45000, description: 'Giá bán mới (VND)', required: false })
  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @ApiProperty({ example: true, description: 'Trạng thái kinh doanh (true: đang bán, false: ngừng bán)', required: false })
  @IsOptional()
  isActive?: boolean;
}

// ── 3. MISA eShop - INVENTORY DTOs ──
export class MisaEshopAdjustStockDto {
  @ApiProperty({ example: 'CN_CAUGIAY', description: 'Mã chi nhánh MISA eShop' })
  @IsString()
  branchCode: string;

  @ApiProperty({ example: 'SP-TS-001', description: 'Mã hàng hóa SKU' })
  @IsString()
  itemCode: string;

  @ApiProperty({ example: 120, description: 'Số lượng tồn kho thực tế chốt sau điều chỉnh' })
  @IsNumber()
  onHand: number;

  @ApiProperty({ example: 'Kiểm kê cuối ngày 03/10/2026', description: 'Lý do điều chỉnh kho', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class MisaEshopStocktakeDto {
  @ApiProperty({ example: 'CN_CAUGIAY', description: 'Mã chi nhánh kiểm kê' })
  @IsString()
  branchCode: string;

  @ApiProperty({ example: 'KK-20261003-01', description: 'Mã phiếu kiểm kê kho' })
  @IsString()
  stocktakeCode: string;

  @ApiProperty({
    example: [
      { itemCode: 'SP-TS-001', systemQty: 100, actualQty: 98, variance: -2, reason: 'Rơi vỡ nguyên liệu' },
      { itemCode: 'SP-CAFE-002', systemQty: 50, actualQty: 52, variance: 2, reason: 'Nhập thừa chưa ghi phiếu' },
    ],
    description: 'Danh sách mặt hàng kiểm kê và chênh lệch',
  })
  @IsArray()
  items: any[];

  @ApiProperty({ example: 'Trần Kho Trưởng', description: 'Người thực hiện kiểm kê' })
  @IsString()
  auditor: string;
}

// ── 4. MISA eShop - CUSTOMER DTOs ──
export class MisaEshopCreateCustomerDto {
  @ApiProperty({ example: 'Đỗ Hoàng Quân', description: 'Họ và tên khách hàng' })
  @IsString()
  customerName: string;

  @ApiProperty({ example: '0912345678', description: 'Số điện thoại khách hàng' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'hoangquan@gmail.com', description: 'Email khách hàng', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'Số 18 Hoàng Quốc Việt, Cầu Giấy, Hà Nội', description: 'Địa chỉ khách hàng', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'VIP_GOLD', enum: ['STANDARD', 'VIP_SILVER', 'VIP_GOLD', 'VIP_DIAMOND'], description: 'Hạng thẻ thành viên' })
  @IsString()
  tier: string;

  @ApiProperty({ example: 100, description: 'Điểm thưởng ban đầu', required: false })
  @IsOptional()
  @IsNumber()
  initialPoints?: number;
}

export class MisaEshopAdjustPointsDto {
  @ApiProperty({ example: 50, description: 'Số điểm cộng (+) hoặc trừ (-)' })
  @IsNumber()
  pointAdjustment: number;

  @ApiProperty({ example: 'Tích điểm sinh nhật tháng 10/2026', description: 'Lý do thay đổi điểm' })
  @IsString()
  reason: string;
}

// ── 5. MISA eShop - SHIFT DTOs ──
export class MisaEshopOpenShiftDto {
  @ApiProperty({ example: 'CN_CAUGIAY', description: 'Mã chi nhánh mở ca' })
  @IsString()
  branchCode: string;

  @ApiProperty({ example: 'SHIFT-20261003-CA01', description: 'Mã ca thu ngân' })
  @IsString()
  shiftId: string;

  @ApiProperty({ example: 'Trần Thị Thu Ngân', description: 'Thu ngân nhận bàn giao ca' })
  @IsString()
  cashier: string;

  @ApiProperty({ example: 1500000, description: 'Tiền mặt đầu ca (quỹ tiền thối két VND)' })
  @IsNumber()
  cashBeginning: number;
}

export class MisaEshopCloseShiftDto {
  @ApiProperty({ example: 'CN_CAUGIAY', description: 'Mã chi nhánh đóng ca' })
  @IsString()
  branchCode: string;

  @ApiProperty({ example: 'SHIFT-20261003-CA01', description: 'Mã ca thu ngân kết thúc' })
  @IsString()
  shiftId: string;

  @ApiProperty({ example: 'Trần Thị Thu Ngân', description: 'Thu ngân kết thúc ca' })
  @IsString()
  cashier: string;

  @ApiProperty({ example: 1500000, description: 'Tiền mặt đầu ca' })
  @IsNumber()
  cashBeginning: number;

  @ApiProperty({ example: 9850000, description: 'Tổng doanh thu tiền mặt thu được trong ca' })
  @IsNumber()
  cashCollected: number;

  @ApiProperty({ example: 11350000, description: 'Tổng tiền mặt thực tế kiểm đếm trong két bàn giao' })
  @IsNumber()
  cashActualInDrawer: number;

  @ApiProperty({ example: 0, description: 'Chênh lệch tiền két (thừa / thiếu)' })
  @IsNumber()
  variance: number;

  @ApiProperty({ example: 15400000, description: 'Doanh thu chuyển khoản VietQR / MoMo trong ca' })
  @IsNumber()
  digitalPaymentRevenue: number;

  @ApiProperty({ example: 58, description: 'Tổng số đơn hàng hoàn thành trong ca' })
  @IsNumber()
  totalOrders: number;
}

// ── 6. MISA eShop - PROMOTION DTOs ──
export class MisaEshopValidateVoucherDto {
  @ApiProperty({ example: 'ESHOP-VIP20K', description: 'Mã voucher khuyến mại cần kiểm tra' })
  @IsString()
  voucherCode: string;

  @ApiProperty({ example: '0988123456', description: 'Số điện thoại khách hàng áp dụng', required: false })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ example: 150000, description: 'Tổng giá trị đơn hàng hiện tại (VND)' })
  @IsNumber()
  orderAmount: number;
}
