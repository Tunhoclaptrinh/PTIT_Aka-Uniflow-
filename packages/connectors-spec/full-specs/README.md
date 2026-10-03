# 📚 UNIFLOW AI — THƯ VIỆN TOÀN DIỆN TÀI LIỆU API (FULL API SPECS SUITE)

Thư viện tài liệu API hoàn chỉnh (Full Specifications) phục vụ **UniFlow AI Integration Hub**, cho phép AI và lập trình viên tạo Connector điều khiển mọi khía cạnh nghiệp vụ: Quản lý sản phẩm, Danh mục, Biến thể SKU, Tồn kho đa điểm, Vận đơn, Trừ kho, Hóa đơn điện tử, CSKH đa kênh và Thông báo thời gian thực.

---

## 📂 **CẤU TRÚC THƯ VIỆN ĐÃ ĐƯỢC CÀO VÀ ĐÓNG GÓI HOÀN CHỈNH TỪNG NGÓC NGÁCH**

```
packages/connectors-spec/full-specs/
│
├── 🛒 sapo/                                    # Sapo Omnichannel Deep Suite
│   ├── sapo_complete_deep_attributes.json     # Trọn vẹn 31 chuyên mục sâu của Sapo (Hơn 500 code snippets)
│   ├── sapo_order_properties_complete.md      # Chi tiết 148 snippets & 37 mô tả của toàn bộ thuộc tính Order
│   ├── sapo_order_product_details.json        # Code snippets chi tiết các phương thức GET/POST/PUT/DELETE
│   ├── sapo_extracted_core_pages.json         # Danh mục các trang lõi
│   └── sapo_full_suite.json                   # 6 modules cốt lõi (Orders, Products, Inventory, Customers, Webhooks, Fulfillments)
│
├── ⚡ nhanh-vn/                                # Nhanh.vn Open API v3 Deep Suite
│   ├── nhanh_vn_complete_clean_docs.md        # 787.1 KB (15,251 dòng Markdown) - 152/152 trang tài liệu gốc sạch
│   ├── nhanh_vn_model_constants.md            # Bảng toàn bộ Hằng số, Trạng thái đơn, Lý do hủy, Hãng vận chuyển
│   ├── nhanh_vn_full_catalog.json             # Danh mục toàn bộ 104 endpoints phân loại theo module
│   └── nhanh_vn_core_modules_spec.json        # Định nghĩa các module trọng yếu
│
├── 🥞 pancake/                                 # Pancake POS & Pages.fm Suite
│   ├── pancake_openapi_full.yaml              # 175 KB - Toàn bộ 100% endpoints (Shops, Pages, Tokens, Products, Orders, Customers)
│   └── pancake_webhook_full.yaml              # 38.8 KB - Toàn bộ Webhooks events catalog của Pancake
│
├── 🧾 misa-meinvoice/                          # MISA meInvoice Hóa Đơn Điện Tử Deep Suite
│   ├── misa_meinvoice_error_codes.json        # 43 mã lỗi nghiệp vụ chi tiết phục vụ AI Error Healing
│   ├── misa_meinvoice_crawled_pages.json      # 42 trang tài liệu chi tiết DocFX (Cloud API, WebAPI, HSM)
│   └── misa_meinvoice_full_suite.json         # Vòng đời hóa đơn: Lập nháp, Ký số phát hành, Hủy, Thay thế, Điều chỉnh, Xuất XML/PDF
│
└── 🤖 telegram/                                # Telegram Bot API Suite
    └── telegram_bot_full_suite.json           # 90+ Bot API methods & Cấu trúc Webhook Update
```

---

## 💎 **BẢNG ĐẶC TẢ OPENAPI 3.1 CHUẨN HÓA SẴN SÀNG CHO AI GEN CODE**

Nằm tại thư mục `packages/connectors-spec/schemas/`:
1. `sapo_exhaustive_spec.json` (15.0 KB)
2. `nhanh_vn_exhaustive_spec.json` (10.8 KB)
3. `pancake_exhaustive_spec.json` (9.7 KB)
4. `misa_meinvoice_exhaustive_spec.json` (10.7 KB)
5. `misa_amis_crm_exhaustive_spec.json` (7.9 KB)
6. `telegram_exhaustive_spec.json` (9.1 KB)
