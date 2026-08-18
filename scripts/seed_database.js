/**
 * Script nạp dữ liệu khởi tạo mở rộng (Rich Real Seed Data) cho UniFlow AI
 * Nạp đầy đủ: Tenant, 3 Workflows thực tế, 10+ SKU Mappings phong phú và 20+ Nhật ký Sync Logs
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'PTIT_Aka';

if (!MONGO_URI || MONGO_URI.includes('<db_password>')) {
  console.error('\n❌ LỖI: Bạn chưa điền mật khẩu thật vào <db_password> trong file .env!');
  process.exit(1);
}

async function seed() {
  console.log(`>>> Kết nối tới MongoDB Atlas (${MONGO_DB_NAME}) để nạp dữ liệu mẫu phong phú...`);
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(MONGO_DB_NAME);
    const tenantId = new ObjectId('66c0e812a1b2c3d4e5f60001');

    // 1. Seed Tenant
    await db.collection('tenants').updateOne(
      { _id: tenantId },
      {
        $set: {
          name: 'Thời Trang An Khang (PTIT Aka Store)',
          subdomain: 'ankhang-ptit',
          planTier: 'GROWTH',
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
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
    console.log('✅ 1. Đã cập nhật Tenant: Thời Trang An Khang.');

    // 2. Seed 3 Workflows thực tế
    const workflows = [
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f60004'),
        tenantId,
        name: 'Tự động trừ kho Sapo và Đẩy đơn GHTK từ TikTok Shop',
        description: 'Luồng xử lý đơn hàng 0-chạm đa kênh tự động với AI Matching cho TikTok Shop',
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
        tenantId,
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
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f60008'),
        tenantId,
        name: 'Đồng bộ Lazada sang Sapo & Viettel Post (Luồng Siêu Sale)',
        description: 'Tối ưu hóa thông lượng cao cho sự kiện Mega Sale 11/11 & Payday',
        isActive: false,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_lz_1',
            type: 'trigger',
            position: { x: 60, y: 150 },
            data: { label: 'Lazada Inbound Webhook', description: 'Đơn hàng mới' },
          },
          {
            id: 'node_ai_lz_2',
            type: 'ai',
            position: { x: 400, y: 150 },
            data: { label: 'AI SKU Matcher', description: 'Khớp danh mục tự động' },
          },
          {
            id: 'node_sapo_lz_3',
            type: 'action',
            position: { x: 740, y: 150 },
            data: { label: 'Trừ tồn Sapo & ViettelPost', description: 'Đẩy đơn siêu tốc', category: 'POS' },
          },
        ],
        edges: [
          { id: 'e_lz_1-2', source: 'node_lz_1', target: 'node_ai_lz_2', animated: true, style: { stroke: '#0F146D', strokeWidth: 2 } },
          { id: 'e_lz_2-3', source: 'node_ai_lz_2', target: 'node_sapo_lz_3', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
        ],
        viewport: { x: 0, y: 0, zoom: 1 },
        executionCount: 5180,
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
    console.log(`✅ 2. Đã nạp ${workflows.length} Workflows Canvas thực tế.`);

    // 3. Seed 10 SKU Mappings thực tế ngành TMĐT
    const skuMappings = [
      {
        tenantId,
        sourcePlatform: 'TIKTOK_SHOP',
        sourceSkuCode: 'TTS-AT-COT-BLK-L',
        sourceProductName: 'Áo thun Cotton Nam Màu Đen Size L Cao Cấp PTIT Aka',
        sourceVariationText: 'Màu: Đen | Size: L',
        targetPosPlatform: 'SAPO',
        targetMasterSku: 'AT-COT-BLK-L',
        targetProductName: 'Áo Thun Cotton Nam Đen Size L',
        confidenceScore: 0.985,
        mappingStatus: 'AUTO_APPROVED',
        updatedAt: new Date(),
      },
      {
        tenantId,
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
        tenantId,
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
        tenantId,
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
        tenantId,
        sourcePlatform: 'TIKTOK_SHOP',
        sourceSkuCode: 'TTS-AK-BOMBER-GRN-L',
        sourceProductName: 'Áo Khoác Bomber 2 Lớp Chống Nước Màu Rêu Size L',
        sourceVariationText: 'Xanh Rêu / L',
        targetPosPlatform: 'SAPO',
        targetMasterSku: 'AK-BOMB-GRN-L',
        targetProductName: 'Áo Khoác Bomber Rêu Size L',
        confidenceScore: 0.941,
        mappingStatus: 'PENDING_REVIEW',
        updatedAt: new Date(),
      },
      {
        tenantId,
        sourcePlatform: 'SHOPEE',
        sourceSkuCode: 'SP-GI-SNEAKER-WHT-42',
        sourceProductName: 'Giày Sneaker Nam Thể Thao Màu Trắng Đế Cao 4cm Size 42',
        sourceVariationText: 'Trắng Full / 42',
        targetPosPlatform: 'KIOTVIET',
        targetMasterSku: 'GI-SNK-WHT-42',
        targetProductName: 'Giày Sneaker Classic Trắng 42',
        confidenceScore: 0.958,
        mappingStatus: 'AUTO_APPROVED',
        updatedAt: new Date(),
      },
      {
        tenantId,
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
      {
        tenantId,
        sourcePlatform: 'TIKTOK_SHOP',
        sourceSkuCode: 'TTS-THAT-LUNG-BLK',
        sourceProductName: 'Thắt Lưng Nam Mặt Khóa Tự Động Hợp Kim Đen',
        sourceVariationText: 'Khóa Tự Động Đen',
        targetPosPlatform: 'SAPO',
        targetMasterSku: 'TL-KHOA-AUT-BLK',
        targetProductName: 'Thắt Lưng Da Khóa Tự Động Đen',
        confidenceScore: 0.882,
        mappingStatus: 'PENDING_REVIEW',
        updatedAt: new Date(),
      },
      {
        tenantId,
        sourcePlatform: 'SHOPEE',
        sourceSkuCode: 'SP-TAT-CO-NGAN-SET5',
        sourceProductName: 'Set 5 Đôi Tất Vớ Nam Cổ Ngắn Khử Mùi Thoáng Khí',
        sourceVariationText: 'Set 5 Đôi Mix Màu',
        targetPosPlatform: 'KIOTVIET',
        targetMasterSku: 'SET-TAT-NAM-05',
        targetProductName: 'Hộp 5 Đôi Tất Cổ Ngắn Cotton',
        confidenceScore: 0.684,
        mappingStatus: 'MANUAL_REQUIRED',
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
    console.log(`✅ 3. Đã nạp ${skuMappings.length} SKU Mappings ngành thời trang TMĐT.`);

    // 4. Seed 12 Sync Event Logs thực tế
    const syncLogs = [
      {
        tenantId,
        platform: 'TIKTOK_SHOP',
        sourceOrderId: 'TTS_88921045',
        status: 'COMPLETED',
        durationMs: 198,
        message: 'Đơn TikTok #TTS_88921045 -> Khớp SKU AI (98.5%) -> Trừ kho Sapo -> Tạo vận đơn GHTK (198ms) ✅',
        aiHealed: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 2), // 2 phút trước
      },
      {
        tenantId,
        platform: 'SHOPEE',
        sourceOrderId: 'SP_24081899120',
        status: 'AUTO_HEALED',
        durationMs: 412,
        message: 'AI Auto-Healed: GHN Server Timeout (504) -> Reroute sang GHTK (Tiết kiệm 4,500đ) ⚡',
        aiHealed: true,
        healingDetails: { originalCarrier: 'GHN', fallbackCarrier: 'GHTK', reason: 'Gateway Timeout 504' },
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
      },
      {
        tenantId,
        platform: 'TIKTOK_SHOP',
        sourceOrderId: 'TTS_88920982',
        status: 'COMPLETED',
        durationMs: 165,
        message: 'Đơn TikTok #TTS_88920982 -> Khớp SKU \'QJ-SLIM-BLK-32\' -> Trừ kho Sapo -> Tạo vận đơn GHTK (165ms) ✅',
        aiHealed: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 12),
      },
      {
        tenantId,
        platform: 'SHOPEE',
        sourceOrderId: 'SP_24081898741',
        status: 'COMPLETED',
        durationMs: 220,
        message: 'Đơn Shopee #SP_24081898741 -> Trừ kho KiotViet -> Tạo đơn Viettel Post thành công ✅',
        aiHealed: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 25),
      },
      {
        tenantId,
        platform: 'LAZADA',
        sourceOrderId: 'LZD_582910381',
        status: 'COMPLETED',
        durationMs: 175,
        message: 'Đơn Lazada #LZD_582910381 -> Khớp SKU \'VI-DABO-BRN\' -> Trừ kho Sapo -> GHTK (175ms) ✅',
        aiHealed: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 40),
      },
    ];

    for (const log of syncLogs) {
      await db.collection('sync_event_logs').insertOne(log);
    }
    console.log(`✅ 4. Đã nạp ${syncLogs.length} Sync Logs thực tế vào MongoDB Atlas.`);

    console.log('\n🎉 NẠP TOÀN BỘ BỘ DỮ LIỆU THỰC TẾ THÀNH CÔNG VÀO DATABASE PTIT_Aka! ✅');
  } catch (err) {
    console.error('❌ Lỗi khi nạp dữ liệu:', err.message);
  } finally {
    await client.close();
  }
}

seed();
