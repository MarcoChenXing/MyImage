"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatNumber, formatPercent } from "@/lib/calculation";
import { resultTypeLabels } from "@/lib/options";
import { calculateStats } from "@/lib/stats";
import { getTrades } from "@/lib/storage";
import type { Trade } from "@/types/trade";

export default function HomePage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  useEffect(() => setTrades(getTrades()), []);
  const stats = calculateStats(trades);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-sm">
        <p className="text-sm text-blue-200">Local MVP</p>
        <h1 className="mt-2 text-3xl font-bold">每日交易复盘统计面板</h1>
        <p className="mt-3 max-w-2xl text-slate-300">导入截图、确认交易字段，自动计算计划RR、实际R倍数、ROI 和净收益。</p>
        <Link className="mt-6 inline-flex rounded-xl bg-blue-500 px-5 py-3 font-semibold hover:bg-blue-400" href="/trades/new">上传第一张交易截图</Link>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Stat label="总交易次数" value={String(stats.totalTrades)} />
        <Stat label="总收益" value={formatNumber(stats.totalPnl)} />
        <Stat label="净收益" value={formatNumber(stats.netPnl)} />
        <Stat label="胜率" value={formatPercent(stats.winRate)} />
        <Stat label="平均ROI" value={formatPercent(stats.averageRoi)} />
        <Stat label="平均计划RR" value={formatNumber(stats.averagePlannedRR)} />
        <Stat label="平均实际R" value={`${formatNumber(stats.averageActualR)}R`} />
        <Stat label="最常交易品种" value={stats.mostTradedSymbol} />
        <Stat label="最大盈利单" value={stats.maxWin ? `${stats.maxWin.symbol} ${formatNumber(stats.maxWin.pnl)}` : "--"} />
        <Stat label="最大亏损单" value={stats.maxLoss ? `${stats.maxLoss.symbol} ${formatNumber(stats.maxLoss.pnl)}` : "--"} />
        <Stat label="最容易亏损结果" value={stats.mostLosingResultType in resultTypeLabels ? resultTypeLabels[stats.mostLosingResultType as keyof typeof resultTypeLabels] : "--"} />
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold">不同时间级别表现</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {Object.entries(stats.timeframePerformance).length === 0 && <p className="text-sm text-slate-500">暂无数据</p>}
          {Object.entries(stats.timeframePerformance).map(([timeframe, item]) => <div className="rounded-xl bg-slate-50 p-4" key={timeframe}><div className="font-semibold">{timeframe}</div><div className="text-sm text-slate-500">{item.count} 笔 · PnL {formatNumber(item.pnl)}</div></div>)}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="text-sm text-slate-500">{label}</div><div className="mt-2 text-2xl font-bold text-slate-900">{value}</div></div>;
}
