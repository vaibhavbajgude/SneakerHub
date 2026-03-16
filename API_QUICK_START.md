# REST APIs - Quick Reference

## ✅ **32 REST APIs Created!**

### 📦 **Modules**

| Module | Endpoints | Features |
|--------|-----------|----------|
| **Sneakers** | 11 | CRUD, Search, Filter, Brands, Categories |
| **Variants** | 4 | Size-wise inventory management |
| **Cart** | 5 | Add, Update, Remove, Clear |
| **Orders** | 8 | Place, Track, Cancel, Admin dashboard |
| **Statistics** | 1 | Admin analytics |

---

### 🚀 **Quick Examples**

#### Get All Sneakers (Public)
```http
GET /api/sneakers?page=0&size=12
```

#### Add to Cart (User)
```http
POST /api/cart/items
Authorization: Bearer {token}

{
  "sneakerVariantId": 1,
  "quantity": 2
}
```

#### Place Order (User)
```http
POST /api/orders
Authorization: Bearer {token}

{
  "shippingName": "John Doe",
  "shippingPhone": "+1234567890",
  "shippingAddressLine1": "123 Main St",
  "shippingCity": "New York",
  "shippingState": "NY",
  "shippingPostalCode": "10001",
  "shippingCountry": "USA"
}
```

#### Update Order Status (Admin)
```http
PUT /api/orders/admin/{orderId}/status?status=SHIPPED
Authorization: Bearer {token}
```

---

### 🔐 **Access Control**

- 🌐 **Public**: Sneaker browsing, search, categories
- 👤 **USER**: Cart, orders, profile
- 🏪 **OWNER**: Manage sneakers, variants, view orders
- 👑 **ADMIN**: Full access, statistics

---

### 📚 **Full Documentation**

See **`REST_API_DOCUMENTATION.md`** for:
- Complete endpoint list
- Request/response examples
- Error handling
- Testing guide

---

### 🧪 **Swagger UI**

```
http://localhost:8080/swagger-ui.html
```

---

**Total**: 32 endpoints  
**Status**: ✅ Ready to use
