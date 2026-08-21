/**
 * Lazada Push Notification Payload — Đúng format thật theo Lazada Open Platform
 * Ref: https://open.lazada.com/apps/doc/api?path=%2Fpush%2Forder%2Fstatus
 */
export const LAZADA_ORDER_FIXTURE = {
  appKey: 'your_lazada_app_key',
  event: 'trade_order_status_update',
  msgType: 1,
  sellerId: '123456789',
  eventTime: String(Math.floor(Date.now() / 1000)),
  data: {
    orderId: 'LZD_FIXTURE_001',
    orderStatus: 'packed',
    updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    orderItems: [
      {
        orderItemId: '111222333',
        itemCode: 'LZD-HOODIE-GREY-XL',
        itemName: 'Áo Hoodie Streetwear Xám (XL)',
        qty: 1,
        paidPrice: '450000',
        sku: 'HOODIE-STR-GRY-XL',
      },
    ],
    addressBilling: {
      firstName: 'Lê Văn Cường',
      address1: '789 Giải Phóng, Hoàng Mai, Hà Nội',
      city: 'Hanoi',
      phone: '0978123456',
    },
  },
};
