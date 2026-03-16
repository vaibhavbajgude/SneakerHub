# Frontend Quick Start

## ✅ **React + Vite + Tailwind CSS - Ready!**

### 🚀 **Start Development**

```bash
cd frontend
npm run dev
```

Open: `http://localhost:5173`

---

### 📁 **Project Structure**

```
frontend/
├── src/
│   ├── components/layout/    # Header, Footer
│   ├── layouts/              # MainLayout
│   ├── pages/                # All pages
│   ├── routes/               # AppRoutes
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css             # Tailwind + Custom styles
├── tailwind.config.js        # ✅ Configured
├── postcss.config.js         # ✅ Configured
└── package.json
```

---

### 🎨 **Quick Examples**

#### Button
```jsx
<button className="btn btn-primary">Click Me</button>
```

#### Card
```jsx
<div className="card">
  <div className="card-body">
    <h3>Title</h3>
    <p>Content</p>
  </div>
</div>
```

#### Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

---

### 🎯 **Custom Classes**

- **Buttons**: `btn btn-primary`, `btn-secondary`, `btn-outline`
- **Cards**: `card`, `card-body`, `card-header`
- **Inputs**: `input`, `input-error`, `input-success`
- **Badges**: `badge badge-primary`, `badge-success`
- **Container**: `container-custom`
- **Section**: `section`

---

### 📱 **Responsive**

```jsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

Breakpoints: `sm` `md` `lg` `xl` `2xl`

---

### 🎨 **Colors**

- **Primary**: Blue (`primary-600`)
- **Secondary**: Purple (`secondary-600`)
- **Accent**: Orange (`accent-600`)

---

### ✨ **Animations**

- `animate-fade-in`
- `animate-slide-up`
- `animate-slide-down`
- `animate-scale-in`

---

### 📚 **Full Documentation**

See **`FRONTEND_SETUP.md`** for complete guide.

---

**Status**: ✅ Ready to develop!
