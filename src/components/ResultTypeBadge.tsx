import { resultTypeLabels } from "@/lib/options";
import type { TradeResultType } from "@/types/trade";

const tone: Record<TradeResultType, string> = {
  take_profit: "bg-emerald-100 text-emerald-700",
  partial_take_profit: "bg-emerald-100 text-emerald-700",
  early_close_profit: "bg-teal-100 text-teal-700",
  breakeven: "bg-slate-100 text-slate-700",
  stop_loss: "bg-rose-100 text-rose-700",
  manual_stop_loss: "bg-orange-100 text-orange-700",
  early_close_loss: "bg-amber-100 text-amber-700",
  liquidation: "bg-red-100 text-red-700",
  other: "bg-indigo-100 text-indigo-700",
};

export function ResultTypeBadge({ resultType }: { resultType: TradeResultType }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone[resultType]}`}>{resultTypeLabels[resultType]}</span>;
}
