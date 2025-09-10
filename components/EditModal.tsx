
import React, { useState, useEffect } from 'react';
import { MoneyItem, MoneyType } from '../types';

interface EditModalProps {
  item: MoneyItem | null;
  isOpen: boolean;
  hasChildren: boolean;
  onClose: () => void;
  onSave: (item: MoneyItem) => void;
}

const EditModal: React.FC<EditModalProps> = ({ item, isOpen, hasChildren, onClose, onSave }) => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<MoneyType>(MoneyType.Wallet);

  useEffect(() => {
    if (item) {
      setLabel(item.label);
      setAmount(String(item.amount));
      setType(item.type);
    }
  }, [item]);

  if (!isOpen || !item) {
    return null;
  }

  const handleSave = () => {
    const parsedAmount = parseInt(amount, 10);
    if (label.trim() && !hasChildren && !isNaN(parsedAmount) && parsedAmount > 0) {
      onSave({ ...item, label: label.trim(), amount: parsedAmount, type });
    } else if (label.trim() && hasChildren) {
      onSave({ ...item, label: label.trim(), type });
    } else {
      alert('有効なラベル名と金額を入力してください。');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white rounded-xl card-shadow p-8 w-full max-w-md m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">項目を編集</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="editLabel" className="block text-sm font-medium text-gray-700 mb-2">ラベル名</label>
            <input
              id="editLabel"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="editAmount" className="block text-sm font-medium text-gray-700 mb-2">金額 (円)</label>
            <input
              id="editAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={hasChildren}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {hasChildren && <p className="text-xs text-gray-500 mt-1">サブカテゴリの合計金額が自動的に反映されるため、直接編集はできません。</p>}
          </div>
          <div>
            <label htmlFor="editType" className="block text-sm font-medium text-gray-700 mb-2">種類</label>
            <select
              id="editType"
              value={type}
              onChange={(e) => setType(e.target.value as MoneyType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              <option value={MoneyType.Wallet}>財布</option>
              <option value={MoneyType.Savings}>貯金</option>
            </select>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            保存する
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
