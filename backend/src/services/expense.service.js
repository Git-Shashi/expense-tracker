import Expense from '../models/expense.model.js';
import { ApiError } from '../utils/api-error.js';

/**
 * Create a new expense
 * @param {Object} expenseData - Expense data
 * @returns {Promise<Object>} Created expense
 */
export const createExpense = async (expenseData) => {
  try {
    const expense = await Expense.create(expenseData);
    return expense;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw error; // Let error middleware handle it
    }
    throw ApiError.internal('Failed to create expense');
  }
};

/**
 * Get all expenses with optional filtering and sorting
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of expenses
 */
export const getExpenses = async (filters = {}) => {
  try {
    const { category, sortBy = 'date', order = 'desc', limit, skip } = filters;
    
    // Build query
    const query = {};
    if (category) {
      query.category = category;
    }

    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    // Execute query with optional pagination
    let queryBuilder = Expense.find(query).sort(sortObj);
    
    if (skip) {
      queryBuilder = queryBuilder.skip(skip);
    }
    
    if (limit) {
      queryBuilder = queryBuilder.limit(limit);
    }

    const expenses = await queryBuilder.exec();
    return expenses;
  } catch (error) {
    throw ApiError.internal('Failed to retrieve expenses');
  }
};

/**
 * Get expense by ID
 * @param {string} id - Expense ID
 * @returns {Promise<Object>} Expense document
 */
export const getExpenseById = async (id) => {
  try {
    const expense = await Expense.findById(id);
    
    if (!expense) {
      throw ApiError.notFound('Expense not found');
    }
    
    return expense;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === 'CastError') {
      throw ApiError.badRequest('Invalid expense ID format');
    }
    throw ApiError.internal('Failed to retrieve expense');
  }
};

/**
 * Update expense by ID
 * @param {string} id - Expense ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated expense
 */
export const updateExpense = async (id, updateData) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!expense) {
      throw ApiError.notFound('Expense not found');
    }
    
    return expense;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      throw error;
    }
    throw ApiError.internal('Failed to update expense');
  }
};

/**
 * Delete expense by ID
 * @param {string} id - Expense ID
 * @returns {Promise<Object>} Deleted expense
 */
export const deleteExpense = async (id) => {
  try {
    const expense = await Expense.findByIdAndDelete(id);
    
    if (!expense) {
      throw ApiError.notFound('Expense not found');
    }
    
    return expense;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.name === 'CastError') {
      throw ApiError.badRequest('Invalid expense ID format');
    }
    throw ApiError.internal('Failed to delete expense');
  }
};

/**
 * Get total of expenses with optional category filter
 * @param {string} category - Optional category filter
 * @returns {Promise<number>} Total amount
 */
export const getExpensesTotal = async (category = null) => {
  try {
    const match = category ? { category } : {};
    
    const result = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    return result.length > 0 ? result[0].total : 0;
  } catch (error) {
    throw ApiError.internal('Failed to calculate total');
  }
};
