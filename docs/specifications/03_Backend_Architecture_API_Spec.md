# **UNIFLOW AI — ĐẶC TẢ KIẾN TRÚC BACKEND & API GATEWAY (BACKEND & API SPEC)**

> **Tài liệu thuộc Phân hệ Kỹ thuật:** Đặc tả chi tiết đường ống xử lý Backend (Pipeline), bộ tiếp nhận Webhook (Inbound Receivers), bộ chuyển đổi Outbound Connectors, cơ chế xác thực HMAC, bộ đệm phân tán và tài liệu API RESTful/WebSocket.

---

## **PHẦN I: ĐƯỜNG ỐNG XỬ LÝ SỰ KIỆN BACKEND (INBOUND PIPELINE)**

Mỗi Webhook từ sàn TMĐT gửi đến được xử lý qua 5 chặng nghiêm ngặt nhằm đảm bảo thời gian phản hồi **$< 0.5\text{s}$**:

```
[Inbound Webhook từ TikTok / Shopee]
                │
                ▼
  ┌─────────────────────────────┐
  │ 1. API GATEWAY & HMAC CHECK │ ──> Sai chữ ký? ──> Trả 401 Unauthorized (< 10ms)
  └─────────────┬───────────────┘
                ▼
  ┌─────────────────────────────┐
  │ 2. IDEMPOTENCY KEY FILTER   │ ──> Đã xử lý trong 24h? ──> Trả 200 OK ngay (Bỏ qua)
  └─────────────┬───────────────┘
                ▼
  ┌─────────────────────────────┐
  │ 3. UDM NORMALIZATION ENGINE │ ──> Chuyển đổi JSON sàn sang Universal Order Model
  └─────────────┬───────────────┘
                ▼
  ┌─────────────────────────────┐
  │ 4. AI LOGIC & AGENT ROUTING │ ──> Khớp SKU, So sánh cước, Kiểm tra tồn kho
  └─────────────┬───────────────┘
                ▼
  ┌─────────────────────────────┐
  │ 5. ASYNC OUTBOUND ADAPTERS  │ ──> Bắn API trừ kho POS & Tạo đơn vận chuyển
  └─────────────────────────────┘
```

---

## **PHẦN II: XÁC THỰC BẢO MẬT & CHỮ KÝ SỐ (HMAC SECURITY)**

### **1. Thuật toán xác thực Webhook TikTok Shop**
* TikTok gửi kèm header `Authorization: SHA256=<signature>` hoặc `X-Tts-Signature`.
* Backend tính toán chữ ký đối chiếu:
$$\text{CalculatedSig} = \text{HMAC-SHA256}(\text{RawRequestBody}, \text{AppSecret})$$
* Nếu khớp $\rightarrow$ Chuyển tiếp vào Message Queue; Nếu không $\rightarrow$ Hủy request.

### **2. Thuật toán ký API Shopee Open Platform**
* Mỗi truy vấn outbound gửi tới Shopee bắt buộc tính toán:
$$\text{BaseString} = \text{partner\_id} + \text{api\_path} + \text{timestamp} + \text{access\_token} + \text{shop\_id}$$
$$\text{Sign} = \text{HMAC-SHA256}(\text{BaseString}, \text{partner\_key})$$
* Request URL mẫu:
  `https://partner.shopeemobile.com/api/v2/order/get_order_detail?partner_id=123&timestamp=1723891000&sign=abcdef...`

---

## **PHẦN III: THIẾT KẾ BỘ TIẾP NHẬN WEBHOOK (INBOUND HANDLERS)**

### **1. Endpoint Tiếp nhận Webhook TikTok Shop**
* **Route:** `POST /api/v1/webhooks/tiktok/:tenant_id`
* **Xử lý các sự kiện chính:**
  * `ORDER_STATUS_CHANGE`: Đơn hàng chuyển sang trạng thái đã thanh toán / chờ giao.
  * `REVERSE_STATUS_UPDATE`: Khách gửi yêu cầu đổi trả hàng / hoàn tiền.
  * `PACKAGE_UPDATE`: Bưu kiện đã được bàn giao cho bưu tá.

```typescript
@Post('webhooks/tiktok/:tenantId')
async handleTikTokWebhook(
  @Param('tenantId') tenantId: string,
  @Headers('authorization') signature: string,
  @Req() req: RawBodyRequest<Request>,
  @Body() payload: TikTokWebhookPayload
): Promise<{ code: number; message: string }> {
  // 1. Xác minh HMAC Signature
  const isValid = this.securityService.verifyTikTokHmac(req.rawBody, signature);
  if (!isValid) throw new UnauthorizedException('Invalid Signature');

  // 2. Chống lặp (Idempotency Check)
  const isDuplicate = await this.redisService.checkAndSetIdempotency(
    tenantId, 'TIKTOK', payload.data.order_id, payload.event_type
  );
  if (isDuplicate) return { code: 0, message: 'Duplicate Ignored' };

  // 3. Đẩy vào BullMQ / Redis Queue để xử lý bất đồng bộ
  await this.queueService.pushWebhookJob({
    tenantId,
    platform: 'TIKTOK',
    eventType: payload.event_type,
    payload: payload.data,
    timestamp: Date.now(),
  });

  // 4. Trả HTTP 200 ngay lập tức trong vòng < 0.1s
  return { code: 0, message: 'SUCCESS' };
}
```

### **2. Endpoint Tiếp nhận Webhook Shopee (2-Step Retrieval)**
* **Route:** `POST /api/v1/webhooks/shopee/:tenant_id`
* Do thông điệp Push của Shopee không chứa chi tiết giỏ hàng, Worker sẽ nhận `ordersn` và gọi ngay `v2.order.get_order_detail` từ Shopee Open API để hoàn thiện dữ liệu UDM.

---

## **PHẦN IV: BỘ CHUYỂN ĐỔI KẾT NỐI ĐẦU RA (OUTBOUND ADAPTERS)**

Hệ thống triển khai theo mô hình **Adapter Design Pattern** với interface chuẩn `IOutboundConnector`:

```typescript
export interface IOutboundConnector {
  syncInventory(masterSku: string, deltaQty: number): Promise<SyncResult>;
  createShipment(order: UniversalOrder): Promise<ShipmentResult>;
  cancelOrder(sourceOrderId: string, reason: string): Promise<CancelResult>;
}
```

### **1. Adapter POS (Sapo & KiotViet):**
* Chuyển đổi lệnh trừ kho từ UDM sang API cập nhật tồn kho:
  * Sapo API: `POST /admin/variants/{variant_id}/inventory_adjustments.json`
  * KiotViet API: `POST /products/inventories`

### **2. Adapter Logistics (GHTK & GHN):**
* **GHTK Adapter:** `POST /services/shipment/order`
  * Tự động gửi thông tin bưu kiện, tiền thu hộ COD, địa chỉ giao nhận.
  * Nhận về mã vận đơn (*Waybill Code* / Mã tem bưu chính).
* **GHN Adapter:** `POST /shiip/public-api/v2/shipping-order/create`
  * Lấy `order_code` và liên kết trực tiếp vào chi tiết đơn hàng UniFlow.

---

## **PHẦN V: TỔNG QUAN TÀI LIỆU API RESTFUL (OPENAPI 3.0 SUMMARY)**

```
BASE URL: https://api.uniflow.ai/api/v1
```

| Nhóm chức năng | Method | Endpoint URL | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| **Xác thực** | `POST` | `/auth/login` | Đăng nhập tài khoản, nhận JWT token |
| **Xác thực** | `POST` | `/auth/refresh-token` | Làm mới JWT token |
| **Kết nối Sàn** | `GET` | `/connectors` | Lấy danh sách tài khoản sàn đã liên kết |
| **Kết nối Sàn** | `POST` | `/connectors/oauth/authorize` | Khởi tạo luồng OAuth 2.0 (Shopee/TikTok) |
| **Luồng Tự động** | `GET` | `/workflows` | Lấy danh sách các luồng đã tạo |
| **Luồng Tự động** | `POST` | `/workflows` | Tạo mới hoặc cập nhật Canvas Flow |
| **Luồng Tự động** | `POST` | `/workflows/prompt-generate` | Sinh Workflow tự động từ Prompt tiếng Việt |
| **Khớp mã SKU** | `GET` | `/sku-mappings` | Lấy danh sách ánh xạ SKU kèm điểm tin cậy AI |
| **Khớp mã SKU** | `PATCH`| `/sku-mappings/:id/approve` | Phê duyệt 1-click liên kết SKU |
| **Nhật ký & Log** | `GET` | `/logs/events` | Lấy lịch sử sự kiện đồng bộ và tự sửa lỗi |
| **Realtime Stream** | `WSS` | `/ws/live-events` | Kênh WebSocket truyền trực tiếp dòng dữ liệu |

---

## **PHẦN VI: CƠ CHẾ CHỊU LỖI, RETRY & DEAD-LETTER QUEUE (RESILIENCE)**

1. **Exponential Backoff Retry:** Khi gọi API bên thứ ba bị Timeout hoặc gặp HTTP 500, Worker tự động thử lại 5 lần theo chu kỳ: $1\text{s} \rightarrow 2\text{s} \rightarrow 4\text{s} \rightarrow 8\text{s} \rightarrow 16\text{s}$.
2. **Dead-Letter Queue (DLQ):** Sau 5 lần retry bất thành, đơn hàng được đưa vào DLQ (`queue:dead_letter`), kích hoạt AI Error-Healing phân tích nguyên nhân và phát thông báo khẩn cấp đến Dashboard/Zalo của quản trị viên.
3. **Circuit Breaker:** Nếu tỷ lệ lỗi của một kênh đối tác (VD: GHN) vượt quá $50\%$ trong vòng 2 phút, hệ thống tự động tạm ngắt và chuyển tiếp toàn bộ lưu lượng sang đơn vị dự phòng (VD: GHTK) mà không cần can thiệp thủ công.
