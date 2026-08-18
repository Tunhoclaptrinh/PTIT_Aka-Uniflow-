# **UNIFLOW AI — ĐỀ ÁN KINH DOANH, NGHIÊN CỨU THỊ TRƯỜNG & CHIẾN LƯỢC GO-TO-MARKET**

### **Phân hệ: Dành cho Ban Giám Khảo, Nhà Đầu Tư, Đối Tác & Khối Kinh Doanh (E-Commerce)**

---

## **PHẦN I: SƠ LƯỢC Ý TƯỞNG & ĐỊNH VỊ CHIẾN LƯỢC**

* **Tên dự án:** UniFlow (UniFlow AI) — Nền tảng trung gian tự động hóa & đồng bộ chuỗi cung ứng đa kênh (*Omnichannel Supply Chain iPaaS*).
* **Slogan định vị:** *"UniFlow — Kết nối vô hình, Vận hành thông minh."*
* **Ý tưởng cốt lõi:**
  > *"Sự bùng nổ của thương mại điện tử đang thúc đẩy các nhà bán lẻ chuyển từ kinh doanh đơn kênh sang đa kênh, đồng thời sử dụng nhiều phần mềm riêng biệt cho quản lý kho, kế toán, khách hàng và vận chuyển. Sự đa dạng này lại tạo ra một “nút thắt” mới: dữ liệu bị phân mảnh giữa nhiều hệ thống không đồng nhất. Người bán phải liên tục kiểm tra, nhập lại và đối soát đơn hàng, tồn kho, doanh thu giữa các nền tảng, vừa tốn thời gian và nhân lực, vừa tiềm ẩn nguy cơ sai lệch. Vì vậy, thách thức hiện nay không còn là thiếu công cụ quản lý, mà là thiếu khả năng kết nối và đồng bộ hiệu quả giữa các công cụ đang sử dụng.*
  >
  > *Từ vấn đề trên, nhóm đề xuất **UniFlow AI – nền tảng trung gian tích hợp và tự động hóa**, kết nối các kênh bán hàng với hệ thống POS/kho, kế toán, CRM, logistics và các phần mềm liên quan thông qua API/Webhook. UniFlow tiếp nhận, chuẩn hóa và đồng bộ dữ liệu giữa các hệ thống theo thời gian thực; đồng thời cho phép thiết lập Workflow để tự động hóa luồng xử lý. AI hỗ trợ nhận diện cùng một sản phẩm có tên/mã khác nhau giữa các nền tảng, phát hiện bất thường, cảnh báo thiếu hàng và hỗ trợ dự báo nhu cầu. Qua đó, UniFlow giúp giảm thao tác thủ công, hạn chế sai sót và đơn giản hóa hoạt động vận hành đa kênh.*
  >
  > *Điểm khác biệt cốt lõi của UniFlow nằm ở định hướng **“kết nối thay vì thay thế”**. Thay vì xây dựng một hệ sinh thái mới và yêu cầu doanh nghiệp chuyển toàn bộ hoạt động sang một nền tảng, UniFlow đóng vai trò là **lớp kết nối giữa những công cụ doanh nghiệp đã sử dụng**. Kết hợp kiến trúc tích hợp mở, Workflow tùy chỉnh và AI hỗ trợ xử lý dữ liệu, UniFlow giúp doanh nghiệp tận dụng hạ tầng sẵn có, giảm chi phí chuyển đổi và linh hoạt mở rộng thêm kênh bán hoặc phần mềm mới khi nhu cầu kinh doanh thay đổi."*

---

## **PHẦN II: TÍNH CẤP THIẾT CỦA VẤN ĐỀ & CƠ SỞ KHOA HỌC**

### **1. Bối cảnh thị trường TMĐT Việt Nam & Áp lực dữ liệu**
Thị trường bán lẻ trực tuyến Việt Nam đang tăng trưởng mạnh, kéo theo khối lượng giao dịch và dữ liệu mà nhà bán hàng phải xử lý ngày càng lớn. 
* **Doanh số bùng nổ:** Theo Metric, năm 2025, tổng doanh số trên Shopee, TikTok Shop, Lazada và Tiki đạt **429,7 nghìn tỷ đồng**, tăng **34,75%** so với năm 2024, với khoảng **3,94 tỷ sản phẩm** được bán ra. Sang quý I/2026, doanh số trên 4 sàn tiếp tục tăng **46,6%** so với cùng kỳ năm trước.
* **Quy mô toàn ngành:** Theo Bộ Công Thương, quy mô TMĐT Việt Nam năm 2025 đạt khoảng **31 tỷ USD**, tăng **25,5%** và chiếm khoảng 10% tổng mức bán lẻ hàng hóa và dịch vụ.
* **Áp lực chính sách và pháp lý:** Yêu cầu về độ chính xác của dữ liệu càng trở nên quan trọng khi **Nghị định 117/2025/NĐ-CP**, có hiệu lực từ 01/07/2025, quy định cụ thể hơn về quản lý, khấu trừ, kê khai và nộp thuế đối với hoạt động kinh doanh trên nền tảng thương mại điện tử, nền tảng số.

### **2. Dẫn chứng khoa học về tổn thất vận hành**
* **Tổn thất do đứt gãy thông tin (Data Silos):** Theo báo cáo *"Inventory Distortion"* của tập đoàn nghiên cứu bán lẻ IHL Group, việc thiếu đồng bộ dữ liệu thời gian thực khiến các doanh nghiệp bán lẻ mất trung bình **5.6% doanh thu** do tình trạng cháy hàng (Out-of-Stock/Overselling), đồng thời gánh thêm **11.7% chi phí ẩn** do tồn kho quá mức (Overstocking) để "gánh" rủi ro *([Nguồn: IHL Group Research](https://www.ihlservices.com/))*. Tại Việt Nam, khảo sát từ CEL Consulting chỉ ra có tới **58% doanh nghiệp không có hệ thống quản lý tồn kho tự động** *([Nguồn: CEL Consulting Vietnam](https://www.cel-consulting.com/))*.
* **Chi phí Logistics nội địa quá cao:** Theo *Báo cáo Chỉ số Logistics thị trường mới nổi (Agility)* và dữ liệu từ *Bộ Công Thương Việt Nam*, chi phí logistics tại Việt Nam chiếm tới **16.8% – 20% GDP**, cao hơn rất nhiều mức trung bình toàn cầu (10% - 11.6%). Trong đó, khâu quản trị chặng cuối và logistics ngược (*Reverse Logistics* - đổi trả, hoàn hủy) chiếm tỷ trọng lãng phí lớn nhất. Chỉ cần giảm 1% chi phí này, nền kinh tế có thể tiết kiệm hàng tỷ USD mỗi năm *([Nguồn: Báo cáo Logistics Việt Nam - Bộ Công Thương](https://moit.gov.vn/))*.
* **Xu hướng AI trong Chuỗi cung ứng:** Theo báo cáo dự phóng của *Gartner*, hơn **75%** các tổ chức bán lẻ lớn sẽ ứng dụng AI vào dự báo và quản trị quy trình đến năm 2030. AI hỗ trợ tăng 50% độ chính xác của dự báo nhu cầu và giảm lượng tồn kho an toàn xuống từ 20% đến 30% *([Nguồn: Gartner Supply Chain Research](https://www.gartner.com/en/supply-chain))*.

---

## **PHẦN III: KHÁCH HÀNG MỤC TIÊU & QUY MÔ THỊ TRƯỜNG**

### **1. Chân dung khách hàng đại diện (Buyer Persona)**
* **Nhân vật đại diện:** Nguyễn Minh Anh, 29 tuổi, Hà Nội.
* **Nghề nghiệp:** Chủ hộ kinh doanh thời trang online, quy mô 5–7 nhân sự, 1 kho hàng.
* **Kênh bán hàng & Doanh thu:** Shopee (300 triệu/tháng), TikTok Shop (500 triệu/tháng), Instagram (30 triệu/tháng).

#### *Bối cảnh và hành vi:*
Minh Anh khởi đầu từ một shop thời trang nhỏ và dần mở rộng sang nhiều kênh để tiếp cận thêm khách hàng. Hiện mỗi sàn được quản lý trên hệ thống riêng, trong khi dữ liệu doanh thu và tồn kho được nhân viên tổng hợp chủ yếu bằng Excel/Google Sheets. Shop chưa muốn triển khai một hệ thống quản trị lớn do chi phí đầu tư, thời gian chuyển đổi dữ liệu và yêu cầu nhân viên phải làm quen với quy trình mới.

#### *Vấn đề đang gặp phải:*
* **Dữ liệu bị phân mảnh:** Đơn hàng, doanh thu và tồn kho nằm trên nhiều nền tảng khác nhau nên nhân viên phải tải, nhập và đối soát dữ liệu giữa các kênh.
* **Khó đồng bộ tồn kho:** Cùng một sản phẩm có thể được đặt tên hoặc mã hóa khác nhau trên từng nền tảng, làm tăng nguy cơ sai lệch.
* **Khó mở rộng:** Lượng đơn càng tăng thì khối lượng công việc vận hành và nhu cầu nhân sự cũng tăng theo.
* **Áp lực về độ chính xác dữ liệu:** Khi yêu cầu quản lý, kế toán và nghĩa vụ thuế đối với hoạt động kinh doanh trên nền tảng số ngày càng chặt chẽ, việc tổng hợp dữ liệu thủ công trở nên rủi ro hơn.

#### *Mong muốn:*
* Tiếp tục mở rộng quy mô kinh doanh để gia tăng doanh thu nhưng không muốn chi phí nhân sự vận hành tăng tương ứng.
* Giảm các công việc nhập liệu lặp lại, kiểm soát tồn kho chính xác hơn.
* Có một nguồn dữ liệu thống nhất phục vụ quản trị, kế toán và ra quyết định.

### **2. Quy mô thị trường (TAM - SAM - SOM)**
* **TAM (Tổng thị trường khả dụng):** Toàn bộ nhà bán hàng đang hoạt động trên thị trường TMĐT Việt Nam có nhu cầu kết nối, đồng bộ dữ liệu. Nhóm sử dụng **601.780 shop có phát sinh đơn hàng trên 4 sàn TMĐT lớn trong năm 2025** làm cơ sở đại diện cho TAM.
* **SAM (Thị trường mục tiêu):** Tập trung vào **nhà bán lẻ đa kênh quy mô nhỏ và vừa (SMEs)** — nhóm có lượng giao dịch đủ lớn để phát sinh nhu cầu đồng bộ dữ liệu nhưng chưa có hệ thống tích hợp riêng. SAM được xác định bằng: $\text{Tỷ lệ nhóm khách hàng SME bán đa kênh từ khảo sát} \times \text{TAM}$.
* **SOM (Thị trường có thể khai thác):** Phần SAM mà UniFlow có khả năng thực tế chuyển đổi thành khách hàng trong 1–3 năm đầu: $\text{SOM} = \text{Số khách hàng trả phí dự kiến} \times \text{Doanh thu trung bình trên mỗi khách hàng (ARPU)/năm}$.

---

## **PHẦN IV: MA TRẬN PHÂN CỰC ĐỐI THỦ CẠNH TRANH & ĐỊNH VỊ KHÁC BIỆT**

Thị trường hiện nay bị phân cực rõ rệt bởi 2 nhóm:

1. **Nhóm iPaaS Toàn cầu (Zapier, Make.com, Celigo, MuleSoft):** Rất mạnh về tích hợp ứng dụng quốc tế, nhưng chi phí quá đắt đỏ và không hỗ trợ kết nối bản địa (GHTK, GHN, KiotViet, Sapo, MISA).
2. **Nhóm Hệ sinh thái Quản lý Bán hàng Nội địa (Sapo, KiotViet, MISA eShop, Nhanh.vn, Pancake):** Có sẵn kết nối cơ bản nhưng là **Hệ sinh thái đóng (Walled Gardens)** — bắt buộc khách hàng phải mua trọn gói phần mềm của họ và không thể giao tiếp nếu doanh nghiệp dùng kết hợp các công cụ của đối thủ.

| Tiêu chí | Hệ sinh thái Nội địa (Sapo / MISA) | iPaaS Toàn cầu (Zapier / Make) | UniFlow AI (Omnichannel Lean iPaaS) |
| :--- | :--- | :--- | :--- |
| **Bản chất** | Phần mềm đóng (*Walled Garden*) | iPaaS tổng quát (*General iPaaS*) | Phần mềm trung gian chuyên biệt (*Lean iPaaS*) |
| **Tính trung lập** | Thấp (Ép buộc dùng trọn bộ) | Cao (Chủ yếu app quốc tế) | **Tuyệt đối (Kết nối mọi bên với mọi bên)** |
| **Tích hợp app VN** | Giới hạn trong đối tác nội bộ | Rất thấp (Thiếu API bản địa) | **100% Hệ sinh thái Bán lẻ & Logistics VN** |
| **Cơ chế xử lý** | Quy tắc tĩnh (*Static Rules*) | Quy tắc tĩnh (If/Else) | **AI Agent NLP khớp SKU & Error-Healing** |
| **Chi phí CapEx** | Trung bình | 0 đồng | **0 đồng (Thuần SaaS)** |
| **Điều phối ship** | Bảng giá cố định | Không hỗ trợ logistics chuyên sâu | **Quét cước real-time, AI định tuyến tối ưu** |

---

## **PHẦN V: MÔ HÌNH DOANH THU KÉP (HYBRID MONETIZATION) & CÁC NGUỒN THU MỞ RỘNG**

1. **Bán SaaS theo lượng tiêu thụ (Usage-Based):**
   * *Gói Starter (299.000 VNĐ/tháng):* Dành cho shop nhỏ, tối đa 3 kết nối, 2.000 lệnh đồng bộ/tháng.
   * *Gói Growth (799.000 VNĐ/tháng):* Tối đa 15.000 lệnh đồng bộ, mở khóa AI Auto-Mapping và Error-Healing.
   * *Gói Enterprise:* Thu phí động theo dung lượng thực tế (**30 – 50 VNĐ / lệnh đồng bộ**).
2. **Hoa hồng Logistics Kickback (Affiliate Freight Aggregator):** Nhận chiết khấu từ **3% đến 7%** từ các hãng ship (GHN, GHTK...) trên tổng cước phí vận chuyển điều phối qua hệ thống.
3. **Chợ Ứng dụng Mở (Node & Workflow Marketplace):** Thu phí hoa hồng **20%** trên mỗi giao dịch bản quyền khối Node từ lập trình viên bên thứ ba.
4. **Giao thức Dữ liệu Tín dụng Chuỗi Cung ứng (Fintech Data Protocol):** Hợp tác Fintech cung cấp báo cáo dữ liệu vận hành thời gian thực để cấp vốn vay tín chấp (*Revenue-Based Financing*), thu phí dịch vụ dữ liệu.

---

## **PHẦN VI: LỘ TRÌNH PHÁT TRIỂN & CHIẾN LƯỢC GO-TO-MARKET (GTM)**

### **1. Lộ trình 3 giai đoạn**
* **Giai đoạn 1: Thử nghiệm (Tháng 1–3):** Chạy thử nghiệm kín với 20 nhà bán hàng SME (100–300 đơn/ngày), kết nối Shopee $\rightarrow$ KiotViet $\rightarrow$ GHTK. KPI: Lỗi $< 1\%$, Latency $< 1\text{s}$, 15/20 shop duy trì sau 4 tuần.
* **Giai đoạn 2: Ra mắt (Tháng 4–7):** Hoàn tất Public App trên TikTok Shop Partner Center & Shopee Open Platform; tích hợp Sapo, GHN; mở bán SaaS. KPI: 500 Active Users trả phí, MRR 150 triệu VNĐ, Uptime $> 99.9\%$.
* **Giai đoạn 3: Mở rộng (Tháng 8–12+):** Tích hợp MISA, Viettel Post; kích hoạt toàn diện các tầng AI nâng cao; mở rộng Enterprise Connector. KPI: 2.000 SME & 10 Enterprise, Churn rate $< 5\%$, tự động hóa 1.000.000 đơn/tháng.

### **2. Chiến lược GTM 4 Pha**
* **Pha 1 (09–12/2026) - Beta & Validation:** Founder-led Sales tiếp cận 20 shop qua cộng đồng seller để kiểm chứng pain point.
* **Pha 2 (01–03/2027) - Commercial Readiness:** Case-study-led Marketing truyền thông kết quả giảm giờ làm, giảm lỗi để bán trực tiếp.
* **Pha 3 (04–06/2027) - Official Launch:** B2B2B qua E-commerce Agency/Enabler đóng gói UniFlow AI vào dịch vụ vận hành.
* **Pha 4 (07–12/2027) - Scale:** Partner Channel liên kết POS/ERP, Logistics tổ chức webinar và khai thác chéo khách hàng.

---

## **PHẦN VII: NGUỒN LỰC ĐỘI NGŨ & MẠNG LƯỚI THỰC THI**

### **1. Nhân sự sáng lập**
* **Nguyễn Thị Kim (Nhóm Kinh tế & Kinh doanh):** Nghiên cứu thị trường, tiếp cận khách hàng, thiết kế mô hình giá và thuyết phục người dùng Pilot.
* **Đoàn Thanh Nga (Nhóm Kinh tế & Kinh doanh):** Quản trị tiến độ dự án, xây dựng mô hình doanh thu – chi phí, thiết lập KPI, điều phối Pilot và tổng hợp phản hồi.
* **3 Thành viên Nhóm CNTT:** Backend & Integration (Server, Queue, API), AI & Automation (NLP Matching, Error-Healing), Frontend & UI/UX (Integration Hub, React Flow Canvas).

### **2. Mạng lưới hỗ trợ & Pilot**
* Cố vấn từ Nhà trường và Giảng viên chuyên môn.
* **Đã có hộ kinh doanh đồng ý tham gia thử nghiệm thực tế** trên dòng đơn hàng thật để hoàn thiện sản phẩm.
