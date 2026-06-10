# UniAdmit System — Backend

[![Node.js](https://img.shields.io/badge/node-%3E%3D%2020-brightgreen.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

REST API backend cho **hệ thống tuyển sinh đại học UniAdmit** — xử lý xác thực, hồ sơ thí sinh, nguyện vọng, điểm số, thanh toán, diễn đàn và quản trị.

---

## 📋 Mục lục

- [Kiến trúc & Tech stack](#-kiến-trúc--tech-stack)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Chạy nhanh bằng Docker](#-chạy-nhanh-bằng-docker-khuyến-nghị)
- [Chạy thủ công (không Docker)](#-chạy-thủ-công-không-docker)
- [Biến môi trường](#-biến-môi-trường)
- [Lệnh thường dùng](#-lệnh-thường-dùng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Tài liệu API](#-tài-liệu-api)
- [Xử lý lỗi thường gặp](#-xử-lý-lỗi-thường-gặp)

---

## 🧱 Kiến trúc & Tech stack

| Thành phần | Công nghệ |
| --- | --- |
| Runtime | Node.js 20 |
| Framework | Express |
| Transpile | Babel (ES modules → CommonJS) |
| Dev reload | nodemon |
| Database | MongoDB (Atlas hoặc self-hosted) |
| Auth | JWT + refresh token (httpOnly cookie) + OTP qua email |
| Mail | Brevo API (transactional) |
| Realtime | SSE (Server-Sent Events) cho notification |
| Storage | Local file system (`public/uploads`, `private/`) |
| Payment | PayOS |
| API docs | Swagger UI tại `/docs` |

---

## ✅ Yêu cầu hệ thống

- **Có Docker**: chỉ cần Docker Desktop (Windows/macOS) hoặc Docker Engine + Docker Compose (Linux). Không cần cài Node.
- **Không có Docker**: Node.js ≥ 20, npm/yarn, MongoDB (hoặc connection string tới MongoDB Atlas).

---

## 🐳 Chạy nhanh bằng Docker (khuyến nghị)

### Bước 1 — Clone repo

```bash
git clone https://github.com/nguyenkhacbao206/UniAdmit_System_Backend.git
cd UniAdmit_System_Backend
```

### Bước 2 — Tạo file `.env`

Copy template và điền giá trị:

```bash
cp .env.example .env
```

Mở `.env` và điền tối thiểu các biến sau (xem chi tiết ở [phần dưới](#-biến-môi-trường)):

```env
HOST=0.0.0.0
PORT=8082
APP_NAME=UniAdmit System
APP_URL_API=http://localhost:8082
APP_URL_CLIENT=http://localhost:8000
OTHER_URLS_CLIENT=["http://localhost:8000","http://localhost:3000"]

SECRET_KEY=<thay-bằng-chuỗi-bí-mật-32-ký-tự>

# MongoDB Atlas (khuyến nghị) — tạo cluster miễn phí tại https://cloud.mongodb.com
DB_HOST=cluster0.xxxxx.mongodb.net
DB_PORT=
DB_USERNAME=<atlas-username>
DB_PASSWORD=<atlas-password>
DB_NAME=UniAdmit_System
DB_AUTH_SOURCE=admin

# Mail — Brevo API key, tạo tại https://app.brevo.com/settings/keys/api
BREVO_API_KEY=<brevo-api-key>
MAIL_FROM_ADDRESS=no-reply@yourdomain.com
MAIL_FROM_NAME=UniAdmit System
```

### Bước 3 — Build và chạy container

```bash
docker compose up -d --build
```

Backend sẽ chạy tại `http://localhost:8082`. Kiểm tra:

```bash
curl http://localhost:8082/user/forum/trending
```

→ Trả về JSON `{"success":true, "message":"…", "data":[…]}` là OK.

### Bước 4 — Seed dữ liệu khởi tạo (lần đầu)

Tạo tài khoản admin mặc định + dữ liệu cơ sở:

```bash
docker compose exec backend npm run seed
```

### Lệnh Docker thường dùng

```bash
# Xem log realtime
docker compose logs -f backend

# Restart
docker compose restart backend

# Dừng + xóa container (giữ lại volume)
docker compose down

# Dừng + xóa cả volume (mất hết dữ liệu local)
docker compose down -v

# Vào shell trong container
docker compose exec backend sh

# Rebuild khi đổi code
docker compose up -d --build
```

### Lưu ý về volume

`docker-compose.yml` mount:
- `./private` → `/app/private` — log, cache, backup.
- `./public/uploads` → `/app/public/uploads` — file user upload (avatar, CV, minh chứng).

Dữ liệu trong các thư mục này **được giữ lại** khi `docker compose down`. Để xóa hoàn toàn, dùng `docker compose down -v` hoặc xóa thư mục thủ công.

---

## 🛠 Chạy thủ công (không Docker)

Phù hợp khi muốn dev với hot-reload (nodemon).

```bash
# 1. Clone + cài dependency
git clone https://github.com/nguyenkhacbao206/UniAdmit_System_Backend.git
cd UniAdmit_System_Backend
npm install

# 2. Tạo .env (xem mục Biến môi trường)
cp .env.example .env
# … chỉnh sửa .env …

# 3. Seed dữ liệu (chỉ lần đầu)
npm run seed

# 4. Chạy dev server (nodemon, tự reload khi code đổi)
npm start
```

Server lên ở `http://localhost:8082` (hoặc port trong `.env`).

### Build production thủ công

```bash
npm run build      # transpile src/ → build/
node build/main.js # chạy bản đã build
```

---

## 🔧 Biến môi trường

Mở file `.env` để cấu hình. Các nhóm chính:

### Server

| Biến | Mô tả | Ví dụ |
| --- | --- | --- |
| `HOST` | Host bind | `0.0.0.0` |
| `PORT` | Port bind | `8082` |
| `APP_URL_API` | URL public của BE | `http://localhost:8082` |
| `APP_URL_CLIENT` | URL FE chính | `http://localhost:8000` |
| `OTHER_URLS_CLIENT` | JSON array các URL FE khác được phép CORS | `["http://localhost:3000"]` |

### Bảo mật

| Biến | Mô tả |
| --- | --- |
| `SECRET_KEY` | Khóa ký JWT — **bắt buộc đổi** trên production |
| `ACCESS_TOKEN_EXPIRE` | TTL access token | `15m` |
| `REFRESH_TOKEN_EXPIRE_IN` | TTL refresh token | `7d` |
| `REQUESTS_LIMIT_PER_MINUTE` | Rate limit | `1000` |

### Database (MongoDB)

| Biến | Mô tả |
| --- | --- |
| `DB_HOST` | Host MongoDB. Để rỗng `DB_PORT` nếu dùng Atlas (SRV record). |
| `DB_PORT` | Port MongoDB. Trống nếu Atlas. |
| `DB_USERNAME` / `DB_PASSWORD` | Credentials |
| `DB_NAME` | Tên database |
| `DB_AUTH_SOURCE` | Auth source, thường `admin` |

### Mail (Brevo)

| Biến | Mô tả |
| --- | --- |
| `BREVO_API_KEY` | API key Brevo |
| `MAIL_FROM_ADDRESS` | Email gửi từ |
| `MAIL_FROM_NAME` | Tên hiển thị người gửi |

### Tích hợp khác (optional)

| Biến | Mô tả |
| --- | --- |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | Đăng nhập Google |
| `PAYOS_CLIENT_ID` / `PAYOS_API_KEY` / `PAYOS_CHECKSUM_KEY` | Thanh toán PayOS |

---

## 📜 Lệnh thường dùng

```bash
npm start         # Dev mode (nodemon, hot reload, lint trên mỗi lần save)
npm run seed      # Seed admin/staff/dữ liệu mẫu
npm run build     # Transpile src/ → build/
npm run lint      # Kiểm tra eslint
npm run lint:fix  # Auto-fix lỗi eslint
```

---

## 📁 Cấu trúc thư mục

```
src/
├── app/
│   ├── controllers/    # Xử lý request/response
│   ├── services/       # Business logic
│   ├── middleware/     # globalAuth, validate, role checks
│   └── requests/       # Schema validate input
├── configs/            # MongoDB, mailer, cache, swagger
├── handlers/           # CORS, error, response helpers
├── models/             # Mongoose schemas
├── routes/             # Định nghĩa endpoint
│   ├── admin/
│   ├── staff/
│   └── user/
├── views/              # EJS template (email)
├── scripts/            # Script utilities (migration, fix data)
├── seeders/            # Seed data
└── main.js             # Entry point

public/uploads/         # File user upload (mount volume Docker)
private/                # Log + cache (mount volume Docker)
```

---

## 📖 Tài liệu API

Sau khi BE chạy, mở Swagger UI:

```
http://localhost:8082/docs
```

Có sẵn:
- Schema body / response
- Mô tả từng endpoint theo nhóm (User Auth, Staff Forum, Admin University, …)
- Nút "Try it out" để test trực tiếp

---

## 🐛 Xử lý lỗi thường gặp

### Lỗi `querySrv ECONNREFUSED _mongodb._tcp.cluster0.…`

ISP / mạng nội bộ chặn SRV record của MongoDB Atlas. Cách fix:

- **Local (Docker hoặc node)**: BE đã tự `dns.setServers(['8.8.8.8', '1.1.1.1'])` trong dev mode (xem `src/configs/mongodb.js`). Nếu vẫn lỗi → set thủ công DNS Wi-Fi máy bạn về 8.8.8.8.
- **Production**: dùng Atlas standard connection string với 3 shard hostnames thay vì SRV.

### CORS bị chặn

Thêm origin FE vào `.env`:

```env
APP_URL_CLIENT=https://your-frontend.com
OTHER_URLS_CLIENT=["https://staging.your-frontend.com","http://localhost:8000"]
```

Hoặc nếu deploy FE lên Netlify/Vercel/Cloudflare Pages, CORS handler đã tự whitelist regex `*.netlify.app`, `*.vercel.app`, `*.pages.dev` — không cần thêm thủ công.

### Mail không gửi được

- Kiểm tra `BREVO_API_KEY` đúng và còn quota.
- `MAIL_FROM_ADDRESS` phải là email đã verify trên Brevo (Sender Identity).
- Xem log: `docker compose logs -f backend | grep MAIL`.

### Port 8082 đã bị chiếm

```bash
# Windows
netstat -ano | findstr :8082
taskkill /PID <pid> /F

# Linux/macOS
lsof -i :8082
kill -9 <pid>
```

Hoặc đổi port trong `.env`:

```env
PORT=8083
APP_URL_API=http://localhost:8083
```

Và sửa `docker-compose.yml`:

```yaml
ports:
  - "8083:8083"
```

### Cần reset toàn bộ DB local

```bash
docker compose down -v
rm -rf private/ public/uploads/*
docker compose up -d --build
docker compose exec backend npm run seed
```

---

## 🤝 Đóng góp

PR và issue được chào đón. Trước khi gửi PR:

1. Tạo branch từ `development`.
2. Chạy `npm run lint:fix` để format code.
3. Mô tả rõ thay đổi trong commit message.

---

## 📝 License

MIT © 2026 [Nguyễn Khắc Bảo](https://github.com/nguyenkhacbao206) và cộng sự.
