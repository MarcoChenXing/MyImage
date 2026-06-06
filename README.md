# 每日交易复盘网页 MVP

这是一个本地单用户使用的交易复盘 Web App MVP。目标是让用户上传交易截图，通过预留的 OCR/mock 解析流程生成交易草稿，再手动确认字段，最终自动生成每笔交易的复盘卡片、盈亏比、实际 R 倍数与 K 线复盘视图。

## 技术栈

- Next.js + TypeScript
- Tailwind CSS
- 浏览器 `localStorage` 本地 JSON 存储（第一版优先快速跑通，后续可替换 SQLite/API）
- lightweight-charts 绘制 K 线复盘视图
- Vitest 测试关键交易计算逻辑

## 如何运行

```bash
npm install
npm run dev
```

默认访问：<http://localhost:3000>

常用命令：

```bash
npm run test
npm run lint
npm run build
```

## 当前已实现功能

### 1. 交易截图导入

- `/trades/new` 支持上传交易截图。
- 上传后显示截图预览。
- `mockParseScreenshot` 会基于截图生成一条待确认交易草稿。
- 用户可以手动修改所有核心字段并保存。
- 保存后跳转到该交易详情页。

### 2. 自动计算指标

交易计算集中在 `src/lib/calculation.ts`，页面组件只负责展示结果。

已计算：

- `holdingDuration`：持仓时间
- `plannedRisk`：计划亏损空间
- `plannedReward`：计划盈利空间
- `plannedRR`：计划盈亏比
- `actualRiskOrReward`：实际价格运行空间
- `actualRMultiple`：实际 R 倍数
- `roi`：收益率，`pnl / margin`
- `netPnl`：扣除手续费后的收益，`pnl - fee`

计算规则：

- 做多：
  - `plannedRisk = entryPrice - targetStopLossPrice`
  - `plannedReward = targetTakeProfitPrice - entryPrice`
  - `actualPriceMove = exitPrice - entryPrice`
- 做空：
  - `plannedRisk = targetStopLossPrice - entryPrice`
  - `plannedReward = entryPrice - targetTakeProfitPrice`
  - `actualPriceMove = entryPrice - exitPrice`
- `plannedRR = plannedReward / plannedRisk`
- `actualRMultiple = actualPriceMove / plannedRisk`

当计划风险或计划收益不合理时，页面会给出提示，但第一版允许先保存以便用户后续修正。

### 3. 交易列表页

`/trades` 展示所有交易卡片，包含：

- 品种、方向、时间级别
- 开仓/平仓时间、持仓时间
- 实际盈亏、ROI、计划 RR、实际 R
- 结果类型、策略标签、情绪标签、复盘备注摘要
- 查看详情按钮

支持按品种、方向、结果类型、时间级别、盈利/亏损筛选。

### 4. 交易详情页

`/trades/[id]` 展示单笔交易完整复盘：

- K 线图
- 开仓点和平仓点
- 目标止盈线和目标止损线
- 持仓区间连线
- 原始截图预览
- 指标面板
- 可编辑复盘表单

详情页可编辑复盘备注、策略标签、情绪标签、目标止盈价、目标止损价等字段，保存后重新计算指标。

### 5. 首页统计面板

`/` 基于本地交易数据实时计算并展示：

- 总交易次数
- 总收益
- 净收益
- 胜率
- 平均 ROI
- 平均计划 RR
- 平均实际 R
- 最大盈利单
- 最大亏损单
- 最常交易品种
- 最容易亏损的结果类型
- 不同时间级别表现

## 数据存储说明

第一版使用浏览器 `localStorage`，key 为：

```text
daily-trade-review.trades
```

优点是无需数据库、无需后端、`npm run dev` 即可使用。限制是数据仅保存在当前浏览器本地，清理浏览器数据后会丢失。

后续如需升级为 SQLite，可保留 `Trade` 类型和计算层不变，将 `src/lib/storage.ts` 替换为 Next.js Route Handler + SQLite 读写即可。

## 哪些地方是 mock

### OCR/mock 解析

当前 OCR 入口是：

```text
src/lib/mockParser.ts
```

`mockParseScreenshot(screenshotDataUrl)` 会返回固定结构的交易草稿。后续接入真实 OCR 或 AI 识别时，可以保持函数输出类型 `TradeDraft` 不变，只替换内部实现，例如：

1. 将截图上传给 OCR/AI 服务。
2. 将返回文本或结构化 JSON 映射为 `TradeDraft`。
3. 保留确认页，让用户在保存前人工校验所有字段。

### K 线数据

当前 K 线入口是：

```text
src/lib/mockCandles.ts
```

`getMockCandles(symbol, timeframe, entryTime, exitTime)` 生成模拟蜡烛图数据。后续接入真实交易所 API 时，可以保持该函数签名或新增异步版本：

```ts
async function getCandlesFromExchange(symbol, timeframe, entryTime, exitTime): Promise<Candle[]>
```

然后在 `TradeChart` 中替换数据来源即可。

## 项目结构

```text
src/
  app/
    page.tsx                 # 首页统计面板
    layout.tsx               # 全局布局与导航
    globals.css              # Tailwind 与全局样式
    trades/
      page.tsx               # 交易列表页
      new/page.tsx           # 上传截图与确认交易页
      [id]/page.tsx          # 交易详情页
  components/
    FilterBar.tsx
    MetricsPanel.tsx
    ResultTypeBadge.tsx
    ScreenshotUploader.tsx
    TradeCard.tsx
    TradeChart.tsx
    TradeForm.tsx
  lib/
    calculation.ts           # 独立交易计算逻辑
    calculation.test.ts      # long/short 盈利/止损单元测试
    mockCandles.ts           # mock K线数据
    mockParser.ts            # mock OCR 解析
    options.ts               # 枚举选项与中文标签
    stats.ts                 # 首页统计聚合
    storage.ts               # localStorage 本地 JSON 存储
  types/
    trade.ts                 # Trade/TradeMetrics/Candle 等类型
```

## 后续扩展建议

1. **真实 OCR/AI 识别**：替换 `mockParser.ts`，保留确认页作为人工校验环节。
2. **真实 K 线 API**：替换 `mockCandles.ts`，增加错误处理、加载状态和缓存。
3. **SQLite 持久化**：把 `localStorage` 改为 Route Handler + SQLite，便于跨浏览器使用和备份。
4. **导出能力**：增加 CSV/JSON 导出，方便长期复盘沉淀。
5. **更丰富统计**：按策略、情绪、时间级别计算胜率、平均 R、期望值。
