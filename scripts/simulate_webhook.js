/**
 * Tool giả lập Webhook Inbound từ TikTok Shop & Shopee
 * Tính toán chữ ký số HMAC-SHA256 và gửi request tới Backend API Gateway
 *
 * Chạy: node scripts/simulate_webhook.js [tiktok|shopee]
 */

const crypto = require('crypto');
const http = require('http');

const BACKEND_HOST = 'localhost';
const BACKEND_PORT = 3000;
const TENANT_ID = '66c0e812a1b2c3d4e5f60001';
const TIKTOK_APP_SECRET = 'your_tiktok_webhook_hmac_secret';

const platform = process.argv[2] || 'tiktok';

if (platform === 'tiktok') {
  simulateTikTokWebhook();
} else if (platform === 'shopee') {
  simulateShopeePush();
} else {
  console.error('Nền tảng không hỗ trợ. Sử dụng: node scripts/simulate_webhook.js [tiktok|shopee]');
}

function simulateTikTokWebhook() {
  console.log('>>> Đang khởi tạo Webhook TikTok Shop mẫu...');

  const orderId = 'TTS_' + Date.now();
  const payload = {
    type: 'ORDER_STATUS_CHANGE',
    event_type: 'ORDER_STATUS_CHANGE',
    timestamp: Math.floor(Date.now() / 1000),
    data: {
      order_id: orderId,
      order_status: 'AWAITING_SHIPMENT',
      shop_id: 'VN_TTS_98765',
      create_time: Math.floor(Date.now() / 1000),
      payment_method: 'ONLINE_PAYMENT',
      total_amount: 299000,
      currency: 'VND',
      recipient_address: {
        name: 'Nguyễn Văn An',
        phone: '0987654321',
        full_address: 'Số 10 Trần Phú, Phường Mộ Lao, Quận Hà Đông, Hà Nội',
        city: 'Hà Nội',
        district: 'Quận Hà Đông',
        ward: 'Phường Mộ Lao',
      },
      item_list: [
        {
          sku_id: 'TTS-AT-COT-BLK-L',
          product_name: 'Áo thun Cotton Nam Màu Đen Size L Cao Cấp PTIT',
          quantity: 2,
          sku_sale_price: 149500,
        },
      ],
    },
  };

  const rawBody = JSON.stringify(payload);

  // Tính toán HMAC-SHA256 Signature
  const signature = crypto
    .createHmac('sha256', TIKTOK_APP_SECRET)
    .update(rawBody)
    .digest('hex');

  const options = {
    hostname: BACKEND_HOST,
    port: BACKEND_PORT,
    path: `/api/v1/webhooks/tiktok/${TENANT_ID}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(rawBody),
      'authorization': `SHA256=${signature}`,
      'x-tts-signature': signature,
    },
  };

  sendRequest(options, rawBody, 'TikTok Shop Webhook');
}

function simulateShopeePush() {
  console.log('>>> Đang khởi tạo Shopee Push Notification mẫu...');

  const payload = {
    shop_id: 12345678,
    code: 3, // 3: Order Status Update
    timestamp: Math.floor(Date.now() / 1000),
    data: {
      ordersn: '240818' + Math.floor(Math.random() * 1000000),
      status: 'READY_TO_SHIP',
      update_time: Math.floor(Date.now() / 1000),
    },
  };

  const rawBody = JSON.stringify(payload);

  const options = {
    hostname: BACKEND_HOST,
    port: BACKEND_PORT,
    path: `/api/v1/webhooks/shopee/${TENANT_ID}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(rawBody),
    },
  };

  sendRequest(options, rawBody, 'Shopee Push Notification');
}

function sendRequest(options, body, label) {
  const startTime = Date.now();

  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      const elapsed = Date.now() - startTime;
      console.log(`\n========================================`);
      console.log(`[${label}] Status Code: ${res.statusCode}`);
      console.log(`Thời gian phản hồi: ${elapsed} ms ${elapsed < 500 ? '✅ (< 0.5s Đạt SLA)' : '⚠️'}`);
      console.log(`Response Body: ${responseData}`);
      console.log(`========================================\n`);
    });
  });

  req.on('error', (e) => {
    console.error(`\n❌ Lỗi kết nối tới Backend (${BACKEND_HOST}:${BACKEND_PORT}):`, e.message);
    console.log('Hãy đảm bảo Backend đã được khởi chạy trước khi chạy script.');
  });

  req.write(body);
  req.end();
}
