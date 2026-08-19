/**
 * Script nạp dữ liệu chuyên biệt cho Kênh Kết Nối (Connectors Master Seed)
 * Khởi tạo & Cập nhật đầy đủ 20 cổng kết nối đối tác vào MongoDB Atlas:
 * - Sàn TMĐT: TikTok Shop, Shopee, Lazada
 * - Quản lý kho POS & ERP: Sapo, KiotViet, Nhanh.vn, Haravan
 * - Đơn vị vận chuyển (Logistics): GHTK, GHN, Viettel Post
 * - Kế toán & Thuế: MISA AMIS, MISA meInvoice, Fast Accounting, Bravo ERP
 * - CSKH & Hội thoại: Pancake POS, Zalo OA & ZNS, Telegram Bot
 * - Bảng tính & Tệp tin: Google Sheets Live Sync, Microsoft Excel / CSV
 * - Landing Page & Form: LadiPage Inbound Form
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'PTIT_Aka';

if (!MONGO_URI || MONGO_URI.includes('<db_password>')) {
  console.error('\n❌ LỖI: Bạn chưa điền mật khẩu thật vào MONGO_URI trong file .env!');
  process.exit(1);
}

const DEFAULT_TENANT_ID = '66c0e812a1b2c3d4e5f60001';

const ALL_CONNECTORS = [
  // ── SÀN TMĐT ─────────────────────────────────────────────────────────────
  {
    connectorId: 'tiktok',
    name: 'TikTok Shop',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'CONNECTED',
    ordersSynced: 28450,
    latencyMs: 185,
    latency: '185ms',
    brandColor: '#000000',
    description: 'Inbound Webhook 0-chạm, xác thực HMAC-SHA256 chuẩn SLA TikTok',
    config: {
      appKey: 'app_tiktok_live_key',
      appSecret: 'sec_tiktok_live_secret',
      endpoint: 'https://auth.tiktok-shops.com',
      webhookSecret: 'whsec_tiktok_hmac256_uniflow',
    },
  },
  {
    connectorId: 'shopee',
    name: 'Shopee Open Platform',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'CONNECTED',
    ordersSynced: 14220,
    latencyMs: 210,
    latency: '210ms',
    brandColor: '#EE4D2D',
    description: 'Nhận push notification READY_TO_SHIP và pull đơn hàng chi tiết qua API v2',
    config: {
      appKey: 'app_shopee_live_key',
      appSecret: 'sec_shopee_live_secret',
      endpoint: 'https://partner.shopeemobile.com',
      partnerId: '109823',
    },
  },
  {
    connectorId: 'lazada',
    name: 'Lazada Open API',
    category: 'MARKETPLACE',
    categoryLabel: 'Sàn TMĐT',
    status: 'DISCONNECTED',
    ordersSynced: 5180,
    latencyMs: 230,
    latency: '230ms',
    brandColor: '#0F146D',
    description: 'Kết nối gian hàng Lazada Mall, đồng bộ trạng thái thanh toán tự động',
    config: {
      appKey: 'app_lazada_live_key',
      appSecret: 'sec_lazada_live_secret',
      endpoint: 'https://api.lazada.vn/rest',
    },
  },

  // ── CSKH & HỘI THOẠI ──────────────────────────────────────────────────────
  {
    connectorId: 'pancake',
    name: 'Pancake POS & Social Chat',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'CONNECTED',
    ordersSynced: 31200,
    latencyMs: 110,
    latency: '110ms',
    brandColor: '#2563EB',
    description: 'Đồng bộ tin nhắn Fanpage Facebook, Zalo OA và AI CSKH tự động tư vấn chốt đơn',
    config: {
      appKey: 'app_pancake_live_key',
      appSecret: 'sec_pancake_live_secret',
      endpoint: 'https://pages.fm/api/v1',
    },
  },
  {
    connectorId: 'zalo',
    name: 'Zalo OA & ZNS Notification',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'CONNECTED',
    ordersSynced: 15400,
    latencyMs: 95,
    latency: '95ms',
    brandColor: '#0068FF',
    description: 'Tự động gửi thông báo biến động đơn hàng, mã tracking vận đơn qua Zalo ZNS',
    config: {
      appKey: 'app_zalo_live_key',
      appSecret: 'sec_zalo_live_secret',
      endpoint: 'https://openapi.zalo.me/v2.0',
    },
  },
  {
    connectorId: 'telegram',
    name: 'Telegram Bot Webhook',
    category: 'CHAT_SOCIAL',
    categoryLabel: 'CSKH & Hội thoại',
    status: 'CONNECTED',
    ordersSynced: 42300,
    latencyMs: 80,
    latency: '80ms',
    brandColor: '#24A1DE',
    description: 'Nhận báo cáo đơn hàng mới, cảnh báo lỗi ánh xạ SKU và phê duyệt 1-click tức thì',
    config: {
      appKey: 'bot_token_telegram_live',
      endpoint: 'https://api.telegram.org',
    },
  },

  // ── QUẢN LÝ KHO POS & ERP ─────────────────────────────────────────────────
  {
    connectorId: 'sapo',
    name: 'Sapo POS & Omnichannel',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'CONNECTED',
    ordersSynced: 38900,
    latencyMs: 145,
    latency: '145ms',
    brandColor: '#0088FF',
    description: 'Trừ tồn kho tức thì (Live Inventory Deduct) và cập nhật phiếu xuất kho',
    config: {
      appKey: 'app_sapo_live_key',
      appSecret: 'sec_sapo_live_secret',
      endpoint: 'https://core.sapo.vn',
      warehouseBranch: 'WH_MAIN_HN',
    },
  },
  {
    connectorId: 'kiotviet',
    name: 'KiotViet Retail API',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'CONNECTED',
    ordersSynced: 19800,
    latencyMs: 160,
    latency: '160ms',
    brandColor: '#004F9E',
    description: 'Đồng bộ hóa đơn bán hàng và trừ tồn kho chi nhánh theo thời gian thực',
    config: {
      appKey: 'app_kiotviet_live_key',
      appSecret: 'sec_kiotviet_live_secret',
      endpoint: 'https://public.kiotapi.com',
    },
  },
  {
    connectorId: 'nhanh',
    name: 'Nhanh.vn Omnichannel POS',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'CONNECTED',
    ordersSynced: 12600,
    latencyMs: 170,
    latency: '170ms',
    brandColor: '#FF6F00',
    description: 'Đồng bộ danh mục đa chi nhánh, trạng thái đối soát và phiếu chuyển kho nội bộ',
    config: {
      appKey: 'app_nhanh_live_key',
      appSecret: 'sec_nhanh_live_secret',
      endpoint: 'https://open.nhanh.vn/api',
    },
  },
  {
    connectorId: 'haravan',
    name: 'Haravan Omnichannel',
    category: 'POS_ERP',
    categoryLabel: 'Quản lý kho POS',
    status: 'DISCONNECTED',
    ordersSynced: 3400,
    latencyMs: 190,
    latency: '190ms',
    brandColor: '#E65100',
    description: 'Đồng bộ dữ liệu sản phẩm, giá bán và hóa đơn điện tử Haravan',
    config: {
      appKey: 'app_haravan_live_key',
      appSecret: 'sec_haravan_live_secret',
      endpoint: 'https://api.haravan.com/com',
    },
  },

  // ── LANDING PAGE & FORM ───────────────────────────────────────────────────
  {
    connectorId: 'ladipage',
    name: 'LadiPage Form Inbound',
    category: 'LANDING_PAGE',
    categoryLabel: 'Landing Page & Form',
    status: 'CONNECTED',
    ordersSynced: 8700,
    latencyMs: 85,
    latency: '85ms',
    brandColor: '#10B981',
    description: 'Thu thập đơn hàng từ form Landing Page, tự động chuẩn hóa địa chỉ và đẩy sang POS',
    config: {
      appKey: 'app_ladipage_live_key',
      endpoint: 'https://api.ladipage.vn/v1',
    },
  },

  // ── ĐƠN VỊ VẬN CHUYỂN (LOGISTICS) ─────────────────────────────────────────
  {
    connectorId: 'ghtk',
    name: 'Giao Hàng Tiết Kiệm (GHTK)',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'CONNECTED',
    ordersSynced: 26100,
    latencyMs: 175,
    latency: '175ms',
    brandColor: '#005D38',
    description: 'Tạo vận đơn tự động, lấy mã tracking và in phiếu giao hàng A6 ngay lập tức',
    config: {
      appKey: 'app_ghtk_live_token',
      endpoint: 'https://services.giaohangtietkiem.vn',
      customSettings: {
        autoPrintWaybill: true,
        priority: 'CHEAPEST_AUTO',
      },
    },
  },
  {
    connectorId: 'ghn',
    name: 'Giao Hàng Nhanh (GHN Express)',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'CONNECTED',
    ordersSynced: 18400,
    latencyMs: 165,
    latency: '165ms',
    brandColor: '#F26522',
    description: 'Tự động tính cước vận chuyển chuẩn SLA và định tuyến thông minh (Smart Rerouting)',
    config: {
      appKey: 'app_ghn_live_token',
      endpoint: 'https://online-gateway.ghn.vn/shiip/public-api',
      customSettings: {
        autoPrintWaybill: true,
        priority: 'FASTEST',
      },
    },
  },
  {
    connectorId: 'viettelpost',
    name: 'Viettel Post API v2',
    category: 'LOGISTICS',
    categoryLabel: 'Đơn vị vận chuyển',
    status: 'CONNECTED',
    ordersSynced: 14500,
    latencyMs: 195,
    latency: '195ms',
    brandColor: '#EE0033',
    description: 'Đồng bộ đơn hàng vận chuyển Viettel Post và tra cứu hành trình trực tiếp',
    config: {
      appKey: 'app_vtp_live_token',
      endpoint: 'https://partner.viettelpost.vn/v2',
    },
  },

  // ── BẢNG TÍNH & EXCEL ─────────────────────────────────────────────────────
  {
    connectorId: 'googlesheets',
    name: 'Google Sheets Live Sync',
    category: 'SPREADSHEET',
    categoryLabel: 'Bảng tính & Tệp tin',
    status: 'CONNECTED',
    ordersSynced: 16400,
    latencyMs: 120,
    latency: '120ms',
    brandColor: '#0F9D58',
    description: 'Tự động chèn dòng đơn hàng realtime, trích xuất báo cáo doanh thu & tồn kho tức thì',
    config: {
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      sheetName: 'DonHang_Realtime',
    },
  },
  {
    connectorId: 'excel',
    name: 'Microsoft Excel / CSV Engine',
    category: 'SPREADSHEET',
    categoryLabel: 'Bảng tính & Tệp tin',
    status: 'CONNECTED',
    ordersSynced: 9200,
    latencyMs: 95,
    latency: '95ms',
    brandColor: '#107C41',
    description: 'Xuất file Excel (.xlsx) theo mẫu tùy biến, đồng bộ OneDrive & nhập xuất SKU hàng loạt',
  },

  // ── KẾ TOÁN & THUẾ ────────────────────────────────────────────────────────
  {
    connectorId: 'misa_amis',
    name: 'MISA AMIS Kế toán',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'CONNECTED',
    ordersSynced: 4820,
    latencyMs: 140,
    latency: '140ms',
    brandColor: '#0070C0',
    description: 'Tự động ghi sổ cái, xuất chứng từ và đồng bộ hóa đơn VAT sang MISA AMIS theo thời gian thực',
    config: {
      appKey: 'app_misa_amis_key',
      taxCode: '0109887766',
      endpoint: 'https://api.amis.misa.vn/v1',
      accountDebit: '1121',
      accountCredit: '5111',
      accountVat: '33311',
    },
  },
  {
    connectorId: 'misa_meinvoice',
    name: 'MISA meInvoice (Hóa đơn điện tử)',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'CONNECTED',
    ordersSynced: 3120,
    latencyMs: 155,
    latency: '155ms',
    brandColor: '#0070C0',
    description: 'Phát hành hóa đơn GTGT điện tử ký số, tuân thủ Nghị định 117/2025 & Thông tư 40/2021',
    config: {
      appKey: 'app_meinvoice_key',
      taxCode: '0109887766',
      invoiceSerial: '1C25TKK',
      invoiceTemplate: '1/001',
      vatRate: '1_PERCENT_ECOMMERCE',
      signingType: 'CLOUD_HSM',
      autoIssueOn: 'DELIVERED',
    },
  },
  {
    connectorId: 'fast_accounting',
    name: 'Fast Accounting ERP',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'DISCONNECTED',
    ordersSynced: 1840,
    latencyMs: 185,
    latency: '185ms',
    brandColor: '#E65100',
    description: 'Đối soát số dư tài khoản ngân hàng, tổng hợp báo cáo tài chính và kê khai thuế TNCN',
    config: {
      taxCode: '0109887766',
    },
  },
  {
    connectorId: 'bravo_erp',
    name: 'Bravo ERP',
    category: 'ACCOUNTING',
    categoryLabel: 'Kế toán & Thuế',
    status: 'DISCONNECTED',
    ordersSynced: 920,
    latencyMs: 200,
    latency: '200ms',
    brandColor: '#1565C0',
    description: 'Quản lý tài chính tổng hợp, phân tích lãi lỗ đa trung tâm chi phí và kiểm toán nội bộ',
    config: {
      taxCode: '0109887766',
    },
  },
];

async function seedConnectors(tenantId = DEFAULT_TENANT_ID) {
  console.log(`>>> Kết nối tới MongoDB Atlas (${MONGO_DB_NAME}) để nạp kênh kết nối đối tác...`);
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(MONGO_DB_NAME);

    console.log(`🔌 Đang nạp ${ALL_CONNECTORS.length} Cổng kết nối cho Tenant ${tenantId}...`);

    for (const c of ALL_CONNECTORS) {
      await db.collection('connectors').updateOne(
        { tenantId: tenantId.toString(), connectorId: c.connectorId },
        {
          $set: {
            tenantId: tenantId.toString(),
            connectorId: c.connectorId,
            name: c.name,
            category: c.category,
            status: c.status,
            ordersSynced: c.ordersSynced,
            latencyMs: c.latencyMs,
            latency: c.latency,
            config: c.config || {},
            lastSyncedAt: new Date(),
            lastTestedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
    }

    console.log(`ĐÃ NẠP THÀNH CÔNG ${ALL_CONNECTORS.length} CỔNG KẾT NỐI VÀO MONGODB DATABASE! 🚀`);
  } catch (err) {
    console.error('❌ Lỗi khi nạp cổng kết nối:', err.message);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  seedConnectors();
}

module.exports = { seedConnectors, ALL_CONNECTORS };
