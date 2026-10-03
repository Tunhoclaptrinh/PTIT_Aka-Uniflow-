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

