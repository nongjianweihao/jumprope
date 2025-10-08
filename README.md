# 智慧跳绳教学管理平台 – Codex README v1.1（MVP+游戏化+财务）

> 目标：在 **仅前端即可运行（PWA）** 的前提下，用 React/TS/Tailwind/shadcn + Dexie（IndexedDB）构建可教学落地的“跳绳教学管理 + 游戏化成长 + 财务看板”应用。本文档为 **可交付开发规范**，可直接驱动 Codex/工程同学生成代码与页面骨架；上线后可逐步接入后端。

---

## 0. 快速概览（Problem → Solution）

* **问题**：线下教学需要一体机/电脑即可开课；教练要高效点名、录入速度/花样成绩、发起测评；家长与学员需要可视化档案、徽章激励；运营需要课消/续费与收入概览；还要支持 **导入/导出备份**。
* **解决**：

  1. **纯前端 PWA**（可离线），本地持久化 **IndexedDB（Dexie）**；
  2. 明确的 **数据模型/仓库接口/状态机**；
  3. 最小闭环：**班级与学员 CRUD → 模板库 → 上课面板（出勤/成绩/点评/积分）→ 档案 → 季度测评/段位考核 → 报告导出 → 财务看板**；
  4. **游戏化**：积分事件、徽章、PR 高光卡、家长喜报、AI战报（文案占位）。

---

## 1. 运行与技术栈

* **框架**：React + TypeScript + Vite
* **样式/UI**：TailwindCSS + shadcn/ui + lucide-react
* **状态**：Zustand（store/ slices）、React Query（可选，先本地）
* **可视化**：Recharts（折线/柱状/雷达/饼图）
* **存储**：Dexie（IndexedDB）+ JSON/CSV 导入导出
* **PDF**：html2canvas + jsPDF 或 react-pdf（二选一，提供封装）
* **PWA**：vite-plugin-pwa（离线缓存上课面板与静态资源）

### 1.1 目录结构（建议）

```
src/
  components/
    AttendanceGrid.tsx
    SpeedInput.tsx
    FreestylePass.tsx
    RadarChart.tsx
    ProgressChart.tsx
    HighlightsCard.tsx
    CommentEditor.tsx
    FinanceCards.tsx
    ExportPdfButton.tsx
  pages/
    classes/index.tsx           // 班级列表（CRUD）
    classes/new.tsx
    classes/[id].tsx            // 班级详情 + 上课面板入口/壁板视图
    session/[id].tsx            // 上课面板（核心交互）
    students/index.tsx          // 学员列表（CRUD + 导入）
    students/new.tsx
    students/[id].tsx           // 学员档案（图表/报告/课时钱包）
    templates/index.tsx         // 模板库（CRUD + 导入导出）
    templates/new.tsx
    assessments/index.tsx       // 体能测评 + 段位考核（季度）
    finance/index.tsx           // 财务看板（收入/课消/提醒）
    reports/[studentId].tsx     // 家长报告预览/导出
    settings/index.tsx          // 导入/导出、种子、品牌配置
  store/
    db.ts                       // Dexie schema
    repositories/               // Repo 接口与实现（IndexedDB）
      studentsRepo.ts
      classesRepo.ts
      templatesRepo.ts
      sessionsRepo.ts
      testsRepo.ts
      billingRepo.ts
  utils/
    calc.ts                     // 雷达归一化、段位判定、勇士积分
    csv.ts                      // CSV/JSON 导入导出
    recommend.ts                // 模板推荐（弱项→卡片）
    report.ts                   // 报告拼版与导出封装
  seeds/
    seed.json
    public_library.json         // 段位/花样/勇士路径（原文）
    benchmarks.json             // 年龄/性别分位参考
```

---

## 2. 角色与展示模式

* **Coach（默认）**：教学管理全权限；MVP 无鉴权，单教练环境即可。
* **Wallboard（壁板模式）**：面向学员/家长的 **只读** 展示（课程内容、段位、徽章、积分榜、速度榜单）。
* **Parent（预留）**：仅查看个人档案（后续加登录）。

> 切换：上课面板右上角「壁板模式」开关，进入全屏大字版，支持快捷键 `B` 切换/`F` 全屏。

---

## 3. 数据模型（TypeScript）

> 统一 `id: string`，时间 `ISODate: string`，金额/数量 `number`。

```ts
export type ID = string; export type ISODate = string;
export type Period = 'PREP'|'SPEC'|'COMP';
export type WindowSec = 10|20|30|60; export type JumpMode='single'|'double';
export type FitnessQuality = 'speed'|'power'|'endurance'|'coordination'|'agility'|'balance'|'flexibility'|'core'|'accuracy';

export interface RankMove { id: ID; rank: number; name: string; tags?: string[]; description?: string; criteria?: string; }
export interface WarriorPathNode { id: ID; rank: number; title: string; moveIds: ID[]; points: number; }
export interface GameDrill { id: ID; name: string; qualityTags: FitnessQuality[]; description?: string; }
export interface TemplateBlock { id: ID; title: string; period: Period; durationMin?: number; rankMoveIds?: ID[]; qualities?: FitnessQuality[]; gameIds?: ID[]; notes?: string; }
export interface TrainingTemplate { id: ID; name: string; period: Period; weeks?: number; blocks: TemplateBlock[]; createdAt: ISODate; }

export interface Student { id: ID; name: string; gender?: 'M'|'F'; birth?: ISODate; guardian?: {name:string; phone?: string;}; joinDate?: ISODate; currentRank?: number; tags?: string[]; pointsTotal?: number; badges?: string[]; }
export interface ClassEntity { id: ID; name: string; coachName: string; schedule?: string; templateId?: ID; studentIds: ID[]; }

export interface AttendanceItem { studentId: ID; present: boolean; remark?: string; }
export interface SpeedRecord { id: ID; studentId: ID; mode: JumpMode; window: WindowSec; reps: number; date?: ISODate; }
export interface FreestyleChallengeRecord { id: ID; studentId: ID; moveId: ID; passed: boolean; note?: string; date?: ISODate; }
export interface TrainingNote { id: ID; studentId: ID; rating?: number; comments?: string; tags?: string[]; }

export interface SessionRecord { id: ID; classId: ID; date: ISODate; templateId?: ID; attendance: AttendanceItem[]; speed: SpeedRecord[]; freestyle: FreestyleChallengeRecord[]; notes: TrainingNote[]; closed: boolean; lessonConsume?: number; consumeOverrides?: Array<{studentId:ID;consume:number}>; highlights?: string[]; pointEvents?: PointEvent[]; }

export type PointEventType = 'attendance'|'pr'|'freestyle_pass'|'coach_bonus';
export interface PointEvent { id: ID; sessionId: ID; studentId: ID; type: PointEventType; points: number; reason?: string; createdAt: ISODate; }

export interface FitnessTestItem { id: ID; name: string; quality: FitnessQuality; unit: 'count'|'cm'|'s'|'grade'; }
export interface FitnessTestResult { id: ID; studentId: ID; quarter: string; date: ISODate; items: Array<{itemId:ID;value:number}>; radar: Record<FitnessQuality,number>; }
export interface RankExamRecord { id: ID; studentId: ID; date: ISODate; fromRank: number; toRank: number; passed: boolean; notes?: string; }

export interface LessonPackage { id: ID; studentId: ID; purchasedLessons: number; price: number; unitPrice?: number; purchasedAt: ISODate; remark?: string; }
export interface PaymentRecord { id: ID; studentId: ID; packageId: ID; amount: number; method?: 'cash'|'wechat'|'alipay'|'card'|'other'; paidAt: ISODate; }
export interface LessonWallet { studentId: ID; totalPurchased: number; totalConsumed: number; remaining: number; }

export interface Benchmark { id: ID; quality: FitnessQuality; ageMin: number; ageMax: number; gender?: 'M'|'F'|'all'; unit: 'count'|'cm'|'s'|'grade'; p25: number; p50: number; p75: number; }
export interface Recommendation { id: ID; studentId: ID; createdAt: ISODate; reason: string; templateId: ID; applied: boolean; }
```

### 3.1 Dexie Schema（store/db.ts）

```ts
import Dexie, { Table } from 'dexie';
export class AppDB extends Dexie {
  students!: Table<Student, string>;
  classes!: Table<ClassEntity, string>;
  templates!: Table<TrainingTemplate, string>;
  sessions!: Table<SessionRecord, string>;
  tests!: Table<FitnessTestResult, string>;
  rankExams!: Table<RankExamRecord, string>;
  lessonPackages!: Table<LessonPackage, string>;
  payments!: Table<PaymentRecord, string>;
  constructor(){
    super('jumpRopeDB');
    this.version(1).stores({
      students: 'id, name, currentRank',
      classes: 'id, name',
      templates: 'id, name, period',
      sessions: 'id, classId, date, closed',
      tests: 'id, studentId, quarter, date',
      rankExams: 'id, studentId, date',
      lessonPackages: 'id, studentId, purchasedAt',
      payments: 'id, studentId, paidAt'
    });
  }
}
export const db = new AppDB();
```

### 3.2 Repository 接口（store/repositories）

每个 Repo 暴露 `upsert/get/list/remove` 与聚合函数（示例：BillingRepo.calcWallet）。接口与实现分离，后续可平滑接入 REST。

---

## 4. 页面与核心流程（State Machines）

### 4.1 班级与学员（CRUD）

* **班级**：新建/编辑/删除；绑定/移除学员；设置默认模板；查看健康度（课消率、剩余中位数、出勤趋势）。
* **学员**：新建/编辑/删除；初始化段位/标签；支持 **续费**（生成 `LessonPackage` 与 `PaymentRecord`）。

**状态机**：`class.create → bind.students → set.template → start.session`。

### 4.2 模板库（Training Template）

* 新建模板 → 添加 Block（热身/速度/花样/素质/游戏/放松）→ 选段位动作、体能素质、游戏化 → 保存。
* 支持 **导入/导出 JSON**。

### 4.3 上课面板（核心）

1. **课前**：选择班级，选择模板（默认取班级模板，可临时替换）。
2. **课堂**：

   * 出勤表：Present/请假/备注；（写入 `AttendanceItem`）
   * 速度录入：10/20/30/60 × 单/双，逐个输入，支持“复制上次成绩”。
   * 花样挑战：选择 RankMove，**通过/未过**；
   * 点评：星级 + 标签（专注/积极/配合/节奏/技术） + 文本；
   * **积分事件**：出勤 +2；突破 PR +5；花样通关 +3；教练加分 +2（本节上限 10，UI 阶梯提示）。
   * 高光卡：自动生成最多 3 条（如“30s 单摇 PR +12%”/“花样通过：双摇交叉”）。
   * 课消：默认每人 1；可改为 0/0.5/1.5；个别学员可覆盖（试课 0）。
3. **结课**：点击「结束课程并同步」→ 写入 `sessionsRepo`；按规则 **扣课**；更新学员积分总数与可能的段位升级；生成战报草稿（文字）。
4. **壁板模式**：大字版轮播显示 **训练内容 / 本节高光 / 积分榜 / 速度榜**。

### 4.4 学员档案（Profile）

* 课时钱包卡片：已购/已消/剩余；续费入口；流水表。
* 速度曲线：可筛选窗口与单双摇；显示 PR 点。
* 花样进阶曲线：通过动作累计积分（或计数）；
* 雷达图：显示最近一次 `FitnessTestResult`，叠加同龄 **p50** 虚线；
* 徽章墙 + 积分趋势；
* **报告导出**：3 页模板（封面/数据页/建议页）。

### 4.5 测评与段位考核（季度）

* **体能测评**：创建季度（2025Q4），批量录入项目（映射 9 维质量）→ `calc.normalizeByBenchmark` 生成雷达（0..100）。
* **段位考核**：手动评定 or 依据 30s 单摇阈值自动建议；通过后更新 `currentRank` 与徽章。

### 4.6 财务看板

* 指标卡：总学员、总收入、已消课、剩余课时、ARPU、课消率；
* 趋势图：月收入（柱）、周/月课消（折线）；
* 续费提醒：`remaining ≤ 3` 学员列表 + 话术一键复制；
* 导出当期汇总（CSV/PDF）。

---

## 5. 关键算法与规则

### 5.1 雷达归一化（benchmarks.json）

```ts
export function normalizeByBenchmark(val:number, q:FitnessQuality, age:number, gender?:'M'|'F'){
  const b = findBenchmark(q, age, gender);
  if(!b) return {score:0, ref:undefined};
  const score = val<=b.p25 ? 60*(val/b.p25) : val<=b.p50 ? 60+15*((val-b.p25)/(b.p50-b.p25)) : val<=b.p75 ? 75+15*((val-b.p50)/(b.p75-b.p50)) : 90 + 10*((val-b.p75)/Math.max(1,b.p75));
  return {score: Math.max(0, Math.min(100, score)), ref: b};
}
```

### 5.2 段位评定（速度阈值，30s 单摇）

```ts
const TH = [60,70,80,100,110,120,150,160,170];
export function evalSpeedRank(best30Single:number){ let r=0; for(let i=0;i<TH.length;i++){ if(best30Single>=TH[i]) r=i+1; } return r; }
export function maybeUpgradeRank(student: Student, best30Single: number){ const nr = evalSpeedRank(best30Single); if(nr>(student.currentRank||0)) student.currentRank = nr; }
```

### 5.3 积分与徽章

* **积分事件**：`attendance +2` / `pr +5` / `freestyle_pass +3` / `coach_bonus +2`；每节课上限 10；累计到 `Student.pointsTotal`。
* **徽章条件（示例）**：`全勤小标兵（连续4节出勤）`、`速度之星（3次 PR）`、`花样达人（一段花样全通）`、`六边形勇士（雷达6项>85）`。

### 5.4 财务计量

* 结课扣课：默认 `lessonConsume=1`，对所有出勤学员扣 1；个别覆盖 `consumeOverrides`；请假不扣；試課=0；
* 钱包：`remaining = ∑purchasedLessons - ∑consumed`；
* 看板：`总收入=∑PaymentRecord.amount`，`课消率=已消课/总购买课时`。

---

## 6. UI 细节与组件契约

### 6.1 出勤表

```tsx
<AttendanceGrid students={Student[]} value={AttendanceItem[]} onChange={(v)=>void} />
```

* 行内徽章：试课（蓝）、补课（紫）、缺勤（灰）。

### 6.2 速度录入

```tsx
<SpeedInput students={Student[]} defaultWindow={30} onSubmit={(rows)=>void} />
// rows: {studentId, window, mode, reps}[]
```

* 支持复制上次成绩、抢跳扣 10（可选开关）、PR 高亮。

### 6.3 花样通关

```tsx
<FreestylePass students={Student[]} moves={RankMove[]} onChange={(recs:FreestyleChallengeRecord[])=>void} />
```

### 6.4 雷达/曲线

```tsx
<RadarChart data={Record<FitnessQuality,number>} baselineP50={Record<FitnessQuality,number>} />
<ProgressChart series={Array<{date:ISODate, score:number}>} />
```

### 6.5 高光卡

```tsx
<HighlightsCard highlights={string[]} />
```

### 6.6 财务卡片

```tsx
<FinanceCards kpis={{totalStudents, totalRevenue, consumed, remaining, arpu, consumeRate}} />
```

### 6.7 导出按钮

```tsx
<ExportPdfButton target="#report-root" fileName={(s)=>`${s.name}-成长报告.pdf`} />
```

---

## 7. 导入导出与种子

* **public_library.json**：

  * 速度段位阈值与评分办法（原文保留）
  * 花样动作（L1–L9 原文）
  * 勇士成长之路（原文）
* **benchmarks.json**：9 维质量 × 年龄段（6–8/9–10/11–12）× p25/p50/p75。
* **seed.json**：示例班级/学员/模板/测评/财务包与流水、徽章定义、推荐映射（弱项→模板）。
* **导入/导出**：支持 JSON（全量/分表）与 CSV（学员报表、财务汇总）。

---

## 8. 报告模板（家长可读，3 页）

1. **封面**：头像/姓名/班级/当前段位/徽章/能量条。
2. **数据页**：速度曲线（近 8 次 + PR）/ 花样进阶曲线 / 课时钱包摘要。
3. **综合页**：最新雷达（含同龄 p50 线）/ 教练评语 / 下期建议 / 训练计划卡推荐。

> 水印：`APP_BRAND_NAME` 与导出时间；A4 打印友好 CSS。

---

## 9. 开发任务清单（给 Codex/工程）

1. 初始化工程：Vite + React + TS + Tailwind + shadcn + Recharts + PWA。
2. Dexie 模型与 Repo 实现（students/classes/templates/sessions/tests/rankExams/lessonPackages/payments）。
3. 页面骨架与路由：classes/students/templates/session/assessments/finance/reports/settings。
4. 上课面板：出勤/速度/花样/点评/积分/高光/课消 → 结课同步。
5. 学员档案：钱包卡 + 速度曲线 + 花样进阶 + 雷达 + 徽章墙 + 报告导出。
6. 测评与段位：季度录入、benchmark 雷达、自动段位建议、手动考核过级。
7. 财务看板：KPI + 月收柱/课消折 + 续费提醒表 + 导出。
8. 模板库：模板构建器 + JSON 导入导出；推荐侧栏（弱项→模板）。
9. 导入导出中心：全量备份/恢复；CSV（学员与财务汇总）。
10. 壁板模式与快捷键：B/F 切换；轮播卡片。
11. E2E 脚本：班级/模板/上课/报告/续费/测评/看板 6 条回归用例。

---

## 10. 验收标准（Acceptance Criteria）

### 10.1 CRUD

* 班级/学员/模板支持创建、编辑、删除；导入模板 JSON 成功校验并可在上课面板调用。

### 10.2 上课面板

* 勾选出勤并录入 10/20/30/60 单/双摇成绩，保存后在学员档案 **速度曲线** 可见趋势，PR 点高亮。
* 花样挑战添加 2 条并通过，档案 **进阶曲线** 上升；高光卡包含该项。
* 结课时按规则扣课（默认 1；试课=0 覆盖生效）。

### 10.3 测评/段位

* 创建 2025Q4 测评并录入多项，档案显示最新 **雷达图** 与同龄 p50 参考线。
* 30s 单摇达到阈值后 `currentRank` 自动升级，且不会被低于阈值的成绩降级。

### 10.4 财务

* 学员 A 首购 20 课时/3600 元，财务看板「总收入+3600」「剩余课时+20」。
* A 出勤 1 次并结课：钱包 `remaining=19`；看板「已消课+1」。
* A 续费 10 节/1800 元：钱包 `remaining=29`；看板收入增加。

### 10.5 报告

* 学员档案点击「导出报告」→ 下载包含 **课时/速度曲线/进阶/雷达/评语** 的 PDF。

### 10.6 壁板模式

* 上课面板可一键切换 **壁板**，显示当节训练内容/高光/积分榜/速度榜；全屏播放不卡顿。

---

## 11. UX 文案与交互细节

* 主要按钮：

  * 「开始本节课」/「结束课程并同步」/「录入 30s 双摇」/「复制上次成绩」/「通过花样挑战」/「生成报告」/「切换壁板模式」
* 提示：

  * 结课后可在【学员档案】查看速度曲线与进阶曲线；
  * 季度测评生成的雷达将覆盖“最新雷达”；
  * 抢跳将自动扣除 10 次（若开启）。

---

## 12. 配置与环境

* `.env`：

  * `APP_BRAND_NAME=勇士跳绳`
  * `REPORT_WATERMARK=仅用于教学演示`
* `settings/`：品牌色、徽章图、壁板轮播时长、积分上限等。

---

## 13. 渐进式后端

* 保留 Repo 接口；新增 `RestRepo` 实现与开关；
* 鉴权方案（预研）：Supabase/Firebase；
* 同步策略：本地为真源，后端做合并（版本号/更新时间）。

---

## 14. 安全与边界

* MVP 不做多人并发；清理缓存将丢本地数据（提供 **一键备份/恢复 JSON**）。
* 年龄/性别分位为教学参考并声明非医学诊断；
* 数据仅用于教务管理，导出需获家长授权。

---

## 15. 附：公共库（原文）挂接说明

* `seeds/public_library.json`：

  * **速度评定标准**：段位阈值与评分办法（原文保留）→ 生成 `speed_rank_thresholds` 辅助表；
  * **花样动作**：L1–L9 原文 → 生成 `RankMove`；
  * **勇士成长之路**：文本原样展示在档案页。

---

> ✅ 本 README 为开发落地蓝本：包含类型、路由、仓库、组件契约、算法与验收清单；交付后可直接进入页面与组件生成、填充逻辑与样式实现阶段。

---

## 16. 游戏化 UI 设计规范（新增）

> 目标：让上课像“打副本”，让成长像“养成”，让家长像“解锁成就”。以下规范可直接驱动 Codex 生成 React + Tailwind + shadcn 组件与页面；所有命名保持英文蛇形/驼峰，便于工程落地。

### 16.1 设计语言（Design Tokens）

**颜色（Tailwind 自定义变量）**

* `--brand-primary` #4A6CF7（能量蓝）
* `--brand-secondary` #A855F7（星耀紫）
* `--brand-success` #10B981（成长绿）
* `--brand-warning` #F59E0B（荣誉橙）
* `--brand-danger` #EF4444（挑战红）
* `--panel` #0B1220（深色面板，壁板模式用）
* 渐变：`bg-gradient-to-r from-[#4A6CF7] via-[#7C3AED] to-[#9333EA]`

**阴影与圆角**

* `rounded-2xl`，卡片发光：`shadow-[0_0_40px_rgba(74,108,247,0.25)]`

**字体**

* 标题：Inter Black / 思源黑体 Heavy
* 正文：Inter / 思源黑体 Regular
* 数字读数：tabular-nums；`font-[900] tracking-wide`

**图标与拟物**

* lucide-react 基础 + 自制徽章 PNG/SVG（能量、闪电、奖杯、星星、盾牌）

---

### 16.2 徽章与能量体系（UI 物料）

**徽章档案（assets/badges/）**

* `bronze_attendance.png` 全勤小标兵
* `silver_pr_star.png` 速度之星
* `gold_freestyle_master.png` 花样达人
* `diamond_hex_warrior.png` 六边形勇士
* `legend_team_hero.png` 团队英雄

**能量条（EnergyBar）**

```tsx
export function EnergyBar({value,max=100}:{value:number;max?:number}){
  const pct=Math.min(100,Math.round((value/max)*100));
  return (
    <div className="h-3 w-full rounded-full bg-slate-200/50">
      <div className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-[width] duration-700" style={{width:`${pct}%`}}/>
    </div>
  );
}
```

**积分跳动（PointsTicker）**

```tsx
export function PointsTicker({delta}:{delta:number}){
  return <span className="text-lg font-black animate-bounce">+{delta}</span>;
}
```

**段位徽章（RankBadge）**

```tsx
export function RankBadge({rank}:{rank:number}){
  const colors=['bg-zinc-300','bg-blue-400','bg-purple-500','bg-amber-500','bg-rose-500'];
  const c=colors[Math.min(colors.length-1,Math.floor((rank-1)/2))];
  return <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-white ${c}`}>
    <span className="text-xs">段位</span><b className="text-sm">{rank}</b>
  </div>
}
```

---

### 16.3 壁板模式（大屏课堂）

**目标**：在一体机/电视上全屏滚动展示：今日任务卡、积分榜、速度榜、本节高光。

**页面结构**

* 顶部：班级名 + 时间 + 能量条
* 主区轮播：

  1. *任务卡*（热身/速度/花样/游戏）
  2. *积分榜*（Top 8，带+分动画）
  3. *速度榜*（窗口=30s 单摇，显示 PR 星标）
  4. *本节高光*（自动 1–3 条）
* 底部：段位九宫格（1–9 段）与规则简述

**组件**：`WallboardCarousel`、`Leaderboard`, `SpeedBoard`, `HighlightsMarquee`

**快捷键**：`B` 切换壁板，`←/→` 切换卡面，`F` 全屏

---

### 16.4 上课面板（作战台）游戏化布局

**顶部 HUD**

* 左：班级名 + RankBadge(班级平均段位)
* 中：本节任务进度（步骤面包屑 + EnergyBar）
* 右：快捷键提示（S: 速度输入 / F: 花样 / N: 点评 / E: 结课）

**中部多栏**

1. 左栏 *出勤*：学员头像栅格（出勤=彩色，缺勤=灰度；试课=蓝点；补课=紫点）
2. 中栏 *速度输入*：四窗口 Tab（10/20/30/60 × 单/双）；PR 自动高亮；支持“复制上次成绩”
3. 右栏 *花样挑战*：动作筛选（按段位/标签），通过即点亮技能点

**底部**

* *本节高光* + *积分事件*（+2 出勤、+5 PR、+3 通关、+2 教练加分），显示 `PointsTicker`
* 结课按钮：`<Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">结束课程并同步</Button>`

---

### 16.5 学员档案（勇士图鉴）

**头部信息卡**：头像、姓名、RankBadge、能量值、徽章墙（横向滚动）

**四象限**

* 左上：速度曲线（可选 10/20/30/60，PR 星标）
* 右上：花样进阶曲线（勇士积分/已通关数）
* 左下：体能雷达（叠加 p50 灰线）
* 右下：课时钱包（remaining 大读数 + EnergyBar）

**报告/分享**

* 「生成家长喜报」按钮：海报弹层（头像+段位+最新 PR + 徽章）

---

### 16.6 模板库（任务卡工坊）

**卡片规格（ChallengeCard）**

* 名称、星级（1–5）、适配段位（Lx-Ly）、目标（速度/协调/…）、建议时长
* 背景渐变 + 星星粒子动画（Framer Motion）

**侧栏**：AI 推荐卡（基于班级短板），一键“应用到下节课”

---

### 16.7 财务看板（能量指挥塔）

* KPI 卡片使用发光框：总收入/总学员/课消率/ARPU
* 趋势图：月收入（柱）+ 课消趋势（折）
* 续费提醒列表：头像 + 剩余课时读数 + 快捷话术复制

---

### 16.8 动效规范（Framer Motion 变体）

```ts
export const popIn={initial:{opacity:0,scale:0.9},animate:{opacity:1,scale:1,transition:{type:'spring',stiffness:260,damping:20}}};
export const slideUp={initial:{opacity:0,y:24},animate:{opacity:1,y:0,transition:{duration:0.35}}};
export const glowPulse='animate-[pulse_2.2s_ease-in-out_infinite]';
```

**交互反馈**

* PR 诞生：卡片边框发光 + 细雨粒子（CSS）
* 通关动作：动作卡抖动 120ms + 点亮
* 结课成功：顶部出现“战报已生成”条幅

---

### 16.9 主题与无障碍

* 主题开关：`light / dark / wallboard`（深色更突出渐变发光）
* 字号：课堂壁板最小 28px；普通界面正文 15–16px
* 色彩对比：关键读数对比度 ≥ 4.5:1

---

### 16.10 页面样例骨架（可直接让 Codex 生成）

**壁板页面** `pages/wallboard.tsx`

```tsx
export default function Wallboard(){
  return (
    <div className="min-h-dvh bg-[#0B1220] text-white p-6">
      {/* 顶部 */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-black tracking-wide">春季基础班 · 今日任务</h1>
        <div className="w-80"><EnergyBar value={72} /></div>
      </header>
      {/* 轮播 */}
      <section className="aspect-[16/9] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* WallboardCarousel 占位 */}
      </section>
      {/* 段位九宫格 */}
      <footer className="grid grid-cols-9 gap-2 mt-6">
        {Array.from({length:9}).map((_,i)=> <RankBadge key={i} rank={i+1}/>) }
      </footer>
    </div>
  );
}
```

**上课面板页面** `pages/session/[id].tsx`

```tsx
export default function SessionPanel(){
  return (
    <div className="min-h-dvh bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-[1400px] p-4 space-y-4">
        {/* HUD */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><RankBadge rank={3}/><h2 className="text-xl font-bold">春季基础班 · 第 6 节</h2></div>
          <div className="w-80"><EnergyBar value={46}/></div>
          <kbd className="text-xs text-slate-500">S/F/N/E</kbd>
        </div>
        {/* 三栏 */}
        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-3"><AttendanceGrid /* ... */ /></aside>
          <main className="col-span-6 space-y-4">
            <SpeedInput /* ... */ />
            <div className="grid grid-cols-2 gap-4">
              <HighlightsCard highlights={["30s 单摇 PR +12%","花样通过：双摇交叉"]}/>
              {/* 积分事件面板 */}
            </div>
          </main>
          <aside className="col-span-3"><FreestylePass /* ... */ /></aside>
        </div>
        <div className="flex justify-end">
          <button className="px-6 py-3 rounded-2xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">结束课程并同步</button>
        </div>
      </div>
    </div>
  );
}
```

---

### 16.11 分享物料（家长喜报海报）

**版式**：上 60% 成绩与徽章，下 40% 速度曲线缩略 + 教练寄语 + 二维码（品牌默认）

**导出**：1080×1920；`/reports/share/[studentId]` 支持一键保存

---

### 16.12 任务给 Codex（UI 实装清单）

1. 实现 `EnergyBar/RankBadge/PointsTicker` 基础组件并加入 storybook
2. 完成 `WallboardCarousel/Leaderboard/SpeedBoard/HighlightsMarquee`
3. 上课面板改造为“三栏作战台”并接入积分事件动画
4. 学员档案页接入徽章墙与海报弹层
5. 财务看板替换为发光 KPI 卡 + 渐变主题
6. 添加 `theme: light/dark/wallboard` 与快捷键 `B/F`

> 验收：在 55" 屏幕（1920×1080）壁板模式下，10 米内可清晰辨认主要读数与榜单；PR 与通关动效均在 1 秒内完成。7.训练部分支持导入导出训练计划。非常好👌——如果你的目标是一节课 **60–90 分钟（完整教学节次）**，那模板需要扩展为**6 大教学区块**（热身 → 专项 → 体能 → 花样 → 游戏 → 放松），总时长 60–90 min，内容层次由“激活-学习-巩固-挑战-恢复”构成。

下面是我建议的新版模板设计逻辑，供你发给 Codex 直接替换当前 seed 模板部分（我可以随后写入画布）：

---

### 🧭 顶级教练版 · 60–90 min 课程模板体系

| 模板名称        | 适用阶段         | 总时长    | 核心目标        | 各区块（建议时长）                                              |
| ----------- | ------------ | ------ | ----------- | ------------------------------------------------------ |
| **基础准备课 A** | PREP (入门)    | 75 min | 建立节奏感与协调性   | 热身 10 → 基础单摇 15 → 步法 10 → 花样 15 → 体能 15 → 放松 10        |
| **速度强化课 B** | SPEC (提升)    | 80 min | 提高速度与爆发力    | 热身 10 → 神经激活 10 → 速度窗口 20 → 技术矫正 10 → 力量循环 15 → 放松 10  |
| **花样挑战课 C** | SPEC (L3–L6) | 75 min | 学习花样组合与节奏衔接 | 热身 10 → 步法协调 10 → 花样训练 25 → 体能巩固 15 → 游戏 10 → 放松 5     |
| **综合竞技课 D** | COMP (比赛前)   | 90 min | 模拟比赛、综合输出   | 热身 10 → 专项冲刺 20 → 速度 20 → 花样考核 20 → 体能抽测 10 → 放松与目标 10 |
| **恢复调整课 E** | PREP (恢复周)   | 60 min | 消除疲劳、提升柔韧   | 热身 10 → 筋膜放松 15 → 灵活拉伸 15 → 核心稳定 10 → 呼吸放松 10          |
| **家长共练课 F** | MIX (亲子活动)   | 70 min | 增进互动与兴趣     | 热身 10 → 亲子协作 15 → 跳绳游戏 15 → 花样体验 15 → 体能 10 → 放松 5     |

---

### 🧩 每节课的时间配比（可配置）

```json
{
  "durationMinTotal": 75,
  "blocks": [
    { "title": "热身激活", "durationMin": 10 },
    { "title": "专项技能", "durationMin": 20 },
    { "title": "体能素质", "durationMin": 15 },
    { "title": "花样进阶", "durationMin": 15 },
    { "title": "游戏挑战", "durationMin": 10 },
    { "title": "放松反馈", "durationMin": 5 }
  ]
}
```

> **规则**
>
> * 模板定义新增字段 `durationMinTotal` （60–90）。
> * 前端面板显示“已排课时长/目标课时长”。
> * 系统在课时结课时 自动计算超时/不足（±10 min 提示）。

---


 
