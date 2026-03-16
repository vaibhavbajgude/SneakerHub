# SneakerHub REST API Documentation

## ✅ **Complete REST API Implementation**

### 📦 **Modules Implemented**

| Module | Endpoints | Status |
|--------|-----------|--------|
| **Sneaker Management** | 15 endpoints | ✅ |
| **Size-wise Inventory** | 4 endpoints | ✅ |
| **Cart Management** | 5 endpoints | ✅ |
| **Order Placement & Tracking** | 4 endpoints | ✅ |
| **Admin Order Dashboard** | 4 endpoints | ✅ |

**Total**: **32 REST API Endpoints**

---

## 🔐 **Authentication**

All authenticated endpoints require JWT token in header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📡 **API Endpoints**

### 1. Sneaker Management APIs

#### **Create Sneaker** 🔒 OWNER/ADMIN
```http
POST /api/sneakers
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Air Jordan 1 Retro High",
  "brand": "Nike",
  "description": "Classic basketball sneaker with iconic design",
  "basePrice": 12999.00,
  "category": "Basketball",
  "color": "Black/Red",
  "material": "Leather",
  "imageUrl": "https://example.com/image.jpg",
  "additionalImages": ["url1", "url2"],
  "active": true,
  "featured": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sneaker created successfully",
  "data": {
    "id": 1,
    "name": "Air Jordan 1 Retro High",
    "brand": "Nike",
    ...
    "variants": [],
    "createdAt": "2026-02-09T20:00:00"
  }
}
```

---

#### **Update Sneaker** 🔒 OWNER/ADMIN
```http
PUT /api/sneakers/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "brand": "Nike",
  ...
}
```

---

#### **Get Sneaker by ID** 🌐 Public
```http
GET /api/sneakers/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Sneaker retrieved successfully",
  "data": {
    "id": 1,
    "name": "Air Jordan 1",
    "brand": "Nike",
    "variants": [
      {
        "id": 1,
        "size": "8",
        "stockQuantity": 10,
        "price": 12999.00,
        "inStock": true
      }
    ]
  }
}
```

---

#### **Get All Sneakers** 🌐 Public (Paginated)
```http
GET /api/sneakers?page=0&size=12&sortBy=createdAt&sortDir=DESC
```

**Response:**
```json
{
  "success": true,
  "message": "Sneakers retrieved successfully",
  "data": {
    "content": [...],
    "totalElements": 50,
    "totalPages": 5,
    "number": 0,
    "size": 12
  }
}
```

---

#### **Search Sneakers** 🌐 Public
```http
GET /api/sneakers/search?keyword=jordan&page=0&size=12
```

---

#### **Get Sneakers by Brand** 🌐 Public
```http
GET /api/sneakers/brand/Nike?page=0&size=12
```

---

#### **Get Sneakers by Category** 🌐 Public
```http
GET /api/sneakers/category/Basketball?page=0&size=12
```

---

#### **Get Featured Sneakers** 🌐 Public
```http
GET /api/sneakers/featured
```

---

#### **Get All Brands** 🌐 Public
```http
GET /api/sneakers/brands
```

**Response:**
```json
{
  "success": true,
  "message": "Brands retrieved successfully",
  "data": ["Nike", "Adidas", "Puma", "Reebok"]
}
```

---

#### **Get All Categories** 🌐 Public
```http
GET /api/sneakers/categories
```

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": ["Basketball", "Running", "Casual", "Training"]
}
```

---

#### **Delete Sneaker** 🔒 OWNER/ADMIN
```http
DELETE /api/sneakers/{id}
Authorization: Bearer {token}
```

---

### 2. Size-wise Inventory Management APIs

#### **Add Variant** 🔒 OWNER/ADMIN
```http
POST /api/sneakers/{sneakerId}/variants
Authorization: Bearer {token}
Content-Type: application/json

{
  "size": "8",
  "colorVariant": "Black/Red",
  "stockQuantity": 50,
  "price": 12999.00,
  "discountPrice": 11999.00,
  "variantImageUrl": "https://example.com/variant.jpg",
  "sku": "AJ1-BLK-8",
  "available": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Variant added successfully",
  "data": {
    "id": 1,
    "sneakerId": 1,
    "size": "8",
    "stockQuantity": 50,
    "price": 12999.00,
    "discountPrice": 11999.00,
    "effectivePrice": 11999.00,
    "inStock": true,
    "available": true
  }
}
```

---

#### **Update Variant** 🔒 OWNER/ADMIN
```http
PUT /api/sneakers/variants/{variantId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "size": "8",
  "stockQuantity": 30,
  "price": 12999.00
}
```

---

#### **Get Variants** 🌐 Public
```http
GET /api/sneakers/{sneakerId}/variants
```

**Response:**
```json
{
  "success": true,
  "message": "Variants retrieved successfully",
  "data": [
    {
      "id": 1,
      "size": "8",
      "stockQuantity": 50,
      "inStock": true
    },
    {
      "id": 2,
      "size": "9",
      "stockQuantity": 0,
      "inStock": false
    }
  ]
}
```

---

#### **Delete Variant** 🔒 OWNER/ADMIN
```http
DELETE /api/sneakers/variants/{variantId}
Authorization: Bearer {token}
```

---

### 3. Cart Management APIs

#### **Get Cart** 🔒 USER
```http
GET /api/cart
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "items": [
      {
        "id": 1,
        "sneakerName": "Air Jordan 1",
        "sneakerBrand": "Nike",
        "sneakerImage": "url",
        "sneakerVariant": {
          "size": "8",
          "price": 12999.00
        },
        "quantity": 2,
        "subtotal": 25998.00
      }
    ],
    "totalItems": 2,
    "totalPrice": 25998.00
  }
}
```

---

#### **Add to Cart** 🔒 USER
```http
POST /api/cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "sneakerVariantId": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": { /* cart response */ }
}
```

---

#### **Update Cart Item** 🔒 USER
```http
PUT /api/cart/items/{cartItemId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

---

#### **Remove from Cart** 🔒 USER
```http
DELETE /api/cart/items/{cartItemId}
Authorization: Bearer {token}
```

---

#### **Clear Cart** 🔒 USER
```http
DELETE /api/cart
Authorization: Bearer {token}
```

---

### 4. Order Placement & Tracking APIs

#### **Create Order** 🔒 USER
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "shippingName": "John Doe",
  "shippingPhone": "+1234567890",
  "shippingAddressLine1": "123 Main St",
  "shippingAddressLine2": "Apt 4B",
  "shippingCity": "New York",
  "shippingState": "NY",
  "shippingPostalCode": "10001",
  "shippingCountry": "USA",
  "notes": "Please deliver before 5 PM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 1,
    "orderNumber": "ORD-20260209200000",
    "status": "PENDING",
    "items": [
      {
        "sneakerName": "Air Jordan 1",
        "size": "8",
        "quantity": 2,
        "price": 12999.00,
        "subtotal": 25998.00
      }
    ],
    "subtotal": 25998.00,
    "tax": 4679.64,
    "shippingFee": 50.00,
    "totalAmount": 30727.64,
    "shippingName": "John Doe",
    "shippingPhone": "+1234567890",
    "shippingAddressLine1": "123 Main St",
    "createdAt": "2026-02-09T20:00:00"
  }
}
```

---

#### **Get Order by ID** 🔒 USER
```http
GET /api/orders/{orderId}
Authorization: Bearer {token}
```

---

#### **Get My Orders** 🔒 USER
```http
GET /api/orders/my-orders?page=0&size=10
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "orderNumber": "ORD-20260209200000",
        "status": "SHIPPED",
        "totalAmount": 30727.64,
        "trackingNumber": "TRACK123",
        "createdAt": "2026-02-09T20:00:00"
      }
    ],
    "totalElements": 5,
    "totalPages": 1
  }
}
```

---

#### **Cancel Order** 🔒 USER
```http
PUT /api/orders/{orderId}/cancel?reason=Changed my mind
Authorization: Bearer {token}
```

---

### 5. Admin Order Dashboard APIs

#### **Get All Orders** 🔒 OWNER/ADMIN
```http
GET /api/orders/admin/all?page=0&size=10
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "orderNumber": "ORD-20260209200000",
        "userId": 1,
        "userEmail": "user@example.com",
        "status": "PENDING",
        "totalAmount": 30727.64,
        "createdAt": "2026-02-09T20:00:00"
      }
    ],
    "totalElements": 100,
    "totalPages": 10
  }
}
```

---

#### **Get Orders by Status** 🔒 OWNER/ADMIN
```http
GET /api/orders/admin/status/PENDING?page=0&size=10
Authorization: Bearer {token}
```

**Statuses**: `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`

---

#### **Update Order Status** 🔒 OWNER/ADMIN
```http
PUT /api/orders/admin/{orderId}/status?status=SHIPPED
Authorization: Bearer {token}
```

---

#### **Mark as Shipped** 🔒 OWNER/ADMIN
```http
PUT /api/orders/admin/{orderId}/ship?trackingNumber=TRACK123456
Authorization: Bearer {token}
```

---

#### **Get Order Statistics** 🔒 ADMIN
```http
GET /api/orders/admin/statistics
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "totalOrders": 150,
    "pendingOrders": 20,
    "shippedOrders": 50,
    "deliveredOrders": 70,
    "cancelledOrders": 10,
    "totalRevenue": 2500000.00
  }
}
```

---

## 🎯 **REST Best Practices Implemented**

### ✅ **HTTP Methods**
- `GET` - Retrieve resources
- `POST` - Create resources
- `PUT` - Update resources
- `DELETE` - Delete resources

### ✅ **Status Codes**
- `200 OK` - Successful GET, PUT, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server errors

### ✅ **Consistent Response Format**
```json
{
  "success": true/false,
  "message": "Human-readable message",
  "data": { /* response data */ },
  "timestamp": "2026-02-09T20:00:00"
}
```

### ✅ **Pagination**
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 10,
  "number": 0,
  "size": 10,
  "first": true,
  "last": false
}
```

### ✅ **Validation**
- Request body validation with `@Valid`
- Field-level validation with Jakarta Validation
- Business logic validation in services

### ✅ **Security**
- Role-based access control
- JWT authentication
- Method-level security with `@PreAuthorize`

### ✅ **Error Handling**
- Global exception handler
- Consistent error responses
- Detailed error messages

---

## 📊 **API Summary**

| Category | Endpoints | Access |
|----------|-----------|--------|
| **Sneaker CRUD** | 6 | Public (read), OWNER/ADMIN (write) |
| **Sneaker Search & Filter** | 5 | Public |
| **Variant Management** | 4 | Public (read), OWNER/ADMIN (write) |
| **Cart Operations** | 5 | USER |
| **Order Placement** | 4 | USER |
| **Admin Dashboard** | 4 | OWNER/ADMIN |
| **Order Statistics** | 1 | ADMIN |

**Total**: **32 Endpoints**

---

## 🧪 **Testing with cURL**

### Create Sneaker
```bash
curl -X POST http://localhost:8080/api/sneakers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Air Jordan 1",
    "brand": "Nike",
    "basePrice": 12999.00,
    "category": "Basketball"
  }'
```

### Add to Cart
```bash
curl -X POST http://localhost:8080/api/cart/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sneakerVariantId": 1,
    "quantity": 2
  }'
```

### Place Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingName": "John Doe",
    "shippingPhone": "+1234567890",
    "shippingAddressLine1": "123 Main St",
    "shippingCity": "New York",
    "shippingState": "NY",
    "shippingPostalCode": "10001",
    "shippingCountry": "USA"
  }'
```

---

## 📚 **Swagger Documentation**

Access interactive API documentation:
```
http://localhost:8080/swagger-ui.html
```

Features:
- Try out APIs directly
- View request/response schemas
- Test authentication
- See all endpoints organized by tags

---

**Created**: 2026-02-09  
**Status**: ✅ Complete  
**Total APIs**: 32 endpoints  
**Ready for**: Testing and integration
