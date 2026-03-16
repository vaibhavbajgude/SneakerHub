# SneakerHub - Architecture Documentation Index

## 📚 Complete Documentation Suite

This is the master index for all SneakerHub architecture documentation.

---

## 📄 Documentation Files

### 1. **ARCHITECTURE.md**
**Purpose**: High-level project overview and development roadmap

**Contents**:
- Technology stack (Spring Boot, React, MySQL)
- Project folder structure
- Development phases (1-7)
- Configuration requirements
- Non-functional requirements
- Deployment considerations

**When to read**: Start here for project overview and setup instructions

---

### 2. **SYSTEM_ARCHITECTURE.md** ⭐ (Main Architecture Document)
**Purpose**: Complete system architecture with detailed diagrams

**Contents**:
- **Section 1**: High-level system architecture (3-tier)
- **Section 2**: Database ER diagram with all entities
- **Section 3**: Role-Based Access Control (RBAC) matrix
- **Section 4**: Authentication flows (JWT + Google OAuth)
- **Section 5**: Razorpay payment integration flow
- **Section 6**: Complete API endpoint reference
- **Section 7**: Security considerations
- **Section 8**: Scalability strategies
- **Section 9**: Production deployment architecture

**When to read**: For understanding system design, data flow, and integration patterns

---

### 3. **ENTITY_RELATIONSHIPS.md**
**Purpose**: Detailed explanation of all database relationships

**Contents**:
- All 10 entity relationships explained
- Cardinality details (1:1, 1:N, N:1)
- Real-world use case examples
- Complete user journey trace
- Database constraints and cascade behaviors
- SQL query examples
- Visual entity map

**When to read**: When implementing database logic or understanding data models

---

## 🎯 Quick Reference Guide

### For Backend Developers

**Setting up entities?**
→ Read: `ENTITY_RELATIONSHIPS.md` sections 1-10

**Implementing authentication?**
→ Read: `SYSTEM_ARCHITECTURE.md` section 4

**Adding payment integration?**
→ Read: `SYSTEM_ARCHITECTURE.md` section 5

**Creating API endpoints?**
→ Read: `SYSTEM_ARCHITECTURE.md` section 6

**Understanding security?**
→ Read: `SYSTEM_ARCHITECTURE.md` section 7

---

### For Frontend Developers

**Understanding API structure?**
→ Read: `SYSTEM_ARCHITECTURE.md` section 6

**Implementing authentication?**
→ Read: `SYSTEM_ARCHITECTURE.md` section 4

**Integrating Razorpay?**
→ Read: `SYSTEM_ARCHITECTURE.md` section 5

**Understanding user roles?**
→ Read: `SYSTEM_ARCHITECTURE.md` section 3

---

### For Database Administrators

**Understanding schema?**
→ Read: `SYSTEM_ARCHITECTURE.md` section 2

**Understanding relationships?**
→ Read: `ENTITY_RELATIONSHIPS.md` (all sections)

**Creating indexes?**
→ Read: `SYSTEM_ARCHITECTURE.md` section 2 (indexes)

**Query optimization?**
→ Read: `ENTITY_RELATIONSHIPS.md` (Query Examples section)

---

## 🗂️ Entity Summary

### Core Entities (8 total)

| Entity | Purpose | Key Relationships |
|--------|---------|-------------------|
| **User** | System users (customers, owners, admins) | → Product (owns), → Cart (has), → Order (places) |
| **Product** | Sneaker products | ← User (owned by), → ProductVariant (has) |
| **ProductVariant** | Size/color combinations | ← Product (belongs to) |
| **Cart** | Shopping cart | ← User (belongs to), → CartItem (contains) |
| **CartItem** | Items in cart | ← Cart (in), → Product (references), → ProductVariant (references) |
| **Order** | Customer orders | ← User (placed by), → OrderItem (contains), → Payment (has) |
| **OrderItem** | Items in order | ← Order (in), → Product (references) |
| **Payment** | Payment transactions | ← Order (for) |

---

## 🔐 Security Architecture Summary

### Authentication Methods
1. **Email/Password** (Local)
   - BCrypt password hashing
   - JWT token generation
   - 24-hour token expiry

2. **Google OAuth 2.0**
   - OAuth authorization code flow
   - User profile retrieval
   - Automatic account creation/linking

### Authorization (RBAC)
- **USER**: Browse, shop, order
- **OWNER**: USER + manage own products
- **ADMIN**: Full system access

### API Security
- JWT bearer token authentication
- Role-based endpoint protection
- CORS configuration
- Input validation
- SQL injection prevention (JPA)

---

## 💳 Payment Integration Summary

### Razorpay Flow (20 steps)
1. User adds items to cart
2. Proceeds to checkout
3. Backend creates Razorpay order
4. Frontend opens Razorpay modal
5. User completes payment
6. Backend verifies signature
7. Order status updated to PAID
8. Cart cleared
9. Confirmation sent

### Security Measures
- HMAC SHA256 signature verification
- Server-side amount validation
- Webhook signature verification
- No card data storage (PCI compliant)

---

## 📊 API Endpoints Summary

### Public Endpoints (No Auth)
- `GET /api/products` - Browse products
- `GET /api/products/{id}` - Product details
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth

### Authenticated Endpoints
- `GET /api/cart` - View cart
- `POST /api/cart/items` - Add to cart
- `POST /api/orders` - Place order
- `POST /api/payment/create-order` - Create payment
- `GET /api/orders` - Order history

### Owner/Admin Endpoints
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Admin Only Endpoints
- `GET /api/admin/users` - User management
- `PUT /api/admin/users/{id}/role` - Change roles
- `GET /api/admin/orders` - All orders
- `GET /api/admin/analytics` - System analytics

---

## 🏗️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 17
- **Security**: Spring Security + JWT
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA (Hibernate)
- **Build**: Maven
- **Payment**: Razorpay SDK
- **OAuth**: Spring OAuth2 Client

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State**: Context API
- **HTTP**: Axios
- **Forms**: React Hook Form

### External Services
- **Authentication**: Google OAuth 2.0
- **Payment**: Razorpay Payment Gateway

---

## 📈 Development Phases

### Phase 1: Backend Foundation ✅
- Spring Boot setup
- Entity models
- Repositories
- Database configuration

### Phase 2: Security & Authentication ✅
- JWT implementation
- Spring Security config
- Google OAuth integration
- User authentication

### Phase 3: Core Business Logic (In Progress)
- Product CRUD services
- Cart management
- Order processing
- Payment integration

### Phase 4: Frontend Foundation (Pending)
- React + Vite setup
- Tailwind CSS configuration
- Component library
- Routing setup

### Phase 5: Frontend Features (Pending)
- Authentication UI
- Product catalog
- Shopping cart
- Checkout flow

### Phase 6: Admin Panel (Pending)
- Dashboard
- Product management
- Order management
- User management

### Phase 7: Testing & Deployment (Pending)
- Unit tests
- Integration tests
- Production deployment

---

## 🎨 Design Patterns Used

### Backend Patterns
- **Repository Pattern**: Data access abstraction
- **Service Layer Pattern**: Business logic separation
- **DTO Pattern**: Data transfer objects
- **Builder Pattern**: Entity construction (Lombok)
- **Strategy Pattern**: Multiple auth providers
- **Filter Pattern**: JWT authentication filter

### Frontend Patterns
- **Component Pattern**: Reusable UI components
- **Container/Presentational**: Smart/dumb components
- **Context Pattern**: Global state management
- **Custom Hooks**: Reusable logic
- **Protected Routes**: Authorization guards

---

## 🔍 Key Design Decisions

### 1. Why ProductVariant as Separate Entity?
**Decision**: Create separate ProductVariant entity instead of JSON fields

**Reasons**:
- Individual stock tracking per size/color
- Efficient querying (indexed)
- Referential integrity
- Better for inventory management
- Scalable for future features (variant-specific pricing)

### 2. Why Snapshot Order Items?
**Decision**: Store product details in OrderItem (not just reference)

**Reasons**:
- Product prices change over time
- Products may be deleted
- Order history must be immutable
- Legal/accounting requirements
- Customer service needs

### 3. Why One-to-One Cart per User?
**Decision**: Each user has exactly one persistent cart

**Reasons**:
- Simpler data model
- Better user experience (cart persists)
- No need for cart session management
- Easy to implement
- Industry standard pattern

### 4. Why Separate Payment Entity?
**Decision**: Payment as separate entity (not embedded in Order)

**Reasons**:
- Complex payment data (Razorpay IDs, signatures)
- Payment lifecycle separate from order
- Support for refunds/partial refunds
- Audit trail requirements
- Webhook handling

### 5. Why JWT over Session?
**Decision**: Use JWT tokens instead of server sessions

**Reasons**:
- Stateless backend (scalable)
- Works with multiple servers
- Mobile app friendly
- Microservices ready
- Industry standard for SPAs

---

## 📝 Database Indexes Strategy

### High-Priority Indexes
```sql
-- User lookups
CREATE INDEX idx_user_email ON users(email);

-- Product searches
CREATE INDEX idx_product_brand ON products(brand);
CREATE INDEX idx_product_category ON products(category);

-- Order tracking
CREATE UNIQUE INDEX idx_order_number ON orders(orderNumber);
CREATE INDEX idx_order_status ON orders(status);

-- Payment verification
CREATE UNIQUE INDEX idx_payment_razorpay ON payments(razorpayOrderId);
```

### Composite Indexes
```sql
-- Product variant uniqueness
CREATE UNIQUE INDEX idx_variant_unique 
ON product_variants(productId, size, color);

-- Order user filtering
CREATE INDEX idx_order_user_status 
ON orders(userId, status);
```

---

## 🚀 Performance Optimizations

### Database Level
- Connection pooling (HikariCP)
- Lazy loading for relationships
- Pagination for large datasets
- Proper indexing strategy
- Query optimization

### Application Level
- DTO pattern (avoid over-fetching)
- Caching (future: Redis)
- Async processing (future: message queues)
- Batch operations where applicable

### Frontend Level
- Code splitting (Vite)
- Lazy loading routes
- Image optimization
- Debounced search
- Optimistic UI updates

---

## 🔒 Security Checklist

- [x] Password hashing (BCrypt)
- [x] JWT token signing
- [x] CORS configuration
- [x] Role-based access control
- [x] Input validation (Bean Validation)
- [x] SQL injection prevention (JPA)
- [x] Payment signature verification
- [ ] Rate limiting (TODO)
- [ ] HTTPS enforcement (Production)
- [ ] XSS protection headers (TODO)
- [ ] CSRF tokens for forms (TODO)

---

## 📞 Support & Contact

For questions about this architecture:
1. Review the appropriate documentation file
2. Check the entity relationships guide
3. Refer to the API endpoint reference
4. Consult the authentication flow diagrams

---

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-09 | Initial architecture design |
| | | - Complete entity model |
| | | - Authentication flows |
| | | - Payment integration |
| | | - RBAC implementation |

---

**Architecture designed by**: SneakerHub Development Team  
**Last Updated**: February 9, 2026  
**Status**: Phase 2 Complete, Phase 3 In Progress

---

## 🎯 Next Steps

1. **Complete Phase 3**: Implement all service layers and controllers
2. **Start Phase 4**: Set up React frontend with Vite and Tailwind
3. **Implement Phase 5**: Build all frontend features
4. **Testing**: Write comprehensive tests
5. **Deployment**: Deploy to production environment

---

*This index serves as the central reference point for all SneakerHub architecture documentation.*
