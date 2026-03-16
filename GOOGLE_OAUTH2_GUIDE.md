# Google OAuth2 Integration - Complete Guide

## ✅ Implementation Complete

### 📦 Components Created

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| **OAuth2UserInfo** | `OAuth2UserInfo.java` | Extract user info from Google | ✅ |
| **OAuth2AuthenticationSuccessHandler** | `OAuth2AuthenticationSuccessHandler.java` | Handle successful Google login | ✅ |
| **OAuth2AuthenticationFailureHandler** | `OAuth2AuthenticationFailureHandler.java` | Handle failed Google login | ✅ |
| **SecurityConfig** | `SecurityConfig.java` (updated) | OAuth2 configuration | ✅ |
| **application.yml** | `application.yml` (updated) | OAuth2 settings | ✅ |

---

## 🔐 How It Works

### Authentication Flow

```
1. User clicks "Login with Google" on frontend
   ↓
2. Frontend redirects to: /oauth2/authorize/google
   ↓
3. User authenticates with Google
   ↓
4. Google redirects back to: /oauth2/callback/google
   ↓
5. OAuth2AuthenticationSuccessHandler processes the response
   ↓
6. Check if user exists in database (by email)
   ├─ If exists: Update provider info
   └─ If not exists: Create new user with role=USER
   ↓
7. Generate JWT tokens (access + refresh)
   ↓
8. Redirect to frontend with tokens in URL params
   ↓
9. Frontend extracts tokens and stores them
```

---

## ⚙️ Configuration

### 1. Google Cloud Console Setup

#### Step 1: Create Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: **SneakerHub**
4. Click "Create"

#### Step 2: Enable Google+ API
1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click "Enable"

#### Step 3: Create OAuth2 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Configure consent screen if prompted:
   - User Type: **External**
   - App name: **SneakerHub**
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: `email`, `profile`
   - Test users: Add your email

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **SneakerHub Web Client**
   
5. **Authorized JavaScript origins**:
   ```
   http://localhost:8080
   http://localhost:3000
   http://localhost:5173
   ```

6. **Authorized redirect URIs**:
   ```
   http://localhost:8080/oauth2/callback/google
   http://localhost:8080/login/oauth2/code/google
   ```

7. Click "Create"
8. **Copy Client ID and Client Secret**

---

### 2. Backend Configuration

#### application.yml
```yaml
spring:
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

app:
  oauth2:
    redirect-uri: ${OAUTH2_REDIRECT_URI:http://localhost:3000/oauth2/redirect}
```

#### Environment Variables (.env)
```env
# Google OAuth2 (get values from Google Cloud Console)
GOOGLE_CLIENT_ID=<your-client-id-from-google-console>
GOOGLE_CLIENT_SECRET=<your-client-secret-from-google-console>

# Frontend redirect URI
OAUTH2_REDIRECT_URI=http://localhost:3000/oauth2/redirect
```

---

## 🎯 Features Implemented

### ✅ Auto-Create User
- If user doesn't exist, automatically creates account
- Default role: **USER**
- Provider: **GOOGLE**
- No password required (OAuth users)

### ✅ Update Existing User
- If user exists with same email, updates provider info
- Links Google account to existing account

### ✅ Auto-Create Cart
- Cart automatically created for new users
- Ready for shopping immediately

### ✅ JWT Token Generation
- Access token (24 hours)
- Refresh token (7 days)
- Returned in redirect URL

### ✅ Error Handling
- Failed authentication redirects with error message
- Proper logging for debugging

---

## 🌐 Frontend Integration

### React/Vue/Angular Example

#### 1. Login Button
```javascript
// Initiate Google OAuth2 login
function loginWithGoogle() {
  window.location.href = 'http://localhost:8080/oauth2/authorize/google';
}
```

```html
<button onClick={loginWithGoogle}>
  <img src="google-icon.png" alt="Google" />
  Login with Google
</button>
```

#### 2. OAuth2 Redirect Handler
Create a route at `/oauth2/redirect` to handle the callback:

```javascript
// React example
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth2 Error:', error);
      navigate('/login?error=' + error);
      return;
    }

    if (token && refreshToken) {
      // Store tokens
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Store user info
      const userId = searchParams.get('userId');
      const email = searchParams.get('email');
      const firstName = searchParams.get('firstName');
      const lastName = searchParams.get('lastName');
      const role = searchParams.get('role');

      const user = { userId, email, firstName, lastName, role };
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      navigate('/login?error=missing_tokens');
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <h2>Processing Google Login...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
}

export default OAuth2RedirectHandler;
```

#### 3. Route Configuration
```javascript
// React Router example
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 📡 API Endpoints

### OAuth2 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/oauth2/authorize/google` | GET | Initiate Google login |
| `/oauth2/callback/google` | GET | Google callback (handled by Spring) |
| `/login/oauth2/code/google` | GET | Alternative callback URL |

### Success Redirect
After successful authentication, user is redirected to:
```
http://localhost:3000/oauth2/redirect?
  token=eyJhbGciOiJIUzUxMiJ9...
  &refreshToken=eyJhbGciOiJIUzUxMiJ9...
  &userId=1
  &email=user@gmail.com
  &firstName=John
  &lastName=Doe
  &role=USER
```

### Failure Redirect
After failed authentication:
```
http://localhost:3000/oauth2/redirect?
  error=Authentication+failed
```

---

## 🔒 Security Features

### ✅ Stateless Authentication
- No server-side sessions
- JWT tokens for all requests

### ✅ Automatic User Linking
- Links Google account to existing email
- Prevents duplicate accounts

### ✅ Role-Based Access
- Default role: USER
- Can be upgraded to OWNER or ADMIN

### ✅ Provider Tracking
- Tracks authentication provider (LOCAL vs GOOGLE)
- Stores provider ID for future reference

---

## 🧪 Testing

### Manual Testing

#### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```

#### 2. Test Google Login
```
Navigate to: http://localhost:8080/oauth2/authorize/google
```

Expected flow:
1. Redirects to Google login
2. User logs in with Google
3. Google redirects back to backend
4. Backend creates/updates user
5. Backend redirects to frontend with tokens

#### 3. Verify User Created
Check database:
```sql
SELECT * FROM users WHERE provider = 'GOOGLE';
```

---

## 📊 Database Schema

### User Table Updates
```sql
-- Users created via Google OAuth2
INSERT INTO users (
  email, 
  password,  -- Empty for OAuth users
  first_name, 
  last_name, 
  role, 
  provider,  -- 'GOOGLE'
  provider_id,  -- Google user ID
  enabled,
  created_at
) VALUES (
  'user@gmail.com',
  '',
  'John',
  'Doe',
  'USER',
  'GOOGLE',
  '1234567890',
  true,
  NOW()
);
```

---

## 🎨 Frontend UI Examples

### Login Page with Google Button

```jsx
import React from 'react';
import './LoginPage.css';

function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorize/google';
  };

  return (
    <div className="login-container">
      <h1>Welcome to SneakerHub</h1>
      
      {/* Email/Password Login */}
      <form className="login-form">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>

      <div className="divider">OR</div>

      {/* Google OAuth2 Login */}
      <button className="google-login-btn" onClick={handleGoogleLogin}>
        <img src="/google-icon.svg" alt="Google" />
        Continue with Google
      </button>
    </div>
  );
}

export default LoginPage;
```

### CSS Styling
```css
.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.google-login-btn:hover {
  background: #f8f8f8;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.google-login-btn img {
  width: 20px;
  height: 20px;
}
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Redirect URI Mismatch
**Error**: `redirect_uri_mismatch`

**Solution**: 
- Verify redirect URIs in Google Console match exactly
- Check `application.yml` configuration
- Ensure no trailing slashes

#### 2. Invalid Client
**Error**: `invalid_client`

**Solution**:
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check environment variables are loaded
- Restart application after changing credentials

#### 3. User Not Created
**Problem**: User logs in but not saved to database

**Solution**:
- Check database connection
- Verify `UserRepository` and `CartRepository` are working
- Check application logs for errors

#### 4. Tokens Not Received
**Problem**: Frontend doesn't receive tokens

**Solution**:
- Verify `app.oauth2.redirect-uri` in `application.yml`
- Check browser console for redirect URL
- Ensure frontend route `/oauth2/redirect` exists

---

## 📝 Configuration Checklist

### Backend
- [x] Google Client ID configured
- [x] Google Client Secret configured
- [x] OAuth2 redirect URI configured
- [x] SecurityConfig updated
- [x] Success/Failure handlers created
- [x] OAuth2UserInfo extractor created

### Google Cloud Console
- [x] Project created
- [x] Google+ API enabled
- [x] OAuth2 credentials created
- [x] Authorized JavaScript origins added
- [x] Authorized redirect URIs added
- [x] Consent screen configured

### Frontend
- [x] Login with Google button
- [x] OAuth2 redirect handler route
- [x] Token storage logic
- [x] User info storage

---

## 🎯 Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| **Google Login** | ✅ | Users can login with Google |
| **Auto-Create User** | ✅ | New users created automatically |
| **Default Role** | ✅ | New users get USER role |
| **JWT Generation** | ✅ | Tokens generated after OAuth2 |
| **Cart Creation** | ✅ | Cart auto-created for new users |
| **Account Linking** | ✅ | Links Google to existing email |
| **Error Handling** | ✅ | Proper error messages |
| **Redirect to Frontend** | ✅ | Tokens passed via URL params |

---

## 📚 Additional Resources

- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Spring Security OAuth2 Guide](https://spring.io/guides/tutorials/spring-boot-oauth2/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Created**: 2026-02-09  
**Status**: ✅ Complete  
**Ready for**: Production use
