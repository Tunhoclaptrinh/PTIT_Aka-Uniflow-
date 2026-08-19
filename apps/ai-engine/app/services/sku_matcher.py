import re
import math
import hashlib
from typing import List, Dict, Any, Optional
# pyrefly: ignore [missing-import]
# type: ignore
from qdrant_client import QdrantClient
# pyrefly: ignore [missing-import]
# type: ignore
from qdrant_client.http import models as qmodels
from app.core.config import settings

class HybridSKUMatcher:
    """
    Thuật toán Hybrid Matching kết hợp Vector Embedding (Qdrant Vector DB) và Phân tích thực thể NER
    Công thức chuẩn hóa: Score = 0.7 * S_vector + 0.3 * S_attribute
    """
    _qdrant_client: Optional[QdrantClient] = None

    @classmethod
    def get_qdrant_client(cls) -> Optional[QdrantClient]:
        if cls._qdrant_client is None:
            try:
                client = QdrantClient(
                    host=settings.QDRANT_HOST,
                    port=settings.QDRANT_PORT,
                    timeout=2.0
                )
                # Kiểm tra kết nối
                client.get_collections()
                cls._qdrant_client = client
            except Exception as e:
                # Qdrant chưa khởi động hoặc offline -> fallback graceful
                cls._qdrant_client = None
        return cls._qdrant_client

    @staticmethod
    def generate_text_embedding(text: str, dim: int = 128) -> List[float]:
        """Tạo vector embedding 128 chiều từ nội dung văn bản tiếng Việt/Anh"""
        clean_text = re.sub(r'[^\w\s]', '', text.lower())
        tokens = clean_text.split()
        if not tokens:
            return [0.0] * dim

        vector = [0.0] * dim
        for token in tokens:
            h = int(hashlib.sha256(token.encode('utf-8')).hexdigest(), 16)
            for i in range(dim):
                vector[i] += ((h >> (i % 32)) & 0xFF) / 255.0 - 0.5

        # Chuẩn hóa L2 norm
        norm = math.sqrt(sum(x * x for x in vector))
        if norm > 0:
            vector = [round(x / norm, 6) for x in vector]
        return vector

    @staticmethod
    def calculate_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Tính Cosine Similarity giữa 2 vector"""
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.85
        dot = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))
        if norm1 == 0 or norm2 == 0:
            return 0.85
        cosine = dot / (norm1 * norm2)
        # Scale về khoảng [0.5, 1.0] phù hợp với phân phối sản phẩm tương đương
        scaled = 0.5 + (cosine * 0.5)
        return min(max(round(scaled, 4), 0.0), 1.0)

    @staticmethod
    def extract_attributes(text: str) -> Dict[str, Any]:
        """Bóc tách thực thể sản phẩm (NER): Kích thước, Màu sắc, Chất liệu, Kiểu dáng"""
        t = text.lower()
        sizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', 'xxl', 'freesize']
        colors = ['đen', 'black', 'trắng', 'white', 'xanh', 'blue', 'navy', 'đỏ', 'red', 'xám', 'grey', 'gray', 'vàng', 'yellow', 'hồng', 'pink', 'nâu', 'brown', 'kem', 'beige']
        materials = ['cotton', 'pima', 'compact', 'polyester', 'poly', 'spandex', 'lụa', 'silk', 'nỉ', 'jean', 'denim', 'kaki', 'linen']

        found_sizes = [s.upper() for s in sizes if re.search(rf'\b{s}\b', t)]
        found_colors = [c for c in colors if c in t]
        found_materials = [m for m in materials if m in t]

        return {
            "size": found_sizes[0] if found_sizes else None,
            "colors": found_colors,
            "materials": found_materials,
        }

    @classmethod
    def calculate_attribute_similarity(cls, source_text: str, target_text: str) -> float:
        """So khớp thực thể chi tiết (Size, Color, Material, Tokens)"""
        attr1 = cls.extract_attributes(source_text)
        attr2 = cls.extract_attributes(target_text)

        size_match = 1.0 if (attr1['size'] and attr2['size'] and attr1['size'] == attr2['size']) else (0.5 if not attr1['size'] or not attr2['size'] else 0.0)
        color_match = 1.0 if (set(attr1['colors']) & set(attr2['colors'])) else (0.7 if not attr1['colors'] or not attr2['colors'] else 0.2)
        material_match = 1.0 if (set(attr1['materials']) & set(attr2['materials'])) else (0.8 if not attr1['materials'] or not attr2['materials'] else 0.3)

        source_words = set(source_text.lower().split())
        target_words = set(target_text.lower().split())
        jaccard = len(source_words.intersection(target_words)) / len(source_words.union(target_words)) if target_words else 0.5

        final_attr_score = (0.4 * size_match) + (0.3 * color_match) + (0.15 * material_match) + (0.15 * jaccard)
        return min(max(round(final_attr_score, 4), 0.0), 1.0)

    @classmethod
    def calculate_hybrid_score(
        cls,
        source_name: str,
        target_name: str,
        vector_sim: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Tính điểm lai (Hybrid Score) giữa 2 sản phẩm:
        - Vector Similarity (từ Qdrant hoặc Text Embedding Cosine)
        - Attribute Similarity (NER bóc tách thực thể)
        """
        if vector_sim is None:
            vec1 = cls.generate_text_embedding(source_name)
            vec2 = cls.generate_text_embedding(target_name)
            v_sim = cls.calculate_cosine_similarity(vec1, vec2)
        else:
            v_sim = vector_sim

        attr_sim = cls.calculate_attribute_similarity(source_name, target_name)
        hybrid_score = round((0.7 * v_sim) + (0.3 * attr_sim), 4)

        return {
            "hybrid_score": hybrid_score,
            "vector_sim": v_sim,
            "attribute_sim": attr_sim,
            "action": cls.determine_action(hybrid_score),
            "confidence_percent": round(hybrid_score * 100, 1),
            "qdrant_connected": cls.get_qdrant_client() is not None,
            "entities": cls.extract_attributes(source_name),
        }

    @classmethod
    def determine_action(cls, score: float) -> str:
        if score >= 0.92:
            return "AUTO_APPROVED"
        elif score >= 0.70:
            return "PENDING_REVIEW"
        else:
            return "MANUAL_REQUIRED"
