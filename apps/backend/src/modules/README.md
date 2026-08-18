# ⚙️ `src/modules/` — CÁC MODULE NGHIỆP VỤ BACKEND (NESTJS)

Thư mục chứa toàn bộ các khối chức năng theo kiến trúc Module hóa (Domain-Driven Modules) của UniFlow AI Backend.

---

## 📂 **Danh sách các Modules**

| Module | Đường dẫn | Chức năng & Vai trò |
| :--- | :--- | :--- |
| **Webhooks** | `src/modules/webhooks/` | Tiếp nhận Webhook Inbound từ TikTok Shop, Shopee và Lazada. Xác thực chữ ký **HMAC-SHA256**, kiểm tra trùng lặp Idempotency và phản hồi HTTP 200 trong $< 0.5\text{s}$. |
| **Normalizer** | `src/modules/normalizer/` | Bộ chuyển đổi cấu trúc JSON từ các sàn TMĐT sang chuẩn dữ liệu chung **Universal Data Model (UDM)**. |
| **WebSocket** | `src/modules/websocket/` | Cổng phát sóng sự kiện thời gian thực (Live Stream & Logs) lên Dashboard Web. |
| **Connectors** | `src/modules/connectors/` | Bộ Adapter gọi API Outbound sang hệ thống Kho POS (Sapo, KiotViet) và Hãng Vận chuyển (GHN, GHTK). |
| **Workflow Engine** | `src/modules/workflow-engine/` | Máy trạng thái (State Machine) điều phối thực thi đồ thị Node React Flow. |
