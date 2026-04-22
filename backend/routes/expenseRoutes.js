const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { body, query, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateExpense = [
  body('id').isUUID().withMessage('ID must be a valid UUID'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number (minimum ₹0.01)'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 date')
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(today.getFullYear() - 100);

      if (inputDate > today) {
        throw new Error('Expense date cannot be in the future');
      }
      if (inputDate < hundredYearsAgo) {
        throw new Error('Expense date cannot be more than 100 years in the past');
      }
      return true;
    }),
  body('description')
    .optional()
    .custom((value) => {
      if (!value) return true;
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 200) {
        throw new Error('Description cannot exceed 200 words');
      }
      return true;
    }),
  handleValidationErrors
];

router.post('/', validateExpense, expenseController.createExpense);
router.get('/', expenseController.getExpenses);

module.exports = router;
