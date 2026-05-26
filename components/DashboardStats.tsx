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
    <div style={{ color: '#333', fontSize: '11px',
      letterSpacing: '2px', padding: '24px 0' }}>
      LOADING MARKET DATA...
    </div>
  );

  if (!summary) return null;

  const stats = [
    {
      label: 'TOTAL TRADES',
      value: summary.total_trades,
      color: '#e8e8e8',
      sub: null,
    },
    {
      label: 'WIN RATE',
      value: `${summary.win_rate}%`,
      color: summary.win_rate >= 50 ? '#00ff88' : '#ff3b3b',
      sub: `${summary.wins}W / ${summary.losses}L`,
    },
    {
      label: 'NET P&L',
      value: `$${summary.total_pnl.toFixed(2)}`,
      color: summary.total_pnl >= 0 ? '#00ff88' : '#ff3b3b',
      sub: summary.total_pnl >= 0 ? 'PROFITABLE' : 'IN DRAWDOWN',
    },
    {
      label: 'AVG R:R',
      value: `${summary.avg_risk_reward}R`,
      color: '#00aaff',
      sub: summary.avg_risk_reward >= 1 ? 'POSITIVE EV' : 'NEGATIVE EV',
    },
    {
      label: 'WINS',
      value: summary.wins,
      color: '#00ff88',
      sub: null,
    },
    {
      label: 'LOSSES',
      value: summary.losses,
      color: '#ff3b3b',
      sub: null,
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '1px',
      background: '#1e1e1e',
      marginBottom: '1px',
    }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{
          background: '#0a0a0a',
          padding: '20px 16px',
          borderBottom: '1px solid #1e1e1e',
        }}>
          <div style={{
            color: '#444',
            fontSize: '9px',
            letterSpacing: '2px',
            marginBottom: '8px',
          }}>
            {stat.label}
          </div>
          <div style={{
            color: stat.color,
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '1px',
            marginBottom: '4px',
          }}>
            {stat.value}
          </div>
          {stat.sub && (
            <div style={{
              color: '#333',
              fontSize: '9px',
              letterSpacing: '1px',
            }}>
              {stat.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}