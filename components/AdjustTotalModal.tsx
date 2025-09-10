import React, { useState, useEffect, useMemo } from 'react';
import { MoneyType } from '../types';

interface AdjustTotalModalProps {
  isOpen: boolean;
  type: MoneyType | null;
  currentTotal: number;
  onClose: () => void;
  onSave: (newTotal: number) => void;
}

const typeNames: Record<MoneyType, string> = {
  [MoneyType.Wallet]: '財布',
  [MoneyType.Savings]: '貯金',
};

const AdjustTotalModal: React.FC<AdjustTotalModalProps> = ({ isOpen, type, currentTotal, onClose, onSave }) => {
  const [newTotal, setNewTotal] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewTotal(String(currentTotal));
    }
  }, [isOpen, currentTotal]);

  const difference = useMemo(() => {
    const newAmount = parseInt(newTotal, 10);
    if (isNaN(newAmount)) return 0;
    return newAmount - currentTotal;
  }, [newTotal, currentTotal]);

  if (!isOpen || !type) {
    return null;
  }

  const handleSave = () => {
    const parsedAmount = parseInt(newTotal, 10);
    if (!isNaN(parsedAmount) && parsedAmount >= 0) {
      onSave(parsedAmount);
    } else {
      alert('有効な金額を入力してください。');
    }
  };

  const formatCurrency = (amount: number): string => `¥${amount.toLocaleString()}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white rounded-xl card-shadow p-8 w-full max-w-md m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{typeNames[type]}の金額を調整</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">現在の合計金額</label>
            <p className="text-lg font-semibold text-gray-700">{formatCurrency(currentTotal)}</p>
          </div>
          <div>
            <label htmlFor="newTotalAmount" className="block text-sm font-medium text-gray-700 mb-2">新しい合計金額</label>
            <input
              id="newTotalAmount"
              type="number"
              value={newTotal}
              onChange={(e) => setNewTotal(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="新しい合計金額を入力"
            />
          </div>
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <div className="text-sm text-gray-600">差額</div>
            <div className={`text-xl font-bold ${difference === 0 ? 'text-gray-800' : difference > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {difference > 0 ? '+' : ''}{formatCurrency(difference)}
            </div>
            <p className="text-xs text-gray-500 mt-1">この差額で「金額調整」という項目が作成されます。</p>
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
            調整を保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjustTotalModal;