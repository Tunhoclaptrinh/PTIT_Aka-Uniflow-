# **UNIFLOW AI — CHIẾN LƯỢC CÀO & CHUẨN HÓA API DOCS, KIẾN TRÚC TÍCH HỢP PULL/PUSH VÀ MÔ HÌNH HYBRID MCP**

> **Tài liệu Kỹ thuật Chuyên sâu:** Dành cho Lead Integrator (Tuấn), Backend Engineer (Đỗ Minh), System Tester / QA (Kim), và Ban Dự Án UniFlow AI.  
> **Mục tiêu:** Cung cấp lộ trình toàn diện từ việc cào bóc tách API Docs, chuẩn hóa ngữ nghĩa UDM (Universal Data Model), thiết kế kiến trúc UniFlow Trung tâm (Pull/Push Engine & MCP Hub), và giải quyết triệt để bài toán tích hợp Sàn Thương mại điện tử (Shopee, TikTok Shop, Lazada).

---

## **MỤC LỤC**
1. [Phần I: Ma trận Nền tảng & Chiến lược Cào API Docs Đa Nguồn](#phần-i-ma-trận-nền-tảng--chiến-lược-cào-api-docs-đa-nguồn)
2. [Phần II: Chuẩn Hóa API Docs Dành Cho AI Code Generation (OpenAPI 3.1 + UDM Extended)](#phần-ii-chuẩn-hóa-api-docs-dành-cho-ai-code-generation-openapi-31--udm-extended)
3. [Phần III: Phân Tích Kiến Trúc Hệ Thống: UniFlow Hub, Pull/Push & Mô Hình MCP](#phần-iii-phân-tích-kiến-trúc-hệ-thống-uniflow-hub-pullpush--mô-hình-mcp)
4. [Phần IV: Giải Pháp Thực Chiến Sàn TMĐT: Đánh Giá 4 Phương Án & Ma Trận Rủi Ro](#phần-iv-giải-pháp-thực-chiến-sàn-tmđt-đánh-giá-4-phương-án--ma-trận-rủi-ro)
5. [Phần V: Kế Hoạch Phân Công & Deliverables Cụ Thể Cho Tuấn & Team](#phần-v-kế-hoạch-phân-công--deliverables-cụ-thể-cho-tuấn--team)

---

# **PHẦN I: MA TRẬN NỀN TẢNG & CHIẾN LƯỢC CÀO API DOCS ĐA NGUỒN**

### **1. Bảng Ma Trận Phân Tích Cổng API & Đặc Thù Kỹ Thuật (7 Nhóm)**

| Nhóm Nền Tảng | Nền Tảng Mục Tiêu | Cổng Tài Liệu (Developer Portal) | Cơ Chế Xác Thực (Auth) | Thách Thức Khi Cào Doc & Giải Pháp Trích Xuất |
| :--- | :--- | :--- | :--- | :--- |
| **1. Sàn TMĐT** | **TikTok Shop** | `partner.tiktokshop.com/doc/page/*` | OAuth 2.0 + HMAC-SHA256 Sign | Portal dạng SPA (React), Doc render động qua REST API nội bộ. **Giải pháp:** Intercept network request bắt file JSON schema gốc. |
| | **Shopee** | `open.shopee.com/documents/v2/*` | OAuth 2.0 + HMAC-SHA256 Sign | Portal chặn bot bằng Cloudflare, nội dung tải bằng AJAX. **Giải pháp:** Dùng Playwright Headless với session token hoặc bắt file doc JSON từ CDN. |
| | **Lazada** | `open.lazada.com/doc/api.htm` | App Key + App Secret + Sign HMAC | Giao diện cũ, table HTML tĩnh lồng ghép phức tạp. **Giải pháp:** Dùng Cheerio bóc tách HTML DOM table thành JSON schema. |
| **2. POS & ERP** | **KiotViet** | `developer.kiotviet.net/api-reference` | OAuth 2.0 (Client Credentials) | Sử dụng ReadMe.io / Swagger UI chuẩn. **Giải pháp:** Tải trực tiếp file `openapi.json` / `swagger.json` ẩn trong tab Network. |
| | **Sapo** | `developers.sapo.vn/docs/apis` | App Key / Secret + Webhook Signature | Dạng tài liệu tĩnh Markdown / GitBook. **Giải pháp:** Dùng crawler bóc tách Markdown AST hoặc cào đệ quy các trang API. |
| | **Nhanh.vn** | `nhanh.vn/manual/api` | API Key + Secret Key (MD5/SHA) | Tài liệu HTML dạng bảng, không theo chuẩn Swagger. **Giải pháp:** Dùng script regex parse bảng tham số sang JSON Schema. |
| | **MISA AMIS** | `actopen.misa.vn` | AppID + SecretKey + Bearer Token | Cung cấp tài liệu Postman Collection hoặc Swagger UI. **Giải pháp:** Xuất Postman Collection v2.1 trực tiếp. |
| **3. Vận Chuyển** | **GHN (Shiip)** | `api.ghn.vn/home/docs.html` | Static Token (Header `Token`) | Portal dạng Redoc / Swagger UI. **Giải pháp:** Trích xuất file OpenAPI Spec JSON trực tiếp từ script bundle. |
| | **GHTK** | `giaohangtietkiem.vn/api-docs` | Static Token (Header `Token`) | Trang HTML tĩnh liệt kê endpoint và ví dụ JSON. **Giải pháp:** Crawl HTML và trích xuất code block JSON Request/Response. |
| | **Viettel Post** | `partner.viettelpost.vn/v2/docs` | OAuth / Bearer Token đăng nhập | Cổng tài liệu bảo vệ bằng đăng nhập partner. **Giải pháp:** Cần tài khoản dev hoặc trích xuất tài liệu PDF/Postman do sale kỹ thuật cấp. |
| **4. CSKH & Mạng XH**| **Pancake** | `pages.fm/api/v1/docs` | API Key / Page Access Token | Tài liệu nội bộ hoặc Postman. **Giải pháp:** Intercept request từ Pancake Web Admin để reverse engineer endpoint nếu doc thiếu. |
| | **Facebook / IG** | `developers.facebook.com/docs/graph-api`| User / Page Access Token (OAuth2) | Tài liệu chính thức lớn, Graph API Explorer có sẵn JSON schema. **Giải pháp:** Dùng Meta Graph API Spec có sẵn trên OpenAPI directory. |
| **5. Bot / Thông Báo**| **Telegram Bot**| `core.telegram.org/bots/api` | Bot Token HTTP URL | Trang HTML dài duy nhất, cấu trúc cực kỳ chuẩn mực. **Giải pháp:** Parse trực tiếp HTML sang JSON hoặc dùng thư viện open-source telegram-bot-api spec. |
| | **Zalo OA / ZNS**| `developers.zalo.me/docs/api/*` | OAuth 2.0 (PKCE) + Secret Key | Portal phân mục rõ ràng, có SDK. **Giải pháp:** Crawl từng endpoint hoặc lấy cấu trúc từ official TypeScript SDK của Zalo. |
| **6. Tài Chính** | **VNPT e-Invoice**| `admin.vnpt-invoice.com.vn` | Basic Auth / WS-Security (SOAP / REST) | Tài liệu thường ở dạng PDF hoặc WSDL XML. **Giải pháp:** Dùng công cụ parse WSDL sang REST OpenAPI hoặc trích xuất bảng từ PDF. |
| **7. Tiện Ích** | **Google Sheets**| `developers.google.com/sheets/api/reference` | OAuth 2.0 / Service Account | Google cung cấp Discovery Document (OpenAPI format). **Giải pháp:** Tải trực tiếp `https://sheets.googleapis.com/$discovery/rest?version=v4`. |
| | **MS Excel** | `learn.microsoft.com/en-us/graph/api/resources/excel` | Microsoft Graph Token (OAuth2) | Microsoft cung cấp metadata CSDL OData $metadata XML / OpenAPI OAS 3.0. |

---

### **2. Chiến Thuật Kỹ Thuật: Làm Sao Để Cào Không Bị Chặn & Thu Được Schema Đầy Đủ?**

Hầu hết các tài liệu API hiện đại (đặc biệt là Shopee và TikTok Shop) **không phải là các trang HTML tĩnh thông thường**. Nếu dùng các công cụ crawler thô sơ như `curl` hay `BeautifulSoup`, bạn chỉ nhận về một trang HTML rỗng (`<div id="root"></div>`) hoặc bị Cloudflare chặn đứng với mã HTTP 403.

#### **Chiến thuật 1: Kỹ thuật Bắt Gói Tin Mạng Ngầm (Network Schema Interception)**
Khi bạn mở trình duyệt xem trang tài liệu của Shopee Open Platform hay TikTok Partner, trình duyệt của bạn thực chất gửi một request AJAX ngầm để lấy toàn bộ dữ liệu cấu trúc (data structure) của API đó dưới dạng JSON.
* **Cách thực hiện:** Mở Chrome DevTools $\rightarrow$ chuyển sang tab **Network** $\rightarrow$ lọc `Fetch/XHR` $\rightarrow$ gõ từ khóa `schema`, `doc`, `api_detail`, hoặc `v2`.
* **Kết quả:** Bạn sẽ lấy được file JSON chứa 100% định nghĩa trường, kiểu dữ liệu (string, int), mô tả, và mã lỗi mà không cần parse bất kỳ dòng HTML nào.

#### **Chiến thuật 2: Tự Động Hóa Bằng Playwright Headless Browser + Network Interceptor**
Xây dựng một script Node.js / TypeScript sử dụng Playwright để:
1. Tự động mở trang tài liệu với User-Agent và Cookies của trình duyệt thật.
2. Hook vào sự kiện `page.on('response')` để tự động lưu lại tất cả các gói tin JSON trả về từ backend của trang tài liệu.
3. Nếu trang có cây danh mục API (sidebar tree), script sẽ click lần lượt từng mục để trigger request tải dữ liệu.

---

# **PHẦN II: CHUẨN HÓA API DOCS DÀNH CHO AI CODE GENERATION (OPENAPI 3.1 + UDM EXTENDED)**

### **1. Tại Sao Doc Thô Khiến AI Sinh Code Bị Lỗi (Hallucination)?**
Khi đưa doc dạng văn bản tự do (raw text / markdown lộn xộn) vào cho LLM (Gemini, Claude, GPT) sinh code connector:
1. **Lỗi Auth & Signature:** AI thường tự bịa (hallucinate) chuỗi băm HMAC-SHA256 (ví dụ: thứ tự ghép chuỗi Shopee là `partner_id + path + timestamp + access_token + shop_id`, nếu đổi chỗ là sàn trả 401).
2. **Nhầm lẫn vị trí tham số:** Nhầm lẫn giữa Query Param, Path Param, Header, và Request Body.
3. **Mã trạng thái (Status Enum):** TikTok dùng `AWAITING_SHIPMENT`, Shopee dùng `READY_TO_SHIP`, KiotViet dùng `1, 2, 3`. AI không thể tự đoán nếu không có ma trận chuẩn hóa.
4. **Chuẩn hóa UDM:** AI không biết trường `recipient_address.full_address` của TikTok phải map vào `order.customer.shippingAddress.fullAddress` của UniFlow.

### **2. Đặc Tả Chuẩn Hóa: UniFlow Extended OpenAPI 3.1 Template**

Mỗi API sau khi cào về phải được chuyển đổi thành file định dạng **OpenAPI 3.1 (YAML/JSON)** với các thẻ mở rộng `x-uniflow-*`:

```yaml
openapi: 3.1.0
info:
  title: "UniFlow Connector Spec - TikTok Shop"
  version: "2024-09"
  description: "Chuẩn hóa API TikTok Shop phục vụ AI Code Generation và Mock Engine"

# Thẻ mở rộng cấu hình cấp nền tảng
x-uniflow-platform:
  code: "TIKTOK_SHOP"
  category: "MARKETPLACE"
  baseUrls:
    production: "https://open-api.tiktokglobalshop.com"
    sandbox: "https://open-api.tiktokglobalshop-sandbox.com"
  authType: "OAUTH2_HMAC"
  authConfig:
    tokenUrl: "https://auth.tiktok-shops.com/api/v2/token/get"
    tokenLifespanSeconds: 3600
    refreshStrategy: "AUTO_BACKGROUND_CRON"
    signatureFormula: "HMAC_SHA256(secret, app_key + path + timestamp + body)"

paths:
  /order/202309/orders:
    get:
      summary: "Truy vấn danh sách đơn hàng (Pull/Polling)"
      operationId: "tiktok_get_orders"
      x-uniflow-flow-type: "PULL_POLLING"
      x-uniflow-rate-limit:
        requestsPerMinute: 100
        circuitBreakerThreshold: 0.1
      parameters:
        - name: "order_status"
          in: "query"
          required: false
          schema:
            type: "string"
            enum: ["AWAITING_SHIPMENT", "AWAITING_COLLECTION", "IN_TRANSIT", "DELIVERED", "CANCELLED"]
      responses:
        '200':
          description: "Danh sách đơn hàng trả về"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/TikTokOrderResponse"

components:
  schemas:
    TikTokOrderPayload:
      type: "object"
      properties:
        order_id:
          type: "string"
          x-uniflow-udm-target: "order.sourceOrderId"
        order_status:
          type: "string"
          x-uniflow-udm-target: "order.status"
          x-uniflow-enum-mapping:
            AWAITING_SHIPMENT: "PAID"
            IN_TRANSIT: "SHIPPED"
            DELIVERED: "DELIVERED"
            CANCELLED: "CANCELLED"
        total_amount:
          type: "number"
          x-uniflow-udm-target: "order.totals.grandTotal"
        recipient_address:
          type: "object"
          properties:
            name:
              type: "string"
              x-uniflow-udm-target: "order.customer.maskedName"
            full_address:
              type: "string"
              x-uniflow-udm-target: "order.customer.shippingAddress.fullAddress"

  # Định nghĩa Webhook (Inbound Push)
  webhooks:
    order_status_change:
      post:
        summary: "Sự kiện thay đổi trạng thái đơn hàng từ TikTok (Push Webhook)"
        x-uniflow-flow-type: "PUSH_WEBHOOK"
        x-uniflow-hmac-header: "authorization"
        x-uniflow-idempotency-key: "order_id + event_type + timestamp"
        requestBody:
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/TikTokOrderPayload"
```

---

# **PHẦN III: PHÂN TÍCH KIẾN TRÚC HỆ THỐNG: UNIFLOW HUB, PULL/PUSH & MÔ HÌNH MCP**

### **1. Đánh Giá Khách Quan Ý Tưởng: "UniFlow Làm Trung Tâm, Xung Quanh Là Các MCP Riêng Biệt Cho Từng Ứng Dụng"**

Ý tưởng của Tuấn về việc dùng **Model Context Protocol (MCP)** là một góc nhìn rất tân tiến và có chiều sâu về mặt AI. Tuy nhiên, trong vai trò kỹ sư trưởng hệ thống, chúng ta cần phân tích rõ hai mặt:

```
                  ┌──────────────────────────────────────────────────────────┐
                  │                 AI COPILOT & AGENT PLANE                 │
                  │   Gemini 1.5 Flash / Claude Agent (Workflow Orchestration)│
                  └────────────────────────────┬─────────────────────────────┘
                                               │ (Tool Calls / JSON-RPC)
                      ┌────────────────────────▼────────────────────────┐
                      │            UNIFLOW MCP GATEWAY / REGISTRY       │
                      └───────┬──────────────────┬──────────────────┬───┘
                              │                  │                  │
                     ┌────────▼──────┐  ┌────────▼──────┐  ┌────────▼──────┐
                     │ Shopee MCP    │  │ KiotViet MCP  │  │ GHN MCP       │
                     │ Server (Stdio)│  │ Server (Stdio)│  │ Server (Stdio)│
                     └───────────────┘  └───────────────┘  └───────────────┘
                                      ▲
                                      │ (RỦI RO: Không đáp ứng được Mega Sale!)
══════════════════════════════════════╪══════════════════════════════════════════════════
                                      │ (GIẢI PHÁP: TÁCH LÀM 2 MẶT PHẲNG ĐỘC LẬP)
                                      ▼
                  ┌──────────────────────────────────────────────────────────┐
                  │            HIGH-THROUGHPUT EVENT DATA PLANE              │
                  │   NestJS Ingestion Engine + Redis / BullMQ Buffer Queue  │
                  └────────────────────────────┬─────────────────────────────┘
                                               │
                                 ┌─────────────▼─────────────┐
                                 │   UDM NORMALIZER PIPELINE │
                                 └─────────────┬─────────────┘
                                               │
                      ┌────────────────────────┼────────────────────────┐
                      ▼                        ▼                        ▼
              [Shopee Adapter]         [KiotViet Adapter]         [GHN Adapter]
```

#### **A. Ưu Điểm Tuyệt Vời Của MCP Khi Đặt Xung Quanh UniFlow:**
1. **AI Native Tool Calling:** Chuẩn MCP giúp LLM (Gemini / Claude) có thể tương tác trực tiếp với Shopee, Sapo, GHN mà không cần viết wrapper tùy biến.
2. **Cơ Chế Tự Chữa Lành (AI Self-Healing):** Khi một đơn hàng bị lỗi (ví dụ KiotViet báo hết hàng), AI Agent có thể truy cập `KiotViet MCP` để truy vấn kho phụ, hoặc dùng `Shopee MCP` để gửi tin nhắn cho khách.
3. **Phát Triển Độc Lập (Decoupled Micro-plugins):** Mỗi MCP Server có thể được viết bằng một ngôn ngữ bất kỳ (Python, Node.js, Go) và chạy trong container độc lập.

#### **B. Rủi Ro Chí Mạng Nếu Lấy MCP Làm Lõi Xử Lý Đơn Hàng (Data Pipeline):**
1. **Độ Trễ & Băng Thông (Throughput & Latency):** Trong đợt Mega Sale (11/11), hàng ngàn webhook ập tới mỗi giây. MCP sử dụng giao thức JSON-RPC qua stdio hoặc Server-Sent Events (SSE). Bắt từng đơn hàng đi qua LLM và MCP sẽ tạo độ trễ $1 - 3\text{s}$ và làm nghẽn hệ thống (Trong khi sàn TMĐT yêu cầu trả HTTP 200 trong vòng $< 0.5\text{s}$).
2. **Chi Phí Token LLM Khổng Lồ:** Nếu xử lý 100,000 đơn hàng/ngày qua LLM Prompt Tool Call, chi phí API Token sẽ tiêu tốn hàng chục triệu đồng mỗi tháng.
3. **Thiếu Khả Năng Đảm Bảo Giao Dịch (ACID / Distributed Idempotency):** MCP thiết kế cho ngữ cảnh Agent reasoning, không có hàng đợi phân tán (Distributed Queue), Dead Letter Queue (DLQ) hay Retry Policy chuẩn Enterprise.

#### **C. Kiến Trúc Hoàn Hảo Được Đề Xuất: Mô Hình Lai 2 Mặt Phẳng (Hybrid Two-Plane Architecture)**

1. **Mặt Phẳng Dữ Liệu Tốc Độ Cao (Data Plane - 99% Lưu lượng):**
   * Hoạt động theo mô hình **Event-Driven Architecture (EDA)** thuần túy.
   * Tiếp nhận Webhook $\rightarrow$ HMAC Check $\rightarrow$ Redis Idempotency $\rightarrow$ BullMQ $\rightarrow$ UDM Normalizer Service $\rightarrow$ Outbound Adapter.
   * Xử lý $< 50\text{ms}$, chịu tải $5,000\text{ req/s}$, chi phí token = 0.
2. **Mặt Phẳng Trí Tuệ Nhân Tạo & Điều Khiển (Control & Agent Plane - 1% Ngoại Lệ & Quản Trị):**
   * Các Connector được đóng gói thêm giao diện **MCP Server**.
   * Khi nào dùng?
     * Khi có lỗi cần AI Self-Healing can thiệp.
     * Khi nhân viên vận hành ra lệnh bằng Prompt tự nhiên: *"UniFlow ơi, kiểm tra xem tại sao đơn hàng #TTS_123 bên TikTok chưa thấy trừ kho KiotViet?"* $\rightarrow$ AI Copilot sẽ gọi `tiktok-mcp.getOrder` và `kiotviet-mcp.checkStock` để trả lời ngay lập tức!

---

### **2. Thiết Kế Cơ Chế Pull & Push Toàn Diện (Liên Tưởng SNMP / SDN)**

Sự liên tưởng của team về **SNMP (Simple Network Management Protocol)** và **SDN (Software-Defined Networking)** là một tư duy hệ thống rất chính xác:

```
                            ┌────────────────────────────────────────┐
                            │    UNIFLOW SDN CONTROLLER (BRAIN)      │
                            │  - Routing Rules Engine (React Flow)   │
                            │  - Flow Table: Policy & Rate Limiter   │
                            └───────────────────┬────────────────────┘
                                                │ (Cấu hình luồng dữ liệu)
         ═══════════════════════════════════════╪═══════════════════════════════════════
                                                │ (Thực thi chuyển mạch)
                        ┌───────────────────────▼───────────────────────┐
                        │      UNIFLOW DATA SWITCH (INGESTION HUB)      │
                        └───────┬───────────────────────────────▲───────┘
                                │                               │
                ┌───────────────▼───────────────┐               │
                │        PUSH MECHANISM         │               │ (Push Webhook)
                │    (Inbound Webhook Engine)   │               │
                └───────────────┬───────────────┘               │
                                │                               │
    ┌───────────────────────────┼───────────────────────────────┴───────────────────────────┐
    ▼                           ▼                               ▼                           ▼
[Shopee Webhook]      [TikTok Shop Webhook]             [Lazada Webhook]             [Sapo Webhook]
    ▲                           ▲                               ▲                           ▲
    │                           │                               │                           │
    └───────────────────────────┼───────────────────────────────┼───────────────────────────┘
                                │                               │
                ┌───────────────┴───────────────┐               │
                │        PULL MECHANISM         │ (Adaptive Polling)
                │   (Smart Polling Scheduler)   │
                └───────────────────────────────┘
```

#### **A. Cơ Chế PUSH (Inbound Webhook Engine - Hướng Sự Kiện)**
* **Nguyên tắc hoạt động:** Nhận diện sự kiện tức thời ngay khi sàn phát sinh đơn hàng.
* **Quy trình 4 bước chuẩn chỉ:**
  1. **Edge Ingestion:** Gateway bắt gói tin, tính toán HMAC-SHA256 signature đối chiếu header sàn. Trả `401 Unauthorized` ngay lập tức nếu sai chữ ký ($< 5\text{ms}$).
  2. **Idempotency Gate:** Tính toán khóa `IdempotencyKey = HASH(tenantId + platform + sourceOrderId + eventType)`. Tra cứu Redis Cache. Nếu tồn tại $\rightarrow$ Trả `200 OK` ngay lập tức để ngắt lặp.
  3. **Queue Buffering:** Đẩy payload thô vào hàng đợi `BullMQ` (hàng đợi phân tán trên Redis).
  4. **ACK Trả Ngược Sàn:** Trả mã `HTTP 200 SUCCESS` về cho TikTok/Shopee trong vòng **$< 0.2\text{s}$** (đáp ứng xuất sắc cam kết SLA của sàn).
  5. **Worker Execution:** Worker ngầm lấy dữ liệu từ hàng đợi, đưa qua `UDMNormalizerService` để chuẩn hóa sang `UniversalOrderModel`, sau đó đẩy sang kênh đích (POS/Logistics).

#### **B. Cơ Chế PULL (Smart Adaptive Polling Engine - Quét Chủ Động)**
* **Tại sao bắt buộc phải có Pull dù đã có Push?**
  1. Một số nền tảng hoặc gói tài khoản không hỗ trợ Webhook (hoặc Webhook bị nghẽn mạng làm rớt gói tin).
  2. Đơn vị vận chuyển (GHN, GHTK) đôi khi cập nhật trạng thái giao hàng nhưng Webhook gửi chậm trễ.
  3. Cơ chế đối soát (Reconciliation Job): Quét toàn bộ đơn hàng lúc nửa đêm để bắt các đơn bị "rơi rớt" do sự cố đường truyền.
* **Kỹ thuật Adaptive Polling (Quét Tần Số Thích Ứng):**
  * **Thuật toán con trỏ mốc thời gian (Watermarking / Cursor-based):** Lưu trữ giá trị `last_synced_at` trong Redis. Mỗi lần quét chỉ lấy đơn thỏa mãn `updated_at >= last_synced_at - 5 minutes` (trừ hao 5 phút bù trừ lệch đồng hồ server sàn).
  * **Tần số động (Dynamic Frequency):**
    * Ban ngày / Giờ cao điểm (8h - 22h): Polling mỗi **30 giây/lần**.
    * Ban đêm (23h - 7h): Giảm tần số xuống **10 phút/lần** để tiết kiệm tài nguyên và tránh bị sàn phạt Rate Limit.
    * Khi phát hiện lỗi liên tục (HTTP 429 hoặc 5xx): Kích hoạt **Exponential Backoff** ($2\text{s} \rightarrow 4\text{s} \rightarrow 8\text{s} \rightarrow 16\text{s} \dots$) kết hợp **Circuit Breaker**.

---

# **PHẦN IV: GIẢI PHÁP THỰC CHIẾN SÀN TMĐT: ĐÁNH GIÁ 4 PHƯƠNG ÁN & MA TRẬN RỦI RO**

### **1. Đánh Giá Toàn Diện 4 Phương Án**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           MA TRẬN LỰA CHỌN PHƯƠNG ÁN TÍCH HỢP SÀN TMĐT                          │
├───────────────────┬──────────────┬──────────────┬──────────────────┬────────────────────────────┤
│ Phương Án         │ Tính Khả Thi │ Chi Phí      │ Độ Rủi Ro        │ Khuyến Nghị Áp Dụng        │
├───────────────────┼──────────────┼──────────────┼──────────────────┼────────────────────────────┤
│ P1: Mock Simulator│ Cực cao      │ 0 VNĐ        │ 0% (Hoàn toàn    │ BẮT BUỘC TRIỂN KHAI NGAY   │
│ (Hệ thống Giả lập)│ (Làm chủ)    │              │ an toàn)         │ cho Đỗ Minh & Kim test dev │
├───────────────────┼──────────────┼──────────────┼──────────────────┼────────────────────────────┤
│ P2: Sandbox Chính │ Trung bình   │ Cần pháp nhân│ Thấp             │ Triển khai song song cho   │
│ thức / Mượn Acc   │ (Tùy sàn)    │ hoặc hồ sơ   │                  │ Lazada & TikTok Shop       │
├───────────────────┼──────────────┼──────────────┼──────────────────┼────────────────────────────┤
│ P3: Headless Bot  │ Khó          │ Cao (Proxy,  │ Cực cao          │ KHÔNG DÙNG CHO PRODUCTION  │
│ / Hắc ám          │ (Anti-bot)   │ Captcha API) │ (Khóa vĩnh viễn) │ Chỉ dùng nghiên cứu payload│
├───────────────────┼──────────────┼──────────────┼──────────────────┼────────────────────────────┤
│ P4: Tài khoản Dev │ Cao          │ Chi phí tạo  │ Trung bình       │ Dùng để bắt gói HAR trích  │
│ Tự tạo (Seller UI)│ (Thủ công)   │ shop test    │ (Chỉ shop test)  │ xuất Schema chuẩn bị cho P1│
└───────────────────┴──────────────┴──────────────┴──────────────────┴────────────────────────────┘
```

#### **Phương Án 1 (P1 - CỐT LÕI): Xây Dựng UniFlow Multi-Platform Mock Simulator**
* **Mục tiêu:** Tạo ra một máy chủ ảo mô phỏng 100% API của Shopee, TikTok Shop, Lazada dựa trên OpenAPI Spec đã chuẩn hóa.
* **Cơ chế hoạt động:**
  1. Chạy một service NestJS / Fastify độc lập (hoặc dùng Prism Mock Server).
  2. Cung cấp đầy đủ các endpoint: `/order/get_order_detail`, `/inventory/update_stock`, `/logistics/ship_order`.
  3. Tích hợp một nút bấm giả lập trên giao diện test của Kim: *"Giả lập khách bấm mua đơn TikTok"* $\rightarrow$ Mock Server sẽ tự động ký HMAC và bắn webhook thật vào `http://localhost:3000/api/v1/webhooks/tiktok/tenant_test`.
* **Lợi ích:** Đỗ Minh có thể viết code và test hoàn thiện toàn bộ luồng UDM, đồng bộ kho POS, đẩy đơn GHN mà **không phụ thuộc 1 giây nào vào việc sàn đã duyệt tài khoản hay chưa**.

#### **Phương Án 2 (P2): Khai Thác Sandbox Chính Thức**
* **Lazada:** Sandbox mở sẵn cho lập trình viên, có thể tạo app test ngay lập tức trên Lazada Open Platform. Điểm hạn chế: Sản phẩm test và người mua test bị cô lập, đôi khi một số API logistics không phản hồi.
* **TikTok Shop:** Có thể đăng ký tài khoản TikTok Shop Partner Center dạng **Custom App**. Custom App cho phép liên kết tối đa 25 shop thử nghiệm mà không cần kiểm duyệt khắt khe như Public App.
* **Shopee:** Yêu cầu tài khoản ISV Partner có mã số thuế doanh nghiệp. Trong thời gian chờ Duy và Huyền xử lý pháp lý, team chuyển toàn bộ việc phát triển sang P1 (Mock).

#### **Phương Án 3 & 4 (P3 & P4): Kỹ Thuật Bắt HAR / Reverse Engineering & Ma Trận Rủi Ro**
* **Cách thực hiện an toàn:**
  1. Tạo một tài khoản nhà bán hàng cá nhân thông thường trên TikTok Shop Seller Center hoặc Shopee Kênh Người Bán.
  2. Mở Chrome DevTools $\rightarrow$ Bật tính năng lưu log (Preserve log).
  3. Thao tác tay các nghiệp vụ: Đăng 1 sản phẩm ảo, tự tạo đơn hàng bằng tài khoản phụ, bấm xác nhận đơn hàng.
  4. Xuất toàn bộ traffic thành file **`.har` (HTTP Archive)**.
  5. Dùng script bóc tách file `.har` để lấy chuẩn xác: Header thật, Cookie thật, Request body thật, và Response data thật.
  6. **Đổ toàn bộ dữ liệu này vào Mock Simulator (P1).**
* **Cảnh Báo 4 Rủi Ro Chí Mạng Nếu Chạy "Hắc Ám" (Headless Bot) Trên Môi Trường Thực Tế Của Khách Hàng:**
  1. **Khóa Shop Vĩnh Viễn:** Shopee và TikTok sở hữu hệ thống Anti-Fraud cực mạnh (sử dụng Akamai Bot Manager, Arkose Labs, Geetest). Nếu phát hiện truy vấn không có chữ ký thiết bị thật, sàn sẽ khóa tài khoản người bán và phong tỏa toàn bộ tiền hàng.
  2. **Gãy Luồng Đột Ngột:** API giao diện web nội bộ có thể thay đổi bất cứ ngày nào mà không báo trước, khiến hệ thống UniFlow lăn ra chết đột ngột.
  3. **Rủi Ro Pháp Lý:** Vi phạm nghiêm trọng Điều khoản Dịch vụ (Terms of Service - ToS) và Luật An ninh mạng về hành vi thu thập dữ liệu trái phép.
  * $\rightarrow$ **Kết Luận Chiến Lược:** Chỉ sử dụng P4 trong phòng thí nghiệm để lấy mẫu dữ liệu (Schema extraction), sau đó phục vụ P1 (Mock Engine). Khi thương mại hóa, 100% phải đi qua P2 (Official ISV API).

---

# **PHẦN V: KẾ HOẠCH PHÂN CÔNG & DELIVERABLES CỤ THỂ CHO TUẤN & TEAM**

### **1. Lộ Trình Phân Công Nhiệm Vụ (Sprint 1 - 2 Tuần)**

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              SƠ ĐỒ PHỐI HỢP CÔNG VIỆC TEAM                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [Duy & Huyền]                                                                         │
│  - Nghiên cứu chính sách TikTok Partner & Shopee Open Platform.                        │
│  - Tạo tài khoản Seller cá nhân / Custom App Sandbox.                                  │
│                                      │                                                 │
│                                      ▼                                                 │
│  [Tuấn - Lead Integrator] ─────────────────────────────────────────────────────────┐   │
│  - Chạy Script cào API Docs & trích xuất JSON Schema.                              │   │
│  - Bóc tách file HAR từ tài khoản test của Duy/Huyền.                              │   │
│  - Chuẩn hóa thành bộ tài liệu OpenAPI 3.1 + UDM Schema.                           │   │
│  - Xây dựng UniFlow Multi-Platform Mock Simulator Server.                          │   │
│                                      │                                             │   │
│                                      ▼                                             │   │
│  [Kim - QA / Infra]                                                                │   │
│  - Dựng môi trường test, nạp dữ liệu mẫu (Dummy Products, Customers).              │   │
│  - Viết kịch bản test (Test Cases) các trạng thái đơn hàng.                         │   │
│                                      │                                             │   │
│                                      ▼                                             │   │
│  [Đỗ Minh - Backend Integrator]                                                    │   │
│  - Lấy OpenAPI Spec và Mock Server từ Tuấn để gen code NestJS Adapters.            │   │
│  - Tích hợp pipeline UDM Normalizer và trừ kho tự động.                            │   │
│  - Chạy integration test trên hạ tầng của Kim.                                     │   │
└────────────────────────────────────────────────────────────────────────────────────┘───┘
```

### **2. Check-list Sản Phẩm Bàn Giao Của Tuấn (Tuấn's Deliverables)**

* [x] **Deliverable 1:** Bộ tài liệu chiến lược và phân tích kiến trúc (Tài liệu này).
* [ ] **Deliverable 2:** Thư mục `tools/crawler/` chứa script Playwright cào tự động và trích xuất JSON Schema từ các cổng Portal.
* [ ] **Deliverable 3:** Bộ chuẩn hóa `packages/connectors-spec/` chứa các file `openapi.json` chuẩn hóa có kèm metadata UDM cho 7 nhóm nền tảng.
* [ ] **Deliverable 4:** Máy chủ giả lập `tools/mock-server/` cung cấp mock API cho Shopee, TikTok Shop, Lazada, KiotViet, GHN để bàn giao cho Đỗ Minh và Kim.
* [ ] **Deliverable 5:** Bộ Prompt Template chuẩn hóa để Đỗ Minh dùng AI (Gemini 1.5 Flash / Claude) sinh mã nguồn TypeScript Adapter chỉ trong 30 giây.
