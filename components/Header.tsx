
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="gradient-bg text-white py-8 shadow-lg">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">💰 マネーラベル</h1>
        <p className="text-center text-indigo-100 text-sm md:text-base">お金の用途を見える化して、賢く管理しよう</p>
      </div>
    </header>
  );
};

export default Header;
