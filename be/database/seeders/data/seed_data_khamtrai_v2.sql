-- ============================================================
-- SEED DATA HOÀN CHỈNH v2.0
-- HỆ THỐNG BÁN ĐỒ GỖ KHẢM TRAI TRUYỀN THỐNG
-- Nguồn tham khảo: khamtrai.vn, tranhkhamtrai.vn, dogokhamtrai.vn
-- Cập nhật: 24 danh mục, 80 sản phẩm, dữ liệu đầy đủ
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================================
-- BẢNG: categories (24 danh mục hoàn chỉnh)
-- ============================================================
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES
-- NHÓM 1: TRANH & NGHỆ THUẬT
(1,  'Tranh phong cảnh khảm trai',
     'Tranh phong cảnh đồng quê, biển cả, núi non, làng nghề – khảm ốc xà cừ, trai biển trên nền gỗ trắc, gỗ gụ cao cấp. Kích thước đa dạng từ 40x60cm đến 120x180cm.',
     NOW(), NOW()),
(2,  'Tranh tứ quý – tứ bình khảm trai',
     'Bộ tranh tứ bình 4 mùa Xuân Hạ Thu Đông – Tùng Cúc Trúc Mai – đặc trưng văn hóa Á Đông. Khảm ốc xà cừ Singapore cao cấp trên nền gỗ trắc tự nhiên.',
     NOW(), NOW()),
(3,  'Tranh chữ Hán khảm trai',
     'Tranh chữ thư pháp Hán – Bách Phúc, Phúc Như Đông Hải, Đức, Tâm, Nhẫn – khảm ốc xà cừ tỉ mỉ. Ý nghĩa sâu sắc, phù hợp treo phòng khách, phòng làm việc.',
     NOW(), NOW()),
(4,  'Tranh chân dung – truyền thần khảm trai',
     'Tranh chân dung khảm trai theo yêu cầu: ảnh người thân, danh nhân, lãnh tụ – kỹ thuật truyền thần truyền thống làng Chuyên Mỹ. Làm thủ công 100%, thời gian 15-30 ngày.',
     NOW(), NOW()),
(5,  'Tranh Phật – Tâm linh khảm trai',
     'Tranh Phật Thích Ca, Quan Thế Âm, Di Lặc – khảm trai ốc xà cừ trên nền gỗ mít, gỗ trắc. Trang trí ban thờ, phòng thiền định, không gian tâm linh.',
     NOW(), NOW()),
(6,  'Tranh di tích – Danh thắng',
     'Tranh khảm trai các công trình lịch sử: Đền Ngọc Sơn, Chùa Một Cột, Tháp Rùa Hồ Gươm, Chùa Hương, Vịnh Hạ Long – quà lưu niệm Việt Nam cao cấp.',
     NOW(), NOW()),
(7,  'Đĩa gỗ khảm trai',
     'Đĩa gỗ gụ, gỗ trắc đường kính 30-60cm khảm ốc xà cừ Singapore. Trang trí phòng khách, quà tặng sang trọng, trưng bày bàn thờ.',
     NOW(), NOW()),

-- NHÓM 2: NỘI THẤT & ĐỒ GỖ GIA DỤNG
(8,  'Sập gụ – Tủ chè khảm trai',
     'Sập gụ tứ linh, tủ chè gỗ gụ nguyên khối khảm ốc Singapore VIP. Sản phẩm cao cấp, đặt hàng theo yêu cầu, thời gian 45-90 ngày.',
     NOW(), NOW()),
(9,  'Bộ bàn ghế phòng khách khảm trai',
     'Bộ bàn ghế gỗ gụ, gỗ trắc tự nhiên khảm trai ốc Singapore. Hoa văn tứ linh, phúc lộc thọ – sang trọng, đẳng cấp.',
     NOW(), NOW()),
(10, 'Giường – Tủ phòng ngủ khảm trai',
     'Giường ngủ, tủ quần áo, táp đầu giường gỗ gụ khảm ốc Singapore. Kích thước 1m6 và 1m8. Đặt hàng theo yêu cầu.',
     NOW(), NOW()),
(11, 'Bàn trà – Kệ tivi khảm trai',
     'Bàn trà mặt kính cường lực khung gỗ gụ khảm trai; kệ tivi gỗ gụ khảm ốc – kết hợp hiện đại và truyền thống.',
     NOW(), NOW()),
(12, 'Đôn – Giá để đồ khảm trai',
     'Đôn tròn, đôn bát giác gỗ gụ khảm ốc Singapore – đặt bình hoa, chậu cây phòng khách. Gương và khung ảnh khảm trai trang trí.',
     NOW(), NOW()),
(13, 'Lọ hoa – Lục bình – Bình khảm',
     'Đôi lục bình gốm sứ bọc ốc xà cừ, lọ hoa gỗ trắc khảm trai, chum phú quý – trang trí sảnh văn phòng, phòng khách cao cấp.',
     NOW(), NOW()),

-- NHÓM 3: THỜ CÚNG & PHONG THỦY
(14, 'Bàn thờ gia tiên – Phật khảm trai',
     'Bàn thờ gia tiên 3-5 tầng, bàn thờ Phật gỗ mít già, gỗ hương – khảm trai ốc xà cừ, sơn son thếp vàng. Làm theo đặt hàng.',
     NOW(), NOW()),
(15, 'Hoành phi – Câu đối khảm trai',
     'Hoành phi chữ Hán sơn son thếp vàng khảm trai; câu đối gỗ trắc sơn vàng. Trang trí bàn thờ, phòng khách, phòng tiếp khách.',
     NOW(), NOW()),
(16, 'Tam sơn – Đồ thờ khảm trai',
     'Tam sơn 3 tầng, bộ ngũ sự, bát nhang, đỉnh trầm gỗ mít khảm trai – đồ thờ cúng gia tiên truyền thống.',
     NOW(), NOW()),
(17, 'Điếu gỗ – Đồng hồ khảm trai',
     'Điếu cày gỗ hương, gỗ trắc khảm ốc xà cừ; mặt đồng hồ treo tường khảm trai ốc độc đáo – quà tặng cao cấp cho nam giới.',
     NOW(), NOW()),

-- NHÓM 4: VĂN PHÒNG & QUÀ TẶNG
(18, 'Đốc lịch – Lốc lịch khảm trai',
     'Đốc lịch, lốc lịch để bàn gỗ trắc khảm ốc xà cừ – hoa văn Phúc Lộc Thọ, cảnh đẹp truyền thống. Quà biếu tết sang trọng, ý nghĩa.',
     NOW(), NOW()),
(19, 'Khay trà – Lót ly khảm trai',
     'Khay trà hình chữ nhật, hình tròn gỗ trắc khảm ốc; bộ lót ly 4-6 miếng – phụ kiện tiếp khách sang trọng, quà tặng cao cấp.',
     NOW(), NOW()),
(20, 'Bút – Đũa – Ống tăm khảm trai',
     'Bút viết gỗ trắc khảm ốc; hộp đũa 10 đôi khảm trai; ống tăm, lọ tăm khảm ốc – quà tặng văn phòng, biếu tết tinh tế.',
     NOW(), NOW()),
(21, 'Phụ kiện hiện đại khảm trai',
     'Vỏ điện thoại khảm trai ốc; hộp giấy ăn gỗ trắc khảm ốc; mặt đồng hồ treo tường khảm trai – sản phẩm truyền thống kết hợp hiện đại.',
     NOW(), NOW()),

-- NHÓM 5: HỘP, TRÁP & LƯU GIỮ
(22, 'Tráp trầu cau – Cưới hỏi',
     'Tráp tròn, bát giác, chữ nhật gỗ trắc khảm ốc Singapore – đựng trầu cau, lễ vật cưới hỏi. Sang trọng, truyền thống, phù hợp quà cưới cao cấp.',
     NOW(), NOW()),
(23, 'Hộp trang sức – Con dấu khảm trai',
     'Hộp đựng trang sức gỗ trắc có gương; hộp đựng con dấu, danh thiếp – quà tặng doanh nhân. Hộp bánh kẹo, mứt tết gỗ gụ khảm ốc.',
     NOW(), NOW()),

-- NHÓM 6: TRANG SỨC & NGUYÊN LIỆU
(24, 'Vòng tay – Trang sức xà cừ & Nguyên liệu',
     'Vòng đeo tay xà cừ tự nhiên, vòng ngọc trai. Con ốc biển, vỏ trai nguyên liệu cho thợ khảm trai – bán lẻ và B2B làng nghề.',
     NOW(), NOW());


-- ============================================================
-- BẢNG: products (80 sản phẩm hoàn chỉnh)
-- image_url để trống – bạn sẽ tự thêm ảnh
-- ============================================================
INSERT INTO products (id, name, description, original_price, price, stock, material, category_id, created_at, updated_at) VALUES

-- =========================================
-- NHÓM 1: TRANH PHONG CẢNH (category 1)
-- =========================================
(1, 'Tranh khảm trai Đồng Quê Thiên Hạ Thái Bình',
    'Bức tranh khảm ốc xà cừ mô tả cảnh đồng quê Việt Nam: cánh đồng lúa chín, bờ tre xanh mát, đàn trâu về làng. Gỗ trắc tự nhiên. Kích thước: 60x90cm.',
    3800000, 3500000, 10, 'Gỗ trắc – Ốc xà cừ Singapore', 1, '2024-01-10 08:00:00', '2024-01-10 08:00:00'),

(2, 'Tranh khảm trai Mã Đáo Thành Công',
    'Ngựa phi nước đại biểu tượng thành công, thuận lợi. Ốc màu sắc rực rỡ, sinh động. Kích thước: 60x90cm. Phù hợp treo phòng khách, phòng làm việc.',
    4500000, 4200000, 8, 'Gỗ trắc – Trai biển – Ốc xà cừ', 1, '2024-01-12 08:00:00', '2024-01-12 08:00:00'),

(3, 'Tranh khảm trai Hoa Khai Cát Tường',
    'Hoa mẫu đơn đua nở, biểu tượng phú quý cát tường. Khảm tay 100%, màu sắc tự nhiên từ vỏ trai. Kích thước: 60x90cm.',
    9500000, 8500000, 5, 'Gỗ trắc – Ốc xà cừ Singapore', 1, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),

(4, 'Tranh khảm trai Mừng Thọ',
    'Tranh mừng thọ ông bà: ông tiên thọ, hạc bay, thông xanh – biểu trưng trường thọ, phúc đức. Kích thước: 80x120cm.',
    10000000, 9000000, 4, 'Gỗ gụ – Trai biển – Ốc xà cừ', 1, '2024-01-18 08:00:00', '2024-01-18 08:00:00'),

(5, 'Tranh khảm ốc Thuận Buồm Xuôi Gió',
    'Thuyền buồm lớn trên biển xanh – biểu tượng thuận lợi, xuôi chèo mát mái. Siêu VIP, kích thước: 120x180cm. Viền gỗ trắc nguyên khối.',
    50000000, 45000000, 2, 'Gỗ trắc VIP – Ốc xà cừ Singapore đặc biệt', 1, '2024-02-01 08:00:00', '2024-02-01 08:00:00'),

(6, 'Tranh khảm trai Bách Điểu Chầu Phụng',
    'Trăm chim chầu phụng – tranh phong thủy thịnh vượng, quyền quý. Khảm thủ công tỉ mỉ. Kích thước: 80x120cm.',
    18000000, 16000000, 3, 'Gỗ gụ – Trai biển – Ốc xà cừ', 1, '2024-02-05 08:00:00', '2024-02-05 08:00:00'),

(7, 'Tranh khảm ốc Lý Ngư Vọng Nguyệt',
    'Cá chép trông trăng – ý nghĩa vươn lên thăng tiến, chí lớn. Màu sắc lung linh. Kích thước: 80x120cm.',
    25000000, 22000000, 3, 'Gỗ trắc – Ốc xà cừ Singapore', 1, '2024-02-10 08:00:00', '2024-02-10 08:00:00'),

(8, 'Tranh khảm ốc Vinh Quy Bái Tổ',
    'Cảnh rước trạng nguyên vinh quy bái tổ – truyền thống hiếu học của người Việt. Kích thước: 80x120cm.',
    45000000, 40000000, 2, 'Gỗ trắc VIP – Ốc xà cừ Singapore', 1, '2024-02-15 08:00:00', '2024-02-15 08:00:00'),

(9, 'Tranh khảm trai Trúc Xuân',
    'Trúc xanh thanh cao mùa xuân – tượng trưng quân tử, giản dị. Kích thước: 40x60cm. Phù hợp phòng làm việc.',
    4200000, 3800000, 15, 'Gỗ trắc – Trai biển', 1, '2024-02-18 08:00:00', '2024-02-18 08:00:00'),

(10, 'Tranh khảm trai Hoa Sen',
    'Hoa sen thanh khiết – biểu tượng văn hóa Phật giáo và vẻ đẹp thuần Việt. Kích thước: 40x60cm.',
    3800000, 3500000, 12, 'Gỗ trắc – Trai biển', 1, '2024-02-20 08:00:00', '2024-02-20 08:00:00'),

(11, 'Tranh khảm ốc Phu Thê Viên Mãn (Siêu VIP)',
    'Đôi uyên ương bên hoa sen, chữ Phu Thê Viên Mãn – quà cưới cao cấp ý nghĩa. Kích thước: 120x180cm. Viền gỗ trắc nguyên khối.',
    90000000, 80000000, 1, 'Gỗ trắc nguyên khối – Ốc xà cừ VIP', 1, '2024-03-01 08:00:00', '2024-03-01 08:00:00'),

(12, 'Tranh khảm trai Lục Hạc Quần Tùng',
    'Sáu con hạc bay giữa rừng thông – cảnh tiên, biểu tượng trường thọ phúc lộc. Kích thước: 60x90cm.',
    12000000, 10500000, 4, 'Gỗ trắc – Ốc xà cừ Singapore', 1, '2024-03-05 08:00:00', '2024-03-05 08:00:00'),

-- =========================================
-- NHÓM 2: TRANH TỨ QUÝ (category 2)
-- =========================================
(13, 'Bộ tranh tứ quý khảm ốc Tùng Cúc Trúc Mai',
     'Bộ 4 bức tứ bình: Tùng – Cúc – Trúc – Mai, mỗi bức 40x60cm. Ốc xà cừ Singapore trên nền gỗ trắc tự nhiên.',
     28000000, 25000000, 4, 'Gỗ trắc – Ốc xà cừ Singapore', 2, '2024-01-20 08:00:00', '2024-01-20 08:00:00'),

(14, 'Tranh tứ quý khảm ốc đỏ Siêu VIP',
     'Bộ tứ bình nền đỏ son, khảm ốc vàng bạc xà cừ – sang trọng hợp phong thủy. Mỗi bức 50x80cm.',
     55000000, 50000000, 2, 'Gỗ trắc VIP – Ốc Singapore đỏ', 2, '2024-01-25 08:00:00', '2024-01-25 08:00:00'),

(15, 'Bộ tranh tứ quý khảm trai gỗ gụ',
     'Bộ 4 tranh chim hoa bốn mùa trên nền gỗ gụ, mỗi bức 40x60cm. Khung gỗ trắc.',
     22000000, 19000000, 4, 'Gỗ gụ – Trai biển – Ốc xà cừ', 2, '2024-02-01 08:00:00', '2024-02-01 08:00:00'),

(16, 'Tranh khảm ốc Tứ Bình Nhi (Cha Mẹ)',
     'Bộ 4 bức tranh cha mẹ và con cái, gia đình hạnh phúc – quà tặng Vu Lan ý nghĩa. 4 bức x 40x60cm.',
     22000000, 21000000, 3, 'Gỗ trắc – Ốc xà cừ Singapore', 2, '2024-02-05 08:00:00', '2024-02-05 08:00:00'),

(17, 'Tranh khảm trai Tứ Đại Mỹ Nhân',
     'Bộ tứ bình 4 mỹ nhân: Tây Thi, Vương Chiêu Quân, Điêu Thuyền, Dương Quý Phi – tinh xảo, cầu kỳ. Mỗi bức 40x80cm.',
     18000000, 16000000, 3, 'Gỗ gụ – Trai biển', 2, '2024-02-10 08:00:00', '2024-02-10 08:00:00'),

(18, 'Bộ tranh tứ quý khảm ốc sen lọng tỉ mỉ',
     'Bộ 4 bức tranh tứ quý kỹ thuật khảm xen lọng tinh vi nhất, hoa sen – chim – mây. Mỗi bức 50x70cm.',
     35000000, 32000000, 2, 'Gỗ trắc – Ốc xà cừ Singapore VIP', 2, '2024-02-15 08:00:00', '2024-02-15 08:00:00'),

-- =========================================
-- NHÓM 3: TRANH CHỮ HÁN (category 3)
-- =========================================
(19, 'Tranh khảm Bách Phúc – 100 chữ Phúc',
     'Tranh 100 chữ Phúc viết theo 100 kiểu thư pháp, khảm ốc xà cừ nền gỗ trắc đỏ. Kích thước: 60x90cm.',
     16000000, 15000000, 6, 'Gỗ trắc đỏ – Ốc xà cừ vàng', 3, '2024-01-22 08:00:00', '2024-01-22 08:00:00'),

(20, 'Tranh chữ Phúc Như Đông Hải',
     'Chữ Phúc lớn trung tâm, hoa văn mây – sóng biển – hạc. Ý nghĩa phúc thọ bền vững. Kích thước: 60x90cm.',
     10000000, 9000000, 7, 'Gỗ trắc – Ốc xà cừ Singapore', 3, '2024-01-25 08:00:00', '2024-01-25 08:00:00'),

(21, 'Tranh chữ Đức khảm trai',
     'Chữ Đức thư pháp, hoa văn tứ linh Long Lân Quy Phụng. Kích thước: 60x90cm.',
     12000000, 11000000, 5, 'Gỗ trắc – Ốc xà cừ Singapore', 3, '2024-02-01 08:00:00', '2024-02-01 08:00:00'),

(22, 'Tranh gỗ trắc chữ Bách Phúc Hóa Tứ Linh',
     'Chữ Phúc hoá thành Tứ Linh Long Lân Quy Phụng cực tinh xảo. Kích thước: 80x120cm, viền gỗ trắc nguyên khối.',
     30000000, 28000000, 2, 'Gỗ trắc nguyên khối – Ốc xà cừ VIP', 3, '2024-02-05 08:00:00', '2024-02-05 08:00:00'),

(23, 'Tranh chữ Tâm khảm ốc',
     'Chữ Tâm thư pháp kết hợp hoa văn hoa sen, mây trời. Kích thước: 60x90cm.',
     10000000, 9000000, 6, 'Gỗ trắc – Ốc xà cừ Singapore', 3, '2024-02-08 08:00:00', '2024-02-08 08:00:00'),

(24, 'Tranh chữ Nhẫn – Phúc Lộc Thọ khảm ốc',
     'Chữ Nhẫn và bộ Phúc Lộc Thọ khảm ốc xà cừ nổi trên nền gỗ trắc. Kích thước: 40x60cm.',
     8500000, 7800000, 8, 'Gỗ trắc – Trai biển', 3, '2024-02-10 08:00:00', '2024-02-10 08:00:00'),

-- =========================================
-- NHÓM 4: TRANH CHÂN DUNG (category 4)
-- =========================================
(25, 'Tranh chân dung khảm trai theo yêu cầu (40x60cm)',
     'Tranh chân dung người thân khảm trai theo ảnh khách hàng cung cấp. Kỹ thuật truyền thần, thủ công 100%. Thời gian hoàn thành: 15-20 ngày. Kích thước: 40x60cm.',
     12000000, 11000000, 99, 'Gỗ trắc – Trai biển – Ốc xà cừ', 4, '2024-01-10 08:00:00', '2024-01-10 08:00:00'),

(26, 'Tranh chân dung khảm trai theo yêu cầu (60x90cm)',
     'Tranh chân dung khảm trai cỡ lớn theo ảnh cung cấp. Thời gian: 20-30 ngày. Kích thước: 60x90cm.',
     22000000, 20000000, 99, 'Gỗ gụ – Trai biển – Ốc xà cừ', 4, '2024-01-10 08:00:00', '2024-01-10 08:00:00'),

(27, 'Tranh chân dung Bác Hồ khảm trai',
     'Chân dung Chủ tịch Hồ Chí Minh khảm trai ốc xà cừ – trang trọng, ý nghĩa. Kích thước: 40x60cm.',
     12000000, 10000000, 10, 'Gỗ trắc – Trai biển', 4, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),

-- =========================================
-- NHÓM 5: TRANH PHẬT (category 5)
-- =========================================
(28, 'Tranh Phật Thích Ca Mâu Ni khảm trai',
     'Đức Phật Thích Ca ngồi thiền dưới cội Bồ Đề, khảm trai ốc xà cừ Singapore. Kích thước: 60x90cm.',
     15000000, 13500000, 5, 'Gỗ trắc – Ốc xà cừ Singapore', 5, '2024-01-20 08:00:00', '2024-01-20 08:00:00'),

(29, 'Tranh Quan Thế Âm Bồ Tát khảm trai',
     'Quan Thế Âm ngồi toà sen, khảm trai tinh tế. Kích thước: 60x90cm. Trang trí ban thờ, phòng thiền.',
     15000000, 13500000, 5, 'Gỗ trắc – Ốc xà cừ Singapore', 5, '2024-01-22 08:00:00', '2024-01-22 08:00:00'),

(30, 'Tranh Di Lặc Phật khảm trai',
     'Di Lặc Phật hoan hỉ, tay cầm túi vải – biểu tượng may mắn, vui vẻ. Kích thước: 40x60cm.',
     8000000, 7200000, 8, 'Gỗ trắc – Trai biển', 5, '2024-01-25 08:00:00', '2024-01-25 08:00:00'),

-- =========================================
-- NHÓM 6: TRANH DI TÍCH (category 6)
-- =========================================
(31, 'Tranh khảm trai Đền Ngọc Sơn',
     'Đền Ngọc Sơn – Hồ Gươm Hà Nội khảm trai tinh tế, quà lưu niệm Hà Nội độc đáo. Kích thước: 40x60cm.',
     4200000, 3800000, 12, 'Gỗ mít – Trai biển', 6, '2024-01-10 08:00:00', '2024-01-10 08:00:00'),

(32, 'Tranh khảm trai Chùa Một Cột',
     'Biểu tượng văn hóa Hà Nội – Chùa Một Cột tái hiện qua từng mảnh vỏ trai. Kích thước: 40x60cm.',
     4500000, 4000000, 10, 'Gỗ mít – Trai biển', 6, '2024-01-12 08:00:00', '2024-01-12 08:00:00'),

(33, 'Tranh khảm trai Tháp Rùa Hồ Gươm',
     'Tháp Rùa giữa hồ Gươm buổi sáng sớm, khảm trai tinh tế. Kích thước: 40x60cm.',
     4500000, 4000000, 8, 'Gỗ mít – Trai biển', 6, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),

(34, 'Tranh khảm trai Chùa Hương',
     'Cảnh Chùa Hương – dòng suối Yến, núi non hùng vĩ khảm trai tỉ mỉ. Kích thước: 60x90cm.',
     9500000, 8500000, 5, 'Gỗ trắc – Trai biển', 6, '2024-01-18 08:00:00', '2024-01-18 08:00:00'),

(35, 'Tranh khảm trai Vịnh Hạ Long',
     'Kỳ quan thiên nhiên thế giới – Vịnh Hạ Long với đảo đá và thuyền chài khảm ốc lung linh. Kích thước: 60x90cm.',
     12000000, 10500000, 4, 'Gỗ trắc – Ốc xà cừ Singapore', 6, '2024-01-20 08:00:00', '2024-01-20 08:00:00'),

-- =========================================
-- NHÓM 7: ĐĨA GỖ (category 7)
-- =========================================
(36, 'Đĩa gỗ gụ khảm trai đường kính 40cm',
     'Đĩa gỗ gụ đường kính 40cm khảm ốc xà cừ hoa văn rồng phượng. Trang trí phòng khách, quà tặng.',
     9000000, 8500000, 6, 'Gỗ gụ – Ốc xà cừ Singapore', 7, '2024-01-20 08:00:00', '2024-01-20 08:00:00'),

(37, 'Đĩa gỗ gụ khảm trai đường kính 50cm',
     'Đĩa gỗ gụ đường kính 50cm khảm ốc xà cừ, hoa văn cổ điển. Sang trọng, phong thuỷ tốt.',
     11000000, 9500000, 4, 'Gỗ gụ – Ốc xà cừ Singapore', 7, '2024-01-22 08:00:00', '2024-01-22 08:00:00'),

(38, 'Đĩa gỗ trắc khảm Phúc Lộc Thọ',
     'Đĩa gỗ trắc đường kính 35cm, khảm ốc 3 ông Phúc Lộc Thọ nổi bật. Trưng bày phòng khách.',
     7500000, 6800000, 6, 'Gỗ trắc – Ốc xà cừ Singapore', 7, '2024-01-25 08:00:00', '2024-01-25 08:00:00'),

(39, 'Đĩa khảm xen lọng Quanh Năm Dư Giả',
     'Đĩa gỗ trắc đường kính 35cm, kỹ thuật khảm xen lọng tinh vi – Quanh Năm Dư Giả. Quà tết sang trọng.',
     8500000, 7800000, 4, 'Gỗ trắc – Ốc xà cừ Singapore VIP', 7, '2024-02-01 08:00:00', '2024-02-01 08:00:00'),

(40, 'Đĩa khảm trai Nhất Lọng gỗ gụ 40cm',
     'Đĩa gỗ gụ đường kính 40cm, kỹ thuật nhất lọng tinh xảo. Độc đáo, hiếm có.',
     4000000, 3500000, 8, 'Gỗ gụ – Trai biển', 7, '2024-02-05 08:00:00', '2024-02-05 08:00:00'),

-- =========================================
-- NHÓM 8: SẬP GỤ – TỦ CHÈ (category 8)
-- =========================================
(41, 'Sập gụ khảm ốc Singapore VIP',
     'Sập gụ tứ linh gỗ gụ nguyên khối khảm ốc Singapore từng chi tiết. Kích thước: 200x100x50cm. Đặt hàng 45-60 ngày.',
     280000000, 260000000, 1, 'Gỗ gụ nguyên khối – Ốc Singapore VIP', 8, '2024-01-01 08:00:00', '2024-01-01 08:00:00'),

(42, 'Tủ chè gỗ gụ khảm trai',
     'Tủ chè 2 tầng gỗ gụ tự nhiên, khảm trai ốc Singapore. Kích thước: 80x50x120cm. Đặt hàng 30-45 ngày.',
     120000000, 110000000, 2, 'Gỗ gụ – Ốc xà cừ Singapore', 8, '2024-01-05 08:00:00', '2024-01-05 08:00:00'),

-- =========================================
-- NHÓM 9: BÀN GHẾ PHÒNG KHÁCH (category 9)
-- =========================================
(43, 'Bộ bàn ghế phòng khách gỗ gụ khảm trai (1 bàn + 2 ghế)',
     'Bộ bàn ghế gỗ gụ tự nhiên, khảm trai ốc Singapore. Hoa văn tứ linh, phúc lộc thọ. Đặt hàng 30-45 ngày.',
     180000000, 165000000, 2, 'Gỗ gụ – Ốc xà cừ Singapore', 9, '2024-01-10 08:00:00', '2024-01-10 08:00:00'),

(44, 'Bộ bàn ghế phòng khách gỗ trắc khảm trai (1 bàn + 4 ghế)',
     'Bộ bàn ghế 5 món gỗ trắc tự nhiên, khảm trai hoa văn cổ điển. Đặt hàng 45 ngày.',
     320000000, 295000000, 1, 'Gỗ trắc – Ốc xà cừ Singapore VIP', 9, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),

-- =========================================
-- NHÓM 10: GIƯỜNG – TỦ PHÒNG NGỦ (category 10)
-- =========================================
(45, 'Giường ngủ gỗ gụ khảm ốc Singapore (1m8)',
     'Giường đôi 1m8x2m gỗ gụ, đầu giường khảm ốc Singapore hoa văn rồng phượng. Đặt hàng 30-45 ngày.',
     95000000, 88000000, 2, 'Gỗ gụ – Ốc Singapore', 10, '2024-01-20 08:00:00', '2024-01-20 08:00:00'),

(46, 'Bộ phòng ngủ gỗ gụ khảm trai (giường + 2 táp + tủ)',
     'Bộ hoàn chỉnh gồm giường 1m8, 2 táp đầu giường, tủ 4 cánh. Gỗ gụ khảm ốc Singapore. Đặt hàng 60-90 ngày.',
     280000000, 260000000, 1, 'Gỗ gụ – Ốc xà cừ Singapore', 10, '2024-01-25 08:00:00', '2024-01-25 08:00:00'),

-- =========================================
-- NHÓM 11: BÀN TRÀ – KỆ TIVI (category 11)
-- =========================================
(47, 'Bàn trà khảm trai gỗ gụ mặt kính',
     'Bàn trà mặt kính cường lực khung gỗ gụ khảm trai ốc Singapore. Kích thước: 120x60x45cm. Hiện đại kết hợp truyền thống.',
     28000000, 25000000, 3, 'Gỗ gụ – Kính cường lực – Ốc Singapore', 11, '2024-02-01 08:00:00', '2024-02-01 08:00:00'),

(48, 'Kệ tivi gỗ gụ khảm trai 1m8',
     'Kệ tivi gỗ gụ tự nhiên khảm trai ốc xà cừ. Kích thước: 180x45x60cm. Thiết kế sang trọng, nhiều ngăn.',
     45000000, 40000000, 2, 'Gỗ gụ – Ốc xà cừ Singapore', 11, '2024-02-05 08:00:00', '2024-02-05 08:00:00'),

-- =========================================
-- NHÓM 12: ĐÔN – GƯƠNG – KHUNG ẢNH (category 12)
-- =========================================
(49, 'Đôi đôn tròn gỗ gụ khảm trai',
     'Đôi đôn tròn gỗ gụ khảm ốc xà cừ Singapore. Đường kính 30cm, cao 45cm. Đặt bình hoa, chậu cây phòng khách.',
     32000000, 28000000, 3, 'Gỗ gụ – Ốc xà cừ Singapore', 12, '2024-02-10 08:00:00', '2024-02-10 08:00:00'),

(50, 'Gương tròn khảm trai gỗ trắc (60cm)',
     'Gương tròn đường kính 60cm khung gỗ trắc khảm ốc xà cừ. Trang trí phòng ngủ, phòng khách.',
     6500000, 5800000, 5, 'Gỗ trắc – Ốc xà cừ', 12, '2024-02-12 08:00:00', '2024-02-12 08:00:00'),

(51, 'Bộ khung ảnh đôi khảm trai 20x25cm',
     'Bộ 2 khung ảnh gỗ trắc khảm ốc, kích thước ảnh 20x25cm. Quà cưới, kỷ niệm lãng mạn.',
     1800000, 1600000, 20, 'Gỗ trắc – Trai biển', 12, '2024-02-15 08:00:00', '2024-02-15 08:00:00'),

-- =========================================
-- NHÓM 13: LỌ HOA – LỤC BÌNH (category 13)
-- =========================================
(52, 'Đôi lọ lục bình gốm sứ bọc ốc xà cừ (cao 60cm)',
     'Đôi lọ lục bình gốm sứ bọc ốc xà cừ Singapore, cao 60cm. Trang trí phòng khách, sảnh văn phòng.',
     12000000, 10500000, 4, 'Gốm sứ – Ốc xà cừ Singapore', 13, '2024-02-01 08:00:00', '2024-02-01 08:00:00'),

(53, 'Đôi chum phú quý gỗ trắc khảm ốc',
     'Đôi chum gỗ trắc hình bầu cao 40cm, khảm ốc Singapore hoa văn tứ linh. Phong thủy tài lộc.',
     18000000, 16000000, 3, 'Gỗ trắc – Ốc xà cừ Singapore', 13, '2024-02-05 08:00:00', '2024-02-05 08:00:00'),

(54, 'Lọ chè gỗ trắc khảm trai',
     'Lọ đựng chè (trà) gỗ trắc tự nhiên khảm trai ốc Singapore. Giữ hương trà, phụ kiện trà đạo cao cấp. Dung tích 500g.',
     3500000, 3200000, 10, 'Gỗ trắc – Ốc xà cừ', 13, '2024-02-08 08:00:00', '2024-02-08 08:00:00'),

-- =========================================
-- NHÓM 14: BÀN THỜ (category 14)
-- =========================================
(55, 'Bàn thờ gia tiên gỗ mít khảm trai 5 tầng',
     'Bàn thờ 5 tầng gỗ mít già khảm trai ốc xà cừ, sơn son thếp vàng. Kích thước: 80x40x180cm (RxSxC). Đặt hàng.',
     35000000, 32000000, 5, 'Gỗ mít già – Sơn mài – Trai biển', 14, '2024-01-01 08:00:00', '2024-01-01 08:00:00'),

(56, 'Bàn thờ Phật gỗ hương khảm trai',
     'Bàn thờ Phật cao cấp gỗ hương tự nhiên khảm trai ốc Singapore. Kích thước: 120x50x200cm.',
     85000000, 78000000, 2, 'Gỗ hương – Ốc xà cừ Singapore', 14, '2024-01-05 08:00:00', '2024-01-05 08:00:00'),

-- =========================================
-- NHÓM 15: HOÀNH PHI – CÂU ĐỐI (category 15)
-- =========================================
(57, 'Hoành phi sơn son thếp vàng khảm trai',
     'Hoành phi chữ Hán: Phúc – Gia Đình Hòa Thuận... sơn son thếp vàng khảm trai. Làm theo kích thước yêu cầu.',
     15000000, 13500000, 10, 'Gỗ mít – Sơn mài – Trai biển', 15, '2024-01-10 08:00:00', '2024-01-10 08:00:00'),

(58, 'Đôi câu đối gỗ trắc khảm trai',
     'Đôi câu đối gỗ trắc khảm trai ốc xà cừ, chữ Hán sơn vàng. Mỗi câu dài 150cm, rộng 20cm. Tặng kèm móc treo.',
     20000000, 18000000, 6, 'Gỗ trắc – Ốc xà cừ – Sơn vàng', 15, '2024-01-12 08:00:00', '2024-01-12 08:00:00'),

-- =========================================
-- NHÓM 16: TAM SƠN – ĐỒ THỜ (category 16)
-- =========================================
(59, 'Tam sơn khảm trai gỗ mít 3 tầng',
     'Tam sơn 3 tầng gỗ mít già khảm trai ốc xà cừ, sơn son thếp vàng. Kích thước: 60x30x80cm.',
     22000000, 19500000, 5, 'Gỗ mít – Sơn mài – Trai biển', 16, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),

(60, 'Bộ ngũ sự thờ cúng khảm trai',
     'Bộ ngũ sự gồm: 1 đỉnh trầm + 2 đài nến + 2 bình hoa, gỗ mít khảm trai ốc. Đầy đủ đồ thờ cúng truyền thống.',
     18000000, 16000000, 4, 'Gỗ mít – Trai biển', 16, '2024-01-18 08:00:00', '2024-01-18 08:00:00'),

-- =========================================
-- NHÓM 17: ĐIẾU GỖ – ĐỒNG HỒ (category 17)
-- =========================================
(61, 'Điếu gỗ hương khảm trai',
     'Điếu cày gỗ hương tự nhiên khảm ốc xà cừ, chạm khắc thủ công tứ linh. Chiều dài 35cm.',
     2800000, 2500000, 15, 'Gỗ hương – Ốc xà cừ', 17, '2024-01-20 08:00:00', '2024-01-20 08:00:00'),

(62, 'Mặt đồng hồ treo tường khảm trai (40cm)',
     'Mặt đồng hồ treo tường gỗ trắc đường kính 40cm, khảm ốc xà cừ tinh xảo. Tặng kèm máy đồng hồ kim.',
     5500000, 5000000, 8, 'Gỗ trắc – Ốc xà cừ Singapore', 17, '2024-01-22 08:00:00', '2024-01-22 08:00:00'),

-- =========================================
-- NHÓM 18: ĐỐC LỊCH – LỐC LỊCH (category 18)
-- =========================================
(63, 'Đốc lịch gỗ trắc khảm ốc Phúc Lộc Thọ',
     'Đốc lịch để bàn gỗ trắc khảm ốc xà cừ hoa văn Phúc Lộc Thọ, tặng kèm 12 tờ lịch. Kích thước: 20x15x5cm.',
     2200000, 1980000, 25, 'Gỗ trắc – Ốc xà cừ', 18, '2024-01-10 08:00:00', '2024-01-10 08:00:00'),

(64, 'Đốc lịch khảm ốc Anh Hùng Tương Ngộ',
     'Đốc lịch cảnh Anh Hùng Tương Ngộ sắc nét, nền gỗ trắc. Kích thước: 22x16x5cm.',
     2500000, 2200000, 15, 'Gỗ trắc – Ốc xà cừ Singapore', 18, '2024-01-12 08:00:00', '2024-01-12 08:00:00'),

(65, 'Đốc lịch khảm ốc xanh Hoa Lý',
     'Đốc lịch nền gỗ trắc, khảm ốc xanh hoa lý – thanh lịch, phong nhã. Kích thước: 20x15x5cm.',
     2200000, 1980000, 15, 'Gỗ trắc – Ốc xà cừ', 18, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),

(66, 'Lốc lịch gỗ trắc khảm ốc Singapore (cao cấp)',
     'Lốc lịch để bàn cao cấp gỗ trắc khảm ốc xà cừ Singapore, cảnh tứ quý. Kích thước: 30x22x5cm.',
     6000000, 5500000, 8, 'Gỗ trắc – Ốc xà cừ Singapore', 18, '2024-01-18 08:00:00', '2024-01-18 08:00:00'),

-- =========================================
-- NHÓM 19: KHAY TRÀ – LÓT LY (category 19)
-- =========================================
(67, 'Khay trà gỗ trắc khảm ốc hình chữ nhật',
     'Khay trà hình chữ nhật gỗ trắc khảm ốc xà cừ Singapore, có tay cầm. Kích thước: 40x30x5cm.',
     4800000, 4200000, 10, 'Gỗ trắc – Ốc xà cừ Singapore', 19, '2024-01-20 08:00:00', '2024-01-20 08:00:00'),

(68, 'Bộ lót ly khảm trai ốc (set 4 miếng)',
     'Bộ 4 miếng lót ly gỗ trắc khảm ốc xà cừ, đường kính 10cm. Đóng hộp gỗ. Quà tặng tinh tế.',
     850000, 750000, 30, 'Gỗ trắc – Ốc xà cừ', 19, '2024-01-22 08:00:00', '2024-01-22 08:00:00'),

(69, 'Khay trà gỗ trắc khảm ốc hình bầu dục',
     'Khay trà hình bầu dục gỗ trắc khảm trai ốc, hoa văn hoa sen. Kích thước: 45x32x5cm.',
     5500000, 5000000, 8, 'Gỗ trắc – Trai biển', 19, '2024-01-25 08:00:00', '2024-01-25 08:00:00'),

-- =========================================
-- NHÓM 20: BÚT – ĐŨA – ỐNG TĂM (category 20)
-- =========================================
(70, 'Hộp đũa gỗ trắc khảm ốc (10 đôi)',
     'Hộp 10 đôi đũa gỗ trắc khảm ốc xà cừ đầu đũa, đóng hộp gỗ sang trọng. Quà biếu tết, quà tặng công ty.',
     1200000, 980000, 50, 'Gỗ trắc – Trai biển', 20, '2024-01-10 08:00:00', '2024-01-10 08:00:00'),

(71, 'Ống tăm gỗ trắc khảm ốc',
     'Ống đựng tăm gỗ trắc khảm ốc xà cừ hoa văn hoa lý. Đường kính 5cm, cao 10cm.',
     550000, 480000, 40, 'Gỗ trắc – Trai biển', 20, '2024-01-12 08:00:00', '2024-01-12 08:00:00'),

(72, 'Bút viết gỗ trắc khảm trai',
     'Bút bi gỗ trắc khảm ốc xà cừ – quà tặng văn phòng sang trọng và độc đáo. Ruột bút thay được.',
     850000, 750000, 30, 'Gỗ trắc – Ốc xà cừ', 20, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),

-- =========================================
-- NHÓM 21: PHỤ KIỆN HIỆN ĐẠI (category 21)
-- =========================================
(73, 'Vỏ điện thoại khảm trai iPhone',
     'Vỏ điện thoại iPhone khảm trai ốc xà cừ thủ công. Độc đáo, sang trọng. Báo mã máy khi đặt hàng.',
     1500000, 1350000, 30, 'Nhựa cứng – Ốc xà cừ', 21, '2024-02-01 08:00:00', '2024-02-01 08:00:00'),

(74, 'Hộp đựng giấy ăn gỗ trắc khảm ốc',
     'Hộp đựng giấy ăn gỗ trắc tự nhiên khảm ốc xà cừ. Kích thước: 25x13x10cm. Trang trí bàn ăn, phòng khách.',
     2200000, 1980000, 20, 'Gỗ trắc – Ốc xà cừ', 21, '2024-02-05 08:00:00', '2024-02-05 08:00:00'),

-- =========================================
-- NHÓM 22: TRÁP TRẦU CAU – CƯỚI HỎI (category 22)
-- =========================================
(75, 'Tráp tròn gỗ trắc khảm ốc xà cừ',
     'Tráp đựng trầu cau, nữ trang hình tròn, gỗ trắc tự nhiên khảm ốc xà cừ Singapore. Đường kính 25cm, cao 12cm. Quà cưới cao cấp.',
     3800000, 3500000, 15, 'Gỗ trắc – Ốc xà cừ Singapore', 22, '2024-01-10 08:00:00', '2024-01-10 08:00:00'),

(76, 'Tráp bát giác gỗ trắc khảm ốc Singapore',
     'Tráp 8 cạnh gỗ trắc khảm ốc Singapore cao cấp, bên trong lót nhung đỏ. Kích thước: 30x30x15cm.',
     5500000, 5000000, 8, 'Gỗ trắc – Ốc xà cừ Singapore', 22, '2024-01-12 08:00:00', '2024-01-12 08:00:00'),

(77, 'Tráp gỗ trắc khảm Nho Sóc',
     'Tráp hình chữ nhật khảm hoa văn nho sóc – biểu tượng sung túc đủ đầy. Kích thước: 35x25x12cm.',
     4500000, 4000000, 8, 'Gỗ trắc – Ốc xà cừ', 22, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),

(78, 'Tráp đựng bánh kẹo gỗ gụ khảm trai (tết)',
     'Tráp đựng bánh kẹo mứt tết gỗ gụ khảm trai, 4-6 ngăn. Kích thước: 40x30x10cm. Quà tết sang trọng.',
     5000000, 4500000, 10, 'Gỗ gụ – Trai biển', 22, '2024-01-18 08:00:00', '2024-01-18 08:00:00'),

-- =========================================
-- NHÓM 23: HỘP TRANG SỨC – CON DẤU (category 23)
-- =========================================
(79, 'Hộp trang sức gỗ trắc khảm trai 3 ngăn',
     'Hộp đựng trang sức gỗ trắc khảm ốc xà cừ, 3 ngăn có gương bên trong. Kích thước: 25x18x10cm.',
     3200000, 2800000, 12, 'Gỗ trắc – Ốc xà cừ', 23, '2024-01-20 08:00:00', '2024-01-20 08:00:00'),

(80, 'Hộp đựng con dấu gỗ trắc khảm trai',
     'Hộp đựng con dấu gỗ trắc khảm trai ốc – quà tặng độc đáo cho doanh nhân, giám đốc. Kích thước: 12x12x8cm.',
     1800000, 1600000, 20, 'Gỗ trắc – Trai biển', 23, '2024-01-22 08:00:00', '2024-01-22 08:00:00');


-- ============================================================
-- BẢNG: product_images
-- Ghi chú: image_url để theo quy ước tên file – bạn tự thêm ảnh
-- ============================================================
INSERT INTO product_images (id, product_id, image_url, created_at) VALUES
-- Sản phẩm 1-12 (Tranh phong cảnh)
(1,  1,  'products/01-tranh-dong-que/main.jpg', NOW()),
(2,  1,  'products/01-tranh-dong-que/detail.jpg', NOW()),
(3,  2,  'products/02-tranh-ma-dao/main.jpg', NOW()),
(4,  2,  'products/02-tranh-ma-dao/detail.jpg', NOW()),
(5,  3,  'products/03-tranh-hoa-khai/main.jpg', NOW()),
(6,  4,  'products/04-tranh-mung-tho/main.jpg', NOW()),
(7,  4,  'products/04-tranh-mung-tho/detail.jpg', NOW()),
(8,  5,  'products/05-tranh-thuan-buom/main.jpg', NOW()),
(9,  5,  'products/05-tranh-thuan-buom/angle.jpg', NOW()),
(10, 5,  'products/05-tranh-thuan-buom/detail.jpg', NOW()),
(11, 6,  'products/06-tranh-bach-dieu/main.jpg', NOW()),
(12, 7,  'products/07-tranh-ly-ngu/main.jpg', NOW()),
(13, 8,  'products/08-tranh-vinh-quy/main.jpg', NOW()),
(14, 9,  'products/09-tranh-truc-xuan/main.jpg', NOW()),
(15, 10, 'products/10-tranh-hoa-sen/main.jpg', NOW()),
(16, 11, 'products/11-tranh-phu-the/main.jpg', NOW()),
(17, 11, 'products/11-tranh-phu-the/detail.jpg', NOW()),
(18, 12, 'products/12-tranh-luc-hac/main.jpg', NOW()),
-- Tranh tứ quý (13-18)
(19, 13, 'products/13-tu-quy-tung-cuc/main.jpg', NOW()),
(20, 13, 'products/13-tu-quy-tung-cuc/bo4-buc.jpg', NOW()),
(21, 14, 'products/14-tu-quy-do-vip/main.jpg', NOW()),
(22, 15, 'products/15-tu-quy-go-gu/main.jpg', NOW()),
(23, 16, 'products/16-tu-binh-cha-me/main.jpg', NOW()),
(24, 17, 'products/17-tu-dai-my-nhan/main.jpg', NOW()),
(25, 18, 'products/18-tu-quy-sen-long/main.jpg', NOW()),
-- Tranh chữ (19-24)
(26, 19, 'products/19-tranh-bach-phuc/main.jpg', NOW()),
(27, 20, 'products/20-chu-phuc-dong-hai/main.jpg', NOW()),
(28, 21, 'products/21-chu-duc/main.jpg', NOW()),
(29, 22, 'products/22-bach-phuc-tu-linh/main.jpg', NOW()),
(30, 23, 'products/23-chu-tam/main.jpg', NOW()),
(31, 24, 'products/24-chu-nhan-phuc-loc-tho/main.jpg', NOW()),
-- Chân dung (25-27)
(32, 25, 'products/25-chan-dung-mau/main.jpg', NOW()),
(33, 26, 'products/26-chan-dung-lon-mau/main.jpg', NOW()),
(34, 27, 'products/27-chan-dung-bac-ho/main.jpg', NOW()),
-- Tranh Phật (28-30)
(35, 28, 'products/28-phat-thich-ca/main.jpg', NOW()),
(36, 29, 'products/29-quan-the-am/main.jpg', NOW()),
(37, 30, 'products/30-di-lac/main.jpg', NOW()),
-- Di tích (31-35)
(38, 31, 'products/31-den-ngoc-son/main.jpg', NOW()),
(39, 32, 'products/32-chua-mot-cot/main.jpg', NOW()),
(40, 33, 'products/33-thap-rua/main.jpg', NOW()),
(41, 34, 'products/34-chua-huong/main.jpg', NOW()),
(42, 35, 'products/35-vinh-ha-long/main.jpg', NOW()),
-- Đĩa gỗ (36-40)
(43, 36, 'products/36-dia-go-gu-40cm/main.jpg', NOW()),
(44, 37, 'products/37-dia-go-gu-50cm/main.jpg', NOW()),
(45, 38, 'products/38-dia-phuc-loc-tho/main.jpg', NOW()),
(46, 39, 'products/39-dia-xen-long/main.jpg', NOW()),
(47, 40, 'products/40-dia-nhat-long/main.jpg', NOW()),
-- Sập gụ (41-42)
(48, 41, 'products/41-sap-gu-vip/main.jpg', NOW()),
(49, 41, 'products/41-sap-gu-vip/detail.jpg', NOW()),
(50, 42, 'products/42-tu-che/main.jpg', NOW()),
-- Bàn ghế (43-44)
(51, 43, 'products/43-ban-ghe-3-mon/main.jpg', NOW()),
(52, 44, 'products/44-ban-ghe-5-mon/main.jpg', NOW()),
-- Giường tủ (45-46)
(53, 45, 'products/45-giuong-1m8/main.jpg', NOW()),
(54, 46, 'products/46-bo-phong-ngu/main.jpg', NOW()),
-- Bàn trà kệ tivi (47-48)
(55, 47, 'products/47-ban-tra/main.jpg', NOW()),
(56, 48, 'products/48-ke-tivi/main.jpg', NOW()),
-- Đôn gương khung (49-51)
(57, 49, 'products/49-don-tron/main.jpg', NOW()),
(58, 50, 'products/50-guong-tron/main.jpg', NOW()),
(59, 51, 'products/51-khung-anh-doi/main.jpg', NOW()),
-- Lọ hoa lục bình (52-54)
(60, 52, 'products/52-luc-binh/main.jpg', NOW()),
(61, 53, 'products/53-chum-phu-quy/main.jpg', NOW()),
(62, 54, 'products/54-lo-che/main.jpg', NOW()),
-- Bàn thờ (55-56)
(63, 55, 'products/55-ban-tho-5-tang/main.jpg', NOW()),
(64, 56, 'products/56-ban-tho-phat/main.jpg', NOW()),
-- Hoành phi câu đối (57-58)
(65, 57, 'products/57-hoanh-phi/main.jpg', NOW()),
(66, 58, 'products/58-cau-doi/main.jpg', NOW()),
-- Tam sơn đồ thờ (59-60)
(67, 59, 'products/59-tam-son/main.jpg', NOW()),
(68, 60, 'products/60-bo-ngu-su/main.jpg', NOW()),
-- Điếu đồng hồ (61-62)
(69, 61, 'products/61-dieu-go-huong/main.jpg', NOW()),
(70, 62, 'products/62-mat-dong-ho/main.jpg', NOW()),
-- Đốc lịch (63-66)
(71, 63, 'products/63-doc-lich-phuc-loc-tho/main.jpg', NOW()),
(72, 64, 'products/64-doc-lich-anh-hung/main.jpg', NOW()),
(73, 65, 'products/65-doc-lich-hoa-ly/main.jpg', NOW()),
(74, 66, 'products/66-loc-lich-vip/main.jpg', NOW()),
-- Khay trà lót ly (67-69)
(75, 67, 'products/67-khay-tra-chu-nhat/main.jpg', NOW()),
(76, 68, 'products/68-lot-ly-4-miec/main.jpg', NOW()),
(77, 69, 'products/69-khay-tra-bau-duc/main.jpg', NOW()),
-- Bút đũa ống tăm (70-72)
(78, 70, 'products/70-hop-dua-10-doi/main.jpg', NOW()),
(79, 71, 'products/71-ong-tam/main.jpg', NOW()),
(80, 72, 'products/72-but-go-trac/main.jpg', NOW()),
-- Phụ kiện hiện đại (73-74)
(81, 73, 'products/73-vo-dien-thoai/main.jpg', NOW()),
(82, 74, 'products/74-hop-giay-an/main.jpg', NOW()),
-- Tráp cưới hỏi (75-78)
(83, 75, 'products/75-trap-tron/main.jpg', NOW()),
(84, 75, 'products/75-trap-tron/inside.jpg', NOW()),
(85, 76, 'products/76-trap-bat-giac/main.jpg', NOW()),
(86, 77, 'products/77-trap-nho-soc/main.jpg', NOW()),
(87, 78, 'products/78-trap-banh-keo/main.jpg', NOW()),
-- Hộp trang sức (79-80)
(88, 79, 'products/79-hop-trang-suc/main.jpg', NOW()),
(89, 79, 'products/79-hop-trang-suc/open.jpg', NOW()),
(90, 80, 'products/80-hop-con-dau/main.jpg', NOW());


-- ============================================================
-- BẢNG: product_discounts
-- ============================================================
INSERT INTO product_discounts (id, product_id, discount_type, discount_value, start_date, end_date, status, created_at, updated_at) VALUES
(1,  9,  'percent', 10, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'active',   NOW(), NOW()),
(2,  15, 'percent',  8, '2025-04-01 00:00:00', '2025-06-30 23:59:59', 'active',   NOW(), NOW()),
(3,  16, 'percent',  5, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'active',   NOW(), NOW()),
(4,  70, 'fixed', 220000, '2025-01-20 00:00:00', '2025-02-20 23:59:59', 'inactive', NOW(), NOW()),
(5,  79, 'fixed', 400000, '2025-04-01 00:00:00', '2025-05-31 23:59:59', 'active',   NOW(), NOW()),
(6,  36, 'percent',  6, '2025-04-01 00:00:00', '2025-06-30 23:59:59', 'active',   NOW(), NOW()),
(7,  78, 'percent', 10, '2025-01-01 00:00:00', '2025-02-28 23:59:59', 'inactive', NOW(), NOW()),
(8,  40, 'percent', 13, '2025-04-01 00:00:00', '2025-06-30 23:59:59', 'active',   NOW(), NOW());


-- ============================================================
-- BẢNG: users (10 người dùng mẫu thực tế)
-- ============================================================
-- Mật khẩu tất cả tài khoản demo: 'password'
INSERT INTO users (id, name, email, password_hash, role, phone, address, created_at, updated_at) VALUES
(1,  'Admin Khảm Trai',    'admin@dogokhamtrai.vn',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',    '0971126568', 'Số 15D, Ngõ 1, Phố Bùi Xương Trạch, Khương Đình, Thanh Xuân, Hà Nội', NOW(), NOW()),
(2,  'Nguyễn Văn Tuấn',    'tuan.nv@gmail.com',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '0912345678', '45 Hoàng Mai, Hai Bà Trưng, Hà Nội',                                   '2024-02-05 08:00:00', '2024-02-05 08:00:00'),
(3,  'Trần Thị Thuỷ',      'thuy.tt@gmail.com',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '0987654321', '12 Tôn Đức Thắng, Đống Đa, Hà Nội',                                   '2024-02-10 08:00:00', '2024-02-10 08:00:00'),
(4,  'Lê Quang Hoàn',      'hoan.lq@gmail.com',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '0934567890', 'Phố Cốc Lếu, TP Lào Cai, tỉnh Lào Cai',                               '2024-02-15 08:00:00', '2024-02-15 08:00:00'),
(5,  'Phạm Minh Xuân',     'xuan.pm@gmail.com',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '0908765432', '88 Trần Hữu Tước, Cầu Giấy, Hà Nội',                                  '2024-02-18 08:00:00', '2024-02-18 08:00:00'),
(6,  'Đinh Văn Nam',       'nam.dv@gmail.com',       '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '0945678901', 'Thị trấn Bần Yên Nhân, Mỹ Hào, Hưng Yên',                             '2024-03-01 08:00:00', '2024-03-01 08:00:00'),
(7,  'Bùi Thị Hà',         'ha.bt@gmail.com',        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '0978901234', 'Ngọc Hồi, Thanh Trì, Hà Nội',                                         '2024-03-05 08:00:00', '2024-03-05 08:00:00'),
(8,  'Vũ Hữu Tuyên',       'tuyen.vh@gmail.com',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '0901234567', 'Thị trấn Vĩnh Bảo, huyện Vĩnh Bảo, Hải Phòng',                        '2024-03-10 08:00:00', '2024-03-10 08:00:00'),
(9,  'Đoàn Thị An',        'an.dt@gmail.com',        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '0965432109', 'Phường 1, TP Mỹ Tho, Tiền Giang',                                      '2024-03-15 08:00:00', '2024-03-15 08:00:00'),
(10, 'Nguyễn Văn Tiếp',    'tiep.nv@gmail.com',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '0923456789', 'Thị trấn Trạm Trôi, Hoài Đức, Hà Nội',                                '2024-03-20 08:00:00', '2024-03-20 08:00:00');


-- ============================================================
-- BẢNG: vouchers (6 mã giảm giá)
-- ============================================================
-- Ghi chú: used_count là tổng lịch sử sử dụng toàn thời gian (bao gồm dữ liệu ngoài seed này)
INSERT INTO vouchers (id, code, discount_type, discount_value, min_order_value, max_discount, quantity, used_count, per_user_limit, start_date, end_date, status, created_at, updated_at) VALUES
(1, 'KHAMSALE10',  'percent',  10,  5000000,   2000000, 100,  23, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'active',   NOW(), NOW()),
(2, 'TETCHUYEN30', 'percent',  30, 10000000,   5000000,  50,   8, 1, '2025-01-15 00:00:00', '2025-02-15 23:59:59', 'inactive', NOW(), NOW()),
(3, 'TANGQUA500',  'fixed',   500000, 3000000,   500000, 200,  55, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'active',   NOW(), NOW()),
(4, 'VIPKHAM20',   'percent',  20, 50000000,  15000000,  20,   3, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'active',   NOW(), NOW()),
(5, 'KHAITHANG15', 'percent',  15,  8000000,   3000000,  80,  12, 1, '2025-05-01 00:00:00', '2025-05-31 23:59:59', 'active',   NOW(), NOW()),
(6, 'CUOIHOI10',   'percent',  10,  3000000,   1500000, 150,  40, 1, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 'active',   NOW(), NOW());


-- ============================================================
-- BẢNG: orders (12 đơn hàng mẫu thực tế)
-- ============================================================
INSERT INTO orders (id, user_id, total_price, discount_amount, final_price, voucher_id, status, created_at, updated_at) VALUES
(1,  2, 3500000,   350000,  3150000, 1, 'completed', '2025-02-10 10:30:00', '2025-02-12 15:00:00'),
(2,  3, 19000000, 1000000, 18000000, 3, 'completed', '2025-02-14 09:00:00', '2025-02-17 10:00:00'),
(3,  4, 40000000, 8000000, 32000000, 4, 'completed', '2025-02-20 14:00:00', '2025-02-25 16:00:00'),
(4,  5, 4000000,   400000,  3600000, 1, 'completed', '2025-03-05 11:00:00', '2025-03-07 09:00:00'),
-- Order 5: 9M(hoành phi) + 4.2M(khay trà) + 0.75M×2(lót ly) = 14.7M; voucher TANGQUA500 giảm 500K
(5,  6, 14700000,  500000, 14200000, 3, 'completed', '2025-03-10 16:00:00', '2025-03-13 14:00:00'),
(6,  7,  9000000,       0,  9000000, NULL, 'completed','2025-03-15 08:30:00', '2025-03-18 10:00:00'),
-- Order 7: 45M × 30% = 13.5M nhưng max_discount voucher TETCHUYEN30 = 5M → giảm 5M
(7,  8, 45000000, 5000000, 40000000, 2, 'completed', '2025-03-20 13:00:00', '2025-03-26 11:00:00'),
(8,  9, 3800000,   380000,  3420000, 1, 'completed', '2025-04-01 10:00:00', '2025-04-03 14:00:00'),
(9, 10, 25000000, 5000000, 20000000, 4, 'processing','2025-04-20 09:00:00', '2025-04-20 09:00:00'),
(10, 2, 5000000,   500000,  4500000, 1, 'processing','2025-04-25 11:00:00', '2025-04-25 11:00:00'),
(11, 3, 13500000, 2025000, 11475000, 5, 'completed', '2025-04-28 14:00:00', '2025-05-01 10:00:00'),
(12, 7, 7200000,       0,  7200000, NULL, 'pending', '2025-05-01 09:00:00', '2025-05-01 09:00:00');


-- ============================================================
-- BẢNG: order_items (Chi tiết đơn hàng)
-- ============================================================
INSERT INTO order_items (id, order_id, product_id, price, quantity) VALUES
(1,  1,  1,  3500000, 1),   -- Đồng quê
(2,  2, 15, 19000000, 1),   -- Tứ quý gỗ gụ
(3,  3, 13, 25000000, 1),   -- Tứ quý tùng cúc
(4,  3, 19, 15000000, 1),   -- Bách phúc
(5,  4, 32,  4000000, 1),   -- Chùa Một Cột
(6,  5, 57,  9000000, 1),   -- Hoành phi
(7,  5, 67,  4200000, 1),   -- Khay trà
(8,  5, 68,    750000, 2),   -- Lót ly x2
(9,  6,  4,  9000000, 1),   -- Mừng thọ
(10, 7,  5, 45000000, 1),   -- Thuận buồm xuôi gió
(11, 8, 31,  3800000, 1),   -- Đền Ngọc Sơn
(12, 9, 41, 25000000, 1),   -- Đặt cọc sập gụ
(13,10, 76,  5000000, 1),   -- Tráp bát giác
(14,11, 57, 13500000, 1),   -- Hoành phi
(15,12, 29,  7200000, 1);   -- Quan Thế Âm


-- ============================================================
-- BẢNG: payments (Thanh toán)
-- ============================================================
INSERT INTO payments (id, order_id, method, status, paid_at) VALUES
(1,  1,  'bank_transfer', 'paid',    '2025-02-10 10:45:00'),
(2,  2,  'cod',           'paid',    '2025-02-17 10:00:00'),
(3,  3,  'bank_transfer', 'paid',    '2025-02-20 14:30:00'),
(4,  4,  'cod',           'paid',    '2025-03-07 09:00:00'),
(5,  5,  'bank_transfer', 'paid',    '2025-03-10 16:20:00'),
(6,  6,  'cod',           'paid',    '2025-03-18 10:00:00'),
(7,  7,  'bank_transfer', 'paid',    '2025-03-20 13:30:00'),
(8,  8,  'cod',           'paid',    '2025-04-03 14:00:00'),
(9,  9,  'bank_transfer', 'pending', NULL),
(10,10,  'bank_transfer', 'pending', NULL),
(11,11,  'bank_transfer', 'paid',    '2025-04-28 14:20:00'),
(12,12,  'cod',           'pending', NULL);


-- ============================================================
-- BẢNG: reviews (15 đánh giá thực tế, chi tiết)
-- ============================================================
INSERT INTO reviews (id, user_id, product_id, rating, comment, created_at) VALUES
(1,  2,  1, 5, 'Tranh rất đẹp, khảm tỉ mỉ từng chi tiết. Màu sắc tự nhiên của trai biển lung linh hơn ảnh thật. Giao hàng cẩn thận, đóng gói kỹ. Shop hỗ trợ lắp đặt tận nơi. Sẽ ủng hộ tiếp!', '2025-02-13 10:00:00'),
(2,  3, 15, 5, 'Bộ tứ quý khảm ốc đẹp xuất sắc, chất lượng gỗ gụ tốt, ốc xà cừ sáng bóng. Treo phòng khách ai nhìn cũng khen. Giao hàng đúng hẹn. Cảm ơn shop!', '2025-02-18 14:00:00'),
(3,  4, 13, 4, 'Sản phẩm chất lượng cao, xứng đáng tầm giá. Chỉ tiếc thời gian giao hàng hơi lâu do làm thủ công. Shop tư vấn nhiệt tình, hỗ trợ chọn kích thước phù hợp.', '2025-02-26 09:00:00'),
(4,  5, 32, 5, 'Tranh Chùa Một Cột khảm rất tinh tế, tặng đối tác nước ngoài họ rất thích. Khen là quà lưu niệm Việt Nam đẹp nhất họ từng nhận. Chắc chắn sẽ mua thêm.', '2025-03-08 10:00:00'),
(5,  7,  4, 5, 'Tranh Mừng Thọ tặng bố tôi 70 tuổi, ông rất xúc động. Kích thước đẹp, màu sắc trang nhã, khảm tinh xảo. Rất xứng đáng với giá tiền.', '2025-03-19 14:00:00'),
(6,  8,  5, 5, 'Bức Thuận Buồm Xuôi Gió treo văn phòng cực đẹp, toả ra năng lượng tích cực. Shop hỗ trợ lắp đặt tận nơi, rất chuyên nghiệp. Đồng nghiệp ai cũng trầm trồ.', '2025-03-27 15:00:00'),
(7,  9, 31, 4, 'Tranh Đền Ngọc Sơn làm quà tặng bạn bè nước ngoài, ai cũng trầm trồ. Giao hàng nhanh, đóng gói cẩn thận. Muốn thêm vài lựa chọn kích thước nhỏ hơn.', '2025-04-04 09:30:00'),
(8,  2, 75, 5, 'Tráp tròn gỗ trắc đẹp lắm, mua làm tráp lễ cưới, ốc xà cừ sáng lung linh. Gỗ trắc thơm tự nhiên. Mọi người khen ngợi nhiều. Sẽ mua thêm bộ tráp đầy đủ.', '2025-04-27 10:00:00'),
(9,  6, 57, 5, 'Hoành phi Gia Đình Hòa Thuận sơn son thếp vàng rất trang trọng. Treo phòng thờ đẹp hơn hẳn. Người bán tư vấn chữ phù hợp, hỗ trợ lắp đặt tận nhà tận tình.', '2025-03-14 11:00:00'),
(10, 3, 19, 5, 'Tranh Bách Phúc khảm ốc đỏ rất nổi bật, ý nghĩa sâu sắc. Mua tặng sếp nhân dịp thăng chức, sếp rất thích và treo ngay tại phòng làm việc. Cảm ơn shop đã tư vấn!', '2025-04-30 09:00:00'),
(11, 5, 67, 4, 'Khay trà gỗ trắc khảm ốc rất đẹp và chắc chắn. Màu gỗ tự nhiên đẹp, ốc xà cừ bắt sáng lung linh. Hơi nặng hơn mình nghĩ nhưng rất vừa tầm tay.', '2025-03-08 14:00:00'),
(12, 7, 29, 5, 'Tranh Quan Thế Âm khảm trai tinh tế và trang nghiêm. Treo ban thờ rất phù hợp, gia đình ai cũng hài lòng. Đóng gói kỹ lưỡng, giao hàng đúng hẹn.', '2025-05-02 08:00:00'),
(13, 4, 33, 5, 'Tranh Tháp Rùa rất đẹp và có hồn. Mua về Lào Cai treo phòng khách, bạn bè xuống chơi ai cũng ngạc nhiên. Nghề khảm trai truyền thống thật tuyệt vời!', '2025-02-27 10:00:00'),
(14, 8, 61, 4, 'Điếu gỗ hương khảm ốc làm quà tặng bố vợ rất được khen. Gỗ hương thơm tự nhiên, ốc khảm tinh tế. Hơi mong có thêm vài mẫu hoa văn để lựa chọn.', '2025-03-27 16:00:00'),
(15, 2, 68, 5, 'Bộ lót ly 4 miếng đóng hộp gỗ rất sang. Mua làm quà khai trương văn phòng bạn bè ai cũng thích. Giá hợp lý, chất lượng xuất sắc so với tầm giá.', '2025-04-26 11:00:00');


-- ============================================================
-- BẢNG: carts & cart_items (Giỏ hàng hiện tại)
-- ============================================================
INSERT INTO carts (id, user_id, created_at, updated_at) VALUES
(1, 2, NOW(), NOW()),
(2, 6, NOW(), NOW()),
(3, 9, NOW(), NOW());

INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES
(1, 1, 9,  1),
(2, 1, 68, 2),
(3, 2, 57, 1),
(4, 3, 28, 1),
(5, 3, 59, 1);


-- ============================================================
-- BẢNG: product_views (Lượt xem sản phẩm)
-- ============================================================
INSERT INTO product_views (id, user_id, ip_hash, product_id, viewed_at) VALUES
(1,  2,    MD5('192.168.1.100'),  5,  NOW() - INTERVAL 7 DAY),
(2,  NULL, MD5('10.0.0.55'),      5,  NOW() - INTERVAL 6 DAY),
(3,  NULL, MD5('10.0.0.60'),     13,  NOW() - INTERVAL 5 DAY),
(4,  4,    MD5('192.168.1.120'), 41,  NOW() - INTERVAL 4 DAY),
(5,  NULL, MD5('10.0.0.71'),     11,  NOW() - INTERVAL 3 DAY),
(6,  NULL, MD5('10.0.0.82'),      1,  NOW() - INTERVAL 2 DAY),
(7,  3,    MD5('10.0.1.10'),     19,  NOW() - INTERVAL 2 DAY),
(8,  NULL, MD5('10.0.1.20'),     57,  NOW() - INTERVAL 1 DAY),
(9,  5,    MD5('192.168.2.50'),  43,  NOW() - INTERVAL 1 DAY),
(10, NULL, MD5('10.0.1.30'),     55,  NOW()),
(11, NULL, MD5('10.0.1.40'),     75,  NOW()),
(12, 7,    MD5('192.168.3.10'),  29,  NOW());


-- ============================================================
-- BẢNG: voucher_usage (Lịch sử dùng voucher)
-- ============================================================
INSERT INTO voucher_usage (id, voucher_id, user_id, order_id, used_at) VALUES
(1, 1, 2,  1,  '2025-02-10 10:30:00'),
(2, 3, 3,  2,  '2025-02-14 09:00:00'),
(3, 4, 4,  3,  '2025-02-20 14:00:00'),
(4, 1, 5,  4,  '2025-03-05 11:00:00'),
(5, 3, 6,  5,  '2025-03-10 16:00:00'),
(6, 2, 8,  7,  '2025-03-20 13:00:00'),
(7, 1, 9,  8,  '2025-04-01 10:00:00'),
(8, 4, 10, 9,  '2025-04-20 09:00:00'),
(9, 1, 2,  10, '2025-04-25 11:00:00'),
(10,5, 3,  11, '2025-04-28 14:00:00');


-- ============================================================
-- END OF SEED DATA v2.0
-- Tổng kết:
--   categories  : 24 danh mục (6 nhóm)
--   products    : 80 sản phẩm
--   product_images : 90 ảnh (đường dẫn chuẩn – tự thêm file ảnh)
--   product_discounts : 8 chương trình giảm giá
--   users       : 10 người dùng (1 admin + 9 customer)
--   vouchers    : 6 mã voucher
--   orders      : 12 đơn hàng
--   order_items : 15 dòng chi tiết
--   payments    : 12 bản ghi thanh toán
--   reviews     : 15 đánh giá chi tiết
--   carts       : 3 giỏ hàng đang mở
--   cart_items  : 5 sản phẩm trong giỏ
--   product_views: 12 lượt xem
--   voucher_usage: 10 lịch sử dùng voucher
-- ============================================================
