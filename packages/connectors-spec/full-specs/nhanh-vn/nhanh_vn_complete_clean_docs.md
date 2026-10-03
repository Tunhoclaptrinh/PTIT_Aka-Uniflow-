# NHANH.VN OPEN API v3 — TÀI LIỆU TOÀN DIỆN (152 TRANG GỐC CHUẨN MARKDOWN DÀNH CHO AI)

> Tải về tự động bởi UniFlow AI Crawler lúc 2026-10-03T03:34:53.619Z
> Nguồn: https://apidocs.nhanh.vn/llms-full.txt (Từ ngày 23/09/2026 chuyển sang https://developers.nhanh.group)
> Tổng số trang: 152/152 trang

> This is part 1 of 2 of the full documentation (pages 1–100 of 152).
> The content is paginated: fetch every part to see all of it.
> Next part: https://apidocs.nhanh.vn/llms-full.txt/1
> Page index: https://apidocs.nhanh.vn/llms.txt

# Giới thiệu

{% hint style="warning" %}
Chú ý: Từ ngày 23/09/2026, API docs chuyển sang tên miền mới: [https://developers.nhanh.group](https://developers.nhanh.group/)
{% endhint %}

## Giới thiệu Nhanh.vn

* Các sản phẩm và dịch vụ chính:
  * [Phần mềm quản lý bán hàng](https://nhanh.vn): Quản lý sản phẩm, kho hàng, đơn hàng, bán lẻ, bán sỉ, sàn thương mại điện tử, khách hàng, khuyến mại, kế toán, công nợ, báo cáo.
  * [Phần mềm quản lý chat đa kênh](https://chat.nhanh.vn): Quản lý chat từ Facebook, Messenger, Instagram, Zalo OA, Zalo cá nhân, Shopee, Lazada, TikTok Shop, TikTok Business, Threads.
  * [Thiết kế website bán hàng](https://nhanh.vn/gioi-thieu-tinh-nang-website): Tạo website bán hàng chuẩn SEO, tăng tốc bán hàng.
  * [Dịch vụ vận chuyển](https://nhanh.vn/dich-vu-van-chuyen): Kết nối hơn 15 hãng vận chuyển lớn nhất, nhiều ưu đãi vận chuyển.
  * Dịch vụ marketing: Xây dựng và chăm sóc gian hàng trên các sàn thương mại điện tử, chạy quảng cáo (Facebook, Google, Tiktok), SEO, Backlink, SMS brandname, Zalo OA, Zalo ZNS.

## Giới thiệu Open API

* Nhanh Open API cung cấp các giải pháp để đồng bộ dữ liệu sản phẩm, đơn hàng online, hóa đơn bán lẻ, bán sỉ, khách hàng, tồn kho, lịch sử chat đa kênh, báo cáo CAPI, gửi tin Zalo ZBS... giữa Nhanh.vn và các hệ thống khác.
* Nhanh Open API hiện vẫn đang miễn phí. Khi bạn mua gói cước các dịch vụ của Nhanh, bạn sẽ được dùng Open API.
* Phiên bản mới nhất là **v3.0** ra mắt từ 31-08-2025.
* Phiên bản 2.0 sẽ ngừng hỗ trợ sau ngày 30-11-2026.
* Mọi thao tác về tạo app, viết code kết nối, đăng nhập cấp quyền lấy **accessToken** sẽ do nhân viên kỹ thuật của doanh nghiệp và tài khoản có quyền **Giám đốc** tự thao tác được. Nếu có câu hỏi trong quá trình tích hợp, bạn có thể gửi Code Snippet theo hướng dẫn [tại đây](https://apidocs.nhanh.vn/technicalsupport).

### Versions 3.0

* Xem tài liệu v3.0 [tại đây](https://apidocs.nhanh.vn/v3).

### Versions 2.0

* Xem tài liệu v2.0 [tại đây](https://apidocs.nhanh.vn/v2).
* Xem [các thay đổi và cách nâng cấp](https://apidocs.nhanh.vn/v2#chuyen-doi-sang-v3.0) từ bản 2.0 lên 3.0.

### Versions 1.0

* Phiên bản đã ngừng hỗ trợ.


# Khởi tạo app

{% hint style="warning" %}
Chú ý: Từ ngày 23/09/2026, API docs chuyển sang tên miền mới: [https://developers.nhanh.group](https://developers.nhanh.group/)
{% endhint %}

## Register app

* Để bắt đầu sử dụng Nhanh API, bạn cần đăng kí tài khoản developer và tạo ứng dụng tại <https://open.nhanh.vn>.
* **Chú ý:** tài khoản developer chỉ dùng để quản trị ứng dụng trên **open.nhanh.vn**, không yêu cầu phải có quyền quản trị trên Nhanh.vn, tài khoản cấp quyền cho ứng dụng mới cần có quyền trên Nhanh.vn.
* Một ứng dụng có thể được dùng cho nhiều doanh nghiệp trên Nhanh.vn. Một doanh nghiệp trên Nhanh.vn cũng có thể dùng nhiều ứng dụng khác nhau. VD bạn có thể dùng 1 app thiết kế landing page, 1 app affiliate, cả 2 app đều đồng bộ đơn hàng về Nhanh.vn để xử lý tập trung.
* Khi người dùng (VD tài khoản giám đốc doanh nghiệp trên Nhanh.vn) cấp quyền cho ứng dụng của bạn, Nhanh API sẽ tạo ra 1 access token gắn với doanh nghiệp (businessId) và appId của bạn, kèm theo các permissions (quyền được thao tác với dữ liệu nào) do người dùng chọn ở bước đăng nhập cấp quyền cho app.

| Khái niệm             | Giải thích                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên App               | Do bạn tự đặt, dùng để hiển thị cho user khi đăng nhập cấp quyền cho app của bạn                                                                                                                                                                                                                                                                                                                                                                                                 |
| Trạng thái            | Dùng để bật tắt ứng dụng. Khi bạn đổi trạng thái sang Ngừng hoạt động, thì app sẽ không thể gọi API và không nhận được webhooks nữa                                                                                                                                                                                                                                                                                                                                              |
| Redirect URL          | Là link trên hệ thống của bạn, sau khi user đăng nhập cấp quyền, Nhanh sẽ redirect về URL này, kèm accessCode, bạn dùng accessCode để đổi lấy accessToken (Đọc thêm các bước lấy accessCode và accessToken bên dưới)                                                                                                                                                                                                                                                             |
| Bật webhooks          | Dùng để bật tắt việc nhận webhooks, đọc thêm về webhooks [tại đây](https://github.com/nvndocs/docs-pos-openapi/tree/main/docs/webhooks/README.md)                                                                                                                                                                                                                                                                                                                                |
| Webhooks callback URL | Là link trên hệ thống của bạn dùng để nhận webhooks Nhanh bắn sang                                                                                                                                                                                                                                                                                                                                                                                                               |
| Webhooks verify token | <p>Là 1 chuỗi kí tự do bạn tự định nghĩa, có độ dài từ 16 -> 128 kí tự, bao gồm cả số và chữ. Khi Nhanh.vn gửi webhooks data cho bạn, sẽ bao gồm cả webhooksVerifyToken giúp bạn xác minh request đến từ Nhanh.vn.<br><strong>Chú ý:</strong> verify token sẽ được gửi kèm trong request body, không phải gửi theo header Authentication, đọc thêm về việc nhận webhooks <a href="https://github.com/nvndocs/docs-pos-openapi/tree/main/docs/webhooks/README.md">tại đây</a></p> |

![Tạo ứng dụng](https://3587219317-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2Fa2XHwSWeqjW0SgOYISkz%2Fuploads%2Fgit-blob-0114c4f607b6885d71f0e31231a93554735c41e9%2Fcreated_app2.png?alt=media)

## Lấy access token

* Để lấy được accessToken, bạn cần thực hiện 3 bước sau:

![Sơ đồ 3 bước để lấy access token](https://3587219317-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2Fa2XHwSWeqjW0SgOYISkz%2Fuploads%2Fgit-blob-0a02c0fdab0e4fda8ba3cf081e9abd5f7f13ccae%2FopenApi2.jpg?alt=media)

### Lấy access code

* **Bước 1:** Ứng dụng của bạn cần chuyển tới trang đăng nhập của Nhanh.vn <https://nhanh.vn/oauth?appId=YOUR\\_APPID\\&returnLink=YOUR\\_RETURN\\_LINK>

  <div data-gb-custom-block data-tag="hint" data-style="info" class="hint hint-info"><p>Chú ý: returnLink phải là 1 tên miền chạy https và nằm trong danh sách Redirect URL của ứng dụng.</p></div>

| Param      | Type                          | Description                                                                                                                                                                                                          |
| ---------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| appId      | int $$^{{\color{red}\*}}$$    | ID app.                                                                                                                                                                                                              |
| returnLink | string $$^{{\color{red}\*}}$$ | Sau khi người dùng đăng nhập và cấp quyền, Nhanh.vn sẽ redirect về URL này, kèm GET param accessCode. Chú ý returnLink bắt buộc chạy https, và phải được đăng ký trên [app của bạn](https://pos.open.nhanh.vn/apps). |

### Đăng nhập cấp quyền

* **Bước 2:** **Người dùng sẽ đăng nhập và chọn các quyền được cấp cho ứng dụng.**

{% hint style="info" %}
**Chú ý:** Chú ý doanh nghiệp cần mở cài đặt cho phép kết nối Open API: Dùng tài khoản Giám đốc, đăng nhập vào trang quản trị, mục cài đặt chung > [Cài đặt Open API](https://nhanh.vn/setting/store/index#openAPIConfigArea) và bật "Cho phép kết nối Open API".

<img src="https://3587219317-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2Fa2XHwSWeqjW0SgOYISkz%2Fuploads%2Fgit-blob-ff51a5d392e35c4ca4f92dc5b48f327fddee381d%2Fbusiness_setting_openAPI.jpg?alt=media" alt="Bật cài đặt mở Open API" data-size="original">
{% endhint %}

* Giao diện khi user đăng nhập cấp quyền:

![Chọn quyền](https://3587219317-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2Fa2XHwSWeqjW0SgOYISkz%2Fuploads%2Fgit-blob-a19221849eb1a1b642748bc96cb3a13df3b6e572%2Fpermissions2.png?alt=media)

* Các quyền của token sẽ tương ứng với các quyền được thao tác trên Nhanh.vn của tài khoản đang lấy token. VD bạn dùng tài khoản Giám đốc sẽ có thể chọn toàn bộ quyền, bạn dùng tài khoản nhân viên chỉ đang được thao tác với "Danh sách sản phẩm", thì ở bước cấp quyền, tài khoản này cũng chỉ chọn được "Danh sách sản phẩm" và accessToken do tài khoản này tạo ra cũng sẽ chỉ gọi được "/api/product/search" mà không dùng được với các API khác.
* Khi người dùng chọn "Đồng ý", Nhanh.vn sẽ redirect ngược lại về YOUR\_RETURN\_LINK kèm theo mã accessCode. VD bên trên nếu YOUR\_RETURN\_LINK = <https://example.org/nhanh/auth> thì Nhanh API sẽ redirect ngược lại về link <https://example.org/nhanh/auth?accessCode=>

### Đổi access token

* **Bước 3:** Gọi API để đổi **accessCode** lấy **accessToken**. **Chú ý** có sự khác biệt giữa v2.0 và v3.0, bạn cần dùng đúng phiên bản bên dưới:
  * `accessCode`: chỉ có hạn **10 phút**, và sẽ **hết hạn** ngay sau khi lấy accessToken thành công.
  * `secretKey`: Vào [Danh sách app](https://open.nhanh.vn/apps), click vào tên app, vào trang chi tiết để lấy secretKey.
  * `accessToken`: có hạn sử dụng 1 năm từ thời điểm được tạo. Hiện Nhanh chưa hỗ trợ refresh token. Hệ thống của bạn cần có cơ chế cảnh báo người dùng để đăng nhập cấp quyền và lấy token mới khi gần hết hạn token cũ.

#### Get access token v3

* **Chú ý**: v3.0 chỉ duy trì 1 accessToken cho 1 appId + businessId. Khi bạn tạo ra 1 accessToken mới, thì accessToken cũ (cùng appId + businessId + version 3.0) sẽ chỉ còn hiệu lực thêm 15 phút, sau đó sẽ không thể dùng accessToken cũ nữa.

**Request**

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/app/getaccesstoken?appId={{appId}}' \
--header 'Content-Type: application/json' \
--data '{
    "accessCode": "ACCESS CODE",
    "secretKey": "APP SECRET KEY"
}'
```

**Response**

```json
{
  "code": 1,
  "data": {
    "accessToken": "ACCESS TOKEN",
    "version": "3.0",
    "expiredAt": 1785603599,
    "businessId": 110668,
    "depotIds": [],
    "pageIds": [],
    "permissions": []
  }
}
```

| Key         | Type      | Description                                                                                                    |
| ----------- | --------- | -------------------------------------------------------------------------------------------------------------- |
| code        | int       | 1 = success or 0 = failed                                                                                      |
| messages    | array     | is an array of error messages if code = 0                                                                      |
| accessToken | string    | Access token (random from 128 to 256 characters)                                                               |
| expiredAt   | timestamp | Hạn sử dụng accessToken, VD: 1785603599                                                                        |
| businessId  | int       | ID doanh nghiệp trên Nhanh.vn                                                                                  |
| depotIds    | array     | Các kho hàng được phép thao tác. Nếu mảng rỗng hoặc bằng **All** thì sẽ được thao tác với toàn bộ các kho hàng |
| pageIds     | array     | Các page được phép thao tác. Nếu mảng rỗng hoặc bằng **All** thì sẽ được thao tác với toàn bộ các page         |
| permissions | string    | Các quyền được phép thao tác: Sản phẩm, đơn hàng... Do user chọn ở bước cấp quyền                              |

#### Get access token v2

* App của bạn dùng accessCode này POST sang <https://pos.open.nhanh.vn/api/oauth/access\\_token> để lấy được accessToken và các permissions được cấp cho accessToken này.
* Request params:

| Param      | Type                          | Description    |
| ---------- | ----------------------------- | -------------- |
| version    | string $$^{{\color{red}\*}}$$ | 2.0            |
| appId      | int $$^{{\color{red}\*}}$$    | Your appId     |
| accessCode | string $$^{{\color{red}\*}}$$ | Access code    |
| secretKey  | string $$^{{\color{red}\*}}$$ | App secret key |

![Dùng accessCode lấy accessToken](https://3587219317-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2Fa2XHwSWeqjW0SgOYISkz%2Fuploads%2Fgit-blob-9744ded2d6eeea98d595a5f11efb41a6f128353e%2Fpostman_get_access_token8_2.png?alt=media)

* Response:

| Key             | Type      | Description                                                                                              |
| --------------- | --------- | -------------------------------------------------------------------------------------------------------- |
| code            | int       | 1 = success or 0 = failed                                                                                |
| messages        | array     | is an array of error messages if code = 0                                                                |
| accessToken     | string    | Access token (random from 128 to 256 characters)                                                         |
| expiredDateTime | string    | Hạn sử dụng accessToken, VD: 2022-09-25 15:30:00, nên dùng key mới là expiredAt                          |
| expiredAt       | timestamp | Hạn sử dụng accessToken, VD: 1785603599                                                                  |
| businessId      | int       | ID doanh nghiệp trên Nhanh.vn                                                                            |
| depotIds        | array     | Các kho hàng được phép thao tác theo token. Nếu mảng rỗng thì sẽ được thao tác với toàn bộ các kho hàng. |
| permissions     | array     | Các quyền được phép thao tác: Sản phẩm, đơn hàng... Do user chọn ở bước cấp quyền                        |

## Kiểm tra access token

* API này dùng để kiểm tra thông tin của accessToken: thời hạn, các quyền đã được cấp, các kho được thao tác, các page được thao tác.

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/app/checkaccesstoken?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "secretKey": "APP SECRET KEY"
}'
```

* Response sẽ giống với việc dùng accessCode đổi lấy accessToken. Xem mô tả tại [Get access token v3](#get-access-token-v3), mục Response.


# Hỗ trợ kỹ thuật

{% hint style="warning" %}
Chú ý: Từ ngày 23/09/2026, API docs chuyển sang tên miền mới: [https://developers.nhanh.group](https://developers.nhanh.group/)
{% endhint %}

## Thông tin cần thiết

* Trong quá trình kết nối API, nếu bạn cần hỗ trợ, bạn cần mô tả rõ các vấn đề đang gặp phải để kỹ thuật của Nhanh.vn dễ dàng tìm kiếm thông tin để hỗ trợ bạn nhanh nhất.
* Các yêu cầu hỗ trợ với **đầy đủ thông tin như bên dưới** sẽ được **ưu tiên** trả lời sớm hơn các yêu cầu chưa rõ ràng:
  * Thông tin doanh nghiệp: Tên và ID doanh nghiệp (businessId).
  * Tình huống đang gọi API, có thể kèm theo các link đang xem dữ liệu đó trên Nhanh POS, Vpage, FinHub, WebApp. VD link tới trang chi tiết đơn hàng, chi tiết sản phẩm, chi tiết hóa đơn bán lẻ.
  * Các request params đang gọi API. Cách dùng [**Postman**](https://www.postman.com) để test và copy các **request params** xin vui lòng xem ảnh bên dưới:
    * Bước 1: Điền đầy đủ các **request params** bạn đang test.
    * Bước 2: Click nút Send và đợi Nhanh Open API phản hồi, chụp ảnh postman như hình bên dưới.
    * Bước 3: Click icon **Code Snippet**, chọn **cURL** và click icon **Copy** hết request params.

![Postman copy request params](https://3587219317-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2Fa2XHwSWeqjW0SgOYISkz%2Fuploads%2Fgit-blob-1c135e46b7b51cc5be589154f9d7f4a5e735281d%2Fpostman_code_snippet_2.jpg?alt=media)

## Kênh hỗ trợ

* Gửi yêu cầu kèm **Code Snippet** về email: **<dev@nhanh.vn>**
* **Chú ý**: Kênh này chỉ hỗ trợ các vấn đề về API, các yêu cầu về hướng dẫn sử dụng, mua gói cước, xin vui lòng liên hệ CSKH của Nhanh.vn qua chat hoặc email tới <contact@nhanh.vn>


# Change log

{% hint style="warning" %}
Chú ý: Từ ngày 23/09/2026, API docs chuyển sang tên miền mới: [https://developers.nhanh.group](https://developers.nhanh.group/)
{% endhint %}

* **v3.0**: Xem change log [tại đây](https://apidocs.nhanh.vn/v3/changelog).
* **v2.0**: Xem change log [tại đây](https://apidocs.nhanh.vn/v2/changelog).
  * v2.0 đã ngừng phát triển tính năng mới và sẽ ngừng hỗ trợ sau **30-11-2026**.
* **v1.0**: Đã ngừng hỗ trợ từ **31-12-2023**.


# Giới thiệu v3.0

{% hint style="warning" %}
Chú ý: Từ ngày 23/09/2026, API docs chuyển sang tên miền mới: [https://developers.nhanh.group](https://developers.nhanh.group/)
{% endhint %}

## Khởi tạo ứng dụng

* Xem cách khởi tạo ứng dụng [tại đây](https://apidocs.nhanh.vn/app).
* Xem cách đăng nhập cấp quyền và lấy accessToken [tại đây](https://apidocs.nhanh.vn/app#lay-access-token).

## Request params

* Sau khi lấy được accessToken, bạn có thể bắt đầu gọi các API. Mỗi service của Nhanh sẽ có các tên miền riêng:
  * [POS](https://nhanh.vn): **`https://pos.open.nhanh.vn`**
  * [Vpage](https://vpage.nhanh.vn): **`https://vpage.open.nhanh.vn`**
* Version 3.0 sẽ dùng **POST** method, headers, body **raw** và các params bắt buộc như sau:

  <div data-gb-custom-block data-tag="hint" data-style="info" class="hint hint-info"><p><strong>Chú ý:</strong> Nếu param type có dấu <span class="math">^{{\color{red}*}}</span> là bắt buộc (required), nếu không có là không bắt buộc (optional).</p></div>

| Param         | Type                          | Description                                                                                       |
| ------------- | ----------------------------- | ------------------------------------------------------------------------------------------------- |
| appId         | int $$^{{\color{red}\*}}$$    | ID app của bạn (Truyền lên link API)                                                              |
| businessId    | int $$^{{\color{red}\*}}$$    | ID doanh nghiệp trên Nhanh.vn. Lúc bạn lấy accessToken có trả về businessId (Truyền lên link API) |
| Authorization | string $$^{{\color{red}\*}}$$ | Access token của bạn (Truyền lên Headers)                                                         |

### Paginator

* **Request**: Khi gọi API, bạn có thể truyền thêm paginator để lấy các dữ liệu phân trang. Paginator thường có 3 field chính:
  * `size` (int): Số lượng bản ghi trên 1 trang. Mặc định tối đa không quá 100, nếu API hỗ trợ số lớn hơn, sẽ được mô tả rõ ở từng API.
  * `sort` (array | object): Các tiêu chí sắp xếp, xem mô tả ở tài liệu của từng API.
  * `next` (array | object): Dùng để gọi dữ liệu cho trang tiếp theo.
    * Khi gọi API cho trang đầu tiên, thì không cần truyền `next`, khi nhận được response có paginator.next, thì request tiếp theo bạn cần truyền `next` để lấy dữ liệu cho trang sau. Tùy từng API, hoặc cùng 1 API nhưng 1 số page cũng có thể có cấu trúc next trả về khác nhau.
  * **Lỗi thường hay gặp phải**:
    * Response trả về `"paginator":{"next":{"id":"xxx"}}`, thì request lấy trang tiếp theo cần truyền đúng `"paginator":{"next":{"id":"xxx"}}` chứ không phải `"paginator":{"next":"xxx"}`
    * Response trả về `"paginator":{"next":{"totalRevenue":"xxx", "productId":"yyy"}}`, thì request lấy trang tiếp theo cần truyền đúng `"paginator":{"next":{"totalRevenue":"xxx", "productId":"yyy"}}` chứ không phải `"paginator":{"next": {"xxx", "yyy"}}`.
    * Nếu response không trả về next, hoặc next bị NULL, nghĩa là đã hết dữ liệu, bạn không cần gọi API lấy trang tiếp theo.
    * Nếu response trả về dữ liệu ít hơn số lượng `size` (VD có 1 số tình huống dữ liệu bị xóa hoặc đã bị filter ẩn đi), nhưng vẫn có `next`, nghĩa là vẫn còn dữ liệu ở trang tiếp theo.
* **Response**:
  * `next` (array | object): Giá trị phân trang cho trang tiếp theo.

### Postman sample

* Tài liệu mô tả cho từng API hoặc webhooks do Nhanh bắn sang đều có mẫu curl đi kèm, bạn có thể mở Postman > File > Import và copy paste các mẫu curl, thay các tham số appId, businessId, accessToken để test thử.
* Bạn có thể dùng [Postman Collection v3.0](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn) tham khảo params cho 1 số API hay dùng.
* Để sử dụng: Bạn click vào collection mình cần -> click **Fork**
  * **Khuyến cáo**: Bạn nên tải Postman về, cài đặt và dùng ở localhost, Bản Postman chạy online trên web, có 1 số tình huống ghi nhận Response time bị sai.
* Tài liệu Nhanh Open API

![Postman: Tải về và tạo collection trên My Workspace của bạn](https://2299560279-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FkqD6qBCDVbHh0yciWW1F%2Fuploads%2Fgit-blob-506d89fc1d35903484ebc68c43b39d69cea2fa25%2Fpostman_create_fork.png?alt=media)

* Ở phần **Create Fork**: điền **Fork label** (Tên collection ở Workspace của bạn), **Workspace** (Chọn một không gian làm việc mà bạn muốn phân nhánh), xong click **Fork Collection**

![Postman: Tải về và tạo collection trên My Workspace của bạn](https://2299560279-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FkqD6qBCDVbHh0yciWW1F%2Fuploads%2Fgit-blob-a7e44525545cd353c6e27352ec5f5ca07b6c1296%2Fpostman_fork_collection.png?alt=media)

#### Lấy danh sách sản phẩm

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/product/list?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "name": "Áo sơ mi"
    },
    "paginator": {
        "size": 50,
        "sort": {"id": "desc"},
        "next": ""
    }
}'
```

#### Thêm sản phẩm

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/product/add?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '[
  {
    "appProductId": "string",
    "code": "Product Code 1",
    "barcode": "2000214262896",
    "name": "Product name 1",
    "price": 120000
  },
  {
    "appProductId": "string",
    "code": "Product Code 2",
    "barcode": "2000214262889",
    "name": "Product name 2",
    "price": 175000
  }
]'
```

### Code sample

{% hint style="info" %}
Chú ý: Bạn có thể dùng Postman điền các params và click vào Code Snippet trên Postman để xem cách tạo syntax cho các ngôn ngữ (Nodejs, PHP, C#, Go, Java...):
{% endhint %}

![Postman generate code syntax](https://2299560279-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FkqD6qBCDVbHh0yciWW1F%2Fuploads%2Fgit-blob-b1681931b5c4f5f3d7b0ee1c76163facdc54cde7%2Fpostman_generate_code_snippet1.jpg?alt=media)

## Response

* NhanhAPI sẽ phản hồi cho 2 tình huống Successful `"code": 1` và Failed `"code": 0` như bên dưới.

### Successful response

* Tùy API sẽ có thể chỉ trả về `{"code": 1}`, có thể thêm `data` (object, array), `warning` (string, object, array).

```json
{
    "code": 1,
    "data": [
        {
            "appProductId": "X1aoCM",
            "id": 421509,
            "barcode": "2000214262919"
        }
    ]
}
```

```json
{
  "code": 1,
  "warning": ["orderPrivateId is deprected, you should use appOrderId"]
}
```

### Failed response

* Khi gọi API bị lỗi, bạn sẽ nhận được phản hồi `"code": 0`, và có thể kèm theo các field khác như:
  * `errorCode`: mã lỗi. Xem chi tiết [mã lỗi chung](#common-error-codes), mã lỗi riêng của [POS](#pos-common-error-codes) hoặc [Vpage](#vpage-common-error-codes).
  * `messages`: có thể là 1 **string** (VD: `"messages": "content"`) hoặc **array** (VD: `"messages" : ["field_1": "message_1", "field_2": "message_2"]`.
  * `data`: Dữ liệu lỗi kèm theo.

```json
{
  "code": 0,
  "errorCode": "ERR_INVALID_FORM_FIELDS",
  "messages": {
    "customer.mobile": "customer.mobile is required",
    "customer.email": "invalid customer.email"
  }
}
```

### Common error codes

* Bảng bên dưới mô tả mã lỗi chung cho cả POS và Vpage.

| errorCode                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ERR\_INVALID\_APP\_ID           | Invalid appId                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ERR\_INVALID\_ACCESS\_TOKEN     | Invalid access token                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ERR\_INVALID\_VERSION           | Invalid version. VD bạn lấy accessToken v2.0 gọi API v3.0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ERR\_INVALID\_BUSINESS\_ID      | Invalid businessId                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ERR\_INVALID\_DEPOT\_ID         | Invalid depotId. Lỗi này là do khi user đăng nhập cấp quyền, không chọn kho hàng này, nên accessToken không thể thao tác với dữ liệu ở kho đó. Tình huống lỗi phổ biến: User được quản lý kho A, user đăng nhập cấp quyền chọn kho A, lúc này accessToken chỉ có quyền với kho A. Nếu trên giao diện, quyền giám đốc có phân thêm cho user được quản lý kho B, thì accessToken cũ vẫn chưa được quản lý kho B, bạn cần thực hiện lại việc đăng nhập cấp quyền, chọn cả 2 kho A và B, thì lúc này accessToken mới có quyền với cả 2 kho. Khuyến cáo dùng tính năng [Kiểm tra accessToken](https://apidocs.nhanh.vn/app#kiem-tra-access-token) để biết đang được thao tác với kho nào. |
| ERR\_EXCEEDED\_RATE\_LIMIT      | App của bạn đã vượt quá [API Rate Limit](#api-rate-limit)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ERR\_BUSINESS\_NOT\_ENABLE\_API | Doanh nghiệp chưa mở cài đặt cho phép dùng API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ERR\_INVALID\_FORM\_FIELDS      | Trường dữ liệu không hợp lệ, khi gặp mã lỗi này thì thường `messages` sẽ trả về mảng `["field": "error" ]`, VD `["id": "id must be integer" ]`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ERR\_INVALID\_DATA              | Invalid data. Lỗi này do data không phải là 1 chuỗi json string hợp lệ, thường do bạn không dùng các hàm json encode mà gõ thủ công gây thừa thiếu dấu hoặc không encode các kí tự đặc biệt. Bạn có thể kiểm tra chuỗi data json string bằng cách vào <https://jsonformatter.org> copy paste chuỗi của bạn vào textarea và click **Validate**.                                                                                                                                                                                                                                                                                                                                       |
| ERR\_403                        | Access token không có quyền thao tác với dữ liệu, thường do user khi đăng nhập cấp quyền không chọn quyền này. VD để API lấy được danh sách đơn hàng, thì user phải có quyền truy cập trang danh sách đơn hàng trên Nhanh.vn, và phải chọn danh sách đơn hàng ở bước cấp quyền cho app. Bạn có thể gọi API để [Kiểm tra access token](https://apidocs.nhanh.vn/app#kiem-tra-access-token) đang được gắn những kho nào, và có quyền gì.                                                                                                                                                                                                                                               |
| ERR\_429                        | App của bạn đã vượt quá [API Rate Limit](#api-rate-limit)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

#### Common accessToken errors

* <https://open.nhanh.vn> là trang quản trị app. Tài khoản tạo ra app, có thể chỉ là nhân viên kỹ thuật, không có quyền gì với dữ liệu trên <https://nhanh.vn/>
* Để đăng nhập cấp quyền cho app (lấy được accessToken), thì tài khoản đăng nhập cấp quyền, phải là tài khoản đăng nhập vào được <https://nhanh.vn/>, và có quyền thao tác với dữ liệu doanh nghiệp.
* Tại tất cả các trang tài liệu API, đều có mô tả rõ API này dùng để lấy dữ liệu nào ở trên Nhanh.vn, bạn có thể bấm vào link để xem dữ liệu tương ứng.
* Khi gọi API, nếu nhận được errorCode **ERR\_403**: Nguyên nhân do access token không có quyền thao tác với dữ liệu.
  * VD: Tài khoản nhân viên A, chỉ vào được trang [Danh sách sản phẩm](https://nhanh.vn/product/item/index), **không được** vào được trang [Danh sách đơn hàng](https://nhanh.vn/order/manage/index), thì lúc nhân viên A đăng nhập cấp quyền cho app, cũng sẽ chỉ được phép chọn Danh sách sản phẩm => accessToken sẽ chỉ gọi được dữ liệu của Danh sách sản phẩm, không lấy được dữ liệu của Danh sách đơn hàng.
  * Hoặc nhân viên A có quyền thao tác với dữ liệu Danh sách đơn hàng, nhưng tại bước đăng nhập cấp quyền, lại không chọn quyền này.
* Các quyền gắn cho accessToken là cố định tại thời điểm user cấp quyền, không thay đổi theo quyền của tài khoản nhân viên. VD:
  * Ban đầu nhân viên A được phân quyền vào danh sách sản phẩm, chưa được phân quyền vào danh sách đơn hàng => Nhân viên A đăng nhập cấp quyền tạo ra accessToken\_1 => Chỉ lấy được danh sách sản phẩm.
  * Sau đó nhân viên A được phân thêm quyền vào danh sách đơn hàng trên Nhanh.vn => nhưng accessToken\_1 vẫn chỉ được phép thao tác với danh sách sản phẩm.
  * Để lấy được danh sách đơn hàng, nhân viên A cần đăng nhập lại và cấp quyền cho app, chọn cả danh sách sản phẩm và danh sách đơn hàng => tạo ra accessToken\_2, có quyền thao tác với cả danh sách sản phẩm và danh sách đơn hàng.

### POS common error codes

* Bảng bên dưới là các mã lỗi chung của POS. Từng API có thể có thêm các mã lỗi riêng, bạn xem tại mô tả Response của từng API.

### Vpage common error codes

| errorCode              | Description     |
| ---------------------- | --------------- |
| ERR\_PAGE\_EXPIRED     | Page expired    |
| ERR\_INVALID\_PAGE\_ID | Invalid page id |

### API Rate Limit

* Rate Limit là số lệnh gọi API mà ứng dụng của bạn có thể thực hiện trong khoảng thời gian nhất định. Mức mặc định là: **150 requests / 30 giây**. Nếu 1 API có mức riêng, thì tài liệu của API đó sẽ có mô tả riêng. Tùy theo lượng dữ liệu cần lấy, bạn cần tính toán cách xử lý để không bị lỗi Rate Limit. VD mỗi lần gọi API request bạn lấy về 100 bản ghi, thì tổng lượt gọi và số dữ liệu lấy được sẽ là:

| Thời gian | Lượt gọi API | Tổng số bản ghi |
| --------- | -----------: | --------------: |
| 30 giây   |          150 |          15.000 |
| 1 phút    |          300 |          30.000 |
| 1 giờ     |       18.000 |       1.800.000 |
| 1 ngày    |      432.000 |      43.200.000 |

* Rate Limit được kết hợp từ appId + businessId + API URL, nên ứng dụng của bạn có thể bị giới hạn ở 1 URL này, nhưng vẫn có thể gọi URL khác nếu URL đó không bị giới hạn, hoặc nếu ứng dụng của bạn dùng cho nhiều doanh nghiệp, thì có thể bị giới hạn với businessId 1, nhưng vẫn có thể dùng được với businessId 2. **Chú ý:** Nếu cố tình dùng nhiều ứng dụng để gọi liên tục API, hệ thống sẽ khóa toàn bộ các ứng dụng, sẽ không thể gọi bất kì API nào nữa.
* Lỗi này thường gặp phải khi ứng dụng không lưu dữ liệu mà luôn gọi API (VD liên tục gọi API lấy danh sách sản phẩm, danh sách đơn hàng...).
* **Khuyến cáo:** Bạn cần lưu dữ liệu ở hệ thống của bên bạn, cập nhật [dữ liệu mới từ webhooks](/v3/webhooks/webhooks), khi gọi API chỉ nên lấy các dữ liệu có thay đổi, không lấy toàn bộ dữ liệu cũ (các API có hỗ trợ lọc theo updatedAtFrom - updatedAtTo).
* **Nhanh Open API không hỗ trợ mở khóa Rate Limit**.
* Khi vượt quá Rate Limit, bạn sẽ nhận được errorCode = ERR\_429. Bạn cần tạm ngừng gọi API tới URL này cho tới khi quá thời gian **unlockedAt**. Nếu vẫn tiếp tục phát sinh gọi API khi đang bị Rate Limit, lockedSeconds và unlockedAt sẽ bị tăng lên.

```json
{
  "code": 0,
  "errorCode": "ERR_429",
  "message": "Your app exceeded the API Rate Limit",
  "data": {
    "lockedSeconds": 10,
    "unlockedAt": 1733387520
  }
}
```

| Key           | Description                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| lockedSeconds | Số giây bị khóa                                                                         |
| unlockedAt    | Thời gian được mở khóa theo Unix timestamp. VD: 1733387520 = 2024-12-05 15:32:00 GMT+07 |


# Change log

## 2026-08-20

* \[POS] [Sửa đơn hàng](/v3/order/edit): Hỗ trợ cập nhật thông tin địa chỉ nhận hàng của khách, cập nhật trạng thái, gắn nhãn cho đơn sàn (Tiktok, Shopee, Lazada).
* \[Vpage] [Trả lời tin nhắn](/v3/vpage/conversation/reply): Hỗ trợ thêm nhiều định dạng tin nhắn, hỗ trợ replyToMessageId

## 2026-08-07

* \[POS] [Thêm đơn hàng](/v3/order/add): Thêm thông tin xuất hóa đơn điện tử (invoice).
* \[POS] [Thêm hóa đơn bán lẻ](/v3/bill/addretail): Thêm thông tin xuất hóa đơn điện tử (invoice).

## 2026-07-30

* \[POS] [Danh sách đơn hàng](/v3/order/list): Sản phẩm trong đơn hàng trả về thêm Tổng tiền (totalAmount), Số lượng giao hàng một phần (partialDelivery), Tổng chiết khấu (discountAmount).

## 2026-07-24

* \[POS] Thêm mới API [Danh sách đơn hàng đã xóa](/v3/order/deleted)
* \[POS] Thêm mới API [Danh sách hóa đơn đã xóa](/v3/bill/deleted)
* \[POS] [Danh sách sản phẩm xuất nhập kho](/v3/bill/imexs): Bổ sung thông tin lô hàng của sản phẩm.

## 2026-07-07

* \[POS] [Thêm đơn hàng](/v3/order/add): Hỗ trợ truyền thêm deliveryTime (Giờ:phút:giây).

## 2026-07-03

* \[POS] Cập nhật bộ lọc "Nhóm sản phẩm theo quan hệ cha - con" [Danh sách sản phẩm](/v3/product/list)

## 2026-06-11

* \[POS] Tạo sản phẩm loại sản phẩm combo [Thêm sản phẩm](/v3/product/add)

## 2026-06-05

* \[POS] Cho phép truyền thêm kích thước gói hàng (orderPackage) ở API [Thêm đơn hàng](/v3/order/add) và [Sửa đơn hàng](/v3/order/edit)

## 2026-05-30

* Bổ sung địa chỉ 2 cấp [Danh sách kho hàng](/v3/business/depot)

## 2026-05-27

* Thêm mới API [Danh sách bảng giá](/v3/promotion/pricelist)
* Thêm mới API [Danh sách sản phẩm trong bảng giá](/v3/promotion/pricelistproduct)

## 2026-05-05

* Thêm mới API [Danh sách sản phẩm combo](/v3/product/combo)

## 2026-05-04

* [Danh sách sản phẩm](/v3/product/list): Trả về thêm dữ liệu: priceVatMode, importPriceVatMode, prices.retailVat, prices.importVat .
* [Thêm / sửa sản phẩm](/v3/bill/addretail): Cho phép truyền thêm: priceVatMode, importPriceVatMode, importPriceVat.
* [Thêm hóa đơn bán lẻ](/v3/bill/addretail): Sản phẩm trong hóa đơn cho phép truyền thêm: priceVatMode, imeis.

## 2026-04-17

* [Thêm đơn hàng](/v3/order/add): Hỗ trợ truyền mảng IMEI sản phẩm theo key "imeis".
* [Danh sách đơn hàng](/v3/order/list): Trả về mảng IMEI sản phẩm theo các key "imeiIds" và "imeiCodes".

## 2026-03-06

* [Lịch sử đơn hàng](/v3/order/history): Hỗ trợ lọc hành động thao tác.

## 2026-01-09

* Bổ sung webhook [Trả hàng 1 phần](/v3/webhooks/order)

## 2026-01-06

* Thêm mới API [Danh sách trả hàng hoàn tiền](/v3/ecom/return)

## 2025-12-11

* [Thêm đơn hàng](/v3/order/add): Hỗ trợ truyền thêm ID người tạo đơn hàng.
* [Tính phí vận chuyển](/v3/shipping/fee): Hỗ trợ dịch vụ cộng thêm cho 1 số hãng vận chuyển (Đổi trả hàng, phát tận tay).
* [Thêm đơn hàng](/v3/order/add): Hỗ trợ khai giá hàng hóa, dịch vụ cộng thêm cho 1 số hãng vận chuyển (Đổi trả hàng, phát tận tay).

## 2025-12-03

* [Thêm mới sản phẩm](/v3/product/add): Hỗ trợ thêm gắn nhãn sản phẩm.
* [Danh sách nhãn sản phẩm](/v3/product/tags): Thêm API lấy danh sách nhãn sản phẩm.
* [Danh sách nhãn đơn hàng](/v3/order/tags): Thêm API lấy danh sách nhãn đơn hàng.
* [Danh sách nhãn khách hàng](/v3/customer/tags): Thêm API lấy danh sách nhãn khách hàng.
* [Hạn mức tồn kho](/v3/inventory/archive): Thêm API lấy hạn mức tồn kho.

## 2025-12-01

* [Thêm hóa đơn bán lẻ](/v3/bill/addretail): Hỗ trợ tạo hóa đơn điện tử khi thêm hóa đơn bán lẻ.

## 2025-11-28

* [Sửa đơn hàng](/v3/order/edit): Hỗ trợ cập nhật thêm nhãn đơn hàng.
* [Danh sách sản phẩm](/v3/product/list): Hỗ trợ lọc nhiều danh mục và nhiều thương hiệu.

## 2025-11-20

* [Sửa đơn hàng](/v3/order/edit): Hỗ trợ cập nhật thêm trạng thái Đã hoàn.
* [Hủy đơn hàng](/v3/order/cancelcarrier): Thêm API hủy đơn hàng đã gửi sang hãng vận chuyển.

## 2025-11-03

* [Danh sách hóa đơn bán lẻ](/v3/bill/retail): Thêm danh sách hóa đơn bán lẻ. Tách chỉ lấy riêng hóa đơn bán lẻ, thay vì phải dùng quyền lấy toàn bộ hóa đơn xuất nhập kho.
* [Danh sách tài khoản kế toán](/v3/accounting/account): Thêm danh sách tài khoản kế toán
* [Danh sách tồn kho](/v3/product/inventory): Thêm danh sách tồn kho. API lấy danh sách sản phẩm cũng có thể lấy được tồn kho, nhưng bao gồm cả thông tin sản phẩm (data sẽ nặng hơn) và không hỗ trợ lọc theo thời gian thay đổi tồn.

## 2025-08-31

* Ra mắt chính thức v3.0
* Đăng nhập cấp quyền:
  * [POS](https://nhanh.vn): Thêm lựa chọn cho phép user chọn toàn bộ kho hiện tại và tương lai, để khi doanh nghiệp phát sinh kho mới, thì sẽ không cần đăng nhập cấp quyền lại.
  * [Vpage](https://vpage.nhanh.vn): Thêm lựa chọn cho phép user chọn toàn bộ page hiện tại và tương lai, để khi doanh nghiệp phát sinh page mới, thì sẽ không cần đăng nhập cấp quyền lại.

## 2025-08-15

* Ra mắt v3.0 Beta

## 2025-07-15

* Ra mắt v3.0 Alpha.


# Model Constant

* Trang này mô tả các giá trị constant dùng chung cho các trang API.

## Product

### Product type

* Loại sản phẩm

| Value | Mô tả                      |
| ----- | -------------------------- |
| 1     | Loại sản phẩm              |
| 2     | Loại Voucher               |
| 3     | Sản phẩm cân đo            |
| 4     | Sản phẩm theo IMEI         |
| 5     | Gói sản phẩm               |
| 6     | Sản phẩm dịch vụ           |
| 7     | Sản phẩm dụng cụ           |
| 8     | Sản phẩm bán theo lô       |
| 9     | Sản phẩm Combo             |
| 10    | Sản phẩm nhiều đơn vị tính |

### Product status

* Trạng thái sản phẩm

| Value | Mô tả                                                                                                                                                                                                           |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Mới: Trạng thái này dùng để bán hàng ở cửa hàng offline                                                                                                                                                         |
| 2     | Đang bán: Trạng thái này dùng để hiện bán ở trên website online (nếu dùng website của Nhanh.vn) và cửa hàng offline                                                                                             |
| 3     | Ngừng bán: Trạng thái này để ẩn sản phẩm cả webiste online và cửa hàng offline, gõ gợi ý và mặc định ở danh sách sản phẩm cũng không hiện ra trừ khi lọc trạng thái Ngừng bán hoặc lọc chính xác id sản phẩm đó |
| 4     | Hết hàng: Dùng để hiện trên website nhưng sẽ hiện thêm chữ Hết hàng và không cho đặt hàng, thường để website giữ link sản phẩm cũ, tránh lỗi 404                                                                |

### Price VAT Mode

* Giá bán đã bao gồm / chưa bao gồm VAT

| Value | Mô tả                           |
| ----- | ------------------------------- |
| 1     | Giá đã bao gồm VAT              |
| 2     | Giá chưa bao gồm VAT (mặc định) |

* Ví dụ: Sản phẩm giá 100.000, VAT 10%.
  * Nếu là priceVatMode = Giá chưa bao gồm VAT, thì giá bán sẽ bằng 100.000 + (10.000 \* 10%) = 110.000
  * Nếu là priceVatMode = Giá đã bao gồm VAT, thì giá bán sẽ bằng 100.000

### Import Price VAT Mode

* Giá nhập đã bao gồm / chưa bao gồm VAT

| Value | Mô tả                           |
| ----- | ------------------------------- |
| 1     | Giá đã bao gồm VAT              |
| 2     | Giá chưa bao gồm VAT (mặc định) |

* Ví dụ: Sản phẩm giá 100.000, VAT 10%.
  * Nếu là priceVatMode = Giá chưa bao gồm VAT, thì giá nhập sẽ bằng 100.000 + (10.000 \* 10%) = 110.000
  * Nếu là priceVatMode = Giá đã bao gồm VAT, thì giá nhập sẽ bằng 100.000

### Product VAT

* VAT sản phẩm

| Value | Mô tả                  |
| ----- | ---------------------- |
| -1    | Không chịu thuế        |
| -2    | Không kê khai nộp thuế |
| -100  | Thuế bằng 0            |

## Order

Các thuật ngữ của đơn hàng online

* **shippingWeight**: bao gồm cân nặng thực tế của sản phẩm và toàn bộ cân nặng của các phụ kiện và vỏ hộp đóng gói đi kèm. Shipping weight được sử dụng để tính phí vận chuyển của đơn hàng. VD: Sản phẩm “Samsung Galaxy S2” nặng 300gr, Sản phẩm fullbox còn bao gồm 1 sạc (30gr), 1 tai nghe (10gr) and vỏ hộp đóng gói (30gr), vậy thì shippingWeight để tính phí vận chuyển sẽ là: 300 + 30 + 10 + 30 = 370 gr.
* **COD**: Cash on delivery (Collect on delivery) là 1 loại giao dịch mà người mua hàng sẽ trả tiền khi nhận được hàng. Nếu người mua không đồng ý thanh toán khi nhận hàng, đơn hàng sẽ được chuyển trả lại cho người bán. Phí thu tiền hộ **codFee** tùy thuộc vào số tiền cần thu của đơn hàng.
* **shipFee**: Phí vận chuyển, được tính dựa vào trọng lượng đơn hàng, địa chỉ gửi hàng và địa chỉ nhận hàng.
* **customerShipFee**: Phí thu của khách, là mức phí mà website thông báo cho khách đặt hàng, thường sẽ lấy bằng shipFee + codFee. Tình huống website có chương trình miễn phí vận chuyển cho khách thì set customerShipFee = 0.

### Order Sale Channel

* Kênh bán hàng

| Value | Mô tả        |
| ----- | ------------ |
| 1     | Admin        |
| 2     | Website      |
| 10    | API          |
| 20    | Facebook     |
| 21    | Instagram    |
| 41    | Lazada       |
| 42    | Shopee       |
| 43    | Sendo        |
| 45    | Tiki         |
| 48    | Tiktok Shop  |
| 49    | Zalo OA      |
| 50    | Shopee chat  |
| 51    | Lazada chat  |
| 52    | Zalo cá nhân |

### Order Carrier

Hãng vận chuyển

| Value | Mô tả               |
| ----- | ------------------- |
| 2     | Viettel             |
| 5     | Giao hàng nhanh     |
| 8     | Giao hàng tiết kiệm |
| 12    | Tự vận chuyển       |
| 18    | Ahamove             |
| 22    | Việt Nam Post       |
| 24    | JT Express          |
| 25    | EMS                 |
| 26    | Best Express        |
| 27    | NinjaVan            |
| 28    | SuperShip           |
| 29    | SPX                 |
| 30    | LEX                 |
| 31    | Grab                |

### Order Type

Loại đơn hàng

| Value | Mô tả              |
| ----- | ------------------ |
| 1     | Giao hàng tận nhà  |
| 2     | Mua tại quầy       |
| 3     | Đặt trước          |
| 5     | Đổi quà            |
| 10    | Xin báo giá        |
| 12    | Đổi sản phẩm       |
| 14    | Khách trả lại hàng |
| 15    | Hàng chuyển kho    |
| 16    | Đơn hoàn một phần  |
| 17    | Đền bù mất hàng    |

### Order Status

Trạng thái

| Status | Description             |
| ------ | ----------------------- |
| 40     | Đã đóng gói             |
| 42     | Đang đóng gói           |
| 43     | Chờ thu gom             |
| 54     | Đơn mới                 |
| 55     | Đang xác nhận           |
| 56     | Đã xác nhận             |
| 57     | Chờ khách xác nhận      |
| 58     | Hãng vận chuyển hủy đơn |
| 59     | Đang chuyển             |
| 60     | Thành công              |
| 61     | Thất bại                |
| 63     | Khách hủy               |
| 64     | Hệ thống hủy            |
| 68     | Hết hàng                |
| 71     | Đang chuyển hoàn        |
| 72     | Đã chuyển hoàn          |
| 73     | Đổi kho xuất hàng       |
| 74     | Xác nhận hoàn           |

### Order Reason

* Lý do theo trạng thái

| Reason | Description                                       |
| ------ | ------------------------------------------------- |
| 1      | Đặt nhầm sản phẩm                                 |
| 2      | Phí vận chuyển cao                                |
| 3      | Không muốn chuyển khoản                           |
| 4      | Đơn trùng                                         |
| 5      | Không gọi được khách                              |
| 6      | Hết hàng                                          |
| 8      | Chờ chuyển khoản                                  |
| 9      | Khách không thích sản phẩm                        |
| 10     | Khách không hài lòng về nhân viên vận chuyển      |
| 11     | Giao hàng chậm                                    |
| 12     | Đã mua sản phẩm tại cửa hàng                      |
| 14     | Sai địa chỉ người nhận                            |
| 16     | Khách không muốn mua nữa                          |
| 18     | Lý do khác                                        |
| 19     | Không liên hệ được với người gửi                  |
| 20     | Người gửi không bán hàng Online / Ngoại tỉnh      |
| 22     | Người gửi không bàn giao hàng cho hãng vận chuyển |
| 23     | Hãng vận chuyển lấy hàng muộn                     |
| 24     | Sai địa chỉ kho lấy hàng                          |
| 25     | Hãng vận chuyển làm mất hàng                      |
| 26     | Người gửi tự vận chuyển                           |
| 29     | Người gửi không xử lý đơn hàng                    |
| 30     | Sai giá sản phẩm                                  |
| 35     | Khách đi vắng (sẽ giao hàng vào hôm khác)         |

### Order Step

* Hành động thao tác với đơn hàng

| Reason | Description                         |
| ------ | ----------------------------------- |
| 1      | Tạo đơn hàng                        |
| 2      | Xác nhận                            |
| 3      | In đơn hàng                         |
| 4      | Vận chuyển                          |
| 6      | Sửa đơn hàng                        |
| 7      | Đổi trạng thái                      |
| 8      | Gửi đơn sang HVC                    |
| 9      | Cập nhật tiền chuyển khoản          |
| 10     | Đổi kho hàng                        |
| 11     | Thêm đơn hàng vào biên bản          |
| 12     | Xóa đơn hàng khỏi biên bản          |
| 13     | HVC cập nhật trạng thái             |
| 14     | Đổi hãng vận chuyển                 |
| 15     | Báo hãng vận chuyển hủy             |
| 16     | HVC trả về mã code                  |
| 17     | Xóa đơn hàng                        |
| 18     | Trả về trạng thái và khối lượng     |
| 19     | Thêm nội dung đơn hàng              |
| 20     | API cập nhật đơn hàng               |
| 21     | HVC đã nhận hàng                    |
| 22     | Gộp đơn hàng                        |
| 23     | Gộp đơn hàng (lỗi)                  |
| 25     | Gửi đơn sang HVC (lỗi)              |
| 26     | Thay đổi mã vận đơn HVC             |
| 27     | Lấy trạng thái từ HVC               |
| 28     | Đổi trạng thái từ biên bản bàn giao |
| 29     | Chuyển từ Tour sang biên bản        |
| 30     | Lỗi hủy đơn HVC                     |
| 31     | Lỗi lấy lịch trình từ HVC           |
| 32     | Vượt cân                            |
| 33     | Đối soát lỗi                        |
| 34     | Import đơn hàng                     |
| 35     | Import trạng thái đơn hàng          |
| 36     | Đang đối soát                       |
| 37     | Đã đối soát                         |
| 38     | Tạo hóa đơn bán lẻ                  |
| 39     | Chuyển đơn hàng sang bán sỉ         |
| 40     | Đơn hàng chuyển kho                 |
| 41     | Copy đơn hàng                       |
| 42     | Đóng gói                            |
| 43     | Cập nhật nhân viên đóng gói         |
| 44     | Tạo đơn giao hàng một phần          |
| 45     | Xóa đơn hàng khỏi tour              |
| 46     | Tạo link thanh toán                 |
| 47     | Tạo phiếu xuất kho                  |
| 48     | Tạo phiếu nhập kho                  |
| 49     | Xóa phiếu xuất kho                  |
| 50     | Xóa phiếu nhập kho                  |
| 51     | Gửi thông tin sang Vpage            |
| 52     | Hủy ghép nối giao dịch chuyển khoản |
| 53     | Nhập hoàn kho                       |
| 54     | Tách đơn hàng                       |
| 55     | Gửi hàng đa điểm                    |
| 56     | Sửa COD                             |
| 57     | Cập nhật nhân viên bán hàng         |
| 58     | Tạo hóa đơn điện tử                 |

## Inventory

* Phiếu xuất nhập kho, Sản phẩm xuất nhập kho có 2 loại `type` là phiếu nhập, phiếu xuất và kiểu `mode` là các kiểu xuất nhập kho khác nhau:

### Inventory type

* Loại xuất nhập kho

| Type (int) | Description   |
| ---------- | ------------- |
| 1          | Loại nhập kho |
| 2          | Loại xuất kho |

### Inventory mode

* Kiểu xuất nhập kho

| Mode (int) | Description                    |
| ---------- | ------------------------------ |
| 1          | Kiểu giao hàng                 |
| 2          | Kiểu bán lẻ                    |
| 3          | Kiểu chuyển kho                |
| 4          | Kiểu quà tặng ở hóa đơn bán lẻ |
| 5          | Kiểu nhà cung cấp              |
| 6          | Kiểu bán sỉ                    |
| 8          | Kiểu kiểm kho                  |
| 10         | Kiểu khác                      |
| 13         | Kiểu phiếu bảo hành            |
| 14         | Kiểu trung tâm bảo hành        |
| 15         | Kiểu phiếu sửa chữa            |
| 16         | Kiểu linh kiện bảo hành        |
| 17         | Kiểu quà tặng ở hóa đơn bán sỉ |
| 18         | Kiểu quà tặng ở đơn hàng       |
| 19         | Kiểu Combo                     |

### Inventory related type

* Loại xuất nhập kho liên quan

| Type (int) | Description                      |
| ---------- | -------------------------------- |
| 1          | Xuất bán giữa 2 doanh nghiệp     |
| 2          | Nhập giữa 2 doanh nghiệp         |
| 3          | Xuất quà tặng cho hóa đơn bán lẻ |
| 4          | Xuất quà tặng cho đơn hàng       |
| 5          | Xuất quà tặng bán sỉ             |
| 6          | Nhập trả lại bán lẻ, bán sỉ      |
| 7          | Nhập xuất chuyển kho             |
| 8          | Nhập xuất combo                  |

## Accounting

* Các thuật ngữ về kế toán

### Accounting type

* Loại bút toán

| Type | Name              |
| ---- | ----------------- |
| 1    | Báo nợ (Rút tiền) |
| 2    | Báo có (Nộp tiền) |
| 3    | Phiếu thu         |
| 4    | Phiếu chi         |
| 5    | Phiếu trả hàng    |
| 6    | Phiếu bán hàng    |
| 7    | Khác              |
| 8    | Phiếu nhập        |
| 9    | Phiếu xuất        |
| 12   | Kết chuyển        |

### Accounting mode

* Kiểu bút toán

| Mode | Name                                    |
| ---- | --------------------------------------- |
| 1    | Nhập nhà cung cấp                       |
| 2    | Xuất trả nhà cung cấp                   |
| 3    | Bán hàng                                |
| 4    | Hàng trả lại                            |
| 5    | Bán sỉ                                  |
| 6    | Trả lại bán sỉ                          |
| 7    | Nhập máy cũ                             |
| 8    | Bảo hành                                |
| 9    | Xuất linh kiện                          |
| 15   | Chuyển quỹ                              |
| 20   | Hạch toán trả góp                       |
| 21   | Công nợ đầu kì                          |
| 22   | Đơn hàng                                |
| 23   | Đơn hàng trả lại                        |
| 24   | Nhập nhà cung cấp VAT                   |
| 25   | Xuất nhà cung cấp VAT                   |
| 26   | XNK khác                                |
| 27   | Thu hộ trả góp                          |
| 28   | Nhập VAT                                |
| 29   | Xuất VAT                                |
| 30   | Xác nhận nhận tiền thanh toán           |
| 31   | Xác nhận chi tiền thanh toán vận chuyển |
| 32   | Phiếu nhập quà tặng                     |
| 33   | Phiếu xuất quà tặng                     |

## Ecommcerce

* Các thuật ngữ về các sàn thương mại điện tử (Shopee, Tiktok, Lazada, Tiki, Sendo).
  * shopId: shopId trên các sàn.

### Ecommerce appId

* appId: id các sàn trên Nhanh.

| Value | Description |
| ----- | ----------- |
| 8142  | Lazada      |
| 8195  | Shopee      |
| 8237  | Sendo       |
| 8238  | Tiki        |
| 8855  | Tiktok      |


# Danh sách kho hàng

* API này dùng để lấy [danh sách kho hàng](https://nhanh.vn/store/setting/expire).
* Chú ý: Dữ liệu này rất ít khi bị thay đổi (chỉ xảy ra khi doanh nghiệp mở thêm kho mới), bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 24h.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/tuqpxw8/business-depot).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/business/depot?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "ids": []
    }
}'
```

### Filters

| Name | Type  | Description                                               |
| ---- | ----- | --------------------------------------------------------- |
| ids  | array | Mảng id cần lấy dữ liệu. Để trống để lấy toàn bộ dữ liệu. |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Giá trị để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID kho hàng 1",
      "code": "(string) Mã kho hàng 1",
      "name": "(string) Tên kho hàng 2",
      "mobile": "(string) Số điện thoại",
      "location": {
        "cityId": "(int) ID tỉnh/thành phố",
        "cityName": "(string) Tên tỉnh/thành phố",
        "districtId": "(int) ID quận/huyện",
        "districtName": "(string) Tên quận/huyện",
        "wardId": "(int) ID phường/xã",
        "wardName": "(string) Tên phường/xã",
        "address": "(string) Địa chỉ"
      },
      "locationV2": {
        "cityId": "(int) ID tỉnh/thành phố 2 cấp",
        "cityName": "(string) Tên tỉnh/thành phố 2 cấp",
        "wardId": "(int) ID phường/xã 2 cấp",
        "wardName": "(string) Tên phường/xã 2 cấp",
        "address": "(string) Địa chỉ"
      }
    },
    {
      "id": "(int) ID kho hàng 2",
      "code": "(string) Mã kho hàng 2",
      "name": "(string) Tên kho hàng 2",
      "mobile": "(string) Số điện thoại",
      "location": {
        "cityId": "(int) ID tỉnh/thành phố",
        "cityName": "(string) Tên tỉnh/thành phố",
        "districtId": "(int) ID quận/huyện",
        "districtName": "(string) Tên quận/huyện",
        "wardId": "(int) ID phường/xã",
        "wardName": "(string) Tên phường/xã",
        "address": "(string) Địa chỉ"
      },
      "locationV2": {
        "cityId": "(int) ID tỉnh/thành phố 2 cấp",
        "cityName": "(string) Tên tỉnh/thành phố 2 cấp",
        "wardId": "(int) ID phường/xã 2 cấp",
        "wardName": "(string) Tên phường/xã 2 cấp",
        "address": "(string) Địa chỉ"
      }
    }
  ]
}
```


# Danh sách nhân viên

* API này dùng để lấy [danh sách nhân viên](https://nhanh.vn/store/user/index).

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/5zqsy92/business-user).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/business/user?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "ids": [XXX,XXXX]
    },
    "paginator": {
        "size": 100
    }
}'
```

### Filters

| Key | Type  | Description                                      |
| --- | ----- | ------------------------------------------------ |
| ids | array | List ID nhân viên (chỉ hỗ trợ lọc tối đa 100 ID) |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

* `depots` mảng các kho hàng:
  * Nếu mảng có giá trị: User chỉ được phép theo tác với các kho hàng này.
  * Nếu mảng rỗng: User được phép thao tác với toàn bộ kho hàng.

```javascript
{
    "code": 1,
    "paginator": {
        "next": "(int) ID bản ghi tiếp theo"
    },
    "data": [
        {
            "id": "(int) ID nhân viên 1",
            "username": "(string) Tài khoản đăng nhập 1",
            "fullName": "(string) Họ và tên 1",
            "email": "(string) Email",
            "mobile": "(string) Số điện thoại",
            "roleName": "(string) tên nhóm quyền",
            "depots": [
                {
                    "id": "(int) ID kho hàng 1",
                    "name": "(string) Tên kho hàng 1"
                },
                {
                    "id": "(int) ID kho hàng 2",
                    "name": "(string) Tên kho hàng 2"
                }
            ]
        },
        {
            "id": "(int) ID nhân viên 2",
            "username": "(string) Tài khoản đăng nhập 2",
            "fullName": "(string) Họ và tên 2",
            "email": "(string) Email",
            "mobile": "(string) Số điện thoại",
            "roleName": "(string) tên nhóm quyền",
            "depots": [
                {
                    "id": "(int) ID kho hàng",
                    "name": "(string) Tên kho hàng"
                }
            ]
        }
    ]
}
```


# Danh sách phòng ban

* API này dùng để lấy [danh sách phòng ban](https://nhanh.vn/store/user/department).

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/hxpf03p/business-department).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/business/department?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "status": 1
    },
    "paginator": {
        "size": 100,
        "next": ""
    }
}'
```

### Filters

| Key    | Type   | Description                                              |
| ------ | ------ | -------------------------------------------------------- |
| name   | string | Tên phòng ban                                            |
| code   | string | Mã phòng ban                                             |
| status | int    | <p>Trạng thái phòng ban (1 = Active<br>2 = Inactive)</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Giá trị để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID phòng ban 1",
      "parentId": "(int) ID phòng ban cha",
      "code": "(string) Mã phòng ban",
      "name": "(string) Tên phòng ban",
      "status": "(int) Trạng thái phòng ban",
      "createdAt": "(timestamp) Thời gian tạo phòng ban"
    },
    {
      "id": "(int) ID phòng ban 2",
      "parentId": "(int) ID phòng ban cha",
      "code": "(string) Mã phòng ban",
      "name": "(string) Tên phòng ban",
      "status": "(int) Trạng thái phòng ban",
      "createdAt": "(timestamp) Thời gian tạo phòng ban"
    }
  ]
}
```


# Danh sách nhà cung cấp

* API này dùng để lấy [danh sách nhà cung cấp](https://nhanh.vn/supplier/manage/index).

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/0f3ouhi/business-supplier).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/business/supplier?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {

    }
}'
```

### Filters

| Name | Type | Description     |
| ---- | ---- | --------------- |
| id   | int  | ID nhà cung cấp |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```javascript
{
    "code": 1,
    "paginator": {
        "next": "Giá trị để lấy dữ liệu trang tiếp theo"
    },
    "data": [
        {
          "id": "(int) Id nhà cung cấp 1",
          "name": "(string) Tên nhà cung cấp 1",
          "mobile": "(string) Số điện thoại nhà cung cấp 1"
        },
        {
          "id": "(int) Id nhà cung cấp 2",
          "name": "(string) Tên nhà cung cấp 2",
          "mobile": "(string) Số điện thoại nhà cung cấp 2"
        }
    ]
}
```


# Thêm nhà cung cấp

* API này dùng để [thêm mới nhà cung cấp](https://nhanh.vn/supplier/manage/add).

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/business/addsupplier?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Test API V3",
    "code": "",
    "mobile": "",
    "email": "",
    "address": "",
    "taxCode": "",
    "typeId": 1,
    "personalId": "",
    "status": 1,
    "bank" : {
        "name": "VP Bank",
        "branch": "Hoàn Kiếm",
        "accountNumber": "6868686",
        "accountHolder": "Lê Văn A"
    },
    "note": ""
}'
```

* Thông tin nhập nhà cung cấp:

| Key        | Type                          | Description                                                 |
| ---------- | ----------------------------- | ----------------------------------------------------------- |
| name       | string $$^{{\color{red}\*}}$$ | Tên nhà cung cấp                                            |
| code       | string                        | Mã code nhà cung cấp                                        |
| mobile     | string                        | Số điện thoại nhà cung cấp                                  |
| email      | string                        | Email nhà cung cấp                                          |
| address    | string                        | Địa chỉ nhà cung cấp                                        |
| taxCode    | string                        | Mã số thuế nhà cung cấp                                     |
| typeId     | int                           | <p>Loại nhà cung cấp<br>1 = Cá nhân<br>2 = Doanh nghiệp</p> |
| personalId | string                        | Số căn cước công dân hoặc CMND                              |
| note       | string                        | Ghi chú                                                     |
| bank       | object                        | [Thông tin thanh toán](#payment)                            |

### payment

* Thông tin thanh toán

| Key           | Type   | Description                 |
| ------------- | ------ | --------------------------- |
| name          | string | Tên ngân hàng NCC           |
| branch        | string | Tên chi nhánh ngân hàng NCC |
| accountNumber | string | Số tài khoản NCC            |
| accountHolder | string | Tên người đại diện          |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
        "data": {
            "id": "(int) ID nhà cung cấp",
            "status": "(int) Trạng thái nhà cung cấp (1: Đang giao dịch, 2: Ngừng giao dịch",
    }
}
```


# Danh sách sản phẩm

* Tính năng này dùng để lấy [danh sách sản phẩm](https://nhanh.vn/product/item/index). Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 100 sản phẩm.
* Bạn nên lưu giá trị thời gian lần cuối cùng quét toàn bộ, sau đó dùng 2 request params là updatedAtFrom và updatedAtTo để chỉ lấy về các sản phẩm có cập nhật mới, không cần gọi lại toàn bộ dữ liệu cũ không có thay đổi gì.
  * **Chú ý**: updatedAt sẽ chỉ bao gồm thông tin sản phẩm (tên, giá bán...) bị thay đổi, không bao gồm thông tin tồn kho của sản phẩm. Để cập nhật tồn kho, bạn nên đăng ký [webhooks tồn kho](/v3/webhooks/inventory)

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/ztjv6p0/product-list).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/product/list?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
    	"ids": [100, 101],
    	"status": [1,2]
    },
    "paginator": {
        "size": 50,
        "sort": {"id": "desc"},
        "next": {"id": 100}
    }
}'
```

### Filters

| Key           | Type   | Description                                                                                                                                           |
| ------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| ids           | array  | Mảng ID sản phẩm, tối đa 100                                                                                                                          |
| name          | string | Tên, mã, mã vạch sản phẩm                                                                                                                             |
| parentId      | int    | ID sản phẩm cha                                                                                                                                       |
| gpid          | int    | <p>Lọc sản phẩm cha con:<br>-1: Sản phẩm độc lập<br>-2: Sản phẩm cha<br>1: Sản phẩm con<br>2: Sản phẩm cha + độc lập<br>3: Sản phẩm con + độc lập</p> |
| categoryIds   | array  | [List ID danh mục sản phẩm](/v3/product/category) (Khi lọc danh mục cha sẽ tự lấy toàn bộ sản phẩm thuộc danh mục con)                                |
| status        | array  | [Trạng thái sản phẩm](/v3/modelconstant#product-type)                                                                                                 |
| price         | array  | {"from": "Từ giá trị", "to": "Đến giá trị"}                                                                                                           |
| brandIds      | array  | [List ID thương hiệu](/v3/product/brand) (Khi lọc thương hiện cha sẽ tự lấy toàn bộ sản phẩm thuộc thương hiệu con)                                   |
| imei          | string | IMEI                                                                                                                                                  |
| updatedAtFrom | int    | Cập nhật sản phẩm từ ngày (định dạng timestamp)                                                                                                       |
| updatedAtTo   | int    | Cập nhật sản phẩm đến ngày (định dạng timestamp)                                                                                                      |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

#### sort

| Value | Description | Sort                          |
| ----- | ----------- | ----------------------------- |
| id    | ID sản phẩm | desc: giảm dần, asc: tăng dần |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
	"code": 1,
	"paginator": {
		"next": "Dùng để lấy dữ liệu trang tiếp theo"
	},
	"data": [
		{
			"id": "(int) ID sản phẩm trên Nhanh.vn",
			"parentId": "(int) ID sản phẩm cha",
			"code": "(string) Mã",
			"barcode": "(string) Mã vạch",
			"name": "(string) Tên",
			"otherName": "(string) Tên khác",
			"status": "(int) Trạng thái",
			"priceVatMode": "(int) 1: Giá bán lẻ đã bao gồm VAT, 2: Giá bán lẻ chưa bao gồm VAT",
			"importPriceVatMode": "(int) 1: Giá nhập đã bao gồm VAT, 2: Giá nhập chưa bao gồm VAT",
			"categoryId": "(int) ID danh mục",
			"internalCategoryId": "(int) ID danh mục nội bộ",
			"prices": {
				"retail": "(double) Giá bán lẻ",
				"retailVat": "(double) Giá trị VAT với giá bán lẻ",
				"import": "(double) Giá nhập",
				"importVat": "(double) Giá trị VAT với giá nhập",
				"old": "(double) Giá bán cũ",
				"wholesale": "(double) Giá bán sỉ",
				"avgCost": "(double) Giá vốn"
			},
			"images": {
				"avatar": "(string) Đường dẫn tới file ảnh",
				"others": [
					"(string) Đường dẫn tới file ảnh"
				]
			},
			"warranty": {
				"month": "(int) Số tháng bảo hành",
				"phone": "(string) Số điện thoại bảo hành",
				"address": "(string) Địa chỉ bảo hảnh"
			},
			"brandId": "(int) ID thương hiệu",
			"type": "(int) Loại sản phẩm",
			"shipping": {
				"width": "(double) Chiều rộng",
				"height": "(double) Chiểu cao",
				"length": "(double) Chiều dài",
				"weight": "(double) Khối lượng"
			},
			"countryName": "(string) Tên quốc gia",
			"units": {
				"name": "(string) Đơn vị tính",
				"list": [
					{
						"id": "(int) ID đơn vị tính",
						"name": "(string) Tên đơn vị tính",
						"quantity": "(double) Số lượng",
						"price": {
							"retail": "(double) Giá bán lẻ",
							"import": "(double) Giá nhập",
							"wholesale": "(double) Giá bán sỉ"
						}
					}
				]
			},
			"combos": [
				{
					"id": "(int) ID sản phẩm",
					"code": "(string) Mã sản phẩm",
					"name": "(string) Tên sản phẩm",
					"quantity": "(int) Số lượng"
				}
			],
			"inventory": {
				"remain": "(double) Số lượng tồn kho tất cả các kho",
				"shipping": "(double) Số lượng đang giao hàng tất cả các kho",
				"damaged": "(double) Số lượng lỗi tất cả các kho",
				"holding": "(double) Số lượng tạm giữ tất cả các kho",
				"transfering": "(double) Số đang chuyển kho tất cả các kho",
				"available": "(double) Số lượng có thể bán tất cả các kho",
				"warranty": {
					"remain": "(double) Số lượng bảo hành tất cả các kho",
					"holding": "(double) Số lượng tạm giữ bảo hành tất cả các kho"
				},
				"depots": [
					{
						"id": "(int) ID kho hàng",
						"remain": "(double) Số lượng tồn kho",
						"shipping": "(double) Số lượng giao hàng",
						"damaged": "(double) Số lượng lỗi",
						"holding": "(double) Số lượng tạm giữ",
						"transfering": "(double) Số lượng đang chuyển kho",
						"available": "(double) Số lượng có thể bán",
						"warranty": {
							"remain": "(double) Số lượng bảo hành",
							"holding": "(double) Số lượng tạm giữ bảo hành"
						}
					}
				]
			},
			"attributes": [
				{
					"id": "(int) ID giá trị thuộc tính",
					"name": "(string) Tên thuộc tính",
					"nameOther": "(string) Tên khác thuộc tính",
					"value": "(string) Giá trị thuộc tính",
					"code": "(string) Mã thuộc tính",
					"codeOther": "(string) Mã khác thuộc tính"
				}
			],
			"updatedAt": "(int) Thời gian cập nhật",
			"createdAt": "(int) Thời gian tạo",
    		"tagIds": "(array) Mảng ID nhãn"
		}
	]
}
```

## Lỗi thường gặp

### Thiếu số tồn so với trên danh sách sản phẩm

* Tình huống: Bạn gọi API `/v3.0/product/list` nhưng dữ liệu tồn kho khác với hiển thị trên giao diện [Danh sách sản phẩm](https://nhanh.vn/product/item/index)
* Nguyên nhân:
  * Lỗi này thường là do khi đăng nhập cấp quyền, user chỉ chọn 1 vài kho, nên số tồn bị giới hạn chỉ lấy ra ở các kho được chọn.
  * Bạn có thể dùng chức năng [Kiểm tra accessToken](https://apidocs.nhanh.vn/app#kiem-tra-access-token) để xem đang được phép lấy dữ liệu với các kho hàng nào.


# Thêm sản phẩm

* API này dùng để thêm sản phẩm, tối đa 100 sản phẩm / request.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/ztjv6p0/product-add).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/add?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '[
    {
        "appProductId": "PID001",
        "name": "Sản phẩm 1",
        "status": 1,
        "importPrice": 50000,
        "importPriceVatMode": 2,
        "importPriceVat": 8,
        "priceVatMode": 2,
        "vat": 8,
        "price": 100000,
        "oldPrice": 120000,
        "wholesalePrice": 80000,
        "shippingWeight": 300,
        "description": "Mô tả ngắn 1",
        "content": "Nội dung sản phẩm 1",
        "tagIds": [ID_1, ID_2]
    },
    {
        "appProductId": "PID002",
        "name": "Sản phẩm 2",
        "status": 2,
        "importPrice": 50000,
        "importPriceVatMode": 2,
        "importPriceVat": 8,
        "priceVatMode": 2,
        "vat": 8,
        "price": 200000,
        "oldPrice": 220000,
        "wholesalePrice": 80000,
        "shippingWeight": 300,
        "description": "Mô tả ngắn 2",
        "content": "Nội dung sản phẩm 2",
    }
]'
```

* Thông tin sản phẩm

| Key                | Type                               | Description                                                                                                                 |
| ------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| appProductId       | string $$^{{\color{red}\*}}$$      | ID sản phẩm trên hệ thống riêng của bạn                                                                                     |
| name               | string(255) $$^{{\color{red}\*}}$$ | Tên sản phẩm                                                                                                                |
| code               | string(255)                        | Mã sản phẩm                                                                                                                 |
| barcode            | string(255)                        | Mã vạch của sản phẩm                                                                                                        |
| shippingWeight     | double                             | Cân nặng cả vỏ hộp tính bằng gram, được sử dụng để tính phí vận chuyển khi đặt hàng.                                        |
| vat                | int                                | % thuế giá trị gia tăng (VD: 5, 8, 10,..)                                                                                   |
| priceVatMode       | int                                | 2: Giá chưa bao gồm VAT (mặc định), 1: Giá đã bao gồm VAT (Xem bảng mô tả [priceVatMode](/v3/modelconstant#price-vat-mode)) |
| price              | double                             | Giá bán của sản phẩm                                                                                                        |
| oldPrice           | double                             | Giá cũ sản phẩm                                                                                                             |
| importPrice        | double                             | Giá nhập của sản phẩm                                                                                                       |
| importPriceVatMode | int                                | 2: Giá chưa bao gồm VAT (mặc định), 1: Giá đã bao gồm VAT (Xem bảng mô tả [priceVatMode](/v3/modelconstant#price-vat-mode)) |
| importPriceVat     | double                             | % thuế giá trị gia tăng (VD: 5, 8, 10,..)                                                                                   |
| wholesalePrice     | double                             | Giá bán sỉ của sản phẩm                                                                                                     |
| status             | int                                | Xem bảng mô tả [trạng thái sản phẩm](/v3/modelconstant#product-status)                                                      |
| categoryId         | int                                | ID danh mục sản phẩm                                                                                                        |
| unit               | string                             | Đơn vị tính                                                                                                                 |
| type               | int                                | Loại sản phẩm [loại sản phẩm](/v3/modelconstant#product-type)                                                               |
| description        | text                               | Mô tả sản phẩm                                                                                                              |
| content            | text                               | Nội dung chi tiết sản phẩm                                                                                                  |
| tagIds             | array                              | [List ID nhãn sản phẩm](/v3/product/tags) (Lưu ý: tối đa chỉ được gắn 30 nhãn cho toàn bộ request)                          |
| comboItems         | array                              | Danh sách sản phẩm thuộc combo \[{ "productId": Id sản phẩm trên Nhanh, "quantity": Số lượng }]                             |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "id": "(int) ID sản phẩm trên Nhanh.vn",
      "appProductId": "(string) ID sản phẩm trên app của bạn",
      "barcode": "(string) Mã vạch"
    }
  ]
}
```


# Sửa sản phẩm

* API này dùng để sửa sản phẩm.
* Chú ý: Khác với API thêm sản phẩm truyền lên 1 mảng, API sửa sản phẩm là sửa từng sản phẩm, không phải 1 mảng sản phẩm.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/ztjv6p0/product-add).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/edit?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
      "id": "12401",
      "name": "Sản phẩm 3 mới tạo từ API V3 ngày 21/04/2025",
      "price": 100000,
      "importPrice": 50000,
      "oldPrice": 12500,
      "wholesalePrice": 9000,
      "shippingWeight": 300,
      "tagIds": [ID_1, ID_2]
}'
```

* Thông tin sản phẩm:

| Key                | Type                       | Description                                                                                                                 |
| ------------------ | -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| id                 | int $$^{{\color{red}\*}}$$ | ID sản phẩm trên Nhanh.vn                                                                                                   |
| name               | string(255)                | Tên sản phẩm                                                                                                                |
| code               | string(255)                | Mã sản phẩm                                                                                                                 |
| barcode            | string(255)                | Mã vạch của sản phẩm                                                                                                        |
| shippingWeight     | double                     | Cân nặng cả vỏ hộp tính bằng gram, được sử dụng để tính phí vận chuyển khi đặt hàng.                                        |
| vat                | int                        | % thuế giá trị gia tăng (VD: 5, 8, 10,..)                                                                                   |
| priceVatMode       | int                        | 2: Giá chưa bao gồm VAT (mặc định), 1: Giá đã bao gồm VAT (Xem bảng mô tả [priceVatMode](/v3/modelconstant#price-vat-mode)) |
| price              | double                     | Giá bán của sản phẩm                                                                                                        |
| oldPrice           | double                     | Giá cũ sản phẩm                                                                                                             |
| importPrice        | double                     | Giá nhập của sản phẩm                                                                                                       |
| importPriceVatMode | int                        | 2: Giá chưa bao gồm VAT (mặc định), 1: Giá đã bao gồm VAT (Xem bảng mô tả [priceVatMode](/v3/modelconstant#price-vat-mode)) |
| importPriceVat     | double                     | % thuế giá trị gia tăng (VD: 5, 8, 10,..)                                                                                   |
| wholesalePrice     | double                     | Giá bán sỉ của sản phẩm                                                                                                     |
| status             | int                        | Xem bảng mô tả [trạng thái sản phẩm](/v3/modelconstant#product-status)                                                      |
| categoryId         | int                        | ID danh mục sản phẩm                                                                                                        |
| unit               | string                     | Đơn vị tính                                                                                                                 |
| description        | text                       | Mô tả sản phẩm                                                                                                              |
| content            | text                       | Nội dung chi tiết sản phẩm                                                                                                  |
| tagIds             | array                      | [List ID nhãn sản phẩm](/v3/product/tags) (Lưu ý: 1 sản phẩm được gắn tối đa 30 nhãn)                                       |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "id": "(string) ID sản phẩm trên Nhanh.vn",
      "appProductId": "(int) ID sản phẩm trên app của bạn",
      "barcode": "(string) Mã vạch"
    }
  ]
}
```


# Chi tiết sản phẩm

* API này dùng để lấy thông tin chi tiết của sản phẩm.

## Request

* Xem các [common request params](/v3#request-params)
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/xvfzkfq/product-detail).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/detail?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "id": "123"
    }
}'
```

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": {
    "id": "(int) ID sản phẩm",
    "parentId": "(int) ID sản phẩm cha (-1: Sản phẩm độc lập, -2: Sản phẩm cha)",
    "code": "(string) Mã sản phẩm",
    "barcode": "(string) Mã vạch",
    "name": "(string) Tên sản phẩm",
    "otherName": "(string) Tên khác",
    "status": "(string) Trạng thái sản phẩm",
    "category": {
      "id": "(int) ID danh mục",
      "code": "(string) Mã danh mục",
      "name": "(string) Tên danh mục"
    },
    "internalCategory": {
      "id": "(int) ID danh mục nội bộ",
      "code": "(string) Mã danh mục nội bộ",
      "name": "(string) Tên danh mục nội bộ"
    },
    "prices": {
      "retail": "(double) Giá bán lẻ",
      "import": "(double) Giá nhập",
      "old": "(double) Giá bán cũ",
      "wholesale": "(double) Giá bán sỉ",
      "avgCost": "(double) Giá vốn"
    },
    "vat": "(int) VAT",
    "images": {
      "avatar": "(string) Đường dẫn tới file ảnh",
      "others": [
        "(string) Đường dẫn tới file ảnh"
      ]
    },
    "warranty": {
      "month": "(int) Số tháng bảo hành",
      "phone": "(string) Số điện thoại bảo hành",
      "address": "(string) Địa chỉ bảo hảnh"
    },
    "brand": {
      "id": "(int) ID thương hiệu",
      "name": "(string) Tên thương hiệu"
    },
    "type": {
      "id": "(int) ID loại sản phẩm",
      "name": "(string) Tên loại sản phẩm"
    },
    "shipping": {
      "length": "(int) Chiều dài",
      "width": "(int) Chiều rộng",
      "height": "(int) Chiều cao",
      "weight": "(int) Khối lượng"
    },
    "countryName": "(string) Tên quốc gia",
    "units": {
      "name": "(string) Đơn vị tính",
      "list": [
        {
          "id": "(int) ID đơn vị tính",
          "name": "(string) Tên đơn vị tính",
          "quantity": "(double) Số lượng",
          "price": {
            "retail": "(double) Giá bán lẻ",
            "import": "(double) Giá nhập",
            "wholesale": "(double) Giá bán sỉ"
          }
        }
      ]
    },
    "combos": [
      {
        "id": "(int) ID sản phẩm",
        "code": "(string) Mã sản phẩm",
        "name": "(string) Tên sản phẩm",
        "quantity": "(int) Số lượng"
      }
    ],
    "inventory": {
      "remain": "(double) Số lượng tồn kho tất cả các kho",
      "shipping": "(double) Số lượng đang giao hàng tất cả các kho",
      "damaged": "(double) Số lượng lỗi tất cả các kho",
      "holding": "(double) Số tạm giữ tất cả các kho",
      "transfering": "(double) Số lượng đang chuyển kho tất cả các kho",
      "warranty": "(double) Số lượng bảo hành tất cả các kho",
      "warrantyHolding": "(double) Số lượng tạm giữ bảo hành tất cả các kho",
      "holdingNew": "(double) Số lượng tạm giữ (loại xuất S) tất cả các kho",
      "shippingExport": "(double) Số lượng đang chuyển (loại xuất S) tất cả các kho",
      "available": "(double) Số lượng có thể bán tất cả các kho",
      "depots": [
        {
          "id": "(int) ID kho hàng",
          "remain": "(double) Số lượng tồn kho",
          "shipping": "(double) Số lượng đang giao hàng",
          "damaged": "(double) Số lượng lỗi",
          "holding": "(double) Số lượng tạm giữ",
          "transfering": "(double) Số lượng đang chuyển kho",
          "warranty": "(double) Số lượng bảo hành",
          "warrantyHolding": "(double) Số lượng tạm giữ bảo hành",
          "holdingNew": "(double) Số lượng tạm giữ (loại xuất S)",
          "shippingExport": "(double) Số lượng đang chuyển (loại xuất S)",
          "available": "(double) Số lượng có thể bán"
        }
      ]
    },
    "attributes": [
      {
        "id": "(int) ID giá trị thuộc tính",
        "name": "(string) Tên thuộc tính",
        "value": "(string) Giá trị thuộc tính",
        "order": "(int) Thứ tự hiển thị thuộc tính",
        "orderValue": "(int) Thứ tự giá trị thuộc tính"
      }
    ],
    "updatedAt": "(int) Thời gian cập nhật, định dạng timestamp",
    "createdAt": "(int) Thời gian tạo, định dạng timestamp",
    "description": "(string) Mô tả ngắn",
    "content": "(string) Nội dung bài viết chi tiết",
    "suppliers": {
      "id": "(int) ID nhà cung cấp",
      "name": "(string) Tên nhà cung cấp",
      "mobile": "(string) Số điện thoại"
    },
    "videos": [
      {
        "title": "(int) Tiêu đề",
        "src": "(int) Link đường dẫn tới video"
      }
    ],
    "branchPrices": [
      {
        "branch": {
          "id": "(int) ID chi nhánh",
          "name": "(string) Tên chi nhánh"
        },
        "price": "(int) Giá bán lẻ",
        "wholesalePrice": "(int) Giá bán sỉ"
      }
    ],
    "childs": "(array) Mảng thông tin sản phẩm con",
    "tagIds": "(array) Mảng ID nhãn"
  }
}
```


# Danh sách tồn kho

* Tính năng này dùng để lấy [danh sách tồn kho](https://nhanh.vn/product/item/inventory). Chú ý:
  * Khi gọi API lấy [danh sách sản phẩm](/v3/product/list) cũng có trả về tồn kho rồi kèm theo toàn bộ thông tin chi tiết của sản phẩm.
  * Nếu bạn chỉ muốn cập nhật riêng tồn kho, thì nên dùng API này thay vì dùng API lấy danh sách sản phẩm. Ưu điểm:
    * Dữ liệu nhẹ hơn, tốc độ nhanh hơn.
    * Có hỗ trợ lọc theo thời gian thay đổi số tồn, để chỉ cần quét các sản phẩm có thay đổi tồn, thay vì quét toàn bộ sản phẩm.
* Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 100 sản phẩm.
* Bạn nên lưu giá trị thời gian lần cuối cùng quét toàn bộ, sau đó dùng 2 request params là updatedAtFrom và updatedAtTo để chỉ lấy về các sản phẩm có cập nhật mới, không cần gọi lại toàn bộ dữ liệu cũ không có thay đổi gì.
  * **Chú ý**: updatedAt sẽ chỉ bao gồm thông tin sản phẩm (tên, giá bán...) bị thay đổi, không bao gồm thông tin tồn kho của sản phẩm. Để cập nhật tồn kho, bạn nên đăng ký [webhooks tồn kho](/v3/webhooks/inventory)

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/product/inventory?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
    },
    "paginator": {
        "size": 50,
        "next": {"id": 100}
    }
}'
```

### Filters

| Key           | Type   | Description                                           |
| ------------- | ------ | ----------------------------------------------------- |
| ids           | array  | Mảng ID sản phẩm, tối đa 100                          |
| name          | string | Tên, mã, mã vạch sản phẩm                             |
| depotIds      | array  | Id cửa hàng                                           |
| categoryId    | int    | Id danh mục sản phẩm                                  |
| status        | array  | [Trạng thái sản phẩm](/v3/modelconstant#product-type) |
| brandIds      | array  | ID thương hiệu                                        |
| updatedAtFrom | int    | Cập nhật sản phẩm từ ngày (định dạng timestamp)       |
| updatedAtTo   | int    | Cập nhật sản phẩm đến ngày (định dạng timestamp)      |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

#### sort

| Value     | Description | Sort                                     |
| --------- | ----------- | ---------------------------------------- |
| productId | ID sản phẩm | desc: giảm dần (mặc định), asc: tăng dần |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
	"code": 1,
	"paginator": {
		"next": "Dùng để lấy dữ liệu trang tiếp theo"
	},
	"data": [
		{
			"productId": "(int) Id sản phẩm",
			"barcode": "(string) Mã vạch",
			"name": "(string) Tên sản phẩm",
			"prices": {
				"retail": "(double) Giá bán",
				"wholesale": "(double) Giá sỉ",
				"import": "(double) Giá nhập",
				"avgCost": "(double) Giá vốn"
			},
			"inventory": {
				"remain": "(double) Số lượng tồn kho tất cả các kho",
				"shipping": "(double) Số lượng đang chuyển tất cả các kho",
				"damaged": "(double) Số lượng lỗi tất cả các kho",
				"holding": "(double) Số lượng tạm giữ tất cả các kho",
				"transfering": "(double) Số lượng đang chuyển kho tất cả các kho",
				"available": "(double) Số lượng có thể bán tất cả các kho",
				"warranty": {
					"remain": "(double) Số lượng bảo hành tất cả các kho",
					"holding": "(double) Số lượng tạm giữ bảo hành tất cả các kho"
				},
				"depots": [
					{
						"id": "(int) ID kho hàng",
						"remain": "(double) Số lượng tồn kho",
						"shipping": "(double) Số lượng đang chuyển",
						"damaged": "(double) Số lượng lỗi",
						"holding": "(double) Số lượng tạm giữ",
						"transfering": "(double) Số lượng đang chuyển kho",
						"available": "(double) Số lượng có thể bán",
						"warranty": {
							"remain": "(double) Số lượng bảo hành",
							"holding": "(double) Số lượng tạm giữ bảo hành"
						}
					}
				]
			}
		}
	]
}
```

## Lỗi thường gặp

### Thiếu số tồn so với trên danh sách sản phẩm

* Tình huống: Bạn gọi API `/v3.0/product/list` nhưng dữ liệu tồn kho khác với hiển thị trên giao diện [Danh sách sản phẩm](https://nhanh.vn/product/item/index)
* Nguyên nhân:
  * Lỗi này thường là do khi đăng nhập cấp quyền, user chỉ chọn 1 vài kho, nên số tồn bị giới hạn chỉ lấy ra ở các kho được chọn.
  * Bạn có thể dùng chức năng [Kiểm tra accessToken](https://apidocs.nhanh.vn/app#kiem-tra-access-token) để xem đang được phép lấy dữ liệu với các kho hàng nào.


# Danh mục sản phẩm

* API này dùng để lấy [danh mục sản phẩm](https://nhanh.vn/product/category/index).
* Danh mục sản phẩm thường rất ít khi bị thay đổi, bạn có thể lấy dữ liệu và cache khoảng 24h (và có chức năng để user có thể xóa cache, để lấy dữ liệu mới nhất khi cần) giúp giảm tải việc gọi API.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/svrw042/product-category).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/category?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "status": 1
    },
    "paginator": {
        "size": 50
    }
}'
```

### Filters

| Key    | Type   | Description                                             |
| ------ | ------ | ------------------------------------------------------- |
| ids    | array  | Mảng ID danh mục, tối đa 100                            |
| name   | string | Tên danh mục                                            |
| code   | string | Mã danh mục                                             |
| status | int    | <p>Trạng thái danh mục (1 = Active<br>2 = Inactive)</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID danh mục 1",
      "parentId": "(int) ID danh mục cha 1",
      "code": "(string) Mã danh mục 1",
      "name": "(string) Tên danh mục 1",
      "order": "(int) Thứ tự",
      "image": "(string) Đường dẫn ảnh danh mục",
      "content": "(string) Nội dung",
      "status": "(int) Trạng thái: 1 = Active, 2 = Inactive"
    },
   {
      "id": "(int) ID danh mục 2",
      "parentId": "(int) ID danh mục cha 2",
      "code": "(string) Mã danh mục 2",
      "name": "(string) Tên danh mục 2",
      "order": "(int) Thứ tự",
      "image": "(string) Đường dẫn ảnh danh mục",
      "content": "(string) Nội dung",
      "status": "(int) Trạng thái: 1 = Active, 2 = Inactive"
    }
  ]
}
```


# Danh mục nội bộ

* API này được sử dụng để lấy [danh mục nội bộ](https://nhanh.vn/product/category/internal).
* Danh mục nội bộ thường rất ít khi bị thay đổi, bạn có thể lấy dữ liệu và cache khoảng 24h (và có chức năng để user có thể xóa cache, để lấy dữ liệu mới nhất khi cần) giúp giảm tải việc gọi API.

## Request

* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/xvfzkfq/product-internalcategory).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/internalcategory?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "name": "Tên danh mục nội bộ"
    },
    "paginator": {
        "size": 50,
        "next": ""
    }
}'
```

### Filters

| Key  | Type   | Description                         |
| ---- | ------ | ----------------------------------- |
| ids  | array  | Mảng ID danh mục nội bộ, tối đa 100 |
| name | string | Tên danh mục                        |
| code | string | Mã danh mục                         |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": "Dùng để lấy dữ liệu trang tiếp theo"
    },
    "data": [
        {
            "id": "(int) ID danh mục nội bộ 1",
            "parentId": "(int) ID danh mục cha 1",
            "name": "(string) Tên danh mục 1",
            "code": "(string) Mã danh mục 1",
        },
        {
            "id": "(int) ID danh mục nội bộ 2",
            "parentId": "(int) ID danh mục cha 2",
            "name": "(string) Tên danh mục 2",
            "code": "(string) Mã danh mục 2",
        }
    ]
}
```


# Danh sách thương hiệu

* API này dùng để lấy [danh sách thương hiệu](https://nhanh.vn/product/brand/index).

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/svrw042/product-brand).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/brand?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "status": 1
    }
}'
```

### Filters

| Key    | Type   | Description                                                  |
| ------ | ------ | ------------------------------------------------------------ |
| ids    | array  | Mảng ID thương hiệu, tối đa 100                              |
| name   | string | Tên thương hiệu                                              |
| code   | string | Mã thương hiệu                                               |
| status | int    | <p>Trạng thái thương hiệu:<br>1 = Active<br>2 = Inactive</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Giá trị để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID thương hiệu 1",
      "code": "(string) Mã thương hiệu",
      "name": "(string) Tên thương hiệu",
      "status": "(int) Trạng thái thương hiệu",
      "parentId": "(int) ID thương hiệu cha",
      "createdAt": "(timestamp) Thời gian tạo thương hiệu"
    },
    {
      "id": "(int) ID thương hiệu 2",
      "code": "(string) Mã thương hiệu",
      "name": "(string) Tên thương hiệu",
      "status": "(int) Trạng thái thương hiệu",
      "parentId": "(int) ID thương hiệu cha",
      "createdAt": "(timestamp) Thời gian tạo thương hiệu"
    }
  ]
}
```


# Danh sách đơn vị tính

* API này dùng để lấy danh sách đơn vị tính của sản phẩm nhiều đơn vị tính.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/unit?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
         "productId": 1231279144
    },
    "paginator": {
        "size": 100
    }
}'
```

### Filters

| Key           | Type      | Description                |
| ------------- | --------- | -------------------------- |
| id            | int       | ID đơn vị tính             |
| productId     | int       | ID sản phẩm                |
| createdAtFrom | timestamp | Thời gian tạo sản phẩm từ  |
| createdAtTo   | timestamp | Thời gian tạo sản phẩm đến |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Giá trị để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID đơn vị tính",
      "productId": "(int) ID sản phẩm",
      "name": "(string) Tên đơn vị tính",
      "quantity": "(int) Số lượng quy đổi",
      "price": "(double) Giá bán lẻ",
      "wholesalePrice": " (double) Giá bán sỉ"
    },
    {
      "id": "(int) ID đơn vị tính",
      "productId": "(int) ID sản phẩm",
      "name": "(string) Tên đơn vị tính",
      "quantity": "(int) Số lượng quy đổi",
      "price": "(double) Giá bán lẻ",
      "wholesalePrice": " (double) Giá bán sỉ"
    }
  ]
}
```


# Danh sách lô hàng

* API này dùng để lấy danh sách lô hàng của sản phẩm bán theo lô.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/batch?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
         "productId": 1231279144
    },
    "paginator": {
        "size": 100
    }
}'
```

### Filters

| Key           | Type      | Description                                             |
| ------------- | --------- | ------------------------------------------------------- |
| id            | int       | ID đơn vị tính                                          |
| productId     | int       | ID sản phẩm                                             |
| status        | int       | <p>Trạng thái lô hàng<br>1 = Active<br>2 = Inactive</p> |
| createdAtFrom | timestamp | Thời gian tạo lô từ                                     |
| createdAtTo   | timestamp | Thời gian tạo lô đến                                    |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Giá trị để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID lô hàng",
      "productId": "(int) ID sản phẩm",
      "name": "(string) Tên đơn vị tính",
      "manufactureDate": "(string) Ngày sản xuất (Y-m-d)",
      "expiredDate": "(string) Ngày hết hạn (Y-m-d)",
      "status": "(int) Trạng thái lô hàng 1 = Active, 2 = Inactive",
      "createdAt": "(timestamp) Thời gian tạo lô hàng"
    },
    {
      "id": "(int) ID lô hàng",
      "productId": "(int) ID sản phẩm",
      "name": "(string) Tên đơn vị tính",
      "manufactureDate": "(string) Ngày sản xuất (Y-m-d)",
      "expiredDate": "(string) Ngày hết hạn (Y-m-d)",
      "status": "(int) Trạng thái lô hàng 1 = Active, 2 = Inactive",
      "createdAt": "(timestamp) Thời gian tạo lô hàng"
    }
  ]
}
```


# Hạn sử dụng sản phẩm

* API này dùng để lấy [hạn sử dụng sản phẩm](https://nhanh.vn/inventory/expire/index).

## Request

* Xem các [common request params](/v3#request-params)

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/expire?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "billId": "ID hóa đơn"
    },
}'
```

### Filters

| Key                | Type   | Description                                     |
| ------------------ | ------ | ----------------------------------------------- |
| billId             | int    | ID hóa đơn xuất nhập kho                        |
| depotId            | int    | ID kho hàng                                     |
| categoryId         | int    | ID danh mục của sản phẩm                        |
| internalCategoryId | int    | ID danh mục nội bộ của sản phẩm                 |
| expiredDateFrom    | string | Thời gian hết hạn từ, định dạng Y-m-d           |
| expiredDateTo      | string | Thời gian hết hạn đến, định dạng Y-m-d          |
| daysWarningFrom    | int    | Số ngày cảnh báo trước từ                       |
| daysWarningTo      | int    | Số ngày cảnh báo trước đến                      |
| status             | int    | <p>Trạng thái<br>1 = Active<br>2 = Inactive</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Giá trị để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "depot": {
        "id": "(int) ID kho hàng",
        "name": "(string) Tên kho hàng"
      },
      "product": {
        "id": "(int) ID sản phẩm",
        "name": "(string) Tên sản phẩm"
      },
      "billId": "(int) ID xuất nhập kho",
      "quantity": "(double) Số lượng",
      "expiredDate": "(string) Thời gian hết hạn, định dạng Y-m-d",
      "priorWarningDays": "(int) Số ngày cảnh báo trước",
      "status": "(int) Trạng thái"
    }
  ]
}
```


# Quà tặng sản phẩm

* Tính năng này dùng để lấy danh sách quà tặng theo sản phẩm. Hỗ trợ tìm kiếm thông qua ID sản phẩm.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/zg05uhc/product-gift).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/gift?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "ids": [100,101]
    },
    "paginator": {
        "size": 50
    }
}'
```

### Filters

| Key | Type  | Description                   |
| --- | ----- | ----------------------------- |
| ids | array | Mảng ID sản phẩm cần tìm kiếm |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "categoryId": "(int) ID danh mục",
      "quantity": "(int) Số lượng quà tặng",
      "value": "(int) Giá trị quà tặng",
      "promotion": {
        "id": "(int) ID chương trình khuyến mại",
        "startDate": "(string) Ngày bắt đầu",
        "endDate": "(string) Ngày kết thúc",
        "status": "(int) Trạng thái: 1 = Active, 2 = Inactive"
      },
      "product": {
        "id": "(int) ID sản phẩm",
        "code": "(string) Mã sản phẩm",
        "name": "(string) Tên sản phẩm"
      },
      "gift": {
        "id": "(int) ID sản phẩm quà tặng",
        "code": "(string) Mã sản phẩm quà tặng",
        "name": "(string) Tên sản phẩm quả tặng"
      },
      "createdAt": "(int) Thời gian tạo (định dạng timestamp)"
    }
  ]
}
```


# Danh sách IMEI

* API này dùng để lấy [danh sách IMEI của sản phẩm](https://nhanh.vn/product/imei/index).

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/product/imei).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/imei?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "status": 1
    },
    "paginator": {
        "size": 50
    }
}'
```

### Filters

| Key       | Type   | Description                                                                                                                                                                                                                      |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| productId | int    | ID sản phẩm                                                                                                                                                                                                                      |
| imei      | string | IMEI sản phẩm                                                                                                                                                                                                                    |
| depotId   | int    | ID kho hàng                                                                                                                                                                                                                      |
| status    | int    | <p>Trạng thái IMEI<br>1 = Mới<br>2 = Đã bán<br>3 = Đang vận chuyển<br>5 = Lỗi<br>6 = Đã trả nhà cung cấp<br>7 = Tồn trong cửa hàng<br>8 = Đang chuyển kho<br>9 = Đang bảo hành<br>10 = Đã trả bảo hành<br>11 = Hàng Demo<br></p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "shopProductId": "(string) ID sản phẩm website tích hợp",
      "product": {
        "id": "(int) ID sản phẩm",
        "name": "(string) Tên sản phẩm",
        "code": "(string) Mã sản phẩm",
        "barcode": "(string) Mã vạch sản phẩm"
      },
      "depot": {
        "id": "(int) ID kho hàng",
        "name": "(string) Tên kho hàng"
      },
      "imei": "(string) Số IMEI",
      "price": "(int) Giá bán",
      "importPrice": "(int) Giá nhập",
      "description": "(string) Mô tả",
      "status": "(int) Trạng thái IMEI",
      "warranty": {
        "month": "(int) Số tháng bảo hành",
        "expiredDate": "(string) Ngày hết hạn"
      },
      "extendedWarranty": {
        "id": "(int) ID gói bảo hành mở rộng",
        "name": "(string) Tên gói bảo hành mở rộng",
        "month": "(int) Số tháng bảo hành mở rộng"
      },
      "createdAt": "(int) Thời gian tạo (định dạng timestamp)",
      "activatedAt": "(int) Thời gian kích hoạt (định dạng timestamp)"
    }
  ]
}
```


# Lịch sử IMEI

* Tính năng này dùng để lấy danh sách lịch sử của IMEI trên Nhanh.vn. Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 100 lịch sử.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/product/imeihistory).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/imeihistory?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "imei": "9316254891976"
    },
    "paginator": {
        "size": 100
    }
}'
```

### Filters

| Key  | Type                          | Description   |
| ---- | ----------------------------- | ------------- |
| imei | string $$^{{\color{red}\*}}$$ | IMEI sản phẩm |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "step": {
        "id": "(int) Hành động",
        "name": "(string) Tên hành động"
      },
      "itemType": "(int) Loại phiếu ( 1 = Hóa đơn, 2 = Hóa đơn khách hàng, 3 = Đơn hàng, 4 = Bảo hành, 5 = Chuyển kho)",
      "itemId": "(int) ID phiếu",
      "supplier": {
        "id": "(int) ID nhà cung cấp",
        "name": "(string) Tên nhà cung cấp"
      },
      "sale": {
        "id": "(int) ID nhân viên bán hàng",
        "name": "(string) Tên nhân viên bán hàng"
      },
      "product": {
        "id": "(int) ID sản phẩm",
        "name": "(string) Tên sản phẩm",
        "code": "(string) Mã sản phẩm",
        "barcode": "(string) Mã vạch sản phẩm"
      },
      "createdAt": "Thời gian tạo (định dạng timestamp)"
    }
  ]
}
```


# Tra cứu IMEI bán ra theo ngày

* Tính năng này dùng để tra cứu danh sách IMEI bán ra theo ngày ở trên Nhanh.vn. Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 50 IMEI.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/product/imeisold).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/imeisold?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        productIds: [100, 101]
    },
    "paginator": {
        "size": 100
    }
}'
```

### Filters

| Key        | Type   | Description                              |
| ---------- | ------ | ---------------------------------------- |
| productIds | array  | Mảng ID sản phẩm                         |
| fromDate   | string | Xuất nhập kho từ ngày (định dạng Y-m-d)  |
| toDate     | string | Xuất nhập kho đến ngày (định dạng Y-m-d) |
| imei       | string | Số IMEI                                  |
| brandId    | int    | ID thương hiệu                           |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID xuất nhập kho",
      "imei": "(string) Số IMEI",
      "date": "(string) Ngày xuất nhập kho",
      "mode": "(int) Kiểu xuất nhập kho",
      "depot": {
        "id": "(int) ID kho hàng",
        "name": "(string) Tên kho hàng"
      },
      "product": {
        "id": "(int) ID sản phẩm",
        "name": "(string) Tên sản phẩm",
        "code": "(string) Mã sản phẩm",
        "price": "(int) Giá bán sản phẩm"
      },
      "customer": {
        "id": "(int) ID khách hàng",
        "code": "(string) Mã khách hàng",
        "mobile": "(string) Số điện thoại khách hàng",
        "name": "(string) Tên khách hàng",
        "email": "(string) Email khách hàng",
        "address": "(string) Địa chỉ khách hàng"
      }
    }
  ]
}
```


# Danh sách nhãn sản phẩm

* API này dùng để lấy danh sách [nhãn sản phẩm](https://nhanh.vn/setting/store/labels).
* Chú ý: Dữ liệu này rất ít khi bị thay đổi, bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 24h.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/product/tags?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
         "ids": [ID_1,ID_2]
    },
    "paginator": {
        "size": 100
    }
}'
```

### Filters

| Key  | Type   | Description           |
| ---- | ------ | --------------------- |
| ids  | array  | List ID nhãn sản phẩm |
| name | string | Tên nhãn sản phẩm     |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": {
      "id": "92220"
    }
  },
  "data": [
    {
      "id": "(int) ID nhãn sản phẩm",
      "businessId": "(int) ID doanh nghiệp",
      "name": "(string) Tên nhãn sản phẩm",
      "status": "(int) Trạng thái sản phẩm",
      "bgColor": "(string) Màu nền",
      "textColor": "(string) Màu chữ",
      "createdAt": "(int) Thời gian tạo - định dạng timestamp"
    }
  ]
}
```


# Danh sách sản phẩm nhà cung cấp

* Tính năng này dùng để lấy [danh sách sản phẩm nhà cung cấp](https://nhanh.vn/supplier/product/index). Chú ý:
* Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 100 sản phẩm.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/product/supplierproduct?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
    },
    "paginator": {
        "size": 100,
        "next": {"id": 100}
    }
}'
```

### Filters

| Key           | Type  | Description                                      |
| ------------- | ----- | ------------------------------------------------ |
| productIds    | array | Mảng ID sản phẩm, tối đa 100                     |
| supplierIds   | array | Mảng ID nhà cung cấp, tối đa 100                 |
| createdAtFrom | int   | Ngày tạo sản phẩm từ ngày (định dạng timestamp)  |
| createdAtTo   | int   | Ngày tạo sản phẩm đến ngày (định dạng timestamp) |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

#### sort

| Value | Description              | Sort                                     |
| ----- | ------------------------ | ---------------------------------------- |
| id    | ID sản phẩm nhà cung cấp | desc: giảm dần (mặc định), asc: tăng dần |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
	"code": 1,
	"paginator": {
		"next": "Dùng để lấy dữ liệu trang tiếp theo"
	},
	"data": [
		{
			"productId": "(int) Id sản phẩm",
			"supplierId": "(int) Id nhà cung cấp",
			"supplierProductCode": "(string) Mã sản phẩm nhà của cung cấp",
			"createdAt": "(int) Thời gian tạo sản phẩm"
		}
	]
}
```


# Danh sách sản phẩm combo

* Tính năng này dùng để lấy danh sách sản phẩm combo. Chú ý:
* Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 50 sản phẩm.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn//v3.0/product/combo?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
    },
    "paginator": {
        "size": 50,
        "next": {"id": 100}
    }
}'
```

### Filters

| Key              | Type   | Description                                                                                                            |
| ---------------- | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| productParentIds | array  | Mảng ID sản phẩm combo, tối đa 50                                                                                      |
| name             | string | Tên, mã, mã vạch sản phẩm                                                                                              |
| categoryIds      | array  | [List ID danh mục sản phẩm](/v3/product/category) (Khi lọc danh mục cha sẽ tự lấy toàn bộ sản phẩm thuộc danh mục con) |
| status           | array  | [Trạng thái sản phẩm](/v3/modelconstant#product-type)                                                                  |
| price            | array  | {"from": "Từ giá trị", "to": "Đến giá trị"}                                                                            |
| brandIds         | array  | [List ID thương hiệu](/v3/product/brand) (Khi lọc thương hiện cha sẽ tự lấy toàn bộ sản phẩm thuộc thương hiệu con)    |
| updatedAtFrom    | int    | Cập nhật sản phẩm từ ngày (định dạng timestamp)                                                                        |
| updatedAtTo      | int    | Cập nhật sản phẩm đến ngày (định dạng timestamp)                                                                       |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

#### sort

| Value           | Description       | Sort                                     |
| --------------- | ----------------- | ---------------------------------------- |
| productParentId | ID sản phẩm combo | asc: tăng dần (mặc định), desc: giảm dần |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
	"code": 1,
	"paginator": {
		"next": "Dùng để lấy dữ liệu trang tiếp theo"
	},
	"data": [
      {
        "id": "(int) Id sản phẩm combo",
        "comboName": "(string) Tên sản phẩm combo",
        "comboCode": "(string) Mã sản phẩm combo",
        "avgCost": "(float) Giá nhập",
        "comboItems": [
          {
            "id": "(int) Id sản phẩm con trong combo",
            "code": "(string) Mã sản phẩm con trong combo",
            "name": "(string) Tên sản phẩm con trong combo",
            "avgCost": "(float) Giá nhập sản phẩm con trong combo",
            "price": "(float) Giá bán sản phẩm con trong combo",
            "qty": "(int) Số lượng sản phẩm con trong combo"
          },
          {
            "id": "(int) Id sản phẩm con trong combo",
            "code": "(string) Mã sản phẩm con trong combo",
            "name": "(string) Tên sản phẩm con trong combo",
            "avgCost": "(float) Giá nhập sản phẩm con trong combo",
            "price": "(float) Giá bán sản phẩm con trong combo",
            "qty": "(int) Số lượng sản phẩm con trong combo"
          }
        ]
      }
	]
}
```


# Danh sách đơn hàng

* API này dùng để lấy [danh sách đơn hàng](https://nhanh.vn/order/manage/index).
* **Chú ý:**
  * Hệ thống chỉ hỗ trợ lấy đơn hàng trong 31 ngày.
  * Hệ thống đang hỗ trợ lọc dữ liệu theo 3 loại ngày:
    * createdAtFrom, createdAtTo: Lọc theo ngày tạo đơn hàng.
    * deliveryAtFrom, deliveryAtTo: Lọc theo ngày giao hàng.
    * updatedAtFrom, updatedAtTo: Lọc theo ngày cập nhật đơn hàng.
  * Nếu bạn không truyền param createdAtFrom mặc định sẽ lấy 31 ngày gần nhất. Nếu bạn muốn lấy dữ liệu các ngày cũ hơn, xin vui lòng truyền createdAtFrom và createdAtTo trong khoảng 31 ngày.
  * Nếu bạn lọc theo id đơn hàng hoặc id khách hàng (hoặc số điện thoại khách hàng) thì có thể bỏ qua việc bắt buộc lọc createdAtFrom, createdAtTo.
  * Nếu bạn hay thường xuyên cần gọi toàn bộ đơn hàng, bạn nên lưu giá trị thời gian lần cuối cùng quét toàn bộ, sau đó dùng 2 request params là updatedAtFrom và updatedAtTo để chỉ lấy về các đơn hàng có cập nhật mới, không cần gọi lại toàn bộ đơn cũ không có thay đổi gì. updatedAtFrom và updatedAtTo cũng bị giới hạn trong vòng 31 ngày, khi bạn lọc theo updatedAtFrom và updatedAtTo sẽ không bị bắt buộc có createdAtFrom và createdAtTo nữa.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/w7aichy/order-list).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/order/list?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {},
    "paginator": {
        "size": 50
    },
    "dataOptions": {}
}'
```

### Filters

| Key             | Type  | Description                                                |
| --------------- | ----- | ---------------------------------------------------------- |
| createdAtFrom   | int   | Thời gian tạo từ ngày (định dạng timestamp)                |
| createdAtTo     | int   | Thời gian tạo đến này (định dạng timestamp                 |
| deliveryAtFrom  | int   | Thời gian giao hàng từ ngày (định dạng timestamp)          |
| deliveryAtTo    | int   | Thời gian giao hàng đến ngày (định dạng timestamp)         |
| updatedAtFrom   | int   | Thời gian cập nhật từ ngày (định dạng timestamp)           |
| updatedAtTo     | int   | Thời gian cập nhật đến ngày (định dạng timestamp)          |
| ids             | array | Mảng ID đơn hàng                                           |
| statuses        | array | Mảng [trạng thái đơn hàng](/v3/modelconstant#order-status) |
| saleChannels    | array | Mảng ID [kênh bán](/v3/modelconstant#order-sale-channel)   |
| depotIds        | array | Mảng ID kho hàng                                           |
| type            | int   | [Loại đơn hàng](/v3/modelconstant#order-type)              |
| handoverId      | int   | ID biên bản bàn giao                                       |
| carrier         | array | Thông tin [hãng vận chuyển](#carrier)                      |
| shippingAddress | array | Thông tin [người nhận hàng](#shippingAddress)              |

#### carrier

* Thông tin vận chuyển

| Key  | Type   | Description                |
| ---- | ------ | -------------------------- |
| id   | int    | ID hãng vận chuyển         |
| code | string | Mã vận đơn hãng vận chuyển |

#### shippingAddress

* Thông tin người nhận hàng

| Key        | Type   | Description        |
| ---------- | ------ | ------------------ |
| id         | int    | ID người nhận hàng |
| mobile     | string | Số điện thoại      |
| cityId     | int    | ID thành phố       |
| districtId | int    | ID quận/huyện      |
| wardId     | int    | ID phường/xã       |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

### DataOptions

* Dữ liệu cần lấy thêm:

| Key        | Type | Description                                        |
| ---------- | ---- | -------------------------------------------------- |
| marketing  | int  | 1: Lấy thông tin utmSource, utmMedium, utmCampaign |
| comboItems | int  | 1: Lấy thông tin sản phẩm con trong combo          |

## Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

## Successful response

* Xem thêm các const của Order [tại đây](/v3/modelconstant#order).

```json
  {
      "code": 1,
      "paginator": {
        "next": "Dùng để lấy dữ liệu trang tiếp theo"
      },
      "data": [
          {
              "info": {},
              "channel": {},
              "shippingAddress": {},
              "products": [],
              "carrier": {},
              "payment": {},
              "gifts": []
          }
      ]
  }
```

### info

* Thông tin chung của đơn hàng

| Key                | Type   | Description                                     |
| ------------------ | ------ | ----------------------------------------------- |
| id                 | int    | ID đơn hàng                                     |
| depotId            | int    | ID kho hàng                                     |
| pickupDepotId      | int    | ID kho lấy hàng                                 |
| type               | int    | Loại đơn hàng                                   |
| mode               | int    | Loại giá bán                                    |
| exportType         | int    | Đánh dấu đơn hàng đã xuất kho thủ công hay chưa |
| originalOrderId    | int    | ID đơn hàng gốc                                 |
| returnFromId       | int    | Hoàn từ ID đơn hàng                             |
| idReturn           | int    | Trả từ ID đơn hàng                              |
| createdById        | int    | ID người tạo đơn hàng                           |
| createdByName      | string | Người tạo đơn hàng                              |
| saleId             | int    | ID nhân viên bán hàng                           |
| saleName           | string | Nhân viên bán hàng                              |
| packedById         | id     | ID nhân viên đóng gói                           |
| packedByName       | string | Nhân viên đóng gói                              |
| customerCareId     | int    | ID nhân viên chăm sóc                           |
| customerCareName   | string | Nhân viên chăm sóc                              |
| createdAt          | int    | Thời gian tạo                                   |
| updatedAt          | int    | Thời gian cập nhật lần cuối cùng                |
| confirmedAt        | int    | Thời gian xác nhận                              |
| packedAt           | int    | Thời gian đóng gói                              |
| description        | string | Ghi chú khách hàng                              |
| privateDescription | string | Ghi chú của chăm sóc khách hàng                 |
| orderIndex         | int    | Số thứ tự đơn trong ngày                        |
| status             | int    | Trạng thái đơn hàng                             |
| reason             | int    | ID lý do hủy đơn hàng                           |
| handoverIds        | array  | Mảng ID biên bản bàn giao                       |
| trackingUrl        | string | Link lịch trình đơn hàng                        |
| tags               | array  | Mảng nhãn đơn hàng (xem bảng bên dưới)          |

#### tags

| Key       | Type   | Description |
| --------- | ------ | ----------- |
| id        | string | ID nhãn     |
| name      | string | Tên nhãn    |
| textColor | string | Màu chữ     |
| bgColor   | string | Màu nền     |
| status    | int    | Trạng thái  |

### channel

* Thông tin kênh bán

| Key            | Type   | Description                                                                                                                                                          |
| -------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| appOrderId     | string | ID website tích hợp hoặc ID đơn hàng trên sàn (Shopee, Tiktok, Lazada...)                                                                                            |
| saleChannel    | int    | Kênh bán                                                                                                                                                             |
| trafficSource  | string | Nguồn đơn hàng                                                                                                                                                       |
| pageId         | string | Tạo từ pageId                                                                                                                                                        |
| conversationId | string | Tạo từ cuộc trò chuyện                                                                                                                                               |
| fbAdsId        | int    | Facebook ads ID                                                                                                                                                      |
| fbPsid         | int    | Facebook PSID                                                                                                                                                        |
| domain         | string | Tên miền                                                                                                                                                             |
| shopId         | int    | ID gian hàng                                                                                                                                                         |
| shopName       | string | Tên gian hàng                                                                                                                                                        |
| affiliate      | object | <p>Thông tin tiếp thị liên kết<br>- code: Mã affiliate<br>- value: Giá trị affiliate<br>- bonus: Hoa hồng affiliate<br>- bonusRate: Phần trăm Hoa hồng affiliate</p> |
| marketting     | object | <p>Thông tin marketting<br>- utmSource: Utm Source<br>- utmMedium: Utm Medium<br>- utmCampaign: Utm Campaign</p>                                                     |

### shippingAddress

* Thông tin người nhận hàng

| Key            | Type   | Description         |
| -------------- | ------ | ------------------- |
| id             | int    | ID khách hàng       |
| code           | string | Mã khách hàng       |
| name           | string | Tên khách hàng      |
| mobile         | string | Số điện thoại       |
| email          | string | Email               |
| address        | string | Địa chỉ             |
| birthday       | string | Ngày tháng năm sinh |
| cityId         | int    | ID tỉnh / thành phố |
| districtId     | int    | ID quận / huyện     |
| wardId         | int    | ID phường / xã      |
| companyName    | string | Tên công ty         |
| companyAddress | string | Địa chỉ công ty     |
| taxCode        | string | Mã số thuế công ty  |

### products

* Mảng thông tin sản phẩm

| Key                 | Type   | Description                                                                                                                                                                                                                                                                                                                            |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| productId           | int    | ID sản phẩm                                                                                                                                                                                                                                                                                                                            |
| orderProductId      | int    | ID sản phẩm trong đơn hàng                                                                                                                                                                                                                                                                                                             |
| typeId              | int    | Loại sản phẩm                                                                                                                                                                                                                                                                                                                          |
| code                | string | Mã sản phẩm                                                                                                                                                                                                                                                                                                                            |
| name                | string | Tên sản phẩm                                                                                                                                                                                                                                                                                                                           |
| appProductId        | string | ID sản phẩm website tích hợp                                                                                                                                                                                                                                                                                                           |
| weight              | int    | Khối lượng sản phẩm                                                                                                                                                                                                                                                                                                                    |
| quantity            | int    | Số lượng                                                                                                                                                                                                                                                                                                                               |
| price               | int    | Giá bán chưa VAT                                                                                                                                                                                                                                                                                                                       |
| originalPrice       | int    | Giá gốc                                                                                                                                                                                                                                                                                                                                |
| priceVatMode        | int    | <p><br>- 1: Giá bán đã bao gồm<br>- 2: Giá bán chưa bao gồm VAT</p>                                                                                                                                                                                                                                                                    |
| priceAfterVAT       | int    | Giá bán đã bao gồm VAT                                                                                                                                                                                                                                                                                                                 |
| discount            | int    | Chiết khấu với số lượng 1                                                                                                                                                                                                                                                                                                              |
| discountAmount      | int    | Tổng chiết khấu sản phẩm                                                                                                                                                                                                                                                                                                               |
| avgCost             | int    | Giá vốn                                                                                                                                                                                                                                                                                                                                |
| vatPercent          | int    | Giá trị VAT                                                                                                                                                                                                                                                                                                                            |
| description         | string | Ghi chú sản phẩm                                                                                                                                                                                                                                                                                                                       |
| imeiId              | int    | ID IMEI bán                                                                                                                                                                                                                                                                                                                            |
| imei                | string | Số IMEI bán                                                                                                                                                                                                                                                                                                                            |
| imeiIds             | array  | Mảng ID IMEI đã bán                                                                                                                                                                                                                                                                                                                    |
| imeiCodes           | array  | <p>Mảng số IMEI đã bán<br>- id: ID IMEI<br>- code: Số IMEI</p>                                                                                                                                                                                                                                                                         |
| priceListName       | string | Tên bảng giá áp dụng                                                                                                                                                                                                                                                                                                                   |
| transactionFee      | int    | Phí giao dịch                                                                                                                                                                                                                                                                                                                          |
| paymentStatus       | int    | Trạng thái thanh toán                                                                                                                                                                                                                                                                                                                  |
| partialReturnStatus | int    | Trạng thái giao hàng một phần                                                                                                                                                                                                                                                                                                          |
| usedPoints          | int    | Số điểm đã tiêu                                                                                                                                                                                                                                                                                                                        |
| usedPointAmount     | int    | Số tiền tương ứng điểm đã tiêu                                                                                                                                                                                                                                                                                                         |
| batch               | object | <p>Thông tin lô hàng<br>- id: ID lô<br>- name: Tên lô<br>- manufactureDate: Ngày sản xuất<br>- expiredDate: Ngày hết hạn</p>                                                                                                                                                                                                           |
| unit                | object | <p>Thông tin đơn vị tính<br>- id: ID đơn vị tính<br>- name: Tên đơn vị tính<br>- quantity: Số lượng theo đơn vị tính<br>- price: Giá theo đơn vị tính chưa VAT<br>- priceAfterVAT: Giá theo đơn vị tính đã bao gồm VAT</p>                                                                                                             |
| partialDelivery     | object | <p>Thông tin giao hàng một phần<br>- deliveredQuantity: Số lượng khách nhận<br>- deliveredUnitQuantity: Số lượng khách nhận theo đơn vị tính<br>- returnQuantity: Số lượng hoàn về<br>- returnUnitQuantity: Số lượng hoàn về theo đơn vị tính<br>- lostQuantity: Số lượng mất<br>- lostUnitQuantity: Số lượng mất theo đơn vị tính</p> |
| combos              | array  | Mảng sản phẩm con trong combo (xem bảng bên dưới)                                                                                                                                                                                                                                                                                      |
| totalAmount         | int    | Tổng tiền sản phẩm sau VAT, sau chiết khấu                                                                                                                                                                                                                                                                                             |

#### combos

* Mảng sản phẩm con trong combo

| Key      | Type   | Description  |
| -------- | ------ | ------------ |
| id       | int    | ID sản phẩm  |
| code     | string | Mã sản phẩm  |
| name     | string | Tên sản phẩm |
| quantity | int    | Số lượng     |

### carrier

* Thông tin vận chuyển

| Key                  | Type   | Description                                                                                                                                                                                              |
| -------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | int    | ID hãng vận chuyển                                                                                                                                                                                       |
| name                 | string | Hãng vận chuyển                                                                                                                                                                                          |
| service              | object | <p>Dịch vụ vận chuyển<br>- id: ID dịch vụ vận chuyể<br>- code: Mã dịch vụ vận chuyển<br>- name: Tên dịch vụ vận chuyển<br>- type: Loại dịch vụ vận chuyển<br>- typeName: Tên loại dịch vụ vận chuyển</p> |
| carrierCode          | string | Mã vận đơn                                                                                                                                                                                               |
| fullCarrierCode      | string | Mã hãng vận chuyển đầy đủ                                                                                                                                                                                |
| carrierSortCode      | string | Mã chia vận đơn                                                                                                                                                                                          |
| packageCode          | string | Mã gói hàng                                                                                                                                                                                              |
| checkGoods           | string | Kiểm tra hàng hóa                                                                                                                                                                                        |
| sendCarrierType      | int    | Hình thức kết nối vận chuyển                                                                                                                                                                             |
| sendCarrierAt        | int    | Thời gian gửi vận chuyển                                                                                                                                                                                 |
| deliveryAt           | int    | Thời gian giao hàng thành công                                                                                                                                                                           |
| isPartDelivery       | int    | <p><br>- 1: Đơn giao hàng một phần<br>- 0: Không giao hàng một phần</p>                                                                                                                                  |
| isDeclaredFee        | int    | <p><br>- 1: Khai giá<br>- 0: Không khai giá</p>                                                                                                                                                          |
| declaredValue        | int    | Giá trị khai giá                                                                                                                                                                                         |
| declaredFee          | int    | Phí khai giá                                                                                                                                                                                             |
| carrierPromotionCode | string | Mã khuyến mại vận chuyển                                                                                                                                                                                 |
| weight               | int    | Trọng lượng đơn hang khai báo                                                                                                                                                                            |
| shipFee              | int    | Phí vận chuyển                                                                                                                                                                                           |
| codFee               | int    | Phí thu tiền hộ                                                                                                                                                                                          |
| overWeightShipFee    | int    | Phí vượt cân                                                                                                                                                                                             |
| returnFee            | int    | Phí chuyển hoàn                                                                                                                                                                                          |
| customerShipFee      | int    | Phí ship báo khách                                                                                                                                                                                       |
| ecomFee              | int    | Tổng các loại phí trên sàn                                                                                                                                                                               |
| carrierPaymentStatus | int    | Trạng thái đối soát đơn hàng với hãng vận chuyển                                                                                                                                                         |

### payment

* Thông tin thanh toán

| Key                   | Type   | Description                                                                                                                                               |
| --------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| usedPoints            | object | <p>Tiêu điểm<br>- points: Số điểm đã tiêu<br>- amount: Số tiền tương ứng đã tiêu</p>                                                                      |
| vat                   | object | <p>VAT<br>- percent: Giá trị VAT. Ví dụ: 5%, 8%<br>- amount: Số tiền VAT<br>- taxCode: Mã số thuế<br>- taxDate: Ngày xuất hóa đơn</p>                     |
| discount              | object | <p>Chiết khấu đơn hàng<br>- percent: Giá trị chiết khấu. Ví dụ: 5%, 8%<br>- amount: Số tiền chiết khấu</p>                                                |
| couponCode            | string | Mã giảm giá                                                                                                                                               |
| debtDueDate           | string | Ngày hẹn thanh toán                                                                                                                                       |
| deposit               | object | <p>Tiền đặt cọc<br>- amount: Số tiền đặt cọc<br>- accountId: ID tài khoản kế toán nhận tiền<br>- name: Tên tài khoản kế toán</p>                          |
| transfer              | object | <p>Tiền chuyển khoản<br>- amount: Số tiền chuyển khoản<br>- accountId: ID tài khoản kế toán nhận tiền<br>- name: Tên tài khoản kế toán</p>                |
| credit                | object | <p>Tiền quẹt thẻ<br>- amount: Số tiền quẹt thẻ<br>- accountId: ID tài khoản kế toán nhận tiền<br>- code: Mã quẹt thẻ<br>- name: Tên tài khoản kế toán</p> |
| codAmount             | int    | Tổng thu khách hàng                                                                                                                                       |
| businessPayment       | int    | Tổng tiền trả cho doanh nghiệp sau khi đã trừ các loại phí phải trả cho dịch vụ vận chuyển                                                                |
| businessPaymentStatus | int    | Trạng thái thanh toán tiền với doanh nghiệp                                                                                                               |

### gifts

* Mảng thông tin quà tặng

| Key            | Type   | Description                                                                                                                              |
| -------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| productId      | int    | ID sản phẩm                                                                                                                              |
| orderProductId | int    | <p>ID sản phẩm trong đơn hàng<br>- Giá trị lớn hơn 0 thì là quà tặng theo sản phẩm<br>- Giá trị bằng 0 thì là quà tặng theo đơn hàng</p> |
| name           | string | Tên sản phẩm                                                                                                                             |
| quantity       | int    | Số lượng                                                                                                                                 |
| price          | string | Giá trị quà tặng                                                                                                                         |

## Lỗi thường gặp

* Bạn gọi API lấy danh sách đơn hàng, nhưng lại thấy nhiều đơn hàng hơn trên giao diện cho user, hoặc lấy từ API về, thấy 1 ID đơn hàng, nhưng tìm ở danh sách đơn hàng lại không thấy đơn này. Nguyên nhân:
  * Trên giao diện, do luồng xử lý đơn ngoại sàn và đơn trên các sàn khác nhau, nên giao diện tách ra mấy trang danh sách đơn hàng riêng:
    * <https://nhanh.vn/order/manage/index>: Đơn ngoại sàn
    * <https://nhanh.vn/ecommerce/shopee/order>: Đơn Shopee
    * <https://nhanh.vn/ecommerce/tiktok/order>: Đơn Tiktok
    * <https://nhanh.vn/ecommerce/lazada/order>: Đơn Lazada
    * <https://nhanh.vn/ecommerce/tiki/order>: Đơn Tiki
  * `/v3.0/order/list` trả về toàn bộ danh sách đơn hàng, bạn có thể filter theo kênh bán `saleChannel`.


# Thêm đơn hàng

* API này dùng để tạo đơn hàng mới.
* Nếu đơn có gắn kho hàng (depotId) sẽ áp dụng các logic tính số **Tạm giữ** và **Đang chuyển** như đơn tạo từ trang quản trị của Nhanh.vn. Ví dụ một sản phẩm trên hệ thống đang tồn 10, tạm giữ 1, sau khi API có bắn về thêm một đơn hàng trạng thái **Mới**, số lượng = 1, **có gắn depotId**, thì hệ thống sẽ tự động tính toán lại số Tạm giữ = 2.
* **Chú ý**: [Cài đặt vận chuyển](https://nhanh.vn/setting/order/index#connect-carrier) trên Nhanh.vn hỗ trợ 2 hình thức kết nối với các hãng vận chuyển, bạn cần hiểu rõ doanh nghiệp đang dùng hình thức kết nối nào để gọi [API tính phí vận chuyển](/v3/shipping/fee), và lấy các thông tin cần thiết dùng cho API tạo đơn hàng.
  * [Kết nối có sẵn của Nhanh.vn](/v3/shipping/fee#carrier-nhanh-account): Mọi kế nối đi qua tài khoảng bảng giá chung của Nhanh.
  * [Kết nối tài khoản riêng của shop](/v3/shipping/fee#carrier-shop-account): Doanh nghiệp dùng tài khoản vận chuyển đã đăng ký với các hãng vận chuyển.
  * Khi truyền chiết khấu theo đơn hàng, sau khi đơn hàng được lưu thì chiết khấu đơn hàng sẽ được chia theo tỉ lệ cho các sản phẩm có trong đơn hàng.
* Mỗi khi trạng thái đơn hàng có sự thay đổi, app của bạn sẽ nhận được 1 [webhooks cập nhật trạng thái đơn hàng từ Nhanh.vn](/v3/webhooks/order).

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/81g47kb/order-add).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/order/add?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "info": {
    "type": 1,
    "depotId": 31010,
    "saleId": 2054197,
    "createdById": 2054197,
    "description": "Giao hàng trong giờ hành chính",
    "tagIds": [266, 265]
  },
  "channel": {
    "appOrderId": "7JnexpUBr12082025_1",
    "sourceName": "NGUỒN NEW 1"
  },
  "shippingAddress": {
    "name": "Nguyễn Văn Cường",
    "mobile": "0928937476",
    "cityId": 254,
    "districtId": 321,
    "wardId": 1116,
    "address": "170 La Thành",
    "locationVersion": "v1"
  },
  "carrier": {
    "sendCarrierType": 2,
    "id": 2,
    "serviceCode": "PHS",
    "accountId": 26,
    "shopId": 808957,
    "customerShipFee": 30000,
    "isDeclaredFee": 1,
    "declaredValue": 1000000,
    "extraServices": {
      "isDocument": 1,
      "handDelivery": 1
    },
    "orderPackage": {
      "weight": 800,
      "length": 50,
      "width": 35,
      "height": 10,
      "merge": 0
    }
  },
  "products": [
    {
      "id": 1231281071,
      "price": 189000,
      "discount": 9000,
      "imeis": ["IMEI số 1", "IMEI số 2"],
      "quantity": 2
    },
    {
      "id": 1231253490,
      "price": 109000,
      "vat": 8,
      "quantity": 1,
      "gifts": [
        {
            "id": 1231279483,
            "quantity": 1,
            "price": 20000
        }
      ]
    }
  ],
  "payment": {
    "depositAmount": 50000,
    "depositAccountId": 266363,
    "transferAmount": 100000,
    "transferAccountId": 263475
  },
  "invoice": {
    "tax": {
      "type": 2,
      "code": "0108824877",
      "name": "CÔNG TY CỔ PHẦN NHANH.VN",
      "address": "Tầng 2 phòng 206 Tòa nhà GP Invest, Số 170 đường La Thành, Phường Ô Chợ Dừa, Thành phố Hà Nội, Việt Nam",
      "citizenIdNumber": null,
      "passportNumber": null
    },
    "contact": {
       "name": "Nguyễn Văn Anh",
       "mobile": "0987654321",
       "email": "email_1@gmail.com",
       "email2": "email_2@gmail.com"
    }
  }
}'
```

* Thông tin trong mảng đơn hàng:

| Key             | Type   | Description                                                     |
| --------------- | ------ | --------------------------------------------------------------- |
| info            | object | [Thông tin cơ bản của đơn hàng](#info)                          |
| channel         | object | [Các dữ liệu liên quan kênh bán hàng](#channel)                 |
| shippingAddress | object | [Địa chỉ nhận hàng của khách](#shipping-address)                |
| carrier         | object | [Thông tin dịch vụ vận chuyển](#carrier)                        |
| products        | array  | [Mảng sản phẩm trong đơn hàng](#products). Tối đa 500 sản phẩm. |
| payment         | object | [Thông tin thanh toán](#payment)                                |

### info

* Thông tin cơ bản của đơn hàng

| Key                | Type   | Description                                                                                                                                                                        |
| ------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| depotId            | int    | ID kho hàng lấy từ [danh sách kho hàng](/v3/business/depot)                                                                                                                        |
| type               | int    | [Loại đơn hàng](/v3/modelconstant#order-type), mặc định: Giao hàng tận nhà                                                                                                         |
| saleId             | int    | ID nhân viên bán hàng lấy từ [danh sách nhân viên](/v3/business/user)                                                                                                              |
| createdById        | int    | ID người tạo đơn hàng lấy từ [danh sách nhân viên](/v3/business/user)                                                                                                              |
| description        | string | Ghi chú đơn hàng                                                                                                                                                                   |
| privateDescription | string | Ghi chú chăm sóc khách hàng                                                                                                                                                        |
| status             | int    | <p>Trạng thái dơn hàng.<br>Các trạng thái được phép cập nhật: Mới, Chờ xác nhận, Đang xác nhận, Đã xác nhận (Lấy từ <a href="/v3/modelconstant#order-status">Order Status</a>)</p> |
| tagIds             | array  | [Mảng ID nhãn đơn hàng](/v3/order/tags)                                                                                                                                            |

### channel

* Các dữ liệu liên quan kênh bán hàng

| Key        | Type                          | Description                                                                                                        |
| ---------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| appOrderId | string $$^{{\color{red}\*}}$$ | ID đơn hàng trên app của bạn. NhanhAPI sẽ chặn trùng theo appId + appOrderId.                                      |
| sourceName | string                        | Tên nguồn đơn hàng                                                                                                 |
| affiliate  | object                        | <p>Gắn thông tin liên kết<br>code: Mã giới thiệu<br>value: Tiền chiết khấu<br>bonus: Tiền hoa hồng</p>             |
| marketing  | object                        | <p>Gắn link đo đếm marketing<br>utmCampaign: utm\_campaign<br>utmSource: utm\_source<br>utmMedium: utm\_medium</p> |

### shipping address

* Địa chỉ nhận hàng của khách

| Key             | Type                          | Description                                                                                                                 |
| --------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| name            | string $$^{{\color{red}\*}}$$ | Họ và tên                                                                                                                   |
| mobile          | string $$^{{\color{red}\*}}$$ | Số điện thoại                                                                                                               |
| email           | string                        | Email                                                                                                                       |
| address         | string                        | Địa chỉ                                                                                                                     |
| cityId          | int                           | ID Tỉnh/thành phố lấy từ [danh sách địa chỉ](/v3/shipping/location)                                                         |
| districtId      | int                           | ID Quận/huyện lấy từ [danh sách địa chỉ](/v3/shipping/location) (bắt buộc khi là địa chỉ 3 cấp)                             |
| wardId          | int                           | ID Phường/xã lấy từ [danh sách địa chỉ](/v3/shipping/location)                                                              |
| locationVersion | string                        | <p>v1: Địa chỉ 3 cấp (Tỉnh / Thành phố, Quận / Huyện, Phường / Xã)<br>v2: Địa chỉ 2 cấp (Tỉnh / Thành phố, Phường / Xã)</p> |

### carrier

* Thông tin dịch vụ vận chuyển. Chú ý trên Nhanh có 2 hình thức kết nối vận chuyển:
  * Dùng kết nối có sẵn của Nhanh.vn: Bạn cần truyền sendCarrierType = 1 và id, serviceId. Bạn cần truyền thêm id kho hàng (info.depotId) khi dùng loại này.
  * Dùng kết nối tài khoản riêng của Shop: Bạn cần truyền sendCarrierType = 2 và serviceCode, accountId, shopId (nếu có).

| Key             | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id              | int    | ID hãng vận chuyển                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| sendCarrierType | int    | <p>Biến đánh dấu gửi đơn dùng bảng giá vận chuyển<br>1: Dùng kết nối có sẵn của Nhanh.vn<br>2: Dùng kết nối tài khoản riêng của shop</p>                                                                                                                                                                                                                                                                                                                         |
| serviceId       | int    | ID dịch vụ vận chuyển **required** khi **sendCarrierType = 1**. Lấy từ [tính phí vận chuyển](/v3/shipping/fee#carrier-nhanh-account)                                                                                                                                                                                                                                                                                                                             |
| serviceCode     | string | Mã dịch vụ hãng vận chuyển, **required** khi **sendCarrierType = 2**. Lấy từ [tính phí vận chuyển](/v3/shipping/fee#carrier-shop-account)                                                                                                                                                                                                                                                                                                                        |
| accountId       | int    | ID tài khoản kết nối, **required** khi **sendCarrierType = 2**. Lấy từ [tính phí vận chuyển](/v3/shipping/fee#carrier-shop-account).                                                                                                                                                                                                                                                                                                                             |
| shopId          | int    | ID cửa hàng trên hệ thống hãng vận chuyển, khi **sendCarrierType = 2**, tùy hãng vận chuyển sẽ có thêm thông tin shopId. Lấy từ [tính phí vận chuyển](/v3/shipping/fee#carrier-shop-account)                                                                                                                                                                                                                                                                     |
| allowTest       | int    | <p>Cho khách xem hàng:<br>1: Cho xem hàng, không cho thử<br>2: Cho phép thử<br>3: Không cho xem hàng<br>4: Cho xem, không lấy thu ship</p>                                                                                                                                                                                                                                                                                                                       |
| deliveryDate    | string | Ngày giao hàng của đơn hàng này, định dạng yyyy-mm-dd                                                                                                                                                                                                                                                                                                                                                                                                            |
| deliveryTime    | string | Giờ phút giây giao hàng của đơn hàng này, định dạng H:i:s hoặc H:i                                                                                                                                                                                                                                                                                                                                                                                               |
| customerShipFee | int    | Phí ship báo khách (Bạn có thể điền 0 nếu báo với khách hàng là miễn phí vận chuyển, hoặc điền các giá trị cố định như 20K, 30K, hoặc lấy theo tổng Phí vận chuyển shipFee + phí thu tiền hộ codFee + phí bảo hiểm declaredFee lấy từ [tính phí vận chuyển](/v3/shipping/fee)) )                                                                                                                                                                                 |
| isPartDelivery  | int    | 1: Đơn hàng có giao hàng một phần (mặc định null)                                                                                                                                                                                                                                                                                                                                                                                                                |
| isDeclaredFee   | int    | Khai giá (1: Có, 0: Không)                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| declaredValue   | int    | Giá trị khai giá                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| autoSend        | int    | Biến đánh dấu gửi luôn đơn hàng sang hãng vận chuyển (Dùng trong tình huống bạn có hệ thống xác nhận đơn hàng từ trước, chỉ dùng Nhanh để hỗ trợ vận chuyển). Set value = 1: Gửi luôn đơn hàng sang hãng vận chuyển. Nếu gửi thành công hệ thống sẽ trả về mã vận đơn carrierCode. Chú ý khi có tham số này, hệ thống sẽ phải kết nối sang hãng vận chuyển, nên thời gian phản hồi có thể bị chậm hơn bình thường tùy thuộc vào phản hồi của các hãng vận chuyển |
| extraServices   | object | <p>Mảng dịch vụ cộng thêm (chỉ áp dụng với kết nối tài khoản riêng của shop: sendCarrierType = 2)<br>- BEST:<br>+ Đổi trả hàng: isReturnGoods = 1<br>- Viettel:<br>+ Loại thư từ: isDocument = 1<br>+ Phát tận tay: handDelivery = 1</p>                                                                                                                                                                                                                         |
| orderPackage    | object | <p>Kích thước gói hàng<br>weight: Khối lượng gói hàng (gram)<br>length: Chiều dài (cm)<br>width: Chiều rộng (crm)<br>height: Chiều cao (crm)<br>merge: Gộp kiện (Truyền 1 nếu muốn gộp kiện)</p>                                                                                                                                                                                                                                                                 |

### products

* Mảng sản phẩm trong đơn hàng

| Key          | Type                          | Description                                                                                                                                                                                                                                                                                      |
| ------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id           | int $$^{{\color{red}\*}}$$    | ID sản phẩm trên Nhanh.vn                                                                                                                                                                                                                                                                        |
| price        | double $$^{{\color{red}\*}}$$ | Giá bán                                                                                                                                                                                                                                                                                          |
| quantity     | double $$^{{\color{red}\*}}$$ | Số lượng                                                                                                                                                                                                                                                                                         |
| imeis        | array                         | Mảng IMEI sản phẩm                                                                                                                                                                                                                                                                               |
| vat          | double                        | % VAT. VD: 5, 8, 10 (chỉ gửi số, không gửi kèm ký tự %). Chú ý: Các giá trị đặc biệt như 0%, Không chịu thuế, Không kê khai nộp thuế xem const [tại đây](/v3/modelconstant#product-vat). Mặc định nếu bạn không truyền tham số này, hệ thống sẽ lấy theo thông tin khai báo ở Danh sách sản phẩm |
| priceVatMode | int                           | <p>Loại giá bán (mặc định nếu không truyền thì sẽ lấy theo khai báo ở thông tin sản phẩm):<br>1: Giá bán đã bao gồm VAT<br>2: Giá bán chưa bao gồm VAT</p>                                                                                                                                       |
| discount     | double                        | Chiết khấu theo tổng số lượng sản phẩm                                                                                                                                                                                                                                                           |
| description  | string                        | Mô tả riêng của từng sản phẩm trong đơn hàng                                                                                                                                                                                                                                                     |
| gifts        | array                         | Quà tặng của sản phẩm trong đơn hàng \[ {"id": "id sản phẩm 1 trên Nhanh", "quantity": "Số lượng", "price": "Giá sản phẩm quà tặng"}, {"id": "id sản phẩm 2 trên Nhanh", "quantity": "Số lượng", "price": "Giá sản phẩm quà tặng"} ]                                                             |

* Ví dụ về loại giá bán:
  * Giá bán đã bao gồm VAT: priceVatMode = 1, price = 100000, vat = 10% thì Tổng tiền thanh toán sẽ là 100.000
  * Giá bán chưa bao gồm VAT: priceVatMode = 2, price = 100000, vat = 10% thì Tổng tiền thanh toán sẽ là 110.000

### payment

* Thông tin thanh toán

| Key               | Type   | Description                                                                                                                                                                                                                                                            |
| ----------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| depositAmount     | int    | Số tiền đặt cọc                                                                                                                                                                                                                                                        |
| depositAccountId  | int    | Tài khoản nhận tiền đặt cọc lấy từ [danh sách tài khoản kế toán](/v3/accounting/account)                                                                                                                                                                               |
| transferAmount    | int    | Số tiền chuyển khoản                                                                                                                                                                                                                                                   |
| transferAccountId | int    | Tài khoản nhận tiền chuyển khoản lấy từ [danh sách tài khoản kế toán](/v3/accounting/account)                                                                                                                                                                          |
| couponCode        | string | <p>Mã giảm giá<br>- Nếu mã couponCode được tạo từ Nhanh thì hệ thống sẽ tự động tăng số lần đã sử dụng hoặc đổi trạng thái khi đơn hàng được lưu thành công.<br>- Các lỗi liên quan tới couponCode tham khảo <a href="#khong-ap-dung-duoc-ma-coupon">bên dưới</a>.</p> |
| usedPoints        | int    | Số điểm tiêu                                                                                                                                                                                                                                                           |
| discountAmount    | int    | <p>Giá trị chiết khấu<br>(Khi áp dụng chiết khấu theo cả đơn hàng thì truyền giá trị này, còn khi đã áp dụng chiết khấu theo sản phẩm thì không cần truyền)</p>                                                                                                        |
| discountType      | string | <p>Loại chiết khấu<br>cash: Tiền<br>percent: Phần trăm</p>                                                                                                                                                                                                             |

### invoice

* Thông tin xuất hóa đơn điện tử
* Để sử dụng được tạo hóa đơn điện tử:
  * Doanh nghiệp cần mua hóa đơn của Nhanh và cài đặt ở Kênh bán > [Hóa đơn điện tử](https://nhanh.vn/invoice/setting/index).

| Key     | Type   | Description                                                                                                                                                                                                                                                                                                                                                          |
| ------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tax     | object | <p>Thông tin xuất hóa đơn<br>- type: 1: Hộ kinh doanh, 2: Công ty, 3: Cá nhân<br>- code: Mã số thuế Hộ kinh doanh / Công ty<br>- name: Tên Hộ kinh doanh / Công ty / Cá nhân<br>- address: Địa chỉ Hộ kinh doanh / Công ty / Cá nhân<br>- citizenIdNumber: Số căn cước công dân (dùng cho loại cá nhân)<br>- passportNumber: Số hộ chiếu (dùng cho loại cá nhân)</p> |
| contact | object | <p>Thông tin người nhận hóa đơn<br>- name: Tên người nhận hóa đơn<br>- mobile: Số điện thoại người nhận hóa đơn<br>- email: Email người nhận hóa đơn<br>- email2: Email người cùng nhận hóa đơn</p>                                                                                                                                                                  |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
  {
      "code": 1,
      "data": {
        "id": "(int) ID đơn hàng",
        "trackingUrl": "(string) Lịch trình đơn hàng",
        "carrierCode": "(string) Mã vận đơn hãng vận chuyển (trả về trong trường hợp truyền carrier.autoSend = 1)"
      }
  }
```

## Lỗi thường gặp

### Không áp dụng được mã coupon

* Tình huống: Bạn gửi sang mã coupon, nhưng không thấy đơn hàng cập nhật giá trị chiết khấu từ coupon, hoặc bản gửi sang cả chiết khấu và coupon, nhưng đơn hàng chỉ nhận chiết khấu, không cộng thêm giá trị từ coupon.
* Nguyên nhân: trường coupon chỉ có tác dụng ghi nhận đơn hàng đó được áp dụng coupon nào, Nhanh OpenAPI không dùng mã coupon đó để tính toán là giá trị chiết khấu. Mọi logic về chiết khấu, app của bạn cần tự tính toán, có thể cộng dồn nhiều loại chiết khấu khác, sau đó cho hết vào field `payment.discountAmount`.


# Sửa đơn hàng

* Tính năng này cho phép cập nhật một số thông tin đơn hàng như: thông tin cơ bản (ghi chú, trạng thái, gắn tags), địa chỉ nhận hàng của khách, thông tin dịch vụ vận chuyển, thông tin thanh toán. Bạn chỉ nên truyền những thông tin cần thay đổi (tránh việc truyền hết các params hệ thống hỗ trợ nhưng để giá trị trống, vì khi đó hệ thống hiểu bạn đang muốn xóa dữ liệu đó đi).
* Đơn hàng đã gửi sang hãng vận chuyển hoặc trạng thái Thành công, Đã hoàn không được phép sửa.
* Hạn chế:
  * API này chưa hỗ trợ sửa sản phẩm trong đơn hàng.
  * Đơn hàng sàn (Shopee, Tiktok, Lazada) không hỗ trợ cập nhật thông tin dịch vụ vận chuyển, thông tin thanh toán.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/yix7eqv/order-edit).
* Dưới đây là một số ví dụ:
* Cập nhật thông tin cơ bản của đơn hàng

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/order/edit?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "info": {
        "id": 14903497,
        "status": 56,
        "privateDescription": "Xác nhận đơn hàng qua API"
    }
}'
```

* Cập nhật thông tin địa chỉ nhận hàng của khách

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/order/edit?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "info": {
         "id": 14903497
    },
    "shippingAddress": {
         "name": "Nguyễn Văn A",
         "mobile": "0987654321",
         "address": "170 Đê La Thành, Phường Ô Chợ Dừa, Hà Nội",
         "cityId": 254,
         "wardId": 1116,
         "locationVersion": "v2"
    }
}'
```

* Thông tin trong mảng đơn hàng:

| Key             | Type   | Description                                      |
| --------------- | ------ | ------------------------------------------------ |
| info            | object | [Thông tin cơ bản của đơn hàng](#info)           |
| shippingAddress | object | [Địa chỉ nhận hàng của khách](#shipping-address) |
| carrier         | object | [Thông tin dịch vụ vận chuyển](#carrier)         |
| payment         | object | [Thông tin thanh toán](#payment)                 |

### info

* Thông tin cơ bản của đơn hàng

| Key                | Type                       | Description                                                                                                                                                                                    |
| ------------------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | int $$^{{\color{red}\*}}$$ | ID đơn hàng                                                                                                                                                                                    |
| description        | string                     | Ghi chú đơn hàng                                                                                                                                                                               |
| privateDescription | string                     | Ghi chú chăm sóc khách hàng                                                                                                                                                                    |
| status             | int                        | <p>Trạng thái đơn hàng.<br>Các trạng thái được phép cập nhật: Đã xác nhận, Khách hủy, Hệ thống hủy, Thành công, Đã hoàn (Lấy từ <a href="/v3/modelconstant#order-status">Order Status</a>)</p> |
| tagIds             | array                      | Mảng ID nhãn đơn hàng                                                                                                                                                                          |

### shipping address

* Địa chỉ nhận hàng của khách

| Key             | Type   | Description                                                                                                                 |
| --------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| name            | string | Họ và tên                                                                                                                   |
| mobile          | string | Số điện thoại                                                                                                               |
| email           | string | Email                                                                                                                       |
| address         | string | Địa chỉ                                                                                                                     |
| cityId          | int    | ID Tỉnh/thành phố lấy từ [danh sách địa chỉ](/v3/shipping/location)                                                         |
| districtId      | int    | ID Quận/huyện lấy từ [danh sách địa chỉ](/v3/shipping/location) (bắt buộc khi là địa chỉ 3 cấp)                             |
| wardId          | int    | ID Phường/xã lấy từ [danh sách địa chỉ](/v3/shipping/location)                                                              |
| locationVersion | string | <p>v1: Địa chỉ 3 cấp (Tỉnh / Thành phố, Quận / Huyện, Phường / Xã)<br>v2: Địa chỉ 2 cấp (Tỉnh / Thành phố, Phường / Xã)</p> |

### carrier

* Thông tin dịch vụ vận chuyển

| Key             | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id              | int    | ID hãng vận chuyển                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| serviceId       | int    | ID dịch vụ vận chuyển                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| sendCarrierType | int    | <p>Biến đánh dấu gửi đơn dùng bảng giá vận chuyển<br>1: Dùng bảng giá của Nhanh.vn<br>2: Dùng bảng giá kết nối tài khoản riêng của doanh nghiệp</p>                                                                                                                                                                                                                                                                                                              |
| serviceCode     | string | Mã dịch vụ hãng vận chuyển, required khi sendCarrierType = 2, Lấy từ [/api/shipping/feeselfconnect](https://github.com/nvndocs/docs-pos-openapi/blob/v3/docs/shipping/shippingfee.md#tinh-phi-tu-ket-noi)                                                                                                                                                                                                                                                        |
| accountId       | int    | ID tài khoản kết nối, required khi sendCarrierType = 2, Lấy từ [/api/shipping/feeselfconnect](https://github.com/nvndocs/docs-pos-openapi/blob/v3/docs/shipping/shippingfee.md#tinh-phi-tu-ket-noi).                                                                                                                                                                                                                                                             |
| shopId          | int    | ID cửa hàng trên hệ thống hãng vận chuyển (Lấy từ [/api/shipping/feeselfconnect](https://github.com/nvndocs/docs-pos-openapi/blob/v3/docs/shipping/shippingfee.md#tinh-phi-tu-ket-noi) nếu có)                                                                                                                                                                                                                                                                   |
| allowTest       | int    | <p>1: Cho xem hàng, không cho thử<br>2: Cho phép thử<br>3: Không cho xem hàng<br>4: Cho xem, không lấy thu ship</p>                                                                                                                                                                                                                                                                                                                                              |
| deliveryDate    | string | Ngày giao hàng của đơn hàng này, định dạng yyyy-mm-dd                                                                                                                                                                                                                                                                                                                                                                                                            |
| customerShipFee | int    | Phí ship báo khách (Bạn có thể điền 0 nếu báo với khách hàng là miễn phí vận chuyển, hoặc điền các giá trị cố định như 20K, 30K, hoặc lấy theo tổng Phí vận chuyển shipFee + phí thu tiền hộ codFee + phí bảo hiểm declaredFee lấy từ [/api/shipping/fee](https://github.com/nvndocs/docs-pos-openapi/blob/v3/docs/shipping/shippingfee.md)) )                                                                                                                   |
| autoSend        | int    | Biến đánh dấu gửi luôn đơn hàng sang hãng vận chuyển (Dùng trong tình huống bạn có hệ thống xác nhận đơn hàng từ trước, chỉ dùng Nhanh để hỗ trợ vận chuyển). Set value = 1: Gửi luôn đơn hàng sang hãng vận chuyển. Nếu gửi thành công hệ thống sẽ trả về mã vận đơn carrierCode. Chú ý khi có tham số này, hệ thống sẽ phải kết nối sang hãng vận chuyển, nên thời gian phản hồi có thể bị chậm hơn bình thường tùy thuộc vào phản hồi của các hãng vận chuyển |
| orderPackage    | object | <p>Kích thước gói hàng<br>weight: Khối lượng gói hàng (gram)<br>length: Chiều dài (cm)<br>width: Chiều rộng (crm)<br>height: Chiều cao (crm)<br>merge: Gộp kiện (Truyền giá trị 1 nếu muốn gộp kiện)</p>                                                                                                                                                                                                                                                         |

### payment

* Thông tin thanh toán

| Key               | Type   | Description                      |
| ----------------- | ------ | -------------------------------- |
| transferAmount    | int    | Số tiền chuyển khoản             |
| transferAccountId | int    | Tài khoản nhận tiền chuyển khoản |
| code              | string | Mã giao dịch thanh toán          |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
  {
      "code": 1,
      "data": {
        "id": "(int) ID đơn hàng",
        "trackingUrl": "(string) Lịch trình đơn hàng",
        "carrierCode": "(string) Mã vận đơn hãng vận chuyển (trả về trong trường hợp truyền carrier.autoSend = 1)"
      }
  }
```


# Hủy đơn hàng

* Tính năng này dùng để hủy vận chuyển của đơn hàng

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/yix7eqv/order-edit).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/order/cancelcarrier?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "orderId": 14905641
}'
```

## Params

| Key     | Type  | Description |
| ------- | ----- | ----------- |
| orderId | array | ID đơn hàng |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).
* Danh sách **errorCode** của riêng API này:

| errorCode                            | Description                              |
| ------------------------------------ | ---------------------------------------- |
| ERR\_ORDER\_CARRIER\_NOT\_YET\_SENT  | Đơn hàng chưa gửi sang hãng vận chuyển   |
| ERR\_ORDER\_CARRIER\_NO\_API\_CANCEL | Hãng vận chuyển không hỗ trợ API hủy đơn |
| ERR\_ORDER\_CARRIER\_REJECT          | Gọi API hủy đơn hãng vận chuyển báo lỗi. |

### Successful response

```json
  {
      "code": 1,
      "data": {}
  }
```


# Thêm khiếu nại đơn hàng

* API này dùng để tạo khiếu nại hoặc yêu cầu hỗ trợ cho việc vận chuyển đơn hàng.

## Request

* Xem các [common request params](/v3#request-params)

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/order/addcomplain?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "id": 14889262,
    "reason": 37,
    "description": "Đến thu gom hàng giúp mình với"
}'
```

| Key         | Type                       | Description                                      |
| ----------- | -------------------------- | ------------------------------------------------ |
| id          | int $$^{{\color{red}\*}}$$ | ID đơn hàng                                      |
| reason      | int $$^{{\color{red}\*}}$$ | ID lý do khiếu nại, xem [bảng bên dưới](#reason) |
| description | string                     | Nội dung khiếu nại                               |

### reason

| Value | Description                                      |
| ----- | ------------------------------------------------ |
| 6     | Lý do khác                                       |
| 7     | Yêu cầu thanh toán COD                           |
| 8     | Báo hoàn hàng                                    |
| 9     | Báo phát lại                                     |
| 10    | Yêu cầu miễn giảm cước vận chuyển, bồi thường    |
| 33    | Báo lưu kho tại bưu cục                          |
| 34    | Yêu cầu cập nhật lại trạng thái                  |
| 35    | Báo hủy đơn                                      |
| 36    | Thay đổi thông tin đơn hàng, đổi tiền thu hộ COD |
| 37    | Báo thu gom                                      |
| 38    | Giao hàng một phần                               |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "data": {
      "complainId": "(int) ID khiếu nại"
    }
}
```


# Nguồn đơn hàng

* API này dùng để lấy [danh sách nguồn đơn hàng](https://nhanh.vn/store/traffic/source).

## Request

* Xem các [common request params](/v3#request-params)

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/order/source?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "ids": [100, 101],
    },
    "paginator": {
        "size": 50
    }
}'
```

### Filters

| Key | Type  | Description                        |
| --- | ----- | ---------------------------------- |
| ids | array | Mảng ID nguồn đơn hàng, tối đa 100 |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
  {
      "code": 1,
      "paginator": {
        "next": "Giá trị để lấy dữ liệu trang tiếp theo"
      },
      "data": [
        {
            "id": "(int) ID nguồn 1",
            "name": "(string) Tên nguồn 1",
            "status": "(int) Trạng thái (1 = Active, 2 = Inactive)",
            "createdAt": (int) Thời gian tạo (định dạng timestamp)
        },
        {
            "id": "(int) ID nguồn 2",
            "name": "(string) Tên nguồn 2",
            "status": "(int) Trạng thái (1 = Active, 2 = Inactive)",
            "createdAt": (int) Thời gian tạo (định dạng timestamp)
         }
      ]
  }
```


# Danh sách đơn hàng đã xóa

* API này dùng để lấy [danh sách đơn hàng đã xóa](https://nhanh.vn/order/manage/deleted).
* API chỉ trả về các log có **Kiểu = Xóa đơn hàng**.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/order/deleted?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "createdAtFrom": 1751302800,
        "createdAtTo": 1753635599
    },
    "paginator": {
        "size": 50
    }
}'
```

### Filters

| Key           | Type  | Description                                  |
| ------------- | ----- | -------------------------------------------- |
| ids           | array | Mảng ID đơn hàng (lọc nhiều đơn cùng lúc)    |
| createdAtFrom | int   | Thời gian xóa từ ngày (định dạng timestamp)  |
| createdAtTo   | int   | Thời gian xóa đến ngày (định dạng timestamp) |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": {
            "id": "Dùng để lấy dữ liệu trang tiếp theo"
        }
    },
    "data": [
        {
            "id": "(int) ID đơn hàng đã xóa",
            "createdAt": "(int) Thời gian xóa (định dạng timestamp)",
            "createdById": "(int) ID người xóa"
        },
        {
            "id": "(int) ID đơn hàng đã xóa",
            "createdAt": "(int) Thời gian xóa (định dạng timestamp)",
            "createdById": "(int) ID người xóa"
        }
    ]
}
```


# Lịch sử đơn hàng

* API này dùng để lấy lịch sử thao tác với đơn hàng.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/order/history?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters" : {
      "orderIds": [100, 101],
      "steps": [1, 7]
    }
}'
```

### Filters

| Key           | Type                         | Description                                                                                                                               |
| ------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| orderIds      | array $$^{{\color{red}\*}}$$ | Mảng ID đơn hàng, tối đa 100                                                                                                              |
| type          | string                       | <p><strong>loguser</strong>: Lấy lịch sử thao tác trên Nhanh.<br><strong>logcarrier</strong>: Lấy lịch sử đơn hàng từ hãng vận chuyển</p> |
| createdAtFrom | int                          | Ngày tạo lịch sử thao tác đơn hàng từ ngày (định dạng timestamp)                                                                          |
| createdAtTo   | int                          | Ngày tạo lịch sử thao tác đơn hàng đến ngày (định dạng timestamp)                                                                         |
| steps         | array                        | Mảng [hành động thao tác](/v3/modelconstant#order-step)                                                                                   |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).
* Xem const hành động [tại đây](/v3/modelconstant#order-step).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": "Giá trị để lấy dữ liệu trang tiếp theo"
    },
    "data": [
        {
            "logId": "(string) ID log thao tác đơn hàng",
            "orderId": "(int) ID đơn hàng trên Nhanh.vn",
            "step": "(int) ID hành động",
            "status": {
                "old": "(int) ID trạng thái cũ",
                "new": "(int) ID trạng thái mới"
            },
            "createdAt": "(int) Thời gian tạo (định dạng timestamp)",
            "createdById": "(int) ID người thao tác",
            "createdBy": "(string) Người thao tác"
        },
        {
            "logId": "(string) ID log thao tác đơn hàng",
            "orderId": "(int) ID đơn hàng trên Nhanh.vn",
            "step": "(int) ID hành động",
            "status": {
                "old": "(int) ID trạng thái cũ",
                "new": "(int) ID trạng thái mới"
            },
            "createdAt": "(int) Thời gian tạo (định dạng timestamp)",
            "createdById": "(int) ID người thao tác",
            "createdBy": "(string) Người thao tác"
        }
    ]
}
```


# Danh sách nhãn đơn hàng

* API này dùng để lấy danh sách [nhãn đơn hàng](https://nhanh.vn/setting/store/labels).
* Chú ý: Dữ liệu này rất ít khi bị thay đổi, bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 24h.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/order/tags?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
         "ids": [ID_1,ID_2]
    },
    "paginator": {
        "size": 100
    }
}'
```

### Filters

| Key  | Type   | Description           |
| ---- | ------ | --------------------- |
| ids  | array  | List ID nhãn đơn hàng |
| name | string | Tên nhãn đơn hàng     |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": {
      "id": "92220"
    }
  },
  "data": [
    {
      "id": "(int) ID nhãn đơn hàng",
      "businessId": "(int) ID doanh nghiệp",
      "name": "(string) Tên nhãn đơn hàng",
      "status": "(int) Trạng thái đơn hàng",
      "bgColor": "(string) Màu nền",
      "textColor": "(string) Màu chữ",
      "createdAt": "(int) Thời gian tạo - định dạng timestamp"
    }
  ]
}
```


# Danh sách địa chỉ

* API này dùng để lấy danh sách địa chỉ: thành phố, quận huyện, phường xã.
* Chú ý: Dữ liệu rất ít khi bị thay đổi (chỉ xảy ra khi có thay đổi tên, chia tách hoặc gộp), bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 24h.
* API hỗ trợ lấy dữ liệu cho cả địa chỉ hành chính cũ 3 cấp (Tỉnh / Thành phố, Quận / Huyện, Phường / Xã) và địa chỉ hành chính mới 2 cấp (Tỉnh / Thành phố, Phường / Xã)
* **Chú ý**:
  * Hiện toàn bộ các hãng vận chuyển vẫn đang dùng địa chỉ 3 cấp, chỉ 1 số ít hãng đã hỗ trợ 2 cấp.
  * Chưa có hãng nào bắt buộc dùng địa chỉ 2 cấp.
  * Sau khi hỗ trợ địa chỉ 2 cấp, các hãng vận chuyển vẫn hỗ trợ song song cả 2 loại 3 cấp và 2 cấp.
  * **Khuyến cáo** bạn vẫn nên dùng địa chỉ 3 cấp cho tới khi có các thông báo mới tiếp theo.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/9fys38u/shipping-location?tab=body).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/shipping/location?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "locationVersion": "v1",
        "type": "DISTRICT",
        "parentId": 254
    }
}'
```

### Filters

| Key             | Type                          | Description                                                                                                                                                                                                               |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| locationVersion | string $$^{{\color{red}\*}}$$ | <p>v1: Địa chỉ 3 cấp (Tỉnh / Thành phố, Quận / Huyện, Phường / Xã)<br>v2: Địa chỉ 2 cấp (Tỉnh / Thành phố, Phường / Xã)</p>                                                                                               |
| type            | string $$^{{\color{red}\*}}$$ | CITY / DISTRICT / WARD (mặc định là CITY)                                                                                                                                                                                 |
| parentId        | int                           | <p>type = DISTRICT thì parentId = id của thành phố cần lấy ra danh sách quận huyện<br>type = WARD thì parentId = id của quận huyện (nếu là địa chỉ 3 cấp, nếu locationVersion=v2 thì là id của thành phố) cần lấy ra.</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "data": [
        {
            "id": "(int) ID địa chỉ 1",
            "name": "Tên địa chỉ",
            "otherName": "Tên khác của địa chỉ"
        },
        {
            "id": "(int) ID địa chỉ 2",
            "name": "Tên địa chỉ"
        }
    ]
}
```


# Tính phí vận chuyển

* Tính năng này dùng để tính phí vận chuyển cho một đơn hàng. Một hãng vận chuyển có thể có nhiều bảng giá, nhiều dịch vụ khác nhau.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/8j38unq/shipping-fee).
* **Chú ý**: [Cài đặt vận chuyển](https://nhanh.vn/setting/order/index#connect-carrier) trên Nhanh.vn hỗ trợ 2 hình thức kết nối với các hãng vận chuyển, bạn cần hiểu rõ doanh nghiệp đang dùng hình thức kết nối nào để gọi API tính phí, và lấy các thông tin cần thiết dùng cho [API tạo đơn hàng](/v3/order/add)
  * [Kết nối có sẵn của Nhanh.vn](#carrier-nhanh-account): Mọi kết nối đi qua tài khoảng bảng giá chung của Nhanh.
  * [Kết nối tài khoản riêng của shop](#carrier-shop-account): Doanh nghiệp dùng tài khoản vận chuyển đã đăng ký với các hãng vận chuyển.

### filters

| Key            | Type                          | Description                                                                                                  |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| type           | int $$^{{\color{red}\*}}$$    | <p>Hình thức kết nối vận chuyển<br>1: Kết nối có sẵn của Nhanh.vn<br>2: Kết nối tài khoản riêng của shop</p> |
| depotId        | int                           | ID kho hàng                                                                                                  |
| shippingWeight | int $$^{{\color{red}\*}}$$    | Trọng lượng đơn hàng                                                                                         |
| price          | int                           | Tổng tiền sản phẩm                                                                                           |
| totalCod       | int                           | Tiền thu hộ                                                                                                  |
| carrier        | array                         | Mảng thông tin hãng vận chuyển. [Xem bên dưới](#carrier)                                                     |
| shippingFrom   | object $$^{{\color{red}\*}}$$ | Mảng thông tin người gửi. [Xem bên dưới](#shippingfrom)                                                      |
| shippingTo     | object $$^{{\color{red}\*}}$$ | Mảng thông tin người nhận. [Xem bên dưới](#shippingto)                                                       |

### carrier

| Key             | Type   | Description                                                                                                                                                                                                                              |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id              | int    | ID hãng vận chuyển ( $$^{{\color{red}\*}}$$ dùng cho hình thức shop tự kết nối)                                                                                                                                                          |
| service         | string | Dịch vụ vận chuyển                                                                                                                                                                                                                       |
| followTotalFee  | int    | Lấy theo tổng phí (1: Có, 0: Không)                                                                                                                                                                                                      |
| isDeclaredValue | int    | Khai giá (1: Có, 0: Không)                                                                                                                                                                                                               |
| declaredValue   | int    | Giá trị khai giá                                                                                                                                                                                                                         |
| promotionCode   | string | Mã khuyến mại vận chuyển                                                                                                                                                                                                                 |
| ids             | array  | Mảng ID hãng vận chuyển muốn dùng                                                                                                                                                                                                        |
| extraServices   | object | <p>Mảng dịch vụ cộng thêm (chỉ áp dụng với kết nối tài khoản riêng của shop: sendCarrierType = 2)<br>- BEST:<br>+ Đổi trả hàng: isReturnGoods = 1<br>- Viettel:<br>+ Loại thư từ: isDocument = 1<br>+ Phát tận tay: handDelivery = 1</p> |

#### Carrier Nhanh Account

* Kết nối có sẵn của Nhanh.vn

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/shipping/fee?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "type": 1,
        "shippingWeight":2100,
        "price": 321000,
        "totalCod": 256800,
        "shippingFrom": {
            "cityId": 254,
            "districtId": 331,
            "wardId" : 1026,
            "address": "170 Đê La Thành",
            "locationVersion": "v1"
        },
        "shippingTo": {
           "cityId": 254,
           "districtId": 331,
           "wardId" : 1120,
           "locationVersion": "v1"
        }
    }
}'
```

#### Carrier Shop Account

* Kết nối tài khoản riêng của shop

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/shipping/fee?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "type": 2,
        "shippingWeight":2100,
        "price": 321000,
        "totalCod": 256800,
        "shippingFrom": {
            "cityId": 254,
            "districtId": 331,
            "wardId" : 1026,
            "address": "170 Đê La Thành",
            "locationVersion": "v1"
        },
        "shippingTo": {
           "cityId": 254,
           "districtId": 331,
           "wardId" : 1120,
           "locationVersion": "v1"
        },
        "carrier": {
            "id": 8
        }
    }
}'
```

### shippingFrom

| Key             | Type                          | Description                                                                                                                 |
| --------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| cityId          | int $$^{{\color{red}\*}}$$    | ID Tỉnh/thành phố lấy từ [API địa chỉ](/v3/shipping/location)                                                               |
| districtId      | int $$^{{\color{red}\*}}$$    | ID Quận/huyện lấy từ [API địa chỉ](/v3/shipping/location) (bắt buộc khi là địa chỉ 3 cấp)                                   |
| wardId          | int $$^{{\color{red}\*}}$$    | ID Phường/xã lấy từ [API địa chỉ](/v3/shipping/location) (bắt buộc khi là địa chỉ 2 cấp)                                    |
| address         | string                        | Địa chỉ người gửi                                                                                                           |
| locationVersion | string $$^{{\color{red}\*}}$$ | <p>v1: Địa chỉ 3 cấp (Tỉnh / Thành phố, Quận / Huyện, Phường / Xã)<br>v2: Địa chỉ 2 cấp (Tỉnh / Thành phố, Phường / Xã)</p> |

### shippingTo

| Key             | Type                          | Description                                                                                                                 |
| --------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| cityId          | int $$^{{\color{red}\*}}$$    | ID Tỉnh/thành phố lấy từ [API địa chỉ](/v3/shipping/location)                                                               |
| districtId      | int $$^{{\color{red}\*}}$$    | ID Quận/huyện lấy từ [API địa chỉ](/v3/shipping/location) (bắt buộc khi là địa chỉ 3 cấp)                                   |
| wardId          | int $$^{{\color{red}\*}}$$    | ID Phường/xã lấy từ [API địa chỉ](/v3/shipping/location) (bắt buộc khi là địa chỉ 2 cấp)                                    |
| address         | string                        | Địa chỉ người nhận                                                                                                          |
| locationVersion | string $$^{{\color{red}\*}}$$ | <p>v1: Địa chỉ 3 cấp (Tỉnh / Thành phố, Quận / Huyện, Phường / Xã)<br>v2: Địa chỉ 2 cấp (Tỉnh / Thành phố, Phường / Xã)</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "logo": "(string) Đường dẫn ảnh hãng vận chuyển",
      "carrier": {
        "id": "(int) ID hãng vận chuyển",
        "accountId": "(int) ID tài khoản tự kết nối",
        "accountName": "(string) Tên tài khoản tự kết nối",
        "shopId": "(string) ID shop tự kết nối"
      },
      "service": {
        "id": "(int) ID dịch vụ",
        "name": "(string) Tên dịch vụ",
        "code": "(string) Mã dịch vụ",
        "description": "(string) Mô tả dịch vụ"
      },
      "shipFee": "(double) Phí vận chuyển",
      "codFee": "(double) Phí thu tiền hộ",
      "declaredFee": "(double) Phí khai giá",
      "customerShipFee": "(double) Phí ship báo khách"
    }
  ]
}
```


# Danh sách hãng vận chuyển

* Dùng để lấy danh sách các hãng vận chuyển đang được tích hợp với Nhanh.vn. Nhanh.vn đang kết nối với Giaohangnhanh, J\&T Express, Viettel Post, Vietnam Post, EMS, Ninjavan, Best Express... để hỗ trợ dịch vụ vận chuyển và giao hàng thu tiền tận nhà.
* Chú ý: Dữ liệu này rất ít khi bị thay đổi, bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 24h.

## Request

* Xem các [common request params](/v3#request-params)
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/xkjiuyu/shipping-carrier).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/shipping/carrier?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data ''
```

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "id": "(int) ID hãng vận chuyển",
      "name": "(string) Tên hãng vận chuyển",
      "logo": "(string) Đường dẫn file ảnh",
      "status": "(int) Trạng thái (1: Hoạt động, 2: Không hoạt động)",
      "shortName": "(string) Tên viết tắt của hãng vận chuyển",
      "services": [
        {
            "id": "(int) ID dịch vụ vận chuyển",
            "name": "(string) Tên dịch vụ vận chuyển",
            "description": "(string) Mô tả dịch vụ"
        }
      ]
    }
  ]
}
```


# Danh sách hóa đơn

* API này dùng để lấy [danh sách phiếu xuất nhập kho](https://nhanh.vn/inventory/bill/index): hóa đơn nhập nhà cung cấp, bán lẻ, bán sỉ, chuyển kho, kiểm kho.
  * Các loại hóa đơn khác bạn có thể xem 2 request params là type và mode ở bên dưới để làm tương tự.
* **Chú ý:**
  * Hệ thống chỉ hỗ trợ lấy hóa đơn trong khoảng 31 ngày.
  * Nếu bạn không truyền param createdAtFrom mặc định sẽ lấy 31 ngày gần nhất. Nếu bạn muốn lấy dữ liệu các ngày cũ hơn, xin vui lòng truyền createdAtFrom và createdAtTo trong khoảng 31 ngày, VD: 2025-08-01 => 2025-08-31.
  * Khi lọc theo id, customerId hoặc customerMobile thì có thể bỏ qua khoảng ngày.

## Request

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/bill/list?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "modes": [2],
        "type": 2
    },
     "paginator": {
        "size": 50,
        "next": {"id": 100}
    },
    "dataOptions": {}
}'
```

### Filters

| Key            | Type   | Description                                                                                                                                                                                                                   |
| -------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ids            | array  | ID phiếu xuất nhập kho (chỉ hỗ trợ lọc tối đa 100 ID XNK)                                                                                                                                                                     |
| type           | int    | <p>Loại xuất nhập kho<br>1 = Nhập kho<br>2 = Xuất kho</p>                                                                                                                                                                     |
| modes          | array  | <p>Kiểu xuất nhập kho<br>5 = Nhà cung cấp<br>3 = Chuyển kho<br>1 = Giao hàng<br>2 = Bán lẻ<br>6 = Bán buôn<br>8 = Bù trừ kiểm kho<br>13 = Bảo hành<br>15 = Sửa chữa<br>16 = Linh kiện bảo hành<br>19 = Combo<br>10 = Khác</p> |
| depotIds       | array  | Mảng ID kho hàng                                                                                                                                                                                                              |
| orderIds       | array  | Mảng ID đơn hàng (chỉ hỗ trợ lọc tối đa 100 ID đơn hàng)                                                                                                                                                                      |
| customerId     | int    | ID khách hàng                                                                                                                                                                                                                 |
| customerMobile | string | Số điện thoại khách hàng                                                                                                                                                                                                      |
| fromDate       | date   | Ngày xuất nhập kho. Format yyyy-mm-dd (ví dụ: 2015-07-16)                                                                                                                                                                     |
| toDate         | date   | Ngày xuất nhập kho. Format yyyy-mm-dd (ví dụ: 2015-08-16)                                                                                                                                                                     |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

### DataOptions

* Dữ liệu cần lấy thêm: truyền dạng mảng. Ví dụ: {"dataOptions":\["giftProducts","tags"]}

| Value        | Description                                             |
| ------------ | ------------------------------------------------------- |
| giftProducts | Lấy thông tin quà tặng của sản phẩm trong xuất nhập kho |
| tags         | Lấy nhãn được gắn cho xuất nhập kho                     |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

* Xem const [Loại xuất nhập kho](/v3/modelconstant#inventory-type)
* Xem const [Kiểu xuất nhập kho](/v3/modelconstant#inventory-mode)
* Xem const [Loại xuất nhập kho\_liên\_quan](/v3/modelconstant#inventory-related-type)

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID phiếu XNK",
      "orderId": "(int) ID đơn hàng liên quan",
      "requirementBillId": "(int) ID phiếu nháp liên quan",
      "inventoryCheckId": "(int) ID phiếu kiểm kho liên quan",
      "warrantyBillId": "(int) ID phiếu bảo hành liên quan",
      "depotId": "(int) ID Kho hàng",
      "date": "(date) Ngày xuất nhập kho format Y-m-d",
      "type": "(int) Loại xuất nhập kho",
      "mode": "(int) Kiểu xuất nhập kho",
      "related": {
        "type": "(int) loại phiếu liên quan (VD: chuyển kho, quà tặng, xuất combo, trả lại bán lẻ, bán buôn...)",
        "parentId": "(int) ID phiếu trả hàng liên quan (dùng cho trường hợp đổi trả hàng và mua mới, hóa đơn mua mới sẽ có parentId = hóa đơn trả)",
        "billId": "(int) ID phiếu liên quan (VD: chuyển kho)",
        "businessId": "(int) ID doanh nghiệp của phiếu liên quan",
        "depotId": "(int) ID kho hàng của phiếu liên quan",
        "requirementBillId": "(int) ID phiếu nháp liên quan",
        "userId": "(int) ID user liên quan",
        "userName": "(string) Tên user liên quan"
      },
      "customer": {
        "id": "(int) ID khách hàng",
        "name": "(string) Tên khách hàng",
        "mobile": "(string) Số điện thoại khách hàng",
        "address": "(string) Địa chỉ khách hàng"
      },
      "created": {
        "id": "(int) ID người tạo XNK",
        "name": "(string) Tên người tạo XNK",
        "createdAt": "(Timestamp) Thời gian tạo XNK"
      },
      "sale": {
        "id": "(int) ID nhân viên bán hàng",
        "name": "(string) Tên nhân viên bán hàng",
        "saleBonus": "(double) Hoa hồng cho nhân viên bán hàng"
      },
      "technicalStaff": {
        "id": "(int) ID nhân viên kỹ thuật",
        "name": "(string) Tên nhân viên kỹ thuật"
      },
      "supplier": {
        "id": "(int) ID nhà cung cấp",
        "name": "(string) Tên nhà cung cấp"
      },
      "products": [
        {
          "imexId": "(int) ID sản phẩm XNK",
          "id": "(int) ID sản phẩm trên Nhanh",
          "code": "(string) Mã code sản phẩm trên Nhanh",
          "barcode": "(string) Mã vạch sản phẩm trên Nhanh",
          "name": "(string) Tên sản phẩm trên Nhanh",
          "imeiId": "(int) ID IMEI trên Nhanh",
          "imei": "(array) List IMEI sản phẩm trên Nhanh nếu là sản phẩm IMEI",
          "quantity": "(double) Số lượng sản phẩm XNK",
          "price": "(double) Giá bán sản phẩm XNK",
          "discount": "(double) Số tiền giảm giá",
          "extendedWarrantyAmount": "(double) Số tiền bảo hành mở rộng",
          "vat": {
            "percent": "(int) % vat ",
            "amount": "(double) số tiền vat"
          },
          "amount": "(double) Thành tiền sản phẩm",
          "giftProducts": "(array) List sản phẩm quà tặng"
        }
      ],
      "payment": {
        "amount": "(double) Tổng số tiền hóa đơn",
        "customerAmount":  "(double) Tiền khách đưa",
        "discount": "(double) Tổng tiền chiết khấu",
        "points": "(double) Số điểm được tích lũy",
        "usedPoints": {
          "points" : "(double) Số điểm đã sử dụng",
          "amount": "(double) Số tiền quy đổi từ điểm sử dụng"
        },
        "transfer": {
          "accountId": "(int) ID tài khoản thanh toán chuyển khoản",
          "name": "(string) Tên tài khoản thanh toán chuyển khoản",
          "amount": "(double) Số tiền thanh toán chuyển khoản"
        },
        "cash": {
          "accountId": "(int) ID tài khoản thanh toán tiền mặt",
          "name": "(string) Tên tài khoản thanh toán tiền mặt",
          "amount":"(double) Số tiền thanh toán tiền mặt"
        },
        "installment": {
          "accountId": "(int) ID dịch vụ trả góp",
          "name": "(string) Tên dịch vụ trả góp",
          "amount":"(double) Số tiền trả góp"
        },
        "credit": {
          "accountId": "(int) ID tài khoản quẹt thẻ",
          "name": "(string) Tên tài khoản quẹt thẻ",
          "code": "(string) Mã giao dịch quẹt thẻ",
          "amount": "(double) Số tiền quẹt thẻ"
        },
        "coupon": {
          "code": "(string) Mã coupon",
          "value": "(double) Giá trị coupon",
          "amount": "(double) Giá trị coupon áp dụng cho XNK"
        },
        "returnFee": "(double) Phí trả hàng",
        "returnAmount": "(double) Tổng tiền trả hàng"
      },
      "description": "(string) Nội dung ghi chú cho XNK",
      "customerSource": {
        "id": "(int) ID nguồn khách hàng",
        "name": "(string) Tên nguồn khách hàng"
      },
      "tags": "(array) List các nhãn gắn với XNK"
    }
  ]
}
```


# Danh sách hóa đơn đã xóa

* API này dùng để lấy [danh sách hóa đơn đã xóa](https://nhanh.vn/inventory/log/imexbill).
* API chỉ trả về các log có **Kiểu = Xóa hóa đơn**.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/bill/deleted?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "createdAtFrom": 1751302800,
        "createdAtTo": 1753635599
    },
    "paginator": {
        "size": 50
    }
}'
```

### Filters

| Key           | Type  | Description                                  |
| ------------- | ----- | -------------------------------------------- |
| ids           | array | Mảng ID phiếu (lọc nhiều phiếu cùng lúc)     |
| createdAtFrom | int   | Thời gian xóa từ ngày (định dạng timestamp)  |
| createdAtTo   | int   | Thời gian xóa đến ngày (định dạng timestamp) |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": {
            "id": "Dùng để lấy dữ liệu trang tiếp theo"
        }
    },
    "data": [
        {
            "id": "(int) ID hóa đơn đã xóa",
            "createdAt": "(int) Thời gian xóa (định dạng timestamp)",
            "createdById": "(int) ID người xóa"
        },
        {
            "id": "(int) ID hóa đơn đã xóa",
            "createdAt": "(int) Thời gian xóa (định dạng timestamp)",
            "createdById": "(int) ID người xóa"
        }
    ]
}
```


# Danh sách hóa đơn bán lẻ

* API này dùng để lấy [danh sách hoá đơn bán lẻ](https://nhanh.vn/pos/bill/index): hóa đơn bán lẻ
* **Chú ý:**
  * Hệ thống chỉ hỗ trợ lấy hóa đơn trong khoảng 31 ngày.
  * Nếu bạn không truyền param createdAtFrom mặc định sẽ lấy 31 ngày gần nhất. Nếu bạn muốn lấy dữ liệu các ngày cũ hơn, xin vui lòng truyền createdAtFrom và createdAtTo trong khoảng 31 ngày, VD: 2025-08-01 => 2025-08-31.
  * Khi lọc theo id, customerId hoặc customerMobile thì có thể bỏ qua khoảng ngày.

## Request

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/bill/retail?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
    },
     "paginator": {
        "size": 50,
        "next": {"id": 100}
    },
    "dataOptions": {}
}'
```

### Filters

| Key            | Type   | Description                                                 |
| -------------- | ------ | ----------------------------------------------------------- |
| id             | int    | ID phiếu                                                    |
| depotIds       | array  | Mảng ID kho hàng                                            |
| type           | int    | <p>Loại xuất nhập kho<br>1 = Nhập kho<br>2 = Xuất kho</p>   |
| orderIds       | array  | Mảng ID đơn hàng (chỉ hỗ trợ lọc tối đa 100 ID đơn hàng)    |
| customerId     | int    | ID khách hàng                                               |
| customerMobile | string | Số điện thoại khách hàng                                    |
| fromDate       | date   | Ngày xuất kho từ. Định dạng yyyy-mm-dd (ví dụ: 2025-07-16)  |
| toDate         | date   | Ngày xuất kho đến. Định dạng yyyy-mm-dd (ví dụ: 2025-08-16) |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

### DataOptions

* Dữ liệu cần lấy thêm: truyền dạng mảng. Ví dụ: {"dataOptions":\["giftProducts","tags"]}

| Value        | Description                                             |
| ------------ | ------------------------------------------------------- |
| giftProducts | Lấy thông tin quà tặng của sản phẩm trong xuất nhập kho |
| tags         | Lấy nhãn được gắn cho xuất nhập kho                     |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

* Xem const [Loại xuất nhập kho](/v3/modelconstant#inventory-type)
* Xem const [Kiểu xuất nhập kho](/v3/modelconstant#inventory-mode)
* Xem const [Loại xuất nhập kho\_liên\_quan](/v3/modelconstant#inventory-related-type)

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID phiếu XNK",
      "orderId": "(int) ID đơn hàng liên quan",
      "requirementBillId": "(int) ID phiếu nháp liên quan",
      "inventoryCheckId": "(int) ID phiếu kiểm kho liên quan",
      "warrantyBillId": "(int) ID phiếu bảo hành liên quan",
      "depotId": "(int) ID Kho hàng",
      "date": "(date) Ngày xuất nhập kho (định dạng Y-m-d)",
      "type": "(int) Loại xuất nhập kho",
      "related": {
        "type": "(int) loại phiếu liên quan (VD: chuyển kho, quà tặng, xuất combo, trả lại bán lẻ, bán buôn...)",
        "parentId": "(int) ID phiếu trả hàng liên quan (dùng cho trường hợp đổi trả hàng và mua mới, hóa đơn mua mới sẽ có parentId = hóa đơn trả)",
        "billId": "(int) ID phiếu liên quan (VD: chuyển kho)",
        "businessId": "(int) ID doanh nghiệp của phiếu liên quan",
        "depotId": "(int) ID kho hàng của phiếu liên quan",
        "requirementBillId": "(int) ID phiếu nháp liên quan",
        "userId": "(int) ID user liên quan",
        "userName": "(string) Tên user liên quan"
      },
      "customer": {
        "id": "(int) ID khách hàng",
        "name": "(string) Tên khách hàng",
        "mobile": "(string) Số điện thoại khách hàng",
        "address": "(string) Địa chỉ khách hàng"
      },
      "sale": {
        "id": "(int) ID nhân viên bán hàng",
        "name": "(string) Tên nhân viên bán hàng",
        "saleBonus": "(double) Hoa hồng cho nhân viên bán hàng"
      },
      "technicalStaff": {
        "id": "(int) ID nhân viên kỹ thuật",
        "name": "(string) Tên nhân viên kỹ thuật"
      },
      "supplierId": "(int) ID nhà cung cấp",
      "products": [
        {
          "imexId": "(int) ID sản phẩm XNK",
          "id": "(int) ID sản phẩm trên Nhanh",
          "code": "(string) Mã code sản phẩm trên Nhanh",
          "name": "(string) Tên sản phẩm trên Nhanh",
          "imeiId": "(int) ID IMEI trên Nhanh",
          "imei": "(array) List IMEI sản phẩm trên Nhanh nếu là sản phẩm IMEI",
          "quantity": "(double) Số lượng sản phẩm XNK",
          "priceVatMode": "(int) 1: Giá bán đã bao gồm VAT, 2: Giá bán chưa bao gồm VAT",
          "price": "(double) Giá bán sản phẩm XNK",
          "discount": "(double) Số tiền giảm giá",
          "extendedWarrantyAmount": "(double) Số tiền bảo hành mở rộng",
          "vat": {
            "percent": "(int) % vat ",
            "amount": "(double) số tiền vat"
          },
          "amount": "(double) Thành tiền sản phẩm",
          "giftProducts": "(array) List sản phẩm quà tặng"
        }
      ],
      "payment": {
        "amount": "(double) Tổng số tiền hóa đơn",
        "customerAmount":  "(double) Tiền khách đưa",
        "discount": "(double) Tổng tiền chiết khấu",
        "points": "(double) Số điểm được tích lũy",
        "usedPoints": {
          "points" : "(double) Số điểm đã sử dụng",
          "amount": "(double) Số tiền quy đổi từ điểm sử dụng"
        },
        "transfer": {
          "accountId": "(int) ID tài khoản thanh toán chuyển khoản",
          "name": "(string) Tên tài khoản thanh toán chuyển khoản",
          "amount": "(double) Số tiền thanh toán chuyển khoản"
        },
        "cash": {
          "accountId": "(int) ID tài khoản thanh toán tiền mặt",
          "name": "(string) Tên tài khoản thanh toán tiền mặt",
          "amount":"(double) Số tiền thanh toán tiền mặt"
        },
        "installment": {
          "accountId": "(int) ID dịch vụ trả góp",
          "name": "(string) Tên dịch vụ trả góp",
          "amount":"(double) Số tiền trả góp"
        },
        "credit": {
          "accountId": "(int) ID tài khoản quẹt thẻ",
          "name": "(string) Tên tài khoản quẹt thẻ",
          "code": "(string) Mã giao dịch quẹt thẻ",
          "amount": "(double) Số tiền quẹt thẻ"
        },
        "coupon": {
          "code": "(string) Mã coupon",
          "value": "(double) Giá trị coupon",
          "amount": "(double) Giá trị coupon áp dụng cho XNK"
        },
        "returnFee": "(double) Phí trả hàng",
        "returnAmount": "(double) Tổng tiền trả hàng"
      },
      "description": "(string) Nội dung ghi chú cho XNK",
      "customerSource": {
        "id": "(int) ID nguồn khách hàng",
        "name": "(string) Tên nguồn khách hàng"
      },
      "tags": "(array) List các nhãn gắn với XNK",
      "createdById": "(int) ID người tạo XNK",
      "createdAt": "Thời gian tạo XNK, định dạng timestamp"
    }
  ]
}
```


# Thêm hóa đơn bán lẻ

* API dùng để tạo hóa đơn bán lẻ, tối đa 100 sản phẩm / requests.
* Chỉ hỗ trợ chiết khấu theo sản phẩm, không hỗ trợ chiết khấu tổng đơn và không tính toán chiết khấu tự động.
* Không hỗ trợ điền mã coupon để giảm giá sản sản phẩm.
* Không hỗ trợ sản phẩm quà tặng, nếu hóa đơn có quà tặng coi như sản phẩm riêng để giá 0 đồng.
* Không check theo cài đặt bắt buộc nhập thông tin khách hàng | nhân viên bán hàng.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/81g47kb/bill-add).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/bill/addretail?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "depotId": 31010,
    "customer" : {
        "id": "",
        "name": "Test khách API V3",
        "mobile": "0987654321",
        "email": "",
        "address": "136/6 Kiêu Kỵ, Gia Lâm, Hà Nội",
        "facebookLink": "",
        "cityLocationId": 254,
        "districtLocationId": 331,
        "wardLocationId": 1246,
        "birthday": "",
        "gender": 0,
        "groupId": 0,
        "businessName": "",
        "businessAddress": "",
        "description": "",
        "taxCode": "",
        "tagIds": []
    },
    "saleId": 0,
    "technicalStaffId": 0,
    "description": "test combo API V3",
    "tagIds": [],
    "products": [
        {
            "id": 1231279582,
            "vat": -1,
            "quantity": 1,
            "priceVatMode": 1,
            "price": 500000,
            "discount":{
                "type": "percent",
                "value": 10
            },
            "description": "",
            "extendedWarrantyId": 0,
            "extendedWarrantyMonths": "",
            "extendedWarrantyMoney": 0,
            "imeis": ["IMEI 1', "IMEI 2"],
            "unitId": "",
            "batchId": ""
        }
    ],
   "payment": {
        "customerAmount": 450000,
        "debtDueDate": "",
        "cash": {
            "value": 0,
            "accountId": 0
        },
        "credit": {
            "value": 0,
            "accountId": 0,
            "code": ""
        },
        "transfer": {
            "value": 440000,
            "accountId": 263475
        },
        "installment": {
            "id": 0,
            "code": "",
            "value": 0
        },
        "usedPoints": 0
    },
    "invoice": {
        "publishType": 1,
        "tax": {
            "type": 2,
            "code": "0108824877",
            "name": "CÔNG TY CỔ PHẦN NHANH.VN",
            "address": "Tầng 2 phòng 206 Tòa nhà GP Invest, Số 170 đường La Thành, Phường Ô Chợ Dừa, Thành phố Hà Nội, Việt Nam",
            "citizenIdNumber": null,
            "passportNumber": null
        },
        "contact": {
           "name": "Nguyễn Văn Anh",
           "mobile": "0987654321",
           "email": "email_1@gmail.com",
           "email2": "email_2@gmail.com"
        }
    }
}'
```

* Thông tin trong hóa đơn:

| Key              | Type                       | Description                                                           |
| ---------------- | -------------------------- | --------------------------------------------------------------------- |
| depotId          | int $$^{{\color{red}\*}}$$ | ID kho hàng lấy từ [danh sách kho hàng](/v3/business/depot)           |
| customer         | object                     | [Thông tin khách hàng](#customer)                                     |
| products         | array                      | [Thông tin sản phẩm của hóa đơn](#products)                           |
| saleId           | int                        | ID nhân viên bán hàng lấy từ [danh sách nhân viên](/v3/business/user) |
| technicalStaffId | int                        | ID nhân viên kỹ thuật lấy từ [danh sách nhân viên](/v3/business/user) |
| description      | string                     | Ghi chú hóa đơn                                                       |
| tagIds           | array                      | List ID nhãn muốn gắn cho hóa đơn                                     |
| payment          | object                     | [Thông tin thanh toán](#payment)                                      |

### customer

* Thông tin khách hàng

| Key                | Type   | Description                                                          |
| ------------------ | ------ | -------------------------------------------------------------------- |
| id                 | int    | ID khách hàng                                                        |
| name               | string | Tên khách hàng                                                       |
| mobile             | string | Số điện thoại khách hàng                                             |
| email              | string | Email khách hàng                                                     |
| address            | string | Địa chỉ khách hàng                                                   |
| cityLocationId     | int    | ID thành phố lấy từ [danh sách địa chỉ](/v3/shipping/location)       |
| districtLocationId | int    | ID quận, huyện lấy từ [danh sách địa chỉ](/v3/shipping/location)     |
| wardLocationId     | int    | ID phường, xã lấy từ [danh sách địa chỉ](/v3/shipping/location)      |
| facebookLink       | string | Link Facebook                                                        |
| birthday           | string | Ngày sinh (Y-m-d)                                                    |
| gender             | int    | <p>Giới tính<br>1 = Nam<br>2 = Nữ<br>3 = Không xác định</p>          |
| groupId            | int    | Nhóm khách hàng                                                      |
| businessName       | string | Tên công ty khách hàng (Nếu khách là người đại diện cho công ty)     |
| businessAddress    | string | Địa chỉ công ty khách hàng (Nếu khách là người đại diện cho công ty) |
| taxCode            | string | Mã số thuế                                                           |
| description        | string | Ghi chú khách hàng                                                   |
| tagIds             | array  | Mảng ID nhãn gắn cho khách hàng                                      |

### products

* Thông tin sản phẩm

| Key                    | Type                          | Description                                                                                                                                                                                                                                                                                      |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id                     | int $$^{{\color{red}\*}}$$    | ID sản phẩm                                                                                                                                                                                                                                                                                      |
| quantity               | double $$^{{\color{red}\*}}$$ | Số lượng sản phẩm                                                                                                                                                                                                                                                                                |
| priceVatMode           | int                           | 1: Giá đã bao gồm VAT, 2: Giá chưa bao gồm VAT (mặc định) (Xem bảng mô tả [priceVatMode](/v3/modelconstant#price-vat-mode))                                                                                                                                                                      |
| price                  | double                        | Giá bán sản phẩm                                                                                                                                                                                                                                                                                 |
| discount               | object                        | <p>Chiết khấu sản phẩm<br>- type: Loại chiết khấu (percent: %, cash: Tiền mặt)<br>- value: Giá trị chiết khấu</p>                                                                                                                                                                                |
| vat                    | double                        | % VAT. VD: 5, 8, 10 (chỉ gửi số, không gửi kèm ký tự %). Chú ý: Các giá trị đặc biệt như 0%, Không chịu thuế, Không kê khai nộp thuế xem const [tại đây](/v3/modelconstant#product-vat). Mặc định nếu bạn không truyền tham số này, hệ thống sẽ lấy theo thông tin khai báo ở Danh sách sản phẩm |
| imeis                  | array                         | Mảng IMEI sản phẩm (bắt buộc nhập nếu sản phẩm loại IMEI)                                                                                                                                                                                                                                        |
| unitId                 | int                           | [ID đơn vị tính](/v3/product/unit) (bắt buộc nếu sản phẩm loại nhiều đơn vị tính)                                                                                                                                                                                                                |
| batchId                | int                           | [ID lô sản phẩm](/v3/product/batch) (bắt buộc nếu sản phẩm bán theo lô)                                                                                                                                                                                                                          |
| extendedWarrantyId     | int                           | ID gói bảo hành mở rộng                                                                                                                                                                                                                                                                          |
| extendedWarrantyMonths | int                           | Số tháng bảo hành của gói bảo hành mở rộng                                                                                                                                                                                                                                                       |
| extendedWarrantyMoney  | double                        | Số tiền bảo hành mở rộng                                                                                                                                                                                                                                                                         |
| description            | string                        | Ghi chú sản phẩm                                                                                                                                                                                                                                                                                 |

### payment

* Thông tin thanh toán

| Key            | Type   | Description                                                                                                                                                                                                                     |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| usedPoints     | int    | Số điểm sử dụng cho hóa đơn                                                                                                                                                                                                     |
| customerAmount | double | Tiền khách đưa (Áp dụng trường hợp khách dùng tiền mặt và không sử dụng kế toán trên Nhanh)                                                                                                                                     |
| cash           | object | <p>Thanh toán bằng hình thức tiền mặt<br>- accountId: Tài khoản tiền mặt lấy từ <a href="/v3/accounting/account">danh sách tài khoản kế toán</a> (nếu có dùng kế toán)<br>- value: Giá trị tiền mặt</p>                         |
| transfer       | object | <p>Thanh toán bằng hình thức chuyển khoản<br>- accountId: Tài khoản chuyển khoản lấy từ <a href="/v3/accounting/account">danh sách tài khoản kế toán</a> (nếu có dùng kế toán)<br>- value: Giá trị chuyển khoản</p>             |
| credit         | object | <p>Thanh toán bằng hình thức quẹt thẻ<br>- accountId: Tài khoản quẹt thẻ lấy từ <a href="/v3/accounting/account">danh sách tài khoản kế toán</a> (nếu có dùng kế toán)<br>- value: Giá trị quẹt thẻ<br>- code: Mã giao dịch</p> |
| installment    | object | <p>Thanh toán bằng hình thức trả góp<br>- id: ID dịch vụ trả góp<br>- value: Giá trị trả góp<br>- code: Mã hợp đồng trả góp</p>                                                                                                 |
| debtDueDate    | string | Ngày hẹn thanh toán công nợ (Y-m-d)                                                                                                                                                                                             |

### invoice

* Thông tin xuất hóa đơn điện tử
* Để sử dụng được tạo hóa đơn điện tử:
  * Doanh nghiệp cần mua hóa đơn của Nhanh và cài đặt ở Kênh bán > [Hóa đơn điện tử](https://nhanh.vn/invoice/setting/index).
  * User cấp quyền cho app phải có quyền tạo hóa đơn điện tử nháp hoặc phát hành hóa đơn điện tử, thì mới có thể thêm field **invoice** nếu không sẽ bị báo lỗi. Xem thêm mã lỗi ở [bên dưới](#failed-response).

| Key         | Type   | Description                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| publishType | int    | 1: Tạo hóa đơn điện tử nháp, 2: Phát hành hóa đơn                                                                                                                                                                                                                                                                                                                    |
| tax         | object | <p>Thông tin xuất hóa đơn<br>- type: 1: Hộ kinh doanh, 2: Công ty, 3: Cá nhân<br>- code: Mã số thuế Hộ kinh doanh / Công ty<br>- name: Tên Hộ kinh doanh / Công ty / Cá nhân<br>- address: Địa chỉ Hộ kinh doanh / Công ty / Cá nhân<br>- citizenIdNumber: Số căn cước công dân (dùng cho loại cá nhân)<br>- passportNumber: Số hộ chiếu (dùng cho loại cá nhân)</p> |
| contact     | object | <p>Thông tin người nhận hóa đơn<br>- name: Tên người nhận hóa đơn<br>- mobile: Số điện thoại người nhận hóa đơn<br>- email: Email người nhận hóa đơn<br>- email2: Email người cùng nhận hóa đơn</p>                                                                                                                                                                  |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).
* Danh sách mã lỗi:

| Value                                    | Description                                                                                         |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------- |
| ERR\_INVOICE\_NO\_SETTING                | Chưa cấu hình pháp nhân xuất hóa đơn điện tử                                                        |
| ERR\_INVOICE\_PRODUCT\_NO\_DECLARED\_VAT | Khi bật cài đặt "Chặn tạo hóa đơn điện tử nếu sản phẩm chưa điền VAT"                               |
| ERR\_INVOICE\_PRODUCT\_NO\_MATCH         | Khi bật cài đặt "Chặn tạo hóa đơn điện tử có sản phẩm chưa khai báo tên sản phẩm xuất hóa đơn"      |
| ERR\_INVOICE\_BLOCK\_TAG                 | Khi bật cài đặt "Không tạo hóa đơn điện tử khi hóa đơn (Bán lẻ, bán sỉ) có chứa nhãn"               |
| ERR\_INVOICE\_BLOCK\_PRODUCT             | Khi bật cài đặt "Không tạo hóa đơn điện tử khi hóa đơn (Đơn hàng, bán lẻ, bán sỉ) có chứa sản phẩm" |

### Successful response

```json
{
    "code": 1,
    "data": {
        "id": "(int) ID hóa đơn",
        "totalAmount": "(double) Tổng tiền hóa đơn"
    }
}
```


# Sản phẩm xuất nhập kho

* Tính năng này dùng để lấy danh sách sản phẩm xuất nhập kho của doanh nghiệp.
* Tương đương dữ liệu tại mục: Kho hàng > Xuất nhập kho > [Sản phẩm xuất nhập kho](https://nhanh.vn/inventory/imex/index)

## Request

* Xem các [common request params](/v3#request-params)

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/bill/imexs?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "fromDate": "2025-05-01",
        "toDate": "2025-05-31"
    },
    "paginator": {
        "size": 50
    }
}'
```

### Filters

| Key            | Type  | Description                                              |
| -------------- | ----- | -------------------------------------------------------- |
| id             | int   | ID bản ghi sản phẩm xuất nhập kho                        |
| fromDate       | date  | Thời gian từ ngày định dạng (yyyy-mm-dd). VD: 2022-09-25 |
| toDate         | date  | Thời gian đến ngày (yyyy-mm-dd). VD: 2022-09-25          |
| billId         | int   | ID hóa đơn xuất nhập kho                                 |
| type           | int   | Loại xuất nhập kho                                       |
| mode           | int   | Kiểu xuất nhập kho                                       |
| depotId        | int   | ID kho hàng xuất đi                                      |
| relatedDepotId | int   | ID kho liên quan                                         |
| warrantyBillId | int   | ID phiếu bảo hành                                        |
| orderId        | int   | ID đơn hàng                                              |
| orderIds       | array | List ID đơn hàng (chỉ hỗ trợ lọc tối đa 100 ID đơn hàng) |
| supplierId     | int   | ID nhà cung cấp                                          |
| product        | array | Mảng thông tin sản phẩm (xem ở bảng bên dưới)            |

* Thông tin **product**

| Key                | Type | Description           |
| ------------------ | ---- | --------------------- |
| id                 | int  | ID sản phẩm           |
| relatedId          | int  | ID sản phẩm liên quan |
| categoryId         | int  | ID danh mục           |
| internalCategoryId | int  | ID danh mục nội bộ    |
| brandId            | int  | ID thương hiệu        |
| typeId             | int  | Loại sản phẩm         |
| imei               | int  | IMEI sản phẩm         |
| imeiId             | int  | ID IMEI sản phẩm      |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID bản ghi sản phẩm xuất nhập kho",
      "billId": "(int) ID hóa đơn xuất nhập kho",
      "type": "(int) Loại hóa đơn",
      "mode": "(int) Kiểu hóa đơn",
      "date": "(string) Ngày xuất nhập kho",
      "reference": {
        "orderId": "(int) ID đơn hàng liên quan",
        "requirementBillId": "(int) ID phiếu nháp liên quan",
        "inventoryCheckId": "(int) ID phiếu kiểm kho liên quan",
        "warrantyBillId": "(int) ID phiếu bảo hành liên quan",
      },
      "depot": {
        "id": "(int) ",
        "name": "(string) Tên kho hàng"
      },
      "relatedDepot": {
        "id": "(int) ID kho hàng liên quan",
        "name": "(string) Tên kho hàng liên quan"
      },
      "supplier": {
        "id": "(int) ID nhà cung cấp",
        "name": "(string) Tên nhà cung cấp",
        "mobile": "(string) Số điện thoại nhà cung cấp"
      },
      "product": {
        "id": "(int) ID sản phẩm",
        "code": "(string) Mã sản phẩm",
        "barcode": "(string) Mã vạch sản phẩm",
        "name": "(string) Tên sản phẩm",
        "prices": {
          "retail": "(double) Giá bán",
          "import": "(double) Giá nhập",
          "avgCost": "(double) Giá vốn"
        }
      },
      "imei": {
        "id": "(int) ID IMEI",
        "code": "(string) Số IMEI"
      },
      "batch": {
        "id": "(int) ID lô",
        "name": "(string) Tên lô",
        "manufactureDate": "(string) Ngày sản xuất",
        "expiredDate": "(string) Ngày hết hạn"
      },
      "avgCost": "(int) Giá vốn lần xuất nhập kho",
      "productPrice": "(int) Giá bán lần xuất nhập kho",
      "quantity": "(int) Số lượng",
      "vat": "(int) VAT",
      "vatPercent": "(int) Phần trăm VAT",
      "discount": "(int) Chiết khấu",
      "description": "(string) Ghi chú",
      "points": "(int) Số điểm được cộng",
      "usedPoints": "(int) Số điểm đã tiêu",
      "usedPointAmount": "(int) Số tiền đã tiêu",
      "createdAt": "(int) Thời gian tạo (định dạng timestamp)",
      "saleBonus": "(int) Số tiền hoa hồng cho nhân viên bán hàng",
      "extendedWarranty": {
        "id": "(int) ID bảo hành mở rộng",
        "amount": "(int) Số tiền bảo hành mở rộng",
        "month": "(int) Số tháng bảo hành mở rộng"
      },
      "warrantyReasonId": "(int) ID lý do bảo hành"
    }
  ]
}
```


# Danh sách xuất nhập kho nháp

* API này dùng để lấy [danh sách phiếu nháp](https://nhanh.vn/inventory/requirement/bill): hóa đơn nháp nhà cung cấp, bán lẻ, bán sỉ, chuyển kho.
  * Các loại hóa đơn khác bạn có thể xem 2 request params là type và mode ở bên dưới để làm tương tự.
* **Chú ý:**
  * Hệ thống chỉ hỗ trợ lấy hóa đơn trong khoảng 31 ngày.
  * Nếu bạn không truyền param lastUpdatedAt mặc định sẽ lấy 31 ngày gần nhất. Nếu bạn muốn lấy dữ liệu các ngày cũ hơn, xin vui lòng truyền lastUpdatedAtFrom và lastUpdatedAtTo trong khoảng 31 ngày, VD: 2025-08-01 => 2025-08-31.
  * Khi lọc theo ids thì bỏ qua khoảng ngày.

## Request

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/bill/draftlist?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "modes": [2],
        "lastUpdatedAtFrom": 1753981239,
        "lastUpdatedAtTo": 1756659639,
        "depotIds": [31010]
    },
     "paginator": {
        "size": 50,
        "next": {"id": 100}
    },
}'
```

### Filters

| Key               | Type  | Description                                            |
| ----------------- | ----- | ------------------------------------------------------ |
| ids               | array | ID phiếu xuất nhập kho                                 |
| types             | array | [Loại xuất nhập kho](/v3/modelconstant#inventory-type) |
| modes             | array | [Kiểu xuất nhập kho](/v3/modelconstant#inventory-mode) |
| depotIds          | array | Mảng ID kho hàng                                       |
| statuses          | array | List trạng thái phiếu nháp                             |
| lastUpdatedAtFrom | int   | Thời gian cập nhật cuối từ (timestamp)                 |
| lastUpdatedAtTo   | int   | Thời gian cập nhật cuối đến (timestamp)                |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

* Xem const [Loại xuất nhập kho](/v3/modelconstant#inventory-type)
* Xem const [Kiểu xuất nhập kho](/v3/modelconstant#inventory-mode)

```json
{
  "code": 1,
  "paginator": {
    "next": "1900073"
  },
  "data": [
    {
      "id": "(int) ID phiếu nháp",
      "type": "(int) Loại xuất nhập kho",
      "mode": "(int) Kiểu xuất nhập kho",
      "fromDepotId": "(int) ID kho hàng xuất",
      "toDepotId": "(int) ID kho hàng nhận",
      "status": "(int) ID trạng thái phiếu nháp",
      "lastUpdatedAt": "(int) Thời gian cập nhật cuối (timestamp)",
      "created": {
        "userId": "(int) ID người tạo phiếu nháp",
        "createdAt": "(int) Thời gian tạo phiếu nháp (timestamp)"
      },
      "approved": {
        "userId": "(int) ID người duyệt phiếu nháp",
        "approvedAt": "(int) Thời gian duyệt phiếu nháp (timestamp)"
      },
      "confirmed": {
        "userId": "(int) ID người xác nhận phiếu nháp",
        "approvedAt": "(int) Thời gian xác nhận phiếu nháp (timestamp)"
      },
      "payment": {
        "discount": "(double) Số tiền chiết khấu theo đơn"
      },
      "description": "(string) Ghi chú thêm"
    }
  ]
}
```


# Sản phẩm xuất nhập kho nháp

* Tính năng này dùng để lấy danh sách [sản phẩm xuất nhập kho nháp](https://nhanh.vn/inventory/requirement/index).

## Request

* Xem các [common request params](/v3#request-params)

```curl
curl --location 'http://pos.open.nhanh.vn/v3.0/bill/draftproducts?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "modes": [2],
        "lastUpdatedAtFrom": 1753981239,
        "lastUpdatedAtTo": 1756659639,
        "depotIds": [31010]
    },
    "paginator": {
        "size": 50
    }
}'
```

### Filters

| Key               | Type  | Description                                            |
| ----------------- | ----- | ------------------------------------------------------ |
| billIds           | array | List ID phiếu xuất nhập kho nháp                       |
| types             | array | [Loại xuất nhập kho](/v3/modelconstant#inventory-type) |
| modes             | array | [Kiểu xuất nhập kho](/v3/modelconstant#inventory-mode) |
| depotIds          | array | Mảng ID kho hàng                                       |
| statuses          | array | List trạng thái phiếu nháp                             |
| lastUpdatedAtFrom | int   | Thời gian cập nhật cuối từ (timestamp)                 |
| lastUpdatedAtTo   | int   | Thời gian cập nhật cuối đến (timestamp)                |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID bản ghi sản phẩm xuất nhập kho nháp",
      "billId": "(int) ID hóa đơn xuất nhập kho nháp",
      "type": "(int) Loại xuất nhập kho",
      "mode": "(int) Kiểu xuất nhập kho",
      "status": "(int) Trạng thái",
      "damagedQuantity": "(double) Số lượng lỗi",
      "discount": "(int) Chiết khấu",
      "fromDepot": {
        "id": "(int) ID kho hàng",
        "name": "(string) Tên kho hàng"
      },
      "toDepot": {
        "id": "(int) Id kho hàng",
        "name": "(string) Tên kho hàng"
      },
      "supplier": {
        "id": "(int) ID nhà cung cấp",
        "name": "(string) Tên nhà cung cấp",
        "mobile": "(string) Số điện thoại nhà cung cấp"
      },
      "product": {
        "id": "(int) ID sản phẩm",
        "code": "(string) Mã sản phẩm",
        "barcode": "(string) Mã vạch sản phẩm",
        "name": "(string) Tên sản phẩm",
        "prices": {
          "retail": "(double) Giá bán",
          "import": "(double) Giá nhập",
          "avgCost": "(double) Giá vốn"
        },
        "batchId": "(int) ID lô sản phẩm",
        "imeiId": "(int) ID IMEI",
        "imei": "(string) Số IMEI"
      },
      "required": {
        "quantity": "(int) Số lượng yêu cầu",
        "price": "(int) Giá yêu cầu",
        "description": "(string) Ghi chú",
        "userId": "(int) ID người yêu cầu",
        "userName": "(string) Tên người yêu cầu",
        "datetime": "(string) Thời gian yêu cầu"
      },
      "approved": {
        "quantity": "(int) Số lượng duyệt",
        "price": "(int) Giá duyệt",
        "description": "(string) Ghi chú",
        "userId": "(int) ID người duyệt",
        "userName": "(string) Tên người duyệt",
        "approvedAt": "(int) Thời gian duyệt (định dạng timestamp)"
      },
      "confirmed": {
        "quantity": "(int) Số lượng xác nhận",
        "confirmedAt": "(int) Thời gian xác nhận (định dạng timestamp)"
      }
    }
  ]
}
```


# Thêm phiếu nhập nhà cung cấp

* API này dùng để thêm phiếu nhập hàng từ nhà cung cấp

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/inventory/importsupplier?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "depotId": 31010,
  "supplierId": 40827,
  "description": "test api V3",
  "products": [
    {
      "id": 1231275955,
      "discount": {"type": "cash", "value": 0},
      "imeis": ["TestImei1", "TestImei2"],
      "quantity": 2,
      "description": "",
      "expiredDate": "",
      "price": 50000,
      "weight": 0,
      "unitId": 0,
      "batchId": 0,
      "vat": {
        "type": "cash",
        "value": 0
      }
    }
  ],
  "payment": {
    "manualDiscountType": "percent",
    "manualDiscount": 10,
    "cash": {
      "value": 0,
      "accountId": 0
    },
    "transfer": {
      "value": 500000,
      "accountId": 263475
    }
  }
}'
```

* Thông tin nhập nhà cung cấp:

| Key               | Type                       | Description                                                                                    |
| ----------------- | -------------------------- | ---------------------------------------------------------------------------------------------- |
| depotId           | int $$^{{\color{red}\*}}$$ | ID kho hàng                                                                                    |
| supplierId        | int $$^{{\color{red}\*}}$$ | ID nhà cung cấp. [Thêm mới](/v3/business/addsupplier)                                          |
| products          | array                      | [Thông tin sản phẩm](#products)                                                                |
| description       | string                     | Ghi chú                                                                                        |
| tagIds            | array                      | List ID nhãn muốn gắn cho phiếu nhập                                                           |
| payment           | object                     | [Thông tin thanh toán](#payment)                                                               |
| debtDueDate       | string                     | Ngày hẹn thanh toán (Y-m-d)                                                                    |
| updateImportPrice | int                        | Cập nhật giá nhập của sản phẩm theo giá trong lần nhập này (1: Có cập nhật, 0: Không cập nhật) |

### products

* Thông tin sản phẩm

| Key              | Type                          | Description                                                                                                       |
| ---------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| id               | int $$^{{\color{red}\*}}$$    | ID sản phẩm                                                                                                       |
| quantity         | double $$^{{\color{red}\*}}$$ | Số lượng sản phẩm                                                                                                 |
| price            | double                        | Giá bán sản phẩm                                                                                                  |
| discount         | object                        | <p>Chiết khấu sản phẩm<br>- type: Loại chiết khấu (percent: %, cash: Tiền mặt)<br>- value: Giá trị chiết khấu</p> |
| vat              | object                        | <p>VAT sản phẩm<br>- type: Loại VAT (percent: %, cash: Tiền mặt)<br>- value: Giá trị VAT</p>                      |
| imeis            | array                         | Danh sách IMEI nhập kho (Bắt buộc nhập nếu sản phẩm là loại bán theo IMEI)                                        |
| unitId           | int                           | [ID đơn vị tính](/v3/product/unit) (bắt buộc nếu sản phẩm loại nhiều đơn vị tính)                                 |
| batchId          | int                           | [ID lô sản phẩm](/v3/product/batch) (bắt buộc nếu sản phẩm bán theo lô)                                           |
| weight           | int                           | Cân nặng sản phẩm (Tính theo Gram)                                                                                |
| expiredDate      | string                        | Ngày hết hạn (Áp dụng cho những sản phẩm có ngày hết hạn Y-m-d)                                                   |
| priorWarningDays | int                           | Cảnh báo hết hạn trước bao nhiêu ngày?                                                                            |
| description      | string                        | Ghi chú sản phẩm                                                                                                  |

### payment

* Thông tin thanh toán

| Key                | Type   | Description                                                                                                                                            |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| manualDiscountType | string | Loại chiết khấu tổng đơn                                                                                                                               |
| manualDiscount     | double | Giá trị chiết khấu tổng đơn (Nếu nhập cả chiết khấu tổng đơn và chiết khấu sản phẩm sẽ ưu tiên chiết khấu tổng đơn, không tính chiết khấu sản phẩm)    |
| cash               | object | <p>Thanh toán bằng hình thức tiền mặt<br>- accountId: Tài khoản tiền mặt trên Nhanh (nếu có dùng kế toán)<br>- value: Giá trị tiền mặt</p>             |
| transfer           | object | <p>Thanh toán bằng hình thức chuyển khoản<br>- accountId: Tài khoản chuyển khoản trên Nhanh (nếu có dùng kế toán)<br>- value: Giá trị chuyển khoản</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).
*

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "data": {
        "id": "(int) ID phiếu nhập kho vừa tạo",
        "totalAmount": "(double) Giá trị phiếu nhập kho"
    }
}
```


# Thêm phiếu trả nhà cung cấp

* API này dùng để thêm phiếu xuất từ nhà cung cấp

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/inventory/exportsupplier?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "depotId": 31010,
  "supplierId": 40827,
  "description": "test api V3",
  "products": [
    {
      "id": 1231275955,
      "discount": {"type": "cash", "value": 0},
      "imeis": ["TestImei1", "TestImei2"],
      "quantity": 2,
      "description": "",
      "price": 50000,
      "unitId": 0,
      "batchId": 0,
      "vat": {
        "type": "cash",
        "value": 0
      }
    }
  ],
  "payment": {
    "manualDiscountType": "percent",
    "manualDiscount": 10,
    "cash": {
      "value": 0,
      "accountId": 0
    },
    "transfer": {
      "value": 500000,
      "accountId": 263475
    }
  }
}'
```

* Thông tin xuất nhà cung cấp:

| Key         | Type                       | Description                                           |
| ----------- | -------------------------- | ----------------------------------------------------- |
| depotId     | int $$^{{\color{red}\*}}$$ | ID kho hàng                                           |
| supplierId  | int $$^{{\color{red}\*}}$$ | ID nhà cung cấp. [Thêm mới](/v3/business/addsupplier) |
| products    | array                      | [Thông tin sản phẩm](#products)                       |
| description | string                     | Ghi chú                                               |
| tagIds      | array                      | List ID nhãn muốn gắn cho phiếu xuất                  |
| payment     | object                     | [Thông tin thanh toán](#payment)                      |
| debtDueDate | string                     | Ngày hẹn thanh toán (Y-m-d)                           |

### products

* Thông tin sản phẩm

| Key         | Type                          | Description                                                                                                       |
| ----------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| id          | int $$^{{\color{red}\*}}$$    | ID sản phẩm                                                                                                       |
| quantity    | double $$^{{\color{red}\*}}$$ | Số lượng sản phẩm                                                                                                 |
| price       | double                        | Giá bán sản phẩm                                                                                                  |
| discount    | object                        | <p>Chiết khấu sản phẩm<br>- type: Loại chiết khấu (percent: %, cash: Tiền mặt)<br>- value: Giá trị chiết khấu</p> |
| vat         | object                        | <p>VAT sản phẩm<br>- type: Loại VAT (percent: %, cash: Tiền mặt)<br>- value: Giá trị VAT</p>                      |
| imei        | string                        | IMEI sản phẩm (bắt buộc nhập nếu sản phẩm loại IMEI)                                                              |
| unitId      | int                           | [ID đơn vị tính](/v3/product/unit) (bắt buộc nếu sản phẩm loại nhiều đơn vị tính)                                 |
| batchId     | int                           | [ID lô sản phẩm](/v3/product/batch) (bắt buộc nếu sản phẩm bán theo lô)                                           |
| weight      | int                           | Cân nặng sản phẩm (Tính theo Gram)                                                                                |
| description | string                        | Ghi chú sản phẩm                                                                                                  |

### payment

* Thông tin thanh toán

| Key                | Type   | Description                                                                                                                                            |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| manualDiscountType | string | Loại chiết khấu tổng đơn                                                                                                                               |
| manualDiscount     | double | Giá trị chiết khấu tổng đơn (Nếu nhập cả chiết khấu tổng đơn và chiết khấu sản phẩm sẽ ưu tiên chiết khấu tổng đơn, không tính chiết khấu sản phẩm)    |
| cash               | object | <p>Thanh toán bằng hình thức tiền mặt<br>- accountId: Tài khoản tiền mặt trên Nhanh (nếu có dùng kế toán)<br>- value: Giá trị tiền mặt</p>             |
| transfer           | object | <p>Thanh toán bằng hình thức chuyển khoản<br>- accountId: Tài khoản chuyển khoản trên Nhanh (nếu có dùng kế toán)<br>- value: Giá trị chuyển khoản</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).
*

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "data": {
        "id": "(int) ID phiếu xuất kho vừa tạo",
        "totalAmount": "(double) Giá trị phiếu xuất kho"
    }
}
```


# Thêm phiếu nhập khác

* API này dùng để thêm phiếu nhập kho khác.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/inventory/importother?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "depotId": 1000,
  "customer": {
    "id": "20184482",
    "mobile": "0987654321",
    "name": "Test API V3"
  },
  "description": "test api V3",
  "products": [
    {
      "id": 1231275955,
      "discount": {"type": "cash", "value": 0},
      "quantity": 2,
      "description": "",
      "expiredDate": "",
      "price": 50000,
      "weight": 0,
      "unitId": 0,
      "batchId": 0,
      "vat": {
        "type": "cash",
        "value": 0
      }
    }
  ],
  "payment": {
    "manualDiscountType": "percent",
    "manualDiscount": 10,
    "cash": {
      "value": 0,
      "accountId": 0
    },
    "transfer": {
      "value": 90000,
      "accountId": 263475
    }
  }
}'
```

* Thông tin nhập khác:

| Key               | Type                       | Description                                                                                    |
| ----------------- | -------------------------- | ---------------------------------------------------------------------------------------------- |
| depotId           | int $$^{{\color{red}\*}}$$ | ID kho hàng                                                                                    |
| customer          | object                     | [Thông tin khách hàng](#customer)                                                              |
| products          | array                      | [Thông tin sản phẩm](#products)                                                                |
| description       | string                     | Ghi chú                                                                                        |
| tagIds            | array                      | List ID nhãn muốn gắn cho phiếu nhập                                                           |
| payment           | object                     | [Thông tin thanh toán](#payment)                                                               |
| debtDueDate       | string                     | Ngày hẹn thanh toán (Y-m-d)                                                                    |
| updateImportPrice | int                        | Cập nhật giá nhập của sản phẩm theo giá trong lần nhập này (1: Có cập nhật, 0: Không cập nhật) |

### customer

* Thông tin khách hàng

| Key     | Type   | Description              |
| ------- | ------ | ------------------------ |
| id      | int    | ID khách hàng            |
| name    | string | Tên khách hàng           |
| mobile  | string | Số điện thoại khách hàng |
| email   | string | Email khách hàng         |
| address | string | Địa chỉ khách hàng       |

### products

* Thông tin sản phẩm

| Key              | Type                          | Description                                                                                                       |
| ---------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| id               | int $$^{{\color{red}\*}}$$    | ID sản phẩm                                                                                                       |
| quantity         | double $$^{{\color{red}\*}}$$ | Số lượng sản phẩm                                                                                                 |
| price            | double                        | Giá bán sản phẩm                                                                                                  |
| discount         | object                        | <p>Chiết khấu sản phẩm<br>- type: Loại chiết khấu (percent: %, cash: Tiền mặt)<br>- value: Giá trị chiết khấu</p> |
| vat              | object                        | <p>VAT sản phẩm<br>- type: Loại VAT (percent: %, cash: Tiền mặt)<br>- value: Giá trị VAT</p>                      |
| imeis            | array                         | Danh sách IMEI nhập kho (Bắt buộc nhập nếu sản phẩm là loại bán theo IMEI)                                        |
| unitId           | int                           | [ID đơn vị tính](/v3/product/unit) (bắt buộc nếu sản phẩm loại nhiều đơn vị tính)                                 |
| batchId          | int                           | [ID lô sản phẩm](/v3/product/batch) (bắt buộc nếu sản phẩm bán theo lô)                                           |
| weight           | int                           | Cân nặng sản phẩm (Tính theo Gram)                                                                                |
| expiredDate      | string                        | Ngày hết hạn (Áp dụng cho những sản phẩm có ngày hết hạn Y-m-d)                                                   |
| priorWarningDays | int                           | Cảnh báo hết hạn trước bao nhiêu ngày?                                                                            |
| description      | string                        | Ghi chú sản phẩm                                                                                                  |

### payment

* Thông tin thanh toán

| Key                | Type   | Description                                                                                                                                            |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| manualDiscountType | string | Loại chiết khấu tổng đơn                                                                                                                               |
| manualDiscount     | double | Giá trị chiết khấu tổng đơn (Nếu nhập cả chiết khấu tổng đơn và chiết khấu sản phẩm sẽ ưu tiên chiết khấu tổng đơn, không tính chiết khấu sản phẩm)    |
| cash               | array  | <p>Thanh toán bằng hình thức tiền mặt<br>- accountId: Tài khoản tiền mặt trên Nhanh (nếu có dùng kế toán)<br>- value: Giá trị tiền mặt</p>             |
| transfer           | array  | <p>Thanh toán bằng hình thức chuyển khoản<br>- accountId: Tài khoản chuyển khoản trên Nhanh (nếu có dùng kế toán)<br>- value: Giá trị chuyển khoản</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "data": {
        "id": "(int) ID phiếu nhập kho vừa tạo",
        "totalAmount": "(double) Giá trị phiếu nhập kho"
    }
}
```


# Thêm phiếu trả khác

* API này dùng để thêm phiếu xuất kho khác.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/inventory/exportother?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "depotId": 1000,
  "customer": {
    "id": "20184482",
    "mobile": "0987654321",
    "name": "Test API V3"
  },
  "description": "test api V3",
  "products": [
    {
      "id": 1231275955,
      "discount": {"type": "cash", "value": 0},
      "quantity": 2,
      "description": "",
      "price": 50000,
      "unitId": 0,
      "batchId": 0,
      "vat": {
        "type": "cash",
        "value": 0
      }
    }
  ],
  "payment": {
    "manualDiscountType": "percent",
    "manualDiscount": 10,
    "cash": {
      "value": 0,
      "accountId": 0
    },
    "transfer": {
      "value": 90000,
      "accountId": 263475
    }
  }
}'
```

* Thông tin xuất khác:

| Key         | Type                       | Description                          |
| ----------- | -------------------------- | ------------------------------------ |
| depotId     | int $$^{{\color{red}\*}}$$ | ID kho hàng                          |
| customer    | object                     | [Thông tin khách hàng](#customer)    |
| products    | array                      | [Thông tin sản phẩm](#products)      |
| description | string                     | Ghi chú                              |
| tagIds      | array                      | List ID nhãn muốn gắn cho phiếu xuất |
| payment     | object                     | [Thông tin thanh toán](#payment)     |
| debtDueDate | string                     | Ngày hẹn thanh toán (Y-m-d)          |

### customer

* Thông tin khách hàng

| Key     | Type   | Description              |
| ------- | ------ | ------------------------ |
| id      | int    | ID khách hàng            |
| name    | string | Tên khách hàng           |
| mobile  | string | Số điện thoại khách hàng |
| email   | string | Email khách hàng         |
| address | string | Địa chỉ khách hàng       |

### products

* Thông tin sản phẩm

| Key         | Type                          | Description                                                                                                       |
| ----------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| id          | int $$^{{\color{red}\*}}$$    | ID sản phẩm                                                                                                       |
| quantity    | double $$^{{\color{red}\*}}$$ | Số lượng sản phẩm                                                                                                 |
| price       | double                        | Giá bán sản phẩm                                                                                                  |
| discount    | object                        | <p>Chiết khấu sản phẩm<br>- type: Loại chiết khấu (percent: %, cash: Tiền mặt)<br>- value: Giá trị chiết khấu</p> |
| vat         | object                        | <p>VAT sản phẩm<br>- type: Loại VAT (percent: %, cash: Tiền mặt)<br>- value: Giá trị VAT</p>                      |
| imei        | string                        | IMEI sản phẩm (bắt buộc nhập nếu sản phẩm loại IMEI)                                                              |
| unitId      | int                           | [ID đơn vị tính](/v3/product/unit) (bắt buộc nếu sản phẩm loại nhiều đơn vị tính)                                 |
| batchId     | int                           | [ID lô sản phẩm](/v3/product/batch) (bắt buộc nếu sản phẩm bán theo lô)                                           |
| description | string                        | Ghi chú sản phẩm                                                                                                  |

### payment

* Thông tin thanh toán

| Key                | Type   | Description                                                                                                                                            |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| manualDiscountType | string | Loại chiết khấu tổng đơn                                                                                                                               |
| manualDiscount     | double | Giá trị chiết khấu tổng đơn (Nếu nhập cả chiết khấu tổng đơn và chiết khấu sản phẩm sẽ ưu tiên chiết khấu tổng đơn, không tính chiết khấu sản phẩm)    |
| cash               | array  | <p>Thanh toán bằng hình thức tiền mặt<br>- accountId: Tài khoản tiền mặt trên Nhanh (nếu có dùng kế toán)<br>- value: Giá trị tiền mặt</p>             |
| transfer           | array  | <p>Thanh toán bằng hình thức chuyển khoản<br>- accountId: Tài khoản chuyển khoản trên Nhanh (nếu có dùng kế toán)<br>- value: Giá trị chuyển khoản</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "data": {
        "id": "(int) ID phiếu xuất kho vừa tạo",
        "totalAmount": "(double) Giá trị phiếu xuất kho"
    }
}
```


# Hạn mức tồn kho

* Tính năng này dùng để lấy [danh sách hạn mức tồn kho](https://nhanh.vn/inventory/archive/index).
* Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 50 sản phẩm.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/inventory/archive?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
    },
    "paginator": {
        "size": 50,
        "sort": {"id": "desc"},
        "next": {"id": 100}
    }
}'
```

### Filters

| Key           | Type  | Description                                             |
| ------------- | ----- | ------------------------------------------------------- |
| productIds    | array | Mảng ID sản phẩm, tối đa 100                            |
| depotIds      | array | Id cửa hàng - tối đa 500                                |
| categoryId    | int   | Id danh mục sản phẩm                                    |
| brandId       | array | ID thương hiệu                                          |
| createdAtFrom | int   | Tạo hạn mức tồn kho từ ngày (định dạng timestamp)       |
| createdAtTo   | int   | Tạo hạn mức tồn kho đến ngày (định dạng timestamp)      |
| updatedAtFrom | int   | Cập nhật hạn mức tồn kho từ ngày (định dạng timestamp)  |
| updatedAtTo   | int   | Cập nhật hạn mức tồn kho đến ngày (định dạng timestamp) |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

#### sort

| Value | Description | Sort                          |
| ----- | ----------- | ----------------------------- |
| id    | ID sản phẩm | desc: giảm dần, asc: tăng dần |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
	"code": 1,
	"paginator": {
		"next": "Dùng để lấy dũ liệu trang tiếp theo"
	},
	"data": [
		{
            "depot": {
                "id": "(int) Id cửa hàng",
                "name": "(string) Tên cửa hàng"
            },
			"product": {
				"id": "(double) Id sản phẩm",
				"barcode": "(string) Mã vạch sản phẩm",
				"code": "(string) Mã sản phẩm",
				"name": "(string) Tên sản phẩm",
				"remain": "(double) Tồn hiện tại"
			},
            "minRemain": "(double) Tồn tối thiểu sản phẩm",
            "maxRemain": "(double) Tồn tối đa sản phẩm",
            "waiting": "(double) Số lượng chờ nhập hàng",
            "available": "(double) Số lượng có thể bán",
            "createdBy": {
                "id": "(int) Id người tạo",
                "name": "(string) Tên người tạo"
            },
            "createdAt": "(double) Thời gian tạo hạn mức tồn kho",
            "updatedAt": "(double) Thời gian cập nhật hạn mức tồn kho"
		}
	]
}
```


# Danh sách khách hàng

* API này dùng để lấy [danh sách khách hàng](https://nhanh.vn/customer/code/customerlist).
* **Chú ý**: Nếu bạn hay thường xuyên cần gọi toàn bộ danh sách khách hàng, bạn nên lưu giá trị thời gian lần cuối cùng quét toàn bộ, sau đó dùng 2 request params là updatedAtFrom và updatedAtTo để chỉ lấy về các khách hàng có cập nhật mới, không cần gọi lại toàn bộ khách cũ không có thay đổi gì.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/customer/list?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "type": 1,
        "updatedAtFrom": 1753981200
    },
    "paginator": {
        "size": 10
    }
}'
```

### Filters

| Key                | Type   | Description                                               |
| ------------------ | ------ | --------------------------------------------------------- |
| ids                | array  | Mảng ID khách hàng trên Nhanh.vn, tối đa 100.             |
| mobile             | string | Số điện thoại khách hàng. VD: 0988999999                  |
| lastBoughtDateFrom | string | Từ ngày mua cuối cùng (yyyy-mm-dd). VD: 2022-09-25        |
| lastBoughtDateTo   | string | Đến ngày mua cuối cùng (yyyy-mm-dd). VD: 2022-09-26       |
| updatedAtFrom      | int    | Ngày cập nhật khách hàng từ ngày (Định dạng timestamp)    |
| updatedAtTo        | int    | Ngày cập nhật khách hàng đến ngày (Định dạng timestamp)   |
| type               | int    | Loại khách hàng. (1 = Khách lẻ, 2 = Khách sỉ, 3 = Đại lý) |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Giá trị để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID khách hàng",
      "type": "(int) Loại khách hàng (1 = Khách lẻ, 2 = Khách buôn, 3 = Đại lý)",
      "name": "(string) Tên khách hàng 1",
      "mobile": "(string) Số điện thoại khách hàng",
      "code": "(string) Mã khách hàng",
      "gender": "(int) Giới tính (1 = nam, 2 = nữ)",
      "address": "170 Đê La Thành - Đống Đa - Hà Nội",
      "email": "(string) Email khách hàng",
      "birthday": "(string) Ngày sinh của khách hàng (định dạng Y-m-d)",
      "points": "(int) Điểm tích lũy hiện tại của khách hàng",
      "saleName": "(string) Thông tin nhân viên được gắn cho khách hàng",
      "startedDate": "(string) Ngày bắt đầu mua hàng (định dạng Y-m-d)",
      "taxCode": "(string) Mã số thuế",
      "locations": {
        "cityId": "(int) ID tỉnh/thành phố",
        "districtId": "(int) ID quận/huyện",
        "wardId": "(int) ID phường xã"
      },
      "location": {
        "cityId": "(int) ID tỉnh/thành phố (Địa chỉ 2 cấp)",
        "wardId": "(int) ID phường xã (Địa chỉ 2 cấp)"
      },
      "business": {
        "name": "(string) Tên công ty",
        "address": "(string) Địa chỉ công ty"
      },
      "level": {
        "id": "(int) ID cấp độ khách hàng",
        "name": "(string) Tên cấp độ khách hàng"
      },
      "group": {
        "id": "(int) ID nhóm khách hàng",
        "name": "(string) Tên nhóm khách hàng"
      },
      "totalAmount": "(double) Tổng số tiền khách mua hàng",
      "updatedAt": "(int) Ngày cập nhật khách hàng"
    }
  ]
}
```


# Thêm khách hàng

* API này dùng để thêm khách hàng.
* Tối đa mỗi lần không quá 100 khách hàng.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/customer/add?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '[
  {
    "name": "Nguyễn Văn A",
    "mobile": "0989999998",
    "locations": {
      "cityId": 254,
      "districtId": 320,
      "wardId": 1108
    }
  },
  {
    "name": "Nguyễn Văn B",
    "mobile": "098999997"
  }
]'
```

* Thông tin khách hàng

| Key             | Type                          | Description                                                                                             |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| name            | string $$^{{\color{red}\*}}$$ | Tên khách hàng                                                                                          |
| mobile          | string $$^{{\color{red}\*}}$$ | Số điện thoại khách hàng                                                                                |
| type            | int                           | <p>Loại khách hàng. 1 = Khách lẻ (default),<br>2 = Khách buôn</p>                                       |
| address         | string                        | Địa chỉ khách hàng                                                                                      |
| gender          | int                           | <p>Giới tính khách hàng. 1 = Nam<br>2 = Nữ</p>                                                          |
| birthday        | date                          | Sinh nhật khách hàng (Định dạng Y-m-d)                                                                  |
| locations       | array                         | Mảng thông tin: Thành phố, quận huyện, phường xã. [Xem bên dưới](#location-param)                       |
| email           | string                        | Email khách hàng                                                                                        |
| pid             | string                        | Số căn cước công dân                                                                                    |
| groupId         | int                           | ID nhóm khách hàng trên Nhanh.vn                                                                        |
| tagIds          | array\[]                      | [Mảng ID nhãn khách hàng](/v3/customer/tags)                                                            |
| points          | int                           | Điểm tích lũy của khách hàng                                                                            |
| taxCode         | string                        | Mã số thuế                                                                                              |
| businessName    | string                        | Tên công ty                                                                                             |
| businessAddress | string                        | Địa chỉ công ty                                                                                         |
| description     | string                        | Mô tả                                                                                                   |
| facebookLink    | string                        | Facebook link                                                                                           |
| fromCustomer    | string                        | Số điện thoại khách hàng giới thiệu (khách hàng đã tồn tại trên hệ thống Nhanh.vn)                      |
| saleName        | string                        | Nhân viên phụ trách (username/email của nhân viên thuộc doanh nghiệp đã tồn tại trên hệ thống Nhanh.vn) |

### Locations param

| Key        | Type | Description                                                  |
| ---------- | ---- | ------------------------------------------------------------ |
| cityId     | int  | ID thành phố (Lấy từ [API location](/v3/shipping/location))  |
| districtId | int  | ID quận huyện (Lấy từ [API location](/v3/shipping/location)) |
| wardId     | int  | ID phường xã (Lấy từ [API location](/v3/shipping/location))  |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "id": "(int) ID khách hàng 1",
      "mobile": "(string) Số điện thoại khách hàng"
    },
    {
      "id": "(int) ID khách hàng 2",
      "mobile": "(string) Số điện thoại khách hàng"
    }
  ]
}
```


# Danh sách nhãn khách hàng

* API này dùng để lấy danh sách [nhãn khách hàng](https://nhanh.vn/setting/store/labels).
* Chú ý: Dữ liệu này rất ít khi bị thay đổi, bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 24h.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/customer/tags?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
         "ids": [ID_1,ID_2]
    },
    "paginator": {
        "size": 100
    }
}'
```

### Filters

| Key  | Type   | Description             |
| ---- | ------ | ----------------------- |
| ids  | array  | List ID nhãn khách hàng |
| name | string | Tên nhãn khách hàng     |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": {
      "id": "XXX"
    }
  },
  "data": [
    {
      "id": "(int) ID nhãn khách hàng",
      "businessId": "(int) ID doanh nghiệp",
      "name": "(string) Tên nhãn khách hàng",
      "status": "(int) Trạng thái khách hàng",
      "bgColor": "(string) Màu nền",
      "textColor": "(string) Màu chữ",
      "createdAt": "(int) Thời gian tạo - định dạng timestamp"
    }
  ]
}
```


# Danh sách chương trình coupon

* Tính năng này dùng để lấy danh sách chương trình giảm giá ở trên Nhanh.vn.
* Coupon có thể được cài đặt:
  * Khoảng ngày được áp dụng.
  * Giá trị giảm giá theo %, theo tiền mặt.
  * Chỉ áp dụng cho hóa đơn từ bao nhiêu.
  * Chỉ được dùng ở cửa hàng nào.
  * Chỉ được giảm tối đa bao nhiêu tiền (VD giảm 15% nhưng tối đa 100K).
  * Coupon cũng có thể được cài đặt để chỉ được sử dụng 1 lần duy nhất hoặc được áp dụng bao nhiêu lần (canUsedTimes), bạn cần chú ý con số này để khi tặng mã Coupon cho khách hàng không nên vượt quá số lượt được sử dụng, tránh tình huống những khách hàng sau không dùng được mã coupon nữa.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/promotion/batch).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/promotion/batch?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        
    },
    "paginator": {
        "size": 100
    }
}'
```

#### Filters

| Key        | Type   | Description                              |
| ---------- | ------ | ---------------------------------------- |
| id         | int    | Tìm kiếm theo ID đợt phát hành giảm giá. |
| couponCode | string | Tìm kiếm theo mã giảm giá.               |
| productId  | int    | Tìm kiếm theo ID sản phẩm.               |
| depotId    | int    | Tìm kiếm theo ID kho.                    |
| name       | string | Tìm kiếm tên đợt phát hành mã giảm giá.  |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID chương trình coupon",
      "name": "(string) Tên chương trình coupon",
      "description": "(string) Mô tả chương trình coupon",
      "startDate": "(string) Ngày bắt đầu áp dụng",
      "endDate": "(string) Ngày kết thúc áp dụng",
      "status": "(int) Trạng thái",
      "numberOfCodes": "(int) Số lượng mã giảm giá",
      "codeLength": "(int) Độ dài mã giảm giá",
      "prefix": "(string) Tiền tố mã giảm giá",
      "suffix": "(string) Hâu tố mã giảm giá",
      "valueType": "(int) Loại mã giảm giá (1: Tiền mặt, 2: Phần trăm)",
      "value": "(int) Giá trị mã giảm giá",
      "valueMax": "(int) Giá trị giảm giá tối đa",
      "fromValue": "(int) Áp dụng cho hóa đơn có giá trị từ bao nhiêu",
      "depotIds": "(int)[] Các cửa hàng áp dung. Giá trị = [] có nghĩa là áp dụng cho tất cả các cửa hàng",
      "toValue": "(int) Áp dụng cho hóa đơn có giá trị đến bao nhiêu",
      "notApplyWithDiscountPromotion": "(bool) Không áp dụng cùng chương trình chiết khấu (true: Có, false: Không)",
      "isCategoryApplyOnce": "(int) 1: Áp dụng một lần nếu có sản phẩm thuộc nhiều danh mục đã chọn",
      "createdBy": {
        "id": "(int) ID người tạo chương trình",
        "name": "(string) Người tạo chương trình"
      },
      "totalUsedTime": "(int) Tổng số đã sử dụng",
      "totalAssign": "(int) Tổng số đã tặng"
    }
  ]
}
```


# Thêm chương trình coupon

* Tính năng này được sử dụng để tạo chương trình mã giảm giá.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/promotion/batchadd).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/promotion/batchadd?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "name": "Chương trình giảm giá 1",
    "status": 1,
    "startDate": "2025-07-01",
    "endDate": "2025-12-31",
    "codeLength": 5,
    "numberOfCodes": 100,
    "canUsedTimes": 10,
    "valueType": 1,
    "value": 10000
}'
```

### Thông tin tạo chương trình coupon

| Key                           | Type                               | Description                                                             |
| ----------------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| name                          | string(255) $$^{{\color{red}\*}}$$ | Tên chương trình coupon                                                 |
| status                        | int $$^{{\color{red}\*}}$$         | Trạng thái: 1 - Active, 2 - Inactive                                    |
| startDate                     | string $$^{{\color{red}\*}}$$      | Định dạng: Y-m-d. Ngày áp dụng từ, định dạng Y-m-d                      |
| endDate                       | string $$^{{\color{red}\*}}$$      | Định dạng: Y-m-d. Ngày áp dụng đến, định dạng Y-m-d                     |
| codeLength                    | int $$^{{\color{red}\*}}$$         | Độ dài mã coupon, độ dài sẽ bằng số ký tự, vd: 5 = 5 kí tự, 6 = 6 kí tự |
| numberOfCodes                 | int $$^{{\color{red}\*}}$$         | Số lượng mã coupon muốn tạo (Tối đa 20.000 mã)                          |
| canUsedTimes                  | int $$^{{\color{red}\*}}$$         | Số lần sử dụng của từng mã                                              |
| valueType                     | int $$^{{\color{red}\*}}$$         | <p>Kiểu giảm giá<br>1 = Tiền mặt<br>2 = Chiết khấu</p>                  |
| value                         | int $$^{{\color{red}\*}}$$         | Giá trị coupon                                                          |
| depotIds                      | int or array                       | ID hoặc mảng ID kho được áp dụng mã coupon                              |
| categoryIds                   | int or array                       | ID hoặc mảng ID doanh mục được áp dụng mã coupon                        |
| fromValue                     | int                                | Áp dụng cho hóa đơn có tổng tiền từ                                     |
| toValue                       | int                                | Áp dụng cho hóa đơn có tổng tiền đến                                    |
| prefix                        | string(5)                          | Kí tự thêm vào trước mã coupon                                          |
| suffix                        | string(5)                          | Kí tự thêm vào sau mã coupon                                            |
| valueMax                      | int                                | Giá trị giảm giá tối đa                                                 |
| description                   | string(255)                        | Mô tả                                                                   |
| notApplyWithDiscountPromotion | int                                | Không áp dụng cùng chương trình chiết khấu. Giá trị truyền lên: 1       |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": {
    "id": "(int) ID chương trình coupon"
  }
}
```


# Thêm mã coupon vào chương trình

Tính năng này được sử dụng để cập nhật thêm mã vào chương trình coupon đã có trên hệ thống.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/promotion/batchincreasecode).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/promotion/batchincreasecode?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "batchId": 27642,
    "couponNumber": 500,
    "canUsedTimes": 10
}'
```

### Thông tin cập nhật chương trình coupon

| Key          | Type                       | Description                                   |
| ------------ | -------------------------- | --------------------------------------------- |
| batchId      | int $$^{{\color{red}\*}}$$ | ID chương trình coupon                        |
| couponNumber | int $$^{{\color{red}\*}}$$ | Số lượng mã coupon muốn thêm (Tối đa 1000 mã) |
| canUsedTimes | int $$^{{\color{red}\*}}$$ | Số lần sử dụng từng mã coupon                 |
| codeLength   | int                        | Độ dài mã coupon                              |
| prefix       | string                     | Tiền tố                                       |
| suffix       | string                     | Hậu tố                                        |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": {
    "batchId": "(int) ID chương trình giảm giá"
  }
}
```


# Danh sách mã coupon

* Tính năng này dùng để lấy danh sách mã coupon ở trên Nhanh.vn.
* Coupon là các mã giảm giá ngẫu nhiên do shop tạo ra trên hệ thống của Nhanh.vn, shop có thể tạo nhiều chương trình coupon, mỗi chương trình có nhiều mã coupon. Mã coupon là duy nhất (unique không trùng nhau) trên toàn bộ các chương trình coupon.
* Coupon được đùng để tặng cho khách hàng, khi khách mua hàng, có thể đọc mã cho thu ngân, hoặc điền mã coupon trên các form đặt hàng trên website / app để được áp dụng giảm giá.
* Coupon có thể được cài đặt:
  * Khoảng ngày được áp dụng.
  * Giá trị giảm giá theo %, theo tiền mặt.
  * Chỉ áp dụng cho hóa đơn từ bao nhiêu.
  * Chỉ được dùng ở cửa hàng nào.
  * Chỉ được giảm tối đa bao nhiêu tiền (VD giảm 15% nhưng tối đa 100K).
  * Coupon cũng có thể được cài đặt để chỉ được sử dụng 1 lần duy nhất hoặc được áp dụng bao nhiêu lần (canUsedTimes), bạn cần chú ý con số này để khi tặng mã Coupon cho khách hàng không nên vượt quá số lượt được sử dụng, tránh tình huống những khách hàng sau không dùng được mã coupon nữa.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/promotion/couponcode).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/promotion/couponcode?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "batchId": 27642
    },
    "paginator": {
        "size": 100
    }
}'
```

### Filters

| Key     | Type                       | Description            |
| ------- | -------------------------- | ---------------------- |
| batchId | int $$^{{\color{red}\*}}$$ | ID chương trình coupon |
| code    | string                     | Mã coupone cần tìm     |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "depotId": "(int) ID kho hàng",
      "code": "(string) Mã giảm giá",
      "value": "(int) Giá trị",
      "valueMax": "(int) Giá trị tối đa được giảm",
      "valueType": "(int) Loại giảm giá (1= Tiền mặt, 2= Phần trăm)",
      "status": "(int) trạng thái (1 = Active, 2 = Inactive)",
      "usedAt": "(int) Thời gian đã sử dụng mã giảm giá",
      "totalCanUsed": "(int) Tổng số lần có thể sử dụng",
      "totalAssigned": "(int) Tổng số lần đã tặng",
      "totalUsed": "(int) Tổng số lần đã sử dụng",
      "createdAt": "(int) Thời gian tạo"
    }
  ]
}
```


# Danh sách sản phẩm được áp dụng mã coupon

* Tính năng này được sử dụng để lấy danh sản phẩm coupon, dùng trong tình huống bạn tạo các coupon chỉ muốn áp dụng cho 1 số sản phẩm cụ thể. Nếu kết quả trả về productIds là null hoặc 1 mảng rỗng nghĩa là mã coupon được áp dụng cho tất cả sản phẩm (không bị giới hạn chỉ được áp dụng cho 1 vài sản phẩm nào đó).

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/promotion/couponproduct).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/promotion/couponproduct?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "filters": {
        "batchId": 27642
    },
    "paginator": {
        "size": 100
    }
}'
```

### Filters

| Key     | Type                       | Description            |
| ------- | -------------------------- | ---------------------- |
| batchId | int $$^{{\color{red}\*}}$$ | ID chương trình coupon |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "batchId": "(int) ID chương trình giảm giá",
      "product": {
        "id": "(int) ID sản phẩm",
        "name": "(string) Tên sản phẩm"
      }
    }
  ]
}
```


# Cập nhật trạng thái sử dụng coupon

* Tính năng này dùng để cập nhật trạng thái đã sử dụng coupon
  * act = giveaway: Dùng để tặng mã coupon cho khách hàng xong, thì cần báo để server cập nhật lại số lần đã tặng, tránh việc 1 mã được tặng nhiều lần và khách khác không thể sử dụng được nữa.
  * act = used: Dùng để thông báo cho server biết 1 mã coupon đã được sử dụng, tránh việc 1 mã được sử dụng nhiều lần.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/promotion/couponupdate).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/promotion/couponupdate?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
    "act": "giveaway",
    "code": "A1BHCUH"
}'
```

### Thông tin tặng hoặc sử dụng mã coupon

| Key  | Type                          | Description                                                |
| ---- | ----------------------------- | ---------------------------------------------------------- |
| act  | string $$^{{\color{red}\*}}$$ | <p>Hành động:<br>giveaway: Tặng mã<br>used: Sử dụng mã</p> |
| code | string $$^{{\color{red}\*}}$$ | Mã giảm giá                                                |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": {
    "depotId": "(int) ID kho hàng",
    "code": "(string) Mã giảm giá",
    "value": "(int) Giá trị",
    "valueMax": "(int) Giá trị tối đa được giảm",
    "valueType": "(int) Loại giảm giá (1= Tiền mặt, 2= Phần trăm)",
    "status": "(int) trạng thái (1 = Active, 2 = Inactive)",
    "usedAt": "(int) Thời gian đã sử dụng mã giảm giá",
    "totalCanUsed": "(int) Tổng số lần có thể sử dụng",
    "totalAssigned": "(int) Tổng số lần đã tặng",
    "totalUsed": "(int) Tổng số lần đã sử dụng",
    "createdAt": "(int) Thời gian tạo"
  }
}
```


# Danh sách bảng giá

* Tính năng này dùng để lấy danh sách bảng giá trên Nhanh.vn.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/promotion/pricelist).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/promotion/pricelist?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
   "filters": {
       "ids": [73532, 73551]
       "status": 2
       "name": "AH TESSTT"
   },
   "paginator": {
       "size": 50,
       "sort": {
           "id": "asc"
       }
       "next": {
           "id": 73547
       }
   }
}'
```

#### Filters

| Key      | Type   | Description                               |
| -------- | ------ | ----------------------------------------- |
| ids      | array  | Mảng ids bảng giá.                        |
| name     | string | Tên bảng giá.                             |
| status   | int    | Trạng thái bảng giá.                      |
| depotIds | array  | Mảng danh sách cửa hàng áp dụng bảng giá. |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
 "code": 1,
 "paginator": {
   "next": "Dùng để lấy dữ liệu trang tiếp theo"
 },
 "data": [
   {
     "id": "(int) Id bảng giá",
     "businessId": "(int) Id doanh nghiệp quản lý",
     "name": "(string)Tên bảng giá",
     "status": "(int) Trạng thái",
     "startDate": "(string) Ngày áp dụng",
     "endDate": "(string) Ngày kết thúc",
     "createdBy": {
       "id": "(int) Id người tạo",
       "name": "(string) Tên người tạo"
     },
     "createdDateTime": "(string) Thời gian tạo"
   }
 ]
}
```


# Danh sách sản phẩm trong bảng giá

* Tính năng này dùng để lấy danh sách sản phẩm trong các bảng giá trên Nhanh.vn.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/promotion/pricelistproduct).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/promotion/pricelistproduct?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json'
--data '{
   "filters": {
       "priceListIds": [],
       "productIds": []
   },
   "paginator": {
       "size": 50,
       "sort": {
           "id": "desc"
       }
       "next": {
           "id": 676578
       }
   }
}'
```

#### Filters

| Key          | Type                        | Description                |
| ------------ | --------------------------- | -------------------------- |
| productIds   | array                       | Mảng id sản phẩm.          |
| priceListIds | array$$^{{\color{red}\*}}$$ | Mảng id sản phẩm bảng giá. |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
 "code": 1,
 "paginator": {
   "next": "Dùng để lấy dữ liệu trang tiếp theo"
 },
 "data": [
   {
     "product": {
       "id": "(int) Id sản phẩm",
       "name": "(string)Tên sản phẩm",
       "code": "(string)Mã sản phẩm",
       "barcode": "(string)Mã vạch sản phẩm",
       "price": "(int)Giá bán sản phẩm",
       "remain": "(int) Tồn sản phẩm",
       "importPrice": "(int)Giá nhập sản phẩm",
       "category": {
         "id": "(int) Id danh mục sản phẩm",
         "name": "(string) Tên danh mục sản phẩm"
       }
     },
     "priceList": [
       {
         "id": "(int) Id bảng giá",
         "businessId": "(int) Id doanh nghiệp",
         "name": "(string) Tên bảng giá",
         "value": "(int)Giá bán sản phẩm theo bảng giá"
       },
       {
         "id": "(int) Id bảng giá",
         "businessId": "(int) Id doanh nghiệp",
         "name": "(string) Tên bảng giá",
         "value": "(int)Giá bán sản phẩm theo bảng giá"
       }
     ]
   }
 ]
}
```


# Bút toán

* Tính năng này dùng để lấy danh sách bút toán ở trên Nhanh.vn. Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 100 bút toán.

## Request

* Xem [Postman sample](https://www.postman.com/nhanh-vn/pos-open-nhanh-vn/request/nnymb4r/accounting-transaction).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/accounting/transaction?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--header 'Cookie: nvnKn0x6mr3=2ecdui6mukkck004kg65t3oqcq' \
--data '{
    "filters": {},
    "paginator": {
        "size": 50,
        "sort": {"id": "desc"},
        "next": ""
    }
}'
```

### Filters

| Key         | Type | Description                                                                                                                                    |
| ----------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| id          | int  | ID bút toán                                                                                                                                    |
| fromDate    | date | Thời gian bắt đầu từ ngày định dạng (yyyy-mm-dd). VD: 2022-09-25                                                                               |
| toDate      | date | Thời gian đến ngày (yyyy-mm-dd). VD: 2022-09-25                                                                                                |
| typeDate    | int  | 1: Lọc theo ngày giao dịch (mặc định), 2: Lọc theo ngày tạo                                                                                    |
| type        | int  | [Loại bút toán](/v3/modelconstant#accounting-type)                                                                                             |
| mode        | int  | [Kiểu bút toán](/v3/modelconstant#accounting-mode)                                                                                             |
| filterMode  | int  | <p>Loại hoạch toán:<br>1: Tự động<br>2: Không tự động</p>                                                                                      |
| contactType | int  | <p>Koại đối tượng<br>1 = Khách hàng<br>2 = Nhà cung cấp<br>3 = Dịch vụ trả góp<br>4 = Nhân viên<br>20 = Khác<br>21:Sàn thương mại điện tử)</p> |

### Paginator

* Xem cấu trúc chung [tại đây](/v3#paginator).

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
      "next": "Dùng để lấy dữ liệu trang tiếp theo"
    },
    "data": [
        {
          "id": "(int) ID bút toán",
          "date": "(string) Ngày bút toán",
          "type": "(int) Loại bút toán",
          "mode": "(int) Kiểu bút toán",
          "amount": "(double) Số tiền bút toán",
          "itemType": "(int) Loại chứng từ",
          "itemId": "(int) ID chứng từ",
          "documentCode": "(string) ID chứng từ ngoài",
          "description": "(string) Mô tả bút toán",
          "items": [
              {
                  "amount": "(double) Số tiền bút toán",
                  "itemType": "(int) Loại chứng từ",
                  "itemId": "(int) ID chứng từ",
                  "description": "(string) Mô tả bút toán",
                  "credit": {
                      "id": "(int) ID tài khoản ghi có",
                      "name": "(string) Tên tài khoản",
                      "code": "(string) Mã tài khoản"
                  },
                  "debit": {
                      "id": "(int) ID tài khoản ghi nợ",
                      "name": "(string) Tên tài khoản",
                      "code": "(string) Mã tài khoản"
                  }
              }
          ],
          "depot": {
              "id": "(int) ID kho hàng",
              "name": "(string) Tên kho hàng"
          },
          "contact": {
              "id": "(int) ID đối tượng",
              "name": "(string) Tên đối tượng",
              "code": "(string) Mã đối tượng"
          },
          "created": {
              "id": "(int) ID người tạo bút toán",
              "name": "(string) Tên người tạo",
              "createdAt": "(int) Thời gian tạo, định dạng timestamp"
          }
        }
    ]
}
```


# Công nợ khách hàng

* API này dùng để lấy [danh sách công nợ khách hàng](https://nhanh.vn/accounting/debts/customer).

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/accounting/debts?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "itemSubType": 1 
    },
    "paginator": {
        "size": 30
    }
}'
```

### Filters

| Key         | Type   | Description                                                       |
| ----------- | ------ | ----------------------------------------------------------------- |
| id          | int    | ID đối tượng khách hàng                                           |
| fromDate    | date   | Thời gian bắt đầu từ ngày định dạng (yyyy-mm-dd). VD: 2022-09-25  |
| toDate      | date   | Thời gian đến ngày (yyyy-mm-dd). VD: 2022-09-25                   |
| code        | string | Mã khách hàng                                                     |
| name        | string | Tên khách hàng/ ID khách hàng                                     |
| address     | string | Địa chỉ khách hàng                                                |
| mobile      | string | Số điện thoại khách hàng                                          |
| itemSubType | int    | Loại khách hàng.Giá trị 1: Khách lẻ,2: Khách sỉ,3: Đại lý         |
| debtType    | int    | Loại công nợ.Giá trị 1: Phải thu,2: Phải trả,3: Phải thu/Phải trả |
| lastRemain  | string | json encode {"from": "Tồn từ", "to": "Tồn đến"}                   |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": "Giá trị để lấy dữ liệu trang tiếp theo"
    },
    "data": [
        {
          "id": "(int) ID đối tượng 1",
          "code": "(string) Mã đối tượng 1",
          "name": "(string) Tên đối tượng 1",
          "mobile": "(string) Số điện thoại",
          "address": "(string) Địa chỉ",
          "firstDebit": "(double) Nợ (đầu kỳ)",
          "firstCredit": "(double) Có (đầu kỳ)",
          "debit": "(double) Nợ (trong kỳ)",
          "credit": "(double) Có (trong kỳ)",
          "receive": "(double) Phải thu (cuối kỳ)",
          "pay": "(double) Phải trả (cuối kỳ)",
          "debtLimit": "(double) Giới hạn công nợ"
        },
        {
          "id": "(int) ID đối tượng 2",
          "code": "(string) Mã đối tượng 2",
          "name": "(string) Tên đối tượng 2",
          "mobile": "(string) Số điện thoại",
          "address": "(string) Địa chỉ",
          "firstDebit": "(double) Nợ (đầu kỳ)",
          "firstCredit": "(double) Có (đầu kỳ)",
          "debit": "(double) Nợ (trong kỳ)",
          "credit": "(double) Có (trong kỳ)",
          "receive": "(double) Phải thu (cuối kỳ)",
          "pay": "(double) Phải trả (cuối kỳ)",
          "debtLimit": "(double) Giới hạn công nợ"
        }
    ]
}
```


# Danh sách tài khoản kế toán

* API này dùng để lấy [danh sách tài khoản kế toán](https://nhanh.vn/accounting/account/index).

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location 'https://pos.open.nhanh.vn/v3.0/accounting/account?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "type": 1 
    },
    "paginator": {
        "size": 30
    }
}'
```

### Filters

| Key    | Type  | Description          |
| ------ | ----- | -------------------- |
| id     | int   | ID đối tượng         |
| types  | array | Loại đối tượng       |
| status | array | Trạng thái đối tượng |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": "Dùng để lấy dữ liệu trang tiếp theo"
  },
  "data": [
    {
      "id": "(int) ID đối tượng",
      "parentId": "(int) ID đối tượng cha",
      "type": "(int) Loại đối tượng (1 = Tiền trong các ngân hàng, 3 = Tiền mặt cửa hàng, 7 = Tiền quẹt thẻ)",
      "code": "(string) Mã đối tượng",
      "name": "(string) Tên đối tượng",
      "status": "(int) Trạng thái đối tượng (1 = Kích hoạt, 2 = Không kích hoạt)",
      "label": "(string) Label hiển thị đối tượng",
      "level": "(int) Level đối tượng",
      "depotId" : "(int) ID kho hàng",
      "createdById": "(int) ID người tạo đối tượng",
      "createdAt": "(string) Thời gian tạo đối tượng"
    }
  ]
}
```


# Gửi tin Zalo ZBS

* API này dùng để gửi tin nhắn Zalo ZBS (Trước đây gọi là ZNS). **Chú ý**:
  * Các hành động [cài đặt gửi Zalo trên nhanh.vn](https://nhanh.vn/setting/zalo/index) sẽ do Nhanh.vn tự động gửi, bạn chỉ nên dùng API này cho các hành động phát sinh riêng từ hệ thống của bên bạn.
  * Khi cài hành động gửi tin theo các sự kiện trên Nhanh (Thêm hóa đơn bán lẻ, Thêm đơn hàng...) thì bạn mới cần dùng các từ khóa có sẵn của Nhanh.vn, còn nếu chỉ muốn gửi qua API, thì khi tạo mẫu tin, bạn có thể tạo từ khóa bất kì, đợi Zalo duyệt xong, thì bạn có thể lấy được zbsTemplateId để gửi API.
  * Khi Zalo duyệt mẫu tin, các từ khóa thường có dạng **<\_TEN\_KHACH\_HANG\_>** nhưng gửi qua API cần bỏ qua 2 dấu < > chỉ gửi sang **\_TEN\_KHACH\_HANG\_**, Zalo sẽ tự nối thêm < >
  * Zalo chỉ cho phép gửi tin ZBS trong khoảng từ 6-22h. Nếu mẫu tin là loại gửi OTP thì không bị giới hạn này, bạn có thể gửi được 24/7.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/zalo/zbs).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/zalo/sendzbs?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "zaloOaId": 365897,
    "zbsTemplateId": 365,
    "mobile": "0966669999",
    "keywords": {
        "TU_KHOA_1": "Giá trị 1",
        "TU_KHOA_2": "Giá trị 2"
    }'
```

### Data

| Key           | Type                          | Description                                                                                                                               |
| ------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| zbsTemplateId | int $$^{{\color{red}\*}}$$    | Các mẫu tin đã được Zalo duyệt sẽ có ZBS template ID xem và tạo mới mẫu tin tại [danh sách template](https://nhanh.vn/setting/zalo/index) |
| mobile        | string $$^{{\color{red}\*}}$$ | Số điện thoại cần gửi                                                                                                                     |
| zaloOaId      | int $$^{{\color{red}\*}}$$    | ID Zalo OA                                                                                                                                |
| keywords      | string $$^{{\color{red}\*}}$$ | Mẩng Từ khóa, giá trị {"KEYWORD\_1": "VALUE\_1", "KEYWORD\_2": "VALUE\_2"}                                                                |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).
* Danh sách **errorCode** của riêng API này:

| errorCode                             | Description                                                                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ERR\_ZBS\_OA\_404                     | Doanh nghiệp chưa kết nối OA                                                                                                                            |
| ERR\_ZBS\_INVALID\_OA                 | Zalo OA Id không hợp lệ                                                                                                                                 |
| ERR\_ZBS\_EXCEEDED\_LIMIT\_IN\_DAY    | Vượt quá hạn mức gửi tin trong ngày                                                                                                                     |
| ERR\_ZBS\_OA\_NOT\_ENOUGH\_BALANCE    | Số dư tài khoản không đủ                                                                                                                                |
| ERR\_ZBS\_INVALID\_PHONE\_NUMBER      | Số điện thoại gửi đi không hợp lệ                                                                                                                       |
| ERR\_ZBS\_ZALO\_ACCOUNT\_NOT\_EXISTED | Số điện thoại không có tài khoản Zalo                                                                                                                   |
| ERR\_ZBS\_INVALID\_TEMPLATE           | ZBS template Id không hợp lệ                                                                                                                            |
| ERR\_ZBS\_PROHIBITED\_TIMEFRAME       | Tin nhắn chỉ được gửi trong khoảng thời gian từ 06-22h (UTC+7)                                                                                          |
| ERR\_ZBS\_REQUIRED\_KEYWORDS          | Từ khóa và giá trị không đúng định dạng hoặc null                                                                                                       |
| ERR\_ZBS\_KEYWORDS\_NOT\_MATCH        | <p>Từ khóa sai hoặc thừa với so từ khóa trong mẫu<br>ví dụ: { "invalidKeyword": \["KEYWORD\_1 is required", "KEYWORD\_2 not existed in template"] }</p> |
| ERR\_ZBS\_INVALID\_KEYWORD\_VALUES    | Giá trị từ khóa không hợp lệ                                                                                                                            |
| ERR\_ZBS\_CODE\_1121                  | Dữ liệu keyword vượt quá độ dài tối đa                                                                                                                  |
| ERR\_ZBS\_CODE\_1123                  | Không thể tạo mã QR                                                                                                                                     |
| ERR\_ZBS\_CODE\_1124                  | Dữ liệu keyword có định dạng không hợp lệ                                                                                                               |

### Successful response

```json
{
    "code": 1,
    "data": {
        "oaBalance": "(int) Số dư sau khi gửi",
        "quota": {
          "remainingQuota": "(int) Số tin nhắn còn được gửi trong ngày",
          "dailyQuota": "(int) Hạn mức tin nhắn được gửi trong ngày"
        }
    }
}
```


# Gửi tin Zalo ZNS - Deprecated

{% hint style="warning" %}

* **Chú ý**: Zalo đã đổi tên ZNS thành ZBS. API này đã ngừng phát triển và sẽ ngừng hỗ trợ sau 2026-08-31.

* Bạn nên chuyển sang dùng API mới [Gửi Zalo ZBS](/v3/zalo/zbs).
  {% endhint %}

* API này dùng để gửi tin nhắn Zalo ZNS. **Chú ý**:
  * Các hành động [cài đặt gửi Zalo trên nhanh.vn](https://nhanh.vn/setting/zalo/index) sẽ do Nhanh.vn tự động gửi, bạn chỉ nên dùng API này cho các hành động phát sinh riêng từ hệ thống của bên bạn.
  * Khi cài hành động gửi tin theo các sự kiện trên Nhanh (Thêm hóa đơn bán lẻ, Thêm đơn hàng...) thì bạn mới cần dùng các từ khóa có sẵn của Nhanh.vn, còn nếu chỉ muốn gửi qua API, thì khi tạo mẫu tin, bạn có thể tạo từ khóa bất kì, đợi Zalo duyệt xong, thì bạn có thể lấy được znsTemplateId để gửi API.
  * Khi Zalo duyệt mẫu tin, các từ khóa thường có dạng **<\_TEN\_KHACH\_HANG\_>** nhưng gửi qua API cần bỏ qua 2 dấu < > chỉ gửi sang **\_TEN\_KHACH\_HANG\_**, Zalo sẽ tự nối thêm < >
  * Zalo chỉ cho phép gửi tin ZBS trong khoảng từ 6-22h. Nếu mẫu tin là loại gửi OTP thì không bị giới hạn này, bạn có thể gửi được 24/7.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/zalo/zns).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/zalo/sendzns?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "zaloOaId": 365897,
    "znsTemplateId": 365,
    "mobile": "0966669999",
    "keywords": {
        "TU_KHOA_1": "Giá trị 1",
        "TU_KHOA_2": "Giá trị 2"
    }'
```

### Data

| Key           | Type                          | Description                                                                                                                                             |
| ------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| znsTemplateId | int $$^{{\color{red}\*}}$$    | Các mẫu tin đã được Zalo duyệt sẽ có ZBS template ID xem và tạo mới mẫu tin tại [danh sách template](https://nhanh.vn/setting/zalo/index#zns-templates) |
| mobile        | string $$^{{\color{red}\*}}$$ | Số điện thoại cần gửi                                                                                                                                   |
| zaloOaId      | int $$^{{\color{red}\*}}$$    | ID Zalo OA                                                                                                                                              |
| keywords      | string $$^{{\color{red}\*}}$$ | Mẩng Từ khóa, giá trị {"KEYWORD\_1": "VALUE\_1", "KEYWORD\_2": "VALUE\_2"}                                                                              |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).
* Danh sách **errorCode** của riêng API này:

| errorCode                             | Description                                                                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ERR\_ZNS\_OA\_404                     | Doanh nghiệp chưa kết nối OA                                                                                                                            |
| ERR\_ZNS\_INVALID\_OA                 | Zalo OA Id không hợp lệ                                                                                                                                 |
| ERR\_ZNS\_EXCEEDED\_LIMIT\_IN\_DAY    | Vượt quá hạn mức gửi tin trong ngày                                                                                                                     |
| ERR\_ZNS\_OA\_NOT\_ENOUGH\_BALANCE    | Số dư tài khoản không đủ                                                                                                                                |
| ERR\_ZNS\_INVALID\_PHONE\_NUMBER      | Số điện thoại gửi đi không hợp lệ                                                                                                                       |
| ERR\_ZNS\_ZALO\_ACCOUNT\_NOT\_EXISTED | Số điện thoại không có tài khoản Zalo                                                                                                                   |
| ERR\_ZNS\_INVALID\_TEMPLATE           | ZNS template Id không hợp lệ                                                                                                                            |
| ERR\_ZNS\_PROHIBITED\_TIMEFRAME       | Tin nhắn chỉ được gửi trong khoảng thời gian từ 06-22h (UTC+7)                                                                                          |
| ERR\_ZNS\_REQUIRED\_KEYWORDS          | Từ khóa và giá trị không đúng định dạng hoặc null                                                                                                       |
| ERR\_ZNS\_KEYWORDS\_NOT\_MATCH        | <p>Từ khóa sai hoặc thừa với so từ khóa trong mẫu<br>ví dụ: { "invalidKeyword": \["KEYWORD\_1 is required", "KEYWORD\_2 not existed in template"] }</p> |
| ERR\_ZNS\_INVALID\_KEYWORD\_VALUES    | Giá trị từ khóa không hợp lệ                                                                                                                            |
| ERR\_ZNS\_CODE\_1121                  | Dữ liệu keyword vượt quá độ dài tối đa                                                                                                                  |
| ERR\_ZNS\_CODE\_1123                  | Không thể tạo mã QR                                                                                                                                     |
| ERR\_ZNS\_CODE\_1124                  | Dữ liệu keyword có định dạng không hợp lệ                                                                                                               |

### Successful response

```json
{
    "code": 1,
    "data": {
        "oaBalance": "(int) Số dư sau khi gửi",
        "quota": {
          "remainingQuota": "(int) Số tin nhắn còn được gửi trong ngày",
          "dailyQuota": "(int) Hạn mức tin nhắn được gửi trong ngày"
        }
    }
}
```


# Danh sách gian hàng trên sàn

* API này dùng để lấy [danh sách gian hàng trên sàn](https://nhanh.vn/ecommerce/manage/setting): Shopee, Tiktok, Lazada, Tiki, Sendo.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/ecom/shop?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "appIds": [8142, 8195]
    },
    "paginator": {
        "size": 50
    }
}'
```

### Filters

| Key    | Type  | Description                                                                             |
| ------ | ----- | --------------------------------------------------------------------------------------- |
| appIds | array | [Id các sàn trên Nhanh.vn](/v3/modelconstant#ecommerce-appid), để trống để lấy toàn bộ. |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": "(int) ID bản ghi tiếp theo"
    },
    "data": [
        {
          "appId": "(int) ID sàn",
          "shop": {
              "id": "(string) ID gian hàng",
              "name": "(string) Tên gian hàng"
          },
          "expriredAt": "(int) Thời gian hết hạn gian hàng",
          "createdAt": "(int) Thời gian kết nối gian hàng"
        },
      {
        "appId": "(int) ID sàn",
        "shop": {
          "id": "(string) ID gian hàng",
          "name": "(string) Tên gian hàng"
        },
        "expriredAt": "(int) Thời gian hết hạn gian hàng",
        "createdAt": "(int) Thời gian kết nối gian hàng"
      }
    ]    
}
```


# Danh sách trả hàng hoàn tiền

* API này dùng để lấy [danh sách yêu cầu trả hàng hoàn tiền trên sàn](https://nhanh.vn/ecommerce/manage/return): Shopee, Tiktok, Lazada.

## Request

* Xem [common request params](/v3#request-params).

```curl
curl --location --globoff 'https://pos.open.nhanh.vn/v3.0/ecom/return?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "appId": 8195
    },
    "paginator": {
        "icpp": 50  
    }
}'
```

### Filters

| Key                            | Type                       | Description                                                                                                                                     |
| ------------------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| appId                          | int $$^{{\color{red}\*}}$$ | [ID các sàn trên Nhanh.vn](/v3/modelconstant#ecommerce-appid). Lưu ý: chỉ hỗ trợ 3 sàn: Shopee / TikTok / Lazada                                |
| shopIds                        | array                      | List ID shop của gian hàng trên sàn                                                                                                             |
| returnIdOrReturnTrackingNumber | string                     | ID yêu cầu hoàn tiền / Mã vận đơn trả                                                                                                           |
| originalEcomOrderId            | string                     | ID đơn hàng gốc trên sàn                                                                                                                        |
| createdFromAt                  | int                        | Thời gian tạo từ (timestamp)                                                                                                                    |
| createdToAt                    | int                        | Thời gian tạo đến (timestamp)                                                                                                                   |
| updatedFromAt                  | int                        | Thời gian cập nhật từ (timestamp)                                                                                                               |
| updatedToAt                    | int                        | Thời gian cập nhật đến (timestamp)                                                                                                              |
| nhanhStatuses                  | array                      | <p>List ID trạng thái trả hàng hoàn tiền<br>1: Đã hoàn tiền<br>2: Đang xử lý<br>3: Đã hủy yêu cầu<br>4: Đang khiếu nại<br>5: Đang hoàn tiền</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": {
      "id": "(string) next ID"
    }
  },
  "data": [
    {
      "shopId": "(string) ID Shop",
      "returnId": "(string) ID trả hàng hoàn tiền",
      "businessId": "(int) ID doanh nghiệp",
      "returnType": "(int) ID returnType (1: Hoàn tiền ngay, 2: Trả hàng và hoàn tiền, 3: Đổi mới",
      "originalEcomOrderId": "(string) ID đơn hàng gốc",
      "reasonInfor": {
        "reasonId": "(string) ID lý do trên sàn",
        "reasonName": "(string) Tên trạng thái trên sàn"
      },
      "productsInfor": [
        {
          "image": "(string) Đường dẫn ảnh sản phẩm trên sàn",
          "name": "(string) Tên sản phẩm trên sàn",
          "quantity": "(double) Số lượng sản phẩm",
          "price":"(double) Giá sản phẩm",
          "sku": "(string) Mã SKU trên sàn"
        }
      ],
      "amount": "(double) Tổng tiền hoàn",
      "ecomStatus": {
        "id": "(string) Mã trạng thái yêu cầu trả hàng trên sàn",
        "name": "(string) Tên trạng thái yêu cầu trả hàng trên sàn"
      },
      "nhanhStatus": {
        "id": "(int) ID trạng thái yêu cầu trả hàng trên Nhanh ",
        "name": "(string) Tên trạng thái yêu cầu trả hàng trên Nhanh"
      },
      "createdAt": "(int) Thời gian tạo (timestamp)",
      "updateAt": "(int) Thời gian cập nhật (timestamp)"
    }
  ]
}
```


# Danh sách page

* Lấy danh sách các page còn hạn sử dụng.
* Chú ý: Dữ liệu rất ít khi bị thay đổi, bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 8h.

## Request

* Xem sample Postman [tại đây](https://www.postman.com/nhanh-vn/vpage-open-nhanh-vn/request/rcex7re/page-list?tab=body).

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/page/list?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": { },
    "paginator": {
        "size": 30, 
        "sort": {"createdAt": "desc"}
    }
}'
```

### Filters

| Key      | Type  | Description    |
| -------- | ----- | -------------- |
| ids      | array | Mảng page ids  |
| channels | array | Mảng kênh chat |

### Paginator

| Key  | Type  | Description                                                |
| ---- | ----- | ---------------------------------------------------------- |
| size | int   | Số lượng bản ghi trên 1 trang. Tối đa không quá 50         |
| next | array | Mảng dữ liệu next (được trả về từ trang trước đó - nếu có) |
| sort | array | Mảng dữ liệu các tiêu chí sort. Xem bảng bên dưới          |

* sort

| Key       | Description        | Value     |
| --------- | ------------------ | --------- |
| createdAt | Thời gian tạo page | ASC, DESC |
| name      | Page name          | ASC, DESC |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": [
            1684232267000,
            13
        ]
    },
    "data": [
        {
            "id": "562525723619135",
            "name": "Good bag 2",
            "channel": 1,
            "createdAt": 1743839994,
            "expiredAt": 2692630800
        },
        {
            "id": "596777126857368",
            "name": "Good bag 1",
            "channel": 1,
            "createdAt": 1743839994,
            "expiredAt": 2692630800
        }
    ]
}
```


# Danh sách user

* Lấy danh sách [nhân viên trên Vpage](https://vpage.nhanh.vn/app/setting/user).
* **Chú ý**:
  * Dữ liệu này ít thay đổi, khuyến cáo bạn nên cache lại trong vòng 8h để tránh gọi API liên tục.
  * User ở Vpage khác với [user ở POS](/v3/business/user), nếu user ở vpage có liên kết với POS, thì response sẽ có thêm field là posUid.

## Request

* Xem sample Postman [tại đây](https://www.postman.com/nhanh-vn/vpage-open-nhanh-vn/request/ygbdwk2/user-list?tab=body).

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/user/list?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
      "userIds": ["userId_1", "userId_2"]
    },
    "paginator": {
        "size": 50, 
        "sort": {"createdAt": "desc"}
    }
}'
```

### Filters

| Key     | Type  | Description                                                                       |
| ------- | ----- | --------------------------------------------------------------------------------- |
| userIds | array | Không truyền field này để lấy toàn bộ user, hoặc truyền 1 mảng các user mong muốn |

### Paginator

| Key  | Type  | Description                                                |
| ---- | ----- | ---------------------------------------------------------- |
| size | int   | Số lượng bản ghi trên 1 trang. Tối đa không quá 50         |
| next | array | Mảng dữ liệu next (được trả về từ trang trước đó - nếu có) |
| sort | array | Mảng dữ liệu các tiêu chí sort. Xem bảng bên dưới          |

* sort

| Key       | Description        | Value     |
| --------- | ------------------ | --------- |
| createdAt | Thời gian tạo user | ASC, DESC |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": [
            1684232267000,
            13
        ]
    },
    "data": [
        {
            "id": "562525723619135",
            "displayName": "Nhân viên 2",
            "posUid": "id nhân viên bên Nhanh.vn",
            "posName": "Tên nhân viên bên Nhanh.vn",
            "createdAt": 1743839994
        },
        {
            "id": "596777126857368",
            "displayName": "Nhân viên 1",
            "posUid": "id nhân viên bên Nhanh.vn",
            "createdAt": 1743839994
        }
    ]
}
```


# Conversation


# Danh sách hội thoại

* Lấy danh sách hội thoại.

## Request

* Xem sample Postman [tại đây](https://www.postman.com/nhanh-vn/vpage-open-nhanh-vn/request/e7ikuuf/conversation-list?tab=body).

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/conversation/list?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": { },
    "paginator": {
        "size": 30, 
        "sort": {"updatedAt": "desc"}
    }
}'
```

### Filters

| Key      | Type                 | Description                                  |
| -------- | -------------------- | -------------------------------------------- |
| pageIds  | array                | Danh sách pageIds muốn lấy hội thoại         |
| type     | int                  | Loại hội thoại. 1: Bình luận, 2: Tin nhắn    |
| hasPhone | boolean (true/false) | Hội thoại có/không có số điện thoại.         |
| hasReply | boolean (true/false) | Hội thoại đã trả lời/chưa trả lời.           |
| status   | int                  | Trạng thái hội thoại. 1: Chưa đọc, 2: Đã đọc |
| tagIds   | array                | Hội thoại đã gắn những tagIds này            |
| postIds  | array                | Hội thoại phát sinh từ những postIds này     |

### Paginator

| Key  | Type  | Description                                                |
| ---- | ----- | ---------------------------------------------------------- |
| size | int   | Số lượng bản ghi trên 1 trang. Tối đa không quá 50         |
| next | array | Mảng dữ liệu next (được trả về từ trang trước đó - nếu có) |
| sort | array | Mảng dữ liệu các tiêu chí sort. Xem bảng bên dưới          |

* Sort

| Value       | Description                       | Sort      |
| ----------- | --------------------------------- | --------- |
| updatedTime | Thời gian tương tác của hội thoại | ASC, DESC |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": [
            1742545330,
            6478
        ]
    },
    "data": [
        {
            "id": "331526780045341_7521482117936821",
            "channel": 1,
            "type": 2,
            "customerAvatar": "https://example.com/user_1.jpg",
            "pageId": "331526780045341",
            "pageUserId": "7521482117936821",
            "pageUserName": "Linhgfx",
            "hasReply": true,
            "assignedGroupId": "",
            "hasPhone": true,
            "createdAt": 1718878288,
            "updatedAt": 1742803465,
            "lastSeenMessageAt": 1742827806,
            "lastMessage": "[Send sticker]",
            "status": 2,
        },
        {
            "id": "101286204573840_1075546127814826_101286204573840",
            "type": 1,
            "channel": 1,
            "hasPhone": false,
            "hasReply": true,
            "lastMessage": "hi dev vp Trung Nguyễn cmt\npa\ncmt3 0987695050\ncmt2 0987695050\ncmt1 0987695050",
            "status": 2,
            "customerAvatar": "https://example.com/user_2.jpg",
            "isFromLive": 1,
            "createdAt": 1749876899,
            "updatedAt": 1751353509,
            "pageUserName": "Tạp Chí Ò ó o",
            "pageUserId": "101286204573840",
            "pageId": "101286204573840",
            "pagePostId": "101286204573840_1075546127814826"
        }
    ]
}
```


# Danh sách tin nhắn

* Lấy danh sách tin nhắn hoặc bình luận của một hội thoại.

## Request

* Xem sample Postman [tại đây](https://www.postman.com/nhanh-vn/vpage-open-nhanh-vn/request/xq8plwv/message-list?tab=body).

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/conversation/messages?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": { 
        "conversationId": "{{conversationId}}"
    },
    "paginator": {
        "size": 30, 
        "sort": {"createdAt": "desc"}
    }
}'
```

### Filters

| Key            | Type   | Description  |
| -------------- | ------ | ------------ |
| conversationId | string | ID hội thoại |

### Paginator

| Key  | Type  | Description                                                |
| ---- | ----- | ---------------------------------------------------------- |
| size | int   | Số lượng bản ghi trên 1 trang. Tối đa không quá 50         |
| next | array | Mảng dữ liệu next (được trả về từ trang trước đó - nếu có) |
| sort | array | Mảng dữ liệu các tiêu chí sort. Xem bảng bên dưới          |

* sort

| Key       | Description   | Value     |
| --------- | ------------- | --------- |
| createdAt | Thời tạo page | ASC, DESC |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

* Khi mà senderId = pageId thì được hiểu là page gửi tin nhắn đó, còn senderId khác pageId thì là khách hàng gửi tin nhắn đó.
* Một page có thể có nhiều nhân viên trả lời, thì bạn có thể dựa vào createdById và createdByName để biết nhân viên nào trả lời tin nhắn này.

```json
{
    "code": 1,
    "paginator": {
        "next": [
            1752414539,
            103507
        ]
    },
    "data": [
        {
            "id": "m_0el8TAOmOlM3g7a1J8uCiAZOYQkhWy6VQhC71nRoci-Qzt89WzXRRzP2DK1E72JIYwQf096ywuT6SxjHsNwexg",
            "conversationId": "101286204573840_4655657141168264",
            "pageId": "101286204573840",
            "senderId": "4655657141168264",
            "senderName": "Khách hàng A",
            "createdById": "t1xnk19a0",
            "createdByName": "Nhân viên A",
            "createdAt": 1752469318093,
            "message": "cảm ơn",
            "pageUserId": "4655657141168264"
        },
        {
            "id": "m_7iA2Os6paI7psEyYM-5pKgZOYQkhWy6VQhC71nRoci-Ewz9B5u0doUsPoWshzNDleLAe8uMt8twmkksEQHBylQ",
            "conversationId": "101286204573840_4655657141168264",
            "pageId": "101286204573840",
            "senderId": "101286204573840",
            "senderName": "Nguyễn Văn A",
            "createdAt": 1752414540296,
            "message": "hi Nguyễn A",
            "pageUserId": "4655657141168264"
        },
        {
            "id": "m_CzBpXKWh9dlkbUFeYShxeAZOYQkhWy6VQhC71nRoci8WmsX3BmpVa_R4iHY6qK0yV9oMEeAb8dl4m5Phs8H1og",
            "conversationId": "101286204573840_4655657141168264",
            "pageId": "101286204573840",
            "senderId": "101286204573840",
            "senderName": "Nguyễn Văn B",
            "createdAt": 1752414539445,
            "message": "chào Bạn. Mình có thể giúp gì cho bạn",
            "pageUserId": "4655657141168264"
        }
    ]
}
```


# Trả lời hội thoại

* Trả lời hội thoại tin nhắn, bình luận.

## Request

* Xem sample Postman [tại đây](https://www.postman.com/nhanh-vn/vpage-open-nhanh-vn/request/aciyuok/reply-conversation?tab=body).

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/conversation/reply?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "pageId": "{{pageId}}",
    "conversationId": "{{conversationId}}",
    "messageType": {{messageType}} 
    "message": "{{message}}", 
    "recipientId": "{{recipientId}}", 
    "attachments": {{attachments}}
}'
```

### Common params

| Param              | Type                          | Mô tả                                                                                                                           |
| ------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `conversationId`   | string $$^{{\color{red}\*}}$$ | ID hội thoại                                                                                                                    |
| `pageId`           | string $$^{{\color{red}\*}}$$ | ID page/fanpage                                                                                                                 |
| `recipientId`      | string $$^{{\color{red}\*}}$$ | ID người nhận                                                                                                                   |
| `messageType`      | string                        | Loại tin nhắn.                                                                                                                  |
| `message`          | string                        | Nội dung text                                                                                                                   |
| `attachments`      | array                         | Danh sách URL file đính kèm                                                                                                     |
| `buttons`          | array                         | Danh sách nút bấm (chỉ button)                                                                                                  |
| `quickReplies`     | array                         | Danh sách nút trả lời nhanh (chỉ quickReply)                                                                                    |
| `galleryCards`     | array                         | Danh sách card carousel (chỉ gallery)                                                                                           |
| `replyToMessageId` | string                        | ID tin nhắn cần trả lời trực tiếp. Chỉ dùng được ở các kênh ghi rõ bên dưới. Tin nhắn phải thuộc đúng pageId và conversationId. |

***

### Reply to a message

Truyền ID của tin nhắn đã có trong hội thoại vào replyToMessageId để gửi một tin nhắn trả lời trực tiếp (quote/reply). Hệ thống tự lấy nội dung preview và dữ liệu quote cần thiết từ tin nhắn đã lưu.

| Channel            | Hỗ trợ | Điều kiện                            |
| ------------------ | :----: | ------------------------------------ |
| Zalo OA            |   Có   | Áp dụng cho text và image.           |
| Zalo Cá nhân       |   Có   | Áp dụng cho text, image và video.    |
| TikTok Business    |   Có   | Chỉ áp dụng khi messageType là text. |
| Facebook Messenger |  Không |                                      |
| Instagram          |  Không |                                      |
| TikTok Shop        |  Không |                                      |
| Shopee             |  Không |                                      |
| Lazada             |  Không |                                      |
| WhatsApp           |  Không |                                      |

***

### Text - Tin nhắn văn bản

```json
{
  "conversationId": "conv_123",
  "pageId": "page_001",
  "recipientId": "user_123",
  "messageType": "text",
  "message": "Xin chào! Chúng tôi có thể giúp gì cho bạn?"
}
```

### Image - Tin nhắn ảnh

Gửi 1 hoặc nhiều ảnh. Mỗi ảnh là 1 URL.

```json
{
  "conversationId": "conv_123",
  "pageId": "page_001",
  "recipientId": "user_123",
  "messageType": "image",
  "attachments": ["https://example.com/photo.jpg"]
}
```

Nhiều ảnh (chỉ Facebook hỗ trợ 1 request, các kênh khác gửi từng ảnh 1 request):

```json
{
  "conversationId": "conv_123",
  "pageId": "page_001",
  "recipientId": "user_123",
  "messageType": "image",
  "attachments": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ]
}
```

### Video - Tin nhắn video

```json
{
  "conversationId": "conv_123",
  "pageId": "page_001",
  "recipientId": "user_123",
  "messageType": "video",
  "attachments": ["https://example.com/video.mp4"]
}
```

### Audio - Tin nhắn âm thanh

```json
{
  "conversationId": "conv_123",
  "pageId": "page_001",
  "recipientId": "user_123",
  "messageType": "audio",
  "attachments": ["https://example.com/audio.mp3"]
}
```

### File - Tin nhắn file đính kèm

```json
{
  "conversationId": "conv_123",
  "pageId": "page_001",
  "recipientId": "user_123",
  "messageType": "file",
  "attachments": ["https://example.com/document.pdf"]
}
```

### Button - Tin nhắn có nút bấm (chỉ Facebook)

Gửi tin nhắn text kèm tối đa 3 nút bấm.

```json
{
  "conversationId": "conv_123",
  "pageId": "page_001",
  "recipientId": "user_123",
  "messageType": "button",
  "message": "Bạn muốn xem thông tin gì?",
  "buttons": [
    {"type": "block", "title": "Xem đơn hàng", "blockId": "block_order_123"},
    {"type": "url", "title": "Xem sản phẩm", "url": "https://example.com/products"},
    {"type": "phone_number", "title": "Gọi hỗ trợ", "phoneNumber": "0987654321"}
  ]
}
```

Các loại nút:

* `block`: trigger chatbot block khi user bấm (cần `blockId`)
* `url`: mở URL trong webview (cần `url`)
* `phone_number`: mở app điện thoại gọi (cần `phoneNumber`)

### Gallery/Carousel - Tin nhắn carousel (chỉ Facebook)

Gửi carousel tối đa 10 card, mỗi card có ảnh, tiêu đề và nút bấm.

```json
{
  "conversationId": "conv_123",
  "pageId": "page_001",
  "recipientId": "user_123",
  "messageType": "gallery",
  "galleryCards": [
    {
      "title": "Sản phẩm 1",
      "subtitle": "Giá: 100.000đ",
      "imageUrl": "https://example.com/product1.jpg",
      "link": "https://example.com/product/1",
      "buttons": [{"type": "block", "title": "Mua ngay", "blockId": "buy_123"}]
    }
  ]
}
```

### Quick Reply - Nút trả lời nhanh (chỉ Facebook)

```json
{
  "conversationId": "conv_123",
  "pageId": "page_001",
  "recipientId": "user_123",
  "messageType": "quickReply",
  "message": "Bạn muốn làm gì tiếp?",
  "quickReplies": [
    {"title": "Xem đơn hàng", "blockId": "block_order_123"},
    {"title": "Hỗ trợ"}
  ]
}
```

***

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "data": {
        "conversation": {
            "id": "101286204573840_1155721606569955_6289022961168486",
            "type": 1,
            "channel": 1,
            "pageId": "101286204573840",
            "pageUserId": "6289022961168486",
            "pageUserName": "Lý Sơn",
            "pagePostId": "101286204573840_1155721606569955",
            "commentId": "1155721606569955_722713100448041",
            "lastMessage": "open cmt 6",
            "status": 2,
            "hasPhone": false,
            "hasReply": true,
            "updatedAt": 1753349855,
            "createdAt": 1750066386,
            "customerAvatar": "https://example.com/user_1.jpg",
            "isFromLive": 0,
            "isSentPrivateMessage": 1,
            "postIds": [
                "101286204573840_1155721606569955"
            ],
        }
    }
}
```


# Nhãn hội thoại

* Lấy danh sách nhãn hội thoại đang hoạt động.
* **Chú ý**:
  * Hiện Vpage có 2 chế độ, Open API chỉ hỗ trợ chế độ nhãn theo doanh nghiệp, không hỗ trợ chế độ nhãn theo từng page. Khuyến cáo bạn nên dùng chế độ tag theo doanh nghiệp.
  * Toàn bộ các tính năng mới trên Vpage, đều phát triển xoay quanh chế độ tag theo doanh nghiệp, chế độ theo từng page sẽ bị loại bỏ trong tương lai.

## Enable business tags

* Nếu bạn đang dùng chế độ nhãn theo từng page, bạn cần chuyển đổi sang chế độ nhãn theo doanh nghiệp để sử dụng API. Các bước thao tác:
* **Bước 1**: Đăng nhập Vpage, vào trang Cài đặt > Nhãn hội thoại.
* **Bước 2**: Chuyển sang tab **Theo doanh nghiệp**: Tạo 1 nhóm cấu hình và thêm các page vào nhóm này.
* **Bước 3**: Chuyển sang tab **Theo từng page**: Chọn toàn bộ các tag cũ > chọn Sao chép nhãn > Sao chép sang nhóm, và chọn Nhóm vừa tạo. Đợi hệ thống copy xong, thì bạn đã chuyển thành công sang chế độ theo doanh nghiệp.
* Logic: Nếu bạn có tạo nhóm cấu hình theo doanh nghiệp, và gắn page vào nhóm đó, thì page sẽ theo chế độ tag theo doanh nghiệp, nếu không gắn với nhóm nào, thì sẽ theo chế độ tag theo từng page.
* **Chú ý**:
  * Sau khi thay đổi chế độ theo doanh nghiệp, bạn cần báo toàn bộ nhân viên đăng nhập lại Vpage để tải chế độ tags mới.
  * Toàn bộ tags cũ ở chế độ thep từng page, sẽ được tự động chuyển đổi sang chế độ theo doanh nghiệp theo chế độ gom các tag trùng tên với nhau thành 1 tag chung.
  * Khi bạn xem hội thoại cũ, tìm theo tags cũ, hệ thống sẽ vẫn hỗ trợ tìm kiếm và hiển thị như cũ.
  * Khi bạn gọi Open API, toàn bộ tag cũ sẽ được tự động chuyển đổi sang tagId mới theo chế độ theo doanh nghiệp.

## Request

* Xem sample Postman [tại đây](https://www.postman.com/nhanh-vn/vpage-open-nhanh-vn/request/ylv8hdc/conversation-tags?tab=body).

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/conversation/tags?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": { },
    "paginator": {
        "size": 50, 
        "sort": {"createdAt": "desc"}
    }
}'
```

### Filters

### Paginator

| Key  | Type  | Description                                                |
| ---- | ----- | ---------------------------------------------------------- |
| size | int   | Số lượng bản ghi trên 1 trang. Tối đa không quá 50         |
| next | array | Mảng dữ liệu next (được trả về từ trang trước đó - nếu có) |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": [
            1,
            1753951251
        ]
    },
    "data": [
        {
            "id": "Iwq_QJcBXzy4YYO3c6ov",
            "name": "Ordered",
            "status": 1,
            "color": "#ffffff",
            "backgroundColor": "#2e3191",
            "order": 1,
            "createdAt": 1749137978,
            "shortcut": ""
        },
        {
            "id": "lArCQJcBXzy4YYO3AqrN",
            "name": "Hello",
            "status": 1,
            "color": "#ffffff",
            "backgroundColor": "#2e3191",
            "order": 1,
            "createdAt": 1749138145,
            "shortcut": ""
        }
    ]
}
```


# Cập nhật nhãn hội thoại

* Cập nhật gắn nhãn và gỡ nhãn hội thoại. Nếu cập nhật thành công, sẽ trả về danh sách tagIds hiện tại sau khi thực hiện việc gắn, gỡ nhãn.

## Request

* Xem sample Postman [tại đây](https://www.postman.com/nhanh-vn/vpage-open-nhanh-vn/request/tzn3bgh/update-conversation-tag?tab=body).
* Chú ý: tagId có thể lấy từ API [Conversation tags](/v3/vpage/conversation/tags).

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/conversation/updatetags?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "pageId": "{{pageId}}",
    "conversationId": "{{conversationId}}",
    "addTags": ["tagId_1", "tagId_2"],
    "removeTags": ["tagId_3", "tagId_4"]
}'
```

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "data": {
        "tags": ["DDh805cBXzy4YYO3QEwS","XzQJxZcBXzy4YYO3rBBR"]
    }
}
```


# Iframe khung tạo đơn

* Mặc định Vpage sẽ tích hợp phần tạo đơn hàng với [Nhanh POS](https://nhanh.vn). Nếu bạn dùng 1 phần mềm quản lý khác, và muốn tích hợp khung tạo đơn hàng, thì bạn có thể vào phần Cài đặt > [API khung tạo đơn](https://vpage.nhanh.vn/app/setting/orderiframe) để điền link mong muốn tích hợp.
  * **Chú ý**: Cài đặt này đi theo doanh nghiệp, các page gắn vào doanh nghiệp sẽ được đổi sang khung tạo đơn mới.

![Cài đặt API khung tạo đơn](https://2299560279-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FkqD6qBCDVbHh0yciWW1F%2Fuploads%2Fgit-blob-9680c9347dd979971cee0b9f443ddec7c11a10fa%2FVpage_Order_Iframe.jpg?alt=media)

## Config web server

* Web server của bạn cần response thêm header **Content-Security-Policy: frame-ancestors 'self' <https://vpage.nhanh.vn>** để cho phép nhúng iframe trên Vpage.
  * Đọc thêm về [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).
* Nếu dùng Nginx, trong đoạn `server {...}` thêm dòng sau

```
add_header Content-Security-Policy "frame-ancestors 'self' https://vpage.nhanh.vn" always;
```

* Nếu dùng Apache httpd, trong VirtualHost hoặc `.htaccess` thêm dòng sau:

```
Header always set Content-Security-Policy "frame-ancestors 'self' https://vpage.nhanh.vn"
```

* Nếu dùng PHP có thể thêm bằng cách:

```
<?php
header("Content-Security-Policy: frame-ancestors 'self' https://vpage.nhanh.vn");
```

## Order Iframe params

* Nếu bạn điền link riêng của bạn là <https://example.com/order/add>, thì khi nhân viên chăm sóc mở 1 hội thoại, Vpage sẽ load URL cho iframe kèm các GET params liên quan <https://example.com/order/add?businessId=10100\\&pageId=123456789\\&conversationId=>... Xem thêm các params ở bảng bên dưới.
* Iframe của bạn nhận các params này, lưu theo thông tin đơn hàng để có thông tin về page, và hội thoại.
* Sau khi lưu đơn hàng, nếu bạn muốn bắn **Meta Conversion API** để báo cáo doanh thu lên trình quản lý quảng cáo của Meta, giúp tối ưu lượt mua và khách hàng tiềm năng, thì bạn có thể dùng [Meta Conversion API](https://apidocs.nhanh.vn/v3/vpage/marketing/meta_send_capi).

| Key             | Description                                            |
| --------------- | ------------------------------------------------------ |
| businessId      | id doanh nghiệp Nhanh.vn                               |
| pageId          | pageId                                                 |
| channel         | id kênh chat, xem [bảng channel bên dưới](#channel)    |
| conversationId  | id hội thoại                                           |
| customerName    | Tên khách hàng                                         |
| customerMobile  | Số điện thoại khách hàng                               |
| customerEmail   | Email khách hàng                                       |
| customerAddress | Địa chỉ khách hàng                                     |
| fbPsid          | Page UserId trên Meta (Facebook, Instagram)            |
| fbAdsId         | id quảng cáo (nếu hội thoại đến từ ads)                |
| vpageUserId     | id nhân viên Vpage đang thực hiện thao tác tạo đơn     |
| vpageGroupId    | id nhóm được chia hội thoại                            |
| vpagePostId     | id bài post mà hội thoại phát sinh                     |
| postType        | Loại bài viết, xem [bảng postType bên dưới](#postType) |

### channel

| value | Channel         |
| ----- | --------------- |
| 1     | FaceBook        |
| 2     | Instagram       |
| 4     | Shopee          |
| 5     | Zalo OA         |
| 6     | Lazada          |
| 7     | Telegram        |
| 8     | WhatsApp        |
| 6     | Tiktok Shop     |
| 10    | Zalo cá nhân    |
| 11    | Tiktok Business |
| 12    | Threads         |

### postType

| value | Channel                                                                                                                      |
| ----- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1     | post quảng cáo                                                                                                               |
| 2     | organic - từ ad hoặc tự nhiên                                                                                                |
| 4     | Loại post chưa xác định (có thể là đơn người dùng tự inbox, hoặc người dùng cmt vào bài viết trong page rồi phát sinh inbox) |


# Customer


# Danh sách khách hàng

* Lấy thông tin khách hàng ở trang [Danh sách khách hàng](https://vpage.nhanh.vn/app/customer)

## Request

```curl

curl --location 'https://vpage.open.nhanh.vn/v3.0/customer/list?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {}
}'

```

### Filters

| Key         | Type   | Description                                     |
| ----------- | ------ | ----------------------------------------------- |
| pageId      | string | PageId cần lấy thong tin khách hàng             |
| pageUserIds | array  | danh sách pageUserId cần lấy thông tin của page |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "id": "115378144944854_6778497145514509",
      "fanpageId": "115378144944854",
      "fanpageUserId": "6778497145514509",
      "name": "Linhgfx",
      "createdTime": 1762503820,
      "phones": [
        "0988767665",
        "0987887656",
        "0977656789",
        "0977688667",
        "0977688666",
        "0977688665",
        "0977688661",
        "0978776776"
      ],
      "emails": [
        "linh111@gmail.com"
      ]
    },
    {
      "id": "115378144944854_25138949609117568",
      "fanpageId": "115378144944854",
      "fanpageUserId": "25138949609117568",
      "name": "Trung Nguyễn",
      "createdTime": 1769421865,
    }
  ]
}
```


# Marketing


# Meta Conversion API

* API này dùng để gửi sự kiện Conversion sang Meta (hỗ trợ Facebook và Instagram), giúp Meta có dữ liệu tối ưu quảng cáo tốt hơn.
* Xem báo cáo và lịch sử gửi Meta conversion API trên Vpage [tại đây](https://vpage.nhanh.vn/app/report/facebook/metacapi).
* **Chú ý**:
  * Nếu bạn tạo đơn hàng ở Vpage, thì Vpage đã tự động bắn Conversion API lên Facebook rồi, chú ý không gọi API này nữa tránh trùng doanh thu CAPI.
  * Nếu bạn không dùng Nhanh POS, bạn có thể nhúng khung tạo đơn hàng ở bên phải Vpage bằng 1 iframe riêng để nhận các param cần thiết cho việc tạo đơn hàng. Đọc tài liệu [cài đặt Order Iframe](https://github.com/nvndocs/docs-pos-openapi/blob/v3/docs/vpage/conversation/order_iframe.md).

## Request

* Xem sample Postman [tại đây](https://www.postman.com/nhanh-vn/vpage-open-nhanh-vn/request/rodpu1s/meta-send-conversions-api?tab=body).

### Purchase

* Sự kiện mua hàng thành công.

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/metasendcapi?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "eventName": "Purchase",
  "conversationId": "101286204573840_6289022961168486",
  "orderInfo": {
    "orderId": "14889002",
    "eventId": "14889002",
    "orderValue": 5650000,
    "shippingFee": 5000,
    "customerPhone": "0329927799",
    "products": [
      {
        "id": "1231268761",
        "quantity": 1,
        "price": 4600000,
        "itemGroupId": "group_1231268761",
        "title": "polo nam Nhanh",
        "description": "Material: Bird'\''s eyeComposition: 49% Cotton + 47% Polyester + 4% SpandexSolid Dyed technology creates eye-catching effects.\n",
        "additionalImageLink": []
      },
      {
        "id": "1231269211",
        "quantity": 1,
        "price": 350000,
        "itemGroupId": "group_1231269191",
        "title": "Mũ vải",
        "description": "Đây là mô tả mũ chất lượng cao, kháng tia UV an toàn tuyệt đối - description\n",
        "additionalImageLink": {
          "images": [
            "https://poscdn.nvndev.net/a7df54-35102/ps/20240809_7WLD5ZDLDR.jpeg",
            "https://poscdn.nvndev.net/a7df54-35102/ps/20250224_HBgCCl0bZr.jpeg",
            "https://poscdn.nvndev.net/a7df54-35102/ps/20250224_yV0nDjeK8Z.jpeg",
            "https://poscdn.nvndev.net/a7df54-35102/ps/20250224_Dh5PEg0hav.jpeg"
          ]
        }
      }
    ]
  }
} '
```

### Lead Submitted

* Sự kiện báo khách hàng tiềm năng.

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/metasendcapi?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "eventName": "LeadSubmitted",
  "conversationId": "101286204573840_6289022961168486",
  "orderInfo": {}
} '
```

### Order Canceled

* Sự kiện hủy đơn hàng.

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/metasendcapi?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "eventName": "OrderCanceled",
  "conversationId": "101286204573840_6289022961168486",
  "orderInfo": {
    "orderId": "14889002",
    "eventId": "14889002",
    "orderValue": 5650000,
    "shippingFee": 5000,
    "customerPhone": "0329927799"
  }
} '
```

### Order Returned

* Sự kiện đơn hàng bị trả lại.

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/metasendcapi?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "eventName": "OrderReturned",
  "conversationId": "101286204573840_6289022961168486",
  "orderInfo": {
    "orderId": "14889002",
    "eventId": "14889002",
    "orderValue": 5650000,
    "shippingFee": 5000,
    "customerPhone": "0329927799",
    "products": []
  }
} '
```

### data

| Key            | Type   | Description                                                       |
| -------------- | ------ | ----------------------------------------------------------------- |
| eventName      | string | eventName (Purchase, LeadSubmitted, OrderCanceled, OrderReturned) |
| conversationId | string | ID hội thoại                                                      |
| orderInfo      | array  | Data cần để bắn sang Meta và thống kê báo cáo của Vpage           |

#### order\_info

| Trường (`order_info`) | `Purchase`  | `OrderCanceled` | `OrderReturned` | `LeadSubmitted` |
| --------------------- | ----------- | --------------- | --------------- | --------------- |
| `orderId`             | ✅ require   | ✅ require       | ✅ require       | ❌ —             |
| `eventId`             | ❌ —         | ❌ —             | ❌ —             | ⚠️ optional     |
| `currency`            | ⚠️ optional | ⚠️ optional     | ⚠️ optional     | ❌ —             |
| `orderValue`          | ✅ require   | ✅ require       | ✅ require       | ❌ —             |
| `shippingFee`         | ✅ require   | ✅ require       | ✅ require       | ❌ —             |
| `products`            | ✅ require   | ⚠️ optional     | ⚠️ optional     | ❌ —             |
| `customerPhone`       | ⚠️ optional | ❌ —             | ❌ —             | ❌ —             |

* Chú ý:
  * `eventId` : Id duy nhất của sự kiện. Đối vợi sự kiện Purchase, id có thể giống nhau. Nhưng Meta sẽ sử dụng id này để loại bỏ trùng lặp giữa các sự kiện. Hãy cố gắng chỉ gửi 1 lần cho mỗi id
  * đối với các sự kiện Purchase, OrderCanceled, OrderReturned: `eventId` chính bằng `orderId`.
  * đối với sự kiện `LeadSubmitted` bạn không cần truyền `eventId` nếu chỉ muốn gửi sự kiện này tối đa 1 lần 1 ngày, chúng tôi sẽ tạo tự động.
  * `currency`: đơn vị tiền tệ. không truyền mặc định là `VND` . Tham khảo đơn vị tiền tệ [tại đây](https://developers.facebook.com/docs/marketing-api/currencies?locale=vi_VN)

**`products`**

| Key                        | Type   | Description                      |
| -------------------------- | ------ | -------------------------------- |
| id                         | string | ID sản phẩm                      |
| quantity                   | int    | Số lượng                         |
| price                      | int    | Giá sản phẩm                     |
| itemGroupId                | string | groupId của sản phẩm             |
| title                      | string | Tên sản phẩm                     |
| description                | string | Mô tả sản phẩm                   |
| additionalImageLink        | array  |                                  |
| additionalImageLink.images | array  | URL hình ảnh hợp lệ của sản phẩm |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

```json
{
    "code": 0,
    "messages": {
        "conversationId": "Invalid conversationId."
    },
    "errorCode": "ERR_INVALID_FORM_FIELDS"
}

```

* Các mã lỗi thường gặp của API này:

| errorCode             | Description                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------- |
| ERR\_CAPI\_DISABLED   | Facebook page chưa bật kết nối Conversion API, bạn cần truy cập Vpage để bật cài đặt này |
| ERR\_MISSING\_DATASET | Facebook page chưa kết nối dataset, bạn cần truy cập vào Vpage để kết nối lại dataset    |

### Successful response

```json
{
    "logId": "RpdCeJgBIf1HgkjzBjxb",
    "events_received": 1,
    "messages": [],
    "fbtrace_id": "A97S_q39IG7_aeq1SE6SnOS"
    
}
```

* Giải thích:
  * `logId`: log của Vpage. Bạn có thể gửi để Vpage hỗ trợ debug trong tình huống bị lỗi
  * các dữ liệu còn lại là data Meta response


# Danh sách tài khoản quảng cáo

* Lấy danh sách tài khoản quảng cáo Facebook đã kết nối vào Vpage.
* Tài khoản quảng cáo dùng để lấy cái báo cáo liên quan Marketing Insight API, tạo tệp đối tượng tùy chỉnh (custom audience), hoặc để gửi tin nhắn quảng cáo (Facebook Marketing Message).
* Chú ý: Bạn cần kết nối tài khoản quảng cáo trên Vpage thì mới có thể lấy được dữ liệu này.

## Request

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/adaccountlist?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--data '{
    "filters": { },
    "paginator": {
        "size": 50
    }
}'
```

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": [
            1742545330,
            6478
        ]
    },
    "data": [
        {
            "id": "act_123456788",
            "fbBusinessId": 123456,
            "name": "Ad account 1"
        },
        {
            "id": "act_123456789",
            "fbBusinessId": 123456,
            "name": "Ad account 2"
        },
    ]
}
```


# Danh sách chiến dịch

* Lấy danh sách chiến dịch gửi tin Facebook Marketing Message

## Request

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/fmmcampaignlist?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--data '{
    "filters": { },
    "paginator": {
        "size": 50
    }
}'
```

## Tham số bộ lọc (`filters`)

Tất cả các trường dưới đây được truyền bên trong object `"filters": { ... }` của body request:

| Tên trường lọc | Kiểu dữ liệu | Mặc định | Mô tả chi tiết chức năng lọc                                                                                                                                                                                                                                                 |
| -------------- | ------------ | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`           | String       |  `null`  | Lọc theo ID chiến dịch Vpage                                                                                                                                                                                                                                                 |
| `adCampaignId` | String       |  `null`  | Lọc theo ID chiến dịch Facebook (Meta Campaign ID)                                                                                                                                                                                                                           |
| `adAccountId`  | String       |  `null`  | Lọc theo tài khoản quảng cáo Facebook                                                                                                                                                                                                                                        |
| `pageIds`      | Array        |  `null`  | Lọc theo danh sách Fanpage                                                                                                                                                                                                                                                   |
| `name`         | String       |  `null`  | Lọc tìm kiếm theo tên chiến dịch                                                                                                                                                                                                                                             |
| `status`       | Integer      |  `null`  | Lọc theo trạng thái chiến dịch                                                                                                                                                                                                                                               |
| `syncFb`       | Boolean      |  `false` | <p>Cờ đồng bộ dữ liệu trực tiếp từ Facebook:<br>• <code>false</code> (mặc định): Đọc từ cache hệ thống (tốc độ cao < 200ms).<br>• <code>true</code>: Gọi trực tiếp Meta Insights API để lấy số liệu mới nhất thời gian thực. Thời gian phản hồi có thể mất từ 3 - 5 giây</p> |
| `fromAt`       | Integer      |  `null`  | <p>Thời gian bắt đầu lấy số liệu thống kê<br>• Unix timestamp (ví dụ <code>1761411600</code>)</p>                                                                                                                                                                            |
| `toAt`         | Integer      |  `null`  | <p>Thời gian kết thúc lấy số liệu thống kê<br>• Unix timestamp (ví dụ <code>1761929999</code>)</p>                                                                                                                                                                           |

## Lưu ý về cơ chế Cache & Độ trễ khi dùng `syncFb`

* Mặc định `syncFb: false`:
  * Dữ liệu thống kê (`delivered`, `clicks`, `reads`, `spend`, `costPerDelivered`,...) được đọc trực tiếp từ dữ liệu đã đồng bộ định kỳ trước đó.
  * Tốc độ phản hồi: nhanh
  * Đặc điểm: Số liệu có thể có độ trễ nhất định so với bảng điều khiển Meta Ads Manager (dữ liệu cache).
* Khi bật `syncFb: true`:
  * Hệ thống sẽ gửi request trực tiếp sang Facebook Insights để lấy dữ liệu realtime mới nhất. Thời gian phản hồi có thể mất từ 3 - 5 giây.
  * Cho phép kết hợp thêm `fromAt` và `toAt` để lọc số liệu theo thời gian cụ thể.
  * Tự động lưu vào Vpage: Toàn bộ số liệu Insight mới nhất kéo từ Meta (`delivered`, `reads`, `clicks`, `spend`, `lastSyncAt`) sẽ được tự động cập nhật vào chiến dịch. Nhờ đó các lần gọi sau (kể cả khi tắt `syncFb` - đọc từ cache) đều có ngay dữ liệu mới nhất này.

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "paginator": {
    "next": [
      1742545330
    ]
  },
  "data": [
    {
      "id": "ngVCD5oBMexIgwsbAZBW",
      "segmentIds": [
        "p7kJ_JkBLGB-hS0t3fuy",
        "120234366614800373"
      ],
      "name": "fmm message",
      "adAccountId": "act_962587495564547",
      "adCampaignId": "120232711406030373",
      "pageId": "167890463074771",
      "pageName": "Nhanh.vn Fanpage",
      "status": 1,
      "budgetType": "daily",
      "budget": 60000,
      "adStartAt": 1761411600,
      "adEndAt": 1761929999,
      "createdAt": 1761192575,
      "sentSuccess": 450,
      "delivered": 437,
      "clicks": 15,
      "reads": 120,
      "spend": 129599,
      "costPerDelivered": 297,
      "costPerRead": 1080,
      "costPerClick": 8640
    },
    {
      "id": "ngVCD5oBMexIgwsbAZBW",
      "segmentIds": [
        "120234366614800371"
      ],
      "name": "fmm notifications",
      "adAccountId": "act_962587495564547",
      "adCampaignId": "120232711406030373",
      "pageId": "167890463074771",
      "pageName": "Nhanh.vn Fanpage",
      "status": 1,
      "budgetType": "life_time",
      "budget": 100000,
      "adStartAt": 1761411600,
      "adEndAt": 1761929999,
      "createdAt": 1761192575,
      "sentSuccess": 200,
      "delivered": 195,
      "clicks": 8,
      "reads": 55,
      "spend": 50000,
      "costPerDelivered": 256,
      "costPerRead": 909,
      "costPerClick": 6250
    }
  ]
}
```

### Chi tiết các trường dữ liệu trả về (`data`)

| Trường             | Kiểu dữ liệu | Mô tả                                                                 |
| ------------------ | ------------ | --------------------------------------------------------------------- |
| `id`               | String       | ID chiến dịch lưu trên Vpage                                          |
| `segmentIds`       | Array        | Danh sách ID tệp đối tượng gửi tin                                    |
| `name`             | String       | Tên chiến dịch                                                        |
| `pageId`           | String       | ID Fanpage gửi tin                                                    |
| `pageName`         | String       | Tên Fanpage gửi tin                                                   |
| `adAccountId`      | String       | ID tài khoản quảng cáo Facebook                                       |
| `adCampaignId`     | String       | ID chiến dịch trên Facebook                                           |
| `status`           | Integer      | Trạng thái chiến dịch (xem bảng Status bên dưới)                      |
| `budgetType`       | String       | Loại ngân sách: `daily` (mỗi ngày) hoặc `life_time` (toàn chiến dịch) |
| `budget`           | Float        | Ngân sách chiến dịch                                                  |
| `adStartAt`        | Integer      | Unix timestamp thời gian bắt đầu chạy chiến dịch                      |
| `adEndAt`          | Integer      | Unix timestamp thời gian kết thúc chiến dịch                          |
| `createdAt`        | Integer      | Unix timestamp thời gian tạo chiến dịch                               |
| `sentSuccess`      | Integer      | Số tin Vpage gửi thành công lên Meta                                  |
| `delivered`        | Integer      | Số tin Meta đã gửi thành công đến khách hàng                          |
| `clicks`           | Integer      | Số lượt bấm link/nút trong tin nhắn                                   |
| `reads`            | Integer      | Số lượt khách hàng đã đọc tin nhắn                                    |
| `spend`            | Float        | Tổng số tiền đã chi tiêu theo báo cáo Meta                            |
| `costPerDelivered` | Integer      | Giá 1 tin nhắn gửi thành công (`spend / delivered`)                   |
| `costPerRead`      | Integer      | Giá 1 lượt xem (đọc) tin nhắn (`spend / reads`)                       |
| `costPerClick`     | Integer      | Giá 1 lượt click link/nút trong tin nhắn (`spend / clicks`)           |

### status

| Value | Description     |
| ----- | --------------- |
| 1     | Đã gửi          |
| 2     | Đang gửi        |
| 3     | Mới             |
| 4     | Thất bại        |
| 5     | Chờ gửi         |
| 6     | Không hoạt động |
| 7     | Nháp            |


# Danh sách tệp topic

* Lấy danh sách tệp Chủ đề (Topic).

## Request

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/topiclist?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--data '{
    "filters": { },
    "paginator": {
        "size": 50
    }
}'
```

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
    "code": 1,
    "paginator": {
        "next": [
            1742545330
        ]
    },
    "data": [
        {
            "id": "1234561",
            "name": "Tên tệp 1",
            "title": "Nhận ưu đãi",
            "createdAt": 1760369202
        },
        {
            "id": "1234562",
            "name": "Tên tệp 2",
            "title": "Nhận khuyến mãi",
            "createdAt": 1760368104
        }
    ]
}
```


# Danh sách tệp đối tượng tùy chỉnh

* Lấy danh sách tệp đối tượng tùy chỉnh (Custom Audience).

## Request

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/customaudiencelist?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--data '{
    "filters": { },
    "paginator": {
        "size": 50
    }
}'
```

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

* Các tệp có **subtype** = **MESSENGER\_SUBSCRIBER\_LIST** dùng để gửi Tin nhắn quảng cáo (Facebook Marketing Message).
* Các tệp có **subtype** = **CUSTOM** dùng để chạy quảng cáo (Chọn được tệp trên trình quản lý quảng cáo của Facebook).

```json
{
    "code": 1,
    "paginator": {
        "next": [
            1742545330,
            6478
        ]
    },
    "data": [
        {
            "id": "1234561",
            "name": "Tên tệp 1",
            "description": "Mô tả tệp 1",
            "adAccountId": "Ad account 1",
            "subtype": "MESSENGER_SUBSCRIBER_LIST",
            "createdAt": 1760369202
        },
        {
            "id": "1234562",
            "name": "Tên tệp 2",
            "adAccountId": "Ad account 1",
            "description": "Mô tả tệp 2",
            "subtype": "CUSTOM",
            "createdAt": 1760368104
        }
    ]
}
```


# Tạo tệp đối tượng tùy chỉnh

* Tạo tệp đối tượng tùy chỉnh.
* **Chú ý**:
  * Để gửi [Tin nhắn quảng cáo](https://vpage.nhanh.vn/app/chatbot/marketing/index) (Facebook Marketing Message), bạn không thể tạo tệp trực tiếp ở trên Facebook, mà bắt buộc phải tạo qua **Vpage.nhanh.vn**.
  * Do Facebook cần thời gian để tìm số điện thoại, email, bạn cần đảm bảo các tệp Custom Audience được tạo và [thêm khách hàngvào tệp](/v3/vpage/marketing/custom_audience_addsubscriber) từ sớm (khoảng trước 1 ngày) và có trạng thái sẵn sàng trên Vpage trước khi tạo [chiến dịch gửi tin nhắn quảng cáo](https://github.com/nvndocs/docs-pos-openapi/blob/v3/docs/vpage/marketing/\(/docs/vpage/marketing/ad_account_list.md\)).

## Request

* Xem [common request params](/v3#request-params).
* Chú ý:
  * Bạn cần kết nối tài khoản quảng cáo trên Vpage, để lấy adAccountId từ [API ad\_account\_list](/v3/vpage/marketing/ad_account_list).
  * Để gửi Marketing Message: bạn cần set **subtype** = **MESSENGER\_SUBSCRIBER\_LIST**.
  * Để tạo tệp custom (Chỉ dùng để chạy quảng cáo): bạn set **subtype** = **CUSTOM**.

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/customaudiencecreate?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--data '{
    "adAccountId": "Ad account id",
    "pageId": "page id",
    "subtype": "MESSENGER_SUBSCRIBER_LIST",
    "name": "Tên của tệp (Maxlength: 50)",
    "description": "Mô tả của tệp (Maxlength: 100)"
}'
```

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": {
      "audienceId": "(string) Audience ID của tệp vừa tạo"
  }
}
```


# Thêm khách vào tệp đối tượng tùy chỉnh

* Thêm khách hàng vào tệp đối tượng tùy chỉnh.

## Request

* Xem [common request params](/v3#request-params).

### Params

* `audienceId` lấy được từ API [Tạo tệp đối tượng tùy chỉnh](/v3/vpage/marketing/custom_audience_create).
* `dataType` hỗ trợ 2 loại dữ liệu là `raw` hoặc `hash` (dùng hàm hash("sha256", "text")). VD bạn có số điện thoại là 0987654321
  * `raw` = 0987654321
  * `hash` = f9dd5cfd005ea36d8db32ecfb6867c9a22a8e3d7c95e14abcee629e155ebc2b2
* `audienceData` mảng khách hàng, hỗ trợ tối đa 5000 khách hàng / request. Nếu bạn có nhiều dữ liệu, bạn nên gom nhiều khách vào 1 request để tránh lỗi [Facebook Rate Limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/?locale=en_US#custom-audience). VD: Bạn có tệp 100.000 khách hàng, thì bắn lên 20 lần, mỗi lần 5000 khách hàng.
* Một khách hàng có thể gửi tối đa 3 số điện thoại và 3 email, bắt buộc phải có tối thiểu 1 số điện thoại hoặc 1 email. VD:

```
# VD chỉ có số điện thoại
"audienceData": [
  {
    "phone": "0987654321",
  },
  {
    "phone": "0987654322",
  }
]

# VD chỉ có enmail
"audienceData": [
  {
    "email": "vpage.nhanhvn@gmail.com"
  },
  {
    "email": "vpage1.nhanhvn@gmail.com"
  }
]

# VD nhiều số điện thoại, nhiều email
"audienceData": [
  {
    "phone": "0987654321",
    "phone_2": "0987654329",
    "phone_3": "0987654328",
    "email": "vpage.nhanhvn@gmail.com",
    "email_2": "vpage4.nhanhvn@gmail.com"
  }
]
```

### dataType raw

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/customaudienceaddsubscriber?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "audienceId": "{{audienceId}}",
    "dataType": "raw",
    "audienceData": [
        {
          "phone": "0987654321",
          "phone_2": "0987654329",
          "phone_3": "0987654328",
          "email": "vpage.nhanhvn@gmail.com",
          "email_2": "vpage4.nhanhvn@gmail.com"
        },
        {
          "phone": "0987654322",
          "email": "vpage2.nhanhvn@gmail.com",
          "email_2": "vpage3.nhanhvn@gmail.com",
          "email_3": "vpage5.nhanhvn@gmail.com"
        }
    ]
}'
```

### dataType hash

* Chú ý:
  * Email cần convert sang lower case trước khi hash.
  * Phone cần convert về dạng có mã quốc gia phía trước, bỏ hết các ký tự đặc biệt, dấu cách, số 0 ở đầu đi. VD số 0987654321 ở Vietnam (+84), cần chuyển thành 84987654321 trước khi hash.

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/customaudienceaddsubscriber?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "audienceId": "{{audienceId}}",
    "dataType": "hash",
    "audienceData": [
        {
          "phone": "17756315ebd47b7110359fc7b168179bf6f2df3646fcc888bc8aa05c78b38ac1",
          "phone_2": "f9dd5cfd005ea36d8db32ecfb6867c9a22a8e3d7c95e14abcee629e155ebc2b2",
          "phone_3": "bc73d47c6459288d514cc759d417a43a8f3981d1a150dad3b4ab4de0199eac5d",
          "email": "5aa0c39831f6953a69ffd9a275969a563bb4be9900e3ee8e0e34501b37778d27",
          "email_2": "e01c2ae5208665cf7cc8e4bc270a1dcbfdcce629a1ffce1acbb2e4cf6873d6ec"
        },
        {
          "phone": "d88a8cfc6a4483536de276fc6c0b9b906ed26425ca26d6e8dbea33be769f1ac6",
          "email": "c1822e15467e69822503ed226df5b565aeb36005b672b357ee32fc2ee18173b6",
          "email_2": "4af0a859010eca3ea17561a9ed607f873d927767079fa788a09274cdaa9a1c96",
          "email_3": "59d1ecd2696d9b301d78136238014d8a6e4357768daec8569080116b807b3c46"
        }
    ]
}'
```

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "num_received": "(number) số khách hàng đã upload thành công",
    }
  ]
}
```


# Upload Facebook Ad image

* API này upload ảnh lên Facebook lấy imageHash, dùng để tạo ảnh cho quảng cáo, VD gửi [Facebook Marketing Message](/v3/vpage/marketing/fmm_campaign_create).

## Request

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/fbaduploadimage?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--data '{
  "bytes": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII...",
  "adAccountId": "act_12345678",
  "pageId": "98764321"
}'
```

| Tham số           | Kiểu dữ liệu | Bắt buộc | Mô tả                                                                          |
| ----------------- | ------------ | -------- | ------------------------------------------------------------------------------ |
| **`bytes`**       | string       | Có       | Chuỗi base64 của tệp ảnh (giới hạn dung lượng tối đa **10MB** sau khi decode). |
| **`adAccountId`** | string       | Có       | ID tài khoản quảng cáo của Facebook (Ví dụ: `act_12345678`).                   |
| **`pageId`**      | string       | Có       | ID Trang Facebook.                                                             |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": {
      "imageHash": "(string)",
  }
}
```


# Gửi Facebook Marketing Message

* API này dùng để tạo chiến dịch gửi Facebook Marketing Message. Để gửi được tin, bạn cần bắt đầu bằng việc:
  * Đăng nhập vào Vpage để kết nối tài khoản quảng cáo.
  * Tạo tệp đối tượng tùy chỉnh ở trên Vpage hoặc dùng API [Tạo tệp đối tượng tùy chỉnh](/v3/vpage/marketing/custom_audience_create)
  * Upload khách hàng vào tệp đối tượng tùy chỉnh hoặc dùng API [Thêm khách hàng vào tệp đối tượng tùy chỉnh](/v3/vpage/marketing/custom_audience_addsubscriber)
  * Upload ảnh lên trước để lấy imageHash của ảnh trước khi tạo chiến dịch (đối với loại `creative` và `template`), dùng API [Upload Image](/v3/vpage/marketing/fb_ad_upload_image)
* **Chú ý**:
  * Facebook giới hạn mỗi user chỉ được nhận 1 tin nhắn quảng cáo trong vòng 12h, nếu bạn vi phạm quy định này, page của bạn có thể sẽ bị khóa tính năng gửi Marketing Message.
  * Vpage sẽ tự động chặn việc bạn gửi spam quá nhiều bằng cách loại trừ các user token đã nhận được tin trong vòng 12h gần nhất. Cơ chế này chỉ hoạt động được khi bạn chỉ sử dụng Vpage để gửi tin, nếu bạn dùng thêm 1 app khác, Vpage không thể đảm bảo được việc này.
  * Thời gian Facebook phản hồi API này khá chậm: Có thể \~10 giây.

## Request

### 1. Gửi loại Mẫu tin cơ bản (`creative`)

Gửi tin nhắn dạng carousel với ảnh và nút bấm. Hỗ trợ từ 1 đến 10 card. Mỗi card bắt buộc phải có `imageHash` (lấy từ API Upload Image) và `link` (URL đích).

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/fmmcampaigncreate?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "campaign": {
    "pageId": "167890463074771",
    "adAccountId": "act_962587495564547",
    "segmentIds": [
      "120246391779940373",
      "I_pgtJ0Bq4rJK0SlQsHD"
    ],
    "name": "Chiến dịch Mẫu tin cơ bản",
    "budget": 100000,
    "budgetType": "life_time",
    "adStartAt": 1790000000,
    "adEndAt": 1790086400,
    "type": "creative"
  },
  "settings": {
    "noResendWithinDays": 7,
    "excludes": {
      "topicsIds": [],
      "audienceIds": [],
      "campaignIds": []
    }
  },
  "message": {
    "greeting": "Xin chào {{first_name}}! Xem ngay các sản phẩm mới nhất của chúng tôi.",
    "attachments": [
      {
        "imageHash": "63d13607cd76dc3fba71350751352d85",
        "name": "Áo Khoác Nam Bomber",
        "description": "Chất liệu phao ấm áp, thiết kế năng động trẻ trung.",
        "link": "https://vpage.nhanh.vn/",
        "buttons": [
          {
            "type": "URL",
            "text": "Xem sản phẩm",
            "url": "https://vpage.nhanh.vn/"
          },
          {
            "type": "SCRIPT",
            "text": "Trò chuyện trực tiếp",
            "botId": "iTLPoJoBMexIgwsbLJX0",
            "blockId": "DUMv6JoBMexIgwsbbyew"
          }
        ]
      },
      {
        "imageHash": "ba9785f4bf57867b772399507eaf9b93",
        "name": "Quần Jeans Slimfit",
        "description": "Co giãn tốt, giữ form dáng cực chuẩn.",
        "link": "https://vpage.nhanh.vn/",
        "buttons": [
          {
            "type": "URL",
            "text": "Mua ngay",
            "url": "https://vpage.nhanh.vn/"
          }
        ]
      }
    ]
  }
}'
```

### 2. Gửi loại Mẫu tin nâng cao (`template`)

Gửi tin nhắn dạng carousel kèm Quick Replies (nút phản hồi nhanh). Hỗ trợ từ 1 đến 10 card. Quick Reply loại `text` bắt buộc phải có `botId` và `blockId`.

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/fmmcampaigncreate?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "campaign": {
    "pageId": "167890463074771",
    "adAccountId": "act_962587495564547",
    "segmentIds": [
      "120246391779940373",
      "I_pgtJ0Bq4rJK0SlQsHD"
    ],
    "name": "Chiến dịch Mẫu tin nâng cao",
    "budget": 150000,
    "budgetType": "life_time",
    "adStartAt": 1790000000,
    "adEndAt": 1790172800,
    "type": "template"
  },
  "settings": {
    "noResendWithinDays": 3
  },
  "message": {
    "greeting": "Chúc mừng bạn nhận được ưu đãi độc quyền!",
    "attachments": [
      {
        "imageHash": "63d13607cd76dc3fba71350751352d85",
        "url": "https://chatcdn.nvndev.net/page/733971813141805/20260530/626fa98240562bc843d9fbf8d90a22ee.png",
        "name": "Voucher Giảm 50K",
        "description": "Áp dụng cho đơn hàng bất kì từ 300K.",
        "link": "https://vpage.nhanh.vn/",
        "buttons": [
          {
            "type": "URL",
            "text": "Truy cập ngay",
            "url": "https://vpage.nhanh.vn/"
          }
        ]
      }
    ],
    "quickReplies": [
      {
        "type": "text",
        "title": "Nhận tư vấn ngay",
        "botId": "iTLPoJoBMexIgwsbLJX0",
        "blockId": "DUMv6JoBMexIgwsbbyew"
      },
      {
        "type": "phone"
      }
    ]
  }
}'
```

### 3. Gửi danh sách sản phẩm (`product`)

Gửi danh sách sản phẩm từ Meta catalog. Không cần `attachments`, chỉ cần truyền mảng `productIds`. Tối đa 10 sản phẩm.

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/fmmcampaigncreate?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "campaign": {
    "pageId": "167890463074771",
    "adAccountId": "act_962587495564547",
    "segmentIds": [
      "120246391779940373",
      "I_pgtJ0Bq4rJK0SlQsHD"
    ],
    "name": "Chiến dịch Gửi Sản Phẩm",
    "budget": 200000,
    "budgetType": "daily",
    "adStartAt": 1790000000,
    "adEndAt": 1790086400,
    "type": "product"
  },
  "message": {
    "productIds": [
      "35992283650387505",
      "24931185889837761"
    ]
  }
}'
```

### 4. Gửi Coupon / Voucher (`coupon`)

Gửi tin nhắn voucher/mã giảm giá. Bắt buộc phải có đúng 1 phần tử trong mảng `attachments` chứa thông tin voucher. Trường `url` là link hình ảnh HTTPS hiển thị trên voucher.

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/fmmcampaigncreate?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
  "campaign": {
    "pageId": "167890463074771",
    "adAccountId": "act_962587495564547",
    "segmentIds": [
      "120246391779940373",
      "I_pgtJ0Bq4rJK0SlQsHD"
    ],
    "name": "Chiến dịch Tặng Coupon",
    "budget": 120000,
    "budgetType": "daily",
    "adStartAt": 1790000000,
    "adEndAt": 1790086400,
    "type": "coupon"
  },
  "message": {
    "greeting": "Ưu đãi chào Hè dành riêng cho bạn!",
    "attachments": [
      {
        "name": "Voucher Giảm 10% Toàn Bộ Cửa Hàng",
        "coupon_code": "HEVUI10",
        "link": "https://vpage.nhanh.vn/",
        "coupon_url_button_title": "Mua Sắm Ngay",
        "url": "https://chatcdn.nvndev.net/page/733971813141805/20260530/626fa98240562bc843d9fbf8d90a22ee.png",
        "description": "Mã giảm giá có hiệu lực đến hết năm nay.",
        "expire_time": 1798732799
      }
    ]
  }
}'
```

***

## Cấu trúc chi tiết Parameters

### campaign

| Key         | Type   | Description                                                                                                                                                                                                                                                                                                                   |
| ----------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pageId      | string | ID của Trang (Page) Facebook sẽ dùng để gửi tin nhắn. Bắt buộc.                                                                                                                                                                                                                                                               |
| adAccountId | string | ID của Tài khoản Quảng cáo (Ad Account ID) liên kết. Bắt buộc. (Format: `act_...`).                                                                                                                                                                                                                                           |
| segmentIds  | array  | Danh sách ID tệp [đối tượng tuỳ chỉnh](/v3/vpage/marketing/custom_audience_list) hoặc [Chủ đề](/v3/vpage/marketing/topic_list). Bắt buộc. Tối đa 50 phần tử.                                                                                                                                                                  |
| name        | string | Tên của chiến dịch. Bắt buộc. Không được rỗng.                                                                                                                                                                                                                                                                                |
| budget      | number | Ngân sách cho chiến dịch (đơn vị VNĐ). Bắt buộc. Tối thiểu `50000`.                                                                                                                                                                                                                                                           |
| budgetType  | string | Loại ngân sách: `daily` (mỗi ngày) hoặc `life_time` (toàn chiến dịch). Bắt buộc.                                                                                                                                                                                                                                              |
| adStartAt   | number | Thời gian bắt đầu chiến dịch (Unix Timestamp). Bắt buộc. Phải ở **tương lai** (không được nhỏ hơn thời điểm hiện tại).                                                                                                                                                                                                        |
| adEndAt     | number | Thời gian kết thúc chiến dịch (Unix Timestamp). Bắt buộc. Phải lớn hơn `adStartAt`.                                                                                                                                                                                                                                           |
| type        | string | <p>Loại gửi chiến dịch. Bắt buộc. Chấp nhận:<br><code>creative</code>: Mẫu tin cơ bản (Gửi ảnh và nút bấm mặc định).<br><code>template</code>: Mẫu tin nâng cao (Carousel mẫu tin nhắn kèm Quick Replies).<br><code>product</code>: Gửi danh sách sản phẩm từ Meta catalog.<br><code>coupon</code>: Gửi voucher giảm giá.</p> |

### settings (tùy chọn)

| Key                  | Type   | Description                                                                                             |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------------- |
| noResendWithinDays   | number | Không gửi cho khách đã nhận tin trong vòng x ngày gần nhất.                                             |
| excludes.topicsIds   | array  | Danh sách ID Chủ đề để loại trừ. Tối đa 50 phần tử. Không được trùng với `segmentIds`.                  |
| excludes.audienceIds | array  | Danh sách ID tệp đối tượng tùy chỉnh để loại trừ. Tối đa 50 phần tử. Không được trùng với `segmentIds`. |
| excludes.campaignIds | array  | Danh sách ID chiến dịch để loại trừ (không gửi cho khách đã nhận tin trước đó). Tối đa 50 phần tử.      |

### message

| Key          | Optional    | Type   | Description                                                                                                                                                     |
| ------------ | ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| greeting     | optional    | string | Lời chào mở đầu. Giới hạn 160 kí tự. (Áp dụng cho: `creative`, `template`, `coupon`). Không áp dụng cho `product`.                                              |
| attachments  | conditional | array  | Mảng chứa thông tin card tin nhắn. **Bắt buộc** với `creative` (1–10 card), `template` (1–10 card), và `coupon` (đúng 1 phần tử). **Không dùng** cho `product`. |
| productIds   | conditional | array  | Mảng chứa danh sách ID sản phẩm từ Meta catalog. **Bắt buộc** với loại `product`. Tối đa 10 phần tử. Mỗi phần tử phải là string hoặc số.                        |
| quickReplies | optional    | array  | Mảng nút phản hồi nhanh hiển thị bên dưới tin nhắn. Tối đa 13 phần tử. (Chỉ áp dụng cho loại: `template`).                                                      |
| configCart   | optional    | object | Cấu hình tin nhắn mồi khi gửi giỏ hàng. Chỉ áp dụng khi có nút bấm type `CART` trong `attachments` của loại `creative` hoặc `template`.                         |

### attachments (Dành cho loại: `creative`, `template`)

| Key         | Optional    | Type   | Description                                                                                                                                                                                                                                        |
| ----------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| imageHash   | required    | string | Hash của ảnh đã upload qua API [Upload Image](/v3/vpage/marketing/fb_ad_upload_image). Bắt buộc để tạo ad creative.                                                                                                                                |
| url         | conditional | string | URL hình ảnh hiển thị trên card (phải là URL HTTPS hợp lệ). **Bắt buộc** đối với loại `template` (để hiển thị ảnh khi gửi tin thật qua Messenger API), **tùy chọn** đối với loại `creative` (Meta tự động lấy ảnh từ `imageHash` của ad creative). |
| name        | required    | string | Tiêu đề của card tin nhắn. Giới hạn 80 kí tự.                                                                                                                                                                                                      |
| link        | conditional | string | URL đích mở ra khi người dùng nhấp vào card (trừ các nút bấm CTA). **Bắt buộc** với `creative`, tùy chọn với `template`. Phải là URL hợp lệ. Giới hạn 120 kí tự.                                                                                   |
| description | optional    | string | Nội dung phụ đề hiển thị dưới tiêu đề card. Giới hạn 640 kí tự với `creative`, 80 kí tự với `template`.                                                                                                                                            |
| buttons     | optional    | array  | Mảng chứa tối đa 3 nút bấm tương tác (CTA) cho card này.                                                                                                                                                                                           |

### attachments (Dành riêng cho loại: `coupon`)

| Key                        | Optional | Type   | Description                                                                                     |
| -------------------------- | -------- | ------ | ----------------------------------------------------------------------------------------------- |
| name                       | required | string | Tiêu đề của voucher. Giới hạn 80 kí tự.                                                         |
| coupon\_code               | required | string | Mã giảm giá để người dùng sao chép và áp dụng.                                                  |
| link                       | required | string | URL đích chuyển hướng khi click nút mua hàng. Phải bắt đầu bằng `https://`.                     |
| coupon\_url\_button\_title | required | string | Tiêu đề hiển thị trên nút bấm nhận/áp dụng coupon.                                              |
| url                        | required | string | URL hình ảnh voucher hiển thị trong tin nhắn (phải là link ảnh HTTPS).                          |
| description                | optional | string | Mô tả hoặc điều kiện áp dụng voucher. Giới hạn 80 kí tự.                                        |
| expire\_time               | optional | number | Thời gian hết hạn voucher (Unix Timestamp, số nguyên dương). Hiển thị đếm ngược cho người nhận. |

### buttons (Trong card của attachments — loại `creative`, `template`)

| Key        | Type   | Description                                                                                                                                                                                                                  |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type       | string | <p>Loại hành động của nút. Bắt buộc. Chấp nhận:<br><code>URL</code>: Mở liên kết.<br><code>SCRIPT</code>: Chạy kịch bản chatbot.<br><code>CART</code>: Mở giỏ hàng thanh toán.</p>                                           |
| text       | string | Văn bản hiển thị trên nút bấm. Bắt buộc.                                                                                                                                                                                     |
| url        | string | URL liên kết đích. Bắt buộc khi type là `URL`. Phải là URL hợp lệ. Giới hạn 120 kí tự.                                                                                                                                       |
| botId      | string | ID của Chatbot. Bắt buộc khi type là `SCRIPT`.                                                                                                                                                                               |
| blockId    | string | ID Kịch bản Chatbot. Bắt buộc khi type là `SCRIPT`. (Lưu ý: Hệ thống sẽ tự động truy vấn và điền trường `alias` dựa trên `blockId` để cấu hình chính xác cho chatbot trên Facebook, người dùng không cần tự truyền `alias`). |
| cartId     | string | ID Giỏ hàng. Bắt buộc khi type là `CART`.                                                                                                                                                                                    |
| productIds | array  | Mảng danh sách ID sản phẩm được thêm vào giỏ hàng. Tùy chọn, chỉ áp dụng khi type là `CART`.                                                                                                                                 |

### quickReplies (Trong message — chỉ loại `template`)

| Key        | Type   | Description                                                                                                                                                                                                |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type       | string | <p>Loại nút phản hồi nhanh. Bắt buộc. Chấp nhận:<br><code>text</code>: Nút văn bản tùy chỉnh.<br><code>email</code>: Tự điền Email FB của user.<br><code>phone</code>: Tự điền Số điện thoại của user.</p> |
| title      | string | Văn bản hiển thị trên nút. Bắt buộc khi type là `text`. Giới hạn 20 kí tự.                                                                                                                                 |
| botId      | string | ID của Chatbot kích hoạt khi nhấn. Bắt buộc khi type là `text`.                                                                                                                                            |
| blockId    | string | ID Kịch bản Chatbot kích hoạt khi nhấn. Bắt buộc khi type là `text`.                                                                                                                                       |
| image\_url | string | URL hình ảnh icon bên cạnh văn bản nút. Tùy chọn, chỉ áp dụng khi type là `text`.                                                                                                                          |

### configCart (Tùy chọn — chỉ khi có nút `CART`)

| Key         | Type   | Description                                                                       |
| ----------- | ------ | --------------------------------------------------------------------------------- |
| seedStatus  | number | Bật/tắt tin nhắn mồi: `1` = bật (Active), `2` = tắt (Inactive). Bắt buộc.         |
| seedLabel   | string | Tiêu đề nút giỏ hàng. Bắt buộc khi `seedStatus = 1`. Giới hạn 80 kí tự.           |
| seedMessage | string | Nội dung gửi kèm nút giỏ hàng. Bắt buộc khi `seedStatus = 1`. Giới hạn 640 kí tự. |

***

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).
* Danh sách **errorCode** của riêng API này:

| errorCode                                | Description                                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ERR\_INVALID\_FORM\_FIELDS               | Dữ liệu gửi lên không hợp lệ. Chi tiết lỗi sẽ trả về trong trường `messages` với key tương ứng.         |
| ERR\_FMM\_INVALID\_EXCLUDE\_SEGMENT\_IDS | Sai điều kiện loại trừ tệp. Ví dụ: Bạn chọn gửi tin cho tệp A, nhưng lại chọn loại trừ chính tệp A này. |

### Successful response

```json
{
  "code": 1,
  "data": {
      "adCampaignId": "(string) Id of Facebook Marketing Message campaign",
  }
}
```


# Gửi lại một chiến dịch Facebook Marketing Message

* API này cho phép gửi lại một chiến dịch tin nhắn quảng cáo đã gửi thành công trước đó.
* Một số tình huống hay sử dụng:
  * Tình huống 1: Bạn có 1 chiến dịch gửi tin đã gửi thành công, nay muốn gửi lại tin cho toàn bộ khách hàng với nội dung cũ, thì bạn có thể dùng lại chiến dịch này, thay vì phải tạo chiến dịch mới và chờ Facebook duyệt nội dung, giúp rút ngắn thời gian chờ.
  * Tình huống 2: Bạn [thêm khách vào tệp đối tượng tùy chỉnh](/v3/vpage/marketing/custom_audience_addsubscriber), sau đó muốn gửi tin cho các khách mới được thêm vào tệp này (Tính năng này chỉ phù hợp cho các chiến dịch chạy dài ngày).
* **Chú ý**:
  * Facebook giới hạn mỗi user chỉ được nhận 1 tin nhắn quảng cáo trong vòng 12h, nếu bạn vi phạm quy định này, page của bạn có thể sẽ bị khóa tính năng gửi Marketing Message.
  * Vpage sẽ tự động chặn việc bạn gửi spam quá nhiều bằng cách loại trừ các user token đã nhận được tin trong vòng 12h gần nhất. Cơ chế này chỉ hoạt động được khi bạn chỉ sử dụng Vpage để gửi tin, nếu bạn dùng thêm 1 app khác, Vpage không thể đảm bảo được việc này.

## Request

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/marketing/fmmcampaignresend?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--data '{
  "campaign": {
    "adCampaignId": "120232711406030373",
    "sendMode": "NEW_USER",
    "segmentIds": [],
    "sendAt": 1761294919,
  },
  "settings": {
    "noResendWithinDays": 1,
    "excludes": {
      "topicsIds": [],
      "audienceIds": [],
      "campaignIds": []
    }
  }
}'
```

### campaign

| Key          | Type   | Description                                                                                                                                                                                                                                                                                          |
| ------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| adCampaignId | string | ID chiến dịch trên Facebook đã gửi trên Vpage                                                                                                                                                                                                                                                        |
| sendMode     | string | <p><code>NEW\_USER</code>: Chỉ gửi cho các khách chưa từng nhận được tin nhắn của campaign này (VD: Khách mới upload lên tệp khách hàng, hoặc khách lần trước chưa gửi được do hết ngân sách, hết ngày chạy chiến dịch chưa gửi được)<br><code>ALL\_USER</code>: Tất cả khách của tệp segmentIds</p> |
| segmentIds   | array  | Danh sách ID tệp [đối tượng tuỳ chỉnh (Custom Audience)](/v3/vpage/marketing/custom_audience_list) hoặc [Chủ đề (Topic)](/v3/vpage/marketing/topic_list)                                                                                                                                             |
| sendAt       | number | Thời gian gửi dự kiến (UNIX timestamp).                                                                                                                                                                                                                                                              |

### settings

| Key                  | Type   | Description                                                                                                         |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| noResendWithinDays   | number | Không gửi cho khách đã nhận tin trong vòng x ngày gần nhất.                                                         |
| excludes.topicsIds   | array  | Không gửi cho khách đã đăng ký [Chủ đề (Topic)](/v3/vpage/marketing/topic_list)                                     |
| excludes.audienceIds | array  | Không gửi cho khách trong các tệp [đối tượng tuỳ chỉnh (Custom Audience)](/v3/vpage/marketing/custom_audience_list) |
| excludes.campaignIds | array  | Không gửi cho khách đã gửi trong [chiến dịch](/v3/vpage/marketing/fmm_campaign_list)                                |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).
* Danh sách **errorCode** của riêng API này:

| errorCode                                | Description                                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ERR\_FMM\_INVALID\_EXCLUDE\_SEGMENT\_IDS | Sai điều kiện loại trừ tệp. VD bạn đang chọn gửi tin cho tệp A, nhưng lại chọn loại trừ chính tệp A này |

### Successful response

```json
{
  "code": 1,
  "data": {
      "adCampaignId": "(string) Id of Facebook Marketing Message campaign",
  }
}
```


# Báo cáo


# Meta Conversions API

* Lấy báo cáo Meta CAPI

## Request

* Xem sample Postman.

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/report/capi?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--body '{
        "filters": {
        "createdAt": {
            "to": 1767200399,
            "from": 1764522000
        },
        "timeZone": "Asia/Ho_Chi_Minh",
        "pageIds": [],
        "events": ["Purchase", "LeadSubmitted"]
    },
}'
```

### Filters

| Key       | Type   | Required | Description                                                                                         |
| --------- | ------ | -------- | --------------------------------------------------------------------------------------------------- |
| pageIds   | array  | Required | Danh sách pageIds                                                                                   |
| createdAt | array  | Required | Khoảng thời gian gửi, tối đa 31 ngày. ( ví dụ "createdAt": {"from": 1764522000, "to": 1766768399} ) |
| timeZone  | string | optional | Múi giờ. Default: Asia/Ho\_Chi\_Minh                                                                |
| events    | array  | Required | Danh sách event                                                                                     |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "date": "2025-12-15",
      "events": [
        {
          "event": "Purchase",
          "totalOrders": 2,
          "totalCustomerShipFee": 23400,
          "totalOrderValue": 0,
          "totalRevenue": 23400
        }
      ]
    },
    {
      "date": "2025-12-29",
      "events": [
        {
          "event": "LeadSubmitted",
          "totalOrders": 1
        },
        {
          "event": "Purchase",
          "totalOrders": 1,
          "totalCustomerShipFee": 0,
          "totalOrderValue": 1000,
          "totalRevenue": 1000
        }
      ]
    }
  ]
}
```


# Chi tiết event CAPI

* Chi tiết báo cáo CAPI

## Request

* Xem sample Postman.

```curl
curl --location 'https://vpage.open.nhanh.vn/v3.0/report/capievent?appId={{appId}}&businessId={{businessId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--body '{
  "filters": {
    "pageIds": ["123456789"],
    "events": ["Purchase", "LeadSubmitted"],
    "createdAt": {
      "from": 1787011200,
      "to": 1787616000
    },
    "statuses": [1, 2],
    "orderId": "123456"
  },
  "paginator": {
    "size": 50,
    "sort": {
      "createdAt": "desc"
    }
  }
}'
```

### Filters

| Field        | Kiểu            | Mô tả                                                                                                                                                                             |
| ------------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pageIds`    | array\[string]  | Danh sách ID Page cần lấy báo cáo. Nếu không truyền, API lấy dữ liệu của toàn bộ Page mà access token được cấp quyền trong business.                                              |
| `events`     | array\[string]  | Danh sách loại CAPI event cần lấy. Nếu không truyền, API mặc định lấy `Purchase`, `LeadSubmitted`, `OrderCanceled`, `OrderReturned`. Xem bảng Event bên dưới.                     |
| `createdAt`  | object          | Khoảng thời gian tạo event, dùng Unix timestamp theo giây. Nếu không truyền, mặc định từ 00:00:00 ngày đầu tháng hiện tại đến thời điểm gọi API. Khoảng thời gian tối đa 31 ngày. |
| `statuses`   | array\[integer] | Lọc theo trạng thái gửi CAPI.                                                                                                                                                     |
| `orderId`    | string          | Lọc chính xác theo mã đơn hàng/event ID đã lưu.                                                                                                                                   |
| `pageUserId` | string          | Lọc chính xác theo ID khách trên Page/Meta.                                                                                                                                       |
| `adId`       | string          | Lọc chính xác theo Meta Ad ID.                                                                                                                                                    |

### Event hợp lệ

| Giá trị         | Mô tả                          |
| --------------- | ------------------------------ |
| `Purchase`      | Event đơn hàng mua thành công. |
| `LeadSubmitted` | Event khách để lại lead.       |
| `OrderCanceled` | Event đơn hàng bị hủy.         |
| `OrderReturned` | Event đơn hàng hoàn trả.       |

### Status hợp lệ

| Giá trị | Mô tả                                           |
| ------- | ----------------------------------------------- |
| `1`     | Gửi thành công.                                 |
| `2`     | Gửi thất bại.                                   |
| `3`     | Đang gửi.                                       |
| `4`     | Không gửi do điều kiện/cấu hình không thỏa mãn. |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "id": "Purchase_123456",
      "createdAt": 1787308800,
      "channel": 1,
      "pageId": "123456789",
      "pageUserId": "987654321",
      "adId": "120012345678901",
      "conversationId": "123456789_987654321",
      "eventName": "Purchase",
      "orderId": "123456",
      "orderAmount": 250000,
      "customerShipFee": 30000,
      "sentOrderAmount": 280000,
      "totalAmount": 280000,
      "currency": "VND",
      "status": 1,
      "products": [],
      "dataResponse": {}
    }
  ],
  "paginator": {
    "next": [1787308800, "123456"]
  }
}
```

### Data fields

| Field             | Kiểu           | Mô tả                                            |
| ----------------- | -------------- | ------------------------------------------------ |
| `id`              | string         | ID bản ghi CAPI trong hệ thống.                  |
| `createdAt`       | integer        | Thời điểm tạo event, Unix timestamp theo giây.   |
| `channel`         | integer        | Kênh phát sinh hội thoại/đơn hàng.               |
| `pageId`          | string         | ID Page phát sinh event.                         |
| `conversationId`  | string         | ID hội thoại liên quan, nếu có.                  |
| `eventName`       | string         | Tên CAPI event.                                  |
| `orderId`         | string         | Mã đơn hàng hoặc event ID.                       |
| `orderAmount`     | number         | Tiền hàng của đơn.                               |
| `customerShipFee` | number         | Phí vận chuyển khách trả.                        |
| `totalAmount`     | number         | Tổng tiền đơn: `orderAmount + customerShipFee`.  |
| `sentOrderAmount` | number         | Giá trị đã gửi trong payload CAPI.               |
| `currency`        | string         | Đơn vị tiền tệ.                                  |
| `status`          | integer        | Trạng thái gửi Meta.                             |
| `products`        | array          | Danh sách sản phẩm được lưu cùng event, nếu có.  |
| `dataResponse`    | object\|string | Phản hồi hoặc thông tin lỗi Meta đã lưu, nếu có. |
| `datasetId`       | string         | ID Meta Dataset nhận event, nếu có.              |
| `pageUserId`      | string         | ID khách trên Page/Meta, nếu có.                 |
| `adId`            | string         | Meta Ad ID, nếu event phát sinh từ quảng cáo.    |
| `createdById`     | string         | ID nhân viên/hệ thống tạo event, nếu có.         |


# Danh sách địa chỉ

* API này dùng để lấy danh sách địa chỉ: thành phố, quận huyện, phường xã.
* Chú ý: Dữ liệu rất ít khi bị thay đổi (chỉ xảy ra khi có thay đổi tên, chia tách hoặc gộp), bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 24h.
* API hỗ trợ lấy dữ liệu cho cả địa chỉ hành chính cũ 3 cấp (Tỉnh / Thành phố, Quận / Huyện, Phường / Xã) và địa chỉ hành chính mới 2 cấp (Tỉnh / Thành phố, Phường / Xã)
* **Chú ý**:
  * Hiện toàn bộ các hãng vận chuyển vẫn đang dùng địa chỉ 3 cấp, chỉ 1 số ít hãng đã hỗ trợ 2 cấp.
  * Chưa có hãng nào bắt buộc dùng địa chỉ 2 cấp.
  * Sau khi hỗ trợ địa chỉ 2 cấp, các hãng vận chuyển vẫn hỗ trợ song song cả 2 loại 3 cấp và 2 cấp.
  * **Khuyến cáo** bạn vẫn nên dùng địa chỉ 3 cấp cho tới khi có các thông báo mới tiếp theo.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/ship/location).

```curl
curl --location 'https://ship.open.nhanh.vn/v3.0/shipping/location?businessId={{businessId}}&appId={{appId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "filters": {
        "locationVersion": "v1",
        "type": "DISTRICT",
        "parentId": 254
    }
}'
```

### Filters

| Key             | Type                          | Description                                                                                                                                                                                                               |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| locationVersion | string $$^{{\color{red}\*}}$$ | <p>v1: Địa chỉ 3 cấp (Tỉnh / Thành phố, Quận / Huyện, Phường / Xã)<br>v2: Địa chỉ 2 cấp (Tỉnh / Thành phố, Phường / Xã)</p>                                                                                               |
| type            | string $$^{{\color{red}\*}}$$ | PROVINCE / DISTRICT / WARD (mặc định là PROVINCE)                                                                                                                                                                         |
| parentId        | int                           | <p>type = DISTRICT thì parentId = id của thành phố cần lấy ra danh sách quận huyện<br>type = WARD thì parentId = id của quận huyện (nếu là địa chỉ 3 cấp, nếu locationVersion=v2 thì là id của thành phố) cần lấy ra.</p> |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "id": "(int) ID địa chỉ 1",
      "name": "Tên địa chỉ",
      "otherName": "Tên khác của địa chỉ"
    },
    {
      "id": "(int) ID địa chỉ 2",
      "name": "Tên địa chỉ"
    }
  ]
}
```


# Danh sách hãng vận chuyển

* Dùng để lấy danh sách các hãng vận chuyển đang được tích hợp với Nhanh.vn. Nhanh.vn đang kết nối với Giaohangnhanh, J\&T Express, Viettel Post, Vietnam Post, EMS, Ninjavan, Best Express... để hỗ trợ dịch vụ vận chuyển và giao hàng thu tiền tận nhà.
* Chú ý: Dữ liệu này rất ít khi bị thay đổi, bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 24h.

## Request

* Xem các [common request params](/v3#request-params)
* Xem [Postman sample](/v3/ship/list).

```curl
curl --location 'https://ship.open.nhanh.vn/v3.0/carrier/list?businessId={{businessId}}&appId={{appId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data ''
```

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "id": "(int) ID hãng vận chuyển",
      "name": "(string) Tên hãng vận chuyển",
      "logo": "(string) Đường dẫn file ảnh",
      "status": "(int) Trạng thái (1: Hoạt động)",
      "shortName": "(string) Tên viết tắt của hãng vận chuyển",
      "services": [
        {
          "id": "(int) ID dịch vụ vận chuyển",
          "code": "(string) Mã dịch vụ hãng vận chuyển",
          "name": "(string) Tên dịch vụ vận chuyển",
          "description": "(string) Mô tả dịch vụ"
        }
      ]
    }
  ]
}
```


# Tính cước phí

* Lấy danh sách dịch vụ vận chuyển và phí vận chuyển tương ứng từ một hoặc nhiều hãng vận chuyển, dựa trên thông tin người gửi, người nhận và kiện hàng.
* **Hỗ trợ:** Lấy bảng giá từ **một hoặc nhiều hãng vận chuyển** trong cùng một request.
* **Mặc định:** Nếu không truyền `carrierIds`, hệ thống sẽ tự động lấy bảng giá từ tất cả các hãng hỗ trợ (Ahamove, Grab Express, GreenSM ...).

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/ship/rate).

```curl
curl --location 'https://ship.open.nhanh.vn/v3.0/shipment/rate?businessId={{businessId}}&appId={{appId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "sender": {
        "name": "Nguyễn Văn A",
        "mobile": "0901234567",
        "shippingLocation": {
            "locationVer": "v2",
            "provinceId": 1,
            "wardId": 100,
            "address": "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
            "longitude": 105.804567,
            "latitude": 21.001234
        }
    },
    "receiver": {
        "name": "Trần Thị B",
        "mobile": "0912345678",
        "shippingLocation": {
            "locationVer": "v2",
            "provinceId": 48,
            "wardId": 12345,
            "address": "456 Lê Lợi, Hải Châu, Đà Nẵng",
            "longitude": 108.212345,
            "latitude": 16.067890
        }
    },
    "products": [
        {
            "name": "Áo thun cotton",
            "quantity": 2,
            "price": 150000,
            "weight": 300
        }
    ],
    "weight": 1500,
    "packageDimensions": {
        "width": 30,
        "height": 20,
        "length": 40
    },
    "codAmount": 650000,
    "description": "Thời trang nam nữ",
    "carrierIds": [31, 18, 37],
    "serviceTypes": [5],
    "carrierExtraServices": {
        "allowTest": true,
        "declaredSetting": true,
        "declaredAmount": 500000
    },
    "shipFeeBy": "sender"
}'
```

### Body

| Key                  | Type                        | Description                                                                                                                                                    |
| -------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sender               | object $$^{\color{red}\*}$$ | Thông tin người gửi. Xem [Sender](#sender)                                                                                                                     |
| receiver             | object $$^{\color{red}\*}$$ | Thông tin người nhận. Xem [Receiver](#receiver)                                                                                                                |
| products             | array                       | Danh sách sản phẩm trong đơn hàng. Xem [Products](#products)                                                                                                   |
| weight               | int $$^{\color{red}\*}$$    | Khối lượng thực tế của đơn hàng (gram). Xem [Quy tắc tính khối lượng](#package-dimensions)                                                                     |
| packageDimensions    | object                      | Kích thước kiện hàng (cm). Xem [Package Dimensions](#package-dimensions)                                                                                       |
| codAmount            | int                         | Số tiền thu hộ (COD), đơn vị VND. Mặc định: `0`                                                                                                                |
| description          | string                      | Mô tả đơn hàng                                                                                                                                                 |
| carrierIds           | array\[int]                 | Danh sách ID hãng vận chuyển. **Không bắt buộc** - nếu không truyền sẽ lấy tất cả hãng Express delivery                                                        |
| serviceTypes         | array\[int]                 | Loại dịch vụ vận chuyển (type từ bảng carrier\_services). Xem [Service Types](#service-types). **Không bắt buộc** - khuyến nghị truyền `[5]` (Express/Hỏa tốc) |
| carrierExtraServices | object                      | Các dịch vụ bổ sung. Xem [Carrier Extra Services](#carrier-extra-services)                                                                                     |
| shipFeeBy            | string                      | Người trả phí: `"sender"` (mặc định) hoặc `"receiver"`                                                                                                         |

### Service Types

Loại dịch vụ vận chuyển.

| Value | Type    | Description                |
| ----- | ------- | -------------------------- |
| 5     | Instant | Giao hỏa tốc (khuyến nghị) |
| 10    | Fast    | Giao nhanh                 |
| 15    | Nomal   | Giao tiêu chuẩn            |

### Sender

| Key              | Type                        | Description                                                   |
| ---------------- | --------------------------- | ------------------------------------------------------------- |
| name             | string $$^{\color{red}\*}$$ | Tên người gửi                                                 |
| mobile           | string $$^{\color{red}\*}$$ | Số điện thoại người gửi                                       |
| shippingLocation | object                      | Địa chỉ lấy hàng. Xem [Shipping Location](#shipping-location) |

### Receiver

| Key              | Type                        | Description                                                    |
| ---------------- | --------------------------- | -------------------------------------------------------------- |
| name             | string $$^{\color{red}\*}$$ | Tên người nhận                                                 |
| mobile           | string $$^{\color{red}\*}$$ | Số điện thoại người nhận                                       |
| shippingLocation | object                      | Địa chỉ giao hàng. Xem [Shipping Location](#shipping-location) |

### Shipping Location

Đối tượng mô tả địa điểm (dùng cho cả sender và receiver).

| Key         | Type   | Description                                                                                                                            |
| ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| locationVer | string | Phiên bản dữ liệu địa chỉ: `"v1"` (3 cấp: provinceId + districtId + wardId) hoặc `"v2"` (2 cấp: provinceId + wardId). Mặc định: `"v2"` |
| provinceId  | int    | ID tỉnh/thành phố [Lấy từ danh sách địa chỉ](/v3/ship/location)                                                                        |
| districtId  | int    | ID quận/huyện [Lấy từ danh sách địa chỉ](/v3/ship/location)                                                                            |
| wardId      | int    | ID phường/xã [Lấy từ danh sách địa chỉ](/v3/ship/location)                                                                             |
| address     | string | Địa chỉ chi tiết (số nhà, tên đường)                                                                                                   |
| longitude   | number | Kinh độ (dùng thay thế cho provinceId/districtId/wardId)                                                                               |
| latitude    | number | Vĩ độ (dùng thay thế cho provinceId/districtId/wardId)                                                                                 |

> **Lưu ý:**
>
> * `locationVer` của **sender** và **receiver** phải giống nhau (cùng là `"v1"` hoặc cùng là `"v2"`).
> * Nếu dùng `locationVer = "v1"`: bắt buộc truyền đủ `provinceId`, `districtId`, `wardId`.
> * Nếu dùng `locationVer = "v2"`: chỉ cần `provinceId` và `wardId` (không bắt buộc `districtId`).
> * Nếu không truyền `locationVer`: mặc định là `"v2"`.

### Products

* Cấu trúc `products` được pass-through trực tiếp đến từng hãng vận chuyển. Các field con có thể khác nhau tùy hãng.

| Key      | Type   | Description                  |
| -------- | ------ | ---------------------------- |
| name     | string | Tên sản phẩm                 |
| quantity | int    | Số lượng. Mặc định: `1`      |
| price    | number | Đơn giá sản phẩm (VND)       |
| weight   | int    | Khối lượng 1 sản phẩm (gram) |

### Package Dimensions

| Key    | Type | Description               |
| ------ | ---- | ------------------------- |
| width  | int  | Chiều rộng kiện hàng (cm) |
| height | int  | Chiều cao kiện hàng (cm)  |
| length | int  | Chiều dài kiện hàng (cm)  |

> **Quy tắc tính khối lượng quy đổi:**
>
> Để đảm bảo tính phí vận chuyển chính xác dựa trên **khối lượng thực tế** của kiện hàng, hệ thống sử dụng quy tắc so sánh giữa:
>
> * `weight`: Khối lượng thực tế của kiện hàng (gram).
> * `weightConverted`: Khối lượng quy đổi từ kích thước kiện hàng (gram).
>
> **Công thức tính khối lượng quy đổi:**
>
> ```
> weightConverted = (length × width × height) / 6
> ```
>
> *(Đơn vị: cm → kết quả quy đổi ra gram)*
>
> **Quy tắc lấy khối lượng tính phí:**
>
> ```
> billableWeight = max(weight, weightConverted)
> ```
>
> **Ví dụ:**
>
> * `weight = 1500` (gram)
> * `packageDimensions`: length=40, width=30, height=20 (cm)
> * `weightConverted = (40 × 30 × 20) / 6 = 4000` (gram)
> * `billableWeight = max(1500, 4000) = 4000` (gram)
>
> **Mục đích:** Đảm bảo kiện hàng cồng kềnh (nhiều diện tích nhưng nhẹ) vẫn được tính phí hợp lý, tránh tình trạng vận chuyển kiện hàng lớn nhưng chỉ trả phí theo cân nặng thực tế.

### Carrier Extra Services

| Key             | Type   | Description                                                                         |
| --------------- | ------ | ----------------------------------------------------------------------------------- |
| allowTest       | bool   | Cho phép người nhận thử hàng trước khi thanh toán. Mặc định: `false`                |
| declaredSetting | bool   | Bật khai giá hàng hóa. Mặc định: `false`                                            |
| declaredAmount  | int    | Số tiền khai giá (VND). Mặc định: `0`. Chỉ có hiệu lực khi `declaredSetting = true` |
| declaredService | object | Cấu hình chi tiết dịch vụ khai giá (tùy hãng). Pass-through trực tiếp               |

* Không phải tất cả hãng vận chuyển đều hỗ trợ mọi dịch vụ bổ sung.

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

Các mã lỗi riêng của API này:

| Mã lỗi                        | Ý nghĩa                             |
| ----------------------------- | ----------------------------------- |
| ERR\_CANNOT\_CONNECT\_CARRIER | Lỗi kết nối với hãng vận chuyển     |
| ERR\_CARRIER\_RATE            | Lỗi khi tính phí từ hãng vận chuyển |

### Successful response

```json
{
  "code": 1,
  "data": [
    {
      "carrierId": "(int) ID hãng vận chuyển",
      "serviceId": "(int) ID dịch vụ trong hệ thống (dùng để đặt hàng sau này)",
      "serviceName": "(string) Tên dịch vụ hiển thị (VD: \"Siêu Tốc\", \"Giao hàng 4 giờ\")",
      "serviceCode": "(string) Mã dịch vụ từ hãng vận chuyển (VD: \"INSTANT\", \"SAME_DAY\")",
      "totalFee": "(int) Tổng phí vận chuyển từ hãng (chưa tính giảm giá, phụ phí setting). Đơn vị: VND",
      "shipFee": "(int) Phí ship gốc từ hãng. Đơn vị: VND",
      "customerShipFee": "(int) Phí khách hàng thực tế phải trả (đã tính KM, setting hệ thống). Đơn vị: VND",
      "totalCod": "(int) Số tiền thu hộ (COD). Đơn vị: VND",
      "logo": "(string) URL logo hãng vận chuyển",
      "totalPay": "(int) Tổng thanh toán = customerShipFee + totalCod. Đơn vị: VND",
      "serviceType": "(string) Loại dịch vụ (VD: \"INSTANT\", \"SAME_DAY\")",
      "serviceDescription": "(string) Mô tả chi tiết dịch vụ",
      "valuePromotionCode": "(int) Giá trị khuyến mãi / voucher đã áp dụng. Đơn vị: VND",
      "promoMessage": "(string) Thông báo về khuyến mãi (lỗi áp dụng KM, v.v.)"
    },
    {
      "carrierId": "(int) ID hãng vận chuyển",
      "serviceId": "(int) ID dịch vụ trong hệ thống",
      "serviceName": "(string) Tên dịch vụ hiển thị",
      "serviceCode": "(string) Mã dịch vụ từ hãng",
      "totalFee": "(int) Tổng phí vận chuyển từ hãng. Đơn vị: VND",
      "shipFee": "(int) Phí ship gốc từ hãng. Đơn vị: VND",
      "customerShipFee": "(int) Phí khách hàng thực tế phải trả. Đơn vị: VND",
      "totalCod": "(int) Số tiền thu hộ (COD). Đơn vị: VND",
      "logo": "(string) URL logo hãng vận chuyển"
    }
  ],
  "messages": [],
  "errorCode": null
}
```

> **Lưu ý:** Kết quả trả về là mảng các dịch vụ từ **tất cả các hãng** được yêu cầu (hoặc tất cả hãng instant delivery nếu không truyền `carrierIds`). Mỗi item trong mảng chứa thông tin phí của một dịch vụ cụ thể từ một hãng vận chuyển.




---

[Next Page](https://apidocs.nhanh.vn/llms-full.txt/1)



---
<!-- PAGE BREAK: PART 2 -->
---

> This is part 2 of 2 of the full documentation (pages 101–152 of 152).
> The content is paginated: fetch every part to see all of it.
> Previous part: https://apidocs.nhanh.vn/llms-full.txt
> Page index: https://apidocs.nhanh.vn/llms.txt

# Tạo đơn

* Tạo đơn hàng vận chuyển mới và lưu vào hệ thống.
* **Hỗ trợ:** Tạo đơn hàng đơn lẻ với thông tin người gửi, người nhận và kiện hàng.
* **Tùy chọn:** Nếu truyền `sendCarrier = 1`, hệ thống sẽ tự động gửi đơn sang hãng vận chuyển ngay sau khi lưu thành công.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/ship/create).

```curl
curl --location 'https://ship.open.nhanh.vn/v3.0/shipment/create?businessId={{businessId}}&appId={{appId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "businessStoreId": 123,
    "appOrderId": "13213123",
    "sender": {
        "name": "Nguyễn Văn A",
        "mobile": "0901234567",
        "shippingLocation": {
            "locationVer": "v2",
            "provinceId": 1,
            "wardId": 100,
            "address": "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
            "longitude": 105.804567,
            "latitude": 21.001234
        }
    },
    "receiver": {
        "name": "Trần Thị B",
        "mobile": "0912345678",
        "shippingLocation": {
            "locationVer": "v2",
            "provinceId": 48,
            "wardId": 12345,
            "address": "456 Lê Lợi, Hải Châu, Đà Nẵng",
            "longitude": 108.212345,
            "latitude": 16.067890
        }
    },
    "products": [
        {
            "name": "Áo thun cotton",
            "quantity": 2,
            "price": 150000,
            "weight": 300
        }
    ],
    "weight": 1500,
    "packageDimensions": {
        "width": 30,
        "height": 20,
        "length": 40
    },
    "codAmount": 650000,
    "description": "Thời trang nam nữ",
    "carrier": {
        "id": 18,
        "serviceId": 100,
        "promoCode": "GIAM10"
    },
    "carrierExtraServices": {
        "allowTest": true,
        "declaredSetting": true,
        "declaredAmount": 500000
    },
    "shipFeeBy": "sender",
    "sendCarrier": 1
}'
```

### Body

| Key                  | Type                        | Description                                                                                                                           |
| -------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| businessStoreId      | int $$^{\color{red}\*}$$    | ID cửa hàng của doanh nghiệp trên app của bạn                                                                                         |
| appOrderId           | string $$^{\color{red}\*}$$ | ID đơn hàng trên App của bạn                                                                                                          |
| sender               | object $$^{\color{red}\*}$$ | Thông tin người gửi. Xem [Sender](#sender)                                                                                            |
| receiver             | object $$^{\color{red}\*}$$ | Thông tin người nhận. Xem [Receiver](#receiver)                                                                                       |
| products             | array                       | Danh sách sản phẩm trong đơn hàng. Xem [Products](#products)                                                                          |
| weight               | int $$^{\color{red}\*}$$    | Khối lượng thực tế của đơn hàng (gram). Xem [Quy tắc tính khối lượng](#quy-tắc-tính-khối-lượng)                                       |
| packageDimensions    | object                      | Kích thước kiện hàng (cm). Xem [Package Dimensions](#package-dimensions)                                                              |
| codAmount            | int                         | Số tiền thu hộ (COD), đơn vị VND. Mặc định: `0`                                                                                       |
| description          | string                      | Mô tả đơn hàng                                                                                                                        |
| carrier              | object $$^{\color{red}\*}$$ | Thông tin hãng vận chuyển. Xem [Carrier](#carrier)                                                                                    |
| carrierExtraServices | object                      | Các dịch vụ bổ sung. Xem [Carrier Extra Services](#carrier-extra-services)                                                            |
| shipFeeBy            | string                      | Người trả phí: `"sender"` (mặc định) hoặc `"receiver"`                                                                                |
| sendCarrier          | int                         | Tự động gửi đơn sang hãng vận chuyển: `1` = có, `0`/`null` = không (mặc định). Xem [Gửi đơn sang hãng](#gửi-đơn-sang-hãng-vận-chuyển) |

### Carrier

Thông tin hãng vận chuyển và phí. **Lấy từ response của API** [**Tính cước phí**](/v3/ship/rate).

* **Lưu ý**: Sẽ có 2 trường hợp chênh lệch giá khi Tính cước phí và khi Tạo đơn hàng với dịch vụ INSTANT
  * *Trường hợp 1*: Nếu Đối tác gọi API Tính cước phí và gọi API Tạo đơn hàng ngay sau đó thì sẽ không có chênh lệch giá giữa 2 lần gọi
  * *Trường hợp 2*: Nếu thời điểm Đối tác gọi API Tính cước phí và Tạo đơn cách nhau một khoảng thời gian thì tại thời điểm tạo đơn, giá sẽ khác so với thời điểm Tính cước phí. Sự chênh lệch này phụ thuộc vào các yếu tố như thời tiết xấu, giờ cao điểm, ngày lễ,...

| Key       | Type                     | Description                                                                                                   |
| --------- | ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| id        | int $$^{\color{red}\*}$$ | ID hãng vận chuyển. Xem [Supported Carriers](/v3/ship/list)                                                   |
| serviceId | int                      | ID dịch vụ vận chuyển. **Lấy từ field `serviceId` trong response của API** [**Tính cước phí**](/v3/ship/rate) |
| promoCode | string                   | Mã khuyến mãi/voucher                                                                                         |

### Lấy giá từ Rate

Các params về phí vận chuyển **được lấy từ response của API** [**Tính cước phí**](/v3/ship/rate) ( `POST /v3.0/shipment/rate`).

**Luồng thực hiện:**

```
1. Gọi POST /v3.0/shipment/rate
   ↓
2. Response trả về danh sách dịch vụ:
   [
     {
       "carrierId": 18,
       "serviceId": 100,
       "promoCode": "GIAM10"
     }
   ]
   ↓
3. User chọn 1 dịch vụ
   ↓
4. Gọi POST /v3.0/shipment/create với các giá trị đã lấy
```

> **Quan trọng:** Nên gọi API [Tính cước phí](/v3/ship/rate) trước để lấy `carrier.serviceId`.

### Declared Fee

| Giá trị        | Ý nghĩa                                                         |
| -------------- | --------------------------------------------------------------- |
| `0` (mặc định) | Không khai giá hàng hóa                                         |
| `> 0`          | Số tiền khai giá (VD: `500000` = khai hàng trị giá 500,000 VND) |

**Khi nào dùng:**

* Cần bảo hiểm hàng hóa cho kiện có giá trị cao
* Hãng vận chuyển yêu cầu khai giá cho hàng hóa đặc biệt
* Khi bật `carrierExtraServices.declaredSetting = true`

### Sender

| Key              | Type                        | Description                                                   |
| ---------------- | --------------------------- | ------------------------------------------------------------- |
| name             | string $$^{\color{red}\*}$$ | Tên người gửi                                                 |
| mobile           | string $$^{\color{red}\*}$$ | Số điện thoại người gửi                                       |
| shippingLocation | object                      | Địa chỉ lấy hàng. Xem [Shipping Location](#shipping-location) |

### Receiver

| Key              | Type                        | Description                                                    |
| ---------------- | --------------------------- | -------------------------------------------------------------- |
| name             | string $$^{\color{red}\*}$$ | Tên người nhận                                                 |
| mobile           | string $$^{\color{red}\*}$$ | Số điện thoại người nhận                                       |
| shippingLocation | object                      | Địa chỉ giao hàng. Xem [Shipping Location](#shipping-location) |

### Shipping Location

Đối tượng mô tả địa điểm (dùng cho cả sender và receiver).

> * `locationVer` của **sender** và **receiver** phải giống nhau (cùng là `"v1"` hoặc cùng là `"v2"`).
> * Nếu dùng `locationVer = "v1"`: bắt buộc truyền đủ `provinceId`, `districtId`, `wardId`.
> * Nếu dùng `locationVer = "v2"`: chỉ cần `provinceId` và `wardId` (không bắt buộc `districtId`).
> * Nếu không truyền `locationVer`: mặc định là `"v2"`.
> * longitude, latitude bắt buộc khi dùng dịch vụ Instant

| Key         | Type                        | Description                                                                                                                            |
| ----------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| locationVer | string                      | Phiên bản dữ liệu địa chỉ: `"v1"` (3 cấp: provinceId + districtId + wardId) hoặc `"v2"` (2 cấp: provinceId + wardId). Mặc định: `"v2"` |
| provinceId  | int $$^{\color{red}\*}$$    | ID tỉnh/thành phố                                                                                                                      |
| districtId  | int $$^{\color{red}\*}$$    | ID quận/huyện                                                                                                                          |
| wardId      | int $$^{\color{red}\*}$$    | ID phường/xã                                                                                                                           |
| address     | string $$^{\color{red}\*}$$ | Địa chỉ chi tiết (số nhà, tên đường)                                                                                                   |
| longitude   | number                      | Kinh độ (dùng thay thế cho provinceId/districtId/wardId) (                                                                             |
| latitude    | number                      | Vĩ độ (dùng thay thế cho provinceId/districtId/wardId)                                                                                 |

### Products

* Cấu trúc `products` được pass-through trực tiếp đến từng hãng vận chuyển. Các field con có thể khác nhau tùy hãng.

| Key      | Type   | Description                  |
| -------- | ------ | ---------------------------- |
| name     | string | Tên sản phẩm                 |
| quantity | int    | Số lượng. Mặc định: `1`      |
| price    | number | Đơn giá sản phẩm (VND)       |
| weight   | int    | Khối lượng 1 sản phẩm (gram) |

### Package Dimensions

| Key    | Type | Description               |
| ------ | ---- | ------------------------- |
| width  | int  | Chiều rộng kiện hàng (cm) |
| height | int  | Chiều cao kiện hàng (cm)  |
| length | int  | Chiều dài kiện hàng (cm)  |

### Quy tắc tính khối lượng

Xem [Quy tắc tính khối lượng quy đổi](/v3/ship/rate#package-dimensions) trong tài liệu Rate API.

### Carrier Extra Services

| Key             | Type   | Description                                                                         |
| --------------- | ------ | ----------------------------------------------------------------------------------- |
| allowTest       | bool   | Cho phép người nhận thử hàng trước khi thanh toán. Mặc định: `false`                |
| declaredSetting | bool   | Bật khai giá hàng hóa. Mặc định: `false`                                            |
| declaredAmount  | int    | Số tiền khai giá (VND). Mặc định: `0`. Chỉ có hiệu lực khi `declaredSetting = true` |
| declaredService | object | Cấu hình chi tiết dịch vụ khai giá (tùy hãng). Pass-through trực tiếp               |

### Gửi đơn sang hãng vận chuyển

Khi truyền `sendCarrier = 1`:

1. Hệ thống lưu đơn hàng vào database thành công.
2. Ngay sau đó, hệ thống tự động gửi đơn sang hãng vận chuyển đã chọn (`carrier.id`).
3. Kết quả gửi sang hãng sẽ được trả về trong response cùng với `orderId`.

> **Lưu ý:**
>
> * Để gửi đơn thành công, cần đảm bảo `carrier.id` và `carrier.serviceId` hợp lệ (nên lấy từ API Rate).
> * Nếu gửi sang hãng thất bại nhưng đơn đã lưu thành công, response vẫn trả về `code: 1` với `orderId`, kèm thông báo lỗi trong `sendCarrierError`.

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

### Successful response

**Không gửi sang hãng (`sendCarrier = 0` hoặc không truyền):**

```json
{
  "code": 1,
  "data": {
    "orderId": "(int) ID đơn hàng trong hệ thống"
  },
  "messages": []
}
```

**Gửi sang hãng thành công (`sendCarrier = 1`):**

```json
{
  "code": 1,
  "data": {
    "orderId": " (int) ID đơn hàng trong hệ thống",
    "orderCode": "(string) Mã vận đơn trong hệ thống",
    "carrier": {
      "code": "(string) Mã vận đơn hãng vận chuyển",
      "totalFee": "(int) Phí ship",
      "declaredFee": "(int) Phí khai giá",
      "codFee": "(int) Phí thu tiền hộ"
    }
  },
  "messages": []
}
```

**Gửi sang hãng thất bại (`sendCarrier = 1` nhưng hãng trả lỗi):**

```json
{
  "code": 1,
  "data": {
    "orderId": "(int) ID đơn hàng trong hệ thống",
    "sendCarrierError": [
      "(string) Thông báo lỗi từ hãng vận chuyển"
    ]
  },
  "messages": [],
  "errorCode": null
}
```

> **Lưu ý:**
>
> * Response trả về `code: 1` (thành công) ngay cả khi gửi sang hãng thất bại, vì đơn hàng đã được lưu vào hệ thống thành công.
> * Client nên kiểm tra field `sendCarrierError` để biết có lỗi khi gửi sang hãng không.
> * Có thể gọi lại API [Gửi đơn sang hãng](/v3/ship/send) sau để thử gửi lại.


# Gửi đơn

* Gửi đơn hàng đã tạo trước đó sang hãng vận chuyển để lấy mã vận đơn.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/ship/send).

```curl
curl --location 'https://ship.open.nhanh.vn/v3.0/shipment/send?businessId={{businessId}}&appId={{appId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "orderId": 12345
}'
```

### Body

| Key     | Type                     | Description                         |
| ------- | ------------------------ | ----------------------------------- |
| orderId | int $$^{\color{red}\*}$$ | ID đơn hàng trong hệ thống từ Nhanh |

## Luồng thực hiện

```
1. Tạo đơn hàng: POST /v3.0/shipment/create (sendCarrier = 0)
   ↓
2. Nhận response với orderId
   ↓
3. Gửi đơn sang hãng: POST /v3.0/shipment/send
   ↓
4. Nhận response với carrierCode (mã vận đơn)
```

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

Các mã lỗi riêng của API này:

| Mã lỗi                        | Ý nghĩa                                           |
| ----------------------------- | ------------------------------------------------- |
| ERR\_INVALID\_DATA            | Không tìm thấy đơn hàng với orderId và businessId |
| ERR\_ORDER\_EXISTED           | Đơn hàng đã được gửi sang hãng trước đó           |
| ERR\_CARRIER\_SEND\_ORDER     | Lỗi khi gửi đơn sang hãng vận chuyển              |
| ERR\_CANNOT\_CONNECT\_CARRIER | Lỗi kết nối với hãng vận chuyển                   |

* Với mã lỗi ERR\_ORDER\_EXISTED thì response sẽ trả về data bao gồm thông tin đơn hàng đã có bên hãng vận chuyển

### Successful response

```json
{
  "code": 1,
  "data": {
    "orderId": "(int) ID đơn hàng trong hệ thống",
    "carrierCode": "(string) Mã vận đơn từ hãng vận chuyển",
    "createdDate": "(string) Ngày tạo đơn (YYYY-MM-DD HH:ii:ss)"
  },
  "messages": [],
  "errorCode": null
}
```

## Ví dụ

### Bước 1: Tạo đơn (không gửi)

```bash
curl --location 'https://ship.open.nhanh.vn/v3.0/shipment/create?businessId={{businessId}}&appId={{appId}}' \
--header 'Authorization: Bearer {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "businessStoreId": 123,
    "sender": {
        "name": "Nguyễn Văn A",
        "mobile": "0901234567",
        "shippingLocation": {
            "provinceId": 1,
            "wardId": 100,
            "address": "123 Nguyễn Trãi, Hà Nội",
            "longitude": 105.804567,
            "latitude": 21.001234
        }
    },
    "receiver": {
        "name": "Trần Thị B",
        "mobile": "0912345678",
        "shippingLocation": {
            "provinceId": 48,
            "wardId": 12345,
            "address": "456 Lê Lợi, Đà Nẵng"
        }
    },
    "weight": 1500,
    "carrierId": 18,
    "carrierServiceId": 100,
    "totalFee": 25000,
    "shipFee": 25000,
    "customerShipFee": 22000,
    "totalCod": 650000,
    "sendCarrier": 0
}'
```

**Response:**

```json
{
  "code": 1,
  "data": {
    "orderId": 12345,
    "createdDate": "2024-08-25 10:30:00",
    "appId": 1
  },
  "messages": [],
  "errorCode": null
}
```

### Bước 2: Gửi đơn sang hãng

```bash
curl --location 'https://ship.open.nhanh.vn/v3.0/shipment/send?businessId={{businessId}}&appId={{appId}}' \
--header 'Authorization: Bearer {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "orderId": 12345
}'
```

**Response:**

```json
{
  "code": 1,
  "data": {
    "orderId": 12345,
    "carrierCode": "AHM-2024082512345678",
    "createdDate": "2024-08-25 10:30:00"
  },
  "messages": [],
  "errorCode": null
}
```


# Hủy đơn

* Hủy đơn hàng đã tạo hoặc đã gửi sang hãng vận chuyển.
* Đơn hàng cần có `orderId` để truy xuất thông tin.

## Request

* Xem [common request params](/v3#request-params).
* Xem [Postman sample](/v3/ship/cancel).

```curl
curl --location 'https://ship.open.nhanh.vn/v3.0/shipment/cancel?businessId={{businessId}}&appId={{appId}}' \
--header 'Authorization: {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "orderId": 12345,
    "cancelReason": "Khách hàng yêu cầu hủy"
}'
```

### Body

| Key          | Type                     | Description                |
| ------------ | ------------------------ | -------------------------- |
| orderId      | int $$^{\color{red}\*}$$ | ID đơn hàng trong hệ thống |
| cancelReason | string                   | Lý do hủy đơn (optional)   |

## Luồng thực hiện

```
1. Tạo đơn hàng: POST /v3.0/shipment/create
   ↓
2. (Tùy chọn) Gửi đơn sang hãng: POST /v3.0/shipment/send
   ↓
3. Hủy đơn: POST /v3.0/shipment/cancel
   ↓
4. Nhận response xác nhận hủy
```

> **Lưu ý:**
>
> * Đơn hàng chưa gửi sang hãng: hủy trực tiếp trong hệ thống.
> * Đơn hàng đã gửi sang hãng: hệ thống sẽ gọi API hủy của hãng vận chuyển tương ứng.

## Trạng thái đơn hàng

| Trạng thái                | Giá trị | Mô tả                     |
| ------------------------- | ------- | ------------------------- |
| STATUS\_NEW               | 54      | Đơn mới tạo               |
| STATUS\_CARRIER\_CANCELED | 58      | Hãng vận chuyển đã hủy    |
| STATUS\_CANCELED          | 63      | Khách hàng/người dùng hủy |
| STATUS\_ABORTED           | 64      | Hệ thống hủy              |

## Response

* Xem cấu trúc chung [tại đây](/v3#response).

### Failed response

* Xem các mã lỗi chung [tại đây](/v3#failed-response).

Các mã lỗi riêng của API này:

| Mã lỗi                        | Ý nghĩa                                           |
| ----------------------------- | ------------------------------------------------- |
| ERR\_INVALID\_DATA            | Không tìm thấy đơn hàng với orderId và businessId |
| ERR\_CARRIER\_CANCEL\_ORDER   | Lỗi khi hủy đơn trên hãng vận chuyển              |
| ERR\_CANNOT\_CONNECT\_CARRIER | Lỗi kết nối với hãng vận chuyển                   |

### Successful response

```json
{
  "code": 1,
  "data": {
    "orderId": "(int) ID đơn hàng trong hệ thống",
    "status": "(int) Trạng thái mới của đơn hàng",
    "statusName": "(string) Tên trạng thái (VD: 'Khách hủy')",
    "createdDate": "(string) Ngày tạo đơn (YYYY-MM-DD HH:ii:ss)"
  },
  "messages": [],
  "errorCode": null
}
```

## Ví dụ

### Bước 1: Tạo đơn và gửi sang hãng

```bash
# Tạo đơn
curl --location 'https://ship.open.nhanh.vn/v3.0/shipment/create' \
--header 'Authorization: Bearer {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "businessStoreId": 123,
    "sender": {
        "name": "Nguyễn Văn A",
        "mobile": "0901234567",
        "shippingLocation": {
            "provinceId": 1,
            "wardId": 100,
            "address": "123 Nguyễn Trãi, Hà Nội",
            "longitude": 105.804567,
            "latitude": 21.001234
        }
    },
    "receiver": {
        "name": "Trần Thị B",
        "mobile": "0912345678",
        "shippingLocation": {
            "provinceId": 48,
            "wardId": 12345,
            "address": "456 Lê Lợi, Đà Nẵng"
        }
    },
    "weight": 1500,
    "carrierId": 18,
    "carrierServiceId": 100,
    "totalFee": 25000,
    "shipFee": 25000,
    "customerShipFee": 22000,
    "totalCod": 650000,
    "sendCarrier": 1
}'
```

### Bước 2: Hủy đơn hàng

```bash
curl --location 'https://ship.open.nhanh.vn/v3.0/shipment/cancel?businessId={{businessId}}&appId={{appId}}' \
--header 'Authorization: Bearer {{accessToken}}' \
--header 'Content-Type: application/json' \
--data '{
    "orderId": 12345,
    "cancelReason": "Khách hàng yêu cầu hủy đơn"
}'
```

**Response:**

```json
{
  "code": 1,
  "data": {
    "orderId": 12345,
    "status": 63,
    "statusName": "Khách hủy",
    "createdDate": "2024-08-25 10:30:00"
  },
  "messages": [],
  "errorCode": null
}
```


# Cài đặt

* Webhooks giúp bạn đăng kí lắng nghe các sự kiện phát sinh từ hệ thống của Nhanh.vn, VD:
  * Khi có đơn hàng mới, khi đơn gửi sang hãng vận chuyển, khi đơn hàng thay đổi trạng thái.
  * Khi có sản phẩm mới, khi có cập nhật sản phẩm, khi xóa sản phẩm.
  * Khi có hóa đơn bán hàng mới.
  * Khi có phiếu bảo hành mới.

## Enable webhooks

* Vào [danh sách ứng dụng](https://open.nhanh.vn/apps), click vào tên ứng dụng để vào trang chi tiết.
* Click sửa ứng dụng, kéo xuống mục webhooks:
  * Tích chọn Bật webhooks.
  * Chọn Webhooks version: 3.0
  * Điền Webhooks callback URL (bắt buộc chạy https và response http code = 200 và hỗ trợ POST method).
  * Điền Webhooks verify token (giá trị này do bạn tự điền, Nhanh API sẽ gửi kèm header Authorization khi bắn webhooks để bạn có thể xác minh dữ liệu là từ Nhanh API bắn sang).
  * Chọn các sự kiện muốn đăng kí nhận webhooks và nhấn Lưu.

![Bật Webhooks](https://2299560279-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FkqD6qBCDVbHh0yciWW1F%2Fuploads%2Fgit-blob-156de3b0d626064ff23817cc755d3c9d006ae09f%2FwebhooksVerifyToken.png?alt=media)

{% hint style="danger" %}
**Chú ý**: Bạn chỉ nên bật webhooks và điền **Webhooks callback URL** khi bạn đã có link này, không để link liên tục ở tình trạng lỗi (301, 302, 403, 404, 500...) để tránh bị tắt webhooks hoặc khóa app.
{% endhint %}

* Nhanh API sẽ gửi request **webhooksEnabled** tới Webhooks callback URL của bạn để kiểm tra xem URL này có hoạt động hay không.

```curl
curl --location --request POST 'https://APP_WEBHOOKS_CALLBACK_URL' \
--header 'Content-Type: application/json' \
--header 'Authorization: APP_WEBHOOKS_VERIFY_TOKEN' \
--data-raw '{
    "event": "webhooksEnabled"
}'
```

## Listen webhooks

* Với mỗi sự kiện Nhanh API sẽ gửi sang 1 request:
  * Method: POST
  * Header 'Content type: application/json' và 'Authorization: APP\_WEBHOOKS\_VERIFY\_TOKEN'.
  * Request body là json string.

### Webhooks data

* Dữ liệu webhooks sẽ bao gồm các thông tin sau
  * event: (string) Tên sự kiện. Xem thêm [bảng Webhooks events bên dưới](#webhooks-events).
  * businessId: (bigint) ID doanh nghiệp trên nhanh.vn, dùng khi ứng dụng của bạn tích hợp cho nhiều doanh nghiệp, thì businessId giúp phân biệt dữ liệu của doanh nghiệp nào.
  * data: (json string) Dữ liệu của sự kiện này.
* VD về sự kiện khi có đơn hàng mới:

```curl
curl --location --request POST 'https://APP_WEBHOOKS_CALLBACK_URL' \
--header 'Content-Type: application/json' \
--header 'Authorization: APP_WEBHOOKS_VERIFY_TOKEN' \
--data-raw '{
    "event": "orderAdd",
    "businessId": 64692,
    "data": {
        "customer": {
			"id": 123,
			"name": "Customer name"
		},
        "products": [
        	{ },
			{ }
        ]
    }
}'
```

### Webhooks events

| Event                                              | Description                                                                                                                                                                         |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webhooksEnabled                                    | Sự kiện khi bạn bật webhooks hoặc NhanhAPI kiểm tra webhooks của bạn có còn hoạt động hay không (thường dùng khi tỉ lệ phản hồi response webhooks của bạn có tỉ lệ thành công thấp) |
| [appUninstalled](/v3/webhooks/app#app-uninstalled) | Sự kiện này phát sinh khi doanh nghiệp gỡ app của bạn                                                                                                                               |
| productAdd                                         | Thêm sản phẩm mới                                                                                                                                                                   |
| productUpdate                                      | Cập nhật sản phẩm                                                                                                                                                                   |
| productDelete                                      | Xóa sản phẩm                                                                                                                                                                        |
| inventoryChange                                    | Thay đổi tồn kho của sản phẩm                                                                                                                                                       |
| [orderAdd](/v3/webhooks/order#order-add)           | Thêm đơn hàng mới                                                                                                                                                                   |
| [orderUpdate](/v3/webhooks/order#order-update)     | Cập nhật đơn hàng                                                                                                                                                                   |
| [orderDelete](/v3/webhooks/order#order-delete)     | Xóa đơn hàng                                                                                                                                                                        |

### Webhooks response

* Hệ thống của bạn cần response http code 200 để NhanhAPI xác nhận bạn đã xử lý thành công.
* Nếu hệ thống của bạn không phản hồi quá chậm, hoặc http code != 200, webhooks sẽ được bắn lại tối đa 3 lần.
  * Khi app của bạn xử lý webhooks chậm hoặc hay lỗi, Nhanh.vn sẽ đẩy độ ưu tiên cho app của bạn xuống thấp, các request webhooks tiếp theo có thể sẽ bị delay.
  * Khuyến cáo bạn nên lưu webhooks và response cho Nhanh.vn trước, rồi tạo cronjob xử lý webhooks sau.
* Nếu hệ thống của bạn xử lý webhooks với **tỉ lệ thành công thấp**, tùy mức độ, NhanhAPI sẽ có thể:
  * Gọi lại sự kiện webhooksEnabled để kiểm tra link webhooks của bạn có hoạt động hay không.
  * Tắt webhooks của app: Bạn cần làm lại các bước bật webhooks như đã mô tả ở trên để mở lại webhooks.
  * Khóa app: Bạn cần liên hệ email <dev@nhanh.vn> để được hỗ trợ mở lại app.

## Common webhooks errors

* Khi nhận webhooks từ NhanhAPI bắn sang, bạn có thể gặp phải các tình huống lỗi, xem chi tiết lỗi và cách khắc phục bên dưới:

{% hint style="danger" %}
**Chú ý**: Webhooks sẽ chỉ bắn với các dữ liệu mới, các dữ liệu quá khứ (phát sinh trước thời điểm app được cấp quyền hoặc bật webhooks) sẽ không có sự kiện bắn lại.
{% endhint %}

### App chưa được cấp quyền

* Khi bạn bật được webhooks lên và nhận được sự kiện **webhooksEnabled**, đây chỉ là webhooks test của hệ thống.
* Để nhận được webhooks của doanh nghiệp, thì app của bạn cần được 1 tài khoản thuộc doanh nghiệp đó đăng nhập cấp quyền cho ứng dụng của bạn và bạn cần lấy được accessToken. Xem các bước khởi tạo ứng dụng và đăng nhập cấp quyền [tại đây](https://apidocs.nhanh.vn/app#register-app).
* Bạn cần vào trang [Cài đặt](https://nhanh.vn/setting/store/index) > Tìm tới mục **Cài đặt Open API**, nhìn thấy appId đã hiện ở danh sách API đang kết nối, thì mới xong việc đăng nhập cấp quyền và bắt đầu nhận được sự kiện webhooks.
* Ở các trang như chi tiết đơn hàng, chi tiết sản phẩm... sẽ có 1 tab API lưu lại tất cả lịch sử nhận API request và gửi webhooks, xin vui lòng kiểm tra kĩ dữ liệu trước khi báo lỗi. VD bạn có thể tạo 1 đơn hàng mới, hoặc cập nhật trạng thái đơn hàng, sau đó xem trang chi tiết đơn hàng sẽ có 1 tab API, bạn có thể xem nội dung webhooks Nhanh bắn sang cho app của bạn.

### Connection timed out

* Lỗi này có thể do nhiều nguyên nhân:
  * Tên miền không hoạt động.
  * Server của bạn bị lỗi hoặc phản hồi quá chậm.
  * Firewall của bạn chặn các request từ Nhanh API.

### Redirects 301 302

* Lỗi thường gặp khi Webhooks callback URL của bạn response 301, 302 điều hướng sang 1 URL khác. VD URL yêu cầu login, và có thể khi bạn test, bạn đã login vào URL này, nên không phát hiện ra lỗi.
* Khi bạn test bằng Postman, mặc định Postman sẽ bật **Automatically follow redirects**, bạn cần tắt cài đặt này đi, nếu không khi tự test sẽ thấy http code trả về 200 nhưng thực tế đang trả về 301 / 302. Có 2 cách tắt:
* **Cách 1**: Tắt cho toàn bộ request: Vào menu File > Settings > Tắt: Automatically follow redirects

![Postman: Tắt toàn bộ Automatically follow redirects](https://2299560279-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FkqD6qBCDVbHh0yciWW1F%2Fuploads%2Fgit-blob-490dfe91010074c81728de12bbddcd9724c506cf%2FwebhooksPostmanSettings_TurnOffFollowLocation_All.jpg?alt=media)

* **Cách 2**: Tắt từng tab request: chọn Settings và tắt Automatically follow redirects

![Postman: Tắt từng tab Automatically follow redirects](https://2299560279-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FkqD6qBCDVbHh0yciWW1F%2Fuploads%2Fgit-blob-15521f9e6209ccac8b35985955b20ecccfc62ef1%2FwebhooksPostmanSettings_TurnOffFollowLocation_Tab.jpg?alt=media)

### Wordpress plugin Wordfence

* Nếu bạn dùng **Wordpress** và có cài plugin [Wordfence](https://www.wordfence.com/help/blocking/troubleshooting/#what-is-wordfence) thì có thể bị lỗi trả về http code 503 và không bật được webhooks hoặc nhận webhooks từ Nhanh.vn bắn sang bị chập chờn.
* Cách khắc phục: Gỡ plugin này khỏi Wordpress.

### Lỗi mất webhooks

* Tình huống: Trước đó bạn đã cài đặt và sử dụng webhooks bình thường, sau đó không thấy nhận được webhooks nữa.
* Nguyên nhân có thể rơi các các tình huống bên dưới, bạn cần đọc kỹ và kiểm tra từng trường hợp:
  * Đường link nhận webhooks đang bị lỗi: Bạn có thể tự dùng Postman post lên link nhận webhooks để kiểm tra.
  * Bạn có thể xem lịch sử webhooks ở các trang chi tiết đơn hàng, chi tiết sản phẩm trên Nhanh.vn, có tab API.
  * Khi Nhanh gửi request **webhooksEnabled** tới Webhooks callback URL của bạn để kiểm tra xem URL này có hoạt động hay không, webhooks của bạn không phản hồi sự kiện này.
  * App đã tắt webhooks hoặc bị Nhanh tự động tắt do không truy cập được hoặc tỉ lệ thành công thấp: Bạn có thể vào <https://open.nhanh.vn> vào mục cài đặt app để kiểm tra.
  * Toàn bộ accessToken đã hết hạn hoặc [App đã bị doanh nghiệp gỡ](/v3/webhooks/app#app-uninstalled):
    * Chú ý: accessToken chỉ có hạn sử dụng 1 năm, khi gần hết hạn, app của bạn cần cảnh báo doanh nghiệp cấp quyền để lấy accessToken mới.
    * Cách kiểm tra:
      * Doanh nghiệp có thể vào mục **Cài đặt** > [**Cài đặt chung**](https://nhanh.vn/setting/store/index) > Cài đặt Open API để kiểm tra xem có còn kết nối với appId không, hạn accessToken tới ngày nào.
      * Developer có thể dùng [API Kiểm tra accessToken](https://apidocs.nhanh.vn/app#kiem-tra-access-token).
    * Cách sửa: Cần thực hiện lại việc [đăng nhập cấp quyền](https://apidocs.nhanh.vn/app#lay-access-token) lấy accessToken mới.


# App

* Các sự kiện liên quan tới ứng dụng

## App uninstalled

* Sự kiện này phát sinh khi doanh nghiệp gỡ app của bạn: app sẽ không thể gọi API lấy dữ liệu của doanh nghiệp nữa.
* Muốn tiếp tục sử dụng API, doanh nghiệp cần thực hiện lại việc [đăng nhập cấp quyền](https://apidocs.nhanh.vn/app#lay-access-token) cho app của bạn.

```json
{
    "event": "appUninstalled",
    "businessId": 64692
}
```


# Đơn hàng

* Khi có đơn hàng mới hoặc trạng thái đơn hàng có thay đổi, Nhanh.vn sẽ bắn webhooks về cho hệ thống của bạn.
* Cấu trúc dữ liệu sẽ giống với thông tin 1 đơn hàng khi bạn gọi API lấy [danh sách đơn hàng](/v3/order/list).
* Trên trang quản trị Nhanh.vn, bạn có thể vào trang chi tiết của 1 đơn hàng, tab API để xem lịch sử webhooks của đơn hàng đó.
* Để nhận được webhooks thêm, sửa, xóa đơn hàng, app phải có quyền lấy danh sách đơn hàng.
* Xem cấu trúc chung của webhooks [tại đây](/v3/webhooks/webhooks#listen-webhooks).

## Order add

* `data` xem thêm ở [bảng bên dưới](#order-information).

```json
{
    "event": "orderAdd",
    "businessId": 10000,
    "data": {}
}
```

## Order update

* `data` xem thêm ở [bảng bên dưới](#order-information).

```json
{
    "event": "orderUpdate",
    "businessId": 10000,
    "data": {}
}
```

## Order delete

* `data` sẽ chứa mảng orderId đã bị xóa.

```json
{
    "event": "orderDelete",
    "businessId": 10000,
    "data": [12345, 12346]
}
```

## Order partial return

* Khi trả hàng 1 phần hoặc thao tác nhập hoàn kho đối với đơn sàn sẽ phát sinh webhook này.
* Đối với đơn trả hàng 1 phần sẽ có thông tin originalOrder (đơn gốc) trả về ở response
* `data` xem thêm ở [bảng bên dưới](#order-information).

```json
{
    "event": "orderPartialReturn",
    "businessId": 10000,
    "data": {}
}
```

## Order information

* Thông tin đơn hàng

```json
{
  "info": {
    "id": "(int) ID đơn hàng",
    "depotId": "(int) ID kho hàng",
    "pickupDepotId": "(int) ID kho nhặt hàng",
    "type": "(int) Loại đơn",
    "status": "(int) Trạng thái",
    "createdBy": {
      "id": "(int) ID người tạo đơn",
      "name": "(string) Tên người tạo đơn"
    },
    "sale": {
      "id": "(int) ID nhân viên bán hàng",
      "name": "(string) Tên nhân viên bán hàng"
    },
    "technicalStaff": {
      "id": "(int) ID nhân viên kỹ thuật",
      "name": "(string) Tên nhân viên kỹ thuật"
    },
    "customerCare": {
      "id": "(int) ID nhân viên chăm sóc",
      "name": "(string) Tên nhân viên chăm sóc"
    },
    "createdAt": "(int) Thời gian tạo",
    "updatedAt": "(int) Thời gian cập nhật",
    "confirmedAt": "(int) Thời gian xác nhận",
    "packedAt": "(int) Thời gian đóng gói",
    "description": "(string) Ghi chú khách hàng",
    "privateDescription": "(string) Ghi chú chăm sóc khách hàng",
    "trackingUrl": "(string) Link xem lịch trình đơn hàng"
  },
  "channel": {
    "appOrderId": "(string) ID website tích hợp",
    "appShopId": "(string) ID shop trên website tích hợp",
    "appShopName": "(string) Tên shop trên website tích hợp",
    "saleChannel": "(int) Kênh bán",
    "trafficSource": {
      "id": "(int) ID nguồn đơn hàng",
      "name": "(string) Tên nguồn đơn hàng"
    },
    "facebook": {
      "pageId": "(string) ID page",
      "conversationId": "(string) ID cuộc trò chuyện",
      "adId": "(string) ID Ads",
      "postId": "(string) ID bài viết"
    },
    "utmCampaign": "(string) Chiến dịch",
    "domain": "(string) Tên miền"
  },
  "shippingAddress": {
    "id": "(string) ID khách hàng",
    "name": "(string) Tên khách hàng",
    "mobile": "(string) Số điện thoại",
    "email": "(string) Email",
    "address": "(string) Địa chỉ",
    "cityId": "(int) ID Tỉnh/Thành phố",
    "districtId": "(int) ID Quận/Huyện",
    "wardId": "(int) ID Phường/xã",
    "locationVersion": "(string) v1: Địa chỉ 3 cấp, v2: Địa chỉ 2 cấp"
  },
  "products": [
    {
      "id": "(int) ID sản phẩm",
      "typeId": "(int) Loại sản phẩm",
      "code": "(string) Mã sản phẩm",
      "name": "(string) Tên sản phẩm",
      "avatar": "(string) Ảnh đại diện",
      "weight": "(double) Trọng lượng",
      "quantity": "(double) Số lượng",
      "price": "(double) Giá bán",
      "originalPrice": "(double) Giá bán gốc",
      "discount": "(double) Số tiền chiết khấu",
      "available": "(double) Số có thể bán",
      "avgCost": "(double) Giá vốn",
      "vat": {
        "value": "(int) Giá trị VAT",
        "amount": "(double) Số tiền VAT"
      },
      "description": "(string) Ghi chú sản phẩm",
      "imei": {
          "id": "(id) ID IMEI",
          "code": "(string) Số IMEI"
      },
      "batch": {
        "id": "(int) ID lô hàng",
        "name": "(string) Tên lô hàng",
        "manufactureDate": "(string) Ngày sản xuất",
        "expiredDate": "(string) Ngày hết hạn"
      },
      "combos": [
        {
          "id": "(int) ID sản phẩm",
          "name": "(string) Tên sản phẩm",
          "quantity": "(int) Số lượng"
        }
      ],
      "unit": {
        "id": "(int) ID đơn vị tính",
        "name": "(string) Tên đơn vị tính",
        "quantity": "(int) Số lượng"
      },
      "gifts": [
        {
          "id": "(int) ID sản phẩm",
          "name": "(string) Tên sản phẩm",
          "quantity": "(int) Số lượng"
        }
      ]
    }
  ],
  "carrier": {
    "id": "(int) ID hãng vận chuyển",
    "name": "(string) Tên hãng vận chuyển",
    "orderPackageSize": {
      "height": "(int) Chiều cao gói hàng",
      "merge": "(int) 1: Gộp đơn hàng, 0: Không gộp đơn",
      "length": "(int) Chiều dài gói hàng",
      "weight": "(int) Tổng trọng lượng gói hàng",
      "width": "(int) Chiều rộng gói hàng"
    },
    "service": {
      "id": "(int) ID dịch vụ vận chuyển",
      "name": "(string) Tên dịch vụ vận chuyển",
      "code": "(string) Mã dịch vụ vận chuyển"
    },
    "carrierCode": "(string) Mã vận đơn hãng vận chuyển",
    "isPartDelivery": "(int) 1: Giao hàng một phần",
    "sendCarrier": {
      "type": "(int) Loại kết nối",
      "date": "(string) Ngày gửi vận chuyển"
    },
    "deliveryDate": "(string) Ngày giao hàng thành công",
    "weight": "(int) Trọng lượng",
    "shipFee": "(int) Phí vận chuyển",
    "codFee": "(int) Phí thu tiền hộ",
    "declaredFee": "(int) Phí khai giá",
    "returnFee": "(int) Phí hoàn hàng",
    "customerShipFee": "(int) Phí ship báo khách"
  },
  "payment": {
    "couponCode": "(string) Mã giảm giá",
    "credit": {
      "amount": "(int) Tiền quẹt thẻ",
      "accountId": "(int) ID tài khoản kế toán",
      "code": "(string) Mã quẹt thẻ"
    },
    "deposit": {
      "amount": "(int) Tiền đặt cọc",
      "accountId": "(int) ID tài khoản kế toán"
    },
    "discount": {
      "type": "(string) Loại chiết khấu",
      "amount": "(int) Số tiền chiết khấu"
    },
    "transfer": {
      "amount": "(int) Tiền chuyển khoản",
      "accountId": "(int) ID tài khoản kế toán"
    },
    "usedPoints": {
      "points": "(int) Số điểm đã tiêu",
      "amount": "(int) Số tiền đã tiêu"
    },
    "vat": {
      "type": "(string) Loại VAT. cash: Tiền mặt, percent: Phần trăm",
      "value": "(int) Giá trị VAT. VD: 10, nếu type = percent thì hiểu là 10%",
      "amount": "(int) Số tiền VAT. VD: 10000 => Số tiền VAT, tình huống type = cash thì value sẽ bằng amount",
      "taxCode": "(string) Số hóa đơn VAT",
      "taxDate": "(string) Ngày xuất hóa đơn (định dạng năm-tháng-ngày)"
    }
  },
  "originalOrder": { 
    "id": "(int) ID đơn gốc",
    "channel": {
        "appOrderId": "(string) ID đơn sàn / ID đơn website tích hợp",
        "appShopId": "(string) ID Shop trên sàn (nếu có)",
        "saleChannel" : "(int) Kênh bán"
    }
  }
}
```


# Sản phẩm

* Sự kiện liên quan tới sản phẩm.
* Trên trang quản trị Nhanh.vn, bạn có thể vào trang chi tiết của 1 sản phẩm, tab API, để xem lịch sử webhooks của sản phẩm đó (cả webhooks thay đổi thông tin sản phẩm cũng như webhooks thay đổi tồn kho).
* Để nhận được webhooks thêm, sửa, xóa sản phẩm, app phải có quyền lấy danh sách sản phẩm.
* Xem cấu trúc chung của webhooks [tại đây](/v3/webhooks/webhooks#listen-webhooks).

## Product add

* Cấu trúc dữ liệu sẽ giống với thông tin 1 sản phẩm khi bạn gọi API lấy [danh sách sản phẩm](/v3/product/list).
  * `data` xem thêm ở [bảng bên dưới](#product-information).

```json
{
    "event": "productAdd",
    "businessId": "(int) ID doanh nghiệp trên Nhanh.vn",
    "data": {}
}
```

## Product update

* Cấu trúc dữ liệu sẽ giống với thông tin 1 sản phẩm khi bạn gọi API lấy [danh sách sản phẩm](/v3/product/list).
  * `data` xem thêm ở [bảng bên dưới](#product-information).

```json
{
  "event": "productUpdate",
  "businessId": "(int) ID doanh nghiệp trên Nhanh.vn",
  "data": {}
}
```

## Product delete

* `data` sẽ chứa mảng productId đã bị xóa.

```json
{
    "event": "productDelete",
    "businessId": "(int) ID doanh nghiệp trên Nhanh.vn",
    "data": [100, 101]
}
```

## Product information

* Thông tin sản phẩm

```json
{
  "id": "(int) ID sản phẩm",
  "parentId": "(int) ID sản phẩm cha (-1: Sản phẩm độc lập, -2: Sản phẩm cha)",
  "code": "(string) Mã sản phẩm",
  "barcode": "(string) Mã vạch",
  "name": "(string) Tên sản phẩm",
  "otherName": "(string) Tên khác",
  "status": "(string) Trạng thái sản phẩm",
  "category": {
    "id": "(int) ID danh mục",
    "code": "(string) Mã danh mục",
    "name": "(string) Tên danh mục"
  },
  "internalCategory": {
    "id": "(int) ID danh mục nội bộ",
    "code": "(string) Mã danh mục nội bộ",
    "name": "(string) Tên danh mục nội bộ"
  },
  "prices": {
    "retail": "(double) Giá bán lẻ",
    "import": "(double) Giá nhập",
    "old": "(double) Giá bán cũ",
    "wholesale": "(double) Giá bán sỉ",
    "avgCost": "(double) Giá vốn"
  },
  "vat": "(int) VAT",
  "images": {
    "avatar": "(string) Đường dẫn tới file ảnh",
    "others": [
      "(string) Đường dẫn tới file ảnh"
    ]
  },
  "warranty": {
    "month": "(int) Số tháng bảo hành",
    "phone": "(string) Số điện thoại bảo hành",
    "address": "(string) Địa chỉ bảo hảnh"
  },
  "brand": {
    "id": "(int) ID thương hiệu",
    "name": "(string) Tên thương hiệu"
  },
  "type": {
    "id": "(int) ID loại sản phẩm",
    "name": "(string) Tên loại sản phẩm"
  },
  "shipping": {
    "length": "(int) Chiều dài",
    "width": "(int) Chiều rộng",
    "height": "(int) Chiều cao",
    "weight": "(int) Khối lượng"
  },
  "countryName": "(string) Tên quốc gia",
  "units": {
    "name": "(string) Đơn vị tính",
    "list": [
      {
        "id": "(int) ID đơn vị tính",
        "name": "(string) Tên đơn vị tính",
        "quantity": "(double) Số lượng",
        "price": {
          "retail": "(double) Giá bán lẻ",
          "import": "(double) Giá nhập",
          "wholesale": "(double) Giá bán sỉ"
        }
      }
    ]
  },
  "combos": [
    {
      "id": "(int) ID sản phẩm",
      "code": "(string) Mã sản phẩm",
      "name": "(string) Tên sản phẩm",
      "quantity": "(double) Số lượng"
    }
  ],
  "inventory": {
    "remain": "(double) Số lượng tồn kho tất cả các kho",
    "shipping": "(double) Số lượng đang giao hàng tất cả các kho",
    "damaged": "(double) Số lượng lỗi tất cả các kho",
    "holding": "(double) Số lượng tạm giữ tất cả các kho",
    "transfering": "(double) Số lượng đang chuyển kho tất cả các kho",
    "warranty": "(double) Số lượng bảo hành tất cả các kho",
    "warrantyHolding": "(double) Số lượng tạm giữ bảo hành tất cả các kho",
    "holdingNew": "(double) Số lượng tạm giữ (loại xuất S) tất cả các kho",
    "shippingExport": "(double) Số lượng đang chuyển (loại xuất S) tất cả các kho",
    "available": "(double) Số lượng có thể bán tất cả các kho",
    "depots": [
      {
        "id": "(int) ID kho hàng",
        "remain": "(double) Số lượng tồn kho",
        "shipping": "(double) Số lượng đang giao hàng",
        "damaged": "(double) Số lượng lỗi",
        "holding": "(double) Số lượng tạm giữ",
        "transfering": "(double) Số lượng chuyển kho",
        "warranty": "(double) Số lượng bảo hành",
        "warrantyHolding": "(double) Số lượng tạm giữ bảo hành",
        "holdingNew": "(double) Số lượng tạm giữ (loại xuất S)",
        "shippingExport": "(double) Số lượng đang chuyển (loại xuất S)",
        "available": "(double) Số lượng có thể bán"
      }
    ]
  },
  "attributes": [
    {
      "id": "(int) ID thuộc tính",
      "name": "(string) Tên thuộc tính",
      "value": "(string) Giá trị"
    }
  ],
  "updatedAt": "(int) Thời gian cập nhật, định dạng timestamp",
  "createdAt": "(int) Thời gian tạo, định dạng timestamp",
  "suppliers": {
    "id": "(int) ID nhà cung cấp",
    "name": "(string) Tên nhà cung cấp",
    "mobile": "(string) Số điện thoại"
  },
  "videos": [
    {
      "title": "(string) Tiêu đề",
      "src": "(string) Link đường dẫn tới video"
    }
  ],
  "branchPrices": [
    {
      "branch": {
        "id": "(int) ID chi nhánh",
        "name": "(string) Tên chi nhánh"
      },
      "price": "(int) Giá bán lẻ",
      "wholesalePrice": "(int) Giá bán sỉ"
    }
  ],
  "childs": "(array) Mảng thông tin sản phẩm con",
  "tagIds": "(array) Mảng ID nhãn"
}
```


# Tồn kho

* Khi tồn kho trên Nhanh.vn có thay đổi, Nhanh.vn sẽ bắn webhooks về cho hệ thống của bạn.
  * Khi các hóa đơn, đơn hàng phát sinh xuất nhập kho gần nhau, hoặc khi app của bạn lỗi xử lý webhooks: Nhanh bắn webhooks có thể gom nhiều sản phẩm lại chung 1 request webhooks.
* Để nhận được webhooks tồn kho, app phải có quyền [Danh sách sản phẩm](/v3/product/list)
* Đối với tồn sản phẩm combo, sẽ trả về cả sản phẩm combo và các sản phẩm trong combo.

```json
{
  "event": "inventoryChange",
  "businessId": "(int) ID doanh nghiệp",
  "data": [
    {
      "id": "(int) ID sản phẩm 1",
      "typeId": "(int) Loại sản phẩm",
      "code": "(string) Mã sản phẩm",
      "remain": "(double) Tổng số lượng tồn các kho",
      "shipping": "(double) Tổng số lượng đang giao hàng các kho",
      "damaged": "(double) Tổng số lượng hàng lỗi các kho",
      "holding": "(double) Tổng số lượng tạm giữ các kho",
      "transfering": "(double) Tổng số lượng đang chuyển kho tất cả các kho",
      "available": "(double) Tổng số lượng có thể bán các kho, dùng để chặn việc đặt các sản phẩm hết hàng",
      "warranty": {
        "remain": "(double) Tổng số lượng bảo hành các kho",
        "holding": "(double) Tổng số lượng bảo hành tạm giữ các kho"
      },
      "depots": [
        {
          "id": "(int) ID kho hàng 1",
          "remain": "(double) Số lượng tồn kho",
          "shipping": "(double) Số lượng đang giao hàng",
          "damaged": "(double) Số lượng hàng lỗi",
          "holding": "(double) Số lượng tạm giữ",
          "transfering": "(double) Số lượng đang chuyển kho",
          "available": "(double) Số lượng có thể bán",
          "warranty": {
            "remain": "(double) Số lượng bảo hành",
            "holding": "(double) Số lượng bảo hành tạm giữ"
          }
        }
      ]
    }
  ]
}
```


# Giới thiệu v2.0

{% hint style="warning" %}
Chú ý: Từ ngày 23/09/2026, API docs chuyển sang tên miền mới: [https://developers.nhanh.group](https://developers.nhanh.group/)
{% endhint %}

{% hint style="warning" %}

* [**v3.0**](https://apidocs.nhanh.vn/v3) đã chính thức ra mắt từ **31-08-2025**.
* **v2.0** đã ngừng phát triển tính năng mới và sẽ ngừng hỗ trợ sau **30-11-2026**. Bạn nên chuyển đổi sang v3.0 để tránh gián đoạn sau khoảng thời gian này.
* Xem các thay đổi [từ v2.0 lên 3.0](/v2/tov3).
  {% endhint %}

## Khởi tạo ứng dụng

* Xem cách khởi tạo ứng dụng [tại đây](https://apidocs.nhanh.vn/app).
* Xem cách đăng nhập cấp quyền và lấy accessToken [tại đây](https://apidocs.nhanh.vn/app#lay-access-token).

## Request params

* Sau khi lấy được accessToken, bạn có thể bắt đầu gọi các API tới **pos.open.nhanh.vn**, bản 2.0 sẽ dùng **POST** method, body **form-data** và các params bắt buộc như sau:

  <div data-gb-custom-block data-tag="hint" data-style="info" class="hint hint-info"><p><strong>Chú ý:</strong> Nếu param type có dấu <span class="math">^{{\color{red}*}}</span> là param bắt buộc (required), nếu không có là param không bắt buộc (optional).</p></div>

| Param       | Type                          | Description                                                                            |
| ----------- | ----------------------------- | -------------------------------------------------------------------------------------- |
| version     | string $$^{{\color{red}\*}}$$ | 2.0                                                                                    |
| appId       | int $$^{{\color{red}\*}}$$    | Your app ID                                                                            |
| businessId  | int $$^{{\color{red}\*}}$$    | ID doanh nghiệp trên Nhanh.vn. Lúc bạn lấy accessToken, Nhanh API có trả về businessId |
| accessToken | string $$^{{\color{red}\*}}$$ | Your access token                                                                      |
| data        | string $$^{{\color{red}\*}}$$ | **json string** của **data array**. Các key của data array bạn xem tại từng API cụ thể |

### Postman sample

* Dùng [Postman](https://www.postman.com) lấy danh sách sản phẩm có phân trang.

![Postman: Lấy danh sách sản phẩm có phân trang](https://40622576-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhIoEj3yOAgRRsZcqGM-887967055%2Fuploads%2Fgit-blob-59d98630d12fc3ed2f72b073efb47a00254ee7d3%2Fpostman_sample_product_paginator3_2.jpg?alt=media)

* Lấy danh sách địa chỉ vận chuyển

![Postman: Lấy danh sách địa chỉ vận chuyển](https://40622576-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhIoEj3yOAgRRsZcqGM-887967055%2Fuploads%2Fgit-blob-a200c1c1f3fb2cca36c6296c330cdc6c2156568d%2Fpostman_code_snippet.jpg?alt=media)

### Postman collection

* Bạn có thể dùng [NhanhAPI Postman Collection](https://www.postman.com/nhanh-vn/workspace/open-nhanh-vn/overview) tham khảo params cho 1 số API hay dùng.
* Để sử dụng: Bạn click vào collection mình cần -> click **Fork**

![Postman: Tải về và tạo collection trên My Workspace của bạn](https://40622576-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhIoEj3yOAgRRsZcqGM-887967055%2Fuploads%2Fgit-blob-506d89fc1d35903484ebc68c43b39d69cea2fa25%2Fpostman_create_fork.png?alt=media)

* Ở phần **Create Fork**: điền **Fork label** (Tên collection ở Workspace của bạn), **Workspace** (Chọn một không gian làm việc mà bạn muốn phân nhánh), xong click **Fork Collection**

![Postman: Tải về và tạo collection trên My Workspace của bạn](https://40622576-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhIoEj3yOAgRRsZcqGM-887967055%2Fuploads%2Fgit-blob-a7e44525545cd353c6e27352ec5f5ca07b6c1296%2Fpostman_fork_collection.png?alt=media)

### Code sample

{% hint style="info" %}
Chú ý: Bản 2.0 hệ thống chưa hỗ trợ dùng javascript để gọi API (Sẽ bị báo lỗi CORS). API 3.0 dự kiến sẽ hỗ trợ mở CORS. Bạn có thể dùng Postman điền các params và click vào Code Snippet trên Postman để xem cách tạo syntax cho các ngôn ngữ (Nodejs, PHP, C#, Go, Java...):
{% endhint %}

## Lỗi thường gặp

### Invalid data

* Khi bạn gửi request và nhận được response là **invalid data**: Lỗi này do data không phải là 1 chuỗi json string hợp lệ, thường do bạn không dùng các hàm json encode mà gõ thủ công gây thừa thiếu dấu hoặc không encode các kí tự đặc biệt. Bạn có thể kiểm tra chuỗi data json string bằng cách vào <https://jsonformatter.org> copy paste chuỗi của bạn vào textarea và click **Validate**.

### Error ERR\_403

* Khi bạn gửi request và nhận được response có errorCode = **ERR\_403**, messsages = **The app or accessToken is not authorized for this feature**: Lỗi này là do user đăng nhập cấp quyền chưa chọn quyền hoặc không có quyền thao tác với hành động đó. VD: user đăng nhập cấp quyền, chỉ có quyền xem danh sách sản phẩm, nên sẽ không hiện ra quyền danh sách đơn hàng, hoặc user có quyền nhưng không chọn ở bước đăng nhập cấp quyền, thì sau đó bạn sẽ không thể dùng accessToken để gọi API [/api/order/index](https://github.com/nvndocs/docs-pos-openapi/tree/v2/docs/order/index/README.md).
* Cách sửa: Báo user đăng nhập đúng tài khoản có quyền thao tác với dữ liệu và chọn quyền ở bước [đăng nhập cấp quyền](https://apidocs.nhanh.vn/#dang-nhap-cap-quyen).

### API Rate Limit

* Rate Limit là số lệnh gọi API mà ứng dụng của bạn có thể thực hiện trong khoảng thời gian nhất định. Nếu vượt quá giới hạn này thì ứng dụng có thể bị giới hạn tốc độ. Các lệnh gọi API do ứng dụng đang bị giới hạn tốc độ sẽ không thành công. Lỗi này thường gặp phải khi ứng dụng không lưu dữ liệu mà luôn gọi API (VD liên tục gọi API lấy danh sách sản phẩm, danh sách đơn hàng...). **Khuyến cáo:** Bạn cần lưu dữ liệu ở hệ thống của bên bạn, cập nhật [dữ liệu mới từ webhooks](/v2/webhooks/webhooks), khi gọi API chỉ nên lấy các dữ liệu có thay đổi, không lấy toàn bộ dữ liệu cũ (các API có hỗ trợ lọc theo updatedDateTimeFrom - updatedDateTimeTo hoặc updatedAtFrom - updatedAtTo).
* Rate Limit sẽ được kết hợp từ appId + businessId + API URL, nên ứng dụng của bạn có thể sẽ bị giới hạn ở 1 URL này, nhưng vẫn có thể gọi URL khác nếu URL đó không bị giới hạn, hoặc nếu ứng dụng của bạn dùng cho nhiều doanh nghiệp, thì bạn có thể bị giới hạn với businessId 1, nhưng vẫn có thể dùng được với businessId 2. **Chú ý:** Nếu bạn cố tình dùng nhiều ứng dụng để gọi liên tục API, hệ thống sẽ khóa toàn bộ các ứng dụng. Các ứng dụng bị khóa, sẽ không thể gọi bất kì API nào nữa.
* Rate Limit sẽ có mức chung mặc định là: 150 requests / 30 giây. Nếu 1 API có mức riêng, thì tài liệu của API đó sẽ có mô tả riêng.
* Khi vượt quá Rate Limit, bạn sẽ nhận được errorCode = ERR\_429. Bạn cần tạm ngừng gọi API tới URL này cho tới khi quá thời gian **unlockedAt**. Nếu vẫn tiếp tục phát sinh gọi API khi đang bị Rate Limit, lockedSeconds và unlockedAt sẽ bị tăng lên.

```json
{
  "code": 0,
  "message": "Your app exceeded the API Rate Limit",
  "errorCode": "ERR_429",
  "data": {
    "lockedSeconds": 10,
    "unlockedAt": 1733387520
  }
}
```

| Key           | Description                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| lockedSeconds | Số giây bị khóa                                                                         |
| unlockedAt    | Thời gian được mở khóa theo Unix timestamp. VD: 1733387520 = 2024-12-05 15:32:00 GMT+07 |

## Thuật ngữ

### Trạng thái sản phẩm

| Value      | Mô tả                                                                                                                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New        | Mới: Trạng thái này dùng để bán hàng ở cửa hàng offline                                                                                                                                                         |
| Active     | Đang bán: Trạng thái này dùng để hiện bán ở trên website online (nếu dùng website của Nhanh.vn) và cửa hàng offline                                                                                             |
| Inactive   | Ngừng bán: Trạng thái này để ẩn sản phẩm cả webiste online và cửa hàng offline, gõ gợi ý và mặc định ở danh sách sản phẩm cũng không hiện ra trừ khi lọc trạng thái Ngừng bán hoặc lọc chính xác id sản phẩm đó |
| OutOfStock | Hết hàng: Dùng để hiện trên website nhưng sẽ hiện thêm chữ Hết hàng và không cho đặt hàng, thường để website giữ link sản phẩm cũ, tránh lỗi 404                                                                |

### Order

Các thuật ngữ của đơn hàng online

* **shippingWeight**: bao gồm cân nặng thực tế của sản phẩm và toàn bộ cân nặng của các phụ kiện và vỏ hộp đóng gói đi kèm. Shipping weight được sử dụng để tính phí vận chuyển của đơn hàng. VD: Sản phẩm “Samsung Galaxy S2” nặng 300gr, Sản phẩm fullbox còn bao gồm 1 sạc (30gr), 1 tai nghe (10gr) and vỏ hộp đóng gói (30gr), vậy thì shippingWeight để tính phí vận chuyển sẽ là: 300 + 30 + 10 + 30 = 370 gr.
* **COD**: Cash on delivery (Collect on delivery) là 1 loại giao dịch mà người mua hàng sẽ trả tiền khi nhận được hàng. Nếu người mua không đồng ý thanh toán khi nhận hàng, đơn hàng sẽ được chuyển trả lại cho người bán. Phí thu tiền hộ **codFee** tùy thuộc vào số tiền cần thu của đơn hàng.
* **shipFee**: Phí vận chuyển, được tính dựa vào trọng lượng đơn hàng, địa chỉ gửi hàng và địa chỉ nhận hàng.
* **customerShipFee**: Phí thu của khách, là mức phí mà website thông báo cho khách đặt hàng, thường sẽ lấy bằng shipFee + codFee. Tình huống website có chương trình miễn phí vận chuyển cho khách thì set customerShipFee = 0.
* **Order Status:**

  Trạng thái đơn hàng

| Status             | Description             |
| ------------------ | ----------------------- |
| New                | Đơn mới                 |
| Confirming         | Đang xác nhận           |
| CustomerConfirming | Chờ khách xác nhận      |
| Confirmed          | Đã xác nhận             |
| Packing            | Đang đóng gói           |
| Packed             | Đã đóng gói             |
| ChangeDepot        | Đổi kho xuất hàng       |
| Pickup             | Chờ thu gom             |
| Shipping           | Đang chuyển             |
| Success            | Thành công              |
| Failed             | Thất bại                |
| Canceled           | Khách hủy               |
| Aborted            | Hệ thống hủy            |
| CarrierCanceled    | Hãng vận chuyển hủy đơn |
| SoldOut            | Hết hàng                |
| Returning          | Đang chuyển hoàn        |
| Returned           | Đã chuyển hoàn          |

* **Order Reason**

  Lý do theo trạng thái đơn hàng

| Reason                   | Description                                       |
| ------------------------ | ------------------------------------------------- |
| WrongProduct             | Đặt nhầm sản phẩm                                 |
| HighShipFee              | Phí vận chuyển cao                                |
| NotTransfer              | Không muốn chuyển khoản                           |
| Duplicated               | Đơn trùng                                         |
| CannotCall               | Không gọi được khách                              |
| SoldOut                  | Hết hàng                                          |
| WaitingTransfer          | Chờ chuyển khoản                                  |
| NotLikeProduct           | Khách không thích sản phẩm                        |
| NotPleasureDeliverer     | Khách không hài lòng về nhân viên vận chuyển      |
| SlowShipping             | Giao hàng chậm                                    |
| Bought                   | Đã mua sản phẩm tại cửa hàng                      |
| CustomerNotAtHome        | Khách đi vắng (sẽ giao hàng vào hôm khác)         |
| WrongAddress             | Sai địa chỉ người nhận                            |
| NotBuy                   | Khách không muốn mua nữa                          |
| CannotCallSender         | Không liên hệ được với người gửi                  |
| SellerNotSellOnline      | Người gửi không bán hàng Online / Ngoại tỉnh      |
| SellerNotHandoverCarrier | Người gửi không bàn giao hàng cho hãng vận chuyển |
| SellerNotProcessOrder    | Người gửi không xử lý đơn hàng                    |
| WrongPickupAddress       | Sai địa chỉ kho lấy hàng                          |
| WrongPrice               | Sai giá sản phẩm                                  |
| SelfShipping             | Người gửi tự vận chuyển                           |
| CarrierPickupLate        | Hãng vận chuyển lấy hàng muộn                     |
| CarrierLostProduct       | Hãng vận chuyển làm mất hàng                      |
| Other                    | Lý do khác                                        |

### Inventory

Các thuật ngữ về kho hàng

* Phiếu XNK, Sản phẩm XNK có 2 loại (type) là phiếu nhập, phiếu xuất và nhiều kiểu (mode) XNK khác nhau:
* Loại XNK:

| Type (int) | Description   |
| ---------- | ------------- |
| 1          | Loại nhập kho |
| 2          | Loại xuất kho |

* Kiểu XNK:

| Mode (int) | Description                    |
| ---------- | ------------------------------ |
| 1          | Kiểu giao hàng                 |
| 2          | Kiểu bán lẻ                    |
| 3          | Kiểu chuyển kho                |
| 4          | Kiểu quà tặng ở hóa đơn bán lẻ |
| 5          | Kiểu nhà cung cấp              |
| 6          | Kiểu bán sỉ                    |
| 8          | Kiểu kiểm kho                  |
| 10         | Kiểu khác                      |
| 18         | Kiểu quà tặng ở đơn hàng       |


# Change log

{% hint style="warning" %}
Chú ý: Từ ngày 23/09/2026, API docs chuyển sang tên miền mới: [https://developers.nhanh.group](https://developers.nhanh.group/)
{% endhint %}

## 2025-07-31

* [Danh sách đơn hàng](/v2/order/index): Trả thêm thông tin VAT đơn hàng.

## 2025-07-15

* [Webhooks đơn hàng](/v2/webhooks/order): Trả thêm thông tin moneyTransfer, paymentCode ở webhook cập nhật đơn hàng.
* Thông báo thay đổi domain Open API (Để chuẩn bị ra mắt v3.0):
  * Trước đây tên miền cũ để gọi Open API là: **open.nhanh.vn**
  * Từ ngày 17/04/2025, hệ thống có tên miền mới là **pos.open.nhanh.vn**. Bạn chỉ cần đổi tên miền, mọi Request params vẫn như cũ, không có thay đổi gì.
  * Xem chi tiết thông báo: <https://nhanh.vn/thong-bao-thay-doi-domain-open-api-an895.html>.

## 2025-05-27

* [Webhooks đơn hàng](/v2/webhooks/order): Trả thêm thông tin code, barcode cho sản phẩm trong đơn hàng

## 2025-05-14

* [Danh sách đơn hàng](/v2/order/index): Trả thêm thông tin carrierServiceType, carrierServiceTypeName

## 2025-05-08

* [Danh sách đơn hàng](/v2/order/index): Trả thêm thông tin liên quan tới facebook: adId, postId, psId, conversationId

## 2025-04-29

* [Danh sách đơn hàng](/v2/order/index): Trả thêm giá vốn sản phẩm

## 2025-04-14

* [Danh sách bút toán](/v2/accounting/transaction): Trả thêm createdById, createdUserName, createdDateTime (thông tin người tạo, thời gian tạo bút toán)
* [Thêm đơn hàng](/v2/order/add): Thêm trạng thái "CustomerConfirming" (Chờ xác nhận)

## 2025-03-26

* [Danh sách sản phẩm](/v2/product/index): Trả thêm transfering (số đang chuyển kho) trong dữ liệu tồn kho (inventory)
* [Chi tiết sản phẩm](/v2/product/detail): Trả thêm transfering (số đang chuyển kho) trong dữ liệu tồn kho (inventory)
* [Phiếu xuất nhập kho](/v2/bill/index): Trả thêm VATpercent (phần trăm VAT) cho sản phẩm trong phiếu

## 2025-03-04

* [Danh sách bút toán](/v2/accounting/transaction): Trả thêm depotId (ID kho doanh nghiệp).

## 2025-02-20

* [Danh sách đơn hàng](/v2/order/index): Trả thêm thông tin người đóng gói.

## 2024-12-30

* [Cập nhật đơn hàng](/v2/order/update): Cho phép cập nhật Phí ship báo khách (customerShipFee).

## 2024-12-25

* [Webhooks đơn hàng](/v2/webhooks/order): Trả ngày giờ tạo đơn hàng khi thêm mới

## 2024-12-15

* [Thêm đơn hàng](/v2/order/add): Thêm trạng thái Confirming (Đang xác nhận).

## 2024-12-01

* [Danh sách nguồn đơn hàng](/v2/order/source): Thêm danh sách nguồn đơn hàng.
* [Thêm sản phẩm](/v2/product/add): Thêm externalImages param (Đường dẫn ảnh cho sản phẩm từ CDN khác không thuộc Nhanh.vn)
* [Thêm ảnh sản phẩm](/v2/product/externalimage): Thêm ảnh cho sản phẩm từ CDN khác không thuộc Nhanh.vn

## 2024-11-30

* [Danh sách đơn hàng](/v2/order/index): Trả thêm productMoney trong thông tin sản phẩm của đơn hàng.

## 2024-10-23

* [Danh sách đơn hàng](/v2/order/index): Thêm dataOptions: comboItems trả về danh sách sản phẩm con trong combo.
* [Danh sách sản phẩm](/v2/product/index): Trả thêm order cho thuộc tính
* [Chi tiết sản phẩm](/v2/product/detail): Trả thêm order cho thuộc tính, typeId, typeName sản phẩm

## 2024-10-20

* [Danh sách sản phẩm](/v2/product/index): Thêm lọc tất cả sản phẩm con (param parentId = -10)

## 2024-10-15

* Thêm API: [Danh sách gian hàng sàn TMĐT](/v2/ecommerce/index)
* [Danh sách sản phẩm](/v2/product/index): Trả thêm updateAt (ngày cập nhật sản phẩm)
* [Danh sách đơn hàng](/v2/order/index): Trả thêm updateAt (ngày cập nhật đơn hàng)

## 2024-10-03

* [Thêm sản phẩm](/v2/product/add): Thêm oldPrice, description, content

## 2024-08-11

* [Thêm đơn hàng](/v2/order/add): Trả thêm lịch trình đơn hàng
* [Webhooks đơn hàng](/v2/webhooks/order): Trả thêm lịch trình đơn hàng khi thêm mới, cập nhật đơn hàng

## 2024-08-03

* [Gửi tin Zalo ZNS](/v2/zalo/zns): Respone bổ sung thêm số dư tài khoản sau khi gửi tin và số tin nhắn còn được gửi trong ngày.

## 2024-06-17

* [Sản phẩm xuất nhập kho nháp](/v2/bill/imexrequirements): Thay đổi key trả về requiredDateTime, approvedDateTime, realDateTime => requiredAt, approvedAt, comfirmedAt

## 2024-05-28

* [Thêm đơn hàng](/v2/order/add): Thêm tham số "isPartDelivery" cho phép đơn hàng đánh dấu có giao hàng một phần

## 2024-04-23

* [Webhooks đơn hàng](/v2/webhooks/order#khi-cap-nhat-don-hang): Trả về deliveryDate khi cập nhật đơn hàng

## 2024-04-22

* [Danh sách khách hàng](/v2/customer/index): Đổi request param updatedDateTimeFrom, updatedDateTimeTo => updatedAtFrom, updatedAtTo

## 2024-03-29

* [Lấy accessToken](https://apidocs.nhanh.vn/#doi-access-token): Đổi link lấy accessToken sang link mới <https://pos.open.nhanh.vn/api/oauth/access\\_token>
* Link cũ deprecated.

## 2024-03-12

* [Gửi tin Zalo ZNS](/v2/zalo/zns): Thêm API gửi tin Zalo ZNS.

## 2024-02-06

* [Tính phí vận chuyển](/v2/shipping/shippingfee): Thêm API tính phí vận chuyển tự kết nối.
* [Thêm đơn hàng](/v2/order/add): Thêm request param carrierAccountId, carrierShopId, serviceCode hỗ trợ cho trường hợp đơn hàng có tính phí vận chuyển tự kết nối khi truyền sendCarrierType = 2.
* Tách cài đặt kho lấy tồn cho API ra khỏi cài đặt dùng cho website.

## 2023-12-10

* [Danh sách khách hàng](/v2/customer/index): Thêm lọc ngày cập nhật khách hàng: updatedDateTimeFrom, updatedDateTimeTo. Đổi request param fromLastBoughtDate, toLastBoughtDate => lastBoughtDateFrom, lastBoughtDateTo
* [Danh sách đơn hàng](/v2/order/index): Đổi request param updatedFromDateTime, updatedToDateTime => updatedDateTimeFrom, updatedDateTimeTo
* [Danh sách sản phẩm](/v2/product/index): Đổi request param updatedFromDateTime, updatedToDateTime => updatedDateTimeFrom, updatedDateTimeTo

## 2023-10-03

* [Danh sách đơn hàng](/v2/order/index): trả về facebook fanpageId và adId.
* [Lịch sử đơn hàng](/v2/order/history): trả thêm lịch trình hãng vận chuyển.

## 2023-08-14

* [Bán lẻ](/v2/bill/index): Thêm dataOptions: tags trả về danh sách tags của hóa đơn

## 2023-06-14

* [Danh sách sản phẩm](/v2/product/index): Thêm request param updatedFromDateTime và updatedToDateTime để lọc danh sách sản phẩm theo ngày cập nhật mới nhất

## 2023-05-10

* [Danh mục](/v2/product/category): trả về thêm trạng thái danh mục (status)
* [Coupon](/v2/promotion/coupon): trả về thêm options : notApplyWithDiscountPromotion chương trình có cho áp dụng cùng chương trình chiết khấu hay không

## 2023-04-06

* Ngừng hỗ trợ request params dạng GET, chỉ hỗ trợ dạng POST từ version 2.0 (Chuẩn bị tắt bản 1.0)
* [Phiếu xuất nhập kho](/v2/bill/index): Thêm request param dataOptions để lấy thêm dữ liệu cần thiết, VD: giftProducts để lấy sản phẩm quà tặng

## 2023-03-01

* [Danh sách đơn hàng](/v2/order/index): Thêm request param dataOptions để lấy thêm dữ liệu cần thiết, VD: giftProducts để lấy sản phẩm quà tặng; marketingUtm để lấy thông tin utmSource, utmMedium, utmCampaign

## 2023-01-16

* [Tính phí vận chuyển](/v2/shipping/shippingfee): Response trả về thêm isRequiredInsurance là biến đánh dấu bảng giá có bắt buộc mua bảo hiểm hàng hóa hay không

## 2022-12-07

* Thêm API [Danh sách công nợ khách hàng](/v2/accounting/debts)
* Thêm API [Danh sách hạn sử dụng sản phẩm](/v2/product/expire)
* [Phiếu xuất nhập kho](/v2/bill/index): Thêm lọc kho hàng
* [Thêm đơn hàng](/v2/order/add): Thêm tiêu điểm đơn hàng
* [Danh sách khách hàng](/v2/customer/index): Thêm lọc loại khách hàng, trả về thêm mã số thuế, tên công ty, địa chỉ công ty

## 2022-10-05

* Thêm API [Danh sách bút toán](/v2/accounting/transaction)
* Thêm API [Danh mục nội bộ](/v2/product/internalcategory)

## 2022-09-21

* Thay đổi loại đơn hàng: Thêm 2 loại chuyển hàng mới, bỏ loại chuyển hàng shippingType (trước đó là 1 mục nhỏ bên trong loại đơn Chuyển hàng), chi tiết xin đọc thông báo [tại đây](https://nhanh.vn/thong-bao-ve-viec-thay-doi-va-bo-sung-loai-don-hang-moi-an702.html).
* [Cập nhật đơn hàng](/v2/order/update): Thêm thông tin moneyTransferAccountId (Tài khoản nhận tiền chuyển khoản - Áp dụng với doanh nghiệp sử dụng kế toán)
* [Danh sách coupon](/v2/promotion/coupon):
  * /api/promotion/coupon?act=addbatch: Tạo chương trình coupon.
  * /api/promotion/coupon?act=increasecode: Cập nhật thêm mã vào chương trình coupon.

## 2022-08-01

* [Danh sách IMEI](/v2/product/imei): /api/product/imei: Tìm theo ID cửa hàng

## 2022-07-07

* [Danh sách đơn hàng](/v2/order/index): /api/order/index: Tìm theo ngày cập nhật đơn hàng

## 2022-06-30

* [Danh sách kho hàng](/v2/store/depot): /api/store/depot: thêm số điện thoại kho hàng
* [Thêm mới subscriber](/v2/website/addsubscriber): /api/website/addsubscriber: Thêm mới subscriber
* [Thêm mới liên hệ](/v2/website/addcontact): /api/website/addcontact: Thêm mới liên hệ

## 2022-03-28

* [Danh sách sản phẩm](/v2/product/index): /api/product/search: Tìm theo sản phẩm được đánh dấu (showHot: Sản phẩm hot showNew: Sản phẩm mới showHome: Sản phẩm trên trang chủ,giá trị truyền lên 1 | 0)

## 2022-03-17

* [Danh sách đơn hàng](/v2/order/index), [Phiếu xuất nhập kho](/v2/bill/index): Nếu bạn truyền param customerId hoặc customerMobile thì sẽ không bị giới hạn lấy dữ liệu trong khoảng 10 ngày.
* [Danh sách coupon](/v2/promotion/coupon): /api/promotion/coupon?act=products trả về danh sách sản phẩm được áp dụng coupon(ID sản phẩm).

## 2022-03-08

* Request params businessId required: Trước đây request params gửi sang pos.open.nhanh.vn chỉ yêu cầu 4 params: version, appId, accessToken, data nhưng developer hay nhầm lẫn về việc 1 accessToken có thể dùng cho nhiều bussinessId, khiến cho việc POST dữ liệu từ 1 doanh nghiệp A sang 1 doanh nghiệp B, gây sai dữ liệu nghiêm trọng, để tránh tình huống có thể gây ra sai sót này:
  * Từ 2022-01-01: Tài liệu Open API đã sửa lại Request params yêu cầu thêm businessId.
  * Từ 2022-03-07: Thông báo trên hệ thống, và gửi email cho các tài khoản developer về việc Request params bắt buộc cần thêm businessId.
  * Từ 2022-05-10: Developer có 2 tháng (từ 2022-03-07 tới 2022-05-10) để sửa code truyền thêm bussinessId, tới ngày này tất cả các request thiếu businessId sẽ bị báo lỗi.

## 2022-02-28

* [Tra cứu IMEI bán ra theo ngày](/v2/product/imeisold): /api/product/imeisold thêm productPrice: Giá sản phẩm.
* [Thêm đơn hàng](/v2/order/add): /api/order/add thêm privateDescription: ghi chú chăm sóc khách hàng.

## 2022-01-11

* [Quà tặng sản phẩm](/v2/product/gift): /api/product/gift thêm promotionFromDate, promotionToDate, promotionStatus, promotionDepotIds.

## 2021-12-28

* [Danh sách sản phẩm xuất nhập kho nháp](/v2/bill/imexrequirements): Giới hạn khoảng ngày chỉ hỗ trợ lấy dữ liệu trong 10 ngày. Nếu bạn không truyền param fromDate và toDate, mặc định sẽ lấy 10 ngày gần nhất. Nếu bạn muốn lấy dữ liệu các ngày cũ hơn, xin vui lòng truyền fromDate và toDate trong khoảng 10 ngày (VD: 2021-09-01 => 2021-09-10, 2021-09-11 => 2021-09-20)
* [Webhooks đơn hàng](/v2/webhooks/order): thêm webhooks cho đơn từ các sàn TMĐT (Lazada, Shopee, Tiki, Sendo...).
* [Đơn hàng](/v2/order/update): /api/order/update thêm orderId giúp cập nhật đơn hàng theo ID trên Nhanh.vn.


# Nâng cấp lên v3.0

* Các chú ý khi chuyển từ **v2.0** lên **v3.0**.

## Các thay đổi

### App

* Cài đặt app sẽ có thêm 1 mục webhooks version: Bạn có thể chọn nhận webhooks v2 hoặc v3.

### Access Token

* Các accessToken và quyền đã được cấp ở v2 sẽ vẫn được dùng cho v3 Alpha. Bản chính thức có thể sẽ tách hoàn toàn accessToken 2 bản v2.0, v3.0.

### Request

* Khác với v2.0 dùng Body form-data, v3.0 dùng Body raw. Xem cách tạo [request params v3.0](https://apidocs.nhanh.vn/v3#request-params).
* v3.0 đã hỗ trợ mở CORS, không còn chặn gọi bằng Javascript như v2.0

### Response

* API v3.0 đã thay đổi hoàn toàn cấu trúc dữ liệu response data.
  * Xem Response chung [tại đây](https://apidocs.nhanh.vn/v3#response).
  * Bạn chú ý đọc kỹ tài liệu ở từng API sẽ có thể có thêm các data response riêng.

## Các API có thay đổi

### Thay đổi chung

* Thay đổi về [Paginator](https://apidocs.nhanh.vn/v3#paginator) giúp hỗ trợ nhiều điều kiện sort hơn.
* 1 số API trước đó có giới hạn 10 ngày, nay sẽ tăng lên 31 ngày để bạn dễ dàng lấy được dữ liệu theo từng tháng.
* Khi Nhanh bắn webhooks cho app, cấu trúc dữ liệu sẽ tương tự như khi gọi API, giúp giảm việc gọi API để lấy thêm thông tin. VD:
  * Webhooks đơn hàng mới, sẽ có cấu trúc giống với 1 đơn hàng trong mảng khi gọi API lấy danh sách đơn hàng.
  * Webhooks sản phẩm mới, sẽ có cấu trúc giống với 1 sản phẩm trong mảng khi gọi API lấy danh sách sản phẩm.

### Order Add

* v2: hỗ trợ truyền id (là productId của web / app) và idNhanh (id sản phẩm trên Nhanh).
* v3: bỏ id (productId của web / app), chỉ sử dụng id sản phẩm trên Nhanh.

## Các API mới

* Dự kiến API v3 sẽ hỗ trợ thêm các mục sau:

### POS

* Sản phẩm:
  * Danh sách sản phẩm đã xóa.
* Bán hàng:
  * Thêm hóa đơn bán lẻ, bán sỉ
  * Lấy danh sách hóa đơn đã bị xóa
* Đơn hàng:
  * Lấy danh sách đơn hàng đã bị xóa
* Kho hàng: Thêm 1 số loại phiếu xuất nhập kho
* Khuyến mại:
  * Tặng điểm, trừ điểm khách hàng
  * Tặng coupon
* Webhooks:

### Vpage

* v3.0 đã mở API cho [Vpage.nhanh.vn](https://vpage.nhanh.vn).
* Xem API của Vpage [tại đây](https://apidocs.nhanh.vn/v3/vpage/conversation/conversation_list).

## Các Webhooks mới

* Đang cập nhật.


# Danh sách sản phẩm

* /api/product/search: Tính năng này dùng để lấy danh sách sản phẩm ở trên Nhanh.vn. Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 100 sản phẩm.
* Nếu bạn hay thường xuyên cần gọi toàn bộ danh sách sản phẩm, bạn nên lưu giá trị thời gian lần cuối cùng quét toàn bộ, sau đó dùng 2 request params là updatedDateTimeFrom và updatedDateTimeTo để chỉ lấy về các sản phẩm có cập nhật mới, không cần gọi lại toàn bộ khách cũ không có thay đổi gì.
  * **Chú ý**: updatedDateTime sẽ chỉ bao gồm thông tin sản phẩm (tên, giá bán...) bị thay đổi, không bao gồm thông tin tồn kho của sản phẩm. Để cập nhật tồn kho, bạn nên đăng ký [webhooks tồn kho](/v2/webhooks/inventory)

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key                 | Type   | Description                                                                                                                                                                                                                                                                                 |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| page                | int    | Phân trang, mặc định: 1.                                                                                                                                                                                                                                                                    |
| icpp                | int    | Số lượng sản phẩm trên 1 trang, mặc định: 100, tối đa: 100.                                                                                                                                                                                                                                 |
| sort                | array  | Sắp xếp kết quả, dữ liệu gửi lên là 1 mảng kiểu \[Tiêu chí sắp xếp => cách sắp xếp (asc: tăng dần hoặc desc giảm dần)] Giá trị mặc định sẽ là \[id => desc].Các tiêu chí có thể là: **id**: id sản phẩm, **price**: giá sản phẩm, **name**: tên sản phẩm, **inventory**: tồn kho có thể bán |
| name                | string | Tìm sản phẩm theo tên, mã, mã vạch                                                                                                                                                                                                                                                          |
| parentId            | int    | Tìm theo ID sản phẩm cha. -1 = Sản phẩm độc lập, -2 = Sản phẩm cha                                                                                                                                                                                                                          |
| categoryId          | int    | Tìm sản phẩm theo id danh mục sản phẩm, nếu danh mục này có các danh mục con, hệ thống sẽ tìm sản phẩm của toàn bộ danh mục con.                                                                                                                                                            |
| status              | string | Tìm theo trạng thái sản phẩm. Xem bảng mô tả [trạng thái sản phẩm](/v2#trang-thai-san-pham)                                                                                                                                                                                                 |
| priceFrom           | double | Tìm theo giá >=                                                                                                                                                                                                                                                                             |
| priceTo             | double | Tìm theo giá <=                                                                                                                                                                                                                                                                             |
| brandId             | int    | Tìm theo thương hiệu                                                                                                                                                                                                                                                                        |
| imei                | string | Tìm theo IMEI                                                                                                                                                                                                                                                                               |
| showHot             | int    | Tìm theo sản phẩm được đánh dấu là sản phẩm hot (Giá trị truyền lên: 1 hoặc 0)                                                                                                                                                                                                              |
| showNew             | int    | Tìm theo sản phẩm được đánh dấu là sản phẩm mới (Giá trị truyền lên: 1 hoặc 0)                                                                                                                                                                                                              |
| showHome            | int    | Tìm theo sản phẩm được đánh dấu là sản phẩm trên trang chủ (Giá trị truyền lên: 1 hoặc 0)                                                                                                                                                                                                   |
| updatedDateTimeFrom | string | Định dạng: Y-m-d H:i:s, Vd: 2022-05-25 00:00:00 Ngày cập nhật sản phẩm từ ngày                                                                                                                                                                                                              |
| updatedDateTimeTo   | string | Định dạng: Y-m-d H:i:s, Vd: 2022-05-30 23:59:00 Ngày cập nhật sản phẩm đến ngày                                                                                                                                                                                                             |

## Response

* JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of product list               |

```javascript
[
    "totalPages": 30, // int
    "products": {
        {}, // each product item, all properties are listed in the table below
        ...
    }
]
```

| Key                | Type        | Description                                                                   |
| ------------------ | ----------- | ----------------------------------------------------------------------------- |
| idNhanh            | bigint(20)  | ID sản phẩm trên Nhanh.vn                                                     |
| categoryId         | int         | ID danh mục sản phẩm trên Nhanh.vn                                            |
| internalCategoryId | int         | ID danh mục nội bộ trên Nhanh.vn                                              |
| parentId           | bigint(20)  | -1 = Sản phẩm độc lập, hoặc -2 = Sản phẩm cha, hoặc -10 = Tất cả sản phẩm con |
| code               | string(255) | Mã sản phẩm                                                                   |
| name               | string(255) | Tên sản phẩm                                                                  |
| otherName          | string(255) | Tên khác của sản phẩm                                                         |
| importPrice        | doulbe      | Giá nhập                                                                      |
| oldPrice           | double      | Giá cũ                                                                        |
| price              | double      | Giá bán lẻ                                                                    |
| wholesalePrice     | double      | Giá bán buôn                                                                  |
| vat                | int         | % thuế giá trị gia tăng (VD: 10)                                              |
| image              | string(255) | Đường dẫn tuyệt đối của ảnh đại diện                                          |
| images             | array       | Đường dẫn tuyệt đối của các ảnh khác của sản phẩm                             |
| status             | string      | Xem bảng mô tả [trạng thái sản phẩm](/v2#trang-thai-san-pham)                 |
| previewLink        | string      | Link chi tiết của sản phẩm trên website (if status is Active)                 |
| showHot            | int         | (Giá trị 0 or 1) Sản phẩm được đánh dấu là sản phẩm hot                       |
| showNew            | int         | (Giá trị 0 or 1) Sản phẩm được đánh dấu là sản phẩm mới                       |
| showHome           | int         | (Giá trị 0 or 1) Sản phẩm được đánh dấu hiển thị ở trang chủ                  |
| width              | int         | in cm                                                                         |
| height             | int         | in cm                                                                         |
| warrantyAddress    | string      | Địa chỉ bảo hành                                                              |
| warrantyPhone      | string      | Số điện thoại bảo hành                                                        |
| warranty           | int         | Số tháng bảo hành                                                             |
| length             | int         | in cm                                                                         |
| shippingWeight     | int         | in gram                                                                       |
| createdDateTime    | datetime    | định dạng yyyy-mm-dd hh:mm:ss                                                 |
| brandId            | int         | ID thương hiệu                                                                |
| brandName          | string      | Tên thương hiệu                                                               |
| typeId             | int         | ID loại sản phẩm                                                              |
| typeName           | string      | Loại sản phẩm                                                                 |
| avgCost            | double      | Giá vốn sản phẩm                                                              |
| countryName        | string      | Xuất xứ                                                                       |
| unit               | string      | Đơn vị tính                                                                   |
| importType         | int         | ID Kiểu nhập kho                                                              |
| importTypeLabel    | string      | Tên kiểu nhập kho                                                             |
| inventory          | array       | Xem bảng [Inventory](#inventory) bên dưới                                     |
| attributes         | array       | Xem bảng [Attributes](#attributes) bên dưới                                   |
| units              | array       | Xem bảng [Units](#units) bên dưới                                             |
| updatedAt          | int         | Ngày cập nhật sản phẩm (định dạng timestamp)                                  |

### Inventory

* Tồn kho:

```javascript
[
    // Tổng tồn trong tất cả các kho
    "remain" => int, // số lượng tồn kho
    "shipping" => int, // số lượng đang giao hàng
    "holding" => int, // số lượng đang tạm giữ
    "damage" => int, // số lượng lỗi
    "available" => int, // số lượng có thể bán (sử dụng để hiển thị trên website, chặn đặt hàng khi hết số tồn hoặc vượt quá số tồn).
    "warranty" => int, // số lượng bảo hành
    "warrantyHolding" => int, // Số lượng đang bảo hành
    "depots" => { // Tồn tại từng kho
        "depotId" => {
            "remain" => int, // số lượng tồn kho
            "shipping" => int, //  số lượng đang giao hàng
            "holding" => int, // số lượng đang tạm giữ
            "damage" => int, //  số lượng lỗi
            "available" => int, // số lượng có thể bán (sử dụng để hiển thị trên website, chặn đặt hàng khi hết số tồn hoặcvượt quá số tồn).
            "warranty" => int, // số lượng bảo hành
            "warrantyHolding" => int, // Số lượng đang bảo hành
			"transfering" => int, // Số lượng đang chuyển kho
        },
        "depotId" => {
            // ...
        },
    }
]
```

### Attributes

* Thuộc tính sản phẩm:

```javascript
[
	{
		"id_thuoc_tinh" => {
			"attributeName" => string,
			"id" => int,
			"name" => string,
			"order" => int
		},
		"id_thuoc_tinh" => {
			"attributeName" => string,
			"id" => int,
			"name" => string,
			"order" => int
			"parent" => { // parent attribute
				"id" => int,
				"name" => string
			}
		}
	}
]
```

### Units

* Đơn vị tính

```javascript
[
    {
        "id" => int, // ID đơn vị tính
        "name" => string // Tên đơn vị tính
        "quantity" => int // Số lượng quy đổi
        "importPrice" => double // Giá nhập
        "price" => double // Giá lẻ
        "wholesalePrice" => double // Giá buôn
    },
    {
        ...
    }
]
```


# Thêm sản phẩm

* API này dùng để tạo sản phẩm trên Nhanh.vn, API này dùng được cho cả tình huống thêm và sửa sản phẩm (NhanhAPI sẽ kiểm tran sản phẩm đã tồn tại dựa vào trường idNhanh hoặc id).
* **Chú ý**: API 2.0 hiện chưa hỗ trợ việc tạo thuộc tính sản phẩm (màu sắc, kích thước...). Bạn nên tạo sản phẩm trên Nhanh.vn rồi nhận [webhooks sản phẩm](/v2/webhooks/product) mới hoặc gọi API lấy sản phẩm về. API 3.0 dự kiến sẽ hỗ trợ việc này.
* Hiện hệ thống chưa cho xóa sản phẩm qua API, bạn có thể dùng API để sửa trạng thái về **Ngừng bán** (status = Inactive). Trên Nhanh.vn mặc định sẽ không hiện ra các sản phẩm ngừng bán trừ khi lọc chính xác sản phẩm hoặc lọc trạng thái = Ngừng bán.

## Request

* URI: /api/product/add. Xem các [common request params](/v2#request-params).
* Các key của mảng **data array** dùng để tạo **data** json string:

```javascript
// each request can send maximum 300 products
[
    [product 1], // see the structure in the table below
    [product 2],
    // ...
]
```

| Key            | Type                               | Description                                                                                                                                                                                                                                                                                                                                                                              |
| -------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id             | string(20) $$^{{\color{red}\*}}$$  | id sản phẩm trên hệ thống riêng của bạn                                                                                                                                                                                                                                                                                                                                                  |
| idNhanh        | bigint                             | id sản phẩm trên Nhanh.vn                                                                                                                                                                                                                                                                                                                                                                |
| code           | string(255)                        | Mã sản phẩm                                                                                                                                                                                                                                                                                                                                                                              |
| barcode        | string(20)                         | Mã vạch của sản phẩm                                                                                                                                                                                                                                                                                                                                                                     |
| name           | string(255) $$^{{\color{red}\*}}$$ | Tên sản phẩm                                                                                                                                                                                                                                                                                                                                                                             |
| shippingWeight | int                                | Cân nặng cả vỏ hộp tính bằng gram, được sử dụng để tính phí vận chuyển khi đặt hàng.                                                                                                                                                                                                                                                                                                     |
| vat            | int                                | % thuế giá trị gia tăng (VD: 10)                                                                                                                                                                                                                                                                                                                                                         |
| price          | int $$^{{\color{red}\*}}$$         | Giá bán của sản phẩm                                                                                                                                                                                                                                                                                                                                                                     |
| importPrice    | int                                | Giá nhập của sản phẩm                                                                                                                                                                                                                                                                                                                                                                    |
| wholesalePrice | int                                | Giá bán buôn của sản phẩm                                                                                                                                                                                                                                                                                                                                                                |
| status         | string                             | Xem bảng mô tả [trạng thái sản phẩm](/v2#trang-thai-san-pham)                                                                                                                                                                                                                                                                                                                            |
| categoryId     | int                                | ID danh mục sản phẩm                                                                                                                                                                                                                                                                                                                                                                     |
| oldPrice       | int                                | Giá cũ sản phẩm                                                                                                                                                                                                                                                                                                                                                                          |
| description    | text                               | Mô tả sản phẩm                                                                                                                                                                                                                                                                                                                                                                           |
| content        | text                               | Nội dung chi tiết sản phẩm                                                                                                                                                                                                                                                                                                                                                               |
| externalImages | string                             | <p>Đường dẫn ảnh cho sản phẩm từ CDN khác không thuộc Nhanh.vn<br>VD: imageLinks = \[ "<https://external.cdn.com/product/image1.jpg>",<br>"<https://external.cdn.com/product/image2.jpg>" ].<br>Lưu ý: externalImages pararm chỉ dùng khi thêm mới sản phẩm. Cập nhật thêm ảnh cho sản phẩm vui lòng sử dụng API: <a href="/v2/product/externalimage">/api/product/externalimage</a></p> |

## Response

The response: JSON decode the response to get the structure:

```php
[
    "ids" => [
        "id sản phẩm website tích hợp 1" => "id sản phẩm trên Nhanh 1",
        "id sản phẩm website tích hợp 2" => "id sản phẩm trên Nhanh 2",
        ...
    ]
    "barcodes" => [
        "id sản phẩm website tích hợp 1" => "mã vạch sản phẩm trên Nhanh 1",
        "id sản phẩm website tích hợp 2" => "mã vạch sản phẩm trên Nhanh 2",
        ...
    ]
]
```


# Chi tiết sản phẩm

* /api/product/detail: Tính năng này dùng để lấy thông tin chi tiết của sản phẩm. Nếu sản phẩm được đồng bộ từ Nhanh.vn sang website của bạn, đôi khi bạn sẽ muốn lấy thêm thông tin chi tiết của sản phẩm đó.

## Request

* Xem các [common request params](/v2#request-params)
* The search param: data = productId (int) - ID sản phẩm trên Nhanh.vn

![API chi tiết sản phẩm](https://40622576-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhIoEj3yOAgRRsZcqGM-887967055%2Fuploads%2Fgit-blob-ce91379aa6a476085c41b681209e0763abd21d89%2Fpostman_api_ProductDetail_2.jpg?alt=media)

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                                                                            |
| -------- | ----- | -------------------------------------------------------------------------------------- |
| code     | int   | 1 = success or 0 = failed                                                              |
| messages | array | is an array of error messages if code = 0                                              |
| data     | array | is an array of the parent and all child products (if the requested has child products) |

```javascript
data = [
    [
        // all properties are listed in the table below
    ],
    ...
]
```

| Key                | Type        | Description                                                                                   |
| ------------------ | ----------- | --------------------------------------------------------------------------------------------- |
| idNhanh            | bigint(20)  | ID sản phẩm trên Nhanh.vn                                                                     |
| merchantCategoryId | int         | ID danh mục sản phẩm trên các site tích hợp (tính năng này hiện chỉ phục vụ cho các sàn TMĐT) |
| merchantProductId  | int         | ID sản phẩm phi độc quyền (tính năng này chỉ phục vụ cho các sàn TMĐT)                        |
| categoryId         | int         | ID danh mục sản phẩm trên Nhanh.vn                                                            |
| brandId            | int         | ID thương hiệu trên Nhanh.vn                                                                  |
| brandName          | brand       | Tên thương hiệu trên Nhanh.vn                                                                 |
| parentId           | bigint(20)  | -1 = Sản phẩm độc lập, -2 = Sản phẩm cha                                                      |
| code               | string(255) | Mã sản phẩm                                                                                   |
| barcode            | string(255) | Mã vạch sản phẩm                                                                              |
| name               | string(255) | Tên sản phẩm                                                                                  |
| otherName          | string(255) | Tên khác của sản phẩm                                                                         |
| importPrice        | double      | Giá nhập                                                                                      |
| oldPrice           | double      | Giá cũ                                                                                        |
| price              | double      | Giá bán lẻ                                                                                    |
| wholesalePrice     | double      | Giá bán buôn                                                                                  |
| vat                | int         | % thuế giá trị gia tăng (VD: 10)                                                              |
| image              | string(255) | Đường dẫn tuyệt đối của ảnh đại diện                                                          |
| images             | array       | Đường dẫn tuyệt đối của các ảnh khách của sản phẩm                                            |
| status             | string      | Trạng thái của sản phẩm: Active \| Inactive \| OutOfStock                                     |
| previewLink        | string      | Link chi tiết của sản phẩm trên website (if status is Active)                                 |
| description        | string      | Mô tả ngắn của sản phẩm                                                                       |
| highlight          | array       | Đặc điểm nội bật của sản phẩm                                                                 |
| content            | string      | Bài viết chi tiết của sản phẩm                                                                |
| showHot            | int         | (Giá trị 0 \| 1) Sản phẩm được đánh dấu là sản phẩm hot                                       |
| showNew            | int         | (Giá trị 0 \| 1) Sản phẩm được đánh dấu là sản phẩm mới                                       |
| showHome           | int         | (Giá trị 0 \| 1) Sản phẩm được đánh dấu hiển thị ở trang chủ                                  |
| width              | int         | in cm                                                                                         |
| height             | int         | in cm                                                                                         |
| warrantyAddress    | string      | Địa chỉ bảo hành                                                                              |
| warrantyPhone      | string      | Số điện thoại bảo hành                                                                        |
| warranty           | int         | Số tháng bảo hành                                                                             |
| warrantyContent    | string      | Nội dung bảo hành                                                                             |
| length             | int         | in cm                                                                                         |
| shippingWeight     | int         | in gram                                                                                       |
| createdDateTime    | datetime    | Định dạng: yyyy-mm-dd hh:mm:ss                                                                |
| inventory          | array       | Thông tin tồn kho: xem ở bảng Inventory bên dưới                                              |
| attributes         | array       | Xem bảng [Attributes](#attributes) bên dưới                                                   |
| websiteInfo        | array       | Thông tin websiteInfo: xem ở bảng website info bên dưới                                       |
| typeId             | int         | ID loại sản phẩm                                                                              |
| typeName           | string      | Loại sản phẩm                                                                                 |

### Inventory

```javascript
[
    // Tổng tồn trong tất cả các kho
    "remain" => int, // số lượng tồn kho
    "shipping" => int, // số lượng đang giao hàng
    "holding" => int, // số lượng đang tạm giữ
    "damage" => int, // số lượng lỗi
    "available" => int, // số lượng có thể bán (sử dụng để hiển thị trên website,chặn đặt hàng khi hết số tồn hoặc vượt quá số tồn).
    // Tồn tại từng kho
    "depots" => [
        "depotId1" => [
            "remain" => int, // số lượng tồn kho
            "shipping" => int, //  số lượng đang giao hàng
            "holding" => int, // số lượng đang tạm giữ
            "damage" => int, //  số lượng lỗi
            "available" => int, // số lượng có thể bán (sử dụng để hiển thị trên website, chặn đặt hàng khi hết số tồn hoặc vượt quá số tồn).
            "transfering" => int, // Số lượng đang chuyển kho
        ],
        "depotId2" => [
            ...
        ],
        ...
    ]
]
```

### Website info

```javascript
[
    "metaTitle" => string, // metaTitle content
    "metaDescription" => string, // metaDescription content
    "metaKeywords" => string, // metaKeywords content
    "highlights" => array, // Đặc điểm nổi bật sản phẩm ( ['đặc điểm 1', 'Đặc điểm 2', ...] )
    "tags" => array, // tags sản phẩm ( ['tag 1', 'tag 2', ...] )
    "videos" => array // videos sản phẩm
]
```

### Attributes

* Thuộc tính sản phẩm:

```javascript
[
	{
		"id_thuoc_tinh" => {
			"attributeName" => string,
			"id" => int,
			"name" => string,
			"order" => int
		},
		"id_thuoc_tinh" => {
			"attributeName" => string,
			"id" => int,
			"name" => string,
			"order" => int
			"parent" => { // parent attribute
				"id" => int,
				"name" => string
			}
		}
	}
]
```


# Danh mục sản phẩm

* /api/product/category: Tính năng này được sử dụng để lấy toàn bộ danh mục sản phẩm trên Nhanh.vn.
* Danh mục sản phẩm thường rất ít khi bị thay đổi, bạn có thể lấy dữ liệu và cache khoảng 24h (và có chức năng để user có thể xóa cache, để lấy dữ liệu mới nhất khi cần) giúp giảm tải việc gọi API.

## Request

* Xem các [common request params](/v2#request-params)
* Fixed **dataString** = "productcategory"

## Response

* JSON decode the response to get the structure:

| Key      | Type  | Description                                   |
| -------- | ----- | --------------------------------------------- |
| code     | int   | 1 = success or 0 = failed                     |
| messages | array | is an array of error messages if code = 0     |
| data     | array | is an array of product category (multi-level) |

Mảng đệ quy toàn bộ danh mục của doanh nghiệp

```javascript
data = [
    // category 1
    [
        "id" => int, // ID danh mục
        "parentId" => int, // ID danh mục cha
        "code" => string, // Mã danh mục
        "name" => string, // Tên danh mục
        "order" => int, // Thứ tự
        "image" => string, // Link ảnh danh mục
        "content" => string, // Mô tả danh mục
        "status" => int // Trạng thái: 1 = Active, 2 = Inactive
        "childs" => [ // array mảng các danh mục con
            [
                "id" => int, // ID danh mục con
                "parentId" => int, // ID danh mục cha
                "code" => string, // Mã danh mục
                "name" => string, // Tên danh mục con
                "image" => string, // Link ảnh danh mục con
                "content" => string, // Mô tả danh mục con
                "status" => int // Trạng thái: 1 = Active, 2 = Inactive
                "childs" => [
                    
                ]
            ],
            ...
        ]
    ],
    // category 2
    // ...
]
```


# Danh mục nội bộ

* /api/product/internalcategory: Tính năng này được sử dụng để lấy toàn bộ danh mục nội bộ trên Nhanh.vn.
* Danh mục nội bộ thường rất ít khi bị thay đổi, bạn có thể lấy dữ liệu và cache khoảng 24h (và có chức năng để user có thể xóa cache, để lấy dữ liệu mới nhất khi cần) giúp giảm tải việc gọi API.

## Request

* Xem các [common request params](/v2#request-params)
* Fixed **dataString** = "internalcategory"

## Response

* JSON decode the response to get the structure:

| Key      | Type  | Description                                    |
| -------- | ----- | ---------------------------------------------- |
| code     | int   | 1 = success or 0 = failed                      |
| messages | array | is an array of error messages if code = 0      |
| data     | array | is an array of internal category (multi-level) |

Mảng đệ quy toàn bộ danh mục nội bộ của doanh nghiệp

```javascript
data = [
    // internal category 1
    [
        "id" => int, // ID danh mục nội bộ
        "parentId" => int, // ID danh mục nội bộ cha
        "name" => string, // Tên danh mục nội bộ
        "code" => string, // Mã danh mục nội bộ
        "childs" => [ // array mảng các danh mục nội bộ con
            [
                "id" => int, // ID danh mục nội bộ con
                "parentId" => int, // ID danh mục nội bộ cha
                "name" => string, // Tên danh mục nội bộ con
                "code" => string, // Mã danh mục nội bộ
                "childs" => [

                ]
            ],
            ...
        ]
    ],
    // internal category 2
    // ...
]
```


# Quà tặng sản phẩm

* /api/product/gift: Tính năng này dùng để lấy danh sách quà tặng theo sản phẩm. Hỗ trợ tìm kiếm thông qua ID sản phẩm.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key  | Type  | Description                                                          |
| ---- | ----- | -------------------------------------------------------------------- |
| page | int   | Phân trang (giá trị mặc định là 1)                                   |
| icpp | int   | Số lượng sản phẩm trên 1 trang. Mặc định là 10. Tối đa không quá 20. |
| ids  | array | Tìm kiếm theo ID sản phẩm có quà tặng                                |

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | Mảng danh sách sản phẩm có quà tặng       |

```javascript
data = [
    [
        "productId" => int, // id sản phẩm có quà tặng
        "productCode" => string, // mã sản phẩm có quà tặng
        "productName" => string, // tên sản phẩm có quà tặng
        "productGiftId" => int, // id sản phẩm quà tặng
        "productGiftCode" => string, //  mã sản phẩm quà tặng
        "productGiftName" => string, //  tên sản phẩm quà tặng
        "quantity" => int, // số lượng quà tặng
        "value" => int, // giá trị quà tặng (tính theo quantity = 1),
        "promotionFromDate" => string, // ngày bắt đầu chương trình,
        "promotionToDate" => string, // ngày kết thúc chương trình
        "promotionStatus" => int, // trạng thái chương trình( Trạng thái 1 = Active, 2 = Inactive)
        "promotionDepotIds" => array // danh sách cửa hàng được áp dụng (Vì có thể áp dụng offline, online riêng), VD [1,2,3]
    ],
    [...]
]
```

**Chú ý**: quantity của quà tặng có hệ số là 1. VD mua 1 sản phẩm A được tặng 2 sản phẩm B, thì nếu mua 2 sản phẩm A sẽ được tặng 4 sản phẩm B


# Danh sách IMEI

* /api/product/imei: Tính năng này dùng để lấy danh sách imei sản phẩm ở trên Nhanh.vn. Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 100 sản phẩm.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key       | Type   | Description                                                                                                                                                                     |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| page      | int    | Phân trang, giá trị mặc định sẽ là 1.                                                                                                                                           |
| icpp      | int    | Số lượng sản phẩm trên 1 trang. Tối đa không quá 50. Mặc định nếu không set giá trị gì sẽ là 20.                                                                                |
| productId | int    | ID sản phẩm /api/product/search                                                                                                                                                 |
| depotId   | int    | Tìm theo ID cửa hàng /api/store/depot                                                                                                                                           |
| status    | int    | Tìm theo trạng thái IMEI sản phẩm. Giá trị có thể là: 1: Mới 2: Đã bán 3: Đang vận chuyển 5: Lỗi 6: Đã trả nhà cung cấp 8: Đang chuyển kho 9: Đang bảo hành 10: Đã trả bảo hành |
| imeiCode  | string | Tìm chính xác theo mã IMEI                                                                                                                                                      |

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of product imei list          |

```javascript
data = [
    totalPages: int,
    products: [
        [ ], // each product item, all properties are listed in the table below
        ...
    ]
]
```

### Products

| Key                    | Type       | Description                                                                   |
| ---------------------- | ---------- | ----------------------------------------------------------------------------- |
| idNhanh                | bigint(20) | ID sản phẩm trên Nhanh.vn                                                     |
| productName            | string     | Tên sản phẩm                                                                  |
| productCode            | string     | Mã sản phẩm                                                                   |
| productBarcode         | string     | Mã vạch sản phẩm                                                              |
| depotId                | int        | ID cửa hàng                                                                   |
| depotName              | string     | Tên cửa hàng                                                                  |
| imeiCode               | string     | Imei sản phẩm                                                                 |
| price                  | int        | Giá bán sản phẩm                                                              |
| importPrice            | int        | Giá nhập sản phẩm                                                             |
| description            | string     | Mô tả sản phẩm                                                                |
| status                 | int        | Trạng thái sản phẩm                                                           |
| statusName             | string     | Tên trạng thái sản phẩm                                                       |
| warrantyMonths         | int        | Số tháng bảo hành                                                             |
| extendedWarrantyId     | int        | ID gói bảo hành mở rộng                                                       |
| extendedWarrantyName   | string     | Tên gói bảo hành mở rộng                                                      |
| extendedWarrantyMonths | int        | Số tháng bảo hành mở rộng                                                     |
| warrantyExpiredDate    | date       | Ngày hết hạn bảo hành                                                         |
| createdById            | int        | Người tạo                                                                     |
| createdDateTime        | date       | Ngày tạo                                                                      |
| activatedById          | int        | Người kích hoạt                                                               |
| activatedByDateTime    | date       | Ngày kích hoạt                                                                |
| imeiHistories          | array      | Xem bảng [Histories](#histories) bên dưới (Chỉ trả về khi lọc chính xác Imei) |

### Histories

| Key             | Type   | Description      |
| --------------- | ------ | ---------------- |
| step            | int    | Hành động        |
| itemTypeName    | string | Tên loại         |
| itemId          | string | Mã loại          |
| productId       | string | ID sản phẩm      |
| productName     | string | Tên sản phẩm     |
| productCode     | string | Mã sản phẩm      |
| productBarcode  | string | Mã vạch sản phẩm |
| createdById     | int    | ID người tạo     |
| createdByName   | string | Người tạo        |
| createdDateTime | date   | Ngày tạo         |


# Tra cứu IMEI bán ra theo ngày

* /api/product/imeisold: Tính năng này dùng để tra cứu danh sách IMEI bán ra theo ngày ở trên Nhanh.vn. Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 50 IMEI.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key        | Type   | Description                                                                                      |
| ---------- | ------ | ------------------------------------------------------------------------------------------------ |
| page       | int    | Phân trang, giá trị mặc định sẽ là 1.                                                            |
| icpp       | int    | Số lượng sản phẩm trên 1 trang. Tối đa không quá 50. Mặc định nếu không set giá trị gì sẽ là 50. |
| fromDate   | string | Ngày bán imei (từ ngày) định dạng yyyy-mm-dd                                                     |
| toDate     | string | Ngày bán imei (đến ngày) định dạng yyyy-mm-dd                                                    |
| productIds | int    | Tìm theo ID những sản phẩm /api/product/search                                                   |
| brandId    | int    | Tìm theo thương hiệu                                                                             |
| imei       | string | Tìm theo IMEI                                                                                    |

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of product imei list          |

```javascript
data = [
    [
        "imei" => string, // IMEI number
        "soldDate" => string, // Ngày bán ra
        "depotId" => int, // ID cửa hàng bán ra
        "depotName" => string, // Tên cửa hàng bán ra
        "mode" => int, // loại xuất bán" => 1 = Chuyển hàng, 2 = Bán lẻ, 6 = Bán sỉ
        "modeName" => string, // Chuyển hàng || Bán lẻ || bán sỉ,
        "productName" => string, // Tên sản phẩm
        "productPrice" => double, // Giá sản phẩm
        "customer" => [ // Thông tin khách hàng
            "id" => int, // ID khách hàng
            "code" => string, // Mã khách hàng
            "phone" => string, // Điện thoại khách hàng
            "name" => string, // Tên khách hàng
            "email" => string, // Email khách hàng
            "address" => string // Địa chỉ khách hàng
        ]
    ],
    ...
]
```


# Lịch sử IMEI

* /api/product/imeihistory: Tính năng này dùng để lấy danh sách lịch sử của IMEI trên Nhanh.vn. Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 100 lịch sử.

## Request

* See [common request params](/v2#request)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key  | Type                          | Description                                                                                     |
| ---- | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| page | int                           | Phân trang, giá trị mặc định sẽ là 1.                                                           |
| icpp | int                           | Số lượng lịch sử trên 1 trang. Tối đa không quá 50. Mặc định nếu không set giá trị gì sẽ là 20. |
| imei | string $$^{{\color{red}\*}}$$ | IMEI sản phẩm                                                                                   |
| step | int                           | Hành động IMEI Xem bảng [Steps](#steps) bên dưới                                                |

## Response

JSON decode the response to get the structure:

| Key      | Type | Description                               |
| -------- | ---- | ----------------------------------------- |
| code     | int  | 1 = success or 0 = failed                 |
| messages | \[ ] | is an array of error messages if code = 0 |
| data     | \[ ] | is an array of product imei list          |

```javascript
data = [
    totalPages: int,
    histories: [
        [], // each history item, all properties are listed in the table below
        ...
    ]
]
```

### Histories

| Key             | Type     | Description                                     |
| --------------- | -------- | ----------------------------------------------- |
| step            | Int      | Hành động Xem bảng [Steps](#steps) bên dưới     |
| stepName        | String   | Tên hành động Xem bảng [Steps](#steps) bên dưới |
| itemType        | String   | Loại                                            |
| itemId          | Int      | itemId                                          |
| productName     | String   | Tên sản phẩm                                    |
| productCode     | String   | Mã sản phẩm                                     |
| productBarcode  | String   | Mã vạch sản phẩm                                |
| supplier        | String   | Nhà cung cấp                                    |
| sale            | String   | Nhân viên bán hàng                              |
| createdBy       | String   | Người tạo                                       |
| createdDateTime | Datetime | Ngày tạo                                        |

### Steps

| Key | Hành động                    |
| --- | ---------------------------- |
| 1   | Mới                          |
| 2   | Bán hàng                     |
| 3   | Kích hoạt                    |
| 4   | Bảo hành                     |
| 5   | Trả bảo hành                 |
| 6   | NVBH lập phiếu               |
| 7   | Đã kích hoạt                 |
| 8   | Hủy kích hoạt                |
| 9   | Khách trả lại hàng           |
| 10  | Nhập nhà cung cấp            |
| 11  | Trả nhà cung cấp             |
| 12  | Xuất chuyển kho              |
| 13  | Bán hàng nội bộ              |
| 14  | Mua máy cũ                   |
| 15  | Đổi sản phẩm                 |
| 17  | Nhập chuyển kho              |
| 18  | XNK khác                     |
| 19  | Sửa thông tin                |
| 20  | Nhập bù trừ kiểm kho         |
| 21  | Xuất bù trừ kiểm kho         |
| 22  | Thêm đơn hàng                |
| 23  | Sửa đơn hàng                 |
| 24  | Xác nhận đơn hàng            |
| 25  | Nhặt hàng                    |
| 26  | Cập nhật trạng thái đơn hàng |
| 27  | Xóa sản phẩm trong đơn hàng  |
| 28  | Xóa đơn hàng                 |
| 29  | Đổi IMEI trong hóa đơn       |
| 30  | Đổi IMEI trong đơn hàng      |
| 31  | Chuyển trung tâm bảo hành    |
| 31  | Nhận từ trung tâm bảo hành   |
| 33  | Yêu cầu chuyển kho           |
| 34  | Hủy yêu cầu chuyển kho       |
| 35  | Đổi trạng thái               |
| 35  | Sửa bảo hành                 |
| 37  | Chưa trả bảo hành            |
| 38  | Duyệt yêu cầu chuyển kho     |
| 39  | Sửa ghi chú                  |


# Hạn sử dụng sản phẩm

* /api/product/expire: Tính năng này dùng để lấy hạn sử dụng sản phẩm ở trên Nhanh.vn. Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 50 sản phẩm.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key                | Type             | Description                                                                                      |
| ------------------ | ---------------- | ------------------------------------------------------------------------------------------------ |
| page               | int              | Phân trang, giá trị mặc định sẽ là 1.                                                            |
| icpp               | int              | Số lượng sản phẩm trên 1 trang. Tối đa không quá 50. Mặc định nếu không set giá trị gì sẽ là 30. |
| billId             | int              | ID hóa đơn trên Nhanh                                                                            |
| depotId            | int              | Tìm theo ID cửa hàng /api/store/depot                                                            |
| productName        | string(optional) | Tên/ Mã/ Mã vạch sản phẩm                                                                        |
| categoryId         | int(optional)    | ID danh mục sản phẩm                                                                             |
| internalCategoryId | int(optional)    | ID danh mục sản phẩm                                                                             |
| expiredFromDate    | date             | Tìm kiếm thời gian hết hạn bắt đầu từ ngày định dạng (yyyy-mm-dd). VD: 2022-09-25                |
| expiredToDate      | date             | Tìm kiếm thời gian hết hạn đến ngày (yyyy-mm-dd). VD: 2022-09-25                                 |
| fromDaysWarning    | int              | Số ngày cảnh báo từ ngày                                                                         |
| toDaysWarning      | int              | Số ngày cảnh báo đến ngày                                                                        |
| status             | int              | Tìm theo trạng thái sản phẩm. Giá trị có thể là: 1: Mới 2: Đã kiểm tra                           |

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of product imei list          |

```javascript
data = [
    totalPages: int,
    products: [
        [ ], // each product item, all properties are listed in the table below
        ...
    ]
]
```

### Products

| Key              | Type       | Description               |
| ---------------- | ---------- | ------------------------- |
| id               | bigint(20) | ID sản phẩm trên Nhanh.vn |
| depotName        | string     | Kho                       |
| productName      | string     | Tên sản phẩm              |
| billId           | int        | Bill ID                   |
| quantity         | float      | Số lượng                  |
| expiredDate      | date       | Hạn sử dụng               |
| priorWarningDays | int        | Số ngày cảnh báo trước    |
| status           | int        | Trạng thái                |


# Thêm ảnh sản phẩm

* API này dùng để thêm ảnh cho sản phẩm từ CDN khác không thuộc Nhanh.vn, thường dùng khi bạn có website riêng và có link ảnh trên website riêng, không upload ảnh lên Nhanh.vn
* Được thêm tối đa 10 sản phẩm mỗi request, mỗi sản phẩm tối đa 20 ảnh.
* Chú ý:
  * Nhanh.vn sẽ không tải các link ảnh này về Nhanh.vn mà dùng luôn đường dẫn link ảnh bạn bắn sang để hiển thị hoặc đồng bộ đi các chỗ khác.
  * Khi dùng tính năng đồng bộ Facebook Shop, nếu sản phẩm trên Nhanh.vn không có ảnh, nhưng có ảnh (external image) bắn từ API về, Nhanh.vn sẽ dùng external images này để bắn lên Facebook Shop. Facebook yêu cầu anh có độ phân giải tối thiếu từ 500 x 500px. Chú ý: Server xử lý ảnh này cần đảm bảo tốc độ ổn định: Tốc độ nhanh, không chặn các tool crawler của Facebook (thường là IP từ United States).

## Request

* URI: /api/product/externalimage. Xem các [common request params](/v2#request-params).
* Các key của mảng **data array** dùng để tạo **data** json string.
* Cho phép thêm ảnh cho nhiều sản phẩm cùng lúc

```javascript
data = [
    {
        "productId": int, // ID sản phẩm trên Nhanh.vn
        "externalImages": [
            "imagePath1", // link ảnh sản phẩm
            "imagePath2", // link ảnh sản phẩm
        ]
    },
    {
        "productId": int, // ID sản phẩm trên Nhanh.vn
        "externalImages": [
            "imagePath1", // link ảnh sản phẩm
            "imagePath2", // link ảnh sản phẩm
        ]
    },
    ...
]
```

| Key            | Type                          | Description                                                                                                                                                                                                                                                                                            |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| productId      | bigint $$^{{\color{red}\*}}$$ | ID sản phẩm trên Nhanh.vn                                                                                                                                                                                                                                                                              |
| mode           | string                        | <p>update (mặc định nếu không truyền giá trị) hoặc deleteall<br>- Mode update: Nhanh sẽ check nếu trên hệ thống chưa có ảnh trong mảng thì sẽ thêm mới. Các sản đã bắn sang trước đó, mà sau đó không tồn tại ở mảng mới, sẽ bị xóa khỏi hệ thống<br>- Mode deleteall: Xóa hết ảnh cũ của sản phẩm</p> |
| externalImages | array                         | <p>Link ảnh sản phẩm<br>VD:<br>imageLinks = \[ "<https://external.cdn.com/product/image1.jpg>",<br>"<https://external.cdn.com/product/image2.jpg>" ]</p>                                                                                                                                               |

### Sample request

```javascript
curl --location 'https://pos.open.nhanh.vn/api/product/externalimage' \
--form 'version="2.0"' \
--form 'appId="{{appId}}"' \
--form 'businessId="{{businessId}}"' \
--form 'accessToken="{{accessToken}}"' \
--form 'data="[{\"productId\":312311,\"externalImages\":[\"https://external.cdn.com/product/image1.jpg\",\"https://external.cdn.com/product/image2.jpg\"]},{\"productId\":312312,\"externalImages\":[\"https://external.cdn.com/product/image3.jpg\"]}]"'

```

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | Mảng ID sản phẩm trên Nhanh.vn            |

```php
[
    "code" => 1, // 1 is success, 0 is error
    "messages" => [], // error messages if code is 0
    "data" => [
        // int ID sản phẩm Nhanh.vn
        "productId1",
        "productId2",
        "productId3",
        ...
    ]
]
```


# Danh sách đơn hàng

* /api/order/index: Tính năng này dùng để lấy danh sách đơn hàng.
* **Chú ý:**
  * Hệ thống chỉ hỗ trợ lấy đơn hàng trong 10 ngày.
  * Hệ thống đang hỗ trợ lọc dữ liệu theo 3 loại ngày:
    * fromDate, toDate: Lọc theo ngày tạo đơn hàng.
    * fromDeliveryDate, toDeliveryDate: Lọc theo ngày giao hàng.
    * updatedDateTimeFrom, updatedDateTimeTo: Lọc theo ngày cập nhật đơn hàng.
  * Nếu bạn không truyền param fromDate mặc định sẽ lấy 10 ngày gần nhất. Nếu bạn muốn lấy dữ liệu các ngày cũ hơn, xin vui lòng truyền fromDate và toDate trong khoảng 10 ngày (VD: 2020-09-01 => 2020-09-10, 2020-09-11 => 2020-09-20).
  * Nếu bạn lọc theo id hoặc customerId hoặc customerMobile thì có thể bỏ qua việc bắt buộc lọc fromDate, toDate.
  * Nếu bạn hay thường xuyên cần gọi toàn bộ đơn hàng, bạn nên lưu giá trị thời gian lần cuối cùng quét toàn bộ, sau đó dùng 2 request params là updatedDateTimeFrom và updatedDateTimeTo để chỉ lấy về các đơn hàng có cập nhật mới, không cần gọi lại toàn bộ đơn cũ không có thay đổi gì. updatedDateTimeFrom và updatedDateTimeTo cũng bị giới hạn trong vòng 10 ngày, khi bạn lọc theo updatedDateTimeFrom và updatedDateTimeTo sẽ không bị bắt buộc có fromDate và toDate nữa.

## Request

* Xem các [common request params](/v2#request-params)
* VD dùng Postman lấy đơn hàng tạo trong ngày 2022-06-16, có phân trang, lấy dữ liệu ở trang 2:

![/api/order/index Postman sample](https://40622576-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhIoEj3yOAgRRsZcqGM-887967055%2Fuploads%2Fgit-blob-903272059d8145a54cc67994a4614eacf9787e6e%2Fapi-order-index_2.jpg?alt=media)

* Các key của mảng **data array** dùng để tạo **data** json string:

| Key                 | Type       | Description                                                                                                                                                                                                                                                                                                                                            |
| ------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| page                | int        | Phân trang (giá trị mặc định là 1)                                                                                                                                                                                                                                                                                                                     |
| icpp                | int        | Số lượng đơn hàng trên 1 trang. Mặc định là 100. Tối đa 100.                                                                                                                                                                                                                                                                                           |
| fromDate            | string     | Ngày tạo đơn hàng: Định dạng y-m-d.                                                                                                                                                                                                                                                                                                                    |
| toDate              | string     | Ngày tạo đơn hàng: Định dạng y-m-d.                                                                                                                                                                                                                                                                                                                    |
| id                  | int        | ID đơn hàng trên Nhanh.vn                                                                                                                                                                                                                                                                                                                              |
| customerMobile      | string     | điện thoại của người nhận hàng                                                                                                                                                                                                                                                                                                                         |
| customerId          | int        | Tìm kiếm theo ID khách hàng                                                                                                                                                                                                                                                                                                                            |
| statuses            | array      | Trạng thái đơn hàng xem [tại đây](/v2#order)                                                                                                                                                                                                                                                                                                           |
| fromDeliveryDate    | string     | Định dạng: Y-m-d. Ngày giao hàng                                                                                                                                                                                                                                                                                                                       |
| toDeliveryDate      | string     | Định dạng: Y-m-d. Ngày giao hàng                                                                                                                                                                                                                                                                                                                       |
| carrierId           | int        | id hãng vận chuyển (Lấy từ [/api/shipping/fee](/v2/shipping/shippingfee))                                                                                                                                                                                                                                                                              |
| carrierCode         | string(36) | Mã vận đơn hãng vận chuyển                                                                                                                                                                                                                                                                                                                             |
| type                | int        | <p>Loại đơn hàng:<br>1 = Giao hàng tận nhà.<br>12 = Đổi sản phẩm.<br>14 = Khách trả lại hàng.<br>15 = Hàng chuyển kho.<br>16 = Đơn hoàn một phần.<br>17 = Đền bù mất hàng.<br>2 = Mua tại quầy.<br>3 = Đặt trước.<br>4 = Dùng thử.<br>5 = Đổi quà.<br>10 = Xin báo giá.<br></p>                                                                        |
| customerCityId      | int        | Mã thành phố của người nhận hàng (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                              |
| customerDistrictId  | int        | Mã quận huyện của người nhận hàng (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                             |
| handoverId          | int        | ID biên bản bàn giao                                                                                                                                                                                                                                                                                                                                   |
| depotId             | int        | ID kho hàng trên Nhanh.vn                                                                                                                                                                                                                                                                                                                              |
| updatedDateTimeFrom | string     | Định dạng: Y-m-d H:i:s, Vd: 2022-05-25 00:00:00 Ngày cập nhật đơn hàng từ ngày                                                                                                                                                                                                                                                                         |
| updatedDateTimeTo   | string     | Định dạng: Y-m-d H:i:s, Vd: 2022-05-30 23:59:00 Ngày cập nhật đơn hàng đến ngày                                                                                                                                                                                                                                                                        |
| dataOptions         | array      | <p>Lựa chọn dữ liệu cần lấy thêm, VD "dataOptions":\["giftProducts"].<br>Các giá trị:<br>- giftProducts: Lấy thông tin quà tặng của sản phẩm trong đơn hàng.<br>- marketingUtm: Lấy thông tin utmSource, utmMedium, utmCampaign.<br>- productBatchs: Lấy thông tin sản phẩm lô: Tên lô, ngày hết hạn lô.<br>- comboItems: Thông tin sản phẩm combo</p> |

## Response

JSON decode the response to get the structure:

| Key      | Type | Description                               |
| -------- | ---- | ----------------------------------------- |
| code     | int  | 1 = success or 0 = failed                 |
| messages | \[ ] | is an array of error messages if code = 0 |
| data     | \[ ] | Mảng danh sách đơn hàng                   |

```javascript
data =
[
    "totalPages" => int, // Tổng số trang
    "totalRecords" => int, // Tổng số bản ghi tất cả các trang
    "page" => int, // Trang hiện tại
    "orders" => { // Danh sách đơn hàng trang hiện tại
         "orderId" => {
            // Đơn hàng 1
            "id" => int, // Id đơn hàng
            "privateId" => string, // Id website tích hợp (deprecated, nên dùng key mới là shopOrderId)
            "shopOrderId" => string, // Id website tích hợp
            "merchantTrackingNumber" => string, // Mã vận đơn web tích hợp
            "handoverId" => int, // Id biên bản
            "depotId" => int, // Id kho hàng
            "depotName" => string, // Tên kho hàng
            "typeId" => int, // mã loại đơn hàng
            "type" => string, // Loại đơn hàng (Shipping | Shopping)
            "moneyDiscount" => double, // Tiền chiết khấu
            "moneyDeposit" => double, // Tiền đặt cọc
            "moneyTransfer" => double, // Tiền chuyển khoản
            "usedPoints" => int, // Số điểm đã tiêu
            "moneyUsedPoints" => double, // Số tiền tiêu điểm đã tiêu
            "usedPointAmount" => int, // Số tiền tiêu điểm đã tiêu
            "serviceId" => int, // Mã dịch vụ vận chuyển
            "carrierId" => int, // Id hãng vận chuyển
            "carrierServiceType" => int, // Giá trị loại dịch vụ (5: Hỏa tốc, 10: Nhanh, 15: Tiết kiệm)
            "carrierServiceTypeName" => string, // Tên loại dịch vụ
            "carrierCode" => string, // Mã vận đơn, đơn hàng đã bắn sang hãng vận chuyển mới có thông tin mã vận đơn.
            "carrierName" => string, // Tên hãng vận chuyển
            "carrierServiceName" => string, // Dịch vụ vân chuyển
            "shipFee" => double, // Phí vận chuyển,
            "codFee" => double, // Phí thu tiền hộ,
            "declaredFee" => double, // Phí bảo hiểm (Nếu đơn có mua bảo hiểm và hãng có thu phí bảo hiểm)
            "customerShipFee" => double,// Phí thu của khách,
            "returnFee" => double,// Phí chuyển hoàn,
            "overWeightShipFee" => double,// Phí vượt cân,
            "description" => string, // ghi chú của khách hàng
            "privateDescription" string, // ghi chú nội bộ
            "customerId" => int, // Mã khách hàng
            "customerName" => string, // Tên khách hàng
            "customerMobile" => string, // Họ tên khách hàng
            "customerEmail" => string, // Email khách hàng
            "customerAddress" => string, // Địa chỉ khách hàng
            "customerCityId" => int, // Mã tỉnh
            "customerCity" => string, // Thành phố
            "customerDistrictId" => int, // Mã quận/huyện
            "customerDistrict" => string, // Quận huyện
            "createdById" => int, // ID người tạo đơn
            "createdByName" => string,// Người tạo đơn
            "createdDateTime" => string, // Thời gian tạo đơn hàng VD 2021-12-22 09:30:21
            "deliveryDate" => string, // Ngày giao hàng, VD 2021-12-24
            "statusCode" => string, // Mã trạng thái
            "statusName" => string, // Trạng thái đơn hàng
            "calcTotalMoney" => double, // Tổng thu của khách
            "trafficSourceId" => int, // Id nguồn đơn hàng
            "trafficSourceName" => string, // Tên nguồn đơn hàng
            "saleId" => int, // ID nhân viên bán hàng
            "saleName" => string, // Tên nhân viên bán hàng,
            "returnFromOrderId" => int, // với đơn loại trả hàng, có thể có thêm thuộc tính này để biết trả từ đơn hàng nào
            "affiliateCode" => string, // mã giới thiệu
            "affiliateBonusCash" => int, // tiền hoa hồng được hưởng theo mã giới thiệu
            "affiliateBonusPercent" => int, // phần trăm hoa hồng được hưởng theo mã giới thiệu,
            "tags" => array, // [tagName1, tagName2...] mảng các nhãn của đơn hàng
            "saleChannel" => int, // Kênh bán phát sinh đơn hàng. Xem bảng Sale channels bên dưới
            "ecomShopId" => string // ID shop ecommerce
            "couponCode" => string, // Mã coupon,
            "products" => array, // Xem bảng Order product bên dưới
            "utmSource" => string, // utm Source,
            "utmMedium" => string, // utm Medium,
            "utmCampaign" => string, // utm Campaign
            "facebook" => [
                "pageId" => string, // FB page id
                "conversationId" => string, // id hội thoại trên Vpage
                "adId" => string, // id quảng cáo mới nhất của hội thoại tạo ra đơn hàng
                "postId" => string, // id bài viết trên FB
                "psId" => string // FB PSID
            ],
            "updatedAt" => int, // ngày cập nhật đơn hàng, định dạng timestamp
            "packed" => [
                "id" => int, // ID người đóng gói
                "datetime" => string // Thời gian đóng gói
            ],
            "vat" => [
                "value" => int, // Giá trị VAT
                "amount" => int, // Số tiền VAT
                "type" => string, // Loại VAT (percent: Phần trăm, cash: Tiền mặt)
                "taxCode" => string, // Số hóa đơn VAT
                "taxDate" => string, // Ngày xuất hóa đơn VAT
            ],
            "gifts" => [
                {
                    "productId" => int, // ID sản phẩm
                    "orderProductId" => int, // ID sản phẩm trong đơn hàng (Giá trị lớn hơn 0 là quà tặng theo sản phẩm, Giá trị bằng 0 là quà tặng theo đơn hàng)
                    "name" => string, // Tên sản phẩm
                    "quantity" => int, // Số lượng
                    "price" => int // Giá trị
                }
            ]
        },
        "orderId" => {
            // Đơn hàng 2
        },
        // ...
    }
]
```

* Chú ý:
  * Phí trả hãng vận chuyển bằng tổng tất cả các loại phí: shipFee + codFee + declaredFee + returnFee + overWeightShipFee.

### Order product

```javascript
    [
        "productId" => int, // ID sản phẩm
        "productName" => string, // Tên sản phẩm
        "productCode" => int, // Mã sản phẩm
        "productBarcode" => string, // Mã vạch sản phẩm
        "price" => double, // Giá sản phẩm
        "quantity" => double, // Số lượng sản phẩm
        "weight" => int , // Trọng lượng sản phẩm
        "imei" => string, // IMEI của sản phẩm
        "vat" => int, // VAT của sản phẩm
        "discount" => double, // Chiết khấu theo sản phẩm
        "description" => string, // Mô tả sản phẩm
        "giftProducts" => array, // thông tin quà tặng sản phẩm
        "batch" => array, // thông tin lô hàng sản phẩm
        "comboItems" => array, // thông tin sản phẩm con của sản phẩm combo
        "productMoney" => int, // Tổng tiền sản phẩm sau khi cộng VAT, trừ chiết khấu
        "priceOriginal" => double // Giá gốc của sản phẩm,
        "avgCost" => double // Giá vốn của sản phẩm
    ],
    [
        // Sản phẩm 2
    ],
    // ...
```

### Sale channels

* Danh sách các kênh bán

| Sale channel ID | Sale channel                                                                |
| --------------- | --------------------------------------------------------------------------- |
| 1               | Admin                                                                       |
| 2               | Website                                                                     |
| 10              | API                                                                         |
| 20              | Facebook (Khi tạo đơn hàng từ [vpage.nhanh.vn](https://vpage.nhanh.vn))     |
| 21              | Instagram (Khi tạo đơn hàng từ [vpage.nhanh.vn](https://vpage.nhanh.vn))    |
| 41              | Lazada.vn                                                                   |
| 42              | Shopee.vn                                                                   |
| 43              | Sendo.vn                                                                    |
| 45              | Tiki.vn                                                                     |
| 46              | Zalo Shop                                                                   |
| 47              | 1Landing.vn                                                                 |
| 48              | Tiktok Shop                                                                 |
| 49              | Zalo OA (Khi tạo đơn hàng từ [vpage.nhanh.vn](https://vpage.nhanh.vn))      |
| 50              | Shopee Chat (Khi tạo đơn hàng từ [vpage.nhanh.vn](https://vpage.nhanh.vn))  |
| 51              | Lazada Chat (Khi tạo đơn hàng từ [vpage.nhanh.vn](https://vpage.nhanh.vn))  |
| 52              | Zalo cá nhân (Khi tạo đơn hàng từ [vpage.nhanh.vn](https://vpage.nhanh.vn)) |


# Thêm đơn hàng

* /api/order/add: Tính năng này dùng để gửi thông tin đơn hàng từ website của bạn sang Nhanh.vn. Khi khách hàng đặt hàng trên website của bạn, sau khi lưu thông tin đơn hàng vào cơ sở dữ liệu, website của bạn gửi thông tin đơn hàng sang Nhanh.vn, sau đó chủ gian hàng có thể xử lý toàn bộ các bước từ việc xác nhận đơn hàng, nhặt hàng và đóng gói, gửi đơn hàng sang hãng vận chuyển, đối soát tình trạng thanh toán (tiền thu hộ) các đơn hàng với hãng vận chuyển bên trong hệ thống Nhanh.vn.
* Đơn hàng tạo từ API nếu có gắn kho hàng (depotId) sẽ áp dụng các logic tính số Tạm giữ và Đang chuyển như đơn tạo từ trang quản trị. VD 1 sản phẩm trên hệ thống đang tồn 10, tạm giữ 1, sau khi API có bắn về thêm 1 đơn hàng trạng thái **Mới**, số lượng = 1, **có gắn depotId**, thì hệ thống sẽ tự động tính toán lại số Tạm giữ = 2.
* Mỗi khi trạng thái đơn hàng có sự thay đổi, website của bạn sẽ nhận được 1 [webhooks cập nhật trạng thái đơn hàng từ Nhanh.vn](/v2/webhooks/order).

## Request

* Xem [common request params](/v2#request-params).
* Xem [/api/order/add - Postman sample](https://www.postman.com/nhanh-vn/workspace/open-nhanh-vn/request/23766734-23d9dc59-5574-43a2-bd9c-516e18d37b81?tab=body)
* Các key của mảng **data array** dùng để tạo **data** json string:
  * Chú ý: Nhanh.vn hỗ trợ 2 hình thức kết nối vận chuyển, có sự khác nhau về request params:
    * Dùng luôn bảng cước ưu đãi của Nhanh.vn
      * Để tính phí vận chuyển cho đơn hàng: Dùng [/api/shipping/fee](/v2/shipping/shippingfee)
      * request params gửi đơn hàng sang Nhanh: bạn set sendCarrierType = 1, set đúng carrierId và carrierServiceId muốn dùng (đọc thêm ở bảng bên dưới).
    * Dùng bảng cước riêng shop tự ký hợp đồng với hãng vận chuyển
      * Để tính phí vận chuyển cho đơn hàng: Dùng [/api/shipping/feeselfconnect](/v2/shipping/shippingfee#tinh-phi-tu-ket-noi)
      * request params gửi đơn hàng sang Nhanh: bạn set sendCarrierType = 2, set đúng carrierAccountId, carrierShopId,và carrierServiceCode muốn dùng (đọc thêm ở bảng bên dưới).

| Key                      | Type                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------ | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                       | string(36) $$^{{\color{red}\*}}$$  | id đơn hàng trên website của bạn                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| depotId                  | int                                | id kho hàng trên Nhanh.vn (Lấy từ [/api/store/depot](/v2/store/depot))                                                                                                                                                                                                                                                                                                                                                                                            |
| type                     | string                             | Loại đơn hàng, giá trị có thể là: “Shipping” (Chuyển hàng) hoặc “Shopping” (Khách tới mua tại cửa hàng) “PreOrder”(Khách đặt hàng trước). Giá trị mặc định là Shipping.                                                                                                                                                                                                                                                                                           |
| customerName             | string(255) $$^{{\color{red}\*}}$$ | Tên người nhận hàng                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| customerMobile           | string(255) $$^{{\color{red}\*}}$$ | Mobile của người nhận hàng. Hệ thống sẽ dựa vào số điện thoại để kiểm tra khách hàng đã tồn tại hay chưa, nếu chưa tồn tại, hệ thống sẽ tự động tạo khách hàng.                                                                                                                                                                                                                                                                                                   |
| customerEmail            | string(255)                        | Địa chỉ email đặt hàng                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| customerAddress          | string(255)                        | Địa chỉ người nhận hàng                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| customerCityName         | string(255)                        | Tên thành phố của người nhận hàng (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                                                                                                                                        |
| customerDistrictName     | string(255)                        | Tên quận huyện của người nhận hàng (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                                                                                                                                       |
| customerWardLocationName | string                             | Phường xã người nhận (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                                                                                                                                                     |
| moneyDiscount            | double                             | Tiền chiết khấu                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| moneyTransfer            | double                             | Số tiền khách chuyển khoản                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| moneyTransferAccountId   | int                                | Tài khoản nhận tiền chuyển khoản                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| moneyDeposit             | double                             | Số tiền khách đặt cọc                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| moneyDepositAccountId    | int                                | Tài khoản nhận tiền đặt cọc                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| paymentMethod            | string                             | Các giá trị có thể là: COD //Thanh toán tại nhà Store // Thanh toán tại cửa hàng Gateway // Thanh toán qua cổng thanh toán Online // thanh toán Online                                                                                                                                                                                                                                                                                                            |
| paymentCode              | string(255)                        | Mã giao dịch thanh toán                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| paymentGateway           | string(255)                        | Tên cổng thanh toán                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| carrierId                | int                                | id hãng vận chuyển (Lấy từ [/api/shipping/fee](/v2/shipping/shippingfee)) hoặc set = 12 nếu muốn chọn Tự vận chuyển                                                                                                                                                                                                                                                                                                                                               |
| carrierServiceId         | int                                | dịch vụ vận chuyển (Lấy từ [/api/shipping/fee](/v2/shipping/shippingfee))                                                                                                                                                                                                                                                                                                                                                                                         |
| customerShipFee          | int                                | Phí ship báo khách (Bạn có thể điền 0 nếu báo với khách hàng là miễn phí vận chuyển, hoặc điền các giá trị cố định như 20K, 30K, hoặc lấy theo tổng Phí vận chuyển shipFee + phí thu tiền hộ codFee + phí bảo hiểm declaredFee lấy từ [/api/shipping/fee](/v2/shipping/shippingfee)) )                                                                                                                                                                            |
| deliveryDate             | date                               | Ngày giao hàng của đơn hàng này, định dạng yyyy-mm-dd                                                                                                                                                                                                                                                                                                                                                                                                             |
| status                   | string                             | Trạng thái của đơn hàng: New (Mới) hoặc Confirming (Đang xác nhận) hoặc Confirmed (Đã xác nhận).                                                                                                                                                                                                                                                                                                                                                                  |
| description              | string(255)                        | Ghi chú của khách hàng về đơn hàng này                                                                                                                                                                                                                                                                                                                                                                                                                            |
| privateDescription       | string(255)                        | Ghi chú của chăm sóc khách hàng (Nội bộ)                                                                                                                                                                                                                                                                                                                                                                                                                          |
| trafficSource            | string                             | Nguồn truy cập đơn hàng, bạn có thể đánh dấu xem đơn hàng đến từ nguồn nào qua referrer hoặc marketing campaign (utm\_source, utm\_medium, utm\_campaign) và gửi kèm thông tin này theo đơn hàng để xem báo cáo thống kê theo nguồn truy cập ở bên Nhanh.vn                                                                                                                                                                                                       |
| productList              | array                              | Xem bảng dữ liệu bên dưới. Danh sách sản phẩm của đơn hàng là không bắt buộc, để hỗ trợ cả các đơn đồng bộ từ landing về, CSKH vẫn có số điện thoại để gọi điện tư vấn.                                                                                                                                                                                                                                                                                           |
| couponCode               | string                             | Mã coupon. Chú ý: Mã này không bắt buộc phải có ở trên Nhanh, bạn có thể nhập mã bất kỳ, tự tính toán số tiền chiết khấu của mã coupon và truyền chiết khấu vào mục moneyDiscount.                                                                                                                                                                                                                                                                                |
| allowTest                | int                                | <p>1 - Cho xem hàng, không cho thử<br>2 - Cho phép thử<br>3 - Không cho xem hàng<br>4 - Cho xem, không lấy thu ship</p>                                                                                                                                                                                                                                                                                                                                           |
| saleId                   | int                                | Nhân viên bán hàng                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| autoSend                 | int                                | Biến đánh dấu gửi luôn đơn hàng sang hãng vận chuyển (Dùng trong tình huống bạn có hệ thống xác nhận đơn hàng từ trước, chỉ dùng Nhanh để hỗ trợ vận chuyển). Set value = 1: Gửi luôn đơn hàng sang hãng vận chuyển. Nếu gửi thành công hệ thống sẽ trả về mã vận đơn carrierCode. Chú ý khi có tham số này, hệ thống sẽ phải kết nối sang hãng vận chuyển, nên thời gian phản hồi có thể bị chậm hơn bình thường tùy thuộc vào phản hồi của các hãng vận chuyển. |
| sendCarrierType          | int                                | Biến đánh dấu gửi đơn dùng bảng giá vận chuyển: 1 = Dùng bảng giá của Nhanh.vn, 2 = Dùng bảng giá kết nối tài khoản riêng của doanh nghiệp                                                                                                                                                                                                                                                                                                                        |
| carrierAccountId         | int                                | ID tài khoản kết nối, required khi sendCarrierType = 2, Lấy từ [/api/shipping/feeselfconnect](/v2/shipping/shippingfee#tinh-phi-tu-ket-noi).                                                                                                                                                                                                                                                                                                                      |
| carrierShopId            | int                                | ID cửa hàng trên hệ thống hãng vận chuyển (Lấy từ [/api/shipping/feeselfconnect](/v2/shipping/shippingfee#tinh-phi-tu-ket-noi) nếu có).                                                                                                                                                                                                                                                                                                                           |
| carrierServiceCode       | string                             | Mã dịch vụ hãng vận chuyển, required khi sendCarrierType = 2, Lấy từ [/api/shipping/feeselfconnect](/v2/shipping/shippingfee#tinh-phi-tu-ket-noi).                                                                                                                                                                                                                                                                                                                |
| utmCampaign              | string                             | param khi gắn link đo đếm marketing utm\_campaign                                                                                                                                                                                                                                                                                                                                                                                                                 |
| utmSource                | string                             | param khi gắn link đo đếm marketing utm\_source                                                                                                                                                                                                                                                                                                                                                                                                                   |
| utmMedium                | string                             | param khi gắn link đo đếm marketing utm\_medium                                                                                                                                                                                                                                                                                                                                                                                                                   |
| affiliate                | array                              | Mã giới thiệu cho đơn hàng, xem [Affiliate](#affiliate) bên dưới                                                                                                                                                                                                                                                                                                                                                                                                  |
| usedPoints               | int                                | Tiêu điểm khách hàng                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| isPartDelivery           | int                                | 1 = Đơn hàng có giao hàng một phần, giá trị mặc định null                                                                                                                                                                                                                                                                                                                                                                                                         |

### Product List

* Các thuộc tính của 1 sản phẩm trong **productList** bao gồm:

| Key         | Type                                 | Description                                                                                                                                                                                                                                                                                                                        |
| ----------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id          | string(20) $$^{{\color{red}\*}}$$    | id sản phẩm bên website của bạn                                                                                                                                                                                                                                                                                                    |
| idNhanh     | bigint(20)                           | id sản phẩm bên Nhanh.vn (tham số này là bắt buộc nếu sản phẩm được đồng bộ từ Nhanh.vn sang website của bạn)                                                                                                                                                                                                                      |
| quantity    | int or double $$^{{\color{red}\*}}$$ | số lượng đặt hàng                                                                                                                                                                                                                                                                                                                  |
| name        | string(255) $$^{{\color{red}\*}}$$   | Bắt buộc để thêm sản phẩm mới trong tình huống sản phẩm chưa tồn tại (giúp cho việc đồng bộ đơn hàng không bị gián đoạn nếu sản phẩm chưa được đồng bộ trước đó)                                                                                                                                                                   |
| code        | string(255)                          | Mã sản phẩm                                                                                                                                                                                                                                                                                                                        |
| imei        | string(255)                          | Số IMEI sản phẩm                                                                                                                                                                                                                                                                                                                   |
| type        | string(255)                          | Loại sản phẩm (Product, Voucher, IMEI)                                                                                                                                                                                                                                                                                             |
| price       | int $$^{{\color{red}\*}}$$           | Giá của sản phẩm. Bắt buộc để thêm sản phẩm mới trong tình huống sản phẩm chưa tồn tại                                                                                                                                                                                                                                             |
| weight      | int                                  | Khối lượng sản phẩm                                                                                                                                                                                                                                                                                                                |
| importPrice | int                                  | Giá nhập của sản phẩm                                                                                                                                                                                                                                                                                                              |
| description | string                               | Mô tả riêng của từng sản phẩm trong đơn hàng                                                                                                                                                                                                                                                                                       |
| gifts       | Array                                | Quà tặng của sản phẩm trong đơn hàng \[ 0 => \[ Id => id sản phẩm trên website , productStoreId => id sản phẩm trên Nhanh , quantity => Số lượng, value => Giá sản phẩm quà tặng ], 1 => \[ Id => id sản phẩm trên website, productStoreId => id sản phẩm trên Nhanh, quantity => Số lượng, value => Giá sản phẩm quà tặng ] ... ] |

### Affiliate

```javascript
[
    "code" =>  string, // mã giới thiệu
    "discount" => double, // Tiền chiết khấu cho đơn hàng theo mã affiliate
    "bonus" => double // Tiền hoa hồng nhận được theo mã affiliate
]
```

## Response

```javascript
{
    "code": 1, // 1 is success, 0 is error
    "messages": [ ], // error messages if code is 0
    "data": [
        "orderId": 125123098, // int ID đơn hàng trên Nhanh.vn
        // Các trường bên dưới chỉ có giá trị khi đơn hàng có dùng chức năng gửi sang hãng vận chuyển (autoSend=1)
        "shipFee": 20000, // int: Phí vận chuyển
        "codFee": 13000, // int: Phí thu tiền hộ
        "declaredFee": 10000, // int: Phí bảo hiểm (tùy theo giá trị đơn hàng và dịch vụ bạn lựa chọn sẽ có loại phí này)
        "carrierCode": string // Mã vận đơn, Nếu gửi đơn hàng thành công sang hãng vận chuyển hệ thống sẽ trả về carrierCode (mã vận đơn)
        "trackingUrl": string // Lịch trình đơn hàng
    ]
}
```


# Cập nhật đơn hàng

* /api/order/update: Tính năng này dùng để cập nhật thông tin đơn hàng khi khách hàng thực hiện việc chuyển khoản online (Khi website của bạn nhận được cập nhật từ cổng thanh toán, website của bạn sẽ gửi thông tin này sang Nhanh.vn) hoặc khi khách hàng hủy đơn hàng. Hoặc dùng trong tình huống website của bạn muốn gửi đơn hàng qua các hãng vận chuyển.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key                    | Type                              | Description                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id                     | string(20)                        | id đơn hàng trên website của bạn                                                                                                                                                                                                                                                                                                                                   |
| orderId                | string(20) $$^{{\color{red}\*}}$$ | ID đơn hàng của Nhanh.vn. Bạn cần gửi sang ít nhất 1 trong 2 giá trị id hoặc orderId, nếu cả 2 đều rỗng, hệ thống sẽ báo lỗi không tìm thấy thông tin đơn hàng. Hệ thống sẽ ưu tiên thông tin orderId trên Nhanh.vn                                                                                                                                                |
| autoSend               | int                               | Biến đánh dấu gửi luôn đơn hàng sang hãng vận chuyển (Dùng trong tình huống bạn có hệ thống xác nhận đơn hàng từ trước, chỉ dùng Nhanh để hỗ trợ vận chuyển). Set value = 1 để gửi đơn hàng sang hãng vận chuyển. Nếu gửi thành công hệ thống sẽ trả về carrierCode (mã vận đơn)                                                                                   |
| moneyTransfer          | int                               | Số tiền khách đã chuyển khoản                                                                                                                                                                                                                                                                                                                                      |
| moneyTransferAccountId | int                               | Tài khoản nhận tiền chuyển khoản (Áp dụng với doanh nghiệp sử dụng kế toán)                                                                                                                                                                                                                                                                                        |
| paymentCode            | string(255)                       | Mã giao dịch thanh toán                                                                                                                                                                                                                                                                                                                                            |
| paymentGateway         | string(255)                       | Tên của cổng thanh toán                                                                                                                                                                                                                                                                                                                                            |
| status                 | string                            | <p>Trạng thái đơn hàng, có thể là:<br>- Success: Thành công<br>- Confirmed: Đã xác nhận<br>- Canceled: Khách huỷ (chỉ đổi được sang trạng thái Khách hủy khi đơn hàng đang ở trạng thái Mới, Đang xác nhận, Đã xác nhận)<br>- Aborted: Hệ thống hủy (chỉ đổi được sang trạng thái Hệ thống hủy khi đơn hàng đang ở trạng thái Mới, Đang xác nhận, Đã xác nhận)</p> |
| description            | string(255)                       | Ghi chú khách hàng                                                                                                                                                                                                                                                                                                                                                 |
| privateDescription     | string(255)                       | Ghi chú nội bộ                                                                                                                                                                                                                                                                                                                                                     |
| customerShipFee        | int                               | Phí ship báo khách                                                                                                                                                                                                                                                                                                                                                 |

## Response

* JSON decode the response to get the structure:

```javascript
[
    "code" => 1, // 1 is success, 0 is error
    "messages" => [ ], // error messages if code is 0
    "data" => [
        "orderId" => 125123098, // int ID đơn hàng trên Nhanh.vn
        "status" => "Shipping", // trạng thái hiện tại của đơn hàng
        "shipFee" => 30000, // int: Phí vận chuyển
        "codFee" => 13000, // int: Phí thu tiền hộ
        "shipFeeDiscount" => 0, // int: Phí vận chuyển được giảm giá
        "codFeeDiscount" => 0, // int: Phí thu tiền hộ được giảm giá
        "carrierCode" => string // Mã vận đơn, Nếu gửi đơn hàng thành công sang hãng vận chuyển hệ thống sẽ trả về carrierCode (mã vận đơn)
    ]
]
```

**Chú ý:**

* **shipFee** và **codFee** dùng trong tình huống đơn hàng có sử dụng dịch vụ vận chuyển, thông tin đơn hàng gửi sang có kèm theo carrierId, carrierServiceId và weight.
* **shipFeeDiscount** là phí vận chuyển được chiết khấu, VD **shipFee** = 25.000, **shipFeeDiscount** = 7.000 thì **shipFee** thực tế của đơn hàng này sẽ chỉ = 18.000
* **codFeeDiscount** là phí thu tiền hộ được chiết khấu, VD **codFee** = 15.000, **codFeeDiscount** = 3.000 thì **codFee** thực tế của đơn hàng này sẽ chỉ = 12.000


# Gửi khiếu nại đơn hàng

* /api/order/addcomplain: Tính năng này dùng để đồng bộ khiếu nại giữa đơn hàng của bạn và đơn hàng trên Nhanh.vn.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key         | Type                          | Description                                                                                                                                                                                                                                                                                                                     |
| ----------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id          | int $$^{{\color{red}\*}}$$    | ID đơn hàng bên website của bạn                                                                                                                                                                                                                                                                                                 |
| reason      | int                           | <p>Lý do khiếu nại:<br>6: Lý do khác<br>7: Chậm chuyển tiền<br>8: Báo hàng hoàn<br>9: Báo phát lại<br>10: Yêu cầu miễn giảm cước vận chuyển, bồi thường<br>33: Báo lưu kho tại bưu cục<br>34: Yêu cầu cập nhật lại trạng thái<br>35: Báo hủy đơn<br>36: Thay đổi thông tin đơn hàng, đổi tiền thu hộ COD<br>37: Báo gom đơn</p> |
| description | string $$^{{\color{red}\*}}$$ | Nội dung khiếu nại                                                                                                                                                                                                                                                                                                              |

## Response

```javascript
{
   "code": 1, // 1 is success, 0 is error
   "messages": [ ], // error messages if code is 0
   "data": [
       "complainId" => 5174985,
       // complainId: ID khiếu nại trả về. Khi Nhanh.vn trả kết quả phản hồi khiếu nại sẽ kèm thêm complainId này.
   ]
}
```


# Lịch sử đơn hàng

* /api/order/history: Tính năng này dùng để lấy lịch sử thao tác với đơn hàng.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key     | Type                       | Description                                                                                                                                                                 |
| ------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| orderId | Int $$^{{\color{red}\*}}$$ | ID đơn hàng trên Nhanh.vn                                                                                                                                                   |
| type    | string                     | <p>"lognhanh": lấy lịch sự thao tác với đơn hàng từ nhanh.<br>"logcarrier" lấy lịch trình đơn hàng từ hãng vận chuyển. Không truyền thì giá trị mặc định là "lognhanh".</p> |

* Chú ý: Chỉ các đơn đã bắn sang hãng vận chuyển mới có dữ liệu logcarrier. Chỉ các hãng vận chuyển sau có logcarrier (Các hãng chưa có API hỗ trợ sẽ trả về mảng rỗng): + Giao hàng nhanh + Best Express + Shopee Xpress + NinjaVan + Giao hàng tiêu chuẩn + Ahamove + Việt Nam POST + SuperShip

## Response

* JSON decode the response to get the structure:

| Key      | Type  | Description                                  |
| -------- | ----- | -------------------------------------------- |
| code     | int   | 1 = success or 0 = failed                    |
| messages | array | is an array of error messages if code = 0    |
| data     | array | Mảng danh sách lịch sử thao tác của đơn hàng |

```javascript
Không truyền type hoặc type = "lognhanh": 

[
    // history 1
    [
        "step" => string // Hành động,
        "createdBy" => string // Được thao tác bởi ai,
        "createdDateTime" => string // Thời gian thao tác, định dạng yyyy-mm-dd hh:mm:ii
        "oldStatus" => string // Trạng thái trước khi thao tác,
        "newStatus" => string // Trạng thái sau khi thao tác
    ],
    // history 2
    ...
]

Type = "logcarrier":
[
    "carrierLink" => "", // Link của hãng với case Grab / Ahamove
    "lastDelivererMobile" => "*********", // Số điện thoại bưu tá (số gần nhất, vì đơn có thể giao nhiều lần mới thành công)
    "lastDelivererName" => "Vương Quốc Đạt", // Tên bưu tá
    "logs" => [
        //[    
        // timestamp: convert từ datetime sang timestamp
        // step: các bước lịch trình đơn hàng
        // content: nội dung hãng vận chuyển trả về
        // icon: Tạo đơn: fa-plus 
        // 		 Lấy hàng: fa-person-carry-box / hoặc inbox nếu bản cũ chưa có icon
        // 		 Hàng đang chuyển: fa-truck
        // 		 Giao thành công: fa-handshake
        // "delivererPhone" => "*******", số điện thoại bưu tá
        // "driverName" => "*******", tên bưu tá
        //],
        [
            "timestamp" => 1695627527,
            "step" => "Shipping",
            "icon" => "fal fa-truck",
            "content" => "Hàng đang vận chuyển",
            "delivererPhone" => "********",
            "driverName" => "Vương Quốc Đạt"
        ],
        [
            "timestamp" => 1695637887,
            "step" => "Shipping",
            "icon" => "fal fa-truck",
            "content" => "Hàng đang vận chuyển",
            "delivererPhone" => null,
            "driverName" => "Vương Quốc Đạt"
        ]
        // ......
    ]
]

```

### Demo hiển thị lịch trình

* Ở trang chi tiết đơn hàng, trang danh sách đơn hàng, đã có sẵn chức năng Copy link lịch trình gửi cho khách hàng.

![Lịch trình vận chuyển](https://40622576-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhIoEj3yOAgRRsZcqGM-887967055%2Fuploads%2Fgit-blob-4dd5ffb08b4b349ecc36ebdb9efd06131edfe762%2FOrder_Detail_Tracking.png?alt=media)


# Nguồn đơn hàng

* /api/order/source: Tính năng này dùng để lấy danh sách nguồn đơn hàng.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key  | Type   | Description                                               |
| ---- | ------ | --------------------------------------------------------- |
| page | int    | Phân trang (giá trị mặc định là 1)                        |
| icpp | int    | Số row trên 1 trang (giá trị mặc định là 100, tối đa 100) |
| id   | int    | ID nguồn đơn hàng trên Nhanh.vn                           |
| name | string | Tên nguồn đơn hàng trên Nhanh.vn                          |

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | Mảng danh sách nguồn đơn hàng             |

```php
data = [
    "totalPages" => int, // Tổng số trang
    "totalRecords" => int, // Tổng số bản ghi tất cả các trang
    "page" => int, // Trang hiện tại
    "sources" => [ // Danh sách nguồn đơn hàng trang hiện tại
        [
            // Nguồn đơn hàng 1
            "id" => int, // Id nguồn đơn hàng
            "name" => string, // Nguồn đơn hàng
            "createdAt" => int, // Ngày tạo(định dạng timestamp)
        ],
        [
            // Nguồn đơn hàng 2
        ],
        // ...
    }
]
```


# Hãng vận chuyển

* /api/shipping/carrier: Dùng để lấy danh sách các hãng vận chuyển đang được tích hợp với Nhanh.vn. Nhanh.vn đang kết nối với Giaohangnhanh, J\&T Express, Viettel Post, Vietnam Post, EMS, Ninjavan, Best Express... để hỗ trợ dịch vụ vận chuyển và giao hàng thu tiền tận nhà.
* Chú ý: Dữ liệu này rất ít khi bị thay đổi, bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 24h.

## Response

* JSON decode the response to get the structure:

```javascript
[
    // carrier 1
    "id" => 2, // int: id hãng vận chuyển trên Nhanh.vn
    "name" => "Vietnam Post", // string: tên hãng vận chuyển trên Nhanh.vn,
    "logo" => "absolute path of carrier’s logo",
    "services" => [ // các dịch vụ vận chuyển
        [
            "id" => 2, // int: id dịch vụ
            "name" => "Giao nhanh liên tỉnh" // Tên dịch vụ vận chuyển
        ],
        [
            "id" => 3, // int: id dịch vụ
            "name" => "Bưu kiện" // Tên dịch vụ vận chuyển
        ],
        ...
    ]
]
```


# Thành phố, quận huyện

* /api/shipping/location: Lấy danh sách thành phố, quận huyện từ Nhanh.vn.
* Các API [thêm đơn hàng](/v2/order/add), [tính phí vận chuyển](https://github.com/nvndocs/docs-pos-openapi/blob/v2/docs/shipping/fee.md) sẽ cần sử dụng đến các dữ liệu này.
* Chú ý: Dữ liệu thành phố, quận huyện rất ít khi bị thay đổi (chỉ xảy ra khi có thay đổi tên, chia tách hoặc gộp 1 vài thành phố, quận huyện), bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 24h.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key      | Type   | Description                                                                                                                                                 |
| -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type     | string | CITY/DISTRICT/WARD (mặc định là CITY)                                                                                                                       |
| parentId | int    | <p>Nếu type = DISTRICT thì parentId = id của thành phố cần lấy ra danh sách quận huyện.<br>Nếu type = WARD thì parentId = id của quận huyện cần lấy ra.</p> |

## Response

* JSON decode the response to get the structure:

| Key      | Type | Description                               |
| -------- | ---- | ----------------------------------------- |
| code     | int  | 1 = success or 0 = failed                 |
| messages | \[ ] | is an array of error messages if code = 0 |
| data     | \[ ] | Mảng danh sách thành phố hoặc quận huyện  |

* Nếu **type = CITY**

```javascript
data = [
    [
      "id": 2, // int
      "name":  "Hà Nội" // string
    ],
    [
      "id": 3,
      "name":  "Hồ Chí Minh"
    ],
    ...
]
```

* Nếu **type = DISTRICT**

```javascript
data = [
    [
      "id" => 2, // int
      "parentId" => 2, // int
      "name" => "Quận Hoàn Kiếm" // string
    ],
    [
      "id" => 6,
      "cityLocationId" => 2,
      "name" => "Quận Hai Bà Trưng"
    ],
    ...
]
```

* Nếu **type = WARD**

```javascript
data = [
    [
      "id" => 2, // int
      "parentId" => 3, // int
      "name" => "Phường Bạch Đằng" // string
    ],
    [
      "id" => 6,
      "parentId" => 3,
      "name" => "Phường Bách Khoa"
    ],
    ...
]
```


# Tính phí vận chuyển

* Nhanh.vn hỗ trợ 2 hình thức kết nối với các hãng vận chuyển:
  * Dùng bảng giá qua cổng vận chuyển của Nhanh.vn
  * Dùng bảng giá do shop tự đăng ký riêng với hãng vận chuyển.
* Tùy theo shop đang sử dụng hình thức kết nối vận chuyển nào, bạn cần gọi đúng API tính phí phù hợp, để lấy các thông tin cần thiết dùng cho [API tạo đơn hàng](/v2/order/add)

## Dùng cổng Nhanh.vn

* /api/shipping/fee: Tính năng này dùng để tính phí vận chuyển cho một đơn hàng. Mỗi khi khách hàng vào trang Giỏ hàng, hoặc ở bước thanh toán, website của bạn có thể call API này để tính phí vận chuyển cho đơn hàng và hiển thị chi tiết tổng tiền của đơn hàng bao gồm cả phí vận chuyển và phí thu tiền hộ (nếu khách hàng chọn hình thức thanh toán khi nhận hàng).
* Mặc định hệ thống sẽ trả về bảng giá của tất cả các hãng vận chuyển, chú ý 1 hãng vận chuyển có thể có nhiều bảng giá (VD Giao nhanh / Giao chậm).

### Request

* Xem [common request params](/v2#request-params).
* Xem [Postman sample - Tính phí theo cân nặng](https://www.postman.com/nhanh-vn/workspace/open-nhanh-vn/request/23766734-6f1a718e-dc29-4447-8294-d82d96397496)
* Xem [Postman sample - Tính phí theo sản phẩm](https://www.postman.com/nhanh-vn/workspace/open-nhanh-vn/request/23766734-d487b814-994b-4fef-8d84-d873d6d76d22)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key              | Type                       | Description                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fromCityName     | string $${\color{red}\*}$$ | Tên thành phố của kho gửi hàng (Lấy từ [/api/shipping/location](/v2/shipping/location)).                                                                                                                                                                                                                                                                                                                |
| fromDistrictName | string $${\color{red}\*}$$ | Tên quận huyện của kho gửi hàng (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                                                                                |
| toCityName       | string $${\color{red}\*}$$ | Tên thành phố của khách nhận hàng (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                                                                              |
| toDistrictName   | string $${\color{red}\*}$$ | Tên quận huyện của khách nhận hàng (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                                                                             |
| codMoney         | int                        | Giá trị tiền cần thu hộ của đơn hàng (Tổng giá nhân số lượng sản phẩm trong đơn hàng), set 0 nếu đơn hàng này không cần thu tiền hộ (VD tình huống khách đã chuyển khoản trước)                                                                                                                                                                                                                         |
| shippingWeight   | int                        | Tổng trọng lượng các sản phẩm của đơn hàng tính bằng gram. Hiện tại Nhanh.vn hỗ trợ đơn hàng tối đa 100000 gr (100 kg).                                                                                                                                                                                                                                                                                 |
| productIds       | array                      | Danh sách các ID sản phẩm được đồng bộ từ Nhanh.vn sang website của bạn (idNhanh), dùng để tính khối lượng đơn hàng theo giá trị sản phẩm khai báo bên Nhanh (Truyền biến này thì không cần truyền shippingWeight), cấu trúc: \[productId1 => quantity, productId2 => quantity, ...], hệ thống sẽ lấy quantity nhân với khối lượng sản phẩm khai báo trên Nhanh.vn để tính tổng khối lượng của đơn hàng |
| carrierIds       | array                      | Dùng để giới hạn các hãng vận chuyển muốn dùng (Lấy từ [/api/shipping/carrier](/v2/shipping/carrier)). VD: \[5,7,8,9]                                                                                                                                                                                                                                                                                   |
| length           | int                        | Chiều dài gói hàng tính theo cm.                                                                                                                                                                                                                                                                                                                                                                        |
| width            | int                        | Chiều rộng gói hàng tính theo cm.                                                                                                                                                                                                                                                                                                                                                                       |
| height           | int                        | Chiều cao gói hàng tính theo cm.                                                                                                                                                                                                                                                                                                                                                                        |

**Chú ý**: API này có 2 tình huống:

* Nếu các sản phẩm được đồng bộ từ Nhanh.vn sang website của bạn (Nhanh.vn đã có thông tin shippingWeight của các sản phẩm này): website của bạn có thể gửi sang 1 mảng productIds, Nhanh.vn sẽ tự tính toán tổng trọng lượng của đơn hàng này.
* Website của bạn tự tính tổng trọng lượng shippingWeight của đơn hàng này.

  Nếu bạn có truyền sang các tham số length, width, height: Nhanh.vn sẽ tính toán trọng lượng của đơn hàng theo công thức quy ra kg: A = dài \* rộng \* cao / 6000 (so sánh số A và shippingWeight tham số nào lớn hơn sẽ lấy theo tham số đó để tính toán cước phí) và trả về kết quả đánh dấu nếu gói hàng thuộc loại hàng cồng kềnh.

### Response

* JSON string: mảng danh sách các dịch vụ vận chuyển

| Key      | Type  | Description                                    |
| -------- | ----- | ---------------------------------------------- |
| code     | int   | 1 = success or 0 = failed                      |
| messages | array | is an array of error messages if code = 0      |
| data     | array | is an array of all supported shipping services |

* data is an array of all supported shipping services

```javascript
data = [
    // service 1
    {
        "carrierId" => int, // id hãng vận chuyển
        "carrierName" => string, // tên hãng vận chuyển
        "logo" => string, // image src, logo hãng vận chuyển
        "serviceId" => int, // id dịch vụ vận chuyển
        "serviceTypeName" => string, // loại dịch vụ (Giao nhanh | Giao chậm)
        "serviceName" => string, // tên dịch vụ vận chuyển
        "serviceDescription" => string, // mô tả dịch vụ vận chuyển
        "estimatedDeliveryTime" => int, // Thời gian dự kiến giao hàng
        "shipFee" => int, // phí vận chuyển
        "codFee" => int, // phí thu tiền hộ (phát sinh khi bạn cần giao hàng thu tiền), mỗi hãng vận chuyển có quy định riêng về việc được miễn phí hoặc mức phí khác nhau.
        "declaredFee" => int, // phí bảo hiểm (khi mua dịch vụ khai giá để đền bù trong tình huống hãng vận chuyển làm mất hàng)
        "isBulkyGoods" => 1 | 0 // Biến đánh dấu hàng cồng kềnh nếu cân nặng hoặc kích thước của đơn hàng đạt tới mức hàng cồng kềnh theo quy định của từng hãng
        "isRequiredInsurance" => 1 | 0 // Biến đánh dấu bảng giá có bắt buộc mua bảo hiểm hay không
    },
    {
      // service 2
    },
    // service 3, 4, 5 ...
  ]
```

**Chú ý:**

* Khi isRequiredInsurance == 1, nghĩa là dịch vụ đó luôn bắt buộc mua bảo hiểm, dù đơn hàng không chọn mua bảo hiểm thì tổng tiền cước phải trả cho hãng vận chuyển luôn có khoản phí bảo hiểm này, nên bạn cần chú ý cộng thêm khoản tiền này vào tổng cước.

## Dùng tự kết nối

* /api/shipping/feeselfconnect: Tính năng này dùng để tính phí vận chuyển của 1 hãng vận chuyển mà doanh nghiệp của bạn đã cấu hình kết nối trên trang quản trị của Nhanh.vn. Mỗi khi khách hàng vào trang Giỏ hàng, hoặc ở bước thanh toán, website của bạn có thể call API này để tính phí vận chuyển cho đơn hàng và hiển thị chi tiết tổng tiền của đơn hàng bao gồm cả phí vận chuyển (nếu khách hàng chọn hình thức thanh toán khi nhận hàng).

### Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key              | Type                          | Description                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| carrierId        | int $$^{{\color{red}\*}}$$    | ID hãng vận chuyển cần tính phí vận chuyển (Lấy từ [/api/shipping/carrier](/v2/shipping/carrier)).                                                                                                                                                                                                                                                                                                      |
| fromMobile       | string                        | Số điện thoại của kho gửi hàng (required khi carrierId = 5 (Giao hàng nhanh) ).                                                                                                                                                                                                                                                                                                                         |
| fromCityName     | string $$^{{\color{red}\*}}$$ | Tên thành phố của kho gửi hàng (Lấy từ [/api/shipping/location](/v2/shipping/location)).                                                                                                                                                                                                                                                                                                                |
| fromDistrictName | string $$^{{\color{red}\*}}$$ | Tên quận huyện của kho gửi hàng (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                                                                                |
| fromWardName     | string                        | Tên phường/xã của kho gửi hàng (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                                                                                 |
| fromAddress      | string                        | Địa chỉ của kho gửi hàng (Bắt buộc truyền khi tính phí vận chuyển hãng vận chuyển Giao hàng nhanh)                                                                                                                                                                                                                                                                                                      |
| toCityName       | string $$^{{\color{red}\*}}$$ | Tên thành phố của khách nhận hàng (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                                                                              |
| toDistrictName   | string $$^{{\color{red}\*}}$$ | Tên quận huyện của khách nhận hàng (Lấy từ [/api/shipping/location](/v2/shipping/location))                                                                                                                                                                                                                                                                                                             |
| toWardName       | string                        | Tên phường/xã của khách nhận hàng (Lấy từ [/api/shipping/location](/v2/shipping/location)). Bắt buộc truyền khi tính phí vận chuyển của một trong các hãng vận chuyển: Giao hàng nhanh, JT Express, Shopee Express                                                                                                                                                                                      |
| toAddress        | string                        | Địa chỉ của khách nhận hàng                                                                                                                                                                                                                                                                                                                                                                             |
| codMoney         | int                           | Giá trị tiền cần thu hộ của đơn hàng (Tổng giá nhân số lượng sản phẩm trong đơn hàng), set 0 nếu đơn hàng này không cần thu tiền hộ (VD tình huống khách đã chuyển khoản trước)                                                                                                                                                                                                                         |
| shippingWeight   | int                           | Tổng trọng lượng các sản phẩm của đơn hàng tính bằng gram.                                                                                                                                                                                                                                                                                                                                              |
| productIds       | array                         | Danh sách các ID sản phẩm được đồng bộ từ Nhanh.vn sang website của bạn (idNhanh), dùng để tính khối lượng đơn hàng theo giá trị sản phẩm khai báo bên Nhanh (Truyền biến này thì không cần truyền shippingWeight), cấu trúc: \[productId1 => quantity, productId2 => quantity, ...], hệ thống sẽ lấy quantity nhân với khối lượng sản phẩm khai báo trên Nhanh.vn để tính tổng khối lượng của đơn hàng |

**Chú ý**:

* Nếu các sản phẩm được đồng bộ từ Nhanh.vn sang website của bạn (Nhanh.vn đã có thông tin shippingWeight của các sản phẩm này): website của bạn có thể gửi sang 1 mảng productIds, Nhanh.vn sẽ tự tính toán tổng trọng lượng của đơn hàng này.
* Website của bạn tự tính tổng trọng lượng shippingWeight của đơn hàng này.

### Response

* JSON string: mảng danh sách các dịch vụ vận chuyển

| Key      | Type  | Description                                    |
| -------- | ----- | ---------------------------------------------- |
| code     | int   | 1 = success or 0 = failed                      |
| messages | array | is an array of error messages if code = 0      |
| data     | array | is an array of all supported shipping services |

* data is an array of all supported shipping services

```javascript
data = [
    // service 1
    {
        "carrierAccountId" => int, // ID tài khoản kết nối
        "carrierAccountName" => string, // Tên gợi nhớ kết nối
        "carrierShopId" => int, // ID cửa hàng trên hệ thống hãng vận chuyển (nếu có)
        "carrierName" => string, // Tên hãng vận chuyển
        "logo" => string, // Image src, logo hãng vận chuyển
        "serviceCode" => string, // Mã dịch vụ vận chuyển
        "serviceName" => string, // Tên dịch vụ vận chuyển
        "customerShipFee" => int, // Phí ship báo khách
        "totalFee" => int, // Tổng phí
        "shipFee" => int, // Phí vận chuyển
    },
    {
      // service 2
    },
    // service 3, 4, 5 ...
  ]
```


# Phiếu xuất nhập kho

* /api/bill/search: Dùng để lấy [danh sách phiếu xuất nhập kho](https://nhanh.vn/inventory/bill/index) (hóa đơn nhập nhà cung cấp, bán lẻ, bán sỉ, chuyển kho, kiểm kho).
  * Xem VD lấy danh sách [hóa đơn bán lẻ](https://www.postman.com/nhanh-vn/workspace/open-nhanh-vn/request/23766734-aba29ced-89c7-48ba-a530-c09dd3dc3b51).
  * Các loại hóa đơn khác bạn có thể xem 2 request params là type và mode ở bên dưới để làm tương tự.
* **Chú ý:**
  * Nếu bạn không truyền param fromDate và toDate hoặc customerId hoặc customerMobile, mặc định sẽ lấy dữ liệu trong 10 ngày gần nhất.
  * Nếu bạn muốn lấy dữ liệu các ngày cũ hơn, xin vui lòng truyền fromDate và toDate trong khoảng 10 ngày (VD: 2020-09-01 => 2020-09-10, 2020-09-11 => 2020-09-20)

### Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key            | Type   | Description                                                                                                                                                                                 |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| page           | int    | Phân trang (giá trị mặc định là 1)                                                                                                                                                          |
| icpp           | int    | Số lượng đơn hàng trên 1 trang. Mặc định là 100. Tối đa 100.                                                                                                                                |
| id             | int    | Tìm kiếm theo ID phiếu XNK                                                                                                                                                                  |
| type           | int    | Tìm kiếm theo [loại XNK](/v2#inventory)                                                                                                                                                     |
| mode           | int    | Tìm kiếm theo [kiểu XNK](/v2#inventory)                                                                                                                                                     |
| modes          | array  | Tìm kiếm theo [kiểu XNK](/v2#inventory)                                                                                                                                                     |
| depotId        | int    | Tìm kiếm theo kho hàng                                                                                                                                                                      |
| customerId     | int    | Tìm kiếm theo ID khách hàng                                                                                                                                                                 |
| customerMobile | string | Tìm kiếm theo số điện thoại khách hàng                                                                                                                                                      |
| fromDate       | date   | Tìm kiếm ngày XNK >= fromeDate. Format yyyy-mm-dd (.e.g. 2015-07-16)                                                                                                                        |
| toDate         | date   | Tìm kiếm ngày XNK =< toDate Format yyyy-mm-dd (.e.g. 2015-08-16)                                                                                                                            |
| dataOptions    | array  | <p>Lựa chọn dữ liệu cần lấy thêm, VD "dataOptions":\["giftProducts"].<br>Các giá trị:<br>- giftProducts: Lấy thông tin quà tặng của sản phẩm trong đơn hàng,<br>- tags: lấy tag hóa đơn</p> |

### Response

JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of customer list              |

```javascript
[
    "totalPages" => int,
    "bill" => [
        [ ], // each bill item, all properties are listed in the table below
        [ ],
        ...
    ]
]
```

| Key                | Type     | Description                                                                                                                                                                 |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | int      | ID của hóa đơn                                                                                                                                                              |
| date               | date     | Ngày xuất nhập kho (format: yyyy-mm-dd)                                                                                                                                     |
| createdDateTime    | datetime | Ngày giờ tạo hóa đơn (format: yyyy-mm-dd h:i:s)                                                                                                                             |
| type               | int      | Xem [Loại XNK](/v2#inventory)                                                                                                                                               |
| mode               | int      | Xem [Kiểu XNK](/v2#inventory)                                                                                                                                               |
| depotId            | int      | ID kho doanh nghiệp                                                                                                                                                         |
| customerId         | int      | ID khách hàng mua hàng, có thể sử dụng để đồng bộ với ID khách hàng trong [/api/customer/search](https://github.com/nvndocs/docs-pos-openapi/blob/v2/docs/bill/search-1.md) |
| customerId         | int      | ID khách hàng                                                                                                                                                               |
| customerName       | string   | Tên khách hàng                                                                                                                                                              |
| customerMobile     | string   | Số điện thoại khách hàng                                                                                                                                                    |
| saleId             | int      | ID nhân viên bán hàng                                                                                                                                                       |
| saleName           | string   | Nhân viên bán hàng                                                                                                                                                          |
| createdById        | int      | ID nhân viên thu ngân                                                                                                                                                       |
| createdByName      | string   | Nhân viên thu ngân                                                                                                                                                          |
| discount           | double   | Chiết khấu hóa đơn                                                                                                                                                          |
| moneyTransfer      | double   | Tiền chuyển khoản                                                                                                                                                           |
| moneyAccount       | double   | Tài khoản ngân hàng                                                                                                                                                         |
| cash               | double   | Tiền mặt                                                                                                                                                                    |
| cashAccount        | string   | Quỹ tiền mặt                                                                                                                                                                |
| installmentMoney   | double   | Trả góp                                                                                                                                                                     |
| installmentAccount | string   | Dịch vụ trả góp                                                                                                                                                             |
| installmentCode    | string   | Mã dịch vụ trả góp                                                                                                                                                          |
| creditMoney        | double   | Tiền quẹt thẻ                                                                                                                                                               |
| creditAccount      | double   | Tài khoản quẹt thẻ                                                                                                                                                          |
| creditCode         | string   | Mã quẹt thẻ                                                                                                                                                                 |
| usedPoints         | double   | Điểm sử dụng                                                                                                                                                                |
| usedPointsMoney    | double   | Tiền sử dụng                                                                                                                                                                |
| points             | double   | Số điểm tích lũy từ hóa đơn                                                                                                                                                 |
| money              | double   | Tổng tiền hóa đơn                                                                                                                                                           |
| saleBonus          | double   | Hoa hồng bán hàng                                                                                                                                                           |
| payment            | double   | Tổng tiền đã thanh toán                                                                                                                                                     |
| returnFee          | double   | Phí trả hàng                                                                                                                                                                |
| relatedBillId      | int      | ID hóa đơn được trả hàng                                                                                                                                                    |
| relatedUserName    | string   | Người tạo hóa đơn được trả hàng                                                                                                                                             |
| technicalId        | int      | ID nhân viên kỹ thuật                                                                                                                                                       |
| technicalName      | string   | Tên nhân viên kỹ thuật                                                                                                                                                      |
| requirementBillId  | int      | ID phiếu nháp                                                                                                                                                               |
| orderId            | int      | ID đơn hàng                                                                                                                                                                 |
| inventoryCheckId   | int      | ID phiếu kiểm kho                                                                                                                                                           |
| warrantyBillId     | int      | ID phiếu bảo hành                                                                                                                                                           |
| description        | string   | ghi chú của hóa đơn                                                                                                                                                         |
| products           | array    | Danh sách sản phẩm theo hóa đơn \[Xem bảng bên dưới]                                                                                                                        |

* Products: Danh sách sản phẩm XNK trong phiếu

| Key          | Type   | Description                                                                     |
| ------------ | ------ | ------------------------------------------------------------------------------- |
| id           | int    | ID của sản phẩm                                                                 |
| code         | string | Mã code của sản phẩm                                                            |
| name         | string | Tên sản phẩm                                                                    |
| quantity     | float  | Số lượng sản phẩm                                                               |
| price        | double | Giá sản phẩm                                                                    |
| discount     | double | Chiết khấu của sản phẩm                                                         |
| imei         | array  | danh sách IMEI của sản phẩm. Nếu sản phẩm tồn tại IMEI sẽ hiện thêm trường này. |
| giftProducts | array  | danh sách thông tin quà tặng sản phẩm \[Xem bảng bên dưới].                     |
| vat          | double | Giá trị VAT của sản phẩm                                                        |
| VATPercent   | int    | Phần trăm VAT của sản phẩm                                                      |

* giftProducts: Danh sách thông tin quà tặng sản phẩm

| Key             | Type   | Description          |
| --------------- | ------ | -------------------- |
| productCode     | string | Mã code của sản phẩm |
| productName     | string | Tên sản phẩm         |
| productQuantity | float  | Số lượng sản phẩm    |


# Sản phẩm xuất nhập kho

* /api/bill/imexs: Tính năng này dùng để lấy danh sách sản phẩm xuất nhập kho của doanh nghiệp.
* Tương đương dữ liệu tại mục: Kho hàng > Xuất nhập kho > [Sản phẩm xuất nhập kho](https://nhanh.vn/inventory/imex/index)

## Request

Xem các [common request params](/v2#request-params)

Các key của mảng **data array** dùng để tạo **data** json string:

| Key                   | Type   | Description                                                                                                                         |
| --------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| page                  | Int    | Phân trang (giá trị mặc định là 1)                                                                                                  |
| icpp                  | Int    | Số lượng sản phẩm trên 1 trang. Mặc định là 10. Tối đa không quá 20.                                                                |
| fromDate              | string | Định dạng yyyy-mm-dd. Ngày XNK.                                                                                                     |
| toDate                | string | Định dạng: yyyy-mm-dd. Ngày XNK.                                                                                                    |
| id                    | Int    | ID sản phẩm xuất nhập kho                                                                                                           |
| billId                | Int    | ID phiếu xuất nhập kho                                                                                                              |
| type                  | Int    | Tìm kiếm theo [loại XNK](https://apidocs.nhanh.vn/#inventory)                                                                       |
| mode                  | Int    | Tìm kiếm theo [kiểu XNK](https://apidocs.nhanh.vn/#inventory)                                                                       |
| depotId               | Int    | ID kho                                                                                                                              |
| relatedDepotId        | Int    | ID kho liên quan                                                                                                                    |
| supplierId            | Int    | ID nhà cung cấp                                                                                                                     |
| productStoreId        | Int    | ID sản phẩm xuất nhập kho (Chú ý: deprecated key, nên dùng key productId)                                                           |
| productId             | Int    | ID sản phẩm xuất nhập kho                                                                                                           |
| productStoreName      | string | Tên (mã, mã vạch) sản phẩm xuất nhập kho                                                                                            |
| relatedProductStoreId | Int    | ID sản phẩm XNK liên quan                                                                                                           |
| categoryId            | Int    | ID danh mục sản phẩm                                                                                                                |
| internalCategoryId    | Int    | ID danh mục nội bộ sản phẩm                                                                                                         |
| brandId               | Int    | ID thương hiệu sản phẩm                                                                                                             |
| productStoreTypeId    | Int    | Loại sản phẩm: 1: Sản phẩm 2: Voucher 3: Sản phẩm cân đo 4: Sản phẩm theo IMEI 5: Gói sản phẩm 6: Dịch vụ                           |
| imeiId                | Int    | Tìm theo imeiId                                                                                                                     |
| imei                  | string | Tìm theo IMEI (Chỉ hỗ trợ tìm trong các hóa đơn bán lẻ, các phiếu nhập nhà cung cấp, chuyển kho sẽ không hỗ trợ tìm kiếm theo IMEI) |
| warrantyBillId        | Int    | ID phiếu bảo hành                                                                                                                   |

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                                   |
| -------- | ----- | --------------------------------------------- |
| code     | int   | 1 = success or 0 = failed                     |
| messages | array | is an array of error messages if code = 0     |
| data     | array | Mảng danh sách sản phẩm yêu cầu xuất nhập kho |

```javascript
data = [
    "totalPage" => int, // Tổng số trang,
    "page" => int, // Trang hiện tại,
    "imexs" => [
        [
            "id" => int, // ID phiếu sản phẩm xuất nhập kho,
            "billId" => int , // ID phiếu xuất nhập kho,
            "type" => int, // Loại xuất nhập kho,
            "typeName" => string, // Tên loại xuất nhập kho,
            "mode" => int, // Kiểu xuất nhập kho,
            "modeName" =>string , // Tên kiểu xuất nhập kho,
            "date" => string, // Ngày xuất nhập kho,
            "depotId" => int, // ID kho,
            "depotName" => string, // Tên kho,
            "relatedDepotId" => int, // ID kho liên quan,
            "relatedDepotName" => string, // Tên kho liên quan
            "supplierId" => int, // ID nhà cung cấp,
            "supplierName" => string, // Tên nhà cung cấp,
            "supplierMobile" => string, // Số điện thoại nhà cung cấp,
            "productStoreId" => int, // ID sản phẩm xuất nhập kho (Chú ý: deprecated key, nên dùng key productId)
            "productId" => int, // ID sản phẩm xuất nhập kho,
            "relatedProductStoreId" => int, // ID sản phẩm xuất nhập kho,
            "proudctStore" => [
                "code" => string, // Mã sản phẩm,
                "barcode" => string, // Mã vạch sản phẩm,
                "name" => string, // tên sản phẩm,
                "importPrice" => double, // Giá nhập sản phẩm,
                "price" => double, // Giá bán sản phẩm,
                "avgCost" => double, // Giá vốn sản phẩm
            ]
            "imeiId" => int, // Imei Id,
            "imei" => string, // Số imei sản phẩm,
            "avgCost" => double, // Giá vốn sản phẩm trong lần xuất nhập kho,
            "productPrice" => double, // Giá sản phẩm trong lần xuất nhập kho,
            "remain" => int, // Số tồn còn lại tính tới lần xuất nhập kho,
            "description" => string, // Mô tả trong lần xuất nhập kho,
            "discount" => double, // Chiết khấu trong lần xuất nhập kho,
            "points" => int, // Số point được tặng trong lần xuất nhập kho của sản phẩm ,
            "usedPoints" => int, // Số point đã tiêu trong lần xuất nhập kho của sản phẩm,
            "createdDateTime" => string, // Thời gian tạo phiếu xuât nhập kho,
            "saleBonus" => double, // Tiền hoa hồng nhân viên bán hàng được hưởng với sản phẩm,
            "extendedWarrantyId" => int, // Id bảo hành mở rộng,
            "extendedWarrantyMoney" => double, // Tiền bảo hành mở rộng,
            "extendedWarrantyMonths" => int, // Số tháng bảo hành mở rộng,
            "warrantyReasonId" => int, // Id lý do bảo hành
        ],
        ...
    ]
]
```


# Sản phẩm xuất nhập kho nháp

* /api/bill/imexrequirements: Tính năng này dùng để lấy danh sách sản phẩm yêu cầu xuất nhập kho của doanh nghiệp.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:
* Chú ý: Hệ thống chỉ hỗ trợ lấy dữ liệu trong 10 ngày. Nếu bạn không truyền param fromDate và toDate, mặc định sẽ lấy 10 ngày gần nhất. Nếu bạn muốn lấy dữ liệu các ngày cũ hơn, xin vui lòng truyền fromDate và toDate trong khoảng 10 ngày (VD: 2021-09-01 => 2021-09-10, 2021-09-11 => 2021-09-20).
  * Nếu có điều kiện lọc theo id hoặc billId thì hệ thống sẽ không giới hạn mặc định trong khoảng 10 ngày gần nhất.

| Key                | Type   | Description                                                                                               |
| ------------------ | ------ | --------------------------------------------------------------------------------------------------------- |
| page               | Int    | Phân trang (giá trị mặc định là 1)                                                                        |
| icpp               | Int    | lượng sản phẩm trên 1 trang. Mặc định là 10. Tối đa không quá 20.                                         |
| fromDate           | string | Định dạng: Y-m-d, VD: 2021-09-25. Ngày duyệt phiếu yêu cầu từ ngày                                        |
| toDate             | string | Định dạng: Y-m-d, VD: 2021-10-25. Ngày duyệt phiếu yêu cầu đến ngày                                       |
| id                 | Int    | ID phiếu sản phẩm yêu cầu xuất nhập kho                                                                   |
| billId             | Int    | ID phiếu yêu cầu xuất nhập kho                                                                            |
| type               | Int    | Loại xuất nhập kho                                                                                        |
| mode               | Int    | Kiểu xuất nhập kho                                                                                        |
| fromDepotId        | Int    | ID kho xuất đi                                                                                            |
| toDepotId          | Int    | ID kho nhận                                                                                               |
| supplierId         | Int    | ID nhà cung cấp                                                                                           |
| productStoreId     | Int    | ID sản phẩm yêu cầu xuất nhập kho                                                                         |
| productStoreName   | string | Tên (mã, mã vạch) sản phẩm yêu cầu xuất nhập kho                                                          |
| categoryId         | Int    | ID danh mục sản phẩm                                                                                      |
| brandId            | Int    | ID thương hiệu sản phẩm                                                                                   |
| productStoreTypeId | Int    | Loại sản phẩm: 1: Sản phẩm 2: Voucher 3: Sản phẩm cân đo 4: Sản phẩm theo IMEI 5: Gói sản phẩm 6: Dịch vụ |
| imeiId             | Int    | Imei ID                                                                                                   |
| imei               | string | Số imei                                                                                                   |
| requiredById       | Int    | Người tạo phiếu yêu cầu                                                                                   |
| approvedById       | Int    | Người duyệt phiếu yêu cầu                                                                                 |
| status             | Int    | Trạng thái phiếu: 1: Mới 2: Hủy 3: Đã duyệt 4: Đã xác nhận 5: Cần đối soát lại 6: Đã đối soát             |

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                                   |
| -------- | ----- | --------------------------------------------- |
| code     | int   | 1 = success or 0 = failed                     |
| messages | array | is an array of error messages if code = 0     |
| data     | array | Mảng danh sách sản phẩm yêu cầu xuất nhập kho |

```javascript
data = [
    "totalPage" => int, // Tổng số trang,
    "page" => int, // Trang hiện tại,
    "imexs" => [
        [
            "id" => int, // ID phiếu sản phẩm yêu cầu xuất nhập kho,
            "billId" => int, // ID phiếu yêu cầu xuất nhập kho,
            "type" => int, // Loại xuất nhập kho,
            "typeName" => string, // Tên loại xuất nhập kho,
            "mode" => int, // Kiểu xuất nhập kho,
            "modeName" => string, // Tên kiểu xuất nhập kho,
            "fromDepotId" => int, // ID kho xuất,
            "fromDepotName" => string, // Tên kho xuất,
            "toDepotId" => int, // ID kho nhận,
            "toDepotName" => string, // Tên kho nhận
            "supplierId" => int, // ID nhà cung cấp,
            "supplierName" => string, // Tên nhà cung cấp,
            "supplierMobile" => string, // Số điện thoại nhà cung cấp,
            "productStoreId" => int, // ID sản phẩm yêu cầu xuất nhập kho,
            "proudctStore" => [
                "code" => string, // Mã sản phẩm,
                "barcode" => string, // Mã vạch sản phẩm,
                "name" => string, // tên sản phẩm,
                "importPrice" => double, // Giá nhập sản phẩm,
                "price" => double, // Giá bán sản phẩm
            ]
            "imeiId" => int, // Imei Id,
            "imei" => string, // Số imei sản phẩm,
            "requiredQuantity" => double, // Số lượng sản phẩm yêu cầu,
            "damagedQuantity" => double, // Số lượng sản phẩm hỏng,
            "requiredImportPrice" => double, // Giá nhập sản phẩm yêu cầu,
            "requiredPrice" => double, // Giá sản phẩm yêu cầu,
            "requiredById" => int, // ID người lập phiếu yêu cầu,
            "requiredByUser" => string, // Tên người nhập phiếu yêu cầu,
            "requiredAt" => int, // Thời gian tạo phiếu yêu cầu ,
            "approvedQuantity" => double, // Số lượng sản phẩm yêu cầu được duyệt,
            "approvedImportPrice" => double, // Giá nhập sản phẩm yêu cầu được duyệt,
            "approvedPrice" => double, // Giá sản phẩm yêu cầu được duyệt,
            "approvedDescription" => string, // Mô tả của người duyệt yêu cầu,
            "approvedById" => int, // ID người duyệt yêu cầu,
            "approvedByUser" => string, // Tên người duyệt yêu cầu,
            "approvedAt" => int, // Thời gian duyệt yêu cầu,
            "realQuantity" => double, // Số lượng sản phẩm yêu cầu được xác nhận,
            "confirmedAt" => int, // Thời gian sản phẩm yêu cầu được xác nhận,
            "status" => int, // id trạng thái sản phẩm yêu cầu,
            "statusName" => string, // Tên trạng thái
        ],
        ...
    ]
]
```


# Danh sách khách hàng

* /api/customer/search: Tính năng này dùng để tìm kiếm thông tin khách hàng thông qua id hoặc số điện thoại của khách hàng. hoặc lấy danh sách khách hàng. Tối đa ko quá 50 khách hàng / page.
* **Chú ý**: Nếu bạn hay thường xuyên cần gọi toàn bộ danh sách khách hàng, bạn nên lưu giá trị thời gian lần cuối cùng quét toàn bộ, sau đó dùng 2 request params là updatedDateTimeFrom và updatedDateTimeTo để chỉ lấy về các khách hàng có cập nhật mới, không cần gọi lại toàn bộ khách cũ không có thay đổi gì.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key                | Type   | Description                                                                       |
| ------------------ | ------ | --------------------------------------------------------------------------------- |
| page               | int    | Phân trang (giá trị mặc định là 1)                                                |
| icpp               | int    | Số lượng khách hàng trên 1 trang. Mặc định là 10. Tối đa không quá 50.            |
| id                 | int    | Tìm kiếm khách hàng theo id.                                                      |
| mobile             | string | Tìm kiếm khách hàng theo số điện thoại. VD: 0988999999                            |
| lastBoughtDateFrom | string | Từ ngày mua cuối cùng (yyyy-mm-dd). VD: 2022-09-25                                |
| lastBoughtDateTo   | string | Đến ngày mua cuối cùng (yyyy-mm-dd). VD: 2022-09-26                               |
| updatedAtFrom      | string | Định dạng: Y-m-d H:i:s, Vd: 2022-05-25 00:00:00 Ngày cập nhật khách hàng từ ngày  |
| updatedAtTo        | string | Định dạng: Y-m-d H:i:s, Vd: 2022-05-30 23:59:00 Ngày cập nhật khách hàng đến ngày |
| type               | int    | Loại khách hàng.1: Khách lẻ,2: Khách sỉ,3: Đại lý                                 |

## Response:

* JSON decode the response to get the structure:

| Key      | Type | Description                               |
| -------- | ---- | ----------------------------------------- |
| code     | int  | 1 = success or 0 = failed                 |
| messages | \[ ] | is an array of error messages if code = 0 |
| data     | \[ ] | is an array of customer list              |

```javascript
[
    "totalPages" => int,
    "customers" => [
        // customer 1
        [
            // see properties in the table below
        ],
        ...
    ]
]
```

| Key                | Type   | Description                                                     |
| ------------------ | ------ | --------------------------------------------------------------- |
| id                 | int    | id của khách hàng                                               |
| type               | int    | Loại khách hàng (1 = Khách lẻ, 2 = Khách buôn, 3 = Đại lý)      |
| name               | string | Tên khách hàng                                                  |
| mobile             | int    | Số điện thoại của khách hàng                                    |
| email              | string | Email của khách hàng                                            |
| gender             | int    | Giới tính khách hàng (1 = Nam, 2 = Nữ, Null: Chưa có thông tin) |
| address            | string | Địa chỉ của khách hàng                                          |
| birthday           | string | Ngày sinh của khách hàng                                        |
| code               | string | Mã code của khách hàng                                          |
| level              | string | Tên cấp độ khách hàng                                           |
| group              | string | Tên nhóm của khách hàng                                         |
| totalMoney         | double | Tổng số tiền khách mua hàng                                     |
| points             | int    | Điểm tích lũy hiện tại của khách hàng                           |
| cityLocationId     | int    | ID thành phố                                                    |
| districtLocationId | int    | ID quận huyện                                                   |
| wardLocationId     | int    | ID phường xã                                                    |
| saleName           | string | Thông tin nhân viên được gắn cho khách hàng,                    |
| startedDate        | string | Ngày bắt đầu mua hàng. Định dạng: Y-m-d, VD: 2021-09-25         |
| taxCode            | string | Mã số thuế                                                      |
| businessName       | string | Tên công ty                                                     |
| businessAddress    | string | Địa chỉ công ty                                                 |


# Thêm khách hàng

* /api/customer/add: Tính năng này dùng để thêm và sửa thông tin khách hàng. Hệ thống dùng trường mobile làm key, nếu chưa tồn tại thì sẽ thêm mới khách hàng, nếu tồn tại rồi thì sẽ cập nhật thông tin khách hàng.
* Tối đa mỗi lần không quá 50 khách hàng.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

  ```javascript
  // each request can send maximum 50 customers
  [
    [ // customer 1 ], // see the structure in the table below
    [ // customer  2 ],
    ...
  ]
  ```

| Key          | Type                          | Description                                                                                             |
| ------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| fromCustomer | string                        | Số điện thoại khách hàng giới thiệu (khách hàng đã tồn tại trên hệ thống Nhanh.vn)                      |
| saleName     | string                        | Nhân viên phụ trách (username/email của nhân viên thuộc doanh nghiệp đã tồn tại trên hệ thống Nhanh.vn) |
| name         | string $$^{{\color{red}\*}}$$ | Tên khách hàng                                                                                          |
| type         | int                           | 1 - Khách lẻ, 2 - Khách buôn                                                                            |
| address      | string                        | địa chỉ khách hàng                                                                                      |
| mobile       | string $$^{{\color{red}\*}}$$ | Số điện thoại khách hàng                                                                                |
| businessName | string                        | Tên công ty                                                                                             |
| taxCode      | string                        | Mã số thuế                                                                                              |
| points       | int                           | điểm tích lũy của khách hàng                                                                            |
| gender       | int                           | 1 - Nam, 2 - Nữ                                                                                         |
| birthday     | date                          | Sinh nhật khách hàng (ngày/tháng/năm)                                                                   |
| cityName     | string                        | Tên thành phố (Lấy từ [/api/shipping/location](/v2/shipping/location))                                  |
| districtName | string                        | Tên quận huyện (Lấy từ [/api/shipping/location](/v2/shipping/location))                                 |
| wardName     | string                        | Tên phường xã (Lấy từ [/api/shipping/location](/v2/shipping/location))                                  |
| email        | string                        | Email khách hàng                                                                                        |
| pid          | string                        | Số CMND                                                                                                 |
| description  | string                        | Mô tả                                                                                                   |
| facebookLink | string                        | Facebook link                                                                                           |
| groupId      | int                           | ID nhóm khách hàng trên Nhanh.vn                                                                        |


# Tin tức

* /api/article/search: Tính năng này được sử dụng để lấy danh sách bài viết trên Nhanh, phân trang tối đa 50 tin tức/page, hỗ trợ lấy theo id bài viết > id bài viết truyền lên, hỗ trợ lọc bài viết theo danh mục.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:
*

| Param             | Type | Description                                                                               |
| ----------------- | ---- | ----------------------------------------------------------------------------------------- |
| page              | int  | Phân trang (giá trị mặc định là 1)                                                        |
| icpp              | int  | Số lượng bài viết trên 1 trang. Mặc định là 10. Tối đa không quá 50.                      |
| lastId            | int  | Tìm kiếm bài viết lấy từ bài viết có id > lastId                                          |
| categoryId        | int  | Tìm kiếm theo danh mục bài viết                                                           |
| status            | int  | Tìm kiếm theo trạng thái bài viết: 1 - hiện, 2 - ẩn                                       |
| fromPublishedDate | date | Tìm kiếm ngày đăng bài viết >= fromPublishedDate. Format yyyy-mm-dd (.e.g. 2015-07-16)    |
| toPublishedDate   | date | Tìm kiếm ngày đăng bài viết viết <= toPublishedDate. Format yyyy-mm-dd (.e.g. 2015-07-16) |
| fromExpiredDate   | date | Tìm kiếm ngày hết hạn bài viết >= fromExpiredDate. Format yyyy-mm-dd (.e.g. 2015-07-16)   |
| toExpiredDate     | date | Tìm kiếm ngày hết hạn bài viết <= toExpiredDate. Format yyyy-mm-dd (.e.g. 2015-07-16)     |

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of articles                   |

```javascript
[
    "totalPages" => int, //tổng số page
    "page" => int, // page hiện tại
    "result" => [ // Kết quả trả về
        // article 1
        [
            "id" => int, //id bài viết
            "categoryId" => int, // category id
            "status" => int, // Trạng thái
            "title" => string, // tiêu đề bài viêt
            "intro" => string, // giới thiệu ngắn gọn bài viết
            "content" => string, // Nội dung bài viết,
            "publishedDate" => string, // Ngày đăng bài viết
            "expiredDate" => string, // Ngày hết hạn bài viết
        ],
        // article 2
    ]
]
```


# Danh mục tin tức

* /api/article/categories: Tính năng này được sử dụng để lấy toàn bộ danh mục tin tức của doanh nghiệp trên Nhanh.vn.

## Request

Xem các [common request params](/v2#request-params)

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                                   |
| -------- | ----- | --------------------------------------------- |
| code     | int   | 1 = success or 0 = failed                     |
| messages | array | is an array of error messages if code = 0     |
| data     | array | is an array of product category (multi-level) |

```javascript
[
    [
        "id" => int,
        "name" => string,
        "status" => int,
        "parentId" => int,
        "childs" => [ // child categories
            [
                "id" => int,
                "name" => string,
                "status" => int,
                "parentId" => int,
                "childs" => [
                    ...
                ],
            ],
            ...
        ]
    ],
    ...
]
```


# Thêm subscriber

* /api/website/addsubscriber: Tính năng này dùng để thêm và sửa subscriber. Hệ thống dùng trường email làm key, nếu chưa tồn tại thì sẽ thêm mới, nếu tồn tại rồi thì sẽ cập nhật thông tin.
* Tối đa mỗi lần không quá 100 subscriber.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

  ```javascript
  // each request can send maximum 100 customers
  [
    [ // subscriber 1 ], // see the structure in the table below
    [ // subscriber  2 ],
    ...
  ]
  ```

| Key     | Type                          | Description     |
| ------- | ----------------------------- | --------------- |
| name    | string $$^{{\color{red}\*}}$$ | Tên             |
| mobile  | string                        | Số điện thoại   |
| gender  | int                           | 1 - Nam, 2 - Nữ |
| email   | string $$^{{\color{red}\*}}$$ | Email           |
| content | string                        | Nội dung        |
| note    | string                        | Ghi chú         |


# Thêm liên hệ

* /api/website/addcontact: Tính năng này dùng để thêm và sửa liên hệ. Hệ thống dùng trường email làm key, nếu chưa tồn tại thì sẽ thêm mới, nếu tồn tại rồi thì sẽ cập nhật thông tin.
* Tối đa mỗi lần không quá 100 liên hệ.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

  ```javascript
  // each request can send maximum 100 customers
  [
    [ // contact 1 ], // see the structure in the table below
    [ // contact 2 ],
    ...
  ]
  ```

| Key     | Type                          | Description   |
| ------- | ----------------------------- | ------------- |
| name    | string $$^{{\color{red}\*}}$$ | Tên           |
| email   | string $$^{{\color{red}\*}}$$ | Email         |
| mobile  | string                        | Số điện thoại |
| address | string                        | Địa chỉ       |
| subject | string                        | Tiêu đề       |
| content | string                        | Nội dung      |
| note    | string                        | Ghi chú       |


# Nhà cung cấp

* /api/supplier/search: Tính năng này được sử dụng để lấy danh nhà cung cấp trên Nhanh, phân trang tối đa 50 tin tức/page, hỗ trợ lấy theo id nhà cung cấp > id nhà cung cấp truyền lên, hỗ trợ lọc bài viết theo danh mục.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key    | Type   | Description                                                           |
| ------ | ------ | --------------------------------------------------------------------- |
| page   | int    | Phân trang (giá trị mặc định là 1)                                    |
| icpp   | int    | Số lượng nhân viên trên 1 trang. Mặc định là 10. Tối đa không quá 50. |
| lastId | int    | Tìm kiếm nhà cung cấp có id > lastId.                                 |
| name   | string | Tìm kiếm theo tên nhà cung cấp.                                       |
| code   | string | Tìm kiếm theo mã nhà cung cấp.                                        |
| mobile | string | Tìm kiếm theo số điện thoại nhà cung cấp.                             |

## Response

* JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of suppliers                  |

```javascript
data = [
    "totalPages" => int, //tổng số page
    "page" => int, // page hiện tại
    "result" => [ // Kết quả trả về
        // supplier 1
        [
            "id" => int, // id nhà cung cấp
            "typeId" => int, // Loại: 1 = Cá nhân, 2 = Doanh nghiệp, null = Chưa xác định
            "code" => string, // Mã nhà cung cấp
            "name" => string, // Tên nhà cung cấp
            "representativeName" => string, // Tên người đại diện
            "representativePosition" => string, // Vị trí người đại diện,
            "representativeMobile" => int, // Số điện thoại người đại diện
            "address" => string, // Địa chỉ nhà cung cấp
            "mobile" => string, // Số điện thoại nhà cung cấp
            "email" => string, // Email nhà cung cấp
            "bankName" => string, // Ngân hàng
            "bankBranch" => string, // Chi nhánh
            "bankAccountNumber" => string, // Số tài khoản
            "status" => int, // Trạng thái: 1 = Active, 2 = Inactive
            "note" => string // Ghi chú
        ],
        ...
    ]
]
```


# Danh sách coupon

* Coupon là các mã giảm giá ngẫu nhiên do shop tạo ra trên hệ thống của Nhanh.vn, shop có thể tạo nhiều chương trình coupon, mỗi chương trình có nhiều mã coupon. Mã coupon là duy nhất (unique không trùng nhau) trên toàn bộ các chương trình coupon.
* Coupon được đùng để tặng cho khách hàng, khi khách mua hàng, có thể đọc mã cho thu ngân, hoặc điền mã coupon trên các form đặt hàng trên website / app để được áp dụng giảm giá.
* Coupon có thể được cài đặt:
  * Khoảng ngày được áp dụng.
  * Giá trị giảm giá theo %, theo tiền mặt.
  * Chỉ áp dụng cho hóa đơn từ bao nhiêu.
  * Chỉ được dùng ở cửa hàng nào.
  * Chỉ được giảm tối đa bao nhiêu tiền (VD giảm 15% nhưng tối đa 100K).
  * Coupon cũng có thể được cài đặt để chỉ được sử dụng 1 lần duy nhất hoặc được áp dụng bao nhiêu lần (canUsedTimes), bạn cần chú ý con số này để khi tặng mã Coupon cho khách hàng không nên vượt quá số lượt được sử dụng, tránh tình huống những khách hàng sau không dùng được mã coupon nữa.

## Lấy danh sách chương trình Coupon

* /api/promotion/coupon?act=list

### Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key            | Type   | Description                            |
| -------------- | ------ | -------------------------------------- |
| page           | int    | Phân trang, giá trị mặc định sẽ là 1.  |
| id             | int    | Tìm kiếm theo ID đợt phát hành coupon. |
| couponCode     | string | Tìm kiếm theo mã coupon.               |
| productStoreId | int    | Tìm kiếm theo ID sản phẩm.             |
| depotId        | int    | Tìm kiếm theo ID kho.                  |
| name           | string | Tìm kiếm tên đợt phát hành coupon.     |

### Response

* JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of coupons                    |

```javascript
data = [
      "totalPages" => int //tổng số page
      "page" => int // page hiện tại
      "result" => [ // Kết quả trả về
          // coupon 1
          [
              "id" => int, //id coupon
              "depotIds" => array, // mảng ID kho được áp dụng
              "name" => string, // Tiêu đề coupon
              "categories" => string, // Danh mục
              "description" => string, // Mô tả,
              "startDate" => string, // Ngày bắt đầu
              "endDate" => string, // Ngày kết thúc
              "fromValue" => int, // Chỉ được áp dụng cho hóa đơn có giá trị từ fromValue
              "numberOfCodes" => int, // Số coupon
              "canUsedTimes" => int, // Số lần có thể sử dụng
              "usedTimes" =>  int, // Số lần đã sử dụng
              "assignedTimes" => int, // Số lần đã tặng
              "valueType" => int, // Kiểu giảm giá 1 = tiền mặt, 2= %
              "value" =>  float, // Giá trị coupon
              "valueMax" => float, // Giá trị tối đa (VD Coupon giảm 15% nhưng tối đa chỉ được 100K)
              "status" => int, // Trạng thái 1 = Active, 2 = Inactive
              "createdDatetime" => string // Ngày tạo
              "options" => {
                "notApplyWithDiscountPromotion" => Boolean // chương trình có cho áp dụng cùng chương trình chiết khấu hay không.True: có,False: không
              }
          ],
          ...
      ]
]
```

## Lấy danh sách coupon code

* /api/promotion/coupon?act=codes: Tính năng này được sử dụng để lấy danh sách mã coupon

### Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key     | Type                       | Description                                                    |
| ------- | -------------------------- | -------------------------------------------------------------- |
| page    | int                        | Phân trang (giá trị mặc định là 1)                             |
| batchId | int $$^{{\color{red}\*}}$$ | ID đợt phát hành coupon, lấy từ /api/promotion/coupon?act=list |

### Response

* JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of coupon code                |

```javascript
data = [
      "totalPages" => int, //tổng số page
      "page" => int, // page hiện tại
      "result" => [ // Kết quả trả về
          // couponCode 1
          [
              "code" => string, // Mã coupon
              "value" => int, // Giá trị coupon
              "valueType" => int, // Kiểu áp dụng (1 = Tiền mặt, 2 = %)
              "valueMax" => int, // Giá trị giảm giá tối đa (VD được giảm 15% nhưng tối đa 100K)
              "canUsedTimes" => int, // Số lần còn có thể dùng
              "usedTimes" => int, // Số lần đã dùng
              "assignedTimes" => int, // Số lần đã tặng
              "status" => int, // Trạng thái (1 - Mới, 2 - Đã sử dụng, 3 - Đã bị hủy, 4 - Đã tặng)
           ],
           // couponCode 2
           ...
       ]
]
```

## Lấy danh sách sản phẩm được áp dụng coupon

* /api/promotion/coupon?act=products: Tính năng này được sử dụng để lấy danh sản phẩm coupon, dùng trong tình huống bạn tạo các coupon chỉ muốn áp dụng cho 1 số sản phẩm cụ thể. Nếu kết quả trả về productIds là null hoặc 1 mảng rỗng nghĩa là mã coupon được áp dụng cho tất cả sản phẩm (không bị giới hạn chỉ được áp dụng cho 1 vài sản phẩm nào đó)

### Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Param         | Type                       | Description                                                          |
| ------------- | -------------------------- | -------------------------------------------------------------------- |
| page          | int                        | Phân trang (giá trị mặc định là 1)                                   |
| icpp          | int                        | Số lượng sản phẩm trên 1 trang. Mặc định là 10. Tối đa không quá 20. |
| couponBatchId | int $$^{{\color{red}\*}}$$ | ID đợt phát hành coupon, lấy từ /api/promotion/coupon?act=list       |

### Response

* JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of coupon code                |

```javascript
data = [
    "totalPages" => int, // tổng số page
    "page" => int, // page hiện tại
    "data" => [
        productIds => [ productId, productId...] // mảng int các sản phẩm được áp dụng
    ]
]
```

## Lấy thông tin coupon code

* /api/promotion/coupon?act=check: Tính năng này được sử dụng để kiểm tra mã coupon có hợp lệ hay không (khoảng ngày, điều kiện được áp dụng, sản phẩm được áp dụng)

### Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Param      | Type                          | Description |
| ---------- | ----------------------------- | ----------- |
| couponCode | string $$^{{\color{red}\*}}$$ | Mã coupon   |

### Response

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of coupon                     |

```javascript
data = [
    "result" =>  [ // Kết quả trả về
        // coupon
        [
            "batchId" => int, // ID đợt phát hành coupon
            "batchName" => string, // Tên đợt phát hành coupon
            "depotIds" => array, // Mảng ID kho được áp dụng
            "categoryIds" => array, // Mảng ID danh mục
            "fromValue" => int, // Giá trị áp dụng
            "canUsedTimes" => int, // Số lần có thể sử dụng coupon
            "usedTimes" => int, // Số lần đã sử dụng coupon
            "code" => string, // Mã coupon
            "value" => string, // Giá trị
            "valueMax" => string, // Giá trị tối đa
            "startDate" => string, // Ngày bắt đầu,
            "endDate" => string, // Ngày kết thúc
            "description" => string, // Mô tả
            "products" => array, // Mảng danh sách sản phẩm được áp dụng
        ]
    ]
]
```

## Tặng mã coupon

* /api/promotion/coupon?act=giveaway: Tính năng này được sử dụng để bạn tặng mã coupon cho khách hàng xong, thì cần báo để server cập nhật lại số lần đã tặng, tránh việc 1 mã được tặng nhiều lần và khách khác không thể sử dụng được nữa.

### Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Param      | Type                          | Description |
| ---------- | ----------------------------- | ----------- |
| couponCode | string $$^{{\color{red}\*}}$$ | Mã coupon   |

### Response

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |

```javascript
[
    "code" => 1, // 1 = đã cập nhật thành công, 0 = failed
    "messages" => array
]
```

## Sử dụng mã coupon

* /api/promotion/coupon?act=use: Tính năng này được sử dụng để thông báo cho server biết 1 mã coupon đã được sử dụng, tránh việc 1 mã được sử dụng nhiều lần.

### Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Param      | Type                          | Description |
| ---------- | ----------------------------- | ----------- |
| couponCode | string $$^{{\color{red}\*}}$$ | Mã coupon   |

### Response

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |

```javascript
[
    "code" => 1 // 1 = đã cập nhật thành công, 0 = failed,
    "messages" => array
]
```

## Tạo chương trình coupon

* /api/promotion/coupon?act=addbatch: Tính năng này được sử dụng để tạo chương trình coupon

### Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Param                         | Type                               | Description                                                                                      |
| ----------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| name                          | string(255) $$^{{\color{red}\*}}$$ | Tên chương trình coupon                                                                          |
| status                        | int $$^{{\color{red}\*}}$$         | Trạng thái: 1 - Hoạt động, 2 - Ngừng hoạt động                                                   |
| startDate                     | string $$^{{\color{red}\*}}$$      | Định dạng: Y-m-d. Ngày áp dụng từ                                                                |
| endDate                       | string $$^{{\color{red}\*}}$$      | Định dạng: Y-m-d. Ngày áp dụng đến                                                               |
| codeLength                    | int $$^{{\color{red}\*}}$$         | Độ dài mã coupon: 5 - 5 kí tự, 6 - 6 kí tự, 7 - 7 kí tự, 8 - 8 kí tự, 9 - 9 kí tự, 10 - 10 kí tự |
| numberOfCodes                 | int $$^{{\color{red}\*}}$$         | Số lượng mã coupon muốn tạo (Tối đa 20.000 mã)                                                   |
| canUsedTimes                  | int $$^{{\color{red}\*}}$$         | Số lần sử dụng của từng mã                                                                       |
| valueType                     | int $$^{{\color{red}\*}}$$         | Kiểu giảm giá: 1 - Tiền mặt, 2 - Chiết khấu                                                      |
| value                         | int $$^{{\color{red}\*}}$$         | Giá trị coupon                                                                                   |
| depotId                       | int or array                       | ID hoặc mảng ID kho được áp dụng mã coupon                                                       |
| categoryId                    | int or array                       | ID hoặc mảng ID doanh mục được áp dụng mã coupon                                                 |
| fromValue                     | int                                | Áp dụng cho hóa đơn có tổng tiền từ                                                              |
| toValue                       | int                                | Áp dụng cho hóa đơn có tổng tiền đến                                                             |
| prefix                        | string(5)                          | Kí tự thêm vào trước mã coupon                                                                   |
| suffix                        | string(5)                          | Kí tự thêm vào sau mã coupon                                                                     |
| valueMax                      | int                                | Giá trị giảm giá tối đa                                                                          |
| description                   | string(255)                        | Mô tả                                                                                            |
| notApplyWithDiscountPromotion | int                                | Không áp dụng cùng chương trình chiết khấu. Giá trị truyền lên: 1                                |

### Response

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array if code = 1                   |

```javascript
[
    "code" => 1 // 1 = đã cập nhật thành công, 0 = failed,
    "messages" => array
    "data" => [
        'couponBacthId' => 1251230 // ID chương trình coupon trên Nhanh.vn
    ]
]
```

## Thêm mã coupon vào chương trình

* /api/promotion/coupon?act=increasecode: Tính năng này được sử dụng để cập nhật thêm mã vào chương trình coupon đã có trên hệ thống

### Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Param         | Type                       | Description                                   |
| ------------- | -------------------------- | --------------------------------------------- |
| couponBatchId | int $$^{{\color{red}\*}}$$ | ID chương trình coupon                        |
| couponNumber  | int $$^{{\color{red}\*}}$$ | Số lượng mã coupon muốn thêm (Tối đa 1000 mã) |
| canUsedTimes  | int $$^{{\color{red}\*}}$$ | Số lần sử dụng từng mã coupon                 |

### Response

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |

```javascript
[
    "code" => 1 // 1 = đã cập nhật thành công, 0 = failed,
    "messages" => array
]
```


# Kho hàng

* /api/store/depot: Tính năng này dùng để lấy danh sách kho của doanh nghiệp. Hỗ trợ tìm kiếm thông qua ID kho.
* Chú ý: Dữ liệu này rất ít khi bị thay đổi (chỉ xảy ra khi doanh nghiệp mở thêm kho mới), bạn có thể cache dữ liệu trên hệ thống của bạn để giảm tải việc phải gọi API liên tục, thời gian cache khuyến cáo là 24h.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key     | Type | Description          |
| ------- | ---- | -------------------- |
| depotId | Int  | Tìm kiếm theo ID kho |

## Response

JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | Mảng danh sách kho của doanh nghiệp       |

```javascript
data = [
    "id" => [
        "id" => int, // ID kho hàng
        "name" => string, // Tên kho hàng,
        "mobile" => string, // Số điện thoại kho hàng,
        "cityId" => int, // ID thành phố,
        "cityName" => string, // Tên thành phố,
        "districtId" => int, // ID quận huyện,
        "districtName" => string, // Tên quận huyện,
        "wardId" => int, // ID phường xã,
        "wardName" => string, // Tên phường xã,
        "address" => string // Địa chỉ kho
    ],
    "id" => [
        "id" => int, // ID kho hàng
        "name" => string, // Tên kho hàng,
        "mobile" => string, // Số điện thoại kho hàng,
        "cityId" => int, // ID thành phố,
        "cityName" => string, // Tên thành phố,
        "districtId" => int, // ID quận huyện,
        "districtName" => string, // Tên quận huyện,
        "wardId" => int, // ID phường xã,
        "wardName" => string, // Tên phường xã,
        "address" => string // Địa chỉ kho
   ]
]
```


# Nhân viên

* /api/user/index: Tính năng này dùng để lấy danh sách nhân viên của doanh nghiệp

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key  | Type | Description                                                           |
| ---- | ---- | --------------------------------------------------------------------- |
| page | int  | Phân trang (giá trị mặc định là 1)                                    |
| icpp | Int  | Số lượng nhân viên trên 1 trang. Mặc định là 10. Tối đa không quá 50. |

## Response

JSON decode the response to get the structure:

| Key      | Type   | Description                    |
| -------- | ------ | ------------------------------ |
| code     | int    | 1 = success or 0 = failed      |
| messages | string | is a error message if code = 0 |
| data     | array  | is an array of articles        |

```javascript
[
    "totalPages" => int // Tổng số page
    "page" => int // Page hiện tại
    "users" => [ // Kết quả trả về
        "id" => [ // user 1
            "id" => int, // Id nhân viên
            "username" => string, // username
            "fullName" => string, // Tên đầy đủ
            "email" => string, // Email
            "mobile" => string, // Mobile
            "roleName" => string, // Nhóm quyền nhân viên
            "depots" => [ // Danh sách kho nhân viên đang quản lý
                // Key này sẽ không được trả về nếu nhân viên
                // không bị giới hạn kho (được quản lý hết các kho)
                "id kho 1" => string, // Tên kho 1
                "id kho 2" => string, // Tên kho 2
                ...
            ]
        ],
        "id" => [ // user 2
            ...    
        ]
    ]
]
```


# Bút toán

* /api/accounting/transaction: Tính năng này dùng để lấy danh sách bút toán ở trên Nhanh.vn. Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 100 bút toán.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key         | Type  | Description                                                                                                                                                                                                                                       |
| ----------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| page        | int   | Phân trang, giá trị mặc định sẽ là 1.                                                                                                                                                                                                             |
| icpp        | int   | Số lượng sản phẩm trên 1 trang. Tối đa không quá 50. Mặc định nếu không set giá trị gì sẽ là 20.                                                                                                                                                  |
| sort        | array | Sắp xếp kết quả, dữ liệu gửi lên là 1 mảng kiểu \[Tiêu chí sắp xếp => cách sắp xếp (asc: tăng dần hoặc desc giảm dần)] Giá trị mặc định sẽ là \[id => desc].Các tiêu chí có thể là: id: id bút toán, date: ngày thu chi, amount: số tiền bút toán |
| id          | int   | Tìm bút toán theo ID                                                                                                                                                                                                                              |
| typeDate    | int   | Tìm theo kiểu ngày.Giá trị 1: Lọc theo ngày giao dịch,2: Lọc theo ngày tạo(Mặc định nếu không set giá trị sẽ là 1)                                                                                                                                |
| fromDate    | date  | Tìm kiếm thời gian bất đầu từ ngày định dạng (yyyy-mm-dd). VD: 2022-09-25                                                                                                                                                                         |
| toDate      | date  | Tìm kiếm thời gian đến ngày (yyyy-mm-dd). VD: 2022-09-25                                                                                                                                                                                          |
| type        | int   | Tìm kiếm theo loại phiếu (xem ở Loại phiếu bên dưới)                                                                                                                                                                                              |
| mode        | int   | Tìm kiếm theo kiểu bút toán(Xem ở Kiểu bút toán bên dưới)                                                                                                                                                                                         |
| filterMode  | int   | Tìm kiếm theo loại hoạch toán.Giá trị 1: Tự động,2: Không tự động                                                                                                                                                                                 |
| contactType | int   | Tìm kiếm theo loại đối tượng.Giá trị 1: Khách hàng,2: Nhà cung cấp,3: Dịch vụ trả góp,4: Nhân viên,20: Khác,21:Sàn thương mại điện tử,                                                                                                            |

## Response

* JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of transaction list           |

```javascript
[
    "totalPages": 30, // int
    "transactions": [
        [], // each transaction item, all properties are listed in the table below
        ...
    ]
]
```

| Key             | Type        | Description                                                                        |
| --------------- | ----------- | ---------------------------------------------------------------------------------- |
| id              | int         | ID bút toán                                                                        |
| date            | date        | Ngày thu chi                                                                       |
| type            | int         | Loại của bút toán (xem bảng Loại phiếu bên dưới)                                   |
| mode            | int         | Kiểu bút toán (xem bảng Kiểu bút toán bên dưới)                                    |
| contactId       | int         | ID đối tương bút toán                                                              |
| contactName     | string(255) | Tên đối tương bút toán                                                             |
| contactCode     | string(255) | Mã đối tương bút toán                                                              |
| itemId          | int         | ID chứng từ bút toán                                                               |
| source          | string(255) | Chứng từ bút toán                                                                  |
| amount          | doulbe      | Số tiền của bút toán                                                               |
| accountDebitId  | int         | ID Tài khoản debit account của bút toán                                            |
| accountDebit    | doulbe      | Tài khoản debit account của bút toán                                               |
| accountCreditId | int         | ID Tài khoản credit của bút toán                                                   |
| accountCredit   | doulbe      | Tài khoản credit của bút toán                                                      |
| description     | string(255) | Ghi chú của bút toán                                                               |
| depotId         | int         | ID kho doanh nghiệp                                                                |
| createdById     | int         | ID người tạo bút toán                                                              |
| createdUserName | string      | Tên người tạo bút toán                                                             |
| createdDateTime | string      | Thời gian giờ tạo bút toán, định dạng yyyy-mm-dd hh:mm:ss, vd: 2025-04-14 20:00:00 |

### Loại phiếu

| Type | Name              |
| ---- | ----------------- |
| 1    | Báo nợ (Rút tiền) |
| 2    | Báo có (Nộp tiền) |
| 3    | Phiếu thu         |
| 4    | Phiếu chi         |
| 5    | Phiếu trả hàng    |
| 6    | Phiếu bán hàng    |
| 7    | Khác              |
| 8    | Phiếu nhập        |
| 9    | Phiếu xuất        |
| 12   | Kết chuyển        |

### Kiểu bút toán

| Mode | Name                                    |
| ---- | --------------------------------------- |
| 1    | Nhập nhà cung cấp                       |
| 2    | Xuất trả nhà cung cấp                   |
| 3    | Bán hàng                                |
| 4    | Hàng trả lại                            |
| 5    | Bán sỉ                                  |
| 6    | Trả lại bán sỉ                          |
| 7    | Nhập máy cũ                             |
| 8    | Bảo hành                                |
| 9    | Xuất linh kiện                          |
| 15   | Chuyển quỹ                              |
| 20   | Hạch toán trả góp                       |
| 21   | Công nợ đầu kì                          |
| 22   | Đơn hàng                                |
| 23   | Đơn hàng trả lại                        |
| 24   | Nhập nhà cung cấp VAT                   |
| 25   | Xuất nhà cung cấp VAT                   |
| 26   | XNK khác                                |
| 27   | Thu hộ trả góp                          |
| 28   | Nhập VAT                                |
| 29   | Xuất VAT                                |
| 30   | Xác nhận nhận tiền thanh toán           |
| 31   | Xác nhận chi tiền thanh toán vận chuyển |
| 32   | Phiếu nhập quà tặng                     |
| 33   | Phiếu xuất quà tặng                     |


# Công nợ khách hàng

* /api/accounting/debts: Tính năng này dùng để lấy danh sách công nợ khách hàng ở trên Nhanh.vn. Dữ liệu sẽ được phân trang, mỗi trang tối đa không quá 50.

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key            | Type                          | Description                                                                                     |
| -------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- |
| page           | int                           | Phân trang, giá trị mặc định sẽ là 1.                                                           |
| icpp           | int                           | Số lượng sản phẩm trên 1 trang. Tối đa không quá 50. Mặc định nếu không set giá trị gì sẽ là 50 |
| contactType    | string $$^{{\color{red}\*}}$$ | Công nợ theo khách hàng, giá trị mặc định: customer                                             |
| id             | int                           | Tìm theo ID đối tượng khách hàng                                                                |
| fromDate       | date                          | Tìm kiếm thời gian bắt đầu từ ngày định dạng (yyyy-mm-dd). VD: 2022-09-25                       |
| toDate         | date                          | Tìm kiếm thời gian đến ngày (yyyy-mm-dd). VD: 2022-09-25                                        |
| code           | string                        | Tìm kiếm theo mã khách hàng                                                                     |
| name           | string                        | Tìm kiếm theo tên khách hàng/ ID khách hàng                                                     |
| address        | string                        | Tìm kiếm theo địa chỉ khách hàng                                                                |
| mobile         | string                        | Tìm kiếm theo số điện thoại khách hàng                                                          |
| itemSubType    | int                           | Tìm kiếm theo loại khách hàng.Giá trị 1: Khách lẻ,2: Khách sỉ,3: Đại lý                         |
| debtType       | int                           | Tìm kiếm theo loại công nợ.Giá trị 1: Phải thu,2: Phải trả,3: Phải thu/Phải trả                 |
| fromLastRemain | float(optional)               | Từ giá trị                                                                                      |
| toLastRemain   | float(optional)               | Đến giá trị                                                                                     |

## Response

* JSON decode the response to get the structure:

| Key      | Type  | Description                               |
| -------- | ----- | ----------------------------------------- |
| code     | int   | 1 = success or 0 = failed                 |
| messages | array | is an array of error messages if code = 0 |
| data     | array | is an array of transaction list           |

```javascript
[
    "totalPages": 30, // int
    "debts": [
        id => [
            ...
        ], // each debts item, all properties are listed in the table below
        ...
    ]
]
```

| Key               | Type   | Description                                  |
| ----------------- | ------ | -------------------------------------------- |
| customerCode      | string | Mã khách hàng                                |
| customerName      | string | Tên khách hàng                               |
| customerMobile    | string | Số điện thoại khách hàng                     |
| firstRemainDebit  | float  | Số dư đầu kì nợ(phải thu) (nếu lọc fromDate) |
| firstRemainCredit | float  | Số dư đầu kì có(phải trả) (nếu lọc fromDate) |
| debit             | float  | Phát sinh trong kì nợ                        |
| credit            | float  | Phát sinh trong kì có                        |
| receive           | float  | Số dư cuối kì nợ (phải thu)                  |
| pay               | float  | Số dư cuối kì có (phải trả)                  |


# Gửi tin Zalo ZNS

* API này dùng để gửi tin nhắn Zalo ZNS.
* Chú ý: Các hành động cài đặt gửi ZNS trên nhanh.vn sẽ do Nhanh.vn tự động gửi, bạn chỉ nên dùng API này cho các hành động phát sinh riêng từ hệ thống của bên bạn.

## Request

* URI: /api/zalo/sendzns. Xem các [common request params](/v2#request-params).
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key           | Type                          | Description                                                                                                                                                                                                                                                                               |
| ------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| zaloOaId      | int $$^{{\color{red}\*}}$$    | Zalo OA Id                                                                                                                                                                                                                                                                                |
| znsTemplateId | int $$^{{\color{red}\*}}$$    | Các mẫu tin đã được Zalo duyệt sẽ có ZNS template Id, xem và tạo mới mẫu tin tại [danh sách template](https://nhanh.vn/setting/zalo/index#zns-templates). **Chú ý**: bạn cần copy cột ZNS template ID chứ không phải cột ID, nếu bạn copy sai, API sẽ báo lỗi ERR\_ZNS\_INVALID\_TEMPLATE |
| mobile        | string $$^{{\color{red}\*}}$$ | Số điện thoại cần gửi                                                                                                                                                                                                                                                                     |
| keywords      | array $$^{{\color{red}\*}}$$  | Từ khóa, giá trị                                                                                                                                                                                                                                                                          |

* **keywords**: mảng các giá trị thay thế các từ khóa trong mẫu tin Zalo ZNS. **Chú ý**:

  * Khi cài hành động gửi tin theo các sự kiện trên Nhanh (Thêm hóa đơn bán lẻ, Thêm đơn hàng...) thì bạn mới cần dùng các từ khóa có sẵn của Nhanh.vn, còn nếu chỉ muốn gửi qua API, thì khi tạo mẫu tin, bạn có thể tạo từ khóa bất kì, đợi Zalo duyệt xong, thì bạn có thể lấy được znsTemplateId để gửi API.
  * Khi Zalo duyệt mẫu tin, các từ khóa thường có dạng **<\_TEN\_KHACH\_HANG\_>** nhưng gửi qua API cần bỏ qua 2 dấu < > chỉ gửi sang **\_TEN\_KHACH\_HANG\_**, Zalo sẽ tự xử lý nối thêm < >

  ```javascript
  [
    '_KEY_1_' : 'value1',
    '_KEY_2_' : 'value2',
    ...
  ]
  ```

### Sample request

```curl
curl --location 'https://pos.open.nhanh.vn/api/zalo/sendzns' \
--form 'accessToken="your_accessToken"' \
--form 'businessId="your_businessId"' \
--form 'appId="your_appId"' \
--form 'version="2.0"' \
--form 'data="{\"znsTemplateId\":\"TEMPLATE_ID\",\"mobile\":\"0988999999\",\"zaloOaId\":\"OA_ID\",\"keywords\":{\"TEN_KHACH_HANG\":\"Nguy\\u1ec5n V\\u0103n \\u0110\\u1ee9c\",\"ID_DON_HANG\":\"19837512\",\"TONG_TIEN\":\"190000\"}}"'
```

## Response

* JSON decode the response to get the structure:

| Key       | Type   | Description                                                                                                                                                                                                                                                                                |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| code      | int    | 1 = success or 0 = failed                                                                                                                                                                                                                                                                  |
| errorCode | string | Xem bảng mã lỗi bên dưới                                                                                                                                                                                                                                                                   |
| messages  | array  | Nội dung cảnh báo hoặc chi tiết lỗi                                                                                                                                                                                                                                                        |
| data      | object | <p>Khi code = 1 API response sẽ trả về:<br>oaBalance: Số dư tài khoản sau khi gửi tin<br>remainingQuota: Số tin nhắn còn được gửi trong ngày<br>dailyQuota: Hạn mức tin nhắn được gửi trong ngày<br>{ "oaBalance": 10000000, "quota": { "remainingQuota": 4995, "dailyQuota": 5000 } }</p> |

### errorCode

* Danh sách mã lỗi khi code = 0

| errorCode                             | Description                                                                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ERR\_ZNS\_OA\_404                     | Doanh nghiệp chưa kết nối OA                                                                                                                            |
| ERR\_ZNS\_INVALID\_OA                 | Zalo OA Id không hợp lệ                                                                                                                                 |
| ERR\_ZNS\_EXCEEDED\_LIMIT\_IN\_DAY    | Vượt quá hạn mức gửi tin trong ngày                                                                                                                     |
| ERR\_ZNS\_OA\_NOT\_ENOUGH\_BALANCE    | Số dư tài khoản không đủ                                                                                                                                |
| ERR\_ZNS\_INVALID\_PHONE\_NUMBER      | Số điện thoại gửi đi không hợp lệ                                                                                                                       |
| ERR\_ZNS\_ZALO\_ACCOUNT\_NOT\_EXISTED | Số điện thoại không có tài khoản Zalo                                                                                                                   |
| ERR\_ZNS\_INVALID\_TEMPLATE           | ZNS template Id không hợp lệ                                                                                                                            |
| ERR\_ZNS\_PROHIBITED\_TIMEFRAME       | Tin nhắn chỉ được gửi trong khoảng thời gian từ 06-22h                                                                                                  |
| ERR\_ZNS\_REQUIRED\_KEYWORDS          | Từ khóa và giá trị không đúng định dạng hoặc null                                                                                                       |
| ERR\_ZNS\_KEYWORDS\_NOT\_MATCH        | <p>Từ khóa sai hoặc thừa với so từ khóa trong mẫu<br>ví dụ: { "invalidKeyword": \["KEYWORD\_1 is required", "KEYWORD\_2 not existed in template"] }</p> |
| ERR\_ZNS\_INVALID\_KEYWORD\_VALUES    | Giá trị từ khóa không hợp lệ                                                                                                                            |
| ERR\_ZNS\_CODE\_1121                  | Dữ liệu keyword vượt quá độ dài tối đa                                                                                                                  |
| ERR\_ZNS\_CODE\_1123                  | Không thể tạo mã QR                                                                                                                                     |
| ERR\_ZNS\_CODE\_1124                  | Dữ liệu keyword có định dạng không hợp lệ                                                                                                               |


# Danh sách gian hàng

* /api/ecom/shops: Tính năng này dùng để lấy danh sách gian hàng sàn TMĐT

## Request

* Xem các [common request params](/v2#request-params)
* Các key của mảng **data array** dùng để tạo **data** json string:

| Key   | Type | Description                                                                          |
| ----- | ---- | ------------------------------------------------------------------------------------ |
| page  | int  | Phân trang (giá trị mặc định là 1)                                                   |
| appId | int  | ID sàn TMĐT (8195 = Shopee, 8855 = Tiktok, 8142 = Lazada, 8237 = Sendo, 8238 = Tiki) |

## Response:

* JSON decode the response to get the structure:

| Key      | Type | Description                               |
| -------- | ---- | ----------------------------------------- |
| code     | int  | 1 = success or 0 = failed                 |
| messages | \[ ] | is an array of error messages if code = 0 |
| data     | \[ ] | is an array of shop list                  |

```javascript
[
    "totalPages" => int,
    "page" => int,
    "shops" => [ // maximum 100 shops per page
        // shop 1
        [
            // see properties in the table below
        ],
        ...
    ]
]
```

| Key       | Type        | Description                                                                          |
| --------- | ----------- | ------------------------------------------------------------------------------------ |
| shopId    | string (64) | ID gian hàng trên sàn TMĐT                                                           |
| appId     | int         | ID sàn TMĐT (8195 = Shopee, 8855 = Tiktok, 8142 = Lazada, 8237 = Sendo, 8238 = Tiki) |
| shopName  | string      | Tên gian hàng trên sàn TMĐT                                                          |
| createdAt | int         | Ngày tạo gian hàng trên Nhanh.vn (định dạng timestamp)                               |
| expiredAt | int         | Ngày hết hạn gian hàng trên Nhanh.vn (định dạng timestamp)                           |


# Giới thiệu

* Webhooks giúp bạn đăng kí lắng nghe các sự kiện phát sinh từ hệ thống của Nhanh.vn, VD:
  * Khi có đơn hàng mới, khi đơn gửi sang hãng vận chuyển, khi đơn hàng thay đổi trạng thái.
  * Khi có sản phẩm mới, khi có cập nhật sản phẩm, khi xóa sản phẩm.
  * Khi có hóa đơn bán hàng mới.
  * Khi có phiếu bảo hành mới.

## Bật webhooks

* Vào [danh sách ứng dụng](https://pos.open.nhanh.vn/apps), click vào tên ứng dụng để vào trang chi tiết.
* Click sửa ứng dụng, kéo xuống mục webhooks:
  * Tích chọn Bật webhooks.
  * Điền Webhooks callback URL (bắt buộc chạy https và response http code = 200 và hỗ trợ POST method, Nhanh API sẽ bắn sang POST, không dùng GET).
  * Điền Webhooks verify token (giá trị này do bạn tự điền, Nhanh API sẽ gửi kèm webhooksVerifyToken khi bắn webhooks để bạn có thể xác minh dữ liệu là từ Nhanh API bắn sang).
  * Chọn các sự kiện muốn đăng kí nhận webhooks và nhấn Lưu.

![Bật Webhooks](https://40622576-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhIoEj3yOAgRRsZcqGM-887967055%2Fuploads%2Fgit-blob-156de3b0d626064ff23817cc755d3c9d006ae09f%2FwebhooksVerifyToken.png?alt=media\&token=1c68624e-4242-4da3-ae9b-012a14d87088)

{% hint style="danger" %}
**Chú ý**: Bạn chỉ nên bật webhooks và điền **Webhooks callback URL** khi bạn đã có link này, không để link liên tục ở tình trạng lỗi (301, 302, 403, 404, 500...) để tránh bị tắt webhooks hoặc khóa app.
{% endhint %}

* Nhanh API sẽ gửi request **webhooksEnabled** tới Webhooks callback URL của bạn để kiểm tra xem URL này có hoạt động hay không.

```javascript
{
    "event":"webhooksEnabled", // Sự kiện khi bật webhooks
    "webhooksVerifyToken":"YOUR_WEBHOOKS_VERIFY_TOKEN", // Webhooks verify token điền trong app của bạn
    "data": {
        "registeredEvents": { // Các events đã đăng kí
	    "101":"productAdd",
	    "102":"productUpdate",
	    "110":"inventoryChange",
	    "202":"orderUpdate"
	}
    }
}
```

## Nhận webhooks

* Với mỗi sự kiện Nhanh.vn sẽ gửi sang 1 request có Content type: **application/json** và request body là **json string**.
* VD với sự kiện bật webhooks lên, Nhanh Open API sẽ bắn sang link webhooks của bạn 1 request như sau:

![Event: Webhooks enabled](https://40622576-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhIoEj3yOAgRRsZcqGM-887967055%2Fuploads%2Fgit-blob-6a865247c77f9485b00b7871f78224ae0170aa4b%2FwebhooksEnabledEvent.jpg?alt=media)

```curl
curl --location --request POST 'https://webhook.site/a1f7177c-f622-4570-b420-ddf79f3b83e9' \
--header 'Content-Type: application/json' \
--data-raw '{
    	"event":"webhooksEnabled",
	"webhooksVerifyToken":"YOUR_WEBHOOKS_VERIFY_TOKEN",
	"data": {
		"registeredEvents": {
			"101":"productAdd",
			"102":"productUpdate",
			"110":"inventoryChange",
			"202":"orderUpdate"
		}
	}
}'
```

### Webhooks data

```javascript
{
    "event": "orderAdd", // Sự kiện khi có đơn hàng mới
    "businessId": bigint,
    "webhooksVerifyToken": string,
    "data": {
        // order's information
        "customerName": string,
        "customerMobile": string,
        ...
        // order product's information
        "products": [
        
        ]
    }
}
```

* event: (string) Tên sự kiện:

| Event           | Description                                                                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webhooksEnabled | Sự kiện khi bạn bật webhooks hoặc NhanhAPI kiểm tra webhooks của bạn có còn hoạt động hay không (thường dùng khi tỉ lệ phản hồi response webhooks của bạn có tỉ lệ thành công thấp) |
| productAdd      | Thêm sản phẩm mới                                                                                                                                                                   |
| productUpdate   | Cập nhật sản phẩm                                                                                                                                                                   |
| productDelete   | Xóa sản phẩm                                                                                                                                                                        |
| inventoryChange | Thay đổi tồn kho của sản phẩm                                                                                                                                                       |
| orderAdd        | Thêm đơn hàng mới                                                                                                                                                                   |
| orderUpdate     | Cập nhật đơn hàng                                                                                                                                                                   |
| orderDelete     | Xóa đơn hàng                                                                                                                                                                        |
| paymentReceived | Đơn hàng hoặc hóa đơn bán hàng (bán lẻ, bán sỉ) nhận được thanh toán từ MoMo hoặc chuyển khoản ngân hàng                                                                            |

* businessId: (bigint) ID doanh nghiệp trên nhanh.vn, dùng khi ứng dụng của bạn tích hợp cho nhiều doanh nghiệp, thì businessId giúp phân biệt dữ liệu của doanh nghiệp nào.
  * Sự kiện **webhooksEnabled** sẽ **không có businessId**.
* webhooksVerifyToken: (string) Key xác minh khi nhận dữ liệu, tương ứng với webhooks verify token trong app của bạn.
* data: (json string) Dữ liệu của sự kiện này.

### Webhooks response

* Hệ thống của bạn cần response http code 200 để NhanhAPI xác nhận bạn đã xử lý thành công.
* Nếu hệ thống của bạn không phản hồi quá chậm, hoặc http code != 200, webhooks sẽ được bắn lại tối đa 3 lần.
  * Khi app của bạn xử lý webhooks chậm hoặc hay lỗi, Nhanh.vn sẽ đẩy độ ưu tiên cho app của bạn xuống thấp, các request webhooks tiếp theo có thể sẽ bị delay.
  * Khuyến cáo bạn nên lưu webhooks và response cho Nhanh.vn trước, rồi tạo cronjob xử lý webhooks sau.
* Nếu hệ thống của bạn xử lý webhooks với **tỉ lệ thành công thấp**, tùy mức độ, NhanhAPI sẽ có thể:
  * Gọi lại sự kiện webhooksEnabled để kiểm tra link webhooks của bạn có hoạt động hay không.
  * Tắt webhooks của app: Bạn cần làm lại các bước bật webhooks như đã mô tả ở trên để mở lại webhooks.
  * Khóa app: Bạn cần liên hệ với đội kĩ thuật của Nhanh.vn qua email <dev@nhanh.vn> để được mở lại app.

## Lỗi thường gặp

* Khi nhận webhooks từ Nhanh.vn bắn sang, bạn có thể gặp phải các tình huống lỗi, xem chi tiết lỗi và cách khắc phục bên dưới:

{% hint style="danger" %}
**Chú ý**: Webhooks sẽ chỉ bắn với các dữ liệu mới, các dữ liệu quá khứ (phát sinh trước thời điểm app được cấp quyền hoặc bật webhooks) sẽ không có sự kiện bắn lại.
{% endhint %}

### App chưa được cấp quyền

* Khi bạn bật được webhooks lên và nhận được sự kiện **webhooksEnabled**, đây chỉ là webhooks test của hệ thống.
* Để nhận được webhooks của doanh nghiệp, thì app của bạn cần được 1 tài khoản thuộc doanh nghiệp đó đăng nhập cấp quyền cho ứng dụng của bạn và bạn cần lấy được accessToken. Xem các bước khởi tạo ứng dụng và đăng nhập cấp quyền [tại đây](/v2#lay-access-token).
* Ở các trang như chi tiết đơn hàng, chi tiết sản phẩm... sẽ có 1 tab API lưu lại tất cả lịch sử nhận API request và gửi webhooks, xin vui lòng kiểm tra kĩ dữ liệu trước khi báo lỗi. VD bạn có thể tạo 1 đơn hàng mới, hoặc cập nhật trạng thái đơn hàng, sau đó xem trang chi tiết đơn hàng sẽ có 1 tab API, bạn có thể xem nội dung webhooks Nhanh bắn sang cho app của bạn.

### Connection timed out

* Lỗi này có thể do nhiều nguyên nhân:
  * Tên miền không hoạt động.
  * Server của bạn bị lỗi hoặc phản hồi quá chậm.
  * Firewall của bạn chặn các request từ Nhanh API.

### Postman Automatically follow redirects

Khi bạn test bằng Postman, mặc định Postman sẽ bật "Automatically follow redirects", bạn cần tắt cài đặt này đi, nếu không khi tự test sẽ thấy http code trả về 200 nhưng thực tế đang trả về 301 / 302. Có 2 cách tắt:

* **Cách 1**: Tắt cho toàn bộ request: Vào menu File > Settings > Tắt: Automatically follow redirects

![Postman: Tắt toàn bộ Automatically follow redirects](https://40622576-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhIoEj3yOAgRRsZcqGM-887967055%2Fuploads%2Fgit-blob-490dfe91010074c81728de12bbddcd9724c506cf%2FwebhooksPostmanSettings_TurnOffFollowLocation_All.jpg?alt=media)

* **Cách 2**: Tắt từng tab request: chọn Settings và tắt Automatically follow redirects

![Postman: Tắt từng tab Automatically follow redirects](https://40622576-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MhIoEj3yOAgRRsZcqGM-887967055%2Fuploads%2Fgit-blob-15521f9e6209ccac8b35985955b20ecccfc62ef1%2FwebhooksPostmanSettings_TurnOffFollowLocation_Tab.jpg?alt=media)

### Wordpress plugin Wordfence

* Nếu bạn dùng **Wordpress** và có cài plugin [Wordfence](https://www.wordfence.com/help/blocking/troubleshooting/#what-is-wordfence) thì có thể bị lỗi trả về http code 503 và không bật được webhooks hoặc nhận webhooks từ Nhanh.vn bắn sang bị chập chờn.
* Cách khắc phục: Gỡ plugin này khỏi Wordpress.

### Lỗi mất webhooks

* Tình huống: Trước đó bạn đã cài đặt và sử dụng webhooks bình thường, sau đó webhooks ngừng bắn hoàn toàn.
* Nguyên nhân: Lỗi này thường là do appId đã bị doanh nghiệp gỡ, hoặc accessToken đã hết hạn.
* Cách kiểm tra: Doanh nghiệp có thể vào Nhanh.vn, mục Cài đặt > [Cài đặt chung](https://nhanh.vn/setting/store/index) > Cài đặt Open API để kiểm tra xem có còn kết nối với appId không. Nếu không còn, bạn có thể hướng dẫn doanh nghiệp thực hiện lại việc đăng nhập cấp quyền.
* Chú ý: accessToken chỉ có hạn sử dụng 1 năm, khi gần hết hạn, bạn nên báo doanh nghiệp cấp quyền để lấy accessToken mới.


# Đơn hàng

* Khi có đơn hàng mới hoặc trạng thái đơn hàng có thay đổi, Nhanh.vn sẽ bắn webhooks về cho hệ thống của bạn.
* Khác với bản 1.0 chỉ hỗ trợ webhooks với các đơn hàng bắn qua API, bản 2.0 hệ thống đã hỗ trợ gửi webhooks cho tất cả đơn hàng (cả đơn tự tạo ở trang quản trị, đơn từ các sàn Lazada, Tiki, Shopee, Sendo, và đơn từ các ứng dụng khác bắn về Nhanh.vn).
* Xem cách [đăng kí nhận và xử lý webhooks](https://apidocs.nhanh.vn/webhooks/webhooks).
* Trên trang quản trị Nhanh.vn, bạn có thể vào trang chi tiết của 1 đơn hàng, tab API để xem lịch sử webhooks của đơn hàng đó.
* Để nhận được webhooks thêm, sửa, xóa đơn hàng, app phải có quyền [Danh sách đơn hàng](https://apidocs.nhanh.vn/order/index)

## Khi có đơn hàng mới

```javascript
{
    "event": "orderAdd",
    "businessId": int, // ID doanh nghiệp trên Nhanh.vn
    "webhooksVerifyToken": string, // Key xác minh khi nhận dữ liệu, tương ứng với webhooks verify token trong app của bạn
    "data": {
        "orderId": int, // ID đơn hàng trên Nhanh.vn
        "shopOrderId": string,  // shop order ID nếu đơn được bắn từ các hệ thống khác sang Nhanh.vn
        "typeId": int, //mã loại đơn hàng
        "type": string, // Loại đơn hàng (Shipping | Shopping,...)
        "shippingTypeId": int, //Mã loại chuyển hàng
        "shippingType": string, // Loại chuyển hàng (Chuyển hàng tận nhà | khách trả hàng,....)
        "moneyDiscount": double, // Tiền chiết khấu
        "moneyDeposit": double, // Tiền đặt cọc
        "moneyTransfer": double, // Tiền chuyển khoản
        "shipFee": double, // Phí vận chuyển
        "codFee": double, // Phí thu tiền hộ
        "customerShipFee": double,// Phí thu của khách,
        "calcTotalMoney": double, // Tổng thu của khách,
        "description": string, // ghi chú của khách hàng
        "customerId": int, // Mã khách hàng
        "customerName": string, // Tên khách hàng
        "customerMobile": string, // Họ tên khách hàng
        "customerEmail": string, // Email khách hàng
        "customerAddress": string, // Địa chỉ khách hàng
        "shipToCityLocationId": int, // Mã thành phố
        "shipToDistrictLocationId": int, // Mã quận/huyện
        "shipToWardLocationId": int, // Mã phường/xã
        "customerCity": string, // Thành phố
        "customerDistrict": string, // Quận huyện
        "customerWard": string, // phường xã
        "createdById" : int, // ID người tạo đơn
        "couponCode": string, // Mã coupon,
        "status": string, // trạng thái đơn hàng. VD: New | Confirming | CustomerConfirming,...
        "statusDescription": string, // status description. VD: Mới | Đang xác nhận | Chờ khách xác nhận,...
        "depotId": int, // ID kho hàng trên Nhanh.vn
        "trackingUrl": string, // Lịch trình đơn hàng
        "createdDateTime" : datetime, // Ngày giờ tạo đơn hàng (format: yyyy-mm-dd h:i:s)
        "products": [
            {
                "id": int, // ID sản phẩm trên Nhanh.vn
                "quantity": int, // số lượng sản phẩm đặt hàng
                "price": double, // giá sản phẩm
                "discount": double, // giá trị khuyến mại của sản phẩm
                "weight": int, // trọng lượng của đơn hàng (tính bằng gram) do doanh nghiệp khai báo.
                "code": string, // Mã sản phẩm
                "barcode": string // Mã vạch sản phẩm
            },
            {
                ...
            },
            ...
        ]
    }
}
```

## Khi cập nhật đơn hàng

* Sự kiện khi người dùng sửa đơn, đổi trạng thái đơn hàng.

```javascript
{
    "event": "orderUpdate",
    "businessId": int, // ID doanh nghiệp trên Nhanh.vn
    "webhooksVerifyToken": string, // Key xác minh khi nhận dữ liệu, tương ứng với webhooks verify token trong app của bạn
    "data": {
        "businessId": int, //ID doanh nghiệp trên Nhanh.vn
        "orderId": int, // ID đơn hàng trên Nhanh.vn
        "shopOrderId": string, // shop order ID nếu đơn được bắn từ các hệ thống khác sang Nhanh.vn
        "status": string, // trạng thái đơn hàng. VD: New | Confirming | CustomerConfirming,...
        "statusDescription" : string, // status description. VD: Mới | Đang xác nhận | Chờ khách xác nhận,...
        "depotId": int, // ID kho hàng trên Nhanh.vn,
        "reason": string, // lý do đổi trạng thái đơn hàng. VD: Không gọi được khách | Sản phẩm lỗi,...
        "deliveryDate": string, // Ngày giao hàng, định dạng: Y-m-d, VD: 2024-04-23,
        "trackingUrl": string, // Lịch trình đơn hàng,
        "moneyTransfer": int, // Tiền chuyển khoản,
        "paymentCode": string, // Mã thanh toán chuyển khoản,
        "products": [
            {
                "id": int, // ID sản phẩm trên Nhanh.vn
                "quantity": int, // số lượng sản phẩm đặt hàng
                "price": double, // giá sản phẩm
                "discount": double, // giá trị khuyến mại của sản phẩm
                "weight": int, // trọng lượng của đơn hàng (tính bằng gram) do doanh nghiệp khai báo.
                "code": string, // Mã sản phẩm
                "barcode": string // Mã vạch sản phẩm
            },
            {
                ...
            },
            ...
        ]
    }
}
```

## Khi xóa đơn hàng

```javascript
{
    "event": "orderDelete",
    "businessId": int, // ID doanh nghiệp trên Nhanh.vn
    "webhooksVerifyToken": string, // Key xác minh khi nhận dữ liệu, tương ứng với webhooks verify token trong app của bạn
    "data": {
        "orderId1", // ID đơn hàng trên Nhanh
        "orderId2", // ID đơn hàng trên Nhanh
        ...
    }
}
```


# Sản phẩm

* Khi thông tin sản phẩm trên Nhanh.vn có thay đổi, Nhanh.vn sẽ bắn webhooks về cho hệ thống của bạn.
* Xem cách [đăng kí nhận và xử lý webhooks](https://apidocs.nhanh.vn/webhooks/webhooks).
* Trên trang quản trị Nhanh.vn, bạn có thể vào trang chi tiết của 1 sản phẩm, tab API, để xem lịch sử webhooks của sản phẩm đó (cả webhooks thay đổi thông tin sản phẩm cũng như webhooks thay đổi tồn kho).
* Để nhận được webhooks thêm, sửa, xóa sản phẩm, app phải có quyền [Danh sách sản phẩm](https://apidocs.nhanh.vn/product/index)

## Thêm mới sản phẩm

```javascript
{
    "event": "productAdd",
    "businessId": int, // ID doanh nghiệp trên Nhanh.vn
    "webhooksVerifyToken": string, // Key xác minh khi nhận dữ liệu, tương ứng với webhooks verify token trong app của bạn
    "data": {
        "productId": int, // ID sản phẩm trên Nhanh.vn
        "shopProductId": string, // shop product ID nếu sản phẩm được bắn từ các hệ thống khác sang Nhanh.vn
        "categoryId": int, // ID danh mục sản phẩm
        "brandId": int, // ID thương hiệu sản phẩm
        "parentId": int, // -1 = Sản phẩm độc lập, -2 = Sản phẩm cha, hoặc > 0 = Sản phẩm con
        "code": string, // mã sản phẩm
        "barcode": string, // mã vạch sản phẩm
        "name": string, // tên sản phẩm
        "price": double, // giá sản phẩm 
        "vat": int, // % thuế giá trị gia tăng
        "image": string, // Đường dẫn tuyệt đối của ảnh đại diện sản phẩm
        "images": array, // Một mảng các đường dẫn tuyệt đối các ảnh khác của sản phẩm
        "status": string, // Trạng thái của sản phẩm
        "description": string, // Mô tả của sản phẩm
        "content": string, // Bài viết chi tiết sản phẩm
        "length": float, // Chiều dài sản phẩm (tính bằng cm)
        "width": float, // Chiều rộng sản phẩm (tính bằng cm)
        "height": float, // Chiều cao sản phẩm (tính bằng cm)
        "createdDateTime": string, // Ngày tạo sản phẩm định dạng: Y-m-d, VD: 2021-09-25
        "inventory": array, // Xem bảng Inventory bên dưới
        "attributes": array // Xem bảng Attributes bên dưới
        "createdById": int // ID user tạo sản phẩm
        "weight": double // khối lượng sản phẩm
    }
}
```

### Attributes

```javascript
[
    {
        "attributeName": string // Tên thuộc tính, VD: Size, Color,...
        "id": int, // id giá trị thuộc tính
        "name": string, // Tên giá trị thuộc tính, VD: S,M,L, Màu đỏ, Màu xanh,...
        "content": string, // content giá trị thuộc tính
    },
    {
        ...
    },
    ...
]
```

## Sửa sản phẩm

```javascript
{
    "event": "productUpdate",
    "businessId": int, // ID doanh nghiệp trên Nhanh.vn
    "webhooksVerifyToken": string, // Key xác minh khi nhận dữ liệu, tương ứng với webhooks verify token trong app của bạn
    "data": {
        "productId": int, // ID sản phẩm trên Nhanh.vn
        "shopProductId": string, // shop product ID nếu sản phẩm được bắn từ các hệ thống khác sang Nhanh.vn
        "categoryId": int, // ID danh mục sản phẩm
        "brandId": int, // ID thương hiệu sản phẩm
        "parentId": int, // -1 = Sản phẩm độc lập, hoặc -2 = Sản phẩm cha, hoặc > 0 = Sản phẩm con
        "code": string, // mã sản phẩm
        "barcode": string, // mã vạch sản phẩm
        "name": string, // tên sản phẩm
        "price": double, // giá sản phẩm 
        "vat": int, // % thuế giá trị gia tăng
        "image": string, // Đường dẫn tuyệt đối của ảnh đại diện sản phẩm
        "images": array, // Một mảng các đường dẫn tuyệt đối các ảnh khác của sản phẩm
        "status": string, // Trạng thái của sản phẩm
        "description": string, // Mô tả của sản phẩm
        "content": string, // Bài viết chi tiết sản phẩm
        "length": float, // Chiều dài sản phẩm (tính bằng cm)
        "width": float, // Chiều rộng sản phẩm (tính bằng cm)
        "height": float, // Chiều cao sản phẩm (tính bằng cm)
        "createdDateTime": string, // Ngày tạo sản phẩm định dạng: Y-m-d, VD: 2021-09-25
        "inventory": array, // Xem bảng Inventory bên dưới
        "attributes": array // Xem bảng Attributes bên trên,
        "weight": double // khối lượng sản phẩm
    }
}
```

## Xóa sản phẩm

```javascript
{
    "event": "productDelete",
    "businessId": int, // ID doanh nghiệp trên Nhanh.vn
    "webhooksVerifyToken": string, //Key xác minh khi nhận dữ liệu, tương ứng với webhooksVerifyToken trong app
    "data": [
        "productId1", // ID sản phẩm trên Nhanh
        "productId2", // ID sản phẩm trên Nhanh
        ...
    ]
}
```

## Inventory

Một mảng thông tin tồn kho của sản phẩm:

```javascript
{
    // Số tổng tồn trên tất cả các kho đang hoạt động
    "remain": int // số lượng tồn
    "shipping": int // số lượng đang giao hàng
    "holding": int // số lượng tạm giữ
    "damage": int // số lượng hàng lỗi
    "available": int // số lượng có thể bán, sử dụng số này để hiển thị số tồn trên website hoặc chặn việc đặt các sản phẩm hết hàng.
    "depots": { // số tồn chi tiết trong từng kho
        depotId1: {
            "remain": int // số lượng tồn
            "shipping": int // số lượng đang giao hàng
            "holding": int // số lượng tạm giữ
            "damage": int // số lượng hàng lỗi
            "available": int // số lượng có thể bán, sử dụng số này để hiển thị số tồn trên website hoặc chặn việc đặt các sản phẩm hết hàng.
        },
        depotId2: {
            ...
        }
    }
}
```


# Tồn kho

* Khi tồn kho trên Nhanh.vn có thay đổi, Nhanh.vn sẽ bắn webhooks về cho hệ thống của bạn.
  * Khi các hóa đơn, đơn hàng phát sinh xuất nhập kho gần nhau, hoặc khi app của bạn lỗi xử lý webhooks: Nhanh bắn webhooks có thể gom nhiều sản phẩm lại chung 1 request webhooks, tối đa 100 sản phẩm (Chú ý số 100 này có thể thay đổi trong tương lai, xin vui lòng theo dõi tài liệu để cập nhật).
* Xem cách [đăng kí nhận và xử lý webhooks](https://apidocs.nhanh.vn/webhooks/webhooks)
* Để nhận được webhooks tồn kho, app phải có quyền [Danh sách sản phẩm](https://apidocs.nhanh.vn/product/index)

```javascript
{
    "event": "inventoryChange",
    "businessId": int, // ID doanh nghiệp trên Nhanh.vn
    "webhooksVerifyToken": string, // Key xác minh khi nhận dữ liệu, tương ứng với webhooks verify token trong app của bạn
    "data": {
        "id": {
            "id": int, // ID sản phẩm trên Nhanh.vn,
            "shopProductId": string, // shop product ID nếu sản phẩm được bắn từ các hệ thống khác sang Nhanh.vn
            "remain": int, // số lượng tồn
            "shipping": int, // số lượng đang giao hàng
            "holding": int, // số lượng tạm giữ
            "damage": int, // số lượng hàng lỗi
            "available": int, // số lượng có thể bán, sử dụng số này để hiển thị số tồn trên website hoặc chặn việc đặt các sản phẩm hết hàng.
            "depots": { // số tồn chi tiết trong từng kho
                "depotId1": {
                    "remain": int, // số lượng tồn
                    "shipping": int, // số lượng đang giao hàng
                    "holding": int, // số lượng tạm giữ
                    "damage": int, // số lượng hàng lỗi
                    "available": int, // số lượng có thể bán, sử dụng số này để hiển thị số tồn trên website hoặc chặn việc đặt các sản phẩm hết hàng.
                },
                "depotId2": {
                    ...
                }
            }
        },
        "id": {
            ...
        }
    }
}
```



