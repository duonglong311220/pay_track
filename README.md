# PayTrack - Ứng dụng Quản lý Chi tiêu

Ứng dụng quản lý chi tiêu cá nhân hàng tháng dành cho đa người dùng, được xây dựng với các công nghệ hiện đại.

## 🚀 Công nghệ sử dụng

- **ReactJS 18** - Thư viện UI
- **TypeScript** - Type-safe JavaScript
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **JSON Server** - Fake REST API
- **Vite** - Build tool

## 📁 Cấu trúc dự án

```
src/
├── components/          # Các component tái sử dụng
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard widgets
│   ├── Layout/         # Layout components
│   ├── Transaction/    # Transaction components
│   └── UI/             # UI components (Button, Input, Card, etc.)
├── pages/              # Các trang của ứng dụng
├── services/           # API services
├── store/              # Redux store và slices
│   └── slices/         # Redux slices
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## ✨ Tính năng

### 👤 Quản lý người dùng
- Đăng ký tài khoản mới
- Đăng nhập / Đăng xuất
- Cập nhật thông tin cá nhân
- Đổi mật khẩu

### 💰 Quản lý giao dịch
- Thêm giao dịch thu nhập / chi tiêu
- Xem danh sách giao dịch
- Lọc theo tháng, loại giao dịch
- Tìm kiếm giao dịch
- Chỉnh sửa / Xóa giao dịch

### 📊 Dashboard
- Tổng quan thu nhập, chi tiêu, số dư
- Biểu đồ chi tiêu theo danh mục
- Theo dõi ngân sách

### 💵 Quản lý ngân sách
- Đặt ngân sách cho từng danh mục
- Theo dõi tiến độ chi tiêu
- Cảnh báo vượt ngân sách

### 📂 Danh mục
- 8 danh mục chi tiêu (Ăn uống, Di chuyển, Mua sắm, Giải trí, Hóa đơn, Y tế, Giáo dục, Khác)
- 4 danh mục thu nhập (Lương, Thưởng, Đầu tư, Thu nhập khác)

## 🛠️ Cài đặt

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn

### Các bước cài đặt

1. **Clone repository**
```bash
cd PayTrack
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Chạy JSON Server (API)**
```bash
npm run server
```
Server sẽ chạy tại: http://localhost:3001

4. **Chạy ứng dụng (terminal khác)**
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: http://localhost:5173

## 📝 Scripts

```bash
npm run dev       # Chạy development server
npm run build     # Build production
npm run preview   # Preview production build
npm run server    # Chạy JSON Server
npm run lint      # Kiểm tra linting
```

## 🔐 Tài khoản demo

| Email | Mật khẩu |
|-------|----------|
| admin@paytrack.com | admin123 |
| user@paytrack.com | user123 |

## 📱 Responsive Design

Ứng dụng được thiết kế responsive, hoạt động tốt trên:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 🎨 Giao diện

- Theme màu xanh dương chủ đạo
- Sidebar navigation (ẩn trên mobile)
- Dark/Light cards
- Animations mượt mà
- Icons từ React Icons (Feather Icons)

## 📄 License

MIT License

---

**PayTrack** - Quản lý chi tiêu thông minh 💰

