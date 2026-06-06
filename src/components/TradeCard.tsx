import Link from "next/link";
import { calculateTradeMetrics, formatNumber, formatPercent } from "@/lib/calculation";
import type { Trade } from "@/types/trade";
import { ResultTypeBadge } from "./ResultTypeBadge";

export function TradeCard({ trade }: { trade: Trade }) {
  const metrics = calculateTradeMetrics(trade);
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-slate-900">{trade.symbol}</h3>
            <span className={trade.direction === "long" ? "text-emerald-600" : "text-rose-600"}>{trade.direction.toUpperCase()}</span>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs">{trade.timeframe}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{trade.entryTime} → {trade.exitTime} · {metrics.holdingDuration}</p>
        </div>
        <ResultTypeBadge resultType={trade.resultType} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <Cell label="实际盈亏" value={formatNumber(trade.pnl)} positive={trade.pnl >= 0} />
        <Cell label="ROI" value={formatPercent(metrics.roi)} positive={(metrics.roi ?? 0) >= 0} />
        <Cell label="计划RR" value={formatNumber(metrics.plannedRR)} />
        <Cell label="实际R" value={`${formatNumber(metrics.actualRMultiple)}R`} positive={(metrics.actualRMultiple ?? 0) >= 0} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-full bg-blue-50 px-3 py-1">策略：{trade.strategyTag || "未填写"}</span>
        <span className="rounded-full bg-purple-50 px-3 py-1">情绪：{trade.emotionTag || "未填写"}</span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{trade.reviewNote || "暂无复盘备注"}</p>
      <Link className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700" href={`/trades/${trade.id}`}>查看详情</Link>
    </article>
  );
}

function Cell({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">{label}</div><div className={`mt-1 font-semibold ${positive === undefined ? "text-slate-900" : positive ? "text-emerald-600" : "text-rose-600"}`}>{value}</div></div>;
}
