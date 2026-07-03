<h1 align="center">🪵 Woodcraft E-Commerce</h1>

<p align="center">
  Website thương mại điện tử chuyên về đồ gỗ và thủ công mỹ nghệ.
  <br/>
  <strong>Backend:</strong> Laravel 13 &nbsp;|&nbsp; <strong>Frontend:</strong> React + TypeScript + Vite
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-13.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PHP-8.3+-777BB4?style=for-the-badge&logo=php&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

---

## 📋 Mục lục

- [Tổng quan dự án](#-tổng-quan-dự-án)
- [Cài đặt — Chọn phương thức](#-cài-đặt--chọn-phương-thức)
  - [Phương thức 1: Laragon / XAMPP (truyền thống)](#phương-thức-1-laragon--xampp-truyền-thống)
  - [Phương thức 2: Docker (không cần cài PHP/MySQL)](#phương-thức-2-docker-không-cần-cài-phpmysql)
- [Biến môi trường](#-biến-môi-trường)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
- [Chạy dự án (truyền thống)](#️-chạy-dự-án-truyền-thống)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Tính năng chính](#-tính-năng-chính)
- [API Overview](#-api-overview)
- [Xử lý sự cố](#-xử-lý-sự-cố)

---

## 🌟 Tổng quan dự án

**Woodcraft** là nền tảng thương mại điện tử chuyên bán đồ gỗ và thủ công mỹ nghệ. Hệ thống bao gồm:

- 🛍️ Cửa hàng trực tuyến: duyệt, tìm kiếm và mua sản phẩm đồ gỗ
- 🔐 Xác thực: đăng nhập thông thường và Google OAuth
- 💳 Thanh toán online: VNPay và MoMo (Sandbox)
- 🤖 Chatbot AI: tư vấn sản phẩm qua OpenRouter API
- 🏷️ Voucher & Khuyến mãi: hệ thống mã giảm giá
- ⭐ Đánh giá sản phẩm: review và rating
- 🔔 Thông báo: hệ thống notification
- 📊 Trang quản trị: dashboard cho admin

---

## 🚀 Cài đặt — Chọn phương thức

---

### Phương thức 1: Laragon / XAMPP (truyền thống)

> Phù hợp khi đã có sẵn môi trường PHP + MySQL trên máy.

**Yêu cầu:**

| Phần mềm | Phiên bản | Ghi chú |
|----------|-----------|---------| 
| **PHP** | 8.3+ | Cần extension: `pdo_mysql`, `mbstring`, `openssl` |
| **Composer** | 2.x | Quản lý dependency PHP |
| **Node.js** | 18.x+ | Kèm theo npm |
| **MySQL** | 8.0+ | Database chính |

> 💡 Nếu chưa có môi trường: tải [Laragon](https://laragon.org/download/) (Windows) hoặc [XAMPP](https://www.apachefriends.org/) (đa nền tảng) — tích hợp sẵn PHP + MySQL.

#### Bước 1 — Clone dự án

```bash
git clone https://github.com/dqtung1703/woodcraft-ecommerce.git
cd woodcraft-ecommerce
```

#### Bước 2 — Cài đặt Backend

```bash
cd be
composer install
cp .env.example .env
php artisan key:generate
```

Mở `be/.env`, cấu hình database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=woodcraft_ecommerce
DB_USERNAME=root
DB_PASSWORD=              # Laragon/XAMPP thường để trống
```

> Tạo database trước nếu chưa có:
> ```sql
> CREATE DATABASE woodcraft_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> ```

```bash
php artisan migrate --seed   # Tạo bảng + import dữ liệu mẫu
php artisan storage:link     # Tạo symlink cho ảnh sản phẩm
```

#### Bước 3 — Cài đặt Frontend

```bash
cd ../fe
npm install
cp .env.example .env    # Mặc định trỏ về localhost:8000, không cần sửa
```

#### Bước 4 — Chạy dự án

```bash
# Terminal 1 — Backend (http://localhost:8000)
cd be && php artisan serve

# Terminal 2 — Frontend (http://localhost:5173)
cd fe && npm run dev
```

---

### Phương thức 2: Docker (không cần cài PHP/MySQL)

> Phù hợp khi máy chưa có PHP/MySQL, hoặc muốn môi trường nhất quán.  
> Chỉ cần cài **Docker Desktop** — mọi thứ còn lại tự động.

**Yêu cầu:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) đã cài và đang chạy
- Git

#### Bước 1 — Clone dự án

```bash
git clone https://github.com/dqtung1703/woodcraft-ecommerce.git
cd woodcraft-ecommerce
```

#### Bước 2 — Tạo APP_KEY

Chạy lệnh sau để tạo một key ngẫu nhiên:

```bash
docker run --rm php:8.4-cli-alpine php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
```

Copy kết quả (dạng `base64:xxx...`), mở file `docker-compose.yml`, điền vào dòng `APP_KEY`:

```yaml
environment:
  APP_KEY: base64:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # ← dán vào đây
```

#### Bước 3 — Khởi động toàn bộ hệ thống

```bash
docker compose up -d
```

> ⏳ Lần đầu mất **3–5 phút** để tải image và cài dependencies. Từ lần 2 trở đi rất nhanh.

Khi hoàn tất, truy cập:

| Service | Địa chỉ |
|---------|---------|
| 🖥️ **Frontend** | http://localhost:5173 |
| ⚙️ **Backend API** | http://localhost:8000/api/v1 |
| 🗄️ **MySQL** | localhost:3306 (user: `woodcraft` / pass: `secret`) |

#### Bước 4 — Kiểm tra logs (nếu có lỗi)

```bash
docker compose logs backend    # log Laravel
docker compose logs frontend   # log React
docker compose logs db         # log MySQL
```

#### Dừng / Xoá hệ thống

```bash
docker compose down        # Dừng, giữ nguyên data
docker compose down -v     # Dừng + xoá sạch data (database)
```

#### Cấu hình tuỳ chọn trong Docker

Mở `docker-compose.yml`, tìm phần `environment` của service `backend` để điền thêm:

```yaml
GOOGLE_CLIENT_ID: "your-google-client-id"       # Đăng nhập Google
OPENROUTER_API_KEY: "your-openrouter-key"        # Chatbot AI
VNPAY_TMN_CODE: "your-vnpay-code"               # Thanh toán VNPay
VNPAY_HASH_SECRET: "your-vnpay-secret"
MOMO_PARTNER_CODE: "your-momo-code"             # Thanh toán MoMo
MOMO_ACCESS_KEY: "your-momo-access-key"
MOMO_SECRET_KEY: "your-momo-secret-key"
```

---

## ⚙️ Biến môi trường

### Backend — `be/.env` (phương thức truyền thống)

| Biến | Bắt buộc | Mô tả |
|------|----------|-------|
| `APP_KEY` | ✅ | Tự tạo bằng `php artisan key:generate` |
| `APP_URL` | ✅ | URL backend (`http://localhost:8000`) |
| `APP_FRONTEND_URL` | ✅ | URL frontend (`http://localhost:5173`) |
| `DB_DATABASE` | ✅ | Tên database MySQL |
| `DB_USERNAME` | ✅ | Username MySQL |
| `DB_PASSWORD` | ✅ | Password MySQL |
| `GOOGLE_CLIENT_ID` | ⚡ Tuỳ chọn | Thiếu → tắt đăng nhập Google |
| `OPENROUTER_API_KEY` | ⚡ Tuỳ chọn | Thiếu → tắt chatbot AI |
| `VNPAY_TMN_CODE` + `VNPAY_HASH_SECRET` | ⚡ Tuỳ chọn | Thiếu → tắt thanh toán VNPay |
| `MOMO_PARTNER_CODE` + `MOMO_ACCESS_KEY` + `MOMO_SECRET_KEY` | ⚡ Tuỳ chọn | Thiếu → tắt thanh toán MoMo |

> Các biến tuỳ chọn khi thiếu **chỉ tắt đúng tính năng đó**, không ảnh hưởng các tính năng còn lại.

### Frontend — `fe/.env`

| Biến | Bắt buộc | Mô tả |
|------|----------|-------|
| `VITE_API_BASE_URL` | ✅ | URL API backend |
| `VITE_APP_NAME` | ⚡ Tuỳ chọn | Tên hiển thị trên tab trình duyệt |
| `VITE_GOOGLE_CLIENT_ID` | ⚡ Tuỳ chọn | Thiếu → tắt nút đăng nhập Google |

---

## 🔑 Tài khoản mặc định

Sau khi seed dữ liệu (cả 2 phương thức), hệ thống có sẵn:

| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| **Admin** | `admin@dogokhamtrai.vn` | `password` |
| **Customer** | `tuan.nv@gmail.com` | `password` |
| **Customer** | `thuy.tt@gmail.com` | `password` |
| **Customer** | `hoan.lq@gmail.com` | `password` |

---

## ▶️ Chạy dự án (truyền thống)

```bash
# Terminal 1 — Backend (http://localhost:8000)
cd be
php artisan serve

# Terminal 2 — Frontend (http://localhost:5173)
cd fe
npm run dev

# Terminal 3 (tuỳ chọn) — Queue Worker
cd be
php artisan queue:work
```

---

## 📁 Cấu trúc dự án

```
woodcraft-ecommerce/
├── docker-compose.yml               # Cấu hình Docker (chạy cả stack)
│
├── be/                              # Backend — Laravel 13
│   ├── Dockerfile                   # Docker image cho backend
│   ├── docker-entrypoint.sh         # Script khởi động container
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/         # API Controllers
│   │   │   ├── Middleware/          # Middleware xác thực
│   │   │   ├── Requests/            # Form Request validation
│   │   │   ├── Resources/           # API Resource transformers
│   │   │   └── Responses/           # Chuẩn hoá API response
│   │   ├── Models/                  # Eloquent Models
│   │   ├── Services/                # Business logic
│   │   └── Repositories/            # Data access layer
│   ├── database/
│   │   ├── migrations/              # Cấu trúc bảng
│   │   └── seeders/
│   │       ├── DatabaseSeeder.php
│   │       ├── WoodcraftProductionSeeder.php
│   │       └── data/
│   │           └── woodcraft_production_seed.sql
│   ├── storage/app/public/products/ # Ảnh sản phẩm (đã có trong repo)
│   ├── routes/api.php               # API routes
│   └── .env.example
│
├── fe/                              # Frontend — React + TypeScript
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── services/apiClient.ts    # Axios client
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── contexts/                # React Context (Auth, Cart, Toast)
│   │   └── types/                   # TypeScript types
│   └── .env.example
│
└── woodcraft_ecommerce.sql          # SQL dump (chỉ để tham khảo)
```

---

## ✨ Tính năng chính

### 👤 Khách hàng (Customer)
- Đăng ký / Đăng nhập bằng email hoặc Google
- Duyệt và tìm kiếm sản phẩm theo danh mục, giá, đánh giá
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng và thanh toán qua **VNPay** / **MoMo** / COD
- Áp dụng mã giảm giá (voucher)
- Theo dõi trạng thái đơn hàng
- Viết đánh giá và nhận xét sản phẩm
- Chat với **AI Chatbot** để được tư vấn sản phẩm

### 🔧 Quản trị viên (Admin)
- Quản lý sản phẩm, danh mục, kho hàng
- Xử lý và cập nhật trạng thái đơn hàng
- Quản lý tài khoản người dùng
- Quản lý voucher khuyến mãi
- Dashboard báo cáo doanh thu

---

## 🔌 API Overview

**Base URL:** `http://localhost:8000/api/v1`

| Endpoint | Mô tả | Xác thực |
|----------|-------|----------|
| `POST /auth/register` | Đăng ký tài khoản | Public |
| `POST /auth/login` | Đăng nhập | Public |
| `POST /auth/google` | Đăng nhập Google | Public |
| `GET /products` | Danh sách sản phẩm | Public |
| `GET /categories` | Danh mục | Public |
| `GET /cart` | Xem giỏ hàng | 🔒 Token |
| `POST /orders` | Tạo đơn hàng | 🔒 Token |
| `POST /payments/vnpay` | Thanh toán VNPay | 🔒 Token |
| `POST /payments/momo` | Thanh toán MoMo | 🔒 Token |
| `GET /reviews/{product}` | Đánh giá sản phẩm | Public |
| `POST /vouchers/check` | Kiểm tra voucher | 🔒 Token |
| `POST /chatbot` | Chat AI | 🔒 Token |
| `/admin/*` | Quản trị hệ thống | 🔒 Admin |

> Xác thực dùng **Laravel Sanctum** — gửi token qua header:
> ```
> Authorization: Bearer {your_token}
> ```

---

## 🐛 Xử lý sự cố

**Lỗi `APP_KEY` trống:**
```bash
php artisan key:generate
```

**Lỗi `Table already exists` khi migrate:**
```bash
php artisan migrate:fresh --seed
```

**Lỗi database dùng SQLite thay vì MySQL:**
- Mở `be/.env`, đảm bảo `DB_CONNECTION=mysql` và `DB_DATABASE=woodcraft_ecommerce`

**Ảnh sản phẩm không hiển thị:**
```bash
php artisan storage:link
```

**Frontend báo lỗi kết nối API:**
- Kiểm tra `VITE_API_BASE_URL` trong `fe/.env` đúng port backend
- Đảm bảo backend đang chạy

**Lỗi CORS:**
- Kiểm tra `APP_FRONTEND_URL` trong `be/.env` đúng port frontend (`http://localhost:5173`)

**Docker — backend không kết nối được MySQL:**
```bash
docker compose down -v
docker compose up -d    # Khởi động lại từ đầu
```

**Docker — xem log lỗi:**
```bash
docker compose logs -f backend
```

---

## 📄 Giấy phép

Dự án phát triển cho mục đích học tập và nghiên cứu.

---

<p align="center">Made with ❤️ by Woodcraft Team</p>
