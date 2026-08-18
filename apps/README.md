# 🚀 `apps/` — UNIFLOW APPLICATIONS & MICROSERVICES

Thư mục chứa toàn bộ các ứng dụng giao diện và microservices backend của UniFlow AI.

---

## 📂 **Danh sách các Ứng dụng**

| Ứng dụng | Công nghệ | Cổng mặc định | Mục đích & Vai trò |
| :--- | :--- | :--- | :--- |
| [`web`](file:///g:/UniFlow-PTIT_Aka/apps/web) | **React 18, Ant Design, Less, React Flow** | `5173` | Giao diện Dashboard quản trị, Canvas kéo thả luồng dữ liệu 0-chạm, Bảng so khớp SKU thông minh, và Real-time Live Log Feed. |
| [`backend`](file:///g:/UniFlow-PTIT_Aka/apps/backend) | **Node.js, NestJS, TypeScript** | `3000` | Cổng API Gateway, tiếp nhận Webhook Inbound $< 0.5\text{s}$, xác thực HMAC, chuyển đổi UDM Normalizer, và phát WebSocket live. |
| [`ai-engine`](file:///g:/UniFlow-PTIT_Aka/apps/ai-engine) | **Python 3.10, FastAPI, Qdrant, Gemini** | `8000` | Lõi AI xử lý NLP tiếng Việt, thuật toán Hybrid SKU Auto-Mapping và cơ chế AI Self-Healing. |
