import React, { useState, useMemo } from 'react';
import { MoneyItem, MoneyType } from '../types';
import Icon from './Icon';

interface MoneyCardProps {
  item: MoneyItem;
  allData: MoneyItem[];
  onEdit: (item: MoneyItem) => void;
  onDelete: (id: number) => void;
  onSplit: (item: MoneyItem) => void;
  onAmountUpdate: (id: number, amount: number) => void;
  level?: number;
}

const typeDetails: Record<MoneyType, { name: string; icon: 'wallet' | 'savings'; color: string; }> = {
  [MoneyType.Wallet]: { name: '財布', icon: 'wallet', color: 'bg-green-100 text-green-800' },
  [MoneyType.Savings]: { name: '貯金', icon: 'savings', color: 'bg-purple-100 text-purple-800' },
};

const formatCurrency = (amount: number): string => `¥${amount.toLocaleString()}`;

const MoneyCard: React.FC<MoneyCardProps> = ({ item, allData, onEdit, onDelete, onSplit, onAmountUpdate, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(String(item.amount));

  const childItems = useMemo(() => allData.filter(i => i.parentId === item.id), [allData, item.id]);
  const hasChildren = childItems.length > 0;

  const totalAmount = useMemo(() => {
    if (!hasChildren) return item.amount;
    
    let sum = 0;
    const queue = [...childItems];
    while(queue.length > 0) {
        const current = queue.shift()!;
        const children = allData.filter(i => i.parentId === current.id);
        if (children.length > 0) {
            queue.push(...children);
        } else {
            sum += current.amount;
        }
    }
    return sum;
  }, [allData, item, hasChildren, childItems]);

  const handleAmountClick = () => {
    if (!hasChildren) {
      setCurrentAmount(String(item.amount));
      setIsEditingAmount(true);
    }
  };

  const handleAmountSave = () => {
    const newAmount = parseInt(currentAmount, 10);
    if (!isNaN(newAmount) && newAmount >= 0 && newAmount !== item.amount) {
      onAmountUpdate(item.id, newAmount);
    }
    setIsEditingAmount(false);
  };

  const handleAmountKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAmountSave();
    } else if (e.key === 'Escape') {
      setIsEditingAmount(false);
      setCurrentAmount(String(item.amount));
    }
  };


  const details = typeDetails[item.type];

  return (
    <div className={`money-card bg-white rounded-lg border border-gray-200 ${level > 0 ? 'ml-6' : ''}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-3">
             {hasChildren && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-indigo-600 p-1">
                    <Icon name={isExpanded ? "chevron-down" : "chevron-right"} className="w-5 h-5" />
                </button>
            )}
            {!hasChildren && <div className="w-7"></div>}
            
            <Icon name={details.icon} className="w-8 h-8 text-gray-500 flex-shrink-0" />
            
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{item.label}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${details.color}`}>{details.name}</span>
            </div>
          </div>
          <div className="flex space-x-1">
            {!hasChildren && item.amount > 0 && (
                <button onClick={() => onSplit(item)} title="分割" className="text-gray-400 hover:text-indigo-600 p-1 rounded-full transition-colors">
                    <Icon name="split" className="w-5 h-5" />
                </button>
            )}
            <button onClick={() => onEdit(item)} title="編集" className="text-gray-400 hover:text-indigo-600 p-1 rounded-full transition-colors">
              <Icon name="edit" className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(item.id)} title="削除" className="text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors">
              <Icon name="delete" className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 text-right pr-2">
            {hasChildren ? (
                <span>{formatCurrency(totalAmount)}</span>
            ) : isEditingAmount ? (
                <input
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                onBlur={handleAmountSave}
                onKeyDown={handleAmountKeyDown}
                className="w-full text-right bg-indigo-50 border border-indigo-300 rounded-md px-2 py-1 text-2xl font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                autoFocus
                onFocus={(e) => e.target.select()}
                />
            ) : (
                <span onClick={handleAmountClick} className="cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1 transition-colors duration-200">
                {formatCurrency(item.amount)}
                </span>
            )}
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50/50 p-2 space-y-2">
            {childItems.map(child => (
                <MoneyCard 
                    key={child.id} 
                    item={child} 
                    allData={allData}
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                    onSplit={onSplit}
                    onAmountUpdate={onAmountUpdate}
                    level={level + 1}
                />
            ))}
        </div>
      )}
    </div>
  );
};

export default MoneyCard;