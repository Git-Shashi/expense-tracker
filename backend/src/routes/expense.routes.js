import express from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createExpenseSchema,
  getExpensesQuerySchema,
  updateExpenseSchema,
  expenseIdSchema
} from '../utils/validation.js';

const router = express.Router();

/**
 * @route   POST /api/expenses
 * @desc    Create a new expense
 */
router.post(
  '/',
  validate(createExpenseSchema, 'body'),
  expenseController.createExpense
);

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses with optional filters
 */
router.get(
  '/',
  validate(getExpensesQuerySchema, 'query'),
  expenseController.getExpenses
);

/**
 * @route   GET /api/expenses/:id
 * @desc    Get expense by ID
 */
router.get(
  '/:id',
  validate(expenseIdSchema, 'params'),
  expenseController.getExpenseById
);

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update expense by ID
 */
router.put(
  '/:id',
  validate(expenseIdSchema, 'params'),
  validate(updateExpenseSchema, 'body'),
  expenseController.updateExpense
);

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete expense by ID
 */
router.delete(
  '/:id',
  validate(expenseIdSchema, 'params'),
  expenseController.deleteExpense
);

export default router;
