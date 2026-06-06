"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MetricsPanel } from "@/components/MetricsPanel";
import { ResultTypeBadge } from "@/components/ResultTypeBadge";
import { TradeChart } from "@/components/TradeChart";
import { TradeForm } from "@/components/TradeForm";
import { calculateTradeMetrics, formatNumber } from "@/lib/calculation";
import { getTrade, updateTrade } from "@/lib/storage";
import type { Trade } from "@/types/trade";

export default function TradeDetailPage() {
  const params = useParams<{ id: string }>();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => setTrade(getTrade(params.id)), [params.id]);

  if (!trade) {
    return <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200"><p className="text-slate-500">未找到交易。</p><Link className="mt-4 inline-flex text-blue-600" href="/trades">返回列表</Link></div>;
  }

  const metrics = calculateTradeMetrics(trade);
  const resultHint = trade.resultType === "take_profit"
    ? `本笔交易兑现了 ${formatNumber(metrics.actualRMultiple)}R。`
    : ["stop_loss", "manual_stop_loss", "liquidation"].includes(trade.resultType)
      ? `本笔交易亏损了 ${formatNumber(Math.abs(metrics.actualRMultiple ?? 0))}R。`
      : ["early_close_profit", "early_close_loss", "partial_take_profit"].includes(trade.resultType)
        ? "提前平仓/减仓：请重点复盘计划RR与实际R的偏差。"
        : "结果类型只影响复盘分类，不改变实际R倍数计算逻辑。";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="text-3xl font-bold">{trade.symbol} 交易详情</h1><p className="mt-2 text-slate-500">{trade.direction.toUpperCase()} · {trade.timeframe} · {trade.entryTime} → {trade.exitTime}</p></div>
        <ResultTypeBadge resultType={trade.resultType} />
      </div>
      <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-800">{resultHint}</div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <TradeChart trade={trade} />
        <div className="space-y-4">
          {trade.screenshotDataUrl && <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><h2 className="mb-3 font-semibold">原始截图</h2><img className="max-h-72 rounded-xl object-contain" src={trade.screenshotDataUrl} alt="原始交易截图" /></div>}
          <MetricsPanel trade={trade} />
        </div>
      </div>
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-xl font-semibold">编辑复盘</h2>
        {saved && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">已保存，指标已重新计算。</div>}
        <TradeForm initialTrade={trade} submitLabel="保存修改" onSubmit={(form) => { const updated = updateTrade(trade.id, form); if (updated) { setTrade(updated); setSaved(true); } }} />
      </section>
    </div>
  );
}
