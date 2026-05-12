# UniAdmit System - Backend

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2020-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Hệ thống quản lý tuyển sinh đại học - Phần Backend (API). Cung cấp các dịch vụ xác thực, quản lý hồ sơ, điểm số và nguyện vọng cho thí sinh, cán bộ và quản trị viên.

---

## 🚀 Tính năng nổi bật

- **Xác thực tập trung (Unified Auth):** Sử dụng `globalAuth` cho mọi vai trò (Admin, Staff, User).
- **Phân quyền dựa trên vai trò (RBAC):** Kiểm soát truy cập chặt chẽ.
- **Xác thực OTP:** Đăng ký và đăng nhập bảo mật qua Email OTP.
- **Tài liệu API (Swagger):** Tự động tạo tài liệu API tại `/docs`.
- **Quản lý dữ liệu:** Xử lý hồ sơ thí sinh, bảng điểm học bạ, và danh sách nguyện vọng.

---

## 🛠️ Yêu cầu hệ thống

- **Node.js**: Phiên bản 20 trở lên.
- **MongoDB**: Đã được cài đặt và đang chạy.

---

## ⚙️ Hướng dẫn cài đặt

### 1. Clone Project
```bash
git clone https://github.com/nguyenkhacbao206/UniAdmit_System_Backend.git
cd UniAdmit-System-Backend
```

### 2. Cấu hình môi trường
Tạo file `.env` từ file mẫu `.env.example` và điều chỉnh các thông số:

```bash
cp .env.example .env
```

**Các tham số quan trọng:**

| Biến môi trường | Mô tả |
| :--- | :--- |
| `APP_URL_API` | URL của Server API (mặc định: http://localhost:3456) |
| `SECRET_KEY` | Khóa bí mật để ký JWT (Cần thay đổi) |
| `DB_NAME` | Tên cơ sở dữ liệu MongoDB |
| `MAIL_USERNAME` | Email gửi OTP (Gmail khuyến nghị) |
| `MAIL_PASSWORD` | Mật khẩu ứng dụng của Email |

### 3. Cài đặt thư viện
```bash
npm install
```

### 4. Khởi tạo dữ liệu (Seeding)
Chạy lệnh này để tạo tài khoản Admin mặc định và các dữ liệu cơ sở:
```bash
npm run seed
```

---

## 🏃 Chế độ chạy ứng dụng

### Chế độ Phát triển (Development)
Sử dụng `nodemon` để tự động reload khi code thay đổi:
```bash
npm run dev
```

### Chế độ Sản xuất (Production)
```bash
# Build code sang JavaScript thuần
npm run build

# Chạy ứng dụng đã build
npm start
```

---

<!-- ## 🔐 Tài khoản mặc định (Sau khi Seed)

| Vai trò | Số điện thoại | Mật khẩu |
| :--- | :--- | :--- |
| **Quản trị viên** | `0987654321` | `Z3ntSoft@D3v` |

--- -->

## 📖 Tài liệu API
Sau khi chạy ứng dụng, bạn có thể truy cập Swagger UI tại:
`http://localhost:3456/docs`

---

## 🤝 Liên hệ & Hỗ trợ
Phát triển bởi [Nguyễn Khắc Bảo](https://github.com/nguyenkhacbao206) và cộng sự.

© 2026 UniAdmit System. All rights reserved.