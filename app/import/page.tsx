"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Header from "@/components/Header";

interface ImportResult {
  imported: number;
  skipped: number;
  failed: number;
  total: number;
  account: string;
  currency: string;
}

export default function ImportPage() {
  const router = useRouter();
  const [apiToken, setApiToken] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState(
    new Date().toISOString().split("T")[0], // Default to today
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.post("/trades/import_deriv/", {
        api_token: apiToken,
        date_from: new Date(dateFrom).toISOString(),
        date_to: new Date(dateTo + "T23:59:59").toISOString(),
      });
      setResult(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.error;
      setError(msg || "Import failed. Please check your API token.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full bg-gray-800 border border-gray-700 rounded-lg
    px-4 py-3 text-white placeholder-gray-500 focus:outline-none
    focus:border-blue-500 transition-colors text-sm`;

  const labelClass = `text-gray-400 text-xs uppercase tracking-wider mb-1 block`;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Header
          title="Import Trades from Deriv"
          subtitle="Auto-import your closed trades from your Deriv account"
        />

        {/* How it works */}
        <div
          className="bg-blue-500/10 border border-blue-500/20 rounded-xl
                        p-5 mb-6"
        >
          <h2 className="text-blue-400 font-semibold text-sm mb-2">
            How to get your API token
          </h2>
          <ol
            className="text-gray-300 text-sm space-y-1 list-decimal
                         list-inside"
          >
            <li>
              Go to{" "}
              <a
                href="https://developers.deriv.com/dashboard/tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                developers.deriv.com/dashboard/tokens/
              </a>
            </li>
            <li>
              Create a new token with <strong>Read</strong> and{" "}
              <strong>Trading information</strong> scopes
            </li>
            <li>Paste it below — we never store your token</li>
          </ol>
        </div>

        {/* Import form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <form onSubmit={handleImport} className="space-y-5">
            <div>
              <label className={labelClass}>Deriv API Token</label>
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Paste your Deriv API token"
                className={inputClass}
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Your token is sent directly to Deriv and never stored on our
                servers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {error && (
              <div
                className="bg-red-500/10 border border-red-500/30
                              text-red-400 rounded-lg p-4 text-sm"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500
                         disabled:bg-blue-600/50 text-white font-semibold
                         rounded-xl py-4 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Connecting to Deriv...
                </span>
              ) : (
                "Import Trades"
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Import Complete</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className="bg-green-500/10 border border-green-500/20
                              rounded-xl p-4 text-center"
              >
                <p className="text-3xl font-bold text-green-400">
                  {result.imported}
                </p>
                <p className="text-gray-400 text-sm mt-1">Imported</p>
              </div>
              <div
                className="bg-gray-800 border border-gray-700
                              rounded-xl p-4 text-center"
              >
                <p className="text-3xl font-bold text-gray-300">
                  {result.skipped}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Skipped (duplicates)
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-sm">
              <div
                className="flex justify-between py-2 border-b
                              border-gray-800"
              >
                <span className="text-gray-400">Account type</span>
                <span
                  className={`font-semibold ${
                    result.account === "Demo"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {result.account}
                </span>
              </div>
              <div
                className="flex justify-between py-2 border-b
                              border-gray-800"
              >
                <span className="text-gray-400">Currency</span>
                <span className="text-white font-semibold">
                  {result.currency}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Total found</span>
                <span className="text-white font-semibold">{result.total}</span>
              </div>
            </div>

            {result.imported > 0 ? (
              <button
                onClick={() => router.push("/")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white
                           font-semibold rounded-xl py-3 transition-colors"
              >
                View Dashboard →
              </button>
            ) : (
              <p className="text-center text-gray-500 text-sm">
                No new trades found in this date range.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
