'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import api from '@/lib/api';
import { Trade } from '@/types/trade';
import TradingViewChart from '@/components/TradingViewChart';

export default function TradeDetailPage() {
  const params = useParams();
  const id = params.id;

  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get(`/trades/${id}/`)
      .then(res => {
        setTrade(res.data);
        setScreenshot(res.data.screenshot ?? null);
      })
      .catch(() => setError('ERR  COULD NOT LOAD TRADE'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleScreenshotUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !trade) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('screenshot', file);
    try {
      const res = await api.post(
        `/trades/${trade.id}/upload_screenshot/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setScreenshot(res.data.screenshot);
    } catch {
      console.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <main style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ color: '#333', fontSize: '11px', letterSpacing: '3px' }}>
        LOADING...
      </span>
    </main>
  );

  if (error || !trade) return (
    <main style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#ff3b3b', marginBottom: '16px' }}>
          {error || 'TRADE NOT FOUND'}
        </p>
        <Link href="/" style={{ color: '#00aaff', fontSize: '11px' }}>
          ← DASHBOARD
        </Link>
      </div>
    </main>
  );

  const pnl = trade.pnl ? Number.parseFloat(trade.pnl) : null;
  const rr = trade.risk_reward_ratio
    ? Number.parseFloat(trade.risk_reward_ratio) : null;
  const isWin = trade.outcome === 'win';
  const isLoss = trade.outcome === 'loss';
  const getOutcomeBackground = () => {
    if (isWin) return 'rgba(0,255,136,0.08)';
    if (isLoss) return 'rgba(255,59,59,0.08)';
    return 'rgba(255,255,255,0.04)';
  };
  const getOutcomeBorderColor = () => {
    if (isWin) return 'rgba(0,255,136,0.2)';
    if (isLoss) return 'rgba(255,59,59,0.2)';
    return '#1e1e1e';
  };
  const outcomeBackground = getOutcomeBackground();
  const outcomeBorderColor = getOutcomeBorderColor();

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #141414',
  };

  const keyStyle = { color: '#333', fontSize: '10px', letterSpacing: '1px' };
  const valStyle = { color: '#888', fontSize: '11px',
    fontFamily: 'Roboto Mono, monospace' };

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '24px',
          paddingBottom: '24px', borderBottom: '1px solid #1e1e1e',
        }}>
          <div>
            <div style={{
              color: '#333', fontSize: '9px',
              letterSpacing: '3px', marginBottom: '8px',
            }}>
              TRADE DETAIL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{
                fontSize: '24px', fontWeight: 700,
                color: '#e8e8e8', letterSpacing: '3px', margin: 0,
              }}>
                {trade.symbol}
              </h1>
              {trade.outcome && (
                <span style={{
                  background: outcomeBackground,
                  color: isWin ? '#00ff88' : isLoss ? '#ff3b3b' : '#555',
                  border: `1px solid ${outcomeBorderColor}`,
                  fontSize: '9px', letterSpacing: '2px',
                  padding: '4px 10px', fontWeight: 700,
                }}>
                  {trade.outcome.toUpperCase()}
                </span>
              )}
              <span style={{
                color: trade.direction === 'long' ? '#00ff88' : '#ff3b3b',
                fontSize: '11px', fontWeight: 700,
              }}>
                {trade.direction === 'long' ? '▲ LONG' : '▼ SHORT'}
              </span>
            </div>
            <div style={{
              color: '#444', fontSize: '10px',
              letterSpacing: '1px', marginTop: '6px',
            }}>
              {trade.market_display.toUpperCase()}
              {trade.strategy && `  ${trade.strategy.toUpperCase()}`}
            </div>
          </div>

          <Link href={`/trades/${trade.id}/edit`} style={{
            border: '1px solid #1e1e1e', color: '#555',
            fontSize: '10px', letterSpacing: '2px',
            padding: '8px 16px', textDecoration: 'none',
          }}>
            EDIT 
          </Link>
        </div>

        {/* Key Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1px', background: '#1e1e1e',
          marginBottom: '1px',
        }}>
          {[
            {
              label: 'NET P&L',
              value: pnl !== null
                ? `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`
                : '—',
              color: pnl === null ? '#444'
                : pnl >= 0 ? '#00ff88' : '#ff3b3b',
            },
            {
              label: 'RISK : REWARD',
              value: rr !== null ? `${rr}R` : '—',
              color: '#00aaff',
            },
            {
              label: 'RISK AMOUNT',
              value: trade.risk_amount
                ? `$${parseFloat(trade.risk_amount).toFixed(2)}`
                : '—',
              color: '#ffcc00',
            },
            {
              label: 'DURATION',
              value: trade.duration_minutes !== null
                ? trade.duration_minutes >= 60
                  ? `${(trade.duration_minutes / 60).toFixed(1)}H`
                  : `${trade.duration_minutes}M`
                : '—',
              color: '#aa88ff',
            },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#0a0a0a', padding: '20px 16px',
            }}>
              <div style={{
                color: '#333', fontSize: '9px',
                letterSpacing: '2px', marginBottom: '8px',
              }}>
                {stat.label}
              </div>
              <div style={{
                color: stat.color, fontSize: '22px', fontWeight: 700,
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Two column */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '1px', background: '#1e1e1e', marginBottom: '1px',
        }}>
          {/* Prices */}
          <div style={{ background: '#0a0a0a', padding: '24px' }}>
            <div style={{
              color: '#333', fontSize: '9px',
              letterSpacing: '3px', marginBottom: '16px',
              paddingBottom: '10px', borderBottom: '1px solid #1a1a1a',
            }}>
              PRICE LEVELS
            </div>
            {[
              { label: 'ENTRY', value: trade.entry_price,
                color: '#e8e8e8' },
              { label: 'EXIT',  value: trade.exit_price,
                color: '#e8e8e8' },
              { label: 'STOP LOSS', value: trade.stop_loss,
                color: '#ff3b3b' },
              { label: 'TAKE PROFIT', value: trade.take_profit,
                color: '#00ff88' },
              { label: 'LOT SIZE', value: trade.lot_size,
                color: '#888' },
            ].map(row => (
              <div key={row.label} style={rowStyle}>
                <span style={keyStyle}>{row.label}</span>
                <span style={{ ...valStyle, color: row.color }}>
                  {row.value ?? '—'}
                </span>
              </div>
            ))}
          </div>

          {/* Timing */}
          <div style={{ background: '#0a0a0a', padding: '24px' }}>
            <div style={{
              color: '#333', fontSize: '9px',
              letterSpacing: '3px', marginBottom: '16px',
              paddingBottom: '10px', borderBottom: '1px solid #1a1a1a',
            }}>
              TIMING
            </div>
            {[
              {
                label: 'ENTRY',
                value: trade.entry_time
                  ? format(parseISO(trade.entry_time),
                    'dd MMM yyyy HH:mm')
                  : null,
              },
              {
                label: 'EXIT',
                value: trade.exit_time
                  ? format(parseISO(trade.exit_time),
                    'dd MMM yyyy HH:mm')
                  : null,
              },
              {
                label: 'DURATION',
                value: trade.duration_minutes !== null
                  ? trade.duration_minutes >= 60
                    ? `${(trade.duration_minutes / 60).toFixed(1)} HOURS`
                    : `${trade.duration_minutes} MINUTES`
                  : null,
              },
              {
                label: 'LOGGED',
                value: trade.created_at
                  ? format(parseISO(trade.created_at),
                    'dd MMM yyyy HH:mm')
                  : null,
              },
            ].map(row => (
              <div key={row.label} style={rowStyle}>
                <span style={keyStyle}>{row.label}</span>
                <span style={valStyle}>{row.value ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TradingView Chart */}
        <div style={{ marginBottom: '1px' }}>
          <TradingViewChart
            symbol={trade.symbol}
            market={trade.market}
            durationMinutes={trade.duration_minutes}
            entryTime={trade.entry_time}
          />
        </div>

        {/* Notes */}
        <div style={{
          background: '#0a0a0a', border: '1px solid #1e1e1e',
          padding: '24px', marginBottom: '1px',
        }}>
          <div style={{
            color: '#333', fontSize: '9px',
            letterSpacing: '3px', marginBottom: '16px',
            paddingBottom: '10px', borderBottom: '1px solid #1a1a1a',
          }}>
            NOTES & REASONING
          </div>
          {trade.notes ? (
            <p style={{
              color: '#666', fontSize: '12px',
              lineHeight: '1.8', whiteSpace: 'pre-wrap', margin: 0,
            }}>
              {trade.notes}
            </p>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{
                color: '#222', fontSize: '11px',
                letterSpacing: '2px', marginBottom: '12px',
              }}>
                NO NOTES  THIS TRADE HAS NO ANNOTATION
              </p>
              <Link href={`/trades/${trade.id}/edit`} style={{
                color: '#00aaff', fontSize: '10px',
                letterSpacing: '1px', textDecoration: 'none',
              }}>
                ADD NOTES →
              </Link>
            </div>
          )}
        </div>

        {/* Screenshot */}
        <div style={{
          background: '#0a0a0a', border: '1px solid #1e1e1e', padding: '24px',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '16px',
            paddingBottom: '10px', borderBottom: '1px solid #1a1a1a',
          }}>
            <div style={{
              color: '#333', fontSize: '9px', letterSpacing: '3px',
            }}>
              CHART SCREENSHOT
            </div>
            <label style={{
              border: '1px solid #1e1e1e', color: '#555',
              fontSize: '10px', letterSpacing: '2px',
              padding: '6px 14px', cursor: 'pointer',
            }}>
              {uploading ? 'UPLOADING...'
                : screenshot ? 'REPLACE ' : 'UPLOAD '}
              <input type="file" accept="image/*" style={{ display: 'none' }}
                disabled={uploading}
                onChange={handleScreenshotUpload} />
            </label>
          </div>

          {screenshot ? (
            <img src={screenshot} alt="Trade screenshot"
              style={{ width: '100%', maxHeight: '500px',
                objectFit: 'contain', display: 'block' }} />
          ) : (
            <div style={{
              border: '1px dashed #1a1a1a', padding: '60px',
              textAlign: 'center',
            }}>
              <p style={{
                color: '#222', fontSize: '10px', letterSpacing: '2px',
              }}>
                NO SCREENSHOT, ATTACH YOUR CHART SETUP
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}