# 📚 `docs/` — THƯ VIỆN TÀI LIỆU DỰ ÁN UNIFLOW AI

Thư mục chứa toàn bộ tài liệu nghiên cứu thị trường, đề án kinh doanh, cẩm nang thuyết trình và các đặc tả kỹ thuật chi tiết của hệ thống UniFlow AI.

---

## 📂 **Danh mục Tài liệu Tổng quan**

| Tệp tài liệu | Nội dung & Mục tiêu |
| :--- | :--- |
| [`UNIFLOW_AI_MASTER_DOCUMENT.md`](file:///g:/UniFlow-PTIT_Aka/docs/UNIFLOW_AI_MASTER_DOCUMENT.md) | **Tài liệu Siêu Tổng thể (Master Document):** Tích hợp toàn diện từ chiến lược kinh doanh, kiến trúc kỹ thuật đến lộ trình triển khai. |
| [`01_De_An_Kinh_Doanh_Thi_Truong_Va_GTM.md`](file:///g:/UniFlow-PTIT_Aka/docs/01_De_An_Kinh_Doanh_Thi_Truong_Va_GTM.md) | **Đề án Kinh doanh & Chiến lược GTM:** Mô hình định giá Freemium/SaaS, phân khúc khách hàng mục tiêu và chiến lược tiếp cận thị trường. |
| [`02_Kien_Truc_Ky_Thuat_API_Va_Bao_Mat.md`](file:///g:/UniFlow-PTIT_Aka/docs/02_Kien_Truc_Ky_Thuat_API_Va_Bao_Mat.md) | **Kiến trúc Kỹ thuật & Bảo mật:** Cổng định hướng kiến trúc hệ thống tổng thể, chính sách API TikTok/Shopee và mô hình bảo mật Zero-Trust. |
| [`03_Cam_Nang_Thuyet_Trinh_Demo_Va_Phan_Bien.md`](file:///g:/UniFlow-PTIT_Aka/docs/03_Cam_Nang_Thuyet_Trinh_Demo_Va_Phan_Bien.md) | **Cẩm nang Thuyết trình & Phản biện:** Kịch bản Demo thực tế, bộ câu hỏi - câu trả lời phản biện (Q&A) bảo vệ đồ án. |
| [`Nghiên Cứu Đối Thủ Cạnh Tranh & Chiến Lược Triển Khai UniFlow AI.md`](file:///g:/UniFlow-PTIT_Aka/docs/Nghiên%20Cứu%20Đối%20Thủ%20Cạnh%20Tranh%20&%20Chiến%20Lược%20Triển%20Khai%20UniFlow%20AI.md) | **Phân tích Đối thủ Cạnh tranh:** So sánh chuyên sâu với Zapier, Make, Pancake, Sapo và lợi thế cạnh tranh của UniFlow AI. |

---

## 🛠️ **Đặc tả Kỹ thuật Chi tiết (`docs/specifications/`)**

* 🎨 [01_UI_UX_Frontend_Specification.md](file:///g:/UniFlow-PTIT_Aka/docs/specifications/01_UI_UX_Frontend_Specification.md): Thiết kế Design System Ant Design + Less, bảng mã màu Brand `#ed1c24` & `#fcc20f`, React Flow Canvas, Bảng khớp SKU, WebSocket live stream.
* 🗄️ [02_Database_Schema_UDM.md](file:///g:/UniFlow-PTIT_Aka/docs/specifications/02_Database_Schema_UDM.md): Chiến lược DB 2 giai đoạn (MongoDB MVP $\rightarrow$ PostgreSQL RLS), cấu trúc khóa Redis và chuẩn dữ liệu Universal Data Model (UDM).
* ⚙️ [03_Backend_Architecture_API_Spec.md](file:///g:/UniFlow-PTIT_Aka/docs/specifications/03_Backend_Architecture_API_Spec.md): Đường ống Webhook $< 0.5\text{s}$, xác thực HMAC-SHA256, Outbound Adapters và WebSocket live gateway.
* 🧠 [04_AI_Engine_AutoMapping_ErrorHealing.md](file:///g:/UniFlow-PTIT_Aka/docs/specifications/04_AI_Engine_AutoMapping_ErrorHealing.md): Python FastAPI, Qdrant Vector DB, thuật toán Hybrid SKU Scoring và cơ chế AI Self-Healing.
