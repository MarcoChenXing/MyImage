"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FilterBar, type TradeFilters } from "@/components/FilterBar";
import { TradeCard } from "@/components/TradeCard";
import { getTrades } from "@/lib/storage";
import type { Trade } from "@/types/trade";

const initialFilters: TradeFilters = { symbol: "", direction: "", resultType: "", timeframe: "", pnlSide: "" };

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => setTrades(getTrades()), []);

  const filteredTrades = useMemo(() => trades.filter((trade) => {
    if (filters.symbol && !trade.symbol.toLowerCase().includes(filters.symbol.toLowerCase())) return false;
    if (filters.direction && trade.direction !== filters.direction) return false;
    if (filters.resultType && trade.resultType !== filters.resultType) return false;
    if (filters.timeframe && trade.timeframe !== filters.timeframe) return false;
    if (filters.pnlSide === "win" && trade.pnl <= 0) return false;
    if (filters.pnlSide === "loss" && trade.pnl >= 0) return false;
    return true;
  }), [trades, filters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">交易列表</h1><p className="mt-2 text-slate-500">展示所有交易卡片并支持基础筛选。</p></div>
        <Link className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500" href="/trades/new">新增交易</Link>
      </div>
      <FilterBar filters={filters} onChange={setFilters} />
      <div className="grid gap-4">
        {filteredTrades.length === 0 && <div className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">暂无匹配交易，请先上传截图创建复盘。</div>}
        {filteredTrades.map((trade) => <TradeCard key={trade.id} trade={trade} />)}
      </div>
    </div>
  );
}
