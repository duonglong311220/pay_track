import React from 'react';
import { Card } from '../UI';
import { formatCurrency } from '../../utils/helpers';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  percentageChange?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  type,
  percentageChange,
}) => {
  const icons = {
    income: FiTrendingUp,
    expense: FiTrendingDown,
    balance: FiDollarSign,
  };

  const colors = {
    income: 'text-income bg-green-50',
    expense: 'text-expense bg-red-50',
    balance: 'text-primary-600 bg-primary-50',
  };

  const Icon = icons[type];

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${
            type === 'expense' ? 'text-expense' : type === 'income' ? 'text-income' : 'text-gray-800'
          }`}>
            {type === 'balance' && amount >= 0 ? '+' : ''}
            {formatCurrency(amount)}
          </p>
          {percentageChange !== undefined && (
            <p className={`text-sm mt-2 ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}% so với tháng trước
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors[type]}`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;

