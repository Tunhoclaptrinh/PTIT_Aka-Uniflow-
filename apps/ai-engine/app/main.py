import os
import json
import logging
from typing import Optional, List, Dict, Any
# pyrefly: ignore [missing-import]
# type: ignore
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
# type: ignore
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
# type: ignore
from pydantic import BaseModel

from app.core.config import settings
from app.services.sku_matcher import HybridSKUMatcher
from app.services.error_healer import AIErrorHealer

logger = logging.getLogger("uniflow-ai-engine")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Lõi AI Microservice cho UniFlow AI (Hybrid SKU Matching, Workflow Generation & Self-Healing)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Pydantic Request Models ───────────────────────────────────────────────────

class CompletePromptRequest(BaseModel):
    prompt: str
    system_prompt: Optional[str] = "Bạn là trợ lý AI chuyên gia tự động hóa TMĐT của UniFlow."
    systemPrompt: Optional[str] = None
    json_mode: Optional[bool] = True
    jsonMode: Optional[bool] = None

class WorkflowGenRequest(BaseModel):
    prompt: str

class SKUMatchRequest(BaseModel):
    source_sku: str
    source_name: str
    target_sku: str
    target_name: str
    simulated_vector_sim: Optional[float] = None

class ErrorHealRequest(BaseModel):
    failed_carrier: str
    http_status: int
    error_message: str

# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/")
@app.get("/api/v1/ai/health")
def read_root():
    qdrant_client = HybridSKUMatcher.get_qdrant_client()
    return {
        "service": "UniFlow AI Engine",
        "status": "HEALTHY",
        "models": {
            "gemini": settings.GEMINI_MODEL,
            "qdrant": f"{settings.QDRANT_HOST}:{settings.QDRANT_PORT}",
            "qdrant_status": "CONNECTED" if qdrant_client else "OFFLINE_FALLBACK"
        }
    }

@app.post("/api/v1/ai/complete")
def complete_prompt(req: CompletePromptRequest):
    """
    Endpoint hoàn tất lời nhắc AI tổng quát hỗ trợ Gemini hoặc NLP Heuristic
    """
    sys_prompt = req.system_prompt or req.systemPrompt or "Bạn là trợ lý AI chuyên gia tự động hóa TMĐT của UniFlow."
    is_json = req.json_mode if req.json_mode is not None else (req.jsonMode if req.jsonMode is not None else True)
    prompt_text = req.prompt

    # 1. Thử gọi Google Gemini nếu có GEMINI_API_KEY
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 10:
        try:
            # pyrefly: ignore [missing-import]
            # type: ignore
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel(settings.GEMINI_MODEL)
            response = model.generate_content(f"{sys_prompt}\n\n{prompt_text}")
            raw_text = response.text
            data = json.loads(raw_text) if is_json else raw_text
            return {
                "success": True,
                "provider": "AI_ENGINE_GEMINI",
                "data": data,
                "raw_text": raw_text
            }
        except Exception as e:
            logger.warning(f"Lỗi khi gọi Gemini SDK: {e}")

    # 2. Xử lý suy luận thông minh dự phòng nội bộ
    lower = prompt_text.lower()
    is_shopee = "shopee" in lower
    is_lazada = "lazada" in lower
    is_kiot = "kiotviet" in lower
    is_haravan = "haravan" in lower
    is_ghn = "ghn" in lower
    is_viettel = "viettel" in lower
    is_compare = "so sánh" in lower or "cước" in lower or "rẻ nhất" in lower or "đa hãng" in lower

    data_payload = {
        "name": (
            "Quy trình Shopee Open Platform" if is_shopee
            else "Quy trình Lazada Inbound" if is_lazada
            else "Quy trình TikTok Shop 0-chạm"
        ),
        "description": prompt_text,
        "marketplace": "SHOPEE" if is_shopee else "LAZADA" if is_lazada else "TIKTOK_SHOP",
        "pos": "KIOTVIET" if is_kiot else "HARAVAN" if is_haravan else "SAPO",
        "logistics": "MULTI_CARRIER" if is_compare else "GHN" if is_ghn else "VIETTEL_POST" if is_viettel else "GHTK",
        "strategy": "CHEAPEST" if is_compare else "FASTEST",
        "hasRateCompare": is_compare,
        "hasAccounting": "misa" in lower or "hóa đơn" in lower or "vat" in lower,
        "reasoning": f"AI Engine đã phân tích ngữ nghĩa và tạo luồng tối ưu tự động từ lời nhắc: '{prompt_text}'."
    }

    return {
        "success": True,
        "provider": "AI_ENGINE_LOCAL",
        "data": data_payload,
    }

@app.post("/api/v1/ai/generate-workflow")
def generate_workflow(req: WorkflowGenRequest):
    """
    Sinh cấu trúc quy trình workflow từ prompt
    """
    complete_res = complete_prompt(CompletePromptRequest(prompt=req.prompt, json_mode=True))
    return complete_res

@app.post("/api/v1/ai/match-sku")
def match_sku(req: SKUMatchRequest):
    """
    So khớp SKU lai giữa Vector Embedding (Qdrant) và Thực thể thuộc tính (NER)
    """
    result = HybridSKUMatcher.calculate_hybrid_score(
        source_name=req.source_name,
        target_name=req.target_name,
        vector_sim=req.simulated_vector_sim
    )
    
    return {
        "source_sku": req.source_sku,
        "target_sku": req.target_sku,
        "hybrid_score": result["hybrid_score"],
        "vector_sim": result["vector_sim"],
        "attribute_sim": result["attribute_sim"],
        "action": result["action"],
        "confidence_percent": result["confidence_percent"],
        "qdrant_connected": result["qdrant_connected"],
        "entities": result["entities"]
    }

@app.post("/api/v1/ai/heal-error")
def heal_error(req: ErrorHealRequest):
    result = AIErrorHealer.diagnose_and_heal(
        failed_carrier=req.failed_carrier,
        http_status=req.http_status,
        error_msg=req.error_message
    )
    return result

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    # type: ignore
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
