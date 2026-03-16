# SneakerHub - JWT Authentication & Authorization Documentation

## ✅ Implementation Complete

### 📦 Components Created

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| **JwtTokenProvider** | `JwtTokenProvider.java` | JWT generation & validation | ✅ |
| **JwtAuthenticationFilter** | `JwtAuthenticationFilter.java` | Request interception & token validation | ✅ |
| **CustomUserDetailsService** | `CustomUserDetailsService.java` | Load user from database | ✅ |
| **SecurityConfig** | `SecurityConfig.java` | Spring Security configuration | ✅ |
| **AuthService** | `AuthService.java` | Authentication business logic | ✅ |
| **AuthController** | `AuthController.java` | REST API endpoints | ✅ |
| **GlobalExceptionHandler** | `GlobalExceptionHandler.java` | Exception handling | ✅ |

---

## 🔐 Security Features

### ✅ Password Encryption
- **BCrypt** password encoding
- Configured in `SecurityConfig`
- Automatic hashing on registration

### ✅ JWT Token Management
- **Access Token**: 24 hours (configurable)
- **Refresh Token**: 7 days (configurable)
- **Algorithm**: HS512
- **Token Type**: Bearer

### ✅ Role-Based Access Control (RBAC)

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **USER** | Standard customer | View products, manage cart, place orders |
| **OWNER** | Product seller | All USER permissions + manage products |
| **ADMIN** | System administrator | Full system access |

---

## 📡 API Endpoints

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "USER"  // Optional, defaults to USER
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "userId": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "timestamp": "2026-02-09T19:53:22"
}
```

---

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "userId": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "timestamp": "2026-02-09T19:53:22"
}
```

---

#### 3. Refresh Token
```http
POST /api/auth/refresh?refreshToken=eyJhbGciOiJIUzUxMiJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "userId": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "timestamp": "2026-02-09T19:53:22"
}
```

---

#### 4. Get Current User
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "role": "USER",
    "enabled": true,
    "createdAt": "2026-02-09T19:00:00",
    "updatedAt": "2026-02-09T19:00:00"
  },
  "timestamp": "2026-02-09T19:53:22"
}
```

---

#### 5. Logout
```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful",
  "timestamp": "2026-02-09T19:53:22"
}
```

**Note**: Since JWT is stateless, logout is handled client-side by removing tokens.

---

## 🔒 Protected Endpoints Configuration

### Public Endpoints (No Authentication Required)
```
/api/auth/**                    - Authentication endpoints
/api/public/**                  - Public content
GET /api/sneakers/**            - View sneakers
GET /api/categories/**          - View categories
/swagger-ui/**                  - API documentation
/actuator/**                    - Health checks
```

### USER Role Required
```
/api/cart/**                    - Shopping cart
/api/orders/**                  - Order management
/api/profile/**                 - User profile
```

### OWNER Role Required
```
POST /api/sneakers/**           - Create sneakers
PUT /api/sneakers/**            - Update sneakers
DELETE /api/sneakers/**         - Delete sneakers
```

### ADMIN Role Required
```
/api/admin/**                   - Admin panel
/api/users/**                   - User management
```

---

## 🛡️ Security Configuration Details

### Session Management
- **Stateless**: No server-side sessions
- **JWT-based**: All authentication via tokens
- **CSRF**: Disabled (not needed for stateless API)

### CORS
- Configured separately in `CorsConfig`
- Allows specified origins from `application.yml`

### Password Requirements
- Minimum 6 characters
- BCrypt encryption with strength 10

### Token Validation
- Signature verification
- Expiration check
- Malformed token detection

---

## 🎯 How to Use JWT Tokens

### 1. Client Registration/Login
```javascript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  })
});

const { data } = await response.json();
// Store tokens
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);
```

### 2. Making Authenticated Requests
```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('/api/cart', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

### 3. Handling Token Expiration
```javascript
// If access token expires (401 error)
const refreshToken = localStorage.getItem('refreshToken');

const response = await fetch(`/api/auth/refresh?refreshToken=${refreshToken}`, {
  method: 'POST'
});

const { data } = await response.json();
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);

// Retry original request with new token
```

### 4. Logout
```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');

await fetch('/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

---

## 🚨 Exception Handling

### Validation Errors (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Email should be valid",
    "password": "Password must be at least 6 characters"
  },
  "timestamp": "2026-02-09T19:53:22"
}
```

### Authentication Errors (401)
```json
{
  "success": false,
  "message": "Invalid email or password",
  "timestamp": "2026-02-09T19:53:22"
}
```

### JWT Errors (401)
```json
{
  "success": false,
  "message": "JWT token has expired",
  "timestamp": "2026-02-09T19:53:22"
}
```

### Access Denied (403)
```json
{
  "success": false,
  "message": "Access denied: Insufficient permissions",
  "timestamp": "2026-02-09T19:53:22"
}
```

### Resource Not Found (404)
```json
{
  "success": false,
  "message": "User not found with email: 'user@example.com'",
  "timestamp": "2026-02-09T19:53:22"
}
```

---

## 📋 DTOs Created

### Request DTOs
1. **LoginRequest** - Email & password validation
2. **RegisterRequest** - User registration with validation

### Response DTOs
1. **AuthResponse** - JWT tokens + user info
2. **UserResponse** - User profile without sensitive data
3. **ApiResponse<T>** - Generic wrapper for all responses

---

## 🔧 Configuration Required

### application.yml
```yaml
jwt:
  secret: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
  expiration: ${JWT_EXPIRATION:86400000}      # 24 hours
  refresh-expiration: ${JWT_REFRESH:604800000} # 7 days
```

### Environment Variables
```env
JWT_SECRET=your-super-secret-key-min-256-bits
JWT_EXPIRATION=86400000
JWT_REFRESH=604800000
```

---

## ✨ Features Implemented

### ✅ Core Features
- [x] User registration with validation
- [x] User login with credentials
- [x] JWT token generation (access + refresh)
- [x] Token validation and parsing
- [x] Password encryption (BCrypt)
- [x] Role-based access control (USER, OWNER, ADMIN)
- [x] Current user retrieval
- [x] Token refresh mechanism
- [x] Logout endpoint

### ✅ Security Features
- [x] Stateless authentication
- [x] JWT signature validation
- [x] Token expiration handling
- [x] Method-level security (@PreAuthorize)
- [x] CORS configuration
- [x] CSRF protection (disabled for API)

### ✅ Exception Handling
- [x] Validation errors
- [x] Authentication errors
- [x] JWT-specific errors (expired, malformed, invalid signature)
- [x] Resource not found
- [x] Bad request
- [x] Unauthorized access
- [x] Access denied
- [x] Global exception handler

---

## 🧪 Testing the APIs

### Using cURL

#### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get Current User
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Swagger UI
Access: `http://localhost:8080/swagger-ui.html`

1. Register/Login to get token
2. Click "Authorize" button
3. Enter: `Bearer YOUR_ACCESS_TOKEN`
4. Test all endpoints interactively

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20) NOT NULL,
    provider VARCHAR(20) NOT NULL,
    provider_id VARCHAR(255),
    enabled BOOLEAN DEFAULT TRUE,
    account_non_expired BOOLEAN DEFAULT TRUE,
    account_non_locked BOOLEAN DEFAULT TRUE,
    credentials_non_expired BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    INDEX idx_email (email)
);
```

---

## 🎯 Next Steps

1. ✅ **Authentication Complete** - All endpoints working
2. ⏭️ **OAuth2 Integration** - Google login (optional)
3. ⏭️ **Email Verification** - Verify email on registration
4. ⏭️ **Password Reset** - Forgot password flow
5. ⏭️ **Rate Limiting** - Prevent brute force attacks
6. ⏭️ **Audit Logging** - Track authentication events

---

## 📁 Files Created/Updated

### Security (4 files)
1. `JwtTokenProvider.java` ✅
2. `JwtAuthenticationFilter.java` ✅
3. `CustomUserDetailsService.java` ✅
4. `SecurityConfig.java` ✅

### Service (1 file)
1. `AuthService.java` ✅

### Controller (1 file)
1. `AuthController.java` ✅

### DTOs (5 files)
1. `LoginRequest.java` ✅
2. `RegisterRequest.java` ✅
3. `AuthResponse.java` ✅
4. `UserResponse.java` ✅
5. `ApiResponse.java` ✅

### Exceptions (4 files)
1. `GlobalExceptionHandler.java` ✅
2. `ResourceNotFoundException.java` ✅
3. `BadRequestException.java` ✅
4. `UnauthorizedException.java` ✅

**Total**: 15 files

---

**Created**: 2026-02-09  
**Status**: ✅ Complete  
**Ready for**: Testing and integration
