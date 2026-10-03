# **UNIFLOW AI — AI PROMPT TEMPLATES DÀNH CHO CODE GENERATION & ADAPTER CREATION**

> **Mục tiêu:** Cung cấp bộ Prompt mẫu đã được hiệu chuẩn (calibrated) kỹ thuật. Đỗ Minh hoặc Tuấn chỉ cần copy-paste prompt này kèm theo OpenAPI Spec đã chuẩn hóa để AI sinh mã nguồn TypeScript / NestJS Connector hoàn chỉnh 100%, không bị hallucinate hay thiếu sót logic.

---

## **PROMPT 1: SINH MÃ NGUỒN INBOUND WEBHOOK CONTROLLER & NORMALIZER (TỪ SÀN $\rightarrow$ UDM)**

```markdown
Bạn là Kỹ sư Trưởng Hệ thống Tích hợp (Staff Integration Engineer) tại UniFlow AI.
Nhiệm vụ của bạn là viết một NestJS Controller và Service hoàn chỉnh để tiếp nhận Inbound Webhook từ sàn thương mại điện tử và chuẩn hóa về Universal Data Model (UDM) của UniFlow.

### 1. Bối cảnh & Quy chuẩn kỹ thuật:
- Framework: NestJS (TypeScript, strict mode).
- Tốc độ xử lý: Webhook Receiver phải trả về HTTP 200 trong vòng < 0.2s.
- Bảo mật: Bắt buộc xác minh chữ ký HMAC-SHA256 trên rawBody trước khi xử lý. Nếu sai chữ ký -> Trả 401 Unauthorized ngay.
- Chống trùng lặp (Idempotency): Sử dụng RedisService để kiểm tra idempotency key TTL 24h. Nếu trùng lặp -> Trả HTTP 200 bỏ qua.
- Hàng đợi (Queue): Sau khi validate, đẩy payload vào BullMQ ('webhooks-queue') để worker xử lý bất đồng bộ.
- Chuẩn hóa: Viết hàm Normalizer ánh xạ từ payload sàn sang UniversalOrderModel (theo @uniflow/udm-schema).

### 2. Thông số API sàn:
- Nền tảng: {{PLATFORM_NAME}} (VD: TIKTOK_SHOP hoặc SHOPEE)
- Header chữ ký: {{SIGNATURE_HEADER_NAME}} (VD: authorization hoặc x-tts-signature)
- Công thức ký: {{SIGNATURE_FORMULA}} (VD: HMAC-SHA256(rawBody, appSecret))
- Payload mẫu & Trường ánh xạ:
{{PASTE_OPENAPI_SPEC_OR_SAMPLE_PAYLOAD_HERE}}

### 3. Yêu cầu đầu ra:
1. File Controller: `{{platform}}.webhook.controller.ts` với đầy đủ decorators (@Controller, @Post, @Headers, @Req).
2. File Service / Normalizer: `{{platform}}.normalizer.service.ts` thực hiện mapping trường chính xác vào `UniversalOrderModel`.
3. Enum status mapping chính xác (VD: AWAITING_SHIPMENT -> OrderStatus.PAID).
4. Viết code sạch, kèm Unit Test cơ bản bằng Jest.
```

---

## **PROMPT 2: SINH MÃ NGUỒN OUTBOUND CONNECTOR (TỪ UDM $\rightarrow$ POS / LOGISTICS / ERP)**

```markdown
Bạn là Kỹ sư Trưởng Hệ thống Tích hợp tại UniFlow AI.
Nhiệm vụ của bạn là viết một Outbound Adapter trong NestJS để nhận Universal Data Model (UDM) từ UniFlow và thực hiện gọi API sang nền tảng đối tác (POS: KiotViet/Sapo hoặc Vận chuyển: GHN/GHTK).

### 1. Quy chuẩn kỹ thuật:
- Sử dụng Axios / HttpService có cấu hình Timeout 4000ms.
- Tự động lấy và làm mới Access Token (OAuth2 Client Credentials hoặc Refresh Token).
- Xử lý Rate Limit (HTTP 429) với Exponential Backoff retry (tối đa 3 lần).
- Chuẩn hóa tham số địa chỉ hành chính (Tỉnh/Thành, Quận/Huyện, Phường/Xã) sang mã ID của đối tác (nếu là GHN/GHTK).

### 2. Thông số API Đích:
- Nền tảng: {{TARGET_PLATFORM}} (VD: GHN hoặc KIOTVIET)
- Endpoint: {{TARGET_ENDPOINT}} (VD: /shiip/public-api/v2/shipping-order/create)
- Chuẩn xác thực: {{AUTH_TYPE}} (VD: Header 'Token' hoặc Bearer JWT)
- Input UDM: {{UDM_ORDER_MODEL}}

### 3. Yêu cầu đầu ra:
1. Class `{{Platform}}OutboundAdapter` kế thừa hoặc implements interface `IOutboundConnector`.
2. Hàm `syncOrder(order: UniversalOrderModel): Promise<OutboundSyncResult>`.
3. Hàm xử lý bắt lỗi chi tiết (HTTP 400 Bad Request, HTTP 401 Re-auth, HTTP 500 Retry).
```

---

## **PROMPT 3: SINH MÃ NGUỒN MOCK SIMULATOR ENDPOINT (DÀNH CHO ĐỖ MINH & KIM TEST)**

```markdown
Bạn là QA Automation & Mock Engineer tại UniFlow AI.
Nhiệm vụ của bạn là tạo một Mock Endpoint bằng Express/NestJS mô phỏng chính xác hành vi của API sàn {{PLATFORM_NAME}} dựa trên tài liệu sau:

### Tài liệu API:
{{PASTE_OPENAPI_SPEC}}

### Yêu cầu chức năng của Mock Server:
1. Mô phỏng đúng cấu trúc JSON response thật (cả trường hợp success và error codes).
2. Có độ trễ ngẫu nhiên thực tế (Latency jitter từ 50ms - 250ms).
3. Hỗ trợ 1 API trigger: `POST /simulator/fire-webhook` cho phép gửi Webhook đã ký HMAC-SHA256 hợp lệ vào API Gateway của UniFlow để Đỗ Minh chạy test end-to-end.
```
