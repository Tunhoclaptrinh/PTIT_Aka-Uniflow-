/**
 * MongoDB Initialization Script for UniFlow AI
 * Tự động tạo collections và compound indexes tối ưu hiệu năng và tính toàn vẹn dữ liệu
 */

db = db.getSiblingDB('uniflow_db');

print('>>> Bắt đầu khởi tạo Collections & Indexes cho UniFlow AI...');

// 1. Collection: tenants
db.createCollection('tenants');
db.tenants.createIndex({ subdomain: 1 }, { unique: true });
db.tenants.createIndex({ isActive: 1 });

// 2. Collection: users
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ tenantId: 1 });

// 3. Collection: workflows
db.createCollection('workflows');
db.workflows.createIndex({ tenantId: 1, isActive: 1 });
db.workflows.createIndex({ tenantId: 1, triggerType: 1 });

// 4. Collection: sku_mappings
db.createCollection('sku_mappings');
// Compound Index duy nhất: Đảm bảo không trùng lặp mapping của 1 SKU sàn trên 1 tenant
db.sku_mappings.createIndex(
  { tenantId: 1, sourcePlatform: 1, sourceSkuCode: 1 },
  { unique: true }
);
db.sku_mappings.createIndex({ tenantId: 1, mappingStatus: 1 });
db.sku_mappings.createIndex({ tenantId: 1, confidenceScore: -1 });

// 5. Collection: sync_event_logs
db.createCollection('sync_event_logs');
db.sync_event_logs.createIndex({ tenantId: 1, createdAt: -1 });
db.sync_event_logs.createIndex({ tenantId: 1, sourceOrderId: 1 });
db.sync_event_logs.createIndex({ tenantId: 1, status: 1 });
// TTL Index: Tự động dọn dẹp log sau 90 ngày (7,776,000 giây)
db.sync_event_logs.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 7776000 }
);

print('>>> Khởi tạo Collections & Indexes hoàn tất thành công! ✅');
