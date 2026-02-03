import * as expenseService from '../services/expense.service.js';
import { ApiResponse } from '../utils/api-response.js';
import { asyncHandler } from '../middlewares/async.middleware.js';

/**
 * @route   POST /api/expenses
 * @desc    Create a new expense
 * @access  Public
 */
export const createExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.createExpense(req.body);
  
  const response = ApiResponse.created(expense, 'Expense created successfully');
  res.status(response.statusCode).json(response);
});

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses with optional filters
 * @access  Public
 */
export const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getExpenses(req.query);
  
  // Calculate total for current filtered list
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const response = ApiResponse.success(
    {
      expenses,
      total,
      count: expenses.length
    },
    'Expenses retrieved successfully'
  );
  
  res.status(response.statusCode).json(response);
});

/**
 * @route   GET /api/expenses/:id
 * @desc    Get expense by ID
 * @access  Public
 */
export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await expenseService.getExpenseById(req.params.id);
  
  const response = ApiResponse.success(expense, 'Expense retrieved successfully');
  res.status(response.statusCode).json(response);
});

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update expense by ID
 * @access  Public
 */
export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await expenseService.updateExpense(req.params.id, req.body);
  
  const response = ApiResponse.success(expense, 'Expense updated successfully');
  res.status(response.statusCode).json(response);
});

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete expense by ID
 * @access  Public
 */
export const deleteExpense = asyncHandler(async (req, res) => {
  await expenseService.deleteExpense(req.params.id);
  
  const response = ApiResponse.success(null, 'Expense deleted successfully');
  res.status(response.statusCode).json(response);
});
