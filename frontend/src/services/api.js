import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data, // Return only data
  (error) => {
    // Handle different error scenarios
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Unable to connect to server. Please check your connection.');
    }

    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(message);
    }

    throw new Error(error.message || 'An unexpected error occurred');
  }
);

/**
 * Create a new expense
 * @param {Object} expenseData - Expense data
 * @returns {Promise<Object>} Created expense
 */
export const createExpense = async (expenseData) => {
  return apiClient.post('/expenses', expenseData);
};

/**
 * Get all expenses with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Expenses list with total
 */
export const getExpenses = async (params = {}) => {
  return apiClient.get('/expenses', { params });
};

/**
 * Delete an expense
 * @param {string} id - Expense ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteExpense = async (id) => {
  return apiClient.delete(`/expenses/${id}`);
};
