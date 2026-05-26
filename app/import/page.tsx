'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface ImportResult {
  imported: number;
  skipped: number;
  failed: number;
  total: number;
  skipped_details?: { row: number; reason: string }[];
  failed_details?: { row: number; reason: string }[];
}

export default function ImportPage() {
  const router = useRouter();
  const [file, setFile]         = useState<File | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [result, setResult]     = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.csv')) {
      setError('ERR // ONLY CSV FILES ACCEPTED');
      return;
    }
    setFile(f);
    setError('');
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/trades/import_csv/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (err: any) {
      setError('ERR // ' + (
        err.response?.data?.error || 'IMPORT FAILED'
      ).toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh', background: '#0a0a0a', padding: '24px',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '24px', paddingBottom: '24px',
          borderBottom: '1px solid #1e1e1e',
        }}>
          <div>
            <div style={{
              color: '#333', fontSize: '9px',
              letterSpacing: '3px', marginBottom: '4px',
            }}>
              DATA IMPORT
            </div>
            <h1 style={{
              color: '#e8e8e8', fontSize: '18px',
              fontWeight: 700, letterSpacing: '3px', margin: 0,
            }}>
              IMPORT TRADES
            </h1>
          </div>
          <Link href="/" style={{
            color: '#333', fontSize: '10px', letterSpacing: '2px',
            textDecoration: 'none', border: '1px solid #1e1e1e',
            padding: '8px 14px',
          }}>
            ← BACK
          </Link>
        </div>

        {/* Supported brokers */}
        <div style={{
          background: '#0d0d0d', border: '1px solid #1e1e1e',
          padding: '16px', marginBottom: '1px',
        }}>
          <div style={{
            color: '#333', fontSize: '9px',
            letterSpacing: '3px', marginBottom: '12px',
          }}>
            COMPATIBLE BROKERS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
            {['MT4', 'MT5', 'DERIV', 'BINANCE',
              'CTRADER', 'TRADINGVIEW', 'IBKR', 'ANY CSV'].map(b => (
              <span key={b} style={{
                border: '1px solid #1e1e1e', color: '#444',
                fontSize: '9px', letterSpacing: '2px',
                padding: '4px 10px',
              }}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* CSV format */}
        <div style={{
          background: '#0d0d0d', border: '1px solid #1e1e1e',
          marginBottom: '16px',
        }}>
          <div style={{
            padding: '10px 16px', borderBottom: '1px solid #1e1e1e',
            color: '#333', fontSize: '9px', letterSpacing: '3px',
          }}>
            REQUIRED FORMAT
          </div>
          <div style={{ padding: '16px', overflowX: 'auto' as const }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['COLUMN', 'REQUIRED', 'EXAMPLE'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '6px 12px 6px 0',
                      color: '#222', fontSize: '9px', letterSpacing: '2px',
                      borderBottom: '1px solid #1a1a1a',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['symbol',      '✓ YES', 'EUR/USD'],
                  ['market',      '✓ YES', 'forex / crypto / stocks / synthetic'],
                  ['direction',   '✓ YES', 'long / short'],
                  ['entry_price', '✓ YES', '1.08432'],
                  ['entry_time',  '✓ YES', '2024-01-15 09:30:00'],
                  ['exit_price',  'OPT',   '1.09100'],
                  ['exit_time',   'OPT',   '2024-01-15 11:45:00'],
                  ['stop_loss',   'OPT',   '1.07800'],
                  ['take_profit', 'OPT',   '1.09500'],
                  ['pnl',         'OPT',   '120.50'],
                  ['strategy',    'OPT',   'Breakout'],
                  ['notes',       'OPT',   'London session breakout...'],
                ].map(([col, req, ex]) => (
                  <tr key={col}>
                    <td style={{
                      padding: '7px 12px 7px 0',
                      color: '#00aaff', fontSize: '11px',
                      fontFamily: 'Roboto Mono, monospace',
                      borderBottom: '1px solid #111',
                    }}>
                      {col}
                    </td>
                    <td style={{
                      padding: '7px 12px 7px 0',
                      color: req === '✓ YES' ? '#00ff88' : '#333',
                      fontSize: '10px', letterSpacing: '1px',
                      borderBottom: '1px solid #111',
                    }}>
                      {req}
                    </td>
                    <td style={{
                      padding: '7px 0',
                      color: '#333', fontSize: '10px',
                      borderBottom: '1px solid #111',
                    }}>
                      {ex}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={() => {
              const headers = 'symbol,market,direction,entry_price,'
                + 'entry_time,exit_price,exit_time,stop_loss,'
                + 'take_profit,lot_size,pnl,strategy,notes\n';
              const example = 'EUR/USD,forex,long,1.08432,'
                + '2024-01-15 09:30:00,1.09100,2024-01-15 11:45:00,'
                + '1.07800,1.09500,0.10,120.50,Breakout,'
                + 'London open breakout\n';
              const blob = new Blob([headers + example],
                { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'trade_journal_template.csv';
              a.click();
            }} style={{
              marginTop: '16px',
              background: 'none', border: '1px solid #1e1e1e',
              color: '#333', fontSize: '9px', letterSpacing: '2px',
              padding: '7px 14px', cursor: 'pointer',
              fontFamily: 'Roboto Mono, monospace',
            }}>
              ↓ DOWNLOAD TEMPLATE
            </button>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          onClick={() => document.getElementById('csv-input')?.click()}
          style={{
            border: `1px dashed ${dragOver
              ? '#00ff88'
              : file ? '#00ff8855' : '#1e1e1e'}`,
            background: dragOver
              ? 'rgba(0,255,136,0.03)'
              : '#0a0a0a',
            padding: '48px 24px',
            textAlign: 'center' as const,
            cursor: 'pointer',
            marginBottom: '1px',
            transition: 'all 0.1s',
          }}
        >
          <input id="csv-input" type="file" accept=".csv"
            style={{ display: 'none' }}
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }} />

          {file ? (
            <div>
              <div style={{
                color: '#00ff88', fontSize: '12px',
                letterSpacing: '2px', marginBottom: '4px',
              }}>
                {file.name.toUpperCase()}
              </div>
              <div style={{
                color: '#333', fontSize: '9px', letterSpacing: '2px',
              }}>
                {(file.size / 1024).toFixed(1)} KB // CLICK TO CHANGE
              </div>
            </div>
          ) : (
            <div>
              <div style={{
                color: '#222', fontSize: '24px', marginBottom: '8px',
              }}>
                +
              </div>
              <div style={{
                color: '#333', fontSize: '11px', letterSpacing: '3px',
              }}>
                DROP CSV HERE
              </div>
              <div style={{
                color: '#1e1e1e', fontSize: '9px',
                letterSpacing: '2px', marginTop: '4px',
              }}>
                OR CLICK TO BROWSE
              </div>
            </div>
          )}
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,59,59,0.08)',
            border: '1px solid rgba(255,59,59,0.3)',
            color: '#ff3b3b', padding: '12px 16px',
            fontSize: '11px', letterSpacing: '1px',
            marginBottom: '1px',
          }}>
            {error}
          </div>
        )}

        <button onClick={handleImport} disabled={!file || loading}
          style={{
            width: '100%',
            background: !file || loading ? '#0d0d0d' : '#00ff88',
            color: !file || loading ? '#222' : '#000',
            border: `1px solid ${!file || loading ? '#1a1a1a' : '#00ff88'}`,
            padding: '14px',
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '3px',
            cursor: !file || loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Roboto Mono, monospace',
            marginBottom: '16px',
          }}>
          {loading ? 'IMPORTING...' : 'IMPORT TRADES //'}
        </button>

        {/* Result */}
        {result && (
          <div style={{
            background: '#0a0a0a', border: '1px solid #1e1e1e',
          }}>
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid #1e1e1e',
              color: '#333', fontSize: '9px', letterSpacing: '3px',
            }}>
              IMPORT COMPLETE
            </div>
            <div style={{ padding: '20px 16px' }}>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1px', background: '#1e1e1e', marginBottom: '16px',
              }}>
                {[
                  { label: 'IMPORTED', value: result.imported,
                    color: '#00ff88' },
                  { label: 'SKIPPED',  value: result.skipped,
                    color: '#ffcc00' },
                  { label: 'FAILED',   value: result.failed,
                    color: '#ff3b3b' },
                ].map(s => (
                  <div key={s.label} style={{
                    background: '#0a0a0a', padding: '16px',
                    textAlign: 'center' as const,
                  }}>
                    <div style={{
                      color: s.color, fontSize: '28px', fontWeight: 700,
                    }}>
                      {s.value}
                    </div>
                    <div style={{
                      color: '#333', fontSize: '9px',
                      letterSpacing: '2px', marginTop: '4px',
                    }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {result.skipped_details && result.skipped_details.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    color: '#ffcc00', fontSize: '9px',
                    letterSpacing: '2px', marginBottom: '8px',
                  }}>
                    SKIPPED ROWS
                  </div>
                  {result.skipped_details.map((s, i) => (
                    <div key={i} style={{
                      color: '#444', fontSize: '10px',
                      marginBottom: '4px', letterSpacing: '0.5px',
                    }}>
                      ROW {s.row}: {s.reason.toUpperCase()}
                    </div>
                  ))}
                </div>
              )}

              {result.imported > 0 ? (
                <button onClick={() => router.push('/')} style={{
                  width: '100%',
                  background: '#00ff88', color: '#000',
                  border: 'none', padding: '12px',
                  fontSize: '11px', fontWeight: 700,
                  letterSpacing: '3px', cursor: 'pointer',
                  fontFamily: 'Roboto Mono, monospace',
                }}>
                  VIEW DASHBOARD →
                </button>
              ) : (
                <div style={{
                  textAlign: 'center' as const, color: '#222',
                  fontSize: '10px', letterSpacing: '2px',
                }}>
                  NO TRADES IMPORTED // CHECK FORMAT
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}