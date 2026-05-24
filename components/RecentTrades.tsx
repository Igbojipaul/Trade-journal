"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Trade } from "@/types/trade";
import JournalTable from "./JournalTable";

export default function RecentTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/trades/?ordering=-entry_time")
      .then((res) => setTrades(res.data.results ?? res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading trades...</div>;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl">
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Recent Trades</h2>
        <span className="text-gray-400 text-sm">{trades.length} total</span>
      </div>

      {trades.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          <p className="text-lg mb-1">No trades logged yet.</p>
          <p className="text-sm">
            Your journal is empty — go make some money first 😄
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <p className="text-gray-300 text-center text-sm p-3 ">Click the symbol to view trade details</p>
          <JournalTable trades={trades} />
        </div>
      )}
    </div>
  );
}
