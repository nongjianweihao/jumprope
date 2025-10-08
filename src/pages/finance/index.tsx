import { useEffect, useState } from 'react';
import { billingRepo } from '../../store/repositories/billingRepo';
import { FinanceCards } from '../../components/FinanceCards';
import type { LessonWallet } from '../../types/models';
import { db } from '../../store/db';

const EMPTY_KPIS = { totalStudents: 0, totalRevenue: 0, consumed: 0, remaining: 0, arpu: 0, consumeRate: 0 };

export default function FinanceIndex() {
  const [kpis, setKpis] = useState(EMPTY_KPIS);
  const [lowWallet, setLowWallet] = useState<LessonWallet[]>([]);

  useEffect(() => {
    (async () => {
      setKpis(await billingRepo.financeKpis());
      const wallets: LessonWallet[] = [];
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">财务看板</h2>
        <p className="text-sm text-slate-500">总览收入、课消与续费提醒，支持 CSV 导出。</p>
      </div>
      <FinanceCards kpis={kpis} />
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-600">续费提醒（剩余 ≤ 3 节）</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {lowWallet.map((wallet) => (
            <li key={wallet.studentId} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span>学员 {wallet.studentId}</span>
              <span className="font-semibold text-brand-warning">剩余 {wallet.remaining} 节</span>
            </li>
          ))}
          {!lowWallet.length && <li className="text-slate-500">暂无待续费学员。</li>}
        </ul>
      </section>
    </div>
  );
}
