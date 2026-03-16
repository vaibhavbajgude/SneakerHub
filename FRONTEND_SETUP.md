# SneakerHub Frontend - React + Vite + Tailwind CSS

## ✅ **Setup Complete!**

### 📦 **Project Structure**

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable components
│   │   └── layout/           # Layout components
│   │       ├── Header.jsx    # Navigation header
│   │       └── Footer.jsx    # Footer component
│   ├── layouts/              # Page layouts
│   │   └── MainLayout.jsx    # Main app layout
│   ├── pages/                # Page components
│   │   ├── auth/            # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── OAuth2Redirect.jsx
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Orders.jsx
│   │   ├── OrderDetail.jsx
│   │   ├── Profile.jsx
│   │   └── NotFound.jsx
│   ├── routes/               # Route configuration
│   │   └── AppRoutes.jsx
│   ├── services/             # API services (TODO)
│   ├── hooks/                # Custom React hooks (TODO)
│   ├── utils/                # Utility functions (TODO)
│   ├── context/              # React Context (TODO)
│   ├── App.jsx               # Main App component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
└── index.html
```

---

## 🎨 **Tailwind CSS Configuration**

### Custom Colors
```javascript
colors: {
  primary: {
    50-950: // Blue shades
  },
  secondary: {
    50-950: // Purple shades
  },
  accent: {
    50-950: // Orange shades
  }
}
```

### Custom Fonts
- **Sans**: Inter (body text)
- **Display**: Poppins (headings)

### Custom Shadows
- `shadow-soft` - Subtle shadow
- `shadow-medium` - Medium shadow
- `shadow-hard` - Strong shadow

### Custom Animations
- `animate-fade-in` - Fade in effect
- `animate-slide-up` - Slide up effect
- `animate-slide-down` - Slide down effect
- `animate-scale-in` - Scale in effect

---

## 🧩 **Component Classes**

### Buttons
```jsx
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary">Secondary Button</button>
<button className="btn btn-accent">Accent Button</button>
<button className="btn btn-outline">Outline Button</button>
<button className="btn btn-ghost">Ghost Button</button>

// Sizes
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary">Default</button>
<button className="btn btn-primary btn-lg">Large</button>
```

### Cards
```jsx
<div className="card">
  <div className="card-header">
    <h3>Card Title</h3>
  </div>
  <div className="card-body">
    <p>Card content</p>
  </div>
  <div className="card-footer">
    <button className="btn btn-primary">Action</button>
  </div>
</div>
```

### Inputs
```jsx
<input type="text" className="input" placeholder="Enter text" />
<input type="text" className="input input-error" placeholder="Error state" />
<input type="text" className="input input-success" placeholder="Success state" />
```

### Badges
```jsx
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-danger">Danger</span>
```

### Container
```jsx
<div className="container-custom">
  {/* Content */}
</div>
```

### Section
```jsx
<section className="section">
  {/* Section content */}
</section>
```

---

## 📱 **Responsive Design**

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Usage
```jsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

---

## 🚀 **Getting Started**

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Server will start at: `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📦 **Dependencies**

### Core
- **react**: ^18.3.1
- **react-dom**: ^18.3.1
- **react-router-dom**: ^7.1.3

### Styling
- **tailwindcss**: ^3.4.17
- **postcss**: ^8.4.49
- **autoprefixer**: ^10.4.20

### Utilities
- **axios**: ^1.7.9 (HTTP client)
- **lucide-react**: ^0.469.0 (Icons)

### Dev Dependencies
- **vite**: ^7.3.1
- **@vitejs/plugin-react**: ^4.3.4
- **eslint**: ^9.17.0

---

## 🎯 **Features**

### ✅ Implemented
- Vite React project setup
- Tailwind CSS fully configured
- Responsive header with mobile menu
- Responsive footer
- Clean folder structure
- Route configuration
- Home page with hero section
- Placeholder pages for all routes
- OAuth2 redirect handler
- 404 page
- Custom component classes
- Custom animations
- Icon library (Lucide React)

### 🚧 TODO
- API service layer
- Authentication context
- Protected routes
- Custom hooks (useAuth, useCart, etc.)
- Product components
- Cart functionality
- Checkout flow
- Order management
- User profile
- Admin dashboard

---

## 🎨 **Design System**

### Color Palette
```css
/* Primary (Blue) */
--primary-50: #f0f9ff
--primary-600: #0284c7
--primary-900: #0c4a6e

/* Secondary (Purple) */
--secondary-50: #fdf4ff
--secondary-600: #c026d3
--secondary-900: #701a75

/* Accent (Orange) */
--accent-50: #fff7ed
--accent-600: #ea580c
--accent-900: #7c2d12
```

### Typography
```css
/* Headings */
h1: 4xl md:5xl lg:6xl (Poppins Bold)
h2: 3xl md:4xl lg:5xl (Poppins Bold)
h3: 2xl md:3xl lg:4xl (Poppins Bold)

/* Body */
body: base (Inter Regular)
```

### Spacing
```css
section: py-12 md:py-16 lg:py-20
container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

---

## 🔧 **Utility Classes**

### Scrollbar
```jsx
<div className="scrollbar-hide">Hidden scrollbar</div>
<div className="scrollbar-thin">Thin scrollbar</div>
```

### Hover Effects
```jsx
<div className="hover-lift">Lifts on hover</div>
<div className="hover-scale">Scales on hover</div>
```

### Aspect Ratios
```jsx
<div className="aspect-square">1:1</div>
<div className="aspect-video">16:9</div>
<div className="aspect-product">4:5</div>
```

### Gradient Text
```jsx
<h1 className="gradient-text">Gradient Text</h1>
```

### Glass Effect
```jsx
<div className="glass">Glass morphism</div>
```

---

## 📝 **Code Examples**

### Creating a New Page
```jsx
// src/pages/MyPage.jsx
import React from 'react';

function MyPage() {
  return (
    <div className="section">
      <div className="container-custom">
        <h1 className="mb-8">My Page</h1>
        <div className="card">
          <div className="card-body">
            <p>Content goes here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
```

### Adding a Route
```jsx
// src/routes/AppRoutes.jsx
import MyPage from '../pages/MyPage';

// Add to Routes
<Route path="/my-page" element={<MyPage />} />
```

### Creating a Component
```jsx
// src/components/MyComponent.jsx
import React from 'react';

function MyComponent({ title, children }) {
  return (
    <div className="card hover-lift">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export default MyComponent;
```

---

## 🌐 **Environment Variables**

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
```

Usage:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 🚨 **Common Issues**

### Tailwind classes not working
1. Check `tailwind.config.js` content paths
2. Restart dev server
3. Clear browser cache

### Icons not showing
```bash
npm install lucide-react
```

### Routing issues
- Ensure `BrowserRouter` wraps the app
- Check route paths match exactly

---

## 📚 **Resources**

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Created**: 2026-02-09  
**Status**: ✅ Complete  
**Ready for**: Development
