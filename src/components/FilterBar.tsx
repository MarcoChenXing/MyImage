"use client";

import { directions, resultTypes, timeframes, resultTypeLabels } from "@/lib/options";

export interface TradeFilters {
  symbol: string;
  direction: string;
  resultType: string;
  timeframe: string;
  pnlSide: string;
}

export function FilterBar({ filters, onChange }: { filters: TradeFilters; onChange: (filters: TradeFilters) => void }) {
  const set = (key: keyof TradeFilters, value: string) => onChange({ ...filters, [key]: value });
  return (
    <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-5">
      <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="按品种筛选" value={filters.symbol} onChange={(e) => set("symbol", e.target.value)} />
      <select className="rounded-xl border border-slate-200 px-3 py-2" value={filters.direction} onChange={(e) => set("direction", e.target.value)}><option value="">全部方向</option>{directions.map((d) => <option key={d} value={d}>{d}</option>)}</select>
      <select className="rounded-xl border border-slate-200 px-3 py-2" value={filters.resultType} onChange={(e) => set("resultType", e.target.value)}><option value="">全部结果</option>{resultTypes.map((r) => <option key={r} value={r}>{resultTypeLabels[r]}</option>)}</select>
      <select className="rounded-xl border border-slate-200 px-3 py-2" value={filters.timeframe} onChange={(e) => set("timeframe", e.target.value)}><option value="">全部级别</option>{timeframes.map((t) => <option key={t} value={t}>{t}</option>)}</select>
      <select className="rounded-xl border border-slate-200 px-3 py-2" value={filters.pnlSide} onChange={(e) => set("pnlSide", e.target.value)}><option value="">盈亏不限</option><option value="win">盈利</option><option value="loss">亏损</option></select>
    </div>
  );
}
