"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScreenshotUploader } from "@/components/ScreenshotUploader";
import { TradeForm } from "@/components/TradeForm";
import { mockParseScreenshot } from "@/lib/mockParser";
import { saveTrade } from "@/lib/storage";
import type { TradeDraft } from "@/types/trade";

export default function NewTradePage() {
  const router = useRouter();
  const [draft, setDraft] = useState<TradeDraft | null>(null);

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">上传截图并确认交易</h1><p className="mt-2 text-slate-500">第一版使用 mockParser 自动生成草稿，用户确认后保存到浏览器 localStorage。</p></div>
      {!draft && <ScreenshotUploader onLoaded={(dataUrl) => setDraft(mockParseScreenshot(dataUrl))} />}
      {draft?.screenshotDataUrl && <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"><h2 className="mb-3 font-semibold">截图预览</h2><img className="max-h-[420px] rounded-xl object-contain" src={draft.screenshotDataUrl} alt="交易截图预览" /></div>}
      {draft && <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><h2 className="mb-4 text-xl font-semibold">识别确认</h2><TradeForm initialTrade={draft} onSubmit={(form) => { const trade = saveTrade(form); router.push(`/trades/${trade.id}`); }} /></div>}
    </div>
  );
}
