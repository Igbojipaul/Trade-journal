"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { COLORS, PIE_COLORS } from "@/constants";
import Header from "@/components/Header";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/trades/analytics/")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main
        className="min-h-screen bg-gray-950 text-white p-6 flex items-center
                        justify-center"
      >
        <p className="text-gray-400">Crunching your numbers...</p>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          title={"Analytics"}
          subtitle={"What your trades are actually telling you"}
        />

        <div className="space-y-6">
          {/* Cumulative P&L */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2
              className="text-sm font-semibold text-gray-300 uppercase
                           tracking-wider mb-6"
            >
              Cumulative P&L Over Time
            </h2>
            {data.pnl_over_time.length === 0 ? (
              <p className="text-gray-500 text-sm">Not enough data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.pnl_over_time}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => [`$${value}`, ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke={COLORS.blue}
                    strokeWidth={2}
                    dot={false}
                    name="Cumulative P&L"
                  />
                  <Line
                    type="monotone"
                    dataKey="daily"
                    stroke={COLORS.purple}
                    strokeWidth={2}
                    dot={false}
                    name="Daily P&L"
                    strokeDasharray="4 4"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Outcome + By Market */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Outcome Pie */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2
                className="text-sm font-semibold text-gray-300 uppercase
                             tracking-wider mb-6"
              >
                Outcome Breakdown
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.outcome_breakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.outcome_breakdown.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* By Market */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2
                className="text-sm font-semibold text-gray-300 uppercase
                             tracking-wider mb-6"
              >
                P&L by Market
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.by_market}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="market"
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => [`$${value}`, "P&L"]}
                  />
                  <Bar
                    dataKey="total_pnl"
                    fill={COLORS.blue}
                    radius={[4, 4, 0, 0]}
                    name="Total P&L"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* By Strategy */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2
              className="text-sm font-semibold text-gray-300 uppercase
                           tracking-wider mb-6"
            >
              Performance by Strategy
            </h2>
            {data.by_strategy.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Tag your trades with a strategy to see this chart.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.by_strategy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="strategy"
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="total_pnl"
                    name="Total P&L"
                    radius={[4, 4, 0, 0]}
                  >
                    {data.by_strategy.map((entry: any, i: number) => (
                      <Cell
                        key={i}
                        fill={entry.total_pnl >= 0 ? COLORS.win : COLORS.loss}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
