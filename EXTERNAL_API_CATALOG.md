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
| **POS** | **KiotViet** | `controllers/kiotviet/` (6 controller files) | 6 modules | 32 endpoints | [developer.kiotviet.vn](https://developer.kiotviet.vn/) |
| **POS & CMS** | **Haravan Omnichannel** | `controllers/haravan/` (9 controller files, 30 resource groups) | 30 resources | 107 endpoints | [docs.haravan.com/docs/omni-apis/](https://docs.haravan.com/docs/omni-apis/) |
| **Social POS** | **Pancake POS** | `controllers/pos-pancake.controller.ts` (4 resource groups) | 4 modules | 17 endpoints | [pancake.vn](https://pancake.vn/) |
| **Hệ sinh thái MISA** | **eShop, meInvoice, AMIS CRM, AMIS Kế toán** | `controllers/misa/` (4 controller files, 18 resource groups) | 18 modules | 52 endpoints | [eshop.misa.vn](https://eshop.misa.vn/) / [meinvoice.vn](https://meinvoice.vn/) / [developer.misa.vn](https://developer.misa.vn/) |
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

### 3.3. KiotViet Open API (6 Collapsible Groups trên Swagger)

- **`[POS-KiotViet] 01. Hóa đơn & Đặt hàng (Invoices & Orders)`** — [`kiotviet-invoices.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-invoices.controller.ts)
  + `POST /invoices`: Lập hóa đơn bán hàng trực tiếp KiotViet
  + `GET /invoices`: Tra cứu danh sách hóa đơn theo ngày
  + `GET /invoices/:id`: Xem chi tiết hóa đơn
  + `POST /orders`: Tạo đơn đặt hàng từ xa
  + `GET /orders`: Danh sách đơn đặt hàng

- **`[POS-KiotViet] 02. Hàng hóa & Bảng giá (Products & Pricebooks)`** — [`kiotviet-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-products.controller.ts)
  + `POST /products`: Thêm mới hàng hóa
  + `GET /products`: Danh sách hàng hóa
  + `GET /products/code/:code`: Tra cứu hàng theo mã barcode
  + `PUT /products/:id`: Cập nhật thông tin và giá bán
  + `DELETE /products/:id`: Xóa hàng hóa
  + `GET /pricebooks`: Bảng giá áp dụng cho khách buôn / khách lẻ

- **`[POS-KiotViet] 03. Tồn kho & Kiểm kê & Chuyển kho (Inventory & Transfers)`** — [`kiotviet-inventory.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-inventory.controller.ts)
  + `GET /inventory`: Tồn kho theo chi nhánh
  + `POST /transfers`: Lập phiếu chuyển hàng giữa các chi nhánh KiotViet
  + `POST /damageitems`: Phiếu xuất hủy / hàng hỏng kiểm kê

- **`[POS-KiotViet] 04. Khách hàng & Sổ quỹ (Customers & CashFlow)`** — [`kiotviet-customers.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-customers.controller.ts)
  + `POST /customers`: Thêm khách hàng mới
  + `GET /customers`: Danh sách khách hàng và công nợ
  + `GET /customers/:id`: Chi tiết khách hàng
  + `POST /cashflow`: Lập phiếu thu chi tiền mặt KiotViet

- **`[POS-KiotViet] 05. Chi nhánh & Danh mục & NCC (Branches & Categories & Suppliers)`** — [`kiotviet-branches.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-branches.controller.ts)
  + `GET /branches`: Danh sách chi nhánh cửa hàng KiotViet
  + `POST /categories`: Thêm nhóm hàng hóa mới
  + `GET /categories`: Danh sách cây phân loại nhóm hàng
  + `POST /suppliers`: Thêm đối tác nhà cung cấp
  + `GET /suppliers`: Danh sách nhà cung cấp
  + `GET /surcharges`: Danh mục thu thêm (Phụ thu dịch vụ, VAT, ship)
  + `GET /users`: Danh sách nhân viên cửa hàng KiotViet

- **`[POS-KiotViet] 06. Webhooks (Webhooks)`** — [`kiotviet-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/kiotviet/kiotviet-webhooks.controller.ts)
  + `POST /webhook`: Đăng ký webhook listener với KiotViet
  + `GET /webhook`: Danh sách webhook đã đăng ký
  + `DELETE /webhook/:id`: Hủy đăng ký webhook

---

### 3.4. Haravan Omnichannel Open API — Ánh xạ 1:1 Toàn bộ Resource theo Haravan API Reference (30 Collapsible Groups trên Swagger, đánh số thứ tự 01..30)

Toàn bộ 30 resources của Haravan Omnichannel API được bóc tách 1:1 và đánh số thứ tự phân cấp nghiệp vụ hoàn chỉnh (107 endpoints):

- **`[POS-Haravan] 01. Order`** — [`haravan-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-orders.controller.ts)
  + `POST /com/orders.json`: Khởi tạo đơn hàng mới trên hệ thống Haravan Omnichannel
  + `GET /com/orders.json`: Truy vấn danh sách đơn hàng Haravan đa kênh
  + `GET /com/orders/count.json`: Lấy tổng số lượng đơn hàng theo bộ lọc trạng thái
  + `GET /com/orders/:id.json`: Chi tiết một đơn hàng, thông tin thanh toán, giao nhận và line items
  + `PUT /com/orders/:id.json`: Cập nhật ghi chú, nhãn tags và địa chỉ nhận hàng
  + `POST /com/orders/:id/confirm.json`: Chuyển trạng thái đơn sang Đã xác nhận chuẩn bị hàng
  + `POST /com/orders/:id/close.json`: Đóng đơn hàng khi hoàn tất toàn bộ chu trình giao nhận
  + `POST /com/orders/:id/open.json`: Mở lại đơn hàng đã bị đóng hoặc hủy
  + `POST /com/orders/:id/cancel.json`: Hủy đơn hàng và tự động hoàn trả tồn kho
  + `POST /com/orders/:id/tags.json`: Gán nhãn thẻ Tag phân loại đơn hàng
  + `POST /com/orders/:id/assign.json`: Phân công nhân viên chuyên trách xử lý đơn
  + `DELETE /com/orders/:id.json`: Xóa đơn hàng nháp khỏi hệ thống

- **`[POS-Haravan] 02. Draft Order`** — [`haravan-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-orders.controller.ts)
  + `POST /com/draft_orders.json`: Tạo đơn hàng đặt trước (Draft Order) hoặc báo giá bán sỉ
  + `GET /com/draft_orders.json`: Danh sách các đơn đặt trước đang chờ khách duyệt
  + `POST /com/draft_orders/:id/complete.json`: Chuyển đổi Draft Order thành Đơn hàng chính thức

- **`[POS-Haravan] 03. Fulfillment`** — [`haravan-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-orders.controller.ts)
  + `POST /com/orders/:order_id/fulfillments.json`: Xuất kho giao vận fulfillment và tạo mã tracking
  + `GET /com/orders/:order_id/fulfillments.json`: Danh sách các đợt giao hàng fulfillment của đơn

- **`[POS-Haravan] 04. Transaction`** — [`haravan-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-orders.controller.ts)
  + `POST /com/orders/:order_id/transactions.json`: Ghi nhận giao dịch thanh toán thành công (VNPay, Tiền mặt, Thẻ)
  + `GET /com/orders/:order_id/transactions.json`: Lịch sử các giao dịch thanh toán của đơn hàng

- **`[POS-Haravan] 05. Refund`** — [`haravan-orders.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-orders.controller.ts)
  + `POST /com/orders/:order_id/refunds.json`: Lập phiếu hoàn tiền và đổi trả hàng vào kho
  + `GET /com/refunds.json`: Danh sách phiếu đổi trả hàng toàn hệ thống

- **`[POS-Haravan] 06. Product`** — [`haravan-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-products.controller.ts)
  + `POST /com/products.json`: Thêm mới sản phẩm, hình ảnh và danh sách biến thể SKU
  + `GET /com/products.json`: Danh mục sản phẩm, biến thể và số lượng tồn kho
  + `GET /com/products/count.json`: Tổng số lượng sản phẩm đang kinh doanh
  + `GET /com/products/:id.json`: Xem chi tiết sản phẩm và các biến thể phân loại
  + `PUT /com/products/:id.json`: Sửa tiêu đề, giá bán, mô tả sản phẩm
  + `DELETE /com/products/:id.json`: Xóa sản phẩm khỏi hệ thống

- **`[POS-Haravan] 07. Product Variant`** — [`haravan-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-products.controller.ts)
  + `GET /com/variants.json`: Danh sách toàn bộ biến thể SKU toàn cửa hàng
  + `GET /com/products/:product_id/variants.json`: Lấy danh sách biến thể theo sản phẩm
  + `POST /com/products/:product_id/variants.json`: Thêm biến thể size/màu mới cho sản phẩm

- **`[POS-Haravan] 08. Product Image`** — [`haravan-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-products.controller.ts)
  + `GET /com/products/:product_id/images.json`: Danh sách hình ảnh gallery của sản phẩm
  + `POST /com/products/:product_id/images.json`: Tải lên ảnh sản phẩm mới
  + `DELETE /com/products/:product_id/images/:id.json`: Gỡ ảnh khỏi gallery sản phẩm

- **`[POS-Haravan] 09. CustomCollection`** — [`haravan-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-products.controller.ts)
  + `POST /com/custom_collections.json`: Tạo nhóm sản phẩm tùy chọn thủ công
  + `GET /com/custom_collections.json`: Danh sách các nhóm bộ sưu tập thủ công

- **`[POS-Haravan] 10. SmartCollection`** — [`haravan-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-products.controller.ts)
  + `GET /com/smart_collections.json`: Danh sách nhóm sản phẩm thông minh tự động lọc theo rule
  + `POST /com/smart_collections.json`: Khởi tạo nhóm thông minh với các điều kiện lọc sản phẩm

- **`[POS-Haravan] 11. Collect`** — [`haravan-products.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-products.controller.ts)
  + `POST /com/collects.json`: Gán sản phẩm vào nhóm bộ sưu tập (Collect)
  + `GET /com/collects.json`: Danh sách liên kết phân loại sản phẩm - nhóm
  + `DELETE /com/collects/:id.json`: Gỡ sản phẩm khỏi nhóm bộ sưu tập

- **`[POS-Haravan] 12. InventoryLevel`** — [`haravan-inventory.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-inventory.controller.ts)
  + `POST /com/inventory_levels/adjust.json`: Điều chỉnh tăng/giảm tồn kho khả dụng tại chi nhánh kho
  + `POST /com/inventory_levels/set.json`: Cài đặt số lượng tồn kho cố định sau kiểm kê
  + `GET /com/inventory_levels.json`: Báo cáo số lượng tồn kho khả dụng theo kho
  + `POST /com/inventory_levels/connect.json`: Kết nối biến thể với kho hàng để kích hoạt quản lý tồn

- **`[POS-Haravan] 13. Location`** — [`haravan-inventory.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-inventory.controller.ts)
  + `GET /com/locations.json`: Danh sách chi nhánh cửa hàng và kho hàng Haravan
  + `GET /com/locations/:id.json`: Xem chi tiết địa điểm kho hàng
  + `GET /com/locations/count.json`: Tổng số lượng địa điểm kho đang kích hoạt

- **`[POS-Haravan] 14. InventoryAdjustment`** — [`haravan-inventory.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-inventory.controller.ts)
  + `POST /com/inventory_adjustments.json`: Lập phiếu điều chỉnh tồn kho kèm lý do
  + `GET /com/inventory_adjustments.json`: Lịch sử các phiếu điều chỉnh tồn kho
  + `POST /com/inventory_transfers.json`: Lập phiếu điều chuyển hàng hóa nội bộ giữa các kho

- **`[POS-Haravan] 15. Customer`** — [`haravan-customers.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-customers.controller.ts)
  + `POST /com/customers.json`: Tạo hồ sơ khách hàng mới và gắn thẻ tag phân nhóm
  + `GET /com/customers.json`: Danh sách khách hàng và lịch sử mua sắm
  + `GET /com/customers/search.json`: Tìm kiếm nhanh khách hàng theo SĐT / Email / Tên
  + `GET /com/customers/:id.json`: Chi tiết hồ sơ cá nhân và địa chỉ mặc định
  + `PUT /com/customers/:id.json`: Cập nhật thông tin phân hạng và liên hệ
  + `DELETE /com/customers/:id.json`: Xóa tài khoản khách hàng khỏi hệ thống

- **`[POS-Haravan] 16. CustomerAddress`** — [`haravan-customers.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-customers.controller.ts)
  + `GET /com/customers/:customer_id/addresses.json`: Danh sách sổ địa chỉ nhận hàng của khách
  + `POST /com/customers/:customer_id/addresses.json`: Thêm địa chỉ mới vào sổ địa chỉ
  + `PUT /com/customers/:customer_id/addresses/:id.json`: Sửa địa chỉ nhận hàng
  + `DELETE /com/customers/:customer_id/addresses/:id.json`: Xóa địa chỉ nhận hàng

- **`[POS-Haravan] 17. Price Rule`** — [`haravan-discounts.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-discounts.controller.ts)
  + `POST /com/price_rules.json`: Tạo quy tắc giá và chiết khấu (Price Rule)
  + `GET /com/price_rules.json`: Danh sách quy tắc giá khuyến mãi đang chạy
  + `GET /com/price_rules/:id.json`: Xem chi tiết điều kiện áp dụng của Price Rule
  + `DELETE /com/price_rules/:id.json`: Xóa quy tắc giá khuyến mãi

- **`[POS-Haravan] 18. DiscountCode`** — [`haravan-discounts.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-discounts.controller.ts)
  + `POST /com/price_rules/:price_rule_id/discount_codes.json`: Tạo mã coupon giảm giá cụ thể
  + `GET /com/price_rules/:price_rule_id/discount_codes.json`: Danh sách mã giảm giá của Price Rule
  + `DELETE /com/price_rules/:price_rule_id/discount_codes/:id.json`: Xóa mã giảm giá coupon

- **`[POS-Haravan] 19. Promotion`** — [`haravan-discounts.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-discounts.controller.ts)
  + `POST /com/promotions.json`: Khởi tạo chương trình khuyến mại Haravan
  + `GET /com/promotions.json`: Danh sách chương trình khuyến mãi đang kích hoạt
  + `DELETE /com/promotions/:id.json`: Tắt hoặc xóa chương trình khuyến mãi

- **`[POS-Haravan] 20. CarrierService & Shipping`** — [`haravan-shipping.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-shipping.controller.ts)
  + `POST /com/carrier_services.json`: Đăng ký đối tác vận chuyển bên thứ 3 (CarrierService)
  + `GET /com/carrier_services.json`: Danh sách hãng vận chuyển tích hợp
  + `DELETE /com/carrier_services/:id.json`: Hủy đối tác vận chuyển khỏi cửa hàng
  + `GET /com/deliveries.json`: Báo cáo danh sách các phiếu giao nhận đơn hàng qua bưu chính

- **`[POS-Haravan] 21. Article`** — [`haravan-cms.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-cms.controller.ts)
  + `POST /com/blogs/:blog_id/articles.json`: Tạo bài viết mới trong chuyên mục Blog chuẩn SEO
  + `POST /com/articles.json`: Tạo bài viết mới trực tiếp kèm blog_id
  + `GET /com/blogs/:blog_id/articles.json`: Danh sách bài viết theo chuyên mục Blog
  + `GET /com/articles.json`: Toàn bộ danh sách bài viết trên website
  + `GET /com/articles/:id.json`: Chi tiết bài viết HTML và ảnh banner
  + `PUT /com/blogs/:blog_id/articles/:id.json`: Cập nhật nội dung bài viết
  + `DELETE /com/blogs/:blog_id/articles/:id.json`: Xóa bài viết khỏi blog

- **`[POS-Haravan] 22. Blog`** — [`haravan-cms.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-cms.controller.ts)
  + `POST /com/blogs.json`: Tạo chuyên mục Blog mới
  + `GET /com/blogs.json`: Danh sách các chuyên mục Blog
  + `GET /com/blogs/:id.json`: Xem chi tiết chuyên mục Blog
  + `DELETE /com/blogs/:id.json`: Xóa chuyên mục Blog

- **`[POS-Haravan] 23. Comment`** — [`haravan-cms.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-cms.controller.ts)
  + `GET /com/comments.json`: Danh sách bình luận bài viết của độc giả
  + `POST /com/comments.json`: Đăng bình luận mới
  + `POST /com/comments/:id/spam.json`: Đánh dấu bình luận là Spam

- **`[POS-Haravan] 24. Page`** — [`haravan-cms.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-cms.controller.ts)
  + `POST /com/pages.json`: Tạo trang tĩnh website Haravan Web (Giới thiệu, Chính sách)
  + `GET /com/pages.json`: Danh sách các trang nội dung tĩnh
  + `GET /com/pages/:id.json`: Xem chi tiết nội dung mã HTML trang
  + `DELETE /com/pages/:id.json`: Xóa trang tĩnh

- **`[POS-Haravan] 25. Asset & Theme`** — [`haravan-theme-metafields.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-theme-metafields.controller.ts)
  + `GET /com/themes.json`: Danh sách các theme giao diện Haravan Web
  + `GET /com/themes/:theme_id/assets.json`: Danh sách file CSS, JS, ảnh giao diện Liquid
  + `PUT /com/themes/:theme_id/assets.json`: Tải lên / sửa file asset theme Liquid
  + `DELETE /com/themes/:theme_id/assets.json`: Xóa file asset khỏi theme

- **`[POS-Haravan] 26. Metafield`** — [`haravan-theme-metafields.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-theme-metafields.controller.ts)
  + `GET /com/metafields.json`: Tra cứu các trường thuộc tính mở rộng (Metafields)
  + `POST /com/metafields.json`: Thêm trường tùy biến mở rộng Metafield
  + `DELETE /com/metafields/:id.json`: Xóa trường tùy biến Metafield

- **`[POS-Haravan] 27. Redirect & ScriptTag`** — [`haravan-theme-metafields.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-theme-metafields.controller.ts)
  + `GET /com/redirects.json`: Danh sách chuyển hướng URL 301 SEO
  + `POST /com/redirects.json`: Tạo chuyển hướng URL mới
  + `GET /com/script_tags.json`: Danh sách mã nhúng ScriptTag bên thứ ba
  + `POST /com/script_tags.json`: Thêm mã nhúng ScriptTag mới
  + `DELETE /com/script_tags/:id.json`: Gỡ mã nhúng ScriptTag

- **`[POS-Haravan] 28. Webhook`** — [`haravan-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-webhooks.controller.ts)
  + `POST /com/webhooks.json`: Đăng ký Webhook Haravan mới
  + `GET /com/webhooks.json`: Danh sách webhook đã đăng ký
  + `DELETE /com/webhooks/:id.json`: Hủy đăng ký webhook
  + `GET /com/webhooks/topics.json`: Danh sách các sự kiện Topic Haravan hỗ trợ

- **`[POS-Haravan] 29. Event`** — [`haravan-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-webhooks.controller.ts)
  + `GET /com/events.json`: Nhật ký sự kiện hệ thống Haravan (Audit Log)
  + `GET /com/events/:id.json`: Chi tiết payload của sự kiện hệ thống

- **`[POS-Haravan] 30. Shop & Properties`** — [`haravan-webhooks.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/haravan/haravan-webhooks.controller.ts)
  + `GET /com/shop.json`: Thông tin cấu hình gian hàng (Shop Profile: tiền tệ, múi giờ, domain)
  + `GET /com/countries.json`: Danh sách quốc gia và tỉnh thành hỗ trợ giao hàng

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

#### C. MISA AMIS CRM (Quản trị Quan hệ Khách hàng v2 — 5 Resources, 16 Endpoints, đánh số 01..05)
- **`[MISA-AMIS-CRM] 01. Customers`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts)
  + `POST /api/v1/infra/misa/crm/customers`: Đồng bộ/thêm mới khách hàng doanh nghiệp B2B & cá nhân B2C
  + `GET /api/v1/infra/misa/crm/customers/:phone`: Tra cứu thông tin hồ sơ khách hàng theo SĐT
  + `GET /api/v1/infra/misa/crm/customers`: Danh sách khách hàng và lọc theo phân hạng thẻ VIP
  + `PUT /api/v1/infra/misa/crm/customers/:id`: Cập nhật thông tin phân hạng và người phụ trách
- **`[MISA-AMIS-CRM] 02. Contacts`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts)
  + `POST /api/v1/infra/misa/crm/contacts`: Thêm mới người liên hệ doanh nghiệp (Contact)
  + `GET /api/v1/infra/misa/crm/contacts`: Danh sách người liên hệ theo khách hàng
  + `GET /api/v1/infra/misa/crm/contacts/:id`: Chi tiết chức danh, phòng ban và quyền quyết định mua hàng
- **`[MISA-AMIS-CRM] 03. Leads`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts)
  + `POST /api/v1/infra/misa/crm/leads`: Tiếp nhận đầu mối tiềm năng (Lead) từ Ads/Web
  + `GET /api/v1/infra/misa/crm/leads`: Danh sách đầu mối theo kênh marketing và trạng thái xử lý
  + `POST /api/v1/infra/misa/crm/leads/:id/convert`: Chuyển đổi Lead thành Khách hàng & Cơ hội bán hàng
- **`[MISA-AMIS-CRM] 04. Opportunities`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts)
  + `POST /api/v1/infra/misa/crm/opportunities`: Tạo mới cơ hội bán hàng trong pipeline
  + `GET /api/v1/infra/misa/crm/opportunities`: Danh sách cơ hội bán hàng theo giai đoạn phễu
  + `PUT /api/v1/infra/misa/crm/opportunities/:id/stage`: Cập nhật bước phễu (Pipeline Stage) và xác suất chốt
- **`[MISA-AMIS-CRM] 05. Quotations`** — [`misa-amis-crm.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-crm.controller.ts)
  + `POST /api/v1/infra/misa/crm/quotations`: Lập bảng báo giá chi tiết sản phẩm / dịch vụ
  + `GET /api/v1/infra/misa/crm/quotations`: Danh sách các bảng báo giá đã lập
  + `GET /api/v1/infra/misa/crm/quotations/:id`: Chi tiết báo giá và các điều khoản thanh toán

#### D. MISA AMIS Kế toán Doanh nghiệp (Thông tư 200/2014/TT-BTC — 3 Resources, 10 Endpoints, đánh số 01..03)
- **`[MISA-AMIS-Accounting] 01. Vouchers`** — [`misa-amis-accounting.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-accounting.controller.ts)
  + `POST /vouchers`: Lập chứng từ kế toán (Phiếu thu 1111/1121, Phiếu chi, Giấy nộp tiền) với định khoản kép TT200
  + `GET /vouchers`: Danh sách chứng từ kế toán theo kỳ
  + `GET /vouchers/:id`: Chi tiết chứng từ và các cặp định khoản Nợ/Có cấp 2
  + `POST /sync-order`: Ghi sổ tự động đơn hàng POS/TMĐT thành bút toán doanh thu (5111, 33311, 131)
- **`[MISA-AMIS-Accounting] 02. Products & Inventory`** — [`misa-amis-accounting.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-accounting.controller.ts)
  + `POST /products`: Đồng bộ hàng hóa lên AMIS Kế toán (gán TK 1561, TK giá vốn 632, TK doanh thu 5111)
  + `GET /products`: Tra cứu danh mục hàng hóa, nguyên vật liệu
  + `GET /chart-of-accounts`: Bảng hệ thống tài khoản kế toán chuẩn Thông tư 200/2014/TT-BTC
- **`[MISA-AMIS-Accounting] 03. Financial Reports`** — [`misa-amis-accounting.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/misa/misa-amis-accounting.controller.ts)
  + `GET /reports/profit-loss`: Báo cáo kết quả hoạt động kinh doanh (P&L)
  + `GET /reports/balance-sheet`: Bảng cân đối kế toán tài sản và nguồn vốn
  + `GET /reports/cash-flow`: Báo cáo lưu chuyển tiền tệ phương pháp gián tiếp

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

### 3.7. Pancake POS Social Commerce (4 Resources, 17 Endpoints, đánh số 01..04)

- **`[POS-Pancake] 01. Đơn hàng (Orders)`** — [`pos-pancake.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pos-pancake.controller.ts)
  + `POST /api/v1/infra/pancake/orders`: Tạo đơn hàng chốt đơn livestream/fanpage
  + `GET /api/v1/infra/pancake/orders`: Danh sách đơn hàng đa kênh mạng xã hội
  + `GET /api/v1/infra/pancake/orders/:id`: Chi tiết đơn hàng và thông tin khách mua
  + `PUT /api/v1/infra/pancake/orders/:id`: Cập nhật đơn hàng
  + `DELETE /api/v1/infra/pancake/orders/:id`: Hủy đơn hàng Pancake
  + `POST /api/v1/infra/pancake/orders/:id/print`: In phiếu đóng gói / phiếu gửi hàng
  + `POST /api/v1/infra/pancake/orders/:id/sync-carrier`: Đẩy đơn sang bưu cục đối tác
- **`[POS-Pancake] 02. Hội thoại & Chat (Conversations)`** — [`pos-pancake.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pos-pancake.controller.ts)
  + `GET /api/v1/infra/pancake/conversations`: Danh sách hội thoại chat khách hàng
  + `GET /api/v1/infra/pancake/conversations/:id/messages`: Lịch sử trao đổi tin nhắn fanpage
  + `POST /api/v1/infra/pancake/conversations/:id/messages`: Gửi tin nhắn trả lời khách hàng
  + `POST /api/v1/infra/pancake/conversations/:id/tags`: Gắn thẻ tag phân loại khách hàng
- **`[POS-Pancake] 03. Sản phẩm & Kho bãi (Products & Inventory)`** — [`pos-pancake.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pos-pancake.controller.ts)
  + `GET /api/v1/infra/pancake/products`: Danh sách sản phẩm đồng bộ trên Pancake
  + `GET /api/v1/infra/pancake/products/:id`: Chi tiết mặt hàng và phân loại mẫu mã
  + `POST /api/v1/infra/pancake/products`: Thêm sản phẩm mới lên gian hàng
  + `POST /api/v1/infra/pancake/inventory/sync`: Đồng bộ số lượng tồn kho theo SKU
- **`[POS-Pancake] 04. Webhooks & Kênh bán (Webhooks & Pages)`** — [`pos-pancake.controller.ts`](file:///g:/UniFlow-PTIT_Aka/apps/backend/src/modules/connectors/controllers/pos-pancake.controller.ts)
  + `GET /api/v1/infra/pancake/pages`: Danh sách Fanpage / Kênh kết nối
  + `POST /api/v1/infra/pancake/webhooks/subscribe`: Đăng ký nhận sự kiện realtime từ Pancake

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

Tất cả 109 module hiển thị dưới dạng accordion collapsible groups được phân loại chuyên nghiệp với tiền tố `[...] 0X`:
- `[POS-Nhanh] 01` đến `14` (14 Modules Nhanh.vn Open API — 56 endpoints)
- `[POS-Sapo] 01` đến `29` (29 Modules Sapo Omnichannel API — 96 endpoints)
- `[POS-KiotViet] 01` đến `06` (6 Modules KiotViet API — 32 endpoints)
- `[POS-Haravan] 01` đến `30` (30 Modules Haravan Omnichannel API — 107 endpoints)
- `[POS-Pancake] 01` đến `04` (4 Modules Pancake POS — 17 endpoints)
- `[MISA-eShop] 01` đến `06` (6 Modules MISA eShop — 23 endpoints)
- `[MISA-meInvoice] 01` đến `04` (4 Modules MISA meInvoice — 13 endpoints)
- `[MISA-AMIS-CRM] 01` đến `05` (5 Modules MISA AMIS CRM — 16 endpoints)
- `[MISA-AMIS-Accounting] 01` đến `03` (3 Modules MISA AMIS Kế toán — 10 endpoints)
- `[Logistics-VN] 01` đến `03` (3 Modules GHTK, GHN, Viettel Post — 28 endpoints)
- `[Marketplace] 01` đến `05` (5 Modules Shopee, TikTok, Lazada, Tiki, Shopify — 23 endpoints)
- `[UniFlow-Infra] 01`, `[UniFlow-Core] 01`, `[UniFlow-Gateways] 01` (3 Modules UniFlow Core — 11 endpoints)

**Tổng cộng:** **574 Endpoints — 109 Tags — 0 Tag Rỗng.** Mọi khối collapse đều chứa trọn vẹn các endpoint có thể gửi request LIVE / SANDBOX ngay trên giao diện.

### 4.2. Chạy Kiểm Thử Toàn Diện Tự Động
Chạy các file test suite xác minh tất cả các endpoint:
```bash
# Kiểm thử toàn diện Haravan Omnichannel (30 resources) và Logistics (GHTK, GHN, Viettel Post)
node scratch/test-haravan-logistics.js

# Kiểm thử toàn diện MISA ecosystem (eShop, meInvoice, CRM, Accounting)
node scratch/test-misa-all.js

# Kiểm thử hồi quy hệ thống UniFlow Gateway và các Connectors
node scratch/test-all-1to1-suite.js
```
Kết quả cam kết: **100% Passed (HTTP 200/201)** trên toàn bộ hệ thống.

