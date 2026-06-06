export type TradeDirection = "long" | "short";

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

export type TradeResultType =
  | "take_profit"
  | "stop_loss"
  | "partial_take_profit"
  | "early_close_profit"
  | "early_close_loss"
  | "manual_stop_loss"
  | "breakeven"
  | "liquidation"
  | "other";

export interface Trade {
  id: string;
  symbol: string;
  direction: TradeDirection;
  timeframe: Timeframe;
  entryTime: string;
  exitTime: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  margin: number;
  fee: number;
  pnl: number;
  resultType: TradeResultType;
  targetTakeProfitPrice: number;
  targetStopLossPrice: number;
  strategyTag: string;
  emotionTag: string;
  reviewNote: string;
  screenshotDataUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeDraft extends Omit<Trade, "id" | "createdAt" | "updatedAt"> {
  id?: string;
}

export interface TradeMetrics {
  holdingDuration: string;
  holdingDurationMinutes: number;
  plannedRisk: number;
  plannedReward: number;
  plannedRR: number | null;
  actualRiskOrReward: number;
  actualRMultiple: number | null;
  roi: number | null;
  netPnl: number;
  validationMessages: string[];
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}
