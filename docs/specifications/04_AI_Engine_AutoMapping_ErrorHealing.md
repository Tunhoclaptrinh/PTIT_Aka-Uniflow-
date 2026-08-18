# **UNIFLOW AI — ĐẶC TẢ LÕI TRÍ TUỆ NHÂN TẠO & TỰ CHỮA LÀNH (AI ENGINE SPECIFICATION)**

> **Tài liệu thuộc Phân hệ Kỹ thuật:** Đặc tả chi tiết phân hệ AI Agent Service (Python FastAPI, Qdrant Vector Database, Gemini 1.5 Flash API), thuật toán so khớp đa tầng (Hybrid SKU Mapping), bộ định tuyến vận chuyển thông minh và cơ chế tự chữa lành luồng dữ liệu (AI Error-Healing).

---

## **PHẦN I: KIẾN TRÚC TỔNG QUAN PHÂN HỆ AI (AI SERVICE ARCHITECTURE)**

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         BACKEND CORE (NESTJS)                          │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ (gRPC / High-speed REST)
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │                AI ENGINE MICROSERVICE (PYTHON FASTAPI)                 │
 │                                                                        │
 │  ┌─────────────────────────┐            ┌───────────────────────────┐  │
 │  │ 1. Vietnamese NLP Parser│            │ 3. Gemini 1.5 Flash LLM   │  │
 │  │    (NER & Attributes)   │            │    - Prompt-to-Workflow   │  │
 │  └────────────┬────────────┘            │    - Error Diagnosis      │  │
 │               ▼                         └───────────────────────────┘  │
 │  ┌─────────────────────────┐            ┌───────────────────────────┐  │
 │  │ 2. Dense Vector Engine  │            │ 4. Qdrant Vector DB       │  │
 │  │    (text-embedding-004) │ ─────────> │    - SKU Embeddings       │  │
 │  └─────────────────────────┘            │    - HNSW Cosine Index    │  │
 │                                         └───────────────────────────┘  │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## **PHẦN II: THUẬT TOÁN ÁNH XẠ SKU THÔNG MINH (HYBRID AI SKU AUTO-MAPPING)**

Khắc phục triệt để hiện tượng tên sản phẩm trên Sàn TMĐT và mã SKU trong Kho POS bị lệch nhau (ví dụ sàn ghi *"Áo Phông Nam Basic Cotton Đen L"* nhưng Kho POS ghi *"AT-COT-BLK-L"*).

```
   [Tên SP sàn: "Áo polo nam pima cộc tay đen form rộng size XL"]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
[1. Trích xuất thuộc tính NER]          [2. Dense Vector Embedding]
   - Loại: Áo polo                         - Vector 768 dims (text-embedding-004)
   - Chất liệu: Pima
   - Màu sắc: Đen
   - Kích cỡ: XL
            │                                     │
            │                                     ▼
            │                           [Qdrant Cosine Similarity]
            │                              -> Top 5 ứng viên SKU kho
            │                                     │
            └──────────────────┬──────────────────┘
                               ▼
                [3. Thuật toán Hybrid Scoring]
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
    Điểm >= 0.95        0.70 <= Điểm < 0.95    Điểm < 0.70
   [🟢 Tự động duyệt]   [🟡 Gợi ý 1-Click]   [🔴 Ghép thủ công]
```

### **1. Công thức tính điểm tương quan lai (Hybrid Scoring Formula)**

$$\text{FinalScore} = 0.7 \times S_{\text{cosine}} + 0.3 \times S_{\text{attribute}}$$

* **$S_{\text{cosine}}$ (Vector Cosine Similarity):** Đo lường ngữ nghĩa tổng thể giữa câu văn bản nguồn và văn bản đích trong không gian vectơ 768 chiều.
  $$S_{\text{cosine}}(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$$
* **$S_{\text{attribute}}$ (Attribute Overlap Jaccard Score):** Tỷ lệ khớp chính xác các thuộc tính cứng (Màu sắc, Size, Dung tích, Combo số lượng):
  $$S_{\text{attribute}} = \frac{|A_{\text{source}} \cap A_{\text{target}}|}{|A_{\text{source}} \cup A_{\text{target}}|}$$

### **2. Mã nguồn triển khai thuật toán (Python FastAPI Snippet)**

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from qdrant_client import QdrantClient

app = FastAPI(title="UniFlow AI Agent Core")
qdrant = QdrantClient(host="qdrant-service", port=6333)

class SkuMatchRequest(BaseModel):
    tenant_id: str
    source_product_name: str
    source_variation: str

@app.post("/api/ai/match-sku")
async def match_sku(req: SkuMatchRequest):
    # 1. Trích xuất thuộc tính văn bản
    attrs = extract_vietnamese_attributes(req.source_product_name, req.source_variation)
    
    # 2. Tạo Vector Embedding
    query_vector = generate_embedding(f"{req.source_product_name} {req.source_variation}")
    
    # 3. Tìm kiếm top 3 SKU tương đồng nhất trong Qdrant theo tenant_id
    search_results = qdrant.search(
        collection_name="tenant_skus",
        query_vector=query_vector,
        query_filter={"must": [{"key": "tenant_id", "match": {"value": req.tenant_id}}]},
        limit=3
    )
    
    if not search_results:
        return {"status": "UNMATCHED", "confidence": 0.0}
    
    best_candidate = search_results[0]
    cosine_score = best_candidate.score
    
    # 4. Tính điểm trùng khớp thuộc tính
    target_attrs = best_candidate.payload.get("attributes", {})
    attr_score = calculate_attribute_overlap(attrs, target_attrs)
    
    # 5. Điểm tổng hợp cuối cùng
    final_score = (0.7 * cosine_score) + (0.3 * attr_score)
    
    # 6. Phân ngưỡng hành động
    if final_score >= 0.95:
        action = "AUTO_MAPPED"
    elif final_score >= 0.70:
        action = "PENDING_ONE_CLICK_REVIEW"
    else:
        action = "REQUIRE_MANUAL_MAP"
        
    return {
        "status": action,
        "confidence_score": round(final_score, 4),
        "target_master_sku": best_candidate.payload.get("master_sku"),
        "target_product_name": best_candidate.payload.get("product_name"),
        "extracted_attributes": attrs
    }
```

---

## **PHẦN III: ĐỘNG CƠ TỰ ĐỘNG CHỌN ĐƠN VỊ VẬN CHUYỂN (SMART CARRIER ROUTING)**

Khi đơn hàng được xác nhận, AI Routing Agent tối ưu việc chọn hãng vận chuyển (GHTK, GHN, Viettel Post) dựa trên ma trận đa mục tiêu:

$$\text{CarrierRankScore} = w_1 \cdot \frac{1}{\text{ShippingFee}} + w_2 \cdot \frac{1}{\text{LeadTimeHours}} + w_3 \cdot \text{HistoricalSuccessRate}_{\text{District}}$$

* **Mục tiêu:**
  * Giảm trung bình **$12 - 18\%$** chi phí cước vận chuyển hàng tháng cho người bán.
  * Tự động ưu tiên hãng có tỷ lệ giao thành công cao nhất tại quận/huyện nhận hàng (dựa trên dữ liệu giao hàng lịch sử).

---

## **PHẦN IV: CƠ CHẾ TỰ CHỮA LÀNH LUỒNG DỮ LIỆU (AI SELF-HEALING ENGINE)**

Khi xảy ra sự cố API ngoài tầm kiểm soát (Ví dụ: đối tác vận chuyển sập máy chủ, nhà bán hàng chưa kịp tạo SKU trên sàn mới), AI Error-Healing Agent tự động can thiệp theo quy trình:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHÁT HIỆN SỰ CỐ (EXCEPTION)                     │
│  - HTTP 500/502/503 từ API Đối tác                                      │
│  - Lỗi hết tồn kho đột xuất (Out-of-stock collision)                   │
│  - Định dạng địa chỉ giao hàng bị thiếu quận/huyện                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     CHẨN ĐOÁN BẰNG GEMINI 1.5 FLASH                    │
│  "Phân tích Error Message và đề xuất giải pháp tối ưu theo kịch bản"  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ Kịch bản 1:      │       │ Kịch bản 2:      │       │ Kịch bản 3:      │
│ Đổi Đơn vị Ship  │       │ Khóa Tồn kho Ảo  │       │ Tự Chuẩn Hóa     │
│ (Reroute Carrier)│       │ (Virtual Reserve)│       │ Địa Chỉ Nhận     │
│ Chuyển từ GHTK   │       │ Chuyển đơn sang  │       │ Bổ sung mã bưu   │
│ sang GHN         │       │ hàng chờ 30 phút │       │ cục còn thiếu    │
└──────────────────┘       └──────────────────┘       └──────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             GHI NHẬT KÝ & PHÁT CẢNH BÁO MINH BẠCH (NOTIFY)             │
│  - Ghi vết vào sync_event_logs (Cột ai_healing_action)                 │
│  - Bắn thông báo Zalo ZNS / Telegram Bot cho Trưởng bộ phận Vận hành   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## **PHẦN V: BỘ SINH LUỒNG TỪ NGÔN NGỮ TỰ NHIÊN (PROMPT-TO-WORKFLOW)**

Người dùng chỉ cần nhập văn bản tiếng Việt thông thường, LLM sinh ra cấu trúc Nodes & Edges tương thích hoàn toàn với React Flow.

### **System Prompt Mẫu:**
```
Bạn là Trợ lý Kiến trúc sư Tự động hóa UniFlow AI. Nhiệm vụ của bạn là phân tích yêu cầu bằng tiếng Việt của người dùng và chuyển đổi thành cấu trúc đồ thị JSON DAG gồm các 'nodes' và 'edges'.
Mỗi node phải có type thuộc: ['TRIGGER_TIKTOK', 'TRIGGER_SHOPEE', 'AI_SKU_MAPPER', 'ACTION_SAPO_DEDUCT', 'ACTION_GHTK_WAYBILL', 'ACTION_TELEGRAM_ALERT'].
Chỉ trả về JSON thuần túy, không có văn bản giải thích.
```
