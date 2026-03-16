# Razorpay Payment Integration - Complete Guide

## ✅ **Implementation Complete**

### 📦 **Components Created**

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| **RazorpayConfig** | `RazorpayConfig.java` | Razorpay client configuration | ✅ |
| **PaymentService** | `PaymentService.java` | Payment business logic | ✅ |
| **PaymentController** | `PaymentController.java` | Payment REST APIs | ✅ |
| **Payment DTOs** | 4 DTO files | Request/Response models | ✅ |

**Total**: **7 new files**

---

## 🔐 **How It Works**

### Payment Flow

```
1. User places order
   ↓
2. Frontend calls: POST /api/payments/create-order/{orderId}
   ↓
3. Backend creates Razorpay order
   ↓
4. Backend returns: razorpayOrderId, amount, keyId
   ↓
5. Frontend opens Razorpay checkout
   ↓
6. User completes payment on Razorpay
   ↓
7. Razorpay returns: paymentId, orderId, signature
   ↓
8. Frontend calls: POST /api/payments/verify
   ↓
9. Backend verifies signature
   ↓
10. If valid:
    - Mark payment as COMPLETED
    - Update order status to CONFIRMED
    - Return success
    ↓
11. If invalid:
    - Mark payment as FAILED
    - Return error
```

---

## ⚙️ **Configuration**

### 1. Razorpay Dashboard Setup

#### Step 1: Create Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up / Login
3. Complete KYC verification

#### Step 2: Get API Keys
1. Go to **Settings** → **API Keys**
2. Click **Generate Test Key** (for testing)
3. Copy **Key ID** and **Key Secret**

**Test Mode Keys:**
- Key ID: `rzp_test_XXXXXXXXXXXX`
- Key Secret: `YYYYYYYYYYYYYYYY`

**Live Mode Keys:**
- Key ID: `rzp_live_XXXXXXXXXXXX`
- Key Secret: `YYYYYYYYYYYYYYYY`

---

### 2. Backend Configuration

#### application.yml
```yaml
razorpay:
  key-id: ${RAZORPAY_KEY_ID:rzp_test_XXXXXXXXXXXX}
  key-secret: ${RAZORPAY_KEY_SECRET:YYYYYYYYYYYYYYYY}
```

#### Environment Variables (.env)
```env
# Razorpay API Keys
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
```

**⚠️ IMPORTANT**: Never commit API keys to version control!

---

### 3. Maven Dependency

Already added in `pom.xml`:
```xml
<dependency>
    <groupId>com.razorpay</groupId>
    <artifactId>razorpay-java</artifactId>
    <version>1.4.6</version>
</dependency>
```

---

## 📡 **API Endpoints**

### 1. Create Payment Order

**Endpoint**: `POST /api/payments/create-order/{orderId}`  
**Access**: USER, OWNER, ADMIN  
**Description**: Create Razorpay order for payment

**Request:**
```http
POST /api/payments/create-order/1
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "razorpayOrderId": "order_MN1234567890AB",
    "amount": 30727.64,
    "currency": "INR",
    "keyId": "rzp_test_XXXXXXXXXXXX",
    "orderId": 1,
    "orderNumber": "ORD-20260209200000",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890"
  }
}
```

---

### 2. Verify Payment

**Endpoint**: `POST /api/payments/verify`  
**Access**: USER, OWNER, ADMIN  
**Description**: Verify Razorpay payment signature

**Request:**
```http
POST /api/payments/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": 1,
  "razorpayOrderId": "order_MN1234567890AB",
  "razorpayPaymentId": "pay_MN1234567890CD",
  "razorpaySignature": "abc123def456..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "id": 1,
    "orderId": 1,
    "orderNumber": "ORD-20260209200000",
    "transactionId": "TXN-1707502800000",
    "paymentMethod": "RAZORPAY",
    "status": "COMPLETED",
    "amount": 30727.64,
    "currency": "INR",
    "razorpayOrderId": "order_MN1234567890AB",
    "razorpayPaymentId": "pay_MN1234567890CD",
    "razorpaySignature": "abc123def456...",
    "paidAt": "2026-02-09T20:30:00",
    "createdAt": "2026-02-09T20:00:00"
  }
}
```

---

### 3. Get Payment by Order

**Endpoint**: `GET /api/payments/order/{orderId}`  
**Access**: USER, OWNER, ADMIN  
**Description**: Get payment details for an order

**Request:**
```http
GET /api/payments/order/1
Authorization: Bearer {token}
```

---

### 4. Get All Payments (Admin)

**Endpoint**: `GET /api/payments/admin/all`  
**Access**: ADMIN  
**Description**: Get all payment records

**Request:**
```http
GET /api/payments/admin/all
Authorization: Bearer {token}
```

---

### 5. Get Payments by Status (Admin)

**Endpoint**: `GET /api/payments/admin/status/{status}`  
**Access**: ADMIN  
**Description**: Filter payments by status

**Request:**
```http
GET /api/payments/admin/status/COMPLETED
Authorization: Bearer {token}
```

**Statuses**: `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`

---

### 6. Process Refund (Admin)

**Endpoint**: `POST /api/payments/admin/{paymentId}/refund`  
**Access**: ADMIN  
**Description**: Process payment refund

**Request:**
```http
POST /api/payments/admin/1/refund?amount=30727.64&reason=Customer request
Authorization: Bearer {token}
```

---

## 🌐 **Frontend Integration**

### React/Vue/Angular Example

#### 1. Load Razorpay Script
```html
<!-- Add in index.html -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

#### 2. Create Payment Order
```javascript
async function initiatePayment(orderId) {
  try {
    // Step 1: Create Razorpay order
    const response = await fetch(`/api/payments/create-order/${orderId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    const paymentData = result.data;

    // Step 2: Open Razorpay checkout
    const options = {
      key: paymentData.keyId,
      amount: paymentData.amount * 100, // Amount in paise
      currency: paymentData.currency,
      name: 'SneakerHub',
      description: `Order #${paymentData.orderNumber}`,
      order_id: paymentData.razorpayOrderId,
      
      // Prefill customer details
      prefill: {
        name: paymentData.customerName,
        email: paymentData.customerEmail,
        contact: paymentData.customerPhone
      },
      
      // Theme
      theme: {
        color: '#3399cc'
      },
      
      // Success handler
      handler: function(response) {
        verifyPayment(orderId, response);
      },
      
      // Modal close handler
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled');
        }
      }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error('Payment initiation failed:', error);
  }
}
```

#### 3. Verify Payment
```javascript
async function verifyPayment(orderId, razorpayResponse) {
  try {
    const response = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: orderId,
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpaySignature: razorpayResponse.razorpay_signature
      })
    });

    const result = await response.json();

    if (result.success) {
      // Payment successful
      showSuccessMessage('Payment successful!');
      redirectToOrderConfirmation(orderId);
    } else {
      // Payment verification failed
      showErrorMessage('Payment verification failed');
    }

  } catch (error) {
    console.error('Payment verification failed:', error);
    showErrorMessage('Payment verification failed');
  }
}
```

#### 4. Complete Example Component
```jsx
import React, { useState } from 'react';

function PaymentButton({ orderId, amount }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create Razorpay order
      const response = await fetch(`/api/payments/create-order/${orderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      const paymentData = result.data;

      // Razorpay options
      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount * 100,
        currency: paymentData.currency,
        name: 'SneakerHub',
        description: `Order #${paymentData.orderNumber}`,
        order_id: paymentData.razorpayOrderId,
        prefill: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
          contact: paymentData.customerPhone
        },
        theme: {
          color: '#3399cc'
        },
        handler: async function(razorpayResponse) {
          // Verify payment
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              orderId: orderId,
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature
            })
          });

          const verifyResult = await verifyResponse.json();

          if (verifyResult.success) {
            alert('Payment successful!');
            window.location.href = `/orders/${orderId}`;
          } else {
            alert('Payment verification failed');
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="pay-button"
    >
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
}

export default PaymentButton;
```

---

## 🔒 **Security Features**

### ✅ Signature Verification
```java
// Backend verifies Razorpay signature
String expectedSignature = HMAC_SHA256(
    razorpayOrderId + "|" + razorpayPaymentId,
    keySecret
);

if (expectedSignature.equals(razorpaySignature)) {
    // Payment is genuine
    markAsCompleted();
} else {
    // Payment is fraudulent
    markAsFailed();
}
```

### ✅ Secure Key Handling
- Keys stored in environment variables
- Never exposed to frontend (except Key ID)
- Key Secret used only for signature verification

### ✅ Payment Status Tracking
- `PENDING` - Payment order created
- `COMPLETED` - Payment verified successfully
- `FAILED` - Payment or verification failed
- `REFUNDED` - Payment refunded

### ✅ Order-Payment Mapping
- One-to-one relationship
- Payment linked to order
- Order status updated on payment success

---

## 💰 **Payment Methods Supported**

Razorpay supports:
- ✅ **Credit/Debit Cards** (Visa, Mastercard, Amex, RuPay)
- ✅ **Net Banking** (All major banks)
- ✅ **UPI** (Google Pay, PhonePe, Paytm, etc.)
- ✅ **Wallets** (Paytm, Mobikwik, Freecharge, etc.)
- ✅ **EMI** (Credit card EMI)
- ✅ **Cardless EMI** (ZestMoney, etc.)

---

## 🧪 **Testing**

### Test Cards (Razorpay Test Mode)

#### Success Card
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

#### Failure Card
```
Card Number: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

### Test UPI
```
UPI ID: success@razorpay
```

### Test Net Banking
- Select any bank
- Use credentials: `test`/`test`

---

## 📊 **Database Schema**

### Payment Table
```sql
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT UNIQUE,
    transaction_id VARCHAR(100) UNIQUE,
    payment_method VARCHAR(50),
    status VARCHAR(50),
    amount DECIMAL(10,2),
    currency VARCHAR(10),
    
    -- Razorpay specific
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    
    -- Payment details
    card_last4 VARCHAR(4),
    card_brand VARCHAR(50),
    upi_id VARCHAR(100),
    bank_name VARCHAR(100),
    
    -- Refund
    refund_id VARCHAR(100),
    refund_amount DECIMAL(10,2),
    refund_reason TEXT,
    refunded_at DATETIME,
    
    -- Timestamps
    paid_at DATETIME,
    failed_at DATETIME,
    failure_reason TEXT,
    created_at DATETIME,
    updated_at DATETIME,
    
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

---

## 🚨 **Error Handling**

### Common Errors

#### 1. Invalid Signature
```json
{
  "success": false,
  "message": "Payment verification failed: Invalid signature",
  "timestamp": "2026-02-09T20:00:00"
}
```

**Solution**: Check if signature verification is correct

#### 2. Order Already Paid
```json
{
  "success": false,
  "message": "Payment already exists for this order",
  "timestamp": "2026-02-09T20:00:00"
}
```

**Solution**: Check order payment status before creating new payment

#### 3. Razorpay API Error
```json
{
  "success": false,
  "message": "Failed to create payment order: Invalid API key",
  "timestamp": "2026-02-09T20:00:00"
}
```

**Solution**: Verify Razorpay API keys in environment variables

---

## 📈 **Payment Statistics**

### Admin Dashboard Queries
```java
// Total revenue
BigDecimal totalRevenue = paymentRepository
    .findByStatus(PaymentStatus.COMPLETED)
    .stream()
    .map(Payment::getAmount)
    .reduce(BigDecimal.ZERO, BigDecimal::add);

// Successful payments count
long successfulPayments = paymentRepository
    .countByStatus(PaymentStatus.COMPLETED);

// Failed payments count
long failedPayments = paymentRepository
    .countByStatus(PaymentStatus.FAILED);
```

---

## 🎯 **Best Practices**

### ✅ DO
- Always verify signature on backend
- Store payment details in database
- Log all payment transactions
- Handle payment failures gracefully
- Use environment variables for keys
- Test with Razorpay test mode first

### ❌ DON'T
- Never expose Key Secret to frontend
- Don't trust frontend payment status
- Don't skip signature verification
- Don't hardcode API keys
- Don't process payments without order validation

---

## 📚 **Additional Resources**

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Checkout](https://razorpay.com/docs/payments/payment-gateway/web-integration/)
- [Razorpay Webhooks](https://razorpay.com/docs/webhooks/)

---

**Created**: 2026-02-09  
**Status**: ✅ Complete  
**Total APIs**: 6 endpoints  
**Ready for**: Testing and production use
