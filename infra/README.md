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
│   └── nginx.conf             # Nginx reverse proxy định tuyến /api, /socket.io, /ai và Web App
└── README.md                  # Tài liệu hướng dẫn (File này)
```

---

## 🚀 **Các lệnh thao tác thông dụng**

### 1. Khởi động hạ tầng cho lập trình viên (Local Dev)
Chỉ khởi động MongoDB (Port 27017), Redis (Port 6379) và Qdrant (Port 6333):
```bash
docker-compose -f infra/docker-compose.dev.yml up -d
```

### 2. Kiểm tra trạng thái các container
```bash
docker-compose -f infra/docker-compose.dev.yml ps
```

### 3. Tắt và dọn dẹp hạ tầng
```bash
docker-compose -f infra/docker-compose.dev.yml down
```

### 4. Triển khai toàn bộ hệ thống (Full-stack Production Mode)
```bash
docker-compose -f infra/docker-compose.yml up -d --build
```
