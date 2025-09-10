import React from 'react';
import Icon from './Icon';
import { useCountUpAnimation } from '../hooks/useCountUpAnimation';

interface StatsCardsProps {
  total: number;
  walletTotal: number;
  walletLabeled: number;
  savingsTotal: number;
  onEditWallet: () => void;
  onEditSavings: () => void;
}

const formatCurrency = (amount: number): string => `¥${amount.toLocaleString()}`;

const StatCard: React.FC<{
  title: string;
  amount: number;
  iconName: 'total' | 'savings';
  color: string;
  onEdit?: () => void;
}> = ({ title, amount, iconName, color, onEdit }) => {
  const animatedAmount = useCountUpAnimation(amount);

  return (
    <div className="bg-white rounded-xl card-shadow p-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon name={iconName} className="w-8 h-8 text-white" />
        </div>
        <div>
          <div className="text-gray-500">{title}</div>
          <div className="text-2xl font-bold text-gray-800">{formatCurrency(animatedAmount)}</div>
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
};

const WalletStatCard: React.FC<{
    title: string;
    totalAmount: number;
    labeledAmount: number;
    iconName: 'wallet';
    color: string;
    onEdit?: () => void;
}> = ({ title, totalAmount, labeledAmount, iconName, color, onEdit }) => {
    const animatedTotal = useCountUpAnimation(totalAmount);
    const animatedLabeled = useCountUpAnimation(labeledAmount);
    const animatedUnlabeled = useCountUpAnimation(totalAmount - labeledAmount);

    return (
        <div className="bg-white rounded-xl card-shadow p-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${color}`}>
                        <Icon name={iconName} className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <div className="text-gray-500">{title}</div>
                        <div className="text-2xl font-bold text-gray-800">{formatCurrency(animatedTotal)}</div>
                    </div>
                </div>
                {onEdit && (
                    <button
                        onClick={onEdit}
                        title={`${title}の金額を調整`}
                        className="text-gray-400 hover:text-indigo-600 p-2 rounded-full transition-colors self-start"
                    >
                        <Icon name="edit" className="w-5 h-5" />
                    </button>
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                    <span>ラベル済み:</span>
                    <span className="font-medium text-gray-700">{formatCurrency(animatedLabeled)}</span>
                </div>
                <div className="flex justify-between">
                    <span>未分類:</span>
                    <span className="font-medium text-gray-700">{formatCurrency(animatedUnlabeled)}</span>
                </div>
            </div>
        </div>
    );
};

const StatsCards: React.FC<StatsCardsProps> = ({ total, walletTotal, walletLabeled, savingsTotal, onEditWallet, onEditSavings }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <StatCard title="総額" amount={total} iconName="total" color="bg-indigo-500" />
      <WalletStatCard 
        title="財布" 
        totalAmount={walletTotal} 
        labeledAmount={walletLabeled} 
        iconName="wallet" 
        color="bg-green-500" 
        onEdit={onEditWallet} 
      />
      <StatCard title="貯金" amount={savingsTotal} iconName="savings" color="bg-purple-500" onEdit={onEditSavings} />
    </div>
  );
};

export default StatsCards;
