# SneakerHub - Spring Boot Project Setup Guide

## 📋 Table of Contents
- [Technology Stack](#technology-stack)
- [Maven Dependencies](#maven-dependencies)
- [Package Structure](#package-structure)
- [Application Configuration](#application-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)

---

## 🛠 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Programming Language |
| Spring Boot | 3.2.2 | Application Framework |
| Spring Security | 6.x | Authentication & Authorization |
| JWT (JJWT) | 0.12.3 | Token-based Authentication |
| OAuth2 | - | Google Social Login |
| Spring Data JPA | - | Data Access Layer |
| Hibernate | 6.x | ORM Framework |
| MySQL | 8.x | Database |
| Razorpay SDK | 1.4.6 | Payment Gateway Integration |
| Lombok | - | Code Generation |
| Swagger/OpenAPI | 2.3.0 | API Documentation |

---

## 📦 Maven Dependencies (pom.xml)

Your current `pom.xml` already includes all required dependencies. Here's the complete breakdown:

### Core Spring Boot Starters
```xml
<!-- Web MVC -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- JPA + Hibernate -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Bean Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- OAuth2 Client (Google Login) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

### Database Drivers
```xml
<!-- MySQL Driver -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

### JWT Authentication
```xml
<!-- JWT API -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>

<!-- JWT Implementation -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>

<!-- JWT Jackson Support -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

### Payment Gateway
```xml
<!-- Razorpay SDK -->
<dependency>
    <groupId>com.razorpay</groupId>
    <artifactId>razorpay-java</artifactId>
    <version>1.4.6</version>
</dependency>
```

### Utilities
```xml
<!-- Lombok (Reduce Boilerplate) -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- Swagger/OpenAPI Documentation -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>

<!-- DevTools (Hot Reload) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### Testing
```xml
<!-- Spring Boot Test -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- Spring Security Test -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-test</artifactId>
    <scope>test</scope>
</dependency>
```

---

## 📁 Package Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── sneakerhub/
│   │   │           ├── SneakerHubApplication.java          # Main Application Entry Point
│   │   │           │
│   │   │           ├── config/                             # Configuration Classes
│   │   │           │   ├── CorsConfig.java                 # CORS Configuration
│   │   │           │   ├── SecurityConfig.java             # Spring Security Configuration
│   │   │           │   ├── JwtConfig.java                  # JWT Configuration
│   │   │           │   └── RazorpayConfig.java             # Razorpay Configuration
│   │   │           │
│   │   │           ├── controller/                         # REST Controllers
│   │   │           │   ├── AuthController.java             # Authentication Endpoints
│   │   │           │   ├── UserController.java             # User Management
│   │   │           │   ├── ProductController.java          # Product Management
│   │   │           │   ├── CartController.java             # Shopping Cart
│   │   │           │   ├── OrderController.java            # Order Management
│   │   │           │   ├── PaymentController.java          # Payment Processing
│   │   │           │   ├── AddressController.java          # Address Management
│   │   │           │   └── ReviewController.java           # Product Reviews
│   │   │           │
│   │   │           ├── dto/                                # Data Transfer Objects
│   │   │           │   ├── request/                        # Request DTOs
│   │   │           │   │   ├── LoginRequest.java
│   │   │           │   │   ├── RegisterRequest.java
│   │   │           │   │   ├── ProductRequest.java
│   │   │           │   │   ├── OrderRequest.java
│   │   │           │   │   └── PaymentRequest.java
│   │   │           │   │
│   │   │           │   └── response/                       # Response DTOs
│   │   │           │       ├── AuthResponse.java
│   │   │           │       ├── UserResponse.java
│   │   │           │       ├── ProductResponse.java
│   │   │           │       ├── OrderResponse.java
│   │   │           │       └── ApiResponse.java
│   │   │           │
│   │   │           ├── model/                              # JPA Entities
│   │   │           │   ├── User.java                       # User Entity
│   │   │           │   ├── Role.java                       # Role Entity (Enum)
│   │   │           │   ├── Product.java                    # Product Entity
│   │   │           │   ├── ProductVariant.java             # Product Variants (Size/Color)
│   │   │           │   ├── Category.java                   # Product Categories
│   │   │           │   ├── Cart.java                       # Shopping Cart
│   │   │           │   ├── CartItem.java                   # Cart Items
│   │   │           │   ├── Order.java                      # Order Entity
│   │   │           │   ├── OrderItem.java                  # Order Items
│   │   │           │   ├── Payment.java                    # Payment Entity
│   │   │           │   ├── Address.java                    # Delivery Address
│   │   │           │   ├── Review.java                     # Product Reviews
│   │   │           │   └── Wishlist.java                   # User Wishlist
│   │   │           │
│   │   │           ├── repository/                         # JPA Repositories
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── ProductRepository.java
│   │   │           │   ├── CategoryRepository.java
│   │   │           │   ├── CartRepository.java
│   │   │           │   ├── CartItemRepository.java
│   │   │           │   ├── OrderRepository.java
│   │   │           │   ├── PaymentRepository.java
│   │   │           │   ├── AddressRepository.java
│   │   │           │   └── ReviewRepository.java
│   │   │           │
│   │   │           ├── service/                            # Business Logic Layer
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── UserService.java
│   │   │           │   ├── ProductService.java
│   │   │           │   ├── CartService.java
│   │   │           │   ├── OrderService.java
│   │   │           │   ├── PaymentService.java
│   │   │           │   ├── AddressService.java
│   │   │           │   └── ReviewService.java
│   │   │           │
│   │   │           ├── security/                           # Security Components
│   │   │           │   ├── JwtTokenProvider.java           # JWT Token Generation/Validation
│   │   │           │   ├── JwtAuthenticationFilter.java    # JWT Filter
│   │   │           │   ├── CustomUserDetailsService.java   # User Details Service
│   │   │           │   ├── OAuth2SuccessHandler.java       # OAuth2 Success Handler
│   │   │           │   └── OAuth2UserInfo.java             # OAuth2 User Info
│   │   │           │
│   │   │           ├── exception/                          # Exception Handling
│   │   │           │   ├── GlobalExceptionHandler.java     # Global Exception Handler
│   │   │           │   ├── ResourceNotFoundException.java
│   │   │           │   ├── BadRequestException.java
│   │   │           │   ├── UnauthorizedException.java
│   │   │           │   └── PaymentException.java
│   │   │           │
│   │   │           └── util/                               # Utility Classes
│   │   │               ├── AppConstants.java               # Application Constants
│   │   │               └── ValidationUtils.java            # Validation Utilities
│   │   │
│   │   └── resources/
│   │       ├── application.yml                             # Main Configuration
│   │       ├── application-dev.yml                         # Development Profile
│   │       ├── application-prod.yml                        # Production Profile
│   │       └── static/                                     # Static Resources
│   │
│   └── test/
│       └── java/
│           └── com/
│               └── sneakerhub/
│                   ├── controller/                         # Controller Tests
│                   ├── service/                            # Service Tests
│                   └── repository/                         # Repository Tests
│
└── pom.xml                                                 # Maven Configuration
```

---

## ⚙️ Application Configuration

### application.yml (Current Configuration)

Your current `application.yml` is well-configured. Here's the complete version optimized for MySQL:

```yaml
spring:
  application:
    name: sneakerhub-backend

  # Active Profile (dev/prod)
  profiles:
    active: ${SPRING_PROFILE:dev}

  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/sneakerhub?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:root}
    driver-class-name: ${DB_DRIVER:com.mysql.cj.jdbc.Driver}

  jpa:
    hibernate:
      ddl-auto: ${DDL_AUTO:update}  # Options: create, create-drop, update, validate, none
    show-sql: ${SHOW_SQL:true}
    properties:
      hibernate:
        dialect: ${HIBERNATE_DIALECT:org.hibernate.dialect.MySQLDialect}
        format_sql: true
        use_sql_comments: true
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true

  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID:your-google-client-id}
            client-secret: ${GOOGLE_CLIENT_SECRET:your-google-client-secret}
            scope:
              - email
              - profile
            redirect-uri: "{baseUrl}/oauth2/callback/{registrationId}"
        provider:
          google:
            authorization-uri: https://accounts.google.com/o/oauth2/v2/auth
            token-uri: https://oauth2.googleapis.com/token
            user-info-uri: https://www.googleapis.com/oauth2/v3/userinfo
            user-name-attribute: sub

# JWT Configuration
jwt:
  secret: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
  expiration: ${JWT_EXPIRATION:86400000}      # 24 hours in milliseconds
  refresh-expiration: ${JWT_REFRESH:604800000} # 7 days in milliseconds

# Razorpay Configuration
razorpay:
  key-id: ${RAZORPAY_KEY_ID:your-razorpay-key-id}
  key-secret: ${RAZORPAY_KEY_SECRET:your-razorpay-key-secret}
  webhook-secret: ${RAZORPAY_WEBHOOK_SECRET:your-webhook-secret}

# Server Configuration
server:
  port: ${SERVER_PORT:8080}
  error:
    include-message: always
    include-binding-errors: always
    include-stacktrace: on_param
  compression:
    enabled: true
    mime-types: application/json,application/xml,text/html,text/xml,text/plain

# CORS Configuration
app:
  cors:
    allowed-origins: ${ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000}
    allowed-methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
    allowed-headers: "*"
    allow-credentials: true
    max-age: 3600

# Logging Configuration
logging:
  level:
    root: INFO
    com.sneakerhub: ${LOG_LEVEL:DEBUG}
    org.springframework.security: ${SECURITY_LOG_LEVEL:DEBUG}
    org.hibernate.SQL: ${SQL_LOG_LEVEL:DEBUG}
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

# Swagger/OpenAPI Configuration
springdoc:
  api-docs:
    path: /api-docs
    enabled: true
  swagger-ui:
    path: /swagger-ui.html
    enabled: true
    operations-sorter: method
    tags-sorter: alpha
  show-actuator: true

# File Upload Configuration
spring.servlet.multipart:
  enabled: true
  max-file-size: 10MB
  max-request-size: 10MB

# Actuator Configuration (Optional - for monitoring)
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized
```

---

### application-dev.yml (Development Profile)

Create this file for development-specific settings:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/sneakerhub?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect

logging:
  level:
    com.sneakerhub: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
```

---

### application-prod.yml (Production Profile)

Create this file for production settings with MySQL:

```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/sneakerhub}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000

  jpa:
    hibernate:
      ddl-auto: validate  # Never use 'update' in production
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        jdbc:
          batch_size: 20

logging:
  level:
    com.sneakerhub: INFO
    org.springframework.security: WARN
    org.hibernate.SQL: WARN

server:
  port: ${PORT:8080}
```

---

## 🗄️ Database Setup

### MySQL Setup

1. **Install MySQL 8.x**
   ```bash
   # Download from: https://dev.mysql.com/downloads/mysql/
   ```

2. **Create Database**
   ```sql
   CREATE DATABASE sneakerhub;
   CREATE USER 'sneakerhub_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON sneakerhub.* TO 'sneakerhub_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update application.yml**
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/sneakerhub
       username: sneakerhub_user
       password: your_password
   ```



---

## 🔐 Environment Variables Setup

Create a `.env` file (add to `.gitignore`):

```env
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/sneakerhub
DB_USERNAME=root
DB_PASSWORD=root
DB_DRIVER=com.mysql.cj.jdbc.Driver
HIBERNATE_DIALECT=org.hibernate.dialect.MySQLDialect

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-256-bits-long
JWT_EXPIRATION=86400000
JWT_REFRESH=604800000

# Google OAuth2
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Server
SERVER_PORT=8080
SPRING_PROFILE=dev

# Logging
LOG_LEVEL=DEBUG
SECURITY_LOG_LEVEL=DEBUG
SQL_LOG_LEVEL=DEBUG
```

---

## 🚀 Running the Application

### Prerequisites
- Java 17 installed
- Maven 3.8+ installed
- MySQL 8.x running

### Build the Project
```bash
cd backend
mvn clean install
```

### Run with Maven
```bash
# Development mode
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Production mode
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### Run as JAR
```bash
# Build JAR
mvn clean package -DskipTests

# Run JAR
java -jar target/sneakerhub-backend-1.0.0.jar --spring.profiles.active=dev
```

### Access Points
- **Application**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs
- **Health Check**: http://localhost:8080/actuator/health

---

## 🔑 Google OAuth2 Setup

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com/

2. **Create a New Project**
   - Name: SneakerHub

3. **Enable Google+ API**
   - APIs & Services → Library → Google+ API → Enable

4. **Create OAuth2 Credentials**
   - APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application Type: Web Application
   - Authorized redirect URIs:
     - http://localhost:8080/oauth2/callback/google
     - http://localhost:8080/login/oauth2/code/google

5. **Copy Client ID and Secret**
   - Update in `application.yml` or `.env` file

---

## 💳 Razorpay Setup

1. **Sign up at Razorpay**
   - https://dashboard.razorpay.com/signup

2. **Get API Keys**
   - Settings → API Keys → Generate Test/Live Keys

3. **Configure Webhooks**
   - Settings → Webhooks → Add Webhook URL
   - URL: `https://yourdomain.com/api/payments/webhook`
   - Events: payment.authorized, payment.captured, payment.failed

4. **Update Configuration**
   ```yaml
   razorpay:
     key-id: rzp_test_xxxxxxxxxxxxx
     key-secret: your-secret-key
     webhook-secret: your-webhook-secret
   ```

---

## 📝 Additional Configuration Files

### .gitignore
```gitignore
# Compiled class files
*.class
target/

# Log files
*.log
logs/

# Environment files
.env
.env.local

# IDE files
.idea/
.vscode/
*.iml
*.iws

# OS files
.DS_Store
Thumbs.db

# Application properties with secrets
application-local.yml
application-secrets.yml
```

---

## 🧪 Testing

### Run All Tests
```bash
mvn test
```

### Run Specific Test Class
```bash
mvn test -Dtest=UserServiceTest
```

### Generate Test Coverage Report
```bash
mvn clean test jacoco:report
```

---

## 📚 API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

---

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change port in application.yml
   server:
     port: 8081
   ```

2. **Database Connection Failed**
   - Verify MySQL is running
   - Check credentials in application.yml
   - Ensure database exists

3. **JWT Token Issues**
   - Ensure JWT secret is at least 256 bits (32 characters)
   - Check token expiration settings

4. **OAuth2 Redirect Issues**
   - Verify redirect URIs in Google Console match application.yml
   - Check CORS configuration

---

## 📖 Next Steps

1. ✅ **Database Schema**: Tables will be auto-created by Hibernate
2. ✅ **API Endpoints**: Implement controllers for each entity
3. ✅ **Security**: Configure JWT and OAuth2 filters
4. ✅ **Payment Integration**: Implement Razorpay payment flow
5. ✅ **Testing**: Write unit and integration tests
6. ✅ **Deployment**: Deploy to cloud platform (AWS, Azure, GCP)

---

## 🎯 Key Features Implemented

- ✅ JWT Authentication
- ✅ Google OAuth2 Login
- ✅ Role-based Access Control (RBAC)
- ✅ Product Management
- ✅ Shopping Cart
- ✅ Order Processing
- ✅ Razorpay Payment Integration
- ✅ Address Management
- ✅ Product Reviews
- ✅ API Documentation (Swagger)
- ✅ CORS Configuration
- ✅ Exception Handling
- ✅ Logging

---

**Created**: 2026-02-09  
**Version**: 1.0.0  
**Author**: SneakerHub Development Team
