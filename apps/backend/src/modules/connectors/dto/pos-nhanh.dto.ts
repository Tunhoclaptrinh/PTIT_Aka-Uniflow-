import { ApiProperty } from '@nestjs/swagger';

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

export class NhanhUpdateOrderDto {
  @ApiProperty({ example: 88129, description: 'ID đơn hàng Nhanh.vn' })
  orderId: number;
  @ApiProperty({ example: 'Giao giờ hành chính, gọi trước 15p', description: 'Ghi chú đơn hàng mới', required: false })
  description?: string;
  @ApiProperty({ example: '458 Lê Văn Sỹ, P.12, Q.3, TP.HCM', description: 'Địa chỉ nhận hàng mới', required: false })
  customerAddress?: string;
}

export class NhanhUpdateOrderStatusDto {
  @ApiProperty({ example: 88129, description: 'ID đơn hàng Nhanh.vn' })
  orderId: number;
  @ApiProperty({ example: 'Packing', enum: ['Packing', 'Shipping', 'Success', 'Canceled'], description: 'Trạng thái đơn mới' })
  status: string;
}

export class NhanhCalculateFeeDto {
  @ApiProperty({ example: 102, description: 'ID kho gửi hàng' })
  fromDepotId: number;
  @ApiProperty({ example: 1454, description: 'ID quận/huyện nhận hàng (Quận 1, TP.HCM)' })
  toDistrictId: number;
  @ApiProperty({ example: 500, description: 'Trọng lượng đơn hàng (gram)' })
  weight: number;
  @ApiProperty({ example: 290000, description: 'Số tiền thu hộ COD' })
  codAmount: number;
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

export class NhanhUpdateProductDto {
  @ApiProperty({ example: 55412, description: 'ID sản phẩm Nhanh.vn' })
  productId: number;
  @ApiProperty({ example: 'Tai Nghe Chống Ồn Active ANC (Gen 2)', description: 'Tên sản phẩm mới', required: false })
  name?: string;
  @ApiProperty({ example: 920000, description: 'Giá bán mới', required: false })
  price?: number;
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

export class NhanhUpdateCustomerDto {
  @ApiProperty({ example: 89124, description: 'ID khách hàng Nhanh.vn' })
  customerId: number;
  @ApiProperty({ example: 'Lê Hoàng Nam (VIP)', description: 'Tên khách hàng mới', required: false })
  name?: string;
  @ApiProperty({ example: '458 Lê Văn Sỹ, P.12, Q.3, TP.HCM', description: 'Địa chỉ mới', required: false })
  address?: string;
}

export class NhanhCustomerPointsDto {
  @ApiProperty({ example: 89124, description: 'ID khách hàng Nhanh.vn' })
  customerId: number;
  @ApiProperty({ example: 50, description: 'Số điểm thay đổi (+50 là cộng điểm, -50 là tiêu điểm)' })
  points: number;
  @ApiProperty({ example: 'Tích điểm đơn hàng tại quầy', description: 'Lý do' })
  reason: string;
}

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
  @ApiProperty({ example: 'Ghi chú sổ quỹ', description: 'Mô tả chi tiết', required: false })
  description?: string;
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

export class NhanhAddBillDto {
  @ApiProperty({ example: 102, description: 'ID điểm kho bán lẻ tại quầy' })
  depotId: number;
  @ApiProperty({ example: 'Nguyễn Văn Thu Ngân', description: 'Tên thu ngân' })
  cashier: string;
  @ApiProperty({ example: [{ idProduct: 55412, quantity: 2, price: 290000 }], description: 'Danh mục hàng xuất tại quầy' })
  products: any[];
  @ApiProperty({ example: 580000, description: 'Tổng tiền bill' })
  totalMoney: number;
  @ApiProperty({ example: 'CASH', enum: ['CASH', 'TRANSFER', 'CARD'], description: 'Hình thức thanh toán' })
  paymentMethod: string;
}

export class NhanhCancelOrderDto {
  @ApiProperty({ example: 88129, description: 'ID đơn hàng Nhanh.vn cần hủy' })
  orderId: number;
  @ApiProperty({ example: 'Khách hàng đổi ý hủy đơn trước khi giao', description: 'Lý do hủy đơn' })
  reason?: string;
}

export class NhanhBusinessDepotDto {
  @ApiProperty({ example: 1, description: 'Trang truy vấn' })
  page?: number;
  @ApiProperty({ example: 'Hà Nội', description: 'Lọc theo tỉnh thành kho', required: false })
  cityName?: string;
}

export class NhanhBusinessEmployeeDto {
  @ApiProperty({ example: 1, description: 'Trang truy vấn' })
  page?: number;
  @ApiProperty({ example: 102, description: 'Lọc nhân viên theo kho / chi nhánh', required: false })
  depotId?: number;
}

export class NhanhBusinessDepartmentDto {
  @ApiProperty({ example: 1, description: 'Trang truy vấn' })
  page?: number;
}

export class NhanhBusinessSupplierSearchDto {
  @ApiProperty({ example: 'Công ty May Mặc Tân Bình', description: 'Từ khóa tên hoặc SĐT nhà cung cấp', required: false })
  keyword?: string;
  @ApiProperty({ example: 1, description: 'Trang' })
  page?: number;
}

export class NhanhBusinessSupplierAddDto {
  @ApiProperty({ example: 'Công ty Cổ phần Dệt May Phúc Thịnh', description: 'Tên nhà cung cấp' })
  name: string;
  @ApiProperty({ example: '02838991122', description: 'Số điện thoại nhà cung cấp' })
  mobile: string;
  @ApiProperty({ example: 'Khu Công Nghiệp Tân Bình, P. Tây Thạnh, Q. Tân Phú, TP.HCM', description: 'Địa chỉ nhà cung cấp' })
  address: string;
  @ApiProperty({ example: '0314992288', description: 'Mã số thuế doanh nghiệp', required: false })
  taxCode?: string;
}

export class NhanhShippingCarrierDto {
  @ApiProperty({ example: 102, description: 'ID điểm kho gửi hàng' })
  depotId?: number;
}

export class NhanhShippingHandoverDto {
  @ApiProperty({ example: 102, description: 'ID kho giao bưu tá' })
  depotId: number;
  @ApiProperty({ example: 'GHTK', description: 'Hãng vận chuyển nhận hàng (GHTK, GHN, VTPOST, J&T)' })
  carrier: string;
  @ApiProperty({ example: [88129, 88130, 88131], description: 'Danh sách ID đơn hàng bàn giao cho shipper' })
  orderIds: number[];
}

export class NhanhSearchBillDto {
  @ApiProperty({ example: 1, description: 'Trang' })
  page?: number;
  @ApiProperty({ example: 102, description: 'ID điểm bán lẻ / kho' })
  depotId?: number;
  @ApiProperty({ example: '2026-10-01', description: 'Từ ngày' })
  fromDate?: string;
  @ApiProperty({ example: '2026-10-03', description: 'Đến ngày' })
  toDate?: string;
}

export class NhanhAddInvoiceDto {
  @ApiProperty({ example: 88129, description: 'ID đơn hàng cần xuất hóa đơn VAT điện tử' })
  orderId: number;
  @ApiProperty({ example: 'Công ty TNHH Giải Pháp Công Nghệ UniFlow', description: 'Tên đơn vị mua hàng' })
  buyerLegalName: string;
  @ApiProperty({ example: '0109988776', description: 'Mã số thuế đơn vị mua hàng' })
  buyerTaxCode: string;
  @ApiProperty({ example: 'Tòa nhà Innovation, Cầu Giấy, Hà Nội', description: 'Địa chỉ đơn vị mua hàng' })
  buyerAddress: string;
  @ApiProperty({ example: 'finance@uniflow.vn', description: 'Email nhận hóa đơn điện tử' })
  buyerEmail: string;
}

export class NhanhSearchInvoiceDto {
  @ApiProperty({ example: 88129, description: 'ID đơn hàng' })
  orderId?: number;
  @ApiProperty({ example: '0109988776', description: 'Mã số thuế', required: false })
  taxCode?: string;
}

export class NhanhAddCouponDto {
  @ApiProperty({ example: 'UNIFLOW_SALE50', description: 'Mã giảm giá coupon' })
  code: string;
  @ApiProperty({ example: 'DISCOUNT_FIXED', enum: ['DISCOUNT_FIXED', 'DISCOUNT_PERCENT'], description: 'Loại giảm giá' })
  type: string;
  @ApiProperty({ example: 50000, description: 'Giá trị giảm (VNĐ hoặc %)' })
  value: number;
  @ApiProperty({ example: 300000, description: 'Giá trị đơn tối thiểu để áp dụng' })
  minOrderValue: number;
  @ApiProperty({ example: '2026-10-31', description: 'Ngày hết hạn áp dụng mã' })
  expiredDate: string;
}

export class NhanhSearchCouponDto {
  @ApiProperty({ example: 'UNIFLOW', description: 'Từ khóa tìm kiếm mã coupon', required: false })
  keyword?: string;
  @ApiProperty({ example: 1, description: 'Trang' })
  page?: number;
}

export class NhanhCheckPromotionDto {
  @ApiProperty({ example: 'UNIFLOW_SALE50', description: 'Mã khuyến mãi cần kiểm tra' })
  couponCode: string;
  @ApiProperty({ example: 450000, description: 'Tổng tiền đơn hàng hiện tại' })
  totalOrderMoney: number;
  @ApiProperty({ example: 89124, description: 'ID khách hàng', required: false })
  customerId?: number;
}

export class NhanhAddReceiptDto {
  @ApiProperty({ example: 102, description: 'ID kho / chi nhánh lập phiếu' })
  depotId: number;
  @ApiProperty({ example: 350000, description: 'Số tiền thu (VNĐ)' })
  amount: number;
  @ApiProperty({ example: 'Thu tiền đặt cọc đơn gia công', description: 'Lý do thu tiền' })
  reason: string;
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Người nộp tiền' })
  payerName: string;
}

export class NhanhAddPaymentDto {
  @ApiProperty({ example: 102, description: 'ID kho / chi nhánh lập phiếu' })
  depotId: number;
  @ApiProperty({ example: 120000, description: 'Số tiền chi (VNĐ)' })
  amount: number;
  @ApiProperty({ example: 'Chi tiền mua vật tư đóng gói bọc xốp', description: 'Lý do chi tiền' })
  reason: string;
  @ApiProperty({ example: 'Cửa hàng Băng keo Bao bì Hoàng Gia', description: 'Người nhận tiền' })
  receiverName: string;
}

export class NhanhSendZnsDto {
  @ApiProperty({ example: '0977889900', description: 'Số điện thoại Zalo của khách hàng nhận tin' })
  phone: string;
  @ApiProperty({ example: 'ZNS_ORDER_CONFIRMED', description: 'ID mẫu thông báo Zalo ZNS đã duyệt' })
  templateId: string;
  @ApiProperty({ example: { order_code: 'NF_88129', customer_name: 'Lê Hoàng Nam', total_amount: '290.000đ' }, description: 'Dữ liệu biến điền vào mẫu thông báo ZNS' })
  templateData: Record<string, any>;
}

export class NhanhEcomSyncStockDto {
  @ApiProperty({ example: 102, description: 'ID kho POS' })
  depotId: number;
  @ApiProperty({ example: 'SHOPEE', enum: ['SHOPEE', 'TIKTOK', 'LAZADA'], description: 'Sàn TMĐT đích' })
  marketplace: string;
  @ApiProperty({ example: [{ sku: 'ANC-PRO-01', stock: 45 }], description: 'Danh sách SKU và số lượng tồn cần đẩy lên sàn' })
  items: any[];
}

export class NhanhEcomSyncOrderDto {
  @ApiProperty({ example: 'SHOPEE', enum: ['SHOPEE', 'TIKTOK', 'LAZADA'], description: 'Nguồn sàn TMĐT' })
  marketplace: string;
  @ApiProperty({ example: '241003AB9911X', description: 'Mã đơn hàng trên sàn' })
  marketplaceOrderId: string;
  @ApiProperty({ example: 102, description: 'ID kho Nhanh.vn tiếp nhận đơn' })
  depotId: number;
}

export class NhanhWebhookSubscribeDto {
  @ApiProperty({ example: 'https://gateway.uniflow.vn/api/v1/webhooks/nhanh', description: 'URL webhook Uniflow tiếp nhận sự kiện' })
  webhookUrl: string;
  @ApiProperty({ example: ['order.add', 'order.updateStatus', 'inventory.change', 'product.update'], description: 'Danh sách sự kiện đăng ký' })
  events: string[];
}

export class NhanhWebhookDeleteDto {
  @ApiProperty({ example: 991, description: 'ID webhook đã đăng ký trên Nhanh.vn' })
  webhookId: number;
}

