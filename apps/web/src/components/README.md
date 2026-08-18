# 🧩 `src/components/` — UI COMPONENTS (ANT DESIGN + REACT FLOW)

Thư mục quản lý toàn bộ các linh kiện giao diện người dùng của Dashboard UniFlow AI.

---

## 📂 **Cấu trúc thư mục**
```
src/components/
├── layout/
│   └── MainLayout.tsx         # Khung giao diện Ant Design Layout, Sidebar, Top Header, Brand Logo
├── dashboard/
│   ├── KpiCards.tsx           # Hàng thẻ thống kê chỉ số E2E Latency, SLA 99.98%, Đơn đã đồng bộ
│   └── LiveEventStream.tsx    # Bảng dòng sự kiện WebSocket và nhãn AI Self-Healing
├── workflow/
│   ├── WorkflowCanvas.tsx     # Canvas React Flow kéo thả luồng tự động hóa 0-chạm
│   └── nodes/                 # Custom React Flow Nodes
│       ├── TriggerNode.tsx    # Nút Inbound Webhook (Aka Red #ed1c24)
│       ├── AINode.tsx         # Nút AI SKU Matching & Healing (Neon Purple #8B5CF6)
│       └── ActionNode.tsx     # Nút Outbound POS & Logistics Action (Solar Gold #fcc20f & Emerald)
├── mapping/
│   └── SkuMappingTable.tsx    # Bảng ánh xạ SKU Thông minh với nút Duyệt 1-Click
├── connectors/
│   └── ConnectorsHub.tsx      # Quản lý kết nối Sàn TMĐT, POS/ERP và Đơn vị vận chuyển
└── README.md                  # Tài liệu hướng dẫn (File này)
```
