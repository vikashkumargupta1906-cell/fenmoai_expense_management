const { Expense } = require('../models');
const { Op } = require('sequelize');

const createExpense = async (req, res) => {
  try {
    const { id, amount, category, description, date } = req.body;
    const userId = req.user.id;

    // Fast check for idempotency
    const existing = await Expense.findOne({ where: { id, userId } });
    if (existing) {
      return res.status(200).json(existing);
    }

    const expense = await Expense.create({ 
      id, 
      amount, 
      category, 
      description, 
      date,
      userId
    });
    res.status(201).json(expense);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const existing = await Expense.findOne({ where: { id: req.body.id, userId: req.user.id } });
      return res.status(200).json(existing);
    }
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { category, sort, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const where = { userId };
    if (category && category !== 'All') {
      where.category = category;
    }

    const order = [];
    if (sort === 'date_desc') {
      order.push(['date', 'DESC']);
    } else {
      order.push(['date', 'ASC']);
    }

    const { count, rows } = await Expense.findAndCountAll({
      where,
      order,
      limit: limitNum,
      offset: offset
    });

    res.status(200).json({
      expenses: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limitNum),
        currentPage: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createExpense,
  getExpenses
};
