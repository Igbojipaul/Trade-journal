'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#00ff88', '#ff3b3b', '#555'];

const chartStyle = {
  backgroundColor: '#0d0d0d',
  border: '1px solid #1e1e1e',
  fontSize: '10px',
  fontFamily: 'Roboto Mono, monospace',
  color: '#888',
};

const sectionTitle = {
  color: '#333',
  fontSize: '9px',
  letterSpacing: '3px',
  marginBottom: '20px',
  paddingBottom: '10px',
  borderBottom: '1px solid #1a1a1a',
  display: 'block' as const,
};

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trades/analytics/')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <main style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{
        color: '#333', fontSize: '11px', letterSpacing: '3px',
      }}>
        PROCESSING DATA...
      </span>
    </main>
  );

  if (!data) return null;

  return (
    <main style={{
      minHeight: '100vh', background: '#0a0a0a', padding: '24px',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '24px',
          paddingBottom: '24px', borderBottom: '1px solid #1e1e1e',
        }}>
          <div>
            <div style={{
              color: '#333', fontSize: '9px',
              letterSpacing: '3px', marginBottom: '4px',
            }}>
              PERFORMANCE ANALYSIS
            </div>
            <h1 style={{
              fontSize: '20px', fontWeight: 700,
              color: '#e8e8e8', letterSpacing: '3px', margin: 0,
            }}>
              ANALYTICS
            </h1>
          </div>
          <Link href="/" style={{
            color: '#333', fontSize: '10px',
            letterSpacing: '2px', textDecoration: 'none',
          }}>
            ← DASHBOARD
          </Link>
        </div>

        <div style={{ display: 'grid', gap: '1px' }}>

          {/* P&L Over Time */}
          <div style={{
            background: '#0a0a0a',
            border: '1px solid #1e1e1e',
            padding: '24px',
          }}>
            <span style={sectionTitle}>CUMULATIVE P&L</span>
            {data.pnl_over_time.length === 0 ? (
              <div style={{
                color: '#222', fontSize: '11px',
                letterSpacing: '2px', padding: '40px 0', textAlign: 'center',
              }}>
                NO DATA // LOG MORE TRADES
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.pnl_over_time}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#111" />
                  <XAxis dataKey="date" stroke="#222"
                    tick={{ fill: '#444', fontSize: 10,
                      fontFamily: 'Roboto Mono' }} />
                  <YAxis stroke="#222"
                    tick={{ fill: '#444', fontSize: 10,
                      fontFamily: 'Roboto Mono' }}
                    tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={chartStyle}
                    formatter={(v: any) => [`$${v}`, '']} />
                  <Line type="monotone" dataKey="cumulative"
                    stroke="#00ff88" strokeWidth={1.5}
                    dot={false} name="CUMULATIVE" />
                  <Line type="monotone" dataKey="daily"
                    stroke="#00aaff" strokeWidth={1}
                    dot={false} name="DAILY"
                    strokeDasharray="4 4" />
                  <Legend
                    wrapperStyle={{
                      fontSize: '10px',
                      fontFamily: 'Roboto Mono',
                      color: '#444',
                      letterSpacing: '2px',
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Outcome + By Market */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px',
          }}>
            {/* Outcome */}
            <div style={{
              background: '#0a0a0a',
              border: '1px solid #1e1e1e',
              padding: '24px',
            }}>
              <span style={sectionTitle}>OUTCOME BREAKDOWN</span>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data.outcome_breakdown}
                    dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={80}
                    strokeWidth={0}>
                    {data.outcome_breakdown.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartStyle} />
                  <Legend wrapperStyle={{
                    fontSize: '10px',
                    fontFamily: 'Roboto Mono',
                    color: '#444',
                    letterSpacing: '2px',
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* By Market */}
            <div style={{
              background: '#0a0a0a',
              border: '1px solid #1e1e1e',
              padding: '24px',
            }}>
              <span style={sectionTitle}>P&L BY MARKET</span>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.by_market}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#111" />
                  <XAxis dataKey="market" stroke="#222"
                    tick={{ fill: '#444', fontSize: 10,
                      fontFamily: 'Roboto Mono' }} />
                  <YAxis stroke="#222"
                    tick={{ fill: '#444', fontSize: 10,
                      fontFamily: 'Roboto Mono' }}
                    tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={chartStyle}
                    formatter={(v: any) => [`$${v}`, 'P&L']} />
                  <Bar dataKey="total_pnl" name="P&L"
                    strokeWidth={0}>
                    {data.by_market.map((entry: any, i: number) => (
                      <Cell key={i}
                        fill={entry.total_pnl >= 0 ? '#00ff88' : '#ff3b3b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* By Strategy */}
          <div style={{
            background: '#0a0a0a',
            border: '1px solid #1e1e1e',
            padding: '24px',
          }}>
            <span style={sectionTitle}>P&L BY STRATEGY</span>
            {data.by_strategy.length === 0 ? (
              <div style={{
                color: '#222', fontSize: '11px',
                letterSpacing: '2px', padding: '40px 0', textAlign: 'center',
              }}>
                NO STRATEGY TAGS FOUND
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.by_strategy}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#111" />
                  <XAxis dataKey="strategy" stroke="#222"
                    tick={{ fill: '#444', fontSize: 10,
                      fontFamily: 'Roboto Mono' }} />
                  <YAxis stroke="#222"
                    tick={{ fill: '#444', fontSize: 10,
                      fontFamily: 'Roboto Mono' }}
                    tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={chartStyle} />
                  <Bar dataKey="total_pnl" name="P&L" strokeWidth={0}>
                    {data.by_strategy.map((entry: any, i: number) => (
                      <Cell key={i}
                        fill={entry.total_pnl >= 0 ? '#00ff88' : '#ff3b3b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}