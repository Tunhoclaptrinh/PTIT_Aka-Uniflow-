# 🐳 `infra/` — HẠ TẦNG TRIỂN KHAI & DOCKER

Thư mục quản lý toàn bộ tệp cấu hình Docker Compose, kịch bản khởi tạo Cơ sở dữ liệu và Cổng đảo chiều Nginx Reverse Proxy.

---

## 📂 **Cấu trúc thư mục**
```
infra/
├── docker-compose.yml         # Triển khai toàn bộ Stack (Frontend, Backend, AI Engine, DBs, Cache)
├── docker-compose.dev.yml     # Khởi chạy nhanh các dịch vụ hạ tầng (MongoDB, Redis, Qdrant) cho Local Dev
├── mongo-init/
│   └── init-mongo.js          # Script tạo collections & index tối ưu (Compound Index, TTL 90 ngày)
├── nginx/
│   └── nginx.conf             # Nginx gateway ĐỘC LẬP (tùy chọn) — chỉ dùng nếu tách reverse proxy ra service riêng
└── README.md                  # Tài liệu hướng dẫn (File này)

Lưu ý: ở cấu hình mặc định, reverse proxy nằm NGAY TRONG container `web`
(xem `apps/web/nginx.conf`), nên không cần chạy thêm service nginx nào.
```

---

## 🚀 **Các lệnh thao tác thông dụng**

> ⚠️ **Luôn truyền `--env-file .env`.** Compose file nằm trong `infra/`, nên Docker Compose
> mặc định tìm `.env` ở `infra/.env` chứ không phải repo root. Các script `npm run docker:*`
> ở repo root đã truyền cờ này sẵn — dùng chúng là an toàn nhất.

### 1. Khởi động hạ tầng cho lập trình viên (Local Dev)
Chỉ khởi động MongoDB (27017), Redis (6379) và Qdrant (6333/6334):
```bash
npm run dev:infra
# tương đương: docker compose --env-file .env -f infra/docker-compose.dev.yml up -d
```

### 2. Kiểm tra trạng thái & healthcheck
```bash
npm run docker:ps
```

### 3. Tắt và dọn dẹp hạ tầng
```bash
npm run dev:infra:down     # chỉ stack DB
npm run docker:down        # toàn bộ stack
```
Volume dữ liệu (`uniflow_mongo_data`, `uniflow_redis_data`, `uniflow_qdrant_data`) vẫn được giữ.
Muốn xóa sạch cả dữ liệu:
```bash
docker compose --env-file .env -f infra/docker-compose.yml down -v
```

### 4. Triển khai toàn bộ hệ thống (Full-stack Production Mode)
```bash
npm run docker:up
```
Cổng vào duy nhất: **http://localhost:5173**

Thứ tự khởi động được đảm bảo bằng `depends_on` + `condition: service_healthy`:
```
qdrant (healthy) ──> ai-engine ──┐
mongo  (healthy) ────────────────┼──> backend ──> web
redis  (healthy) ────────────────┘
```

### 5. Biến môi trường bắt buộc
`backend` dùng cú pháp `${VAR:?...}` cho 2 biến sau — thiếu là compose dừng ngay,
tránh việc service chạy im lặng với secret hard-code trong source:

| Biến | Cách sinh |
| :--- | :--- |
| `JWT_SECRET` | `openssl rand -hex 32` |
| `ENCRYPTION_KEY` | `openssl rand -hex 32` (AES-256-GCM cần đúng 64 ký tự hex) |

### 6. Xung đột cổng trên máy host
Mọi cổng host đều tham số hóa được trong `.env`, không cần sửa compose file:
```bash
BACKEND_HOST_PORT=3100   AI_ENGINE_HOST_PORT=8100
MONGO_HOST_PORT=27018    REDIS_HOST_PORT=6380
QDRANT_HOST_PORT=6343    QDRANT_GRPC_HOST_PORT=6344
WEB_HOST_PORT=5173
```

### 7. Kiểm tra nhanh sau khi `up`
```bash
curl http://localhost:5173/                          # SPA           -> 200
curl http://localhost:5173/dashboard                 # SPA fallback  -> 200
curl http://localhost:5173/api/v1/metrics            # backend       -> JSON
curl http://localhost:5173/ai/api/v1/ai/health       # ai-engine     -> HEALTHY
```
