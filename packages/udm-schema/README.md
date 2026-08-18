# 📋 `@uniflow/udm-schema` (Universal Data Model)

Gói thư viện định nghĩa cấu trúc dữ liệu toàn năng **Universal Data Model (UDM)** của hệ thống UniFlow AI.

---

## 🎯 **Mục tiêu của Chuẩn UDM**
Giải quyết bài toán bùng nổ $N \times N$ điểm kết nối giữa các nền tảng:
Thay vì phải viết $5 \text{ sàn} \times 5 \text{ hệ thống kho} = 25 \text{ bộ adapter}$, UniFlow chuẩn hóa tất cả dữ liệu sàn về **UDM**, rút gọn chỉ còn $N + N = 10 \text{ bộ adapter}$ ($5 \text{ inbound} + 5 \text{ outbound}$).

---

## 📂 **Cấu trúc thư mục**
```
packages/udm-schema/
├── schemas/
│   └── order.schema.json      # JSON Schema Draft-07 chuẩn hóa đơn hàng
├── src/
│   ├── order.udm.ts           # TypeScript Model UniversalOrderModel
│   ├── inventory.udm.ts       # TypeScript Model UniversalInventoryModel & Deduct
│   ├── shipment.udm.ts        # TypeScript Model UniversalShipmentModel
│   └── index.ts               # Export các models
├── package.json
├── tsconfig.json
└── README.md                  # Tài liệu hướng dẫn (File này)
```

---

## 💻 **Ví dụ sử dụng**
```typescript
import { UniversalOrderModel } from '@uniflow/udm-schema';
import { PlatformType, OrderStatus } from '@uniflow/shared-types';

const sampleOrder: UniversalOrderModel = {
  meta: {
    traceId: 'tr_123456',
    tenantId: 'tenant_001',
    sourcePlatform: PlatformType.TIKTOK_SHOP,
    sourceShopId: 'VN_TTS_98765',
    createdAt: new Date().toISOString(),
    ingestedAt: new Date().toISOString(),
  },
  order: {
    sourceOrderId: 'TTS_889922',
    status: OrderStatus.PAID,
    currency: 'VND',
    totals: {
      subtotal: 250000,
      discountPlatform: 20000,
      discountSeller: 0,
      shippingFeePaid: 18000,
      grandTotal: 248000,
    },
    customer: {
      maskedName: 'Nguyễn V*** A**',
      maskedPhone: '0987***321',
      shippingAddress: {
        fullAddress: 'Số 10 Trần Phú',
        city: 'Hà Nội',
        district: 'Quận Hà Đông',
        ward: 'Phường Mộ Lao',
      },
    },
    items: [
      {
        lineItemId: 'item_01',
        sourceSkuCode: 'TTS-AT-COT-BLK-L',
        sourceItemName: 'Áo thun Cotton Nam Màu Đen Size L',
        quantity: 2,
        unitPrice: 125000,
      },
    ],
  },
};
```
