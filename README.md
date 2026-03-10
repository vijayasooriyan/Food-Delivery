# 🍔 Food Delivery App

A full-stack food delivery web application with a customer-facing frontend, an admin dashboard, and a Node.js backend API.

## 🌐 Live Demo

| App | URL |
|-----|-----|
| **Frontend** | [food-delivery-lime-ten.vercel.app](https://food-delivery-lime-ten.vercel.app) |
| **Admin Panel** | [food-delivery-1ku6.vercel.app](https://food-delivery-1ku6.vercel.app) |

## ✨ Features

### Customer Frontend
- Browse food items by category
- Search food items across the catalog
- Add/remove items to cart with real-time updates
- User registration and login (JWT authentication)
- Place orders with delivery address
- Online payment via Stripe
- Track order history and payment status
- Dark mode toggle with persistence

### Admin Dashboard
- Add new food items with image upload
- View and manage all food listings
- Monitor customer orders
- Update order status (Processing → Out for Delivery → Delivered)
- Toast notifications for actions

### Backend API
- RESTful API with Express.js
- JWT-based authentication
- Secure password hashing with bcrypt
- Image upload with Multer
- Stripe payment integration
- MongoDB database with Mongoose ODM

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React, React Router, Axios, Vite |
| **Admin** | React, React Router, React-Toastify, Axios, Vite |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Authentication** | JWT, Bcrypt |
| **Payments** | Stripe |
| **File Upload** | Multer |
| **Deployment** | Vercel (Frontend/Admin), Render (Backend) |

## 📁 Project Structure

```
Food-Delivery/
├── frontend/          # Customer-facing React app
│   └── src/
│       ├── components/   # Navbar, Header, FoodDisplay, LoginPopup, etc.
│       ├── pages/        # Home, Cart, PlaceOrder, MyOrders, Verify
│       ├── context/      # StoreContext (global state)
│       └── assets/
├── admin/             # Admin dashboard React app
│   └── src/
│       ├── components/   # Navbar, Sidebar
│       └── pages/        # Add, List, Orders
├── backend/           # Express.js API server
│   ├── config/           # Database connection
│   ├── controllers/      # User, Food, Cart, Order logic
│   ├── middleware/        # JWT auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   └── uploads/          # Food images
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Stripe account (for payments)

### 1. Clone the repository
```bash
git clone https://github.com/vijayasooriyan/Food-Delivery.git
cd Food-Delivery
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run server
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Setup Admin Panel
```bash
cd admin
npm install
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/user/register` | Register a new user | No |
| POST | `/api/user/login` | Login user | No |
| GET | `/api/food/list` | Get all food items | No |
| POST | `/api/food/add` | Add a food item | No |
| POST | `/api/food/remove` | Remove a food item | No |
| POST | `/api/cart/add` | Add item to cart | Yes |
| POST | `/api/cart/remove` | Remove item from cart | Yes |
| POST | `/api/cart/get` | Get cart data | Yes |
| POST | `/api/order/place` | Place an order | Yes |
| POST | `/api/order/verify` | Verify payment | No |
| POST | `/api/order/userorders` | Get user's orders | Yes |
| GET | `/api/order/list` | List all orders (admin) | No |
| POST | `/api/order/status` | Update order status | No |

## 📄 License

This project is for educational purposes.
