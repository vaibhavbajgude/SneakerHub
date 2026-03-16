# SneakerHub - Entity Relationships Explained

## 📊 Complete Entity Relationship Overview

This document provides a detailed explanation of all entity relationships in the SneakerHub system.

---

## 🔗 Entity Relationships Summary

### 1. User ↔ Product (One-to-Many)

**Relationship**: One User (OWNER) can own multiple Products

```
User (OWNER)
    │
    │ owns (1:N)
    │
    ▼
Product (many)
```

**Explanation**:
- When a user has the role `OWNER`, they can create and manage products
- Each product has an `ownerId` foreign key pointing to the User
- This allows product owners to manage their own inventory
- Admins can manage all products regardless of ownership

**Database**:
```sql
products.ownerId → users.id
```

**Use Cases**:
- Owner creates a new sneaker listing
- Owner updates their product details
- Owner views all their products
- System tracks which owner owns which products

---

### 2. Product ↔ ProductVariant (One-to-Many)

**Relationship**: One Product has multiple ProductVariants (size/color combinations)

```
Product
    │
    │ has variants (1:N)
    │
    ▼
ProductVariant (many)
  - Size: 7, Color: Black
  - Size: 8, Color: Black
  - Size: 7, Color: White
  - Size: 8, Color: White
```

**Explanation**:
- A single sneaker product (e.g., "Nike Air Max 90") has multiple variants
- Each variant represents a unique size + color combination
- Each variant has its own stock count
- Each variant has a unique SKU (Stock Keeping Unit)
- Variants can have additional pricing (e.g., special colors cost more)

**Database**:
```sql
product_variants.productId → products.id
UNIQUE CONSTRAINT (productId, size, color)
```

**Use Cases**:
- Customer selects "Size 9, Black" variant
- System checks stock for specific variant
- Owner updates stock for "Size 10, Red"
- Cart stores which exact variant was selected

**Example**:
```
Product: Nike Air Jordan 1
├── Variant 1: Size 7, Black, Stock: 10, SKU: SNK-123-7-BLK
├── Variant 2: Size 8, Black, Stock: 5,  SKU: SNK-123-8-BLK
├── Variant 3: Size 9, White, Stock: 0,  SKU: SNK-123-9-WHT (Out of stock)
└── Variant 4: Size 10, Red, Stock: 15, SKU: SNK-123-10-RED
```

---

### 3. User ↔ Cart (One-to-One)

**Relationship**: Each User has exactly one Cart

```
User
  │
  │ has (1:1)
  │
  ▼
Cart
```

**Explanation**:
- Every authenticated user has a persistent shopping cart
- The cart is created when the user first adds an item
- The cart persists across sessions (stored in database)
- When user logs out and logs back in, their cart is restored

**Database**:
```sql
carts.userId → users.id (UNIQUE)
```

**Use Cases**:
- User adds items to cart
- User logs out, logs back in → cart is still there
- User proceeds to checkout → cart items become order items
- After order is placed → cart is cleared

---

### 4. Cart ↔ CartItem (One-to-Many)

**Relationship**: One Cart contains multiple CartItems

```
Cart
  │
  │ contains (1:N)
  │
  ▼
CartItem (many)
  - Product A, Variant 1, Qty: 2
  - Product B, Variant 3, Qty: 1
  - Product C, Variant 2, Qty: 3
```

**Explanation**:
- Each item in the cart is a separate CartItem entity
- CartItem stores: product reference, variant reference, quantity, price snapshot
- Price is captured at the time of adding to cart (priceAtAdd)
- If product price changes later, cart still shows original price

**Database**:
```sql
cart_items.cartId → carts.id
cart_items.productId → products.id
cart_items.variantId → product_variants.id
```

**Use Cases**:
- User adds "Nike Air Max, Size 9, Black" to cart
- User increases quantity of an existing cart item
- User removes an item from cart
- System calculates cart total from all cart items

---

### 5. CartItem ↔ Product (Many-to-One)

**Relationship**: Multiple CartItems can reference the same Product

```
Product: Nike Air Max
    ▲
    │ referenced by (N:1)
    │
CartItem (many users' carts)
  - User A's cart: Nike Air Max, Size 9
  - User B's cart: Nike Air Max, Size 10
  - User C's cart: Nike Air Max, Size 9
```

**Explanation**:
- Many different users can have the same product in their carts
- CartItem stores a reference to the product
- Product details are fetched when displaying cart
- If product is deleted, cart items need to be handled (cascade or soft delete)

**Database**:
```sql
cart_items.productId → products.id
```

---

### 6. CartItem ↔ ProductVariant (Many-to-One)

**Relationship**: Multiple CartItems can reference the same ProductVariant

```
ProductVariant: Nike Air Max, Size 9, Black
    ▲
    │ referenced by (N:1)
    │
CartItem (many)
  - User A: Qty 1
  - User B: Qty 2
  - User C: Qty 1
```

**Explanation**:
- CartItem must specify which exact variant (size + color)
- This ensures correct stock is reserved
- When checking out, system verifies variant stock availability

**Database**:
```sql
cart_items.variantId → product_variants.id
```

---

### 7. User ↔ Order (One-to-Many)

**Relationship**: One User can place multiple Orders

```
User
  │
  │ places (1:N)
  │
  ▼
Order (many)
  - Order #1: ORD-ABC123, Status: DELIVERED
  - Order #2: ORD-DEF456, Status: SHIPPED
  - Order #3: ORD-GHI789, Status: PENDING
```

**Explanation**:
- Users can place unlimited orders over time
- Each order has a unique order number
- Orders track shipping address, status, payment info
- Order history is maintained for user reference

**Database**:
```sql
orders.userId → users.id
```

**Use Cases**:
- User views their order history
- User tracks a specific order
- Admin views all orders for a user
- System sends order confirmation email

---

### 8. Order ↔ OrderItem (One-to-Many)

**Relationship**: One Order contains multiple OrderItems

```
Order: ORD-ABC123
  │
  │ contains (1:N)
  │
  ▼
OrderItem (many)
  - Nike Air Max, Size 9, Black, Qty: 1, Price: $120
  - Adidas Ultraboost, Size 10, White, Qty: 2, Price: $180
  - Puma Suede, Size 8, Red, Qty: 1, Price: $80
```

**Explanation**:
- Each product in an order is a separate OrderItem
- OrderItem captures a **snapshot** of product data at order time
- Stores: productName, brand, size, color, price, quantity
- Even if product is later deleted/modified, order history remains intact

**Database**:
```sql
order_items.orderId → orders.id
order_items.productId → products.id (for reference)
```

**Why Snapshot?**
- Product price might change after order is placed
- Product might be deleted
- Order must show what was actually purchased at that time

---

### 9. OrderItem ↔ Product (Many-to-One)

**Relationship**: Multiple OrderItems can reference the same Product

```
Product: Nike Air Max
    ▲
    │ referenced by (N:1)
    │
OrderItem (many orders)
  - Order #1: Qty 1, Price: $120 (purchased Jan 1)
  - Order #2: Qty 2, Price: $110 (purchased Feb 1, on sale)
  - Order #3: Qty 1, Price: $120 (purchased Mar 1)
```

**Explanation**:
- Many customers can order the same product
- Each order item stores the price at the time of purchase
- Product reference is kept for analytics and reporting

**Database**:
```sql
order_items.productId → products.id
```

---

### 10. Order ↔ Payment (One-to-One)

**Relationship**: Each Order has exactly one Payment transaction

```
Order: ORD-ABC123
  │
  │ has payment (1:1)
  │
  ▼
Payment
  - Razorpay Order ID: order_xyz
  - Razorpay Payment ID: pay_123
  - Amount: $380
  - Status: CAPTURED
  - Method: UPI
```

**Explanation**:
- Every order that requires payment has one Payment entity
- Payment stores all Razorpay transaction details
- Payment status tracks the payment lifecycle
- Payment signature is verified for security

**Database**:
```sql
payments.orderId → orders.id (UNIQUE)
```

**Payment Flow**:
1. Order created → Payment created with status: CREATED
2. User pays → Payment updated with razorpayPaymentId
3. Backend verifies → Payment status: CAPTURED
4. Order status updated → PAID

---

## 🎯 Complete Relationship Chain Example

Let's trace a complete user journey:

### Step 1: User Registration
```
User created
  - id: 1
  - email: john@example.com
  - role: USER
  - provider: LOCAL
```

### Step 2: Browse Products
```
Product: Nike Air Jordan 1
  - id: 10
  - ownerId: 5 (another user who is OWNER)
  - price: $150
  
  ProductVariants:
    - id: 101, size: 9, color: Black, stock: 10
    - id: 102, size: 10, color: Black, stock: 5
    - id: 103, size: 9, color: White, stock: 8
```

### Step 3: Add to Cart
```
Cart created for User
  - id: 1
  - userId: 1

CartItem added
  - id: 1
  - cartId: 1
  - productId: 10
  - variantId: 101 (Size 9, Black)
  - quantity: 1
  - priceAtAdd: $150
```

### Step 4: Checkout
```
Order created
  - id: 1
  - orderNumber: ORD-ABC123
  - userId: 1
  - totalAmount: $150
  - status: PENDING
  - shippingAddress: "123 Main St..."

OrderItem created (from CartItem)
  - id: 1
  - orderId: 1
  - productId: 10
  - quantity: 1
  - price: $150
  - size: 9
  - color: Black
  - productName: "Nike Air Jordan 1"
  - productBrand: "Nike"

Payment created
  - id: 1
  - orderId: 1
  - amount: $150
  - status: CREATED
  - razorpayOrderId: order_xyz123
```

### Step 5: Payment Success
```
Payment updated
  - razorpayPaymentId: pay_abc456
  - razorpaySignature: signature_hash
  - status: CAPTURED
  - method: UPI
  - capturedAt: 2026-02-09 13:00:00

Order updated
  - status: PAID
  - paidAt: 2026-02-09 13:00:00

Cart cleared
  - All CartItems deleted

ProductVariant stock updated
  - Variant 101 stock: 10 → 9
```

### Step 6: Order Fulfillment
```
Order updated (by ADMIN)
  - status: SHIPPED
  - shippedAt: 2026-02-10 10:00:00

Order updated (by ADMIN)
  - status: DELIVERED
  - deliveredAt: 2026-02-12 15:00:00
```

---

## 📋 Relationship Constraints

### Cascade Behaviors

| Parent | Child | On Delete | On Update |
|--------|-------|-----------|-----------|
| User | Product | RESTRICT* | CASCADE |
| Product | ProductVariant | CASCADE | CASCADE |
| User | Cart | CASCADE | CASCADE |
| Cart | CartItem | CASCADE | CASCADE |
| User | Order | RESTRICT* | CASCADE |
| Order | OrderItem | CASCADE | CASCADE |
| Order | Payment | CASCADE | CASCADE |

*RESTRICT: Cannot delete if child records exist (must handle manually)

### Unique Constraints

- `users.email` - One email per user
- `product_variants.sku` - One SKU per variant
- `product_variants(productId, size, color)` - No duplicate variants
- `orders.orderNumber` - Unique order numbers
- `carts.userId` - One cart per user
- `payments.orderId` - One payment per order
- `payments.razorpayOrderId` - Unique Razorpay order IDs

---

## 🔍 Query Examples

### Get User's Cart with All Details
```sql
SELECT 
    ci.id,
    p.name AS productName,
    pv.size,
    pv.color,
    ci.quantity,
    ci.priceAtAdd,
    (ci.quantity * ci.priceAtAdd) AS subtotal
FROM cart_items ci
JOIN carts c ON ci.cartId = c.id
JOIN products p ON ci.productId = p.id
JOIN product_variants pv ON ci.variantId = pv.id
WHERE c.userId = ?
```

### Get Order Details with Items
```sql
SELECT 
    o.orderNumber,
    o.status,
    o.totalAmount,
    oi.productName,
    oi.size,
    oi.color,
    oi.quantity,
    oi.price,
    p.status AS paymentStatus
FROM orders o
LEFT JOIN order_items oi ON oi.orderId = o.id
LEFT JOIN payments p ON p.orderId = o.id
WHERE o.userId = ?
ORDER BY o.createdAt DESC
```

### Get Product with Available Variants
```sql
SELECT 
    p.name,
    p.brand,
    p.price,
    pv.size,
    pv.color,
    pv.stock,
    pv.sku
FROM products p
JOIN product_variants pv ON pv.productId = p.id
WHERE p.id = ? AND pv.stock > 0
ORDER BY pv.size, pv.color
```

---

## 🎨 Visual Entity Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    SNEAKERHUB ENTITY MAP                         │
└─────────────────────────────────────────────────────────────────┘

                        ┌──────────┐
                        │   USER   │
                        │  (Core)  │
                        └────┬─────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            │ owns (1:N)     │ has (1:1)      │ places (1:N)
            │                │                │
            ▼                ▼                ▼
      ┌──────────┐     ┌──────────┐    ┌──────────┐
      │ PRODUCT  │     │   CART   │    │  ORDER   │
      │          │     │          │    │          │
      └────┬─────┘     └────┬─────┘    └────┬─────┘
           │                │               │
           │ has (1:N)      │ contains      │ contains (1:N)
           │                │ (1:N)         │
           ▼                ▼               ▼
      ┌──────────┐     ┌──────────┐    ┌──────────┐
      │ PRODUCT  │     │   CART   │    │  ORDER   │
      │ VARIANT  │◄────┤   ITEM   │    │   ITEM   │
      │          │     │          │    │          │
      └──────────┘     └──────────┘    └──────────┘
           ▲                │               │
           │                │ refs (N:1)    │ refs (N:1)
           │                │               │
           └────────────────┴───────────────┘
                            │
                            │
                            ▼
                      ┌──────────┐
                      │ PRODUCT  │
                      │          │
                      └──────────┘

                      ┌──────────┐
                      │  ORDER   │
                      │          │
                      └────┬─────┘
                           │
                           │ has (1:1)
                           │
                           ▼
                      ┌──────────┐
                      │ PAYMENT  │
                      │(Razorpay)│
                      └──────────┘
```

---

**End of Entity Relationships Document**

*This document explains all entity relationships in the SneakerHub system.*
