"use client";

import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, LineSeries, createSeriesMarkers, LineStyle, type IChartApi, type UTCTimestamp } from "lightweight-charts";
import { getMockCandles } from "@/lib/mockCandles";
import type { Trade } from "@/types/trade";

function toChartTime(value: string): UTCTimestamp {
  return Math.floor(new Date(value).getTime() / 1000) as UTCTimestamp;
}

export function TradeChart({ trade }: { trade: Trade }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const chart: IChartApi = createChart(container, {
      height: 420,
      layout: { background: { color: "#ffffff" }, textColor: "#334155" },
      grid: { vertLines: { color: "#e2e8f0" }, horzLines: { color: "#e2e8f0" } },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });
    const rawCandles = getMockCandles(trade.symbol, trade.timeframe, trade.entryTime, trade.exitTime);
    const priceOffset = trade.entryPrice - (rawCandles[24]?.open ?? rawCandles[0]?.open ?? trade.entryPrice);
    const candles = rawCandles.map((candle) => ({
      time: toChartTime(candle.time),
      open: Number((candle.open + priceOffset).toFixed(2)),
      high: Number((candle.high + priceOffset).toFixed(2)),
      low: Number((candle.low + priceOffset).toFixed(2)),
      close: Number((candle.close + priceOffset).toFixed(2)),
    }));
    candleSeries.setData(candles);

    const entryTime = toChartTime(trade.entryTime);
    const exitTime = toChartTime(trade.exitTime);
    createSeriesMarkers(candleSeries, [
      {
        time: entryTime,
        position: trade.direction === "long" ? "belowBar" : "aboveBar",
        color: "#2563eb",
        shape: trade.direction === "long" ? "arrowUp" : "arrowDown",
        text: trade.direction === "long" ? "开多" : "开空",
      },
      {
        time: exitTime,
        position: trade.direction === "long" ? "aboveBar" : "belowBar",
        color: "#7c3aed",
        shape: trade.direction === "long" ? "arrowDown" : "arrowUp",
        text: "平仓",
      },
    ]);

    const minTime = Math.min(entryTime, exitTime) as UTCTimestamp;
    const maxTime = Math.max(entryTime, exitTime) as UTCTimestamp;
    const tpLine = chart.addSeries(LineSeries, { color: "#16a34a", lineWidth: 2, lineStyle: LineStyle.Dashed, priceLineVisible: false });
    tpLine.setData([{ time: minTime, value: trade.targetTakeProfitPrice }, { time: maxTime, value: trade.targetTakeProfitPrice }]);
    const slLine = chart.addSeries(LineSeries, { color: "#dc2626", lineWidth: 2, lineStyle: LineStyle.Dashed, priceLineVisible: false });
    slLine.setData([{ time: minTime, value: trade.targetStopLossPrice }, { time: maxTime, value: trade.targetStopLossPrice }]);
    const holdLine = chart.addSeries(LineSeries, { color: "#2563eb", lineWidth: 1, priceLineVisible: false });
    holdLine.setData([{ time: entryTime, value: trade.entryPrice }, { time: exitTime, value: trade.exitPrice }]);

    chart.timeScale().fitContent();
    const resizeObserver = new ResizeObserver(() => chart.applyOptions({ width: container.clientWidth }));
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [trade]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">Mock K线复盘视图</span>
        <span className="text-emerald-600">绿色虚线：目标止盈</span>
        <span className="text-rose-600">红色虚线：目标止损</span>
        <span className="text-blue-600">蓝线：持仓区间</span>
      </div>
      <div ref={containerRef} className="h-[420px] w-full" />
    </div>
  );
}
