import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { studentsRepo } from '../../store/repositories/studentsRepo';
import { testsRepo } from '../../store/repositories/testsRepo';
import { billingRepo } from '../../store/repositories/billingRepo';
import type { FitnessTestResult, LessonWallet, Student } from '../../types/models';
import { RankBadge } from '../../components/RankBadge';
import { EnergyBar } from '../../components/EnergyBar';
import { ProgressChart } from '../../components/ProgressChart';
import { RadarChart } from '../../components/RadarChart';
import { ExportPdfButton } from '../../components/ExportPdfButton';
import { FinanceCards } from '../../components/FinanceCards';
import { nanoid } from '../../utils/id';

export default function StudentProfile() {
  const params = useParams();
  const [student, setStudent] = useState<Student | undefined>();
  const [tests, setTests] = useState<FitnessTestResult[]>([]);
  const [wallet, setWallet] = useState<LessonWallet | undefined>();

  useEffect(() => {
    if (!params.id) return;
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
    const base: Record<string, number> = {};
    Object.keys(radar).forEach((key) => {
      base[key] = 55;
    });
    return base;
  }, [radar]);

  if (!student) {
    return <div className="text-sm text-slate-500">正在加载学员档案...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{student.name}</h2>
            <RankBadge rank={student.currentRank ?? 1} />
            <div className="text-sm text-slate-500">积分：{student.pointsTotal ?? 0}</div>
            <div className="max-w-sm text-sm text-slate-500">
              徽章：{(student.badges ?? []).join('、') || '待解锁'}
            </div>
          </div>
          <div className="w-60 space-y-2">
            <div className="text-xs text-slate-500">课时钱包剩余</div>
            <div className="text-3xl font-black text-brand-primary">
              {wallet?.remaining ?? 0}
              <span className="ml-1 text-sm font-medium text-slate-500">课时</span>
            </div>
            <EnergyBar value={wallet?.remaining ?? 0} max={wallet ? wallet.totalPurchased : 100} />
            <button
              type="button"
              onClick={async () => {
                if (!student) return;
                const packageId = nanoid();
                await billingRepo.addPackage(
                  {
                    id: packageId,
                    studentId: student.id,
                    purchasedLessons: 20,
                    price: 3600,
                    purchasedAt: new Date().toISOString()
                  },
                  {
                    id: nanoid(),
                    studentId: student.id,
                    packageId,
                    amount: 3600,
                    paidAt: new Date().toISOString()
                  }
                );
                setWallet(await billingRepo.wallet(student.id));
              }}
              className="mt-2 inline-flex items-center justify-center rounded-full border border-brand-primary px-3 py-1 text-xs font-medium text-brand-primary transition hover:bg-brand-primary/10"
            >
              + 首购20节/¥3600
            </button>
          </div>
          <ExportPdfButton target="#report-root" fileName={({ name }) => `${name ?? student.name}-成长报告.pdf`} student={student} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <ProgressChart
            title="速度曲线"
            series={[
              { date: '2025-01-01', score: 120 },
              { date: '2025-02-01', score: 130 },
              { date: '2025-03-01', score: 138 }
            ]}
            unit="次"
          />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <ProgressChart
            title="花样进阶"
            series={[
              { date: '2025-01-01', score: 2 },
              { date: '2025-02-01', score: 4 },
              { date: '2025-03-01', score: 6 }
            ]}
          />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <RadarChart data={radar} baselineP50={baseline as any} />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <FinanceCards
            kpis={{
              totalStudents: 1,
              totalRevenue: 3600,
              consumed: wallet?.totalConsumed ?? 0,
              remaining: wallet?.remaining ?? 0,
              arpu: 3600,
              consumeRate: wallet && wallet.totalPurchased ? (wallet.totalConsumed / wallet.totalPurchased) * 100 : 0
            }}
          />
        </div>
      </section>
    </div>
  );
}
