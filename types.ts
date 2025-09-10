
export enum MoneyType {
  Wallet = 'wallet',
  Savings = 'savings',
}

export interface MoneyItem {
  id: number;
  label: string;
  amount: number;
  type: MoneyType;
  parentId?: number | null;
}
