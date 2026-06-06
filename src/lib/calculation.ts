import type { Trade, TradeDirection, TradeMetrics } from "@/types/trade";

const MINUTE = 60 * 1000;

export function calculateHoldingDuration(entryTime: string, exitTime: string) {
  const entry = new Date(entryTime).getTime();
  const exit = new Date(exitTime).getTime();

  if (Number.isNaN(entry) || Number.isNaN(exit) || exit < entry) {
    return { label: "时间无效", minutes: 0 };
  }

  const totalMinutes = Math.round((exit - entry) / MINUTE);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts = [
    days > 0 ? `${days}天` : "",
    hours > 0 ? `${hours}小时` : "",
    minutes > 0 || totalMinutes === 0 ? `${minutes}分钟` : "",
  ].filter(Boolean);

  return { label: parts.join(" "), minutes: totalMinutes };
}

export function calculatePlannedRisk(
  direction: TradeDirection,
  entryPrice: number,
  targetStopLossPrice: number,
) {
  // 做多风险是开仓价到止损价的下行空间；做空风险是止损价到开仓价的上行空间。
  return direction === "long"
    ? entryPrice - targetStopLossPrice
    : targetStopLossPrice - entryPrice;
}

export function calculatePlannedReward(
  direction: TradeDirection,
  entryPrice: number,
  targetTakeProfitPrice: number,
) {
  // 做多收益是目标止盈价高于开仓价的空间；做空收益是开仓价高于目标止盈价的空间。
  return direction === "long"
    ? targetTakeProfitPrice - entryPrice
    : entryPrice - targetTakeProfitPrice;
}

export function calculateActualPriceMove(
  direction: TradeDirection,
  entryPrice: number,
  exitPrice: number,
) {
  // 实际R倍数只基于真实出场价相对开仓价的有利/不利移动，不受结果类型文案影响。
  return direction === "long" ? exitPrice - entryPrice : entryPrice - exitPrice;
}

export function calculateTradeMetrics(trade: Pick<Trade,
  | "direction"
  | "entryTime"
  | "exitTime"
  | "entryPrice"
  | "exitPrice"
  | "targetTakeProfitPrice"
  | "targetStopLossPrice"
  | "margin"
  | "fee"
  | "pnl"
>): TradeMetrics {
  const duration = calculateHoldingDuration(trade.entryTime, trade.exitTime);
  const plannedRisk = calculatePlannedRisk(
    trade.direction,
    trade.entryPrice,
    trade.targetStopLossPrice,
  );
  const plannedReward = calculatePlannedReward(
    trade.direction,
    trade.entryPrice,
    trade.targetTakeProfitPrice,
  );
  const actualRiskOrReward = calculateActualPriceMove(
    trade.direction,
    trade.entryPrice,
    trade.exitPrice,
  );

  const validationMessages: string[] = [];
  if (plannedRisk <= 0) {
    validationMessages.push("目标止损价填写不合理：计划亏损空间必须大于 0。");
  }
  if (plannedReward <= 0) {
    validationMessages.push("目标止盈价填写不合理：计划盈利空间必须大于 0。");
  }
  if (trade.margin <= 0) {
    validationMessages.push("保证金必须大于 0，才能计算 ROI。");
  }

  return {
    holdingDuration: duration.label,
    holdingDurationMinutes: duration.minutes,
    plannedRisk,
    plannedReward,
    plannedRR: plannedRisk > 0 && plannedReward > 0 ? plannedReward / plannedRisk : null,
    actualRiskOrReward,
    actualRMultiple: plannedRisk > 0 ? actualRiskOrReward / plannedRisk : null,
    roi: trade.margin > 0 ? trade.pnl / trade.margin : null,
    netPnl: trade.pnl - trade.fee,
    validationMessages,
  };
}

export function formatPercent(value: number | null) {
  if (value === null || Number.isNaN(value)) return "--";
  return `${(value * 100).toFixed(2)}%`;
}

export function formatNumber(value: number | null, digits = 2) {
  if (value === null || Number.isNaN(value)) return "--";
  return value.toFixed(digits);
}
