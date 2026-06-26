# TeamSphere Full-Stack Project

A modern, production-ready team collaboration and productivity management app. Built with React 19 (Vite), Tailwind CSS v4, Zustand, Django REST Framework, PostgreSQL, and best practices.

---

## 🚀 Tech Stack

**Frontend:**
- React 19 (Vite)
- Tailwind CSS v4 (dark mode)
- React Router v6+
- Zustand (state management)
- axios (API calls)
- react-hook-form + zod (forms & validation)
- lucide-react (icons)
- sonner (notifications)

**Backend:**
- Django 5+
- Django REST Framework
- Djoser + SimpleJWT (email-based authentication)
- PostgreSQL
- CORS headers

---

## 📁 Folder Structure (Frontend)

```
src/
├── assets/         # Images, fonts, etc.
├── components/     # Reusable UI components (Button, Input, Modal, ...)
├── sections/       # Page sections (Sidebar, Topbar, ...)
├── pages/          # Route-level pages (Dashboard, Login, ...)
│   └── auth/       # Auth pages (Login, Register, ForgotPassword)
├── layouts/        # Layout wrappers (MainLayout, AuthLayout)
├── hooks/          # Custom React hooks
├── services/       # API calls (feature-based)
├── lib/            # Utility functions, constants
├── routes/         # Route definitions and protection
├── store/          # Zustand stores (auth, UI)
├── styles/         # Tailwind config, global CSS
└── App.jsx         # Main app entry
```

---

## 🛠️ Setup & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Create `.env` in the frontend root:**
   ```env
   VITE_API_URL=http://127.0.0.1:8001/api
   ```
3. **Start the backend:**
   ```bash
   cd ../teamsphere-backend
   source ../../venv/bin/activate
   python manage.py runserver 8001
   ```
4. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```
5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔑 Authentication (Email-based, JWT)
- Login and registration use **email** (not username).
- After login, JWT is stored in Zustand and localStorage.
- All API requests attach the JWT as `Authorization: Bearer <token>`.
- Protected routes use Zustand to check for a valid token.
- Auth endpoints: `/auth/jwt/create/`, `/auth/users/me/`

---

## 🧩 Components & Layout
- **Reusable UI:** `Button`, `Input`, `Modal` in `src/components/`
- **Layout:** `Sidebar`, `Topbar` in `src/sections/`, composed in `MainLayout`
- **AuthLayout:** For login/register/forgot password pages

---

## 📦 API Service Layer
- All API calls use a central axios instance (`src/services/api.js`)
- JWT is attached to every request (from Zustand or localStorage)
- Feature-based API files: `auth.js`, `projects.js`, `tasks.js`, `teams.js`, `attendance.js`

---

## 🗂️ State Management
- **Zustand** for global state (auth, UI/sidebar, theme)
- **Custom hooks** for sidebar toggle, auth, etc.

---

## 📝 Example Usage

```jsx
import Button from './components/Button';
<Button onClick={() => alert('Clicked!')}>Click Me</Button>
```

---

## 🧑‍💻 Troubleshooting
- **Login returns `{ "detail": "Authentication credentials were not provided." }`**
  - Make sure your backend is running and accessible at the URL in `.env`.
  - Ensure JWT is stored and attached to all requests (see `src/services/api.js`).
- **Login returns `{ "username": ["This field is required."] }`**
  - Make sure your backend and Djoser are configured for email login (see backend README).
  - Your frontend should send `{ email, password }` to `/auth/jwt/create/`.
- **CORS errors**
  - Ensure `CORS_ALLOWED_ORIGINS` in Django settings includes your frontend URL.

---

## 🔗 Backend Integration
- Designed to work with Django REST Framework backend (see `/services` for endpoints)
- Set your backend API URL in `.env` as `VITE_API_URL`

---

## 📄 License
MIT
