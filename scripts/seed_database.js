/**
 * Script nạp dữ liệu khởi tạo mở rộng (Rich Real Multi-Tenant Seed Data) cho UniFlow AI
 * Nạp dữ liệu cách ly riêng biệt cho 2 tài khoản thực tế:
 * 1. Admin Master (admin@uniflow.vn / Admin@123456) -> Tenant: Thời Trang An Khang (PTIT_Aka)
 * 2. Demo Merchant (demo@uniflow.vn / Demo@123456) -> Tenant: Mỹ Phẩm & Skincare GlowTech
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'PTIT_Aka';

if (!MONGO_URI || MONGO_URI.includes('<db_password>')) {
  console.error('\n❌ LỖI: Bạn chưa điền mật khẩu thật vào <db_password> trong file .env!');
  process.exit(1);
}

async function seed() {
  console.log(`>>> Kết nối tới MongoDB Atlas (${MONGO_DB_NAME}) để nạp dữ liệu đa tài khoản mẫu phong phú...`);
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(MONGO_DB_NAME);

    const tenant1Id = new ObjectId('66c0e812a1b2c3d4e5f60001');
    const tenant2Id = new ObjectId('66c0e812a1b2c3d4e5f60002');

    // ══════════════════════════════════════════════════════════════════════════
    // 1. SEED TENANTS
    // ══════════════════════════════════════════════════════════════════════════
    const tenants = [
      {
        _id: tenant1Id,
        name: 'Thời Trang An Khang (PTIT_Aka Store)',
        subdomain: 'ankhang-ptit',
        planTier: 'ENTERPRISE',
        brandTheme: {
          primaryColor: '#ed1c24',
          secondaryColor: '#fcc20f',
        },
        settings: {
          autoRetryOnFailure: true,
          defaultCarrier: 'GHTK',
          alertChannels: ['TELEGRAM', 'WEBSOCKET'],
        },
        isActive: true,
        updatedAt: new Date(),
      },
      {
        _id: tenant2Id,
        name: 'Mỹ Phẩm & Skincare GlowTech Store',
        subdomain: 'glowtech-cosmetics',
        planTier: 'GROWTH',
        brandTheme: {
          primaryColor: '#EC4899',
          secondaryColor: '#8B5CF6',
        },
        settings: {
          autoRetryOnFailure: true,
          defaultCarrier: 'GHN',
          alertChannels: ['WEBSOCKET'],
        },
        isActive: true,
        updatedAt: new Date(),
      },
    ];

    for (const t of tenants) {
      await db.collection('tenants').updateOne(
        { _id: t._id },
        { $set: t, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log('✅ 1. Đã cập nhật 2 Tenants đa kênh: Thời Trang An Khang & Mỹ Phẩm GlowTech.');

    // ══════════════════════════════════════════════════════════════════════════
    // 1.1 SEED USERS (ADMIN & MERCHANT)
    // ══════════════════════════════════════════════════════════════════════════
    const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
    const demoPasswordHash = await bcrypt.hash('Demo@123456', 10);

    const users = [
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f60010'),
        email: 'admin@uniflow.vn',
        password: adminPasswordHash,
        name: 'Admin Master (PTIT_Aka)',
        phone: '0988888888',
        role: 'ADMIN',
        tenantId: tenant1Id,
        avatar: 'https://ui-avatars.com/api/?name=Admin+Master&background=ed1c24&color=fff&bold=true',
        isActive: true,
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f60011'),
        email: 'demo@uniflow.vn',
        password: demoPasswordHash,
        name: 'Chủ Gian Hàng GlowTech',
        phone: '0977777777',
        role: 'MERCHANT',
        tenantId: tenant2Id,
        avatar: 'https://ui-avatars.com/api/?name=Glow+Tech&background=EC4899&color=fff&bold=true',
        isActive: true,
        updatedAt: new Date(),
      },
    ];

    for (const u of users) {
      await db.collection('users').updateOne(
        { email: u.email },
        { $set: u, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(`✅ 1.1. Đã nạp ${users.length} Tài khoản mẫu thực tế (admin@uniflow.vn / demo@uniflow.vn).`);

    // ══════════════════════════════════════════════════════════════════════════
    // 2. SEED WORKFLOWS FOR BOTH TENANTS
    // ══════════════════════════════════════════════════════════════════════════
    const workflows = [
      // ── TENANT 1: Thời Trang An Khang ──────────────────────────────────────
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f60004'),
        tenantId: tenant1Id,
        name: 'Tự động trừ kho Sapo và Đẩy đơn GHTK từ TikTok Shop',
        description: 'Luồng xử lý đơn hàng thời trang 0-chạm đa kênh tự động với AI Matching cho TikTok Shop',
        isActive: true,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_trigger_1',
            type: 'trigger',
            position: { x: 60, y: 150 },
            data: { label: 'TikTok Shop Inbound', description: 'Đơn mới thanh toán (Awaiting Shipment)' },
          },
          {
            id: 'node_ai_mapper_2',
            type: 'ai',
            position: { x: 400, y: 150 },
            data: { label: 'AI Hybrid SKU Mapper', description: 'Độ tin cậy >= 95% -> Tự động duyệt' },
          },
          {
            id: 'node_pos_3',
            type: 'action',
            position: { x: 740, y: 60 },
            data: { label: 'Trừ tồn kho Sapo POS', description: 'Kho: WH_MAIN_HN', category: 'POS' },
          },
          {
            id: 'node_ship_4',
            type: 'action',
            position: { x: 740, y: 250 },
            data: { label: 'Tạo vận đơn GHTK', description: 'Gói Chuẩn Express (Tự động in nhãn)', category: 'LOGISTICS' },
          },
        ],
        edges: [
          { id: 'e1-2', source: 'node_trigger_1', target: 'node_ai_mapper_2', animated: true, style: { stroke: '#ed1c24', strokeWidth: 2 } },
          { id: 'e2-3', source: 'node_ai_mapper_2', target: 'node_pos_3', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 } },
          { id: 'e2-4', source: 'node_ai_mapper_2', target: 'node_ship_4', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
        ],
        viewport: { x: 0, y: 0, zoom: 1 },
        executionCount: 28450,
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f60007'),
        tenantId: tenant1Id,
        name: 'Đồng bộ Shopee sang KiotViet & Tự động tạo đơn GHN',
        description: 'Tự động lấy chi tiết đơn Shopee qua Open API và điều phối vận chuyển',
        isActive: true,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_sp_1',
            type: 'trigger',
            position: { x: 60, y: 150 },
            data: { label: 'Shopee Push Notification', description: 'Sự kiện READY_TO_SHIP' },
          },
          {
            id: 'node_ai_2',
            type: 'ai',
            position: { x: 400, y: 150 },
            data: { label: 'AI Error-Healer & Router', description: 'Định tuyến cước tối ưu & dự phòng' },
          },
          {
            id: 'node_kv_3',
            type: 'action',
            position: { x: 740, y: 60 },
            data: { label: 'Trừ kho KiotViet', description: 'Chi nhánh Cầu Giấy', category: 'POS' },
          },
          {
            id: 'node_ghn_4',
            type: 'action',
            position: { x: 740, y: 250 },
            data: { label: 'Tạo đơn GHN Nhanh', description: 'Lấy hàng tận nơi trong 2h', category: 'LOGISTICS' },
          },
        ],
        edges: [
          { id: 'e_sp_1-2', source: 'node_sp_1', target: 'node_ai_2', animated: true, style: { stroke: '#EE4D2D', strokeWidth: 2 } },
          { id: 'e_sp_2-3', source: 'node_ai_2', target: 'node_kv_3', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 } },
          { id: 'e_sp_2-4', source: 'node_ai_2', target: 'node_ghn_4', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
        ],
        viewport: { x: 0, y: 0, zoom: 1 },
        executionCount: 14220,
        updatedAt: new Date(),
      },

      // ── TENANT 2: Mỹ Phẩm & Skincare GlowTech ──────────────────────────────
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f60020'),
        tenantId: tenant2Id,
        name: 'Đồng bộ đơn Skincare TikTok Shop sang KiotViet & GHN',
        description: 'Tự động kiểm tra hạn sử dụng mỹ phẩm, trừ kho KiotViet và bàn giao GHN Express',
        isActive: true,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_gl_1',
            type: 'trigger',
            position: { x: 60, y: 150 },
            data: { label: 'TikTok Live Stream Order', description: 'Đơn chốt trực tiếp trên phiên Live' },
          },
          {
            id: 'node_gl_ai_2',
            type: 'ai',
            position: { x: 400, y: 150 },
            data: { label: 'AI Cosmetics SKU Matcher', description: 'Khớp Combo quà tặng & Mã sản phẩm' },
          },
          {
            id: 'node_gl_kv_3',
            type: 'action',
            position: { x: 740, y: 60 },
            data: { label: 'Trừ kho KiotViet Cosmetics', description: 'Kho: WH_BEAUTY_HCM', category: 'POS' },
          },
          {
            id: 'node_gl_ghn_4',
            type: 'action',
            position: { x: 740, y: 250 },
            data: { label: 'Tạo vận đơn GHN Hỏa Tốc', description: 'Giao trong ngày 4H HCM', category: 'LOGISTICS' },
          },
        ],
        edges: [
          { id: 'e_gl_1-2', source: 'node_gl_1', target: 'node_gl_ai_2', animated: true, style: { stroke: '#EC4899', strokeWidth: 2 } },
          { id: 'e_gl_2-3', source: 'node_gl_ai_2', target: 'node_gl_kv_3', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 } },
          { id: 'e_gl_2-4', source: 'node_gl_ai_2', target: 'node_gl_ghn_4', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
        ],
        viewport: { x: 0, y: 0, zoom: 1 },
        executionCount: 19680,
        updatedAt: new Date(),
      },
    ];

    for (const wf of workflows) {
      await db.collection('workflows').updateOne(
        { _id: wf._id },
        { $set: wf, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(`✅ 2. Đã nạp ${workflows.length} Workflows Canvas phân tầng cho 2 Tenant.`);

    // ══════════════════════════════════════════════════════════════════════════
    // 3. SEED SKU MAPPINGS FOR BOTH TENANTS
    // ══════════════════════════════════════════════════════════════════════════
    const skuMappings = [
      // ── TENANT 1: Fashion Items ───────────────────────────────────────────
      {
        tenantId: tenant1Id,
        sourcePlatform: 'TIKTOK_SHOP',
        sourceSkuCode: 'TTS-AT-COT-BLK-L',
        sourceProductName: 'Áo thun Cotton Nam Màu Đen Size L Cao Cấp PTIT_Aka',
        sourceVariationText: 'Màu: Đen | Size: L',
        targetPosPlatform: 'SAPO',
        targetMasterSku: 'AT-COT-BLK-L',
        targetProductName: 'Áo Thun Cotton Nam Đen Size L',
        confidenceScore: 0.985,
        mappingStatus: 'AUTO_APPROVED',
        updatedAt: new Date(),
      },
      {
        tenantId: tenant1Id,
        sourcePlatform: 'SHOPEE',
        sourceSkuCode: 'SP-POLO-PIMA-WHT-M',
        sourceProductName: 'Áo Polo Pima Nam Trắng M Co Giãn 4 Chiều Thoáng Mát',
        sourceVariationText: 'Trắng / M',
        targetPosPlatform: 'SAPO',
        targetMasterSku: 'PL-PIMA-WHT-M',
        targetProductName: 'Áo Polo Pima Trắng Size M',
        confidenceScore: 0.912,
        mappingStatus: 'PENDING_REVIEW',
        updatedAt: new Date(),
      },
      {
        tenantId: tenant1Id,
        sourcePlatform: 'TIKTOK_SHOP',
        sourceSkuCode: 'TTS-SM-OXFORD-BLU-XL',
        sourceProductName: 'Áo Sơ Mi Nam Oxford Xanh Nhạt Dài Tay Form Rộng Chuẩn Hàn',
        sourceVariationText: 'Xanh Nhạt / XL',
        targetPosPlatform: 'KIOTVIET',
        targetMasterSku: 'SM-OXF-BLU-XL',
        targetProductName: 'Sơ Mi Oxford Xanh Dài Tay Size XL',
        confidenceScore: 0.894,
        mappingStatus: 'PENDING_REVIEW',
        updatedAt: new Date(),
      },
      {
        tenantId: tenant1Id,
        sourcePlatform: 'SHOPEE',
        sourceSkuCode: 'SP-QJ-SLIM-BLK-32',
        sourceProductName: 'Quần Jean Nam Co Giãn Ống Đứng Đen Size 32',
        sourceVariationText: 'Đen Trơn / 32',
        targetPosPlatform: 'SAPO',
        targetMasterSku: 'QJ-SLIM-BLK-32',
        targetProductName: 'Quần Jean Slimfit Đen Size 32',
        confidenceScore: 0.967,
        mappingStatus: 'AUTO_APPROVED',
        updatedAt: new Date(),
      },
      {
        tenantId: tenant1Id,
        sourcePlatform: 'LAZADA',
        sourceSkuCode: 'LZD-VI-DA-BO-BRN',
        sourceProductName: 'Ví Da Nam Bò Thật Khắc Tên Cao Cấp Nâu Đậm',
        sourceVariationText: 'Nâu Cà Phê',
        targetPosPlatform: 'SAPO',
        targetMasterSku: 'VI-DABO-BRN',
        targetProductName: 'Ví Da Bò Nam Đứng Nâu',
        confidenceScore: 0.975,
        mappingStatus: 'AUTO_APPROVED',
        updatedAt: new Date(),
      },

      // ── TENANT 2: Cosmetics & Skincare Items ──────────────────────────────
      {
        tenantId: tenant2Id,
        sourcePlatform: 'TIKTOK_SHOP',
        sourceSkuCode: 'TTS-SR-B5-HYDRA-30ML',
        sourceProductName: 'Serum Phục Hồi Cấp Ẩm Vitamin B5 Hyaluronic Acid 30ml GlowTech',
        sourceVariationText: 'Chai 30ml',
        targetPosPlatform: 'KIOTVIET',
        targetMasterSku: 'SRM-B5-30ML',
        targetProductName: 'Serum Phục Hồi Da B5 30ml',
        confidenceScore: 0.988,
        mappingStatus: 'AUTO_APPROVED',
        updatedAt: new Date(),
      },
      {
        tenantId: tenant2Id,
        sourcePlatform: 'SHOPEE',
        sourceSkuCode: 'SP-KCN-CENTELLA-50SPF',
        sourceProductName: 'Kem Chống Nắng Rau Má Centella SPF50+ PA++++ Kiềm Dầu Nâng Tông',
        sourceVariationText: 'Tuýp 50ml',
        targetPosPlatform: 'SAPO',
        targetMasterSku: 'KCN-CENT-50ML',
        targetProductName: 'Kem Chống Nắng Rau Má Centella 50ml',
        confidenceScore: 0.952,
        mappingStatus: 'AUTO_APPROVED',
        updatedAt: new Date(),
      },
      {
        tenantId: tenant2Id,
        sourcePlatform: 'TIKTOK_SHOP',
        sourceSkuCode: 'TTS-SON-LIP-VELVET-03',
        sourceProductName: 'Son Kem Lì Mịn Môi Velvet Lip Tint Màu Đỏ Cam Cháy #03 GlowTech',
        sourceVariationText: 'Màu #03 Đỏ Cam',
        targetPosPlatform: 'KIOTVIET',
        targetMasterSku: 'SON-VELVET-03',
        targetProductName: 'Son Kem Lì Velvet #03 Đỏ Cam',
        confidenceScore: 0.925,
        mappingStatus: 'PENDING_REVIEW',
        updatedAt: new Date(),
      },
      {
        tenantId: tenant2Id,
        sourcePlatform: 'SHOPEE',
        sourceSkuCode: 'SP-TT-MICELLAR-400ML',
        sourceProductName: 'Nước Tẩy Trang Làm Sạch Sâu Dịu Nhẹ Micellar Cleansing Water 400ml',
        sourceVariationText: 'Chai Lớn 400ml',
        targetPosPlatform: 'SAPO',
        targetMasterSku: 'NTT-MICEL-400ML',
        targetProductName: 'Nước Tẩy Trang Micellar 400ml',
        confidenceScore: 0.965,
        mappingStatus: 'AUTO_APPROVED',
        updatedAt: new Date(),
      },
    ];

    for (const m of skuMappings) {
      await db.collection('sku_mappings').updateOne(
        { tenantId: m.tenantId, sourcePlatform: m.sourcePlatform, sourceSkuCode: m.sourceSkuCode },
        { $set: m, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(`✅ 3. Đã nạp ${skuMappings.length} SKU Mappings phân biệt cho cả 2 ngành hàng.`);

    // ══════════════════════════════════════════════════════════════════════════
    // 4. SEED SYNC EVENT LOGS FOR BOTH TENANTS
    // ══════════════════════════════════════════════════════════════════════════
    const syncLogs = [
      // ── TENANT 1: Fashion Logs ────────────────────────────────────────────
      {
        tenantId: tenant1Id,
        platform: 'TIKTOK_SHOP',
        sourceOrderId: 'TTS_88921045',
        status: 'COMPLETED',
        durationMs: 198,
        message: 'Đơn TikTok #TTS_88921045 -> Khớp SKU AI (98.5%) -> Trừ kho Sapo -> Tạo vận đơn GHTK (198ms) ✅',
        aiHealed: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 2),
      },
      {
        tenantId: tenant1Id,
        platform: 'SHOPEE',
        sourceOrderId: 'SP_24081899120',
        status: 'AUTO_HEALED',
        durationMs: 412,
        message: 'AI Auto-Healed: GHN Server Timeout (504) -> Reroute sang GHTK (Tiết kiệm 4,500đ) ⚡',
        aiHealed: true,
        healingDetails: { originalCarrier: 'GHN', fallbackCarrier: 'GHTK', reason: 'Gateway Timeout 504' },
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
      },

      // ── TENANT 2: Cosmetics Logs ──────────────────────────────────────────
      {
        tenantId: tenant2Id,
        platform: 'TIKTOK_SHOP',
        sourceOrderId: 'TTS_GLOW_991823',
        status: 'COMPLETED',
        durationMs: 172,
        message: 'Đơn TikTok Live #TTS_GLOW_991823 -> Khớp Combo Serum B5 -> Trừ kho KiotViet -> Bàn giao GHN Hỏa Tốc (172ms) ✅',
        aiHealed: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 1),
      },
      {
        tenantId: tenant2Id,
        platform: 'SHOPEE',
        sourceOrderId: 'SP_GLOW_551920',
        status: 'COMPLETED',
        durationMs: 185,
        message: 'Đơn Shopee Mall #SP_GLOW_551920 -> Khớp Kem Chống Nắng Centella -> Trừ tồn Sapo -> In mã vận đơn GHN ✅',
        aiHealed: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 8),
      },
    ];

    for (const log of syncLogs) {
      await db.collection('sync_event_logs').insertOne(log);
    }
    console.log(`✅ 4. Đã nạp ${syncLogs.length} Sync Logs thực tế vào MongoDB Atlas.`);

    console.log('\n🎉 HOÀN TẤT NẠP DỮ LIỆU ĐA TENANT THỰC TẾ VÀO DATABASE PTIT_Aka! ✅');
  } catch (err) {
    console.error('❌ Lỗi khi nạp dữ liệu:', err.message);
  } finally {
    await client.close();
  }
}

seed();
