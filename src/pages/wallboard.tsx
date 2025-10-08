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
            <HighlightsMarquee highlights={["30s 单摇 PR +12%", "花样通过：交叉双摇", "团队积分 +15"]} />
          </div>
        </div>
        <div className="space-y-4">
          <Leaderboard
            items={[
              { id: '1', name: '林小勇', points: 126 },
              { id: '2', name: '周小捷', points: 118 },
              { id: '3', name: '王小燃', points: 112 }
            ]}
          />
          <SpeedBoard
            windowLabel="30s 单摇"
            items={[
              { id: '1', name: '林小勇', reps: 138, isPr: true },
              { id: '2', name: '周小捷', reps: 130 },
              { id: '3', name: '王小燃', reps: 128 }
            ]}
          />
        </div>
      </section>
      <footer className="mt-6 grid grid-cols-9 gap-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <RankBadge key={index} rank={index + 1} />
        ))}
      </footer>
    </div>
  );
}
