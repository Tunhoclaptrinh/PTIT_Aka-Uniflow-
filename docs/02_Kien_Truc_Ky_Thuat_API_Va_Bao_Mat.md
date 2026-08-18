# **UNIFLOW AI — TÀI LIỆU KIẾN TRÚC KỸ THUẬT, TÍCH HỢP API & AN TOÀN THÔNG TIN**

### **Phân hệ: Dành cho Đội ngũ Kỹ sư Phần mềm (Backend, AI, Frontend, DevOps)**

---

## **MỤC LỤC & BẢN ĐỒ THƯ MỤC ĐẶC TẢ CHI TIẾT (TECHNICAL SPECIFICATIONS)**

Tài liệu này đóng vai trò là **Cổng định hướng kiến trúc tổng thể (Architecture Gateway)**. Chi tiết triển khai từng phân hệ được đặc tả sâu trong thư mục `docs/specifications/`:

* 🎨 **[Đặc tả Giao diện & Trải nghiệm UI/UX Frontend](file:///g:/UniFlow-PTIT_Aka/docs/specifications/01_UI_UX_Frontend_Specification.md):** Thiết kế Design System, Dark/Light Mode, React Flow Canvas Builder, Bảng khớp SKU, Trình theo dõi WebSocket.
* 🗄️ **[Đặc tả Cơ sở Dữ liệu & Chuẩn UDM (Chiến lược MongoDB $\rightarrow$ PostgreSQL)](file:///g:/UniFlow-PTIT_Aka/docs/specifications/02_Database_Schema_UDM.md):** Chiến lược DB 2 giai đoạn (MongoDB phát triển nhanh MVP $\rightarrow$ PostgreSQL RLS mở rộng quy mô), Cấu trúc khóa Redis, JSON Schema UDM.
* ⚙️ **[Đặc tả Kiến trúc Backend & API Gateway](file:///g:/UniFlow-PTIT_Aka/docs/specifications/03_Backend_Architecture_API_Spec.md):** Đường ống xử lý Webhook $< 0.5\text{s}$, Xác thực HMAC-SHA256, Bộ chuyển đổi Outbound Connectors, OpenAPI 3.0 Specs, Bộ đệm phân tán.
* 🧠 **[Đặc tả Lõi Trí tuệ Nhân tạo & Tự chữa lành](file:///g:/UniFlow-PTIT_Aka/docs/specifications/04_AI_Engine_AutoMapping_ErrorHealing.md):** Phân hệ Python FastAPI + Qdrant Vector DB, Thuật toán Hybrid Scoring khớp SKU, Định tuyến cước thông minh, Cơ chế AI Self-Healing.

---

## **PHẦN I: TỔNG QUAN KIẾN TRÚC HỆ THỐNG & TECH STACK MATRIX**

UniFlow AI được xây dựng theo kiến trúc **Lean Middleware / Omnichannel iPaaS** hướng sự kiện (*Event-Driven Architecture*) với khả năng chịu tải cao (*High Concurrency & High Availability*), đáp ứng thông lượng lớn trong các đợt Siêu Sale TMĐT (Mega Sale 11/11, 12/12, Payday).

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      INTEGRATION HUB & CLIENT TIER                     │
 │      React.js / Next.js + TailwindCSS + React Flow (Canvas Builder)    │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │  (HTTPS / WSS)
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │                     API GATEWAY & SECURITY LAYER                       │
 │  - HMAC-SHA256 Signature Verification                                  │
 │  - Rate Limiter & Multi-Tenant Context (tenantId injection)            │
 │  - Idempotency Filter (Redis Cache TTL 24h)                            │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │              EVENT INGESTION & REAL-TIME ENGINE (BACKEND)              │
 │  - Webhook Receiver (< 0.5s Latency) [Node.js NestJS / GoLang]         │
 │  - Message Queue: Redis Queue / BullMQ / RabbitMQ                      │
 │  - UDM Normalizer: Standardizing JSON schemas to internal format       │
 └───────────────────┬────────────────────────────────┬───────────────────┘
                     │                                │
 ┌───────────────────▼──────────────┐  ┌──────────────▼───────────────────┐
 │       CORE AI AGENT ENGINE       │  │        DATABASE & STORAGE        │
 │  - Python FastAPI Service        │  │  - MongoDB (Phase 1 Rapid MVP)   │
 │  - Gemini 1.5 Flash NLP API      │  │  - PostgreSQL RLS (Phase 2 Scale)│
 │  - Qdrant Vector Database        │  │  - Redis (State & Idempotency)   │
 │  - Error-Healing & Dynamic Route │  │  - Secrets Manager (AES-256)     │
 └───────────────────┬──────────────┘  └──────────────────────────────────┘
                     │
 ┌───────────────────▼────────────────────────────────────────────────────┐
 │                     OUTBOUND CONNECTORS LAYER                          │
 │  Marketplaces (Shopee, TikTok) ── POS (KiotViet, Sapo) ── Logistics   │
 └────────────────────────────────────────────────────────────────────────┘
```

### **Ma trận công nghệ chi tiết (Tech Stack Matrix)**

| Phân hệ Kỹ thuật | Công nghệ Lựa chọn | Mô tả Chức năng & Vai trò Chuyên sâu |
| :--- | :--- | :--- |
| **Backend Core** | Node.js (NestJS) / GoLang | Xử lý bất đồng bộ cao (*High Concurrency*), Webhook Receiver phản hồi $< 0.5\text{s}$. |
| **Frontend Dashboard** | React.js / Next.js + TailwindCSS | Single Page Application (SPA), tích hợp **React Flow** cho Canvas Node Builder kéo-thả. |
| **Database Chiến lược** | **MongoDB** (MVP) $\rightarrow$ **PostgreSQL** (Scale) | Giai đoạn 1 dùng MongoDB lưu Document Nodes/Edges và Webhook linh hoạt; Giai đoạn 2 chuyển dịch PostgreSQL RLS. |
| **In-Memory & Queue** | Redis + BullMQ | Lưu trữ Idempotency Key 24h chống trùng lặp đơn, Rate Limiter và hàng đợi xử lý bất đồng bộ. |
| **AI Engine** | Gemini 1.5 Flash API + Python (FastAPI) | Xử lý NLP khớp danh mục sản phẩm, chẩn đoán lỗi API, kết hợp cơ sở dữ liệu vectơ Qdrant. |
| **Giao thức Kết nối** | RESTful API, Webhook, WebSocket | WebSocket đẩy dữ liệu thời gian thực và nhật ký AI (*AI Action Logs*) lên màn hình Dashboard. |
| **Bảo mật & Mã hóa** | AES-256-GCM + HMAC-SHA256 | Quản lý chứng thực Zero-Trust, bảo mật phân lập đa tổ chức (*Multi-Tenant Isolation*). |

---

## **PHẦN II: QUY TRÌNH THẨM ĐỊNH, CẤP PHÉP & TÍCH HỢP API ĐỐI TÁC**

### **1. Phân tích quy trình cấp phép và chính sách API TikTok Shop**
* **Cổng đăng ký:** TikTok Shop Partner Center.
* **Quy định tài khoản ISV:** Phải đăng ký dưới vai trò "App Developer / System Integrator (ISV)". Email đăng ký tài khoản Partner Center dành cho ISV tuyệt đối **không được trùng với email của tài khoản TikTok Shop Seller**; nếu trùng, hệ thống sẽ tự động giới hạn phân quyền thành "Seller Developer" (chỉ truy cập dữ liệu của chính cửa hàng đó).
* **Hồ sơ ARD & DSPR:** Thiết lập ứng dụng, nộp Tài liệu Yêu cầu Ứng dụng (*App Requirement Document - ARD*). Ứng dụng phải có tên app, biểu tượng logo tuân thủ quy định thương hiệu của TikTok (không chứa chữ "TikTok"), mô tả chi tiết luồng dữ liệu, URL trang web chính thức có tích hợp công khai liên kết Chính sách bảo mật (*Privacy Policy*) và Điều khoản dịch vụ (*Terms of Service*).
* **Đánh giá Bảo mật (DSPR):** Trải qua quá trình Đánh giá Bảo mật Dữ liệu và Quyền riêng tư (*Data Security and Privacy Review - DSPR*) kéo dài trung bình 2 đến 4 tuần.
* **Vòng đời ứng dụng:**
  * *Custom App:* Liên kết tối đa 25 shop thương mại điện tử để thử nghiệm.
  * *Public App:* Nộp hồ sơ nâng cấp (*Upgrade to Public App*) bao gồm tài liệu kiểm thử kỹ thuật, video quay màn hình thao tác thực tế (demo video), tài khoản thử nghiệm (*Test Accounts*) và danh sách ngôn ngữ (*Language Listing*).
* **Vận hành Webhook:** Tiếp nhận 6 nhóm sự kiện (`ORDER_STATUS_CHANGE`, `CANCELLATION_STATUS_CHANGE`, `RETURN_STATUS_CHANGE`, `REVERSE_STATUS_UPDATE`, `PACKAGE_UPDATE`, `RECIPIENT_ADDRESS_UPDATE`). Cổng tiếp nhận bắt buộc phải trả lời mã **HTTP 200 trong vòng 3 giây**.

### **2. Phân tích quy trình cấp phép và chính sách API Shopee**
* **Cổng đăng ký:** Shopee Open Platform dành cho ISV (yêu cầu Giấy phép đăng ký kinh doanh, trang web dịch vụ hoàn chỉnh, tài khoản test). Thời gian xét duyệt 1 đến 2 tuần.
* **Chữ ký số bảo mật HMAC-SHA256:** Mỗi truy vấn API gửi tới Shopee bắt buộc phải đi kèm chữ ký số:
  $$\text{Signature} = \text{HMAC-SHA256}(\text{partner\_id} + \text{api\_path} + \text{timestamp} + \text{access\_token} + \text{shop\_id}, \text{partner\_key})$$
* **Vòng đời Token:**
  * `access_token`: Hiệu lực trong **4 giờ**.
  * `refresh_token`: Hiệu lực trong **30 ngày**, thuộc dạng **"sử dụng một lần" (single-use)** — mỗi lần lấy access_token mới, hệ thống Shopee sẽ cấp đồng thời một refresh_token mới thay thế. Nếu refresh gặp lỗi hoặc hết hạn, nhà bán hàng bắt buộc phải ủy quyền lại từ đầu qua OAuth.
* **Giới hạn & Hiệu năng:** Giới hạn 100 request/phút/partner. Tỷ lệ gọi API thành công phải duy trì trên 90% (nếu dưới 90% liên tục 7 ngày sẽ bị cảnh báo và hạ quyền).
* **Cơ chế Webhook Push:** Thông điệp Push của Shopee (`order_status_push`, `return_updates_push`) chỉ là tín hiệu thông báo có thay đổi mà không chứa chi tiết đơn hàng. UniFlow AI bắt buộc thực hiện một truy vấn API thứ cấp (`v2.order.get_order_detail`) để lấy toàn bộ dữ liệu.

### **3. Bảng tổng hợp ma trận cấp phép & rủi ro kỹ thuật 5 nền tảng**

| Nền tảng | Phương thức xác thực | Yêu cầu xét duyệt ứng dụng | Thời gian chờ duyệt | Vòng đời Access Token | Rủi ro kỹ thuật & Tuân thủ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TikTok Shop** | OAuth 2.0 chuẩn | Nộp hồ sơ ISV, ARD, kiểm tra DSPR, quay video demo, duyệt Public App. | 1 – 4 tuần | ~1 giờ (Tự động refresh) | Bị từ chối duyệt nếu thiếu Privacy Policy/Terms; vượt giới hạn 25 shop khi chưa nâng cấp Public. |
| **Shopee** | OAuth 2.0 + HMAC-SHA256 | Đăng ký ISV, nộp Giấy phép kinh doanh, báo cáo Pentest (tier cao). | 1 – 2 tuần | 4 giờ (Refresh Token sống 30 ngày, 1-time use) | Trượt chỉ số Tỷ lệ thành công $< 90\%$; Token hết hạn làm đứt gãy luồng; bắt buộc ký HMAC từng request. |
| **KiotViet** | OAuth 2.0 (Client Credentials) | Không cần sàn duyệt; Người dùng tự tạo Client ID / Secret trên portal. | Ngay lập tức | ~1 giờ | Người dùng bắt buộc phải đăng ký gói Cao cấp (~5.88 triệu/năm) mới mở cổng kết nối API. |
| **GHN** | Static API Token | Khởi tạo Token trong admin; Gửi email đăng ký URL Webhook thủ công. | Vài ngày (chờ duyệt Webhook) | Vô thời hạn (Trừ khi tự re-generate) | Webhook không đăng ký tự động được qua Dashboard, bắt buộc xác nhận qua email `api@ghn.vn`. |
| **GHTK** | Scoped API Token | Xác minh CCCD/CMND shop; Tạo Token có phân quyền trên portal. | Vài ngày | Tùy chỉnh theo ngày hết hạn thiết lập | Cơ chế Webhook của GHTK chỉ thử lại (retry) đúng 1 lần nếu server UniFlow ngắt kết nối. |

---

## **PHẦN III: QUẢN TRỊ RỦI RO, ĐẢM BẢO SLA & KHẮC PHỤC SỰ CỐ**

### **1. Tự động làm mới Token ngầm (Token Refresh Cron)**
Để duy trì Uptime SLA $> 99.9\%$, hệ thống xây dựng tác vụ chạy ngầm làm mới `access_token` Shopee sau mỗi **3.5 giờ** vận hành, ghi nhận ngay lập tức `refresh_token` mới vào hạ tầng quản lý khóa mã hóa AES-256.

### **2. Chống trùng lặp sự kiện (Idempotency Key Engine)**
Nhằm tránh việc một đơn hàng bị trừ kho hai lần do Webhook gửi lặp lại:
$$\text{IdempotencyKey} = \text{Hash}(\text{tenantId} + \text{Platform} + \text{SourceOrderId} + \text{EventType})$$
Khóa được lưu trữ trong Redis Cache với thời gian sống TTL 24 giờ. Nếu khóa đã tồn tại, sự kiện trùng lặp sẽ bị loại bỏ ngay tại API Gateway mà không gây ảnh hưởng đến dữ liệu kho.

### **3. Ngắt mạch (Circuit Breaker) & Exponential Backoff**
Khi phát hiện kết nối Webhook bị gián đoạn từ phía đối tác vận chuyển hoặc tỷ lệ lỗi HTTP 429 (Rate Limit) tăng vọt, hệ thống kích hoạt cơ chế ngắt mạch (*Circuit Breaker*) và chuyển sang chế độ quét chủ động (*Active Polling*) với thuật toán lùi thời gian tăng dần (*Exponential Backoff*).

---

## **PHẦN IV: UNIVERSAL DATA MODEL (UDM) & LÕI AI AUTO-MAPPING**

### **1. Chuẩn hóa Universal Data Model (UDM Normalizer)**
Biến bài toán phức tạp $N \times N$ cầu nối (5 nguồn sàn $\times$ 5 đích POS/Ship $= 25$ connectors) thành bài toán tinh gọn $N + N$ (5 connectors vào $+$ 5 connectors ra $= 10$ connectors).
*(Xem chi tiết JSON Schema đầy đủ tại [02_Database_Schema_UDM.md](file:///g:/UniFlow-PTIT_Aka/docs/specifications/02_Database_Schema_UDM.md))*

### **2. Thuật toán phân hệ AI Auto-Mapping Engine (NLP SKU Matching)**
Phân hệ sử dụng Gemini 1.5 Flash API kết hợp Python FastAPI và Cơ sở dữ liệu Vectơ Qdrant:
1. **Trích xuất thuộc tính:** Đọc tên sản phẩm phi cấu trúc (VD: *"Áo phông Cotton Nam Đen Size L"* $\rightarrow$ Thuộc tính: Áo phông, Cotton, Nam, Đen, L).
2. **Khởi tạo Embedding:** Sinh chuỗi vectơ đại diện 768 chiều và truy vấn tương đồng trên Qdrant so chiếu danh mục SKU kho (KiotViet/Sapo).
3. **Công thức tính điểm tương quan:**
   $$\text{Score} = 0.7 \times S_{\text{vector}} + 0.3 \times S_{\text{attribute}}$$
4. **Phân ngưỡng hành động:**
   * $\text{Score} \ge 0.95$: Tự động liên kết SKU và đồng bộ tức thì.
   * $0.70 \le \text{Score} < 0.95$: Đẩy cảnh báo gợi ý lên Dashboard chờ nhân viên bấm duyệt 1-click.
   * $\text{Score} < 0.70$: Yêu cầu ghép thủ công và đưa vào tập dữ liệu huấn luyện lại.
*(Xem chi tiết code thuật toán tại [04_AI_Engine_AutoMapping_ErrorHealing.md](file:///g:/UniFlow-PTIT_Aka/docs/specifications/04_AI_Engine_AutoMapping_ErrorHealing.md))*

### **3. Cơ chế AI Error-Healing (Tự chữa lành luồng dữ liệu)**
Khi API của một đối tác vận chuyển gặp sự cố (HTTP 500, 502, 504), AI Agent phân tích thông điệp lỗi:
* Tự động chuyển hướng đơn sang đơn vị vận chuyển dự phòng phù hợp với cấu hình cước phí tương đương.
* Phát thông báo kiểm soát qua WebSocket lên Dashboard và đẩy cảnh báo tức thời qua Zalo ZNS / Telegram Bot cho quản lý.

---

## **PHẦN V: BẢO MẬT ZERO-TRUST & CƠ CHẾ PHÂN TÁCH DỮ LIỆU**

1. **Zero-Trust Credential Management:**
   * Tất cả `access_token`, `refresh_token`, `client_secret`, `partner_key` được mã hóa hai chiều bằng thuật toán **AES-256-GCM** trước khi lưu trữ trong Database.
   * Dữ liệu thô tuyệt đối không được ghi vết (log) ra các tệp nhật ký hệ thống.
2. **Xác thực HMAC Webhook:** 100% request Webhook đi vào hệ thống đều được kiểm tra chữ ký điện tử tại tầng API Gateway, từ chối ngay với HTTP 401 nếu sai lệch.
3. **Multi-Tenant Isolation:** 
   * **Giai đoạn 1 (MongoDB):** Phân lập qua trường định danh `tenantId` với Mongoose Tenant Middleware.
   * **Giai đoạn 2 (PostgreSQL):** Kích hoạt cơ chế Row-Level Security (RLS) bảo vệ cấp hạt nhân DB.

---

## **PHẦN VI: KHUNG THỜI GIAN TRIỂN KHAI KỸ THUẬT (ENGINEERING ROADMAP)**

| Giai đoạn | Thời gian | Hạng mục Kỹ thuật Cốt lõi | Hạng mục Thẩm định & Tích hợp |
| :--- | :--- | :--- | :--- |
| **Giai đoạn 0: Nền tảng & Cấp phép** | Tháng 1 | Khởi tạo Monorepo, **MongoDB Schemas** cho Nodes/Edges/Webhooks, Redis Caching; xây dựng UDM & Plugin Connector Interface. | Nộp hồ sơ đăng ký ISV Partner Center trên TikTok Shop và Shopee Open Platform. |
| **Giai đoạn 1: Sản phẩm MVP** | Tháng 2 – 3 | Hoàn thiện kết nối Shopee, TikTok Shop, KiotViet và GHN/GHTK trên MongoDB; đóng gói Visual Node Builder cơ bản (React Flow). | Triển khai thử nghiệm Beta kín với 20 nhà bán hàng mục tiêu để tối ưu luồng dữ liệu. |
| **Giai đoạn 2: Lõi AI & Scale** | Tháng 4 – 6 | Kích hoạt AI Auto-Mapping (Qdrant Vector DB) & AI Error-Healing; mở rộng kết nối Sapo, Lazada, GHTK; chuẩn bị migration script sang PostgreSQL. | Hoàn thành xét duyệt Public App trên TikTok Shop và Shopee; chính thức thương mại hóa. |
| **Giai đoạn 3: Enterprise & RLS** | Tháng 7 – 12 | Chuyển dịch toàn diện sang **PostgreSQL RLS** khi lượng giao dịch lớn; ra mắt Prompt-to-Workflow bằng tiếng Việt; mở Public API. | Mở rộng Marketplace khối Node và phân hệ AI điều phối đa kho. |
