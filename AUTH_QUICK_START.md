# Authentication UI - Quick Reference

## ✅ **Complete Authentication System!**

### 🚀 **Quick Start**

```bash
cd frontend
npm run dev
```

Visit: `http://localhost:5173/login`

---

### 📦 **What's Included**

✅ Login page (email/password + Google)  
✅ Register page (full form + Google)  
✅ JWT token management  
✅ Automatic token refresh  
✅ Protected routes  
✅ Auth context (global state)  
✅ Responsive UI  
✅ Form validation  

---

### 🔐 **Using Auth in Components**

```jsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.firstName}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}
```

---

### 🛡️ **Protecting Routes**

```jsx
import ProtectedRoute from './components/ProtectedRoute';

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
```

---

### 🌐 **API Calls**

```jsx
import api from './services/api';

// Automatic auth header included!
const response = await api.get('/products');
const data = await api.post('/cart/items', { productId: 1 });
```

---

### 🎨 **Pages**

- **Login**: `/login`
- **Register**: `/register`
- **OAuth Redirect**: `/oauth2/redirect`

---

### 🔑 **Token Storage**

```javascript
// Stored in localStorage
accessToken
refreshToken
user (JSON object)
```

---

### 📝 **Environment Setup**

Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

### ✨ **Features**

- Email/password authentication
- Google OAuth login
- Automatic token refresh
- Protected routes
- Role-based access
- Form validation
- Error handling
- Loading states
- Responsive design

---

### 📚 **Full Documentation**

See **`AUTH_UI_GUIDE.md`** for complete guide.

---

**Status**: ✅ Ready to use!
