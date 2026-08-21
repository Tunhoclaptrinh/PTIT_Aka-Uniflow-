/**
 * Shopee Push Notification Payload — Đúng format thật theo Shopee Open Platform
 * Ref: https://open.shopee.com/documents/v2/v2.push.order
 * code: 3 = ORDER_STATUS_UPDATE
 */
export const SHOPEE_ORDER_FIXTURE = {
  code: 3,
  timestamp: Math.floor(Date.now() / 1000),
  shop_id: 123456789,
  data: {
    ordersn: 'SP_FIXTURE_001',
    status: 'READY_TO_SHIP',
    update_time: Math.floor(Date.now() / 1000),
    buyer_user_id: 987654321,
    total_amount: '720000',
    items: [
      {
        item_id: 112233445,
        item_sku: 'SHP-JEAN-SLIM-31',
        model_sku: 'Quần Jean Slimfit Xanh (31)',
        quantity_purchased: 1,
        original_price: '720000',
      },
    ],
    recipient_address: {
      name: 'Trần Thị Bình',
      phone: '0912345678',
      full_address: '456 Láng Hạ, Đống Đa, Hà Nội',
      city: 'Hà Nội',
      district: 'Đống Đa',
      town: 'Thịnh Quang',
    },
  },
};
