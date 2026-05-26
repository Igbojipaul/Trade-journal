'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import {
  pageStyle, inputStyle, selectStyle, labelStyle,
  sectionStyle, sectionTitleStyle, gridStyle,
  submitStyle, submitLoadingStyle,
} from '@/lib/formStyles';

const MARKETS = [
  { value: 'crypto',    label: 'CRYPTO' },
  { value: 'forex',     label: 'FOREX' },
  { value: 'stocks',    label: 'STOCKS' },
  { value: 'synthetic', label: 'SYNTHETIC' },
];

const STRATEGIES = [
  'Breakout', 'ICT SMC', 'Scalping', 'Swing Trade',
  'Mean Reversion', 'News Trade', 'Support/Resistance', 'Other',
];

export default function NewTradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    symbol: '', market: 'forex', direction: 'long',
    entry_price: '', exit_price: '', stop_loss: '',
    take_profit: '', lot_size: '', pnl: '',
    risk_amount: '', strategy: '', notes: '',
    entry_time: '', exit_time: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
    );
    try {
      await api.post('/trades/', payload);
      router.push('/');
    } catch (err: any) {
      setError(JSON.stringify(err.response?.data ?? 'ERR // FAILED'));
    } finally {
      setLoading(false);
    }
  };

  const symbolPlaceholder = form.market === 'crypto' ? 'BTC/USDT'
    : form.market === 'forex' ? 'EUR/USD'
    : form.market === 'synthetic' ? 'Volatility 75 Index'
    : 'AAPL';

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

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
              NEW ENTRY
            </div>
            <h1 style={{
              fontSize: '20px', fontWeight: 700,
              color: '#e8e8e8', letterSpacing: '3px', margin: 0,
            }}>
              LOG TRADE
            </h1>
          </div>
          <Link href="/" style={{
            color: '#333', fontSize: '10px',
            letterSpacing: '2px', textDecoration: 'none',
          }}>
            ← DASHBOARD
          </Link>
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

        <form onSubmit={handleSubmit}>

          {/* Instrument */}
          <div style={sectionStyle}>
            <span style={sectionTitleStyle}>INSTRUMENT</span>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>MARKET</label>
                <select name="market" value={form.market}
                  onChange={handleChange} style={selectStyle}>
                  {MARKETS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>SYMBOL</label>
                <input name="symbol" value={form.symbol}
                  onChange={handleChange} style={inputStyle}
                  placeholder={symbolPlaceholder} required />
              </div>
            </div>
          </div>

          {/* Trade Details */}
          <div style={sectionStyle}>
            <span style={sectionTitleStyle}>TRADE DETAILS</span>
            <div style={{ ...gridStyle, gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
              <div>
                <label style={labelStyle}>DIRECTION</label>
                <select name="direction" value={form.direction}
                  onChange={handleChange} style={selectStyle}>
                  <option value="long">▲ LONG</option>
                  <option value="short">▼ SHORT</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>LOT SIZE</label>
                <input name="lot_size" type="number" step="0.01"
                  value={form.lot_size} onChange={handleChange}
                  style={inputStyle} placeholder="0.10" required />
              </div>
              <div>
                <label style={labelStyle}>ENTRY TIME</label>
                <input name="entry_time" type="datetime-local"
                  value={form.entry_time} onChange={handleChange}
                  style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>EXIT TIME</label>
                <input name="exit_time" type="datetime-local"
                  value={form.exit_time} onChange={handleChange}
                  style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Prices */}
          <div style={sectionStyle}>
            <span style={sectionTitleStyle}>PRICE LEVELS</span>
            <div style={{ ...gridStyle, gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
              {[
                { name: 'entry_price', label: 'ENTRY', required: true },
                { name: 'exit_price',  label: 'EXIT',  required: false },
                { name: 'stop_loss',   label: 'S/L',   required: false },
                { name: 'take_profit', label: 'T/P',   required: false },
              ].map(f => (
                <div key={f.name}>
                  <label style={labelStyle}>{f.label}</label>
                  <input name={f.name} type="number" step="any"
                    value={(form as any)[f.name]}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="0.00000"
                    required={f.required} />
                </div>
              ))}
            </div>
          </div>

          {/* Risk & P&L */}
          <div style={sectionStyle}>
            <span style={sectionTitleStyle}>RISK & P&L</span>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>P&L (USD)</label>
                <input name="pnl" type="number" step="0.01"
                  value={form.pnl} onChange={handleChange}
                  style={inputStyle} placeholder="+120.00 or -45.00" />
              </div>
              <div>
                <label style={labelStyle}>RISK AMOUNT (USD)</label>
                <input name="risk_amount" type="number" step="0.01"
                  value={form.risk_amount} onChange={handleChange}
                  style={inputStyle} placeholder="50.00" />
              </div>
            </div>
            <div style={{
              color: '#222', fontSize: '9px',
              letterSpacing: '1px', marginTop: '10px',
            }}>
              // R:R RATIO AUTO-CALCULATED FROM ENTRY, S/L AND T/P
            </div>
          </div>

          {/* Strategy & Notes */}
          <div style={sectionStyle}>
            <span style={sectionTitleStyle}>STRATEGY & NOTES</span>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>STRATEGY</label>
              <select name="strategy" value={form.strategy}
                onChange={handleChange} style={selectStyle}>
                <option value="">-- SELECT STRATEGY --</option>
                {STRATEGIES.map(s => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>NOTES</label>
              <textarea name="notes" value={form.notes}
                onChange={handleChange} rows={5}
                placeholder="// What was your reasoning? What did you do well? What would you change?"
                style={{
                  ...inputStyle,
                  resize: 'none',
                  lineHeight: '1.6',
                }} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={loading ? submitLoadingStyle : submitStyle}>
            {loading ? 'SAVING...' : 'LOG TRADE //'}
          </button>

        </form>
      </div>
    </main>
  );
}