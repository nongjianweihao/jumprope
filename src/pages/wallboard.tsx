import { useEffect, useMemo, useState } from 'react';
import { EnergyBar } from '../components/EnergyBar';
import { WallboardCarousel } from '../components/WallboardCarousel';
import { RankBadge } from '../components/RankBadge';
import { Leaderboard } from '../components/Leaderboard';
import { SpeedBoard } from '../components/SpeedBoard';
import { HighlightsMarquee } from '../components/HighlightsMarquee';
import { WarriorPathCard } from '../components/WarriorPathCard';
import { db } from '../store/db';
import { getWarriorPath } from '../store/publicLibrary';
import { studentsRepo } from '../store/repositories/studentsRepo';
import type { SessionRecord, Student } from '../types/models';

export default function Wallboard() {
  const [latest, setLatest] = useState<SessionRecord | undefined>();
  const [featuredStudent, setFeaturedStudent] = useState<Student | undefined>();
  const [leaders, setLeaders] = useState<Array<{ id: string; name: string; points: number }>>([]);
  const [studentsMap, setStudentsMap] = useState<Record<string, Student>>({});
  const warriorPath = getWarriorPath();
  const fallbackRank = warriorPath.length ? Math.min(warriorPath[warriorPath.length - 1].rank, 5) : 1;

  useEffect(() => {
    let active = true;
    (async () => {
      const session = (await db.sessions.orderBy('date').reverse().first()) as SessionRecord | undefined;
      if (active) {
        setLatest(session);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!latest || !latest.attendance?.length) return;
    const target = latest.attendance.find((item) => item.present) ?? latest.attendance[0];
    if (!target) return;
    studentsRepo.get(target.studentId).then((student) => {
      if (student) {
        setFeaturedStudent(student);
      }
    });
  }, [latest]);

  useEffect(() => {
    let active = true;
    (async () => {
      const list = await studentsRepo.list();
      if (!active) return;
      const map = Object.fromEntries(list.map((student) => [student.id, student]));
      setStudentsMap(map);
      setLeaders(
        list
          .map((student) => ({ id: student.id, name: student.name, points: student.pointsTotal ?? 0 }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 8)
      );
    })();
    return () => {
      active = false;
    };
  }, [latest]);

  const highlights = latest?.highlights && latest.highlights.length > 0 ? latest.highlights : ['等待本节高光...'];
  const speedItems = useMemo(() => {
    if (!latest?.speed?.length) return [] as Array<{ id: string; name: string; reps: number; isPr?: boolean }>;
    const singles = latest.speed.filter((row) => row.window === 30 && row.mode === 'single');
    return singles
      .slice()
      .sort((a, b) => b.reps - a.reps)
      .slice(0, 8)
      .map((row) => ({
        id: row.id,
        name: studentsMap[row.studentId]?.name ?? '学员',
        reps: row.reps,
        isPr: studentsMap[row.studentId]?.best30Single === row.reps
      }));
  }, [latest, studentsMap]);
  const slides = [
    { id: 'mission', title: '今日任务 · 激活-学习-巩固-挑战-恢复', description: '热身激活 → 专项技能 → 花样进阶 → 游戏挑战 → 放松反馈' },
    { id: 'points', title: '积分榜', description: 'Top 8 勇士积分实时更新，保持冲刺！' },
    { id: 'speed', title: '速度榜', description: '30 秒单摇榜单，PR 自动点亮星标。' },
    { id: 'highlights', title: '本节高光', description: 'PR 与通关即时上墙，大家一起为队友喝彩。' }
  ];

  return (
    <div className="min-h-dvh bg-[#0B1220] p-6 text-white">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-wide">春季基础班 · 今日战斗</h1>
          <p className="text-sm text-white/60">壁板模式 · 自动轮播 · 快捷键 B/F</p>
        </div>
        <div className="w-80">
          <EnergyBar value={72} />
        </div>
      </header>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
            <WallboardCarousel slides={slides} />
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <HighlightsMarquee highlights={highlights} />
          </div>
        </div>
        <div className="space-y-4">
          <Leaderboard
            items={
              leaders.length
                ? leaders
                : [
                    { id: 'placeholder-1', name: '勇士一号', points: 0 },
                    { id: 'placeholder-2', name: '勇士二号', points: 0 },
                    { id: 'placeholder-3', name: '勇士三号', points: 0 }
                  ]
            }
          />
          <SpeedBoard
            windowLabel="30s 单摇"
            items={
              speedItems.length
                ? speedItems
                : [
                    { id: 'speed-1', name: '勇士一号', reps: 0, isPr: false },
                    { id: 'speed-2', name: '勇士二号', reps: 0, isPr: false },
                    { id: 'speed-3', name: '勇士三号', reps: 0, isPr: false }
                  ]
            }
          />
        </div>
      </section>
      <footer className="mt-6 grid gap-4 lg:grid-cols-2">
        <WarriorPathCard
          student={
            featuredStudent ?? {
              id: 'wallboard-demo',
              name: '勇士示例',
              currentRank: fallbackRank
            }
          }
          path={warriorPath}
        />
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-semibold text-white/80">段位九宫格</h3>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, index) => (
              <RankBadge key={index} rank={index + 1} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
