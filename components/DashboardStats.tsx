'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { TradeSummary } from '@/types/trade';

export default function DashboardStats() {
  const [summary, setSummary] = useState<TradeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trades/summary/')
      .then(res => setSummary(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>Loading</div>
  )
  if (!summary) return null;

  const stats = [
    { label: 'Total Trades', value: summary.total_trades, color: 'text-blue-400' },
    { label: 'Win Rate', value: `${summary.win_rate}%`, color: 'text-green-400' },
    { label: 'Total P&L', value: `$${summary.total_pnl.toFixed(2)}`,
      color: summary.total_pnl >= 0 ? 'text-green-400' : 'text-red-400' },
    { label: 'Avg R:R', value: summary.avg_risk_reward, color: 'text-blue-400' },
    { label: 'Wins', value: summary.wins, color: 'text-green-400' },
    { label: 'Losses', value: summary.losses, color: 'text-red-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
            {stat.label}
          </p>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}