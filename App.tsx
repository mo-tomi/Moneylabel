import React, { useState, useMemo } from 'react';
import { MoneyItem, MoneyType } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import AddMoneyForm from './components/AddMoneyForm';
import MoneyList from './components/MoneyList';
import EditModal from './components/EditModal';
import SplitMoneyModal from './components/SplitMoneyModal';
import AdjustTotalModal from './components/AdjustTotalModal';
import InitialSetupModal from './components/InitialSetupModal';
import AIAdvisor from './components/AIAdvisor';

const App: React.FC = () => {
  const [isSetupComplete, setIsSetupComplete] = useLocalStorage('isSetupComplete', false);
  const [moneyData, setMoneyData] = useLocalStorage<MoneyItem[]>('moneyData', []);
  const [nextId, setNextId] = useLocalStorage<number>('nextId', 1);
  const [trueWalletTotal, setTrueWalletTotal] = useLocalStorage('trueWalletTotal', 0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MoneyItem | null>(null);
  
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [splittingItem, setSplittingItem] = useState<MoneyItem | null>(null);

  const [activeTab, setActiveTab] = useState<MoneyType | 'all'>('all');
  
  const [adjustingType, setAdjustingType] = useState<MoneyType | null>(null);

  const handleInitialSetup = (walletAmount: number, savingsAmount: number) => {
    setTrueWalletTotal(walletAmount);
    if (savingsAmount > 0) {
        const initialSavings: MoneyItem = { id: 1, label: '貯金', amount: savingsAmount, type: MoneyType.Savings, parentId: null };
        setMoneyData([initialSavings]);
        setNextId(2);
    } else {
        setMoneyData([]);
        setNextId(1);
    }
    setIsSetupComplete(true);
  };

  const addMoney = (label: string, amount: number, type: MoneyType) => {
    const newItem: MoneyItem = { id: nextId, label, amount, type, parentId: null };
    setMoneyData([...moneyData, newItem]);
    setNextId(nextId + 1);
  };

  const deleteMoney = (id: number) => {
    if (window.confirm('この項目を削除しますか？サブカテゴリもすべて削除されます。')) {
        const itemsToDelete = new Set<number>();
        const queue: number[] = [id];
        
        while(queue.length > 0) {
            const currentId = queue.shift()!;
            itemsToDelete.add(currentId);
            const children = moneyData.filter(item => item.parentId === currentId);
            children.forEach(child => queue.push(child.id));
        }

        setMoneyData(moneyData.filter(item => !itemsToDelete.has(item.id)));
    }
  };

  const updateMoney = (updatedItem: MoneyItem) => {
    setMoneyData(moneyData.map(item => (item.id === updatedItem.id ? updatedItem : item)));
    closeEditModal();
  };

  const handleAmountUpdate = (id: number, amount: number) => {
    setMoneyData(moneyData.map(item => 
        item.id === id ? { ...item, amount } : item
    ));
  };
  
  const handleSplitSave = (parentItem: MoneyItem, subItems: {label: string, amount: number}[]) => {
      let currentId = nextId;
      const newSubItems: MoneyItem[] = subItems.map(sub => ({
          id: currentId++,
          label: sub.label,
          amount: sub.amount,
          type: parentItem.type,
          parentId: parentItem.id,
      }));

      setMoneyData([
          ...moneyData.map(item => item.id === parentItem.id ? { ...item, amount: 0 } : item),
          ...newSubItems
      ]);
      setNextId(currentId);
      closeSplitModal();
  }

  const openEditModal = (item: MoneyItem) => {
      setEditingItem(item);
      setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
      setEditingItem(null);
      setIsEditModalOpen(false);
  };

  const openSplitModal = (item: MoneyItem) => {
    setSplittingItem(item);
    setIsSplitModalOpen(true);
  };

  const closeSplitModal = () => {
      setSplittingItem(null);
      setIsSplitModalOpen(false);
  };

  const openAdjustModal = (type: MoneyType) => {
    setAdjustingType(type);
  };

  const closeAdjustModal = () => {
      setAdjustingType(null);
  };

  const leafItems = useMemo(() => {
    const itemHasChildren = (itemId: number) => moneyData.some(i => i.parentId === itemId);
    return moneyData.filter(item => !itemHasChildren(item.id));
  }, [moneyData]);

  const labeledWalletAmount = useMemo(() => 
    leafItems
        .filter(item => item.type === MoneyType.Wallet)
        .reduce((sum, item) => sum + item.amount, 0)
  , [leafItems]);

  const totalSavingsAmount = useMemo(() => 
      leafItems
          .filter(item => item.type === MoneyType.Savings)
          .reduce((sum, item) => sum + item.amount, 0)
  , [leafItems]);

  const totalAmount = useMemo(() => trueWalletTotal + totalSavingsAmount, [trueWalletTotal, totalSavingsAmount]);

  const handleAdjustTotal = (newTotal: number) => {
    if (!adjustingType) return;

    if (adjustingType === MoneyType.Wallet) {
        setTrueWalletTotal(newTotal);
    } else { // For Savings
        const difference = newTotal - totalSavingsAmount;
        if (difference !== 0) {
            const newItem: MoneyItem = {
                id: nextId,
                label: '金額調整',
                amount: difference,
                type: adjustingType,
                parentId: null,
            };
            setMoneyData([...moneyData, newItem]);
            setNextId(nextId + 1);
        }
    }
    closeAdjustModal();
  };

  const filteredData = useMemo(() => {
    if (activeTab === 'all') {
      return moneyData;
    }
    const relevantIds = new Set<number>();
    const dataById = new Map(moneyData.map(item => [item.id, item]));

    moneyData.forEach(item => {
      if (item.type === activeTab) {
        relevantIds.add(item.id);
      }
    });

    // Add all ancestors
    relevantIds.forEach(id => {
      let current = dataById.get(id);
      while (current?.parentId) {
        relevantIds.add(current.parentId);
        current = dataById.get(current.parentId);
      }
    });

    return moneyData.filter(item => relevantIds.has(item.id));
  }, [moneyData, activeTab]);

  const editingItemHasChildren = useMemo(() => {
    if (!editingItem) return false;
    return moneyData.some(i => i.parentId === editingItem.id);
  }, [editingItem, moneyData]);

  const tabs: { key: MoneyType | 'all'; label: string }[] = [
    { key: 'all', label: 'すべて' },
    { key: MoneyType.Wallet, label: '財布' },
    { key: MoneyType.Savings, label: '貯金' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <InitialSetupModal isOpen={!isSetupComplete} onSave={handleInitialSetup} />
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <AddMoneyForm onAdd={addMoney} />
        <StatsCards 
          total={totalAmount} 
          walletTotal={trueWalletTotal}
          walletLabeled={labeledWalletAmount}
          savingsTotal={totalSavingsAmount}
          onEditWallet={() => openAdjustModal(MoneyType.Wallet)}
          onEditSavings={() => openAdjustModal(MoneyType.Savings)}
        />
        
        <AIAdvisor moneyData={moneyData} />

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`${
                    activeTab === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                  aria-current={activeTab === tab.key ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <MoneyList 
            items={filteredData} 
            activeTab={activeTab} 
            onEdit={openEditModal} 
            onDelete={deleteMoney} 
            onSplit={openSplitModal}
            onAmountUpdate={handleAmountUpdate}
        />
      </main>
      <EditModal 
        isOpen={isEditModalOpen}
        item={editingItem}
        hasChildren={editingItemHasChildren}
        onClose={closeEditModal}
        onSave={updateMoney}
      />
      <SplitMoneyModal
        isOpen={isSplitModalOpen}
        item={splittingItem}
        onClose={closeSplitModal}
        onSave={handleSplitSave}
      />
       <AdjustTotalModal
        isOpen={!!adjustingType}
        type={adjustingType}
        currentTotal={adjustingType === MoneyType.Wallet ? trueWalletTotal : totalSavingsAmount}
        onClose={closeAdjustModal}
        onSave={handleAdjustTotal}
      />
    </div>
  );
};

export default App;