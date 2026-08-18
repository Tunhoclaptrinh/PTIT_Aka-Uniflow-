# 📦 `packages/` — UNIFLOW SHARED PACKAGES WORKSPACE

Thư mục chứa các thư viện dùng chung cho toàn bộ dự án UniFlow AI, được cấu hình theo mô hình Monorepo Workspaces.

---

## 📂 **Danh sách các Packages**

| Thư mục | Tên Package | Mục đích & Chức năng |
| :--- | :--- | :--- |
| [`shared-types`](file:///g:/UniFlow-PTIT_Aka/packages/shared-types) | `@uniflow/shared-types` | Toàn bộ Enums (Nền tảng, Trạng thái đơn, Sự kiện WebSocket), Hằng số Brand Colors (`#ed1c24`, `#fcc20f`), Glow tokens & Type definitions. |
| [`udm-schema`](file:///g:/UniFlow-PTIT_Aka/packages/udm-schema) | `@uniflow/udm-schema` | Chuẩn dữ liệu toàn năng Universal Data Model (JSON Schemas & TypeScript interfaces) cho Orders, Inventory và Shipments. |

---

## 🛠️ **Nguyên tắc phát triển**
1. Tất cả các kiểu dữ liệu dùng chung giữa ít nhất 2 phân hệ (Frontend/Backend/AI/Scripts) **bắt buộc** phải được định nghĩa trong `packages/`.
2. Không lưu trữ các logic nghiệp vụ hay phụ thuộc nặng vào framework (như React hay NestJS) trong `packages/` để đảm bảo tính gọn nhẹ và tái sử dụng cao.
