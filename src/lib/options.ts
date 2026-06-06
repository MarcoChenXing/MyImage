import type { Timeframe, TradeDirection, TradeResultType } from "@/types/trade";

export const directions: TradeDirection[] = ["long", "short"];
export const timeframes: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"];
export const resultTypes: TradeResultType[] = [
  "take_profit",
  "stop_loss",
  "partial_take_profit",
  "early_close_profit",
  "early_close_loss",
  "manual_stop_loss",
  "breakeven",
  "liquidation",
  "other",
];

export const resultTypeLabels: Record<TradeResultType, string> = {
  take_profit: "止盈",
  stop_loss: "止损",
  partial_take_profit: "盈利减仓",
  early_close_profit: "盈利提前平仓",
  early_close_loss: "亏损提前平仓",
  manual_stop_loss: "手动止损",
  breakeven: "保本出场",
  liquidation: "强平/爆仓",
  other: "其他",
};
