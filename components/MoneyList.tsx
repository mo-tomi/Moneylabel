import React from 'react';
import { MoneyItem, MoneyType } from '../types';
import MoneyCard from './MoneyCard';
import EmptyState from './EmptyState';

interface MoneyListProps {
  items: MoneyItem[];
  activeTab: MoneyType | 'all';
  onEdit: (item: MoneyItem) => void;
  onDelete: (id: number) => void;
  onSplit: (item: MoneyItem) => void;
  onAmountUpdate: (id: number, amount: number) => void;
}

const tabTitles: Record<MoneyType | 'all', string> = {
  'all': '📋 登録済みのお金',
  [MoneyType.Wallet]: '👛 財布の中身',
  [MoneyType.Savings]: '🏦 貯金の内訳',
};

const MoneyList: React.FC<MoneyListProps> = ({ items, activeTab, onEdit, onDelete, onSplit, onAmountUpdate }) => {
  const topLevelItems = items.filter(item => !item.parentId);
  
  return (
    <div className="bg-white rounded-xl card-shadow p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">{tabTitles[activeTab]}</h2>
      {topLevelItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {topLevelItems.map(item => (
            <MoneyCard 
                key={item.id} 
                item={item} 
                allData={items} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                onSplit={onSplit}
                onAmountUpdate={onAmountUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoneyList;