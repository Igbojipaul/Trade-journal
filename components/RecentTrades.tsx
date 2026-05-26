"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Trade } from "@/types/trade";
import JournalTable from "./JournalTable";
import Link from "next/link";

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

  if (loading)
    return (
      <div
        style={{
          color: "#333",
          fontSize: "11px",
          letterSpacing: "2px",
          padding: "24px 0",
        }}
      >
        FETCHING TRADE HISTORY...
      </div>
    );

  return (
    <div style={{ marginTop: "1px" }}>
      {/* Table header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "140px 100px 80px 100px 100px 100px 80px 120px 100px 1fr 80px",
          padding: "10px 16px",
          background: "#0d0d0d",
          borderBottom: "1px solid #1e1e1e",
          borderTop: "1px solid #1e1e1e",
        }}
      >
        {[
          "SYMBOL",
          "MARKET",
          "DIR",
          "ENTRY",
          "EXIT",
          "P&L",
          "R:R",
          "STRATEGY",
          "OUTCOME",
          "DATE",
          "",
        ].map((h) => (
          <div
            key={h}
            style={{
              color: "#333",
              fontSize: "9px",
              letterSpacing: "2px",
              fontWeight: 600,
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {trades.length === 0 ? (
        <div
          style={{
            padding: "60px 16px",
            textAlign: "center",
            color: "#333",
            fontSize: "11px",
            letterSpacing: "2px",
            borderBottom: "1px solid #1e1e1e",
          }}
        >
          NO TRADES LOGGED // START TRADING
        </div>
      ) : (
        <div className="overflow-x-auto">
          <p className="text-gray-300 text-center text-sm p-3 ">
            Click the symbol to view trade details
          </p>
          <JournalTable trades={trades} />
        </div>
      )}
      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid #1e1e1e",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#333",
            fontSize: "9px",
            letterSpacing: "2px",
          }}
        >
          {trades.length} RECORDS
        </span>
        <Link
          href="/analytics"
          style={{
            color: "#444",
            fontSize: "9px",
            letterSpacing: "2px",
            textDecoration: "none",
          }}
        >
          VIEW ANALYTICS →
        </Link>
      </div>
    </div>
  );
}
