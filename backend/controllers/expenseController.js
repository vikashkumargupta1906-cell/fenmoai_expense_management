const { Expense } = require('../models');
const { Op } = require('sequelize');

const createExpense = async (req, res) => {
  try {
    const { id, amount, category, description, date } = req.body;

    // Fast check for idempotency
    const existingExpense = await Expense.findByPk(id);
    if (existingExpense) {
      return res.status(200).json(existingExpense);
    }

    try {
      const newExpense = await Expense.create({
        id,
        amount,
        category,
        description,
        date
      });
      res.status(201).json(newExpense);
    } catch (createError) {
      // Handle the case where another request with the same ID succeeded between our check and create
      if (createError.name === 'SequelizeUniqueConstraintError') {
        const raceConditionWinner = await Expense.findByPk(id);
        return res.status(200).json(raceConditionWinner);
      }
      throw createError;
    }
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(400).json({ error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { category, sort, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const where = {};
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
