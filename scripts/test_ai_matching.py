"""
Script kiểm thử nhanh thuật toán Hybrid SKU Matching (NLP NER + Vector Similarity + Formula)
Chạy: python scripts/test_ai_matching.py
"""

import sys
import io

# Đảm bảo UTF-8 cho Windows console
if sys.platform.startswith('win'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def calculate_attribute_similarity(name_source: str, name_target: str) -> float:
    """Tính toán tương đồng thuộc tính từ khóa đơn giản"""
    source_words = set(name_source.lower().split())
    target_words = set(name_target.lower().split())
    intersection = source_words.intersection(target_words)
    union = source_words.union(target_words)
    return len(intersection) / len(union) if union else 0.0

def hybrid_score(vector_similarity: float, attr_similarity: float) -> float:
    """Công thức Hybrid: 0.7 * Vector + 0.3 * Attribute"""
    return round(0.7 * vector_similarity + 0.3 * attr_similarity, 4)

def evaluate_sku_pair(marketplace_item: str, pos_master_sku: str, simulated_vector_sim: float):
    attr_sim = calculate_attribute_similarity(marketplace_item, pos_master_sku)
    final_score = hybrid_score(simulated_vector_sim, attr_sim)
    
    status = ""
    if final_score >= 0.95:
        status = "[AUTO_APPROVED] - Tu dong lien ket"
    elif final_score >= 0.70:
        status = "[NEEDS_REVIEW] - Goi y 1-click len Dashboard"
    else:
        status = "[MANUAL_REQUIRED] - Yeu cau ghep tay"

    print(f"\n[San pham San]  : {marketplace_item}")
    print(f"[SKU Kho POS]   : {pos_master_sku}")
    print(f"-> Vector Cosine : {simulated_vector_sim}")
    print(f"-> Thuoc tinh Jaccard: {round(attr_sim, 4)}")
    print(f"-> Hybrid Score : {final_score}")
    print(f"-> Quyet dinh   : {status}")

if __name__ == "__main__":
    print("=" * 60)
    print("TEST THUAT TOAN HYBRID AI SKU MATCHING (UNIFLOW AI)")
    print("=" * 60)

    # Test Case 1: Tương đồng cao
    evaluate_sku_pair(
        marketplace_item="Áo thun Cotton Nam Màu Đen Size L Cao Cấp PTIT",
        pos_master_sku="Áo Thun Cotton Nam Đen Size L",
        simulated_vector_sim=0.98
    )

    # Test Case 2: Tương đồng vừa (Cần review)
    evaluate_sku_pair(
        marketplace_item="Áo Polo Pima Nam Trắng M Co Giãn 4 Chiều",
        pos_master_sku="Áo Polo Nam Trắng Size M",
        simulated_vector_sim=0.88
    )

    # Test Case 3: Không khớp
    evaluate_sku_pair(
        marketplace_item="Quần Jean Nam Ống Rộng Xanh Đậm",
        pos_master_sku="Áo Sơ Mi Nam Tay Dài Trắng",
        simulated_vector_sim=0.35
    )
    print("\n" + "=" * 60)
