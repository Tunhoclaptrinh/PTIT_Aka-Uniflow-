/**
 * Script nạp dữ liệu khởi tạo mở rộng (Rich Real Multi-Tenant Seed Data) cho UniFlow AI
 * Nạp dữ liệu cách ly riêng biệt cho 2 tài khoản thực tế:
 * 1. Admin (admin@uniflow.vn / Admin@123456) -> Tenant: Thời Trang An Khang (PTIT_Aka)
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
    console.log('1. Đã cập nhật 2 Tenants đa kênh: Thời Trang An Khang & Mỹ Phẩm GlowTech.');

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
        name: 'Admin (PTIT_Aka)',
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
    console.log(`1.1. Đã nạp ${users.length} Tài khoản mẫu thực tế (admin@uniflow.vn / demo@uniflow.vn).`);

    // ══════════════════════════════════════════════════════════════════════════
    // 2. SEED WORKFLOWS FOR BOTH TENANTS
    // ══════════════════════════════════════════════════════════════════════════
    const workflows = [
      // ── TENANT 1: Thời Trang An Khang ──────────────────────────────────────
      // ── TRƯỜNG HỢP 1: CỤM PHÂN VÙNG GOM NHÓM SO GIÁ CƯỚC ────────────────
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f60009'),
        tenantId: tenant1Id,
        name: 'Tự động so sánh cước đa hãng (Cụm phân vùng gom nhóm thông minh: Viettel Post, GHTK, GHN)',
        description: 'Tự động tính cước realtime giữa GHTK, GHN, Viettel Post với cụm phân vùng gom nhóm thu gọn / mở rộng trực quan',
        isActive: true,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_rate_trigger',
            type: 'trigger',
            position: { x: 40, y: 180 },
            data: { label: 'TikTok Shop Inbound', description: 'Lắng nghe sự kiện đơn hàng thanh toán thành công', platform: 'TIKTOK' },
          },
          {
            id: 'node_rate_ai_sku',
            type: 'ai',
            position: { x: 310, y: 180 },
            data: { label: 'AI Hybrid SKU Mapper', description: 'Chuẩn hóa mã SKU, bóc tách kích thước & trọng lượng', threshold: 95 },
          },
          // Cụm phân vùng gom nhóm (Group Node)
          {
            id: 'node_rate_group',
            type: 'group',
            position: { x: 575, y: 35 },
            style: { width: 600, height: 300, zIndex: -1 },
            data: {
              label: 'Cụm so sánh cước đa hãng & AI chọn tối ưu',
              subtitle: 'Realtime API Pricing: Viettel Post + GHTK + GHN',
              childCount: 4,
              width: 600,
              height: 300,
              isExpanded: true,
            },
          },
          // Node con dùng parentId + vị trí tương đối
          {
            id: 'node_sub_vtp',
            type: 'action',
            parentId: 'node_rate_group',
            extent: 'parent',
            position: { x: 30, y: 70 },
            zIndex: 10,
            data: { label: 'Tra cước Viettel Post', description: 'Truy vấn API giá cước & thời gian giao Viettel Post realtime', category: 'LOGISTICS' },
          },
          {
            id: 'node_sub_ghtk',
            type: 'action',
            parentId: 'node_rate_group',
            extent: 'parent',
            position: { x: 30, y: 165 },
            zIndex: 10,
            data: { label: 'Tra cước GHTK Express', description: 'Truy vấn API giá cước & thời gian giao GHTK realtime', category: 'LOGISTICS' },
          },
          {
            id: 'node_sub_ghn',
            type: 'action',
            parentId: 'node_rate_group',
            extent: 'parent',
            position: { x: 310, y: 70 },
            zIndex: 10,
            data: { label: 'Tra cước GHN Nhanh', description: 'Truy vấn API giá cước & thời gian giao GHN realtime', category: 'LOGISTICS' },
          },
          {
            id: 'node_sub_ai_pick',
            type: 'ai',
            parentId: 'node_rate_group',
            extent: 'parent',
            position: { x: 310, y: 165 },
            zIndex: 10,
            data: { label: 'AI So sánh cước & Chọn hãng tối ưu', description: 'Tự động phân tích biểu phí & ETA để chọn ĐVVC tối ưu nhất' },
          },
          // Các khối tiếp theo sau cụm
          {
            id: 'node_rate_pos',
            type: 'action',
            position: { x: 1260, y: 80 },
            data: { label: 'Trừ tồn kho Sapo POS', description: 'Ghi giảm tồn kho khả dụng tức thì trên POS', category: 'POS' },
          },
          {
            id: 'node_rate_waybill',
            type: 'action',
            position: { x: 1260, y: 200 },
            data: { label: 'Tạo vận đơn ĐVVC tối ưu (Đa hãng)', description: 'Tự động đẩy đơn & nhận mã vận đơn từ Hãng AI đã chốt', category: 'LOGISTICS' },
          },
          {
            id: 'node_rate_misa',
            type: 'action',
            position: { x: 1530, y: 140 },
            data: { label: 'Xuất HĐĐT MISA meInvoice', description: 'Phát hành HĐĐT & Ký số tự động theo NĐ 117/2025', category: 'ACCOUNTING' },
          },
          {
            id: 'node_rate_notify',
            type: 'action',
            position: { x: 1800, y: 140 },
            data: { label: 'Thông báo Telegram & Zalo', description: 'Báo cáo kết quả xử lý đơn hàng & chi phí vận chuyển', category: 'NOTIFY' },
          },
        ],
        edges: [
          {
            id: 'e_rg_1-2',
            source: 'node_rate_trigger',
            target: 'node_rate_ai_sku',
            animated: true,
            style: { stroke: '#ed1c24', strokeWidth: 2 },
            data: { label: 'Dữ liệu đơn hàng (JSON UDM)', description: 'Payload đơn hàng thanh toán thành công' },
          },
          {
            id: 'e_rg_2-g1',
            source: 'node_rate_ai_sku',
            target: 'node_sub_vtp',
            animated: true,
            style: { stroke: '#8B5CF6', strokeWidth: 2 },
            data: { label: 'Thông tin kiện & Điểm giao', description: 'Gửi trọng lượng & địa chỉ tra cước Viettel Post' },
          },
          {
            id: 'e_rg_2-g2',
            source: 'node_rate_ai_sku',
            target: 'node_sub_ghtk',
            animated: true,
            style: { stroke: '#8B5CF6', strokeWidth: 2 },
            data: { label: 'Thông tin kiện & Điểm giao', description: 'Gửi trọng lượng & địa chỉ tra cước GHTK' },
          },
          {
            id: 'e_rg_2-g3',
            source: 'node_rate_ai_sku',
            target: 'node_sub_ghn',
            animated: true,
            style: { stroke: '#8B5CF6', strokeWidth: 2 },
            data: { label: 'Thông tin kiện & Điểm giao', description: 'Gửi trọng lượng & địa chỉ tra cước GHN' },
          },
          // Edge nội bộ trong group
          {
            id: 'e_rg_g1-ai',
            source: 'node_sub_vtp',
            target: 'node_sub_ai_pick',
            animated: true,
            style: { stroke: '#10B981', strokeWidth: 2 },
            zIndex: 20,
            data: { isInternal: true, label: 'Báo giá Viettel Post', description: 'Phản hồi biểu phí & thời gian giao Viettel Post' },
          },
          {
            id: 'e_rg_g2-ai',
            source: 'node_sub_ghtk',
            target: 'node_sub_ai_pick',
            animated: true,
            style: { stroke: '#10B981', strokeWidth: 2 },
            zIndex: 20,
            data: { isInternal: true, label: 'Báo giá GHTK', description: 'Phản hồi biểu phí & thời gian giao GHTK' },
          },
          {
            id: 'e_rg_g3-ai',
            source: 'node_sub_ghn',
            target: 'node_sub_ai_pick',
            animated: true,
            style: { stroke: '#10B981', strokeWidth: 2 },
            zIndex: 20,
            data: { isInternal: true, label: 'Báo giá GHN', description: 'Phản hồi biểu phí & thời gian giao GHN' },
          },
          {
            id: 'e_rg_ai-pos',
            source: 'node_sub_ai_pick',
            target: 'node_rate_pos',
            animated: true,
            style: { stroke: '#fcc20f', strokeWidth: 2 },
            data: { label: 'Lệnh trừ tồn kho', description: 'Đẩy lệnh trừ kho khả dụng POS' },
          },
          {
            id: 'e_rg_ai-ship',
            source: 'node_sub_ai_pick',
            target: 'node_rate_waybill',
            animated: true,
            style: { stroke: '#10B981', strokeWidth: 2 },
            data: { label: 'Hãng tối ưu được chọn', description: 'Định tuyến sang Hãng giao vận tối ưu nhất' },
          },
          {
            id: 'e_rg_ship-misa',
            source: 'node_rate_waybill',
            target: 'node_rate_misa',
            animated: true,
            style: { stroke: '#0070C0', strokeWidth: 2 },
            data: { label: 'Lệnh xuất HĐĐT (VAT 1%)', description: 'Xuất hóa đơn VAT meInvoice' },
          },
          {
            id: 'e_rg_misa-not',
            source: 'node_rate_misa',
            target: 'node_rate_notify',
            animated: true,
            style: { stroke: '#3B82F6', strokeWidth: 2 },
            data: { label: 'Thông báo hoàn tất đơn', description: 'Báo cáo chi phí vận chuyển & hành trình đơn' },
          },
        ],
        viewport: { x: 0, y: 0, zoom: 0.85 },
        executionCount: 29830,
        updatedAt: new Date(),
      },

      // ── TRƯỜNG HỢP 2: CỤM PHÂN VÙNG GOM NHÓM ĐỒNG BỘ KHO PANCAKE POS ERP ──
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f6000f'),
        tenantId: tenant1Id,
        name: 'Đồng bộ đa kênh Pancake POS & ERP (Cụm phân vùng gom nhóm kho: Sapo + KiotViet + Nhanh.vn)',
        description: 'Khi phát sinh đơn từ Pancake Fanpage, cụm gom nhóm tự động trừ kho đồng thời trên 3 hệ thống POS và xuất hóa đơn VAT',
        isActive: true,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_pan_trig',
            type: 'trigger',
            position: { x: 40, y: 170 },
            data: { label: 'Pancake POS Webhook', description: 'Khách hàng chốt đơn trên Fanpage' },
          },
          {
            id: 'node_pan_ai',
            type: 'ai',
            position: { x: 310, y: 170 },
            data: { label: 'AI NER Trích xuất thông tin', description: 'Chuẩn hóa Tên, SĐT, Địa chỉ nhận hàng' },
          },
          // GroupNode — style.width/height để ReactFlow render đúng kích thước
          {
            id: 'node_pan_group',
            type: 'group',
            position: { x: 575, y: 25 },
            style: { width: 600, height: 300, zIndex: -1 },
            data: {
              label: 'Cụm đồng bộ kho bãi & ERP đa chi nhánh',
              subtitle: 'Realtime Sync: Sapo + KiotViet + Nhanh.vn + MISA',
              childCount: 4,
              width: 600,
              height: 300,
              isExpanded: true,
            },
          },
          // Node con — parentId + extent + vị trí TƯƠNG ĐỐI trong group
          {
            id: 'node_sub_sapo',
            type: 'action',
            parentId: 'node_pan_group',
            extent: 'parent',
            position: { x: 30, y: 60 },
            zIndex: 10,
            data: { label: 'Trừ tồn kho Sapo POS', description: 'Kho Tổng Hà Nội (WH_MAIN_HN)', category: 'POS' },
          },
          {
            id: 'node_sub_kiotviet',
            type: 'action',
            parentId: 'node_pan_group',
            extent: 'parent',
            position: { x: 30, y: 170 },
            zIndex: 10,
            data: { label: 'Trừ tồn kho KiotViet', description: 'Chi nhánh Cầu Giấy', category: 'POS' },
          },
          {
            id: 'node_sub_nhanh',
            type: 'action',
            parentId: 'node_pan_group',
            extent: 'parent',
            position: { x: 310, y: 60 },
            zIndex: 10,
            data: { label: 'Đồng bộ Nhanh.vn POS', description: 'Chi nhánh HCM Q1 & Ghi hóa đơn', category: 'POS' },
          },
          {
            id: 'node_sub_misa',
            type: 'action',
            parentId: 'node_pan_group',
            extent: 'parent',
            position: { x: 310, y: 185 },
            zIndex: 10,
            data: { label: 'Xuất HĐĐT MISA AMIS', description: 'Hạch toán VAT & Ký số tự động', category: 'ACCOUNTING' },
          },
          {
            id: 'node_pan_ship',
            type: 'action',
            position: { x: 1260, y: 155 },
            data: { label: 'Tạo vận đơn GHTK Chuẩn', description: 'Giao hàng tận nơi & Thu hộ COD', category: 'LOGISTICS' },
          },
          {
            id: 'node_pan_zalo',
            type: 'action',
            position: { x: 1540, y: 155 },
            data: { label: 'Gửi tin nhắn Zalo ZNS', description: 'Xác nhận đơn & Link theo dõi hành trình', category: 'NOTIFY' },
          },
        ],
        edges: [
          { id: 'e_pan_1-2', source: 'node_pan_trig', target: 'node_pan_ai', animated: true, style: { stroke: '#2563EB', strokeWidth: 2 }, data: { label: 'Hội thoại chốt đơn' } },
          { id: 'e_pan_2-sapo', source: 'node_pan_ai', target: 'node_sub_sapo', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 }, data: { label: 'Lệnh trừ tồn kho' } },
          { id: 'e_pan_2-kiot', source: 'node_pan_ai', target: 'node_sub_kiotviet', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 }, data: { label: 'Lệnh trừ tồn kho' } },
          { id: 'e_pan_2-nhanh', source: 'node_pan_ai', target: 'node_sub_nhanh', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 }, data: { label: 'Lệnh trừ tồn kho' } },
          { id: 'e_pan_2-misa', source: 'node_pan_ai', target: 'node_sub_misa', animated: true, style: { stroke: '#0070C0', strokeWidth: 2 }, data: { label: 'Hạch toán hóa đơn' } },
          // Edge nội bộ trong group
          { id: 'e_pan_sapo-nhanh', source: 'node_sub_sapo', target: 'node_sub_nhanh', animated: true, style: { stroke: '#10B981', strokeWidth: 2 }, zIndex: 20, data: { isInternal: true, label: 'Đồng bộ kho' } },
          { id: 'e_pan_kiot-nhanh', source: 'node_sub_kiotviet', target: 'node_sub_nhanh', animated: true, style: { stroke: '#10B981', strokeWidth: 2 }, zIndex: 20, data: { isInternal: true, label: 'Đồng bộ kho' } },
          { id: 'e_pan_misa-nhanh', source: 'node_sub_misa', target: 'node_sub_nhanh', animated: true, style: { stroke: '#0070C0', strokeWidth: 2 }, zIndex: 20, data: { isInternal: true, label: 'Hạch toán VAT' } },
          { id: 'e_pan_nhanh-ship', source: 'node_sub_nhanh', target: 'node_pan_ship', animated: true, style: { stroke: '#10B981', strokeWidth: 2 }, data: { label: 'GHTK Express' } },
          { id: 'e_pan_ship-zalo', source: 'node_pan_ship', target: 'node_pan_zalo', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 }, data: { label: 'Thông báo Zalo ZNS' } },
        ],
        viewport: { x: 0, y: 0, zoom: 0.85 },
        executionCount: 18450,
        updatedAt: new Date(),
      },

      // ── TRƯỜNG HỢP 3: CỤM GOM NHÓM XỬ LÝ HÀNG HOÀN & AI OCR ──────────────
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f6001a'),
        tenantId: tenant1Id,
        name: 'Xử lý hàng hoàn & Khiếu nại tự động (Cụm phân vùng gom nhóm AI OCR & Phân tích nguyên nhân)',
        description: 'Tự động tiếp nhận webhook hàng hoàn, AI OCR đọc mã bill, phân loại nguyên nhân và nhập lại kho an toàn',
        isActive: false,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_ret_trig',
            type: 'trigger',
            position: { x: 40, y: 170 },
            data: { label: 'GHTK Webhook', description: 'Lắng nghe sự kiện kiện hàng chuyển trạng thái HOÀN_VỀ' },
          },
          // GroupNode — style.width/height để ReactFlow render đúng kích thước
          {
            id: 'node_ret_group',
            type: 'group',
            position: { x: 315, y: 35 },
            style: { width: 600, height: 280, zIndex: -1 },
            data: {
              label: 'Cụm phân tích hàng hoàn & đối soát bưu tá',
              subtitle: '🔍 AI OCR + Đánh giá nguyên nhân giao hàng không thành công',
              childCount: 3,
              width: 600,
              height: 280,
              isExpanded: true,
            },
          },
          // Node con — parentId + extent + vị trí TƯƠNG ĐỐI trong group
          {
            id: 'node_sub_ocr',
            type: 'ai',
            parentId: 'node_ret_group',
            extent: 'parent',
            position: { x: 25, y: 70 },
            zIndex: 10,
            data: { label: 'AI OCR Quét mã bill hoàn', description: 'Trích xuất mã vận đơn từ ảnh chụp bưu cục' },
          },
          {
            id: 'node_sub_cause',
            type: 'ai',
            parentId: 'node_ret_group',
            extent: 'parent',
            position: { x: 25, y: 160 },
            zIndex: 10,
            data: { label: 'AI Phân tích nguyên nhân', description: 'Phân loại lỗi: Không nghe máy / Sai địa chỉ / Khách đổi ý' },
          },
          {
            id: 'node_sub_audit',
            type: 'action',
            parentId: 'node_ret_group',
            extent: 'parent',
            position: { x: 330, y: 110 },
            zIndex: 10,
            data: { label: 'Đối soát cước hoàn', description: 'Tính toán chi phí hoàn trả với đơn vị vận chuyển', category: 'LOGISTICS' },
          },
          {
            id: 'node_ret_pos',
            type: 'action',
            position: { x: 960, y: 170 },
            data: { label: 'Nhập lại tồn kho hoàn trả', description: 'Tăng tồn kho khả dụng tại Kho Hoàn Trả (WH_RETURN)', category: 'POS' },
          },
          {
            id: 'node_ret_notify',
            type: 'action',
            position: { x: 1240, y: 170 },
            data: { label: 'Thông báo Telegram Bot', description: 'Gửi biên bản đối soát kiện hàng hoàn cho bộ phận kho', category: 'NOTIFY' },
          },
        ],
        edges: [
          { id: 'e_ret_1-ocr', source: 'node_ret_trig', target: 'node_sub_ocr', animated: true, style: { stroke: '#ed1c24', strokeWidth: 2 }, data: { label: 'Hình ảnh kiện hoàn' } },
          { id: 'e_ret_1-cause', source: 'node_ret_trig', target: 'node_sub_cause', animated: true, style: { stroke: '#ed1c24', strokeWidth: 2 }, data: { label: 'Ghi chú bưu tá' } },
          // Edge nội bộ trong group — zIndex cao để hiện rõ
          { id: 'e_ret_ocr-aud', source: 'node_sub_ocr', target: 'node_sub_audit', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2.5 }, zIndex: 20, data: { isInternal: true, label: 'Mã vận đơn OCR' } },
          { id: 'e_ret_cause-aud', source: 'node_sub_cause', target: 'node_sub_audit', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2.5 }, zIndex: 20, data: { isInternal: true, label: 'Lý do hoàn' } },
          { id: 'e_ret_aud-pos', source: 'node_sub_audit', target: 'node_ret_pos', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 }, data: { label: 'Lệnh nhập lại kho' } },
          { id: 'e_ret_pos-not', source: 'node_ret_pos', target: 'node_ret_notify', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 }, data: { label: 'Thông báo hoàn tất' } },
        ],
        viewport: { x: 0, y: 0, zoom: 0.85 },
        executionCount: 4230,
        updatedAt: new Date(),
      },

      // ── TRƯỜNG HỢP 4: SO SÁNH CƯỚC 3 NHÁNH + RẼ NHÁNH THEO KẾT QUẢ AI ──────
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f6000d'),
        tenantId: tenant1Id,
        name: 'So sánh cước đa hãng & Rẽ nhánh tạo đơn theo kết quả AI (GHTK / GHN / Viettel Post)',
        description: 'AI lấy báo giá 3 hãng song song, chọn hãng rẻ nhất rồi rẽ nhánh điều kiện tạo đơn ĐÚNG hãng được chọn',
        isActive: false,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_par_trig',
            type: 'trigger',
            position: { x: 40, y: 280 },
            data: { label: 'Shopee Push Webhook', description: 'Đơn hàng READY_TO_SHIP' },
          },
          {
            id: 'node_par_ai_sku',
            type: 'ai',
            position: { x: 300, y: 280 },
            data: { label: 'AI Hybrid SKU Mapper', description: 'Chuẩn hóa mã SKU, kích thước & thể tích gói hàng' },
          },
          // ── 3 Nhánh lấy báo giá song song ────────────────────────────────────
          {
            id: 'node_par_ghtk',
            type: 'action',
            position: { x: 560, y: 100 },
            data: { label: 'Tra cước GHTK Express', description: 'Truy vấn API biểu phí dịch vụ GHTK realtime', category: 'LOGISTICS' },
          },
          {
            id: 'node_par_ghn',
            type: 'action',
            position: { x: 560, y: 280 },
            data: { label: 'Tra cước GHN Nhanh', description: 'Truy vấn API biểu phí dịch vụ GHN realtime', category: 'LOGISTICS' },
          },
          {
            id: 'node_par_vtp',
            type: 'action',
            position: { x: 560, y: 460 },
            data: { label: 'Tra cước Viettel Post', description: 'Truy vấn API biểu phí dịch vụ Viettel Post realtime', category: 'LOGISTICS' },
          },
          // ── AI Quyết định (tổng hợp 3 báo giá) ───────────────────────────────
          {
            id: 'node_par_ai_pick',
            type: 'ai',
            position: { x: 850, y: 280 },
            data: {
              label: 'AI So sánh cước & Chọn hãng rẻ nhất',
              description: 'Tự động phân tích báo giá 3 hãng để chọn hãng có cước thấp nhất',
              model: 'RATE_OPTIMIZER_AI',
            },
          },
          // ── Nút Rẽ nhánh theo kết quả AI ──────────────────────────────────────
          {
            id: 'node_par_branch',
            type: 'action',
            position: { x: 1130, y: 280 },
            data: {
              label: 'Rẽ nhánh: Tạo đơn theo Hãng được chọn',
              description: 'Định tuyến luồng theo kết quả AI quyết định',
              category: 'LOGIC',
            },
          },
          // ── Trừ kho POS (1 node dùng chung) ──────────────────────────────────
          {
            id: 'node_par_pos',
            type: 'action',
            position: { x: 1410, y: 100 },
            data: { label: 'Trừ tồn kho Sapo POS', description: 'Kho Tổng Hà Nội (WH_MAIN_HN)', category: 'POS' },
          },
          // ── 3 Nhánh tạo đơn — chỉ 1 trong 3 sẽ được kích hoạt ────────────────
          {
            id: 'node_par_mk_ghtk',
            type: 'action',
            position: { x: 1410, y: 240 },
            data: { label: 'Tạo vận đơn GHTK Express', description: 'Kích hoạt khi GHTK có giá cước tối ưu nhất', category: 'LOGISTICS' },
          },
          {
            id: 'node_par_mk_ghn',
            type: 'action',
            position: { x: 1410, y: 360 },
            data: { label: 'Tạo vận đơn GHN Nhanh', description: 'Kích hoạt khi GHN có giá cước tối ưu nhất', category: 'LOGISTICS' },
          },
          {
            id: 'node_par_mk_vtp',
            type: 'action',
            position: { x: 1410, y: 480 },
            data: { label: 'Tạo vận đơn Viettel Post', description: 'Kích hoạt khi Viettel Post có giá cước tối ưu nhất', category: 'LOGISTICS' },
          },
          // ── Thông báo kết quả (dùng chung) ────────────────────────────────────
          {
            id: 'node_par_notify',
            type: 'action',
            position: { x: 1720, y: 290 },
            data: { label: 'Thông báo Telegram Bot', description: 'Báo cáo: Hãng được chọn + Mã vận đơn + Mức tiết kiệm', category: 'NOTIFY' },
          },
        ],
        edges: [
          { id: 'e_par_1-2', source: 'node_par_trig', target: 'node_par_ai_sku', animated: true, style: { stroke: '#EE4D2D', strokeWidth: 2 }, data: { label: 'Dữ liệu đơn hàng' } },
          // SKU Mapper rẽ 3 nhánh đồng thời gọi API báo giá
          { id: 'e_par_2-ghtk', source: 'node_par_ai_sku', target: 'node_par_ghtk', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 }, data: { label: 'Tra cước GHTK' } },
          { id: 'e_par_2-ghn', source: 'node_par_ai_sku', target: 'node_par_ghn', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 }, data: { label: 'Tra cước GHN' } },
          { id: 'e_par_2-vtp', source: 'node_par_ai_sku', target: 'node_par_vtp', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 }, data: { label: 'Tra cước Viettel Post' } },
          // Cả 3 báo giá hội tụ vào AI Quyết định
          { id: 'e_par_ghtk-pick', source: 'node_par_ghtk', target: 'node_par_ai_pick', animated: true, style: { stroke: '#10B981', strokeWidth: 2 }, data: { label: 'Báo giá GHTK' } },
          { id: 'e_par_ghn-pick', source: 'node_par_ghn', target: 'node_par_ai_pick', animated: true, style: { stroke: '#10B981', strokeWidth: 2 }, data: { label: 'Báo giá GHN' } },
          { id: 'e_par_vtp-pick', source: 'node_par_vtp', target: 'node_par_ai_pick', animated: true, style: { stroke: '#10B981', strokeWidth: 2 }, data: { label: 'Báo giá Viettel Post' } },
          // AI Quyết định → Node Rẽ nhánh điều kiện
          { id: 'e_par_pick-branch', source: 'node_par_ai_pick', target: 'node_par_branch', animated: true, style: { stroke: '#EC4899', strokeWidth: 2.5 }, data: { label: 'Quyết định chọn hãng' } },
          // Rẽ nhánh → Trừ kho + Tạo đơn đúng hãng (3 nhánh độc lập)
          { id: 'e_par_br-pos', source: 'node_par_branch', target: 'node_par_pos', animated: true, style: { stroke: '#D97706', strokeWidth: 2 }, data: { label: 'Lệnh trừ tồn kho' } },
          { id: 'e_par_br-mk-ghtk', source: 'node_par_branch', target: 'node_par_mk_ghtk', animated: true, style: { stroke: '#059669', strokeWidth: 2 }, data: { label: 'Nếu GHTK rẻ nhất', conditionExpr: '{{ $json.selectedCarrier == "GHTK" }}' } },
          { id: 'e_par_br-mk-ghn', source: 'node_par_branch', target: 'node_par_mk_ghn', animated: true, style: { stroke: '#059669', strokeWidth: 2 }, data: { label: 'Nếu GHN rẻ nhất', conditionExpr: '{{ $json.selectedCarrier == "GHN" }}' } },
          { id: 'e_par_br-mk-vtp', source: 'node_par_branch', target: 'node_par_mk_vtp', animated: true, style: { stroke: '#059669', strokeWidth: 2 }, data: { label: 'Nếu VTP rẻ nhất', conditionExpr: '{{ $json.selectedCarrier == "VIETTEL_POST" }}' } },
          // Cả 3 nhánh tạo đơn đều tổng hợp về Telegram thông báo
          { id: 'e_par_ghtk-not', source: 'node_par_mk_ghtk', target: 'node_par_notify', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 }, data: { label: 'Thông báo kết quả' } },
          { id: 'e_par_ghn-not', source: 'node_par_mk_ghn', target: 'node_par_notify', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 }, data: { label: 'Thông báo kết quả' } },
          { id: 'e_par_vtp-not', source: 'node_par_mk_vtp', target: 'node_par_notify', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 }, data: { label: 'Thông báo kết quả' } },
        ],
        viewport: { x: 0, y: 0, zoom: 0.75 },
        executionCount: 12400,
        updatedAt: new Date(),
      },


      // ── TRƯỜNG HỢP 5: KHÔNG GOM NHÓM - PHÂN LUỒNG HÀNG NẶNG > 5KG ─────────
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f6000e'),
        tenantId: tenant1Id,
        name: 'So sánh cước hàng nặng (> 5kg) & Ưu tiên Viettel Post Vận Tải Nặng',
        description: 'Tự động kiểm tra trọng lượng gói hàng, đơn hàng nặng chuyển tuyến Viettel Post tiết kiệm 35% chi phí vận chuyển',
        isActive: false,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_hvy_trig',
            type: 'trigger',
            position: { x: 50, y: 160 },
            data: { label: 'TikTok Shop Webhook', description: 'Đơn hàng mới tạo' },
          },
          {
            id: 'node_hvy_ai_sku',
            type: 'ai',
            position: { x: 330, y: 160 },
            data: { label: 'AI Hybrid SKU Mapper', description: 'Bóc tách NER trọng lượng gói hàng' },
          },
          {
            id: 'node_hvy_branch',
            type: 'action',
            position: { x: 610, y: 160 },
            data: { label: 'Rẽ nhánh theo trọng lượng', description: 'Điều kiện: Khối lượng > 5.000g', category: 'LOGIC' },
          },
          {
            id: 'node_hvy_vtp',
            type: 'action',
            position: { x: 910, y: 60 },
            data: { label: 'Tạo đơn Viettel Post', description: 'Gói Vận Tải Nặng (Tiết kiệm 35%)', category: 'LOGISTICS' },
          },
          {
            id: 'node_hvy_ghtk',
            type: 'action',
            position: { x: 910, y: 260 },
            data: { label: 'Tạo vận đơn GHTK', description: 'Gói Tiết Kiệm tiêu chuẩn (< 5kg)', category: 'LOGISTICS' },
          },
          {
            id: 'node_hvy_pos',
            type: 'action',
            position: { x: 1210, y: 160 },
            data: { label: 'Trừ tồn kho Sapo POS', description: 'Kho Tổng Hà Nội', category: 'POS' },
          },
          {
            id: 'node_hvy_notify',
            type: 'action',
            position: { x: 1490, y: 160 },
            data: { label: 'Thông báo Telegram Bot', description: 'Báo cáo phân tuyến vận tải nặng', category: 'NOTIFY' },
          },
        ],
        edges: [
          { id: 'e_hvy_1-2', source: 'node_hvy_trig', target: 'node_hvy_ai_sku', animated: true, style: { stroke: '#ed1c24', strokeWidth: 2 } },
          { id: 'e_hvy_2-3', source: 'node_hvy_ai_sku', target: 'node_hvy_branch', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 } },
          { id: 'e_hvy_3-4a', source: 'node_hvy_branch', target: 'node_hvy_vtp', animated: true, style: { stroke: '#EC4899', strokeWidth: 2 } },
          { id: 'e_hvy_3-4b', source: 'node_hvy_branch', target: 'node_hvy_ghtk', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 } },
          { id: 'e_hvy_4a-5', source: 'node_hvy_vtp', target: 'node_hvy_pos', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
          { id: 'e_hvy_4b-5', source: 'node_hvy_ghtk', target: 'node_hvy_pos', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
          { id: 'e_hvy_5-6', source: 'node_hvy_pos', target: 'node_hvy_notify', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } },
        ],
        viewport: { x: 0, y: 0, zoom: 0.85 },
        executionCount: 5670,
        updatedAt: new Date(),
      },

      // ── TRƯỜNG HỢP 6: KHÔNG GOM NHÓM - PHÂN LUỒNG ĐƠN VIP ────────────────
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f6000a'),
        tenantId: tenant1Id,
        name: 'Phân luồng đơn VIP đa kênh (Đơn >= 1.000.000đ đi Kho VIP & Viettel Post Hỏa Tốc)',
        description: 'Tự động phân nhánh: Đơn VIP đi kho trung tâm & Viettel Post Hỏa Tốc, đơn thường đi GHTK Chuẩn',
        isActive: true,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_vip_trig',
            type: 'trigger',
            position: { x: 50, y: 160 },
            data: { label: 'TikTok Shop Inbound', description: 'Đơn hàng mới đa kênh' },
          },
          {
            id: 'node_vip_ai',
            type: 'ai',
            position: { x: 330, y: 160 },
            data: { label: 'AI Hybrid SKU Mapper', description: 'Phân tích NER & Giá trị đơn hàng' },
          },
          {
            id: 'node_vip_branch',
            type: 'action',
            position: { x: 610, y: 160 },
            data: { label: 'Rẽ nhánh theo giá trị đơn', description: 'Điều kiện: Tổng tiền >= 1.000.000đ', category: 'LOGIC' },
          },
          {
            id: 'node_vip_pos_vip',
            type: 'action',
            position: { x: 910, y: 50 },
            data: { label: 'Trừ kho VIP Premium', description: 'Kho Tổng VIP (WH_HN_VIP)', category: 'POS' },
          },
          {
            id: 'node_vip_ship_vtp',
            type: 'action',
            position: { x: 1190, y: 50 },
            data: { label: 'Tạo đơn Viettel Post Hỏa Tốc', description: 'Giao hỏa tốc 4H (Kèm quà tặng VIP)', category: 'LOGISTICS' },
          },
          {
            id: 'node_vip_pos_std',
            type: 'action',
            position: { x: 910, y: 270 },
            data: { label: 'Trừ tồn kho Sapo POS', description: 'Kho Cầu Giấy (WH_HN_CG)', category: 'POS' },
          },
          {
            id: 'node_vip_ship_ghtk',
            type: 'action',
            position: { x: 1190, y: 270 },
            data: { label: 'Tạo vận đơn GHTK', description: 'Gói Tiết Kiệm tiêu chuẩn', category: 'LOGISTICS' },
          },
          {
            id: 'node_vip_notify',
            type: 'action',
            position: { x: 1470, y: 50 },
            data: { label: 'Thông báo Telegram Bot', description: 'Bắn tin cảnh báo đơn VIP tới Founder/CSKH', category: 'NOTIFY' },
          },
        ],
        edges: [
          { id: 'e_vip_1-2', source: 'node_vip_trig', target: 'node_vip_ai', animated: true, style: { stroke: '#ed1c24', strokeWidth: 2 } },
          { id: 'e_vip_2-3', source: 'node_vip_ai', target: 'node_vip_branch', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 } },
          { id: 'e_vip_3-4a', source: 'node_vip_branch', target: 'node_vip_pos_vip', animated: true, style: { stroke: '#EC4899', strokeWidth: 2 } },
          { id: 'e_vip_4a-5a', source: 'node_vip_pos_vip', target: 'node_vip_ship_vtp', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
          { id: 'e_vip_5a-6', source: 'node_vip_ship_vtp', target: 'node_vip_notify', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } },
          { id: 'e_vip_3-4b', source: 'node_vip_branch', target: 'node_vip_pos_std', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 } },
          { id: 'e_vip_4b-5b', source: 'node_vip_pos_std', target: 'node_vip_ship_ghtk', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
        ],
        viewport: { x: 0, y: 0, zoom: 0.85 },
        executionCount: 8420,
        updatedAt: new Date(),
      },

      // ── TRƯỜNG HỢP 7: KHÔNG GOM NHÓM - CHỐNG BÁN ÂM TỨC THÌ ĐA SÀN ────────
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f6000b'),
        tenantId: tenant1Id,
        name: 'AI Bảo vệ kho an toàn (Chống bán âm tức thì TikTok + Shopee + Lazada + Sapo)',
        description: 'Khi phát sinh đơn hàng, AI tự động tính toán tồn khả dụng và khóa tồn tức thì trên 3 sàn TMĐT & Sapo trong 50ms',
        isActive: true,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_safe_trig',
            type: 'trigger',
            position: { x: 50, y: 180 },
            data: { label: 'TikTok Shop Webhook', description: 'Phát sinh đơn hàng Mega Sale' },
          },
          {
            id: 'node_safe_ai',
            type: 'ai',
            position: { x: 330, y: 180 },
            data: { label: 'AI đồng bộ tồn kho an toàn', description: 'Tính toán tồn khả dụng & Khóa tồn 0-chậm' },
          },
          {
            id: 'node_safe_sapo',
            type: 'action',
            position: { x: 630, y: 60 },
            data: { label: 'Trừ tồn kho Sapo POS', description: 'Kho Tổng Hà Nội', category: 'POS' },
          },
          {
            id: 'node_safe_shopee',
            type: 'action',
            position: { x: 630, y: 180 },
            data: { label: 'Đồng bộ Haravan ERP', description: 'Ghi nhận hóa đơn xuất kho tức thì', category: 'POS' },
          },
          {
            id: 'node_safe_ship',
            type: 'action',
            position: { x: 630, y: 300 },
            data: { label: 'Tạo đơn GHN Nhanh', description: 'Tự động in vận đơn A6', category: 'LOGISTICS' },
          },
          {
            id: 'node_safe_zalo',
            type: 'action',
            position: { x: 930, y: 180 },
            data: { label: 'Gửi tin Zalo ZNS', description: 'Thông báo xác nhận đơn & mã tracking', category: 'NOTIFY' },
          },
        ],
        edges: [
          { id: 'e_safe_1-2', source: 'node_safe_trig', target: 'node_safe_ai', animated: true, style: { stroke: '#ed1c24', strokeWidth: 2 } },
          { id: 'e_safe_2-3', source: 'node_safe_ai', target: 'node_safe_sapo', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 } },
          { id: 'e_safe_2-4', source: 'node_safe_ai', target: 'node_safe_shopee', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 } },
          { id: 'e_safe_2-5', source: 'node_safe_ai', target: 'node_safe_ship', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
          { id: 'e_safe_5-6', source: 'node_safe_ship', target: 'node_safe_zalo', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } },
        ],
        viewport: { x: 0, y: 0, zoom: 0.9 },
        executionCount: 35120,
        updatedAt: new Date(),
      },

      // ── TRƯỜNG HỢP 8: KHÔNG GOM NHÓM - AI tự phục hồi LỖI ĐVVC ──────────
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f6000c'),
        tenantId: tenant1Id,
        name: 'AI tự phục hồi lỗi ĐVVC & Tự động chuyển tuyến dự phòng (GHTK ➔ GHN ➔ Viettel Post)',
        description: 'Tự động bắt lỗi API nghẽn mạng hoặc quá tải SLA của đơn vị vận chuyển chính và điều phối sang hãng dự phòng',
        isActive: true,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_heal_trig',
            type: 'trigger',
            position: { x: 50, y: 160 },
            data: { label: 'Shopee Push Webhook', description: 'Đơn hàng READY_TO_SHIP' },
          },
          {
            id: 'node_heal_ai_sku',
            type: 'ai',
            position: { x: 340, y: 160 },
            data: { label: 'AI Hybrid SKU Mapper', description: 'So khớp SKU Master' },
          },
          {
            id: 'node_heal_ai_router',
            type: 'ai',
            position: { x: 630, y: 160 },
            data: { label: 'AI tự phục hồi & Định tuyến', description: 'Tự phục hồi lỗi API & Điều phối tuyến dự phòng' },
          },
          {
            id: 'node_heal_pos',
            type: 'action',
            position: { x: 920, y: 60 },
            data: { label: 'Trừ kho KiotViet', description: 'Chi nhánh Cầu Giấy', category: 'POS' },
          },
          {
            id: 'node_heal_ship',
            type: 'action',
            position: { x: 920, y: 260 },
            data: { label: 'Tạo đơn GHN Nhanh', description: 'Tuyến dự phòng tự động kích hoạt', category: 'LOGISTICS' },
          },
          {
            id: 'node_heal_notify',
            type: 'action',
            position: { x: 1210, y: 160 },
            data: { label: 'Thông báo Telegram Bot', description: 'Báo cáo lỗi đã được tự phục hồi', category: 'NOTIFY' },
          },
        ],
        edges: [
          { id: 'e_heal_1-2', source: 'node_heal_trig', target: 'node_heal_ai_sku', animated: true, style: { stroke: '#EE4D2D', strokeWidth: 2 } },
          { id: 'e_heal_2-3', source: 'node_heal_ai_sku', target: 'node_heal_ai_router', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 } },
          { id: 'e_heal_3-4', source: 'node_heal_ai_router', target: 'node_heal_pos', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 } },
          { id: 'e_heal_3-5', source: 'node_heal_ai_router', target: 'node_heal_ship', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
          { id: 'e_heal_5-6', source: 'node_heal_ship', target: 'node_heal_notify', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } },
        ],
        viewport: { x: 0, y: 0, zoom: 0.9 },
        executionCount: 16890,
        updatedAt: new Date(),
      },

      // ── TRƯỜNG HỢP 9: KHÔNG GOM NHÓM - THU THẬP ĐƠN LADIPAGE SANG GG SHEETS
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f6001b'),
        tenantId: tenant1Id,
        name: 'Thu thập đơn LadiPage Form ➔ AI chuẩn hóa ➔ Xuất Google Sheets & Gửi Zalo ZNS',
        description: 'Bắt form mua hàng từ LadiPage, AI chuẩn hóa địa chỉ bưu cục, ghi vào Google Sheet tự động và bắn tin Zalo',
        isActive: false,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_ladi_trig',
            type: 'trigger',
            position: { x: 50, y: 160 },
            data: { label: 'LadiPage Form Webhook', description: 'Khách submit form mua sắm' },
          },
          {
            id: 'node_ladi_ai',
            type: 'ai',
            position: { x: 340, y: 160 },
            data: { label: 'AI Chuẩn hóa Địa chỉ & SĐT', description: 'Map chuẩn Phường/Xã/Quận/Tỉnh' },
          },
          {
            id: 'node_ladi_sheet',
            type: 'action',
            position: { x: 640, y: 60 },
            data: { label: 'Ghi vào Google Sheets', description: 'Sheet: Don_Hang_LadiPage_2026', category: 'POS' },
          },
          {
            id: 'node_ladi_ship',
            type: 'action',
            position: { x: 640, y: 260 },
            data: { label: 'Tạo đơn Viettel Post', description: 'Gói Tiêu Chuẩn COD', category: 'LOGISTICS' },
          },
          {
            id: 'node_ladi_zns',
            type: 'action',
            position: { x: 940, y: 160 },
            data: { label: 'Gửi tin nhắn Zalo ZNS', description: 'Gửi mã đơn & mã bưu gửi cho khách', category: 'NOTIFY' },
          },
        ],
        edges: [
          { id: 'e_ladi_1-2', source: 'node_ladi_trig', target: 'node_ladi_ai', animated: true, style: { stroke: '#2563EB', strokeWidth: 2 } },
          { id: 'e_ladi_2-3', source: 'node_ladi_ai', target: 'node_ladi_sheet', animated: true, style: { stroke: '#107C41', strokeWidth: 2 } },
          { id: 'e_ladi_2-4', source: 'node_ladi_ai', target: 'node_ladi_ship', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
          { id: 'e_ladi_4-5', source: 'node_ladi_ship', target: 'node_ladi_zns', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } },
        ],
        viewport: { x: 0, y: 0, zoom: 0.9 },
        executionCount: 6890,
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
            data: { label: 'TikTok Shop Webhook', description: 'Đơn chốt trực tiếp trên phiên Live' },
          },
          {
            id: 'node_gl_ai_2',
            type: 'ai',
            position: { x: 400, y: 150 },
            data: { label: 'AI Hybrid SKU Mapper', description: 'Khớp Combo quà tặng & Mã sản phẩm' },
          },
          {
            id: 'node_gl_kv_3',
            type: 'action',
            position: { x: 740, y: 60 },
            data: { label: 'Trừ tồn kho KiotViet', description: 'Kho: WH_BEAUTY_HCM', category: 'POS' },
          },
          {
            id: 'node_gl_ghn_4',
            type: 'action',
            position: { x: 740, y: 250 },
            data: { label: 'Tạo đơn GHN Nhanh', description: 'Giao trong ngày 4H HCM', category: 'LOGISTICS' },
          },
        ],
        edges: [
          { id: 'e_gl_1-2', source: 'node_gl_1', target: 'node_gl_ai_2', animated: true, style: { stroke: '#ed1c24', strokeWidth: 2 } },
          { id: 'e_gl_2-3', source: 'node_gl_ai_2', target: 'node_gl_kv_3', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 } },
          { id: 'e_gl_2-4', source: 'node_gl_ai_2', target: 'node_gl_ghn_4', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
        ],
        viewport: { x: 0, y: 0, zoom: 1 },
        executionCount: 19680,
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f60021'),
        tenantId: tenant2Id,
        name: 'Website Mỹ Phẩm WooCommerce ➔ Odoo ERP ➔ Tạo đơn J&T Express',
        description: 'Đồng bộ tự động đơn hàng từ website WordPress/WooCommerce sang Odoo ERP và xuất vận đơn J&T',
        isActive: true,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_wc_trig',
            type: 'trigger',
            position: { x: 60, y: 150 },
            data: { label: 'WooCommerce Webhook', description: 'Đơn hàng mới từ Website Brand' },
          },
          {
            id: 'node_wc_ai',
            type: 'ai',
            position: { x: 380, y: 150 },
            data: { label: 'AI Hybrid SKU Mapper', description: 'Chuẩn hóa địa chỉ & SKU Mỹ phẩm' },
          },
          {
            id: 'node_wc_odoo',
            type: 'action',
            position: { x: 700, y: 60 },
            data: { label: 'Đồng bộ Odoo Enterprise', description: 'Tạo SO & Trừ kho Odoo ERP', category: 'POS' },
          },
          {
            id: 'node_wc_jt',
            type: 'action',
            position: { x: 700, y: 250 },
            data: { label: 'Tạo đơn J&T Express', description: 'Giao hàng tiêu chuẩn', category: 'LOGISTICS' },
          },
        ],
        edges: [
          { id: 'e_wc_1-2', source: 'node_wc_trig', target: 'node_wc_ai', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 } },
          { id: 'e_wc_2-3', source: 'node_wc_ai', target: 'node_wc_odoo', animated: true, style: { stroke: '#fcc20f', strokeWidth: 2 } },
          { id: 'e_wc_2-4', source: 'node_wc_ai', target: 'node_wc_jt', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
        ],
        viewport: { x: 0, y: 0, zoom: 1 },
        executionCount: 11450,
        updatedAt: new Date(),
      },

      // ── TRƯỜNG HỢP 12: KẾ TOÁN & KÊ KHAI THUẾ MISA AMIS & meINVOICE ───────
      {
        _id: new ObjectId('66c0e812a1b2c3d4e5f60022'),
        tenantId: tenant1Id,
        name: 'Kế toán & Kê khai thuế tự động: Xuất HĐĐT MISA meInvoice & Ghi nhận sổ cái MISA AMIS',
        description: 'Tự động bóc tách doanh thu sạch theo NĐ 117/2025/NĐ-CP, tính thuế GTGT/TNCN, xuất hóa đơn VAT MISA meInvoice và hạch toán phiếu thu sổ cái MISA AMIS',
        isActive: true,
        triggerType: 'WEBHOOK',
        nodes: [
          {
            id: 'node_tax_trig',
            type: 'trigger',
            position: { x: 40, y: 170 },
            data: { label: 'Đơn hàng Giao Thành Công', description: 'Trạng thái DELIVERED & Đã đối soát COD' },
          },
          {
            id: 'node_tax_ai',
            type: 'ai',
            position: { x: 320, y: 170 },
            data: { label: 'AI UDM Phân tách Thuế & Doanh thu', description: 'Tự động tính Thuế GTGT 1% & TNCN 0.5% (TT 40/2021/TT-BTC)' },
          },
          // Cụm phân vùng gom nhóm Kế toán & Hóa đơn
          {
            id: 'node_tax_group',
            type: 'group',
            position: { x: 600, y: 30 },
            style: { width: 600, height: 280, zIndex: -1 },
            data: {
              label: 'Cụm Kế toán MISA AMIS & Hóa đơn VAT meInvoice',
              subtitle: '⚡ Chuẩn hóa hạch toán & Xuất hóa đơn VAT điện tử tự động',
              childCount: 3,
              width: 600,
              height: 280,
              isExpanded: true,
            },
          },
          {
            id: 'node_sub_meinv',
            type: 'action',
            parentId: 'node_tax_group',
            extent: 'parent',
            position: { x: 30, y: 70 },
            zIndex: 10,
            data: { label: 'Xuất HĐĐT MISA meInvoice', description: 'Ký số và gửi email hóa đơn VAT cho khách', category: 'ACCOUNTING' },
          },
          {
            id: 'node_sub_amis',
            type: 'action',
            parentId: 'node_tax_group',
            extent: 'parent',
            position: { x: 30, y: 165 },
            zIndex: 10,
            data: { label: 'Ghi nhận sổ cái MISA AMIS', description: 'Hạch toán Nợ TK 112 / Có TK 511, 3331', category: 'ACCOUNTING' },
          },
          {
            id: 'node_sub_audit',
            type: 'action',
            parentId: 'node_tax_group',
            extent: 'parent',
            position: { x: 310, y: 115 },
            zIndex: 10,
            data: { label: 'Đối soát công nợ Fast Accounting', description: 'Khớp số dư COD ngân hàng Vietcombank', category: 'ACCOUNTING' },
          },
          {
            id: 'node_tax_sheet',
            type: 'action',
            position: { x: 1260, y: 170 },
            data: { label: 'Ghi Tờ khai Thuế Excel / GG Sheet', description: 'Mẫu 01/GTGT & Bảng kê xuất nhập tồn', category: 'POS' },
          },
          {
            id: 'node_tax_notify',
            type: 'action',
            position: { x: 1540, y: 170 },
            data: { label: 'Thông báo Kế toán Trưởng', description: 'Telegram Bot báo cáo thuế & biên lai đã ký', category: 'NOTIFY' },
          },
        ],
        edges: [
          { id: 'e_tax_1-2', source: 'node_tax_trig', target: 'node_tax_ai', animated: true, style: { stroke: '#0284C7', strokeWidth: 2 }, data: { label: 'Đơn hàng hoàn tất' } },
          { id: 'e_tax_2-meinv', source: 'node_tax_ai', target: 'node_sub_meinv', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 }, data: { label: 'Doanh thu chịu thuế' } },
          { id: 'e_tax_2-amis', source: 'node_tax_ai', target: 'node_sub_amis', animated: true, style: { stroke: '#8B5CF6', strokeWidth: 2 }, data: { label: 'Bút toán hạch toán' } },
          { id: 'e_tax_meinv-audit', source: 'node_sub_meinv', target: 'node_sub_audit', animated: true, style: { stroke: '#0284C7', strokeWidth: 2 }, zIndex: 20, data: { isInternal: true, label: 'Mã HĐĐT ký số' } },
          { id: 'e_tax_amis-audit', source: 'node_sub_amis', target: 'node_sub_audit', animated: true, style: { stroke: '#0284C7', strokeWidth: 2 }, zIndex: 20, data: { isInternal: true, label: 'Phiếu thu sổ cái' } },
          { id: 'e_tax_audit-sheet', source: 'node_sub_audit', target: 'node_tax_sheet', animated: true, style: { stroke: '#107C41', strokeWidth: 2 }, data: { label: 'Bảng kê đối soát' } },
          { id: 'e_tax_sheet-not', source: 'node_tax_sheet', target: 'node_tax_notify', animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 }, data: { label: 'Báo cáo thuế tự động' } },
        ],
        viewport: { x: 0, y: 0, zoom: 0.85 },
        executionCount: 31240,
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
    console.log(`2. Đã nạp ${workflows.length} Workflows Canvas phân tầng cho 2 Tenant.`);

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
    console.log(`3. Đã nạp ${skuMappings.length} SKU Mappings phân biệt cho cả 2 ngành hàng.`);

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
        message: 'Đơn TikTok #TTS_88921045 -> Khớp SKU AI (98.5%) -> Trừ kho Sapo -> Tạo vận đơn GHTK (198ms)',
        aiHealed: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 2),
      },
      {
        tenantId: tenant1Id,
        platform: 'SHOPEE',
        sourceOrderId: 'SP_24081899120',
        status: 'AUTO_HEALED',
        durationMs: 412,
        message: 'AI Auto-Healed: GHN Server Timeout (504) -> Reroute sang GHTK (Tiết kiệm 4,500đ)',
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
        message: 'Đơn TikTok Live #TTS_GLOW_991823 -> Khớp Combo Serum B5 -> Trừ kho KiotViet -> Bàn giao GHN Hỏa Tốc (172ms)',
        aiHealed: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 1),
      },
      {
        tenantId: tenant2Id,
        platform: 'SHOPEE',
        sourceOrderId: 'SP_GLOW_551920',
        status: 'COMPLETED',
        durationMs: 185,
        message: 'Đơn Shopee Mall #SP_GLOW_551920 -> Khớp Kem Chống Nắng Centella -> Trừ tồn Sapo -> In mã vận đơn GHN',
        aiHealed: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 8),
      },
    ];

    for (const log of syncLogs) {
      await db.collection('sync_event_logs').insertOne(log);
    }
    console.log(`4. Đã nạp ${syncLogs.length} Sync Logs thực tế vào MongoDB Atlas.`);

    // ══════════════════════════════════════════════════════════════════════════
    // 5. SEED CONNECTORS IN DB
    // ══════════════════════════════════════════════════════════════════════════
    const connectorsList = [
      { connectorId: 'tiktok', name: 'TikTok Shop', category: 'MARKETPLACE', status: 'CONNECTED', ordersSynced: 28450, latencyMs: 185, latency: '185ms' },
      { connectorId: 'shopee', name: 'Shopee Open Platform', category: 'MARKETPLACE', status: 'CONNECTED', ordersSynced: 14220, latencyMs: 210, latency: '210ms' },
      { connectorId: 'lazada', name: 'Lazada Open API', category: 'MARKETPLACE', status: 'DISCONNECTED', ordersSynced: 5180, latencyMs: 230, latency: '230ms' },
      { connectorId: 'pancake', name: 'Pancake POS & Social Chat', category: 'CHAT_SOCIAL', status: 'CONNECTED', ordersSynced: 31200, latencyMs: 110, latency: '110ms' },
      { connectorId: 'zalo', name: 'Zalo OA & ZNS Notification', category: 'CHAT_SOCIAL', status: 'CONNECTED', ordersSynced: 15400, latencyMs: 95, latency: '95ms' },
      { connectorId: 'telegram', name: 'Telegram Bot Webhook', category: 'CHAT_SOCIAL', status: 'CONNECTED', ordersSynced: 42300, latencyMs: 80, latency: '80ms' },
      { connectorId: 'sapo', name: 'Sapo POS & Omnichannel', category: 'POS_ERP', status: 'CONNECTED', ordersSynced: 38900, latencyMs: 145, latency: '145ms' },
      { connectorId: 'kiotviet', name: 'KiotViet Retail API', category: 'POS_ERP', status: 'CONNECTED', ordersSynced: 19800, latencyMs: 160, latency: '160ms' },
      { connectorId: 'nhanh', name: 'Nhanh.vn Omnichannel POS', category: 'POS_ERP', status: 'CONNECTED', ordersSynced: 12600, latencyMs: 170, latency: '170ms' },
      { connectorId: 'haravan', name: 'Haravan Omnichannel', category: 'POS_ERP', status: 'DISCONNECTED', ordersSynced: 3400, latencyMs: 190, latency: '190ms' },
      { connectorId: 'ladipage', name: 'LadiPage Form Inbound', category: 'LANDING_PAGE', status: 'CONNECTED', ordersSynced: 8700, latencyMs: 85, latency: '85ms' },
      { connectorId: 'ghtk', name: 'Giao Hàng Tiết Kiệm (GHTK)', category: 'LOGISTICS', status: 'CONNECTED', ordersSynced: 26100, latencyMs: 175, latency: '175ms' },
      { connectorId: 'ghn', name: 'Giao Hàng Nhanh (GHN Express)', category: 'LOGISTICS', status: 'CONNECTED', ordersSynced: 18400, latencyMs: 165, latency: '165ms' },
      { connectorId: 'viettelpost', name: 'Viettel Post API v2', category: 'LOGISTICS', status: 'CONNECTED', ordersSynced: 14500, latencyMs: 195, latency: '195ms' },
      { connectorId: 'googlesheets', name: 'Google Sheets Live Sync', category: 'SPREADSHEET', status: 'CONNECTED', ordersSynced: 16400, latencyMs: 120, latency: '120ms' },
      { connectorId: 'excel', name: 'Microsoft Excel / CSV Engine', category: 'SPREADSHEET', status: 'CONNECTED', ordersSynced: 9200, latencyMs: 95, latency: '95ms' },
      { connectorId: 'misa_amis', name: 'MISA AMIS Kế toán', category: 'ACCOUNTING', status: 'CONNECTED', ordersSynced: 4820, latencyMs: 140, latency: '140ms' },
      { connectorId: 'misa_meinvoice', name: 'MISA meInvoice (Hóa đơn điện tử)', category: 'ACCOUNTING', status: 'CONNECTED', ordersSynced: 3120, latencyMs: 155, latency: '155ms' },
    ];

    for (const c of connectorsList) {
      await db.collection('connectors').updateOne(
        { tenantId: tenant1Id.toString(), connectorId: c.connectorId },
        {
          $set: {
            tenantId: tenant1Id.toString(),
            ...c,
            config: {
              appKey: `app_${c.connectorId}_live_key`,
              appSecret: `sec_${c.connectorId}_live_secret`,
              endpoint: `https://api.${c.connectorId}.vn`,
            },
            lastSyncedAt: new Date(),
            lastTestedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
    }
    console.log(`5. Đã nạp ${connectorsList.length} Cổng kết nối đối tác vào MongoDB Atlas.`);

    console.log('\n🎉 HOÀN TẤT NẠP DỮ LIỆU ĐA TENANT THỰC TẾ VÀO DATABASE PTIT_Aka! ✅');
  } catch (err) {
    console.error('❌ Lỗi khi nạp dữ liệu:', err.message);
  } finally {
    await client.close();
  }
}

seed();
