# SneakerHub - Quick Start Guide

## ✅ Setup Complete!

Your Spring Boot project is fully configured with:

### 🛠 Technologies
- **Java 17**
- **Spring Boot 3.2.2**
- **Spring Security** (JWT + OAuth2)
- **MySQL 8.x**
- **Razorpay Payment Gateway**
- **Swagger/OpenAPI Documentation**

### 📦 Project Structure
```
backend/
├── pom.xml                          ✅ All dependencies configured
├── src/main/
│   ├── java/com/sneakerhub/
│   │   ├── config/                  # Security, CORS, JWT configs
│   │   ├── controller/              # REST API endpoints
│   │   ├── dto/                     # Request/Response DTOs
│   │   ├── model/                   # JPA Entities
│   │   ├── repository/              # Data access layer
│   │   ├── service/                 # Business logic
│   │   ├── security/                # JWT & OAuth2 components
│   │   └── exception/               # Error handling
│   │
│   └── resources/
│       ├── application.yml          ✅ Main configuration
│       └── application-dev.yml      ✅ Development profile
│
└── .env.example                     ✅ Environment template
```

## 🚀 Quick Start

### 1. Setup MySQL Database
```sql
CREATE DATABASE sneakerhub;
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update:
```env
DB_URL=jdbc:mysql://localhost:3306/sneakerhub
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
RAZORPAY_KEY_ID=your-razorpay-key
```

### 3. Build & Run
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 4. Access Application
- **API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/api-docs

## 📚 Full Documentation
See `SPRING_BOOT_SETUP.md` for complete details on:
- All Maven dependencies
- Complete package structure
- Configuration options
- Google OAuth2 setup
- Razorpay integration
- Testing & deployment

## 🔑 Key Configuration Files

### pom.xml
- ✅ Spring Boot 3.2.2
- ✅ Spring Security
- ✅ JWT (JJWT 0.12.3)
- ✅ MySQL Driver
- ✅ Razorpay SDK
- ✅ Lombok
- ✅ Swagger/OpenAPI

### application.yml
- ✅ MySQL datasource
- ✅ JPA/Hibernate settings
- ✅ JWT configuration
- ✅ OAuth2 (Google)
- ✅ Razorpay settings
- ✅ CORS configuration
- ✅ Logging setup

## 🎯 Next Steps

1. **Configure Google OAuth2**
   - Get credentials from Google Cloud Console
   - Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

2. **Setup Razorpay**
   - Sign up at dashboard.razorpay.com
   - Get API keys and update configuration

3. **Start Development**
   - Implement controllers
   - Add business logic in services
   - Create custom queries in repositories

4. **Test Your APIs**
   - Use Swagger UI for interactive testing
   - Write unit tests for services
   - Add integration tests

---

**Ready to code!** 🎉
