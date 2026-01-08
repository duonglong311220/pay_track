import React from 'react';
import { Transaction, Category } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  category,
  onEdit,
  onDelete,
}) => {
  const isExpense = transaction.type === 'expense';

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: category?.color + '20' }}
        >
          {category?.icon || '📦'}
        </div>

        {/* Details */}
        <div>
          <h3 className="font-medium text-gray-800">
            {transaction.description || category?.name}
          </h3>
          <p className="text-sm text-gray-500">
            {category?.name} • {formatDate(transaction.date)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Amount */}
        <span
          className={`font-semibold ${
            isExpense ? 'text-expense' : 'text-income'
          }`}
        >
          {isExpense ? '-' : '+'}
          {formatCurrency(transaction.amount)}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <FiEdit2 size={18} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiTrash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;

