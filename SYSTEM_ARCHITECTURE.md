# SneakerHub - Complete System Architecture Design

## 📐 Table of Contents
1. [High-Level System Architecture](#high-level-system-architecture)
2. [Database ER Diagram](#database-er-diagram)
3. [Role-Based Access Control (RBAC)](#role-based-access-control)
4. [Authentication Flow](#authentication-flow)
5. [Razorpay Payment Flow](#razorpay-payment-flow)
6. [API Endpoints](#api-endpoints)

---

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Frontend)                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    React 18 + Vite                             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │  │
│  │  │ Product  │  │ Shopping │  │   User   │  │  Admin   │      │  │
│  │  │ Catalog  │  │   Cart   │  │Dashboard │  │  Panel   │      │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │  │
│  │                                                                 │  │
│  │  Styling: Tailwind CSS | State: Context API | Routing: React  │  │
│  │  Router | HTTP Client: Axios                                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           │ HTTPS/REST API
                           │ Authorization: Bearer {JWT}
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                    APPLICATION LAYER (Backend)                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                  Spring Boot 3.2 (Java 17)                     │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │              Spring Security + JWT Filter                │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │  │
│  │  │     Auth     │  │   Product    │  │     Cart     │        │  │
│  │  │   Service    │  │   Service    │  │   Service    │        │  │
│  │  │              │  │              │  │              │        │  │
│  │  │ • Register   │  │ • CRUD Ops   │  │ • Add Item   │        │  │
│  │  │ • Login      │  │ • Search     │  │ • Update Qty │        │  │
│  │  │ • JWT Gen    │  │ • Filter     │  │ • Remove     │        │  │
│  │  │ • OAuth      │  │ • Variants   │  │ • Clear      │        │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │  │
│  │                                                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │  │
│  │  │    Order     │  │   Payment    │  │    Admin     │        │  │
│  │  │   Service    │  │   Service    │  │   Service    │        │  │
│  │  │              │  │              │  │              │        │  │
│  │  │ • Create     │  │ • Razorpay   │  │ • User Mgmt  │        │  │
│  │  │ • Track      │  │ • Verify     │  │ • Role Mgmt  │        │  │
│  │  │ • History    │  │ • Webhook    │  │ • Analytics  │        │  │
│  │  │ • Status     │  │ • Refund     │  │ • Reports    │        │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │  │
│  │                                                                 │  │
│  │  ORM: Spring Data JPA (Hibernate) | Validation: Bean Valid.   │  │
│  └───────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           │ JDBC/JPA
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                      DATA LAYER (Database)                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        MySQL 8.0+                              │  │
│  │                                                                 │  │
│  │  Tables:                                                        │  │
│  │  • users                    • products                          │  │
│  │  • product_variants         • carts                             │  │
│  │  • cart_items               • orders                            │  │
│  │  • order_items              • payments                          │  │
│  │                                                                 │  │
│  │  Indexes: email, orderNumber, razorpayOrderId, status          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                               │
│  ┌──────────────────────┐         ┌──────────────────────┐          │
│  │   Google OAuth 2.0   │         │   Razorpay Gateway   │          │
│  │                      │         │                      │          │
│  │  • User Auth         │         │  • Order Creation    │          │
│  │  • Profile Data      │         │  • Payment Process   │          │
│  │  • Token Exchange    │         │  • Signature Verify  │          │
│  └──────────────────────┘         │  • Webhooks          │          │
│                                    └──────────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

### Architecture Layers Explained

#### **Frontend Layer (React + Vite)**
- **Technology**: React 18, Vite build tool, Tailwind CSS
- **Responsibilities**:
  - User interface rendering
  - Client-side routing
  - State management (Auth, Cart)
  - API communication via Axios
  - Form validation
  - Responsive design (mobile + desktop)

#### **Backend Layer (Spring Boot)**
- **Technology**: Spring Boot 3.2, Java 17, Spring Security
- **Responsibilities**:
  - Business logic processing
  - Authentication & authorization
  - Data validation
  - Database operations via JPA
  - External API integration
  - RESTful API endpoints

#### **Data Layer (MySQL)**
- **Technology**: MySQL 8.0+
- **Responsibilities**:
  - Persistent data storage
  - Relational data integrity
  - Transaction management
  - Query optimization via indexes

---

## 2. Database ER Diagram

### Entity-Relationship Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ENTITY DEFINITIONS                           │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│         USER             │
├──────────────────────────┤
│ PK  id (BIGINT)          │
│     email (VARCHAR)  UK  │
│     password (VARCHAR)   │
│     firstName (VARCHAR)  │
│     lastName (VARCHAR)   │
│     role (ENUM)          │
│       - USER             │
│       - OWNER            │
│       - ADMIN            │
│     provider (ENUM)      │
│       - LOCAL            │
│       - GOOGLE           │
│     providerId (VARCHAR) │
│     enabled (BOOLEAN)    │
│     createdAt (DATETIME) │
│     updatedAt (DATETIME) │
└──────────────────────────┘
           │
           │ 1:N (owns)
           ▼
┌──────────────────────────┐
│       PRODUCT            │
├──────────────────────────┤
│ PK  id (BIGINT)          │
│ FK  ownerId → User.id    │
│     name (VARCHAR)       │
│     description (TEXT)   │
│     brand (VARCHAR)      │
│     category (VARCHAR)   │
│     price (DECIMAL)      │
│     discountPrice (DEC)  │
│     stock (INT)          │
│     active (BOOLEAN)     │
│     createdAt (DATETIME) │
│     updatedAt (DATETIME) │
└──────────────────────────┘
           │
           │ 1:N (has variants)
           ▼
┌──────────────────────────┐
│   PRODUCT_VARIANT        │
├──────────────────────────┤
│ PK  id (BIGINT)          │
│ FK  productId→Product.id │
│     size (VARCHAR)       │
│     color (VARCHAR)      │
│     stock (INT)          │
│     sku (VARCHAR)    UK  │
│     additionalPrice(DEC) │
└──────────────────────────┘


┌──────────────────────────┐
│         USER             │
└──────────────────────────┘
           │
           │ 1:1 (has cart)
           ▼
┌──────────────────────────┐
│         CART             │
├──────────────────────────┤
│ PK  id (BIGINT)          │
│ FK  userId → User.id UK  │
│     createdAt (DATETIME) │
│     updatedAt (DATETIME) │
└──────────────────────────┘
           │
           │ 1:N (contains)
           ▼
┌──────────────────────────┐
│      CART_ITEM           │
├──────────────────────────┤
│ PK  id (BIGINT)          │
│ FK  cartId → Cart.id     │
│ FK  productId→Product.id │
│ FK  variantId→Variant.id │
│     quantity (INT)       │
│     priceAtAdd (DECIMAL) │
└──────────────────────────┘


┌──────────────────────────┐
│         USER             │
└──────────────────────────┘
           │
           │ 1:N (places orders)
           ▼
┌──────────────────────────┐
│         ORDER            │
├──────────────────────────┤
│ PK  id (BIGINT)          │
│     orderNumber (VAR) UK │
│ FK  userId → User.id     │
│     totalAmount (DECIMAL)│
│     status (ENUM)        │
│       - PENDING          │
│       - PAID             │
│       - SHIPPED          │
│       - DELIVERED        │
│       - CANCELLED        │
│     shippingAddress(TEXT)│
│     shippingCity (VAR)   │
│     shippingState (VAR)  │
│     shippingZipCode(VAR) │
│     phoneNumber (VAR)    │
│     createdAt (DATETIME) │
│     updatedAt (DATETIME) │
│     paidAt (DATETIME)    │
│     shippedAt (DATETIME) │
│     deliveredAt (DTIME)  │
└──────────────────────────┘
           │
           │ 1:N (contains items)
           ▼
┌──────────────────────────┐
│      ORDER_ITEM          │
├──────────────────────────┤
│ PK  id (BIGINT)          │
│ FK  orderId → Order.id   │
│ FK  productId→Product.id │
│     quantity (INT)       │
│     price (DECIMAL)      │
│     size (VARCHAR)       │
│     color (VARCHAR)      │
│     productName (VAR)    │
│     productBrand (VAR)   │
└──────────────────────────┘


┌──────────────────────────┐
│         ORDER            │
└──────────────────────────┘
           │
           │ 1:1 (has payment)
           ▼
┌──────────────────────────┐
│        PAYMENT           │
├──────────────────────────┤
│ PK  id (BIGINT)          │
│ FK  orderId → Order.id UK│
│     razorpayOrderId(VAR) │
│     razorpayPaymentId(V) │
│     razorpaySignature(V) │
│     amount (DECIMAL)     │
│     currency (VARCHAR)   │
│     status (ENUM)        │
│       - CREATED          │
│       - AUTHORIZED       │
│       - CAPTURED         │
│       - FAILED           │
│       - REFUNDED         │
│     method (VARCHAR)     │
│     createdAt (DATETIME) │
│     updatedAt (DATETIME) │
└──────────────────────────┘
```

### Relationship Cardinality

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Product | 1:N | One user (OWNER) can own multiple products |
| Product → ProductVariant | 1:N | One product has multiple size/color variants |
| User → Cart | 1:1 | Each user has exactly one cart |
| Cart → CartItem | 1:N | One cart contains multiple items |
| CartItem → Product | N:1 | Multiple cart items can reference same product |
| CartItem → ProductVariant | N:1 | Cart item references specific variant |
| User → Order | 1:N | One user can place multiple orders |
| Order → OrderItem | 1:N | One order contains multiple items |
| OrderItem → Product | N:1 | Order items reference products (snapshot) |
| Order → Payment | 1:1 | Each order has one payment transaction |

### Database Indexes (Performance Optimization)

```sql
-- User indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_provider ON users(provider, providerId);

-- Product indexes
CREATE INDEX idx_product_brand ON products(brand);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_product_owner ON products(ownerId);
CREATE INDEX idx_product_active ON products(active);

-- Variant indexes
CREATE UNIQUE INDEX idx_variant_sku ON product_variants(sku);
CREATE INDEX idx_variant_product ON product_variants(productId);

-- Order indexes
CREATE UNIQUE INDEX idx_order_number ON orders(orderNumber);
CREATE INDEX idx_order_user ON orders(userId);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_created ON orders(createdAt);

-- Payment indexes
CREATE UNIQUE INDEX idx_payment_razorpay_order ON payments(razorpayOrderId);
CREATE INDEX idx_payment_status ON payments(status);
```

---

## 3. Role-Based Access Control (RBAC)

### Role Hierarchy

```
                    ┌─────────────┐
                    │    ADMIN    │  (Full System Access)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    OWNER    │  (Product Management)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │     USER    │  (Customer)
                    └─────────────┘
```

### Access Control Matrix

| Feature | PUBLIC | USER | OWNER | ADMIN |
|---------|--------|------|-------|-------|
| **Product Browsing** |
| View Products | ✅ | ✅ | ✅ | ✅ |
| Search Products | ✅ | ✅ | ✅ | ✅ |
| View Product Details | ✅ | ✅ | ✅ | ✅ |
| Filter by Category/Brand | ✅ | ✅ | ✅ | ✅ |
| **Authentication** |
| Register | ✅ | ✅ | ✅ | ✅ |
| Login (Email/Google) | ✅ | ✅ | ✅ | ✅ |
| Logout | ❌ | ✅ | ✅ | ✅ |
| Update Profile | ❌ | ✅ | ✅ | ✅ |
| **Shopping Cart** |
| Add to Cart | ❌ | ✅ | ✅ | ✅ |
| Update Cart Items | ❌ | ✅ | ✅ | ✅ |
| Remove from Cart | ❌ | ✅ | ✅ | ✅ |
| View Cart | ❌ | ✅ | ✅ | ✅ |
| **Orders** |
| Place Order | ❌ | ✅ | ✅ | ✅ |
| View Own Orders | ❌ | ✅ | ✅ | ✅ |
| Track Order Status | ❌ | ✅ | ✅ | ✅ |
| Cancel Own Order | ❌ | ✅ | ✅ | ✅ |
| **Payment** |
| Make Payment | ❌ | ✅ | ✅ | ✅ |
| View Payment History | ❌ | ✅ | ✅ | ✅ |
| **Product Management** |
| Create Product | ❌ | ❌ | ✅ | ✅ |
| Edit Own Products | ❌ | ❌ | ✅ | ✅ |
| Delete Own Products | ❌ | ❌ | ✅ | ✅ |
| Manage Inventory | ❌ | ❌ | ✅ | ✅ |
| View Product Analytics | ❌ | ❌ | ✅ | ✅ |
| **Admin Functions** |
| Edit Any Product | ❌ | ❌ | ❌ | ✅ |
| Delete Any Product | ❌ | ❌ | ❌ | ✅ |
| View All Orders | ❌ | ❌ | ❌ | ✅ |
| Update Order Status | ❌ | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| Change User Roles | ❌ | ❌ | ❌ | ✅ |
| View System Analytics | ❌ | ❌ | ❌ | ✅ |
| System Configuration | ❌ | ❌ | ❌ | ✅ |

### Spring Security Configuration

```java
// Endpoint Authorization Rules
.authorizeHttpRequests(auth -> auth
    // Public endpoints
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
    
    // Authenticated users
    .requestMatchers("/api/cart/**").authenticated()
    .requestMatchers("/api/orders/**").authenticated()
    .requestMatchers("/api/payment/**").authenticated()
    
    // OWNER and ADMIN
    .requestMatchers(HttpMethod.POST, "/api/products/**")
        .hasAnyRole("OWNER", "ADMIN")
    .requestMatchers(HttpMethod.PUT, "/api/products/**")
        .hasAnyRole("OWNER", "ADMIN")
    .requestMatchers(HttpMethod.DELETE, "/api/products/**")
        .hasAnyRole("OWNER", "ADMIN")
    
    // ADMIN only
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    
    .anyRequest().authenticated()
)
```

---

## 4. Authentication Flow

### 4.1 JWT Authentication Flow (Email/Password)

```
┌─────────┐                ┌──────────┐              ┌──────────┐
│  User   │                │ Frontend │              │ Backend  │
└────┬────┘                └────┬─────┘              └────┬─────┘
     │                          │                         │
     │ 1. Enter email/password  │                         │
     ├─────────────────────────>│                         │
     │                          │                         │
     │                          │ 2. POST /api/auth/login │
     │                          │    {email, password}    │
     │                          ├────────────────────────>│
     │                          │                         │
     │                          │              3. Validate credentials
     │                          │                 (BCrypt password check)
     │                          │                         │
     │                          │              4. Load UserDetails
     │                          │                 from database
     │                          │                         │
     │                          │              5. Spring Security
     │                          │                 authenticates
     │                          │                         │
     │                          │              6. Generate JWT token
     │                          │                 - Subject: email
     │                          │                 - Expiry: 24h
     │                          │                 - Sign with secret
     │                          │                         │
     │                          │ 7. Return AuthResponse  │
     │                          │    {token, user info}   │
     │                          │<────────────────────────┤
     │                          │                         │
     │                          │ 8. Store token in       │
     │                          │    localStorage         │
     │                          │                         │
     │ 9. Redirect to dashboard │                         │
     │<─────────────────────────┤                         │
     │                          │                         │
     │                          │                         │
     │ 10. Subsequent API calls │                         │
     │                          │ GET /api/cart           │
     │                          │ Authorization: Bearer   │
     │                          │ {token}                 │
     │                          ├────────────────────────>│
     │                          │                         │
     │                          │         11. JwtAuthenticationFilter
     │                          │             - Extract token
     │                          │             - Validate signature
     │                          │             - Check expiry
     │                          │             - Load user
     │                          │             - Set SecurityContext
     │                          │                         │
     │                          │         12. Process request
     │                          │             with authenticated user
     │                          │                         │
     │                          │ 13. Return response     │
     │                          │<────────────────────────┤
     │                          │                         │
```

### 4.2 Google OAuth 2.0 Flow

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User   │    │ Frontend │    │ Backend  │    │  Google  │
└────┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │              │               │               │
     │ 1. Click     │               │               │
     │ "Login with  │               │               │
     │  Google"     │               │               │
     ├─────────────>│               │               │
     │              │               │               │
     │              │ 2. Redirect to Google OAuth   │
     │              │    consent screen             │
     │              ├──────────────────────────────>│
     │              │                               │
     │              │ 3. Google login page          │
     │<─────────────┴───────────────────────────────┤
     │              │                               │
     │ 4. Enter     │                               │
     │ credentials  │                               │
     │ & approve    │                               │
     ├──────────────────────────────────────────────>│
     │              │                               │
     │              │ 5. Authorization code         │
     │              │    (callback URL)             │
     │<─────────────┴───────────────────────────────┤
     │              │                               │
     │              │ 6. POST /api/auth/google      │
     │              │    {authorizationCode}        │
     │              ├──────────────>│               │
     │              │               │               │
     │              │               │ 7. Exchange code
     │              │               │    for access token
     │              │               ├──────────────>│
     │              │               │               │
     │              │               │ 8. Return user
     │              │               │    profile data
     │              │               │<──────────────┤
     │              │               │               │
     │              │               │ 9. Check if user exists
     │              │               │    in database
     │              │               │    (by email/providerId)
     │              │               │               │
     │              │               │ 10a. If NEW:  │
     │              │               │     - Create User
     │              │               │     - provider=GOOGLE
     │              │               │     - role=USER
     │              │               │               │
     │              │               │ 10b. If EXISTS:
     │              │               │     - Update profile
     │              │               │     - Update lastLogin
     │              │               │               │
     │              │               │ 11. Generate JWT
     │              │               │     token      │
     │              │               │               │
     │              │ 12. Return    │               │
     │              │     AuthResponse              │
     │              │     {token, user}             │
     │              │<──────────────┤               │
     │              │               │               │
     │              │ 13. Store token               │
     │              │     in localStorage           │
     │              │               │               │
     │ 14. Redirect │               │               │
     │     to home  │               │               │
     │<─────────────┤               │               │
     │              │               │               │
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user@example.com",
    "iat": 1707475200,
    "exp": 1707561600
  },
  "signature": "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"
}
```

### Token Validation Process

1. **Extract Token**: Get from `Authorization: Bearer {token}` header
2. **Parse Token**: Decode Base64 encoded JWT
3. **Verify Signature**: Recalculate signature using secret key
4. **Check Expiration**: Ensure current time < expiration time
5. **Load User**: Fetch user details from database using subject (email)
6. **Set Authentication**: Create Spring Security authentication object
7. **Proceed**: Allow request to continue with authenticated user

---

## 5. Razorpay Payment Flow

### Complete Payment Integration Flow

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User   │    │ Frontend │    │ Backend  │    │ Razorpay │
└────┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │              │               │               │
     │ 1. Add items │               │               │
     │    to cart   │               │               │
     ├─────────────>│               │               │
     │              │               │               │
     │ 2. Click     │               │               │
     │    "Checkout"│               │               │
     ├─────────────>│               │               │
     │              │               │               │
     │              │ 3. Show checkout form         │
     │              │    (shipping address, etc)    │
     │<─────────────┤               │               │
     │              │               │               │
     │ 4. Fill form │               │               │
     │    & submit  │               │               │
     ├─────────────>│               │               │
     │              │               │               │
     │              │ 5. POST /api/payment/create-order
     │              │    {                          │
     │              │      amount: 5000,            │
     │              │      items: [...],            │
     │              │      shippingAddress: {...}   │
     │              │    }                          │
     │              ├──────────────>│               │
     │              │               │               │
     │              │               │ 6. Create Order entity
     │              │               │    - status: PENDING
     │              │               │    - totalAmount
     │              │               │    - shippingAddress
     │              │               │    - orderNumber
     │              │               │               │
     │              │               │ 7. Create Razorpay Order
     │              │               │    POST /v1/orders
     │              │               │    {              │
     │              │               │      amount: 5000,
     │              │               │      currency: INR,
     │              │               │      receipt: ORD-123
     │              │               │    }              │
     │              │               ├──────────────────>│
     │              │               │               │
     │              │               │ 8. Return order_id
     │              │               │<──────────────────┤
     │              │               │               │
     │              │               │ 9. Save razorpayOrderId
     │              │               │    to Order entity
     │              │               │               │
     │              │ 10. Return order details      │
     │              │     {                         │
     │              │       orderId: 123,           │
     │              │       razorpayOrderId,        │
     │              │       amount: 5000,           │
     │              │       keyId: "rzp_test_..."   │
     │              │     }                         │
     │              │<──────────────┤               │
     │              │               │               │
     │              │ 11. Initialize Razorpay       │
     │              │     checkout modal            │
     │              │     new Razorpay({            │
     │              │       key: keyId,             │
     │              │       order_id: razorpayOrderId,
     │              │       handler: onSuccess       │
     │              │     })                        │
     │              │               │               │
     │ 12. Razorpay │               │               │
     │     modal    │               │               │
     │     opens    │               │               │
     │<─────────────┤               │               │
     │              │               │               │
     │ 13. Enter    │               │               │
     │     payment  │               │               │
     │     details  │               │               │
     │     (Card/   │               │               │
     │     UPI/etc) │               │               │
     ├──────────────┴───────────────┴──────────────>│
     │              │               │               │
     │              │               │  14. Process payment
     │              │               │      (bank integration)
     │              │               │               │
     │              │ 15. Payment success callback  │
     │              │     {                         │
     │              │       razorpay_payment_id,    │
     │              │       razorpay_order_id,      │
     │              │       razorpay_signature      │
     │              │     }                         │
     │<─────────────┴───────────────┴───────────────┤
     │              │               │               │
     │              │ 16. POST /api/payment/verify  │
     │              │     {                         │
     │              │       paymentId,              │
     │              │       orderId,                │
     │              │       signature               │
     │              │     }                         │
     │              ├──────────────>│               │
     │              │               │               │
     │              │               │ 17. Verify signature
     │              │               │     using HMAC SHA256
     │              │               │     generated_signature =
     │              │               │     HMAC(order_id + "|" +
     │              │               │          payment_id,
     │              │               │          key_secret)
     │              │               │               │
     │              │               │ 18. If valid: │
     │              │               │     - Update Order
     │              │               │       status = PAID
     │              │               │       paidAt = now
     │              │               │     - Create Payment
     │              │               │       entity
     │              │               │     - Save payment IDs
     │              │               │     - Clear user's cart
     │              │               │     - Send email
     │              │               │               │
     │              │ 19. Return success            │
     │              │     {                         │
     │              │       success: true,          │
     │              │       orderNumber,            │
     │              │       message                 │
     │              │     }                         │
     │              │<──────────────┤               │
     │              │               │               │
     │              │ 20. Redirect to               │
     │              │     order confirmation        │
     │              │     page                      │
     │              │               │               │
     │ 21. Show     │               │               │
     │     success  │               │               │
     │     message  │               │               │
     │<─────────────┤               │               │
     │              │               │               │
     │              │               │               │
     │              │               │ WEBHOOK (Parallel)
     │              │               │               │
     │              │               │ 22. POST /api/payment/webhook
     │              │               │     {         │
     │              │               │       event: "payment.captured",
     │              │               │       payload: {...}
     │              │               │     }         │
     │              │               │<──────────────┤
     │              │               │               │
     │              │               │ 23. Verify webhook
     │              │               │     signature
     │              │               │               │
     │              │               │ 24. Update order
     │              │               │     (backup verification)
     │              │               │               │
     │              │               │ 25. Return 200 OK
     │              │               ├──────────────>│
     │              │               │               │
```

### Signature Verification Algorithm

```java
// Backend signature verification
String generatedSignature = HmacUtils.hmacSha256Hex(
    razorpayKeySecret,
    razorpayOrderId + "|" + razorpayPaymentId
);

if (generatedSignature.equals(razorpaySignature)) {
    // Payment is authentic
    // Update order status to PAID
} else {
    // Signature mismatch - potential fraud
    // Reject payment
}
```

### Payment Status Flow

```
CREATED → AUTHORIZED → CAPTURED → COMPLETED
                ↓
              FAILED
                ↓
            REFUNDED (if applicable)
```

### Razorpay Webhook Events

| Event | Description | Action |
|-------|-------------|--------|
| `payment.authorized` | Payment authorized but not captured | Log event |
| `payment.captured` | Payment successfully captured | Update order to PAID |
| `payment.failed` | Payment failed | Update order to FAILED, notify user |
| `refund.created` | Refund initiated | Create refund record |
| `refund.processed` | Refund completed | Update payment status |

---

## 6. API Endpoints

### Authentication Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | ❌ | - | Register new user |
| POST | `/api/auth/login` | ❌ | - | Login with email/password |
| POST | `/api/auth/google` | ❌ | - | Google OAuth login |
| GET | `/api/auth/me` | ✅ | ALL | Get current user |
| POST | `/api/auth/refresh` | ✅ | ALL | Refresh JWT token |
| POST | `/api/auth/logout` | ✅ | ALL | Logout user |

### Product Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/products` | ❌ | - | Get all products (paginated) |
| GET | `/api/products/{id}` | ❌ | - | Get product by ID |
| GET | `/api/products/search` | ❌ | - | Search products |
| GET | `/api/products/brands` | ❌ | - | Get all brands |
| GET | `/api/products/categories` | ❌ | - | Get all categories |
| POST | `/api/products` | ✅ | OWNER, ADMIN | Create product |
| PUT | `/api/products/{id}` | ✅ | OWNER, ADMIN | Update product |
| DELETE | `/api/products/{id}` | ✅ | OWNER, ADMIN | Delete product |
| GET | `/api/products/{id}/variants` | ❌ | - | Get product variants |

### Cart Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/cart` | ✅ | ALL | Get user's cart |
| POST | `/api/cart/items` | ✅ | ALL | Add item to cart |
| PUT | `/api/cart/items/{id}` | ✅ | ALL | Update cart item |
| DELETE | `/api/cart/items/{id}` | ✅ | ALL | Remove cart item |
| DELETE | `/api/cart` | ✅ | ALL | Clear cart |

### Order Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/orders` | ✅ | ALL | Create order |
| GET | `/api/orders` | ✅ | ALL | Get user's orders |
| GET | `/api/orders/{id}` | ✅ | ALL | Get order details |
| PUT | `/api/orders/{id}/cancel` | ✅ | ALL | Cancel order |
| PUT | `/api/orders/{id}/status` | ✅ | ADMIN | Update order status |

### Payment Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/payment/create-order` | ✅ | ALL | Create Razorpay order |
| POST | `/api/payment/verify` | ✅ | ALL | Verify payment signature |
| POST | `/api/payment/webhook` | ❌ | - | Razorpay webhook |
| GET | `/api/payment/{orderId}` | ✅ | ALL | Get payment details |

### Admin Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/admin/users` | ✅ | ADMIN | Get all users |
| PUT | `/api/admin/users/{id}/role` | ✅ | ADMIN | Update user role |
| GET | `/api/admin/orders` | ✅ | ADMIN | Get all orders |
| GET | `/api/admin/analytics` | ✅ | ADMIN | Get system analytics |
| DELETE | `/api/admin/products/{id}` | ✅ | ADMIN | Delete any product |

---

## 7. Security Considerations

### 7.1 Password Security
- **Hashing**: BCrypt with salt (strength: 10)
- **Minimum Length**: 6 characters
- **No plain text storage**

### 7.2 JWT Security
- **Secret Key**: 256-bit randomly generated
- **Expiration**: 24 hours
- **Refresh Token**: 7 days
- **Signature Algorithm**: HS256

### 7.3 API Security
- **HTTPS Only**: In production
- **CORS**: Configured allowed origins
- **Rate Limiting**: Prevent brute force
- **Input Validation**: Bean Validation
- **SQL Injection**: Prevented by JPA
- **XSS Protection**: Content Security Policy

### 7.4 Payment Security
- **Signature Verification**: HMAC SHA256
- **Webhook Authentication**: Razorpay signature
- **No card data storage**: PCI DSS compliance
- **Amount verification**: Server-side validation

---

## 8. Scalability Considerations

### 8.1 Database Optimization
- **Indexes**: On frequently queried columns
- **Connection Pooling**: HikariCP
- **Pagination**: Limit result sets
- **Lazy Loading**: For relationships

### 8.2 Caching Strategy
- **Product Catalog**: Redis cache
- **User Sessions**: JWT (stateless)
- **Static Assets**: CDN

### 8.3 Horizontal Scaling
- **Stateless Backend**: JWT authentication
- **Load Balancer**: Distribute traffic
- **Database Replication**: Read replicas
- **Microservices**: Future consideration

---

## 9. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTION SETUP                        │
└─────────────────────────────────────────────────────────────┘

Internet
    │
    ▼
┌─────────────┐
│   Nginx     │  (Reverse Proxy + SSL Termination)
│  (Port 80)  │
└──────┬──────┘
       │
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Frontend   │    │  Frontend   │    │  Frontend   │
│  (React)    │    │  (React)    │    │  (React)    │
│  Instance 1 │    │  Instance 2 │    │  Instance 3 │
└─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │
       └──────────────────┴──────────────────┘
                          │
                          ▼
                  ┌─────────────┐
                  │Load Balancer│
                  └──────┬──────┘
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Backend    │   │  Backend    │   │  Backend    │
│ Spring Boot │   │ Spring Boot │   │ Spring Boot │
│ Instance 1  │   │ Instance 2  │   │ Instance 3  │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │   MySQL     │
                  │  (Primary)  │
                  └──────┬──────┘
                         │
                ┌────────┴────────┐
                ▼                 ▼
         ┌─────────────┐   ┌─────────────┐
         │   MySQL     │   │   MySQL     │
         │  (Replica1) │   │  (Replica2) │
         └─────────────┘   └─────────────┘
```

---

**End of System Architecture Document**

*Version: 1.0.0*  
*Last Updated: 2026-02-09*  
*Author: SneakerHub Development Team*
