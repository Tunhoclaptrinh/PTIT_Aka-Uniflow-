# SAPO API — BẢNG CHI TIẾT TOÀN BỘ CÁC THUỘC TÍNH CỦA ORDER (ĐƠN HÀNG)

Nguồn: https://support.sapo.vn/cac-thuoc-tinh-cua-order-api

## 1. Mô tả tổng quan

Địa chỉ thanh toán. Địa chỉ này là một trường tùy chọn, có thể không có trong Order. Các thuộc tính:

Địa chỉ IP thực hiện đặt hàng.

Xác định người mua hàng có muốn nhận các email marketing từ Shop hay không. Giá trị hợp lệ là "true" hoặc "false."

Lý do Order bị hủy. Nếu Order không bị hủy, trường này có giá trị "null". Nếu Order bị hủy, giá trị của trường này có thể là:

Thời gian Order bị hủy. Nếu Order bị hủy, API trả về kết quả theo định dạng chuẩn ISO 8601. Nếu Order không bị hủy, giá trị sẽ là "null".

Chuỗi token duy nhất định danh cho một cart ứng với một Order xác định.

Một đối tượng chứa thông tin về client:

Thời gian Order được lưu trữ. API trả về kết quả theo định dạng chuẩn ISO 8601. Nếu Order không được lưu trữ, giá trị của trường này là null.

Thời gian Order được tạo. API trả về kết quả theo định dạng chuẩn ISO 8601. Thuộc tính này được tạo tự động và không thể chỉnh sửa. Nếu bạn import Order từ một hệ thống khác vào Sapo thì hãy sử dụng thuộc tính có thể ghi processed_on để xác định thời gian Order được xử lý.

Mã tiền tệ được sử dụng trong thanh toán (ISO 4217).

Một đối tượng chứa thông tin của Customer. Lưu ý rằng Order có thể không có Customer và người mua không nên phụ thuộc vào một đối tượng Customer có sẵn. Đối tượng này có thể null

Mã Discount được áp dụng cho Order. Nếu không có mã Discount thì trường này giá trị rỗng.

Địa chỉ Email của Customer. Trường này phải có khi Order có địa chỉ thanh toán.

Tags là các thẻ mô tả ngắn, thường được sử dụng cho mục đích lọc và tìm kiếm, được định dạng như một xâu ký tự cách nhau bởi dấu phẩy. Ví dụ: tag1, tag2, tag3. Mỗi một tag giới hạn 40 ký tự.

Số duy nhất định danh Order. Id này được dùng cho API. Giá trị này khác với thuộc tính order_number (xem bên dưới), cũng là một số duy nhất để định danh Order nhưng mục đích sử dụng là dành cho chủ Shop và Customer.

## 2. Toàn bộ Snippets JSON Thuộc tính

```json
billing_address
```

```json
{ "address1" : "123 Amoebobacterieae St" }
```

```json
{ "address2" : "" }
```

```json
{ "city" : "Ottawa" }
```

```json
{ "company" : "null" }
```

```json
{ "country" : "US" }
```

```json
{ "first_name" : "null" }
```

```json
{ "id" : 207119551 }
```

```json
{ "last_name" : "null" }
```

```json
{ "phone" : "(555)555-5555" }
```

```json
{ "province" : "KY" }
```

```json
{ "zip" : "40202" }
```

```json
{ "name" : "null" }
```

```json
{ "province_code" : "null" }
```

```json
{ "country_code" : "null" }
```

```json
{ "default" : true }
```

```json
browser_ip
```

```json
{ "browser_ip" : "null" }
```

```json
buyer_accepts_marketing
```

```json
{ "buyer_accepts_marketing" : false }
```

```json
cancel_reason
```

```json
{ "cancel_reason" : "null" }
```

```json
cancelled_on
```

```json
{ "cancelled_on" : "null" }
```

```json
cart_token
```

```json
{ "cart_token" : "68778783ad298f1c80c3bafcddeea" }
```

```json
client_details
```

```json
{ "accept_language" : "null" }
```

```json
{ "browser_height" : "null" }
```

```json
{ "browser_ip" : "0.0.0.0" }
```

```json
{ "browser_width" : "null" }
```

```json
{ "session_hash" : "null" }
```

```json
{ "user_agent" : "null" }
```

```json
closed_on
```

```json
{ "closed_on" : "null" }
```

```json
created_on
```

```json
{ "created_on" : "2008-01-10T11:00:00Z" }
```

```json
currency
```

```json
{ "currency" : "USD" }
```

```json
customer
```

```json
{ "accepts_marketing" : false }
```

```json
{ "created_on" : "2012-03-13T16:09:55Z" }
```

```json
{ "email" : "[email&#160;protected]" }
```

```json
{ "first_name" : "Bob" }
```

```json
{ "id" : 207119551 }
```

```json
{ "last_name" : "Norman" }
```

```json
{ "note" : "null" }
```

```json
{ "last_name" : "null" }
```

```json
{ "orders_count" : "0" }
```

```json
{ "state" : "null" }
```

```json
{ "total_spent" : "0.00" }
```

```json
{ "modified_on" : "2012-03-13T16:09:55Z" }
```

```json
{ "tags" : "tagcity" }
```

```json
discount_codes
```

```json
{ "discount_codes" : "[]" }
```

```json
{ "email" : "[email&#160;protected]" }
```

```json
financial_status
```

```json
{ "financial_status" : "authorized" }
```

```json
status
```

```json
{ "status" : "open" }
```

```json
fulfillments
```

```json
{ "created_on" : "2012-03-13T16:09:54Z" }
```

```json
{ "id" : 255858046 }
```

```json
{ "order_id" : 450789469 }
```

```json
{ "status" : "failure" }
```

```json
{ "tracking_company" : "null" }
```

```json
{ "tracking_number" : "1Z2345" }
```

```json
{ "modified_on" : "2012-05-01T14:22:25Z" }
```

```json
fulfillment_status
```

```json
{ "fulfillment_status" : "null" }
```

```json
{ "tags" : "tagsational" }
```

```json
{ "id" : 450789469 }
```

```json
landing_site
```

```json
{ "landing_site" : "http://www.example.com?source=abc" }
```

```json
line_items
```

```json
{ "fulfillable_quantity" : 1 }
```

```json
{ "fulfillment_service" : "amazon" }
```

```json
{ "fulfillment_status" : "fulfilled" }
```

```json
{ "grams" : 500 }
```

```json
{ "id" : 669751112 }
```

```json
{ "price" : "199.99" }
```

```json
{ "product_id" : 7513594 }
```

```json
{ "quantity" : 1 }
```

```json
{ "requires_shipping" : true }
```

```json
{ "sku" : "IPOD-342-N" }
```

```json
{ "title" : "IPod Nano" }
```

```json
{ "variant_id" : 4264112 }
```

```json
{ "variant_title" : "Pink" }
```

```json
{ "vendor" : "Apple" }
```

```json
{ "name" : "IPod Nano - Pink" }
```

```json
{ "gift_card" : false }
```

```json
{ "taxable" : true }
```

```json
{ "tax_lines" : "[]" }
```

```json
{ "total_discount" : "5.00" }
```

```json
{ "name" : "#1001" }
```

```json
{ "note" : "null" }
```

```json
note_attributes
```

```json
{ "note_attributes" : [{ "name" : "custom name" ,  "value" : "custom value" }] }
```

```json
number
```

```json
{ "number" : "1" }
```

```json
order_number
```

```json
{ "order_number" : 1001 }
```

```json
payment_gateway_names
```

```json
{ "payment_gateway_names" : ["authorize_net", "Cash on Delivery (COD)"] }
```

```json
processed_on
```

```json
{ "processed_on" : "2008-01-10T11:00:00Z" }
```

```json
processing_method
```

```json
{ "processing_method" : "direct" }
```

```json
referring_site
```

```json
{ "referring_site" : "http://www.anexample.com" }
```

```json
refunds
```

```json
shipping_address
```

```json
{ "address1" : "123 Amoebobacterieae St" }
```

```json
{ "address2" : "" }
```

```json
{ "city" : "Ottawa" }
```

```json
{ "company" : "null" }
```

```json
{ "country" : "Canada" }
```

```json
{ "first_name" : "Bob" }
```

```json
{ "last_name" : "Bobsen" }
```

```json
{ "latitude" : "45.41634" }
```

```json
{ "longitude" : "-75.6868" }
```

```json
{ "phone" : "555-625-1199" }
```

```json
{ "province" : "Ontario" }
```

```json
{ "zip" : "K2P0V6" }
```

```json
{ "name" : "Bob Bobsen" }
```

```json
{ "country_code" : "CA" }
```

```json
{ "province_code" : "ON" }
```

```json
shipping_lines
```

```json
{ "code" : "Free Shipping" }
```

```json
{ "price" : 0.0 }
```

```json
{ "source" : "bizweb" }
```

```json
{ "title" : "Free Shipping" }
```

```json
{ "tax_lines" : "[]" }
```

```json
source_name
```

```json
{ "source_name" : "web" }
```

```json
subtotal_price
```

```json
{ "subtotal_price" : 398.0 }
```

```json
{ "token" : "b1946ac92492d2347c6235b4d2611184" }
```

```json
total_discounts
```

```json
{ "total_discounts" : "0.00" }
```

```json
total_line_items_price
```

```json
{ "total_line_items_price" : "398.00" }
```

```json
total_price
```

```json
{ "total_price" : "409.94" }
```

```json
total_weight
```

```json
{ "total_weight" : 300 }
```

```json
modified_on
```

```json
{ "modified_on" : "2012-08-24T14:02:15Z" }
```

