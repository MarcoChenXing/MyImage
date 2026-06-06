import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "每日交易复盘 MVP",
  description: "本地单用户交易截图导入与复盘工具",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link className="text-lg font-bold text-slate-900" href="/">每日交易复盘</Link>
            <div className="flex gap-3 text-sm font-medium text-slate-600">
              <Link className="hover:text-blue-600" href="/">统计面板</Link>
              <Link className="hover:text-blue-600" href="/trades">交易列表</Link>
              <Link className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500" href="/trades/new">新增复盘</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
