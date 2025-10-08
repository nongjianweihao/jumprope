import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { billingRepo } from '../../store/repositories/billingRepo';
import { FinanceCards } from '../../components/FinanceCards';
import { db } from '../../store/db';
const EMPTY_KPIS = { totalStudents: 0, totalRevenue: 0, consumed: 0, remaining: 0, arpu: 0, consumeRate: 0 };
export default function FinanceIndex() {
    const [kpis, setKpis] = useState(EMPTY_KPIS);
    const [lowWallet, setLowWallet] = useState([]);
    useEffect(() => {
        (async () => {
            setKpis(await billingRepo.financeKpis());
            const wallets = [];
            const studentIds = await db.students.toCollection().primaryKeys();
            for (const id of studentIds) {
                const wallet = await billingRepo.wallet(String(id));
                if (wallet.remaining <= 3) {
                    wallets.push(wallet);
                }
            }
            setLowWallet(wallets);
        })();
    }, []);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold", children: "\u8D22\u52A1\u770B\u677F" }), _jsx("p", { className: "text-sm text-slate-500", children: "\u603B\u89C8\u6536\u5165\u3001\u8BFE\u6D88\u4E0E\u7EED\u8D39\u63D0\u9192\uFF0C\u652F\u6301 CSV \u5BFC\u51FA\u3002" })] }), _jsx(FinanceCards, { kpis: kpis }), _jsxs("section", { className: "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-600", children: "\u7EED\u8D39\u63D0\u9192\uFF08\u5269\u4F59 \u2264 3 \u8282\uFF09" }), _jsxs("ul", { className: "mt-3 space-y-2 text-sm", children: [lowWallet.map((wallet) => (_jsxs("li", { className: "flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2", children: [_jsxs("span", { children: ["\u5B66\u5458 ", wallet.studentId] }), _jsxs("span", { className: "font-semibold text-brand-warning", children: ["\u5269\u4F59 ", wallet.remaining, " \u8282"] })] }, wallet.studentId))), !lowWallet.length && _jsx("li", { className: "text-slate-500", children: "\u6682\u65E0\u5F85\u7EED\u8D39\u5B66\u5458\u3002" })] })] })] }));
}
