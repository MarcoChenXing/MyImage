"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { calculateTradeMetrics } from "@/lib/calculation";
import { directions, resultTypes, resultTypeLabels, timeframes } from "@/lib/options";
import type { Trade, TradeDraft } from "@/types/trade";
import { MetricsPanel } from "./MetricsPanel";

type FormValue = TradeDraft | Trade;

const numberFields = new Set(["entryPrice", "exitPrice", "quantity", "margin", "fee", "pnl", "targetTakeProfitPrice", "targetStopLossPrice"]);

export function TradeForm({ initialTrade, onSubmit, submitLabel = "保存交易" }: { initialTrade: FormValue; onSubmit: (trade: FormValue) => void; submitLabel?: string }) {
  const [form, setForm] = useState<FormValue>(initialTrade);
  const [error, setError] = useState("");
  const previewTrade = useMemo(() => ({ id: "preview", createdAt: "", updatedAt: "", ...form }) as Trade, [form]);
  const metrics = calculateTradeMetrics(previewTrade);

  const update = (key: keyof FormValue, value: string) => {
    setForm((current) => ({ ...current, [key]: numberFields.has(String(key)) ? Number(value) : value }));
  };

  return (
    <form className="space-y-5" onSubmit={(event) => {
      event.preventDefault();
      const requiredNumbers = Array.from(numberFields);
      const invalid = requiredNumbers.find((key) => Number.isNaN(Number(form[key as keyof FormValue])));
      if (!form.symbol.trim() || invalid || form.margin <= 0 || form.quantity <= 0) {
        setError("请检查：品种不能为空，数量/保证金必须大于 0，价格和金额字段必须是有效数字。");
        return;
      }
      setError("");
      onSubmit(form);
    }}>
      {error && <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="symbol"><input className="input" value={form.symbol} onChange={(e) => update("symbol", e.target.value.toUpperCase())} /></Field>
        <Field label="direction"><select className="input" value={form.direction} onChange={(e) => update("direction", e.target.value)}>{directions.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
        <Field label="timeframe"><select className="input" value={form.timeframe} onChange={(e) => update("timeframe", e.target.value)}>{timeframes.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
        <Field label="entryTime"><input className="input" type="datetime-local" value={form.entryTime} onChange={(e) => update("entryTime", e.target.value)} /></Field>
        <Field label="exitTime"><input className="input" type="datetime-local" value={form.exitTime} onChange={(e) => update("exitTime", e.target.value)} /></Field>
        <Field label="resultType"><select className="input" value={form.resultType} onChange={(e) => update("resultType", e.target.value)}>{resultTypes.map((item) => <option key={item} value={item}>{resultTypeLabels[item]}</option>)}</select></Field>
        {Array.from(numberFields).map((key) => <Field key={key} label={key}><input className="input" type="number" step="any" value={String(form[key as keyof FormValue])} onChange={(e) => update(key as keyof FormValue, e.target.value)} /></Field>)}
        <Field label="strategyTag"><input className="input" value={form.strategyTag} onChange={(e) => update("strategyTag", e.target.value)} /></Field>
        <Field label="emotionTag"><input className="input" value={form.emotionTag} onChange={(e) => update("emotionTag", e.target.value)} /></Field>
      </div>
      <Field label="reviewNote"><textarea className="input min-h-28" value={form.reviewNote} onChange={(e) => update("reviewNote", e.target.value)} /></Field>
      <MetricsPanel trade={previewTrade} />
      {metrics.validationMessages.length > 0 && <p className="text-sm text-amber-700">提示：可以先保存，但建议修正止盈/止损以获得有效计划RR。</p>}
      <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-500" type="submit">{submitLabel}</button>
      <style jsx>{`.input { width: 100%; border-radius: 0.75rem; border: 1px solid #cbd5e1; padding: 0.625rem 0.75rem; background: white; }`}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm"><span className="mb-1 block font-medium text-slate-700">{label}</span>{children}</label>;
}
