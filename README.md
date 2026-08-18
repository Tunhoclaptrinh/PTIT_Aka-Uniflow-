# **⚡ UNIFLOW AI — OMNICHANNEL IPAAS & AI MIDDLEWARE**

> **Nền tảng Tích hợp Dữ liệu Đa kênh Tự động hóa với Trí tuệ Nhân tạo Dành cho Thương mại Điện tử Việt Nam.**  
> *Phát triển bởi Đội ngũ PTIT Aka.*

---

## 🎨 **BỘ NHẬN DIỆN THƯƠNG HIỆU & MÀU SẮC (BRAND IDENTITY)**

| Màu sắc | Mã HEX | Vai trò trong Hệ thống & Giao diện |
| :--- | :--- | :--- |
| **Aka Crimson Red** | `#ed1c24` | **Màu thương hiệu chính (Primary Color)**: Logo, nút hành động chính (Primary CTA), trạng thái Active, điểm nhấn đồ họa. |
| **Solar Gold Yellow** | `#fcc20f` | **Màu phụ trợ (Secondary Color)**: Điểm nhấn AI Glow, cảnh báo cần xử lý (Review Required), Gradient thương hiệu. |
| **Brand Gradient** | `linear-gradient(135deg, #ed1c24 0%, #fcc20f 100%)` | Nền Logo, Banner nổi bật, Viền phát sáng Canvas React Flow, Badge Premium. |
| **Deep Slate Dark** | `#0B0F19` | Nền giao diện tối ưu (Dark Mode) cho kỹ thuật và vận hành thời gian thực. |

---

## 🏗️ **KIẾN TRÚC TỔNG QUAN HỆ THỐNG (MONOREPO ARCHITECTURE)**

Dự án được tổ chức theo mô hình **Monorepo** phân tách rõ ràng giữa các phân hệ giao diện, dịch vụ backend, lõi AI microservice, thư viện dùng chung và hạ tầng Docker:

```
UniFlow-PTIT_Aka/
├── apps/                                   # Các ứng dụng và dịch vụ chính
│   ├── web/                                # [FRONTEND] React + Ant Design + Less + React Flow
│   ├── backend/                            # [BACKEND] NestJS API Gateway & Webhook Pipeline
│   └── ai-engine/                          # [AI ENGINE] Python FastAPI + Qdrant + Gemini
│
├── packages/                               # Thư viện & Cấu hình dùng chung (Shared Packages)
│   ├── udm-schema/                         # Universal Data Model JSON Schemas & TypeScript Types
│   └── shared-types/                       # Shared Enums, Constants & Brand Tokens
│
├── infra/                                  # Hạ tầng triển khai Docker, Reverse Proxy & DB Init
│   ├── docker-compose.yml                  # Full-stack Container Stack (Web, Backend, AI, DBs)
│   ├── docker-compose.dev.yml              # Local DB stack (MongoDB, Redis, Qdrant)
│   ├── mongo-init/                         # MongoDB Indexes & Collections init
│   └── nginx/                              # Nginx Reverse Proxy Config
│
├── scripts/                                # Công cụ hỗ trợ phát triển, kiểm thử & nạp dữ liệu
│   ├── simulate_webhook.js                 # Giả lập bắn Webhook TikTok / Shopee kèm chữ ký HMAC
│   ├── seed_database.js                    # Khởi tạo mock data (Shop, Đơn hàng, SKU, Workflow)
│   └── test_ai_matching.py                 # Script test nhanh thuật toán khớp SKU AI
│
├── docs/                                   # Toàn bộ tài liệu phân tích nghiệp vụ & đặc tả kỹ thuật
├── logo/                                   # File thiết kế Logo gốc (.ai / .svg / .png)
├── .env.example                            # Biến môi trường mẫu cho toàn bộ hệ thống
├── .gitignore                              # Quy tắc loại trừ tệp Git
├── package.json                            # Cấu hình Monorepo Workspaces & Root Scripts
└── README.md                               # Tài liệu hướng dẫn tổng quan (File này)
```

---

## 🧩 **MA TRẬN CÔNG NGHỆ (TECH STACK MATRIX)**

| Phân hệ | Ngôn ngữ / Framework | Thư viện & Công cụ cốt lõi | Vai trò & Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | React 18, TypeScript | **Ant Design (`antd`)**, **Less**, **React Flow**, Axios, Socket.io-client | Giao diện Dashboard quản trị, Canvas kéo-thả luồng dữ liệu trực quan, Bảng khớp SKU, Real-time Live Log. |
| **Backend Core** | Node.js, TypeScript, **NestJS** | BullMQ, Redis, Mongoose, Crypto (HMAC, AES-256-GCM), WebSockets | Bộ tiếp nhận Webhook $< 0.5\text{s}$, Xác thực chữ ký số, Idempotency 24h, UDM Normalizer, Connectors POS/Logistics. |
| **AI Engine** | Python 3.10+, **FastAPI** | **Google Gemini 1.5 Flash**, **Qdrant Vector DB**, Pydantic, Loguru | Thuật toán Hybrid Scoring khớp SKU kho, Chẩn đoán lỗi & Tự chữa lành luồng (Self-Healing), Định tuyến cước thông minh. |
| **Databases** | MongoDB & Redis | MongoDB 7.0 (Documents, Workflows), Redis 7.2 (Idempotency, Queue) | Lưu trữ linh hoạt, đảm bảo độ trễ phản hồi thấp và chống trùng lặp đơn hàng. |
| **Vector Engine**| Qdrant | HNSW Cosine Similarity Index (768 chiều) | So khớp ngữ nghĩa tên sản phẩm sàn TMĐT và SKU kho POS. |

---

## 🚀 **HƯỚNG DẪN KHỞI CHẠY NHANH (QUICK START)**

### **1. Chuẩn bị biến môi trường**
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
```

### **2. Khởi chạy Hạ tầng Cơ sở dữ liệu (Docker)**
Khởi động MongoDB, Redis và Qdrant Vector DB:
```bash
docker-compose -f infra/docker-compose.dev.yml up -d
```

### **3. Khởi chạy Dịch vụ AI Engine (Python FastAPI)**
```bash
cd apps/ai-engine
python -m venv venv
# Trên Windows:
.\venv\Scripts\activate
# Trên Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### **4. Khởi chạy Backend API Gateway (NestJS)**
```bash
cd apps/backend
npm install
npm run start:dev
```

### **5. Khởi chạy Frontend Dashboard (React + Antd + Less)**
```bash
cd apps/web
npm install
npm run dev
```
Truy cập giao diện tại: `http://localhost:5173`

---

## 📚 **DANH MỤC TÀI LIỆU CHI TIẾT**
Mỗi thư mục trong dự án đều có tài liệu `README.md` độc lập mô tả chi tiết:
* [apps/README.md](file:///g:/UniFlow-PTIT_Aka/apps/README.md): Tổng quan các ứng dụng frontend, backend, ai-engine.
* [apps/web/README.md](file:///g:/UniFlow-PTIT_Aka/apps/web/README.md): Hướng dẫn phát triển giao diện Ant Design + Less + React Flow.
* [apps/backend/README.md](file:///g:/UniFlow-PTIT_Aka/apps/backend/README.md): Kiến trúc đường ống Webhook, HMAC & UDM Normalizer.
* [apps/ai-engine/README.md](file:///g:/UniFlow-PTIT_Aka/apps/ai-engine/README.md): Cơ chế AI SKU Matching & Error Healing.
* [packages/README.md](file:///g:/UniFlow-PTIT_Aka/packages/README.md): Hướng dẫn sử dụng các thư viện UDM Schema và Shared Types.
* [infra/README.md](file:///g:/UniFlow-PTIT_Aka/infra/README.md): Quản trị container Docker và cấu hình môi trường.
* [scripts/README.md](file:///g:/UniFlow-PTIT_Aka/scripts/README.md): Hướng dẫn dùng tool giả lập Webhook và nạp dữ liệu demo.
* [docs/README.md](file:///g:/UniFlow-PTIT_Aka/docs/README.md): Thư viện tài liệu đề án kinh doanh, đối thủ và đặc tả kỹ thuật.
