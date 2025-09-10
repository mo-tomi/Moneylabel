import React, { useState } from 'react';
import { MoneyItem } from '../types';

interface AIAdvisorProps {
  moneyData: MoneyItem[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ moneyData }) => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getAIAdvice = async () => {
    setIsLoading(true);
    setError('');
    setAdvice('');

    if (!process.env.DEEPSEEK_KEY) {
      setError('DeepSeek API Key is not set. Please check your Netlify environment variables.');
      setIsLoading(false);
      return;
    }

    try {
      const prompt = `あなたは優秀な家計アドバイザーです。以下の家計データに基づいて、ユーザーに役立つ分析と具体的なアドバイスを提供してください。\n\n家計データ:\n${JSON.stringify(moneyData, null, 2)}\n\n分析とアドバイス:`;

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'あなたは優秀な家計アドバイザーです。' },
            { role: 'user', content: prompt }
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.message || JSON.stringify(errorData)}`);
      }

      const data = await apiResponse.json();
      setAdvice(data.choices[0].message.content);

    } catch (err: any) {
      console.error('Failed to get AI advice:', err);
      setError(err.message || 'AIアドバイスの取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">AI支出コーチ</h2>
      <button
        onClick={getAIAdvice}
        disabled={isLoading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? '分析中...' : 'AIに支出を分析してもらう'}
      </button>

      {error && <p className="text-red-500 mt-4">エラー: {error}</p>}

      {advice && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md whitespace-pre-wrap">
          <h3 className="font-medium mb-2">AIからのアドバイス:</h3>
          <p>{advice}</p>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
