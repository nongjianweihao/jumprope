import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { classesRepo } from '../../store/repositories/classesRepo';
import { studentsRepo } from '../../store/repositories/studentsRepo';
import { sessionsRepo } from '../../store/repositories/sessionsRepo';
import type {
  AttendanceItem,
  ClassEntity,
  FreestyleChallengeRecord,
  PointEvent,
  PointEventType,
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
import { addPoints, getBadgeByPoints } from '../../utils/points';
import { getRankMoves } from '../../store/publicLibrary';

type PendingPointEvent = Omit<PointEvent, 'sessionId'>;

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
  const eventsRef = useRef<PendingPointEvent[]>([]);

  const pushHighlight = (message: string) => {
    setHighlights((prev) => (prev.includes(message) ? prev : [...prev, message]));
  };

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

  const awardPoints = async (
    record: Student,
    type: PointEventType,
    options?: { highlight?: string; update?: Partial<Student>; reason?: string }
  ) => {
    const previousPoints = record.pointsTotal ?? 0;
    const updated: Student = { ...record, ...options?.update };
    const nextPoints = addPoints(previousPoints, type);
    const delta = nextPoints - previousPoints;
    updated.pointsTotal = nextPoints;

    const previousBadge = getBadgeByPoints(previousPoints);
    const nextBadge = getBadgeByPoints(nextPoints);
    if (nextBadge && nextBadge.id && nextBadge.id !== previousBadge?.id && nextBadge.name) {
      const badgeSet = new Set(updated.badges ?? record.badges ?? []);
      badgeSet.add(nextBadge.name);
      updated.badges = Array.from(badgeSet);
    }

    await studentsRepo.upsert(updated);
    setStudents((prev) => prev.map((student) => (student.id === updated.id ? { ...student, ...updated } : student)));

    if (options?.highlight) {
      pushHighlight(options.highlight);
    }
    if (nextBadge && nextBadge.id && nextBadge.id !== previousBadge?.id) {
      pushHighlight(`徽章解锁：${nextBadge.name}`);
    }

    if (delta !== 0) {
      setPointDelta((prev) => prev + delta);
    }

    eventsRef.current = [
      ...eventsRef.current,
      {
        id: nanoid(),
        studentId: updated.id,
        type,
        points: delta,
        reason: options?.reason ?? options?.highlight,
        createdAt: new Date().toISOString()
      }
    ];

    return updated;
  };

  const handleSpeed = async (records: SpeedRecord[]) => {
    if (!records.length) return;
    setSpeeds((prev) => [...prev, ...records]);
    for (const record of records) {
      if (record.window !== 30 || record.mode !== 'single') continue;
      const studentRecord = await studentsRepo.get(record.studentId);
      if (!studentRecord) continue;
      const oldBest = studentRecord.best30Single ?? 0;
      if (record.reps <= oldBest) continue;
      const newRank = evalSpeedRank(record.reps);
      const nextRank = Math.max(studentRecord.currentRank ?? 0, newRank);
      await awardPoints(studentRecord, 'pr', {
        highlight: `30s 单摇 PR ${oldBest}→${record.reps}`,
        update: { best30Single: record.reps, currentRank: nextRank },
        reason: '速度 PR'
      });
    }
  };

  const handleFreestyle = async (records: FreestyleChallengeRecord[]) => {
    if (!records.length) return;
    setFreestyle((prev) => {
      const combined = [...prev];
      for (const record of records) {
        if (!combined.some((item) => item.id === record.id)) {
          combined.push(record);
        }
      }
      return combined;
    });

    for (const record of records) {
      if (!record.passed) continue;
      const alreadyPassed = freestyle.some(
        (item) => item.studentId === record.studentId && item.moveId === record.moveId && item.passed
      );
      if (alreadyPassed) continue;

      const move = moves.find((item) => item.id === record.moveId);
      if (!move) continue;
      const studentRecord = await studentsRepo.get(record.studentId);
      if (!studentRecord) continue;

      const beforeRank = studentRecord.currentRank ?? 0;
      const afterRank = move.rank > beforeRank ? move.rank : beforeRank;
      await awardPoints(studentRecord, 'freestyle_pass', {
        highlight: `花样通关：L${move.rank} · ${move.name}${afterRank > beforeRank ? `（段位↑ 到 L${afterRank}）` : ''}`,
        update: { currentRank: afterRank },
        reason: '花样通关'
      });
    }
  };

  const handleComment = async () => {
    pushHighlight('教练评语已同步');
  };

  const handleFinish = async () => {
    if (!params.id) return;
    const sessionId = nanoid();
    const attended = attendance.filter((item) => item.present);

    for (const item of attended) {
      const studentRecord = await studentsRepo.get(item.studentId);
      if (!studentRecord) continue;
      await awardPoints(studentRecord, 'attendance', { reason: '课堂出勤' });
    }

    if (attended.length) {
      pushHighlight(`出勤积分已发放（${attended.length} 人）`);
    }

    const session: SessionRecord = {
      id: sessionId,
      classId: params.id,
      date: new Date().toISOString(),
      attendance,
      speed: speeds,
      freestyle,
      notes: [],
      closed: true,
      lessonConsume: 1,
      highlights,
      pointEvents: eventsRef.current.map((event) => ({ ...event, sessionId }))
    };

    await sessionsRepo.upsert(session);
    eventsRef.current = [];
    setPointDelta(0);
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
            <EnergyBar value={attendance.filter((item) => item.present).length * 10} max={students.length * 10 || 100} />
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
                <h3 className="text-sm font-semibold text-slate-600">成长积分</h3>
                <div className="mt-3 flex items-center gap-2 text-2xl font-black text-brand-secondary">
                  <PointsTicker delta={pointDelta} />
                  <span className="text-sm font-medium text-slate-500">今日累计 GP</span>
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
