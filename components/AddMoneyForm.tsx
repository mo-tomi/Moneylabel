
import React, { useState } from 'react';
import { MoneyType } from '../types';

interface AddMoneyFormProps {
  onAdd: (label: string, amount: number, type: MoneyType) => void;
}

const AddMoneyForm: React.FC<AddMoneyFormProps> = ({ onAdd }) => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<MoneyType>(MoneyType.Wallet);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount, 10);
    if (label.trim() && !isNaN(parsedAmount) && parsedAmount > 0) {
      onAdd(label.trim(), parsedAmount, type);
      setLabel('');
      setAmount('');
    } else {
      alert('有効なラベル名と金額を入力してください。');
    }
  };

  return (
    <div className="bg-white rounded-xl card-shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">💼 新しいお金を登録</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="labelName" className="block text-sm font-medium text-gray-700 mb-2">ラベル名</label>
          <input
            id="labelName"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="例: 食費、交通費"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">金額 (円)</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label htmlFor="moneyType" className="block text-sm font-medium text-gray-700 mb-2">種類</label>
          <select
            id="moneyType"
            value={type}
            onChange={(e) => setType(e.target.value as MoneyType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            <option value={MoneyType.Wallet}>財布</option>
            <option value={MoneyType.Savings}>貯金</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors h-10"
        >
          追加
        </button>
      </form>
    </div>
  );
};

export default AddMoneyForm;
