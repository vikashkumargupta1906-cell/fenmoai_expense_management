# Fenmo AI - Expense Tracker Pro

A robust, full-stack expense management dashboard built with React, Node.js, and PostgreSQL. Now upgraded with **Secure Authentication** and **Real-time Analytics**.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Recharts, React Router, HSL-based Glassmorphism.
- **Backend**: Node.js, Express, Sequelize ORM, JWT, Bcrypt.
- **Database**: PostgreSQL.
- **Infrastructure**: Vercel (Frontend), Render (Backend).

## 🚀 Recent Upgrades
- **🔒 Secure Authentication**: Full Login/Signup flow using JWT and Bcrypt for encrypted password storage and secure sessions.
- **📊 Analytics Engine**: Visual spending trends and category breakdowns powered by Recharts.
- **👥 Multi-User Isolation**: Every record is linked to a specific user. Your data is private, isolated, and secure.
- **📉 Intelligent Pagination**: Server-side pagination ensures the dashboard remains snappy regardless of how many records you have.

## 📝 Developer Notes

### Key Design Decisions
- **User-Centric Data Isolation**: I implemented a 1:N relationship between Users and Expenses. This ensures that the global state and API results are always scoped to the authenticated user ID for 100% data privacy.
- **Global Auth Interceptor**: I built a silent Axios interceptor that automatically injects the security token into every request and detects expired sessions to securely redirect users back to the login page.
- **Glassmorphism Aesthetic**: I chose a premium, dark-mode "Glassmorphism" UI. It elevates the product feel from a simple utility to an enterprise-grade financial intelligence tool.

### Trade-offs & Production Readiness
- **Sequelize Auto-Sync**: I used `sync({ alter: true })` for faster schema iteration during this development phase. In a large-scale production setup, I'd transition to a migration-based system like Sequelize-CLI.
- **State Partitioning**: I moved the `AuthProvider` to the root `main.jsx`. This was a critical architectural change that allowed `App.jsx` and all underlying child components to depend on a single source of truth for the user's session status.

### Production Environment Variables

#### Backend (`.env`)
```bash
PORT=5000
DATABASE_URL= # Your PostgreSQL connection string
FRONTEND_URL= # Your Vercel domain (for CORS)
JWT_SECRET= # A secure random string for signing tokens
```

#### Frontend (`.env`)
```bash
VITE_API_BASE_URL= # Your Render backend URL
```

---
*Built with ❤️ for the Fenmo AI assignment.*
