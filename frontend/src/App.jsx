import { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import * as api from './services/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getExpenses();
      setExpenses(response.data.expenses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleExpenseCreated = async (expenseData) => {
    const response = await api.createExpense(expenseData);
    setExpenses((prev) => [response.data, ...prev]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await api.deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600 mt-2">
            Track and manage your personal expenses
          </p>
        </header>

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => {
              setError(null);
              fetchExpenses();
            }} 
          />
        )}

        <ExpenseForm
          onExpenseCreated={handleExpenseCreated}
          onError={handleFormError}
        />

        {loading && <LoadingSpinner />}

        {!loading && (
          <>
            <ExpenseSummary expenses={expenses} />
            <ExpenseList
              expenses={expenses}
              loading={loading}
              onDelete={handleDelete}
              onRefresh={fetchExpenses}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
