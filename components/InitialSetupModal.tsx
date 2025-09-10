import React, { useState } from 'react';

interface InitialSetupModalProps {
  isOpen: boolean;
  onSave: (walletAmount: number, savingsAmount: number) => void;
}

const InitialSetupModal: React.FC<InitialSetupModalProps> = ({ isOpen, onSave }) => {
  const [walletAmount, setWalletAmount] = useState(0);
  const [savingsAmount, setSavingsAmount] = useState(0);

  const handleSave = () => {
    onSave(walletAmount, savingsAmount);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 m-4 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">初期設定</h2>
        <p className="text-center text-gray-600 mb-6">現在の財布と貯金の金額を入力してください。</p>
        <div className="space-y-4">
          <div>
            <label htmlFor="wallet-amount" className="block text-sm font-medium text-gray-700 mb-1">
              財布の金額
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">¥</span>
              <input
                type="number"
                id="wallet-amount"
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={walletAmount}
                onChange={(e) => setWalletAmount(Number(e.target.value))}
                placeholder="10000"
              />
            </div>
          </div>
          <div>
            <label htmlFor="savings-amount" className="block text-sm font-medium text-gray-700 mb-1">
              貯金の金額
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">¥</span>
              <input
                type="number"
                id="savings-amount"
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={savingsAmount}
                onChange={(e) => setSavingsAmount(Number(e.target.value))}
                placeholder="100000"
              />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            設定を完了してはじめる
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialSetupModal;
