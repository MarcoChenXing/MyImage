import { calculateTradeMetrics, formatNumber, formatPercent } from "@/lib/calculation";
import type { Trade } from "@/types/trade";

export function MetricsPanel({ trade }: { trade: Trade }) {
  const metrics = calculateTradeMetrics(trade);
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-base font-semibold text-slate-900">自动计算指标</h3>
      {metrics.validationMessages.length > 0 && (
        <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          {metrics.validationMessages.map((message) => <p key={message}>{message}</p>)}
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <Metric label="持仓时间" value={metrics.holdingDuration} />
        <Metric label="计划亏损空间" value={formatNumber(metrics.plannedRisk)} />
        <Metric label="计划盈利空间" value={formatNumber(metrics.plannedReward)} />
        <Metric label="计划盈亏比" value={formatNumber(metrics.plannedRR)} />
        <Metric label="实际运行空间" value={formatNumber(metrics.actualRiskOrReward)} />
        <Metric label="实际R倍数" value={`${formatNumber(metrics.actualRMultiple)}R`} />
        <Metric label="ROI" value={formatPercent(metrics.roi)} />
        <Metric label="净收益" value={formatNumber(metrics.netPnl)} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 font-semibold text-slate-900">{value}</div></div>;
}
