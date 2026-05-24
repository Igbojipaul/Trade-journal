'use client';

import { useState, type KeyboardEvent } from 'react';
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
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.csv')) {
      setError('Please upload a CSV file.');
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
      setError(err.response?.data?.error || 'Import failed.');
    } finally {
      setLoading(false);
    }
  };

  const openFileDialog = () => {
    const input = document.getElementById('csv-input') as HTMLInputElement | null;
    input?.click();
  };

  const handleDropZoneKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFileDialog();
    }
  };

  const dropZoneStateClass = dragOver
    ? 'border-blue-500 bg-blue-500/5'
    : file
      ? 'border-green-500 bg-green-500/5'
      : 'border-gray-700 hover:border-gray-500';

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Import Trades</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Import from any broker via CSV
            </p>
          </div>
        </div>

        {/* Supported brokers */}
        <div className="bg-blue-500/10 border border-blue-500/20
                        rounded-xl p-5 mb-6">
          <h2 className="text-blue-400 font-semibold text-sm mb-3">
            Works with any broker
          </h2>
          <div className="flex flex-wrap gap-2">
            {['MT4', 'MT5', 'Deriv', 'Binance', 'cTrader',
              'TradingView', 'Interactive Brokers', 'Any CSV'].map(b => (
              <span key={b}
                className="bg-blue-500/10 text-blue-300 text-xs px-3 py-1
                           rounded-full border border-blue-500/20">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* CSV format guide */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase
                         tracking-wider mb-3">
            Required CSV format
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-2 pr-4">Column</th>
                  <th className="text-left py-2 pr-4">Required</th>
                  <th className="text-left py-2">Example</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[
                  ['symbol',      '✅ Yes', 'EUR/USD'],
                  ['market',      '✅ Yes', 'forex / crypto / stocks / synthetic'],
                  ['direction',   '✅ Yes', 'long / short'],
                  ['entry_price', '✅ Yes', '1.08432'],
                  ['entry_time',  '✅ Yes', '2024-01-15 09:30:00'],
                  ['exit_price',  'Optional', '1.09100'],
                  ['exit_time',   'Optional', '2024-01-15 11:45:00'],
                  ['stop_loss',   'Optional', '1.07800'],
                  ['take_profit', 'Optional', '1.09500'],
                  ['lot_size',    'Optional', '0.10'],
                  ['pnl',         'Optional', '120.50'],
                  ['strategy',    'Optional', 'Breakout'],
                  ['notes',       'Optional', 'Strong momentum...'],
                ].map(([col, req, ex]) => (
                  <tr key={col}
                    className="border-b border-gray-800/50 last:border-0">
                    <td className="py-2 pr-4 font-mono text-blue-400">{col}</td>
                    <td className="py-2 pr-4">{req}</td>
                    <td className="py-2 text-gray-500">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Download template */}
          <button
            onClick={() => {
              const headers = 'symbol,market,direction,entry_price,entry_time,'
                + 'exit_price,exit_time,stop_loss,take_profit,lot_size,'
                + 'pnl,strategy,notes\n';
              const example = 'EUR/USD,forex,long,1.08432,'
                + '2024-01-15 09:30:00,1.09100,2024-01-15 11:45:00,'
                + '1.07800,1.09500,0.10,120.50,Breakout,'
                + 'Strong momentum on London open\n';
              const blob = new Blob([headers + example],
                { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'trade_journal_template.csv';
              a.click();
            }}
            className="mt-4 text-xs text-blue-400 hover:text-blue-300
                       transition-colors flex items-center gap-1"
          >
            ↓ Download CSV template
          </button>
        </div>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          onKeyDown={handleDropZoneKeyDown}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
          className={`border-2 border-dashed rounded-xl p-10 text-center
                      transition-colors cursor-pointer mb-4
            ${dropZoneStateClass}`}
          onClick={openFileDialog}
        >
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          {file ? (
            <div>
              <p className="text-green-400 font-semibold">{file.name}</p>
              <p className="text-gray-500 text-sm mt-1">
                {(file.size / 1024).toFixed(1)} KB · Click to change
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-300 font-medium">
                Drop your CSV here
              </p>
              <p className="text-gray-500 text-sm mt-1">
                or click to browse
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400
                          rounded-lg p-4 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!file || loading}
          className="w-full bg-blue-600 hover:bg-blue-500
                     disabled:bg-blue-600/30 disabled:cursor-not-allowed
                     text-white font-semibold rounded-xl py-4
                     transition-colors mb-6"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Importing...
            </span>
          ) : 'Import Trades'}
        </button>

        {/* Result */}
        {result && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Import Complete</h2>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-green-500/10 border border-green-500/20
                              rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-400">
                  {result.imported}
                </p>
                <p className="text-gray-400 text-xs mt-1">Imported</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20
                              rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">
                  {result.skipped}
                </p>
                <p className="text-gray-400 text-xs mt-1">Skipped</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20
                              rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-400">
                  {result.failed}
                </p>
                <p className="text-gray-400 text-xs mt-1">Failed</p>
              </div>
            </div>

            {/* Skipped details */}
            {result.skipped_details && result.skipped_details.length > 0 && (
              <div className="mb-4">
                <p className="text-yellow-400 text-xs font-semibold uppercase
                               tracking-wider mb-2">
                  Skipped rows
                </p>
                <div className="space-y-1">
                  {result.skipped_details.map((s, i) => (
                    <p key={i} className="text-gray-400 text-xs">
                      Row {s.row}: {s.reason}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {result.imported > 0 ? (
              <button
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white
                           font-semibold rounded-xl py-3 transition-colors"
              >
                View Dashboard →
              </button>
            ) : (
              <p className="text-center text-gray-500 text-sm">
                No trades were imported. Check the skipped details above.
              </p>
            )}
          </div>
        )}

      </div>
    </main>
  );
}