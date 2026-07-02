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
</p>

---

## 📋 Mục lục

- [Tổng quan dự án](#-tổng-quan-dự-án)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt nhanh](#-cài-đặt-nhanh)
- [Cài đặt chi tiết](#-cài-đặt-chi-tiết)
  - [1. Clone dự án](#1-clone-dự-án)
  - [2. Cài đặt Backend](#2-cài-đặt-backend-laravel)
  - [3. Cài đặt Frontend](#3-cài-đặt-frontend-react)
- [Biến môi trường](#-biến-môi-trường)
- [Chạy dự án](#-chạy-dự-án)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
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

## 🛠️ Yêu cầu hệ thống

| Phần mềm | Phiên bản | Ghi chú |
|----------|-----------|---------|
| **PHP** | 8.3+ | Cần extension: `pdo_mysql`, `mbstring`, `openssl` |
| **Composer** | 2.x | Quản lý dependency PHP |
| **Node.js** | 18.x+ | Kèm theo npm |
| **MySQL** | 8.0+ | Database chính |
| **Git** | Bất kỳ | Để clone dự án |

> 💡 Khuyến nghị dùng [Laragon](https://laragon.org/) trên Windows — tích hợp sẵn PHP, MySQL, và Apache/Nginx.

---

## ⚡ Cài đặt nhanh

```bash
# 1. Clone
git clone https://github.com/dqtung1703/woodcraft-ecommerce.git
cd woodcraft-ecommerce

# 2. Backend
cd be
cp .env.example .env          # Tạo file env
# → Mở .env, điền DB_DATABASE, DB_USERNAME, DB_PASSWORD
php artisan key:generate       # Tạo APP_KEY
php artisan migrate --seed     # Tạo bảng + import toàn bộ dữ liệu mẫu
php artisan storage:link       # Tạo symlink cho ảnh
php artisan serve              # Chạy backend tại http://localhost:8000

# 3. Frontend (mở terminal mới)
cd ../fe
cp .env.example .env           # Mặc định trỏ về localhost:8000 — không cần sửa
npm install
npm run dev                    # Chạy frontend tại http://localhost:5173
```

---

## 📖 Cài đặt chi tiết

### 1. Clone dự án

```bash
git clone https://github.com/dqtung1703/woodcraft-ecommerce.git
cd woodcraft-ecommerce
```

---

### 2. Cài đặt Backend (Laravel)

```bash
cd be
```

#### Bước 1 — Cài PHP dependencies

```bash
composer install
```

#### Bước 2 — Tạo file môi trường

```bash
cp .env.example .env
php artisan key:generate
```

#### Bước 3 — Cấu hình database

Mở `be/.env`, tìm và sửa các dòng sau:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=woodcraft_ecommerce
DB_USERNAME=root
DB_PASSWORD=
```

> Tạo database trước nếu chưa có:
> ```sql
> CREATE DATABASE woodcraft_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> ```

#### Bước 4 — Chạy migration và seed dữ liệu

```bash
php artisan migrate --seed
```

Lệnh này sẽ tự động:
- ✅ Tạo toàn bộ cấu trúc bảng
- ✅ Import **14 danh mục**, **26 sản phẩm**, **14 tài khoản**, **6 voucher**, đơn hàng, đánh giá mẫu
- ✅ Ảnh sản phẩm đã có sẵn trong repo (không cần upload thêm)

#### Bước 5 — Tạo symlink storage

```bash
php artisan storage:link
```

---

### 3. Cài đặt Frontend (React)

```bash
cd ../fe
npm install
cp .env.example .env
```

File `fe/.env` sau khi copy:

```env
VITE_APP_NAME=Woodcraft Ecommerce
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_GOOGLE_CLIENT_ID=        # Để trống nếu không dùng đăng nhập Google
```

> **Không cần chỉnh gì thêm** nếu backend đang chạy tại `localhost:8000`.

---

## ⚙️ Biến môi trường

### Backend — `be/.env`

| Biến | Bắt buộc | Mô tả |
|------|----------|-------|
| `APP_KEY` | ✅ | Tự tạo bằng `php artisan key:generate` |
| `APP_URL` | ✅ | URL backend (mặc định `http://localhost:8000`) |
| `APP_FRONTEND_URL` | ✅ | URL frontend (mặc định `http://localhost:5173`) |
| `DB_DATABASE` | ✅ | Tên database MySQL |
| `DB_USERNAME` | ✅ | Username MySQL |
| `DB_PASSWORD` | ✅ | Password MySQL |
| `GOOGLE_CLIENT_ID` | ⚡ Tuỳ chọn | Thiếu → tắt đăng nhập Google |
| `OPENROUTER_API_KEY` | ⚡ Tuỳ chọn | Thiếu → tắt chatbot AI |
| `VNPAY_TMN_CODE` + `VNPAY_HASH_SECRET` | ⚡ Tuỳ chọn | Thiếu → tắt thanh toán VNPay |
| `MOMO_PARTNER_CODE` + `MOMO_ACCESS_KEY` + `MOMO_SECRET_KEY` | ⚡ Tuỳ chọn | Thiếu → tắt thanh toán MoMo |

> Các biến tuỳ chọn khi thiếu **chỉ tắt đúng tính năng đó**, các tính năng còn lại vẫn hoạt động bình thường.

### Frontend — `fe/.env`

| Biến | Bắt buộc | Mô tả |
|------|----------|-------|
| `VITE_API_BASE_URL` | ✅ | URL API backend |
| `VITE_APP_NAME` | ⚡ Tuỳ chọn | Tên hiển thị trên tab trình duyệt |
| `VITE_GOOGLE_CLIENT_ID` | ⚡ Tuỳ chọn | Thiếu → tắt nút đăng nhập Google |

---

## ▶️ Chạy dự án

```bash
# Terminal 1 — Backend (http://localhost:8000)
cd be
php artisan serve

# Terminal 2 — Frontend (http://localhost:5173)
cd fe
npm run dev
```

### Chạy Queue Worker (nếu cần xử lý job nền)

```bash
cd be
php artisan queue:work
```

---

## 🔑 Tài khoản mặc định

Sau khi chạy `php artisan migrate --seed`, hệ thống có sẵn các tài khoản:

| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| **Admin** | `admin@dogokhamtrai.vn` | `password` |
| **Customer** | `tuan.nv@gmail.com` | `password` |
| **Customer** | `thuy.tt@gmail.com` | `password` |
| **Customer** | `hoan.lq@gmail.com` | `password` |

---

## 📁 Cấu trúc dự án

```
woodcraft-ecommerce/
├── be/                              # Backend — Laravel 13
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
│   │       ├── DatabaseSeeder.php   # Entry point seeder
│   │       ├── WoodcraftProductionSeeder.php  # ← Seeder chính
│   │       └── data/
│   │           └── woodcraft_production_seed.sql  # Dữ liệu mẫu
│   ├── storage/
│   │   └── app/public/products/     # Ảnh sản phẩm (đã có trong repo)
│   ├── routes/api.php               # API routes
│   └── .env.example                 # Mẫu cấu hình
│
├── fe/                              # Frontend — React + TypeScript
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── services/
│   │   │   └── apiClient.ts         # Axios client
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── contexts/                # React Context (Auth, Cart, Toast)
│   │   └── types/                   # TypeScript types
│   └── .env.example                 # Mẫu cấu hình
│
└── woodcraft_ecommerce.sql          # SQL dump (tham khảo, không cần dùng)
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

| Nhóm | Mô tả | Xác thực |
|------|-------|----------|
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

**`php artisan` báo lỗi `APP_KEY` trống:**
```bash
php artisan key:generate
```

**Ảnh sản phẩm không hiển thị:**
```bash
php artisan storage:link
```

**Frontend báo lỗi kết nối API:**
- Kiểm tra `VITE_API_BASE_URL` trong `fe/.env` đúng với port backend
- Đảm bảo backend đang chạy: `php artisan serve`

**Lỗi CORS:**
- Kiểm tra `APP_FRONTEND_URL` trong `be/.env` đúng với port frontend (`http://localhost:5173`)

**Seed bị lỗi foreign key:**
```bash
php artisan migrate:fresh --seed
```

---

## 📄 Giấy phép

Dự án phát triển cho mục đích học tập và nghiên cứu.

---

<p align="center">Made with ❤️ by Woodcraft Team</p>
