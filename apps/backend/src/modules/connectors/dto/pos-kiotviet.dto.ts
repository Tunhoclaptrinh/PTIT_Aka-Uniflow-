import { ApiProperty } from '@nestjs/swagger';

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

export class KiotVietUpdateOrderDto {
  @ApiProperty({ example: 182, description: 'ID hóa đơn KiotViet' })
  orderId: number;
  @ApiProperty({ example: 'Khách yêu cầu gói quà cẩn thận', description: 'Ghi chú hóa đơn' })
  description: string;
}

export class KiotVietCreateBookingDto {
  @ApiProperty({ example: 101, description: 'ID chi nhánh tiếp nhận đặt hàng' })
  branchId: number;
  @ApiProperty({ example: 'Phạm Thu Hằng', description: 'Tên người đặt' })
  customerName: string;
  @ApiProperty({ example: '0988112233', description: 'Số điện thoại' })
  customerPhone: string;
  @ApiProperty({ example: [{ productCode: 'KV-SP-01', quantity: 5, price: 150000 }], description: 'Hàng đặt trước' })
  orderItems: any[];
  @ApiProperty({ example: 200000, description: 'Tiền đặt cọc trước' })
  deposit: number;
}

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

export class KiotVietUpdateProductDto {
  @ApiProperty({ example: 'KV-SP-01', description: 'Mã hàng hóa' })
  productCode: string;
  @ApiProperty({ example: 'Tai nghe Bluetooth Mini Pro', description: 'Tên hàng hóa mới', required: false })
  name?: string;
  @ApiProperty({ example: 165000, description: 'Giá bán mới', required: false })
  basePrice?: number;
  @ApiProperty({ example: 95000, description: 'Giá vốn mới', required: false })
  cost?: number;
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

export class KiotVietUpdateStockDto {
  @ApiProperty({ example: 101, description: 'ID chi nhánh KiotViet' })
  branchId: number;
  @ApiProperty({ example: 'KV-SP-01', description: 'Mã hàng hóa (Product Code / Barcode)' })
  productCode: string;
  @ApiProperty({ example: 120, description: 'Số lượng tồn kho thực tế' })
  onHand: number;
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

export class KiotVietTransferStockDto {
  @ApiProperty({ example: 101, description: 'ID chi nhánh chuyển đi' })
  fromBranchId: number;
  @ApiProperty({ example: 102, description: 'ID chi nhánh nhận' })
  toBranchId: number;
  @ApiProperty({ example: [{ productCode: 'KV-SP-01', quantity: 30 }], description: 'Hàng điều chuyển' })
  items: any[];
  @ApiProperty({ example: 'Chuyển hàng hỗ trợ chi nhánh Q.1', description: 'Ghi chú' })
  note: string;
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

export class KiotVietCreateCustomerDto {
  @ApiProperty({ example: 'Phạm Thanh Tùng', description: 'Tên khách hàng' })
  name: string;
  @ApiProperty({ example: '0988665544', description: 'Số điện thoại' })
  contactNumber: string;
  @ApiProperty({ example: 'Số 20 Hoàng Hoa Thám, Ba Đình, Hà Nội', description: 'Địa chỉ' })
  address: string;
}

export class KiotVietUpdateCustomerDto {
  @ApiProperty({ example: 10291, description: 'ID khách hàng KiotViet' })
  customerId: number;
  @ApiProperty({ example: 'Phạm Thanh Tùng (VIP)', description: 'Tên mới', required: false })
  name?: string;
  @ApiProperty({ example: 'tung.vip@example.com', description: 'Email mới', required: false })
  email?: string;
}

export class KiotVietLoyaltyPointDto {
  @ApiProperty({ example: 10291, description: 'ID khách hàng KiotViet' })
  customerId: number;
  @ApiProperty({ example: 50, description: 'Số điểm thay đổi (+50 là cộng điểm, -50 là tiêu điểm)' })
  changePoints: number;
  @ApiProperty({ example: 'Tích điểm đơn hàng HD000182', description: 'Lý do tích / tiêu điểm' })
  reason: string;
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

export class KiotVietWebhookDto {
  @ApiProperty({ example: 'https://gateway.uniflow.vn/api/v1/webhooks/kiotviet', description: 'URL callback Uniflow nhận webhook KiotViet' })
  webhookUrl: string;
  @ApiProperty({ example: 'invoice.update', enum: ['invoice.create', 'invoice.update', 'order.create', 'order.update', 'product.update', 'stock.update'], description: 'Sự kiện đăng ký' })
  type: string;
  @ApiProperty({ example: true, description: 'Trạng thái kích hoạt' })
  isActive: boolean;
}

export class KiotVietCreateCategoryDto {
  @ApiProperty({ example: 'Phụ Kiện Điện Thoại & Âm Thanh', description: 'Tên nhóm hàng hóa' })
  categoryName: string;
  @ApiProperty({ example: 101, description: 'ID nhóm cha (nếu có)', required: false })
  parentId?: number;
}

export class KiotVietCreateSupplierDto {
  @ApiProperty({ example: 'Công ty Cổ phần Công Nghệ Tân Á', description: 'Tên nhà cung cấp' })
  name: string;
  @ApiProperty({ example: '02439998877', description: 'Số điện thoại nhà cung cấp' })
  contactNumber: string;
  @ApiProperty({ example: 'Số 88 Trần Thái Tông, Cầu Giấy, Hà Nội', description: 'Địa chỉ nhà cung cấp' })
  address: string;
  @ApiProperty({ example: '0108899123', description: 'Mã số thuế', required: false })
  taxCode?: string;
}


