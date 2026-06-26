# TeamSphere

A full-stack team and project management web application. TeamSphere lets organizations manage teams, projects, tasks, and employee attendance through a clean, responsive interface backed by a RESTful API.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Data Models](#data-models)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)

---

## Overview

TeamSphere is split into two independent sub-projects:

| Sub-project | Technology | Default Port |
|---|---|---|
| `teamsphere-frontend` | React + Vite SPA | `5173` |
| `teamsphere-backend` | Django REST Framework API | `8000` |

The frontend communicates with the backend exclusively through the REST API using JWT-based authentication. All protected routes on the frontend require a valid token.

---

## Tech Stack

### Frontend (`teamsphere-frontend/`)

| Category | Library / Tool |
|---|---|
| Framework | React 19 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 6 |
| State management | Zustand 5 |
| HTTP client | Axios |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | Sonner |

### Backend (`teamsphere-backend/`)

| Category | Library / Tool |
|---|---|
| Framework | Django 5 |
| API layer | Django REST Framework |
| Authentication | Djoser + SimpleJWT |
| Database | PostgreSQL |
| CORS | django-cors-headers |
| DB config | dj-database-url + python-dotenv |

---

## Project Structure

```
teamsphere/
├── teamsphere-frontend/          # React SPA
│   └── src/
│       ├── components/           # Reusable UI primitives
│       │   ├── Button.jsx
│       │   ├── Card.jsx
│       │   ├── Input.jsx
│       │   └── Modal.jsx
│       ├── hooks/                # Custom React hooks
│       │   ├── useAuth.js
│       │   └── useSidebar.js
│       ├── layouts/              # Page wrapper components
│       │   ├── AuthLayout.jsx    # Wraps login/register/forgot-password
│       │   └── MainLayout.jsx    # Wraps authenticated pages (sidebar + topbar)
│       ├── lib/
│       │   ├── constants.js      # App-wide constants (e.g. APP_NAME)
│       │   └── utils.js          # Utility helpers (e.g. cn() for class merging)
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   └── ForgotPassword.jsx
│       │   ├── Dashboard.jsx     # Summary stats view
│       │   ├── Projects.jsx      # Project list + create
│       │   ├── Tasks.jsx         # Task list + create
│       │   └── Teams.jsx         # Team list + create
│       ├── routes/
│       │   ├── AppRoutes.jsx     # All route definitions
│       │   └── ProtectedRoute.jsx# Guards authenticated routes
│       ├── sections/
│       │   ├── Sidebar.jsx       # Collapsible navigation sidebar
│       │   └── Topbar.jsx        # Top header bar
│       ├── services/             # Axios API call wrappers
│       │   ├── api.js            # Axios instance with JWT interceptor
│       │   ├── auth.js
│       │   ├── projects.js
│       │   ├── tasks.js
│       │   ├── teams.js
│       │   └── attendance.js
│       └── store/
│           ├── authStore.js      # Zustand store: user + token
│           └── uiStore.js        # Zustand store: sidebar open/close
│
└── teamsphere-backend/           # Django REST API
    ├── users/                    # Custom user model + roles
    ├── projects/                 # Project CRUD
    ├── tasks/                    # Task CRUD
    ├── teams/                    # Team CRUD
    ├── attendance/               # Check-in / check-out records
    ├── notifications/            # Notification model (placeholder)
    └── teamsphere_backend/       # Django project config (settings, urls, wsgi)
```

---

## Features

### Dashboard
- Animated summary cards showing live counts of Projects, Tasks, Teams, and Attendance records.
- Data is fetched in parallel on load using `Promise.all`.
- Shows a spinner while loading and a user-friendly error state on failure.

### Projects
- List all projects in a responsive card grid.
- Create a new project via a modal form (name + description).
- Each project card shows its name and description.

### Tasks
- List all tasks across all projects.
- Create a new task with a title, description, and project assignment (dropdown).
- Task cards display the associated project name.
- Task status values: `todo`, `in_progress`, `done`.

### Teams
- List all teams in a responsive card grid.
- Create a new team by name via a modal form.
- Teams support many-to-many membership with users.

### Attendance
- Track employee check-in and check-out times per day.
- Each record is linked to a user with a date, check-in time, and optional check-out time.

### Authentication
- Register a new account with email + password.
- Log in with email + password to receive a JWT access token.
- Forgot password flow (UI page present).
- JWT token and user info are persisted in `localStorage` and rehydrated on page refresh via Zustand.
- All authenticated API requests automatically attach the Bearer token via an Axios request interceptor.
- Protected routes redirect unauthenticated users to `/login`.

### UI / UX
- Responsive layout with a collapsible sidebar (mobile-friendly).
- Dark mode support via Tailwind CSS dark variant.
- Smooth page-entry animations using Framer Motion.
- Toast notifications via Sonner.
- Active route highlighted in the sidebar.

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `id` | integer | Primary key |
| `email` | string | Unique, used as login field |
| `username` | string | Required |
| `role` | string | `admin`, `manager`, or `member` (default: `member`) |
| `password` | string | Hashed by Django |

### Team
| Field | Type | Notes |
|---|---|---|
| `id` | integer | Primary key |
| `name` | string | |
| `members` | M2M → User | Many users can belong to many teams |
| `created_at` | datetime | Auto-set on creation |

### Project
| Field | Type | Notes |
|---|---|---|
| `id` | integer | Primary key |
| `name` | string | |
| `description` | text | Optional |
| `owner` | FK → User | Deletes project if owner is deleted |
| `team` | FK → Team | Optional team association |
| `created_at` | datetime | Auto-set on creation |

### Task
| Field | Type | Notes |
|---|---|---|
| `id` | integer | Primary key |
| `title` | string | |
| `description` | text | Optional |
| `project` | FK → Project | Deletes task if project is deleted |
| `assignee` | FK → User | Optional; set to null if user deleted |
| `status` | string | `todo`, `in_progress`, or `done` |
| `due_date` | date | Optional |
| `created_at` | datetime | Auto-set on creation |

### Attendance
| Field | Type | Notes |
|---|---|---|
| `id` | integer | Primary key |
| `user` | FK → User | |
| `date` | date | |
| `check_in` | datetime | |
| `check_out` | datetime | Optional |

---

## API Endpoints

All endpoints are prefixed with `/api/`.

### Authentication (via Djoser + SimpleJWT)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/users/` | Register a new user |
| `POST` | `/api/auth/jwt/create/` | Log in — returns `access` and `refresh` tokens |
| `POST` | `/api/auth/jwt/refresh/` | Refresh access token |
| `GET` | `/api/auth/users/me/` | Get current authenticated user |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects/` | List all projects |
| `POST` | `/api/projects/` | Create a project |
| `GET` | `/api/projects/{id}/` | Get a single project |
| `PUT/PATCH` | `/api/projects/{id}/` | Update a project |
| `DELETE` | `/api/projects/{id}/` | Delete a project |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks/` | List all tasks |
| `POST` | `/api/tasks/` | Create a task |
| `GET` | `/api/tasks/{id}/` | Get a single task |
| `PUT/PATCH` | `/api/tasks/{id}/` | Update a task |
| `DELETE` | `/api/tasks/{id}/` | Delete a task |

### Teams

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/teams/` | List all teams |
| `POST` | `/api/teams/` | Create a team |
| `GET` | `/api/teams/{id}/` | Get a single team |
| `PUT/PATCH` | `/api/teams/{id}/` | Update a team |
| `DELETE` | `/api/teams/{id}/` | Delete a team |

### Attendance

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/attendance/` | List all attendance records |
| `POST` | `/api/attendance/` | Create an attendance record |
| `GET` | `/api/attendance/{id}/` | Get a single record |
| `PUT/PATCH` | `/api/attendance/{id}/` | Update a record |
| `DELETE` | `/api/attendance/{id}/` | Delete a record |

All endpoints except auth registration and login require a valid JWT `Authorization: Bearer <token>` header.

---

## Authentication Flow

```
User fills Login form
        │
        ▼
POST /api/auth/jwt/create/   ──▶  { access, refresh }
        │
        ▼
Store access token in localStorage + Zustand authStore
        │
        ▼
GET /api/auth/users/me/       ──▶  { id, email, username, role }
        │
        ▼
Store user object in localStorage + Zustand authStore
        │
        ▼
Every subsequent Axios request
  └── request interceptor reads token from Zustand/localStorage
  └── sets Authorization: Bearer <token> header automatically
        │
        ▼
ProtectedRoute checks authStore.token
  ├── token present  ──▶  render the page
  └── no token       ──▶  <Navigate to="/login" />
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+

---

### Backend Setup

```bash
cd teamsphere-backend

# Create and activate a virtual environment
python -m venv ../venv
source ../venv/bin/activate      # Windows: ..\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp .env.example .env             # then edit .env with your values

# Create the PostgreSQL database
psql -U postgres -c "CREATE USER teamsphere_user WITH PASSWORD 'yourpassword';"
psql -U postgres -c "CREATE DATABASE teamsphere OWNER teamsphere_user;"

# Apply migrations
python manage.py migrate

# Create a superuser (optional, for Django admin)
python manage.py createsuperuser

# Start the dev server
python manage.py runserver
```

---

### Frontend Setup

```bash
cd teamsphere-frontend

# Install dependencies
npm install

# Copy environment config
cp .env.example .env             # then edit .env with your values

# Start the dev server
npm run dev
```

---

## Environment Variables

### Backend — `teamsphere-backend/.env`

| Variable | Description | Example |
|---|---|---|
| `SECRET_KEY` | Django secret key | `django-insecure-...` |
| `DEBUG` | Enable debug mode | `True` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://teamsphere_user:yourpassword@localhost:5432/teamsphere` |
| `ALLOWED_HOSTS` | Comma-separated allowed hosts | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed frontend origins | `http://localhost:5173` |

### Frontend — `teamsphere-frontend/.env`

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL for the backend API | `http://localhost:8000/api` |

---

## Running the App

Start both servers in separate terminals:

```bash
# Terminal 1 — Backend
cd teamsphere-backend
source ../venv/bin/activate
python manage.py runserver

# Terminal 2 — Frontend
cd teamsphere-frontend
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

The Django admin panel is available at [http://localhost:8000/admin](http://localhost:8000/admin).
