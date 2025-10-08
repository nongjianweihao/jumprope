import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { studentsRepo } from '../../store/repositories/studentsRepo';
import { testsRepo } from '../../store/repositories/testsRepo';
import { billingRepo } from '../../store/repositories/billingRepo';
import { RankBadge } from '../../components/RankBadge';
import { EnergyBar } from '../../components/EnergyBar';
import { ProgressChart } from '../../components/ProgressChart';
import { RadarChart } from '../../components/RadarChart';
import { ExportPdfButton } from '../../components/ExportPdfButton';
import { FinanceCards } from '../../components/FinanceCards';
export default function StudentProfile() {
    const params = useParams();
    const [student, setStudent] = useState();
    const [tests, setTests] = useState([]);
    const [wallet, setWallet] = useState();
    useEffect(() => {
        if (!params.id)
            return;
        studentsRepo.get(params.id).then(setStudent);
        testsRepo.listByStudent(params.id).then(setTests);
        billingRepo.wallet(params.id).then(setWallet);
    }, [params.id]);
    const radar = tests.at(-1)?.radar ?? {
        speed: 65,
        power: 62,
        endurance: 70,
        coordination: 60,
        agility: 68,
        balance: 66,
        flexibility: 64,
        core: 63,
        accuracy: 61
    };
    const baseline = useMemo(() => {
        const base = {};
        Object.keys(radar).forEach((key) => {
            base[key] = 55;
        });
        return base;
    }, [radar]);
    if (!student) {
        return _jsx("div", { className: "text-sm text-slate-500", children: "\u6B63\u5728\u52A0\u8F7D\u5B66\u5458\u6863\u6848..." });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("section", { className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm", children: _jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-2xl font-bold", children: student.name }), _jsx(RankBadge, { rank: student.currentRank ?? 1 }), _jsxs("div", { className: "text-sm text-slate-500", children: ["\u79EF\u5206\uFF1A", student.pointsTotal ?? 0] }), _jsxs("div", { className: "max-w-sm text-sm text-slate-500", children: ["\u5FBD\u7AE0\uFF1A", (student.badges ?? []).join('、') || '待解锁'] })] }), _jsxs("div", { className: "w-60 space-y-2", children: [_jsx("div", { className: "text-xs text-slate-500", children: "\u8BFE\u65F6\u94B1\u5305\u5269\u4F59" }), _jsxs("div", { className: "text-3xl font-black text-brand-primary", children: [wallet?.remaining ?? 0, _jsx("span", { className: "ml-1 text-sm font-medium text-slate-500", children: "\u8BFE\u65F6" })] }), _jsx(EnergyBar, { value: wallet?.remaining ?? 0, max: wallet ? wallet.totalPurchased : 100 })] }), _jsx(ExportPdfButton, { target: "#report-root", fileName: ({ name }) => `${name ?? student.name}-成长报告.pdf`, student: student })] }) }), _jsxs("section", { className: "grid gap-4 md:grid-cols-2", children: [_jsx("div", { className: "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm", children: _jsx(ProgressChart, { title: "\u901F\u5EA6\u66F2\u7EBF", series: [
                                { date: '2025-01-01', score: 120 },
                                { date: '2025-02-01', score: 130 },
                                { date: '2025-03-01', score: 138 }
                            ], unit: "\u6B21" }) }), _jsx("div", { className: "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm", children: _jsx(ProgressChart, { title: "\u82B1\u6837\u8FDB\u9636", series: [
                                { date: '2025-01-01', score: 2 },
                                { date: '2025-02-01', score: 4 },
                                { date: '2025-03-01', score: 6 }
                            ] }) }), _jsx("div", { className: "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm", children: _jsx(RadarChart, { data: radar, baselineP50: baseline }) }), _jsx("div", { className: "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm", children: _jsx(FinanceCards, { kpis: {
                                totalStudents: 1,
                                totalRevenue: 3600,
                                consumed: wallet?.totalConsumed ?? 0,
                                remaining: wallet?.remaining ?? 0,
                                arpu: 3600,
                                consumeRate: wallet && wallet.totalPurchased ? (wallet.totalConsumed / wallet.totalPurchased) * 100 : 0
                            } }) })] })] }));
}
