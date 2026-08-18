# **UNIFLOW AI — ĐẶC TẢ CƠ SỞ DỮ LIỆU & CHUẨN DỮ LIỆU TOÀN NĂNG (DATABASE SCHEMA & UDM SPEC)**

> **Tài liệu thuộc Phân hệ Kỹ thuật:** Đặc tả chiến lược cơ sở dữ liệu 2 giai đoạn (**Giai đoạn 1: MongoDB** tối ưu tốc độ phát triển MVP nhanh chóng $\rightarrow$ **Giai đoạn 2: PostgreSQL RLS** mở rộng quy mô Enterprise), cấu trúc khóa Redis In-Memory, và chuẩn dữ liệu thống nhất Universal Data Model (UDM).

---

## **PHẦN I: CHIẾN LƯỢC CƠ SỞ DỮ LIỆU 2 GIAI ĐOẠN (DATABASE EVOLUTION STRATEGY)**

Nhằm cân bằng giữa **tốc độ ra mắt sản phẩm (Speed-to-Market)** trong giai đoạn đầu và **độ ổn định cấp doanh nghiệp (Enterprise Scalability)** khi mở rộng, UniFlow AI áp dụng kiến trúc dữ liệu linh hoạt:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 1: MONGODB (RAPID MVP PROTOTYPING & AGILITY)                                │
│ - Cực kỳ phù hợp với cấu trúc đồ thị JSON React Flow lồng nhau (Nodes, Edges, Config). │
│ - Tiếp nhận linh hoạt các Payload Webhook không đồng nhất từ nhiều sàn TMĐT.           │
│ - Phát triển tính năng siêu tốc, không bị nghẽn bởi DB Schema Migration phức tạp.      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ (Clean Architecture / Repository Pattern)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 2: POSTGRESQL + RLS (ENTERPRISE SCALE & ADVANCED SECURITY)                  │
│ - Chuẩn hóa quan hệ dữ liệu khi đạt lượng giao dịch lớn (> 500,000 orders/ngày).       │
│ - Kích hoạt Row-Level Security (RLS) bảo mật đa tổ chức (Multi-Tenant) cấp hạt nhân.   │
│ - Ánh xạ 1:1 từ Document Schema sang Bảng quan hệ SQL mà không sửa đổi Business Logic. │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

> **Nguyên tắc Kiến trúc:** Áp dụng **Repository Pattern** (`IWorkflowRepository`, `ISkuMappingRepository`, `ICredentialRepository`) tại tầng Backend (NestJS). Tầng nghiệp vụ giao tiếp qua Interface trừu tượng, cho phép chuyển đổi từ MongoDB (Mongoose/Prisma) sang PostgreSQL (TypeORM/Prisma) chỉ bằng cách tráo đổi Adapter cấu hình.

---

## **PHẦN II: ĐẶC TẢ MONGODB SCHEMA (GIAI ĐOẠN 1 - PHÁT TRIỂN NHANH)**

### **1. Collection: `tenants` & `users`**

```javascript
// Collection: tenants
{
  "_id": ObjectId("66c0e812a1b2c3d4e5f60001"),
  "name": "Thời Trang An Khang",
  "subdomain": "ankhang-store",
  "planTier": "GROWTH", // 'STARTER', 'GROWTH', 'ENTERPRISE'
  "settings": {
    "autoRetryOnFailure": true,
    "defaultCarrier": "GHTK",
    "alertChannels": ["TELEGRAM", "ZALO"]
  },
  "isActive": true,
  "createdAt": ISODate("2026-08-17T14:00:00Z"),
  "updatedAt": ISODate("2026-08-17T14:00:00Z")
}

// Collection: users
{
  "_id": ObjectId("66c0e812a1b2c3d4e5f60002"),
  "tenantId": ObjectId("66c0e812a1b2c3d4e5f60001"), // Phân lập Multi-tenant
  "email": "admin@ankhang.vn",
  "passwordHash": "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
  "fullName": "Nguyễn Văn An",
  "role": "OWNER", // 'OWNER', 'ADMIN', 'OPERATOR', 'VIEWER'
  "createdAt": ISODate("2026-08-17T14:00:00Z")
}
```

---

### **2. Collection: `platform_credentials` (Lưu khóa & Token mã hóa AES-256)**

```javascript
// Collection: platform_credentials
{
  "_id": ObjectId("66c0e812a1b2c3d4e5f60003"),
  "tenantId": ObjectId("66c0e812a1b2c3d4e5f60001"),
  "platformType": "TIKTOK_SHOP", // 'TIKTOK_SHOP', 'SHOPEE', 'LAZADA', 'SAPO', 'KIOTVIET', 'GHTK', 'GHN'
  "shopId": "VN_TTS_98765",
  "accountIdentifier": "ankhang_official_tts",
  "encryptedAccessToken": "U2FsdGVkX1+vupppZksvRf585XxSOVO4CrZgRyEtW1g=", // Mã hóa AES-256-GCM
  "encryptedRefreshToken": "U2FsdGVkX18Bw6K6Dk6T5p2LhLwVvKx...",
  "encryptedClientSecret": "U2FsdGVkX19sFj83KkLw09...",
  "partnerId": "isv_uniflow_vn",
  "tokenExpiresAt": ISODate("2026-08-17T18:00:00Z"),
  "status": "CONNECTED", // 'CONNECTED', 'EXPIRED', 'ERROR'
  "metadata": {
    "sellerRegion": "VN",
    "webhookSecret": "wh_sec_991823"
  },
  "updatedAt": ISODate("2026-08-17T14:00:00Z")
}
// Index tối ưu: { tenantId: 1, platformType: 1, shopId: 1 } (Unique)
```

---

### **3. Collection: `workflows` (Cấu trúc Document React Flow hoàn chỉnh)**

> **Ưu thế vượt trội của MongoDB:** Lưu trữ trọn vẹn toàn bộ đồ thị Nodes & Edges của React Flow trong một Document duy nhất mà không cần JOIN nhiều bảng SQL phức tạp.

```javascript
// Collection: workflows
{
  "_id": ObjectId("66c0e812a1b2c3d4e5f60004"),
  "tenantId": ObjectId("66c0e812a1b2c3d4e5f60001"),
  "name": "Tự động trừ kho Sapo và Đẩy đơn GHTK từ TikTok Shop",
  "description": "Luồng xử lý đơn hàng 0-chạm",
  "isActive": true,
  "triggerType": "WEBHOOK",
  "nodes": [
    {
      "id": "node_trigger_1",
      "type": "TRIGGER_TIKTOK",
      "label": "TikTok Inbound Order",
      "position": { "x": 100, "y": 200 },
      "config": { "shopId": "VN_TTS_98765", "eventType": "ORDER_STATUS_CHANGE" }
    },
    {
      "id": "node_ai_mapper_2",
      "type": "AI_SKU_MAPPER",
      "label": "AI SKU Matching Engine",
      "position": { "x": 400, "y": 200 },
      "config": { "confidenceThreshold": 0.95, "fallbackAction": "ALERT_ADMIN" }
    },
    {
      "id": "node_pos_3",
      "type": "ACTION_SAPO_DEDUCT",
      "label": "Trừ tồn kho Sapo",
      "position": { "x": 700, "y": 150 },
      "config": { "warehouseId": "WH_MAIN_HN" }
    },
    {
      "id": "node_ship_4",
      "type": "ACTION_GHTK_WAYBILL",
      "label": "Tạo vận đơn GHTK",
      "position": { "x": 700, "y": 300 },
      "config": { "serviceTier": "EXPRESS", "autoPrint": true }
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "node_trigger_1", "target": "node_ai_mapper_2" },
    { "id": "e2-3", "source": "node_ai_mapper_2", "target": "node_pos_3" },
    { "id": "e2-4", "source": "node_ai_mapper_2", "target": "node_ship_4" }
  ],
  "viewport": { "x": 50, "y": 80, "zoom": 1.2 },
  "executionCount": 14502,
  "createdAt": ISODate("2026-08-17T14:00:00Z"),
  "updatedAt": ISODate("2026-08-17T14:00:00Z")
}
```

---

### **4. Collection: `sku_mappings` (Ánh xạ SKU Thông minh)**

```javascript
// Collection: sku_mappings
{
  "_id": ObjectId("66c0e812a1b2c3d4e5f60005"),
  "tenantId": ObjectId("66c0e812a1b2c3d4e5f60001"),
  "sourcePlatform": "TIKTOK_SHOP",
  "sourceSkuCode": "TTS-AT-COT-BLK-L",
  "sourceProductName": "Áo thun Cotton Nam Màu Đen Size L Cao Cấp",
  "sourceVariationText": "Màu: Đen | Size: L",
  
  "targetPosPlatform": "SAPO",
  "targetMasterSku": "AT-COT-BLK-L",
  "targetProductName": "Áo Thun Cotton Nam Đen Size L",
  
  "confidenceScore": 0.985,
  "qdrantVectorId": "c8f2b730-6d9b-4659-994c-83bdf7023192",
  "mappingStatus": "AUTO_APPROVED", // 'AUTO_APPROVED', 'PENDING_REVIEW', 'MANUALLY_MAPPED'
  "approvedBy": ObjectId("66c0e812a1b2c3d4e5f60002"),
  "updatedAt": ISODate("2026-08-17T14:00:00Z")
}
// Index tối ưu: { tenantId: 1, sourcePlatform: 1, sourceSkuCode: 1 } (Unique)
```

---

### **5. Collection: `sync_event_logs` (Nhật ký Sự kiện & AI Tự chữa lành)**

```javascript
// Collection: sync_event_logs
{
  "_id": ObjectId("66c0e812a1b2c3d4e5f60006"),
  "tenantId": ObjectId("66c0e812a1b2c3d4e5f60001"),
  "workflowId": ObjectId("66c0e812a1b2c3d4e5f60004"),
  "traceId": "tr_20260817_9a8b7c",
  "idempotencyKey": "idemp:66c0e812:TIKTOK:TTS_5789234810293:ORDER_STATUS_CHANGE",
  "eventType": "ORDER_CREATED",
  "sourcePlatform": "TIKTOK_SHOP",
  "sourceOrderId": "TTS_5789234810293",
  "executionTimeMs": 185,
  "status": "AI_HEALED", // 'SUCCESS', 'FAILED', 'AI_HEALED', 'DUPLICATE_IGNORED'
  "rawPayloadInbound": { /* Raw JSON từ TikTok Shop */ },
  "udmPayload": { /* JSON Universal Order Model */ },
  "aiHealingAction": {
    "triggerReason": "GHN Service 503 Overload",
    "decision": "REROUTE_CARRIER_TO_GHTK",
    "assignedWaybill": "S21983021.HN1.B2",
    "feeDelta": 500
  },
  "createdAt": ISODate("2026-08-17T14:30:00Z")
}
// TTL Index tự động xóa log sau 90 ngày: { "createdAt": 1 }, expireAfterSeconds: 7776000
```

---

## **PHẦN III: LỘ TRÌNH CHUYỂN ĐỔI SANG POSTGRESQL (GIAI ĐOẠN 2 - SCALE ENTERPRISE)**

Khi cơ sở dữ liệu mở rộng quy mô lớn, hệ thống thực hiện chuyển dịch sang **PostgreSQL với Row-Level Security (RLS)** thông qua bảng ánh xạ 1:1:

| MongoDB Collection (Phase 1) | PostgreSQL Table (Phase 2) | Cơ chế quan hệ & Tối ưu SQL |
| :--- | :--- | :--- |
| `tenants` | `tenants` | Khóa chính `UUID`, quản lý hạn mức Tenant |
| `users` | `users` | Ràng buộc Foreign Key `tenant_id REFERENCES tenants(id)` |
| `platform_credentials` | `platform_credentials` | Mã hóa `AES-256-GCM`, Index `(tenant_id, platform_type)` |
| `workflows` | `workflows` + `workflow_nodes` | Tách hoặc giữ trường `canvas_layout JSONB` kết hợp GIN Index |
| `sku_mappings` | `sku_mappings` | Bật **Row-Level Security (RLS)** phân tách dữ liệu an toàn |
| `sync_event_logs` | `sync_event_logs` (Partitioned) | Phân vùng dữ liệu (Table Partitioning) theo tháng |

```sql
-- DDL PostgreSQL chuẩn bị sẵn cho Phase 2 (Áp dụng RLS):
ALTER TABLE sku_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON sku_mappings
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

---

## **PHẦN IV: HỆ THỐNG KHÓA & BỘ ĐỆM REDIS (REDIS ARCHITECTURE)**

Redis được sử dụng xuyên suốt cả hai giai đoạn để đảm bảo tốc độ phản hồi $< 0.5\text{s}$:

| Cấu trúc Khóa (Key Pattern) | TTL | Loại dữ liệu | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| `idemp:{tenant_id}:{platform}:{source_id}:{event}` | 86,400s (24h) | String (`"PROCESSED"`) | **Chống trùng lặp sự kiện:** Chặn webhook bắn đúp |
| `ratelimit:{tenant_id}:{platform}` | 60s | String (Atomic Counter)| **Kiểm soát tần suất gọi API sàn** |
| `token_cache:{tenant_id}:{platform_type}` | 12,000s (~3.3h)| Hash JSON | Bộ đệm Token đã giải mã để gọi API không qua DB |
| `queue:inbound_webhook` | Persistent | Stream / BullMQ | Hàng đợi tiếp nhận sự kiện Webhook vào |
| `queue:retry_backoff` | Dynamic | Sorted Set (Score = Time)| Hàng đợi thử lại có lùi thời gian tăng dần |

---

## **PHẦN V: CHUẨN DỮ LIỆU TOÀN NĂNG (UNIVERSAL DATA MODEL - UDM)**

### **1. Cấu trúc JSON Chuẩn cho Đơn hàng (`UniversalOrderSchema`)**

```json
{
  "$schema": "https://uniflow.ai/schemas/udm-order.v1.json",
  "meta": {
    "trace_id": "tr_20260817_9a8b7c",
    "tenant_id": "66c0e812a1b2c3d4e5f60001",
    "source_platform": "TIKTOK_SHOP",
    "source_shop_id": "VN_TTS_98765",
    "created_at": "2026-08-17T14:30:00.000Z",
    "ingested_at": "2026-08-17T14:30:00.120Z"
  },
  "order": {
    "source_order_id": "TTS_5789234810293",
    "status": "AWAITING_FULFILLMENT",
    "currency": "VND",
    "totals": {
      "subtotal": 299000,
      "discount_platform": 30000,
      "discount_seller": 20000,
      "shipping_fee_paid": 22000,
      "grand_total": 271000
    },
    "customer": {
      "masked_name": "Nguyễn V*** A**",
      "masked_phone": "0987***321",
      "shipping_address": {
        "full_address": "Số 10 Trần Phú, Phường Mộ Lao",
        "city": "Hà Nội",
        "district": "Quận Hà Đông",
        "ward": "Phường Mộ Lao"
      }
    },
    "items": [
      {
        "line_item_id": "item_01",
        "source_sku_code": "TTS-AT-COT-BLK-L",
        "source_item_name": "Áo thun Cotton Nam Màu Đen Size L Cao Cấp",
        "quantity": 2,
        "unit_price": 149500,
        "mapped_master_sku": "AT-COT-BLK-L",
        "mapping_confidence": 0.985
      }
    ],
    "logistics_plan": {
      "preferred_carrier": "GHTK",
      "shipping_tier": "EXPRESS",
      "auto_assigned_waybill": "S21983021.HN1.B2",
      "estimated_fee": 21500
    }
  }
}
```

### **2. Cấu trúc JSON Chuẩn cho Tồn kho (`UniversalInventorySchema`)**

```json
{
  "$schema": "https://uniflow.ai/schemas/udm-inventory.v1.json",
  "tenant_id": "66c0e812a1b2c3d4e5f60001",
  "master_sku": "AT-COT-BLK-L",
  "product_name": "Áo Thun Cotton Nam Đen Size L",
  "warehouse_id": "WH_HN_MAIN",
  "stock_levels": {
    "on_hand": 150,
    "reserved": 12,
    "available_to_sell": 138,
    "safety_threshold": 20
  },
  "channel_allocations": {
    "TIKTOK_SHOP": 60,
    "SHOPEE": 60,
    "OFFLINE_POS": 18
  },
  "last_synced_at": "2026-08-17T14:30:00.250Z"
}
```
