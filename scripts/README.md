# 🛠️ `scripts/` — CÔNG CỤ PHÁT TRIỂN & KIỂM THỬ TỰ ĐỘNG

Thư mục chứa các script hỗ trợ lập trình viên kiểm thử pipeline, giả lập webhook, nạp dữ liệu mẫu và đánh giá thuật toán AI.

---

## 📂 **Danh sách các Scripts**

| Tệp | Ngôn ngữ | Chức năng & Mục đích | Lệnh chạy |
| :--- | :--- | :--- | :--- |
| [`simulate_webhook.js`](file:///g:/UniFlow-PTIT_Aka/scripts/simulate_webhook.js) | Node.js | Tạo payload đơn hàng giả lập từ TikTok Shop / Shopee, tự động tính toán chữ ký số **HMAC-SHA256** và bắn vào Backend để đo SLA $< 0.5\text{s}$. | `node scripts/simulate_webhook.js tiktok` |
| [`seed_database.js`](file:///g:/UniFlow-PTIT_Aka/scripts/seed_database.js) | Node.js | Nạp dữ liệu mẫu toàn diện vào MongoDB: Tenants, Workflows Canvas, Connectors, SKU Mappings và Sync Logs. | `npm run seed` |
| [`seed_connectors.js`](file:///g:/UniFlow-PTIT_Aka/scripts/seed_connectors.js) | Node.js | Nạp & Cập nhật chuyên biệt 20 cổng kết nối đối tác (Sàn TMĐT, POS, ĐVVC, Kế toán, Chat) vào MongoDB. | `npm run seed:connectors` |
| [`test_ai_matching.py`](file:///g:/UniFlow-PTIT_Aka/scripts/test_ai_matching.py) | Python | Kiểm thử trực tiếp thuật toán Hybrid Scoring ($\text{Score} = 0.7 \times S_{\text{vector}} + 0.3 \times S_{\text{attr}}$) với các mức phân ngưỡng hành động. | `python scripts/test_ai_matching.py` |
