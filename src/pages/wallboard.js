import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EnergyBar } from '../components/EnergyBar';
import { WallboardCarousel } from '../components/WallboardCarousel';
import { RankBadge } from '../components/RankBadge';
import { Leaderboard } from '../components/Leaderboard';
import { SpeedBoard } from '../components/SpeedBoard';
import { HighlightsMarquee } from '../components/HighlightsMarquee';
export default function Wallboard() {
    const slides = [
        { id: 'mission', title: '今日任务 · 激活-学习-巩固-挑战-恢复', description: '热身激活 → 专项技能 → 花样进阶 → 游戏挑战 → 放松反馈' },
        { id: 'points', title: '积分榜', description: 'Top 8 勇士积分实时更新，保持冲刺！' },
        { id: 'speed', title: '速度榜', description: '30 秒单摇榜单，PR 自动点亮星标。' },
        { id: 'highlights', title: '本节高光', description: 'PR 与通关即时上墙，大家一起为队友喝彩。' }
    ];
    return (_jsxs("div", { className: "min-h-dvh bg-[#0B1220] p-6 text-white", children: [_jsxs("header", { className: "mb-6 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-black tracking-wide", children: "\u6625\u5B63\u57FA\u7840\u73ED \u00B7 \u4ECA\u65E5\u6218\u6597" }), _jsx("p", { className: "text-sm text-white/60", children: "\u58C1\u677F\u6A21\u5F0F \u00B7 \u81EA\u52A8\u8F6E\u64AD \u00B7 \u5FEB\u6377\u952E B/F" })] }), _jsx("div", { className: "w-80", children: _jsx(EnergyBar, { value: 72 }) })] }), _jsxs("section", { className: "grid gap-6 lg:grid-cols-3", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx("div", { className: "aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl", children: _jsx(WallboardCarousel, { slides: slides }) }), _jsx("div", { className: "mt-6 rounded-2xl border border-white/10 bg-white/5 p-6", children: _jsx(HighlightsMarquee, { highlights: ["30s 单摇 PR +12%", "花样通过：交叉双摇", "团队积分 +15"] }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(Leaderboard, { items: [
                                    { id: '1', name: '林小勇', points: 126 },
                                    { id: '2', name: '周小捷', points: 118 },
                                    { id: '3', name: '王小燃', points: 112 }
                                ] }), _jsx(SpeedBoard, { windowLabel: "30s \u5355\u6447", items: [
                                    { id: '1', name: '林小勇', reps: 138, isPr: true },
                                    { id: '2', name: '周小捷', reps: 130 },
                                    { id: '3', name: '王小燃', reps: 128 }
                                ] })] })] }), _jsx("footer", { className: "mt-6 grid grid-cols-9 gap-2", children: Array.from({ length: 9 }).map((_, index) => (_jsx(RankBadge, { rank: index + 1 }, index))) })] }));
}
