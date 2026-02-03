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
  const queryParams = req.validatedQuery || req.query;
  const expenses = await expenseService.getExpenses(queryParams);
  
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
  const params = req.validatedParams || req.params;
  const expense = await expenseService.getExpenseById(params.id);
  
  const response = ApiResponse.success(expense, 'Expense retrieved successfully');
  res.status(response.statusCode).json(response);
});

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update expense by ID
 * @access  Public
 */
export const updateExpense = asyncHandler(async (req, res) => {
  const params = req.validatedParams || req.params;
  const expense = await expenseService.updateExpense(params.id, req.body);
  
  const response = ApiResponse.success(expense, 'Expense updated successfully');
  res.status(response.statusCode).json(response);
});

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete expense by ID
 * @access  Public
 */
export const deleteExpense = asyncHandler(async (req, res) => {
  const params = req.validatedParams || req.params;
  await expenseService.deleteExpense(params.id);
  
  const response = ApiResponse.success(null, 'Expense deleted successfully');
  res.status(response.statusCode).json(response);
});
