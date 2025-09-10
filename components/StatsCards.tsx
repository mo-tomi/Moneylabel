import React from 'react';
import Icon from './Icon';

interface StatsCardsProps {
  total: number;
  wallet: number;
  savings: number;
  onEditWallet: () => void;
  onEditSavings: () => void;
}

const formatCurrency = (amount: number): string => `¥${amount.toLocaleString()}`;

const StatCard: React.FC<{
  title: string;
  amount: number;
  iconName: 'total' | 'wallet' | 'savings';
  color: string;
  onEdit?: () => void;
}> = ({ title, amount, iconName, color, onEdit }) => (
  <div className="bg-white rounded-xl card-shadow p-6 flex items-center justify-between">
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon name={iconName} className="w-8 h-8 text-white" />
      </div>
      <div>
        <div className="text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-gray-800">{formatCurrency(amount)}</div>
      </div>
    </div>
    {onEdit && (
      <button
        onClick={onEdit}
        title={`${title}の金額を調整`}
        className="text-gray-400 hover:text-indigo-600 p-2 rounded-full transition-colors"
      >
        <Icon name="edit" className="w-5 h-5" />
      </button>
    )}
  </div>
);

const StatsCards: React.FC<StatsCardsProps> = ({ total, wallet, savings, onEditWallet, onEditSavings }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <StatCard title="総額" amount={total} iconName="total" color="bg-indigo-500" />
      <StatCard title="財布" amount={wallet} iconName="wallet" color="bg-green-500" onEdit={onEditWallet} />
      <StatCard title="貯金" amount={savings} iconName="savings" color="bg-purple-500" onEdit={onEditSavings} />
    </div>
  );
};

export default StatsCards;