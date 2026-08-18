# **UNIFLOW AI — ĐẶC TẢ GIAO DIỆN NGƯỜI DÙNG & TRẢI NGHIỆM FRONTEND (UI/UX SPECIFICATION)**

> **Tài liệu thuộc Phân hệ Kỹ thuật:** Đặc tả chi tiết cấu trúc giao diện, luồng tương tác, hệ thống Design System và linh kiện UI (Components) cho ứng dụng Web Dashboard của UniFlow AI.

---

## **PHẦN I: HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM & THEME TOKENS)**

### **1. Định hướng thẩm mỹ & Bộ nhận diện Thương hiệu (Brand Identity)**
* **Biểu tượng Logo (Logo Motif):** Dải băng vô cực đa chiều (*Infinity Data Flow Ribbon*) tượng trưng cho dòng chảy dữ liệu tuần hoàn 24/7, sự kết nối không đứt gãy giữa Sàn TMĐT ── Kho POS ── Hãng Vận chuyển và khả năng xử lý tức thì của trí tuệ nhân tạo.
* **Màu sắc chủ đạo (Brand Color):**
  * **Primary (PTIT_Aka Crimson Red):** `#ed1c24` biểu trưng cho nhiệt huyết, tốc độ và bản sắc PTIT_Aka.
  * **Secondary (Solar Gold Yellow):** `#fcc20f` biểu trưng cho sự thịnh vượng, điểm nhấn AI và năng lượng tuần hoàn.
* **Công nghệ & Thư viện UI:** **React 18 + Ant Design (`antd`)** kết hợp tiền xử lý **Less (`.less`)** và **React Flow** cho Canvas kéo thả.
* **Phong cách:** *Modern SaaS / High-Tech Glassmorphism & Cyber-Clean Minimal*.
* **Chế độ hiển thị:** Hỗ trợ song song **Dark Mode** (`theme.darkAlgorithm`, slate `#0B0F19`) và **Light Mode**.
* **Typography:** 
  * Font chữ chính: **Plus Jakarta Sans** / **Inter** (Google Fonts).
  * Monospace cho Code/JSON/Logs: **JetBrains Mono** / **Fira Code**.

### **2. Bảng mã màu tiêu chuẩn (Color Palette Tokens)**

| Loại màu | Biến Less / Token | HEX / HSL | Ứng dụng thực tế |
| :--- | :--- | :--- | :--- |
| **Primary (PTIT_Aka Red)** | `@primary-aka-red` / `colorPrimary` | `#ed1c24` (Crimson Red) | Màu logo, nút CTA chính, thương hiệu cốt lõi |
| **Secondary (Solar Gold)** | `@secondary-solar-gold` / `colorWarning` | `#fcc20f` (Solar Yellow Gold) | Điểm nhấn AI Glow, cảnh báo cần review, badge |
| **Primary Gradient** | `@brand-gradient` | `linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)` | Nền Logo, Nút Premium CTA, Viền phát sáng Canvas |
| **Primary Glow** | `@primary-glow-red`| `rgba(237, 28, 36, 0.35)` | Hiệu ứng phát sáng node đang chạy, badge live |
| **Accent / AI Magic**| `@accent-ai-purple` | `#8B5CF6` (Neon Purple) | Lõi AI Agent, thanh Prompt-to-Workflow, gợi ý SKU |
| **Success (Online/Synced)** | `@color-success` | `#10B981` (Emerald) | Đồng bộ thành công, Node xanh, Live Webhook |
| **Warning (Need Review)** | `@color-warning` | `#fcc20f` (Solar Gold) | Khớp SKU 70-95%, Token sắp hết hạn, Retry |
| **Danger (Error/Failed)** | `@color-danger` | `#EF4444` (Rose/Red) | Lỗi API sàn, đứt kết nối, hủy đơn |
| **Background (Dark)** | `@bg-dark-900` | `#0B0F19` (Deep Slate) | Nền tổng thể Dark Mode |
| **Surface / Card (Dark)** | `@surface-dark-800`| `#111827` (Border: `#1F2937`) | Card Antd, Dialog, Node Container |
| **Text Primary** | `@text-dark-primary` | `#F9FAFB` (Dark) / `#111827` (Light)| Tiêu đề, số liệu chính |

---

## **PHẦN II: SƠ ĐỒ CẤY TRANG & ĐIỀU HƯỚNG (SITEMAP & NAVIGATION)**

```
UniFlow Dashboard
├── 1. Overview Dashboard (/dashboard) ────────── [Real-time Ops Hub, KPIs, Live Feed]
├── 2. Workflow Builder (/workflows) ──────────── [React Flow Canvas, Node Library, Prompt-to-Flow]
│   ├── /workflows/list                          [Danh sách luồng tự động]
│   └── /workflows/:id/edit                      [Giao diện kéo-thả chi tiết]
├── 3. Connectors Hub (/connectors) ───────────── [Kết nối Sàn, POS, Hãng Vận chuyển]
│   ├── /connectors/marketplaces                 [Shopee, TikTok Shop, Lazada]
│   ├── /connectors/pos-erp                      [KiotViet, Sapo, Haravan]
│   └── /connectors/logistics                    [GHN, GHTK, Viettel Post]
├── 4. AI SKU Mapping Table (/mapping) ────────── [Bảng ánh xạ SKU Thông minh, Duyệt 1-Click]
├── 5. Real-time Logs & Healing (/logs) ───────── [Live WebSocket Stream, Tự chữa lành lỗi]
├── 6. Smart Carrier Routing (/logistics-rules) ─ [Quy tắc cước vận chuyển, tối ưu giao hàng]
└── 7. Organization & Security (/settings) ────── [Quản lý Multi-Tenant, API Keys, RLS, Audit]
```

---

## **PHẦN III: ĐẶC TẢ CHI TIẾT CÁC MÀN HÌNH CHÍNH**

### **1. Màn hình Dashboard Tổng quan (`/dashboard`)**

#### **A. Hàng thẻ chỉ số thời gian thực (KPI Metric Cards):**
* **Thẻ 1 — Tổng đơn hàng đã đồng bộ:** Hiển thị số lượng (VD: `42,850` đơn), badge tăng trưởng `+18.4% hôm nay`, biểu đồ mini sparkline.
* **Thẻ 2 — Độ trễ trung bình hệ thống (End-to-End Latency):** Hiển thị `180ms` (Màu xanh neon), trạng thái *"Siêu tốc"*.
* **Thẻ 3 — Tỷ lệ đồng bộ thành công (Sync Success Rate):** Hiển thị `99.98%` (Đạt chuẩn SLA Enterprise).
* **Thẻ 4 — Chi phí & Thời gian tiết kiệm:** Quy đổi `142 giờ công` & `~21.5 triệu VNĐ` chi phí nhân sự thủ công trong tháng.

#### **B. Khung Live Data Stream (Event Pulse Tracker):**
* Hiển thị dòng dữ liệu WebSocket các sự kiện đang nhảy liên tục:
  * `[TikTok Shop] Đơn hàng #TTS-88231 -> Nhận diện SKU 'AT-COT-01' -> Trừ kho Sapo -> Tạo vận đơn GHTK (0.23s) ✅`
  * `[Shopee] Đơn #SP-99120 -> AI Auto-Healed: GHN timeout -> Reroute sang GHTK (0.41s) ⚡`

#### **C. Biểu đồ thông lượng đa kênh (Multi-channel Traffic Flow Chart):**
* Biểu đồ phân bổ nguồn đơn theo kênh (TikTok Shop 55%, Shopee 35%, KiotViet 10%).

---

### **2. Màn hình Visual Workflow Builder (`/workflows/:id/edit`)**

Đây là "trái tim" giao diện của UniFlow AI, xây dựng trên thư viện **React Flow** cho phép người dùng kéo thả các khối chức năng.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  [Logo] Workflow: "Đồng bộ đơn TikTok sang Kho Sapo & Tự động tạo GHTK"   [Test Run] [Save]  │
├─────────────────┬────────────────────────────────────────────────────────────┬───────────────┤
│ THƯ VIỆN NODES │                   CANVAS KHÔNG GIAN (REACT FLOW)           │ NODE SETTINGS │
│                 │                                                            │ (INSPECTOR)   │
│ [⚡ Triggers]   │    ┌──────────────────┐                                    │               │
│ - TikTok Order  │    │ ⚡ TikTok Inbound │                                    │ Cấu hình      │
│ - Shopee Order  │    │  (New Order Webhook)                                 │ TikTok Webhook│
│ - Stock Low     │    └────────┬─────────┘                                    │ - Shop: AK-01 │
│                 │             │                                              │ - Status: PAID│
│ [🧠 AI Agent]   │    ┌────────▼─────────┐                                    │               │
│ - SKU Mapper    │    │ 🧠 AI SKU Matcher │                                    │ Bộ lọc sự kiện│
│ - Error Healer  │    │  (Conf. >= 95%)   │                                    │ [x] Validate  │
│ - Route Picker  │    └────────┬─────────┘                                    │     HMAC      │
│                 │             │                                              │               │
│ [⚙️ Actions]    │      ┌──────┴──────┐                                       │ Schema:       │
│ - Deduct Stock  │      ▼             ▼                                       │ Universal     │
│ - Create Waybill│ ┌──────────┐ ┌──────────┐                                  │ Order Model   │
│ - Send Zalo/Tele│ │ POS Sapo │ │ Auto GHTK│                                  │               │
│                 │ └──────────┘ └──────────┘                                  │               │
└─────────────────┴────────────────────────────────────────────────────────────┴───────────────┘
│ 🪄 PROMPT-TO-WORKFLOW BAR: "Khi có đơn hàng trên Shopee trị giá > 500k, tự động trừ kho..." [Tạo]
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### **A. Thanh công cụ Prompt-to-Workflow (AI Workflow Generator):**
* Input box hỗ trợ ngôn ngữ tự nhiên tiếng Việt:
  * Người dùng nhập: *"Khi có đơn hàng mới từ TikTok Shop, hãy kiểm tra tồn kho trên KiotViet; nếu còn hàng thì tạo đơn GHTK cước rẻ nhất, nếu hết hàng gửi tin nhắn Telegram báo quản trị viên."*
  * Bấm nút **"🪄 Tạo Luồng Tự Động"** $\rightarrow$ Hệ thống gọi LLM Gemini 1.5 Flash sinh ra cấu trúc JSON Node/Edge tương ứng và hiển thị trực tiếp lên Canvas trong 2 giây.

#### **B. Các loại Node hỗ trợ trên Canvas:**
1. **Trigger Nodes (Sự kiện kích hoạt):**
   * Webhook sự kiện đơn mới (TikTok, Shopee, Lazada).
   * Sự kiện biến động tồn kho (Kho nội bộ, POS).
   * Lịch chạy định kỳ (Cron Trigger).
2. **Logic & Filter Nodes (Điều kiện):**
   * If/Else nhánh điều kiện (Giá trị đơn hàng $> X$, Khu vực nội thành/ngoại thành).
   * Deduplicate Filter (Chống đơn trùng).
3. **AI Cognitive Nodes (Xử lý thông minh):**
   * *AI SKU Matcher:* Tự khớp tên sản phẩm phi cấu trúc sang SKU chuẩn.
   * *AI Dynamic Carrier Router:* So sánh bảng giá các hãng vận chuyển thời gian thực để chọn đơn vị tối ưu.
   * *AI Fraud/Anomaly Detection:* Phát hiện dấu hiệu đơn ảo / bùng hàng.
4. **Action Nodes (Hành động):**
   * Trừ tồn kho / Khóa tồn kho ảo (*Reserve Stock*).
   * Tạo phiếu xuất kho POS / ERP.
   * Đẩy lệnh in vận đơn ra máy in tem nhiệt (qua Agent in cục bộ).
   * Gửi thông báo Zalo ZNS / Telegram Bot / SMS.

---

### **3. Màn hình Quản lý Kênh Kết nối (`/connectors`)**

* **Giao diện dạng Grid Card hiện đại:** Mỗi nền tảng là một thẻ Card với logo nhận diện:
  * **TikTok Shop:** Trạng thái `Đã kết nối` | `Token hết hạn trong 52 phút` | Nút `[Làm mới ngay]`.
  * **Shopee:** Trạng thái `Đã kết nối` | `HMAC-SHA256 Active` | `Uptime: 100%`.
  * **KiotViet / Sapo:** Trạng thái `Đang đồng bộ` | `Webhooks: 3 đang lắng nghe`.
  * **Giao Hàng Tiết Kiệm (GHTK):** `API Token Valid` | `Số dư cước: 4,500,000đ`.
* **Modal tích hợp 1-Click (OAuth Modal):**
  * Nhấp "Thêm kết nối mới" $\rightarrow$ Hiển thị danh mục $\rightarrow$ Bấm "Ủy quyền Shopee" $\rightarrow$ Mở Popup OAuth Shopee Open Platform $\rightarrow$ Tự động lưu Token và kích hoạt Webhook chỉ trong 30 giây.

---

### **4. Bảng ánh xạ SKU Thông minh (`/mapping`)**

Giải quyết bài toán "Tên sản phẩm trên Sàn khác với Tên mã trong Kho".

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Tìm kiếm SKU / Tên sản phẩm...   [Bộ lọc: Tất cả | Cần duyệt (3) | Đã tự động khớp (140)]           │
├──────────────────────┬──────────────────────┬────────────┬──────────────┬──────────────┬───────────────┤
│ TÊN TRÊN SÀN (SOURCE)│ SKU KHO NỘI BỘ (POS) │ ĐỘ TIN CẬY │ THUỘC TÍNH   │ TRẠNG THÁI   │ HÀNH ĐỘNG     │
├──────────────────────┼──────────────────────┼────────────┼──────────────┼──────────────┼───────────────┤
│ Áo thun nam Cotton   │ AT-COT-BLK-L         │   98.5%    │ Màu: Đen     │ [🟢 Khớp Tự  │ [Chi tiết]    │
│ Basic Cổ Tròn Đen L  │ (Kho Tổng Sapo)      │ (Rất cao)  │ Size: L      │    Động]     │ [Hủy liên kết]│
├──────────────────────┼──────────────────────┼────────────┼──────────────┼──────────────┼───────────────┤
│ Combo 3 Tất Cổ Ngắn  │ TAT-COT-TRANG-SET3   │   84.2%    │ SL: 3 đôi    │ [🟡 Chờ Duyệt│ [✅ Chấp nhận] │
│ Dệt Kim Kháng Khuẩn  │ (KiotViet)           │ (Trung bình│ Màu: Trắng   │   1-Click]   │ [✏️ Chọn lại] │
├──────────────────────┼──────────────────────┼────────────┼──────────────┼──────────────┼───────────────┤
│ Set đồ bộ nỉ thu đông│ CHƯA XÁC ĐỊNH        │   45.0%    │ Màu: Ghi xám │ [🔴 Cần Ghép │ [➕ Ghép mã]   │
│ unisex form rộng     │ (Không tìm thấy SKU) │ (Thấp)     │ Size: XL     │    Thủ công] │               │
└──────────────────────┴──────────────────────┴────────────┴──────────────┴──────────────┴───────────────┘
```

* **Điểm sáng UX (Wow Feature):**
  * Nút **"✅ Duyệt hàng loạt (Bulk Approve)"** cho các gợi ý có điểm $> 80\%$.
  * Tag màu độ tin cậy: Xanh lá ($\ge 95\%$), Vàng cam ($70 - 94\%$), Đỏ ($< 70\%$).

---

### **5. Trung tâm Nhật ký & Tự chữa lành lỗi (`/logs`)**

* **Live WebSocket Console:** Giao diện dạng Dark Terminal hiển thị trực quan các luồng thực thi:
  * Timestamp: `21:35:10.102`
  * Trace ID: `tr_9f8a2b3c`
  * Action: `INBOUND_WEBHOOK_TIKTOK`
  * Latency: `84ms`
  * Status: `200 OK`
* **Modal Chi tiết sự cố & AI Healing:**
  * Khi nhấp vào một sự kiện có gắn cờ `AI_HEALED`:
  * *Nguyên nhân:* `"API GHTK trả về mã lỗi 503 Service Unavailable (Quá tải máy chủ lúc 20:00)."`
  * *Quyết định của AI Agent:* `"Tự động kích hoạt luồng dự phòng (Fallback Node #2), chuyển đối tác sang GHN với mức cước tương đương (22,000đ vs 21,500đ), tạo thành công mã vận đơn #GHN99812."`
  * *Kết quả:* Không làm gián đoạn đơn hàng của người bán.

---

## **PHẦN IV: THIẾT KẾ ĐÁP ỨNG (RESPONSIVE) & KHẢ NĂNG TIẾP CẬN (A11Y)**

1. **Desktop & Máy trạm (>= 1280px):** Trải nghiệm đầy đủ 100% chức năng, Canvas Builder mở rộng, Multi-panel.
2. **Tablet & iPad (768px - 1024px):** Dashboard thu gọn, Canvas Builder hỗ trợ cử chỉ cảm ứng 2 ngón tay (Pinch to zoom, Drag to pan).
3. **Mobile Responsive (< 768px):** Ưu tiên chế độ xem nhanh: Thẻ KPI, Danh sách đơn gần nhất, Phê duyệt nhanh ánh xạ SKU 1-Click, và nhận Push Notification cảnh báo sự cố.
