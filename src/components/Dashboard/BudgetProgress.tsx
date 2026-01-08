import React from 'react';
import { Card } from '../UI';
import { formatCurrency } from '../../utils/helpers';
import { Budget, Category, Transaction } from '../../types';

interface BudgetProgressProps {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({
  budgets,
  categories,
  transactions,
}) => {
  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  const getSpentAmount = (categoryId: string) => {
    return transactions
      .filter((t) => t.categoryId === categoryId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  if (budgets.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ngân sách tháng này</h3>
        <p className="text-center text-gray-500 py-8">Chưa thiết lập ngân sách</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Ngân sách tháng này</h3>
      <div className="space-y-4">
        {budgets.map((budget) => {
          const category = getCategoryById(budget.categoryId);
          const spent = getSpentAmount(budget.categoryId);
          const percentage = Math.min((spent / budget.amount) * 100, 100);
          const isOverBudget = spent > budget.amount;

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category?.icon}</span>
                  <span className="font-medium text-gray-700">{category?.name}</span>
                </div>
                <div className="text-right">
                  <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
                    {formatCurrency(spent)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {' / '}{formatCurrency(budget.amount)}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {isOverBudget && (
                <p className="text-xs text-red-600">
                  Vượt ngân sách {formatCurrency(spent - budget.amount)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BudgetProgress;

