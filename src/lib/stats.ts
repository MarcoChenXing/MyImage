import { calculateTradeMetrics } from "./calculation";
import type { Trade } from "@/types/trade";

export function calculateStats(trades: Trade[]) {
  const metrics = trades.map((trade) => ({ trade, metrics: calculateTradeMetrics(trade) }));
  const wins = trades.filter((trade) => trade.pnl > 0).length;
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const netPnl = metrics.reduce((sum, item) => sum + item.metrics.netPnl, 0);
  const avg = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);
  const symbolCounts = trades.reduce<Record<string, number>>((acc, trade) => {
    acc[trade.symbol] = (acc[trade.symbol] ?? 0) + 1;
    return acc;
  }, {});
  const losingResultCounts = trades.filter((trade) => trade.pnl < 0).reduce<Record<string, number>>((acc, trade) => {
    acc[trade.resultType] = (acc[trade.resultType] ?? 0) + 1;
    return acc;
  }, {});
  const timeframePerformance = trades.reduce<Record<string, { count: number; pnl: number }>>((acc, trade) => {
    acc[trade.timeframe] = acc[trade.timeframe] ?? { count: 0, pnl: 0 };
    acc[trade.timeframe].count += 1;
    acc[trade.timeframe].pnl += trade.pnl;
    return acc;
  }, {});

  return {
    totalTrades: trades.length,
    totalPnl,
    netPnl,
    winRate: trades.length ? wins / trades.length : 0,
    averageRoi: avg(metrics.map((item) => item.metrics.roi).filter((value): value is number => value !== null)),
    averagePlannedRR: avg(metrics.map((item) => item.metrics.plannedRR).filter((value): value is number => value !== null)),
    averageActualR: avg(metrics.map((item) => item.metrics.actualRMultiple).filter((value): value is number => value !== null)),
    maxWin: trades.reduce<Trade | null>((best, trade) => (!best || trade.pnl > best.pnl ? trade : best), null),
    maxLoss: trades.reduce<Trade | null>((worst, trade) => (!worst || trade.pnl < worst.pnl ? trade : worst), null),
    mostTradedSymbol: Object.entries(symbolCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "--",
    mostLosingResultType: Object.entries(losingResultCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "--",
    timeframePerformance,
  };
}
