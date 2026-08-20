import os
# pyrefly: ignore [missing-import]
# type: ignore
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "UniFlow AI Engine"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    
    # Qdrant Vector DB
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", 6333))
    QDRANT_COLLECTION: str = os.getenv("QDRANT_COLLECTION_NAME", "uniflow_sku_vectors")
    
    # --- FPT GenAI / akaBot Model Suite ---
    FPT_AI_API_KEY: str = os.getenv("FPT_AI_API_KEY", "")
    FPT_AI_BASE_URL: str = os.getenv("FPT_AI_BASE_URL", "https://api.fpt.ai/v1")
    
    # 1. LLM Models
    FPT_AI_FAST_MODEL: str = os.getenv("FPT_AI_FAST_MODEL", "DeepSeek-V4-Flash")
    FPT_AI_REASONING_MODEL: str = os.getenv("FPT_AI_REASONING_MODEL", "Llama-3.3-70B-Instruct")
    FPT_AI_GENERAL_MODEL: str = os.getenv("FPT_AI_GENERAL_MODEL", "Qwen3.6-27B")
    FPT_AI_MODEL: str = os.getenv("FPT_AI_MODEL", "DeepSeek-V4-Flash")
    
    # 2. Vision / Multimodal
    FPT_AI_VISION_MODEL: str = os.getenv("FPT_AI_VISION_MODEL", "Qwen2.5-VL-7B-Instruct")
    
    # 3. Embedding & Reranker
    FPT_AI_EMBEDDING_MODEL: str = os.getenv("FPT_AI_EMBEDDING_MODEL", "Vietnamese_Embedding")
    FPT_AI_RERANK_MODEL: str = os.getenv("FPT_AI_RERANK_MODEL", "bge-reranker-v2-m3")
    
    # 4. Audio (STT & TTS)
    FPT_AI_STT_MODEL: str = os.getenv("FPT_AI_STT_MODEL", "FPT.AI-whisper-large-v3-turbo")
    FPT_AI_TTS_MODEL: str = os.getenv("FPT_AI_TTS_MODEL", "FPT.TTS-pro")

    # Google Gemini Fallback
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
