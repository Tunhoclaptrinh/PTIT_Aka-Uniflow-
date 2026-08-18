# 📦 `@uniflow/shared-types`

Thư viện kiểu dữ liệu, hằng số và Enums dùng chung cho toàn bộ phân hệ của UniFlow AI (Frontend, Backend, AI Engine, Scripts).

---

## 🎨 **Hệ thống Mã màu Nhận diện Thương hiệu (Brand Colors)**
Được định nghĩa tập trung trong `BRAND_COLORS`:
* **Aka Crimson Red (`#ed1c24`):** Màu nhận diện cốt lõi PTIT Aka, Primary Color trong Ant Design `ConfigProvider`.
* **Solar Gold Yellow (`#fcc20f`):** Màu phụ trợ (Secondary Color), điểm nhấn ánh vàng Solar, Gradient thương hiệu và trạng thái Cảnh báo/Review.
* **Brand Gradient:** `linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)`.

---

## 📂 **Cấu trúc thư mục**
```
packages/shared-types/
├── src/
│   └── index.ts        # Toàn bộ Enums (PlatformType, OrderStatus, WSEventType) & Theme Tokens
├── package.json        # Định nghĩa package & dependencies
├── tsconfig.json       # TypeScript build config
└── README.md           # Tài liệu hướng dẫn sử dụng
```

---

## 🚀 **Cách sử dụng trong các App**
```typescript
import { BRAND_COLORS, PlatformType, OrderStatus, WSEventType } from '@uniflow/shared-types';

console.log(BRAND_COLORS.PRIMARY_AKA_RED); // '#ed1c24'
console.log(BRAND_COLORS.SECONDARY_SOLAR_GOLD); // '#fcc20f'
```
