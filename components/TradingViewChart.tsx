"use client";

import { useEffect, useRef, memo } from "react";
import { toTradingViewSymbol, toTradingViewInterval } from "@/lib/tradingview";

interface Props {
  symbol: string;
  market: string;
  durationMinutes: number | null;
  entryTime?: string | null;
}

function TradingViewChart({
  symbol,
  market,
  durationMinutes,
  entryTime,
}: Readonly<Props>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tvSymbol = toTradingViewSymbol(symbol, market);
  const interval = toTradingViewInterval(durationMinutes);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous widget
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1", // Candlestick
      locale: "en",
      toolbar_bg: "#0f172a",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
      container_id: "tradingview_chart",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [tvSymbol, interval]);

  return (
    <div className="bg-gray-900 border mb-5 border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4
                      border-b border-gray-800"
      >
        <div>
          <h2
            className="text-sm font-semibold text-gray-300 uppercase
                         tracking-wider"
          >
            Live Chart
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">
            {tvSymbol} · {interval === "D" ? "1D" : `${interval}m`} chart
          </p>
        </div>
        <a
          href={`https://www.tradingview.com/chart/?symbol=${tvSymbol}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300
                     transition-colors"
        >
          Open in TradingView →
        </a>
      </div>

      {/* Chart container */}
      <div
        id="tradingview_chart"
        ref={containerRef}
        style={{ height: "460px" }}
        className="w-full"
      />

      {/* Attribution — TradingView requires this */}
      <div className="px-5 py-2 border-t border-gray-800">
        <p className="text-gray-600 text-xs">
          Chart data provided by{" "}
          <a
            href="https://www.tradingview.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-400 transition-colors"
          >
            TradingView
          </a>
        </p>
      </div>
    </div>
  );
}

export default memo(TradingViewChart);
