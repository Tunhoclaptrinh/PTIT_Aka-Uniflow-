# 🧠 `apps/ai-engine` — UNIFLOW AI AGENT MICROSERVICE (FASTAPI)

Phân hệ trí tuệ nhân tạo chuyên sâu phục vụ tự động hóa TMĐT, xây dựng trên nền tảng **Python FastAPI**, **Google Gemini 1.5 Flash** và **Qdrant Vector Database**.

---

## ⚡ **Chức năng Cốt lõi**
1. **Hybrid SKU Auto-Mapping:** Khắc phục lệch tên sản phẩm giữa sàn TMĐT và kho POS bằng thuật toán kết hợp Vector Cosine Similarity (70%) và Attribute Jaccard Matching (30%).
2. **AI Error-Healing & Dynamic Carrier Rerouting:** Tự động chẩn đoán mã lỗi của Đơn vị vận chuyển (HTTP 500/502/Timeout) và kích hoạt tuyến đường dự phòng.

---

## 📂 **Cấu trúc thư mục**
```
apps/ai-engine/
├── app/
│   ├── main.py                # FastAPI Application & Endpoints
│   ├── core/
│   │   └── config.py          # Cấu hình Pydantic Settings
│   └── services/
│       ├── sku_matcher.py     # Thuật toán Hybrid Scoring
│       └── error_healer.py    # Bộ tự chữa lành lỗi & điều hướng ĐVVC
├── requirements.txt           # Thư viện FastAPI, Qdrant, Google-generativeai
├── Dockerfile                 # Đóng gói Container Python 3.10
└── README.md                  # Tài liệu hướng dẫn (File này)
```

---

## 🚀 **Hướng dẫn khởi chạy (Development)**
```bash
# Tạo và kích hoạt môi trường ảo
python -m venv venv
source venv/bin/activate  # Trên Windows: .\venv\Scripts\activate

# Cài đặt thư viện
pip install -r requirements.txt

# Khởi chạy dịch vụ (Port 8000)
uvicorn app.main:app --reload --port 8000
```
