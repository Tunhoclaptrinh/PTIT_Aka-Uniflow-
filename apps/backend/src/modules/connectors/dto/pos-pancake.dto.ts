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
