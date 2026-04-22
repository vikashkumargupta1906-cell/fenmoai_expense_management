# Fenmo AI - Expense Tracker Pro

A robust, full-stack expense management dashboard built with React, Node.js, and PostgreSQL.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, HSL-based Glassmorphism.
- **Backend**: Node.js, Express, Sequelize ORM.
- **Database**: PostgreSQL.
- **Validation**: Express Validator & Client-side checks.
- **Testing**: Jest & Supertest.

## 📝 Developer Notes

### Key Design Decisions
- **Real-time Summaries**: I added a category-based summary grid at the top of the dashboard. Instead of just listing items, I wanted the user to immediately see where their money is going without having to do the math manually.
- **Backend Idempotency**: I implemented a UUID-based idempotency check on the `POST /expenses` endpoint. This means if a network blip causes a retry or a user double-clicks "Submit," the database stays clean and doesn't create duplicate records.
- **Fail-Fast Validation**: Validation happens on both ends. The frontend catches obvious mistakes (like negative amounts) instantly for a better UX, while the backend acts as the source of truth to prevent any bad data from hitting the database.

### Trade-offs & Timebox Decisions
- **State Management**: For an app of this size, I decided to keep the state in the root `App.jsx` and pass it down. While Redux or Zustand are great for scale, they would have added unnecessary boilerplate for this specific timebox.
- **Database Migrations**: I used Sequelize's `sync({ alter: true })` for the setup. In a larger production environment, I'd definitely use a formal migrations system (like Umzug or Sequelize CLI), but for this assignment, this allowed for faster iteration on the schema.
- **Simplified Styling**: I chose to stick with a "single-page dashboard" feel rather than building multiple routes. It keeps the flow focused and feels more like a modern web app.

### What’s Missing (And Why)
- **Authentication**: I intentionally left out login/signup logic. In a real-world scenario, this would be the first priority, but for this task, I chose to focus on the core functionality, validation, and API robustness.
- **Soft Deletes**: Currently, the app supports creating and listing. I didn't get into deletion/archiving logic as the primary focus was on data entry integrity and summary views.
- **Data Visuals**: I would have loved to add some Chart.js or Recharts components for visual spending trends, but I prioritized building a rock-solid validation engine and a paginated list first.

---
*Built with ❤️ for the Fenmo AI assignment.*
