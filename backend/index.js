require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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
