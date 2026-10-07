# FoodWeb — Website đặt đồ ăn (Node.js + Express + express-handlebars, mô hình MVC)

Đồ án: Xây dựng website động đặt đồ ăn, đáp ứng đầy đủ yêu cầu:
- Trang chủ, trang chi tiết sản phẩm, đăng nhập, đăng ký, quản trị trang web, giỏ hàng
- Chức năng: thêm / sửa / xoá sản phẩm (admin), đăng nhập, đăng ký, mua hàng
- Giao diện **responsive** (dùng CSS Grid/Flexbox + media query)
- Dùng thư viện view **express-handlebars**
- Tổ chức code theo mô hình **MVC** (Model – View – Controller)

## 1. Cấu trúc thư mục (MVC)

```
foodweb/
├── server.js              # Điểm khởi động ứng dụng, cấu hình Express
├── models/                 # M - truy xuất & xử lý dữ liệu (Product, User, Order)
├── views/                  # V - giao diện .handlebars (layouts, partials, pages, admin/)
├── controllers/            # C - xử lý logic nghiệp vụ cho từng route
├── routes/                 # Định tuyến, gọi tới controller tương ứng
├── middlewares/            # Middleware xác thực đăng nhập / phân quyền admin
├── utils/                  # Hàm dùng chung: đọc/ghi JSON (giả lập DB), seed dữ liệu mẫu
├── data/                   # "Cơ sở dữ liệu" dạng file JSON (users, products, orders)
└── public/                 # File tĩnh: css, js, ảnh upload
```

> Dự án dùng **file JSON làm cơ sở dữ liệu** (không cần cài đặt MongoDB/MySQL) để bạn có thể chạy ngay và dễ deploy lên hosting miễn phí. Toàn bộ thao tác CRUD vẫn đi qua lớp Model (`models/Product.js`, `models/User.js`, `models/Order.js`) giống hệt khi dùng CSDL thật — nếu sau này muốn đổi sang MongoDB, bạn chỉ cần sửa lại các hàm trong `models/`, phần route/controller giữ nguyên.

## 2. Cài đặt & chạy thử trên máy

Yêu cầu: đã cài **Node.js** (>= 18) — tải tại https://nodejs.org

```bash
cd foodweb
npm install
npm start
```

Mở trình duyệt: **http://localhost:3000**

Tài khoản quản trị có sẵn (được tạo tự động khi chạy lần đầu):
```
Tên đăng nhập: admin
Mật khẩu:      admin123
```
Vào `http://localhost:3000/admin` sau khi đăng nhập bằng tài khoản trên để quản lý sản phẩm & đơn hàng.

Bạn cũng có thể tự đăng ký tài khoản khách hàng mới ở trang `/register`.

## 3. Các chức năng chính

| Chức năng | Route | Ghi chú |
|---|---|---|
| Trang chủ, tìm kiếm, lọc theo danh mục | `GET /` | |
| Chi tiết sản phẩm | `GET /product/:id` | |
| Đăng ký | `GET/POST /register` | Mật khẩu được băm (hash) bằng `crypto.scrypt`, không lưu plain text |
| Đăng nhập / Đăng xuất | `GET/POST /login`, `GET /logout` | Dùng session (`express-session`) |
| Giỏ hàng (thêm/sửa số lượng/xoá) | `GET/POST /cart/*` | Lưu trong session |
| Đặt hàng (mua hàng) | `POST /cart/checkout` | Yêu cầu đăng nhập, tạo đơn hàng mới |
| Trang quản trị (chỉ admin) | `GET /admin` | Middleware `isAdmin` chặn user thường |
| Quản lý sản phẩm (thêm/sửa/xoá, upload ảnh) | `/admin/products/*` | Dùng `multer` để upload ảnh |
| Quản lý đơn hàng, đổi trạng thái | `/admin/orders/*` | |

## 4. Responsive

Giao diện co giãn tốt trên điện thoại/tablet/desktop nhờ CSS Grid tự động chia cột (`auto-fill`) và các `@media` query trong `public/css/style.css` (ẩn/rút gọn navbar, chuyển bảng giỏ hàng thành dạng thẻ trên màn hình nhỏ, sidebar admin chuyển thành thanh ngang...).

## 5. Đẩy lên hosting (deploy) — hướng dẫn nhanh với Render.com (miễn phí)

1. Tạo repository trên GitHub, đẩy toàn bộ thư mục `foodweb` này lên (nhớ đã có sẵn `.gitignore` bỏ qua `node_modules`).
2. Vào https://render.com → đăng ký/đăng nhập bằng GitHub.
3. Chọn **New → Web Service**, kết nối tới repo vừa tạo.
4. Cấu hình:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Bấm **Create Web Service** — Render sẽ tự build và cấp cho bạn một domain dạng `https://ten-app.onrender.com`.

> Lưu ý: vì dữ liệu lưu ở file JSON trong thư mục `data/`, trên các hosting miễn phí (Render free tier) ổ đĩa có thể bị reset khi container khởi động lại — phù hợp để demo/báo cáo. Nếu cần lưu dữ liệu vĩnh viễn khi deploy thật, nên thay lớp Model bằng MongoDB Atlas (miễn phí) mà không cần đổi cấu trúc route/controller.

Các nền tảng tương tự cũng dùng được: Railway.app, Cyclic, Vercel (cần điều chỉnh cho serverless), hoặc VPS riêng.

## 6. Ghi chú kỹ thuật

- View engine: **express-handlebars**, layout mặc định `main`, có thêm layout `auth` (trang đăng nhập/đăng ký) và `admin` (trang quản trị).
- Helper Handlebars tự định nghĩa: `formatCurrency`, `multiply`, `ifEquals`.
- Ảnh sản phẩm mẫu lấy từ `picsum.photos` (cần internet khi xem trang chủ); nếu ảnh lỗi/không có mạng sẽ tự động hiện ảnh thay thế `public/images/no-image.svg`.
- Mật khẩu người dùng được băm bằng `crypto.scryptSync` kèm salt ngẫu nhiên, không lưu mật khẩu dạng thô.
"# foodweb" 
