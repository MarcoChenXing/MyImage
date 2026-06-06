import { describe, expect, it } from "vitest";
import { calculateTradeMetrics } from "./calculation";

const baseTrade = {
  entryTime: "2026-06-01T10:00",
  exitTime: "2026-06-01T11:30",
  quantity: 1,
  margin: 1000,
  fee: 4,
  pnl: 0,
};

describe("calculateTradeMetrics", () => {
  it("calculates profitable long trade", () => {
    const metrics = calculateTradeMetrics({
      ...baseTrade,
      direction: "long",
      entryPrice: 100,
      exitPrice: 120,
      targetTakeProfitPrice: 130,
      targetStopLossPrice: 90,
      pnl: 200,
    });

    expect(metrics.plannedRisk).toBe(10);
    expect(metrics.plannedReward).toBe(30);
    expect(metrics.plannedRR).toBe(3);
    expect(metrics.actualRMultiple).toBe(2);
    expect(metrics.roi).toBe(0.2);
  });

  it("calculates losing long trade", () => {
    const metrics = calculateTradeMetrics({
      ...baseTrade,
      direction: "long",
      entryPrice: 100,
      exitPrice: 90,
      targetTakeProfitPrice: 130,
      targetStopLossPrice: 90,
      pnl: -100,
    });

    expect(metrics.plannedRisk).toBe(10);
    expect(metrics.actualRiskOrReward).toBe(-10);
    expect(metrics.actualRMultiple).toBe(-1);
  });

  it("calculates profitable short trade", () => {
    const metrics = calculateTradeMetrics({
      ...baseTrade,
      direction: "short",
      entryPrice: 100,
      exitPrice: 80,
      targetTakeProfitPrice: 70,
      targetStopLossPrice: 110,
      pnl: 200,
    });

    expect(metrics.plannedRisk).toBe(10);
    expect(metrics.plannedReward).toBe(30);
    expect(metrics.plannedRR).toBe(3);
    expect(metrics.actualRMultiple).toBe(2);
  });

  it("calculates losing short trade", () => {
    const metrics = calculateTradeMetrics({
      ...baseTrade,
      direction: "short",
      entryPrice: 100,
      exitPrice: 110,
      targetTakeProfitPrice: 70,
      targetStopLossPrice: 110,
      pnl: -100,
    });

    expect(metrics.plannedRisk).toBe(10);
    expect(metrics.actualRiskOrReward).toBe(-10);
    expect(metrics.actualRMultiple).toBe(-1);
  });
});
