import React, { useState, useEffect } from 'react';
import { Category, TransactionFormData, Transaction } from '../../types';
import { Button, Input, Select } from '../UI';
import { format } from 'date-fns';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: TransactionFormData) => void;
  initialData?: Transaction;
  loading?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  categories,
  onSubmit,
  initialData,
  loading,
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    categoryId: '',
    amount: 0,
    type: 'expense',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TransactionFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        categoryId: initialData.categoryId,
        amount: initialData.amount,
        type: initialData.type,
        description: initialData.description,
        date: initialData.date.split('T')[0],
      });
    }
  }, [initialData]);

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  const categoryOptions = filteredCategories.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.name}`,
  }));

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionFormData, string>> = {};

    if (!formData.categoryId) {
      newErrors.categoryId = 'Vui lòng chọn danh mục';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Vui lòng nhập số tiền hợp lệ';
    }
    if (!formData.date) {
      newErrors.date = 'Vui lòng chọn ngày';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        date: new Date(formData.date).toISOString(),
      });
    }
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData((prev) => ({
      ...prev,
      type,
      categoryId: '', // Reset category when type changes
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`flex-1 py-2 rounded-md font-medium transition-colors ${
            formData.type === 'expense'
              ? 'bg-expense text-white'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          Chi tiêu
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`flex-1 py-2 rounded-md font-medium transition-colors ${
            formData.type === 'income'
              ? 'bg-income text-white'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          Thu nhập
        </button>
      </div>

      {/* Amount */}
      <Input
        label="Số tiền (VND)"
        type="number"
        value={formData.amount || ''}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))
        }
        error={errors.amount}
        placeholder="0"
        min="0"
      />

      {/* Category */}
      <Select
        label="Danh mục"
        options={categoryOptions}
        value={formData.categoryId}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, categoryId: value }))
        }
        error={errors.categoryId}
      />

      {/* Date */}
      <Input
        label="Ngày"
        type="date"
        value={formData.date}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, date: e.target.value }))
        }
        error={errors.date}
      />

      {/* Description */}
      <Input
        label="Ghi chú"
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        placeholder="Nhập ghi chú (tùy chọn)"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant={formData.type === 'expense' ? 'danger' : 'success'}
        className="w-full"
        loading={loading}
      >
        {initialData ? 'Cập nhật' : 'Thêm giao dịch'}
      </Button>
    </form>
  );
};

export default TransactionForm;

