import type { TradeDraft } from "@/types/trade";

export function mockParseScreenshot(screenshotDataUrl?: string): TradeDraft {
  const now = new Date();
  const entry = new Date(now.getTime() - 90 * 60 * 1000);

  return {
    symbol: "BTCUSDT",
    direction: "long",
    timeframe: "15m",
    entryTime: entry.toISOString().slice(0, 16),
    exitTime: now.toISOString().slice(0, 16),
    entryPrice: 68000,
    exitPrice: 69250,
    quantity: 0.02,
    margin: 500,
    fee: 3.8,
    pnl: 25,
    resultType: "early_close_profit",
    targetTakeProfitPrice: 70400,
    targetStopLossPrice: 67200,
    strategyTag: "趋势回踩",
    emotionTag: "耐心等待",
    reviewNote: "mock OCR 生成的草稿：请核对截图中的交易方向、价格、盈亏和备注。",
    screenshotDataUrl,
  };
}
