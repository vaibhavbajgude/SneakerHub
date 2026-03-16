# SneakerHub - JPA Entities Documentation

## ✅ All Entities Created

### 📊 Entity Overview

| Entity | Description | Key Relationships |
|--------|-------------|-------------------|
| **User** | System users (customers, owners, admins) | OneToOne → Cart, OneToMany → Orders |
| **Sneaker** | Sneaker products | OneToMany → SneakerVariants |
| **SneakerVariant** | Size/color variants of sneakers | ManyToOne → Sneaker |
| **Cart** | User shopping cart | OneToOne → User, OneToMany → CartItems |
| **CartItem** | Items in cart | ManyToOne → Cart, ManyToOne → SneakerVariant |
| **Order** | Customer orders | ManyToOne → User, OneToMany → OrderItems, OneToOne → Payment |
| **OrderItem** | Items in order | ManyToOne → Order, ManyToOne → SneakerVariant |
| **Payment** | Payment transactions | OneToOne → Order |

### 🔧 Enums Created

| Enum | Values | Purpose |
|------|--------|---------|
| **Role** | USER, OWNER, ADMIN | User roles |
| **OrderStatus** | PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED | Order lifecycle |
| **PaymentStatus** | PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED | Payment status |
| **PaymentMethod** | RAZORPAY, CARD, UPI, NET_BANKING, WALLET, COD | Payment methods |
| **AuthProvider** | LOCAL, GOOGLE | Authentication providers |

---

## 📁 Entity Details

### 1. User Entity
**File**: `User.java`

**Fields**:
- `id` (Long) - Primary key
- `email` (String) - Unique, required
- `password` (String) - Required
- `firstName`, `lastName` (String) - Required
- `phoneNumber` (String) - Optional
- `role` (Role enum) - Default: USER
- `provider` (AuthProvider enum) - Default: LOCAL
- `providerId` (String) - For OAuth
- `enabled`, `accountNonExpired`, `accountNonLocked`, `credentialsNonExpired` (boolean) - Security flags
- `createdAt`, `updatedAt` (LocalDateTime) - Auditing

**Relationships**:
- OneToOne → Cart
- OneToMany → Orders

**Implements**: `UserDetails` (Spring Security)

---

### 2. Sneaker Entity
**File**: `Sneaker.java`

**Fields**:
- `id` (Long) - Primary key
- `name` (String) - Required
- `brand` (String) - Required
- `description` (String) - Max 2000 chars
- `basePrice` (BigDecimal) - Required
- `category` (String) - Required
- `color`, `material` (String)
- `imageUrl` (String) - Main image
- `additionalImages` (List<String>) - Multiple images
- `active` (boolean) - Default: true
- `featured` (boolean) - Default: false
- `createdAt`, `updatedAt` (LocalDateTime) - Auditing

**Relationships**:
- OneToMany → SneakerVariants

**Helper Methods**:
- `addVariant(SneakerVariant)`
- `removeVariant(SneakerVariant)`

---

### 3. SneakerVariant Entity
**File**: `SneakerVariant.java`

**Fields**:
- `id` (Long) - Primary key
- `size` (String) - Required (e.g., "8", "9.5")
- `colorVariant` (String) - Optional
- `stockQuantity` (Integer) - Default: 0
- `price` (BigDecimal) - Required
- `discountPrice` (BigDecimal) - Optional
- `variantImageUrl` (String)
- `sku` (String) - Stock Keeping Unit
- `available` (boolean) - Default: true
- `createdAt`, `updatedAt` (LocalDateTime) - Auditing

**Relationships**:
- ManyToOne → Sneaker

**Unique Constraint**: (sneaker_id, size, color_variant)

**Helper Methods**:
- `isInStock()` - Check availability
- `decreaseStock(int)` - Reduce stock
- `increaseStock(int)` - Add stock
- `getEffectivePrice()` - Get discount or regular price

---

### 4. Cart Entity
**File**: `Cart.java`

**Fields**:
- `id` (Long) - Primary key
- `createdAt`, `updatedAt` (LocalDateTime) - Auditing

**Relationships**:
- OneToOne → User (unique)
- OneToMany → CartItems

**Helper Methods**:
- `addItem(CartItem)`
- `removeItem(CartItem)`
- `clearCart()`
- `getTotalPrice()` - Calculate total
- `getTotalItems()` - Count items
- `isEmpty()` - Check if empty

---

### 5. CartItem Entity
**File**: `CartItem.java`

**Fields**:
- `id` (Long) - Primary key
- `quantity` (Integer) - Default: 1
- `price` (BigDecimal) - Price at time of adding
- `createdAt`, `updatedAt` (LocalDateTime) - Auditing

**Relationships**:
- ManyToOne → Cart
- ManyToOne → SneakerVariant (EAGER)

**Unique Constraint**: (cart_id, sneaker_variant_id)

**Helper Methods**:
- `getSubtotal()` - Calculate item total
- `increaseQuantity(int)`
- `decreaseQuantity(int)`
- `updatePrice(BigDecimal)`

---

### 6. Order Entity
**File**: `Order.java`

**Fields**:
- `id` (Long) - Primary key
- `orderNumber` (String) - Unique (e.g., ORD-20260209-001)
- `status` (OrderStatus enum) - Default: PENDING
- `subtotal`, `tax`, `shippingFee`, `totalAmount`, `discount` (BigDecimal)
- Shipping address fields (name, phone, address lines, city, state, postal code, country)
- `trackingNumber` (String)
- `shippedAt`, `deliveredAt`, `cancelledAt` (LocalDateTime)
- `cancellationReason`, `notes` (String)
- `createdAt`, `updatedAt` (LocalDateTime) - Auditing

**Relationships**:
- ManyToOne → User
- OneToMany → OrderItems
- OneToOne → Payment

**Helper Methods**:
- `addOrderItem(OrderItem)`
- `removeOrderItem(OrderItem)`
- `calculateTotalAmount()` - Calculate order total
- `markAsShipped(String)` - Update to shipped
- `markAsDelivered()` - Update to delivered
- `markAsCancelled(String)` - Cancel order
- `canBeCancelled()` - Check if cancellable
- `getTotalItems()` - Count items

---

### 7. OrderItem Entity
**File**: `OrderItem.java`

**Fields**:
- `id` (Long) - Primary key
- Snapshot fields: `sneakerName`, `sneakerBrand`, `size`, `colorVariant`
- `quantity` (Integer) - Required
- `price` (BigDecimal) - Price per unit at order time
- `discount` (BigDecimal) - Optional
- `imageUrl` (String) - Product image snapshot
- `createdAt`, `updatedAt` (LocalDateTime) - Auditing

**Relationships**:
- ManyToOne → Order
- ManyToOne → SneakerVariant (EAGER)

**Helper Methods**:
- `getSubtotal()` - Calculate item total with discount
- `getDiscountAmount()` - Get discount value

---

### 8. Payment Entity
**File**: `Payment.java`

**Fields**:
- `id` (Long) - Primary key
- `transactionId` (String) - Unique
- `paymentMethod` (PaymentMethod enum) - Default: RAZORPAY
- `status` (PaymentStatus enum) - Default: PENDING
- `amount` (BigDecimal) - Required
- `currency` (String) - Default: "INR"
- Razorpay fields: `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`
- `gatewayResponse` (String) - Max 2000 chars
- Payment details: `cardLast4`, `cardBrand`, `upiId`, `bankName`
- Refund fields: `refundId`, `refundAmount`, `refundedAt`, `refundReason`
- `paidAt`, `failedAt`, `failureReason` (timestamps)
- `createdAt`, `updatedAt` (LocalDateTime) - Auditing

**Relationships**:
- OneToOne → Order (unique)

**Helper Methods**:
- `markAsCompleted(String, String)` - Mark payment successful
- `markAsFailed(String)` - Mark payment failed
- `markAsRefunded(String, BigDecimal, String)` - Process refund
- `isSuccessful()` - Check if completed
- `canBeRefunded()` - Check refund eligibility

---

## 🔄 Entity Relationships Diagram

```
User (1) ←→ (1) Cart
  ↓ (1:N)
Order (1) ←→ (1) Payment
  ↓ (1:N)
OrderItem (N) → (1) SneakerVariant
                      ↑ (N:1)
                   Sneaker

Cart (1) → (N) CartItem (N) → (1) SneakerVariant
```

---

## ✨ Key Features Implemented

### ✅ Proper Relationships
- `@OneToOne` - User ↔ Cart, Order ↔ Payment
- `@OneToMany` - User → Orders, Sneaker → Variants, Cart → CartItems, Order → OrderItems
- `@ManyToOne` - CartItem → Cart, OrderItem → Order, Variant → Sneaker

### ✅ Enums
- `Role` - User roles
- `OrderStatus` - Order lifecycle
- `PaymentStatus` - Payment states
- `PaymentMethod` - Payment options
- `AuthProvider` - Auth methods

### ✅ Auditing Fields
- `@CreatedDate` - `createdAt` (auto-populated on creation)
- `@LastModifiedDate` - `updatedAt` (auto-updated on modification)
- `@EntityListeners(AuditingEntityListener.class)` on all entities

### ✅ Additional Features
- **Unique Constraints**: Email, order number, transaction ID, cart-variant combinations
- **Cascade Operations**: Proper cascade types for parent-child relationships
- **Orphan Removal**: Automatic cleanup of orphaned records
- **Fetch Strategies**: LAZY for large objects, EAGER where needed
- **Helper Methods**: Business logic methods on entities
- **Snapshot Pattern**: OrderItem stores product details at order time
- **Stock Management**: Variant stock tracking methods
- **Price Calculations**: Subtotal, discount, and total calculations

---

## 🚀 Configuration Required

### Enable JPA Auditing
**File**: `JpaConfig.java` ✅ Created

```java
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    // Enables @CreatedDate and @LastModifiedDate
}
```

This configuration is **required** for auditing fields to work!

---

## 📝 Next Steps

1. ✅ **Entities Created** - All 8 entities + 4 enums
2. ✅ **JPA Auditing Enabled** - Configuration added
3. ⏭️ **Create Repositories** - JPA repositories for each entity
4. ⏭️ **Create DTOs** - Request/Response objects
5. ⏭️ **Create Services** - Business logic layer
6. ⏭️ **Create Controllers** - REST API endpoints

---

## 🗂️ Files Created

### Entities (8 files)
1. `User.java` ✅
2. `Sneaker.java` ✅
3. `SneakerVariant.java` ✅
4. `Cart.java` ✅
5. `CartItem.java` ✅
6. `Order.java` ✅
7. `OrderItem.java` ✅
8. `Payment.java` ✅

### Enums (4 files)
1. `Role.java` ✅
2. `OrderStatus.java` ✅
3. `PaymentStatus.java` ✅
4. `PaymentMethod.java` ✅

### Configuration (1 file)
1. `JpaConfig.java` ✅

**Total**: 13 files created

---

**Created**: 2026-02-09  
**Status**: ✅ Complete  
**Ready for**: Repository layer implementation
