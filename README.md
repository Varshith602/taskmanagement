# TaskFlow — Full-Stack Task Management Application

A full-stack, responsive task management web application built with **React (Vite)**, **Node.js (Express)**, and **MongoDB (Mongoose)**, featuring complete user authentication (JWT + bcrypt), interactive dashboards, and task CRUD with filtering, sorting, and search.

---

## 🚀 Key Features

- **Authentication & Security:**
  - User Registration & Login with validation.
  - Password hashing with `bcryptjs`.
  - JSON Web Token (`JWT`) authentication with route protection.
  - Strict data isolation ensuring each user only accesses their own tasks.
- **Task Management (CRUD):**
  - **Create:** Add tasks with title, description, priority (`Low`, `Medium`, `High`), status (`Pending`, `In Progress`, `Completed`), and due date.
  - **Read:** Comprehensive task list view and detailed task modal.
  - **Update:** Full editing of task details and deadlines.
  - **Delete:** Interactive confirmation dialog preventing accidental deletions.
- **Search, Filter & Sort:**
  - Real-time search by task title.
  - Filtering by status and priority.
  - Dynamic sorting by due date or creation date (ascending/descending).
- **Interactive Dashboard:**
  - Overview metrics: Total Tasks, Pending, In Progress, Completed, Overdue.
  - Quick-glance list of recent tasks with direct view/edit actions.
- **Modern UI / UX:**
  - Pure JavaScript (no TypeScript) and styled with clean SaaS design tokens.
  - Toast notification alerts for user actions and errors.
  - Mobile-responsive navigation drawer.
- **Zero-Setup Database Fallback:**
  - Automatically connects to local MongoDB URI (`mongodb://127.0.0.1:27017/taskflow_db`).
  - If a local MongoDB instance is not detected, it automatically starts an embedded in-memory MongoDB for seamless evaluation.


---

## 🛠 Tech Stack

- **Client:** React 18, Vite, React Router v6, Axios, Lucide React, Context API.
- **Server:** Node.js, Express, Mongoose, JSON Web Token (JWT), bcryptjs, Morgan, CORS, Dotenv.
- **Database:** MongoDB / Mongoose (with MongoDB Memory Server fallback).

---

## 📂 Project Structure

```
taskmanagement.threnax/
├── client/                     # Frontend React (Vite) Application
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Reusable UI (TaskCard, Filters, Modal, Badges, etc.)
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── layouts/            # DashboardLayout (Navbar, Sidebar, Topbar)
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Tasks, TaskDetails
│   │   ├── services/           # Axios API instance with JWT interceptors
│   │   ├── utils/              # Shared date/overdue helpers
│   │   ├── App.jsx             # React Router application routes
│   │   ├── index.css           # Modern SaaS stylesheet & design variables
│   │   └── main.jsx            # Application mount point
│   ├── index.html              # HTML entry point with Google Fonts
│   ├── package.json
│   └── vite.config.js          # Vite config with API proxy
│
├── server/                     # Backend Node.js / Express REST API
│   ├── config/
│   │   └── db.js               # MongoDB connection with automatic fallback
│   ├── controllers/
│   │   ├── authController.js   # User registration, login, and profile fetching
│   │   └── taskController.js   # User-scoped task CRUD and dashboard metrics
│   ├── middleware/
│   │   ├── auth.js             # JWT bearer verification middleware
│   │   └── errorHandler.js     # Centralized error handler
│   ├── models/
│   │   ├── Task.js             # Mongoose Task Schema
│   │   └── User.js             # Mongoose User Schema with bcrypt hook
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth endpoints
│   │   └── taskRoutes.js       # /api/tasks endpoints
│   ├── .env                    # Server environment variables
│   ├── e2eCheck.mjs            # End-to-end API test suite
│   ├── seedDemo.mjs            # Demo account + sample data seeder
│   ├── package.json
│   └── server.js               # Express app bootstrap
│
├── .env.example                # Example environment configuration
├── package.json                # Root package configuration with run scripts
└── README.md                   # Project documentation
```

---

## ⚡ Quick Start Guide

### 1. Installation
Install all dependencies:
```bash
npm run install:all
```

### 2. Running the Application
Launch both server and client concurrently:
```bash
npm run dev
```

Or run them in separate terminals:
```bash
# Terminal 1 - Backend API (port 5000)
npm run server

# Terminal 2 - Frontend Client (port 3000)
npm run client
```

Open your browser at: **http://localhost:3000**

---

## 📡 REST API Documentation

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Private |

### Task Routes (`/api/tasks`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/tasks` | List tasks (supports `search`, `status`, `priority`, `sortBy`, `sortOrder`) | Private |
| `GET` | `/api/tasks/stats` | Dashboard metrics (`total`, `pending`, `inProgress`, `completed`, `overdue`) + `recentTasks` | Private |
| `GET` | `/api/tasks/:id` | Fetch a single task | Private (owner only) |
| `POST` | `/api/tasks` | Create a task | Private |
| `PUT` | `/api/tasks/:id` | Update a task | Private (owner only) |
| `DELETE` | `/api/tasks/:id` | Delete a task | Private (owner only) |

All task responses are user-scoped: a user can never read, modify, or delete another user's tasks (`403 Forbidden`).

---

## 🧪 Automated Verification

With the backend running, execute the end-to-end API suite (31 assertions covering auth, task CRUD, search, filters, sorting, dashboard stats, overdue logic, validation, and cross-user isolation):

```bash
npm run test:e2e
```

Expected output: `RESULT: 31 passed, 0 failed`

Build the production frontend bundle to confirm the client compiles cleanly:

```bash
npm run build:client
```

### Seed demo data

Populate a ready-made demo account with 8 sample tasks (useful for screenshots or a quick walkthrough):

```bash
node server/seedDemo.mjs
```

```
Email:    demo@taskflow.dev
Password: Password123
```

---

## 🎨 UI Overview

The interface is a fully custom design system built on CSS custom properties (no UI framework), defined in `client/src/index.css`.

| Area | Highlights |
|---|---|
| **Landing page** | Sticky blurred navbar, gradient hero headline, animated status pill, mock dashboard preview window, feature grid, dark footer |
| **Auth pages** | Centred card on a soft radial-gradient backdrop, icon-prefixed inputs, inline validation messages |
| **Workspace shell** | Fixed sidebar with user card, active nav pill, sticky translucent topbar, off-canvas drawer below 1024px |
| **Dashboard** | Gradient welcome hero, 5 colour-coded statistic tiles, recent tasks grid |
| **Tasks** | Search box with clear button, 4 control filter/sort row, responsive card grid, red left-border + `OVERDUE` tag on late items |
| **Task details** | Full-page view and modal view sharing the same badge/meta layout |
| **Forms** | Two-column layout with a 3-up row for Priority / Status / Due Date |
| **Feedback** | Gradient primary buttons, tinted toast notifications, ESC-closable modals with scroll lock |

Every class referenced in JSX is defined in the stylesheet, and all animations respect `prefers-reduced-motion`.

---

## 🔗 Live URLs

| Service | URL |
|---|---|
| Frontend (React + Vite) | http://localhost:3000 |
| Backend REST API | http://localhost:5000/api |
| API Health Check | http://localhost:5000/api/health |

