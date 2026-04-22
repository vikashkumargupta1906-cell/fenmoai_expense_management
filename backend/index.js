require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null;
const allowedOrigins = [frontendUrl, 'http://localhost:5173', 'http://localhost:3000'].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Sync Database and Start Server with Retry Logic
const startServer = async (retries = 10, delay = 2000) => {
  try {
    // In production, you'd use migrations. For this assignment, alter: true is convenient.
    await db.sequelize.authenticate();
    console.log('✅ Connection to database established successfully.');
    
    await db.sequelize.sync({ alter: true });
    console.log('✅ Database models synced.');

    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    if (retries > 0) {
      console.error(`❌ Unable to connect to the database. Retrying in ${delay/1000}s... (${retries} retries left)`);
      // Exponential backoff: increase delay for next attempt (max 30s)
      const nextDelay = Math.min(delay * 2, 30000);
      setTimeout(() => startServer(retries - 1, nextDelay), delay);
    } else {
      console.error('💀 Max retries reached. Unable to connect to the database:', error);
      process.exit(1);
    }
  }
};

startServer();

module.exports = app;
