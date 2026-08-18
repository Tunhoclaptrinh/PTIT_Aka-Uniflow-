# **UNIFLOW AI — CẨM NANG THUYẾT TRÌNH, KỊCH BẢN DEMO SÂN KHẤU & BỘ PHẢN BIỆN CHUYÊN SÂU**

### **Phân hệ: Dành cho Đội ngũ Thuyết trình (Pitching), Vận hành Demo & Đối đáp Ban Giám Khảo**

---

## **PHẦN I: KỊCH BẢN DEMO 5 BƯỚC THUYẾT PHỤC BAN GIÁM KHẢO (SHOWCASE WOW FACTOR)**

### **1. Sơ đồ luồng tự động 0-chạm (Zero-Touch Logistics Flow)**
```
[Sự kiện: Khách đặt hàng trên Sàn TikTok Shop / Yêu cầu đổi trả]
       │
       ├──> (0.1 giây) Webhook kích hoạt, đẩy dữ liệu sang UniFlow AI
       │
       ├──> (Lõi AI Agent Engine) Tiếp nhận & Phân luồng:
       │      ├──> AI Auto-Mapping: Nhận diện & khớp chính xác SKU sản phẩm.
       │      ├──> AI Logic: Kiểm tra tồn kho khả dụng trên hệ thống ERP/Sapo.
       │      └──> AI Routing: Quét API lấy cước ship tối ưu ──> Tự gọi lệnh tạo vận đơn GHTK.
       │
       └──> (Action) Tự động trừ kho, cập nhật trạng thái sàn, kích hoạt máy in tem vận đơn.
(Toàn bộ tiến trình xử lý < 0.5s | Hoàn toàn không cần con người can thiệp)
```

### **2. Kịch bản Demo 5 Bước Trực Quan Trên Sân Khấu**
1. **Bước 1 — Chuẩn bị thiết bị:** Chiếu 2 màn hình giả lập trên sân khấu: Màn hình A (Sàn TMĐT TikTok Shop) và Màn hình B (Kho nội bộ Sapo).
2. **Bước 2 — Thao tác trực tiếp:** Thuyết trình viên bấm nút *"Tạo 1 đơn hàng mới"* tại Màn hình A.
3. **Bước 3 — Hiệu ứng trung gian:** Chuyển sang màn hình UniFlow AI, BGK thấy dòng Webhook nhận dữ liệu nảy lên, lõi AI quét mã sản phẩm và sáng đèn chuyển tiếp luồng dữ liệu (chỉ trong **0.2 giây**).
4. **Bước 4 — Kết quả trực quan (Wow Factor):** Nhìn sang Màn hình B (Kho Sapo), con số tồn kho tự động giảm đi 1 đơn vị ngay lập tức mà **không cần bấm F5 hay Reload trang**.
5. **Bước 5 — Thông điệp chốt hạ:**
   > *"Như Ban giám khảo vừa thấy, UniFlow AI đã san phẳng hoàn toàn ốc đảo dữ liệu. Không còn nhân viên nhập liệu, không còn rủi ro lệch kho. Một luồng Logistics 0-chạm đã được hoàn thành với chi phí tối giản nhất."*

---

## **PHẦN II: BỘ TIÊU CHÍ CHẤM THI CHUYÊN GIA & LUẬN ĐIỂM BẢO VỆ**

* **✨ Tính mới & Sáng tạo (Novelty) — [8.5 / 10]:**
  * *Luận điểm:* Thay vì tạo thêm một phần mềm bán hàng gây bão hòa, nhóm tạo ra "Hạ tầng kết nối trung lập" (Agnostic Middleware).
  * *Đột phá:* Ứng dụng Lõi AI Agent để xử lý dữ liệu phi cấu trúc (AI NLP tự động đọc hiểu và khớp mã SKU lệch tên "Áo thun nam" và "Áo phông nam") và cơ chế tự phục hồi luồng dữ liệu (Error-Healing) thay vì chỉ đồng bộ theo quy tắc tĩnh máy móc.
* **📈 Tính hiệu quả (Effectiveness) — [9.5 / 10]:**
  * *Luận điểm:* Giải quyết nỗi đau trực tiếp của doanh nghiệp.
  * *Đo lường:* Cắt giảm thời gian đồng bộ từ hàng giờ (nhập tay) xuống **dưới 0.5 giây**. Triệt tiêu 100% rủi ro lệch kho (nguyên nhân gây mất 5.6% doanh thu theo IHL Group). Tiết kiệm hàng trăm triệu chi phí triển khai hệ thống ERP cồng kềnh.
* **🛠️ Tính khả thi (Feasibility) — [8.5 / 10]:**
  * *Luận điểm:* Cực kỳ khả thi vì dự án **thuần 100% phần mềm SaaS**, không cần lắp đặt phần cứng, cảm biến RFID hay bắt shipper cài app mới.
  * *Thực tế:* Xây dựng bản Demo MVP kết nối API giữa các hệ thống giả lập hoàn toàn nằm trong tầm tay của sinh viên CNTT & Kinh tế trong 4–8 tuần.

---

## **PHẦN III: BỘ CÂU HỎI PHẢN BIỆN CHUYÊN SÂU & CHIẾN LƯỢC TRẢ LỜI**

### **Câu hỏi 1: "Nếu người mới bắt đầu kinh doanh mua trọn gói Sapo hay MISA thì UniFlow AI bán cho ai?"**
*Thắc mắc phản biện:* *"Khách hàng mục tiêu chỉ là những người dùng các nền tảng khác ngoài Sapo hay MISA thôi à? Vì Sapo hay MISA có đầy đủ tính năng đồng bộ rồi, người mới sẽ mua cả hệ sinh thái chứ mua lẻ từng phần mềm làm gì?"*

#### **Chiến lược trả lời (Trình bày 3 thực tế thị trường):**

#### **Thực tế 1: Kịch bản "Mua trọn gói 1 hệ sinh thái" thường thất bại khi doanh nghiệp tăng trưởng**
Lý thuyết cho rằng người mới sẽ mua trọn bộ Sapo (POS + Web + App) hoặc MISA (eShop + AMIS Kế toán). Nhưng thực tế vận hành luôn diễn ra như sau:
* **Không có hệ sinh thái nào giỏi toàn diện:** Sapo mạnh về bán lẻ nhưng chốt đơn livestream không chuyên sâu bằng Pancake. MISA mạnh về Kế toán - Thuế nhưng giao diện kho bãi TMĐT không mượt bằng ứng dụng chuyên biệt.
* **Xu hướng "Best-of-Breed" (Chọn ứng dụng tốt nhất cho từng khâu):** Khi đạt quy mô lớn, doanh nghiệp buộc phải phối hợp:
  * Chốt đơn Facebook/TikTok Live: Dùng **Pancake**.
  * Quản lý cửa hàng (POS): Dùng **KiotViet** hoặc **Sapo**.
  * Kế toán & Thuế: Bắt buộc dùng **MISA AMIS**.
  * Vận chuyển: Dùng **GHTK / Viettel Post / AhaMove**.
* **Kết quả:** Dù ban đầu mua trọn gói, sau 6–12 tháng doanh nghiệp vẫn rơi vào trạng thái phân mảnh phần mềm.

#### **Thực tế 2: Sự khác biệt giữa "Đồng bộ có sẵn" của Sapo/MISA và "Tự động hóa thông minh" của UniFlow AI**

| Tính năng | Đồng bộ tích hợp sẵn (Sapo / MISA) | Tự động hóa thông minh (UniFlow AI) |
| :--- | :--- | :--- |
| **Bản chất đồng bộ** | **Quy tắc tĩnh (Static Rules):** Yêu cầu mã SKU giữa các sàn và kho phải chính xác từng ký tự. | **Lõi AI Agent (NLP):** Tự động đọc hiểu và khớp các SKU lệch tên (VD: "Áo thun đen L" $\leftrightarrow$ "AT-DEN-L-001"). |
| **Xử lý sự cố** | Khi mất kết nối API hoặc gián đoạn mạng, hệ thống **báo lỗi và dừng luồng**, bắt nhân viên vào sửa tay. | **Cơ chế Error-Healing:** AI tự nhận diện lỗi, bẻ lái đơn sang hãng ship/kho dự phòng và tự phục hồi luồng dữ liệu. |
| **Điều phối Logistics** | Đẩy đơn sang hãng ship theo cấu hình cố định sẵn. | **AI Dynamic Routing:** Quét giá cước thời gian thực của tất cả hãng ship, tự chọn hãng cước rẻ nhất / giao nhanh nhất để đẩy đơn. |
| **Xử lý Logistics ngược** | Báo trạng thái hủy/hoàn đơn cơ bản. | Tự động hóa quy trình đối soát hoàn hàng, kiểm tra bất thường (gian lận/tráo hàng) bằng AI Thị giác máy tính. |

#### **Thực tế 3: Ba chân dung Khách hàng Mục tiêu (ICP) nét căng của UniFlow AI**
* **Nhóm 1: Doanh nghiệp đã lỡ dùng "Hỗn hợp" nhiều phần mềm (Chân dung lớn nhất):**
  * *Thực trạng:* Dùng POS KiotViet, bán trên TikTok/Shopee, kế toán làm MISA, ship qua GHTK.
  * *Nỗi đau:* Các bên không đồng bộ trực tiếp với nhau. Chi phí đập đi xây lại tốn hàng trăm triệu và gây gián đoạn kinh doanh.
  * *Lý do mua UniFlow AI:* Lớp keo dán kết nối các phần mềm cũ trong 5 phút mà không bắt bỏ app nào.
* **Nhóm 2: Nhà bán hàng Đa kênh quy mô vừa và lớn (Power Sellers / Brands):**
  * *Thực trạng:* Dùng Sapo/MISA nhưng xử lý từ 1.000 – 10.000 đơn/ngày.
  * *Nỗi đau:* Bị nghẽn lệnh vào đợt Siêu Sale, tỷ lệ lệch kho vẫn xảy ra do SKU lệch tên, cước ship bị đội cao do không so sánh giá linh hoạt.
  * *Lý do mua UniFlow AI:* Dùng Lõi AI Auto-Mapping, hàng đợi chống nghẽn Redis Queue và Tự động tối ưu cước ship.
* **Nhóm 3: Người mới kinh doanh khởi nghiệp "Tinh gọn" (Lean Startups):**
  * *Thực trạng:* Ngân sách hạn chế, không đủ tiền mua trọn gói Enterprise đắt đỏ của Sapo hay MISA.
  * *Lý do mua UniFlow AI:* Chọn phương án "xếp hình" các app lẻ giá rẻ/miễn phí, dùng gói Starter 299k của UniFlow AI để nối lại. Khi mở rộng chỉ cần gắn thêm khối Node mới.

**Tóm lại:** Sapo hay MISA bán "Ngôi nhà trọn gói" (Walled Garden). UniFlow AI cung cấp "Hạ tầng kết nối trung lập" (Agnostic Middleware). UniFlow AI không cạnh tranh bằng cách tạo thêm phần mềm bán hàng mới, mà đứng ở giữa để hoàn thiện luồng tự động hóa cho những gì khách hàng đang sử dụng.

---

### **Câu hỏi 2: "Ý tưởng này có mới không? Đã có ai trên thị trường làm chưa?"**
* **Trả lời:**
  * Mô hình iPaaS (Zapier, Make) đã rất thành công trên thế giới. Tuy nhiên, họ bỏ ngỏ thị trường Việt Nam vì giá quá đắt và không có API các phần mềm nội địa (KiotViet, Sapo, GHN, GHTK).
  * Các đơn vị trong nước (Sapo, Pancake) lại là hệ sinh thái đóng, không cho phép kết nối chéo với phần mềm đối thủ.
  * UniFlow AI chiếm lĩnh **khoảng trống chiến lược duy nhất**: Phần mềm trung gian độc lập (Agnostic), tích hợp sâu 100% app Việt Nam với chi phí bản địa hóa siêu rẻ và trang bị Lõi AI thông minh.

---

### **Câu hỏi 3: "Tại sao giai đoạn 1 (MVP) chỉ thử nghiệm với 20 nhà bán hàng? Có phải dự án quá dè dặt?"**
* **Trả lời:**
  * Con số 20 shop là **yêu cầu kỹ thuật bắt buộc**, không phải sự dè dặt.
  * TikTok Shop giới hạn nghiêm ngặt 50 request/giây/shop, Shopee giới hạn 100 req/phút/partner. Việc thử nghiệm với 20 shop giúp tinh chỉnh thuật toán điều phối băng thông, tránh vi phạm chính sách của sàn.
  * Đây là quy mô tối ưu để đội ngũ trực tiếp hỗ trợ 1-1 qua Zalo, giám sát rủi ro lệch kho thủ công trước khi nộp hồ sơ xin cấp quyền Public App và mở rộng quy mô.

---

## **PHẦN IV: BẢNG TRA CỨU NHANH 8 THUẬT NGỮ CHUYÊN NGÀNH**

1. **iPaaS (Integration Platform as a Service):** Nền tảng tích hợp đám mây, kết nối các ứng dụng phần mềm độc lập giao tiếp và chia sẻ dữ liệu tự động.
2. **Lean Middleware (Phần mềm trung gian tinh gọn):** Lớp phần mềm mỏng làm nhiệm vụ phiên dịch và chuyển tiếp dữ liệu mà không làm xáo trộn hạ tầng sẵn có.
3. **Data Silos (Ốc đảo dữ liệu):** Tình trạng dữ liệu bị cô lập trong từng phần mềm riêng biệt, dẫn đến lệch kho và bán vượt tồn kho (Overselling). Mất trung bình 5.6% doanh thu theo IHL Group.
4. **Reverse Logistics (Logistics ngược):** Quá trình thu hồi hàng hóa từ người tiêu dùng về kho để xử lý đổi trả, hoàn hủy. Chi phí logistics VN chiếm 16.8%–20% GDP theo Bộ Công Thương.
5. **System Fragmentation (Sự phân mảnh hệ thống):** Tình trạng doanh nghiệp vận hành quá nhiều phần mềm rời rạc, làm đứt gãy luồng quản trị.
6. **Technical Bloat (Sự cồng kềnh kỹ thuật):** Tình trạng phần mềm bị nhồi nhét quá nhiều tính năng thừa thãi (như ERP khổng lồ), bắt SMEs phải trả giá cao cho thứ không dùng đến.
7. **Zero-Touch Logistics (Logistics 0-chạm):** Quy trình quản trị đơn hàng, kho và vận chuyển được tự động hóa ngầm 100%, triệt tiêu hoàn toàn sự can thiệp thủ công của con người.
8. **CapEx (Capital Expenditure):** Chi phí đầu tư tài sản cố định ban đầu (phần cứng, cảm biến). Giải pháp SaaS của UniFlow AI đưa CapEx về 0 đồng.
