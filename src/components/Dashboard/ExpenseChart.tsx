import React from 'react';
import { Card } from '../UI';
import { CategoryStats } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface ExpenseChartProps {
  data: CategoryStats[];
  title: string;
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data, title }) => {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  if (data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-center text-gray-500 py-8">Chưa có dữ liệu</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.categoryId} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-gray-700">{item.categoryName}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-800">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.amount / maxAmount) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ExpenseChart;

