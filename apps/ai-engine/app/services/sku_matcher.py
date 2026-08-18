from typing import List, Dict, Any

class HybridSKUMatcher:
    """
    Thuật toán Hybrid Matching kết hợp Vector Embedding và Phân tích thuộc tính (NER)
    Công thức: Score = 0.7 * S_vector + 0.3 * S_attribute
    """
    
    @staticmethod
    def calculate_attribute_similarity(source_text: str, target_text: str) -> float:
        source_words = set(source_text.lower().split())
        target_words = set(target_text.lower().split())
        if not source_words or not target_words:
            return 0.0
        
        intersection = source_words.intersection(target_words)
        union = source_words.union(target_words)
        return len(intersection) / len(union) if union else 0.0

    @classmethod
    def calculate_hybrid_score(cls, vector_sim: float, source_name: str, target_name: str) -> float:
        attr_sim = cls.calculate_attribute_similarity(source_name, target_name)
        score = 0.7 * vector_sim + 0.3 * attr_sim
        return round(score, 4)

    @classmethod
    def determine_action(cls, score: float) -> str:
        if score >= 0.95:
            return "AUTO_APPROVED"
        elif score >= 0.70:
            return "NEEDS_REVIEW"
        else:
            return "MANUAL_REQUIRED"
