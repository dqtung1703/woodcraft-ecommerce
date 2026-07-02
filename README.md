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
- [Cài đặt và cấu hình](#-cài-đặt-và-cấu-hình)
  - [1. Clone dự án](#1-clone-dự-án)
  - [2. Cài đặt Backend (Laravel)](#2-cài-đặt-backend-laravel)
  - [3. Cài đặt Frontend (React)](#3-cài-đặt-frontend-react)
- [Cấu hình biến môi trường](#-cấu-hình-biến-môi-trường)
- [Chạy dự án](#-chạy-dự-án)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Tính năng chính](#-tính-năng-chính)
- [API Overview](#-api-overview)

---

## 🌟 Tổng quan dự án

**Woodcraft** là nền tảng thương mại điện tử chuyên bán đồ gỗ và thủ công mỹ nghệ. Hệ thống bao gồm:

- 🛍️ **Cửa hàng trực tuyến**: Duyệt, tìm kiếm và mua sản phẩm đồ gỗ
- 🔐 **Xác thực**: Đăng nhập thông thường và đăng nhập qua Google OAuth
- 💳 **Thanh toán online**: Tích hợp VNPay và MoMo (Sandbox)
- 🤖 **Chatbot AI**: Hỗ trợ tư vấn sản phẩm qua OpenRouter API
- 🏷️ **Voucher & Khuyến mãi**: Hệ thống mã giảm giá
- ⭐ **Đánh giá sản phẩm**: Review và rating
- 🔔 **Thông báo**: Hệ thống notification realtime
- 📊 **Trang quản trị**: Dashboard cho admin quản lý đơn hàng, sản phẩm, người dùng

---

## 🛠️ Yêu cầu hệ thống

Trước khi cài đặt, hãy đảm bảo máy bạn đã cài đặt các phần mềm sau:

| Phần mềm | Phiên bản tối thiểu | Ghi chú |
|----------|---------------------|---------|
| **PHP** | 8.3+ | Cần có extension: `pdo`, `mbstring`, `openssl`, `tokenizer` |
| **Composer** | 2.x | Quản lý dependency PHP |
| **Node.js** | 18.x+ | Kèm theo npm |
| **MySQL** | 8.0+ | Hoặc SQLite cho môi trường dev |
| **Git** | Bất kỳ | Để clone dự án |

> 💡 **Khuyến nghị**: Sử dụng [Laragon](https://laragon.org/) (Windows) hoặc [Herd](https://herd.laravel.com/) để dễ dàng cài đặt môi trường PHP + MySQL.

---

## 🚀 Cài đặt và cấu hình

### 1. Clone dự án

```bash
# Clone repository về máy
git clone https://github.com/dqtung1703/woodcraft-ecommerce.git

# Di chuyển vào thư mục dự án
cd woodcraft-ecommerce
```

---

### 2. Cài đặt Backend (Laravel)

```bash
# Di chuyển vào thư mục backend
cd be
```

#### 2.1. Cài đặt PHP dependencies

```bash
composer install
```

#### 2.2. Tạo file cấu hình môi trường

```bash
# Sao chép file .env mẫu
cp .env.example .env

# Tạo application key
php artisan key:generate
```

#### 2.3. Cấu hình cơ sở dữ liệu

Mở file `be/.env` và chỉnh sửa thông tin kết nối database:

**Dùng MySQL:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=woodcraft_ecommerce
DB_USERNAME=root
DB_PASSWORD=your_password
```

**Dùng SQLite (cho môi trường phát triển nhanh):**
```env
DB_CONNECTION=sqlite
# Không cần cấu hình thêm
```

#### 2.4. Import Database

**Cách 1: Dùng file SQL có sẵn (khuyến nghị)**

```bash
# Đứng ở thư mục gốc dự án
# Import file SQL vào MySQL
mysql -u root -p woodcraft_ecommerce < woodcraft_ecommerce.sql
```

> ⚠️ Hãy tạo database `woodcraft_ecommerce` trước khi import:
> ```sql
> CREATE DATABASE woodcraft_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> ```

**Cách 2: Dùng migration (nếu không có file SQL)**

```bash
# Chạy migration
php artisan migrate

# (Tuỳ chọn) Seed dữ liệu mẫu
php artisan db:seed
```

#### 2.5. Tạo symbolic link cho storage

```bash
php artisan storage:link
```

---

### 3. Cài đặt Frontend (React)

```bash
# Quay lại thư mục gốc, sau đó vào thư mục frontend
cd ../fe

# Cài đặt Node.js dependencies
npm install
```

#### 3.1. Tạo file cấu hình môi trường Frontend

```bash
# Sao chép file .env mẫu
cp .env.example .env
```

Mở file `fe/.env` và kiểm tra URL API:

```env
VITE_APP_NAME=Woodcraft Ecommerce
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## ⚙️ Cấu hình biến môi trường

### Backend (`be/.env`)

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `APP_NAME` | Tên ứng dụng | `Woodcraft` |
| `APP_URL` | URL backend | `http://localhost:8000` |
| `APP_FRONTEND_URL` | URL frontend | `http://localhost:5173` |
| `DB_CONNECTION` | Loại database | `mysql` hoặc `sqlite` |
| `DB_DATABASE` | Tên database | `woodcraft_ecommerce` |
| `DB_USERNAME` | Username database | `root` |
| `DB_PASSWORD` | Password database | _(để trống nếu không có)_ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | _(lấy từ Google Cloud Console)_ |
| `OPENROUTER_API_KEY` | API Key chatbot AI | _(lấy từ openrouter.ai)_ |
| `VNPAY_TMN_CODE` | Mã VNPay | _(lấy từ VNPay sandbox)_ |
| `VNPAY_HASH_SECRET` | Secret VNPay | _(lấy từ VNPay sandbox)_ |
| `MOMO_PARTNER_CODE` | Partner code MoMo | _(lấy từ MoMo sandbox)_ |
| `MOMO_ACCESS_KEY` | Access key MoMo | _(lấy từ MoMo sandbox)_ |
| `MOMO_SECRET_KEY` | Secret key MoMo | _(lấy từ MoMo sandbox)_ |

### Frontend (`fe/.env`)

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `VITE_APP_NAME` | Tên ứng dụng hiển thị | `Woodcraft Ecommerce` |
| `VITE_API_BASE_URL` | Địa chỉ API backend | `http://localhost:8000/api/v1` |

---

## ▶️ Chạy dự án

### Chạy Backend

```bash
cd be

# Chạy development server (port 8000)
php artisan serve
```

Backend sẽ chạy tại: **http://localhost:8000**

### Chạy Frontend

Mở terminal mới:

```bash
cd fe

# Chạy development server (port 5173)
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

### (Tuỳ chọn) Chạy Queue Worker

Nếu sử dụng tính năng gửi email hoặc xử lý job nền:

```bash
cd be
php artisan queue:work
```

---

## 📁 Cấu trúc dự án

```
woodcraft-ecommerce/
├── be/                          # Backend - Laravel 13
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/     # API Controllers
│   │   │   ├── Middleware/      # Middleware xác thực
│   │   │   ├── Requests/        # Form Request validation
│   │   │   ├── Resources/       # API Resource transformers
│   │   │   └── Responses/       # Chuẩn hoá API response
│   │   ├── Models/              # Eloquent Models
│   │   ├── Services/            # Business logic
│   │   └── Repositories/        # Data access layer
│   ├── database/
│   │   ├── migrations/          # Database migrations
│   │   └── seeders/             # Database seeders
│   ├── routes/
│   │   └── api.php              # Định nghĩa API routes
│   └── .env.example             # Mẫu cấu hình môi trường
│
├── fe/                          # Frontend - React + TypeScript
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API service calls
│   │   │   └── apiClient.ts     # Axios client cấu hình
│   │   ├── hooks/               # Custom React hooks
│   │   ├── contexts/            # React Context providers
│   │   └── types/               # TypeScript type definitions
│   ├── public/                  # Static assets
│   └── .env.example             # Mẫu cấu hình môi trường
│
└── woodcraft_ecommerce.sql      # File SQL khởi tạo database
```

---

## ✨ Tính năng chính

### 👤 Người dùng (Customer)
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
- Xử lý đơn hàng và cập nhật trạng thái
- Quản lý người dùng và phân quyền
- Quản lý voucher khuyến mãi
- Xem báo cáo doanh thu qua Dashboard

---

## 🔌 API Overview

Base URL: `http://localhost:8000/api/v1`

| Nhóm | Mô tả | Xác thực |
|------|-------|----------|
| `/auth/*` | Đăng ký, đăng nhập, Google OAuth | Public |
| `/products/*` | Danh sách, chi tiết sản phẩm | Public |
| `/categories/*` | Danh mục sản phẩm | Public |
| `/cart/*` | Quản lý giỏ hàng | 🔒 Cần token |
| `/orders/*` | Tạo và xem đơn hàng | 🔒 Cần token |
| `/payments/*` | Thanh toán VNPay/MoMo | 🔒 Cần token |
| `/reviews/*` | Đánh giá sản phẩm | 🔒 Cần token |
| `/vouchers/*` | Kiểm tra mã giảm giá | 🔒 Cần token |
| `/admin/*` | Quản trị hệ thống | 🔒 Admin only |
| `/chatbot` | AI Chatbot | 🔒 Cần token |

> Xác thực sử dụng **Laravel Sanctum** — gửi token qua header:
> ```
> Authorization: Bearer {your_token}
> ```

---

## 🐛 Xử lý sự cố thường gặp

**Lỗi `APP_KEY` trống:**
```bash
cd be && php artisan key:generate
```

**Lỗi permission thư mục storage:**
```bash
cd be && chmod -R 775 storage bootstrap/cache
```

**Frontend không kết nối được API:**
- Kiểm tra `VITE_API_BASE_URL` trong `fe/.env` trỏ đúng địa chỉ backend
- Đảm bảo backend đang chạy tại cổng `8000`

**Lỗi CORS:**
- Kiểm tra `APP_FRONTEND_URL` trong `be/.env` trỏ đúng địa chỉ frontend

---

## 📄 Giấy phép

Dự án này được phát triển cho mục đích học tập và nghiên cứu.

---

<p align="center">Made with ❤️ by Woodcraft Team</p>
