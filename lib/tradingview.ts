
export function toTradingViewSymbol(
  symbol: string,
  market: string
): string {
  const clean = symbol
    .replace('/', '')
    .replace(/\s+/g, '')
    .toUpperCase();

  switch (market) {
    case 'forex':
      return `FX:${clean}`;

    case 'crypto':
      return `BINANCE:${clean}`;

    case 'stocks':
      return `NASDAQ:${clean}`;

    case 'synthetic': {
      const syntheticMap: Record<string, string> = {
        'VOLATILITY75INDEX':  'VOLATILITY_75_INDEX',
        'VOLATILITY751SINDEX':'VOLATILITY_75_1S_INDEX',
        'VOLATILITY25INDEX':  'VOLATILITY_25_INDEX',
        'VOLATILITY251SINDEX':'VOLATILITY_25_1S_INDEX',
        'VOLATILITY2501SINDEX':'VOLATILITY_250_1S_INDEX',
        'VOLATILITY10':       'VOLATILITY_10_INDEX',
        'VOLATILITY101SINDEX':'VOLATILITY_10_INDEX_1S_INDEX',
        'VOLATILITY100':       'VOLATILITY_100_INDEX',
        'VOLATILITY1001SINDEX':       'VOLATILITY_100_1S_INDEX',
        'VOLATILITY50INDEX':  'VOLATILITY_50_INDEX',
        'VOLATILITY501SINDEX':  'VOLATILITY_50_1S_INDEX',
        'BOOM150INDEX':      'BOOM_150_INDEX',
        'BOOM300INDEX':      'BOOM_300_INDEX',
        'BOOM500INDEX':      'BOOM_500_INDEX',
        'BOOM600INDEX':      'BOOM_600_INDEX',
        'BOOM900INDEX':      'BOOM_900_INDEX',
        'CRASH150INDEX':      'CRASH_150_INDEX',
        'CRASH300INDEX':      'CRASH_300_INDEX',
        'CRASH500INDEX':      'CRASH_500_INDEX',
        'CRASH600INDEX':      'CRASH_600_INDEX',
        'CRASH900INDEX':      'CRASH_900_INDEX',
        'STEPINDEX':          'STEP_INDEX',
        'STEPINDEX200':          'STEP_INDEX_200',
        'STEPINDEX300':          'STEP_INDEX_300',
        'STEPINDEX400':          'STEP_INDEX_400',
        'STEPINDEX500':          'STEP_INDEX_500',
      };

      // progressively cleaned versions
      const attempts = [
        clean,
        clean.replace('INDEX', ''),
        clean.replace('VOLATILITY', 'VOL').replace('INDEX', ''),
      ];

      for (const attempt of attempts) {
        if (syntheticMap[attempt]) return syntheticMap[attempt];
      }

      // Fallback — let TradingView try
      return clean;
    }

    default:
      return clean;
  }
}

// time interval
export function toTradingViewInterval(
  durationMinutes: number | null
): string {
  if (!durationMinutes) return '60';       // Default 1hr
  if (durationMinutes <= 15)  return '1';  // Scalp → 1min chart
  if (durationMinutes <= 60)  return '5';  // Short → 5min chart
  if (durationMinutes <= 480) return '15'; // Intraday → 15min chart
  if (durationMinutes <= 1440) return '60'; // Swing → 1hr chart
  return 'D';                               // Multi-day → Daily chart
}