
import React from 'react';
import Icon from './Icon';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg">
      <Icon name="empty" className="mx-auto w-16 h-16 text-gray-400 mb-4" />
      <p className="text-lg font-medium">まだお金が登録されていません</p>
      <p className="text-sm">上のフォームから追加してみましょう！</p>
    </div>
  );
};

export default EmptyState;
