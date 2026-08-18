# 🎨 `apps/web` — UNIFLOW FRONTEND DASHBOARD & VISUAL BUILDER

Ứng dụng Single Page Application (SPA) xây dựng trên nền tảng **React 18 + Vite**, thư viện UI **Ant Design (`antd`)**, công cụ tiền xử lý **Less** và **React Flow Canvas Builder**.

---

## 🎨 **Hệ màu Nhận diện Thương hiệu**
* **Primary Color (`#ed1c24`):** Màu đỏ Crimson Red PTIT_Aka.
* **Secondary Color (`#fcc20f`):** Màu vàng Solar Gold.
* **Dark Slate Theme:** Nền Dark Mode `#0B0F19` kết hợp `theme.darkAlgorithm` từ Ant Design.

---

## 📂 **Cấu trúc thư mục**
```
apps/web/
├── public/                    # Assets tĩnh, icons, logos
├── src/
│   ├── assets/                # Hình ảnh đồ họa
│   ├── styles/                # variables.less, theme.ts (Antd ConfigProvider), global.less
│   ├── components/            # Layout, Dashboard, React Flow Canvas, SKU Mapping, Connectors
│   ├── App.tsx                # Điểm cấu hình Theme & Router chính
│   ├── main.tsx               # Bootstrap React 18
│   └── vite-env.d.ts
├── package.json               # antd, @ant-design/icons, less, @xyflow/react, etc.
├── tsconfig.json
├── vite.config.ts             # Cấu hình Vite & Less
├── Dockerfile                 # Đóng gói Multi-stage build Nginx
└── README.md                  # Tài liệu hướng dẫn (File này)
```

---

## 🚀 **Hướng dẫn phát triển (Development)**
```bash
# Cài đặt dependencies
npm install

# Khởi chạy dev server (Port 5173)
npm run dev

# Build production bundle
npm run build
```
