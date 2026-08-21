/**
 * TikTok Shop Order Webhook Payload — Đúng format thật theo TikTok Open Platform API docs
 * Ref: https://partner.tiktokshop.com/docv2/page/64f199826b8b1f031f040219
 */
export const TIKTOK_ORDER_FIXTURE = {
  type: 'order',
  shop_id: '7412345678901234567',
  data: {
    order_id: 'TTS_FIXTURE_001',
    order_status: 'AWAITING_SHIPMENT',
    create_time: Math.floor(Date.now() / 1000),
    total_amount: '850000',
    currency: 'VND',
    shop_id: '7412345678901234567',
    item_list: [
      {
        item_id: '7412345678901234001',
        sku_id: 'TTS-POLO-BLK-L',
        product_name: 'Áo Polo Nam Cotton Compact Màu Đen Size L Cao Cấp',
        quantity: 1,
        sku_sale_price: '850000',
        sku_type: 'NORMAL',
      },
    ],
    recipient_address: {
      name: 'Nguyễn Văn An',
      phone: '0987654321',
      full_address: '123 Xuân Thủy, Cầu Giấy, Hà Nội',
      city: 'Hà Nội',
      district: 'Cầu Giấy',
      ward: 'Dịch Vọng Hậu',
    },
  },
};
