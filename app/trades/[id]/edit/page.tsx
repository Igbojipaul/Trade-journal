'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import {
  pageStyle, inputStyle, selectStyle, labelStyle,
  sectionStyle, sectionTitleStyle, gridStyle,
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

const toDatetimeLocal = (iso: string | null) =>
  iso ? iso.slice(0, 16) : '';

export default function EditTradePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    api.get(`/trades/${id}/`).then(res => {
      const t = res.data;
      setForm({
        symbol: t.symbol ?? '',
        market: t.market ?? 'forex',
        direction: t.direction ?? 'long',
        entry_price: t.entry_price ?? '',
        exit_price: t.exit_price ?? '',
        stop_loss: t.stop_loss ?? '',
        take_profit: t.take_profit ?? '',
        lot_size: t.lot_size ?? '',
        pnl: t.pnl ?? '',
        risk_amount: t.risk_amount ?? '',
        strategy: t.strategy ?? '',
        notes: t.notes ?? '',
        entry_time: toDatetimeLocal(t.entry_time),
        exit_time: toDatetimeLocal(t.exit_time),
      });
    })
    .catch(() => setError('ERR  COULD NOT LOAD TRADE'))
    .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
    );
    try {
      await api.put(`/trades/${id}/`, payload);
      router.push(`/trades/${id}`);
    } catch (err: any) {
      setError(JSON.stringify(err.response?.data ?? 'ERR  SAVE FAILED'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('DELETE THIS TRADE? THIS CANNOT BE UNDONE.')) return;
    setDeleting(true);
    try {
      await api.delete(`/trades/${id}/`);
      router.push('/');
    } catch {
      setError('ERR  DELETE FAILED');
      setDeleting(false);
    }
  };

  if (loading) return (
    <main style={{ ...pageStyle, display: 'flex',
      alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#333', fontSize: '11px', letterSpacing: '3px' }}>
        LOADING...
      </span>
    </main>
  );

  if (!form) return null;

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
              MODIFY ENTRY
            </div>
            <h1 style={{
              fontSize: '20px', fontWeight: 700,
              color: '#e8e8e8', letterSpacing: '3px', margin: 0,
            }}>
              EDIT TRADE
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href={`/trades/${id}`} style={{
              color: '#333', fontSize: '10px',
              letterSpacing: '2px', textDecoration: 'none',
            }}>
              ← BACK
            </Link>
            <button onClick={handleDelete} disabled={deleting} style={{
              background: 'rgba(255,59,59,0.08)',
              border: '1px solid rgba(255,59,59,0.2)',
              color: '#ff3b3b', fontSize: '10px',
              letterSpacing: '2px', padding: '8px 16px',
              cursor: 'pointer', fontFamily: 'Roboto Mono, monospace',
            }}>
              {deleting ? 'DELETING...' : 'DELETE '}
            </button>
          </div>
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

        <form onSubmit={handleSave}>

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
                  onChange={handleChange} style={inputStyle} required />
              </div>
            </div>
          </div>

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
                  style={inputStyle} required />
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

          <div style={sectionStyle}>
            <span style={sectionTitleStyle}>PRICE LEVELS</span>
            <div style={{ ...gridStyle, gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
              {[
                { name: 'entry_price', label: 'ENTRY',  required: true },
                { name: 'exit_price',  label: 'EXIT',   required: false },
                { name: 'stop_loss',   label: 'S/L',    required: false },
                { name: 'take_profit', label: 'T/P',    required: false },
              ].map(f => (
                <div key={f.name}>
                  <label style={labelStyle}>{f.label}</label>
                  <input name={f.name} type="number" step="any"
                    value={form[f.name]} onChange={handleChange}
                    style={inputStyle} required={f.required} />
                </div>
              ))}
            </div>
          </div>

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
          </div>

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
                style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} />
            </div>
          </div>

          <button type="submit" disabled={saving} style={{
            width: '100%', background: saving ? '#111' : '#00ff88',
            color: saving ? '#333' : '#000', border: 'none',
            padding: '14px', fontSize: '11px', fontWeight: 700,
            letterSpacing: '3px', cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'Roboto Mono, monospace', marginTop: '1px',
          }}>
            {saving ? 'SAVING...' : 'SAVE CHANGES '}
          </button>

        </form>
      </div>
    </main>
  );
}