'use client';

import Link from 'next/link';
import { format } from 'date-fns/format';
import { Trade } from "@/types/trade";
import { useEffect, useState } from 'react';

const JournalTable = ({ trades }: { trades: Trade[] }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      {trades.map((trade, i) => {
        const pnl = trade.pnl ? Number.parseFloat(trade.pnl) : null;
        const isWin = trade.outcome === 'win';
        const isLoss = trade.outcome === 'loss';

        const outcomeBadge = trade.outcome && (
          <span style={{
            background: isWin ? 'rgba(0,255,136,0.08)'
              : isLoss ? 'rgba(255,59,59,0.08)'
              : 'rgba(255,255,255,0.05)',
            color: isWin ? '#00ff88' : isLoss ? '#ff3b3b' : '#555',
            border: `1px solid ${isWin
              ? 'rgba(0,255,136,0.2)'
              : isLoss ? 'rgba(255,59,59,0.2)' : '#1e1e1e'}`,
            fontSize: '9px', letterSpacing: '1.5px',
            padding: '3px 8px', fontWeight: 700,
          }}>
            {trade.outcome.toUpperCase()}
          </span>
        );

        return (
          <div key={trade.id} style={{
            borderBottom: '1px solid #141414',
            background: i % 2 === 0 ? '#0a0a0a' : '#0c0c0c',
          }}>

            {/* Desktop row */}
            {!isMobile && (
              <div style={{
                display: 'grid',
                gridTemplateColumns:
                  '140px 100px 80px 100px 100px 100px 80px 120px 100px 1fr 80px',
                padding: '12px 16px',
                alignItems: 'center',
              }}>
                <div>
                  <Link href={`/trades/${trade.id}`} style={{
                    color: '#00aaff', textDecoration: 'none',
                    fontSize: '12px', fontWeight: 600, letterSpacing: '1px',
                  }}>
                    {trade.symbol}
                  </Link>
                </div>
                <div style={{ color: '#555', fontSize: '10px', letterSpacing: '1px' }}>
                  {trade.market.toUpperCase()}
                </div>
                <div style={{
                  color: trade.direction === 'long' ? '#00ff88' : '#ff3b3b',
                  fontSize: '10px', fontWeight: 700, letterSpacing: '1px',
                }}>
                  {trade.direction === 'long' ? '▲ LONG' : '▼ SHORT'}
                </div>
                <div style={{ color: '#888', fontSize: '11px' }}>
                  {trade.entry_price}
                </div>
                <div style={{ color: '#666', fontSize: '11px' }}>
                  {trade.exit_price ?? '—'}
                </div>
                <div style={{
                  color: pnl === null ? '#444'
                    : pnl >= 0 ? '#00ff88' : '#ff3b3b',
                  fontSize: '12px', fontWeight: 600,
                }}>
                  {pnl !== null
                    ? `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`
                    : '—'}
                </div>
                <div style={{ color: '#00aaff', fontSize: '11px' }}>
                  {trade.risk_reward_ratio
                    ? `${trade.risk_reward_ratio}R` : '—'}
                </div>
                <div style={{ color: '#555', fontSize: '10px' }}>
                  {trade.strategy || '—'}
                </div>
                <div>{outcomeBadge}</div>
                <div style={{ color: '#444', fontSize: '10px' }}>
                  {format(new Date(trade.entry_time), 'dd MMM yy HH:mm')}
                </div>
                <div>
                  <Link href={`/trades/${trade.id}/edit`} style={{
                    color: '#333', fontSize: '10px', letterSpacing: '1px',
                    textDecoration: 'none', border: '1px solid #1e1e1e',
                    padding: '3px 8px', display: 'inline-block',
                  }}>
                    EDIT
                  </Link>
                </div>
              </div>
            )}

            {/* Mobile card */}
            {isMobile && (
              <Link href={`/trades/${trade.id}`} style={{
                display: 'block',
                padding: '16px',
                textDecoration: 'none',
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '12px',
                }}>
                  <span style={{
                    color: '#00aaff', fontSize: '14px',
                    fontWeight: 700, letterSpacing: '1px',
                  }}>
                    {trade.symbol}
                  </span>
                  {outcomeBadge}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                }}>
                  {[
                    {
                      label: 'MARKET',
                      value: trade.market.toUpperCase(),
                      color: '#666',
                    },
                    {
                      label: 'DIRECTION',
                      value: trade.direction === 'long' ? '▲ LONG' : '▼ SHORT',
                      color: trade.direction === 'long' ? '#00ff88' : '#ff3b3b',
                    },
                    {
                      label: 'ENTRY',
                      value: trade.entry_price,
                      color: '#888',
                    },
                    {
                      label: 'P&L',
                      value: pnl !== null
                        ? `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`
                        : '—',
                      color: pnl === null ? '#444'
                        : pnl >= 0 ? '#00ff88' : '#ff3b3b',
                    },
                    {
                      label: 'R:R',
                      value: trade.risk_reward_ratio
                        ? `${trade.risk_reward_ratio}R` : '—',
                      color: '#00aaff',
                    },
                    {
                      label: 'DATE',
                      value: format(new Date(trade.entry_time), 'dd MMM yy'),
                      color: '#444',
                    },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div style={{
                        color: '#2a2a2a', fontSize: '8px',
                        letterSpacing: '2px', marginBottom: '3px',
                      }}>
                        {label}
                      </div>
                      <div style={{
                        color, fontSize: '12px', fontWeight: 600,
                      }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </Link>
            )}

          </div>
        );
      })}
    </>
  );
};

export default JournalTable;