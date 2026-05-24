export type Market = 'crypto' | 'forex' | 'stocks' | 'synthetic';
export type Direction = 'long' | 'short';
export type Outcome = 'win' | 'loss' | 'breakeven';

export interface Trade {
  id: number;
  symbol: string;
  market: Market;
  market_display: string;
  direction: Direction;
  direction_display: string;
  entry_price: string;
  exit_price: string | null;
  stop_loss: string | null;
  take_profit: string | null;
  lot_size: string;
  pnl: string | null;
  outcome: Outcome | null;
  risk_reward_ratio: string | null;
  risk_amount: string | null;
  strategy: string;
  notes: string;
  screenshot: string | null;
  screenshot_url: string | null;
  entry_time: string;
  exit_time: string | null;
  duration_minutes: number | null;
  created_at: string;
}

export interface TradeSummary {
  total_trades: number;
  wins: number;
  losses: number;
  breakevens: number;
  win_rate: number;
  total_pnl: number;
  avg_risk_reward: number;
}