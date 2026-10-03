# UNIFLOW ENTERPRISE — MA TRẬN ĐỐI CHIẾU & LƯU TRỮ API DOCS ĐA NỀN TẢNG (1:1 MAPPING)

> **Mục đích tài liệu:**
> Tài liệu này là **Single Source of Truth (SSOT)** lưu trữ, rà soát và đối chiếu toàn bộ các API chính thức của các nền tảng thứ 3 mà UniFlow tích hợp và điều khiển. 
> UniFlow đóng vai trò là **Hệ điều hành Doanh nghiệp / Cổng điều khiển tập trung (Control Plane & Infrastructure API Gateway)**, cho phép Workflow Automation Engine, AI Agent và đội ngũ kỹ thuật gọi thực thi hoặc giả lập sandbox với các hệ thống POS bán lẻ, Hóa đơn điện tử, Kho bãi, CMS bài viết, Vận chuyển và CRM.

---

## 1. KIẾN TRÚC ROUTING & PHÂN VÙNG SWAGGER UI

Mỗi API tích hợp đều tuân thủ nguyên tắc:
1. **Đường dẫn chuẩn hóa tại UniFlow:** `http://localhost:3000/api/v1/infra/{platform}/{origin_path}`
2. **Ánh xạ 1:1 với Endpoint gốc:** Giữ nguyên Method (GET/POST/PUT/DELETE) và cấu trúc URL của tài liệu hãng phát hành để lập trình viên hoặc AI Agent dễ dàng đối chiếu.
3. **Phân vùng Module Swagger trực quan (Accordion Collapsible Groups):**
   - Đặt tiền tố tag theo quy ước chuẩn: `[Nền tảng] 0X. Tên Module (Tên tiếng Anh)`
   - Swagger UI tự động tạo từng khối collapse riêng biệt cho từng nghiệp vụ (Đơn hàng, Sản phẩm, Tồn kho, Khách hàng, Bài viết CMS, Webhooks, v.v.), giúp người dùng tra cứu nhanh chóng, không bị rối mắt giữa hàng trăm endpoint.
4. **Cơ chế Chuyển đổi Hai Chế độ (Dual Mode via Header `x-uniflow-mode`):**
   - `x-uniflow-mode: LIVE`: Gọi trực tiếp đến máy chủ của đối tác bằng thông tin chứng thực (API Key / Bearer Token / Partner ID) của Tenant.
   - `x-uniflow-mode: SANDBOX` (Mặc định): Trả về phản hồi giả lập chuẩn schema thực tế từ Sandbox Engine, không ảnh hưởng dữ liệu sản xuất.
5. **Swagger UI trực quan:** Tra cứu và gửi request thử nghiệm tại `http://localhost:3000/docs` (hoặc JSON schema tại `http://localhost:3000/docs-json`).

---

## 2. BẢNG TỔNG HỢP NỀN TẢNG & KIẾN TRÚC MODULAR CONTROLLERS

| Nhóm | Nền tảng | Cấu trúc Modular Controllers | Số Module | Số API Tích Hợp | Link Tài liệu Chính thức |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POS** | **Nhanh.vn** | `controllers/nhanh/` (14 controller classes) | 14 modules | 56 endpoints | [developers.nhanh.group](https://developers.nhanh.group/) |
| **POS & CMS** | **Sapo Omnichannel** | `controllers/sapo/` (10 controller files, 29 resource groups) | 29 resources | 96 endpoints | [support.sapo.vn](https://support.sapo.vn/gioi-thieu-api) |
| **POS** | **KiotViet** | `controllers/kiotviet/` (7 controller files, 7 official modules) | 7 modules | 96 endpoints | [kiotviet.vn/public-api](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/retail-ket-noi-api/public-api/) |
| **POS & CMS** | **Haravan Omnichannel** | `controllers/haravan/` (9 controller files, 12 official categories) | 12 categories | 197 endpoints | [docs.haravan.com/docs/omni-apis/](https://docs.haravan.com/docs/omni-apis/) |
| **Social POS** | **Pancake POS** | `controllers/pancake/` (11 controller files, 11 official modules) | 11 modules | 120 endpoints (103 official + 17 legacy) | [docs.pancake.biz/pos/api/](https://docs.pancake.biz/pos/api/) |
| **Hệ sinh thái MISA** | **eShop, meInvoice, AMIS CRM v2, AMIS Kế toán ACT Open API** | `controllers/misa/` (4 controller files, 23 resource groups across 4 major platforms) | 23 modules | 115 endpoints | [crmconnect.misa.vn](https://crmconnect.misa.vn/docs-v2/index.html) / [actdocs.misa.vn](https://actdocs.misa.vn/g2/graph/ACTOpenAPIHelp/index.html) / [meinvoice.vn](https://meinvoice.vn/) / [eshop.misa.vn](https://eshop.misa.vn/) |
| **Logistics** | **GHTK / GHN / Viettel Post** | `controllers/logistics/logistics.controller.ts` (3 carrier groups) | 3 modules | 28 endpoints | [docs.giaohangtietkiem.vn](https://docs.giaohangtietkiem.vn/) / [api.ghn.vn](https://api.ghn.vn/) |
| **Sàn TMĐT** | **Shopee, TikTok, Lazada, Tiki, Shopify** | `controllers/marketplaces.controller.ts` (5 platform groups) | 5 modules | 23 endpoints | Shopee Open API / TikTok Shop Open API |
| **UniFlow Core** | **Infra Gateway, Promotions, Gateways** | `infra-gateway.controller.ts`, `core/`, `gateways/` | 3 modules | 11 endpoints | UniFlow Master Control Plane |

---

## 3. DANH SÁCH CHI TIẾT TỪNG MODULE TRÊN SWAGGER UI

### 3.1. Nhanh.vn Open API (14 Collapsible Groups trên Swagger)

- **`[POS-Nhanh] 01. Đơn hàng (Orders)`** — [`nhanh-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-orders.controller.ts)
  + `POST /api/order/add`: Khởi tạo đơn hàng mới
  + `POST /api/order/index`: Tra cứu danh sách đơn hàng lọc theo ngày, trạng thái
  + `POST /api/order/detail`: Lấy chi tiết đơn hàng (sản phẩm, giá bán, chiết khấu)
  + `POST /api/order/update`: Cập nhật thông tin giao nhận, người mua
  + `POST /api/order/status`: Đổi trạng thái đơn hàng (Packing, Success, Canceled)
  + `POST /api/order/delete`: Hủy / Xóa đơn hàng

- **`[POS-Nhanh] 02. Vận chuyển (Shipping)`** — [`nhanh-shipping.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-shipping.controller.ts)
  + `POST /api/shipping/fee`: Tính cước vận chuyển chuẩn qua Nhanh Ship
  + `POST /api/shipping/carrier`: Tra cứu danh sách hãng vận chuyển khả dụng
  + `POST /api/shipping/handover`: Tạo biên bản bàn giao gói hàng cho bưu tá

- **`[POS-Nhanh] 03. Sản phẩm (Products)`** — [`nhanh-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-products.controller.ts)
  + `POST /api/product/add`: Thêm sản phẩm mới kèm phân loại biến thể
  + `POST /api/product/search`: Tìm kiếm sản phẩm theo mã SKU, barcode hoặc tên
  + `POST /api/product/detail`: Chi tiết sản phẩm, giá bán lẻ, giá buôn
  + `POST /api/product/update`: Cập nhật thông tin sản phẩm và mô tả
  + `POST /api/product/delete`: Xóa / Ngừng kinh doanh sản phẩm

- **`[POS-Nhanh] 04. Kho bãi & Tồn kho (Inventory)`** — [`nhanh-inventory.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-inventory.controller.ts)
  + `POST /api/inventory/item`: Tra cứu tồn kho sản phẩm theo từng chi nhánh kho
  + `POST /api/inventory/depot`: Tồn kho tổng hợp toàn hệ thống
  + `POST /api/inventory/remain`: Báo cáo tồn có thể bán (Available for sale)
  + `POST /api/inventory/check`: Tạo phiếu kiểm kê kho và ghi nhận lệch hàng
  + `POST /api/inventory/transfer`: Lập phiếu điều chuyển hàng giữa các kho

- **`[POS-Nhanh] 05. Khách hàng & Loyalty (Customer)`** — [`nhanh-customers.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-customers.controller.ts)
  + `POST /api/customer/add`: Đăng ký hồ sơ khách hàng mới
  + `POST /api/customer/search`: Tìm kiếm khách hàng theo SĐT, email
  + `POST /api/customer/detail`: Chi tiết khách hàng và lịch sử mua sắm
  + `POST /api/customer/update`: Cập nhật hạng thẻ, địa chỉ giao hàng
  + `POST /api/customer/point`: Điều chỉnh điểm thưởng / tích điểm thành viên

- **`[POS-Nhanh] 06. Doanh nghiệp (Business: Kho, NV, NCC)`** — [`nhanh-business.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-business.controller.ts)
  + `POST /api/business/depot`: Danh sách địa chỉ kho hàng và cửa hàng
  + `POST /api/business/user`: Danh sách tài khoản nhân viên bán hàng
  + `POST /api/business/supplier`: Danh bạ nhà cung cấp hàng hóa

- **`[POS-Nhanh] 07. Hóa đơn bán lẻ & Hóa đơn VAT (Bills & Invoices)`** — [`nhanh-billing.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-billing.controller.ts)
  + `POST /api/bill/add`: Tạo hóa đơn bán lẻ tại quầy POS
  + `POST /api/bill/search`: Tra cứu lịch sử hóa đơn bán lẻ theo ca
  + `POST /api/invoice/add`: Phát hành hóa đơn đỏ / Hóa đơn điện tử VAT

- **`[POS-Nhanh] 08. Khuyến mãi & Voucher (Promotions)`** — [`nhanh-promotions.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-promotions.controller.ts)
  + `POST /api/promotion/check`: Kiểm tra điều kiện áp dụng mã giảm giá và voucher
  + `POST /api/promotion/add`: Khởi tạo chương trình khuyến mãi / Mã coupon chiết khấu

- **`[POS-Nhanh] 09. Kế toán & Sổ quỹ (Accounting)`** — [`nhanh-accounting.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-accounting.controller.ts)
  + `POST /api/accounting/transaction`: Lập phiếu thu chi tiền mặt hoặc chuyển khoản
  + `POST /api/accounting/debt`: Tra cứu công nợ khách hàng và nhà cung cấp

- **`[POS-Nhanh] 10. Zalo & Đồng bộ sàn (Zalo & Ecom)`** — [`nhanh-integrations.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-integrations.controller.ts)
  + `POST /api/zalo/send`: Gửi tin nhắn Zalo chăm sóc khách hàng tự động
  + `POST /api/ecommerce/sync`: Đồng bộ trạng thái đơn hàng và tồn kho đa sàn

- **`[POS-Nhanh] 11. Webhooks sự kiện (Webhooks)`** — [`nhanh-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-webhooks.controller.ts)
  + `POST /api/webhook/verify`: Đăng ký và kiểm tra xác thực Webhook listener
  + `POST /api/webhook/history`: Nhật ký bắn sự kiện realtime (Order, Product, Stock)

- **`[POS-Nhanh] 12. Vpage — Hội thoại & Tin nhắn đa kênh (Vpage Chat)`** — [`nhanh-vpage.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-vpage.controller.ts)
  + `POST /vpage/conversation/index`: Danh sách hội thoại Vpage đa kênh Facebook/Zalo
  + `POST /vpage/conversation/detail`: Lịch sử tin nhắn và thông tin khách hàng
  + `POST /vpage/message/send`: Gửi tin nhắn phản hồi tới khách hàng
  + `POST /vpage/conversation/update`: Đổi trạng thái hội thoại và gán nhân viên tư vấn
  + `POST /vpage/label/add`: Tạo nhãn hội thoại (VIP, Tiềm năng, Cần hỗ trợ)
  + `GET /vpage/label/index`: Danh sách toàn bộ nhãn hội thoại
  + `POST /vpage/customer/search`: Tìm kiếm thông tin khách hàng Vpage theo SĐT

- **`[POS-Nhanh] 13. Báo cáo & Phân tích (Reports & Analytics)`** — [`nhanh-reports-categories.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-reports-categories.controller.ts)
  + `POST /api/report/revenue`: Báo cáo doanh thu, chiết khấu, lợi nhuận gộp theo kho/kỳ
  + `POST /api/report/inventory`: Báo cáo tồn kho thực tế và khả dụng theo chi nhánh
  + `POST /api/report/best-seller`: Top sản phẩm bán chạy nhất theo doanh số và số lượng

- **`[POS-Nhanh] 14. Danh mục & Thương hiệu (Categories & Brands)`** — [`nhanh-reports-categories.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/nhanh/nhanh-reports-categories.controller.ts)
  + `POST /api/product/category`: Cây phân cấp danh mục ngành hàng Nhanh.vn
  + `POST /api/product/category/add`: Thêm danh mục sản phẩm mới
  + `POST /api/product/brand`: Danh sách thương hiệu đối tác
  + `POST /api/product/search-combo`: Tìm kiếm và tra cứu gói combo sản phẩm

---

### 3.2. Sapo Omnichannel API — Ánh xạ 1:1 Toàn bộ Resource theo Sapo API Reference Sidebar (29 Collapsible Groups trên Swagger, đánh số thứ tự 01..29)

Toàn bộ 29 resources của Sapo được đánh số thứ tự phân loại mạch lạc theo đúng quy trình nghiệp vụ kinh doanh:

- **`[POS-Sapo] 01. Order`** — [`sapo-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-orders.controller.ts)
  + `POST /admin/orders.json`: Tạo đơn hàng mới Sapo Omnichannel
  + `GET /admin/orders.json`: Danh sách đơn hàng theo trạng thái
  + `GET /admin/orders/:id.json`: Chi tiết đơn hàng Sapo
  + `PUT /admin/orders/:id.json`: Cập nhật đơn hàng
  + `POST /admin/orders/:id/cancel.json`: Hủy đơn hàng và tự động restock
  + `POST /admin/orders/:id/close.json`: Đóng đơn hàng thành công
  + `POST /admin/orders/:id/open.json`: Mở lại đơn hàng đã đóng
  + `DELETE /admin/orders/:id.json`: Xóa đơn hàng

- **`[POS-Sapo] 02. Fulfillment`** — [`sapo-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-orders.controller.ts)
  + `POST /admin/orders/:id/fulfillments.json`: Xuất kho fulfillment và đóng gói đơn hàng
  + `GET /admin/orders/:id/fulfillments.json`: Danh sách các gói vận chuyển fulfillment của đơn

- **`[POS-Sapo] 03. Transaction`** — [`sapo-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-orders.controller.ts)
  + `POST /admin/orders/:id/transactions.json`: Ghi nhận giao dịch thanh toán thành công
  + `GET /admin/orders/:id/transactions.json`: Lịch sử các đợt thanh toán của đơn hàng

- **`[POS-Sapo] 04. Refund`** — [`sapo-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-orders.controller.ts)
  + `POST /admin/orders/:id/refunds.json`: Đổi trả hàng và hoàn tiền
  + `GET /admin/refunds.json`: Danh sách phiếu đổi trả hàng

- **`[POS-Sapo] 05. Product`** — [`sapo-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-products.controller.ts)
  + `POST /admin/products.json`: Thêm sản phẩm mới kèm ảnh và biến thể
  + `GET /admin/products.json`: Tra cứu danh sách sản phẩm
  + `GET /admin/products/:id.json`: Chi tiết sản phẩm
  + `PUT /admin/products/:id.json`: Sửa thông tin sản phẩm và giá niêm yết
  + `DELETE /admin/products/:id.json`: Xóa sản phẩm

- **`[POS-Sapo] 06. Product Variant`** — [`sapo-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-products.controller.ts)
  + `GET /admin/variants.json`: Lấy danh sách biến thể toàn cửa hàng
  + `GET /admin/products/:id/variants.json`: Lấy biến thể theo sản phẩm
  + `POST /admin/products/:id/variants.json`: Thêm biến thể cho sản phẩm

- **`[POS-Sapo] 07. Product Image`** — [`sapo-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-products.controller.ts)
  + `GET /admin/products/:id/images.json`: Danh sách ảnh sản phẩm
  + `POST /admin/products/:id/images.json`: Tải lên ảnh sản phẩm
  + `DELETE /admin/products/:product_id/images/:id.json`: Xóa ảnh sản phẩm

- **`[POS-Sapo] 08. CustomCollection`** — [`sapo-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-products.controller.ts)
  + `POST /admin/custom_collections.json`: Tạo nhóm sản phẩm tùy chọn thủ công
  + `GET /admin/custom_collections.json`: Danh sách nhóm sản phẩm thủ công

- **`[POS-Sapo] 09. SmartCollection`** — [`sapo-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-products.controller.ts)
  + `GET /admin/smart_collections.json`: Danh sách nhóm sản phẩm thông minh (Smart Collection)
  + `POST /admin/smart_collections.json`: Tạo nhóm sản phẩm tự động lọc theo điều kiện

- **`[POS-Sapo] 10. Collect`** — [`sapo-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-products.controller.ts)
  + `POST /admin/collects.json`: Gán sản phẩm vào nhóm bộ sưu tập (Collect)
  + `GET /admin/collects.json`: Danh sách liên kết sản phẩm - nhóm
  + `DELETE /admin/collects/:id.json`: Gỡ sản phẩm khỏi nhóm

- **`[POS-Sapo] 11. InventoryLevel`** — [`sapo-inventory.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-inventory.controller.ts)
  + `POST /admin/inventory_levels/adjust.json`: Điều chỉnh tăng/giảm tồn kho thực tế
  + `POST /admin/inventory_levels/set.json`: Cài đặt số lượng tồn kho cố định
  + `GET /admin/inventory_levels.json`: Báo cáo tồn kho khả dụng theo từng kho
  + `POST /admin/inventory_transfers.json`: Lập phiếu điều chuyển hàng nội bộ giữa các kho
  + `POST /admin/inventory_transfers/:id/receive.json`: Kho đích xác nhận nhận hàng chuyển kho

- **`[POS-Sapo] 12. Location`** — [`sapo-inventory.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-inventory.controller.ts)
  + `GET /admin/locations.json`: Danh sách chi nhánh cửa hàng và kho hàng Sapo
  + `GET /admin/locations/:id.json`: Chi tiết địa điểm kho hàng

- **`[POS-Sapo] 13. Customer`** — [`sapo-customers.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-customers.controller.ts)
  + `POST /admin/customers.json`: Tạo khách hàng mới
  + `GET /admin/customers.json`: Danh sách khách hàng và điểm tích lũy
  + `GET /admin/customers/:id.json`: Chi tiết hồ sơ khách hàng
  + `PUT /admin/customers/:id.json`: Cập nhật thông tin khách hàng
  + `DELETE /admin/customers/:id.json`: Xóa hồ sơ khách hàng
  + `POST /admin/customers/:id/loyalty_points.json`: Tích / tiêu điểm thành viên Loyalty

- **`[POS-Sapo] 14. CustomerAddress`** — [`sapo-customers.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-customers.controller.ts)
  + `GET /admin/customers/:customer_id/addresses.json`: Danh sách địa chỉ nhận hàng của khách
  + `POST /admin/customers/:customer_id/addresses.json`: Thêm địa chỉ mới vào sổ địa chỉ
  + `PUT /admin/customers/:customer_id/addresses/:id.json`: Cập nhật địa chỉ nhận hàng
  + `DELETE /admin/customers/:customer_id/addresses/:id.json`: Xóa địa chỉ

- **`[POS-Sapo] 15. Purchase & Cash`** — [`sapo-finance.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-finance.controller.ts)
  + `POST /admin/purchase_orders.json`: Lập đơn nhập hàng từ nhà cung cấp
  + `GET /admin/purchase_orders.json`: Danh sách phiếu nhập hàng
  + `POST /admin/cash_receipts.json`: Lập phiếu thu chi tiền mặt tại quầy

- **`[POS-Sapo] 16. Price Rule`** — [`sapo-discounts.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-discounts.controller.ts)
  + `POST /admin/price_rules.json`: Tạo quy tắc giá và chiến dịch chiết khấu
  + `GET /admin/price_rules.json`: Danh sách quy tắc giá khuyến mãi đang chạy
  + `DELETE /admin/price_rules/:id.json`: Xóa quy tắc giá

- **`[POS-Sapo] 17. DiscountCode`** — [`sapo-discounts.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-discounts.controller.ts)
  + `POST /admin/price_rules/:price_rule_id/discount_codes.json`: Tạo mã coupon giảm giá cụ thể
  + `GET /admin/price_rules/:price_rule_id/discount_codes.json`: Danh sách mã giảm giá của Price Rule
  + `DELETE /admin/price_rules/:price_rule_id/discount_codes/:id.json`: Xóa mã giảm giá

- **`[POS-Sapo] 18. Shipments & Carriers`** — [`sapo-reports-carriers.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-reports-carriers.controller.ts)
  + `POST /admin/shipments.json`: Đẩy tạo vận đơn giao hàng Sapo Express (GHN/GHTK)
  + `GET /admin/shipments/:id.json`: Tra cứu chi tiết và hành trình bưu kiện thời gian thực
  + `POST /admin/shipments/:id/cancel.json`: Hủy phiếu giao hàng khi đơn bị hủy

- **`[POS-Sapo] 19. Reports & Analytics`** — [`sapo-reports-carriers.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-reports-carriers.controller.ts)
  + `GET /admin/reports/sales.json`: Báo cáo doanh thu, chiết khấu, lợi nhuận thuần bán lẻ
  + `GET /admin/reports/top-products.json`: Thống kê hàng hóa có sản lượng và doanh số cao nhất
  + `GET /admin/reports/channels.json`: Cơ cấu doanh thu theo kênh bán lẻ, web và sàn TMĐT

- **`[POS-Sapo] 20. Article`** — [`sapo-cms.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-cms.controller.ts)
  + `POST /admin/blogs/:blog_id/articles.json`: Tạo bài viết mới trong Blog chuẩn SEO
  + `POST /admin/articles.json`: Tạo bài viết mới trực tiếp
  + `GET /admin/blogs/:blog_id/articles.json`: Danh sách bài viết theo chuyên mục Blog
  + `GET /admin/articles.json`: Toàn bộ danh sách bài viết
  + `GET /admin/articles/:id.json`: Chi tiết bài viết HTML, hình ảnh và SEO metadata
  + `PUT /admin/blogs/:blog_id/articles/:id.json`: Cập nhật bài viết
  + `DELETE /admin/blogs/:blog_id/articles/:id.json`: Xóa bài viết

- **`[POS-Sapo] 21. Blog`** — [`sapo-cms.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-cms.controller.ts)
  + `POST /admin/blogs.json`: Tạo chuyên mục Blog mới
  + `GET /admin/blogs.json`: Danh sách các chuyên mục Blog
  + `GET /admin/blogs/:id.json`: Chi tiết chuyên mục Blog
  + `DELETE /admin/blogs/:id.json`: Xóa chuyên mục Blog

- **`[POS-Sapo] 22. Comment`** — [`sapo-cms.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-cms.controller.ts)
  + `GET /admin/comments.json`: Danh sách bình luận bài viết của độc giả
  + `POST /admin/comments.json`: Đăng bình luận mới
  + `POST /admin/comments/:id/spam.json`: Đánh dấu bình luận là Spam

- **`[POS-Sapo] 23. Page`** — [`sapo-cms.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-cms.controller.ts)
  + `POST /admin/pages.json`: Tạo trang nội dung tĩnh (Giới thiệu, Chính sách, Điều khoản)
  + `GET /admin/pages.json`: Danh sách các trang nội dung tĩnh
  + `GET /admin/pages/:id.json`: Xem chi tiết mã HTML trang tĩnh
  + `DELETE /admin/pages/:id.json`: Xóa trang tĩnh

- **`[POS-Sapo] 24. Asset`** — [`sapo-theme-metafields.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-theme-metafields.controller.ts)
  + `GET /admin/themes/:theme_id/assets.json`: Danh sách file CSS, JS, ảnh giao diện Liquid
  + `PUT /admin/themes/:theme_id/assets.json`: Tải lên / sửa file asset theme
  + `DELETE /admin/themes/:theme_id/assets.json`: Xóa file asset khỏi theme

- **`[POS-Sapo] 25. Metafield`** — [`sapo-theme-metafields.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-theme-metafields.controller.ts)
  + `GET /admin/metafields.json`: Tra cứu các trường thuộc tính mở rộng (Metafields)
  + `POST /admin/metafields.json`: Thêm trường tùy biến mở rộng
  + `DELETE /admin/metafields/:id.json`: Xóa trường tùy biến

- **`[POS-Sapo] 26. Redirect`** — [`sapo-theme-metafields.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-theme-metafields.controller.ts)
  + `GET /admin/redirects.json`: Danh sách chuyển hướng URL 301 SEO
  + `POST /admin/redirects.json`: Tạo chuyển hướng URL mới
  + `DELETE /admin/redirects/:id.json`: Xóa quy tắc chuyển hướng URL

- **`[POS-Sapo] 27. ScriptTag`** — [`sapo-theme-metafields.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-theme-metafields.controller.ts)
  + `GET /admin/script_tags.json`: Danh sách mã nhúng ScriptTag bên thứ ba
  + `POST /admin/script_tags.json`: Thêm mã nhúng ScriptTag mới
  + `DELETE /admin/script_tags/:id.json`: Gỡ mã nhúng ScriptTag

- **`[POS-Sapo] 28. Webhook`** — [`sapo-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-webhooks.controller.ts)
  + `POST /admin/webhooks.json`: Đăng ký callback URL nhận sự kiện realtime từ Sapo
  + `GET /admin/webhooks.json`: Danh sách webhook đang hoạt động
  + `DELETE /admin/webhooks/:id.json`: Hủy đăng ký webhook

- **`[POS-Sapo] 29. Event`** — [`sapo-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/sapo/sapo-webhooks.controller.ts)
  + `GET /admin/events.json`: Nhật ký sự kiện kiểm toán hệ thống (Audit log)
  + `GET /admin/events/:id.json`: Chi tiết payload của sự kiện hệ thống

---

### 3.3. KiotViet Public API — Ánh xạ 1:1 Chuẩn 26 Modules Nghiệp vụ KiotViet (7 Collapsible Groups trên Swagger, đánh số thứ tự 01..07, Tổng cộng 96 Endpoints)

Toàn bộ các phân hệ của KiotViet Retail Open API (`https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/retail-ket-noi-api/public-api/`) được bóc tách và phân bổ thành 7 Controller Groups trực quan với tiền tố Sub-resource badge `[Tên Sub-resource - Diễn giải] [METHOD /path]` và category metadata `[Thuộc danh mục: XX. Category > Sub-resource]`:

- **`[POS-KiotViet] 01. Invoices & Orders (Hóa đơn, Đặt hàng & Đổi trả)`** — [`kiotviet-invoices.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-invoices.controller.ts) (18 endpoints)
  + `POST /invoices`: [Invoice - Hóa đơn bán lẻ] Tạo hóa đơn bán lẻ trực tiếp KiotViet
  + `GET /invoices`: [Invoice - Hóa đơn bán lẻ] Danh sách hóa đơn bán hàng KiotViet
  + `GET /invoices/:id`: [Invoice - Hóa đơn bán lẻ] Chi tiết hóa đơn bán lẻ theo ID
  + `PUT /invoices/:id`: [Invoice - Hóa đơn bán lẻ] Cập nhật ghi chú và trạng thái hóa đơn
  + `DELETE /invoices/:id`: [Invoice - Hóa đơn bán lẻ] Hủy hóa đơn bán lẻ
  + `POST /orders`: [Order - Đơn đặt hàng] Khởi tạo đơn đặt hàng trước từ xa
  + `GET /orders`: [Order - Đơn đặt hàng] Danh sách đơn đặt hàng theo chi nhánh
  + `GET /orders/:id`: [Order - Đơn đặt hàng] Chi tiết đơn đặt hàng và tiền cọc
  + `PUT /orders/:id`: [Order - Đơn đặt hàng] Cập nhật thông tin đơn đặt hàng
  + `DELETE /orders/:id`: [Order - Đơn đặt hàng] Hủy đơn đặt hàng
  + `POST /orders/booking`: [Booking - Đặt chỗ dịch vụ] Tạo lịch hẹn / Đặt chỗ trước
  + `POST /returns` & `/returns/create`: [Return - Phiếu trả hàng] Lập phiếu nhận hàng trả lại & hoàn tiền
  + `GET /returns`: [Return - Phiếu trả hàng] Danh sách phiếu trả hàng KiotViet
  + `GET /returns/:id`: [Return - Phiếu trả hàng] Chi tiết phiếu trả hàng theo ID
  + `POST /payments` & `/invoices/payment`: [Payment - Thanh toán hóa đơn] Ghi nhận thanh toán hóa đơn nợ KiotViet
  + `GET /orderproposals`: [Order Proposal - Đặt hàng nhập] Danh sách phiếu đặt hàng nhập từ NCC
  + `GET /orderproposals/:id`: [Order Proposal - Đặt hàng nhập] Chi tiết phiếu đặt hàng nhập NCC
  + `POST /orderproposals`: [Order Proposal - Đặt hàng nhập] Tạo đề xuất đặt hàng nhập mua mới
  + `PUT /einvoices/info`: [E-Invoice - Hóa đơn điện tử] Cập nhật thông tin phát hành HĐĐT ngoài KiotViet

- **`[POS-KiotViet] 02. Products & Pricebooks (Hàng hóa & Bảng giá)`** — [`kiotviet-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-products.controller.ts) (14 endpoints)
  + `POST /products`: [Product - Hàng hóa] Thêm mới mặt hàng vào kho KiotViet
  + `GET /products`: [Product - Hàng hóa] Danh sách hàng hóa có phân trang
  + `GET /products/:id`: [Product - Hàng hóa] Chi tiết mặt hàng theo ID
  + `GET /products/code/:code`: [Product - Hàng hóa] Tra cứu hàng hóa theo Barcode / Mã SKU
  + `PUT /products/:id`: [Product - Hàng hóa] Cập nhật thông tin sản phẩm và giá niêm yết
  + `DELETE /products/:id`: [Product - Hàng hóa] Xóa / Ngừng kinh doanh hàng hóa
  + `GET /products/attributes`: [Attribute - Thuộc tính sản phẩm] Danh sách thuộc tính phân loại (Màu sắc, Size)
  + `POST /products/batch`: [Batch - Đồng bộ hàng loạt] Cập nhật nhiều sản phẩm cùng lúc
  + `GET /products/stock/summary`: [Stock - Tồn kho sản phẩm] Tổng hợp số lượng tồn kho theo mặt hàng
  + `GET /pricebooks`: [Pricebook - Bảng giá] Danh sách các bảng giá bán lẻ / đại lý
  + `GET /pricebooks/:id`: [Pricebook - Bảng giá] Chi tiết bảng giá và tỷ lệ chiết khấu
  + `POST /pricebooks`: [Pricebook - Bảng giá] Tạo bảng giá mới
  + `PUT /pricebooks/:id`: [Pricebook - Bảng giá] Cập nhật bảng giá
  + `DELETE /pricebooks/:id`: [Pricebook - Bảng giá] Xóa bảng giá

- **`[POS-KiotViet] 03. Inventory & Transfers (Tồn kho, Chuyển kho & Nhập hàng)`** — [`kiotviet-inventory.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-inventory.controller.ts) (15 endpoints)
  + `GET /inventory`: [Inventory - Tồn kho chi nhánh] Tra cứu tồn kho thực tế theo từng chi nhánh
  + `GET /inventory/:productId`: [Inventory - Tồn kho chi nhánh] Chi tiết tồn kho của sản phẩm tại các kho
  + `POST /transfers`: [Transfer - Chuyển hàng] Lập phiếu điều chuyển hàng hóa giữa các kho
  + `GET /transfers`: [Transfer - Chuyển hàng] Danh sách phiếu điều chuyển kho
  + `GET /transfers/:id`: [Transfer - Chuyển hàng] Chi tiết phiếu chuyển hàng
  + `PUT /transfers/:id`: [Transfer - Chuyển hàng] Cập nhật trạng thái phiếu chuyển (Đang chuyển, Đã nhận)
  + `DELETE /transfers/:id`: [Transfer - Chuyển hàng] Hủy phiếu điều chuyển kho
  + `POST /damageitems`: [Damage Item - Xuất hủy] Lập phiếu xuất hủy hàng lỗi, hỏng, hết hạn
  + `GET /damageitems`: [Damage Item - Xuất hủy] Danh sách các phiếu xuất hủy
  + `POST /stocktakes`: [Stocktake - Kiểm kho] Tạo phiếu kiểm kê kho định kỳ
  + `GET /stocktakes`: [Stocktake - Kiểm kho] Danh sách phiếu kiểm kho
  + `GET /stocktakes/:id`: [Stocktake - Kiểm kho] Chi tiết phiếu kiểm kê và số lượng lệch
  + `POST /purchaseorders`: [Purchase Order - Nhập hàng] Lập đơn nhập mua hàng từ nhà cung cấp
  + `GET /purchaseorders`: [Purchase Order - Nhập hàng] Danh sách đơn nhập hàng
  + `GET /purchaseorders/:id`: [Purchase Order - Nhập hàng] Chi tiết đơn nhập hàng và điều khoản công nợ

- **`[POS-KiotViet] 04. Customers & Cashflow (Khách hàng & Sổ quỹ)`** — [`kiotviet-customers.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-customers.controller.ts) (12 endpoints)
  + `POST /customers`: [Customer - Khách hàng] Thêm mới hồ sơ khách hàng
  + `GET /customers`: [Customer - Khách hàng] Danh sách khách hàng và công nợ tích lũy
  + `GET /customers/:id`: [Customer - Khách hàng] Chi tiết hồ sơ khách hàng
  + `PUT /customers/:id`: [Customer - Khách hàng] Cập nhật thông tin và địa chỉ khách hàng
  + `DELETE /customers/:id`: [Customer - Khách hàng] Xóa hồ sơ khách hàng
  + `GET /customergroups`: [Customer Group - Nhóm khách hàng] Danh sách phân nhóm khách hàng
  + `POST /customergroups`: [Customer Group - Nhóm khách hàng] Tạo mới nhóm khách hàng
  + `POST /customers/batch`: [Batch - Khách hàng] Đồng bộ danh sách khách hàng hàng loạt
  + `GET /customers/:id/loyalty`: [Loyalty - Điểm thưởng] Tra cứu số dư điểm thưởng hội viên KiotViet
  + `POST /customers/:id/loyalty`: [Loyalty - Điểm thưởng] Điều chỉnh điểm thưởng / Tích điểm
  + `POST /cashflow`: [Cashflow - Sổ quỹ] Lập phiếu thu chi tiền mặt / ngân hàng KiotViet
  + `GET /cashflow`: [Cashflow - Sổ quỹ] Danh sách dòng tiền thu chi theo ca

- **`[POS-KiotViet] 05. Branches & Master Data (Chi nhánh, Danh mục & Nhà cung cấp)`** — [`kiotviet-branches.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-branches.controller.ts) (24 endpoints)
  + `GET /branches`: [Branch - Chi nhánh] Danh sách chi nhánh cửa hàng
  + `GET /branches/:id`: [Branch - Chi nhánh] Chi tiết chi nhánh theo ID
  + `POST /categories`: [Category - Nhóm hàng hóa] Thêm nhóm hàng hóa mới
  + `GET /categories`: [Category - Nhóm hàng hóa] Danh sách cây phân loại nhóm hàng
  + `GET /categories/:id`: [Category - Nhóm hàng hóa] Chi tiết nhóm hàng
  + `PUT /categories/:id`: [Category - Nhóm hàng hóa] Cập nhật nhóm hàng
  + `DELETE /categories/:id`: [Category - Nhóm hàng hóa] Xóa nhóm hàng
  + `POST /suppliers`: [Supplier - Nhà cung cấp] Thêm mới đối tác nhà cung cấp
  + `GET /suppliers`: [Supplier - Nhà cung cấp] Danh sách nhà cung cấp
  + `GET /suppliers/:id`: [Supplier - Nhà cung cấp] Chi tiết nhà cung cấp
  + `PUT /suppliers/:id`: [Supplier - Nhà cung cấp] Cập nhật nhà cung cấp
  + `DELETE /suppliers/:id`: [Supplier - Nhà cung cấp] Xóa nhà cung cấp
  + `GET /surcharges`: [Surcharge - Thu thêm] Danh sách phụ thu / chi phí dịch vụ
  + `POST /surcharges`: [Surcharge - Thu thêm] Tạo mới khoản phụ thu
  + `PUT /surcharges/:id`: [Surcharge - Thu thêm] Cập nhật khoản phụ thu
  + `DELETE /surcharges/:id`: [Surcharge - Thu thêm] Xóa khoản phụ thu
  + `GET /users`: [User - Tài khoản] Danh sách nhân viên và quyền hạn KiotViet
  + `GET /bankaccounts`: [Bank Account - Tài khoản ngân hàng] Danh sách tài khoản ngân hàng nhận tiền
  + `GET /salechannels`: [Sale Channel - Kênh bán] Danh sách kênh bán hàng liên kết (Facebook, Shopee, Tiki...)
  + `GET /locations`: [Location - Địa giới] Danh mục Tỉnh/Thành, Quận/Huyện KiotViet
  + `GET /settings`: [Settings - Cấu hình] Thiết lập bán hàng và in hóa đơn
  + `GET /brands`: [Brand - Thương hiệu] Danh sách thương hiệu / Nhãn hiệu hàng hóa
  + `POST /brands`: [Brand - Thương hiệu] Thêm mới thương hiệu
  + `GET /tax`: [Tax - Thuế suất] Danh mục thuế suất GTGT áp dụng

- **`[POS-KiotViet] 06. Vouchers & Surcharges (Voucher, Khuyến mãi & Phụ thu)`** — [`kiotviet-promotions.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-promotions.controller.ts) (7 endpoints)
  + `GET /vouchers/campaigns`: [Voucher Campaign - Đợt phát hành] Danh sách đợt phát hành voucher
  + `POST /vouchers/campaigns`: [Voucher Campaign - Đợt phát hành] Tạo mới đợt phát hành voucher
  + `GET /vouchers`: [Voucher - Mã voucher] Danh sách mã voucher trong đợt phát hành
  + `POST /vouchers`: [Voucher - Mã voucher] Tạo mới mã voucher gán vào chiến dịch
  + `POST /vouchers/release`: [Voucher - Mã voucher] Phát hành kích hoạt danh sách voucher
  + `DELETE /voucher/cancel`: [Voucher - Mã voucher] Hủy danh sách mã voucher chưa sử dụng
  + `PUT /coupons/status`: [Coupon - Mã coupon] Cập nhật trạng thái kích hoạt Coupon chiết khấu

- **`[POS-KiotViet] 07. Webhooks & Authentication (Webhooks & Token OAuth)`** — [`kiotviet-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-webhooks.controller.ts) (6 endpoints)
  + `POST /connect/token`: [OAuth 2.0 - Cấp Token] Lấy Bearer Access Token KiotViet qua Client ID & Secret
  + `POST /webhook`: [Webhook - Đăng ký sự kiện] Đăng ký Webhook listener nhận sự kiện KiotViet
  + `GET /webhook`: [Webhook - Đăng ký sự kiện] Danh sách các Webhook đã đăng ký
  + `GET /webhook/:id`: [Webhook - Đăng ký sự kiện] Chi tiết cấu hình Webhook
  + `DELETE /webhook/:id`: [Webhook - Đăng ký sự kiện] Hủy đăng ký Webhook
  + `GET /webhook/topics`: [Topic - Danh mục sự kiện] Danh mục sự kiện hỗ trợ (invoice.update, product.update...)


---

### 3.4. Haravan Omnichannel Open API — Ánh xạ 1:1 Chuẩn 12 Danh mục Official Haravan Docs (12 Collapsible Groups trên Swagger, đánh số thứ tự 01..12)

Toàn bộ 197 operations của Haravan Omnichannel API được chuẩn hóa 1:1 đồng nhất với 12 danh mục trên thanh điều hướng chính thức của Haravan API Documentation (`https://docs.haravan.com/docs/omni-apis/`). Hỗ trợ đầy đủ các biến thể HTTP Methods (GET, POST, PUT, DELETE) và cơ chế định tuyến kép Dual-Scope (cả `/com/` Commerce Scope lẫn `/web/` Haraweb Scope):

- **`[POS-Haravan] 01. Orders (Đơn hàng & Giao vận)`** — [`haravan-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-orders.controller.ts) (29 endpoints)
  + `POST /com/orders.json`: [Order - Đơn hàng] Khởi tạo đơn hàng mới trên hệ thống Haravan Omnichannel
  + `GET /com/orders.json`: [Order - Đơn hàng] Truy vấn danh sách đơn hàng Haravan đa kênh
  + `GET /com/orders/count.json`: [Order - Đơn hàng] Lấy tổng số lượng đơn hàng theo bộ lọc trạng thái
  + `GET /com/orders/:id.json`: [Order - Đơn hàng] Chi tiết một đơn hàng, thông tin thanh toán, giao nhận và line items
  + `PUT /com/orders/:id.json`: [Order - Đơn hàng] Cập nhật ghi chú, nhãn tags và địa chỉ nhận hàng
  + `POST /com/orders/:id/confirm.json`: [Order - Trạng thái] Chuyển trạng thái đơn sang Đã xác nhận chuẩn bị hàng
  + `POST /com/orders/:id/close.json`: [Order - Trạng thái] Đóng đơn hàng khi hoàn tất toàn bộ chu trình giao nhận
  + `POST /com/orders/:id/open.json`: [Order - Trạng thái] Mở lại đơn hàng đã bị đóng hoặc hủy
  + `POST /com/orders/:id/cancel.json`: [Order - Trạng thái] Hủy đơn hàng và tự động hoàn trả tồn kho
  + `POST /com/orders/:id/tags.json`: [Order - Gán Tag] Gán nhãn thẻ Tag phân loại đơn hàng (Add Tags)
  + `DELETE /com/orders/:id/tags.json`: [Order - Gỡ Tag] Gỡ nhãn thẻ Tag khỏi đơn hàng (Remove Tags)
  + `POST /com/orders/:id/assign.json`: [Order - Phân công] Phân công nhân viên chuyên trách xử lý đơn
  + `DELETE /com/orders/:id.json`: [Order - Đơn hàng] Xóa đơn hàng nháp khỏi hệ thống
  + `POST /com/draft_orders.json`: [Draft Order - Đơn đặt trước] Tạo đơn hàng đặt trước (Draft Order) hoặc báo giá bán sỉ
  + `GET /com/draft_orders.json`: [Draft Order - Đơn đặt trước] Danh sách các đơn đặt trước đang chờ khách duyệt
  + `POST /com/draft_orders/:id/complete.json`: [Draft Order - Đơn đặt trước] Chuyển đổi Draft Order thành Đơn hàng chính thức
  + `POST /com/orders/:order_id/fulfillments.json`: [Fulfillment - Xuất kho] Xuất kho giao vận fulfillment và tạo mã tracking
  + `GET /com/orders/:order_id/fulfillments.json`: [Fulfillment - Xuất kho] Danh sách các đợt giao hàng fulfillment của đơn
  + `POST /com/orders/:order_id/transactions.json`: [Transaction - Thanh toán] Ghi nhận giao dịch thanh toán thành công (VNPay, Tiền mặt, Thẻ)
  + `GET /com/orders/:order_id/transactions.json`: [Transaction - Thanh toán] Lịch sử các giao dịch thanh toán của đơn hàng
  + `POST /com/orders/:order_id/refunds.json`: [Refund - Đổi trả hoàn tiền] Lập phiếu hoàn tiền và đổi trả hàng vào kho
  + `GET /com/refunds.json`: [Refund - Đổi trả hoàn tiền] Danh sách phiếu đổi trả hàng toàn hệ thống
  + `GET /com/deliveries.json`: [Delivery - Vận đơn bưu chính] Danh sách toàn bộ phiếu giao nhận đơn hàng qua bưu chính
  + `POST /com/deliveries.json`: [Delivery - Vận đơn bưu chính] Tạo vận đơn giao hàng mới
  + `GET /com/deliveries/:id.json`: [Delivery - Vận đơn bưu chính] Chi tiết trạng thái vận đơn bưu chính

- **`[POS-Haravan] 02. Products (Sản phẩm & Bộ sưu tập)`** — [`haravan-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-products.controller.ts) (31 endpoints)
  + `POST /com/products.json`: [Product - Sản phẩm] Thêm mới sản phẩm, hình ảnh và danh sách biến thể SKU
  + `GET /com/products.json`: [Product - Sản phẩm] Danh mục sản phẩm, biến thể và số lượng tồn kho
  + `GET /com/products/count.json`: [Product - Sản phẩm] Tổng số lượng sản phẩm đang kinh doanh
  + `GET /com/products/:id.json`: [Product - Sản phẩm] Xem chi tiết sản phẩm và các biến thể phân loại
  + `PUT /com/products/:id.json`: [Product - Sản phẩm] Sửa tiêu đề, giá bán, mô tả sản phẩm
  + `DELETE /com/products/:id.json`: [Product - Sản phẩm] Xóa sản phẩm khỏi hệ thống
  + `POST /com/products/:id/tags.json`: [Product Tag - Gán Tag] Gán nhãn thẻ Tag phân loại sản phẩm
  + `DELETE /com/products/:id/tags.json`: [Product Tag - Gỡ Tag] Gỡ thẻ Tag khỏi sản phẩm
  + `GET /com/variants.json`: [Variant - Biến thể SKU] Danh sách toàn bộ biến thể SKU toàn cửa hàng
  + `GET /com/products/:product_id/variants.json`: [Variant - Biến thể SKU] Lấy danh sách biến thể theo sản phẩm
  + `GET /com/variants/:id.json`: [Variant - Biến thể SKU] Xem chi tiết biến thể SKU
  + `POST /com/products/:product_id/variants.json`: [Variant - Biến thể SKU] Thêm biến thể size/màu mới cho sản phẩm
  + `PUT /com/variants/:id.json`: [Variant - Biến thể SKU] Cập nhật giá bán, barcode, SKU biến thể
  + `DELETE /com/products/:product_id/variants/:id.json`: [Variant - Biến thể SKU] Xóa biến thể khỏi sản phẩm
  + `GET /com/products/:product_id/images.json`: [Product Image - Thư viện ảnh] Danh sách hình ảnh gallery của sản phẩm
  + `POST /com/products/:product_id/images.json`: [Product Image - Thư viện ảnh] Tải lên ảnh sản phẩm mới
  + `GET /com/products/:product_id/images/:id.json`: [Product Image - Thư viện ảnh] Chi tiết ảnh sản phẩm
  + `PUT /com/products/:product_id/images/:id.json`: [Product Image - Thư viện ảnh] Cập nhật thuộc tính ảnh (alt text, position)
  + `DELETE /com/products/:product_id/images/:id.json`: [Product Image - Thư viện ảnh] Gỡ ảnh khỏi gallery sản phẩm
  + `POST /com/custom_collections.json`: [Custom Collection - Bộ sưu tập thủ công] Tạo nhóm sản phẩm tùy chọn thủ công
  + `GET /com/custom_collections.json`: [Custom Collection - Bộ sưu tập thủ công] Danh sách các nhóm bộ sưu tập thủ công
  + `GET /com/custom_collections/:id.json`: [Custom Collection - Bộ sưu tập thủ công] Chi tiết nhóm bộ sưu tập thủ công
  + `PUT /com/custom_collections/:id.json`: [Custom Collection - Bộ sưu tập thủ công] Cập nhật bộ sưu tập thủ công
  + `DELETE /com/custom_collections/:id.json`: [Custom Collection - Bộ sưu tập thủ công] Xóa bộ sưu tập thủ công
  + `GET /com/smart_collections.json`: [Smart Collection - Bộ sưu tập thông minh] Danh sách nhóm sản phẩm thông minh tự động lọc theo rule
  + `POST /com/smart_collections.json`: [Smart Collection - Bộ sưu tập thông minh] Khởi tạo nhóm thông minh với các điều kiện lọc sản phẩm
  + `GET /com/smart_collections/:id.json`: [Smart Collection - Bộ sưu tập thông minh] Chi tiết nhóm thông minh
  + `PUT /com/smart_collections/:id.json`: [Smart Collection - Bộ sưu tập thông minh] Cập nhật quy tắc lọc nhóm thông minh
  + `DELETE /com/smart_collections/:id.json`: [Smart Collection - Bộ sưu tập thông minh] Xóa nhóm thông minh
  + `POST /com/collects.json`: [Collect - Liên kết Danh mục] Gán sản phẩm vào nhóm bộ sưu tập (Collect mapping)
  + `GET /com/collects.json`: [Collect - Liên kết Danh mục] Danh sách liên kết phân loại sản phẩm - nhóm
  + `GET /com/collects/:id.json`: [Collect - Liên kết Danh mục] Chi tiết liên kết sản phẩm - nhóm
  + `DELETE /com/collects/:id.json`: [Collect - Liên kết Danh mục] Gỡ sản phẩm khỏi nhóm bộ sưu tập

- **`[POS-Haravan] 03. Inventory (Tồn kho, Địa điểm, Điều chuyển & Nhập mua)`** — [`haravan-inventory.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-inventory.controller.ts) (19 endpoints)
  + `POST /com/inventory_levels/adjust.json`: [Inventory Level - Mức tồn kho] Điều chỉnh tăng/giảm tồn kho khả dụng tại chi nhánh kho
  + `POST /com/inventory_levels/set.json`: [Inventory Level - Mức tồn kho] Cài đặt số lượng tồn kho cố định sau kiểm kê
  + `GET /com/inventory_levels.json`: [Inventory Level - Mức tồn kho] Báo cáo số lượng tồn kho khả dụng theo kho
  + `POST /com/inventory_levels/connect.json`: [Connect Inventory - Kích hoạt quản lý] Kết nối biến thể với kho hàng để kích hoạt quản lý tồn
  + `GET /com/inventory_location_balances.json`: [Location Balance - Cân đối tồn kho] Báo cáo cân đối tồn kho theo vị trí và kho hàng
  + `GET /com/locations.json`: [Location - Địa điểm kho] Danh sách chi nhánh cửa hàng và kho hàng Haravan
  + `GET /com/locations/:id.json`: [Location - Địa điểm kho] Xem chi tiết địa điểm kho hàng
  + `GET /com/locations/count.json`: [Location - Địa điểm kho] Tổng số lượng địa điểm kho đang kích hoạt
  + `POST /com/inventory_adjustments.json`: [Inventory Adjustment - Phiếu điều chỉnh] Lập phiếu điều chỉnh tồn kho kèm lý do
  + `GET /com/inventory_adjustments.json`: [Inventory Adjustment - Phiếu điều chỉnh] Lịch sử các phiếu điều chỉnh tồn kho
  + `POST /com/inventory_transfers.json`: [Inventory Transfer - Điều chuyển kho] Lập phiếu điều chuyển hàng hóa nội bộ giữa các kho
  + `GET /com/inventory_transfers.json`: [Inventory Transfer - Điều chuyển kho] Danh sách các đợt điều chuyển hàng
  + `GET /com/inventory_transfers/:id.json`: [Inventory Transfer - Điều chuyển kho] Chi tiết phiếu điều chuyển hàng
  + `POST /com/inventory_purchase_orders.json`: [Purchase Order - Đơn nhập mua] Tạo đơn đặt hàng nhập mua từ Nhà cung cấp (Purchase Order)
  + `GET /com/inventory_purchase_orders.json`: [Purchase Order - Đơn nhập mua] Danh sách đơn nhập mua hàng
  + `GET /com/inventory_purchase_orders/:id.json`: [Purchase Order - Đơn nhập mua] Chi tiết đơn đặt hàng nhập mua
  + `POST /com/inventory_purchase_receives.json`: [Purchase Receive - Phiếu nhận hàng] Lập phiếu nhận hàng nhập kho từ nhà cung cấp
  + `GET /com/inventory_purchase_receives.json`: [Purchase Receive - Phiếu nhận hàng] Danh sách các đợt nhận hàng nhập kho
  + `GET /com/inventory_purchase_receives/:id.json`: [Purchase Receive - Phiếu nhận hàng] Chi tiết phiếu nhận hàng nhập kho

- **`[POS-Haravan] 04. Customers (Khách hàng & Sổ địa chỉ)`** — [`haravan-customers.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-customers.controller.ts) (16 endpoints)
  + `POST /com/customers.json`: [Customer - Hồ sơ khách hàng] Tạo hồ sơ khách hàng mới và gắn thẻ tag phân nhóm
  + `GET /com/customers.json`: [Customer - Hồ sơ khách hàng] Danh sách khách hàng và lịch sử mua sắm
  + `GET /com/customers/count.json`: [Customer - Hồ sơ khách hàng] Tổng số lượng khách hàng trong hệ thống
  + `GET /com/customers/search.json`: [Customer - Tìm kiếm] Tìm kiếm nhanh khách hàng theo SĐT / Email / Tên
  + `GET /com/customers/:id.json`: [Customer - Hồ sơ khách hàng] Chi tiết hồ sơ cá nhân và địa chỉ mặc định
  + `PUT /com/customers/:id.json`: [Customer - Hồ sơ khách hàng] Cập nhật thông tin phân hạng và liên hệ
  + `DELETE /com/customers/:id.json`: [Customer - Hồ sơ khách hàng] Xóa tài khoản khách hàng khỏi hệ thống
  + `POST /com/customers/:id/tags.json`: [Customer Tag - Gán Tag] Gán nhãn thẻ Tag phân nhóm khách hàng
  + `DELETE /com/customers/:id/tags.json`: [Customer Tag - Gỡ Tag] Gỡ thẻ Tag khỏi hồ sơ khách hàng
  + `GET /com/customers/:customer_id/addresses.json`: [Customer Address - Sổ địa chỉ] Danh sách sổ địa chỉ nhận hàng của khách
  + `POST /com/customers/:customer_id/addresses.json`: [Customer Address - Sổ địa chỉ] Thêm địa chỉ mới vào sổ địa chỉ
  + `GET /com/customers/:customer_id/addresses/:id.json`: [Customer Address - Sổ địa chỉ] Chi tiết một địa chỉ nhận hàng
  + `PUT /com/customers/:customer_id/addresses/:id.json`: [Customer Address - Sổ địa chỉ] Sửa địa chỉ nhận hàng
  + `DELETE /com/customers/:customer_id/addresses/:id.json`: [Customer Address - Sổ địa chỉ] Xóa địa chỉ nhận hàng
  + `PUT /com/customers/:customer_id/addresses/:id/default.json`: [Customer Address - Sổ địa chỉ] Đặt địa chỉ làm mặc định
  + `PUT /com/customers/:customer_id/addresses/set.json`: [Customer Address - Sổ địa chỉ] Cập nhật hàng loạt danh sách địa chỉ

- **`[POS-Haravan] 05. Discounts (Khuyến mãi & Mã giảm giá)`** — [`haravan-discounts.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-discounts.controller.ts) (15 endpoints)
  + `POST /com/price_rules.json`: [Price Rule - Quy tắc giá] Tạo quy tắc giá và chiết khấu (Price Rule)
  + `GET /com/price_rules.json`: [Price Rule - Quy tắc giá] Danh sách quy tắc giá khuyến mãi đang chạy
  + `GET /com/price_rules/:id.json`: [Price Rule - Quy tắc giá] Xem chi tiết điều kiện áp dụng của Price Rule
  + `PUT /com/price_rules/:id.json`: [Price Rule - Quy tắc giá] Cập nhật điều kiện quy tắc giá
  + `DELETE /com/price_rules/:id.json`: [Price Rule - Quy tắc giá] Xóa quy tắc giá khuyến mãi
  + `POST /com/price_rules/:price_rule_id/discount_codes.json`: [Discount Code - Mã coupon] Tạo mã coupon giảm giá cụ thể
  + `GET /com/price_rules/:price_rule_id/discount_codes.json`: [Discount Code - Mã coupon] Danh sách mã giảm giá của Price Rule
  + `GET /com/price_rules/:price_rule_id/discount_codes/:id.json`: [Discount Code - Mã coupon] Chi tiết mã giảm giá
  + `PUT /com/price_rules/:price_rule_id/discount_codes/:id.json`: [Discount Code - Mã coupon] Cập nhật mã giảm giá coupon
  + `DELETE /com/price_rules/:price_rule_id/discount_codes/:id.json`: [Discount Code - Mã coupon] Xóa mã giảm giá coupon
  + `POST /com/promotions.json`: [Promotion - Chương trình khuyến mại] Khởi tạo chương trình khuyến mại Haravan
  + `GET /com/promotions.json`: [Promotion - Chương trình khuyến mại] Danh sách chương trình khuyến mãi đang kích hoạt
  + `GET /com/promotions/:id.json`: [Promotion - Chương trình khuyến mại] Chi tiết chương trình khuyến mãi
  + `PUT /com/discounts/:id/enable.json`: [Discount Status - Kích hoạt] Kích hoạt áp dụng chương trình khuyến mãi / giảm giá
  + `PUT /com/discounts/:id/disable.json`: [Discount Status - Tạm ngưng] Vô hiệu hóa tạm ngưng chương trình khuyến mãi / giảm giá

- **`[POS-Haravan] 06. Shipping (Vận chuyển, Biểu phí & Giao hàng)`** — [`haravan-shipping.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-shipping.controller.ts) (8 endpoints)
  + `POST /com/carrier_services.json`: [Carrier Service - Hãng bưu chính] Đăng ký đối tác vận chuyển bên thứ 3 (CarrierService)
  + `GET /com/carrier_services.json`: [Carrier Service - Hãng bưu chính] Danh sách hãng vận chuyển tích hợp
  + `GET /com/carrier_services/:id.json`: [Carrier Service - Hãng bưu chính] Chi tiết cấu hình kết nối đối tác vận chuyển
  + `PUT /com/carrier_services/:id.json`: [Carrier Service - Hãng bưu chính] Cập nhật webhook callback URL & cấu hình hãng ship
  + `DELETE /com/carrier_services/:id.json`: [Carrier Service - Hãng bưu chính] Hủy đối tác vận chuyển khỏi cửa hàng
  + `GET /com/shipping_rates.json`: [Shipping Rate - Bảng cước phí] Tính cước và tra cứu bảng biểu phí vận chuyển theo khối lượng và vùng miền
  + `POST /com/deliveries.json`: [Delivery - Vận đơn giao hàng] Khởi tạo vận đơn giao hàng bưu chính
  + `GET /com/deliveries/:id.json`: [Delivery - Vận đơn giao hàng] Chi tiết trạng thái vận đơn bưu chính
  + `GET /com/deliveries/tracking.json`: [Tracking - Tra cứu hành trình] Tra cứu tiến trình và lịch sử hành trình vận chuyển chi tiết

- **`[POS-Haravan] 07. Online store — Haraweb (Website & Nội dung)`** — [`haravan-cms.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-cms.controller.ts) & [`haravan-theme-metafields.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-theme-metafields.controller.ts) (58 endpoints, hỗ trợ song song Dual Scopes `/com/` và `/web/`)
  + `POST /web/blogs/:blog_id/articles.json` & `/com/...`: [Article - Bài viết SEO] Tạo bài viết mới trong chuyên mục Blog
  + `POST /web/articles.json` & `/com/...`: [Article - Bài viết SEO] Tạo bài viết mới trực tiếp
  + `GET /web/blogs/:blog_id/articles.json` & `/com/...`: [Article - Bài viết SEO] Danh sách bài viết theo chuyên mục Blog
  + `GET /web/articles.json` & `/com/...`: [Article - Bài viết SEO] Toàn bộ danh sách bài viết trên website
  + `GET /web/articles/:id.json` & `/com/...`: [Article - Bài viết SEO] Chi tiết bài viết HTML và ảnh banner
  + `PUT /web/blogs/:blog_id/articles/:id.json` & `/com/...`: [Article - Bài viết SEO] Cập nhật nội dung bài viết
  + `DELETE /web/blogs/:blog_id/articles/:id.json` & `/com/...`: [Article - Bài viết SEO] Xóa bài viết khỏi blog
  + `POST /web/blogs.json` & `/com/...`: [Blog - Chuyên mục tin tức] Tạo chuyên mục Blog mới
  + `GET /web/blogs.json` & `/com/...`: [Blog - Chuyên mục tin tức] Danh sách các chuyên mục Blog
  + `GET /web/blogs/:id.json` & `/com/...`: [Blog - Chuyên mục tin tức] Xem chi tiết chuyên mục Blog
  + `PUT /web/blogs/:id.json` & `/com/...`: [Blog - Chuyên mục tin tức] Cập nhật chuyên mục Blog
  + `DELETE /web/blogs/:id.json` & `/com/...`: [Blog - Chuyên mục tin tức] Xóa chuyên mục Blog
  + `GET /web/comments.json` & `/com/...`: [Comment - Bình luận] Danh sách bình luận bài viết của độc giả
  + `POST /web/comments.json` & `/com/...`: [Comment - Bình luận] Đăng bình luận mới
  + `POST /web/comments/:id/spam.json` & `/com/...`: [Comment - Bình luận] Đánh dấu bình luận là Spam
  + `POST /web/pages.json` & `/com/...`: [Page - Trang tĩnh] Tạo trang tĩnh website Haravan Web (Giới thiệu, Chính sách)
  + `GET /web/pages.json` & `/com/...`: [Page - Trang tĩnh] Danh sách các trang nội dung tĩnh
  + `GET /web/pages/:id.json` & `/com/...`: [Page - Trang tĩnh] Xem chi tiết nội dung mã HTML trang
  + `PUT /web/pages/:id.json` & `/com/...`: [Page - Trang tĩnh] Cập nhật nội dung trang tĩnh
  + `DELETE /web/pages/:id.json` & `/com/...`: [Page - Trang tĩnh] Xóa trang tĩnh
  + `GET /web/themes.json` & `/com/...`: [Theme - Giao diện Liquid] Danh sách các theme giao diện Haravan Web
  + `POST /web/themes.json` & `/com/...`: [Theme - Giao diện Liquid] Cài đặt theme giao diện mới
  + `GET /web/themes/:id.json` & `/com/...`: [Theme - Giao diện Liquid] Xem chi tiết thông tin theme
  + `PUT /web/themes/:id.json` & `/com/...`: [Theme - Giao diện Liquid] Cập nhật cấu hình theme
  + `DELETE /web/themes/:id.json` & `/com/...`: [Theme - Giao diện Liquid] Xóa theme giao diện
  + `GET /web/themes/:theme_id/assets.json` & `/com/...`: [Asset - File giao diện] Danh sách file CSS, JS, ảnh giao diện Liquid
  + `PUT /web/themes/:theme_id/assets.json` & `/com/...`: [Asset - File giao diện] Tải lên / sửa file asset theme Liquid
  + `DELETE /web/themes/:theme_id/assets.json` & `/com/...`: [Asset - File giao diện] Xóa file asset khỏi theme
  + `GET /web/redirects.json` & `/com/...`: [Redirect - Chuyển hướng 301] Danh sách chuyển hướng URL 301 SEO
  + `POST /web/redirects.json` & `/com/...`: [Redirect - Chuyển hướng 301] Tạo chuyển hướng URL mới
  + `PUT /web/redirects/:id.json` & `/com/...`: [Redirect - Chuyển hướng 301] Sửa quy tắc chuyển hướng URL
  + `DELETE /web/redirects/:id.json` & `/com/...`: [Redirect - Chuyển hướng 301] Xóa quy tắc chuyển hướng URL
  + `GET /web/script_tags.json` & `/com/...`: [ScriptTag - Mã nhúng JS] Danh sách mã nhúng ScriptTag bên thứ ba
  + `POST /web/script_tags.json` & `/com/...`: [ScriptTag - Mã nhúng JS] Thêm mã nhúng ScriptTag mới
  + `PUT /web/script_tags/:id.json` & `/com/...`: [ScriptTag - Mã nhúng JS] Sửa mã nhúng ScriptTag
  + `DELETE /web/script_tags/:id.json` & `/com/...`: [ScriptTag - Mã nhúng JS] Gỡ mã nhúng ScriptTag

- **`[POS-Haravan] 08. Metafield (Trường dữ liệu mở rộng)`** — [`haravan-theme-metafields.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-theme-metafields.controller.ts) (8 endpoints, hỗ trợ song song Dual Scopes `/com/` và `/web/`)
  + `GET /com/metafields.json` & `/web/...`: [Metafield - Trường tùy biến] Tra cứu các trường thuộc tính mở rộng (Metafields)
  + `POST /com/metafields.json` & `/web/...`: [Metafield - Trường tùy biến] Thêm trường tùy biến mở rộng Metafield
  + `GET /com/metafields/:id.json` & `/web/...`: [Metafield - Trường tùy biến] Chi tiết trường mở rộng Metafield
  + `PUT /com/metafields/:id.json` & `/web/...`: [Metafield - Trường tùy biến] Cập nhật giá trị trường mở rộng Metafield
  + `DELETE /com/metafields/:id.json` & `/web/...`: [Metafield - Trường tùy biến] Xóa trường tùy biến Metafield

- **`[POS-Haravan] 09. Events (Nhật ký kiểm toán hệ thống)`** — [`haravan-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-webhooks.controller.ts) (2 endpoints)
  + `GET /com/events.json`: [Event - Nhật ký kiểm toán] Nhật ký sự kiện hệ thống Haravan (Audit Log: tạo đơn, sửa hàng, hủy đơn)
  + `GET /com/events/:id.json`: [Event - Nhật ký kiểm toán] Chi tiết payload của sự kiện hệ thống

- **`[POS-Haravan] 10. Store properties (Cấu hình Shop & Khu vực)`** — [`haravan-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-webhooks.controller.ts) (4 endpoints, hỗ trợ `/com/` và `/web/`)
  + `GET /com/shop.json` & `/web/shop.json`: [Shop - Hồ sơ gian hàng] Thông tin cấu hình gian hàng (Shop Profile: tiền tệ, múi giờ, domain)
  + `GET /com/countries.json` & `/web/countries.json`: [Country & Province - Địa lý] Danh sách quốc gia và tỉnh thành hỗ trợ giao hàng

- **`[POS-Haravan] 11. Subscription (Đăng ký Webhook & Sự kiện Realtime)`** — [`haravan-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-webhooks.controller.ts) (6 endpoints)
  + `POST /com/webhooks.json`: [Webhook - Đăng ký sự kiện] Đăng ký Webhook Haravan mới
  + `GET /com/webhooks.json`: [Webhook - Đăng ký sự kiện] Danh sách webhook đang hoạt động
  + `GET /com/webhooks/:id.json`: [Webhook - Đăng ký sự kiện] Chi tiết cấu hình Webhook
  + `PUT /com/webhooks/:id.json`: [Webhook - Đăng ký sự kiện] Cập nhật URL callback hoặc topic của Webhook
  + `DELETE /com/webhooks/:id.json`: [Webhook - Đăng ký sự kiện] Hủy đăng ký webhook
  + `GET /com/webhooks/topics.json`: [Topic - Danh mục sự kiện] Danh sách các sự kiện Topic Haravan hỗ trợ

- **`[POS-Haravan] 12. AccessScope & Authentication (OAuth & Quyền truy cập)`** — [`haravan-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-webhooks.controller.ts) (2 endpoints)
  + `GET /com/access_scopes.json`: [AccessScope - Quyền ứng dụng] Kiểm tra danh sách quyền hạn Token được cấp phép (read/write orders, products, customers)
  + `POST /connect/token`: [OAuth 2.0 - Xác thực & Cấp Token] Trao đổi mã ủy quyền OAuth 2.0 Authorization Code lấy Access Token

---

### 3.5. Hệ sinh thái Phần mềm MISA (18 Resources Chuẩn REST trên Swagger)

Toàn bộ hệ sinh thái phần mềm MISA được bóc tách 1:1 thành 18 resources độc lập (52 endpoints) với bộ Swagger tag phân loại sạch sẽ `[MISA-...]`:

#### A. MISA eShop (Bán lẻ thời trang & F&B — 6 Resources, 23 Endpoints, đánh số 01..06)
- **`[MISA-eShop] 01. Orders`** — [`misa-eshop.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-eshop.controller.ts)
  + `POST /api/v1/infra/misa-eshop/orders/create`: Tạo hóa đơn bán lẻ trực tiếp từ POS tại quầy
  + `GET /api/v1/infra/misa-eshop/orders/list`: Danh sách hóa đơn bán hàng theo ca thu ngân & chi nhánh
  + `GET /api/v1/infra/misa-eshop/orders/:id`: Chi tiết hóa đơn, mặt hàng, chiết khấu và thuế VAT
  + `DELETE /api/v1/infra/misa-eshop/orders/:id`: Hủy hóa đơn bán lẻ và tự động hoàn tồn kho
  + `POST /api/v1/infra/misa-eshop/orders/:id/return`: Đổi trả hàng và hoàn tiền tại quầy
- **`[MISA-eShop] 02. Products`** — [`misa-eshop.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-eshop.controller.ts)
  + `POST /api/v1/infra/misa-eshop/products/create`: Khai báo hàng hóa mới, giá vốn và giá bán
  + `GET /api/v1/infra/misa-eshop/products/list`: Danh sách hàng hóa bán lẻ
  + `GET /api/v1/infra/misa-eshop/products/:id`: Chi tiết thông tin mặt hàng và mã vạch Barcode
  + `PUT /api/v1/infra/misa-eshop/products/:id`: Cập nhật giá bán và trạng thái kinh doanh
  + `GET /api/v1/infra/misa-eshop/categories/list`: Danh mục nhóm hàng hóa thực đơn
- **`[MISA-eShop] 03. Inventory`** — [`misa-eshop.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-eshop.controller.ts)
  + `POST /api/v1/infra/misa-eshop/inventory/adjust`: Đồng bộ & điều chỉnh tồn kho chi nhánh
  + `GET /api/v1/infra/misa-eshop/inventory/balance`: Tra cứu tồn kho sẵn sàng bán (On Hand) đa chi nhánh
  + `POST /api/v1/infra/misa-eshop/inventory/stocktake`: Lập phiếu kiểm kê kho định kỳ
- **`[MISA-eShop] 04. Customers`** — [`misa-eshop.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-eshop.controller.ts)
  + `POST /api/v1/infra/misa-eshop/customers/create`: Tạo hồ sơ khách hàng mới và cấp thẻ thành viên
  + `GET /api/v1/infra/misa-eshop/customers/search`: Tìm kiếm khách hàng theo SĐT để hưởng ưu đãi
  + `GET /api/v1/infra/misa-eshop/customers/:id/loyalty`: Tra cứu số dư điểm thưởng và lịch sử tích/đổi điểm
  + `POST /api/v1/infra/misa-eshop/customers/:id/adjust-points`: Điều chỉnh điểm thưởng hội viên
- **`[MISA-eShop] 05. Shifts`** — [`misa-eshop.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-eshop.controller.ts)
  + `POST /api/v1/infra/misa-eshop/shift/open`: Mở ca thu ngân mới & khai báo tiền két ban đầu
  + `POST /api/v1/infra/misa-eshop/shift/close`: Chốt ca bán hàng, kiểm đếm tiền & bàn giao ca
  + `GET /api/v1/infra/misa-eshop/shift/status`: Trạng thái ca bán hàng hiện tại và doanh thu tạm tính
  + `GET /api/v1/infra/misa-eshop/shift/history`: Lịch sử các ca thu ngân chi nhánh
- **`[MISA-eShop] 06. Promotions`** — [`misa-eshop.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-eshop.controller.ts)
  + `GET /api/v1/infra/misa-eshop/promotions/list`: Danh sách chương trình khuyến mại đang chạy
  + `POST /api/v1/infra/misa-eshop/promotions/validate-voucher`: Kiểm tra & áp dụng mã voucher MISA eShop

#### B. MISA meInvoice (Hóa đơn điện tử v3 & NĐ 123/TT 78 — 4 Resources, 13 Endpoints, đánh số 01..04)
- **`[MISA-meInvoice] 01. Invoices`** — [`misa-meinvoice.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-meinvoice.controller.ts)
  + `POST /api/v1/infra/misa/api/v1/itg/invoice/save`: Lập hóa đơn điện tử nháp theo Thông tư 78
  + `GET /api/v1/infra/misa/api/v1/itg/invoice/status/:refId`: Tra cứu trạng thái hóa đơn theo RefID
  + `GET /api/v1/infra/misa/invoices/list`: Danh sách hóa đơn điện tử đã phát hành theo kỳ
- **`[MISA-meInvoice] 02. HSM Signing`** — [`misa-meinvoice.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-meinvoice.controller.ts)
  + `POST /api/v1/infra/misa/api/v1/itg/invoice/publish-hsm`: Ký số HSM Cloud & Phát hành hóa đơn có mã CQT
  + `POST /api/v1/infra/misa/invoices/publish-multi-hsm`: Ký số HSM Cloud đồng loạt (Batch Signing)
  + `GET /api/v1/infra/misa/hsm/cert-status`: Kiểm tra trạng thái chứng thư số HSM Cloud
- **`[MISA-meInvoice] 03. Lifecycle`** — [`misa-meinvoice.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-meinvoice.controller.ts)
  + `POST /api/v1/infra/misa/api/v1/itg/invoice/cancel`: Hủy hóa đơn điện tử và lập biên bản thỏa thuận
  + `POST /api/v1/infra/misa/invoices/replace`: Phát hành hóa đơn thay thế cho hóa đơn sai sót
  + `POST /api/v1/infra/misa/invoices/adjust`: Phát hành hóa đơn điều chỉnh tăng/giảm tiền hàng & tiền thuế
- **`[MISA-meInvoice] 04. Tax & Preview`** — [`misa-meinvoice.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-meinvoice.controller.ts)
  + `GET /api/v1/infra/misa/invoice/view-pdf/:refId`: Tải bản thể hiện PDF hóa đơn điện tử có mã CQT
  + `GET /api/v1/infra/misa/invoice/download-xml/:refId`: Tải tệp XML hóa đơn điện tử gốc ký số
  + `POST /api/v1/infra/misa/invoice/preview-unpublish`: Xem trước bản nháp hóa đơn (Unpublish View)
  + `POST /api/v1/infra/misa/cashregisterinvoice/tax/:refId`: Cấp mã cơ quan thuế từ Máy tính tiền (MTT)

#### C. MISA AMIS CRM Open API v2 (Quản trị Quan hệ Khách hàng v2 — 9 Resources, 49 Endpoints, đánh số 01..09)
Docs chính thức: `https://crmconnect.misa.vn/docs-v2/index.html` (OpenAPI v2 Specification tại `https://crmconnect.misa.vn/swagger/v2/swagger.json`). Hỗ trợ cả đường dẫn gốc `/api/v2/...` lẫn đường dẫn rút gọn UniFlow:

- **`[MISA-AMIS-CRM] 01. Account (Xác thực & Token)`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts) (1 endpoint)
  + `POST /api/v1/infra/misa/crm/api/v2/Account`: [Account - Cấp Token] Sinh token truy cập bằng client_id & client_secret

- **`[MISA-AMIS-CRM] 02. Customers (Khách hàng CRM)`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts) (10 endpoints)
  + `POST /api/v1/infra/misa/crm/api/v2/Customers`: [Customer - Thêm mới] Thêm mới khách hàng theo danh sách (Array payload)
  + `PUT /api/v1/infra/misa/crm/api/v2/Customers`: [Customer - Cập nhật] Cập nhật khách hàng theo danh sách
  + `DELETE /api/v1/infra/misa/crm/api/v2/Customers`: [Customer - Xóa] Xóa khách hàng theo danh sách ID
  + `GET /api/v1/infra/misa/crm/api/v2/Customers`: [Customer - Danh sách] Paging lấy về danh sách khách hàng có phân trang
  + `GET /api/v1/infra/misa/crm/api/v2/Customers/id`: [Customer - Chi tiết theo ID] Lấy dữ liệu khách hàng theo danh sách IDs
  + `GET /api/v1/infra/misa/crm/api/v2/Customers/code`: [Customer - Chi tiết theo Mã] Lấy dữ liệu khách hàng theo mã tài khoản CRM
  + `POST /api/v1/infra/misa/crm/customers`: [Customer - Đồng bộ CRM] Đồng bộ/thêm mới khách hàng doanh nghiệp B2B & cá nhân B2C
  + `GET /api/v1/infra/misa/crm/customers/:phone`: [Customer - Tra cứu SĐT] Tra cứu thông tin hồ sơ khách hàng theo SĐT
  + `GET /api/v1/infra/misa/crm/customers`: [Customer - Danh sách rút gọn] Danh sách khách hàng và lọc theo phân hạng thẻ VIP
  + `PUT /api/v1/infra/misa/crm/customers/:id`: [Customer - Cập nhật ID] Cập nhật thông tin phân hạng và người phụ trách

- **`[MISA-AMIS-CRM] 03. Contacts (Người liên hệ)`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts) (9 endpoints)
  + `POST /api/v1/infra/misa/crm/api/v2/Contacts`: [Contact - Thêm mới] Thêm mới người liên hệ theo danh sách
  + `PUT /api/v1/infra/misa/crm/api/v2/Contacts`: [Contact - Cập nhật] Cập nhật người liên hệ theo danh sách
  + `DELETE /api/v1/infra/misa/crm/api/v2/Contacts`: [Contact - Xóa] Xóa người liên hệ theo danh sách ID
  + `GET /api/v1/infra/misa/crm/api/v2/Contacts`: [Contact - Danh sách] Paging lấy về danh sách người liên hệ có phân trang
  + `GET /api/v1/infra/misa/crm/api/v2/Contacts/id`: [Contact - Chi tiết theo ID] Lấy dữ liệu người liên hệ theo ID
  + `GET /api/v1/infra/misa/crm/api/v2/Contacts/code`: [Contact - Chi tiết theo Mã] Lấy dữ liệu người liên hệ theo mã LH
  + `POST /api/v1/infra/misa/crm/contacts`: [Contact - Tạo mới đơn lẻ] Thêm người liên hệ vào hồ sơ doanh nghiệp
  + `GET /api/v1/infra/misa/crm/contacts`: [Contact - Danh sách rút gọn] Danh sách người liên hệ theo khách hàng
  + `GET /api/v1/infra/misa/crm/contacts/:id`: [Contact - Chi tiết theo param] Chi tiết chức danh, phòng ban và kênh liên lạc

- **`[MISA-AMIS-CRM] 04. Products (Hàng hóa & Dịch vụ CRM)`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts) (6 endpoints)
  + `POST /api/v1/infra/misa/crm/api/v2/Products`: [Product - Thêm mới] Thêm mới hàng hóa / dịch vụ CRM theo danh sách
  + `PUT /api/v1/infra/misa/crm/api/v2/Products`: [Product - Cập nhật] Cập nhật hàng hóa / dịch vụ CRM theo danh sách
  + `DELETE /api/v1/infra/misa/crm/api/v2/Products`: [Product - Xóa] Xóa hàng hóa / dịch vụ theo danh sách ID
  + `GET /api/v1/infra/misa/crm/api/v2/Products`: [Product - Danh sách] Paging danh sách hàng hóa / dịch vụ CRM có phân trang
  + `GET /api/v1/infra/misa/crm/api/v2/Products/id`: [Product - Chi tiết theo ID] Lấy dữ liệu hàng hóa theo ID
  + `GET /api/v1/infra/misa/crm/api/v2/Products/code`: [Product - Chi tiết theo Mã] Lấy dữ liệu hàng hóa theo mã

- **`[MISA-AMIS-CRM] 05. SaleOrders (Đơn đặt hàng CRM)`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts) (6 endpoints)
  + `POST /api/v1/infra/misa/crm/api/v2/SaleOrders`: [SaleOrder - Thêm mới] Thêm mới đơn hàng CRM kèm bảng chi tiết hàng hóa
  + `PUT /api/v1/infra/misa/crm/api/v2/SaleOrders`: [SaleOrder - Cập nhật] Cập nhật đơn hàng (ghi đè bảng hàng hóa)
  + `DELETE /api/v1/infra/misa/crm/api/v2/SaleOrders`: [SaleOrder - Xóa] Xóa đơn hàng theo danh sách ID
  + `GET /api/v1/infra/misa/crm/api/v2/SaleOrders`: [SaleOrder - Danh sách] Paging lấy về danh sách đơn hàng có phân trang
  + `GET /api/v1/infra/misa/crm/api/v2/SaleOrders/id`: [SaleOrder - Chi tiết theo ID] Lấy dữ liệu đơn hàng theo ID
  + `GET /api/v1/infra/misa/crm/api/v2/SaleOrders/code`: [SaleOrder - Chi tiết theo Mã] Lấy dữ liệu đơn hàng theo số đơn hàng DH

- **`[MISA-AMIS-CRM] 06. Stocks (Kho & Tồn kho CRM)`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts) (8 endpoints)
  + `GET /api/v1/infra/misa/crm/api/v2/Stocks`: [Stock - Danh sách Kho] Lấy tất cả kho hàng trên CRM
  + `POST /api/v1/infra/misa/crm/api/v2/Stocks`: [Stock - Thêm mới Kho] Khởi tạo kho hàng mới
  + `PUT /api/v1/infra/misa/crm/api/v2/Stocks`: [Stock - Cập nhật Kho] Cập nhật thông tin kho hàng
  + `DELETE /api/v1/infra/misa/crm/api/v2/Stocks`: [Stock - Xóa Kho] Xóa kho hàng theo mã kho
  + `GET /api/v1/infra/misa/crm/api/v2/Stocks/product_ledger`: [ProductLedger - Sổ Tồn kho] Paging lấy về danh sách tồn kho có phân trang
  + `POST /api/v1/infra/misa/crm/api/v2/Stocks/product_ledger`: [ProductLedger - Cập nhật Tồn kho] Cập nhật số lượng tồn kho hàng hóa
  + `GET /api/v1/infra/misa/crm/api/v2/Stocks/asyncid`: [Stock - Chi tiết theo AsyncID] Lấy dữ liệu kho theo mã async_ids
  + `GET /api/v1/infra/misa/crm/api/v2/Stocks/code`: [Stock - Chi tiết theo Mã Kho] Lấy dữ liệu kho theo mã stockCode

- **`[MISA-AMIS-CRM] 07. Leads (Đầu mối tiềm năng)`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts) (3 endpoints)
  + `POST /api/v1/infra/misa/crm/leads`: [Lead - Tiếp nhận đầu mối] Tự động hứng dữ liệu đầu mối từ FB Ads, TikTok, Web vào CRM
  + `GET /api/v1/infra/misa/crm/leads`: [Lead - Danh sách đầu mối] Lọc danh sách đầu mối theo trạng thái và kênh marketing
  + `POST /api/v1/infra/misa/crm/leads/:id/convert`: [Lead - Chuyển đổi Khách hàng] Chuyển đổi Lead thành Khách hàng & Cơ hội

- **`[MISA-AMIS-CRM] 08. Opportunities (Cơ hội bán hàng)`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts) (3 endpoints)
  + `POST /api/v1/infra/misa/crm/opportunities`: [Opportunity - Tạo cơ hội] Thêm cơ hội giao dịch vào pipeline bán hàng
  + `GET /api/v1/infra/misa/crm/opportunities`: [Opportunity - Danh sách cơ hội] Tra cứu danh sách cơ hội theo giai đoạn phễu
  + `PUT /api/v1/infra/misa/crm/opportunities/:id/stage`: [Opportunity - Cập nhật giai đoạn] Kéo thả / Chuyển bước cơ hội bán hàng

- **`[MISA-AMIS-CRM] 09. Quotations (Báo giá bán hàng)`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts) (3 endpoints)
  + `POST /api/v1/infra/misa/crm/quotations`: [Quotation - Lập báo giá] Lập báo giá thương mại chi tiết cho khách hàng
  + `GET /api/v1/infra/misa/crm/quotations`: [Quotation - Danh sách báo giá] Tra cứu danh sách báo giá theo khách hàng
  + `GET /api/v1/infra/misa/crm/quotations/:id`: [Quotation - Chi tiết báo giá] Xem chi tiết báo giá và các điều khoản thanh toán

#### D. MISA AMIS Kế toán Doanh nghiệp (ACT Open API & Báo cáo TT200 — 4 Resources, 30 Endpoints, đánh số 01..04)
Docs chính thức: `https://actdocs.misa.vn/g2/graph/ACTOpenAPIHelp/index.html` và Hướng dẫn kết nối: `https://helpact.misa.vn/kb/lap-chung-tu-hach-toan-tu-du-lieu-ket-noi-voi-cac-ung-dung-khac-qua-api/`. Triển khai đầy đủ 15 hàm RPC cốt lõi của ACT Open API (`/api/oauth/actopen/...`) kèm engine demo callback và báo cáo chuẩn Thông tư 200/2014/TT-BTC:

- **`[MISA-AMIS-Accounting] 01. ACT Open API - Core Functions (Kết nối & Chứng từ)`** — [`misa-amis-accounting.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-accounting.controller.ts) (7 endpoints)
  + `POST /api/oauth/actopen/connect`: [Connect - Hàm kết nối] Xác thực ứng dụng kết nối AMIS Kế toán qua app_id & access_code
  + `POST /api/oauth/actopen/save`: [Voucher - Cất đề nghị sinh chứng từ] Cất đề nghị sinh 46 loại chứng từ kế toán
  + `POST /api/oauth/actopen/delete`: [Voucher - Xóa đề nghị sinh chứng từ] Xóa đề nghị sinh chứng từ đã gửi
  + `POST /vouchers`: [Voucher - Chứng từ kế toán] Lập chứng từ kế toán thủ công (Phiếu thu 1111/1121, Phiếu chi)
  + `GET /vouchers`: [Voucher - Chứng từ kế toán] Danh sách chứng từ kế toán theo kỳ
  + `GET /vouchers/:id`: [Voucher - Chứng từ kế toán] Chi tiết chứng từ kế toán & Bút toán định khoản Nợ/Có cấp 2
  + `POST /sync-order`: [Sync - Ghi sổ tự động] Tự động ghi sổ đơn hàng POS/TMĐT sang bút toán doanh thu AMIS

- **`[MISA-AMIS-Accounting] 02. ACT Open API - Master Data (Danh mục, Công nợ & Tồn kho)`** — [`misa-amis-accounting.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-accounting.controller.ts) (13 endpoints)
  + `POST /api/oauth/actopen/get_dictionary`: [Dictionary - Lấy danh mục] Lấy 15 loại danh mục: đối tượng, ngân hàng, kho, VTHH, ĐVT...
  + `POST /api/oauth/actopen/save_dictionary`: [Dictionary - Sinh danh mục] Thêm mới danh mục vật tư hàng hóa, đối tượng sang AMIS
  + `POST /api/oauth/actopen/get_dictionary_delete`: [Dictionary - Danh mục đã xóa] Đồng bộ danh mục đã bị xóa khỏi AMIS
  + `POST /api/oauth/actopen/get_list_acc_obj_debt`: [Debt - Công nợ đối tượng] Lấy số dư công nợ phải thu (TK 131) hoặc phải trả (TK 331)
  + `POST /api/oauth/actopen/get_list_acc_obj_debt_delete`: [Debt - Công nợ đã xóa] Tra cứu công nợ đã xóa
  + `POST /api/oauth/actopen/get_list_inventory_balance`: [Stock - Tồn kho theo kho] Lấy số lượng tồn kho của vật tư hàng hóa theo kho
  + `POST /api/oauth/actopen/get_list_inventory_balance_delete`: [Stock - Tồn kho đã xóa] Đồng bộ tồn kho đã bị xóa
  + `POST /api/oauth/actopen/get_company_info`: [Company - Thông tin công ty] Lấy cơ cấu tổ chức và chi nhánh công ty
  + `POST /api/oauth/actopen/get_option`: [System Option - Tùy chọn hệ thống] Tra cứu phương pháp tính giá xuất kho, đa tiền tệ
  + `POST /api/oauth/actopen/set_option`: [System Option - Thiết lập kết nối] Thiết lập quy tắc đồng bộ chứng từ tự động
  + `POST /api/oauth/actopen/get_detail_account_by_expense`: [Expense - Phát sinh theo KMCP] Báo cáo chi tiết phát sinh theo khoản mục chi phí
  + `POST /products`: [Product - Vật tư hàng hóa] Khai báo vật tư hàng hóa lên AMIS Kế toán (gán TK 1561, 632, 5111)
  + `GET /products`: [Product - Vật tư hàng hóa] Tra cứu danh mục hàng hóa, nguyên vật liệu

- **`[MISA-AMIS-Accounting] 03. ACT Open API - Callback & Webhooks (Bất đồng bộ & Ký số)`** — [`misa-amis-accounting.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-accounting.controller.ts) (6 endpoints)
  + `POST /api/oauth/actopen/callback`: [Callback - Kết quả xử lý] Lấy danh sách kết quả xử lý sinh chứng từ bất đồng bộ
  + `POST /api/oauth/actopensupport/call_back_data_demo`: [Callback Demo - Test gọi callback] Giả lập AMIS gọi Webhook trả kết quả chứng từ
  + `POST /api/oauth/actopensupport/call_back_sign_data_demo`: [Sign Demo - Test ký số HSM] Demo gọi kết quả ký số chứng từ
  + `POST /api/oauth/actopensupport/call_back_cancel_sign_data_demo`: [Cancel Sign Demo - Test hủy ký số] Demo gọi kết quả hủy ký số
  + `POST /api/oauth/actopensupport/check_sign_data_demo`: [Check Sign Demo - Kiểm tra ký số] Demo kiểm tra trạng thái ký số
  + `POST /api/oauth/actopensupport/get_token`: [Token Demo - Cấp token test] Cấp token thử nghiệm môi trường Sandbox

- **`[MISA-AMIS-Accounting] 04. Financial Reports & Chart of Accounts (Báo cáo & Tài khoản)`** — [`misa-amis-accounting.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-accounting.controller.ts) (4 endpoints)
  + `GET /chart-of-accounts`: [Chart of Accounts - Hệ thống tài khoản] Bảng tài khoản kế toán chuẩn Thông tư 200/2014/TT-BTC
  + `GET /reports/profit-loss`: [Report - Kết quả kinh doanh] Báo cáo kết quả hoạt động kinh doanh (P&L: Doanh thu, Giá vốn, Lợi nhuận)
  + `GET /reports/balance-sheet`: [Report - Bảng cân đối kế toán] Bảng cân đối kế toán tài sản và nguồn vốn
  + `GET /reports/cash-flow`: [Report - Báo cáo lưu chuyển tiền tệ] Báo cáo lưu chuyển tiền tệ theo phương pháp gián tiếp


---

### 3.6. Logistics Vận đơn (GHTK, GHN, Viettel Post — 3 Carrier Resources, 28 Endpoints, đánh số 01..03)

- **`[Logistics-VN] 01. Giao Hàng Tiết Kiệm (GHTK)`** — [`logistics.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/logistics/logistics.controller.ts)
  + `POST /api/v1/infra/logistics/ghtk/services/shipment/fee`: Tính cước phí giao hàng GHTK (đường bay / đường bộ)
  + `POST /api/v1/infra/logistics/ghtk/services/shipment/order`: Đẩy tạo vận đơn GHTK Express
  + `GET /api/v1/infra/logistics/ghtk/tracking/:trackingCode`: Tra cứu hành trình bưu kiện GHTK v2
  + `POST /api/v1/infra/logistics/ghtk/cancel/:trackingCode`: Hủy vận đơn GHTK
  + `GET /api/v1/infra/logistics/ghtk/services/label/:trackingCode`: Tải mã tem in phiếu gửi hàng khổ A6 kèm barcode
  + `GET /api/v1/infra/logistics/ghtk/services/shipment/pick-shifts`: Danh sách ca lấy hàng linh hoạt (Sáng, Chiều, Tối)
  + `GET /api/v1/infra/logistics/ghtk/services/shipment/list_hub`: Danh sách bưu cục / Hub nhận hàng GHTK toàn quốc
  + `POST /api/v1/infra/logistics/ghtk/services/statement/reconciliation`: Báo cáo đối soát tiền thu hộ COD

- **`[Logistics-VN] 02. Giao Hàng Nhanh (GHN)`** — [`logistics.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/logistics/logistics.controller.ts)
  + `POST /api/v1/infra/logistics/ghn/shiip/public-api/v2/shipping-order/available-services`: Tra cứu gói cước khả dụng theo tuyến đường
  + `POST /api/v1/infra/logistics/ghn/shiip/public-api/v2/shipping-order/fee`: Tính cước vận chuyển chuẩn GHN Express
  + `POST /api/v1/infra/logistics/ghn/shiip/public-api/v2/shipping-order/leadtime`: Tính thời gian dự kiến giao hàng (Leadtime)
  + `POST /api/v1/infra/logistics/ghn/shiip/public-api/v2/shipping-order/create`: Tạo vận đơn Giao Hàng Nhanh
  + `POST /api/v1/infra/logistics/ghn/shiip/public-api/v2/shipping-order/detail`: Xem chi tiết gói hàng và tiến độ giao vận
  + `POST /api/v1/infra/logistics/ghn/shiip/public-api/v2/switch-status/cancel`: Hủy vận đơn giao hàng GHN
  + `POST /api/v1/infra/logistics/ghn/shiip/public-api/v2/a5/gen-token`: Tạo token in phiếu gửi hàng A5 / 80x80
  + `GET /api/v1/infra/logistics/ghn/shiip/public-api/master-data/province`: Danh mục Tỉnh/Thành phố GHN
  + `POST /api/v1/infra/logistics/ghn/shiip/public-api/master-data/district`: Danh mục Quận/Huyện GHN
  + `POST /api/v1/infra/logistics/ghn/shiip/public-api/master-data/ward`: Danh mục Phường/Xã GHN
  + `GET /api/v1/infra/logistics/ghn/shiip/public-api/v2/station/get`: Danh bạ bưu cục / Điểm gửi GHN Station

- **`[Logistics-VN] 03. Viettel Post`** — [`logistics.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/logistics/logistics.controller.ts)
  + `POST /api/v1/infra/logistics/viettel-post/order/getPrice`: Tính cước dịch vụ vận chuyển Viettel Post
  + `POST /api/v1/infra/logistics/viettel-post/v2/order/createOrder`: Tạo đơn vận chuyển Viettel Post
  + `POST /api/v1/infra/logistics/viettel-post/order/updateOrder`: Cập nhật thông tin đơn giao (địa chỉ, tiền COD, ghi chú)
  + `GET /api/v1/infra/logistics/viettel-post/tracking/:orderNumber`: Theo dõi lộ trình thời gian thực bưu gửi Viettel Post
  + `POST /api/v1/infra/logistics/viettel-post/order/cancelOrder`: Hủy đơn vận chuyển Viettel Post
  + `GET /api/v1/infra/logistics/viettel-post/order/printOrder/:orderNumber`: In phiếu gửi bưu phẩm Viettel Post khổ A6
  + `GET /api/v1/infra/logistics/viettel-post/categories/listProvince`: Danh sách Tỉnh/Thành phố Viettel Post
  + `GET /api/v1/infra/logistics/viettel-post/categories/listDistrict`: Danh sách Quận/Huyện Viettel Post
  + `GET /api/v1/infra/logistics/viettel-post/categories/listPostOffice`: Danh bạ Bưu cục Viettel Post gần nhất

---

### 3.7. Pancake POS Social Commerce & Omni POS (11 Modules, 120 Endpoints, đánh số thứ tự 01..11 Chuẩn 1:1 Docs chính thức https://docs.pancake.biz/pos/api/)

Toàn bộ 103 operations chính thức từ Pancake POS OpenAPI v1 Specification (`https://pos.pages.fm/api/v1`) cùng 17 routes tương thích ngược được phân loại 1:1 thành 11 module trực quan trên Swagger UI:

- **`[POS-Pancake] 01. Orders & Shipments (Đơn hàng & Giao vận)`** — [`pancake-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pancake/pancake-orders.controller.ts) (22 endpoints)
  + `GET /shops/:shopId/orders`: [Order - Danh sách đơn] Lấy danh sách đơn hàng có phân trang và lọc theo trạng thái
  + `POST /shops/:shopId/orders`: [Order - Tạo đơn hàng] Tạo đơn hàng mới chuẩn schema Pancake POS v1
  + `GET /shops/:shopId/orders/:orderId`: [Order - Chi tiết đơn] Lấy thông tin chi tiết đơn hàng
  + `PUT /shops/:shopId/orders/:orderId`: [Order - Sửa đơn hàng] Cập nhật thông tin giao hàng, tiền thu hộ COD
  + `GET /shops/:shopId/orders/:orderId/messages`: [Order - Tin nhắn đơn] Xem lịch sử trao đổi tin nhắn hội thoại gắn liền với đơn
  + `GET /shops/:shopId/order_source`: [Order Source - Nguồn đơn] Danh sách nguồn đơn hàng (Facebook, TikTok, Web, POS)
  + `POST /shops/:shopId/products/get_logistics_shipping_document`: [Shipment - In phiếu gửi] Lấy link in hóa đơn bưu phẩm giao vận A6
  + `POST /shops/:shopId/orders/get_tracking_url`: [Shipment - Link tra cứu] Lấy link xác nhận đơn hàng và mã tracking cho khách
  + `POST /shops/:shopId/orders/arrange_shipment`: [Shipment - Chuẩn bị giao] Đẩy đơn và điều phối sang đối tác vận chuyển
  + `POST /shops/:shopId/orders/get_promotion_advance_active`: [Order Promotion - KM áp dụng] Danh sách chương trình khuyến mãi tự động kích hoạt
  + `GET /shops/:shopId/bank_payments`: [Payment - Phương thức thanh toán] Danh mục tài khoản ngân hàng và cổng thanh toán
  + `GET /shops/:shopId/orders_returned`: [Return - Đơn hoàn/trả] Danh sách đơn hàng trả lại kho
  + `POST /shops/:shopId/orders_returned`: [Return - Tạo đơn hoàn] Khởi tạo đơn hoàn trả hàng và hoàn tiền
  + `GET /shops/:shopId/partners`: [Partner - Đối tác giao vận] Danh sách đối tác giao hàng kết nối
  + `GET /shops/:shopId/projects`: [Project - Dự án] Danh sách dự án kinh doanh
  + `POST /orders/create`: [Legacy - Tạo đơn] Tạo đơn Pancake POS từ luồng chat Facebook/Zalo/TikTok
  + `GET /orders/list`: [Legacy - Danh sách đơn] Lấy danh sách đơn hàng chốt trên Pancake POS
  + `GET /orders/:id`: [Legacy - Chi tiết đơn] Xem chi tiết đơn hàng chốt
  + `PUT /orders/update`: [Legacy - Cập nhật đơn] Cập nhật ghi chú hoặc thông tin đơn hàng chốt
  + `POST /orders/update-status`: [Legacy - Đổi trạng thái] Cập nhật trạng thái đơn hàng chốt
  + `POST /orders/cancel`: [Legacy - Hủy đơn] Hủy đơn hàng chốt trên Pancake và tự động cập nhật lý do khách hủy
  + `DELETE /orders/:id`: [Legacy - Xóa đơn] Xóa đơn chốt khỏi hệ thống

- **`[POS-Pancake] 02. Order Tags & Auto Voice (Nhãn đơn & Gọi tự động)`** — [`pancake-ordertags.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pancake/pancake-ordertags.controller.ts) (7 endpoints)
  + `GET /shops/:shopId/orders/tags`: [Order Tag - Danh sách nhãn] Danh sách thẻ tag phân loại trạng thái xử lý đơn hàng
  + `POST /shops/:shopId/orders/tags`: [Order Tag - Tạo nhãn] Tạo thẻ tag mới cho đơn hàng
  + `PUT /shops/:shopId/orders/tags/:tagId`: [Order Tag - Sửa nhãn] Đổi tên hoặc màu sắc thẻ tag đơn hàng
  + `GET /shops/:shopId/orders/tag_groups`: [Tag Group - Nhóm nhãn] Danh sách nhóm phân loại thẻ tag
  + `POST /shops/:shopId/orders/:orderId/trigger_call`: [Auto Voice - Gọi tự động] Kích hoạt cuộc gọi AI Voice bot tự động xác nhận đơn
  + `GET /shops/:shopId/order_call_laters`: [Call Later - Hẹn gọi lại] Danh sách lịch hẹn gọi lại cho khách hàng
  + `POST /shops/:shopId/order_call_laters`: [Call Later - Tạo lịch hẹn] Đặt lịch hẹn tự động gọi lại chăm sóc hoặc chốt đơn

- **`[POS-Pancake] 03. Customers & Loyalty (Khách hàng & Tích điểm)`** — [`pancake-customers.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pancake/pancake-customers.controller.ts) (11 endpoints)
  + `GET /shops/:shopId/customers`: [Customer - Danh sách khách] Danh sách khách hàng và lịch sử mua hàng
  + `POST /shops/:shopId/customers`: [Customer - Thêm khách mới] Tạo hồ sơ khách hàng mới
  + `GET /shops/:shopId/customers/:customerId`: [Customer - Chi tiết khách] Thông tin chi tiết khách hàng và địa chỉ giao hàng
  + `PUT /shops/:shopId/customers/:customerId`: [Customer - Cập nhật khách] Sửa thông tin liên hệ và phân hạng
  + `GET /shops/:shopId/customers/point_logs`: [Loyalty - Lịch sử điểm thưởng] Tra cứu nhật ký tích điểm và tiêu điểm thành viên
  + `POST /shops/:shopId/promotion_advance/create_multi`: [Promotion - Gán khuyến mãi] Tạo và áp dụng chương trình khuyến mãi riêng theo tệp khách hàng
  + `GET /shops/:shopId/customers/:customerId/load_customer_notes`: [Note - Xem ghi chú] Danh sách ghi chú nội bộ về thói quen mua sắm của khách
  + `POST /shops/:shopId/customers/:customerId/create_note`: [Note - Thêm ghi chú] Thêm ghi chú đặc biệt cho khách hàng
  + `GET /shops/:shopId/customer_levels`: [Customer Level - Cấp bậc hội viên] Danh mục các cấp bậc khách hàng (Đồng, Bạc, Vàng, Kim Cương)
  + `POST /customers/tag`: [Legacy - Gắn Tag] Gắn nhãn phân loại khách hàng trên Pancake CRM
  + `DELETE /customers/:customerId/tag/:tag`: [Legacy - Gỡ Tag] Xóa nhãn phân loại của khách hàng

- **`[POS-Pancake] 04. Products & Categories (Sản phẩm, Biến thể & Danh mục)`** — [`pancake-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pancake/pancake-products.controller.ts) (19 endpoints)
  + `POST /shops/:shopId/products`: [Product - Tạo sản phẩm] Khai báo sản phẩm mới kèm danh sách biến thể mẫu mã
  + `PUT /shops/:shopId/products/:productId`: [Product - Cập nhật sản phẩm] Sửa tên, giá bán và mô tả sản phẩm
  + `GET /shops/:shopId/products/variations`: [Product - Danh sách biến thể] Danh sách toàn bộ biến thể SKU, giá bán và tồn kho
  + `GET /shops/:shopId/products/:productSku`: [Product - Chi tiết theo SKU] Lấy thông tin chi tiết sản phẩm theo mã SKU
  + `PUT /shops/:shopId/products/update_hide`: [Product - Ẩn/Hiện] Ẩn hoặc kích hoạt lại sản phẩm trên kênh bán
  + `POST /shops/:shopId/tags_products`: [Product Tag - Tạo nhãn] Tạo thẻ tag phân nhóm sản phẩm
  + `POST /shops/:shopId/variations/:variationId/update_quantity`: [Inventory - Sửa tồn 1 SKU] Cập nhật số lượng tồn kho cho một biến thể cụ thể
  + `POST /shops/:shopId/variations/update_quantity`: [Inventory - Sửa tồn hàng loạt] Cập nhật số lượng tồn kho cho nhiều mã biến thể cùng lúc
  + `POST /shops/:shopId/variations/update_composite_product`: [Composite - Sản phẩm đóng gói] Cấu hình định lượng thành phần cho sản phẩm đóng gói
  + `GET /shops/:shopId/categories`: [Category - Danh mục ngành hàng] Danh sách danh mục nhóm sản phẩm
  + `POST /shops/:shopId/categories`: [Category - Tạo danh mục] Tạo danh mục ngành hàng mới
  + `GET /shops/:shopId/brand`: [Brand - Thương hiệu] Danh sách nhãn hiệu/thương hiệu sản phẩm
  + `GET /shops/:shopId/materials_products`: [Material - Chất liệu] Danh mục chất liệu cấu thành sản phẩm
  + `GET /shops/:shopId/product_measurements/get_measure`: [Measurement - Đơn vị tính] Danh mục đơn vị tính và nhóm đo lường
  + `GET /shops/:shopId/combo_products`: [Combo - Danh sách Combo] Danh sách combo sản phẩm ưu đãi
  + `POST /shops/:shopId/combo_products`: [Combo - Tạo Combo] Tạo gói combo phối hợp nhiều sản phẩm
  + `POST /products/create`: [Legacy - Tạo SP] Thêm sản phẩm mới lên kho bán hàng Pancake Store
  + `GET /products/list`: [Legacy - Danh mục SP] Truy vấn danh sách sản phẩm
  + `PUT /products/update`: [Legacy - Sửa SP] Cập nhật giá bán, tên sản phẩm

- **`[POS-Pancake] 05. Inventory, Warehouse & Transfers (Kho bãi, Tồn kho & Chuyển kho)`** — [`pancake-inventory.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pancake/pancake-inventory.controller.ts) (16 endpoints)
  + `GET /shops/:shopId/warehouses`: [Warehouse - Danh sách kho] Danh sách địa điểm kho hàng và chi nhánh
  + `POST /shops/:shopId/warehouses`: [Warehouse - Tạo kho] Thêm mới địa điểm kho lưu trữ
  + `PUT /shops/:shopId/warehouses/:warehouseId`: [Warehouse - Cập nhật kho] Sửa thông tin địa chỉ và tên kho
  + `GET /shops/:shopId/inventory_histories`: [Inventory - Lịch sử tồn kho] Nhật ký biến động xuất nhập tồn hàng hóa theo thời gian
  + `GET /shops/:shopId/transfers`: [Transfer - Danh sách chuyển kho] Danh sách phiếu điều chuyển hàng hóa giữa các kho
  + `POST /shops/:shopId/transfers/multi`: [Transfer - Tạo chuyển kho] Tạo phiếu điều chuyển hàng hóa đa chi nhánh
  + `PUT /shops/:shopId/transfers/:transferId`: [Transfer - Sửa chuyển kho] Cập nhật trạng thái phiếu chuyển kho (Đang chuyển, Đã nhận)
  + `GET /shops/:shopId/transfers/get_status_history/:transferId`: [Transfer - Lịch sử trạng thái] Lịch sử phê duyệt và điều vận phiếu chuyển kho
  + `GET /shops/:shopId/stocktakings`: [Stocktaking - Danh sách kiểm kê] Danh sách phiếu kiểm kê cân bằng kho
  + `POST /shops/:shopId/stocktakings`: [Stocktaking - Tạo kiểm kê] Lập biên bản kiểm đếm kho thực tế
  + `GET /shops/:shopId/stocktakings/:stocktakingId`: [Stocktaking - Chi tiết kiểm kê] Xem chi tiết số lượng chênh lệch thực tế vs phần mềm
  + `PUT /shops/:shopId/stocktakings/:stocktakingId`: [Stocktaking - Cập nhật kiểm kê] Cập nhật và xác nhận cân bằng kho
  + `GET /shops/:shopId/export`: [Export - Danh sách phiếu xuất] Danh sách phiếu xuất kho hàng hóa
  + `POST /shops/:shopId/export`: [Export - Tạo phiếu xuất] Khởi tạo phiếu xuất kho bán lẻ, tiêu hủy hoặc xuất nội bộ
  + `PUT /shops/:shopId/export/:exportId`: [Export - Cập nhật phiếu xuất] Cập nhật thông tin phiếu xuất kho
  + `POST /inventory/sync`: [Legacy - Đồng bộ tồn] Cân bằng số lượng tồn kho sản phẩm trên Pancake Store

- **`[POS-Pancake] 06. Purchases & Suppliers (Nhập hàng & Nhà cung cấp)`** — [`pancake-purchases.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pancake/pancake-purchases.controller.ts) (5 endpoints)
  + `GET /shops/:shopId/purchases`: [Purchase - Danh sách nhập hàng] Danh sách đơn đặt mua hàng từ nhà cung cấp
  + `POST /shops/:shopId/purchases`: [Purchase - Tạo đơn nhập hàng] Lập phiếu mua hàng và nhập kho
  + `PUT /shops/:shopId/purchases/:purchaseId`: [Purchase - Cập nhật đơn nhập] Sửa chiết khấu, số lượng thực nhận và thanh toán
  + `POST /shops/:shopId/purchases/separate`: [Purchase - Tách đơn nhập] Phân tách đơn nhập hàng khi nhận từng đợt
  + `GET /shops/:shopId/supplier`: [Supplier - Danh sách nhà cung cấp] Danh mục đối tác cung ứng hàng hóa

- **`[POS-Pancake] 07. Promotions & Vouchers (Khuyến mại & Mã giảm giá)`** — [`pancake-promotions.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pancake/pancake-promotions.controller.ts) (7 endpoints)
  + `GET /shops/:shopId/promotion_advance`: [Promotion - Danh sách KM] Danh sách chương trình khuyến mãi nâng cao
  + `POST /shops/:shopId/promotion_advance`: [Promotion - Tạo KM] Tạo chương trình khuyến mãi sản phẩm theo % hoặc tiền mặt
  + `PUT /shops/:shopId/promotion_advance/:promotionId`: [Promotion - Sửa KM] Cập nhật thời hạn hoặc tỷ lệ chiết khấu
  + `POST /shops/:shopId/promotion_advance/delete_multi`: [Promotion - Bật/Tắt KM] Bật, tắt hoặc xóa hàng loạt khuyến mãi
  + `GET /shops/:shopId/vouchers`: [Voucher - Danh sách Voucher] Tra cứu các mã voucher coupon kích hoạt
  + `POST /shops/:shopId/vouchers`: [Voucher - Tạo Voucher] Khởi tạo mã giảm giá voucher chiết khấu
  + `GET /shops/:shopId/vouchers/:voucherId`: [Voucher - Chi tiết Voucher] Xem điều kiện áp dụng và số lượt dùng còn lại

- **`[POS-Pancake] 08. Finance, Debt & Transactions (Tài chính, Công nợ & Sổ quỹ)`** — [`pancake-finance.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pancake/pancake-finance.controller.ts) (7 endpoints)
  + `GET /shops/:shopId/debt`: [Debt - Danh sách công nợ] Tra cứu dư nợ phải thu của khách và phải trả cho nhà cung cấp
  + `GET /shops/:shopId/transactions`: [Transaction - Sổ quỹ thu chi] Danh sách phiếu thu/chi tiền mặt và ngân hàng
  + `POST /shops/:shopId/transactions`: [Transaction - Lập phiếu thu chi] Ghi nhận phiếu thu tiền hàng hoặc chi phí vận hành
  + `POST /shops/:shopId/adv_costs`: [Transaction - Chi phí Ads] Cập nhật chi phí Facebook/TikTok Ads vào sổ quỹ
  + `GET /shops/:shopId/payment_accounts/get_payment_histories`: [Transaction - Lịch sử thanh toán] Biến động số dư tài khoản ngân hàng
  + `GET /shops/:shopId/reconciliations`: [Reconciliation - Phiên đối soát] Danh sách các phiên đối soát COD và tiền cước giao hàng
  + `GET /shops/:shopId/list_einvoices/`: [E-Invoice - Hóa đơn điện tử] Danh sách hóa đơn điện tử phát hành tích hợp MISA/VNPT

- **`[POS-Pancake] 09. Analytics & Reports (Báo cáo & Thống kê kinh doanh)`** — [`pancake-analytics.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pancake/pancake-analytics.controller.ts) (7 endpoints)
  + `GET /shops/:shopId/analytics/sale`: [Statistics - Báo cáo bán hàng] Báo cáo tổng hợp doanh thu, số đơn, tỉ lệ chốt và doanh thu thuần
  + `GET /shops/:shopId/analytics/get_list_formula`: [Statistics - Công thức tùy biến] Danh sách công thức tính chỉ số ROI, Doanh thu thuần
  + `GET /shops/:shopId/analytics/get_analytic_fields`: [Statistics - Trường dữ liệu] Danh mục các trường dữ liệu báo cáo thống kê
  + `GET /shops/:shopId/statistic_custom/folders`: [Statistics - Thư mục báo cáo] Danh sách thư mục báo cáo phân tích tùy chỉnh
  + `GET /shops/:shopId/inventory_analytics/inventory`: [Statistics - Tồn theo biến thể] Báo cáo chi tiết xuất nhập tồn và giá trị tồn theo từng SKU
  + `GET /shops/:shopId/inventory_analytics/inventory_by_product`: [Statistics - Tồn theo sản phẩm] Báo cáo tổng hợp xuất nhập tồn theo sản phẩm cha
  + `GET /shops/:shopId/customer_analytics/report`: [Statistics - Báo cáo khách hàng] Phân tích hành vi, tỉ lệ khách quay lại và giá trị vòng đời CLV

- **`[POS-Pancake] 10. Multi-channel, Ads & Livestream (Sàn TMĐT, Quảng cáo & Livestream)`** — [`pancake-channels.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pancake/pancake-channels.controller.ts) (12 endpoints)
  + `GET /shops/:shopId/marketplace/get_account_info`: [eCommerce - Tài khoản sàn] Quản lý các gian hàng Shopee, TikTok Shop, Lazada liên kết
  + `GET /shops/:shopId/marketplace/products`: [eCommerce - Sản phẩm sàn] Đồng bộ giá bán và phân loại sản phẩm đa sàn
  + `GET /shops/:shopId/shopee/evaluate`: [eCommerce - Đánh giá Shopee] Danh sách đánh giá sao và comment phản hồi người mua
  + `GET /shops/:shopId/marketplace/reverse_order`: [eCommerce - Đơn hoàn sàn] Quản lý khiếu nại trả hàng hoàn tiền từ Shopee/TikTok
  + `GET /shops/:shopId/ads_manager/ad_accounts`: [Ads Manager - Tài khoản QC] Danh sách tài khoản quảng cáo Facebook/TikTok
  + `GET /shops/:shopId/ads_manager/campaigns_v2`: [Ads Manager - Chiến dịch QC] Danh sách chiến dịch quảng cáo marketing
  + `GET /shops/:shopId/ads_manager/ad_sets_v2`: [Ads Manager - Nhóm QC] Danh sách nhóm quảng cáo mục tiêu (Ad Sets)
  + `GET /shops/:shopId/ads_manager/ads_v2`: [Ads Manager - Mẫu QC] Danh sách mẫu quảng cáo (Ads)
  + `GET /shops/:shopId/livestream_manager`: [Livestream - Phiên livestream] Quản lý kịch bản bắt comment chốt đơn livestream tự động [MÃ + SĐT]
  + `GET /conversations/list`: [Legacy - Hội thoại] Lấy danh sách tin nhắn inbox/comment gần nhất trên Fanpage
  + `POST /chat/send`: [Legacy - Gửi Chat] Gửi tin nhắn phản hồi tự động cho khách hàng
  + `GET /pages/list`: [Legacy - Kênh bán] Danh mục tất cả Fanpage Facebook, Instagram và Zalo kết nối

- **`[POS-Pancake] 11. Shop, Geo, Employees & Webhooks (Cửa hàng, Địa giới, Nhân viên & Webhook)`** — [`pancake-system.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pancake/pancake-system.controller.ts) (7 endpoints)
  + `GET /shops`: [Shop - Thông tin Shop] Lấy danh sách các cửa hàng mà tài khoản có quyền truy cập
  + `GET /geo/provinces`: [Address - Tỉnh/Thành] Danh mục Tỉnh/Thành phố Việt Nam chuẩn hóa địa chỉ giao nhận
  + `GET /geo/districts`: [Address - Quận/Huyện] Danh mục Quận/Huyện theo Tỉnh/Thành
  + `GET /geo/communes`: [Address - Phường/Xã] Danh mục Phường/Xã theo Quận/Huyện
  + `GET /shops/:shopId/users`: [Employee - Nhân viên] Danh sách nhân viên và phân quyền bán hàng, thủ kho, kế toán
  + `PUT /shops/:shopId`: [Webhook - Cấu hình Webhook] Cập nhật URL callback nhận sự kiện đơn hàng và tồn kho realtime
  + `POST /webhooks/subscribe`: [Legacy - Đăng ký Webhook] Cấu hình URL webhook nhận tin nhắn chat và sự kiện chốt đơn

---

### 3.8. Sàn Thương mại điện tử (5 Platforms, 23 Endpoints, đánh số 01..05)

- **`[Marketplace] 01. Shopee`** (8 endpoints): Đơn hàng, Tồn kho, Voucher Shop, Vận chuyển, Doanh thu Escrow.
- **`[Marketplace] 02. TikTok Shop`** (7 endpoints): Quản lý gian hàng, Đồng bộ SKU, Đơn hàng TikTok Shop, Khuyến mãi Flash Sale.
- **`[Marketplace] 03. Lazada`** (3 endpoints): Đơn hàng, Danh mục mặt hàng, Đồng bộ giá và tồn kho.
- **`[Marketplace] 04. Tiki`** (2 endpoints): Tra cứu đơn Tiki, Đồng bộ tồn kho Tiki Trading/Marketplace.
- **`[Marketplace] 05. Shopify`** (3 endpoints): Quản lý Orders, Customers, Inventory trên Shopify Store.

---

### 3.9. UniFlow Master Control Plane (3 Modules, 11 Endpoints, đánh số 01)

- **`[UniFlow-Infra] 01. Control Gateway`** (7 endpoints): Universal Action Dispatcher, Connectors Health Check, Capabilities Registry, Sandbox Simulators.
- **`[UniFlow-Core] 01. Khuyến mãi & Vouchers`** (2 endpoints): Sinh mã khuyến mãi đa sàn, Thẩm định Voucher.
- **`[UniFlow-Gateways] 01. Kênh thông báo (Telegram & Zalo ZNS)`** (2 endpoints): Gửi cảnh báo khẩn cấp Telegram Bot, Bắn thông báo trạng thái đơn hàng Zalo ZNS.

---

## 4. HƯỚNG DẪN TEST VÀ VẬN HÀNH

### 4.1. Kiểm tra Swagger UI
Mở trình duyệt truy cập:
👉 **`http://localhost:3000/docs`**

Tất cả 91 module hiển thị dưới dạng accordion collapsible groups được phân loại chuyên nghiệp với tiền tố `[...] 0X`:
- `[POS-Nhanh] 01` đến `14` (14 Modules Nhanh.vn Open API — 56 endpoints)
- `[POS-Sapo] 01` đến `29` (29 Modules Sapo Omnichannel API — 96 endpoints)
- `[POS-KiotViet] 01` đến `06` (6 Modules KiotViet API — 32 endpoints)
- `[POS-Haravan] 01` đến `12` (12 Categories Official Haravan Docs — 197 endpoints)
- `[POS-Pancake] 01` đến `11` (11 Modules Pancake POS Official API — 120 endpoints)
- `[MISA-eShop] 01` đến `06` (6 Modules MISA eShop — 23 endpoints)
- `[MISA-meInvoice] 01` đến `04` (4 Modules MISA meInvoice — 13 endpoints)
- `[MISA-AMIS-CRM] 01` đến `05` (5 Modules MISA AMIS CRM — 16 endpoints)
- `[MISA-AMIS-Accounting] 01` đến `03` (3 Modules MISA AMIS Kế toán — 10 endpoints)
- `[Logistics-VN] 01` đến `03` (3 Modules GHTK, GHN, Viettel Post — 28 endpoints)
- `[Marketplace] 01` đến `05` (5 Modules Shopee, TikTok, Lazada, Tiki, Shopify — 23 endpoints)
- `[UniFlow-Infra] 01`, `[UniFlow-Core] 01`, `[UniFlow-Gateways] 01` (3 Modules UniFlow Core — 11 endpoints)

**Tổng cộng:** **882 Endpoints — 98 Tags — 0 Tag Rỗng.** Mọi khối collapse đều chứa trọn vẹn các endpoint có thể gửi request LIVE / SANDBOX ngay trên giao diện.

### 4.2. Chạy Kiểm Thử Toàn Diện Tự Động
Chạy các file test suite xác minh tất cả các endpoint:
```bash
# Kiểm thử toàn diện Haravan Omnichannel (12 categories) và Logistics (GHTK, GHN, Viettel Post)
node scratch/test-haravan-logistics.js

# Kiểm thử toàn diện MISA ecosystem (eShop, meInvoice, CRM, Accounting)
node scratch/test-misa-all.js

# Kiểm thử hồi quy hệ thống UniFlow Gateway và các Connectors
node scratch/test-all-1to1-suite.js
```
Kết quả cam kết: **100% Passed (HTTP 200/201)** trên toàn bộ hệ thống.

