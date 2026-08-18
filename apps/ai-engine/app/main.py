from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from app.core.config import settings
from app.services.sku_matcher import HybridSKUMatcher
from app.services.error_healer import AIErrorHealer

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Lõi AI Microservice cho UniFlow AI (Hybrid SKU Matching & Self-Healing)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SKUMatchRequest(BaseModel):
    source_sku: str
    source_name: str
    target_sku: str
    target_name: str
    simulated_vector_sim: Optional[float] = 0.95

class ErrorHealRequest(BaseModel):
    failed_carrier: str
    http_status: int
    error_message: str

@app.get("/")
def read_root():
    return {
        "service": "UniFlow AI Engine",
        "status": "HEALTHY",
        "models": {
            "gemini": settings.GEMINI_MODEL,
            "qdrant": f"{settings.QDRANT_HOST}:{settings.QDRANT_PORT}"
        }
    }

@app.post("/api/v1/ai/match-sku")
def match_sku(req: SKUMatchRequest):
    score = HybridSKUMatcher.calculate_hybrid_score(
        vector_sim=req.simulated_vector_sim,
        source_name=req.source_name,
        target_name=req.target_name
    )
    action = HybridSKUMatcher.determine_action(score)
    
    return {
        "source_sku": req.source_sku,
        "target_sku": req.target_sku,
        "hybrid_score": score,
        "action": action,
        "confidence_percent": round(score * 100, 1)
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
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
