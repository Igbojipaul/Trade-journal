'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import api from '@/lib/api';
import { Trade } from '@/types/trade';
import TradingViewChart from '@/components/TradingViewChart';

const StatCard = ({
  label, value, color = 'text-white'
}: {
  label: string; value: string | number | null; color?: string
}) => (
  <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-xl font-bold ${color}`}>{value ?? '—'}</p>
  </div>
);

const outcomeColor = (outcome: string | null) => {
  if (outcome === 'win') return 'text-green-400';
  if (outcome === 'loss') return 'text-red-400';
  if (outcome === 'breakeven') return 'text-gray-400';
  return 'text-gray-400';
};

const outcomeBadge = (outcome: string | null) => {
  if (outcome === 'win') return 'bg-green-500/10 text-green-400 border-green-500/30';
  if (outcome === 'loss') return 'bg-red-500/10 text-red-400 border-red-500/30';
  return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
};

export default function TradeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [uploading, setUploading] = useState(false);
  
  
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [screenshot, setScreenshot] = useState<string | null>(
    trade?.screenshot_url ?? null
  );
  
  useEffect(() => {
    api.get(`/trades/${id}/`)
      .then(res => setTrade(res.data))
      .catch(() => setError('Could not load trade.'))
      .finally(() => setLoading(false));
  }, [id]);

  console.log('Loaded screenshot:', screenshot);

  const handleScreenshotUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  const formData = new FormData();
  formData.append('screenshot', file);

  try {
    const res = await api.post(
      `/trades/${id}/upload_screenshot/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    setScreenshot(res.data.screenshot);
  } catch (err) {
    console.error('Upload failed', err);
  } finally {
    setUploading(false);
  }
};

  if (loading) return (
    <main className="min-h-screen bg-gray-950 text-white p-6 flex items-center
                     justify-center">
      <p className="text-gray-400">Loading trade...</p>
    </main>
  );

  if (error || !trade) return (
    <main className="min-h-screen bg-gray-950 text-white p-6 flex items-center
                     justify-center">
      <div className="text-center">
        <p className="text-red-400 mb-4">{error || 'Trade not found.'}</p>
        <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );

  const pnlValue = trade.pnl ? Number.parseFloat(trade.pnl) : null;
  const rrValue = trade.risk_reward_ratio
    ? Number.parseFloat(trade.risk_reward_ratio) : null;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition-colors text-sm">
              ←
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold">{trade.symbol}</h1>

                {/* Outcome badge */}
                {trade.outcome && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                   border uppercase tracking-wider
                                   ${outcomeBadge(trade.outcome)}`}>
                    {trade.outcome}
                  </span>
                )}

                {/* Direction badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                 border uppercase tracking-wider
                  ${trade.direction === 'long'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                  }`}>
                  {trade.direction_display}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {trade.market_display}
                {trade.strategy && (
                  <span className="ml-2 text-gray-500">· {trade.strategy}</span>
                )}
              </p>
            </div>
          </div>

          <Link href={`/trades/${trade.id}/edit`}
            className="border border-gray-700 hover:border-gray-500 text-gray-300
                       hover:text-white text-sm font-medium px-4 py-2 rounded-lg
                       transition-colors">
            Edit Trade
          </Link>
        </div>

        {/* TradingView Chart */}
          <div className="md:col-span-2">
            <TradingViewChart
              symbol={trade.symbol}
              market={trade.market}
              durationMinutes={trade.duration_minutes}
              entryTime={trade.entry_time}
            />
          </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="P&L"
            value={pnlValue !== null ? `$${pnlValue.toFixed(2)}` : null}
            color={pnlValue !== null
              ? pnlValue >= 0 ? 'text-green-400' : 'text-red-400'
              : 'text-gray-400'}
          />
          <StatCard
            label="Risk : Reward"
            value={rrValue !== null ? `${rrValue}R` : null}
            color="text-blue-400"
          />
          <StatCard
            label="Risk Amount"
            value={trade.risk_amount ? `$${Number.parseFloat(trade.risk_amount).toFixed(2)}` : null}
            color="text-orange-400"
          />
          <StatCard
            label="Duration"
            value={trade.duration_minutes !== null
              ? trade.duration_minutes >= 60
                ? `${(trade.duration_minutes / 60).toFixed(1)}h`
                : `${trade.duration_minutes}m`
              : null}
            color="text-purple-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Price Breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-300 uppercase
                           tracking-wider mb-4">
              Price Breakdown
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Entry Price', value: trade.entry_price, color: 'text-white' },
                { label: 'Exit Price', value: trade.exit_price, color: 'text-white' },
                { label: 'Stop Loss', value: trade.stop_loss, color: 'text-red-400' },
                { label: 'Take Profit', value: trade.take_profit, color: 'text-green-400' },
                { label: 'Lot Size', value: trade.lot_size, color: 'text-gray-300' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between
                                            py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-400 text-sm">{label}</span>
                  <span className={`font-mono text-sm font-semibold ${color}`}>
                    {value ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-300 uppercase
                           tracking-wider mb-4">
              Timing
            </h2>
            <div className="space-y-3">
              {[
                {
                  label: 'Entry',
                  value: trade.entry_time
                    ? format(parseISO(trade.entry_time), 'MMM d, yyyy · HH:mm')
                    : null
                },
                {
                  label: 'Exit',
                  value: trade.exit_time
                    ? format(parseISO(trade.exit_time), 'MMM d, yyyy · HH:mm')
                    : null
                },
                {
                  label: 'Duration',
                  value: trade.duration_minutes !== null
                    ? trade.duration_minutes >= 60
                      ? `${(trade.duration_minutes / 60).toFixed(1)} hours`
                      : `${trade.duration_minutes} minutes`
                    : null
                },
                {
                  label: 'Logged',
                  value: trade.created_at
                    ? format(parseISO(trade.created_at), 'MMM d, yyyy · HH:mm')
                    : null
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between
                                            py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-400 text-sm">{label}</span>
                  <span className="text-white text-sm">{value ?? '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase
                         tracking-wider mb-4">
            Notes & Reasoning
          </h2>
          {trade.notes ? (
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {trade.notes}
            </p>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm mb-3">No notes for this trade.</p>
              <Link href={`/trades/${trade.id}/edit`}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                Add notes →
              </Link>
            </div>
          )}
        </div>

        {/* Screenshot */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase
                           tracking-wider">
              Chart Screenshot
            </h2>
            <label className={`cursor-pointer text-xs font-medium px-4 py-2
                               rounded-lg transition-colors
                               ${uploading
                                 ? 'bg-gray-700 text-gray-400'
                                 : 'border border-gray-700 hover:border-gray-500'
                                   + ' text-gray-300 hover:text-white'
                               }`}>
              {uploading ? 'Uploading...' : screenshot
                ? 'Replace screenshot'
                : 'Upload screenshot'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={handleScreenshotUpload}
              />
            </label>
          </div>

          {trade.screenshot ? (
            <div className="rounded-lg overflow-hidden border
                            border-gray-800">
              <img
                src={trade.screenshot}
                alt="Trade chart screenshot"
                className="w-full object-contain max-h-96"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-700
                            rounded-lg p-10 text-center">
              <p className="text-gray-500 text-sm">
                No screenshot attached yet
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Upload your chart screenshot to remember the setup
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}