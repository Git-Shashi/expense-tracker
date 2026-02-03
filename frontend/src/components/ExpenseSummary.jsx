import { useMemo } from 'react';
import Card from './Card';

export default function ExpenseSummary({ expenses }) {
  const summaryData = useMemo(() => {
    const categoryTotals = {};
    let grandTotal = 0;

    expenses.forEach((expense) => {
      const category = expense.category;
      const amount = expense.amount;

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += amount;
      grandTotal += amount;
    });

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([category, total]) => ({
        category,
        total,
        percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
      }));

    return { categories: sortedCategories, grandTotal };
  }, [expenses]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (expenses.length === 0) {
    return null;
  }

  return (
    <Card title="Expense Summary" className="mb-6">
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="text-sm font-medium opacity-90">Total Expenses</div>
          <div className="text-3xl font-bold mt-1">
            {formatAmount(summaryData.grandTotal)}
          </div>
          <div className="text-sm opacity-90 mt-2">
            Across {summaryData.categories.length} {summaryData.categories.length === 1 ? 'category' : 'categories'}
          </div>
        </div>

        <div className="space-y-3">
          {summaryData.categories.map(({ category, total, percentage }) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">{category}</span>
                <span className="text-lg font-bold text-gray-900">{formatAmount(total)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium min-w-[50px] text-right">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
