/**
 * Script nạp dữ liệu khởi tạo (Seed Data) cho UniFlow AI
 * Tạo Tenant mẫu, User quản trị, Cấu hình Workflow React Flow và Danh mục SKU Mappings
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://uniflow_admin:uniflow_secret_2026@localhost:27017/uniflow_db?authSource=admin';

async function seed() {
  console.log('>>> Kết nối tới MongoDB để nạp dữ liệu mẫu...');
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db('uniflow_db');

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
    console.log('✅ Đã nạp Tenant mẫu.');

    // 2. Seed Workflow Mẫu (TikTok -> AI Mapper -> Sapo Deduct & GHTK Waybill)
    const workflowId = new ObjectId('66c0e812a1b2c3d4e5f60004');
    await db.collection('workflows').updateOne(
      { _id: workflowId },
      {
        $set: {
          tenantId: tenantId,
          name: 'Tự động trừ kho Sapo và Đẩy đơn GHTK từ TikTok Shop',
          description: 'Luồng xử lý đơn hàng 0-chạm đa kênh tự động với AI Matching',
          isActive: true,
          triggerType: 'WEBHOOK',
          nodes: [
            {
              id: 'node_trigger_1',
              type: 'TRIGGER_TIKTOK',
              label: 'TikTok Inbound Webhook',
              position: { x: 100, y: 200 },
              config: { shopId: 'VN_TTS_98765', eventType: 'ORDER_STATUS_CHANGE' },
            },
            {
              id: 'node_ai_mapper_2',
              type: 'AI_SKU_MAPPER',
              label: 'AI SKU Matching Engine',
              position: { x: 420, y: 200 },
              config: { confidenceThreshold: 0.95, fallbackAction: 'SUGGEST_REVIEW' },
            },
            {
              id: 'node_pos_3',
              type: 'ACTION_SAPO_DEDUCT',
              label: 'Trừ tồn kho Sapo POS',
              position: { x: 740, y: 120 },
              config: { warehouseId: 'WH_MAIN_HN' },
            },
            {
              id: 'node_ship_4',
              type: 'ACTION_GHTK_WAYBILL',
              label: 'Tạo vận đơn GHTK',
              position: { x: 740, y: 280 },
              config: { serviceTier: 'EXPRESS', autoPrint: true },
            },
          ],
          edges: [
            { id: 'e1-2', source: 'node_trigger_1', target: 'node_ai_mapper_2', animated: true },
            { id: 'e2-3', source: 'node_ai_mapper_2', target: 'node_pos_3', animated: true },
            { id: 'e2-4', source: 'node_ai_mapper_2', target: 'node_ship_4', animated: true },
          ],
          viewport: { x: 0, y: 0, zoom: 1 },
          executionCount: 14502,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
    console.log('✅ Đã nạp Workflow Canvas mẫu.');

    // 3. Seed SKU Mappings
    const mappings = [
      {
        tenantId,
        sourcePlatform: 'TIKTOK_SHOP',
        sourceSkuCode: 'TTS-AT-COT-BLK-L',
        sourceProductName: 'Áo thun Cotton Nam Màu Đen Size L Cao Cấp',
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
        sourceProductName: 'Áo Polo Pima Nam Trắng M Co Giãn 4 Chiều',
        sourceVariationText: 'Trắng / M',
        targetPosPlatform: 'SAPO',
        targetMasterSku: 'PL-PIMA-WHT-M',
        targetProductName: 'Áo Polo Pima Trắng Size M',
        confidenceScore: 0.912,
        mappingStatus: 'PENDING_REVIEW',
        updatedAt: new Date(),
      },
    ];

    for (const m of mappings) {
      await db.collection('sku_mappings').updateOne(
        { tenantId: m.tenantId, sourcePlatform: m.sourcePlatform, sourceSkuCode: m.sourceSkuCode },
        { $set: m, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log('✅ Đã nạp danh sách SKU Mappings mẫu.');

    console.log('\n🎉 Hoàn thành nạp dữ liệu mẫu thành công!');
  } catch (err) {
    console.error('❌ Lỗi khi nạp dữ liệu:', err.message);
  } finally {
    await client.close();
  }
}

seed();
