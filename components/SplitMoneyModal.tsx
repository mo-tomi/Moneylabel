
import React, { useState, useEffect, useMemo } from 'react';
import { MoneyItem } from '../types';
import Icon from './Icon';

interface SplitMoneyModalProps {
  item: MoneyItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (parentItem: MoneyItem, subItems: {label: string, amount: number}[]) => void;
}

type SubItem = { id: number; label: string; amount: string };

const SplitMoneyModal: React.FC<SplitMoneyModalProps> = ({ item, isOpen, onClose, onSave }) => {
  const [subItems, setSubItems] = useState<SubItem[]>([]);

  useEffect(() => {
    if (item) {
      setSubItems([
        { id: 1, label: '', amount: '' },
        { id: 2, label: '', amount: '' },
      ]);
    }
  }, [item]);

  const totalSubAmount = useMemo(() => {
    return subItems.reduce((sum, sub) => sum + (parseInt(sub.amount, 10) || 0), 0);
  }, [subItems]);

  if (!isOpen || !item) {
    return null;
  }

  const remainingAmount = item.amount - totalSubAmount;
  const canSave = remainingAmount === 0 && subItems.every(sub => sub.label.trim() && parseInt(sub.amount, 10) > 0);

  const handleSubItemChange = (id: number, field: 'label' | 'amount', value: string) => {
    setSubItems(prev => prev.map(sub => sub.id === id ? { ...sub, [field]: value } : sub));
  };

  const addSubItem = () => {
    setSubItems(prev => [...prev, { id: Date.now(), label: '', amount: '' }]);
  };

  const removeSubItem = (id: number) => {
    setSubItems(prev => prev.filter(sub => sub.id !== id));
  };

  const handleSave = () => {
    if (!canSave) return;
    const finalSubItems = subItems
        .filter(sub => sub.label.trim() && parseInt(sub.amount, 10) > 0)
        .map(sub => ({ label: sub.label.trim(), amount: parseInt(sub.amount, 10) }));
    onSave(item, finalSubItems);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white rounded-xl card-shadow p-8 w-full max-w-lg m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">「{item.label}」を分割</h2>
        <p className="text-gray-600 mb-6">合計金額が ¥{item.amount.toLocaleString()} になるように分割してください。</p>
        
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {subItems.map((sub, index) => (
            <div key={sub.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <input
                  type="text"
                  placeholder={`サブカテゴリ ${index + 1}`}
                  value={sub.label}
                  onChange={(e) => handleSubItemChange(sub.id, 'label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-5">
                 <input
                  type="number"
                  placeholder="金額"
                  value={sub.amount}
                  onChange={(e) => handleSubItemChange(sub.id, 'amount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-1">
                {subItems.length > 1 && (
                    <button onClick={() => removeSubItem(sub.id)} className="text-gray-400 hover:text-red-600 p-1 rounded-full">
                        <Icon name="delete" className="w-5 h-5"/>
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button onClick={addSubItem} className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          + サブカテゴリを追加
        </button>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-right">
            <div className="text-sm text-gray-600">残り金額</div>
            <div className={`text-2xl font-bold ${remainingAmount !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                ¥{remainingAmount.toLocaleString()}
            </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg">
            キャンセル
          </button>
          <button onClick={handleSave} disabled={!canSave} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:bg-indigo-300 disabled:cursor-not-allowed">
            保存する
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitMoneyModal;
