# SneakerHub - E-Commerce Platform Architecture

## 📐 System Architecture Overview

### Technology Stack

#### Backend
- **Framework**: Spring Boot 3.2.x
- **Language**: Java 17+
- **Security**: Spring Security + JWT
- **OAuth**: Google OAuth 2.0
- **Payment**: Razorpay Integration
- **Database**: MySQL 8.0+
- **ORM**: Spring Data JPA (Hibernate)
- **Build Tool**: Maven
- **API Documentation**: Swagger/OpenAPI

#### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API + Hooks
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Yup/Zod
- **UI Components**: Custom components with Tailwind

### Project Structure

```
SNEAKERS/
├── backend/                          # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/sneakerhub/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── JwtConfig.java
│   │   │   │   │   ├── OAuth2Config.java
│   │   │   │   │   └── CorsConfig.java
│   │   │   │   ├── controller/      # REST Controllers
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── ProductController.java
│   │   │   │   │   ├── OrderController.java
│   │   │   │   │   ├── UserController.java
│   │   │   │   │   └── PaymentController.java
│   │   │   │   ├── service/         # Business Logic
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── ProductService.java
│   │   │   │   │   ├── OrderService.java
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   └── PaymentService.java
│   │   │   │   ├── repository/      # Data Access Layer
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── ProductRepository.java
│   │   │   │   │   ├── OrderRepository.java
│   │   │   │   │   └── CartRepository.java
│   │   │   │   ├── model/           # Entity Classes
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Product.java
│   │   │   │   │   ├── Order.java
│   │   │   │   │   ├── OrderItem.java
│   │   │   │   │   ├── Cart.java
│   │   │   │   │   └── CartItem.java
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   │   ├── request/
│   │   │   │   │   └── response/
│   │   │   │   ├── security/        # Security Components
│   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   │   └── OAuth2SuccessHandler.java
│   │   │   │   ├── exception/       # Exception Handling
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   └── CustomExceptions.java
│   │   │   │   └── util/            # Utility Classes
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── application-dev.yml
│   │   └── test/                    # Unit & Integration Tests
│   └── pom.xml
│
├── frontend/                         # React Application
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Images, fonts, etc.
│   │   ├── components/              # Reusable Components
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Card.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── GoogleLoginButton.jsx
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductList.jsx
│   │   │   │   └── ProductDetail.jsx
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   └── CartSummary.jsx
│   │   │   └── admin/
│   │   │       ├── ProductForm.jsx
│   │   │       └── OrderManagement.jsx
│   │   ├── pages/                   # Page Components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       └── ProductManagement.jsx
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── hooks/                   # Custom Hooks
│   │   │   ├── useAuth.js
│   │   │   └── useCart.js
│   │   ├── services/                # API Services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   └── paymentService.js
│   │   ├── utils/                   # Utility Functions
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   ├── routes/                  # Route Configuration
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── ARCHITECTURE.md                   # This file
```

## 🔐 Security Architecture

### Authentication Flow
1. **JWT-based Authentication**
   - User registers/logs in → Server generates JWT token
   - Token stored in localStorage/httpOnly cookie
   - Token sent in Authorization header for protected routes

2. **Google OAuth Flow**
   - User clicks "Login with Google"
   - Redirected to Google OAuth consent screen
   - Google returns authorization code
   - Backend exchanges code for user info
   - Server creates/updates user and returns JWT

### Authorization (Role-Based Access Control)
- **USER**: Browse products, manage cart, place orders
- **OWNER**: All USER permissions + manage own products
- **ADMIN**: Full system access, user management, all products

## 💳 Payment Integration

### Razorpay Flow
1. User proceeds to checkout
2. Frontend requests order creation from backend
3. Backend creates Razorpay order and returns order_id
4. Frontend opens Razorpay checkout modal
5. User completes payment
6. Razorpay sends webhook to backend
7. Backend verifies signature and updates order status

## 🗄️ Database Schema

### Core Entities

#### Users
- id (PK)
- email (unique)
- password (hashed)
- firstName
- lastName
- role (ENUM: USER, OWNER, ADMIN)
- provider (LOCAL, GOOGLE)
- providerId
- createdAt
- updatedAt

#### Products
- id (PK)
- name
- description
- brand
- price
- discountPrice
- category
- sizes (JSON/separate table)
- colors (JSON/separate table)
- imageUrls (JSON)
- stock
- ownerId (FK → Users)
- createdAt
- updatedAt

#### Orders
- id (PK)
- userId (FK → Users)
- orderNumber (unique)
- totalAmount
- status (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)
- paymentId
- razorpayOrderId
- shippingAddress (JSON)
- createdAt
- updatedAt

#### OrderItems
- id (PK)
- orderId (FK → Orders)
- productId (FK → Products)
- quantity
- price
- size
- color

#### Cart
- id (PK)
- userId (FK → Users)
- createdAt
- updatedAt

#### CartItems
- id (PK)
- cartId (FK → Cart)
- productId (FK → Products)
- quantity
- size
- color

## 📡 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login with credentials
- POST `/api/auth/google` - Google OAuth login
- GET `/api/auth/me` - Get current user
- POST `/api/auth/refresh` - Refresh JWT token

### Products
- GET `/api/products` - Get all products (public)
- GET `/api/products/{id}` - Get product by ID (public)
- POST `/api/products` - Create product (OWNER, ADMIN)
- PUT `/api/products/{id}` - Update product (OWNER, ADMIN)
- DELETE `/api/products/{id}` - Delete product (OWNER, ADMIN)
- GET `/api/products/search` - Search products

### Cart
- GET `/api/cart` - Get user's cart (authenticated)
- POST `/api/cart/items` - Add item to cart
- PUT `/api/cart/items/{id}` - Update cart item
- DELETE `/api/cart/items/{id}` - Remove cart item
- DELETE `/api/cart` - Clear cart

### Orders
- POST `/api/orders` - Create order (authenticated)
- GET `/api/orders` - Get user's orders
- GET `/api/orders/{id}` - Get order details
- PUT `/api/orders/{id}/status` - Update order status (ADMIN)

### Payment
- POST `/api/payment/create-order` - Create Razorpay order
- POST `/api/payment/verify` - Verify payment signature
- POST `/api/payment/webhook` - Razorpay webhook

### Admin
- GET `/api/admin/users` - Get all users (ADMIN)
- PUT `/api/admin/users/{id}/role` - Update user role (ADMIN)
- GET `/api/admin/orders` - Get all orders (ADMIN)

## 🎨 Frontend Architecture

### State Management
- **AuthContext**: User authentication state, login/logout functions
- **CartContext**: Cart items, add/remove/update functions
- **Local Component State**: Form inputs, UI toggles

### Routing Structure
```
/ → Home (public)
/products → Product listing (public)
/products/:id → Product details (public)
/login → Login page (public)
/register → Register page (public)
/cart → Shopping cart (authenticated)
/checkout → Checkout page (authenticated)
/orders → User orders (authenticated)
/admin/dashboard → Admin dashboard (ADMIN only)
/admin/products → Product management (OWNER, ADMIN)
```

### Responsive Design Strategy
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Hamburger menu for mobile navigation
- Grid layouts that adapt to screen size

## 🚀 Development Workflow

### Phase 1: Backend Foundation
1. Initialize Spring Boot project
2. Configure database and JPA
3. Implement entity models
4. Create repositories

### Phase 2: Security & Authentication
1. Configure Spring Security
2. Implement JWT authentication
3. Add Google OAuth integration
4. Create auth endpoints

### Phase 3: Core Business Logic
1. Implement product CRUD
2. Implement cart functionality
3. Implement order management
4. Add Razorpay integration

### Phase 4: Frontend Foundation
1. Initialize React + Vite project
2. Configure Tailwind CSS
3. Create component library
4. Set up routing

### Phase 5: Frontend Features
1. Implement authentication UI
2. Build product catalog
3. Create cart & checkout flow
4. Add order tracking

### Phase 6: Admin Panel
1. Create admin dashboard
2. Implement product management
3. Add order management
4. User management features

### Phase 7: Testing & Deployment
1. Unit tests
2. Integration tests
3. E2E testing
4. Production deployment

## 🔧 Configuration Requirements

### Environment Variables (Backend)
```
DB_URL=jdbc:mysql://localhost:3306/sneakerhub
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Environment Variables (Frontend)
```
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## 📊 Non-Functional Requirements

### Performance
- API response time < 200ms
- Page load time < 2s
- Support 1000+ concurrent users

### Security
- HTTPS only in production
- Password hashing with BCrypt
- SQL injection prevention (JPA)
- XSS protection
- CSRF protection

### Scalability
- Stateless backend (JWT)
- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching strategy for product catalog

---

**Next Steps**: Begin implementation starting with backend setup.
