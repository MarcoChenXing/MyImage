import type { Trade, TradeDraft } from "@/types/trade";

const STORAGE_KEY = "daily-trade-review.trades";

function readRawTrades(): Trade[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Trade[];
  } catch {
    return [];
  }
}

function writeRawTrades(trades: Trade[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

export function getTrades() {
  return readRawTrades().sort((a, b) => b.entryTime.localeCompare(a.entryTime));
}

export function getTrade(id: string) {
  return readRawTrades().find((trade) => trade.id === id) ?? null;
}

export function saveTrade(draft: TradeDraft) {
  const now = new Date().toISOString();
  const trades = readRawTrades();
  const trade: Trade = {
    ...draft,
    id: draft.id ?? crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  writeRawTrades([trade, ...trades]);
  return trade;
}

export function updateTrade(id: string, patch: Partial<Trade>) {
  const trades = readRawTrades();
  const updated = trades.map((trade) =>
    trade.id === id ? { ...trade, ...patch, id, updatedAt: new Date().toISOString() } : trade,
  );
  writeRawTrades(updated);
  return updated.find((trade) => trade.id === id) ?? null;
}
