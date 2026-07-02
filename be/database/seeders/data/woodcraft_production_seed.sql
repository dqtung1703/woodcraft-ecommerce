-- ============================================================
-- Woodcraft E-Commerce — Production Seed Data
-- Trích xuất từ woodcraft_ecommerce.sql (chỉ giữ INSERT data)
-- Cấu trúc bảng do Laravel Migration quản lý riêng
-- ============================================================

-- 1. Categories (14 danh mục)
INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1,'Bút khảm','Các mẫu bút ký được trang trí bằng kỹ thuật khảm trai, khảm ốc hoặc xà cừ. Sản phẩm có tính thẩm mỹ cao, phù hợp làm quà tặng doanh nhân, quà lưu niệm và sử dụng trong văn phòng.','2026-06-09 02:03:25','2026-06-09 02:06:27'),
(2,'Đĩa gỗ','Các mẫu đĩa trang trí được chế tác từ gỗ tự nhiên, bề mặt khảm trai hoặc xà cừ với nhiều chủ đề truyền thống, phong cảnh và phong thủy. Sản phẩm thường được trưng bày trên kệ, tủ hoặc dùng làm quà tặng.','2026-06-09 02:03:50','2026-06-09 02:06:34'),
(3,'Hộp đựng trang sức','Hộp gỗ dùng để bảo quản trang sức và vật dụng nhỏ, được trang trí bằng họa tiết khảm trai, khảm ốc hoặc chạm khắc thủ công. Sản phẩm vừa tiện dụng vừa có giá trị trang trí.','2026-06-09 02:04:06','2026-06-09 02:06:40'),
(4,'Hộp gỗ đựng giấy ăn','Hộp đựng giấy ăn bằng gỗ tự nhiên, được khảm trai, khảm ốc hoặc chạm hoa văn truyền thống. Sản phẩm giúp không gian bàn ăn, phòng khách và phòng làm việc trở nên sang trọng hơn.','2026-06-09 02:04:19','2026-06-09 02:06:47'),
(5,'Hộp khảm trai','Nhóm các loại hộp gỗ thủ công như hộp mứt, hộp quà, hộp đựng vật dụng và hộp trang trí. Bề mặt sản phẩm được khảm trai hoặc xà cừ với hoa văn truyền thống, phù hợp sử dụng trong gia đình và làm quà tặng.','2026-06-09 02:04:42','2026-06-09 02:04:42'),
(6,'Khay khảm','Các loại khay gỗ dùng để bày trà, bánh, đồ tiếp khách hoặc vật phẩm trang trí. Sản phẩm được khảm trai, khảm ốc hoặc xà cừ với hoa văn tinh xảo, tạo điểm nhấn cho không gian sử dụng.','2026-06-09 02:04:59','2026-06-09 02:07:17'),
(7,'Lọ lục bình','Các mẫu lọ và lục bình bằng gỗ được tiện tạo dáng, sau đó trang trí bằng kỹ thuật khảm trai hoặc khảm ốc. Sản phẩm thường được trưng bày theo cặp tại phòng khách, phòng thờ hoặc không gian nội thất truyền thống.','2026-06-09 02:05:18','2026-06-09 02:07:33'),
(8,'Lọ trà','Lọ gỗ có nắp dùng để bảo quản chè, trà khô và các loại thảo mộc. Bề mặt được khảm trai hoặc xà cừ với họa tiết truyền thống, vừa giữ công năng bảo quản vừa tăng giá trị thẩm mỹ.','2026-06-09 02:05:35','2026-06-09 02:43:45'),
(9,'Quà tặng khảm trai','Các sản phẩm thủ công khảm trai được lựa chọn và đóng gói thành quà tặng, phù hợp dành cho đối tác, khách hàng, người thân hoặc các dịp lễ, khai trương và kỷ niệm.','2026-06-09 02:05:48','2026-06-09 02:05:48'),
(10,'Sập gụ','Các mẫu sập gụ bằng gỗ tự nhiên có kích thước lớn, được chạm khắc và khảm trai hoặc khảm ốc công phu. Sản phẩm mang phong cách nội thất truyền thống, thường sử dụng trong phòng khách hoặc không gian nhà cổ.','2026-06-09 02:06:20','2026-06-09 02:06:20'),
(11,'Tranh chữ khảm','Các bức tranh chữ thư pháp như Phúc, Lộc, Thọ, Tâm hoặc Đức được thể hiện bằng kỹ thuật khảm trai, khảm ốc trên nền gỗ. Sản phẩm mang ý nghĩa phong thủy và thường được dùng làm quà tặng, tranh treo phòng khách hoặc phòng thờ.','2026-06-09 02:07:52','2026-06-09 02:08:04'),
(12,'Tranh khảm','Nhóm tranh nghệ thuật được chế tác trên nền gỗ và trang trí bằng vỏ trai, vỏ ốc hoặc xà cừ. Chủ đề đa dạng gồm phong cảnh, lịch sử, nhân vật, chim hoa và biểu tượng phong thủy, phù hợp trang trí nhiều không gian.','2026-06-09 02:08:17','2026-06-09 02:08:29'),
(13,'Đốc lịch','Sản phẩm treo tường kết hợp phần tranh gỗ khảm trai với vị trí gắn lịch. Đốc lịch thường mang các chủ đề chúc phúc, phong thủy và văn hóa truyền thống, phù hợp làm quà Tết hoặc trang trí gia đình.','2026-06-09 02:08:47','2026-06-09 02:08:47'),
(14,'Tủ chè','Tủ chè khảm ốc thủ công, kích thước lớn','2026-06-09 03:00:15','2026-06-09 03:00:15');

-- 2. Users (14 tài khoản — mật khẩu đều là "password")
INSERT INTO `users` (`id`, `name`, `email`, `google_id`, `avatar`, `auth_provider`, `google_linked_at`, `email_verified_at`, `password_hash`, `role`, `phone`, `address`, `is_active`, `created_at`, `updated_at`) VALUES
(1,'ADMIN','admin@dogokhamtrai.vn',NULL,NULL,'email',NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','admin','0911111148','Số 2 Đường Thanh Niên',1,'2026-05-27 07:59:10','2026-06-01 00:31:27'),
(2,'Nguyễn Văn Tuấn','tuan.nv@gmail.com',NULL,NULL,'email',NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','customer','0912345678','45 Hoàng Mai, Hai Bà Trưng, Hà Nội',1,'2024-02-05 01:00:00','2024-02-05 01:00:00'),
(3,'Trần Thị Thuỷ','thuy.tt@gmail.com',NULL,NULL,'email',NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','customer','0987654321','12 Tôn Đức Thắng, Đống Đa, Hà Nội',1,'2024-02-10 01:00:00','2024-02-10 01:00:00'),
(4,'Lê Quang Hoàn','hoan.lq@gmail.com',NULL,NULL,'email',NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','customer','0934567890','Phố Cốc Lếu, TP Lào Cai, tỉnh Lào Cai',1,'2024-02-15 01:00:00','2024-02-15 01:00:00'),
(5,'Phạm Minh Xuân','xuan.pm@gmail.com',NULL,NULL,'email',NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','customer','0908765432','88 Trần Hữu Tước, Cầu Giấy, Hà Nội',1,'2024-02-18 01:00:00','2024-02-18 01:00:00'),
(6,'Đinh Văn Nam','nam.dv@gmail.com',NULL,NULL,'email',NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','customer','0945678901','Thị trấn Bần Yên Nhân, Mỹ Hào, Hưng Yên',1,'2024-03-01 01:00:00','2024-03-01 01:00:00'),
(7,'Bùi Thị Hà','ha.bt@gmail.com',NULL,NULL,'email',NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','customer','0978901234','Ngọc Hồi, Thanh Trì, Hà Nội',1,'2024-03-05 01:00:00','2024-03-05 01:00:00'),
(8,'Vũ Hữu Tuyên','tuyen.vh@gmail.com',NULL,NULL,'email',NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','customer','0901234567','Thị trấn Vĩnh Bảo, huyện Vĩnh Bảo, Hải Phòng',1,'2024-03-10 01:00:00','2024-03-10 01:00:00'),
(9,'Đoàn Thị An','an.dt@gmail.com',NULL,NULL,'email',NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','customer','0965432109','Phường 1, TP Mỹ Tho, Tiền Giang',1,'2024-03-15 01:00:00','2024-03-15 01:00:00'),
(10,'Nguyễn Văn Tiếp','tiep.nv@gmail.com',NULL,NULL,'email',NULL,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','customer','0923456789','Thị trấn Trạm Trôi, Hoài Đức, Hà Nội',1,'2024-03-20 01:00:00','2024-03-20 01:00:00'),
(11,'Đỗ Quang Tùng','doquangtung19@gmail.com','100783895798495003801','https://lh3.googleusercontent.com/a/ACg8ocJSZdS7QbQqMPPX25bcTISdSdN87c_6j2-k2hasiK2AzB5L5w=s96-c','google','2026-05-29 00:47:44','2026-05-29 00:47:44',NULL,'customer','0911111148','Số 2 Đường Thanh Niên',1,'2026-05-29 00:47:44','2026-05-29 00:48:57'),
(12,'Tùng Đỗ Quang','c2310gh.dqtung@aptech.vn',NULL,NULL,'email',NULL,NULL,'$2y$12$IM4RCf2Wsd47uB7lmOwasOTU29Lv5VZubf0luzAhV1v8T0wkfbh2a','customer','0911112148',NULL,1,'2026-06-10 01:53:13','2026-06-10 01:53:13'),
(13,'Vũ Hải Nam','vuhainam10a1@gmail.com',NULL,NULL,'email',NULL,NULL,'$2y$12$OaSLY7xhRqeSOrXzYG9XkuivM1US.DZLPPFrhcRmZGqmVeBsxulOu','customer','0983866886',NULL,1,'2026-06-10 02:26:54','2026-06-10 02:26:54'),
(14,'Hiu Dang Van','dangvanhiu1994@gmail.com',NULL,NULL,'email',NULL,NULL,'$2y$12$oAdZPDuHkZ5qOjYEu2fbLuY6GUKXIpEEGxPpn3fApH2WrARWr5.yC','customer','0912345678',NULL,1,'2026-06-13 07:10:13','2026-06-13 07:10:13');

-- 3. Products (26 sản phẩm)
INSERT INTO `products` (`id`, `name`, `description`, `original_price`, `cost_price`, `price`, `stock`, `sold_count`, `material`, `category_id`, `created_at`, `updated_at`) VALUES
(1,'Bút ký khảm trai kèm hộp gỗ hoa văn tứ quý','Mẫu bút ký thanh lịch đặt trong hộp gỗ thủ công, bề mặt trang trí hoa lá khảm xà cừ. Sản phẩm thích hợp làm quà tặng cá nhân, quà tri ân hoặc quà tặng sự kiện.',300000.00,50000.00,219000.00,100,0,'Bút khảm vỏ trai/xà cừ, khoen kim loại mạ vàng; hộp gỗ tự nhiên lót nhung đỏ, mặt hộp khảm trai',1,'2026-06-09 02:16:25','2026-06-09 02:18:21'),
(2,'Bộ bút ký khảm trai kèm ống cắm bút','Bộ bút ký thủ công nổi bật với sắc xà cừ óng ánh, đi kèm ống cắm bút trang trí họa tiết sơn thủy. Phù hợp đặt tại bàn làm việc, làm quà tặng doanh nhân, đối tác hoặc quà lưu niệm cao cấp.',699000.00,200000.00,499000.00,100,0,'Thân bút khảm vỏ trai/xà cừ, chi tiết kim loại mạ màu vàng; ống cắm bút cốt gỗ sơn đen khảm trai',1,'2026-06-09 02:17:33','2026-06-09 02:17:33'),
(3,'Đĩa Gỗ Khảm Ốc "Khuê Văn Các" – Biểu Tượng Di Sản & Nghệ Thuật Tinh Xảo','Giao thoa giữa bề dày lịch sử và tư duy thẩm mỹ đương đại, Đĩa Gỗ Khảm Ốc "Khuê Văn Các" không chỉ là một vật phẩm trang trí, mà còn là một tác phẩm nghệ thuật mang đậm hồn cốt Việt.',20000000.00,8000000.00,14999000.00,10,0,'Được làm từ gỗ mun, khảm ốc và xà cừ',2,'2026-06-09 02:23:37','2026-06-09 02:23:37'),
(4,'Đĩa Gỗ Khảm Ốc "Tùng Lộc Trường Tồn" – Kiệt Tác Của Sự Thịnh Vượng','Tác phẩm "Tùng Lộc Trường Tồn" là một bản hòa ca tuyệt đẹp giữa vẻ đẹp thiên nhiên và kỹ nghệ chế tác đỉnh cao.',18500000.00,6500000.00,14650000.00,10,0,'Đĩa được làm từ gỗ trắc, khảm ốc đỏ và xà cừ',2,'2026-06-09 02:26:21','2026-06-09 02:26:21'),
(5,'Đĩa Gỗ Khảm Ốc "Bát Tiên Tụ Hội"','Mang trong mình tinh hoa của nghệ thuật khảm xà cừ, tác phẩm "Bát Tiên Tụ Hội" là một minh chứng hoàn hảo cho sự trường tồn của thẩm mỹ truyền thống.',15000000.00,6000000.00,12690000.00,10,0,'Gỗ Hương, Khảm ốc Xanh, đỏ Singapore',2,'2026-06-09 02:29:34','2026-06-09 02:29:34'),
(6,'Đĩa Gỗ Khảm Ốc "Thuận Buồm Xuôi Gió" – Khát Vọng Vương Tầm','Biểu tượng kinh điển của sự hanh thông và ý chí kiên cường nay được tái hiện đầy kiêu hãnh trên tác phẩm Đĩa Gỗ Khảm Ốc "Thuận Buồm Xuôi Gió".',16999000.00,6400000.00,1300000.00,10,0,'Đĩa gỗ mun, khảm ốc đỏ',2,'2026-06-09 02:32:41','2026-06-09 02:32:41'),
(7,'Đĩa Gỗ Khảm Ốc "Trúc Lâm Thất Hiền"','Mang cả một trời điển tích lịch sử và triết lý sống an nhiên vào không gian nội thất đương đại, tác phẩm "Trúc Lâm Thất Hiền" là hiện thân của sự thanh tao và trí tuệ đỉnh cao.',12000000.00,4000000.00,6500000.00,10,0,'Đĩa gỗ mun, khảm ốc xanh, cửu khổng',2,'2026-06-09 02:33:43','2026-06-09 02:33:43'),
(8,'Đĩa Gỗ Khảm Ốc "Cửu Ngư Quần Hội" – Khơi Nguồn Vượng Khí','Sống động, rực rỡ và ngập tràn năng lượng tích cực là những gì tác phẩm "Cửu Ngư Quần Hội" mang lại.',11500000.00,3500000.00,7600000.00,20,0,'Đĩa gỗ mun, khảm cửu khổng, xà cừ, ốc xanh',2,'2026-06-09 02:35:38','2026-06-09 02:35:38'),
(9,'Hộp Gỗ Đựng Đồ Cá Nhân "Mộc Tâm"','Đơn giản trong đường nét nhưng quyền lực trong công năng, Hộp Gỗ Cá Nhân "Mộc Tâm" là món phụ kiện tối ưu để lưu trữ những tạo tác giá trị nhất của bạn.',2500000.00,600000.00,2000000.00,50,0,'Gỗ hương',3,'2026-06-09 02:37:54','2026-06-09 02:37:54'),
(10,'Hộp Khăn Giấy Chạm Khắc "Mộc Hoa"','Biến những vật dụng quen thuộc hàng ngày thành một tác phẩm nghệ thuật thu nhỏ, Bộ sưu tập Hộp khăn giấy "Mộc Hoa" mang đến nét chấm phá thanh lịch cho bàn trà phòng khách.',300000.00,100000.00,239000.00,100,0,'Gỗ mun',4,'2026-06-09 02:38:59','2026-06-09 02:38:59'),
(11,'Khay Mứt Tết Khảm Ốc Bát Giác "Bình An Viên Mãn"','Đỉnh cao của nghệ thuật tiếp khách ngày Xuân được gói trọn trong Khay Mứt Tết Bát Giác Khảm Ốc.',3500000.00,1000000.00,2500000.00,10,0,'Gỗ mun, khảm ốc xanh, cửu khổng',5,'2026-06-09 02:40:07','2026-06-09 02:40:07'),
(12,'Khay Trà Gỗ Khảm Ốc Chân Quỳ "Sơn Thủy Hữu Tình"','Là biểu tượng cho nghệ thuật thưởng trà cao cấp, Khay Trà Chân Quỳ "Sơn Thủy Hữu Tình" kết hợp hoàn hảo giữa kiểu dáng quý phái xưa và tinh thần tối giản nay.',15000000.00,6000000.00,11900000.00,10,0,'Gỗ Hương, Khảm ốc đỏ, ốc xanh',6,'2026-06-09 02:41:57','2026-06-09 02:41:57'),
(13,'Cặp Lọ Hoa Gỗ Khảm Ốc "Mai Điểu Triều Dương"','Sở hữu dáng hình uyển chuyển cùng sắc độ tương phản đỉnh cao, Cặp Lọ Hoa Gỗ "Mai Điểu Triều Dương" là điểm nhấn đối xứng đầy quyền lực cho các không gian nội thất cao cấp.',23900000.00,12000000.00,17600000.00,10,0,'Gỗ trắc, khảm ốc xanh, cửu khổng',7,'2026-06-09 02:43:11','2026-06-09 02:43:11'),
(14,'Ống Đựng Trà Gỗ Khảm Ốc "Tiều Phu Quy Ẩn"','Nằm trong bộ sưu tập phụ kiện bàn trà xa xỉ, bộ đôi ống đựng trà bằng gỗ tự nhiên là lời khẳng định về một phong cách sống duy mỹ.',3000000.00,1200000.00,2200000.00,20,0,'Gỗ hương, Khảm ốc đỏ',8,'2026-06-09 02:44:58','2026-06-09 02:47:01'),
(15,'Ống Đựng Trà Gỗ Khảm Ốc "Mộc Trà"','Nằm trong bộ sưu tập phụ kiện bàn trà xa xỉ, bộ đôi ống đựng trà bằng gỗ tự nhiên là lời khẳng định về một phong cách sống duy mỹ.',3500000.00,1300000.00,2300000.00,20,0,'Gỗ hương, khảm ốc đỏ',8,'2026-06-09 02:46:43','2026-06-09 02:46:43'),
(16,'Hộp Quà Tặng Quý Ông "Vanguard" Khảm Xà Cừ – Khí Chất Độc Bản','Định nghĩa lại nghệ thuật quà tặng doanh nghiệp cao cấp, Giftset "Vanguard" là sự kết hợp hoàn mỹ giữa thời trang quý ông hiện đại và kỹ nghệ khảm xà cừ đỉnh cao.',1500000.00,450000.00,1190000.00,100,0,'Khảm xà cừ',9,'2026-06-09 02:50:15','2026-06-09 02:50:15'),
(17,'Sập Thờ Gỗ Khảm Ốc Toàn Bích "Vạn Đại Trường Tồn"','Là kiệt tác có quy mô bề thế nhất trong bộ sưu tập di sản, Sập Thờ Khảm Ốc Toàn Bích là sự kết tinh của hàng trăm giờ lao động nghiêm túc.',99000000.00,45000000.00,79000000.00,3,0,'Gỗ Trắc, Khảm ốc đỏ Singapore',10,'2026-06-09 02:51:37','2026-06-09 02:51:37'),
(18,'Tranh Gỗ Khảm Ốc "Chữ Phúc Hóa Long"','Vượt lên trên những bức tranh chữ thông thường, tác phẩm "Chữ Phúc Hóa Long" là một cuộc chơi nghệ thuật tạo hình đầy sáng tạo.',9500000.00,3500000.00,6800000.00,20,0,'Gỗ mun, Khảm ốc đỏ',11,'2026-06-09 02:52:40','2026-06-09 02:52:40'),
(19,'Tranh ngang Khảm Ốc "Bách Hạc Trường Xuân"','Tái hiện bức tranh phong cảnh kinh điển về sự trường thọ và an khang, đại tranh "Bách Hạc Trường Xuân" dáng trường cuốn mang lại một không gian khoáng đạt, tĩnh tại.',20000000.00,6500000.00,15000000.00,10,0,'Gỗ Hương, Khảm ốc xanh',12,'2026-06-09 02:53:46','2026-06-09 02:53:46'),
(20,'Tranh ngang Khảm Ốc "Vinh Quy Bái Tổ"','Mang ý nghĩa nhân văn sâu sắc về truyền thống "Uống nước nhớ nguồn", đại tranh "Vinh Quy Bái Tổ" dạng trường cuốn là bức họa kể về hành trình vinh hiển.',21000000.00,10000000.00,17000000.00,10,0,'Gỗ Hương, Khảm ốc đỏ, ốc xanh',12,'2026-06-09 02:55:05','2026-06-09 02:55:05'),
(21,'Tranh Gỗ Khảm Ốc "Chùa Một Cột"','Được ví như đóa sen tinh khiết vươn lên từ mặt nước, biểu tượng kiến trúc ngàn năm tuổi của Thăng Long – Hà Nội nay được tái hiện đầy thoát tục.',9000000.00,4500000.00,6500000.00,12,0,'Gỗ Hương, Khảm ốc đỏ',12,'2026-06-09 02:57:16','2026-06-09 02:57:16'),
(22,'Tranh Gỗ Khảm Ốc "Thuận Buồm Xuôi Gió"','Vẫn giữ trọn vẹn thông điệp về sự hanh thông và vượng khí, phiên bản Tranh Khung Vuông "Thuận Buồm Xuôi Gió" mang đến một cảm giác vững chãi, quy chuẩn.',10000000.00,4500000.00,8000000.00,20,0,'Gỗ Hương, Khảm ốc Đỏ',12,'2026-06-09 02:58:07','2026-06-09 02:58:07'),
(23,'Tranh Treo Lịch Gỗ Khảm Ốc "Bát Tiên Quần Hội"','Nâng tầm chiếc block lịch quen thuộc ngày Tết thành một tác phẩm nghệ thuật gia bảo truyền đời.',5000000.00,1500000.00,3000000.00,50,0,'Gỗ trắc, Khảm ốc đỏ',13,'2026-06-09 02:59:13','2026-06-09 02:59:13'),
(24,'Tủ Chè Gỗ Gụ Khảm Trai "Đại Cảnh Liên Hoàn"','Là một trong những tạo tác quy mô và đòi hỏi kỹ nghệ khắt khe nhất, chiếc Tủ Chè Khảm Trai Toàn Bích là món nội thất tuyên ngôn cho sự giàu sang.',45000000.00,25000000.00,37000000.00,5,0,'Gỗ Trắc, Khảm ốc đỏ',14,'2026-06-09 03:01:10','2026-06-09 03:01:10'),
(25,'Bộ Tranh Tứ Quý "Tứ Dân Đại Ẩn"','Khác biệt với những bộ tranh phong cảnh thông thường, Bộ tranh "Tứ Dân" mang tính triết lý sâu sắc, khắc họa lối sống an nhiên, tự tại của người quân tử.',25000000.00,12000000.00,21000000.00,10,0,'Gỗ Hương, Khảm ốc đỏ',12,'2026-06-09 03:02:24','2026-06-09 03:02:24'),
(26,'Bộ Tranh Tứ Quý "Tùng Cúc Trúc Mai"','Là bộ tranh phong thủy kinh điển đại diện cho bốn mùa Xuân – Hạ – Thu – Đông, "Tùng Cúc Trúc Mai" là biểu tượng của sự luân chuyển may mắn.',21000000.00,11000000.00,17000000.00,10,0,'Gỗ Hương, Khảm ốc đỏ',12,'2026-06-09 03:03:10','2026-06-09 03:03:10');

-- 4. Product Images (26 ảnh — trỏ về localhost:8000/storage)
INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `created_at`) VALUES
(1,1,'http://localhost:8000/storage/products/Iw1Qt8kLKl04SgTod7NZ3Vm8hXGuW0yb5jFm5WNH.jpg','2026-06-09 02:16:26'),
(2,2,'http://localhost:8000/storage/products/WVxY5QC0flBMVqDM3aH2IoU5aNZPP2usQeVlMgFQ.png','2026-06-09 02:17:33'),
(3,3,'http://localhost:8000/storage/products/9wv8IhUBYFPBXYbSq8hLuACEnkjH4XVJjbBpTPHk.png','2026-06-09 02:23:37'),
(4,4,'http://localhost:8000/storage/products/NzHs1yOt4TbZ1hn47cqucRiVdoncVRcJRu7c82zK.png','2026-06-09 02:26:21'),
(5,5,'http://localhost:8000/storage/products/d8suD8tzeEwh66Vz2bzNjaYJXGpiDJzsSbcC5cxN.png','2026-06-09 02:29:34'),
(6,6,'http://localhost:8000/storage/products/a2u05SHe3bccRAW0QxeBUkXJoI5M3Jr8x2TLKqy0.png','2026-06-09 02:32:41'),
(7,7,'http://localhost:8000/storage/products/dJd9KNznaGdxHF3o6zxYldHTzD4tChC9kEmeole0.png','2026-06-09 02:33:43'),
(8,8,'http://localhost:8000/storage/products/u4LB2rxilOZ5iCQwJ8fdqFvo1BX816CmmZN1bZQv.png','2026-06-09 02:35:38'),
(9,9,'http://localhost:8000/storage/products/zuFTpY4mpmtbQOA1Dsi7h6DPxnVx79rX9ID6BiV3.png','2026-06-09 02:37:54'),
(10,10,'http://localhost:8000/storage/products/b5VNmnMXQzfqp2PO6dkX5XM6UOlwBy8KPzxkd0eE.png','2026-06-09 02:38:59'),
(11,11,'http://localhost:8000/storage/products/dfpyUP4jQ5PKiXiGzdGFuen88w87Ixi4HZ7PPJKC.png','2026-06-09 02:40:07'),
(12,12,'http://localhost:8000/storage/products/Wc7tW24VPJ5TzlBxVPVr71r2iqHtIw6j8TlCxiv2.png','2026-06-09 02:41:57'),
(13,13,'http://localhost:8000/storage/products/W6NzkOhuOYOHn0sYQkgTCmyrldUbk2vcdnvfzf0g.png','2026-06-09 02:43:11'),
(14,14,'http://localhost:8000/storage/products/LoZMfC2b2hDNMb2z9A7ExswVMfgxzSACXdT6xJNi.png','2026-06-09 02:44:58'),
(15,15,'http://localhost:8000/storage/products/tgQiCr5TInNRpcR8P8bNwxjYdAQjRxTxLXrMeZBm.png','2026-06-09 02:46:43'),
(16,16,'http://localhost:8000/storage/products/l54nlRQ1qlsPsyQYcWg3nUEd2BWAlafRKOgHpZl8.png','2026-06-09 02:50:15'),
(17,17,'http://localhost:8000/storage/products/348yCe2b5T3jBAPNeTzb29CUDiGHKhJn7HelUc0H.png','2026-06-09 02:51:37'),
(18,18,'http://localhost:8000/storage/products/6OoOv68s7O6VV9cUXhIwY1ZFzowQgrdaKtginEKm.png','2026-06-09 02:52:40'),
(19,19,'http://localhost:8000/storage/products/WZpLElwMC21qGZJZumwz6MBx0hZbHoCm9CGH1m5w.png','2026-06-09 02:53:46'),
(20,20,'http://localhost:8000/storage/products/37byue3WUqut8z9l252PhpvI2jGjIJS0UJ1wOjFr.png','2026-06-09 02:55:05'),
(21,21,'http://localhost:8000/storage/products/K6UTadkWva16jOHNRFKHzv5GY7Y4vSnKFB1l9ZxI.png','2026-06-09 02:57:16'),
(22,22,'http://localhost:8000/storage/products/zR6lT76UBrnvE29qhW1kNnYmreB6dtPSqAvl9n3O.png','2026-06-09 02:58:07'),
(23,23,'http://localhost:8000/storage/products/tlVxRiyhpk7MQu5WxaJnsqyXptXPulrBK0JsPW8J.png','2026-06-09 02:59:13'),
(24,24,'http://localhost:8000/storage/products/ARGEBXYWCbUwh0yIeKyjJ5uJSIBZXGjmnyLCvD0P.png','2026-06-09 03:01:10'),
(25,25,'http://localhost:8000/storage/products/QpVy4UOQbyAma5WFzaVAMLCftFgCfOe0Q1w9j0lc.png','2026-06-09 03:02:24'),
(26,26,'http://localhost:8000/storage/products/EByQWxobwSyO9US82bZjAKMpF6a2wEvG7J4r1630.png','2026-06-09 03:03:10');

-- 5. Vouchers (6 mã giảm giá)
INSERT INTO `vouchers` (`id`, `code`, `discount_type`, `discount_value`, `min_order_value`, `max_discount`, `quantity`, `used_count`, `per_user_limit`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1,'KHAMSALE10','percent',10.00,5000000.00,2000000.00,100,23,1,'2025-01-01 00:00:00','2025-12-31 23:59:59','active','2026-05-27 07:59:10','2026-05-27 07:59:10'),
(2,'TETCHUYEN30','percent',30.00,10000000.00,5000000.00,50,8,1,'2025-01-15 00:00:00','2025-02-15 23:59:59','inactive','2026-05-27 07:59:10','2026-05-27 07:59:10'),
(3,'TANGQUA500','fixed',500000.00,3000000.00,500000.00,200,55,1,'2025-01-01 00:00:00','2025-12-31 23:59:59','active','2026-05-27 07:59:10','2026-05-27 07:59:10'),
(4,'VIPKHAM20','percent',20.00,50000000.00,15000000.00,20,3,1,'2025-01-01 00:00:00','2025-12-31 23:59:59','active','2026-05-27 07:59:10','2026-05-27 07:59:10'),
(5,'KHAITHANG15','percent',15.00,8000000.00,3000000.00,80,12,1,'2025-05-01 00:00:00','2025-05-31 23:59:59','active','2026-05-27 07:59:10','2026-05-27 07:59:10'),
(6,'CUOIHOI10','percent',10.00,3000000.00,1500000.00,150,40,1,'2025-01-01 00:00:00','2025-12-31 23:59:59','active','2026-05-27 07:59:10','2026-05-27 07:59:10');

-- 6. Orders (26 đơn hàng — bỏ id 15, 17, 20 vì không tồn tại)
INSERT INTO `orders` (`id`, `user_id`, `total_price`, `discount_amount`, `final_price`, `voucher_id`, `status`, `note`, `shipping_name`, `shipping_phone`, `shipping_address`, `created_at`, `updated_at`) VALUES
(1,2,3500000.00,350000.00,3150000.00,1,'delivered',NULL,'','',NULL,'2025-02-10 03:30:00','2025-02-12 08:00:00'),
(2,3,19000000.00,1000000.00,18000000.00,3,'delivered',NULL,'','',NULL,'2025-02-14 02:00:00','2025-02-17 03:00:00'),
(3,4,40000000.00,8000000.00,32000000.00,4,'delivered',NULL,'','',NULL,'2025-02-20 07:00:00','2025-02-25 09:00:00'),
(4,5,4000000.00,400000.00,3600000.00,1,'delivered',NULL,'','',NULL,'2025-03-05 04:00:00','2025-03-07 02:00:00'),
(5,6,14700000.00,500000.00,14200000.00,3,'delivered',NULL,'','',NULL,'2025-03-10 09:00:00','2025-03-13 07:00:00'),
(6,7,9000000.00,0.00,9000000.00,NULL,'delivered',NULL,'','',NULL,'2025-03-15 01:30:00','2025-03-18 03:00:00'),
(7,8,45000000.00,5000000.00,40000000.00,2,'delivered',NULL,'','',NULL,'2025-03-20 06:00:00','2025-03-26 04:00:00'),
(8,9,3800000.00,380000.00,3420000.00,1,'delivered',NULL,'','',NULL,'2025-04-01 03:00:00','2025-04-03 07:00:00'),
(9,10,25000000.00,5000000.00,20000000.00,4,'delivered',NULL,'','',NULL,'2025-04-20 02:00:00','2026-06-01 00:51:03'),
(10,2,5000000.00,500000.00,4500000.00,1,'delivered',NULL,'','',NULL,'2025-04-25 04:00:00','2026-06-01 00:51:19'),
(11,3,13500000.00,2025000.00,11475000.00,5,'delivered',NULL,'','',NULL,'2025-04-28 07:00:00','2025-05-01 03:00:00'),
(12,7,7200000.00,0.00,7200000.00,NULL,'delivered',NULL,'','',NULL,'2025-05-01 02:00:00','2026-06-01 00:48:59'),
(13,1,75000000.00,0.00,75000000.00,NULL,'cancelled',NULL,'Đỗ Quang Tùng','0911111148','Số 2 Đường Thanh Niên','2026-05-27 01:08:20','2026-05-27 01:08:42'),
(14,1,180000000.00,0.00,180000000.00,NULL,'cancelled',NULL,'Đỗ Quang Tùng','0911111148','Số 2 Đường Thanh Niên','2026-05-27 01:08:58','2026-05-27 01:13:10'),
(16,1,180000000.00,0.00,180000000.00,NULL,'cancelled',NULL,'Đỗ Quang Tùng','0911111148','Số 2 Đường Thanh Niên','2026-05-27 01:13:17','2026-05-27 01:29:08'),
(18,1,120000000.00,0.00,120000000.00,NULL,'cancelled',NULL,'Đỗ Quang Tùng','0911111148','Số 2 Đường Thanh Niên','2026-05-27 01:24:13','2026-05-27 01:24:24'),
(19,1,120000000.00,0.00,120000000.00,NULL,'cancelled',NULL,'Đỗ Quang Tùng','0911111148','Số 2 Đường Thanh Niên','2026-05-27 01:24:36','2026-05-27 01:35:16'),
(21,1,17000000.00,0.00,17000000.00,NULL,'delivered',NULL,'Đỗ Quang Tùng','0911111148','Số 2 Đường Thanh Niên','2026-05-27 01:33:28','2026-06-10 03:30:05'),
(22,1,32000000.00,0.00,32000000.00,NULL,'cancelled',NULL,'Đỗ Quang Tùng','0911111148','Số 2 Đường Thanh Niên','2026-05-27 01:38:26','2026-05-27 01:38:35'),
(23,1,500000.00,0.00,500000.00,NULL,'delivered',NULL,'Đỗ Quang Tùng','0911111148','Số 2 Đường Thanh Niên','2026-05-27 01:38:50','2026-06-01 00:48:37'),
(24,11,75000000.00,0.00,75000000.00,NULL,'delivered',NULL,'Đỗ Quang Tùng','0911111148','Số 2 Đường Thanh Niên','2026-05-29 00:49:04','2026-06-10 03:29:52'),
(25,11,75000000.00,0.00,75000000.00,NULL,'delivered',NULL,'Đỗ Quang Tùng','0911111148','Số 2 Đường Thanh Niên','2026-05-30 20:53:49','2026-06-01 00:47:12'),
(26,1,170000000.00,0.00,170000000.00,NULL,'delivered',NULL,'ADMIN','0911111148','Số 2 Đường Thanh Niên','2026-06-01 01:21:43','2026-06-01 01:23:22');

-- 7. Order Items (chỉ giữ các item thuộc order_id còn tồn tại)
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `price`, `quantity`) VALUES
(1,1,1,3500000.00,1),
(2,2,15,19000000.00,1),
(3,3,13,25000000.00,1),
(4,3,19,15000000.00,1),
(5,4,5,4000000.00,1),
(6,5,7,9000000.00,1),
(9,6,4,9000000.00,1),
(10,7,5,45000000.00,1),
(11,8,8,3800000.00,1),
(12,9,9,25000000.00,1),
(13,10,19,5000000.00,1),
(14,11,7,13500000.00,1),
(15,12,21,7200000.00,1),
(16,13,17,75000000.00,1),
(17,14,17,180000000.00,1),
(18,16,17,180000000.00,1),
(19,18,17,120000000.00,1),
(20,19,17,120000000.00,1),
(21,21,20,17000000.00,1),
(22,22,25,32000000.00,1),
(23,23,16,500000.00,1),
(24,24,17,75000000.00,1),
(25,25,17,75000000.00,1),
(26,26,26,170000000.00,1);

-- 8. Payments (chỉ giữ các payment thuộc order còn tồn tại)
INSERT INTO `payments` (`id`, `order_id`, `payment_method`, `payment_status`, `amount`, `transaction_id`, `gateway_transaction_id`, `gateway_response`, `paid_at`, `expired_at`, `created_at`, `updated_at`) VALUES
(1,1,'banking','paid',0.00,NULL,NULL,NULL,'2025-02-10 10:45:00',NULL,NULL,NULL),
(2,2,'cod','paid',0.00,NULL,NULL,NULL,'2025-02-17 10:00:00',NULL,NULL,NULL),
(3,3,'banking','paid',0.00,NULL,NULL,NULL,'2025-02-20 14:30:00',NULL,NULL,NULL),
(4,4,'cod','paid',0.00,NULL,NULL,NULL,'2025-03-07 09:00:00',NULL,NULL,NULL),
(5,5,'banking','paid',0.00,NULL,NULL,NULL,'2025-03-10 16:20:00',NULL,NULL,NULL),
(6,6,'cod','paid',0.00,NULL,NULL,NULL,'2025-03-18 10:00:00',NULL,NULL,NULL),
(7,7,'banking','paid',0.00,NULL,NULL,NULL,'2025-03-20 13:30:00',NULL,NULL,NULL),
(8,8,'cod','paid',0.00,NULL,NULL,NULL,'2025-04-03 14:00:00',NULL,NULL,NULL),
(9,9,'banking','paid',0.00,NULL,NULL,NULL,'2026-06-01 07:51:03',NULL,NULL,'2026-06-01 00:51:03'),
(10,10,'banking','paid',0.00,NULL,NULL,NULL,'2026-06-01 07:51:19',NULL,NULL,'2026-06-01 00:51:19'),
(11,11,'banking','paid',0.00,NULL,NULL,NULL,'2025-04-28 14:20:00',NULL,NULL,NULL),
(12,12,'cod','paid',0.00,NULL,NULL,NULL,'2026-06-01 07:48:59',NULL,NULL,'2026-06-01 00:48:59'),
(13,13,'banking','cancelled',75000000.00,NULL,NULL,NULL,NULL,NULL,'2026-05-27 01:08:20','2026-05-27 01:08:42'),
(14,14,'vnpay','cancelled',180000000.00,NULL,'14_1779869338',NULL,NULL,'2026-05-27 08:23:58','2026-05-27 01:08:58','2026-05-27 01:13:10'),
(15,16,'vnpay','cancelled',180000000.00,NULL,'16_1779870481',NULL,NULL,'2026-05-27 08:43:01','2026-05-27 01:13:17','2026-05-27 01:29:08'),
(16,18,'cod','cancelled',120000000.00,NULL,NULL,NULL,NULL,NULL,'2026-05-27 01:24:13','2026-05-27 01:24:24'),
(17,19,'vnpay','cancelled',120000000.00,NULL,'19_1779870373',NULL,NULL,'2026-05-27 08:41:13','2026-05-27 01:24:36','2026-05-27 01:35:16'),
(18,21,'vnpay','paid',17000000.00,'15558233','21_1779870866',NULL,'2026-06-10 10:30:05','2026-05-27 08:49:26','2026-05-27 01:33:28','2026-06-10 03:30:05'),
(19,22,'cod','cancelled',32000000.00,NULL,NULL,NULL,NULL,NULL,'2026-05-27 01:38:26','2026-05-27 01:38:35'),
(20,23,'vnpay','paid',500000.00,'15558256','23_1779871130',NULL,'2026-06-01 07:48:37','2026-05-27 08:53:50','2026-05-27 01:38:50','2026-06-01 00:48:37'),
(21,24,'banking','paid',75000000.00,NULL,NULL,NULL,'2026-06-10 10:29:52',NULL,'2026-05-29 00:49:05','2026-06-10 03:29:52'),
(22,25,'banking','paid',75000000.00,NULL,NULL,NULL,'2026-06-01 07:47:12',NULL,'2026-05-30 20:53:49','2026-06-01 00:47:12'),
(23,26,'vnpay','paid',170000000.00,'15564592','26_1780302103',NULL,'2026-06-01 08:23:22','2026-06-01 08:36:43','2026-06-01 01:21:43','2026-06-01 01:23:22');

-- 9. Reviews (16 đánh giá — chỉ giữ các review có product_id thuộc 1-26)
INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `rating`, `comment`, `created_at`) VALUES
(1,2,1,5,'Tranh rất đẹp, khảm tỉ mỉ từng chi tiết. Màu sắc tự nhiên của trai biển lung linh hơn ảnh thật. Giao hàng cẩn thận, đóng gói kỹ. Shop hỗ trợ lắp đặt tận nơi. Sẽ ủng hộ tiếp!','2025-02-13 03:00:00'),
(2,3,15,5,'Bộ tứ quý khảm ốc đẹp xuất sắc, chất lượng gỗ gụ tốt, ốc xà cừ sáng bóng. Treo phòng khách ai nhìn cũng khen. Giao hàng đúng hẹn. Cảm ơn shop!','2025-02-18 07:00:00'),
(3,4,13,4,'Sản phẩm chất lượng cao, xứng đáng tầm giá. Chỉ tiếc thời gian giao hàng hơi lâu do làm thủ công. Shop tư vấn nhiệt tình, hỗ trợ chọn kích thước phù hợp.','2025-02-26 02:00:00'),
(5,7,4,5,'Tranh Mừng Thọ tặng bố tôi 70 tuổi, ông rất xúc động. Kích thước đẹp, màu sắc trang nhã, khảm tinh xảo. Rất xứng đáng với giá tiền.','2025-03-19 07:00:00'),
(6,8,5,5,'Bức Thuận Buồm Xuôi Gió treo văn phòng cực đẹp, toả ra năng lượng tích cực. Shop hỗ trợ lắp đặt tận nơi, rất chuyên nghiệp. Đồng nghiệp ai cũng trầm trồ.','2025-03-27 08:00:00'),
(10,3,19,5,'Tranh Bách Phúc khảm ốc đỏ rất nổi bật, ý nghĩa sâu sắc. Mua tặng sếp nhân dịp thăng chức, sếp rất thích và treo ngay tại phòng làm việc.','2025-04-30 02:00:00'),
(16,1,1,5,'Sản phẩm đẹp, các chi tiết rất sắc xảo','2026-06-01 01:24:59');

-- 10. Carts (8 giỏ hàng)
INSERT INTO `carts` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(1,2,'2026-05-27 07:59:10','2026-05-27 07:59:10'),
(2,6,'2026-05-27 07:59:10','2026-05-27 07:59:10'),
(3,9,'2026-05-27 07:59:10','2026-05-27 07:59:10'),
(4,1,'2026-05-27 01:03:01','2026-05-27 01:03:01'),
(5,11,'2026-05-29 00:47:44','2026-05-29 00:47:44'),
(6,12,'2026-06-10 01:53:13','2026-06-10 01:53:13'),
(7,13,'2026-06-10 02:26:54','2026-06-10 02:26:54'),
(8,14,'2026-06-13 07:10:13','2026-06-13 07:10:13');

-- 11. Cart Items (5 items — chỉ giữ product_id thuộc 1-26)
INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`) VALUES
(1,1,9,1),
(2,1,1,2),
(3,2,7,1),
(4,3,25,1),
(5,3,26,1);

-- 12. Product Views
INSERT INTO `product_views` (`id`, `user_id`, `ip_hash`, `product_id`, `viewed_at`) VALUES
(1,1,NULL,1,'2026-06-09 09:17:56'),
(3,1,NULL,14,'2026-06-09 09:46:51'),
(5,1,NULL,26,'2026-06-09 10:13:38'),
(7,1,NULL,25,'2026-06-09 10:52:15'),
(9,NULL,'9a071d171774168c',17,'2026-06-10 06:22:13'),
(11,NULL,'9a071d171774168c',26,'2026-06-15 05:32:25'),
(13,NULL,'9a071d171774168c',14,'2026-06-15 05:36:40'),
(20,NULL,'9a071d171774168c',25,'2026-06-15 05:36:45'),
(21,NULL,'9a071d171774168c',1,'2026-06-15 05:37:00'),
(24,NULL,'9a071d171774168c',15,'2026-06-15 05:36:59');

-- 13. Voucher Usage
INSERT INTO `voucher_usage` (`id`, `voucher_id`, `user_id`, `order_id`, `used_at`) VALUES
(1,1,2,1,'2025-02-10 10:30:00'),
(2,3,3,2,'2025-02-14 09:00:00'),
(3,4,4,3,'2025-02-20 14:00:00'),
(4,1,5,4,'2025-03-05 11:00:00'),
(5,3,6,5,'2025-03-10 16:00:00'),
(6,2,8,7,'2025-03-20 13:00:00'),
(7,1,9,8,'2025-04-01 10:00:00'),
(8,4,10,9,'2025-04-20 09:00:00'),
(9,1,2,10,'2025-04-25 11:00:00'),
(10,5,3,11,'2025-04-28 14:00:00');
