import Link from 'next/link';
import {format} from 'date-fns/format';
import { Trade } from "@/types/trade";


const JournalTable = ({ trades }: { trades: Trade[] }) => {
  return (
    <>
      {trades.map((trade, i) => {
        const pnl = trade.pnl ? parseFloat(trade.pnl) : null;
        const isWin = trade.outcome === 'win';
        const isLoss = trade.outcome === 'loss';

        return (
          <div key={trade.id} className="terminal-table" style={{
            display: 'grid',
            gridTemplateColumns:
              '140px 100px 80px 100px 100px 100px 80px 120px 100px 1fr 80px',
            padding: '12px 16px',
            borderBottom: '1px solid #141414',
            background: i % 2 === 0 ? '#0a0a0a' : '#0c0c0c',
            alignItems: 'center',
          }}>

            <div>
              <Link href={`/trades/${trade.id}`} style={{
                color: '#00aaff',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '1px',
              }}>
                {trade.symbol}
              </Link>
            </div>

            <div style={{
              color: '#555',
              fontSize: '10px',
              letterSpacing: '1px',
            }}>
              {trade.market.toUpperCase()}
            </div>

            <div style={{
              color: trade.direction === 'long' ? '#00ff88' : '#ff3b3b',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '1px',
            }}>
              {trade.direction === 'long' ? '▲ LONG' : '▼ SHORT'}
            </div>

            <div style={{
              color: '#888',
              fontSize: '11px',
              fontFamily: 'Roboto Mono, monospace',
            }}>
              {trade.entry_price}
            </div>

            <div style={{
              color: '#666',
              fontSize: '11px',
              fontFamily: 'Roboto Mono, monospace',
            }}>
              {trade.exit_price ?? '—'}
            </div>

            <div style={{
              color: pnl === null ? '#444' : pnl >= 0 ? '#00ff88' : '#ff3b3b',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              {pnl !== null
                ? `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`
                : '—'}
            </div>

            <div style={{
              color: '#00aaff',
              fontSize: '11px',
            }}>
              {trade.risk_reward_ratio
                ? `${trade.risk_reward_ratio}R`
                : '—'}
            </div>

            <div style={{
              color: '#555',
              fontSize: '10px',
              letterSpacing: '0.5px',
            }}>
              {trade.strategy || '—'}
            </div>

            <div>
              {trade.outcome ? (
                <span style={{
                  background: isWin
                    ? 'rgba(0,255,136,0.08)'
                    : isLoss
                    ? 'rgba(255,59,59,0.08)'
                    : 'rgba(255,255,255,0.05)',
                  color: isWin ? '#00ff88' : isLoss ? '#ff3b3b' : '#555',
                  border: `1px solid ${isWin
                    ? 'rgba(0,255,136,0.2)'
                    : isLoss
                    ? 'rgba(255,59,59,0.2)'
                    : '#1e1e1e'}`,
                  fontSize: '9px',
                  letterSpacing: '1.5px',
                  padding: '3px 8px',
                  fontWeight: 700,
                }}>
                  {trade.outcome.toUpperCase()}
                </span>
              ) : '—'}
            </div>

            <div style={{
              color: '#444',
              fontSize: '10px',
            }}>
              {format(new Date(trade.entry_time), 'dd MMM yy HH:mm')}
            </div>

            <div>
              <Link href={`/trades/${trade.id}/edit`} style={{
                color: '#333',
                fontSize: '10px',
                letterSpacing: '1px',
                textDecoration: 'none',
                border: '1px solid #1e1e1e',
                padding: '3px 8px',
                display: 'inline-block',
                transition: 'all 0.1s',
              }}>
                EDIT
              </Link>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default JournalTable
