import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { classesRepo } from '../../store/repositories/classesRepo';
import { studentsRepo } from '../../store/repositories/studentsRepo';
import { sessionsRepo } from '../../store/repositories/sessionsRepo';
import type {
  AttendanceItem,
  ClassEntity,
  FreestyleChallengeRecord,
  RankMove,
  SessionRecord,
  SpeedRecord,
  Student
} from '../../types/models';
import { AttendanceGrid } from '../../components/AttendanceGrid';
import { SpeedInput } from '../../components/SpeedInput';
import { FreestylePass } from '../../components/FreestylePass';
import { HighlightsCard } from '../../components/HighlightsCard';
import { CommentEditor } from '../../components/CommentEditor';
import { EnergyBar } from '../../components/EnergyBar';
import { RankBadge } from '../../components/RankBadge';
import { PointsTicker } from '../../components/PointsTicker';
import { nanoid } from '../../utils/id';
import { evalSpeedRank } from '../../utils/calc';
import { getRankMoves } from '../../store/publicLibrary';

export default function SessionPanel() {
  const params = useParams();
  const [classEntity, setClassEntity] = useState<ClassEntity | undefined>();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [pointDelta, setPointDelta] = useState<number>(0);
  const [speeds, setSpeeds] = useState<SpeedRecord[]>([]);
  const [freestyle, setFreestyle] = useState<FreestyleChallengeRecord[]>([]);
  const [moves, setMoves] = useState<RankMove[]>([]);

  useEffect(() => {
    if (!params.id) return;
    classesRepo.get(params.id).then(setClassEntity);
  }, [params.id]);

  useEffect(() => {
    if (!classEntity) return;
    Promise.all(classEntity.studentIds.map((id) => studentsRepo.get(id))).then((list) =>
      setStudents(list.filter(Boolean) as Student[])
    );
  }, [classEntity]);

  const avgRank = useMemo(() => {
    if (!students.length) return 0;
    return (
      students.reduce((sum, student) => sum + (student.currentRank ?? 1), 0) / students.length
    ).toFixed(1);
  }, [students]);

  useEffect(() => {
    setMoves(getRankMoves());
  }, []);

  const handleSpeed = async (records: SpeedRecord[]) => {
    setSpeeds(records);
    for (const r of records) {
      if (r.window === 30 && r.mode === 'single') {
        const studentRecord = await studentsRepo.get(r.studentId);
        if (!studentRecord) continue;
        const oldBest = studentRecord.best30Single ?? 0;
        if (r.reps > oldBest) {
          const updated: Student = {
            ...studentRecord,
            best30Single: r.reps,
            pointsTotal: (studentRecord.pointsTotal ?? 0) + 5
          };
          const newRank = evalSpeedRank(r.reps);
          if (!updated.currentRank || newRank > updated.currentRank) {
            updated.currentRank = newRank;
          }
          await studentsRepo.upsert(updated);
          setHighlights((prev) => Array.from(new Set([...prev, `30s 单摇 PR ${oldBest}→${r.reps}`])));
          setPointDelta((prev) => prev + 5);
          setStudents((prev) =>
            prev.map((stu) => (stu.id === updated.id ? { ...stu, ...updated } : stu))
          );
        }
      }
    }
  };

  const handleFreestyle = async (records: FreestyleChallengeRecord[]) => {
    const prevMap = new Map(freestyle.map((item) => [item.id, item]));
    setFreestyle(records);
    for (const rec of records) {
      if (!rec.passed) continue;
      const previous = prevMap.get(rec.id);
      if (previous?.passed) continue;

      const move = moves.find((m) => m.id === rec.moveId);
      if (!move) continue;

      const studentRecord = await studentsRepo.get(rec.studentId);
      if (!studentRecord) continue;

      const before = studentRecord.currentRank ?? 0;
      const after = move.rank > before ? move.rank : before;

      const updated: Student = {
        ...studentRecord,
        currentRank: after,
        pointsTotal: (studentRecord.pointsTotal ?? 0) + 3
      };
      await studentsRepo.upsert(updated);

      setStudents((prev) => prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)));
      setHighlights((prev) =>
        Array.from(
          new Set([
            ...prev,
            `花样通关：L${move.rank} · ${move.name}` + (after > before ? `（段位↑ 到 L${after}）` : '')
          ])
        )
      );
      setPointDelta((prev) => prev + 3);
    }
  };

  const handleComment = async () => {
    setHighlights((prev) => Array.from(new Set([...prev, '教练评语已同步'])));
  };

  const handleFinish = async () => {
    if (!params.id) return;
    const session: SessionRecord = {
      id: nanoid(),
      classId: params.id,
      date: new Date().toISOString(),
      attendance,
      speed: speeds,
      freestyle,
      notes: [],
      closed: true,
      lessonConsume: 1,
      highlights,
      pointEvents: []
    };
    await sessionsRepo.upsert(session);
    alert('结课成功，战报草稿已生成');
  };

  return (
    <div className="min-h-dvh bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-[1400px] space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RankBadge rank={Number(avgRank) || 1} />
            <h2 className="text-xl font-bold">
              {classEntity?.name ?? '上课面板'} · {new Date().toLocaleDateString('zh-CN')}
            </h2>
          </div>
          <div className="w-80">
            <EnergyBar value={attendance.length * 8} />
          </div>
          <div className="text-xs text-slate-500">快捷键：S / F / N / E</div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <aside className="col-span-12 lg:col-span-3">
            <AttendanceGrid students={students} value={attendance} onChange={setAttendance} />
          </aside>
          <main className="col-span-12 space-y-4 lg:col-span-6">
            <SpeedInput students={students} onSubmit={handleSpeed} />
            <div className="grid gap-4 md:grid-cols-2">
              <HighlightsCard highlights={highlights} />
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-600">积分事件</h3>
                <div className="mt-3 flex items-center gap-2 text-2xl font-black text-brand-secondary">
                  <PointsTicker delta={pointDelta} />
                  <span className="text-sm font-medium text-slate-500">今日累计</span>
                </div>
              </div>
            </div>
          </main>
          <aside className="col-span-12 space-y-4 lg:col-span-3">
            <FreestylePass students={students} moves={moves} onChange={handleFreestyle} />
            <CommentEditor onSubmit={handleComment} />
          </aside>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleFinish}
            className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg"
          >
            结束课程并同步
          </button>
        </div>
      </div>
    </div>
  );
}
