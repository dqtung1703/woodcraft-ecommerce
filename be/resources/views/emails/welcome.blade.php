<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chào mừng đến với Woodcraft</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #f5f0eb;
            margin: 0;
            padding: 0;
            color: #3d2b1f;
        }
        .wrapper {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .header {
            background: linear-gradient(135deg, #6b3f1f 0%, #a0522d 100%);
            padding: 40px 32px;
            text-align: center;
        }
        .header h1 {
            color: #fff;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .header p {
            color: #f5d9c0;
            margin: 8px 0 0;
            font-size: 14px;
        }
        .body {
            padding: 40px 32px;
        }
        .body h2 {
            color: #6b3f1f;
            margin-top: 0;
            font-size: 22px;
        }
        .body p {
            line-height: 1.7;
            font-size: 15px;
            color: #5a4a3a;
        }
        .features {
            background: #fdf6f0;
            border-radius: 8px;
            padding: 20px 24px;
            margin: 24px 0;
        }
        .features ul {
            margin: 0;
            padding-left: 20px;
        }
        .features li {
            margin-bottom: 10px;
            font-size: 14px;
            color: #5a4a3a;
        }
        .cta-btn {
            display: inline-block;
            background: linear-gradient(135deg, #6b3f1f 0%, #a0522d 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            margin: 8px 0 24px;
        }
        .footer {
            background: #f5f0eb;
            padding: 20px 32px;
            text-align: center;
            font-size: 12px;
            color: #9e8878;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>🪵 Woodcraft</h1>
            <p>Nội thất gỗ thủ công cao cấp</p>
        </div>

        <div class="body">
            <h2>Xin chào, {{ $name }}! 👋</h2>

            <p>
                Cảm ơn bạn đã đăng ký tài khoản tại <strong>Woodcraft</strong> — nơi hội tụ
                những sản phẩm nội thất gỗ thủ công được chế tác tỉ mỉ, mang vẻ đẹp tự nhiên
                vào không gian sống của bạn.
            </p>

            <div class="features">
                <strong style="color:#6b3f1f;">Tài khoản của bạn cho phép:</strong>
                <ul>
                    <li>🛍️ Mua sắm dễ dàng và theo dõi đơn hàng</li>
                    <li>🎁 Nhận voucher ưu đãi độc quyền</li>
                    <li>⭐ Viết đánh giá sản phẩm sau khi nhận hàng</li>
                    <li>🤖 Tư vấn sản phẩm qua Chatbot AI 24/7</li>
                </ul>
            </div>

            <p>Hãy bắt đầu khám phá bộ sưu tập ngay hôm nay!</p>

            <a href="{{ $shopUrl }}" class="cta-btn">Khám phá ngay →</a>

            <p style="font-size:13px; color:#9e8878;">
                Đây là email được gửi tự động tới <strong>{{ $email }}</strong>.
                Vui lòng không trả lời email này.
            </p>
        </div>

        <div class="footer">
            © {{ date('Y') }} Woodcraft. Tất cả quyền được bảo lưu.<br>
            <a href="{{ $shopUrl }}" style="color:#a0522d;">Trang chủ</a>
        </div>
    </div>
</body>
</html>
