# **⚡ UNIFLOW AI — OMNICHANNEL IPAAS & AI MIDDLEWARE**

> **Nền tảng Tích hợp Dữ liệu Đa kênh Tự động hóa với Trí tuệ Nhân tạo Dành cho Thương mại Điện tử Việt Nam.**  
> *Phát triển bởi Đội ngũ PTIT_Aka.*

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

## 🐳 **TRIỂN KHAI TRỌN GÓI BẰNG DOCKER COMPOSE (ONE-COMMAND)**

Thay cho việc chạy tay 5 bước ở trên, toàn bộ hệ thống (6 service) có thể đóng gói và khởi chạy bằng một lệnh duy nhất.

### **Bước 1 — Tạo file `.env`**
```bash
cp .env.example .env
# Sinh secret thật (BẮT BUỘC — compose sẽ báo lỗi nếu thiếu 2 biến này)
echo "JWT_SECRET=\"$(openssl rand -hex 32)\"" >> .env
echo "ENCRYPTION_KEY=\"$(openssl rand -hex 32)\"" >> .env
```

### **Bước 2 — Build & khởi chạy toàn bộ Stack**
```bash
npm run docker:up        # build + up -d, chờ healthcheck theo đúng thứ tự phụ thuộc
```

Truy cập duy nhất một cổng vào: **`http://localhost:5173`**
Nginx trong container `web` tự proxy `/api/`, `/socket.io/` sang backend và `/ai/` sang AI Engine.

### **Các lệnh quản trị**
| Lệnh | Tác dụng |
| :--- | :--- |
| `npm run docker:up` | Build và khởi chạy toàn bộ 6 service (chế độ nền) |
| `npm run docker:build` | Chỉ build 3 image (`web`, `backend`, `ai-engine`) |
| `npm run docker:ps` | Xem trạng thái và tình trạng healthcheck |
| `npm run docker:logs` | Theo dõi log realtime toàn bộ stack |
| `npm run docker:down` | Dừng và xóa container (volume dữ liệu vẫn giữ) |
| `npm run dev:infra` | Chỉ chạy 3 DB (MongoDB, Redis, Qdrant) để dev local |
| `npm run dev:infra:down` | Dừng stack DB local |

### **Sơ đồ Service & Cổng**
| Service | Image / Build | Cổng Host (mặc định) | Cổng Container | Healthcheck |
| :--- | :--- | :--- | :--- | :--- |
| `web` | `uniflow/web:1.0.0` | **5173** | 80 (nginx) | `wget /` |
| `backend` | `uniflow/backend:1.0.0` | 3000 | 3000 | `GET /api/v1/metrics` |
| `ai-engine` | `uniflow/ai-engine:1.0.0` | 8000 | 8000 | `GET /api/v1/ai/health` |
| `mongo` | `mongo:7.0` | 27017 | 27017 | `db.adminCommand('ping')` |
| `redis` | `redis:7.2-alpine` | 6379 | 6379 | `redis-cli ping` |
| `qdrant` | `qdrant/qdrant:v1.9.0` | 6333 / 6334 | 6333 / 6334 | TCP probe |

### **Xử lý xung đột cổng**
Nếu một cổng trên máy đã bị project khác chiếm, override trong `.env` (chỉ ảnh hưởng cổng host, giao tiếp giữa các container không đổi):
```bash
BACKEND_HOST_PORT=3100
AI_ENGINE_HOST_PORT=8100
MONGO_HOST_PORT=27018
REDIS_HOST_PORT=6380
QDRANT_HOST_PORT=6343
QDRANT_GRPC_HOST_PORT=6344
WEB_HOST_PORT=5173
```

### **Lưu ý quan trọng**
* **`--env-file` là bắt buộc.** Vì compose file nằm trong `infra/`, Docker Compose sẽ tìm `.env` tại `infra/.env` chứ không phải repo root. Các script `npm run docker:*` đã truyền `--env-file .env` sẵn — nếu gọi `docker compose` trực tiếp thì phải thêm cờ này.
* **`VITE_API_URL` được inline lúc BUILD, không phải runtime.** Đổi giá trị này bắt buộc phải rebuild image `web` (`npm run docker:build`), sửa `.env` rồi restart là không có tác dụng.
* **`MONGO_DB_NAME` phải khớp với `infra/mongo-init/init-mongo.js`.** `app.module.ts` truyền `dbName` riêng và giá trị đó **ghi đè** database nằm trong `MONGO_URI`; lệch tên sẽ khiến app ghi vào một DB không có index nào.

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
