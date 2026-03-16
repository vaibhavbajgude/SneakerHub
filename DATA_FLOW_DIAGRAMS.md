# SneakerHub - Complete Data Flow Diagrams

## 🔄 End-to-End User Journeys

This document shows complete data flows for all major user journeys in SneakerHub.

---

## Journey 1: User Registration & Login

### 1A. Email/Password Registration Flow

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User   │     │ Frontend │     │ Backend  │     │ Database │
└────┬────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │               │                │                │
     │ 1. Fill form  │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │               │ 2. POST /api/auth/register     │
     │               │    {email, password,           │
     │               │     firstName, lastName}       │
     │               ├───────────────>│                │
     │               │                │                │
     │               │                │ 3. Validate input
     │               │                │    (email format,
     │               │                │     password length)
     │               │                │                │
     │               │                │ 4. Check email exists
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 5. Email available
     │               │                │<───────────────┤
     │               │                │                │
     │               │                │ 6. Hash password
     │               │                │    BCrypt.hash(pwd)
     │               │                │                │
     │               │                │ 7. Create User entity
     │               │                │    - role: USER
     │               │                │    - provider: LOCAL
     │               │                │    - enabled: true
     │               │                │                │
     │               │                │ 8. Save to DB  │
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 9. User saved  │
     │               │                │<───────────────┤
     │               │                │                │
     │               │                │ 10. Generate JWT
     │               │                │     token      │
     │               │                │                │
     │               │ 11. Return     │                │
     │               │     AuthResponse                │
     │               │     {token, user}               │
     │               │<───────────────┤                │
     │               │                │                │
     │               │ 12. Store token                 │
     │               │     localStorage                │
     │               │                │                │
     │ 13. Redirect  │                │                │
     │     to home   │                │                │
     │<──────────────┤                │                │
     │               │                │                │
```

### 1B. Google OAuth Registration/Login Flow

```
┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  User   │  │ Frontend │  │ Backend  │  │  Google  │  │ Database │
└────┬────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │            │              │             │             │
     │ 1. Click   │              │             │             │
     │ "Google"   │              │             │             │
     ├───────────>│              │             │             │
     │            │              │             │             │
     │            │ 2. Redirect to Google      │             │
     │            ├────────────────────────────>│             │
     │            │              │             │             │
     │ 3. Login & approve        │             │             │
     ├───────────────────────────────────────>│             │
     │            │              │             │             │
     │ 4. Callback with auth code│             │             │
     │<───────────────────────────────────────┤             │
     │            │              │             │             │
     │            │ 5. POST /api/auth/google   │             │
     │            │    {authCode}│             │             │
     │            ├─────────────>│             │             │
     │            │              │             │             │
     │            │              │ 6. Exchange code for token
     │            │              ├────────────>│             │
     │            │              │             │             │
     │            │              │ 7. User profile           │
     │            │              │<────────────┤             │
     │            │              │             │             │
     │            │              │ 8. Find user by email     │
     │            │              ├─────────────────────────>│
     │            │              │             │             │
     │            │              │ 9. User found/not found   │
     │            │              │<─────────────────────────┤
     │            │              │             │             │
     │            │              │ 10. If new: Create User   │
     │            │              │     provider: GOOGLE      │
     │            │              │     providerId: google_id │
     │            │              │     role: USER            │
     │            │              ├─────────────────────────>│
     │            │              │             │             │
     │            │              │ 11. Generate JWT          │
     │            │              │             │             │
     │            │ 12. Return AuthResponse    │             │
     │            │<─────────────┤             │             │
     │            │              │             │             │
     │ 13. Login  │              │             │             │
     │  success   │              │             │             │
     │<───────────┤              │             │             │
     │            │              │             │             │
```

---

## Journey 2: Browse & Add to Cart

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User   │     │ Frontend │     │ Backend  │     │ Database │
└────┬────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │               │                │                │
     │ 1. Browse     │                │                │
     │    products   │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │               │ 2. GET /api/products?page=0    │
     │               ├───────────────>│                │
     │               │                │                │
     │               │                │ 3. Query products
     │               │                │    with pagination
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 4. Products + variants
     │               │                │<───────────────┤
     │               │                │                │
     │               │ 5. Product list│                │
     │               │    with images │                │
     │               │<───────────────┤                │
     │               │                │                │
     │ 6. Display    │                │                │
     │    products   │                │                │
     │<──────────────┤                │                │
     │               │                │                │
     │ 7. Click      │                │                │
     │    product    │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │               │ 8. GET /api/products/{id}      │
     │               ├───────────────>│                │
     │               │                │                │
     │               │                │ 9. Get product + variants
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 10. Product details
     │               │                │<───────────────┤
     │               │                │                │
     │               │ 11. Product    │                │
     │               │     details    │                │
     │               │<───────────────┤                │
     │               │                │                │
     │ 12. Select    │                │                │
     │     size &    │                │                │
     │     color     │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │ 13. Click     │                │                │
     │     "Add to   │                │                │
     │      Cart"    │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │               │ 14. POST /api/cart/items       │
     │               │     Authorization: Bearer token│
     │               │     {productId, variantId,     │
     │               │      quantity}                 │
     │               ├───────────────>│                │
     │               │                │                │
     │               │                │ 15. Validate JWT
     │               │                │     Get user from token
     │               │                │                │
     │               │                │ 16. Find/Create cart
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 17. Cart found │
     │               │                │<───────────────┤
     │               │                │                │
     │               │                │ 18. Check if item exists
     │               │                │     (same product+variant)
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 19. Item exists?
     │               │                │<───────────────┤
     │               │                │                │
     │               │                │ 20. If exists: Update qty
     │               │                │     If new: Create CartItem
     │               │                │     - priceAtAdd = current price
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 21. Item saved │
     │               │                │<───────────────┤
     │               │                │                │
     │               │ 22. Cart updated                │
     │               │     {cartItems, total}          │
     │               │<───────────────┤                │
     │               │                │                │
     │ 23. Show      │                │                │
     │     success   │                │                │
     │     message   │                │                │
     │<──────────────┤                │                │
     │               │                │                │
```

---

## Journey 3: Checkout & Payment

```
┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  User   │  │ Frontend │  │ Backend  │  │ Razorpay │  │ Database │
└────┬────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │            │              │             │             │
     │ 1. Click   │              │             │             │
     │ "Checkout" │              │             │             │
     ├───────────>│              │             │             │
     │            │              │             │             │
     │            │ 2. GET /api/cart          │             │
     │            ├─────────────>│             │             │
     │            │              │             │             │
     │            │              │ 3. Get cart items         │
     │            │              ├─────────────────────────>│
     │            │              │             │             │
     │            │              │ 4. Cart data│             │
     │            │              │<─────────────────────────┤
     │            │              │             │             │
     │            │ 5. Cart items│             │             │
     │            │<─────────────┤             │             │
     │            │              │             │             │
     │ 6. Show    │              │             │             │
     │  checkout  │              │             │             │
     │  form      │              │             │             │
     │<───────────┤              │             │             │
     │            │              │             │             │
     │ 7. Fill    │              │             │             │
     │  shipping  │              │             │             │
     │  address   │              │             │             │
     ├───────────>│              │             │             │
     │            │              │             │             │
     │ 8. Click   │              │             │             │
     │ "Place     │              │             │             │
     │  Order"    │              │             │             │
     ├───────────>│              │             │             │
     │            │              │             │             │
     │            │ 9. POST /api/payment/create-order       │
     │            │    {items, shippingAddress, amount}     │
     │            ├─────────────>│             │             │
     │            │              │             │             │
     │            │              │ 10. Create Order entity   │
     │            │              │     - status: PENDING     │
     │            │              │     - orderNumber: ORD-XXX│
     │            │              │     - totalAmount         │
     │            │              ├─────────────────────────>│
     │            │              │             │             │
     │            │              │ 11. Order saved           │
     │            │              │<─────────────────────────┤
     │            │              │             │             │
     │            │              │ 12. Create OrderItems     │
     │            │              │     from CartItems        │
     │            │              │     (snapshot data)       │
     │            │              ├─────────────────────────>│
     │            │              │             │             │
     │            │              │ 13. Create Razorpay order │
     │            │              │     POST /v1/orders       │
     │            │              ├────────────>│             │
     │            │              │             │             │
     │            │              │ 14. razorpay_order_id     │
     │            │              │<────────────┤             │
     │            │              │             │             │
     │            │              │ 15. Create Payment entity │
     │            │              │     - status: CREATED     │
     │            │              │     - razorpayOrderId     │
     │            │              ├─────────────────────────>│
     │            │              │             │             │
     │            │ 16. Return order details   │             │
     │            │     {orderId, razorpayOrderId,          │
     │            │      amount, keyId}        │             │
     │            │<─────────────┤             │             │
     │            │              │             │             │
     │            │ 17. Initialize Razorpay    │             │
     │            │     checkout modal         │             │
     │            │              │             │             │
     │ 18. Razorpay modal opens  │             │             │
     │<───────────┤              │             │             │
     │            │              │             │             │
     │ 19. Enter  │              │             │             │
     │  payment   │              │             │             │
     │  details   │              │             │             │
     ├────────────────────────────────────────>│             │
     │            │              │             │             │
     │            │              │  20. Process payment      │
     │            │              │             │             │
     │ 21. Payment success callback            │             │
     │     {razorpay_payment_id,│             │             │
     │      razorpay_order_id,  │             │             │
     │      razorpay_signature} │             │             │
     │<────────────────────────────────────────┤             │
     │            │              │             │             │
     │            │ 22. POST /api/payment/verify            │
     │            │     {paymentId, orderId, signature}     │
     │            ├─────────────>│             │             │
     │            │              │             │             │
     │            │              │ 23. Verify signature      │
     │            │              │     HMAC_SHA256(          │
     │            │              │       order_id + "|" +    │
     │            │              │       payment_id,         │
     │            │              │       key_secret)         │
     │            │              │             │             │
     │            │              │ 24. Signature valid?      │
     │            │              │     ✓ Yes                 │
     │            │              │             │             │
     │            │              │ 25. Update Order          │
     │            │              │     - status: PAID        │
     │            │              │     - paidAt: now         │
     │            │              ├─────────────────────────>│
     │            │              │             │             │
     │            │              │ 26. Update Payment        │
     │            │              │     - razorpayPaymentId   │
     │            │              │     - razorpaySignature   │
     │            │              │     - status: CAPTURED    │
     │            │              │     - capturedAt: now     │
     │            │              ├─────────────────────────>│
     │            │              │             │             │
     │            │              │ 27. Clear Cart            │
     │            │              │     DELETE cart_items     │
     │            │              ├─────────────────────────>│
     │            │              │             │             │
     │            │              │ 28. Update variant stock  │
     │            │              │     stock = stock - qty   │
     │            │              ├─────────────────────────>│
     │            │              │             │             │
     │            │ 29. Success response       │             │
     │            │     {success: true,        │             │
     │            │      orderNumber}          │             │
     │            │<─────────────┤             │             │
     │            │              │             │             │
     │ 30. Redirect to order     │             │             │
     │     confirmation          │             │             │
     │<───────────┤              │             │             │
     │            │              │             │             │
```

---

## Journey 4: Order Tracking

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User   │     │ Frontend │     │ Backend  │     │ Database │
└────┬────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │               │                │                │
     │ 1. Click      │                │                │
     │ "My Orders"   │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │               │ 2. GET /api/orders?page=0      │
     │               │    Authorization: Bearer token │
     │               ├───────────────>│                │
     │               │                │                │
     │               │                │ 3. Get user from JWT
     │               │                │                │
     │               │                │ 4. Query orders
     │               │                │    WHERE userId = ?
     │               │                │    ORDER BY createdAt DESC
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 5. Orders list │
     │               │                │<───────────────┤
     │               │                │                │
     │               │ 6. Orders with │                │
     │               │    status      │                │
     │               │<───────────────┤                │
     │               │                │                │
     │ 7. Display    │                │                │
     │    orders     │                │                │
     │<──────────────┤                │                │
     │               │                │                │
     │ 8. Click      │                │                │
     │    order      │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │               │ 9. GET /api/orders/{id}        │
     │               ├───────────────>│                │
     │               │                │                │
     │               │                │ 10. Get order with items
     │               │                │     JOIN order_items
     │               │                │     JOIN payments
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 11. Order details
     │               │                │<───────────────┤
     │               │                │                │
     │               │ 12. Order      │                │
     │               │     details    │                │
     │               │<───────────────┤                │
     │               │                │                │
     │ 13. Show      │                │                │
     │     order     │                │                │
     │     details   │                │                │
     │     - Items   │                │                │
     │     - Status  │                │                │
     │     - Tracking│                │                │
     │<──────────────┤                │                │
     │               │                │                │
```

---

## Journey 5: Product Management (OWNER)

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Owner   │     │ Frontend │     │ Backend  │     │ Database │
└────┬────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │               │                │                │
     │ 1. Click      │                │                │
     │ "Add Product" │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │ 2. Show       │                │                │
     │    product    │                │                │
     │    form       │                │                │
     │<──────────────┤                │                │
     │               │                │                │
     │ 3. Fill form  │                │                │
     │    - Name     │                │                │
     │    - Brand    │                │                │
     │    - Price    │                │                │
     │    - Images   │                │                │
     │    - Variants │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │ 4. Submit     │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │               │ 5. POST /api/products          │
     │               │    Authorization: Bearer token │
     │               │    {name, brand, price,        │
     │               │     variants: [{size, color,   │
     │               │                  stock}]}      │
     │               ├───────────────>│                │
     │               │                │                │
     │               │                │ 6. Validate JWT
     │               │                │    Check role: OWNER/ADMIN
     │               │                │                │
     │               │                │ 7. Validate input
     │               │                │    (required fields,
     │               │                │     price > 0, etc)
     │               │                │                │
     │               │                │ 8. Create Product
     │               │                │    - ownerId = current user
     │               │                │    - active = true
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 9. Product saved
     │               │                │<───────────────┤
     │               │                │                │
     │               │                │ 10. Create ProductVariants
     │               │                │     for each size/color
     │               │                │     - Generate SKU
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 11. Variants saved
     │               │                │<───────────────┤
     │               │                │                │
     │               │ 12. Product created             │
     │               │     {id, name, variants}        │
     │               │<───────────────┤                │
     │               │                │                │
     │ 13. Success   │                │                │
     │     message   │                │                │
     │<──────────────┤                │                │
     │               │                │                │
```

---

## Journey 6: Admin - Order Management

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Admin   │     │ Frontend │     │ Backend  │     │ Database │
└────┬────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │               │                │                │
     │ 1. Access     │                │                │
     │    admin      │                │                │
     │    dashboard  │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │               │ 2. GET /api/admin/orders       │
     │               │    Authorization: Bearer token │
     │               ├───────────────>│                │
     │               │                │                │
     │               │                │ 3. Check role: ADMIN
     │               │                │                │
     │               │                │ 4. Get all orders
     │               │                │    with pagination
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 5. All orders  │
     │               │                │<───────────────┤
     │               │                │                │
     │               │ 6. Orders list │                │
     │               │<───────────────┤                │
     │               │                │                │
     │ 7. Display    │                │                │
     │    all orders │                │                │
     │<──────────────┤                │                │
     │               │                │                │
     │ 8. Select     │                │                │
     │    order      │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │ 9. Change     │                │                │
     │    status to  │                │                │
     │    "SHIPPED"  │                │                │
     ├──────────────>│                │                │
     │               │                │                │
     │               │ 10. PUT /api/admin/orders/{id}/status
     │               │     {status: "SHIPPED"}        │
     │               ├───────────────>│                │
     │               │                │                │
     │               │                │ 11. Check role: ADMIN
     │               │                │                │
     │               │                │ 12. Update order
     │               │                │     - status = SHIPPED
     │               │                │     - shippedAt = now
     │               │                ├───────────────>│
     │               │                │                │
     │               │                │ 13. Order updated
     │               │                │<───────────────┤
     │               │                │                │
     │               │                │ 14. Send email
     │               │                │     notification
     │               │                │     to customer
     │               │                │                │
     │               │ 15. Success    │                │
     │               │<───────────────┤                │
     │               │                │                │
     │ 16. Updated   │                │                │
     │     status    │                │                │
     │<──────────────┤                │                │
     │               │                │                │
```

---

**End of Data Flow Diagrams**

*These diagrams show the complete request/response flow for all major user journeys in SneakerHub.*
