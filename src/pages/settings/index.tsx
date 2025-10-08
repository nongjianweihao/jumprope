import { useState } from 'react';
import { templatesRepo } from '../../store/repositories/templatesRepo';
import { parseTemplates } from '../../utils/csv';
import { nanoid } from '../../utils/id';
import { getLibrary, saveLibrary } from '../../store/publicLibrary';

export default function SettingsIndex() {
  const [json, setJson] = useState('');
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    try {
      const templates = parseTemplates(json).map((template) => ({
        ...template,
        id: template.id ?? nanoid(),
        createdAt: template.createdAt ?? new Date().toISOString()
      }));
      await Promise.all(templates.map((template) => templatesRepo.upsert(template)));
      setMessage(`成功导入 ${templates.length} 个模板`);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const [library, setLibrary] = useState(() => getLibrary());
  const [thresholdsInput, setThresholdsInput] = useState(library.speed_rank_thresholds.join(','));
  const [movesJson, setMovesJson] = useState(JSON.stringify(library.rank_moves, null, 2));
  const [pathJson, setPathJson] = useState(JSON.stringify(library.warrior_path ?? [], null, 2));
  const [pointRulesJson, setPointRulesJson] = useState(JSON.stringify(library.point_rules ?? [], null, 2));
  const [badgesJson, setBadgesJson] = useState(JSON.stringify(library.badges ?? [], null, 2));
  const [libMsg, setLibMsg] = useState('');

  const handleSaveLibrary = () => {
    try {
      const thresholds = thresholdsInput
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n) && n > 0);

      if (!thresholds.length) throw new Error('段位阈值不能为空');

      const moves = JSON.parse(movesJson);
      if (!Array.isArray(moves)) throw new Error('rank_moves 必须是数组');
      for (const m of moves) {
        if (!m?.id || typeof m?.name !== 'string' || typeof m?.rank !== 'number') {
          throw new Error('rank_moves 内每个元素需包含 id(string)/name(string)/rank(number)');
        }
      }

      const warriorPath = JSON.parse(pathJson);
      if (!Array.isArray(warriorPath)) {
        throw new Error('warrior_path 必须是数组');
      }

      const pointRules = JSON.parse(pointRulesJson);
      if (!Array.isArray(pointRules)) {
        throw new Error('point_rules 必须是数组');
      }

      const badges = JSON.parse(badgesJson);
      if (!Array.isArray(badges)) {
        throw new Error('badges 必须是数组');
      }

      const nextLibrary = {
        ...library,
        speed_rank_thresholds: thresholds,
        rank_moves: moves,
        warrior_path: warriorPath,
        point_rules: pointRules,
        badges
      };

      saveLibrary(nextLibrary);
      setLibrary(nextLibrary);
      setThresholdsInput(thresholds.join(','));
      setMovesJson(JSON.stringify(moves, null, 2));
      setPathJson(JSON.stringify(warriorPath, null, 2));
      setPointRulesJson(JSON.stringify(pointRules, null, 2));
      setBadgesJson(JSON.stringify(badges, null, 2));
      setLibMsg('已保存公共库（段位阈值 / 花样库 / 勇士路径 / 积分规则 / 徽章库）。返回上课面板即可使用新配置。');
    } catch (e) {
      setLibMsg((e as Error).message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">系统设置 & 导入导出</h2>
        <p className="text-sm text-slate-500">支持课程模板 JSON 导入、导出备份以及品牌配置。</p>
      </div>

      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-600">导入课程模板 JSON</h3>
        <textarea
          value={json}
          onChange={(event) => setJson(event.target.value)}
          className="h-40 w-full rounded-2xl border border-slate-200 p-3 text-xs"
          placeholder="粘贴模板数组 JSON，支持新增字段 durationMinTotal"
        />
        <button
          type="button"
          onClick={handleImport}
          className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
        >
          导入模板
        </button>
        {message && <div className="text-xs text-brand-success">{message}</div>}
      </section>

      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-600">公共库 · 段位阈值 & 花样库</h3>

        <label className="block text-sm font-medium">
          段位阈值（30s 单摇，逗号分隔）
          <input
            value={thresholdsInput}
            onChange={(e) => setThresholdsInput(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
            placeholder="60,70,80,100,110,120,150,160,170"
          />
        </label>

        <label className="block text-sm font-medium">
          花样库（JSON 数组，含 id / rank / name）
          <textarea
            value={movesJson}
            onChange={(e) => setMovesJson(e.target.value)}
            className="mt-1 h-48 w-full rounded-2xl border border-slate-200 p-3 font-mono text-xs"
            placeholder='[{"id":"move-l4-360","rank":4,"name":"转身360°前后侧甩直摇跳"}]'
          />
        </label>

        <label className="block text-sm font-medium">
          勇士路径（JSON 数组）
          <textarea
            value={pathJson}
            onChange={(e) => setPathJson(e.target.value)}
            className="mt-1 h-48 w-full rounded-2xl border border-slate-200 p-3 font-mono text-xs"
            placeholder='[{"id":"path-1","rank":1,"title":"新手训练营","moveIds":[],"points":50}]'
          />
        </label>

        <label className="block text-sm font-medium">
          积分规则（JSON 数组）
          <textarea
            value={pointRulesJson}
            onChange={(e) => setPointRulesJson(e.target.value)}
            className="mt-1 h-40 w-full rounded-2xl border border-slate-200 p-3 font-mono text-xs"
            placeholder='[{"id":"rule-pr","type":"pr","label":"速度PR","value":5}]'
          />
        </label>

        <label className="block text-sm font-medium">
          徽章库（JSON 数组）
          <textarea
            value={badgesJson}
            onChange={(e) => setBadgesJson(e.target.value)}
            className="mt-1 h-48 w-full rounded-2xl border border-slate-200 p-3 font-mono text-xs"
            placeholder='[{"id":"badge-bronze","name":"青铜勇士","points":30,"icon":"🥉"}]'
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveLibrary}
            className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
          >
            保存公共库
          </button>
          {libMsg && <div className="text-xs text-brand-success">{libMsg}</div>}
        </div>
      </section>
    </div>
  );
}
