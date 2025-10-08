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
import { getLibrary } from '../../store/publicLibrary';
import { WarriorPathCard } from '../../components/WarriorPathCard';
import { QuestTracker, type Quest } from '../../components/QuestTracker';
import { BadgeShowcase } from '../../components/BadgeShowcase';
import { addPoints, getBadgeByPoints } from '../../utils/points';

export default function StudentProfile() {
  const params = useParams();
  const [student, setStudent] = useState<Student | undefined>();
  const [tests, setTests] = useState<FitnessTestResult[]>([]);
  const [wallet, setWallet] = useState<LessonWallet | undefined>();
  const [libraryVersion, setLibraryVersion] = useState(0);

  useEffect(() => {
    if (!params.id) return;
    studentsRepo.get(params.id).then(setStudent);
    testsRepo.listByStudent(params.id).then(setTests);
    billingRepo.wallet(params.id).then(setWallet);
  }, [params.id]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'public_library') {
        setLibraryVersion((value) => value + 1);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const lastTest = tests.length ? tests[tests.length - 1] : undefined;
  const radar = lastTest?.radar ?? {
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

  const library = useMemo(() => getLibrary(), [libraryVersion]);
  const warriorPath = library.warrior_path ?? [];
  const questInitial = useMemo(() => {
    const currentRank = student?.currentRank ?? 0;
    return [
      { id: 'quest-1', title: '完成一段花样', desc: '走出新手村', done: currentRank >= 1 },
      { id: 'quest-2', title: '六维测试达 90 分', desc: '六边形勇士', done: currentRank >= 4 },
      { id: 'quest-3', title: '通过七段花样', desc: '竞技挑战', done: currentRank >= 7 }
    ];
  }, [student?.currentRank]);
  const [quests, setQuests] = useState<Quest[]>(questInitial);

  useEffect(() => {
    setQuests(questInitial);
  }, [questInitial]);

  const badge = useMemo(() => getBadgeByPoints(student?.pointsTotal ?? 0), [student?.pointsTotal, libraryVersion]);

  const pointsSeries = useMemo(() => {
    const total = student?.pointsTotal ?? 0;
    const baseline = Math.max(0, Math.floor(total * 0.4));
    const midpoint = Math.max(baseline, Math.floor(total * 0.7));
    const formatDate = (monthsAgo: number) => {
      const date = new Date();
      date.setMonth(date.getMonth() - monthsAgo);
      return date.toISOString().slice(0, 10);
    };
    return [
      { date: formatDate(2), score: baseline },
      { date: formatDate(1), score: midpoint },
      { date: formatDate(0), score: total }
    ];
  }, [student?.pointsTotal]);

  const handleQuestChange = async (next: Quest[]) => {
    if (!student) return;
    const previous = new Map(quests.map((quest) => [quest.id, quest.done]));
    const newlyCompleted = next.filter((quest) => quest.done && !previous.get(quest.id));
    setQuests(next);
    if (!newlyCompleted.length) return;

    const record = await studentsRepo.get(student.id);
    if (!record) return;

    const updated: Student = { ...record };
    for (const quest of newlyCompleted) {
      const before = updated.pointsTotal ?? 0;
      const after = addPoints(before, 'quest_complete');
      updated.pointsTotal = after;
      const previousBadge = getBadgeByPoints(before);
      const nextBadge = getBadgeByPoints(after);
      if (nextBadge && nextBadge.id && nextBadge.id !== previousBadge?.id && nextBadge.name) {
        const badgeSet = new Set(updated.badges ?? []);
        badgeSet.add(nextBadge.name);
        updated.badges = Array.from(badgeSet);
      }
    }

    await studentsRepo.upsert(updated);
    setStudent(updated);
  };

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
          <ExportPdfButton
            target="#report-root"
            fileName={(options) => `${options?.name ?? student.name}-成长报告.pdf`}
            student={student}
          />
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

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <ProgressChart title="成长积分曲线" series={pointsSeries} unit="GP" />
        </div>
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <BadgeShowcase
            name={badge?.name ?? '暂无徽章'}
            desc={badge?.desc ?? '继续努力解锁下一枚勋章'}
            icon={badge?.icon ?? '⭐'}
          />
          <div className="text-xs text-slate-500">
            已解锁：{(student.badges ?? []).length ? (student.badges ?? []).join('、') : '暂未解锁勋章'}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <WarriorPathCard student={student} path={warriorPath} />
        <QuestTracker initial={quests} onChange={handleQuestChange} />
      </section>
    </div>
  );
}
