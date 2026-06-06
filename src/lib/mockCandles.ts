import type { Candle, Timeframe } from "@/types/trade";

const timeframeMinutes: Record<Timeframe, number> = {
  "1m": 1,
  "5m": 5,
  "15m": 15,
  "1h": 60,
  "4h": 240,
  "1d": 1440,
};

export function getMockCandles(
  symbol: string,
  timeframe: Timeframe,
  entryTime: string,
  exitTime: string,
): Candle[] {
  const step = timeframeMinutes[timeframe] * 60 * 1000;
  const entry = new Date(entryTime).getTime();
  const exit = new Date(exitTime).getTime();
  const start = Number.isNaN(entry) ? Date.now() - step * 40 : entry - step * 24;
  const total = Math.max(60, Math.ceil(((Number.isNaN(exit) ? Date.now() : exit) - start) / step) + 24);
  const seed = symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  let lastClose = 100 + (seed % 80);

  return Array.from({ length: total }, (_, index) => {
    const time = new Date(start + index * step).toISOString();
    const wave = Math.sin((index + seed) / 4) * 1.8;
    const drift = (index - total / 2) * 0.05;
    const open = lastClose;
    const close = Math.max(1, open + wave + drift + Math.cos(index / 3));
    const high = Math.max(open, close) + 1.5 + (index % 3) * 0.3;
    const low = Math.min(open, close) - 1.5 - (index % 2) * 0.4;
    lastClose = close;

    return {
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    };
  });
}
