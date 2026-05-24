import Link from 'next/link';
import {format} from 'date-fns/format';
import { Trade } from "@/types/trade";


const JournalTable = ({ trades }: { trades: Trade[] }) => {
  return (
    <table className="w-full text-sm">
            <thead>
              <tr
                className="text-gray-400 text-xs uppercase tracking-wider
                             border-b border-gray-800"
              >
                <th className="text-left p-4">Symbol</th>
                <th className="text-left p-4">Market</th>
                <th className="text-left p-4">Direction</th>
                <th className="text-left p-4">Entry</th>
                <th className="text-left p-4">Exit</th>
                <th className="text-left p-4">P&L</th>
                <th className="text-left p-4">R:R</th>
                <th className="text-left p-4">Strategy</th>
                <th className="text-left p-4">Outcome</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => {
                let outcomeBadgeClass = "bg-gray-500/10 text-gray-400";
                if (trade.outcome === "win") {
                  outcomeBadgeClass = "bg-green-500/10 text-green-400";
                } else if (trade.outcome === "loss") {
                  outcomeBadgeClass = "bg-red-500/10 text-red-400";
                }

                return (
                  <tr
                    key={trade.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/40
                               transition-colors"
                  >
                    <td className="p-4">
                      <Link
                        href={`/trades/${trade.id}`}
                        className="font-semibold text-white hover:text-blue-400 transition-colors"
                      >
                        {trade.symbol}
                      </Link>
                    </td>

                    <td className="p-4 text-gray-300">
                      {trade.market_display}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold
                        ${
                          trade.direction === "long"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {trade.direction_display}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{trade.entry_price}</td>
                    <td className="p-4 text-gray-300">
                      {trade.exit_price ?? "—"}
                    </td>
                    <td className="p-4">
                      {trade.pnl ? (
                        <span
                          className={
                            Number.parseFloat(trade.pnl) >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          ${Number.parseFloat(trade.pnl).toFixed(2)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 text-blue-400">
                      {trade.risk_reward_ratio
                        ? `${trade.risk_reward_ratio}R`
                        : "—"}
                    </td>
                    <td className="p-4 text-gray-300">
                      {trade.strategy || "—"}
                    </td>
                    <td className="p-4">
                      {trade.outcome ? (
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold ${outcomeBadgeClass}`}
                        >
                          {trade.outcome}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 text-gray-400">
                      {format(new Date(trade.entry_time), "MMM d, yyyy")}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/trades/${trade.id}/edit`}
                        className="text-gray-400 hover:text-white text-xs border border-gray-700
               hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
  )
}

export default JournalTable
