# ⚙️ `apps/backend` — UNIFLOW API GATEWAY & PIPELINE (NESTJS)

Hệ thống Backend trung tâm xử lý dữ liệu theo thời gian thực (High Concurrency & Event-Driven) cho nền tảng UniFlow AI.

---

## ⚡ **Tính năng Cốt lõi**
1. **Đường ống Webhook Inbound Siêu Tốc ($< 0.5\text{s}$):** Tiếp nhận sự kiện từ TikTok Shop & Shopee, xác thực bảo mật HMAC-SHA256 và phản hồi tức thời.
2. **Universal Data Model (UDM) Normalizer:** Chuẩn hóa dữ liệu sàn thành định dạng chung.
3. **Bảo mật Zero-Trust & Mã hóa AES-256-GCM:** Bảo vệ toàn bộ Access Token, Secret Keys của các cửa hàng.
4. **WebSocket Live Feed:** Cung cấp kênh đẩy sự kiện thời gian thực cho Frontend Dashboard.

---

## 📂 **Cấu trúc thư mục**
```
apps/backend/
├── src/
│   ├── main.ts                # Bootstrap NestJS & cấu hình Raw Body / CORS
│   ├── app.module.ts          # Root Module
│   ├── security/              # Dịch vụ mã hóa AES-256-GCM và xác thực HMAC
│   └── modules/               # Webhooks, Normalizer, WebSocket, Connectors, Queue
├── package.json               # Dependencies NestJS, BullMQ, Mongoose, Socket.io
├── tsconfig.json
├── nest-cli.json
├── Dockerfile                 # Đóng gói Multi-stage build
└── README.md                  # Tài liệu hướng dẫn (File này)
```

---

## 🚀 **Hướng dẫn phát triển (Development)**
```bash
# Cài đặt dependencies
npm install

# Chạy ở chế độ Dev (Port 3000)
npm run start:dev

# Build production
npm run build
```
