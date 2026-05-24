"use client"

import { labelClass, inputClass, STRATEGIES, MARKETS, DIRECTIONS } from '@/constants'
import React from 'react'

type TradeFormState = {
  symbol: string
  market: string
  direction: string
  entry_price: string
  exit_price: string
  stop_loss: string
  take_profit: string
  lot_size: string
  pnl: string
  risk_amount: string
  strategy: string
  notes: string
  entry_time: string
  exit_time: string
}

type FormProps = {
  handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void
  loading: boolean
  form: TradeFormState
  saving?: boolean
}

const Form = ({ handleSubmit, handleChange, loading, form, saving }: FormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
              {/* Market & Symbol */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                  Instrument
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="market" className={labelClass} >
                      Market
                    </label>
                    <select
                      id="market"
                      name="market"
                      value={form.market}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {MARKETS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="symbol" className={labelClass}>
                      Symbol
                    </label>
                    <input
                      id="symbol"
                      name="symbol"
                      value={form.symbol}
                      onChange={handleChange}
                      placeholder={
                        form.market === "crypto"
                          ? "BTC/USDT"
                          : form.market === "forex"
                            ? "EUR/USD"
                            : form.market === "synthetic"
                              ? "Volatility 75 Index"
                              : "AAPL"
                      }
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>
    
              {/* Direction & Timing */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                  Trade Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="direction" className={labelClass}>
                      Direction
                    </label>
                    <select
                      id="direction"
                      name="direction"
                      value={form.direction}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {DIRECTIONS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="lot_size" className={labelClass}>
                      Lot Size
                    </label>
                    <input
                      id="lot_size"
                      name="lot_size"
                      type="number"
                      step="0.01"
                      value={form.lot_size}
                      onChange={handleChange}
                      placeholder="0.10"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="entry_time" className={labelClass}>
                      Entry Time
                    </label>
                    <input
                      id="entry_time"
                      name="entry_time"
                      type="datetime-local"
                      value={form.entry_time}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="exit_time" className={labelClass}>
                      Exit Time
                    </label>
                    <input
                      id="exit_time"
                      name="exit_time"
                      type="datetime-local"
                      value={form.exit_time}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
    
              {/* Prices */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                  Prices
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="entry_price" className={labelClass}>
                      Entry Price
                    </label>
                    <input
                      id="entry_price"
                      name="entry_price"
                      type="number"
                      step="any"
                      value={form.entry_price}
                      onChange={handleChange}
                      placeholder="1.08432"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="exit_price" className={labelClass}>
                      Exit Price
                    </label>
                    <input
                      id="exit_price"
                      name="exit_price"
                      type="number"
                      step="any"
                      value={form.exit_price}
                      onChange={handleChange}
                      placeholder="1.09100"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="stop_loss" className={labelClass}>
                      Stop Loss
                    </label>
                    <input
                      id="stop_loss"
                      name="stop_loss"
                      type="number"
                      step="any"
                      value={form.stop_loss}
                      onChange={handleChange}
                      placeholder="1.07800"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="take_profit" className={labelClass}>
                      Take Profit
                    </label>
                    <input
                      id="take_profit"
                      name="take_profit"
                      type="number"
                      step="any"
                      value={form.take_profit}
                      onChange={handleChange}
                      placeholder="1.09500"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
    
              {/* Risk & P&L */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                  Risk & P&L
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pnl" className={labelClass}>
                      P&L (USD)
                    </label>
                    <input
                      id="pnl"
                      name="pnl"
                      type="number"
                      step="0.01"
                      value={form.pnl}
                      onChange={handleChange}
                      placeholder="+120.00 or -45.00"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="risk_amount" className={labelClass}>
                      Risk Amount (USD)
                    </label>
                    <input
                      id="risk_amount"
                      name="risk_amount"
                      type="number"
                      step="0.01"
                      value={form.risk_amount}
                      onChange={handleChange}
                      placeholder="50.00"
                      className={inputClass}
                    />
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  💡 R:R ratio is auto-calculated from your entry, stop loss and
                  take profit.
                </p>
              </div>
    
              {/* Strategy & Notes */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                  Strategy & Notes
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="strategy" className={labelClass}>
                      Strategy
                    </label>
                    <select
                      id="strategy"
                      name="strategy"
                      value={form.strategy}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select a strategy</option>
                      {STRATEGIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="notes" className={labelClass}>
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={4}
                      placeholder="What was your reasoning? What did you do well? What would you change?"
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>
    
              {/* Submit */}
              <button
                type="submit"
                disabled={saving || loading}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-600/50
                           text-white font-semibold rounded-xl py-4 transition-colors"
              >
                {loading ? "Saving trade..." : "Log Trade"}
              </button>
            </form>
  )
}

export default Form
